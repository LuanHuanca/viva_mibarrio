type ProgressBarProps = {
  actual: number;
  meta: number;
  label?: string;
};

export function ProgressBar({ actual, meta, label }: ProgressBarProps) {
  const pct = meta > 0 ? Math.min(100, Math.round((actual / meta) * 100)) : 0;

  return (
    <div className="w-full">
      {label && (
        <p className="mb-2 text-sm font-medium text-emerald-900">{label}</p>
      )}
      <div className="h-4 w-full overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm text-emerald-800">
        <span className="font-bold">{actual}</span> / {meta} vecinos únicos
        {meta - actual > 0 && (
          <span className="text-emerald-600"> · faltan {meta - actual}</span>
        )}
      </p>
    </div>
  );
}
