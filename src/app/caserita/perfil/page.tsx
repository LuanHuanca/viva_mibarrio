"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import {
  IconBell,
  IconHelp,
  IconLogout,
  IconQrScan,
  IconStore,
  IconUser,
} from "~/components/ui/icons";
import { MenuRow } from "~/components/ui/menu-row";
import { api } from "~/trpc/react";

export default function CaseritaPerfilPage() {
  const { data: session } = useSession();
  const { data: tienda } = api.tienda.mine.useQuery();
  const nombre = session?.user?.name ?? "Caserita";
  const handle = session?.user?.email?.split("@")[0] ?? "caserita";

  return (
    <div className="min-h-full bg-[#e8f5ec] pb-4">
      <header className="rounded-b-3xl bg-[#007a4d] px-5 pb-8 pt-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 bg-white/20">
            <IconStore size={30} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">{nombre}</p>
            <p className="text-sm text-white/80">@{handle}</p>
            <p className="text-sm text-white/70">Caserita</p>
            {tienda && (
              <p className="mt-1 truncate text-xs text-white/60">
                {tienda.nombreTienda} · {tienda.zonaBarrio}
              </p>
            )}
          </div>
          <Link
            href="/caserita/onboarding"
            className="shrink-0 rounded-full border border-white/60 px-4 py-1.5 text-xs font-semibold"
          >
            Editar
          </Link>
        </div>
      </header>

      <nav className="mx-2 -mt-4 rounded-t-3xl bg-white px-3 py-4 shadow-sm">
        <MenuRow
          href="/caserita/onboarding"
          icon={<IconStore size={20} />}
          label="Editar tienda"
        />
        <MenuRow
          href="/caserita/cobrar"
          icon={<IconQrScan size={20} className="text-[#007a4d]" />}
          label="Cobrar ahora (QR)"
        />
        <MenuRow
          href="/caserita/ofertas"
          icon={<IconStore size={20} />}
          label="Mis ofertas"
        />
        <MenuRow
          href="/caserita/ventas"
          icon={<IconUser size={20} />}
          label="Ventas e historial"
        />
        {tienda?.metaInternetAlcanzada && (
          <MenuRow
            href="/caserita/meta"
            icon={<IconBell size={20} />}
            label="Meta alcanzada"
          />
        )}
        <MenuRow
          href="/comprador/ayuda"
          icon={<IconHelp size={20} />}
          label="Ayuda y soporte"
        />
        <div className="mt-4 border-t border-gray-100 pt-2">
          <MenuRow
            icon={<IconLogout size={20} />}
            label="Cerrar sesión"
            danger
            onClick={() => void signOut({ callbackUrl: "/" })}
          />
        </div>
      </nav>
    </div>
  );
}
