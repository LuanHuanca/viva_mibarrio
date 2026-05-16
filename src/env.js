import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_DISCORD_ID: z.string().optional(),
    AUTH_DISCORD_SECRET: z.string().optional(),
    DATABASE_URL: z.string().url(),
    QR_SIGNING_SECRET: z.string().min(16),
    META_USUARIOS_DEFAULT: z.coerce.number().default(30),
    QR_TTL_SECONDS: z.coerce.number().default(10),
    AD_MIN_SECONDS: z.coerce.number().default(5),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_META_USUARIOS: z.coerce.number().default(30),
    NEXT_PUBLIC_AD_MIN_SECONDS: z.coerce.number().default(5),
    NEXT_PUBLIC_MAP_CENTER_LAT: z.coerce.number().default(-17.3895),
    NEXT_PUBLIC_MAP_CENTER_LNG: z.coerce.number().default(-66.1568),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    QR_SIGNING_SECRET: process.env.QR_SIGNING_SECRET,
    META_USUARIOS_DEFAULT: process.env.META_USUARIOS_DEFAULT,
    QR_TTL_SECONDS: process.env.QR_TTL_SECONDS,
    AD_MIN_SECONDS: process.env.AD_MIN_SECONDS,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_META_USUARIOS: process.env.META_USUARIOS_DEFAULT,
    NEXT_PUBLIC_AD_MIN_SECONDS: process.env.AD_MIN_SECONDS,
    NEXT_PUBLIC_MAP_CENTER_LAT: process.env.NEXT_PUBLIC_MAP_CENTER_LAT,
    NEXT_PUBLIC_MAP_CENTER_LNG: process.env.NEXT_PUBLIC_MAP_CENTER_LNG,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
