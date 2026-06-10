import { Radar as RadarIcon, Star, TrendingDown, TrendingUp } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card from "../ui/Card";
import CountUp from "../ui/CountUp";
import { fleetRadarData, fleetRadarSummary } from "../../data/fleetMockData";
import { useTheme } from "../../theme/ThemeContext";

function HoverTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const fleet = payload.find((p: any) => p.dataKey === "fleet")?.value ?? 0;
  const company = payload.find((p: any) => p.dataKey === "company")?.value ?? 0;
  const diff = fleet - company;
  return (
    <div className="rounded-lg border border-cyan-glow/35 bg-[var(--tooltip-bg)] px-2.5 py-1.5 text-[11px] shadow-glow">
      <div className="mb-0.5 font-semibold text-ink">{label}</div>
      <div className="flex justify-between gap-3 text-accent">
        <span>本车队</span>
        <span className="font-mono">{fleet}</span>
      </div>
      <div className="flex justify-between gap-3 text-[#8fe9b8]">
        <span>公司平均</span>
        <span className="font-mono">{company}</span>
      </div>
      <div
        className="mt-0.5 flex justify-between gap-3 border-t border-cyan-glow/20 pt-0.5 font-semibold"
        style={{ color: diff >= 0 ? "#41e08a" : "#ff8f8f" }}
      >
        <span>差距</span>
        <span className="font-mono">{diff > 0 ? `+${diff}` : diff}</span>
      </div>
    </div>
  );
}

export default function FleetRadarScoreCard() {
  const bright = useTheme() === "bright";
  const gridStroke = bright ? "rgba(40,100,65,0.28)" : "rgba(120,200,255,0.18)";
  const angleTick = bright ? "#274033" : "#bfe9ff";
  const radiusTick = bright ? "rgba(40,100,65,0.55)" : "rgba(120,200,255,0.45)";
  const radiusAxis = bright ? "rgba(40,100,65,0.2)" : "rgba(120,200,255,0.12)";
  const cFleet = bright ? "#1188aa" : "#3ee7ff";
  const cCompany = bright ? "#2f9e5e" : "#41e08a";
  const down = fleetRadarSummary.changePct < 0;

  return (
    <Card
      title="车队安全评分雷达图"
      icon={<RadarIcon size={15} />}
      bodyClassName="flex flex-col px-3 pb-2"
    >
      <div className="relative min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={fleetRadarData}
            outerRadius="72%"
            margin={{ top: 6, right: 18, bottom: 0, left: 18 }}
          >
            <defs>
              <linearGradient id="fleetSelfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cFleet} stopOpacity={bright ? 0.35 : 0.55} />
                <stop offset="100%" stopColor={cFleet} stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="companyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cCompany} stopOpacity={bright ? 0.28 : 0.4} />
                <stop offset="100%" stopColor={cCompany} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <PolarGrid stroke={gridStroke} />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: angleTick, fontSize: 11 }} />
            <PolarRadiusAxis
              domain={[60, 100]}
              tick={{ fill: radiusTick, fontSize: 9 }}
              stroke={radiusAxis}
              tickCount={5}
            />
            <Radar
              name="公司平均"
              dataKey="company"
              stroke={cCompany}
              strokeWidth={2}
              fill="url(#companyFill)"
              isAnimationActive
            />
            <Radar
              name="本车队"
              dataKey="fleet"
              stroke={cFleet}
              strokeWidth={2.5}
              fill="url(#fleetSelfFill)"
              isAnimationActive
              style={{ filter: bright ? undefined : "drop-shadow(0 0 6px rgba(62,231,255,0.6))" }}
            />
            <Tooltip content={<HoverTip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="flex items-center justify-center gap-5 py-1 text-[11px]">
        <span className="flex items-center gap-1.5 text-cyan-glow/90">
          <span className="h-2 w-2 rounded-full bg-[#3ee7ff] shadow-[0_0_6px_#3ee7ff]" />
          蓝色：本车队
        </span>
        <span className="flex items-center gap-1.5 text-[#8fe9b8]">
          <span className="h-2 w-2 rounded-full bg-[#41e08a] shadow-[0_0_6px_#41e08a]" />
          绿色：公司平均
        </span>
      </div>

      {/* summary */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl bg-panel/70 px-3 py-2 ring-1 ring-cyan-glow/15">
        <div className="text-center">
          <div className="neon-label">综合安全评分</div>
          <div className="font-mono text-[30px] font-extrabold leading-none text-accent drop-shadow-[0_0_12px_rgba(62,231,255,0.5)]">
            <CountUp value={fleetRadarSummary.overallScore} decimals={2} />
          </div>
          <div
            className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-semibold"
            style={{ color: down ? "#ff8f8f" : "#41e08a" }}
          >
            {down ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {down ? "↓" : "↑"} {Math.abs(fleetRadarSummary.changePct)}%
          </div>
        </div>
        <div className="grid grid-cols-1 gap-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="neon-label">排名情况</span>
            <span className="neon-value">{fleetRadarSummary.rank}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="neon-label">排名变化</span>
            <span className="flex items-center gap-1 font-semibold text-[#41e08a]">
              <TrendingUp size={12} />
              {fleetRadarSummary.rankChange}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="neon-label">安全评级</span>
            <span className="flex">
              {Array.from({ length: fleetRadarSummary.safetyRating }).map((_, i) => (
                <Star key={i} size={13} className="fill-amber-300 text-amber-300" />
              ))}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
