# 重点车辆智管云平台 Demo

展示重点车辆 / 重载货车安全管理驾驶舱的前端实现方式。项目保留了可运行代码、演示数据、地图数据和数据转换脚本，剔除了设计草稿、提示词、个人临时文件、本地依赖缓存等补充材料。

## 功能概览

- 登录页：驾驶员和车队长两个演示账号入口。
- 驾驶员画像：基础信息、雷达评分、趋势图、风险整改、报警台账、地图回放等模块。
- 车队长看板：车队基础信息、车队评分、事故复盘、趋势分析、滚动台账等模块。
- 本地温州道路地图：使用已转换的温州道路 JSON 数据，不依赖在线地图服务。
- 主题切换：支持深色科技风和浅色业务风。

## 演示账号

| 角色   | 账号       | 密码  |
| ------ | ---------- | ----- |
| 驾驶员 | `cheshou`  | `123` |
| 车队长 | `duizhang` | `123` |

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## 本地运行

需要 Node.js 18 或以上版本，推荐 Node.js 20。

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址，通常是：

```text
http://127.0.0.1:5173
```

## 构建

```bash
npm run build
```

构建产物会生成在 `dist/` 目录。

如需本地预览构建结果：

```bash
npm run preview
```

## GitHub Pages 部署

本仓库已包含 GitHub Actions workflow：`.github/workflows/deploy.yml`。

部署步骤：

1. 在 GitHub 创建一个新仓库。
2. 将本目录内容提交到仓库的 `main` 分支。
3. 在仓库设置中打开 `Settings -> Pages`。
4. `Build and deployment` 选择 `GitHub Actions`。
5. 推送到 `main` 后，workflow 会自动执行 `npm ci`、`npm run build` 并发布 `dist/`。

项目的 Vite `base` 已设置为相对路径，适配 GitHub Pages 的项目页路径，例如：

```text
https://<your-name>.github.io/<repo-name>/
```

## 数据说明

项目包含两类数据：

- `public/map-data/wenzhou-roads.json`：前端运行时直接加载的温州道路、河流、铁路和地名数据。
- `data/wenzhou-shape/`：原始温州 shapefile 数据，用于复现道路 JSON 的生成过程。

地图 JSON 可通过脚本重新生成：

```bash
python tools/convert_wenzhou_shp.py
```

脚本默认读取：

```text
data/wenzhou-shape/
```

并写入：

```text
public/map-data/wenzhou-roads.json
```

业务看板中的驾驶员、车队、报警、事故、评分等数据位于：

```text
src/data/mockData.ts
src/data/fleetMockData.ts
```

这些业务数据均为演示 mock 数据，仅用于产品原型、前端开发和学习交流，不代表真实人员或真实经营数据。

## 目录结构

```text
.
├── public/
│   ├── map-data/wenzhou-roads.json
│   ├── logo.png
│   ├── login-background.png
│   └── *.jpg / *.png
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── theme/
│   ├── App.tsx
│   └── main.tsx
├── data/wenzhou-shape/
├── tools/convert_wenzhou_shp.py
├── .github/workflows/deploy.yml
├── package.json
└── vite.config.ts
```
