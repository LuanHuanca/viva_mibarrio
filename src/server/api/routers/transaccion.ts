import { randomUUID } from "crypto";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getCicloId } from "~/lib/ciclo";
import { createQrToken, verifyQrToken } from "~/lib/qr-token";
import {
  caseritaProcedure,
  compradorProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";

export const transaccionRouter = createTRPCRouter({
  /** QR dinámico — refresco cada 10s (caserita). */
  qrToken: caseritaProcedure
    .input(z.object({ ofertaId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const tienda = await ctx.db.kioskoTienda.findFirst({
        where: { ownerId: ctx.session.user.id },
      });
      if (!tienda) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Registra tu tienda primero",
        });
      }

      return createQrToken({
        tiendaId: tienda.id,
        ofertaId: input?.ofertaId,
        nonce: randomUUID(),
      });
    }),

  /** Validar escaneo (comprador) — antifraude 1 usuario = 1 punto/ciclo. */
  validar: compradorProcedure
    .input(
      z.object({
        token: z.string().min(10),
        ofertaId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let payload;
      try {
        payload = await verifyQrToken(input.token);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "QR expirado o inválido. Pide uno nuevo a la caserita.",
        });
      }

      const tienda = await ctx.db.kioskoTienda.findUnique({
        where: { id: payload.tiendaId },
      });
      if (!tienda) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tienda no encontrada" });
      }

      const nonceUsado = await ctx.db.qrNonceUsado.findUnique({
        where: { nonce: payload.nonce },
      });
      if (nonceUsado) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este QR ya fue utilizado",
        });
      }

      const cicloId = tienda.cicloId;
      const usuarioId = ctx.session.user.id;
      const ofertaId = input.ofertaId ?? payload.ofertaId;

      const yaSumoPunto = await ctx.db.cuponTransaccion.findFirst({
        where: {
          tiendaId: tienda.id,
          cicloId,
          usuarioId,
          puntoOtorgado: true,
          estado: "COMPLETADO",
        },
      });

      const puntoOtorgado = !yaSumoPunto;

      const cupon = await ctx.db.$transaction(async (tx) => {
        await tx.qrNonceUsado.create({
          data: {
            nonce: payload.nonce,
            expiresAt: new Date(Date.now() + 60_000),
          },
        });

        const created = await tx.cuponTransaccion.create({
          data: {
            tiendaId: tienda.id,
            usuarioId,
            ofertaId: ofertaId ?? null,
            cicloId,
            estado: "COMPLETADO",
            puntoOtorgado,
            qrNonce: payload.nonce,
          },
        });

        if (puntoOtorgado) {
          const updated = await tx.kioskoTienda.update({
            where: { id: tienda.id },
            data: {
              clientesAtendidosCiclo: { increment: 1 },
            },
          });

          if (
            !updated.metaInternetAlcanzada &&
            updated.clientesAtendidosCiclo >= updated.metaUsuarios
          ) {
            await tx.kioskoTienda.update({
              where: { id: tienda.id },
              data: { metaInternetAlcanzada: true },
            });
          }
        }

        return created;
      });

      const progreso = await ctx.db.kioskoTienda.findUnique({
        where: { id: tienda.id },
      });

      return {
        id_cupon: cupon.id,
        estado: cupon.estado,
        punto_otorgado: puntoOtorgado,
        mensaje: puntoOtorgado
          ? "¡Compra registrada! Sumaste a la meta de la tienda."
          : "Compra registrada. Ya habías sumado a esta tienda este mes.",
        progreso: {
          clientes_atendidos_ciclo: progreso?.clientesAtendidosCiclo ?? 0,
          meta_usuarios: progreso?.metaUsuarios ?? 30,
          meta_internet_alcanzada: progreso?.metaInternetAlcanzada ?? false,
        },
      };
    }),

  misCompras: compradorProcedure.query(async ({ ctx }) => {
    return ctx.db.cuponTransaccion.findMany({
      where: { usuarioId: ctx.session.user.id },
      include: {
        tienda: { select: { nombreTienda: true, zonaBarrio: true } },
        oferta: { select: { nombreProducto: true, precioDescuento: true } },
      },
      orderBy: { fechaRegistro: "desc" },
      take: 50,
    });
  }),

  misVentas: caseritaProcedure.query(async ({ ctx }) => {
    const tienda = await ctx.db.kioskoTienda.findFirst({
      where: { ownerId: ctx.session.user.id },
    });
    if (!tienda) return [];

    return ctx.db.cuponTransaccion.findMany({
      where: { tiendaId: tienda.id },
      include: {
        usuario: { select: { name: true, email: true } },
        oferta: {
          select: { nombreProducto: true, precioDescuento: true },
        },
      },
      orderBy: { fechaRegistro: "desc" },
      take: 50,
    });
  }),

  ciclo: caseritaProcedure.query(async ({ ctx }) => {
    const tienda = await ctx.db.kioskoTienda.findFirst({
      where: { ownerId: ctx.session.user.id },
    });
    if (!tienda) return null;

    return {
      ciclo_id: tienda.cicloId,
      clientes_atendidos_ciclo: tienda.clientesAtendidosCiclo,
      meta_usuarios: tienda.metaUsuarios,
      meta_internet_alcanzada: tienda.metaInternetAlcanzada,
    };
  }),
});
