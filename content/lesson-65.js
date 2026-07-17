/* Lesson 65 — Broken Chords and Arpeggiated Accompaniments (AEMT Book 3, Unit 16)
   Built from drafts/UNIT 16 – Lesson 65.md; AEMT3 p.103 verified by render.
   Core: BLOCK CHORD = notes together; BROKEN CHORD = notes NOT together;
   ARPEGGIO = chord tones played sequentially, one after another (Italian
   arpeggiare, "to play upon a harp"); may extend an octave or more; arpeggios
   outline the chords; a repeated chord's symbol is not re-written.
   NOTE: edit by FULL-FILE UPDATE only. */

/* texture detective: block, broken or arpeggio — by ear */
function MF_L65_ear(container,fb){
  const KINDS=[
    {name:"Block chord", play:()=>[60,64,67].forEach(m=>MFAudio.tone(m,1.4,0,.33))},
    {name:"Broken chord", play:()=>{[60,67,64,67].forEach((m,i)=>MFAudio.tone(m,.5,i*.42,.38));}},
    {name:"Arpeggio", play:()=>{[60,64,67,72].forEach((m,i)=>MFAudio.tone(m,.5,i*.4,.38));}}];
  let order=[0,2,1,2].sort(()=>Math.random()-.5), r=0, played=false;
  container.innerHTML=`<div class="big-q l65e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l65e-play">▶ Play the mystery texture</button></div>
    <div class="choices chips l65e-ch" style="display:none"><button>Block</button><button>Broken</button><button>Arpeggio</button></div>`;
  const q=container.querySelector(".l65e-q"), pl=container.querySelector(".l65e-play"), ch=container.querySelector(".l65e-ch");
  function ask(){
    if(r>=order.length){ q.textContent="Great! You identified every texture."; pl.style.display="none"; ch.style.display="none"; return; }
    played=false; ch.style.display="none";
    q.innerHTML=`Round ${r+1} of ${order.length}: same C chord — which TEXTURE?`;
  }
  pl.onclick=()=>{ const K=KINDS[order[r]]; if(!K) return;
    K.play(); played=true; setTimeout(()=>ch.style.display="",1900); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const want=order[r];
    if(i===want){ MFAudio.yay();
      fb(true,`✓ ${KINDS[want].name}! ${want===0?"All the notes at once — block chord.":want===1?"The notes played separately, out of order — broken chord.":"One at a time, in order — arpeggio."}`);
      r++; setTimeout(ask,1300); }
    else { MFAudio.tone(40,.2); fb(false,"Replay: together = block; taking turns = broken; climbing in ORDER = arpeggio."); }
  });
  ask();
}

/* arpeggio builder: play the C and G arpeggios — FOUR notes, root to the root
   above. Each round rebuilds a ONE-OCTAVE keyboard so exactly one starting
   note can complete the arpeggio (instructor round: no double-start ambiguity). */
function MF_L65_build(container,fb){
  const ROUNDS=[
    {name:"C major arpeggio", pcs:[60,64,67,72], names:["C","E","G","C (the root above)"], start:60},
    {name:"G major arpeggio", pcs:[55,59,62,67], names:["G","B","D","G (the root above)"], start:55}];
  let r=0,k=0;
  container.innerHTML=`<div class="big-q l65b-q" style="text-align:center"></div><div class="l65b-kb"></div>`;
  const q=container.querySelector(".l65b-q"), kh=container.querySelector(".l65b-kb");
  function onKey(m){
    const R=ROUNDS[r]; if(!R) return;
    if(m===R.pcs[k]){
      k++;
      if(k>=R.pcs.length){ MFAudio.yay();
        fb(true,`✓ ${R.name} — root, 3rd, 5th, and the root above, played as a line.`);
        r++; setTimeout(ask,1400); }
      else q.innerHTML=`Now play <b>${R.names[k]}</b>.`;
    } else { MFAudio.tone(40,.2); fb(false,"Chord tones only, in rising order — root, 3rd, 5th, then the root above."); }
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You played both arpeggios."; return; }
    k=0;
    q.innerHTML=`Play a <b>${ROUNDS[r].name}</b> — one note at a time, in order. Start on <b>${ROUNDS[r].names[0]}</b>.`;
    kh.innerHTML="";
    Keyboard.create(kh,{start:ROUNDS[r].start,octaves:1,labels:true,onKey});
  }
  ask();
}

LESSON_CONTENT[65]={
  welcome:"One chord, three textures: block, broken, and arpeggio. \u{1F3B5}",
  hook:{
    say:"<b>One chord can be played in different ways.</b> Listen to the three examples. <b>Which example sounds like an arpeggio?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Example 1</button>
          <button class="play hk-b">▶ Example 2</button>
          <button class="play hk-c">▶ Example 3</button></div>
          <div class="choices hk-ch" style="display:none"><button>Example 3 — the notes play one at a time, in order</button><button>Example 1 — all the notes at once</button><button>Example 2 — the notes take turns out of order</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let heard=new Set();
        const show=()=>{ if(heard.size>=3) setTimeout(()=>ch.style.display="",2200); };
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67].forEach(m=>MFAudio.tone(m,1.3,0,.33)); heard.add(1); show(); };
        container.querySelector(".hk-b").onclick=()=>{ [60,67,64,67].forEach((m,i)=>MFAudio.tone(m,.5,i*.42,.38)); heard.add(2); show(); };
        container.querySelector(".hk-c").onclick=()=>{ [60,64,67,72,76].forEach((m,i)=>MFAudio.tone(m,.5,i*.38,.38)); heard.add(3); show(); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Example 3 was an ARPEGGIO — the notes of the chord played one at a time, in order. Example 1 was a BLOCK chord; example 2 a BROKEN chord. Today's lesson!");
          else fb(false,"An arpeggio plays the notes one at a time, IN ORDER, often past the octave.");
        });
      } }
  },
  objectives:[
    "Define block chord: chord tones played together",
    "Define broken chord: chord tones NOT played together",
    "Define arpeggio: chord tones in sequence — 'to play upon a harp'",
    "Extend arpeggios an octave or more",
    "See how arpeggiated accompaniments outline the chords",
    "Know that a repeated chord's symbol isn't re-written"
  ],
  steps:[
    { say:"<b>Block Chords and Broken Chords:</b> A <b>block chord</b> plays all notes together. A <b>broken chord</b> plays the notes separately. \u{1F447} <b>What is the difference?</b>",
      show:{ type:"staff", spec:{clef:"bass",tempo:80,time:"3/4",notes:[
        {p:"C3",d:"h.",label:"block"},{p:"E3",d:"h.",chord:true},{p:"G3",d:"h.",chord:true},{bar:"double"},
        {p:"C3",d:"q",label:"broken…"},{p:"G3",d:"q"},{p:"E3",d:"q"},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["Only the TIMING — the notes are identical","The notes themselves","The key"], answer:0,
        success:"✓ C-E-G either way. Texture is about WHEN, not WHAT.",
        fail:"Compare the letters in both halves of the staff…",
        hint:"Same notes — together vs. separately." } },
    { say:"<b>Arpeggios:</b> An <b>arpeggio</b> plays the notes of a chord one at a time, usually in order. It may continue for more than one octave. <b>Remember: block chord = notes together · broken chord = notes played separately · arpeggio = a broken chord played in order.</b> \u{1F447} <b>How is an arpeggio different from a block chord?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"8"},{p:"E4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"8"},{p:"E5",d:"8"},{p:"G5",d:"8"},{p:"C6",d:"q"},{bar:"final"}],
        beams:[[0,1],[2,3],[4,5]],width:460} },
      try:{ type:"mc", choices:["Its notes are played one at a time, in order","It uses different notes","It is always slower"], answer:0,
        success:"✓ Same notes — played one at a time, in order, often past the octave.",
        fail:"A block chord sounds all at once; an arpeggio…",
        hint:"One at a time, in order." } },
    { say:"Listen to the three textures. \u{1F447}",
      try:{ type:"custom",
        hint:"Together = block; taking turns = broken; climbing in order = arpeggio.",
        mount:(container,fb)=>MF_L65_ear(container,fb) } },
    { say:"<b>Arpeggiated Accompaniment:</b> Arpeggios create smooth, flowing accompaniment while outlining the harmony. \u{1F447} <b>Why are arpeggios often used as accompaniment?</b>",
      try:{ type:"mc", choices:["They add smooth, flowing motion while sounding the harmony","They are louder","They change the chords"], answer:0,
        success:"✓ The same chords, played as flowing lines — motion and harmony together.",
        fail:"What does an arpeggio add that a block chord doesn't?",
        hint:"Motion + harmony." } },
    { say:"<b>Reading Chord Symbols:</b> If the chord does not change, the chord symbol may not be repeated. \u{1F447} <b>What chord do you play in the next measure?</b>",
      try:{ type:"mc", choices:["The same chord as the previous measure","No chord at all","The I chord automatically"], answer:0,
        success:"✓ No new symbol means the harmony continues.",
        fail:"If nothing changes, nothing new is written…",
        hint:"The harmony continues." } },
    { say:"Play two arpeggios. \u{1F447}",
      try:{ type:"custom",
        hint:"Root → 3rd → 5th → root, always climbing.",
        mount:(container,fb)=>MF_L65_build(container,fb) } },
    { say:"<b>This accompaniment plays one chord as an arpeggio.</b> \u{1F447} <b>Which chord do these four notes outline?</b>",
      show:{ type:"staff", spec:{clef:"bass",tempo:100,notes:[
        {p:"G2",d:"q"},{p:"B2",d:"q"},{p:"D3",d:"q"},{p:"G3",d:"q"},{bar:"final"}],width:340} },
      try:{ type:"mc", choices:["The G chord (G-B-D)","The C chord","The E chord"], answer:0,
        success:"✓ G-B-D-G: the G chord in root position, played one note at a time.",
        fail:"Stack the four notes into 3rds…",
        hint:"Collect the letters: G, B, D." } }
  ],
  examples:[
    { caption:"One chord, three textures in 4/4: block (all together — a whole note), broken (chord tones one at a time — quarter notes), arpeggio (up through the chord, past the octave — eighth notes).",
      staff:{clef:"treble",time:"4/4",tempo:90,notes:[
        {p:"C4",d:"w",label:"block"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"double"},
        {p:"C4",d:"q",label:"broken"},{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{bar:"double"},
        {p:"C4",d:"8",label:"arpeggio"},{p:"E4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"8"},{p:"E5",d:"8"},{p:"G5",d:"8"},{p:"C6",d:"q"},{bar:"final"}],
        beams:[[9,12],[13,14]],width:660},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"An arpeggiated accompaniment: the bass arpeggiates I, then V, then I in root position — each measure's notes outline exactly one chord.",
      staff:{clef:"bass",tempo:90,time:"3/4",notes:[
        {p:"C3",d:"q",label:"I"},{p:"E3",d:"q"},{p:"G3",d:"q"},{bar:true},
        {p:"G2",d:"q",label:"V"},{p:"B2",d:"q"},{p:"D3",d:"q"},{bar:true},
        {p:"C3",d:"q",label:"I"},{p:"E3",d:"q"},{p:"G3",d:"q"},{bar:"final"}],width:560},
      kb:{start:41,octaves:1.5,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Texture-Term Sprint (45s)",
      intro:"Block, broken, arpeggio — race the definitions and the Italian!",
      miaIntro:"Arpeggiare — say it with flair! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Block chord","chord tones played together"],
        ["Broken chord","chord tones NOT played together"],
        ["Arpeggio","chord tones in sequence, one after another"],
        ["Arpeggiare","Italian: 'to play upon a harp'"],
        ["An arpeggio's range","may extend an octave or more"],
        ["Repeated chord in a chart","symbol not written again"],
        ["Arpeggiated accompaniment","outlines each chord as a flowing line"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — texture vocabulary secured!":null },
    { type:"key-climb", title:"Game 2 · Grand Arpeggio",
      intro:"Play a C major arpeggio over TWO octaves — one note at a time, in order!",
      miaIntro:"Root-3rd-5th, rinse and rise! \u{1FA9C}",
      spec:{seq:[60,64,67,72,76,79,84],
        names:["C","E","G","C (octave 1!)","E","G","C (octave 2!)"],
        start:60, octaves:2, title:"C major arpeggio, two octaves up"},
      result:(score)=>score!==null?"Two full octaves — excellent arpeggio!":null },
    { type:"symbol-hunt", title:"Game 3 · Texture Spotter",
      intro:"Block, broken and arpeggio in NOTATION — click what's called!",
      miaIntro:"Stacked or strung out? \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Block chord", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Broken chord", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"}],width:170}},
        {label:"Arpeggio (rising)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"}],width:170}},
        {label:"Scale (not a chord!)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],width:170}}]},
      result:(score)=>score>=5?"No texture disguises itself from you!":null },
    { type:"term-race", title:"Game 4 · Outline Detective Race",
      intro:"Arpeggiated lines fly by as text — name the chord each outlines!",
      miaIntro:"Stack the letters in your head! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["C-E-G-C rising","outlines the C major chord"],
        ["G-B-D-G rising","outlines the G major chord"],
        ["F-A-C-F rising","outlines the F major chord"],
        ["A-C-E-A rising","outlines the A minor chord"],
        ["G-B-D-F rising","outlines the G7 chord"],
        ["D-F-A-D rising","outlines the D minor chord"],
        ["Block chord","all tones at once"],
        ["Arpeggio","tones in rising (or falling) order"]]},
      result:(score)=>score>=6?"Outlines read like large print!":null }
  ],
  practiceIntro:"20 practice questions — textures, the Italian, and outline-reading. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Block chord","notes together"],["Broken chord","notes apart"],["Arpeggio","notes in sequence"],["Arpeggiare","to play upon a harp"],["Octave or more","how far an arpeggio may extend"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{}, count:3 },
    { type:"mc", q:"When the notes of a chord are played together, it is called a…", choices:["block chord","broken chord","cluster"], answer:0,
      explain:"Solid, vertical, all-at-once." },
    { type:"mc", q:"When they are NOT played together, it is called a…", choices:["broken chord","block chord","rest"], answer:0,
      explain:"Same tones, spread over time." },
    { type:"mc", q:"How are the notes of an arpeggio played?", choices:["sequentially, one after another","all at once","in random order"], answer:0,
      explain:"The defining word is SEQUENTIALLY." },
    { type:"mc", q:"The word arpeggio comes from Italian arpeggiare, meaning…", choices:["to play upon a harp","to break apart","to hurry"], answer:0,
      explain:"The harp's ripple, borrowed by every instrument." },
    { type:"mc", q:"An arpeggio may be extended…", choices:["an octave or more","only five notes","never past the 5th"], answer:0,
      explain:"An arpeggio may extend an octave or more." },
    { type:"mc", q:"The rising bass line F-A-C-F outlines which chord?", choices:["F major","C major","D minor"], answer:0,
      explain:"F-A-C stacked = F major, root position." },
    { type:"truefalse", q:"Block and broken chords contain different notes.", answer:false,
      explain:"Identical notes — only the timing differs." },
    { type:"truefalse", q:"When a chord repeats in the next measure, its symbol is written again.", answer:false,
      explain:"No symbol = same chord continues." },
    { type:"truefalse", q:"Arpeggiated accompaniments outline the chords of the harmony.", answer:true,
      explain:"A chord unrolled is still that chord." },
    { type:"truefalse", q:"Every broken chord is an arpeggio.", answer:false,
      explain:"Arpeggios are the SEQUENTIAL kind of broken chord." }
  ],
  miaQuizIntro:"Quiz! Block, broken, or arpeggio — know each by sight and sound.",
  quiz:[
    { type:"mc", q:"A BLOCK chord is played…", choices:["with all notes together","one note at a time","with the melody only"], answer:0,
      explain:"The vertical wall.", hint:"Think 'building block'." },
    { type:"mc", q:"A BROKEN chord is played…", choices:["with its notes not together","with wrong notes","without the root"], answer:0,
      explain:"Same tones, spread out.", hint:"Broken apart in TIME." },
    { type:"mc", q:"How are the notes of an arpeggio played?", choices:["One at a time, usually in order","All at once","Backwards only"], answer:0,
      explain:"One at a time, in order.", hint:"Arpeggiare!" },
    { type:"mc", q:"Arpeggiare means…", choices:["to play upon a harp","to march","to whisper"], answer:0,
      explain:"Italian: 'to play upon a harp.'", hint:"Think of the instrument." },
    { type:"truefalse", q:"An arpeggio may extend an octave or more.", answer:true,
      explain:"An arpeggio may extend an octave or more.", hint:"How far did Game 2 go?" },
    { type:"truefalse", q:"When a chord is repeated in following measures, the chord symbol must be repeated too.", answer:false,
      explain:"If the harmony stays the same, the symbol is not repeated.", hint:"The harmony continues." },
    { type:"mc", q:"Identify the texture.",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"}],width:280},
      choices:["A rising arpeggio (C major)","A block chord","A scale"], answer:0,
      explain:"Chord tones in order = arpeggio.", hint:"Are these steps or skips?" },
    { type:"mc", q:"Identify the texture.",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:220},
      choices:["A block chord (F major)","A broken chord","An arpeggio"], answer:0,
      explain:"Stacked and simultaneous.", hint:"One stem, one moment." },
    { type:"mc", q:"This accompaniment bass plays G-B-D-G. The harmony is…", choices:["the V chord in C major (G major)","the I chord in C major","the IV chord"], answer:0,
      explain:"G-B-D = G major = V of C.", hint:"Stack, then place in the key." },
    { type:"mc", q:"Why are arpeggios often used in accompaniment?", choices:["They create smooth, flowing motion while outlining the harmony","They are louder","They change the melody"], answer:0,
      explain:"Flowing motion suits gentle accompaniment.", hint:"Motion + harmony." },
    { type:"mc", q:"Which is true of block vs broken chords?", choices:["Same notes, different timing","Different notes, same timing","Nothing in common"], answer:0,
      explain:"Texture ≠ content.", hint:"The step-1 discovery." },
    { type:"mc", q:"If a chord symbol is not repeated, what harmony should you play?", choices:["The same chord as before","Silence","Automatically G7"], answer:0,
      explain:"No new symbol = carry on.", hint:"The score-reading rule." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Block","together"],["Broken","apart"],["Arpeggio","in sequence"],["Arpeggiare","play upon a harp"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{}, count:2 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:1 }
  ],
  vocabulary:[
    {term:"Block Chord", def:"All chord tones played together — solid and vertical.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:380}},
    {term:"Broken Chord", def:"Chord tones NOT played together — spread over time.",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"}],width:380}},
    {term:"Arpeggio", def:"Chord tones played sequentially, one after another — may extend an octave or more. From arpeggiare, 'to play upon a harp.'",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"}],width:380}},
    {term:"Arpeggiated Accompaniment", def:"A flowing accompaniment whose arpeggios outline each chord of the harmony."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Block chord</b> = tones together; <b>broken chord</b> = tones apart.",
    "✔ <b>Arpeggio</b> = tones in SEQUENCE — <i>arpeggiare</i>, 'to play upon a harp' — extendable <b>an octave or more</b>.",
    "✔ Arpeggiated accompaniments <b>outline the chords</b> in root position while adding motion.",
    "✔ A repeated chord's <b>symbol is not re-written</b>.",
    "✔ Texture changes the delivery, <b>never the harmony</b>."
  ],
  tips:[
    "Reading trick: when a bass line skips (not steps), try stacking its notes — you're probably looking at an unrolled chord.",
    "Alberti bass — the classical pattern low-high-middle-high (C-G-E-G) — is history's most famous broken chord. Mozart built careers on it.",
    "Play your harmonized scale from Lesson 64 again, but arpeggiate every chord for a flowing accompaniment.",
    "Next lesson: the melody itself gets decorated — passing tones and neighbors that don't belong to the chord (on purpose!)."
  ],
  rewards:{ badge:"Harp Whisperer", icon:"\u{1F3B5}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Block, broken, or arpeggio — you know every texture. \u{1F3B5}\u{1F389}",
  miaPass:"Passed! You know all three textures. Next: decorating the melody…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Example 1 = block (together), 2 = broken (separately), 3 = arpeggio — one at a time, in order, past the octave.",
      play:()=>{[60,64,67,72,76].forEach((m,i)=>MFAudio.tone(m,.5,i*.36,.38));} },
    learn:{ label:"chord textures",
      explain:"Block = together; broken = apart; arpeggio = apart AND in sequence, an octave or more. Accompaniments arpeggiate to add motion; repeated chords don't repeat their symbol.",
      hint:"Together / apart / in-order-apart.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.9,0,.3));[60,64,67,72].forEach((m,i)=>MFAudio.tone(m,.45,1.1+i*.32,.36));} },
    example:{ label:"the examples",
      explain:"Example 1 plays one chord three ways; example 2 is an accompaniment bass arpeggiating I-V-I." },
    game:{ label:"the games",
      explain:"Match the terms, play a two-octave arpeggio, spot textures in notation, then identify outlined chords.",
      hint:"Skips in a line usually spell a chord." },
    quiz:{ label:"this question",
      explain:"Two axes: WHAT (the chord — stack the letters) and HOW (block/broken/arpeggio — the timing).",
      play:()=>{[55,59,62,67].forEach((m,i)=>MFAudio.tone(m,.5,i*.35,.38));} }
  }
};
