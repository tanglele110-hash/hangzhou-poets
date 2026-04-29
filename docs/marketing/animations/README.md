# 钱塘 · 七百年 · 30s 动画交付

> 配套脚本：`docs/marketing/short-video-scripts.md` 的 **30s 时间叙事版**。
> 设计风格：A+B 混合（Kenya Hara 极简底 + Pentagram 数据海报高潮）。

---

## 1. 交付文件

| 文件 | 用途 | 规格 |
|------|------|------|
| `qiantang-30s.mp4` | **剪映/Premiere 直接拖入用**。H.264 / yuv420p / 1920×1080 / 25fps / 29.96s / 无音轨 | 1.2 MB |
| `qiantang-30s.html` | 源文件。可二次编辑、跳秒检查、导出新版本 | 34 KB |

> 工作版备份在 `_temp/design-demos/scene-30s.html`+`scene-30s.mp4`，两份始终保持同步。
> 重录 MP4：`cd _temp/design-demos && node render-video.js scene-30s.html --duration=30 --width=1920 --height=1080`

---

## 2. 一分钟播放

```
直接双击 qiantang-30s.html → 默认浏览器打开 → 按 F11 全屏 → 等 1-2s 字体加载 → 30s 自动播放完 → 停在最后一帧
```

**重新播放**：浏览器刷新（F5 / Ctrl+R）即可。

**跳秒检查**：在 URL 末尾加 `#t=N`（N = 秒数，0–30），动画会冻结在该秒。例如：
- `qiantang-30s.html#t=14.5` → 直接显示 "定都临安 · 1138" 那一帧
- `qiantang-30s.html#t=24.0` → 数据海报高潮帧

---

## 3. 时间轴速查（10 段）

| 时间 | 段名 | 风格 | 视觉要点 |
|------|------|------|----------|
| 0–3s   | HOOK              | A | 米白底 · 远山三层 · 「钱塘 · 七百年」+ 副标 |
| 3–5s   | 唐 · 白居易        | A | 「唐 TANG」+ 8 2 2 + 大字「白居易」+「杭州刺史」 |
| 5–8s   | 白诗               | A | 一字一字浮起：未能抛得杭州去 |
| 8–11s  | 北宋 · 苏轼        | A | 「北宋 NORTHERN SONG」+ 1 0 8 9 + 「苏轼」+「知杭州」 |
| 11–13s | 苏堤               | A | 苏堤一道自此而长 / 元祐四年·苏轼主修 |
| 13–16s | 南宋 · 定都        | A | 南渡之后 → 定都临安 · 1138 |
| 16–19s | 三位词宗           | A | 李清照 寓此 · 陆游 宦此 · 辛弃疾 登此 |
| 19–22s | 三位诗人           | A | 林逋 隐此 孤山 · 岳飞 葬此 栖霞 · 文天祥 过此 北去 |
| **22–26s** | **数据海报**   | **B** | **81 · 38 · 7 + POETS/RELATIONS/DYNASTIES + 网格 + 朱红线** |
| 26–30s | Coda               | A | 山水写他们 → 他们写山水 + 左下朱红「钱」印 |

---

## 4. 剪映 / Premiere 导入

### 推荐路径（最省事）
直接把 `qiantang-30s.mp4` 拖到剪映/Premiere/CapCut/Final Cut/DaVinci Resolve 任一时间线即可。所有参数都已对齐主流剪辑软件原生支持：

| 项 | 值 | 备注 |
|---|---|---|
| 容器 | MP4 | 通用 |
| 视频编码 | H.264 (libx264) | 剪映原生解码无转码 |
| 像素格式 | yuv420p | 全平台兼容（包含旧手机） |
| 分辨率 | 1920×1080 | 16:9 横屏 |
| 帧率 | 25 fps | 与 PAL 标准一致；剪映可改任意帧率 |
| 时长 | 29.96 秒 | 与原 HTML 30s 几乎完全对齐 |
| 音轨 | 无 | 剪映里直接拖 BGM 到下方音轨即可 |
| 关键帧间隔 | 默认（1-2s） | faststart 已开，秒开播放 |

### 在剪映里加 BGM
1. 把 `qiantang-30s.mp4` 拖到时间线
2. 把你选的 BGM 拖到下方音轨
3. 把 BGM 时长精确裁到 30 秒（首位 0.3s 淡入 / 末尾 1.0s 淡出）
4. BGM 音量降到 -8 ~ -12 dB（古风/极简曲足够低让画面呼吸）
5. 导出：1080p · 25fps · H.264 · CRF 18 · 适合所有平台

### 重录 MP4（只在改动 HTML 后才需要）
```bash
cd _temp/design-demos
node render-video.js scene-30s.html --duration=30 --width=1920 --height=1080
# 输出 scene-30s.mp4，约 45 秒完成
# 然后 Copy-Item scene-30s.mp4 ..\..\docs\marketing\animations\qiantang-30s.mp4 -Force
```

### 备选：浏览器内自录屏（完全不依赖 MP4）

| 方案 | 步骤 | 适合 |
|---|---|---|
| **macOS** | Chrome 全屏（Ctrl+Cmd+F）→ Cmd+Shift+5「录制所选部分」→ 拖出 1920×1080 → Cmd+R 刷新 | 临时/快速 |
| **Windows Game Bar** | F11 → Win+G → 录制 → Ctrl+R 刷新 → 等 32s 停止 | 临时/快速 |
| **OBS Studio** | 1920×1080/60fps · 窗口捕获 Chrome · F5 刷新 → 等 32s | 高画质/专业 |

---

## 5. 已知参数

| 项 | 值 |
|---|---|
| 分辨率 | 1920×1080（16:9 横屏） |
| 时长 | 30 秒 |
| 帧率 | 60 fps（浏览器 RAF，录屏建议同 60 fps） |
| 调色板 | 米白 `#F5F2EB` · 墨黑 `#1A1A1A` · 朱红 `#B83B3B` |
| 中文字体 | Noto Serif SC（200/300/400/700/900） |
| 西文字体 | Inter（300/400/700/900） |
| 字体加载 | 首次打开需联网拉 Google Fonts，约 1-2 秒 |
| 外部依赖 | React 18 + Babel-standalone（unpkg.com） |
| 网络要求 | **首次播放需联网**（fonts.googleapis.com / unpkg.com） |

> 离线场景：把 React/Babel/字体 inline 进 HTML 即可（约 +1.5MB）。如需离线版，告诉我。

---

## 6. 文案出处与考据

| 段 | 文案 | 出处 / 史实 |
|---|------|------|
| 白诗 | 未能抛得杭州去 | 白居易《春题湖上》原句 |
| 苏堤 | 元祐四年 · 苏轼主修 | 元祐四年（1089）苏轼任杭州知州，主持疏浚西湖、筑长堤 |
| 定都 | 1138 · 定都临安 | 南宋绍兴八年（1138）正式定都临安（杭州） |
| 三位词宗 | 寓此 / 宦此 / 登此 | 李清照晚年寓杭；陆游多次任职两浙；辛弃疾绍熙年间到杭 |
| 三位诗人 | 隐此 / 葬此 / 过此 | 林逋孤山隐居；岳飞葬于栖霞岭；文天祥被押解过临安北去大都 |
| Coda | 山水写他们 / 他们写山水 | 自撰对仗，呼应"诗人与山水互文"的项目主题 |

---

## 7. 二次编辑入口

打开 `qiantang-30s.html` 在编辑器中搜索关键字定位组件：

| 想改什么 | 搜索关键字 | 组件 |
|---|---|---|
| HOOK 远山线 | `// 上方水墨远山` | `HookScene` |
| 人物名片（年份+名+副标） | `function PoetCard` | `PoetCard` |
| 整行诗句 | `function PoemLine` | `PoemLine` |
| 三位词宗 | `function ThreeCiScene` | `ThreeCiScene` |
| 三位诗人 | `function ThreePoetsScene` | `ThreePoetsScene` |
| 数据海报高潮 | `function DataPosterScene` | `DataPosterScene` |
| Coda 山水对仗 | `function CodaScene` | `CodaScene` |
| 调色板 | `const PALETTE` | 全局色板 |
| 时间轴 | `function App` | 各段 Sprite start/end |

时间轴改 `App` 内 Sprite 的 `start`/`end` 即可。任何两段间留 0.3s 重叠用作 cross-fade。

---

## 8. 如果要换风格

- **要更浓的水墨感**：把 PALETTE.ink 换成 `#0A0A0A`、Stage bgColor 换成 `#FFFEF8`，给 Coda 加一道淡墨晕染 SVG
- **要更"网感"风**：把 fontWeight 200/300 改成 400/700，加大色块，DataPoster 改放视频背景
- **要更"严肃志铭"风**：所有 letter-spacing 从 0.4em 提到 0.6em，加更多负空间，去掉所有英文副标
- **要短到 15 秒**：删掉中段三位词宗 + 三位诗人（16-22s 共 6 秒）+ 苏堤诗（11-13s 共 2 秒）+ 收紧 Coda
