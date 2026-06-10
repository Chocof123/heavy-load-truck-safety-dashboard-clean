import { Radar as RadarIcon, Star, TrendingUp } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card from "./ui/Card";
import { radarData, radarSummary } from "../data/mockData";
import CountUp from "./ui/CountUp";
import { useTheme } from "../theme/ThemeContext";

export default function RadarComparisonCard() {
  const bright = useTheme() === "bright";
  const gridStroke = bright ? "rgba(40,100,65,0.28)" : "rgba(120,200,255,0.18)";
  const angleTick = bright ? "#274033" : "#bfe9ff";
  const radiusTick = bright ? "rgba(40,100,65,0.55)" : "rgba(120,200,255,0.45)";
  const radiusAxis = bright ? "rgba(40,100,65,0.2)" : "rgba(120,200,255,0.12)";
  const cDriver = bright ? "#1188aa" : "#3ee7ff";
  const cFleet = bright ? "#2f9e5e" : "#41e08a";
  return (
    <Card
      title="雷达评分 / 车队对比"
      icon={<RadarIcon size={15} />}
      bodyClassName="flex flex-col px-3 pb-2"
    >
      {/* radar */}
      <div className="relative min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="72%" margin={{ top: 6, right: 18, bottom: 0, left: 18 }}>
            <defs>
              <linearGradient id="driverFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cDriver} stopOpacity={bright ? 0.35 : 0.55} />
                <stop offset="100%" stopColor={cDriver} stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="fleetFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cFleet} stopOpacity={bright ? 0.28 : 0.4} />
                <stop offset="100%" stopColor={cFleet} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <PolarGrid stroke={gridStroke} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: angleTick, fontSize: 11 }}
            />
            <PolarRadiusAxis
              domain={[60, 100]}
              tick={{ fill: radiusTick, fontSize: 9 }}
              stroke={radiusAxis}
              tickCount={5}
            />
            <Radar
              name="车队平均"
              dataKey="fleet"
              stroke={cFleet}
              strokeWidth={2}
              fill="url(#fleetFill)"
              isAnimationActive
            />
            <Radar
              name="个人表现"
              dataKey="driver"
              stroke={cDriver}
              strokeWidth={2.5}
              fill="url(#driverFill)"
              isAnimationActive
              style={{ filter: bright ? undefined : "drop-shadow(0 0 6px rgba(62,231,255,0.6))" }}
            />
            <Tooltip
              formatter={(v: number, n: string) => [`${v} 分`, n]}
              labelStyle={{ color: angleTick }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="flex items-center justify-center gap-5 py-1 text-[11px]">
        <span className="flex items-center gap-1.5 text-cyan-glow/90">
          <span className="h-2 w-2 rounded-full bg-[#3ee7ff] shadow-[0_0_6px_#3ee7ff]" />
          蓝色：个人表现
        </span>
        <span className="flex items-center gap-1.5 text-[#8fe9b8]">
          <span className="h-2 w-2 rounded-full bg-[#41e08a] shadow-[0_0_6px_#41e08a]" />
          绿色：车队平均
        </span>
      </div>

      {/* summary */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl bg-panel/70 px-3 py-2 ring-1 ring-cyan-glow/15">
        <div className="text-center">
          <div className="neon-label">综合评分</div>
          <div className="font-mono text-[30px] font-extrabold leading-none text-accent drop-shadow-[0_0_12px_rgba(62,231,255,0.5)]">
            <CountUp value={radarSummary.overallScore} decimals={2} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="neon-label">车队排名</span>
            <span className="neon-value">{radarSummary.fleetRank}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="neon-label">较上月</span>
            <span className="flex items-center gap-1 font-semibold text-[#41e08a]">
              <TrendingUp size={12} />
              {radarSummary.rankChange}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="neon-label">安全评级</span>
            <span className="flex">
              {Array.from({ length: radarSummary.safetyRating }).map((_, i) => (
                <Star key={i} size={13} className="fill-amber-300 text-amber-300" />
              ))}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
