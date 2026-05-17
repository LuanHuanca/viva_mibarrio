"use client";

import Image from "next/image";
import Link from "next/link";

import { ScreenHeader } from "~/components/ui/screen-header";
import { IconBell, IconSettings } from "~/components/ui/icons";
import { graphics } from "~/lib/graphics";

const MOCK = [
  {
    id: "1",
    grupo: "Hoy",
    titulo: "¡Ayudaste a Kiosko Don Pepe!",
    texto: "Sumaste 1 punto para su meta.",
    hora: "14:32",
    unread: true,
    tipo: "success" as const,
  },
  {
    id: "2",
    grupo: "Hoy",
    titulo: "Nueva oferta cerca de ti",
    texto: "Coca-Cola 2.5L a 9 Bs en tu zona.",
    hora: "10:15",
    unread: false,
    tipo: "info" as const,
  },
  {
    id: "3",
    grupo: "Ayer",
    titulo: "Oferta finalizó",
    texto: "El producto que guardaste ya no está disponible.",
    hora: "18:00",
    unread: false,
    tipo: "alert" as const,
  },
];

export default function NotificacionesPage() {
  const grupos = [...new Set(MOCK.map((m) => m.grupo))];

  return (
    <>
      <ScreenHeader
        title="Notificaciones"
        backHref="/comprador/mapa"
        right={
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-viva-soft"
            aria-label="Configuración"
          >
            <IconSettings size={18} />
          </button>
        }
      />

      <div className="bg-viva-soft px-4 py-4">
        {grupos.map((grupo) => (
          <section key={grupo} className="mb-6">
            <h2 className="mb-3 text-sm font-bold text-gray-700">{grupo}</h2>
            <ul className="space-y-3">
              {MOCK.filter((m) => m.grupo === grupo).map((n) => (
                <li
                  key={n.id}
                  className={`viva-card flex gap-3 p-4 ${
                    n.unread ? "ring-2 ring-[#007a4d]/25" : ""
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <IconBell
                      className={
                        n.tipo === "alert" ? "text-amber-600" : "text-[#007a4d]"
                      }
                      size={20}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">{n.titulo}</p>
                    <p className="mt-0.5 text-sm text-gray-600">{n.texto}</p>
                    <p className="mt-1 text-xs text-gray-400">{n.hora}</p>
                  </div>
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      n.unread ? "bg-[#007a4d]" : "border border-gray-300"
                    }`}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <button
          type="button"
          className="w-full rounded-2xl border-2 border-[#007a4d] bg-white py-3.5 text-sm font-bold text-[#007a4d]"
        >
          Marcar todas como leídas
        </button>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-28 w-28 opacity-40">
            <Image
              src={graphics.empty.sinNotificaciones}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
}
