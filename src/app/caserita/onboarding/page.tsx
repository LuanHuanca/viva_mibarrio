"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { IconCheckCircle, IconMapPin } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { PageTopBar } from "~/components/ui/mobile-shell";
import { api } from "~/trpc/react";

export default function OnboardingCaseritaPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const create = api.tienda.create.useMutation();

  const [nombreTienda, setNombreTienda] = useState("");
  const [zonaBarrio, setZonaBarrio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function capturarGps() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Activa el GPS para registrar tu tienda en el mapa."),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coords) {
      alert("Captura la ubicación GPS de tu tienda");
      return;
    }
    if (!whatsapp.trim()) {
      alert("Ingresa tu WhatsApp para activar el asistente de reportes");
      return;
    }

    await create.mutateAsync({
      nombreTienda,
      zonaBarrio,
      lat: coords.lat,
      lng: coords.lng,
      whatsappDuenia: whatsapp || undefined,
    });

    await utils.tienda.mine.invalidate();
    router.push("/caserita/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <PageTopBar backHref="/caserita/dashboard" />
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004d2c]">Registra tu tienda</h1>
          <p className="mt-1 text-sm text-gray-500">
            Así los vecinos podrán encontrarte
          </p>
        </div>

        <Input
          label="Nombre de tu kiosko"
          required
          value={nombreTienda}
          onChange={(e) => setNombreTienda(e.target.value)}
          placeholder="Kiosko Lili"
        />
        <Input
          label="Zona / Barrio"
          required
          value={zonaBarrio}
          onChange={(e) => setZonaBarrio(e.target.value)}
          placeholder="Villa Corona"
        />
        <Input
          label="WhatsApp (para reportes del asistente)"
          required
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="70707070"
        />
        <p className="text-xs text-gray-500">
          Con este número podrás recibir reportes de ventas y meta por WhatsApp.
        </p>

        <div>
          <p className="text-sm font-semibold text-[#007a4d]">Ubicación</p>
          <p className="mb-2 text-xs text-gray-500">
            Usaremos tu ubicación para mostrarte en el mapa
          </p>
          <button
            type="button"
            onClick={capturarGps}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007a4d] py-3.5 text-sm font-bold text-white"
          >
            <IconMapPin size={18} className="text-white" />
            {coords ?
              <span className="flex items-center gap-1.5">
                Ubicación capturada
                <IconCheckCircle size={16} className="text-white" />
              </span>
            : "Usar mi ubicación GPS"}
          </button>
        </div>

        {create.error && (
          <p className="text-sm text-red-600">{create.error.message}</p>
        )}

        <Button type="submit" fullWidth disabled={create.isPending}>
          {create.isPending ? "Guardando…" : "Guardar y continuar"}
        </Button>
      </form>
    </div>
  );
}
