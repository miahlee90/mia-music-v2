/* Lesson 96 — Nonharmonic Tones Expanded (Book 4, Unit 24 — SELF-AUTHORED)
   L66's passing/neighbor tones = ONE review step. New: SUSPENSION (4-3, 7-6,
   9-8: preparation-suspension-resolution), APPOGGIATURA (leap in, step out),
   ESCAPE TONE (step in, leap out), ANTICIPATION (melodic — early arrival of
   the NEXT chord's tone; distinct from L78's rhythmic anticipation),
   PEDAL POINT (held bass under changing harmony), RETARDATION (upward
   suspension). NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[96]={
  welcome:"Nonchord tones are identified by how they enter, how they leave, where they sit in the harmony, and how they resolve.",
  hook:{
    say:"<b>Listen to the upper note as the harmony changes beneath it.</b> The note is sustained into the new chord and then resolves downward by step. \u{1F447} <b>How does the dissonance resolve?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the suspension</button></div>
          <div class="choices hk-ch" style="display:none"><button>The sustained note moves down by step to a chord tone</button><button>The harmony changes again without resolution</button><button>The sustained note leaps up an octave</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          [53,57,60].forEach(m=>MFAudio.tone(m,1.0,.05,.25)); MFAudio.tone(72,1.0,.05,.4);   /* F chord, C on top */
          [55,59,62].forEach(m=>MFAudio.tone(m,1.0,1.15,.25)); MFAudio.tone(72,.7,1.15,.4);  /* G chord, C held = 4-3 sus */
          MFAudio.tone(71,1.1,1.9,.42);                                                      /* resolves to B */
          setTimeout(()=>ch.style.display="",3300);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. C is prepared as a chord tone, sustained over the change to a G chord, and then resolved downward by step to B. This three-stage process creates a suspension.");
          else fb(false,"Follow the upper note: it is prepared, sustained into the new harmony, and then resolved downward by step.");
        });
      } }
  },
  objectives:[
    "Review passing and neighboring tones",
    "Identify common nonchord tones",
    "Understand suspensions and retardations",
    "Distinguish appoggiaturas from escape tones",
    "Recognize anticipation and pedal point",
    "Identify nonchord tones by approach and resolution"
  ],
  steps:[
    { say:"<b>Review — one system for every nonchord tone:</b> a nonchord tone does not belong to the chord sounding at that moment. You identify each one by <b>how it enters, how it leaves, where it sits in the meter, and how it resolves</b>. Quick reminder: a <b>passing tone</b> steps → steps (onward); a <b>neighbor tone</b> steps away → steps back. \u{1F447} <b>Which information is most useful for identifying a nonchord tone?</b>",
      try:{ type:"mc", choices:["Its approach, departure, metric placement, and harmonic context","Only its dynamic level","Only its octave"], answer:0,
        success:"✓ Correct. Approach and departure are important, but metric placement and harmonic context may also determine the classification.",
        fail:"Examine how the note enters, how it leaves, and which harmonies surround it.",
        hint:"Approach + departure + harmonic context." } },
    { say:"<b>Suspension — three stages:</b> <b>preparation</b> (a chord tone in chord 1), <b>suspension</b> (the same pitch holds as chord 2 arrives, now dissonant), <b>resolution</b> (it steps <b>down</b> to a chord tone). Most suspensions resolve <b>downward by step</b>. Common figures — <b>4–3, 7–6, 9–8</b> — are measured above the <b>bass</b>. Example: <b>F</b>, the 7th of <b>G7</b>, is prepared, held as the <b>4th over C</b> in <b>Csus4</b>, then resolves down to <b>E</b>, the 3rd. \u{1F447} <b>In its standard form, how does a suspension resolve?</b>",
      show:{ type:"staff", spec:{clef:"grand",tempo:66,notes:[
        {p:"G2",d:"w",clef:"bass",label:"G7 — prep"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C3",d:"w",clef:"bass",label:"Csus4 — sus 4"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C3",d:"w",clef:"bass",label:"C — res 3"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:560} },
      try:{ type:"mc", choices:["Downward by step to a chord tone","Upward by octave","By remaining unresolved"], answer:0,
        success:"✓ Correct. A standard suspension resolves downward by step, as in 4-3, 7-6, or 9-8.",
        fail:"Observe the direction and size of the resolution.",
        hint:"A standard suspension resolves downward by step." } },
    { say:"<b>Retardation:</b> unlike a suspension, a retardation resolves <b>upward by step</b>. The preparation and the held dissonance are the same — only the resolution direction differs. The most common example is <b>7–8</b>: scale degree 7 rising to 1 at a cadence. \u{1F447} <b>How does a retardation differ from a standard suspension?</b>",
      try:{ type:"mc", choices:["It resolves upward by step","It never resolves","It has no preparation"], answer:0,
        success:"✓ Correct. Both tones are prepared and sustained, but a retardation resolves upward rather than downward.",
        fail:"The resolution is delayed and then moves upward by step.",
        hint:"Prepared → sustained → resolved upward." } },
    { say:"<b>Appoggiatura and Escape Tone — mirror images:</b> an <b>appoggiatura</b> leaps in and steps out, usually <b>accented</b> and expressive. An <b>escape tone</b> steps in and leaps out, usually <b>unaccented</b>. \u{1F447} <b>A prominent nonchord tone is approached by leap and resolved by step. What is it?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Tone</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Enters by</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Leaves by</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#2F6DA8">Passing</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step (onward)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#2F6DA8">Neighbor</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step (back)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#C05A21">Appoggiatura</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">leap</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#C05A21">Escape tone</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">leap</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#A9821F">Suspension</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">held over</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">step down</td></tr></table>` },
      try:{ type:"mc", choices:["An appoggiatura","An escape tone","A pedal point"], answer:0,
        success:"✓ Correct. An appoggiatura is typically approached by leap and resolved by step.",
        fail:"Compare both the approach and departure intervals.",
        hint:"Leap in, step out." } },
    { say:"<b>Anticipation:</b> the defining feature — <b>the note belongs to the FOLLOWING harmony</b>, arriving early. Against the current chord it is dissonant; it then stays (or repeats) when the anticipated chord arrives. \u{1F447} <b>An anticipation belongs to which harmony?</b>",
      try:{ type:"mc", choices:["The following chord","Only the previous chord","No surrounding chord"], answer:0,
        success:"✓ Correct. The pitch arrives before the chord to which it belongs and remains or repeats when that harmony begins.",
        fail:"Identify which chord contains the anticipated pitch.",
        hint:"A chord tone of the following harmony arrives early." } },
    { say:"<b>Pedal Point:</b> a sustained or repeated pitch — <b>most commonly in the bass</b> — while the harmonies above it change. Tonic and dominant pedals are especially common; the pedal fits some chords and clashes with others. <b>Upper-voice pedals also occur</b> (an inverted pedal). \u{1F447} <b>In which voice does a pedal point most commonly occur?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"pedal C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"(held)"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"D4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560} },
      try:{ type:"mc", choices:["The bass","Always the soprano","It cannot occur in a musical voice"], answer:0,
        success:"✓ Correct. Pedal points most commonly occur in the bass, although an inverted pedal may occur in an upper voice.",
        fail:"Listen for a sustained or repeated pitch beneath changing harmonies.",
        hint:"Pedal points commonly occur in the lowest voice." } },
    { say:"<b>Review:</b> \u{1F447} <b>A chord tone is prepared, sustained into a new harmony as a dissonance, and resolved downward by step. What is it?</b>",
      try:{ type:"mc", choices:["A suspension","An appoggiatura","An escape tone"], answer:0,
        success:"✓ Correct. Preparation, suspension, and downward stepwise resolution define a standard suspension.",
        fail:"Identify the preparation, sustained dissonance, and resolution.",
        hint:"A 4-3 suspension is one common example." } }
  ],
  examples:[
    { caption:"A 4-3 suspension at a cadence: the C prepares over F (IV), holds over G (V) as a dissonant 4th, then falls to B — the 3rd. Prepare, suspend, resolve.",
      staff:{clef:"treble",tempo:63,notes:[
        {p:"C5",d:"w",label:"prep"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C5",d:"w",label:"sus 4"},{p:"G4",d:"w",chord:true},
        {p:"B4",d:"w",label:"res 3"},{p:"G4",d:"w",chord:true},
        {p:"C5",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:600},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"A tonic pedal: C holds in the bass while the harmony moves I – IV – V7 – I above it. The held C is consonant with I, clashes over IV and V7, then agrees again — one pitch tying the whole progression together.",
      staff:{clef:"treble",tempo:69,notes:[
        {p:"C4",d:"w",label:"I (pedal)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"IV"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w",label:"V7"},{p:"F4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:620},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Nonchord-Tone Identification (45s)",
      intro:"Identify eight nonchord-tone types from their approach, departure, metric position, and harmonic context.",
      miaIntro:"Approach, departure, placement, and harmony.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Suspension","hold over, resolve DOWN"],
        ["Retardation","hold over, resolve UP"],
        ["Appoggiatura","leap in, step out"],
        ["Escape tone","step in, leap out"],
        ["Anticipation (melodic)","next chord's note, early"],
        ["Pedal point","held bass under changing chords"],
        ["Passing tone","step through to a new chord tone"],
        ["Neighbor tone","step out and back"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Nonchord tones classified!":null },
    { type:"order-tap", title:"Game 2 · Build a Suspension",
      intro:"Arrange the three stages of a suspension in the correct order.",
      miaIntro:"Preparation → suspension → resolution.",
      spec:{sequence:["Preparation — the note belongs to chord 1","Suspension — it holds as chord 2 clashes","Resolution — it steps down into chord 2"],
        title:"The three-stage fall"},
      result:(stars)=>stars>=2?"You arranged the stages correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify Suspension Figures",
      intro:"Identify each suspension from its intervals above the bass.",
      miaIntro:"Compare the suspended interval with its resolution interval.",
      spec:{rounds:6, pool:[
        {label:"4-3 suspension", spec:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"C5",d:"w",chord:true},{p:"G3",d:"w"},{p:"B4",d:"w",chord:true}],width:180}},
        {label:"7-6 suspension", spec:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"G4",d:"w",chord:true},{p:"A3",d:"w"},{p:"F4",d:"w",chord:true}],width:180}},
        {label:"9-8 suspension", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"D5",d:"w",chord:true},{p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],width:180}},
        {label:"Retardation (7-8, rising)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"B4",d:"w",chord:true},{p:"C4",d:"w"},{p:"C5",d:"w",chord:true}],width:180}}]},
      result:(score)=>score>=5?"You identified the suspension figures correctly.":null },
    { type:"term-race", title:"Game 4 · Classify the Nonchord Tone",
      intro:"Use the approach, departure, metric position, and harmonic context to identify each tone.",
      miaIntro:"Do not rely on only one feature.",
      spec:{rounds:8, reverse:true, pool:[
        ["Leap in, step out","appoggiatura"],
        ["Step in, leap out","escape tone"],
        ["Held over, falls","suspension"],
        ["Held over, rises","retardation"],
        ["Arrives before its chord","anticipation"],
        ["Bass that will not move","pedal point"],
        ["Step-step onward","passing tone"],
        ["Step-step back","neighbor tone"]]},
      result:(score)=>score>=6?"You classified the nonchord tones correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on approach, departure, metric placement, harmonic context, and suspension figures.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Suspension","falls by step"],["Retardation","rises by step"],["Appoggiatura","leap in"],["Escape tone","leap out"],["Pedal","held bass"],["Anticipation","early arrival"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"What are the three stages of a suspension?", choices:["Preparation, suspension, and resolution","Attack, decay, and release","Verse, chorus, and bridge"], answer:0,
      explain:"The note begins as a chord tone, becomes dissonant when the harmony changes, and resolves downward by step." },
    { type:"mc", q:"Suspension figures such as 4-3 and 7-6 measure intervals above…", choices:["the bass","the soprano","the chord root in every inversion"], answer:0,
      explain:"4-3, 7-6, 9-8 — all measured above the actual bass pitch." },
    { type:"mc", q:"An appoggiatura is typically approached by…", choices:["Leap","Step","Preparation at the same pitch"], answer:0,
      explain:"Typically leap in, step out." },
    { type:"mc", q:"An escape tone is typically left by…", choices:["Leap","Step","Remaining at the same pitch"], answer:0,
      explain:"Typically step in, leap out." },
    { type:"truefalse", q:"A retardation resolves upward by step.", answer:true,
      explain:"Usually 7 rising to 8." },
    { type:"truefalse", q:"A pedal point most commonly occurs in the bass.", answer:true,
      explain:"A sustained pitch in an upper voice may be called an inverted pedal." },
    { type:"truefalse", q:"An anticipation belongs to the following chord but arrives before that chord begins.", answer:true,
      explain:"It arrives early and remains or repeats when that harmony begins." },
    { gen:"term-match", params:{subject:"term", pool:[["4-3","suspension figure"],["7-8 rising","retardation"],["Tonic or dominant","common pedal notes"],["Harmonic anticipation","can also feel rhythmically early"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Suspension", def:"prepare → suspend → resolve DOWN. Common figures: 4–3, 7–6, 9–8."},
    {term:"Retardation", def:"prepare → suspend → resolve UP. Common figure: 7–8."},
    {term:"Appoggiatura / Escape Tone", def:"Appoggiatura: leap in → step out. Escape tone: step in → leap out."},
    {term:"Anticipation / Pedal Point", def:"Anticipation: the next chord tone arrives early. Pedal point: one pitch remains while the harmony changes."}
  ],
  mistakes:[],
  summary:[
    "✔ Nonchord tones are identified by <b>approach, departure, metric placement, and harmonic context</b>.",
    "✔ <b>Suspension</b>: prepare → suspend → resolve down.",
    "✔ <b>Retardation</b>: prepare → suspend → resolve up.",
    "✔ <b>Appoggiatura</b>: leap in → step out.",
    "✔ <b>Escape tone</b>: step in → leap out.",
    "✔ <b>Anticipation</b>: the next chord arrives early.",
    "✔ <b>Pedal point</b>: one pitch remains while the harmony changes."
  ],
  tips:[
    "Suspensions are expressive gold: the clash is the emotion, the resolution is the relief — do not rush them.",
    "Hear a 4-3 everywhere: it is the classic 'sus4 resolving' from Lesson 93, now with its full name.",
    "Pedal test: if the bass refuses to move while chords argue above, it is a pedal point.",
    "Next lesson: writing for four voices — SATB voice leading."
  ],
  rewards:{ badge:"Tension Curator", icon:"\u{1F3AD}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Use approach, departure, metric placement, preparation, and harmonic context to identify each nonchord tone.",
  quiz:[
    { type:"mc", q:"Which information helps classify a nonchord tone?", choices:["Its approach, departure, metric placement, and harmonic context","Only its dynamic level","Only its octave"], answer:0,
      explain:"Approach and departure matter, but so do metric placement and harmonic context.", hint:"Consider several features." },
    { type:"mc", q:"The suspension's stages, in order:", choices:["preparation → suspension → resolution","resolution → suspension → preparation","leap → step → hold"], answer:0,
      explain:"Belong, clash, fall.", hint:"P-S-R." },
    { type:"mc", q:"A 4-3 suspension resolves…", choices:["down by step to the chord's 3rd","up an octave","to the root"], answer:0,
      explain:"It resolves downward by step from a fourth above the bass to a third above the bass.", hint:"Numbers name intervals above the bass." },
    { type:"mc", q:"A retardation differs from a suspension by…", choices:["resolving upward by step","having no preparation","being in the bass"], answer:0,
      explain:"A retardation is prepared and sustained like a suspension but resolves upward by step.", hint:"Direction." },
    { type:"mc", q:"Leap in, step out describes…", choices:["the appoggiatura","the escape tone","the pedal point"], answer:0,
      explain:"An appoggiatura is typically accented or prominent.", hint:"Landing softened by step." },
    { type:"mc", q:"Step in, leap out describes…", choices:["the escape tone","the appoggiatura","the suspension"], answer:0,
      explain:"An escape tone is typically unaccented and leaves by leap in the opposite direction.", hint:"Step in, leap out." },
    { type:"mc", q:"A melodic anticipation is…", choices:["the next chord's tone arriving early","the previous chord's tone holding","a held bass"], answer:0,
      explain:"The pitch arrives early and remains or repeats when the following chord begins.", hint:"Ahead of the change." },
    { type:"mc", q:"A pedal point is…", choices:["a sustained pitch, usually in the bass, under changing harmonies","a fast melody","a type of cadence"], answer:0,
      explain:"Usually tonic or dominant, and usually in the bass, though an inverted pedal may appear in an upper voice.", hint:"The unmoving voice." },
    { type:"truefalse", q:"Suspension figures 4-3, 7-6 and 9-8 count intervals above the bass.", answer:true,
      explain:"They count intervals above the actual bass pitch, like figured bass.", hint:"Lesson 54's habit." },
    { type:"truefalse", q:"A harmonic anticipation can also create a rhythmic sense of early arrival.", answer:true,
      explain:"An anticipation belongs to the following harmony but arrives early in time, so harmonic and rhythmic anticipation can overlap.", hint:"Timing and pitch connect." },
    { type:"mc", q:"The soprano C is prepared, sustained over a G chord, and then resolves to B. What nonchord tone is created?", choices:["A 4-3 suspension","An escape tone","A pedal point"], answer:0,
      explain:"C forms a fourth above the bass G and resolves downward by step to B, a third above the bass.", hint:"Held, then fell." },
    { type:"mc", q:"Which pair has contrasting approach-and-departure patterns?", choices:["Appoggiatura and escape tone","Suspension and pedal point","Passing tone and anticipation"], answer:0,
      explain:"An appoggiatura is typically approached by leap and resolved by step; an escape tone is typically approached by step and left by leap.", hint:"Contrasting, not identical." },
    { type:"mc", q:"A note steps up from a chord tone and then steps back down to that same chord tone. What is it?", choices:["A neighbor tone","A passing tone","An anticipation"], answer:0,
      explain:"A neighbor tone steps away and returns; a passing tone steps onward to a DIFFERENT chord tone.", hint:"Does it return, or continue onward?" }
  ],
  miaPerfect:"Perfect score! You accurately identified eight types of nonchord tones from their melodic and harmonic contexts.",
  miaPass:"You passed! Next, you will study voice-leading principles for four-part harmony.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The C held over the new chord, clashed, then stepped down — a suspension: prepare, suspend, resolve.",
      play:()=>{[53,57,60].forEach(m=>MFAudio.tone(m,1.0,.05,.25));MFAudio.tone(72,1.0,.05,.4);[55,59,62].forEach(m=>MFAudio.tone(m,1.0,1.15,.25));MFAudio.tone(72,.7,1.15,.4);MFAudio.tone(71,1.1,1.9,.42);} },
    learn:{ label:"non-chord tones expanded",
      explain:"Approach, departure, metric placement and harmony name the tone: suspension (hold, fall), retardation (hold, rise), appoggiatura (leap in), escape (leap out), anticipation (early), pedal (usually bass holds).",
      hint:"Weigh several features, not just two.",
      play:()=>{MFAudio.tone(72,.8,.05,.4);MFAudio.tone(71,.9,.9,.42);} },
    example:{ label:"the examples",
      explain:"Example 1 is a full 4-3 suspension at a cadence; example 2 a tonic pedal holding under I, IV and V7." },
    game:{ label:"the games",
      explain:"Sprint the eight tones, stage a suspension, read figures on cards, then race entries and exits.",
      hint:"P-S-R for suspensions." },
    quiz:{ label:"this question",
      explain:"Weigh how the note arrives (step/leap/held/early) and how it leaves (step on/back/down/up/leap), together with its metric placement and harmonic context.",
      play:()=>{MFAudio.tone(74,.8,.05,.4);MFAudio.tone(72,.9,.9,.42);} }
  }
};
