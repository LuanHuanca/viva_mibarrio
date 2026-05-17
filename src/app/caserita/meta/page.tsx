"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { graphics } from "~/lib/graphics";
import { IconShare } from "~/components/ui/icons";
import { SectionTitle } from "~/components/ui/mobile-shell";
import { api } from "~/trpc/react";

export default function MetaAlcanzadaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: tienda, isLoading } = api.tienda.mine.useQuery();

  useEffect(() => {
    if (!isLoading && tienda === null) {
      router.replace("/caserita/onboarding");
    }
    if (!isLoading && tienda && !tienda.metaInternetAlcanzada) {
      router.replace("/caserita/dashboard");
    }
  }, [isLoading, tienda, router]);

  if (isLoading || !tienda) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#007a4d]">
        Cargando…
      </div>
    );
  }

  const nombre = session?.user?.name?.split(" ")[0] ?? "Caserita";

  return (
    <main className="min-h-screen bg-white pb-8">
      <SectionTitle>Meta alcanzada</SectionTitle>
      <div className="flex flex-col items-center px-6 py-6 text-center">
        <div className="relative h-52 w-full max-w-xs">
          <Image
            src={graphics.meta.alcanzada}
            alt="Meta alcanzada"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="mt-4 text-3xl font-black text-[#007a4d]">¡Meta alcanzada!</h1>
        <p className="mt-4 text-xl font-bold text-[#004d2c]">
          ¡Felicidades, {nombre}!
        </p>
        <p className="mt-3 max-w-sm text-gray-700">
          Alcanzaste los {tienda.metaUsuarios} vecinos únicos y ganaste{" "}
          <strong>internet gratis en casa</strong> este mes.
        </p>
        <p className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-600">
          Gracias por ser parte de
          <strong className="text-[#007a4d]"> VIVA Barrio</strong>
        </p>

        <button
          type="button"
          onClick={() => {
            void navigator.share?.({
              title: "VIVA Barrio",
              text: `¡Alcancé la meta de ${tienda.metaUsuarios} vecinos en ${tienda.nombreTienda}!`,
            });
          }}
          className="mt-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#007a4d] py-3.5 font-bold text-white"
        >
          <IconShare size={18} />
          Compartir logro
        </button>
        <Link
          href="/caserita/dashboard"
          className="mt-4 text-sm font-medium text-[#007a4d]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
