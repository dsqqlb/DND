/* ============================================================
   主题切换 —— 弹出式面板
   ------------------------------------------------------------
   每套主题只是覆盖 :root 那套 CSS 变量（配色）。切换即给
   <html> 设置 data-theme，并存进 localStorage(dnd_theme)。
   想加新主题：① 在下面 THEMES 里加一项（id/name/预览色点）；
              ② 在 character_sheet.css 里加对应的 [data-theme="id"] 变量块。
   （id = 'violet' 是默认，无需 CSS 块，直接用 :root 的值。）
============================================================ */
(function () {

  const THEMES = [
    { id: 'violet',  name: '银灰紫', dots: ['#1a1a1a', '#e2a3ff', '#c8c8c8'] },
    { id: 'amber',   name: '琥珀金', dots: ['#1a160f', '#e0a852', '#d8c088'] },
    { id: 'blood',   name: '赤红',   dots: ['#1a1212', '#e06a6a', '#d0a0a0'] },
    { id: 'emerald', name: '翡翠',   dots: ['#121a16', '#5ac08a', '#9fcbb2'] },
    { id: 'azure',   name: '霜蓝',   dots: ['#12171a', '#6aa8e0', '#a6c4e0'] },
    { id: 'ivory',   name: '羊皮纸', dots: ['#f5f0eb', '#6c3eb8', '#444444'] },
  ];
  const DEFAULT_THEME = 'violet';

  function currentTheme() {
    return load('theme', DEFAULT_THEME);
  }

  function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    save('theme', id);
    renderThemeGrid();   /* 刷新选中标记 */
  }

  function renderThemeGrid() {
    const grid = $('theme-grid');
    if (!grid) return;
    const active = currentTheme();
    grid.innerHTML = '';
    THEMES.forEach(t => {
      const card = document.createElement('button');
      card.className = 'theme-card' + (t.id === active ? ' active' : '');
      card.innerHTML = `
        <span class="theme-dots">${t.dots.map(c => `<span class="theme-dot" style="background:${c}"></span>`).join('')}</span>
        <span class="theme-name">${t.name}</span>
        <span class="theme-check">✓</span>`;
      card.addEventListener('click', () => applyTheme(t.id));
      grid.appendChild(card);
    });
  }

  /* ──── 事件绑定 ──── */
  $('btn-theme').addEventListener('click', () => {
    renderThemeGrid();
    $('theme-modal').classList.remove('hidden');
  });
  $('theme-close').addEventListener('click', () => $('theme-modal').classList.add('hidden'));
  $('theme-modal').addEventListener('click', e => {
    if (e.target === $('theme-modal')) $('theme-modal').classList.add('hidden');
  });

  /* 初始化：确保 <html> 上有 data-theme（head 内联脚本可能已设置）*/
  document.documentElement.dataset.theme = currentTheme();
  renderThemeGrid();

})();
