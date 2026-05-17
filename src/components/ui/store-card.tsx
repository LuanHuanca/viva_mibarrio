import Link from "next/link";

import { ProductImage } from "~/components/ui/product-image";
import { WhatsAppButton } from "~/components/ui/whatsapp-button";

type OfertaMini = {
  id: string;
  nombreProducto: string;
  precioOriginal: unknown;
  precioDescuento: unknown;
};

export function StoreListCard({
  tiendaId,
  nombreTienda,
  zonaBarrio,
  distancia,
  whatsapp,
  oferta,
}: {
  tiendaId: string;
  nombreTienda: string;
  zonaBarrio: string;
  distancia?: string;
  whatsapp?: string | null;
  oferta: OfertaMini;
}) {
  return (
    <article className="viva-card p-3">
      <div className="flex gap-3">
        <Link href={`/comprador/tienda/${tiendaId}`} className="shrink-0">
          <ProductImage
            nombre={oferta.nombreProducto}
            size="xl"
            fillFrame
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/comprador/tienda/${tiendaId}`}
              className="font-bold text-gray-900 hover:text-[#007a4d]"
            >
              {nombreTienda}
            </Link>
            {whatsapp && <WhatsAppButton phone={whatsapp} />}
          </div>
          <p className="text-xs text-gray-500">
            {zonaBarrio}
            {distancia ? ` · ${distancia}` : ""}
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-800">
            {oferta.nombreProducto}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm">
              <span className="text-gray-400 line-through">
                {String(oferta.precioOriginal)} Bs
              </span>{" "}
              <span className="font-bold text-[#007a4d]">
                {String(oferta.precioDescuento)} Bs
              </span>
            </p>
            <Link
              href={`/comprador/pagar/${oferta.id}?tienda=${tiendaId}`}
              className="shrink-0 rounded-xl bg-[#007a4d] px-4 py-2 text-xs font-bold text-white"
            >
              Comprar
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
