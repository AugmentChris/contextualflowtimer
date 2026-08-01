// ── Ambient Pulse (simulated — not real user data) ──
export let ambientPulse = 1247;

export function startAmbientPulse() {
  setInterval(() => {
    ambientPulse = Math.max(800, ambientPulse + Math.floor(Math.random()*9) - 4);
    document.querySelectorAll('.ambient-pulse-val').forEach(el => {
      el.textContent = ambientPulse.toLocaleString();
    });
  }, 3200);
}
