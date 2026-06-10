import { Award, CheckCircle2, PlusCircle } from "lucide-react";
import { highlights } from "../data/mockData";

function Group({
  icon,
  label,
  items,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color }}>
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-md bg-panel/50 px-1.5 py-0.5 text-[11px] text-cyan-glow/90 ring-1 ring-cyan-glow/15"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HighlightPanel() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-amber-300">
        <Award size={14} />
        亮点工作
      </div>
      <div className="flex flex-1 flex-col justify-around gap-2">
        <Group
          icon={<CheckCircle2 size={12} />}
          label="得满分的细项"
          items={highlights.fullScoreItems}
          color="#41e08a"
        />
        <Group
          icon={<CheckCircle2 size={12} />}
          label="高于公司平均"
          items={highlights.aboveCompanyAverage}
          color="#3ee7ff"
        />
        <Group
          icon={<PlusCircle size={12} />}
          label="加分项"
          items={highlights.bonusItems}
          color="#f5c451"
        />
      </div>
    </div>
  );
}
