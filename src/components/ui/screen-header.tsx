import Link from "next/link";
import type { ReactNode } from "react";

import { IconBack } from "~/components/ui/icons";

export function ScreenHeader({
  title,
  backHref,
  right,
}: {
  title: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <header className="relative z-40 flex items-center gap-3 rounded-b-3xl bg-[#007a4d] px-4 py-3.5 text-white shadow-sm">
      {backHref ?
        <Link
          href={backHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15"
          aria-label="Volver"
        >
          <IconBack className="text-white" size={20} />
        </Link>
      : <span className="w-9" />}
      <h1 className="flex-1 text-center text-lg font-bold">{title}</h1>
      {right ?? <span className="w-9" />}
    </header>
  );
}
