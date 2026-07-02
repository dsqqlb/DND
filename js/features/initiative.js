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
  if (state.active) {
    tracker.classList.remove('hidden');
    renderAll();
  }

  /* 撤销还原后，重新载入先攻状态并刷新 */
  document.addEventListener('undorestore', () => {
    state = loadState();
    updateToggleCard();
    tracker.classList.toggle('hidden', !state.active);
    renderAll();
  });
}());
