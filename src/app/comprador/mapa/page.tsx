"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { AppHeader } from "~/components/ui/app-header";
import { EmptyState } from "~/components/ui/empty-state";
import { IconSearch } from "~/components/ui/icons";
import { graphics } from "~/lib/graphics";
import { StoreListCard } from "~/components/ui/store-card";
import { api } from "~/trpc/react";

const MapaLeaflet = dynamic(
  () =>
    import("~/components/comprador/mapa-leaflet").then((m) => m.MapaLeaflet),
  { ssr: false, loading: () => <div className="h-full bg-emerald-50" /> },
);

export default function MapaCompradorPage() {
  const { data: tiendas, isLoading } = api.tienda.listMapa.useQuery();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!tiendas) return [];
    const q = search.toLowerCase();
    if (!q) return tiendas;
    return tiendas.filter(
      (t) =>
        t.nombreTienda.toLowerCase().includes(q) ||
        t.zonaBarrio.toLowerCase().includes(q) ||
        t.ofertas.some((o) => o.nombreProducto.toLowerCase().includes(q)),
    );
  }, [tiendas, search]);

  const listItems = useMemo(() => {
    return filtered.flatMap((t) => {
      const oferta = t.ofertas[0];
      if (!oferta) return [];
      return [{ tienda: t, oferta }];
    });
  }, [filtered]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col bg-viva-soft">
      <AppHeader
        title="Tiendas cerca"
        subtitle="Cochabamba"
        role="COMPRADOR"
      />

      <div className="bg-viva-soft px-4 py-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <IconSearch />
          </span>
          <input
            type="search"
            placeholder="Buscar tiendas o productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-[#007a4d] focus:ring-1 focus:ring-[#007a4d]/30"
          />
        </div>
      </div>

      <div className="relative h-52 shrink-0 border-y border-gray-100">
        {isLoading ?
          <div className="flex h-full items-center justify-center text-[#007a4d]">
            Cargando mapa…
          </div>
        : <MapaLeaflet tiendas={filtered} onSelect={() => undefined} />}
      </div>

      <div className="flex-1 overflow-y-auto bg-viva-soft px-4 pb-4 pt-3">
        <h2 className="mb-3 font-bold text-gray-900">Tiendas cerca de ti</h2>
        {listItems.length > 0 ?
          <ul className="space-y-3">
            {listItems.map(({ tienda, oferta }) => (
              <li key={`${tienda.id}-${oferta.id}`}>
                <StoreListCard
                  tiendaId={tienda.id}
                  nombreTienda={tienda.nombreTienda}
                  zonaBarrio={tienda.zonaBarrio}
                  distancia="0.3 km"
                  whatsapp={tienda.whatsappDuenia}
                  oferta={oferta}
                />
              </li>
            ))}
          </ul>
        : <EmptyState
            imageSrc={graphics.empty.sinTiendas}
            title="No hay tiendas cerca"
            description="Prueba otra búsqueda o vuelve más tarde."
          />}
      </div>
    </div>
  );
}
