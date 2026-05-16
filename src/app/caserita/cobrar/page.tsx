"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

const REFRESH_MS = 10_000;

export default function CobrarPage() {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const { data, refetch, isFetching } = api.transaccion.qrToken.useQuery(
    undefined,
    { refetchInterval: REFRESH_MS },
  );

  useEffect(() => {
    setSecondsLeft(10);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 10 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [data?.expiresAt]);

  const qrImageUrl =
    data?.qrPayload ?
      `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(data.qrPayload)}`
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center bg-emerald-950 px-4 py-8 text-white">
      <Link href="/caserita/dashboard" className="self-start text-sm underline">
        ← Dashboard
      </Link>

      <h1 className="mt-6 text-xl font-bold">Cobro presencial</h1>
      <p className="mt-2 text-sm text-emerald-200">
        El QR se actualiza en{" "}
        <span className="font-bold text-white">{secondsLeft}s</span>
        {isFetching && " · actualizando…"}
      </p>

      <div className="mt-10 rounded-2xl bg-white p-4">
        {qrImageUrl ?
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrImageUrl} alt="QR de cobro" width={320} height={320} />
        : <div className="flex h-80 w-80 items-center justify-center text-emerald-900">
            Generando QR…
          </div>
        }
      </div>

      <button
        type="button"
        onClick={() => void refetch()}
        className="mt-8 rounded-lg border border-emerald-400 px-6 py-2 text-sm"
      >
        Refrescar ahora
      </button>

      <p className="mt-6 max-w-sm text-center text-xs text-emerald-300">
        Muestra este código al comprador después de su pauta publicitaria. No
        permitas capturas: expira cada 10 segundos.
      </p>
    </main>
  );
}
