/* Lesson 71 — The Blues Scale (AEMT Book 3, Unit 17 FINALE)
   Built from drafts/UNIT 17 – Lesson 71.md; AEMT3 p.111 verified by render.
   Core: the blues sound = the progression + a unique SCALE. The BLUES
   SCALE has only 7 notes with a flatted 3rd, 5th and 7th — the BLUE NOTES.
   Recipe from major: 1) remove degrees 2 and 6; 2) flat the 3rd and 7th;
   3) add a flatted 5th. C blues: C-E♭-F-G♭-G-B♭-C. IMPROVISING = to
   spontaneously create a unique solo.
   NOTE: edit by FULL-FILE REWRITE only. */

/* build the blues scale: major → blues in three steps */
function MF_L71_convert(container,fb){
  let phase=0, removed=[], flatted=[];
  container.innerHTML=`<div class="big-q l71c-q" style="text-align:center"></div>
    <div class="l71c-staff"></div>
    <div style="text-align:center"><button class="play l71c-add" style="display:none">➕ Add the flatted 5th (G♭)</button></div>`;
  const q=container.querySelector(".l71c-q"), holder=container.querySelector(".l71c-staff"), addBtn=container.querySelector(".l71c-add");
  function currentNotes(){
    if(phase===0||phase===1){
      const base=[["C4",1],["D4",2],["E4",3],["F4",4],["G4",5],["A4",6],["B4",7],["C5",8]];
      return base.filter(([p,d])=>!removed.includes(d)).map(([p,d])=>{
        let pp=p;
        if(flatted.includes(d)) pp=p[0]+"b"+p[1];
        return {p:pp, d:"q", label:String(d===8?1:d), deg:d};
      });
    }
    return [{p:"C4",d:"q",label:"R"},{p:"Eb4",d:"q",label:"♭3"},{p:"F4",d:"q",label:"4"},{p:"Gb4",d:"q",label:"♭5"},{p:"G4",d:"q",label:"5"},{p:"Bb4",d:"q",label:"♭7"},{p:"C5",d:"q",label:"R"}];
  }
  function draw(clickable){
    const notes=currentNotes();
    Staff.render(holder,{clef:"treble",notes:notes.map(n=>({p:n.p,d:n.d,label:n.label})),width:520,clickNotes:clickable,
      onNote: clickable? (i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        const n=notes[i];
        if(phase===0){
          if(n.deg===2||n.deg===6){
            if(!removed.includes(n.deg)){ removed.push(n.deg); MFAudio.yay();
              if(removed.length<2){ q.innerHTML="✓ Great! Keep building the blues scale — one more to remove…"; draw(true); }
              else { fb(true,"✓ Degrees 2 and 6 removed — step 1 complete. Now step 2: LOWER the 3rd and the 7th (tap them)."); phase=1; q.innerHTML="Step 2: tap the <b>3rd</b> and the <b>7th</b> to lower them."; draw(true); } }
          } else fb(false,`Keep degree ${n.deg===8?1:n.deg} — step 1 removes only the 2nd and the 6th.`);
        } else if(phase===1){
          if((n.deg===3||n.deg===7)&&!flatted.includes(n.deg)){
            flatted.push(n.deg);
            MFAudio.tone(MFAudio.midi(n.p[0]+"b"+n.p[n.p.length-1]),.6,.1,.42);
            if(flatted.length<2){ q.innerHTML="✓ Lowered! One more…"; draw(true); }
            else { fb(true,"✓ E→E♭ and B→B♭ — step 2 complete. One thing missing: step 3 adds a new note!");
              q.innerHTML="Step 3: press the button to add the <b>lowered 5th</b>."; draw(false); addBtn.style.display="inline-block"; }
          } else if(n.deg===3||n.deg===7) q.innerHTML="Already lowered — now the other one!";
          else fb(false,`Degree ${n.deg===8?1:n.deg} stays natural — lower only the 3rd and the 7th.`);
        }
      } : undefined});
  }
  addBtn.onclick=()=>{
    phase=2; addBtn.style.display="none"; draw(false);
    [60,63,65,66,67,70,72].forEach((m,i)=>MFAudio.tone(m,.45,.2+i*.32,.42));
    fb(true,"✓ G♭ slides in between F and G — and there it is: the C BLUES SCALE. C-E♭-F-G♭-G-B♭-C: seven notes, three of them BLUE (♭3, ♭5, ♭7).");
    q.textContent="Your blues scale is complete.";
  };
  q.innerHTML="Step 1: this is C major. Tap the <b>2nd</b> and the <b>6th</b> degrees to REMOVE them.";
  draw(true);
}

/* improvising made simple: tap 5 blues-scale notes → hear your own solo */
function MF_L71_improv(container,fb){
  const BLUES=new Set([0,3,5,6,7,10]); const GOAL=5; const solo=[];
  container.innerHTML=`<div class="big-q" style="text-align:center">Make your own blues solo: tap any <b>5</b> keys from the blues scale <b>(C · E♭ · F · G♭ · G · B♭)</b>, in any order.</div>
    <div class="l71i-prog" style="text-align:center;font-weight:800;font-size:17px;margin:8px 0;color:var(--ink,#333)">Your solo: 0 / ${GOAL}</div>
    <div class="l71i-kb"></div>`;
  const prog=container.querySelector(".l71i-prog"), kh=container.querySelector(".l71i-kb");
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      if(solo.length>=GOAL) return;
      if(BLUES.has(m%12)){
        MFAudio.tone(m,.5,0,.42); solo.push(m);
        prog.textContent=`Your solo: ${solo.length} / ${GOAL}`;
        if(solo.length===GOAL){
          prog.textContent="\u{1F535} Your 5-note blues solo — listen back!";
          solo.forEach((n,i)=>MFAudio.tone(n,.5,.4+i*.5,.42));
          setTimeout(()=>fb(true,"✓ You just IMPROVISED — you made your own melody from the blues scale. That is improvising!"), GOAL*500+700);
        }
      } else {
        MFAudio.tone(40,.15,0,.3);
        fb(false,"That key is not in the blues scale — use C, E♭, F, G♭, G or B♭ (any octave).");
      }
    }});
}

LESSON_CONTENT[71]={
  welcome:"The blues scale and its blue notes. \u{1F535}",
  hook:{
    say:"<b>Two solos use the same blues progression.</b> Listen to both. <b>Which one sounds more like the blues?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Solo A</button>
          <button class="play hk-b">▶ Solo B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Solo B — its lowered notes create the blues sound</button><button>Solo A — the plain major scale</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,62,64,67,69,72].forEach((m,i)=>MFAudio.tone(m,.4,i*.3,.42)); [48,64,67].forEach(m=>MFAudio.tone(m,2.2,0,.18)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2400); };
        container.querySelector(".hk-b").onclick=()=>{ [60,63,65,66,67,70,72].forEach((m,i)=>MFAudio.tone(m,.4,i*.3,.42)); [48,64,67].forEach(m=>MFAudio.tone(m,2.4,0,.18)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Solo B used the BLUES SCALE — with its flatted 3rd, 5th and 7th, the BLUE NOTES. Those notes against the major chord create the blues sound. Today: build the scale and improvise with it!");
          else fb(false,"Solo A was the plain major scale. Listen again for the LOWERED notes in B…");
        });
      } }
  },
  objectives:[
    "Know both blues ingredients: the 12-bar progression AND the blues scale",
    "The blues scale has only 7 notes, with flatted 3rd, 5th and 7th",
    "Call the flatted notes by name: BLUE NOTES",
    "Build from any major scale: remove 2 & 6 → lower 3 & 7 → add ♭5",
    "Spell the C blues scale: C-E♭-F-G♭-G-B♭-C",
    "Define improvising — and do some!"
  ],
  steps:[
    { say:"<b>The Blues Scale:</b> The blues sound comes from both the <b>12-bar blues progression</b> and the <b>blues scale</b>. The blues scale contains <b>blue notes</b>. \u{1F447} <b>What are the flatted notes in the blues scale called?</b>",
      try:{ type:"mc", choices:["Blue notes","Sad notes","Broken notes"], answer:0,
        success:"✓ BLUE NOTES — the flatted 3rd, 5th and 7th.",
        fail:"The scale's own name is the clue…",
        hint:"What color is the blues?" } },
    { say:"<b>Build a Blues Scale:</b> Start with a major scale. <b>1) Remove the 2nd and 6th. · 2) Lower the 3rd and 7th. · 3) Add a lowered 5th.</b> \u{1F447} <b>Build the blues scale.</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Major Scale</th><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">C</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">D</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">E</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">F</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">—</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">G</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">A</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">B</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">C</td></tr>
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Blues Scale</th><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">C</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">—</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">E♭</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">F</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">G♭</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">G</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center">—</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">B♭</td><td style="border:1.5px solid #cdd5e1;padding:5px 10px;text-align:center;font-weight:800">C</td></tr></table>` },
      try:{ type:"custom",
        hint:"Remove 2 & 6 → lower 3 & 7 → add ♭5.",
        mount:(container,fb)=>MF_L71_convert(container,fb) } },
    { say:"<b>The C Blues Scale:</b> C – E♭ – F – G♭ – G – B♭ – C. \u{1F447} <b>How many notes are in the blues scale?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"Root"},{p:"Eb4",d:"q",label:"♭3"},{p:"F4",d:"q",label:"4"},{p:"Gb4",d:"q",label:"♭5"},
        {p:"G4",d:"q",label:"5"},{p:"Bb4",d:"q",label:"♭7"},{p:"C5",d:"q",label:"Root"}],width:520} },
      try:{ type:"mc", choices:["7 notes","12 notes","8 notes"], answer:0,
        success:"✓ 7 notes — two degrees were removed and one (♭5) was added.",
        fail:"Count the noteheads on the staff…",
        hint:"8 minus 2 removed plus 1 added." } },
    { say:"<b>The Blue Note:</b> The lowered 5th sits next to the natural 5th. This creates one of the characteristic blues sounds. \u{1F447} <b>Which two notes are a half step apart?</b>",
      try:{ type:"mc", choices:["♭5 and 5 (G♭ and G)","Root and ♭3","4 and ♭7"], answer:0,
        success:"✓ G♭ and G — the lowered 5th next to the natural 5th creates a characteristic blues sound.",
        fail:"Find the two notes sharing almost the same letter…",
        hint:"The added note and its neighbor." } },
    { say:"<b>Improvising:</b> Improvising means creating music as you play. Blues musicians often improvise using the blues scale. <b>Remember: the blues scale is often used for improvising over a 12-bar blues progression.</b> \u{1F447} <b>What does improvising mean?</b>",
      try:{ type:"mc", choices:["Spontaneously creating a unique solo","Playing exactly what's written","Playing without any rhythm"], answer:0,
        success:"✓ Creating music as you play — and every note of the blues scale works over the progression.",
        fail:"Creating music as you play…",
        hint:"Spontaneous + unique." } },
    { say:"Now improvise your own solo — tap 5 notes from the blues scale and hear it play back. \u{1F447}",
      try:{ type:"custom",
        hint:"Tap any 5 of C, E♭, F, G♭, G, B♭ — in any order.",
        mount:(container,fb)=>MF_L71_improv(container,fb) } },
    { say:"<b>Try Another Key:</b> Build the G blues scale. \u{1F447} <b>Which notes belong in the G blues scale?</b>",
      try:{ type:"mc", choices:["G-B♭-C-D♭-D-F-G","G-A-B-C-D-E-F♯-G","G-B-C-D-F♯-G"], answer:0,
        success:"✓ From G major: remove A and E, lower B and F♯ (→B♭, F), add D♭. Root, ♭3, 4, ♭5, 5, ♭7, Root.",
        fail:"Apply the three operations to G major, one at a time…",
        hint:"Remove 2&6, flat 3&7, add ♭5." } }
  ],
  examples:[
    { caption:"C major vs C blues, side by side: two notes are removed, three are lowered.",
      staff:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"C major"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{bar:"double"},
        {p:"C4",d:"q",label:"C blues"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{p:"Gb4",d:"q"},{p:"G4",d:"q",acc:"n"},{p:"Bb4",d:"q"},{p:"C5",d:"q"},{bar:"final"}],width:640},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"A written blues melody — blues-scale notes over the I chord. The ♭3 against the chord's natural 3rd creates the blues sound.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"C4",d:"8"},{p:"Eb4",d:"8"},{p:"F4",d:"8"},{p:"Gb4",d:"8"},{p:"G4",d:"q",acc:"n"},{p:"Bb4",d:"q"},{bar:"single"},
        {p:"G4",d:"8"},{p:"Gb4",d:"8"},{p:"F4",d:"8"},{p:"Eb4",d:"8"},{p:"C4",d:"h"},{bar:"final"}],
        beams:[[0,1],[2,3],[7,8],[9,10]],width:600},
      kb:{start:60,octaves:0.9167,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Blue-Note Sprint (45s)",
      intro:"Steps, spellings and definitions — race the blues facts!",
      miaIntro:"♭3, ♭5, ♭7 — paint them blue! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Blue notes","the flatted 3rd, 5th and 7th"],
        ["Blues scale size","only 7 notes"],
        ["Build step 1","remove the 2nd and 6th degrees"],
        ["Build step 2","lower the 3rd and 7th"],
        ["Build step 3","add a lowered 5th"],
        ["C blues scale","C-E♭-F-G♭-G-B♭-C"],
        ["Improvising","creating music as you play"],
        ["The blues sound","the progression + the scale together"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — blue-note fluent!":null },
    { type:"key-climb", title:"Game 2 · Blues Scale Round Trip",
      intro:"Climb the C blues scale up and back down — watch for the ♭5!",
      miaIntro:"Up and back down! \u{1FA9C}",
      spec:{seq:[60,63,65,66,67,70,72, 70,67,66,65,63,60],
        names:["C (root)","E♭ (♭3 — blue!)","F (4)","G♭ (♭5 — blue!)","G (5)","B♭ (♭7 — blue!)","C (top)","B♭","G","G♭","F","E♭","C — home"],
        start:60, octaves:1, title:"C blues scale, up and down"},
      result:(score)=>score!==null?"The blues scale lives in your fingers now!":null },
    { type:"symbol-hunt", title:"Game 3 · Spot the Blue Note",
      intro:"Four intervals from the root — click the BLUE one each round calls!",
      miaIntro:"Which bend is which? \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"♭3 (C to E♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true}],width:150}},
        {label:"♭5 (C to G♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Gb4",d:"w",chord:true}],width:150}},
        {label:"♭7 (C to B♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Bb4",d:"w",chord:true}],width:150}},
        {label:"Natural 5 (C to G) — NOT blue", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Blue vision: activated!":null },
    { type:"term-race", title:"Game 4 · UNIT 17 GRAND FINALE Race",
      intro:"The victory lap — minor harmonizing, composing, 12 bars and blue notes!",
      miaIntro:"Everything from Unit 17 — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["Minor chart rows","1,3,5→i · 2,4,5,7→V · 1,4,6→iv"],
        ["Raised 7th in a melody","harmonize with V(7)"],
        ["Minor composing frame","root of i at both ends"],
        ["12-bar blues map","I×4 · IV×2 · I×2 · V×1 · IV×1 · I×2"],
        ["The blues' birthplace","America's south"],
        ["Blue notes","♭3, ♭5, ♭7"],
        ["Building the blues scale","remove 2&6, lower 3&7, add ♭5"],
        ["C blues scale","C-E♭-F-G♭-G-B♭-C"],
        ["Improvising","creating music as you play"],
        ["The complete blues sound","12-bar progression + blues scale"]]},
      result:(score)=>score>=8?"UNIT 17 CHAMPION!":null }
  ],
  practiceIntro:"20 practice questions — the recipe, the spelling and the blue notes. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Blue notes","♭3, ♭5, ♭7"],["Step 1","remove degrees 2 and 6"],["Step 2","flat degrees 3 and 7"],["Step 3","add the flatted 5th"],["Improvise","create a solo spontaneously"]], reverse:true}, count:6 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 },
    { type:"mc", q:"How many notes are in the blues scale?", choices:["7","8","5"], answer:0,
      explain:"Two degrees removed, one added." },
    { type:"mc", q:"Which notes are lowered?", choices:["The 3rd, 5th and 7th","The 2nd and 6th","The 1st and 4th"], answer:0,
      explain:"The three blue notes." },
    { type:"mc", q:"Which degrees are REMOVED when converting major to blues?", choices:["2nd and 6th","3rd and 7th","1st and 5th"], answer:0,
      explain:"Operation 1 of the recipe." },
    { type:"mc", q:"The C blues scale is spelled…", choices:["C-E♭-F-G♭-G-B♭-C","C-D-E♭-F-G-A-B♭-C","C-E-F-G-B-C"], answer:0,
      explain:"Root, ♭3, 4, ♭5, 5, ♭7, Root." },
    { type:"mc", q:"The flatted notes of the blues scale are often called…", choices:["blue notes","gray notes","passing tones"], answer:0,
      explain:"The style's namesake notes." },
    { type:"mc", q:"What does improvising mean?", choices:["Creating music as you play","Reading music perfectly","Playing someone else's solo"], answer:0,
      explain:"Spontaneous and unique to you." },
    { type:"truefalse", q:"The blues sound comes only from the chord progression.", answer:false,
      explain:"NOT only — the unique scale matters just as much." },
    { type:"truefalse", q:"The blues scale contains both G♭ and G (in C).", answer:true,
      explain:"♭5 AND 5 — a half step apart." },
    { type:"truefalse", q:"The blues scale keeps the major scale's 2nd degree.", answer:false,
      explain:"Degree 2 is removed in operation 1." },
    { type:"truefalse", q:"Playing blues-scale notes over a blues progression creates the special blues sound.", answer:true,
      explain:"Scale + progression = the blues sound." }
  ],
  miaQuizIntro:"The Unit 17 finale quiz! Seven notes, three of them blue — and a license to improvise.",
  quiz:[
    { type:"mc", q:"What creates the blues sound?", choices:["The chord progression AND the blues scale","Only the tempo","Only the lyrics"], answer:0,
      explain:"Two ingredients, one style.", hint:"Lessons 70 + 71 together." },
    { type:"mc", q:"Compared with a major scale, what is different about the blues scale?", choices:["It has 7 notes, with lowered 3rd, 5th and 7th","It has more notes","It has the same notes, reordered"], answer:0,
      explain:"Fewer notes; three of them lowered.", hint:"Count and compare." },
    { type:"mc", q:"The flatted notes are often called…", choices:["blue notes","soft notes","minor notes"], answer:0,
      explain:"♭3, ♭5, ♭7 — the blue trio.", hint:"The lesson's color." },
    { type:"mc", q:"Which scale degrees are removed?", choices:["The 2nd and 6th","The 3rd and 7th","The root"], answer:0,
      explain:"Step 1 of building the scale.", hint:"Subtraction first." },
    { type:"mc", q:"Which scale degrees are lowered?", choices:["The 3rd and 7th","The 1st","The 2nd and 6th"], answer:0,
      explain:"Step 2 of building the scale.", hint:"The first two blue notes." },
    { type:"mc", q:"Which note is added?", choices:["A lowered 5th","A sharped 4th","A second root"], answer:0,
      explain:"Step 3 — it sits between 4 and 5.", hint:"The final blue note." },
    { type:"mc", q:"Identify this scale.",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{p:"Gb4",d:"q"},{p:"G4",d:"q"},{p:"Bb4",d:"q"},{p:"C5",d:"q"}],width:440},
      choices:["The C blues scale","C natural minor","C major with typos"], answer:0,
      explain:"Root, ♭3, 4, ♭5, 5, ♭7, Root.", hint:"Count the notes: seven." },
    { type:"mc", q:"Which two notes of the C blues scale are a half step apart?", choices:["G♭ and G","C and E♭","F and B♭"], answer:0,
      explain:"♭5 against 5 — a half step.", hint:"The added note's neighbor." },
    { type:"truefalse", q:"Improvising means spontaneously creating a unique solo.", answer:true,
      explain:"Creating music as you play.", hint:"Spontaneous + unique." },
    { type:"mc", q:"The blues scale's ♭3 (E♭) played over a C MAJOR chord (with E♮)…", choices:["creates the characteristic blues sound","is always an error","cancels the chord"], answer:0,
      explain:"That sound IS the blues.", hint:"Why solo B sounded like the blues." },
    { type:"mc", q:"The G blues scale (from the recipe) is…", choices:["G-B♭-C-D♭-D-F-G","G-A-B♭-C-D-E♭-F-G","G-B-D-F-G"], answer:0,
      explain:"Remove A & E, flat B & F♯, add D♭.", hint:"Apply all three operations to G major." },
    { type:"mc", q:"How do musicians create a blues sound?", choices:["By using the blues scale over a blues progression","By playing without any chords","By playing only block chords"], answer:0,
      explain:"Scale + progression = the blues.", hint:"The two lessons combined." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["♭3, ♭5, ♭7","the blue notes"],["Remove 2 & 6","build step 1"],["Add ♭5","build step 3"],["Improvise","creating music as you play"]], reverse:true}, count:3 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 },
    { gen:"triad-id", params:{ask:"numeral"}, count:1 }
  ],
  vocabulary:[
    {term:"Blues Scale", def:"A 7-note scale with flatted 3rd, 5th and 7th. In C: C-E♭-F-G♭-G-B♭-C."},
    {term:"Blue Notes", def:"The flatted 3rd, 5th and 7th — the lowered notes that create the blues sound."},
    {term:"Building the Scale", def:"Major → blues: 1) remove degrees 2 & 6 · 2) lower 3 & 7 · 3) add a lowered 5th."},
    {term:"Improvise", def:"To create music as you play — blues-scale notes over a blues progression."}
  ],
  mistakes:[],
  summary:[
    "✔ The blues = <b>the 12-bar progression + the blues scale</b>.",
    "✔ The scale has <b>7 notes</b> with <b>♭3, ♭5, ♭7 — the BLUE NOTES</b>.",
    "✔ Build it: <b>remove 2 & 6 → lower 3 & 7 → add ♭5</b>.",
    "✔ C blues: <b>C-E♭-F-G♭-G-B♭-C</b> (Root, ♭3, 4, ♭5, 5, ♭7, Root).",
    "✔ <b>IMPROVISE</b> = create music as you play. <b>UNIT 17 COMPLETE!</b> \u{1F389}"
  ],
  tips:[
    "Every note of the blues scale works over every chord of the 12-bar progression — that's why it's the improviser's first scale.",
    "The ♭5 is strongest as a PASSING note — slide G♭ into G (or down into F) rather than parking on it.",
    "Practice trick: loop the Game 2 round trip until your fingers know it blind, then improvise by rearranging its pieces.",
    "Unit 18 — the FINAL unit — zooms all the way out: how whole pieces of music are built. Form!"
  ],
  rewards:{ badge:"Blue-Note Bender — Unit 17 Champion", icon:"\u{1F535}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — the scale, the blue notes AND a solo of your own! Unit 17 conquered. \u{1F535}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — and Unit 17 is COMPLETE! You harmonize, compose AND improvise now. \u{1F389}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Solo A used plain C major; solo B used the BLUES SCALE — its ♭3, ♭5 and ♭7 against the chord created the blues sound.",
      play:()=>{[60,63,65,66,67,70,72].forEach((m,i)=>MFAudio.tone(m,.4,i*.3,.42));[48,64,67].forEach(m=>MFAudio.tone(m,2.4,0,.18));} },
    learn:{ label:"the blues scale",
      explain:"7 notes: Root, ♭3, 4, ♭5, 5, ♭7, Root. Build it: remove 2&6, lower 3&7, add ♭5. The flatted notes are the blue notes; improvising = creating music as you play.",
      hint:"C-E♭-F-G♭-G-B♭-C.",
      play:()=>{[60,63,65,66,67,70,72].forEach((m,i)=>MFAudio.tone(m,.42,i*.3,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 sets C major and C blues side by side; example 2 is a written blues lick over the I chord — the ♭3 rub in action." },
    game:{ label:"the games",
      explain:"Sprint the facts, climb the scale both ways, spot the blue intervals, then run the Unit 17 victory lap.",
      hint:"Three blue notes: ♭3, ♭5, ♭7." },
    quiz:{ label:"this question",
      explain:"Everything comes from the three steps (remove 2&6, lower 3&7, add ♭5) and the spelling they produce. When in doubt, rebuild the scale.",
      play:()=>{[60,63,65,66,67,70,72].forEach((m,i)=>MFAudio.tone(m,.4,i*.28,.42));} }
  }
};
