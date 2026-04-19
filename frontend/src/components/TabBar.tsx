"use client";

import { usePathname, useRouter } from "next/navigation";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SocialIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 000 4c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4a2 2 0 000-4h-2" />
      <path d="M6 3h12v6a6 6 0 01-12 0V3z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}

function WalletIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.3 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.16 : 0} />
      <path d="M16 2H8a2 2 0 00-2 2v2h12V4a2 2 0 00-2-2z" />
      <circle cx="17" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const tabs = [
  { id: "dashboard", path: "/dashboard", label: "Home", Icon: HomeIcon },
  { id: "social", path: "/social", label: "Friends", Icon: SocialIcon },
  { id: "challenges", path: "/challenges", label: "Challenges", Icon: TrophyIcon },
  { id: "wallet", path: "/wallet", label: "Wallet", Icon: WalletIcon },
];

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-50 pb-safe pt-2 px-3 bg-gradient-to-t from-oria-bg via-oria-bg/90 to-transparent">
      <nav
        aria-label="Primary"
        className="mx-auto max-w-[380px] flex justify-around items-center rounded-full bg-[rgba(15,15,22,0.85)] backdrop-blur-2xl border border-oria shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-2 py-1.5"
      >
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer px-4 py-2 min-w-[48px] rounded-full transition-all ${
                active ? "text-accent-purple-bright" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-full bg-accent-purple/15 pointer-events-none" />
              )}
              <tab.Icon active={active} />
              <span className={`text-[10px] leading-none ${active ? "font-semibold" : "font-normal"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
