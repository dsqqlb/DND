/* ============================================================
   模块显示开关（插件式架构）
   ------------------------------------------------------------
   卡面被拆成一个个「模块」。这里是引擎：把所有已注册模块列成勾选项
   放进「设置」弹窗，用户勾谁显示谁；选择存 dnd_modules（进备份）。
   系统本身不认识职业——只认识"模块开没开"。

   ★ 加新模块（比如给某职业做专属块）：
     1) 给该块的 DOM 加 data-module="你的id"（或用已有 id 选择器）；
     2) 往下面 MODULES 里登记一条 { id, label, group, sel }；
        整页模块用 { id, label, group, page:'page-xxx' }。
     登记后它会自动出现在设置的勾选列表里，无需改本文件其它逻辑。
   ------------------------------------------------------------
   注：核心块（HP、六维、日志页本身）不做成可关，避免误关后找不回入口
       （设置齿轮就在日志页）。
============================================================ */
(function () {
  const MODULES = [
    /* —— 战斗页 —— */
    { id: 'lucky',      label: '幸运骰',            group: '战斗页', sel: '#lucky-dice-row' },
    { id: 'statuses',   label: '状态标签',          group: '战斗页', sel: '#buff-chips' },
    { id: 'corestats',  label: 'AC / 速度 / 先攻 / 熟练', group: '战斗页', sel: '#core-stats-row' },
    { id: 'deathsaves', label: '死亡豁免',          group: '战斗页', sel: '[data-module="deathsaves"]' },
    { id: 'exhaustion', label: '力竭计数',          group: '战斗页', sel: '[data-module="exhaustion"]' },
    { id: 'castcore',   label: '施法核心属性',      group: '战斗页', sel: '[data-module="castcore"]' },
    { id: 'hitdice',    label: '生命骰',            group: '战斗页', sel: '#hitdice-row' },
    { id: 'initiative', label: '战斗 · 先攻',       group: '战斗页', sel: '#panel-combat' },

    /* —— 职业页 —— */
    { id: 'identity', label: '角色头衔',            group: '职业页', sel: '#class-char-header' },
    { id: 'abilities',label: '六维属性',            group: '职业页', sel: '#header-stats' },
    { id: 'saves',    label: '豁免检定',            group: '职业页', sel: '#saves-section' },
    { id: 'channel',  label: '职业资源 · 引导神力（牧师）', group: '职业页', sel: '#panel-class' },
    { id: 'feats',    label: '专长',                group: '职业页', sel: '#feats-container' },
    { id: 'charinfo', label: '角色信息',            group: '职业页', sel: '#panel-charinfo' },
    { id: 'skills',   label: '熟练技能',            group: '职业页', sel: '#panel-skills' },
    { id: 'xp',       label: '经验值',              group: '职业页', sel: '#panel-xp' },

    /* —— 法术页（页/标签始终保留，只隐藏内容）—— */
    { id: 'cantrips', label: '戏法',                group: '法术页', sel: '[data-module="cantrips"]' },
    { id: 'prepared', label: '已备法术',            group: '法术页', sel: '[data-module="prepared"]' },

    /* —— 背包页（页/标签始终保留，只隐藏内容）—— */
    { id: 'equip',    label: '装备 / 笔记',         group: '背包页', sel: '[data-module="equip"]' },
    { id: 'weight',   label: '负重统计',            group: '背包页', sel: '#weight-summary' },
    { id: 'currency', label: '货币',                group: '背包页', sel: '#misc-currency' },

    /* —— 日志页 —— */
    { id: 'lines', label: '台词 · 灵感',            group: '日志页', sel: '#panel-lines' },
  ];

  /* 可自动收起的容器：里面登记的模块全部隐藏时，整块（含边框/标题）一起藏起来，
     消灭"只剩标题的空盒子"。往面板加新模块时，同步更新这里的 modules 列表。*/
  const COLLAPSE = [
    { sel: '#panel-buff',      modules: ['lucky', 'statuses', 'corestats', 'deathsaves', 'exhaustion', 'castcore'] },
    { sel: '.death-saves-row', modules: ['deathsaves', 'exhaustion'] },   // 并排行：两半都关就收起
    { sel: '#panel-spell',     modules: ['cantrips', 'prepared'] },
    { sel: '#panel-equip',     modules: ['equip', 'weight', 'currency'] },
  ];

  const prefs = () => load('modules', {});
  const isOn = (p, id) => p[id] !== false;   /* 缺省 = 显示 */

  /* ──── 应用显隐 ──── */
  function apply() {
    const p = prefs();
    const on = id => isOn(p, id);

    /* 1) 单个模块显隐 */
    MODULES.forEach(m => {
      const vis = on(m.id);
      if (m.page) {
        const tab = document.querySelector('.tab-btn[data-page="' + m.page + '"]');
        if (tab) tab.style.display = vis ? '' : 'none';
        const pg = document.getElementById(m.page);
        if (!vis && pg && pg.classList.contains('active')) gotoCombat();
      } else if (m.sel) {
        document.querySelectorAll(m.sel).forEach(el => { el.style.display = vis ? '' : 'none'; });
      }
    });

    /* 2) 空容器自动收起（面板/并排行里模块全关 → 整块隐藏）*/
    COLLAPSE.forEach(c => {
      const el = document.querySelector(c.sel);
      if (el) el.style.display = c.modules.some(on) ? '' : 'none';
    });

    /* 3) 整页塌栏：某一栏全空 → 剩下的铺满整宽，不再一边倒 */
    const combat = document.getElementById('page-combat');
    if (combat) combat.classList.toggle('combat-solo', !on('initiative'));

    const classTop = document.getElementById('class-top');
    if (classTop) {
      const leftOn  = ['identity', 'abilities', 'saves', 'channel'].some(on);
      const rightOn = ['feats', 'charinfo', 'skills'].some(on);
      classTop.classList.toggle('solo', !leftOn || !rightOn);
    }
  }

  /* 关掉的正好是当前页时，回落到战斗页 */
  function gotoCombat() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const tab = document.querySelector('.tab-btn[data-page="page-combat"]');
    const pg  = document.getElementById('page-combat');
    if (tab) tab.classList.add('active');
    if (pg)  pg.classList.add('active');
    if (typeof save === 'function') save('active_page', 'page-combat');
  }

  /* ──── 大弹窗里的勾选列表（按 group 分成多列）──── */
  function buildToggles() {
    const wrap = $('module-toggles');
    if (!wrap) return;
    wrap.innerHTML = '';
    const p = prefs();

    /* 按 group 收拢成列，保持首次出现顺序 */
    const cols = [];
    MODULES.forEach(m => {
      let g = cols.find(c => c.name === m.group);
      if (!g) { g = { name: m.group, items: [] }; cols.push(g); }
      g.items.push(m);
    });

    cols.forEach(g => {
      const col = document.createElement('div');
      col.className = 'module-col';

      const hdr = document.createElement('div');
      hdr.className = 'module-group-hdr';
      hdr.textContent = g.name;
      col.appendChild(hdr);

      g.items.forEach(m => {
        const lab = document.createElement('label');
        lab.className = 'module-check';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = isOn(p, m.id);
        cb.addEventListener('change', () => {
          const cur = prefs();
          cur[m.id] = cb.checked;
          save('modules', cur);
          apply();
        });
        lab.appendChild(cb);
        const sp = document.createElement('span');
        sp.textContent = m.label;
        lab.appendChild(sp);
        col.appendChild(lab);
      });

      wrap.appendChild(col);
    });
  }

  /* ──── 大弹窗开关 ──── */
  const modal   = $('modules-modal');
  const openBtn = $('btn-open-modules');
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      buildToggles();
      const s = $('settings-modal');
      if (s) s.classList.add('hidden');     /* 从设置弹窗进入时先收起它 */
      modal.classList.remove('hidden');
    });
    $('modules-close').addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  }

  buildToggles();
  apply();
})();
