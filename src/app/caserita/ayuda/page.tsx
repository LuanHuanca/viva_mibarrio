"use client";

import Link from "next/link";

import { ScreenHeader } from "~/components/ui/screen-header";
import { MenuRow } from "~/components/ui/menu-row";
import { IconHelp, IconQrScan } from "~/components/ui/icons";
import { api } from "~/trpc/react";

export default function CaseritaAyudaPage() {
  const { data: linkReporte } = api.asistente.linkReporte.useQuery();

  return (
    <div className="min-h-full bg-viva-soft pb-6">
      <ScreenHeader title="Ayuda caserita" backHref="/caserita/perfil" />

      <div className="mx-4 mt-4 space-y-3">
        <div className="viva-card p-4">
          <h2 className="font-bold text-[#004d2c]">Cobrar con QR</h2>
          <p className="mt-2 text-sm text-gray-600">
            En la pestaña <strong>Cobrar</strong> muestra el QR al comprador. Se
            renueva cada 10 segundos. El comprador verá un anuncio breve antes de
            escanear.
          </p>
          <Link
            href="/caserita/cobrar"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#007a4d]"
          >
            <IconQrScan size={18} /> Ir a cobrar
          </Link>
        </div>

        <div className="viva-card p-4">
          <h2 className="font-bold text-[#004d2c]">Meta de internet gratis</h2>
          <p className="mt-2 text-sm text-gray-600">
            La barra del inicio muestra cuántos vecinos únicos compraron en tu
            tienda este mes. La meta por defecto es 30 vecinos.
          </p>
        </div>

        <div className="viva-card p-4">
          <h2 className="font-bold text-[#004d2c]">Asistente por WhatsApp</h2>
          <p className="mt-2 text-sm text-gray-600">
            Pregunta por ventas y progreso en el chat de la app o conecta tu
            número para recibir reportes.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/caserita/asistente"
              className="rounded-xl bg-[#007a4d] py-2.5 text-center text-sm font-bold text-white"
            >
              Abrir asistente
            </Link>
            {linkReporte?.url && (
              <a
                href={linkReporte.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-bold text-white"
              >
                Enviar reporte por WhatsApp
              </a>
            )}
          </div>
        </div>

        <MenuRow
          href="/caserita/asistente"
          icon={<IconHelp size={20} />}
          label="Chat del asistente VIVA"
        />
      </div>
    </div>
  );
}
