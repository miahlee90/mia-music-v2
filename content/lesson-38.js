/* Lesson 38 — Solfège and Transposition (AEMT Book 2, Unit 9)
   Built from drafts/UNIT 9 – Lesson 38.md; AEMT p.59 verified by render.
   Movable Do: syllables ride scale DEGREES, not fixed pitches.
   Transposition: same intervals/syllables, new keynote (B&S Ch.3: interval method).
   Uses quiz.js v5.4 solfege-id generator; melodies kept accidental-free (C↔G).
   NOTE: edit by FULL-FILE REWRITE only. */

/* solfège climber: press the scale on the keyboard; each key gets its syllable badge.
   Round 1 = C major (badges on white keys); round 2 = G major (F♯ included!). */
function MF_L38_climb(container,fb){
  const ROUNDS=[
    {key:"C", seq:[60,62,64,65,67,69,71,72], names:["C","D","E","F","G","A","B","C"], start:60, octaves:1},
    {key:"G", seq:[67,69,71,72,74,76,78,79], names:["G","A","B","C","D","E","F♯","G"], start:60, octaves:2}];
  const SYL=["Do","Re","Mi","Fa","Sol","La","Ti","Do"];
  const WHITES=[0,2,4,5,7,9,11];
  let r=0,k=0,kb=null,pressed=[];
  container.innerHTML=`<div class="big-q l38-q" style="text-align:center"></div>
    <div class="l38-cnt" style="text-align:center;font-weight:800;font-size:1.1rem;min-height:26px;color:var(--correct)"></div>
    <div class="l38-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">Movable Do: the KEYNOTE is always Do — no matter which key you're in!</p>`;
  const q=container.querySelector(".l38-q"), cnt=container.querySelector(".l38-cnt"), kbHolder=container.querySelector(".l38-kb");
  function badge(m,txt,start){
    const rel=m-start, oct=Math.floor(rel/12), wi=WHITES.indexOf(rel%12);
    if(wi<0) return;
    const keyEl=kb.el.children[oct*7+wi]; if(!keyEl) return;
    keyEl.insertAdjacentHTML("beforeend",`<div style="position:absolute;top:6px;left:0;width:100%;text-align:center;font-weight:800;font-size:13px;color:var(--primary);pointer-events:none">${txt}</div>`);
  }
  function ask(){
    const cur=ROUNDS[r]; k=0; pressed=[]; cnt.textContent="";
    q.innerHTML=`Climb ${r+1} of ${ROUNDS.length}: sing the <b>${cur.key} major</b> scale in solfège — press each key, starting on <b>${cur.key} = Do</b>!`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:cur.start,octaves:cur.octaves,labels:true,point:cur.seq[0],
      onKey:m=>{
        const c=ROUNDS[r];
        if(m===c.seq[k]){
          pressed.push(m); kb.mark(pressed); kb.point(null); MFAudio.tone(m,.3); badge(m,SYL[k],c.start);
          cnt.textContent=c.seq.slice(0,k+1).map((x,i2)=>`${c.names[i2]}=${SYL[i2]}`).join("  ");
          k++;
          if(k>=c.seq.length){ r++;
            if(r>=ROUNDS.length){ q.textContent="Two keys, one set of syllables!";
              fb(true,"✓ G major: G=Do A=Re B=Mi C=Fa D=Sol E=La F♯=Ti G=Do. The note names changed, the syllables never did — THAT is movable Do."); }
            else { fb(true,"✓ C major in solfège — complete! Now watch what happens when Do MOVES to G…"); setTimeout(ask,1500); } } }
        else { MFAudio.tone(40,.2);
          fb(false, k===0? `Do first! In ${c.key} major, Do is ${c.key} — the key with the red arrow.` :
            (c.key==="G"&&c.names[k]==="F♯")? "Careful — G major's 7th note (Ti) is the BLACK key F♯, not F!" :
            `Next syllable is ${SYL[k]} — one scale step up from ${c.names[k-1]}.`); }
      }});
  }
  ask();
}

/* transposition machine: melody in C — rebuild it in G by picking each new note.
   Same syllables, new letters; every interval preserved. */
function MF_L38_machine(container,fb){
  const MEL=[{c:"C",g:"G",syl:"Do"},{c:"D",g:"A",syl:"Re"},{c:"E",g:"B",syl:"Mi"},{c:"G",g:"D",syl:"Sol"}];
  const OPTS=["G","A","B","C","D","E"];
  const CP={C:"C4",D:"D4",E:"E4",G:"G4"}, GP={G:"G4",A:"A4",B:"B4",D:"D5"};
  let i=0;
  container.innerHTML=`<div class="big-q l38-mq" style="text-align:center"></div>
    <div class="l38-mstaff"></div>
    <div class="l38-msyl" style="text-align:center;font-weight:800;min-height:24px;color:var(--correct)"></div>
    <div class="choices chips l38-mch"></div>`;
  const q=container.querySelector(".l38-mq"), holder=container.querySelector(".l38-mstaff"),
        syl=container.querySelector(".l38-msyl"), ch=container.querySelector(".l38-mch");
  function draw(){
    const done=MEL.slice(0,i).map(n=>({p:GP[n.g],d:"q",label:n.g}));
    const spec={clef:"treble",tempo:100,notes:[
      {p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"G4",d:"q",label:"G"},{bar:"double"},
      ...done]};
    spec.width=340+done.length*40;
    Staff.render(holder,spec);
    syl.textContent="syllables: Do Re Mi Sol → "+MEL.slice(0,i).map(n=>n.syl).join(" ");
  }
  function ask(){
    draw();
    q.innerHTML=`The melody C-D-E-G is in C major. Transpose it UP a Perfect 5th into <b>G major</b> — note ${i+1} of ${MEL.length}: what does <b>${MEL[i].c} (${MEL[i].syl})</b> become?`;
    ch.innerHTML="";
    OPTS.forEach(o=>{ const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const cur=MEL[i];
        if(o===cur.g){ i++; MFAudio.tone(MFAudio.midi(GP[cur.g]),.35); draw();
          if(i>=MEL.length){ ch.style.display="none"; q.textContent="Transposition complete!";
            const spec={clef:"treble",tempo:110,notes:[
              {p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{bar:"double"},{ksig:"G"},
              {p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"},{bar:"final"}],width:520};
            const api=Staff.render(holder,spec); setTimeout(()=>Staff.play(spec,api),400);
            fb(true,"✓ C-D-E-G became G-A-B-D — every note up a Perfect 5th, every interval preserved, syllables still Do-Re-Mi-Sol. Press play and hear the same tune, higher!"); }
          else { fb(true,`✓ ${cur.c} → ${o} (${cur.syl} stays ${cur.syl}). Next note…`); } }
        else { MFAudio.tone(40,.2); fb(false,`Move ${cur.c} UP a Perfect 5th — count 5 letters: ${cur.c} as 1…`); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[38]={
  welcome:"Do-Re-Mi isn't just a movie song — it's how musicians name melody in ANY key. \u{1F3A4}",
  hook:{
    say:"The same tune, played twice — once low, once high. Press both. <b>Is it the same melody?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version 1</button>
          <button class="play hk-b">▶ Version 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Same melody — just higher the second time</button><button>Two different melodies</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const play=(base)=>{[0,2,4,7].forEach((s,ix)=>MFAudio.tone(base+s,.32,ix*.38));};
        container.querySelector(".hk-a").onclick=()=>{ play(60); hA=true; if(hB) setTimeout(()=>ch.style.display="",1800); };
        container.querySelector(".hk-b").onclick=()=>{ play(67); hB=true; if(hA) setTimeout(()=>ch.style.display="",1800); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Same melody, same intervals, same SHAPE — only the starting note moved from C to G. That move is called TRANSPOSITION, and the syllable system that survives it is called SOLFÈGE. Both are today's lesson.");
          else fb(false,"Hum along with both — does the shape of the tune change?");
        });
      } }
  },
  objectives:[
    "Name the seven solfège syllables in order",
    "Explain the movable-Do system",
    "Sing/press any major scale in solfège",
    "Define transposition",
    "Transpose a melody up or down by an interval",
    "Explain what changes and what stays the same"
  ],
  steps:[
    { say:"<b>SOLFÈGE</b> assigns a singable syllable to each note of the major scale: <b>Do, Re, Mi, Fa, Sol, La, Ti</b> — then Do again at the octave. Numbers 1-8, but voice-friendly. \u{1F447} <b>Which syllable is scale degree 5?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"Do"},{p:"D4",d:"q",label:"Re"},{p:"E4",d:"q",label:"Mi"},{p:"F4",d:"q",label:"Fa"},{p:"G4",d:"q",label:"Sol"},{p:"A4",d:"q",label:"La"},{p:"B4",d:"q",label:"Ti"},{p:"C5",d:"q",label:"Do"}],width:520} },
      try:{ type:"mc", choices:["Sol","Fa","La"], answer:0,
        success:"✓ Do(1) Re(2) Mi(3) Fa(4) SOL(5). Sing the ladder until it's automatic!",
        fail:"Count up: Do, Re, Mi, Fa…",
        hint:"Do-Re-Mi-Fa-?" } },
    { say:"The magic ingredient is <b>MOVABLE DO</b>: Do is always the tonic (keynote) of the current key. In C major, Do = C. In G major, Do = G. A note's letter name never changes — but the syllable it carries shifts with the key: the note G is Sol in C major and Do in G major. \u{1F447} <b>In F major, which note is Do?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,keysig:"F",notes:[
        {p:"F4",d:"q",label:"Do"},{p:"G4",d:"q",label:"Re"},{p:"A4",d:"q",label:"Mi"},{p:"Bb4",d:"q",acc:"none",label:"Fa"},{p:"C5",d:"q",label:"Sol"},{p:"D5",d:"q",label:"La"},{p:"E5",d:"q",label:"Ti"},{p:"F5",d:"q",label:"Do"}],width:520} },
      try:{ type:"mc", choices:["F — the keynote","C — always C","B♭ — the flat"], answer:0,
        success:"✓ Do = the keynote, wherever you are. F major → F is Do (and B♭ is Fa).",
        fail:"Movable Do follows the KEY, not the letter C.",
        hint:"Which note is F major named after?" } },
    { say:"Climb it yourself — two keys, same syllables. \u{1F447} <b>Press each scale in solfège, keynote first:</b>",
      try:{ type:"custom",
        hint:"Round 2 is G major — remember its key signature: F♯! Ti will be a black key.",
        mount:(container,fb)=>MF_L38_climb(container,fb) } },
    { say:"Why do musicians bother? Because solfège names the <b>RELATIONSHIPS</b>, not the letters. 'Do-Mi-Sol' describes the same shape in every key — which is why singers can read a melody in any key at sight. \u{1F447} <b>What does each solfège syllable stand for?</b>",
      try:{ type:"mc", choices:["A scale degree — a position in the current key","One fixed piano key","A rhythm value"], answer:0,
        success:"✓ Syllables ride the scale DEGREES. Mi is always degree 3 — whatever note that happens to be today.",
        fail:"If Do can move, syllables can't be glued to fixed keys…",
        hint:"Degree, not letter." } },
    { say:"Now the second big idea: <b>TRANSPOSITION</b> — rewriting a melody in a different key, keeping <b>every interval exactly the same</b>. The tune sounds higher or lower, but its shape is untouched. Why? To fit a singer's range, or an instrument's tuning. \u{1F447} <b>After transposing, what stays the SAME?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"Do"},{p:"D4",d:"q",label:"Re"},{p:"E4",d:"q",label:"Mi"},{p:"G4",d:"q",label:"Sol"},{bar:"double"},{ksig:"G"},
        {p:"G4",d:"q",label:"Do"},{p:"A4",d:"q",label:"Re"},{p:"B4",d:"q",label:"Mi"},{p:"D5",d:"q",label:"Sol"},{bar:"final"}],
        brackets:[{from:0,to:3,label:"in C major"},{from:6,to:9,label:"in G major"}],width:600} },
      try:{ type:"mc", choices:["The intervals and the melody's shape","The letter names","The starting pitch"], answer:0,
        success:"✓ Intervals, shape, syllables — all preserved. Only the letters and the key signature change.",
        fail:"The notes clearly changed (C-D-E-G → G-A-B-D)… so what survived?",
        hint:"Hum both — what's identical?" } },
    { say:"The standard method is <b>transposing by interval</b>: choose the interval of transposition, then move <b>every single note</b> by exactly that interval. Up a Perfect 5th: C→G, D→A, E→B, G→D. \u{1F447} <b>Run the machine — transpose the melody note by note:</b>",
      try:{ type:"custom",
        hint:"Every note moves UP a Perfect 5th — count 5 letter names, starting on the note itself as 1.",
        mount:(container,fb)=>MF_L38_machine(container,fb) } },
    { say:"Last detail: the transposed melody lives in a <b>new key</b> — so it needs that key's <b>KEY SIGNATURE</b>. Transpose from C major up to G major and the new version carries one sharp (F♯), even if no F appears in the tune. The signature announces the new home. \u{1F447} <b>A melody transposed from C major to G major gets which key signature?</b>",
      try:{ type:"mc", choices:["One sharp (F♯)","No sharps or flats","One flat (B♭)"], answer:0,
        success:"✓ G major = 1 sharp. New key, new signature — always update it when you transpose.",
        fail:"What is G major's key signature? (Lesson 29 knows…)",
        hint:"G major carries exactly one sharp." } }
  ],
  examples:[
    { caption:"The solfège ladder in C major — sing along as it plays: Do Re Mi Fa Sol La Ti Do!",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"Do"},{p:"D4",d:"q",label:"Re"},{p:"E4",d:"q",label:"Mi"},{p:"F4",d:"q",label:"Fa"},{p:"G4",d:"q",label:"Sol"},{p:"A4",d:"q",label:"La"},{p:"B4",d:"q",label:"Ti"},{p:"C5",d:"q",label:"Do"}],width:520},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"One melody, two homes: Do-Re-Mi-Sol in C major, then the identical shape up a Perfect 5th in G major. Same intervals, same syllables — press play and hear the tune simply lift.",
      staff:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"Do"},{p:"D4",d:"q",label:"Re"},{p:"E4",d:"q",label:"Mi"},{p:"G4",d:"q",label:"Sol"},{bar:"double"},{ksig:"G"},
        {p:"G4",d:"q",label:"Do"},{p:"A4",d:"q",label:"Re"},{p:"B4",d:"q",label:"Mi"},{p:"D5",d:"q",label:"Sol"},{bar:"final"}],
        brackets:[{from:0,to:3,label:"C major"},{from:6,to:9,label:"G major — up a P5"}],width:600},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Syllable Sprint (45s)",
      intro:"Which syllable lands on that note? Movable Do, three keys, full speed!",
      miaIntro:"Do is on the move — chase it! \u{1F3C3}",
      spec:{gen:"solfege-id", params:{keys:["C","G","F"],ask:"syllable"}, seconds:45},
      result:(score)=>score>=8?score+" syllables pinned in 45 seconds — sight-singer material!":null },
    { type:"gen-race", title:"Game 2 · Find the Note (10 rounds)",
      intro:"Reverse gear: given the syllable, name the NOTE in each key!",
      miaIntro:"Now hunt the letters! \u{1F50D}",
      spec:{gen:"solfege-id", params:{keys:["C","G","F","D"],ask:"note"}, rounds:10},
      result:(score)=>score>=8?"Four keys, no misses — movable Do fully installed!":null },
    { type:"key-climb", title:"Game 3 · Do-Re-Mi Dash",
      intro:"Race up the C major scale in solfège — every key in order, against the clock!",
      miaIntro:"Sing it as you press it! \u{1F3A4}",
      spec:{seq:[60,62,64,65,67,69,71,72], names:["Do","Re","Mi","Fa","Sol","La","Ti","Do"], start:60, octaves:1,
        title:"Press the C major scale: Do Re Mi Fa Sol La Ti Do"},
      result:(score)=>score!==null?"The ladder is in your fingers AND your voice!":null },
    { type:"term-race", title:"Game 4 · Solfège & Transposition Vocabulary",
      intro:"Solfège, movable Do, transposition — match the big ideas at speed!",
      miaIntro:"Final vocabulary dash of Unit 9! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Solfège","Syllables assigned to the scale degrees: Do Re Mi Fa Sol La Ti"],
        ["Movable Do","Do is always the keynote of the current key"],
        ["Transposition","Rewriting a melody in a different key, intervals unchanged"],
        ["Do","The keynote's syllable in every major key"],
        ["Ti","Scale degree 7 — one half step below Do"],
        ["Interval of transposition","The distance every note moves during a transposition"]]},
      result:(score)=>score>=7?"Unit 9 vocabulary: complete!":null }
  ],
  practiceIntro:"20 practice questions — syllables, movable Do, and transposition logic. Answer right and the next appears automatically!",
  practice:[
    { gen:"solfege-id", params:{keys:["C","G","F"],ask:"syllable"}, count:5 },
    { gen:"solfege-id", params:{keys:["C","G","F","D"],ask:"note"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Solfège","syllables for the scale degrees"],["Movable Do","Do = the keynote of the current key"],["Transposition","rewriting a melody in a different key"],["Scale degree","a note's position within its scale"]], reverse:true}, count:3 },
    { type:"mc", q:"The solfège syllables in order are…", choices:["Do Re Mi Fa Sol La Ti","Do Mi Re Fa Sol Ti La","Do Re Mi Sol Fa La Ti"], answer:0,
      explain:"Do Re Mi Fa Sol La Ti — then Do again." },
    { type:"mc", q:"In G major, Ti is sung on…", choices:["F♯","F","E"], answer:0,
      explain:"G major's 7th degree is F♯ — the key signature note!" },
    { type:"mc", q:"Transposition is when a melody is rewritten in another…", choices:["key","clef","rhythm"], answer:0,
      explain:"New key, same intervals." },
    { type:"mc", q:"Transpose C-D-E up a Major 2nd:", choices:["D-E-F♯","D-E-F","C♯-D♯-E♯"], answer:0,
      explain:"Each note up a M2: C→D, D→E, E→F♯ (E to F is only a half step!)." },
    { type:"truefalse", q:"After transposition, the intervals between the notes stay exactly the same.", answer:true,
      explain:"That's the definition — only the starting pitch (and key) changes." },
    { type:"truefalse", q:"In movable Do, the syllable Do always means the note C.", answer:false,
      explain:"Do = the KEYNOTE of the current key — it moves!" },
    { type:"mc", q:"A melody in C major is transposed up a P5. Its new key signature is…", choices:["1 sharp","no accidentals","1 flat"], answer:0,
      explain:"Up a P5 from C = G major = F♯." }
  ],
  miaQuizIntro:"Sing the ladder, move the Do, lift the melody — final quiz of Unit 9!",
  quiz:[
    { type:"mc", q:"Solfège is a system that…", choices:["names rhythms with numbers","assigns syllables to the scale degrees","replaces key signatures","tunes the piano"], answer:1,
      explain:"Do Re Mi Fa Sol La Ti — one syllable per degree.", hint:"Sing-able names for 1-8." },
    { type:"mc", q:"In the movable-Do system, Do is always…", choices:["middle C","the keynote of the current key","the lowest note of the melody","A 440"], answer:1,
      explain:"Do follows the key — C in C major, G in G major.", hint:"MOVABLE Do." },
    { type:"mc", q:"The syllable for scale degree 4 is…", choices:["Fa","Mi","Sol","Re"], answer:0,
      explain:"Do(1) Re(2) Mi(3) FA(4).", hint:"Count up from Do." },
    { type:"mc", q:"In G major, the note B is sung as…", choices:["Mi","Ti","Sol","Do"], answer:0,
      explain:"G=Do, A=Re, B=Mi — degree 3.", hint:"Count from G as Do." },
    { type:"truefalse", q:"In F major, Do is F.", answer:true,
      explain:"The keynote is always Do.", hint:"Which note names the key?" },
    { type:"truefalse", q:"When a melody is transposed, its intervals change size.", answer:false,
      explain:"Intervals are preserved exactly — that's the whole point.", hint:"What makes it the SAME tune?" },
    { type:"mc", q:"Transposition means…", choices:["rewriting a melody in a different key with the same intervals","playing a melody backwards","changing the rhythm of a melody","removing the key signature"], answer:0,
      explain:"Same shape, new home.", hint:"Trans- = across (keys)." },
    { type:"mc", q:"Why do musicians transpose melodies?", choices:["To fit a singer's range or an instrument's key","To make the melody harder","To avoid writing key signatures","To change the time signature"], answer:0,
      explain:"Ranges and instrument keys are the classic reasons.", hint:"Think of a song pitched too high to sing." },
    { type:"mc", q:"Transpose the melody C-E-G up a Major 2nd:", choices:["D-F♯-A","D-F-A","E-G-B"], answer:0,
      explain:"C→D, E→F♯ (a M2 is 2 half steps — F is only 1!), G→A.", hint:"Every note exactly 2 half steps up." },
    { type:"mc", q:"A melody in C major is transposed UP a Perfect 5th. The new key and signature are…", choices:["G major — 1 sharp","F major — 1 flat","D major — 2 sharps"], answer:0,
      explain:"C up a P5 = G; G major carries F♯.", hint:"Count 5 letters up from C." },
    { type:"mc", q:"What is the solfège of this melody?",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"}],width:320},
      choices:["Do Mi Sol Do","Do Re Mi Fa","Do Fa La Do"], answer:0,
      explain:"In C major: C=Do, E=Mi, G=Sol, C=Do.", hint:"Degrees 1-3-5-8." },
    { type:"mc", q:"After transposing, what must be updated at the start of the staff?", choices:["the key signature","the clef","the bar lines"], answer:0,
      explain:"The new key's signature announces the new home.", hint:"New key = new…?" },
    { type:"mc", q:"Which stays the SAME after transposition?", choices:["the melody's intervals and shape","the letter names","the keynote","the key signature"], answer:0,
      explain:"Shape and intervals survive; letters, keynote, and signature all change.", hint:"What did the hook prove?" },
    /* generated */
    { gen:"solfege-id", params:{keys:["C","G","F"],ask:"syllable"}, count:3 },
    { gen:"solfege-id", params:{keys:["C","G","F","D"],ask:"note"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Solfège","syllables for the scale degrees"],["Movable Do","Do = the keynote of the current key"],["Transposition","rewriting a melody in a different key"],["Ti","scale degree 7"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Solfège", def:"A system that assigns syllables — Do, Re, Mi, Fa, Sol, La, Ti — to the scale degrees of a major scale."},
    {term:"Movable Do", def:"The system in which Do is always the keynote (tonic) of the current major key — syllables follow the key, not fixed pitches."},
    {term:"Transposition", def:"Rewriting or performing a melody in a different key while preserving the same intervals and melodic relationships."},
    {term:"Scale Degree", def:"The position of a note within a scale — degree 1 is the keynote, degree 5 is Sol, and so on."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Solfège</b>: Do Re Mi Fa Sol La Ti (Do) — singable names for scale degrees 1-8.",
    "✔ <b>Movable Do</b>: Do = the keynote of the CURRENT key. G major → G is Do and F♯ is Ti.",
    "✔ Syllables name <b>relationships</b>, not letters — 'Do-Mi-Sol' is the same shape in every key.",
    "✔ <b>Transposition</b> = same melody, new key: every note moves by the same interval; every interval is preserved.",
    "✔ After transposing, write the <b>new key signature</b> — the melody has a new home."
  ],
  tips:[
    "Sing the scale in solfège daily — up AND down (Do Ti La Sol Fa Mi Re Do). Down is where most people wobble.",
    "Transposing by interval? Move every note the SAME distance, and double-check any spot where the letters step E→F or B→C — the half steps hide there.",
    "Solfège + transposition are the same insight twice: music lives in RELATIONSHIPS, not fixed letters.",
    "Unit 9 complete! Next up: Unit 10 — sixteenth notes, and rhythm gets twice as fast."
  ],
  rewards:{ badge:"Melody Mover", icon:"\u{1F3A4}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — Do would follow YOU anywhere! \u{1F3A4}\u{1F389}",
  miaPass:"Passed! Keep singing: Do Re Mi Fa Sol La Ti Do — in every key you meet.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both versions were Do-Re-Mi-Sol: first from C, then from G — the same melody transposed up a Perfect 5th. Shape preserved, letters changed.",
      play:()=>{[0,2,4,7].forEach((s,ix)=>MFAudio.tone(60+s,.3,ix*.35));[0,2,4,7].forEach((s,ix)=>MFAudio.tone(67+s,.3,1.7+ix*.35));} },
    learn:{ label:"solfège & transposition",
      explain:"Do Re Mi Fa Sol La Ti ride the scale degrees; Do is always the keynote (movable Do). Transposition moves every note by one fixed interval — shape and syllables survive.",
      hint:"Do = keynote. Intervals never change.",
      play:()=>{[60,62,64,65,67].forEach((m,ix)=>MFAudio.tone(m,.25,ix*.3));} },
    example:{ label:"the examples",
      explain:"Example 1 is the solfège ladder in C; example 2 lifts one melody from C major to G major — identical shape, new key signature." },
    game:{ label:"the games",
      explain:"Sprint the syllables, hunt the notes, dash up Do-Re-Mi, then race the vocabulary.",
      hint:"In every game, find Do first — everything else is counted from it." },
    quiz:{ label:"this question",
      explain:"Anchor on two facts: Do = the keynote of the current key, and transposition preserves every interval.",
      play:()=>{MFAudio.tone(60,.3,0);MFAudio.tone(64,.3,.35);MFAudio.tone(67,.4,.7);} }
  }
};
