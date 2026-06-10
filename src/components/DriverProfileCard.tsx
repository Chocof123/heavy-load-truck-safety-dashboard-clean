import { Contact } from "lucide-react";
import Card from "./ui/Card";
import { driverProfile } from "../data/mockData";

const fields: { label: string; value: string }[] = [
  { label: "性别", value: driverProfile.gender },
  { label: "健康状况", value: driverProfile.healthStatus },
  { label: "驾龄", value: driverProfile.drivingYears },
  { label: "出生年月", value: driverProfile.birthDate },
  { label: "技术等级", value: driverProfile.skillLevel },
  { label: "资格类型", value: driverProfile.licenseType },
  { label: "所属路线", value: driverProfile.route },
  { label: "所属车队", value: driverProfile.fleet },
  { label: "加入平台时间", value: driverProfile.joinDate },
];

export default function DriverProfileCard() {
  return (
    <Card title="基本信息" icon={<Contact size={15} />} bodyClassName="px-4 pb-3">
      <div className="flex h-full gap-3">
        {/* avatar + name */}
        <div className="flex w-[34%] flex-col items-center">
          <div className="relative w-full">
            <div className="absolute inset-0 rounded-xl bg-cyan-glow/20 blur-md" />
            <img
              src={driverProfile.avatarUrl}
              alt={driverProfile.name}
              className="relative aspect-square w-full rounded-xl object-cover ring-1 ring-cyan-glow/40"
            />
          </div>
          <div className="mt-2 text-center">
            <div className="text-lg font-bold tracking-wide text-ink">
              {driverProfile.name}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-cyan-glow/70">
              {driverProfile.phone}
            </div>
          </div>
        </div>

        {/* info grid */}
        <div className="grid min-w-0 flex-1 grid-cols-2 content-center gap-x-3 gap-y-[6px]">
          {fields.map((f) => (
            <div key={f.label} className="min-w-0">
              <div className="neon-label">{f.label}</div>
              <div className="truncate text-[12px] neon-value" title={f.value}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
