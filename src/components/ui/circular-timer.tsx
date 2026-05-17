export function CircularTimer({
  seconds,
  total,
  size = 88,
  label,
}: {
  seconds: number;
  total: number;
  size?: number;
  label?: string;
}) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, seconds / total));
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#4ade80"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white"
          style={{ fontSize: size * 0.32 }}
        >
          {String(seconds).padStart(2, "0")}
        </span>
      </div>
      {label && <p className="text-sm text-white/90">{label}</p>}
    </div>
  );
}
