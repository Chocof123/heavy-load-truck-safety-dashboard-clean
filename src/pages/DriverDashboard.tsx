import DashboardHeader from "../components/DashboardHeader";
import DriverProfileCard from "../components/DriverProfileCard";
import RadarComparisonCard from "../components/RadarComparisonCard";
import MainAnalysisCard from "../components/MainAnalysisCard";
import ScoreRuleGraphCard from "../components/ScoreRuleGraphCard";
import AlertLedgerTable from "../components/AlertLedgerTable";
import MapReplayCard from "../components/MapReplayCard";
import { reportMeta } from "../data/mockData";
import { Theme } from "../theme/ThemeContext";

interface Props {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLogout: () => void;
}

/** 车手安全画像 — yesterday's 6-section cockpit, unchanged layout. */
export default function DriverDashboard({ theme, onThemeChange, onLogout }: Props) {
  return (
    <DashboardShell theme={theme}>
      <DashboardHeader
        theme={theme}
        onThemeChange={onThemeChange}
        title={reportMeta.title}
        badge="温州货运 · 安全画像"
        onLogout={onLogout}
      />

      {/* six-section fixed grid:
          cols  22% | 51% | 27%
          rows  34% | 66%
          1 基本信息   4 打分规则   2 雷达对比
          5 报警流水   3 主分析区   6 地图复盘  */}
      <main
        className="grid min-h-0 flex-1 gap-4 px-5 pb-5 pt-1"
        style={{
          gridTemplateColumns: "22fr 51fr 27fr",
          gridTemplateRows: "34fr 66fr",
        }}
      >
        <DriverProfileCard />
        <ScoreRuleGraphCard />
        <RadarComparisonCard />

        <AlertLedgerTable />
        <MainAnalysisCard />
        <MapReplayCard />
      </main>
    </DashboardShell>
  );
}

/** shared letterboxed 1920×1080 canvas that scales to fit any window */
export function DashboardShell({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        theme === "bright" ? "theme-bright" : ""
      }`}
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="app-bg flex shrink-0 flex-col overflow-hidden"
        style={{
          width: "1920px",
          height: "1080px",
          transform: "scale(min(100vw / 1920px, 100vh / 1080px))",
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
