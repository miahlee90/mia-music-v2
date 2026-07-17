/* Lesson 29 — Key Signatures: The Sharp Keys (AEMT Book 2, Unit 7)
   Built from drafts/UNIT 7 – Lesson 29.md; AEMT p.46 verified by render.
   Uses staff.js v7 keysig rendering (spec.keysig, onKeysig, .ksgroup).
   QA note honored: the ORDER of sharps (F–C–G–D–A–E–B) and the "last sharp +
   one half step up" rule are taught TOGETHER, then applied immediately.
   NOTE: edit by FULL-FILE REWRITE only. */

/* tap the sharps in key-signature order — staff grows as you go */
function MF_L29_buildSig(container,fb){
  const ORDER=["F♯","C♯","G♯","D♯"];
  let i=0;
  container.innerHTML=`<div class="big-q l29-q" style="text-align:center">Build the key signature of <b>E major</b> (4 sharps). Tap the sharps in the correct order!</div>
    <div class="l29-staff"></div><div class="choices chips l29-ch"></div>`;
  const holder=container.querySelector(".l29-staff"), ch=container.querySelector(".l29-ch"), q=container.querySelector(".l29-q");
  function draw(){ Staff.render(holder, i===0? {clef:"treble",notes:[],width:300} : {clef:"treble",keysig:{sharps:i},notes:[],width:300}); }
  ["C♯","F♯","D♯","G♯","A♯"].forEach(lbl=>{ const b=document.createElement("button"); b.textContent=lbl;
    b.onclick=()=>{
      if(i>=ORDER.length) return;
      if(lbl===ORDER[i]){ i++; MFAudio.tone(58+i*4,.3); draw();
        if(i>=ORDER.length){ q.innerHTML="✓ F♯ C♯ G♯ D♯ — the key signature of <b>E major</b>!";
          fb(true,"✓ Four sharps in perfect order. Last sharp D♯ + one half step up = E. The signature names its own key!"); }
        else q.innerHTML=`✓ ${ORDER.slice(0,i).join(" ")} — which sharp comes next?`; }
      else { MFAudio.tone(40,.25); fb(false,`Sharps always follow F–C–G–D–A–E–B. The ${["1st","2nd","3rd","4th"][i]} sharp is ${ORDER[i]}.`); }
    };
    ch.appendChild(b); });
  draw();
}

/* the SHARP-KEY LADDER (instructor 2026-07-06): start from an EMPTY signature
   (C major) and climb to 7 sharps — the student ADDS each sharp in order and
   MATCHES every new signature to its key name. (The book saves the circle of
   fifths for Lesson 34 — this ladder is the raw material for it.) */
function MF_L29_ladder(container,fb){
  const SHARPS=["F♯","C♯","G♯","D♯","A♯","E♯","B♯"];
  const KEYS=["C","G","D","A","E","B","F♯","C♯"];
  let n=0, phase="name";
  container.innerHTML=`<div class="big-q lad-q" style="text-align:center"></div>
    <div class="lad-staff"></div>
    <div class="lad-done" style="text-align:center;font-size:13px;color:var(--muted);min-height:18px"></div>
    <div class="choices chips lad-sharps" style="display:none"></div>
    <div class="choices chips lad-names" style="display:none"></div>
    <div class="lad-hint" style="text-align:center;font-size:13.5px;margin-top:10px;line-height:1.7">
      <span class="lad-h1" style="color:var(--correct);font-weight:800;display:none">Order of sharps: F♯ C♯ G♯ D♯ A♯ E♯ B♯</span>
      <span class="lad-h2" style="color:var(--primary);font-weight:700;display:none">Name the key: the note one half step ABOVE the last sharp.</span>
    </div>`;
  const q=container.querySelector(".lad-q"), holder=container.querySelector(".lad-staff"),
        doneLine=container.querySelector(".lad-done"),
        shRow=container.querySelector(".lad-sharps"), nmRow=container.querySelector(".lad-names");
  SHARPS.forEach(s=>{ const b=document.createElement("button"); b.textContent=s;
    b.style.color="var(--correct)"; b.style.borderColor="var(--correct)";
    b.onclick=()=>{ if(phase!=="add"||b.disabled) return;
      if(s===SHARPS[n]){ b.disabled=true; n++; draw(); MFAudio.tone(58+n*3,.3); setPhase("name"); }
      else { MFAudio.tone(40,.25); fb(false,`Fat Cats Go Down Alleys Eating Bread — sharp #${n+1} is ${SHARPS[n]}.`); } };
    shRow.appendChild(b); });
  KEYS.forEach((k,ki)=>{ const b=document.createElement("button"); b.textContent=k+" Major";
    b.style.color="var(--primary)"; b.style.borderColor="var(--primary)";
    b.onclick=()=>{ if(phase!=="name"||b.disabled) return;
      if(ki===n){ b.disabled=true; MFAudio.tone(64+n*2,.3);
        doneLine.textContent=KEYS.slice(0,n+1).map((kk,i)=>`${i}♯=${kk}`).join(" · ");
        if(n>=7){ shRow.style.display="none"; nmRow.style.display="none";
          q.innerHTML="✓ The complete sharp-key ladder — C major to C♯ major!";
          fb(true,"✓ All eight keys matched! Each added sharp lifts the key: last sharp + one half step up = the key name."); }
        else setPhase("add"); }
      else { MFAudio.tone(40,.25); fb(false, n===0? "Remember — the empty signature IS C major. Tap C Major to begin!" : `Find the LAST sharp (${SHARPS[n-1]}) and go UP one half step.`); } };
    nmRow.appendChild(b); });
  function draw(){ Staff.render(holder, n===0? {clef:"treble",notes:[],width:300} : {clef:"treble",keysig:{sharps:n},notes:[],width:300}); }
  function setPhase(p){ phase=p;
    const h1=container.querySelector(".lad-h1"), h2=container.querySelector(".lad-h2");
    h1.style.display=p==="add"?"inline":"none";
    h2.style.display=p==="name"?"inline":"none";
    shRow.style.display=p==="add"?"":"none";
    nmRow.style.display=p==="name"?"":"none";
    q.innerHTML=p==="add"? `Now ADD sharp #${n+1} — which sharp comes next?`
      : (n===0? "Let's start from <b>C major</b> — the completely EMPTY signature, no sharps at all.<br><b>Tap C Major to begin the ladder!</b>" : `${n} sharp${n>1?"s":""} on the staff — which major key is this now?`);
  }
  draw(); setPhase("name");
}

/* name-the-key drill: 4 rounds across treble & bass */
function MF_L29_nameKey(container,fb){
  const ROUNDS=[{key:"G",clef:"treble",last:"F♯"},{key:"D",clef:"bass",last:"C♯"},{key:"A",clef:"treble",last:"G♯"},{key:"E",clef:"bass",last:"D♯"}];
  const NAME={G:"G Major",D:"D Major",A:"A Major",E:"E Major"};
  let i=0;
  container.innerHTML=`<div class="big-q l29-nq" style="text-align:center"></div><div class="l29-nstaff"></div><div class="choices chips l29-nch"></div>`;
  const q=container.querySelector(".l29-nq"), holder=container.querySelector(".l29-nstaff"), ch=container.querySelector(".l29-nch");
  ["G Major","D Major","A Major","E Major"].forEach(lbl=>{ const b=document.createElement("button"); b.textContent=lbl;
    b.onclick=()=>{
      const cur=ROUNDS[i];
      if(lbl===NAME[cur.key]){ i++; MFAudio.tone(72,.3);
        if(i>=ROUNDS.length){ ch.style.display="none"; holder.innerHTML=""; q.textContent="All four sharp keys identified!";
          fb(true,"✓ G, D, A, E — read the last sharp, step up a half step, done. Treble or bass, the rule never changes."); }
        else { fb(true,`✓ Last sharp ${cur.last} + half step = ${NAME[cur.key]}. Next…`); ask(); } }
      else { MFAudio.tone(40,.25); fb(false,`Find the LAST sharp (${cur.last}) and go up one half step.`); }
    };
    ch.appendChild(b); });
  function ask(){ const cur=ROUNDS[i];
    q.innerHTML=`Key ${i+1} of ${ROUNDS.length}: name this major key (${cur.clef} clef).`;
    Staff.render(holder,{clef:cur.clef,keysig:cur.key,notes:[],width:240}); }
  ask();
}

LESSON_CONTENT[29]={
  welcome:"A key signature states the sharps ONCE, right after the clef — no more writing a sharp before every F. \u{1F5DD}",
  hook:{
    say:"Both staffs below play the exact same G-major melody. One writes a sharp before every single F; the other states it ONCE. Which would you rather read?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="hk-a"></div><div class="hk-b"></div>
          <div class="choices hk-ch"><button>The second — say it once, right after the clef</button><button>The first — I enjoy writing sharps</button></div>`;
        Staff.render(container.querySelector(".hk-a"),{clef:"treble",notes:[{p:"G4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"h"}],width:440});
        Staff.render(container.querySelector(".hk-b"),{clef:"treble",keysig:"G",notes:[{p:"G4",d:"q"},{p:"F4",sound:"F#4",d:"q"},{p:"G4",d:"q"},{p:"F4",sound:"F#4",d:"q"},{p:"G4",d:"q"},{p:"F4",sound:"F#4",d:"q"},{p:"G4",d:"h"}],width:440});
        [...container.querySelector(".hk-ch").children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ That single group of sharps right after the clef is a KEY SIGNATURE — it sharps every F for the entire piece. Today you learn to read and write them!");
          else fb(false,"Really? Count how many sharp signs you'd write in a full page of music…");
        });
      } }
  },
  objectives:[
    "Define a key signature",
    "Memorize the order of sharps",
    "Identify common sharp key signatures",
    "Determine the major key from a sharp key signature",
    "Use the last-sharp rule",
    "Read key signatures on both treble and bass staves"
  ],
  steps:[
    { say:"To make writing and reading music easier, all the sharps used in a scale or piece can be placed together <b>immediately after the clef sign</b>. This is the <b>KEY SIGNATURE</b> — it indicates the notes that will be sharped <b>each time they appear</b>, for the <i>entire</i> piece (unless a natural sign cancels one). \u{1F447} <b>Where is the key signature written?</b>",
      show:{ type:"staff", spec:{clef:"grand",keysig:"G",notes:[],width:340} },
      try:{ type:"mc", choices:["Right after the clef","Before the clef","At the end of the staff","Above the staff"], answer:0,
        success:"✓ Right after the clef, on every staff — treble and bass alike.",
        fail:"Look at where the sharps sit on the grand staff above.",
        hint:"Clef first, then the signature." } },
    { say:"Sharps in a key signature always appear in a <b>specific order</b>: <b>F – C – G – D – A – E – B</b>. A handy mnemonic: <b><i>Fat Cats Go Down Alleys Eating Bread</i></b>. Never change this order! \u{1F447} <b>Which is the correct order of sharps?</b>",
      try:{ type:"mc",
        choices:["F C G D A E B","C F G D A E B","B E A D G C F","G D A E B F C"], answer:0,
        success:"✓ Fat Cats Go Down Alleys Eating Bread — F C G D A E B.",
        fail:"Fat Cats first: F, then C…",
        hint:"F is always the first sharp." } },
    { say:"The keys you already know: <b>Key of G — 1 sharp (F♯)</b> and <b>Key of D — 2 sharps (F♯, C♯)</b>. The order of sharps for up to two sharps is <b>F C</b>. \u{1F447} <b>The key of D major has which sharps?</b>",
      show:{ type:"staff", spec:{clef:"grand",keysig:"D",notes:[],width:340} },
      try:{ type:"mc", choices:["F♯ and C♯","F♯ and G♯","C♯ and D♯","F♯ only"], answer:0,
        success:"✓ F♯ then C♯ — exactly the sharps the D major scale needs.",
        fail:"Count the sharps on the staff above and name them in order.",
        hint:"First two of Fat Cats Go…" } },
    { say:"How do you NAME a key from its signature? <b>Go up one half step from the LAST sharp.</b> Now climb the whole ladder yourself: starting from a completely <b>EMPTY signature</b>, add all seven sharps one at a time — and name each new key as it appears. \u{1F447} <b>Start with the empty staff — which major key has no sharps at all?</b>",
      try:{ type:"custom",
        hint:"Add sharps in Fat-Cats order; to name each key, take the LAST sharp and go up one half step.",
        mount:(container,fb)=>MF_L29_ladder(container,fb) } },
    { say:"Drill time — treble AND bass. \u{1F447} <b>Name each key from its signature:</b>",
      try:{ type:"custom",
        hint:"Find the last sharp, go up one half step — that note names the key.",
        mount:(container,fb)=>MF_L29_nameKey(container,fb) } },
    { say:"Now write one yourself. \u{1F447} <b>Build the E major key signature — four sharps, correct order:</b>",
      try:{ type:"custom",
        hint:"Fat Cats Go Down: F♯, C♯, G♯, D♯.",
        mount:(container,fb)=>MF_L29_buildSig(container,fb) } }
  ],
  examples:[
    { caption:"Key of G — 1 sharp (F♯). No sharp is written before the F in the music, yet it still PLAYS as F♯: the key signature does the work.",
      staff:{clef:"treble",tempo:100,keysig:"G",notes:[{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"},{p:"D5",d:"q",label:"D"},{p:"E5",d:"q",label:"E"},{p:"F5",sound:"F#5",d:"q",label:"F♯"},{p:"G5",d:"q",label:"G"}],width:540},
      kb:{start:60,octaves:2,labels:true,marks:[67,69,71,72,74,76,78,79]} },
    { caption:"Key of D — 2 sharps (F♯, C♯). Every F and every C in the piece is played sharp, in any octave, without another sign.",
      staff:{clef:"treble",tempo:100,keysig:"D",notes:[{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F4",sound:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"},{p:"C5",sound:"C#5",d:"q",label:"C♯"},{p:"D5",d:"q",label:"D"}],width:540},
      kb:{start:60,octaves:1.3333,labels:true,marks:[62,64,66,67,69,71,73,74]} }
  ],
  games:[
    { type:"order-tap", title:"Game 1 · Order of Sharps Race",
      intro:"All seven sharps, perfect order — Fat Cats Go Down Alleys Eating Bread!",
      miaIntro:"The full sharp parade! \u{1F3C1}",
      spec:{sequence:["F♯","C♯","G♯","D♯","A♯","E♯","B♯"], title:"Tap the 7 sharps in key-signature order!"},
      result:(stars)=>stars>=3?"F C G D A E B — flawless!":null },
    { type:"term-race", title:"Game 2 · Sharps-per-Key Race",
      intro:"How many sharps in each key? Match at speed!",
      miaIntro:"Key facts, fast! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["G Major","1 sharp — F♯"],
        ["D Major","2 sharps — F♯ C♯"],
        ["A Major","3 sharps — F♯ C♯ G♯"],
        ["E Major","4 sharps — F♯ C♯ G♯ D♯"],
        ["C Major","No sharps at all"]]},
      result:(score)=>score>=7?"Sharp-key librarian!":null },
    { type:"symbol-hunt", title:"Game 3 · Signature Hunt",
      intro:"Four key signatures — click the key that's named!",
      miaIntro:"Read the signatures at a glance! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Key of G (1 sharp)", spec:{clef:"treble",keysig:"G",notes:[],width:150}},
        {label:"Key of D (2 sharps)", spec:{clef:"treble",keysig:"D",notes:[],width:150}},
        {label:"Key of A (3 sharps)", spec:{clef:"treble",keysig:"A",notes:[],width:150}},
        {label:"Key of E (4 sharps)", spec:{clef:"treble",keysig:"E",notes:[],width:150}}]},
      result:(score)=>score>=5?"Signatures read in a blink!":null },
    { type:"term-race", title:"Game 4 · Last-Sharp Rule Race",
      intro:"The last sharp names the key — one half step up. Ready?",
      miaIntro:"Apply the rule at speed! \u{1F5DD}",
      spec:{rounds:8, pool:[
        ["Last sharp F♯","G Major"],
        ["Last sharp C♯","D Major"],
        ["Last sharp G♯","A Major"],
        ["Last sharp D♯","E Major"]]},
      result:(score)=>score>=7?"The rule is pure reflex now!":null }
  ],
  practiceIntro:"20 practice questions — the order of sharps, the last-sharp rule, and reading signatures in both clefs. Answer right and the next appears automatically!",
  practice:[
    { gen:"keysig-id", params:{kind:"sharp", max:4}, count:6 },
    { gen:"term-match", params:{subject:"key", pool:[["G Major","1 sharp — F♯"],["D Major","2 sharps — F♯ C♯"],["A Major","3 sharps — F♯ C♯ G♯"],["E Major","4 sharps — F♯ C♯ G♯ D♯"]], reverse:true}, count:4 },
    { type:"mc", q:"What is the correct order of sharps?", choices:["F C G D A E B","C F G D A E B","B E A D G C F"], answer:0,
      explain:"Fat Cats Go Down Alleys Eating Bread." },
    { type:"mc", q:"What is the third sharp in the order of sharps?", choices:["G♯","C♯","D♯"], answer:0,
      explain:"F♯, C♯, then G♯." },
    { type:"truefalse", q:"Sharps always appear in the same order in a key signature.", answer:true,
      explain:"F–C–G–D–A–E–B, never rearranged." },
    { type:"truefalse", q:"A key signature is written before the clef.", answer:false,
      explain:"It comes immediately AFTER the clef sign." },
    { type:"mc", q:"The order of sharps begins with ____.", choices:["F","C","B"], answer:0,
      explain:"F♯ is always the first sharp." },
    { type:"mc", q:"If the last sharp is G♯, the key is ____ major.", choices:["A","G","E"], answer:0,
      explain:"One half step above G♯ is A." },
    /* — review style — */
    { type:"mc", q:"Write the order of the first two sharps.", choices:["F♯ C♯","C♯ F♯","F♯ G♯"], answer:0,
      explain:"For up to two sharps the order is F C." },
    { type:"mc", q:"Write the first four sharps in order.", choices:["F♯ C♯ G♯ D♯","F♯ G♯ C♯ D♯","C♯ F♯ D♯ G♯"], answer:0,
      explain:"Fat Cats Go Down — F♯ C♯ G♯ D♯." },
    { type:"mc", q:"A key signature contains F♯ and C♯. Name the key.", choices:["D Major","G Major","A Major"], answer:0,
      explain:"Last sharp C♯ + half step = D." },
    { type:"mc", q:"How many sharps does E major have?", choices:["4","3","5"], answer:0,
      explain:"F♯, C♯, G♯, D♯." }
  ],
  miaQuizIntro:"Fat Cats are watching — read those signatures like a pro!",
  quiz:[
    { type:"mc", q:"What is a key signature?",
      choices:["A tempo marking","A group of sharps or flats placed after the clef","A time signature","A repeat sign"], answer:1,
      explain:"It indicates the notes sharped or flatted each time they appear, for the entire piece.", hint:"It sits right after the clef." },
    { type:"mc", q:"What is the correct order of sharps?",
      choices:["C F G D A E B","F C G D A E B","B E A D G C F","G D A E B F C"], answer:1,
      explain:"Fat Cats Go Down Alleys Eating Bread.", hint:"Fat Cats first…" },
    { type:"mc", q:"What is the third sharp in the order of sharps?", choices:["C♯","G♯","D♯","A♯"], answer:1,
      explain:"F♯, C♯, G♯ — Go comes third.", hint:"Fat Cats GO…" },
    { type:"truefalse", q:"Sharps always appear in the same order in the key signature.", answer:true,
      explain:"The order F–C–G–D–A–E–B never changes.", hint:"That's what makes them readable at a glance." },
    { type:"truefalse", q:"A key signature is written before the clef.", answer:false,
      explain:"Immediately AFTER the clef sign.", hint:"Clef first." },
    { type:"mc", q:"Which matching is correct?",
      choices:["G→1 · D→2 · A→3 · E→4 sharps","G→2 · D→1 · A→4 · E→3 sharps","G→3 · D→4 · A→1 · E→2 sharps"], answer:0,
      explain:"The sharp keys accumulate one sharp at a time: G, D, A, E.", hint:"G major starts the chain with F♯." },
    { type:"mc", q:"The order of sharps begins with ____.", choices:["F","B","C"], answer:0,
      explain:"F♯ is always first.", hint:"Fat…" },
    { type:"mc", q:"If the last sharp is G♯, the key is ____ major.", choices:["A","G","D"], answer:0,
      explain:"One half step above G♯ = A.", hint:"The last-sharp rule." },
    { type:"mc", q:"Write the first four sharps in the correct order.",
      choices:["F♯, C♯, G♯, D♯","F♯, G♯, C♯, D♯","C♯, F♯, G♯, A♯"], answer:0,
      explain:"F–C–G–D: the first four stops on the sharp trail.", hint:"Fat Cats Go Down." },
    { type:"mc", q:"A key signature contains F♯ and C♯. Name the key.", choices:["G Major","D Major","A Major"], answer:1,
      explain:"Last sharp C♯ + one half step = D.", hint:"Apply the rule to C♯." },
    { type:"mc", q:"A key signature contains F♯, C♯, G♯ and D♯. What is the key?",
      choices:["D Major","E Major","A Major","B Major"], answer:1,
      explain:"Last sharp D♯ + one half step = E.", hint:"Step up from D♯." },
    { type:"mc", q:"Name this major key signature.",
      staff:{clef:"treble",keysig:"D",notes:[],width:220},
      choices:["D Major","G Major","A Major"], answer:0,
      explain:"Two sharps (F♯, C♯) — D major.", hint:"Count the sharps, then use the rule." },
    { type:"mc", q:"Name this major key signature (bass clef).",
      staff:{clef:"bass",keysig:"A",notes:[],width:220},
      choices:["A Major","E Major","D Major"], answer:0,
      explain:"Three sharps — last is G♯, so A major. The rule works in any clef.", hint:"Same rule, bass clef." },
    { type:"mc", q:"Why do composers use key signatures?",
      choices:["To avoid writing an accidental before every affected note","To show the tempo","To count the measures"], answer:0,
      explain:"State the sharps once after the clef — they apply for the entire piece.", hint:"Think of the messy staff from the welcome." },
    /* generated */
    { gen:"keysig-id", params:{kind:"sharp", max:4}, count:4 },
    { gen:"term-match", params:{subject:"key", pool:[["G Major","1 sharp — F♯"],["D Major","2 sharps — F♯ C♯"],["A Major","3 sharps — F♯ C♯ G♯"],["E Major","4 sharps — F♯ C♯ G♯ D♯"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Key Signature", def:"Indicates the notes that will be sharped or flatted each time they appear. These are placed right after the clef sign.",
      staff:{clef:"treble",keysig:"D",notes:[],width:130}},
    {term:"Sharp Keys", def:"Major keys whose key signatures contain one or more sharps."},
    {term:"Order of Sharps", def:"The sequence in which sharps are added to key signatures: F – C – G – D – A – E – B. (Fat Cats Go Down Alleys Eating Bread.)"},
    {term:"Last-Sharp Rule", def:"To name a sharp major key, go up one half step from the last sharp in the key signature."}
  ],
  mistakes:[],
  summary:[
    "✔ A <b>key signature</b> sits <b>right after the clef</b> and sharps its notes for the <b>entire piece</b>.",
    "✔ Order of sharps: <b>F – C – G – D – A – E – B</b> — <i>Fat Cats Go Down Alleys Eating Bread</i>.",
    "✔ <b>Last sharp + one half step up = the major key</b>.",
    "✔ G = 1♯ · D = 2♯ · A = 3♯ · E = 4♯ (and the chain continues to B, F♯, C♯).",
    "✔ The same signature appears on <b>every staff</b> — treble and bass."
  ],
  tips:[
    "Reading a new piece? Check the key signature BEFORE you play a note — it tells you which black keys live in the piece.",
    "The order of sharps is also the order the sharp KEYS appear: G(1), D(2), A(3), E(4)…",
    "A natural sign can cancel a key-signature sharp — but only for that measure (Lesson 24's one-measure rule still applies).",
    "Next lesson: the flat keys — with their own order and their own naming trick."
  ],
  rewards:{ badge:"Sharp Key Decoder", icon:"\u{1F5DD}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"Perfect score! You read sharp key signatures the way musicians do — in seconds. \u{1F5DD}\u{1F389}",
  miaPass:"You passed! Keep chanting Fat Cats Go Down Alleys Eating Bread, and let the last sharp do the naming.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Writing a sharp before every F is exhausting — the key signature states it once, right after the clef, and it applies to the whole piece.",
      play:()=>{[67,66,67,66,67].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));} },
    learn:{ label:"key signatures",
      explain:"Sharps stack after the clef in the fixed order F–C–G–D–A–E–B. To name the key: last sharp + one half step up.",
      hint:"Fat Cats Go Down Alleys Eating Bread.",
      play:()=>{MFAudio.tone(66,.3,0);MFAudio.tone(61,.3,.35);MFAudio.tone(68,.3,.7);} },
    example:{ label:"the examples",
      explain:"Both scales are written WITHOUT accidentals in the music — yet the F (and C) still play sharp. That's the key signature working." },
    game:{ label:"the games",
      explain:"Race the sharp order, match keys to their sharps, read signatures on sight, and drill the last-sharp rule.",
      hint:"Everything reduces to two facts: the order, and the rule." },
    quiz:{ label:"this question",
      explain:"Two tools solve every question: the order F–C–G–D–A–E–B, and the last-sharp + half-step rule.",
      play:()=>{MFAudio.tone(63,.3,0);MFAudio.tone(64,.5,.4);} }
  }
};
