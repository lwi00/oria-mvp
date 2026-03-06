"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { id: "dashboard", path: "/dashboard", label: "Home", icon: "🏠" },
  { id: "social", path: "/social", label: "Social", icon: "👥" },
  { id: "challenges", path: "/challenges", label: "Challenges", icon: "🏆" },
  { id: "wallet", path: "/wallet", label: "Wallet", icon: "💰" },
];

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="sticky bottom-0 z-50 flex justify-around py-3 pb-4 bg-[rgba(255,255,255,0.9)] backdrop-blur-2xl border-t border-oria">
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-4 py-1 min-w-[44px] min-h-[44px]"
          >
            <span
              className={`text-xl ${active ? "" : "grayscale-[0.6] opacity-50"}`}
            >
              {tab.icon}
            </span>
            <span
              className={`text-[11px] ${
                active
                  ? "font-semibold text-purple-600"
                  : "font-normal text-text-muted"
              }`}
            >
              {tab.label}
            </span>
            {active && (
              <div className="w-1 h-1 rounded-full bg-purple-600 mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
