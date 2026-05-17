import { asistenteRouter } from "~/server/api/routers/asistente";
import { authRouter } from "~/server/api/routers/auth";
import { ofertaRouter } from "~/server/api/routers/oferta";
import { tiendaRouter } from "~/server/api/routers/tienda";
import { transaccionRouter } from "~/server/api/routers/transaccion";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  tienda: tiendaRouter,
  oferta: ofertaRouter,
  transaccion: transaccionRouter,
  asistente: asistenteRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
