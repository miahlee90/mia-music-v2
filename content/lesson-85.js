/* Lesson 85 — Diatonic Triads (Book 4, Unit 21 — SELF-AUTHORED)
   Core: build a triad on EVERY scale degree. Major key qualities:
   I ii iii IV V vi vii° = M m m M M m dim. Harmonic minor:
   i ii° III+ iv V VI vii° (L60 introduced this — reviewed here).
   Case convention: upper = major, lower = minor, ° = dim, + = aug.
   This lesson is the prerequisite for Roman numeral analysis.
   NOTE: edit by FULL-FILE REWRITE only. */

/* quality detective: name the quality of the triad on each degree of C major */
function MF_L85_quality(container,fb){
  const DEG=[["I","C-E-G","M",0],["ii","D-F-A","m",1],["iii","E-G-B","m",2],["IV","F-A-C","M",3],["V","G-B-D","M",4],["vi","A-C-E","m",5],["vii°","B-D-F","d",6]];
  const CH={0:[60,64,67],1:[62,65,69],2:[64,67,71],3:[65,69,72],4:[67,71,74],5:[69,72,76],6:[71,74,77]};
  const ORDER=[0,3,1,4,6,2,5];
  let r=0;
  container.innerHTML=`<div class="big-q l85q-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l85q-play">▶ Hear the triad</button></div>
    <div class="choices chips l85q-ch"><button>Major</button><button>Minor</button><button>Diminished</button></div>`;
  const q=container.querySelector(".l85q-q"), pl=container.querySelector(".l85q-play"), ch=container.querySelector(".l85q-ch");
  function ask(){
    if(r>=ORDER.length){ q.textContent="Excellent! All seven diatonic qualities identified."; pl.style.display="none"; ch.style.display="none"; return; }
    const D=DEG[ORDER[r]];
    q.innerHTML=`Triad ${r+1} of 7 — degree <b>${D[0]}</b> (${D[1]}). What quality?`;
  }
  pl.onclick=()=>{ const D=DEG[ORDER[r]]; if(!D) return; CH[D[3]].forEach(m=>MFAudio.tone(m,.9,.05,.3)); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const D=DEG[ORDER[r]]; if(!D) return;
    const map={0:"M",1:"m",2:"d"};
    if(map[i]===D[2]){ CH[D[3]].forEach(m=>MFAudio.tone(m,.7,.05,.28));
      fb(true,`✓ ${D[0]} (${D[1]}) is ${i===0?"MAJOR":i===1?"minor":"diminished"} — the pattern M-m-m-M-M-m-d° never changes in major keys.`);
      r++; setTimeout(ask,1300);
    } else { MFAudio.tone(40,.2); fb(false,"Stack the 3rds and measure them — or recall the pattern M-m-m-M-M-m-d°."); }
  });
  ask();
}

LESSON_CONTENT[85]={
  welcome:"Build a diatonic triad on each scale degree.",
  hook:{
    say:"<b>Build a triad on each degree of the major scale by stacking diatonic thirds.</b> Listen to all seven triads. \u{1F447} <b>Do they have the same quality?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play all seven triads</button></div>
          <div class="choices hk-ch" style="display:none"><button>No — some are major, some are minor, and one is diminished</button><button>Yes — all seven are major</button><button>Yes — all seven are minor</button></div>`;
        const CH=[[60,64,67],[62,65,69],[64,67,71],[65,69,72],[67,71,74],[69,72,76],[71,74,77],[72,76,79]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ CH.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.55,i*.6,.26))); setTimeout(()=>ch.style.display="",CH.length*600+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. In a major key, the diatonic triads are major on scale degrees 1, 4, and 5; minor on 2, 3, and 6; and diminished on 7.");
          else fb(false,"Listen again and compare the quality of each triad. The seventh triad contains a diminished fifth.");
        });
      } }
  },
  objectives:[
    "Build a triad on every degree of the major scale",
    "Memorize the major-key pattern: M-m-m-M-M-m-dim",
    "Write the numerals with correct case: I ii iii IV V vi vii°",
    "Review the harmonic-minor pattern: i ii° III+ iv V VI vii°",
    "Identify any diatonic triad's quality by ear and by eye",
    "Prepare for Roman numeral analysis"
  ],
  steps:[
    { say:"<b>Diatonic Triads:</b> Build a diatonic triad by stacking two thirds above a scale degree while using only notes from the given scale. A seven-note scale produces one diatonic triad on each of its seven degrees. \u{1F447} <b>A triad diatonic to a given scale uses…</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"iii"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:560} },
      try:{ type:"mc", choices:["Only notes from that scale","Any chromatic notes","Only notes played on black keys"], answer:0,
        success:"✓ Correct. A triad diatonic to a specific scale is constructed entirely from notes in that scale.",
        fail:"Check whether every chord member belongs to the given scale.",
        hint:"Use only the seven notes of the specified scale." } },
    { say:"<b>The Major-Scale Triad Pattern:</b> Stacking diatonic thirds on the seven degrees of any major scale produces the following pattern: <b>major–minor–minor–major–major–minor–diminished</b>. In Roman numerals: I–ii–iii–IV–V–vi–vii°. \u{1F447} <b>Which scale degrees support major diatonic triads in a major key?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Degree</th><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#2F6DA8">I</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">ii</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">iii</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#2F6DA8">IV</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#2F6DA8">V</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">vi</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">vii°</td></tr>
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Quality</th><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#2F6DA8">Major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#2F6DA8">Major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#2F6DA8">Major</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;color:#C05A21">minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800">dim</td></tr></table>` },
      try:{ type:"mc", choices:["1, 4, and 5: I, IV, and V","2, 3, and 6: ii, iii, and vi","Only scale degree 1: I"], answer:0,
        success:"✓ Correct. The diatonic triads on scale degrees 1, 4, and 5 are major. The triads on 2, 3, and 6 are minor, and the triad on 7 is diminished.",
        fail:"Recall the major-scale pattern: I–ii–iii–IV–V–vi–vii°.",
        hint:"Scale degrees 1, 4, and 5." } },
    { say:"<b>Roman-Numeral Case and Symbols:</b> An uppercase Roman numeral indicates a triad with a major third above its root; without an additional symbol, it represents a major triad. A lowercase numeral without an additional symbol represents a minor triad. Add ° for a diminished triad and + for an augmented triad: I, ii, vii°, and III+. \u{1F447} <b>What does the Roman numeral “vi” indicate?</b>",
      try:{ type:"mc", choices:["A minor triad built on scale degree 6","A major triad built on scale degree 6","A diminished triad built on scale degree 6"], answer:0,
        success:"✓ Correct. The lowercase numeral indicates minor quality, and vi identifies scale degree 6 as the root.",
        fail:"Read both the numeral and its capitalization.",
        hint:"A lowercase numeral without an additional symbol indicates a minor triad." } },
    { say:"<b>Triads from the Harmonic Minor Scale:</b> Raising the 7th scale degree changes several triad qualities. Most importantly, <b>V becomes major</b> and <b>vii° becomes diminished</b>, creating a stronger pull to the tonic. \u{1F447} <b>When triads are built from the harmonic minor scale, what is the quality of V?</b>",
      try:{ type:"mc", choices:["Major, because it contains the raised seventh scale degree","Minor","Diminished"], answer:0,
        success:"✓ Correct. The raised seventh is the third of the dominant triad, changing v to V.",
        fail:"Identify the raised scale degree and its position within the dominant triad.",
        hint:"The raised seventh is the third of V." } },
    { say:"Identify each triad's quality from its notation and sound. \u{1F447}",
      try:{ type:"custom",
        hint:"In a major scale, the pattern is major–minor–minor–major–major–minor–diminished.",
        mount:(container,fb)=>MF_L85_quality(container,fb) } },
    { say:"<b>Why This Matters:</b> Diatonic triads provide a foundation for tonal harmony. Understanding their roots and qualities prepares students to study chord progressions, cadences, and Roman-numeral analysis. \u{1F447} <b>How many root-position triads can be constructed on the seven degrees of a given seven-note scale?</b>",
      try:{ type:"mc", choices:["Seven — one on each scale degree","Three","Twelve"], answer:0,
        success:"✓ Correct. A seven-note scale provides seven possible triad roots, producing one diatonic triad on each scale degree.",
        fail:"Build one triad on each of the seven scale degrees.",
        hint:"Count the scale degrees." } },
    { say:"<b>Review:</b> \u{1F447} <b>In a major key, what is the quality of the diatonic triad on scale degree 7?</b>",
      try:{ type:"mc", choices:["Diminished: vii°","Major: VII","Augmented: VII+"], answer:0,
        success:"✓ Correct. The leading-tone triad consists of two stacked minor thirds and contains a diminished fifth, so it is labeled vii°.",
        fail:"Recall the quality of the final triad in the major-scale pattern.",
        hint:"I–ii–iii–IV–V–vi–?" } }
  ],
  examples:[
    { caption:"The complete C major triad ladder: I ii iii IV V vi vii° and home again — listen for bright (M), dark (m) and tense (°) as it climbs.",
      staff:{clef:"treble",tempo:76,notes:[
        {p:"C4",d:"q",label:"I"},{p:"E4",d:"q",chord:true},{p:"G4",d:"q",chord:true},
        {p:"D4",d:"q",label:"ii"},{p:"F4",d:"q",chord:true},{p:"A4",d:"q",chord:true},
        {p:"E4",d:"q",label:"iii"},{p:"G4",d:"q",chord:true},{p:"B4",d:"q",chord:true},
        {p:"F4",d:"q",label:"IV"},{p:"A4",d:"q",chord:true},{p:"C5",d:"q",chord:true},
        {p:"G4",d:"q",label:"V"},{p:"B4",d:"q",chord:true},{p:"D5",d:"q",chord:true},
        {p:"A4",d:"q",label:"vi"},{p:"C5",d:"q",chord:true},{p:"E5",d:"q",chord:true},
        {p:"B4",d:"q",label:"vii°"},{p:"D5",d:"q",chord:true},{p:"F5",d:"q",chord:true},
        {p:"C5",d:"w",label:"I"},{p:"E5",d:"w",chord:true},{p:"G5",d:"w",chord:true},{bar:"final"}],width:680},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"A harmonic-minor ladder in A minor: i ii° III+ iv V VI vii° — the G♯ colors III+ augmented, V major and vii° diminished.",
      staff:{clef:"treble",tempo:76,notes:[
        {p:"A3",d:"q",label:"i"},{p:"C4",d:"q",chord:true},{p:"E4",d:"q",chord:true},
        {p:"B3",d:"q",label:"ii°"},{p:"D4",d:"q",chord:true},{p:"F4",d:"q",chord:true},
        {p:"C4",d:"q",label:"III+"},{p:"E4",d:"q",chord:true},{p:"G#4",d:"q",chord:true},
        {p:"D4",d:"q",label:"iv"},{p:"F4",d:"q",chord:true},{p:"A4",d:"q",chord:true},
        {p:"E4",d:"q",label:"V"},{p:"G#4",d:"q",chord:true},{p:"B4",d:"q",chord:true},
        {p:"F4",d:"q",label:"VI"},{p:"A4",d:"q",chord:true},{p:"C5",d:"q",chord:true},
        {p:"G#4",d:"q",label:"vii°"},{p:"B4",d:"q",chord:true},{p:"D5",d:"q",chord:true},
        {p:"A4",d:"w",label:"i"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:680},
      kb:{start:57,octaves:1.5833,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Triad-Quality Pattern (45s)",
      intro:"Identify the diatonic triad quality on each major-scale degree before time runs out.",
      miaIntro:"Major–minor–minor–major–major–minor–diminished.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["I, IV, V in major","major triads"],
        ["ii, iii, vi in major","minor triads"],
        ["vii°","diminished"],
        ["Uppercase numeral","major quality"],
        ["Lowercase numeral","minor quality"],
        ["° symbol","diminished"],
        ["+ symbol","augmented"],
        ["III+ (harmonic minor)","augmented triad"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Major-scale triad pattern completed!":null },
    { type:"key-climb", title:"Game 2 · Climb the Triad Roots",
      intro:"Play the roots of the seven diatonic triads in C major, ascending from C to B.",
      miaIntro:"Each scale degree becomes a triad root.",
      spec:{seq:[60,62,64,65,67,69,71,72],
        names:["C (I)","D (ii)","E (iii)","F (IV)","G (V)","A (vi)","B (vii°)","C (I)"],
        start:60, octaves:1, title:"Diatonic roots, degree by degree"},
      result:(score)=>score!==null?"You played all seven triad roots correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Which Triad Is It?",
      intro:"Examine each diatonic triad in C major and select its Roman numeral.",
      miaIntro:"Identify the root, scale degree, and triad quality.",
      spec:{rounds:6, pool:[
        {label:"ii (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"IV (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"vi (A-C-E)", spec:{clef:"treble",notes:[{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:150}},
        {label:"vii° (B-D-F)", spec:{clef:"treble",notes:[{p:"B4",d:"w"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You matched the triads with their Roman numerals.":null },
    { type:"term-race", title:"Game 4 · Roman-Numeral Quality",
      intro:"Identify each triad's quality from its Roman numeral and symbol.",
      miaIntro:"Read the capitalization and any quality symbol.",
      spec:{rounds:8, reverse:true, pool:[
        ["I","major tonic triad"],
        ["ii","minor supertonic triad"],
        ["iii","minor mediant triad"],
        ["IV","major subdominant triad"],
        ["V","major dominant triad"],
        ["vi","minor submediant triad"],
        ["vii°","diminished leading-tone triad"],
        ["i (minor key)","minor tonic triad"]]},
      result:(score)=>score>=6?"You interpreted the Roman numerals correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on triad qualities, Roman-numeral notation, and major and harmonic-minor scale patterns. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["I IV V","major"],["ii iii vi","minor"],["vii°","diminished"],["Uppercase","major"],["Lowercase","minor"],["°","diminished"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:3 },
    { type:"mc", q:"How many triads can be built on the degrees of a given seven-note scale?", choices:["7","3","12"], answer:0,
      explain:"Build one triad on each of the seven scale degrees." },
    { type:"mc", q:"Which sequence shows the diatonic triad qualities produced by a major scale?", choices:["M-m-m-M-M-m-dim","M-M-M-m-m-m-dim","m-M-m-M-m-M-m"], answer:0,
      explain:"Fixed for every major key." },
    { type:"mc", q:"In G major, what is the quality and Roman numeral of the diatonic triad A-C-E?", choices:["Minor: ii","Major: II","Diminished: ii°"], answer:0,
      explain:"Degree 2 is always minor in major keys." },
    { type:"mc", q:"When triads are built from the harmonic minor scale, the triad rooted on the raised seventh is…", choices:["Diminished: vii°","Major: VII","Minor: vii"], answer:0,
      explain:"Same as major's vii° — the leading-tone triad." },
    { type:"truefalse", q:"An uppercase Roman numeral without an additional quality symbol indicates a major triad.", answer:true,
      explain:"An augmented triad also uses an uppercase numeral but adds the symbol +." },
    { type:"truefalse", q:"In a major key, the diatonic iii triad is minor.", answer:true,
      explain:"Lowercase iii = minor." },
    { type:"truefalse", q:"When triads are built strictly from the harmonic minor scale, III+ is augmented.", answer:true,
      explain:"The raised seventh forms an augmented fifth above the third scale degree. In tonal minor harmony, the unaltered major III is also common." },
    { gen:"triad-id", params:{}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Diatonic Triads", def:"The seven triads built on the scale degrees using only the key's own notes."},
    {term:"Major-Key Pattern", def:"I ii iii IV V vi vii° = M-m-m-M-M-m-diminished. Identical in every major key."},
    {term:"Harmonic-Minor Pattern", def:"i ii° III+ iv V VI vii° — the raised 7th creates III+, major V and vii°."},
    {term:"Case Convention", def:"UPPERCASE = major · lowercase = minor · ° = diminished · + = augmented."}
  ],
  mistakes:[],
  summary:[
    "✔ Seven degrees → <b>seven diatonic triads</b>, built only from the key's notes.",
    "✔ Major keys: <b>M-m-m-M-M-m-d°</b> — I ii iii IV V vi vii°, always.",
    "✔ Harmonic minor: <b>i ii° III+ iv V VI vii°</b> — the raised 7th does the coloring.",
    "✔ <b>Case shows quality</b>: I vs i, plus ° and +.",
    "✔ This family is the vocabulary for progressions, cadences and analysis."
  ],
  tips:[
    "Memorize by groups: majors 1-4-5, minors 2-3-6, diminished 7 — three facts instead of seven.",
    "At the keyboard, play the triad ladder daily in one new key — the pattern transfers by itself.",
    "vii° sounds like V7 missing its root — they share three notes and one job.",
    "Next lesson: give every chord its NUMERAL and its FUNCTION — Roman numeral analysis."
  ],
  rewards:{ badge:"Chord Family Keeper", icon:"\u{1F3D7}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Apply the major-scale triad pattern and interpret Roman-numeral quality symbols.",
  quiz:[
    { type:"mc", q:"A triad diatonic to a specified scale is constructed from…", choices:["only notes belonging to that scale","any chromatic pitches","only pitches played on black keys"], answer:0,
      explain:"Every chord member belongs to the specified scale.", hint:"Check each chord member against the scale." },
    { type:"mc", q:"Which quality pattern results from building triads on every degree of a major scale?", choices:["M-m-m-M-M-m-dim","M-M-M-m-m-m-dim","The pattern varies randomly"], answer:0,
      explain:"Fixed and universal.", hint:"Three majors: 1, 4, 5." },
    { type:"mc", q:"Which scale degrees support minor diatonic triads in a major key?", choices:["2, 3, and 6","1, 4, and 5","5 and 7"], answer:0,
      explain:"ii, iii, vi.", hint:"The lowercase trio." },
    { type:"mc", q:"What is the quality of the diatonic triad on scale degree 7 of a major scale?", choices:["Diminished","Major","Augmented"], answer:0,
      explain:"vii° — two minor 3rds.", hint:"The ° degree." },
    { type:"mc", q:"What does the Roman numeral IV indicate?", choices:["A major triad rooted on scale degree 4","A minor triad rooted on scale degree 4","A diminished triad rooted on scale degree 4"], answer:0,
      explain:"Uppercase = major.", hint:"Read the case." },
    { type:"mc", q:"What does the Roman numeral vii° indicate?", choices:["A diminished triad rooted on scale degree 7","A major triad rooted on scale degree 7","An augmented triad rooted on scale degree 7"], answer:0,
      explain:"The lowercase numeral identifies the root's scale degree, and ° indicates diminished quality.", hint:"The circle." },
    { type:"mc", q:"Identify the Roman numeral in C major.",
      staff:{clef:"treble",notes:[{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:160},
      choices:["vi — A minor","VI — A major","IV — F major"], answer:0,
      explain:"A-C-E is a minor triad rooted on scale degree 6, so it is labeled vi.", hint:"Root A = degree 6." },
    { type:"mc", q:"When triads are constructed strictly from the harmonic minor scale, which triad is augmented?", choices:["III+","V","iv"], answer:0,
      explain:"The raised seventh forms an augmented fifth above the root of III+.", hint:"The + symbol." },
    { type:"mc", q:"Why is V major when it is constructed from the harmonic minor scale?", choices:["The raised seventh is the third of V","Every dominant triad in every musical context is major","The minor-key signature automatically includes the raised seventh"], answer:0,
      explain:"The leading tone forms the major third of the dominant triad.", hint:"Identify the third of the dominant triad." },
    { type:"truefalse", q:"The diatonic triad-quality pattern is the same for every major scale.", answer:true,
      explain:"It is identical in every major key.", hint:"Universal." },
    { type:"truefalse", q:"A triad built on scale degree 2 of the harmonic minor scale is diminished.", answer:true,
      explain:"Using the harmonic minor pitch collection, scale degrees 2, 4, and 6 form a diminished triad.", hint:"The minor pattern's second slot." },
    { type:"mc", q:"In F major, how is the diatonic triad G-B♭-D labeled?", choices:["ii — G minor","II — G major","vii° — E diminished"], answer:0,
      explain:"Degree 2 of F major, minor quality.", hint:"Count from F." }
  ],
  miaPerfect:"Perfect score! You accurately constructed and labeled the seven diatonic triads of the major scale.",
  miaPass:"You passed! Next, you will apply these triads in Roman-numeral analysis.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Seven triads on seven degrees produced three qualities: major (I, IV, V), minor (ii, iii, vi) and diminished (vii°).",
      play:()=>{const CH=[[60,64,67],[62,65,69],[64,67,71],[65,69,72],[67,71,74],[69,72,76],[71,74,77],[72,76,79]];CH.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.5,i*.55,.26)));} },
    learn:{ label:"diatonic triads",
      explain:"Triad per degree, key notes only. Major: M-m-m-M-M-m-d°. Harmonic minor: i ii° III+ iv V VI vii°. Case shows quality; ° dim, + aug.",
      hint:"Majors 1-4-5, minors 2-3-6, dim 7.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.6,0,.3));[62,65,69].forEach(m=>MFAudio.tone(m,.6,.7,.3));[71,74,77].forEach(m=>MFAudio.tone(m,.7,1.4,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 climbs all seven C major triads; example 2 climbs A harmonic minor — hear the G♯ recolor III, V and vii." },
    game:{ label:"the games",
      explain:"Sprint the pattern, walk the roots, match numerals on cards, then decode case and symbols at speed.",
      hint:"Case = quality." },
    quiz:{ label:"this question",
      explain:"Two memorized patterns answer everything: M-m-m-M-M-m-d° (major) and i ii° III+ iv V VI vii° (harmonic minor).",
      play:()=>{[65,69,72].forEach(m=>MFAudio.tone(m,.6,0,.3));[69,72,76].forEach(m=>MFAudio.tone(m,.6,.7,.3));} }
  }
};
