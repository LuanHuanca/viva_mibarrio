"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

const AD_SECONDS = Number(process.env.NEXT_PUBLIC_AD_MIN_SECONDS ?? 5);

export default function PagarPage() {
  const params = useParams<{ ofertaId: string }>();

  const adSeconds = AD_SECONDS;
  const [countdown, setCountdown] = useState(adSeconds);
  const [adDone, setAdDone] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const validar = api.transaccion.validar.useMutation();

  useEffect(() => {
    if (countdown <= 0) {
      setAdDone(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleValidar() {
    setResult(null);
    try {
      const raw = tokenInput.trim();
      const token =
        raw.includes("token=") ?
          (new URL(raw.replace("viva://pay?", "https://x/?")).searchParams.get(
            "token",
          ) ?? raw)
        : raw;

      const res = await validar.mutateAsync({
        token,
        ofertaId: params.ofertaId,
      });
      setResult(res.mensaje);
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Error al validar");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <Link href="/comprador/mapa" className="text-sm text-emerald-600 underline">
        ← Volver al mapa
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-emerald-950">Pagar con descuento</h1>

      {!adDone ? (
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-lg font-semibold text-amber-900">
            Pauta publicitaria VIVA
          </p>
          <p className="mt-4 text-5xl font-bold text-amber-700">{countdown}s</p>
          <p className="mt-2 text-sm text-amber-800">
            Espera para continuar al escáner QR
          </p>
        </section>
      ) : (
        <section className="mt-8 space-y-4 rounded-2xl border border-emerald-200 bg-white p-6">
          <p className="text-sm text-emerald-800">
            Escanea el QR de la caserita (o pega el token de prueba en desarrollo).
          </p>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Pega aquí el token o URL viva://pay?token=..."
            className="h-24 w-full rounded-lg border border-emerald-200 p-3 text-xs"
          />
          <button
            type="button"
            onClick={handleValidar}
            disabled={validar.isPending || !tokenInput.trim()}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            {validar.isPending ? "Validando…" : "Confirmar pago"}
          </button>
          {result && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
              {result}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
