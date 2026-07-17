/* Lesson 40 — Sixteenth Rests (AEMT Book 2, Unit 10)
   Built from drafts/UNIT 10 – Lesson 40.md; AEMT p.63 verified by render.
   Core: 16th rest = ¼ beat of silence; TWO hooks vs the 8th rest's one;
   the count never stops — stay silent on the rest's syllable.
   Uses staff.js v7.6 rest:"16".
   NOTE: edit by FULL-FILE REWRITE only. */

/* silent-slot detective: 1 e & a plays with ONE sixteenth replaced by silence —
   name the silent syllable. */
function MF_L40_silent(container,fb){
  const SYL=["1","e","&","a"];
  const ROUNDS=[1,3,0,2];
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l40-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l40-p">▶ Hear the beat</button></div>
    <div class="choices chips l40-ch" style="display:none"><button>1</button><button>e</button><button>&</button><button>a</button></div>
    <div class="l40-show"></div>`;
  const q=container.querySelector(".l40-q"), ch=container.querySelector(".l40-ch"), show=container.querySelector(".l40-show");
  function ask(){ heard=false; ch.style.display="none"; show.innerHTML="";
    q.textContent=`Round ${i+1} of ${ROUNDS.length}: 1 e & a — but ONE sixteenth is a REST. Which syllable is silent?`; }
  container.querySelector(".l40-p").onclick=()=>{
    const silent=ROUNDS[i];
    MFAudio.tone(48,.1,0,.6); /* beat click */
    for(let k=0;k<4;k++) if(k!==silent) MFAudio.tone(72,.15,k*.24,.45);
    heard=true; setTimeout(()=>ch.style.display="",1200);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    if(bi===ROUNDS[i]){
      const notes=[];
      for(let k=0;k<4;k++) notes.push(k===ROUNDS[i]? {rest:"16"} : {p:"B4",d:"16",label:SYL[k]});
      Staff.render(show,{clef:"treble",notes,width:240});
      i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l40-p").style.display="none";
        q.textContent="Silence located every time!";
        fb(true,"✓ Four for four! The count never stopped — you tracked 1-e-&-a straight through the silence. That's exactly how sixteenth rests work."); }
      else { fb(true,`✓ “${SYL[ROUNDS[i-1]]}” was silent — and there's its rest on the staff. Next…`); setTimeout(ask,1400); } }
    else { MFAudio.tone(40,.25); fb(false,"Keep counting through the beat — which slot had no sound?"); }
  });
  ask();
}

/* hook spotter: one hook or two? (8th rest vs 16th rest at speed) */
function MF_L40_hooks(container,fb){
  const ROUNDS=["16","8","16","8","16","8"].sort(()=>Math.random()-.5);
  let i=0;
  container.innerHTML=`<div class="big-q l40-hq" style="text-align:center"></div>
    <div class="l40-hstaff"></div>
    <div class="choices l40-hch"><button>Eighth rest — 1 hook (½ beat)</button><button>Sixteenth rest — 2 hooks (¼ beat)</button></div>`;
  const q=container.querySelector(".l40-hq"), holder=container.querySelector(".l40-hstaff"), ch=container.querySelector(".l40-hch");
  function ask(){
    q.textContent=`Rest ${i+1} of ${ROUNDS.length}: count the hooks!`;
    Staff.render(holder,{clef:"treble",notes:[{rest:ROUNDS[i]}],width:180});
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const is16=ROUNDS[i]==="16";
    if((bi===1)===is16){ i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="Hook counting: automatic!";
        fb(true,`✓ All ${ROUNDS.length}! One hook = eighth rest (½ beat); two hooks = sixteenth rest (¼ beat).`); }
      else { fb(true,`✓ ${is16?"Two hooks — sixteenth":"One hook — eighth"} rest! Next…`); setTimeout(ask,700); } }
    else { MFAudio.tone(40,.2); fb(false,"Zoom in on the hooks at the top — one, or two?"); }
  });
  ask();
}

LESSON_CONTENT[40]={
  welcome:"The fastest silence in your music yet: a quarter of a beat of pure quiet. \u{1F92B}",
  hook:{
    say:"Two grooves. In one of them, tiny SLICES of silence are cut out of the sound. <b>Which groove has the little holes?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Groove A</button>
          <button class="play hk-b">▶ Groove B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Groove B — tiny holes of silence</button><button>Groove A — tiny holes of silence</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ for(let k=0;k<8;k++) MFAudio.tone(72,.16,k*.22,.4); hA=true; if(hB) setTimeout(()=>ch.style.display="",2000); };
        container.querySelector(".hk-b").onclick=()=>{ [0,2,3,4,6,7].forEach(k=>MFAudio.tone(72,.16,k*.22,.4)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2000); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Groove B skipped two sixteenth-slots — quarter-beat holes punched right into the line. Those holes are SIXTEENTH RESTS, and today you'll learn to read, write, and count them.");
          else fb(false,"Play both once more — which one has little gaps in the stream?");
        });
      } }
  },
  objectives:[
    "Identify the sixteenth-rest symbol (two hooks)",
    "State its value: ¼ beat of silence",
    "Distinguish eighth rests from sixteenth rests",
    "Count through rests with 1-e-&-a",
    "Complete measures using sixteenth rests",
    "Perform rhythms with quarter-beat silences"
  ],
  steps:[
    { say:"Every note has a matching rest. You know the eighth rest — the little 'seven' with ONE hook. Add a SECOND hook and it becomes a <b>SIXTEENTH REST</b>: <b>¼ beat of silence</b>. \u{1F447} <b>What visually separates a sixteenth rest from an eighth rest?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {rest:"8",label:"eighth — 1 hook",x:180},{rest:"16",label:"sixteenth — 2 hooks",x:380}],width:520} },
      try:{ type:"mc", choices:["A second hook","A longer slash","It hangs from the top line"], answer:0,
        success:"✓ Hooks count like flags: one = eighth, two = sixteenth. Same doubling logic as the notes!",
        fail:"Compare the tops of the two symbols.",
        hint:"Count the little curls." } },
    { say:"The math mirrors the notes exactly: <b>2 sixteenth rests = 1 eighth rest</b> · <b>4 sixteenth rests = 1 quarter rest</b>. In 2/4, 3/4 and 4/4, a sixteenth rest = <b>one quarter of a count</b>. \u{1F447} <b>How many sixteenth rests equal one QUARTER rest?</b>",
      try:{ type:"mc", choices:["4","2","8"], answer:0,
        success:"✓ Four quarter-beat silences = one full beat of silence.",
        fail:"Same arithmetic as the notes: ¼ × ? = 1.",
        hint:"A beat has four sixteenth-slots." } },
    { say:"Speed drill — hooks at a glance. \u{1F447} <b>Eighth rest or sixteenth rest? Call each one:</b>",
      try:{ type:"custom",
        hint:"One hook = eighth (½ beat); two hooks = sixteenth (¼ beat).",
        mount:(container,fb)=>MF_L40_hooks(container,fb) } },
    { say:"THE golden rule of rests: <b>the count never stops</b>. When a sixteenth rest lands on a syllable, keep counting '1 e & a' — just stay silent on that slot. Silence is performed, not skipped! \u{1F447} <b>A sixteenth rest falls on 'e'. What do you do?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"16",label:"1"},{rest:"16",label:"(e)"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},
        {p:"B4",d:"8",label:"2"},{p:"B4",d:"8",label:"&"},{bar:"final"}],
        beams:[[4,5]],width:440} },
      try:{ type:"mc", choices:["Keep counting 'e' silently and play again on '&'","Stop counting until the next note","Play 'e' more quietly"], answer:0,
        success:"✓ Count through the hole: 1 (e) & a. The beat machine in your head never pauses.",
        fail:"If the counting stops, the '&' and 'a' will drift…",
        hint:"Silent ≠ uncounted." } },
    { say:"Ear practice — find the hole in the beat. \u{1F447} <b>One sixteenth of each beat is silent. Name the silent syllable:</b>",
      try:{ type:"custom",
        hint:"Whisper 1-e-&-a with the playback; the missing 'tick' is your answer.",
        mount:(container,fb)=>MF_L40_silent(container,fb) } },
    { say:"Writers' corner: rests fill the parts of a beat that notes leave empty. A beat containing an eighth note on '1 &' needs its 'e a' slots accounted for — with sixteenth rests if the silence is quarter-beat sized. \u{1F447} <b>A beat has notes on '1' (sixteenth) and '&' (eighth). Which slots need rests?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"16",label:"1"},{rest:"16",label:"(e)"},{p:"B4",d:"8",label:"&"},
        {p:"B4",d:"16",label:"2"},{rest:"16",label:"(e)"},{p:"B4",d:"16",label:"&"},{rest:"16",label:"(a)"},{bar:"final"}],width:480} },
      try:{ type:"mc", choices:["'e' — one sixteenth rest","'e' and 'a' — two rests","none — notes cover everything"], answer:0,
        success:"✓ The sixteenth on '1' leaves 'e' empty (one sixteenth rest); the eighth on '&' covers both '&' and 'a'. Every slot accounted for!",
        fail:"Map it out: 1(note) e(?) &(eighth note covers & AND a).",
        hint:"The eighth note is TWO slots long." } }
  ],
  examples:[
    { caption:"Rests of every size, notes in between — count 1 e & a through each beat and stay silent exactly where the symbols say.",
      staff:{clef:"treble",tempo:60,time:"4/4",notes:[
        {p:"C5",d:"16",label:"1"},{rest:"16",label:"(e)"},{p:"C5",d:"16",label:"&"},{rest:"16",label:"(a)"},
        {p:"D5",d:"8",label:"2"},{p:"D5",d:"8",label:"&"},
        {rest:"16",label:"(3)"},{p:"B4",d:"16",label:"e"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},
        {p:"C5",d:"q",label:"4"},{bar:"final"}],
        beams:[[4,5],[7,9,2]],width:660} },
    { caption:"The rest family: whole (4), half (2), quarter (1), eighth (½), sixteenth (¼) — each half the silence of the one before.",
      staff:{clef:"treble",notes:[
        {rest:"w",label:"4"},{rest:"h",label:"2"},{rest:"q",label:"1"},{rest:"8",label:"½"},{rest:"16",label:"¼"}],width:480} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Rest Race (45s)",
      intro:"Whole to sixteenth rest — name each silence before it slips by!",
      miaIntro:"Silence has shapes — learn them all! \u{1F92B}",
      spec:{seconds:45, values:["w","h","q","8","16"], kind:"rest", ask:"name"},
      result:(score)=>score>=9?score+" rests named — the silence librarian!":null },
    { type:"rhythm-tap", title:"Game 2 · Holey Rhythms Tap Lab",
      intro:"Tap ONLY where the notes are — mind the sixteenth-rest holes!",
      miaIntro:"Don't tap the holes! \u{1F573}",
      spec:{tempo:60, rounds:3, patterns:[
        ["16","r16","16","16","q"],
        ["8","16","16","r16","16","8"],
        ["q","r16","16","16","16"]]},
      result:(score)=>score!==null?"You performed the silences perfectly!":null },
    { type:"measure-build", title:"Game 3 · Fill the Silence",
      intro:"Complete one beat exactly — mixing sixteenth notes AND rests!",
      miaIntro:"Sound + silence = one whole beat! \u{1F9E9}",
      spec:{beats:1, unique:false, buttons:[
        {t:"16",label:"Sixteenth Note",beats:0.25,item:{p:"B4",d:"16"}},
        {t:"r16",label:"Sixteenth Rest",beats:0.25,item:{rest:"16"}},
        {t:"8",label:"Eighth Note",beats:0.5,item:{p:"B4",d:"8"}},
        {t:"r8",label:"Eighth Rest",beats:0.5,item:{rest:"8"}}]},
      result:(score)=>score!==null?"Beat balanced to the quarter-slot!":null },
    { type:"gen-race", title:"Game 4 · Rest-Spotter Sprint (10 rounds)",
      intro:"Rests flash by — name each one from its shape!",
      miaIntro:"One hook or two? Eyes sharp! \u{1F50D}",
      spec:{gen:"note-value", params:{values:["q","8","16","h","w"],kind:"rest",ask:"name"}, rounds:10},
      result:(score)=>score>=8?"No silence went unnamed!":null }
  ],
  practiceIntro:"20 practice questions — hooks, values, counting through silence. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["8","16","q"],kind:"rest",ask:"name"}, count:4 },
    { gen:"note-value", params:{values:["8","16","q","h"],kind:"rest",ask:"beats"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Sixteenth Rest","¼ beat of silence — two hooks"],["Eighth Rest","½ beat of silence — one hook"],["Rest","a symbol for measured silence"],["Silent counting","the count continues through every rest"]], reverse:true}, count:3 },
    { type:"mc", q:"How many sixteenth rests equal one eighth rest?", choices:["2","4","3"], answer:0,
      explain:"¼ + ¼ = ½." },
    { type:"mc", q:"How many sixteenth rests equal one quarter rest?", choices:["4","2","8"], answer:0,
      explain:"Four quarter-beat silences = one beat." },
    { type:"mc", q:"A sixteenth rest in 2/4, 3/4, or 4/4 receives…", choices:["¼ of a count","½ of a count","1 count"], answer:0,
      explain:"Exactly like its note twin." },
    { type:"mc", q:"When a rest appears in the middle of a beat, you should…", choices:["keep counting and stay silent on that slot","pause your counting until the next note","speed up slightly"], answer:0,
      explain:"The count NEVER stops — silence is performed." },
    { type:"truefalse", q:"A sixteenth rest has two hooks.", answer:true,
      explain:"Two hooks = sixteenth; one hook = eighth." },
    { type:"truefalse", q:"A sixteenth rest lasts longer than an eighth rest.", answer:false,
      explain:"¼ beat < ½ beat — more hooks = SHORTER." },
    { type:"mc", q:"The rhythm 'sixteenth note, sixteenth rest, eighth note' has attacks on…", choices:["1 and &","1 and e","1 and a"], answer:0,
      explain:"Note(1), silence(e), eighth covers & + a." },
    { type:"mc", q:"Which symbol marks ¼ beat of silence?", choices:["the two-hooked rest","the one-hooked rest","the squiggle rest"], answer:0,
      explain:"Two hooks = sixteenth rest." }
  ],
  miaQuizIntro:"Count through every hole — silence is part of the music. Sprint!",
  quiz:[
    { type:"mc", q:"A sixteenth rest represents…", choices:["¼ beat of silence","½ beat of silence","1 full beat of silence","¼ beat of sound"], answer:0,
      explain:"The silent twin of the sixteenth note.", hint:"Same value as its note." },
    { type:"mc", q:"A sixteenth rest is drawn with…", choices:["two hooks","one hook","a hollow box","a squiggle"], answer:0,
      explain:"Hooks count like flags — two for sixteenths.", hint:"Double, like the note's flags." },
    { type:"mc", q:"Two sixteenth rests equal…", choices:["one eighth rest","one quarter rest","one whole rest","one eighth note"], answer:0,
      explain:"¼ + ¼ = ½ beat of silence.", hint:"Half a beat total." },
    { type:"truefalse", q:"Four sixteenth rests equal the duration of one quarter rest.", answer:true,
      explain:"4 × ¼ = 1 beat.", hint:"Same math as the notes." },
    { type:"truefalse", q:"When you reach a rest, you should stop counting until the next note.", answer:false,
      explain:"Counting continues — you just don't play.", hint:"The golden rule of rests." },
    { type:"mc", q:"Name this rest.",
      staff:{clef:"treble",notes:[{rest:"16"}],width:160},
      choices:["Sixteenth rest","Eighth rest","Quarter rest"], answer:0,
      explain:"Two hooks on the slash.", hint:"Count the hooks!" },
    { type:"mc", q:"Name this rest.",
      staff:{clef:"treble",notes:[{rest:"8"}],width:160},
      choices:["Eighth rest","Sixteenth rest","Half rest"], answer:0,
      explain:"One hook = eighth rest (½ beat).", hint:"Just one curl this time." },
    { type:"mc", q:"In the count '1 e & a', a rest on '&' means silence on…", choices:["the 3rd sixteenth of the beat","the 1st sixteenth of the beat","the last sixteenth of the beat"], answer:0,
      explain:"1(1st) e(2nd) &(3rd) a(4th).", hint:"Where does & fall in the four?" },
    { type:"mc", q:"Which rest is SHORTEST?", choices:["sixteenth rest","eighth rest","quarter rest","half rest"], answer:0,
      explain:"¼ beat — the shortest silence you've learned.", hint:"Most hooks, least time." },
    { type:"mc", q:"A beat contains: sixteenth note, sixteenth rest, sixteenth note, sixteenth rest. The attacks fall on…", choices:["1 and &","1 and e","e and a"], answer:0,
      explain:"Sound-silence-sound-silence: attacks on slots 1 and 3 (= '1' and '&').", hint:"Every other slot." },
    { type:"mc", q:"Why must you keep counting through rests?", choices:["So the notes after the rest land exactly in time","Because rests are optional","To make the rest louder"], answer:0,
      explain:"The internal beat keeps everything aligned.", hint:"What happens to '&' if you pause the count?" },
    { type:"mc", q:"Adding a second hook to an eighth rest makes it…", choices:["a sixteenth rest","a quarter rest","a shorter eighth rest","a fermata"], answer:0,
      explain:"Exactly like adding a second flag to an eighth note.", hint:"Hooks halve the silence." },
    /* generated */
    { gen:"note-value", params:{values:["8","16","q"],kind:"rest",ask:"name"}, count:3 },
    { gen:"note-value", params:{values:["8","16","q","h"],kind:"rest",ask:"beats"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Sixteenth Rest","¼ beat of silence — two hooks"],["Eighth Rest","½ beat of silence — one hook"],["Silent counting","the count continues through every rest"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Sixteenth Rest", def:"A rest worth one-fourth of a beat in simple meter — drawn with two hooks.",
      staff:{clef:"treble",notes:[{rest:"16"}],width:120}},
    {term:"Eighth Rest", def:"A rest worth one-half of a beat — drawn with one hook.",
      staff:{clef:"treble",notes:[{rest:"8"}],width:120}},
    {term:"Rest", def:"A symbol indicating silence for a specific duration. Every note value has a matching rest."},
    {term:"Silent Beat", def:"A beat (or part of one) that is counted internally without producing sound."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Sixteenth rest = ¼ beat of silence</b> — the silent twin of the sixteenth note.",
    "✔ Spot it by its <b>two hooks</b>; the eighth rest has one.",
    "✔ 2 sixteenth rests = 1 eighth rest · 4 = 1 quarter rest.",
    "✔ <b>The count never stops</b> — whisper '1 e & a' straight through every hole.",
    "✔ Notes + rests must account for EVERY sixteenth-slot of every beat."
  ],
  tips:[
    "Practice trick: replace each rest with a whispered 'ss' before going fully silent — it keeps the slot honest.",
    "Reading fast passages? Circle the rests first. The holes are harder to see than the notes.",
    "More hooks = shorter silence. It feels backwards until it doesn't.",
    "Next lesson: the dot returns — and turns the eighth note into the famous long-short 'dotted rhythm'."
  ],
  rewards:{ badge:"Silence Surgeon", icon:"\u{1F92B}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — every silence in its exact place! \u{1F92B}\u{1F389}",
  miaPass:"Passed! Remember: silence is performed, not skipped.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Groove A was a full stream of sixteenths; Groove B had two sixteenth-slots punched out — quarter-beat holes. Those are sixteenth rests.",
      play:()=>{for(let k=0;k<8;k++)MFAudio.tone(72,.14,k*.2,.4);[0,2,3,4,6,7].forEach(k=>MFAudio.tone(72,.14,1.9+k*.2,.4));} },
    learn:{ label:"sixteenth rests",
      explain:"¼ beat of silence, two hooks. 2 = an eighth rest, 4 = a quarter rest. Count 1-e-&-a through every rest — the pulse never pauses.",
      hint:"Two hooks, quarter beat, keep counting.",
      play:()=>{[0,2,3].forEach(k=>MFAudio.tone(72,.14,k*.22,.45));} },
    example:{ label:"the examples",
      explain:"Example 1 weaves notes and rests through a counted 4/4 measure; example 2 lines up the whole rest family from 4 beats to ¼." },
    game:{ label:"the games",
      explain:"Race the rest names, tap around the holes, build beats from sound AND silence, then sprint the spotter.",
      hint:"In the tap lab, whisper the count — taps only where notes live." },
    quiz:{ label:"this question",
      explain:"Three facts: two hooks; ¼ beat; the count never stops. Every question is one of them in disguise.",
      play:()=>{MFAudio.tone(72,.15,0,.45);MFAudio.tone(72,.15,.44,.45);} }
  }
};
