"use client";

import Link from "next/link";

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  tint?: "purple" | "gold" | "sport" | "neutral";
  disabled?: boolean;
}

const tintMap = {
  purple:  { bg: "bg-accent-purple/15",  ring: "border-accent-purple/25",  text: "text-accent-purple-bright" },
  gold:    { bg: "bg-accent-gold/15",    ring: "border-accent-gold/25",    text: "text-accent-gold" },
  sport:   { bg: "bg-accent-sport/15",   ring: "border-accent-sport/25",   text: "text-accent-sport" },
  neutral: { bg: "bg-oria-chip",         ring: "border-oria",              text: "text-text-primary" },
};

export function QuickAction({ label, icon, onClick, href, tint = "purple", disabled }: QuickActionProps) {
  const t = tintMap[tint];

  const content = (
    <>
      <span
        className={`w-[52px] h-[52px] rounded-full ${t.bg} border ${t.ring} ${t.text} flex items-center justify-center transition-transform active:scale-95`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium text-text-secondary leading-tight text-center">
        {label}
      </span>
    </>
  );

  const shared =
    "flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 disabled:opacity-40 disabled:cursor-not-allowed";

  if (href && !disabled) {
    return (
      <Link href={href} aria-label={label} className={shared}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={shared}
    >
      {content}
    </button>
  );
}
