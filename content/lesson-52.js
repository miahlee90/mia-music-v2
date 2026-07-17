/* Lesson 52 — Triads: 2nd Inversion (AEMT Book 3, Unit 13)
   Built from drafts/UNIT 13 – Lesson 52.md; AEMT3 p.84 verified by render.
   Core: invert a 1st-inversion triad again (bass 3rd moves up an octave) =
   2nd INVERSION — the 5th is ALWAYS the bottom note; the "6/4 chord";
   close-position trick: in BOTH inversions the root is the UPPER note of the 4th.
   NOTE: edit by FULL-FILE REWRITE only. */

/* flip-again lab: start from 1st inversion, tap the bass to flip once more */
function MF_L52_flip(container,fb){
  const ROUNDS=[
    {name:"C major", first:["E4","G4","C5"], second:["G4","C5","E5"]},
    {name:"G major", first:["B3","D4","G4"], second:["D4","G4","B4"]}];
  let r=0;
  container.innerHTML=`<div class="big-q l52-q" style="text-align:center"></div>
    <div class="l52-staff"></div>
    <div style="text-align:center"><button class="play l52-next" style="display:none">▶ Next chord</button></div>`;
  const q=container.querySelector(".l52-q"), holder=container.querySelector(".l52-staff"), nxt=container.querySelector(".l52-next");
  function draw(ps,label,clickable){
    Staff.render(holder,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w",label}:{p,d:"w",chord:true}),
      width:250, clickNotes:clickable,
      onNote: clickable? (i)=>{
        const R=ROUNDS[r];
        if(i===0){
          draw(R.second,"2nd inversion",false);
          R.second.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.0,.1,.32));
          fb(true,`✓ ${R.first.map(p=>p[0]).join("-")} became ${R.second.map(p=>p[0]).join("-")} — now the 5TH is the bottom note. That's 2nd inversion!`);
          r++;
          if(r<ROUNDS.length) nxt.style.display="inline-block";
          else q.textContent="Great! The chord name stayed the same — only the order changed.";
        } else { MFAudio.tone(40,.2); fb(false,"Tap the LOWEST note — that's the one that jumps up an octave."); }
      } : undefined});
  }
  function ask(){
    const R=ROUNDS[r]; nxt.style.display="none";
    q.innerHTML=`${R.name} in <b>1st inversion</b>: ${R.first.map(p=>p[0]).join("-")}. Tap the <b>lowest note</b> to move it up one octave.`;
    draw(R.first,"1st inversion",true);
  }
  nxt.onclick=()=>ask();
  ask();
}

/* three-way detective: bass first, then position (root / 1st / 2nd) */
function MF_L52_detect(container,fb){
  const ROUNDS=[
    {ps:["G4","C5","E5"], name:"C major", pos:2},
    {ps:["E4","G4","C5"], name:"C major", pos:1},
    {ps:["C4","F4","A4"], name:"F major", pos:2},
    {ps:["G4","B4","D5"], name:"G major", pos:0},
    {ps:["D4","G4","B4"], name:"G major", pos:2}];
  const POS=["Root position","1st inversion","2nd inversion"];
  let r=0, found=false, score=0;
  container.innerHTML=`<div class="big-q l52d-q" style="text-align:center"></div>
    <div class="l52d-staff"></div>
    <div class="choices chips l52d-ch" style="display:none"><button>Root position</button><button>1st inversion</button><button>2nd inversion</button></div>`;
  const q=container.querySelector(".l52d-q"), holder=container.querySelector(".l52d-staff"), ch=container.querySelector(".l52d-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great job! You identified every chord position."; holder.innerHTML=""; ch.style.display="none"; return; }
    const R=ROUNDS[r]; found=false; ch.style.display="none";
    q.innerHTML=`Tap the <b>lowest note</b> first. (Chord ${r+1} of ${ROUNDS.length})`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:220,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(found) return;
        if(i===0){ found=true; q.innerHTML=`✓ The lowest note is <b>${R.ps[0][0]}</b>. Now identify the chord position.`; ch.style.display=""; }
        else fb(false,"Go lower — the BOTTOM note runs this show.");
      }});
  }
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r];
    if(i===R.pos){ score++; MFAudio.yay();
      fb(true,`✓ ${R.ps[0][0]} is the ${["root","3rd","5th"][R.pos]} of ${R.name} → ${POS[R.pos]}.`);
      r++; setTimeout(ask,1200); }
    else { MFAudio.tone(40,.2); fb(false,`Spell ${R.name} in 3rds and find ${R.ps[0][0]}'s job: root, 3rd or 5th?`); }
  });
  ask();
}

/* keyboard builder: 2nd inversions — 5th, root, 3rd upward */
function MF_L52_build(container,fb){
  const ROUNDS=[
    {name:"C major", pcs:[7,0,4], letters:["G (the 5th — in the bass!)","C (the root)","E (the 3rd on top)"]},
    {name:"F major", pcs:[0,5,9], letters:["C (the 5th — in the bass!)","F (the root)","A (the 3rd on top)"]},
    {name:"G major", pcs:[2,7,11], letters:["D (the 5th — in the bass!)","G (the root)","B (the 3rd on top)"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l52b-q" style="text-align:center"></div>
    <div class="l52b-staff"></div><div class="l52b-kb"></div>`;
  const q=container.querySelector(".l52b-q"), sh=container.querySelector(".l52b-staff"), kh=container.querySelector(".l52b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
    const ps=got.map(m=>NAMES[m%12]+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:190});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You built all three 2nd inversion triads."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name}</b> in <b>2nd inversion</b>. Press <b>${ROUNDS[r].letters[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=3){ got.forEach(x=>MFAudio.tone(x,1.0,.1,.32));
          fb(true,`✓ ${R.name}, 2nd inversion — 5th in the bass, root in the middle, 3rd on top.`);
          r++; setTimeout(ask,1400); }
        else q.innerHTML=`Now play <b>${R.letters[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right letter — but stack UPWARD from the bass."); }
      else { MFAudio.tone(40,.2); fb(false,k===0? `Which note is the 5TH of ${R.name}? That one goes in the bass.` : "Follow the recipe: 5th, then root, then 3rd."); }
    }});
  ask();
}

LESSON_CONTENT[52]={stackFigures:true,
  welcome:"Lesson 51 flipped the chord once. Today… we flip it AGAIN! \u{2696}\u{FE0F}",
  hook:{
    say:"<b>Three C major chords — same notes, different positions.</b> Listen carefully. <b>Which chord has the 5th as the lowest note?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chord A</button>
          <button class="play hk-b">▶ Chord B</button>
          <button class="play hk-c">▶ Chord C</button></div>
          <div class="choices hk-ch" style="display:none"><button>Chord C — G, the 5th, is the lowest note</button><button>Chord A — the 5th is on the bottom</button><button>Chord B — E is the 5th</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let heard=new Set();
        const show=()=>{ if(heard.size>=3) setTimeout(()=>ch.style.display="",1200); };
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67].forEach(m=>MFAudio.tone(m,1.1,0,.33)); heard.add("a"); show(); };
        container.querySelector(".hk-b").onclick=()=>{ [64,67,72].forEach(m=>MFAudio.tone(m,1.1,0,.33)); heard.add("b"); show(); };
        container.querySelector(".hk-c").onclick=()=>{ [67,72,76].forEach(m=>MFAudio.tone(m,1.1,0,.33)); heard.add("c"); show(); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Chord C was G-C-E — the 5th (G) is the lowest note. That's 2ND INVERSION, today's lesson!");
          else fb(false,"Name each chord's bottom note, then ask: is it the root, the 3rd, or the 5th of C-E-G?");
        });
      } }
  },
  objectives:[
    "Create a 2nd inversion by inverting a 1st-inversion triad again",
    "Recognize 2nd inversion: the 5th is ALWAYS the bottom note",
    "Say the full bass ladder: root → 3rd → 5th",
    "Explain the nickname 6/4 chord",
    "Use the close-position trick: the root sits on TOP of the interval of a 4th",
    "Build 2nd-inversion triads on the staff and keyboard"
  ],
  steps:[
    { say:"<b>Quick Review:</b> In <b>root position</b>, the root is the lowest note. In <b>1st inversion</b>, the 3rd is the lowest note. \u{1F447} <b>If we invert the chord one more time, which chord tone becomes the lowest note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"root position"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"1st inversion"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"…and next?"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:480} },
      try:{ type:"mc", choices:["The 5th","The 7th","The root again"], answer:0,
        success:"✓ Root, 3rd… 5th! The bass climbs through the chord tones one flip at a time.",
        fail:"Follow the ladder: root position → 3rd in the bass → next chord tone up…",
        hint:"A triad only owns three tones: root, 3rd, 5th." } },
    { say:"Move the <b>lowest note</b> up one octave. The <b>5th</b> becomes the lowest note, creating <b>2nd INVERSION</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Tap the LOWEST note of the 1st-inversion stack.",
        mount:(container,fb)=>MF_L52_flip(container,fb) } },
    { say:"<b>2nd Inversion Rule:</b> In <b>2nd inversion</b>, the <b>5th</b> is the lowest note. The chord name does <b>not</b> change. \u{1F447} <b>G–C–E is…?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"G4",d:"w",label:"C: G-C-E"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"C4",d:"w",label:"F: C-F-A"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"D4",d:"w",label:"G: D-G-B"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:480} },
      try:{ type:"mc", choices:["C major, 2nd inversion","G major, root position","C major, 1st inversion"], answer:0,
        success:"✓ Rearranged into thirds: C-E-G. The bass G is the 5th → 2nd inversion. (G major would be G-B-D — the B gives it away.)",
        fail:"Rearrange G-C-E into thirds. What root do you get?",
        hint:"Rearrange the notes into thirds to name the chord, THEN check the lowest note." } },
    { say:"<b>Why is it called a 6/4 chord?</b> Figured bass measures intervals <b>above the bass note</b>. In <b>G–C–E</b>, C is a <b>4th</b> above G, and E is a <b>6th</b> above G. That's why this inversion is called a <b>6/4 chord</b> — the 6 written above the 4. \u{1F447} <b>The numbers in 6/4 are measured from which note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"G4",d:"w",label:"6/4"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:200} },
      try:{ type:"mc", choices:["The bass (lowest) note","The root","The top note"], answer:0,
        success:"✓ Always from the BASS. This idea grows into a whole system next lesson — figured bass!",
        fail:"6 what and 4 what? Sixth and fourth ABOVE something…",
        hint:"The same note that decides the inversion." } },
    { say:"<b>Finding the Root in Close Position:</b> In close-position inversions, look for the <b>4th</b> inside the chord. The <b>upper note of the 4th</b> is always the <b>root</b>. In E-G-C the 4th is G→C; in G-C-E it's G→C again — and C is the root both times! \u{1F447} <b>In close position, where is the root?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"G4",d:"w",label:"the 4th"},{p:"C5",d:"w"},
        {p:"E4",d:"w",label:"1st inv."},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"2nd inv."},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],
        steps:[{from:0,to:1,label:"4th"}],width:640} },
      try:{ type:"mc", choices:["on TOP of the 4th","below the 4th","outside the chord"], answer:0,
        success:"✓ Find the 4th, take its top note — that's your root and your chord name. Instant identification!",
        fail:"G up to C… which of those two is the root of C major?",
        hint:"4th = G→C here. The root is C." } },
    { say:"<b>Identify the inversion.</b> Find the <b>lowest note</b> first, then name the chord position. \u{1F447}",
      try:{ type:"custom",
        hint:"Tap the bass, spell the chord in 3rds, match the bass to root/3rd/5th.",
        mount:(container,fb)=>MF_L52_detect(container,fb) } },
    { say:"<b>Build these chords in 2nd inversion.</b> \u{1F447}",
      try:{ type:"custom",
        hint:"5th in the bass, root in the middle, 3rd on top.",
        mount:(container,fb)=>MF_L52_build(container,fb) } },
    { say:"<b>How is 2nd inversion used?</b> A <b>2nd inversion</b> chord sounds less stable than root position or 1st inversion. It is often used as a <b>passing chord</b> between stronger chords. \u{1F447} <b>A composer would most likely use a 6/4 chord to…</b>",
      try:{ type:"mc", choices:["pass smoothly between two stronger chords","end a piece with a big final chord","replace the tonic forever"], answer:0,
        success:"✓ It's a mover, not a settler. You'll hear exactly this in Lesson 55's smooth progressions.",
        fail:"Would you END a piece on a chord that feels off-balance?",
        hint:"Balancing on its 5th, the chord wants to keep walking." } }
  ],
  examples:[
    { caption:"The complete journey of one chord: C major in root position, 1st inversion, 2nd inversion — and home again an octave up. Same three letters the whole way.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"root"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"1st inv."},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"2nd inv."},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"C5",d:"w",label:"root (8va)"},{p:"E5",d:"w",chord:true},{p:"G5",d:"w",chord:true}],width:560},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"The 6/4 chord at work: I, then IV in 2nd inversion, then I. The bass never moves off C — the F chord visits while the floor stays still. (Lesson 55 builds on exactly this!)",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",label:"C (I)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"F/C (IV 6/4)"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C (I)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:480},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Three-Position Sprint (45s)",
      intro:"Root, 1st or 2nd? All three positions in the mix now — read that bass note!",
      miaIntro:"The full lineup this time! \u{1F50D}",
      spec:{gen:"inversion-id", params:{subject:"triad", ask:"position"}, seconds:45},
      result:(score)=>score>=8?score+" chords placed — three-position mastery!":null },
    { type:"key-climb", title:"Game 2 · 6/4 Ladder",
      intro:"Climb C, F and G major — each in 2nd inversion: 5th, root, 3rd!",
      miaIntro:"Nine keys, three 6/4 chords! \u{1FA9C}",
      spec:{seq:[67,72,76, 60,65,69, 62,67,71],
        names:["G (5th of C)","C (root)","E (3rd)","C (5th of F)","F (root)","A (3rd)","D (5th of G)","G (root)","B (3rd)"],
        start:60, octaves:1.3333, title:"C → F → G major, all in 2nd inversion"},
      result:(score)=>score!==null?"Three 6/4 chords climbed clean!":null },
    { type:"symbol-hunt", title:"Game 3 · Position Spotter II",
      intro:"Root, 1st and 2nd inversions on cards — click what each round names!",
      miaIntro:"Bottom note, bottom note, bottom note! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Root position (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"1st inversion (E-G-C)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"2nd inversion (G-C-E)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:150}},
        {label:"2nd inversion (C-F-A)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Spotter supreme — nothing slips by!":null },
    { type:"order-tap", title:"Game 4 · Bass-Ladder Order",
      intro:"Tap the positions of C major, then F major, in flip order — root, 1st, 2nd!",
      miaIntro:"Climb the ladder in order! \u{1FA9C}",
      spec:{sequence:["C-E-G (root)","E-G-C (1st)","G-C-E (2nd)","F-A-C (root)","A-C-F (1st)","C-F-A (2nd)"],
        title:"Tap each chord in flip order: C major first, then F major"},
      result:(stars)=>stars>=2?"The bass ladder is second nature now!":null }
  ],
  practiceIntro:"20 practice questions — all three positions, spellings, the 6/4 nickname and the 4th trick. Answer right and the next appears automatically!",
  practice:[
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:6 },
    { gen:"term-match", params:{subject:"term", pool:[["2nd inversion","the 5th is the lowest note"],["6/4 chord","another name for 2nd inversion"],["1st inversion","the 3rd is the lowest note"],["Root position","the root is the lowest note"],["The 4th trick","the root is the UPPER note of the 4th"]], reverse:true}, count:4 },
    { type:"mc", q:"To create a 2nd inversion from a 1st-inversion triad, move the ____ up one octave.", choices:["bass note (the 3rd)","top note (the root)","middle note (the 5th)"], answer:0,
      explain:"E-G-C → G-C-E: the lowest note keeps jumping." },
    { type:"mc", q:"G-C-E is which chord, in which position?", choices:["C major, 2nd inversion","G major, root position","E minor, 1st inversion"], answer:0,
      explain:"Rearrange: C-E-G — with the 5th (G) in the bass." },
    { type:"mc", q:"C-F-A is F major in…", choices:["2nd inversion","root position","1st inversion"], answer:0,
      explain:"C is the 5th of F-A-C → 2nd inversion." },
    { type:"mc", q:"Which chord tone is the lowest note in each position?", choices:["root → 3rd → 5th","root → 5th → 3rd","3rd → root → 5th"], answer:0,
      explain:"Each flip promotes the next chord tone into the bass." },
    { type:"mc", q:"In close position, the ROOT of an inverted triad is always…", choices:["the upper note of the 4th","the lower note of the 4th","the middle note"], answer:0,
      explain:"Find the 4th, take its top note — works for 1st AND 2nd inversions." },
    { type:"mc", q:"Which inversion is usually the least stable?", choices:["2nd inversion","root position","they sound identical"], answer:0,
      explain:"The 6/4 chord usually passes through rather than resting." },
    { type:"truefalse", q:"A 2nd-inversion triad has the root in the bass.", answer:false,
      explain:"The 5TH is in the bass — the root moved to the middle." },
    { type:"truefalse", q:"Changing the inversion changes the chord name.", answer:false,
      explain:"Still the same letters, still the same chord." },
    { type:"truefalse", q:"The figured-bass nickname for 2nd inversion is 6/4.", answer:true,
      explain:"A 6th and a 4th above the bass — full story in Lesson 54." },
    { type:"truefalse", q:"Every 2nd-inversion chord must be in close position.", answer:false,
      explain:"Open-position 2nd inversions exist too — the bass note still rules." }
  ],
  miaQuizIntro:"Final quiz! Three positions, one rule: the bass note tells all.",
  quiz:[
    { type:"mc", q:"Which chord tone is the LOWEST note of a 2nd-inversion triad?", choices:["The 5th","The root","The 3rd","The 7th"], answer:0,
      explain:"5th in the bass = 2nd inversion, always.", hint:"Root → 3rd → … what's next on the ladder?" },
    { type:"mc", q:"Another name for a 2nd-inversion triad is the…", choices:["6/4 chord","5/3 chord","6 chord","7 chord"], answer:0,
      explain:"6th + 4th above the bass give the nickname.", hint:"Two numbers, counted up from the bass." },
    { type:"mc", q:"Which of these is the 2nd inversion of C major?", choices:["G-C-E","C-E-G","E-G-C","C-G-E"], answer:0,
      explain:"5th (G) in the bass, root and 3rd stacked above.", hint:"Which spelling starts on the 5th?" },
    { type:"truefalse", q:"A 2nd-inversion triad has the root in the bass.", answer:false,
      explain:"That's root position. 2nd inversion floats on its 5th.", hint:"Check the ladder." },
    { type:"truefalse", q:"Changing the inversion changes the chord name.", answer:false,
      explain:"G-C-E, E-G-C, C-E-G — all C major.", hint:"Same letters, same family." },
    { type:"mc", q:"A 2nd inversion is made from a 1st inversion by…", choices:["moving the lowest note (the 3rd) up an octave","moving the highest note down an octave","adding a 4th note"], answer:0,
      explain:"The bass keeps leaping to the top, one flip at a time.", hint:"Same move as Lesson 51, applied again." },
    { type:"mc", q:"Name this chord and its position.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:200},
      choices:["F major, 2nd inversion","C major, root position","F major, 1st inversion"], answer:0,
      explain:"Rearrange: F-A-C; the bass C is the 5th → 2nd inversion.", hint:"The 4th (C→F) has the root on top." },
    { type:"mc", q:"Name this chord and its position.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:200},
      choices:["G major, 2nd inversion","D major, root position","G major, 1st inversion"], answer:0,
      explain:"G-B-D with the 5th (D) in the bass.", hint:"D→G is a 4th — root on top of it." },
    { type:"mc", q:"A student says, \u{201C}G–C–E is a G major chord because G is the lowest note.\u{201D} Why is the student incorrect?", choices:["It's C major in 2nd inversion. The bass note shows the inversion, not the chord name.","The student is right","It's E minor"], answer:0,
      explain:"Rearrange in 3rds: C-E-G. G is merely the bass on duty.", hint:"Same trap as Lesson 51 — rearrange first!" },
    { type:"mc", q:"In close position, where does the ROOT sit relative to the interval of a 4th?", choices:["It is the upper note of the 4th","It is the lower note of the 4th","It never touches the 4th"], answer:0,
      explain:"The shortcut for BOTH inversions: spot the 4th interval, grab its upper note — that's the root.", hint:"G→C in our examples… and C is the root." },
    { type:"mc", q:"Which statement is correct?", choices:["Second inversion places the 5th in the bass","Second inversion places the 3rd in the bass","Second inversion changes a major chord into minor","Every 2nd inversion is in open position"], answer:0,
      explain:"5th in the bass — the other options mix up the rules.", hint:"Today's rule, verbatim." },
    { type:"mc", q:"Why is IV in 2nd inversion used in this progression? (C → F/C → C)", choices:["So the bass could stay on C while the harmony changed","To make the chord louder","To turn F major into F minor"], answer:0,
      explain:"A still bass + moving harmony = the classic 6/4 move.", hint:"What did the bass do — or rather, NOT do?" },
    /* generated */
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["2nd inversion","5th in the bass"],["6/4 chord","2nd inversion's nickname"],["1st inversion","3rd in the bass"],["Root position","root in the bass"]], reverse:true}, count:2 },
    { gen:"triad-id", params:{ask:"root"}, count:2 }
  ],
  vocabulary:[
    {term:"2nd Inversion", def:"A triad with its 5th as the lowest note — made by inverting a 1st-inversion chord once more.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:130}},
    {term:"6/4 Chord", def:"The nickname for 2nd inversion: the intervals above the bass are a 6th and a 4th."},
    {term:"Bass Note", def:"The lowest note of a chord. It decides the POSITION — never the chord's name."},
    {term:"The 4th Trick", def:"In close position, both inversions contain an interval of a 4th — and the ROOT is always its upper note."}
  ],
  mistakes:[],
  summary:[
    "✔ Flip a 1st-inversion triad again and you get <b>2nd inversion: the 5th is ALWAYS the bottom note</b> (C-E-G → E-G-C → G-C-E).",
    "✔ The bass ladder: <b>root → 3rd → 5th</b>. Three tones, three positions.",
    "✔ 2nd inversion's nickname is the <b>6/4 chord</b> — a 6th and a 4th above the bass.",
    "✔ Close-position shortcut: <b>the root is the upper note of the 4th</b> in BOTH inversions.",
    "✔ The 6/4 chord is a <b>passing, less-stable</b> sound — it moves on rather than settling."
  ],
  tips:[
    "Fast ID at a glance: root position = even stack; 1st inversion = gap on top; 2nd inversion = gap at the BOTTOM (the 4th sits between the two lowest notes).",
    "Piano drill: play C-E-G → E-G-C → G-C-E → C-E-G an octave up. Do it in F and G too — you just played every triad position that exists.",
    "Hear it: 2nd inversion sounds unstable — beautiful, but ready to move on.",
    "Lesson 53 asks the big question: a V7 chord has FOUR notes… so how many inversions can IT have?"
  ],
  rewards:{ badge:"6/4 Master", icon:"\u{2696}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Root, 1st, 2nd — you own every position of the triad! \u{2696}\u{FE0F}\u{1F389}",
  miaPass:"Passed! The 5th-in-the-bass rule is locked in. Lesson 53 inverts a FOUR-note chord…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Chord A = C-E-G (root), B = E-G-C (1st inversion), C = G-C-E — the 5th in the bass: 2nd inversion.",
      play:()=>{[67,72,76].forEach(m=>MFAudio.tone(m,1,0,.33));} },
    learn:{ label:"2nd inversion",
      explain:"Flip a 1st inversion again: the 3rd leaves the bass and the 5th takes over. Nickname: 6/4 chord. Close-position trick: the root tops the interval of a 4th.",
      hint:"Bass ladder: root → 3rd → 5th.",
      play:()=>{[67,72,76].forEach(m=>MFAudio.tone(m,1,.1,.33));} },
    example:{ label:"the examples",
      explain:"Example 1 walks one chord through all three positions; example 2 parks the bass on C while IV visits in 2nd inversion." },
    game:{ label:"the games",
      explain:"Sprint all three positions, climb the 6/4 ladder, spot positions on cards, then tap the flip order.",
      hint:"The gap in the stack tells you where the 4th is." },
    quiz:{ label:"this question",
      explain:"Rearrange the letters in 3rds for the NAME; match the bass to root/3rd/5th for the POSITION. The 4th trick speeds everything up.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.7,0,.33));[64,67,72].forEach(m=>MFAudio.tone(m,.7,.8,.33));[67,72,76].forEach(m=>MFAudio.tone(m,.9,1.6,.33));} }
  }
};
