"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

import { IconFlashlight } from "~/components/ui/icons";

export function QrScanner({
  onScan,
  onError,
}: {
  onScan: (text: string) => void;
  onError?: (msg: string) => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);
  const stoppedRef = useRef(false);
  const onScanRef = useRef(onScan);
  const [started, setStarted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const elId = "viva-qr-reader";
    stoppedRef.current = false;
    runningRef.current = false;

    const scanner = new Html5Qrcode(elId);
    scannerRef.current = scanner;

    let cancelled = false;

    void scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          if (stoppedRef.current) return;
          stoppedRef.current = true;
          onScanRef.current(decoded);
          if (runningRef.current) {
            void scanner
              .stop()
              .then(() => {
                scanner.clear();
              })
              .catch(() => undefined)
              .finally(() => {
                runningRef.current = false;
              });
          }
        },
        () => undefined,
      )
      .then(() => {
        if (!cancelled) {
          runningRef.current = true;
          setStarted(true);
        }
      })
      .catch((e: unknown) => {
        const msg =
          e instanceof Error ? e.message : "No se pudo acceder a la cámara";
        setCameraError(msg);
        onError?.(msg);
      });

    return () => {
      cancelled = true;
      if (runningRef.current && !stoppedRef.current) {
        stoppedRef.current = true;
        void scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => undefined);
        runningRef.current = false;
      }
    };
  }, [onError]);

  return (
    <div className="relative">
      <div
        id="viva-qr-reader"
        className="min-h-[260px] w-full overflow-hidden rounded-2xl bg-black/40"
      />
      {!started && !cameraError && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-white">
          Iniciando cámara…
        </p>
      )}
      {cameraError && (
        <p className="mt-3 rounded-xl bg-amber-500/20 px-3 py-2 text-center text-sm text-amber-100">
          {cameraError}. Usa el modo desarrollo para pegar el token.
        </p>
      )}
      <div className="pointer-events-none absolute inset-6">
        <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-lg border-l-4 border-t-4 border-[#4ade80]" />
        <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-lg border-r-4 border-t-4 border-[#4ade80]" />
        <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-b-4 border-l-4 border-[#4ade80]" />
        <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-lg border-b-4 border-r-4 border-[#4ade80]" />
      </div>
      <button
        type="button"
        className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"
        aria-label="Linterna"
        onClick={() => {
          alert("La linterna depende de tu dispositivo. Actívala desde el panel rápido.");
        }}
      >
        <IconFlashlight />
      </button>
    </div>
  );
}
