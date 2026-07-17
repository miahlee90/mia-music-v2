/* Lesson 39 — Sixteenth Notes (AEMT Book 2, Unit 10)
   Built from drafts/UNIT 10 – Lesson 39.md; AEMT p.62 verified by render.
   Core: 4 sixteenths = 1 beat; two flags / two beams; count "1 e & a";
   combos with 8ths (the "1 (e)& a" and "1 e &(a)" figures).
   Uses staff.js v7.6 d:"16" + double beams [[a,b,2]] + stubs.
   NOTE: edit by FULL-FILE REWRITE only. */

/* note family tree: split each value in two until sixteenths appear */
function MF_L39_tree(container,fb){
  const LEVELS=[
    {d:"w",n:1,name:"1 whole note",beats:"4 beats"},
    {d:"h",n:2,name:"2 half notes",beats:"2 beats each"},
    {d:"q",n:4,name:"4 quarter notes",beats:"1 beat each"},
    {d:"8",n:8,name:"8 eighth notes",beats:"½ beat each"},
    {d:"16",n:16,name:"16 sixteenth notes",beats:"¼ beat each"}];
  let lv=0;
  container.innerHTML=`<div class="big-q l39-q" style="text-align:center"></div>
    <div class="l39-staff"></div>
    <div style="text-align:center"><button class="play l39-split">✂️ Split every note in half!</button></div>`;
  const q=container.querySelector(".l39-q"), holder=container.querySelector(".l39-staff"), btn=container.querySelector(".l39-split");
  function draw(doPlay){
    const L=LEVELS[lv];
    const notes=[]; for(let i=0;i<L.n;i++) notes.push({p:"B4",d:L.d});
    const spec={clef:"treble",tempo:60,notes,width:Math.max(240,L.n*38+140)};
    if(L.d==="8") spec.beams=[[0,1],[2,3],[4,5],[6,7]];
    if(L.d==="16") spec.beams=[[0,3,2],[4,7,2],[8,11,2],[12,15,2]];
    const api=Staff.render(holder,spec);
    q.innerHTML=`<b>${L.name}</b> — ${L.beats}. ${lv<4?"Same total time, smaller pieces…":"THE SIXTEENTH NOTE: two beams, ¼ beat each!"}`;
    if(doPlay) setTimeout(()=>Staff.play(spec,api),400); /* no sound on page load — only after a split click */
  }
  btn.onclick=()=>{
    if(lv>=4) return;
    lv++;
    draw(true);
    if(lv>=4){ btn.style.display="none";
      fb(true,"✓ w → 2 h → 4 q → 8 eighths → 16 SIXTEENTHS. Each split halves the value; sixteenths get a SECOND beam and are worth ¼ beat. Four of them fill one beat: 1-e-&-a!"); }
  };
  draw(false);
}

/* silent-syllable detective, sixteenth edition warm-up: WHICH sixteenth is loud? */
function MF_L39_syll(container,fb){
  const SYL=["1","e","&","a"];
  const ROUNDS=[2,0,3,1]; /* index of the ACCENTED sixteenth */
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l39-sq" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l39-sp">▶ Hear the beat</button></div>
    <div class="choices chips l39-sch" style="display:none"><button>1</button><button>e</button><button>&</button><button>a</button></div>`;
  const q=container.querySelector(".l39-sq"), ch=container.querySelector(".l39-sch");
  function ask(){ heard=false; ch.style.display="none";
    q.textContent=`Round ${i+1} of ${ROUNDS.length}: four even sixteenths — 1 e & a. ONE of them is accented. Which syllable?`; }
  container.querySelector(".l39-sp").onclick=()=>{
    const acc=ROUNDS[i];
    for(let k=0;k<4;k++) MFAudio.tone(k===acc?77:72,.16,k*.22,k===acc?.75:.28);
    heard=true; setTimeout(()=>ch.style.display="",1100);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    if(bi===ROUNDS[i]){ i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l39-sp").style.display="none";
        q.textContent="Subdivision ears unlocked!";
        fb(true,"✓ Four for four! You can HEAR the four slots inside one beat: 1-e-&-a. That's what counting sixteenths gives you."); }
      else { fb(true,`✓ The accent was on “${SYL[ROUNDS[i-1]]}”. Next beat…`); setTimeout(ask,900); } }
    else { MFAudio.tone(40,.25); fb(false,"Count along while it plays: 1-e-&-a — where was the loud one?"); }
  });
  ask();
}

LESSON_CONTENT[39]={
  welcome:"Eighth notes not fast enough for you? Let's split the beat into FOUR. \u{26A1}",
  hook:{
    say:"Two runs at the same tempo. Press both. <b>Which one squeezes MORE notes into each beat?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Run A</button>
          <button class="play hk-b">▶ Run B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Run B — twice as many notes per beat</button><button>Run A — more notes per beat</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [0,1,2,3].forEach(k=>MFAudio.tone(72,.2,k*.44,.4)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2000); };
        container.querySelector(".hk-b").onclick=()=>{ [0,1,2,3,4,5,6,7].forEach(k=>MFAudio.tone(74,.12,k*.22,.4)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2000); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Run A was eighth notes (2 per beat); Run B was SIXTEENTH notes — 4 per beat, each worth ¼ beat. Today: how to read, write, and count them.");
          else fb(false,"Listen again — which run packs the notes tighter?");
        });
      } }
  },
  objectives:[
    "Identify sixteenth notes by their two flags or two beams",
    "State the value: ¼ beat — four per beat",
    "Count sixteenths with 1-e-&-a",
    "Write sixteenths with flags and with beams",
    "Read combinations of eighths and sixteenths",
    "Perform sixteenth rhythms steadily"
  ],
  steps:[
    { say:"The note family so far: each value SPLITS IN TWO to make the next. Whole → half → quarter → eighth… and the splitting doesn't stop there. \u{1F447} <b>Split your way down to today's new note:</b>",
      try:{ type:"custom",
        hint:"Keep pressing the scissors — five levels from whole note to sixteenths.",
        mount:(container,fb)=>MF_L39_tree(container,fb) } },
    { say:"Anatomy check. A single sixteenth note = filled head + stem + <b>TWO flags</b>. Grouped sixteenths trade their flags for <b>TWO beams</b>. (One flag/beam = eighth; two = sixteenth.) \u{1F447} <b>How do you spot a sixteenth note instantly?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"D5",d:"16",x:140,label:"flags ×2"},{p:"C5",d:"16",x:300},{p:"B4",d:"16",x:360},{p:"C5",d:"16",x:420},{p:"D5",d:"16",x:480,label:"beams ×2"}],
        beams:[[1,4,2]],width:560} },
      try:{ type:"mc", choices:["Two flags or two beams","A hollow head","A dot after the head"], answer:0,
        success:"✓ Two of everything: 2 flags alone, 2 beams in groups. One more than the eighth note — because it's one split further down.",
        fail:"Compare with an eighth note — what doubled?",
        hint:"Count the flags." } },
    { say:"The math: in 4/4 (and 2/4, 3/4), a sixteenth note = <b>¼ of a beat</b>. So <b>2 sixteenths = 1 eighth</b>, and <b>4 sixteenths = 1 quarter = one full beat</b>. \u{1F447} <b>How many sixteenth notes fill ONE beat?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"B4",d:"q",label:"1 beat"},{bar:"single"},{p:"B4",d:"8",label:"= 2"},{p:"B4",d:"8"},{bar:"single"},
        {p:"B4",d:"16",label:"= 4"},{p:"B4",d:"16"},{p:"B4",d:"16"},{p:"B4",d:"16"},{bar:"final"}],
        beams:[[2,3],[5,8,2]],width:520} },
      try:{ type:"mc", choices:["4","2","8"], answer:0,
        success:"✓ Four sixteenths per beat — that's why the count needs four syllables.",
        fail:"¼ + ¼ + ¼ + ¼ = 1.",
        hint:"A quarter of a beat each…" } },
    { say:"And here are those four syllables — the universal sixteenth count: <b>1 – e – & – a</b> (say: 'one-ee-and-uh'). Every beat gets its own four: '1 e & a, 2 e & a, 3 e & a, 4 e & a'. \u{1F447} <b>Which syllable is the THIRD sixteenth of a beat?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"16",label:"1"},{p:"B4",d:"16",label:"e"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},
        {p:"B4",d:"16",label:"2"},{p:"B4",d:"16",label:"e"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},{bar:"final"}],
        beams:[[0,3,2],[4,7,2]],width:520} },
      try:{ type:"mc", choices:["&","e","a"], answer:0,
        success:"✓ 1(first) e(second) &(third) a(fourth). The & is exactly halfway — right where the eighth-note '&' always was!",
        fail:"Say it out loud: 1 - e - & - a.",
        hint:"Third syllable of 'one-ee-AND-uh'." } },
    { say:"Train the ear — four even sixteenths, one accented. \u{1F447} <b>Name the accented syllable each round:</b>",
      try:{ type:"custom",
        hint:"Whisper '1 e & a' along with the playback and catch the loud slot.",
        mount:(container,fb)=>MF_L39_syll(container,fb) } },
    { say:"Sixteenths also MIX with eighth notes inside one beat. Two favorites: <b>eighth + two sixteenths</b> = '1 <i>&nbsp;</i>& a' — and <b>two sixteenths + eighth</b> = '1 e &'. Note the beaming: one beam runs the whole group, the second beam covers only the sixteenths. \u{1F447} <b>In the pattern eighth + two sixteenths, which syllable is NOT played?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"8",label:"1"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},
        {p:"B4",d:"16",label:"2"},{p:"B4",d:"16",label:"e"},{p:"B4",d:"8",label:"&"},{bar:"final"}],
        beams:[[0,2],[1,2,2],[3,5],[3,4,2]],
        brackets:[{from:0,to:2,label:"1 (e) & a"},{from:3,to:5,label:"2 e & (a)"}],width:520} },
      try:{ type:"mc", choices:["e — the eighth holds through it","1 — the beat is silent","a — the last slot"], answer:0,
        success:"✓ The eighth note lasts 2 sixteenth-slots (1 AND e), so the next attack lands on &. Count '1 (e) & a'.",
        fail:"The eighth = 2 sixteenths long — which slot does it swallow?",
        hint:"The eighth occupies slots 1 and…" } }
  ],
  examples:[
    { caption:"A full 4/4 measure of sixteenths with the complete count — 1 e & a 2 e & a 3 e & a 4 e & a. Play it and chant along!",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C5",d:"16",label:"1"},{p:"C5",d:"16",label:"e"},{p:"C5",d:"16",label:"&"},{p:"C5",d:"16",label:"a"},
        {p:"D5",d:"16",label:"2"},{p:"D5",d:"16",label:"e"},{p:"D5",d:"16",label:"&"},{p:"D5",d:"16",label:"a"},
        {p:"B4",d:"16",label:"3"},{p:"B4",d:"16",label:"e"},{p:"B4",d:"16",label:"&"},{p:"B4",d:"16",label:"a"},
        {p:"C5",d:"16",label:"4"},{p:"C5",d:"16",label:"e"},{p:"C5",d:"16",label:"&"},{p:"C5",d:"16",label:"a"},{bar:"final"}],
        beams:[[0,3,2],[4,7,2],[8,11,2],[12,15,2]],time:"4/4",width:660} },
    { caption:"Mixed rhythm: quarters, eighths and sixteenths sharing the measures — watch the beams tell you the groupings.",
      staff:{clef:"treble",tempo:66,time:"4/4",notes:[
        {p:"C5",d:"q",label:"1"},{p:"D5",d:"8",label:"2"},{p:"D5",d:"8",label:"&"},
        {p:"E5",d:"16",label:"3"},{p:"E5",d:"16",label:"e"},{p:"E5",d:"16",label:"&"},{p:"E5",d:"16",label:"a"},{p:"C5",d:"q",label:"4"},{bar:"single"},
        {p:"D5",d:"8",label:"1"},{p:"E5",d:"16",label:"&"},{p:"D5",d:"16",label:"a"},{p:"C5",d:"q",label:"2"},{p:"B4",d:"h",label:"3-4"},{bar:"final"}],
        beams:[[1,2],[3,6,2],[9,11],[10,11,2]],width:680} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Value Race — sixteenth edition (45s)",
      intro:"Whole to sixteenth — name the values and beats at top speed!",
      miaIntro:"Two flags means quarter-beat — go! \u{1F3C3}",
      spec:{seconds:45, values:["w","h","q","8","16"], ask:"name"},
      result:(score)=>score>=9?score+" values named — subdivision master!":null },
    { type:"rhythm-tap", title:"Game 2 · Sixteenth Tap Lab",
      intro:"Tap the rhythms exactly — sixteenths included. Listen first, then echo!",
      miaIntro:"Steady hands: 1 e & a! \u{1F945}",
      spec:{tempo:60, rounds:3, patterns:[
        ["q","8","8","16","16","16","16"],
        ["16","16","16","16","q","8","8"],
        ["8","16","16","8","16","16"]]},
      result:(score)=>score!==null?"Your fingers subdivide like a metronome!":null },
    { type:"measure-build", title:"Game 3 · Build-a-Beat",
      intro:"Fill exactly ONE beat (4 sixteenth-slots) using the note buttons!",
      miaIntro:"Four quarter-slots to fill — no spills! \u{1F9F1}",
      spec:{beats:1, unique:false, buttons:[
        {t:"8",label:"Eighth Note",beats:0.5,item:{p:"B4",d:"8"}},
        {t:"16",label:"Sixteenth Note",beats:0.25,item:{p:"B4",d:"16"}},
        {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}]},
      result:(score)=>score!==null?"Beat built to the exact sixteenth!":null },
    { type:"gen-race", title:"Game 4 · Note-Spotter Sprint (10 rounds)",
      intro:"Notes flash on the staff — name each value before it escapes!",
      miaIntro:"Eyes on the flags and beams! \u{1F50D}",
      spec:{gen:"note-value", params:{values:["8","16","q","q.","h"],ask:"name"}, rounds:10},
      result:(score)=>score>=8?"No value escaped your eye!":null }
  ],
  practiceIntro:"20 practice questions — values, counting, flags and beams, mixed patterns. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["8","16","q"],ask:"name"}, count:4 },
    { gen:"note-value", params:{values:["8","16","q","h"],ask:"beats"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Sixteenth Note","a note worth ¼ of a beat"],["Two beams","how grouped sixteenths are written"],["Two flags","how a single sixteenth is written"],["1 e & a","the sixteenth-note count"],["Subdivision","dividing a beat into smaller equal parts"]], reverse:true}, count:3 },
    { type:"mc", q:"In 4/4 time, four sixteenth notes equal…", choices:["one quarter note (1 beat)","one eighth note","one half note"], answer:0,
      explain:"4 × ¼ = 1 beat." },
    { type:"mc", q:"Two sixteenth notes equal…", choices:["one eighth note","one quarter note","one whole beat"], answer:0,
      explain:"¼ + ¼ = ½ = an eighth note." },
    { type:"mc", q:"A sixteenth note in 2/4, 3/4, or 4/4 time is worth…", choices:["¼ beat","½ beat","1 beat"], answer:0,
      explain:"One quarter-count in all simple meters." },
    { type:"mc", q:"The sixteenth count for one full beat is…", choices:["1 e & a","1 & 2 &","1 a & e"], answer:0,
      explain:"Four slots, four syllables, in that order." },
    { type:"truefalse", q:"Grouped sixteenth notes are connected by two beams.", answer:true,
      explain:"Two beams = sixteenths; one beam = eighths." },
    { type:"truefalse", q:"A single sixteenth note has one flag.", answer:false,
      explain:"TWO flags — one flag is an eighth note." },
    { type:"mc", q:"In the figure eighth + two sixteenths, the attacks fall on…", choices:["1, &, a","1, e, &","1, e, a"], answer:0,
      explain:"The eighth swallows 'e'; the sixteenths land on & and a." },
    { type:"mc", q:"How many sixteenth notes equal one HALF note?", choices:["8","4","6"], answer:0,
      explain:"2 beats × 4 per beat = 8." }
  ],
  miaQuizIntro:"Two flags up! Count 1-e-&-a and sprint!",
  quiz:[
    { type:"mc", q:"A sixteenth note is worth…", choices:["¼ of a beat","½ of a beat","1 beat","2 beats"], answer:0,
      explain:"Four per beat in simple meter.", hint:"Four fit in one beat." },
    { type:"mc", q:"A single sixteenth note is drawn with…", choices:["two flags","one flag","no stem","a hollow head"], answer:0,
      explain:"Two flags (or two beams in groups).", hint:"One more than an eighth." },
    { type:"mc", q:"Four sixteenth notes are counted…", choices:["1 e & a","1 & 2 &","1 2 3 4","ti-ta-ti-ta"], answer:0,
      explain:"The universal subdivision count.", hint:"'one-ee-and-uh'." },
    { type:"mc", q:"Two sixteenth notes equal the duration of…", choices:["one eighth note","one quarter note","one whole note","one half note"], answer:0,
      explain:"¼ + ¼ = ½ beat = an eighth.", hint:"Half a beat total." },
    { type:"truefalse", q:"Four sixteenth notes equal one quarter note.", answer:true,
      explain:"Both fill exactly one beat.", hint:"4 × ¼ = ?" },
    { type:"truefalse", q:"Sixteenth notes in a group are joined by a single beam.", answer:false,
      explain:"TWO beams — the second beam is the sixteenth's signature.", hint:"Count the beams." },
    { type:"mc", q:"Which syllable is halfway through a beat of sixteenths?", choices:["&","e","a","2"], answer:0,
      explain:"1 e & a — the & splits the beat exactly in half.", hint:"Same & as in eighth-note counting." },
    { type:"mc", q:"Name this note.",
      staff:{clef:"treble",notes:[{p:"B4",d:"16"}],width:160},
      choices:["Sixteenth note","Eighth note","Quarter note"], answer:0,
      explain:"Filled head, stem, two flags.", hint:"How many flags?" },
    { type:"mc", q:"How many sixteenth notes fill a measure of 2/4?", choices:["8","4","16"], answer:0,
      explain:"2 beats × 4 = 8.", hint:"Four per beat, two beats." },
    { type:"mc", q:"The pattern two-sixteenths-then-eighth is counted…", choices:["1 e &","1 & a","1 e a"], answer:0,
      explain:"Attacks on 1, e, and & — the eighth holds through 'a'.", hint:"The eighth comes LAST here." },
    { type:"mc", q:"Adding a second flag to an eighth note makes it…", choices:["a sixteenth note","a quarter note","a dotted eighth","a grace note"], answer:0,
      explain:"Each added flag halves the value.", hint:"Flags halve values." },
    { type:"mc", q:"Which shows one FULL beat?",
      staff:{clef:"treble",notes:[{p:"B4",d:"16"},{p:"B4",d:"16"},{p:"B4",d:"16"},{p:"B4",d:"16"}],beams:[[0,3,2]],width:220},
      choices:["Yes — four sixteenths = 1 beat","No — it's half a beat","No — it's two beats"], answer:0,
      explain:"4 × ¼ = exactly one beat.", hint:"Count the quarter-slots." },
    /* generated */
    { gen:"note-value", params:{values:["8","16","q"],ask:"name"}, count:3 },
    { gen:"note-value", params:{values:["8","16","q","h"],ask:"beats"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Sixteenth Note","a note worth ¼ of a beat"],["Two beams","how grouped sixteenths are written"],["1 e & a","the sixteenth-note count"],["Subdivision","dividing a beat into smaller equal parts"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Sixteenth Note", def:"A note worth one-fourth of a beat in simple meter. A single sixteenth has two flags; grouped sixteenths are connected by two beams."},
    {term:"Subdivision", def:"Dividing a beat into smaller, equal parts — eighths split it in two, sixteenths in four."},
    {term:"Beam", def:"A horizontal line connecting note groups: one beam for eighths, two beams for sixteenths."},
    {term:"1 e & a", def:"The counting syllables for four sixteenth notes in one beat — 'one-ee-and-uh'."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Sixteenth note = ¼ beat</b> — four per beat, eight per half note, sixteen per whole.",
    "✔ Spot them by the <b>double</b>: two flags alone, two beams in groups.",
    "✔ Count every beat as <b>1 e & a</b> — steady and even, four slots per beat.",
    "✔ 2 sixteenths = 1 eighth · 4 sixteenths = 1 quarter.",
    "✔ Mixed figures: eighth + 2 sixteenths = '1 & a' · 2 sixteenths + eighth = '1 e &'."
  ],
  tips:[
    "Practice slow: sixteenths at ♩=60 with perfect evenness beat sixteenths at ♩=120 with lumps.",
    "Say 'ti-ri-ti-ri' (an alternative count) if '1 e & a' twists your tongue at speed.",
    "Watch the SECOND beam like a hawk — it's the only difference between a run of eighths and a run of sixteenths.",
    "Next lesson: the sixteenth REST — a quarter-beat of precisely-placed silence."
  ],
  rewards:{ badge:"Speed Splitter", icon:"\u{26A1}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score at sixteenth-note speed — lightning! \u{26A1}\u{1F389}",
  miaPass:"Passed! Keep chanting 1-e-&-a — evenness beats speed every time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Run A was eighth notes — 2 per beat. Run B was sixteenths — 4 per beat, twice as tightly packed. Same beat, finer slicing.",
      play:()=>{[0,1,2,3].forEach(k=>MFAudio.tone(72,.18,k*.4,.4));[0,1,2,3,4,5,6,7].forEach(k=>MFAudio.tone(74,.1,2+k*.2,.4));} },
    learn:{ label:"sixteenth notes",
      explain:"¼ beat each; two flags or two beams; count 1-e-&-a. Two sixteenths = an eighth; four = a quarter. Mixed with eighths they make the '1 & a' and '1 e &' figures.",
      hint:"Two of everything: flags, beams.",
      play:()=>{[0,1,2,3].forEach(k=>MFAudio.tone(76,.1,k*.16,.45));} },
    example:{ label:"the examples",
      explain:"Example 1 is a full measure of counted sixteenths; example 2 mixes quarters, eighths and sixteenths — read the beams to find the groups." },
    game:{ label:"the games",
      explain:"Race the values, tap the rhythms, build exact beats, then spot notes at speed.",
      hint:"In the tap lab: whisper the count while you tap." },
    quiz:{ label:"this question",
      explain:"Everything reduces to one fact: sixteenth = ¼ beat, written with two flags or two beams, counted 1-e-&-a.",
      play:()=>{[0,1,2,3].forEach(k=>MFAudio.tone(72,.1,k*.15,.4));} }
  }
};
