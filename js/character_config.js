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

/* 状态列表 */
const BUFFS = [
  '祝福术 +1d4',
  '神导术 +1d4',
  '倒地',
  '中毒',
  '目盲',
  '魅惑',
];
