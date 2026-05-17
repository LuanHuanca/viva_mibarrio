import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "~/server/auth/auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/", "/login", "/registro"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/api/whatsapp");

  if (isPublic) return NextResponse.next();

  if (!session?.user) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = session.user.role;

  if (pathname.startsWith("/comprador") && role !== "COMPRADOR") {
    return NextResponse.redirect(new URL("/caserita/dashboard", req.url));
  }

  if (pathname.startsWith("/caserita") && role !== "CASERITA") {
    return NextResponse.redirect(new URL("/comprador/mapa", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
