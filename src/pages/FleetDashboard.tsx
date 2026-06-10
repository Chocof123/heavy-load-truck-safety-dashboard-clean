import DashboardHeader from "../components/DashboardHeader";
import ScoreRuleGraphCard from "../components/ScoreRuleGraphCard";
import FleetBasicInfoCard from "../components/fleet/FleetBasicInfoCard";
import FleetRadarScoreCard from "../components/fleet/FleetRadarScoreCard";
import FleetTrendAnalysisCard from "../components/fleet/FleetTrendAnalysisCard";
import RollingLedgerTabs from "../components/fleet/RollingLedgerTabs";
import AccidentReviewMap from "../components/fleet/AccidentReviewMap";
import { DashboardShell } from "./DriverDashboard";
import {
  fleetScoreRules,
  fleetScoreSources,
  fleetScoreOverall,
} from "../data/fleetMockData";
import { Theme } from "../theme/ThemeContext";

interface Props {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLogout: () => void;
}

/** 车队管理平台 — 6-section management cockpit (more tables / stats than the driver board). */
export default function FleetDashboard({ theme, onThemeChange, onLogout }: Props) {
  return (
    <DashboardShell theme={theme}>
      <DashboardHeader
        theme={theme}
        onThemeChange={onThemeChange}
        title="车队行车安全画像"
        onLogout={onLogout}
      />

      {/* six-section fixed grid:
          cols  左 25% | 中 44% | 右 31%
          rows  34% | 66%
          1 车队基本信息   4 打分规则结构图   2 车队安全评分雷达图
          5 报警流水台账   3 趋势统计与管理分析  6 事故深度复盘 / 公司典型事故警示 */}
      <main
        className="grid min-h-0 flex-1 gap-4 px-5 pb-5 pt-1"
        style={{
          gridTemplateColumns: "25fr 44fr 31fr",
          gridTemplateRows: "34fr 66fr",
        }}
      >
        <FleetBasicInfoCard />
        <ScoreRuleGraphCard
          rules={fleetScoreRules}
          sources={fleetScoreSources}
          overall={fleetScoreOverall}
        />
        <FleetRadarScoreCard />

        <RollingLedgerTabs />
        <FleetTrendAnalysisCard />
        <AccidentReviewMap />
      </main>
    </DashboardShell>
  );
}
