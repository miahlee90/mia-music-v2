/* Lesson 79 — Asymmetrical & Changing Meter (Book 4, Unit 19 — SELF-AUTHORED)
   Core: ASYMMETRICAL meter = beats of unequal length (5/4 = 3+2 or 2+3;
   7/8 = 2+2+3 etc.). ADDITIVE thinking: read the top number as a sum of
   2s and 3s. CHANGING (mixed) meter = the time signature changes from
   measure to measure. NOTE: edit by FULL-FILE REWRITE only. */

/* ear lab: four distinct meters (4/4, 5/4, 6/8, 7/8) — classify equal vs unequal grouping */
function MF_L79_ear(container,fb){
  const METERS=[
    {per:4, unit:.42, strong:b=>b===0||b===2,          unequal:false, why:"4/4 — four even beats, grouped 2 + 2 (equal)."},
    {per:5, unit:.42, strong:b=>b===0||b===3,          unequal:true,  why:"5/4 grouped 3 + 2 — unequal beat groups."},
    {per:6, unit:.3,  strong:b=>b===0||b===3,          unequal:false, why:"6/8 — two equal groups of three (3 + 3), a compound-duple pulse."},
    {per:7, unit:.3,  strong:b=>b===0||b===2||b===4,   unequal:true,  why:"7/8 grouped 2 + 2 + 3 — unequal beat groups."}
  ];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l79e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l79e-play">▶ Play two measures</button></div>
    <div class="choices l79e-ch" style="display:none"><button>Equal beat groupings</button><button>Unequal beat groupings</button></div>`;
  const q=container.querySelector(".l79e-q"), pl=container.querySelector(".l79e-play"), ch=container.querySelector(".l79e-ch");
  pl.onclick=()=>{
    if(r>=METERS.length) return;
    const M=METERS[r];
    for(let m=0;m<2;m++) for(let b=0;b<M.per;b++){
      const s=M.strong(b);
      MFAudio.tone(s?43:55,.24,(m*M.per+b)*M.unit,s?.42:.22);
    }
    played=true; setTimeout(()=>ch.style.display="",2*M.per*M.unit*1000+300);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played||r>=METERS.length) return;
    const M=METERS[r];
    if((i===1)===M.unequal){ fb(true,"✓ "+M.why); r++; played=false; ch.style.display="none";
      if(r>=METERS.length){ q.textContent="Excellent! You can hear equal groupings from unequal ones."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${METERS.length}: listen, then decide.`;
    } else { MFAudio.tone(40,.2); fb(false,"Count the beats between the strong accents: are the groups equal, or a mix of longer and shorter?"); }
  });
  q.innerHTML="Round 1 of 4: listen, then decide.";
}

LESSON_CONTENT[79]={
  welcome:"Asymmetrical meter combines beat groups of unequal length.",
  hook:{
    say:"<b>Listen to two rhythmic patterns.</b> One divides the measure into equal beat groups, while the other divides it into unequal groups (3 + 2). \u{1F447} <b>Which pattern sounds asymmetrical?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Pattern 1</button>
          <button class="play hk-b">▶ Pattern 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Pattern 2 — its pulses form a 3 + 2 grouping</button><button>Pattern 1 — its beat groups are equal</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ for(let m=0;m<2;m++) for(let b=0;b<4;b++){ const s=b===0||b===2; MFAudio.tone(s?43:55,.24,(m*4+b)*.42,s?.42:.22); } hA=true; if(hB) setTimeout(()=>ch.style.display="",3700); };
        container.querySelector(".hk-b").onclick=()=>{ for(let m=0;m<2;m++) for(let b=0;b<5;b++){ const s=b===0||b===3; MFAudio.tone(s?43:55,.24,(m*5+b)*.42,s?.42:.22); } hB=true; if(hA) setTimeout(()=>ch.style.display="",4600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Pattern 2 combines a group of three quarter-note beats with a group of two. This unequal 3 + 2 grouping creates an asymmetrical meter.");
          else fb(false,"Pattern 1 uses equal groupings. Listen again for a longer group followed by a shorter group.");
        });
      } }
  },
  objectives:[
    "Define asymmetrical meter: groups of unequal length inside the measure",
    "Read common 5/4 groupings such as 3+2 and 2+3",
    "Read common 7/8 groupings such as 2+2+3, 2+3+2 and 3+2+2",
    "Understand additive meter by combining groups of 2s and 3s",
    "Follow changing (mixed) meter as the signature changes during a piece",
    "Hear even vs uneven meters"
  ],
  steps:[
    { say:"<b>Asymmetrical Meter:</b> An asymmetrical meter combines <b>beat groups of unequal length</b> within a measure. These beat groups are usually built from groups of 2 or 3 beats (or eighth notes), such as 2 + 3 or 2 + 2 + 3. Common examples include <b>5/4, 5/8, and 7/8</b>. \u{1F447} <b>What makes a meter asymmetrical?</b>",
      try:{ type:"mc", choices:["It combines beat groups of unequal length","It has no time signature","It must be performed slowly"], answer:0,
        success:"✓ Correct. Asymmetrical meter combines groups of different lengths, such as 3 + 2 or 2 + 2 + 3.",
        fail:"Look for groups of different lengths within the measure.",
        hint:"Look for a combination of groups containing two and three subdivisions." } },
    { say:"<b>Common 5/4 Groupings:</b> Five quarter-note beats are often grouped <b style='color:#2F6DA8'>3 + 2</b> or <b style='color:#C05A21'>2 + 3</b>:<div style='text-align:center;font-family:monospace;font-weight:800;font-size:16px;letter-spacing:1px;margin:6px 0'>[1 2 3] [4 5]</div>In a 3 + 2 grouping, the second group begins on beat 4, so the natural accents fall on beats <b>1 and 4</b>. (A 2 + 3 grouping instead accents beats 1 and 3.) \u{1F447} <b>In 5/4 grouped 3 + 2, which beats begin the two groups?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"5/4",tempo:100,notes:[
        {p:"G4",d:"q",artic:"accent",label:"1"},{p:"G4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},
        {p:"D5",d:"q",artic:"accent",label:"4"},{p:"D5",d:"q",label:"5"},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["Beats 1 and 4","Beats 1 and 3","Every beat"], answer:0,
        success:"✓ Correct. Beat 1 begins the group of three, and beat 4 begins the group of two.",
        fail:"Count the groups: 1–2–3 | 4–5.",
        hint:"Identify the first beat of each group." } },
    { say:"<b>Common 7/8 Groupings:</b> Seven eighth notes are often grouped <b>2 + 2 + 3</b>, <b>2 + 3 + 2</b>, or <b>3 + 2 + 2</b>. Each group acts like one beat: groups of two are shorter, while groups of three are longer.<div style='text-align:center;font-family:monospace;font-weight:800;font-size:15px;letter-spacing:1px;margin:6px 0'>2 + 2 + 3 → 1 2 | 3 4 | 5 6 7</div>These unequal groupings occur in many musical traditions, including numerous dances from the Balkans. \u{1F447} <b>How many eighth-note subdivisions are in a measure of 7/8?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"7/8",tempo:80,notes:[
        {p:"E4",d:"8",artic:"accent"},{p:"E4",d:"8"},
        {p:"G4",d:"8",artic:"accent"},{p:"G4",d:"8"},
        {p:"B4",d:"8",artic:"accent"},{p:"B4",d:"8"},{p:"B4",d:"8"},{bar:"final"}],
        beams:[[0,1],[2,3],[4,6]],width:440} },
      try:{ type:"mc", choices:["7","8","3"], answer:0,
        success:"✓ Correct. The measure contains seven eighth-note subdivisions, shown here in a 2 + 2 + 3 grouping.",
        fail:"The top number indicates the number of eighth-note subdivisions in the measure.",
        hint:"Read the top number of the time signature." } },
    { say:"<b>Additive Meter:</b> Additive meters are understood by <b>combining smaller groups of 2s and 3s</b>, such as 5 = 3 + 2 and 7 = 2 + 2 + 3. Emphasize the beginning of each group while keeping the underlying subdivision steady. For example, count a 3 + 2 pattern as \u{201C}ONE-two-three | ONE-two.\u{201D} \u{1F447} <b>How is 7/8 grouped 3 + 2 + 2 counted?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Meter</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Common groupings</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">5/4 · 5/8</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">3+2 · 2+3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">7/8</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">2+2+3 · 2+3+2 · 3+2+2</td></tr></table><div style="text-align:center;font-size:12px;color:#667;margin-top:6px">Optional advanced example: 8/8 grouped 3 + 3 + 2.</div>` },
      try:{ type:"mc", choices:["ONE-two-three | ONE-two | ONE-two","ONE-two | ONE-two | ONE-two-three","Seven equally accented counts"], answer:0,
        success:"✓ Correct. The group of three comes first, followed by two groups of two.",
        fail:"Follow the grouping in order: 3 + 2 + 2.",
        hint:"Emphasize the first count of each group." } },
    { say:"<b>Changing Meter (Mixed Meter):</b> The time signature may <b>change during a piece</b>—for example, from 4/4 to 3/4 and back again. Each time signature remains in effect until a new one appears. \u{1F447} <b>In the passage below, how many quarter-note beats are in the middle measure?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:10px;justify-content:center;align-items:center;font-weight:800;font-size:16px">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:10px 16px;background:#fff"><span style="color:#2F6DA8">4/4</span><br>♩ ♩ ♩ ♩</div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:10px 16px;background:#fff"><span style="color:#2F6DA8">3/4</span><br>♩ ♩ ♩</div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:10px 16px;background:#fff"><span style="color:#2F6DA8">4/4</span><br>♩ ♩ ♩ ♩</div></div>` },
      try:{ type:"mc", choices:["Three — the 3/4 signature applies to that measure","Four — the opening signature applies throughout","None"], answer:0,
        success:"✓ Correct. The 3/4 time signature remains in effect until another time signature appears.",
        fail:"Read the time signature that applies to the middle measure.",
        hint:"A time signature remains in effect until it is replaced." } },
    { say:"Listen and decide whether each example uses equal or unequal beat groupings. \u{1F447}",
      try:{ type:"custom",
        hint:"Listen to the length of each group between accents: are the groups equal, or do they form a long–short pattern?",
        mount:(container,fb)=>MF_L79_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which of these time signatures is most commonly grouped asymmetrically?</b>",
      try:{ type:"mc", choices:["7/8","4/4","12/8"], answer:0,
        success:"✓ Correct. A measure of 7/8 is commonly organized into unequal groups such as 2 + 2 + 3. By contrast, 12/8 normally contains four equal groups of three eighth notes.",
        fail:"Which meter is commonly organized using both groups of two and groups of three?",
        hint:"Look for a meter commonly grouped 2 + 2 + 3." } }
  ],
  examples:[
    { caption:"A 5/4 melody grouped 3+2: accents on beats 1 and 4. Count 'ONE-two-three ONE-two' as it plays.",
      staff:{clef:"treble",time:"5/4",tempo:104,notes:[
        {p:"D4",d:"q",artic:"accent"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"A4",d:"q",artic:"accent"},{p:"G4",d:"q"},{bar:"single"},
        {p:"F4",d:"q",artic:"accent"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"D4",d:"h",artic:"accent"},{bar:"final"}],width:640},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"7/8 grouped 2+2+3: two short steps and a long one. The beaming shows the groups — feel the drive in the final three.",
      staff:{clef:"treble",time:"7/8",tempo:84,notes:[
        {p:"E4",d:"8",artic:"accent"},{p:"F#4",d:"8"},
        {p:"G4",d:"8",artic:"accent"},{p:"A4",d:"8"},
        {p:"B4",d:"8",artic:"accent"},{p:"A4",d:"8"},{p:"G4",d:"8"},{bar:"single"},
        {p:"F#4",d:"8",artic:"accent"},{p:"E4",d:"8"},
        {p:"F#4",d:"8",artic:"accent"},{p:"G4",d:"8"},
        {p:"E4",d:"q.",artic:"accent"},{bar:"final"}],
        beams:[[0,1],[2,3],[4,6],[8,9],[10,11]],width:640},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Uneven Meter Sprint (45s)",
      intro:"Identify asymmetrical groupings, counts, and time signatures before time runs out.",
      miaIntro:"Look for combinations of groups containing two and three subdivisions.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Asymmetrical meter","beat groups of unequal length"],
        ["5/4 groupings","3+2 or 2+3"],
        ["7/8 groupings","2+2+3, 2+3+2 or 3+2+2"],
        ["Additive thinking","combine smaller groups, often 2s and 3s"],
        ["Changing meter","the signature changes mid-piece"],
        ["Accents fall on","each group's first note"],
        ["Uneven 8/8","3+3+2"],
        ["An even meter","4/4 — equal groups"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Asymmetrical-meter challenge completed!":null },
    { type:"symbol-hunt", title:"Game 2 · Name That Grouping",
      intro:"Examine each beamed measure and select the correct grouping.",
      miaIntro:"Use the beams to identify the groups.",
      spec:{rounds:6, pool:[
        {label:"5/4 as 3+2", spec:{clef:"treble",time:"5/4",notes:[{p:"G4",d:"q",artic:"accent"},{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q",artic:"accent"},{p:"G4",d:"q"}],width:230}},
        {label:"7/8 as 2+2+3", spec:{clef:"treble",time:"7/8",notes:[{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"}],beams:[[0,1],[2,3],[4,6]],width:230}},
        {label:"7/8 as 3+2+2", spec:{clef:"treble",time:"7/8",notes:[{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"}],beams:[[0,2],[3,4],[5,6]],width:230}},
        {label:"4/4 — even", spec:{clef:"treble",time:"4/4",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"}],width:200}}]},
      result:(score)=>score>=5?"You identified the groupings correctly.":null },
    { type:"order-tap", title:"Game 3 · Count the 7/8 Measure",
      intro:"Select the counts of a 2 + 2 + 3 measure in the correct order.",
      miaIntro:"Two subdivisions, two subdivisions, then three.",
      spec:{sequence:["ONE-two (first group of 2)","ONE-two (second group of 2)","ONE-two-three (the group of 3)"],
        title:"One measure of 7/8, group by group"},
      result:(stars)=>stars>=2?"You counted the 7/8 grouping correctly.":null },
    { type:"term-race", title:"Game 4 · Equal or Unequal?",
      intro:"Classify each notated grouping before time runs out.",
      miaIntro:"Compare the lengths of the indicated groups.",
      spec:{rounds:8, reverse:true, pool:[
        ["5/4 grouped 3+2","asymmetrical"],
        ["7/8 grouped 2+2+3","asymmetrical"],
        ["4/4 grouped 2+2","even — simple quadruple"],
        ["12/8 grouped 3+3+3+3","even — compound quadruple"],
        ["8/8 as 3+3+2","uneven grouping"],
        ["3/4","even — simple triple"],
        ["Meter that changes each measure","changing (mixed) meter"],
        ["Where uneven accents fall","on group starts"]]},
      result:(score)=>score>=6?"You classified the groupings correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on 5/4, 7/8, additive meter, and changing meter. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Asymmetrical","unequal groups"],["5/4","3+2 or 2+3"],["7/8","2+2+3 and friends"],["Additive meter","a combination of smaller groups"],["Changing meter","new signature mid-piece"]], reverse:true}, count:6 },
    { gen:"rhythm-count", params:{}, count:2 },
    { type:"mc", q:"How many quarter-note beats are notated in a measure of 5/4?", choices:["5","4","3"], answer:0,
      explain:"The top number indicates five quarter-note beats. These beats may be organized into groups such as 3 + 2 or 2 + 3." },
    { type:"mc", q:"Which is a common asymmetrical grouping of 7/8?", choices:["2 + 2 + 3","4 + 4","3 + 3 + 3"], answer:0,
      explain:"2 + 2 + 3 includes seven eighth-note subdivisions." },
    { type:"mc", q:"In 5/4 grouped 2 + 3, which beats begin the two groups?", choices:["Beats 1 and 3","Beats 1 and 4","Beats 2 and 5"], answer:0,
      explain:"Group starts: 1-2 | 3-4-5." },
    { type:"mc", q:"When the time signature changes during a piece, each new signature…", choices:["remains in effect until another time signature appears","lasts for only one beat","may be ignored by the performer"], answer:0,
      explain:"Changing (mixed) meter." },
    { type:"truefalse", q:"7/8 is commonly organized into equal groups of two eighth notes.", answer:false,
      explain:"Common asymmetrical groupings of 7/8 include one group of three and two groups of two." },
    { type:"truefalse", q:"12/8 is normally organized as four unequal beat groups.", answer:false,
      explain:"12/8 normally contains four equal dotted-quarter beats, each divided into three eighth notes." },
    { type:"truefalse", q:"In additive meter, the beginning of each group receives emphasis while the underlying subdivision remains steady.", answer:true,
      explain:"ONE-two-three ONE-two." },
    { gen:"term-match", params:{subject:"term", pool:[["Group of 3","the long step"],["Group of 2","the short step"],["Accent","each group's first note"],["8/8 uneven","3+3+2"]], reverse:true}, count:3 },
    { gen:"note-value", params:{}, count:2 }
  ],
  vocabulary:[
    {term:"Asymmetrical Meter", def:"A meter that combines beat groups of unequal length, as in 5/4 grouped 3+2 or 7/8 grouped 2+2+3."},
    {term:"Additive Meter", def:"Understanding a meter by combining smaller groups, often 2s and 3s: 5 = 3+2, 7 = 2+2+3."},
    {term:"Changing Meter (Mixed Meter)", def:"The time signature changes during a piece; each remains in effect until replaced."},
    {term:"Grouping Accents", def:"The accent on each group's first note — it tells the listener the meter's shape."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Asymmetrical meter</b> mixes <b>unequal groups</b> — the uneven grouping is deliberate.",
    "✔ Common groupings: <b>5/4</b> = 3+2 or 2+3 · <b>7/8</b> = 2+2+3, 2+3+2 or 3+2+2.",
    "✔ Think <b>additively</b>: combine smaller groups, often 2s and 3s; emphasize group starts while keeping the subdivision steady.",
    "✔ <b>Changing meter</b>: each new signature rules until the next.",
    "✔ Beaming and accents reveal the grouping at a glance."
  ],
  tips:[
    "Walk it: step LONG-short for 5/4 (3+2) — your feet learn asymmetry faster than your eyes.",
    "In 7/8, find the 3 first; the 2s fall into place around it.",
    "Famous asymmetry to find tonight: a jazz classic in 5/4 — count ONE-two-three ONE-two along with it.",
    "Unit 19 complete! Next unit returns to pitch: the modes, put to WORK."
  ],
  rewards:{ badge:"Odd-Meter Navigator", icon:"\u{2696}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify the groups of two and three, and locate the beginning of each group.",
  quiz:[
    { type:"mc", q:"What makes a meter asymmetrical?", choices:["It combines beat groups of unequal length","It lacks a time signature","It requires a slow tempo"], answer:0,
      explain:"The uneven grouping defines it.", hint:"Un-equal." },
    { type:"mc", q:"Which pair shows two common groupings of 5/4?", choices:["3 + 2 and 2 + 3","4 + 1 and 1 + 4","Five separately accented groups"], answer:0,
      explain:"A group of three and a group of two may occur in either order.", hint:"3 and 2." },
    { type:"mc", q:"Which grouping was presented as a common asymmetrical organization of 7/8?", choices:["2 + 3 + 2","2 + 2 + 2","3 + 3 + 3"], answer:0,
      explain:"2 + 3 + 2 contains seven eighth-note subdivisions arranged in unequal groups.", hint:"Look for unequal groups that total seven subdivisions." },
    { type:"mc", q:"In 5/4 grouped 3 + 2, which beats begin the two groups?", choices:["Beats 1 and 4","Beats 1 and 3","Beats 2 and 4"], answer:0,
      explain:"1-2-3 | 4-5 — group starts.", hint:"After the group of three." },
    { type:"mc", q:"What is one way to understand additive meter?", choices:["As a combination of smaller beat groups, such as 3 + 2","As the unrestricted addition of extra beats","As a doubling of the tempo"], answer:0,
      explain:"Additive meter combines smaller beat groups, often groups of two and three.", hint:"Addition." },
    { type:"mc", q:"Identify the grouping.",
      staff:{clef:"treble",time:"7/8",notes:[{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"D5",d:"8"},{p:"D5",d:"8"}],beams:[[0,2],[3,4],[5,6]],width:240},
      choices:["3 + 2 + 2","2 + 2 + 3","Seven separately accented eighth notes"], answer:0,
      explain:"The beaming shows one group of three followed by two groups of two.", hint:"Count each beam." },
    { type:"mc", q:"What is changing, or mixed, meter?", choices:["The time signature changes during the music","Two meters are performed simultaneously","The music has no bar lines"], answer:0,
      explain:"For example, a passage may move from 4/4 to 3/4 and then return to 4/4.", hint:"Signatures in sequence." },
    { type:"truefalse", q:"In changing meter, a new time signature remains in effect until another one appears.", answer:true,
      explain:"Each signature rules its stretch.", hint:"Until replaced." },
    { type:"truefalse", q:"9/8 grouped 3 + 3 + 3 is asymmetrical.", answer:false,
      explain:"The three beat groups are equal, so this is compound triple meter rather than an asymmetrical grouping.", hint:"Are the groups equal?" },
    { type:"mc", q:"You hear a repeating five-beat pattern grouped 3 + 2. Which meter best matches the pattern?", choices:["5/4 grouped 3 + 2","4/4 grouped 2 + 2","6/8 grouped 3 + 3"], answer:0,
      explain:"A group of three quarter-note beats followed by a group of two produces a 3 + 2 organization of 5/4.", hint:"Count to the next strong beat." },
    { type:"mc", q:"Why does 8/8 grouped 3 + 3 + 2 sound asymmetrical?", choices:["It combines groups of unequal length","Eight is an odd number","It contains no rhythmic emphasis"], answer:0,
      explain:"Although 8/8 and 4/4 can contain the same total duration, the 3 + 3 + 2 grouping creates unequal main beats.", hint:"Grouping decides." },
    { type:"mc", q:"Which list contains time signatures commonly used with asymmetrical groupings?", choices:["5/4, 7/8, and 5/8","4/4, 3/4, and 2/4","6/8, 9/8, and 12/8"], answer:0,
      explain:"5/4, 7/8, and 5/8 are commonly organized using unequal groups of two and three subdivisions.", hint:"Look for meters commonly grouped as combinations such as 3 + 2 or 2 + 2 + 3." }
  ],
  miaPerfect:"Perfect score! You accurately identified asymmetrical groupings and changing meters.",
  miaPass:"You passed and completed unit 19. Next, you will apply these rhythmic skills in new musical contexts.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Pattern 1 pulsed in equal fours; pattern 2 went STRONG-2-3-STRONG-2 — five beats in unequal groups: asymmetrical meter.",
      play:()=>{for(let b=0;b<5;b++){ const s=b===0||b===3; MFAudio.tone(s?43:55,.24,b*.42,s?.42:.22);} } },
    learn:{ label:"asymmetrical & changing meter",
      explain:"Beat groups of unequal length: 5/4 is often 3+2 or 2+3; 7/8 is often 2+2+3; think additively; changing meter swaps signatures during a piece.",
      hint:"Combine smaller groups, often 2s and 3s.",
      play:()=>{for(let b=0;b<7;b++){ const s=b===0||b===2||b===4; MFAudio.tone(s?43:55,.2,b*.3,s?.4:.2);} } },
    example:{ label:"the examples",
      explain:"Example 1 walks a 5/4 melody in 3+2; example 2 drives 7/8 in 2+2+3 — the beams show the groups." },
    game:{ label:"the games",
      explain:"Sprint the groupings, read beams on cards, count a 7/8 measure in order, then sort even from uneven.",
      hint:"Accents mark group starts." },
    quiz:{ label:"this question",
      explain:"Two checks: is the measure commonly organized into equal groups (even) or into unequal groups such as 2 + 2 + 3 (asymmetrical)? And which signature currently rules the measure?",
      play:()=>{for(let b=0;b<5;b++){ const s=b===0||b===3; MFAudio.tone(s?43:55,.22,b*.4,s?.4:.2);} } }
  }
};
