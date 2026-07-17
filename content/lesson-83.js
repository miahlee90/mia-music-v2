/* Lesson 83 — Interval Inversions & Compound Intervals (Book 4, Unit 20 — SELF-AUTHORED)
   Core: INVERT an interval = move the bottom note up an octave. Rule of 9:
   the numbers sum to 9 (2nd↔7th, 3rd↔6th, 4th↔5th). Quality flips:
   M↔m, A↔d, P↔P. COMPOUND intervals exceed the octave (9th = 2nd + octave);
   reduce by subtracting 7. NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[83]={
  welcome:"Invert intervals and identify intervals larger than an octave.",
  hook:{
    say:"C up to E forms a third. Move the lower C up one octave, placing it above E. The resulting interval, E up to C, is an inversion of the original interval. \u{1F447} <b>Listen to both intervals. What is the second interval?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ C up to E — a third</button>
          <button class="play hk-b">▶ E up to C — the inversion</button></div>
          <div class="choices hk-ch" style="display:none"><button>A sixth</button><button>A third</button><button>A second</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(60,.6,0,.42); MFAudio.tone(64,.6,.7,.42); MFAudio.tone(60,.8,1.5,.3); MFAudio.tone(64,.8,1.5,.3); hA=true; if(hB) setTimeout(()=>ch.style.display="",2400); };
        container.querySelector(".hk-b").onclick=()=>{ MFAudio.tone(64,.6,0,.42); MFAudio.tone(72,.6,.7,.42); MFAudio.tone(64,.8,1.5,.3); MFAudio.tone(72,.8,1.5,.3); hB=true; if(hA) setTimeout(()=>ch.style.display="",2400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. E up to C is a sixth. A third and its inversion, a sixth, have interval numbers that add to 9.");
          else fb(false,"Count the letter names inclusively from E through C: E–F–G–A–B–C.");
        });
      } }
  },
  objectives:[
    "Invert an interval: move the bottom note up an octave",
    "Apply the RULE OF 9: the two numbers sum to nine",
    "Flip qualities: major↔minor, augmented↔diminished, perfect stays perfect",
    "Define compound intervals: larger than an octave",
    "Reduce a compound to its simple interval (subtract 7)",
    "Name 9ths, 10ths, 11ths, 12ths and 13ths"
  ],
  steps:[
    { say:"<b>Interval Inversion:</b> To invert an interval, <b>move the lower note up one octave</b> or move the upper note down one octave. The two notes exchange positions. For example, C–E, a third, becomes E–C, a sixth. \u{1F447} <b>Which action inverts a simple interval?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:90,notes:[
        {p:"C4",d:"w",label:"3rd"},{p:"E4",d:"w",chord:true},
        {p:"E4",d:"w",label:"6th"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["Move the lower note up one octave","Move both notes up one octave","Add an accidental to the upper note"], answer:0,
        success:"✓ Correct. Moving the lower note up an octave places it above the original upper note and inverts the interval.",
        fail:"Keep the same pitch classes, but exchange their vertical positions.",
        hint:"Transfer one note by an octave so that the lower note becomes the upper note." } },
    { say:"<b>The Rule of 9:</b> The numbers of a simple interval and its inversion <b>add to 9</b>: second ↔ seventh, third ↔ sixth, fourth ↔ fifth, and unison ↔ octave. \u{1F447} <b>A fourth inverts to a…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Interval</th><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">unison</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">2nd</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">3rd</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">4th</td></tr>
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Inversion</th><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">octave</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">7th</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">6th</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">5th</td></tr>
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Sum</th><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#A9821F;font-weight:800">9</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#A9821F;font-weight:800">9</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#A9821F;font-weight:800">9</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#A9821F;font-weight:800">9</td></tr></table>` },
      try:{ type:"mc", choices:["fifth","sixth","fourth"], answer:0,
        success:"✓ Correct. A fourth inverts to a fifth because 4 + 5 = 9.",
        fail:"Subtract the original interval number from 9.",
        hint:"9 − 4 = 5." } },
    { say:"<b>Interval Quality Under Inversion:</b> Major intervals invert to minor intervals, and minor intervals invert to major intervals. Augmented intervals invert to diminished intervals, and diminished intervals invert to augmented intervals. <b>Perfect intervals remain perfect.</b> Therefore, a major third inverts to a minor sixth, and a perfect fifth inverts to a perfect fourth. \u{1F447} <b>A major second inverts to…</b>",
      try:{ type:"mc", choices:["a minor seventh","a major seventh","a perfect seventh"], answer:0,
        success:"✓ Correct. The interval number changes from 2 to 7, and the quality changes from major to minor. Therefore, M2 inverts to m7.",
        fail:"Apply both the interval-number rule and the quality-inversion rule.",
        hint:"2 ↔ 7 and major ↔ minor." } },
    { say:"<b>Perfect Intervals Under Inversion:</b> Perfect unisons, fourths, fifths, and octaves invert to other perfect intervals. A perfect fourth inverts to a perfect fifth, and a perfect unison inverts to a perfect octave. Unlike major and minor qualities, <b>the perfect quality does not change under inversion</b>. \u{1F447} <b>A perfect fifth inverts to…</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:90,notes:[
        {p:"C4",d:"w",label:"P5"},{p:"G4",d:"w",chord:true},
        {p:"G4",d:"w",label:"P4"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["a perfect fourth","a diminished fifth","an augmented fourth"], answer:0,
        success:"✓ Correct. A perfect fifth inverts to a perfect fourth: 5 + 4 = 9, and the perfect quality remains unchanged.",
        fail:"Which interval quality remains perfect under inversion?",
        hint:"Perfect ↔ perfect." } },
    { say:"<b>Compound Intervals:</b> Compound intervals are <b>larger than an octave</b>. To find the simple interval, <b>subtract 7</b> from the interval number. \u{1F447} <b>A tenth reduces to which simple interval?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:90,notes:[
        {p:"C4",d:"w",label:"9th"},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"10th"},{p:"E5",d:"w",chord:true},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["A third","A second","A fifth"], answer:0,
        success:"✓ Correct. A tenth is a third plus one octave: 10 − 7 = 3.",
        fail:"Subtract 7 from the compound interval number.",
        hint:"10 − 7 = 3." } },
    { say:"<b>Common Compound Intervals:</b> Each compound interval is a simple interval plus an octave — just <b>subtract 7</b>. \u{1F447} <b>An eleventh is the compound equivalent of a…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:15px;min-width:220px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 20px">Compound</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 20px">Simple</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center;font-weight:800">9th</td><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center">2nd</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center;font-weight:800">10th</td><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center">3rd</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center;font-weight:800">11th</td><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center">4th</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center;font-weight:800">12th</td><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center">5th</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center;font-weight:800">13th</td><td style="border:1.5px solid #cdd5e1;padding:4px 20px;text-align:center">6th</td></tr></table>` },
      try:{ type:"mc", choices:["fourth","fifth","second"], answer:0,
        success:"✓ Correct. An eleventh is a fourth plus an octave: 11 − 7 = 4.",
        fail:"Subtract 7 from the compound interval number.",
        hint:"11 − 7 = 4." } },
    { say:"<b>Review:</b> \u{1F447} <b>A minor third inverts to…</b>",
      try:{ type:"mc", choices:["a major sixth","a minor sixth","an augmented sixth"], answer:0,
        success:"✓ Correct. A third inverts to a sixth, and minor quality inverts to major quality. Therefore, m3 inverts to M6.",
        fail:"Apply both the number and quality rules.",
        hint:"3 ↔ 6 and minor ↔ major." } }
  ],
  examples:[
    { caption:"Inversion pairs played back to back: M3→m6, then P5→P4. Same letter names, flipped stacking — numbers always summing to nine.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"M3"},{p:"E4",d:"w",chord:true},
        {p:"E4",d:"w",label:"m6"},{p:"C5",d:"w",chord:true},{bar:"single"},
        {p:"D4",d:"w",label:"P5"},{p:"A4",d:"w",chord:true},
        {p:"A4",d:"w",label:"P4"},{p:"D5",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"Compound intervals from C: a 9th (D), a 10th (E) and a 13th (A) — each a simple interval pushed past the octave.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"9th"},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"10th"},{p:"E5",d:"w",chord:true},
        {p:"C4",d:"w",label:"13th"},{p:"A5",d:"w",chord:true},{bar:"final"}],width:520},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Rule-of-9 Sprint (45s)",
      intro:"Identify inversion pairs and interval-quality changes before time runs out.",
      miaIntro:"The interval numbers of an inversion pair add to 9.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["2nd inverts to","7th"],
        ["3rd inverts to","6th"],
        ["4th inverts to","5th"],
        ["Major inverts to","minor"],
        ["Augmented inverts to","diminished"],
        ["Perfect inverts to","perfect"],
        ["The inversion rule","numbers sum to 9"],
        ["To invert","move the bottom note up an octave"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Rule-of-9 challenge completed!":null },
    { type:"symbol-hunt", title:"Game 2 · Find the Inversion",
      intro:"Select the correct inversion of each interval.",
      miaIntro:"Exchange the upper and lower notes.",
      spec:{rounds:6, pool:[
        {label:"m6 (inverts M3)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"C5",d:"w",chord:true}],width:140}},
        {label:"P4 (inverts P5)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true}],width:140}},
        {label:"m7 (inverts M2)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"C5",d:"w",chord:true}],width:140}},
        {label:"M6 (inverts m3)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"C#5",d:"w",chord:true}],width:140}}]},
      result:(score)=>score>=5?"You identified the interval inversions correctly.":null },
    { type:"order-tap", title:"Game 3 · Compound Ladder",
      intro:"Arrange the compound intervals from smallest to largest.",
      miaIntro:"Begin with the interval closest to the octave.",
      spec:{sequence:["9th (= 2nd)","10th (= 3rd)","11th (= 4th)","12th (= 5th)","13th (= 6th)"],
        title:"The compound interval ladder"},
      result:(stars)=>stars>=2?"You arranged the compound intervals correctly.":null },
    { type:"term-race", title:"Game 4 · Reduce the Compound",
      intro:"Reduce each compound interval to its simple equivalent before time runs out.",
      miaIntro:"Subtract 7, repeating when necessary.",
      spec:{rounds:8, reverse:true, pool:[
        ["9th","a compound 2nd"],
        ["10th","a compound 3rd"],
        ["11th","a compound 4th"],
        ["12th","a compound 5th"],
        ["13th","a compound 6th"],
        ["Compound interval","larger than an octave"],
        ["Reduction rule","subtract 7"],
        ["Subtract 7","reduces any compound interval"]]},
      result:(score)=>score>=6?"You reduced the compound intervals correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on interval inversions, qualities, and compound intervals. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["2nd↔","7th"],["3rd↔","6th"],["4th↔","5th"],["M↔","m"],["P↔","P"],["Sum","9"]], reverse:true}, count:6 },
    { gen:"interval-quality", params:{ask:"quality"}, count:3 },
    { type:"mc", q:"Which action inverts a simple interval?", choices:["Move the lower note up one octave","Remove one of the notes","Change the clef"], answer:0,
      explain:"The lower note moves above the original upper note." },
    { type:"mc", q:"A sixth inverts to a…", choices:["third","fourth","sixth"], answer:0,
      explain:"6 + 3 = 9." },
    { type:"mc", q:"A major interval inverts to which quality?", choices:["Minor","Major","Perfect"], answer:0,
      explain:"Major and minor qualities exchange under inversion." },
    { type:"mc", q:"A perfect 4th inverts to a…", choices:["Perfect fifth","Augmented fifth","Diminished fifth"], answer:0,
      explain:"Perfect stays perfect; 4+5=9." },
    { type:"truefalse", q:"The numbers of a simple interval and its inversion add to 9.", answer:true,
      explain:"The rule of 9." },
    { type:"truefalse", q:"A compound interval is larger than an octave.", answer:true,
      explain:"LARGER than an octave." },
    { type:"truefalse", q:"A ninth reduces to a second.", answer:true,
      explain:"9 − 7 = 2." },
    { gen:"term-match", params:{subject:"term", pool:[["9th","compound 2nd"],["10th","compound 3rd"],["11th","compound 4th"],["13th","compound 6th"]], reverse:true}, count:3 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 }
  ],
  vocabulary:[
    {term:"Interval Inversion", def:"Flipping an interval by moving the bottom note up an octave. Numbers sum to 9."},
    {term:"Rule of 9", def:"2nd↔7th · 3rd↔6th · 4th↔5th · unison↔octave — every pair adds to nine."},
    {term:"Quality Flip", def:"Major↔minor, augmented↔diminished; perfect inverts to perfect."},
    {term:"Compound Interval", def:"An interval larger than an octave: 9th, 10th, 11th, 12th, 13th. Subtract 7 to find its simple form."}
  ],
  mistakes:[],
  summary:[
    "✔ Invert = <b>bottom note up an octave</b>.",
    "✔ <b>Rule of 9</b>: 2↔7, 3↔6, 4↔5, 1↔8.",
    "✔ Qualities flip: <b>M↔m, A↔d, P↔P</b>.",
    "✔ <b>Compound</b> = past the octave; <b>subtract 7</b> to reduce (9th→2nd, 13th→6th).",
    "✔ Two formulas do it all: <b>rule of 9</b> for inversions, <b>subtract 7</b> for compounds."
  ],
  tips:[
    "Fast check: M3 up from C is E; m6 up from E is C. If you return to your starting letter, the inversion is right.",
    "The tritone is its own inversion: A4↔d5 — both six half steps.",
    "Compound quality never changes: a major 10th is just a major 3rd, breathing higher.",
    "Next lesson: moving whole melodies to new keys — transposition."
  ],
  rewards:{ badge:"Interval Flipper", icon:"\u{1F503}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Apply the rule of 9, invert interval qualities, and reduce compound intervals.",
  quiz:[
    { type:"mc", q:"Which action inverts a simple interval?", choices:["Move the lower note up one octave","Move both notes up one octave","Repeat the same interval"], answer:0,
      explain:"Bottom becomes top.", hint:"Octave transfer." },
    { type:"mc", q:"The interval numbers of a simple interval and its inversion add to…", choices:["9","8","10"], answer:0,
      explain:"The rule of 9.", hint:"3+6, 4+5…" },
    { type:"mc", q:"A 2nd inverts to a…", choices:["7th","6th","5th"], answer:0,
      explain:"A second inverts to a seventh because 2 + 7 = 9.", hint:"Subtract from 9." },
    { type:"mc", q:"A major 3rd inverts to a…", choices:["minor 6th","major 6th","minor 3rd"], answer:0,
      explain:"A major third inverts to a minor sixth: 3 ↔ 6 and major ↔ minor.", hint:"Both parts flip." },
    { type:"mc", q:"An augmented fourth inverts to a…", choices:["diminished fifth","augmented fifth","perfect fifth"], answer:0,
      explain:"Augmented quality inverts to diminished quality, and a fourth inverts to a fifth. An augmented fourth and diminished fifth span the same number of half steps in twelve-tone equal temperament but use different spellings.", hint:"A↔d." },
    { type:"mc", q:"Which interval quality remains unchanged under inversion?", choices:["Perfect","Major","Augmented"], answer:0,
      explain:"P4↔P5, P1↔P8.", hint:"Perfect intervals invert to other perfect intervals." },
    { type:"mc", q:"A compound interval is…", choices:["larger than an octave","smaller than a 2nd","always dissonant"], answer:0,
      explain:"Common compound intervals include ninths, tenths, elevenths, and larger intervals.", hint:"Past the octave." },
    { type:"mc", q:"A thirteenth reduces to a…", choices:["sixth","fifth","seventh"], answer:0,
      explain:"13 − 7 = 6.", hint:"Subtract 7." },
    { type:"mc", q:"Identify the interval.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"D5",d:"w",chord:true}],width:160},
      choices:["A ninth—a compound second","A second","An octave"], answer:0,
      explain:"C up to the D above the octave forms a ninth. Its simple equivalent is a second.", hint:"Count past 8." },
    { type:"truefalse", q:"A minor seventh inverts to a major second.", answer:true,
      explain:"7→2, m→M.", hint:"Run the flips." },
    { type:"truefalse", q:"A compound interval retains the quality of its simple equivalent.", answer:true,
      explain:"For example, a major tenth reduces to a major third. Adding or removing an octave does not change the interval quality.", hint:"Only the octave is added." },
    { type:"mc", q:"In extended-chord symbols such as C9, C11, and C13, what do the numbers represent?", choices:["Chord extensions measured conceptually above the root","Measure numbers","Piano fingerings"], answer:0,
      explain:"The numbers identify theoretical chord extensions above the root. Actual voicings may place these notes in different octaves or omit certain chord members.", hint:"The interval ladder." }
  ],
  miaPerfect:"Perfect score! You accurately inverted simple intervals and reduced compound intervals.",
  miaPass:"You passed and completed unit 20. Next, you will study transposition.",
  mia:{
    hook:{ label:"the welcome",
      explain:"C–E (a 3rd) flipped into E–C (a 6th): inversion. The numbers 3 and 6 sum to nine — they always will.",
      play:()=>{MFAudio.tone(60,.5,0,.4);MFAudio.tone(64,.5,.55,.4);MFAudio.tone(64,.5,1.3,.4);MFAudio.tone(72,.5,1.85,.4);} },
    learn:{ label:"inversions & compounds",
      explain:"Invert = bottom up an octave; numbers sum to 9; M↔m, A↔d, P↔P. Compound = past the octave; subtract 7 (9th→2nd … 13th→6th).",
      hint:"9 for flips, 7 for compounds.",
      play:()=>{MFAudio.tone(60,.5,0,.4);MFAudio.tone(74,.5,.6,.4);} },
    example:{ label:"the examples",
      explain:"Example 1 plays inversion pairs (M3→m6, P5→P4); example 2 stretches simple intervals into 9ths, 10ths and 13ths." },
    game:{ label:"the games",
      explain:"Sprint the rule of 9, find inversions on cards, climb the compound ladder, then reduce compounds at speed.",
      hint:"Sum 9 · subtract 7." },
    quiz:{ label:"this question",
      explain:"Three moves solve everything: numbers sum to 9, qualities flip (P stays), compounds reduce by subtracting 7.",
      play:()=>{MFAudio.tone(60,.5,0,.4);MFAudio.tone(64,.5,.5,.4);MFAudio.tone(72,.6,1.1,.4);} }
  }
};
