import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");
  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-gray-600"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${className}`}
        {...props}
      />
    </div>
  );
}
