import { AlertOctagon, MapPin, CloudRain, Scale, Activity } from "lucide-react";
import { personalDeepReview as d } from "../data/mockData";

const RISK_COLOR = {
  safe: "#41e08a",
  warn: "#f5c451",
  danger: "#ff6b6b",
};

export default function PersonalDeepReview() {
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-1">
      {/* header */}
      <div className="rounded-lg bg-panel/60 p-2.5 ring-1 ring-red-400/30">
        <div className="flex items-center gap-2">
          <AlertOctagon size={16} className="shrink-0 text-red-400" />
          <span className="text-[13px] font-bold text-ink">{d.title}</span>
          <span className="ml-auto rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-300 ring-1 ring-red-400/40">
            {d.severity}危 · {d.responsibility}
          </span>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px] text-cyan-glow/75">
          <span className="flex items-center gap-1">
            <Activity size={11} className="text-accent" />
            {d.time}
          </span>
          <span className="flex items-center gap-1">
            <CloudRain size={11} className="text-accent" />
            {d.weather}
          </span>
          <span className="col-span-2 flex items-center gap-1">
            <MapPin size={11} className="text-accent" />
            {d.location}
          </span>
          <span className="col-span-2 flex items-center gap-1">
            <Scale size={11} className="text-accent" />
            {d.casualties}
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px] leading-snug text-ink/80">{d.summary}</p>
      </div>

      {/* timeline */}
      <div className="mt-2">
        <div className="mb-1 text-[11px] font-semibold text-accent">关键帧时间线</div>
        <div className="relative ml-1 border-l border-cyan-glow/20 pl-3">
          {d.frames.map((f, i) => (
            <div key={i} className="relative pb-1.5 last:pb-0">
              <span
                className="absolute -left-[15px] top-1 h-2 w-2 rounded-full ring-2 ring-panel"
                style={{ background: RISK_COLOR[f.risk] }}
              />
              <div className="flex items-baseline gap-2">
                <span className="w-9 shrink-0 font-mono text-[11px]" style={{ color: RISK_COLOR[f.risk] }}>
                  {f.t}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-cyan-glow/60">{f.speed}</span>
                <span className="text-[10.5px] text-ink/85">{f.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* metrics */}
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {d.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-md bg-panel/55 px-1.5 py-1 text-center ring-1 ring-cyan-glow/15"
          >
            <div className="text-[9px] text-cyan-glow/55">{m.label}</div>
            <div className="font-mono text-[13px] font-bold text-ink">{m.value}</div>
          </div>
        ))}
      </div>

      {/* causes + improvements */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-[11px] font-semibold text-[#ff8f8f]">事故主因</div>
          <ul className="space-y-0.5">
            {d.rootCauses.map((c) => (
              <li key={c} className="flex items-start gap-1 text-[10.5px] text-ink/80">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-[11px] font-semibold text-[#8fe9b8]">整改建议</div>
          <ul className="space-y-0.5">
            {d.improvements.map((c) => (
              <li key={c} className="flex items-start gap-1 text-[10.5px] text-ink/80">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
