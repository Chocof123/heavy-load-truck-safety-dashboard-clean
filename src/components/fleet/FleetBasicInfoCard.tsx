import { Contact, Phone } from "lucide-react";
import Card from "../ui/Card";
import { fleetProfile } from "../../data/fleetMockData";

type Tone = "green" | "yellow" | "red" | "blue";

const TONE: Record<Tone, string> = {
  green: "text-[#41e08a]",
  yellow: "text-[#ffd97a]",
  red: "text-[#ff8f8f]",
  blue: "text-accent",
};

const stats: { label: string; value: string; tone: Tone; big?: boolean }[] = [
  { label: "安全评分", value: String(fleetProfile.safetyScore), tone: "green", big: true },
  { label: "车辆数", value: `${fleetProfile.vehicleCount}`, tone: "blue", big: true },
  { label: "事故起数", value: `${fleetProfile.accidentCount}`, tone: "red" },
  { label: "投诉起数", value: `${fleetProfile.complaintCount}`, tone: "yellow" },
  { label: "万公里事故数", value: String(fleetProfile.accidentsPer10k), tone: "blue" },
  { label: "万公里报警数", value: String(fleetProfile.alertsPer10k), tone: "yellow" },
];

export default function FleetBasicInfoCard() {
  return (
    <Card title="车队基本信息" icon={<Contact size={15} />} bodyClassName="px-4 pb-3">
      <div className="flex h-full items-center gap-4">
        {/* leader avatar + name + phone */}
        <div className="flex w-[34%] shrink-0 flex-col items-center justify-center">
          <div className="relative w-full max-w-[112px]">
            <div className="absolute inset-0 rounded-xl bg-cyan-glow/20 blur-md" />
            <img
              src={fleetProfile.avatarUrl}
              alt={fleetProfile.leaderName}
              className="relative aspect-square w-full rounded-xl object-cover ring-1 ring-cyan-glow/40"
            />
          </div>
          <div className="mt-2.5 text-center">
            <div className="text-lg font-bold tracking-wide text-ink">
              {fleetProfile.leaderName}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-cyan-glow/55">车队长</div>
            <div className="mt-1.5 flex items-center justify-center gap-1 font-mono text-[11px] text-cyan-glow/75">
              <Phone size={11} className="text-accent" />
              {fleetProfile.phone}
            </div>
          </div>
        </div>

        {/* key metric tiles — fixed 3 x 2 grid, equal heights */}
        <div
          className="grid min-w-0 flex-1 gap-2"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col justify-center rounded-lg bg-panel/60 px-2.5 py-2 ring-1 ring-cyan-glow/15"
            >
              <div className="neon-label truncate" title={s.label}>
                {s.label}
              </div>
              <div
                className={`mt-1 font-mono font-bold leading-none ${TONE[s.tone]} ${
                  s.big ? "text-[24px]" : "text-[19px]"
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
