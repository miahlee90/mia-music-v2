/* Lesson 103 — Larger Instrumental Forms (Book 4, Unit 25 — SELF-AUTHORED)
   Core: MINUET & TRIO (ternary of ternaries, 3/4, moderate) · SCHERZO
   (its faster replacement) · MARCH (duple, trio section) · CONCERTO intro
   (soloist vs orchestra, three movements, cadenza).
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[103]={
  welcome:"Compare instrumental movement forms and multi-movement genres.",
  hook:{
    say:"<b>Listen to a triple-meter dance, a contrasting middle section, and the return of the opening dance.</b> \u{1F447} <b>Which movement form does this describe?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Minuet → trio → minuet</button></div>
          <div class="choices hk-ch" style="display:none"><button>Minuet and trio—a large ternary design</button><button>A fugue</button><button>Twelve-bar blues</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          let t=0; const q=.42;
          /* Minuet (A) — bright, high, C major */
          [72,76,79,77,74,71].forEach(m=>{MFAudio.tone(m,q*.9,t,.28);t+=q;});
          MFAudio.tone(72,q*1.8,t,.30);t+=q*2;
          /* Trio (B) — lower register, softer, a NEW key (F#), smoother motion */
          MFAudio.tone(62,q*.95,t,.15);t+=q; MFAudio.tone(66,q*.95,t,.15);t+=q; MFAudio.tone(69,q*.95,t,.15);t+=q;
          MFAudio.tone(67,q*1.9,t,.15);t+=q*2; MFAudio.tone(62,q*.95,t,.15);t+=q;
          MFAudio.tone(67,q*1.8,t,.15);t+=q*2;
          /* Minuet (A) returns — bright and high again */
          [72,76,79].forEach(m=>{MFAudio.tone(m,q*.9,t,.28);t+=q;});
          MFAudio.tone(72,q*1.8,t,.30);t+=q*2;
          setTimeout(()=>ch.style.display="",t*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Minuet–trio–minuet creates an overall ternary design. The trio provides contrast before the opening minuet returns.");
          else fb(false,"Compare the three-part plan with ternary form: A–B–A.");
        });
      } }
  },
  objectives:[
    "MINUET & TRIO: a triple-meter dance movement in a large A–B–A design; each main section is commonly binary",
    "SCHERZO: the minuet's faster, more energetic successor",
    "MARCH: duple or quadruple meter, often with a contrasting trio",
    "CONCERTO (intro): soloist(s) in dialogue or contrast with an ensemble, commonly three movements, cadenza",
    "Place these forms inside multi-movement works",
    "Recognize each by meter, tempo and plan"
  ],
  steps:[
    { say:"<b>Minuet and Trio:</b> A minuet is a triple-meter dance associated especially with the Baroque and Classical periods. In a minuet-and-trio movement, the minuet is followed by a contrasting trio and then returns, producing a large A–B–A design. The minuet and trio are each commonly written in rounded binary or another binary design. The return of the minuet is often marked \u{201C}Minuet da capo\u{201D} and may be performed without repeating its internal sections. \u{1F447} <b>What is the trio in a minuet-and-trio movement?</b>",
      try:{ type:"mc", choices:["The contrasting middle section","The final chord","A three-note motive"], answer:0,
        success:"✓ Correct. The trio is the contrasting middle section of the larger A–B–A design. Its name reflects historical associations with reduced three-part scoring, although later trios are not limited to three instruments.",
        fail:"Identify the contrasting section between the two statements of the minuet.",
        hint:"Minuet–trio–minuet corresponds to A–B–A." } },
    { say:"<b>Scherzo and Trio:</b> The scherzo developed as an alternative to the minuet in many multi-movement works. It commonly uses fast triple meter and a large scherzo–trio–scherzo design. The Italian word \u{201C}scherzo\u{201D} means \u{201C}joke,\u{201D} but musical scherzos may be playful, energetic, dramatic, or even ominous. Beethoven helped establish the scherzo as a frequent replacement for the minuet in symphonies and other large instrumental works. \u{1F447} <b>Compared with a Classical minuet, a scherzo commonly has…</b>",
      try:{ type:"mc", choices:["A faster tempo and more energetic rhythmic character","A requirement to abandon triple meter","No possibility of a trio section"], answer:0,
        success:"✓ Correct. A scherzo often retains the large ternary plan while using a faster tempo and more active rhythmic character.",
        fail:"Compare the tempo, articulation, and rhythmic character.",
        hint:"A scherzo is commonly faster and more energetic than a minuet." } },
    { say:"<b>March:</b> A march is an instrumental or vocal genre characterized by a regular pulse and rhythms associated with coordinated movement. Marches commonly use duple or quadruple meter. Many traditional military and concert marches include a contrasting trio, often in a related key such as the subdominant, but not every march uses this form. \u{1F447} <b>Which meter type is especially common in marches?</b>",
      try:{ type:"mc", choices:["Duple or quadruple meter","Triple meter only","Free rhythm only"], answer:0,
        success:"✓ Correct. Marches frequently organize their pulse in groups of two or four. Some traditional marches also include a contrasting trio.",
        fail:"Listen for regularly grouped duple pulses.",
        hint:"Common march meters include 2/4, cut time, and 4/4." } },
    { say:"<b>Concerto—Introduction:</b> A concerto is an instrumental genre featuring one or more soloists in dialogue or contrast with an ensemble. Classical concertos commonly use three movements in a fast–slow–fast arrangement. First movements often adapt sonata form to concerto procedures, sometimes including orchestral and solo expositions. A cadenza is a virtuosic solo passage, traditionally improvised but often written out in later repertoire. In many Classical first movements, it occurs near the end, when the orchestra pauses before the final cadence. \u{1F447} <b>What is a cadenza?</b>",
      try:{ type:"mc", choices:["A virtuosic passage that highlights the soloist","The orchestra's loudest chord","A type of melodic ornament"], answer:0,
        success:"✓ Correct. A cadenza highlights the soloist and was historically often improvised, although many cadenzas are written out.",
        fail:"Identify the passage that gives the soloist extended prominence.",
        hint:"It often occurs near a major cadence in a concerto movement." } },
    { say:"<b>A Common Four-Movement Cycle:</b> Many Classical symphonies, string quartets, and other large instrumental works use a four-movement plan. This is a common model rather than a universal requirement. \u{1F447} <b>In a conventional four-movement Classical cycle, where does the minuet or scherzo commonly appear?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Mvt</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Tempo</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Common form</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">1</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">fast</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">sonata form</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">2</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">slow</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">several forms</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">3</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">dance</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">minuet &amp; trio or scherzo &amp; trio</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800">4</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">fast</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">rondo, sonata, or sonata-rondo</td></tr></table>
        <p style="font-size:13px;margin:8px auto 0;max-width:460px;text-align:center">Sonatas may contain two, three, or four movements, while Classical concertos commonly contain three and usually omit the separate dance movement.</p>
        <p style="font-size:13px;margin:8px auto 2px;max-width:460px"><b>Remember:</b></p>
        <ul style="font-size:13px;margin:0 auto;max-width:460px;padding-left:20px;text-align:left">
          <li>Minuet/scherzo and trio: commonly large ternary movement types</li>
          <li>Traditional march: regular pulse; may include a trio</li>
          <li>Concerto: soloist or soloists with ensemble</li>
          <li>Multi-movement cycle: an ordered collection of contrasting movements</li></ul>` },
      try:{ type:"mc", choices:["In the third movement","Always in the first movement","Always as the finale"], answer:0,
        success:"✓ Correct. In the conventional four-movement model, the minuet or scherzo commonly appears as the third movement.",
        fail:"Recall the conventional placement after the slow movement.",
        hint:"Opening movement → slow movement → minuet or scherzo → finale." } },
    { say:"<b>Recognizing Instrumental Forms and Genres:</b> Consider several types of evidence — meter and rhythmic profile, tempo and character, sectional organization, instrumentation and performing forces, and historical and stylistic context. Triple meter alone does not prove that a movement is a minuet or scherzo, and duple meter alone does not prove that it is a march. A concerto is identified by the structural relationship between soloist and ensemble, not simply by the presence of a solo passage. \u{1F447} <b>A fast triple-meter movement uses a scherzo–trio–scherzo design. What is it?</b>",
      try:{ type:"mc", choices:["Scherzo and trio","Minuet and trio","March"], answer:0,
        success:"✓ Correct. The fast tempo, triple meter, and scherzo–trio–scherzo design identify it as a scherzo and trio.",
        fail:"Combine the tempo, meter, character, and formal plan.",
        hint:"This movement type frequently replaced the minuet in nineteenth-century works." } },
    { say:"<b>Review:</b> \u{1F447} <b>What is the large-scale design of a conventional minuet-and-trio movement?</b>",
      try:{ type:"mc", choices:["A–B–A","A–B","A–B–A–C–A"], answer:0,
        success:"✓ Correct. The minuet functions as A, the trio as B, and the return of the minuet as A.",
        fail:"Map minuet–trio–minuet onto formal letters.",
        hint:"Opening section → contrast → return." } }
  ],
  examples:[
    { caption:"A minuet in 3/4 with a pickup — an elegant courtly dance phrase in G major (note the F♯).",
      staff:{clef:"treble",time:"3/4",tempo:120,notes:[
        {p:"G4",d:"8"},{p:"D5",d:"8"},{bar:"single"},
        {p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{bar:"single"},
        {p:"A4",d:"q"},{p:"G4",d:"h"},{bar:"single"},
        {p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F#4",d:"8"},{p:"G4",d:"8"},{bar:"single"},
        {p:"A4",d:"h"},{p:"G4",d:"8"},{p:"D5",d:"8"},{bar:"single"},
        {p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{bar:"single"},
        {p:"A4",d:"q"},{p:"G4",d:"h"},{bar:"final"}],
        beams:[[0,1],[12,13],[16,17]],width:900},
      kb:{start:62,octaves:1.1667,labels:true} },
    { caption:"A march phrase: duple meter, dotted tread, strong downbeats — left, right, left, right.",
      staff:{clef:"treble",time:"2/4",tempo:112,notes:[
        {p:"C4",d:"q.",artic:"accent"},{p:"C4",d:"8"},{bar:"single"},
        {p:"E4",d:"q",artic:"accent"},{p:"G4",d:"q"},{bar:"single"},
        {p:"F4",d:"q.",artic:"accent"},{p:"D4",d:"8"},{bar:"single"},
        {p:"C4",d:"h"},{bar:"final"}],width:560},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Instrumental-Form Identification",
      intro:"Identify movement forms and genres from meter, structure, and instrumentation.",
      miaIntro:"Use several musical clues, not meter alone.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Minuet & trio","3/4 dance in big ABA"],
        ["Trio","the contrasting middle section"],
        ["Scherzo","the fast, playful minuet successor"],
        ["March","duple tread with a trio"],
        ["Concerto","soloist(s) & ensemble in dialogue, 3 movements"],
        ["Cadenza","the soloist's brilliant solo passage"],
        ["Movement 3 of a symphony","minuet or scherzo"],
        ["Concerto movement plan","fast - slow - fast"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Instrumental forms identified!":null },
    { type:"order-tap", title:"Game 2 · Assemble a Four-Movement Cycle",
      intro:"Arrange the movements of a common four-movement Classical cycle.",
      miaIntro:"Opening movement → slow movement → minuet/scherzo → finale.",
      spec:{sequence:["Mvt 1 — fast, sonata form","Mvt 2 — slow, songful","Mvt 3 — minuet or scherzo","Mvt 4 — fast finale"],
        title:"The four-movement plan"},
      result:(stars)=>stars>=2?"You assembled the conventional four-movement plan.":null },
    { type:"order-tap", title:"Game 3 · Build Minuet and Trio",
      intro:"Arrange the large sections of a minuet-and-trio movement.",
      miaIntro:"Minuet → trio → minuet da capo.",
      spec:{sequence:["Minuet (A)","Trio (B) — contrasting","Minuet again (A)"],
        title:"Big ABA"},
      result:(stars)=>stars>=2?"You assembled the large ternary design.":null },
    { type:"term-race", title:"Game 4 · Identify the Form or Genre",
      intro:"Use structural, metric, and instrumental clues to identify each example.",
      miaIntro:"Meter, tempo, formal plan, and performing forces.",
      spec:{rounds:8, reverse:true, pool:[
        ["Stately, 3/4, with trio","minuet"],
        ["Fast joke, 3/4, with trio","scherzo"],
        ["Duple tread, trio section","march"],
        ["Soloist + orchestra","concerto"],
        ["Soloist alone near the end","cadenza"],
        ["Three movements fast-slow-fast","concerto plan"],
        ["Each minuet section internally","a small binary"],
        ["The big shape of minuet & trio","ABA"]]},
      result:(score)=>score>=6?"You identified the forms and genres correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on minuet and trio, scherzo and trio, marches, concertos, and multi-movement cycles.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Minuet","stately 3/4"],["Scherzo","fast joke"],["Trio","the middle"],["March","duple tread"],["Cadenza","solo spotlight"]], reverse:true}, count:6 },
    { gen:"rhythm-count", params:{}, count:2 },
    { type:"mc", q:"Which meter is traditionally associated with the minuet?", choices:["Triple meter, commonly 3/4","Duple meter only","Free meter"], answer:0, explain:"The triple-time dance." },
    { type:"mc", q:"What is the overall design of a conventional minuet-and-trio movement?", choices:["A–B–A","A–B","A–B–A–C–A"], answer:0, explain:"Dance — trio — dance." },
    { type:"mc", q:"Compared with a Classical minuet, a scherzo is commonly…", choices:["Faster and more rhythmically energetic","Always slower","Required to use duple meter"], answer:0, explain:"The joke movement." },
    { type:"mc", q:"A concerto normally features…", choices:["One or more soloists with an ensemble","Unaccompanied voices only","Two conductors"], answer:0, explain:"The star and the ensemble." },
    { type:"truefalse", q:"A traditional Classical cadenza gives extended prominence to the soloist while the orchestra pauses.", answer:true, explain:"Later concertos may treat cadenzas differently." },
    { type:"truefalse", q:"Many traditional military and concert marches include a contrasting trio section.", answer:true, explain:"Contrast, often subdominant." },
    { type:"truefalse", q:"A Classical concerto commonly uses three movements in a fast–slow–fast arrangement.", answer:true, explain:"This is a common convention rather than a universal rule." },
    { gen:"term-match", params:{subject:"term", pool:[["Mvt 1","sonata form"],["Mvt 2","slow, ABA/variations"],["Mvt 3","minuet/scherzo"],["Mvt 4","rondo or sonata finale"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Minuet and Trio", def:"A triple-meter dance movement in a large A–B–A design."},
    {term:"Scherzo and Trio", def:"A faster, more energetic successor to the minuet."},
    {term:"March", def:"Duple-based music with a strong, regular beat; may include a trio."},
    {term:"Concerto", def:"Soloist(s) and ensemble in dialogue, commonly in three movements."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Minuet & trio</b> = big ABA in 3/4; sections commonly binary.",
    "✔ <b>Scherzo</b> = the same plan, fast and energetic.",
    "✔ <b>March</b> = duple or quadruple tread, often with a trio.",
    "✔ <b>Concerto</b> = soloist(s) in dialogue with an ensemble, commonly fast-slow-fast, with <b>cadenza</b>.",
    "✔ Symphony map: sonata · slow · dance · finale."
  ],
  tips:[
    "The trio is your landmark: hear the texture shift, and you are in the B of the big ABA.",
    "Scherzo hunting: symphony third movements after Beethoven — count how fast the 'minuet' got.",
    "In concertos, the orchestra's sudden silence announces the cadenza.",
    "Unit 25 complete! Next unit: chromatic harmony — leading-tone chords, Neapolitan, augmented sixths."
  ],
  rewards:{ badge:"Grand Designer", icon:"\u{1F3BB}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Use meter, character, formal plan, and performing forces to identify each form or genre.",
  quiz:[
    { type:"mc", q:"A conventional minuet-and-trio movement is organized as…", choices:["Minuet–trio–minuet, an overall A–B–A design","A–B only","Rondo form"], answer:0, explain:"Ternary at movement scale.", hint:"L74 grown up." },
    { type:"mc", q:"Which description is commonly associated with a Classical minuet?", choices:["Triple meter and dance character","Duple meter and march character","Free rhythm without meter"], answer:0, explain:"The courtly dance.", hint:"Three elegant beats." },
    { type:"mc", q:"Which statement best describes the trio section?", choices:["It provides contrast before the return of the opening minuet or scherzo","It must repeat the opening section exactly","It must be a percussion solo"], answer:0, explain:"The B of the big ABA.", hint:"Historically, some trios used reduced scoring, but later trio sections are not limited to fewer performers." },
    { type:"mc", q:"What does the Italian word \u{201C}scherzo\u{201D} mean?", choices:["Joke","Song","Slow"], answer:0, explain:"Despite the name, a scherzo may be playful, dramatic, or ominous.", hint:"Italian humor." },
    { type:"mc", q:"Which meter type is especially common in marches?", choices:["Duple or quadruple","Triple only","Unmetered only"], answer:0, explain:"Left-right.", hint:"Two feet." },
    { type:"mc", q:"A concerto normally features…", choices:["One or more soloists in relation to an ensemble","Unaccompanied choir","Two pianos only"], answer:0, explain:"Soloist and ensemble in dialogue.", hint:"The dialogue." },
    { type:"mc", q:"Which movement plan is common in Classical concertos?", choices:["Fast–slow–fast","Three slow movements","Exactly one movement in every concerto"], answer:0, explain:"Three movements.", hint:"Outer speed." },
    { type:"mc", q:"Where does a cadenza commonly occur in a Classical concerto first movement?", choices:["Near the end, before the final cadential close","Only at the very beginning","In the trio section"], answer:0, explain:"The orchestra traditionally pauses while the soloist performs a passage that may have been improvised historically.", hint:"The spotlight." },
    { type:"truefalse", q:"The minuet and trio are each commonly organized in binary or rounded-binary form.", answer:true, explain:"Binary inside ternary.", hint:"Forms nest." },
    { type:"truefalse", q:"A scherzo-and-trio movement commonly retains a large A–B–A design related to minuet and trio.", answer:true, explain:"It kept the plan, changed the speed.", hint:"Same structure." },
    { type:"mc", q:"In a conventional four-movement Classical cycle, the minuet or scherzo commonly appears as movement…", choices:["3","1","4"], answer:0, explain:"Minuet/scherzo slot.", hint:"After the slow movement." },
    { type:"mc", q:"A movement is fast, rhythmically energetic, in triple meter, and follows scherzo–trio–scherzo form. What is it?", choices:["Scherzo and trio","March","Concerto"], answer:0, explain:"The joke in three.", hint:"Not stately." }
  ],
  miaPerfect:"Perfect score! You accurately distinguished instrumental movement forms and multi-movement genres.",
  miaPass:"You passed and completed unit 25. Next, you will study leading-tone chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Dance — contrasting middle — dance again: minuet & trio, ternary form at movement scale.",
      play:()=>{let t=0;[[60,64,67],[65,69,72],[67,71,74],[60,64,67]].forEach(row=>{row.forEach(m=>MFAudio.tone(m,.5,t,.26));t+=.55;});} },
    learn:{ label:"larger forms",
      explain:"Minuet & trio (big ABA, 3/4), scherzo (fast, energetic), march (duple/quadruple, often + trio), concerto (soloist(s), commonly 3 mvts, cadenza); symphony map 1-4.",
      hint:"Meter, tempo, cast.",
      play:()=>{let t=0;[[60,64,67],[62,65,69],[60,64,67]].forEach(row=>{row.forEach(m=>MFAudio.tone(m,.5,t,.26));t+=.55;});} },
    example:{ label:"the examples",
      explain:"Example 1 is a minuet in 3/4 with a pickup; example 2 treads a dotted march in 2/4." },
    game:{ label:"the games",
      explain:"Sprint the forms, assemble a symphony, stage the minuet & trio, then identify forms from clues.",
      hint:"Three questions: meter, tempo, cast." },
    quiz:{ label:"this question",
      explain:"Meter narrows it (3 vs 2), character decides (stately/joke/tread), and a soloist against orchestra means concerto.",
      play:()=>{let t=0;[[60,64,67],[65,69,72]].forEach(row=>{row.forEach(m=>MFAudio.tone(m,.5,t,.26));t+=.55;});} }
  }
};
