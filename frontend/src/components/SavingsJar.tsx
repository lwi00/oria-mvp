"use client";

import { useState, useEffect } from "react";

interface SavingsJarProps {
  fillPercent?: number;
  streak?: number;
}

export function SavingsJar({ fillPercent = 65, streak = 6 }: SavingsJarProps) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnim(fillPercent), 400);
    return () => clearTimeout(timer);
  }, [fillPercent]);

  return (
    <div className="relative w-[240px] h-[320px]">
      <svg viewBox="0 0 200 280" width="240" height="320">
        <defs>
          <linearGradient id="jarGradLP" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="glassLP" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(124,58,237,0.06)" />
            <stop offset="100%" stopColor="rgba(196,181,253,0.08)" />
          </linearGradient>
          <clipPath id="jarClipLP">
            <path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" />
          </clipPath>
        </defs>
        <path
          d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z"
          fill="url(#glassLP)"
          stroke="rgba(124,58,237,0.15)"
          strokeWidth="1.5"
        />
        <g clipPath="url(#jarClipLP)">
          <rect
            x="40"
            y={255 - (anim / 100) * 220}
            width="120"
            height={(anim / 100) * 220 + 5}
            fill="url(#jarGradLP)"
            className="transition-all duration-[1800ms] ease-oria-bounce"
          />
          <ellipse
            cx="100"
            cy={255 - (anim / 100) * 220}
            rx="56"
            ry="5"
            fill="rgba(196,181,253,0.45)"
            className="transition-all duration-[1800ms] ease-oria-bounce"
          />
        </g>
        <rect x="70" y="30" width="60" height="10" rx="3" fill="rgba(124,58,237,0.2)" />
        <line x1="60" y1="80" x2="60" y2="170" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      {/* Streak badge */}
      <div className="absolute bottom-4 -right-2 w-[52px] h-[52px] rounded-full gradient-brand flex items-center justify-center shadow-button ring-4 ring-white/90">
        <span className="text-xl font-bold text-white">{streak}<span className="text-base">🔥</span></span>
      </div>
    </div>
  );
}
