/* Lesson 95 — Common Chord Progressions (Book 4, Unit 23 — SELF-AUTHORED)
   Core: ii-V-I (jazz's engine) · circle progression (roots falling in 5ths)
   · I-V-vi-IV / I-vi-IV-V (pop loops) · 12-bar blues (review step) ·
   HARMONIC RHYTHM (how fast chords change).
   NOTE: edit by FULL-FILE REWRITE only. */

/* progression ear lab — ii-V-I, four-chord loop, and harmonic rhythm */
function MF_L95_ear(container,fb){
  const LOOP=[[60,64,67],[67,71,74],[69,72,76],[65,69,72]];   /* I-V-vi-IV */
  const TWOFIVE=[[62,65,69,72],[55,59,62,65],[60,64,67,71]];  /* ii-V-I */
  const ROUNDS=[
    { q:"which progression is this?",
      play:()=>{ let t=0; LOOP.forEach(row=>{ row.forEach(m=>MFAudio.tone(m,.8,t,.26)); t+=.85; }); return t; },
      choices:["ii-V-I","Four-chord loop (I-V-vi-IV)","One held chord"], answer:1,
      ok:"Four-chord loop — I-V-vi-IV." },
    { q:"which progression is this?",
      play:()=>{ let t=0; TWOFIVE.forEach(row=>{ row.forEach(m=>MFAudio.tone(m,.85,t,.27)); t+=.9; }); return t; },
      choices:["ii-V-I","Four-chord loop (I-V-vi-IV)","One held chord"], answer:0,
      ok:"ii-V-I — predominant, dominant, tonic." },
    { q:"the SAME four chords play twice — first slow, then fast. How did the harmonic rhythm change?",
      play:()=>{ let t=0; LOOP.forEach(row=>{ row.forEach(m=>MFAudio.tone(m,.8,t,.24)); t+=.85; }); t+=.4; LOOP.forEach(row=>{ row.forEach(m=>MFAudio.tone(m,.4,t,.24)); t+=.42; }); return t; },
      choices:["It got faster (chords change more often)","It got slower","It stayed the same"], answer:0,
      ok:"Faster harmonic rhythm — the chords change more often." }];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l95e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l95e-play">▶ Play</button></div>
    <div class="choices l95e-ch" style="display:none"></div>`;
  const q=container.querySelector(".l95e-q"), pl=container.querySelector(".l95e-play"), ch=container.querySelector(".l95e-ch");
  function render(){
    const R=ROUNDS[r]; played=false;
    q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: ${R.q}`;
    ch.innerHTML=""; ch.style.display="none";
    R.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c; b.onclick=()=>pick(i); ch.appendChild(b); });
  }
  pl.onclick=()=>{ const R=ROUNDS[r]; if(!R) return; const dur=R.play(); played=true; setTimeout(()=>ch.style.display="",dur*1000+300); };
  function pick(i){
    if(!played) return; const R=ROUNDS[r];
    if(i===R.answer){ fb(true,"✓ "+R.ok); r++;
      if(r>=ROUNDS.length){ q.textContent="Excellent! ii-V-I, the four-chord loop, and harmonic rhythm — all by ear."; pl.style.display="none"; ch.innerHTML=""; }
      else render();
    } else { MFAudio.tone(40,.2); fb(false,"Listen again: count the chords and how often they change."); }
  }
  render();
}

LESSON_CONTENT[95]={stackFigures:true,
  welcome:"Common harmonic progressions create musical direction.",
  hook:{
    say:"<b>Many songs use recurring chord patterns.</b> Listen to this four-chord loop. \u{1F447} <b>How many different chords occur before the pattern repeats?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the loop (twice)</button></div>
          <div class="choices hk-ch" style="display:none"><button>Four — I, V, vi, and IV</button><button>Three — I, V, and IV</button><button>Five — I, ii, IV, V, and vi</button></div>`;
        const ROWS=[[60,64,67],[67,71,74],[69,72,76],[65,69,72]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ for(let k=0;k<2;k++) ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,(k*4+i)*.8,.26))); setTimeout(()=>ch.style.display="",8*800+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The loop contains four chords — I-V-vi-IV — and then repeats. This progression appears in many popular-music contexts.");
          else fb(false,"Identify the chord roots C, G, A, and F before the progression repeats.");
        });
      } }
  },
  objectives:[
    "Recognize common harmonic progressions",
    "Understand harmonic function: Tonic → Predominant → Dominant → Tonic",
    "Identify ii–V–I",
    "Recognize common four-chord loops",
    "Understand harmonic rhythm",
    "Identify progressions by ear"
  ],
  steps:[
    { say:"<b>ii–V–I — Tension and Release:</b> ii–V–I is really about <b>function</b>: <b>ii = Predominant</b> (sets up), <b>V = Dominant</b> (tension), <b>I = Tonic</b> (release). In C major that is Dm7 → G7 → Cmaj7 — listen for the pull of G7 resolving home to C. \u{1F447} <b>Which functional pattern does ii–V–I represent?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:72,notes:[
        {p:"D4",d:"w",label:"ii7"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G3",d:"w",label:"V7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"C4",d:"w",label:"Imaj7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"final"}],width:520} },
      try:{ type:"mc", choices:["Predominant → dominant → tonic","Tonic → tonic → tonic","Dominant → predominant → tonic"], answer:0,
        success:"✓ Correct. ii commonly serves predominant function, V serves dominant function, and I serves tonic function.",
        fail:"Identify the common function of ii, V, and I.",
        hint:"ii prepares V, and V resolves to I." } },
    { say:"<b>Descending Fifths:</b> many progressions move by <b>descending fifths</b> because that root motion sounds strong and natural. <b>vi–ii–V–I</b> is one example — its roots step A → D → G → C, each a fifth lower (or a fourth higher). \u{1F447} <b>In vi–ii–V–I, how does each chord root move to the next?</b>",
      try:{ type:"mc", choices:["Down a fifth, or equivalently up a fourth","Down a second","Up a third"], answer:0,
        success:"✓ Correct. The roots A-D-G-C move down a fifth (or up a fourth) each time — a strong, forward-driving motion.",
        fail:"Measure the descending interval from A to D.",
        hint:"Each root is a fifth below the one before it." } },
    { say:"<b>Four-Chord Loops:</b> a few progressions repeat over and over and power countless <b>pop</b> songs. Three common loops — <b>I–V–vi–IV</b>, <b>I–vi–IV–V</b>, and <b>vi–IV–I–V</b> — reuse the same four diatonic chords in different orders and cycle continuously. Many famous songs are built on one of them. \u{1F447} <b>Which chord symbols realize I–V–vi–IV in C major?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;font-size:13.5px">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px;text-align:center"><b>I–V–vi–IV</b><br><span style="color:#555">C–G–Am–F</span></div>
        <div style="border:2px solid #A9821F;border-radius:10px;padding:8px 14px;text-align:center"><b>I–vi–IV–V</b><br><span style="color:#555">C–Am–F–G</span></div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:8px 14px;text-align:center"><b>vi–IV–I–V</b><br><span style="color:#555">Am–F–C–G</span></div></div>` },
      try:{ type:"mc", choices:["C - G - Am - F","C - F - G - C","C - Dm - Em - F"], answer:0,
        success:"✓ Correct. In C major, I is C, V is G, vi is A minor, and IV is F.",
        fail:"Match scale degrees 1, 5, 6, and 4 with their diatonic triads in C major.",
        hint:"I = C, V = G, vi = Am, and IV = F." } },
    { say:"<b>Enrichment — The Blues:</b> the <b>twelve-bar blues</b> is another famous recurring progression, built on a twelve-measure cycle of I, IV, and V. You will study its full form in detail later — for now, just know it is one more example of a progression that repeats. \u{1F447} <b>What distinguishes twelve-bar blues from the four-chord loops introduced in this lesson?</b>",
      try:{ type:"mc", choices:["It is conventionally organized as a twelve-measure cycle with recognizable harmonic locations","It never includes the tonic chord","It contains no chord progression"], answer:0,
        success:"✓ Correct. Twelve-bar blues combines a recurring harmonic progression with a conventional twelve-measure formal cycle.",
        fail:"Identify the conventional number of measures in each blues cycle.",
        hint:"The form contains twelve measures per cycle." } },
    { say:"<b>Harmonic Rhythm:</b> harmonic rhythm is <b>how often the chords change</b>. The same progression can feel very different depending on its rate:<br>• one chord every measure — slow<br>• two chords every measure — faster<br>• one chord every two measures — slower<br>The chords stay the same; only the <b>rate of change</b> moves. \u{1F447} <b>A passage changes chords on every beat rather than once per measure. How has its harmonic rhythm changed?</b>",
      try:{ type:"mc", choices:["It has become faster","It has become slower","It has remained unchanged"], answer:0,
        success:"✓ Correct. More frequent harmonic changes create a faster harmonic rhythm. The expressive effect depends on the complete musical context.",
        fail:"Compare the number of harmonic changes within each measure.",
        hint:"Harmonic rhythm measures the rate of chord changes." } },
    { say:"Listen to each progression and identify its chord roots and qualities before naming the pattern. \u{1F447}",
      try:{ type:"custom",
        hint:"Identify the key and chord roots. Listen for ii-V-I, I-V-vi-IV, or a sequence of descending-fifths roots.",
        mount:(container,fb)=>MF_L95_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which progression creates the strongest tension-and-release, dominant-to-tonic arrival?</b>",
      try:{ type:"mc", choices:["ii–V–I","A four-chord loop (I–V–vi–IV)","Changing the harmonic rhythm"], answer:0,
        success:"✓ Correct. ii–V–I drives predominant → dominant → tonic, giving the strongest V→I resolution.",
        fail:"Which progression ends with dominant resolving to tonic?",
        hint:"Look for the predominant → dominant → tonic path." } }
  ],
  examples:[
    { caption:"Descending fifths in action: vi-ii-V-I with roots falling in 5ths, or rising in 4ths (A-D-G-C).",
      staff:{clef:"treble",tempo:76,time:"4/4",notes:[
        {p:"A3",d:"w",label:"vi"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
        {p:"G3",d:"w",label:"V"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"single"},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:580},
      kb:{start:53,octaves:1.5,labels:true} },
    { caption:"Harmonic rhythm demonstrated: first I and IV at one chord per measure (whole notes), then the full I-IV-V-I at two chords per measure (half notes) — the rate of harmonic change doubles.",
      staff:{clef:"treble",tempo:84,time:"4/4",notes:[
        {p:"C4",d:"w",label:"1 per bar"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"single"},
        {p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"single"},
        {p:"C4",d:"h",label:"2 per bar"},{p:"E4",d:"h",chord:true},{p:"G4",d:"h",chord:true},
        {p:"F4",d:"h"},{p:"A4",d:"h",chord:true},{p:"C5",d:"h",chord:true},{bar:"single"},
        {p:"G4",d:"h"},{p:"B4",d:"h",chord:true},{p:"D5",d:"h",chord:true},
        {p:"C4",d:"h"},{p:"E4",d:"h",chord:true},{p:"G4",d:"h",chord:true},{bar:"final"}],width:700},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Progression Identification (45s)",
      intro:"Identify common progressions from their Roman numerals and chord symbols.",
      miaIntro:"Identify the key, roots, and chord order.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["ii-V-I","the PD-D-T progression"],
        ["Descending-fifths progression","roots falling in 5ths"],
        ["I-V-vi-IV","a common four-chord loop"],
        ["I-vi-IV-V","often called the doo-wop loop"],
        ["12-bar blues","conventional 12-measure cycle"],
        ["Harmonic rhythm","the rate of chord change"],
        ["ii-V-I in C","Dm7 - G7 - Cmaj7"],
        ["I-V-vi-IV in C","C - G - Am - F"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Progression-identification challenge completed!":null },
    { type:"key-climb", title:"Game 2 · Perform Descending-Fifths Roots",
      intro:"Play the roots A-D-G-C, moving each root down a fifth or up a fourth to remain within a practical register.",
      miaIntro:"Follow the circle-of-fifths root pattern.",
      spec:{seq:[57,50,55,48],
        names:["A (vi)","D (ii — down a 5th)","G (V — up a 4th)","C (I — down a 5th)"],
        start:45, octaves:1.1667, title:"The descending-fifths roots"},
      result:(score)=>score!==null?"You performed the descending-fifths root sequence.":null },
    { type:"order-tap", title:"Game 3 · Assemble ii-V-I",
      intro:"Arrange ii-V-I in its common functional order.",
      miaIntro:"Predominant → dominant → tonic.",
      spec:{sequence:["ii7 — predominant (Dm7)","V7 — dominant (G7)","Imaj7 — tonic (Cmaj7)"],
        title:"The three-chord close"},
      result:(stars)=>stars>=2?"You assembled the ii-V-I progression.":null },
    { type:"term-race", title:"Game 4 · Translate the Loop",
      intro:"Translate I-V-vi-IV into chord symbols in several major keys.",
      miaIntro:"Match each numeral with its diatonic triad.",
      spec:{rounds:8, reverse:true, pool:[
        ["I-V-vi-IV in C","C-G-Am-F"],
        ["I-V-vi-IV in G","G-D-Em-C"],
        ["ii-V-I in C","Dm-G-C"],
        ["ii-V-I in F","Gm-C-F"],
        ["I-vi-IV-V in C","C-Am-F-G"],
        ["vi-ii-V-I in C","Am-Dm-G-C"],
        ["One chord per measure","slow harmonic rhythm"],
        ["Chords every beat","fast harmonic rhythm"]]},
      result:(score)=>score>=6?"You translated the progression correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on ii-V-I, descending-fifths progressions, four-chord loops, twelve-bar blues, and harmonic rhythm.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["ii-V-I","PD-D-T close"],["Descending fifths","falling-5th roots"],["I-V-vi-IV","C-G-Am-F in C"],["I-vi-IV-V","C-Am-F-G in C"],["Harmonic rhythm","chord-change rate"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 },
    { type:"mc", q:"Which seventh chords form ii-V-I in C major?", choices:["Dm7 - G7 - Cmaj7","C - F - G","Am - F - C"], answer:0,
      explain:"Degrees 2, 5, 1." },
    { type:"mc", q:"In vi-ii-V-I, the chord roots move by…", choices:["descending fifths or ascending fourths","ascending seconds","random intervals"], answer:0,
      explain:"vi→ii→V→I: A-D-G-C." },
    { type:"mc", q:"How is I-V-vi-IV realized in G major?", choices:["G - D - Em - C","G - C - D - G","G - Am - B - C"], answer:0,
      explain:"Degrees 1, 5, 6, 4 of G." },
    { type:"mc", q:"Harmonic rhythm describes…", choices:["the rate of harmonic change","the dynamic level of the chords","the speed of the melody"], answer:0,
      explain:"Chord changes per unit of time." },
    { type:"truefalse", q:"A standard twelve-bar blues cycle contains twelve measures.", answer:true,
      explain:"The harmonic details may vary, but the conventional cycle contains twelve measures." },
    { type:"truefalse", q:"ii-V-I commonly follows the functional path PD → D → T.", answer:true,
      explain:"Lesson 86's flow, condensed." },
    { type:"truefalse", q:"Changing chords more frequently creates a faster harmonic rhythm.", answer:true,
      explain:"More changes = FASTER harmonic rhythm." },
    { gen:"term-match", params:{subject:"term", pool:[["Dm7-G7-Cmaj7","ii-V-I"],["C-G-Am-F","I-V-vi-IV"],["A-D-G-C roots","descending fifths"],["I×4 IV×2 I×2 V IV I×2","12-bar blues"]], reverse:true}, count:3 },
    { gen:"inversion-id", params:{subject:"v7", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Harmonic Progression", def:"A sequence of chords that creates musical motion."},
    {term:"Harmonic Function", def:"Tonic → Predominant → Dominant → Tonic."},
    {term:"ii–V–I", def:"The most common progression in jazz. Predominant → Dominant → Tonic."},
    {term:"Harmonic Rhythm", def:"How often the chords change."}
  ],
  mistakes:[],
  summary:[
    "✔ Harmonic progression = a sequence of chords that creates musical motion.",
    "✔ <b>ii–V–I</b> = Predominant → Dominant → Tonic (one of the most common progressions in jazz).",
    "✔ Four-chord loops such as <b>I–V–vi–IV</b> and <b>I–vi–IV–V</b> repeat throughout many pop songs.",
    "✔ <b>Harmonic rhythm</b> = how often the chords change.",
    "✔ Many progressions move by <b>descending fifths</b>, creating a strong sense of forward motion."
  ],
  tips:[
    "Learn ii-V-I in three keys this week — jazz tunes are chains of them.",
    "Hearing a song? Identify the chord roots: descending-fifths root motion suggests vi-ii-V-I; a repeating four-chord order suggests a loop.",
    "Composers vary harmonic rhythm: verses often change chords slowly, while choruses may change more frequently.",
    "Unit 23 complete! Next unit: notes that do not belong — and how harmony handles them."
  ],
  rewards:{ badge:"Progression Pilot", icon:"\u{1F501}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify common chord orders, root motion, and rates of harmonic change.",
  quiz:[
    { type:"mc", q:"Which functional pattern does ii-V-I commonly express?", choices:["Predominant → dominant → tonic","Tonic → tonic → tonic","Dominant → tonic → predominant"], answer:0,
      explain:"The function flow, distilled.", hint:"Three functions, three chords." },
    { type:"mc", q:"Which seventh chords form ii-V-I in C major?", choices:["Dm7 - G7 - Cmaj7","Cm7 - F7 - B♭maj7","Em7 - A7 - Dmaj7"], answer:0,
      explain:"Degrees 2-5-1 of C.", hint:"Start on D." },
    { type:"mc", q:"In a descending-fifths progression, each root moves…", choices:["down a fifth or up a fourth","up a second","by a tritone"], answer:0,
      explain:"A→D→G→C.", hint:"The roots follow a segment of the circle of fifths." },
    { type:"mc", q:"I-V-vi-IV in C major is…", choices:["C - G - Am - F","C - Am - F - G","C - F - Am - G"], answer:0,
      explain:"C, G, Am, F — degrees 1, 5, 6, 4.", hint:"5 then 6 then 4." },
    { type:"mc", q:"I-vi-IV-V in C major is…", choices:["C - Am - F - G","C - G - Am - F","C - Dm - G - C"], answer:0,
      explain:"C, Am, F, G — degrees 1, 6, 4, 5.", hint:"6 comes second." },
    { type:"mc", q:"Which progression is conventionally organized as a twelve-measure formal cycle?", choices:["Twelve-bar blues","I-V-vi-IV","ii-V-I"], answer:0,
      explain:"Twelve-bar blues uses a conventional twelve-measure framework, although its chord details may vary.", hint:"Lesson 70." },
    { type:"mc", q:"Harmonic rhythm describes…", choices:["the rate at which harmonies change","the drum pattern","the melodic contour"], answer:0,
      explain:"Rate of harmonic change.", hint:"Chords per measure." },
    { type:"mc", q:"A verse changes chords once per measure, while the chorus changes chords twice per measure. Which section has the faster harmonic rhythm?", choices:["The chorus","The verse","They have identical harmonic rhythm"], answer:0,
      explain:"The chorus changes harmony more frequently. This does not by itself determine its total expressive energy.", hint:"Count per bar." },
    { type:"mc", q:"In C major, how is Am - Dm - G - C analyzed?", choices:["vi-ii-V-I, with descending-fifths root motion","I-V-vi-IV","Twelve-bar blues"], answer:0,
      explain:"Roots fall A→D→G→C in 5ths.", hint:"Follow the chord roots A-D-G-C." },
    { type:"truefalse", q:"In jazz and related styles, ii-V-I frequently appears with seventh chords.", answer:true,
      explain:"Dm7-G7-Cmaj7 — three seventh types chained.", hint:"Lesson 92's example." },
    { type:"truefalse", q:"In a major key, I-V-vi-IV and I-vi-IV-V use the same four chord roots and qualities in different orders.", answer:true,
      explain:"The two progressions contain I, IV, V, and vi but arrange them differently.", hint:"Compare the sets." },
    { type:"mc", q:"Which statement accurately describes vi-ii-V-I in a major key?", choices:["Its roots form a sequence of descending fifths","Every chord has dominant function","The progression avoids tonic"], answer:0,
      explain:"The roots move vi → ii → V → I by descending fifths, but the individual chords do not all serve dominant function.", hint:"Trace the roots A, D, G, C." }
  ],
  miaPerfect:"Perfect score! You accurately identified common progressions and harmonic-rhythm patterns.",
  miaPass:"You passed and completed unit 23. Next, you will expand your study of nonharmonic tones.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Four chords cycling — I-V-vi-IV, a common four-chord loop.",
      play:()=>{const ROWS=[[60,64,67],[67,71,74],[69,72,76],[65,69,72]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.26)));} },
    learn:{ label:"common progressions",
      explain:"ii-V-I (PD-D-T), descending fifths (vi-ii-V-I), four-chord loops (I-V-vi-IV, I-vi-IV-V), 12-bar blues (conventional 12-measure cycle), harmonic rhythm (rate of change).",
      hint:"Identify the chord roots.",
      play:()=>{[[62,65,69,72],[55,59,62,65],[60,64,67,71]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.27)));} },
    example:{ label:"the examples",
      explain:"Example 1 follows descending-fifths roots; example 2 doubles the harmonic rhythm mid-passage — hear how the rate of change shifts." },
    game:{ label:"the games",
      explain:"Identify the patterns, perform the descending-fifths roots, assemble ii-V-I, then translate loops across keys.",
      hint:"Identify the roots first." },
    quiz:{ label:"this question",
      explain:"Identify progressions by their chord roots: descending-fifths roots suggest vi-ii-V-I; compare the chord order with I-V-vi-IV; PD-D-T in three chords suggests ii-V-I.",
      play:()=>{[[57,60,64],[62,65,69],[67,71,74],[60,64,67]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.26)));} }
  }
};
