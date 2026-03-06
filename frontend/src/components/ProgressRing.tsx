"use client";

import { useState, useEffect } from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
}

export function ProgressRing({ percent, size = 64, stroke = 5 }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percent), 400);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#ede9fe" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#7c3aed" strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ - (animated / 100) * circ}
          strokeLinecap="round"
          className="transition-all duration-[1200ms] ease-oria-bounce"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-purple-600 tabular-nums">
          {Math.round(animated)}%
        </span>
      </div>
    </div>
  );
}
