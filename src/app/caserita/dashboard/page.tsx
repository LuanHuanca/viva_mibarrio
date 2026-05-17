"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import Image from "next/image";

import { ProgressBar } from "~/components/progress-bar";
import { AppHeader } from "~/components/ui/app-header";
import { ProductImage } from "~/components/ui/product-image";
import { ButtonLink } from "~/components/ui/button";
import { IconEdit, IconQrScan, IconWifi } from "~/components/ui/icons";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

export default function DashboardCaseritaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: tienda, isLoading } = api.tienda.mine.useQuery();

  useEffect(() => {
    if (!isLoading && tienda === null) {
      router.replace("/caserita/onboarding");
    }
  }, [isLoading, tienda, router]);

  if (isLoading || !tienda) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#007a4d]">
        Cargando…
      </div>
    );
  }

  const faltan = Math.max(0, tienda.metaUsuarios - tienda.clientesAtendidosCiclo);
  const nombre = session?.user?.name?.split(" ")[0] ?? "Caserita";
  const cicloLabel = formatCiclo(tienda.cicloId);
  return (
    <div className="bg-viva-soft pb-6">
      <AppHeader
        title={tienda.nombreTienda}
        subtitle={`¡Hola, ${nombre}! · ${tienda.zonaBarrio}`}
        role="CASERITA"
      />

      <section className="relative z-10 mx-4 mt-4 overflow-hidden rounded-2xl bg-white p-5 shadow-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden
        >
          <Image
            src={graphics.meta.fondoPuntos}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm font-medium text-gray-600">
          Meta del mes: {cicloLabel}
        </p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-[#007a4d]">
              {tienda.clientesAtendidosCiclo}
              <span className="text-xl font-bold text-gray-400">
                {" "}
                / {tienda.metaUsuarios}
              </span>
            </p>
            <p className="text-xs text-gray-500">vecinos únicos</p>
          </div>
          <IconWifi size={28} className="text-[#007a4d]" />
        </div>
        <div className="mt-3">
          <ProgressBar
            actual={tienda.clientesAtendidosCiclo}
            meta={tienda.metaUsuarios}
          />
        </div>
        {faltan > 0 ?
          <p className="mt-3 text-center text-sm text-gray-700">
            Faltan <strong>{faltan} vecinos</strong> para ganar{" "}
            <strong>internet gratis en casa</strong>
          </p>
        : <Link
            href="/caserita/meta"
            className="mt-3 block text-center text-sm font-bold text-[#007a4d]"
          >
            ¡Meta alcanzada! Ver premio →
          </Link>
        }
      </section>

      <div className="mt-6 space-y-3 px-4">
        <ButtonLink href="/caserita/cobrar" fullWidth className="!flex items-center justify-center gap-2">
          <IconQrScan size={20} /> Cobrar ahora (QR dinámico)
        </ButtonLink>
        <ButtonLink
          href="/caserita/asistente"
          variant="secondary"
          fullWidth
          className="!flex items-center justify-center gap-2 border-[#25D366] text-[#128C7E]"
        >
          Asistente WhatsApp
        </ButtonLink>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/caserita/ofertas/nueva"
            className="rounded-xl border-2 border-[#007a4d] bg-white py-3 text-center text-sm font-bold text-[#007a4d]"
          >
            Agregar oferta
          </Link>
          <Link
            href="/caserita/onboarding"
            className="flex items-center justify-center gap-1 rounded-xl border-2 border-[#007a4d] bg-white py-3 text-center text-sm font-bold text-[#007a4d]"
          >
            <IconEdit size={16} /> Editar tienda
          </Link>
        </div>
      </div>

      {tienda.ofertas.length > 0 && (
        <section className="mt-8 px-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Ofertas activas</h3>
            <Link href="/caserita/ofertas" className="text-sm font-medium text-[#007a4d]">
              Ver todas
            </Link>
          </div>
          <ul className="space-y-3">
            {tienda.ofertas.slice(0, 3).map((o) => (
              <li
                key={o.id}
                className="viva-card flex items-center gap-3 p-3"
              >
                <ProductImage nombre={o.nombreProducto} size="md" />
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
                  <p className="text-right text-xs text-gray-400">Stock: {o.stock}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function formatCiclo(cicloId: string): string {
  const [y, m] = cicloId.split("-");
  if (!y || !m) return cicloId;
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const idx = parseInt(m, 10) - 1;
  return `${meses[idx] ?? m} ${y}`;
}
