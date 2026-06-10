import { ReactNode } from "react";

interface CardProps {
  title?: string;
  icon?: ReactNode;
  right?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export default function Card({
  title,
  icon,
  right,
  className = "",
  bodyClassName = "",
  children,
}: CardProps) {
  return (
    <section className={`glass-card flex min-h-0 flex-col ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-glow/12 text-accent ring-1 ring-cyan-glow/30">
                {icon}
              </span>
            )}
            <h2 className="card-title">{title}</h2>
          </div>
          {right}
        </header>
      )}
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
