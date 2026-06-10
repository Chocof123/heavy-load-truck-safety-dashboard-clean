import { useState } from "react";
import { ListChecks, UserX, BellRing, Route } from "lucide-react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import {
  riskDrivers,
  alertControls,
  routeRisks,
  RiskDriverRow,
  AlertControlRow,
  RouteRiskRow,
} from "../../data/fleetMockData";

const TABS = [
  { key: "driver", label: "风险驾驶员排行", icon: UserX },
  { key: "alert", label: "报警防控", icon: BellRing },
  { key: "route", label: "线路风险", icon: Route },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// score → tone (≥90 优秀绿, 80–89 风险黄, <80 严重红)
function scoreColor(s: number) {
  if (s >= 90) return "#41e08a";
  if (s >= 80) return "#ffd97a";
  return "#ff8f8f";
}

const STATUS_STYLE: Record<string, string> = {
  未开始: "bg-cyan-glow/10 text-cyan-glow/70 ring-cyan-glow/25",
  整改中: "bg-amber-400/15 text-amber-300 ring-amber-300/40",
  已完成: "bg-emerald-400/15 text-emerald-300 ring-emerald-300/40",
};

export default function RollingLedgerTabs() {
  const [tab, setTab] = useState<TabKey>("driver");
  const [sel, setSel] = useState<
    | { kind: "driver"; row: RiskDriverRow }
    | { kind: "alert"; row: AlertControlRow }
    | { kind: "route"; row: RouteRiskRow }
    | null
  >(null);

  return (
    <Card title="报警流水台账" icon={<ListChecks size={15} />} bodyClassName="flex flex-col px-3 pb-3">
      {/* tabs */}
      <div className="mb-2 flex gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[11px] font-medium transition ${
              tab === key
                ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50"
                : "bg-panel/50 text-cyan-glow/55 ring-1 ring-cyan-glow/15 hover:text-cyan-glow/80"
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        {tab === "driver" && (
          <DriverTab onRow={(row) => setSel({ kind: "driver", row })} />
        )}
        {tab === "alert" && <AlertTab onRow={(row) => setSel({ kind: "alert", row })} />}
        {tab === "route" && <RouteTab onRow={(row) => setSel({ kind: "route", row })} />}
      </div>

      {/* detail modals */}
      <Modal
        open={sel?.kind === "driver"}
        title={sel?.kind === "driver" ? `${sel.row.name} · 风险驾驶员分析` : ""}
        subtitle={sel?.kind === "driver" ? sel.row.detail.info : ""}
        badge={
          sel?.kind === "driver" ? (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold ring-1"
              style={{ color: scoreColor(sel.row.score), borderColor: scoreColor(sel.row.score) }}
            >
              安全分 {sel.row.score}
            </span>
          ) : undefined
        }
        onClose={() => setSel(null)}
      >
        {sel?.kind === "driver" && <DriverDetail row={sel.row} />}
      </Modal>

      <Modal
        open={sel?.kind === "alert"}
        title={sel?.kind === "alert" ? `${sel.row.type} · 报警防控分析` : ""}
        onClose={() => setSel(null)}
      >
        {sel?.kind === "alert" && <AlertDetail row={sel.row} />}
      </Modal>

      <Modal
        open={sel?.kind === "route"}
        title={sel?.kind === "route" ? `${sel.row.location} · 线路风险分析` : ""}
        onClose={() => setSel(null)}
      >
        {sel?.kind === "route" && <RouteDetail row={sel.row} />}
      </Modal>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// shared rolling table: pinned top rows + auto-scrolling rest
// ---------------------------------------------------------------------------
function RollingTable<T>({
  gridCols,
  headers,
  pinned,
  scrolling,
  renderRow,
  onRow,
  pinnedNote,
}: {
  gridCols: string;
  headers: string[];
  pinned: T[];
  scrolling: T[];
  renderRow: (row: T) => React.ReactNode;
  onRow: (row: T) => void;
  pinnedNote: string;
}) {
  // duration scales with row count so speed feels even across tabs
  const dur = Math.max(10, scrolling.length * 2.6);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg ring-1 ring-cyan-glow/12">
      {/* header */}
      <div
        className="grid bg-panel px-2 py-1.5 text-[10.5px] font-medium text-cyan-glow/60"
        style={{ gridTemplateColumns: gridCols }}
      >
        {headers.map((h) => (
          <span key={h} className="px-1">
            {h}
          </span>
        ))}
      </div>

      {/* pinned (重点关注) */}
      <div className="border-b border-cyan-glow/20 bg-cyan-glow/[0.04]">
        <div className="flex items-center gap-1 px-2 pt-1 text-[9px] font-semibold tracking-wider text-amber-300/80">
          ★ 重点关注 · {pinnedNote}
        </div>
        {pinned.map((row, i) => (
          <button
            key={`p${i}`}
            onClick={() => onRow(row)}
            className="grid w-full items-center px-2 py-1.5 text-left text-[11px] transition hover:bg-cyan-glow/10"
            style={{ gridTemplateColumns: gridCols }}
          >
            {renderRow(row)}
          </button>
        ))}
      </div>

      {/* auto-scrolling rest — duplicated list loops seamlessly (translateY -50%) */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="marquee-track" style={{ animationDuration: `${dur}s` }}>
          {[...scrolling, ...scrolling].map((row, i) => (
            <button
              key={`s${i}`}
              onClick={() => onRow(row)}
              className="grid w-full items-center border-b border-white/5 px-2 py-1.5 text-left text-[11px] transition hover:bg-cyan-glow/10"
              style={{ gridTemplateColumns: gridCols }}
            >
              {renderRow(row)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Tab 1: 风险驾驶员排行 --------------------------------------------------
function DriverTab({ onRow }: { onRow: (r: RiskDriverRow) => void }) {
  const sorted = [...riskDrivers].sort((a, b) => a.score - b.score);
  const pinned = sorted.slice(0, 3); // 三个最低分
  const scrolling = sorted.slice(3);
  const cols = "1.1fr 0.8fr 0.6fr 0.6fr 0.6fr 0.8fr";
  return (
    <RollingTable<RiskDriverRow>
      gridCols={cols}
      headers={["驾驶员", "安全分", "事故", "投诉", "报警", "万公里报警"]}
      pinned={pinned}
      scrolling={scrolling}
      onRow={onRow}
      pinnedNote="得分最低的 3 名驾驶员"
      renderRow={(r) => (
        <>
          <span className="px-1 font-medium text-ink/90">{r.name}</span>
          <span className="px-1 font-mono font-bold" style={{ color: scoreColor(r.score) }}>
            {r.score}
          </span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.accidents}</span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.complaints}</span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.alerts}</span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.per10k}</span>
        </>
      )}
    />
  );
}

function DriverDetail({ row }: { row: RiskDriverRow }) {
  const d = row.detail;
  return (
    <div className="space-y-2.5 text-[11.5px]">
      <Field label="主要风险行为">
        <ChipList items={d.risks} tone="#ff8f8f" />
      </Field>
      <Field label="近期报警趋势">{d.alertTrend}</Field>
      <Field label="安全评分变化">{d.scoreChange}</Field>
      <Field label="整改建议">
        <ul className="space-y-0.5">
          {d.suggestions.map((s) => (
            <li key={s} className="flex items-start gap-1 text-ink/85">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              {s}
            </li>
          ))}
        </ul>
      </Field>
      <div className="grid grid-cols-3 gap-2 border-t border-cyan-glow/15 pt-2">
        <KV label="责任人" value={d.owner} />
        <KV label="整改截止" value={d.deadline} />
        <div>
          <div className="text-[10px] text-cyan-glow/55">整改状态</div>
          <span
            className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-bold ring-1 ${STATUS_STYLE[d.status]}`}
          >
            {d.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---- Tab 2: 报警防控 --------------------------------------------------------
function AlertTab({ onRow }: { onRow: (r: AlertControlRow) => void }) {
  const pinned = alertControls.slice(0, 3); // 最关注的三类
  const scrolling = alertControls.slice(3);
  const cols = "1.1fr 0.9fr 0.9fr 0.7fr 1fr";
  return (
    <RollingTable<AlertControlRow>
      gridCols={cols}
      headers={["报警类型", "万公里报警", "处置时长", "致事故", "事故后果"]}
      pinned={pinned}
      scrolling={scrolling}
      onRow={onRow}
      pinnedNote="最关注的 3 类报警"
      renderRow={(r) => (
        <>
          <span className="px-1 font-medium text-ink/90">{r.type}</span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.per10k}</span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.avgHandle}</span>
          <span
            className="px-1 font-semibold"
            style={{ color: r.causedAccident === "是" ? "#ff8f8f" : "#41e08a" }}
          >
            {r.causedAccident}
          </span>
          <span className="px-1 text-ink/80">{r.consequence}</span>
        </>
      )}
    />
  );
}

function AlertDetail({ row }: { row: AlertControlRow }) {
  const d = row.detail;
  return (
    <div className="space-y-2.5 text-[11.5px]">
      <Field label="报警类型分析">{d.analysis}</Field>
      <div className="grid grid-cols-2 gap-2">
        <KV label="高发时间段" value={d.peakTime} />
        <KV label="高发路段" value={d.peakRoad} />
        <KV label="涉及驾驶员" value={d.drivers} />
        <KV label="可能原因" value={d.cause} />
      </div>
      <Field label="整改措施">
        <ul className="space-y-0.5">
          {d.measures.map((m) => (
            <li key={m} className="flex items-start gap-1 text-ink/85">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow/70" />
              {m}
            </li>
          ))}
        </ul>
      </Field>
      <div className="border-t border-cyan-glow/15 pt-2">
        <KV label="跟进状态" value={d.followStatus} />
      </div>
    </div>
  );
}

// ---- Tab 3: 线路风险 --------------------------------------------------------
function RouteTab({ onRow }: { onRow: (r: RouteRiskRow) => void }) {
  const sorted = [...routeRisks].sort((a, b) => b.alerts - a.alerts);
  const pinned = sorted.slice(0, 3); // 报警最多的三个路段
  const scrolling = sorted.slice(3);
  const cols = "1.4fr 0.7fr 0.7fr 0.7fr 1fr";
  return (
    <RollingTable<RouteRiskRow>
      gridCols={cols}
      headers={["路段位置", "报警数", "致事故", "事故数", "事故后果"]}
      pinned={pinned}
      scrolling={scrolling}
      onRow={onRow}
      pinnedNote="报警最多的 3 个路段"
      renderRow={(r) => (
        <>
          <span className="px-1 font-medium text-ink/90">{r.location}</span>
          <span className="px-1 font-mono font-bold text-accent">{r.alerts}</span>
          <span
            className="px-1 font-semibold"
            style={{ color: r.causedAccident === "是" ? "#ff8f8f" : "#41e08a" }}
          >
            {r.causedAccident}
          </span>
          <span className="px-1 font-mono text-cyan-glow/80">{r.accidentCount}</span>
          <span className="px-1 text-ink/80">{r.consequence}</span>
        </>
      )}
    />
  );
}

function RouteDetail({ row }: { row: RouteRiskRow }) {
  const d = row.detail;
  return (
    <div className="space-y-2.5 text-[11.5px]">
      <Field label="路段风险分析">{d.analysis}</Field>
      <div className="grid grid-cols-2 gap-2">
        <KV label="报警类型分布" value={d.alertTypeDist} span2 />
        <KV label="事故关联情况" value={d.accidentRelation} span2 />
        <KV label="高发时段" value={d.peakTime} />
        <KV label="高发车辆/驾驶员" value={d.peakDriver} />
      </div>
      <Field label="整改措施">
        <div className="flex flex-wrap gap-1">
          {d.measures.map((m) => (
            <span
              key={m}
              className="rounded-md bg-emerald-400/10 px-1.5 py-0.5 text-[11px] text-emerald-200 ring-1 ring-emerald-300/30"
            >
              {m}
            </span>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ---- small shared bits ------------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-0.5 text-[10.5px] font-semibold text-accent">{label}</div>
      <div className="leading-snug text-ink/85">{children}</div>
    </div>
  );
}

function KV({ label, value, span2 }: { label: string; value: string; span2?: boolean }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <div className="text-[10px] text-cyan-glow/55">{label}</div>
      <div className="mt-0.5 text-ink/90">{value}</div>
    </div>
  );
}

function ChipList({ items, tone }: { items: string[]; tone: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((it) => (
        <span
          key={it}
          className="rounded-md px-1.5 py-0.5 text-[11px] ring-1"
          style={{ color: tone, borderColor: `${tone}66`, background: `${tone}14` }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}
