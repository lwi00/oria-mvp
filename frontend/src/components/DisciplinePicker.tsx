"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Discipline chip rendered next to the balance on Home. Tap opens a full-
 * screen overlay (blurred backdrop) with the 4 disciplines as floating cards
 * in a 2x2 grid — Running active, the others "Coming soon".
 */
export function DisciplinePicker() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the overlay is up + escape-to-close
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
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
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {mounted &&
        open &&
        createPortal(<DisciplineOverlay onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function DisciplineOverlay({ onClose }: { onClose: () => void }) {
  // Drive the enter-animation by toggling a "visible" class one tick after mount.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[200] flex items-center justify-center px-6 transition-all duration-300 ease-out ${
        visible
          ? "bg-black/55 backdrop-blur-xl opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0"
      }`}
      style={{ WebkitBackdropFilter: visible ? "blur(20px)" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="Choose discipline"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[420px] flex flex-col items-center gap-5 transition-all duration-400 ease-out ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-purple-bright/80 mb-1.5">
            Discipline
          </p>
          <h2 className="text-[22px] font-extrabold text-white tracking-tight">
            Choose what you train
          </h2>
          <p className="text-[12px] text-text-muted mt-1.5">
            Running is live today — more disciplines arriving soon.
          </p>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <DisciplineTile label="Running" icon={<RunningIcon size={28} />} active delay={0} />
          <DisciplineTile label="Cycling" icon={<BikeIcon size={28} />} delay={60} />
          <DisciplineTile label="Sleep" icon={<SleepIcon size={28} />} delay={120} />
          <DisciplineTile label="Walking" icon={<WalkIcon size={28} />} delay={180} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-2 text-[12px] font-semibold text-text-muted hover:text-white transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DisciplineTile({
  label,
  icon,
  active,
  delay = 0,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  delay?: number;
}) {
  // Each tile fades + lifts on enter, staggered by `delay` ms.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative aspect-square rounded-2xl overflow-hidden border transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        active
          ? "bg-gradient-to-br from-accent-purple/30 via-accent-purple/12 to-transparent border-accent-purple/40 shadow-[0_12px_36px_rgba(124,58,237,0.4)]"
          : "bg-white/[0.04] border-white/10 opacity-90"
      }`}
      style={{ transitionDelay: visible ? "0ms" : `${delay}ms` }}
      aria-disabled={!active}
    >
      {/* Subtle ambient glow on the active tile */}
      {active && (
        <div
          className="absolute -top-12 -right-12 w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            active
              ? "bg-accent-purple/25 text-accent-purple-bright shadow-button"
              : "bg-oria-chip text-text-secondary"
          }`}
        >
          {icon}
        </div>
        <p className={`text-[15px] font-bold ${active ? "text-white" : "text-text-secondary"}`}>
          {label}
        </p>
      </div>

      {/* Badge */}
      <span
        className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          active
            ? "bg-success-500/15 border-success-500/30 text-success-500"
            : "bg-accent-purple/20 border-accent-purple/30 text-accent-purple-bright"
        }`}
      >
        {active ? "Live" : "Soon"}
      </span>
    </div>
  );
}

/* ── Icons ── */
export function RunningIcon({ size = 14 }: { size?: number }) {
  // Material Symbols "directions_run" — a clearer running silhouette
  // (head + tilted torso + bent legs in motion) than the previous outline,
  // which looked more like a generic abstract shape.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
    </svg>
  );
}
export function BikeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  );
}
export function SleepIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
export function WalkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13" cy="4" r="2" />
      <path d="M9 20l3-6 2 2 4-1" />
      <path d="M6 8l3-1 3 5-3 3" />
    </svg>
  );
}
