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
