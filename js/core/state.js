/* ============================================================
   localStorage 工具
   ------------------------------------------------------------
   save() 包了 try/catch：隐私模式下 localStorage 被禁用，或存储
   配额写满时，setItem 会抛异常——不处理的话会“静默丢数据”，你
   毫无察觉。这里改成：失败就弹一次提示，告诉你去导出备份 + 清理。
============================================================ */
let _saveWarned = false;   /* 同一会话内只提示一次，避免连续操作时反复打断 */

function save(key, val) {
  try {
    localStorage.setItem('dnd_' + key, JSON.stringify(val));
  } catch (err) {
    console.error('[save] 写入 localStorage 失败：', key, err);
    if (!_saveWarned) {
      _saveWarned = true;
      if (typeof showDialog === 'function') {
        showDialog({
          icon: '⚠', title: '存储失败',
          message: '数据未能保存到本地（可能是隐私模式，或存储空间已满）。<br>' +
                    '本次改动很可能<b>没有落盘</b>，建议尽快去「背包」页导出备份，并清理不需要的旧跑团日志。',
          confirmText: '知道了',
        });
      } else {
        alert('数据保存失败：存储空间可能已满或不可用，请尽快导出备份。');
      }
    }
  }
}
function load(key, def) {
  try {
    const v = localStorage.getItem('dnd_' + key);
    return v === null ? def : JSON.parse(v);
  } catch (err) {
    console.error('[load] 读取 localStorage 失败：', key, err);
    return def;
  }
}

/* ============================================================
   初始化状态
============================================================ */
let state = {
  hp:            load('hp', CHAR.maxHp),
  maxHp:         load('maxHp', CHAR.maxHp),
  tempHp:        load('tempHp', 0),
  slots:         load('slots', []),   // 法术位使用状态；形状由 reconcileState() 按 CHAR.spellSlots 对齐
  cantripIds:    load('cantripIds',  []),   // 已知戏法 ID 列表
  preparedIds:   load('preparedIds', []),   // 自选备法 ID 列表（含环1-3，不超过 maxPrepared）
  deathSave:     load('deathSave', { success:[false,false,false], fail:[false,false,false] }),
  exhaustion:    load('exhaustion', new Array(6).fill(false)),   // 力竭 6 级（5e 规则）
  channel:       load('channel', new Array(CHAR.channelDivinity).fill(false)),
  buffs:         load('buffs', {}),
  buffDurations: load('buffDurations', {}),   // 状态剩余轮数：{ buffId: rounds }；战斗中每回合 −1，到 0 自动结束
  buffPicks:     load('buffPicks', DEFAULT_BUFF_PICKS.slice()),  // 面板上显示哪些状态标签
  concentration: load('concentration', null),  // 专注中的法术 ID，或 null
  luckyDice:     load('luckyDice', 0),
  /* 冒险日志：以「一次跑团」为文件夹节点，可累积多次跑团。
     每个 session = { id, title, startedAt, endedAt, timer:{running,base,startedAt}, entries:[{id,t,cat,icon,text}] }
     日志数据独立导入导出，不随角色备份走。 */
  sessions:         load('sessions', []),
  currentSessionId: load('currentSessionId', null),  // 进行中的跑团 id，或 null
};

/* ============================================================
   存档对账 (Reconcile) —— 升级安全
   ------------------------------------------------------------
   当你在 character.js 里调整了 spellSlots（解锁更高环）或 channelDivinity，
   旧存档（localStorage）里的数组形状可能和新配置不一致。
   这里在每次载入时把 state.slots / state.channel 对齐到当前 CHAR 的形状：
   · 保留仍在范围内的“已使用”状态，不丢进度
   · 新增的环阶 / 次数自动补为“可用”
   · 超出的部分自动裁掉
   这样你只改配置就能即时生效，无需清缓存或改任何逻辑代码。
============================================================ */
function reconcileState() {
  /* 法术位：按 CHAR.spellSlots 逐环阶对齐（index 0 为戏法占位，恒为空数组）*/
  const prevSlots = Array.isArray(state.slots) ? state.slots : [];
  state.slots = CHAR.spellSlots.map((count, lv) => {
    const prev = Array.isArray(prevSlots[lv]) ? prevSlots[lv] : [];
    const arr = new Array(count).fill(false);
    for (let i = 0; i < count; i++) arr[i] = !!prev[i];   /* 保留已用/未用状态 */
    return arr;
  });
  save('slots', state.slots);

  /* 引导神力：按 CHAR.channelDivinity 对齐 */
  const prevChannel = Array.isArray(state.channel) ? state.channel : [];
  state.channel = new Array(CHAR.channelDivinity).fill(false)
    .map((_, i) => !!prevChannel[i]);
  save('channel', state.channel);
}
reconcileState();

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
   派生数值计算 (Derived Stats)
   ------------------------------------------------------------
   以下数值全部由 CHAR 按 D&D 5e 公式自动算出，配置里无需手填。
   升级时只改 character_config.js 的原始数字，这里会自动重算。
============================================================ */

/* 属性调整值 = ⌊(属性得分 − 10) / 2⌋ */
function abilityMod(score) { return Math.floor((score - 10) / 2); }

/* 熟练加值 = ⌈等级 / 4⌉ + 1
   （5e 规则：1–4级 +2，5–8级 +3，9–12级 +4，13–16级 +5，17–20级 +6） */
function profBonus(level) { return Math.ceil(level / 4) + 1; }

/* 把数值格式化为带正负号的字符串：3 → "+3"，-2 → "-2"，0 → "+0" */
function signed(n) { return (n >= 0 ? '+' : '') + n; }

/* 六大属性的中文名与展示顺序 */
const ABILITY_META = [
  { key: 'str', label: '力量' },
  { key: 'dex', label: '敏捷' },
  { key: 'con', label: '体质' },
  { key: 'int', label: '智力' },
  { key: 'wis', label: '感知' },
  { key: 'cha', label: '魅力' },
];
const ABILITY_LABEL = { str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力' };

/* 统一派生值：页面上所有“算出来的数字”都从这里取 */
const DERIVED = {
  get prof()     { return profBonus(CHAR.level); },                          // 熟练加值
  get spellMod() { return abilityMod(CHAR.abilities[CHAR.spellAbility]); },  // 施法属性调整值
  get initiative() { return abilityMod(CHAR.abilities.dex); },              // 先攻 = 敏捷调整值
  get spellSaveDC() {                                                        // 法术豁免 DC
    // 有手动覆盖则用覆盖值，否则走公式：8 + 熟练加值 + 施法属性调整值
    return CHAR.spellSaveDC != null ? CHAR.spellSaveDC : 8 + this.prof + this.spellMod;
  },
  get spellAttack() { return this.prof + this.spellMod; },                   // 法术攻击加成 = 熟练加值 + 施法属性调整值
  get channelHeal() { return CHAR.channelHealPerLevel * CHAR.level; },       // 生命维持治疗量 = 每级系数 × 等级
};

