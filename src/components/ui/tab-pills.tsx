"use client";

import Link from "next/link";

type Tab = { id: string; label: string; href?: string };

export function TabPills({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Tab[];
  activeId: string;
  onChange?: (id: string) => void;
}) {
  return (
    <div className="mx-4 flex rounded-full bg-viva-soft p-1">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const className = `flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition ${
          active ?
            "bg-[#e8f5ec] text-[#007a4d] shadow-sm"
          : "text-gray-500"
        }`;

        if (tab.href) {
          return (
            <Link key={tab.id} href={tab.href} className={className}>
              {tab.label}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={className}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
