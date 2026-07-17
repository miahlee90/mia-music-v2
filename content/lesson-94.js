/* Lesson 94 — Seventh-Chord Inversions (Book 4, Unit 23 — SELF-AUTHORED)
   L51-54 covered triad inversions + V7 inversions + figured bass — reviewed
   in ONE step. New: ALL five seventh types invert the same way; figures
   7 / 6-5 / 4-3 / 4-2 apply to every seventh chord; bass-line reading;
   lead-sheet slash equivalents. NOTE: edit by FULL-FILE REWRITE only. */

/* position detective for any seventh chord */
function MF_L94_pos(container,fb){
  const ROUNDS=[
    {name:"Cmaj7, C in the bass", notes:[48,64,67,71], pos:0, expl:"Root in the bass = root position — figure 7."},
    {name:"C7, E in the bass", notes:[52,60,67,70], pos:1, expl:"3rd (E) in the bass = 1st inversion — figure 6/5."},
    {name:"Cm7, G in the bass", notes:[55,60,63,70], pos:2, expl:"5th (G) in the bass = 2nd inversion — figure 4/3."},
    {name:"Cm7♭5, B♭ in the bass", notes:[58,60,63,66], pos:3, expl:"7th (B♭) in the bass = 3rd inversion — figure 4/2."},
    {name:"C°7, G♭ in the bass", notes:[54,60,63,69], pos:2, expl:"5th (G♭) in the bass = 2nd inversion — figure 4/3."}];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l94p-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l94p-play">▶ Hear the voicing</button></div>
    <div class="choices l94p-ch" style="display:none"><button>Root position (7)</button><button>1st inversion (6/5)</button><button>2nd inversion (4/3)</button><button>3rd inversion (4/2)</button></div>`;
  const q=container.querySelector(".l94p-q"), pl=container.querySelector(".l94p-play"), ch=container.querySelector(".l94p-ch");
  pl.onclick=()=>{ const R=ROUNDS[r]; if(!R) return; R.notes.forEach(m=>MFAudio.tone(m,1.0,.05,.28)); played=true; setTimeout(()=>ch.style.display="",1400); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r]; if(!R||!played) return;
    if(i===R.pos){ fb(true,"✓ "+R.expl); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! Positions read from any bass note."; pl.style.display="none"; } else ask();
    } else { MFAudio.tone(40,.2); fb(false,"Which chord member is LOWEST — root, 3rd, 5th or 7th?"); }
  });
  function ask(){ q.innerHTML=`Voicing ${r+1} of ${ROUNDS.length}: <b>${ROUNDS[r].name}</b>. Which position?`; }
  ask();
}

LESSON_CONTENT[94]={stackFigures:true,
  welcome:"A seventh chord has four chord members, so it has four possible bass positions.",
  hook:{
    say:"<b>A complete seventh chord has four chord members, and each one can appear in the bass.</b> Listen to Cmaj7 in root position and three inversions. \u{1F447} <b>Which chord member changes in the bass?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the four positions</button></div>
          <div class="choices hk-ch" style="display:none"><button>The root, third, fifth, and seventh take turns appearing in the bass</button><button>The chord root changes each time</button><button>The chord gains an additional chord member each time</button></div>`;
        const ROWS=[[48,64,67,71],[52,60,67,71],[55,60,64,71],[59,60,64,67]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.26))); setTimeout(()=>ch.style.display="",ROWS.length*900+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The underlying chord remains Cmaj7, but a different chord member appears in the bass: the root, third, fifth, or seventh. These produce root position and three inversions.");
          else fb(false,"The chord root and quality remain the same. Listen to the lowest pitch in each example.");
        });
      } }
  },
  objectives:[
    "Extend triad inversion concepts to seventh chords",
    "Identify the four positions of a seventh chord",
    "Read the figured-bass symbols: 7, 6/5, 4/3, 4/2",
    "Identify the bass note in each inversion",
    "Connect figured bass with modern slash-chord notation",
    "Understand why inversions improve bass motion and voice leading"
  ],
  steps:[
    { say:"<b>From triads to sevenths:</b> you already know triads have <b>three positions</b> (root, 1st, 2nd inversion). A seventh chord extends the same idea by adding <b>one more inversion</b> — because it has <b>four</b> chord members instead of three. Figured-bass numbers still measure intervals above the bass. \u{1F447} <b>In figured bass, intervals are measured above which note?</b>",
      try:{ type:"mc", choices:["The bass note","The chord root","The soprano note"], answer:0,
        success:"✓ Correct. Figured-bass numbers identify intervals above the notated or sounding bass pitch.",
        fail:"Recall the reference note used for figured-bass intervals.",
        hint:"Measure each interval upward from the lowest voice." } },
    { say:"<b>Four Positions of a Seventh Chord:</b> any of the four chord members can sit in the bass — that gives root position plus three inversions. The bass note determines the figure. \u{1F447} <b>How many inversions does a seventh chord have?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Bass note</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Position</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Figured bass</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">Root</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">root position</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">7</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">3rd</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">1st inversion</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">6\u{2085} (6/5)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">5th</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">2nd inversion</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">4\u{2083} (4/3)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">7th</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">3rd inversion</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">4\u{2082} (4/2)</td></tr></table>` },
      try:{ type:"mc", choices:["Three inversions, in addition to root position","One inversion","Seven inversions"], answer:0,
        success:"✓ Correct. A seventh chord has four possible bass positions: root position and three inversions.",
        fail:"Count the four chord members that can appear in the bass.",
        hint:"Four bass positions minus root position equals three inversions." } },
    { say:"<b>One Chord, Two Notations:</b> take <b>G7 (G–B–D–F)</b> in C major. Change only the bass note and you move through all four positions. Lead sheets write the bass after a slash; Roman-numeral analysis writes the figured-bass number. <b>Both describe the same inversion.</b> \u{1F447} <b>In C major, G7 has F in the bass. How is the chord labeled?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:320px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Lead sheet</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Roman / figured</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Bass</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;text-align:center">G7</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V7</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">G (root)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;text-align:center">G7/B</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V6/5</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">B (3rd)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;text-align:center">G7/D</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V4/3</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">D (5th)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;text-align:center">G7/F</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V4/2</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">F (7th)</td></tr></table>` },
      try:{ type:"mc", choices:["Third inversion — V\u{2074}\u{2082}","First inversion — V\u{2076}\u{2085}","Root position — V\u{2077}"], answer:0,
        success:"✓ Correct. F is the seventh of G–B–D–F. A seventh chord with its seventh in the bass is in third inversion and carries the figure 4/2.",
        fail:"Identify F's chord-member role within G–B–D–F.",
        hint:"F is a minor seventh above the root G." } },
    { say:"<b>Same Figures for Every Quality:</b> the inversion depends <b>only on the bass note</b> — the chord quality does not matter. The same figures (7 · 6/5 · 4/3 · 4/2) apply to <b>Cmaj7, C7, Cm7, Cm7♭5, and C°7</b> alike. The figure names the position; the chord symbol or Roman numeral names the root and quality. \u{1F447} <b>Am7 has G in the bass. Which inversion figure applies?</b>",
      try:{ type:"mc", choices:["4/2 — G is the seventh","6/5 — G is the third","7 — G is the root"], answer:0,
        success:"✓ Correct. G is the seventh of A–C–E–G, so Am7/G is in third inversion and carries the figure 4/2.",
        fail:"Spell Am7 in thirds: A–C–E–G. Identify G's relationship to the root.",
        hint:"G is the seventh above A." } },
    { say:"<b>Slash Chords and Figured-Bass Symbols:</b> Lead-sheet notation specifies the bass pitch after a slash. In C major, <b>G7/B</b> represents a G dominant seventh chord with B in the bass. Roman-numeral analysis labels the same chord and inversion <b>V\u{2076}\u{2085}</b>. These symbols identify the same chord and bass position, but they do not necessarily prescribe an identical upper-voice voicing. \u{1F447} <b>Which figured-bass inversion corresponds to Dm7/C?</b>",
      try:{ type:"mc", choices:["4/2 — C is the seventh","6/5 — F is the bass","7 — D is the bass"], answer:0,
        success:"✓ Correct. C is the seventh of D–F–A–C, so Dm7/C is a third-inversion seventh chord with the figure 4/2.",
        fail:"Spell Dm7 in root position: D–F–A–C.",
        hint:"Identify C's chord-member role." } },
    { say:"Identify each inversion from the chord spelling and bass pitch, then compare its sound with the other positions. \u{1F447}",
      try:{ type:"custom",
        hint:"Spell the chord in root position and identify which chord member appears in the bass.",
        mount:(container,fb)=>MF_L94_pos(container,fb) } },
    { say:"<b>Why Use Inversions? Smoother Bass Motion.</b> Compare two versions of the same chords:<br><b>C → G7 → Am</b> — bass leaps C → G → A.<br><b>C → G7/B → Am</b> — bass steps C → B → A.<br>The inversion turns a leaping bass into a smooth, stepwise line — better voice leading with the same harmony. \u{1F447} <b>Which is an important musical use of chord inversions?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:13.5px">
        <div style="border:2px solid #999;border-radius:10px;padding:8px 14px;text-align:center"><b>C → G7 → Am</b><br><span style="color:#C05A21">bass C – G – A</span><br><span style="font-size:12px;color:#555">leaps</span></div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px;text-align:center"><b>C → G7/B → Am</b><br><span style="color:#2F6DA8">bass C – B – A</span><br><span style="font-size:12px;color:#555">stepwise ✓</span></div></div>` },
      try:{ type:"mc", choices:["Creating smoother bass motion and more efficient voice leading","Automatically increasing the dynamic level","Automatically increasing the tempo"], answer:0,
        success:"✓ Correct. An appropriate inversion can reduce bass leaps and connect adjacent chords more smoothly.",
        fail:"Compare the bass intervals in the root-position and inverted versions.",
        hint:"Look for the version with smaller bass intervals." } },
    { say:"<b>Review:</b> \u{1F447} <b>In C major, which slash chord matches V4/3?</b>",
      try:{ type:"mc", choices:["G7/D","G7/B","G7/F"], answer:0,
        success:"✓ Correct. V4/3 puts the 5th in the bass; G7's 5th is D, so V4/3 = G7/D.",
        fail:"4/3 = second inversion = the 5th in the bass. What is the 5th of G7?",
        hint:"G–B–D–F: the 5th is D." } }
  ],
  examples:[
    { caption:"G7 in all four positions: 7 → 6/5 → 4/3 → 4/2. Same four notes; the bass rotates through root, 3rd, 5th, 7th.",
      staff:{clef:"treble",tempo:66,notes:[
        {p:"G3",d:"w",label:"7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"B3",d:"w",label:"6/5"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"4/3"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"4/2"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:53,octaves:1.9167,labels:true} },
    { caption:"Inversions building the bass line: I → V4/2 → I6 → ii6/5 → V7 → I. The bass moves C-F-E-F-G-C — the 4/2 and 6/5 keep the middle stepwise.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"V4/2"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"E4",d:"w",label:"I6"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"F4",d:"w",label:"ii6/5"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"G3",d:"w",label:"V7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:680},
      kb:{start:53,octaves:1.9167,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Inversion-Figure Sprint (45s)",
      intro:"Match each bass chord member with its seventh-chord inversion figure.",
      miaIntro:"Root position, first, second, and third inversion.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Root in the bass","7 (root position)"],
        ["3rd in the bass","6/5 (1st inversion)"],
        ["5th in the bass","4/3 (2nd inversion)"],
        ["7th in the bass","4/2 (3rd inversion)"],
        ["The figures apply to","any seventh-chord quality"],
        ["G7/B in figures","V6/5"],
        ["Dm7/C in figures","ii4/2 (in C)"],
        ["A common use of inversions","smooth bass lines"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Inversion figures identified!":null },
    { type:"key-climb", title:"Game 2 · Rotate the Bass",
      intro:"Play G7 in all four positions, placing G, B, D, and F in the bass in turn.",
      miaIntro:"Keep the G7 chord identity while changing the bass chord member.",
      spec:{seq:[55,59,62,65],
        names:["G (root — 7)","B (3rd — 6/5)","D (5th — 4/3)","F (7th — 4/2)"],
        start:53, octaves:1, title:"One chord, four bass notes"},
      result:(score)=>score!==null?"You performed all four bass positions of G7.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Position",
      intro:"Examine each G7 voicing and identify its bass position.",
      miaIntro:"Identify the lowest note and its role in G7.",
      spec:{rounds:6, pool:[
        {label:"Root position (7)", spec:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"1st inversion (6/5)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"2nd inversion (4/3)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"3rd inversion (4/2)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the inversions correctly.":null },
    { type:"term-race", title:"Game 4 · Slash Symbol and Figure",
      intro:"Translate between slash-chord symbols and Roman-numeral inversion figures.",
      miaIntro:"Match the chord root, quality, and bass pitch.",
      spec:{rounds:8, reverse:true, pool:[
        ["G7/B","V6/5 in C"],
        ["G7/D","V4/3 in C"],
        ["G7/F","V4/2 in C"],
        ["Cmaj7/E","Imaj 6/5 in C"],
        ["Root position slash","no slash needed"],
        ["6/5's bass member","the 3rd"],
        ["4/3's bass member","the 5th"],
        ["4/2's bass member","the 7th"]]},
      result:(score)=>score>=6?"You translated both notation systems correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on seventh-chord positions, figured-bass symbols, and slash chords. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Root bass","7"],["3rd bass","6/5"],["5th bass","4/3"],["7th bass","4/2"],["G7/F","4/2"],["Figures count from","the bass"]], reverse:true}, count:6 },
    { gen:"inversion-id", params:{subject:"v7", ask:"both"}, count:4 },
    { type:"mc", q:"A seventh chord has how many positions (including root)?", choices:["4","3","2"], answer:0,
      explain:"A complete seventh chord has four bass positions: root position and three inversions." },
    { type:"mc", q:"The figure 6/5 means the bass is the chord's…", choices:["3rd","root","7th"], answer:0,
      explain:"The figure 6/5 indicates first inversion, with the chordal third in the bass." },
    { type:"mc", q:"The figure 4/2 means the bass is the chord's…", choices:["7th","5th","3rd"], answer:0,
      explain:"The figure 4/2 indicates third inversion, with the chordal seventh in the bass." },
    { type:"mc", q:"Cm7 with G in the bass is…", choices:["2nd inversion (4/3)","1st inversion","root position"], answer:0,
      explain:"Cm7/G is in second inversion because G is the fifth of C–E♭–G–B♭." },
    { type:"truefalse", q:"The inversion figures 7, 6/5, 4/3, and 4/2 can be applied to different seventh-chord qualities.", answer:true,
      explain:"They apply to seventh chords of any quality." },
    { type:"truefalse", q:"In C major, G7/B and V\u{2076}\u{2085} identify the same chord and bass position.", answer:true,
      explain:"Both identify G7 with B, the chordal third, in the bass. The upper voices may be arranged in different ways." },
    { type:"truefalse", q:"Chord inversions can create smoother bass lines and more efficient voice leading.", answer:true,
      explain:"They can also provide harmonic prolongation, retain common tones, and create different sonorities." },
    { gen:"inversion-id", params:{subject:"v7", ask:"figure"}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Four Positions", def:"Root in bass → 3rd in bass → 5th in bass → 7th in bass."},
    {term:"Figured Bass", def:"7 · 6/5 · 4/3 · 4/2 — one figure per bass position."},
    {term:"Slash Chords", def:"G7 · G7/B · G7/D · G7/F — same harmony, different bass note."},
    {term:"Important Rule", def:"Changing inversion changes only the bass note. Chord quality never changes."}
  ],
  mistakes:[],
  summary:[
    "✔ Seventh chords have <b>FOUR positions</b>.",
    "✔ Root in bass = <b>7</b>.",
    "✔ 3rd in bass = <b>6/5</b>.",
    "✔ 5th in bass = <b>4/3</b>.",
    "✔ 7th in bass = <b>4/2</b>.",
    "✔ Inversion changes only the <b>bass note</b>.",
    "✔ Chord <b>quality never changes</b>.",
    "✔ Slash chords and figured bass describe the same bass position in different notation systems.",
    "✔ Inversions often create <b>smoother bass motion</b> and better voice leading."
  ],
  tips:[
    "Memory aid: the figures COUNT DOWN as the bass climbs — 7, 65, 43, 42.",
    "In conventional tonal voice leading, 4/2 chords often resolve to 6 chords: the bass 7th steps down to the next chord's 3rd.",
    "At the keyboard, rotate one seventh chord through all four positions daily — pick a new type each day.",
    "Next lesson: chaining chords into the progressions everyone plays."
  ],
  rewards:{ badge:"Position Master", icon:"\u{1F504}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Spell the chord, identify the bass chord member, and select the inversion figure.",
  quiz:[
    { type:"mc", q:"How many inversions does a seventh chord have?", choices:["Three","Two","Four"], answer:0,
      explain:"A seventh chord has three inversions plus root position, for four total positions.", hint:"Four notes, minus the root." },
    { type:"mc", q:"Which abbreviated figure identifies a root-position seventh chord?", choices:["7","6/5","4/2"], answer:0,
      explain:"The full intervals above the bass are 7/5/3, conventionally abbreviated as 7.", hint:"Simplest figure." },
    { type:"mc", q:"1st inversion (3rd in the bass) takes…", choices:["6/5","4/3","7"], answer:0,
      explain:"The 6/5 chord.", hint:"After 7 comes…" },
    { type:"mc", q:"2nd inversion (5th in the bass) takes…", choices:["4/3","6/5","4/2"], answer:0,
      explain:"The 4/3 chord.", hint:"The middle figure." },
    { type:"mc", q:"3rd inversion (7th in the bass) takes…", choices:["4/2","4/3","6/5"], answer:0,
      explain:"The 4/2 chord — unique to sevenths.", hint:"The last figure." },
    { type:"mc", q:"Identify the position.",
      staff:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:160},
      choices:["G7 in first inversion: G7/B or V\u{2076}\u{2085} in C major","G7 in root position","G7 in third inversion"], answer:0,
      explain:"B, the third of G7, appears in the bass.", hint:"Name the bass member." },
    { type:"mc", q:"Fmaj7/E is in…", choices:["third inversion: 4/2","first inversion: 6/5","root position: 7"], answer:0,
      explain:"E is Fmaj7's 7th (F-A-C-E).", hint:"Spell it first." },
    { type:"mc", q:"Which lead-sheet symbol corresponds to ii\u{2076}\u{2085} in C major?", choices:["Dm7/F","Dm7/C","Dm7"], answer:0,
      explain:"3rd (F) in the bass.", hint:"6/5 = 3rd downstairs." },
    { type:"truefalse", q:"The figure 4/2 can identify third inversion of a minor seventh chord.", answer:true,
      explain:"The inversion figure identifies intervals above the bass and chord position; the Roman numeral or chord symbol identifies root and quality.", hint:"Universal figures." },
    { type:"truefalse", q:"A triad can appear in third inversion.", answer:false,
      explain:"A triad has only three chord members and therefore has root position and two inversions.", hint:"Count the notes." },
    { type:"mc", q:"In conventional tonal voice leading, why does a third-inversion seventh chord often move to a first-inversion chord?", choices:["The chordal seventh in the bass normally resolves downward by step","The first chord must be performed more loudly","The progression eliminates dominant function"], answer:0,
      explain:"For example, D7/C may resolve to G/B as the bass moves downward from C to B.", hint:"Where does a 7th want to go?" },
    { type:"mc", q:"Which is an important purpose of chord inversions?", choices:["Shaping bass lines and improving voice leading","Changing the chord root","Increasing the tempo"], answer:0,
      explain:"Inversions allow the bass and upper voices to connect chords in varied and efficient ways.", hint:"Lesson 55's principle." }
  ],
  miaPerfect:"Perfect score! You accurately identified all positions and inversion figures of seventh chords.",
  miaPass:"You passed! Next, you will study common chord progressions.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Cmaj7 four ways: the bass rotated root → 3rd → 5th → 7th while the chord stayed itself — four positions.",
      play:()=>{const ROWS=[[48,64,67,71],[52,60,67,71],[55,60,64,71],[59,60,64,67]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.26)));} },
    learn:{ label:"seventh inversions",
      explain:"Four positions: 7, 6/5, 4/3, 4/2 by bass member (root/3rd/5th/7th) — the same for any seventh-chord quality; slashes say it in lead-sheet.",
      hint:"Find the bass, name its role.",
      play:()=>{[50,55,59,65].forEach(m=>MFAudio.tone(m,.9,.05,.28));} },
    example:{ label:"the examples",
      explain:"Example 1 rotates G7 through all four positions; example 2 builds a stepwise bass from inversions." },
    game:{ label:"the games",
      explain:"Sprint the figures, rotate a bass by hand, spot positions on cards, then translate slash ↔ figure.",
      hint:"7-65-43-42." },
    quiz:{ label:"this question",
      explain:"One question always works: which chord member is in the BASS? Root=7, 3rd=6/5, 5th=4/3, 7th=4/2.",
      play:()=>{[52,60,67,71].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
