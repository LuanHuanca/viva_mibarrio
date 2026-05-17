import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const rolRegistroSchema = z.enum(["COMPRADOR", "CASERITA"]);

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: rolRegistroSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email ya está registrado",
        });
      }

      const passwordHash = await hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
        },
        select: { id: true, email: true, role: true },
      });
    }),

  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.session.user.id,
    name: ctx.session.user.name,
    email: ctx.session.user.email,
    role: ctx.session.user.role,
    tiendaId: ctx.session.user.tiendaId,
  })),
});
