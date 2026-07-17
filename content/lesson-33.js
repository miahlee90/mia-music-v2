/* Lesson 33 — Intervals (AEMT Book 2, Unit 8)
   Built from drafts/UNIT 8 – Lesson 33.md; AEMT p.52 verified by render.
   QA notes honored: count BOTH notes (C–F = C1 D2 E3 F4) and never count spaces;
   melodic vs harmonic = HOW notes are played, not the size.
   Uses staff.js v7.4 {chord:true} harmonic stacking + interval-id generator.
   Game-forward: count-up climber, Interval Sprint (gen-race), ear rounds, interval hunt.
   NOTE: edit by FULL-FILE REWRITE only. */

/* count-up climber v2 (instructor): notes + KEYBOARD — the student PRESSES every key
   from the lower note to the upper one; each pressed key stays colored and shows its
   count number, so the interval number appears right on the keys. */
function MF_L33_countUp(container,fb){
  const ROUNDS=[{lo:"C",hi:"F",num:4},{lo:"D",hi:"G",num:4},{lo:"C",hi:"G",num:5},{lo:"E",hi:"G",num:3}];
  const NAMES={2:"2nd",3:"3rd",4:"4th",5:"5th"};
  const MID={C:60,D:62,E:64,F:65,G:67,A:69,B:71};
  const WH=[60,62,64,65,67,69,71,72];
  const L=["C","D","E","F","G","A","B"];
  let r=0,k=0,kb=null,pressed=[];
  container.innerHTML=`<div class="big-q l33-q" style="text-align:center"></div>
    <div class="l33-staff"></div>
    <div class="l33-count" style="text-align:center;font-weight:800;font-size:1.15rem;min-height:26px;color:var(--correct)"></div>
    <div class="l33-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">Count EVERY key from the lower note to the higher one — and include BOTH notes. The lower note is 1!</p>`;
  const q=container.querySelector(".l33-q"), holder=container.querySelector(".l33-staff"),
        cnt=container.querySelector(".l33-count"), kbHolder=container.querySelector(".l33-kb");
  function path(){ const cur=ROUNDS[r], s=L.indexOf(cur.lo); return L.slice(s,s+cur.num); }
  function badge(m,n){
    const wi=WH.indexOf(m); if(wi<0) return;
    const keyEl=kb.el.children[wi]; if(!keyEl) return;
    keyEl.insertAdjacentHTML("beforeend",`<div style="position:absolute;top:6px;left:0;width:100%;text-align:center;font-weight:800;font-size:16px;color:var(--primary);pointer-events:none">${n}</div>`);
  }
  function ask(){
    const cur=ROUNDS[r]; k=0; pressed=[]; cnt.textContent="";
    q.innerHTML=`Climb ${r+1} of ${ROUNDS.length}: from <b>${cur.lo}</b> up to <b>${cur.hi}</b> — press every key on the way, starting with <b>${cur.lo}</b> itself!`;
    Staff.render(holder,{clef:"treble",notes:[{p:cur.lo+"4",d:"h"},{p:cur.hi+"4",d:"h"}],brackets:[{from:0,to:1,label:"?"}],width:260});
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,point:MID[cur.lo],
      onKey:m=>{
        const p=path(), pathM=p.map(x=>MID[x]);
        if(m===pathM[k]){
          k++; pressed.push(m); kb.mark(pressed); kb.point(null); badge(m,k);
          cnt.textContent=p.slice(0,k).map((x,i2)=>`${x}(${i2+1})`).join("  ");
          if(k>=p.length){ const cur2=ROUNDS[r]; r++;
            if(r>=ROUNDS.length){ q.textContent="Interval counting mastered!";
              fb(true,`✓ ${cur2.lo}→${cur2.hi}: ${cur2.num} keys pressed, both notes included — a ${NAMES[cur2.num]}!`); }
            else { fb(true,`✓ ${p.map((x,i2)=>`${x}(${i2+1})`).join(" ")} — ${cur2.num} keys = a ${NAMES[cur2.num]}! Next climb…`); setTimeout(ask,1300); } } }
        else if(WH.indexOf(m)<0){ fb(false,"Interval NUMBERS count letter names — stay on the white keys for these notes."); }
        else { MFAudio.tone(40,.2); fb(false, k===0? `Start on the LOWER note itself — press ${p[0]} first, it counts as 1!` : `Press the very NEXT key — after ${p[k-1]} comes ${p[k]}.`); }
      }});
  }
  ask();
}

/* ear rounds: melodic or harmonic? (audio and revealed staff always use the SAME pitches) */
function MF_L33_ear(container,fb){
  const ROUNDS=[{a:"C4",b:"E4",harm:false},{a:"C4",b:"E4",harm:true},{a:"C4",b:"E4",harm:true},{a:"C4",b:"E4",harm:false}]; /* always the C-E of the staff above - only the DELIVERY changes */
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l33-eq" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l33-play">▶ Hear the interval</button></div>
    <div class="choices l33-ech" style="display:none"><button>\u{1F3B5} Melodic — one after another</button><button>\u{1F3BC} Harmonic — together</button></div>
    <div class="l33-show"></div>`;
  const q=container.querySelector(".l33-eq"), ch=container.querySelector(".l33-ech"), show=container.querySelector(".l33-show");
  function ask(){ heard=false; ch.style.display="none"; show.innerHTML="";
    q.textContent=`Sound ${i+1} of ${ROUNDS.length}: listen — are the two notes played one after another, or together?`; }
  container.querySelector(".l33-play").onclick=()=>{
    const cur=ROUNDS[i], ma=MFAudio.midi(cur.a), mb=MFAudio.midi(cur.b);
    if(cur.harm){ MFAudio.tone(ma,.9,0,.42); MFAudio.tone(mb,.9,0,.42); }
    else { MFAudio.tone(ma,.55,0); MFAudio.tone(mb,.55,.65); }
    heard=true; setTimeout(()=>{ ch.style.display=""; }, cur.harm?1100:1400);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    const cur=ROUNDS[i], saidHarm=bi===1;
    if(saidHarm===cur.harm){
      Staff.render(show, cur.harm? {clef:"treble",notes:[{p:cur.a,d:"w"},{p:cur.b,d:"w",chord:true}],width:200}
                                 : {clef:"treble",notes:[{p:cur.a,d:"h"},{p:cur.b,d:"h"}],width:200});
      i++;
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l33-play").style.display="none";
        q.textContent="Ears calibrated!";
        fb(true,"✓ Four for four! Together = harmonic (stacked notation); one-after-another = melodic (side by side)."); }
      else { fb(true,`✓ ${cur.harm?"Both at once — HARMONIC.":"One then the other — MELODIC."} Next sound…`); setTimeout(ask,900); } }
    else { MFAudio.tone(40,.25); fb(false,"Listen again — did the two notes overlap, or take turns?"); }
  });
  ask();
}

/* build the requested interval above a root */
function MF_L33_build(container,fb){
  const ROUNDS=[{root:"C",num:3},{root:"D",num:4},{root:"C",num:5},{root:"E",num:2}];
  const NAMES={2:"2nd",3:"3rd",4:"4th",5:"5th"};
  const L=["C","D","E","F","G","A","B"];
  let i=0;
  container.innerHTML=`<div class="big-q l33-bq" style="text-align:center"></div>
    <div class="l33-bstaff"></div><div class="choices chips l33-bch"></div>`;
  const q=container.querySelector(".l33-bq"), holder=container.querySelector(".l33-bstaff"), ch=container.querySelector(".l33-bch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Build ${i+1} of ${ROUNDS.length}: place the note a <b>${NAMES[cur.num]}</b> above <b>${cur.root}</b>.`;
    Staff.render(holder,{clef:"treble",notes:[{p:cur.root+"4",d:"h",label:cur.root}],width:240});
    ch.innerHTML="";
    L.forEach(l=>{ const b=document.createElement("button"); b.textContent=l;
      b.onclick=()=>{
        const cur2=ROUNDS[i], target=L[(L.indexOf(cur2.root)+cur2.num-1)%7];
        if(l===target){
          const spec={clef:"treble",tempo:90,notes:[{p:cur2.root+"4",d:"h",label:cur2.root},{p:target+"4",d:"h",label:target}],brackets:[{from:0,to:1,label:NAMES[cur2.num]}],width:240};
          const api=Staff.render(holder,spec); setTimeout(()=>Staff.play(spec,api),300);
          i++;
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="All intervals built!";
            fb(true,`✓ ${cur2.root} up to ${target} = a ${NAMES[cur2.num]}. Count both ends, land on the letter — built like a pro!`); }
          else { fb(true,`✓ ${cur2.root}→${target} is a ${NAMES[cur2.num]}! Next…`); setTimeout(ask,1500); } }
        else { MFAudio.tone(40,.2); fb(false,`Count letters from ${cur2.root} as 1 — where does ${NAMES[cur2.num].replace("nd","").replace("rd","").replace("th","")} land?`); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[33]={
  welcome:"Single notes make sounds. The DISTANCE between notes makes music. Meet the interval! \u{1F4CF}",
  hook:{
    say:"Two mystery sounds, same two notes each time. Press both — <b>what changed between them?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Sound 1</button>
          <button class="play hk-b">▶ Sound 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Sound 1 took turns; Sound 2 played both together</button><button>Sound 2 used higher notes</button><button>They were identical</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(60,.5,0); MFAudio.tone(67,.5,.6); hA=true; if(hB) setTimeout(()=>ch.style.display="",1400); };
        container.querySelector(".hk-b").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(67,.9,0,.42); hB=true; if(hA) setTimeout(()=>ch.style.display="",1100); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Same two notes, same DISTANCE — played one-after-another (MELODIC) and then together (HARMONIC). That distance is called an INTERVAL, and it's today's whole lesson.");
          else fb(false,"Same notes both times — listen for HOW they arrive.");
        });
      } }
  },
  objectives:[
    "Define an interval",
    "Count interval numbers correctly (counting both notes)",
    "Identify melodic intervals",
    "Identify harmonic intervals",
    "Recognize unisons and octaves",
    "Name common intervals from the staff"
  ],
  steps:[
    { say:"An <b>INTERVAL</b> is the distance in pitch between two notes. It is counted from the <b>lower note</b> to the higher one, <b>with the lower note counted as 1</b>. C→D = 2nd, C→E = 3rd, C→F = 4th, C→G = 5th. \u{1F447} <b>Climb each interval on the KEYBOARD — press every key from the bottom note to the top:</b>",
      try:{ type:"custom",
        hint:"Count every key between the two notes AND both notes themselves — the lower note is 1. C→F: C(1) D(2) E(3) F(4) = a 4th.",
        mount:(container,fb)=>MF_L33_countUp(container,fb) } },
    { say:"Two special names: notes that are <b>identical</b> form a <b>UNISON</b> (also called a prime interval), and the interval of an <b>8th</b> is called an <b>OCTAVE</b>. \u{1F447} <b>The interval of an 8th has which special name?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w"},{p:"E5",d:"w",chord:true}],brackets:[{from:0,to:1,label:"unison"},{from:2,to:3,label:"octave"}],width:320} },
      try:{ type:"mc", choices:["Octave","Unison","Grand step","Double"], answer:0,
        success:"✓ An 8th = an OCTAVE — same letter name, eight letters apart.",
        fail:"Eight letters up lands on the same letter…",
        hint:"'Oct' like octopus — eight." } },
    { say:"Intervals are heard two ways: a <b>MELODIC interval</b> sounds the notes <b>separately</b>; a <b>HARMONIC interval</b> sounds them <b>together</b> (written stacked). The SIZE stays the same — only the delivery changes. \u{1F447} <b>Trust your ears — melodic or harmonic?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"h"},{p:"E4",d:"h"},{bar:"single"},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{bar:"final"}],brackets:[{from:0,to:1,label:"melodic"},{from:3,to:4,label:"harmonic"}],width:400} },
      try:{ type:"custom",
        hint:"Overlapping sound = harmonic; taking turns = melodic.",
        mount:(container,fb)=>MF_L33_ear(container,fb) } },
    { say:"A reading shortcut: <b>EVEN-numbered intervals</b> (2nds, 4ths, 6ths, octaves) go <b>line→space</b> or <b>space→line</b>; <b>ODD-numbered intervals</b> (unisons, 3rds, 5ths, 7ths) go <b>line→line</b> or <b>space→space</b>. \u{1F447} <b>A 5th written on the staff goes from…?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"F4",d:"w",x:150},{p:"G4",d:"w",chord:true},{p:"E4",d:"w",x:360},{p:"B4",d:"w",chord:true}],brackets:[{from:0,to:1,label:"2nd — space to line"},{from:2,to:3,label:"5th — line to line"}],width:480} },
      try:{ type:"mc", choices:["Line to line, or space to space","Line to space only","Anywhere at all"], answer:0,
        success:"✓ Odd numbers match: line↔line or space↔space. Even numbers mix them.",
        fail:"5 is an ODD number — check the odd rule.",
        hint:"Odd = matching positions." } },
    { say:"Now build them. \u{1F447} <b>Place the upper note to create each requested interval:</b>",
      try:{ type:"custom",
        hint:"Count letters from the root as 1 — a 3rd above C lands on E.",
        mount:(container,fb)=>MF_L33_build(container,fb) } }
  ],
  examples:[
    { caption:"The interval ladder from C — every harmonic interval from unison to octave. Press play and hear each pair ring together.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"C4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"D4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"B4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"unison"},{from:2,to:3,label:"2nd"},{from:4,to:5,label:"3rd"},{from:6,to:7,label:"4th"},{from:8,to:9,label:"5th"},{from:10,to:11,label:"6th"},{from:12,to:13,label:"7th"},{from:14,to:15,label:"octave"}],width:640} },
    { caption:"The same 3rd delivered two ways: melodic (C then E, side by side) — then harmonic (C and E stacked, together).",
      staff:{clef:"treble",tempo:80,notes:[{p:"C4",d:"h"},{p:"E4",d:"h"},{bar:"single"},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{bar:"final"}],brackets:[{from:0,to:1,label:"melodic 3rd"},{from:3,to:4,label:"harmonic 3rd"}],width:440} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Interval Sprint (45s)",
      intro:"Intervals flash on the staff — name them before the clock runs out!",
      miaIntro:"Count fast, count BOTH notes! \u{1F3C3}",
      spec:{gen:"interval-id", params:{min:2,max:8}, seconds:45},
      result:(score)=>score>=8?score+" intervals in 45 seconds — a measuring machine!":null },
    { type:"gen-race", title:"Game 2 · Melodic or Harmonic? (10 rounds)",
      intro:"Side by side, or stacked? Read the notation and call it!",
      miaIntro:"Delivery detective time! \u{1F575}",
      spec:{gen:"interval-id", params:{ask:"kind",min:2,max:8}, rounds:10},
      result:(score)=>score>=8?"Delivery detected every time!":null },
    { type:"symbol-hunt", title:"Game 3 · Interval Hunt",
      intro:"Four intervals on cards — click the one that's named!",
      miaIntro:"Spot the distance at a glance! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"3rd", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true}],width:150}},
        {label:"5th", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Octave", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Unison", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"C4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No interval hides from you!":null },
    { type:"term-race", title:"Game 4 · Interval Vocabulary Race",
      intro:"Interval, melodic, harmonic, unison, octave — match at speed!",
      miaIntro:"Last dash of the day! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Interval","The distance in pitch between two notes"],
        ["Melodic Interval","Two notes sounded separately"],
        ["Harmonic Interval","Two notes sounded together"],
        ["Unison","The interval between two identical notes"],
        ["Octave","The interval of an 8th"],
        ["Count both notes","The golden rule of interval counting"]]},
      result:(score)=>score>=7?"Interval vocabulary complete!":null }
  ],
  practiceIntro:"20 practice questions — counting, naming, melodic vs harmonic, unisons and octaves. Answer right and the next appears automatically!",
  practice:[
    { gen:"interval-id", params:{min:2,max:8}, count:6 },
    { gen:"interval-id", params:{ask:"kind",min:2,max:8}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Interval","the distance in pitch between two notes"],["Melodic Interval","two notes sounded separately"],["Harmonic Interval","two notes sounded together"],["Unison","two identical notes"],["Octave","the interval of an 8th"]], reverse:true}, count:3 },
    { type:"truefalse", q:"When counting an interval, include both the starting and ending notes.", answer:true,
      explain:"C–F: C(1) D(2) E(3) F(4) — a 4th." },
    { type:"truefalse", q:"The interval from C to F is a 5th.", answer:false,
      explain:"Count both ends: C(1) D(2) E(3) F(4) — a 4th." },
    { type:"mc", q:"The interval from C up to F is a…", choices:["4th","5th","3rd"], answer:0,
      explain:"Four letters, counting both ends." },
    { type:"mc", q:"If two notes are played at the same time, they form a ____ interval.", choices:["harmonic","melodic","chromatic"], answer:0,
      explain:"Harmony = together." },
    /* — review style — */
    { type:"mc", q:"Name the intervals: C→D, C→E, C→F.", choices:["2nd · 3rd · 4th","1st · 2nd · 3rd","2nd · 4th · 5th"], answer:0,
      explain:"Count every letter, both ends included." },
    { type:"mc", q:"Even-numbered intervals (2nds, 4ths, 6ths, octaves) are written…", choices:["line to space, or space to line","line to line only","space to space only"], answer:0,
      explain:"Even numbers mix positions; odd numbers match them." },
    { type:"mc", q:"Odd-numbered intervals (unisons, 3rds, 5ths, 7ths) are written…", choices:["line to line, or space to space","line to space only","anywhere"], answer:0,
      explain:"Odd = matching positions on the staff." },
    { type:"mc", q:"The interval between two identical notes is called a…", choices:["unison","octave","2nd"], answer:0,
      explain:"Unison — also called a prime interval." }
  ],
  miaQuizIntro:"Rulers out! Count both notes, watch the stacking — and sprint!",
  quiz:[
    { type:"mc", q:"An interval is:", choices:["A rhythm pattern","The distance between two musical pitches","A type of scale","A dynamic marking"], answer:1,
      explain:"Distance in pitch between two notes.", hint:"Think of a ruler." },
    { type:"mc", q:"A melodic interval consists of:", choices:["Two notes played together","Two notes played one after another","Two notes with the same pitch","Three consecutive notes"], answer:1,
      explain:"Melody = one note at a time.", hint:"Mel-O-dic — like a melody." },
    { type:"mc", q:"A harmonic interval consists of:", choices:["Two notes played one after another","Two notes played simultaneously","Two tied notes","Two repeated notes"], answer:1,
      explain:"Harmony = together, written stacked.", hint:"Har-MONY — sounding as one." },
    { type:"truefalse", q:"When counting an interval, include both the starting and ending notes.", answer:true,
      explain:"The lower note is always 1.", hint:"The golden rule." },
    { type:"truefalse", q:"The interval from C to F is a 5th.", answer:false,
      explain:"C(1) D(2) E(3) F(4) — a 4th.", hint:"Count on your fingers." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Interval → distance between pitches · Melodic → one after another · Harmonic → together",
               "Interval → a rhythm · Melodic → together · Harmonic → one after another",
               "Interval → a scale · Melodic → loud · Harmonic → soft"], answer:0,
      explain:"The three key terms of the lesson.", hint:"Distance, turns, together." },
    { type:"mc", q:"The interval from C up to F is a ____.", choices:["4th","3rd","5th"], answer:0,
      explain:"Four letter names, both ends counted.", hint:"C D E F." },
    { type:"mc", q:"If two notes are played at the same time, they form a ____ interval.", choices:["harmonic","melodic","perfect"], answer:0,
      explain:"Together = harmonic.", hint:"Choirs sing in HARMONY — together." },
    { type:"mc", q:"Name each interval: C→D, C→E, C→F.",
      choices:["2nd, 3rd, 4th","1st, 2nd, 3rd","3rd, 4th, 5th"], answer:0,
      explain:"Always one more than the letters BETWEEN, because both ends count.", hint:"Count C itself as 1." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Melodic and harmonic intervals always have different interval names",
               "Harmonic intervals are always larger than melodic intervals",
               "Melodic and harmonic intervals describe HOW notes are played, not the interval size",
               "Intervals are counted by counting only the spaces"], answer:2,
      explain:"Size is size; melodic/harmonic is only the delivery.", hint:"The same 3rd can arrive either way." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:200},
      choices:["5th","4th","3rd"], answer:0,
      explain:"C(1) D(2) E(3) F(4) G(5) — a harmonic 5th.", hint:"Stacked = harmonic; now count." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"E4",d:"h"},{p:"B4",d:"h"}],width:200},
      choices:["5th","6th","4th"], answer:0,
      explain:"E(1) F(2) G(3) A(4) B(5) — a melodic 5th.", hint:"Side by side = melodic; count letters." },
    { type:"mc", q:"The interval of an 8th is called an…", choices:["octave","unison","octet"], answer:0,
      explain:"Eight letters up = the same letter = an octave.", hint:"Oct- means eight." },
    /* generated */
    { gen:"interval-id", params:{min:2,max:8}, count:4 },
    { gen:"interval-id", params:{ask:"kind",min:2,max:8}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Interval","the distance in pitch between two notes"],["Melodic Interval","two notes sounded separately"],["Harmonic Interval","two notes sounded together"],["Unison","two identical notes"],["Octave","the interval of an 8th"]], reverse:true}, count:1 }
  ],
  vocabulary:[
    {term:"Interval", def:"The distance in pitch between two notes.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true}],width:130}},
    {term:"Melodic Interval", def:"Two notes sounded separately.",
      staff:{clef:"treble",notes:[{p:"C4",d:"h",x:100},{p:"E4",d:"h",x:160}],width:200}},
    {term:"Harmonic Interval", def:"Two notes sounded together.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Unison", def:"The interval between two identical notes. Also called a prime interval."},
    {term:"Octave", def:"The interval of an 8th."}
  ],
  mistakes:[],
  summary:[
    "✔ An <b>interval</b> = the distance in pitch between two notes — count from the lower note, <b>counting it as 1</b>.",
    "✔ C→D 2nd · C→E 3rd · C→F 4th · C→G 5th … up to the <b>octave</b> (8th); identical notes = <b>unison</b>.",
    "✔ <b>Melodic</b> = one after another · <b>Harmonic</b> = together (written stacked). Same size either way!",
    "✔ Staff shortcut: <b>even</b> intervals sit line↔space; <b>odd</b> intervals sit line↔line or space↔space.",
    "✔ Never count spaces — count <b>letter names</b>, both ends included."
  ],
  tips:[
    "The #1 interval error is starting the count at 0 — the bottom note is always 1.",
    "Snap-check with the odd/even rule: matching positions (line-line) must be an odd interval.",
    "At a piano, play C-E melodically, then together — train your ear to hear that they're the SAME 3rd.",
    "Next lesson, the circle of fifths — built from the interval you just learned to count: the 5th."
  ],
  rewards:{ badge:"Interval Inspector", icon:"\u{1F4CF}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — you measured every distance in sight! The ruler is officially yours. \u{1F4CF}\u{1F389}",
  miaPass:"You passed! Keep chanting the golden rule: count BOTH notes, bottom note is 1.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both sounds used C and G — a 5th. Sound 1 was melodic (one after another); Sound 2 was harmonic (together).",
      play:()=>{MFAudio.tone(60,.5,0);MFAudio.tone(67,.5,.6);MFAudio.tone(60,.8,1.4,.4);MFAudio.tone(67,.8,1.4,.4);} },
    learn:{ label:"intervals",
      explain:"Count letters from the lower note (as 1) to the upper. Melodic = separate, harmonic = together. Unison = identical notes; octave = an 8th.",
      hint:"C→F: C(1) D(2) E(3) F(4).",
      play:()=>{MFAudio.tone(60,.4,0);MFAudio.tone(65,.6,.5);} },
    example:{ label:"the examples",
      explain:"Example 1 climbs the whole harmonic ladder from unison to octave; example 2 delivers one 3rd both ways — melodic, then harmonic." },
    game:{ label:"the games",
      explain:"Sprint the naming, detect the delivery, hunt intervals on cards, then race the vocabulary.",
      hint:"In the sprint: stacked notes are harmonic — but the NUMBER is all that's asked." },
    quiz:{ label:"this question",
      explain:"Two rules answer everything: count both notes (bottom = 1), and melodic/harmonic only describes HOW the notes arrive.",
      play:()=>{MFAudio.tone(60,.6,0,.4);MFAudio.tone(64,.6,0,.4);} }
  }
};
