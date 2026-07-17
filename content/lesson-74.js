/* Lesson 74 — ABA (Ternary) Form (AEMT Book 3, Unit 18)
   Built from drafts/UNIT 18 – Lesson 74.md; AEMT3 p.116 verified by render.
   Core: THREE-PART FORMS = ABA (TERNARY): A = statement, B = contrasting
   statement of new material, A = RESTATEMENT of the A section. One of the
   most common forms in all types of music, from folk songs to symphonies.
   NOTE: edit by FULL-FILE REWRITE only. */

/* section sequencer: hear three sections, label each A or B */
function MF_L74_seq(container,fb){
  const SEC_A={notes:[67,64,60,64,67,67], durs:[.45,.45,.45,.45,.45,.9]};
  const SEC_B={notes:[69,70,69,65,62,65], durs:[.45,.45,.45,.45,.45,.9]};
  const ORDER=[SEC_A,SEC_B,SEC_A];
  let k=0; const picked=[];
  container.innerHTML=`<div class="big-q l74s-q" style="text-align:center">A three-section piece plays one section at a time. Label each one: A or B?</div>
    <div class="l74s-map" style="text-align:center;font-weight:800;font-size:18px;letter-spacing:6px;margin:6px 0">· · ·</div>
    <div style="text-align:center"><button class="play l74s-play">▶ Play section 1</button></div>
    <div class="choices chips l74s-ch" style="display:none"><button>A</button><button>B</button></div>`;
  const q=container.querySelector(".l74s-q"), map=container.querySelector(".l74s-map"), pl=container.querySelector(".l74s-play"), ch=container.querySelector(".l74s-ch");
  let played=false;
  function drawMap(){ map.textContent=[0,1,2].map(i=>i<picked.length?picked[i]:"?").join(" "); }
  function play(S){ let t=0; S.notes.forEach((m,i)=>{ MFAudio.tone(m,S.durs[i]*.95,t,.42); t+=S.durs[i]; }); return t; }
  pl.onclick=()=>{ if(k>=3) return; play(ORDER[k]); played=true; setTimeout(()=>ch.style.display="",3300); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played||k>=3) return;
    const want=(k===1)?1:0;
    if(i===want){ MFAudio.yay();
      picked.push(b.textContent); drawMap(); k++; played=false; ch.style.display="none";
      if(k<3){ fb(true, k===1? "✓ Great! That's the A section. Now section 2…" : "✓ Section 2 = B — NEW material, the contrast. One more…");
        pl.textContent=`▶ Play section ${k+1}`; }
      else { pl.style.display="none";
        fb(true,"✓ Excellent! The first section returned — you found the ABA pattern: statement, contrast, return. TERNARY form, mapped by ear.");
        q.textContent="A · B · A — complete!"; }
    } else { MFAudio.tone(40,.2); fb(false, k===2? "Listen — is this NEW material, or the first section returning?" : "Compare with what you've heard so far: same material or new?"); }
  });
  drawMap();
}

LESSON_CONTENT[74]={
  welcome:"Ternary (ABA) form: the first section returns. \u{1F3AB}",
  hook:{
    say:"<b>Listen to this piece.</b> \u{1F447} <b>Does the first section come back at the end?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play all three sections</button></div>
          <div class="choices hk-ch" style="display:none"><button>Yes — the first section returned at the end</button><button>No — the piece just stopped mid-idea</button><button>No — a brand-new idea appeared</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          const A=[67,64,60,64,67,67], B=[69,70,69,65,62,65];
          let t=0;
          A.forEach(m=>{ MFAudio.tone(m,.42,t,.42); t+=.45; }); t+=.3;
          B.forEach(m=>{ MFAudio.tone(m,.42,t,.4); t+=.45; }); t+=.3;
          A.forEach(m=>{ MFAudio.tone(m,.42,t,.42); t+=.45; });
          setTimeout(()=>ch.style.display="",t*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Statement… contrast… RETURN. That A-B-A shape is TERNARY form — one of the most common forms in all of music, from folk songs to symphonies. Today's lesson!");
          else fb(false,"Focus on the LAST section — where have you heard that material before?");
        });
      } }
  },
  objectives:[
    "Understand ABA (Ternary) form: three sections built from two contrasting musical ideas",
    "Name the jobs: A = statement, B = contrast (new material), A = restatement",
    "Compare ternary form (the opening section returns) with binary form (no full return of the opening section)",
    "Know ABA's range: folk songs to symphonies",
    "Tell ABA form apart from verse–chorus form",
    "Identify ABA by ear and by eye"
  ],
  steps:[
    { say:"<b>What Is Ternary Form?</b> <b>ABA (ternary) form</b> has three sections. The first section (A) returns after the contrasting middle section (B). \u{1F447} <b>How many DIFFERENT sections are there in ABA form?</b>",
      show:{ type:"html", html:`<div style="max-width:320px;margin:0 auto;font-size:15px;line-height:2;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center">
        <b>Binary Form:</b> A → B<br><b>Ternary Form:</b> A → B → A</div>` },
      try:{ type:"mc", choices:["Two — the A simply returns","Three completely different ones","One"], answer:0,
        success:"✓ Only A and B exist; the third part is A returning. Three parts, two different sections!",
        fail:"Count the LETTERS, then count the DIFFERENT letters…",
        hint:"A, B and… A again." } },
    { say:"<b>The Three Sections:</b> A = first idea · B = new, contrasting idea · A = return of the first idea. \u{1F447} <b>What is the purpose of the B section?</b>",
      try:{ type:"mc", choices:["Bring NEW, contrasting material","Repeat A quietly","End the piece"], answer:0,
        success:"✓ B brings NEW, contrasting material between the two A sections.",
        fail:"What does B add that A did not have?",
        hint:"Contrasting… NEW material." } },
    { say:"<b>Why ABA Is Popular:</b> ABA form is one of the most common musical forms. The return of the A section gives the music a feeling of completion. \u{1F447} <b>Where is ABA form commonly found?</b>",
      try:{ type:"mc", choices:["Everywhere — folk songs to symphonies","Only in piano music","Only in the Baroque era"], answer:0,
        success:"✓ Lullabies, spirituals, minuets, symphony movements — ABA is everywhere.",
        fail:"From folk songs to…",
        hint:"From ____ songs to ____." } },
    { say:"Listen to the music. Label each section A or B. \u{1F447}",
      try:{ type:"custom",
        hint:"Section 3 should sound like an old friend.",
        mount:(container,fb)=>MF_L74_seq(container,fb) } },
    { say:"<b>ABA and Songs:</b> Some folk songs resemble ABA form when an opening section returns after a contrasting middle. But many modern songs use <b>verse–chorus form</b> instead, so the letters A and B do not automatically mean ternary. \u{1F447} <b>Does every song with two sections use ternary form?</b>",
      try:{ type:"mc", choices:["No — only if the opening section returns as a third section","Yes — any two sections make ABA","Only if it is a folk song"], answer:0,
        success:"✓ Ternary needs the opening section to RETURN (A B A). Many modern songs are verse–chorus form, not ternary — the structure decides the form, not the labels.",
        fail:"What has to happen for a piece to be ABA?",
        hint:"The opening must come back as a third section." } },
    { say:"<b>Binary vs. Ternary:</b> <b>Binary form: A → B</b> — the opening section does not make a full return. <b>Ternary form: A → B → A</b> — the opening section returns. \u{1F447} <b>Which form returns to the opening section?</b>",
      show:{ type:"html", html:`<div style="max-width:320px;margin:0 auto;font-size:15px;line-height:1.9;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center">
        <b>Binary Form:</b> A → B<br><span style="font-size:12.5px;color:#667">no full return of the opening</span><br><b>Ternary Form:</b> A → B → A<br><span style="font-size:12.5px;color:#667">the opening section returns</span></div>` },
      try:{ type:"mc", choices:["ABA — the opening section returns","AB — the opening section does not fully return","Neither"], answer:0,
        success:"✓ Ternary (ABA) returns to the opening section; binary (AB) has no full return of the opening.",
        fail:"Which form restates its opening as a third section?",
        hint:"A B A brings the opening back." } },
    { say:"<b>The Return of A:</b> The final A may be exactly the same or slightly changed. It is still considered the A section. \u{1F447} <b>What does \u{201C}restatement\u{201D} mean?</b>",
      try:{ type:"mc", choices:["The A section's material again","Brand-new material","Only the B motive"], answer:0,
        success:"✓ Same material, stated again — possibly slightly varied, but always recognizable as the A section.",
        fail:"Re-STATE = state again…",
        hint:"The prefix does the work." } },
    { say:"<b>Review:</b> Two musical ideas, three sections — and one of them returns. \u{1F447} <b>Which form has three large sections?</b>",
      try:{ type:"mc", choices:["ABA (ternary)","AB (binary)","Both have three"], answer:0,
        success:"✓ ABA (ternary) has three large sections built from two ideas; AB (binary) has two. Next lesson, the opening returns not once but again and again — the rondo!",
        fail:"Count the sections in A–B–A.",
        hint:"A, B, A — that's three." } }
  ],
  examples:[
    { caption:"A miniature ternary piece: A states the first idea, B contrasts with new material, and A returns exactly as before.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"G4",d:"q",label:"A: statement"},{p:"E4",d:"q"},{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"h"},{bar:"double"},
        {p:"A4",d:"q",label:"B: NEW material"},{p:"Bb4",d:"q"},{p:"A4",d:"q"},{p:"F4",d:"q"},{p:"D4",d:"h"},{bar:"double"},
        {p:"G4",d:"q",label:"A: restatement!"},{p:"E4",d:"q"},{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"h"},{bar:"final"}],width:680},
      kb:{start:57,octaves:1.1667,labels:true} },
    { caption:"The same shape drawn with chords: I, then IV and V7, then I again — the harmony returns with the melody.",
      staff:{clef:"treble",tempo:90,notes:[
        {p:"C4",d:"w",label:"A: I chord"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"B: away…"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"…farther…"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"A: I again"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:57,octaves:1.6667,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Ternary Sprint (45s)",
      intro:"Statements, contrasts, restatements — race the three-part facts!",
      miaIntro:"A, B, then A again! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["ABA form","ternary — three-part form"],
        ["The first A","the statement"],
        ["The B section","a contrasting section of new material"],
        ["The final A","the restatement"],
        ["Number of DISTINCT sections in ABA","two"],
        ["ABA's popularity","folk songs to symphonies"],
        ["Binary vs ternary","AB = no full return of the opening; ABA = the opening returns"],
        ["Ternary's sense of completion","comes from the return of the A section"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — ternary in the blood!":null },
    { type:"key-climb", title:"Game 2 · Play the A-B-A",
      intro:"Perform a whole ABA in miniature: A down-up, B's new idea, A again!",
      miaIntro:"A, then B, then A again! \u{1FA9C}",
      spec:{seq:[67,64,60,64,67, 69,70,65,62, 67,64,60,64,67],
        names:["G (A begins)","E","C","E","G (A ends)","A (B: new!)","B♭","F","D (B ends)","G (A RETURNS)","E","C","E","G — done!"],
        start:57, octaves:1.1667, title:"A · B · A under your fingers"},
      result:(score)=>score!==null?"A-B-A performed!":null },
    { type:"symbol-hunt", title:"Game 3 · Statement or Contrast?",
      intro:"A-material, B-material, and the two endings — click what's called!",
      miaIntro:"Recognize the A section on sight! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"A material (the statement)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"C4",d:"q"},{p:"E4",d:"q"}],width:170}},
        {label:"B material (new, contrasting)", spec:{clef:"treble",notes:[{p:"A4",d:"q"},{p:"Bb4",d:"q"},{p:"A4",d:"q"},{p:"F4",d:"q"}],width:170}},
        {label:"The restatement (A again!)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"C4",d:"q"},{p:"G4",d:"h"}],width:170}},
        {label:"AB ending (no return)", spec:{clef:"treble",notes:[{p:"A4",d:"q"},{p:"F4",d:"q"},{p:"D4",d:"h"}],width:170}}]},
      result:(score)=>score>=5?"Sections spotted on sight!":null },
    { type:"order-tap", title:"Game 4 · Assemble the ABA",
      intro:"Tap the sections of an ABA piece in order!",
      miaIntro:"Statement, contrast, restatement! \u{1F3C1}",
      spec:{sequence:["A — the statement","B — new contrasting material","A — the restatement"],
        title:"One ternary piece, start to finish"},
      result:(stars)=>stars>=2?"The ABA pattern is yours!":null }
  ],
  practiceIntro:"20 practice questions — sections, returns and the AB/ABA difference. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Ternary","three-part (ABA)"],["Statement","the first A"],["Contrast","the B section"],["Restatement","the final A"],["Binary","two-part (AB)"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"Three-part forms are called…", choices:["ABA or ternary form","AB or binary form","rondo form"], answer:0,
      explain:"Ter = three." },
    { type:"mc", q:"How many DIFFERENT sections are in ABA form?", choices:["Two — the A simply returns","Three","One"], answer:0,
      explain:"A and B; the third part restates A." },
    { type:"mc", q:"What does the B section do?", choices:["Brings new, contrasting material","Repeats A","Ends the piece"], answer:0,
      explain:"New material between the two A sections." },
    { type:"mc", q:"The final A of ABA is called the…", choices:["restatement","introduction","coda"], answer:0,
      explain:"A stated again." },
    { type:"mc", q:"Where is ABA form commonly found?", choices:["In all types of music, folk songs to symphonies","Only in children's songs","Only in opera"], answer:0,
      explain:"One of music's most common shapes." },
    { type:"mc", q:"In ABA form, which section returns at the end?", choices:["The A section — the opening","The B section","A brand-new section"], answer:0,
      explain:"The opening A returns as the third section." },
    { type:"truefalse", q:"ABA ends with the same material it began with.", answer:true,
      explain:"The return of A defines it." },
    { type:"truefalse", q:"AB (binary) form makes a full return of its opening section at the end.", answer:false,
      explain:"Binary form has no full return of the opening section." },
    { type:"truefalse", q:"The B section of ABA uses the same material as A.", answer:false,
      explain:"NEW material — that's its whole job." },
    { type:"truefalse", q:"A piece can be ternary even if the returning A is varied slightly.", answer:true,
      explain:"Recognizable A material = restatement." }
  ],
  miaQuizIntro:"Quiz! Three letters, two ideas, one return.",
  quiz:[
    { type:"mc", q:"Three-part forms are called…", choices:["ABA or ternary form","binary form","dual form"], answer:0,
      explain:"Two names, one form.", hint:"Ter- = 3." },
    { type:"mc", q:"The first A section introduces…", choices:["the piece's main idea","the contrast","the ending"], answer:0,
      explain:"The statement of the main idea.", hint:"It comes first." },
    { type:"mc", q:"The B section contains…", choices:["new, contrasting material","the same material as A","a drum break"], answer:0,
      explain:"New material in the middle.", hint:"Contrast." },
    { type:"mc", q:"The last A section is…", choices:["a restatement of the A section","new material","optional decoration"], answer:0,
      explain:"The A section returns.", hint:"Re-state." },
    { type:"truefalse", q:"ABA form consists of two musically distinct sections, like AB form.", answer:true,
      explain:"Two ideas; three appearances.", hint:"Count distinct letters." },
    { type:"truefalse", q:"ABA is one of the most common forms in all types of music.", answer:true,
      explain:"Folk songs to symphonies.", hint:"Very common." },
    { type:"mc", q:"Opening section → New section → Opening section again. The form is…", choices:["ABA (ternary)","AB (binary)","a 12-bar blues"], answer:0,
      explain:"Statement-contrast-restatement.", hint:"The return seals it." },
    { type:"mc", q:"Opening section → New section → Finish (no return). The form is…", choices:["AB (binary)","ABA (ternary)","rondo"], answer:0,
      explain:"No return = two-part.", hint:"Lesson 73's shape." },
    { type:"mc", q:"Does every song that has an A section and a B section use ternary form?", choices:["No — only if the opening section returns as a third section","Yes, always","Only in classical music"], answer:0,
      explain:"Ternary needs the opening to return (A B A). Many songs are verse–chorus form instead.", hint:"Structure decides, not the letters." },
    { type:"truefalse", q:"The same musical sections can create different forms depending on their order.", answer:true,
      explain:"Form depends on the ORDER of the sections, not their labels.", hint:"Order decides the form." },
    { type:"mc", q:"Why does ABA sound complete?", choices:["Because the opening section returns at the end","Because it is always louder","Because it changes key"], answer:0,
      explain:"The return of A gives a feeling of completion.", hint:"What comes back?" },
    { type:"mc", q:"What usually happens in the B section?", choices:["New musical material is introduced","The opening is copied exactly","Silence"], answer:0,
      explain:"B introduces new, contrasting material.", hint:"B's role." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Statement","the first A"],["New material","the B"],["Restatement","the last A"],["Ternary","the three-part name"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { gen:"note-value", params:{}, count:1 }
  ],
  vocabulary:[
    {term:"ABA (Ternary) Form", def:"A three-part form: A (statement), B (contrasting new material), A (restatement). Two distinct sections, three appearances."},
    {term:"Statement", def:"The first A — the piece's main idea, presented."},
    {term:"Contrasting Section", def:"The B section — genuinely NEW, contrasting material between the two A sections."},
    {term:"Restatement", def:"The returning A — the same material, sometimes lightly varied but always recognizable."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>ABA = TERNARY form</b>: three parts built from <b>two distinct sections</b>.",
    "✔ The jobs: <b>A statement · B contrasting NEW material · A restatement</b>.",
    "✔ Found <b>everywhere</b> — folk songs to symphonies.",
    "✔ The difference: <b>binary (A → B)</b> makes no full return; <b>ternary (A → B → A)</b> brings the opening back.",
    "✔ Some folk songs resemble ABA, but many modern songs use <b>verse–chorus form</b> — the order of sections decides the form."
  ],
  tips:[
    "If you can hum the ENDING before the piece gets there (because it is the beginning again), the form is ABA.",
    "Composers often mark the return with 'D.C. al Fine' instead of rewriting A — your Lesson 21 roadmap skills predicted this!",
    "When B borrows a rhythm from A but changes the melody, the form still counts as ternary — contrast lives in the overall material.",
    "Final lesson next: what if A returns not once, but again and AGAIN? The rondo awaits — and with it, the finish line!"
  ],
  rewards:{ badge:"Ternary Navigator", icon:"\u{1F3AB}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Statement, contrast, restatement — ABA is yours. \u{1F3AB}\u{1F389}",
  miaPass:"Passed! You know AB and ABA. ONE lesson remains…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Three sections played: the first idea, a contrasting middle, then the FIRST idea again — statement, contrast, restatement: ABA.",
      play:()=>{const A=[67,64,60,64,67],B=[69,70,65,62];let t=0;A.forEach(m=>{MFAudio.tone(m,.4,t,.42);t+=.42;});t+=.25;B.forEach(m=>{MFAudio.tone(m,.4,t,.4);t+=.42;});t+=.25;A.forEach(m=>{MFAudio.tone(m,.4,t,.42);t+=.42;});} },
    learn:{ label:"ternary form",
      explain:"ABA: two distinct sections, three parts. A states, B contrasts with new material, A restates. Found everywhere, folk to symphony. Unlike AB, it ends with the opening section.",
      hint:"A, then B, then A again.",
      play:()=>{[67,64,60,64,67].forEach((m,i)=>MFAudio.tone(m,.4,i*.42,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 is a written-out miniature ABA; example 2 shows the harmony making the same return (I → IV/V7 → I)." },
    game:{ label:"the games",
      explain:"Sprint the facts, perform a full A-B-A, spot statements vs contrasts, then assemble the sections in order.",
      hint:"The last section should feel familiar." },
    quiz:{ label:"this question",
      explain:"Ask one thing: does the opening material RETURN at the end? Yes = ternary. No = binary.",
      play:()=>{[67,64,60,64,67].forEach((m,i)=>MFAudio.tone(m,.4,i*.4,.42));} }
  }
};
