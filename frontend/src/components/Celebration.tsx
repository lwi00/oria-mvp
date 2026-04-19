"use client";

import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const COLORS = ["#8B5CF6", "#A78BFA", "#FC4C02", "#F59E0B", "#10B981", "#F5F5F7"];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 45,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 4,
    speedX: (Math.random() - 0.5) * 12,
    speedY: -(Math.random() * 8 + 4),
    opacity: 1,
  }));
}

interface CelebrationProps {
  show: boolean;
  onDone: () => void;
  streakCount?: number;
  distanceKm?: number;
  goalMet?: boolean;
}

export function Celebration({ show, onDone, streakCount, distanceKm, goalMet }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [phase, setPhase] = useState<"burst" | "stats" | "done">("burst");
  const [visible, setVisible] = useState(false);

  const start = useCallback(() => {
    setParticles(createParticles(40));
    setPhase("burst");
    setVisible(true);

    // After confetti burst, show stats
    setTimeout(() => setPhase("stats"), 600);
    // Auto-dismiss after 3s
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => {
        setVisible(false);
        onDone();
      }, 400);
    }, 3200);
  }, [onDone]);

  useEffect(() => {
    if (show) start();
  }, [show, start]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-400 ${phase === "done" ? "opacity-0" : "opacity-100"}`}
      onClick={() => { setPhase("done"); setTimeout(() => { setVisible(false); onDone(); }, 300); }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
              animation: `confetti-fall 1.8s ease-out forwards`,
              animationDelay: `${Math.random() * 0.2}s`,
              // CSS custom properties for unique trajectories
              "--tx": `${p.speedX * 20}px`,
              "--ty": `${p.speedY * 40}px`,
              "--rot": `${p.rotation + Math.random() * 720}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Center content */}
      <div className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-500 ${phase === "stats" ? "scale-100 opacity-100" : phase === "burst" ? "scale-50 opacity-0" : "scale-110 opacity-0"}`}>
        {/* Fire emoji burst */}
        <div className="text-[72px] animate-[bounceIn_0.5s_ease-out]">
          {goalMet ? "🎉" : "🏃‍♂️"}
        </div>

        {/* Main message */}
        <div className="text-center">
          {goalMet ? (
            <>
              <p className="text-[28px] font-extrabold text-white tracking-tight">
                Goal crushed!
              </p>
              <p className="text-[15px] text-white/70 mt-1">
                Weekly target complete
              </p>
            </>
          ) : (
            <>
              <p className="text-[28px] font-extrabold text-white tracking-tight">
                Nice run!
              </p>
              {distanceKm && (
                <p className="text-[15px] text-white/70 mt-1">
                  {distanceKm.toFixed(1)} km logged
                </p>
              )}
            </>
          )}
        </div>

        {/* Streak badge */}
        {streakCount !== undefined && streakCount > 0 && (
          <div className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FC4C02" stroke="none">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14a8 8 0 0016 0C20 9.9 18.02 6.24 13.5.67z" />
            </svg>
            <span className="text-[18px] font-extrabold text-white tabular-nums">
              {streakCount} week{streakCount > 1 ? "s" : ""} streak
            </span>
          </div>
        )}

        {/* Tap to dismiss hint */}
        <p className="text-[12px] text-white/40 mt-4 animate-pulse">
          Tap to dismiss
        </p>
      </div>
    </div>
  );
}
