import { V } from './tokens.js';
import { I } from './icons.js';
import { fmt, escHtml, escAttr } from './utils.js';
import {
  dateKey, loadFocusHistory, recordFocusSession, todaysFocusSessions, currentStreak,
  loadFocusLog, addFocusLogEntry, updateFocusLogEntry,
} from './persistence.js';
import { chime } from './audio.js';
import { notifySessionEnd } from './notifications.js';
import { circularProgressHTML, updateProgressCircle, roundBtnHTML } from './ui.js';
import { isPlaying, currentTrackLabel, getVolume, toggleSoundscape, nextTrack, setVolume, stopSoundscape } from './soundscape.js';

// ── Focus Room State ──
const FS = {
  dur: 25,
  customDur: '',
  showCustom: false,
  running: false,
  endTime: null,
  remaining: null,
  intervalId: null,
  intention: '',
  currentIntention: '',
  pendingEntry: null, // {at} — session just finished, awaiting an optional reflection
  motivationText: null, // brief encouragement shown right after starting, then fades to the title
  motivationTimer: null,
  editingTitle: false,
  history: loadFocusHistory(),
  log: loadFocusLog(),
};

const MOTIVATIONS = [
  "You've got this.",
  'Time to lock in.',
  'One focused step at a time.',
  'Deep work starts now.',
  'Show up for yourself.',
  'Clear mind, steady hands.',
  'This is your time.',
  'Small steps, real progress.',
];
function pickMotivation() {
  return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
}

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

function soundscapeInnerHTML() {
  return `
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap">
      <button id="sc-play" aria-label="${isPlaying()?'Pause':'Play'} soundscape" style="width:32px;height:32px;border-radius:50%;border:1.5px solid ${V.teal};background:${isPlaying()?`${V.teal}18`:'transparent'};color:${V.teal};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">${isPlaying()?I.pause:I.play}</button>
      <button id="sc-next" aria-label="Next sound" style="width:26px;height:26px;border-radius:50%;border:1.5px solid ${V.border};background:transparent;color:${V.textM};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">${I.next}</button>
      <div style="font-size:12px;color:${V.textM};font-family:${V.sans}">Ambient &middot; <span style="color:${V.text}">${currentTrackLabel()}</span></div>
      <input id="sc-volume" type="range" min="0" max="100" value="${Math.round(getVolume()*100)}" aria-label="Soundscape volume" style="width:70px;accent-color:${V.teal}">
    </div>`;
}

function sessionHeaderInnerHTML() {
  if (FS.motivationText) {
    return `<div style="font-size:15px;color:${V.teal};font-family:${V.sans};font-weight:500;letter-spacing:0.2px;animation:fadeIn 0.4s ease">${escHtml(FS.motivationText)}</div>`;
  }
  if (FS.editingTitle) {
    return `<input id="session-title-input" type="text" value="${escAttr(FS.currentIntention)}" placeholder="Focus Session" maxlength="80"
      style="background:transparent;border:none;border-bottom:1px solid ${V.border};color:${V.text};font-size:15px;font-family:${V.sans};font-weight:500;text-align:center;padding:2px 4px;max-width:280px">`;
  }
  const title = FS.currentIntention || 'Focus Session';
  return `<div style="font-size:15px;color:${V.text};font-family:${V.sans};font-weight:500;animation:fadeIn 0.4s ease">${escHtml(title)}</div>
    <button id="session-title-edit-btn" aria-label="Rename session" style="width:18px;height:18px;border:none;background:none;color:${V.textD};opacity:0.4;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0">${I.edit}</button>`;
}

function heatmapHTML(history) {
  const weeks = 12;
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks*7 - 1) - today.getDay());

  const cols = [];
  for (let w = 0; w < weeks; w++) {
    const cells = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(start);
      cellDate.setDate(start.getDate() + w*7 + d);
      const count = history[dateKey(cellDate)] || 0;
      const future = cellDate > today;
      const bg = future ? 'transparent' : count === 0 ? 'rgba(255,255,255,0.05)' : count === 1 ? `${V.teal}40` : count === 2 ? `${V.teal}80` : V.teal;
      const title = future ? '' : `${dateKey(cellDate)}: ${count} session${count===1?'':'s'}`;
      cells.push(`<div title="${escAttr(title)}" style="width:9px;height:9px;border-radius:2px;background:${bg}"></div>`);
    }
    cols.push(`<div style="display:flex;flex-direction:column;gap:3px">${cells.join('')}</div>`);
  }
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">
    <div style="display:flex;gap:3px">${cols.join('')}</div>
    <div style="font-size:10px;color:${V.textD};font-family:${V.mono};letter-spacing:1px;text-transform:uppercase">last ${weeks} weeks</div>
  </div>`;
}

function statsHTML() {
  const streak = currentStreak(FS.history);
  const todaySessions = todaysFocusSessions(FS.history);
  const todayKey = dateKey();
  const todayMinutes = FS.log.filter(e => dateKey(new Date(e.at)) === todayKey).reduce((sum, e) => sum + e.minutes, 0);
  return `<div style="display:flex;flex-direction:column;gap:20px;align-items:center;width:100%">
    <div style="display:flex;gap:24px;justify-content:center">
      <div style="text-align:center">
        <div style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${todaySessions}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">sessions today</div>
      </div>
      <div style="width:1px;background:${V.border};align-self:stretch"></div>
      <div style="text-align:center">
        <div style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${todayMinutes}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">minutes focused</div>
      </div>
      <div style="width:1px;background:${V.border};align-self:stretch"></div>
      <div style="text-align:center">
        <div style="font-size:26px;font-weight:300;color:${streak>0?V.accent:V.text};font-family:${V.mono}">${streak}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">day streak</div>
      </div>
    </div>
    ${heatmapHTML(FS.history)}
  </div>`;
}

function reflectionPromptHTML() {
  const entry = FS.log.find(e => e.at === FS.pendingEntry.at);
  return `<div style="width:100%;max-width:400px;display:flex;flex-direction:column;gap:10px;animation:fadeIn 0.3s ease">
    ${entry && entry.intention ? `<div style="font-size:12px;color:${V.textM};font-family:${V.sans};text-align:center">You were focused on: <span style="color:${V.text}">${escHtml(entry.intention)}</span></div>` : ''}
    <textarea id="focus-reflection" placeholder="How did it go? (optional)" maxlength="240" rows="2"
      style="width:100%;background:${V.surface};border:1px solid ${V.border};border-radius:10px;padding:10px 14px;color:${V.text};font-size:13px;font-family:${V.sans};resize:none;box-sizing:border-box"></textarea>
    <div style="display:flex;gap:10px;justify-content:center">
      <button id="reflection-skip" style="padding:8px 18px;border-radius:10px;border:1.5px solid ${V.border};background:transparent;color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500">Skip</button>
      <button id="reflection-save" style="padding:8px 18px;border-radius:10px;border:none;background:${V.accent};color:${V.bg};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Save</button>
    </div>
  </div>`;
}

function recentLogHTML() {
  const entries = FS.log.filter(e => e.intention || e.reflection).slice(0, 3);
  if (!entries.length) return '';
  return `<div style="width:100%;display:flex;flex-direction:column;gap:8px">
    <div style="font-size:10px;color:${V.textD};font-family:${V.mono};letter-spacing:1px;text-transform:uppercase;text-align:center">recent sessions</div>
    ${entries.map(e => `<div style="padding:10px 14px;border-radius:10px;background:${V.surface};border:1px solid ${V.border}">
      ${e.intention ? `<div style="font-size:12px;color:${V.text};font-family:${V.sans}">${escHtml(e.intention)}</div>` : ''}
      ${e.reflection ? `<div style="font-size:11px;color:${V.textM};font-family:${V.sans};margin-top:3px">${escHtml(e.reflection)}</div>` : ''}
    </div>`).join('')}
  </div>`;
}

function focusRoomHTML() {
  const progress = FS.remaining !== null && FS.dur > 0 ? 1 - FS.remaining/(FS.dur*60) : 0;
  const durs = [15,25,30,60,90];
  const showPicker = !FS.running && FS.remaining === null;
  const isCustom = !durs.includes(FS.dur) || FS.showCustom;

  return `<div style="display:flex;flex-direction:column;gap:28px;align-items:center">
    ${showPicker ? `
      <div style="width:100%;max-width:320px">
        <input id="focus-intention" type="text" value="${escAttr(FS.intention)}" placeholder="What are you focusing on? (optional)" maxlength="80"
          style="width:100%;background:${V.surface};border:1px solid ${V.border};border-radius:10px;padding:10px 14px;color:${V.text};font-size:13px;font-family:${V.sans};box-sizing:border-box">
      </div>
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
      </div>` : `
      <div id="session-header" style="width:100%;max-width:320px;min-height:34px;display:flex;align-items:center;justify-content:center;gap:6px">
        ${sessionHeaderInnerHTML()}
      </div>`}

    <div id="focus-progress-wrap">
      ${circularProgressHTML('focus-circle', progress, V.teal, 210, 4, focusInnerHTML())}
    </div>

    <div id="focus-buttons" style="display:flex;gap:14px">
      ${focusBtnsHTML()}
    </div>

    ${FS.pendingEntry ? reflectionPromptHTML() : ''}

    ${statsHTML()}
    ${recentLogHTML()}

    <div id="soundscape-player" style="width:100%;padding:16px 20px;border-radius:16px;text-align:center;background:rgba(194,172,135,0.03);border:1px solid rgba(194,172,135,0.06)">
      ${soundscapeInnerHTML()}
    </div>
  </div>`;
}

function focusBtnsHTML() {
  if (FS.pendingEntry) return '';
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
  FS.currentIntention = FS.intention.trim().slice(0, 80);
  FS.endTime = Date.now() + FS.dur * 60 * 1000;
  FS.running = true;
  FS.showCustom = false;
  FS.editingTitle = false;
  FS.motivationText = pickMotivation();
  clearTimeout(FS.motivationTimer);
  FS.motivationTimer = setTimeout(() => {
    FS.motivationText = null;
    renderSessionHeader();
  }, 8000);
  chime();
  renderFocusContent();
}

function stopFocus() {
  stopFocusInterval();
  clearTimeout(FS.motivationTimer);
  FS.motivationTimer = null;
  FS.motivationText = null;
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
      notifySessionEnd('Focus session complete', FS.currentIntention ? `"${FS.currentIntention}" — ${FS.dur} min session finished.` : `${FS.dur} min focus session finished.`);
      FS.running = false;
      clearTimeout(FS.motivationTimer);
      FS.motivationTimer = null;
      FS.motivationText = null;
      FS.history = recordFocusSession();
      const at = Date.now();
      FS.log = addFocusLogEntry({ at, minutes: FS.dur, intention: FS.currentIntention, reflection: '' });
      FS.pendingEntry = { at };
      stopFocusInterval();
      renderFocusContent();
    }
  }, 250);
}

function finalizePendingEntry(reflection) {
  if (!FS.pendingEntry) return;
  FS.log = updateFocusLogEntry(FS.pendingEntry.at, { reflection });
  FS.pendingEntry = null;
  FS.intention = '';
  renderFocusContent();
}

export function renderFocusContent() {
  const container = document.getElementById('focus-content');
  if (!container) return;
  container.innerHTML = focusRoomHTML();
  attachFocusEvents();
  if (FS.running) startFocusInterval();
}

function renderSessionHeader() {
  const el = document.getElementById('session-header');
  if (!el) return;
  el.innerHTML = sessionHeaderInnerHTML();
  attachSessionHeaderEvents();
}

function attachSessionHeaderEvents() {
  document.getElementById('session-title-edit-btn')?.addEventListener('click', () => {
    FS.editingTitle = true;
    renderSessionHeader();
    document.getElementById('session-title-input')?.focus();
  });
  const input = document.getElementById('session-title-input');
  if (input) {
    const commit = () => {
      FS.currentIntention = input.value.trim().slice(0, 80);
      FS.editingTitle = false;
      renderSessionHeader();
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });
    input.addEventListener('blur', commit);
  }
}

function renderSoundscapePlayer() {
  const el = document.getElementById('soundscape-player');
  if (!el) return;
  el.innerHTML = soundscapeInnerHTML();
  attachSoundscapeEvents();
}

function attachSoundscapeEvents() {
  document.getElementById('sc-play')?.addEventListener('click', () => {
    toggleSoundscape();
    renderSoundscapePlayer();
  });
  document.getElementById('sc-next')?.addEventListener('click', () => {
    nextTrack();
    renderSoundscapePlayer();
  });
  document.getElementById('sc-volume')?.addEventListener('input', e => {
    setVolume(e.target.value / 100);
  });
}

function attachFocusEvents() {
  document.getElementById('focus-intention')?.addEventListener('input', e => { FS.intention = e.target.value; });
  document.getElementById('focus-intention')?.addEventListener('keydown', e => { if (e.key === 'Enter') startFocus(); });
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
  document.getElementById('reflection-skip')?.addEventListener('click', () => finalizePendingEntry(''));
  document.getElementById('reflection-save')?.addEventListener('click', () => {
    const t = document.getElementById('focus-reflection');
    finalizePendingEntry(t ? t.value.trim() : '');
  });
  attachSoundscapeEvents();
  attachSessionHeaderEvents();
  attachFocusBtnEvents();
}

function attachFocusBtnEvents() {
  document.getElementById('focus-start')?.addEventListener('click', startFocus);
  document.getElementById('focus-stop')?.addEventListener('click', stopFocus);
  document.getElementById('focus-restart')?.addEventListener('click', () => { FS.remaining = null; FS.editingTitle = false; renderFocusContent(); });
}
