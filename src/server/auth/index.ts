import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "~/server/auth/auth.config";
import { getAuthProviders } from "~/server/auth/providers";
import { db } from "~/server/db";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: getAuthProviders(),
  callbacks: {
    ...authConfig.callbacks,
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.tiendaId = user.tiendaId ?? null;
      }
      if (token.sub && token.role === "CASERITA") {
        const tienda = await db.kioskoTienda.findUnique({
          where: { ownerId: token.sub },
          select: { id: true },
        });
        token.tiendaId = tienda?.id ?? null;
      }
      return token;
    },
  },
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
