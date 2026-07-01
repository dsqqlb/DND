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
  luckyDice:     load('luckyDice', 0),
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
  /* hue: 0=红 120=绿 线性值 */
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
    const parent = row.parentNode;
    if (parent.classList.contains('srow-glow-wrap')) {
      parent.parentNode.insertBefore(row, parent);
      parent.remove();
    } else {
      existing.remove();
      row.classList.remove('srow-active');
    }
    return;
  }
  /* 创建流光包装容器 */
  const wrap = document.createElement('div');
  wrap.className = 'srow-glow-wrap';
  row.parentNode.insertBefore(wrap, row);
  wrap.appendChild(row);
  const detail = document.createElement('div');
  detail.className = 'srow-inline-detail';
  detail.innerHTML = buildDetailHTML(sp);
  wrap.appendChild(detail);
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
  const colL = document.createElement('div'); colL.className = 'srow-col';
  const colR = document.createElement('div'); colR.className = 'srow-col';
  const wrap = document.createElement('div'); wrap.className = 'srow-2col';
  wrap.appendChild(colL); wrap.appendChild(colR); container.appendChild(wrap);
  state.cantripIds.forEach((id, i) => {
    const sp = getSpell(id);
    if (sp) (i % 2 === 0 ? colL : colR).appendChild(buildSpellRow(sp, false, true));
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

    /* 左右两栏显示 */
    const colL = document.createElement('div'); colL.className = 'srow-col';
    const colR = document.createElement('div'); colR.className = 'srow-col';
    const wrap = document.createElement('div'); wrap.className = 'srow-2col';
    wrap.appendChild(colL); wrap.appendChild(colR); container.appendChild(wrap);
    const allSpells = [
      ...domainAtLevel.map(sp => ({ sp, isDomain: true })),
      ...chosenAtLevel.map(sp => ({ sp, isDomain: false })),
    ];
    allSpells.forEach(({ sp, isDomain }, i) => {
      (i % 2 === 0 ? colL : colR).appendChild(buildSpellRow(sp, isDomain, false));
    });
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

function renderLuckyDice() {
  $('lucky-val').textContent = state.luckyDice;
  const pips = $('lucky-pips');
  pips.innerHTML = '';
  for (let i = 0; i < state.luckyDice && i < 20; i++) {
    const pip = document.createElement('div');
    pip.className = 'lucky-pip';
    pips.appendChild(pip);
  }
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

  const colL = document.createElement('div');
  colL.className = 'picker-col';
  const colR = document.createElement('div');
  colR.className = 'picker-col';
  container.appendChild(colL);
  container.appendChild(colR);

  const domainIds = allDomainIds();
  const spells    = SPELL_DB.filter(sp => sp.level === pickerLevel);

  spells.forEach((sp, i) => {
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
      addBtn.classList.add('picker-added-btn');
      addBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (pickerLevel === 0) removeCantrip(sp.id);
        else removeSpell(sp.id);
        renderPickerList();
      });
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

    (i % 2 === 0 ? colL : colR).appendChild(row);
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
  /* 力竭每次长休减一级（从末尾往前找第一个激活的清除） */
  const lastActive = [...state.exhaustion].lastIndexOf(true);
  if (lastActive !== -1) state.exhaustion[lastActive] = false;
  save('maxHp',        state.maxHp);
  save('hp',           state.hp);
  save('tempHp',       state.tempHp);
  save('slots',        state.slots);
  save('channel',      state.channel);
  save('deathSave',    state.deathSave);
  save('concentration', state.concentration);
  save('buffs',        state.buffs);
  save('exhaustion',   state.exhaustion);
  $('temp-hp-slider').value = 0;
  $('temp-hp-slider-val').textContent = 0;
  $('temp-hp-slider-wrap').classList.add('hidden');
  renderHp();
  renderSlots();
  renderDeathSaves();
  renderExhaustion();
  renderChannel();
  renderConcentration();
  renderSpellPanel();
  renderBuffs();
  document.dispatchEvent(new CustomEvent('longrest'));
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
renderLuckyDice();

/* 幸运骠子交互 */
$('lucky-minus').addEventListener('click', () => {
  if (state.luckyDice > 0) { state.luckyDice--; save('luckyDice', state.luckyDice); renderLuckyDice(); }
});
$('lucky-plus').addEventListener('click', () => {
  state.luckyDice++; save('luckyDice', state.luckyDice); renderLuckyDice();
});
$('lucky-val').addEventListener('click', () => {
  $('lucky-val').style.display = 'none';
  $('lucky-input').style.display = '';
  $('lucky-input').value = state.luckyDice;
  $('lucky-input').focus();
  $('lucky-input').select();
});
function commitLuckyEdit() {
  let v = parseInt($('lucky-input').value, 10);
  if (isNaN(v) || v < 0) v = state.luckyDice;
  state.luckyDice = v;
  save('luckyDice', state.luckyDice);
  $('lucky-val').style.display = '';
  $('lucky-input').style.display = 'none';
  renderLuckyDice();
}
$('lucky-input').addEventListener('blur', commitLuckyEdit);
$('lucky-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitLuckyEdit(); });

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

/* 底部标签翻页 */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
    save('active_page', btn.dataset.page);
  });
});
/* 全收起按钮 */
document.getElementById('btn-collapse-all').addEventListener('click', () => {
  document.querySelectorAll('.srow-glow-wrap').forEach(w => {
    const innerRow = w.querySelector('.srow');
    if (innerRow) w.parentNode.insertBefore(innerRow, w);
    w.remove();
  });
});

/* 恢复上次标签页 */
(function () {
  const lastPage = load('active_page', '');
  if (lastPage) {
    const btn  = document.querySelector(`.tab-btn[data-page="${lastPage}"]`);
    const page = document.getElementById(lastPage);
    if (btn && page) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      page.classList.add('active');
    }
  }
}());

/* 先攻记录 — 战斗顺序追踪器 */
(function () {
  const STORAGE_KEY = 'init_tracker';

  function loadState() {
    const saved = load(STORAGE_KEY, null);
    if (saved) {
      saved.combatants = saved.combatants.filter(c => c.name);
      return saved;
    }
    return { active: false, combatants: [], currentIndex: 0, round: 1 };
  }

  let state = loadState();

  function saveState() { save(STORAGE_KEY, state); }

  const toggleCard   = $('initiative-toggle-card');
  const toggleStatus = $('init-toggle-status');
  const tracker      = $('initiative-tracker');
  const list         = $('init-combatant-list');
  const roundNum     = $('init-round-num');
  const turnInd      = $('init-turn-indicator');
  const carouselDots = $('init-carousel-dots');
  const prevBtn      = $('init-prev-turn');
  const nextBtn      = $('init-next-turn');

  /* ──── 渲染全部 ──── */
  function renderAll() {
    renderList();
    roundNum.textContent = '回合 ' + state.round;
    const total = state.combatants.length;
    turnInd.textContent = total > 0 ? (state.currentIndex + 1) + ' / ' + total : '0 / 0';
    renderDots();
    slideTo(state.currentIndex, true);
    prevBtn.disabled = total <= 1;
    nextBtn.disabled = total <= 1;
  }

  /* ──── 渲染小圆点指示器 ──── */
  function renderDots() {
    carouselDots.innerHTML = '';
    state.combatants.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === state.currentIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        state.currentIndex = i;
        saveState();
        renderAll();
      });
      carouselDots.appendChild(dot);
    });
  }

  /* ──── 轮播滑动（多卡片居中） ──── */
  function slideTo(index, animate) {
    const cards = list.children;
    if (!cards.length) return;
    const track = list.parentElement;
    const trackWidth = track.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    if (!cardWidth) return;
    const gap = 14;
    const step = cardWidth + gap;
    const totalContentWidth = cards.length * cardWidth + (cards.length - 1) * gap;
    let offset;
    if (totalContentWidth <= trackWidth) {
      offset = (trackWidth - totalContentWidth) / 2;
    } else {
      offset = (trackWidth - cardWidth) / 2 - index * step;
      const maxOffset = (trackWidth - cardWidth) / 2;
      const minOffset = (trackWidth - cardWidth) / 2 - (cards.length - 1) * step;
      offset = Math.max(minOffset, Math.min(maxOffset, offset));
    }
    list.style.transition = animate ? 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
    list.style.transform = 'translateX(' + offset + 'px)';
  }

  /* ──── 渲染战斗员卡片列表 ──── */
  function renderList() {
    list.innerHTML = '';
    state.combatants.forEach((c, i) => {
      const isCurrent = (i === state.currentIndex);
      const card = document.createElement('div');
      card.className = 'init-card' + (isCurrent ? ' init-card-current' : '');

      /* —— 内层卡片体 —— */
      const inner = document.createElement('div');
      inner.className = 'init-card-inner';

      /* 头部行：▶标记 + 名称 + 先攻数值（可点编辑） */
      const head = document.createElement('div');
      head.className = 'init-card-head';

      const curMarker = document.createElement('span');
      curMarker.className = 'init-card-cur-marker';
      curMarker.textContent = isCurrent ? '▶' : '';
      curMarker.style.visibility = isCurrent ? 'visible' : 'hidden';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'init-card-name';
      nameSpan.textContent = c.name;

      head.appendChild(curMarker);
      head.appendChild(nameSpan);

      /* 数值区域（紧凑小单元，放入头部行右侧） */
      const valueRow = document.createElement('div');
      valueRow.className = 'init-card-value-row';

      const valLbl = document.createElement('span');
      valLbl.className = 'init-card-value-lbl';
      valLbl.textContent = '先攻';

      const valSpan = document.createElement('span');
      valSpan.className = 'init-card-value cinzel';
      valSpan.textContent = c.value;
      valSpan.title = '点击编辑先攻值';

      const valInput = document.createElement('input');
      valInput.className = 'init-card-input';
      valInput.type = 'number';
      valInput.min = 0;
      valInput.max = 99;
      valInput.style.display = 'none';

      /* 编辑交互 */
      valSpan.addEventListener('click', () => {
        valSpan.style.display = 'none';
        valInput.style.display = '';
        valInput.value = c.value;
        valInput.focus();
        valInput.select();
      });

      function commitVal() {
        let v = parseInt(valInput.value, 10);
        if (isNaN(v) || v < 0) v = c.value;
        c.value = v;
        sortAndLocate();
        saveState();
        renderAll();
      }

      valInput.addEventListener('blur', commitVal);
      valInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') commitVal();
        if (e.key === 'Escape') { valSpan.style.display = ''; valInput.style.display = 'none'; }
      });

      valueRow.appendChild(valLbl);
      valueRow.appendChild(valSpan);
      valueRow.appendChild(valInput);

      /* 拼装：所有元素放在同一行 */
      head.appendChild(valueRow);
      inner.appendChild(head);
      card.appendChild(inner);

      /* 移除按钮（绝对定位右上角） */
      const rmBtn = document.createElement('button');
      rmBtn.className = 'init-card-remove';
      rmBtn.textContent = '✕';
      rmBtn.title = '移除此战斗员';
      rmBtn.addEventListener('click', () => {
        const idx = state.combatants.indexOf(c);
        if (idx === -1) return;
        state.combatants.splice(idx, 1);
        if (state.combatants.length === 0) {
          state.currentIndex = 0;
          state.round = 1;
        } else if (state.currentIndex >= state.combatants.length) {
          state.currentIndex = 0;
        }
        saveState();
        renderAll();
      });
      card.appendChild(rmBtn);
      list.appendChild(card);
    });

    /* 设置卡片宽度（约 track 宽度的 55%） */
    const track = list.parentElement;
    const trackWidth = track.offsetWidth;
    if (trackWidth > 0) {
      const pw = Math.round(trackWidth * 0.55);
      Array.from(list.children).forEach(card => { card.style.width = pw + 'px'; });
    }

    /* 若列表为空则重置索引 */
    if (state.combatants.length === 0 && state.currentIndex !== 0) {
      state.currentIndex = 0;
    }
  }

  /* ──── 排序并定位当前 ──── */
  function sortAndLocate() {
    const currentId = state.combatants.length > 0 && state.currentIndex < state.combatants.length
      ? state.combatants[state.currentIndex].id : null;

    state.combatants.sort((a, b) => b.value - a.value);

    if (currentId) {
      const newIdx = state.combatants.findIndex(c => c.id === currentId);
      state.currentIndex = newIdx >= 0 ? newIdx : 0;
    } else {
      state.currentIndex = 0;
    }
  }

  /* ──── 添加战斗员 ──── */
  function addCombatant(name, value) {
    state.combatants.push({
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      value: Math.max(0, Math.min(99, value)),
    });
    sortAndLocate();
    saveState();
    renderAll();
  }

  /* ──── 切换回合 ──── */
  function nextTurn() {
    if (state.combatants.length === 0) return;
    if (state.currentIndex >= state.combatants.length - 1) {
      state.currentIndex = 0;
      state.round++;
    } else {
      state.currentIndex++;
    }
    saveState();
    renderAll();
  }

  function prevTurn() {
    if (state.combatants.length === 0) return;
    if (state.currentIndex <= 0) {
      state.currentIndex = state.combatants.length - 1;
      state.round = Math.max(1, state.round - 1);
    } else {
      state.currentIndex--;
    }
    saveState();
    renderAll();
  }

  /* ──── 添加行 ──── */
  const addBtn   = $('init-add-btn');
  const addRow   = $('init-add-row');
  const addName  = $('init-add-name');
  const addVal   = $('init-add-value');

  function showAddForm() {
    addBtn.classList.add('hidden');
    addRow.classList.remove('hidden');
    addName.value = '';
    addVal.value = '';
    addName.focus();
  }

  function hideAddForm() {
    addBtn.classList.remove('hidden');
    addRow.classList.add('hidden');
  }

  function confirmAdd() {
    const name = addName.value.trim();
    const value = parseInt(addVal.value, 10);
    if (!name) { addName.focus(); return; }
    if (isNaN(value) || value < 0) { addVal.focus(); return; }
    addCombatant(name, value);
    hideAddForm();
  }

  function cancelAdd() { hideAddForm(); }

  addBtn.addEventListener('click', showAddForm);
  $('init-add-confirm').addEventListener('click', confirmAdd);
  $('init-add-cancel').addEventListener('click', cancelAdd);
  addName.addEventListener('keydown', e => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') cancelAdd(); });
  addVal.addEventListener('keydown', e => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') cancelAdd(); });

  /* ──── 拖拽滑动 ──── */
  let dragState = null;

  function getTranslateX(el) {
    const t = el.style.transform;
    if (!t || t === 'none') return 0;
    const m = t.match(/translateX\(([-\d.]+)px\)/);
    return m ? parseFloat(m[1]) : 0;
  }

  function snapAfterDrag() {
    /* 没有拖拽过就直接跳过（避免点击交互元素后误触发 renderAll） */
    if (dragState === null) return;
    dragState = null;
    list.classList.remove('dragging');
    const cards = list.children;
    if (!cards.length) return;
    const currentOffset = getTranslateX(list);
    const track = list.parentElement;
    const trackWidth = track.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    if (!cardWidth) return;
    const gap = 14;
    const step = cardWidth + gap;
    const totalContentWidth = cards.length * cardWidth + (cards.length - 1) * gap;
    let nearestIndex;
    if (totalContentWidth <= trackWidth) {
      nearestIndex = state.currentIndex;
    } else {
      const idealCenterOffset = (trackWidth - cardWidth) / 2;
      const rawIndex = (idealCenterOffset - currentOffset) / step;
      nearestIndex = Math.round(rawIndex);
      nearestIndex = Math.max(0, Math.min(cards.length - 1, nearestIndex));
    }
    state.currentIndex = nearestIndex;
    saveState();
    renderAll();
  }

  /* Mouse */
  list.addEventListener('mousedown', e => {
    if (state.combatants.length <= 1) return;
    /* 点击可交互元素时不开始拖拽 */
    if (e.target.closest('.init-card-value, .init-card-remove, .init-card-input')) return;
    dragState = { startX: e.clientX, startOffset: getTranslateX(list) };
    list.classList.add('dragging');
    list.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragState) return;
    const deltaX = e.clientX - dragState.startX;
    list.style.transform = 'translateX(' + (dragState.startOffset + deltaX) + 'px)';
  });

  document.addEventListener('mouseup', snapAfterDrag);

  /* Touch */
  list.addEventListener('touchstart', e => {
    if (state.combatants.length <= 1) return;
    dragState = { startX: e.touches[0].clientX, startOffset: getTranslateX(list) };
    list.classList.add('dragging');
    list.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragState) return;
    const deltaX = e.touches[0].clientX - dragState.startX;
    list.style.transform = 'translateX(' + (dragState.startOffset + deltaX) + 'px)';
  }, { passive: true });

  document.addEventListener('touchend', snapAfterDrag, { passive: true });

  /* 窗口 resize 重绘 */
  window.addEventListener('resize', () => {
    if (state.active && state.combatants.length > 0) {
      renderAll();
    }
  });

  /* ──── 导航按钮 ──── */
  $('init-next-turn').addEventListener('click', nextTurn);
  $('init-prev-turn').addEventListener('click', prevTurn);

  /* ──── Toggle ──── */
  function updateToggleCard() {
    if (state.active) {
      toggleStatus.textContent = '⚔ 战斗中';
      toggleCard.classList.add('active');
    } else {
      toggleStatus.textContent = '⚔ 开始战斗';
      toggleCard.classList.remove('active');
    }
  }

  toggleCard.addEventListener('click', () => {
    state.active = !state.active;
    tracker.classList.toggle('hidden', !state.active);
    if (!state.active) {
      state.combatants.forEach(c => c.value = 0);
      state.currentIndex = 0;
      state.round = 1;
    }
    updateToggleCard();
    saveState();
    renderAll();
  });

  /* ──── 长休清空 ──── */
  document.addEventListener('longrest', () => {
    state.active = false;
    state.combatants.forEach(c => c.value = 0);
    state.currentIndex = 0;
    state.round = 1;
    updateToggleCard();
    tracker.classList.add('hidden');
    saveState();
    renderAll();
  });

  /* ──── 恢复上次状态 ──── */
  updateToggleCard();
  if (state.active) {
    tracker.classList.remove('hidden');
    renderAll();
  }
}());

/* ============================================================
   背包 & 物品管理
============================================================ */
(function () {
  // 合并旧的 equip_items / misc_items，统一存到 bag_items
  let bagItems = (() => {
    const saved = load('bag_items', null);
    if (saved !== null) {
      return saved.filter(it => !it.id.startsWith('_c')).map(it => ({ ...it, qty: it.qty ?? 1 }));
    }
    const old = [...load('equip_items', []), ...load('misc_items', [])].filter(it => !it.id.startsWith('_c'));
    const map = {};
    old.forEach(it => {
      if (map[it.id]) map[it.id].qty = (map[it.id].qty || 1) + (it.qty || 1);
      else map[it.id] = { ...it, qty: it.qty ?? 1 };
    });
    return Object.values(map);
  })();
  const currency = load('currency', { cp: 0, sp: 0, gp: 0, pp: 0 });

  const bagPresetList = $('equip-preset-list');

  /* 货币输入框 */
  ['cp', 'sp', 'gp', 'pp'].forEach(key => {
    const el = document.getElementById('cur-' + key);
    if (!el) return;
    el.value = currency[key];
    el.addEventListener('input', () => {
      currency[key] = parseInt(el.value) || 0;
      save('currency', currency);
    });
  });

  /* ── chip 构建工具 ── */
  function makeChip(name, props, onRemove) {
    const el = document.createElement('div');
    el.className = 'item-chip';
    el.innerHTML =
      `<span class="item-chip-name">${name}</span>` +
      `<span class="item-chip-props">${props}</span>` +
      `<button class="item-chip-remove">✕</button>`;
    el.querySelector('.item-chip-remove').addEventListener('click', onRemove);
    return el;
  }

  function makeQtyChip(name, qty, onDelta, onRemove) {
    const el = document.createElement('div');
    el.className = 'item-chip';
    el.innerHTML =
      `<span class="item-chip-name">${name}</span>` +
      `<span class="item-chip-fill"></span>` +
      `<span class="item-qty-row">` +
        `<button class="item-qty-btn" data-dir="-1">−</button>` +
        `<span class="item-qty-val">${qty}</span>` +
        `<button class="item-qty-btn" data-dir="1">＋</button>` +
      `</span>` +
      `<button class="item-chip-remove">✕</button>`;
    el.querySelectorAll('.item-qty-btn').forEach(btn =>
      btn.addEventListener('click', () => onDelta(+btn.dataset.dir))
    );
    el.querySelector('.item-chip-remove').addEventListener('click', onRemove);
    return el;
  }

  /* ── 物品渲染 ── */
  function renderBag() {
    bagPresetList.innerHTML = '';
    bagItems.forEach(item => {
      const db = ITEM_DB.find(d => d.id === item.id);
      if (!db) return;
      bagPresetList.appendChild(makeQtyChip(db.name, item.qty,
        delta => { item.qty = Math.max(1, item.qty + delta); save('bag_items', bagItems); renderBag(); },
        ()    => { bagItems = bagItems.filter(e => e.id !== item.id); save('bag_items', bagItems); renderBag(); }
      ));
    });
    renderWeight();
  }

  /* ── 重量统计 ── */
  function renderWeight() {
    const total = bagItems.reduce((sum, item) => {
      const db = ITEM_DB.find(d => d.id === item.id);
      return sum + (db ? db.weight * item.qty : 0);
    }, 0);
    const rounded = Math.round(total * 10) / 10;
    document.getElementById('total-weight').textContent = rounded;
  }

  /* ── 记事本初始化 ── */
  const NOTEPAD_ROWS = 20;
  function initNotepad(containerId, storageKey) {
    const container = $(containerId);
    const saved = load(storageKey, []);
    for (let i = 0; i < NOTEPAD_ROWS; i++) {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'notepad-line';
      inp.value = saved[i] || '';
      inp.addEventListener('input', () => {
        const vals = Array.from(container.querySelectorAll('.notepad-line')).map(el => el.value);
        save(storageKey, vals);
      });
      container.appendChild(inp);
    }
  }

  /* ── 物品模态框（展示全部预设物品） ── */
  const modal      = $('item-modal');
  const modalTitle = $('item-modal-title');
  const modalTabs  = $('item-modal-tabs');
  const modalList  = $('item-modal-list');
  let   modalSection  = 'equip';
  let   modalCategory = 'all';
  let   modalSearch   = '';

  const CAT_LABELS = { weapon: '武器', armor: '护甲', gear: '装备', consumable: '消耗品' };
  const ITEM_CATS  = [
    { key: 'all',        label: '全部' },
    { key: 'weapon',     label: '武器' },
    { key: 'armor',      label: '护甲' },
    { key: 'gear',       label: '装备' },
    { key: 'consumable', label: '消耗品' },
  ];

  function renderModalTabs() {
    modalTabs.innerHTML = '';
    ITEM_CATS.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'item-tab' + (cat.key === modalCategory ? ' active' : '');
      btn.textContent = cat.label;
      btn.addEventListener('click', () => {
        modalCategory = cat.key;
        renderModalTabs();
        renderModalList();
      });
      modalTabs.appendChild(btn);
    });
  }

  function renderModalList() {
    modalList.innerHTML = '';
    const query = modalSearch.toLowerCase();
    const base  = modalCategory === 'all' ? ITEM_DB : ITEM_DB.filter(it => it.category === modalCategory);
    const items = query
      ? base.filter(it => it.name.toLowerCase().includes(query) || it.nameEn.toLowerCase().includes(query))
      : base;
    let lastCat = null;
    items.forEach(item => {
      if (modalCategory === 'all' && item.category !== lastCat) {
        lastCat = item.category;
        const hdr = document.createElement('div');
        hdr.className = 'item-cat-header';
        hdr.textContent = CAT_LABELS[item.category] || item.category;
        modalList.appendChild(hdr);
      }
      const already = bagItems.some(e => e.id === item.id);
      const row     = document.createElement('div');
      row.className = 'item-row' + (already ? ' added' : '');
      row.innerHTML =
        `<div class="item-row-name">${item.name} <span class="item-name-en">${item.nameEn}</span></div>` +
        `<div class="item-row-props">${item.props}</div>`;
      if (!already) row.addEventListener('click', () => addPreset(item.id));
      modalList.appendChild(row);
    });
  }

  function addPreset(id) {
    const existing = bagItems.find(e => e.id === id);
    if (existing) { existing.qty++; }
    else { bagItems.push({ id, qty: 1 }); }
    save('bag_items', bagItems);
    renderBag();
    renderModalList();
  }

  document.querySelectorAll('.btn-item-add').forEach(btn => {
    btn.addEventListener('click', () => {
      modalCategory = 'all';
      modalSearch   = '';
      document.getElementById('item-modal-search').value = '';
      modalTitle.textContent = '选择物品';
      renderModalTabs();
      renderModalList();
      modal.classList.remove('hidden');
    });
  });

  $('item-modal-close').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  document.getElementById('item-modal-search').addEventListener('input', e => {
    modalSearch = e.target.value.trim();
    renderModalList();
  });

  save('bag_items', bagItems);
  renderBag();
  initNotepad('equip-notepad', 'equip_notepad');
}());
