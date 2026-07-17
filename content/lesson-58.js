/* Lesson 58 — Minor Triads (AEMT Book 3, Unit 14)
   Built from drafts/UNIT 14 – Lesson 58.md; AEMT3 p.92 verified by render.
   Core: minor triad = root + minor 3rd + Perfect 5th (built from 1-3-5 of the
   minor scale); any major triad → minor by LOWERING THE 3RD a half step;
   stacking: major = M3+m3, minor = m3+M3; in a major key, triads on
   2-3-6 are minor (ii, iii, vi — lowercase numerals), 1-4-5 major.
   NOTE: edit by FULL-FILE REWRITE only. */

/* morph lab: tap the 3rd of a major triad to melt it into minor */
function MF_L58_morph(container,fb){
  const ROUNDS=[
    {name:"C", maj:["C4","E4","G4"], min:["C4","Eb4","G4"], newP:"E♭"},
    {name:"G", maj:["G4","B4","D5"], min:["G4","Bb4","D5"], newP:"B♭"},
    {name:"F", maj:["F4","A4","C5"], min:["F4","Ab4","C5"], newP:"A♭"}];
  let r=0;
  container.innerHTML=`<div class="big-q l58m-q" style="text-align:center"></div>
    <div class="l58m-staff"></div>
    <div style="text-align:center"><button class="play l58m-next" style="display:none">▶ Next chord</button></div>`;
  const q=container.querySelector(".l58m-q"), holder=container.querySelector(".l58m-staff"), nxt=container.querySelector(".l58m-next");
  function draw(ps,label,clickable){
    Staff.render(holder,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w",label}:{p,d:"w",chord:true}),
      width:240, clickNotes:clickable,
      onNote: clickable? (i)=>{
        const R=ROUNDS[r];
        if(i===1){
          draw(R.min, R.name+" minor", false);
          R.min.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.1,.1,.32));
          fb(true,`✓ Excellent! You changed ${R.name} major into ${R.name} minor — the 3rd was lowered to ${R.newP}. The root and 5th stayed the same.`);
          r++;
          if(r<ROUNDS.length) nxt.style.display="inline-block";
          else q.textContent="Excellent! You changed each major triad into a minor triad.";
        } else { MFAudio.tone(40,.2); fb(false, i===0? "That's the root — it stays the same. Tap the 3rd, the middle note." : "That's the 5th — it stays the same too. Tap the 3rd."); }
      } : undefined});
  }
  function ask(){
    const R=ROUNDS[r]; nxt.style.display="none";
    q.innerHTML=`${R.name} major (${R.maj.map(p=>p.replace(/\d/,"").replace("b","♭").replace("#","♯")).join("-")}). Lower the 3rd — tap the note that changes.`;
    draw(R.maj, R.name+" major", true);
  }
  nxt.onclick=()=>ask();
  ask();
}

/* keyboard builder: minor triads by half-step counting */
function MF_L58_build(container,fb){
  const ROUNDS=[
    {name:"D minor", pcs:[2,5,9], names:["D (root)","F (m3 — 3 half steps up)","A (P5 — 7 half steps up)"]},
    {name:"A minor", pcs:[9,0,4], names:["A (root)","C (m3)","E (P5)"]},
    {name:"C minor", pcs:[0,3,7], names:["C (root)","E♭ (m3 — a black key!)","G (P5)"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l58b-q" style="text-align:center"></div>
    <div class="l58b-staff"></div><div class="l58b-kb"></div>`;
  const q=container.querySelector(".l58b-q"), sh=container.querySelector(".l58b-staff"), kh=container.querySelector(".l58b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",3:"Eb",4:"E",5:"F",7:"G",9:"A",10:"Bb",11:"B"};
    const ps=got.map(m=>NAMES[m%12]+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:190});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You built three minor triads."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name}</b>. Press <b>${ROUNDS[r].names[0].split(" ")[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=3){ got.forEach(x=>MFAudio.tone(x,1.1,.1,.32));
          fb(true,`✓ ${R.name}: root + minor 3rd + Perfect 5th.`);
          r++; setTimeout(ask,1400); }
        else q.innerHTML=`Now play <b>${R.names[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right key, wrong direction — build UPWARD."); }
      else { MFAudio.tone(40,.2); fb(false,k===1? "Count 3 half steps up from the root — that's the MINOR 3rd." : k===2? "The 5th is 7 half steps above the root — same as in major!" : "Start on the root."); }
    }});
  ask();
}

/* ear lab: major or minor? */
function MF_L58_ear(container,fb){
  const ROUNDS=[
    {midis:[62,65,69], minor:true, name:"D minor"},
    {midis:[65,69,72], minor:false, name:"F major"},
    {midis:[60,63,67], minor:true, name:"C minor"},
    {midis:[67,71,74], minor:false, name:"G major"}];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l58e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l58e-play">▶ Play the mystery chord</button></div>
    <div class="choices chips l58e-ch" style="display:none"><button>Major</button><button>Minor</button></div>`;
  const q=container.querySelector(".l58e-q"), pl=container.querySelector(".l58e-play"), ch=container.querySelector(".l58e-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You identified every chord."; pl.style.display="none"; ch.style.display="none"; return; }
    played=false; ch.style.display="none";
    q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: is this chord major or minor?`;
  }
  pl.onclick=()=>{ const R=ROUNDS[r]; if(!R) return;
    R.midis.forEach(m=>MFAudio.tone(m,1.2,0,.32)); played=true;
    setTimeout(()=>ch.style.display="",900); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const R=ROUNDS[r];
    if((i===1)===R.minor){ MFAudio.yay(); fb(true,`✓ ${R.name} — the 3rd is ${R.minor?"minor":"major"}.`);
      r++; setTimeout(ask,1200); }
    else { MFAudio.tone(40,.2); fb(false,"Listen again to the 3rd — is it major or minor?"); }
  });
  ask();
}

LESSON_CONTENT[58]={
  welcome:"Major or minor? The difference is just one note. \u{1F311}",
  hook:{
    say:"<b>These two chords have the same root.</b> Listen carefully. <b>Which one is minor, and what changed?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chord A</button>
          <button class="play hk-b">▶ Chord B</button></div>
          <div class="choices hk-ch" style="display:none"><button>B is minor — its 3rd was lowered a half step</button><button>B is minor — it removed the top note</button><button>A is minor — it's the darker one</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67].forEach(m=>MFAudio.tone(m,1.2,0,.33)); hA=true; if(hB) setTimeout(()=>ch.style.display="",1400); };
        container.querySelector(".hk-b").onclick=()=>{ [60,63,67].forEach(m=>MFAudio.tone(m,1.2,0,.33)); hB=true; if(hA) setTimeout(()=>ch.style.display="",1400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ E was lowered to E♭ — the 3rd changed, and C major became C minor. The root and 5th stayed the same. Today: minor triads!");
          else fb(false,"Both chords kept the same root and 5th. Listen to the 3rd — the middle note.");
        });
      } }
  },
  objectives:[
    "Define a minor triad: root + minor 3rd + Perfect 5th",
    "Convert any major triad to minor by lowering the 3rd a half step",
    "Stack it: minor triad = m3 below + M3 on top",
    "Find the minor triads inside a major key: ii, iii, vi",
    "Write minor chords with lowercase numerals and letter symbols (Cm)",
    "Recognize major vs minor by sight and by ear"
  ],
  steps:[
    { say:"<b>Major vs. Minor Triads:</b> Both major and minor triads have the same <b>root</b> and <b>perfect 5th</b>. The only difference is the <b>3rd</b>. \u{1F447} <b>Which chord tone makes a major triad different from a minor triad?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"C major: M3 + P5"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C minor: m3 + P5"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:420} },
      try:{ type:"mc", choices:["The 3rd","The root","The 5th"], answer:0,
        success:"✓ The 3rd: 4 half steps above the root = major, 3 half steps = minor. The root and 5th are the same in both.",
        fail:"Compare the two spellings note by note…",
        hint:"C-E-G vs C-E♭-G." } },
    { say:"<b>Changing Major to Minor:</b> Lower the <b>3rd</b> by a half step. The root and the 5th stay the same. <b>Remember: lowering the 3rd changes a major triad into a minor triad.</b> \u{1F447} <b>Change the major triad into a minor triad:</b>",
      try:{ type:"custom",
        hint:"The 3rd is the middle note.",
        mount:(container,fb)=>MF_L58_morph(container,fb) } },
    { say:"<b>Building a Minor Triad:</b> A minor triad is built with a <b>minor 3rd</b>, followed by a <b>Major 3rd</b>. \u{1F447} <b>Which interval is placed on top?</b>",
      try:{ type:"mc", choices:["A Major 3rd","A minor 3rd","A Perfect 5th"], answer:0,
        success:"✓ The minor 3rd is on the bottom (C→E♭); the Major 3rd is on top (E♭→G).",
        fail:"The minor 3rd sits at the BOTTOM — so what is on top?",
        hint:"m3 below, M3 above." } },
    { say:"Build three minor triads. \u{1F447}",
      try:{ type:"custom",
        hint:"Root, +3 half steps, +7 half steps.",
        mount:(container,fb)=>MF_L58_build(container,fb) } },
    { say:"<b>Minor Triads in a Major Key:</b> In a major scale, <b>I, IV, V are major</b> and <b>ii, iii, vi are minor</b>. \u{1F447} <b>Which triads are naturally minor in C major?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii = Dm"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"iii = Em"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi = Am"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:660} },
      try:{ type:"mc", choices:["D minor, E minor, A minor","C, F and G","B diminished only"], answer:0,
        success:"✓ ii=Dm, iii=Em, vi=Am — minor chords living INSIDE the major key, no accidentals needed. (Degree 7 is a special case — next lesson!)",
        fail:"Count the degrees: 2, 3 and 6 of C major are D, E and A…",
        hint:"Degrees 2-3-6 go minor." } },
    { say:"<b>Chord Symbols:</b> Minor triads use <b>lowercase Roman numerals</b> and a lowercase <b>m</b> in letter names (Dm, Em, Am). \u{1F447} <b>How is the triad built on degree 6 written?</b>",
      try:{ type:"mc", choices:["vi (A minor)","VI (A major)","6+"], answer:0,
        success:"✓ Lowercase vi, letter symbol Am. The case of the numeral IS the quality badge.",
        fail:"Degree 6 builds a MINOR chord — which case shows that?",
        hint:"Small chord feeling, small letters." } },
    { say:"<b>Listen Carefully:</b> Is the chord <b>major</b> or <b>minor</b>? \u{1F447}",
      try:{ type:"custom",
        hint:"Bright middle = major; clouded middle = minor.",
        mount:(container,fb)=>MF_L58_ear(container,fb) } }
  ],
  examples:[
    { caption:"C major, then C minor: the 3rd is lowered one half step. Then G major and G minor — watch the keyboard as each pair plays.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"Cm"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"G4",d:"w",label:"G"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"G4",d:"w",label:"Gm"},{p:"Bb4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:560},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"The minor residents of C major: ii, iii and vi — Dm, Em, Am — played in a row, then resolved home to I. All white keys; the minors were hiding in plain sight.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"iii"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Major/Minor Sprint (45s)",
      intro:"Chords flash by — call each one major or minor by its 3rd!",
      miaIntro:"Watch the middle note! \u{26A1}",
      spec:{gen:"triad-quality", params:{quals:["M","m"]}, seconds:45},
      result:(score)=>score>=8?score+" chords judged — quality control expert!":null },
    { type:"key-climb", title:"Game 2 · Minor Triad Ladder",
      intro:"Climb D minor, A minor and C minor — root, minor 3rd, perfect 5th!",
      miaIntro:"Three minor triads! \u{1FA9C}",
      spec:{seq:[62,65,69, 69,72,76, 60,63,67],
        names:["D (root)","F (m3)","A (P5)","A (root)","C (m3)","E (P5)","C (root)","E♭ (m3 — black key!)","G (P5)"],
        start:60, octaves:1.3333, title:"Dm → Am → Cm, note by note"},
      result:(score)=>score!==null?"Three minors under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · m or Not?",
      intro:"Major and minor triads on cards — click the symbol each round calls!",
      miaIntro:"The flat in the middle is the clue! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"C (major)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Cm (minor)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Gm (minor)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"Bb4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"Dm (minor — no accidental!)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No quality escapes your eye!":null },
    { type:"term-race", title:"Game 4 · Minor-Triad Fact Race",
      intro:"Recipes, conversions and the ii-iii-vi map — at speed!",
      miaIntro:"Everything minor triads! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Minor triad","root + minor 3rd + Perfect 5th"],
        ["Major → minor","lower the 3rd a half step"],
        ["Minor stacking","m3 with a M3 on top"],
        ["Minor 3rd","3 half steps above the root"],
        ["Perfect 5th","7 half steps above the root"],
        ["ii, iii, vi in a major key","the naturally minor triads"],
        ["Lowercase numerals","how minor triads are labeled"],
        ["Cm","the letter symbol for C minor"]]},
      result:(score)=>score>=6?"Fact-perfect on minor triads!":null }
  ],
  practiceIntro:"20 practice questions — building, changing and finding minor triads. Answer right and the next appears automatically!",
  practice:[
    { gen:"triad-quality", params:{quals:["M","m"]}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"], ask:"symbol"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Minor triad","root + m3 + P5"],["Quality","a chord's sound character"],["Minor 3rd","3 half steps"],["Perfect 5th","7 half steps"],["ii iii vi","minor triads in a major key"]], reverse:true}, count:3 },
    { type:"mc", q:"A minor triad consists of…", choices:["root, minor 3rd, Perfect 5th","root, Major 3rd, Perfect 5th","root, minor 3rd, diminished 5th"], answer:0,
      explain:"Only the 3rd differs from major." },
    { type:"mc", q:"To change C major (C-E-G) into C minor…", choices:["lower E to E♭","raise G to G♯","lower C to B"], answer:0,
      explain:"Lower the 3rd a half step — the universal converter." },
    { type:"mc", q:"D minor is spelled…", choices:["D-F-A","D-F♯-A","D-G-A"], answer:0,
      explain:"White keys only: m3 (D→F) + P5 (D→A)." },
    { type:"mc", q:"Which scale degrees form minor triads in a major key?", choices:["2nd, 3rd and 6th","1st, 4th and 5th","only the 7th"], answer:0,
      explain:"ii, iii, vi — lowercase for a reason." },
    { type:"mc", q:"What is the correct chord symbol for G minor?", choices:["Gm","G−","gm7"], answer:0,
      explain:"Chord letter + small m." },
    { type:"truefalse", q:"The root and 5th change when a triad turns minor.", answer:false,
      explain:"They stay — only the 3rd falls." },
    { type:"truefalse", q:"A minor triad stacks a minor 3rd below and a Major 3rd above.", answer:true,
      explain:"The mirror of major's recipe." },
    { type:"truefalse", q:"In C major, the triad on scale degree 6 is A minor.", answer:true,
      explain:"A-C-E: vi." },
    { type:"truefalse", q:"Minor triads always need accidentals.", answer:false,
      explain:"Dm, Em, Am live in C major on white keys alone." }
  ],
  miaQuizIntro:"Quiz! Keep your eye — and ear — on the 3rd.",
  quiz:[
    { type:"mc", q:"A minor triad consists of a root, a…", choices:["minor 3rd and Perfect 5th","Major 3rd and Perfect 5th","minor 3rd and diminished 5th","Major 3rd and Augmented 5th"], answer:0,
      explain:"m3 + P5 — the definition.", hint:"One word differs from major's recipe." },
    { type:"mc", q:"How do you change a major triad into a minor triad?", choices:["Lower the 3rd a half step","Raise the root","Lower the 5th a half step"], answer:0,
      explain:"One half step in the middle changes everything.", hint:"The morph lab move." },
    { type:"mc", q:"The minor 3rd above C is…", choices:["E♭","E","D"], answer:0,
      explain:"3 half steps: C→D♭→D→E♭.", hint:"Count 3 half steps." },
    { type:"truefalse", q:"Major and minor triads share the same root and 5th.", answer:true,
      explain:"Only the 3rd tells them apart.", hint:"What stayed put in the morphs?" },
    { type:"truefalse", q:"A minor triad is built m3 + M3 from the bottom up.", answer:true,
      explain:"Small then big — the flip of major.", hint:"Bottom interval = quality." },
    { type:"mc", q:"Which scale degrees naturally form minor triads in a major key?", choices:["2nd, 3rd, 6th","1st, 4th, 5th","5th and 7th"], answer:0,
      explain:"ii, iii, vi.", hint:"The treasure-map step." },
    { type:"mc", q:"In C major, the triad built on E (degree 3) is written…", choices:["iii (E minor)","III (E major)","iii° (E diminished)"], answer:0,
      explain:"E-G-B = minor → lowercase iii.", hint:"Spell E-G-B and check its 3rd." },
    { type:"mc", q:"Identify this triad.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:200},
      choices:["D minor","D major","F major"], answer:0,
      explain:"D→F is only 3 half steps: minor 3rd → Dm.", hint:"No accidentals needed to be minor!" },
    { type:"mc", q:"Identify this triad.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"Bb4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:200},
      choices:["G minor","G major","B♭ major"], answer:0,
      explain:"The ♭ pulled the 3rd down: Gm.", hint:"What did the flat do to the middle note?" },
    { type:"mc", q:"What do lowercase Roman numerals represent?", choices:["minor triads","loud passages","inversions"], answer:0,
      explain:"Case = quality: I major, ii minor.", hint:"Case = quality: uppercase major, lowercase minor." },
    { type:"mc", q:"A song alternates C → Am → F → G. The Am chord is…", choices:["the vi chord of C major","the ii chord","a mistake — Am isn't in C major"], answer:0,
      explain:"A minor lives on degree 6 — the most famous pop loop in history uses it.", hint:"A = which degree of C?" },
    { type:"mc", q:"Which is the best ear clue for a minor triad?", choices:["The 3rd sounds lower than it does in a major triad","The chord is quieter","The chord is shorter"], answer:0,
      explain:"The lowered 3rd is the defining sound of a minor triad.", hint:"What did you listen for in the ear lab?" },
    /* generated */
    { gen:"triad-quality", params:{quals:["M","m"]}, count:4 },
    { gen:"triad-quality", params:{quals:["M","m"], ask:"symbol"}, count:2 },
    { gen:"rel-key", params:{ask:"both"}, count:2 }
  ],
  vocabulary:[
    {term:"Minor Triad", def:"Root + minor 3rd + Perfect 5th. Built from degrees 1-3-5 of a minor scale.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Chord Quality", def:"The sound character of a chord — decided by the intervals above its root."},
    {term:"Minor 3rd", def:"3 half steps above the root — the note that makes minor minor."},
    {term:"ii · iii · vi", def:"The naturally minor triads of every major key (Dm, Em, Am in C major) — lowercase numerals."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Minor triad = root + minor 3rd + Perfect 5th</b> (1-3-5 of the minor scale).",
    "✔ Convert: <b>lower the 3rd a half step</b> — root and 5th never move.",
    "✔ Stacking: minor = <b>m3 + M3</b>; major = M3 + m3. Same P5 frame.",
    "✔ Inside every major key: <b>ii, iii, vi are minor</b> (Dm, Em, Am in C) — no accidentals needed.",
    "✔ Labels: <b>lowercase numerals</b> and letter+m (Cm, Gm)."
  ],
  tips:[
    "Piano shortcut: play any major triad, slide the middle finger down one key (mind the black keys!) — instant minor.",
    "D-F-A and E-G-B and A-C-E are minor WITHOUT accidentals — spelling alone doesn't reveal quality. Count the bottom 3rd!",
    "The C-Am-F-G loop powers thousands of songs — now you know why the Am feels like the 'sad corner' of the pattern.",
    "Next lesson the 5th finally gets its turn to move: stretch it for AUGMENTED, shrink it for DIMINISHED."
  ],
  rewards:{ badge:"Shade Mixer", icon:"\u{1F311}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Major and minor hold no secrets from you now. \u{1F311}\u{1F389}",
  miaPass:"Passed! The 3rd is your quality compass. Two wilder chords await in Lesson 59…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Chord A was C-E-G (major); chord B lowered the middle note to E♭ — C minor. One half step, total mood change.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.9,0,.33));[60,63,67].forEach(m=>MFAudio.tone(m,1.2,1.1,.33));} },
    learn:{ label:"minor triads",
      explain:"m3 + P5 from the root; or take major and drop the 3rd a half step. In any major key, ii/iii/vi come out minor automatically.",
      hint:"3 half steps up = m3; 7 = P5.",
      play:()=>{[62,65,69].forEach(m=>MFAudio.tone(m,1.1,.1,.33));} },
    example:{ label:"the examples",
      explain:"Example 1 morphs C→Cm and G→Gm; example 2 tours the minor residents of C major (ii, iii, vi) and comes home to I." },
    game:{ label:"the games",
      explain:"Sprint qualities, climb three minor triads, spot the m-chords, then race the facts.",
      hint:"A lowered 3rd = minor." },
    quiz:{ label:"this question",
      explain:"Everything is the 3rd: 4 half steps = major, 3 = minor. And in a major key, degrees 2-3-6 build minor automatically.",
      play:()=>{[60,63,67].forEach(m=>MFAudio.tone(m,1.1,0,.33));} }
  }
};
