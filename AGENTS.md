# AGENTS.md

> **跨 agent 入口文件**（agents.md 事实标准）— 给 Codex / Claude / Gemini / Copilot 等任何 AI agent 接手本项目时读的"30 秒上手"。
> Cursor 用户：`.cursor/rules/visual-system.mdc` 已 `alwaysApply`，本文件是其补充。

---

## 项目本质

纯前端 SPA，React 19 + TypeScript + Vite 6 + Tailwind v4 + D3。无后端、无环境变量、无登录。`dist/` 即可静态托管。

主入口：[GitHub Pages](https://tanglele110-hash.github.io/hangzhou-poets/)。详细介绍 → `README.md`。

## 不要破坏的契约

| 契约 | 文件 | 破坏后果 |
|---|---|---|
| **数据完整性** | `npm run prebuild` 强制跑 `src/data/validate-cli.ts`，关系两端必须存在、生卒年逻辑、必填字段 | 改动 `src/data/*` 后 build 直接挂 |
| **视觉 DNA** | `.cursor/rules/visual-system.mdc`（颜色/字体/朝代映射/朱印/CTA 七条强制规则） | UI 立刻显得"AI slop" |
| **Hash 路由** | `#/poet/<姓名>` / `#/graph` / `#/graph/<姓名>` 是**已公开的分享链接**（公众号 + 小红书都已发） | 改路由 = 所有外发链接 404 |
| **诗人派生 meta** | 改 `src/utils/poetMeta.ts` 的 map，**不要**动 `src/data/poets.ts` 的 schema | 数据校验 / 类型推导链断裂 |

## 仓库里看不到、但你应该知道的事

### `docs/marketing/` 仅本地存在

公众号文章 / 小红书 PNG / 短视频 MP4 / 设计 HTML 这些营销物料**不入仓**（`.gitignore` 第 31 行排除），原因是 PNG + MP4 会让 git 历史 24 MB 起步。

- **作者本地** 完整保留在 `docs/marketing/`
- **外部协作者** 如需视觉对照源文件 → 向作者索取
- **Agent 不要尝试 `read_file` 这个目录** — fork 后该目录不存在，会报错

### `.cursor/rules/visual-system.mdc` 是视觉规则的单一真相源

任何"加新组件 / 改样式 / 调配色"前**必读**。该文件为 `alwaysApply: true`，Cursor 自动注入；其他 agent 请手动读一次。

### 数据校验是构建的硬门槛

```bash
npm run validate:data    # 手动跑（也会在 prebuild 自动跑）
```

校验失败 = build 失败。改完 `src/data/*` 任何文件，**push 前先本地 build 一次**避免炸 CI/CD。

### 部署是双轨

- **GitHub Pages**（主，已生效）：push 到 `main` → `.github/workflows/deploy-pages.yml` 自动部署
- **EdgeOne Pages**（国内镜像，待 ICP 备案后启用）：手动 zip → 上传，README "部署到 EdgeOne Pages" 章节有完整命令（注意必须用 `.NET ZipArchive`，PowerShell 默认 `Compress-Archive` 路径反斜杠 EdgeOne 会拒）

## 常用命令速查

```bash
npm run dev              # http://localhost:3000
npm run validate:data    # 数据完整性校验
npm run build            # 输出到 dist/
npm run lint             # tsc --noEmit
npm run format           # prettier 格式化 src/
```

## 红线（绝对不要做）

- ❌ 把 `docs/marketing/` 重新 `git add`（它是有意排除的）
- ❌ 在 `src/` 里硬编码 hex 颜色 / Tailwind `gray-*` —— 必须用 CSS 变量
- ❌ 修改已发布的 hash 路由格式 —— 等同破坏外发链接
- ❌ 把 LLM API key 写进 `vite.config.ts` 的 `define` 或任何会进 client bundle 的地方（`.env.example` 第 2-4 行已警告）
- ❌ 改 `src/data/poets.ts` 的字段 schema —— 派生 meta 走 `src/utils/poetMeta.ts`

## 文件指针

| 想做什么 | 看哪里 |
|---|---|
| 加新诗人 / 改数据 | `src/data/*` + 跑 `npm run validate:data` |
| 加新派生 meta（拼音 / 朱印 / 在杭事迹） | `src/utils/poetMeta.ts` |
| 改 UI 样式 / 加组件 | `.cursor/rules/visual-system.mdc` 必读 |
| 项目背景 / 部署 / 数据来源 | `README.md` |
| 改部署流程 | `.github/workflows/*.yml` + `vite.config.ts`（注意 `VITE_BASE_PATH`） |
