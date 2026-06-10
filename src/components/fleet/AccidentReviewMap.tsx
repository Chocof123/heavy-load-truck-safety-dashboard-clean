import { useMemo, useState } from "react";
import { MapPinned, TriangleAlert, Film, Play } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import LocalWenzhouRoadMap, { MapPoint } from "../LocalWenzhouRoadMap";
import {
  fleetAccidents,
  companyTypicalAccidents,
  fleetAccidentStats,
  companyAccidentStats,
  accidentByCause,
  accidentByType,
  emergencyNorms,
  companyAccidentByCause,
  companyAccidentByType,
  companyEmergencyNorms,
  AccidentReview,
  DonutDatum,
} from "../../data/fleetMockData";
import { useTheme } from "../../theme/ThemeContext";

const TABS = ["本年度事故深度复盘", "公司典型事故警示"] as const;

const STAT_TONE: Record<string, string> = {
  green: "text-[#41e08a]",
  yellow: "text-[#ffd97a]",
  red: "text-[#ff8f8f]",
  blue: "text-accent",
};

const toPoints = (list: AccidentReview[]): MapPoint[] =>
  list.map((a) => ({
    id: a.id,
    lon: a.lon,
    lat: a.lat,
    severity: a.severity,
    title: a.title,
    sub: a.location,
    time: a.time,
  }));

export default function AccidentReviewMap() {
  const [tab, setTab] = useState(0);
  const [selectedId, setSelectedId] = useState<number>(fleetAccidents[0].id);
  const [openId, setOpenId] = useState<number | null>(null);

  const list = tab === 0 ? fleetAccidents : companyTypicalAccidents;
  const stats = tab === 0 ? fleetAccidentStats : companyAccidentStats;
  const cause = tab === 0 ? accidentByCause : companyAccidentByCause;
  const type = tab === 0 ? accidentByType : companyAccidentByType;
  const norms = tab === 0 ? emergencyNorms : companyEmergencyNorms;

  const points = useMemo(() => toPoints(list), [list]);
  const open = list.find((a) => a.id === openId) ?? null;

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setOpenId(id);
  };

  return (
    <Card
      title="事故深度复盘 / 公司典型事故警示"
      icon={<MapPinned size={15} />}
      bodyClassName="flex flex-col gap-2 px-3 pb-3"
    >
      {/* tabs */}
      <div className="flex gap-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => {
              setTab(i);
              setSelectedId((i === 0 ? fleetAccidents : companyTypicalAccidents)[0].id);
            }}
            className={`flex-1 rounded-md px-1 py-1 text-[11px] font-medium transition ${
              i === tab
                ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50"
                : "bg-panel/50 text-cyan-glow/55 ring-1 ring-cyan-glow/15 hover:text-cyan-glow/80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* three-row layout (fills the card, no bottom gap) */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* row 1: map full width */}
        <div className="relative h-[40%] min-h-0 shrink-0">
          <LocalWenzhouRoadMap points={points} selectedId={selectedId} onSelect={handleSelect} />
          {tab === 1 && (
            <div className="pointer-events-none absolute left-1.5 top-1.5 z-10 flex items-center gap-1 rounded bg-black/45 px-1.5 py-0.5 text-[9px] text-amber-300">
              <TriangleAlert size={10} />
              公司典型事故 · 共 {companyTypicalAccidents.length} 例
            </div>
          )}
        </div>
        <div className="-mt-1 shrink-0 text-[9px] text-cyan-glow/45">
          点击地图上的事故点查看{tab === 0 ? "深度复盘" : "案例详情与视频回放"} · 颜色表示严重程度
        </div>

        {/* row 2: stats summary */}
        <div className="grid shrink-0 grid-cols-5 gap-1.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-md bg-panel/55 px-1.5 py-1 ring-1 ring-cyan-glow/12"
            >
              <div className="truncate text-[9px] text-cyan-glow/55" title={s.label}>
                {s.label}
              </div>
              <div className={`font-mono text-[14px] font-bold leading-tight ${STAT_TONE[s.tone]}`}>
                {s.value}
                {s.unit && <span className="ml-0.5 text-[9px] font-normal">{s.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* row 3: three circular charts (flex-1 fills remaining height) */}
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          <DonutChart title="按成因复盘" data={cause} />
          <DonutChart title="按类型复盘" data={type} />
          <NormsRings title="事故应急规范" norms={norms} />
        </div>
      </div>

      <ReviewModal review={open} onClose={() => setOpenId(null)} />
    </Card>
  );
}

// ---- review modal (area 5: roomier, 3-col top + full-width sections, scrolls) ----
const BASIC_FIELDS: { key: keyof AccidentReview; label: string }[] = [
  { key: "time", label: "时间" },
  { key: "location", label: "地点" },
  { key: "parkingDuration", label: "停车时长" },
  { key: "hazardLight", label: "双闪状态" },
  { key: "accStatus", label: "ACC 状态" },
  { key: "loss", label: "事故损失" },
];

function ReviewModal({ review, onClose }: { review: AccidentReview | null; onClose: () => void }) {
  return (
    <Modal
      open={!!review}
      title={review?.title ?? ""}
      subtitle={review ? `核心原因：${review.coreCause}` : ""}
      badge={
        review ? (
          <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-300/40">
            {review.severityLabel}
          </span>
        ) : undefined
      }
      onClose={onClose}
      widthClass="w-[min(1040px,92vw)]"
    >
      {review && (
        <div className="space-y-4 text-[12px] leading-relaxed">
          {/* top: three columns */}
          <div className="grid grid-cols-[1.1fr_0.9fr_1fr] gap-3">
            {/* 左: 基础信息 cards */}
            <div>
              <SectionLabel>事故基础信息</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {BASIC_FIELDS.map((f) => (
                  <div key={f.key} className="rounded-md bg-panel/55 px-2.5 py-1.5 ring-1 ring-cyan-glow/12">
                    <div className="text-[10px] text-cyan-glow/55">{f.label}</div>
                    <div className="mt-0.5 text-ink/90">{String(review[f.key])}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 中: 视频回放 */}
            <div className="flex flex-col">
              <SectionLabel>视频回放</SectionLabel>
              <VideoBox time={review.time} />
            </div>

            {/* 右: 事件详情摘要 */}
            <div>
              <SectionLabel>事件详情摘要</SectionLabel>
              <div className="space-y-1.5 rounded-md bg-panel/55 px-3 py-2.5 ring-1 ring-cyan-glow/12">
                <KV label="时间" value={review.time} />
                <KV label="地点" value={review.location} />
                <div className="border-t border-cyan-glow/12 pt-1.5">
                  <div className="text-[10px] text-cyan-glow/55">事故描述</div>
                  <p className="mt-0.5 text-ink/85">{review.description}</p>
                </div>
                <div className="border-t border-cyan-glow/12 pt-1.5">
                  <div className="text-[10px] text-cyan-glow/55">数据回放重点</div>
                  <p className="mt-0.5 text-[#ffd97a]">{review.dataReplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* full-width stacked sections */}
          <div className="space-y-3 border-t border-cyan-glow/15 pt-3">
            <Section label="事故描述">{review.description}</Section>
            <Section label="数据回放" tone="#ffd97a">{review.dataReplay}</Section>
            <Section label="痛点分析" tone="#ff8f8f">{review.painPoints}</Section>
            <div className="grid grid-cols-2 gap-3">
              <Section label="科技手段应用不足">{review.techGap}</Section>
              <Section label="家企联动缺失">{review.familyEnterpriseGap}</Section>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-semibold text-[#8fe9b8]">整改措施</div>
              <ul className="space-y-1">
                {review.measures.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-ink/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-[11px] font-semibold tracking-wider text-accent">{children}</div>;
}

function Section({ label, tone, children }: { label: string; tone?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold" style={{ color: tone ?? "var(--title-color)" }}>
        {label}
      </div>
      <p className="text-ink/85">{children}</p>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-12 shrink-0 text-[10px] text-cyan-glow/55">{label}</span>
      <span className="min-w-0 flex-1 text-ink/90">{value}</span>
    </div>
  );
}

function VideoBox({ time }: { time: string }) {
  const bright = useTheme() === "bright";
  return (
    <div
      className="relative flex min-h-[180px] flex-1 items-center justify-center overflow-hidden rounded-lg ring-1 ring-cyan-glow/20"
      style={{ background: bright ? "#dde7df" : "#000000" }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(62,231,255,0.08) 3px, rgba(62,231,255,0.08) 4px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-glow/15 ring-1 ring-cyan-glow/40">
          <Play size={18} className="translate-x-[1px] text-accent" />
        </span>
        <span className="flex items-center gap-1 text-[10px] text-cyan-glow/60">
          <Film size={11} /> 事故前 30 秒视频片段
        </span>
        <span className="text-[10px] text-cyan-glow/40">视频回放加载中 / 暂无真实视频</span>
      </div>
      <div className="absolute left-2 top-2 z-10 rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-300 ring-1 ring-red-400/40">
        ● REC
      </div>
      <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-cyan-glow/60">{time}</div>
    </div>
  );
}

// ---- charts -----------------------------------------------------------------
const DONUT_COLORS = ["#3ee7ff", "#f5c451", "#ff6b6b", "#8fa6c9", "#41e08a"];

function DonutChart({ title, data }: { title: string; data: DonutDatum[] }) {
  const bright = useTheme() === "bright";
  return (
    <div className="flex min-h-0 flex-col rounded-lg bg-panel/55 p-2 ring-1 ring-cyan-glow/12">
      <div className="mb-1 text-center text-[10.5px] font-semibold text-accent">{title}</div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="52%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 space-y-0.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1" style={{ color: bright ? "#274033" : "#9fc4dd" }}>
              <span
                className="h-1.5 w-1.5 rounded-sm"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              {d.name}
            </span>
            <span className="font-mono text-ink/80">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NormsRings({ title, norms }: { title: string; norms: { name: string; value: number }[] }) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg bg-panel/55 p-2 ring-1 ring-cyan-glow/12">
      <div className="mb-1 text-center text-[10.5px] font-semibold text-accent">{title}</div>
      <div className="grid min-h-0 flex-1 grid-cols-2 place-items-center gap-1">
        {norms.map((n) => (
          <Ring key={n.name} label={n.name} value={n.value} />
        ))}
      </div>
    </div>
  );
}

function Ring({ label, value }: { label: string; value: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const color = value >= 70 ? "#41e08a" : value >= 50 ? "#ffd97a" : "#ff8f8f";
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[40px] w-[40px]">
        <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(120,200,255,0.15)" strokeWidth="4" />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={off}
            style={{ filter: `drop-shadow(0 0 3px ${color}88)` }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-ink">
          {value}%
        </span>
      </div>
      <span className="mt-0.5 text-[9px] text-cyan-glow/70">{label}</span>
    </div>
  );
}
