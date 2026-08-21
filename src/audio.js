// ── Audio ──
import { isChimeMuted } from './persistence.js';

// A single AudioContext is created lazily and reused for every tone.
// (Creating a fresh one per chime and never closing it leaks a live
// audio-processing context each time — over a long session this can
// exhaust the browser's context limit and silence future chimes.)
let sharedCtx = null;

export function getAudioContext() {
  if (!sharedCtx) {
    try { sharedCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {});
  return sharedCtx;
}

export function playTone(f=660, d=200, t='sine', g=0.22) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = t;
    osc.frequency.value = f;
    gain.gain.setValueAtTime(g, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d/1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + d/1000);
  } catch(e) {}
}

// Three ascending notes at a higher gain than softChime — this is the "pay
// attention" sound (session/stage end), so it's deliberately louder and
// longer than a single beep, which is easy to miss if you're not looking.
export function chime() {
  if (isChimeMuted()) return;
  playTone(880, 180, 'sine', 0.32);
  setTimeout(() => playTone(1100, 220, 'sine', 0.34), 170);
  setTimeout(() => playTone(1320, 280, 'sine', 0.34), 370);
}
export function softChime() { if (isChimeMuted()) return; playTone(600,120,'triangle'); setTimeout(()=>playTone(750,150,'triangle'),140); }
