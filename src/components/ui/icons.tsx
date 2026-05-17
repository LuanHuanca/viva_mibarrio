type IconProps = { className?: string; size?: number; strokeWidth?: number };

function Svg({
  children,
  className = "",
  size = 22,
  strokeWidth = 1.75,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconMenu({ className = "text-white", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </Svg>
  );
}

export function IconBell({ className = "text-white", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function IconSearch({ className = "text-gray-400", size = 18 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </Svg>
  );
}

export function IconBack({ className = "text-white", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

export function IconCart({ className = "text-[#007a4d]", size = 28 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

export function IconStore({ className = "text-[#007a4d]", size = 28 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </Svg>
  );
}

export function IconUser({ className = "text-[#007a4d]", size = 28 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function IconMapPin({ className = "text-[#007a4d]", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </Svg>
  );
}

export function IconWifi({ className = "text-[#007a4d]", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
    </Svg>
  );
}

export function IconEdit({ className = "text-[#007a4d]", size = 18 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Svg>
  );
}

export function IconShare({ className = "text-white", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </Svg>
  );
}

export function IconFlashlight({ className = "text-white", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M18 6 8 18" />
      <path d="m8 6 10 10" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
    </Svg>
  );
}

export function IconCheck({ className = "text-white", size = 40 }: IconProps) {
  return (
    <Svg className={className} size={size} strokeWidth={2}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function IconCheckCircle({ className = "text-[#007a4d]", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function IconAlert({ className = "text-amber-600", size = 40 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </Svg>
  );
}

export function IconQrScan({ className = "text-white", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </Svg>
  );
}

export function IconChevronRight({
  className = "text-gray-400",
  size = 20,
}: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function IconHelp({ className = "text-[#007a4d]", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function IconCreditCard({
  className = "text-[#007a4d]",
  size = 20,
}: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </Svg>
  );
}

export function IconLogout({ className = "text-red-600", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

export function IconPhone({ className = "text-[#007a4d]", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function IconMail({ className = "text-[#007a4d]", size = 20 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}

export function IconSettings({
  className = "text-[#1a2e35]",
  size = 20,
}: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function IconXCircle({ className = "text-gray-400", size = 22 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </Svg>
  );
}

export function IconHeart({ className = "text-[#007a4d]", size = 14 }: IconProps) {
  return (
    <Svg className={className} size={size}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

export type NavIconName = "map" | "tag" | "bag" | "user" | "home" | "chart";

export function NavIcon({
  name,
  active,
  size = 22,
}: {
  name: NavIconName;
  active: boolean;
  size?: number;
}) {
  const color = active ? "#007a4d" : "#9ca3af";
  const props = { className: "", size };

  switch (name) {
    case "map":
      return <IconMapPin className={color} size={size} />;
    case "tag":
      return (
        <Svg size={size}>
          <path
            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            stroke={color}
          />
        </Svg>
      );
    case "bag":
      return <IconCart className={color} size={size} />;
    case "user":
      return <IconUser className={color} size={size} />;
    case "home":
      return <IconStore className={color} size={size} />;
    case "chart":
      return (
        <Svg size={size}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={color} />
          <path d="M3 6h18" stroke={color} />
        </Svg>
      );
  }
}
