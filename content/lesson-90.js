/* Lesson 90 — Texture (Book 4, Unit 22 — SELF-AUTHORED)
   Core: MONOPHONIC = one melody alone · HOMOPHONIC = melody + accompaniment
   (or chords moving together) · POLYPHONIC = independent melodies at once ·
   HETEROPHONIC (intro) = one melody, simultaneous variants.
   NOTE: edit by FULL-FILE REWRITE only. */

/* texture ear lab */
function MF_L90_ear(container,fb){
  const play={
    mono:()=>{ [60,62,64,65,67,65,64,62,60].forEach((m,i)=>MFAudio.tone(m,.32,i*.3,.44)); return 2.9; },
    homo:()=>{ const mel=[72,74,76,77,79], ch=[[48,64,67],[48,64,67],[53,65,69],[55,67,71],[48,64,67,72]];
      mel.forEach((m,i)=>{ MFAudio.tone(m,.5,i*.55,.42); ch[i].forEach(c=>MFAudio.tone(c,.5,i*.55,.16)); }); return 3.0; },
    poly:()=>{ [60,62,64,65,67,69,71,72].forEach((m,i)=>MFAudio.tone(m,.34,i*.36,.34));
      [67,65,64,62,60,59,57,55].forEach((m,i)=>MFAudio.tone(m,.34,i*.36+.18,.3)); return 3.2; }};
  const ROUNDS=["homo","mono","poly","mono"];
  const KEY=["mono","homo","poly"];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l90e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l90e-play">▶ Play the music</button></div>
    <div class="choices l90e-ch" style="display:none"><button>Monophonic — one line alone</button><button>Homophonic — melody + accompaniment</button><button>Polyphonic — independent lines together</button></div>`;
  const q=container.querySelector(".l90e-q"), pl=container.querySelector(".l90e-play"), ch=container.querySelector(".l90e-ch");
  pl.onclick=()=>{ const w=ROUNDS[r]; if(!w) return; const dur=play[w](); played=true; setTimeout(()=>ch.style.display="",dur*1000+300); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    if(KEY[i]===ROUNDS[r]){ fb(true,"✓ "+["One unaccompanied line — monophonic.","Melody on top, chords beneath — homophonic.","Two lines with independent directions — polyphonic."][i]); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! Every texture identified."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: listen, then name the texture.`;
    } else { MFAudio.tone(40,.2); fb(false,"Count the layers: one alone? melody over support? or several independent lines?"); }
  });
  q.innerHTML="Round 1 of 4: listen, then name the texture.";
}

LESSON_CONTENT[90]={
  welcome:"Musical texture describes how layers and melodic lines interact.",
  hook:{
    say:"<b>Listen to the same melody presented in three ways:</b> alone, with chordal accompaniment, and combined with a second melody. \u{1F447} <b>In Version 3, how many independent melodic lines do you hear?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version 1—melody alone</button>
          <button class="play hk-b">▶ Version 2—melody with chords</button>
          <button class="play hk-c">▶ Version 3—two simultaneous melodies</button></div>
          <div class="choices hk-ch" style="display:none"><button>Two — each line has its own melodic direction</button><button>One — the lower line only duplicates the melody</button><button>None</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let h=0;
        const mel=[64,65,67,69,67,65,64];
        container.querySelector(".hk-a").onclick=()=>{ mel.forEach((m,i)=>MFAudio.tone(m,.34,i*.32,.44)); h|=1; if(h===7) setTimeout(()=>ch.style.display="",2600); };
        container.querySelector(".hk-b").onclick=()=>{ mel.forEach((m,i)=>MFAudio.tone(m,.34,i*.32,.42)); [[48,64,67],[53,65,69],[48,64,67]].forEach((row,i)=>row.forEach(c=>MFAudio.tone(c,.65,i*.75,.16))); h|=2; if(h===7) setTimeout(()=>ch.style.display="",2600); };
        container.querySelector(".hk-c").onclick=()=>{ mel.forEach((m,i)=>MFAudio.tone(m,.34,i*.32,.4)); [48,50,52,53,55,53,52].forEach((m,i)=>MFAudio.tone(m,.34,i*.32+.16,.34)); h|=4; if(h===7) setTimeout(()=>ch.style.display="",2800); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Version 3 combines two independent melodic lines, creating polyphonic texture. Version 1 is monophonic, and Version 2 is homophonic.");
          else fb(false,"Listen again to the lower line in Version 3. Does it have its own melodic contour and rhythm?");
        });
      } }
  },
  objectives:[
    "Define musical texture",
    "Identify monophonic texture",
    "Identify homophonic texture",
    "Identify polyphonic texture",
    "Meet heterophonic texture",
    "Recognize textures by ear"
  ],
  steps:[
    { say:"<b>Musical Texture:</b> texture describes how musical lines work together. Music may be:<br>• Monophonic<br>• Homophonic<br>• Polyphonic<br>• Heterophonic \u{1F447} <b>What does musical texture describe?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Texture</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Layers</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Example setting</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#2F6DA8">Monophonic</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">one melody alone</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">solo voice, unaccompanied</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#A9821F">Homophonic</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">melody + accompaniment</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">singer + guitar chords</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#C05A21">Polyphonic</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">independent melodies together</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">a round; a fugue</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800">Heterophonic</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">one melody, simultaneous variants</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">many musical traditions</td></tr></table>` },
      try:{ type:"mc", choices:["How simultaneous musical lines and layers are organized","How loud the music is","Which key the music uses"], answer:0,
        success:"✓ Correct. Texture concerns the number and organization of musical layers and the relationships among them.",
        fail:"Consider how the musical lines relate to one another.",
        hint:"Listen for the number and independence of the musical layers." } },
    { say:"<b>Monophonic Texture:</b> one melody only. Many performers singing the same melody in unison is still monophonic. \u{1F447} <b>Forty people sing the same melody in unison without accompaniment. What is the texture?</b>",
      try:{ type:"mc", choices:["Monophonic — many voices performing one melodic line","Polyphonic","Homophonic"], answer:0,
        success:"✓ Correct. The number of performers does not change the texture when everyone performs the same melodic line.",
        fail:"Count the distinct melodic lines rather than the number of performers.",
        hint:"\u{201C}Mono-\u{201D} means one." } },
    { say:"<b>Homophonic Texture:</b> one melody supported by accompaniment. Sometimes all voices move together as chords. \u{1F447} <b>A singer performs a melody over a simple piano chordal accompaniment. What is the texture?</b>",
      try:{ type:"mc", choices:["Homophonic — melody with harmonic support","Monophonic","Heterophonic"], answer:0,
        success:"✓ Correct. The vocal melody is prominent, while the piano chords provide harmonic support.",
        fail:"Determine whether the accompaniment supports the melody or presents an independent melodic line.",
        hint:"Listen for one prominent melody with chordal support." } },
    { say:"<b>Polyphonic Texture:</b> two or more independent melodies. Each line has its own direction. Rounds and fugues are common examples. \u{1F447} <b>In polyphonic texture, the simultaneous lines…</b>",
      try:{ type:"mc", choices:["maintain independent melodic motion","form only one melody with chordal support","must always perform identical pitches and rhythms"], answer:0,
        success:"✓ Correct. Polyphonic lines retain melodic independence while sounding together.",
        fail:"Listen for multiple simultaneous melodic lines.",
        hint:"\u{201C}Poly-\u{201D} means many; focus on melodic independence." } },
    { say:"<b>Heterophonic Texture:</b> one melody. Different performers play different versions at the same time — usually decorated with ornaments or rhythmic changes. \u{1F447} <b>Two performers play the same underlying melody, but one adds ornaments. What is the texture?</b>",
      try:{ type:"mc", choices:["Heterophonic","Polyphonic","Strictly monophonic"], answer:0,
        success:"✓ Correct. The performers present different versions of the same underlying melody at the same time.",
        fail:"Determine whether the two parts are variants of the same underlying melody.",
        hint:"\u{201C}Hetero-\u{201D} means different; listen for different versions of one melody." } },
    { say:"Listen to each passage and identify its predominant texture. \u{1F447}",
      try:{ type:"custom",
        hint:"Ask whether you hear one melodic line, a prominent melody with support, independent melodies, or simultaneous variants of one melody.",
        mount:(container,fb)=>MF_L90_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>A round such as \u{201C}Row, Row, Row Your Boat\u{201D} is sung with staggered entries. What texture results after the voices begin to overlap?</b>",
      try:{ type:"mc", choices:["Polyphonic","Monophonic","Homophonic"], answer:0,
        success:"✓ Correct. Once the staggered entries overlap, multiple versions of the melody occur at different points simultaneously, creating polyphonic texture.",
        fail:"Listen to the overlapping entries after the second voice begins.",
        hint:"The staggered melodic lines overlap." } }
  ],
  examples:[
    { caption:"Homophonic texture on the staff: the melody rides on top while chords move together beneath it — leader and support.",
      staff:{clef:"treble",tempo:84,notes:[
        {p:"E5",d:"q",label:"melody"},{p:"C4",d:"q",chord:true},{p:"E4",d:"q",chord:true},{p:"G4",d:"q",chord:true},
        {p:"F5",d:"q"},{p:"C4",d:"q",chord:true},{p:"F4",d:"q",chord:true},{p:"A4",d:"q",chord:true},
        {p:"G5",d:"q"},{p:"B3",d:"q",chord:true},{p:"D4",d:"q",chord:true},{p:"G4",d:"q",chord:true},
        {p:"E5",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:620},
      kb:{start:59,octaves:2,labels:true} },
    { caption:"Polyphonic texture: two independent lines — the upper climbs while the lower descends, each with its own path. (Played together.)",
      staff:{clef:"treble",tempo:88,notes:[
        {p:"C4",d:"q",label:"line 2"},{p:"E5",d:"q",chord:true,label:"line 1"},
        {p:"B3",d:"q"},{p:"F5",d:"q",chord:true},
        {p:"A3",d:"q"},{p:"G5",d:"q",chord:true},
        {p:"G3",d:"w"},{p:"E5",d:"w",chord:true},{bar:"final"}],width:520},
      kb:{start:48,octaves:3,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Texture Identification",
      intro:"Identify the organization of musical layers in each example.",
      miaIntro:"Count the lines and determine how they interact.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Monophonic","one melody alone"],
        ["Homophonic","melody + accompaniment"],
        ["Polyphonic","independent melodies together"],
        ["Heterophonic","one melody, simultaneous variants"],
        ["Unison choir, no accompaniment","monophonic"],
        ["Singer + guitar chords","homophonic"],
        ["A round or fugue","polyphonic"],
        ["Plain + ornamented same tune","heterophonic"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Texture-identification challenge completed!":null },
    { type:"term-race", title:"Game 2 · Compare the Layers",
      intro:"Match each texture with the relationship among its musical layers.",
      miaIntro:"Identify the relationship, not just the number of performers.",
      spec:{rounds:4, reverse:true, pool:[
        ["One melodic line","Monophonic"],
        ["Melody with support","Homophonic"],
        ["Independent melodies","Polyphonic"],
        ["Variants of one melody","Heterophonic"]]},
      result:(score)=>score>=3?"Layer relationships matched correctly!":null },
    { type:"symbol-hunt", title:"Game 3 · Texture in the Score",
      intro:"Examine each score excerpt and identify its predominant texture.",
      miaIntro:"Compare the rhythms, contours, and roles of the parts.",
      spec:{rounds:6, pool:[
        {label:"Monophonic (single line)", spec:{clef:"treble",notes:[{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"}],width:190}},
        {label:"Homophonic (melody + chords)", spec:{clef:"treble",notes:[{p:"E5",d:"q"},{p:"C4",d:"q",chord:true},{p:"G4",d:"q",chord:true},{p:"F5",d:"q"},{p:"C4",d:"q",chord:true},{p:"A4",d:"q",chord:true}],width:210}},
        {label:"Polyphonic (two directions)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E5",d:"q",chord:true},{p:"D4",d:"q"},{p:"D5",d:"q",chord:true},{p:"E4",d:"q"},{p:"C5",d:"q",chord:true}],width:210}},
        {label:"Chordal homophony (block motion)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:210}}]},
      result:(score)=>score>=5?"You identified the notated textures correctly.":null },
    { type:"term-race", title:"Game 4 · Texture in Context",
      intro:"Match each musical description with its most likely texture.",
      miaIntro:"Base your answer on the described relationship among the parts.",
      spec:{rounds:8, reverse:true, pool:[
        ["Unaccompanied chant","monophonic"],
        ["Pop song (voice + band chords)","homophonic"],
        ["Hymn: all voices same rhythm","homophonic (chordal)"],
        ["Round: staggered same melody","polyphonic"],
        ["Fugue","polyphonic"],
        ["Solo flute alone","monophonic"],
        ["Folk tune plain + ornamented at once","heterophonic"],
        ["Texture asks","how layers combine"]]},
      result:(score)=>score>=6?"You matched the musical settings and textures correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on musical layers, melodic independence, and texture types. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Mono","one line"],["Homo","melody + support"],["Poly","independent lines"],["Hetero","simultaneous variants"],["Texture","layer combination"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{}, count:2 },
    { type:"mc", q:"Musical texture describes…", choices:["how simultaneous lines and layers are organized","the speed of the music","the key signature"], answer:0,
      explain:"Lines and their jobs." },
    { type:"mc", q:"One unaccompanied melody creates which texture?", choices:["Monophonic","Homophonic","Polyphonic"], answer:0,
      explain:"Mono = one line." },
    { type:"mc", q:"A prominent melody with simple chordal accompaniment is…", choices:["Homophonic","Monophonic","Heterophonic"], answer:0,
      explain:"Leader + support." },
    { type:"mc", q:"Two simultaneous melodies that maintain melodic independence create which texture?", choices:["Polyphonic","Monophonic","Homophonic"], answer:0,
      explain:"Poly = many independent lines." },
    { type:"truefalse", q:"A choir singing one unaccompanied melody in unison is monophonic.", answer:true,
      explain:"One LINE, many voices." },
    { type:"truefalse", q:"In melody-dominated homophony, one melodic line is prominent while the other parts provide harmonic support.", answer:true,
      explain:"Polyphony is defined by melodic independence, not necessarily equal importance." },
    { type:"truefalse", q:"Heterophony presents simultaneous variants of one underlying melody.", answer:true,
      explain:"Plain + ornamented at once." },
    { gen:"term-match", params:{subject:"term", pool:[["Chant alone","monophonic"],["Song + chords","homophonic"],["Fugue","polyphonic"],["Ornamented unison","heterophonic"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Texture", def:"How musical layers work together."},
    {term:"Monophonic", def:"One melody only."},
    {term:"Homophonic", def:"Melody with accompaniment."},
    {term:"Polyphonic / Heterophonic", def:"Polyphonic: independent melodies. Heterophonic: one melody, different versions."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Texture</b> = musical layers.",
    "✔ <b>Monophonic</b> = one melody.",
    "✔ <b>Homophonic</b> = melody + accompaniment.",
    "✔ <b>Polyphonic</b> = independent melodies.",
    "✔ <b>Heterophonic</b> = one melody, different versions."
  ],
  tips:[
    "Ear test order: is there more than one line? If no — mono. If yes: does one lead with support? homo. Independent lines? poly.",
    "Most pieces CHANGE texture section by section — listen for the shifts, not one label per piece.",
    "Sing a round with friends: you'll build polyphony out of a monophonic tune in real time.",
    "Next lesson: the shapes whole SONGS take — strophic, through-composed and AABA."
  ],
  rewards:{ badge:"Layer Listener", icon:"\u{1F9F6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Count the melodic lines and determine how the musical layers interact.",
  quiz:[
    { type:"mc", q:"Musical texture describes…", choices:["how musical lines and layers combine","tempo markings","formal sections"], answer:0,
      explain:"Layers and jobs.", hint:"Fabric of sound." },
    { type:"mc", q:"Monophonic texture consists of…", choices:["one melodic line without harmonic accompaniment","a melody with chordal accompaniment","two independent melodic lines"], answer:0,
      explain:"One line only.", hint:"Mono = 1." },
    { type:"mc", q:"A soloist sings over a simple guitar chordal accompaniment. What is the predominant texture?", choices:["Homophonic","Monophonic","Polyphonic"], answer:0,
      explain:"Melody + accompaniment.", hint:"Leader + support." },
    { type:"mc", q:"Polyphonic texture features…", choices:["two or more simultaneous lines with melodic independence","one unaccompanied melodic line","only block chords without melodic motion"], answer:0,
      explain:"The simultaneous lines retain independent melodic motion.", hint:"Poly = many." },
    { type:"mc", q:"Four voices move together with the same rhythm while producing a chord progression. What is the texture?", choices:["Homorhythmic or chordal homophony","Polyphony","Monophony"], answer:0,
      explain:"Moving together = homophonic type.", hint:"Block motion." },
    { type:"mc", q:"Heterophonic texture consists of…", choices:["simultaneous variants of one underlying melody","several completely unrelated melodies","one chord followed by silence"], answer:0,
      explain:"Plain and ornamented at once.", hint:"Same tune, different versions." },
    { type:"mc", q:"A round becomes which texture after staggered melodic entries overlap?", choices:["Polyphonic","Monophonic","Homophonic"], answer:0,
      explain:"Overlapping independent entries.", hint:"After voice 2 enters…" },
    { type:"truefalse", q:"Forty singers performing one melody in unison create polyphonic texture.", answer:false,
      explain:"They create one melodic line, so the texture is monophonic.", hint:"Count lines, not people." },
    { type:"truefalse", q:"A prominent vocal melody with chordal instrumental support is a common homophonic texture in popular music.", answer:true,
      explain:"Popular music may also include polyphonic, monophonic, or mixed passages.", hint:"Singer + band." },
    { type:"mc", q:"Identify the predominant texture.",
      staff:{clef:"treble",notes:[{p:"E5",d:"q"},{p:"C4",d:"q",chord:true},{p:"G4",d:"q",chord:true},{p:"F5",d:"q"},{p:"C4",d:"q",chord:true},{p:"A4",d:"q",chord:true}],width:220},
      choices:["Homophonic — a prominent melody with chordal support","Monophonic","Polyphonic"], answer:0,
      explain:"The upper line presents the principal melody while the lower parts move primarily as chordal accompaniment.", hint:"Who leads?" },
    { type:"mc", q:"Which pairing correctly matches a musical description with its texture?", choices:["Unaccompanied unison melody → monophonic","Independent contrapuntal lines → monophonic","Melody with chordal accompaniment → heterophonic"], answer:0,
      explain:"Texture is determined by the relationship among musical layers, not by genre labels alone.", hint:"Match the layers." },
    { type:"mc", q:"Which listening strategy is most useful for identifying texture?", choices:["Count the distinct melodic lines and determine how they relate","Measure the tempo","Identify the key signature"], answer:0,
      explain:"Consider the number of melodic lines, their independence, and whether one line is supported by the others.", hint:"Two questions." }
  ],
  miaPerfect:"Perfect score! You accurately identified monophonic, homophonic, polyphonic, and heterophonic textures.",
  miaPass:"You passed! Next, you will study common song forms.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version 1: one line (monophonic). Version 2: melody + chords (homophonic). Version 3: two independent lines (polyphonic).",
      play:()=>{const mel=[64,65,67,69,67,65,64];mel.forEach((m,i)=>MFAudio.tone(m,.34,i*.32,.4));[48,50,52,53,55,53,52].forEach((m,i)=>MFAudio.tone(m,.34,i*.32+.16,.34));} },
    learn:{ label:"texture",
      explain:"Mono = one line; homo = melody + support (or block chords); poly = independent lines; hetero = one melody, simultaneous variants.",
      hint:"Count lines, check who leads.",
      play:()=>{[60,62,64,65,67].forEach((m,i)=>MFAudio.tone(m,.32,i*.3,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 is homophonic (melody over chords); example 2 is polyphonic (two lines in contrary motion)." },
    game:{ label:"the games",
      explain:"Identify the textures, match layer relationships, read layers on cards, then place real settings.",
      hint:"Lines and their relationships." },
    quiz:{ label:"this question",
      explain:"Two questions answer everything: how many independent lines? And does one lead while others support?",
      play:()=>{[64,65,67].forEach((m,i)=>MFAudio.tone(m,.34,i*.32,.4));[[48,64,67]].forEach(row=>row.forEach(c=>MFAudio.tone(c,.7,1.1,.2)));} }
  }
};
