import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   CONTEXTUAL FLOW TIMER — "Time that adapts to the task."
   ═══════════════════════════════════════════════════ */

// ── SVG ICONS ──
const I = {
  chain: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  brain: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="10" y1="22" x2="14" y2="22"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  play: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>,
  stop: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>,
  restart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  hourglass: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14M5 20h14M7 4v3.5a5 5 0 0 0 2.5 4.33L12 13l2.5-1.17A5 5 0 0 0 17 7.5V4M7 20v-3.5a5 5 0 0 1 2.5-4.33L12 11l2.5 1.17A5 5 0 0 1 17 16.5V20"/></svg>,
  save: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  buffer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M4.93 4.93l2.83 2.83M19.07 4.93l-2.83 2.83"/></svg>,
  back: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

// ── Sound ──
const playTone = (f=660,d=200,t="sine") => { try { const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(0.22,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d/1000);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d/1000);} catch(e){} };
const chime = () => { playTone(880,150); setTimeout(()=>playTone(1100,200),160); };
const softChime = () => { playTone(600,120,"triangle"); setTimeout(()=>playTone(750,150,"triangle"),140); };
const fmt = (s) => { if(s<0)s=0; const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60; return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`; };
const useLiveCount = () => { const [c,setC]=useState(1247); useEffect(()=>{const id=setInterval(()=>{setC(v=>Math.max(800,v+Math.floor(Math.random()*9)-4));},3200);return()=>clearInterval(id);},[]);return c;};

// ── Design Tokens ──
const V = {
  bg:"#0B0E11", surface:"#12161C", surfaceR:"#171C24",
  border:"rgba(255,255,255,0.06)", borderH:"rgba(255,255,255,0.12)",
  text:"#E8E6E3", textM:"rgba(232,230,227,0.45)", textD:"rgba(232,230,227,0.22)",
  accent:"#D4A053", accentM:"rgba(212,160,83,0.13)", accentG:"rgba(212,160,83,0.25)",
  teal:"#4ECDC4", tealM:"rgba(78,205,196,0.10)",
  red:"#D94F4F", green:"#5CB97A",
  buf:"#7C8CF8", bufM:"rgba(124,140,248,0.10)",
  mono:"'JetBrains Mono','Fira Code',monospace", sans:"'Sora',sans-serif",
};
const SC = ["#4ECDC4","#D4A053","#D94F4F","#7C8CF8","#5CB97A","#E0826E","#A78BFA","#5DADE2"];

const buildRT = (stages, buf) => {
  if (!buf || stages.length <= 1) return stages.map(s=>({...s,isBuffer:false}));
  const r = [];
  stages.forEach((s,i) => { r.push({...s,isBuffer:false}); if(i<stages.length-1) r.push({label:"Wrap-up",minutes:5,color:V.buf,isBuffer:true}); });
  return r;
};

// ═══════════════════════════════════
// 35 ROUTINES
// ═══════════════════════════════════
const ROUTINES = [
  { name:"Morning Coffee", tag:"Brew + enjoy", img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Brew",minutes:4,color:"#8B5E3C"},{label:"Enjoy",minutes:6,color:"#D4A053"}]},
  { name:"Hydration + Supplements", tag:"Quick health boost", img:"https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Hydrate & Supplements",minutes:5,color:"#4ECDC4"}]},
  { name:"Skincare Routine", tag:"Cleanse, treat, protect", img:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Cleanse",minutes:3,color:"#E0826E"},{label:"Treat & Moisturize",minutes:7,color:"#5CB97A"},{label:"SPF & Finish",minutes:5,color:"#D4A053"}]},
  { name:"Morning Meditation", tag:"Calm your start", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Settle In",minutes:3,color:"#7C8CF8"},{label:"Meditate",minutes:10,color:"#A78BFA"},{label:"Set Intention",minutes:2,color:"#5CB97A"}]},
  { name:"Quick Workout", tag:"Warm up, train, cool", img:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Warm Up",minutes:5,color:"#E0826E"},{label:"Training",minutes:15,color:"#D94F4F"},{label:"Cool Down",minutes:5,color:"#4ECDC4"}]},
  { name:"Healthy Breakfast", tag:"Prep, cook, eat", img:"https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Prep",minutes:10,color:"#5CB97A"},{label:"Cook",minutes:10,color:"#E0826E"},{label:"Eat",minutes:5,color:"#D4A053"}]},
  { name:"Journaling", tag:"Write, reflect, plan", img:"https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Free Write",minutes:8,color:"#A78BFA"},{label:"Gratitude",minutes:4,color:"#5CB97A"},{label:"Intentions",minutes:3,color:"#D4A053"}]},
  { name:"News & Content", tag:"Headlines + deep read", img:"https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Headlines",minutes:8,color:"#5DADE2"},{label:"Deep Read",minutes:12,color:"#7C8CF8"}]},
  { name:"Email & Slack Triage", tag:"Scan, reply, flag", img:"https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Scan & Sort",minutes:8,color:"#4ECDC4"},{label:"Quick Replies",minutes:7,color:"#D4A053"},{label:"Flag Follow-ups",minutes:5,color:"#E0826E"}]},
  { name:"Plan the Day", tag:"Calendar + to-do", img:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Review Calendar",minutes:5,color:"#5DADE2"},{label:"Prioritize",minutes:7,color:"#D4A053"},{label:"Set Top 3",minutes:3,color:"#5CB97A"}]},
  { name:"Meeting Prep", tag:"Agenda + notes + buffer", img:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Review Agenda",minutes:10,color:"#D4A053"},{label:"Prep Notes",minutes:15,color:"#4ECDC4"},{label:"Buffer",minutes:5,color:"#5CB97A"}]},
  { name:"Learning Session", tag:"Study + practice", img:"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Study",minutes:25,color:"#7C8CF8"},{label:"Practice",minutes:10,color:"#5CB97A"}]},
  { name:"Content Creation", tag:"Draft, edit, publish", img:"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Draft",minutes:20,color:"#A78BFA"},{label:"Edit",minutes:15,color:"#D4A053"},{label:"Publish",minutes:10,color:"#4ECDC4"}]},
  { name:"Admin Tasks", tag:"Invoices + expenses", img:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Invoicing",minutes:15,color:"#D4A053"},{label:"Expense Tracking",minutes:15,color:"#E0826E"}]},
  { name:"Deep Research", tag:"Read + take notes", img:"https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Research",minutes:40,color:"#7C8CF8"},{label:"Notes & Summary",minutes:10,color:"#5CB97A"}]},
  { name:"Brainstorm", tag:"Ideate, organize, act", img:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Free Ideation",minutes:15,color:"#A78BFA"},{label:"Organize",minutes:10,color:"#D4A053"},{label:"Action Items",minutes:5,color:"#4ECDC4"}]},
  { name:"Client Calls", tag:"Prep, call, debrief", img:"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Prep",minutes:5,color:"#5CB97A"},{label:"Call",minutes:25,color:"#D94F4F"},{label:"Notes",minutes:10,color:"#D4A053"}]},
  { name:"Data & Analytics", tag:"Pull, analyze, log", img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Pull Data",minutes:8,color:"#5DADE2"},{label:"Analyze",minutes:12,color:"#7C8CF8"},{label:"Log Insights",minutes:5,color:"#5CB97A"}]},
  { name:"Email Batch", tag:"Reply, follow up, clean", img:"https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Priority Replies",minutes:15,color:"#D94F4F"},{label:"Follow-ups",minutes:10,color:"#D4A053"},{label:"Archive",minutes:5,color:"#4ECDC4"}]},
  { name:"Laundry Cycle", tag:"Wash, transfer, dry", img:"https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Wash",minutes:35,color:"#4ECDC4"},{label:"Transfer",minutes:5,color:"#D4A053"},{label:"Dry",minutes:60,color:"#D94F4F"}]},
  { name:"Kitchen Cleanup", tag:"Dishes + surfaces", img:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Dishes",minutes:12,color:"#4ECDC4"},{label:"Wipe & Organize",minutes:8,color:"#5CB97A"}]},
  { name:"Quick Home Tidy", tag:"Declutter + dust", img:"https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Declutter",minutes:10,color:"#E0826E"},{label:"Vacuum",minutes:10,color:"#4ECDC4"},{label:"Final Touch",minutes:5,color:"#5CB97A"}]},
  { name:"Meal Planning", tag:"Plan, prep, cook", img:"https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop&q=80", buffer:true, stages:[{label:"Plan",minutes:10,color:"#D4A053"},{label:"Prep",minutes:15,color:"#5CB97A"},{label:"Cook",minutes:30,color:"#E0826E"}]},
  { name:"Grocery Planning", tag:"Check + list + route", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Check Pantry",minutes:5,color:"#5CB97A"},{label:"Build List",minutes:7,color:"#D4A053"},{label:"Plan Route",minutes:3,color:"#5DADE2"}]},
  { name:"Pet Care", tag:"Feed, walk, play", img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Feed",minutes:5,color:"#D4A053"},{label:"Walk",minutes:20,color:"#5CB97A"},{label:"Play",minutes:10,color:"#E0826E"}]},
  { name:"Plant Care", tag:"Water + prune", img:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Water",minutes:8,color:"#4ECDC4"},{label:"Prune & Check",minutes:7,color:"#5CB97A"}]},
  { name:"Bills & Finance", tag:"Pay + review budget", img:"https://images.unsplash.com/photo-1554224155-1696413565d3?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Pay Bills",minutes:10,color:"#D94F4F"},{label:"Review Budget",minutes:10,color:"#D4A053"}]},
  { name:"Outfit Planning", tag:"Weather + pick + prep", img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Check Weather",minutes:2,color:"#5DADE2"},{label:"Choose Outfit",minutes:5,color:"#A78BFA"},{label:"Prep",minutes:3,color:"#D4A053"}]},
  { name:"Recycling Sort", tag:"Sort + take out", img:"https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Sort",minutes:10,color:"#5CB97A"},{label:"Take Out",minutes:5,color:"#4ECDC4"}]},
  { name:"Evening Wind-Down", tag:"Screens off, unwind", img:"https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Close Screens",minutes:5,color:"#A78BFA"},{label:"Light Reading",minutes:15,color:"#7C8CF8"},{label:"Prepare Space",minutes:10,color:"#4ECDC4"}]},
  { name:"Pre-Sleep Routine", tag:"Skincare, stretch, read", img:"https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Skincare",minutes:8,color:"#E0826E"},{label:"Stretch",minutes:10,color:"#5CB97A"},{label:"Read",minutes:7,color:"#7C8CF8"}]},
  { name:"Gratitude Reflection", tag:"Review your day", img:"https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"3 Good Things",minutes:4,color:"#D4A053"},{label:"Reflect",minutes:4,color:"#A78BFA"},{label:"Set Tomorrow",minutes:2,color:"#5CB97A"}]},
  { name:"Evening Yoga", tag:"Gentle stretch + rest", img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Flow",minutes:5,color:"#5CB97A"},{label:"Deep Stretch",minutes:10,color:"#A78BFA"},{label:"Savasana",minutes:5,color:"#7C8CF8"}]},
  { name:"Digital Detox", tag:"Phone-free recharge", img:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Silence Devices",minutes:2,color:"#D94F4F"},{label:"Offline Activity",minutes:50,color:"#5CB97A"},{label:"Gentle Return",minutes:8,color:"#4ECDC4"}]},
  { name:"Pomodoro Focus", tag:"Deep work sprint", img:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&q=80", buffer:false, stages:[{label:"Deep Work",minutes:25,color:"#D94F4F"},{label:"Break",minutes:5,color:"#5CB97A"}]},
];
const PAGES = Math.ceil(ROUTINES.length / 8);

// ─────────────────────────
// SHARED COMPONENTS
// ─────────────────────────
const CircularProgress = ({progress,size=220,stroke=5,color=V.accent,children}) => {
  const r=(size-stroke*2)/2, circ=2*Math.PI*r, off=circ*(1-Math.min(1,Math.max(0,progress)));
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1),stroke 0.3s ease",filter:`drop-shadow(0 0 8px ${color}44)`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>{children}</div>
    </div>
  );
};

const StageBar = ({stages,currentIndex,progress}) => (
  <div style={{display:"flex",gap:2,width:"100%",maxWidth:440}}>
    {stages.map((s,i) => (
      <div key={i} style={{flex:Math.max(s.minutes,2),display:"flex",flexDirection:"column",gap:5}}>
        <div style={{height:s.isBuffer?2:3,borderRadius:2,overflow:"hidden",background:"rgba(255,255,255,0.05)"}}>
          <div style={{height:"100%",borderRadius:2,background:s.color,
            width:i<currentIndex?"100%":i===currentIndex?`${Math.max(0,progress)*100}%`:"0%",
            transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)",opacity:i<=currentIndex?(s.isBuffer?0.7:1):0.15}}/>
        </div>
        <span style={{fontSize:8,letterSpacing:"0.4px",textTransform:"uppercase",
          color:i===currentIndex?(s.isBuffer?V.buf:V.text):V.textD,textAlign:"center",fontFamily:V.mono,
          fontWeight:i===currentIndex?500:400,fontStyle:s.isBuffer?"italic":"normal",
          opacity:s.isBuffer&&i!==currentIndex?0.4:1}}>{s.label}</span>
      </div>
    ))}
  </div>
);

const RoundBtn = ({children,onClick,disabled,variant="primary",size=52}) => {
  const bg=variant==="primary"?V.accent:variant==="danger"?V.red:V.surface;
  const fg=variant==="primary"?V.bg:variant==="danger"?"#fff":V.textM;
  return <button onClick={onClick} disabled={disabled} style={{width:size,height:size,borderRadius:"50%",border:"none",background:bg,color:fg,cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:disabled?0.3:1,transition:"all 0.2s ease",boxShadow:variant==="primary"?`0 4px 20px ${V.accentG}`:"none"}}>{children}</button>;
};

const Pill = ({children,active,onClick,color=V.accent}) => (
  <button onClick={onClick} style={{padding:"7px 16px",borderRadius:20,border:active?`1.5px solid ${color}`:`1.5px solid ${V.border}`,background:active?`${color}18`:"rgba(255,255,255,0.02)",color:active?color:V.textM,cursor:"pointer",fontSize:12,fontFamily:V.sans,fontWeight:500,transition:"all 0.2s ease",whiteSpace:"nowrap"}}>{children}</button>
);

const Label = ({children,style:sx={}}) => (
  <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:V.textD,fontFamily:V.mono,fontWeight:500,...sx}}>{children}</div>
);

const Toggle = ({checked,onChange,label,sublabel}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderRadius:12,background:checked?V.bufM:"rgba(255,255,255,0.02)",border:`1px solid ${checked?"rgba(124,140,248,0.18)":V.border}`,transition:"all 0.3s ease",cursor:"pointer"}} onClick={()=>onChange(!checked)}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <span style={{display:"flex",color:checked?V.buf:V.textD,transition:"color 0.3s"}}>{I.buffer}</span>
      <div>
        <div style={{fontSize:13,color:checked?V.text:V.textM,fontFamily:V.sans,fontWeight:500}}>{label}</div>
        {sublabel && <div style={{fontSize:11,color:V.textD,fontFamily:V.sans,marginTop:2,lineHeight:1.4}}>{sublabel}</div>}
      </div>
    </div>
    <div style={{width:42,height:24,borderRadius:12,padding:2,background:checked?V.buf:"rgba(255,255,255,0.1)",transition:"background 0.3s ease",flexShrink:0,marginLeft:12}}>
      <div style={{width:20,height:20,borderRadius:10,background:checked?"#fff":"rgba(255,255,255,0.3)",transform:checked?"translateX(18px)":"translateX(0)",transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",boxShadow:checked?"0 2px 8px rgba(0,0,0,0.3)":"none"}}/>
    </div>
  </div>
);

const TabBar = ({active,onChange}) => {
  const tabs=[{id:"chain",label:"Chain Timer",icon:I.chain},{id:"room",label:"Focus Room",icon:I.brain}];
  return (
    <div style={{display:"flex",gap:2,background:V.surface,borderRadius:14,padding:3,border:`1px solid ${V.border}`}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,padding:"12px 8px",borderRadius:12,border:"none",cursor:"pointer",background:active===t.id?"rgba(255,255,255,0.07)":"transparent",color:active===t.id?V.text:V.textM,fontSize:13,fontFamily:V.sans,fontWeight:500,transition:"all 0.25s ease",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{opacity:active===t.id?1:0.5,display:"flex"}}>{t.icon}</span><span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

const BufferBanner = ({remaining}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",borderRadius:12,background:V.bufM,border:"1px solid rgba(124,140,248,0.15)",animation:"fadeIn 0.4s ease"}}>
    <span style={{display:"flex",color:V.buf}}>{I.buffer}</span>
    <div style={{flex:1}}>
      <div style={{fontSize:12,color:V.buf,fontFamily:V.sans,fontWeight:600}}>Wrap-up time</div>
      <div style={{fontSize:11,color:V.textM,fontFamily:V.sans,marginTop:1}}>Prepare for your next task</div>
    </div>
    <div style={{fontSize:16,fontWeight:400,color:V.buf,fontFamily:V.mono,letterSpacing:"1px"}}>{fmt(remaining)}</div>
  </div>
);

// ═══════════════════════════════════
// MINUTE DIAL (subtle +/- for editor)
// ═══════════════════════════════════
const MinuteDial = ({value, onChange}) => {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(999, value + 1));
  const decFive = () => onChange(Math.max(1, value - 5));
  const incFive = () => onChange(Math.min(999, value + 5));

  return (
    <div style={{display:"flex",alignItems:"center",gap:0,background:"rgba(255,255,255,0.03)",border:`1px solid ${V.border}`,borderRadius:10,padding:"0 4px",height:38}}>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={e => {const v = parseInt(e.target.value); if(!isNaN(v) && v >= 1 && v <= 999) onChange(v); else if(e.target.value === "") onChange(1);}}
        style={{width:32,background:"transparent",border:"none",color:V.text,fontSize:13,fontFamily:V.mono,textAlign:"center",outline:"none",padding:"0"}}
      />
      <span style={{fontSize:9,color:V.textD,fontFamily:V.mono,marginRight:6}}>min</span>
      {/* Subtle vertical dial */}
      <div style={{display:"flex",flexDirection:"column",gap:1,borderLeft:`1px solid ${V.border}`,paddingLeft:5,marginLeft:2}}>
        <button
          onClick={inc}
          onContextMenu={e=>{e.preventDefault();incFive();}}
          style={{
            width:18,height:15,borderRadius:"4px 4px 1px 1px",border:"none",cursor:"pointer",
            background:"transparent",color:V.textD,fontSize:8,fontFamily:V.mono,
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"color 0.15s ease",
          }}
          onMouseEnter={e=>e.currentTarget.style.color=V.text}
          onMouseLeave={e=>e.currentTarget.style.color=V.textD}
        >
          <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 0L8 5H0L4 0Z"/></svg>
        </button>
        <button
          onClick={dec}
          onContextMenu={e=>{e.preventDefault();decFive();}}
          style={{
            width:18,height:15,borderRadius:"1px 1px 4px 4px",border:"none",cursor:"pointer",
            background:"transparent",color:V.textD,fontSize:8,fontFamily:V.mono,
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"color 0.15s ease",
          }}
          onMouseEnter={e=>e.currentTarget.style.color=V.text}
          onMouseLeave={e=>e.currentTarget.style.color=V.textD}
        >
          <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor"><path d="M4 5L0 0H8L4 5Z"/></svg>
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// ROUTINE CARD (full-bleed image, text overlaid)
// ═══════════════════════════════════
const RoutineCard = ({routine, onSelect, isActive}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const totalMin = routine.stages.reduce((a,s)=>a+s.minutes,0) + (routine.buffer ? (routine.stages.length-1)*5 : 0);

  return (
    <button onClick={()=>onSelect(routine)} style={{
      background: V.surface, border: `1px solid ${isActive ? V.accent+"55" : V.border}`,
      borderRadius: 12, cursor: "pointer", textAlign: "left",
      transition: "all 0.3s ease", overflow: "hidden",
      display: "flex", flexDirection: "column",
      outline: isActive ? `2px solid ${V.accent}44` : "none",
      position: "relative", height: 140,
    }}>
      {/* Full-bleed image */}
      <div style={{position:"absolute",inset:0}}>
        <img src={routine.img} alt="" onLoad={()=>setImgLoaded(true)}
          style={{width:"100%",height:"100%",objectFit:"cover",opacity:imgLoaded?1:0,transition:"opacity 0.6s ease",filter:"brightness(0.55) saturate(0.85)"}}/>
        {/* Gradient overlay — heavy at bottom for text legibility */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(11,14,17,0.92) 0%, rgba(11,14,17,0.5) 40%, rgba(11,14,17,0.1) 70%, transparent 100%)"}}/>
      </div>

      {/* Buffer badge top-right */}
      {routine.buffer && (
        <div style={{position:"absolute",top:6,right:6,zIndex:2,display:"flex",alignItems:"center",gap:3,padding:"2px 6px",borderRadius:5,background:"rgba(124,140,248,0.3)",backdropFilter:"blur(4px)"}}>
          <span style={{display:"flex",color:V.buf,transform:"scale(0.6)"}}>{I.buffer}</span>
          <span style={{fontSize:7,color:"#B8C0FF",fontFamily:V.mono,fontWeight:500}}>Buffer</span>
        </div>
      )}

      {/* Text content — anchored to bottom */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 10px 10px",zIndex:2,display:"flex",flexDirection:"column",gap:3}}>
        <div style={{fontSize:11,color:"#fff",fontFamily:V.sans,fontWeight:600,lineHeight:1.25,textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>{routine.name}</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",fontFamily:V.sans,lineHeight:1.2}}>{routine.tag}</div>
        <div style={{display:"flex",gap:3,alignItems:"center",marginTop:1}}>
          {routine.stages.slice(0,3).map((s,j)=>(
            <div key={j} style={{width:5,height:5,borderRadius:1.5,background:s.color,opacity:0.9}}/>
          ))}
          {routine.stages.length>3 && <span style={{fontSize:7,color:"rgba(255,255,255,0.35)",fontFamily:V.mono}}>+{routine.stages.length-3}</span>}
          <span style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontFamily:V.mono,marginLeft:"auto"}}>{totalMin}m</span>
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════
// CHAIN TIMER
// ═══════════════════════════════════
const ChainTimer = ({liveCount}) => {
  const [userChains, setUserChains] = useState([]);
  const [activeChain, setActiveChain] = useState(null);
  const [running, setRunning] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [done, setDone] = useState(false);
  const [view, setView] = useState("browse");
  const [editName, setEditName] = useState("");
  const [editStages, setEditStages] = useState([{label:"",minutes:25,color:SC[0]}]);
  const [editBuffer, setEditBuffer] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [page, setPage] = useState(0);
  const [fadeClass, setFadeClass] = useState("in");
  const autoRef = useRef(null);
  const hasCustom = userChains.length > 0;

  const runtimeStages = activeChain ? buildRT(activeChain.stages, activeChain.buffer) : [];
  const runtimeRef = useRef(runtimeStages);
  const stageIdxRef = useRef(0);
  useEffect(()=>{runtimeRef.current=runtimeStages;},[runtimeStages]);
  useEffect(()=>{stageIdxRef.current=stageIdx;},[stageIdx]);
  const intervalRef = useRef(null);

  const totalSec = runtimeStages.reduce((a,s)=>a+s.minutes*60,0);
  const elapsedBefore = runtimeStages.slice(0,stageIdx).reduce((a,s)=>a+s.minutes*60,0);
  const stageSec = runtimeStages[stageIdx]?.minutes*60||0;
  const stageProgress = remaining!==null&&stageSec>0 ? 1-remaining/stageSec : 0;
  const globalProgress = remaining!==null&&totalSec>0 ? (elapsedBefore+(stageSec-remaining))/totalSec : 0;
  const currentIsBuffer = runtimeStages[stageIdx]?.isBuffer||false;

  const goPage = useCallback((p) => {
    setFadeClass("out");
    setTimeout(()=>{
      setPage(typeof p === "function" ? p(0) : p);
      setFadeClass("in");
    },220);
  },[]);

  // Auto-cycle
  useEffect(()=>{
    if(view!=="browse") { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(()=>{
      setFadeClass("out");
      setTimeout(()=>{setPage(p=>(p+1)%PAGES);setFadeClass("in");},220);
    }, 8000);
    return ()=>clearInterval(autoRef.current);
  },[view]);

  const visibleRoutines = ROUTINES.slice(page*8, page*8+8);

  const startChain = useCallback(()=>{
    if(!runtimeRef.current||runtimeRef.current.length===0) return;
    setEndTime(Date.now()+runtimeRef.current[0].minutes*60*1000);
    setStageIdx(0); stageIdxRef.current=0;
    setRunning(true); setDone(false); setView("timer"); chime();
  },[]);

  const stopChain = useCallback(()=>{
    setRunning(false);setEndTime(null);setRemaining(null);
    setStageIdx(0);setDone(false);clearInterval(intervalRef.current);
  },[]);

  useEffect(()=>{
    if(!running||!endTime){clearInterval(intervalRef.current);return;}
    const tick=()=>{
      const diff=Math.max(0,Math.ceil((endTime-Date.now())/1000));
      setRemaining(diff);
      if(diff<=0){
        const st=runtimeRef.current;const nx=stageIdxRef.current+1;
        if(st&&nx<st.length){ st[nx].isBuffer?softChime():chime(); setEndTime(Date.now()+st[nx].minutes*60*1000); setStageIdx(nx); }
        else { chime();setDone(true);setRunning(false);clearInterval(intervalRef.current); }
      }
    };
    intervalRef.current=setInterval(tick,250);tick();
    return()=>clearInterval(intervalRef.current);
  },[running,endTime]);

  const selectRoutine = (r) => { stopChain(); setActiveChain(r); setView("timer"); };
  const openEditor = (idx=null) => {
    if(idx!==null&&userChains[idx]){const c=userChains[idx];setEditName(c.name);setEditStages(c.stages.map(s=>({...s})));setEditBuffer(c.buffer||false);setEditingIdx(idx);}
    else{setEditName("");setEditStages([{label:"",minutes:25,color:SC[0]}]);setEditBuffer(false);setEditingIdx(null);}
    setView("editor"); stopChain();
  };
  const saveChain = () => {
    const valid=editStages.filter(s=>s.label.trim()&&s.minutes>0);
    if(!valid.length) return;
    const chain={name:editName.trim()||`Chain ${userChains.length+1}`,stages:valid,buffer:editBuffer};
    if(editingIdx!==null){const u=[...userChains];u[editingIdx]=chain;setUserChains(u);}
    else if(userChains.length<8) setUserChains([...userChains,chain]);
    setActiveChain(chain); setView("timer"); setEditingIdx(null);
  };
  const deleteChain = (idx)=>{const u=userChains.filter((_,i)=>i!==idx);setUserChains(u);if(activeChain===userChains[idx])setActiveChain(null);};

  // ── BROWSE ──
  if (view === "browse") return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {hasCustom && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <Label>Your Chains ({userChains.length}/8)</Label>
            {userChains.length<8 && <button onClick={()=>openEditor()} style={{background:"none",border:`1px dashed ${V.borderH}`,borderRadius:8,color:V.textM,cursor:"pointer",fontSize:11,fontFamily:V.sans,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}>{I.plus} New</button>}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {userChains.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:2}}>
                <Pill active={false} onClick={()=>selectRoutine(c)} color={c.stages[0]?.color||V.accent}>{c.name}</Pill>
                <button onClick={()=>openEditor(i)} style={{background:"none",border:"none",color:V.textD,cursor:"pointer",padding:3,display:"flex"}}>{I.edit}</button>
                <button onClick={()=>deleteChain(i)} style={{background:"none",border:"none",color:V.textD,cursor:"pointer",padding:3,display:"flex"}}>{I.trash}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header — just the label, NO page counter or arrows */}
      <Label>Popular Daily Routines</Label>

      {/* 2x4 Grid */}
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8,
        opacity: fadeClass==="in"?1:0,
        transform: fadeClass==="in"?"translateY(0)":"translateY(6px)",
        transition:"opacity 0.22s ease, transform 0.22s ease",
      }}>
        {visibleRoutines.map((r,i)=>(
          <RoutineCard key={`${page}-${i}`} routine={r} onSelect={selectRoutine} isActive={activeChain===r}/>
        ))}
      </div>

      {/* Dots only */}
      <div style={{display:"flex",justifyContent:"center",gap:6,paddingTop:4}}>
        {Array.from({length:PAGES}).map((_,i)=>(
          <button key={i} onClick={()=>{clearInterval(autoRef.current);setFadeClass("out");setTimeout(()=>{setPage(i);setFadeClass("in");},220);}} style={{
            width:i===page?20:6,height:6,borderRadius:3,border:"none",cursor:"pointer",
            background:i===page?V.accent:"rgba(255,255,255,0.08)",
            transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}/>
        ))}
      </div>

      <button onClick={()=>openEditor()} style={{
        width:"100%",padding:"14px 0",borderRadius:12,
        border:`1px dashed ${V.accent}55`,background:V.accentM,
        color:V.accent,cursor:"pointer",fontSize:13,fontFamily:V.sans,fontWeight:600,
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
      }}>
        {I.plus} Build Custom Chain
      </button>
    </div>
  );

  // ── EDITOR ──
  if (view === "editor") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <button onClick={()=>setView(activeChain?"timer":"browse")} style={{background:"none",border:"none",color:V.textM,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:V.sans,padding:0}}>
        {I.back} Back
      </button>
      <div style={{background:V.surface,borderRadius:16,padding:22,border:`1px solid ${V.border}`,display:"flex",flexDirection:"column",gap:16}}>
        <Label>{editingIdx!==null?"Edit Chain":"Build Your Chain"}</Label>
        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Chain name (e.g. Morning Routine)"
          style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${V.border}`,borderRadius:10,padding:"10px 14px",color:V.text,fontSize:14,fontFamily:V.sans,outline:"none"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {editStages.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:22,height:22,borderRadius:6,flexShrink:0,background:SC[i%SC.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#000",fontWeight:700,fontFamily:V.mono}}>{i+1}</div>
              <input value={s.label} onChange={e=>{const n=[...editStages];n[i].label=e.target.value;n[i].color=SC[i%SC.length];setEditStages(n);}} placeholder="Stage name"
                style={{flex:1,background:"rgba(255,255,255,0.03)",border:`1px solid ${V.border}`,borderRadius:8,padding:"9px 12px",color:V.text,fontSize:13,fontFamily:V.sans,outline:"none"}}/>
              <MinuteDial value={s.minutes} onChange={v=>{const n=[...editStages];n[i].minutes=v;setEditStages(n);}}/>
              {editStages.length>1 && <button onClick={()=>setEditStages(editStages.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:V.red,cursor:"pointer",padding:4,display:"flex",opacity:0.7}}>{I.x}</button>}
            </div>
          ))}
        </div>
        <button onClick={()=>setEditStages([...editStages,{label:"",minutes:5,color:SC[editStages.length%SC.length]}])}
          style={{width:"100%",padding:"9px 0",borderRadius:8,border:`1px dashed ${V.border}`,background:"transparent",color:V.textM,cursor:"pointer",fontSize:12,fontFamily:V.sans,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {I.plus} Add Stage
        </button>
        <Toggle checked={editBuffer} onChange={setEditBuffer} label="Smart Buffer (5 min wrap-up)" sublabel="Adds 5-minute breathing room between stages"/>
        {editBuffer && editStages.filter(s=>s.label.trim()&&s.minutes>0).length>1 && (
          <div style={{fontSize:11,color:V.textD,fontFamily:V.mono,textAlign:"center",padding:"4px 0",animation:"fadeIn 0.3s ease"}}>
            {(()=>{const v=editStages.filter(s=>s.label.trim()&&s.minutes>0);const b=v.reduce((a,s)=>a+s.minutes,0);const bf=(v.length-1)*5;return`Total: ${b+bf} min (${b}m + ${bf}m buffer)`;})()}
          </div>
        )}
        <button onClick={saveChain} style={{width:"100%",padding:"11px 0",borderRadius:10,border:"none",background:V.accent,color:V.bg,cursor:"pointer",fontSize:13,fontFamily:V.sans,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {I.save} {editingIdx!==null?"Update Chain":"Save Chain"}
        </button>
      </div>
    </div>
  );

  // ── TIMER ──
  return (
    <div style={{display:"flex",flexDirection:"column",gap:22,alignItems:"center"}}>
      <button onClick={()=>{stopChain();setView("browse");}} style={{alignSelf:"flex-start",background:"none",border:"none",color:V.textM,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontFamily:V.sans,padding:0}}>
        {I.back} Browse Routines
      </button>
      {activeChain && <>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:14,color:V.text,fontFamily:V.sans,fontWeight:600}}>{activeChain.name}</div>
          {activeChain.buffer && (
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:8,background:V.bufM,border:"1px solid rgba(124,140,248,0.12)"}}>
              <span style={{display:"flex",color:V.buf,transform:"scale(0.75)"}}>{I.buffer}</span>
              <span style={{fontSize:10,color:V.buf,fontFamily:V.mono,fontWeight:500}}>Buffer</span>
            </div>
          )}
        </div>
        <StageBar stages={runtimeStages} currentIndex={stageIdx} progress={stageProgress}/>
        <CircularProgress progress={globalProgress} color={currentIsBuffer?V.buf:(runtimeStages[stageIdx]?.color||V.accent)} size={240} stroke={5}>
          {done?(
            <div style={{textAlign:"center"}}>
              <div style={{color:V.green,display:"flex",justifyContent:"center",marginBottom:8}}>{I.check}</div>
              <div style={{fontSize:13,color:V.textM,fontFamily:V.sans}}>Chain Complete</div>
            </div>
          ):(
            <>
              <Label style={{color:currentIsBuffer?V.buf:(runtimeStages[stageIdx]?.color||V.accent),marginBottom:6,fontStyle:currentIsBuffer?"italic":"normal"}}>
                {currentIsBuffer?"Wrap-up":(runtimeStages[stageIdx]?.label||"Ready")}
              </Label>
              <div style={{fontSize:48,fontWeight:300,color:V.text,fontFamily:V.mono,letterSpacing:"3px"}}>
                {remaining!==null?fmt(remaining):fmt(runtimeStages[0]?.minutes*60||0)}
              </div>
              <div style={{fontSize:10,color:V.textD,fontFamily:V.mono,marginTop:6}}>stage {stageIdx+1} of {runtimeStages.length}</div>
            </>
          )}
        </CircularProgress>
        {running && currentIsBuffer && remaining!==null && <BufferBanner remaining={remaining}/>}
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          {!running&&!done && <RoundBtn onClick={startChain}>{I.play}</RoundBtn>}
          {running && <RoundBtn variant="danger" onClick={stopChain}>{I.stop}</RoundBtn>}
          {done && <RoundBtn onClick={startChain}>{I.restart}</RoundBtn>}
        </div>
        {running && !currentIsBuffer && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:24,background:V.tealM,border:"1px solid rgba(78,205,196,0.10)"}}>
            <div style={{width:6,height:6,borderRadius:3,background:V.teal,animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:12,color:V.textM,fontFamily:V.sans}}>
              <span style={{color:V.teal,fontWeight:600,fontFamily:V.mono}}>{liveCount.toLocaleString()}</span> focusing with you
            </span>
          </div>
        )}
      </>}
    </div>
  );
};

// ═══════════════════════════════════
// FOCUS ROOM
// ═══════════════════════════════════
const FocusRoom = ({liveCount}) => {
  const [dur, setDur] = useState(25);
  const [customDur, setCustomDur] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [running, setRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [sessions, setSessions] = useState(0);
  const intRef = useRef(null);
  const progress = remaining!==null&&dur>0 ? 1-remaining/(dur*60) : 0;
  const start = ()=>{setEndTime(Date.now()+dur*60*1000);setRunning(true);setShowCustom(false);chime();};
  const stop = ()=>{setRunning(false);setEndTime(null);setRemaining(null);clearInterval(intRef.current);};
  useEffect(()=>{
    if(!running||!endTime) return;
    const fn=()=>{const d=Math.max(0,Math.ceil((endTime-Date.now())/1000));setRemaining(d);if(d<=0){chime();setRunning(false);setSessions(s=>s+1);clearInterval(intRef.current);}};
    intRef.current=setInterval(fn,250);fn();return()=>clearInterval(intRef.current);
  },[running,endTime]);
  const durs=[15,25,30,60,90];
  const applyCustom=()=>{const v=parseInt(customDur);if(v>0&&v<=999){setDur(v);setShowCustom(false);setCustomDur("");}};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:28,alignItems:"center"}}>
      <div style={{width:"100%",padding:"30px 20px",borderRadius:20,textAlign:"center",background:"radial-gradient(ellipse at 50% 40%, rgba(78,205,196,0.05) 0%, transparent 65%)",border:"1px solid rgba(78,205,196,0.07)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap",gap:8,opacity:0.12,padding:20,pointerEvents:"none"}}>
          {Array.from({length:40}).map((_,i)=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:V.teal,opacity:0.2+Math.random()*0.8,animation:`pulse ${2+Math.random()*4}s infinite ${Math.random()*3}s`}}/>)}
        </div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:V.teal,boxShadow:`0 0 12px ${V.teal}88`,animation:"pulse 2s infinite"}}/>
            <Label style={{color:V.textM}}>Live Focus Room</Label>
          </div>
          <div style={{fontSize:52,fontWeight:200,color:V.teal,fontFamily:V.mono,letterSpacing:"4px"}}>{liveCount.toLocaleString()}</div>
          <div style={{fontSize:13,color:V.textM,fontFamily:V.sans,marginTop:6}}>people focusing right now</div>
        </div>
      </div>
      {!running&&remaining===null&&(
        <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
            {durs.map(d=><Pill key={d} active={dur===d&&!showCustom} onClick={()=>{setDur(d);setShowCustom(false);}} color={V.teal}>{d}m</Pill>)}
            <Pill active={!durs.includes(dur)||showCustom} onClick={()=>setShowCustom(true)} color={V.accent}>Custom</Pill>
          </div>
          {showCustom&&(
            <div style={{display:"flex",gap:8,alignItems:"center",animation:"fadeIn 0.2s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:4,background:V.surface,border:`1px solid ${V.border}`,borderRadius:10,padding:"0 12px"}}>
                <input type="number" value={customDur} min={1} max={999} placeholder="min" onChange={e=>setCustomDur(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyCustom()} autoFocus
                  style={{width:56,background:"transparent",border:"none",color:V.text,fontSize:14,fontFamily:V.mono,textAlign:"center",outline:"none",padding:"10px 0"}}/>
                <span style={{fontSize:10,color:V.textD,fontFamily:V.mono}}>min</span>
              </div>
              <button onClick={applyCustom} style={{background:V.accent,border:"none",borderRadius:10,padding:"10px 18px",color:V.bg,cursor:"pointer",fontSize:12,fontFamily:V.sans,fontWeight:600}}>Set</button>
            </div>
          )}
        </div>
      )}
      <CircularProgress progress={progress} color={V.teal} size={210} stroke={4}>
        <div style={{fontSize:44,fontWeight:200,color:V.text,fontFamily:V.mono,letterSpacing:"3px"}}>{remaining!==null?fmt(remaining):fmt(dur*60)}</div>
        {remaining===0&&!running&&<div style={{fontSize:12,color:V.teal,fontFamily:V.sans,marginTop:6,fontWeight:500}}>Session complete</div>}
      </CircularProgress>
      <div style={{display:"flex",gap:14}}>
        {!running&&remaining!==0&&<RoundBtn onClick={start}>{I.play}</RoundBtn>}
        {!running&&remaining===0&&<RoundBtn onClick={()=>setRemaining(null)}>{I.restart}</RoundBtn>}
        {running&&<RoundBtn variant="danger" onClick={stop}>{I.stop}</RoundBtn>}
      </div>
      <div style={{display:"flex",gap:28,justifyContent:"center"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:300,color:V.text,fontFamily:V.mono}}>{sessions}</div><div style={{fontSize:10,color:V.textD,fontFamily:V.sans,marginTop:2}}>sessions today</div></div>
        <div style={{width:1,background:V.border,alignSelf:"stretch"}}/>
        <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:300,color:V.text,fontFamily:V.mono}}>{sessions*dur}</div><div style={{fontSize:10,color:V.textD,fontFamily:V.sans,marginTop:2}}>minutes focused</div></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// MAIN APP
// ═══════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("chain");
  const liveCount = useLiveCount();
  return (
    <div style={{minHeight:"100vh",background:V.bg,color:V.text,fontFamily:V.sans,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 60px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500&family=Sora:wght@200;300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${V.bg}}
        ::selection{background:${V.accentM};color:${V.accent}}
        input::placeholder{color:${V.textD}}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}
        button:hover{filter:brightness(1.1)}button:active{transform:scale(0.97)}
        img{-webkit-user-drag:none;user-select:none}
      `}</style>
      <div style={{width:"100%",maxWidth:560,paddingTop:44,marginBottom:36,animation:"fadeUp 0.6s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${V.accent},#B8863A)`,display:"flex",alignItems:"center",justifyContent:"center",color:V.bg,boxShadow:`0 4px 24px ${V.accentG}`}}>{I.hourglass}</div>
          <div>
            <h1 style={{fontSize:21,fontWeight:600,letterSpacing:"-0.5px",color:V.text,fontFamily:V.sans,lineHeight:1.2}}>Contextual Flow</h1>
            <div style={{fontSize:10,color:V.textD,fontFamily:V.mono,letterSpacing:"1.5px",textTransform:"uppercase",marginTop:2}}>time that adapts to the task</div>
          </div>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:560,display:"flex",flexDirection:"column",gap:28,animation:"fadeUp 0.7s ease 0.08s both"}}>
        <TabBar active={tab} onChange={setTab}/>
        <div style={{animation:"fadeIn 0.35s ease"}} key={tab}>
          {tab==="chain"&&<ChainTimer liveCount={liveCount}/>}
          {tab==="room"&&<FocusRoom liveCount={liveCount}/>}
        </div>
      </div>
      <div style={{marginTop:52,fontSize:10,color:V.textD,fontFamily:V.mono,textAlign:"center",letterSpacing:"0.5px"}}>No account needed &middot; Data stays in your browser &middot; Built for flow</div>
    </div>
  );
}
