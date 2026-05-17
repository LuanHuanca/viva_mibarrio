"use client";

import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "~/components/ui/empty-state";
import { ProductImage } from "~/components/ui/product-image";
import { ScreenHeader } from "~/components/ui/screen-header";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

export default function CaseritaOfertasPage() {
  const [tab, setTab] = useState<"activas" | "inactivas">("activas");
  const { data: ofertas, isLoading } = api.oferta.listByTienda.useQuery();

  const filtered =
    ofertas?.filter((o) => (tab === "activas" ? o.activa : !o.activa)) ?? [];

  return (
    <>
      <ScreenHeader title="Mis ofertas" backHref="/caserita/dashboard" />

      <div className="flex border-b border-gray-100 bg-white">
        {(["activas", "inactivas"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-bold capitalize ${
              tab === t ?
                "border-b-2 border-[#007a4d] text-[#007a4d]"
              : "text-gray-400"
            }`}
          >
            {t === "activas" ? "Activas" : "Inactivas"}
          </button>
        ))}
      </div>

      <div className="bg-viva-soft px-4 py-4">
        {isLoading ?
          <p className="text-center text-gray-500">Cargando…</p>
        : filtered.length > 0 ?
          <ul className="space-y-3">
            {filtered.map((o) => (
              <li
                key={o.id}
                className="viva-card flex gap-3 p-3"
              >
                <ProductImage nombre={o.nombreProducto} size="lg" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/caserita/ofertas/${o.id}/editar`}
                    className="font-bold text-gray-900 hover:text-[#007a4d]"
                  >
                    {o.nombreProducto}
                  </Link>
                  <p className="text-sm text-gray-400 line-through">
                    {String(o.precioOriginal)} Bs
                  </p>
                  <p className="text-lg font-bold text-[#007a4d]">
                    {String(o.precioDescuento)} Bs
                  </p>
                  <p className="text-xs text-gray-500">Stock: {o.stock}</p>
                </div>
                <label className="flex shrink-0 items-center">
                  <input
                    type="checkbox"
                    checked={o.activa}
                    readOnly
                    className="h-6 w-11 appearance-none rounded-full bg-gray-200 checked:bg-[#007a4d]"
                  />
                </label>
              </li>
            ))}
          </ul>
        : <EmptyState
            imageSrc={graphics.empty.sinOfertas}
            title="Aún no tienes ofertas"
            description="Publica tu primer producto con descuento."
          />
        }

        <Link
          href="/caserita/ofertas/nueva"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#007a4d] py-3.5 text-sm font-bold text-white"
        >
          + Agregar nueva oferta
        </Link>
      </div>
    </>
  );
}
