"use client";

import { useState, useEffect } from "react";

interface MiniJarProps {
  fill?: number;
  size?: number;
}

export function MiniJar({ fill = 65, size = 100 }: MiniJarProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(fill), 300);
    return () => clearTimeout(timer);
  }, [fill]);

  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4}>
      <defs>
        <linearGradient id="mjG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="mjC">
          <path d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z" />
        </clipPath>
      </defs>
      <path
        d="M45 70 Q45 60 55 55 L75 50 Q80 45 80 38 L120 38 Q120 45 125 50 L145 55 Q155 60 155 70 L155 230 Q155 250 135 255 L65 255 Q45 250 45 230 Z"
        fill="rgba(124,58,237,0.06)"
        stroke="rgba(124,58,237,0.15)"
        strokeWidth="1.5"
      />
      <g clipPath="url(#mjC)">
        <rect
          x="40"
          y={255 - (animated / 100) * 220}
          width="120"
          height={(animated / 100) * 220 + 5}
          fill="url(#mjG)"
          className="transition-all duration-[1500ms] ease-oria-bounce"
        />
        <ellipse
          cx="100"
          cy={255 - (animated / 100) * 220}
          rx="56"
          ry="5"
          fill="rgba(196,181,253,0.45)"
          className="transition-all duration-[1500ms] ease-oria-bounce"
        />
      </g>
      <rect x="70" y="30" width="60" height="10" rx="3" fill="rgba(124,58,237,0.2)" />
      <line x1="60" y1="80" x2="60" y2="170" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
