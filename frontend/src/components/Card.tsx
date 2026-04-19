interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Card({ children, className = "", id }: CardProps) {
  return (
    <div
      id={id}
      className={`bg-oria-card rounded-xl p-5 border border-oria backdrop-blur-[18px] shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
