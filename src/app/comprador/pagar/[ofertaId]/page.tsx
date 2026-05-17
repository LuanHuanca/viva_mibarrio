"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Image from "next/image";

import { QrScanner } from "~/components/comprador/qr-scanner";
import { graphics } from "~/lib/graphics";
import { Button } from "~/components/ui/button";
import { CircularTimer } from "~/components/ui/circular-timer";
import { IconBack } from "~/components/ui/icons";
import { VivaLogo } from "~/components/ui/viva-logo";
import { api } from "~/trpc/react";

function qrGraphicForError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("expirado")) return graphics.qr.explicado;
  if (m.includes("utilizado") || m.includes("usado")) return graphics.qr.usado;
  if (m.includes("inválido") || m.includes("invalido")) return graphics.qr.invalido;
  return graphics.qr.noDisponible;
}

const AD_SECONDS = Number(process.env.NEXT_PUBLIC_AD_MIN_SECONDS ?? 5);

type Step = "ad" | "scan" | "success" | "error";

export default function PagarPage() {
  const params = useParams<{ ofertaId: string }>();
  const searchParams = useSearchParams();
  const tiendaId = searchParams.get("tienda") ?? "";

  const [step, setStep] = useState<Step>("ad");
  const [countdown, setCountdown] = useState(AD_SECONDS);
  const [mensaje, setMensaje] = useState("");
  const [puntoOtorgado, setPuntoOtorgado] = useState(true);

  const { data: tienda } = api.tienda.getById.useQuery(
    { id: tiendaId },
    { enabled: !!tiendaId },
  );

  const validar = api.transaccion.validar.useMutation();

  useEffect(() => {
    if (step !== "ad") return;
    if (countdown <= 0) {
      setStep("scan");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, step]);

  async function onScan(text: string) {
    try {
      const raw = text.trim();
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
      setMensaje(res.mensaje);
      setPuntoOtorgado(res.punto_otorgado);
      setStep("success");
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : "Error al validar");
      setStep("error");
    }
  }

  const nombreTienda = tienda?.nombreTienda ?? "la tienda";

  if (step === "ad") {
    return (
      <main className="relative mx-auto max-w-lg overflow-hidden bg-[#004d2c] px-6 py-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(118,185,0,0.35),transparent_60%)]" />
        <div className="relative z-10 w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
            Patrocinado por
          </p>
          <div className="mt-2 flex justify-center">
            <VivaLogo size="md" />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-center gap-5">
            <CircularTimer seconds={countdown} total={AD_SECONDS} size={64} />
            <div className="relative h-20 w-16">
              <Image
                src="/coca_cola.png"
                alt="Patrocinador"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
        </div>
        <p className="relative z-10 mt-5 text-center text-base font-bold">
          Tu descuento te espera
        </p>
        <p className="relative z-10 mt-1 text-center text-xs text-white/75">
          Mira el anuncio completo
        </p>
      </main>
    );
  }

  if (step === "scan") {
    return (
      <main className="mx-auto min-h-screen max-w-lg bg-[#051410] px-4 py-6 text-white">
        <Link
          href="/comprador/mapa"
          className="inline-flex"
          aria-label="Volver"
        >
          <IconBack />
        </Link>
        <h1 className="mt-6 text-2xl font-bold leading-tight">
          Escanea el QR de la caserita
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Pide a la dueña que muestre su QR y escanéalo para validar tu compra.
        </p>
        <div className="mt-8">
          <QrScanner
            onScan={onScan}
            onError={(msg) => {
              setMensaje(msg);
              setStep("error");
            }}
          />
        </div>
        <details className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-white/50">
          <summary className="cursor-pointer">Modo desarrollo: pegar token</summary>
          <DevTokenPaste onSubmit={onScan} pending={validar.isPending} />
        </details>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col bg-white px-6 py-8">
        <Link
          href="/comprador/mapa"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          aria-label="Volver"
        >
          <IconBack className="text-gray-800" />
        </Link>
        <div className="relative mt-6 flex flex-1 flex-col items-center justify-center text-center">
          {puntoOtorgado ?
            <>
              <div className="relative h-36 w-36">
                <Image src={graphics.qr.valido} alt="" fill className="object-contain" />
              </div>
              <h1 className="relative z-10 mt-6 text-2xl font-bold text-[#007a4d]">
                ¡Pago validado!
              </h1>
              <p className="relative z-10 mt-3 text-gray-700">
                Sumaste 1 punto a{" "}
                <strong className="text-[#004d2c]">{nombreTienda}</strong>
              </p>
              <p className="relative z-10 mt-2 text-sm text-gray-500">
                Gracias por apoyar a tu barrio
              </p>
            </>
          : <>
              <div className="relative h-36 w-36">
                <Image
                  src={graphics.meta.vecinoUnico}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="relative z-10 mt-6 text-2xl font-bold text-[#007a4d]">
                ¡Pago validado!
              </h1>
              <p className="relative z-10 mt-3 text-gray-700">
                Ya habías sumado tu punto este mes a{" "}
                <strong className="text-[#004d2c]">{nombreTienda}</strong>.
              </p>
              <p className="relative z-10 mt-2 text-sm text-gray-500">
                Puedes seguir comprando con descuento
              </p>
            </>
          }
        </div>
        <Link
          href="/comprador/mapa"
          className="w-full rounded-xl bg-[#007a4d] py-3.5 text-center font-bold text-white"
        >
          Volver al mapa
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="relative h-40 w-40">
        <Image
          src={qrGraphicForError(mensaje)}
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <h1 className="mt-4 text-xl font-bold text-gray-900">Algo salió mal</h1>
      <p className="mt-2 text-gray-600">{mensaje}</p>
      <Button className="mt-8" onClick={() => setStep("scan")}>
        Reintentar escaneo
      </Button>
      <Link href="/comprador/mapa" className="mt-4 text-[#007a4d]">
        Volver al mapa
      </Link>
    </main>
  );
}

function DevTokenPaste({
  onSubmit,
  pending,
}: {
  onSubmit: (t: string) => void;
  pending: boolean;
}) {
  const [token, setToken] = useState("");
  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full rounded bg-black/40 p-2 text-white"
        rows={2}
      />
      <button
        type="button"
        disabled={pending || !token.trim()}
        onClick={() => onSubmit(token)}
        className="w-full rounded bg-[#007a4d] py-2 text-white disabled:opacity-50"
      >
        Validar token
      </button>
    </div>
  );
}
