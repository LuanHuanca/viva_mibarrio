"use client";

import Link from "next/link";

import { EmptyState } from "~/components/ui/empty-state";
import { ProductImage } from "~/components/ui/product-image";
import { ScreenHeader } from "~/components/ui/screen-header";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

export default function CompradorOfertasPage() {
  const { data: tiendas, isLoading } = api.tienda.listMapa.useQuery();

  const ofertas =
    tiendas?.flatMap((t) =>
      t.ofertas.map((o) => ({
        ...o,
        tiendaId: t.id,
        tiendaNombre: t.nombreTienda,
      })),
    ) ?? [];

  return (
    <>
      <ScreenHeader title="Ofertas cerca" backHref="/comprador/mapa" />
      <div className="bg-viva-soft px-4 py-4">
        {isLoading ?
          <p className="text-center text-gray-500">Cargando…</p>
        : ofertas.length > 0 ?
          <ul className="space-y-3">
            {ofertas.map((o) => (
              <li
                key={o.id}
                className="viva-card flex items-center gap-3 p-3"
              >
                <ProductImage nombre={o.nombreProducto} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900">{o.nombreProducto}</p>
                  <p className="text-sm text-gray-500">{o.tiendaNombre}</p>
                  <p className="text-lg font-bold text-[#007a4d]">
                    {String(o.precioDescuento)} Bs
                  </p>
                </div>
                <Link
                  href={`/comprador/pagar/${o.id}?tienda=${o.tiendaId}`}
                  className="shrink-0 rounded-lg bg-[#007a4d] px-4 py-2 text-sm font-bold text-white"
                >
                  Comprar
                </Link>
              </li>
            ))}
          </ul>
        : <EmptyState
            imageSrc={graphics.empty.sinOfertas}
            title="No hay ofertas activas"
            description="Cuando las caseritas publiquen descuentos, aparecerán aquí."
          />}
      </div>
    </>
  );
}
