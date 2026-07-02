/* ============================================================
   冒险日志 + 跑团计时器
   ------------------------------------------------------------
   · 以「一次跑团」为文件夹节点（session），可累积多次跑团
   · 点击「开始」新建一次跑团并计时，同时开始自动记录事件
   · 自动记录：施法 / 长短休 / 生命变化；也可手动写笔记
   · 日志数据独立导入导出（.json），与角色备份分离
============================================================ */
(function () {

  const LOG_CAP = 300;   /* 单次跑团最多保留的日志条数 */

  /* 分类：key 用于筛选与自动记录归类 */
  const LOG_CATS = [
    { key: 'all',    label: '全部' },
    { key: 'cast',   label: '施法' },
    { key: 'hp',     label: '生命' },
    { key: 'buff',   label: '状态' },
    { key: 'combat', label: '战斗' },
    { key: 'bag',    label: '物品' },
    { key: 'rest',   label: '休整' },
    { key: 'note',   label: '笔记' },
  ];

  let logFilter   = 'all';
  const expanded  = new Set();   /* 展开的跑团 id */
  let tickTimer   = null;

  /* ──── 工具 ──── */
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  /* 毫秒 → HH:MM:SS */
  function fmtDuration(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
  }

  /* epoch → M月D日 HH:MM */
  function fmtDate(t) {
    const d = new Date(t);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  /* epoch → 跑团标题：YYYY年M月D日 HH:MM:SS */
  function fmtTitle(t) {
    const d = new Date(t);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  /* epoch → HH:MM:SS */
  function fmtClock(t) {
    const d = new Date(t);
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }

  function saveSessions() {
    save('sessions', state.sessions);
    save('currentSessionId', state.currentSessionId);
  }

  function currentSession() {
    return state.sessions.find(s => s.id === state.currentSessionId) || null;
  }

  /* 某次跑团累计毫秒（计时中则加上进行中的时段） */
  function sessionElapsed(sess) {
    if (!sess || !sess.timer) return 0;
    const t = sess.timer;
    return t.base + (t.running ? Date.now() - t.startedAt : 0);
  }

  /* ============================================================
     对外接口：记录一条日志（写入当前进行中的跑团）
     其他模块通过全局 logEvent(cat, icon, text) 调用。
  ============================================================ */
  window.logEvent = function (cat, icon, text) {
    const sess = currentSession();
    if (!sess) return;   /* 没有进行中的跑团 → 不记录（开始跑团后才记录） */
    sess.entries.push({ id: uid(), t: Date.now(), cat, icon, text });
    if (sess.entries.length > LOG_CAP) sess.entries.splice(0, sess.entries.length - LOG_CAP);
    saveSessions();
    if (isLogPageVisible()) renderLog();
  };

  function isLogPageVisible() {
    const p = $('page-log');
    return p && p.classList.contains('active');
  }

  /* ============================================================
     计时器 / 跑团控制
  ============================================================ */
  function timerToggle() {
    let sess = currentSession();
    const now = Date.now();

    if (!sess) {
      /* 新建一次跑团并开始计时（标题为开始时的日期时间）*/
      sess = {
        id: uid(),
        title: fmtTitle(now),
        startedAt: now,
        endedAt: null,
        timer: { running: true, base: 0, startedAt: now },
        entries: [],
      };
      state.sessions.push(sess);
      state.currentSessionId = sess.id;
      expanded.add(sess.id);
      saveSessions();
      logEvent('timer', '▶', '开始跑团');
    } else if (sess.timer.running) {
      /* 暂停 */
      sess.timer.base += now - sess.timer.startedAt;
      sess.timer.running = false;
      sess.timer.startedAt = 0;
      logEvent('timer', '⏸', `暂停 · 已计时 ${fmtDuration(sess.timer.base)}`);
      saveSessions();
    } else {
      /* 继续 */
      sess.timer.running = true;
      sess.timer.startedAt = now;
      logEvent('timer', '▶', '继续计时');
      saveSessions();
    }
    renderTimer();
    renderLog();
    syncTick();
  }

  function timerEnd() {
    const sess = currentSession();
    if (!sess) return;
    showDialog({
      icon: '■', title: '结束本次跑团',
      message: `将结束「${sess.title}」并归档为一条跑团记录。<br>结束后不再自动记录，可随时开始新的跑团。`,
      confirmText: '结束', cancelText: '取消',
      onConfirm: () => {
        const total = sessionElapsed(sess);
        sess.timer.base = total;
        sess.timer.running = false;
        sess.timer.startedAt = 0;
        sess.endedAt = Date.now();
        logEvent('timer', '■', `结束跑团 · 时长 ${fmtDuration(total)}`);
        state.currentSessionId = null;
        saveSessions();
        renderTimer();
        renderLog();
        syncTick();
      },
    });
  }

  /* 每秒刷新计时显示（仅在有进行中的跑团且计时中时运转） */
  function syncTick() {
    const sess = currentSession();
    const running = sess && sess.timer.running;
    if (running && !tickTimer) {
      tickTimer = setInterval(() => {
        updateLiveDurations();
      }, 1000);
    } else if (!running && tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function updateLiveDurations() {
    const sess = currentSession();
    if (!sess) return;
    const txt = fmtDuration(sessionElapsed(sess));
    const disp = $('timer-display');
    if (disp) disp.textContent = txt;
    const card = document.querySelector(`.log-session[data-id="${sess.id}"] .log-session-dur`);
    if (card) card.textContent = txt;
  }

  /* ============================================================
     笔记 / 删除 / 清空
  ============================================================ */
  function addNote() {
    const input = $('log-note-input');
    const text = (input.value || '').trim();
    if (!text) return;
    if (!currentSession()) {
      showDialog({ icon: '✒', title: '先开始一次跑团', message: '笔记会记进当前这次跑团里。<br>点上方「开始」按钮开团后即可记录。', confirmText: '知道了' });
      return;
    }
    logEvent('note', '✍', text);
    input.value = '';
  }

  function deleteEntry(sessionId, entryId) {
    const sess = state.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    sess.entries = sess.entries.filter(e => e.id !== entryId);
    saveSessions();
    renderLog();
  }

  function deleteSession(sessionId) {
    const sess = state.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    showDialog({
      icon: '🗑', title: '删除这次跑团', message: `确定删除「${sess.title}」及其全部日志吗？此操作不可撤销。`,
      confirmText: '删除', cancelText: '取消',
      onConfirm: () => {
        state.sessions = state.sessions.filter(s => s.id !== sessionId);
        if (state.currentSessionId === sessionId) state.currentSessionId = null;
        expanded.delete(sessionId);
        saveSessions();
        renderTimer();
        renderLog();
        syncTick();
      },
    });
  }

  function clearAll() {
    if (!state.sessions.length) return;
    showDialog({
      icon: '🗑', title: '清空全部日志', message: '将删除<b>所有</b>跑团记录与日志，此操作不可撤销。<br>建议先「导出」备份。<br>确定清空吗？',
      confirmText: '全部清空', cancelText: '取消',
      onConfirm: () => {
        state.sessions = [];
        state.currentSessionId = null;
        expanded.clear();
        saveSessions();
        renderTimer();
        renderLog();
        syncTick();
      },
    });
  }

  /* ============================================================
     重命名跑团（结束归档后可改名，重名时提醒）
  ============================================================ */
  function showRenameDialog(sessionId) {
    const sess = state.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    $('dialog-icon').textContent = '✎';
    $('dialog-icon').style.display = '';
    $('dialog-title').textContent = '重命名跑团';
    $('dialog-message').innerHTML =
      `<input id="rename-input" class="rename-input" type="text" maxlength="40" value="${escapeHtml(sess.title)}">
       <div class="rename-hint">给这次跑团起个好记的名字。</div>`;
    $('dialog-confirm').textContent = '保存';
    $('dialog-confirm').style.display = '';
    const cancelBtn = $('dialog-cancel');
    cancelBtn.textContent = '取消';
    cancelBtn.style.display = '';
    dialogOnConfirm = () => submitRename(sessionId);
    $('dialog-modal').classList.remove('hidden');
    const inp = $('rename-input');
    inp.focus();
    inp.select();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('dialog-confirm').click(); });
  }

  function submitRename(sessionId) {
    const sess = state.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    const inp = $('rename-input');
    const name = inp ? inp.value.trim() : '';
    if (!name || name === sess.title) return;   /* 空或未改动 → 忽略 */

    /* 重名检测：存在同名的其它跑团则提醒，可选择仍然使用 */
    const dup = state.sessions.some(s => s.id !== sessionId && (s.title || '').trim() === name);
    if (dup) {
      showDialog({
        icon: '⚠', title: '已有同名跑团',
        message: `已存在名为「${escapeHtml(name)}」的跑团，确定仍用这个名字吗？`,
        confirmText: '仍然使用', cancelText: '取消',
        onConfirm: () => applyRename(sessionId, name),
      });
      return;
    }
    applyRename(sessionId, name);
  }

  function applyRename(sessionId, name) {
    const sess = state.sessions.find(s => s.id === sessionId);
    if (!sess) return;
    sess.title = name;
    saveSessions();
    renderLog();
  }

  /* ============================================================
     独立导入 / 导出（仅日志数据）
  ============================================================ */
  function exportLog() {
    if (!state.sessions.length) {
      showDialog({ icon: '⚠', title: '暂无日志', message: '还没有任何跑团记录可以导出。', confirmText: '知道了' });
      return;
    }
    const payload = {
      app: 'dnd-adventure-log',
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: state.sessions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `dnd-log-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showDialog({ icon: '⬇', title: '已导出日志', message: `已保存 ${state.sessions.length} 次跑团记录到文件。`, confirmText: '好' });
  }

  function importLog(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try { parsed = JSON.parse(reader.result); }
      catch { showDialog({ icon: '⚠', title: '导入失败', message: '文件不是有效的 JSON。', confirmText: '知道了' }); return; }

      if (!parsed || parsed.app !== 'dnd-adventure-log' || !Array.isArray(parsed.sessions)) {
        showDialog({ icon: '⚠', title: '导入失败', message: '这不是本卡的跑团日志文件。', confirmText: '知道了' });
        return;
      }

      /* 合并：按 id 追加尚不存在的跑团（累积多次跑团，不覆盖已有） */
      const existingIds = new Set(state.sessions.map(s => s.id));
      const incoming = parsed.sessions
        .filter(s => s && s.id && !existingIds.has(s.id))
        .map(s => normalizeSession(s));

      if (!incoming.length) {
        showDialog({ icon: 'ℹ', title: '无新增', message: '文件里的跑团记录都已存在，未新增内容。', confirmText: '知道了' });
        return;
      }

      showDialog({
        icon: '⬆', title: '导入跑团日志',
        message: `将新增 ${incoming.length} 次跑团记录（与现有记录合并，不覆盖）。<br>确定导入吗？`,
        confirmText: '导入', cancelText: '取消',
        onConfirm: () => {
          state.sessions = state.sessions.concat(incoming);
          state.sessions.sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0));
          saveSessions();
          renderTimer();
          renderLog();
        },
      });
    };
    reader.readAsText(file);
  }

  /* 校正导入的跑团结构，并确保其为已结束状态（不抢占当前进行中的跑团） */
  function normalizeSession(s) {
    const timer = s.timer || {};
    const base = typeof timer.base === 'number' ? timer.base : 0;
    return {
      id: s.id,
      title: s.title || '导入的跑团',
      startedAt: s.startedAt || Date.now(),
      endedAt: s.endedAt || s.startedAt || Date.now(),
      timer: { running: false, base, startedAt: 0 },
      entries: Array.isArray(s.entries) ? s.entries : [],
    };
  }

  /* ============================================================
     渲染
  ============================================================ */
  function renderTimer() {
    const sess = currentSession();
    const disp = $('timer-display');
    const toggle = $('timer-toggle');
    const endBtn = $('timer-end');
    if (!disp) return;

    disp.textContent = fmtDuration(sessionElapsed(sess));

    if (!sess) {
      toggle.textContent = '▶ 开始';
      toggle.classList.remove('timer-running');
      endBtn.style.display = 'none';
      disp.classList.remove('timer-live');
    } else {
      const running = sess.timer.running;
      toggle.textContent = running ? '⏸ 暂停' : '▶ 继续';
      toggle.classList.toggle('timer-running', running);
      endBtn.style.display = '';
      disp.classList.toggle('timer-live', running);
    }

    /* 笔记行仅在有进行中的跑团时可用 */
    const noteRow = $('log-note-row');
    if (noteRow) noteRow.classList.toggle('log-disabled', !sess);
  }

  function renderFilterTabs() {
    const wrap = $('log-filter-tabs');
    if (!wrap) return;
    wrap.innerHTML = '';
    LOG_CATS.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'sp-tab' + (c.key === logFilter ? ' active' : '');
      btn.textContent = c.label;
      btn.addEventListener('click', () => { logFilter = c.key; renderFilterTabs(); renderLog(); });
      wrap.appendChild(btn);
    });
  }

  function entryVisible(e) {
    if (logFilter === 'all') return true;
    return e.cat === logFilter;
  }

  function renderLog() {
    const list = $('log-list');
    if (!list) return;
    list.innerHTML = '';

    if (!state.sessions.length) {
      const empty = document.createElement('div');
      empty.className = 'log-empty';
      empty.textContent = '还没有跑团记录。点上方「开始」开团，就会自动记录这一场的施法、休整、生命变化。';
      list.appendChild(empty);
      return;
    }

    /* 最新的跑团排在最上 */
    const ordered = [...state.sessions].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

    ordered.forEach(sess => {
      const isCurrent = sess.id === state.currentSessionId;
      const isOpen = expanded.has(sess.id) || isCurrent;

      const card = document.createElement('div');
      card.className = 'log-session' + (isCurrent ? ' log-session-active' : '');
      card.dataset.id = sess.id;

      /* 折叠头 */
      const head = document.createElement('div');
      head.className = 'log-session-head';
      const dur = isCurrent ? fmtDuration(sessionElapsed(sess)) : fmtDuration(sess.timer ? sess.timer.base : 0);
      head.innerHTML = `
        <span class="log-session-caret">${isOpen ? '▾' : '▸'}</span>
        <span class="log-session-title cinzel">${escapeHtml(sess.title)}</span>
        ${isCurrent ? '<span class="log-session-badge">进行中</span>' : ''}
        <span class="log-session-meta">${fmtDate(sess.startedAt)} · <span class="log-session-dur">${dur}</span> · ${sess.entries.length} 条</span>
        ${isCurrent ? '' : '<button class="log-session-rename" title="重命名">✎</button>'}
        <button class="log-session-del" title="删除这次跑团">🗑</button>`;
      head.addEventListener('click', e => {
        if (e.target.closest('.log-session-del') || e.target.closest('.log-session-rename')) return;
        if (expanded.has(sess.id)) expanded.delete(sess.id); else expanded.add(sess.id);
        renderLog();
      });
      head.querySelector('.log-session-del').addEventListener('click', e => {
        e.stopPropagation();
        deleteSession(sess.id);
      });
      const renameBtn = head.querySelector('.log-session-rename');
      if (renameBtn) renameBtn.addEventListener('click', e => {
        e.stopPropagation();
        showRenameDialog(sess.id);
      });
      card.appendChild(head);

      /* 条目 */
      if (isOpen) {
        const body = document.createElement('div');
        body.className = 'log-session-body';
        const visible = sess.entries.filter(entryVisible);
        if (!visible.length) {
          const none = document.createElement('div');
          none.className = 'log-entry-none';
          none.textContent = sess.entries.length ? '该分类下暂无记录。' : '这次跑团还没有记录。';
          body.appendChild(none);
        } else {
          /* 最新条目在上 */
          [...visible].reverse().forEach(en => {
            const row = document.createElement('div');
            row.className = 'log-entry log-entry-' + en.cat;
            row.innerHTML = `
              <span class="log-entry-icon">${en.icon || '·'}</span>
              <span class="log-entry-text">${escapeHtml(en.text)}</span>
              <span class="log-entry-time">${fmtClock(en.t)}</span>
              <button class="log-entry-del" title="删除此条">✕</button>`;
            row.querySelector('.log-entry-del').addEventListener('click', () => deleteEntry(sess.id, en.id));
            body.appendChild(row);
          });
        }
        card.appendChild(body);
      }

      list.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* 暴露给 main.js 首次渲染使用 */
  window.renderLog = renderLog;
  window.renderTimer = renderTimer;

  /* ============================================================
     事件绑定 + 初始化
  ============================================================ */
  $('timer-toggle').addEventListener('click', timerToggle);
  $('timer-end').addEventListener('click', timerEnd);

  $('log-note-add').addEventListener('click', addNote);
  $('log-note-input').addEventListener('keydown', e => { if (e.key === 'Enter') addNote(); });

  $('btn-log-clear').addEventListener('click', clearAll);
  $('btn-log-export').addEventListener('click', exportLog);
  $('btn-log-import').addEventListener('click', () => $('log-import-file').click());
  $('log-import-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importLog(file);
    e.target.value = '';
  });

  /* 切到日志页时刷新（可能有在别的页产生的自动记录尚未渲染）*/
  const logTabBtn = document.querySelector('.tab-btn[data-page="page-log"]');
  if (logTabBtn) logTabBtn.addEventListener('click', () => { renderTimer(); renderLog(); syncTick(); });

  renderFilterTabs();
  renderTimer();
  renderLog();
  syncTick();   /* 若刷新前正计时，恢复滴答 */

})();
