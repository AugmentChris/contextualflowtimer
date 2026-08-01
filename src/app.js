import { V } from './tokens.js';
import { I } from './icons.js';
import { renderChainContent } from './chain.js';
import { renderFocusContent } from './focus.js';
import { startAmbientPulse } from './ambient.js';

let appTab = 'chain';

function tabBarHTML() {
  const tabs = [
    {id:'chain', label:'Chain Timer', icon:I.chain},
    {id:'room', label:'Focus Room', icon:I.brain},
  ];
  return `<div role="tablist" style="display:flex;gap:2px;background:${V.surface};border-radius:14px;padding:3px;border:1px solid ${V.border}">
    ${tabs.map(t => `<button data-tab="${t.id}" role="tab" aria-selected="${appTab===t.id}" style="flex:1;padding:12px 8px;border-radius:12px;border:none;cursor:pointer;
      background:${appTab===t.id?'rgba(255,255,255,0.07)':'transparent'};
      color:${appTab===t.id?V.text:V.textM};
      font-size:13px;font-family:${V.sans};font-weight:500;transition:all 0.25s ease;
      display:flex;align-items:center;justify-content:center;gap:8px">
      <span style="opacity:${appTab===t.id?1:0.5};display:flex">${t.icon}</span><span>${t.label}</span>
    </button>`).join('')}
  </div>`;
}

function renderTabContent() {
  const el = document.getElementById('tab-content');
  if (!el) return;
  if (appTab === 'chain') {
    el.innerHTML = `<div id="chain-content" class="anim-fade-in"></div>`;
    renderChainContent();
  } else {
    el.innerHTML = `<div id="focus-content" class="anim-fade-in"></div>`;
    renderFocusContent();
  }
}

function mountApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="min-height:100vh;background:${V.bg};color:${V.text};font-family:${V.sans};display:flex;flex-direction:column;align-items:center;padding:0 16px 60px">
      <div class="anim-fade-up" style="width:100%;max-width:560px;padding-top:44px;margin-bottom:36px">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,${V.accent},#B8863A);display:flex;align-items:center;justify-content:center;color:${V.bg};box-shadow:0 4px 24px ${V.accentG}">${I.hourglass}</div>
          <div>
            <h1 style="font-size:21px;font-weight:600;letter-spacing:-0.5px;color:${V.text};font-family:${V.sans};line-height:1.2">Contextual Flow</h1>
            <div style="font-size:10px;color:${V.textD};font-family:${V.mono};letter-spacing:1.5px;text-transform:uppercase;margin-top:2px">time that adapts to the task</div>
          </div>
        </div>
      </div>
      <div class="anim-fade-up-delay" style="width:100%;max-width:560px;display:flex;flex-direction:column;gap:28px">
        <div id="tab-bar">${tabBarHTML()}</div>
        <div id="tab-content"></div>
      </div>
      <div style="margin-top:52px;font-size:10px;color:${V.textD};font-family:${V.mono};text-align:center;letter-spacing:0.5px">No account needed &middot; Data stays in your browser &middot; Built for flow</div>
    </div>`;

  function onTabClick(e) {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    appTab = btn.dataset.tab;
    const tb = document.getElementById('tab-bar');
    tb.innerHTML = tabBarHTML();
    tb.addEventListener('click', onTabClick);
    renderTabContent();
  }
  document.getElementById('tab-bar').addEventListener('click', onTabClick);

  renderTabContent();
  startAmbientPulse();
}

document.addEventListener('DOMContentLoaded', mountApp);
