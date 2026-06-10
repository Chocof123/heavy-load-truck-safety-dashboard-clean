import { ListChecks } from "lucide-react";
import Card from "./ui/Card";
import { alertRecords, Severity } from "../data/mockData";

const SEV_STYLE: Record<Severity, string> = {
  高: "bg-red-500/15 text-red-300 ring-red-400/40",
  中: "bg-amber-400/15 text-amber-300 ring-amber-300/40",
  低: "bg-emerald-400/15 text-emerald-300 ring-emerald-300/40",
};

export default function AlertLedgerTable() {
  return (
    <Card
      title="报警流水台账"
      icon={<ListChecks size={15} />}
      right={
        <span className="rounded-md bg-cyan-glow/10 px-2 py-0.5 text-[11px] text-accent ring-1 ring-cyan-glow/25">
          共 {alertRecords.length} 条
        </span>
      }
      bodyClassName="px-3 pb-3"
    >
      <div className="thin-scroll h-full overflow-y-auto rounded-lg ring-1 ring-cyan-glow/12">
        <table className="w-full border-collapse text-left text-[11px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-panel text-cyan-glow/60">
              {["日期", "时间", "地点", "隐患类型", "具体描述", "数据来源", "严重"].map(
                (h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-cyan-glow/20 px-2 py-1.5 font-medium first:pl-3"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {alertRecords.map((r, i) => (
              <tr
                key={i}
                className="border-b border-white/5 transition hover:bg-cyan-glow/5"
              >
                <td className="whitespace-nowrap px-2 py-1.5 pl-3 font-mono text-cyan-glow/80">
                  {r.date}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 font-mono text-cyan-glow/80">
                  {r.time}
                </td>
                <td className="px-2 py-1.5 text-ink/90">{r.location}</td>
                <td className="whitespace-nowrap px-2 py-1.5">
                  <span className="rounded bg-panel/50 px-1.5 py-0.5 text-cyan-glow/90 ring-1 ring-cyan-glow/15">
                    {r.riskType}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-ink/70" style={{ minWidth: 180 }}>
                  {r.description}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-cyan-glow/70">
                  {r.source}
                </td>
                <td className="px-2 py-1.5">
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ring-1 ${SEV_STYLE[r.severity]}`}
                  >
                    {r.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
