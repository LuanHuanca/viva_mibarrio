import Image from "next/image";
import type { ReactNode } from "react";

type EmptyStateProps = {
  imageSrc: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  imageSrc,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="relative h-40 w-40">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-contain"
          sizes="160px"
        />
      </div>
      <h2 className="mt-4 text-lg font-bold text-[#004d2c]">{title}</h2>
      {description && (
        <p className="mt-2 max-w-xs text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
