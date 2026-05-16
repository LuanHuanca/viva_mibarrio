"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
type RolRegistro = "COMPRADOR" | "CASERITA";

export default function RegistroPage() {
  const router = useRouter();
  const register = api.auth.register.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RolRegistro>("COMPRADOR");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register.mutateAsync({ name, email, password, role });
      router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
    } catch {
      /* error shown below */
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-950">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Soy…</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RolRegistro)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            >
              <option value="COMPRADOR">Comprador / vecino</option>
              <option value="CASERITA">Dueña de tienda (Caserita)</option>
            </select>
          </div>

          {register.error && (
            <p className="text-sm text-red-600">{register.error.message}</p>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {register.isPending ? "Creando…" : "Registrarme"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="font-semibold text-emerald-700 underline">
            Ya tengo cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}
