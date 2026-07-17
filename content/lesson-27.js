/* Lesson 27 — The Sharp Scales: G and D Major (AEMT Book 2, Unit 7)
   Built from drafts/UNIT 7 – Lesson 27.md; AEMT p.44 verified by render.
   QA note honored: sharps exist to PRESERVE the W–W–H–W–W–W–H pattern — not
   arbitrary notes to memorize; staff completion verified at the keyboard.
   NOTE: edit by FULL-FILE REWRITE only. */

/* staff + keyboard side by side — the keyboard makes the half steps and the black key VISIBLE */
function MF_L27_staffKb(el,staffSpec,kbOpts){
  const s=document.createElement("div"); el.appendChild(s); Staff.render(s,staffSpec);
  const k=document.createElement("div"); k.style.marginTop="10px"; el.appendChild(k); Keyboard.create(k,kbOpts);
}

/* click the note that must be raised */
function MF_L27_fixTheScale(container,fb){
  const plain={clef:"treble",notes:[{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",d:"q",label:"F ?"},{p:"G5",d:"q",label:"G"}],width:480,clickNotes:true};
  const fixed={clef:"treble",tempo:110,notes:[{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F#5",d:"q",label:"F♯"},{p:"G5",d:"q",label:"G"}],steps:[{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],width:480};
  let done=false;
  container.innerHTML=`<div class="big-q" style="text-align:center">This G scale is written with all natural notes — ONE of them breaks the pattern. Click the note that must be raised!</div><div class="l27-staff"></div>`;
  const holder=container.querySelector(".l27-staff");
  plain.onNote=(i)=>{
    if(done) return;
    if(i===6){ done=true;
      const api=Staff.render(holder,fixed);
      setTimeout(()=>Staff.play(fixed,api),400);
      fb(true,"✓ F becomes F♯! Now E–F♯ is a whole step and F♯–G a half step — the pattern is restored. (F♯ is used instead of G♭ to keep the notes alphabetical.)"); }
    else fb(false,"Check the distances: degrees 6–7 must be a WHOLE step and 7–8 a HALF step. Which note sits wrong?");
  };
  Staff.render(holder,plain);
}

/* keyboard scale explorer: play G major with the marked F♯ */
function MF_L27_kbScale(container,fb){
  const SEQ=[67,69,71,72,74,76,78,79], NAMES=["G","A","B","C","D","E","F♯","G"];
  let i=0;
  container.innerHTML=`<div class="big-q l27-q" style="text-align:center"></div><div class="l27-kb"></div>`;
  const q=container.querySelector(".l27-q");
  const kb=Keyboard.create(container.querySelector(".l27-kb"),{start:60,octaves:2,labels:true,marks:[SEQ[0]],
    onKey:m=>{
      if(i>=SEQ.length) return;
      if(m===SEQ[i]){ i++;
        if(i>=SEQ.length){ kb.mark([]); q.textContent="G major scale complete!";
          fb(true,"✓ G–A–B–C–D–E–F♯–G — one black key (F♯) keeps the whole pattern true!"); }
        else { kb.mark([SEQ[i]]); q.innerHTML=`✓ ${NAMES[i-1]} — next: <b>${NAMES[i]}</b>${i===6?" (the black key!)":""}`; } }
      else fb(false,`Not that key — the next note is ${NAMES[i]}. ${i===6?"Look for the BLACK key just above F!":"Follow the marked key."}`);
    }});
  q.innerHTML=`Play the G major scale — start on the marked <b>G</b>.`;
}

LESSON_CONTENT[27]={
  welcome:"You know the W-W-H pattern — today we build it starting on G and D. Enter the sharps! \u{266F}",
  hook:{
    say:"Let's build a scale on G using only natural notes… and then with one small change. Listen to BOTH versions. Which one sounds like a true major scale?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const A=[67,69,71,72,74,76,77,79], B=[67,69,71,72,74,76,78,79];
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A (all natural)</button>
          <button class="play hk-b">▶ Version B (one change)</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — it climbs cleanly to the top</button><button>Version A — it sounded fine</button><button>They are the same</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let heardA=false,heardB=false;
        const playSeq=s=>s.forEach((m,i)=>MFAudio.tone(m,.32,i*.3));
        container.querySelector(".hk-a").onclick=()=>{ playSeq(A); heardA=true; if(heardB) setTimeout(()=>ch.style.display="",2600); };
        container.querySelector(".hk-b").onclick=()=>{ playSeq(B); heardB=true; if(heardA) setTimeout(()=>ch.style.display="",2600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Version B! Version A drifts at the top — its 7th note is too low. Raising F to F♯ restores the major-scale pattern. That's today's whole story!");
          else fb(false,"Play both once more and listen to the last three notes of each.");
        });
      } }
  },
  objectives:[
    "Build the G major scale",
    "Build the D major scale",
    "Identify the sharps in each scale",
    "Explain why sharps are necessary",
    "Recognize the relationship between neighboring major scales"
  ],
  steps:[
    { say:"The interval pattern never changes: <b>W–W–H–W–W–W–H</b>. Build it on <b>G</b> and the natural notes fail at one spot — so <b>F must be raised to F♯</b> to create the whole step from E. (An F♯ is used instead of G♭ to stay in <b>alphabetical order</b>.) The G tetrachord (G–A–B–C) is the 2nd tetrachord of the C major scale! \u{1F447} <b>Which note is sharped in the G major scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L27_staffKb(el,
        {clef:"treble",notes:[{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F#5",d:"q",label:"F♯"},{p:"G5",d:"q",label:"G"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"G tetrachord"},{from:4,to:7,label:"D tetrachord"}],width:540},
        {start:60,octaves:2,labels:true,marks:[67,69,71,72,74,76,78,79]}) },
      try:{ type:"mc", choices:["C","D","F","G"], answer:2,
        success:"✓ F → F♯, the one change that keeps the pattern perfect.",
        fail:"Find the note with the sharp sign on the staff above.",
        hint:"Degree 7 of the G scale." } },
    { say:"Now prove it with your own ears and eyes. \u{1F447} <b>Fix the broken G scale — click the note that must be raised:</b>",
      try:{ type:"custom",
        hint:"Degrees 6–7 must be a whole step; 7–8 a half step. The culprit is the 7th note.",
        mount:(container,fb)=>MF_L27_fixTheScale(container,fb) } },
    { say:"Build the same pattern on <b>D</b> and TWO notes must be raised: <b>F♯</b> and <b>C♯</b>. (A C♯ is used instead of D♭ to stay alphabetical.) \u{1F447} <b>Which notes are sharped in the D major scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L27_staffKb(el,
        {clef:"treble",notes:[{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C#5",d:"q",label:"C♯"},{p:"D5",d:"q",label:"D"}],steps:[{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"D tetrachord"},{from:4,to:7,label:"A tetrachord"}],width:540},
        {start:60,octaves:2,labels:true,marks:[62,64,66,67,69,71,73,74]}) },
      try:{ type:"mc", choices:["F♯ and C♯","F♯ and G♯","C♯ and D♯","B♯ and C♯"], answer:0,
        success:"✓ F♯ (from G major) stays, and C♯ joins it.",
        fail:"Look at the two sharp signs on the staff above.",
        hint:"One carried over from G major, one new." } },
    { say:"Here's the overlapping pattern: the <b>2nd tetrachord of C major is the 1st tetrachord of G major</b>; the <b>2nd tetrachord of G major is the 1st tetrachord of D major</b>. Starting with C, the 2nd tetrachord is always the 1st tetrachord of the FOLLOWING sharp scale — this continues through all the sharp scales. \u{1F447} <b>The 2nd tetrachord of the G major scale (D–E–F♯–G) begins which scale?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"}],brackets:[{from:0,to:3,label:"D tetrachord — 2nd of G, 1st of D"}],width:400} },
      try:{ type:"mc", choices:["D major","C major","A major","E major"], answer:0,
        success:"✓ D major — each sharp scale hands its top tetrachord to the next one.",
        fail:"The tetrachord STARTS on D…",
        hint:"A tetrachord's first note is the new keynote." } },
    { say:"To the keyboard! \u{1F447} <b>Play the G major scale — watch for the black key at degree 7:</b>",
      try:{ type:"custom",
        hint:"G A B C D E F♯ G — the F♯ is the black key just above F.",
        mount:(container,fb)=>MF_L27_kbScale(container,fb) } },
    { say:"Find the scale's name. A completed scale appears below — read its accidentals carefully. \u{1F447} <b>Which major scale is this?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C#5",d:"q"},{p:"D5",d:"q"}],width:480} },
      try:{ type:"mc", choices:["G major","D major","C major"], answer:1,
        success:"✓ Two sharps (F♯ and C♯) starting on D — the D major scale.",
        fail:"Count the sharps and check the keynote.",
        hint:"It begins and ends on D." } }
  ],
  examples:[
    { caption:"The G major scale: G and D tetrachords joined by a whole step. F is raised to F♯ to create the whole step from E.",
      staff:{clef:"treble",tempo:100,notes:[{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F#5",d:"q",label:"F♯"},{p:"G5",d:"q",label:"G"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"G tetrachord"},{from:4,to:7,label:"D tetrachord"}],width:540},
      kb:{start:60,octaves:2,labels:true,marks:[67,69,71,72,74,76,78,79]} },
    { caption:"The D major scale: D and A tetrachords. C is raised to C♯ — and F♯ carries over from G major.",
      staff:{clef:"treble",tempo:100,notes:[{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C#5",d:"q",label:"C♯"},{p:"D5",d:"q",label:"D"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"D tetrachord"},{from:4,to:7,label:"A tetrachord"}],width:540},
      kb:{start:60,octaves:1.3333,labels:true,marks:[62,64,66,67,69,71,73,74]} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Sharp Hunt",
      intro:"F♯, C♯, naturals and impostors — click the symbol that's named!",
      miaIntro:"Spot the sharps at a glance! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"F♯", spec:{clef:"treble",notes:[{p:"F#4",d:"q"}],width:160}},
        {label:"C♯", spec:{clef:"treble",notes:[{p:"C#5",d:"q"}],width:160}},
        {label:"F natural", spec:{clef:"treble",notes:[{p:"F4",acc:"n",d:"q"}],width:160}},
        {label:"B♭", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}],width:160}}]},
      result:(score)=>score>=5?"No sharp escapes you!":null },
    { type:"order-tap", title:"Game 2 · Climb the G Major Ladder",
      intro:"Eight notes, keynote first — don't forget the F♯!",
      miaIntro:"Build it from memory! \u{1FA9C}",
      spec:{sequence:["G","A","B","C","D","E","F♯","G"], title:"Tap the notes of the G major scale in order — keynote first!"},
      result:(stars)=>stars>=3?"G major, flawless — F♯ and all!":null },
    { type:"term-race", title:"Game 3 · Sharp-Scale Facts Race",
      intro:"Which scale has which sharps? Match at speed!",
      miaIntro:"Facts at full tempo! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["G Major","One sharp — F♯"],
        ["D Major","Two sharps — F♯ and C♯"],
        ["C Major","No sharps at all"],
        ["Sharp (♯)","Raises a note by one half step"],
        ["Why F♯, not G♭?","To keep the notes in alphabetical order"],
        ["2nd tetrachord of C","The 1st tetrachord of G"]]},
      result:(score)=>score>=7?"Sharp-scale scholar!":null },
    { type:"key-hunt", title:"Game 4 · Find Every Keynote G",
      intro:"The keynote names the scale — find every G on the keyboard!",
      miaIntro:"Keynote hunting season! \u{1F3B9}",
      spec:{letter:"G"},
      result:(score)=>score>=3?"Every G found — keynotes secured!":null }
  ],
  practiceIntro:"20 practice questions — G major, D major, their sharps, and WHY those sharps exist. Answer right and the next appears automatically!",
  practice:[
    { gen:"step-type", params:{}, count:3 },
    { gen:"note-name", params:{clef:"treble"}, count:3 },
    { gen:"term-match", params:{subject:"fact", pool:[["G Major","One sharp — F♯"],["D Major","Two sharps — F♯ and C♯"],["C Major","No sharps at all"],["Sharp (♯)","Raises a note by one half step"]], reverse:true}, count:4 },
    { type:"truefalse", q:"G major contains two sharps.", answer:false,
      explain:"G major has exactly ONE sharp: F♯." },
    { type:"mc", q:"The G major scale contains one sharp: ____.", choices:["F♯","C♯","G♯"], answer:0,
      explain:"F is raised to F♯ to complete the pattern." },
    { type:"mc", q:"The D major scale contains ____ sharps.", choices:["2","1","3"], answer:0,
      explain:"F♯ and C♯." },
    { type:"mc", q:"Complete the G major scale: G A B C D E ____ G", choices:["F♯","F","E♯"], answer:0,
      explain:"The 7th degree must be F♯." },
    { type:"mc", q:"Complete the D major scale: D E ____ G A B ____ D", choices:["F♯ · C♯","F · C","F♯ · C"], answer:0,
      explain:"Both F and C are raised in D major." },
    { type:"mc", q:"Why does G major use F♯ instead of G♭?", choices:["To stay in alphabetical order","Because G♭ is lower","Because sharps are easier"], answer:0,
      explain:"E–F♯–G keeps every letter used once; E–G♭–G would repeat G." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The 2nd tetrachord of C major is the 1st tetrachord of ____ major.", choices:["G","D","A"], answer:0,
      explain:"G–A–B–C tops C major and opens G major." },
    { type:"mc", q:"The 2nd tetrachord of G major is the 1st tetrachord of ____ major.", choices:["D","C","A"], answer:0,
      explain:"D–E–F♯–G tops G major and opens D major." },
    { type:"mc", q:"Write a tetrachord starting on D: D – E – ____ – G", choices:["F♯","F","G♭"], answer:0,
      explain:"D–E (W), E–F♯ (W), F♯–G (H)." },
    { type:"mc", q:"In the G major scale, the half steps fall between B–C and ____.", choices:["F♯–G","E–F♯","D–E"], answer:0,
      explain:"Degrees 3–4 (B–C) and 7–8 (F♯–G) — same spots as every major scale." }
  ],
  miaQuizIntro:"Two scales, three sharps between them — show me you know which goes where!",
  quiz:[
    { type:"mc", q:"Which note is sharped in the G major scale?", choices:["C","D","F","G"], answer:2,
      explain:"F♯ — the one sharp of G major.", hint:"Degree 7." },
    { type:"mc", q:"Which notes are sharped in the D major scale?", choices:["F♯ and G♯","F♯ and C♯","C♯ and D♯","B♯ and C♯"], answer:1,
      explain:"F♯ carries over from G major; C♯ is new.", hint:"One old, one new." },
    { type:"truefalse", q:"Every major scale follows the same interval pattern.", answer:true,
      explain:"W–W–H–W–W–W–H — sharps exist to preserve it.", hint:"The pattern never changes." },
    { type:"truefalse", q:"G major contains two sharps.", answer:false,
      explain:"Just one: F♯.", hint:"Count the sharps in the G scale." },
    { type:"mc", q:"Which matching is correct?",
      choices:["G major → F♯ · D major → F♯, C♯ · C major → no sharps",
               "G major → C♯ · D major → G♯ · C major → F♯",
               "G major → F♯, C♯ · D major → F♯ · C major → B♭"], answer:0,
      explain:"1 sharp for G, 2 for D, none for C.", hint:"The sharps accumulate one scale at a time." },
    { type:"mc", q:"The G major scale contains one sharp: ____.", choices:["F♯","C♯","G♯"], answer:0,
      explain:"F raised to F♯ completes the whole step from E.", hint:"It fixes degree 7." },
    { type:"mc", q:"The D major scale contains ____ sharps.", choices:["2","1","3"], answer:0,
      explain:"F♯ and C♯.", hint:"Count them in D–E–F♯–G–A–B–C♯–D." },
    { type:"mc", q:"Complete the G major scale: G A B C D E ____ G", choices:["F♯","F","E"], answer:0,
      explain:"The whole step above E is F♯.", hint:"Natural F is too low." },
    { type:"mc", q:"Complete the D major scale: D E ____ G A B ____ D", choices:["F♯ · C♯","F · C","G♭ · D♭"], answer:0,
      explain:"Two sharps, both keeping the pattern (and the alphabet) intact.", hint:"Alphabetical order matters." },
    { type:"mc", q:"Why does G major use F♯?",
      choices:["To make the scale easier to read","To preserve the major-scale interval pattern","To match the treble clef","Because every major scale contains F♯"], answer:1,
      explain:"E to F is only a half step — raising F to F♯ makes the required whole step.", hint:"Think in intervals, not note names." },
    { type:"mc", q:"Which major scale is shown?",
      staff:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q"},{p:"F#5",d:"q"},{p:"G5",d:"q"}],width:420},
      choices:["G major","D major","C major"], answer:0,
      explain:"One sharp (F♯), keynote G.", hint:"Check the first note and count the sharps." },
    { type:"mc", q:"Which major scale is shown?",
      staff:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C#5",d:"q"},{p:"D5",d:"q"}],width:420},
      choices:["D major","G major","A major"], answer:0,
      explain:"Two sharps, keynote D.", hint:"It begins and ends on the same letter." },
    { type:"mc", q:"The 2nd tetrachord of the C major scale is the 1st tetrachord of…", choices:["G major","D major","F major"], answer:0,
      explain:"G–A–B–C links C major to G major.", hint:"The overlapping-tetrachord chain." },
    { type:"mc", q:"A sharp (♯) ____ a note by one half step.", choices:["raises","lowers","repeats"], answer:0,
      explain:"Sharp = one half step higher.", hint:"Which direction did F move?" },
    /* generated */
    { gen:"step-type", params:{}, count:2 },
    { gen:"term-match", params:{subject:"fact", pool:[["G Major","One sharp — F♯"],["D Major","Two sharps — F♯ and C♯"],["C Major","No sharps at all"],["Sharp (♯)","Raises a note by one half step"]], reverse:true}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 }
  ],
  vocabulary:[
    {term:"G Major Scale", def:"G major is a major scale based on G, consisting of the pitches G, A, B, C, D, E, and F♯. Key signature: one sharp (F♯)."},
    {term:"D Major Scale", def:"D major is a major scale based on D, consisting of the pitches D, E, F♯, G, A, B, and C♯. Key signature: two sharps (F♯, C♯)."},
    {term:"Sharp (♯)", def:"Raises a note by one half step.",
      staff:{clef:"treble",notes:[{p:"F#4",d:"q"}],width:120}},
    {term:"Keynote", def:"The note on which a scale begins and ends."}
  ],
  mistakes:[],
  summary:[
    "✔ The pattern never changes: <b>W–W–H–W–W–W–H</b> — accidentals exist to PRESERVE it.",
    "✔ <b>G major = 1 sharp (F♯)</b>: G–A–B–C–D–E–F♯–G.",
    "✔ <b>D major = 2 sharps (F♯, C♯)</b>: D–E–F♯–G–A–B–C♯–D.",
    "✔ F♯ (not G♭) and C♯ (not D♭) keep the notes in <b>alphabetical order</b>.",
    "✔ The <b>2nd tetrachord</b> of each scale is the <b>1st tetrachord</b> of the next sharp scale."
  ],
  tips:[
    "If the intervals are correct, the scale is correct — check the pattern, not your memory.",
    "At a piano, play G to G on white keys only, then again with F♯ — hear the 7th note 'lean' up into the keynote.",
    "The overlap chain C → G → D continues: the next sharp scale starts on A (Lesson 31 territory!).",
    "New sharps always appear on degree 7 of the new sharp scale."
  ],
  rewards:{ badge:"Sharp Scale Builder", icon:"\u{266F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"Perfect! G major and D major hold no secrets for you — the sharps are exactly where you said. \u{266F}\u{1F389}",
  miaPass:"You passed! Remember: F♯ fixes G major, and F♯ + C♯ fix D major. The pattern does the rest.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A used natural F — its top tetrachord broke the W–W–H pattern. Version B raised F to F♯ and the scale snapped into place.",
      play:()=>{[67,69,71,72,74,76,78,79].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    learn:{ label:"the sharp scales",
      explain:"Same pattern, new keynotes: G major needs F♯; D major needs F♯ and C♯. Sharps are chosen (not flats) to keep the letters alphabetical.",
      hint:"New sharp = degree 7 of the new scale.",
      play:()=>{MFAudio.tone(76,.35,0);MFAudio.tone(78,.35,.4);MFAudio.tone(79,.6,.8);} },
    example:{ label:"the examples",
      explain:"Both scales with their tetrachord brackets and W–H carets — hear how the raised notes keep each climb identical to C major's." },
    game:{ label:"the games",
      explain:"Hunt the sharps, climb the G ladder, race the facts, then find every keynote G on the keyboard.",
      hint:"F♯ belongs to both scales — C♯ only to D major." },
    quiz:{ label:"this question",
      explain:"Three facts carry the day: G major = F♯; D major = F♯ + C♯; and every sharp exists to preserve W–W–H–W–W–W–H.",
      play:()=>{MFAudio.tone(74,.3,0);MFAudio.tone(78,.3,.35);MFAudio.tone(79,.5,.7);} }
  }
};
