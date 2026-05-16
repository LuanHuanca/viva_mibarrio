"use client";

import Link from "next/link";

import { ProgressBar } from "~/components/progress-bar";
import { api } from "~/trpc/react";

export default function DashboardCaseritaPage() {
  const { data: progreso, isLoading } = api.tienda.progreso.useQuery();
  const { data: tienda } = api.tienda.mine.useQuery();

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">
            {tienda?.nombreTienda ?? "Mi tienda"}
          </h1>
          <p className="text-sm text-emerald-600">{tienda?.zonaBarrio}</p>
        </div>
        <Link href="/" className="text-sm underline">
          Inicio
        </Link>
      </header>

      <section className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6">
        <h2 className="font-semibold text-emerald-900">Meta internet gratis</h2>
        {isLoading || !progreso ?
          <p className="mt-4 text-sm">Cargando progreso…</p>
        : <>
            <ProgressBar
              actual={progreso.clientesAtendidosCiclo}
              meta={progreso.metaUsuarios}
              label={`Ciclo ${progreso.cicloId}`}
            />
            {progreso.metaInternetAlcanzada && (
              <p className="mt-4 rounded-lg bg-teal-100 p-3 text-center font-bold text-teal-900">
                ¡Meta alcanzada! Beneficio WiFi activado
              </p>
            )}
          </>
        }
      </section>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/caserita/cobrar"
          className="rounded-xl bg-emerald-600 py-4 text-center font-bold text-white"
        >
          Cobrar ahora (QR dinámico)
        </Link>
        <Link
          href="/caserita/onboarding"
          className="rounded-xl border border-emerald-300 py-3 text-center text-emerald-800"
        >
          Editar tienda
        </Link>
      </div>

      {tienda?.ofertas && tienda.ofertas.length > 0 && (
        <section className="mt-8">
          <h3 className="font-semibold text-emerald-900">Ofertas activas</h3>
          <ul className="mt-3 space-y-2">
            {tienda.ofertas.map((o) => (
              <li
                key={o.id}
                className="flex justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm"
              >
                <span>{o.nombreProducto}</span>
                <span>
                  {String(o.precioDescuento)} Bs
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
