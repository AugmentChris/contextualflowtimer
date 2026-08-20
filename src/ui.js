import { V } from './tokens.js';
import { escHtml, escAttr } from './utils.js';

// ── Circular Progress SVG ──
export function circularProgressHTML(circleId, progress, color, size, stroke, innerHTML) {
  size = size || 220; stroke = stroke || 5;
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(1, Math.max(0, progress)));
  return `<div style="position:relative;width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${stroke}"/>
      <circle id="${circleId}" cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
        stroke="${color}" stroke-width="${stroke}"
        stroke-dasharray="${circ}" stroke-dashoffset="${off}" stroke-linecap="round"
        style="transition:stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1),stroke 0.3s ease;filter:drop-shadow(0 0 8px ${color}44)"/>
    </svg>
    <div id="${circleId}-inner" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
      ${innerHTML || ''}
    </div>
  </div>`;
}

export function updateProgressCircle(circleId, progress, color, size, stroke) {
  size = size || 220; stroke = stroke || 5;
  const el = document.getElementById(circleId);
  if (!el) return;
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(1, Math.max(0, progress)));
  el.setAttribute('stroke-dashoffset', off);
  el.setAttribute('stroke', color);
  el.style.filter = `drop-shadow(0 0 8px ${color}44)`;
}

// ── Stage Bar ──
export function stageBarsHTML(stages, currentIdx, progress) {
  return `<div style="display:flex;gap:2px;width:100%;max-width:440px">
    ${stages.map((s,i) => `
      <div style="flex:${Math.max(s.minutes,2)};display:flex;flex-direction:column;gap:5px">
        <div style="height:${s.isBuffer?2:3}px;border-radius:2px;overflow:hidden;background:rgba(255,255,255,0.05)">
          <div id="sbfill-${i}" style="height:100%;border-radius:2px;background:${s.color};
            width:${i<currentIdx?'100%':i===currentIdx?Math.max(0,progress)*100+'%':'0%'};
            transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
            opacity:${i<=currentIdx?(s.isBuffer?0.7:1):0.15}"></div>
        </div>
        <span style="font-size:8px;letter-spacing:0.4px;text-transform:uppercase;
          color:${i===currentIdx?(s.isBuffer?V.buf:V.text):V.textD};text-align:center;
          font-family:${V.mono};font-weight:${i===currentIdx?500:400};
          font-style:${s.isBuffer?'italic':'normal'};
          opacity:${s.isBuffer&&i!==currentIdx?0.4:1}">${escHtml(s.label)}</span>
      </div>`).join('')}
  </div>`;
}

export function updateStageBars(stages, currentIdx, progress) {
  stages.forEach((s, i) => {
    const fill = document.getElementById(`sbfill-${i}`);
    if (!fill) return;
    fill.style.width = i < currentIdx ? '100%' : i === currentIdx ? `${Math.max(0,progress)*100}%` : '0%';
    fill.style.opacity = i <= currentIdx ? (s.isBuffer ? 0.7 : 1) : 0.15;
  });
}

// ── Logo animation (plays once whenever a chain or focus timer starts) ──
let logoAnimTimer = null;
export function playLogoStartAnimation() {
  const el = document.getElementById('logo-icon');
  if (!el) return;
  el.classList.remove('anim-timer-start');
  void el.offsetWidth; // reflow so the animation can replay from scratch
  el.classList.add('anim-timer-start');
  clearTimeout(logoAnimTimer);
  logoAnimTimer = setTimeout(() => el.classList.remove('anim-timer-start'), 1700);
}

// ── Round Icon Button ──
export function roundBtnHTML(id, icon, variant, label, size) {
  size = size || 52;
  const bg = variant==='danger' ? V.red : V.accent;
  const fg = variant==='danger' ? '#fff' : V.bg;
  const shadow = variant==='danger' ? 'none' : `0 4px 20px ${V.accentG}`;
  return `<button id="${id}" aria-label="${escAttr(label)}" style="width:${size}px;height:${size}px;border-radius:50%;border:none;background:${bg};color:${fg};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;box-shadow:${shadow}">${icon}</button>`;
}
