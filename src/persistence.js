// ── Persistence (LocalStorage) ──
const LS_CHAINS = 'cft:chains';
const LS_FOCUS = 'cft:focus';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// LocalStorage is outside the app's control (devtools edits, other tabs, a
// prior schema) — validate its shape rather than trusting it, so a stage's
// `stages.reduce`/`minutes*60` further downstream can't blow up on garbage.
function isValidChain(c) {
  return !!c && typeof c.name === 'string' &&
    Array.isArray(c.stages) && c.stages.length > 0 &&
    c.stages.every(s => s && typeof s.label === 'string' && typeof s.minutes === 'number' && s.minutes > 0);
}

export function loadChains() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_CHAINS));
    return Array.isArray(parsed) ? parsed.filter(isValidChain).slice(0, 8) : [];
  } catch(e) { return []; }
}

export function saveChains(chains) {
  try { localStorage.setItem(LS_CHAINS, JSON.stringify(chains)); } catch(e) {}
}

export function loadFocusSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_FOCUS));
    return parsed && parsed.date === todayKey() ? (Number(parsed.sessions) || 0) : 0;
  } catch(e) { return 0; }
}

export function saveFocusSessions(sessions) {
  try { localStorage.setItem(LS_FOCUS, JSON.stringify({date: todayKey(), sessions})); } catch(e) {}
}
