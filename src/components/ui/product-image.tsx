import Image from "next/image";

import { getProductImageSrc } from "~/lib/product-visual";

export function ProductImage({
  nombre,
  size = "md",
  className = "",
  fillFrame = false,
}: {
  nombre: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fillFrame?: boolean;
}) {
  const src = getProductImageSrc(nombre);
  const dims =
    size === "sm" ? { w: 56, h: 56, box: "h-14 w-14 rounded-xl" }
    : size === "lg" ? { w: 96, h: 96, box: "h-24 w-24 rounded-2xl" }
    : size === "xl" ? { w: 112, h: 112, box: "h-28 w-28 rounded-2xl" }
    : { w: 80, h: 80, box: "h-20 w-20 rounded-2xl" };

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${dims.box} ${
        fillFrame ? "bg-gray-100" : "border border-gray-100 bg-gray-50"
      } ${className}`}
    >
      <Image
        src={src}
        alt={nombre}
        width={dims.w}
        height={dims.h}
        className={
          fillFrame ?
            "h-full w-full object-cover"
          : "h-full w-full object-contain p-0.5"
        }
      />
    </div>
  );
}
