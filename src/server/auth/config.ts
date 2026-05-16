import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { z } from "zod";

import { env } from "~/env";
import { db } from "~/server/db";
import { type UserRole } from "../../../generated/prisma";

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

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole;
    tiendaId?: string | null;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          include: { tienda: { select: { id: true } } },
        });

        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          tiendaId: user.tienda?.id ?? null,
        };
      },
    }),
    ...(env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET
      ? [
          DiscordProvider({
            clientId: env.AUTH_DISCORD_ID,
            clientSecret: env.AUTH_DISCORD_SECRET,
          }),
        ]
      : []),
  ],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
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
} satisfies NextAuthConfig;
