/* Lesson 28 — The Flat Scales: F and B♭ Major (AEMT Book 2, Unit 7)
   Built from drafts/UNIT 7 – Lesson 28.md; AEMT p.45 verified by render.
   QA note honored: B♭ and E♭ exist to PRESERVE the W–W–H–W–W–W–H pattern;
   staff completion verified at the keyboard.
   NOTE: edit by FULL-FILE REWRITE only. */

/* staff + keyboard side by side — the keyboard makes the half steps and the black key VISIBLE */
function MF_L28_staffKb(el,staffSpec,kbOpts){
  const s=document.createElement("div"); el.appendChild(s); Staff.render(s,staffSpec);
  const k=document.createElement("div"); k.style.marginTop="10px"; el.appendChild(k); Keyboard.create(k,kbOpts);
}

/* click the note that must be lowered */
function MF_L28_fixTheScale(container,fb){
  const plain={clef:"treble",notes:[{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B ?"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",d:"q",label:"F"}],width:480,clickNotes:true};
  const fixed={clef:"treble",tempo:110,notes:[{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"Bb4",d:"q",label:"B♭"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",d:"q",label:"F"}],steps:[{from:2,to:3,label:"H"},{from:3,to:4,label:"W"}],width:480};
  let done=false;
  container.innerHTML=`<div class="big-q" style="text-align:center">This F scale is written with all natural notes — ONE of them breaks the pattern. Click the note that must be lowered!</div><div class="l28-staff"></div>`;
  const holder=container.querySelector(".l28-staff");
  plain.onNote=(i)=>{
    if(done) return;
    if(i===3){ done=true;
      const api=Staff.render(holder,fixed);
      setTimeout(()=>Staff.play(fixed,api),400);
      fb(true,"✓ B becomes B♭! Now A–B♭ is a half step and B♭–C a whole step — the pattern is restored. (B♭ is used instead of A♯ to keep the notes alphabetical.)"); }
    else fb(false,"Check the distances: degrees 3–4 must be a HALF step. Which note sits too high?");
  };
  Staff.render(holder,plain);
}

/* keyboard scale explorer: play F major with the marked B♭ */
function MF_L28_kbScale(container,fb){
  const SEQ=[65,67,69,70,72,74,76,77], NAMES=["F","G","A","B♭","C","D","E","F"];
  let i=0;
  container.innerHTML=`<div class="big-q l28-q" style="text-align:center"></div><div class="l28-kb"></div>`;
  const q=container.querySelector(".l28-q");
  const kb=Keyboard.create(container.querySelector(".l28-kb"),{start:60,octaves:2,labels:true,marks:[SEQ[0]],
    onKey:m=>{
      if(i>=SEQ.length) return;
      if(m===SEQ[i]){ i++;
        if(i>=SEQ.length){ kb.mark([]); q.textContent="F major scale complete!";
          fb(true,"✓ F–G–A–B♭–C–D–E–F — one black key (B♭) keeps the whole pattern true!"); }
        else { kb.mark([SEQ[i]]); q.innerHTML=`✓ ${NAMES[i-1]} — next: <b>${NAMES[i]}</b>${i===3?" (the black key!)":""}`; } }
      else fb(false,`Not that key — the next note is ${NAMES[i]}. ${i===3?"Look for the BLACK key just below B!":"Follow the marked key."}`);
    }});
  q.innerHTML=`Play the F major scale — start on the marked <b>F</b>.`;
}

LESSON_CONTENT[28]={
  welcome:"Sharps fixed G and D — today FLATS do the very same job for F and B♭. \u{266D}",
  hook:{
    say:"Let's build a scale on F with only natural notes… then with one small change. Listen to BOTH versions. Which one sounds like a true major scale?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const A=[65,67,69,71,72,74,76,77], B=[65,67,69,70,72,74,76,77];
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A (all natural)</button>
          <button class="play hk-b">▶ Version B (one change)</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — the early notes settle perfectly</button><button>Version A — it sounded fine</button><button>They are the same</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let heardA=false,heardB=false;
        const playSeq=s=>s.forEach((m,i)=>MFAudio.tone(m,.32,i*.3));
        container.querySelector(".hk-a").onclick=()=>{ playSeq(A); heardA=true; if(heardB) setTimeout(()=>ch.style.display="",2600); };
        container.querySelector(".hk-b").onclick=()=>{ playSeq(B); heardB=true; if(heardA) setTimeout(()=>ch.style.display="",2600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Version B! Version A's 4th note floated too HIGH. Lowering B to B♭ restores the major-scale pattern — flats repair scales exactly the way sharps do, just downward!");
          else fb(false,"Play both again and listen to the 4th note of each.");
        });
      } }
  },
  objectives:[
    "Build the F major scale",
    "Build the B♭ major scale",
    "Identify the flats in each scale",
    "Explain why flats are necessary",
    "Recognize the relationship between neighboring flat keys"
  ],
  steps:[
    { say:"Same pattern, new keynote: build <b>W–W–H–W–W–W–H</b> on <b>F</b> and the natural notes fail at degree 4 — so <b>B must be lowered to B♭</b> to create the half step from A. (A B♭ is used instead of A♯ to stay in <b>alphabetical order</b>.) Notice the upper tetrachord, C–D–E–F, is the 1st tetrachord of C major! \u{1F447} <b>Which note is flatted in the F major scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L28_staffKb(el,
        {clef:"treble",notes:[{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"Bb4",d:"q",label:"B♭"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",d:"q",label:"F"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"F tetrachord"},{from:4,to:7,label:"C tetrachord"}],width:540},
        {start:60,octaves:2,labels:true,marks:[65,67,69,70,72,74,76,77]}) },
      try:{ type:"mc", choices:["A","B","C","D"], answer:1,
        success:"✓ B → B♭, the one change that keeps the pattern perfect.",
        fail:"Find the note with the flat sign on the staff above.",
        hint:"Degree 4 of the F scale." } },
    { say:"Prove it with your ears. \u{1F447} <b>Fix the broken F scale — click the note that must be lowered:</b>",
      try:{ type:"custom",
        hint:"Degrees 3–4 must be a half step. The culprit is the 4th note.",
        mount:(container,fb)=>MF_L28_fixTheScale(container,fb) } },
    { say:"Build the pattern on <b>B♭</b> and TWO notes must be lowered: <b>B♭</b> itself and <b>E♭</b>. (An E♭ is used instead of D♯ to stay alphabetical.) \u{1F447} <b>Which notes are flatted in the B♭ major scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L28_staffKb(el,
        {clef:"treble",notes:[{p:"Bb3",d:"q",label:"B♭"},{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"Eb4",d:"q",label:"E♭"},{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"Bb4",d:"q",label:"B♭"}],steps:[{from:2,to:3,label:"H"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"B♭ tetrachord"},{from:4,to:7,label:"F tetrachord"}],width:540},
        {start:57,octaves:2,labels:true,marks:[58,60,62,63,65,67,69,70]}) },
      try:{ type:"mc", choices:["B♭ and E♭","B♭ and C♭","E♭ and A♭","A♭ and D♭"], answer:0,
        success:"✓ B♭ (from F major) stays, and E♭ joins it.",
        fail:"Look at the two flat signs on the staff above.",
        hint:"One carried over from F major, one new." } },
    { say:"The flat scales chain differently: the <b>4th scale degree</b> of one flat scale becomes the <b>keynote</b> of the NEXT flat scale. F major's 4th degree is B♭ → B♭ major; B♭ major's 4th degree is E♭ → E♭ major. This pattern continues through all the major flat scales. \u{1F447} <b>The 4th degree of F major — and the next flat keynote — is which note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"F4",d:"q",label:"1"},{p:"G4",d:"q",label:"2"},{p:"A4",d:"q",label:"3"},{p:"Bb4",d:"q",label:"4 → new keynote"}],width:380} },
      try:{ type:"mc", choices:["B♭","C","E♭","A"], answer:0,
        success:"✓ B♭ — each flat scale's 4th degree launches the next flat scale.",
        fail:"Count up four degrees from F.",
        hint:"F–G–A–…?" } },
    { say:"To the keyboard! \u{1F447} <b>Play the F major scale — watch for the black key at degree 4:</b>",
      try:{ type:"custom",
        hint:"F G A B♭ C D E F — the B♭ is the black key just below B.",
        mount:(container,fb)=>MF_L28_kbScale(container,fb) } },
    { say:"Name this scale. Read the accidentals carefully. \u{1F447} <b>Which major scale is this?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"Bb4",d:"q"}],width:480} },
      try:{ type:"mc", choices:["F major","B♭ major","C major"], answer:1,
        success:"✓ Two flats (B♭ and E♭) starting on B♭ — the B♭ major scale.",
        fail:"Count the flats and check the keynote.",
        hint:"It begins and ends on B♭." } }
  ],
  examples:[
    { caption:"The F major scale: F and C tetrachords joined by a whole step. B is lowered to B♭ to create the half step from A.",
      staff:{clef:"treble",tempo:100,notes:[{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"Bb4",d:"q",label:"B♭"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",d:"q",label:"F"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"F tetrachord"},{from:4,to:7,label:"C tetrachord"}],width:540},
      kb:{start:60,octaves:2,labels:true,marks:[65,67,69,70,72,74,76,77]} },
    { caption:"The B♭ major scale: B♭ and F tetrachords. E is lowered to E♭ — and B♭ carries over from F major.",
      staff:{clef:"treble",tempo:100,notes:[{p:"Bb3",d:"q",label:"B♭"},{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"Eb4",d:"q",label:"E♭"},{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"Bb4",d:"q",label:"B♭"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"B♭ tetrachord"},{from:4,to:7,label:"F tetrachord"}],width:540},
      kb:{start:57,octaves:1.1667,labels:true,marks:[58,60,62,63,65,67,69,70]} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Flat Hunt",
      intro:"B♭, E♭, naturals and impostors — click the symbol that's named!",
      miaIntro:"Spot the flats at a glance! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"B♭", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}],width:160}},
        {label:"E♭", spec:{clef:"treble",notes:[{p:"Eb4",d:"q"}],width:160}},
        {label:"B natural", spec:{clef:"treble",notes:[{p:"B4",acc:"n",d:"q"}],width:160}},
        {label:"F♯", spec:{clef:"treble",notes:[{p:"F#4",d:"q"}],width:160}}]},
      result:(score)=>score>=5?"No flat escapes you!":null },
    { type:"order-tap", title:"Game 2 · Climb the F Major Ladder",
      intro:"Eight notes, keynote first — don't forget the B♭!",
      miaIntro:"Build it from memory! \u{1FA9C}",
      spec:{sequence:["F","G","A","B♭","C","D","E","F"], title:"Tap the notes of the F major scale in order — keynote first!"},
      result:(stars)=>stars>=3?"F major, flawless — B♭ and all!":null },
    { type:"term-race", title:"Game 3 · Flat-Scale Facts Race",
      intro:"Which scale has which flats? Match at speed!",
      miaIntro:"Flat facts, fast! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["F Major","One flat — B♭"],
        ["B♭ Major","Two flats — B♭ and E♭"],
        ["C Major","No flats at all"],
        ["Flat (♭)","Lowers a note by one half step"],
        ["Why B♭, not A♯?","To keep the notes in alphabetical order"],
        ["4th degree of F major","The keynote of the next flat scale — B♭"]]},
      result:(score)=>score>=7?"Flat-scale scholar!":null },
    { type:"key-hunt", title:"Game 4 · Find Every Keynote F",
      intro:"The keynote names the scale — find every F on the keyboard!",
      miaIntro:"Keynote hunting, flat edition! \u{1F3B9}",
      spec:{letter:"F"},
      result:(score)=>score>=3?"Every F found — keynotes secured!":null }
  ],
  practiceIntro:"20 practice questions — F major, B♭ major, their flats, and WHY those flats exist. Answer right and the next appears automatically!",
  practice:[
    { gen:"step-type", params:{}, count:3 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { gen:"enharmonic", params:{}, count:2 },
    { gen:"term-match", params:{subject:"fact", pool:[["F Major","One flat — B♭"],["B♭ Major","Two flats — B♭ and E♭"],["C Major","No flats at all"],["Flat (♭)","Lowers a note by one half step"]], reverse:true}, count:4 },
    { type:"truefalse", q:"F major contains two flats.", answer:false,
      explain:"F major has exactly ONE flat: B♭." },
    { type:"mc", q:"The F major scale contains one flat: ____.", choices:["B♭","E♭","A♭"], answer:0,
      explain:"B is lowered to B♭ to make the 3–4 half step." },
    { type:"mc", q:"The keynote of the major scale with two flats is ____.", choices:["B♭","F","E♭"], answer:0,
      explain:"B♭ major carries B♭ and E♭." },
    { type:"mc", q:"Complete the F major scale: F G A ____ C D E F", choices:["B♭","B","A♯"], answer:0,
      explain:"The 4th degree must be B♭." },
    { type:"mc", q:"Complete the B♭ major scale: B♭ C D ____ F G A B♭", choices:["E♭","E","D♯"], answer:0,
      explain:"E is lowered to E♭ in B♭ major." },
    { type:"mc", q:"Why does F major use B♭ instead of A♯?", choices:["To stay in alphabetical order","Because A♯ is lower","Because flats are easier"], answer:0,
      explain:"A–B♭–C keeps every letter used once; A–A♯–C would repeat A and skip B." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Write a tetrachord starting on B♭: B♭ – C – D – ____", choices:["E♭","E","F"], answer:0,
      explain:"B♭–C (W), C–D (W), D–E♭ (H)." },
    { type:"mc", q:"The 4th scale degree of F major (B♭) is the ____ of B♭ major.", choices:["1st scale degree (keynote)","last flat","3rd degree"], answer:0,
      explain:"Each flat scale's 4th degree becomes the next flat keynote." },
    { type:"mc", q:"F major → B♭ major → ____ major: which flat scale comes next?", choices:["E♭","A♭","D♭"], answer:0,
      explain:"B♭ major's 4th degree is E♭ — the chain continues." },
    { type:"mc", q:"In the F major scale, the half steps fall between A–B♭ and ____.", choices:["E–F","D–E","C–D"], answer:0,
      explain:"Degrees 3–4 (A–B♭) and 7–8 (E–F)." }
  ],
  miaQuizIntro:"Two scales, three flats between them — show me you know which goes where!",
  quiz:[
    { type:"mc", q:"Which note is flatted in the F major scale?", choices:["A","B","C","D"], answer:1,
      explain:"B♭ — the one flat of F major.", hint:"Degree 4." },
    { type:"mc", q:"Which notes are flatted in the B♭ major scale?", choices:["B♭ and C♭","B♭ and E♭","E♭ and A♭","A♭ and D♭"], answer:1,
      explain:"B♭ carries over from F major; E♭ is new.", hint:"One old, one new." },
    { type:"truefalse", q:"Every major scale follows the same interval pattern.", answer:true,
      explain:"W–W–H–W–W–W–H — flats exist to preserve it.", hint:"Same pattern as always." },
    { type:"truefalse", q:"F major contains two flats.", answer:false,
      explain:"Just one: B♭.", hint:"Count the flats in the F scale." },
    { type:"mc", q:"Which matching is correct?",
      choices:["F major → B♭ · B♭ major → B♭, E♭ · C major → no flats",
               "F major → E♭ · B♭ major → A♭ · C major → B♭",
               "F major → B♭, E♭ · B♭ major → B♭ · C major → F♭"], answer:0,
      explain:"1 flat for F, 2 for B♭, none for C.", hint:"The flats accumulate one scale at a time." },
    { type:"mc", q:"The F major scale contains one flat: ____.", choices:["B♭","E♭","D♭"], answer:0,
      explain:"B lowered to B♭ completes the half step from A.", hint:"It fixes degree 4." },
    { type:"mc", q:"The keynote of the scale with two flats is ____.", choices:["B♭","E♭","F"], answer:0,
      explain:"B♭ major: B♭ and E♭.", hint:"The scale is named after its keynote." },
    { type:"mc", q:"Complete the F major scale: F G A ____ C D E F", choices:["B♭","B","C♭"], answer:0,
      explain:"The half step above A is B♭.", hint:"Natural B is too high." },
    { type:"mc", q:"Complete the B♭ major scale: B♭ C D ____ F G A B♭", choices:["E♭","E","D♯"], answer:0,
      explain:"Two flats, both keeping the pattern (and the alphabet) intact.", hint:"Alphabetical order matters." },
    { type:"mc", q:"Why does F major use B♭?",
      choices:["To make the music sound louder","To preserve the major-scale interval pattern","Because every major scale contains B♭","To match the bass clef"], answer:1,
      explain:"A to B is a whole step where a half step is needed — lowering B to B♭ fixes it.", hint:"Think in intervals, not note names." },
    { type:"mc", q:"Which major scale is shown?",
      staff:{clef:"treble",notes:[{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"Bb4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q"},{p:"F5",d:"q"}],width:420},
      choices:["F major","B♭ major","C major"], answer:0,
      explain:"One flat (B♭), keynote F.", hint:"Check the first note and count the flats." },
    { type:"mc", q:"Which major scale is shown?",
      staff:{clef:"treble",notes:[{p:"Bb3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"Eb4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"Bb4",d:"q"}],width:420},
      choices:["B♭ major","F major","E♭ major"], answer:0,
      explain:"Two flats, keynote B♭.", hint:"It begins and ends on the same letter." },
    { type:"mc", q:"The 4th scale degree of F major is the keynote of…", choices:["B♭ major","C major","G major"], answer:0,
      explain:"F–G–A–B♭: the 4th degree launches the next flat scale.", hint:"The flat-scale chain." },
    { type:"mc", q:"A flat (♭) ____ a note by one half step.", choices:["lowers","raises","holds"], answer:0,
      explain:"Flat = one half step lower.", hint:"Which direction did B move?" },
    /* generated */
    { gen:"step-type", params:{}, count:2 },
    { gen:"term-match", params:{subject:"fact", pool:[["F Major","One flat — B♭"],["B♭ Major","Two flats — B♭ and E♭"],["C Major","No flats at all"],["Flat (♭)","Lowers a note by one half step"]], reverse:true}, count:2 },
    { gen:"note-name", params:{clef:"bass"}, count:2 }
  ],
  vocabulary:[
    {term:"F Major Scale", def:"F major is a major scale based on F, consisting of the pitches F, G, A, B♭, C, D, and E. Key signature: one flat (B♭)."},
    {term:"B♭ Major Scale", def:"B♭ major is a major scale based on B♭, consisting of the pitches B♭, C, D, E♭, F, G, and A. Key signature: two flats (B♭, E♭)."},
    {term:"Flat (♭)", def:"Lowers a note by one half step.",
      staff:{clef:"treble",notes:[{p:"Bb4",d:"q"}],width:120}},
    {term:"Keynote", def:"The note on which a scale begins and ends."}
  ],
  mistakes:[],
  summary:[
    "✔ Flats do the same job as sharps: they <b>preserve W–W–H–W–W–W–H</b>.",
    "✔ <b>F major = 1 flat (B♭)</b>: F–G–A–B♭–C–D–E–F.",
    "✔ <b>B♭ major = 2 flats (B♭, E♭)</b>: B♭–C–D–E♭–F–G–A–B♭.",
    "✔ B♭ (not A♯) and E♭ (not D♯) keep the notes in <b>alphabetical order</b>.",
    "✔ The <b>4th degree</b> of each flat scale is the <b>keynote</b> of the next flat scale: F → B♭ → E♭ → …"
  ],
  tips:[
    "Sharp scales chain from the 2nd tetrachord; flat scales chain from the 4th DEGREE — two different ladders, one pattern.",
    "At a piano, play F to F on white keys, then with B♭ — hear degree 4 settle into place.",
    "New flats always appear on degree 4 of the new flat scale.",
    "Next lessons: pack these sharps and flats into KEY SIGNATURES so you never write them twice."
  ],
  rewards:{ badge:"Flat Scale Builder", icon:"\u{266D}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"Perfect! F major and B♭ major bow before you — every flat exactly in place. \u{266D}\u{1F389}",
  miaPass:"You passed! Remember: B♭ fixes F major, and B♭ + E♭ fix B♭ major. Trust the pattern.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A used natural B — degree 4 sat too high and broke the W–W–H pattern. Version B lowered it to B♭ and the scale locked in.",
      play:()=>{[65,67,69,70,72,74,76,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    learn:{ label:"the flat scales",
      explain:"Same pattern, flat fixes: F major needs B♭; B♭ major needs B♭ and E♭. Flats are chosen (not sharps) to keep the letters alphabetical.",
      hint:"New flat = degree 4 of the new scale.",
      play:()=>{MFAudio.tone(69,.35,0);MFAudio.tone(70,.35,.4);MFAudio.tone(72,.6,.8);} },
    example:{ label:"the examples",
      explain:"Both scales with their tetrachord brackets and W–H carets — hear how the lowered notes keep each climb identical to C major's." },
    game:{ label:"the games",
      explain:"Hunt the flats, climb the F ladder, race the facts, then find every keynote F on the keyboard.",
      hint:"B♭ belongs to both scales — E♭ only to B♭ major." },
    quiz:{ label:"this question",
      explain:"Three facts carry the day: F major = B♭; B♭ major = B♭ + E♭; and every flat exists to preserve W–W–H–W–W–W–H.",
      play:()=>{MFAudio.tone(69,.3,0);MFAudio.tone(70,.3,.35);MFAudio.tone(72,.5,.7);} }
  }
};
