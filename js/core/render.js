/* ============================================================
   渲染：角色卡静态信息（全部由 CHAR 配置驱动）
============================================================ */
function renderCharSheet() {
  /* 身份：名字 + 副标题 */
  $('char-name').textContent = CHAR.name;
  $('char-subtitle').textContent =
    `${CHAR.subclass} · ${CHAR.className} · ${CHAR.level}级 · ${CHAR.race}`;

  /* 六维属性：得分 + 自动计算的调整值 */
  $('header-stats').innerHTML = ABILITY_META.map(a => {
    const score = CHAR.abilities[a.key];
    return `
      <div class="cast-stat-box">
        <div class="cast-stat-lbl">${a.label}</div>
        <div class="cast-stat-num cinzel">${score}</div>
        <div class="ability-mod cinzel">${signed(abilityMod(score))}</div>
      </div>`;
  }).join('');

  /* 核心状态行：AC / 移动速度 / 先攻 / 熟练加值 */
  $('core-stats-row').innerHTML = `
    <div class="stat-box"><div class="stat-num cinzel">${CHAR.ac}</div><div class="stat-lbl">防御等级 AC</div></div>
    <div class="stat-box"><div class="stat-num cinzel">${CHAR.speed}</div><div class="stat-lbl">移动速度 ft</div></div>
    <div class="stat-box"><div class="stat-num cinzel">${signed(DERIVED.initiative)}</div><div class="stat-lbl">先攻</div></div>
    <div class="stat-box"><div class="stat-num cinzel">${signed(DERIVED.prof)}</div><div class="stat-lbl">熟练加值</div></div>`;

  /* 施法核心属性：法术豁免DC / 法术攻击加成 / 施法属性调整值 */
  $('cast-core-stats').innerHTML = `
    <div class="cast-stat-box"><div class="cast-stat-num cinzel">${DERIVED.spellSaveDC}</div><div class="cast-stat-lbl">法术豁免 DC</div></div>
    <div class="cast-stat-box"><div class="cast-stat-num cinzel">${signed(DERIVED.spellAttack)}</div><div class="cast-stat-lbl">法术攻击加成</div></div>
    <div class="cast-stat-box"><div class="cast-stat-num cinzel">${signed(DERIVED.spellMod)}</div><div class="cast-stat-lbl">${ABILITY_LABEL[CHAR.spellAbility]}调整值</div></div>`;

  /* 职业特性文字里的随等级变化数值 */
  const turnDc = $('cd-turn-dc');     if (turnDc)   turnDc.textContent   = DERIVED.spellSaveDC;
  const lifeHeal = $('cd-life-heal'); if (lifeHeal) lifeHeal.textContent = DERIVED.channelHeal;

  /* 角色信息：阵营 / 语言 */
  $('info-alignment').textContent = CHAR.alignment;
  $('info-languages').textContent = CHAR.languages;

  /* 临时HP滑条上限 */
  const slider = $('temp-hp-slider');
  if (slider) slider.max = CHAR.tempHpMax;
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

/* ──── 查找可用法术位：从指定环阶起向上找第一个未使用的（支持自动升环）──── */
function findCastableSlot(minLevel) {
  const maxLv = CHAR.spellSlots.length - 1;
  for (let lv = minLevel; lv <= maxLv; lv++) {
    const count = CHAR.spellSlots[lv] || 0;
    for (let i = 0; i < count; i++) {
      if (!(state.slots[lv] && state.slots[lv][i])) return { lv, i };
    }
  }
  return null;   /* 该环阶及以上都没有空余法术位 */
}

/* ──── 指定环阶的空闲法术位数量 ──── */
function slotsFreeAt(lv) {
  const count = CHAR.spellSlots[lv] || 0;
  let free = 0;
  for (let i = 0; i < count; i++) {
    if (!(state.slots[lv] && state.slots[lv][i])) free++;
  }
  return free;
}

/* ──── 从 minLevel 起、所有拥有空闲法术位的环阶（升序）──── */
function availableSlotLevels(minLevel) {
  const maxLv = CHAR.spellSlots.length - 1;
  const levels = [];
  for (let lv = minLevel; lv <= maxLv; lv++) {
    if (slotsFreeAt(lv) > 0) levels.push(lv);
  }
  return levels;
}

/* ──── 该法术是否带有“升环施法效应” ──── */
function hasUpcast(sp) {
  return sp.level > 0 && /升环施法效应/.test(sp.description || '');
}

/* ──── 长按触发入口：带升环效应且有多档可用环阶时先询问，否则直接施放 ──── */
function promptCast(sp) {
  const levels = availableSlotLevels(sp.level);
  if (!levels.length) return;   /* 无可用法术位（长按此时不会启动，双保险）*/

  /* 无升环效应，或只有一档可用环阶 → 直接按最低可用环阶施放（保留原自动升环行为）*/
  if (!hasUpcast(sp) || levels.length === 1) {
    castSpell(sp, levels[0]);
    return;
  }

  /* 带升环效应且有多档环阶可选 → 询问用本环还是升环（升到几环）*/
  showUpcastDialog(sp, levels);
}

/* ──── 施放法术：扣除指定环阶（或自动最低可用）法术位 + 记录专注 ──── */
function castSpell(sp, castLevel) {
  /* 未指定环阶时从法术本环起自动查找（兼容旧调用）*/
  const startLevel = (castLevel != null) ? castLevel : sp.level;
  const slot = findCastableSlot(startLevel);
  if (!slot) return;   /* 无可用法术位 */

  /* 扣除法术位 */
  state.slots[slot.lv][slot.i] = true;
  save('slots', state.slots);

  /* 需要专注的法术：记录专注（自动替换旧专注，符合 5e 规则）*/
  if (sp.conc) {
    state.concentration = sp.id;
    save('concentration', state.concentration);
    renderConcentration();
  }

  /* 写入冒险日志（升环时标注实际环阶）*/
  if (typeof logEvent === 'function') {
    const up = slot.lv > sp.level ? `（升至 ${slot.lv} 环）` : (sp.level > 0 ? `（${slot.lv} 环）` : '');
    logEvent('cast', '🪄', `施放 ${sp.name}${up}${sp.conc ? ' · 专注' : ''}`);
  }

  if (typeof playCastFx === 'function') playCastFx(sp, false);   /* 全屏施法特效（按学派，可关闭）*/
  renderSpellPanel();   /* 刷新法术位宝石与整行状态 */
}

/* ──── 施放戏法：不消耗法术位，直接记录（专注类戏法同样处理专注）──── */
function castCantrip(sp) {
  if (sp.conc) {
    state.concentration = sp.id;
    save('concentration', state.concentration);
    renderConcentration();
    renderSpellPanel();   /* 刷新专注按钮高亮状态 */
  }
  if (typeof logEvent === 'function') {
    logEvent('cast', '🪄', `施放 ${sp.name}（戏法）${sp.conc ? ' · 专注' : ''}`);
  }
  if (typeof playCastFx === 'function') playCastFx(sp, true);    /* 戏法用缩小版特效 */
}

/* ──── 整行长按施法交互：按住约 0.70s 施法；轻触则展开详情
        戏法（sp.level === 0）不耗法术位，永远可按住施放 ──── */
function attachRowCast(row, sp) {
  const HOLD_MS = 700;   /* 需与 CSS .srow-casting 的填充过渡时长一致 */
  let holdTimer = null;
  let pressed = false;
  let didCast = false;

  const onDown = e => {
    if (e.target.closest('button')) return;   /* 专注/移除按钮自行处理，不触发施法 */
    e.preventDefault();                        /* 阻止浏览器长按默认行为（文字选择/系统菜单）*/
    pressed = true;
    didCast = false;
    /* 戏法永远可按住施放；1 环及以上需有可用法术位才启动填充动画与施法计时 */
    const castable = (sp.level === 0) || (findCastableSlot(sp.level) != null);
    if (castable) {
      row.classList.add('srow-casting');
      holdTimer = setTimeout(() => {
        holdTimer = null;
        didCast = true;
        pressed = false;
        row.classList.remove('srow-casting');
        if (sp.level === 0) castCantrip(sp);
        else promptCast(sp);      /* 带升环效应先询问环阶，否则直接施放 */
      }, HOLD_MS);
    }
  };

  const onUp = () => {
    if (!pressed) return;
    pressed = false;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    row.classList.remove('srow-casting');
    didCast = false;
    /* 轻触不再展开详情——详情改由独立的 ▾ 按钮触发，避免和按住施法用同一热区抢触发时机 */
  };

  const onCancel = () => {
    pressed = false;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    row.classList.remove('srow-casting');
  };

  row.addEventListener('pointerdown', onDown);
  row.addEventListener('pointerup', onUp);
  row.addEventListener('pointercancel', onCancel);   /* 滚动等系统手势打断 → 取消 */
  row.addEventListener('pointerleave', onCancel);
  row.addEventListener('contextmenu', e => e.preventDefault());
}

/* ──── 构建单行法术卡片 ──── */
function buildSpellRow(sp, isDomain, isCantrip) {
  const row = document.createElement('div');
  row.className = 'srow' + (isDomain ? ' srow-domain' : '');

  /* 长按施法的金色填充层（戏法与 1 环以上法术都可按住施放）*/
  const fill = document.createElement('span');
  fill.className = 'srow-cast-fill';
  row.appendChild(fill);

  /* 环阶徽章 */
  if (!isCantrip) {
    const badge = document.createElement('span');
    badge.className = 'srow-lv-badge';
    badge.textContent = sp.level + '环';
    row.appendChild(badge);
  }

  /* 领域旗标：纯提示（常驻备法、无法移除），放在环阶徽章与名称之间，不是可点按钮 */
  if (isDomain) {
    const lock = document.createElement('span');
    lock.className = 'srow-domain-lock';
    lock.textContent = '⚑';
    lock.title = '领域法术，常驻备法';
    row.appendChild(lock);
  }

  /* 名称区域（移除法术改由“＋选择”法术选择器完成，行上不再放 × / 专注按钮）*/
  const nameWrap = document.createElement('div');
  nameWrap.className = 'srow-name';
  nameWrap.innerHTML = `<span class="srow-cn cinzel">${sp.name}</span><span class="srow-en">${sp.nameEn}</span>`;
  nameWrap.title = '按住施法';
  row.appendChild(nameWrap);

  /* 详情展开按钮：贴满行高的竖条，固定在最右侧，单击立即触发，不与“按住施法”争抢同一手势时机 */
  const detailBtn = document.createElement('button');
  detailBtn.className = 'srow-detail-btn';
  detailBtn.title = '查看详情';
  const detailArrow = document.createElement('span');
  detailArrow.className = 'srow-detail-arrow';
  detailArrow.textContent = '▾';
  detailBtn.appendChild(detailArrow);
  detailBtn.addEventListener('click', e => {
    e.stopPropagation();
    showInlineDetail(sp, row);
    detailBtn.classList.toggle('open');
  });
  row.appendChild(detailBtn);

  /* 挂载整行长按施法交互（戏法与 1 环以上法术一致）*/
  row.style.cursor = 'pointer';
  attachRowCast(row, sp);

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
  /* 按环阶分组，环数由 CHAR.spellSlots 决定（1 环到最高环）*/
  const maxLv = CHAR.spellSlots.length - 1;
  Array.from({ length: maxLv }, (_, i) => i + 1).forEach(lv => {
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
  const started = state.concentration !== spellId;
  state.concentration = started ? spellId : null;
  save('concentration', state.concentration);
  renderConcentration();
  renderSpellPanel();  /* 刷新专注按钮高亮状态 */
  if (typeof logEvent === 'function') {
    const nm = (getSpell(spellId) || {}).name || spellId;
    logEvent('cast', '🎯', started ? `开始专注 ${nm}` : `结束专注 ${nm}`);
  }
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
      if (typeof logEvent === 'function') {
        const left = CHAR.channelDivinity - state.channel.filter(Boolean).length;
        logEvent('combat', '⚡', (state.channel[i] ? '消耗引导神力' : '恢复引导神力') + `（剩 ${left}/${CHAR.channelDivinity}）`);
      }
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
  /* 只显示已选（buffPicks）的状态标签 */
  state.buffPicks.forEach(id => {
    const b = BUFF_DB.find(x => x.id === id);
    if (!b) return;   /* 跳过库中已不存在的遗留 id */
    const lit = !!state.buffs[id];
    const chip = document.createElement('div');
    chip.className = 'buff-chip' + (lit ? ' lit' : '');
    chip.title = b.effect;   /* 悬停显示效果说明 */

    /* 名称：点击切换点亮/熄灭 */
    const label = document.createElement('span');
    label.className = 'buff-chip-label';
    label.textContent = b.name;
    label.addEventListener('click', () => {
      state.buffs[id] = !state.buffs[id];
      if (!state.buffs[id]) delete state.buffDurations[id];   /* 熄灭时清除计时 */
      save('buffs', state.buffs);
      save('buffDurations', state.buffDurations);
      renderBuffs();
      if (typeof logEvent === 'function') {
        logEvent('buff', '🏷️', (state.buffs[id] ? '获得状态 ' : '解除状态 ') + b.name);
      }
    });
    chip.appendChild(label);

    /* 已点亮的状态：显示可编辑的“剩余轮数”徽标（战斗中每回合 −1）*/
    if (lit) {
      const rounds = state.buffDurations[id];
      const timer = document.createElement('span');
      timer.className = 'buff-chip-timer' + (rounds > 0 ? ' active' : '');
      timer.textContent = rounds > 0 ? `⏱${rounds}` : '⏱';
      timer.title = '设置持续轮数：战斗中每推进一回合 −1，到 0 自动结束（留空=不计时）';
      timer.addEventListener('click', e => {
        e.stopPropagation();
        editBuffRounds(id, timer);
      });
      chip.appendChild(timer);
    }

    container.appendChild(chip);
  });
  /* 末尾“＋ 选择”芯片：打开状态选择器 */
  const add = document.createElement('button');
  add.className = 'buff-chip buff-chip-add';
  add.textContent = '＋ 选择';
  add.title = '选择要显示的状态标签';
  add.addEventListener('click', openBuffPicker);
  container.appendChild(add);
}

/* ──── 编辑某个状态的剩余轮数（内联输入，回车/失焦提交）──── */
function editBuffRounds(id, timerEl) {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.max = 999;
  input.className = 'buff-chip-timer-input';
  input.value = state.buffDurations[id] || '';
  timerEl.replaceWith(input);
  input.focus();
  input.select();
  const commit = () => {
    const v = parseInt(input.value, 10);
    if (isNaN(v) || v <= 0) delete state.buffDurations[id];   /* 留空/0 = 不计时 */
    else state.buffDurations[id] = v;
    save('buffDurations', state.buffDurations);
    renderBuffs();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  commit();
    if (e.key === 'Escape') renderBuffs();
  });
}

/* ──── 回合推进：所有带计时的状态 −1 轮，到 0 自动结束 ──── */
function tickBuffDurations() {
  const dur = state.buffDurations || {};
  const expired = [];
  let changed = false;
  Object.keys(dur).forEach(id => {
    if (!state.buffs[id]) { delete dur[id]; changed = true; return; }   /* 已熄灭的清理掉 */
    if (dur[id] > 0) {
      dur[id]--;
      changed = true;
      if (dur[id] <= 0) {
        delete dur[id];
        state.buffs[id] = false;   /* 到时自动熄灭 */
        expired.push(id);
      }
    }
  });
  if (changed) {
    save('buffDurations', state.buffDurations);
    save('buffs', state.buffs);
    renderBuffs();
  }
  expired.forEach(id => {
    const b = BUFF_DB.find(x => x.id === id);
    if (b && typeof logEvent === 'function') logEvent('buff', '⌛', `${b.name} 到时结束`);
  });
}

/* 先攻推进到新回合时触发（事件由 initiative.js 派发）*/
document.addEventListener('roundadvance', tickBuffDurations);

/* ============================================================
   渲染：经验值进度条
============================================================ */
function renderXp() {
  const cur = state.xp || 0;
  const next = DERIVED.xpToNext;
  const pct = next > 0 ? Math.min(100, Math.round((cur / next) * 100)) : 0;

  $('xp-current').textContent = cur.toLocaleString();
  $('xp-next').textContent   = next === Infinity ? '—' : next.toLocaleString();
  $('xp-bar-fill').style.width = pct + '%';
  $('xp-bar-pct').textContent  = pct + '%';
}

/* ──── 编辑当前经验值 ──── */
function editXpCurrent() {
  const span = $('xp-current');
  const inp  = $('xp-input');
  span.style.display = 'none';
  inp.style.display  = '';
  inp.value = state.xp;
  inp.focus();
  inp.select();
}

function commitXpCurrent() {
  const span = $('xp-current');
  const inp  = $('xp-input');
  const before = state.xp;
  const val = parseInt(inp.value, 10);
  const after = isNaN(val) || val < 0 ? before : Math.floor(val);
  inp.style.display = 'none';
  span.style.display = '';
  if (after === before) return;
  state.xp = after;
  save('xp', state.xp);
  renderXp();
  const d = after - before;
  if (typeof logEvent === 'function') {
    logEvent('xp', '⭐', d > 0
      ? `获得 ${d} 经验值 · ${after.toLocaleString()} / ${DERIVED.xpToNext.toLocaleString()}`
      : `失去 ${-d} 经验值 · ${after.toLocaleString()} / ${DERIVED.xpToNext.toLocaleString()}`);
  }
}

/* ──── 编辑升级所需经验值 ──── */
function editXpNext() {
  const span = $('xp-next');
  const inp  = $('xp-next-input');
  span.style.display = 'none';
  inp.style.display  = '';
  inp.value = state.xpToNextManual != null ? state.xpToNextManual : DERIVED.xpToNext;
  inp.focus();
  inp.select();
}

function commitXpNext() {
  const span = $('xp-next');
  const inp  = $('xp-next-input');
  const val = parseInt(inp.value, 10);
  inp.style.display = 'none';
  span.style.display = '';
  /* 清空或无效 → 恢复为自动值 */
  const after = (isNaN(val) || val <= 0) ? null : Math.floor(val);
  state.xpToNextManual = after;
  save('xpToNextManual', state.xpToNextManual);
  renderXp();
  if (typeof logEvent === 'function') {
    const display = after != null ? after.toLocaleString() : xpForLevel(CHAR.level + 1).toLocaleString();
    logEvent('xp', '✎', `升级所需经验值设为 ${display}`);
  }
}

/* ──── 绑定 XP 交互 ──── */
$('xp-current').addEventListener('click', editXpCurrent);
$('xp-input').addEventListener('blur', commitXpCurrent);
$('xp-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitXpCurrent(); });
$('xp-next').addEventListener('click', editXpNext);
$('xp-next-input').addEventListener('blur', commitXpNext);
$('xp-next-input').addEventListener('keydown', e => { if (e.key === 'Enter') commitXpNext(); });

/* ============================================================
   渲染：熟练技能面板
============================================================ */
function renderSkills() {
  const container = $('skills-list');
  if (!container) return;
  const groups = skillsByAbility();
  container.innerHTML = '';

  groups.forEach(g => {
    const mod = abilityMod(CHAR.abilities[g.abilityKey]);

    const groupEl = document.createElement('div');
    groupEl.className = 'skills-ability-group';

    const hdr = document.createElement('div');
    hdr.className = 'skills-ability-hdr';
    hdr.innerHTML = `
      <span class="skills-ability-lbl">${g.abilityLabel}</span>
      <span class="skills-ability-mod">[${signed(mod)}]</span>`;
    groupEl.appendChild(hdr);

    const row = document.createElement('div');
    row.className = 'skills-row';

    g.skills.forEach(sk => {
      const prof = state.skillProfs.includes(sk.id);
      const total = mod + (prof ? DERIVED.prof : 0);

      const item = document.createElement('span');
      item.className = 'skill-item';
      item.dataset.id = sk.id;
      item.title = prof ? '点击取消熟练' : '点击获得熟练';

      const dot = document.createElement('span');
      dot.className = 'skill-dot' + (prof ? ' prof' : '');
      item.appendChild(dot);

      const name = document.createElement('span');
      name.className = 'skill-name';
      name.textContent = sk.name;
      item.appendChild(name);

      const bonus = document.createElement('span');
      bonus.className = 'skill-bonus';
      bonus.textContent = signed(total);
      item.appendChild(bonus);

      item.addEventListener('click', () => toggleSkill(sk.id));

      row.appendChild(item);
    });

    groupEl.appendChild(row);
    container.appendChild(groupEl);
  });
}

function toggleSkill(id) {
  const idx = state.skillProfs.indexOf(id);
  const sk = getSkill(id);
  if (!sk) return;
  if (idx >= 0) {
    state.skillProfs.splice(idx, 1);
  } else {
    state.skillProfs.push(id);
  }
  save('skillProfs', state.skillProfs);
  renderSkills();
  if (typeof logEvent === 'function') {
    logEvent('skill', '🎓', idx >= 0
      ? `取消「${sk.name}」熟练（${sk.abilityLabel}）`
      : `获得「${sk.name}」熟练（${sk.abilityLabel}）`);
  }
}
