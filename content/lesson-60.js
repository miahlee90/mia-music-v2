/* Lesson 60 — The Primary Triads in Minor Keys (AEMT Book 3, Unit 15)
   Built from drafts/UNIT 15 – Lesson 60.md; AEMT3 p.96 verified by render.
   Core: primary triads of a minor key = degrees 1, 4, 5 of the (harmonic)
   minor scale → i and iv are MINOR, V is MAJOR (its 3rd is the raised 7th!);
   together they contain every note of the minor scale. Harmonic-minor triad
   scale: i ii° III+ iv V VI vii° — 1&4 minor, 5&6 major, 2&7 dim, 3 AUG.
   NOTE: edit by FULL-FILE REWRITE only. */

/* keyboard builder: i, iv, V in A minor */
function MF_L60_build(container,fb){
  const ROUNDS=[
    {name:"i — A minor", sym:"Am", pcs:[9,0,4], names:["A (root)","C (m3)","E (P5)"]},
    {name:"iv — D minor", sym:"Dm", pcs:[2,5,9], names:["D (root)","F (m3)","A (P5)"]},
    {name:"V — E MAJOR", sym:"E", pcs:[4,8,11], names:["E (root)","G♯ (M3 — the raised 7th of A harmonic minor!)","B (P5)"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l60b-q" style="text-align:center"></div>
    <div class="l60b-staff"></div><div class="l60b-kb"></div>`;
  const q=container.querySelector(".l60b-q"), sh=container.querySelector(".l60b-staff"), kh=container.querySelector(".l60b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",8:"G#",9:"A",11:"B"};
    const ps=got.map(m=>(NAMES[m%12]||"C")+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:190});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You built all three primary triads."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name}</b> (${ROUNDS[r].sym}). Press <b>${ROUNDS[r].names[0].split(" ")[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:57,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=3){ got.forEach(x=>MFAudio.tone(x,1.2,.1,.32));
          fb(true,`✓ ${R.name}. ${r===2?"The raised 7th (G♯) makes it MAJOR.":"A minor triad."}`);
          r++; setTimeout(ask,1500); }
        else q.innerHTML=`Now play <b>${R.names[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right key — stack UPWARD."); }
      else { MFAudio.tone(40,.2); fb(false, r===2&&k===1? "Remember the harmonic minor: the 7th of the SCALE (G) is raised — press the black key G♯." : "Spell the triad in 3rds from its root."); }
    }});
  ask();
}

/* quality detective: the harmonic-minor triad scale */
function MF_L60_quality(container,fb){
  const ROUNDS=[
    {deg:"1st (i)", ps:["A3","C4","E4"], quality:1, sym:"Am"},
    {deg:"5th (V)", ps:["E4","G#4","B4"], quality:0, sym:"E"},
    {deg:"3rd (III+)", ps:["C4","E4","G#4"], quality:2, sym:"C+"},
    {deg:"7th (vii°)", ps:["G#4","B4","D5"], quality:3, sym:"G♯°"}];
  const QN=["Major","Minor","Augmented","Diminished"];
  let r=0;
  container.innerHTML=`<div class="big-q l60q-q" style="text-align:center"></div>
    <div class="l60q-staff"></div>
    <div class="choices chips l60q-ch"><button>Major</button><button>Minor</button><button>Augmented</button><button>Diminished</button></div>`;
  const q=container.querySelector(".l60q-q"), holder=container.querySelector(".l60q-staff"), ch=container.querySelector(".l60q-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You identified every chord quality."; holder.innerHTML=""; ch.style.display="none"; return; }
    const R=ROUNDS[r];
    q.innerHTML=`In A harmonic minor, what is the quality of the triad on the <b>${R.deg}</b> degree?`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:210});
  }
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r]; if(!R) return;
    if(i===R.quality){
      R.ps.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.1,.1,.32));
      fb(true,`✓ ${R.sym} — ${QN[R.quality]}. ${R.quality===2?"The raised G♯ stretches C-E-G into C-E-G♯: the scale's built-in augmented chord!":R.quality===3?"G♯-B-D: two minor 3rds — diminished, standing right on the raised 7th.":""}`);
      r++; setTimeout(ask,1500); }
    else { MFAudio.tone(40,.2); fb(false,"Measure the 3rd, then the 5th — and remember every G in this scale is G♯."); }
  });
  ask();
}

LESSON_CONTENT[60]={
  welcome:"Minor keys also have three primary triads — and one of them is major. \u{1F511}",
  hook:{
    say:"<b>Minor keys also have three primary triads.</b> Listen carefully. <b>Which ending has the stronger dominant chord?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Ending A: v (minor) → i</button>
          <button class="play hk-b">▶ Ending B: V (major) → i</button></div>
          <div class="choices hk-ch" style="display:none"><button>Ending B — its dominant chord is major (raised 3rd)</button><button>Ending A — the minor dominant is stronger</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [64,67,71].forEach(m=>MFAudio.tone(m,.9,0,.32)); [57,60,64].forEach(m=>MFAudio.tone(m,1.4,1.0,.34)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2500); };
        container.querySelector(".hk-b").onclick=()=>{ [64,68,71].forEach(m=>MFAudio.tone(m,.9,0,.32)); [57,60,64].forEach(m=>MFAudio.tone(m,1.4,1.0,.34)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2500); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Ending B's chord was E-G♯-B — a MAJOR V, its G♯ borrowed from the harmonic minor scale. That leading tone is why minor keys keep a major dominant. Today: the primary triads of minor keys!");
          else fb(false,"Play them again — which second-to-last chord contains a note leaning INTO the final A?");
        });
      } }
  },
  objectives:[
    "Locate the primary triads of a minor key: degrees 1, 4, 5 → i, iv, V",
    "Know the qualities: i and iv are MINOR, V is MAJOR",
    "Explain the G♯: the V chord's 3rd IS the harmonic minor's raised 7th",
    "Show that i, iv and V contain every note of the minor scale",
    "Read the harmonic-minor triad scale: i ii° III+ iv V VI vii°",
    "Build all three primaries at the keyboard"
  ],
  steps:[
    { say:"<b>Primary Triads in Minor:</b> Like major keys, minor keys have three primary triads: <b>i, iv, and V</b>. Together they contain all seven notes of the minor scale. \u{1F447} <b>Which scale degrees form the primary triads?</b>",
      try:{ type:"mc", choices:["1, 4 and 5","1, 3 and 5","2, 5 and 7"], answer:0,
        success:"✓ Degrees 1, 4 and 5 — the same as in major keys.",
        fail:"Same degrees as I, IV, V in major…",
        hint:"The same degrees as I, IV, V in major." } },
    { say:"<b>The i and iv Chords:</b> The <b>i</b> and <b>iv</b> chords are <b>minor triads</b> (root + minor 3rd + perfect 5th). They are written with <b>lowercase Roman numerals</b>. \u{1F447} <b>Why are i and iv written in lowercase?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"A3",d:"w",label:"i = Am"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"D4",d:"w",label:"iv = Dm"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:400} },
      try:{ type:"mc", choices:["Lowercase numerals mark MINOR triads","They're quieter chords","They're played with the left hand"], answer:0,
        success:"✓ Case = quality, as always: i and iv wear lowercase because they're minor.",
        fail:"Remember Lesson 58's labeling rule…",
        hint:"ii, iii, vi wore lowercase too." } },
    { say:"<b>Why Is V Major?</b> The <b>harmonic minor scale</b> raises the <b>7th degree</b>. That raised note becomes the <b>3rd of the V chord</b>, making it <b>major</b>. <b>Remember: without the raised 7th, the V chord would be minor. Raising the 7th changes v into V.</b> \u{1F447} <b>Where does the G♯ in E major come from?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"E4",d:"w",label:"V = E major"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:240} },
      try:{ type:"mc", choices:["It's the harmonic minor's raised 7th, serving as the chord's 3rd","It's a printing error","V chords always add sharps"], answer:0,
        success:"✓ Lesson 57's raised 7th becomes chord power: the leading tone G♯ lives inside V and aims straight at the tonic A.",
        fail:"Which scale form raises its 7th? And which note of E-G♯-B is that 7th?",
        hint:"A harmonic minor: A B C D E F G♯." } },
    { say:"Build the three primary triads in A minor. \u{1F447}",
      try:{ type:"custom",
        hint:"i and iv: m3+P5. V: M3+P5 — the 3rd is a black key!",
        mount:(container,fb)=>MF_L60_build(container,fb) } },
    { say:"<b>Triads in Harmonic Minor:</b> Harmonic minor contains all four triad qualities — minor, major, diminished, and augmented. The <b>3rd scale degree</b> forms the <b>augmented triad</b>. \u{1F447} <b>Which scale degree forms the augmented triad?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:280px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Scale Degree</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Quality</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">i</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">minor</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">ii°</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">diminished</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">III+</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">augmented</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">iv</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">minor</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">major</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">VI</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">major</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">vii°</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">diminished</td></tr></table>` },
      try:{ type:"mc", choices:["The 3rd (III+)","The 5th","The 6th"], answer:0,
        success:"✓ C-E-G♯: the raised 7th stretches the 5th of the III chord — the scale's built-in augmented triad. (And BOTH 2 and 7 are diminished!)",
        fail:"Find the chord whose TOP note is the raised G♯ stretching it wide…",
        hint:"C-E-G would be major; what does G♯ do to it?" } },
    { say:"<b>Identify the chord quality.</b> \u{1F447}",
      try:{ type:"custom",
        hint:"Every G in this key is G♯. Measure 3rd, then 5th.",
        mount:(container,fb)=>MF_L60_quality(container,fb) } },
    { say:"<b>Try Another Key:</b> This pattern works in every minor key. In D minor, i = Dm and iv = Gm. \u{1F447} <b>What is the V chord?</b>",
      try:{ type:"mc", choices:["A major (A-C♯-E)","A minor (A-C-E)","F major"], answer:0,
        success:"✓ D harmonic minor raises its 7th (C→C♯), so V = A-C♯-E, MAJOR. The pattern: i and iv minor, V major, in every minor key.",
        fail:"D minor's 7th degree is C. What happens to it in harmonic minor — and where does it sit inside A-?-E?",
        hint:"Raise the 7th; it becomes V's 3rd." } }
  ],
  examples:[
    { caption:"The three primary triads of A minor: i (Am), iv (Dm), V (E — hear the major brightness!), then home to i. These three chords can accompany any simple minor-key melody.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"A3",d:"w",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"D4",d:"w",label:"iv"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"V"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"A3",d:"w",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"final"}],width:520},
      kb:{start:57,octaves:1.1667,labels:true} },
    { caption:"The harmonic-minor triad scale, played through: i ii° III+ iv V VI vii° i. Listen for the augmented III+ and the two diminished triads.",
      staff:{clef:"treble",tempo:90,notes:[
        {p:"A3",d:"w",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"B3",d:"w",label:"ii°"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w",label:"III+"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true},
        {p:"D4",d:"w",label:"iv"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"V"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"VI"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G#4",d:"w",label:"vii°"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A4",d:"w",label:"i"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:680},
      kb:{start:57,octaves:1.5833,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Minor-Primary Sprint (45s)",
      intro:"Everything about i, iv and V — race the facts of the minor primaries!",
      miaIntro:"Lowercase, lowercase, UPPERCASE! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["i in A minor","A-C-E (minor)"],
        ["iv in A minor","D-F-A (minor)"],
        ["V in A minor","E-G♯-B (MAJOR)"],
        ["Why V is major","the harmonic minor's raised 7th is its 3rd"],
        ["Primary triads of a minor key","degrees 1, 4 and 5"],
        ["III+ in harmonic minor","the augmented triad on degree 3"],
        ["ii° and vii°","the diminished triads (degrees 2 and 7)"],
        ["i, iv, V together","every note of the minor scale"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — minor primaries mastered!":null },
    { type:"key-climb", title:"Game 2 · i-iv-V-i Climb",
      intro:"Play the whole primary tour of A minor — don't miss the G♯ in V!",
      miaIntro:"Watch for the black key! \u{1FA9C}",
      spec:{seq:[57,60,64, 62,65,69, 64,68,71, 69,72,76],
        names:["A (i: root)","C","E","D (iv: root)","F","A","E (V: root)","G♯ — the raised 7th!","B","A (i: home)","C","E"],
        start:57, octaves:1.5833, title:"i → iv → V → i in A minor"},
      result:(score)=>score!==null?"The minor primary tour, under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · Primary Spotter (minor edition)",
      intro:"i, iv, V and one intruder — click what each round names!",
      miaIntro:"The G♯ is your beacon! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"i (Am: A-C-E)", spec:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true}],width:150}},
        {label:"iv (Dm: D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"V (E: E-G♯-B)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"III+ (C+: C-E-G♯)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No chord fools you in minor country!":null },
    { type:"term-race", title:"Game 4 · Minor-Key Fact Race",
      intro:"Primaries, qualities and the triad scale — match at speed!",
      miaIntro:"All the harmonic-minor triads! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Primary triads (minor key)","i, iv and V"],
        ["Quality of i and iv","minor"],
        ["Quality of V in minor","MAJOR"],
        ["The raised 7th inside V","the chord's 3rd"],
        ["V in D minor","A major (A-C♯-E)"],
        ["Harmonic-minor triad scale","i ii° III+ iv V VI vii°"],
        ["Degrees 5 and 6","the major triads of harmonic minor"],
        ["Degrees 2 and 7","the diminished triads of harmonic minor"]]},
      result:(score)=>score>=6?"Fact-race champion of the minor keys!":null }
  ],
  practiceIntro:"20 practice questions — spellings, qualities and the G♯ logic. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["i (A minor)","A-C-E"],["iv (A minor)","D-F-A"],["V (A minor)","E-G♯-B"],["V's quality","major"],["i's quality","minor"],["III+","C-E-G♯, augmented"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{}, count:4 },
    { type:"mc", q:"The primary triads of a minor key are built on degrees…", choices:["1, 4 and 5","1, 3 and 5","2, 4 and 6"], answer:0,
      explain:"Same addresses as major keys." },
    { type:"mc", q:"In a minor key, the i and iv chords are…", choices:["minor triads","major triads","diminished triads"], answer:0,
      explain:"Root + m3 + P5 on both." },
    { type:"mc", q:"Why is the V chord major in a minor key?", choices:["The raised 7th of the harmonic minor scale becomes its 3rd","Major chords are louder","The key signature adds a sharp"], answer:0,
      explain:"Scale change → chord quality: the raised 7th is V's major 3rd." },
    { type:"mc", q:"In A minor, the V chord is spelled…", choices:["E-G♯-B","E-G-B","E-A-B"], answer:0,
      explain:"G♯ = the raised 7th of A harmonic minor." },
    { type:"mc", q:"Which scale degree forms the augmented triad?", choices:["3 (III+)","5","1"], answer:0,
      explain:"C-E-G♯ in A minor." },
    { type:"mc", q:"In D minor, the V chord is…", choices:["A major","A minor","G major"], answer:0,
      explain:"C♯ (raised 7th) is its 3rd." },
    { type:"truefalse", q:"i, iv and V contain every note of the minor scale.", answer:true,
      explain:"Which is why they can accompany minor melodies (next lesson!)." },
    { type:"truefalse", q:"The V chord in minor uses the natural (unraised) 7th.", answer:false,
      explain:"It borrows the HARMONIC minor's raised 7th." },
    { type:"mc", q:"Which scale degrees form diminished triads?", choices:["2 and 7 (ii° and vii°)","1 and 4","5 and 6"], answer:0,
      explain:"ii° (B-D-F) and vii° (G♯-B-D) in A harmonic minor." },
    { type:"truefalse", q:"In minor keys, V is written lowercase.", answer:false,
      explain:"It's MAJOR → uppercase V." }
  ],
  miaQuizIntro:"Quiz! Lowercase i, lowercase iv, UPPERCASE V — and the G♯ that explains it all.",
  quiz:[
    { type:"mc", q:"The primary triads of a minor key are…", choices:["i, iv and V","I, IV and V","i, iii and v","ii, iv and vi"], answer:0,
      explain:"Minor, minor, MAJOR — the case tells the story.", hint:"Check each numeral's case." },
    { type:"mc", q:"Why are the i and iv chords minor?", choices:["They consist of a root, minor 3rd and perfect 5th","They consist of a root, major 3rd and perfect 5th","They stack two major 3rds"], answer:0,
      explain:"Recall Lesson 58: minor triad = root + m3 + P5.", hint:"Lesson 58." },
    { type:"mc", q:"Why is the V chord major?", choices:["the harmonic minor scale raises the 7th, which becomes V's 3rd","composers prefer loud chords","the key signature adds a sharp"], answer:0,
      explain:"Raised 7th → chord quality.", hint:"Where does G♯ sit inside E-G♯-B?" },
    { type:"mc", q:"In A minor, the three primary triads are…", choices:["Am, Dm, E","Am, Dm, Em","Am, D, E","C, F, G"], answer:0,
      explain:"i=Am, iv=Dm, V=E major.", hint:"Two minors and one major." },
    { type:"truefalse", q:"The i, iv and V triads contain every note of the minor scale.", answer:true,
      explain:"The accompaniment kings of minor keys.", hint:"Same claim as I-IV-V in major." },
    { type:"truefalse", q:"In the harmonic minor triad scale, the 3rd degree carries an augmented triad.", answer:true,
      explain:"III+ = C-E-G♯ in A minor.", hint:"The raised 7th stretches it." },
    { type:"mc", q:"Identify this chord in A minor.",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:200},
      choices:["V (E major)","v (E minor)","iii (E minor)"], answer:0,
      explain:"The ♯ on G makes it major: the dominant of A minor.", hint:"What did the accidental do?" },
    { type:"mc", q:"Identify this chord in A minor.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:200},
      choices:["iv (D minor)","IV (D major)","ii° (D diminished)"], answer:0,
      explain:"D-F-A: minor → lowercase iv.", hint:"Measure D→F." },
    { type:"mc", q:"Which scale degrees form diminished triads?", choices:["2nd and 7th","1st and 4th","5th and 6th"], answer:0,
      explain:"ii° (B-D-F) and vii° (G♯-B-D).", hint:"Degrees 2 and 7." },
    { type:"mc", q:"Which scale degrees form major triads?", choices:["5th and 6th","1st and 4th","2nd and 3rd"], answer:0,
      explain:"V (E) and VI (F) in A minor.", hint:"One is the dominant; the other is right above it." },
    { type:"mc", q:"In E minor, the V chord is spelled…", choices:["B-D♯-F♯","B-D-F♯","E-G-B"], answer:0,
      explain:"E harmonic minor raises D→D♯; V = B major.", hint:"Raise E minor's 7th degree." },
    { type:"mc", q:"Why is the raised 7th important in a minor key?", choices:["It creates a leading tone that pulls to the tonic","It makes the chord easier to finger","It cancels the key signature"], answer:0,
      explain:"That pull is the engine of every strong cadence.", hint:"Lesson 57's whole argument." },
    /* generated */
    { gen:"triad-quality", params:{}, count:4 },
    { gen:"rel-key", params:{ask:"both"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["i, iv","the minor primaries"],["V","the major primary"],["G♯ in A minor's V","the raised 7th"],["III+","the augmented resident"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Primary Triads (minor)", def:"The triads on degrees 1, 4 and 5 of a minor key: i, iv and V — together they hold every scale note."},
    {term:"i and iv", def:"The MINOR primaries (Am and Dm in A minor) — lowercase numerals.",
      staff:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true}],width:130}},
    {term:"V in Minor", def:"A MAJOR triad — its 3rd is the harmonic minor's raised 7th (E-G♯-B in A minor).",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:130}},
    {term:"Harmonic-Minor Triad Scale", def:"i · ii° · III+ · iv · V · VI · vii° — minor on 1&4, major on 5&6, diminished on 2&7, augmented on 3."}
  ],
  mistakes:[],
  summary:[
    "✔ Minor-key primaries live on <b>degrees 1, 4, 5</b>: <b>i, iv, V</b>.",
    "✔ <b>i and iv are minor</b> (root + m3 + P5) — lowercase numerals.",
    "✔ <b>V is MAJOR</b>: its 3rd is the harmonic minor's <b>raised 7th</b> (G♯ in A minor).",
    "✔ i + iv + V = <b>every note of the minor scale</b>.",
    "✔ The full pattern: <b>i ii° III+ iv V VI vii°</b> — all four qualities in one scale."
  ],
  tips:[
    "Spot-check any minor key in seconds: spell V, and make sure its middle note is the RAISED 7th (a half step below the tonic).",
    "The chord just above V — VI — is major too; the i→VI move appears in many pieces.",
    "III+ rarely appears in simple songs, but film composers adore it — it's the sound of something transforming.",
    "Next lesson these three chords start MOVING: minor progressions with the same smoothing tricks you learned in Lesson 55."
  ],
  rewards:{ badge:"Minor-Key Locksmith", icon:"\u{1F511}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! i, iv, V — and you know exactly why that V shines major. \u{1F511}\u{1F389}",
  miaPass:"Passed! The minor primaries are yours. Now let's make them FLOW…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Ending A used E-G-B (a minor v). Ending B used E-G♯-B: the major V, whose raised 3rd is the leading tone pulling to A.",
      play:()=>{[64,68,71].forEach(m=>MFAudio.tone(m,.9,0,.32));[57,60,64].forEach(m=>MFAudio.tone(m,1.3,1.0,.34));} },
    learn:{ label:"minor primaries",
      explain:"i (minor), iv (minor), V (MAJOR — raised 7th as its 3rd). Together: the whole minor scale. Full triad scale: i ii° III+ iv V VI vii°.",
      hint:"Lowercase, lowercase, UPPERCASE.",
      play:()=>{[57,60,64].forEach(m=>MFAudio.tone(m,.8,0,.33));[62,65,69].forEach(m=>MFAudio.tone(m,.8,.9,.33));[64,68,71].forEach(m=>MFAudio.tone(m,1,1.8,.33));} },
    example:{ label:"the examples",
      explain:"Example 1 plays the primary tour i-iv-V-i; example 2 walks the whole harmonic-minor triad scale with its aug and dim residents." },
    game:{ label:"the games",
      explain:"Sprint the facts, climb i-iv-V-i, spot the chords, then race the facts.",
      hint:"Every G in A harmonic minor is G♯." },
    quiz:{ label:"this question",
      explain:"Three chords, two qualities: i/iv minor, V major — and the G♯ (raised 7th) explains the exception.",
      play:()=>{[64,68,71].forEach(m=>MFAudio.tone(m,.9,0,.32));[57,60,64].forEach(m=>MFAudio.tone(m,1.2,1,.34));} }
  }
};
