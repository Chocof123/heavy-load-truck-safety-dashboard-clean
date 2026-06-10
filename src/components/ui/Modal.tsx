import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** width class, defaults to a comfortable medium dialog */
  widthClass?: string;
}

/** Reusable glassmorphic modal — themed cyan/navy with neon rim. */
export default function Modal({
  open,
  title,
  subtitle,
  badge,
  onClose,
  children,
  widthClass = "w-[560px]",
}: Props) {
  const bright = useTheme() === "bright";
  if (!open) return null;
  // portal to body so the modal escapes the dashboard's scale()/backdrop-filter
  // ancestors and centers over the full real-size viewport.
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${bright ? "theme-bright" : ""}`}
      style={{ background: "rgba(4,9,18,0.62)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className={`glass-card max-h-[86vh] ${widthClass} flex flex-col shadow-glow-strong`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-cyan-glow/20 px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] font-bold text-ink">{title}</h3>
              {badge}
            </div>
            {subtitle && (
              <div className="mt-0.5 truncate text-[11px] text-cyan-glow/60">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-cyan-glow/70 ring-1 ring-cyan-glow/25 transition hover:bg-cyan-glow/10 hover:text-accent"
          >
            <X size={15} />
          </button>
        </header>
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
