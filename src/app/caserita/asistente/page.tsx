"use client";

import { useEffect, useRef, useState } from "react";

import { ScreenHeader } from "~/components/ui/screen-header";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type Mensaje = { rol: "user" | "bot"; texto: string };

const SUGERENCIAS = [
  "¿Cómo van mis ventas?",
  "¿Cuánto me falta para la meta?",
  "Dame el reporte completo",
];

export default function AsistenteCaseritaPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: "bot",
      texto:
        "Hola, soy tu asistente VIVA. Pregúntame por tus ventas o cuánto te falta para el internet gratis.",
    },
  ]);
  const [input, setInput] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  const { data: resumen } = api.asistente.resumen.useQuery();
  const { data: linkReporte } = api.asistente.linkReporte.useQuery();
  const { data: linkAutorizar } = api.asistente.linkAutorizarEnMiWhatsApp.useQuery(
    undefined,
    { retry: false },
  );
  const responder = api.asistente.responder.useMutation();

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function enviar(texto: string) {
    const t = texto.trim();
    if (!t) return;
    setMensajes((m) => [...m, { rol: "user", texto: t }]);
    setInput("");
    try {
      const { respuesta } = await responder.mutateAsync({ pregunta: t });
      setMensajes((m) => [...m, { rol: "bot", texto: respuesta }]);
    } catch (e) {
      setMensajes((m) => [
        ...m,
        {
          rol: "bot",
          texto:
            e instanceof Error ? e.message : "No pude responder. Intenta de nuevo.",
        },
      ]);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col bg-viva-soft">
      <ScreenHeader title="Asistente VIVA" backHref="/caserita/dashboard" />

      {resumen && (
        <div className="mx-4 mt-3 rounded-xl bg-white p-3 text-sm shadow-sm">
          <p className="font-bold text-[#004d2c]">{resumen.nombreTienda}</p>
          <p className="text-gray-600">
            Meta: {resumen.clientesAtendidos}/{resumen.metaUsuarios} vecinos ·{" "}
            {resumen.ventasCiclo} ventas en el ciclo
          </p>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {mensajes.map((m, i) => (
          <div
            key={`${i}-${m.rol}`}
            className={`flex ${m.rol === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.rol === "user" ?
                  "bg-[#007a4d] text-white"
                : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              {m.texto}
            </div>
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {SUGERENCIAS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void enviar(s)}
              className="rounded-full border border-[#007a4d]/30 bg-[#f0f9f4] px-3 py-1 text-xs font-medium text-[#007a4d]"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-3 flex flex-col gap-2">
          {linkReporte?.url && (
            <a
              href={linkReporte.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-bold text-white"
            >
              Enviar reporte por WhatsApp a VIVA
            </a>
          )}
          {linkAutorizar?.url && (
            <a
              href={linkAutorizar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border-2 border-[#25D366] py-2.5 text-center text-sm font-bold text-[#128C7E]"
            >
              Autorizar reportes en mi WhatsApp
            </a>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void enviar(input);
            }}
            placeholder="Escribe tu pregunta…"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007a4d]"
          />
          <Button
            type="button"
            disabled={responder.isPending || !input.trim()}
            onClick={() => void enviar(input)}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
