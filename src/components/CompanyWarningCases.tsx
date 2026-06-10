import { TriangleAlert, MapPin } from "lucide-react";
import { companyWarningCases, Severity } from "../data/mockData";

const SEV: Record<Severity, string> = {
  高: "bg-red-500/20 text-red-300 ring-red-400/40",
  中: "bg-amber-400/20 text-amber-300 ring-amber-300/40",
  低: "bg-emerald-400/20 text-emerald-300 ring-emerald-300/40",
};

export default function CompanyWarningCases() {
  return (
    <div className="thin-scroll h-full overflow-y-auto pr-1">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-cyan-glow/70">
        <TriangleAlert size={13} className="text-amber-300" />
        公司近半年典型事故 · 警示教育（共 {companyWarningCases.length} 例）
      </div>
      <div className="space-y-1.5">
        {companyWarningCases.map((c) => (
          <div
            key={c.id}
            className="rounded-lg bg-panel/60 p-2 ring-1 ring-cyan-glow/15 transition hover:ring-cyan-glow/30"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-400/15 text-[11px] font-bold text-amber-300 ring-1 ring-amber-300/40">
                {c.id}
              </span>
              <span className="text-[12px] font-bold text-ink">{c.title}</span>
              <span
                className={`ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold ring-1 ${SEV[c.severity]}`}
              >
                {c.type}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[10px] text-cyan-glow/55">
              <span className="font-mono">{c.date}</span>
              <span className="flex items-center gap-0.5">
                <MapPin size={10} />
                {c.location}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[10.5px] leading-snug">
              <p className="text-ink/80">
                <span className="text-cyan-glow/55">起因：</span>
                {c.cause}
              </p>
              <p className="text-ink/80">
                <span className="text-cyan-glow/55">后果：</span>
                {c.consequence}
              </p>
              <p className="text-[#ffd97a]">
                <span className="text-cyan-glow/55">警示：</span>
                {c.lesson}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
