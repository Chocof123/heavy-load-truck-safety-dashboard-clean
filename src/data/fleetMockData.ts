// ============================================================================
// 车队管理平台 — Mock data (温州货运车队, 车队长视角)
// All data is fictional and for demonstration only.
// Reuses the visual language / scoring structure of the driver profile board.
// ============================================================================

import { Severity } from "./mockData";

// ---- Section 1: 车队基本信息 -------------------------------------------------
export const fleetProfile = {
  leaderName: "王东强",
  phone: "18551444971",
  avatarUrl: `${import.meta.env.BASE_URL}fleet-manager-avatar.jpg`,
  vehicleCount: 75, // 辆
  safetyScore: 90.21,
  accidentCount: 8, // 起
  complaintCount: 5, // 起
  accidentsPer10k: 0.18, // 万公里事故数
  alertsPer10k: 2.35, // 万公里报警数
  fleetName: "温州市鑫达运输有限公司 · 一车队",
};

// ---- Section 2: 车队安全评分雷达图 -------------------------------------------
export interface FleetRadarPoint {
  dimension: string;
  fleet: number; // 本车队
  company: number; // 公司平均
}

export const fleetRadarData: FleetRadarPoint[] = [
  { dimension: "事故投诉", fleet: 86, company: 89 },
  { dimension: "驾驶行为", fleet: 88, company: 91 },
  { dimension: "出勤例保", fleet: 95, company: 90 },
  { dimension: "教育培训", fleet: 92, company: 88 },
  { dimension: "安全能力", fleet: 84, company: 87 },
];

export const fleetRadarSummary = {
  overallScore: 90.21,
  changePct: -2.3, // 负数下降
  rank: "8 / 75",
  rankChange: "提升 2 名",
  safetyRating: 5, // ★ count
};

// ---- Section 3.1: 管理摘要 — 亮点 / 基本情况 / 问题整改 -----------------------
export const fleetHighlights = {
  fullScoreItems: ["教育培训完成率 100%", "例保合规率 98%"],
  continuousImprovement: ["驾驶行为评分连续 3 周提升", "高风险驾驶员复训完成 12 人"],
  bonusItems: ["主动安全培训完成率高于公司均值", "本月无重大责任事故"],
};

export const fleetBasics = [
  { label: "日均万公里事故数", value: "0.18" },
  { label: "日均万公里报警数", value: "2.35" },
  { label: "日均驾驶时长", value: "6.4 h" },
  { label: "日最高驾驶时长", value: "9.2 h" },
  { label: "车队安全平均分", value: "90.21" },
  { label: "公司安全平均分", value: "88.76" },
  { label: "本月总里程", value: "3469 km" },
  { label: "例保完成率", value: "96%" },
];

export const fleetCorrection = {
  highRiskTime: "17:00–19:00",
  highRiskRoads: ["瓯海大道", "机场大道"],
  highRiskDrivers: ["张三", "李四", "周明"],
  pending: 6,
  completed: 18,
  completionRate: 75, // %
  overdue: 2, // 超期未整改
  newThisWeek: 4, // 本周新增问题
};

// ---- Section 3.2: 趋势统计 (指标 × 时间维度) ---------------------------------
export type FleetTrendMetric = "安全平均分" | "事故数" | "报警数";
export type FleetGranularity = "日K" | "周K" | "月K" | "季K" | "年K";

export interface FleetTrendPoint {
  date: string;
  fleet: number; // 本车队
  company: number; // 公司平均
}

const GRAN_LABELS: Record<FleetGranularity, string[]> = {
  日K: ["06/02", "06/03", "06/04", "06/05", "06/06", "06/07", "06/08", "06/09"],
  周K: ["W17", "W18", "W19", "W20", "W21", "W22", "W23", "W24"],
  月K: [
    "25/07", "25/08", "25/09", "25/10", "25/11", "25/12",
    "26/01", "26/02", "26/03", "26/04", "26/05", "26/06",
  ],
  季K: ["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26"],
  年K: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
};

// deterministic wave: base + drift*i + amp*sin — gives trend + oscillation
function series(
  labels: string[],
  fBase: number,
  cBase: number,
  amp: number,
  drift: number,
  decimals: number,
  endFleet?: number,
  endCompany?: number,
): FleetTrendPoint[] {
  const n = labels.length;
  const r = (v: number) => Number(v.toFixed(decimals));
  return labels.map((date, i) => {
    const last = i === n - 1;
    const fleet =
      last && endFleet !== undefined
        ? endFleet
        : r(fBase + drift * i + amp * Math.sin(i * 1.1) + amp * 0.3 * Math.cos(i * 0.7));
    const company =
      last && endCompany !== undefined
        ? endCompany
        : r(cBase + drift * 0.7 * i + amp * 0.6 * Math.sin(i * 0.9 + 1));
    return { date, fleet, company };
  });
}

// 安全平均分: fleet ~90, company ~88 (climbing); 事故数 / 报警数: fleet below company is better
export const fleetTrendData: Record<
  FleetTrendMetric,
  { unit: string; better: "high" | "low"; data: Record<FleetGranularity, FleetTrendPoint[]> }
> = {
  安全平均分: {
    unit: "分",
    better: "high",
    data: {
      日K: series(GRAN_LABELS.日K, 88.6, 87.4, 1.6, 0.18, 2, 90.21, 88.76),
      周K: series(GRAN_LABELS.周K, 86.8, 85.9, 1.8, 0.45, 2, 90.21, 88.76),
      月K: series(GRAN_LABELS.月K, 84.5, 83.6, 1.5, 0.5, 2, 90.21, 88.76),
      季K: series(GRAN_LABELS.季K, 80.2, 80.0, 1.7, 1.1, 2, 90.21, 88.76),
      年K: series(GRAN_LABELS.年K, 74.0, 74.6, 2.0, 2.3, 2, 90.21, 88.76),
    },
  },
  事故数: {
    unit: "起/万公里",
    better: "low",
    data: {
      日K: series(GRAN_LABELS.日K, 0.2, 0.24, 0.05, -0.002, 3, 0.18, 0.22),
      周K: series(GRAN_LABELS.周K, 0.24, 0.28, 0.05, -0.006, 3, 0.18, 0.22),
      月K: series(GRAN_LABELS.月K, 0.3, 0.34, 0.05, -0.01, 3, 0.18, 0.22),
      季K: series(GRAN_LABELS.季K, 0.42, 0.45, 0.06, -0.026, 3, 0.18, 0.22),
      年K: series(GRAN_LABELS.年K, 0.55, 0.58, 0.06, -0.05, 3, 0.18, 0.22),
    },
  },
  报警数: {
    unit: "次/万公里",
    better: "low",
    data: {
      日K: series(GRAN_LABELS.日K, 2.5, 2.7, 0.25, -0.02, 2, 2.35, 2.6),
      周K: series(GRAN_LABELS.周K, 2.8, 3.0, 0.3, -0.06, 2, 2.35, 2.6),
      月K: series(GRAN_LABELS.月K, 3.4, 3.6, 0.3, -0.09, 2, 2.35, 2.6),
      季K: series(GRAN_LABELS.季K, 4.2, 4.4, 0.4, -0.2, 2, 2.35, 2.6),
      年K: series(GRAN_LABELS.年K, 5.4, 5.6, 0.4, -0.42, 2, 2.35, 2.6),
    },
  },
};

// ---- Section 4: 打分规则结构图 (复用 ScoreRuleGraphCard) ----------------------
import { ScoreRule } from "./mockData";

export const fleetScoreRules: ScoreRule[] = [
  { module: "教育培训", weight: 10, score: 92, status: "excellent" },
  { module: "驾驶行为", weight: 30, score: 88, status: "excellent" },
  { module: "事故投诉", weight: 30, score: 86, status: "risk" },
  { module: "出勤例保", weight: 20, score: 95, status: "excellent" },
  { module: "安全能力", weight: 10, score: 84, status: "risk" }, // 正向加分 10%
];

export const fleetScoreSources = [
  "培训记录",
  "DSM / ADAS",
  "出险及投诉记录",
  "叮咚查及维保记录",
  "安全运营统计分析记录",
];

export const fleetScoreOverall = 90.21;

// ---- Section 5: 报警流水台账 (三个 tab, 滚动表格 + 点击详情) ------------------

// Tab 1 — 风险驾驶员排行
export interface RiskDriverRow {
  name: string;
  score: number;
  accidents: number;
  complaints: number;
  alerts: number;
  per10k: number; // 万公里报警数
  detail: {
    info: string;
    risks: string[];
    alertTrend: string;
    scoreChange: string;
    suggestions: string[];
    owner: string;
    deadline: string;
    status: "未开始" | "整改中" | "已完成";
  };
}

export const riskDrivers: RiskDriverRow[] = [
  {
    name: "张三", score: 78.5, accidents: 1, complaints: 2, alerts: 35, per10k: 8.2,
    detail: {
      info: "张三 · 男 · 驾龄 6 年 · A2 · 温州—瑞安干线",
      risks: ["分心驾驶占比偏高", "晚高峰急刹频发", "跟车距离不足"],
      alertTrend: "近 4 周报警 38 → 35 → 41 → 35，整体高位波动",
      scoreChange: "安全评分较上月下降 3.2 分，连续两月低于 80",
      suggestions: ["参加防御性驾驶专项复训", "限制晚高峰高风险路段排班", "加装疲劳提醒并人工抽检"],
      owner: "车队长 王东强",
      deadline: "2026-06-20",
      status: "整改中",
    },
  },
  {
    name: "李四", score: 80.2, accidents: 0, complaints: 1, alerts: 29, per10k: 7.8,
    detail: {
      info: "李四 · 男 · 驾龄 9 年 · A2 · 温州—乐清干线",
      risks: ["超速报警偏多", "夜间车道偏离"],
      alertTrend: "近 4 周报警 33 → 30 → 28 → 29，缓慢下降",
      scoreChange: "安全评分较上月持平，处于风险区边缘",
      suggestions: ["重点路段限速语音提醒", "夜间行车安全教育", "每周一对一安全谈话"],
      owner: "安全员 陈磊",
      deadline: "2026-06-18",
      status: "整改中",
    },
  },
  {
    name: "王五", score: 82.1, accidents: 1, complaints: 0, alerts: 26, per10k: 7.35,
    detail: {
      info: "王五 · 男 · 驾龄 12 年 · A2 · 温州—平阳干线",
      risks: ["急加速急刹", "路口未减速"],
      alertTrend: "近 4 周报警 30 → 28 → 27 → 26，稳步下降",
      scoreChange: "安全评分较上月提升 1.5 分，趋势向好",
      suggestions: ["保持平稳驾驶习惯", "路口提前预减速训练"],
      owner: "安全员 陈磊",
      deadline: "2026-06-25",
      status: "整改中",
    },
  },
  {
    name: "周明", score: 83.6, accidents: 0, complaints: 1, alerts: 24, per10k: 6.9,
    detail: {
      info: "周明 · 男 · 驾龄 7 年 · A2 · 温州—瓯江口线",
      risks: ["跟车过近", "分心驾驶"],
      alertTrend: "近 4 周报警 27 → 25 → 26 → 24，小幅下降",
      scoreChange: "安全评分较上月提升 0.8 分",
      suggestions: ["FCW 预警复盘教育", "保持安全车距"],
      owner: "安全员 陈磊", deadline: "2026-06-28", status: "未开始",
    },
  },
  {
    name: "赵强", score: 85.0, accidents: 0, complaints: 0, alerts: 21, per10k: 6.2,
    detail: {
      info: "赵强 · 男 · 驾龄 10 年 · A2 · 温州—瑞安干线",
      risks: ["偶发超速"],
      alertTrend: "近 4 周报警 24 → 22 → 21 → 21，平稳",
      scoreChange: "安全评分较上月提升 1.1 分",
      suggestions: ["保持现状，关注高速路段限速"],
      owner: "安全员 陈磊", deadline: "2026-07-02", status: "整改中",
    },
  },
  {
    name: "孙伟", score: 86.4, accidents: 0, complaints: 0, alerts: 18, per10k: 5.6,
    detail: {
      info: "孙伟 · 男 · 驾龄 8 年 · A2 · 温州—乐清干线",
      risks: ["偶发车道偏离"],
      alertTrend: "近 4 周报警 20 → 19 → 18 → 18，稳定",
      scoreChange: "安全评分较上月持平",
      suggestions: ["保持车道居中驾驶"],
      owner: "安全员 陈磊", deadline: "2026-07-05", status: "已完成",
    },
  },
  {
    name: "钱进", score: 87.9, accidents: 0, complaints: 0, alerts: 15, per10k: 4.9,
    detail: {
      info: "钱进 · 男 · 驾龄 14 年 · A2 · 温州—平阳干线",
      risks: ["几乎无显著风险行为"],
      alertTrend: "近 4 周报警 16 → 15 → 14 → 15，低位稳定",
      scoreChange: "安全评分较上月提升 0.5 分",
      suggestions: ["树立为车队安全标兵"],
      owner: "车队长 王东强", deadline: "—", status: "已完成",
    },
  },
  {
    name: "郑勇", score: 81.9, accidents: 1, complaints: 1, alerts: 28, per10k: 7.1,
    detail: {
      info: "郑勇 · 男 · 驾龄 5 年 · A2 · 温州—瓯江口线",
      risks: ["急加速频发", "跟车过近", "路口抢行"],
      alertTrend: "近 4 周报警 31 → 29 → 30 → 28，高位缓降",
      scoreChange: "安全评分较上月下降 1.4 分，处于风险区",
      suggestions: ["平稳起步与跟车训练", "早高峰路口防御驾驶教育", "每周安全谈话"],
      owner: "安全员 陈磊", deadline: "2026-06-22", status: "整改中",
    },
  },
  {
    name: "刘海", score: 82.7, accidents: 0, complaints: 1, alerts: 25, per10k: 6.8,
    detail: {
      info: "刘海 · 男 · 驾龄 8 年 · A2 · 温州—乐清干线",
      risks: ["分心驾驶", "夜间车道偏离"],
      alertTrend: "近 4 周报警 27 → 26 → 26 → 25，平稳",
      scoreChange: "安全评分较上月持平",
      suggestions: ["驾驶室手机入袋管理", "夜间降速保持车道居中"],
      owner: "安全员 陈磊", deadline: "2026-06-26", status: "未开始",
    },
  },
  {
    name: "吴涛", score: 84.8, accidents: 0, complaints: 0, alerts: 22, per10k: 6.5,
    detail: {
      info: "吴涛 · 男 · 驾龄 11 年 · A2 · 温州—瑞安干线",
      risks: ["偶发急刹", "午后疲劳报警"],
      alertTrend: "近 4 周报警 24 → 23 → 23 → 22，稳步下降",
      scoreChange: "安全评分较上月提升 0.9 分",
      suggestions: ["午后强制休息", "保持跟车距离"],
      owner: "安全员 陈磊", deadline: "2026-06-30", status: "整改中",
    },
  },
  {
    name: "冯磊", score: 88.2, accidents: 0, complaints: 0, alerts: 14, per10k: 4.7,
    detail: {
      info: "冯磊 · 男 · 驾龄 13 年 · A2 · 温州—平阳干线",
      risks: ["几乎无显著风险行为"],
      alertTrend: "近 4 周报警 15 → 14 → 14 → 14，低位稳定",
      scoreChange: "安全评分较上月提升 0.6 分",
      suggestions: ["保持良好驾驶习惯"],
      owner: "车队长 王东强", deadline: "—", status: "已完成",
    },
  },
  {
    name: "陈亮", score: 89.1, accidents: 0, complaints: 0, alerts: 12, per10k: 4.2,
    detail: {
      info: "陈亮 · 男 · 驾龄 15 年 · A2 · 温州—乐清干线",
      risks: ["无显著风险行为"],
      alertTrend: "近 4 周报警 13 → 12 → 12 → 12，最低位稳定",
      scoreChange: "安全评分较上月提升 0.4 分，车队标兵",
      suggestions: ["作为安全标兵参与新手带训"],
      owner: "车队长 王东强", deadline: "—", status: "已完成",
    },
  },
];

// Tab 2 — 报警防控
export interface AlertControlRow {
  type: string;
  per10k: number;
  avgHandle: string; // 平均处置时长
  causedAccident: "是" | "否";
  consequence: string;
  detail: {
    analysis: string;
    peakTime: string;
    peakRoad: string;
    drivers: string;
    cause: string;
    measures: string[];
    followStatus: string;
  };
}

export const alertControls: AlertControlRow[] = [
  {
    type: "超速报警", per10k: 2.3, avgHandle: "15.2 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "超速报警为车队报警量最大的类型，集中在高速及城市快速路段。",
      peakTime: "10:00–12:00 / 14:00–16:00", peakRoad: "甬台温高速、瓯海大道",
      drivers: "李四、赵强等 6 人", cause: "赶班次抢时间、对限速路段不熟悉",
      measures: ["重点路段限速语音播报", "GPS 超速实时提醒", "超速台账每周通报"],
      followStatus: "整改中 · 完成 60%",
    },
  },
  {
    type: "疲劳驾驶", per10k: 1.85, avgHandle: "28.6 秒", causedAccident: "是", consequence: "轻微刮擦",
    detail: {
      analysis: "疲劳驾驶报警量居前，且已造成一起轻微刮擦事故，风险等级最高。",
      peakTime: "凌晨 02:00–05:00、午后 14:00", peakRoad: "金丽温高速、温州绕城高速",
      drivers: "张三、周明等 4 人", cause: "连续驾驶超时、夜间排班不合理",
      measures: ["连续驾驶不超 4 小时强制休息", "DSM 二级疲劳预警靠边休息", "优化夜间排班"],
      followStatus: "整改中 · 完成 45%",
    },
  },
  {
    type: "急加速", per10k: 1.62, avgHandle: "12.4 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "急加速多见于起步与超车阶段，增加油耗并存在追尾风险。",
      peakTime: "07:00–09:00 早高峰", peakRoad: "温州大道、车站大道",
      drivers: "郑勇、王五等 5 人", cause: "起步抢行、油门控制不稳",
      measures: ["平稳起步训练", "油门开度监测提醒", "经济驾驶培训"],
      followStatus: "整改中 · 完成 50%",
    },
  },
  {
    type: "急刹车", per10k: 1.58, avgHandle: "10.8 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "急刹车多发生于城市路口及车流密集路段，反映跟车与预判问题。",
      peakTime: "17:00–19:00", peakRoad: "人民路、车站大道、机场大道",
      drivers: "张三、王五等 5 人", cause: "跟车距离不足、路口未提前减速",
      measures: ["加大跟车距离至 2 秒以上", "路口提前预减速训练", "FCW 预警复盘"],
      followStatus: "整改中 · 完成 70%",
    },
  },
  {
    type: "车道偏离", per10k: 1.42, avgHandle: "18.5 秒", causedAccident: "是", consequence: "右侧擦碰",
    detail: {
      analysis: "车道偏离多发生于夜间照明不足路段，已造成一起右侧擦碰。",
      peakTime: "21:00 后夜间", peakRoad: "瓯海大道辅路、龙湾大道",
      drivers: "李四、刘海等 3 人", cause: "夜间视线差、短暂注意力下降",
      measures: ["夜间降低车速保持车道居中", "LDW 预警教育", "夜间疲劳检测加强"],
      followStatus: "整改中 · 完成 40%",
    },
  },
  {
    type: "未保持车距", per10k: 1.31, avgHandle: "16.9 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "未保持车距触发前向预警，是追尾类事故的主要前兆。",
      peakTime: "07:00–09:00 早高峰", peakRoad: "温州大道、瓯海大道",
      drivers: "周明、王五等 4 人", cause: "早高峰车流密集、抢行心理",
      measures: ["保持安全车头时距", "ADAS 前向预警灵敏度上调", "防御性驾驶教育"],
      followStatus: "整改中 · 完成 55%",
    },
  },
  {
    type: "分心驾驶", per10k: 1.25, avgHandle: "22.3 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "分心驾驶以看手机、长时间偏头交谈为主，DSM 抓拍量逐月上升需重点关注。",
      peakTime: "12:00–13:00 午间、20:00 后", peakRoad: "城市主干道",
      drivers: "张三、刘海等 3 人", cause: "驾驶途中使用手机、注意力管理不足",
      measures: ["驾驶室手机入袋管理", "DSM 分心抓拍即时语音警告", "专项警示教育"],
      followStatus: "整改中 · 完成 55%",
    },
  },
  {
    type: "夜间异常行驶", per10k: 1.1, avgHandle: "24.8 秒", causedAccident: "是", consequence: "追尾风险",
    detail: {
      analysis: "夜间异常行驶（蛇形/忽快忽慢）多与疲劳、注意力下降相关，存在追尾风险。",
      peakTime: "22:00–次日 04:00", peakRoad: "金丽温高速、龙湾大道",
      drivers: "张三、郑勇等 3 人", cause: "夜班疲劳、睡眠不足",
      measures: ["夜班作息管理", "异常行驶实时干预", "服务区强制休息"],
      followStatus: "整改中 · 完成 35%",
    },
  },
  {
    type: "长时间怠速", per10k: 0.95, avgHandle: "30.2 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "长时间怠速增加油耗与排放，多见于装卸货与等候时段。",
      peakTime: "装卸货时段", peakRoad: "场站、物流园区",
      drivers: "多名驾驶员", cause: "等候时未熄火、习惯性怠速",
      measures: ["怠速超时提醒", "停车熄火规范", "纳入经济驾驶考核"],
      followStatus: "整改中 · 完成 60%",
    },
  },
  {
    type: "违规停车", per10k: 0.88, avgHandle: "19.5 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "违规停车多发生于装卸货临时停靠，存在占道与安全隐患。",
      peakTime: "白天装卸货", peakRoad: "城区主干道、商圈周边",
      drivers: "个别驾驶员", cause: "临时停靠选址不当",
      measures: ["规范停靠点", "开双闪与警示", "GPS 违停提醒"],
      followStatus: "已完成",
    },
  },
  {
    type: "未系安全带", per10k: 0.75, avgHandle: "8.6 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "未系安全带主要出现在起步及短途阶段，属低成本可整改项。",
      peakTime: "起步阶段", peakRoad: "场站、城区短途",
      drivers: "个别驾驶员", cause: "短途侥幸心理、安全意识不足",
      measures: ["发车前安全带检查", "DSM 未系安全带即时提醒", "纳入考核"],
      followStatus: "已完成",
    },
  },
  {
    type: "路线偏离", per10k: 0.68, avgHandle: "21.1 秒", causedAccident: "否", consequence: "无",
    detail: {
      analysis: "路线偏离指偏离规定运营线路，需排查绕行与私用风险。",
      peakTime: "全天不定", peakRoad: "非规定运营路段",
      drivers: "个别驾驶员", cause: "绕行、对线路不熟悉",
      measures: ["电子围栏路线监控", "偏离即时提醒", "线路熟悉培训"],
      followStatus: "已完成",
    },
  },
];

// Tab 3 — 线路风险
export interface RouteRiskRow {
  location: string;
  alerts: number;
  causedAccident: "是" | "否";
  accidentCount: number;
  consequence: string;
  detail: {
    analysis: string;
    alertTypeDist: string;
    accidentRelation: string;
    peakTime: string;
    peakDriver: string;
    measures: string[];
  };
}

export const routeRisks: RouteRiskRow[] = [
  {
    location: "温州大道", alerts: 38, causedAccident: "是", accidentCount: 2, consequence: "2 起擦碰",
    detail: {
      analysis: "温州大道路口密集、车流量大，为车队报警与事故双高路段，是重点防控对象。",
      alertTypeDist: "跟车过近 36% · 急刹 28% · 急加速 20% · 其他 16%",
      accidentRelation: "今年发生 2 起擦碰事故",
      peakTime: "07:00–09:00 早高峰", peakDriver: "张三、王五",
      measures: ["重点路段限速提醒", "路口提前减速", "加强驾驶员防御性驾驶培训", "增加该路段语音提醒"],
    },
  },
  {
    location: "瓯海大道辅路", alerts: 34, causedAccident: "是", accidentCount: 1, consequence: "1 起追尾",
    detail: {
      analysis: "瓯海大道辅路夜间照明不足、辅路混行，急刹与车道偏离报警集中。",
      alertTypeDist: "急刹 34% · 车道偏离 26% · 跟车 22% · 其他 18%",
      accidentRelation: "今年发生 1 起追尾事故",
      peakTime: "17:00–19:00 晚高峰", peakDriver: "张三、刘海",
      measures: ["晚高峰路线调整分流", "夜间降速保持车道", "加强 LDW 报警联动"],
    },
  },
  {
    location: "机场大道", alerts: 31, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "机场大道车速较高，超速与车道偏离报警集中，暂未发生事故但风险高。",
      alertTypeDist: "超速 46% · 车道偏离 24% · 急刹 18% · 其他 12%",
      accidentRelation: "今年无事故，存在超速诱发风险",
      peakTime: "14:00–16:00", peakDriver: "李四、赵强",
      measures: ["增加重点路段语音提醒", "限速台账通报", "检查车辆限速设备"],
    },
  },
  {
    location: "龙湾路口", alerts: 29, causedAccident: "是", accidentCount: 1, consequence: "1 起刮擦",
    detail: {
      analysis: "龙湾路口交通流复杂、右转盲区大，刮擦与急刹风险突出。",
      alertTypeDist: "急刹 32% · 跟车 26% · 分心 22% · 其他 20%",
      accidentRelation: "今年发生 1 起刮擦事故",
      peakTime: "08:00–10:00", peakDriver: "郑勇",
      measures: ["右转减速点头观察", "加装盲区监测", "路口防御驾驶培训"],
    },
  },
  {
    location: "人民东路", alerts: 26, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "人民东路商圈路段人车混行，分心与跟车报警偏多。",
      alertTypeDist: "分心 34% · 跟车 30% · 急刹 22% · 其他 14%",
      accidentRelation: "今年无事故",
      peakTime: "12:00 / 18:00", peakDriver: "刘海",
      measures: ["商圈路段限速慢行", "加强观察行人", "分心抓拍提醒"],
    },
  },
  {
    location: "南浦路", alerts: 24, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "南浦路连接物流园区，急加速与急刹报警为主。",
      alertTypeDist: "急加速 30% · 急刹 28% · 跟车 24% · 其他 18%",
      accidentRelation: "今年无事故",
      peakTime: "06:00–08:00", peakDriver: "吴涛",
      measures: ["平稳起步训练", "保持安全车距", "经济驾驶培训"],
    },
  },
  {
    location: "车站大道", alerts: 22, causedAccident: "是", accidentCount: 1, consequence: "1 起客伤",
    detail: {
      analysis: "车站大道靠近火车站，人车混行复杂，曾发生 1 起客伤事故。",
      alertTypeDist: "分心 34% · 跟车 30% · 急刹 22% · 其他 14%",
      accidentRelation: "今年发生 1 起客伤事故",
      peakTime: "08:00–10:00 / 18:00", peakDriver: "张三",
      measures: ["进站口限速慢行", "加强观察非机动车", "路线调整避峰"],
    },
  },
  {
    location: "府东路", alerts: 20, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "府东路路口较多，跟车与急刹报警为主，整体可控。",
      alertTypeDist: "跟车 32% · 急刹 28% · 分心 22% · 其他 18%",
      accidentRelation: "今年无事故",
      peakTime: "08:00 / 17:30", peakDriver: "周明",
      measures: ["保持安全车距", "路口提前减速", "防御驾驶教育"],
    },
  },
  {
    location: "瓯江路", alerts: 19, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "瓯江路滨江段视野开阔，偶发超速与分心报警。",
      alertTypeDist: "超速 34% · 分心 26% · 跟车 22% · 其他 18%",
      accidentRelation: "今年无事故",
      peakTime: "14:00–16:00", peakDriver: "李四",
      measures: ["滨江段限速提醒", "分心抓拍提醒", "保持车道居中"],
    },
  },
  {
    location: "学院路", alerts: 17, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "学院路学校周边，需重点防范行人与非机动车。",
      alertTypeDist: "急刹 32% · 分心 28% · 跟车 22% · 其他 18%",
      accidentRelation: "今年无事故",
      peakTime: "07:30 / 16:30", peakDriver: "刘海",
      measures: ["学校路段慢行", "加强观察行人", "礼让斑马线"],
    },
  },
  {
    location: "江滨西路", alerts: 16, causedAccident: "是", accidentCount: 1, consequence: "1 起碰撞",
    detail: {
      analysis: "江滨西路弯道较多，夜间车道偏离与碰撞风险较高。",
      alertTypeDist: "车道偏离 34% · 急刹 26% · 超速 22% · 其他 18%",
      accidentRelation: "今年发生 1 起碰撞事故",
      peakTime: "21:00 后夜间", peakDriver: "郑勇",
      measures: ["弯道提前减速", "夜间保持车道居中", "检查车辆灯光"],
    },
  },
  {
    location: "汤家桥路", alerts: 14, causedAccident: "否", accidentCount: 0, consequence: "无",
    detail: {
      analysis: "汤家桥路口右转盲区大，需防范内轮差风险。",
      alertTypeDist: "急刹 30% · 跟车 26% · 分心 24% · 其他 20%",
      accidentRelation: "今年无事故",
      peakTime: "09:00 / 17:00", peakDriver: "吴涛",
      measures: ["右转点头观察", "加装盲区监测", "路口防御驾驶培训"],
    },
  },
];

// ---- Section 6: 事故深度复盘 / 公司典型事故警示 ------------------------------

// shared accident review detail (复盘弹窗字段)
export interface AccidentReview {
  id: number;
  lon: number;
  lat: number;
  severity: Severity; // 用于颜色: 严重程度
  severityLabel: "轻微" | "一般" | "较严重" | "严重";
  title: string;
  time: string;
  location: string;
  description: string;
  parkingDuration: string;
  hazardLight: string;
  accStatus: string;
  dataReplay: string;
  coreCause: string;
  loss: string;
  painPoints: string;
  techGap: string; // 科技手段应用不足
  familyEnterpriseGap: string; // 家企联动缺失
  measures: string[];
}

// Tab 1 — 本车队本年度事故 (地图点位)
export const fleetAccidents: AccidentReview[] = [
  {
    id: 1, lon: 120.6533, lat: 28.0121, severity: "高", severityLabel: "严重",
    title: "人民路—大南门路口 三车追尾",
    time: "2026-06-05 17:23", location: "鹿城区 人民路—大南门路口",
    description: "晚高峰前车急减速，本车跟车距离不足追尾，连环碰撞第三车，三车 3 人轻伤。",
    parkingDuration: "8 分钟", hazardLight: "开，持续 15 秒", accStatus: "关",
    dataReplay: "事发前 10 秒车速 42km/h，制动介入偏晚，最小车头时距 0.7s。",
    coreCause: "跟车距离不足 + 注意力分散 + 雨天未降速",
    loss: "约 ¥18,000，车辆前部受损",
    painPoints: "晚高峰路口预判不足，雨天防御性驾驶执行不到位。",
    techGap: "FCW 预警灵敏度偏低，未联动主动制动。",
    familyEnterpriseGap: "驾驶员家属未参与安全提醒，疲劳/情绪状态缺乏家庭侧反馈。",
    measures: ["湿滑路面跟车距离≥2 秒", "FCW 预警即抬油门预备制动", "完成雨天防御性驾驶复训"],
  },
  {
    id: 2, lon: 120.7428, lat: 27.9345, severity: "橙" as Severity, severityLabel: "较严重",
    title: "瓯海大道辅路 夜间追尾",
    time: "2026-04-12 21:06", location: "瓯海区 瓯海大道辅路梧田段",
    description: "夜间照明不足，本车车道偏离后修正不及，与右侧停靠车辆刮擦追尾。",
    parkingDuration: "12 分钟", hazardLight: "开，持续 20 秒", accStatus: "关",
    dataReplay: "事发车速 56km/h，方向修正幅度过大，疑似注意力短暂下降。",
    coreCause: "夜间注意力下降 + 车道偏离",
    loss: "约 ¥9,500，右侧车身刮擦",
    painPoints: "夜间行车风险意识不足，车道保持能力弱。",
    techGap: "LDW 车道偏离预警未联动方向辅助。",
    familyEnterpriseGap: "夜班作息缺乏家庭配合，睡眠管理不足。",
    measures: ["夜间降速并保持车道居中", "夜班前充分休息", "检查车辆灯光照明"],
  },
  {
    id: 3, lon: 120.6746, lat: 27.9812, severity: "中" as Severity, severityLabel: "一般",
    title: "锦绣路—南浦路 紧急制动",
    time: "2026-03-20 13:12", location: "鹿城区 锦绣路—南浦路",
    description: "电动车突然横穿，本车紧急制动，车内随车人员踉跄无伤，未碰撞。",
    parkingDuration: "2 分钟", hazardLight: "开，持续 8 秒", accStatus: "开",
    dataReplay: "事发车速 48km/h，制动及时但初速偏高。",
    coreCause: "路口未提前减速",
    loss: "无直接损失",
    painPoints: "路口预判与减速习惯有待加强。",
    techGap: "路口预警提示不足。",
    familyEnterpriseGap: "—",
    measures: ["进入路口前主动预减速", "加强非机动车观察"],
  },
  {
    id: 4, lon: 120.7102, lat: 27.9588, severity: "低" as Severity, severityLabel: "轻微",
    title: "汤家桥路 右转刮擦",
    time: "2026-02-11 09:36", location: "鹿城区 温州大道—汤家桥路口",
    description: "右转未充分观察右后方，与进入内轮差盲区的电动车发生轻微刮擦。",
    parkingDuration: "5 分钟", hazardLight: "开，持续 10 秒", accStatus: "开",
    dataReplay: "右转车速 18km/h，未完成点头观察动作。",
    coreCause: "内轮差盲区 + 右转观察不足",
    loss: "约 ¥2,000，非机动车轻微受损",
    painPoints: "右转盲区管理意识薄弱。",
    techGap: "盲区监测 BSD 未全覆盖。",
    familyEnterpriseGap: "—",
    measures: ["右转减速点头观察", "加装右侧盲区监测", "盲区警示教育"],
  },
];

// Tab 2 — 公司典型事故警示 (地图点位)
export const companyTypicalAccidents: AccidentReview[] = [
  {
    id: 101, lon: 120.6321, lat: 28.0205, severity: "高", severityLabel: "严重",
    title: "高速追尾养护作业车",
    time: "2026-04-18 04:50", location: "甬台温高速 温州北段 K1832",
    description: "凌晨连续驾驶 5 小时，疲劳未休息，未注意前方占道养护作业车追尾。",
    parkingDuration: "—", hazardLight: "未开", accStatus: "开",
    dataReplay: "事发车速 88km/h，制动几乎无介入，DSM 已多次疲劳预警未响应。",
    coreCause: "疲劳驾驶 + 忽视养护作业警示",
    loss: "约 ¥460,000，车辆严重受损，驾驶员重伤",
    painPoints: "连续驾驶超时管理失效，疲劳预警形同虚设。",
    techGap: "疲劳二级预警未强制干预、未联动限速。",
    familyEnterpriseGap: "夜班疲劳缺乏家庭侧作息提醒与监督。",
    measures: ["连续驾驶不超 4 小时强制休息", "疲劳二级预警必须靠边", "夜间作业路段提前限速预警"],
  },
  {
    id: 102, lon: 120.7251, lat: 27.9201, severity: "高", severityLabel: "严重",
    title: "弯道侧翻货物散落",
    time: "2026-03-02 11:20", location: "S57 温州绕城高速 娄桥互通匝道",
    description: "下匝道车速 68km/h（限速 40），重心偏高导致整车侧翻，货物散落堵路 3 小时。",
    parkingDuration: "—", hazardLight: "开", accStatus: "关",
    dataReplay: "入匝道车速持续偏高，横向加速度超阈值触发侧翻。",
    coreCause: "匝道超速 + 重载重心控制不足",
    loss: "约 ¥120,000，整车侧翻货损",
    painPoints: "匝道弯道限速执行不到位，重载过弯意识不足。",
    techGap: "无弯道车速预警与电子稳定干预。",
    familyEnterpriseGap: "—",
    measures: ["匝道弯道提前减速", "重载车辆严控过弯车速", "加装弯道限速语音预警"],
  },
  {
    id: 103, lon: 120.7102, lat: 27.9588, severity: "橙" as Severity, severityLabel: "较严重",
    title: "路口右转碰撞非机动车",
    time: "2026-02-11 08:14", location: "温州大道—汤家桥路口",
    description: "右转未充分观察右后方，电动车进入内轮差盲区被碰撞，骑行人骨折。",
    parkingDuration: "6 分钟", hazardLight: "开", accStatus: "关",
    dataReplay: "右转车速 22km/h，未点头观察，盲区监测未报警。",
    coreCause: "内轮差盲区 + 观察缺失",
    loss: "约 ¥80,000，非机动车驾驶员骨折，本车全责",
    painPoints: "右转盲区与弱势交通参与者保护不足。",
    techGap: "BSD 盲区监测覆盖不全。",
    familyEnterpriseGap: "—",
    measures: ["右转减速点头观察", "确认右后方安全再通过", "全车加装盲区监测"],
  },
  {
    id: 104, lon: 120.6688, lat: 27.9501, severity: "中" as Severity, severityLabel: "一般",
    title: "雨天追尾前车",
    time: "2026-01-23 15:40", location: "瓯海大道 梧田段",
    description: "雨天路滑仍保持干路跟车距离，前车急刹未能及时制动，两车轻微受损。",
    parkingDuration: "10 分钟", hazardLight: "开", accStatus: "关",
    dataReplay: "雨天车速 50km/h，跟车距离不足，制动距离延长。",
    coreCause: "雨天跟车距离不足",
    loss: "约 ¥6,000，两车轻微受损，本车主责",
    painPoints: "恶劣天气跟车距离调整意识薄弱。",
    techGap: "无雨量联动的跟车距离动态提醒。",
    familyEnterpriseGap: "—",
    measures: ["雨雪天气跟车距离加倍", "预留充足制动空间", "恶劣天气专项教育"],
  },
];

// 本年度事故统计卡片
export const fleetAccidentStats = [
  { label: "本年度事故总数", value: "8", unit: "起", tone: "blue" },
  { label: "有责事故数", value: "5", unit: "起", tone: "red" },
  { label: "客伤事故数", value: "2", unit: "起", tone: "yellow" },
  { label: "追尾事故数", value: "3", unit: "起", tone: "yellow" },
  { label: "刮擦事故数", value: "2", unit: "起", tone: "blue" },
  { label: "路口事故数", value: "4", unit: "起", tone: "yellow" },
  { label: "夜间事故数", value: "2", unit: "起", tone: "yellow" },
  { label: "平均处理时长", value: "42", unit: "分钟", tone: "blue" },
  { label: "事故损失金额", value: "¥86,000", unit: "", tone: "red" },
  { label: "整改完成率", value: "75", unit: "%", tone: "green" },
] as const;

// 三个圆形图: 成因 / 类型 / 应急规范
export interface DonutDatum {
  name: string;
  value: number;
}

export const accidentByCause: DonutDatum[] = [
  { name: "人的不安全行为", value: 46 },
  { name: "环境因素", value: 21 },
  { name: "车的不安全状态", value: 18 },
  { name: "管理因素", value: 15 },
];

export const accidentByType: DonutDatum[] = [
  { name: "追尾事故", value: 37.5 },
  { name: "客伤事故", value: 25 },
  { name: "刮擦事故", value: 25 },
  { name: "路口交通事故", value: 12.5 },
];

// 应急规范执行率 (圆环形式)
export const emergencyNorms = [
  { name: "及时上报", value: 81 },
  { name: "提前减速", value: 68 },
  { name: "ACC 关闭", value: 52.91 },
  { name: "开双闪", value: 32.45 },
];

// ---- 公司典型事故 — 统计 / 圆形图 (Tab 2 复用同一三层结构) ---------------------
export const companyAccidentStats = [
  { label: "公司事故总数", value: "63", unit: "起", tone: "blue" },
  { label: "有责事故数", value: "41", unit: "起", tone: "red" },
  { label: "重大事故数", value: "4", unit: "起", tone: "red" },
  { label: "追尾事故数", value: "22", unit: "起", tone: "yellow" },
  { label: "侧翻事故数", value: "3", unit: "起", tone: "yellow" },
  { label: "路口事故数", value: "18", unit: "起", tone: "yellow" },
  { label: "夜间事故数", value: "15", unit: "起", tone: "yellow" },
  { label: "平均处理时长", value: "56", unit: "分钟", tone: "blue" },
  { label: "事故损失金额", value: "¥1.86M", unit: "", tone: "red" },
  { label: "警示教育覆盖", value: "100", unit: "%", tone: "green" },
] as const;

export const companyAccidentByCause: DonutDatum[] = [
  { name: "人的不安全行为", value: 52 },
  { name: "环境因素", value: 19 },
  { name: "车的不安全状态", value: 16 },
  { name: "管理因素", value: 13 },
];

export const companyAccidentByType: DonutDatum[] = [
  { name: "追尾事故", value: 35 },
  { name: "路口交通事故", value: 28 },
  { name: "侧翻事故", value: 12 },
  { name: "其他", value: 25 },
];

export const companyEmergencyNorms = [
  { name: "及时上报", value: 88 },
  { name: "提前减速", value: 61 },
  { name: "ACC 关闭", value: 47.5 },
  { name: "开双闪", value: 29.8 },
];
