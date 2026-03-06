interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-oria-card rounded-xl p-5 border border-oria backdrop-blur-[12px] shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
