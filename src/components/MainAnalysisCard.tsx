import { LayoutDashboard } from "lucide-react";
import Card from "./ui/Card";
import HighlightPanel from "./HighlightPanel";
import DrivingStatsPanel from "./DrivingStatsPanel";
import RiskCorrectionPanel from "./RiskCorrectionPanel";
import ScoreTrendChart from "./ScoreTrendChart";

export default function MainAnalysisCard() {
  return (
    <Card
      title="主分析区 · 亮点 / 数据 / 整改 / 趋势"
      icon={<LayoutDashboard size={15} />}
      className="shadow-glow-strong"
      bodyClassName="grid grid-rows-[42fr_58fr] gap-3 px-3 pb-3"
    >
      {/* top 42%: three panels */}
      <div className="grid min-h-0 grid-cols-[28fr_38fr_34fr] gap-3">
        <HighlightPanel />
        <DrivingStatsPanel />
        <RiskCorrectionPanel />
      </div>
      {/* bottom 58%: trend */}
      <div className="min-h-0">
        <ScoreTrendChart />
      </div>
    </Card>
  );
}
