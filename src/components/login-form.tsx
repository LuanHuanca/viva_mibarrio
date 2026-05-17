"use client";

import { getSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/password-input";

function safeCallbackUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/comprador/mapa";
  if (raw.startsWith("/api")) return "/comprador/mapa";
  return raw;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const registered = searchParams.get("registered") === "1";
  const prefilledEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    const session = await getSession();
    const isCaserita = session?.user?.role === "CASERITA";
    const destination =
      isCaserita ?
        callbackUrl.startsWith("/caserita") ?
          callbackUrl
        : "/caserita/dashboard"
      : callbackUrl.startsWith("/comprador") ?
        callbackUrl
      : "/comprador/mapa";

    window.location.assign(destination);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      {registered && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Cuenta creada. Inicia sesión con tu email y contraseña.
        </p>
      )}
      <Input
        label="Correo electrónico"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
      />
      <PasswordInput
        id="login-password"
        label="Contraseña"
        value={password}
        onChange={setPassword}
        required
        minLength={6}
        autoComplete="current-password"
      />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-gray-300 accent-[#007a4d]"
          />
          Recordarme
        </label>
        <span className="text-[#007a4d]">¿Olvidaste tu contraseña?</span>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </Button>

    </form>
  );
}
