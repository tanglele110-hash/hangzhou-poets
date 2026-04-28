# 杭州唐宋诗词名家图鉴 · Hangzhou Tang–Song Poets

> 钱塘自古繁华，文人墨客荟萃。
>
> *Eighty-plus poets of the Tang and Song dynasties associated with Hangzhou —
> their lives, schools, careers, signature works, and the relationships between them,
> all rendered as one interactive timeline.*

🌐 **在线访问 · Live Demo**：稳定公开域名配置中 *(Public stable URL is being configured.)*

> 💾 **目前预览方式 · How to preview now**：从 [Releases](https://github.com/tanglele110-hash/hangzhou-poets/releases) 下载 `hangzhou-poets-vX.Y.Z-dist.zip`，解压后用任意静态服务器（推荐 `npx serve dist/`）即可在本地预览，无需后端。
>
> *Download the latest dist bundle from [Releases](https://github.com/tanglele110-hash/hangzhou-poets/releases) and serve it with any static HTTP server (e.g. `npx serve dist/`). No backend required.*

<table>
<tr>
<td width="40%" align="center">
  <img src="docs/screenshots/mobile-overview.png" alt="移动端「全貌」视图：诗人按时代纵向铺开，颜色三档区分核心 / 重要 / 知名" />
</td>
<td width="60%" valign="top">

### 一图概览 · At a Glance

- **80+ 位**唐宋诗人，按时代纵向铺开
- 颜色三档：🔴 核心代表 · 🔵 重要名家 · 🟢 知名文人
- 30+ 个标签的多维筛选（文人类型 / 行迹 / 流派 / 科举 / 官职）
- 关系网络图谱：单人关系图 + 全景力导向图
- 一键导出整张时间轴为长图
- 移动端紧凑顶栏 + 全屏筛选抽屉，桌面端宽屏布局
- Hash 路由 `#/poet/<姓名>`、`#/graph` 直接分享

> *80+ poets · timeline + relationship graph · 30+ multi-select tags ·
> one-click PNG export · responsive (mobile drawer / desktop wide layout) ·
> shareable URLs via hash routing.*

</td>
</tr>
</table>

## 功能 · Features

- **时间轴主视图** — 以年份为纵轴铺开所有诗人卡片，按"五代"等时期分块；颜色区分核心 / 重要 / 知名三档。
- **人物详情** — 点击卡片进入详情弹窗，含生平、流派、官职、代表作；移动端横排显示，桌面端竖排古风排版。
- **关系网络** — 单人关系图（围绕中心人物）+ 全景关系图（按时期分簇的力导向图）。
- **多维筛选** — 5 大类 30+ 个标签，支持多选 AND 过滤。
- **导出长图** — 一键导出整张时间轴为 PNG。
- **Hash 路由** — `#/poet/<姓名>`、`#/graph`、`#/graph/<姓名>` 都能直接分享。
- **响应式** — 移动端紧凑顶栏 + 全屏筛选抽屉、自动 fit zoom、双指缩放；桌面端宽屏布局。
- **数据自检** — 构建前跑数据完整性校验（关系两端必须存在、生卒年逻辑、必填字段等）。

> *Timeline view · poet detail modal (vertical Chinese typography on desktop) ·
> per-poet & global relationship graphs · multi-tag AND filter · PNG export ·
> shareable hash URLs · responsive layout · data integrity checks at build time.*

## 技术栈 · Tech Stack

| 层 / Layer | 选型 / Choice |
|---|---|
| 框架 / Framework | React 19 + TypeScript |
| 构建 / Build | Vite 6 |
| 样式 / Styling | Tailwind CSS 4 |
| 可视化 / Viz | D3.js（按子包：`d3-selection` / `d3-force` / `d3-zoom` / `d3-drag`） |
| 图标 / Icons | lucide-react |
| 部署 / Hosting | 静态产物，托管在腾讯云 EdgeOne Pages（CN-friendly static hosting） |

## 本地运行 · Getting Started

**前置条件 (Prerequisites)**：Node.js ≥ 18

```bash
npm install
npm run dev          # http://localhost:3000
```

## 构建与部署 · Build & Deploy

```bash
npm run validate:data    # 数据完整性校验（也会在 prebuild 阶段自动跑）
npm run build            # 输出到 dist/
npm run preview          # 本地预览 dist/
```

构建产物在 `dist/`，是纯静态文件（HTML + CSS + 分包 JS），可直接传到任意静态托管：EdgeOne Pages / Cloudflare Pages / Vercel / Netlify / 腾讯云 COS / GitHub Pages 都行。

> *`dist/` is a fully static bundle (HTML + CSS + chunked JS). Drop it onto any
> static host — EdgeOne Pages, Cloudflare Pages, Vercel, Netlify, Tencent COS,
> GitHub Pages — no backend required.*

### 部署到 EdgeOne Pages（手动 zip 模式）

> 注意：Windows PowerShell 的 `Compress-Archive` 会把内部路径写成反斜杠，EdgeOne 上传时会拒绝。请用 `.NET ZipArchive` 手动打包，确保路径用正斜杠：

```powershell
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$distRoot = (Resolve-Path .\dist).Path
$zipPath = (Join-Path (Resolve-Path .).Path 'hangzhou-poets-dist.zip')
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
$fs = [System.IO.File]::Create($zipPath)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $distRoot -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($distRoot.Length + 1).Replace('\','/')
    $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
    $es = $entry.Open(); $fs2 = [System.IO.File]::OpenRead($_.FullName)
    try { $fs2.CopyTo($es) } finally { $fs2.Close(); $es.Close() }
  }
} finally { $zip.Dispose(); $fs.Dispose() }
```

把生成的 `hangzhou-poets-dist.zip` 上传到 EdgeOne Pages 项目的「新建部署」即可。

## 项目结构 · Project Structure

```
src/
├── App.tsx                  # 顶层布局、缩放/路由/触屏交互
├── main.tsx                 # 入口；启动时跑数据校验
├── components/
│   ├── Header.tsx           # 移动端紧凑顶栏 + 全屏筛选抽屉；桌面端宽栏
│   ├── TimelineBody.tsx     # 时间轴主体、十年分隔
│   ├── PoetCard.tsx         # 单张诗人卡片
│   ├── PoetDetailModal.tsx  # 详情弹窗（懒加载诗作内容）
│   ├── RelationshipGraph.tsx        # 单人关系图
│   └── GlobalRelationshipGraph.tsx  # 全景关系图
├── data/
│   ├── poets.ts             # 诗人列表（生卒、标签、官职等）
│   ├── relationships.ts     # 人物关系
│   ├── works.ts             # 代表作（懒加载）
│   └── validate.ts          # 数据校验
├── hooks/
│   └── useHashRoute.ts      # Hash 路由
├── constants/               # 时期定义、标签分组、缩放常量
├── types/                   # 类型定义
└── utils/                   # 布局计算、长图导出
```

## 数据来源 · Data Sources

诗人生卒年、官职、流派、代表作主要参考《全唐诗》《全宋词》以及通行的人物年谱、地方志资料；关系网络以可考的师承、唱和、姻亲、同朝为依据，部分推断关系会标注存疑。

> *Biographical data is sourced from Quan Tang Shi (《全唐诗》),
> Quan Song Ci (《全宋词》), standard chronological biographies, and Hangzhou
> local gazetteers. Relationships are based on documented mentorships, poetic
> exchanges, kinship, and contemporaneous service; speculative links are flagged.*

如发现数据错误欢迎提 Issue / PR。
*Data corrections via Issue or PR are very welcome.*

## License

[Apache License 2.0](./LICENSE) — Copyright 2026 Lele Tang
