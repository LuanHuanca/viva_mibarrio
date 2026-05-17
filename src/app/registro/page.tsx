"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { IconCart, IconStore } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/password-input";
import { PageTopBar } from "~/components/ui/mobile-shell";
import { VivaLogo } from "~/components/ui/viva-logo";
import { api } from "~/trpc/react";

type RolRegistro = "COMPRADOR" | "CASERITA";

export default function RegistroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = api.auth.register.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RolRegistro>("COMPRADOR");

  useEffect(() => {
    const r = searchParams.get("rol");
    if (r === "CASERITA" || r === "COMPRADOR") setRole(r);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register.mutateAsync({ name, email, password, role });
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
        return;
      }
      const dest =
        role === "CASERITA" ? "/caserita/onboarding" : "/comprador/mapa";
      window.location.assign(dest);
    } catch {
      /* error below */
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-white pb-8">
      <PageTopBar backHref="/" />
      <div className="px-6 py-4">
        <div className="flex justify-center">
          <VivaLogo size="md" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold text-[#004d2c]">
          Crear cuenta
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Únete a VIVA Barrio
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Nombre completo"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María Pérez"
          />
          <Input
            label="Correo electrónico"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@correo.com"
          />
          <PasswordInput
            id="registro-password"
            label="Contraseña"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              ¿Cuál es tu perfil?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                selected={role === "COMPRADOR"}
                onClick={() => setRole("COMPRADOR")}
                icon={<IconCart size={32} />}
                label="Soy Comprador"
              />
              <RoleOption
                selected={role === "CASERITA"}
                onClick={() => setRole("CASERITA")}
                icon={<IconStore size={32} />}
                label="Soy Caserita"
              />
            </div>
          </div>

          {register.error && (
            <p className="text-sm text-red-600">{register.error.message}</p>
          )}

          <Button type="submit" fullWidth disabled={register.isPending}>
            {register.isPending ? "Creando…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-[#007a4d]">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

function RoleOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center rounded-xl border-2 p-4 transition ${
        selected ?
          "border-[#007a4d] bg-[#f0f9f4]"
        : "border-gray-200 bg-white"
      }`}
    >
      <span className={`flex justify-center ${selected ? "" : "opacity-60"}`}>
        {icon}
      </span>
      <p
        className={`mt-2 text-center text-xs font-bold ${
          selected ? "text-[#004d2c]" : "text-gray-600"
        }`}
      >
        {label}
      </p>
    </button>
  );
}
