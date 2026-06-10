// ============================================================================
// 驾驶员画像 — Mock data (温州货车司机, 近30天)
// All data is fictional and for demonstration only.
// ============================================================================

export const reportMeta = {
  title: "驾驶员行车安全画像",
  generatedAt: "2026-06-08 14:30",
  period: "近30天",
};

// ---- Section 1: 基本信息 -----------------------------------------------------
export const driverProfile = {
  name: "王东华",
  phone: "18514449171",
  gender: "男",
  healthStatus: "良好",
  drivingYears: "18年",
  birthDate: "1972-08",
  skillLevel: "高级驾驶员",
  licenseType: "A2 / 道路运输从业资格",
  route: "温州—瑞安干线",
  fleet: "温州市鑫达运输有限公司 · 一车队",
  joinDate: "2025-10-23",
  avatarUrl: `${import.meta.env.BASE_URL}mock-driver-avatar.jpg`,
};

// ---- Section 2: 雷达评分 / 车队对比 ------------------------------------------
export interface RadarPoint {
  dimension: string;
  driver: number;
  fleet: number;
}

export const radarData: RadarPoint[] = [
  { dimension: "事故投诉", driver: 92, fleet: 86 },
  { dimension: "驾驶行为", driver: 88, fleet: 82 },
  { dimension: "出勤例保", driver: 95, fleet: 90 },
  { dimension: "安全能力", driver: 84, fleet: 87 },
  { dimension: "教育培训", driver: 90, fleet: 85 },
];

export const radarSummary = {
  overallScore: 90.21,
  fleetRank: "8 / 75",
  rankChange: "提升 2 名",
  safetyRating: 5, // ★ count
};

// ---- Section 3.1: 亮点工作 --------------------------------------------------
export const highlights = {
  fullScoreItems: ["出勤例保", "教育培训完成率"],
  aboveCompanyAverage: ["事故投诉", "驾驶行为稳定性"],
  bonusItems: ["连续30天无重大报警", "完成安全培训复训"],
};

// ---- Section 3.2: 驾驶数据 --------------------------------------------------
export const drivingStats = {
  totalMileage: "3469.21 km",
  dailyMileage: "124.6 km",
  totalDrivingTime: "142小时35分",
  dailyDrivingTime: "4小时45分",
  totalAlerts: 7,
  dailyAlerts: 0.23,
};

// ---- Section 3.3: 问题整改 --------------------------------------------------
export const riskSummary = {
  highRiskTime: "17:00–19:00",
  highRiskRoad: "瓯海大道 / 车站大道交汇段",
  topRisks: [
    { type: "分心驾驶", value: 38 },
    { type: "跟车过近", value: 27 },
    { type: "急刹车", value: 21 },
    { type: "其他", value: 14 },
  ],
};

// ---- Section 3.4: 得分趋势 (multi granularity) ------------------------------
export interface TrendPoint {
  date: string;
  personal: number;
  fleet: number;
  company: number;
}

export type TrendGranularity = "日K" | "周K" | "月K" | "季K" | "年K";

// 日K — intraday-style swings, sharper ups & downs
const dayTrend: TrendPoint[] = [
  { date: "06/01", personal: 84.2, fleet: 85.8, company: 83.9 },
  { date: "06/02", personal: 91.5, fleet: 86.4, company: 84.1 },
  { date: "06/03", personal: 79.8, fleet: 86.0, company: 84.0 },
  { date: "06/04", personal: 93.1, fleet: 87.0, company: 84.5 },
  { date: "06/05", personal: 90.21, fleet: 87.4, company: 84.8 },
  { date: "06/06", personal: 95.4, fleet: 87.1, company: 84.6 },
  { date: "06/07", personal: 88.3, fleet: 87.6, company: 84.9 },
  { date: "06/08", personal: 92.7, fleet: 87.9, company: 85.1 },
];

// 周K — week-over-week, a dip then recovery
const weekTrend: TrendPoint[] = [
  { date: "W16", personal: 81.5, fleet: 82.8, company: 81.2 },
  { date: "W17", personal: 85.9, fleet: 83.6, company: 81.9 },
  { date: "W18", personal: 78.4, fleet: 84.0, company: 82.3 },
  { date: "W19", personal: 87.2, fleet: 84.9, company: 82.8 },
  { date: "W20", personal: 92.6, fleet: 85.8, company: 83.5 },
  { date: "W21", personal: 88.1, fleet: 86.4, company: 84.0 },
  { date: "W22", personal: 94.0, fleet: 87.0, company: 84.5 },
  { date: "W23", personal: 90.21, fleet: 87.4, company: 84.9 },
];

// 月K — month-over-month across the past year, clear trend with a slump
const monthTrend: TrendPoint[] = [
  { date: "2025/07", personal: 76.5, fleet: 78.2, company: 77.0 },
  { date: "2025/08", personal: 82.4, fleet: 79.8, company: 78.6 },
  { date: "2025/09", personal: 79.1, fleet: 80.3, company: 79.0 },
  { date: "2025/10", personal: 85.7, fleet: 81.6, company: 80.2 },
  { date: "2025/11", personal: 88.9, fleet: 82.9, company: 81.1 },
  { date: "2025/12", personal: 83.2, fleet: 83.4, company: 81.8 },
  { date: "2026/01", personal: 90.4, fleet: 84.6, company: 82.5 },
  { date: "2026/02", personal: 86.8, fleet: 85.1, company: 83.0 },
  { date: "2026/03", personal: 93.5, fleet: 85.9, company: 83.6 },
  { date: "2026/04", personal: 89.3, fleet: 86.5, company: 84.1 },
  { date: "2026/05", personal: 94.7, fleet: 87.0, company: 84.6 },
  { date: "2026/06", personal: 90.21, fleet: 87.4, company: 84.8 },
];

// 季K — quarter-over-quarter, two-year span with a clear recovery curve
const quarterTrend: TrendPoint[] = [
  { date: "Q1'24", personal: 71.2, fleet: 73.5, company: 72.4 },
  { date: "Q2'24", personal: 78.6, fleet: 75.8, company: 74.1 },
  { date: "Q3'24", personal: 74.3, fleet: 77.0, company: 75.6 },
  { date: "Q4'24", personal: 82.9, fleet: 79.2, company: 77.8 },
  { date: "Q1'25", personal: 79.5, fleet: 80.6, company: 79.0 },
  { date: "Q2'25", personal: 86.4, fleet: 82.1, company: 80.4 },
  { date: "Q3'25", personal: 83.1, fleet: 83.8, company: 81.7 },
  { date: "Q4'25", personal: 88.7, fleet: 85.2, company: 82.9 },
  { date: "Q1'26", personal: 85.0, fleet: 86.3, company: 83.8 },
  { date: "Q2'26", personal: 90.21, fleet: 87.4, company: 84.8 },
];

// 年K — multi-year long-term climb
const yearTrend: TrendPoint[] = [
  { date: "2019", personal: 64.5, fleet: 68.0, company: 67.2 },
  { date: "2020", personal: 72.8, fleet: 71.4, company: 70.1 },
  { date: "2021", personal: 69.3, fleet: 73.6, company: 72.5 },
  { date: "2022", personal: 78.1, fleet: 76.2, company: 74.8 },
  { date: "2023", personal: 81.6, fleet: 79.0, company: 77.4 },
  { date: "2024", personal: 79.4, fleet: 81.5, company: 79.6 },
  { date: "2025", personal: 87.2, fleet: 84.1, company: 81.9 },
  { date: "2026", personal: 90.21, fleet: 87.4, company: 84.8 },
];

export const scoreTrendByGranularity: Record<TrendGranularity, TrendPoint[]> = {
  日K: dayTrend,
  周K: weekTrend,
  月K: monthTrend,
  季K: quarterTrend,
  年K: yearTrend,
};

// ---- Section 4: 打分规则结构图 ----------------------------------------------
export type ScoreStatus = "excellent" | "risk" | "poor";

export interface ScoreRule {
  module: string;
  weight: number;
  score: number;
  status: ScoreStatus;
}

export const scoreRules: ScoreRule[] = [
  { module: "教育培训", weight: 10, score: 92, status: "excellent" },
  { module: "驾驶行为", weight: 30, score: 88, status: "excellent" },
  { module: "事故投诉", weight: 30, score: 86, status: "risk" },
  { module: "出勤例保", weight: 20, score: 95, status: "excellent" },
  { module: "安全能力", weight: 10, score: 84, status: "risk" },
];

export const scoreSources = [
  "培训记录",
  "DSM / ADAS",
  "出险及投诉记录",
  "叮咚查及维保记录",
  "安全运营统计分析记录",
];

export function getScoreStatus(score: number): "green" | "yellow" | "red" {
  if (score >= 88) return "green";
  if (score >= 75) return "yellow";
  return "red";
}

// ---- Section 5: 报警流水台账 ------------------------------------------------
export type Severity = "高" | "中" | "低";

export interface AlertRecord {
  date: string;
  time: string;
  location: string;
  riskType: string;
  description: string;
  source: string;
  severity: Severity;
}

export const alertRecords: AlertRecord[] = [
  {
    date: "06/05",
    time: "17:23",
    location: "人民路—大南门路口",
    riskType: "分心驾驶",
    description: "DSM抓拍视线离路面 > 3秒，疑似看手机",
    source: "DSM设备",
    severity: "中",
  },
  {
    date: "06/03",
    time: "08:45",
    location: "温州火车站广场进站口",
    riskType: "跟车过近",
    description: "FCW前向碰撞预警，车头时距 < 0.8秒",
    source: "ADAS",
    severity: "高",
  },
  {
    date: "05/31",
    time: "13:12",
    location: "锦绣路—南浦路",
    riskType: "急刹车",
    description: "G值达到0.42g，导致一名乘客踉跄",
    source: "CAN总线",
    severity: "高",
  },
  {
    date: "05/28",
    time: "19:06",
    location: "瓯海大道辅路",
    riskType: "车道偏离",
    description: "LDW车道偏离预警，连续压线2次",
    source: "ADAS",
    severity: "中",
  },
  {
    date: "05/24",
    time: "07:52",
    location: "龙湾大道机场段",
    riskType: "疲劳驾驶",
    description: "DSM检测闭眼时长异常，触发疲劳提醒",
    source: "DSM设备",
    severity: "低",
  },
  {
    date: "05/21",
    time: "16:40",
    location: "府东路—学院路口",
    riskType: "超速",
    description: "限速60路段实测78km/h，持续约12秒",
    source: "CAN总线",
    severity: "中",
  },
  {
    date: "05/18",
    time: "21:18",
    location: "瓯江路滨江段",
    riskType: "分心驾驶",
    description: "DSM检测驾驶员低头时长 > 2.5秒",
    source: "DSM设备",
    severity: "低",
  },
  {
    date: "05/14",
    time: "10:05",
    location: "宁波路—新城大道",
    riskType: "急加速",
    description: "起步加速度0.38g，油门开度突增",
    source: "CAN总线",
    severity: "低",
  },
  {
    date: "05/11",
    time: "18:33",
    location: "温州大道—汤家桥路",
    riskType: "分心驾驶",
    description: "DSM检测驾驶员长时间偏头与副驾交谈",
    source: "DSM设备",
    severity: "中",
  },
  {
    date: "05/09",
    time: "06:20",
    location: "瓯海大道—娄桥互通",
    riskType: "未系安全带",
    description: "DSM识别驾驶员起步阶段未系安全带",
    source: "DSM设备",
    severity: "中",
  },
  {
    date: "05/06",
    time: "22:47",
    location: "金丽温高速温州西出口",
    riskType: "疲劳驾驶",
    description: "连续驾驶超4小时，DSM触发二级疲劳预警",
    source: "DSM设备",
    severity: "高",
  },
  {
    date: "05/03",
    time: "11:58",
    location: "车站大道—新城路口",
    riskType: "跟车过近",
    description: "FCW前向碰撞预警，车头时距 < 0.9秒",
    source: "ADAS",
    severity: "中",
  },
  {
    date: "04/30",
    time: "15:14",
    location: "瓯江路—望江东路",
    riskType: "急转弯",
    description: "横向加速度0.45g，过弯车速偏高",
    source: "CAN总线",
    severity: "低",
  },
  {
    date: "04/27",
    time: "09:36",
    location: "温州绕城高速南段",
    riskType: "超速",
    description: "限速100路段实测118km/h，持续约20秒",
    source: "CAN总线",
    severity: "高",
  },
  {
    date: "04/24",
    time: "20:02",
    location: "府东路—惠民路口",
    riskType: "车道偏离",
    description: "LDW车道偏离预警，夜间压实线1次",
    source: "ADAS",
    severity: "低",
  },
];

// ---- Section 6: 地图标记 + 视频复盘 -----------------------------------------
export interface MapMarker {
  id: number;
  lon: number;
  lat: number;
  severity: Severity;
  type: string;
  location: string;
  time: string;
}

export const mapMarkers: MapMarker[] = [
  {
    id: 1,
    lon: 120.6998,
    lat: 27.9949,
    severity: "高",
    type: "跟车过近",
    location: "温州火车站广场进站口",
    time: "06/03 08:45",
  },
  {
    id: 2,
    lon: 120.6533,
    lat: 28.0121,
    severity: "中",
    type: "分心驾驶",
    location: "人民路—大南门路口",
    time: "06/05 17:23",
  },
  {
    id: 3,
    lon: 120.6746,
    lat: 27.9812,
    severity: "高",
    type: "急刹车",
    location: "锦绣路—南浦路",
    time: "05/31 13:12",
  },
  {
    id: 4,
    lon: 120.7428,
    lat: 27.9345,
    severity: "中",
    type: "车道偏离",
    location: "瓯海大道辅路",
    time: "05/28 19:06",
  },
];

export interface ReplayDetail {
  time: string;
  location: string;
  description: string;
  parkingDuration: string;
  hazardLight: string;
  accStatus: string;
  dataReplay: string;
}

// keyed by marker id so clicking a marker updates the replay panel
export const replayByMarker: Record<number, ReplayDetail> = {
  2: {
    time: "06/05 17:23",
    location: "温州市人民路—大南门路口",
    description:
      "三车追尾主责本车，前车突发减速，本车驾驶员未及时制动，造成三车人员轻伤。",
    parkingDuration: "8分钟",
    hazardLight: "开，持续15秒",
    accStatus: "关",
    dataReplay:
      "事发前10秒车速约42km/h，全程提前减速不足；事发前3秒仍保持跟车距离不足，制动介入偏晚。",
  },
  1: {
    time: "06/03 08:45",
    location: "温州火车站广场进站口",
    description:
      "进站口车流密集，本车与前车车头时距低于0.8秒，触发FCW前向碰撞预警，未造成事故。",
    parkingDuration: "—",
    hazardLight: "关",
    accStatus: "开",
    dataReplay:
      "事发前车速约31km/h，前车连续点刹，本车跟车距离持续不足，预警后驾驶员及时松油门减速。",
  },
  3: {
    time: "05/31 13:12",
    location: "温州市锦绣路—南浦路",
    description:
      "前方电动车突然横穿，本车紧急制动，G值达0.42g，车内一名随车人员踉跄，无受伤。",
    parkingDuration: "2分钟",
    hazardLight: "开，持续8秒",
    accStatus: "开",
    dataReplay:
      "事发前车速约48km/h，制动响应及时但初速偏高，建议进入路口前提前预减速。",
  },
  4: {
    time: "05/28 19:06",
    location: "温州市瓯海大道辅路",
    description:
      "夜间辅路照明不足，本车连续两次轻微压线，触发LDW车道偏离预警，无人员及财产损失。",
    parkingDuration: "—",
    hazardLight: "关",
    accStatus: "开",
    dataReplay:
      "事发时车速约56km/h，方向修正幅度偏大，疑似注意力短暂下降，建议夜间降低车速并保持车道居中。",
  },
};

export const defaultReplayMarkerId = 2;

// ---- Section 6 · 本人事故深度复盘 -------------------------------------------
export interface DeepReviewFrame {
  t: string; // 相对时间，如 "-10s"
  speed: string;
  event: string;
  risk: "safe" | "warn" | "danger";
}

export const personalDeepReview = {
  title: "人民路—大南门路口 三车追尾事故",
  time: "2026-06-05 17:23",
  location: "温州市鹿城区 人民路—大南门路口",
  severity: "高" as Severity,
  responsibility: "本车主责",
  weather: "小雨 / 路面湿滑",
  casualties: "三车 3 人轻伤",
  summary:
    "晚高峰车流密集，前车因避让电动车突发急减速，本车驾驶员注意力分散、跟车距离不足，制动介入偏晚，追尾前车并推动其与第三车连环碰撞。",
  frames: [
    { t: "-10s", speed: "42 km/h", event: "正常跟车，车头时距 1.1s", risk: "safe" },
    { t: "-6s", speed: "43 km/h", event: "DSM 检测驾驶员视线右偏 2.1s", risk: "warn" },
    { t: "-3s", speed: "41 km/h", event: "前车刹车灯亮，FCW 前向碰撞预警触发", risk: "danger" },
    { t: "-1.2s", speed: "38 km/h", event: "驾驶员开始制动，G 值 0.36g", risk: "danger" },
    { t: "0s", speed: "21 km/h", event: "追尾前车，二次推撞第三车", risk: "danger" },
  ] as DeepReviewFrame[],
  metrics: [
    { label: "事发车速", value: "42 km/h" },
    { label: "最小车头时距", value: "0.7 s" },
    { label: "制动反应延迟", value: "1.8 s" },
    { label: "峰值减速度", value: "0.36 g" },
    { label: "预警-制动间隔", value: "1.8 s" },
    { label: "前车距离", value: "8.3 m" },
  ],
  rootCauses: ["跟车距离不足", "注意力分散（视线偏离）", "雨天未降低车速", "制动反应偏慢"],
  improvements: [
    "湿滑路面主动拉大跟车距离至 2 秒以上",
    "FCW 预警响起后立即抬油门预备制动",
    "晚高峰路口提前预判前车点刹",
    "完成《雨天防御性驾驶》专项复训",
  ],
};

// ---- Section 6 · 公司典型事故警示 -------------------------------------------
export interface WarningCase {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string;
  severity: Severity;
  cause: string;
  consequence: string;
  lesson: string;
}

export const companyWarningCases: WarningCase[] = [
  {
    id: 1,
    title: "高速追尾养护作业车",
    date: "2026-04-18",
    location: "甬台温高速 温州北段 K1832",
    type: "疲劳驾驶",
    severity: "高",
    cause: "凌晨连续驾驶 5 小时，疲劳未及时休息，未注意前方占道养护作业。",
    consequence: "车辆严重受损，驾驶员重伤，直接经济损失约 46 万元。",
    lesson: "连续驾驶不超过 4 小时，夜间疲劳预警必须靠边休息。",
  },
  {
    id: 2,
    title: "弯道侧翻货物散落",
    date: "2026-03-02",
    location: "S57 温州绕城高速 娄桥互通匝道",
    type: "超速 / 转向过急",
    severity: "高",
    cause: "下匝道车速达 68km/h（限速 40），重心偏高导致侧翻。",
    consequence: "整车侧翻，货物散落堵塞匝道 3 小时，无人员伤亡。",
    lesson: "匝道、弯道提前减速，重载车辆严格控制过弯车速。",
  },
  {
    id: 3,
    title: "路口右转碰撞非机动车",
    date: "2026-02-11",
    location: "温州大道—汤家桥路口",
    type: "内轮差盲区",
    severity: "高",
    cause: "右转未充分观察右后方，电动车进入内轮差盲区被碰撞。",
    consequence: "非机动车驾驶员骨折，认定本车全责。",
    lesson: "右转减速点头观察，确认右后方安全后再通过。",
  },
  {
    id: 4,
    title: "雨天追尾前车",
    date: "2026-01-23",
    location: "瓯海大道 梧田段",
    type: "跟车过近",
    severity: "中",
    cause: "雨天路滑仍保持干路跟车距离，前车急刹未能及时制动。",
    consequence: "两车轻微受损，无人员受伤，本车主责。",
    lesson: "雨雪天气跟车距离加倍，预留充足制动空间。",
  },
];
