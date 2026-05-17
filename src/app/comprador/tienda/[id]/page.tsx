"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { EmptyState } from "~/components/ui/empty-state";
import { IconBack, IconCheckCircle } from "~/components/ui/icons";
import { ProductImage } from "~/components/ui/product-image";
import { WhatsAppButton } from "~/components/ui/whatsapp-button";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

const TIENDA_HERO = "/login_background.png";

export default function TiendaDetallePage() {
  const params = useParams<{ id: string }>();
  const { data: tienda, isLoading } = api.tienda.getById.useQuery({
    id: params.id,
  });

  if (isLoading) {
    return <div className="p-6 text-[#007a4d]">Cargando tienda…</div>;
  }

  if (!tienda) {
    return <div className="p-6 text-red-600">Tienda no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-viva-soft pb-8">
      <div className="relative h-44 w-full overflow-hidden rounded-b-3xl">
        <Image
          src={TIENDA_HERO}
          alt={tienda.nombreTienda}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Link
          href="/comprador/mapa"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
          aria-label="Volver"
        >
          <IconBack className="text-white" />
        </Link>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{tienda.nombreTienda}</h1>
            <p className="text-sm text-gray-500">
              Zona Norte · 0.3 km · {tienda.zonaBarrio}
            </p>
          </div>
          {tienda.whatsappDuenia && (
            <WhatsAppButton phone={tienda.whatsappDuenia} />
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-viva-soft px-4 py-3">
          <IconCheckCircle size={18} />
          <span className="text-sm font-bold text-[#004d2c]">Ofertas disponibles</span>
        </div>

        <ul className="mt-3 space-y-3">
          {tienda.ofertas.map((o) => (
            <li
              key={o.id}
              className="viva-card flex items-center gap-3 p-3"
            >
              <ProductImage nombre={o.nombreProducto} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900">{o.nombreProducto}</p>
                <p className="text-sm">
                  <span className="text-gray-400 line-through">
                    {String(o.precioOriginal)} Bs
                  </span>{" "}
                  <span className="font-bold text-[#007a4d]">
                    {String(o.precioDescuento)} Bs
                  </span>
                </p>
              </div>
              <Link
                href={`/comprador/pagar/${o.id}?tienda=${tienda.id}`}
                className="shrink-0 rounded-xl bg-[#007a4d] px-4 py-2.5 text-sm font-bold text-white"
              >
                Comprar
              </Link>
            </li>
          ))}
        </ul>

        {tienda.ofertas.length === 0 && (
          <EmptyState
            imageSrc={graphics.empty.sinOfertas}
            title="Aún no hay ofertas"
            description="Esta tienda aún no publicó productos con descuento."
          />
        )}
      </div>
    </div>
  );
}
