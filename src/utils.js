import { V } from './tokens.js';

export function fmt(s) {
  if (s < 0) s = 0;
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
}

export function buildRT(stages, buf) {
  if (!buf || stages.length <= 1) return stages.map(s => ({...s, isBuffer:false}));
  const r = [];
  stages.forEach((s, i) => {
    r.push({...s, isBuffer:false});
    if (i < stages.length-1) r.push({label:'Wrap-up', minutes:5, color:V.buf, isBuffer:true});
  });
  return r;
}

export function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function escAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
