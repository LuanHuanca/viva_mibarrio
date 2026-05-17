const pieces = [
  { top: "8%", left: "12%", color: "#fbbf24", rotate: "12deg" },
  { top: "15%", left: "78%", color: "#4ade80", rotate: "-8deg" },
  { top: "22%", left: "45%", color: "#f472b6", rotate: "25deg" },
  { top: "10%", left: "60%", color: "#60a5fa", rotate: "-15deg" },
  { top: "28%", left: "20%", color: "#fb923c", rotate: "8deg" },
  { top: "18%", left: "88%", color: "#a3e635", rotate: "-20deg" },
];

export function ConfettiDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute h-2 w-3 rounded-sm opacity-90"
          style={{
            top: p.top,
            left: p.left,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
