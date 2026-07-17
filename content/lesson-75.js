/* Lesson 75 — Rondo Form (AEMT Book 3, Unit 18)
   Built from drafts/UNIT 18 – Lesson 75.md; AEMT3 p.117 verified by render.
   Core: a RONDO consists of an A section ALTERNATING with other contrasting
   sections (EPISODES); A is the RECURRING section. Most common types: ABABA,
   ABACA, ABACABA. "La Raspa" is the book's rondo example (ABACA).
   NOTE: edit by FULL-FILE REWRITE only. */

/* rondo tracker: label five sections as they play — A B A C A */
function MF_L75_track(container,fb){
  const SEC={
    A:{notes:[67,67,64,67,67,72], durs:[.3,.3,.3,.3,.3,.75]},
    B:{notes:[69,71,72,71,69,64], durs:[.3,.3,.3,.3,.3,.75]},
    C:{notes:[65,69,72,69,65,60], durs:[.3,.3,.3,.3,.3,.75]}};
  const ORDER=["A","B","A","C","A"];
  let k=0, played=false; const picked=[];
  container.innerHTML=`<div class="big-q l75t-q" style="text-align:center">Five sections play one at a time. Track the form — A, B or C?</div>
    <div class="l75t-map" style="text-align:center;font-weight:800;font-size:18px;letter-spacing:6px;margin:6px 0">· · · · ·</div>
    <div style="text-align:center"><button class="play l75t-play">▶ Play section 1</button></div>
    <div class="choices chips l75t-ch" style="display:none"><button>A</button><button>B</button><button>C</button></div>`;
  const q=container.querySelector(".l75t-q"), map=container.querySelector(".l75t-map"), pl=container.querySelector(".l75t-play"), ch=container.querySelector(".l75t-ch");
  function drawMap(){ map.textContent=[0,1,2,3,4].map(i=>i<picked.length?picked[i]:"?").join(" "); }
  function play(name){ const S=SEC[name]; let t=0; S.notes.forEach((m,i)=>{ MFAudio.tone(m,S.durs[i]*.95,t,.42); t+=S.durs[i]; }); return t; }
  pl.onclick=()=>{ if(k>=5) return; play(ORDER[k]); played=true; setTimeout(()=>ch.style.display="",2600); };
  [...ch.children].forEach((b)=>b.onclick=()=>{
    if(!played||k>=5) return;
    if(b.textContent===ORDER[k]){ MFAudio.yay();
      picked.push(b.textContent); drawMap(); k++; played=false; ch.style.display="none";
      if(k<5){ fb(true, ORDER[k-1]==="A"? `✓ ${k===1?"The main theme — A.":"Great! A returned again."}` : `✓ Excellent! That's the ${ORDER[k-1]} section — new material.`);
        pl.textContent=`▶ Play section ${k+1}`; }
      else { pl.style.display="none";
        fb(true,"✓ A · B · A · C · A — a RONDO! The A section alternated with two different contrasting sections and kept returning — the pattern of 'La Raspa.'");
        q.textContent="ABACA — the rondo is complete. \u{1F3A1}"; }
    } else { MFAudio.tone(40,.2); fb(false, "Listen for a NEW section — is it the main theme (A), the first contrast (B), or the newest one (C)?"); }
  });
  drawMap();
}

LESSON_CONTENT[75]={
  welcome:"The rondo: one main theme that keeps returning. \u{1F3A1}",
  hook:{
    say:"<b>Listen carefully.</b> One melody keeps coming back between new musical ideas. \u{1F447} <b>How many times do you hear the main theme?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the whole piece</button></div>
          <div class="choices hk-ch" style="display:none"><button>Three times — with two new sections between</button><button>Once at the start only</button><button>Never — every section was new</button></div>`;
        const A=[67,67,64,67,67,72], B=[69,71,72,71,69,64], C=[65,69,72,69,65,60];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          let t=0;
          [A,B,A,C,A].forEach(S=>{ S.forEach(m=>{ MFAudio.tone(m,.28,t,.42); t+=.3; }); t+=.35; });
          setTimeout(()=>ch.style.display="",t*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ A…B…A…C…A — the main theme returned THREE times, alternating with contrasting sections. That design is the RONDO — today's lesson!");
          else fb(false,"Listen again and count how often the FIRST tune returns…");
        });
      } }
  },
  objectives:[
    "Define rondo: an A section ALTERNATING with contrasting sections",
    "Know A's role: the RECURRING section",
    "Name the common types: ABABA, ABACA, ABACABA",
    "Track a rondo by ear, section by section",
    "Compare all four forms: AB, ABA, rondo — and the phrase/motive roots",
    "Understand why the returning A creates balance"
  ],
  steps:[
    { say:"<b>What Is a Rondo?</b> A rondo has one main section (A) that keeps returning. New sections appear between each return. \u{1F447} <b>What makes a rondo different from other forms?</b>",
      try:{ type:"mc", choices:["A keeps coming back between contrasting sections","It has exactly two sections","It never repeats anything"], answer:0,
        success:"✓ The A section keeps returning between contrasting sections.",
        fail:"Which section keeps returning?",
        hint:"The recurring A." } },
    { say:"The most common rondo types: <b>ABABA · ABACA · ABACABA</b>. Look closely at what alternates in each. <b>Remember: a rondo typically begins with A, returns to A between contrasting sections, and usually ends with A.</b> \u{1F447} <b>In ABACA, how many DIFFERENT contrasting sections appear?</b>",
      show:{ type:"html", html:`<div style="max-width:420px;margin:0 auto;font-size:17px;line-height:2.2;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;font-weight:800;letter-spacing:3px">
        A B A B A<br>A B A C A<br>A B A C A B A</div>` },
      try:{ type:"mc", choices:["Two — B and C","One — only B","Four"], answer:0,
        success:"✓ B and C appear once each; A appears THREE times. The longer ABACABA gives B a return too — seven sections, one recurring theme.",
        fail:"Count the different letters that aren't A…",
        hint:"B… and?" } },
    { say:"<b>A typical rondo:</b> begins with A · returns to A between contrasting sections · usually ends with A. \u{1F447} <b>Which of these could NOT be a rondo?</b>",
      try:{ type:"mc", choices:["ABCD — nothing ever returns","ABABA","ABACABA"], answer:0,
        success:"✓ ABCD never brings A back — no recurrence, no rondo. The other two begin, return to, and end with A.",
        fail:"Check each: does A recur between contrasts?",
        hint:"The recurring section is mandatory." } },
    { say:"Listen to the music. Track the form — A, B or C? \u{1F447}",
      try:{ type:"custom",
        hint:"A is the one you'll recognize; C is newer than B.",
        mount:(container,fb)=>MF_L75_track(container,fb) } },
    { say:"The example \u{201C}La Raspa\u{201D} follows the pattern <b>A → B → A → C → A</b>. \u{1F447} <b>In La Raspa, the C section stands out because…</b>",
      try:{ type:"mc", choices:["It introduces a new contrasting episode before the return of A","It repeats the A section","It has no notes"], answer:0,
        success:"✓ Each contrasting section differs from A AND from each other — melody, rhythm, harmony.",
        fail:"C arrives AFTER B has already contrasted once…",
        hint:"Newer than new." } },
    { say:"<b>Why Does A Keep Returning?</b> Every return of A gives the listener something familiar. The new sections add variety. Together they create balance. \u{1F447} <b>Why does the A section keep returning?</b>",
      try:{ type:"mc", choices:["So the listener always comes back to familiar music","To make the piece shorter","Because the other sections are mistakes"], answer:0,
        success:"✓ Familiar returns + new sections = balance. That is the heart of the rondo.",
        fail:"What does hearing A again give the listener?",
        hint:"Something familiar." } },
    { say:"<b>Compare the Forms:</b> AB → ABA → ABACA. \u{1F447} <b>Which form repeats A the MOST?</b>",
      try:{ type:"mc", choices:["Rondo (ABACA)","Ternary (ABA)","Binary (AB)"], answer:0,
        success:"✓ The rondo — A returns again and again. You now know all three forms: AB, ABA, and the rondo!",
        fail:"Count the A's in each form…",
        hint:"A-B-A-C-A." } },
    { say:"<b>One More Pattern:</b> The recurring A can return many times, with a new contrasting episode each time. \u{1F447} <b>Which of these is also a common rondo pattern?</b>",
      try:{ type:"mc", choices:["ABACADA","ABCDA","ABCA"], answer:0,
        success:"✓ ABACADA — A keeps returning while new episodes (B, C, D) appear between them. The recurring A is what makes it a rondo.",
        fail:"Which one keeps bringing A back between the new sections?",
        hint:"A must return between each new episode." } }
  ],
  examples:[
    { caption:"A miniature rondo, written out: A (the main theme), B (first contrasting episode), A, C (second contrasting episode), and A to close. Follow the letters as it plays!",
      staff:{clef:"treble",tempo:120,notes:[
        {p:"G4",d:"8",label:"A"},{p:"G4",d:"8"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"},{bar:"double"},
        {p:"A4",d:"8",label:"B"},{p:"B4",d:"8"},{p:"C5",d:"q"},{p:"A4",d:"q"},{p:"E4",d:"q"},{bar:"double"},
        {p:"G4",d:"8",label:"A"},{p:"G4",d:"8"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"},{bar:"double"},
        {p:"F4",d:"8",label:"C"},{p:"A4",d:"8"},{p:"C5",d:"q"},{p:"A4",d:"q"},{p:"C4",d:"q"},{bar:"double"},
        {p:"G4",d:"8",label:"A"},{p:"G4",d:"8"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"h"},{bar:"final"}],
        beams:[[0,1],[6,7],[12,13],[18,19],[24,25]],width:940},
      kb:{start:57,octaves:1.25,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Rondo Sprint (45s)",
      intro:"Recurring sections, common types, form comparisons — race the rondo!",
      miaIntro:"Round and round! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Rondo","A alternating with contrasting sections"],
        ["The A section's role","the recurring section"],
        ["Common rondo types","ABABA, ABACA, ABACABA"],
        ["ABACA's contrasts","B and C — one visit each"],
        ["A typical rondo begins and ends with","the A section"],
        ["'La Raspa'","a rondo example (ABACA)"],
        ["AB form","two sections: A–B"],
        ["ABA form","statement, contrast, restatement"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — rondo master!":null },
    { type:"key-climb", title:"Game 2 · Play the Rondo Theme",
      intro:"Play the main theme, a contrast, and the theme again — a mini-rondo under your fingers!",
      miaIntro:"Climb it — make it musical! \u{1FA9C}",
      spec:{seq:[67,67,64,67,72, 69,71,72,69, 67,67,64,67,72],
        names:["G (A!)","G","E","G","C — theme done","A (B: contrast)","B","C","A — contrast done","G (A RETURNS!)","G","E","G","C — rondo!"],
        start:64, octaves:0.6667, title:"A · B · A — a mini-rondo"},
      result:(score)=>score!==null?"Mini-rondo performed — bravo!":null },
    { type:"symbol-hunt", title:"Game 3 · Name That Form",
      intro:"Form patterns on cards — click the one each round names!",
      miaIntro:"Every form you know! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Rondo (ABACA)", spec:{clef:"none",notes:[{letter:"A"},{letter:"B"},{letter:"A"},{letter:"C"},{letter:"A"}],width:220}},
        {label:"Ternary (ABA)", spec:{clef:"none",notes:[{letter:"A"},{letter:"B"},{letter:"A"}],width:170}},
        {label:"Binary (AB)", spec:{clef:"none",notes:[{letter:"A"},{letter:"B"}],width:140}},
        {label:"Rondo (ABACABA)", spec:{clef:"none",notes:[{letter:"A"},{letter:"B"},{letter:"A"},{letter:"C"},{letter:"A"},{letter:"B"},{letter:"A"}],width:260}}]},
      result:(score)=>score>=5?"All forms named on sight!":null },
    { type:"term-race", title:"Game 4 · Big Ideas Review Race",
      intro:"A quick review race across the big ideas — the staff, chords, scales, and forms. GO!",
      miaIntro:"Review race — how many can you catch? \u{26A1}",
      spec:{rounds:12, reverse:true, pool:[
        ["The staff","5 lines, 4 spaces (Lesson 1!)"],
        ["Treble & bass together","the grand staff"],
        ["A whole note","4 beats in 4/4"],
        ["Relative minor","the major scale's 6th degree"],
        ["V7","the dominant seventh chord"],
        ["1st inversion","the 3rd in the bass"],
        ["Figured bass 6/4","2nd inversion"],
        ["Harmonic minor","raised 7th, both directions"],
        ["The blues scale","Root, ♭3, 4, ♭5, 5, ♭7"],
        ["Motive","a short idea used repeatedly"],
        ["Rondo","A keeps coming back between episodes"],
        ["Ternary form","A B A — the opening returns"]]},
      result:(score)=>score>=9?"Big ideas locked in — nicely done!":null }
  ],
  practiceIntro:"20 practice questions — rondo facts plus a review mix from across the course. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Rondo","A alternates with contrasts"],["Recurring section","A"],["ABACA","a common rondo type"],["Binary","AB"],["Ternary","ABA"]], reverse:true}, count:5 },
    { gen:"inversion-id", params:{subject:"both", ask:"both"}, count:2 },
    { gen:"rel-key", params:{ask:"both"}, count:2 },
    { gen:"mode-id", params:{set:"all", ask:"recipe"}, count:2 },
    { type:"mc", q:"A rondo consists of an A section alternating with…", choices:["other contrasting sections","identical copies of A","silence"], answer:0,
      explain:"Contrast between every return." },
    { type:"mc", q:"In a rondo, the RECURRING section is…", choices:["A","B","C"], answer:0,
      explain:"The section that keeps returning." },
    { type:"mc", q:"Which is a common rondo type?", choices:["ABACA","ABCD","AABB"], answer:0,
      explain:"Along with ABABA and ABACABA." },
    { type:"mc", q:"Which song is a rondo example?", choices:["'La Raspa' (Mexican folk song)","Beethoven's 5th","'Go, Tell It On the Mountain'"], answer:0,
      explain:"Its form: ABACA." },
    { type:"mc", q:"A rondo typically begins and ends with…", choices:["the A section","the newest section","a drum solo"], answer:0,
      explain:"A opens it and closes it." },
    { type:"truefalse", q:"In ABACABA, the B section appears twice.", answer:true,
      explain:"A×4, B×2, C×1 — count them!" },
    { type:"truefalse", q:"ABCD is a valid rondo form.", answer:false,
      explain:"Nothing recurs — no rondo." },
    { type:"truefalse", q:"In ABACA, the A section appears three times.", answer:true,
      explain:"A, then B, A, C, A." }
  ],
  miaQuizIntro:"Quiz! A begins it, A ends it, A keeps returning between the episodes.",
  quiz:[
    { type:"mc", q:"A RONDO is a form consisting of…", choices:["an A section alternating with contrasting sections","exactly two sections","one endless melody"], answer:0,
      explain:"A recurring main theme with contrasting sections.", hint:"The recurring A." },
    { type:"mc", q:"In rondo form, which section RECURS?", choices:["A","B","C"], answer:0,
      explain:"A is the recurring section.", hint:"The hero of the form." },
    { type:"mc", q:"The most common rondo types are…", choices:["ABABA, ABACA and ABACABA","AB and ABA only","AAA and BBB"], answer:0,
      explain:"Three patterns of different lengths.", hint:"All start and end with A." },
    { type:"mc", q:"'La Raspa' is in which form?", choices:["ABACA","ABABA","AB"], answer:0,
      explain:"Two contrasts, three A's.", hint:"It has a C section." },
    { type:"truefalse", q:"A rondo's contrasting sections must contrast with A and (in ABACA) with each other.", answer:true,
      explain:"B and C differ from A and from each other.", hint:"Why C gets a new letter." },
    { type:"truefalse", q:"A rondo may end on its B section.", answer:false,
      explain:"The recurring A closes every common type.", hint:"Check the three patterns." },
    { type:"mc", q:"You hear: theme, contrast 1, theme, contrast 2, theme. The form is…", choices:["Rondo (ABACA)","Ternary (ABA)","Binary (AB)"], answer:0,
      explain:"Two DIFFERENT contrasts with returns = rondo.", hint:"Count the different contrasts." },
    { type:"mc", q:"You hear: statement, contrast, restatement — three sections total. The form is…", choices:["Ternary (ABA)","Rondo","Binary"], answer:0,
      explain:"One contrast only = ABA.", hint:"Lesson 74's shape." },
    { type:"mc", q:"Which form does NOT make a full return of its opening section?", choices:["AB (binary)","ABA (ternary)","Rondo"], answer:0,
      explain:"Binary (A–B) has no full return of the opening; ABA and rondo bring A back.", hint:"The one without a return of A." },
    { type:"mc", q:"Order the forms by how many times A appears (ABACA vs ABA vs AB):", choices:["Rondo (3) > Ternary (2) > Binary (1)","Binary > Ternary > Rondo","All equal"], answer:0,
      explain:"The rondo loves its theme most.", hint:"Count A's in each map." },
    { type:"mc", q:"Forms are built from…", choices:["motives → phrases → sections","only key signatures","only dynamics"], answer:0,
      explain:"Lesson 72's order underlies Lessons 73-75.", hint:"The smallest ideas first." },
    { type:"mc", q:"Which statement best describes rondo form?", choices:["A recurring main theme alternates with contrasting sections","Two sections: A–B","One melody with no repeats"], answer:0,
      explain:"That is the rondo.", hint:"A keeps returning." },
    /* generated — a review mix from across the course */
    { gen:"term-match", params:{subject:"term", pool:[["Rondo","the recurring-A form"],["ABACA","two episodes, three returns"],["Recurring section","A"],["Episode","a contrasting section between A returns"]], reverse:true}, count:2 },
    { gen:"inversion-id", params:{subject:"both", ask:"both"}, count:2 },
    { gen:"triad-quality", params:{}, count:2 },
    { gen:"rel-key", params:{ask:"both"}, count:1 },
    { gen:"mode-id", params:{set:"all", ask:"recipe"}, count:1 }
  ],
  vocabulary:[
    {term:"Rondo", def:"A form in which the A section ALTERNATES with contrasting sections — A is the recurring section."},
    {term:"ABABA · ABACA · ABACABA", def:"The most common rondo types — each one typically begins, returns to, and ends with A."},
    {term:"Recurring Section", def:"The A section — the main theme that returns between contrasting sections."},
    {term:"Episode", def:"A contrasting section that appears between returns of the main theme (A)."},
    {term:"The Form Family", def:"AB (binary, A–B) · ABA (ternary, A–B–A) · rondo (recurring A: A–B–A–C–A…)."}
  ],
  mistakes:[],
  summary:[
    "✔ A <b>RONDO</b> = the A section <b>alternating with contrasting sections</b>; A is the <b>recurring</b> one.",
    "✔ Common types: <b>ABABA, ABACA, ABACABA</b> — each opening and closing on A.",
    "✔ The family: <b>AB</b> (A–B) · <b>ABA</b> (A–B–A) · <b>rondo</b> (A–B–A–C–A…).",
    "✔ Everything is built from <b>motives → phrases → sections</b> — Lesson 72's pyramid."
  ],
  tips:[
    "Listen for rondos in classical finales — composers loved ending big works with the friendliest form.",
    "Review path: revisit any lesson here anytime — the games regenerate fresh questions forever.",
    "Play REAL music now: hymnals, lead sheets, easy classics. You'll be shocked how much of the page simply… makes sense.",
    "When you compose, borrow the rondo's trick: bring your best idea back often, and let fresh episodes shine between the returns. \u{2764}\u{FE0F} — Mia"
  ],
  rewards:{ badge:"Rondo Navigator", icon:"\u{1F3A1}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Statement, episodes, and the theme always coming home — the rondo is completely yours. \u{1F3A1}\u{1F389}",
  miaPass:"Passed! You can hear and name a rondo — one recurring theme with contrasting episodes between. \u{1F3A1}",
  mia:{
    hook:{ label:"the welcome",
      explain:"The main theme appeared THREE times (A), alternating with two different contrasts (B, then C): A-B-A-C-A — a rondo.",
      play:()=>{const A=[67,67,64,67,72];let t=0;[A,[69,71,72,69],A].forEach(S=>{S.forEach(m=>{MFAudio.tone(m,.26,t,.42);t+=.28;});t+=.3;});} },
    learn:{ label:"rondo form",
      explain:"Rondo = A alternating with contrasting sections; A recurs. Types: ABABA, ABACA, ABACABA. Family: AB (A–B), ABA (A–B–A), rondo (recurring A).",
      hint:"A begins it, A ends it, A keeps visiting.",
      play:()=>{[67,67,64,67,72].forEach((m,i)=>MFAudio.tone(m,.28,i*.3,.42));} },
    example:{ label:"the example",
      explain:"A written-out ABACA miniature — follow A, B, A, C, A as it plays; the main theme keeps returning between the contrasting episodes." },
    game:{ label:"the games",
      explain:"Sprint the rondo facts, play the theme, name every form on sight, then race a review mix of the course's big ideas.",
      hint:"Name the form by its pattern." },
    quiz:{ label:"this question",
      explain:"Rondo questions reduce to one check: does A keep returning between contrasting episodes? The review-mix questions revisit big ideas from across the course.",
      play:()=>{[60,64,67,72].forEach((m,i)=>MFAudio.tone(m,.5,i*.15,.4));} }
  }
};
