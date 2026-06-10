import { Film, Play } from "lucide-react";
import { ReplayDetail } from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

const fieldRows: { key: keyof ReplayDetail; label: string }[] = [
  { key: "time", label: "时间" },
  { key: "location", label: "地点" },
  { key: "parkingDuration", label: "停车时长" },
  { key: "hazardLight", label: "双闪状态" },
  { key: "accStatus", label: "ACC状态" },
];

export default function VideoReplayPanel({ replay }: { replay: ReplayDetail }) {
  const bright = useTheme() === "bright";
  return (
    <div className="flex h-full min-h-0 gap-2">
      {/* video placeholder */}
      <div className="flex w-[44%] flex-col">
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-accent">
          <Film size={13} /> 视频回放
        </div>
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg ring-1 ring-cyan-glow/20"
          style={{ background: bright ? "#dde7df" : "#000000" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: bright
                ? "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(30,90,60,0.10) 3px, rgba(30,90,60,0.10) 4px)"
                : "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(62,231,255,0.08) 3px, rgba(62,231,255,0.08) 4px)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-glow/15 ring-1 ring-cyan-glow/40">
              <Play size={16} className="translate-x-[1px] text-accent" />
            </span>
            <span className="text-[10px] text-cyan-glow/60">Placeholder Video</span>
            <span className="text-[10px] text-cyan-glow/40">暂无真实视频</span>
          </div>
          <div className="absolute left-1.5 top-1.5 z-10 rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-300 ring-1 ring-red-400/40">
            ● REC
          </div>
          <div className="absolute bottom-1.5 left-1.5 z-10 font-mono text-[9px] text-cyan-glow/60">
            {replay.time}
          </div>
        </div>
      </div>

      {/* event detail */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 text-[11px] font-semibold text-cyan-glow/80">事件详情</div>
        <div className="thin-scroll min-h-0 flex-1 space-y-1 overflow-y-auto rounded-lg bg-panel/55 p-2 ring-1 ring-cyan-glow/15">
          {fieldRows.map((f) => (
            <div key={f.key} className="flex gap-1.5 text-[10.5px]">
              <span className="w-14 shrink-0 text-cyan-glow/55">{f.label}</span>
              <span className="min-w-0 flex-1 text-ink/90">{replay[f.key]}</span>
            </div>
          ))}
          <div className="border-t border-cyan-glow/15 pt-1">
            <div className="text-[10.5px] text-cyan-glow/55">事故描述</div>
            <p className="mt-0.5 text-[10.5px] leading-snug text-ink/85">
              {replay.description}
            </p>
          </div>
          <div className="border-t border-cyan-glow/15 pt-1">
            <div className="text-[10.5px] text-cyan-glow/55">数据回放</div>
            <p className="mt-0.5 text-[10.5px] leading-snug text-amber-200/90">
              {replay.dataReplay}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
