
/* 先攻记录 — 纵向平铺战斗顺序追踪器
   ------------------------------------------------------------
   左侧：全部战斗员纵向平铺（按先攻从高到低），当前行动者金色高亮。
   右侧控制列：下一个 / 上一个 / ＋战斗员。
   · 点名字 → 设为当前行动者    · 点先攻值 → 就地编辑    · ✕ → 移除
   · 下一个越过队尾自动进入下一回合
============================================================ */
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
  const list         = $('init-list');
  const roundNum     = $('init-round-num');
  const turnInd      = $('init-turn-indicator');
  const prevBtn      = $('init-prev-turn');
  const nextBtn      = $('init-next-turn');

  /* ──── 全量渲染 ──── */
  function renderAll() {
    renderList();
    roundNum.textContent = '回合 ' + state.round;
    const total = state.combatants.length;
    turnInd.textContent = total > 0 ? (state.currentIndex + 1) + ' / ' + total : '0 / 0';
    prevBtn.disabled = total === 0;
    nextBtn.disabled = total === 0;
  }

  /* ──── 纵向平铺列表 ──── */
  function renderList() {
    list.innerHTML = '';

    if (state.combatants.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'init-empty';
      empty.textContent = '尚无战斗员，点右侧“＋ 战斗员”';
      list.appendChild(empty);
      if (state.currentIndex !== 0) state.currentIndex = 0;
      return;
    }

    state.combatants.forEach((c, i) => {
      const isCurrent = (i === state.currentIndex);
      const row = document.createElement('div');
      row.className = 'init-row' + (isCurrent ? ' init-row-current' : '');

      const marker = document.createElement('span');
      marker.className = 'init-row-marker';
      marker.textContent = '▶';
      row.appendChild(marker);

      /* 名称 → 点击设为当前行动者 */
      const nameSpan = document.createElement('span');
      nameSpan.className = 'init-row-name';
      nameSpan.textContent = c.name;
      nameSpan.title = '点击设为当前行动者';
      nameSpan.addEventListener('click', () => {
        state.currentIndex = i;
        saveState();
        renderAll();
      });
      row.appendChild(nameSpan);

      /* 先攻值 → 点击就地编辑 */
      const valWrap = document.createElement('div');
      valWrap.className = 'init-row-val-wrap';

      const valSpan = document.createElement('span');
      valSpan.className = 'init-row-val cinzel';
      valSpan.textContent = c.value;
      valSpan.title = '点击编辑先攻值';

      const valInput = document.createElement('input');
      valInput.className = 'init-row-input';
      valInput.type = 'number';
      valInput.min = 0; valInput.max = 99;
      valInput.style.display = 'none';

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

      valWrap.appendChild(valSpan);
      valWrap.appendChild(valInput);
      row.appendChild(valWrap);

      /* 移除 */
      const rmBtn = document.createElement('button');
      rmBtn.className = 'init-row-remove';
      rmBtn.textContent = '✕';
      rmBtn.title = '移除此战斗员';
      rmBtn.addEventListener('click', () => removeCombatant(c));
      row.appendChild(rmBtn);

      list.appendChild(row);
    });
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

  /* ──── 添加 / 移除 ──── */
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

  function removeCombatant(c) {
    const idx = state.combatants.indexOf(c);
    if (idx === -1) return;
    state.combatants.splice(idx, 1);
    if (state.combatants.length === 0) {
      state.currentIndex = 0;
      state.round = 1;
    } else if (state.currentIndex >= state.combatants.length) {
      state.currentIndex = state.combatants.length - 1;
    }
    saveState();
    renderAll();
  }

  /* ──── 切换回合 ──── */
  function nextTurn() {
    if (state.combatants.length === 0) return;
    if (state.currentIndex >= state.combatants.length - 1) {
      state.currentIndex = 0;
      state.round++;
      if (typeof logEvent === 'function') logEvent('combat', '⚔', `进入第 ${state.round} 回合`);
      document.dispatchEvent(new CustomEvent('roundadvance', { detail: { round: state.round } }));
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

  /* ──── 导航按钮 ──── */
  nextBtn.addEventListener('click', nextTurn);
  prevBtn.addEventListener('click', prevTurn);

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
    if (typeof logEvent === 'function') logEvent('combat', '⚔', state.active ? '进入战斗' : '结束战斗');
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
  if (state.active) tracker.classList.remove('hidden');
  renderAll();

  /* 撤销还原后重载 */
  document.addEventListener('undorestore', () => {
    state = loadState();
    updateToggleCard();
    tracker.classList.toggle('hidden', !state.active);
    renderAll();
  });
}());
