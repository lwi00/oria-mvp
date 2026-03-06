"use client";

interface AvatarProps {
  initials: string;
  size?: number;
  highlight?: boolean;
}

export function Avatar({ initials, size = 36, highlight = false }: AvatarProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        background: highlight
          ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
          : "linear-gradient(135deg, #ddd6fe, #c4b5fd)",
        fontSize: size * 0.36,
        color: highlight ? "#ffffff" : "#7c3aed",
        letterSpacing: "-0.02em",
        boxShadow: highlight ? "0 2px 12px rgba(124,58,237,0.25)" : "none",
      }}
    >
      {initials}
    </div>
  );
}
