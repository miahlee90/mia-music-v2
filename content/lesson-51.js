/* Lesson 51 — Triads: 1st Inversion (AEMT Book 3, Unit 13) — BOOK 3 OPENER
   Built from drafts/UNIT 13 – Lesson 51.md; AEMT3 p.83 verified by render.
   Core: moving the ROOT up an octave = 1st INVERSION (3rd is ALWAYS the bottom);
   letters never change → the chord keeps its name; close vs open position.
   QA emphasis: bass note decides the INVERSION, the stacked-3rds root names the CHORD.
   NOTE: edit by FULL-FILE REWRITE only. */

/* flip lab: tap the root, watch it jump an octave */
function MF_L51_flip(container,fb){
  const ROUNDS=[
    {name:"C major", root:["C4","E4","G4"], inv:["E4","G4","C5"]},
    {name:"F major", root:["F4","A4","C5"], inv:["A4","C5","F5"]}];
  let r=0;
  container.innerHTML=`<div class="big-q l51-q" style="text-align:center"></div>
    <div class="l51-staff"></div>
    <div style="text-align:center"><button class="play l51-again" style="display:none">▶ Next chord</button></div>`;
  const q=container.querySelector(".l51-q"), holder=container.querySelector(".l51-staff"), nxt=container.querySelector(".l51-again");
  function draw(ps,label,clickable){
    Staff.render(holder,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w",label}:{p,d:"w",chord:true}),
      width:240, clickNotes:clickable,
      onNote: clickable? (i)=>{
        if(i===0){
          const R=ROUNDS[r];
          draw(R.inv, "1st inversion", false);
          R.inv.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.0,.1,.32));
          fb(true,`✓ The root flew to the TOP: ${R.root.map(p=>p[0]).join("-")} became ${R.inv.map(p=>p[0]).join("-")}. Now the 3rd is the bottom note — 1st inversion!`);
          r++;
          if(r<ROUNDS.length){ nxt.style.display="inline-block"; }
          else q.textContent="Great! The notes stayed the same — only their order changed.";
        } else { MFAudio.tone(40,.2); fb(false,"That's not the ROOT — in root position the root is the LOWEST note."); }
      } : undefined});
  }
  function ask(){
    const R=ROUNDS[r]; nxt.style.display="none";
    q.innerHTML=`${R.name}: <b>${R.root.map(p=>p[0]).join("-")}</b>, root position. Tap the <b>ROOT</b> (the bottom note) to send it up an octave.`;
    draw(R.root,"root position",true);
  }
  nxt.onclick=()=>ask();
  ask();
}

/* bass-note detective: tap the lowest note, then name the position */
function MF_L51_detect(container,fb){
  const ROUNDS=[
    {ps:["E4","G4","C5"], name:"C major", pos:1},
    {ps:["F4","A4","C5"], name:"F major", pos:0},
    {ps:["B4","D5","G5"], name:"G major", pos:1},
    {ps:["G4","B4","D5"], name:"G major", pos:0}];
  let r=0, found=false, score=0;
  container.innerHTML=`<div class="big-q l51d-q" style="text-align:center"></div>
    <div class="l51d-staff"></div>
    <div class="choices chips l51d-ch" style="display:none"><button>Root position</button><button>1st inversion</button></div>`;
  const q=container.querySelector(".l51d-q"), holder=container.querySelector(".l51d-staff"), ch=container.querySelector(".l51d-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great job! You identified every inversion."; holder.innerHTML=""; ch.style.display="none"; return; }
    const R=ROUNDS[r]; found=false; ch.style.display="none";
    q.innerHTML=`Chord ${r+1} of ${ROUNDS.length}: first, tap the <b>LOWEST note</b>.`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:220,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(found) return;
        if(i===0){ found=true; q.innerHTML=`The bass is <b>${R.ps[0][0]}</b>. So… what position is this ${R.name} triad in?`; ch.style.display=""; }
        else fb(false,"Higher notes don't decide anything — find the note at the BOTTOM of the stack.");
      }});
  }
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r];
    if(i===R.pos){ score++; MFAudio.yay();
      fb(true, R.pos===1? `✓ Bass ${R.ps[0][0]} is the 3rd of ${R.name} → 1st inversion.` : `✓ Bass ${R.ps[0][0]} IS the root of ${R.name} → root position.`);
      r++; setTimeout(ask,1200); }
    else { MFAudio.tone(40,.2); fb(false,`Spell ${R.name} in 3rds first — is ${R.ps[0][0]} its root or its 3rd?`); }
  });
  ask();
}

/* keyboard builder: press 3rd–5th–root upward (octave-agnostic start) */
function MF_L51_build(container,fb){
  const ROUNDS=[
    {name:"C major", pcs:[4,7,0], letters:["E (the 3rd)","G (the 5th)","C (the root — on top!)"]},
    {name:"F major", pcs:[9,0,5], letters:["A (the 3rd)","C (the 5th)","F (the root — on top!)"]},
    {name:"G major", pcs:[11,2,7], letters:["B (the 3rd)","D (the 5th)","G (the root — on top!)"]}];
  let r=0,k=0,last=null,kb=null,got=[];
  container.innerHTML=`<div class="big-q l51b-q" style="text-align:center"></div>
    <div class="l51b-staff"></div><div class="l51b-kb"></div>`;
  const q=container.querySelector(".l51b-q"), sh=container.querySelector(".l51b-staff"), kh=container.querySelector(".l51b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
    const ps=got.map(m=>NAMES[m%12]+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:190});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You built all three 1st inversion triads."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name} in 1st inversion</b>, bottom to top. Start anywhere: press <b>${ROUNDS[r].letters[0]}</b>.`;
  }
  kb=Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=3){ got.forEach(x=>MFAudio.tone(x,1.0,.1,.32));
          fb(true,`✓ ${R.name}, 1st inversion — the 3rd sits in the bass and the root rides on top.`);
          r++; setTimeout(ask,1400); }
        else q.innerHTML=`Now play <b>${R.letters[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right letter, wrong direction — stack UPWARD from the bass."); }
      else { MFAudio.tone(40,.2); fb(false,k===0? `The 3rd of ${R.name} goes in the bass. Spell the triad in 3rds first.` : "Check the spelling — 3rd, then 5th, then the root on top."); }
    }});
  ask();
}

LESSON_CONTENT[51]={stackFigures:true,
  welcome:"Welcome back! Today's magic trick: turning a chord upside down. \u{1F503}",
  hook:{
    say:"<b>Both of these are C major chords.</b> They use the same three notes, but in a different order. <b>Which one is in root position?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chord A</button>
          <button class="play hk-b">▶ Chord B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Chord A — the root (C) is the lowest note</button><button>Chord B — E is the lowest note, so it is in root position</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67].forEach(m=>MFAudio.tone(m,1.1,0,.33)); hA=true; if(hB) setTimeout(()=>ch.style.display="",1400); };
        container.querySelector(".hk-b").onclick=()=>{ [64,67,72].forEach(m=>MFAudio.tone(m,1.1,0,.33)); hB=true; if(hA) setTimeout(()=>ch.style.display="",1400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Chord A is in root position — C, the root, is the lowest note. Chord B is the same chord with E, the 3rd, as the lowest note. That arrangement is called an INVERSION — today's lesson!");
          else fb(false,"Careful — E is the 3rd of C major, not the root. Play both again and listen for the lowest note.");
        });
      } }
  },
  objectives:[
    "Define inversion: rearranging chord tones so a new note is in the bass",
    "Recognize 1st inversion: the 3rd is ALWAYS the bottom note",
    "Flip a root-position triad by moving its root up an octave",
    "Name the chord from its letters — the bass only names the POSITION",
    "Tell close position from open position",
    "Build 1st-inversion triads on the staff and keyboard"
  ],
  steps:[
    { say:"<b>Quick Review:</b> In <b>root position</b>, the notes are arranged <b>root–3rd–5th</b>, with the <b>root as the lowest note</b>. \u{1F447} <b>Which chord tone is the lowest note in root position?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"C major: C-E-G (root position)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:260} },
      try:{ type:"mc", choices:["The root","The 3rd","The 5th"], answer:0,
        success:"✓ Root on the bottom = root position. Triad knowledge confirmed!",
        fail:"Root position literally puts its name-note at the base.",
        hint:"The position is named after its bass note's job." } },
    { say:"Move the <b>root</b> up one octave. The <b>3rd</b> becomes the lowest note, creating <b>1st INVERSION</b>. \u{1F447} <b>Try it — tap the root:</b>",
      try:{ type:"custom",
        hint:"The root is the BOTTOM note of the root-position stack.",
        mount:(container,fb)=>MF_L51_flip(container,fb) } },
    { say:"A Common Mistake: <b>E–G–C is still a C major chord, even though E is the lowest note.</b> \u{1F447} <b>Is this statement correct?</b>",
      try:{ type:"mc", choices:["Yes. The root names the chord. The bass note shows the inversion.","No — the bass note names the chord, so it's an E chord","Only in open position"], answer:0,
        success:"✓ Correct! The notes still spell C-E-G, so the chord is C major — in 1st inversion. The root names the chord; the bass note shows the inversion.",
        fail:"Rearrange E-G-C into thirds: C-E-G. Whose chord is that?",
        hint:"Rearrange the letters into thirds — the bottom of that stack is the root." } },
    { say:"1st Inversion Rule: <b>The 3rd of the chord is the lowest note.</b> Here are <b>C, F, and G major triads</b> in <b>1st inversion</b>. \u{1F447} <b>Which chord tone is the lowest note in every 1st inversion triad?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"E4",d:"w",label:"C: E-G-C"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"A4",d:"w",label:"F: A-C-F"},{p:"C5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"B4",d:"w",label:"G: B-D-G"},{p:"D5",d:"w",chord:true},{p:"G5",d:"w",chord:true}],width:480} },
      try:{ type:"mc", choices:["The 3rd","The root","The 5th"], answer:0,
        success:"✓ The 3rd is the lowest note in every 1st inversion triad. (The root moved to the TOP.)",
        fail:"Look at the lowest note of each chord — is it the root, the 3rd, or the 5th?",
        hint:"Root position: root-3rd-5th. Remove the root from the bottom — what's left down there?" } },
    { say:"<b>Close vs. Open Position:</b> In <b>close position</b>, all chord tones fit within one octave. In <b>open position</b>, the chord tones are spread wider than one octave. Both root position and inversions can be either close or open. \u{1F447} <b>What does open position mean?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"close (root pos.)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"open (root pos.)"},{p:"G4",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"E4",d:"w",label:"close (1st inv.)"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"E4",d:"w",label:"open (1st inv.)"},{p:"C5",d:"w",chord:true},{p:"G5",d:"w",chord:true}],width:560} },
      try:{ type:"mc", choices:["Chord tones spread wider than an octave","The root is on the bottom","The chord has four notes"], answer:0,
        success:"✓ Same tones, more air between them. The INVERSION never changes with spacing — only the bass note matters.",
        fail:"Open/close is about SPACING, not about which note is in the bass.",
        hint:"Measure from the bottom note to the top note: inside one octave, or beyond it?" } },
    { say:"<b>Identify the inversion.</b> Find the <b>lowest note</b> first, then name the chord position. \u{1F447}",
      try:{ type:"custom",
        hint:"Tap the bottom note, then ask: is it the root or the 3rd of the chord's spelling?",
        mount:(container,fb)=>MF_L51_detect(container,fb) } },
    { say:"Build these three chords in <b>1st inversion</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"3rd on the bottom, 5th in the middle, root on top — stack upward.",
        mount:(container,fb)=>MF_L51_build(container,fb) } },
    { say:"<b>Final Check</b> \u{1F447} <b>Which of these is F major in 1st inversion?</b>",
      try:{ type:"mc", choices:["A-C-F","F-A-C","C-F-A"], answer:0,
        success:"✓ A (the 3rd) in the bass, root F on top. You're officially inverting!",
        fail:"F major spells F-A-C. Put its 3rd — A — on the bottom.",
        hint:"1st inversion = 3rd in the bass." } }
  ],
  examples:[
    { caption:"The flip in slow motion: C major in root position, then in 1st inversion. Watch the keyboard — the same three letters light up, just re-stacked.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"root position"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"1st inversion"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:420},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"WHY musicians flip chords: listen to the BASS. With G major in 1st inversion in the middle, the bass line walks C → B → C.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"B3",d:"w",label:"G (1st inv.)"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:460},
      kb:{start:59,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Position Sprint (45s)",
      intro:"Root position or 1st inversion? Read the BASS note and answer at speed!",
      miaIntro:"Bass note first — always! \u{1F50D}",
      spec:{gen:"inversion-id", params:{subject:"triad", ask:"position"}, seconds:45},
      result:(score)=>score>=8?score+" chords placed — inversion eyes unlocked!":null },
    { type:"key-climb", title:"Game 2 · 1st-Inversion Ladder",
      intro:"Climb C, F and G major — each one in 1st inversion, 3rd-5th-root!",
      miaIntro:"Nine keys to the top! \u{1FA9C}",
      spec:{seq:[64,67,72, 69,72,77, 71,74,79],
        names:["E (3rd of C)","G (5th)","C (root on top)","A (3rd of F)","C (5th)","F (root on top)","B (3rd of G)","D (5th)","G (root on top)"],
        start:60, octaves:2, title:"C → F → G major, all in 1st inversion"},
      result:(score)=>score!==null?"Three 1st inversions under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · Position Spotter",
      intro:"Four chord cards — click the one each round calls for!",
      miaIntro:"Watch the bottom of every stack! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Root position (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"1st inversion (E-G-C)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Root position (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"1st inversion (A-C-F)", spec:{clef:"treble",notes:[{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No inversion sneaks past you!":null },
    { type:"term-race", title:"Game 4 · Inversion Vocabulary Race",
      intro:"All of today's words — match them fast!",
      miaIntro:"Vocabulary victory lap! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Inversion","rearranging a chord so a new tone is the bass"],
        ["Root position","the root is the lowest note"],
        ["1st inversion","the 3rd is the lowest note"],
        ["Close position","chord tones within one octave"],
        ["Open position","chord tones spread wider than an octave"],
        ["Bass note","the lowest note — it decides the position"],
        ["E-G-C","C major in 1st inversion"],
        ["The chord's name","comes from the ROOT, never the bass"]]},
      result:(score)=>score>=6?"Word-perfect on inversions!":null }
  ],
  practiceIntro:"20 practice questions — flips, bass notes, spellings and spacing. Answer right and the next appears automatically!",
  practice:[
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:6 },
    { gen:"term-match", params:{subject:"term", pool:[["Inversion","a new chord tone in the bass"],["1st inversion","3rd on the bottom"],["Root position","root on the bottom"],["Close position","within one octave"],["Open position","wider than an octave"]], reverse:true}, count:4 },
    { type:"mc", q:"To create a 1st inversion from root position, move the ____ up one octave.", choices:["root","3rd","5th"], answer:0,
      explain:"C-E-G → E-G-C: the root goes to the top." },
    { type:"mc", q:"E-G-C is which chord, in which position?", choices:["C major, 1st inversion","E major, root position","C major, root position"], answer:0,
      explain:"Rearranged into thirds: C-E-G. C major — with its 3rd (E) in the bass." },
    { type:"mc", q:"In 1st inversion, the root sits…", choices:["on top","in the bass","in the middle"], answer:0,
      explain:"It moved up an octave — from the bottom to the top." },
    { type:"mc", q:"G major (G-B-D) in 1st inversion is spelled…", choices:["B-D-G","D-G-B","G-D-B"], answer:0,
      explain:"3rd (B) in the bass, then 5th, then root." },
    { type:"mc", q:"A chord whose tones span MORE than an octave is in…", choices:["open position","close position","2nd inversion"], answer:0,
      explain:"Spacing wider than an octave = open. Spacing never changes the inversion." },
    { type:"mc", q:"Which note determines the inversion of a chord?", choices:["the lowest (bass) note","the highest note","the loudest note"], answer:0,
      explain:"Bass = position. Root = name." },
    { type:"truefalse", q:"Inverting a chord changes its name.", answer:false,
      explain:"Same letters, same chord — only the arrangement changes." },
    { type:"truefalse", q:"A 1st-inversion triad always has the 3rd in the bass.", answer:true,
      explain:"That IS the definition of 1st inversion." },
    { type:"truefalse", q:"Close position means all chord tones fit within one octave.", answer:true,
      explain:"Within an octave = close voicing; wider = open voicing." },
    { type:"truefalse", q:"An open-position chord can still be in 1st inversion.", answer:true,
      explain:"Spacing and inversion are independent — check the bass note." }
  ],
  miaQuizIntro:"Quiz time! Read every chord from the BOTTOM up — bass first, name second.",
  quiz:[
    { type:"mc", q:"What is an inversion?", choices:["Rearranging chord tones so a different note is in the bass","Adding another note to a chord","Playing the chord louder","Changing the key"], answer:0,
      explain:"Same notes, new bass — the chord's identity survives.", hint:"In-VERT = turn over." },
    { type:"mc", q:"Which chord tone is the LOWEST note of a 1st-inversion triad?", choices:["The 3rd","The root","The 5th","The 7th"], answer:0,
      explain:"3rd in the bass = 1st inversion, always.", hint:"The root left the bottom — who moved in?" },
    { type:"mc", q:"Which of these is the 1st inversion of C major?", choices:["E-G-C","C-E-G","G-C-E","C-G-E"], answer:0,
      explain:"Root C moved to the top; 3rd E takes the bass.", hint:"3rd on the bottom." },
    { type:"truefalse", q:"Changing the inversion changes the name of the chord.", answer:false,
      explain:"The letters stay C-E-G, so the chord stays C major.", hint:"Family photo: same family, new arrangement." },
    { type:"truefalse", q:"A 1st-inversion triad always has the 3rd in the bass.", answer:true,
      explain:"That's the rule to carry into every later lesson.", hint:"It's the definition itself." },
    { type:"mc", q:"In CLOSE position, the notes of a chord are spaced…", choices:["within one octave","wider than an octave","exactly two octaves apart"], answer:0,
      explain:"Close = packed inside an octave; open = spread beyond it.", hint:"\u{201C}Close\u{201D} as in close together." },
    { type:"mc", q:"Moving the ROOT of a root-position triad up one octave creates…", choices:["the 1st inversion","the 2nd inversion","an entirely new chord"], answer:0,
      explain:"One flip = 1st inversion. (The next flip comes in Lesson 52!)", hint:"Count the flips." },
    { type:"mc", q:"Name this chord and its position.",
      staff:{clef:"treble",notes:[{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:200},
      choices:["F major, 1st inversion","A minor, root position","F major, root position"], answer:0,
      explain:"Rearrange into thirds: F-A-C. The bass A is the 3rd → 1st inversion.", hint:"Rearrange the letters into thirds first." },
    { type:"mc", q:"Name this chord and its position.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:200},
      choices:["G major, root position","G major, 1st inversion","D major, 2nd inversion"], answer:0,
      explain:"Bass G IS the root: G-B-D, root position.", hint:"Is the bass the root or the 3rd?" },
    { type:"mc", q:"A student says, \u{201C}E–G–C must be an E chord — E is on the bottom.\u{201D} Why is the student incorrect?", choices:["The bass names the POSITION, not the chord — it's C major in 1st inversion","Nothing — the student is right","E-G-C is actually G major"], answer:0,
      explain:"Rearranged into thirds it spells C-E-G. Bass note = position; root = name.", hint:"Rearrange the notes into thirds before naming the chord." },
    { type:"mc", q:"Which statement is correct?", choices:["A 1st-inversion triad has the 3rd as its lowest note","Inversions change the identity of a chord","Open position means the root is always on the bottom","Close position means the chord has four notes"], answer:0,
      explain:"The other three all confuse spacing, naming or position rules.", hint:"One of these is today's core rule, word for word." },
    { type:"mc", q:"Why do musicians use 1st inversion chords?", choices:["It makes the bass line move more smoothly","It makes the chord louder","It adds a 4th note to the triad"], answer:0,
      explain:"C → B → C in the bass instead of C → G → C leaps: smoother, more connected harmony.", hint:"Listen to what the BASS did in the second example." },
    /* generated */
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["1st inversion","the 3rd is the lowest note"],["Root position","the root is the lowest note"],["Open position","tones spread wider than an octave"],["Close position","tones within one octave"]], reverse:true}, count:2 },
    { gen:"triad-id", params:{ask:"root"}, count:2 }
  ],
  vocabulary:[
    {term:"Inversion", def:"Rearranging the notes of a chord so that a tone other than the root is the lowest note. The chord keeps its name."},
    {term:"Root Position", def:"The root is the lowest note.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"1st Inversion", def:"The 3rd is the lowest note — made by moving the root up an octave.",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:130}},
    {term:"Close Position", def:"All chord tones fit within one octave.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Open Position", def:"Chord tones are spread wider than one octave.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G4",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:130}}
  ],
  mistakes:[],
  summary:[
    "✔ An <b>inversion</b> rearranges a chord's tones so a new note is in the bass — <b>the name never changes</b>.",
    "✔ <b>1st inversion = the 3rd is the bottom note</b> (the root moved up an octave: C-E-G → E-G-C).",
    "✔ The <b>root names the chord</b>; the <b>bass names the position</b>.",
    "✔ <b>Close position</b> fits inside one octave; <b>open position</b> spreads wider — either way, the bass still decides the inversion.",
    "✔ 1st inversions make <b>smoother bass lines</b> — you heard C-B-C in the example."
  ],
  tips:[
    "Reading trick: a root-position triad stacks evenly (all lines or all spaces). A 1st inversion has a GAP above — the top two notes sit a 4th apart with the root on top.",
    "At the piano, flip any triad you know: play C-E-G, then move just your thumb note up an octave. One finger moves; the whole sound changes.",
    "In Lesson 52 the chord flips AGAIN — guess which note will be in the bass next!",
    "Composers love 1st inversions for walking bass lines: I → V⁶ → I gives the bass do-ti-do."
  ],
  rewards:{ badge:"Chord Flipper", icon:"\u{1F503}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score on your very first inversion lesson — what a way to start! \u{1F503}\u{1F389}",
  miaPass:"Passed! The 3rd-in-the-bass rule is yours. Lesson 52 flips the chord one more time…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Chord A was C-E-G (root position). Chord B rearranged the same notes as E-G-C — 1st inversion, with the 3rd as the lowest note.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.9,0,.33));[64,67,72].forEach(m=>MFAudio.tone(m,1.1,1.1,.33));} },
    learn:{ label:"1st inversion",
      explain:"Move the root up an octave and the 3rd becomes the bass: that's 1st inversion. Letters unchanged → name unchanged. Close = within an octave, open = wider.",
      hint:"Bass note = position. Root = name.",
      play:()=>{[64,67,72].forEach(m=>MFAudio.tone(m,1,.1,.33));} },
    example:{ label:"the examples",
      explain:"Example 1 flips C major in slow motion; example 2 shows the payoff — a bass line that walks C-B-C using a 1st-inversion G chord." },
    game:{ label:"the games",
      explain:"Sprint positions, climb three 1st inversions, spot them on cards, then race the vocabulary.",
      hint:"Always find the BASS note first." },
    quiz:{ label:"this question",
      explain:"Every question reduces to two moves: rearrange the letters into thirds to NAME the chord, then look at the bass to name the POSITION.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.8,0,.33));[64,67,72].forEach(m=>MFAudio.tone(m,1,1,.33));} }
  }
};
