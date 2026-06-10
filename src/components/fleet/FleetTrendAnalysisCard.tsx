import { useState } from "react";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  ClipboardList,
  ShieldAlert,
  LineChart as LineIcon,
  LayoutDashboard,
  Clock4,
  MapPin,
  Users,
} from "lucide-react";
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
import Card from "../ui/Card";
import {
  fleetHighlights,
  fleetBasics,
  fleetCorrection,
  fleetTrendData,
  FleetTrendMetric,
  FleetGranularity,
} from "../../data/fleetMockData";
import { useTheme } from "../../theme/ThemeContext";

const METRICS: FleetTrendMetric[] = ["安全平均分", "事故数", "报警数"];
const GRANS: FleetGranularity[] = ["日K", "周K", "月K", "季K", "年K"];

// per-metric colour systems (area 3) — buttons + lines change with the tab
const METRIC_THEME: Record<
  FleetTrendMetric,
  { fleet: string; company: string; glow: string; chip: string }
> = {
  安全平均分: { fleet: "#3ee7ff", company: "#41e08a", glow: "rgba(62,231,255,0.6)", chip: "#3ee7ff" },
  事故数: { fleet: "#ffae3c", company: "#ff6b6b", glow: "rgba(255,174,60,0.6)", chip: "#ffae3c" },
  报警数: { fleet: "#b78bff", company: "#ff8fd0", glow: "rgba(183,139,255,0.6)", chip: "#b78bff" },
};

export default function FleetTrendAnalysisCard() {
  return (
    <Card
      title="趋势统计与管理分析"
      icon={<LayoutDashboard size={15} />}
      className="shadow-glow-strong"
      bodyClassName="grid grid-rows-[44fr_56fr] gap-2.5 px-3 pb-3"
    >
      {/* top: management summary — three columns */}
      <div className="grid min-h-0 grid-cols-3 gap-2.5">
        <HighlightCol />
        <BasicsCol />
        <CorrectionCol />
      </div>
      {/* bottom: trend chart */}
      <div className="min-h-0">
        <TrendBlock />
      </div>
    </Card>
  );
}

function Panel({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-col rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color }}>
        {icon}
        {title}
      </div>
      {/* evenly distribute content top→bottom (area 4) */}
      <div className="thin-scroll flex min-h-0 flex-1 flex-col justify-between overflow-y-auto pr-0.5">
        {children}
      </div>
    </div>
  );
}

function TagRow({ label, items, icon, color }: { label: string; items: string[]; icon: React.ReactNode; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1 text-[10px]" style={{ color }}>
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-md bg-panel/60 px-1.5 py-0.5 text-[10.5px] text-cyan-glow/90 ring-1 ring-cyan-glow/15"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function HighlightCol() {
  return (
    <Panel icon={<Award size={14} />} title="亮点工作" color="#41e08a">
      <TagRow label="得满分的细项" items={fleetHighlights.fullScoreItems} icon={<CheckCircle2 size={11} />} color="#41e08a" />
      <TagRow label="连续提升的细项" items={fleetHighlights.continuousImprovement} icon={<TrendingUp size={11} />} color="#3ee7ff" />
      <TagRow label="加分项" items={fleetHighlights.bonusItems} icon={<PlusCircle size={11} />} color="#ffd97a" />
    </Panel>
  );
}

function BasicsCol() {
  return (
    <Panel icon={<ClipboardList size={14} />} title="基本情况" color="#3ee7ff">
      {fleetBasics.map((b) => (
        <div
          key={b.label}
          className="flex items-center justify-between rounded-md bg-panel/55 px-2 py-1 ring-1 ring-cyan-glow/12"
        >
          <span className="text-[10.5px] text-cyan-glow/70">{b.label}</span>
          <span className="font-mono text-[12px] font-bold text-ink">{b.value}</span>
        </div>
      ))}
    </Panel>
  );
}

function CorrectionCol() {
  const c = fleetCorrection;
  return (
    <Panel icon={<ShieldAlert size={14} />} title="问题整改" color="#ff8f8f">
      <div className="space-y-1.5">
        <InfoBlock icon={<Clock4 size={12} className="text-[#ffd97a]" />} label="报警高发时段">
          <span className="font-mono text-[13px] font-semibold text-ink">{c.highRiskTime}</span>
        </InfoBlock>
        <InfoBlock icon={<MapPin size={12} className="text-[#ff8f8f]" />} label="报警高发路段">
          <Chips items={c.highRiskRoads} tone="#ff8f8f" />
        </InfoBlock>
        <InfoBlock icon={<Users size={12} className="text-accent" />} label="报警高发人员">
          <Chips items={c.highRiskDrivers} tone="#3ee7ff" />
        </InfoBlock>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <Mini label="待整改" value={c.pending} tone="#ff8f8f" />
        <Mini label="已完成" value={c.completed} tone="#41e08a" />
        <Mini label="完成率" value={`${c.completionRate}%`} tone="#ffd97a" />
        <Mini label="超期未整改" value={c.overdue} tone="#ff8f8f" />
        <Mini label="本周新增" value={c.newThisWeek} tone="#3ee7ff" />
        <div className="flex flex-col justify-center rounded-md bg-panel/60 px-1 py-1 ring-1 ring-cyan-glow/12">
          <div className="mb-0.5 text-[8.5px] text-cyan-glow/55">整改进度</div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel/80 ring-1 ring-cyan-glow/15">
            <div
              className="h-full rounded-full"
              style={{ width: `${c.completionRate}%`, background: "linear-gradient(90deg,#41e08a,#3ee7ff)" }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function InfoBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-panel/55 px-2 py-1.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1 flex items-center gap-1 text-[11px] text-cyan-glow/65">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Chips({ items, tone }: { items: string[]; tone: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((it) => (
        <span
          key={it}
          className="rounded px-1.5 py-0.5 text-[12px] font-medium ring-1"
          style={{ color: tone, borderColor: `${tone}55`, background: `${tone}1a` }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-md bg-panel/60 px-1 py-1 text-center ring-1 ring-cyan-glow/12">
      <div className="text-[8.5px] text-cyan-glow/55">{label}</div>
      <div className="font-mono text-[15px] font-bold leading-tight" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}

function TrendBlock() {
  const [metric, setMetric] = useState<FleetTrendMetric>("安全平均分");
  const [gran, setGran] = useState<FleetGranularity>("月K");
  const bright = useTheme() === "bright";

  const cfg = fleetTrendData[metric];
  const data = cfg.data[gran];
  const t = METRIC_THEME[metric];

  const axis = bright ? "#5d7a68" : "#7fb4d8";
  const grid = bright ? "rgba(40,100,65,0.13)" : "rgba(120,200,255,0.08)";
  const legendText = bright ? "#274033" : "#bfe9ff";

  return (
    <div className="flex h-full flex-col rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: t.chip }}>
          <LineIcon size={14} />
          趋势分析 · 本车队 vs 公司平均
        </div>
        <div className="flex items-center gap-2">
          {/* metric switch — active uses the metric's own colour */}
          <div className="flex gap-0.5 rounded-lg bg-panel/70 p-0.5 ring-1 ring-cyan-glow/15">
            {METRICS.map((m) => {
              const active = m === metric;
              const mt = METRIC_THEME[m];
              return (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium transition"
                  style={
                    active
                      ? {
                          color: mt.chip,
                          background: `${mt.chip}22`,
                          boxShadow: `0 0 10px ${mt.glow}`,
                          border: `1px solid ${mt.chip}88`,
                        }
                      : { color: "rgba(120,200,255,0.5)" }
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>
          {/* granularity switch */}
          <div className="flex gap-0.5 rounded-lg bg-panel/70 p-0.5 ring-1 ring-cyan-glow/15">
            {GRANS.map((g) => (
              <button
                key={g}
                onClick={() => setGran(g)}
                className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium transition ${
                  g === gran
                    ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50 shadow-glow"
                    : "text-cyan-glow/50 hover:text-cyan-glow/80"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 14, bottom: 0, left: -12 }}>
            <defs>
              <filter id="fleetLineGlow" x="-20%" y="-20%" width="140%" height="140%">
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
              domain={["auto", "auto"]}
              tick={{ fill: axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              formatter={(v: number, n: string) => [`${v} ${cfg.unit}`, n]}
              labelStyle={{ color: legendText }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={18}
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, color: legendText }}
            />
            <Line
              name="本车队"
              type="monotone"
              dataKey="fleet"
              stroke={t.fleet}
              strokeWidth={2.6}
              dot={{ r: 2.2, fill: t.fleet }}
              activeDot={{ r: 5 }}
              style={{ filter: bright ? undefined : "url(#fleetLineGlow)" }}
              isAnimationActive
            />
            <Line
              name="公司平均"
              type="monotone"
              dataKey="company"
              stroke={t.company}
              strokeWidth={2}
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
