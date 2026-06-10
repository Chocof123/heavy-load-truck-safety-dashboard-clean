import { Gauge, Route, Timer, Clock, AlertTriangle, CalendarClock } from "lucide-react";
import { drivingStats } from "../data/mockData";

const stats = [
  { icon: Route, label: "累计驾驶里程", value: drivingStats.totalMileage },
  { icon: Gauge, label: "日均驾驶里程", value: drivingStats.dailyMileage },
  { icon: Timer, label: "累计驾驶时长", value: drivingStats.totalDrivingTime },
  { icon: Clock, label: "日均驾驶时长", value: drivingStats.dailyDrivingTime },
  { icon: AlertTriangle, label: "累计报警次数", value: String(drivingStats.totalAlerts) },
  { icon: CalendarClock, label: "日均报警次数", value: String(drivingStats.dailyAlerts) },
];

export default function DrivingStatsPanel() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-panel/55 p-2.5 ring-1 ring-cyan-glow/12">
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
        <Gauge size={14} />
        驾驶数据
      </div>
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col justify-center rounded-lg bg-panel/60 px-2 py-1 ring-1 ring-cyan-glow/15"
          >
            <div className="flex items-center gap-1 text-[10px] text-cyan-glow/60">
              <Icon size={11} />
              {label}
            </div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
