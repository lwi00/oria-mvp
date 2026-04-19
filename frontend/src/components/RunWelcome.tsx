"use client";

import { useEffect, useRef, useState } from "react";

const QUOTES = [
  "Every step counts.",
  "You showed up. That's what matters.",
  "Consistency beats intensity.",
  "Your future self thanks you.",
  "One run closer to your goal.",
  "The hardest part was lacing up.",
  "Progress, not perfection.",
  "You're building something real.",
];

const COLORS = ["#8B5CF6", "#A78BFA", "#FC4C02", "#F59E0B", "#10B981", "#FCD34D", "#F5F5F7", "#E9D5FF"];

// Pre-compute confetti so it's stable across renders
const CONFETTI = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  const dist = 150 + (i * 7) % 200;
  return {
    tx: Math.round(Math.cos(angle) * dist),
    ty: Math.round(Math.sin(angle) * dist - 80),
    rot: (i * 47) % 360 + 360,
    size: 4 + (i % 5),
    color: COLORS[i % COLORS.length],
    delay: (i * 0.015),
  };
});

interface RunWelcomeProps {
  distanceKm: number;
  targetKm: number;
  streakCount: number;
  goalMet: boolean;
  onDone: () => void;
}

export function RunWelcome({ distanceKm, targetKm, streakCount, goalMet, onDone }: RunWelcomeProps) {
  const [visible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [counted, setCounted] = useState(0);
  const dismissed = useRef(false);
  const quote = useRef(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const pct = Math.min(100, Math.round((distanceKm / targetKm) * 100));

  // Single timeline — no dependencies that change
  useEffect(() => {
    // Phase 1: show content
    const t1 = setTimeout(() => setShowContent(true), 200);
    // Phase 2: show progress bar
    const t2 = setTimeout(() => setShowBar(true), 1800);
    // Phase 3: auto-dismiss
    const t3 = setTimeout(() => {
      if (!dismissed.current) {
        dismissed.current = true;
        setVisible(false);
        setTimeout(onDone, 400);
      }
    }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Count-up — runs once
  useEffect(() => {
    if (!showContent) return;
    const duration = 1000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t) * (1 - t);
      setCounted(eased * distanceKm);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showContent, distanceKm]);

  const handleDismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setVisible(false);
    setTimeout(onDone, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleDismiss}
      style={{
        background: "linear-gradient(160deg, #0d0818 0%, #1a0d3a 40%, #0d0818 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: goalMet
            ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(252,76,2,0.25) 0%, transparent 65%)",
        }}
      />

      {/* Confetti — stable positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CONFETTI.map((c, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-[35%] rounded-sm"
            style={{
              width: c.size,
              height: c.size * 0.6,
              backgroundColor: c.color,
              opacity: 0,
              animation: `confetti-fall 1.6s ease-out ${c.delay}s forwards`,
              "--tx": `${c.tx}px`,
              "--ty": `${c.ty}px`,
              "--rot": `${c.rot}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center gap-5 px-8 max-w-[340px]"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Emoji */}
        <div className="text-[72px] leading-none" style={{ animation: "bounceIn 0.5s ease-out" }}>
          {goalMet ? "🏆" : "🔥"}
        </div>

        {/* Distance */}
        <div className="text-center">
          <p className="text-[56px] font-extrabold text-white leading-none tracking-tight tabular-nums">
            {counted.toFixed(1)}
          </p>
          <p className="text-[16px] text-white/50 font-semibold mt-1 uppercase tracking-[0.2em]">
            kilometers
          </p>
        </div>

        {/* Goal progress — appears after delay */}
        <div
          className="w-full"
          style={{
            opacity: showBar ? 1 : 0,
            transform: showBar ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.5s ease-out",
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] text-white/50 font-medium">Weekly goal</span>
            <span className="text-[12px] text-white/70 font-bold tabular-nums">
              {distanceKm.toFixed(1)} / {targetKm} km
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full animate-bar ${goalMet ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-orange-500 to-amber-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {goalMet && (
            <p className="text-[13px] text-emerald-400 font-semibold mt-2 text-center">
              Goal complete!
            </p>
          )}
        </div>

        {/* Streak */}
        {streakCount > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15"
            style={{
              opacity: showBar ? 1 : 0,
              transition: "opacity 0.4s ease-out 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FC4C02" stroke="none">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 0016 0C20 9.9 18.02 6.24 13.5.67z" />
            </svg>
            <span className="text-[15px] font-bold text-white tabular-nums">
              {streakCount}w streak
            </span>
          </div>
        )}

        {/* Quote */}
        <p
          className="text-[14px] text-white/40 font-medium text-center italic"
          style={{
            opacity: showBar ? 1 : 0,
            transition: "opacity 0.5s ease-out 0.3s",
          }}
        >
          {quote.current}
        </p>

        {/* Dismiss hint */}
        <p className="text-[11px] text-white/20 mt-1">
          Tap to continue
        </p>
      </div>
    </div>
  );
}
