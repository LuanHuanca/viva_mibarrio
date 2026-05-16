"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export default function OnboardingCaseritaPage() {
  const router = useRouter();
  const create = api.tienda.create.useMutation();

  const [nombreTienda, setNombreTienda] = useState("");
  const [zonaBarrio, setZonaBarrio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  function capturarGps() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("No se pudo obtener la ubicación. Activa el GPS."),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coords) {
      alert("Captura la ubicación GPS de tu tienda");
      return;
    }

    await create.mutateAsync({
      nombreTienda,
      zonaBarrio,
      lat: coords.lat,
      lng: coords.lng,
      whatsappDuenia: whatsapp || undefined,
    });

    router.push("/caserita/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-950">Registra tu tienda</h1>
      <p className="mt-2 text-sm text-emerald-700">
        Aparecerás en el mapa de los compradores del barrio.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          placeholder="Nombre del kiosko"
          value={nombreTienda}
          onChange={(e) => setNombreTienda(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 px-3 py-2"
        />
        <input
          required
          placeholder="Zona / barrio"
          value={zonaBarrio}
          onChange={(e) => setZonaBarrio(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 px-3 py-2"
        />
        <input
          placeholder="WhatsApp (+591...)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 px-3 py-2"
        />
        <button
          type="button"
          onClick={capturarGps}
          className="w-full rounded-lg border border-dashed border-emerald-400 py-3 text-emerald-800"
        >
          {coords ?
            `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
          : "Usar mi ubicación GPS"}
        </button>

        {create.error && (
          <p className="text-sm text-red-600">{create.error.message}</p>
        )}

        <button
          type="submit"
          disabled={create.isPending}
          className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white"
        >
          {create.isPending ? "Guardando…" : "Registrar tienda"}
        </button>
      </form>
    </main>
  );
}
