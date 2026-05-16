"use client";

import Link from "next/link";

import { api } from "~/trpc/react";

export default function MapaCompradorPage() {
  const { data: tiendas, isLoading } = api.tienda.listMapa.useQuery();

  return (
    <main className="min-h-screen px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Tiendas cerca</h1>
          <p className="text-sm text-emerald-700">Cochabamba · con descuento VIVA</p>
        </div>
        <Link href="/" className="text-sm text-emerald-600 underline">
          Inicio
        </Link>
      </header>

      {isLoading && <p className="text-emerald-700">Cargando mapa…</p>}

      <ul className="space-y-4">
        {tiendas?.map((t) => (
          <li
            key={t.id}
            className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between gap-2">
              <div>
                <h2 className="font-bold text-emerald-950">{t.nombreTienda}</h2>
                <p className="text-sm text-emerald-600">{t.zonaBarrio}</p>
                <p className="mt-1 text-xs text-emerald-500">
                  📍 {t.lat.toFixed(4)}, {t.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1">
              {t.ofertas.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm"
                >
                  <span>{o.nombreProducto}</span>
                  <span className="font-bold text-emerald-800">
                    {String(o.precioDescuento)} Bs
                  </span>
                  <Link
                    href={`/comprador/pagar/${o.id}?tienda=${t.id}`}
                    className="ml-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Comprar
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {!isLoading && tiendas?.length === 0 && (
        <p className="rounded-xl bg-amber-50 p-4 text-amber-900">
          No hay tiendas activas. Ejecuta el seed de la base de datos.
        </p>
      )}
    </main>
  );
}
