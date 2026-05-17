import Link from "next/link";
import type { ReactNode } from "react";

import { IconChevronRight } from "~/components/ui/icons";

export function MenuRow({
  href,
  icon,
  label,
  danger,
  onClick,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          danger ? "bg-red-50" : "bg-viva-soft"
        }`}
      >
        {icon}
      </span>
      <span
        className={`flex-1 text-sm font-medium ${
          danger ? "text-red-600" : "text-gray-800"
        }`}
      >
        {label}
      </span>
      {!danger && <IconChevronRight className="text-gray-300" size={18} />}
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition hover:bg-viva-soft/60";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      {inner}
    </Link>
  );
}
