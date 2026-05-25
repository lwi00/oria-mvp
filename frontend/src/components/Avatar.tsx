"use client";

import { userColor } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: number;
  highlight?: boolean;
  src?: string | null;
  /// When set (and no src / not highlighted), tints the avatar with a stable
  /// per-user color so the same person reads the same across the feed.
  colorSeed?: string;
}

export function Avatar({ initials, size = 36, highlight = false, src, colorSeed }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={initials}
        className="flex-shrink-0 rounded-full object-cover"
        style={{
          width: size,
          height: size,
          border: highlight ? "2px solid #A78BFA" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: highlight ? "0 4px 16px rgba(139,92,246,0.4)" : "none",
        }}
      />
    );
  }

  const noName = !initials || initials === "??";
  const tint = colorSeed && !highlight ? userColor(colorSeed) : null;
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold select-none"
      style={{
        width: size,
        height: size,
        background: highlight
          ? "linear-gradient(135deg, #A78BFA, #6D28D9)"
          : tint
            ? `linear-gradient(135deg, ${tint.from}, ${tint.to})`
            : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
        fontSize: size * 0.38,
        color: highlight ? "#ffffff" : tint ? tint.text : "#E9D5FF",
        letterSpacing: "-0.02em",
        border: highlight ? "none" : tint ? `1px solid ${tint.soft}` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: highlight ? "0 4px 16px rgba(139,92,246,0.4)" : "none",
      }}
    >
      {noName ? (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        initials
      )}
    </div>
  );
}
