import { useEffect, useMemo, useState } from "react";
import { mapMarkers, Severity } from "../data/mockData";
import { useTheme } from "../theme/ThemeContext";

// generic point the map can plot — driver board passes alerts, fleet board
// passes accident-review points; both supply lon/lat/severity + labels.
export interface MapPoint {
  id: number;
  lon: number;
  lat: number;
  severity: Severity | "橙";
  title: string;
  sub?: string;
  time?: string;
}

// default points: the driver board's alert markers
const DEFAULT_POINTS: MapPoint[] = mapMarkers.map((m) => ({
  id: m.id,
  lon: m.lon,
  lat: m.lat,
  severity: m.severity,
  title: m.type,
  sub: m.location,
  time: m.time,
}));

// bright-mode road palette keyed by tier z-level — deep, data-friendly tones
// that read on the sage map background (theme anchored on #16610E)
const BRIGHT_ROAD: Record<number, string> = {
  5: "#c0741f", // 高速 deep amber
  4: "#b9512a", // 主干 burnt orange
  3: "#2f6f9e", // 次干 steel blue
  2: "#3f7d35", // 支路 forest green
};

// ---- converted asset shape (see tools/convert_wenzhou_shp.py) --------------
type Line = [number, string, number[][]]; // [typeIndex, name, [[lon,lat],...]]
interface RoadsData {
  source: string;
  bbox: [number, number, number, number];
  types: string[];
  roads: Line[];
  waterways: Line[];
  railways: Line[];
  places: [string, string, number, number][];
}

// focused viewport over central 温州 where the mock incidents cluster
const VIEW = { minLon: 120.608, minLat: 27.9, maxLon: 120.79, maxLat: 28.045 };

interface RoadStyle {
  color: string;
  width: number;
  z: number;
  opacity: number;
}

function styleFor(type: string): RoadStyle {
  if (type === "motorway" || type === "motorway_link")
    return { color: "#f5b942", width: 2.6, z: 5, opacity: 0.95 };
  if (type === "trunk" || type === "trunk_link")
    return { color: "#f59442", width: 2.2, z: 4, opacity: 0.92 };
  if (type === "primary" || type === "primary_link")
    return { color: "#ff7d4d", width: 1.9, z: 4, opacity: 0.9 };
  if (type === "secondary" || type === "secondary_link")
    return { color: "#3ee7ff", width: 1.3, z: 3, opacity: 0.8 };
  if (type === "tertiary" || type === "tertiary_link")
    return { color: "#46c8a0", width: 1.0, z: 2, opacity: 0.65 };
  // residential / service / path / footway / unclassified / ...
  // small card -> keep only context, draw faint & thin (z:0 = filtered out)
  return { color: "#33506f", width: 0.5, z: 0, opacity: 0.35 };
}

interface Props {
  selectedId: number;
  onSelect: (id: number) => void;
  points?: MapPoint[];
}

export default function LocalWenzhouRoadMap({ selectedId, onSelect, points = DEFAULT_POINTS }: Props) {
  const bright = useTheme() === "bright";
  const [data, setData] = useState<RoadsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}map-data/wenzhou-roads.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  // projection (equirectangular w/ latitude correction) -> svg coords
  const proj = useMemo(() => {
    const centerLat = (VIEW.minLat + VIEW.maxLat) / 2;
    const lonScale = Math.cos((centerLat * Math.PI) / 180);
    const W = 1000;
    const geoW = (VIEW.maxLon - VIEW.minLon) * lonScale;
    const geoH = VIEW.maxLat - VIEW.minLat;
    const H = (W * geoH) / geoW;
    const x = (lon: number) =>
      ((lon - VIEW.minLon) / (VIEW.maxLon - VIEW.minLon)) * W;
    const y = (lat: number) =>
      ((VIEW.maxLat - lat) / (VIEW.maxLat - VIEW.minLat)) * H;
    return { W, H, x, y };
  }, []);

  const inView = (lon: number, lat: number) =>
    lon >= VIEW.minLon &&
    lon <= VIEW.maxLon &&
    lat >= VIEW.minLat &&
    lat <= VIEW.maxLat;

  // build rendered layers, cropped + sorted so major roads draw on top
  const layers = useMemo(() => {
    if (!data) return null;
    const toPath = (line: number[][]) => {
      let d = "";
      for (let i = 0; i < line.length; i++) {
        const [lon, lat] = line[i];
        d += `${i === 0 ? "M" : "L"}${proj.x(lon).toFixed(1)} ${proj.y(lat).toFixed(1)}`;
      }
      return d;
    };
    const touches = (line: number[][]) => line.some(([lo, la]) => inView(lo, la));

    const roads: { d: string; s: RoadStyle }[] = [];
    for (const [ti, , line] of data.roads) {
      if (line.length < 2 || !touches(line)) continue;
      const base = styleFor(data.types[ti]);
      if (base.z === 0) continue; // declutter: skip residential/service/minor roads
      const s = bright
        ? { ...base, color: BRIGHT_ROAD[base.z] ?? base.color, opacity: Math.min(1, base.opacity + 0.2) }
        : base;
      roads.push({ d: toPath(line), s });
    }
    roads.sort((a, b) => a.s.z - b.s.z);

    const waterways: string[] = [];
    for (const [, , line] of data.waterways) {
      if (line.length < 2 || !touches(line)) continue;
      waterways.push(toPath(line));
    }
    const railways: string[] = [];
    for (const [, , line] of data.railways) {
      if (line.length < 2 || !touches(line)) continue;
      railways.push(toPath(line));
    }
    return { roads, waterways, railways };
  }, [data, proj, bright]);

  if (error)
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-red-300">
        地图数据加载失败：{error}
      </div>
    );
  if (!data || !layers)
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-cyan-glow/60">
        正在加载温州路网…
      </div>
    );

  // 严重程度配色：高/严重=红, 橙/较严重=橙, 中/一般=黄, 低/轻微=绿
  const sevColor = (s: string) => {
    if (s === "高") return bright ? "#b5302a" : "#ff5d5d";
    if (s === "橙") return bright ? "#c46a18" : "#ff9d3c";
    if (s === "中") return bright ? "#bd7d12" : "#f5c451";
    return bright ? "#2f8f4a" : "#41e08a"; // 低
  };

  const mapBg = bright ? "#e7ecdd" : "#06101c";
  const waterStroke = bright ? "#86aecb" : "#1c6fa0";
  const railStroke = bright ? "#8a9580" : "#6c7a99";

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-lg ring-1 ring-cyan-glow/15"
      style={{ background: mapBg }}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${proj.W} ${proj.H}`}
        preserveAspectRatio="none"
        style={{ filter: bright ? "saturate(0.82)" : "saturate(0.6) brightness(0.8)" }}
      >
        {/* base map (roads/water/rail) — dimmed so incident points stand out */}
        <g opacity={bright ? 0.72 : 0.46}>
        {/* waterways */}
        {layers.waterways.map((d, i) => (
          <path
            key={`w${i}`}
            d={d}
            fill="none"
            stroke={waterStroke}
            strokeOpacity={bright ? 0.8 : 0.45}
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* railways */}
        {layers.railways.map((d, i) => (
          <path
            key={`r${i}`}
            d={d}
            fill="none"
            stroke={railStroke}
            strokeOpacity={bright ? 0.7 : 0.5}
            strokeWidth={0.9}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* roads (sorted minor -> major) */}
        {layers.roads.map((r, i) => (
          <path
            key={`rd${i}`}
            d={r.d}
            fill="none"
            stroke={r.s.color}
            strokeOpacity={r.s.opacity}
            strokeWidth={r.s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        </g>
      </svg>

      {/* incident markers (HTML overlay positioned by % of viewBox) */}
      {points.map((m) => {
        const left = (proj.x(m.lon) / proj.W) * 100;
        const top = (proj.y(m.lat) / proj.H) * 100;
        const active = selectedId === m.id;
        const color = sevColor(m.severity);
        return (
          <button
            key={m.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
            onClick={() => onSelect(m.id)}
            onMouseEnter={() => setHoverId(m.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <span
              className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulseDot"
              style={{ background: color }}
            />
            <span
              className="relative block h-3 w-3 rounded-full ring-2 ring-white/90"
              style={{
                background: color,
                boxShadow: `0 0 ${active ? 20 : 13}px ${color}, 0 0 4px #fff`,
                transform: active ? "scale(1.5)" : "scale(1)",
              }}
            />
            {/* popup — hover only, keeps the small map uncluttered */}
            {hoverId === m.id && (
              <div
                className="absolute bottom-4 left-1/2 z-30 w-40 -translate-x-1/2 rounded-lg p-2 text-left ring-1 backdrop-blur"
                style={{
                  background: bright ? "rgba(255,255,255,0.96)" : "rgba(8,19,31,0.95)",
                  borderColor: color,
                  boxShadow: `0 0 16px ${color}66`,
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: bright ? "#1b2b23" : "#ffffff" }}
                  >
                    {m.title}
                  </span>
                  <span
                    className="rounded px-1 text-[10px] font-bold"
                    style={{ background: `${color}33`, color }}
                  >
                    {m.severity}
                  </span>
                </div>
                <div
                  className="space-y-0.5 text-[10px]"
                  style={{ color: bright ? "#3a5a48" : "rgb(var(--accent-rgb) / 0.8)" }}
                >
                  {m.time && <div>🕒 {m.time}</div>}
                  {m.sub && <div>📍 {m.sub}</div>}
                </div>
              </div>
            )}
          </button>
        );
      })}

      {/* attribution */}
      <div
        className="absolute bottom-1 right-1.5 z-10 rounded px-1.5 py-0.5 text-[9px]"
        style={{
          background: bright ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
          color: bright ? "#4a6b58" : "rgb(var(--accent-rgb) / 0.45)",
        }}
      >
        © OpenStreetMap contributors / BBBike extract
      </div>

      {/* legend */}
      <div
        className="absolute left-1.5 top-1.5 z-10 space-y-0.5 rounded-md px-2 py-1 text-[9px]"
        style={{ background: bright ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.45)" }}
      >
        <Legend c={bright ? BRIGHT_ROAD[5] : "#f5b942"} t="高速" bright={bright} />
        <Legend c={bright ? BRIGHT_ROAD[4] : "#ff7d4d"} t="主干路" bright={bright} />
        <Legend c={bright ? BRIGHT_ROAD[3] : "#3ee7ff"} t="次干路" bright={bright} />
        <Legend c={bright ? BRIGHT_ROAD[2] : "#46c8a0"} t="支路" bright={bright} />
      </div>
    </div>
  );
}

function Legend({ c, t, bright }: { c: string; t: string; bright: boolean }) {
  return (
    <div
      className="flex items-center gap-1"
      style={{ color: bright ? "#365846" : "rgb(var(--accent-rgb) / 0.7)" }}
    >
      <span className="h-[2px] w-3 rounded" style={{ background: c }} />
      {t}
    </div>
  );
}
