import { ShieldAlert, Clock4, MapPin } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { riskSummary } from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

const COLORS_DARK = ["#3ee7ff", "#f5c451", "#ff6b6b", "#6c7a99"];
const COLORS_LIGHT = ["#1f7fa0", "#c2871a", "#b5302a", "#7d8a74"];

export default function RiskCorrectionPanel() {
  const COLORS = useTheme() === "bright" ? COLORS_LIGHT : COLORS_DARK;
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1 flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-[#ff8f8f]">
        <ShieldAlert size={14} />
        问题整改
      </div>

      <div className="flex min-h-0 flex-1 items-center">
        {/* donut */}
        <div className="relative h-full w-[46%]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskSummary.topRisks}
                dataKey="value"
                nameKey="type"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="none"
              >
                {riskSummary.topRisks.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[9px] text-cyan-glow/50">主要风险</span>
            <span className="font-mono text-[13px] font-bold text-accent">
              {riskSummary.topRisks[0].type}
            </span>
          </div>
        </div>

        {/* legend + text */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 pl-1">
          {riskSummary.topRisks.map((r, i) => (
            <div key={r.type} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-cyan-glow/80">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                {r.type}
              </span>
              <span className="font-mono text-ink">{r.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1 shrink-0 space-y-0.5 border-t border-cyan-glow/15 pt-1 text-[10.5px] leading-tight">
        <div className="flex items-center gap-1 text-cyan-glow/70">
          <Clock4 size={11} className="text-[#f5c451]" />
          报警高发时段：
          <span className="font-semibold text-ink">{riskSummary.highRiskTime}</span>
        </div>
        <div className="flex items-start gap-1 text-cyan-glow/70">
          <MapPin size={11} className="mt-0.5 shrink-0 text-[#ff8f8f]" />
          报警高发路段：
          <span className="font-semibold text-ink">{riskSummary.highRiskRoad}</span>
        </div>
      </div>
    </div>
  );
}
