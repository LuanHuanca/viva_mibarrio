"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { graphics } from "~/lib/graphics";
import { IconBell, IconMenu } from "~/components/ui/icons";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  role: "COMPRADOR" | "CASERITA";
};

export function AppHeader({ title, subtitle, role }: AppHeaderProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const homeHref =
    role === "CASERITA" ? "/caserita/dashboard" : "/comprador/mapa";
  const perfilHref =
    role === "CASERITA" ? "/caserita/perfil" : "/comprador/perfil";

  return (
    <>
      <header className="relative z-40 flex items-center gap-3 rounded-b-3xl bg-[#007a4d] px-4 py-3.5 text-white shadow-sm">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Abrir menú"
        >
          <IconMenu />
        </button>

        <div className="flex-1 text-center">
          <p className="text-base font-bold leading-tight">{title}</p>
          {subtitle && (
            <p className="text-xs font-normal text-white/80">{subtitle}</p>
          )}
        </div>

        <Link
          href={
            role === "CASERITA" ?
              "/caserita/dashboard"
            : "/comprador/notificaciones"
          }
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Notificaciones"
        >
          <IconBell className="opacity-90" />
        </Link>
      </header>

      {notifOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setNotifOpen(false)}
            aria-label="Cerrar notificaciones"
          />
          <div className="absolute right-4 top-[3.25rem] z-50 w-72 rounded-xl bg-white p-4 shadow-xl">
            <p className="text-sm font-bold text-gray-800">Notificaciones</p>
            <div className="mt-3 flex flex-col items-center py-2">
              <div className="relative h-24 w-24">
                <Image
                  src={graphics.empty.sinNotificaciones}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">
                No tienes avisos nuevos por ahora.
              </p>
            </div>
          </div>
        </>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <nav className="absolute left-0 top-0 flex h-full w-[min(280px,85vw)] flex-col bg-white shadow-2xl">
            <div className="bg-[#007a4d] px-5 py-6 text-white">
              <p className="text-lg font-bold">VIVA Barrio</p>
              <p className="mt-1 text-sm text-white/80">
                {session?.user?.name ?? "Usuario"}
              </p>
              <p className="text-xs text-white/60">{session?.user?.email}</p>
            </div>
            <ul className="flex-1 p-3">
              <MenuLink href={homeHref} onClick={() => setMenuOpen(false)}>
                Inicio
              </MenuLink>
              <MenuLink href={perfilHref} onClick={() => setMenuOpen(false)}>
                Mi perfil
              </MenuLink>
              {role === "COMPRADOR" && (
                <>
                  <MenuLink
                    href="/comprador/compras"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mis compras
                  </MenuLink>
                  <MenuLink
                    href="/comprador/notificaciones"
                    onClick={() => setMenuOpen(false)}
                  >
                    Notificaciones
                  </MenuLink>
                  <MenuLink
                    href="/comprador/puntos"
                    onClick={() => setMenuOpen(false)}
                  >
                    Puntos y recompensas
                  </MenuLink>
                  <MenuLink
                    href="/comprador/ayuda"
                    onClick={() => setMenuOpen(false)}
                  >
                    Ayuda
                  </MenuLink>
                </>
              )}
              {role === "CASERITA" && (
                <MenuLink
                  href="/caserita/ventas"
                  onClick={() => setMenuOpen(false)}
                >
                  Mis ventas
                </MenuLink>
              )}
            </ul>
            <div className="border-t border-gray-100 p-3">
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="w-full rounded-xl py-3 text-left text-sm font-semibold text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-800 hover:bg-emerald-50"
      >
        {children}
      </Link>
    </li>
  );
}
