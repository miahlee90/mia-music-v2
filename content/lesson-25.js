/* Lesson 25 — Whole Steps, Half Steps and Enharmonic Notes (AEMT Book 1, Unit 6)
   Built from drafts/UNIT 6 – Lesson 25.md — the FINAL lesson of Book 1!
   QA notes honored: half step = the VERY next key (even white-to-white E–F, B–C);
   enharmonic pairs demonstrated on the interactive keyboard.
   NOTE: edit by FULL-FILE REWRITE only. */

/* half-or-whole keyboard drill (unique L25 prefix) */
function MF_L25_stepDrill(container,fb){
  const rounds=[
    {a:"C4",b:"C#4",half:true},{a:"C4",b:"D4",half:false},{a:"E4",b:"F4",half:true},
    {a:"F4",b:"G4",half:false},{a:"B4",b:"C5",half:true},{a:"A4",b:"B4",half:false}];
  let i=0,played=false;
  container.innerHTML=`<div class="big-q sd-q" style="text-align:center"></div>
    <div class="sd-kb"></div>
    <div style="text-align:center"><button class="play sd-play">▶ Hear the two keys</button></div>
    <div class="choices sd-ch" style="display:none"><button>\u{1F463} Half step — the VERY next key</button><button>\u{1F3C3} Whole step — one key skipped</button></div>`;
  const q=container.querySelector(".sd-q"), ch=container.querySelector(".sd-ch");
  function ask(){
    const cur=rounds[i]; played=false; ch.style.display="none";
    q.textContent=`Distance ${i+1} of ${rounds.length}: ${cur.a[0]}${cur.a.includes("#")?"♯":""} to ${cur.b[0]}${cur.b.includes("#")?"♯":""} — half or whole?`;
    Keyboard.create(container.querySelector(".sd-kb"),{start:60,octaves:2,labels:false,
      marks:[MFAudio.midi(cur.a),MFAudio.midi(cur.b)]});
  }
  container.querySelector(".sd-play").onclick=()=>{
    const cur=rounds[i];
    MFAudio.tone(MFAudio.midi(cur.a),.5,0); MFAudio.tone(MFAudio.midi(cur.b),.5,.6);
    played=true;
    setTimeout(()=>{ ch.style.display=""; },1400);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!played){ fb(false,"Listen first — and look at the marked keys!"); return; }
    const cur=rounds[i], saidHalf=bi===0, ok=saidHalf===cur.half;
    if(ok){ i++;
      if(i>=rounds.length){ ch.style.display="none"; container.querySelector(".sd-play").style.display="none";
        container.querySelector(".sd-kb").innerHTML=""; q.textContent="Distances mastered!";
        fb(true,"✓ Every distance measured — including the sneaky white-to-white half steps E–F and B–C!"); }
      else { fb(true,`✓ ${cur.half?"Half step — no key in between!":"Whole step — exactly one key skipped."} Next…`); ask(); } }
    else fb(false,`Look between the marked keys: ${cur.half?"NOTHING in between = half step.":"one key sits in between = whole step."}`);
  });
  ask();
}

LESSON_CONTENT[25]={
  welcome:"A milestone lesson — measuring music's smallest steps! \u{1F463}",
  hook:{
    say:"Did you know one piano key can have <b>two different names</b>? Sounds strange — but it's true! Press play: <b>C♯… and D♭.</b> What do you notice?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ C♯… then D♭</button></div>
          <div class="choices hk-ch" style="display:none"><button>They sound EXACTLY the same</button><button>D♭ was higher</button><button>C♯ was higher</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(61,.8,0); MFAudio.tone(61,.8,1.0);
          setTimeout(()=>{ ch.style.display=""; },2100);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Identical! C♯ and D♭ are the SAME black key wearing two name tags — that's called ENHARMONIC. Today's lesson explains why!");
          else fb(false,"Listen once more — can you honestly hear any difference?");
        });
      } }
  },
  objectives:[
    "Define half steps and whole steps",
    "Identify half and whole steps on a keyboard",
    "Explain what enharmonic notes are",
    "Recognize common enharmonic pairs",
    "Spot the white-key half steps E–F and B–C",
    "Apply half- and whole-step thinking to simple examples"
  ],
  steps:[
    { say:"A <b>half step (H)</b> is the distance from one key to the <b>VERY next key</b> — black or white, nothing skipped. It's the smallest interval in Western music. Examples: C→C♯, E→F, B→C. \u{1F447} <b>Notice: E–F and B–C are half steps with NO black key between!</b> <b>What is a half step?</b>",
      try:{ type:"mc",
        choices:["The very next key — nothing in between","Two keys apart","Always white to black"], answer:0,
        success:"✓ The very next neighbor — sometimes black, sometimes white (E–F and B–C!).",
        fail:"No keys skipped — the immediate neighbor.",
        hint:"\u{1F463} one tiny step." } },
    { say:"A <b>whole step (W)</b> = <b>two half steps</b> — you skip exactly ONE key. Examples: C→D (skipping C♯), F→G, A→B. Remember: <b>H + H = W</b>. \u{1F447} <b>Measure these distances by eye and ear:</b>",
      try:{ type:"custom",
        hint:"Look between the marked keys: empty = half, one key = whole.",
        mount:(container,fb)=>MF_L25_stepDrill(container,fb) } },
    { say:"Now the two-name mystery: some keys have <b>two names</b>! C♯ = D♭, F♯ = G♭, A♯ = B♭… Same key, same sound, different spelling — <b>enharmonic notes</b>. \u{1F447} <b>Prove it on the keyboard — click the key that is BOTH C♯ and D♭:</b>",
      try:{ type:"custom",
        hint:"One half step RIGHT of C — or one half step LEFT of D. Same place!",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="en-kb"></div>`;
          let done=false;
          Keyboard.create(container.querySelector(".en-kb"),{start:60,octaves:1,labels:true,
            onKey:m=>{
              if(done) return;
              if(m===61){ done=true;
                fb(true,"✓ That single black key answers to BOTH names: C♯ (approaching from C) and D♭ (approaching from D). Enharmonic twins!"); }
              else fb(false,"Find the black key between C and D — right of C, left of D.");
            }});
        } } },
    { say:"Match the enharmonic pairs! \u{1F447} <b>For each sharp name, pick its flat twin:</b>",
      try:{ type:"custom",
        hint:"The sharp of one letter = the flat of the NEXT letter up.",
        mount:(container,fb)=>{
          const PAIRS=[["C♯","D♭"],["D♯","E♭"],["F♯","G♭"],["G♯","A♭"],["A♯","B♭"]];
          const seq=[...PAIRS].sort(()=>Math.random()-.5);
          let i=0;
          container.innerHTML=`<div class="big-q ep-q" style="text-align:center"></div>
            <div class="choices chips ep-ch"></div>`;
          const q=container.querySelector(".ep-q"), ch=container.querySelector(".ep-ch");
          ["D♭","E♭","G♭","A♭","B♭"].forEach(o=>{ const b=document.createElement("button"); b.textContent=o;
            b.onclick=()=>{
              const cur=seq[i];
              if(o===cur[1]){ MFAudio.tone({C:61,D:63,F:66,G:68,A:70}[cur[0][0]],.35); i++;
                if(i>=seq.length){ ch.style.display="none"; q.textContent="All five pairs matched!";
                  fb(true,"✓ C♯=D♭ · D♯=E♭ · F♯=G♭ · G♯=A♭ · A♯=B♭ — five keys, ten names!"); }
                else { fb(true,`✓ ${cur[0]} = ${cur[1]} — same key, two names. Next…`); ask(); } }
              else { MFAudio.tone(40,.25); fb(false,"The flat twin uses the NEXT letter up: C♯ pairs with D-something…"); }
            };
            ch.appendChild(b); });
          function ask(){ q.innerHTML=`Pair ${i+1} of ${seq.length}: which note sounds the same as <b>${seq[i][0]}</b>?`; }
          ask();
        } } },
    { say:"Why the sneaky white-key half steps? Look: between <b>E–F</b> and <b>B–C</b> there is <b>no black key</b> — so those neighbors are already half steps! \u{1F447} <b>Final check — which white-key pairs are half steps?</b>",
      try:{ type:"mc",
        choices:["E–F and B–C","C–D and F–G","A–B and D–E"], answer:0,
        success:"✓ The two famous white-key half steps — no black key between them. Everything else white-to-white is a whole step!",
        fail:"Look at the keyboard: which white neighbors have NO black key between them?",
        hint:"The two “missing black key” spots." } }
  ],
  examples:[
    { caption:"Half steps on the staff: C→C♯ (with an accidental) and E→F (pure white keys) — both the very next key.",
      staff:{clef:"treble",tempo:80,notes:[{p:"C4",d:"q",label:"C"},{p:"C#4",d:"q",label:"C♯"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F"}],width:420} },
    { caption:"Whole steps: C→D, F→G, A→B — each skips exactly one key. H + H = W.",
      staff:{clef:"treble",tempo:80,notes:[{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"},{p:"A4",d:"q",label:"A"},{p:"B4",d:"q",label:"B"}],width:460} }
  ],
  games:[
    { type:"term-race", title:"Game 1 · Enharmonic Twin Race",
      intro:"A note flashes — name its twin! All five black-key pairs at speed.",
      miaIntro:"Twin-matching at full speed! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["C♯","D♭ — the same black key"],
        ["D♯","E♭ — the same black key"],
        ["F♯","G♭ — the same black key"],
        ["G♯","A♭ — the same black key"],
        ["A♯","B♭ — the same black key"]]},
      result:(score)=>score>=7?"Every twin matched instantly!":null },
    { type:"symbol-hunt", title:"Game 2 · Accidental Review Hunt",
      intro:"Sharp, flat, natural — your full accidental kit, one last hunt!",
      miaIntro:"Final review hunt — all three signs! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Sharp (F♯)", spec:{clef:"treble",notes:[{p:"F#4",d:"q"}]}},
        {label:"Flat (B♭)", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}]}},
        {label:"Natural (F♮)", spec:{clef:"treble",notes:[{p:"F4",acc:"n",d:"q"}]}},
        {label:"Plain note", spec:{clef:"treble",notes:[{p:"G4",d:"q"}]}},
        {label:"Eighth Rest", spec:{clef:"treble",notes:[{rest:"8"}]}}]},
      result:(score)=>score>=5?"The accidental family holds no secrets!":null },
    { type:"term-race", title:"Game 3 · Step & Twin Vocabulary",
      intro:"Half steps, whole steps, enharmonics — the final vocabulary dash of the unit!",
      miaIntro:"Last vocabulary race of the unit! \u{1F3C1}",
      spec:{rounds:8, pool:[
        ["Half Step","The distance to the VERY next key"],
        ["Whole Step","Two half steps — one key skipped"],
        ["Enharmonic Notes","Same sound, different names (C♯ = D♭)"],
        ["Interval","The distance between two notes"],
        ["E–F and B–C","The two white-key half steps"],
        ["H + H","= one Whole step"]]},
      result:(score)=>score>=7?"Vocabulary complete — fully loaded!":null },
    { type:"value-race", title:"Game 4 · GRAND Value Sprint (45s)",
      intro:"The grand finale sprint: every note value you've learned since Lesson 6!",
      miaIntro:"The grand sprint — everything you've got! \u{1F3C6}",
      spec:{seconds:45, ask:"beats", values:["8","q","q.","h","h.","w"]},
      result:(score)=>score>=13?score+" — a champion finish!":null }
  ],
  practiceIntro:"20 practice questions — half steps, whole steps, enharmonic twins, and the white-key surprises. Answer right and the next appears automatically!",
  practice:[
    { gen:"step-type", params:{}, count:5 },
    { gen:"enharmonic", params:{}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Half Step","The distance to the very next key"],["Whole Step","Two half steps — one key skipped"],["Enharmonic Notes","Same sound, different names"],["Interval","The distance between two notes"]], reverse:true}, count:3 },
    { gen:"click-key", params:{letters:["C","F","E","B"], octaves:[4]}, count:2 },
    { type:"mc", q:"A half step is…", choices:["the distance to the VERY next key","two keys apart","any black key"], answer:0,
      explain:"Nothing skipped — the immediate neighbor." },
    { type:"mc", q:"A whole step equals…", choices:["two half steps","half of a half step","three keys"], answer:0,
      explain:"H + H = W — one key skipped." },
    { type:"truefalse", q:"E to F is a half step.", answer:true,
      explain:"No black key between — already neighbors." },
    { type:"truefalse", q:"B to C is a whole step.", answer:false,
      explain:"Half step! The other white-key surprise." },
    { type:"mc", q:"C♯ and D♭ are…", choices:["the same key with two names","two different keys","an octave apart"], answer:0,
      explain:"Enharmonic — one key, two spellings." },
    { type:"truefalse", q:"Enharmonic notes sound exactly the same on the piano.", answer:true,
      explain:"Identical sound, different name tags." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The note F is ____ half step(s) above E.", choices:["1","2","½"], answer:0, explain:"E–F is a natural half step — no key between." },
    { type:"mc", q:"The note D is ____ whole step(s) above C.", choices:["1","2","½"], answer:0, explain:"C–D skips C♯: one whole step." },
    { type:"mc", q:"The note F is ____ whole step(s) below G.", choices:["1","2","½"], answer:0, explain:"G down to F skips F♯/G♭: one whole step." },
    { type:"mc", q:"Name two notes that are a half step away from A.", choices:["G♯ (below) and B♭ (above)","G and B","F and C"], answer:0, explain:"One key left = G♯/A♭; one key right = A♯/B♭." },
    { type:"mc", q:"The enharmonic note for E♯ is…", choices:["F","D♯","G♭"], answer:0, explain:"E♯ is a half step above E — the very key F. White-key enharmonics exist too!" },
    { type:"mc", q:"The enharmonic note for C♭ is…", choices:["B","D♭","C♯"], answer:0, explain:"C♭ is a half step below C — the key B." }
  ],
  miaQuizIntro:"A milestone quiz! Half steps, whole steps, twins — finish strong!",
  quiz:[
    { type:"mc", q:"How many half steps equal one whole step?", choices:["1","2","3","4"], answer:1,
      explain:"H + H = W.", hint:"The golden equation." },
    { type:"mc", q:"What is an enharmonic note?", choices:["Two notes with different rhythms","Two notes that sound the same but have different names","Two notes in different octaves","Two notes played together"], answer:1,
      explain:"Same key, two names — like C♯ and D♭.", hint:"The two-name mystery." },
    { type:"mc", q:"Which note is enharmonic with A♯?", choices:["A♭","B♭","C♭","G♯"], answer:1,
      explain:"A♯ and B♭ share one black key.", hint:"Next letter up, flattened." },
    { type:"truefalse", q:"The distance from E to F is a half step.", answer:true,
      explain:"No key between them.", hint:"Check for a black key." },
    { type:"truefalse", q:"The distance from B to C is a whole step.", answer:false,
      explain:"Half step — the other white-key pair.", hint:"Any black key between B and C?" },
    { type:"truefalse", q:"C♯ and D♭ sound the same on a piano.", answer:true,
      explain:"Enharmonic twins — one key.", hint:"You proved it on the keyboard!" },
    { type:"mc", q:"Which pair is enharmonic?", choices:["F♯ and G♭","F♯ and E♭","C♯ and B♭"], answer:0,
      explain:"F♯ = G♭ — same black key.", hint:"Neighboring letters." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Half Step → next adjacent key · Whole Step → two half steps · Enharmonic → same sound, different names",
               "Half Step → two keys · Whole Step → next key · Enharmonic → different sounds",
               "Half Step → an octave · Whole Step → a fifth · Enharmonic → the same name"], answer:0,
      explain:"The three big ideas of this lesson.", hint:"Small, double, twins." },
    { type:"mc", q:"A whole step is equal to ____ half steps.", choices:["2","3","4"], answer:0,
      explain:"Two.", hint:"H + H." },
    { type:"mc", q:"The enharmonic twin of A♯ is ____.", choices:["B♭","A♭","G♯"], answer:0,
      explain:"Same black key between A and B.", hint:"Approach from B." },
    { type:"mc", q:"From C to D is a…",
      staff:{clef:"treble",notes:[{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"}],width:280},
      choices:["Whole step","Half step"], answer:0,
      explain:"C♯ sits between them — one key skipped = whole step.", hint:"Is anything between C and D?" },
    { type:"mc", q:"Which statement is correct?",
      choices:["C♯ and D♭ are different piano keys","A whole step equals one half step","The distance from E to F is a half step because there is no key between them","Enharmonic notes always have different sounds"], answer:2,
      explain:"E–F: white neighbors with no black key between — a natural half step.",
      hint:"The white-key surprise." },
    { type:"mc", q:"The enharmonic note for B♯ is…", choices:["C","A♯","B♭"], answer:0,
      explain:"A half step above B is C — enharmonic pairs can sit on white keys.", hint:"B–C is already a half step." },
    { type:"mc", q:"The enharmonic note for F♭ is…", choices:["E","G♭","F♯"], answer:0,
      explain:"A half step below F is E.", hint:"E–F is already a half step." },
    /* generated */
    { gen:"step-type", params:{}, count:4 },
    { gen:"enharmonic", params:{}, count:3 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"The distance from any key on the keyboard to the very next key above or below, whether black or white.", term:"Half Step (H)"},
    {def:"The distance from any key on the keyboard to two keys above or below.", term:"Whole Step (W)"},
    {def:"Two notes that sound the same but are written differently.", term:"Enharmonic Notes"},
    {def:"The distance between two notes.", term:"Interval"},
    {def:"The two natural half steps on the keyboard — no black key in between.", term:"E–F and B–C"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Half step</b> = the VERY next key \u{1F463} · <b>Whole step</b> = two half steps \u{1F3C3}.",
    "✔ <b>H + H = W</b>.",
    "✔ <b>E–F and B–C</b> are half steps — no black key between!",
    "✔ <b>Enharmonic notes</b>: same key, same sound, two names (C♯ = D♭).",
    "✔ \u{1F389} <b>LESSONS 1–25 COMPLETE</b> — staff, rhythm, expression, accidentals, intervals!"
  ],
  tips:[
    "At any piano, play E–F and B–C slowly — feel how CLOSE those white neighbors are.",
    "Which name to use — C♯ or D♭? Context decides; for now, know they're the same key.",
    "Half steps are the atoms of music — scales and keys (coming in Lesson 26!) are built from H and W patterns.",
    "\u{1F393} You finished the first 25 lessons! Next up: tetrachords and major scales. See you there!"
  ],
  rewards:{ badge:"25-Lesson Graduate", icon:"\u{1F393}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score on this milestone lesson?! Take a bow, graduate — the major scales await! \u{1F393}\u{1F389}\u{1F389}",
  miaPass:"You passed — the first 25 lessons complete! Every step from the empty staff to enharmonic twins. Review below, or celebrate and meet me in Lesson 26!",
  mia:{
    hook:{ label:"the welcome",
      explain:"One black key, two names: C♯ approached from C, D♭ approached from D. Same sound — enharmonic.",
      play:()=>{MFAudio.tone(61,.6,0);MFAudio.tone(61,.6,.7);} },
    learn:{ label:"steps and twins",
      explain:"Half step = very next key; whole step = two halves (skip one key); E–F and B–C are white-key half steps; enharmonic notes share one key with two names.",
      hint:"Check the space BETWEEN keys: empty = half, one key = whole.",
      play:()=>{MFAudio.tone(60,.4,0);MFAudio.tone(61,.4,.45);MFAudio.tone(60,.4,1.1);MFAudio.tone(62,.4,1.55);} },
    example:{ label:"the examples",
      explain:"Half steps with and without accidentals, then whole steps skipping one key each — the two building blocks of every scale." },
    game:{ label:"the games",
      explain:"Race the twins, hunt the signs one last time, dash the vocabulary, and sprint every value you know.",
      hint:"Finish strong — this is a milestone finale!" },
    quiz:{ label:"this question",
      explain:"Three ideas: half = next key, whole = two halves, enharmonic = one key with two names. Plus the E–F/B–C surprise.",
      play:()=>{MFAudio.tone(64,.4,0);MFAudio.tone(65,.6,.5);} }
  }
};
