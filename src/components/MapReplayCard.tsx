import { useState } from "react";
import { MapPinned } from "lucide-react";
import Card from "./ui/Card";
import LocalWenzhouRoadMap from "./LocalWenzhouRoadMap";
import VideoReplayPanel from "./VideoReplayPanel";
import PersonalDeepReview from "./PersonalDeepReview";
import CompanyWarningCases from "./CompanyWarningCases";
import { replayByMarker, defaultReplayMarkerId } from "../data/mockData";

const TOGGLES = ["显示报警/事故点", "本人事故深度复盘", "公司典型事故警示"];

export default function MapReplayCard() {
  const [selectedId, setSelectedId] = useState<number>(defaultReplayMarkerId);
  const [toggle, setToggle] = useState(0);

  const replay = replayByMarker[selectedId] ?? replayByMarker[defaultReplayMarkerId];

  const handleSelect = (id: number) => {
    if (replayByMarker[id]) setSelectedId(id);
  };

  return (
    <Card
      title="地图展示 · 视频复盘"
      icon={<MapPinned size={15} />}
      bodyClassName="flex flex-col gap-2 px-3 pb-3"
    >
      {/* toggle buttons */}
      <div className="flex gap-1">
        {TOGGLES.map((t, i) => (
          <button
            key={t}
            onClick={() => setToggle(i)}
            className={`flex-1 rounded-md px-1 py-1 text-[10.5px] font-medium transition ${
              i === toggle
                ? "bg-cyan-glow/20 text-accent ring-1 ring-cyan-glow/50"
                : "bg-panel/50 text-cyan-glow/55 ring-1 ring-cyan-glow/15 hover:text-cyan-glow/80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* content swaps by toggle */}
      {toggle === 0 && (
        <>
          <div className="min-h-0 flex-[3]">
            <LocalWenzhouRoadMap selectedId={selectedId} onSelect={handleSelect} />
          </div>
          <div className="min-h-0 flex-[2]">
            <VideoReplayPanel replay={replay} />
          </div>
        </>
      )}

      {toggle === 1 && (
        <div className="min-h-0 flex-1">
          <PersonalDeepReview />
        </div>
      )}

      {toggle === 2 && (
        <div className="min-h-0 flex-1">
          <CompanyWarningCases />
        </div>
      )}
    </Card>
  );
}
