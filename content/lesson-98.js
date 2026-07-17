/* Lesson 98 — Secondary Dominants (Book 4, Unit 24 — SELF-AUTHORED)
   Core: any major or minor diatonic chord can be preceded by ITS OWN
   dominant: V/V (D major in C), V/ii, V/vi, V/IV. Spot them by the
   accidental; they TONICIZE their target briefly.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[98]={stackFigures:true,
  welcome:"Secondary dominants temporarily tonicize chords other than the tonic.",
  hook:{
    say:"<b>In C major, a D major chord containing F♯ appears and resolves to G.</b> \u{1F447} <b>What function does the D major chord perform?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the progression</button></div>
          <div class="choices hk-ch" style="display:none"><button>It resolves to G and functions as the dominant of G</button><button>It ends the piece as the tonic</button><button>It has no harmonic relationship to G</button></div>`;
        const ROWS=[[60,64,67],[62,66,69],[55,59,62],[60,64,67]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.27))); setTimeout(()=>ch.style.display="",ROWS.length*900+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. D major functions as the dominant of G, the V chord in C major. It is therefore labeled V/V, a secondary or applied dominant.");
          else fb(false,"Follow F♯ as it resolves upward to G. The D major chord creates a temporary dominant-to-tonic relationship with G.");
        });
      } }
  },
  objectives:[
    "Define a secondary (applied) dominant",
    "Read Roman-numeral notation: V/V, V/ii, V/vi, V/IV",
    "Build a secondary dominant from a target chord",
    "Recognize chromatic leading tones",
    "Distinguish tonicization from modulation",
    "Predict normal resolutions"
  ],
  steps:[
    { say:"<b>The Basic Idea:</b> a <b>secondary dominant</b> temporarily makes another diatonic chord sound like a tonic — a V→I aimed at a chord other than I. It is written <b>V/X</b> and normally resolves to <b>X</b>. In C major, D major → G is <b>V/V</b> (read \u{201C}five of five\u{201D}). In practice it is usually a <b>major triad or dominant seventh</b>. \u{1F447} <b>A secondary dominant is…</b>",
      try:{ type:"mc", choices:["A chord that temporarily functions as the dominant of a nontonic chord","Any chord performed loudly","The second chord in a progression"], answer:0,
        success:"✓ Correct. A secondary dominant applies dominant function temporarily to a major or minor chord other than the tonic.",
        fail:"Identify the chord to which D major resolves.",
        hint:"D major is the dominant of G." } },
    { say:"<b>Constructing a Secondary Dominant — four steps:</b><br><b>1.</b> Choose the <b>target chord</b>.<br><b>2.</b> Find its <b>dominant</b> — a perfect 5th above the target root.<br><b>3.</b> Build a <b>major triad (or dominant 7th)</b> there.<br><b>4.</b> <b>Resolve</b> to the target. Example: target ii = Dm; a 5th above D is A, so <b>A major (A–C♯–E) = V/ii</b> (A7 = V⁷/ii). \u{1F447} <b>V/vi in C major is…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:13px;min-width:340px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 8px">Target</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 8px">Roman</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 8px">Secondary dominant</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 8px">New note</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 8px">Resolves to</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">G</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">V</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;font-weight:800">V/V = D major</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;color:#C05A21;font-weight:800">F♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">G (V)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">Dm</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">ii</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;font-weight:800">V/ii = A major</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;color:#C05A21;font-weight:800">C♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">Dm (ii)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">Am</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">vi</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;font-weight:800">V/vi = E major</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;color:#C05A21;font-weight:800">G♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">Am (vi)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">F</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">IV</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;font-weight:800">V⁷/IV = C7</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center;color:#C05A21;font-weight:800">B♭</td><td style="border:1.5px solid #cdd5e1;padding:4px 8px;text-align:center">F (IV)</td></tr></table>` },
      try:{ type:"mc", choices:["E major: E–G♯–B","E minor: E–G–B","A major: A–C♯–E"], answer:0,
        success:"✓ Correct. E is a perfect fifth above the target root A. The G♯ in E major functions as the temporary leading tone to A.",
        fail:"Find the dominant root of A, and then build a major triad.",
        hint:"E–G♯–B is the dominant triad of A." } },
    { say:"<b>Identifying Secondary Dominants:</b> a chromatic accidental often signals one (F♯ in D major = V/V, C♯ in A major = V/ii, G♯ in E major = V/vi). But <b>a chromatic accidental alone does not prove a secondary dominant.</b> Always identify <b>(1)</b> the complete chord and <b>(2)</b> its expected resolution. \u{1F447} <b>In C major, an E major chord containing G♯ resolves to A minor. How should E major be analyzed?</b>",
      try:{ type:"mc", choices:["V/vi","A printing error","A modulation to G major"], answer:0,
        success:"✓ Correct. G♯ acts as a temporary leading tone to A, and E major functions as V of vi.",
        fail:"Identify the pitch a half step above G♯ and the chord rooted on that pitch.",
        hint:"G♯ resolves upward to A." } },
    { say:"<b>Tonicization vs. Modulation:</b> a secondary dominant creates <b>tonicization</b> — a brief spotlight on a chord — not a key change. Students often confuse the two; the difference is how long and how firmly the new center is established. \u{1F447} <b>What is tonicization?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:13px;text-align:left">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px"><b style="color:#2F6DA8">Tonicization</b><br>• temporary<br>• a few chords<br>• original key stays active</div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:8px 14px"><b style="color:#C05A21">Modulation</b><br>• a new tonic<br>• a cadence confirms the new key<br>• longer-lasting</div></div>` },
      try:{ type:"mc", choices:["The temporary treatment of a nontonic chord as a local tonic","A permanently fixed change of key","An increase in the tonic chord's dynamic level"], answer:0,
        success:"✓ Correct. Tonicization briefly emphasizes a local tonic without displacing the prevailing key structurally.",
        fail:"Determine whether the original key remains structurally active.",
        hint:"Tonicization is temporary and locally focused." } },
    { say:"<b>Expected Resolution:</b> a secondary dominant normally resolves to its target — V/V → V, V/ii → ii, V/vi → vi. The temporary leading tone rises by step to the target root; any chordal 7th falls by step. But composers sometimes <b>delay or avoid</b> the expected resolution — the notation V/X names the <b>intended target</b>, not an absolute rule. \u{1F447} <b>What is the expected resolution of V/ii?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:72,notes:[
        {p:"A3",d:"w",label:"V/ii"},{p:"C#4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["ii","I","V"], answer:0,
        success:"✓ Correct. In C major, A major or A7 functions as V/ii and normally resolves to D minor.",
        fail:"Read the chord named after the slash.",
        hint:"The denominator identifies the expected target." } },
    { say:"<b>Secondary Dominants in Progressions:</b> applied dominants strengthen the pull toward the next chord. Compare:<br>• <b>I → V/V → V → I</b> — loads the arrival on V.<br>• <b>I → V/ii → ii → V → I</b> — tonicizes ii, then continues home.<br>Each secondary dominant adds a local dominant-to-tonic push. They appear in classical, jazz, pop, and film styles alike. \u{1F447} <b>What effect does placing V/V immediately before V commonly create?</b>",
      try:{ type:"mc", choices:["It strengthens the expectation of arrival on V","It eliminates the dominant function of V","It requires the music to stop"], answer:0,
        success:"✓ Correct. V/V creates a local dominant-to-tonic relationship directed toward V.",
        fail:"Consider how a dominant prepares its expected tonic.",
        hint:"V/V points toward V." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which chord functions as V/V in F major?</b>",
      try:{ type:"mc", choices:["G major, G–B♮–D, normally resolving to C","G minor, G–B♭–D","B♭ major, B♭–D–F"], answer:0,
        success:"✓ Correct. C is V in F major, and G major is the dominant of C. The chromatic pitch B♮ functions as the temporary leading tone to C.",
        fail:"Identify the dominant of C, the dominant chord in F major.",
        hint:"Find V of V in two stages: F → C → G." } }
  ],
  examples:[
    { caption:"I → V/V → V → I in C major: the D major chord (F♯) loads the arrival on G, which then closes home. Hear the double push.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"V/V"},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"G3",d:"w",label:"V"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:53,octaves:1.58,labels:true} },
    { caption:"I → V/vi → vi: E major's G♯ tonicizes A minor — for one moment, Am sounds like home. Brief homeness = tonicization.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"V/vi"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:480},
      kb:{start:60,octaves:1.41,labels:true} },
    { caption:"Secondary dominants live in every key — not just C. In G major, A7 → D is V/V → V; the C♯ is the temporary leading tone to D.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"A3",d:"w",label:"V/V = A7"},{p:"C#4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"V = D"},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:360},
      kb:{start:57,octaves:1.1667,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Applied-Dominant Identification",
      intro:"Identify targets, spellings, and temporary leading tones.",
      miaIntro:"Read V/X as \u{201C}five of X.\u{201D}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Secondary dominant","the V of a non-tonic chord"],
        ["V/V in C","D major (F♯)"],
        ["V/ii in C","A major (C♯)"],
        ["V/vi in C","E major (G♯)"],
        ["V/IV in C","C7 (B♭)"],
        ["The temporary leading tone","an accidental within a secondary dominant"],
        ["Tonicization","a chord briefly treated as tonic"],
        ["V/X resolves to","X"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Secondary dominants identified!":null },
    { type:"key-climb", title:"Game 2 · Perform the Applied-Dominant Progression",
      intro:"Follow the red arrow and press each chord's root: C → D → G → C. Each press sounds the full chord, so you hear the I → V/V → V → I progression.",
      miaIntro:"Press the root — the whole chord rings. Follow F♯ as it resolves to G.",
      spec:{seq:[60,62,67,72],
        chords:[[60,64,67],[62,66,69],[67,71,74],[64,67,72]],
        names:["C major (I)","D major (V/V — the F♯ chord)","G major (V)","C major (I — home, 1st inversion)"],
        start:60, octaves:1.3333, title:"Press each root — hear the chord:  I → V/V → V → I"},
      result:(score)=>score!==null?"You performed the applied-dominant progression.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Secondary Dominant",
      intro:"Examine each chromatic chord and its resolution, then select the correct secondary-dominant label.",
      miaIntro:"Identify the chord, temporary leading tone, and target.",
      spec:{rounds:6, pool:[
        {label:"V/V (D-F♯-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"V/ii (A-C♯-E)", spec:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"C#4",d:"w",chord:true},{p:"E4",d:"w",chord:true}],width:150}},
        {label:"V/vi (E-G♯-B)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"Plain ii (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the applied dominants from their spelling and context.":null },
    { type:"term-race", title:"Game 4 · Resolve the Applied Dominant",
      intro:"Identify the expected target of each applied dominant.",
      miaIntro:"Read the chord after the slash.",
      spec:{rounds:8, reverse:true, pool:[
        ["V/V","resolves to V"],
        ["V/ii","resolves to ii"],
        ["V/vi","resolves to vi"],
        ["V/IV","resolves to IV"],
        ["F♯ in C major","V/V's leading tone"],
        ["C♯ in C major","V/ii's leading tone"],
        ["G♯ in C major","V/vi's leading tone"],
        ["Extended tonicization","becomes modulation"]]},
      result:(score)=>score>=6?"You identified each expected target correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on constructing, identifying, and resolving secondary dominants.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["V/V","D major in C"],["V/ii","A major in C"],["V/vi","E major in C"],["Tonicization","brief tonic treatment"],["V/X","resolves to X"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"A secondary dominant temporarily functions as the dominant of…", choices:["a major or minor chord other than the prevailing tonic","only the prevailing tonic","no identifiable target"], answer:0,
      explain:"A secondary dominant applies dominant function to a nontonic chord." },
    { type:"mc", q:"To construct V/X, find the dominant root of X and build…", choices:["a major triad or dominant seventh chord","a minor triad","a diminished triad"], answer:0,
      explain:"An applied V is a major triad; an applied V⁷ is a major-minor seventh chord." },
    { type:"mc", q:"V/V in C major is…", choices:["D major","D minor","G major"], answer:0,
      explain:"A P5 above G, with F♯." },
    { type:"mc", q:"V/vi in C major needs which accidental?", choices:["G♯","F♯","B♭"], answer:0,
      explain:"Am's leading tone." },
    { type:"truefalse", q:"V/ii resolves to ii.", answer:true,
      explain:"The slash names the target." },
    { type:"truefalse", q:"Tonicization briefly treats a nontonic chord as a local tonic while the prevailing key remains structurally active.", answer:true,
      explain:"The prevailing key remains structurally active during a tonicization." },
    { type:"truefalse", q:"Accidentals can help identify secondary dominants, but chord spelling and resolution must also be examined.", answer:true,
      explain:"An accidental alone does not confirm a secondary dominant." },
    { gen:"term-match", params:{subject:"term", pool:[["P5 above the target","the secondary's root"],["Borrowed leading tone","rises to the target's root"],["V/IV in C","C7"],["Double push","V/V then V"]], reverse:true}, count:3 },
    { gen:"inversion-id", params:{subject:"v7", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Secondary Dominant", def:"The dominant of a chord other than the tonic."},
    {term:"Applied Dominant", def:"Another name for a secondary dominant."},
    {term:"Tonicization", def:"A temporary emphasis on a diatonic chord as if it were a tonic."},
    {term:"Expected Resolution", def:"V/X → X."}
  ],
  mistakes:[],
  summary:[
    "✔ Secondary dominant = the dominant of a chord other than I.",
    "✔ Another name: <b>applied dominant</b>.",
    "✔ Notation: <b>V/X</b>.",
    "✔ Build it by finding the dominant of the target chord (a 5th above).",
    "✔ The chromatic accidental is usually the temporary <b>leading tone</b>.",
    "✔ Secondary dominants create <b>tonicization, not modulation</b>.",
    "✔ They normally resolve to the target chord (<b>V/X → X</b>)."
  ],
  tips:[
    "See an accidental mid-phrase? Ask: whose leading tone is this? The answer names the target.",
    "V7/X is even stronger than V/X — the borrowed 7th adds the tritone pull.",
    "Chain them: V/vi → vi can continue vi → V/V → V → I — pushes all the way home.",
    "Next lesson: when the borrowed key KEEPS the spotlight — modulation."
  ],
  rewards:{ badge:"Dominant Lender", icon:"\u{1F3AF}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify the target, construct its dominant, and examine the expected resolution.",
  quiz:[
    { type:"mc", q:"A secondary dominant is…", choices:["a chord that temporarily functions as V of a nontonic chord","any seventh chord","the tonic chord with a different spelling"], answer:0,
      explain:"A secondary dominant applies dominant function to a nontonic chord.", hint:"V of something else." },
    { type:"mc", q:"How is 'V/V' read aloud?", choices:["five of five","five-five","V slash V"], answer:0,
      explain:"The dominant OF the dominant.", hint:"Of." },
    { type:"mc", q:"To build V/ii in C major:", choices:["A major — a P5 above D","D major","A minor"], answer:0,
      explain:"V/ii in C major is A major or A7, containing the temporary leading tone C♯.", hint:"Target root D." },
    { type:"mc", q:"V/vi in C major is spelled…", choices:["E-G♯-B","E-G-B","A-C♯-E"], answer:0,
      explain:"V/vi in C major is E–G♯–B; G♯ resolves toward A.", hint:"Points at Am." },
    { type:"mc", q:"In C major, F♯ most reliably signals V/V when it…", choices:["belongs to a D major or D7 chord that resolves to G","appears anywhere in the melody","is the only accidental present"], answer:0,
      explain:"F♯ may signal V/V when it belongs to a D major or D7 chord that points toward G; the accidental alone does not confirm it.", hint:"Check the whole chord and its resolution." },
    { type:"mc", q:"What is V⁷/IV in C major?", choices:["C7, C–E–G–B♭","F major, F–A–C","G7, G–B–D–F"], answer:0,
      explain:"C7 functions as the dominant seventh of F. The added B♭ distinguishes V⁷/IV from the diatonic tonic triad C major.", hint:"Add the B♭ seventh to C." },
    { type:"mc", q:"Identify the chord (key: C major).",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:160},
      choices:["V/V — D major resolving toward G","ii — D minor","IV — F major"], answer:0,
      explain:"D–F♯–A forms a major triad. When it points toward G, it functions as V/V.", hint:"Spot the accidental." },
    { type:"mc", q:"What is the expected resolution of V/vi?", choices:["vi","V","I"], answer:0,
      explain:"The slash names the target.", hint:"Read after the slash." },
    { type:"truefalse", q:"Tonicization temporarily treats a nontonic chord as a local tonic.", answer:true,
      explain:"Momentary homeness while the prevailing key remains active.", hint:"Brief." },
    { type:"truefalse", q:"A secondary dominant triad has major quality.", answer:true,
      explain:"An applied dominant seventh has major-minor seventh quality.", hint:"V quality." },
    { type:"mc", q:"In I → V/V → V → I, which chord is directly tonicized by V/V?", choices:["V","The opening I","The final I"], answer:0,
      explain:"V/V functions as the dominant of V and therefore directs attention toward V.", hint:"The loaded chord." },
    { type:"mc", q:"When a new key receives structural confirmation through sustained harmonic activity or cadential emphasis, the process is called…", choices:["Modulation","Cadence","Pedal point"], answer:0,
      explain:"A modulation establishes a new tonic more substantially than a brief tonicization.", hint:"L99." },
    { type:"mc", q:"In C major, which note is the temporary leading tone in V/V (D major)?", choices:["F♯","C♯","G♯"], answer:0,
      explain:"F♯ is the leading tone of G; it rises to G.", hint:"It resolves up to G." },
    { type:"mc", q:"In C major, which accidental tells you a chord is functioning as V/ii?", choices:["C♯","F♯","B♭"], answer:0,
      explain:"C♯ is the temporary leading tone to D (the root of ii = Dm).", hint:"The leading tone of D." },
    { type:"mc", q:"Which chord should normally follow V/vi?", choices:["vi","V","IV"], answer:0,
      explain:"A secondary dominant resolves to its target — V/vi → vi.", hint:"Read after the slash." }
  ],
  miaPerfect:"Perfect score! You accurately constructed and identified secondary dominants and their targets.",
  miaPass:"You passed! Next, you will study modulation between keys.",
  mia:{
    hook:{ label:"the welcome",
      explain:"D major (F♯) resolved into G exactly as a V resolves to I — V/V, the dominant of the dominant.",
      play:()=>{const ROWS=[[60,64,67],[62,66,69],[55,59,62],[60,64,67]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.27)));} },
    learn:{ label:"secondary dominants",
      explain:"V/X = major chord a P5 above X; accidental = temporary leading tone; resolves V/X→X; brief homeness = tonicization.",
      hint:"P5 up, made major.",
      play:()=>{[62,66,69].forEach(m=>MFAudio.tone(m,.8,.05,.27));[55,59,62].forEach(m=>MFAudio.tone(m,.9,.95,.27));} },
    example:{ label:"the examples",
      explain:"Example 1 loads V with its own dominant (I-V/V-V-I); example 2 tonicizes vi with E major's G♯." },
    game:{ label:"the games",
      explain:"Sprint the spellings, walk the double push, spot secondaries by accidental, then resolve targets at speed.",
      hint:"The accidental points at the target." },
    quiz:{ label:"this question",
      explain:"Whose leading tone is the accidental? That names the target; the chord is a P5 above it, made major; it resolves to the slash.",
      play:()=>{[64,68,71].forEach(m=>MFAudio.tone(m,.8,.05,.27));[69,72,76].forEach(m=>MFAudio.tone(m,.9,.95,.27));} }
  }
};
