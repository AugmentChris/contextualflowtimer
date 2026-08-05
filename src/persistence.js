// ── Persistence (LocalStorage) ──
const LS_CHAINS = 'cft:chains';
const LS_HISTORY = 'cft:focusHistory';
const LS_LOG = 'cft:focusLog';
const LS_MUTED = 'cft:muted';
const LS_NOTIFS = 'cft:notifs';

const MAX_HISTORY_DAYS = 371; // just over a year — enough for streaks + the heatmap
const MAX_LOG_ENTRIES = 50;

export function dateKey(d) {
  d = d || new Date();
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

// ── Focus history: real per-day completed-session counts, the basis for
// the streak counter and heatmap (replaces the old single today-count). ──
export function loadFocusHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_HISTORY));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch(e) { return {}; }
}

function trimHistory(history) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_HISTORY_DAYS);
  const cutoffKey = dateKey(cutoff);
  const trimmed = {};
  for (const k in history) if (k >= cutoffKey) trimmed[k] = history[k];
  return trimmed;
}

export function recordFocusSession() {
  const history = trimHistory(loadFocusHistory());
  const key = dateKey();
  history[key] = (Number(history[key]) || 0) + 1;
  try { localStorage.setItem(LS_HISTORY, JSON.stringify(history)); } catch(e) {}
  return history;
}

export function todaysFocusSessions(history) {
  return Number((history || loadFocusHistory())[dateKey()]) || 0;
}

// Consecutive days (ending today or yesterday, so a streak isn't broken
// just because today's session hasn't happened yet) with >=1 session.
export function currentStreak(history) {
  history = history || loadFocusHistory();
  const d = new Date();
  if (!history[dateKey(d)]) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (history[dateKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ── Focus log: intentions + reflections for completed sessions. ──
function isValidLogEntry(e) {
  return !!e && typeof e.at === 'number' && typeof e.minutes === 'number' && e.minutes > 0;
}

function persistLog(log) {
  try { localStorage.setItem(LS_LOG, JSON.stringify(log.slice(0, MAX_LOG_ENTRIES))); } catch(e) {}
}

export function loadFocusLog() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_LOG));
    return Array.isArray(parsed) ? parsed.filter(isValidLogEntry).slice(0, MAX_LOG_ENTRIES) : [];
  } catch(e) { return []; }
}

export function addFocusLogEntry(entry) {
  const log = [entry, ...loadFocusLog()].slice(0, MAX_LOG_ENTRIES);
  persistLog(log);
  return log;
}

export function updateFocusLogEntry(at, patch) {
  const log = loadFocusLog().map(e => e.at === at ? {...e, ...patch} : e);
  persistLog(log);
  return log;
}

// ── Backup / restore: everything lives only in this browser's localStorage,
// so export/import is the only thing standing between a cleared cache and
// permanently lost chains, streaks, and session history. ──
const SCHEMA_VERSION = 1;

export function exportAllData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    chains: loadChains(),
    focusHistory: loadFocusHistory(),
    focusLog: loadFocusLog(),
  };
}

// Same validation discipline as the loaders above — an imported file is
// just as untrusted as raw localStorage, arguably more so since a user can
// hand-edit or share it.
export function importAllData(data) {
  if (!data || typeof data !== 'object') return { ok: false, error: "That file isn't a valid Cadence backup." };
  const chains = Array.isArray(data.chains) ? data.chains.filter(isValidChain).slice(0, 8) : [];
  const focusHistory = data.focusHistory && typeof data.focusHistory === 'object' && !Array.isArray(data.focusHistory)
    ? data.focusHistory : {};
  const focusLog = Array.isArray(data.focusLog) ? data.focusLog.filter(isValidLogEntry).slice(0, MAX_LOG_ENTRIES) : [];
  try {
    localStorage.setItem(LS_CHAINS, JSON.stringify(chains));
    localStorage.setItem(LS_HISTORY, JSON.stringify(trimHistory(focusHistory)));
    localStorage.setItem(LS_LOG, JSON.stringify(focusLog));
  } catch(e) {
    return { ok: false, error: 'Could not write to local storage.' };
  }
  return { ok: true };
}

export function clearAllData() {
  try {
    localStorage.removeItem(LS_CHAINS);
    localStorage.removeItem(LS_HISTORY);
    localStorage.removeItem(LS_LOG);
  } catch(e) {}
}

// A rough, human-readable summary of what's on this device — the "see what's
// stored" gap the Settings page needs to close, without exposing raw JSON.
export function storedDataSummary() {
  const history = loadFocusHistory();
  const totalSessions = Object.values(history).reduce((a, n) => a + (Number(n) || 0), 0);
  return {
    chains: loadChains().length,
    focusDays: Object.keys(history).length,
    totalSessions,
    logEntries: loadFocusLog().length,
  };
}

// ── Preferences ──
export function isChimeMuted() {
  try { return localStorage.getItem(LS_MUTED) === '1'; } catch(e) { return false; }
}

export function setChimeMuted(muted) {
  try { localStorage.setItem(LS_MUTED, muted ? '1' : '0'); } catch(e) {}
}

// Notifications also require actual browser permission — this flag only
// records the user's intent, callers must still check Notification.permission.
export function isNotifsEnabled() {
  try { return localStorage.getItem(LS_NOTIFS) === '1'; } catch(e) { return false; }
}

export function setNotifsEnabled(enabled) {
  try { localStorage.setItem(LS_NOTIFS, enabled ? '1' : '0'); } catch(e) {}
}
