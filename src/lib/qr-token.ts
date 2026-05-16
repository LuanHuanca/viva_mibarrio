import { SignJWT, jwtVerify } from "jose";

import { env } from "~/env";

const encoder = new TextEncoder();

export type QrTokenPayload = {
  tiendaId: string;
  ofertaId?: string;
  nonce: string;
};

export async function createQrToken(
  payload: QrTokenPayload,
  ttlSeconds = env.QR_TTL_SECONDS,
) {
  const secret = encoder.encode(env.QR_SIGNING_SECRET);
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .setIssuedAt()
    .sign(secret);

  return {
    token,
    qrPayload: `viva://pay?token=${token}`,
    expiresAt: new Date(exp * 1000),
  };
}

export async function verifyQrToken(token: string) {
  const secret = encoder.encode(env.QR_SIGNING_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as QrTokenPayload & { exp?: number };
}
