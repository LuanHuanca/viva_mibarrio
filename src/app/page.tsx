import Image from "next/image";

import { auth } from "~/server/auth";
import { ButtonLink } from "~/components/ui/button";
import { VivaLogo } from "~/components/ui/viva-logo";
import { graphics } from "~/lib/graphics";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-lg flex-col overflow-hidden bg-[#003d28]">
      <section className="relative min-h-0 flex-1">
        <Image
          src="/login_background.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 512px) 100vw, 512px"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#007a4d]/85 via-[#006b44]/70 to-[#003d28]" />

        <div className="relative z-10 flex h-full flex-col items-center px-6 pt-12 text-center">
          <VivaLogo size="xl" className="drop-shadow-md" />
          <p className="mt-2 text-sm font-medium text-white/95">
            VIVA App · Módulo Barrio
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/85">
            Conectamos tu barrio con beneficios reales
          </p>
        </div>
      </section>

      <section className="relative shrink-0 bg-[#003d28] px-6 pb-8 pt-6">
        <div
          className="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-transparent to-[#003d28]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-20"
          aria-hidden
        >
          <Image
            src={graphics.decor.elemento1}
            alt=""
            fill
            className="object-cover object-bottom"
          />
        </div>

        <div className="relative z-10 space-y-3">
          {session ?
            <ButtonLink href="/api/auth/signout" variant="white" fullWidth>
              Cerrar sesión
            </ButtonLink>
          : <>
              <ButtonLink href="/login" fullWidth>
                Iniciar sesión
              </ButtonLink>
              <ButtonLink href="/registro" variant="white" fullWidth>
                Registrarse
              </ButtonLink>
            </>
          }
        </div>

        <p className="relative z-10 mt-5 text-center text-xs text-white/55">
          Hecho en Cochabamba, para Bolivia
        </p>
      </section>
    </main>
  );
}
