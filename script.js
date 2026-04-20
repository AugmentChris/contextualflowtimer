'use strict';

// ── Design Tokens ──
const V = {
  bg: '#0B0E11', surface: '#12161C', surfaceR: '#171C24',
  border: 'rgba(255,255,255,0.06)', borderH: 'rgba(255,255,255,0.12)',
  text: '#E8E6E3', textM: 'rgba(232,230,227,0.45)', textD: 'rgba(232,230,227,0.22)',
  accent: '#D4A053', accentM: 'rgba(212,160,83,0.13)', accentG: 'rgba(212,160,83,0.25)',
  teal: '#4ECDC4', tealM: 'rgba(78,205,196,0.10)',
  red: '#D94F4F', green: '#5CB97A',
  buf: '#7C8CF8', bufM: 'rgba(124,140,248,0.10)',
  mono: "'JetBrains Mono','Fira Code',monospace",
  sans: "'Sora',sans-serif",
};
const SC = ['#4ECDC4','#D4A053','#D94F4F','#7C8CF8','#5CB97A','#E0826E','#A78BFA','#5DADE2'];

// ── SVG Icons ──
const I = {
  chain: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  brain: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="10" y1="22" x2="14" y2="22"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>',
  stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
  restart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  trash: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  edit: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  hourglass: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14M5 20h14M7 4v3.5a5 5 0 0 0 2.5 4.33L12 13l2.5-1.17A5 5 0 0 0 17 7.5V4M7 20v-3.5a5 5 0 0 1 2.5-4.33L12 11l2.5 1.17A5 5 0 0 1 17 16.5V20"/></svg>',
  save: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  buffer: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M4.93 4.93l2.83 2.83M19.07 4.93l-2.83 2.83"/></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
};

// ── Routines (embedded — matches data/routines.json) ──
const ROUTINES = [
  { name:'Morning Coffee', tag:'Brew + enjoy', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Brew',minutes:4,color:'#8B5E3C'},{label:'Enjoy',minutes:6,color:'#D4A053'}]},
  { name:'Hydration + Supplements', tag:'Quick health boost', img:'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Hydrate & Supplements',minutes:5,color:'#4ECDC4'}]},
  { name:'Skincare Routine', tag:'Cleanse, treat, protect', img:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Cleanse',minutes:3,color:'#E0826E'},{label:'Treat & Moisturize',minutes:7,color:'#5CB97A'},{label:'SPF & Finish',minutes:5,color:'#D4A053'}]},
  { name:'Morning Meditation', tag:'Calm your start', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Settle In',minutes:3,color:'#7C8CF8'},{label:'Meditate',minutes:10,color:'#A78BFA'},{label:'Set Intention',minutes:2,color:'#5CB97A'}]},
  { name:'Quick Workout', tag:'Warm up, train, cool', img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Warm Up',minutes:5,color:'#E0826E'},{label:'Training',minutes:15,color:'#D94F4F'},{label:'Cool Down',minutes:5,color:'#4ECDC4'}]},
  { name:'Healthy Breakfast', tag:'Prep, cook, eat', img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Prep',minutes:10,color:'#5CB97A'},{label:'Cook',minutes:10,color:'#E0826E'},{label:'Eat',minutes:5,color:'#D4A053'}]},
  { name:'Journaling', tag:'Write, reflect, plan', img:'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Free Write',minutes:8,color:'#A78BFA'},{label:'Gratitude',minutes:4,color:'#5CB97A'},{label:'Intentions',minutes:3,color:'#D4A053'}]},
  { name:'News & Content', tag:'Headlines + deep read', img:'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Headlines',minutes:8,color:'#5DADE2'},{label:'Deep Read',minutes:12,color:'#7C8CF8'}]},
  { name:'Email & Slack Triage', tag:'Scan, reply, flag', img:'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Scan & Sort',minutes:8,color:'#4ECDC4'},{label:'Quick Replies',minutes:7,color:'#D4A053'},{label:'Flag Follow-ups',minutes:5,color:'#E0826E'}]},
  { name:'Plan the Day', tag:'Calendar + to-do', img:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Review Calendar',minutes:5,color:'#5DADE2'},{label:'Prioritize',minutes:7,color:'#D4A053'},{label:'Set Top 3',minutes:3,color:'#5CB97A'}]},
  { name:'Meeting Prep', tag:'Agenda + notes + buffer', img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Review Agenda',minutes:10,color:'#D4A053'},{label:'Prep Notes',minutes:15,color:'#4ECDC4'},{label:'Buffer',minutes:5,color:'#5CB97A'}]},
  { name:'Learning Session', tag:'Study + practice', img:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Study',minutes:25,color:'#7C8CF8'},{label:'Practice',minutes:10,color:'#5CB97A'}]},
  { name:'Content Creation', tag:'Draft, edit, publish', img:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Draft',minutes:20,color:'#A78BFA'},{label:'Edit',minutes:15,color:'#D4A053'},{label:'Publish',minutes:10,color:'#4ECDC4'}]},
  { name:'Admin Tasks', tag:'Invoices + expenses', img:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Invoicing',minutes:15,color:'#D4A053'},{label:'Expense Tracking',minutes:15,color:'#E0826E'}]},
  { name:'Deep Research', tag:'Read + take notes', img:'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Research',minutes:40,color:'#7C8CF8'},{label:'Notes & Summary',minutes:10,color:'#5CB97A'}]},
  { name:'Brainstorm', tag:'Ideate, organize, act', img:'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Free Ideation',minutes:15,color:'#A78BFA'},{label:'Organize',minutes:10,color:'#D4A053'},{label:'Action Items',minutes:5,color:'#4ECDC4'}]},
  { name:'Client Calls', tag:'Prep, call, debrief', img:'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Prep',minutes:5,color:'#5CB97A'},{label:'Call',minutes:25,color:'#D94F4F'},{label:'Notes',minutes:10,color:'#D4A053'}]},
  { name:'Data & Analytics', tag:'Pull, analyze, log', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Pull Data',minutes:8,color:'#5DADE2'},{label:'Analyze',minutes:12,color:'#7C8CF8'},{label:'Log Insights',minutes:5,color:'#5CB97A'}]},
  { name:'Email Batch', tag:'Reply, follow up, clean', img:'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Priority Replies',minutes:15,color:'#D94F4F'},{label:'Follow-ups',minutes:10,color:'#D4A053'},{label:'Archive',minutes:5,color:'#4ECDC4'}]},
  { name:'Laundry Cycle', tag:'Wash, transfer, dry', img:'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Wash',minutes:35,color:'#4ECDC4'},{label:'Transfer',minutes:5,color:'#D4A053'},{label:'Dry',minutes:60,color:'#D94F4F'}]},
  { name:'Kitchen Cleanup', tag:'Dishes + surfaces', img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Dishes',minutes:12,color:'#4ECDC4'},{label:'Wipe & Organize',minutes:8,color:'#5CB97A'}]},
  { name:'Quick Home Tidy', tag:'Declutter + dust', img:'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Declutter',minutes:10,color:'#E0826E'},{label:'Vacuum',minutes:10,color:'#4ECDC4'},{label:'Final Touch',minutes:5,color:'#5CB97A'}]},
  { name:'Meal Planning', tag:'Plan, prep, cook', img:'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop&q=80', buffer:true, stages:[{label:'Plan',minutes:10,color:'#D4A053'},{label:'Prep',minutes:15,color:'#5CB97A'},{label:'Cook',minutes:30,color:'#E0826E'}]},
  { name:'Grocery Planning', tag:'Check + list + route', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Check Pantry',minutes:5,color:'#5CB97A'},{label:'Build List',minutes:7,color:'#D4A053'},{label:'Plan Route',minutes:3,color:'#5DADE2'}]},
  { name:'Pet Care', tag:'Feed, walk, play', img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Feed',minutes:5,color:'#D4A053'},{label:'Walk',minutes:20,color:'#5CB97A'},{label:'Play',minutes:10,color:'#E0826E'}]},
  { name:'Plant Care', tag:'Water + prune', img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Water',minutes:8,color:'#4ECDC4'},{label:'Prune & Check',minutes:7,color:'#5CB97A'}]},
  { name:'Bills & Finance', tag:'Pay + review budget', img:'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Pay Bills',minutes:10,color:'#D94F4F'},{label:'Review Budget',minutes:10,color:'#D4A053'}]},
  { name:'Outfit Planning', tag:'Weather + pick + prep', img:'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Check Weather',minutes:2,color:'#5DADE2'},{label:'Choose Outfit',minutes:5,color:'#A78BFA'},{label:'Prep',minutes:3,color:'#D4A053'}]},
  { name:'Recycling Sort', tag:'Sort + take out', img:'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Sort',minutes:10,color:'#5CB97A'},{label:'Take Out',minutes:5,color:'#4ECDC4'}]},
  { name:'Evening Wind-Down', tag:'Screens off, unwind', img:'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Close Screens',minutes:5,color:'#A78BFA'},{label:'Light Reading',minutes:15,color:'#7C8CF8'},{label:'Prepare Space',minutes:10,color:'#4ECDC4'}]},
  { name:'Pre-Sleep Routine', tag:'Skincare, stretch, read', img:'https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Skincare',minutes:8,color:'#E0826E'},{label:'Stretch',minutes:10,color:'#5CB97A'},{label:'Read',minutes:7,color:'#7C8CF8'}]},
  { name:'Gratitude Reflection', tag:'Review your day', img:'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'3 Good Things',minutes:4,color:'#D4A053'},{label:'Reflect',minutes:4,color:'#A78BFA'},{label:'Set Tomorrow',minutes:2,color:'#5CB97A'}]},
  { name:'Evening Yoga', tag:'Gentle stretch + rest', img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Flow',minutes:5,color:'#5CB97A'},{label:'Deep Stretch',minutes:10,color:'#A78BFA'},{label:'Savasana',minutes:5,color:'#7C8CF8'}]},
  { name:'Digital Detox', tag:'Phone-free recharge', img:'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Silence Devices',minutes:2,color:'#D94F4F'},{label:'Offline Activity',minutes:50,color:'#5CB97A'},{label:'Gentle Return',minutes:8,color:'#4ECDC4'}]},
  { name:'Pomodoro Focus', tag:'Deep work sprint', img:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&q=80', buffer:false, stages:[{label:'Deep Work',minutes:25,color:'#D94F4F'},{label:'Break',minutes:5,color:'#5CB97A'}]},
];
const PAGES = Math.ceil(ROUTINES.length / 8);

// ── Audio ──
function playTone(f=660, d=200, t='sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = t;
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d/1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + d/1000);
  } catch(e) {}
}
function chime() { playTone(880,150); setTimeout(()=>playTone(1100,200),160); }
function softChime() { playTone(600,120,'triangle'); setTimeout(()=>playTone(750,150,'triangle'),140); }

// ── Utils ──
function fmt(s) {
  if (s < 0) s = 0;
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
}

function buildRT(stages, buf) {
  if (!buf || stages.length <= 1) return stages.map(s => ({...s, isBuffer:false}));
  const r = [];
  stages.forEach((s, i) => {
    r.push({...s, isBuffer:false});
    if (i < stages.length-1) r.push({label:'Wrap-up', minutes:5, color:V.buf, isBuffer:true});
  });
  return r;
}

// ── Live Count ──
let liveCount = 1247;
function startLiveCount() {
  setInterval(() => {
    liveCount = Math.max(800, liveCount + Math.floor(Math.random()*9) - 4);
    document.querySelectorAll('.live-count-val').forEach(el => {
      el.textContent = liveCount.toLocaleString();
    });
  }, 3200);
}

// ────────────────────────────────────
// APP STATE
// ────────────────────────────────────
let appTab = 'chain';

// Chain Timer State
const CS = {
  userChains: [],
  activeChain: null,
  running: false,
  stageIdx: 0,
  endTime: null,
  remaining: null,
  done: false,
  view: 'browse',
  editName: '',
  editStages: [{label:'', minutes:25, color:SC[0]}],
  editBuffer: false,
  editingIdx: null,
  page: 0,
  intervalId: null,
  autoCycleId: null,
  runtimeStages: [],
};

// Focus Room State
const FS = {
  dur: 25,
  customDur: '',
  showCustom: false,
  running: false,
  endTime: null,
  remaining: null,
  sessions: 0,
  intervalId: null,
};

// ── Computed chain values ──
function chainComputed() {
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const stageSec = (rt[si] ? rt[si].minutes : 0) * 60;
  const totalSec = rt.reduce((a,s) => a + s.minutes*60, 0);
  const elapsedBefore = rt.slice(0,si).reduce((a,s) => a + s.minutes*60, 0);
  const stageProgress = CS.remaining !== null && stageSec > 0 ? 1 - CS.remaining/stageSec : 0;
  const globalProgress = CS.remaining !== null && totalSec > 0
    ? (elapsedBefore + (stageSec - CS.remaining)) / totalSec : 0;
  const isBuffer = rt[si] ? rt[si].isBuffer : false;
  const currentColor = isBuffer ? V.buf : (rt[si] ? rt[si].color : V.accent);
  return { stageSec, totalSec, stageProgress, globalProgress, isBuffer, currentColor };
}

// ────────────────────────────────────
// CIRCULAR PROGRESS SVG
// ────────────────────────────────────
function circularProgressHTML(circleId, progress, color, size, stroke, innerHTML) {
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

function updateProgressCircle(circleId, progress, color, size, stroke) {
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

// ────────────────────────────────────
// STAGE BAR
// ────────────────────────────────────
function stageBarsHTML(stages, currentIdx, progress) {
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

function updateStageBars(stages, currentIdx, progress) {
  stages.forEach((s, i) => {
    const fill = document.getElementById(`sbfill-${i}`);
    if (!fill) return;
    fill.style.width = i < currentIdx ? '100%' : i === currentIdx ? `${Math.max(0,progress)*100}%` : '0%';
    fill.style.opacity = i <= currentIdx ? (s.isBuffer ? 0.7 : 1) : 0.15;
  });
}

// ────────────────────────────────────
// CHAIN TIMER — HTML GENERATORS
// ────────────────────────────────────

function chainBrowseHTML() {
  const hasCustom = CS.userChains.length > 0;
  const visible = ROUTINES.slice(CS.page*8, CS.page*8+8);
  return `<div style="display:flex;flex-direction:column;gap:20px">
    ${hasCustom ? `
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">Your Chains (${CS.userChains.length}/8)</div>
          ${CS.userChains.length < 8 ? `<button id="new-chain-btn" style="background:none;border:1px dashed ${V.borderH};border-radius:8px;color:${V.textM};cursor:pointer;font-size:11px;font-family:${V.sans};padding:5px 12px;display:flex;align-items:center;gap:5px">${I.plus} New</button>` : ''}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${CS.userChains.map((c,i) => `
            <div style="display:flex;align-items:center;gap:2px">
              <button data-ci="${i}" class="uc-select" style="padding:7px 16px;border-radius:20px;border:1.5px solid ${V.border};background:rgba(255,255,255,0.02);color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">${escHtml(c.name)}</button>
              <button data-ci="${i}" class="uc-edit" style="background:none;border:none;color:${V.textD};cursor:pointer;padding:3px;display:flex">${I.edit}</button>
              <button data-ci="${i}" class="uc-del" style="background:none;border:none;color:${V.textD};cursor:pointer;padding:3px;display:flex">${I.trash}</button>
            </div>`).join('')}
        </div>
      </div>` : ''}
    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">Popular Daily Routines</div>
    <div id="routines-grid" class="routines-grid-fade" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      ${visible.map((r,i) => routineCardHTML(r, CS.page*8+i)).join('')}
    </div>
    <div style="display:flex;justify-content:center;gap:6px;padding-top:4px">
      ${Array.from({length:PAGES}).map((_,i) => `
        <button class="page-dot" data-pg="${i}" style="width:${i===CS.page?20:6}px;height:6px;border-radius:3px;border:none;cursor:pointer;
          background:${i===CS.page?V.accent:'rgba(255,255,255,0.08)'};transition:all 0.35s cubic-bezier(0.4,0,0.2,1)"></button>`).join('')}
    </div>
    <button id="build-chain-btn" style="width:100%;padding:14px 0;border-radius:12px;border:1px dashed ${V.accent}55;background:${V.accentM};color:${V.accent};cursor:pointer;font-size:13px;font-family:${V.sans};font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
      ${I.plus} Build Custom Chain
    </button>
  </div>`;
}

function routineCardHTML(r, absIdx) {
  const totalMin = r.stages.reduce((a,s) => a+s.minutes, 0) + (r.buffer ? (r.stages.length-1)*5 : 0);
  return `<button class="routine-card" data-ri="${absIdx}" style="background:${V.surface};border:1px solid ${V.border};border-radius:12px;cursor:pointer;text-align:left;transition:all 0.3s ease;overflow:hidden;position:relative;height:140px;padding:0">
    <img src="${escAttr(r.img)}" alt="" loading="lazy" onload="this.style.opacity=1"
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.6s ease;filter:brightness(0.55) saturate(0.85)">
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(11,14,17,0.92) 0%,rgba(11,14,17,0.5) 40%,rgba(11,14,17,0.1) 70%,transparent 100%)"></div>
    ${r.buffer ? `<div style="position:absolute;top:6px;right:6px;z-index:2;display:flex;align-items:center;gap:3px;padding:2px 6px;border-radius:5px;background:rgba(124,140,248,0.3);backdrop-filter:blur(4px)">
      <span style="display:flex;color:${V.buf};transform:scale(0.6)">${I.buffer}</span>
      <span style="font-size:7px;color:#B8C0FF;font-family:${V.mono};font-weight:500">Buffer</span>
    </div>` : ''}
    <div style="position:absolute;bottom:0;left:0;right:0;padding:8px 10px 10px;z-index:2;display:flex;flex-direction:column;gap:3px">
      <div style="font-size:11px;color:#fff;font-family:${V.sans};font-weight:600;line-height:1.25;text-shadow:0 1px 4px rgba(0,0,0,0.5)">${escHtml(r.name)}</div>
      <div style="font-size:9px;color:rgba(255,255,255,0.55);font-family:${V.sans};line-height:1.2">${escHtml(r.tag)}</div>
      <div style="display:flex;gap:3px;align-items:center;margin-top:1px">
        ${r.stages.slice(0,3).map(s => `<div style="width:5px;height:5px;border-radius:1.5px;background:${s.color};opacity:0.9"></div>`).join('')}
        ${r.stages.length > 3 ? `<span style="font-size:7px;color:rgba(255,255,255,0.35);font-family:${V.mono}">+${r.stages.length-3}</span>` : ''}
        <span style="font-size:8px;color:rgba(255,255,255,0.4);font-family:${V.mono};margin-left:auto">${totalMin}m</span>
      </div>
    </div>
  </button>`;
}

function chainEditorHTML() {
  const isEdit = CS.editingIdx !== null;
  const validCount = CS.editStages.filter(s => s.label.trim() && s.minutes > 0).length;
  const showTotal = CS.editBuffer && validCount > 1;
  return `<div style="display:flex;flex-direction:column;gap:16px">
    <button id="editor-back" style="background:none;border:none;color:${V.textM};cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-family:${V.sans};padding:0">
      ${I.back} Back
    </button>
    <div style="background:${V.surface};border-radius:16px;padding:22px;border:1px solid ${V.border};display:flex;flex-direction:column;gap:16px">
      <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textD};font-family:${V.mono};font-weight:500">${isEdit ? 'Edit Chain' : 'Build Your Chain'}</div>
      <input id="chain-name-input" value="${escAttr(CS.editName)}" placeholder="Chain name (e.g. Morning Routine)"
        style="background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:10px;padding:10px 14px;color:${V.text};font-size:14px;font-family:${V.sans};outline:none;width:100%">
      <div id="stages-list" style="display:flex;flex-direction:column;gap:8px">
        ${editorStagesHTML()}
      </div>
      <button id="add-stage-btn" style="width:100%;padding:9px 0;border-radius:8px;border:1px dashed ${V.border};background:transparent;color:${V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};display:flex;align-items:center;justify-content:center;gap:6px">
        ${I.plus} Add Stage
      </button>
      <div id="buffer-toggle" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:12px;
        background:${CS.editBuffer?V.bufM:'rgba(255,255,255,0.02)'};
        border:1px solid ${CS.editBuffer?'rgba(124,140,248,0.18)':V.border};transition:all 0.3s ease;cursor:pointer">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="display:flex;color:${CS.editBuffer?V.buf:V.textD}">${I.buffer}</span>
          <div>
            <div style="font-size:13px;color:${CS.editBuffer?V.text:V.textM};font-family:${V.sans};font-weight:500">Smart Buffer (5 min wrap-up)</div>
            <div style="font-size:11px;color:${V.textD};font-family:${V.sans};margin-top:2px;line-height:1.4">Adds 5-minute breathing room between stages</div>
          </div>
        </div>
        <div style="width:42px;height:24px;border-radius:12px;padding:2px;background:${CS.editBuffer?V.buf:'rgba(255,255,255,0.1)'};transition:background 0.3s ease;flex-shrink:0;margin-left:12px">
          <div style="width:20px;height:20px;border-radius:10px;background:${CS.editBuffer?'#fff':'rgba(255,255,255,0.3)'};
            transform:${CS.editBuffer?'translateX(18px)':'translateX(0)'};
            transition:all 0.25s cubic-bezier(0.4,0,0.2,1);
            box-shadow:${CS.editBuffer?'0 2px 8px rgba(0,0,0,0.3)':'none'}"></div>
        </div>
      </div>
      ${showTotal ? `<div style="font-size:11px;color:${V.textD};font-family:${V.mono};text-align:center;padding:4px 0">
        ${(() => { const v=CS.editStages.filter(s=>s.label.trim()&&s.minutes>0); const b=v.reduce((a,s)=>a+s.minutes,0); const bf=(v.length-1)*5; return `Total: ${b+bf} min (${b}m + ${bf}m buffer)`; })()}
      </div>` : ''}
      <button id="save-chain-btn" style="width:100%;padding:11px 0;border-radius:10px;border:none;background:${V.accent};color:${V.bg};cursor:pointer;font-size:13px;font-family:${V.sans};font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px">
        ${I.save} ${isEdit ? 'Update Chain' : 'Save Chain'}
      </button>
    </div>
  </div>`;
}

function editorStagesHTML() {
  return CS.editStages.map((s,i) => `
    <div style="display:flex;gap:8px;align-items:center">
      <div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;background:${SC[i%SC.length]};display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:700;font-family:${V.mono}">${i+1}</div>
      <input class="stage-label" data-si="${i}" value="${escAttr(s.label)}" placeholder="Stage name"
        style="flex:1;background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:8px;padding:9px 12px;color:${V.text};font-size:13px;font-family:${V.sans};outline:none">
      ${minuteDialHTML(s.minutes, i)}
      ${CS.editStages.length > 1 ? `<button class="rm-stage" data-si="${i}" style="background:none;border:none;color:${V.red};cursor:pointer;padding:4px;display:flex;opacity:0.7">${I.x}</button>` : ''}
    </div>`).join('');
}

function minuteDialHTML(value, si) {
  return `<div style="display:flex;align-items:center;background:rgba(255,255,255,0.03);border:1px solid ${V.border};border-radius:10px;padding:0 4px;height:38px">
    <input type="text" inputmode="numeric" pattern="[0-9]*" value="${value}" data-si="${si}" class="min-input"
      style="width:32px;background:transparent;border:none;color:${V.text};font-size:13px;font-family:${V.mono};text-align:center;outline:none;padding:0">
    <span style="font-size:9px;color:${V.textD};font-family:${V.mono};margin-right:6px">min</span>
    <div style="display:flex;flex-direction:column;gap:1px;border-left:1px solid ${V.border};padding-left:5px;margin-left:2px">
      <button class="min-up" data-si="${si}" style="width:18px;height:15px;border-radius:4px 4px 1px 1px;border:none;cursor:pointer;background:transparent;color:${V.textD};display:flex;align-items:center;justify-content:center">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 0L8 5H0L4 0Z"/></svg>
      </button>
      <button class="min-down" data-si="${si}" style="width:18px;height:15px;border-radius:1px 1px 4px 4px;border:none;cursor:pointer;background:transparent;color:${V.textD};display:flex;align-items:center;justify-content:center">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 5L0 0H8L4 5Z"/></svg>
      </button>
    </div>
  </div>`;
}

function chainTimerViewHTML() {
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const { stageProgress, globalProgress, isBuffer, currentColor } = chainComputed();
  const displayTime = CS.remaining !== null ? fmt(CS.remaining) : fmt((rt[0] ? rt[0].minutes : 0)*60);
  const liveBarDisplay = CS.running && !isBuffer ? 'flex' : 'none';
  const bufBannerDisplay = CS.running && isBuffer && CS.remaining !== null ? 'flex' : 'none';

  const innerHTML = CS.done
    ? `<div style="text-align:center"><div style="color:${V.green};display:flex;justify-content:center;margin-bottom:8px">${I.check}</div><div style="font-size:13px;color:${V.textM};font-family:${V.sans}">Chain Complete</div></div>`
    : `<div id="ct-label" style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${currentColor};font-family:${V.mono};font-weight:500;margin-bottom:6px;font-style:${isBuffer?'italic':'normal'}">${isBuffer?'Wrap-up':(rt[si]?escHtml(rt[si].label):'Ready')}</div>
       <div id="ct-time" style="font-size:48px;font-weight:300;color:${V.text};font-family:${V.mono};letter-spacing:3px">${displayTime}</div>
       <div id="ct-stage-info" style="font-size:10px;color:${V.textD};font-family:${V.mono};margin-top:6px">stage ${si+1} of ${rt.length}</div>`;

  return `<div style="display:flex;flex-direction:column;gap:22px;align-items:center">
    <button id="timer-back" style="align-self:flex-start;background:none;border:none;color:${V.textM};cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-family:${V.sans};padding:0">
      ${I.back} Browse Routines
    </button>
    ${CS.activeChain ? `
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:14px;color:${V.text};font-family:${V.sans};font-weight:600">${escHtml(CS.activeChain.name)}</div>
        ${CS.activeChain.buffer ? `<div style="display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;background:${V.bufM};border:1px solid rgba(124,140,248,0.12)">
          <span style="display:flex;color:${V.buf};transform:scale(0.75)">${I.buffer}</span>
          <span style="font-size:10px;color:${V.buf};font-family:${V.mono};font-weight:500">Buffer</span>
        </div>` : ''}
      </div>
      <div id="stage-bar-wrap">${stageBarsHTML(rt, si, stageProgress)}</div>
      <div id="chain-progress-wrap">
        ${circularProgressHTML('chain-circle', globalProgress, currentColor, 240, 5, innerHTML)}
      </div>
      <div id="ct-buttons" style="display:flex;gap:14px;align-items:center">
        ${chainTimerBtnsHTML()}
      </div>
      <div id="ct-live-bar" style="display:${liveBarDisplay};align-items:center;gap:8px;padding:8px 18px;border-radius:24px;background:${V.tealM};border:1px solid rgba(78,205,196,0.10)">
        <div class="pulse-dot" style="width:6px;height:6px;border-radius:3px;background:${V.teal}"></div>
        <span style="font-size:12px;color:${V.textM};font-family:${V.sans}">
          <span class="live-count-val" style="color:${V.teal};font-weight:600;font-family:${V.mono}">${liveCount.toLocaleString()}</span> focusing with you
        </span>
      </div>
      <div id="ct-buf-banner" style="display:${bufBannerDisplay};align-items:center;gap:10px;padding:10px 18px;border-radius:12px;background:${V.bufM};border:1px solid rgba(124,140,248,0.15)">
        <span style="display:flex;color:${V.buf}">${I.buffer}</span>
        <div style="flex:1">
          <div style="font-size:12px;color:${V.buf};font-family:${V.sans};font-weight:600">Wrap-up time</div>
          <div style="font-size:11px;color:${V.textM};font-family:${V.sans};margin-top:1px">Prepare for your next task</div>
        </div>
        <div id="ct-buf-remaining" style="font-size:16px;font-weight:400;color:${V.buf};font-family:${V.mono};letter-spacing:1px">${CS.remaining !== null ? fmt(CS.remaining) : ''}</div>
      </div>
    ` : ''}
  </div>`;
}

function chainTimerBtnsHTML() {
  if (CS.done) return roundBtnHTML('ct-restart', I.restart, 'primary');
  if (CS.running) return roundBtnHTML('ct-stop', I.stop, 'danger');
  return roundBtnHTML('ct-start', I.play, 'primary');
}

function roundBtnHTML(id, icon, variant, size) {
  size = size || 52;
  const bg = variant==='danger' ? V.red : V.accent;
  const fg = variant==='danger' ? '#fff' : V.bg;
  const shadow = variant==='danger' ? 'none' : `0 4px 20px ${V.accentG}`;
  return `<button id="${id}" style="width:${size}px;height:${size}px;border-radius:50%;border:none;background:${bg};color:${fg};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;box-shadow:${shadow}">${icon}</button>`;
}

// ────────────────────────────────────
// CHAIN TIMER — LOGIC
// ────────────────────────────────────
function stopChainInterval() {
  if (CS.intervalId) { clearInterval(CS.intervalId); CS.intervalId = null; }
}

function stopAutoCycle() {
  if (CS.autoCycleId) { clearInterval(CS.autoCycleId); CS.autoCycleId = null; }
}

function startAutoCycle() {
  stopAutoCycle();
  CS.autoCycleId = setInterval(() => {
    goPage((CS.page + 1) % PAGES);
  }, 8000);
}

function goPage(p) {
  const grid = document.getElementById('routines-grid');
  if (!grid) return;
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(6px)';
  setTimeout(() => {
    CS.page = p;
    const visible = ROUTINES.slice(CS.page*8, CS.page*8+8);
    grid.innerHTML = visible.map((r,i) => routineCardHTML(r, CS.page*8+i)).join('');
    attachRoutineCardEvents();
    document.querySelectorAll('.page-dot').forEach((d,i) => {
      d.style.width = i === CS.page ? '20px' : '6px';
      d.style.background = i === CS.page ? V.accent : 'rgba(255,255,255,0.08)';
      d.dataset.pg = i;
    });
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 220);
}

function stopChain() {
  stopChainInterval();
  CS.running = false;
  CS.endTime = null;
  CS.remaining = null;
  CS.stageIdx = 0;
  CS.done = false;
}

function selectRoutine(r) {
  stopChain();
  CS.activeChain = r;
  CS.runtimeStages = buildRT(r.stages, r.buffer);
  CS.view = 'timer';
  renderChainContent();
}

function startChain() {
  if (!CS.runtimeStages.length) return;
  CS.endTime = Date.now() + CS.runtimeStages[0].minutes * 60 * 1000;
  CS.stageIdx = 0;
  CS.running = true;
  CS.done = false;
  CS.remaining = CS.runtimeStages[0].minutes * 60;
  chime();
  updateChainTimerButtons();
  updateChainLiveBar();
  startChainInterval();
}

function startChainInterval() {
  stopChainInterval();
  CS.intervalId = setInterval(() => {
    const diff = Math.max(0, Math.ceil((CS.endTime - Date.now()) / 1000));
    CS.remaining = diff;
    if (diff <= 0) {
      const nx = CS.stageIdx + 1;
      if (nx < CS.runtimeStages.length) {
        CS.runtimeStages[nx].isBuffer ? softChime() : chime();
        CS.stageIdx = nx;
        CS.endTime = Date.now() + CS.runtimeStages[nx].minutes * 60 * 1000;
        CS.remaining = CS.runtimeStages[nx].minutes * 60;
        refreshChainTimerInner();
        updateChainLiveBar();
      } else {
        chime();
        CS.done = true;
        CS.running = false;
        stopChainInterval();
        refreshChainTimerInner();
        updateChainTimerButtons();
        updateChainLiveBar();
      }
    } else {
      tickChainTimerDisplay();
    }
  }, 250);
}

function tickChainTimerDisplay() {
  const timeEl = document.getElementById('ct-time');
  if (timeEl && CS.remaining !== null) timeEl.textContent = fmt(CS.remaining);

  const { stageProgress, globalProgress, currentColor } = chainComputed();
  updateProgressCircle('chain-circle', globalProgress, currentColor, 240, 5);
  updateStageBars(CS.runtimeStages, CS.stageIdx, stageProgress);

  const bufBanner = document.getElementById('ct-buf-banner');
  const bufRem = document.getElementById('ct-buf-remaining');
  const { isBuffer } = chainComputed();
  if (bufBanner) bufBanner.style.display = (CS.running && isBuffer) ? 'flex' : 'none';
  if (bufRem && CS.remaining !== null) bufRem.textContent = fmt(CS.remaining);
}

function refreshChainTimerInner() {
  const { isBuffer, currentColor } = chainComputed();
  const rt = CS.runtimeStages;
  const si = CS.stageIdx;
  const inner = document.getElementById('chain-circle-inner');
  if (!inner) return;

  if (CS.done) {
    inner.innerHTML = `<div style="text-align:center"><div style="color:${V.green};display:flex;justify-content:center;margin-bottom:8px">${I.check}</div><div style="font-size:13px;color:${V.textM};font-family:${V.sans}">Chain Complete</div></div>`;
  } else {
    const displayTime = CS.remaining !== null ? fmt(CS.remaining) : fmt((rt[si] ? rt[si].minutes : 0)*60);
    inner.innerHTML = `
      <div id="ct-label" style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${currentColor};font-family:${V.mono};font-weight:500;margin-bottom:6px;font-style:${isBuffer?'italic':'normal'}">${isBuffer?'Wrap-up':escHtml(rt[si]?rt[si].label:'Ready')}</div>
      <div id="ct-time" style="font-size:48px;font-weight:300;color:${V.text};font-family:${V.mono};letter-spacing:3px">${displayTime}</div>
      <div id="ct-stage-info" style="font-size:10px;color:${V.textD};font-family:${V.mono};margin-top:6px">stage ${si+1} of ${rt.length}</div>`;
  }

  const sbWrap = document.getElementById('stage-bar-wrap');
  const { stageProgress, globalProgress } = chainComputed();
  if (sbWrap) sbWrap.innerHTML = stageBarsHTML(rt, si, stageProgress);
  updateProgressCircle('chain-circle', globalProgress, currentColor, 240, 5);
}

function updateChainTimerButtons() {
  const btns = document.getElementById('ct-buttons');
  if (!btns) return;
  btns.innerHTML = chainTimerBtnsHTML();
  attachChainTimerBtnEvents();
}

function updateChainLiveBar() {
  const { isBuffer } = chainComputed();
  const bar = document.getElementById('ct-live-bar');
  if (bar) bar.style.display = (CS.running && !isBuffer) ? 'flex' : 'none';
}

// ────────────────────────────────────
// CHAIN TIMER — EVENT BINDING
// ────────────────────────────────────
function renderChainContent() {
  const container = document.getElementById('chain-content');
  if (!container) return;
  stopAutoCycle();
  if (CS.view === 'browse') {
    container.innerHTML = chainBrowseHTML();
    attachChainBrowseEvents();
    startAutoCycle();
  } else if (CS.view === 'editor') {
    container.innerHTML = chainEditorHTML();
    attachChainEditorEvents();
  } else {
    container.innerHTML = chainTimerViewHTML();
    attachChainTimerEvents();
    if (CS.running) startChainInterval();
  }
}

function attachChainBrowseEvents() {
  const el = document.getElementById('chain-content');
  if (!el) return;

  el.querySelector('#build-chain-btn')?.addEventListener('click', () => openEditor(null));
  el.querySelector('#new-chain-btn')?.addEventListener('click', () => openEditor(null));

  el.querySelectorAll('.uc-select').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.ci;
    selectRoutine(CS.userChains[i]);
  }));
  el.querySelectorAll('.uc-edit').forEach(b => b.addEventListener('click', () => openEditor(+b.dataset.ci)));
  el.querySelectorAll('.uc-del').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.ci;
    if (CS.activeChain === CS.userChains[i]) CS.activeChain = null;
    CS.userChains.splice(i, 1);
    CS.view = 'browse';
    renderChainContent();
  }));

  attachRoutineCardEvents();

  el.querySelectorAll('.page-dot').forEach(b => b.addEventListener('click', () => {
    stopAutoCycle();
    goPage(+b.dataset.pg);
    startAutoCycle();
  }));
}

function attachRoutineCardEvents() {
  document.querySelectorAll('.routine-card').forEach(b => b.addEventListener('click', () => {
    selectRoutine(ROUTINES[+b.dataset.ri]);
  }));
}

function attachChainEditorEvents() {
  const el = document.getElementById('chain-content');
  if (!el) return;

  el.querySelector('#editor-back')?.addEventListener('click', () => {
    CS.view = CS.activeChain ? 'timer' : 'browse';
    renderChainContent();
  });

  el.querySelector('#chain-name-input')?.addEventListener('input', e => { CS.editName = e.target.value; });

  el.querySelectorAll('.stage-label').forEach(inp => inp.addEventListener('input', e => {
    CS.editStages[+inp.dataset.si].label = e.target.value;
  }));

  el.querySelectorAll('.min-input').forEach(inp => inp.addEventListener('change', e => {
    const v = parseInt(e.target.value);
    if (!isNaN(v) && v >= 1 && v <= 999) CS.editStages[+inp.dataset.si].minutes = v;
    else e.target.value = CS.editStages[+inp.dataset.si].minutes;
  }));

  el.querySelectorAll('.min-up').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages[si].minutes = Math.min(999, CS.editStages[si].minutes + 1);
    rerenderEditorStages();
  }));
  el.querySelectorAll('.min-down').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages[si].minutes = Math.max(1, CS.editStages[si].minutes - 1);
    rerenderEditorStages();
  }));

  el.querySelectorAll('.rm-stage').forEach(btn => btn.addEventListener('click', () => {
    const si = +btn.dataset.si;
    CS.editStages.splice(si, 1);
    rerenderEditorStages();
    updateEditorTotal();
  }));

  el.querySelector('#add-stage-btn')?.addEventListener('click', () => {
    CS.editStages.push({label:'', minutes:5, color:SC[CS.editStages.length % SC.length]});
    rerenderEditorStages();
  });

  el.querySelector('#buffer-toggle')?.addEventListener('click', () => {
    CS.editBuffer = !CS.editBuffer;
    CS.view = 'editor';
    renderChainContent();
  });

  el.querySelector('#save-chain-btn')?.addEventListener('click', saveChain);
}

function rerenderEditorStages() {
  const list = document.getElementById('stages-list');
  if (list) {
    list.innerHTML = editorStagesHTML();
    attachChainEditorEvents();
  }
  updateEditorTotal();
}

function updateEditorTotal() {
  const totalEl = document.getElementById('editor-total');
  if (!CS.editBuffer) return;
  const v = CS.editStages.filter(s => s.label.trim() && s.minutes > 0);
  if (v.length <= 1) return;
  const b = v.reduce((a,s) => a+s.minutes, 0);
  const bf = (v.length-1)*5;
  if (totalEl) totalEl.textContent = `Total: ${b+bf} min (${b}m + ${bf}m buffer)`;
}

function openEditor(idx) {
  if (idx !== null && CS.userChains[idx]) {
    const c = CS.userChains[idx];
    CS.editName = c.name;
    CS.editStages = c.stages.map(s => ({...s}));
    CS.editBuffer = c.buffer || false;
    CS.editingIdx = idx;
  } else {
    CS.editName = '';
    CS.editStages = [{label:'', minutes:25, color:SC[0]}];
    CS.editBuffer = false;
    CS.editingIdx = null;
  }
  stopChain();
  CS.view = 'editor';
  renderChainContent();
}

function saveChain() {
  const valid = CS.editStages.filter(s => s.label.trim() && s.minutes > 0);
  if (!valid.length) return;
  const chain = {
    name: CS.editName.trim() || `Chain ${CS.userChains.length + 1}`,
    stages: valid,
    buffer: CS.editBuffer,
  };
  if (CS.editingIdx !== null) {
    CS.userChains[CS.editingIdx] = chain;
  } else if (CS.userChains.length < 8) {
    CS.userChains.push(chain);
  }
  CS.activeChain = chain;
  CS.runtimeStages = buildRT(chain.stages, chain.buffer);
  CS.editingIdx = null;
  CS.view = 'timer';
  renderChainContent();
}

function attachChainTimerEvents() {
  document.getElementById('timer-back')?.addEventListener('click', () => {
    stopChain();
    CS.view = 'browse';
    renderChainContent();
  });
  attachChainTimerBtnEvents();
}

function attachChainTimerBtnEvents() {
  document.getElementById('ct-start')?.addEventListener('click', startChain);
  document.getElementById('ct-stop')?.addEventListener('click', () => {
    stopChain();
    updateChainTimerButtons();
    updateChainLiveBar();
    const timeEl = document.getElementById('ct-time');
    if (timeEl && CS.runtimeStages[0]) timeEl.textContent = fmt(CS.runtimeStages[0].minutes * 60);
    updateProgressCircle('chain-circle', 0, CS.runtimeStages[0] ? CS.runtimeStages[0].color : V.accent, 240, 5);
    updateStageBars(CS.runtimeStages, 0, 0);
  });
  document.getElementById('ct-restart')?.addEventListener('click', () => {
    CS.done = false;
    startChain();
  });
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

function focusRoomHTML() {
  const progress = FS.remaining !== null && FS.dur > 0 ? 1 - FS.remaining/(FS.dur*60) : 0;
  const durs = [15,25,30,60,90];
  const showPicker = !FS.running && FS.remaining === null;
  const isCustom = !durs.includes(FS.dur) || FS.showCustom;

  return `<div style="display:flex;flex-direction:column;gap:28px;align-items:center">
    <div style="width:100%;padding:30px 20px;border-radius:20px;text-align:center;background:radial-gradient(ellipse at 50% 40%,rgba(78,205,196,0.05) 0%,transparent 65%);border:1px solid rgba(78,205,196,0.07);position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;opacity:0.12;padding:20px;pointer-events:none">
        ${Array.from({length:40}).map((_,i) => `<div style="width:3px;height:3px;border-radius:50%;background:${V.teal};animation:pulse ${2+((i*7)%4)}s infinite ${(i*3)%3}s"></div>`).join('')}
      </div>
      <div style="position:relative;z-index:1">
        <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px">
          <div class="pulse-dot" style="width:7px;height:7px;border-radius:50%;background:${V.teal};box-shadow:0 0 12px ${V.teal}88"></div>
          <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${V.textM};font-family:${V.mono};font-weight:500">Live Focus Room</div>
        </div>
        <div style="font-size:52px;font-weight:200;color:${V.teal};font-family:${V.mono};letter-spacing:4px">
          <span class="live-count-val">${liveCount.toLocaleString()}</span>
        </div>
        <div style="font-size:13px;color:${V.textM};font-family:${V.sans};margin-top:6px">people focusing right now</div>
      </div>
    </div>

    ${showPicker ? `
      <div style="display:flex;flex-direction:column;gap:10px;align-items:center">
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
          ${durs.map(d => `<button class="dur-pill" data-dur="${d}" style="padding:7px 16px;border-radius:20px;border:${FS.dur===d&&!FS.showCustom?`1.5px solid ${V.teal}`:`1.5px solid ${V.border}`};background:${FS.dur===d&&!FS.showCustom?`${V.teal}18`:'rgba(255,255,255,0.02)'};color:${FS.dur===d&&!FS.showCustom?V.teal:V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">${d}m</button>`).join('')}
          <button id="custom-dur-btn" style="padding:7px 16px;border-radius:20px;border:${isCustom?`1.5px solid ${V.accent}`:`1.5px solid ${V.border}`};background:${isCustom?`${V.accent}18`:'rgba(255,255,255,0.02)'};color:${isCustom?V.accent:V.textM};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:500;white-space:nowrap">Custom</button>
        </div>
        ${FS.showCustom ? `
          <div style="display:flex;gap:8px;align-items:center;animation:fadeIn 0.2s ease">
            <div style="display:flex;align-items:center;gap:4px;background:${V.surface};border:1px solid ${V.border};border-radius:10px;padding:0 12px">
              <input id="custom-dur-input" type="number" value="${FS.customDur}" min="1" max="999" placeholder="min" autofocus
                style="width:56px;background:transparent;border:none;color:${V.text};font-size:14px;font-family:${V.mono};text-align:center;outline:none;padding:10px 0">
              <span style="font-size:10px;color:${V.textD};font-family:${V.mono}">min</span>
            </div>
            <button id="custom-dur-set" style="background:${V.accent};border:none;border-radius:10px;padding:10px 18px;color:${V.bg};cursor:pointer;font-size:12px;font-family:${V.sans};font-weight:600">Set</button>
          </div>` : ''}
      </div>` : ''}

    <div id="focus-progress-wrap">
      ${circularProgressHTML('focus-circle', progress, V.teal, 210, 4, focusInnerHTML())}
    </div>

    <div id="focus-buttons" style="display:flex;gap:14px">
      ${focusBtnsHTML()}
    </div>

    <div style="display:flex;gap:28px;justify-content:center">
      <div style="text-align:center">
        <div style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${FS.sessions}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">sessions today</div>
      </div>
      <div style="width:1px;background:${V.border};align-self:stretch"></div>
      <div style="text-align:center">
        <div id="focus-mins-total" style="font-size:26px;font-weight:300;color:${V.text};font-family:${V.mono}">${FS.sessions*FS.dur}</div>
        <div style="font-size:10px;color:${V.textD};font-family:${V.sans};margin-top:2px">minutes focused</div>
      </div>
    </div>
  </div>`;
}

function focusBtnsHTML() {
  if (!FS.running && (FS.remaining === null || FS.remaining > 0)) return roundBtnHTML('focus-start', I.play, 'primary');
  if (!FS.running && FS.remaining === 0) return roundBtnHTML('focus-restart', I.restart, 'primary');
  return roundBtnHTML('focus-stop', I.stop, 'danger');
}

// ────────────────────────────────────
// FOCUS ROOM — LOGIC
// ────────────────────────────────────
function stopFocusInterval() {
  if (FS.intervalId) { clearInterval(FS.intervalId); FS.intervalId = null; }
}

function startFocus() {
  FS.endTime = Date.now() + FS.dur * 60 * 1000;
  FS.running = true;
  FS.showCustom = false;
  chime();
  updateFocusButtons();
  startFocusInterval();
}

function stopFocus() {
  stopFocusInterval();
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
      FS.running = false;
      FS.sessions++;
      stopFocusInterval();
      renderFocusContent();
    }
  }, 250);
}

function updateFocusButtons() {
  const el = document.getElementById('focus-buttons');
  if (el) {
    el.innerHTML = focusBtnsHTML();
    attachFocusBtnEvents();
  }
}

function renderFocusContent() {
  const container = document.getElementById('focus-content');
  if (!container) return;
  container.innerHTML = focusRoomHTML();
  attachFocusEvents();
  if (FS.running) startFocusInterval();
}

function attachFocusEvents() {
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
  attachFocusBtnEvents();
}

function attachFocusBtnEvents() {
  document.getElementById('focus-start')?.addEventListener('click', startFocus);
  document.getElementById('focus-stop')?.addEventListener('click', stopFocus);
  document.getElementById('focus-restart')?.addEventListener('click', () => { FS.remaining = null; renderFocusContent(); });
}

// ────────────────────────────────────
// APP SHELL
// ────────────────────────────────────
function tabBarHTML() {
  const tabs = [
    {id:'chain', label:'Chain Timer', icon:I.chain},
    {id:'room', label:'Focus Room', icon:I.brain},
  ];
  return `<div style="display:flex;gap:2px;background:${V.surface};border-radius:14px;padding:3px;border:1px solid ${V.border}">
    ${tabs.map(t => `<button data-tab="${t.id}" style="flex:1;padding:12px 8px;border-radius:12px;border:none;cursor:pointer;
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
  startLiveCount();
}

// ── Helper: escape HTML ──
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

document.addEventListener('DOMContentLoaded', mountApp);
