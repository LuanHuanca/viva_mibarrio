import Link from "next/link";

import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-emerald-200 bg-white/90 p-10 shadow-xl shadow-emerald-100/50">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          VIVA App · Módulo Barrio
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-emerald-950">
          VIVA Barrio
        </h1>
        <p className="mt-4 text-emerald-800">
          Compra en tu kiosko de confianza con descuento, apoya a la caserita y
          ayúdala a ganar su internet gratis.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {session ? (
            <>
              <p className="text-sm text-emerald-700">
                Hola, {session.user.name ?? session.user.email}
              </p>
              <Link
                href={
                  session.user.role === "CASERITA"
                    ? "/caserita/dashboard"
                    : "/comprador/mapa"
                }
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
              >
                Ir a mi panel
              </Link>
              <Link
                href="/api/auth/signout"
                className="rounded-xl border border-emerald-300 px-6 py-3 text-center text-emerald-800"
              >
                Cerrar sesión
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-xl border border-emerald-400 px-6 py-3 text-center font-semibold text-emerald-800"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">Comprador</p>
            <p className="mt-1 text-emerald-700">Mapa, ofertas y pago con QR</p>
          </div>
          <div className="rounded-xl bg-teal-50 p-4">
            <p className="font-bold text-teal-900">Caserita</p>
            <p className="mt-1 text-teal-700">Cobros, meta WiFi y reportes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
