"use client";

import Image from "next/image";
import Link from "next/link";

import { ScreenHeader } from "~/components/ui/screen-header";
import { TabPills } from "~/components/ui/tab-pills";
import { IconHeart, IconStore, IconWifi } from "~/components/ui/icons";
import { graphics } from "~/lib/graphics";
import { api } from "~/trpc/react";

export default function PuntosRecompensasPage() {
  const { data: compras } = api.transaccion.misCompras.useQuery();
  const puntosMes =
    compras?.filter((c) => c.puntoOtorgado).length ?? 0;

  return (
    <>
      <ScreenHeader title="Puntos y recompensas" backHref="/comprador/compras" />
      <TabPills
        tabs={[
          { id: "historial", label: "Historial", href: "/comprador/compras" },
          { id: "puntos", label: "Puntos", href: "/comprador/puntos" },
        ]}
        activeId="puntos"
      />

      <div className="bg-viva-soft px-4 py-4">
        <div className="viva-card flex items-center gap-4 rounded-3xl p-5">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Puntos este mes</p>
            <p className="mt-1 text-5xl font-black text-[#007a4d]">{puntosMes}</p>
            <p className="text-sm font-semibold text-[#007a4d]">Puntos generados</p>
          </div>
          <div className="relative h-24 w-24 shrink-0">
            <Image
              src={graphics.meta.insigniaPuntos}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h2 className="mt-8 text-base font-bold text-gray-900">¿Cómo funcionan?</h2>
        <ul className="mt-4 space-y-3">
          <HowRow
            icon={<IconStore size={20} />}
            text="Cada tienda suma 1 punto por mes por cada comprador único."
          />
          <HowRow
            icon={<IconStore size={20} />}
            text="Puedes generar puntos en varias tiendas del barrio."
          />
          <HowRow
            icon={<IconWifi size={20} />}
            text="¡Ayudemos a más caseritas a ganar internet gratis!"
          />
        </ul>

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-viva-soft p-5">
          <div className="relative z-10">
            <h3 className="font-bold text-gray-900">Tu impacto en el barrio</h3>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[#007a4d]">
              Vas por buen camino <IconHeart size={14} />
            </p>
          </div>
          <div className="relative mt-4 h-20 w-full">
            <Image
              src={graphics.decor.elemento}
              alt=""
              fill
              className="object-contain object-bottom opacity-80"
            />
          </div>
        </div>

        <Link
          href="/comprador/compras"
          className="mt-6 block text-center text-sm font-semibold text-[#007a4d]"
        >
          Ver historial de compras
        </Link>
      </div>
    </>
  );
}

function HowRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="viva-card flex items-start gap-3 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-viva-soft">
        {icon}
      </span>
      <p className="text-sm leading-snug text-gray-700">{text}</p>
    </li>
  );
}
