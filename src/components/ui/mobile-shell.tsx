"use client";

import Link from "next/link";

import { IconBack } from "~/components/ui/icons";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { NavIcon, type NavIconName } from "~/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
  primary?: boolean;
};

const compradorNav: NavItem[] = [
  { href: "/comprador/mapa", label: "Mapa", icon: "map" },
  { href: "/comprador/ofertas", label: "Ofertas", icon: "tag" },
  { href: "/comprador/compras", label: "Mis compras", icon: "bag" },
  { href: "/comprador/perfil", label: "Perfil", icon: "user" },
];

const caseritaNav: NavItem[] = [
  { href: "/caserita/dashboard", label: "Inicio", icon: "home" },
  { href: "/caserita/ofertas", label: "Ofertas", icon: "tag" },
  { href: "/caserita/cobrar", label: "Cobrar", icon: "qr", primary: true },
  { href: "/caserita/ventas", label: "Ventas", icon: "chart" },
  { href: "/caserita/perfil", label: "Perfil", icon: "user" },
];

function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1">
      <div className="mx-auto flex max-w-lg items-end justify-around rounded-2xl border border-white/60 bg-white/95 px-1 py-2 shadow-[0_-4px_24px_rgba(0,61,40,0.15)] backdrop-blur-md">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-5 flex min-w-[4.5rem] flex-col items-center gap-0.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                    active ?
                      "bg-[#004d2c] ring-4 ring-[#007a4d]/25"
                    : "bg-[#007a4d]"
                  }`}
                >
                  <NavIcon name={item.icon} active className="text-white" />
                </span>
                <span
                  className={`text-[10px] font-bold ${active ? "text-[#007a4d]" : "text-[#004d2c]"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-xl px-1.5 py-1.5 transition-all duration-200 ${
                active ?
                  "bg-[#007a4d]/12 text-[#007a4d]"
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <NavIcon name={item.icon} active={active} />
              <span
                className={`text-[10px] font-semibold ${active ? "text-[#007a4d]" : ""}`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute -bottom-0.5 h-0.5 w-6 rounded-full bg-[#007a4d]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function CompradorShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-viva-soft pb-24">
      {children}
      <BottomNav items={compradorNav} />
    </div>
  );
}

export function CaseritaShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/caserita/cobrar");

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-viva-soft pb-24">
      {children}
      {!hideNav && <BottomNav items={caseritaNav} />}
    </div>
  );
}

export function PageTopBar({
  title,
  backHref,
}: {
  title?: string;
  backHref?: string;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
      {backHref && (
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          aria-label="Volver"
        >
          <IconBack className="text-gray-800" size={20} />
        </Link>
      )}
      {title && (
        <h1 className="flex-1 text-lg font-bold text-[#004d2c]">{title}</h1>
      )}
    </header>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="border-b border-gray-100 bg-white px-4 py-4 text-lg font-bold text-[#004d2c]">
      {children}
    </h1>
  );
}
