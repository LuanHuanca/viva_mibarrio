import Image from "next/image";
import Link from "next/link";

const sizes = {
  sm: { w: 120, h: 48, className: "h-10 w-auto" },
  md: { w: 160, h: 64, className: "h-14 w-auto" },
  lg: { w: 220, h: 88, className: "h-20 w-auto" },
  xl: { w: 280, h: 112, className: "h-28 w-auto" },
} as const;

export function VivaLogo({
  size = "md",
  href,
  className = "",
}: {
  size?: keyof typeof sizes;
  href?: string;
  className?: string;
}) {
  const s = sizes[size];
  const img = (
    <Image
      src="/logo.png"
      alt="VIVA Barrio"
      width={s.w}
      height={s.h}
      className={`${s.className} object-contain ${className}`}
      priority
    />
  );

  if (href) return <Link href={href}>{img}</Link>;
  return img;
}

/** Logo sobre fondos claros (mismo asset) */
export function VivaLogoDark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizes;
}) {
  return <VivaLogo size={size} className={className} />;
}
