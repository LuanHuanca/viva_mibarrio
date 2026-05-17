"use client";

import { useMemo } from "react";

import { ProductImage } from "~/components/ui/product-image";
import { ScreenHeader } from "~/components/ui/screen-header";
import { TabPills } from "~/components/ui/tab-pills";
import { EmptyState } from "~/components/ui/empty-state";
import { IconCheckCircle, IconXCircle } from "~/components/ui/icons";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

function formatFecha(d: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function CompradorComprasPage() {
  const { data: compras, isLoading } = api.transaccion.misCompras.useQuery();

  const porMes = useMemo(() => {
    if (!compras) return [];
    const map = new Map<string, typeof compras>();
    for (const c of compras) {
      const d = new Date(c.fechaRegistro);
      const key = new Intl.DateTimeFormat("es-BO", {
        month: "long",
        year: "numeric",
      }).format(d);
      const list = map.get(key) ?? [];
      list.push(c);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [compras]);

  return (
    <>
      <ScreenHeader title="Mis compras" backHref="/comprador/mapa" />
      <TabPills
        tabs={[
          { id: "historial", label: "Historial", href: "/comprador/compras" },
          { id: "puntos", label: "Puntos", href: "/comprador/puntos" },
        ]}
        activeId="historial"
      />
      <p className="bg-viva-soft px-4 py-3 text-center text-sm text-gray-500">
        Aquí puedes ver tus compras y los puntos que has generado.
      </p>

      <div className="bg-viva-soft px-4 pb-4">
        {isLoading ?
          <p className="text-center text-gray-500">Cargando…</p>
        : compras && compras.length > 0 ?
          porMes.map(([mes, items]) => (
            <section key={mes} className="mb-6">
              <h2 className="mb-3 text-sm font-bold capitalize text-gray-800">
                {mes}
              </h2>
              <ul className="space-y-3">
                {items.map((c) => (
                  <li
                    key={c.id}
                    className="viva-card flex gap-3 p-3"
                  >
                    <ProductImage
                      nombre={c.oferta?.nombreProducto ?? "Producto"}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">
                        {c.tienda.nombreTienda}
                      </p>
                      <p className="text-sm text-gray-600">
                        {c.oferta?.nombreProducto ?? "Compra"}
                      </p>
                      <p className="mt-1 text-base font-bold text-[#007a4d]">
                        {String(c.oferta?.precioDescuento ?? "—")} Bs
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between">
                      {c.puntoOtorgado ?
                        <>
                          <IconCheckCircle size={22} />
                          <p className="mt-1 text-right text-xs font-medium text-[#007a4d]">
                            Sumó 1 punto
                          </p>
                        </>
                      : <>
                          <IconXCircle size={22} />
                          <p className="mt-1 max-w-[7rem] text-right text-[10px] leading-tight text-gray-500">
                            Ya habías sumado 1 punto este mes
                          </p>
                        </>
                      }
                      <p className="mt-1 text-[10px] text-gray-400">
                        {formatFecha(new Date(c.fechaRegistro))}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        : <EmptyState
            imageSrc={graphics.empty.sinCompras}
            title="Sin compras aún"
            description="Explora el mapa, elige una oferta y paga con QR."
          />
        }
      </div>
    </>
  );
}
