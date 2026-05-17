"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ScreenHeader } from "~/components/ui/screen-header";
import { api } from "~/trpc/react";

function formatFecha(d: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function CaseritaVentasPage() {
  const [tab, setTab] = useState<"resumen" | "historial">("resumen");
  const { data: tienda } = api.tienda.mine.useQuery();
  const { data: ventas, isLoading } = api.transaccion.misVentas.useQuery(
    undefined,
    { enabled: !!tienda },
  );
  const { data: progreso } = api.tienda.progreso.useQuery(undefined, {
    enabled: !!tienda,
  });

  const stats = useMemo(() => {
    if (!ventas) return { total: 0, vecinos: 0 };
    const vecinos = new Set(
      ventas.filter((v) => v.puntoOtorgado).map((v) => v.usuarioId),
    );
    return { total: ventas.length, vecinos: vecinos.size };
  }, [ventas]);

  const mesLabel = new Intl.DateTimeFormat("es-BO", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (!tienda) {
    return (
      <>
        <ScreenHeader title="Ventas" backHref="/caserita/dashboard" />
        <div className="px-4 py-10 text-center">
          <p className="text-gray-600">Primero registra tu tienda.</p>
          <Link
            href="/caserita/onboarding"
            className="mt-4 inline-block rounded-xl bg-[#007a4d] px-6 py-3 text-sm font-bold text-white"
          >
            Completar onboarding
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Ventas" backHref="/caserita/dashboard" />

      <div className="flex border-b border-[#007a4d]/10 bg-white">
        {(["resumen", "historial"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-bold capitalize ${
              tab === t ?
                "border-b-2 border-[#007a4d] text-[#007a4d]"
              : "text-gray-400"
            }`}
          >
            {t === "resumen" ? "Resumen" : "Historial"}
          </button>
        ))}
      </div>

      <div className="bg-viva-soft px-4 py-4">
        {tab === "resumen" ?
          <>
            <div className="rounded-3xl bg-viva-soft p-5">
              <p className="text-sm font-medium text-gray-600">Resumen del mes</p>
              <p className="text-xs capitalize text-gray-500">{mesLabel}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-black text-[#007a4d]">
                    {progreso?.clientesAtendidosCiclo ?? stats.vecinos}
                  </p>
                  <p className="text-[10px] text-gray-600">Vecinos únicos</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#007a4d]">{stats.total}</p>
                  <p className="text-[10px] text-gray-600">Ventas totales</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#007a4d]">
                    {stats.total * 10}
                  </p>
                  <p className="text-[10px] text-gray-600">Ingresos Bs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTab("historial")}
                className="mt-4 w-full text-center text-sm font-semibold text-[#007a4d]"
              >
                Ver detalles
              </button>
            </div>

            <h2 className="mt-8 text-base font-bold text-gray-900">Últimas ventas</h2>
            <ul className="mt-3 space-y-3">
              {ventas?.slice(0, 3).map((v) => (
                <VentaRow key={v.id} v={v} />
              ))}
              {ventas?.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  Aún no hay ventas. Usa «Cobrar ahora».
                </p>
              )}
            </ul>
          </>
        : isLoading ?
          <p className="text-center text-gray-500">Cargando…</p>
        : ventas && ventas.length > 0 ?
          <ul className="space-y-3">
            {ventas.map((v) => (
              <VentaRow key={v.id} v={v} />
            ))}
          </ul>
        : <p className="text-center text-gray-500">
            Aún no hay ventas. Usa «Cobrar ahora» para generar tu QR.
          </p>
        }
      </div>
    </>
  );
}

function VentaRow({
  v,
}: {
  v: {
    id: string;
    fechaRegistro: Date;
    puntoOtorgado: boolean;
    usuarioId: string;
    usuario: { name: string | null; email: string | null };
    oferta: { nombreProducto: string } | null;
  };
}) {
  const nombre = v.usuario.name ?? v.usuario.email ?? "Vecino";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <li className="viva-card flex items-center gap-3 p-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-viva-soft text-sm font-bold text-[#007a4d]">
        {inicial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900">{nombre}</p>
        <p className="text-sm text-gray-600">
          {v.oferta?.nombreProducto ?? "Compra en tienda"}
        </p>
        <p className="text-xs text-gray-400">
          {formatFecha(new Date(v.fechaRegistro))}
        </p>
      </div>
      {v.puntoOtorgado ?
        <span className="text-sm font-bold text-[#007a4d]">+1 punto</span>
      : <span className="text-xs text-gray-400">Sin punto</span>}
    </li>
  );
}
