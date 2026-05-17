import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PrismaClient } from "../../../../generated/prisma";
import { env } from "~/env";
import {
  buildReporteWhatsApp,
  responderPregunta,
  waMeLink,
  type ResumenTienda,
} from "~/lib/whatsapp-asistente";
import { caseritaProcedure, createTRPCRouter } from "~/server/api/trpc";

async function getResumen(
  db: PrismaClient,
  ownerId: string,
): Promise<ResumenTienda> {
  const tienda = await db.kioskoTienda.findFirst({
    where: { ownerId },
  });
  if (!tienda) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Registra tu tienda para usar el asistente",
    });
  }

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const [ventasCiclo, ventasHoy] = await Promise.all([
    db.cuponTransaccion.count({
      where: { tiendaId: tienda.id, cicloId: tienda.cicloId, estado: "COMPLETADO" },
    }),
    db.cuponTransaccion.count({
      where: {
        tiendaId: tienda.id,
        estado: "COMPLETADO",
        fechaRegistro: { gte: inicioHoy },
      },
    }),
  ]);

  const faltan = Math.max(0, tienda.metaUsuarios - tienda.clientesAtendidosCiclo);

  return {
    nombreTienda: tienda.nombreTienda,
    cicloId: tienda.cicloId,
    clientesAtendidos: tienda.clientesAtendidosCiclo,
    metaUsuarios: tienda.metaUsuarios,
    faltan,
    metaAlcanzada: tienda.metaInternetAlcanzada,
    ventasCiclo,
    ventasHoy,
  };
}

export const asistenteRouter = createTRPCRouter({
  resumen: caseritaProcedure.query(async ({ ctx }) => {
    return getResumen(ctx.db, ctx.session.user.id);
  }),

  responder: caseritaProcedure
    .input(z.object({ pregunta: z.string().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const resumen = await getResumen(ctx.db, ctx.session.user.id);
      return {
        respuesta: responderPregunta(input.pregunta, resumen),
      };
    }),

  /** Enlace wa.me con reporte prellenado al número del asistente VIVA */
  linkReporte: caseritaProcedure.query(async ({ ctx }) => {
    const resumen = await getResumen(ctx.db, ctx.session.user.id);
    const texto = buildReporteWhatsApp(resumen);
    const phone = env.WHATSAPP_ASISTENTE_PHONE;
    if (!phone) {
      return { url: null as string | null, mensaje: texto };
    }
    return { url: waMeLink(phone, texto), mensaje: texto };
  }),

  /** Enlace para que la caserita reciba el reporte en su propio WhatsApp (autorización manual) */
  linkAutorizarEnMiWhatsApp: caseritaProcedure.query(async ({ ctx }) => {
    const tienda = await ctx.db.kioskoTienda.findFirst({
      where: { ownerId: ctx.session.user.id },
    });
    if (!tienda?.whatsappDuenia) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Agrega tu WhatsApp en Editar tienda",
      });
    }
    const resumen = await getResumen(ctx.db, ctx.session.user.id);
    const texto = [
      buildReporteWhatsApp(resumen),
      "",
      "✅ Autorizo recibir reportes de ventas y meta de VIVA Barrio en este número.",
    ].join("\n");
    return { url: waMeLink(tienda.whatsappDuenia, texto) };
  }),
});
