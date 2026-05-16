import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { caseritaProcedure, createTRPCRouter } from "~/server/api/trpc";

export const ofertaRouter = createTRPCRouter({
  create: caseritaProcedure
    .input(
      z.object({
        nombreProducto: z.string().min(1),
        precioOriginal: z.number().positive(),
        precioDescuento: z.number().positive(),
        stock: z.number().int().nonnegative().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tienda = await ctx.db.kioskoTienda.findFirst({
        where: { ownerId: ctx.session.user.id },
      });
      if (!tienda) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Registra tu tienda primero",
        });
      }

      return ctx.db.productoOferta.create({
        data: {
          tiendaId: tienda.id,
          nombreProducto: input.nombreProducto,
          precioOriginal: input.precioOriginal,
          precioDescuento: input.precioDescuento,
          stock: input.stock,
        },
      });
    }),

  listByTienda: caseritaProcedure.query(async ({ ctx }) => {
    const tienda = await ctx.db.kioskoTienda.findFirst({
      where: { ownerId: ctx.session.user.id },
    });
    if (!tienda) return [];

    return ctx.db.productoOferta.findMany({
      where: { tiendaId: tienda.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
