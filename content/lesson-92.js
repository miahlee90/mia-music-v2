/* Lesson 92 — Five Common Seventh-Chord Types (Book 4, Unit 23 — SELF-AUTHORED)
   Core: triad + 7th above the root = seventh chord. Five common types:
   MAJOR 7 (M triad + M7) · DOMINANT 7 (M triad + m7) · MINOR 7 (m + m7) ·
   HALF-DIMINISHED 7 (dim + m7) · FULLY DIMINISHED 7 (dim + dim7).
   NOTE: edit by FULL-FILE REWRITE only. */

/* seventh-quality ear lab */
function MF_L92_ear(container,fb){
  const CH={maj7:[60,64,67,71], dom7:[60,64,67,70], m7:[60,63,67,70], hd7:[60,63,66,70], d7:[60,63,66,69]};
  const NAME={maj7:"Major 7", dom7:"Dominant 7", m7:"Minor 7", hd7:"Half-diminished 7", d7:"Diminished 7"};
  const ROUNDS=["dom7","maj7","m7","d7"];
  const KEY=["maj7","dom7","m7","d7"];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l92e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l92e-play">▶ Hear the chord</button></div>
    <div class="choices l92e-ch" style="display:none"><button>Major 7</button><button>Dominant 7</button><button>Minor 7</button><button>Diminished 7</button></div>`;
  const q=container.querySelector(".l92e-q"), pl=container.querySelector(".l92e-play"), ch=container.querySelector(".l92e-ch");
  pl.onclick=()=>{ const w=ROUNDS[r]; if(!w) return; CH[w].forEach(m=>MFAudio.tone(m,1.1,.05,.28)); played=true; setTimeout(()=>ch.style.display="",1500); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    if(KEY[i]===ROUNDS[r]){ fb(true,"✓ "+NAME[ROUNDS[r]]+"."); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! Four seventh-chord qualities identified."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: listen, then name the type.`;
    } else { MFAudio.tone(40,.2); fb(false,"Listen for the underlying triad quality first, then the quality of the seventh above the root."); }
  });
  q.innerHTML="Round 1 of 4: listen, then name the type.";
}

LESSON_CONTENT[92]={stackFigures:true,
  welcome:"Compare five common types of seventh chords.",
  hook:{
    say:"Listen to five seventh chords built on the same root. Each combines a triad with a seventh above the root. \u{1F447} <b>Do they have the same chord quality?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the five chords</button></div>
          <div class="choices hk-ch" style="display:none"><button>No — each chord has a different interval structure and quality</button><button>Yes — all five have the same quality</button><button>Yes — all five are triads</button></div>`;
        const ROWS=[[60,64,67,71],[60,64,67,70],[60,63,67,70],[60,63,66,70],[60,63,66,69]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.95,.26))); setTimeout(()=>ch.style.display="",ROWS.length*950+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The five chords are major seventh, dominant seventh, minor seventh, half-diminished seventh, and fully diminished seventh. Each has a different interval structure.");
          else fb(false,"Compare the third, fifth, and seventh above the root in each chord.");
        });
      } }
  },
  objectives:[
    "Build a seventh chord: triad + a 7th above the root",
    "MAJOR 7: major triad + major 7th (Cmaj7: C-E-G-B)",
    "DOMINANT 7: major triad + minor 7th (C7: C-E-G-B♭) — review",
    "MINOR 7: minor triad + minor 7th (Cm7: C-E♭-G-B♭)",
    "HALF-DIMINISHED 7 (Cø7 / Cm7♭5) and FULLY DIMINISHED 7 (C°7)",
    "Identify all five by formula, sight and sound"
  ],
  steps:[
    { say:"<b>The Seventh Chord:</b> A <b>tertian seventh chord</b> is constructed by stacking three thirds above a root. In root position, its chord members are the root, 3rd, 5th, and <b>7th</b>. This lesson compares five common combinations of triad quality and seventh quality. \u{1F447} <b>Which chord members form a root-position tertian seventh chord?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:13.5px;min-width:320px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Type</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Triad</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">7th</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">On C</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#2F6DA8">Major 7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C-E-G-B</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#A9821F">Dominant 7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C-E-G-B♭</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#C05A21">Minor 7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C-E♭-G-B♭</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800">Half-dim 7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">diminished</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C-E♭-G♭-B♭</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800">Diminished 7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">diminished</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">diminished</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C-E♭-G♭-B𝄫</td></tr></table>` },
      try:{ type:"mc", choices:["Root, 3rd, 5th, and 7th","Root and 5th only","Five different chord members"], answer:0,
        success:"✓ Correct. Adding another third above a triad produces a seventh above the root, giving four chord members.",
        fail:"Count the chord members in the stack of thirds.",
        hint:"A triad plus one additional third." } },
    { say:"<b>Major Seventh Chord — Cmaj7:</b> a major seventh chord combines a major triad with a <b>major 7th</b> above the root. Cmaj7 is spelled C-E-G-<b>B</b>. The interval from B to the octave C is a half step. \u{1F447} <b>Which pitches form Cmaj7?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"Cmaj7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"final"}],width:280} },
      try:{ type:"mc", choices:["C-E-G-B","C-E-G-B♭","C-E♭-G-B"], answer:0,
        success:"✓ Correct. C-E-G forms a major triad, and B is a major seventh above C.",
        fail:"Identify the pitch a major seventh above C.",
        hint:"A major seventh is one half step smaller than an octave." } },
    { say:"<b>Dominant Seventh Chord — C7:</b> a dominant seventh chord combines a major triad with a <b>minor 7th</b> above the root. C7 is spelled C-E-G-<b>B♭</b>. It occurs diatonically on scale degree 5 in a major key. The dominant seventh naturally creates a <b>strong pull to the tonic</b>, which makes it central to tonal harmony. \u{1F447} <b>Which chord member distinguishes C7 from Cmaj7?</b>",
      try:{ type:"mc", choices:["The seventh: B♭ in C7 and B♮ in Cmaj7","The root","The fifth"], answer:0,
        success:"✓ Correct. C7 contains a minor seventh, B♭, while Cmaj7 contains a major seventh, B♮.",
        fail:"Compare the seventh above the root in each chord.",
        hint:"B♮ versus B♭." } },
    { say:"<b>Minor Seventh Chord — Cm7:</b> a minor seventh chord combines a minor triad with a minor 7th above the root. Cm7 is spelled C-E♭-G-B♭. Minor seventh chords occur in many tonal, modal, jazz, popular, and other musical contexts. \u{1F447} <b>What is the formula for Cm7?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"Cm7"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{bar:"final"}],width:280} },
      try:{ type:"mc", choices:["Minor triad + minor 7th","Major triad + major 7th","Diminished triad + diminished 7th"], answer:0,
        success:"✓ Correct. C-E♭-G forms a minor triad, and B♭ is a minor seventh above C.",
        fail:"Identify both the triad quality and the seventh quality.",
        hint:"Minor triad + minor seventh." } },
    { say:"<b>The Two Diminished-Triad Seventh Chords:</b> <b>half-diminished seventh chord</b>: Cø7 (also written Cm7♭5) = diminished triad + minor 7th, spelled C-E♭-G♭-B♭ · <b>fully diminished seventh chord</b>: C°7 = diminished triad + <b>diminished 7th</b>, spelled C-E♭-G♭-B𝄫. A root-position fully diminished seventh chord is <b>three stacked minor 3rds</b>, which gives it a symmetrical structure. \u{1F447} <b>How is a root-position fully diminished seventh chord constructed?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"Cø7"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C°7"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true},{p:"B4",d:"w",chord:true,acc:"bb",sound:"A4"},{bar:"final"}],width:420} },
      try:{ type:"mc", choices:["Three stacked minor 3rds","Three stacked major 3rds","Three stacked perfect 4ths"], answer:0,
        success:"✓ Correct. A fully diminished seventh chord contains three stacked minor thirds and divides the octave into four equal parts.",
        fail:"Measure each written third in C-E♭-G♭-B𝄫.",
        hint:"Each adjacent pair forms a minor third." } },
    { say:"Listen and identify the seventh-chord quality. \u{1F447}",
      try:{ type:"custom",
        hint:"Listen for the underlying triad quality, then compare the quality of the seventh above the root.",
        mount:(container,fb)=>MF_L92_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which formula produces a dominant seventh chord?</b>",
      try:{ type:"mc", choices:["Major triad + minor 7th","Major triad + major 7th","Minor triad + minor 7th"], answer:0,
        success:"✓ Correct. A dominant seventh chord combines a major triad with a minor seventh above the root.",
        fail:"Identify the major triad and minor seventh combination.",
        hint:"C-E-G-B♭ is the model." } }
  ],
  examples:[
    { caption:"Five common seventh chords on one root: Cmaj7 · C7 · Cm7 · Cø7 · C°7. One chord member changes at a time — follow the spellings.",
      staff:{clef:"treble",tempo:66,notes:[
        {p:"C4",d:"w",label:"maj7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"C4",d:"w",label:"7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},
        {p:"C4",d:"w",label:"m7"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},
        {p:"C4",d:"w",label:"\u{00F8}7"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},
        {p:"C4",d:"w",label:"\u{00B0}7"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true},{p:"B4",d:"w",chord:true,acc:"bb",sound:"A4"},{bar:"final"}],width:680},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"Sevenths in context: Dm7 → G7 → Cmaj7 — three of the five types chained into the ii–V–I, one of the most common progressions in tonal and jazz harmony.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"D4",d:"w",label:"Dm7"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G3",d:"w",label:"G7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w",label:"Cmaj7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:55,octaves:1.4,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Seventh-Chord Formula Sprint (45s)",
      intro:"Match five common seventh-chord types with their interval formulas.",
      miaIntro:"Identify the triad quality and the seventh quality.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Major 7","major triad + major 7th"],
        ["Dominant 7","major triad + minor 7th"],
        ["Minor 7","minor triad + minor 7th"],
        ["Half-diminished 7","diminished triad + minor 7th"],
        ["Diminished 7","diminished triad + diminished 7th"],
        ["Cmaj7","C-E-G-B"],
        ["C7","C-E-G-B\u{266D}"],
        ["Cm7","C-E\u{266D}-G-B\u{266D}"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Seventh-chord formulas identified!":null },
    { type:"key-climb", title:"Game 2 · Build Two Seventh Chords",
      intro:"Play Cmaj7 and then C7 in root position. Listen to the change from B♮ to B♭.",
      miaIntro:"Keep C-E-G and change only the seventh.",
      spec:{seq:[60,64,67,71, 60,64,67,70],
        names:["C (root)","E (3rd)","G (5th)","B (major 7!)","C","E","G","B♭ (minor 7!)"],
        start:60, octaves:1, title:"Cmaj7, then C7"},
      result:(score)=>score!==null?"You performed both seventh chords correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Seventh Chord",
      intro:"Examine each notated seventh chord and select its quality.",
      miaIntro:"Find the root, then check the third, fifth, and seventh.",
      spec:{rounds:6, pool:[
        {label:"Cmaj7 (C-E-G-B)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:120}},
        {label:"C7 (C-E-G-B♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:120}},
        {label:"Cm7 (C-E♭-G-B♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:120}},
        {label:"C°7 (C-E♭-G♭-B𝄫)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true},{p:"B4",d:"w",chord:true,acc:"bb",sound:"A4"}],width:120}}]},
      result:(score)=>score>=5?"You identified the seventh chords correctly.":null },
    { type:"term-race", title:"Game 4 · Compare the Formulas",
      intro:"Match each seventh-chord symbol with its triad and seventh qualities.",
      miaIntro:"Major, minor, diminished — and which seventh?",
      spec:{rounds:5, reverse:true, pool:[
        ["Cmaj7","major triad + major seventh"],
        ["C7","major triad + minor seventh"],
        ["Cm7","minor triad + minor seventh"],
        ["Cø7 (Cm7♭5)","diminished triad + minor seventh"],
        ["C°7","diminished triad + diminished seventh"]]},
      result:(score)=>score>=4?"You matched all five formulas correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on seventh-chord formulas, symbols, and spellings. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["maj7","M triad + M7"],["dom7","M triad + m7"],["m7","m triad + m7"],["\u{00F8}7","dim + m7"],["\u{00B0}7","dim + dim7"]], reverse:true}, count:6 },
    { gen:"inversion-id", params:{subject:"v7", ask:"position"}, count:2 },
    { type:"mc", q:"How many distinct chord members are in a complete seventh chord?", choices:["4","3","5"], answer:0,
      explain:"The chord members are the root, third, fifth, and seventh. Actual voicings may double or omit a chord member." },
    { type:"mc", q:"Cmaj7 is spelled…", choices:["C-E-G-B","C-E-G-B♭","C-E♭-G-B♭"], answer:0,
      explain:"Major triad + major 7th." },
    { type:"mc", q:"C7 is spelled…", choices:["C-E-G-B♭","C-E-G-B","C-E♭-G♭-B♭"], answer:0,
      explain:"Major triad + minor 7th." },
    { type:"mc", q:"Cm7 is spelled…", choices:["C-E♭-G-B♭","C-E-G-B♭","C-E♭-G♭-A"], answer:0,
      explain:"Minor triad + minor 7th." },
    { type:"truefalse", q:"A half-diminished seventh chord combines a diminished triad with a minor seventh above the root.", answer:true,
      explain:"ø7 = dim + m7." },
    { type:"truefalse", q:"A root-position fully diminished seventh chord consists of three stacked minor thirds.", answer:true,
      explain:"m3+m3+m3 — symmetrical." },
    { type:"truefalse", q:"Cmaj7 and C7 differ in the quality of their seventh above the root.", answer:true,
      explain:"Cmaj7 contains B♮, while C7 contains B♭." },
    { gen:"term-match", params:{subject:"term", pool:[["C-E-G-B","Cmaj7"],["C-E-G-B\u{266D}","C7"],["C-E\u{266D}-G-B\u{266D}","Cm7"],["C-E\u{266D}-G\u{266D}-B𝄫","C\u{00B0}7"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{}, count:2 }
  ],
  vocabulary:[
    {term:"Seventh Chord", def:"A tertian chord built by stacking three 3rds above a root: root, 3rd, 5th, 7th."},
    {term:"Major 7 / Dominant 7", def:"maj7 = M triad + M7. dom7 = M triad + m7."},
    {term:"Minor 7", def:"m triad + m7."},
    {term:"Half-Diminished / Fully Diminished 7", def:"Half-diminished 7 (ø7 / m7♭5) = diminished triad + minor 7th. Fully diminished 7 (°7) = diminished triad + diminished 7th (three stacked minor 3rds — symmetrical)."}
  ],
  mistakes:[],
  summary:[
    "✔ Seventh chord = <b>triad + 7th</b> — four notes.",
    "✔ <b>Major 7</b> = major triad + major 7th.",
    "✔ <b>Dominant 7</b> = major triad + minor 7th.",
    "✔ <b>Minor 7</b> = minor triad + minor 7th.",
    "✔ <b>Half-diminished 7</b> = diminished triad + minor 7th.",
    "✔ <b>Fully diminished 7</b> = diminished triad + diminished 7th.",
    "✔ In major keys: Imaj7 · iim7 · iiim7 · IVmaj7 · V7 · vim7 · viiø7."
  ],
  tips:[
    "Learn the five on C first; the formulas transfer to every root unchanged.",
    "Quick ID: 3rd tells the family (major/minor/dim); the 7th picks the member.",
    "The °7 splits the octave in four equal parts — any of its notes can act as root.",
    "Next lesson: how chord charts WRITE all of these — lead-sheet symbols."
  ],
  rewards:{ badge:"Seventh Collector", icon:"\u{1F455}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify five common seventh-chord types from their triad and seventh qualities.",
  quiz:[
    { type:"mc", q:"In tertian construction, which chord member is added above a triad to form a seventh chord?", choices:["A seventh above the root","A second below the root","A second root"], answer:0,
      explain:"Root-3rd-5th-7th.", hint:"One more 3rd on top." },
    { type:"mc", q:"Major triad + major seventh = …", choices:["major seventh chord","dominant seventh chord","minor seventh chord"], answer:0,
      explain:"Cmaj7: C-E-G-B.", hint:"Both parts major." },
    { type:"mc", q:"Major triad + minor seventh = …", choices:["dominant seventh chord","major seventh chord","half-diminished seventh chord"], answer:0,
      explain:"C7: C-E-G-B♭.", hint:"Lesson 50's chord." },
    { type:"mc", q:"Minor triad + minor seventh = …", choices:["minor seventh chord","major seventh chord","diminished seventh chord"], answer:0,
      explain:"Cm7: C-E♭-G-B♭.", hint:"Double minor." },
    { type:"mc", q:"Diminished triad + minor seventh = …", choices:["half-diminished seventh chord","fully diminished seventh chord","dominant seventh chord"], answer:0,
      explain:"Cø7 = Cm7♭5.", hint:"The triad is diminished, but the seventh is minor rather than diminished." },
    { type:"mc", q:"Diminished triad + diminished seventh = …", choices:["fully diminished seventh chord","half-diminished seventh chord","minor seventh chord"], answer:0,
      explain:"C°7 — all minor 3rds.", hint:"Fully diminished." },
    { type:"mc", q:"Identify the chord.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:160},
      choices:["C7 — dominant seventh chord","Cmaj7 — major seventh chord","Cm7 — minor seventh chord"], answer:0,
      explain:"C-E-G forms a major triad, and B♭ is a minor seventh above C.", hint:"Check the 7th." },
    { type:"mc", q:"Which seventh chord consists of three stacked minor thirds in root position?", choices:["Fully diminished seventh chord","Major seventh chord","Dominant seventh chord"], answer:0,
      explain:"m3 × 3 — evenly divided octave.", hint:"Identify the chord that divides the octave into four equal minor thirds." },
    { type:"truefalse", q:"Cmaj7 and C7 differ by one half step in their seventh.", answer:true,
      explain:"B vs B♭.", hint:"Top-note check." },
    { type:"truefalse", q:"A half-diminished seventh chord may also be represented by the symbol m7♭5.", answer:true,
      explain:"Cø7 and Cm7♭5 represent the same pitch collection and chord quality.", hint:"Lesson 93 preview." },
    { type:"mc", q:"Which seventh-chord quality occurs diatonically on scale degree 5 of a major key?", choices:["Dominant seventh","Major seventh","Fully diminished seventh"], answer:0,
      explain:"G7 in C major.", hint:"Lesson 50." },
    { type:"mc", q:"Which list contains the five common seventh-chord types introduced in this lesson?", choices:["Major seventh, dominant seventh, minor seventh, half-diminished seventh, and fully diminished seventh","Major, minor, augmented, suspended, and power chords","Dominant seventh, major triad, minor triad, octave, and unison"], answer:0,
      explain:"These are five common seventh-chord qualities. Other seventh-chord types also exist.", hint:"All five are seventh chords." }
  ],
  miaPerfect:"Perfect score! You accurately identified five common seventh-chord formulas and spellings.",
  miaPass:"You passed! Next, you will write seventh chords using lead-sheet symbols.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Five common seventh chords on one root: maj7, dom7, m7, ø7, °7 — each with a different interval structure.",
      play:()=>{const ROWS=[[60,64,67,71],[60,64,67,70],[60,63,67,70],[60,63,66,70],[60,63,66,69]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.9,.26)));} },
    learn:{ label:"the five sevenths",
      explain:"Triad + 7th: maj7 (M+M7), dom7 (M+m7), m7 (m+m7), ø7 (d+m7), °7 (d+d7). ID: 3rd first, 7th second.",
      hint:"Two ingredients per chord.",
      play:()=>{[60,64,67,71].forEach(m=>MFAudio.tone(m,.9,.05,.28));} },
    example:{ label:"the examples",
      explain:"Example 1 morphs one note at a time through all five; example 2 chains Dm7-G7-Cmaj7 — three types in one phrase." },
    game:{ label:"the games",
      explain:"Sprint the formulas, build two sevenths by hand, identify notated chords, then match symbols to formulas.",
      hint:"3rd = family, 7th = member." },
    quiz:{ label:"this question",
      explain:"Break every seventh into two questions: what is the TRIAD (M/m/dim)? What is the 7TH (M/m/dim)? The pair names the chord.",
      play:()=>{[60,63,67,70].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
