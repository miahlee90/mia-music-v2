/* Lesson 35 — Perfect and Major Intervals (AEMT Book 2, Unit 9)
   Built from drafts/UNIT 9 – Lesson 35.md; AEMT p.56 verified by render.
   M8 directive: HARD concepts — explain slowly, small steps, keyboard everywhere.
   Method: interval NUMBER review → half-step ruler → major scale as measuring tape
   → Perfect family (1,4,5,8) → Major family (2,3,6,7) → diatonic intervals → build.
   Uses quiz.js v5.4 interval-quality generator (P/M mode).
   NOTE: edit by FULL-FILE REWRITE only. */

/* half-step ruler: press EVERY key (white + black) from the low note to the high note;
   the count of MOVES (not keys) = the interval's size in half steps. */
function MF_L35_ruler(container,fb){
  const ROUNDS=[
    {lo:"C",hi:"E",loM:60,hiM:64,hs:4,name:"Major 3rd"},
    {lo:"C",hi:"F",loM:60,hiM:65,hs:5,name:"Perfect 4th"},
    {lo:"C",hi:"G",loM:60,hiM:67,hs:7,name:"Perfect 5th"}];
  let r=0,cur=null,at=0,kb=null,pressed=[];
  container.innerHTML=`<div class="big-q l35-q" style="text-align:center"></div>
    <div class="l35-cnt" style="text-align:center;font-weight:800;font-size:1.15rem;min-height:26px;color:var(--correct)"></div>
    <div class="l35-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">A half step = ONE key to the very next key, black keys included. Count the MOVES, not the keys!</p>`;
  const q=container.querySelector(".l35-q"), cnt=container.querySelector(".l35-cnt"), kbHolder=container.querySelector(".l35-kb");
  function ask(){
    cur=ROUNDS[r]; at=cur.loM; pressed=[]; cnt.textContent="half steps so far: 0";
    q.innerHTML=`Measure ${r+1} of ${ROUNDS.length}: start on <b>${cur.lo}</b> (the red arrow) and press EVERY key up to <b>${cur.hi}</b> — black keys too!`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,point:cur.loM,
      onKey:m=>{
        if(m===at+1){
          at=m; pressed.push(m); kb.mark(pressed); MFAudio.tone(m,.25);
          cnt.textContent="half steps so far: "+(at-cur.loM);
          if(at===cur.hiM){ r++;
            if(r>=ROUNDS.length){ q.textContent="Ruler calibrated!";
              fb(true,`✓ ${cur.lo}→${cur.hi} = ${cur.hs} half steps — the exact size of a ${cur.name}. Numbers count LETTERS; quality counts HALF STEPS.`); }
            else { fb(true,`✓ ${cur.lo}→${cur.hi} = ${cur.hs} half steps = a ${cur.name}! Next measurement…`); setTimeout(ask,1400); } } }
        else if(m<=at){ fb(false,"You already counted that key — keep climbing upward."); }
        else { MFAudio.tone(40,.2); fb(false,"No skipping! A half step is the VERY next key — black keys count too."); }
      }});
  }
  ask();
}

/* build the requested quality interval above C on the keyboard */
function MF_L35_build(container,fb){
  const ROUNDS=[
    {name:"Major 3rd (M3)",m:64,letter:"E",hs:4},
    {name:"Perfect 4th (P4)",m:65,letter:"F",hs:5},
    {name:"Perfect 5th (P5)",m:67,letter:"G",hs:7},
    {name:"Major 6th (M6)",m:69,letter:"A",hs:9},
    {name:"Major 7th (M7)",m:71,letter:"B",hs:11},
    {name:"Perfect Octave (P8)",m:72,letter:"C",hs:12}];
  let i=0,kb=null;
  container.innerHTML=`<div class="big-q l35-bq" style="text-align:center"></div><div class="l35-bkb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">C is Do, the keynote. Every answer today lives inside the C major scale!</p>`;
  const q=container.querySelector(".l35-bq"), kbHolder=container.querySelector(".l35-bkb");
  function ask(cueC){
    q.innerHTML=`Build ${i+1} of ${ROUNDS.length}: press the key a <b>${ROUNDS[i].name}</b> above C.`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,
      onKey:m=>{
        const cur=ROUNDS[i];
        if(m===cur.m){ kb.mark([60,m]); MFAudio.tone(60,.7,0,.4); MFAudio.tone(m,.7,0,.4); i++;
          if(i>=ROUNDS.length){ q.textContent="Every quality built!";
            fb(true,`✓ C→${cur.letter} = ${cur.name}. The whole Perfect and Major team, built by hand!`); }
          else { fb(true,`✓ C→${cur.letter} = ${cur.name} (${cur.hs} half steps). Next…`); setTimeout(()=>ask(true),1300); } }
        else { MFAudio.tone(40,.2); fb(false,`Count up the C major scale from C as 1 — the ${cur.name.split(" ")[1]} scale note is the answer.`); }
      }});
    if(cueC) setTimeout(()=>{ /* hear the root C - flash it purple WITHOUT triggering the answer handler.
      DD-31: never at page load - only after the student's own action brought us here. */
      MFAudio.tone(60,.5); const ke=kb.el.children[0];
      if(ke){ ke.classList.add("on"); setTimeout(()=>ke.classList.remove("on"),420); } },350);
  }
  ask();
}

LESSON_CONTENT[35]={
  welcome:"You can already COUNT intervals. Today you learn their last names: Perfect and Major. \u{1F3F7}",
  hook:{
    say:"Two intervals, both starting on C. One is called <b>PERFECT</b> — listen and press both. <b>Which one sounds more open, settled, and pure?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Interval A</button>
          <button class="play hk-b">▶ Interval B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Interval A — open and settled</button><button>Interval B — open and settled</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(67,.9,0,.42); hA=true; if(hB) setTimeout(()=>ch.style.display="",1100); };
        container.querySelector(".hk-b").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(71,.9,0,.42); hB=true; if(hA) setTimeout(()=>ch.style.display="",1100); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Interval A was C–G, a PERFECT 5th — so stable and pure that medieval musicians named it 'perfect'. Interval B (C–B, a Major 7th) leans and wants to move. Today: which intervals are Perfect, and which are Major.");
          else fb(false,"Listen once more — one interval relaxes, the other leans forward.");
        });
      } }
  },
  objectives:[
    "Define interval quality",
    "Name the Perfect intervals: P1, P4, P5, P8",
    "Name the Major intervals: M2, M3, M6, M7",
    "Use the major scale to identify qualities",
    "Define diatonic intervals",
    "Explain why no Major 5th or Perfect 3rd exists"
  ],
  steps:[
    { say:"Quick review from Lesson 33: an interval's <b>NUMBER</b> comes from counting letter names, both ends included. \u{1F447} <b>C up to A — count the letters. What number is this interval?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"A4",d:"w",chord:true}],brackets:[{from:0,to:1,label:"?"}],width:200} },
      try:{ type:"mc", choices:["A 6th","A 5th","A 7th"], answer:0,
        success:"✓ C(1) D(2) E(3) F(4) G(5) A(6) — a 6th. Number: solved. But the number is only HALF of an interval's name…",
        fail:"Count every letter from C as 1: C D E F G A.",
        hint:"Both ends count — C itself is 1." } },
    { say:"Here's the problem: these two intervals are BOTH written C up to E-something — same letters. <b>Press both play buttons</b> and listen: different sizes, different moods! The letter-count NUMBER can't tell them apart. \u{1F447} <b>True or false — BOTH of them are 3rds?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"w",x:150},{p:"E4",d:"w",chord:true},{p:"C4",d:"w",x:310},{p:"Eb4",d:"w",chord:true}],brackets:[{from:0,to:1,label:"3rd #1"},{from:2,to:3,label:"3rd #2"}],width:420} },
      try:{ type:"custom",
        hint:"Count the letters of each one: C(1) D(2) E(3)\u2026 then trust your ears for the SIZE.",
        mount:(container,fb)=>{
          container.innerHTML=`<div style="text-align:center">
            <button class="play l35-ta">\u25b6 3rd #1 (C\u2013E)</button>
            <button class="play l35-tb">\u25b6 3rd #2 (C\u2013E\u266d)</button></div>
            <div class="big-q" style="text-align:center">True or false: BOTH intervals are 3rds.</div>
            <div class="choices l35-tch" style="display:none"><button>\u2705 True \u2014 both are 3rds</button><button>\u274c False \u2014 only one is a 3rd</button></div>`;
          const ch=container.querySelector(".l35-tch");
          let hA=false,hB=false;
          const arm=()=>{ if(hA&&hB) setTimeout(()=>ch.style.display="",900); };
          container.querySelector(".l35-ta").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(64,.9,0,.42); hA=true; arm(); };
          container.querySelector(".l35-tb").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(63,.9,0,.42); hB=true; arm(); };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(i===0){ MFAudio.yay(); fb(true,"\u2713 TRUE \u2014 count the letters: C-D-E, three for each, so BOTH are 3rds. But your ears caught two different SIZES (4 half steps vs 3). The number alone can't tell them apart \u2014 that's exactly why intervals need a QUALITY label."); }
            else { MFAudio.tone(40,.2); fb(false,"Count the letters of EACH one: C(1) D(2) E(3) \u2014 the flat doesn't change the letter."); }
          });
        } } },
    { say:"Quality is measured in <b>HALF STEPS</b> — keyboard distance, black keys included. \u{1F447} <b>Grab the ruler: press every key and measure three intervals in half steps:</b>",
      try:{ type:"custom",
        hint:"Count MOVES between keys, not the keys themselves. C→C♯ is 1 half step, C→D is 2…",
        mount:(container,fb)=>MF_L35_ruler(container,fb) } },
    { say:"Now the shortcut that saves all that counting: the <b>MAJOR SCALE is a ready-made measuring tape</b>. Intervals measured <b>from the keynote</b> up to scale notes <b>1, 4, 5, and 8</b> are <b>PERFECT</b> intervals; intervals from the keynote up to scale notes <b>2, 3, 6, and 7</b> are <b>MAJOR</b> intervals. \u{1F447} <b>The keynote up to scale note 5 makes which interval?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{p:"G4",d:"q",label:"5"},{p:"A4",d:"q",label:"6"},{p:"B4",d:"q",label:"7"},{p:"C5",d:"q",label:"8"}],width:520},
        kb:{start:60,octaves:1,labels:true,marks:[60,65,67,72]} },
      try:{ type:"mc", choices:["A Perfect 5th (P5)","A Major 5th (M5)","A Perfect 3rd (P3)"], answer:0,
        success:"✓ 5 belongs to the 1-4-5-8 team → PERFECT 5th. (A 'Major 5th' does not exist — 5ths are never Major!)",
        fail:"Is 5 on the 1-4-5-8 team or the 2-3-6-7 team?",
        hint:"1, 4, 5, 8 = Perfect. The keyboard shows them lit: C, F, G, C." } },
    { say:"Meet the <b>PERFECT family</b>: <b>P1</b> (unison), <b>P4</b>, <b>P5</b>, <b>P8</b> (octave). They earned the name 'perfect' centuries ago for their exceptionally pure, stable, open sound — they blend so completely they almost disappear into each other. \u{1F447} <b>Which of these intervals is NOT in the Perfect family?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"C4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"P1"},{from:2,to:3,label:"P4"},{from:4,to:5,label:"P5"},{from:6,to:7,label:"P8"}],width:420} },
      try:{ type:"mc", choices:["The 6th","The 4th","The octave","The unison"], answer:0,
        success:"✓ The 6th belongs to the MAJOR family. Perfect = 1, 4, 5, 8 — memorize the team roster!",
        fail:"Recite the roster: unison, 4th, 5th, octave.",
        hint:"1-4-5-8. Which choice isn't on that list?" } },
    { say:"And the <b>MAJOR family</b>: <b>M2</b>, <b>M3</b>, <b>M6</b>, <b>M7</b> — the 2nd, 3rd, 6th and 7th above the keynote of a major scale. Capital <b>M</b> means Major; capital <b>P</b> means Perfect. And remember: there is <b>no Major 5th and no Perfect 3rd</b> — each number belongs to exactly ONE family. \u{1F447} <b>Which abbreviation is IMPOSSIBLE?</b>",
      show:{ type:"staff", spec:{clef:"bass",tempo:60,notes:[
        {p:"C3",d:"w"},{p:"D3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"E3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"A3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"B3",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"M2"},{from:2,to:3,label:"M3"},{from:4,to:5,label:"M6"},{from:6,to:7,label:"M7"}],width:420} },
      try:{ type:"mc", choices:["M4","M6","P5","M2"], answer:0,
        success:"✓ M4 is impossible — 4ths are always Perfect, never Major. Each number has exactly one home family.",
        fail:"Check each number against its family: 1-4-5-8 Perfect, 2-3-6-7 Major.",
        hint:"Is 4 on the Major team? Look at the rosters." } },
    { say:"One more official term: when the keynote and the upper note both come from the <b>same major scale</b>, the interval is called a <b>DIATONIC INTERVAL</b>. Every diatonic interval in a major scale is either Perfect or Major — no exceptions, in every major key. \u{1F447} <b>All diatonic intervals of any major scale are…?</b>",
      try:{ type:"mc", choices:["Either Perfect or Major","Always Perfect","Always Major"], answer:0,
        success:"✓ Perfect (1,4,5,8) or Major (2,3,6,7) — that covers all eight. This is true in C major, G major, every major key.",
        fail:"Two families share the scale — name them both.",
        hint:"The two team rosters together cover 1 through 8." } },
    { say:"Time to build with your own hands. \u{1F447} <b>Press the key that completes each requested interval above C:</b>",
      try:{ type:"custom",
        hint:"Think scale numbers: M3 = scale note 3 = E. P5 = scale note 5 = G.",
        mount:(container,fb)=>MF_L35_build(container,fb) } }
  ],
  examples:[
    { caption:"The complete diatonic ladder in C major — P1, M2, M3, P4, P5, M6, M7, P8. Play it and hear Perfect stability alternate with Major color.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"C4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"D4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"B4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"P1"},{from:2,to:3,label:"M2"},{from:4,to:5,label:"M3"},{from:6,to:7,label:"P4"},{from:8,to:9,label:"P5"},{from:10,to:11,label:"M6"},{from:12,to:13,label:"M7"},{from:14,to:15,label:"P8"}],width:640},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"The same rule in bass clef and a different key feel — Perfect intervals above C: unison, 4th, 5th, octave. Pure and open, every one.",
      staff:{clef:"bass",tempo:70,notes:[
        {p:"C3",d:"w"},{p:"C3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"F3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"G3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"C4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"Perfect Unison"},{from:2,to:3,label:"Perfect 4th"},{from:4,to:5,label:"Perfect 5th"},{from:6,to:7,label:"Perfect Octave"}],width:520} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Quality Sprint (45s)",
      intro:"Intervals flash on the staff — name the quality AND number before time runs out!",
      miaIntro:"P or M, then the number — go! \u{1F3C3}",
      spec:{gen:"interval-quality", params:{qualities:["P","M"],ask:"full"}, seconds:45},
      result:(score)=>score>=8?score+" qualities in 45 seconds — the measuring tape is alive!":null },
    { type:"key-climb", title:"Game 2 · Perfect Path",
      intro:"Climb ONLY the Perfect intervals above C: unison, 4th, 5th, octave — in order, fast!",
      miaIntro:"1-4-5-8 — the perfect team, at speed! \u{26A1}",
      spec:{seq:[60,65,67,72], names:["C (P1)","F (P4)","G (P5)","C (P8)"], start:60, octaves:1,
        title:"Press C → F → G → C: the Perfect intervals above the keynote"},
      result:(score)=>score!==null?"The Perfect family lives under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · Quality Hunt",
      intro:"Four labeled intervals — click the one the round asks for!",
      miaIntro:"Spot the quality at a glance! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"P5", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"M3", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true}],width:150}},
        {label:"P4", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"M6", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No quality escapes your eye!":null },
    { type:"term-race", title:"Game 4 · Quality Vocabulary Race",
      intro:"Perfect, Major, diatonic, quality — match the terms at speed!",
      miaIntro:"Final lap — vocabulary! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Interval Quality","The exact size of an interval, measured in half steps"],
        ["Perfect Intervals","The unison, 4th, 5th, and octave"],
        ["Major Intervals","The 2nd, 3rd, 6th, and 7th of a major scale"],
        ["Diatonic Interval","Keynote and upper note from the same major scale"],
        ["P8","A perfect octave"],
        ["M6","A major 6th"]]},
      result:(score)=>score>=7?"Quality vocabulary: complete!":null }
  ],
  practiceIntro:"20 practice questions — families, abbreviations, half-step sizes and staff reading. Answer right and the next appears automatically!",
  practice:[
    { gen:"interval-quality", params:{qualities:["P","M"],ask:"full"}, count:6 },
    { gen:"interval-quality", params:{qualities:["P","M"],ask:"full",clef:"bass"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Interval Quality","the exact size of an interval"],["Perfect Intervals","the unison, 4th, 5th, and octave"],["Major Intervals","the 2nd, 3rd, 6th, and 7th"],["Diatonic Interval","both notes from the same major scale"]], reverse:true}, count:3 },
    { type:"mc", q:"A perfect interval is the distance between the keynote of a major scale and the…", choices:["unison, 4th, 5th, or octave","2nd, 3rd, 6th, or 7th","3rd and 5th only"], answer:0,
      explain:"1-4-5-8 = the Perfect family." },
    { type:"mc", q:"A major interval is the distance between the keynote of a major scale and the…", choices:["2nd, 3rd, 6th, or 7th","unison, 4th, 5th, or octave","4th and 5th only"], answer:0,
      explain:"2-3-6-7 = the Major family." },
    { type:"mc", q:"The two types of diatonic intervals in a major scale are…", choices:["perfect and major","major and minor","perfect and augmented"], answer:0,
      explain:"Every diatonic interval of a major scale is P or M." },
    { type:"truefalse", q:"A 'Major 5th' exists.", answer:false,
      explain:"5ths are in the Perfect family — never Major." },
    { type:"truefalse", q:"A Major 3rd spans 4 half steps.", answer:true,
      explain:"C→E: C♯(1) D(2) E♭(3) E(4)." },
    { type:"mc", q:"P1 stands for…", choices:["Perfect unison","Primary 1st","Piano 1"], answer:0,
      explain:"P = Perfect, 1 = unison (prime)." },
    { type:"mc", q:"How many half steps are in a Perfect 5th?", choices:["7","6","8"], answer:0,
      explain:"C→G = 7 half steps." },
    { type:"mc", q:"Which list contains ONLY Major intervals?", choices:["M2 M3 M6 M7","M2 M4 M6 M8","M1 M3 M5 M7"], answer:0,
      explain:"2-3-6-7 — the complete Major roster." }
  ],
  miaQuizIntro:"Rosters ready? 1-4-5-8 Perfect, 2-3-6-7 Major — sprint!",
  quiz:[
    { type:"mc", q:"Which interval belongs to the Perfect family?", choices:["Major 3rd","Perfect 5th","Major 6th","Major 7th"], answer:1,
      explain:"5ths live in the 1-4-5-8 Perfect family.", hint:"1-4-5-8." },
    { type:"mc", q:"Which interval belongs to the Major family?", choices:["Perfect 4th","Major 2nd","Perfect octave","Perfect unison"], answer:1,
      explain:"2nds are Major — the 2-3-6-7 team.", hint:"2-3-6-7." },
    { type:"mc", q:"Interval quality describes…", choices:["how loud an interval is played","the exact size of an interval","which clef the notes use","the rhythm of the notes"], answer:1,
      explain:"Quality = exact size, measured in half steps.", hint:"Number counts letters; quality measures…" },
    { type:"truefalse", q:"The unison, 4th, 5th, and octave above a major keynote are Perfect intervals.", answer:true,
      explain:"The definition of the Perfect family.", hint:"The 1-4-5-8 roster." },
    { type:"truefalse", q:"A Perfect 3rd is a real interval.", answer:false,
      explain:"3rds are Major (or, next lesson, minor) — never Perfect.", hint:"Which family owns the 3rd?" },
    { type:"mc", q:"When the keynote and upper note come from the same major scale, the interval is called…", choices:["chromatic","diatonic","enharmonic","melodic"], answer:1,
      explain:"Diatonic = both notes from the same major scale.", hint:"Dia- like 'diatonic ladder' of the scale." },
    { type:"mc", q:"In any major scale, the diatonic intervals above the keynote are…", choices:["all Major","all Perfect","either Perfect or Major","either Major or minor"], answer:2,
      explain:"1-4-5-8 Perfect + 2-3-6-7 Major = all eight.", hint:"Two families cover everything." },
    { type:"mc", q:"What does M6 mean?", choices:["Minor 6th","Major 6th","Measured 6th","Melodic 6th"], answer:1,
      explain:"Capital M = Major. (Small m will mean minor — next lesson!)", hint:"CAPITAL letter." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true}],width:200},
      choices:["P4","M4","P5"], answer:0,
      explain:"C→F = 4 letters = a 4th; 4ths are Perfect.", hint:"Count letters first, then pick the family." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"bass",notes:[{p:"C3",d:"w"},{p:"B3",d:"w",chord:true}],width:200},
      choices:["M7","P7","M6"], answer:0,
      explain:"C→B = 7 letters = a 7th; 7ths are Major.", hint:"Which family owns 7?" },
    { type:"mc", q:"Why were the unison, 4th, 5th, and octave named 'perfect'?", choices:["They are the loudest intervals","They sound exceptionally pure and stable","They are the easiest to write","They only appear in C major"], answer:1,
      explain:"Their pure, open blend earned the name centuries ago.", hint:"Think of the hook — which interval settled?" },
    { type:"mc", q:"A Major 3rd spans how many half steps?", choices:["3","4","5"], answer:1,
      explain:"C→E = 4 half steps.", hint:"You measured it with the ruler." },
    /* generated */
    { gen:"interval-quality", params:{qualities:["P","M"],ask:"full"}, count:4 },
    { gen:"interval-quality", params:{qualities:["P","M"],ask:"full",clef:"bass"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Interval Quality","the exact size of an interval"],["Perfect Intervals","the unison, 4th, 5th, and octave"],["Major Intervals","the 2nd, 3rd, 6th, and 7th"],["Diatonic Interval","both notes from the same major scale"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Interval Quality", def:"A label that describes the specific size of an interval, such as Perfect or Major."},
    {term:"Perfect Interval", def:"The interval between the keynote of a major scale and the unison, 4th, 5th, or octave of that scale. Abbreviated P1, P4, P5, P8.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Major Interval", def:"The interval between the keynote of a major scale and the 2nd, 3rd, 6th, or 7th of that scale. Abbreviated M2, M3, M6, M7.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true}],width:130}},
    {term:"Diatonic Interval", def:"An interval whose keynote and upper note are both from the same major scale. All diatonic intervals in a major scale are either perfect or major."}
  ],
  mistakes:[],
  summary:[
    "✔ An interval's full name = <b>QUALITY + NUMBER</b>: quality measures the exact size in half steps.",
    "✔ <b>Perfect family: 1, 4, 5, 8</b> (P1 P4 P5 P8) — exceptionally pure and stable.",
    "✔ <b>Major family: 2, 3, 6, 7</b> (M2 M3 M6 M7) — the remaining major-scale intervals.",
    "✔ <b>Diatonic interval</b> = keynote + upper note from the same major scale; always P or M.",
    "✔ No Major 5th, no Perfect 3rd — every number belongs to exactly ONE family."
  ],
  tips:[
    "Chant the rosters until automatic: 'one-four-five-eight Perfect, two-three-six-seven Major'.",
    "The major scale is a measuring tape that's always in your pocket — build from the keynote and the quality is free.",
    "Half-step sizes worth memorizing early: M3 = 4, P4 = 5, P5 = 7, P8 = 12.",
    "Next lesson: lower a Major interval by one half step and it becomes MINOR — the 2-3-6-7 team gets a shadow twin."
  ],
  rewards:{ badge:"Quality Inspector", icon:"\u{1F3F7}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT score — pun fully intended! 1-4-5-8 would be proud of you. \u{1F3F7}\u{1F389}",
  miaPass:"Passed! Keep chanting: one-four-five-eight Perfect, two-three-six-seven Major.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Interval A was C–G, a Perfect 5th — pure and settled. Interval B was C–B, a Major 7th — bright but leaning. Quality is the difference you HEARD.",
      play:()=>{MFAudio.tone(60,.8,0,.4);MFAudio.tone(67,.8,0,.4);MFAudio.tone(60,.8,1.2,.4);MFAudio.tone(71,.8,1.2,.4);} },
    learn:{ label:"interval qualities",
      explain:"Number counts letters; quality measures half steps. From a major keynote: 1,4,5,8 are Perfect; 2,3,6,7 are Major. Both notes from the same scale = diatonic.",
      hint:"1-4-5-8 Perfect · 2-3-6-7 Major.",
      play:()=>{MFAudio.tone(60,.4,0);MFAudio.tone(64,.5,.5);MFAudio.tone(67,.6,1.1);} },
    example:{ label:"the examples",
      explain:"Example 1 climbs all eight diatonic intervals of C major with their quality labels; example 2 isolates the four Perfect intervals in bass clef." },
    game:{ label:"the games",
      explain:"Sprint the qualities, climb the Perfect path, hunt labeled intervals, then race the vocabulary.",
      hint:"In the sprint: count letters for the number FIRST, then the family is automatic." },
    quiz:{ label:"this question",
      explain:"Every question yields to the rosters: 1-4-5-8 Perfect, 2-3-6-7 Major — and diatonic means both notes share one major scale.",
      play:()=>{MFAudio.tone(60,.6,0,.4);MFAudio.tone(67,.6,0,.4);} }
  }
};
