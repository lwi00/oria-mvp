"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Discipline chip rendered next to the balance on Home.
 * Today the only live discipline is running; tap opens a popover that teases
 * the upcoming disciplines (cycling, sleep, walking) with "Coming soon" pills.
 */
export function DisciplinePicker() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Switch discipline"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent-purple/15 border border-accent-purple/30 text-accent-purple-bright shadow-button active:scale-95 transition-transform cursor-pointer"
      >
        <RunningIcon />
        <span className="text-[11px] font-bold tracking-wide">Running</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[110%] z-50 min-w-[220px] p-2 rounded-2xl bg-[#0F0F16] border border-oria shadow-card backdrop-blur-md"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-3 pt-1 pb-2">
            Active
          </p>
          <DisciplineRow active label="Running" icon={<RunningIcon />} />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted px-3 pt-3 pb-2">
            Coming soon
          </p>
          <DisciplineRow label="Cycling" icon={<BikeIcon />} />
          <DisciplineRow label="Sleep" icon={<SleepIcon />} />
          <DisciplineRow label="Walking" icon={<WalkIcon />} />
        </div>
      )}
    </div>
  );
}

function DisciplineRow({ active, label, icon }: { active?: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
        active
          ? "bg-accent-purple/15 border border-accent-purple/25"
          : "opacity-70"
      }`}
    >
      <span
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
          active
            ? "bg-accent-purple/25 text-accent-purple-bright"
            : "bg-oria-chip text-text-secondary"
        }`}
      >
        {icon}
      </span>
      <span className={`text-[13px] font-semibold flex-1 ${active ? "text-text-primary" : "text-text-secondary"}`}>
        {label}
      </span>
      {active ? (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success-500/15 border border-success-500/25 text-success-500">
          Live
        </span>
      ) : (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-purple/20 border border-accent-purple/25 text-accent-purple-bright">
          Soon
        </span>
      )}
    </div>
  );
}

/* ── Icons ── */
function RunningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="4" r="2" />
      <path d="M15.59 13.51l2.66-2.66a1 1 0 00-1.42-1.42l-3.07 3.07a2 2 0 01-1.41.59H10.5L8 15.5" />
      <path d="M5.11 18.39A2 2 0 107.94 15.56L10.5 13H8l-4.5 4.5" />
      <path d="M17 14v6" />
    </svg>
  );
}
function BikeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  );
}
function SleepIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function WalkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="2" />
      <path d="M9 20l3-6 2 2 4-1" />
      <path d="M6 8l3-1 3 5-3 3" />
    </svg>
  );
}
