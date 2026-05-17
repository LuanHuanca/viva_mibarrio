"use client";

import { signOut, useSession } from "next-auth/react";

import {
  IconBell,
  IconCreditCard,
  IconHelp,
  IconLogout,
  IconMapPin,
  IconUser,
} from "~/components/ui/icons";
import { MenuRow } from "~/components/ui/menu-row";

export default function CompradorPerfilPage() {
  const { data: session } = useSession();
  const nombre = session?.user?.name ?? "Comprador";
  const handle = session?.user?.email?.split("@")[0] ?? "usuario";

  return (
    <div className="min-h-full bg-[#e8f5ec] pb-4">
      <header className="rounded-b-3xl bg-[#007a4d] px-5 pb-8 pt-6 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 bg-white/20">
            <IconUser size={32} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">{nombre}</p>
            <p className="text-sm text-white/80">@{handle}</p>
            <p className="text-sm text-white/70">Comprador</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-white/60 px-4 py-1.5 text-xs font-semibold"
          >
            Editar
          </button>
        </div>
      </header>

      <nav className="mx-2 -mt-4 rounded-t-3xl bg-white px-3 py-4 shadow-sm">
        <MenuRow
          href="/comprador/perfil/datos"
          icon={<IconUser size={20} />}
          label="Mis datos"
        />
        <MenuRow
          href="/comprador/perfil/direcciones"
          icon={<IconMapPin size={20} />}
          label="Direcciones guardadas"
        />
        <MenuRow
          href="/comprador/perfil/pago"
          icon={<IconCreditCard size={20} />}
          label="Métodos de pago"
        />
        <MenuRow
          href="/comprador/notificaciones"
          icon={<IconBell size={20} />}
          label="Notificaciones"
        />
        <MenuRow
          href="/comprador/ayuda"
          icon={<IconHelp size={20} />}
          label="Ayuda y soporte"
        />
        <MenuRow href="/" icon={<IconHelp size={20} />} label="Acerca de VIVA Barrio" />
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
