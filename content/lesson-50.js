/* Lesson 50 — The V7 (Dominant 7th) Chord (AEMT Book 2, Unit 12) — BOOK 2 FINALE
   Built from drafts/UNIT 12 – Lesson 50.md; AEMT p.77 verified by render.
   Core: V7 = V triad + minor 7th above the root (= m3 above the 5th);
   4 notes → a CHORD, not a triad; the 5th is often omitted (3 voices);
   the primary chords become I, IV, V7. In C major: G7 = G-B-D-F.
   NOTE: edit by FULL-FILE REWRITE only. */

/* V7 factory: build G7 note by note on the keyboard */
function MF_L50_factory(container,fb){
  const STEPS=[
    {m:67,name:"G — the root (degree 5, the dominant)"},
    {m:71,name:"B — the 3rd"},
    {m:74,name:"D — the 5th"},
    {m:77,name:"F — the MINOR 7th above the root: the new ingredient!"}];
  let k=0,kb=null;
  container.innerHTML=`<div class="big-q l50-q" style="text-align:center"></div>
    <div class="l50-staff"></div><div class="l50-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">G to F = 10 half steps = a minor 7th. That little dissonance is V7's engine!</p>`;
  const q=container.querySelector(".l50-q"), holder=container.querySelector(".l50-staff"), kbHolder=container.querySelector(".l50-kb");
  function drawStaff(){
    const PS=["G4","B4","D5","F5"];
    const notes=PS.slice(0,k).map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true});
    if(notes.length) Staff.render(holder,{clef:"treble",notes,width:180}); else holder.innerHTML="";
  }
  function ask(){ q.innerHTML=`Build G7, note ${k+1} of 4: press <b>${STEPS[k].name.split(" — ")[0]}</b>.`; }
  kb=Keyboard.create(kbHolder,{start:60,octaves:2,labels:true,
    onKey:m=>{
      if(m===STEPS[k].m){
        kb.mark(STEPS.slice(0,k+1).map(s=>s.m)); MFAudio.tone(m,.5,0,.5); k++; drawStaff();
        if(k>=4){ STEPS.forEach(s=>MFAudio.tone(s.m,1.1,.2,.32)); q.textContent="G7 assembled — hear that lean!";
          fb(true,"✓ G-B-D-F: the V triad plus a minor 7th. FOUR notes make it a CHORD (not a triad) — and that F leans hungrily toward the I chord."); }
        else { fb(true,`✓ ${STEPS[k-1].name}. Next…`); ask(); } }
      else { MFAudio.tone(40,.2); fb(false, k===3? "The 7th is a minor 7th above G — count 10 half steps (or a m3 above D)." : `${STEPS[k].name.split(" — ")[0]} — build the plain V triad first.`); }
    }});
  ask();
}

/* resolution lab: V7 → I vs V7 → nowhere */
function MF_L50_resolve(container,fb){
  let hA=false,hB=false;
  container.innerHTML=`<div class="big-q" style="text-align:center">Listen to both endings. Which one sounds finished? Why?</div>
    <div style="text-align:center">
      <button class="play l50-a">▶ Ending A: V7 → I</button>
      <button class="play l50-b">▶ Ending B: V7 (stops on the dominant)</button></div>
    <div class="choices l50-ch" style="display:none"><button>Ending A — the tritone resolved to the tonic (I), so it sounds finished</button><button>Ending B — stopping on the dominant felt complete</button></div>`;
  const ch=container.querySelector(".l50-ch");
  container.querySelector(".l50-a").onclick=()=>{
    [67,71,74,77].forEach(m=>MFAudio.tone(m,.8,0,.3));
    [60,64,67,72].forEach(m=>MFAudio.tone(m,1.4,.9,.35));
    hA=true; if(hB) setTimeout(()=>ch.style.display="",2400);
  };
  container.querySelector(".l50-b").onclick=()=>{
    [67,71,74,77].forEach(m=>MFAudio.tone(m,1.6,0,.3));
    hB=true; if(hA) setTimeout(()=>ch.style.display="",1800);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(i===0) fb(true,"✓ V7 → I is music's most powerful arrival: the leading tone (B) rises to C, the 7th (F) sinks to E, and home never felt so earned. Composers end pieces with it constantly.");
    else fb(false,"Play Ending B again — the B and F of the tritone are left hanging, so the music feels unfinished.");
  });
}

LESSON_CONTENT[50]={
  welcome:"The V chord saves its best trick for last: a 7th! \u{1F386}",
  hook:{
    say:"Two versions of the classic ending. One uses the plain V triad; the other has an added 7th that makes the arrival irresistible. <b>Which ending pulls home harder?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Ending 1: V → I</button>
          <button class="play hk-b">▶ Ending 2: V? → I</button></div>
          <div class="choices hk-ch" style="display:none"><button>Ending 2 — the extra note leaned harder into home</button><button>Ending 1 — three notes pull more than four</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [67,71,74].forEach(m=>MFAudio.tone(m,.8,0,.33)); [60,64,67].forEach(m=>MFAudio.tone(m,1.2,.9,.38)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2300); };
        container.querySelector(".hk-b").onclick=()=>{ [67,71,74,77].forEach(m=>MFAudio.tone(m,.8,0,.3)); [60,64,67,72].forEach(m=>MFAudio.tone(m,1.2,.9,.35)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ The added note was F — a minor 7th above G — turning V into V7, the DOMINANT SEVENTH chord. That extra lean is today's whole lesson!");
          else fb(false,"Play both once more — which second chord ACHES before resolving?");
        });
      } }
  },
  objectives:[
    "Build a V7: V triad + minor 7th above the root",
    "Explain why V7 is a chord, not a triad (4 notes)",
    "Spell G7 in C major: G-B-D-F",
    "Know the alternate recipe: minor 3rd above the 5th",
    "Understand the omitted-5th version",
    "Update the primary chords to I, IV, V7"
  ],
  steps:[
    { say:"The recipe: take the <b>V (dominant) triad</b> and add a <b>minor 7th above the root</b>. In C major: G-B-D + <b>F</b> = <b>G7</b>, the V7 chord. Equivalent shortcut: add a <b>minor 3rd above the 5th</b> (D→F). \u{1F447} <b>V7 = V triad + …?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"G4",d:"w",x:170,label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"G4",d:"w",x:390,label:"V7 = G-B-D-F"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:520} },
      try:{ type:"mc", choices:["A minor 7th above the root","A Major 7th above the root","Another perfect 5th"], answer:0,
        success:"✓ Minor 7th (G→F = 10 half steps). A MAJOR 7th would give F♯ — a very different, dreamier chord.",
        fail:"G up to F — count the half steps: 10 = which interval from Unit 9?",
        hint:"m7, not M7." } },
    { say:"Terminology check: with <b>FOUR notes</b>, V7 is officially a <b>CHORD but not a triad</b> — triads have exactly three. Its full name: the <b>DOMINANT SEVENTH</b> chord. \u{1F447} <b>Why isn't V7 a triad?</b>",
      try:{ type:"mc", choices:["It has 4 notes — triads have exactly 3","It's too loud","It has no root"], answer:0,
        success:"✓ Tri- = three. Root, 3rd, 5th, PLUS 7th = four voices = a seventh chord.",
        fail:"Count the noteheads in the stack…",
        hint:"Tri- means…" } },
    { say:"Build it yourself, note by note. \u{1F447} <b>Assemble G7 on the keyboard:</b>",
      try:{ type:"custom",
        hint:"G, B, D — then the m7: F.",
        mount:(container,fb)=>MF_L50_factory(container,fb) } },
    { say:"Why add the 7th? The added 7th (<b>F</b>) forms a <b>tritone</b> with <b>B</b>, the chord's 3rd. This unstable interval creates tension that naturally wants to resolve to the tonic (I): B rises to C, F falls to E. \u{1F447} <b>Listen to both examples and decide which ending feels complete:</b>",
      try:{ type:"custom",
        hint:"Which ending could you actually END a piece with?",
        mount:(container,fb)=>MF_L50_resolve(container,fb) } },
    { say:"Practical Tip: in a <b>3-voice V7, the 5th is usually omitted</b>. Instead of G\u2013B\u2013D\u2013F, we often play <b>G\u2013B\u2013F</b>. The chord still sounds like V7. \u{1F447} <b>Which note is missing in the 3-voice V7?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"G4",d:"w",x:170,label:"full V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"G4",d:"w",x:400,label:"5th omitted"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:540} },
      try:{ type:"mc", choices:["The 5th (D)","The 7th (F)","The root (G)"], answer:0,
        success:"✓ The 5th (D) is left out — the root, 3rd and 7th carry the chord's character, so G\u2013B\u2013F still sounds like V7.",
        fail:"Drop the 7th and it's not a 7th chord at all!",
        hint:"Keep the name-note, the quality-note, and the tension-note." } },
    { say:"A Common Chord Group: in many songs, the three most common harmonic functions are <b>I, IV, and V7</b>. Together, they create a strong sense of <b>home, movement, and resolution</b>. \u{1F447} <b>Which three chords make up this common progression?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",x:140,label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",x:310,label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",x:480,label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:580} },
      try:{ type:"mc", choices:["I, IV, and V7","I, ii, and V7","I7, IV7, and V7"], answer:0,
        success:"✓ I, IV, V7 — home, movement, resolution: the harmonization toolkit for everything ahead. Take a bow! \u{1F386}",
        fail:"Only the DOMINANT gets the 7th upgrade (for now).",
        hint:"One chord earned a 7; two stayed triads." } }
  ],
  examples:[
    { caption:"V grows into V7: the dominant triad, then the same chord with its minor 7th — hear the tension arrive with the F.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"G4",d:"w",x:170,label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"G4",d:"w",x:390,label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:520},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"The upgraded primary chords — I, IV, V7, and the triumphant return to I: home, movement, and resolution in one cadence.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:640} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · V7 Fact Sprint (45s)",
      intro:"Everything V7 — recipes, spellings, omissions — at top speed!",
      miaIntro:"The final sprint of the lesson! \u{1F386}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["V7 chord","the V triad + a minor 7th above the root"],
        ["G7 in C major","G-B-D-F"],
        ["Why V7 is not a triad","it has 4 notes"],
        ["Often omitted from V7","the 5th"],
        ["The alternate recipe","a minor 3rd above the 5th"],
        ["The upgraded primary chords","I, IV, and V7"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" facts — dominant mastery!":null },
    { type:"key-climb", title:"Game 2 · G7 Ladder",
      intro:"Climb G-B-D-F in order — the dominant seventh under your fingers!",
      miaIntro:"Four notes to the top! \u{1FA9C}",
      spec:{seq:[67,71,74,77], names:["G (root)","B (3rd)","D (5th)","F (m7!)"], start:60, octaves:2,
        title:"Press G → B → D → F: the G7 chord"},
      result:(score)=>score!==null?"G7 climbed and conquered!":null },
    { type:"symbol-hunt", title:"Game 3 · Seventh Spotter",
      intro:"Triads and seventh chords mixed — click what each round names!",
      miaIntro:"Count the noteheads! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"V7 (G-B-D-F)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}},
        {label:"V (G-B-D)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"I (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"V7, 5th omitted", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No seventh slips past you!":null },
    { type:"term-race", title:"Game 4 · GRAND REVIEW Race",
      intro:"The victory lap: chords, intervals, meters — highlights from Lessons 26–50!",
      miaIntro:"Everything you've learned — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["V7","the dominant seventh chord"],
        ["Triad","root + 3rd + 5th"],
        ["Primary chords (final form)","I, IV, and V7"],
        ["Perfect intervals","unison, 4th, 5th, octave"],
        ["Minor interval","a Major interval lowered a half step"],
        ["Triplet","3 notes in the time of 2"],
        ["6/8 time","six eighth-beats in two bundles"],
        ["Cut time","2/2 — alla breve"],
        ["Leading tone","degree 7 — pulls to the tonic"],
        ["Circle of fifths","the key-signature map from Unit 8"]]},
      result:(score)=>score>=8?"REVIEW CHAMPION — inversions await in Lesson 51!":null }
  ],
  practiceIntro:"16 practice questions — recipes, spellings, omissions and the big finale review. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["V7","V triad + minor 7th above the root"],["G7","G-B-D-F"],["Not a triad because","V7 has four notes"],["Often omitted","the 5th of V7"]], reverse:true}, count:4 },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 },
    { type:"mc", q:"To build a V7 chord, add a ____ above the root of the V triad.", choices:["minor 7th","Major 7th","Perfect 8th"], answer:0,
      explain:"G→F = m7." },
    { type:"mc", q:"Equivalently, add a ____ above the 5th of the V triad.", choices:["minor 3rd","Major 3rd","Perfect 4th"], answer:0,
      explain:"D→F = m3 — same F either way." },
    { type:"mc", q:"In C major, V7 is spelled…", choices:["G-B-D-F","G-B-D-F♯","G-A-B-C"], answer:0,
      explain:"The G7 chord." },
    { type:"mc", q:"V7 is a chord but NOT a triad because…", choices:["it has 4 notes","it has no root","it uses a flat"], answer:0,
      explain:"Triads are exactly three notes." },
    { type:"mc", q:"When the 5th of V7 is omitted, the remaining notes are…", choices:["G-B-F","G-D-F","B-D-F"], answer:0,
      explain:"Root + 3rd + 7th keep the chord's identity." },
    { type:"truefalse", q:"Omitting the 5th destroys the V7's seventh-chord quality.", answer:false,
      explain:"It RETAINS the quality — the 5th is the dispensable note." },
    { type:"truefalse", q:"After this lesson, the three primary chords are I, IV, and V7.", answer:true,
      explain:"The dominant almost always brings its 7th." },
    { type:"mc", q:"The tension inside V7 comes partly from B and F forming…", choices:["a tritone (dim 5th)","a perfect 5th","an octave"], answer:0,
      explain:"The B–F tritone (the unstable interval from Lesson 37) naturally wants to resolve to I." },
    { type:"mc", q:"V7 resolves most naturally to…", choices:["I","IV","vii"], answer:0,
      explain:"Dominant → tonic: music's strongest arrival." }
  ],
  miaQuizIntro:"The final quiz of the unit — bring everything. G-B-D-F and go!",
  quiz:[
    { type:"mc", q:"A V7 chord is built by adding a minor 7th above the root of…", choices:["the V (dominant) triad","the I (tonic) triad","the IV triad","any minor triad"], answer:0,
      explain:"Dominant + m7 = dominant seventh.", hint:"Its other name says it." },
    { type:"mc", q:"In C major, the V7 chord is…", choices:["G-B-D-F","G-B-D","C-E-G-B","F-A-C-E"], answer:0,
      explain:"G7 — the G triad plus F.", hint:"Root on degree 5." },
    { type:"mc", q:"V7 is called a CHORD and not a triad because…", choices:["it contains 4 notes rather than 3","it is played loudly","its notes are all on lines"], answer:0,
      explain:"Four voices = seventh chord.", hint:"Tri- = 3." },
    { type:"mc", q:"The interval from the ROOT of V7 up to its 7th is…", choices:["a minor 7th","a Major 7th","a Perfect octave"], answer:0,
      explain:"G→F = 10 half steps = m7.", hint:"NOT F♯!" },
    { type:"mc", q:"The interval from the 5TH of the V triad up to the added 7th is…", choices:["a minor 3rd","a Major 3rd","a Perfect 4th"], answer:0,
      explain:"D→F = 3 half steps.", hint:"The alternate recipe." },
    { type:"truefalse", q:"The 5th of the V7 chord is often omitted.", answer:true,
      explain:"G-B-F still sounds fully like G7.", hint:"Which note adds bulk, not flavor?" },
    { type:"truefalse", q:"With the 5th omitted, V7 can be performed by just three singers.", answer:true,
      explain:"A practical reason for the omission.", hint:"Three voices, three notes." },
    { type:"mc", q:"Name this chord (key of C).",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:200},
      choices:["V7 (G7)","V (G triad)","I7"], answer:0,
      explain:"Four notes from G: G-B-D-F.", hint:"Count the noteheads first." },
    { type:"mc", q:"Name this chord (key of C).",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:200},
      choices:["V7 with the 5th omitted","An error — chords need stacked 3rds only","IV"], answer:0,
      explain:"G-B-F: root, 3rd, 7th — G7 minus its D.", hint:"What's missing from G-B-D-F?" },
    { type:"mc", q:"The three primary chords, in their upgraded form, are…", choices:["I, IV, and V7","I, IV, and V","I7, IV, and V"], answer:0,
      explain:"The dominant brings its 7th from now on.", hint:"One upgrade only." },
    { type:"mc", q:"V7 most naturally resolves to…", choices:["the I chord","the IV chord","another V7","silence"], answer:0,
      explain:"Leading tone up, 7th down — home.", hint:"Where did the resolution lab land?" },
    { type:"mc", q:"Why does V7 pull harder toward I than plain V?", choices:["The added 7th creates extra tension (a tritone with the 3rd)","It is played faster","Four notes are louder than three"], answer:0,
      explain:"The B–F tritone is unstable and naturally resolves: B up to C, F down to E.", hint:"An unstable interval (a tritone) hides between the chord's 3rd and 7th." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["V7","V triad + minor 7th above the root"],["G7 in C major","G-B-D-F"],["Omittable note of V7","the 5th"],["Primary chords (final)","I, IV, V7"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { gen:"degree-name", params:{ask:"name"}, count:1 }
  ],
  vocabulary:[
    {term:"V7 (Dominant Seventh) Chord", def:"The V triad plus a minor 7th above its root — four notes, used in many pieces instead of the plain V triad.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:130}},
    {term:"G7", def:"The V7 chord of C major: G-B-D-F."},
    {term:"Omitted 5th", def:"V7 is often written without its 5th (G-B-F) — three voices can perform it, and the 7th-chord quality remains.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:130}},
    {term:"Primary Chords (final form)", def:"I, IV, and V7 — the harmonization toolkit for the lessons ahead."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>V7 = V triad + minor 7th above the root</b> (or m3 above the 5th): in C major, <b>G-B-D-F = G7</b>.",
    "✔ Four notes → a <b>chord</b>, not a triad.",
    "✔ The <b>5th is often omitted</b> (G-B-F) — the quality survives; three voices suffice.",
    "✔ The primary chords are now <b>I, IV, V7</b>.",
    "✔ V7's tritone (3rd + 7th) makes dominant → tonic music's strongest resolution. <b>LESSONS 26–50 COMPLETE!</b> \u{1F386}"
  ],
  tips:[
    "Every 'bluesy' chord you've ever heard is a cousin of V7 — dominant sevenths run the blues.",
    "Voice-leading preview: in V7 → I, the leading tone rises (B→C) while the 7th falls (F→E). Two half steps do all the magic.",
    "Play I → IV → V7 → I daily. It is the single most useful progression you will ever own.",
    "Congratulations — the first 50 lessons are yours! Next up: chord inversions, minor scales, and beyond. \u{1F386}"
  ],
  rewards:{ badge:"Dominant Master", icon:"\u{1F386}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score on the V7 finale — I could not be prouder! \u{1F386}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — the V7 chord is yours! G-B-D-F forever. \u{1F386}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Ending 1 was V → I; ending 2 added F to make V7 → I — the minor 7th that turns a nice arrival into an inevitable one.",
      play:()=>{[67,71,74,77].forEach(m=>MFAudio.tone(m,.8,0,.3));[60,64,67,72].forEach(m=>MFAudio.tone(m,1.2,.9,.35));} },
    learn:{ label:"the V7 chord",
      explain:"V triad + m7 above the root = V7 (G-B-D-F in C). Four notes = chord, not triad. The 5th is expendable; the 7th is the point. Primary chords: I, IV, V7.",
      hint:"G-B-D-F. The F is the magic.",
      play:()=>{[67,71,74,77].forEach(m=>MFAudio.tone(m,1,.1,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 grows V into V7; example 2 plays the full I-IV-V7-I cadence — music's most classic closing sound." },
    game:{ label:"the games",
      explain:"Sprint the facts, climb G7, spot sevenths by eye, then run the grand review race.",
      hint:"Count noteheads first: four = seventh chord." },
    quiz:{ label:"this question",
      explain:"Everything reduces to the recipe: G-B-D-F, four notes, m7 on top, 5th optional, resolves to I.",
      play:()=>{[67,71,77].forEach(m=>MFAudio.tone(m,.8,0,.33));[60,64,72].forEach(m=>MFAudio.tone(m,1,1,.38));} }
  }
};
