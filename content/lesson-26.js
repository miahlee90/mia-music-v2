/* Lesson 26 — Tetrachords and Major Scales (AEMT Book 2, Unit 7) — BOOK 2 BEGINS!
   Built from drafts/UNIT 7 – Lesson 26.md; AEMT p.43 verified by render.
   QA note honored: reinforce that every major scale = TWO IDENTICAL tetrachords
   joined by one whole step (not just a memorized formula); review-style staff work included.
   NOTE: edit by FULL-FILE REWRITE only. */

/* build-the-blueprint (brick-laying, per instructor sketch v2):
   ∨ arrows CONNECT each pair of notes; an empty box sits BETWEEN the two notes;
   the answer blocks (two "Whole Step" bricks + one "Half Step" brick) are
   DRAGGED into the boxes — tap-to-pick, tap-to-place also works on phones */
function MF_L26_blueprint(container,fb){
  const TGT=["W","W","H"], FULL={W:"Whole Step",H:"Half Step"}, WD=400;
  let sel=null, placed=0;
  container.innerHTML=`<div style="max-width:${WD}px;margin:0 auto">
      <div class="bp-staff"></div>
      <svg class="bp-arrows" viewBox="0 0 ${WD} 32" width="100%" style="display:block"></svg>
      <div class="bp-boxes" style="position:relative;height:50px"></div>
    </div>
    <div class="choices bp-pile" style="margin-top:6px"></div>
    <p style="text-align:center;font-size:13px;color:var(--muted);margin:4px 0 0">Drag each block into its box — or tap a block, then tap the box.</p>`;
  const api=Staff.render(container.querySelector(".bp-staff"),{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],width:WD});
  const xs=[...api.svg.querySelectorAll(".notegroup ellipse")].map(e=>+e.getAttribute("cx"));
  const mids=[0,1,2].map(i=>(xs[i]+xs[i+1])/2);
  container.querySelector(".bp-arrows").innerHTML=[0,1,2].map(i=>
    `<path d="M ${xs[i]+7} 4 L ${mids[i]} 26 L ${xs[i+1]-7} 4" fill="none" stroke="#3b3486" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  const boxRow=container.querySelector(".bp-boxes");
  const boxes=mids.map((mx,i)=>{ const b=document.createElement("div");
    b.style.cssText=`position:absolute;left:${mx/WD*100}%;transform:translateX(-50%);min-width:86px;height:42px;border:2.5px dashed #3b3486;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;background:#fff;cursor:pointer`;
    b.dataset.t=TGT[i]; boxRow.appendChild(b); return b; });
  const pile=container.querySelector(".bp-pile");
  ["W","W","H"].sort(()=>Math.random()-.5).forEach(t=>{
    const blk=document.createElement("button"); blk.textContent=FULL[t]; blk.dataset.t=t; blk.draggable=true;
    blk.addEventListener("dragstart",e=>{ sel=blk; e.dataTransfer.setData("text/plain",t); });
    blk.addEventListener("click",()=>{ if(blk.disabled) return;
      [...pile.children].forEach(x=>x.style.outline="");
      sel=blk; blk.style.outline="3px solid #ffd166"; });
    pile.appendChild(blk);
  });
  function tryPlace(box,blk){
    if(!blk||blk.disabled||box.dataset.done) return;
    if(blk.dataset.t===box.dataset.t){
      box.dataset.done="1"; box.textContent=blk.textContent;
      box.style.borderStyle="solid"; box.style.background="#eef1ff"; box.style.fontSize="13px"; box.style.padding="0 8px";
      blk.disabled=true; blk.style.opacity=".35"; blk.style.outline=""; sel=null; placed++;
      MFAudio.tone(58+placed*4,.3);
      if(placed>=TGT.length) fb(true,"✓ W – W – H — the tetrachord step pattern. Both halves of every major scale follow it!");
      else fb(true,"✓ That block fits! Keep building…");
    } else {
      box.classList.add("shake"); setTimeout(()=>box.classList.remove("shake"),450); MFAudio.tone(40,.25);
      fb(false, box.dataset.t==="H" ? "The LAST gap, E to F, is the narrow one — a Half Step block goes there." : "The first two gaps are WIDE — Whole Step blocks go there.");
    }
  }
  boxes.forEach(box=>{
    box.addEventListener("dragover",e=>e.preventDefault());
    box.addEventListener("drop",e=>{ e.preventDefault();
      const t=e.dataTransfer.getData("text/plain");
      const blk=(sel&&!sel.disabled)? sel : [...pile.children].find(b=>!b.disabled&&b.dataset.t===t);
      tryPlace(box,blk); });
    box.addEventListener("click",()=>{ if(sel&&!sel.disabled) tryPlace(box,sel); });
  });
}

/* staff + keyboard side by side — the keyboard makes the half steps VISIBLE */
function MF_L26_staffKb(el,staffSpec,kbOpts){
  const s=document.createElement("div"); el.appendChild(s); Staff.render(s,staffSpec);
  const k=document.createElement("div"); k.style.marginTop="10px"; el.appendChild(k); Keyboard.create(k,kbOpts);
}

/* keyboard scale builder: play C major from the keynote up */
function MF_L26_kbBuild(container,fb){
  const SEQ=[60,62,64,65,67,69,71,72], NAMES=["C","D","E","F","G","A","B","C"];
  let i=0;
  container.innerHTML=`<div class="big-q l26-q" style="text-align:center"></div><div class="l26-kb"></div>`;
  const q=container.querySelector(".l26-q");
  const kb=Keyboard.create(container.querySelector(".l26-kb"),{start:60,octaves:1,labels:true,marks:[SEQ[0]],
    onKey:m=>{
      if(i>=SEQ.length) return;
      if(m===SEQ[i]){ i++;
        if(i>=SEQ.length){ kb.mark([]); q.textContent="C major scale complete!";
          fb(true,"✓ C–D–E–F–G–A–B–C — two tetrachords joined by a whole step, and every note on a white key!"); }
        else { kb.mark([SEQ[i]]); q.innerHTML=`✓ Degree ${i} (${NAMES[i-1]}) — now play degree ${i+1}: <b>${NAMES[i]}</b>`; } }
      else fb(false,`Not that key — the next scale degree is ${NAMES[i]}. Follow the marked key!`);
    }});
  q.innerHTML=`Play the C major scale from the keynote up — start on the marked <b>C</b>.`;
}

LESSON_CONTENT[26]={
  welcome:"Welcome back! Today you get the construction plan behind EVERY major scale. \u{1F3D7}",
  hook:{
    say:"You've heard this ladder of notes a thousand times. Press play and listen closely to the <b>first</b> and <b>last</b> notes. What do you notice?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const spec={clef:"treble",tempo:110,notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"}],width:460};
        container.innerHTML=`<div class="hk-staff"></div>
          <div style="text-align:center"><button class="play hk-play">▶ Play the ladder</button></div>
          <div class="choices hk-ch" style="display:none"><button>It begins and ends on the SAME letter — C</button><button>Every note has a different letter</button><button>It ends lower than it began</button></div>`;
        const api=Staff.render(container.querySelector(".hk-staff"),spec);
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{ Staff.play(spec,api); setTimeout(()=>{ ch.style.display=""; },5000); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ It starts on C and ends on C, one octave higher. That note is called the KEYNOTE — and the ladder is a MAJOR SCALE. Today you'll learn its step pattern!");
          else fb(false,"Listen once more — compare the very first note with the very last.");
        });
      } }
  },
  objectives:[
    "Define a tetrachord",
    "Explain how two tetrachords create a major scale",
    "Identify the whole-step and half-step pattern",
    "Locate the two natural half steps",
    "Build a C major scale from the interval pattern"
  ],
  steps:[
    { say:"The word <b>TETRA</b> means <b>four</b>. A <b>TETRACHORD</b> is a series of four notes with the pattern <b>whole step – whole step – half step</b> — and the four notes must be in <b>alphabetical order</b>. \u{1F447} Here is the C tetrachord. <b>A tetrachord is a series of how many notes?</b>",
      show:{ type:"custom", mount:(el)=>MF_L26_staffKb(el,
        {clef:"treble",notes:[{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"}],width:360},
        {start:60,octaves:1,labels:true,marks:[60,62,64,65]}) },
      try:{ type:"mc", choices:["3","4","5","8"], answer:1,
        success:"✓ Four — TETRA means four, like a TETRApod has four legs.",
        fail:"Think of the word TETRA…",
        hint:"TETRA = four." } },
    { say:"Build the step pattern yourself. \u{1F447} <b>Tap the three distances of a tetrachord in the correct order:</b>",
      try:{ type:"custom",
        hint:"Wide, wide, then narrow: W – W – H.",
        mount:(container,fb)=>MF_L26_blueprint(container,fb) } },
    { say:"Now the big idea: a <b>MAJOR SCALE</b> is <b>eight notes — two tetrachords joined by one whole step</b>. C–D–E–F is the C tetrachord; step up a whole step to G, and G–A–B–C is the G tetrachord. The first and last note share the same name: the <b>KEYNOTE</b> — so the eight written notes contain <b>7 different pitches</b>, with the keynote appearing twice. That makes the major scale a <b>seven-note (diatonic) scale</b> in the pattern <b>W–W–H–W–W–W–H</b>, and its job in music is to <b>establish a key center</b>: the keynote feels like home, and melodies and chords are built around it. A scale can begin on any note. \u{1F447} <b>What joins the two tetrachords of a major scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L26_staffKb(el,
        {clef:"treble",notes:[{p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{p:"G4",d:"q",label:"5"},{p:"A4",d:"q",label:"6"},{p:"B4",d:"q",label:"7"},{p:"C5",d:"q",label:"8"}],steps:[{from:3,to:4,label:"Whole Step"}],brackets:[{from:0,to:3,label:"C tetrachord"},{from:4,to:7,label:"G tetrachord"}],width:520},
        {start:60,octaves:1,labels:true,marks:[60,62,64,65,67,69,71,72]}) },
      try:{ type:"mc", choices:["A whole step","A half step","A rest","An octave"], answer:0,
        success:"✓ One whole step (F up to G) welds the two tetrachords into a scale.",
        fail:"Look at the labeled gap between the brackets.",
        hint:"The label sits right between F and G." } },
    { say:"The tones of a scale are also called the <b>DEGREES</b> of the scale — there are <b>eight degrees</b> in a major scale. In ALL major scales, <b>half steps occur between the 3rd–4th and 7th–8th degrees</b>; every other distance is a whole step. \u{1F447} <b>Where do the half steps occur?</b>",
      show:{ type:"staff", spec:{clef:"bass",notes:[{p:"C3",d:"q",label:"1"},{p:"D3",d:"q",label:"2"},{p:"E3",d:"q",label:"3"},{p:"F3",d:"q",label:"4"},{p:"G3",d:"q",label:"5"},{p:"A3",d:"q",label:"6"},{p:"B3",d:"q",label:"7"},{p:"C4",d:"q",label:"8"}],steps:[{from:2,to:3,label:"H"},{from:6,to:7,label:"H"}],width:520} },
      try:{ type:"mc", choices:["3–4 and 7–8","2–3 and 6–7","1–2 and 5–6","4–5 and 7–8"], answer:0,
        success:"✓ 3–4 and 7–8 — the same two spots in every major scale, always.",
        fail:"Find the two H carets on the staff above.",
        hint:"End of each tetrachord." } },
    { say:"Time to build it with your own hands. \u{1F447} <b>Play the C major scale on the keyboard, one degree at a time:</b>",
      try:{ type:"custom",
        hint:"White keys only, straight up: C D E F G A B C — follow the marked key.",
        mount:(container,fb)=>MF_L26_kbBuild(container,fb) } },
    { say:"One last check on the complete pattern. The major-scale formula is <b>W – W – H – W – W – W – H</b>. \u{1F447} <b>Which two distances complete the pattern W – ? – H – W – ? – W – H?</b>",
      try:{ type:"mc", choices:["W and W","H and W","W and H","H and H"], answer:0,
        success:"✓ W–W–H–W–W–W–H — memorize the pattern once, and you can build a major scale from almost any note.",
        fail:"Both tetrachords follow the SAME step pattern: W–W–H.",
        hint:"Two identical tetrachords." } }
  ],
  examples:[
    { caption:"The C major scale: two tetrachords (brackets) joined by one whole step. Follow the W–H carets as it plays.",
      staff:{clef:"treble",tempo:100,notes:[{p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{p:"G4",d:"q",label:"5"},{p:"A4",d:"q",label:"6"},{p:"B4",d:"q",label:"7"},{p:"C5",d:"q",label:"8"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"},{from:3,to:4,label:"W"},{from:4,to:5,label:"W"},{from:5,to:6,label:"W"},{from:6,to:7,label:"H"}],brackets:[{from:0,to:3,label:"C tetrachord"},{from:4,to:7,label:"G tetrachord"}],width:540},
      kb:{start:60,octaves:1,labels:true,marks:[60,62,64,65,67,69,71,72]} },
    { caption:"The eight DEGREES of the major scale — in bass clef this time. The half steps sit between 3–4 and 7–8.",
      staff:{clef:"bass",tempo:90,notes:[{p:"C3",d:"q",label:"1"},{p:"D3",d:"q",label:"2"},{p:"E3",d:"q",label:"3"},{p:"F3",d:"q",label:"4"},{p:"G3",d:"q",label:"5"},{p:"A3",d:"q",label:"6"},{p:"B3",d:"q",label:"7"},{p:"C4",d:"q",label:"8"}],steps:[{from:2,to:3,label:"H"},{from:6,to:7,label:"H"}],width:540},
      kb:{start:48,octaves:1,labels:true,marks:[48,50,52,53,55,57,59,60]} }
  ],
  games:[
    { type:"order-tap", title:"Game 1 · Tap the Major-Scale Pattern",
      intro:"Seven distances from keynote to keynote — tap them in order!",
      miaIntro:"The W–W–H pattern, from memory!",
      spec:{sequence:["W","W","H","W","W","W","H"], title:"Tap the 7 distances of a major scale — from the keynote up!"},
      result:(stars)=>stars>=3?"The pattern is yours — W W H W W W H!":null },
    { type:"symbol-hunt", title:"Game 2 · Scale-Part Hunt",
      intro:"Tetrachords, half steps, whole steps — click the one that's named!",
      miaIntro:"Can you SPOT the building blocks? \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Tetrachord (W–W–H)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],width:220}},
        {label:"Half Step", spec:{clef:"treble",notes:[{p:"E4",d:"q"},{p:"F4",d:"q"}],width:160}},
        {label:"Whole Step", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"}],width:160}},
        {label:"Keynote to Keynote", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"C5",d:"w"}],width:160}}]},
      result:(score)=>score>=5?"Every building block spotted!":null },
    { type:"term-race", title:"Game 3 · Scale Vocabulary Race",
      intro:"Tetrachord, keynote, degrees — match the terms at speed!",
      miaIntro:"New vocabulary, round one! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Tetrachord","Four notes in the pattern W–W–H"],
        ["Major Scale","Eight notes — two tetrachords joined by a whole step"],
        ["Keynote","The note on which a scale begins and ends"],
        ["Degrees","The tones or steps of a scale"],
        ["TETRA","Four"],
        ["3–4 and 7–8","Where the half steps occur in every major scale"]]},
      result:(score)=>score>=7?"Vocabulary locked in!":null },
    { type:"order-tap", title:"Game 4 · Build the C Major Scale",
      intro:"Eight letters, keynote first — assemble the scale in order!",
      miaIntro:"Alphabetical order, starting on C! \u{1F520}",
      spec:{sequence:["C","D","E","F","G","A","B","C"], title:"Tap the notes of the C major scale in order — keynote first!"},
      result:(stars)=>stars>=3?"C major assembled without a wrong tap!":null }
  ],
  practiceIntro:"20 practice questions — tetrachords, degrees, half-step spots, and scale building. Answer right and the next appears automatically!",
  practice:[
    { gen:"step-type", params:{}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Tetrachord","Four notes in the pattern W–W–H"],["Major Scale","Two tetrachords joined by a whole step"],["Keynote","The note a scale begins and ends on"],["Degrees","The tones or steps of a scale"]], reverse:true}, count:4 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"The four notes of a tetrachord must be in ____ order.", choices:["alphabetical","reverse","random"], answer:0,
      explain:"C–D–E–F, G–A–B–C — always alphabetical." },
    { type:"truefalse", q:"Every major scale follows the same interval pattern.", answer:true,
      explain:"W–W–H–W–W–W–H — the same step pattern from any keynote." },
    { type:"truefalse", q:"A tetrachord contains five notes.", answer:false,
      explain:"TETRA means four — a tetrachord has four notes." },
    { type:"mc", q:"Complete the tetrachord: C – D – E – ____", choices:["F","G","B"], answer:0,
      explain:"W (C–D), W (D–E), H (E–F): the C tetrachord." },
    { type:"mc", q:"Complete the second tetrachord: G – A – ____ – C", choices:["B","B♭","F"], answer:0,
      explain:"G–A (W), A–B (W), B–C (H): the G tetrachord." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The pattern of a tetrachord is whole step, ____.", choices:["whole step, half step","half step, whole step","half step, half step"], answer:0,
      explain:"W – W – H, always." },
    { type:"mc", q:"The major scale is made up of ____ tetrachords joined by a ____.", choices:["2 · whole step","2 · half step","3 · whole step"], answer:0,
      explain:"Two tetrachords + one whole step = one major scale." },
    { type:"mc", q:"How many notes are written in a major scale?", choices:["8","4","7"], answer:0,
      explain:"Eight written notes — two four-note tetrachords. That's 7 different pitches, with the keynote written twice." },
    { type:"mc", q:"In a major scale, half steps occur between the ____ scale degrees.", choices:["3 & 4 and 7 & 8","2 & 3 and 6 & 7","1 & 2 and 4 & 5"], answer:0,
      explain:"3–4 and 7–8 in ALL major scales." },
    { type:"mc", q:"Write a tetrachord starting on G: G – A – B – ____", choices:["C","D","F"], answer:0,
      explain:"G–A (W), A–B (W), B–C (H)." },
    { type:"mc", q:"The distances between all scale degrees OTHER than 3–4 and 7–8 are…", choices:["whole steps","half steps","octaves"], answer:0,
      explain:"Only 3–4 and 7–8 are half steps; the rest are whole steps." }
  ],
  miaQuizIntro:"First scale quiz — you know the pattern by heart!",
  quiz:[
    { type:"mc", q:"A tetrachord contains:", choices:["Three notes","Four notes","Five notes","Eight notes"], answer:1,
      explain:"TETRA means four.", hint:"Think of the word TETRA." },
    { type:"mc", q:"Which interval pattern forms one tetrachord?", choices:["W–H–W","W–W–H","H–W–W","H–H–W"], answer:1,
      explain:"Whole step, whole step, half step.", hint:"Wide, wide, narrow." },
    { type:"truefalse", q:"Every major scale follows the same interval pattern.", answer:true,
      explain:"W–W–H–W–W–W–H from any starting note.", hint:"That's why the pattern matters." },
    { type:"truefalse", q:"A tetrachord contains five notes.", answer:false,
      explain:"Four notes — in alphabetical order.", hint:"TETRA = ?" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Tetrachord → four-note pattern · Major Scale → two tetrachords joined by a whole step · Keynote → first and last note",
               "Tetrachord → eight notes · Major Scale → one tetrachord · Keynote → the loudest note",
               "Tetrachord → three notes · Major Scale → four tetrachords · Keynote → the middle note"], answer:0,
      explain:"The three key terms of this lesson.", hint:"TETRA = four; scales begin and end on the keynote." },
    { type:"mc", q:"The complete major-scale pattern is W – W – H – ? – W – W – H. The missing distance is:", choices:["W","H","an octave"], answer:0,
      explain:"The joining WHOLE step between the two tetrachords.", hint:"What joins the tetrachords?" },
    { type:"mc", q:"Where do the natural half steps occur in a major scale?", choices:["2–3 and 6–7","3–4 and 7–8","1–2 and 5–6","4–5 and 7–8"], answer:1,
      explain:"Between degrees 3–4 and 7–8, in every major scale.", hint:"The end of each tetrachord." },
    { type:"mc", q:"Complete the tetrachord: C – D – E – ____", choices:["F","G","A"], answer:0,
      explain:"E to F is the closing half step.", hint:"W–W–H." },
    { type:"mc", q:"Complete the second tetrachord: G – A – ____ – C", choices:["B","B♭","D"], answer:0,
      explain:"G–A–B–C: W, W, H.", hint:"Alphabetical order!" },
    { type:"mc", q:"Why are tetrachords useful?",
      choices:["They make scales shorter","They divide a major scale into two identical interval patterns","They remove half steps","They only apply to C major"], answer:1,
      explain:"Learn W–W–H once, use it twice — that's every major scale.", hint:"Two identical halves." },
    { type:"mc", q:"This four-note group is a…",
      staff:{clef:"treble",notes:[{p:"C4",d:"q",label:"C"},{p:"D4",d:"q",label:"D"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F"}],steps:[{from:0,to:1,label:"W"},{from:1,to:2,label:"W"},{from:2,to:3,label:"H"}],width:300},
      choices:["Tetrachord","Major scale","Chord","Measure"], answer:0,
      explain:"Four alphabetical notes in W–W–H — a tetrachord.", hint:"Count the notes." },
    { type:"mc", q:"The note on which a scale begins and ends is called the…", choices:["Keynote","Bar line","Degree","Clef"], answer:0,
      explain:"The keynote — it names the scale.", hint:"C major begins and ends on…?" },
    { type:"mc", q:"How many degrees are in a major scale?", choices:["8","4","6","12"], answer:0,
      explain:"Eight degrees — the tones or steps of the scale.", hint:"Two tetrachords' worth." },
    { type:"mc", q:"Which note joins the two tetrachords of the C major scale?",
      staff:{clef:"treble",notes:[{p:"F4",d:"q",label:"F"},{p:"G4",d:"q",label:"G"}],steps:[{from:0,to:1,label:"?"}],width:220},
      choices:["A whole step from F to G","A half step from F to G","A rest between F and G"], answer:0,
      explain:"F–G skips F♯: one whole step, the weld between tetrachords.", hint:"Is a key skipped between F and G?" },
    /* generated */
    { gen:"step-type", params:{}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Tetrachord","Four notes in the pattern W–W–H"],["Major Scale","Two tetrachords joined by a whole step"],["Keynote","The note a scale begins and ends on"],["Degrees","The tones or steps of a scale"]], reverse:true}, count:2 },
    { gen:"note-name", params:{clef:"bass"}, count:1 }
  ],
  vocabulary:[
    {term:"Tetra", def:"Four."},
    {term:"Tetrachord", def:"A series of four notes having a pattern of whole step, whole step, half step. The four notes of a tetrachord must be in alphabetical order."},
    {term:"Major Scale", def:"A seven-note (diatonic) scale in the pattern W–W–H–W–W–W–H — for example, C major: C, D, E, F, G, A, B, plus the repeated keynote. Built from two tetrachords joined by a whole step, it establishes the key center that melodies and chords are built around."},
    {term:"Keynote", def:"The note on which a scale begins and ends."},
    {term:"Degrees", def:"The tones or steps of a scale. There are eight degrees in a major scale."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>TETRA = four</b>: a <b>tetrachord</b> is four alphabetical notes in <b>W–W–H</b>.",
    "✔ A <b>major scale</b> = <b>two tetrachords joined by one whole step</b> — eight notes, keynote to keynote.",
    "✔ Full pattern: <b>W–W–H–W–W–W–H</b>.",
    "✔ The tones of a scale are its <b>degrees</b> (1–8); half steps fall between <b>3–4</b> and <b>7–8</b> in EVERY major scale.",
    "✔ A scale can begin on almost any note — the pattern never changes."
  ],
  tips:[
    "Don't memorize scales one by one — memorize the PATTERN once and apply it anywhere.",
    "At a piano, play C to C on white keys and listen for the two 'automatic' half steps: E–F and B–C land exactly on degrees 3–4 and 7–8.",
    "Next lesson the same pattern starts on G and D — and you'll discover why sharps appear.",
    "Say it like a chant: 'whole, whole, half — whole — whole, whole, half.'"
  ],
  rewards:{ badge:"Scale Architect", icon:"\u{1F3D7}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score on your very first scale lesson! The W–W–H pattern is officially yours. \u{1F389}",
  miaPass:"You passed! Keep the pattern humming in your head — W W H, W, W W H — and G major will feel easy next time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The ladder is a major scale: it climbs eight notes and lands on the same letter it started from — the keynote, one octave higher.",
      play:()=>{[60,62,64,65,67,69,71,72].forEach((m,i)=>MFAudio.tone(m,.35,i*.28));} },
    learn:{ label:"tetrachords",
      explain:"Tetrachord = four alphabetical notes in W–W–H. Two of them, joined by a whole step, make a major scale. Half steps always fall at 3–4 and 7–8.",
      hint:"Build in halves: W–W–H … whole step … W–W–H.",
      play:()=>{[60,62,64,65].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));} },
    example:{ label:"the examples",
      explain:"Example 1 shows the two bracketed tetrachords and the joining whole step; example 2 numbers the eight degrees and flags the 3–4 and 7–8 half steps in bass clef." },
    game:{ label:"the games",
      explain:"Tap the interval pattern, hunt the building blocks, race the vocabulary, then assemble C major letter by letter.",
      hint:"The pattern chant helps in every game: W W H, W, W W H." },
    quiz:{ label:"this question",
      explain:"Everything comes back to one pattern: two W–W–H tetrachords joined by a whole step, eight degrees, half steps at 3–4 and 7–8.",
      play:()=>{MFAudio.tone(60,.3,0);MFAudio.tone(62,.3,.3);MFAudio.tone(64,.3,.6);MFAudio.tone(65,.5,.9);} }
  }
};
