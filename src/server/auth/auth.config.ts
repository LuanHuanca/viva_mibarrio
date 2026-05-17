import { type DefaultSession, type NextAuthConfig } from "next-auth";

import type { UserRole } from "~/server/auth/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      tiendaId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    tiendaId?: string | null;
  }
}

/**
 * Configuración compatible con Edge (middleware).
 * Sin Prisma, sin bcrypt ni providers con authorize.
 */
export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.tiendaId = user.tiendaId ?? null;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub ?? "",
        role: (token.role as UserRole) ?? "COMPRADOR",
        tiendaId: (token.tiendaId as string | null) ?? null,
      },
    }),
  },
  trustHost: true,
} satisfies NextAuthConfig;
