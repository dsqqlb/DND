
/* ============================================================
   角色配置在线编辑器
   ------------------------------------------------------------
   character.js 里的 CHAR 是「出厂默认值」。本编辑器把你改过的字段
   存进 dnd_charConfig 覆盖层（见 state.js 的 applyCharOverlay），
   保存后刷新页面即生效——等级/属性/AC/法术位等都能在 app 里改，
   iPad 上也不用碰代码。覆盖层走 dnd_ 前缀，自动进「全数据备份」。

   说明：「生命值上限（长休恢复到此值）」在此编辑，存 charConfig 覆盖层（= CHAR.maxHp），
   是长休恢复目标；它与战斗页点数字改的"当前上限"(dnd_maxHp) 解耦——改这里不影响
   战斗页当前值，长休时才恢复到此值。「当前 HP / 经验值」仍直接点卡面数字改（dnd_hp / dnd_xp）。
============================================================ */
(function () {

  const ABI = { str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力' };

  /* 字段规格：type = text | int | select | slots；key 支持 abilities.xxx 嵌套 */
  const GROUPS = [
    {
      title: '身份',
      items: [
        { key: 'name',      label: '角色名', type: 'text' },
        { key: 'race',      label: '种族',   type: 'text' },
        { key: 'className', label: '职业',   type: 'text' },
        { key: 'subclass',  label: '子职',   type: 'text' },
        { key: 'level',     label: '等级',   type: 'int', min: 1, max: 20 },
        { key: 'alignment', label: '阵营',   type: 'text' },
        { key: 'languages', label: '语言',   type: 'text' },
      ],
    },
    {
      title: '六维属性',
      items: [
        { key: 'abilities.str', label: '力量', type: 'int', min: 1, max: 30 },
        { key: 'abilities.dex', label: '敏捷', type: 'int', min: 1, max: 30 },
        { key: 'abilities.con', label: '体质', type: 'int', min: 1, max: 30 },
        { key: 'abilities.int', label: '智力', type: 'int', min: 1, max: 30 },
        { key: 'abilities.wis', label: '感知', type: 'int', min: 1, max: 30 },
        { key: 'abilities.cha', label: '魅力', type: 'int', min: 1, max: 30 },
      ],
    },
    {
      title: '豁免熟练',
      items: [
        { key: 'saveProfs', label: '熟练的豁免', type: 'saves' },
      ],
    },
    {
      title: '施法 & 资源',
      items: [
        { key: 'spellAbility',        label: '施法关键属性', type: 'select',
          options: Object.keys(ABI).map(k => [k, ABI[k]]) },
        { key: 'maxCantrips',         label: '戏法上限',     type: 'int', min: 0, max: 20 },
        { key: 'maxPrepared',         label: '备法上限',     type: 'int', min: 0, max: 40 },
        { key: 'channelDivinity',     label: '引导神力次数', type: 'int', min: 0, max: 10 },
        { key: 'channelHealPerLevel', label: '生命维持每级系数', type: 'int', min: 0, max: 20 },
        { key: 'spellSlots',          label: '各环法术位（逗号分隔，从 0 环/戏法起）', type: 'slots' },
      ],
    },
    {
      title: '战斗',
      items: [
        /* 长休恢复目标 = CHAR.maxHp（存 charConfig 覆盖层）。与战斗页点数字改的
           "当前上限"(dnd_maxHp) 解耦：改这里不动战斗页当前值，长休时才恢复到此值。*/
        { key: 'maxHp',      label: '生命值上限（长休恢复到此值）', type: 'int', min: 1, max: 999 },
        { key: 'ac',         label: '防御等级 AC', type: 'int', min: 0, max: 40 },
        { key: 'speed',      label: '移动速度（尺）', type: 'int', min: 0, max: 120 },
        { key: 'tempHpMax',  label: '临时HP滑条上限', type: 'int', min: 0, max: 100 },
        { key: 'hitDiceMax', label: '生命骰个数', type: 'int', min: 0, max: 30 },
      ],
    },
    {
      title: '专长',
      items: [
        { key: 'feats', label: '拥有专长', type: 'feats' },
      ],
    },
  ];

  const fieldId = key => 'cfg_' + key.replace('.', '_');

  function getCharVal(key) {
    if (key.indexOf('.') >= 0) {
      const [a, b] = key.split('.');
      return CHAR[a] ? CHAR[a][b] : undefined;
    }
    return CHAR[key];
  }

  function setOverlay(o, key, val) {
    if (key.indexOf('.') >= 0) {
      const [a, b] = key.split('.');
      o[a] = o[a] || {};
      o[a][b] = val;
    } else {
      o[key] = val;
    }
  }

  const clamp = (v, min, max) => {
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    return v;
  };

  /* ──── 构建表单 ──── */
  function buildForm() {
    const body = $('charcfg-body');
    body.innerHTML = '';

    GROUPS.forEach(g => {
      const sec = document.createElement('div');
      sec.className = 'charcfg-group';

      const hdr = document.createElement('div');
      hdr.className = 'charcfg-group-title cinzel';
      hdr.textContent = g.title;
      sec.appendChild(hdr);

      g.items.forEach(f => {
        const row = document.createElement('label');
        row.className = 'charcfg-row';

        const lbl = document.createElement('span');
        lbl.className = 'charcfg-label';
        lbl.textContent = f.label;
        row.appendChild(lbl);

        let input;
        const cur = getCharVal(f.key);

        if (f.type === 'select') {
          input = document.createElement('select');
          f.options.forEach(([val, text]) => {
            const opt = document.createElement('option');
            opt.value = val; opt.textContent = text;
            input.appendChild(opt);
          });
          input.value = cur;
        } else if (f.type === 'slots') {
          input = document.createElement('input');
          input.type = 'text';
          input.value = Array.isArray(cur) ? cur.join(', ') : '';
          input.placeholder = '0, 4, 3, 2';
        } else if (f.type === 'feats') {
          input = document.createElement('div');
          const have = Array.isArray(cur) ? cur : [];
          const db = (typeof FEAT_DB !== 'undefined') ? FEAT_DB : [];
          if (!db.length) {
            input.textContent = '（暂无可选专长，去 js/data/feats.js 添加）';
          }
          db.forEach(ft => {
            const lab = document.createElement('label');
            lab.className = 'charcfg-check';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = ft.id;
            cb.checked = have.includes(ft.id);
            lab.appendChild(cb);
            const sp = document.createElement('span');
            sp.textContent = ft.name;
            lab.appendChild(sp);
            input.appendChild(lab);
          });
        } else if (f.type === 'saves') {
          input = document.createElement('div');
          const have = Array.isArray(cur) ? cur : [];
          Object.keys(ABI).forEach(k => {
            const lab = document.createElement('label');
            lab.className = 'charcfg-check';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = k;
            cb.checked = have.includes(k);
            lab.appendChild(cb);
            const sp = document.createElement('span');
            sp.textContent = ABI[k];
            lab.appendChild(sp);
            input.appendChild(lab);
          });
        } else {
          input = document.createElement('input');
          input.type = (f.type === 'int') ? 'number' : 'text';
          if (f.type === 'int') { if (f.min != null) input.min = f.min; if (f.max != null) input.max = f.max; }
          input.value = cur != null ? cur : '';
        }

        const blockType = (f.type === 'feats' || f.type === 'saves');
        input.id = fieldId(f.key);
        input.className = blockType ? 'charcfg-feats' : 'charcfg-input';
        if (blockType) row.classList.add('charcfg-row-block');
        row.appendChild(input);
        sec.appendChild(row);
      });

      body.appendChild(sec);
    });
  }

  /* ──── 读取表单 → 覆盖层对象 ──── */
  function collectOverlay() {
    const overlay = {};
    let error = null;

    GROUPS.forEach(g => g.items.forEach(f => {
      if (error) return;
      const el = $(fieldId(f.key));
      let v;

      if (f.type === 'int') {
        v = parseInt(el.value, 10);
        if (isNaN(v)) v = getCharVal(f.key);
        v = clamp(v, f.min, f.max);
      } else if (f.type === 'slots') {
        const arr = el.value.split(/[,，\s]+/).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
        if (!arr.length) { error = '「各环法术位」至少要填一个数字，例如 0, 4, 3, 2'; return; }
        arr[0] = 0;               /* 0 环（戏法）不占法术位，恒为 0 */
        v = arr;
      } else if (f.type === 'select') {
        v = el.value;
      } else if (f.type === 'feats' || f.type === 'saves') {
        v = Array.from(el.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value);
      } else {
        v = el.value.trim();
        if (!v) v = getCharVal(f.key);   /* 文本留空则回退默认，避免空名字 */
      }

      setOverlay(overlay, f.key, v);
    }));

    return { overlay, error };
  }

  /* ──── 打开 / 关闭 ──── */
  const modal = $('charcfg-modal');

  function openEditor() {
    buildForm();
    const settings = $('settings-modal');
    if (settings) settings.classList.add('hidden');   /* 从设置弹窗进入时先收起它 */
    modal.classList.remove('hidden');
  }
  function closeEditor() { modal.classList.add('hidden'); }

  const openBtn = $('btn-open-charcfg');
  if (openBtn) openBtn.addEventListener('click', openEditor);
  $('charcfg-close').addEventListener('click', closeEditor);
  $('charcfg-cancel').addEventListener('click', closeEditor);
  modal.addEventListener('click', e => { if (e.target === modal) closeEditor(); });

  /* ──── 保存 ──── */
  $('charcfg-save').addEventListener('click', () => {
    const { overlay, error } = collectOverlay();
    if (error) {
      showDialog({ icon: '⚠', title: '填写有误', message: error, confirmText: '知道了' });
      return;
    }
    save('charConfig', overlay);
    /* 重载让 state 初始化 / reconcile / DERIVED / 全部渲染重新按新配置生效 */
    location.reload();
  });

  /* ──── 恢复默认（清除覆盖层）──── */
  $('charcfg-reset').addEventListener('click', () => {
    showDialog({
      icon: '↺', title: '恢复默认配置',
      message: '将清除你在 app 内做的角色配置修改，恢复到 character.js 的出厂默认值。<br>（不影响 HP / 经验 / 法术位使用等实时状态。）确定吗？',
      confirmText: '恢复默认', cancelText: '取消',
      onConfirm: () => {
        localStorage.removeItem('dnd_charConfig');
        location.reload();
      },
    });
  });

})();
