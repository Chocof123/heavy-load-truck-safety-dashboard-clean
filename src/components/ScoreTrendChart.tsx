import { useState } from "react";
import { LineChart as LineIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  scoreTrendByGranularity,
  TrendGranularity,
} from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

const TABS: TrendGranularity[] = ["日K", "周K", "月K", "季K", "年K"];

export default function ScoreTrendChart() {
  const [tab, setTab] = useState<TrendGranularity>("月K");
  const data = scoreTrendByGranularity[tab];
  const bright = useTheme() === "bright";

  // theme-aware chart colors (readable on white in bright mode)
  const axis = bright ? "#5d7a68" : "#7fb4d8";
  const grid = bright ? "rgba(40,100,65,0.13)" : "rgba(120,200,255,0.08)";
  const legendText = bright ? "#274033" : "#bfe9ff";
  const cPersonal = bright ? "#1188aa" : "#3ee7ff";
  const cFleet = bright ? "#2f9e5e" : "#41e08a";
  const cCompany = bright ? "#cf9116" : "#f5c451";

  return (
    <div className="flex h-full flex-col rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-accent">
          <LineIcon size={14} />
          近30天得分趋势
        </div>
        <div className="flex gap-1 rounded-lg bg-panel/70 p-0.5 ring-1 ring-cyan-glow/15">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${
                t === tab
                  ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50 shadow-glow"
                  : "text-cyan-glow/50 hover:text-cyan-glow/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 14, bottom: 0, left: -16 }}>
            <defs>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: axis, fontSize: 11 }}
              axisLine={{ stroke: grid }}
              tickLine={false}
            />
            <YAxis
              domain={[(min: number) => Math.floor(min - 3), (max: number) => Math.ceil(max + 3)]}
              tick={{ fill: axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(v: number, n: string) => [`${Number(v).toFixed(2)} 分`, n]}
              labelStyle={{ color: legendText }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={20}
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, color: legendText }}
            />
            <Line
              name="个人得分"
              type="monotone"
              dataKey="personal"
              stroke={cPersonal}
              strokeWidth={2.6}
              dot={{ r: 2.5, fill: cPersonal }}
              activeDot={{ r: 5 }}
              style={{ filter: bright ? undefined : "url(#lineGlow)" }}
              isAnimationActive
            />
            <Line
              name="车队平均"
              type="monotone"
              dataKey="fleet"
              stroke={cFleet}
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
            <Line
              name="公司平均"
              type="monotone"
              dataKey="company"
              stroke={cCompany}
              strokeWidth={1.8}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
