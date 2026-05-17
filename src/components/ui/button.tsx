import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-[#007a4d] text-white shadow-md shadow-[#007a4d]/25 hover:bg-[#006b44]",
  secondary: "border-2 border-[#007a4d] bg-white text-[#007a4d] hover:bg-emerald-50",
  ghost: "bg-transparent text-[#007a4d] hover:bg-emerald-50",
  dark: "bg-[#004d2c] text-white hover:bg-[#003d24]",
  white: "bg-white text-[#004d2c] hover:bg-gray-50",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-xl px-6 py-3.5 text-center text-sm font-bold transition ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className} disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  fullWidth,
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-xl px-6 py-3.5 text-center text-sm font-bold transition ${variants[variant]} ${fullWidth ? "w-full block" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}
