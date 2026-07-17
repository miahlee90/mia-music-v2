/* Lesson 89 — Melodic Sequence (Book 4, Unit 22 — SELF-AUTHORED)
   Core: SEQUENCE = a motive restated successively at different pitch levels
   (the sequential interval and number of statements may vary). TONAL sequence
   stays in the key (qualities adjust); REAL (exact) sequence preserves exact intervals.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[89]={
  welcome:"A melodic sequence repeats an idea at successive pitch levels.",
  hook:{
    say:"<b>Listen to the short melodic idea and its two repetitions.</b> Each statement begins one scale step lower than the previous one. \u{1F447} <b>What happens to the idea?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the passage</button></div>
          <div class="choices hk-ch" style="display:none"><button>The melodic idea repeats at successively lower pitch levels</button><button>The melodic idea repeats at the same pitch level</button><button>The passage contains no repeated melodic idea</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          const M=[[72,71,72,67],[71,69,71,65],[69,67,69,64]];
          let t=0; M.forEach(seg=>{ seg.forEach(m=>{ MFAudio.tone(m,.28,t,.42); t+=.3; }); t+=.15; });
          setTimeout(()=>ch.style.display="",t*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The melodic pattern repeats at successively lower pitch levels, creating a descending melodic sequence.");
          else fb(false,"The melodic pattern remains recognizable, but each statement begins at a lower pitch: C, then B, then A.");
        });
      } }
  },
  objectives:[
    "Define a sequence",
    "Recognize melodic sequences",
    "Distinguish tonal and real sequences",
    "Identify ascending and descending sequences",
    "Recognize sequences on the staff and by ear",
    "Understand how composers use sequences"
  ],
  steps:[
    { say:"<b>Melodic Sequence:</b> a sequence repeats the same musical idea at a different pitch level. If it stays at the same pitch, it is repetition — not a sequence. \u{1F447} <b>What distinguishes a sequence from exact repetition?</b>",
      try:{ type:"mc", choices:["The pattern returns at a different pitch level","The dynamic level increases","The rhythm must change completely"], answer:0,
        success:"✓ Correct. A sequence restates a recognizable melodic pattern at a different pitch level.",
        fail:"Compare the starting pitch of each statement.",
        hint:"The pitch level changes." } },
    { say:"<b>Sequential Pattern:</b> a sequence begins with one statement, then the same idea immediately repeats at new pitch levels. The distance between statements may vary. \u{1F447} <b>Which statement about melodic sequences is accurate?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:104,notes:[
        {p:"C5",d:"8",label:"1st"},{p:"B4",d:"8"},{p:"C5",d:"8"},{p:"G4",d:"8"},
        {p:"B4",d:"8",label:"2nd (down a step)"},{p:"A4",d:"8"},{p:"B4",d:"8"},{p:"F4",d:"8"},
        {p:"A4",d:"8",label:"3rd"},{p:"G4",d:"8"},{p:"A4",d:"8"},{p:"E4",d:"8"},{bar:"final"}],
        beams:[[0,3],[4,7],[8,11]],width:640} },
      try:{ type:"mc", choices:["They restate a pattern at successive pitch levels","They must always move by step","They must always contain exactly three statements"], answer:0,
        success:"✓ Correct. Stepwise sequences with several statements are common, but the sequential interval and number of statements may vary.",
        fail:"Focus on what changes consistently from one statement to the next.",
        hint:"The defining feature is the change in pitch level, not a fixed number of statements." } },
    { say:"<b>Tonal Sequence:</b> a tonal sequence stays within the key. Some interval qualities adjust to remain diatonic. The pattern is still recognizable, even though not every interval is exactly the same. \u{1F447} <b>What happens to the intervals in a tonal sequence?</b>",
      try:{ type:"mc", choices:["Their qualities may adjust to remain within the key","Every interval quality must remain identical","The intervals disappear completely"], answer:0,
        success:"✓ Correct. A tonal sequence follows the notes of the key, so interval qualities may change while the contour and generic interval pattern remain recognizable.",
        fail:"Determine whether the pattern adjusts to the diatonic notes of the key.",
        hint:"A tonal sequence remains within the prevailing key." } },
    { say:"<b>Real Sequence:</b> a real sequence keeps every interval exactly the same. Accidentals may be added to preserve the intervals. \u{1F447} <b>What is the defining feature of a real sequence?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:2px 0">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:10px 16px;background:#fff;min-width:190px">
          <div style="font-weight:800;color:#2F6DA8;margin-bottom:5px">TONAL SEQUENCE</div>
          <div style="font-size:13.5px;color:#333;line-height:1.6">✓ stays in the key<br>✓ interval qualities may change</div></div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:10px 16px;background:#fff;min-width:190px">
          <div style="font-weight:800;color:#C05A21;margin-bottom:5px">REAL SEQUENCE</div>
          <div style="font-size:13.5px;color:#333;line-height:1.6">✓ exact intervals<br>✓ accidentals may appear</div></div></div>` },
      try:{ type:"mc", choices:["It preserves the exact interval pattern of the original statement","It changes the meter with each statement","It requires a new key signature for every note"], answer:0,
        success:"✓ Correct. A real sequence preserves each interval exactly. Accidentals may be necessary to maintain those intervals.",
        fail:"Check whether each interval retains the same number of half steps and the same spelling.",
        hint:"Compare the exact interval qualities in each statement." } },
    { say:"<b>Identifying a Melodic Sequence:</b> look for the same pattern starting at different pitch levels. Compare the shape and rhythm of each statement, then decide if it is tonal or real. \u{1F447} <b>Which passage demonstrates a rising tonal sequence in C major?</b>",
      try:{ type:"mc", choices:["C–D–E, then D–E–F, then E–F–G","C–D–E repeated three times at the same pitch level","Three unrelated melodic patterns"], answer:0,
        success:"✓ Correct. The three-note pattern begins successively on C, D, and E while remaining within C major. Its interval qualities adjust to the key, making it a tonal sequence.",
        fail:"Look for a recognizable pattern beginning at successively higher pitch levels.",
        hint:"Compare the starting pitches C, D, and E." } },
    { say:"<b>Sequence as a Compositional Tool:</b> composers use sequences to:<br>• extend a motive<br>• build intensity<br>• create motion<br>• connect phrases<br>Ascending sequences often increase energy; descending sequences often relax the music. \u{1F447} <b>A composer wants to extend a one-measure motive through successively higher pitch levels. Which technique would be most appropriate?</b>",
      try:{ type:"mc", choices:["A rising sequence","A measure of silence","A key-signature change by itself"], answer:0,
        success:"✓ Correct. A rising sequence restates the motive at successively higher pitch levels, extending the original material.",
        fail:"Restate the same idea at successively higher pitch levels.",
        hint:"Use the developmental technique introduced in this lesson." } },
    { say:"<b>Review:</b> \u{1F447} <b>A motive is restated immediately one scale step lower while remaining diatonic to the key. How is it classified?</b>",
      try:{ type:"mc", choices:["A descending tonal sequence","A descending real sequence","Exact repetition"], answer:0,
        success:"✓ Correct. The changing pitch level makes it a sequence, the downward motion makes it descending, and its adjustment to the key makes it tonal.",
        fail:"Check the change of pitch level, direction, and treatment of interval qualities.",
        hint:"Different level + descending motion + diatonic adjustment." } }
  ],
  examples:[
    { caption:"A descending tonal sequence: one four-note shape stated three times, each a step lower, all inside C major.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"E5",d:"8"},{p:"D5",d:"8"},{p:"E5",d:"8"},{p:"C5",d:"8"},
        {p:"D5",d:"8"},{p:"C5",d:"8"},{p:"D5",d:"8"},{p:"B4",d:"8"},
        {p:"C5",d:"8"},{p:"B4",d:"8"},{p:"C5",d:"8"},{p:"A4",d:"8"},
        {p:"G4",d:"h",label:"arrival"},{bar:"final"}],
        beams:[[0,3],[4,7],[8,11]],width:660},
      kb:{start:65,octaves:0.9167,labels:true} },
    { caption:"A rising sequence building intensity: the same leap-and-step shape climbing three levels, then releasing at the top.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"8"},{p:"E4",d:"8"},{p:"D4",d:"q"},
        {p:"D4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"q"},
        {p:"E4",d:"8"},{p:"G4",d:"8"},{p:"F4",d:"q"},
        {p:"G4",d:"h",label:"peak"},{bar:"final"}],
        beams:[[0,1],[3,4],[6,7]],width:620},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Sequence Identification (45s)",
      intro:"Identify sequences, their direction, and their tonal or real construction.",
      miaIntro:"Recognizable pattern, successive pitch levels.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Sequence","a motive restated at a new pitch level"],
        ["Sequential interval","step, third, fourth, or other"],
        ["Number of statements","varies with musical context"],
        ["Tonal sequence","stays in the key"],
        ["Real (exact) sequence","exact intervals preserved"],
        ["Rising sequence","often builds energy"],
        ["Falling sequence","often relaxes"],
        ["Repetition at the SAME pitch","not a sequence"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Sequence-identification challenge completed!":null },
    { type:"key-climb", title:"Game 2 · Perform a Rising Tonal Sequence",
      intro:"Perform the pattern at three pitch levels: C–E–D, D–F–E, and E–G–F.",
      miaIntro:"Begin each statement one scale step higher.",
      spec:{seq:[60,64,62, 62,65,64, 64,67,65],
        names:["C","E","D (level 1)","D","F","E (level 2)","E","G","F (level 3)"],
        start:60, octaves:0.9167, title:"One shape, three levels"},
      result:(score)=>score!==null?"You performed the rising tonal sequence correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Sequence or Repetition?",
      intro:"Examine each passage and determine whether it contains a sequence, exact repetition, or unrelated material.",
      miaIntro:"Compare both the pattern and its starting pitch level.",
      spec:{rounds:6, pool:[
        {label:"Rising sequence", spec:{clef:"treble",notes:[{p:"C4",d:"8"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"F4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:210}},
        {label:"Falling sequence", spec:{clef:"treble",notes:[{p:"G4",d:"8"},{p:"F4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"D4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:210}},
        {label:"Simple repetition (same level)", spec:{clef:"treble",notes:[{p:"E4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"8"},{p:"F4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:210}},
        {label:"Unrelated notes", spec:{clef:"treble",notes:[{p:"C4",d:"8"},{p:"A4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"8"},{p:"B3",d:"8"},{p:"F4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:210}}]},
      result:(score)=>score>=5?"You classified the passages correctly.":null },
    { type:"term-race", title:"Game 4 · Tonal or Real?",
      intro:"Determine whether each sequence adjusts to the key or preserves exact intervals.",
      miaIntro:"Diatonic adjustment or exact interval preservation?",
      spec:{rounds:8, reverse:true, pool:[
        ["Interval qualities adjust to the key","tonal sequence"],
        ["Exact interval qualities preserved","real sequence"],
        ["Also called diatonic","tonal"],
        ["Often needs accidentals","real (exact)"],
        ["Shape climbing by step","rising sequence"],
        ["Shape sinking by step","falling sequence"],
        ["Development's workhorse","the sequence"],
        ["Lesson 72's connection","motive development"]]},
      result:(score)=>score>=6?"You classified the tonal and real sequences correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on melodic patterns, sequential levels, direction, and tonal and real sequences. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Sequence","motive at new levels"],["Tonal","in the key"],["Real (exact)","intervals preserved"],["Sequential interval","step, third, fourth, or other"],["Number of statements","varies with context"]], reverse:true}, count:6 },
    { gen:"step-type", params:{}, count:2 },
    { type:"mc", q:"A melodic sequence restates a motive…", choices:["at a different pitch level","only at the original pitch level","in a different meter by definition"], answer:0,
      explain:"The level must move." },
    { type:"mc", q:"Which interval can separate successive statements of a sequence?", choices:["A step, third, fourth, or another consistent interval","Only a step","Only an octave"], answer:0,
      explain:"Stepwise sequences are common, but sequences may move by many different intervals." },
    { type:"mc", q:"A tonal sequence normally…", choices:["adjusts interval qualities to remain within the key","preserves every chromatic interval exactly","changes the meter"], answer:0,
      explain:"Diatonic notes only; interval qualities adjust." },
    { type:"mc", q:"A real sequence…", choices:["preserves the exact interval pattern","abandons the original motive","must always remain diatonic"], answer:0,
      explain:"The interval sizes and qualities remain unchanged at each pitch level." },
    { type:"truefalse", q:"Restating a motive at the same pitch level is exact repetition rather than sequence.", answer:true,
      explain:"That is repetition; sequence moves." },
    { type:"truefalse", q:"The number of statements in a sequence may vary according to the musical context.", answer:true,
      explain:"A sequence requires successive statements at different pitch levels, but it does not have a fixed maximum length." },
    { type:"truefalse", q:"A rising sequence can contribute to a sense of increasing energy or intensity.", answer:true,
      explain:"This is a common expressive effect, but the result depends on the complete musical context." },
    { gen:"term-match", params:{subject:"term", pool:[["C-D-E → D-E-F","rising sequence"],["G-F-E → F-E-D","falling sequence"],["Same pitch twice","repetition"],["New level each time","sequence"]], reverse:true}, count:3 },
    { gen:"note-value", params:{}, count:2 }
  ],
  vocabulary:[
    {term:"Melodic Sequence", def:"A motive repeated at a new pitch level."},
    {term:"Tonal Sequence", def:"Stays in the key. Intervals may adjust."},
    {term:"Real Sequence", def:"Keeps every interval exactly the same."},
    {term:"Ascending / Descending", def:"Ascending = moves higher. Descending = moves lower."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Sequence</b> = same idea, new pitch level.",
    "✔ <b>Tonal</b> = stays in the key.",
    "✔ <b>Real</b> = exact intervals.",
    "✔ <b>Ascending</b> = higher.",
    "✔ <b>Descending</b> = lower.",
    "✔ Sequences help develop motives."
  ],
  tips:[
    "Compose faster: write ONE good measure, then sequence it up or down twice — three measures done.",
    "Spot sequences in sheet music by rhythm first: identical rhythms in a row usually mean a sequence.",
    "Play a scale in broken 3rds (C-E, D-F, E-G…) — that's a sequence you already know by hand.",
    "Next lesson: how many layers is the music made of? — TEXTURE."
  ],
  rewards:{ badge:"Pattern Climber", icon:"\u{1FA9C}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Recognizable pattern, changing pitch level, direction, and sequence type.",
  quiz:[
    { type:"mc", q:"A melodic sequence is…", choices:["a motive or pattern restated at a different pitch level","a rapidly performed scale","a chord progression without melodic material"], answer:0,
      explain:"Shape constant, level moving.", hint:"Repeat + move." },
    { type:"mc", q:"What must change between successive statements of a melodic sequence?", choices:["The pitch level","The meter","The tempo"], answer:0,
      explain:"The sequential interval may vary, but each statement begins at a different pitch level.", hint:"Each statement starts on a new pitch." },
    { type:"mc", q:"Which passage contains enough information to establish a sequence?", choices:["An initial pattern followed by a recognizable restatement at another pitch level","One isolated statement","One sustained note"], answer:0,
      explain:"A sequence requires at least an initial statement and a restatement at a different pitch level. Additional statements often make the pattern clearer.", hint:"At least an initial statement and one restatement." },
    { type:"mc", q:"A tonal sequence…", choices:["adjusts interval qualities to remain diatonic to the key","preserves every specific interval exactly","requires a change of key signature"], answer:0,
      explain:"Interval qualities adjust to the scale.", hint:"Diatonic." },
    { type:"mc", q:"What defines a real sequence?", choices:["Exact preservation of the original interval pattern","Absence of rhythm","Silence between statements"], answer:0,
      explain:"Accidentals may appear when they are needed to preserve the exact intervals.", hint:"Compare the quality and size of every interval." },
    { type:"mc", q:"Identify the passage.",
      staff:{clef:"treble",notes:[{p:"C4",d:"8"},{p:"E4",d:"8"},{p:"D4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"8"},{p:"G4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:240},
      choices:["A rising sequence — the pattern begins at successively higher pitch levels","Exact repetition","A descending sequence"], answer:0,
      explain:"The related patterns begin on C, D, and E, producing a rising sequence.", hint:"Track the first notes." },
    { type:"truefalse", q:"A basic melodic sequence must change the rhythm of the original pattern.", answer:false,
      explain:"In a basic sequence, the rhythmic pattern remains recognizable while the pitch level changes.", hint:"What stays, what moves?" },
    { type:"truefalse", q:"A tonal sequence may change the quality of an interval to remain within the key.", answer:true,
      explain:"Interval qualities may adjust to the diatonic notes of the key.", hint:"Diatonic adjustment." },
    { type:"mc", q:"Which effect can a rising sequence help create?", choices:["Increasing energy or intensity","Automatic silence","A required key-signature change"], answer:0,
      explain:"Rising pitch levels often increase energy, although the effect depends on musical context.", hint:"Up = more." },
    { type:"mc", q:"A composer restates a one-measure motive at two additional pitch levels. Which technique is being used?", choices:["Sequence","Rest","Clef change"], answer:0,
      explain:"Development's workhorse.", hint:"This lesson." },
    { type:"mc", q:"In C major, C–D–E followed by D–E–F♯ and E–F♯–G♯ is best classified as…", choices:["a rising real sequence","a tonal sequence remaining diatonic to C major","exact repetition at one pitch level"], answer:0,
      explain:"Each statement preserves the original whole-step pattern. The required accidentals take the passage outside C major, producing a real sequence.", hint:"Spot the accidentals." },
    { type:"mc", q:"Which earlier concept does melodic sequence directly develop?", choices:["Motive development from Lesson 72","Key-signature notation","Meter classification"], answer:0,
      explain:"It develops motives by moving them.", hint:"The building blocks lesson." }
  ],
  miaPerfect:"Perfect score! You accurately identified rising, descending, tonal, and real sequences.",
  miaPass:"You passed! Next, you will study musical texture.",
  mia:{
    hook:{ label:"the welcome",
      explain:"One shape stated three times, each a step lower — a descending tonal sequence.",
      play:()=>{const M=[[72,71,72,67],[71,69,71,65],[69,67,69,64]];let t=0;M.forEach(seg=>{seg.forEach(m=>{MFAudio.tone(m,.28,t,.42);t+=.3;});t+=.15;});} },
    learn:{ label:"melodic sequence",
      explain:"Motive restated at successive pitch levels; the interval and number of statements may vary. Tonal = in key (qualities adjust); real = exact intervals preserved. Rising often builds, falling often relaxes.",
      hint:"Same shape, walking level.",
      play:()=>{[60,64,62, 62,65,64].forEach((m,i)=>MFAudio.tone(m,.3,i*.28,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 descends through three levels to an arrival; example 2 climbs three levels to a peak." },
    game:{ label:"the games",
      explain:"Identify sequence facts, perform a rising tonal sequence, sort sequence vs repetition on cards, then classify tonal vs real.",
      hint:"Rhythm repeats, level moves." },
    quiz:{ label:"this question",
      explain:"Three checks: does the pattern repeat immediately? Does the LEVEL move (else repetition)? In key (tonal) or exact intervals preserved (real)?",
      play:()=>{[64,62,64,60, 62,60,62,59].forEach((m,i)=>MFAudio.tone(m,.26,i*.27,.4));} }
  }
};
