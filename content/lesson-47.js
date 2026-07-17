/* Lesson 47 — Triads (AEMT Book 2, Unit 12)
   Built from drafts/UNIT 12 – Lesson 47.md; AEMT p.74 verified by render.
   Core: chord = 3+ notes together; TRIAD = root + 3rd + 5th; root position =
   all lines or all spaces (snowman); triads can be built on every scale note.
   Uses staff.js chord:true chains (3-note stacks) + quiz.js v5.5 triad-id.
   NOTE: edit by FULL-FILE REWRITE only. */

/* triad builder: press root, third, fifth on the keyboard to stack the snowman */
function MF_L47_build(container,fb){
  const ROUNDS=[
    {root:"C",m:[60,64,67],letters:["C","E","G"]},
    {root:"F",m:[65,69,72],letters:["F","A","C"]},
    {root:"G",m:[67,71,74],letters:["G","B","D"]},
    {root:"D",m:[62,65,69],letters:["D","F","A"]}];
  const PART=["root","3rd","5th"];
  let r=0,k=0,kb=null,got=[],off=0;
  container.innerHTML=`<div class="big-q l47-q" style="text-align:center"></div>
    <div class="l47-staff"></div><div class="l47-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">Root → skip a letter → 3rd → skip a letter → 5th. Every other white key!</p>`;
  const q=container.querySelector(".l47-q"), holder=container.querySelector(".l47-staff"), kbHolder=container.querySelector(".l47-kb");
  function drawStaff(){
    const cur=ROUNDS[r];
    const notes=got.map((L2,ix)=>{ const o=String(Math.floor((cur.m[ix]+off)/12)-1); return ix===0?{p:L2+o,d:"w"}:{p:L2+o,d:"w",chord:true}; });
    if(notes.length) Staff.render(holder,{clef:"treble",notes,width:180}); else holder.innerHTML="";
  }
  function ask(){
    const cur=ROUNDS[r]; k=0; got=[]; off=0; drawStaff();
    q.innerHTML=`Build ${r+1} of ${ROUNDS.length}: stack the <b>${cur.root} triad</b> — press its <b>root</b> first.`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:2,labels:true,
      onKey:m=>{
        const c=ROUNDS[r];
        if(k===0 && (m-c.m[0])%12===0 && m+(c.m[2]-c.m[0])<=84) off=m-c.m[0];
        if(m===c.m[k]+off && !(k===0 && (m-c.m[0])%12!==0)){
          got.push(c.letters[k]); kb.mark(c.m.slice(0,k+1).map(x=>x+off)); MFAudio.tone(m,.5,0,.5); drawStaff(); k++;
          if(k>=3){ MFAudio.tone(c.m[0]+off,.9,.15,.4); MFAudio.tone(c.m[1]+off,.9,.15,.4); MFAudio.tone(c.m[2]+off,.9,.15,.4); r++;
            if(r>=ROUNDS.length){ q.textContent="Four snowmen built!";
              fb(true,`✓ ${c.letters.join("-")} — root, 3rd, 5th. Every triad is the same recipe: a note, skip one, another, skip one, one more.`); }
            else { fb(true,`✓ The ${c.root} triad: ${c.letters.join("-")}! Hear it ring. Next…`); setTimeout(ask,1600); } }
          else { q.innerHTML=`Good — now the <b>${PART[k]}</b> of the ${c.root} triad.`; } }
        else { MFAudio.tone(40,.2); fb(false, k===0? `The root IS the name: press ${c.root}.` : `Skip exactly one letter from ${c.letters[k-1]} — land on ${c.letters[k]}.`); }
      }});
  }
  ask();
}

LESSON_CONTENT[47]={
  welcome:"Until today, notes took turns. Now they sound together: welcome to CHORDS. \u{1F3B6}",
  hook:{
    say:"One note… two notes… THREE. Press the buttons in order. <b>When does it start sounding like harmony?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-1">▶ One note</button>
          <button class="play hk-2">▶ Two notes</button>
          <button class="play hk-3">▶ Three notes</button></div>
          <div class="choices hk-ch" style="display:none"><button>Three — a full, rich CHORD appeared</button><button>One — a single note is harmony</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let h3=false;
        container.querySelector(".hk-1").onclick=()=>MFAudio.tone(60,.9,0,.5);
        container.querySelector(".hk-2").onclick=()=>{MFAudio.tone(60,.9,0,.42);MFAudio.tone(64,.9,0,.42);};
        container.querySelector(".hk-3").onclick=()=>{MFAudio.tone(60,1.1,0,.4);MFAudio.tone(64,1.1,0,.4);MFAudio.tone(67,1.1,0,.4); h3=true; setTimeout(()=>ch.style.display="",1300);};
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(!h3){ fb(false,"Press all three buttons first!"); return; }
          if(i===0) fb(true,"✓ Three notes sounding together = a CHORD — and this one (C-E-G: root, 3rd, 5th) is the most important chord shape in music: the TRIAD.");
          else fb(false,"One note is a melody's atom — harmony needs company.");
        });
      } }
  },
  objectives:[
    "Define a chord (3+ notes together)",
    "Define a triad: root + 3rd + 5th",
    "Name the root of any root-position triad",
    "Spot the all-lines / all-spaces triad shape",
    "Build triads on any scale note",
    "Read triads in treble and bass clef"
  ],
  steps:[
    { say:"Definitions first. <b>Three or more notes sounded together = a CHORD.</b> The star chord of all music: a 3-note chord built of a <b>ROOT, a 3rd, and a 5th</b> — the <b>TRIAD</b>. \u{1F447} <b>A triad consists of…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"root"},{p:"E4",d:"w",label:"3rd"},{p:"G4",d:"w",label:"5th"},{bar:"double"},
        {p:"C4",d:"w",label:"the triad"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["Root + 3rd + 5th","Root + 2nd + 4th","Any three random notes"], answer:0,
        success:"✓ Root, then a 3rd above, then a 5th above the root — the triad recipe never changes.",
        fail:"Measure both intervals UP from the bottom note…",
        hint:"The two intervals you mastered in Unit 8-9." } },
    { say:"The <b>ROOT</b> gives the triad its <b>name</b>. Build up from C → C triad. From G → G triad. Measure a 3rd and a 5th upward from the root and you're done. \u{1F447} <b>A triad built on F is called…?</b>",
      try:{ type:"mc", choices:["The F triad","The C triad","A root triad"], answer:0,
        success:"✓ Root = name. F-A-C is the F triad, wherever it appears.",
        fail:"Which note did the triad grow from?",
        hint:"Bottom note of the stack (in root position)." } },
    { say:"Now the reading shortcut. In <b>ROOT POSITION</b> a triad takes <b>every other note</b> (C-E-G, D-F-A, E-G-B…) — so on the staff it's <b>ALL LINES or ALL SPACES</b> — a neat stack! \u{1F447} <b>A root-position triad on the staff looks like…?</b>",
      show:{ type:"staff", spec:{clef:"bass",tempo:60,notes:[
        {p:"G2",d:"w",x:160,label:"lines"},{p:"B2",d:"w",chord:true},{p:"D3",d:"w",chord:true},
        {p:"A2",d:"w",x:360,label:"spaces"},{p:"C3",d:"w",chord:true},{p:"E3",d:"w",chord:true}],width:480} },
      try:{ type:"mc", choices:["All lines, or all spaces — a neat stack","One line, one space, one line","Notes side by side"], answer:0,
        success:"✓ Skip-a-letter spacing = matching staff positions. If the stack mixes lines AND spaces, it's not in root position!",
        fail:"Skip-one-letter notes land on matching positions…",
        hint:"Remember the odd-interval rule from L33." } },
    { say:"Hands on — stack some triads. \u{1F447} <b>Build each triad on the keyboard, bottom to top:</b>",
      try:{ type:"custom",
        hint:"Press the root, skip a white key, press the 3rd, skip again, the 5th.",
        mount:(container,fb)=>MF_L47_build(container,fb) } },
    { say:"Triads grow on <b>every</b> note of the scale. Here are all the root-position triads of C major — one per scale note, C through C. Press play and hear the whole neighborhood. \u{1F447} <b>How many different triads live in one octave of a major scale?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"D"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"E"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"F"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"G"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A4",d:"w",label:"A"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"B4",d:"w",label:"B"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:640} },
      try:{ type:"mc", choices:["Seven — one per letter name","Three","Twelve"], answer:0,
        success:"✓ C D E F G A B — seven roots, seven triads (the octave C repeats the first).",
        fail:"One triad per scale letter…",
        hint:"How many letters in the musical alphabet?" } },
    { say:"Root-spotting drill — the skill every chord reader needs. \u{1F447} <b>In root position, the root is the BOTTOM note. Name it:</b>",
      try:{ type:"mc",
        staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:200},
        choices:["G — so this is the G triad","D — the top note names it","B — the middle note"], answer:0,
        success:"✓ Bottom note G → the G triad (G-B-D). Read triads from the bottom up!",
        fail:"Root position: the name lives at the BOTTOM.",
        hint:"Which note is at the bottom of the stack?" } }
  ],
  examples:[
    { caption:"The C major scale (the ingredients) followed by the C triad (the recipe): scale notes 1, 3, and 5 stacked into one sound.",
      staff:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{p:"G4",d:"q",label:"5"},{p:"A4",d:"q",label:"6"},{p:"B4",d:"q",label:"7"},{p:"C5",d:"q",label:"8"},{bar:"double"},
        {p:"C4",d:"w",label:"C triad"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:660},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"The same C triad in bass clef and treble clef — all lines in one, all spaces in the other, root C at the bottom of both.",
      staff:{clef:"grand",tempo:60,notes:[
        {p:"C4",d:"w",clef:"treble"},{p:"E4",d:"w",chord:true,clef:"treble"},{p:"G4",d:"w",chord:true,clef:"treble"},
        {p:"C3",d:"w",clef:"bass"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"}],width:380} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Root Hunter Sprint (45s)",
      intro:"Triads flash on the staff — name each root before time runs out!",
      miaIntro:"Read the bottom of every stack!",
      spec:{gen:"triad-id", params:{}, seconds:45},
      result:(score)=>score>=8?score+" roots hunted — chord reader unlocked!":null },
    { type:"key-climb", title:"Game 2 · Triad Ladder",
      intro:"Climb C-E-G-C: the triad plus its octave, in order, fast!",
      miaIntro:"Root, 3rd, 5th, roof! \u{1FA9C}",
      spec:{seq:[60,64,67,72], names:["C (root)","E (3rd)","G (5th)","C (octave)"], start:60, octaves:1,
        title:"Press C → E → G → C: the triad and its octave"},
      result:(score)=>score!==null?"The triad lives in your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · Triad Hunt",
      intro:"Four stacked shapes — click the triad the round names!",
      miaIntro:"Spot the right triad! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"C triad", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"F triad", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"G triad", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"D triad", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"No triad escapes you!":null },
    { type:"term-race", title:"Game 4 · Chord Vocabulary Race",
      intro:"Chord, triad, root, root position — match the new words at speed!",
      miaIntro:"Stack the vocabulary too! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Chord","three or more notes sounded together"],
        ["Triad","a 3-note chord: root, 3rd, and 5th"],
        ["Root","the note a triad is named after"],
        ["Root position","root on the bottom — all lines or all spaces"],
        ["All lines or all spaces","how a root-position triad looks on the staff"],
        ["C triad","C-E-G"]]},
      result:(score)=>score>=7?"Chord vocabulary: stacked!":null }
  ],
  practiceIntro:"19 practice questions — spelling, roots, triad shapes and clefs. Answer right and the next appears automatically!",
  practice:[
    { gen:"triad-id", params:{}, count:5 },
    { gen:"triad-id", params:{clef:"bass"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Chord","three or more notes sounded together"],["Triad","root + 3rd + 5th"],["Root","the naming note of a triad"],["Root position","all lines or all spaces"]], reverse:true}, count:3 },
    { type:"mc", q:"Spell the C triad.", choices:["C-E-G","C-D-E","C-F-A"], answer:0,
      explain:"Root C, 3rd E, 5th G — every other letter." },
    { type:"mc", q:"Spell the D triad.", choices:["D-F-A","D-E-F","D-G-B"], answer:0,
      explain:"Skip a letter twice: D-F-A." },
    { type:"mc", q:"Spell the E triad.", choices:["E-G-B","E-F-G","E-A-C"], answer:0,
      explain:"E-G-B — every other letter from E." },
    { type:"mc", q:"A chord is defined as…", choices:["three or more notes sounded together","two notes in a row","any loud note"], answer:0,
      explain:"Three-plus, together." },
    { type:"truefalse", q:"In root position, all notes are on lines or all are in spaces.", answer:true,
      explain:"All lines or all spaces — skip-a-letter spacing." },
    { type:"truefalse", q:"The root of a root-position triad is the top note.", answer:false,
      explain:"The BOTTOM note names it." },
    { type:"mc", q:"Triads may be built on…", choices:["any note of the scale","only the keynote","only lines"], answer:0,
      explain:"Seven scale notes, seven triads." },
    { type:"mc", q:"To build a triad, you measure ____ upward from the root.", choices:["a 3rd and a 5th","a 2nd and a 4th","two octaves"], answer:0,
      explain:"Root + 3rd + 5th." }
  ],
  miaQuizIntro:"Stack 'em up — root, third, fifth! Final quiz!",
  quiz:[
    { type:"mc", q:"When three or more notes are sounded together, the combination is called a…", choices:["chord","interval","scale","cluster"], answer:0,
      explain:"The definition of a chord.", hint:"Three-plus, together." },
    { type:"mc", q:"A triad consists of a…", choices:["root, 3rd, and 5th","root, 2nd, and 4th","root, 4th, and 6th","root and two octaves"], answer:0,
      explain:"The eternal triad recipe.", hint:"Skip-a-letter twice." },
    { type:"mc", q:"The triad gets its NAME from its…", choices:["root","3rd","5th","key signature"], answer:0,
      explain:"Root = name.", hint:"The note it grew from." },
    { type:"truefalse", q:"In root position, a triad's notes are all on lines or all in spaces.", answer:true,
      explain:"A neat stack — all lines or all spaces.", hint:"Every-other-letter spacing." },
    { type:"truefalse", q:"A triad can only be built on the first note of a scale.", answer:false,
      explain:"Every scale note grows one.", hint:"Seven letters, seven triads." },
    { type:"mc", q:"Name this triad.",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:200},
      choices:["F triad","A triad","C triad"], answer:0,
      explain:"Bottom note F → F-A-C.", hint:"Root position: read the bottom." },
    { type:"mc", q:"Name this triad.",
      staff:{clef:"bass",notes:[{p:"G2",d:"w"},{p:"B2",d:"w",chord:true},{p:"D3",d:"w",chord:true}],width:200},
      choices:["G triad","B triad","D triad"], answer:0,
      explain:"G-B-D from the bass clef's G line.", hint:"Same rule, lower clef." },
    { type:"mc", q:"The E triad is spelled…", choices:["E-G-B","E-F-G","E-A-B","E-G-A"], answer:0,
      explain:"Every other letter from E.", hint:"Skip F, skip A." },
    { type:"mc", q:"Which is NOT part of the C triad?", choices:["D","C","E","G"], answer:0,
      explain:"C-E-G — D is skipped.", hint:"Spell it: C, skip, skip." },
    { type:"mc", q:"A root-position triad never looks like…", choices:["a mix of lines AND spaces","all lines","all spaces"], answer:0,
      explain:"Mixed positions mean it's NOT root position.", hint:"Snowmen match their floors." },
    { type:"mc", q:"In the C major scale, how many root-position triads can be built (one octave)?", choices:["7","3","12"], answer:0,
      explain:"One per scale letter.", hint:"Count the letters." },
    { type:"mc", q:"The intervals from the root UP to the other triad notes are…", choices:["a 3rd and a 5th","a 2nd and a 3rd","a 4th and a 6th"], answer:0,
      explain:"Root→3rd, root→5th.", hint:"The triad recipe." },
    /* generated */
    { gen:"triad-id", params:{}, count:4 },
    { gen:"triad-id", params:{clef:"bass"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Chord","three or more notes sounded together"],["Triad","root + 3rd + 5th"],["Root","the naming note"],["Root position","all lines or all spaces"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Chord", def:"Three or more notes sounded together."},
    {term:"Triad", def:"A 3-note chord consisting of a root, a 3rd, and a 5th.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Root", def:"The note from which the triad gets its name — the bottom note in root position."},
    {term:"Root Position", def:"A triad arranged root-3rd-5th from the bottom: all notes on lines, or all in spaces.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:130}}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Chord</b> = 3+ notes together; <b>triad</b> = the 3-note chord of <b>root + 3rd + 5th</b>.",
    "✔ The <b>root names the triad</b> — C-E-G is the C triad.",
    "✔ Root position on the staff = <b>all lines or all spaces</b> — a neat stack.",
    "✔ Triads grow on <b>every</b> scale note: seven letters, seven triads.",
    "✔ Spelling shortcut: start at the root and take every other letter."
  ],
  tips:[
    "Practice spelling triads from any letter out loud: 'B-D-F! A-C-E! F-A-C!' — speed comes fast.",
    "At the piano, root-position triads are every-other-white-key — one hand position, seven chords.",
    "If a stack mixes a line note with space notes, suspect an inversion (that story comes later).",
    "Next lesson: the three VIP triads of every key — I, IV, and V, the primary chords."
  ],
  rewards:{ badge:"Chord Stacker", icon:"\u{1F9F1}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score, stacked clean — root, 3rd, 5th! \u{1F389}",
  miaPass:"Passed! Keep chanting the recipe: root, 3rd, 5th.",
  mia:{
    hook:{ label:"the welcome",
      explain:"One note was melody; two made an interval; THREE made a chord — specifically the C triad: root C, 3rd E, 5th G.",
      play:()=>{MFAudio.tone(60,.5,0,.5);MFAudio.tone(60,.5,.7,.4);MFAudio.tone(64,.5,.7,.4);MFAudio.tone(60,.9,1.5,.38);MFAudio.tone(64,.9,1.5,.38);MFAudio.tone(67,.9,1.5,.38);} },
    learn:{ label:"triads",
      explain:"Chord = 3+ together. Triad = root + 3rd + 5th; the root names it; root position stacks all-lines or all-spaces; one triad grows on every scale note.",
      hint:"Every other letter, three times.",
      play:()=>{MFAudio.tone(60,.8,0,.4);MFAudio.tone(64,.8,0,.4);MFAudio.tone(67,.8,0,.4);} },
    example:{ label:"the examples",
      explain:"Example 1 pulls scale notes 1-3-5 into the C triad; example 2 shows the same triad wearing both clefs." },
    game:{ label:"the games",
      explain:"Hunt roots at speed, climb the triad ladder, spot snowmen, then race the vocabulary.",
      hint:"Root position: the name is always at the bottom." },
    quiz:{ label:"this question",
      explain:"Root + 3rd + 5th, named from the bottom, all-lines-or-all-spaces — three facts cover the whole quiz.",
      play:()=>{MFAudio.tone(65,.7,0,.4);MFAudio.tone(69,.7,0,.4);MFAudio.tone(72,.7,0,.4);} }
  }
};
