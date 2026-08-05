import { V } from './tokens.js';
import { storedDataSummary, isChimeMuted, setChimeMuted, clearAllData } from './persistence.js';
import { exportBackup, importBackup } from './backup.js';
import { notifsSupported, notifsActive, notifsBlocked, enableNotifications, disableNotifications } from './notifications.js';

function summaryLine() {
  const s = storedDataSummary();
  if (s.chains === 0 && s.totalSessions === 0) return 'Nothing stored yet.';
  const parts = [];
  if (s.chains > 0) parts.push(`${s.chains} custom chain${s.chains === 1 ? '' : 's'}`);
  if (s.totalSessions > 0) parts.push(`${s.totalSessions} focus session${s.totalSessions === 1 ? '' : 's'} across ${s.focusDays} day${s.focusDays === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

function sectionLabelHTML(label) {
  return `<div style="font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">${label}</div>`;
}

export function settingsPanelHTML() {
  return `
    <div style="display:flex;flex-direction:column;gap:6px">
      ${sectionLabelHTML('About')}
      <div style="font-size:12px;color:${V.textM};font-family:${V.sans};line-height:1.6">Cadence is a timer built to match the shape of the task, not a generic clock. There's no account, no sign-up, and nothing to configure before you start.</div>
    </div>
    <div style="height:1px;background:${V.border}"></div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${sectionLabelHTML('Privacy')}
      <div style="font-size:12px;color:${V.textM};font-family:${V.sans};line-height:1.6">Everything — chains, streaks, session history — is stored only in this browser's local storage. Nothing is sent to a server, there's no analytics, and no tracking of any kind. Clearing your browser data or switching devices erases it, which is why backups (below) exist.</div>
    </div>
    <div style="height:1px;background:${V.border}"></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${sectionLabelHTML('Preferences')}
      <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-size:12px;color:${V.text};font-family:${V.sans}">
        <span>Mute session-end chime</span>
        <input id="mute-toggle" type="checkbox" ${isChimeMuted() ? 'checked' : ''} style="width:16px;height:16px;accent-color:${V.accent};cursor:pointer">
      </label>
      ${notifsSupported() ? `
        <label style="display:flex;align-items:center;justify-content:space-between;cursor:${notifsBlocked()?'not-allowed':'pointer'};font-size:12px;color:${V.text};font-family:${V.sans}">
          <span>Notify me when a session ends</span>
          <input id="notif-toggle" type="checkbox" ${notifsActive() ? 'checked' : ''} ${notifsBlocked() ? 'disabled' : ''} style="width:16px;height:16px;accent-color:${V.accent};cursor:${notifsBlocked()?'not-allowed':'pointer'}">
        </label>
        <div id="notif-note" style="font-size:11px;color:${V.textD};font-family:${V.sans};line-height:1.5;display:${notifsBlocked()?'block':'none'}">Blocked in your browser's site settings — enable notifications for this site there, then reload.</div>
      ` : ''}
    </div>
    <div style="height:1px;background:${V.border}"></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${sectionLabelHTML('Your Data')}
      <div id="data-summary" style="font-size:12px;color:${V.textM};font-family:${V.sans};line-height:1.5">${summaryLine()}</div>
      <div style="display:flex;gap:8px">
        <button id="export-btn" style="flex:1;padding:10px;border-radius:8px;border:none;background:${V.accentM};color:${V.accent};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Export Backup</button>
        <button id="import-btn" style="flex:1;padding:10px;border-radius:8px;border:1px solid ${V.borderH};background:transparent;color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Import Backup</button>
      </div>
      <input id="import-file" type="file" accept="application/json" style="display:none">
      <div id="import-status" style="font-size:11px;font-family:${V.sans};display:none"></div>
      <button id="clear-data-btn" style="padding:10px;border-radius:8px;border:1px solid ${V.red}55;background:transparent;color:${V.red};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Clear All Data</button>
    </div>`;
}

export function attachSettingsHandlers(panel) {
  panel.querySelector('#mute-toggle').addEventListener('change', (e) => {
    setChimeMuted(e.target.checked);
  });

  const notifToggle = panel.querySelector('#notif-toggle');
  if (notifToggle) {
    notifToggle.addEventListener('change', async (e) => {
      const checkbox = e.target;
      const note = panel.querySelector('#notif-note');
      if (checkbox.checked) {
        checkbox.disabled = true;
        const granted = await enableNotifications();
        checkbox.disabled = notifsBlocked();
        checkbox.checked = granted;
        if (note) note.style.display = notifsBlocked() ? 'block' : 'none';
      } else {
        disableNotifications();
      }
    });
  }

  panel.querySelector('#export-btn').addEventListener('click', exportBackup);

  const importFile = panel.querySelector('#import-file');
  const importStatus = panel.querySelector('#import-status');

  panel.querySelector('#import-btn').addEventListener('click', () => importFile.click());

  importFile.addEventListener('change', () => {
    const file = importFile.files[0];
    importFile.value = '';
    if (!file) return;
    if (!confirm('This replaces your current chains and history with the backup file. Continue?')) return;
    importBackup(file, (result) => {
      importStatus.style.display = 'block';
      if (result.ok) {
        importStatus.style.color = V.green;
        importStatus.textContent = 'Backup restored. Reloading…';
        setTimeout(() => location.reload(), 900);
      } else {
        importStatus.style.color = V.red;
        importStatus.textContent = result.error || 'Import failed.';
      }
    });
  });

  panel.querySelector('#clear-data-btn').addEventListener('click', () => {
    if (!confirm('This permanently deletes all custom chains, streak history, and session logs stored in this browser. This cannot be undone. Continue?')) return;
    clearAllData();
    location.reload();
  });
}
