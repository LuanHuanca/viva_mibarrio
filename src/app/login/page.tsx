import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "~/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-950">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-emerald-700">
          Demo: comprador@viva.demo / caserita@viva.demo — contraseña{" "}
          <code className="rounded bg-emerald-100 px-1">demo1234</code>
        </p>
        <Suspense fallback={<p className="mt-6 text-sm">Cargando…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-emerald-800">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}
