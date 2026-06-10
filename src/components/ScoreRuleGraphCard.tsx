import { useState } from "react";
import { Workflow } from "lucide-react";
import Card from "./ui/Card";
import {
  scoreRules as defaultRules,
  scoreSources as defaultSources,
  radarSummary,
  getScoreStatus,
  ScoreRule,
} from "../data/mockData";

interface Props {
  rules?: ScoreRule[];
  sources?: string[];
  overall?: number;
}

const COLOR = {
  green: { stroke: "#41e08a", glow: "rgba(65,224,138,0.55)", text: "#8fe9b8" },
  yellow: { stroke: "#f5c451", glow: "rgba(245,196,81,0.55)", text: "#ffd97a" },
  red: { stroke: "#ff6b6b", glow: "rgba(255,107,107,0.55)", text: "#ff9d9d" },
};

// x positions (percent) for the five columns, top (modules) & bottom (sources)
const COLS = [11, 30.5, 50, 69.5, 89];
const MODULE_Y = 15;
const SOURCE_Y = 87;
const HUB = { x: 50, y: 50 };
const HUB_TOP = 36; // where module branches leave the hub
const HUB_BOTTOM = 64; // where source flows enter the hub

export default function ScoreRuleGraphCard({
  rules = defaultRules,
  sources = defaultSources,
  overall = radarSummary.overallScore,
}: Props = {}) {
  const [hover, setHover] = useState<number | null>(null);
  const scoreRules = rules;
  const scoreSources = sources;

  return (
    <Card title="打分规则结构图" icon={<Workflow size={15} />} bodyClassName="flex flex-col px-3 pb-2">
      <div className="relative min-h-0 flex-1">
        {/* connectors */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* sources -> hub (converge upward) */}
          {scoreSources.map((_, i) => (
            <line
              key={`s${i}`}
              className="flow-line"
              x1={COLS[i]}
              y1={SOURCE_Y - 6}
              x2={HUB.x}
              y2={HUB_BOTTOM}
              stroke="#3ee7ff"
              strokeOpacity={0.5}
              strokeWidth={1.1}
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* hub -> modules (diverge upward) */}
          {scoreRules.map((r, i) => {
            const c = COLOR[getScoreStatus(r.score)];
            return (
              <line
                key={`m${i}`}
                className="flow-line"
                x1={HUB.x}
                y1={HUB_TOP}
                x2={COLS[i]}
                y2={MODULE_Y + 7}
                stroke={c.stroke}
                strokeOpacity={hover === null || hover === i ? 0.75 : 0.25}
                strokeWidth={hover === i ? 2 : 1.2}
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* tier labels */}
        <div className="absolute left-0 top-0 z-20 -translate-y-1 text-[9px] font-semibold tracking-wider text-cyan-glow/45">
          ▲ 打分体系（输出评分）
        </div>
        <div className="absolute bottom-0 left-0 z-20 translate-y-1 text-[9px] font-semibold tracking-wider text-cyan-glow/45">
          ▲ 数据来源（向上汇聚）
        </div>

        {/* top: scoring modules */}
        {scoreRules.map((r, i) => (
          <ModuleNode
            key={r.module}
            rule={r}
            x={COLS[i]}
            y={MODULE_Y}
            active={hover === i}
            onHover={(v) => setHover(v ? i : null)}
          />
        ))}

        {/* center hub: robot + total score */}
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
        >
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-cyan-glow/25 blur-xl" />
            <img
              src={`${import.meta.env.BASE_URL}robot-avatar.png`}
              alt="评分引擎"
              className="h-[78px] w-auto drop-shadow-[0_0_14px_rgba(62,231,255,0.55)]"
            />
          </div>
          <div className="-mt-1 flex items-center gap-1 rounded-full bg-panel/90 px-2.5 py-0.5 ring-1 ring-cyan-glow/50 shadow-glow">
            <span className="text-[9px] text-cyan-glow/70">综合评分</span>
            <span className="font-mono text-[15px] font-extrabold leading-none text-accent">
              {overall}
            </span>
          </div>
        </div>

        {/* bottom: data sources */}
        {scoreSources.map((s, i) => (
          <div
            key={s}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${COLS[i]}%`, top: `${SOURCE_Y}%` }}
          >
            <div className="flex w-[116px] items-center justify-center rounded-lg border border-cyan-glow/25 bg-panel/85 px-1.5 py-1 text-center text-[10px] leading-tight text-cyan-glow/85 shadow-[0_0_8px_rgba(62,231,255,0.15)]">
              {s}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ModuleNode({
  rule,
  x,
  y,
  active,
  onHover,
}: {
  rule: ScoreRule;
  x: number;
  y: number;
  active: boolean;
  onHover: (v: boolean) => void;
}) {
  const c = COLOR[getScoreStatus(rule.score)];
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%,-50%) scale(${active ? 1.07 : 1})`,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        className="w-[120px] rounded-xl bg-panel/92 px-2 py-1"
        style={{
          border: `1px solid ${c.stroke}`,
          boxShadow: `0 0 ${active ? 18 : 9}px ${c.glow}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-ink">{rule.module}</span>
          <span
            className="rounded px-1 text-[9px] font-bold"
            style={{ background: c.glow, color: "#fff" }}
          >
            {rule.weight}%
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-[9px] text-cyan-glow/55">当前得分</span>
          <span className="font-mono text-[15px] font-bold leading-none" style={{ color: c.text }}>
            {rule.score}
          </span>
        </div>
      </div>
    </div>
  );
}
