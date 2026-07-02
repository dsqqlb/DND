
/* ============================================================
   状态选择器 Modal（像法术一样挑选面板上显示哪些状态）
============================================================ */
const BUFF_CATS = [
  { key: 'all',       label: '全部' },
  { key: 'condition', label: '状态' },
  { key: 'buff',      label: '增益' },
  { key: 'tactic',    label: '战术' },
];
const BUFF_CAT_LABELS = { condition: '状态', buff: '增益', tactic: '战术' };
let buffModalCat = 'all';

function openBuffPicker() {
  buffModalCat = 'all';
  $('buff-modal-title').textContent = '选择状态标签';
  renderBuffModalTabs();
  renderBuffModalList();
  $('buff-modal').classList.remove('hidden');
}

function renderBuffModalTabs() {
  const tabs = $('buff-modal-tabs');
  tabs.innerHTML = '';
  BUFF_CATS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'sp-tab' + (c.key === buffModalCat ? ' active' : '');
    btn.textContent = c.label;
    btn.addEventListener('click', () => {
      buffModalCat = c.key;
      renderBuffModalTabs();
      renderBuffModalList();
    });
    tabs.appendChild(btn);
  });
}

function renderBuffModalList() {
  const list = $('buff-modal-list');
  list.innerHTML = '';
  const base = buffModalCat === 'all' ? BUFF_DB : BUFF_DB.filter(b => b.cat === buffModalCat);
  let lastCat = null;
  base.forEach(b => {
    /* “全部”视图下按分类插入小标题 */
    if (buffModalCat === 'all' && b.cat !== lastCat) {
      lastCat = b.cat;
      const hdr = document.createElement('div');
      hdr.className = 'item-cat-header';
      hdr.textContent = BUFF_CAT_LABELS[b.cat] || b.cat;
      list.appendChild(hdr);
    }
    const picked = state.buffPicks.includes(b.id);
    const row = document.createElement('div');
    row.className = 'picker-row' + (picked ? ' added' : '');
    const main = document.createElement('div');
    main.className = 'picker-row-main';
    main.innerHTML =
      `<div class="picker-name-area">
         <span class="picker-spell-cn">${b.name}</span>
         <span class="picker-spell-meta">${b.effect}</span>
       </div>`;
    const btn = document.createElement('button');
    btn.className = 'picker-add-btn' + (picked ? ' picker-added-btn' : '');
    btn.textContent = picked ? '移除' : '＋ 添加';
    btn.addEventListener('click', () => toggleBuffPick(b.id));
    main.appendChild(btn);
    row.appendChild(main);
    list.appendChild(row);
  });
}

function toggleBuffPick(id) {
  const i = state.buffPicks.indexOf(id);
  if (i === -1) {
    state.buffPicks.push(id);
  } else {
    state.buffPicks.splice(i, 1);
    delete state.buffs[id];        /* 移除标签时一并清除其点亮状态 */
    save('buffs', state.buffs);
  }
  save('buffPicks', state.buffPicks);
  renderBuffModalList();
  renderBuffs();
}

/* 状态选择器关闭 */
$('buff-modal-close').addEventListener('click', () => $('buff-modal').classList.add('hidden'));
$('buff-modal').addEventListener('click', e => {
  if (e.target === $('buff-modal')) $('buff-modal').classList.add('hidden');
});

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
let pickerSearch = '';         /* 法术搜索关键词（中/英模糊）*/

/* 动态生成法术选择器的环阶标签：戏法 + 1环…最高环（最高环由 CHAR.spellSlots 决定）。
   这样以后在配置里解锁更高环，标签会自动出现，无需改 index.html。 */
function buildSpellTabs() {
  const wrap = $('spell-modal-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  const maxLv = CHAR.spellSlots.length - 1;
  for (let lv = 0; lv <= maxLv; lv++) {
    const btn = document.createElement('button');
    btn.className = 'sp-tab' + (lv === 1 ? ' active' : '');
    btn.dataset.lv = lv;
    btn.textContent = (lv === 0) ? '戏法' : `${lv}环`;
    btn.addEventListener('click', () => {
      pickerLevel = lv;
      pickerSearch = '';                       /* 切环阶时清空搜索 */
      const box = $('spell-modal-search');
      if (box) box.value = '';
      wrap.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderPickerList();
    });
    wrap.appendChild(btn);
  }
}

function openPicker(mode) {
  pickerMode = mode;
  pickerLevel = (mode === 'cantrip') ? 0 : 1;
  pickerSearch = '';
  const box = $('spell-modal-search');
  if (box) box.value = '';
  $('spell-modal-title').textContent = (mode === 'cantrip') ? '选择戏法' : '选择备法';

  /* 控制 tab 可见性（仅作用于法术选择器自身的标签）*/
  $('spell-modal-tabs').querySelectorAll('.sp-tab').forEach(tab => {
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
  const query = pickerSearch.trim().toLowerCase();
  let spells;
  if (query) {
    /* 搜索模式：忽略环阶标签，在当前模式的整个法术池内按中/英名模糊匹配 */
    spells = SPELL_DB.filter(sp => {
      const inMode = (pickerMode === 'cantrip') ? sp.level === 0 : sp.level >= 1;
      if (!inMode) return false;
      return (sp.name && sp.name.toLowerCase().includes(query)) ||
             (sp.nameEn && sp.nameEn.toLowerCase().includes(query));
    });
  } else {
    spells = SPELL_DB.filter(sp => sp.level === pickerLevel);
  }

  if (!spells.length) {
    const empty = document.createElement('div');
    empty.className = 'picker-empty';
    empty.textContent = query ? '没有匹配的法术。' : '该环阶暂无法术。';
    container.appendChild(empty);
    return;
  }

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
    const lvTag = query ? `${sp.level === 0 ? '戏法' : sp.level + '环'} · ` : '';
    nameArea.innerHTML = `
      <span class="picker-spell-cn cinzel">${sp.name}</span>
      <span class="picker-spell-en">${sp.nameEn}</span>
      <span class="picker-spell-meta">${lvTag}${sp.school}${sp.conc ? ' · 专注' : ''} · ${sp.castTime}</span>
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
    showDialog({
      icon: '✦',
      title: '携带已满',
      message: `已达到自选备法上限（${CHAR.maxPrepared} 个）。<br>先移除一个已备法术，再添加新的。`,
      confirmText: '知道了',
    });
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
    showDialog({
      icon: '✦',
      title: '戏法已满',
      message: `已达到戏法上限（${CHAR.maxCantrips} 个）。<br>先移除一个戏法，再添加新的。`,
      confirmText: '知道了',
    });
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
buildSpellTabs();   /* 依据 CHAR.spellSlots 生成法术选择器环阶标签（含点击绑定）*/

$('spell-modal-search').addEventListener('input', e => {
  pickerSearch = e.target.value;
  renderPickerList();
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
   升环施法环阶选择对话框
   holdCast 触发后，若法术带“升环施法效应”且有多档可用法术位，
   弹出本对话框询问：用本环，还是升环（升到几环），
   随后消耗对应环阶的法术位。
============================================================ */
function showUpcastDialog(sp, levels) {
  $('dialog-icon').textContent = '🪄';
  $('dialog-icon').style.display = '';
  $('dialog-title').textContent = '选择施法环阶';

  const opts = levels.map(lv => {
    const isBase = lv === sp.level;
    const tag = isBase ? '本环' : `升 ${lv - sp.level} 环`;
    const free = slotsFreeAt(lv);
    return `
      <button class="upcast-opt${isBase ? ' upcast-opt-base' : ''}" data-lv="${lv}">
        <span class="upcast-opt-lv cinzel">${lv} 环</span>
        <span class="upcast-opt-tag">${tag}</span>
        <span class="upcast-opt-free">剩 ${free}</span>
      </button>`;
  }).join('');

  $('dialog-message').innerHTML = `
    <div class="upcast-hint">${sp.name}（本环 ${sp.level} 环）<br>选择要消耗的法术位环阶</div>
    <div class="upcast-opts">${opts}</div>`;

  /* 只保留取消按钮，隐藏确定按钮 */
  $('dialog-confirm').style.display = 'none';
  const cancelBtn = $('dialog-cancel');
  cancelBtn.textContent = '取消';
  cancelBtn.style.display = '';
  dialogOnConfirm = null;

  $('dialog-modal').classList.remove('hidden');

  /* 绑定环阶按钮：点击后关闭对话框并按所选环阶施放 */
  $('dialog-message').querySelectorAll('.upcast-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const lv = parseInt(btn.dataset.lv, 10);
      closeDialog();
      castSpell(sp, lv);
    });
  });
}

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
  const before = state.hp;
  let v = parseInt($('hp-input').value, 10);
  if (isNaN(v)) v = state.hp;
  state.hp = Math.max(0, Math.min(state.maxHp, v));
  save('hp', state.hp);
  $('hp-current').style.display = '';
  $('hp-input').style.display = 'none';
  renderHp();
  logHpDelta(before, state.hp);
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
  if (typeof logEvent === 'function') {
    const tmp = absorbed > 0 ? `（临时HP吸收 ${absorbed}）` : '';
    logEvent('hp', '💔', `受到 ${dmg} 点伤害${tmp} · 剩 ${state.hp}/${state.maxHp}`);
  }
}

function applyHeal(amt) {
  const before = state.hp;
  state.hp = Math.min(state.maxHp, state.hp + amt);
  save('hp', state.hp);
  renderHp();
  const healed = state.hp - before;
  if (healed > 0 && typeof logEvent === 'function') {
    logEvent('hp', '❤', `恢复 ${healed} 点生命 · ${state.hp}/${state.maxHp}`);
  }
}

$('hp-minus').addEventListener('click',  () => applyDamage(1));
$('hp-plus').addEventListener('click',   () => applyHeal(1));
$('hp-minus5').addEventListener('click', () => applyDamage(5));
$('hp-plus5').addEventListener('click',  () => applyHeal(5));

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
let _hpBeforeDrag = 0;

/* 直接设定血量（拖拽血条 / 手输数值）后，把净变化记进日志（避免过程中刷屏）*/
function logHpDelta(before, after) {
  const d = after - before;
  if (!d || typeof logEvent !== 'function') return;
  if (d < 0) logEvent('hp', '💔', `失去 ${-d} 点生命 · 剩 ${after}/${state.maxHp}`);
  else       logEvent('hp', '❤', `恢复 ${d} 点生命 · ${after}/${state.maxHp}`);
}

$('hp-bar-track').addEventListener('mousedown', e => {
  _draggingHpBar = true;
  _hpBeforeDrag = state.hp;
  setHpFromBarX(e.clientX);
  e.preventDefault();
});
document.addEventListener('mousemove', e => { if (_draggingHpBar) setHpFromBarX(e.clientX); });
document.addEventListener('mouseup',   () => { if (_draggingHpBar) { _draggingHpBar = false; logHpDelta(_hpBeforeDrag, state.hp); } });

$('hp-bar-track').addEventListener('touchstart', e => {
  _draggingHpBar = true;
  _hpBeforeDrag = state.hp;
  setHpFromBarX(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });
document.addEventListener('touchmove', e => { if (_draggingHpBar) setHpFromBarX(e.touches[0].clientX); }, { passive: false });
document.addEventListener('touchend',  () => { if (_draggingHpBar) { _draggingHpBar = false; logHpDelta(_hpBeforeDrag, state.hp); } });

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

