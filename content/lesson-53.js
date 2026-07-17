/* Lesson 53 — V7 Chord: 1st, 2nd and 3rd Inversions (AEMT Book 3, Unit 13)
   Built from drafts/UNIT 13 – Lesson 53.md; AEMT3 p.85 verified by render.
   Core: a 4-note V7 chord has FOUR positions — root, 1st (3rd bottom),
   2nd (5th bottom), 3rd (7th bottom!); close-position trick: the root is
   always the UPPER note of the interval of a 2nd. Letter symbols: G7/B etc.
   NOTE: edit by FULL-FILE REWRITE only. */

/* flip machine: one G7, three taps, four positions */
function MF_L53_flip(container,fb){
  const POSITIONS=[
    {ps:["G3","B3","D4","F4"], label:"root position", bass:"G (root)"},
    {ps:["B3","D4","F4","G4"], label:"1st inversion", bass:"B (3rd)"},
    {ps:["D4","F4","G4","B4"], label:"2nd inversion", bass:"D (5th)"},
    {ps:["F4","G4","B4","D5"], label:"3rd inversion", bass:"F (7th!)"}];
  let k=0;
  container.innerHTML=`<div class="big-q l53-q" style="text-align:center"></div>
    <div class="l53-staff"></div>`;
  const q=container.querySelector(".l53-q"), holder=container.querySelector(".l53-staff");
  function draw(){
    const P=POSITIONS[k];
    Staff.render(holder,{clef:"treble",notes:P.ps.map((p,ix)=>ix===0?{p,d:"w",label:"G7 — "+P.label}:{p,d:"w",chord:true}),
      width:260, clickNotes:true,
      onNote:(i)=>{
        if(i===0){
          if(k>=POSITIONS.length-1) return;
          k++; draw();
          const N=POSITIONS[k];
          N.ps.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.0,.1,.3));
          if(k<POSITIONS.length-1){
            fb(true,`✓ Great! The chord moved to the next inversion — the lowest note is now ${N.bass}.`);
            q.innerHTML=`Position ${k+1} of 4: <b>${N.label}</b>. Tap the lowest note to continue.`;
          } else {
            fb(true,`✓ Excellent! In 3rd inversion the 7th (F) is the lowest note. Each chord tone has now been in the bass.`);
            q.textContent="Excellent! Each chord tone has now been in the bass.";
          }
        } else { MFAudio.tone(40,.2); fb(false,"Tap the LOWEST note — that's the one that jumps up an octave."); }
      }});
  }
  q.innerHTML=`G7 in <b>root position</b> (G-B-D-F). Tap the <b>lowest note</b> to move it up one octave.`;
  draw();
}

/* four-way detective: name the position of V7 chords */
function MF_L53_detect(container,fb){
  const ROUNDS=[
    {ps:["B3","D4","F4","G4"], chord:"G7", pos:1},
    {ps:["F4","G4","B4","D5"], chord:"G7", pos:3},
    {ps:["G3","B3","D4","F4"], chord:"G7", pos:0},
    {ps:["G4","C5","E5","Bb5"], chord:"C7", pos:2},
    {ps:["Bb3","C4","E4","G4"], chord:"C7", pos:3}];
  const POS=["Root position","1st inversion","2nd inversion","3rd inversion"];
  const ROLE=["root","3rd","5th","7th"];
  let r=0, found=false, score=0;
  container.innerHTML=`<div class="big-q l53d-q" style="text-align:center"></div>
    <div class="l53d-staff"></div>
    <div class="choices chips l53d-ch" style="display:none"><button>Root position</button><button>1st inversion</button><button>2nd inversion</button><button>3rd inversion</button></div>`;
  const q=container.querySelector(".l53d-q"), holder=container.querySelector(".l53d-staff"), ch=container.querySelector(".l53d-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great job! You identified every inversion."; holder.innerHTML=""; ch.style.display="none"; return; }
    const R=ROUNDS[r]; found=false; ch.style.display="none";
    q.innerHTML=`${R.chord} (${R.chord==="G7"?"G-B-D-F":"C-E-G-B♭"}): tap the <b>lowest note</b> first. (Chord ${r+1} of ${ROUNDS.length})`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:230,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(found) return;
        if(i===0){ found=true; q.innerHTML=`✓ The lowest note is <b>${R.ps[0].replace(/\d/,"").replace("b","♭")}</b>. Now identify the inversion.`; ch.style.display=""; }
        else fb(false,"Lower! The bottom note decides the position.");
      }});
  }
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r];
    if(i===R.pos){ score++; MFAudio.yay();
      fb(true,`✓ The bass is the ${ROLE[R.pos]} of ${R.chord} → ${POS[R.pos]}.`);
      r++; setTimeout(ask,1200); }
    else { MFAudio.tone(40,.2); fb(false,`Spell ${R.chord} from its root and find the bass note's job: root, 3rd, 5th or 7th?`); }
  });
  ask();
}

/* keyboard builder: G7 inversions upward */
function MF_L53_build(container,fb){
  const ROUNDS=[
    {name:"G7, 1st inversion", pcs:[11,2,5,7], letters:["B (the 3rd — bass)","D (the 5th)","F (the 7th)","G (the root on top)"]},
    {name:"G7, 2nd inversion", pcs:[2,5,7,11], letters:["D (the 5th — bass)","F (the 7th)","G (the root)","B (the 3rd on top)"]},
    {name:"G7, 3rd inversion", pcs:[5,7,11,2], letters:["F (the 7th — bass!)","G (the root)","B (the 3rd)","D (the 5th on top)"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l53b-q" style="text-align:center"></div>
    <div class="l53b-staff"></div><div class="l53b-kb"></div>`;
  const q=container.querySelector(".l53b-q"), sh=container.querySelector(".l53b-staff"), kh=container.querySelector(".l53b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
    const ps=got.map(m=>NAMES[m%12]+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:200});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You built all three inversions."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name}</b>. Press <b>${ROUNDS[r].letters[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=4){ got.forEach(x=>MFAudio.tone(x,1.0,.1,.3));
          fb(true,`✓ ${R.name} — the lowest note is ${R.letters[0].split(" ")[0]}.`);
          r++; setTimeout(ask,1400); }
        else q.innerHTML=`Now play <b>${R.letters[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right letter — stack UPWARD from the bass."); }
      else { MFAudio.tone(40,.2); fb(false,k===0? `Which note of G-B-D-F does the bass job in ${R.name}?` : "Keep the G7 spelling: G-B-D-F, rotated."); }
    }});
  ask();
}

LESSON_CONTENT[53]={stackFigures:true,
  welcome:"A triad flips three ways. Today's chord flips FOUR — because it brought an extra note. \u{1F504}",
  hook:{
    say:"<b>A V7 chord has four notes, so it can be played in four different positions.</b> Listen carefully. <b>Which chord has the 7th as the lowest note?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A</button>
          <button class="play hk-b">▶ Version B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — F, the 7th, is the lowest note</button><button>Version A — G in the bass is the 7th</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [55,59,62,65].forEach(m=>MFAudio.tone(m,1.2,0,.32)); hA=true; if(hB) setTimeout(()=>ch.style.display="",1400); };
        container.querySelector(".hk-b").onclick=()=>{ [53,55,59,62].forEach(m=>MFAudio.tone(m,1.2,0,.32)); hB=true; if(hA) setTimeout(()=>ch.style.display="",1400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Version B was F-G-B-D — the 7th (F) is the lowest note: 3RD INVERSION. Today: all four positions of V7!");
          else fb(false,"Version A had G, the ROOT, as its lowest note — that's root position. Listen again for the lowest note.");
        });
      } }
  },
  objectives:[
    "Explain why a V7 chord has FOUR positions",
    "Recognize 1st inversion (3rd in the bass), 2nd (5th) and 3rd (7th)",
    "Read letter symbols like G7/B, G7/D and G7/F",
    "Find the root fast: it's the UPPER note of the interval of a 2nd",
    "Build every inversion of G7 on the staff and keyboard",
    "Identify V7 positions by bass note, on sight"
  ],
  steps:[
    { say:"<b>Quick Review:</b> A triad has <b>3 notes</b>, so it has <b>3 positions</b>. A <b>V7 chord has 4 notes</b>, so it has <b>4 positions</b>. \u{1F447} <b>How many positions can a V7 chord have?</b>",
      try:{ type:"mc", choices:["4","3","7"], answer:0,
        success:"✓ Four notes, four possible bass notes, four positions: root, 1st, 2nd and 3rd inversion.",
        fail:"Every chord tone gets one turn in the bass…",
        hint:"Count the notes of G-B-D-F." } },
    { say:"Move the <b>lowest note</b> up one octave each time. Watch the <b>V7 chord</b> move through all <b>four positions</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Tap the LOWEST note each time — three flips total.",
        mount:(container,fb)=>MF_L53_flip(container,fb) } },
    { say:"<b>V7 Inversions:</b> Each inversion places a different chord tone in the bass. In <b>3rd inversion</b>, the <b>7th</b> is the lowest note. \u{1F447} <b>Which chord tone is the lowest note in 3rd inversion?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"G3",d:"w",label:"root (G7)"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"B3",d:"w",label:"1st (G7/B)"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"2nd (G7/D)"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"3rd (G7/F)"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:600} },
      try:{ type:"mc", choices:["The 7th","The 5th","The root"], answer:0,
        success:"✓ 7th in the bass = 3rd inversion. The bass ladder is now root → 3rd → 5th → 7th.",
        fail:"Three flips from root position — who's left to take the bass?",
        hint:"Each flip promotes the next chord tone." } },
    { say:"<b>Slash Chord Symbols:</b> A slash chord shows the <b>chord name</b> followed by the <b>bass note</b>. For example, <b>G7/D</b> means <b>G7 with D in the bass</b>. \u{1F447} <b>What does G7/D mean?</b>",
      try:{ type:"mc", choices:["G7 with D in the bass (2nd inversion)","D7 with G in the bass","G major without a 7th"], answer:0,
        success:"✓ Left of the slash = the chord; right of the slash = the bass note. D is the 5th of G7 → 2nd inversion.",
        fail:"Read it aloud: \u{201C}G seven over D\u{201D}…",
        hint:"chord / bass." } },
    { say:"<b>Finding the Root:</b> In close position, the <b>7th</b> and the <b>root</b> are next to each other — an interval of a <b>2nd</b>. The <b>upper note</b> is always the <b>root</b>. Find F-G in each inversion below. \u{1F447} <b>The upper note of the 2nd is always…</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"B3",d:"w",label:"1st: F-G on top"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"2nd: F-G inside"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"3rd: F-G at bottom"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:560} },
      try:{ type:"mc", choices:["the ROOT of the chord","the 7th of the chord","the bass note"], answer:0,
        success:"✓ Spot the 2nd (F-G here), grab its top note (G) — you've named the chord's root instantly, in ANY inversion.",
        fail:"In G7 the crunchy neighbors are F and G. Which one is the root?",
        hint:"Triads hid the root on top of a 4th; sevenths hide it on top of a 2nd." } },
    { say:"<b>Identify the inversion.</b> Find the <b>lowest note</b>, then identify the chord position. \u{1F447}",
      try:{ type:"custom",
        hint:"Spell the chord from its root (G-B-D-F / C-E-G-B♭), then match the bass note's job.",
        mount:(container,fb)=>MF_L53_detect(container,fb) } },
    { say:"<b>Build all three inversions of G7.</b> \u{1F447}",
      try:{ type:"custom",
        hint:"Rotate G-B-D-F: start each round on the new bass note and stack upward.",
        mount:(container,fb)=>MF_L53_build(container,fb) } }
  ],
  examples:[
    { caption:"G7 climbs through all four positions — root, 1st, 2nd, 3rd. Same four letters every time; only the bass changes. Watch the bottom of each stack.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"G3",d:"w",label:"G7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"B3",d:"w",label:"G7/B"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"G7/D"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"G7/F"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:600},
      kb:{start:53,octaves:1.9167,labels:true} },
    { caption:"Why the 3rd inversion is a composer's favorite: the 7th in the bass (F) resolves down by step to E, giving I in 1st inversion. Bass line F → E.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"F4",d:"w",label:"G7/F (3rd inv.)"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"E4",d:"w",label:"C/E (1st inv.)"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:440},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Four-Position Sprint (45s)",
      intro:"Seventh chords in every position — read the bass, name the inversion!",
      miaIntro:"Four options now — stay sharp! \u{1F50D}",
      spec:{gen:"inversion-id", params:{subject:"v7", ask:"position"}, seconds:45},
      result:(score)=>score>=8?score+" sevenths placed — four-position fluency!":null },
    { type:"key-climb", title:"Game 2 · G7 Inversion Ladder",
      intro:"Climb G7 through its 2nd, 3rd and 1st inversions — twelve keys, no wrong turns!",
      miaIntro:"The grand tour of G7! \u{1FA9C}",
      spec:{seq:[62,65,67,71, 65,67,71,74, 71,74,77,79],
        names:["D (5th)","F (7th)","G (root)","B (3rd)","F (7th — bass!)","G (root)","B (3rd)","D (5th)","B (3rd — bass)","D (5th)","F (7th)","G (root on top)"],
        start:60, octaves:2, title:"G7: 2nd inversion → 3rd inversion → 1st inversion"},
      result:(score)=>score!==null?"G7 climbed in three different suits!":null },
    { type:"symbol-hunt", title:"Game 3 · V7 Position Spotter",
      intro:"Four faces of G7 — click the position each round names!",
      miaIntro:"The bass note never lies! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Root position (G7)", spec:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"1st inversion (G7/B)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"2nd inversion (G7/D)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"3rd inversion (G7/F)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"All four faces memorized!":null },
    { type:"term-race", title:"Game 4 · Inversion Fact Race",
      intro:"Positions, bass notes and slash symbols — match them at speed!",
      miaIntro:"Everything from Lessons 51-53! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["3rd inversion","the 7th is in the bass"],
        ["2nd inversion of V7","the 5th is in the bass"],
        ["1st inversion of V7","the 3rd is in the bass"],
        ["Root position","the root is in the bass"],
        ["G7/D","G7 with D in the bass"],
        ["G7/F","G7 in 3rd inversion"],
        ["Why V7 has 4 positions","it contains 4 notes"],
        ["The root in close inversions","the UPPER note of the 2nd"]]},
      result:(score)=>score>=6?"Fact-race champion!":null }
  ],
  practiceIntro:"20 practice questions — four positions, slash symbols and the 2nd trick. Answer right and the next appears automatically!",
  practice:[
    { gen:"inversion-id", params:{subject:"v7", ask:"position"}, count:6 },
    { gen:"term-match", params:{subject:"term", pool:[["3rd inversion","7th in the bass"],["2nd inversion","5th in the bass"],["1st inversion","3rd in the bass"],["Root position","root in the bass"],["G7/B","G7 in 1st inversion"]], reverse:true}, count:4 },
    { type:"mc", q:"A seventh chord can be written in how many positions?", choices:["4","3","2"], answer:0,
      explain:"Four notes → four possible bass notes." },
    { type:"mc", q:"Which position exists for V7 but NOT for a triad?", choices:["3rd inversion","1st inversion","2nd inversion"], answer:0,
      explain:"Only a 4-note chord can put a 7th in the bass." },
    { type:"mc", q:"In G7's 2nd inversion, the bass note is…", choices:["D","B","F"], answer:0,
      explain:"2nd inversion = 5th in the bass; the 5th of G7 is D." },
    { type:"mc", q:"F–G–B–D is which inversion of G7?", choices:["3rd inversion","root position","1st inversion"], answer:0,
      explain:"F is the 7th of G-B-D-F → 3rd inversion." },
    { type:"mc", q:"The letter symbol for G7 with B in the bass is…", choices:["G7/B","B7/G","G/B7"], answer:0,
      explain:"Chord name, slash, bass note." },
    { type:"mc", q:"In close position, where is the root located?", choices:["the upper note of the 2nd","the lower note of the 2nd","always the top note of the chord"], answer:0,
      explain:"Find the two notes a 2nd apart (7th+root) — the root is on top." },
    { type:"truefalse", q:"Inverting a V7 chord changes its name.", answer:false,
      explain:"G-B-D-F in any order is still G7." },
    { type:"truefalse", q:"In 3rd inversion, the 7th of the chord is the lowest note.", answer:true,
      explain:"That's the definition — and it pulls hard downward." },
    { type:"truefalse", q:"A triad can also have a 3rd inversion.", answer:false,
      explain:"Triads own only three notes — after two flips they're back where they started." },
    { type:"truefalse", q:"In G7/D, the D is the 5th of the chord.", answer:true,
      explain:"G-B-D-F: D is the 5th, so G7/D is 2nd inversion." }
  ],
  miaQuizIntro:"Quiz! Four notes, four positions — let the bass note do the talking.",
  quiz:[
    { type:"mc", q:"How many different positions can a seventh chord have?", choices:["4","2","3","5"], answer:0,
      explain:"Root position plus three inversions.", hint:"One per chord tone." },
    { type:"mc", q:"Which chord tone is in the bass of a THIRD-inversion V7 chord?", choices:["The 7th","The root","The 3rd","The 5th"], answer:0,
      explain:"3rd inversion = 7th at the bottom.", hint:"The last tone left on the ladder." },
    { type:"mc", q:"Which chord tone is in the bass of a FIRST-inversion V7 chord?", choices:["The 3rd","The root","The 5th","The 7th"], answer:0,
      explain:"Same as triads: first flip puts the 3rd in the bass.", hint:"Lesson 51's rule carries over." },
    { type:"truefalse", q:"Changing the inversion changes the chord name.", answer:false,
      explain:"B-D-F-G still spells G7.", hint:"Count the letters, not the order." },
    { type:"truefalse", q:"The V7 chord has more possible positions than a triad because it has more notes.", answer:true,
      explain:"4 notes → 4 positions; 3 notes → 3 positions.", hint:"One position per possible bass note." },
    { type:"mc", q:"Name this chord's position (G7 = G-B-D-F).",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:200},
      choices:["2nd inversion","root position","1st inversion","3rd inversion"], answer:0,
      explain:"Bass D = the 5th of G7 → 2nd inversion.", hint:"What job does D do in G-B-D-F?" },
    { type:"mc", q:"Name this chord's position (G7 = G-B-D-F).",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:200},
      choices:["3rd inversion","2nd inversion","root position","1st inversion"], answer:0,
      explain:"F (the 7th) in the bass → 3rd inversion — G7/F.", hint:"The bass is the crunchiest note of the chord." },
    { type:"mc", q:"What does the symbol G7/F mean?", choices:["a G7 chord with F as the lowest note","an F7 chord with G as the lowest note","F major, then G7"], answer:0,
      explain:"Chord / bass — the slash names the floor.", hint:"Left = chord, right = bass." },
    { type:"mc", q:"In close position, the two notes that sit a 2nd apart in an inverted V7 are…", choices:["the 7th and the root","the root and the 3rd","the 3rd and the 5th"], answer:0,
      explain:"F-G in G7 — and the ROOT is the upper one.", hint:"The crunch pair." },
    { type:"mc", q:"A student says, \u{201C}D–F–G–B is a D chord because D is the lowest note.\u{201D} Why is the student incorrect?", choices:["It is G7 in 2nd inversion. Rearrange the notes into thirds to find the root.","The student is right","It's B diminished"], answer:0,
      explain:"F-G is the 2nd → the root is G → G-B-D-F → 2nd inversion.", hint:"Use the 2nd trick." },
    { type:"mc", q:"Which listing is the bass-note ladder of V7 positions, in order?", choices:["root → 3rd → 5th → 7th","root → 5th → 3rd → 7th","7th → 5th → 3rd → root"], answer:0,
      explain:"Each flip promotes the next chord tone into the bass.", hint:"Same ladder as triads, one rung longer." },
    { type:"mc", q:"Why does F naturally resolve to E in G7/F → C?", choices:["The 7th of the V7 chord resolves down by step to the 3rd of the I chord","F is louder than E","The chord became minor"], answer:0,
      explain:"The 7th's downward pull is the engine of V7 → I.", hint:"Which chord tone was in the bass?" },
    /* generated */
    { gen:"inversion-id", params:{subject:"v7", ask:"position"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["3rd inversion","7th in the bass"],["G7/D","2nd inversion of G7"],["G7/B","1st inversion of G7"],["Root of an inverted 7th chord","upper note of the 2nd"]], reverse:true}, count:2 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Root Position (V7)", def:"The root is the lowest note: G-B-D-F.",
      staff:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:130}},
    {term:"1st Inversion (V7)", def:"The 3rd is the lowest note: B-D-F-G. Letter symbol: G7/B.",
      staff:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"2nd Inversion (V7)", def:"The 5th is the lowest note: D-F-G-B. Letter symbol: G7/D.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:130}},
    {term:"3rd Inversion (V7)", def:"The 7th is the lowest note: F-G-B-D. Letter symbol: G7/F. Only 4-note chords can do this!",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:130}},
    {term:"The 2nd Trick", def:"In close-position inversions of a seventh chord, the root is always the UPPER note of the interval of a 2nd."}
  ],
  mistakes:[],
  summary:[
    "✔ V7 has <b>four notes → four positions</b>: root, 1st, 2nd and <b>3rd inversion</b> (7th in the bass).",
    "✔ The bass ladder: <b>root → 3rd → 5th → 7th</b>.",
    "✔ Letter symbols read <b>chord / bass</b>: G7/B, G7/D, G7/F.",
    "✔ Close-position shortcut: <b>the root is the upper note of the 2nd</b> (the 7th sits right below it).",
    "✔ The 7th in the bass pulls DOWN by step — 3rd inversion loves resolving to I in 1st inversion."
  ],
  tips:[
    "Spot a seventh-chord inversion instantly: find the 2nd (the crunch pair) inside the stack. Bass ladder position = how far that pair has climbed from the top.",
    "Piano drill: play G7 → G7/B → G7/D → G7/F, then land on C/E. Your left hand just learned a week of voice-leading.",
    "The nicknames 6/5, 4/3 and 4/2 you'll see in figured bass — next lesson decodes that entire number system. It's called figured bass!",
    "Listen to any gospel or jazz pianist: those rich low notes under dominant chords are usually 3rds and 7ths in the bass — inversions at work."
  ],
  rewards:{ badge:"Four-Position Pilot", icon:"\u{1F504}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — all four positions of V7, spotless! The figured-bass code awaits. \u{1F504}\u{1F389}",
  miaPass:"Passed! Root, 3rd, 5th, 7th — the whole ladder is yours. Lesson 54 gives the numbers.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A was G7 in root position; version B put the 7th (F) in the bass — 3rd inversion, a 4-note-chord exclusive.",
      play:()=>{[53,55,59,62].forEach(m=>MFAudio.tone(m,1.1,0,.32));} },
    learn:{ label:"V7 inversions",
      explain:"Four notes give four positions; the bass ladder runs root-3rd-5th-7th. Slash symbols name the bass (G7/D). The root always tops the interval of a 2nd.",
      hint:"Find the crunch pair (the 2nd) — root on top.",
      play:()=>{[65,67,71,74].forEach(m=>MFAudio.tone(m,1,.1,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 climbs G7 through all four positions; example 2 resolves G7/F down to C/E — the 7th sinking by step." },
    game:{ label:"the games",
      explain:"Sprint the four positions, climb the G7 ladder, spot positions on cards, then race the facts.",
      hint:"The bass note is always the answer's first clue." },
    quiz:{ label:"this question",
      explain:"Spell the chord from its root (G-B-D-F), find the bass note's job, and the position names itself. The 2nd trick finds the root fastest.",
      play:()=>{[65,67,71,74].forEach(m=>MFAudio.tone(m,.9,0,.3));[64,67,72].forEach(m=>MFAudio.tone(m,1.1,1,.33));} }
  }
};
