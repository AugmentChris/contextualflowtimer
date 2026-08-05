import { exportAllData, importAllData } from './persistence.js';

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportBackup() {
  const date = new Date().toISOString().slice(0, 10);
  downloadJSON(exportAllData(), `cadence-backup-${date}.json`);
}

export function importBackup(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try { parsed = JSON.parse(reader.result); }
    catch(e) { onDone({ ok: false, error: "That file isn't valid JSON." }); return; }
    onDone(importAllData(parsed));
  };
  reader.onerror = () => onDone({ ok: false, error: 'Could not read that file.' });
  reader.readAsText(file);
}
