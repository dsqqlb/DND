/* ============================================================
   法术数据库 (Spell Database)
   字段: id, name, nameEn, level, school, classes,
         castTime, range, components, duration, conc, description
   level=0 为戏法，1-3 为对应环阶。
   可自行在对应 level 区域追加对象扩充数据库。
============================================================ */
const SPELL_DB = [

  /* ──────────────────── 戏法 (Level 0) ──────────────────── */
  {
    id: 'guidance',
    name: '神导术',
    nameEn: 'Guidance',
    level: 0,
    school: '预言',
    classes: ['牧师', '德鲁伊'],
    castTime: '动作',
    range: '触碰',
    components: 'V、S',
    duration: '专注，至多 1 分钟',
    conc: true,
    description: '你触碰一名自愿生物并选择一项技能。直到法术结束为止，受术生物在进行使用到所选技能的任何属性检定时，该次检定具有 1d4 加值.'
  },

  {
    id: 'light',
    name: '光亮术',
    nameEn: ' Light',
    level: 0,
    school: '塑能',
    classes: ['吟游诗人', '牧师', '术士', '法师'],
    castTime: '动作',
    range: '触碰',
    components: 'V、M（一只萤火虫或一片磷光苔藓）',
    duration: '1 小时',
    conc: false,
    description: '你触碰一个体型不超过大型，且未被他人携带/着装的物件。在法术终止前，物件将发出 20 尺半径的明亮光照以及额外 20 尺的微光光照。光的颜色由你决定。该物件被不透明的东西完全遮盖时，其光照也将被遮挡。此法术将在你再次施展它时提前终止。'
  },

  /* ──────────────────── 1环法术 (Level 1) ──────────────────── */
  {
    id: 'cure_wounds', name: '治愈创伤', nameEn: 'Cure Wounds',
    level: 1, school: '塑能系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '圣武士', '游侠'],
    castTime: '1个动作', range: '触碰', components: 'V, S',
    duration: '立即', conc: false,
    description: '你触碰一个生物，使其恢复1d8＋感知调整值的生命值。对亡灵和构装体无效。\n升环：每提高一个环阶额外恢复1d8。'
  },
  {
    id: 'bless', name: '祝福术', nameEn: 'Bless',
    level: 1, school: '预言系',
    classes: ['牧师', '圣武士'],
    castTime: '1个动作', range: '30尺', components: 'V, S, M（一小撮圣水）',
    duration: '专注，至多1分钟', conc: true,
    description: '你祝福最多3个你能看见的范围内生物。直至法术结束，目标每次进行攻击检定或豁免检定时，可掷一个d4并加到结果上。\n升环：每提高一个环阶可额外祝福一个生物。'
  },
  {
    id: 'guiding_bolt', name: '神导光束', nameEn: 'Guiding Bolt',
    level: 1, school: '召唤系',
    classes: ['牧师'],
    castTime: '1个动作', range: '120尺', components: 'V, S',
    duration: '1轮', conc: false,
    description: '一道闪耀的光芒射向你选择的一个目标。进行法术攻击检定，命中时目标受4d6点辐射伤害，且直至该轮结束，对该目标的下一次攻击检定具有优势。\n升环：每提高一个环阶额外增加1d6伤害。'
  },
  {
    id: 'healing_word', name: '疗伤之言', nameEn: 'Healing Word',
    level: 1, school: '塑能系',
    classes: ['牧师', '德鲁伊', '吟游诗人'],
    castTime: '1个附赠动作', range: '60尺', components: 'V',
    duration: '立即', conc: false,
    description: '你的一句话赐予一个你能看见的生物1d4＋感知调整值的治愈。对亡灵和构装体无效。\n升环：每提高一个环阶额外增加1d4。'
  },
  {
    id: 'inflict_wounds', name: '降祸创伤', nameEn: 'Inflict Wounds',
    level: 1, school: '死灵系',
    classes: ['牧师'],
    castTime: '1个动作', range: '触碰', components: 'V, S',
    duration: '立即', conc: false,
    description: '对你触碰的一个生物进行近战法术攻击，命中时目标受3d10点死灵伤害。\n升环：每提高一个环阶额外增加1d10伤害。'
  },
  {
    id: 'shield_of_faith', name: '信念护盾', nameEn: 'Shield of Faith',
    level: 1, school: '防护系',
    classes: ['牧师', '圣武士'],
    castTime: '1个附赠动作', range: '60尺', components: 'V, S, M（一小段神圣经文羊皮纸）',
    duration: '专注，至多10分钟', conc: true,
    description: '一道闪烁的神圣力量场笼罩你选择的一个你能看见的生物，赋予目标+2的AC加值，直至法术结束。'
  },
  {
    id: 'command', name: '命令术', nameEn: 'Command',
    level: 1, school: '附魔系',
    classes: ['牧师', '圣武士'],
    castTime: '1个动作', range: '60尺', components: 'V',
    duration: '1轮', conc: false,
    description: '你对一个你能看见的生物说出一个单词命令（如"趴下""逃跑""放下""跑开""停止"）。目标须通过感知豁免，否则在下一轮内执行该命令。对亡灵以及无法理解你语言的生物无效。\n升环：每提高一个环阶可额外指挥一个生物。'
  },
  {
    id: 'detect_magic', name: '侦测魔法', nameEn: 'Detect Magic',
    level: 1, school: '预言系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '游侠', '圣武士', '术士', '巫师', '魔契师'],
    castTime: '1个动作（仪式）', range: '自身（30尺半径）', components: 'V, S',
    duration: '专注，至多10分钟', conc: true,
    description: '在持续时间内，你能感知到30尺内法术的存在并看见其光晕。若你能看见一个有光晕的生物或物体，可辨认其上的法术学派。'
  },
  {
    id: 'protection_evil_good', name: '辟邪结界', nameEn: 'Protection from Evil and Good',
    level: 1, school: '防护系',
    classes: ['牧师', '圣武士', '术士', '巫师', '魔契师'],
    castTime: '1个动作', range: '触碰', components: 'V, S, M（圣水或银粉，施法后消耗）',
    duration: '专注，至多10分钟', conc: true,
    description: '愿意的一个你触碰的生物受到防护，对抗以下类型生物：异界生物、元素生物、妖精、天界生物、邪魔和亡灵。防护效果：对目标的攻击检定无优势；目标无法被这些类型的生物魅惑、恐慌或附体。'
  },

  /* ──────────────────── 2环法术 (Level 2) ──────────────────── */
  {
    id: 'lesser_restoration', name: '次级恢复术', nameEn: 'Lesser Restoration',
    level: 2, school: '塑能系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '圣武士', '游侠'],
    castTime: '1个动作', range: '触碰', components: 'V, S',
    duration: '立即', conc: false,
    description: '你触碰一个生物，清除一种影响它的疾病，或清除以下状态之一：目盲、耳聋、麻痹或中毒。'
  },
  {
    id: 'spiritual_weapon', name: '精神武器', nameEn: 'Spiritual Weapon',
    level: 2, school: '塑能系',
    classes: ['牧师'],
    castTime: '1个附赠动作', range: '60尺', components: 'V, S',
    duration: '1分钟', conc: false,
    description: '你在选择的一个范围内空间召唤一件漂浮发光武器，存续至法术结束。施放时及此后每轮你的附赠动作，可将武器移动至60尺内任意位置并对附近目标进行近战法术攻击。命中时目标受1d8＋感知调整值的力量（强力）伤害。\n升环：每提高两个环阶额外增加1d8。'
  },
  {
    id: 'aid', name: '援助术', nameEn: 'Aid',
    level: 2, school: '塑能系',
    classes: ['牧师', '圣武士'],
    castTime: '1个动作', range: '30尺', components: 'V, S, M（一小片白布）',
    duration: '8小时', conc: false,
    description: '最多3个你能看见的范围内生物的生命值上限和当前生命值各提升5点，持续8小时。\n升环：每提高一个环阶额外增加5点。'
  },
  {
    id: 'hold_person', name: '定身术', nameEn: 'Hold Person',
    level: 2, school: '附魔系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '术士', '巫师', '魔契师'],
    castTime: '1个动作', range: '60尺', components: 'V, S, M（一小段铁链）',
    duration: '专注，至多1分钟', conc: true,
    description: '选择一个你能看见的范围内人形生物。目标须通过感知豁免，失败则陷入瘫痪，直至法术结束。目标在每个回合结束时可重新豁免，成功则法术终止。\n升环：每提高一个环阶可额外锁定一个人形生物。'
  },
  {
    id: 'silence', name: '沉默术', nameEn: 'Silence',
    level: 2, school: '幻术系',
    classes: ['牧师', '游侠', '吟游诗人'],
    castTime: '1个动作（仪式）', range: '120尺', components: 'V, S',
    duration: '专注，至多10分钟', conc: true,
    description: '以指定点为中心20尺半径球形区域内，所有声音均被封锁。完全在区域内的生物对雷鸣伤害免疫，无法发声，也无法施放含语言成分的法术。'
  },
  {
    id: 'prayer_of_healing', name: '治愈祷文', nameEn: 'Prayer of Healing',
    level: 2, school: '塑能系',
    classes: ['牧师'],
    castTime: '10分钟', range: '30尺', components: 'V',
    duration: '立即', conc: false,
    description: '施法时间内，最多6个你能看见的生物各自恢复2d8＋感知调整值的生命值。对亡灵和构装体无效。\n升环：每提高一个环阶额外增加1d8。'
  },
  {
    id: 'enhance_ability', name: '强化能力', nameEn: 'Enhance Ability',
    level: 2, school: '变化系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '术士'],
    castTime: '1个动作', range: '触碰', components: 'V, S, M（兽毛或羽毛）',
    duration: '专注，至多1小时', conc: true,
    description: '你触碰一个生物并赋予以下增强之一：\n【熊之力】力量检定具有优势，负重上限翻倍；\n【猫之优雅】敏捷检定具有优势，不受跌落伤害；\n【宪法强化】体质检定具有优势，+2d6临时生命值；\n【鹰之敏锐】智力检定具有优势；\n【牡鹿之宽宏】魅力检定具有优势；\n【枭之智慧】感知检定具有优势。\n升环：每提高一个环阶可额外影响一个生物。'
  },
  {
    id: 'calm_emotions', name: '平息情绪', nameEn: 'Calm Emotions',
    level: 2, school: '附魔系',
    classes: ['牧师', '吟游诗人'],
    castTime: '1个动作', range: '60尺', components: 'V, S',
    duration: '专注，至多1分钟', conc: true,
    description: '你试图压制以一个点为中心20尺半径球形内人形生物的强烈情绪。每个目标须通过魅力豁免，失败则产生以下效果（二选一）：\n① 压制目前存在的魅惑或恐惧效果（效果不会结束，只是被压制）；\n② 令目标对所有生物漠不关心，直至法术结束或目标受到攻击后结束。'
  },

  /* ──────────────────── 3环法术 (Level 3) ──────────────────── */
  {
    id: 'beacon_of_hope', name: '希望烽火', nameEn: 'Beacon of Hope',
    level: 3, school: '塑能系',
    classes: ['牧师'],
    castTime: '1个动作', range: '30尺', components: 'V, S',
    duration: '专注，至多1分钟', conc: true,
    description: '赐予最多你能看见的范围内生物希望与活力。直至法术结束，每个目标对感知豁免和死亡豁免具有优势，且每次受到治愈时获得最大可能的治愈量。'
  },
  {
    id: 'revivify', name: '复生术', nameEn: 'Revivify',
    level: 3, school: '死灵系',
    classes: ['牧师', '圣武士'],
    castTime: '1个动作', range: '触碰', components: 'V, S, M（价值300gp的钻石，施法后消耗）',
    duration: '立即', conc: false,
    description: '你触碰一个在过去1分钟内死亡的生物，使其复生，生命值恢复至1点。此法术无法使因年老或因受死亡效果摧毁躯体者复生。'
  },
  {
    id: 'mass_healing_word', name: '群体疗伤之言', nameEn: 'Mass Healing Word',
    level: 3, school: '塑能系',
    classes: ['牧师'],
    castTime: '1个附赠动作', range: '60尺', components: 'V',
    duration: '立即', conc: false,
    description: '范围内最多6个生物各自恢复1d4＋感知调整值的生命值。对亡灵和构装体无效。\n升环：每提高一个环阶额外增加1d4。'
  },
  {
    id: 'dispel_magic', name: '驱散魔法', nameEn: 'Dispel Magic',
    level: 3, school: '防护系',
    classes: ['牧师', '德鲁伊', '吟游诗人', '圣武士', '游侠', '术士', '巫师', '魔契师'],
    castTime: '1个动作', range: '120尺', components: 'V, S',
    duration: '立即', conc: false,
    description: '选择一个你能看见的目标（生物、物体或魔法效果）。其上所有3环及以下法术自动终止。4环及更高需进行施法能力检定（DC=10+法术环阶），成功则终止。\n升环：使用更高环阶法术位时，自动解除的法术最大环阶相应提高。'
  },
  {
    id: 'spirit_guardians', name: '灵性卫士', nameEn: 'Spirit Guardians',
    level: 3, school: '召唤系',
    classes: ['牧师'],
    castTime: '1个动作', range: '自身（15尺半径）', components: 'V, S, M（一件圣徽）',
    duration: '专注，至多10分钟', conc: true,
    description: '你周围15尺内，敌对生物移动速度减半。当敌对生物进入该区域或在你的回合于区域内开始移动时，须通过感知豁免，失败受3d8点辐射（或死灵）伤害，成功减半。\n升环：每提高一个环阶额外增加1d8。'
  },
  {
    id: 'animate_dead', name: '制造亡灵', nameEn: 'Animate Dead',
    level: 3, school: '死灵系',
    classes: ['牧师', '巫师'],
    castTime: '1分钟', range: '10尺', components: 'V, S, M（一滴血、一片肉和骨头粉末）',
    duration: '立即', conc: false,
    description: '你对范围内一具体型为中型或小型的骸骨或尸体施法，创造亡灵仆从（骸骨→骷髅，尸体→僵尸）。每次长休后可重新施放以延续已有仆从。同时可控制的亡灵上限为4个。'
  },
  {
    id: 'speak_with_dead', name: '与死者交谈', nameEn: 'Speak with Dead',
    level: 3, school: '死灵系',
    classes: ['牧师', '吟游诗人'],
    castTime: '1个动作', range: '10尺', components: 'V, S, M（一炷燃香）',
    duration: '10分钟', conc: false,
    description: '赋予一具仍有嘴巴的尸体有限感知，允许其回答最多5个问题。尸体只能回答其生前所知之事，使用其生前能说的语言，且答案通常简短、晦涩。尸体没有义务给出友善答案。对亡灵生物无效。'
  },

  /* 可在此追加更多法术 */
];

/* ============================================================
   角色配置 (Character Config)
   修改此处即可定制角色数据，无需改动逻辑代码。
============================================================ */
const CHAR = {
  maxHp:           37,
  channelDivinity:  1,
  spellSlots:      [0, 4, 3, 2],   // index=环阶(1-3), [0]占位
  maxPrepared:      8,              // 可携带的自选法术总上限
  maxCantrips:      4,              // 已知戏法上限
  /* 生命领域法术 - 常驻备法，玩家无法移除 */
  domainSpells: {
    1: ['cure_wounds', 'bless'],
    2: ['lesser_restoration', 'spiritual_weapon'],
    3: ['beacon_of_hope', 'revivify'],
  },
};

/* 增益状态列表 */
const BUFFS = [
  '祝福术 +1d4',
  '神导术 +1d4',
  '倒地',
  '中毒',
  '目盲',
  '魅惑',
];

/* ============================================================
   localStorage 工具
============================================================ */
function save(key, val) { localStorage.setItem('dnd_' + key, JSON.stringify(val)); }
function load(key, def) {
  const v = localStorage.getItem('dnd_' + key);
  return v === null ? def : JSON.parse(v);
}

/* ============================================================
   初始化状态
============================================================ */
let state = {
  hp:            load('hp', CHAR.maxHp),
  maxHp:         load('maxHp', CHAR.maxHp),
  tempHp:        load('tempHp', 0),
  slots:         load('slots', [[], [false,false,false,false], [false,false,false], [false,false]]),
  cantripIds:    load('cantripIds',  []),   // 已知戏法 ID 列表
  preparedIds:   load('preparedIds', []),   // 自选备法 ID 列表（含环1-3，不超过 maxPrepared）
  deathSave:     load('deathSave', { success:[false,false,false], fail:[false,false,false] }),
  exhaustion:    load('exhaustion', [false, false, false, false]),
  channel:       load('channel', new Array(CHAR.channelDivinity).fill(false)),
  buffs:         load('buffs', {}),
  concentration: load('concentration', null),  // 专注中的法术 ID，或 null
};

/* ============================================================
   辅助函数
============================================================ */
const $ = id => document.getElementById(id);

function getSpell(id) { return SPELL_DB.find(s => s.id === id); }

function allDomainIds() {
  return Object.values(CHAR.domainSpells).flat();
}

function isPrepared(id) {
  return state.preparedIds.includes(id) || allDomainIds().includes(id) || state.cantripIds.includes(id);
}

/* ============================================================
   渲染：血量
============================================================ */
function hpColor(pct) {
  /* hue: 0=红 120=维 线性差内 */
  const hue = Math.round(pct * 120);
  return `hsl(${hue}, 65%, 38%)`;
}

function renderHp() {
  $('hp-current').textContent = state.hp;
  $('hp-max').textContent = state.maxHp;
  const total = state.maxHp + state.tempHp;
  const hpPct   = (state.hp       / total) * 100;
  const tempPct = (state.tempHp   / total) * 100;
  const colorPct = Math.max(0, Math.min(1, state.hp / state.maxHp));
  $('hp-bar-fill').style.width = hpPct + '%';
  $('hp-bar-fill').style.background = hpColor(colorPct);
  $('hp-bar-temp').style.width = tempPct + '%';
  $('temp-hp-val').textContent = state.tempHp;
  $('temp-hp-badge').classList.toggle('has-temp', state.tempHp > 0);
}

/* ============================================================
   渲染：法术位
============================================================ */
function renderSlots() { renderSpellPanel(); }

/* ============================================================
   渲染：法术面板（统一入口）
============================================================ */
function renderSpellPanel() {
  renderCantripList();
  renderPreparedList();
}

/* ──── 构建单行法术卡片 ──── */
function buildSpellRow(sp, isDomain, isCantrip) {
  const row = document.createElement('div');
  row.className = 'srow' + (isDomain ? ' srow-domain' : '');

  /* 环阶徽章 */
  if (!isCantrip) {
    const badge = document.createElement('span');
    badge.className = 'srow-lv-badge';
    badge.textContent = sp.level + '环';
    row.appendChild(badge);
  }

  /* 名称区域（点击展开详情） */
  const nameWrap = document.createElement('div');
  nameWrap.className = 'srow-name';
  nameWrap.innerHTML = `<span class="srow-cn cinzel">${sp.name}</span><span class="srow-en">${sp.nameEn}</span>`;
  nameWrap.title = '点击查看详情';
  nameWrap.style.cursor = 'pointer';
  nameWrap.addEventListener('click', () => showInlineDetail(sp, row));
  row.appendChild(nameWrap);

  /* 专注徽章（可点击激活专注） */
  if (sp.conc) {
    const concBtn = document.createElement('button');
    concBtn.className = 'srow-conc-btn' + (state.concentration === sp.id ? ' active' : '');
    concBtn.textContent = '专注';
    concBtn.title = '点击激活/取消专注';
    concBtn.addEventListener('click', () => toggleConc(sp.id));
    row.appendChild(concBtn);
  }

  /* 右侧操作 */
  if (isDomain) {
    const lock = document.createElement('span');
    lock.className = 'srow-domain-lock';
    lock.textContent = '⚑';
    lock.title = '领域法术，常驻备法';
    row.appendChild(lock);
  } else {
    const rm = document.createElement('button');
    rm.className = 'srow-remove-btn';
    rm.textContent = '×';
    rm.title = '移除';
    rm.addEventListener('click', () => {
      if (isCantrip) removeCantrip(sp.id);
      else removeSpell(sp.id);
    });
    row.appendChild(rm);
  }

  return row;
}

/* ──── 行内详情展开 ──── */
function showInlineDetail(sp, row) {
  /* 若已展开同一行则收起 */
  const existing = row.nextElementSibling;
  if (existing && existing.classList.contains('srow-inline-detail')) {
    existing.remove();
    return;
  }
  const detail = document.createElement('div');
  detail.className = 'srow-inline-detail';
  detail.innerHTML = buildDetailHTML(sp);
  row.after(detail);
}

function formatCastTime(t) {
  if (t.includes('附赠动作')) return `<span class="cast-icon cast-icon-bonus"></span>${t}`;
  if (t.includes('动作'))   return `<span class="cast-icon cast-icon-action"></span>${t}`;
  return t;
}

function buildDetailHTML(sp) {
  return `
    <div class="detail-meta-grid">
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">施法时间</div>
        <div class="detail-meta-val">${formatCastTime(sp.castTime)}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">施法距离</div>
        <div class="detail-meta-val">${sp.range}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">法术成分</div>
        <div class="detail-meta-val">${sp.components}</div>
      </div>
      <div class="detail-meta-box">
        <div class="detail-meta-lbl">持续时间</div>
        <div class="detail-meta-val">${sp.duration}</div>
      </div>
    </div>
    <div class="detail-minor">${sp.level === 0 ? '戏法' : sp.level + '环'} · ${sp.school}&emsp;${sp.classes.join('、')}</div>
    <div class="detail-desc">${sp.description.replace(/\n/g, '<br>')}</div>
  `;
}

/* ──── 戏法列表 ──── */
function renderCantripList() {
  const container = $('cantrips-list');
  container.innerHTML = '';
  /* 清理已不在 DB 中的遗留 ID */
  const cleaned = state.cantripIds.filter(id => getSpell(id));
  if (cleaned.length !== state.cantripIds.length) {
    state.cantripIds = cleaned;
    save('cantripIds', state.cantripIds);
  }
  state.cantripIds.forEach(id => {
    const sp = getSpell(id);
    if (sp) container.appendChild(buildSpellRow(sp, false, true));
  });
  $('cantrip-count').textContent = `${state.cantripIds.length} / ${CHAR.maxCantrips}`;
}

/* ──── 已备法术列表（自选 + 领域常驻，按环阶分组） ──── */
function renderPreparedList() {
  const container = $('prepared-list');
  container.innerHTML = '';
  /* 清理已不在 DB 中的遗留 ID */
  const cleaned = state.preparedIds.filter(id => getSpell(id));
  if (cleaned.length !== state.preparedIds.length) {
    state.preparedIds = cleaned;
    save('preparedIds', state.preparedIds);
  }
  [1, 2, 3].forEach(lv => {
    const domainAtLevel = (CHAR.domainSpells[lv] || []).map(getSpell).filter(Boolean);
    const chosenAtLevel = state.preparedIds.map(getSpell).filter(sp => sp && sp.level === lv);
    if (!domainAtLevel.length && !chosenAtLevel.length) return;

    const hdr = document.createElement('div');
    hdr.className = 'srow-lv-group-hdr';

    const lvLabel = document.createElement('span');
    lvLabel.textContent = lv + '环';
    hdr.appendChild(lvLabel);

    /* 法术位计数块 */
    const slotCount = CHAR.spellSlots[lv] || 0;
    if (slotCount > 0) {
      const gems = document.createElement('div');
      gems.className = 'slot-gems';
      for (let i = 0; i < slotCount; i++) {
        const gem = document.createElement('div');
        gem.className = 'slot-gem' + (state.slots[lv][i] ? ' used' : '');
        gem.title = lv + '环法术位 ' + (i + 1);
        gem.addEventListener('click', () => {
          state.slots[lv][i] = !state.slots[lv][i];
          save('slots', state.slots);
          renderPreparedList();
        });
        gems.appendChild(gem);
      }
      hdr.appendChild(gems);
    }

    container.appendChild(hdr);

    /* 领域法术（锁定）先展示 */
    domainAtLevel.forEach(sp => container.appendChild(buildSpellRow(sp, true, false)));
    /* 自选法术 */
    chosenAtLevel.forEach(sp => container.appendChild(buildSpellRow(sp, false, false)));
  });
  $('prepared-count').textContent = `${state.preparedIds.length} / ${CHAR.maxPrepared}`;
}

/* ──── 领域法术列表（已合并到 renderPreparedList） ──── */
function renderDomainList() {}  /* 保留空实现以兼容其他可能调用 */

/* ============================================================
   渲染：专注横条
============================================================ */
function renderConcentration() {
  const banner = $('concentration-banner');
  if (state.concentration) {
    const sp = getSpell(state.concentration);
    $('conc-spell-name').textContent = sp ? sp.name : state.concentration;
    banner.classList.add('active');
  } else {
    banner.classList.remove('active');
  }
}

function toggleConc(spellId) {
  state.concentration = (state.concentration === spellId) ? null : spellId;
  save('concentration', state.concentration);
  renderConcentration();
  renderSpellPanel();  /* 刷新专注按钮高亮状态 */
}

/* ============================================================
   渲染：死亡豁免
============================================================ */
function renderExhaustion() {
  document.querySelectorAll('.exhaust-pip').forEach((pip, i) => {
    pip.classList.toggle('active', state.exhaustion[i]);
  });
}

function renderDeathSaves() {
  ['success', 'fail'].forEach(type => {
    document.querySelectorAll(`#death-${type} .save-circle`).forEach((c, i) => {
      c.classList.toggle(type, state.deathSave[type][i]);
    });
  });
}

/* ============================================================
   渲染：引导神力
============================================================ */
function renderChannel() {
  const container = $('channel-pips');
  container.innerHTML = '';
  for (let i = 0; i < CHAR.channelDivinity; i++) {
    const pip = document.createElement('div');
    pip.className = 'resource-pip' + (state.channel[i] ? ' spent' : '');
    pip.addEventListener('click', () => {
      state.channel[i] = !state.channel[i];
      save('channel', state.channel);
      renderChannel();
    });
    container.appendChild(pip);
  }
}

/* ============================================================
   渲染：增益状态
============================================================ */
function renderBuffs() {
  const container = $('buff-chips');
  container.innerHTML = '';
  BUFFS.forEach(b => {
    const chip = document.createElement('button');
    chip.className = 'buff-chip' + (state.buffs[b] ? ' lit' : '');
    chip.textContent = b;
    chip.addEventListener('click', () => {
      state.buffs[b] = !state.buffs[b];
      save('buffs', state.buffs);
      renderBuffs();
    });
    container.appendChild(chip);
  });
}

/* ============================================================
   法术选择器 Modal
============================================================ */
let pickerMode  = 'prepared';  /* 'cantrip' | 'prepared' */
let pickerLevel = 1;

function openPicker(mode) {
  pickerMode = mode;
  pickerLevel = (mode === 'cantrip') ? 0 : 1;
  $('spell-modal-title').textContent = (mode === 'cantrip') ? '选择戏法' : '选择备法';

  /* 控制 tab 可见性 */
  document.querySelectorAll('.sp-tab').forEach(tab => {
    const lv = parseInt(tab.dataset.lv);
    if (mode === 'cantrip') {
      tab.style.display = (lv === 0) ? '' : 'none';
    } else {
      tab.style.display = (lv === 0) ? 'none' : '';
    }
    tab.classList.toggle('active', lv === pickerLevel);
  });

  renderPickerList();
  $('spell-modal').classList.remove('hidden');
}

function renderPickerList() {
  const container = $('spell-modal-list');
  container.innerHTML = '';

  const domainIds = allDomainIds();
  const spells    = SPELL_DB.filter(sp => sp.level === pickerLevel);

  spells.forEach(sp => {
    const isDomain  = domainIds.includes(sp.id);
    const isAdded   = pickerLevel === 0
      ? state.cantripIds.includes(sp.id)
      : state.preparedIds.includes(sp.id);
    const anyAdded  = isDomain || isAdded;

    const row = document.createElement('div');
    row.className = 'picker-row' + (anyAdded ? ' added' : '');

    /* 主内容行 */
    const main = document.createElement('div');
    main.className = 'picker-row-main';

    const nameArea = document.createElement('div');
    nameArea.className = 'picker-name-area';
    nameArea.innerHTML = `
      <span class="picker-spell-cn cinzel">${sp.name}</span>
      <span class="picker-spell-en">${sp.nameEn}</span>
      <span class="picker-spell-meta">${sp.school}${sp.conc ? ' · 专注' : ''} · ${sp.castTime}</span>
    `;

    /* 添加按钮 */
    const addBtn = document.createElement('button');
    addBtn.className = 'picker-add-btn';
    if (isDomain) {
      addBtn.textContent = '领域';
      addBtn.disabled = true;
    } else if (isAdded) {
      addBtn.textContent = '已备';
      addBtn.disabled = true;
    } else {
      addBtn.textContent = '＋ 备法';
      addBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (pickerLevel === 0) addCantrip(sp.id);
        else addSpell(sp.id);
      });
    }

    main.appendChild(nameArea);
    main.appendChild(addBtn);
    row.appendChild(main);

    /* 点击展开详情 */
    const detail = document.createElement('div');
    detail.className = 'picker-row-detail';
    detail.innerHTML = buildDetailHTML(sp);
    row.appendChild(detail);

    main.addEventListener('click', () => {
      row.classList.toggle('expanded');
    });

    container.appendChild(row);
  });
}

/* ──── 动作：添加/移除 ──── */
function addSpell(id) {
  if (state.preparedIds.length >= CHAR.maxPrepared) {
    alert(`已达到自选备法上限（${CHAR.maxPrepared}个）`);
    return;
  }
  if (!state.preparedIds.includes(id)) {
    state.preparedIds.push(id);
    save('preparedIds', state.preparedIds);
    renderPreparedList();
    renderPickerList();
  }
}

function removeSpell(id) {
  state.preparedIds = state.preparedIds.filter(i => i !== id);
  save('preparedIds', state.preparedIds);
  if (state.concentration === id) {
    state.concentration = null;
    save('concentration', state.concentration);
    renderConcentration();
  }
  document.querySelectorAll('.srow-inline-detail').forEach(el => el.remove());
  renderPreparedList();
}

function addCantrip(id) {
  if (state.cantripIds.length >= CHAR.maxCantrips) {
    alert(`已达到戏法上限（${CHAR.maxCantrips}个）`);
    return;
  }
  if (!state.cantripIds.includes(id)) {
    state.cantripIds.push(id);
    save('cantripIds', state.cantripIds);
    renderCantripList();
    renderPickerList();
  }
}

function removeCantrip(id) {
  state.cantripIds = state.cantripIds.filter(i => i !== id);
  save('cantripIds', state.cantripIds);
  if (state.concentration === id) {
    state.concentration = null;
    save('concentration', state.concentration);
    renderConcentration();
  }
  document.querySelectorAll('.srow-inline-detail').forEach(el => el.remove());
  renderCantripList();
}

/* ──── Modal 事件绑定 ──── */
document.querySelectorAll('.sp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    pickerLevel = parseInt(tab.dataset.lv);
    document.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderPickerList();
  });
});

$('spell-modal-close').addEventListener('click', () => $('spell-modal').classList.add('hidden'));
$('spell-modal').addEventListener('click', e => {
  if (e.target === $('spell-modal')) $('spell-modal').classList.add('hidden');
});

/* ──── 添加法术按钮 ──── */
document.querySelectorAll('.btn-spell-add').forEach(btn => {
  btn.addEventListener('click', () => openPicker(btn.dataset.mode));
});

/* ============================================================
   交互：血量编辑
============================================================ */
function startHpEdit() {
  $('hp-current').style.display = 'none';
  $('hp-input').style.display = '';
  $('hp-input').value = state.hp;
  $('hp-input').focus();
  $('hp-input').select();
}

function commitHpEdit() {
  let v = parseInt($('hp-input').value, 10);
  if (isNaN(v)) v = state.hp;
  state.hp = Math.max(0, Math.min(state.maxHp, v));
  save('hp', state.hp);
  $('hp-current').style.display = '';
  $('hp-input').style.display = 'none';
  renderHp();
}

function startMaxHpEdit() {
  $('hp-max').style.display = 'none';
  $('hp-max-input').style.display = '';
  $('hp-max-input').value = state.maxHp;
  $('hp-max-input').focus();
  $('hp-max-input').select();
}

function commitMaxHpEdit() {
  let v = parseInt($('hp-max-input').value, 10);
  if (isNaN(v) || v < 1) v = state.maxHp;
  state.maxHp = v;
  state.hp = Math.min(state.hp, state.maxHp);
  save('maxHp', state.maxHp);
  save('hp', state.hp);
  $('hp-max').style.display = '';
  $('hp-max-input').style.display = 'none';
  renderHp();
}

$('hp-current').addEventListener('click', startHpEdit);
$('hp-input').addEventListener('blur', commitHpEdit);
$('hp-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitHpEdit(); });

$('hp-max').addEventListener('click', startMaxHpEdit);
$('hp-max-input').addEventListener('blur', commitMaxHpEdit);
$('hp-max-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitMaxHpEdit(); });

function applyDamage(dmg) {
  const absorbed = Math.min(state.tempHp, dmg);
  state.tempHp -= absorbed;
  state.hp = Math.max(0, state.hp - (dmg - absorbed));
  save('hp', state.hp);
  save('tempHp', state.tempHp);
  $('temp-hp-slider').value = state.tempHp;
  $('temp-hp-slider-val').textContent = state.tempHp;
  renderHp();
}

$('hp-minus').addEventListener('click',  () => applyDamage(1));
$('hp-plus').addEventListener('click',   () => { state.hp = Math.min(state.maxHp, state.hp + 1); save('hp', state.hp); renderHp(); });
$('hp-minus5').addEventListener('click', () => applyDamage(5));
$('hp-plus5').addEventListener('click',  () => { state.hp = Math.min(state.maxHp, state.hp + 5); save('hp', state.hp); renderHp(); });

/* 血条拖拽 / 点击 */
function setHpFromBarX(clientX) {
  const track = $('hp-bar-track');
  const rect = track.getBoundingClientRect();
  const total = state.maxHp + state.tempHp;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  state.hp = Math.min(state.maxHp, Math.round(ratio * total));
  save('hp', state.hp);
  renderHp();
}

let _draggingHpBar = false;
$('hp-bar-track').addEventListener('mousedown', e => {
  _draggingHpBar = true;
  setHpFromBarX(e.clientX);
  e.preventDefault();
});
document.addEventListener('mousemove', e => { if (_draggingHpBar) setHpFromBarX(e.clientX); });
document.addEventListener('mouseup',   () => { _draggingHpBar = false; });

$('hp-bar-track').addEventListener('touchstart', e => {
  _draggingHpBar = true;
  setHpFromBarX(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', e => { if (_draggingHpBar) setHpFromBarX(e.touches[0].clientX); }, { passive: false });
document.addEventListener('touchend',  () => { _draggingHpBar = false; });

/* 临时HP滑块 */
let _tempSliderOpen = false;

$('temp-hp-badge').addEventListener('click', e => {
  e.stopPropagation();
  _tempSliderOpen = !_tempSliderOpen;
  $('temp-hp-slider-wrap').classList.toggle('hidden', !_tempSliderOpen);
  if (_tempSliderOpen) {
    $('temp-hp-slider').value = state.tempHp;
    $('temp-hp-slider-val').textContent = state.tempHp;
  }
});

$('temp-hp-slider-wrap').addEventListener('click', e => e.stopPropagation());

document.addEventListener('click', () => {
  if (_tempSliderOpen) {
    _tempSliderOpen = false;
    $('temp-hp-slider-wrap').classList.add('hidden');
  }
});

$('temp-hp-slider').addEventListener('input', e => {
  state.tempHp = parseInt(e.target.value, 10);
  $('temp-hp-slider-val').textContent = state.tempHp;
  save('tempHp', state.tempHp);
  renderHp();
});

/* ============================================================
   交互：死亡豁免
============================================================ */
document.querySelectorAll('.save-circle').forEach(c => {
  c.addEventListener('click', () => {
    const type = c.dataset.type;
    const idx  = parseInt(c.dataset.idx, 10);
    state.deathSave[type][idx] = !state.deathSave[type][idx];
    save('deathSave', state.deathSave);
    renderDeathSaves();
  });
});

/* ============================================================
   交互：力竭计数
============================================================ */
document.querySelectorAll('.exhaust-pip').forEach(pip => {
  pip.addEventListener('click', () => {
    const idx = parseInt(pip.dataset.idx, 10);
    state.exhaustion[idx] = !state.exhaustion[idx];
    save('exhaustion', state.exhaustion);
    renderExhaustion();
  });
});

/* ============================================================
   交互：断专注
============================================================ */
$('conc-break').addEventListener('click', () => {
  state.concentration = null;
  save('concentration', null);
  renderConcentration();
  renderSpellPanel();
});

/* ============================================================
   交互：一键长休
============================================================ */
$('btn-long-rest').addEventListener('click', () => {
  state.maxHp         = CHAR.maxHp;
  state.hp            = state.maxHp;
  state.tempHp        = 0;
  state.slots         = [[], new Array(CHAR.spellSlots[1]).fill(false),
                             new Array(CHAR.spellSlots[2]).fill(false),
                             new Array(CHAR.spellSlots[3]).fill(false)];
  state.channel       = new Array(CHAR.channelDivinity).fill(false);
  state.deathSave     = { success:[false,false,false], fail:[false,false,false] };
  state.concentration = null;
  state.buffs         = {};
  save('maxHp',        state.maxHp);
  save('hp',           state.hp);
  save('tempHp',       state.tempHp);
  save('slots',        state.slots);
  save('channel',      state.channel);
  save('deathSave',    state.deathSave);
  save('concentration', state.concentration);
  save('buffs',        state.buffs);
  $('temp-hp-slider').value = 0;
  $('temp-hp-slider-val').textContent = 0;
  $('temp-hp-slider-wrap').classList.add('hidden');
  renderHp();
  renderSlots();
  renderDeathSaves();
  renderChannel();
  renderConcentration();
  renderSpellPanel();
  renderBuffs();
});

/* ============================================================
   首次渲染
============================================================ */
renderHp();
renderSpellPanel();
renderConcentration();
renderDeathSaves();
renderExhaustion();
renderChannel();
renderBuffs();

/* 面板折叠按鈕 */
document.querySelectorAll('.panel').forEach(panel => {
  const title = panel.querySelector(':scope > .panel-title');
  if (!title) return;
  const btn = document.createElement('button');
  btn.className = 'panel-collapse-btn';
  btn.setAttribute('aria-label', '折叠面板');
  btn.textContent = '▾';
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const collapsed = panel.classList.toggle('collapsed');
    btn.textContent = collapsed ? '▸' : '▾';
  });
  title.appendChild(btn);
});
