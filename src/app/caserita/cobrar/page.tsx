"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CircularTimer } from "~/components/ui/circular-timer";
import { IconBack } from "~/components/ui/icons";
import { api } from "~/trpc/react";

const REFRESH_MS = 10_000;

export default function CobrarPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);

  const { data: tienda, isLoading: loadingTienda } = api.tienda.mine.useQuery();

  const { data, refetch, isFetching } = api.transaccion.qrToken.useQuery(undefined, {
    refetchInterval: REFRESH_MS,
    enabled: !!tienda,
  });

  useEffect(() => {
    if (!loadingTienda && tienda === null) {
      router.replace("/caserita/onboarding");
    }
  }, [loadingTienda, tienda, router]);

  useEffect(() => {
    setSecondsLeft(10);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 10 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [data?.expiresAt]);

  if (loadingTienda || !tienda) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#004d2c] text-white">
        Cargando…
      </div>
    );
  }

  const qrImageUrl =
    data?.qrPayload ?
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.qrPayload)}`
    : null;

  return (
    <main className="fixed inset-0 z-[60] flex flex-col items-center bg-[#004d2c] px-4 py-8 text-white">
      <Link
        href="/caserita/dashboard"
        className="flex h-10 w-10 items-center justify-center self-start rounded-full bg-white/10"
        aria-label="Volver"
      >
        <IconBack />
      </Link>

      <h1 className="mt-8 text-2xl font-bold">Cobrar</h1>
      <p className="mt-2 text-center text-white/90">
        Muestra este QR al comprador
      </p>
      <p className="text-sm text-white/70">Se actualiza cada 10 segundos</p>

      <div className="relative mt-8 rounded-3xl bg-white p-5 shadow-2xl">
        {qrImageUrl ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrImageUrl}
            alt="QR de cobro VIVA"
            width={280}
            height={280}
            className="rounded-lg"
          />
        : <div className="flex h-[280px] w-[280px] items-center justify-center text-[#004d2c]">
            Generando QR…
          </div>}
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[#004d2c]">
          <Image src="/logo.png" alt="VIVA" width={40} height={40} className="object-contain p-1" />
        </div>
      </div>

      <div className="mt-8">
        <CircularTimer
          seconds={secondsLeft}
          total={10}
          label={`Se actualiza en ${secondsLeft}s${isFetching ? " · actualizando…" : ""}`}
        />
      </div>

      <button
        type="button"
        onClick={() => void refetch()}
        className="mt-6 text-sm text-white/80 underline"
      >
        Refrescar ahora
      </button>

      <Link href="/caserita/dashboard" className="mt-auto pb-4 text-sm text-white/90">
        Volver al dashboard
      </Link>
    </main>
  );
}
