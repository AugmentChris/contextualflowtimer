import { V, SC } from './tokens.js';
import { I } from './icons.js';
import { ROUTINES, PAGES } from './data.js';
import { fmt, buildRT, escHtml, escAttr } from './utils.js';
import { loadChains, saveChains } from './persistence.js';
import { chime, softChime } from './audio.js';
import { notifySessionEnd } from './notifications.js';
import { circularProgressHTML, updateProgressCircle, stageBarsHTML, updateStageBars, roundBtnHTML, playLogoStartAnimation } from './ui.js';

// ── Chain Timer State ──
const CS = {
  userChains: loadChains(),
  activeChain: null,
  running: false,
  stageIdx: 0,
  endTime: null,
  remaining: null,
  done: false,
  view: 'browse',
  editName: '',
  editStages: [{label:'', minutes:25, color:SC[0]}],
  editBuffer: false,
  editingIdx: null,
  page: 0,
  intervalId: null,
  autoCycleId: null,
  runtimeStages: [],
};

// ── Computed chain values ──
function chainComputed() {
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const stageSec = (rt[si] ? rt[si].minutes : 0) * 60;
  const totalSec = rt.reduce((a,s) => a + s.minutes*60, 0);
  const elapsedBefore = rt.slice(0,si).reduce((a,s) => a + s.minutes*60, 0);
  const stageProgress = CS.remaining !== null && stageSec > 0 ? 1 - CS.remaining/stageSec : 0;
  const globalProgress = CS.remaining !== null && totalSec > 0
    ? (elapsedBefore + (stageSec - CS.remaining)) / totalSec : 0;
  const isBuffer = rt[si] ? rt[si].isBuffer : false;
  const currentColor = isBuffer ? V.buf : (rt[si] ? rt[si].color : V.accent);
  return { stageSec, totalSec, stageProgress, globalProgress, isBuffer, currentColor };
}

// ────────────────────────────────────
// CHAIN TIMER — HTML GENERATORS
// ────────────────────────────────────

function chainBrowseHTML() {
  const hasCustom = CS.userChains.length > 0;
  const visible = ROUTINES.slice(CS.page*8, CS.page*8+8);
  return `<div style="display:flex;flex-direction:column;gap:20px">
    ${hasCustom ? `
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">Your Chains (${CS.userChains.length}/8)</div>
          ${CS.userChains.length < 8 ? `<button id="new-chain-btn" style="background:none;border:1px dashed ${V.borderH};border-radius:8px;color:${V.textM};cursor:pointer;font-size:11px;font-family:${V.sans};padding:5px 12px;display:flex;align-items:center;gap:5px">${I.plus} New</button>` : ''}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${CS.userChains.map((c,i) => `
            <div style="display:flex;align-items:center;gap:2px">
              <button data-ci="${i}" class="uc-select" style="padding:7px 16px;border-radius:20px;border:1.5px solid ${V.border};background:rgba(255,255,255,0.02);color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">${escHtml(c.name)}</button>
              <button data-ci="${i}" class="uc-edit" aria-label="Edit ${escAttr(c.name)}" style="background:none;border:none;color:${V.textD};cursor:pointer;padding:3px;display:flex">${I.edit}</button>
              <button data-ci="${i}" class="uc-del" aria-label="Delete ${escAttr(c.name)}" style="background:none;border:none;color:${V.textD};cursor:pointer;padding:3px;display:flex">${I.trash}</button>
            </div>`).join('')}
        </div>
      </div>` : ''}
    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">Popular Daily Routines</div>
    <div id="routines-grid" class="routines-grid">
      ${visible.map((r,i) => routineCardHTML(r, CS.page*8+i)).join('')}
    </div>
    <div style="display:flex;justify-content:center;gap:6px;padding-top:4px">
      ${Array.from({length:PAGES}).map((_,i) => `
        <button class="page-dot" data-pg="${i}" aria-label="Go to routines page ${i+1}" style="width:${i===CS.page?20:6}px;height:6px;border-radius:3px;border:none;cursor:pointer;
          background:${i===CS.page?V.accent:'rgba(255,255,255,0.08)'};transition:all 0.35s cubic-bezier(0.4,0,0.2,1)"></button>`).join('')}
    </div>
    <button id="build-chain-btn" style="width:100%;padding:14px 0;border-radius:12px;border:1px dashed ${V.accent}55;background:${V.accentM};color:${V.accent};cursor:pointer;font-size:13px;font-family:${V.sans};font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
      ${I.plus} Build Custom Chain
    </button>
  </div>`;
}

function routineCardHTML(r, absIdx) {
  const totalMin = r.stages.reduce((a,s) => a+s.minutes, 0) + (r.buffer ? (r.stages.length-1)*5 : 0);
  return `<button class="routine-card" data-ri="${absIdx}" style="background:${V.surface};border:1px solid ${V.border};border-radius:12px;cursor:pointer;text-align:left;transition:all 0.3s ease;overflow:hidden;position:relative;height:140px;padding:0">
    <img src="${escAttr(r.img)}" alt="" loading="lazy" class="card-img"
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.6s ease;filter:brightness(0.55) saturate(0.85)">
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(22,20,15,0.92) 0%,rgba(22,20,15,0.5) 40%,rgba(22,20,15,0.1) 70%,transparent 100%)"></div>
    ${r.buffer ? `<div style="position:absolute;top:6px;right:6px;z-index:2;display:flex;align-items:center;gap:3px;padding:2px 6px;border-radius:5px;background:rgba(139,154,156,0.3);backdrop-filter:blur(4px)">
      <span style="display:flex;color:${V.buf};transform:scale(0.6)">${I.buffer}</span>
      <span style="font-size:7px;color:#C8D0D1;font-family:${V.mono};font-weight:500">Buffer</span>
    </div>` : ''}
    <div style="position:absolute;bottom:0;left:0;right:0;padding:8px 10px 10px;z-index:2;display:flex;flex-direction:column;gap:3px">
      <div style="font-size:11px;color:#fff;font-family:${V.sans};font-weight:600;line-height:1.25;text-shadow:0 1px 4px rgba(0,0,0,0.5)">${escHtml(r.name)}</div>
      <div style="font-size:9px;color:rgba(255,255,255,0.55);font-family:${V.sans};line-height:1.2">${escHtml(r.tag)}</div>
      <div style="display:flex;gap:3px;align-items:center;margin-top:1px">
        ${r.stages.slice(0,3).map(s => `<div style="width:5px;height:5px;border-radius:1.5px;background:${s.color};opacity:0.9"></div>`).join('')}
        ${r.stages.length > 3 ? `<span style="font-size:7px;color:rgba(255,255,255,0.35);font-family:${V.mono}">+${r.stages.length-3}</span>` : ''}
        <span style="font-size:8px;color:rgba(255,255,255,0.4);font-family:${V.mono};margin-left:auto">${totalMin}m</span>
      </div>
    </div>
  </button>`;
}

function chainEditorHTML() {
  const isEdit = CS.editingIdx !== null;
  const validCount = CS.editStages.filter(s => s.label.trim() && s.minutes > 0).length;
  const showTotal = CS.editBuffer && validCount > 1;
  return `<div style="display:flex;flex-direction:column;gap:16px">
    <button id="editor-back" style="background:none;border:none;color:${V.textM};cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-family:${V.sans};padding:0">
      ${I.back} Back
    </button>
    <div style="background:${V.surface};border-radius:16px;padding:22px;border:1px solid ${V.border};display:flex;flex-direction:column;gap:16px">
      <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">${isEdit ? 'Edit Chain' : 'Build Your Chain'}</div>
      <input id="chain-name-input" value="${escAttr(CS.editName)}" placeholder="Chain name (e.g. Morning Routine)"
        style="background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:10px;padding:10px 14px;color:${V.text};font-size:14px;font-family:${V.sans};width:100%">
      <div id="stages-list" style="display:flex;flex-direction:column;gap:8px">
        ${editorStagesHTML()}
      </div>
      <button id="add-stage-btn" style="width:100%;padding:9px 0;border-radius:8px;border:1px dashed ${V.border};background:transparent;color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};display:flex;align-items:center;justify-content:center;gap:6px">
        ${I.plus} Add Stage
      </button>
      <div id="buffer-toggle" role="switch" aria-checked="${CS.editBuffer}" aria-label="Smart Buffer" tabindex="0" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:12px;
        background:${CS.editBuffer?V.bufM:'rgba(255,255,255,0.02)'};
        border:1px solid ${CS.editBuffer?'rgba(139,154,156,0.18)':V.border};transition:all 0.3s ease;cursor:pointer">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="display:flex;color:${CS.editBuffer?V.buf:V.textD}">${I.buffer}</span>
          <div>
            <div style="font-size:13px;color:${CS.editBuffer?V.text:V.textM};font-family:${V.sans};font-weight:500">Smart Buffer (5 min wrap-up)</div>
            <div style="font-size:11px;color:${V.textD};font-family:${V.sans};margin-top:2px;line-height:1.4">Adds 5-minute breathing room between stages</div>
          </div>
        </div>
        <div style="width:42px;height:24px;border-radius:12px;padding:2px;background:${CS.editBuffer?V.buf:'rgba(255,255,255,0.1)'};transition:background 0.3s ease;flex-shrink:0;margin-left:12px">
          <div style="width:20px;height:20px;border-radius:10px;background:${CS.editBuffer?'#fff':'rgba(255,255,255,0.3)'};
            transform:${CS.editBuffer?'translateX(18px)':'translateX(0)'};
            transition:all 0.25s cubic-bezier(0.4,0,0.2,1);
            box-shadow:${CS.editBuffer?'0 2px 8px rgba(0,0,0,0.3)':'none'}"></div>
        </div>
      </div>
      ${showTotal ? `<div style="font-size:11px;color:${V.textD};font-family:${V.mono};text-align:center;padding:4px 0">
        ${(() => { const v=CS.editStages.filter(s=>s.label.trim()&&s.minutes>0); const b=v.reduce((a,s)=>a+s.minutes,0); const bf=(v.length-1)*5; return `Total: ${b+bf} min (${b}m + ${bf}m buffer)`; })()}
      </div>` : ''}
      <button id="save-chain-btn" style="width:100%;padding:11px 0;border-radius:10px;border:none;background:${V.accent};color:${V.bg};cursor:pointer;font-size:13px;font-family:${V.sans};font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
        ${I.save} ${isEdit ? 'Update Chain' : 'Save Chain'}
      </button>
      <div id="chain-editor-error" role="alert" style="display:none;font-size:11px;color:${V.red};font-family:${V.sans};text-align:center">
        Add at least one stage with a name and time before saving.
      </div>
    </div>
  </div>`;
}

function editorStagesHTML() {
  return CS.editStages.map((s,i) => `
    <div style="display:flex;gap:8px;align-items:center">
      <div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;background:${SC[i%SC.length]};display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:700;font-family:${V.mono}">${i+1}</div>
      <input class="stage-label" data-si="${i}" value="${escAttr(s.label)}" placeholder="Stage name"
        style="flex:1;background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:8px;padding:9px 12px;color:${V.text};font-size:13px;font-family:${V.sans}">
      ${minuteDialHTML(s.minutes, i)}
      ${CS.editStages.length > 1 ? `<button class="rm-stage" data-si="${i}" aria-label="Remove stage ${i+1}" style="background:none;border:none;color:${V.red};cursor:pointer;padding:4px;display:flex;opacity:0.7">${I.x}</button>` : ''}
    </div>`).join('');
}

function minuteDialHTML(value, si) {
  return `<div style="display:flex;align-items:center;background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:10px;padding:0 4px;height:38px">
    <input type="text" inputmode="numeric" pattern="[0-9]*" value="${value}" data-si="${si}" class="min-input"
      style="width:32px;background:transparent;border:none;color:${V.text};font-size:13px;font-family:${V.mono};text-align:center;padding:0">
    <span style="font-size:9px;color:${V.textD};font-family:${V.mono};margin-right:6px">min</span>
    <div style="display:flex;flex-direction:column;gap:1px;border-left:1px solid ${V.border};padding-left:5px;margin-left:2px">
      <button class="min-up" data-si="${si}" aria-label="Increase minutes" style="width:18px;height:15px;border-radius:4px 4px 1px 1px;border:none;cursor:pointer;background:transparent;color:${V.textD};display:flex;align-items:center;justify-content:center">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 0L8 5H0L4 0Z"/></svg>
      </button>
      <button class="min-down" data-si="${si}" aria-label="Decrease minutes" style="width:18px;height:15px;border-radius:1px 1px 4px 4px;border:none;cursor:pointer;background:transparent;color:${V.textD};display:flex;align-items:center;justify-content:center">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 5L0 0H8L4 5Z"/></svg>
      </button>
    </div>
  </div>`;
}

function chainTimerViewHTML() {
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const { stageProgress, globalProgress, isBuffer, currentColor } = chainComputed();
  const displayTime = CS.remaining !== null ? fmt(CS.remaining) : fmt((rt[0] ? rt[0].minutes : 0)*60);
  const bufBannerDisplay = CS.running && isBuffer && CS.remaining !== null ? 'flex' : 'none';

  const innerHTML = CS.done
    ? `<div style="text-align:center"><div style="color:${V.green};display:flex;justify-content:center;margin-bottom:8px">${I.check}</div><div style="font-size:13px;color:${V.textM};font-family:${V.sans}">Chain Complete</div></div>`
    : `<div id="ct-label" style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${currentColor};font-family:${V.mono};font-weight:500;margin-bottom:6px;font-style:${isBuffer?'italic':'normal'}">${isBuffer?'Wrap-up':(rt[si]?escHtml(rt[si].label):'Ready')}</div>
       <div id="ct-time" style="font-size:48px;font-weight:300;color:${V.text};font-family:${V.mono};letter-spacing:3px">${displayTime}</div>
       <div id="ct-stage-info" style="font-size:10px;color:${V.textD};font-family:${V.mono};margin-top:6px">stage ${si+1} of ${rt.length}</div>`;

  return `<div style="display:flex;flex-direction:column;gap:22px;align-items:center">
    <button id="timer-back" style="align-self:flex-start;background:none;border:none;color:${V.textM};cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-family:${V.sans};padding:0">
      ${I.back} Browse Routines
    </button>
    ${CS.activeChain ? `
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:14px;color:${V.text};font-family:${V.sans};font-weight:600">${escHtml(CS.activeChain.name)}</div>
        ${CS.activeChain.buffer ? `<div style="display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;background:${V.bufM};border:1px solid rgba(139,154,156,0.12)">
          <span style="display:flex;color:${V.buf};transform:scale(0.75)">${I.buffer}</span>
          <span style="font-size:10px;color:${V.buf};font-family:${V.mono};font-weight:500">Buffer</span>
        </div>` : ''}
      </div>
      <div id="stage-bar-wrap">${stageBarsHTML(rt, si, stageProgress)}</div>
      <div id="chain-progress-wrap">
        ${circularProgressHTML('chain-circle', globalProgress, currentColor, 240, 5, innerHTML)}
      </div>
      <div id="ct-buttons" style="display:flex;gap:14px;align-items:center">
        ${chainTimerBtnsHTML()}
      </div>
      <div id="ct-buf-banner" style="display:${bufBannerDisplay};align-items:center;gap:10px;padding:10px 18px;border-radius:12px;background:${V.bufM};border:1px solid rgba(139,154,156,0.15)">
        <span style="display:flex;color:${V.buf}">${I.buffer}</span>
        <div style="flex:1">
          <div style="font-size:12px;color:${V.buf};font-family:${V.sans};font-weight:600">Wrap-up time</div>
          <div style="font-size:11px;color:${V.textM};font-family:${V.sans};margin-top:1px">Prepare for your next task</div>
        </div>
        <div id="ct-buf-remaining" style="font-size:16px;font-weight:400;color:${V.buf};font-family:${V.mono};letter-spacing:1px">${CS.remaining !== null ? fmt(CS.remaining) : ''}</div>
      </div>
    ` : ''}
  </div>`;
}

function chainTimerBtnsHTML() {
  if (CS.done) return roundBtnHTML('ct-restart', I.restart, 'primary', 'Restart chain');
  if (CS.running) return roundBtnHTML('ct-stop', I.stop, 'danger', 'Stop chain');
  return roundBtnHTML('ct-start', I.play, 'primary', 'Start chain');
}

// ────────────────────────────────────
// CHAIN TIMER — LOGIC
// ────────────────────────────────────
function stopChainInterval() {
  if (CS.intervalId) { clearInterval(CS.intervalId); CS.intervalId = null; }
}

function stopAutoCycle() {
  if (CS.autoCycleId) { clearInterval(CS.autoCycleId); CS.autoCycleId = null; }
}

function startAutoCycle() {
  stopAutoCycle();
  CS.autoCycleId = setInterval(() => {
    goPage((CS.page + 1) % PAGES);
  }, 8000);
}

function goPage(p) {
  const grid = document.getElementById('routines-grid');
  if (!grid) return;
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(6px)';
  setTimeout(() => {
    CS.page = p;
    const visible = ROUTINES.slice(CS.page*8, CS.page*8+8);
    grid.innerHTML = visible.map((r,i) => routineCardHTML(r, CS.page*8+i)).join('');
    attachRoutineCardEvents();
    document.querySelectorAll('.page-dot').forEach((d,i) => {
      d.style.width = i === CS.page ? '20px' : '6px';
      d.style.background = i === CS.page ? V.accent : 'rgba(255,255,255,0.08)';
      d.dataset.pg = i;
    });
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 220);
}

function stopChain() {
  stopChainInterval();
  CS.running = false;
  CS.endTime = null;
  CS.remaining = null;
  CS.stageIdx = 0;
  CS.done = false;
}

function selectRoutine(r) {
  stopChain();
  CS.activeChain = r;
  CS.runtimeStages = buildRT(r.stages, r.buffer);
  CS.view = 'timer';
  renderChainContent();
}

function startChain() {
  if (!CS.runtimeStages.length) return;
  CS.endTime = Date.now() + CS.runtimeStages[0].minutes * 60 * 1000;
  CS.stageIdx = 0;
  CS.running = true;
  CS.done = false;
  CS.remaining = CS.runtimeStages[0].minutes * 60;
  chime();
  playLogoStartAnimation();
  updateChainTimerButtons();
  startChainInterval();
}

function startChainInterval() {
  stopChainInterval();
  CS.intervalId = setInterval(() => {
    const diff = Math.max(0, Math.ceil((CS.endTime - Date.now()) / 1000));
    CS.remaining = diff;
    if (diff <= 0) {
      const nx = CS.stageIdx + 1;
      if (nx < CS.runtimeStages.length) {
        CS.runtimeStages[nx].isBuffer ? softChime() : chime();
        CS.stageIdx = nx;
        CS.endTime = Date.now() + CS.runtimeStages[nx].minutes * 60 * 1000;
        CS.remaining = CS.runtimeStages[nx].minutes * 60;
        refreshChainTimerInner();
      } else {
        chime();
        notifySessionEnd('Chain complete', `${CS.activeChain?.name || 'Your chain'} has finished.`);
        CS.done = true;
        CS.running = false;
        stopChainInterval();
        refreshChainTimerInner();
        updateChainTimerButtons();
      }
    } else {
      tickChainTimerDisplay();
    }
  }, 250);
}

function tickChainTimerDisplay() {
  const timeEl = document.getElementById('ct-time');
  if (timeEl && CS.remaining !== null) timeEl.textContent = fmt(CS.remaining);

  const { stageProgress, globalProgress, currentColor } = chainComputed();
  updateProgressCircle('chain-circle', globalProgress, currentColor, 240, 5);
  updateStageBars(CS.runtimeStages, CS.stageIdx, stageProgress);

  const bufBanner = document.getElementById('ct-buf-banner');
  const bufRem = document.getElementById('ct-buf-remaining');
  const { isBuffer } = chainComputed();
  if (bufBanner) bufBanner.style.display = (CS.running && isBuffer) ? 'flex' : 'none';
  if (bufRem && CS.remaining !== null) bufRem.textContent = fmt(CS.remaining);
}

function refreshChainTimerInner() {
  const { isBuffer, currentColor } = chainComputed();
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const inner = document.getElementById('chain-circle-inner');
  if (!inner) return;

  if (CS.done) {
    inner.innerHTML = `<div style="text-align:center"><div style="color:${V.green};display:flex;justify-content:center;margin-bottom:8px">${I.check}</div><div style="font-size:13px;color:${V.textM};font-family:${V.sans}">Chain Complete</div></div>`;
  } else {
    const displayTime = CS.remaining !== null ? fmt(CS.remaining) : fmt((rt[si] ? rt[si].minutes : 0)*60);
    inner.innerHTML = `
      <div id="ct-label" style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${currentColor};font-family:${V.mono};font-weight:500;margin-bottom:6px;font-style:${isBuffer?'italic':'normal'}">${isBuffer?'Wrap-up':escHtml(rt[si]?rt[si].label:'Ready')}</div>
      <div id="ct-time" style="font-size:48px;font-weight:300;color:${V.text};font-family:${V.mono};letter-spacing:3px">${displayTime}</div>
      <div id="ct-stage-info" style="font-size:10px;color:${V.textD};font-family:${V.mono};margin-top:6px">stage ${si+1} of ${rt.length}</div>`;
  }

  const sbWrap = document.getElementById('stage-bar-wrap');
  const { stageProgress, globalProgress } = chainComputed();
  if (sbWrap) sbWrap.innerHTML = stageBarsHTML(rt, si, stageProgress);
  updateProgressCircle('chain-circle', globalProgress, currentColor, 240, 5);
}

function updateChainTimerButtons() {
  const btns = document.getElementById('ct-buttons');
  if (!btns) return;
  btns.innerHTML = chainTimerBtnsHTML();
  attachChainTimerBtnEvents();
}

// ────────────────────────────────────
// CHAIN TIMER — EVENT BINDING
// ────────────────────────────────────
export function renderChainContent() {
  const container = document.getElementById('chain-content');
  if (!container) return;
  stopAutoCycle();
  if (CS.view === 'browse') {
    container.innerHTML = chainBrowseHTML();
    attachChainBrowseEvents();
    startAutoCycle();
  } else if (CS.view === 'editor') {
    container.innerHTML = chainEditorHTML();
    attachChainEditorEvents();
  } else {
    container.innerHTML = chainTimerViewHTML();
    attachChainTimerEvents();
    if (CS.running) startChainInterval();
  }
}

function attachChainBrowseEvents() {
  const el = document.getElementById('chain-content');
  if (!el) return;

  el.querySelector('#build-chain-btn')?.addEventListener('click', () => openEditor(null));
  el.querySelector('#new-chain-btn')?.addEventListener('click', () => openEditor(null));

  el.querySelectorAll('.uc-select').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.ci;
    selectRoutine(CS.userChains[i]);
  }));
  el.querySelectorAll('.uc-edit').forEach(b => b.addEventListener('click', () => openEditor(+b.dataset.ci)));
  el.querySelectorAll('.uc-del').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.ci;
    if (CS.activeChain === CS.userChains[i]) CS.activeChain = null;
    CS.userChains.splice(i, 1);
    saveChains(CS.userChains);
    CS.view = 'browse';
    renderChainContent();
  }));

  attachRoutineCardEvents();

  el.querySelectorAll('.page-dot').forEach(b => b.addEventListener('click', () => {
    stopAutoCycle();
    goPage(+b.dataset.pg);
    startAutoCycle();
  }));
}

function attachRoutineCardEvents() {
  document.querySelectorAll('.routine-card').forEach(b => b.addEventListener('click', () => {
    selectRoutine(ROUTINES[+b.dataset.ri]);
  }));
  document.querySelectorAll('.card-img').forEach(img => {
    if (img.complete) img.style.opacity = '1';
    else img.addEventListener('load', () => { img.style.opacity = '1'; });
  });
}

// Bound once per full editor render. #stages-list is replaced independently
// on every add/remove/minute change (see rerenderEditorStages) — rebinding
// these container-level listeners on that path would stack duplicates onto
// elements that never get recreated (add-stage-btn, save-chain-btn, etc.),
// so each stale listener fires again on the next click.
function attachChainEditorEvents() {
  const el = document.getElementById('chain-content');
  if (!el) return;

  el.querySelector('#editor-back')?.addEventListener('click', () => {
    CS.view = CS.activeChain ? 'timer' : 'browse';
    renderChainContent();
  });

  el.querySelector('#chain-name-input')?.addEventListener('input', e => { CS.editName = e.target.value; });

  attachStageListEvents();

  el.querySelector('#add-stage-btn')?.addEventListener('click', () => {
    CS.editStages.push({label:'', minutes:5, color:SC[CS.editStages.length % SC.length]});
    rerenderEditorStages();
  });

  el.querySelector('#buffer-toggle')?.addEventListener('click', () => {
    CS.editBuffer = !CS.editBuffer;
    CS.view = 'editor';
    renderChainContent();
  });
  el.querySelector('#buffer-toggle')?.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    CS.editBuffer = !CS.editBuffer;
    CS.view = 'editor';
    renderChainContent();
  });

  el.querySelector('#save-chain-btn')?.addEventListener('click', saveChain);
}

// Only the per-row listeners — safe to call every time #stages-list's
// innerHTML is replaced, since those elements are freshly created each time.
function attachStageListEvents() {
  const list = document.getElementById('stages-list');
  if (!list) return;

  list.querySelectorAll('.stage-label').forEach(inp => inp.addEventListener('input', e => {
    CS.editStages[+inp.dataset.si].label = e.target.value;
    const errEl = document.getElementById('chain-editor-error');
    if (errEl) errEl.style.display = 'none';
  }));

  list.querySelectorAll('.min-input').forEach(inp => inp.addEventListener('change', e => {
    const v = parseInt(e.target.value);
    if (!isNaN(v) && v >= 1 && v <= 999) CS.editStages[+inp.dataset.si].minutes = v;
    else e.target.value = CS.editStages[+inp.dataset.si].minutes;
  }));

  list.querySelectorAll('.min-up').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages[si].minutes = Math.min(999, CS.editStages[si].minutes + 1);
    rerenderEditorStages();
  }));
  list.querySelectorAll('.min-down').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages[si].minutes = Math.max(1, CS.editStages[si].minutes - 1);
    rerenderEditorStages();
  }));

  list.querySelectorAll('.rm-stage').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages.splice(si, 1);
    rerenderEditorStages();
    updateEditorTotal();
  }));
}

function rerenderEditorStages() {
  const list = document.getElementById('stages-list');
  if (list) {
    list.innerHTML = editorStagesHTML();
    attachStageListEvents();
  }
  updateEditorTotal();
}

function updateEditorTotal() {
  const totalEl = document.getElementById('editor-total');
  if (!CS.editBuffer) return;
  const v = CS.editStages.filter(s => s.label.trim() && s.minutes > 0);
  if (v.length <= 1) return;
  const b = v.reduce((a,s) => a+s.minutes, 0);
  const bf = (v.length-1)*5;
  if (totalEl) totalEl.textContent = `Total: ${b+bf} min (${b}m + ${bf}m buffer)`;
}

function openEditor(idx) {
  if (idx !== null && CS.userChains[idx]) {
    const c = CS.userChains[idx];
    CS.editName = c.name;
    CS.editStages = c.stages.map(s => ({...s}));
    CS.editBuffer = c.buffer || false;
    CS.editingIdx = idx;
  } else {
    CS.editName = '';
    CS.editStages = [{label:'', minutes:25, color:SC[0]}];
    CS.editBuffer = false;
    CS.editingIdx = null;
  }
  stopChain();
  CS.view = 'editor';
  renderChainContent();
}

function saveChain() {
  const valid = CS.editStages.filter(s => s.label.trim() && s.minutes > 0);
  if (!valid.length) {
    const errEl = document.getElementById('chain-editor-error');
    if (errEl) errEl.style.display = 'block';
    return;
  }
  const chain = {
    name: CS.editName.trim() || `Chain ${CS.userChains.length + 1}`,
    stages: valid,
    buffer: CS.editBuffer,
  };
  if (CS.editingIdx !== null) {
    CS.userChains[CS.editingIdx] = chain;
  } else if (CS.userChains.length < 8) {
    CS.userChains.push(chain);
  }
  saveChains(CS.userChains);
  CS.activeChain = chain;
  CS.runtimeStages = buildRT(chain.stages, chain.buffer);
  CS.editingIdx = null;
  CS.view = 'timer';
  renderChainContent();
}

function attachChainTimerEvents() {
  document.getElementById('timer-back')?.addEventListener('click', () => {
    stopChain();
    CS.view = 'browse';
    renderChainContent();
  });
  attachChainTimerBtnEvents();
}

function attachChainTimerBtnEvents() {
  document.getElementById('ct-start')?.addEventListener('click', startChain);
  document.getElementById('ct-stop')?.addEventListener('click', () => {
    stopChain();
    updateChainTimerButtons();
    const timeEl = document.getElementById('ct-time');
    if (timeEl && CS.runtimeStages[0]) timeEl.textContent = fmt(CS.runtimeStages[0].minutes * 60);
    updateProgressCircle('chain-circle', 0, CS.runtimeStages[0] ? CS.runtimeStages[0].color : V.accent, 240, 5);
    updateStageBars(CS.runtimeStages, 0, 0);
  });
  document.getElementById('ct-restart')?.addEventListener('click', () => {
    CS.done = false;
    startChain();
  });
}
