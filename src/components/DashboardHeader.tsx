import { Activity, Clock, LogOut } from "lucide-react";
import ThemeToggle, { Theme } from "./ThemeToggle";
import LiveClock from "./ui/LiveClock";

interface Props {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  title: string;
  /** small system badge text on the left (no English subtitle for fleet board) */
  badge?: string;
  onLogout: () => void;
}

export default function DashboardHeader({
  theme,
  onThemeChange,
  title,
  badge,
  onLogout,
}: Props) {
  return (
    <header
      className="relative z-10 flex h-[64px] items-center justify-between px-6 backdrop-blur"
      style={{
        background: "linear-gradient(180deg, var(--card-from), var(--card-to))",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      {/* left: theme switch + system badge */}
      <div className="flex shrink-0 items-center gap-3 text-cyan-glow/80">
        <ThemeToggle theme={theme} onChange={onThemeChange} />
        {badge && (
          <span className="hidden font-mono text-xs tracking-[0.2em] text-cyan-glow/60 xl:flex xl:items-center xl:gap-1.5">
            <Activity size={15} className="text-accent" />
            {badge}
          </span>
        )}
      </div>

      {/* center: title */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center">
        <h1
          className="whitespace-nowrap bg-clip-text text-[26px] font-extrabold tracking-[0.26em] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--title-grad-a), var(--title-grad-b))",
            filter: "drop-shadow(0 0 12px rgb(var(--accent-rgb) / 0.3))",
          }}
        >
          {title}
        </h1>
        <div className="mx-auto mt-1 h-[2px] w-56 bg-gradient-to-r from-transparent via-cyan-glow to-transparent" />
      </div>

      {/* right: live clock + logout */}
      <div className="flex shrink-0 items-center justify-end gap-3 whitespace-nowrap text-xs text-cyan-glow/70">
        <span className="flex items-center gap-1.5">
          <Clock size={14} className="shrink-0 text-accent" />
          <span className="neon-label">当前时间</span>
          <LiveClock />
        </span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 rounded-md bg-panel/60 px-2.5 py-1 text-cyan-glow/80 ring-1 ring-cyan-glow/25 transition hover:bg-red-500/15 hover:text-red-300 hover:ring-red-400/40"
        >
          <LogOut size={13} />
          退出登录
        </button>
      </div>
    </header>
  );
}
