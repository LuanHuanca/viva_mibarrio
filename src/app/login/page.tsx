import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "~/components/login-form";
import { IconBack } from "~/components/ui/icons";
import { VivaLogo } from "~/components/ui/viva-logo";

export default function LoginPage() {
  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-[#003d28]">
      <section className="relative h-[32vh] max-h-[200px] shrink-0">
        <Image
          src="/login_background.png"
          alt=""
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 512px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#003d28]" />
        <Link
          href="/"
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm"
          aria-label="Volver al inicio"
        >
          <IconBack className="text-white" />
        </Link>
      </section>

      <section className="relative flex-1 px-4 pb-6">
        <div className="-mt-6 rounded-t-3xl bg-white px-5 py-5 shadow-xl">
          <div className="flex justify-center">
            <VivaLogo size="md" />
          </div>
          <h1 className="mt-3 text-center text-xl font-bold text-[#004d2c]">
            Iniciar sesión
          </h1>
          <p className="mt-0.5 text-center text-sm text-gray-500">
            Ingresa a tu cuenta
          </p>

          <Suspense
            fallback={
              <p className="mt-6 text-center text-sm text-gray-500">Cargando…</p>
            }
          >
            <LoginForm />
          </Suspense>

          <p className="mt-5 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-[#007a4d]">
              Registrarse
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
