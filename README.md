<div align="center">

# ⚔️ 金雳 · 冒险者档案 ⚔️

### *A Digital Character Sheet for Dungeons & Dragons 5e*

**生命领域牧师 · 第 5 级 · 丘陵矮人**

一张活在浏览器里的 D&D 5e 人物卡 —— 纯手工原生打造，**零框架 · 零依赖 · 零构建**。
点开就能用，掷骰吧，冒险者。

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)
![Build](https://img.shields.io/badge/build-zero--config-blueviolet?style=flat-square)
![Storage](https://img.shields.io/badge/persistence-localStorage-orange?style=flat-square)
![D&D](https://img.shields.io/badge/D%26D-5e-red?style=flat-square)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222?style=flat-square&logo=github)

</div>

---

## ✨ 亮点一览

> 不只是一张表格，而是一套会呼吸的战斗仪表盘。

- 🩸 **动态血条** —— 生命值百分比实时映射到 HSL 色相，从满血翠绿一路烧到濒死赤红，危险一眼看穿
- 🪄 **长按施法** —— 直接按住法术框，金色进度从左铺满即施放：自动扣除法术位、专注类法术自动记录专注；带**升环施法效应**的法术长按后会弹窗询问「用本环还是升环（升到几环）」，按所选环阶消耗法术位；无升环效应或仅剩一档可用法术位时按最低可用环阶直接施放（本环用完自动升环）。无可用法术位时长按无反应，轻触则照常展开详情。长按设计防误触，手机上尤其顺手
- 🌀 **专注追踪** —— 施放专注类法术时顶部横条自动亮起，再也不会忘记专注被打断
- ✦ **法术流光** —— 展开法术详情时，卡片边缘浮现一圈缓缓旋转的金色光晕（`@property` + `conic-gradient` 纯 CSS 实现，零图片零 JS 动画）
- 🎲 **先攻追踪器** —— 战斗顺序轮播卡片，当前行动者以金色脉冲高亮
- ✒ **冒险日志 & 跑团计时** —— 独立日志页：点「开始」即以当前日期时间新建一次跑团并计时（时 / 分 / 秒），同时自动记录本场的**施法（含升环环阶）· 生命增减 · 专注开合 · 状态增益 · 死亡豁免 · 引导神力 · 幸运骰 · 先攻回合 · 背包物品 / 货币 · 长短休**，也能随手写笔记；日志按「一次跑团」归档成可折叠文件夹，多次跑团层层累积。八类筛选（施法 / 生命 / 状态 / 战斗 / 物品 / 休整 / 笔记）、单条与整场删除齐全；**日志独立导入 / 导出 `.json`**，与角色备份互不干扰
- 💾 **过目不忘** —— 所有状态（含当前标签页）自动落盘 `localStorage`，刷新、关标签页、重启电脑，数据都还在
- 🔍 **法术 / 物品选择器** —— 分类筛选 + 模糊搜索的模态框，从 **64** 条法术、**28** 件物品里秒速定位

---

## 🎴 五大面板

| 面板 | 内容 |
|:---:|:---|
| ⚔️ **战斗** | 六维属性 · HP / AC / 豁免骰 · 死亡豁免 · 力竭计数 · 幸运骰 · 增益状态 · 先攻顺序追踪 |
| ☩ **职业** | 神术施法 · 引导神力（次数追踪）· 生命领域特性 · 专长与技能熟练 |
| ✦ **法术** | 戏法 & 已备法术按环阶分组 · 内联展开详情（金色流光）· 法术选择器 · 领域法术锁定 |
| ⊛ **背包** | 物品预设（数量 ±）· 记事本 · 负重统计 · 四币种（铂 / 金 / 银 / 铜） |
| ✒ **日志** | 跑团计时器（开始/暂停/结束）· 冒险日志按跑团归档的文件夹 · 自动记录施法/生命/状态/战斗/物品/休整 · 手动笔记 · 分类筛选 · 独立导入/导出 |

---

## 🏛️ 项目架构

**零构建 · 模块化 · 关注点分离** —— 升级角色改配置文件，加法术改数据文件，逻辑代码一行不碰。

```
DND/
├── index.html                      # 页面骨架 + 法术/物品/增益选择器模态框
├── css/
│   └── character_sheet.css         # 深色主题，CSS 自定义属性统一色板，动效 & 响应式
├── js/
│   ├── config/                     # ── 配置层 ──
│   │   └── character.js            #   CHAR 角色配置（等级、属性、技能、法术位）
│   │                               #   ★ 升级/调整角色只改这里
│   ├── data/                       # ── 纯数据层 ──
│   │   ├── spells.js               #   SPELL_DB · 64 条法术（戏法~3环）
│   │   ├── items.js                #   ITEM_DB  · 28 件物品（武器/护甲/装备/消耗品）
│   │   └── buffs.js                #   BUFF_DB  · 27 种状态/增益/战术
│   │                               #   ★ 加法术/物品/状态只改数据层
│   ├── core/                       # ── 核心引擎 ──
│   │   ├── state.js                #   localStorage 工具 + 全局状态 state + 派生值 DERIVED
│   │   ├── render.js               #   所有 render* 函数（静态卡面 / HP / 法术 / 增益等）
│   │   └── dialogs.js              #   对话框系统 + 法术/增益选择器模态框
│   ├── features/                   # ── 功能模块 ──
│   │   ├── rest.js                 #   长休/短休按钮 + HP/死亡豁免/力竭/专注交互
│   │   ├── initiative.js           #   先攻追踪器（完整 IIFE 封装）
│   │   ├── bag.js                  #   背包管理（物品 ±、记事本、货币、导出/导入备份）
│   │   └── log.js                  #   冒险日志 + 跑团计时器（会话文件夹、独立导入/导出）
│   └── main.js                     #   首次渲染 + 标签页切换 + 面板折叠 + 幸运骰
└── README.md
```

### 📦 模块说明

| 文件 | 行数 | 职责 |
|:---|---:|:---|
| `config/character.js` | 70 | 角色配置：属性、等级、法术位、领域法术、技能熟练 |
| `data/spells.js` | 927 | 法术数据库（含戏法、1-3 环自选法术、领域法术） |
| `data/items.js` | 101 | 物品数据库（武器、护甲、装备、消耗品） |
| `data/buffs.js` | 45 | 状态/增益库（9 种增益、14 种状态、4 种战术） |
| `core/state.js` | 91 | localStorage 读写、全局状态初始化、派生值计算（熟练加值、法术 DC、先攻等） |
| `core/render.js` | 512 | 静态卡面渲染、HP 血条、法术面板（含升环环阶选择触发）、增益芯片、死亡豁免、力竭计数等 |
| `core/dialogs.js` | 470 | 自定义对话框系统、法术选择器、增益选择器、升环环阶选择框 |
| `features/rest.js` | 240 | 长休/短休逻辑、HP 编辑（含日志记录）、死亡豁免、力竭、专注管理、角色备份导出/导入 |
| `features/initiative.js` | 411 | 先攻追踪器（新增/删除/排序/当前回合高亮） |
| `features/bag.js` | 198 | 背包物品数量调整、记事本持久化、货币管理 |
| `features/log.js` | 466 | 冒险日志 + 跑团计时器：会话文件夹、自动记录、分类筛选、独立导入/导出 |
| `main.js` | 90 | 页面入口：首次渲染所有面板、标签页路由、面板折叠、幸运骰交互 |
| **总计** | **3621** | 数据、配置与逻辑完全分离的 12 个模块 |

### ⚙️ 加载顺序与依赖

`index.html` 中的 `<script>` 标签顺序即依赖链：

```html
<!-- 1. 数据层 -->
<script src="js/data/spells.js"></script>
<script src="js/data/items.js"></script>
<script src="js/data/buffs.js"></script>

<!-- 2. 配置层 -->
<script src="js/config/character.js"></script>

<!-- 3. 核心引擎 -->
<script src="js/core/state.js"></script>
<script src="js/core/render.js"></script>
<script src="js/core/dialogs.js"></script>

<!-- 4. 功能模块 -->
<script src="js/features/rest.js"></script>
<script src="js/features/initiative.js"></script>
<script src="js/features/bag.js"></script>
<script src="js/features/log.js"></script>

<!-- 5. 入口 -->
<script src="js/main.js"></script>
```

**纯 classic script 模式** —— 无需 `type="module"`，因此 **双击 `index.html` 也能直接跑**。所有模块通过共享全局变量（`CHAR`、`state`、`SPELL_DB` 等）通信，零构建工具，零依赖配置。

---

## 🚀 快速开始

无需安装，无需构建，无需 `npm install` 的漫长等待：

```bash
git clone <repo-url>
cd DND

# 直接开跑
start index.html      # Windows
open  index.html      # macOS
xdg-open index.html   # Linux
```

或者干脆 —— **双击 `index.html`**。就这么简单。

---

## 🌐 一分钟部署到 GitHub Pages

纯静态站点，天生为 Pages 而生：

1. 把仓库推上 GitHub
2. **Settings → Pages → Source** 选 `main` 分支 `/ (root)` 目录
3. 保存，稍候片刻
4. 访问 `https://<你的用户名>.github.io/<仓库名>` —— 全世界都能看到你的人物卡 ✨

> 💡 `localStorage` 在 Pages（https）上照常工作，数据存在访问者自己的浏览器里；键名统一 `dnd_` 前缀，与同域下其他项目互不干扰。

---

## 🛠️ 技术栈

<div align="center">

| | |
|:---|:---|
| **核心** | 纯原生 HTML5 / CSS3 / ES2015+，零框架零依赖零构建 |
| **主题** | CSS 自定义属性统一深色色板（`--bg-deep` / `--accent-glow` …） |
| **动效** | CSS `@property` + `conic-gradient` 驱动的金色旋转流光边框 |
| **血条** | HSL 色相随生命百分比线性插值，纯 CSS 无渐变图 |
| **持久化** | `localStorage`，键名前缀 `dnd_`，全量状态自动保存 |
| **字体** | [Cinzel](https://fonts.google.com/specimen/Cinzel)（标题）+ 系统无衬线（正文） |

</div>

---

<div align="center">

*“愿光辉指引你的道路，冒险者。”*

**Built with 🛡️ &nbsp;·&nbsp; Powered by ☕ &nbsp;·&nbsp; No frameworks were harmed in the making of this sheet.**

</div>
