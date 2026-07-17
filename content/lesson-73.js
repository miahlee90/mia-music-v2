/* Lesson 73 — Binary Form (AB) — FULL REWRITE (instructor 2026-07-13)
   Core: BINARY FORM = two main sections, A -> B, usually contrasting.
   Repeats (|: A :| |: B :|) do NOT add sections. Section A begins in the
   tonic and may stay (SECTIONAL) or leave toward the dominant/relative
   major (CONTINUOUS); Section B returns to the tonic. If opening A material
   returns near the end of B it is ROUNDED binary (A | B A'), else SIMPLE.
   Binary is distinct from TERNARY (A B A) and from VERSE-CHORUS form.
   Deliberately avoids "A rises / B falls" and "A must end on V7" as rules.
   NOTE: edit by FULL-FILE REWRITE only. */

/* tonal-journey builder: complete the continuous-binary plan */
function MF_L73_journey(container,fb){
  const STEPS=[
    {q:"A major-key <b>continuous</b> binary begins in the TONIC. Where does Section A lean by its end?",
      opts:["Dominant","Subdominant","Tonic (it never leaves)"], ans:0, expl:"Tonic → Dominant."},
    {q:"Section B then carries the music from the dominant back to…",
      opts:["Tonic","Dominant (it stays)","An unrelated key"], ans:0, expl:"Dominant → Tonic — home at last."}];
  let k=0; const chosen=[];
  container.innerHTML=`<div class="big-q l73j-q" style="text-align:center"></div>
    <div class="l73j-map" style="text-align:center;font-weight:800;font-size:16px;margin:10px 0;letter-spacing:.5px;color:var(--ink,#333)"></div>
    <div class="choices chips l73j-ch"></div>`;
  const q=container.querySelector(".l73j-q"), map=container.querySelector(".l73j-map"), ch=container.querySelector(".l73j-ch");
  function drawMap(){ map.innerHTML=`Section A: Tonic → <b>${chosen[0]||"?"}</b> &nbsp;|&nbsp; Section B: Dominant → <b>${chosen[1]||"?"}</b>`; }
  function ask(){ drawMap();
    if(k>=STEPS.length){ q.innerHTML="✓ <b>Tonic → Dominant | Dominant → Tonic</b> — the continuous-binary journey."; ch.innerHTML=""; return; }
    q.innerHTML=STEPS[k].q; ch.innerHTML="";
    STEPS[k].opts.forEach((o,i)=>{ const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{ if(i===STEPS[k].ans){ MFAudio.yay(); chosen[k]=o; fb(true,"✓ "+STEPS[k].expl); k++; setTimeout(ask,900); }
        else { MFAudio.tone(40,.2); fb(false,"Think about where the harmony needs to travel next."); } };
      ch.appendChild(b); });
  }
  ask();
}

/* form sorter: binary vs ternary vs rounded binary */
function MF_L73_types(container,fb){
  const R=[
    {pat:"|: A :|  |: B :|", opts:["Binary","Ternary","Rounded binary"], ans:0, expl:"Two repeated sections — plain BINARY."},
    {pat:"A → B → A", opts:["Ternary","Binary","Rounded binary"], ans:0, expl:"Three large sections, a full A return — TERNARY."},
    {pat:"|: A :|  |: B A′ :|", opts:["Rounded binary","Ternary","Simple binary"], ans:0, expl:"A returns INSIDE the second section — ROUNDED binary."}];
  let k=0;
  container.innerHTML=`<div class="big-q l73t-q" style="text-align:center"></div>
    <div class="l73t-pat" style="text-align:center;font-size:22px;font-weight:800;letter-spacing:1px;margin:12px 0;color:var(--ink,#333)"></div>
    <div class="choices chips l73t-ch"></div>`;
  const q=container.querySelector(".l73t-q"), pat=container.querySelector(".l73t-pat"), ch=container.querySelector(".l73t-ch");
  function ask(){ if(k>=R.length){ q.textContent="✓ You can tell binary, ternary and rounded binary apart!"; pat.textContent=""; ch.innerHTML=""; return; }
    q.innerHTML=`Round ${k+1} of ${R.length}: name this form.`; pat.textContent=R[k].pat; ch.innerHTML="";
    R[k].opts.forEach((o,i)=>{ const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{ if(i===R[k].ans){ MFAudio.yay(); fb(true,"✓ "+R[k].expl); k++; setTimeout(ask,1000); }
        else { MFAudio.tone(40,.2); fb(false,"Count the LARGE sections — and check whether A returns inside B."); } };
      ch.appendChild(b); });
  }
  ask();
}

/* example 1 — a continuous binary demonstration (form diagram + notation + audio) */
function MF_L73_ex1(host){
  host.innerHTML=`<div style="text-align:center;font-weight:800;font-size:18px;letter-spacing:1px;color:var(--ink,#333)">|: A :| &nbsp; |: B :|</div>
    <div style="text-align:center;font-size:14px;color:var(--muted,#667);margin:2px 0 10px">Tonic → Dominant &nbsp;|&nbsp; Dominant → Tonic</div>
    <div id="l73ex1st"></div>
    <div style="text-align:center;margin-top:12px"><button class="play" id="l73ex1btn">▶ Play the complete binary example</button></div>`;
  Staff.render(host.querySelector("#l73ex1st"),{clef:"treble",tempo:96,time:"4/4",notes:[
    {p:"C4",d:"q",label:"A"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{bar:"single"},
    {p:"A4",d:"q"},{p:"G4",d:"q"},{p:"D4",d:"h",label:"→ V"},{bar:"repeat-end"},
    {bar:"repeat-start"},
    {p:"D4",d:"q",label:"B"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{bar:"single"},
    {p:"E4",d:"q"},{p:"D4",d:"q"},{p:"C4",d:"h",label:"→ I"},{bar:"repeat-end"}],width:720});
  host.querySelector("#l73ex1btn").onclick=()=>{
    const beat=.5;
    /* play the melody exactly as written: even quarters, held half at each cadence */
    const A=[[60,1],[62,1],[64,1],[67,1],[69,1],[67,1],[62,2]];
    const B=[[62,1],[64,1],[65,1],[67,1],[64,1],[62,1],[60,2]];
    let t=0; A.forEach(([m,b])=>{ MFAudio.tone(m,beat*b*.92,t,.4); t+=beat*b; });
    [55,59,62].forEach(m=>MFAudio.tone(m,beat*2*.9,t-beat*2,.14));  /* soft V under A's held note */
    B.forEach(([m,b])=>{ MFAudio.tone(m,beat*b*.92,t,.4); t+=beat*b; });
    [48,55,64].forEach(m=>MFAudio.tone(m,beat*2*.9,t-beat*2,.14));  /* soft I under B's held note */
  };
}

/* example 2 — a rounded binary demonstration (A returns near the end of B) */
function MF_L73_ex2(host){
  host.innerHTML=`<div style="text-align:center;font-weight:800;font-size:18px;letter-spacing:1px;margin-bottom:10px;color:var(--ink,#333)">|: A :| &nbsp; |: B A′ :|</div>
    <div id="l73ex2st"></div>
    <div style="text-align:center;margin-top:12px"><button class="play" id="l73ex2btn">▶ Listen for the return of A</button></div>`;
  Staff.render(host.querySelector("#l73ex2st"),{clef:"treble",tempo:100,time:"4/4",notes:[
    {p:"G4",d:"q",label:"A"},{p:"E4",d:"q"},{p:"C4",d:"q"},{p:"E4",d:"q"},{bar:"repeat-end"},
    {bar:"repeat-start"},
    {p:"F4",d:"q",label:"B"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{bar:"single"},
    {p:"G4",d:"q",label:"A′"},{p:"E4",d:"q"},{p:"C4",d:"h"},{bar:"repeat-end"}],width:680});
  host.querySelector("#l73ex2btn").onclick=()=>{
    /* play the melody exactly as written: ten even quarters, then a held half */
    const MEL=[67,64,60,64, 65,67,69,71, 67,64]; const beat=.5;
    MEL.forEach((m,i)=>MFAudio.tone(m,beat*.92,i*beat,.4));
    const tEnd=MEL.length*beat;
    MFAudio.tone(60,beat*2*.95,tEnd,.42);                       /* final C4 held (half note) */
    [48,55,64].forEach(m=>MFAudio.tone(m,beat*2*.9,tEnd,.14));  /* soft tonic close */
  };
}

LESSON_CONTENT[73]={
  welcome:"Binary form: two sections, one complete journey — A → B. \u{1F1E6}",
  hook:{
    say:"<b>Listen to two contrasting sections.</b> The first moves away from the home key; the second brings the music back home. \u{1F447} <b>What makes this music binary?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Section A</button>
          <button class="play hk-b">▶ Section B</button></div>
          <div class="choices hk-ch" style="display:none"><button>It has two main sections</button><button>It has three main sections</button><button>The same section repeats without contrast</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67,69,67].forEach((m,i)=>MFAudio.tone(m,.42,i*.44,.42)); [55,59,62].forEach(m=>MFAudio.tone(m,1.2,5*.44,.2)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2800); };
        container.querySelector(".hk-b").onclick=()=>{ [74,72,71,69,67,64,60].forEach((m,i)=>MFAudio.tone(m,.4,i*.42,.42)); [48,64,67].forEach(m=>MFAudio.tone(m,1.4,7*.42,.2)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2800); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Binary form contains two main sections: A and B. Section A leaned away from home; Section B brought it back. Today: how binary form works — and how it differs from ternary and verse-chorus.");
          else fb(false,"Binary means “two.” Listen for two main musical sections — a statement, then a contrasting answer.");
        });
      } }
  },
  objectives:[
    "Identify the two main sections of binary form: A → B",
    "Recognize the common A–B pattern and its repeats",
    "Understand why each section is often repeated",
    "Distinguish SECTIONAL from CONTINUOUS binary form",
    "Recognize SIMPLE and ROUNDED binary form",
    "Tell binary form apart from ternary and verse–chorus form"
  ],
  steps:[
    { say:"<b>What Does “Binary” Mean?</b> Binary means “made of two parts.” In music, binary form has <b>two main sections</b>, A then B. The letters describe whole sections, not single phrases. \u{1F447} <b>Which pattern represents binary form?</b>",
      show:{ type:"html", html:`<div style="max-width:280px;margin:0 auto;font-size:22px;font-weight:800;letter-spacing:2px;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:14px 18px;text-align:center;color:#243244">A → B</div>` },
      try:{ type:"mc", choices:["A–B","A–B–A","A–B–A–C–A"], answer:0,
        success:"✓ Binary form has two main sections: A and B.",
        fail:"Binary means two — count the section letters.",
        hint:"Two parts, two letters." } },
    { say:"<b>Repeats Do Not Create New Sections.</b> Many binary pieces repeat each section, so a performance may sound like A A B B. That is still <b>two</b> structural sections. \u{1F447} <b>How many main sections does |: A :| |: B :| contain?</b>",
      show:{ type:"html", html:`<div style="max-width:320px;margin:0 auto;font-size:20px;font-weight:800;letter-spacing:1px;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:14px 16px;text-align:center;color:#243244">|: A :| &nbsp; |: B :|<br><span style="font-weight:400;font-size:13px;color:#667">sounds like A A B B — still two sections</span></div>` },
      try:{ type:"mc", choices:["Two","Three","Four"], answer:0,
        success:"✓ Each section repeats, but the large-scale form is still A–B.",
        fail:"Repeats replay a section; they don't add new ones.",
        hint:"Count the different letters, not the repeats." } },
    { say:"<b>What Happens in Section A?</b> Section A begins in the tonic. It may stay there or move to a related key. In a major-key piece it often moves toward the <b>dominant</b> (I → V). This is a common possibility, not a rule for every piece. \u{1F447} <b>In a major-key binary piece, where does Section A often move?</b>",
      show:{ type:"html", html:`<div style="max-width:260px;margin:0 auto;font-size:20px;font-weight:800;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;color:#243244">I → V<br><span style="font-weight:400;font-size:13px;color:#667">tonic toward dominant</span></div>` },
      try:{ type:"mc", choices:["Toward the dominant","Always toward the subdominant","It never leaves the tonic"], answer:0,
        success:"✓ Many major-key binary pieces move from tonic toward dominant during Section A.",
        fail:"Think of the most common destination a half-step short of home.",
        hint:"Scale degree 5." } },
    { say:"<b>What Happens in Section B?</b> Section B usually begins in the key area A reached. It may develop motives, add contrast, or pass through new harmonies — but its most important job is to <b>bring the music back home</b>. \u{1F447} <b>What commonly happens near the end of Section B?</b>",
      try:{ type:"mc", choices:["The music returns to the tonic","The piece changes permanently to a new key","Section A is repeated note for note"], answer:0,
        success:"✓ Section B normally restores the tonic and completes the form.",
        fail:"What would make the piece sound finished?",
        hint:"Home key." } },
    { say:"<b>Sectional vs Continuous (harmony).</b> In <b>sectional</b> binary, Section A ends with a strong cadence in the TONIC, so it sounds fairly complete. In <b>continuous</b> binary, Section A ends OUTSIDE the tonic (often the dominant), so it leans onward. \u{1F447} <b>Which statement describes sectional binary?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:13.5px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 12px">Sectional</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 12px">Continuous</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:6px 12px;text-align:center">A ends in the TONIC</td><td style="border:1.5px solid #cdd5e1;padding:6px 12px;text-align:center">A ends OUTSIDE the tonic (often V)</td></tr></table>` },
      try:{ type:"mc", choices:["Section A ends strongly in the tonic","Section A must end on V7","Section B never returns to the tonic"], answer:0,
        success:"✓ Sectional binary closes Section A in the home key, so it sounds relatively complete.",
        fail:"Sectional = A comes to rest at home.",
        hint:"Where does A cadence?" } },
    { say:"<b>Follow the Continuous Journey.</b> A common continuous-binary plan in a major key is tonic → dominant, then dominant → tonic. Complete it below. \u{1F447}",
      try:{ type:"custom",
        hint:"A leans to the dominant; B travels home to the tonic.",
        mount:(container,fb)=>MF_L73_journey(container,fb) } },
    { say:"<b>Simple Binary (theme).</b> In <b>simple</b> binary, Section B may borrow motives from A, but there is <b>no clear return of the opening theme</b> near the end. The shape is just A | B. \u{1F447} <b>In simple binary, what does Section B do with the opening theme?</b>",
      show:{ type:"html", html:`<div style="max-width:220px;margin:0 auto;font-size:22px;font-weight:800;letter-spacing:3px;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;color:#243244">A | B</div>` },
      try:{ type:"mc", choices:["It does not clearly bring the opening theme back","It always repeats A exactly","It always changes the time signature"], answer:0,
        success:"✓ Simple binary never gives a clear return of the opening material near the end.",
        fail:"“Simple” = no clear return of the opening theme.",
        hint:"Does the opening come back? No." } },
    { say:"<b>Rounded Binary (theme).</b> In <b>rounded</b> binary, material from the start of A returns near the end of B — a brief homecoming, usually shorter than the original A. The label is A | B A′. \u{1F447} <b>Near the end of Section B, the opening theme returns briefly in the tonic. What type is this?</b>",
      show:{ type:"html", html:`<div style="max-width:260px;margin:0 auto;font-size:22px;font-weight:800;letter-spacing:2px;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;color:#243244">A | B A′</div>` },
      try:{ type:"mc", choices:["Rounded binary","Simple binary","Rondo form"], answer:0,
        success:"✓ Rounded binary brings opening material back near the end of the B section.",
        fail:"A brief return of A inside B has a special name.",
        hint:"“Rounded” off by the opening's return." } },
    { say:"<b>Binary vs Ternary.</b> Rounded binary keeps <b>two</b> repeated sections — the A return lives INSIDE the second section (|: A :| |: B A′ :|). Ternary form has <b>three</b> large sections, A B A, where the last A is a full, standalone return. Sort a few forms. \u{1F447}",
      try:{ type:"custom",
        hint:"Count the LARGE sections; check whether A returns inside B or as its own third section.",
        mount:(container,fb)=>MF_L73_types(container,fb) } },
    { say:"<b>Binary vs Verse–Chorus.</b> A modern song may alternate verse → chorus → verse → chorus (A–B–A–B). Both forms use the letters A and B, but their structures differ, so letters alone don't decide the form. \u{1F447} <b>Does every song containing an A section and a B section use binary form?</b>",
      try:{ type:"mc", choices:["No — you must examine the whole structure, not just the letters","Yes — any A and B means binary form","Only if it is fast"], answer:0,
        success:"✓ Letter labels alone don't determine the form. Verse–chorus repeatedly alternates two song functions; classical binary is two large structural sections.",
        fail:"Letters can be reused by very different forms.",
        hint:"Structure decides, not letters." } }
  ],
  examples:[
    { caption:"Continuous binary: Section A begins in the tonic and ends in the DOMINANT (unfinished); Section B develops the material and returns to the TONIC. The form diagram sits above the notes.",
      mount:(host)=>MF_L73_ex1(host) },
    { caption:"Rounded binary: after the contrasting B material, the opening motive of A returns briefly (A′) to close in the tonic. Listen for that return.",
      mount:(host)=>MF_L73_ex2(host) }
  ],
  exampleHeading:"Listen to a binary example",
  games:[
    { type:"gen-race", title:"Game 1 · Binary Form Sprint (45s)",
      intro:"Sections, repeats, harmony and theme types — race the binary facts!",
      miaIntro:"Two sections, many labels! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Binary form","two main sections: A → B"],
        ["Repeat signs","replay a section — they add no new sections"],
        ["Sectional binary","Section A ends in the tonic"],
        ["Continuous binary","Section A ends outside the tonic"],
        ["Simple binary","no clear return of the opening theme"],
        ["Rounded binary","opening material returns near the end of B"],
        ["Ternary form","three large sections: A B A"],
        ["Tonic","the home key / tonal center"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — binary brilliance!":null },
    { type:"order-tap", title:"Game 2 · Assemble the Repeated Form",
      intro:"Tap the four parts of |: A :| |: B :| in performance order!",
      miaIntro:"A, A, B, B — still two sections! \u{1F3C1}",
      spec:{sequence:["A","A (repeat)","B","B (repeat)"],
        title:"Repeated binary, as performed"},
      result:(stars)=>stars>=2?"Repeats mastered — still two sections!":null },
    { type:"symbol-hunt", title:"Game 3 · Tonic or Dominant?",
      intro:"Section A of continuous binary leans to the dominant — spot each chord when called!",
      miaIntro:"Home chord vs the away chord! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Tonic (I) — the home chord", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Dominant (V) — scale degree 5", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"Subdominant (IV)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Dominant 7th (V7)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Tonic and dominant, spotted on sight!":null },
    { type:"order-tap", title:"Game 4 · Build Rounded Binary",
      intro:"Tap the sections of a rounded binary form in order!",
      miaIntro:"Statement, contrast, and a homecoming! \u{1F3C1}",
      spec:{sequence:["A (opening)","B (contrast)","A′ (opening returns)"],
        title:"Rounded binary: A | B A′"},
      result:(stars)=>stars>=2?"Rounded binary, built!":null }
  ],
  practiceIntro:"20 practice questions — sections, repeats, sectional/continuous and simple/rounded. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Binary","two sections (A→B)"],["Sectional","A ends in the tonic"],["Continuous","A ends outside the tonic"],["Simple","no return of the opening"],["Rounded","opening returns in B"],["Ternary","A B A (three sections)"]], reverse:true}, count:6 },
    { type:"mc", q:"What does “binary” mean?", choices:["Two-part","Three-part","Five-part"], answer:0,
      explain:"Bi = two." },
    { type:"mc", q:"What is the basic pattern of binary form?", choices:["A–B","A–B–A","A–B–A–C–A"], answer:0,
      explain:"Two main sections." },
    { type:"mc", q:"How is repeated binary form commonly written?", choices:["|: A :| |: B :|","A–B–A","A–A–A"], answer:0,
      explain:"Each section repeats; the form is still A–B." },
    { type:"mc", q:"In continuous binary, Section A ends…", choices:["outside the tonic","always in the tonic","without any cadence"], answer:0,
      explain:"Often on the dominant." },
    { type:"mc", q:"In sectional binary, Section A ends…", choices:["in the tonic","always in the dominant","in an unrelated key"], answer:0,
      explain:"A comes to rest at home." },
    { type:"mc", q:"What defines rounded binary form?", choices:["Opening material returns near the end of B","Both sections share one rhythm","Section B is always shorter than A"], answer:0,
      explain:"A brief return of A inside B." },
    { type:"mc", q:"The tonic is…", choices:["the home key or tonal center","the fifth scale degree's chord","a fast tempo"], answer:0,
      explain:"Home base." },
    { type:"truefalse", q:"A A B B means the piece has four main sections.", answer:false,
      explain:"Two sections, each repeated." },
    { type:"truefalse", q:"Section A must always end on V7.", answer:false,
      explain:"A may end in the tonic, dominant, relative major, or another related key." },
    { type:"truefalse", q:"Rounded binary and ternary form are identical.", answer:false,
      explain:"Rounded binary has two sections; ternary has three." },
    { type:"truefalse", q:"Verse–chorus form is always the same as classical binary form.", answer:false,
      explain:"They may share letters but are different designs." }
  ],
  miaQuizIntro:"Quiz! Two sections — then sectional/continuous and simple/rounded.",
  quiz:[
    { type:"mc", q:"What does “binary” mean?", choices:["Two-part","Three-part","Five-part"], answer:0,
      explain:"Bi = two.", hint:"Bi-cycle." },
    { type:"mc", q:"What is the basic pattern of binary form?", choices:["A–B","A–B–A","A–B–A–C–A"], answer:0,
      explain:"Two main sections.", hint:"Two letters." },
    { type:"mc", q:"How is repeated binary form commonly written?", choices:["|: A :| |: B :|","A–B–A","A–A–A"], answer:0,
      explain:"Each section repeats; still A–B.", hint:"Repeat signs around each section." },
    { type:"mc", q:"In continuous binary form, where does Section A end?", choices:["Outside the tonic","Always in the tonic","Without any cadence"], answer:0,
      explain:"Often on the dominant.", hint:"It leans onward." },
    { type:"mc", q:"In sectional binary form, where does Section A end?", choices:["In the tonic","Always in the dominant","In an unrelated key"], answer:0,
      explain:"A comes to rest at home.", hint:"It sounds relatively complete." },
    { type:"mc", q:"What defines rounded binary form?", choices:["Opening material returns near the end of B","Both sections use the same rhythm","Section B is shorter than A"], answer:0,
      explain:"A brief return of A inside B.", hint:"The opening comes back." },
    { type:"mc", q:"Principal difference between rounded binary and ternary form?", choices:["Rounded binary has two main sections; ternary has three","Rounded binary has no tonic","Ternary never repeats material"], answer:0,
      explain:"Two repeated sections vs three large sections.", hint:"Count the LARGE sections." },
    { type:"mc", q:"A piece is |: A :| |: B A′ :|; A begins in D and ends in A; B returns to D and restates the opening. Binary or ternary?", choices:["Binary — two repeated structural sections","Ternary — three large sections","Neither"], answer:0,
      explain:"Two structural sections (the A return lives inside B).", hint:"Where does A return — inside B, or as its own section?" },
    { type:"mc", q:"…and is that piece sectional or continuous?", choices:["Continuous — Section A ends outside the tonic","Sectional — Section A ends in the tonic","Cannot tell"], answer:0,
      explain:"A ends in A major (the dominant of D), outside the tonic.", hint:"Where does A cadence?" },
    { type:"mc", q:"…and is that piece simple or rounded?", choices:["Rounded — opening material returns near the end of B","Simple — no return of the opening","Ternary"], answer:0,
      explain:"The opening theme returns near the end of B.", hint:"Does the opening come back?" },
    { type:"truefalse", q:"Letter labels A and B, by themselves, always mean classical binary form.", answer:false,
      explain:"We must examine the complete structure.", hint:"Verse–chorus also uses A and B." },
    { type:"mc", q:"A verse→chorus→verse→chorus song labeled A–B–A–B…", choices:["is not automatically classical binary form","must be classical binary form","has no form at all"], answer:0,
      explain:"Verse–chorus alternates two song functions; binary is two large sections.", hint:"Same letters, different design." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Sectional","A ends in the tonic"],["Continuous","A ends outside the tonic"],["Simple","no return of A"],["Rounded","A returns in B"]], reverse:true}, count:3 }
  ],
  vocabulary:[
    {term:"Binary Form", def:"A form made of two main sections that usually contrast in melody, harmony, key area, rhythm or texture.", sym:"A → B"},
    {term:"Repeat Signs", def:"Binary pieces often repeat each section (heard as A A B B), but the form still has only two sections, A and B.", sym:"|: A :|  |: B :|"},
    {term:"Sectional Binary", def:"Section A ends with a strong cadence in the TONIC, so it sounds relatively complete.", sym:"A: I → I"},
    {term:"Continuous Binary", def:"Section A ends OUTSIDE the tonic (often the dominant, or the relative major in minor); Section B carries the journey home.", sym:"A: I → V"},
    {term:"Simple Binary", def:"Section B has no clear return of the opening theme near the end.", sym:"A | B"},
    {term:"Rounded Binary", def:"Material from the start of A returns near the end of B — shorter than the original A, so it is still two sections, not ternary.", sym:"A | B A′"}
  ],
  mistakes:[
    "<b>“Section A must always end on V7.”</b> Not so — A may end in the tonic, the dominant, the relative major, or another related key. V or V7 is common, but not mandatory.",
    "<b>“A always rises and B always falls.”</b> Melodic direction does not define form — the organization of the sections does.",
    "<b>“A A B B has four sections.”</b> It contains two sections, each repeated.",
    "<b>“Rounded binary and ternary are identical.”</b> Rounded binary has two repeated sections; ternary has three large sections.",
    "<b>“Verse–chorus form is always binary.”</b> They may both use contrasting material, but they are different formal designs."
  ],
  summary:[
    "✔ Binary form = two main sections: <b>A → B</b>.",
    "✔ Sections often repeat: <b>|: A :| |: B :|</b> — still only two sections.",
    "✔ <b>Sectional</b>: A ends in the tonic · <b>Continuous</b>: A ends outside the tonic.",
    "✔ <b>Simple</b>: no clear return of the opening · <b>Rounded</b>: opening returns near the end of B (A | B A′).",
    "✔ Binary is not ternary (A B A) and not verse–chorus — letters alone don't decide the form."
  ],
  tips:[
    "Say it in one breath: “Binary is two — A then B.” Everything else (sectional, continuous, simple, rounded) just describes HOW those two sections behave.",
    "Sectional vs continuous asks one question: does Section A come to rest at home (sectional) or lean away to the dominant (continuous)?",
    "Rounded binary is the sneaky one — the opening peeks back at the end of B. Because that return is brief and lives inside section two, it is still binary, not ternary.",
    "Next lesson: ternary form — when the whole A section returns as a full third section (A B A)."
  ],
  rewards:{ badge:"Binary Navigator", icon:"\u{1F1E6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Sectional or continuous, simple or rounded — binary form holds no secrets. \u{1F1E6}\u{1F389}",
  miaPass:"Passed! Two sections, four flavors. Next: what if the whole A section returns?",
  mia:{
    hook:{ label:"the welcome",
      explain:"Two contrasting sections: A leaned away toward the dominant, and B brought the music home. Two sections = binary form.",
      play:()=>{[60,64,67,69,67].forEach((m,i)=>MFAudio.tone(m,.4,i*.42,.42));let t=2.4;[74,72,71,69,67,64,60].forEach((m,i)=>MFAudio.tone(m,.38,t+i*.4,.42));} },
    learn:{ label:"binary form",
      explain:"Two sections, A → B, often repeated. A may stay home (sectional) or leave to the dominant (continuous). If A's opening returns near the end of B it is rounded; otherwise simple.",
      hint:"Two sections — then sectional/continuous and simple/rounded.",
      play:()=>{[60,62,64,67].forEach((m,i)=>MFAudio.tone(m,.4,i*.42,.42));[55,59,62].forEach(m=>MFAudio.tone(m,1.2,1.8,.2));} },
    example:{ label:"the examples",
      explain:"Example 1 is continuous binary (A ends on the dominant, B returns to the tonic); example 2 is rounded binary (the opening returns as A′ near the end of B)." },
    game:{ label:"the games",
      explain:"Sprint the facts, assemble the repeated form, spot tonic vs dominant, then build a rounded binary.",
      hint:"Two sections; watch how they behave." },
    quiz:{ label:"this question",
      explain:"A few ideas cover it: binary is two sections; sectional/continuous is about where A ends; simple/rounded is about whether A returns inside B; and letters alone don't decide the form.",
      play:()=>{[67,64,60,64].forEach((m,i)=>MFAudio.tone(m,.42,i*.44,.42));} }
  }
};
