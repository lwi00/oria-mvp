"use client";

import { useEffect, useState } from "react";

const FACTS = [
  "Usain Bolt's top speed was 27.8 mph — a 2:09/mile pace.",
  "Running 5 minutes a day adds an average of 3 years to your life.",
  "Your foot has 26 bones and 33 joints — all firing on every stride.",
  "Elite runners maintain exactly 180 steps per minute, like a metronome.",
  "The marathon distance was set in 1908 to end at King Edward VII's royal box.",
  "Running releases BDNF — the molecule that literally grows new brain cells.",
  "More humans have finished a marathon than have ever climbed Everest.",
  "Your heart pumps up to 8 gallons of blood per minute at full effort.",
  "The Kalenjin people of Kenya produce ~40% of the world's top distance runners.",
  "A single marathon step generates 3× your body weight in ground force.",
  "Running in cold weather burns significantly more calories than in warm air.",
  "The first Olympic marathon in 1896 was run on dirt roads in 2h 58m.",
  "Your body switches to fat-burning mode after just 20 minutes of steady running.",
  "Kenyan runners train at altitude above 2,400m — thickening their blood naturally.",
  "The world record marathon pace is a 4:34/mile for 26.2 miles straight.",
];

const STAR_CONFIG = [
  { top: 8,  left: 12, dur: 1.4, delay: 0.0, w: 90  },
  { top: 22, left: 65, dur: 1.1, delay: 1.7, w: 70  },
  { top: 5,  left: 40, dur: 1.6, delay: 0.8, w: 110 },
  { top: 35, left: 80, dur: 0.9, delay: 2.5, w: 60  },
  { top: 50, left: 5,  dur: 1.3, delay: 1.2, w: 80  },
  { top: 15, left: 90, dur: 1.0, delay: 3.1, w: 65  },
  { top: 70, left: 30, dur: 1.5, delay: 0.4, w: 95  },
  { top: 60, left: 55, dur: 1.2, delay: 2.0, w: 75  },
  { top: 80, left: 75, dur: 1.7, delay: 1.0, w: 105 },
  { top: 42, left: 18, dur: 1.0, delay: 3.5, w: 55  },
  { top: 90, left: 45, dur: 1.4, delay: 0.6, w: 85  },
  { top: 28, left: 95, dur: 1.1, delay: 2.8, w: 72  },
];

export default function Loading() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Randomize only on client to avoid SSR hydration mismatch
    setFactIndex(Math.floor(Math.random() * FACTS.length));
    const id = setInterval(() => {
      setFactIndex((i) => (i + 1) % FACTS.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
         style={{ background: "linear-gradient(160deg, #0d0818 0%, #140d2e 50%, #0a0620 100%)" }}>

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }} />

      {/* Shooting stars */}
      {STAR_CONFIG.map((s, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.w}px`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center oria-logo-glow"
               style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white text-4xl font-bold tracking-tight select-none">Oria</span>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              style={{
                animation: "pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Running fact */}
        <div className="max-w-[260px] text-center min-h-[60px] flex items-center justify-center">
          <p
            key={factIndex}
            className="fact-animate text-purple-300 text-sm font-medium leading-relaxed"
          >
            {FACTS[factIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
