import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getCicloId } from "~/lib/ciclo";
import { env } from "~/env";
import {
  caseritaProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const tiendaRouter = createTRPCRouter({
  /** Tiendas visibles en el mapa (comprador). */
  listMapa: publicProcedure
    .input(
      z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx }) => {
      const tiendas = await ctx.db.kioskoTienda.findMany({
        where: { pasarelaActiva: true },
        include: {
          ofertas: {
            where: { activa: true },
            take: 3,
          },
        },
        orderBy: { nombreTienda: "asc" },
      });

      return tiendas.map((t) => ({
        id: t.id,
        nombreTienda: t.nombreTienda,
        lat: t.lat,
        lng: t.lng,
        zonaBarrio: t.zonaBarrio,
        whatsappDuenia: t.whatsappDuenia,
        ofertas: t.ofertas.map((o) => ({
          id: o.id,
          nombreProducto: o.nombreProducto,
          precioOriginal: o.precioOriginal,
          precioDescuento: o.precioDescuento,
        })),
      }));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tienda = await ctx.db.kioskoTienda.findUnique({
        where: { id: input.id },
        include: { ofertas: { where: { activa: true } } },
      });
      if (!tienda) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tienda no encontrada" });
      }
      return tienda;
    }),

  /** Onboarding caserita. */
  create: caseritaProcedure
    .input(
      z.object({
        nombreTienda: z.string().min(2),
        zonaBarrio: z.string().min(2),
        lat: z.number(),
        lng: z.number(),
        whatsappDuenia: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.kioskoTienda.findFirst({
        where: { ownerId: ctx.session.user.id },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya tienes una tienda registrada",
        });
      }

      const cicloId = getCicloId();

      return ctx.db.kioskoTienda.create({
        data: {
          nombreTienda: input.nombreTienda,
          zonaBarrio: input.zonaBarrio,
          lat: input.lat,
          lng: input.lng,
          whatsappDuenia: input.whatsappDuenia,
          cicloId,
          metaUsuarios: env.META_USUARIOS_DEFAULT,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  /** Progreso meta WiFi (dashboard caserita). Null si aún no hay tienda. */
  progreso: caseritaProcedure.query(async ({ ctx }) => {
    const tienda = await ctx.db.kioskoTienda.findUnique({
      where: { ownerId: ctx.session.user.id },
    });
    if (!tienda) return null;

    const porcentaje = Math.min(
      100,
      Math.round((tienda.clientesAtendidosCiclo / tienda.metaUsuarios) * 100),
    );

    return {
      cicloId: tienda.cicloId,
      clientesAtendidosCiclo: tienda.clientesAtendidosCiclo,
      metaUsuarios: tienda.metaUsuarios,
      metaInternetAlcanzada: tienda.metaInternetAlcanzada,
      porcentaje,
      faltan: Math.max(0, tienda.metaUsuarios - tienda.clientesAtendidosCiclo),
    };
  }),

  mine: caseritaProcedure.query(async ({ ctx }) => {
    return ctx.db.kioskoTienda.findUnique({
      where: { ownerId: ctx.session.user.id },
      include: { ofertas: true },
    });
  }),
});
