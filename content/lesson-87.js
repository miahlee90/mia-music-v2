/* Lesson 87 — Cadences (Book 4, Unit 21 — SELF-AUTHORED)
   Core: CADENCE = the harmonic resting point ending a phrase.
   AUTHENTIC V(7)→I — PERFECT (PAC: both root position, tonic on top) vs
   IMPERFECT (IAC). HALF: ends ON V. PLAGAL: IV→I. DECEPTIVE: V→vi.
   NOTE: chord demos play immediately (no chime before demos).
   NOTE: edit by FULL-FILE REWRITE only. */

/* cadence ear lab */
function MF_L87_ear(container,fb){
  const CAD={
    auth:{rows:[[67,71,74,77],[60,64,67,72]], name:"Authentic (V7 \u{2192} I)"},
    half:{rows:[[62,65,69],[67,71,74]], name:"Half (ends ON V)"},
    plag:{rows:[[65,69,72],[60,64,67,72]], name:"Plagal (IV \u{2192} I)"},
    dec:{rows:[[67,71,74,77],[69,72,76]], name:"Deceptive (V7 \u{2192} vi)"}};
  const ROUNDS=["auth","half","dec","plag"];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l87e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l87e-play">▶ Hear the phrase ending</button></div>
    <div class="choices l87e-ch" style="display:none"><button>Authentic — V to I, finished</button><button>Half — stops on V, unfinished</button><button>Plagal — IV to I, gentle</button><button>Deceptive — V to vi, surprise</button></div>`;
  const q=container.querySelector(".l87e-q"), pl=container.querySelector(".l87e-play"), ch=container.querySelector(".l87e-ch");
  const KEY=["auth","half","plag","dec"];
  pl.onclick=()=>{
    const C=CAD[ROUNDS[r]]; if(!C) return;
    MFAudio.tone(60,.5,.05,.3); MFAudio.tone(64,.5,.05,.2); MFAudio.tone(67,.5,.05,.2); /* set tonic context: I */
    C.rows.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,.8+i*.9,.28)));
    played=true; setTimeout(()=>ch.style.display="",2900);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const want=ROUNDS[r];
    if(KEY[i]===want){ fb(true,"✓ "+CAD[want].name+" — correct."); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! All four cadences identified by ear."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: listen, then name the cadence.`;
    } else { MFAudio.tone(40,.2); fb(false,"Listen to the final two harmonies at the phrase ending: V\u{2192}I is authentic, IV\u{2192}I is plagal, an ending on V is half, and V\u{2192}vi is deceptive."); }
  });
  q.innerHTML="Round 1 of 4: listen, then name the cadence.";
}

LESSON_CONTENT[87]={
  welcome:"Cadences create arrival, pause, or expectation at the ends of phrases.",
  hook:{
    say:"<b>Listen to two phrase endings.</b> One creates a strong sense of arrival, while the other ends with an expectation of continuation. \u{1F447} <b>Which ending sounds more complete?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Ending A</button>
          <button class="play hk-b">▶ Ending B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Ending A — it resolves from V to I</button><button>Ending B — it stops on V and sounds incomplete</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [[60,64,67],[65,69,72],[67,71,74,77],[60,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.28))); hA=true; if(hB) setTimeout(()=>ch.style.display="",3700); };
        container.querySelector(".hk-b").onclick=()=>{ [[60,64,67],[62,65,69],[67,71,74]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.28))); hB=true; if(hA) setTimeout(()=>ch.style.display="",3000); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Ending A resolves from dominant to tonic, creating a stronger sense of closure. Ending B stops on the dominant and suggests continuation.");
          else fb(false,"Ending B stops on the dominant without resolving to tonic. Listen again for the ending that creates a stronger sense of arrival.");
        });
      } }
  },
  objectives:[
    "Define cadence: a harmonic ending that marks the end of a phrase",
    "Recognize Authentic, Half, Plagal, and Deceptive cadences",
    "Distinguish PAC and IAC",
    "Identify each cadence by ear and by notation",
    "Understand how different cadences create different musical endings"
  ],
  steps:[
    { say:"<b>Cadence:</b> a harmonic ending that marks the end of a phrase. You identify it by the final chord motion. \u{1F447} <b>Where does a cadence normally occur?</b>",
      try:{ type:"mc", choices:["At or near the end of a phrase","On every beat","Only at the end of an entire composition"], answer:0,
        success:"✓ Correct. Cadences commonly mark phrase endings, so a composition may contain many cadential points.",
        fail:"Where does a phrase create a point of arrival or pause?",
        hint:"Recall the phrase endings introduced in Lesson 72." } },
    { say:"<b>Authentic Cadence — V (or V⁷) → I:</b> the dominant resolves to the tonic at a phrase ending. This is the strongest way to close a phrase. \u{1F447} <b>Which harmonic motion defines an authentic cadence in a major key?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["V or V⁷ to I","IV to I","I to V"], answer:0,
        success:"✓ Correct. An authentic cadence moves from dominant to tonic at a phrase ending.",
        fail:"Identify the motion from dominant to tonic.",
        hint:"The leading tone resolves to the tonic in a typical authentic cadence." } },
    { say:"<b>PAC vs IAC:</b><br>• <b>PAC</b> — V(⁷)→I, both chords in root position, soprano ends on the tonic (strongest ending).<br>• <b>IAC</b> — any authentic V–I that does not meet all PAC conditions. \u{1F447} <b>A root-position V–I cadence ends with scale degree 3 in the soprano. How is it classified?</b>",
      try:{ type:"mc", choices:["Imperfect authentic cadence","Perfect authentic cadence","Half cadence"], answer:0,
        success:"✓ Correct. The cadence is authentic because it moves from V to I, but it is imperfect because the soprano ends on scale degree 3 rather than the tonic.",
        fail:"Check the chord positions and the final soprano note.",
        hint:"A PAC requires root-position V–I and the tonic in the final soprano." } },
    { say:"<b>Half Cadence — ends on V:</b> the phrase ends on the dominant. It feels unfinished and expects continuation. \u{1F447} <b>A half cadence normally ends on…</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"G4",d:"w",label:"V — wait…"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"final"}],width:480} },
      try:{ type:"mc", choices:["A root-position V chord","A I chord","A vi chord"], answer:0,
        success:"✓ Correct. Ending on the dominant creates an open cadence that commonly suggests continuation.",
        fail:"The dominant is reached but does not resolve to tonic.",
        hint:"The phrase ends on V." } },
    { say:"<b>Plagal Cadence — IV → I:</b> often called the “Amen” cadence. It gives a gentle sense of arrival, without the dominant-to-tonic motion of an authentic cadence. \u{1F447} <b>Which harmonic motion defines a plagal cadence?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:400} },
      try:{ type:"mc", choices:["IV to I","V to I","V to vi"], answer:0,
        success:"✓ Correct. A plagal cadence moves from IV to I without dominant-to-tonic harmonic motion.",
        fail:"Identify the motion from IV to I.",
        hint:"Subdominant to tonic." } },
    { say:"<b>Deceptive Cadence:</b> V begins as if it will resolve to I, but moves somewhere else instead — <b>V → vi</b> in major, <b>V → VI</b> in minor. This delays the tonic and often keeps the music going. \u{1F447} <b>Why is V–vi in a major key called deceptive?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi — surprise!"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["V creates an expectation of I but moves to vi instead","The progression contains no dominant chord","The dynamic level changes unexpectedly"], answer:0,
        success:"✓ Correct. The dominant creates an expectation of tonic, but the progression moves to vi instead.",
        fail:"Which chord normally follows V in an authentic cadence?",
        hint:"The expected tonic chord does not arrive." } },
    { say:"Listen to each phrase ending and identify the cadence. \u{1F447}",
      try:{ type:"custom",
        hint:"Identify the final two harmonies and confirm that they occur at a phrase ending. V–I is authentic, IV–I is plagal, a phrase ending on root-position V is a half cadence, and V–vi in major is deceptive.",
        mount:(container,fb)=>MF_L87_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which cadence most clearly suggests that the phrase will continue?</b>",
      try:{ type:"mc", choices:["A half cadence ending on V","A perfect authentic cadence","A plagal cadence"], answer:0,
        success:"✓ Correct. A half cadence ends on the dominant without resolving to tonic, creating an expectation of continuation.",
        fail:"Which cadence ends on V rather than resolving to I?",
        hint:"Identify the cadence that stops on the dominant." } }
  ],
  examples:[
    { caption:"Four endings from one phrase: authentic (V7-I), half (…V), plagal (IV-I), deceptive (V7-vi). Same music, four punctuation marks.",
      staff:{clef:"treble",tempo:84,notes:[
        {p:"G4",d:"q",label:"V7"},{p:"B4",d:"q",chord:true},{p:"F5",d:"q",chord:true},
        {p:"C5",d:"q",label:"I"},{p:"E5",d:"q",chord:true},{p:"G5",d:"q",chord:true},{bar:"single"},
        {p:"D4",d:"q",label:"ii"},{p:"F4",d:"q",chord:true},{p:"A4",d:"q",chord:true},
        {p:"G4",d:"q",label:"V"},{p:"B4",d:"q",chord:true},{p:"D5",d:"q",chord:true},{bar:"single"},
        {p:"F4",d:"q",label:"IV"},{p:"A4",d:"q",chord:true},{p:"C5",d:"q",chord:true},
        {p:"C4",d:"q",label:"I"},{p:"E4",d:"q",chord:true},{p:"G4",d:"q",chord:true},{bar:"single"},
        {p:"G4",d:"q",label:"V7"},{p:"B4",d:"q",chord:true},{p:"F5",d:"q",chord:true},
        {p:"A4",d:"q",label:"vi!"},{p:"C5",d:"q",chord:true},{p:"E5",d:"q",chord:true},{bar:"final"}],width:680},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"PAC vs IAC: the same V7-I twice — first with the tonic proudly on top (perfect), then with the 3rd on top (imperfect). Hear the difference in finality.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I (C on top)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"single"},
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I (E on top)"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Cadence Identification (45s)",
      intro:"Identify four cadence types, their harmonic motions, and their effects.",
      miaIntro:"Authentic, half, plagal, or deceptive.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Authentic cadence","V(7) \u{2192} I"],
        ["Half cadence","ends ON V"],
        ["Plagal cadence","IV \u{2192} I"],
        ["Deceptive cadence","V \u{2192} vi"],
        ["PAC requires","root positions + tonic on top"],
        ["IAC","authentic, but not perfect"],
        ["The unfinished cadence","half"],
        ["The gentle close","plagal"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Cadence-identification challenge completed!":null },
    { type:"key-climb", title:"Game 2 · Perform an Authentic Cadence",
      intro:"Play a root-position V⁷–I cadence. End with the tonic in the highest voice to create a PAC.",
      miaIntro:"Resolve the dominant to tonic.",
      spec:{seq:[55,59,62,65, 48,52,55,60],
        names:["G (V7 root)","B (leading tone!)","D","F (the 7th)","C (I root)","E","G","C (tonic on top — PAC!)"],
        start:48, octaves:2, title:"V7 \u{2192} I, note by note"},
      result:(score)=>score!==null?"You performed a perfect authentic cadence.":null },
    { type:"symbol-hunt", title:"Game 3 · Name That Cadence",
      intro:"Examine each phrase ending and select the correct cadence type.",
      miaIntro:"Identify the final harmonies and check the phrase ending.",
      spec:{rounds:6, pool:[
        {label:"Authentic (V \u{2192} I)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:210}},
        {label:"Plagal (IV \u{2192} I)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:210}},
        {label:"Deceptive (V \u{2192} vi)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:210}},
        {label:"Half (ends on V)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:210}}]},
      result:(score)=>score>=5?"You identified the cadences correctly.":null },
    { type:"term-race", title:"Game 4 · Cadence Effect",
      intro:"Match each cadence with its typical harmonic effect.",
      miaIntro:"Listen for closure, continuation, or delayed resolution.",
      spec:{rounds:8, reverse:true, pool:[
        ["Strong closure on tonic","authentic (V\u{2192}I)"],
        ["Open, suggests continuation","half (ends on V)"],
        ["Gentle tonic arrival","plagal (IV\u{2192}I)"],
        ["Avoids the expected tonic","deceptive (V\u{2192}vi)"],
        ["Full closure","PAC"],
        ["Closure with reservations","IAC"],
        ["Keeps the music going","deceptive"],
        ["Waits for an answer","half"]]},
      result:(score)=>score>=6?"You matched each cadence with its typical effect.":null }
  ],
  practiceIntro:"Complete 20 practice questions on authentic, half, plagal, and deceptive cadences, including PAC and IAC. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Authentic","V \u{2192} I"],["Half","ends on V"],["Plagal","IV \u{2192} I"],["Deceptive","V \u{2192} vi"],["PAC","perfect authentic"],["Cadence","marks a phrase ending"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"A cadence is best described as…", choices:["a melodic and harmonic gesture that marks a phrase ending or point of arrival","a rapidly performed scale","a type of clef"], answer:0,
      explain:"Cadences help articulate phrase endings through melody, harmony, and rhythm." },
    { type:"mc", q:"Which harmonic motion defines an authentic cadence?", choices:["V or V⁷ to I","IV to I","V to vi"], answer:0,
      explain:"Dominant resolves to tonic at a phrase ending." },
    { type:"mc", q:"A perfect authentic cadence requires…", choices:["root-position V or V⁷ and I, with the tonic in the final soprano","any V–I motion","a IV chord"], answer:0,
      explain:"Both conditions for full closure." },
    { type:"mc", q:"A half cadence normally ends on…", choices:["root-position V","I","vi"], answer:0,
      explain:"The open door." },
    { type:"mc", q:"Which harmonic motion defines a plagal cadence?", choices:["IV–I","V–I","V–vi"], answer:0,
      explain:"A plagal cadence moves from IV to I." },
    { type:"mc", q:"In a major key, V–vi most commonly produces which cadence?", choices:["Deceptive cadence","Plagal cadence","Half cadence"], answer:0,
      explain:"The promised I never arrives." },
    { type:"truefalse", q:"A half cadence normally creates a strong sense of final closure.", answer:false,
      explain:"It waits on the dominant." },
    { type:"truefalse", q:"An IAC is a type of authentic cadence.", answer:true,
      explain:"It contains authentic dominant-to-tonic motion but does not meet all the conditions of a PAC." },
    { gen:"term-match", params:{subject:"term", pool:[["Finished, strongest","PAC"],["Finished, gentle","plagal"],["Unfinished, waiting","half"],["Surprised","deceptive"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:1 }
  ],
  vocabulary:[
    {term:"Cadence", def:"A harmonic ending that marks the end of a musical phrase."},
    {term:"Authentic Cadence (PAC / IAC)", sym:"V(⁷) → I", def:"V or V7 → I. PAC = strongest ending. IAC = less complete ending."},
    {term:"Half Cadence", sym:"? → V", def:"Ends on V. Creates an expectation of continuation."},
    {term:"Plagal & Deceptive", sym:"IV→I & V→vi", def:"Plagal: IV → I (“Amen” cadence). Deceptive: V → vi (major) or V → VI (minor)."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Cadence</b> = harmonic ending of a phrase.",
    "✔ <b>Authentic</b>: V(⁷)→I — PAC strongest; otherwise IAC.",
    "✔ <b>Half</b>: ends on V → unfinished.",
    "✔ <b>Plagal</b>: IV→I (“Amen”).",
    "✔ <b>Deceptive</b>: V→vi (major) or V→VI (minor).",
    "✔ Listen to the final two chords to identify the cadence."
  ],
  tips:[
    "Question-answer pairs: phrase 1 with a weaker cadence (often a half cadence), phrase 2 with a stronger one (often a PAC) — one common design in countless melodies (and next lesson's periods).",
    "Deceptive cadences extend pieces: composers 'miss' the ending on purpose, then land it for real.",
    "Sing the soprano at each cadence — ending on 1 (PAC) feels different from ending on 3 (IAC).",
    "Unit 21 complete! Next unit: phrases pair into PERIODS — cadences make it possible."
  ],
  rewards:{ badge:"Cadence Keeper", icon:"\u{1F6A6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify cadence types from their harmonic motion and phrase-ending context.",
  quiz:[
    { type:"mc", q:"Which statement best describes a cadence?", choices:["It is a melodic and harmonic gesture that marks a phrase ending or point of arrival","It is the fastest passage in a composition","It is any repeated motive"], answer:0,
      explain:"Punctuation in harmony.", hint:"Where phrases rest." },
    { type:"mc", q:"Which progression can form an authentic cadence at a phrase ending?", choices:["V⁷–I","IV–I","V–vi"], answer:0,
      explain:"Dominant resolves to tonic.", hint:"Dominant to tonic." },
    { type:"mc", q:"A perfect authentic cadence (PAC) requires…", choices:["root-position V or V⁷ and I, with the tonic in the final soprano","any V–I motion","a IV chord before I"], answer:0,
      explain:"Two strict conditions.", hint:"Perfection has rules." },
    { type:"mc", q:"A root-position V–I cadence ends with scale degree 3 in the soprano. How is it classified?", choices:["Imperfect authentic cadence","Perfect authentic cadence","Plagal cadence"], answer:0,
      explain:"Authentic but imperfect.", hint:"Check the top note." },
    { type:"mc", q:"A half cadence normally…", choices:["ends on root-position V","ends on I","moves from IV to I"], answer:0,
      explain:"Open — the comma.", hint:"Half-way home." },
    { type:"mc", q:"Which progression can form a plagal cadence at a phrase ending?", choices:["IV–I","V–I","ii–V"], answer:0,
      explain:"Plagal motion approaches tonic from IV rather than V.", hint:"Subdominant to tonic." },
    { type:"mc", q:"In a major key, a deceptive cadence most commonly moves from V to…", choices:["vi","I","IV"], answer:0,
      explain:"The expected tonic is avoided when V moves to vi.", hint:"The surprise chord." },
    { type:"mc", q:"Name the cadence.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:240},
      choices:["Deceptive cadence — V moves to vi","Authentic cadence","Plagal cadence"], answer:0,
      explain:"In C major, G–B–D moves to A–C–E, producing V–vi at the phrase ending.", hint:"Where did V land?" },
    { type:"truefalse", q:"A phrase ending on a root-position V chord normally creates a half cadence.", answer:true,
      explain:"Stopping on the dominant defines it.", hint:"The open door." },
    { type:"truefalse", q:"A deceptive cadence completes the expected V–I resolution.", answer:false,
      explain:"A deceptive cadence avoids the expected tonic resolution.", hint:"De-CEP-tive." },
    { type:"mc", q:"Which cadence pair commonly supports an antecedent–consequent period?", choices:["Half cadence followed by a PAC","PAC followed by a half cadence","Two deceptive cadences"], answer:0,
      explain:"The antecedent commonly ends with a weaker or open cadence, while the consequent ends with a stronger cadence. A half cadence followed by a PAC is one common pattern.", hint:"Unfinished first." },
    { type:"mc", q:"You hear a phrase ending with IV–I. Which cadence is it?", choices:["Plagal cadence","Authentic cadence","Half cadence"], answer:0,
      explain:"A plagal cadence approaches tonic from IV rather than V.", hint:"Identify the chord immediately before I." }
  ],
  miaPerfect:"Perfect score! You accurately identified authentic, half, plagal, and deceptive cadences.",
  miaPass:"You passed and completed unit 21. Next, you will study phrases and periods.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Ending A closed V\u{2192}I (authentic — finished); ending B stopped ON V (half — waiting). Cadences are harmony's punctuation.",
      play:()=>{[[60,64,67],[65,69,72],[67,71,74,77],[60,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.7,i*.75,.28)));} },
    learn:{ label:"cadences",
      explain:"Authentic V(7)→I (PAC: roots + tonic on top; else IAC) · half ends ON V · plagal IV→I · deceptive V→vi.",
      hint:"Finished? From where?",
      play:()=>{[[67,71,74,77],[69,72,76]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.28)));} },
    example:{ label:"the examples",
      explain:"Example 1 plays all four endings in a row; example 2 contrasts PAC and IAC — listen to the soprano's landing note." },
    game:{ label:"the games",
      explain:"Sprint the formulas, perform V7→I, name cadences on cards, then match punctuation at speed.",
      hint:"Last two chords tell all." },
    quiz:{ label:"this question",
      explain:"Two questions crack every cadence: did it finish on I (authentic/plagal — check the approach chord)? If not, is it waiting on V (half) or surprised on vi (deceptive)?",
      play:()=>{[[65,69,72],[60,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.28)));} }
  }
};
