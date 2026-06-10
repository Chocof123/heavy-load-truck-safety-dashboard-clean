import { Moon, Sun } from "lucide-react";
import { Theme } from "../theme/ThemeContext";

export type { Theme };

interface Props {
  theme: Theme;
  onChange: (t: Theme) => void;
}

const OPTS: { key: Theme; label: string; icon: typeof Moon }[] = [
  { key: "immersive", label: "沉浸", icon: Moon },
  { key: "bright", label: "明亮", icon: Sun },
];

export default function ThemeToggle({ theme, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-panel/60 p-0.5 ring-1 ring-cyan-glow/25">
      {OPTS.map(({ key, label, icon: Icon }) => {
        const active = theme === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              active
                ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50 shadow-glow"
                : "text-cyan-glow/50 hover:text-cyan-glow/80"
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
