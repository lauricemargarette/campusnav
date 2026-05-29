import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─────────────────────────── DATABASE LAYER ─────────────────────────── */
const INITIAL_DB = {
  locations: [
    { id:1,  name:"Entrance", floor:1, building: 3, x:5.5, y:21, type:"entrance",  desc:"Security gate & visitor logbook." },
    { id:2,  name:"Clinic", floor:1, building: 3, x:4.5,  y:18.5, type:"clinic",    desc:"School nurse, first aid." },
    { id:3,  name:"Admission Office", floor:1, building: 3, x:6.5,  y:18.5, type:"office",    desc:"Admission office." },
    { id:4, name:"Drug Testing Center", floor:1, building: 3, x:4.5, y:13.5, type:"clinic",  desc:"Drug testing services." },
    { id:5, name:"Lounge", floor:1, building: 3, x:6.5,  y:13.5, type:"lounge",   desc:"Lounge area for visitors." },
    { id:6,  name:"Elevator", floor:1, building: 4, x:5.5,  y:8,  type:"elevator",    desc:"Enrollment, TOR requests, ID processing." },
    { id:7,  name:"Library", floor:1, building: 2, x:20.5, y:1.5,  type:"library",   desc:"Reference books, reading area & Wi-Fi." },
    { id:8,  name:"Registrar's Office", floor:2, building:3, x:4.5, y:18.5, type:"office",    desc:"TOR requests, enrollment records." },
    { id:9,  name:"Cashier",            floor:2, building:3, x:6.5, y:18.5, type:"office",    desc:"Tuition and fee payments." },
    { id:10, name:"Computer Lab 1",     floor:2, building:4, x:4.5, y:13.5, type:"lab",       desc:"Programming laboratory." },
    { id:11, name:"Computer Lab 2",     floor:2, building:4, x:6.5, y:13.5, type:"lab",       desc:"Networking laboratory." },
    { id:12, name:"Classroom 201",      floor:2, building:1, x:15,  y:15,   type:"classroom", desc:"Lecture room." },
    { id:13, name:"Classroom 202",      floor:2, building:1, x:18,  y:15,   type:"classroom", desc:"Lecture room." },
    { id:14, name:"Faculty Room",       floor:2, building:2, x:15,  y:5,    type:"office",    desc:"Faculty offices and consultation area." },
    
    //HALLWAY/CORRIDOR nodes — invisible junction points
    { id:101, name:"Corridor Junction", floor:1, x:5.5, y:21, type:"hallway", desc:"Main corridor junction." },
    { id:102, name:"hallway", floor:1, x:5.5,  y:18.5, type:"hallway", desc:"Corridor near clinic/admission office." },
    { id:103, name:"hallway", floor:1, x:5.5,  y:13.5, type:"hallway", desc:"Corridor near drug testing center/Lounge." },
    { id:104, name:"hallway at Building 4", floor:1, x:5.5,  y:10.5, type:"hallway", desc:"Corridor near Elevator/Building 4." },
    { id:105, name:"stairs", floor:1, x:3.7, y:10.5,  type:"hallway", desc:"Left hallway to elevator." },
    { id:106, name:"the front of Elevator", floor:1, x:3.7, y:8,  type:"hallway", desc:"From left side in front elevator." },
    { id:107, name:"stairs", floor:1, x:13, y:7,  type:"hallway", desc:"Right hallway to elevator." },
    { id:108, name:"", floor:1, x:13, y:7,  type:"hallway", desc:"From right in front of elevator." },
    { id:201, name:"hallway", floor:2, x:5.5, y:21,   type:"hallway", desc:"" },
    { id:202, name:"hallway", floor:2, x:5.5, y:18.5, type:"hallway", desc:"" },
    { id:203, name:"hallway", floor:2, x:5.5, y:13.5, type:"hallway", desc:"" },
    { id:204, name:"hallway", floor:2, x:5.5, y:10.5, type:"hallway", desc:"" },
    ],
  edges:[
    [1,102],[101,104],[102,2],[102,3],[102,103],[103,4],[103,5],[103,104],[104,105],[105,106],[106,6], [6, 202],
    [202, 8], [202, 9], [202, 203],[203, 10], [203, 11], [203, 204],
  ],
  announcements:[
    { id:1, title:"Enrollment Period Open",  body:"2nd Semester enrollment is now open. Visit the Registrar's Office.", date:"2026-05-20", priority:"high" },
    { id:2, title:"Library Hours Extended",  body:"Library is now open until 8:00 PM on weekdays.",                    date:"2026-05-22", priority:"normal" },
    { id:3, title:"Campus WiFi Maintenance", body:"WiFi will be offline May 28, 10PM–2AM for upgrades.",              date:"2026-05-25", priority:"normal" },
  ],
  users:[
    { id:1, username:"admin", password:"icct2026", role:"admin" },
    { id:2, username:"staff", password:"staff123", role:"staff" },
  ],
  nextId: { locations: 20, announcements: 4 }
};

/* ─────────────────────────── A* ALGORITHM ──────────────────────────── */
function heuristic(a, b, locs) {
  const la = locs.find(l=>l.id===a), lb = locs.find(l=>l.id===b);
  if(!la||!lb) return Infinity;
  return Math.sqrt((la.x-lb.x)**2+(la.y-lb.y)**2);
}
function aStar(start, goal, locs, edges) {
  if(start===goal) return [start];
  const adj={};
  edges.forEach(([a,b])=>{ if(!adj[a])adj[a]=[]; if(!adj[b])adj[b]=[]; adj[a].push(b); adj[b].push(a); });
  const open=new Set([start]), came={};
  const g={}, f={};
  locs.forEach(l=>{ g[l.id]=Infinity; f[l.id]=Infinity; });
  g[start]=0; f[start]=heuristic(start,goal,locs);
  while(open.size>0){
    let cur=[...open].reduce((b,n)=>f[n]<f[b]?n:b);
    if(cur===goal){ const p=[]; let c=cur; while(c!==undefined){p.unshift(c);c=came[c];} return p; }
    open.delete(cur);
    for(const nb of (adj[cur]||[])){
      const t=g[cur]+heuristic(cur,nb,locs);
      if(t<g[nb]){ came[nb]=cur; g[nb]=t; f[nb]=t+heuristic(nb,goal,locs); open.add(nb); }
    }
  }
  return [];
}
function getDirections(pathIds, locs) {
  if (pathIds.length < 2) return [];
  const directions = [];
  for (let i = 0; i < pathIds.length; i++) {
    const curr = locs.find(l => l.id === pathIds[i]);
    const next = locs.find(l => l.id === pathIds[i + 1]);
    const prev = locs.find(l => l.id === pathIds[i - 1]);
    if (!curr) continue;

    if (i === 0) {
      directions.push({ icon:"🚶", text:`Start at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }
    if (i === pathIds.length - 1) {
      directions.push({ icon:"🏁", text:`Arrive at ${curr.name}`, sub:`Floor ${curr.floor} · ${curr.type}` });
      continue;
    }

    // Calculate angle between previous→current→next
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
    let turn = (angle2 - angle1) * (180 / Math.PI);
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;

    // Floor change detection
    const floorChange = next.floor !== curr.floor;
    const floorDiff = next.floor - curr.floor;

    let icon, text;
    if (floorChange) {
      icon = floorDiff > 0 ? "🔼" : "🔽";
      text = `${floorDiff > 0 ? "Go up" : "Go down"} to Floor ${next.floor} via stairs`;
    } else if (turn < -45) {
      icon = "↰"; text = `Turn left to ${next.name}`;
    } else if (turn > 45) {
      icon = "↱"; text = `Turn right to ${next.name}`;
    } else if (turn < -15) {
      icon = "↖"; text = `Turn left to ${next.name}`;
    } else if (turn > 15) {
      icon = "↗"; text = `Turn right to ${next.name}`;
    } else {
      icon = "⬆"; text = `Continue straight to ${next.name}`;
    }

    directions.push({ icon, text, sub:`Floor ${curr.floor} · ${curr.type}` });
  }
  return directions;
}


/* ─────────────────────────── QR SVG ──────────────────────────────── */
function makeQR(text) {
  let h=0; for(let i=0;i<text.length;i++) h=((h<<5)-h+text.charCodeAt(i))|0;
  const S=17, g=[];
  for(let r=0;r<S;r++){ g[r]=[]; for(let c=0;c<S;c++){ const s=(h^(r*31+c*97))*2654435761; g[r][c]=((s>>>16)&1)===1; } }
  [[0,0],[0,10],[10,0]].forEach(([br,bc])=>{
    for(let r=0;r<7;r++) for(let c=0;c<7;c++)
      if(br+r<S&&bc+c<S) g[br+r][bc+c]=(r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4));
  });
  return g;
}
function QRCode({ text, size=100 }) {
  const g=useMemo(()=>makeQR(text),[text]);
  const c=size/g.length;
  return (
    <svg width={size} height={size} style={{background:"#fff",borderRadius:4,display:"block",flexShrink:0}}>
      {g.map((row,r)=>row.map((on,c2)=>on?<rect key={`${r}-${c2}`} x={c2*c} y={r*c} width={c} height={c} fill="#111"/>:null))}
    </svg>
  );
}

/* ─────────────────────────── AUTH ──────────────────────────────────── */
function createToken(u){ return btoa(JSON.stringify({id:u.id,username:u.username,role:u.role,exp:Date.now()+3600000})); }
function parseToken(t){ try{ const p=JSON.parse(atob(t)); return p.exp>Date.now()?p:null; }catch{return null;} }

/* ─────────────────────────── CONSTANTS ─────────────────────────────── */
const TYPE_META = {
  entrance: { color:"#34d399", icon:"🚪" },
  office:   { color:"#60a5fa", icon:"🏢" },
  library:  { color:"#c084fc", icon:"📚" },
  lab:      { color:"#fbbf24", icon:"💻" },
  hall:     { color:"#f472b6", icon:"🎭" },
  canteen:  { color:"#fb923c", icon:"🍽️" },
  clinic:   { color:"#f87171", icon:"🏥" },
  classroom:{ color:"#22d3ee", icon:"🎓" },
  parking:  { color:"#94a3b8", icon:"🅿️" },
  chapel:   { color:"#fde68a", icon:"⛪" },
  restroom: { color:"#2dd4bf", icon:"🚻" },
};

/* ─────────────────────────── 2D MAP ─────────────────────────────────── */
function CampusMap({ locs, edges, path, onNode, fromId, toId, compact=false, visibleFloor=1 }) {
  const floorLocs = locs.filter(l => l.floor === visibleFloor);
  const W=compact?360:640, H=compact?340:480;
  const PAD=compact?18:24, xM=22, yM=22;
  const sx=x=>PAD+(x/xM)*(W-PAD*2);
  const sy=y=>PAD+(y/yM)*(H-PAD*2);
  const pathSet=new Set();
  for(let i=0;i<path.length-1;i++){ pathSet.add(`${path[i]}-${path[i+1]}`); pathSet.add(`${path[i+1]}-${path[i]}`); }

  // ── FLOOR LAYOUTS ──────────────────────────────────────────────────
  const FLOOR_BLOCKS = {
    1: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      {x:0.5, y:16,w:4, h:5, label:"Clinic"},
      {x:0.5, y:11,w:4, h:5, label:"Drug Testing Room"},
      {x:6.5, y:16,w:4, h:5, label:"Admission Office"},
      {x:6.5, y:11,w:4, h:5, label:"Lounge"},
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:0, w:9, h:3, label:"Library"},
      {x:16.5,y:3, w:4, h:2.5,label:"Supply Room"},
    ],
    2: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      // Building 3 - Floor 2 rooms
      {x:0.5, y:16,w:4, h:5, label:"Registrar's Office"},
      {x:6.5, y:16,w:4, h:5, label:"Cashier"},
      // Building 4 - Floor 2 rooms
      {x:0.5, y:11,w:4, h:5, label:"Computer Lab 1"},
      {x:6.5, y:11,w:4, h:5, label:"Computer Lab 2"},
      // Vertical transit
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
      // Building 1 - Floor 2 rooms
      {x:12,  y:12,w:4, h:4, label:"Classroom 201"},
      {x:17,  y:12,w:4, h:4, label:"Classroom 202"},
      // Building 2 - Floor 2 rooms
      {x:12,  y:1, w:8, h:4, label:"Faculty Room"},
    ],
    3: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
      // Add Floor 3 room blocks here when you have the data
    ],
    4: [
      {x:11.5,y:11,w:10,h:10,label:"Building 1"},
      {x:11.5,y:0, w:10,h:10,label:"Building 2"},
      {x:0.5, y:11,w:10,h:10,label:"Building 3"},
      {x:0.5, y:0, w:10,h:10,label:"Building 4"},
      {x:0.5, y:10,w:21,h:1, label:"Hallway"},
      {x:10.5,y:0, w:1, h:10,label:"Hallway"},
      {x:10.5,y:11,w:1, h:10,label:"Hallway"},
      {x:4.5, y:8, w:2, h:2, label:"Elevator"},
      {x:8,   y:8, w:2.5,h:2,label:"Stairs"},
      {x:0.5, y:8, w:2.5,h:2,label:"Stairs"},
      {x:11.5,y:8, w:2.5,h:2,label:"Stairs"},
      {x:18,  y:8, w:2.5,h:2,label:"Stairs"},
      // Add Floor 4 room blocks here when you have the data
    ],
  };

  const FLOOR_LABELS = {
    1: "GROUND FLOOR",
    2: "SECOND FLOOR",
    3: "THIRD FLOOR",
    4: "FOURTH FLOOR",
  };

  const BLOCKS = FLOOR_BLOCKS[visibleFloor] || FLOOR_BLOCKS[1];
  // ────────────────────────────────────────────────────────────────────

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%"
      style={{background:"#070d1a",borderRadius:10,border:"1px solid #1a2744",display:"block"}}>
      {BLOCKS.map((b,i)=>(
        <g key={i}>
          <rect x={sx(b.x)} y={sy(b.y)} width={sx(b.x+b.w)-sx(b.x)} height={sy(b.y+b.h)-sy(b.y)}
           fill="#0d1b2e" stroke="#1a3a5c" strokeWidth="1.5" opacity=".9"/>
          <text x={(sx(b.x)+sx(b.x+b.w))/2} y={(sy(b.y)+sy(b.y+b.h))/2}
            textAnchor="middle" dominantBaseline="middle"
            style={{fontSize:compact?5.5:7,fill:"#2a4a6e",fontFamily:"monospace",userSelect:"none",pointerEvents:"none"}}>
            {b.label}
          </text>
        </g>
      ))}
      {/* Floor label — now dynamic */}
      <text x={sx(11)} y={sy(22.5)} textAnchor="middle"
        style={{fontSize:15,fill:"#ffffff",fontFamily:"monospace"}}>
        {FLOOR_LABELS[visibleFloor] || `FLOOR ${visibleFloor}`}
      </text>
      {/* Edges */}
      {edges.map(([a,b],i)=>{
        const la=floorLocs.find(l=>l.id===a),lb=floorLocs.find(l=>l.id===b); if(!la||!lb) return null;
        const active=pathSet.has(`${a}-${b}`);
        return <path key={i} d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`}
          stroke={active?"#38bdf8":"#1a3a5c"} strokeWidth={active?2.5:1}strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={active?"none":"4,3"} fill="none" opacity={active?1:0.4}/>;
      })}
      {/* Animated path dots */}
      {path.length>1 && path.slice(0,-1).map((id,i)=>{
        const la=floorLocs.find(l=>l.id===id),lb=floorLocs.find(l=>l.id===path[i+1]); if(!la||!lb) return null;
        return (
          <g key={`anim${i}`}>
            <path id={`ps${i}`} d={`M${sx(la.x)},${sy(la.y)} L${sx(lb.x)},${sy(lb.y)}`} fill="none" stroke="none"/>
            <circle r={compact?3:4} fill="#38bdf8" opacity=".9">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${i*0.25}s`}><mpath href={`#ps${i}`}/></animateMotion>
            </circle>
          </g>
        );
      })}
      {/* Nodes */}
      {floorLocs.filter(loc => loc.type !== "hallway").map(loc => {
        const isF=fromId===loc.id, isT=toId===loc.id, inP=path.includes(loc.id);
        const meta=TYPE_META[loc.type]||{color:"#94a3b8",icon:"📍"};
        const r=compact?(isF||isT?11:inP?9:7):(isF||isT?14:inP?11:9);
        return (
          <g key={loc.id} style={{cursor:"pointer"}} onClick={()=>onNode(loc)}>
            {(isF||isT)&&<circle cx={sx(loc.x)} cy={sy(loc.y)} r={r+6} fill={isF?"#22c55e22":"#ef444422"}>
              <animate attributeName="r" values={`${r+4};${r+9};${r+4}`} dur="2s" repeatCount="indefinite"/>
            </circle>}
            <circle cx={sx(loc.x)} cy={sy(loc.y)} r={r}
              fill={isF?"#166534":isT?"#7f1d1d":inP?"#0c2d48":"#0d1b2e"}
              stroke={isF?"#22c55e":isT?"#ef4444":inP?"#38bdf8":meta.color}
              strokeWidth={isF||isT?2.5:1.5}/>
            <text x={sx(loc.x)} y={sy(loc.y)} textAnchor="middle" dominantBaseline="middle"
              style={{fontSize:compact?5.5:7,fill:isF||isT?"#fff":"#cbd5e1",fontFamily:"monospace",fontWeight:700,pointerEvents:"none"}}>
              {loc.id}
            </text>
            {!compact&&<text x={sx(loc.x)} y={sy(loc.y)+r+6} textAnchor="middle"
              style={{fontSize:5.5,fill:meta.color,fontFamily:"monospace",pointerEvents:"none"}}>
              {loc.name.length>14?loc.name.slice(0,13)+"…":loc.name}
            </text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────── FLOOR TRANSITION OVERLAY ─────────────────── */
const FLOOR_NAMES = ['','GROUND FLOOR','SECOND FLOOR','THIRD FLOOR','FOURTH FLOOR','FIFTH FLOOR'];

function FloorTransitionOverlay({ data, onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
  if (!data) return;
  // Use a minimal timeout to defer the state update out of the render cycle
  const enterTimer = setTimeout(() => setPhase('in'), 0);
  const holdTimer = setTimeout(() => setPhase('out'), 1800);
  return () => {
    clearTimeout(enterTimer);
    clearTimeout(holdTimer);
  };
}, [data]);

  useEffect(() => {
    if (phase === 'out') {
      const exitTimer = setTimeout(() => onDone(), 450);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, onDone]);

  if (!data) return null;

  const isUp = data.direction === 'up';

  const curtainStyle = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: '#020917',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    animation: phase === 'out'
      ? 'ft-slide-out 0.45s cubic-bezier(.4,0,.2,1) forwards'
      : 'ft-slide-in 0.35s cubic-bezier(.4,0,.2,1) forwards',
    // scanline texture
    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(56,189,248,0.02) 3px,rgba(56,189,248,0.02) 4px)',
  };

  const cardStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    opacity: phase === 'in' ? 0 : 1,
    transform: phase === 'in' ? 'scale(0.88)' : 'scale(1)',
    transition: 'opacity 0.3s 0.25s ease, transform 0.3s 0.25s ease',
  };

  return (
    <div style={curtainStyle} onClick={onDone}>
      <div style={cardStyle}>
        {/* From floor label */}
        <div style={{ color: '#334155', fontSize: 12, letterSpacing: 3, fontFamily: 'monospace' }}>
          FROM FLOOR {data.fromFloor}
        </div>

        {/* Animated arrow + dots */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {isUp && (
            <div style={{ fontSize: 52, lineHeight: 1, animation: 'ft-bounce 0.7s ease infinite alternate', color: '#38bdf8' }}>↑</div>
          )}
          <div style={{ display: 'flex', flexDirection: isUp ? 'column' : 'column-reverse', gap: 5, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: '50%', background: '#38bdf8',
                animation: `ft-dot 1s ${0.15 * i + 0.5}s infinite`,
              }}/>
            ))}
          </div>
          {!isUp && (
            <div style={{ fontSize: 52, lineHeight: 1, animation: 'ft-bounce 0.7s ease infinite alternate', color: '#38bdf8' }}>↓</div>
          )}
        </div>

        {/* Destination floor */}
        <div style={{ color: '#f1f5f9', fontSize: 44, fontWeight: 900, letterSpacing: 4, fontFamily: "'Courier New',monospace", lineHeight: 1 }}>
          FLOOR {data.toFloor}
        </div>
        <div style={{ color: '#38bdf8', fontSize: 11, letterSpacing: 4, fontFamily: 'monospace' }}>
          {FLOOR_NAMES[data.toFloor] || `FLOOR ${data.toFloor}`}
        </div>
        <div style={{ color: '#475569', fontSize: 11, letterSpacing: 2, fontFamily: 'monospace', marginTop: 4 }}>
          VIA {data.via.toUpperCase()}
        </div>

        <div style={{ color: '#1e3a5f', fontSize: 10, fontFamily: 'monospace', marginTop: 12 }}>
          TAP TO CONTINUE
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── IDLE SCREEN ──────────────────────────── */
function IdleScreen({ onTouch, announcements }) {
  const [tick, setTick]=useState(0);
  const [time, setTime]=useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>{ setTick(x=>(x+1)%announcements.length); setTime(new Date()); },4000); return()=>clearInterval(t); },[announcements.length]);
  const ann=announcements[tick];
  const hh=time.getHours().toString().padStart(2,"0");
  const mm=time.getMinutes().toString().padStart(2,"0");
  const days=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return (
    <div onClick={onTouch} style={{
      width:"100%",height:"100%",display:"flex",flexDirection:"column",
      background:"linear-gradient(135deg,#020917 0%,#030e22 50%,#040a18 100%)",
      cursor:"pointer",overflow:"hidden",position:"relative",userSelect:"none"
    }}>
      {/* Glowing orbs */}
      <div style={{position:"absolute",top:"20%",left:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#0ea5e920,transparent 70%)",filter:"blur(40px)"}}/>
      <div style={{position:"absolute",bottom:"15%",right:"8%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,#6366f115,transparent 70%)",filter:"blur(40px)"}}/>

      {/* TOP BAR */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 36px",borderBottom:"1px solid #0f2040",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏫</div>
          <div>
            <div style={{color:"#e2e8f0",fontSize:15,fontWeight:800,letterSpacing:1,fontFamily:"Georgia,serif"}}>ICCT COLLEGES</div>
            <div style={{color:"#38bdf8",fontSize:10,letterSpacing:3,fontFamily:"monospace"}}>CAINTA CAMPUS · SMART KIOSK</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{color:"#f1f5f9",fontSize:36,fontWeight:800,fontFamily:"'Courier New',monospace",letterSpacing:4,lineHeight:1}}>{hh}<span style={{color:"#38bdf8",animation:"blink 1s step-end infinite"}}>:</span>{mm}</div>
          <div style={{color:"#64748b",fontSize:10,letterSpacing:2,fontFamily:"monospace"}}>{days[time.getDay()]} · {months[time.getMonth()]} {time.getDate()}, {time.getFullYear()}</div>
        </div>
      </div>

      {/* CENTER */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,zIndex:2}}>
        <div style={{fontSize:60,lineHeight:1}}>🗺️</div>
        <div style={{color:"#f1f5f9",fontSize:32,fontWeight:900,fontFamily:"Georgia,serif",letterSpacing:1,textAlign:"center"}}>
          Campus Navigation
        </div>
        <div style={{color:"#475569",fontSize:14,fontFamily:"monospace",letterSpacing:2}}>FIND YOUR WAY AROUND CAMPUS</div>
        <div style={{
          marginTop:20,padding:"14px 48px",
          background:"linear-gradient(90deg,#0ea5e9,#6366f1)",
          borderRadius:50,color:"#fff",fontSize:16,fontWeight:800,letterSpacing:2,
          fontFamily:"monospace",
          boxShadow:"0 0 32px #0ea5e960",
          animation:"pulse 2s ease-in-out infinite",
        }}>
          ▶  TOUCH TO BEGIN
        </div>
      </div>

      {/* BOTTOM TICKER */}
      <div style={{borderTop:"1px solid #0f2040",padding:"12px 36px",display:"flex",alignItems:"center",gap:16,zIndex:2}}>
        <div style={{background:ann?.priority==="high"?"#7f1d1d":"#0f2040",border:`1px solid ${ann?.priority==="high"?"#ef4444":"#1e3a5f"}`,borderRadius:4,padding:"2px 10px",color:ann?.priority==="high"?"#fca5a5":"#38bdf8",fontSize:9,fontWeight:800,fontFamily:"monospace",letterSpacing:1,flexShrink:0}}>
          {ann?.priority==="high"?"🔴 URGENT":"📢 BULLETIN"}
        </div>
        <div style={{color:"#94a3b8",fontSize:13,fontFamily:"monospace",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
          <span style={{color:"#f1f5f9",fontWeight:700}}>{ann?.title}</span> — {ann?.body}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 32px #0ea5e960}50%{box-shadow:0 0 52px #0ea5e9cc}} @keyframes blink{50%{opacity:0}}
        @keyframes ft-slide-in{from{transform:translateY(-100%)}to{transform:translateY(0)}} @keyframes ft-slide-out{from{transform:translateY(0)}to{transform:translateY(100%)}}
        @keyframes ft-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes ft-dot{0%,100%{opacity:.15}50%{opacity:1}}`}
      </style>
    </div>
  );
}

/* ═══════════════════════════ MAIN KIOSK APP ══════════════════════════ */
export default function App() {
  const [visibleFloor, setVisibleFloor] = useState(1);
  const [db, setDb]=useState(()=>{
    const d={...INITIAL_DB, locations:INITIAL_DB.locations.map(l=>({...l,qr:`icct://campus/loc/${l.id}?name=${encodeURIComponent(l.name)}`}))};
    return d;
  });
  const [screen, setScreen]=useState("idle"); // idle | map | navigate | qr | announce | admin
  const [session, setSession]=useState(()=>{
    try {
      const t = localStorage.getItem("campusnav_session");
      const s = t ? parseToken(t) : null;
      return s ? {...s, token:t} : null;
    } catch { return null; }
  });
  const [path, setPath]=useState([]);
  const [fromId, setFromId]=useState(null);
  const [toId, setToId]=useState(null);
  const [navStep, setNavStep]=useState(0);
  const [selNode, setSelNode]=useState(null);
  const [qrLoc, setQrLoc]=useState(null);
  const [adminTab, setAdminTab]=useState("locations");
  const [loginF, setLoginF]=useState({u:"",p:"",err:""});
  const [newLoc, setNewLoc]=useState({name:"",floor:1,x:10,y:10,type:"classroom",desc:""});
  const [editLoc, setEditLoc]=useState(null);
  const [newAnn, setNewAnn]=useState({title:"",body:"",priority:"normal"});
  const [toast, setToast]=useState(null);
  const idleTimer=useRef(null);

  // Add these two new state values:
const [floorTransition, setFloorTransition] = useState(null);

// Add this helper function inside App:
const triggerFloorTransitionIfNeeded = useCallback((stepIndex, directions, locs, path) => {
  const dir = directions[stepIndex];
  if (!dir) return;

  const currId = path[stepIndex];
  const nextId = path[stepIndex + 1];
  if (!currId || !nextId) return;

  const curr = locs.find(l => l.id === currId);
  const next = locs.find(l => l.id === nextId);
  if (!curr || !next || curr.floor === next.floor) return;

  const isUp = next.floor > curr.floor;
  const via = (curr.type === 'elevator' || next.type === 'elevator') ? 'Elevator' : 'Stairs';

  setFloorTransition({
    direction: isUp ? 'up' : 'down',
    fromFloor: curr.floor,
    toFloor: next.floor,
    via,
  });
}, []);

  useEffect(()=>{
    if(session?.token) localStorage.setItem("campusnav_session", session.token);
    else localStorage.removeItem("campusnav_session");
  },[session]);

  // Auto-idle after 60s of no touch
  const resetIdle=useCallback(()=>{
    clearTimeout(idleTimer.current);
    if(screen!=="idle") idleTimer.current=setTimeout(()=>{ setScreen("idle"); setPath([]); setFromId(null); setToId(null); setSelNode(null); },60000);
  },[screen]);
  useEffect(()=>{ document.addEventListener("click",resetIdle); return()=>document.removeEventListener("click",resetIdle); },[resetIdle]);
  useEffect(()=>{ resetIdle(); },[resetIdle, screen]);

  const toast_show=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const doLogin=()=>{
    const u=db.users.find(x=>x.username===loginF.u&&x.password===loginF.p);
    if(!u){setLoginF(f=>({...f,err:"Invalid credentials."}));return;}
    setSession({...u,token:createToken(u)}); setLoginF({u:"",p:"",err:""}); toast_show(`Welcome, ${u.username}!`);
  };

  const doNavigate=()=>{
    if(!fromId||!toId){toast_show("Select FROM and TO first.","err");return;}
    const r=aStar(fromId,toId,db.locations,db.edges);
    setPath(r); setNavStep(0);
    if(r.length===0) toast_show("No path found between nodes.","err");
    else toast_show(`Route found — ${r.length} stops via A*.`);
  };

  const clearNav=()=>{ setPath([]); setFromId(null); setToId(null); setNavStep(0); };

  const handleNode=(loc)=>{
    if(screen==="navigate"){
      if(!fromId){setFromId(loc.id);toast_show(`FROM: ${loc.name}`);}
      else if(!toId&&loc.id!==fromId){setToId(loc.id);toast_show(`TO: ${loc.name}`);}
      else{setFromId(loc.id);setToId(null);setPath([]);setNavStep(0);}
    } else { setSelNode(loc); }
  };

  const addLoc=()=>{
    if(!newLoc.name.trim()){toast_show("Name required.","err");return;}
    const id=db.nextId.locations;
    const loc={...newLoc,id,floor:+newLoc.floor,x:+newLoc.x,y:+newLoc.y,qr:`icct://campus/loc/${id}?name=${encodeURIComponent(newLoc.name)}`};
    setDb(d=>({...d,locations:[...d.locations,loc],nextId:{...d.nextId,locations:id+1}}));
    setNewLoc({name:"",floor:1,x:10,y:10,type:"classroom",desc:""});
    toast_show("Location added!");
  };
  const delLoc=(id)=>{ setDb(d=>({...d,locations:d.locations.filter(l=>l.id!==id),edges:d.edges.filter(([a,b])=>a!==id&&b!==id)})); toast_show("Deleted."); };
  const saveLoc=()=>{ setDb(d=>({...d,locations:d.locations.map(l=>l.id===editLoc.id?{...editLoc,floor:+editLoc.floor,x:+editLoc.x,y:+editLoc.y}:l)})); setEditLoc(null); toast_show("Updated!"); };
  const addAnn=()=>{
    if(!newAnn.title.trim()){toast_show("Title required.","err");return;}
    const id=db.nextId.announcements;
    setDb(d=>({...d,announcements:[...d.announcements,{...newAnn,id,date:new Date().toISOString().slice(0,10)}],nextId:{...d.nextId,announcements:id+1}}));
    setNewAnn({title:"",body:"",priority:"normal"}); toast_show("Posted!");
  };
  const delAnn=(id)=>{ setDb(d=>({...d,announcements:d.announcements.filter(a=>a.id!==id)})); toast_show("Deleted."); };

  const pathNodes=path.map(id=>db.locations.find(l=>l.id===id)).filter(Boolean);
  const directions = useMemo(() => getDirections(path, db.locations), [path, db.locations]);

  /* ── IDLE SCREEN ── */
  if(screen==="idle") return <KioskFrame><IdleScreen onTouch={()=>setScreen("map")} announcements={db.announcements}/></KioskFrame>;

  /* ── KIOSK SHELL ── */
  return (
    <KioskFrame>
      <div style={K.shell}>
        {/* LEFT SIDEBAR */}
        <aside style={K.sidebar}>
          <div style={K.logoBox}>
            <div style={{fontSize:28,lineHeight:1}}>🏫</div>
            <div>
              <div style={K.logoName}>ICCT</div>
              <div style={K.logoSub}>CAINTA</div>
            </div>
          </div>
          <div style={K.clock}><LiveClock/></div>
          <nav style={K.navList}>
            {[
              {key:"map",      label:"Campus Map",  icon:"🗺️"},
              {key:"navigate", label:"Navigate",    icon:"🧭"},
              {key:"qr",       label:"QR Codes",    icon:"📲"},
              {key:"announce", label:"Bulletins",   icon:"📢"},
              {key:"admin",    label:"Admin",       icon:"🔐"},
            ].map(n=>(
              <button key={n.key} onClick={()=>{setScreen(n.key);setSelNode(null);}}
                style={{...K.navBtn,...(screen===n.key?K.navBtnOn:{})}}>
                <span style={{fontSize:20}}>{n.icon}</span>
                <span style={K.navLabel}>{n.label}</span>
                {screen===n.key&&<div style={K.navIndicator}/>}
              </button>
            ))}
          </nav>
          <button onClick={()=>setScreen("idle")} style={K.idleBtn}>
            <span>⏻</span><span style={{fontSize:10,letterSpacing:1}}>STANDBY</span>
          </button>
          {session&&<div style={K.sessionBadge}>
            <span style={{fontSize:9,color:"#34d399",letterSpacing:1}}>ADMIN ACTIVE</span>
            <button onClick={()=>{setSession(null);toast_show("Signed out.");}} style={K.signOutBtn}>Sign Out</button>
          </div>}
        </aside>

        {/* MAIN CONTENT */}
        <main style={K.content}>

          {/* ── MAP ── */}
          {screen==="map"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>🗺️  Campus Map</div>
                <div style={K.panelSub}>Tap any node to view room details · ICCT Cainta Draft Layout</div>
              </div>
              <div style={{display:"flex", gap:6, flexShrink:0}}>
                {[1, 2, 3, 4].map(f => (
                  <button key={f} onClick={() => setVisibleFloor(f)}
                    style={{
                      background: visibleFloor===f ? "#1d4ed8" : "#070d1a",
                      border: `1px solid ${visibleFloor===f ? "#3b82f6" : "#0f2040"}`,
                      color: visibleFloor===f ? "#fff" : "#475569",
                      padding: "5px 14px", borderRadius: 6, cursor: "pointer",
                      fontSize: 11, fontFamily: "monospace", fontWeight: 700
                    }}>
                    FL. {f}
                  </button>
                ))}
              </div>
              <div style={{flex:1,display:"flex",gap:12,minHeight:0}}>
                <div style={{flex:1,minWidth:0}}>
                  <CampusMap locs={db.locations} edges={db.edges} path={[]} onNode={handleNode} fromId={null} toId={null} visibleFloor={visibleFloor}/>
                </div>
                <div style={K.mapSide}>
                  <div style={K.legendTitle}>ROOM TYPES</div>
                  {Object.entries(TYPE_META).map(([t,m])=>(
                    <div key={t} style={K.legendRow}>
                      <span>{m.icon}</span>
                      <span style={{color:m.color,fontSize:11,fontFamily:"monospace",textTransform:"capitalize"}}>{t}</span>
                    </div>
                  ))}
                  {selNode&&(
                    <div style={K.nodeCard}>
                      <div style={{color:TYPE_META[selNode.type]?.color||"#94a3b8",fontSize:10,fontWeight:800,letterSpacing:1,marginBottom:4}}>{selNode.type.toUpperCase()} · FL.{selNode.floor}</div>
                      <div style={{color:"#f1f5f9",fontWeight:800,fontSize:14,marginBottom:6,lineHeight:1.3}}>{selNode.name}</div>
                      <div style={{color:"#94a3b8",fontSize:11,marginBottom:10}}>{selNode.desc}</div>
                      <button onClick={()=>{setScreen("navigate");setFromId(selNode.id);setSelNode(null);}} style={K.miniBtn}>🧭 Navigate Here</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── NAVIGATE ── */}
          {screen==="navigate"&&(
          <div style={K.panel}>
            <div style={K.panelHdr}>
              <div style={K.panelTitle}>🧭  A* Indoor Navigation</div>
              <div style={K.panelSub}>Select FROM → TO on map or use selectors · Shortest path via A* algorithm</div>
            </div>

            {/* Selectors row FIRST — always visible */}
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <select value={fromId||""} onChange={e=>setFromId(+e.target.value||null)} style={K.sel}>
                <option value="">🟢 FROM — tap map or select</option>
                {db.locations.map(l=><option key={l.id} value={l.id}>{l.id}. {l.name}</option>)}
              </select>
              <select value={toId||""} onChange={e=>setToId(+e.target.value||null)} style={K.sel}>
                <option value="">🔴 TO — tap map or select</option>
                {db.locations.map(l=><option key={l.id} value={l.id}>{l.id}. {l.name}</option>)}
              </select>
              <button onClick={doNavigate} style={K.goBtn}>GO</button>
              <button onClick={clearNav} style={K.clearBtn}>✕</button>
            </div>

            {/* Map + Route side by side */}
            <div style={{flex:1,display:"flex",gap:12,minHeight:0,overflow:"hidden"}}>
              {/* Map */}
              <div style={{flex:"0 0 58%",minWidth:0,overflow:"hidden"}}>
                <CampusMap locs={db.locations} edges={db.edges} path={path} onNode={handleNode} fromId={fromId} toId={toId} compact/>
              </div>

              {/* Route panel */}
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minWidth:0,overflow:"hidden"}}>
                {path.length===0?(
                  <div style={K.emptyRoute}>
                    <div style={{fontSize:36}}>🧭</div>
                    <div style={{color:"#334155",fontSize:13,fontFamily:"monospace"}}>Select start & end,<br/>then tap GO</div>
                  </div>
                ):(
                  <>
                    <div style={K.routeHdr}>
                      <span style={{color:"#38bdf8",fontWeight:800,fontSize:12,fontFamily:"monospace"}}>ROUTE · {pathNodes.length} STOPS</span>
                      <span style={{color:"#1e3a5f",fontSize:10,fontFamily:"monospace"}}>A* OPTIMAL PATH</span>
                    </div>
                    <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                      {directions.map((dir, i) => (
                        <div key={i} onClick={() => { setNavStep(i); triggerFloorTransitionIfNeeded(i, directions, db.locations, path); }}
                          style={{...K.stepRow,...(navStep===i?K.stepRowOn:{})}}>
                          <div style={{
                            width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",
                            justifyContent:"center",fontSize:16,flexShrink:0,
                            background:i===0?"#166534":i===directions.length-1?"#7f1d1d":"#0a1f35",
                            border:`1px solid ${i===0?"#22c55e":i===directions.length-1?"#ef4444":"#1e3a5f"}`,
                          }}>
                            {dir.icon}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{color:"#f1f5f9",fontWeight:700,fontSize:12,lineHeight:1.3}}>{dir.text}</div>
                            <div style={{color:"#475569",fontSize:10,fontFamily:"monospace",marginTop:2}}>{dir.sub}</div>
                          </div>
                          {i===0&&<span style={{color:"#22c55e",fontSize:9,fontWeight:800,flexShrink:0}}>START</span>}
                          {i===directions.length-1&&<span style={{color:"#ef4444",fontSize:9,fontWeight:800,flexShrink:0}}>END</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button disabled={navStep===0} onClick={() => {const newStep = navStep - 1; setNavStep(newStep);
                        triggerFloorTransitionIfNeeded(newStep, directions, db.locations, path);}} style={K.stepBtn}>◀ Prev</button>
                      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#334155",fontSize:11,fontFamily:"monospace"}}>
                        {navStep+1} / {directions.length}
                      </div>
                      <button disabled={navStep===directions.length-1} onClick={() => {const newStep = navStep + 1; setNavStep(newStep);
                        triggerFloorTransitionIfNeeded(newStep, directions, db.locations, path); }} style={K.stepBtn}>Next ▶</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

          {/* ── QR ── */}
          {screen==="qr"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>📲  QR Code Directory</div>
                <div style={K.panelSub}>Scan any code with your phone to open mobile navigation</div>
              </div>
              <div style={{flex:1,display:"flex",gap:12,minHeight:0,overflow:"hidden"}}>
                {/* Location list */}
                <div style={{flex:"0 0 38%",display:"flex",flexDirection:"column",gap:4,overflowY:"auto"}}>
                  {db.locations.map(loc=>(
                    <button key={loc.id} onClick={()=>setQrLoc(loc)}
                      style={{...K.qrListItem,...(qrLoc?.id===loc.id?K.qrListItemOn:{})}}>
                      <span style={{fontSize:16}}>{TYPE_META[loc.type]?.icon||"📍"}</span>
                      <div style={{textAlign:"left",minWidth:0}}>
                        <div style={{color:"#f1f5f9",fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{loc.name}</div>
                        <div style={{color:"#475569",fontSize:10,fontFamily:"monospace"}}>Floor {loc.floor} · #{loc.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {/* QR display */}
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                  {qrLoc?(
                    <>
                      <div style={K.qrBig}>
                        <QRCode text={qrLoc.qr} size={160}/>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{color:TYPE_META[qrLoc.type]?.color||"#94a3b8",fontSize:11,fontWeight:800,letterSpacing:2,fontFamily:"monospace",marginBottom:4}}>
                          {TYPE_META[qrLoc.type]?.icon} {qrLoc.type.toUpperCase()} · FLOOR {qrLoc.floor}
                        </div>
                        <div style={{color:"#f1f5f9",fontSize:18,fontWeight:900}}>{qrLoc.name}</div>
                        <div style={{color:"#475569",fontSize:12,margin:"6px 0"}}>{qrLoc.desc}</div>
                        <div style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:6,padding:"6px 14px",display:"inline-block",marginTop:4}}>
                          <code style={{color:"#38bdf8",fontSize:10}}>{qrLoc.qr}</code>
                        </div>
                      </div>
                    </>
                  ):(
                    <div style={{textAlign:"center",color:"#1e3a5f"}}>
                      <div style={{fontSize:48}}>📲</div>
                      <div style={{fontFamily:"monospace",fontSize:13,marginTop:8}}>Select a location</div>
                    </div>
                  )}
                </div>
                {/* QR grid preview */}
                <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",gap:6,overflowY:"auto"}}>
                  {db.locations.slice(0,10).map(loc=>(
                    <div key={loc.id} onClick={()=>setQrLoc(loc)} style={{...K.qrMini,...(qrLoc?.id===loc.id?{border:"1px solid #38bdf8"}:{}),cursor:"pointer"}}>
                      <QRCode text={loc.qr} size={56}/>
                      <div style={{color:"#334155",fontSize:8,fontFamily:"monospace",textAlign:"center",marginTop:2}}>{loc.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {screen==="announce"&&(
            <div style={K.panel}>
              <div style={K.panelHdr}>
                <div style={K.panelTitle}>📢  Campus Bulletins</div>
                <div style={K.panelSub}>Official announcements from ICCT Administration</div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
                {db.announcements.map(a=>(
                  <div key={a.id} style={{...K.annCard,borderLeft:`4px solid ${a.priority==="high"?"#ef4444":"#1e3a5f"}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      {a.priority==="high"&&<span style={K.urgentTag}>🔴 URGENT</span>}
                      <span style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{a.date}</span>
                    </div>
                    <div style={{color:"#f1f5f9",fontSize:15,fontWeight:800,marginBottom:6}}>{a.title}</div>
                    <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.5}}>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {screen==="admin"&&(
            !session?(
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={K.loginBox}>
                  <div style={{textAlign:"center",marginBottom:24}}>
                    <div style={{fontSize:48}}>🔐</div>
                    <div style={{color:"#f1f5f9",fontSize:20,fontWeight:900,marginTop:8}}>Admin Access</div>
                    <div style={{color:"#475569",fontSize:12,fontFamily:"monospace",marginTop:4}}>ICCT Cainta Kiosk System</div>
                  </div>
                  {loginF.err&&<div style={K.errBox}>{loginF.err}</div>}
                  <input style={K.inp} placeholder="Username" value={loginF.u} onChange={e=>setLoginF(f=>({...f,u:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
                  <input style={K.inp} type="password" placeholder="Password" value={loginF.p} onChange={e=>setLoginF(f=>({...f,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
                  <button onClick={doLogin} style={K.loginBtn}>SIGN IN</button>
                  <div style={{color:"#1e3a5f",fontSize:11,textAlign:"center",marginTop:16,fontFamily:"monospace"}}>
                    Demo: <span style={{color:"#38bdf8"}}>admin</span> / <span style={{color:"#38bdf8"}}>icct2026</span>
                  </div>
                </div>
              </div>
            ):(
              <div style={K.panel}>
                <div style={K.panelHdr}>
                  <div style={K.panelTitle}>🔐  Admin Panel</div>
                  <div style={{display:"flex",gap:6}}>
                    {["locations","announcements","users"].map(t=>(
                      <button key={t} onClick={()=>setAdminTab(t)}
                        style={{...K.tabBtn,...(adminTab===t?K.tabBtnOn:{})}}>
                        {t.charAt(0).toUpperCase()+t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>

                  {/* LOCATIONS */}
                  {adminTab==="locations"&&(
                    <>
                      <div style={K.formBox}>
                        <div style={K.formTitle}>➕ Add Location</div>
                        <div style={K.formGrid}>
                          <input style={K.inp} placeholder="Name" value={newLoc.name} onChange={e=>setNewLoc(f=>({...f,name:e.target.value}))}/>
                          <select style={K.inp} value={newLoc.type} onChange={e=>setNewLoc(f=>({...f,type:e.target.value}))}>
                            {Object.keys(TYPE_META).map(t=><option key={t}>{t}</option>)}
                          </select>
                          <input style={K.inp} type="number" placeholder="Floor" value={newLoc.floor} onChange={e=>setNewLoc(f=>({...f,floor:e.target.value}))}/>
                          <input style={K.inp} type="number" placeholder="X" value={newLoc.x} onChange={e=>setNewLoc(f=>({...f,x:e.target.value}))}/>
                          <input style={K.inp} type="number" placeholder="Y" value={newLoc.y} onChange={e=>setNewLoc(f=>({...f,y:e.target.value}))}/>
                          <input style={K.inp} placeholder="Description" value={newLoc.desc} onChange={e=>setNewLoc(f=>({...f,desc:e.target.value}))}/>
                        </div>
                        <button onClick={addLoc} style={K.addBtn}>Add Location</button>
                      </div>
                      <div style={{overflowX:"auto"}}>
                        <table style={K.tbl}>
                          <thead><tr>{["ID","Name","Type","Fl","X","Y","Actions"].map(h=><th key={h} style={K.th}>{h}</th>)}</tr></thead>
                          <tbody>
                            {db.locations.map(loc=>editLoc?.id===loc.id?(
                              <tr key={loc.id} style={{background:"#0d1f35"}}>
                                <td style={K.td}>{loc.id}</td>
                                <td style={K.td}><input style={K.inpSm} value={editLoc.name} onChange={e=>setEditLoc(f=>({...f,name:e.target.value}))}/></td>
                                <td style={K.td}><select style={K.inpSm} value={editLoc.type} onChange={e=>setEditLoc(f=>({...f,type:e.target.value}))}>{Object.keys(TYPE_META).map(t=><option key={t}>{t}</option>)}</select></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.floor} onChange={e=>setEditLoc(f=>({...f,floor:e.target.value}))}/></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.x} onChange={e=>setEditLoc(f=>({...f,x:e.target.value}))}/></td>
                                <td style={K.td}><input style={{...K.inpSm,width:40}} type="number" value={editLoc.y} onChange={e=>setEditLoc(f=>({...f,y:e.target.value}))}/></td>
                                <td style={K.td}><button onClick={saveLoc} style={K.sBtnOk}>✓</button> <button onClick={()=>setEditLoc(null)} style={K.sBtnGhost}>✕</button></td>
                              </tr>
                            ):(
                              <tr key={loc.id} style={{borderBottom:"1px solid #0f1f35"}}>
                                <td style={K.td}>{loc.id}</td>
                                <td style={K.td}><span style={{color:TYPE_META[loc.type]?.color||"#94a3b8"}}>{TYPE_META[loc.type]?.icon}</span> {loc.name}</td>
                                <td style={K.td}>{loc.type}</td>
                                <td style={K.td}>{loc.floor}</td>
                                <td style={K.td}>{loc.x}</td>
                                <td style={K.td}>{loc.y}</td>
                                <td style={K.td}>
                                  <button onClick={()=>setEditLoc({...loc})} style={K.sBtnOk}>✏️</button>{" "}
                                  <button onClick={()=>delLoc(loc.id)} style={K.sBtnDanger}>🗑️</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {/* ANNOUNCEMENTS */}
                  {adminTab==="announcements"&&(
                    <>
                      <div style={K.formBox}>
                        <div style={K.formTitle}>➕ Post Announcement</div>
                        <div style={K.formGrid}>
                          <input style={K.inp} placeholder="Title" value={newAnn.title} onChange={e=>setNewAnn(f=>({...f,title:e.target.value}))}/>
                          <select style={K.inp} value={newAnn.priority} onChange={e=>setNewAnn(f=>({...f,priority:e.target.value}))}>
                            <option value="normal">Normal</option><option value="high">High Priority</option>
                          </select>
                          <textarea style={{...K.inp,gridColumn:"1/-1",minHeight:60,resize:"vertical"}} placeholder="Message body..." value={newAnn.body} onChange={e=>setNewAnn(f=>({...f,body:e.target.value}))}/>
                        </div>
                        <button onClick={addAnn} style={K.addBtn}>Post Announcement</button>
                      </div>
                      {db.announcements.map(a=>(
                        <div key={a.id} style={{...K.annCard,position:"relative"}}>
                          <button onClick={()=>delAnn(a.id)} style={{position:"absolute",top:10,right:10,...K.sBtnDanger}}>🗑️</button>
                          <div style={{color:a.priority==="high"?"#ef4444":"#38bdf8",fontSize:10,fontWeight:800,fontFamily:"monospace",marginBottom:4}}>{a.priority.toUpperCase()} · {a.date}</div>
                          <div style={{color:"#f1f5f9",fontWeight:700,marginBottom:4}}>{a.title}</div>
                          <div style={{color:"#94a3b8",fontSize:12}}>{a.body}</div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* USERS */}
                  {adminTab==="users"&&(
                    <div>
                      <table style={K.tbl}>
                        <thead><tr>{["ID","Username","Role","Session"].map(h=><th key={h} style={K.th}>{h}</th>)}</tr></thead>
                        <tbody>
                          {db.users.map(u=>(
                            <tr key={u.id} style={{borderBottom:"1px solid #0f1f35"}}>
                              <td style={K.td}>{u.id}</td>
                              <td style={K.td}>{u.username}</td>
                              <td style={K.td}><span style={{color:u.role==="admin"?"#fbbf24":"#38bdf8",fontSize:10,fontWeight:800,background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:4,fontFamily:"monospace"}}>{u.role.toUpperCase()}</span></td>
                              <td style={K.td}><span style={{color:session?.id===u.id?"#34d399":"#334155",fontSize:10,fontFamily:"monospace"}}>{session?.id===u.id?"● ACTIVE":"○ —"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{marginTop:12,background:"#0a1220",border:"1px solid #1a2744",borderRadius:8,padding:14,fontSize:11,color:"#334155",fontFamily:"monospace",lineHeight:1.7}}>
                        🔒 SECURITY NOTE: Production deployment uses bcrypt password hashing, signed JWTs (HS256) with 1h expiry, HTTPS-only cookies, RBAC middleware, rate limiting on login endpoint, and audit logging.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

        </main>
      </div>

      {/* TOAST */}
      {toast&&<div style={{...K.toast,background:toast.type==="err"?"#450a0a":"#052e16",borderColor:toast.type==="err"?"#ef4444":"#22c55e",color:toast.type==="err"?"#fca5a5":"#bbf7d0"}}>{toast.msg}</div>}
    <FloorTransitionOverlay
      data={floorTransition}
      onDone={() => setFloorTransition(null)}
    />
    </KioskFrame>
  );
}

/* ── LIVE CLOCK ── */
function LiveClock(){
  const [t,setT]=useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setT(new Date()),1000); return()=>clearInterval(i); },[]);
  return (
    <div style={{textAlign:"center"}}>
      <div style={{color:"#f1f5f9",fontSize:22,fontWeight:800,fontFamily:"'Courier New',monospace",letterSpacing:3,lineHeight:1}}>
        {t.getHours().toString().padStart(2,"0")}:{t.getMinutes().toString().padStart(2,"0")}
      </div>
      <div style={{color:"#1e3a5f",fontSize:9,fontFamily:"monospace",letterSpacing:1,marginTop:2}}>
        {["SUN","MON","TUE","WED","THU","FRI","SAT"][t.getDay()]} {t.getDate()}/{t.getMonth()+1}
      </div>
    </div>
  );
}

/* ── KIOSK FRAME (14-inch landscape viewport) ── */
function KioskFrame({children}){
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scale = Math.min(size.w / 1366, size.h / 768);
  const ml = (size.w - 1366 * scale) / 2;
  const mt = (size.h - 768 * scale) / 2;

  return (
    <div style={{
      width:"100vw", height:"100vh", background:"#000",
      overflow:"hidden", position:"relative",
    }}>
      <div style={{
        width:1366, height:768,
        position:"absolute",
        overflow:"hidden",
        background:"#020917",
        transform:`scale(${scale})`,
        transformOrigin:"top left",
        left: ml,
        top: mt,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────── KIOSK STYLES ──────────────────────────── */
const K = {
  shell:       { width:1366, height:768, display:"flex", overflow:"hidden", fontFamily:"'Segoe UI',system-ui,sans-serif" },
  sidebar:     { width:156, background:"#030e1e", borderRight:"1px solid #0a1f35", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:8, flexShrink:0 },
  logoBox:     { display:"flex", alignItems:"center", gap:8, padding:"0 12px", width:"100%" },
  logoName:    { color:"#f1f5f9", fontSize:16, fontWeight:900, letterSpacing:1 },
  logoSub:     { color:"#1e3a5f", fontSize:9, fontFamily:"monospace", letterSpacing:2 },
  clock:       { padding:"8px 0", width:"100%", borderTop:"1px solid #0a1f35", borderBottom:"1px solid #0a1f35", margin:"4px 0" },
  navList:     { display:"flex", flexDirection:"column", gap:2, width:"100%", flex:1 },
  navBtn:      { display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 8px", background:"transparent", border:"none", cursor:"pointer", position:"relative", width:"100%", transition:"background .15s" },
  navBtnOn:    { background:"#0a1f35" },
  navLabel:    { color:"#475569", fontSize:10, fontFamily:"monospace", letterSpacing:.5 },
  navIndicator:{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:3, height:28, background:"#38bdf8", borderRadius:"2px 0 0 2px" },
  idleBtn:     { display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px", background:"transparent", border:"1px solid #0a1f35", borderRadius:8, cursor:"pointer", color:"#1e3a5f", width:"80%", fontSize:18, marginTop:"auto" },
  sessionBadge:{ width:"80%", background:"#022c1a", border:"1px solid #064e2a", borderRadius:6, padding:"6px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  signOutBtn:  { background:"transparent", border:"none", color:"#374151", fontSize:10, cursor:"pointer", fontFamily:"monospace" },
  content:     { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#040d1a" },
  panel:       { flex:1, display:"flex", flexDirection:"column", gap:10, padding:16, overflow:"hidden" },
  panelHdr:    { display:"flex", justifyContent:"space-between", alignItems:"baseline", flexShrink:0 },
  panelTitle:  { color:"#f1f5f9", fontSize:16, fontWeight:800, letterSpacing:.5 },
  panelSub:    { color:"#1e3a5f", fontSize:10, fontFamily:"monospace" },
  mapSide:     { width:160, display:"flex", flexDirection:"column", gap:4, overflowY:"auto", flexShrink:0 },
  legendTitle: { color:"#1e3a5f", fontSize:9, fontFamily:"monospace", letterSpacing:2, fontWeight:800, marginBottom:4 },
  legendRow:   { display:"flex", alignItems:"center", gap:6, padding:"2px 0" },
  nodeCard:    { background:"#070d1a", border:"1px solid #0f2040", borderRadius:8, padding:10, marginTop:8 },
  miniBtn:     { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#38bdf8", padding:"5px 10px", borderRadius:6, cursor:"pointer", fontSize:10, fontFamily:"monospace", width:"100%" },
  sel:         { flex:1, background:"#070d1a", border:"1px solid #0f2040", color:"#94a3b8", padding:"6px 10px", borderRadius:6, fontSize:11, fontFamily:"monospace" },
  goBtn:       { background:"#1d4ed8", border:"none", color:"#fff", padding:"6px 18px", borderRadius:6, cursor:"pointer", fontWeight:800, fontSize:13 },
  clearBtn:    { background:"#1a0505", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12 },
  emptyRoute:  { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, border:"1px dashed #0f2040", borderRadius:10 },
  routeHdr:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"#070d1a", borderRadius:6, border:"1px solid #0f2040", flexShrink:0 },
  stepRow:     { display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:6, cursor:"pointer", border:"1px solid transparent", transition:"all .1s" },
  stepRowOn:   { background:"#0a1f35", border:"1px solid #1e3a5f" },
  stepNum:     { width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff", border:"1px solid", flexShrink:0 },
  stepBtn:     { background:"#070d1a", border:"1px solid #0f2040", color:"#475569", padding:"5px 14px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" },
  qrListItem:  { display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#070d1a", border:"1px solid #0f2040", borderRadius:7, cursor:"pointer", transition:"all .1s", width:"100%" },
  qrListItemOn:{ background:"#0a1f35", border:"1px solid #1e3a5f" },
  qrBig:       { padding:12, background:"#fff", borderRadius:10, boxShadow:"0 0 40px #0ea5e940" },
  qrMini:      { padding:6, background:"#070d1a", border:"1px solid #0f2040", borderRadius:6 },
  annCard:     { background:"#070d1a", border:"1px solid #0f2040", borderRadius:8, padding:14 },
  urgentTag:   { background:"#450a0a", color:"#fca5a5", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:4, fontFamily:"monospace", letterSpacing:1 },
  loginBox:    { background:"#070d1a", border:"1px solid #0f2040", borderRadius:16, padding:36, width:320, display:"flex", flexDirection:"column", gap:12 },
  errBox:      { background:"#450a0a", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"8px 12px", borderRadius:6, fontSize:12 },
  inp:         { background:"#030e1e", border:"1px solid #0f2040", color:"#f1f5f9", padding:"8px 12px", borderRadius:6, fontSize:12, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box" },
  inpSm:       { background:"#030e1e", border:"1px solid #0f2040", color:"#f1f5f9", padding:"3px 6px", borderRadius:4, fontSize:11, fontFamily:"inherit", width:80 },
  loginBtn:    { background:"linear-gradient(90deg,#1d4ed8,#4f46e5)", border:"none", color:"#fff", padding:"11px", borderRadius:8, cursor:"pointer", fontWeight:800, fontSize:14, letterSpacing:1, fontFamily:"monospace" },
  formBox:     { background:"#070d1a", border:"1px solid #0f2040", borderRadius:10, padding:14, flexShrink:0 },
  formTitle:   { color:"#334155", fontSize:12, fontWeight:700, marginBottom:10, fontFamily:"monospace" },
  formGrid:    { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 },
  addBtn:      { background:"#1d4ed8", border:"none", color:"#fff", padding:"7px 18px", borderRadius:6, cursor:"pointer", fontWeight:700, fontSize:12 },
  tbl:         { width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:"monospace" },
  th:          { background:"#070d1a", color:"#334155", padding:"7px 10px", textAlign:"left", borderBottom:"1px solid #0f2040", fontWeight:800, letterSpacing:1 },
  td:          { padding:"6px 10px", color:"#94a3b8", verticalAlign:"middle" },
  tabBtn:      { background:"transparent", border:"1px solid #0f2040", color:"#334155", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"monospace" },
  tabBtnOn:    { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#38bdf8", fontWeight:700 },
  sBtnOk:      { background:"#0a1f35", border:"1px solid #1e3a5f", color:"#93c5fd", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  sBtnGhost:   { background:"transparent", border:"1px solid #1e293b", color:"#475569", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  sBtnDanger:  { background:"#450a0a", border:"1px solid #7f1d1d", color:"#fca5a5", padding:"3px 8px", borderRadius:4, cursor:"pointer", fontSize:11 },
  toast:       { position:"fixed", bottom:20, right:20, padding:"10px 20px", borderRadius:8, border:"1px solid", fontSize:12, fontWeight:700, fontFamily:"monospace", zIndex:9999, boxShadow:"0 8px 32px #00000088" },
};
