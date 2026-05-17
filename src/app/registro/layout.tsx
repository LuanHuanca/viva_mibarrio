import { Suspense } from "react";

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="p-6 text-center">Cargando…</div>}>{children}</Suspense>;
}
