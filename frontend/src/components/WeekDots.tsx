"use client";

interface WeekDotsProps {
  days: (boolean | null)[];
}

const labels = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekDots({ days }: WeekDotsProps) {
  return (
    <div className="flex gap-1.5 justify-center">
      {days.map((met, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
              met === true
                ? "gradient-brand text-white shadow-[0_2px_8px_rgba(124,58,237,0.2)]"
                : met === false
                ? "bg-error-100 text-error-500"
                : "bg-purple-100 border-2 border-dashed border-oria text-text-muted"
            }`}
          >
            {met === true ? "✓" : met === false ? "✗" : "·"}
          </div>
          <span className="text-[10px] text-text-muted font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
