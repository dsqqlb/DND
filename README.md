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
- 🌀 **专注追踪** —— 施放专注类法术时顶部横条自动亮起，再也不会忘记专注被打断
- ✦ **法术流光** —— 展开法术详情时，卡片边缘浮现一圈缓缓旋转的金色光晕（`@property` + `conic-gradient` 纯 CSS 实现，零图片零 JS 动画）
- 🎲 **先攻追踪器** —— 战斗顺序轮播卡片，当前行动者以金色脉冲高亮
- 💾 **过目不忘** —— 所有状态（含当前标签页）自动落盘 `localStorage`，刷新、关标签页、重启电脑，数据都还在
- 🔍 **法术 / 物品选择器** —— 分类筛选 + 模糊搜索的模态框，从 **64** 条法术、**28** 件物品里秒速定位

---

## 🎴 四大面板

| 面板 | 内容 |
|:---:|:---|
| ⚔️ **战斗** | 六维属性 · HP / AC / 豁免骰 · 死亡豁免 · 力竭计数 · 幸运骰 · 增益状态 · 先攻顺序追踪 |
| ☩ **职业** | 神术施法 · 引导神力（次数追踪）· 生命领域特性 · 专长与技能熟练 |
| ✦ **法术** | 戏法 & 已备法术按环阶分组 · 内联展开详情（金色流光）· 法术选择器 · 领域法术锁定 |
| ⊛ **背包** | 物品预设（数量 ±）· 记事本 · 负重统计 · 四币种（铂 / 金 / 银 / 铜） |

---

## 🏛️ 项目架构

数据与逻辑彻底解耦 —— 加法术只碰数据文件，逻辑代码一行不动。

```
DND/
├── index.html                  # 页面骨架 + 法术/物品模态框
├── css/
│   └── character_sheet.css     # 深色主题，CSS 自定义属性统一色板
├── js/
│   ├── data/                   # ── 纯数据层 ──
│   │   ├── spells.js           #   SPELL_DB · 64 条法术（戏法~3环）
│   │   └── items.js            #   ITEM_DB  · 28 件物品（武器/护甲/装备/消耗品）
│   ├── character_config.js     # 角色配置 CHAR + 状态列表 BUFFS
│   └── character_sheet.js      # ── 逻辑层 ── 状态 / 渲染 / 事件
└── README.md
```

**加载顺序即依赖顺序**：数据层三个脚本先行，逻辑层 `character_sheet.js` 殿后。纯 classic script，无需 `type="module"`，因此**双击 `index.html` 也能直接跑**。

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
