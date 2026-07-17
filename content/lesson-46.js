/* Lesson 46 — Incomplete Measures (Pick-up Notes) and Syncopation (AEMT Book 2, Unit 11)
   Built from drafts/UNIT 11 – Lesson 46.md; AEMT p.71 verified by render.
   Core: pick-up note(s) = incomplete first measure; the missing beats live in
   the LAST measure. Syncopation = accent on the weak beat (&) instead of strong.
   NOTE: edit by FULL-FILE REWRITE only. */

/* pickup detective: does the melody start ON the downbeat, or sneak in early? */
function MF_L46_pickup(container,fb){
  const ROUNDS=[
    {pickup:true, seq:[[67,.0],[72,.5],[72,1.0],[74,1.5],[72,2.0],[77,2.5],[76,3.0]]},   /* Happy-Birthday-ish */
    {pickup:false, seq:[[72,.0],[72,.5],[79,1.0],[79,1.5],[81,2.0],[81,2.5],[79,3.0]]},  /* Twinkle */
    {pickup:true, seq:[[67,.0],[69,.25],[71,.5],[72,1.0],[74,1.5],[76,2.0]]},
    {pickup:false, seq:[[76,.0],[74,.5],[72,1.0],[74,1.5],[76,2.0],[76,2.5],[76,3.0]]}];
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l46-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l46-p">▶ Hear the opening</button></div>
    <div class="choices l46-ch" style="display:none"><button>\u{1F3C3} Sneaks in EARLY — pick-up start</button><button>\u{1F6A6} Starts right ON the downbeat</button></div>`;
  const q=container.querySelector(".l46-q"), ch=container.querySelector(".l46-ch");
  function ask(){ heard=false; ch.style.display="none";
    q.textContent=`Opening ${i+1} of ${ROUNDS.length}: listen for the drum downbeats — does the tune start ON one, or run in ahead of it?`; }
  container.querySelector(".l46-p").onclick=()=>{
    const c=ROUNDS[i];
    /* drum marks the downbeats at t=0.5,1.5,2.5 for pickup tunes; 0,1,2,3 for on-beat */
    const drums=c.pickup? [0.5,1.5,2.5] : [0,1,2,3];
    drums.forEach(t=>MFAudio.tone(45,.1,t,.6));
    c.seq.forEach(([m,t])=>MFAudio.tone(m,.28,t,.45));
    heard=true; setTimeout(()=>ch.style.display="",3600);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    const c=ROUNDS[i];
    if((bi===0)===c.pickup){ i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l46-p").style.display="none";
        q.textContent="Pick-up radar calibrated!";
        fb(true,"✓ Four for four! Tunes that run in ahead of the first drum-downbeat start with PICK-UP notes — an incomplete first measure."); }
      else { fb(true,`✓ ${c.pickup?"It sneaked in early — a pick-up!":"Square on the downbeat."} Next opening…`); setTimeout(ask,900); } }
    else { MFAudio.tone(40,.25); fb(false,"Compare the first NOTE with the first DRUM — together, or note first?"); }
  });
  ask();
}

/* syncopation lab: straight vs off-beat accents */
function MF_L46_sync(container,fb){
  const ROUNDS=[false,true,true,false].sort(()=>Math.random()-.5);
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l46-sq" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l46-sp">▶ Hear the groove</button></div>
    <div class="choices l46-sch" style="display:none"><button>\u{1FA98} SYNCOPATED — accents on the off-beats (&)</button><button>\u{1F6B6} Straight — accents on the strong beats</button></div>`;
  const q=container.querySelector(".l46-sq"), ch=container.querySelector(".l46-sch");
  function ask(){ heard=false; ch.style.display="none";
    q.textContent=`Groove ${i+1} of ${ROUNDS.length}: where do the LOUD notes land — on the beats, or between them?`; }
  container.querySelector(".l46-sp").onclick=()=>{
    const sync=ROUNDS[i];
    for(let k=0;k<8;k++){
      const isBeat=k%2===0;
      const loud=sync? !isBeat : isBeat;
      MFAudio.tone(72,.16,k*.3,loud?.75:.22);
      if(isBeat) MFAudio.tone(45,.07,k*.3,.35);
    }
    heard=true; setTimeout(()=>ch.style.display="",2700);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    const sync=ROUNDS[i];
    if((bi===0)===sync){ i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l46-sp").style.display="none";
        q.textContent="Groove detector: expert level!";
        fb(true,"✓ Four for four! Accents BETWEEN the beats = SYNCOPATION — the off-balance kick behind ragtime, jazz, funk, and pop."); }
      else { fb(true,`✓ ${sync?"Off-beat accents — syncopated!":"On-beat accents — straight."} Next groove…`); setTimeout(ask,900); } }
    else { MFAudio.tone(40,.25); fb(false,"Tap the beat with your foot — are the loud notes WITH your foot, or against it?"); }
  });
  ask();
}

LESSON_CONTENT[46]={
  welcome:"Two rhythm tricks that make music human: sneaking in early, and kicking off the beat. \u{1FA98}",
  hook:{
    say:"Sing 'Happy Birthday' in your head. Now listen — the drum marks the strong downbeats. <b>Does the song START on a downbeat?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ Hap-py BIRTH-day…</button></div>
          <div class="choices hk-ch" style="display:none"><button>No — 'Hap-py' runs in BEFORE the first downbeat</button><button>Yes — it starts exactly on the downbeat</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          [0.66,1.66,2.66].forEach(t=>MFAudio.tone(45,.1,t,.6));
          [[67,.0,.18],[67,.33,.18],[69,.66,.5],[67,1.16,.5],[72,1.66,.5],[71,2.16,.9]].forEach(([m,t,d])=>MFAudio.tone(m,d,t,.5));
          setTimeout(()=>ch.style.display="",3300);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ 'Hap-py' sneaks in early; the downbeat lands on 'BIRTH'. Those early notes are PICK-UP NOTES — an incomplete measure before measure 1. Today: pick-ups, plus rhythm's other great trick — syncopation.");
          else fb(false,"Sing it and clap the strong beats: HAP-py-BIRTH… where does the clap land?");
        });
      } }
  },
  objectives:[
    "Define pick-up notes (incomplete measures)",
    "Find the missing beats in the final measure",
    "Count a pick-up: (1 2) 3",
    "Define syncopation (accent on the weak beat)",
    "Hear straight vs syncopated grooves",
    "Read accents (>) on off-beat notes"
  ],
  steps:[
    { say:"Some pieces begin with an <b>incomplete measure</b>. The note (or notes) in it are called <b>PICK-UP NOTES</b>. The rule: if the pick-up measure has 1 beat of a 3/4 piece, the <b>missing 2 beats are found in the LAST measure</b> — the final measure completes the pick-up's beats. \u{1F447} <b>A 3/4 piece starts with a 1-beat pick-up. Its final measure holds…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,time:"3/4",notes:[
        {p:"G4",d:"q",label:"3"},{bar:"single"},
        {p:"C5",d:"q",label:"1"},{p:"C5",d:"q",label:"2"},{p:"D5",d:"q",label:"3"},{bar:"single"},
        {p:"E5",d:"h",label:"1-2"},{bar:"final"}],
        brackets:[{from:0,to:0,label:"pick-up"}],width:640} },
      try:{ type:"mc", choices:["2 beats — the ones the pick-up borrowed","3 beats as usual","1 beat only"], answer:0,
        success:"✓ 1 + 2 = 3: the first and last measures share one full measure between them.",
        fail:"The piece 'owes' the beats the pick-up skipped…",
        hint:"First measure 1 beat + last measure ? = 3." } },
    { say:"Counting a pick-up: silently count the missing beats, then speak the pick-up's beat. A 1-beat pick-up in 3/4 counts '<b>(1 2) 3</b>' — parentheses silent, 3 out loud, and the next measure restarts at 1. \u{1F447} <b>A 4/4 piece opens with a single-beat pick-up. You count…?</b>",
      try:{ type:"mc", choices:["(1 2 3) 4","(1) 2 3 4","1 (2 3 4)"], answer:0,
        success:"✓ Hold three silent counts, sing out on 4 — then the downbeat lands on the new measure's 1.",
        fail:"The pick-up is the LAST beat of its imaginary measure.",
        hint:"Which beat does one pick-up note occupy in 4/4?" } },
    { say:"Train the radar. \u{1F447} <b>Which openings sneak in ahead of the downbeat?</b>",
      try:{ type:"custom",
        hint:"Match the first NOTE against the first DRUM thump.",
        mount:(container,fb)=>MF_L46_pickup(container,fb) } },
    { say:"Trick #2: <b>SYNCOPATION</b>. Normally accents sit on the strong beats (1, 2, 3, 4). When the accent lands on the <b>weak beat — the '&'</b> — the rhythm is syncopated. The staff marks it with accent signs (&gt;) on the off-beat notes. \u{1F447} <b>Play the example — where do the accents fall?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:90,time:"2/4",notes:[
        {p:"C5",d:"8",label:"1"},{p:"E5",d:"8",label:"&",artic:"accent"},{p:"C5",d:"8",label:"2"},{p:"E5",d:"8",label:"&",artic:"accent"},{bar:"single"},
        {p:"D5",d:"8",label:"1"},{p:"F5",d:"8",label:"&",artic:"accent"},{p:"D5",d:"q",label:"2"},{bar:"final"}],
        beams:[[0,1],[2,3],[5,6]],width:520} },
      try:{ type:"mc", choices:["On the '&' — between the beats","On beats 1 and 2","On every note equally"], answer:0,
        success:"✓ The > signs sit on the off-beats. That against-the-grain kick is syncopation — the engine of ragtime, jazz, and pop.",
        fail:"Find the > marks — which count-labels do they share?",
        hint:"Look above the '&' notes." } },
    { say:"Ear time — straight or syncopated? \u{1F447} <b>Judge each groove:</b>",
      try:{ type:"custom",
        hint:"Foot on the beat: loud WITH the foot = straight; loud BETWEEN = syncopated.",
        mount:(container,fb)=>MF_L46_sync(container,fb) } },
    { say:"Why do these two tricks matter together? Both play <b>against the expected downbeat</b>: the pick-up arrives before it, syncopation dodges it. Control the downbeat's gravity and rhythm comes alive. \u{1F447} <b>What do pick-ups and syncopation have in common?</b>",
      try:{ type:"mc", choices:["Both play against the expected strong beat","Both make the music slower","Both require 6/8 time"], answer:0,
        success:"✓ Rhythm's rules exist so these two can bend them — arrival early, accent askew. Unit 11 complete!",
        fail:"Where's the strong beat in each trick?",
        hint:"Both tease the downbeat." } }
  ],
  examples:[
    { caption:"A pick-up in action: one borrowed beat before the bar line, and the final measure holds only the two beats that remain. Count (1 2) 3 | 1 2 3 | 1 2.",
      staff:{clef:"treble",tempo:100,time:"3/4",notes:[
        {p:"G4",d:"q",label:"3"},{bar:"single"},
        {p:"C5",d:"q",label:"1"},{p:"E5",d:"q",label:"2"},{p:"G5",d:"q",label:"3"},{bar:"single"},
        {p:"E5",d:"q",label:"1"},{p:"C5",d:"h",label:"2-3"},{bar:"final"}],
        brackets:[{from:0,to:0,label:"pick-up"}],width:660} },
    { caption:"Syncopation: the classic 8th–quarter–quarter–quarter–8th figure. Every quarter starts on an '&' — the accents (>) land BETWEEN the beats. Count '1 & 2 & 3 & 4 &' with a steady foot!",
      staff:{clef:"treble",tempo:88,time:"4/4",notes:[
        {p:"C5",d:"8",label:"1"},{p:"E5",d:"q",label:"& (2)",artic:"accent"},{p:"E5",d:"q",label:"& (3)",artic:"accent"},{p:"E5",d:"q",label:"& (4)",artic:"accent"},{p:"C5",d:"8",label:"&"},{bar:"single"},
        {p:"D5",d:"8",label:"1"},{p:"F5",d:"q",label:"& (2)",artic:"accent"},{p:"F5",d:"q",label:"& (3)",artic:"accent"},{p:"F5",d:"q",label:"& (4)",artic:"accent"},{p:"D5",d:"8",label:"&"},{bar:"final"}],width:680} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Trick-or-Beat Sprint (45s)",
      intro:"Pick-ups and syncopation facts — match them fast!",
      miaIntro:"Sneak in, kick off! \u{1F3C3}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Pick-up note","a note in an incomplete first measure"],
        ["Missing pick-up beats","found in the LAST measure"],
        ["Counting a 3/4 pick-up","(1 2) 3"],
        ["Syncopation","accent on the weak beat (&)"],
        ["Straight rhythm","accents on the strong beats"],
        ["The > sign","marks an accented note"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" tricks decoded — groove scholar!":null },
    { type:"rhythm-tap", title:"Game 2 · Off-Beat Tap Lab",
      intro:"Tap the syncopated patterns — big taps between the beats!",
      miaIntro:"Fight the downbeat's gravity! \u{1FA98}",
      spec:{tempo:80, rounds:3, patterns:[
        ["8","q","8","q"],
        ["8","q","q","8"],
        ["8","8","q","8","8"]]},
      result:(score)=>score!==null?"Your off-beats hit dead center!":null },
    { type:"gen-race", title:"Game 3 · Measure Detective (10 rounds)",
      intro:"Is the measure complete? Pick-up beat-math at speed!",
      miaIntro:"Count every beat! \u{1F9EE}",
      spec:{gen:"measure-complete", params:{beats:4}, rounds:10},
      result:(score)=>score>=8?"Every measure audited!":null },
    { type:"term-race", title:"Game 4 · Unit 11 Grand Vocabulary Race",
      intro:"The whole unit: 6/8, triplets, pick-ups, syncopation — final race!",
      miaIntro:"Unit finale — everything you've got! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Pick-up notes","start a piece in an incomplete measure"],
        ["Syncopation","accents on the weak beats"],
        ["Triplet","3 notes in the time of 2"],
        ["6/8 time","six eighth-beats in two bundles"],
        ["Fast 6/8","counted in two"],
        ["Compound meter","beats grouped in threes"]]},
      result:(score)=>score>=7?"UNIT 11 COMPLETE — rhythm virtuoso!":null }
  ],
  practiceIntro:"20 practice questions — pick-up beats, counting, accents and grooves. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Pick-up note","a note in an incomplete first measure"],["Syncopation","accent on the weak beat"],["The > sign","marks an accent"],["Missing pick-up beats","live in the final measure"]], reverse:true}, count:4 },
    { gen:"measure-complete", params:{beats:4}, count:3 },
    { type:"mc", q:"A piece that begins with an incomplete measure starts with…", choices:["pick-up notes","grace notes","rest measures"], answer:0,
      explain:"Also called an anacrusis." },
    { type:"mc", q:"A 3/4 piece has a 1-beat pick-up. The last measure contains…", choices:["2 beats","3 beats","1 beat"], answer:0,
      explain:"First + last = one complete measure." },
    { type:"mc", q:"A 1-beat pick-up in 3/4 is counted…", choices:["(1 2) 3","1 (2 3)","(3) 1 2"], answer:0,
      explain:"Silent 1-2, sing out on 3." },
    { type:"mc", q:"Syncopation happens when the accent falls on…", choices:["the weak beat (&)","beat 1","the final beat of a piece"], answer:0,
      explain:"Off the strong beats — against the grain." },
    { type:"truefalse", q:"Pick-up notes fill a complete first measure.", answer:false,
      explain:"They form an INCOMPLETE first measure — that's the definition." },
    { type:"truefalse", q:"Syncopated notes are often marked with accent signs (>).", answer:true,
      explain:"The > shows where the off-beat kick lands." },
    { type:"mc", q:"Which word best describes a syncopated groove?", choices:["off-balance / kicking","flat / even","slowing down"], answer:0,
      explain:"The accent fights the expected downbeat." },
    { type:"mc", q:"'Happy Birthday' begins with…", choices:["a two-note pick-up","a downbeat chord","a whole rest"], answer:0,
      explain:"'Hap-py' leads into the downbeat 'BIRTH'." },
    { type:"mc", q:"Another name for a pick-up is…", choices:["anacrusis","cadenza","fermata"], answer:0,
      explain:"The formal term for up-beat openings." }
  ],
  miaQuizIntro:"Sneak in early, land off the beat — the Unit 11 finale quiz!",
  quiz:[
    { type:"mc", q:"Pick-up notes are…", choices:["notes in an incomplete measure at the start of a piece","the loudest notes of a piece","notes added after the final bar line","ornamental fast notes"], answer:0,
      explain:"An incomplete opening measure.", hint:"They 'pick up' into measure 1." },
    { type:"mc", q:"If the pick-up measure of a 3/4 piece has 1 beat, the missing 2 beats appear…", choices:["in the last measure","in measure 2","nowhere — they're lost"], answer:0,
      explain:"The final measure completes the pick-up's beats.", hint:"Which measure completes the pick-up's beats?" },
    { type:"mc", q:"A 1-beat pick-up in 4/4 is counted…", choices:["(1 2 3) 4","(1) 2 3 4","4 (3 2 1)"], answer:0,
      explain:"Silent 1-2-3, sing on 4.", hint:"The pick-up takes the LAST beat." },
    { type:"truefalse", q:"After a pick-up, the next full measure begins again on count 1.", answer:true,
      explain:"The downbeat resets the count.", hint:"BIRTH-day lands on 1." },
    { type:"mc", q:"Syncopation is when the accent falls on…", choices:["the weak beat (&) rather than the strong beat","beat 1 of every measure","the longest note"], answer:0,
      explain:"The off-beat kick.", hint:"Against your tapping foot." },
    { type:"truefalse", q:"Accents on beats 1 and 3 of 4/4 create syncopation.", answer:false,
      explain:"Those ARE the strong beats — that's straight rhythm.", hint:"Syncopation dodges the strong beats." },
    { type:"mc", q:"Which style is FAMOUS for syncopation?", choices:["ragtime and jazz","Gregorian chant","a metronome click"], answer:0,
      explain:"Off-beat accents define those grooves.", hint:"Think Scott Joplin." },
    { type:"mc", q:"Count this opening.",
      staff:{clef:"treble",time:"3/4",notes:[{p:"G4",d:"q",label:"?"},{bar:"single"},{p:"C5",d:"q"},{p:"E5",d:"q"},{p:"G5",d:"q"},{bar:"final"}],width:400},
      choices:["(1 2) 3 — a pick-up","1 2 3 from the start","3 2 1"], answer:0,
      explain:"One lonely beat before the bar = pick-up on count 3.", hint:"The first measure is short." },
    { type:"mc", q:"The accent sign > placed on an '&' note signals…", choices:["syncopation","a pick-up","a triplet"], answer:0,
      explain:"Weak-beat emphasis = syncopation.", hint:"Which trick kicks off-beat?" },
    { type:"mc", q:"What do pick-ups and syncopation share?", choices:["both play against the expected strong beat","both need sharps","both only work in 6/8"], answer:0,
      explain:"Early arrival / dodged accent — same gravity game.", hint:"The downbeat is the target." },
    { type:"mc", q:"Another word for a pick-up note is…", choices:["anacrusis","alla breve","arpeggio"], answer:0,
      explain:"From Greek — the 'up-push' before the downbeat.", hint:"An-a-…" },
    { type:"mc", q:"A syncopated 2/4 pattern 8th-QUARTER-8th places the quarter…", choices:["across the middle of the measure — on the &","on beat 1","on beat 2 exactly"], answer:0,
      explain:"The long note straddles the off-beat: classic syncopation.", hint:"Where does the long note start?" },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Pick-up notes","an incomplete first measure"],["Anacrusis","another name for a pick-up"],["Syncopation","accent on the weak beat (&)"],["The > sign","marks an accent"]], reverse:true}, count:4 },
    { gen:"measure-complete", params:{beats:4}, count:2 }
  ],
  vocabulary:[
    {term:"Pick-up Note(s)", def:"The note or notes of an incomplete measure at the beginning of a piece. The missing beats are found in the last measure. Also called an anacrusis."},
    {term:"Syncopation", def:"When the accent in a passage falls on the weak beat (&) rather than the strong beat."},
    {term:"Accent (>)", def:"A sign directing one note to be played louder — the tool that makes syncopation visible."},
    {term:"Anacrusis", def:"The formal name for pick-up notes — the up-push before the first downbeat."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Pick-up notes</b> = an incomplete FIRST measure; the missing beats hide in the <b>last</b> measure.",
    "✔ Count pick-ups with silent parentheses: <b>(1 2) 3</b>.",
    "✔ <b>Syncopation</b> = accent on the <b>weak beat (&)</b> — marked with > signs.",
    "✔ Straight = accents with the beat; syncopated = accents between the beats.",
    "✔ Both tricks play against the downbeat — that tension is what makes rhythm groove."
  ],
  tips:[
    "Famous pick-up openings: Happy Birthday, The Star-Spangled Banner, Auld Lang Syne — sing any of them and feel the run-in.",
    "To perform syncopation, keep your foot IRON-steady on the beat and let your hands fight it.",
    "Writers: check your beat-math! Pick-up beats + final-measure beats must total one full measure.",
    "UNIT 11 COMPLETE! Next: Unit 12 — triads and chords, where notes finally stack into harmony."
  ],
  rewards:{ badge:"Groove Bender", icon:"\u{1FA98}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — early, off-beat, and utterly in control! \u{1FA98}\u{1F389}",
  miaPass:"Passed! Keep the foot steady and let the accents dance around it.",
  mia:{
    hook:{ label:"the welcome",
      explain:"'Hap-py' ran in before the first drum thump — pick-up notes. The downbeat landed on 'BIRTH'.",
      play:()=>{[0.66,1.66].forEach(t=>MFAudio.tone(45,.1,t,.6));[[67,0,.18],[67,.33,.18],[69,.66,.5],[67,1.16,.5],[72,1.66,.5]].forEach(([m,t,d])=>MFAudio.tone(m,d,t,.5));} },
    learn:{ label:"pick-ups & syncopation",
      explain:"Pick-ups: incomplete first measure, missing beats in the last, counted (1 2) 3. Syncopation: accents on the & — off the strong beats, marked with >.",
      hint:"Both tease the downbeat.",
      play:()=>{for(let k=0;k<4;k++)MFAudio.tone(72,.15,k*.3,k%2?.7:.25);} },
    example:{ label:"the examples",
      explain:"Example 1 pairs a pick-up with its short final measure; example 2 kicks its accents onto the &s." },
    game:{ label:"the games",
      explain:"Sprint the tricks, tap the off-beats, audit measures, then run the Unit 11 grand vocabulary race.",
      hint:"Foot on the beat, always." },
    quiz:{ label:"this question",
      explain:"Two definitions cover it: pick-up = incomplete first measure (the final measure completes the missing beats); syncopation = accent on the weak beat.",
      play:()=>{MFAudio.tone(67,.2,0,.4);MFAudio.tone(72,.4,.33,.6);} }
  }
};
