import { V } from './tokens.js';
import { I } from './icons.js';
import { fmt } from './utils.js';
import { loadFocusSessions, saveFocusSessions } from './persistence.js';
import { chime } from './audio.js';
import { circularProgressHTML, updateProgressCircle, roundBtnHTML } from './ui.js';
import { ambientPulse } from './ambient.js';

// ── Focus Room State ──
const FS = {
  dur: 25,
  customDur: '',
  showCustom: false,
  running: false,
  endTime: null,
  remaining: null,
  sessions: loadFocusSessions(),
  intervalId: null,
};

// ────────────────────────────────────
// FOCUS ROOM — HTML
// ────────────────────────────────────
function focusInnerHTML() {
  if (FS.remaining === 0 && !FS.running) {
    return `<div style="font-size:44px;font-weight:200;color:${V.text};font-family:${V.mono};letter-spacing:3px">${fmt(0)}</div>
      <div style="font-size:12px;color:${V.teal};font-family:${V.sans};margin-top:6px;font-weight:500">Session complete</div>`;
  }
  return `<div id="focus-time" style="font-size:44px;font-weight:200;color:${V.text};font-family:${V.mono};letter-spacing:3px">${FS.remaining !== null ? fmt(FS.remaining) : fmt(FS.dur*60)}</div>`;
}

function focusRoomHTML() {
  const progress = FS.remaining !== null && FS.dur > 0 ? 1 - FS.remaining/(FS.dur*60) : 0;
  const durs = [15,25,30,60,90];
  const showPicker = !FS.running && FS.remaining === null;
  const isCustom = !durs.includes(FS.dur) || FS.showCustom;

  return `<div style="display:flex;flex-direction:column;gap:28px;align-items:center">
    <div style="width:100%;padding:30px 20px;border-radius:20px;text-align:center;background:radial-gradient(ellipse at 50% 40%,rgba(78,205,196,0.05) 0%,transparent 65%);border:1px solid rgba(78,205,196,0.07);position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;opacity:0.12;padding:20px;pointer-events:none">
        ${Array.from({length:40}).map((_,i) => `<div style="width:3px;height:3px;border-radius:50%;background:${V.teal};animation:pulse ${2+((i*7)%4)}s infinite ${(i*3)%3}s"></div>`).join('')}
      </div>
      <div style="position:relative;z-index:1">
        <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px">
          <div class="pulse-dot" style="width:7px;height:7px;border-radius:50%;background:${V.teal};box-shadow:0 0 12px ${V.teal}88"></div>
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textM};font-family:${V.mono};font-weight:500">Ambient Focus Pulse</div>
        </div>
        <div style="font-size:52px;font-weight:200;color:${V.teal};font-family:${V.mono};letter-spacing:4px">
          <span class="ambient-pulse-val">${ambientPulse.toLocaleString()}</span>
        </div>
        <div style="font-size:13px;color:${V.textM};font-family:${V.sans};margin-top:6px">a simulated companion signal, not live data</div>
      </div>
    </div>

    ${showPicker ? `
      <div style="display:flex;flex-direction:column;gap:10px;align-items:center">
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
          ${durs.map(d => `<button class="dur-pill" data-dur="${d}" style="padding:7px 16px;border-radius:20px;border:${FS.dur===d&&!FS.showCustom?`1.5px solid ${V.teal}`:`1.5px solid ${V.border}`};background:${FS.dur===d&&!FS.showCustom?`${V.teal}18`:'rgba(255,255,255,0.02)'};color:${FS.dur===d&&!FS.showCustom?V.teal:V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">${d}m</button>`).join('')}
          <button id="custom-dur-btn" style="padding:7px 16px;border-radius:20px;border:${isCustom?`1.5px solid ${V.accent}`:`1.5px solid ${V.border}`};background:${isCustom?`${V.accent}18`:'rgba(255,255,255,0.02)'};color:${isCustom?V.accent:V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">Custom</button>
        </div>
        ${FS.showCustom ? `
          <div style="display:flex;gap:8px;align-items:center;animation:fadeIn 0.2s ease">
            <div style="display:flex;align-items:center;gap:4px;background:${V.surface};border:1px solid ${V.border};border-radius:10px;padding:0 12px">
              <input id="custom-dur-input" type="number" value="${FS.customDur}" min="1" max="999" placeholder="min" aria-label="Custom duration in minutes" autofocus
                style="width:56px;background:transparent;border:none;color:${V.text};font-size:14px;font-family:${V.mono};text-align:center;padding:10px 0">
              <span style="font-size:10px;color:${V.textD};font-family:${V.mono}">min</span>
            </div>
            <button id="custom-dur-set" style="background:${V.accent};border:none;border-radius:10px;padding:10px 18px;color:${V.bg};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Set</button>
          </div>` : ''}
      </div>` : ''}

    <div id="focus-progress-wrap">
      ${circularProgressHTML('focus-circle', progress, V.teal, 210, 4, focusInnerHTML())}
    </div>

    <div id="focus-buttons" style="display:flex;gap:14px">
      ${focusBtnsHTML()}
    </div>

    <div style="display:flex;gap:28px;justify-content:center">
      <div style="text-align:center">
        <div style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${FS.sessions}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">sessions today</div>
      </div>
      <div style="width:1px;background:${V.border};align-self:stretch"></div>
      <div style="text-align:center">
        <div id="focus-mins-total" style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${FS.sessions*FS.dur}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">minutes focused</div>
      </div>
    </div>
  </div>`;
}

function focusBtnsHTML() {
  if (!FS.running && (FS.remaining === null || FS.remaining > 0)) return roundBtnHTML('focus-start', I.play, 'primary', 'Start focus session');
  if (!FS.running && FS.remaining === 0) return roundBtnHTML('focus-restart', I.restart, 'primary', 'Start new session');
  return roundBtnHTML('focus-stop', I.stop, 'danger', 'Stop focus session');
}

// ────────────────────────────────────
// FOCUS ROOM — LOGIC
// ────────────────────────────────────
function stopFocusInterval() {
  if (FS.intervalId) { clearInterval(FS.intervalId); FS.intervalId = null; }
}

function startFocus() {
  FS.endTime = Date.now() + FS.dur * 60 * 1000;
  FS.running = true;
  FS.showCustom = false;
  chime();
  updateFocusButtons();
  startFocusInterval();
}

function stopFocus() {
  stopFocusInterval();
  FS.running = false;
  FS.endTime = null;
  FS.remaining = null;
  renderFocusContent();
}

function startFocusInterval() {
  stopFocusInterval();
  FS.intervalId = setInterval(() => {
    const diff = Math.max(0, Math.ceil((FS.endTime - Date.now()) / 1000));
    FS.remaining = diff;
    const progress = FS.dur > 0 ? 1 - diff/(FS.dur*60) : 0;
    updateProgressCircle('focus-circle', progress, V.teal, 210, 4);
    const timeEl = document.getElementById('focus-time');
    if (timeEl) timeEl.textContent = fmt(diff);
    if (diff <= 0) {
      chime();
      FS.running = false;
      FS.sessions++;
      saveFocusSessions(FS.sessions);
      stopFocusInterval();
      renderFocusContent();
    }
  }, 250);
}

function updateFocusButtons() {
  const el = document.getElementById('focus-buttons');
  if (el) {
    el.innerHTML = focusBtnsHTML();
    attachFocusBtnEvents();
  }
}

export function renderFocusContent() {
  const container = document.getElementById('focus-content');
  if (!container) return;
  container.innerHTML = focusRoomHTML();
  attachFocusEvents();
  if (FS.running) startFocusInterval();
}

function attachFocusEvents() {
  document.querySelectorAll('.dur-pill').forEach(b => b.addEventListener('click', () => {
    FS.dur = +b.dataset.dur;
    FS.showCustom = false;
    renderFocusContent();
  }));
  document.getElementById('custom-dur-btn')?.addEventListener('click', () => {
    FS.showCustom = true;
    renderFocusContent();
  });
  const applyCustom = () => {
    const inp = document.getElementById('custom-dur-input');
    if (!inp) return;
    const v = parseInt(inp.value);
    if (v > 0 && v <= 999) {
      FS.dur = v;
      FS.showCustom = false;
      renderFocusContent();
    }
  };
  document.getElementById('custom-dur-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') applyCustom(); });
  document.getElementById('custom-dur-set')?.addEventListener('click', applyCustom);
  attachFocusBtnEvents();
}

function attachFocusBtnEvents() {
  document.getElementById('focus-start')?.addEventListener('click', startFocus);
  document.getElementById('focus-stop')?.addEventListener('click', stopFocus);
  document.getElementById('focus-restart')?.addEventListener('click', () => { FS.remaining = null; renderFocusContent(); });
}
