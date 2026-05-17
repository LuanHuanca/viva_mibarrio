"use client";

import { ScreenHeader } from "~/components/ui/screen-header";
import { IconChevronRight, IconMail, IconPhone } from "~/components/ui/icons";

const FAQ = [
  "¿Cómo funciona el QR dinámico?",
  "¿Cómo se suman los puntos?",
  "¿Cuándo se renueva mi meta?",
  "¿Qué pasa si el QR no funciona?",
];

export default function AyudaPage() {
  return (
    <>
      <ScreenHeader title="Ayuda y soporte" backHref="/comprador/perfil" />

      <div className="bg-viva-soft px-4 py-4">
        <h2 className="text-base font-bold text-gray-900">Preguntas frecuentes</h2>
        <ul className="mt-3 space-y-2">
          {FAQ.map((q) => (
            <li key={q}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-viva-soft px-4 py-3.5 text-left text-sm font-medium text-gray-800"
              >
                {q}
                <IconChevronRight size={18} className="text-gray-400" />
              </button>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-base font-bold text-gray-900">
          ¿Necesitas más ayuda?
        </h2>
        <ul className="mt-3 space-y-3">
          <ContactCard
            icon={
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-lg font-bold text-[#25D366]">
                W
              </span>
            }
            title="Chat por WhatsApp"
            subtitle="Te ayudamos rápido"
          />
          <ContactCard
            icon={
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-viva-soft">
                <IconPhone size={20} />
              </span>
            }
            title="Llamar al soporte"
            subtitle="Lun - Vie 08:00 a 18:00"
          />
          <ContactCard
            icon={
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-viva-soft">
                <IconMail size={20} />
              </span>
            }
            title="Enviar mensaje"
            subtitle="Te responderemos pronto"
          />
        </ul>
      </div>
    </>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <li>
      <button
        type="button"
        className="viva-card flex w-full items-center gap-3 p-4 text-left"
      >
        {icon}
        <div className="flex-1">
          <p className="font-bold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <IconChevronRight size={18} className="text-[#007a4d]" />
      </button>
    </li>
  );
}
