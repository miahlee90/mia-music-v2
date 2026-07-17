/* Lesson 78 — Syncopation (Book 4, Unit 19 — SELF-AUTHORED)
   Core: SYNCOPATION = accent shifted to a weak beat or off-beat. Made by
   off-beat accents, by TIES holding through strong beats, and by RHYTHMIC
   ANTICIPATION (a note arriving just before the beat). The 3+3+2 pattern.
   (A melodic non-harmonic tone also called "anticipation" appears later in
   the harmony lessons — this lesson's anticipation is purely rhythmic.)
   NOTE: edit by FULL-FILE REWRITE only. */

/* ear lab: straight rhythm vs syncopated rhythm */
function MF_L78_ear(container,fb){
  const ROUNDS=[1,0,1,0].sort(()=>Math.random()-.5); /* 1 = syncopated */
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l78e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l78e-play">▶ Play the rhythm</button></div>
    <div class="choices l78e-ch" style="display:none"><button>On the beat — no syncopation</button><button>Syncopated — accents between the beats</button></div>`;
  const q=container.querySelector(".l78e-q"), pl=container.querySelector(".l78e-play"), ch=container.querySelector(".l78e-ch");
  pl.onclick=()=>{
    if(r>=ROUNDS.length) return;
    const sync=ROUNDS[r]===1;
    for(let b=0;b<4;b++) MFAudio.tone(48,.22,b*.5,.34);
    if(sync){ [0,.75,1.25,1.75].forEach(t=>MFAudio.tone(76,.16,t,.3)); }
    else { [0,.5,1,1.5].forEach(t=>MFAudio.tone(76,.15,t,.28)); }
    played=true; setTimeout(()=>ch.style.display="",2500);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const sync=ROUNDS[r]===1;
    if((i===1)===sync){ fb(true,sync?"✓ The melody notes landed BETWEEN the low beats — syncopation.":"✓ Every melody note landed ON a beat — no syncopation."); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! You hear syncopation instantly."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: listen, then decide.`;
    } else { MFAudio.tone(40,.2); fb(false,"Compare the high notes with the low beats — do they line up or land between?"); }
  });
  q.innerHTML="Round 1 of 4: listen, then decide.";
}

LESSON_CONTENT[78]={
  welcome:"Syncopation shifts emphasis away from the expected strong beats.",
  hook:{
    say:"<b>Listen to two versions of the same rhythm.</b> The first emphasizes the beats; the second shifts the emphasis away from them. \u{1F447} <b>Which version shifts the accent away from the beat?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A</button>
          <button class="play hk-b">▶ Version B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — its accents fall between the beats</button><button>Version A — its notes emphasize the beats</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ for(let b=0;b<4;b++){ MFAudio.tone(48,.22,b*.5,.34); MFAudio.tone(76,.15,b*.5,.28); } hA=true; if(hB) setTimeout(()=>ch.style.display="",2300); };
        container.querySelector(".hk-b").onclick=()=>{ for(let b=0;b<4;b++) MFAudio.tone(48,.22,b*.5,.34); [0,.75,1.25,1.75].forEach(t=>MFAudio.tone(76,.16,t,.3)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Version B emphasizes the offbeats between the main beats. Shifting emphasis away from the expected strong beats creates syncopation.");
          else fb(false,"Version A emphasizes the main beats. Listen again for the version whose accents fall between the steady pulse beats.");
        });
      } }
  },
  objectives:[
    "Define syncopation: accents shifted to weak beats or off-beats",
    "Accent the off-beat (the '&') on purpose",
    "Create syncopation using ties that hold through a strong beat",
    "Define rhythmic anticipation: arriving just before the beat",
    "Read and clap the 3+3+2 pattern",
    "Recognize the difference between syncopated and on-the-beat rhythms"
  ],
  steps:[
    { say:"<b>Syncopation</b> occurs when musical emphasis shifts away from an expected strong beat. The emphasis may fall on a weak beat or an offbeat, or a note may be tied across a strong beat. Although the accents shift, the underlying pulse remains steady. \u{1F447} <b>What is syncopation?</b>",
      try:{ type:"mc", choices:["A shift of emphasis away from an expected strong beat","An increase in tempo","The complete removal of the pulse"], answer:0,
        success:"✓ Correct. The pulse remains steady, but the musical emphasis shifts away from its expected location.",
        fail:"Syncopation changes the placement of emphasis, not the tempo.",
        hint:"Where does the musical emphasis occur?" } },
    { say:"<b>Offbeat Accents:</b> One common type of syncopation emphasizes the <b>\u{201C}and\u{201D}</b>, or the second half of each beat. Count <b>\u{201C}1-and-2-and-3-and-4-and\u{201D}</b>, placing the emphasis on each <b>\u{201C}and\u{201D}</b>. \u{1F447} <b>In \u{201C}1-and-2-and-3-and-4-and\u{201D}, which syllables represent the offbeats?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",tempo:88,notes:[
        {rest:"8"},{p:"G4",d:"8",artic:"accent"},{rest:"8"},{p:"G4",d:"8",artic:"accent"},
        {rest:"8"},{p:"G4",d:"8",artic:"accent"},{rest:"8"},{p:"G4",d:"8",artic:"accent"},{bar:"final"}],width:460} },
      try:{ type:"mc", choices:["The \u{201C}ands\u{201D} between the numbered beats","Beats 1 and 3","Beat 4 only"], answer:0,
        success:"✓ Correct. The \u{201C}ands\u{201D} occur halfway between the numbered beats. Emphasizing them creates offbeat syncopation.",
        fail:"The numbers represent the main beats. Look for the syllables between them.",
        hint:"Look between the numbered beats." } },
    { say:"<b>Ties and Syncopation:</b> A note may begin on an offbeat and be <b>tied across the following strong beat</b>. Because no new note begins on the strong beat, the accent is heard on the earlier offbeat instead. \u{1F447} <b>Why does this measure sound syncopated?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",tempo:84,notes:[
        {p:"E4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"q"},{p:"G4",d:"8"},{p:"C5",d:"8"},{p:"C5",d:"q"},{bar:"final"}],
        beams:[[0,1],[3,4]],arcs:[{from:1,to:2,type:"tie"},{from:4,to:5,type:"tie"}],width:460} },
      try:{ type:"mc", choices:["A note begins on an offbeat and continues through the following strong beat","Every note begins on a strong beat","The tie makes the note shorter"], answer:0,
        success:"✓ Correct. The notes begin on offbeats and continue through beats 2 and 4, so no new attack occurs on those beats.",
        fail:"Identify where each tied note begins.",
        hint:"The note begins on an \u{201C}and\u{201D} and continues through the following beat." } },
    { say:"<b>Rhythmic Anticipation:</b> A rhythmic anticipation <b>begins shortly before an expected beat</b> and often continues across it. This technique is common in many popular, jazz, and dance-music styles. \u{1F447} <b>A rhythmic anticipation begins…</b>",
      try:{ type:"mc", choices:["shortly before the expected beat","exactly on the expected beat","one full measure after the expected beat"], answer:0,
        success:"✓ Correct. A rhythmic anticipation begins before the expected beat and often continues across it.",
        fail:"An anticipation arrives earlier than expected.",
        hint:"It begins before the expected beat." } },
    { say:"<b>The 3 + 3 + 2 Pattern:</b> In 4/4, eight eighth notes can be grouped <b>3 + 3 + 2</b> and counted:<div style='text-align:center;font-family:monospace;font-weight:800;font-size:16px;letter-spacing:1px;margin:6px 0'>1 2 3 | 4 5 6 | 7 8</div>When the first note of each group is emphasized, the accents fall on eighth notes <b>1, 4, and 7</b> — which correspond to beat 1, the \u{201C}and\u{201D} of beat 2, and beat 4. This grouping creates a syncopated pattern found in many musical traditions and contemporary styles. \u{1F447} <b>When a 3 + 3 + 2 pattern is counted as eight eighth notes, where do the group beginnings occur?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",tempo:92,notes:[
        {p:"C5",d:"8",artic:"accent"},{p:"G4",d:"8"},{p:"G4",d:"8"},
        {p:"C5",d:"8",artic:"accent"},{p:"G4",d:"8"},{p:"G4",d:"8"},
        {p:"C5",d:"8",artic:"accent"},{p:"G4",d:"8"},{bar:"final"}],
        beams:[[0,2],[3,5],[6,7]],width:480} },
      try:{ type:"mc", choices:["On eighth notes 1, 4, and 7","On every eighth note","Only on the final eighth note"], answer:0,
        success:"✓ Correct. Eighth notes 1, 4, and 7 begin the three groups. Emphasizing those notes produces the 3 + 3 + 2 accent pattern.",
        fail:"Identify the first note of each group.",
        hint:"Count the group beginnings: 1–2–3, 4–5–6, 7–8." } },
    { say:"Listen and decide whether the rhythm emphasizes the beats or creates syncopation. \u{1F447}",
      try:{ type:"custom",
        hint:"Compare the melody's attacks with the steady pulse.",
        mount:(container,fb)=>MF_L78_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which example creates syncopation?</b>",
      try:{ type:"mc", choices:["A note that begins on an offbeat and is tied through the following strong beat","A whole note that begins on beat 1","A rest that follows the final beat of a measure"], answer:0,
        success:"✓ Correct. The note attacks on an offbeat and continues through the following strong beat, shifting the expected emphasis.",
        fail:"Which option shifts the expected emphasis away from a strong beat?",
        hint:"Think about the tied-note example in Step 3." } }
  ],
  examples:[
    { caption:"On-the-beat, then syncopated: the same melody twice — first plain, then with tied off-beat attacks. Listen for the accents sliding between the beats.",
      staff:{clef:"treble",time:"4/4",tempo:88,notes:[
        {p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{bar:"single"},
        {p:"C4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"q"},{p:"G4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"q"},{bar:"final"}],
        beams:[[5,6],[8,9]],arcs:[{from:6,to:7,type:"tie"},{from:9,to:10,type:"tie"}],width:640},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"The 3+3+2 pattern over a steady bass: three, three, then two — the tempo stays the same, but the changing accents create a different rhythmic feel.",
      staff:{clef:"treble",time:"4/4",tempo:96,notes:[
        {p:"E4",d:"8",artic:"accent"},{p:"E4",d:"8"},{p:"E4",d:"8"},
        {p:"G4",d:"8",artic:"accent"},{p:"G4",d:"8"},{p:"G4",d:"8"},
        {p:"C5",d:"8",artic:"accent"},{p:"C5",d:"8"},{bar:"single"},
        {p:"C4",d:"h"},{p:"C4",d:"h"},{bar:"final"}],
        beams:[[0,2],[3,5],[6,7]],width:640},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Syncopation Sprint (45s)",
      intro:"Identify offbeats, tied syncopations, and rhythmic anticipations before time runs out.",
      miaIntro:"Listen for emphasis on the \u{201C}and.\u{201D}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Syncopation","an accent shifted off the strong beat"],
        ["The off-beat","the '&' between beats"],
        ["Tie syncopation","attack early, hold through the beat"],
        ["Rhythmic anticipation","arriving just before the beat"],
        ["3+3+2","a built-in syncopated grouping"],
        ["The pulse during syncopation","stays steady"],
        ["Off-beat accent count","1 & 2 & — stress the &"],
        ["Syncopation's home styles","jazz, pop, Latin, rock"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Syncopation challenge completed!":null },
    { type:"symbol-hunt", title:"Game 2 · Spot the Syncopation",
      intro:"Select the rhythm that demonstrates the named type of syncopation.",
      miaIntro:"Look for offbeat attacks and ties across strong beats.",
      spec:{rounds:6, pool:[
        {label:"On-the-beat quarters", spec:{clef:"treble",time:"2/4",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"}],width:150}},
        {label:"Tie syncopation", spec:{clef:"treble",time:"2/4",notes:[{p:"G4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"q"}],beams:[[0,1]],arcs:[{from:1,to:2,type:"tie"}],width:170}},
        {label:"Off-beat accents", spec:{clef:"treble",time:"2/4",notes:[{rest:"8"},{p:"G4",d:"8",artic:"accent"},{rest:"8"},{p:"G4",d:"8",artic:"accent"}],width:170}},
        {label:"3+3+2 grouping", spec:{clef:"treble",time:"4/4",notes:[{p:"B4",d:"8",artic:"accent"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8",artic:"accent"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8",artic:"accent"},{p:"B4",d:"8"}],beams:[[0,2],[3,5],[6,7]],width:240}}]},
      result:(score)=>score>=5?"You identified the syncopated rhythms correctly.":null },
    { type:"order-tap", title:"Game 3 · Build the Definition",
      intro:"Arrange the elements of syncopation in the correct order.",
      miaIntro:"Begin with a steady pulse, then shift the emphasis.",
      spec:{sequence:["Keep the pulse steady","Attack on an off-beat","Hold through the strong beat","The accent has shifted — syncopation"],
        title:"How syncopation happens"},
      result:(stars)=>stars>=2?"You completed the definition of syncopation.":null },
    { type:"term-race", title:"Game 4 · Where's the Accent?",
      intro:"Identify where each rhythm places its emphasis before time runs out.",
      miaIntro:"Locate each note attack or accent.",
      spec:{rounds:8, reverse:true, pool:[
        ["Off-beat accent","on the '&'"],
        ["Tie through beat 3","accent arrives before beat 3"],
        ["Rhythmic anticipation","half a beat early"],
        ["3+3+2 accents","on eighths 1, 4 and 7"],
        ["Unsyncopated rhythm","accents on the numbered beats"],
        ["The backbeat (pop drums)","beats 2 and 4"],
        ["Syncopation needs","a steady pulse underneath"],
        ["Strong beats in 4/4","1 and 3"]]},
      result:(score)=>score>=6?"You located each rhythmic emphasis correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on offbeats, tied syncopations, and rhythmic anticipations. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Syncopation","shifted accent"],["Off-beat","the '&'"],["Tie syncopation","hold through the strong beat"],["Anticipation","arrive early"],["3+3+2","syncopated grouping"]], reverse:true}, count:6 },
    { gen:"rhythm-count", params:{}, count:2 },
    { type:"mc", q:"Syncopation shifts musical emphasis toward…", choices:["a weak beat or offbeat","an expected strong beat only","the bar line"], answer:0,
      explain:"Syncopation shifts emphasis away from its expected metrical position." },
    { type:"mc", q:"In \u{201C}1 and 2 and 3 and 4 and,\u{201D} which syllables represent the offbeats?", choices:["the \u{201C}ands\u{201D}","the odd-numbered beats","the even-numbered beats"], answer:0,
      explain:"Between the numbered beats." },
    { type:"mc", q:"A tie can create syncopation when it…", choices:["connects an offbeat note across the following strong beat","connects notes that both begin on downbeats","shortens a note"], answer:0,
      explain:"The note continues through the strong beat without a new attack on that beat." },
    { type:"mc", q:"A rhythmic anticipation begins…", choices:["shortly before the expected beat","exactly on the expected beat","after the expected beat"], answer:0,
      explain:"It begins early and often continues across the expected beat." },
    { type:"truefalse", q:"During syncopation, the underlying pulse can remain steady.", answer:true,
      explain:"Syncopation changes the expected placement of rhythmic emphasis without requiring a tempo change." },
    { type:"truefalse", q:"When the beginning of each group is emphasized, a 3 + 3 + 2 pattern accents eighth notes 1, 4, and 7.", answer:true,
      explain:"The start of each group." },
    { type:"truefalse", q:"Accenting only the expected strong beats 1 and 3 in 4/4 creates syncopation.", answer:false,
      explain:"Beats 1 and 3 are the primary and secondary strong beats in 4/4, so emphasizing them does not shift the expected metrical accents." },
    { gen:"term-match", params:{subject:"term", pool:[["Strong beats (4/4)","1 and 3"],["Backbeat","2 and 4"],["The '&'","the off-beat"],["Steady pulse","syncopation's foundation"]], reverse:true}, count:3 },
    { gen:"note-value", params:{}, count:2 }
  ],
  vocabulary:[
    {term:"Syncopation", def:"An accent shifted to a weak beat or off-beat while the pulse stays steady.",
      staff:{clef:"none",bare:true,notes:[{p:"B4",d:"8"},{p:"B4",d:"q"},{p:"B4",d:"8"}],width:220}},
    {term:"Off-beat", def:"The space between beats — the '&' when counting '1 & 2 &'.",
      staff:{clef:"none",bare:true,notes:[{rest:"8"},{p:"B4",d:"8"},{rest:"8"},{p:"B4",d:"8"}],width:260}},
    {term:"Rhythmic Anticipation", def:"A note that arrives just before the beat it belongs to and holds through it."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Syncopation</b> = accent on a <b>weak beat or off-beat</b>; the pulse never moves.",
    "✔ Three tools: <b>off-beat accents</b>, <b>ties through strong beats</b>, <b>rhythmic anticipation</b>.",
    "✔ <b>Anticipation</b> arrives just <b>before</b> its beat and holds.",
    "✔ <b>3+3+2</b>: accents on eighths 1, 4, 7 — groove by grouping.",
    "✔ Jazz, pop, Latin and rock are built on these shifts.",
    "<div style='margin-top:4px;padding:10px 14px;border-left:4px solid var(--accent,#4f7cff);background:rgba(79,124,255,.08);border-radius:8px'><b>Remember</b><br>\u{2022} The pulse stays steady.<br>\u{2022} The accents move.<br>\u{2022} That shift of accents is called <b>syncopation</b>.</div>"
  ],
  tips:[
    "Practice trick: tap the pulse with your foot and clap only the &'s — when it stops feeling wrong, you own the off-beat.",
    "In pop vocals, almost every phrase-ending note anticipates the barline. Listen for it tonight.",
    "Write four measures of quarter notes, then tie each off-beat eighth into the next beat — instant syncopated version.",
    "Next lesson: meters that are THEMSELVES uneven — 5/4, 7/8 and changing meter."
  ],
  rewards:{ badge:"Off-Beat Operator", icon:"\u{1F941}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Keep the pulse steady and identify where the rhythmic emphasis shifts.",
  quiz:[
    { type:"mc", q:"What is syncopation?", choices:["A shift of musical emphasis away from an expected strong beat","An increase in tempo","A missing measure"], answer:0,
      explain:"The underlying pulse remains steady while the expected rhythmic emphasis shifts.", hint:"Where does the accent land?" },
    { type:"mc", q:"In \u{201C}1 and 2 and 3 and 4 and,\u{201D} which syllables represent the offbeats?", choices:["The \u{201C}ands\u{201D}","Beats 1 and 3","The bar lines"], answer:0,
      explain:"'1 & 2 &' — the &'s sit between beats.", hint:"Between the numbers." },
    { type:"mc", q:"How can a tie create syncopation?", choices:["A note begins on an offbeat and continues through the following strong beat","Two notes both begin on downbeats","The tied note becomes quieter"], answer:0,
      explain:"No new attack occurs on the strong beat because the earlier note continues through it.", hint:"The note attacks early and continues across the beat." },
    { type:"mc", q:"A rhythmic anticipation…", choices:["begins shortly before the expected beat and often continues across it","begins exactly on the expected beat","omits the beat completely"], answer:0,
      explain:"A rhythmic anticipation begins earlier than expected.", hint:"An anticipation arrives before the expected moment." },
    { type:"mc", q:"How many eighth notes are included in a 3 + 3 + 2 grouping?", choices:["8","6","12"], answer:0,
      explain:"3 + 3 + 2 = 8 eighth notes, equal to one measure of 4/4.", hint:"Add the groups." },
    { type:"mc", q:"When the beginning of each group is emphasized, which eighth notes receive the accents in a 3 + 3 + 2 pattern?", choices:["Eighth notes 1, 4, and 7","Every eighth note","Eighth notes 2, 4, and 6"], answer:0,
      explain:"The first note of each group.", hint:"Group starts." },
    { type:"mc", q:"Identify the rhythm.",
      staff:{clef:"treble",time:"2/4",notes:[{p:"G4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"q"}],beams:[[0,1]],arcs:[{from:1,to:2,type:"tie"}],width:200},
      choices:["Tied syncopation — the attack occurs on an offbeat","Quarter notes beginning on each beat","An eighth-note triplet"], answer:0,
      explain:"The note B begins on the \u{201C}and\u{201D} and continues through beat 2.", hint:"Follow the tie." },
    { type:"truefalse", q:"Syncopation requires a change in tempo.", answer:false,
      explain:"Syncopation shifts rhythmic emphasis without requiring a tempo change.", hint:"Pulse vs accent." },
    { type:"truefalse", q:"In a traditional 4/4 metrical hierarchy, emphasizing beats 2 and 4 shifts emphasis away from beats 1 and 3.", answer:true,
      explain:"Beats 1 and 3 carry the expected metrical accents, while a backbeat emphasizes beats 2 and 4.", hint:"Strong beats are 1 and 3." },
    { type:"mc", q:"In which group of musical styles is syncopation especially common?", choices:["Jazz, pop, many Latin American styles, and rock","Unmetered chant only","Basic metronome exercises"], answer:0,
      explain:"Syncopation is an important rhythmic feature in many jazz, popular, Latin American, and rock styles.", hint:"Think of dancing." },
    { type:"mc", q:"You hear melodic attacks consistently occurring between the steady pulse beats. The rhythm is…", choices:["syncopated","entirely on the beat","in free time"], answer:0,
      explain:"Between the beats = off-beat attacks.", hint:"The ear test." },
    { type:"mc", q:"Which statement best describes rhythmic anticipation?", choices:["A note begins earlier than its expected rhythmic placement","A neighboring tone moves away from and returns to the same pitch","The music gradually becomes softer"], answer:0,
      explain:"Rhythmic anticipation concerns the early timing of a note's attack.", hint:"Rhythm = time." }
  ],
  miaPerfect:"Perfect score! You accurately identified offbeats, tied syncopations, and rhythmic anticipations.",
  miaPass:"You passed! Next, you will explore asymmetrical and changing meters.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A attacked on every beat; version B attacked between them — syncopation: a steady pulse with shifted accents.",
      play:()=>{for(let b=0;b<4;b++) MFAudio.tone(48,.22,b*.5,.34); [0,.75,1.25,1.75].forEach(t=>MFAudio.tone(76,.16,t,.3));} },
    learn:{ label:"syncopation",
      explain:"Accent shifted to weak beats/off-beats; made by off-beat accents, ties through strong beats, and rhythmic anticipation; 3+3+2 = built-in syncopation.",
      hint:"Steady pulse + shifted accent.",
      play:()=>{for(let b=0;b<2;b++) MFAudio.tone(48,.22,b*.5,.34); [0,.75].forEach(t=>MFAudio.tone(76,.16,t,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 plays a melody plain, then with tied off-beat attacks; example 2 grooves the 3+3+2 pattern over a steady bass." },
    game:{ label:"the games",
      explain:"Sprint the facts, spot syncopation on cards, build the definition chain, then race the accent landing spots.",
      hint:"Ties + off-beats = shifted accents." },
    quiz:{ label:"this question",
      explain:"Ask one thing: did the accent move off the strong beat while the pulse stayed steady? If yes — syncopation.",
      play:()=>{for(let b=0;b<2;b++) MFAudio.tone(48,.22,b*.5,.34); MFAudio.tone(76,.16,.25,.3); MFAudio.tone(76,.16,.75,.3);} }
  }
};
