/* Lesson 63 — Modes Related to the Minor Scale: Aeolian, Dorian, Phrygian, Locrian
   (AEMT Book 3, Unit 15 FINALE) — from drafts/UNIT 15 – Lesson 63.md; AEMT3 p.99.
   Core: four modes relate to the NATURAL MINOR scale. Aeolian = natural minor;
   Dorian = minor with the 6th RAISED; Phrygian = minor with the 2nd LOWERED;
   Locrian = minor with the 2nd AND 5th lowered (not used in ancient times,
   only occasional in modern music).
   NOTE: edit by FULL-FILE REWRITE only. */

/* spot-the-bent-note vs natural minor */
function MF_L63_spot(container,fb){
  const NAT=["A","B","C","D","E","F","G","A"];
  const ROUNDS=[
    {name:"A Dorian", ps:["A3","B3","C4","D4","E4","F#4","G4","A4"], idxs:[5],
      expl:"Degree 6 lifted: F→F♯. Dorian = natural minor with the 6th RAISED a half step."},
    {name:"A Phrygian", ps:["A3","Bb3","C4","D4","E4","F4","G4","A4"], idxs:[1],
      expl:"Degree 2 dropped: B→B♭. Phrygian = natural minor with the 2nd LOWERED a half step."},
    {name:"A Locrian", ps:["A3","Bb3","C4","D4","Eb4","F4","G4","A4"], idxs:[1,4],
      expl:"TWO changes: ♭2 (B♭) and ♭5 (E♭). Locrian = natural minor with the 2nd AND 5th lowered — the rarely used one."}];
  let r=0, found=[];
  container.innerHTML=`<div class="big-q l63s-q" style="text-align:center"></div>
    <div class="l63s-staff"></div>
    <div style="text-align:center"><button class="play l63s-hear">▶ Hear it</button></div>`;
  const q=container.querySelector(".l63s-q"), holder=container.querySelector(".l63s-staff"), hear=container.querySelector(".l63s-hear");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You found every changed note."; holder.innerHTML=""; hear.style.display="none"; return; }
    const R=ROUNDS[r]; found=[];
    q.innerHTML=`Compare with A natural minor. This is <b>${R.name}</b> — tap the ${R.idxs.length===1?"changed note":"TWO changed notes"}.`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,i)=>({p,d:"q",label:String(i+1)})),width:520,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        const R2=ROUNDS[r];
        if(R2.idxs.includes(i)&&!found.includes(i)){
          found.push(i);
          if(found.length>=R2.idxs.length){ MFAudio.yay(); fb(true,`✓ ${R2.expl}`);
            r++; setTimeout(ask,1600); }
          else { MFAudio.yay(); q.innerHTML=`✓ One found! There is one more changed note.`; }
        }
        else if(R2.idxs.includes(i)) q.innerHTML="You found that one already — where's the other?";
        else fb(false,`Degree ${i+1} matches natural minor (${NAT[i]}). Look for the accidentals.`);
      }});
  }
  hear.onclick=()=>{ const R=ROUNDS[r]; if(!R) return;
    R.ps.forEach((p,i)=>MFAudio.tone(MFAudio.midi(p),.42,i*.3,.4)); };
  ask();
}

/* keyboard builder: A Dorian and A Phrygian */
function MF_L63_build(container,fb){
  const ROUNDS=[
    {name:"A Dorian", pcs:[9,11,0,2,4,6,7,9], hintNote:"F♯ (the raised 6th)",
      names:["A","B","C","D","E","F♯ — the raised 6th!","G","A"]},
    {name:"A Phrygian", pcs:[9,10,0,2,4,5,7,9], hintNote:"B♭ (the lowered 2nd)",
      names:["A","B♭ — the lowered 2nd!","C","D","E","F","G","A"]}];
  let r=0,k=0,last=null;
  container.innerHTML=`<div class="big-q l63b-q" style="text-align:center"></div><div class="l63b-kb"></div>`;
  const q=container.querySelector(".l63b-q"), kh=container.querySelector(".l63b-kb");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You played both modes."; return; }
    k=0; last=null;
    q.innerHTML=`Play <b>${ROUNDS[r].name}</b>, bottom to top, starting on A. Watch for <b>${ROUNDS[r].hintNote}</b>.`;
  }
  Keyboard.create(kh,{start:57,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; k++;
        if(k>=8){ MFAudio.yay();
          fb(true,`✓ ${R.name} complete — ${r===0?"the 6th is raised (F♯).":"the 2nd is lowered (B♭)."}`);
          r++; setTimeout(ask,1400); }
        else q.innerHTML=`Now play <b>${R.names[k]}</b>.`;
      } else { MFAudio.tone(40,.2);
        fb(false, R.pcs[k]===6? "Degree 6 is RAISED — the black key F♯." : R.pcs[k]===10? "Degree 2 is LOWERED — the black key B♭." : "Follow A natural minor's letters — only one degree is bent."); }
    }});
  ask();
}

LESSON_CONTENT[63]={
  welcome:"Four modes based on the natural minor scale. \u{1F3FA}",
  hook:{
    say:"<b>These modes are all based on the natural minor scale.</b> Listen to A natural minor, then to A Phrygian. <b>Can you hear how they sound different?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Scale 1 (natural minor)</button>
          <button class="play hk-b">▶ Scale 2 (A Phrygian)</button></div>
          <div class="choices hk-ch" style="display:none"><button>Scale 2 lowered its 2nd note</button><button>Scale 2 raised its 7th note</button><button>They're the same</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [57,59,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.42,i*.3,.4)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2900); };
        container.querySelector(".hk-b").onclick=()=>{ [57,58,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.42,i*.3,.4)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2900); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ B was lowered to B♭ — the 2nd degree — and A natural minor became A PHRYGIAN. Today: the four modes based on the natural minor scale.");
          else fb(false,"The change happens immediately — listen to the second note.");
        });
      } }
  },
  objectives:[
    "Know the four minor-related modes: Aeolian, Dorian, Phrygian, Locrian",
    "Aeolian = the natural minor scale itself",
    "Dorian = natural minor with the 6th RAISED a half step",
    "Phrygian = natural minor with the 2nd LOWERED a half step",
    "Locrian = natural minor with the 2nd AND 5th lowered — rare, modern-only",
    "Recognize and build the minor modes by sight, sound and touch"
  ],
  steps:[
    { say:"<b>Aeolian Mode:</b> <b>Aeolian</b> is the <b>natural minor scale</b>. It uses the same notes and sounds exactly the same. \u{1F447} <b>How is Aeolian different from the natural minor scale?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"A3",d:"q",label:"1"},{p:"B3",d:"q",label:"2"},{p:"C4",d:"q",label:"3"},{p:"D4",d:"q",label:"4"},
        {p:"E4",d:"q",label:"5"},{p:"F4",d:"q",label:"6"},{p:"G4",d:"q",label:"7"},{p:"A4",d:"q",label:"8"}],width:520} },
      try:{ type:"mc", choices:["Nothing — same scale, Greek name","One flat","The direction it's played"], answer:0,
        success:"✓ Aeolian = natural minor, exactly. The remaining three are natural minor with small changes.",
        fail:"Like Ionian and major — it's a rename.",
        hint:"Natural minor — no altered degrees." } },
    { say:"<b>Dorian Mode:</b> Dorian is a <b>natural minor scale with a raised 6th</b>. \u{1F447} <b>Which note is raised in A Dorian?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"A3",d:"q",label:"1"},{p:"B3",d:"q",label:"2"},{p:"C4",d:"q",label:"3"},{p:"D4",d:"q",label:"4"},
        {p:"E4",d:"q",label:"5"},{p:"F#4",d:"q",label:"♯6"},{p:"G4",d:"q",label:"7"},{p:"A4",d:"q",label:"8"}],width:520} },
      try:{ type:"mc", choices:["F♯","G♯","B♭"], answer:0,
        success:"✓ F♯ — and note the difference: melodic minor raises 6 AND 7, but Dorian raises ONLY the 6th, in both directions.",
        fail:"Degree 6 of A minor is F. Raise it…",
        hint:"Count to the 6th letter from A." } },
    { say:"<b>Phrygian Mode:</b> Phrygian is a <b>natural minor scale with a lowered 2nd</b>. The half step between <b>1 and ♭2</b> gives Phrygian its unique sound. \u{1F447} <b>Which interval makes Phrygian easy to recognize?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"A3",d:"q",label:"1"},{p:"Bb3",d:"q",label:"♭2"},{p:"C4",d:"q",label:"3"},{p:"D4",d:"q",label:"4"},
        {p:"E4",d:"q",label:"5"},{p:"F4",d:"q",label:"6"},{p:"G4",d:"q",label:"7"},{p:"A4",d:"q",label:"8"}],width:520} },
      try:{ type:"mc", choices:["1 → ♭2, right at the start","6 → 7 at the top","3 → 4 in the middle"], answer:0,
        success:"✓ The half step comes on the very first move: 1 → ♭2 (A→B♭). No other mode starts this way.",
        fail:"Where does the changed note appear — early or late in the scale?",
        hint:"The second note." } },
    { say:"<b>Locrian Mode:</b> Locrian is a <b>natural minor scale with a lowered 2nd and lowered 5th</b>. Because its tonic chord is <b>diminished</b>, it is used much less often than the other modes. \u{1F447} <b>Why is Locrian used less often?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"A3",d:"q",label:"1"},{p:"Bb3",d:"q",label:"♭2"},{p:"C4",d:"q",label:"3"},{p:"D4",d:"q",label:"4"},
        {p:"Eb4",d:"q",label:"♭5"},{p:"F4",d:"q",label:"6"},{p:"G4",d:"q",label:"7"},{p:"A4",d:"q",label:"8"}],width:520} },
      try:{ type:"mc", choices:["Its tonic chord is diminished, so it has no stable home","It has too many notes","It's too cheerful"], answer:0,
        success:"✓ Its tonic triad (1, ♭3, ♭5) is diminished — there is no stable place to rest, so Locrian is rarely used.",
        fail:"What quality is a triad with a lowered 5th?",
        hint:"A-C-E♭…" } },
    { say:"Compare each mode with the natural minor scale. <b>Which notes are different?</b> \u{1F447}",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:320px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Mode</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Compared with Natural Minor</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Aeolian</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">no changes</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Dorian</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">♯6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Phrygian</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">♭2</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Locrian</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">♭2, ♭5</td></tr></table>` },
      try:{ type:"custom",
        hint:"Compare with A natural minor: A B C D E F G A.",
        mount:(container,fb)=>MF_L63_spot(container,fb) } },
    { say:"Play each mode and compare the sound. \u{1F447}",
      try:{ type:"custom",
        hint:"Dorian: one black key at degree 6. Phrygian: one black key at degree 2.",
        mount:(container,fb)=>MF_L63_build(container,fb) } },
    { say:"<b>Review:</b> <b>Ionian, Lydian, and Mixolydian</b> are based on the <b>major scale</b>. <b>Aeolian, Dorian, Phrygian, and Locrian</b> are based on the <b>natural minor scale</b>. \u{1F447} <b>Which mode has a raised 4th?</b>",
      try:{ type:"mc", choices:["Lydian — a major-family mode","Dorian — a minor-family mode","No mode raises the 4th"], answer:0,
        success:"✓ Lydian (♯4) belongs to the major family. The minor family's changes are ♯6 (Dorian), ♭2 (Phrygian), and ♭2+♭5 (Locrian).",
        fail:"Which mode did you learn in the previous lesson with a raised 4th?",
        hint:"A major-family mode." } }
  ],
  examples:[
    { caption:"The four minor-related modes on A: Aeolian (no changes), Dorian (♯6), Phrygian (♭2), Locrian (♭2 and ♭5).",
      staff:{clef:"treble",tempo:120,notes:[
        {p:"A3",d:"q",label:"Aeolian"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{bar:"double"},
        {p:"A3",d:"q",label:"Dorian"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"q"},{bar:"double"},
        {p:"A3",d:"q",label:"Phrygian"},{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{bar:"double"},
        {p:"A3",d:"q",label:"Locrian"},{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{bar:"final"}],width:780},
      kb:{start:57,octaves:1.1667,labels:true} },
    { caption:"The white-key origins: D to D gives Dorian, E to E gives Phrygian, B to B gives Locrian — each white-key octave is a mode.",
      staff:{clef:"treble",tempo:120,notes:[
        {p:"D4",d:"q",label:"D→D: Dorian"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{bar:"double"},
        {p:"E4",d:"q",label:"E→E: Phrygian"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q"},{bar:"double"},
        {p:"B3",d:"q",label:"B→B: Locrian"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{bar:"final"}],width:680},
      kb:{start:57,octaves:1.5833,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Minor-Mode Sprint (45s)",
      intro:"Aeolian, Dorian, Phrygian, Locrian — name them from staff or recipe!",
      miaIntro:"♯6, ♭2, or ♭2+♭5! \u{26A1}",
      spec:{gen:"mode-id", params:{set:"minor", ask:"both"}, seconds:45},
      result:(score)=>score>=8?score+" minor modes conquered!":null },
    { type:"key-climb", title:"Game 2 · Dorian & Phrygian Climb",
      intro:"Play A Dorian, then A Phrygian!",
      miaIntro:"Raised 6th, then lowered 2nd! \u{1FA9C}",
      spec:{seq:[57,59,60,62,64,66,67,69, 57,58,60,62,64,65,67,69],
        names:["A","B","C","D","E","F♯ (the raised 6th!)","G","A","A again","B♭ (the lowered 2nd!)","C","D","E","F","G","A"],
        start:57, octaves:1.1667, title:"A Dorian, then A Phrygian"},
      result:(score)=>score!==null?"Both modes played perfectly!":null },
    { type:"symbol-hunt", title:"Game 3 · Minor-Mode Spotter",
      intro:"Four modes on A — click the one each round names!",
      miaIntro:"Degrees 2, 5 and 6 — the only suspects! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Aeolian (natural minor)", spec:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:250}},
        {label:"Dorian (♯6)", spec:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:250}},
        {label:"Phrygian (♭2)", spec:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:250}},
        {label:"Locrian (♭2 ♭5)", spec:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:250}}]},
      result:(score)=>score>=5?"You identified every mode!":null },
    { type:"term-race", title:"Game 4 · UNIT 15 GRAND FINALE Race",
      intro:"The victory lap: minor primaries, progressions and ALL seven modes!",
      miaIntro:"Everything from Unit 15 — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["Aeolian","the natural minor scale"],
        ["Dorian","natural minor with raised 6th"],
        ["Phrygian","natural minor with lowered 2nd"],
        ["Locrian","natural minor with ♭2 AND ♭5 — the rare one"],
        ["Ionian","the major scale"],
        ["Mixolydian","major with lowered 7th"],
        ["Lydian","major with raised 4th"],
        ["Minor primaries","i, iv and V"],
        ["V in minor is major because","the harmonic minor raises the 7th"],
        ["Smooth minor bass","A-A-A-G♯-A"]]},
      result:(score)=>score>=8?"UNIT 15 CHAMPION — modes and minors complete!":null }
  ],
  practiceIntro:"20 practice questions — the four minor modes and the whole seven-mode family. Answer right and the next appears automatically!",
  practice:[
    { gen:"mode-id", params:{set:"minor", ask:"both"}, count:6 },
    { gen:"mode-id", params:{set:"all", ask:"recipe"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Aeolian","natural minor"],["Dorian","♯6"],["Phrygian","♭2"],["Locrian","♭2 and ♭5"],["Locrian's fame","not used in ancient times"]], reverse:true}, count:4 },
    { type:"mc", q:"Which modes belong to the minor family?", choices:["Aeolian, Dorian, Phrygian, Locrian","Ionian, Mixolydian, Lydian, Dorian","Aeolian, Ionian, Lydian, Locrian"], answer:0,
      explain:"The minor side of the family." },
    { type:"mc", q:"Which scale degree is raised in Dorian?", choices:["the 6th","the 7th","the 2nd"], answer:0,
      explain:"F→F♯ in A Dorian — only the 6th, both directions." },
    { type:"mc", q:"Which scale degree is lowered in Phrygian?", choices:["the 2nd","the 5th","the 6th"], answer:0,
      explain:"B→B♭ in A Phrygian — the changed note comes immediately." },
    { type:"mc", q:"Which notes are lowered in Locrian?", choices:["the 2nd and 5th (both lowered)","the 6th and 7th (both raised)","only the 4th"], answer:0,
      explain:"Two lowered notes — and a diminished tonic triad." },
    { type:"mc", q:"On white keys, D to D produces…", choices:["Dorian","Phrygian","Lydian"], answer:0,
      explain:"Each white-key octave hosts one mode; D hosts Dorian." },
    { type:"truefalse", q:"Aeolian mode is the natural minor scale.", answer:true,
      explain:"Same scale, Greek name." },
    { type:"truefalse", q:"Dorian differs from melodic minor because it raises ONLY the 6th.", answer:true,
      explain:"Melodic minor raises 6 AND 7 (ascending)." },
    { type:"truefalse", q:"Locrian was a favorite mode of ancient musicians.", answer:false,
      explain:"Locrian: rarely used today, and not used in ancient music either." },
    { type:"truefalse", q:"Phrygian's lowered 2nd puts a half step at the very start of the scale.", answer:true,
      explain:"1→♭2: the instant-recognition move." }
  ],
  miaQuizIntro:"The Unit 15 finale quiz! Seven modes, four minor-family changes — map them all.",
  quiz:[
    { type:"mc", q:"Aeolian mode is…", choices:["a natural minor scale","a major scale","minor with a raised 6th"], answer:0,
      explain:"The free one on the minor side.", hint:"A to A, white keys." },
    { type:"mc", q:"DORIAN mode is a natural minor scale with…", choices:["the 6th raised a half step","the 2nd lowered a half step","the 7th raised"], answer:0,
      explain:"One ray of light at degree 6.", hint:"The jazzy minor." },
    { type:"mc", q:"PHRYGIAN mode is a natural minor scale with…", choices:["the 2nd lowered a half step","the 6th raised a half step","the 4th raised"], answer:0,
      explain:"The lowered 2nd — the changed note comes immediately.", hint:"Listen to the second note." },
    { type:"mc", q:"LOCRIAN mode is a natural minor scale with…", choices:["the 2nd and 5th lowered","only the 5th lowered","the 2nd and 6th raised"], answer:0,
      explain:"Two lowered notes — ♭2 and ♭5.", hint:"The mode with two changes." },
    { type:"mc", q:"Why is Locrian used less often?", choices:["Its tonic triad is diminished","It has too many notes","It is too cheerful"], answer:0,
      explain:"With a diminished tonic chord, there is no stable home.", hint:"Look at its tonic triad." },
    { type:"truefalse", q:"A Dorian contains an F♯.", answer:true,
      explain:"The raised 6th of A minor.", hint:"Count to degree 6." },
    { type:"mc", q:"Name this mode (built on A).",
      staff:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:400},
      choices:["A Dorian","A Aeolian","A melodic minor"], answer:0,
      explain:"♯6 alone (G stays natural) = Dorian.", hint:"If 7 were ALSO raised it'd be melodic minor." },
    { type:"mc", q:"Name this mode (built on A).",
      staff:{clef:"treble",notes:[{p:"A3",d:"q"},{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"}],width:400},
      choices:["A Phrygian","A Locrian","A Aeolian"], answer:0,
      explain:"♭2 only — the 5th is untouched, so it's Phrygian.", hint:"Check degree 5 before saying Locrian!" },
    { type:"mc", q:"On the white keys, E to E gives…", choices:["Phrygian","Dorian","Locrian"], answer:0,
      explain:"E-F is the immediate half step — Phrygian's signature.", hint:"Which mode starts with a half step?" },
    { type:"mc", q:"Why is Locrian less stable than the other modes?", choices:["Its tonic triad is diminished","Its 6th is raised","It has no 7th"], answer:0,
      explain:"1, ♭3, ♭5 form a diminished triad — no stable home.", hint:"Look at the ♭5." },
    { type:"mc", q:"Which two modes are identical to scales you already know?", choices:["Ionian (major) and Aeolian (natural minor)","Dorian and Phrygian","Lydian and Locrian"], answer:0,
      explain:"The two anchors of the system.", hint:"Degrees 1 and 6 of the white keys." },
    { type:"mc", q:"A minor melody has a raised 6th. Which mode is it most likely using?", choices:["Dorian","Phrygian","Aeolian"], answer:0,
      explain:"The raised 6th is Dorian's calling card.", hint:"Bright 6th = ?" },
    /* generated */
    { gen:"mode-id", params:{set:"minor", ask:"both"}, count:4 },
    { gen:"mode-id", params:{set:"all", ask:"recipe"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Dorian","♯6"],["Phrygian","♭2"],["Locrian","♭2 ♭5"],["Aeolian","no changes"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Aeolian", sym:"W–H–W–W–H–W–W", def:"The mode on degree 6 — identical to the natural minor scale."},
    {term:"Dorian", sym:"W–H–W–W–W–H–W", def:"Natural minor with the 6th RAISED a half step — the brightened minor."},
    {term:"Phrygian", sym:"H–W–W–W–H–W–W", def:"Natural minor with the 2nd LOWERED a half step — a half step right out of the gate."},
    {term:"Locrian", sym:"H–W–W–H–W–W–W", def:"Natural minor with the 2nd AND 5th lowered. Unused in ancient times; only occasional in modern music — its home triad is diminished."}
  ],
  mistakes:[],
  summary:[
    "✔ Four minor-related modes: <b>Aeolian</b> (= natural minor), <b>Dorian</b> (♯6), <b>Phrygian</b> (♭2), <b>Locrian</b> (♭2 + ♭5).",
    "✔ <b>Dorian raises only the 6th</b> — don't confuse it with melodic minor (6 AND 7).",
    "✔ <b>Phrygian's half step hits immediately</b>: 1→♭2 — the flamenco signature.",
    "✔ <b>Locrian is rarely used</b>: two lowered notes (♭2, ♭5) and a diminished tonic triad.",
    "✔ All seven mapped: Ionian/Mixolydian/Lydian (major side) + these four. <b>UNIT 15 COMPLETE!</b> \u{1F389}"
  ],
  tips:[
    "Quick tags: Dorian = minor with a raised 6th; Phrygian = minor with a lowered 2nd; Locrian = minor with ♭2 and ♭5.",
    "White-key map, complete: C-Ion, D-Dor, E-Phr, F-Lyd, G-Mix, A-Aeo, B-Loc. One octave of piano = the entire system.",
    "Much popular music uses Dorian or Mixolydian — listen for the changed 6ths and 7ths.",
    "Unit 16 turns you into a COMPOSER: harmonizing real melodies with the chords you now command."
  ],
  rewards:{ badge:"Keeper of the Seven Modes — Unit 15 Champion", icon:"\u{1F3FA}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! All seven modes — Greek fluency achieved, Unit 15 conquered! \u{1F3FA}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — and Unit 15 is COMPLETE! Seven modes, three minors, one smooth glide. \u{1F389}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Scale 2 lowered its 2nd (B→B♭): A Phrygian — natural minor with a half step at the very start.",
      play:()=>{[57,58,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.4,i*.28,.4));} },
    learn:{ label:"the minor modes",
      explain:"Aeolian = natural minor. Dorian = ♯6. Phrygian = ♭2. Locrian = ♭2+♭5 (rare — diminished home). Compare with natural minor and find the changes.",
      hint:"Check degrees 2, 5 and 6.",
      play:()=>{[57,59,60,62,64,66,67,69].forEach((m,i)=>MFAudio.tone(m,.4,i*.28,.4));} },
    example:{ label:"the examples",
      explain:"Example 1 shows all four minor-family modes; example 2 finds Dorian, Phrygian and Locrian on the white keys (D→D, E→E, B→B)." },
    game:{ label:"the games",
      explain:"Sprint the minor modes, climb Dorian and Phrygian, spot all four on cards, then run the Unit 15 victory lap.",
      hint:"♯6 = Dorian, ♭2 = Phrygian, both-and-♭5 = Locrian." },
    quiz:{ label:"this question",
      explain:"Method: line the scale against natural minor, find the changed degree(s), name the Greek. Check degree 5 before crying Locrian.",
      play:()=>{[57,58,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.4,i*.28,.4));} }
  }
};
