/* Lesson 88 — Phrases & Periods (Book 4, Unit 22 — SELF-AUTHORED)
   Core: ANTECEDENT phrase (first phrase, ends with the weaker cadence — often
   HC or IAC) + CONSEQUENT phrase (answering phrase, ends with a stronger
   cadence — often PAC) = a PERIOD. Parallel period: both phrases begin with
   the same or closely related material. Contrasting period: they begin differently.
   NOTE: edit by FULL-FILE REWRITE only. */

/* period ear lab: which phrase is the question? */
function MF_L88_ear(container,fb){
  const ANT=[[60,.4],[64,.4],[67,.4],[74,.4],[71,.8]], CON=[[60,.4],[64,.4],[67,.4],[65,.4],[60,.8]];
  let heardA=false,heardB=false;
  container.innerHTML=`<div class="big-q l88e-q" style="text-align:center">Hear both phrases, then decide which is the QUESTION (antecedent).</div>
    <div style="text-align:center">
      <button class="play l88e-a">▶ Phrase 1</button>
      <button class="play l88e-b">▶ Phrase 2</button></div>
    <div class="choices l88e-ch" style="display:none"><button>Phrase 1 — it stops away from the tonic (half cadence)</button><button>Phrase 2 — it lands on the tonic</button></div>`;
  const ch=container.querySelector(".l88e-ch"), q=container.querySelector(".l88e-q");
  const play=(P)=>{ let t=0; P.forEach(([m,d])=>{ MFAudio.tone(m,d*.95,t,.42); t+=d; }); return t; };
  container.querySelector(".l88e-a").onclick=()=>{ play(ANT); heardA=true; if(heardB) setTimeout(()=>ch.style.display="",2600); };
  container.querySelector(".l88e-b").onclick=()=>{ play(CON); heardB=true; if(heardA) setTimeout(()=>ch.style.display="",2600); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(i===0){ fb(true,"✓ Phrase 1 paused on the dominant — the QUESTION (antecedent). Phrase 2 answered with the tonic — the CONSEQUENT. Together: a PERIOD."); q.textContent="Question found — the period is complete."; ch.style.display="none"; }
    else { MFAudio.tone(40,.2); fb(false,"Which phrase feels UNFINISHED? That one asks the question."); }
  });
}

LESSON_CONTENT[88]={
  welcome:"Two related phrases can form a period.",
  hook:{
    say:"Listen to the two phrases. The first ends with an expectation of continuation, while the second provides stronger closure. \u{1F447} <b>How are the phrases related?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play both phrases</button></div>
          <div class="choices hk-ch" style="display:none"><button>The second phrase answers and completes the first</button><button>The phrases are unrelated</button><button>The second phrase is an exact repetition of the first</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          const A=[[60,.4],[64,.4],[67,.4],[74,.4],[71,.9]], B=[[60,.4],[64,.4],[67,.4],[65,.4],[60,.9]];
          let t=0; A.forEach(([m,d])=>{ MFAudio.tone(m,d*.95,t,.42); t+=d; }); t+=.35;
          B.forEach(([m,d])=>{ MFAudio.tone(m,d*.95,t,.42); t+=d; });
          setTimeout(()=>ch.style.display="",t*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The first phrase ends on the dominant, while the second returns to tonic with a stronger cadence. Together, the antecedent and consequent form a period. Because both phrases begin with the same opening material, this is a parallel period.");
          else fb(false,"The phrases begin with related material, but their endings differ. Listen for the stronger cadence at the end of the second phrase.");
        });
      } }
  },
  objectives:[
    "Review the musical phrase",
    "Define Antecedent and Consequent",
    "Define a Period",
    "Distinguish Parallel and Contrasting periods",
    "Recognize question vs. answer phrases",
    "Identify periods by ear and by notation"
  ],
  steps:[
    { say:"<b>Phrase — Review:</b> A phrase is a musical idea that usually ends with a cadence. Two phrases can form a period when the second answers the first. \u{1F447} <b>What normally helps mark the end of a phrase?</b>",
      try:{ type:"mc", choices:["A cadence","A key signature","A double bar line by itself"], answer:0,
        success:"✓ Correct. A cadence normally marks the end of a phrase and helps define its degree of closure.",
        fail:"Recall the harmonic and melodic gesture that marks a phrase ending.",
        hint:"Review the cadence types from Lesson 87." } },
    { say:"<b>The Antecedent — the first phrase of a period.</b> Usually ends with:<br>• Half Cadence, or<br>• Imperfect Authentic Cadence<br>This leaves the music feeling unfinished. \u{1F447} <b>How does an antecedent usually end?</b>",
      try:{ type:"mc", choices:["With a cadence weaker than the consequent's cadence","With the strongest cadence in the period","Without any phrase ending"], answer:0,
        success:"✓ Correct. The antecedent ends with less closure than the consequent, often through a half cadence or IAC.",
        fail:"Compare the strength of the antecedent cadence with the consequent cadence.",
        hint:"The first cadence is normally weaker than the final cadence." } },
    { say:"<b>The Consequent — the second phrase of a period.</b> It answers the antecedent and usually ends with a <b>Perfect Authentic Cadence</b>, creating stronger closure. \u{1F447} <b>How does a consequent normally relate to the antecedent?</b>",
      try:{ type:"mc", choices:["It provides a stronger cadential conclusion","It ends with less closure","It avoids cadential motion"], answer:0,
        success:"✓ Correct. The consequent provides greater closure than the antecedent, commonly by ending with a PAC.",
        fail:"Identify which phrase has the stronger final cadence.",
        hint:"The consequent completes the period." } },
    { say:"<b>The Period:</b> two related phrases — the antecedent asks, the consequent answers. The second phrase ends more strongly than the first. \u{1F447} <b>What is the defining relationship within a simple period?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:12px;justify-content:center;align-items:center;font-weight:800;font-size:15px;flex-wrap:wrap">
        <div style="border:2px solid #C05A21;border-radius:10px;padding:10px 16px;background:#fff;color:#C05A21">Antecedent<br><span style="font-weight:400;font-size:12.5px;color:#555">question · weaker cadence</span></div>
        <div style="font-size:20px">+</div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:10px 16px;background:#fff;color:#2F6DA8">Consequent<br><span style="font-weight:400;font-size:12.5px;color:#555">answer · stronger cadence</span></div>
        <div style="font-size:20px">=</div>
        <div style="border:2px solid #A9821F;border-radius:10px;padding:10px 16px;background:#fff;color:#A9821F">PERIOD</div></div>` },
      try:{ type:"mc", choices:["Two phrases in which the second provides stronger cadential closure","One phrase repeated without a cadence","Several unrelated motives"], answer:0,
        success:"✓ Correct. The antecedent creates an expectation that the consequent answers with a stronger cadence.",
        fail:"Compare the cadences at the ends of the two phrases.",
        hint:"Antecedent followed by consequent." } },
    { say:"<b>Parallel vs Contrasting Periods:</b><br>• <b>Parallel</b> — both phrases start the same (or similar).<br>• <b>Contrasting</b> — the second phrase starts differently.<br>Both still need the weaker → stronger cadence pair. \u{1F447} <b>Both phrases of a period begin with the same four-note motive. How is the period classified?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"a…"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"B4",d:"h",label:"HC"},{bar:"single"},
        {p:"C4",d:"q",label:"a again…"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"C4",d:"h",label:"PAC"},{bar:"final"}],width:620} },
      try:{ type:"mc", choices:["Parallel","Contrasting","It cannot be a period"], answer:0,
        success:"✓ Correct. Because both phrases begin with the same melodic material, the period is parallel. Their different cadences establish the antecedent–consequent relationship.",
        fail:"Compare the melodic material at the beginning of each phrase.",
        hint:"Parallel periods have similar phrase openings." } },
    { say:"Identify the antecedent phrase by ear. \u{1F447}",
      try:{ type:"custom",
        hint:"Listen for the phrase with the weaker cadence and less finality.",
        mount:(container,fb)=>MF_L88_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>How are the two cadences in a simple period normally related?</b>",
      try:{ type:"mc", choices:["The antecedent cadence is weaker than the consequent cadence","Both cadences must have equal strength","The antecedent cadence must be stronger"], answer:0,
        success:"✓ Correct. A period depends on progressive cadential strength: the consequent provides greater closure than the antecedent.",
        fail:"Compare the strength of the two cadences…",
        hint:"Weaker → stronger." } }
  ],
  examples:[
    { caption:"A parallel period: both phrases open identically; phrase 1 pauses on the dominant (half cadence), phrase 2 closes on the tonic (PAC).",
      staff:{clef:"treble",tempo:96,notes:[
        {p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},
        {p:"A4",d:"q"},{p:"F4",d:"q"},{p:"D4",d:"h",label:"half cadence"},{bar:"single"},
        {p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},
        {p:"F4",d:"q"},{p:"D4",d:"q"},{p:"C4",d:"h",label:"PAC — closed"},{bar:"final"}],width:680},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"A contrasting period: the consequent begins with NEW material but still delivers the closing cadence — contrast in the opening, agreement at the end.",
      staff:{clef:"treble",tempo:96,notes:[
        {p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"B4",d:"h",label:"half cadence"},{bar:"single"},
        {p:"A4",d:"q"},{p:"G4",d:"q"},{p:"F4",d:"q"},{p:"D4",d:"q"},{p:"C4",d:"h",label:"PAC"},{bar:"final"}],width:620},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Period Structure (45s)",
      intro:"Identify antecedents, consequents, and their cadence relationships.",
      miaIntro:"Antecedent first, consequent second.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Antecedent","the question phrase"],
        ["Consequent","the answer phrase"],
        ["Period","antecedent + consequent"],
        ["Antecedent's cadence","the weaker cadence"],
        ["Consequent's cadence","the stronger cadence"],
        ["Parallel period","both phrases begin alike"],
        ["Contrasting period","the phrases begin differently"],
        ["A phrase ends at","a cadence"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Period-structure challenge completed!":null },
    { type:"order-tap", title:"Game 2 · Assemble the Period",
      intro:"Arrange the components of a simple period in the correct order.",
      miaIntro:"Antecedent → consequent.",
      spec:{sequence:["Antecedent begins","Half cadence — open","Consequent begins","Authentic cadence — closed"],
        title:"One period, start to finish"},
      result:(stars)=>stars>=2?"You assembled the period correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Compare the Cadences",
      intro:"Identify each cadence and compare its strength within the period.",
      miaIntro:"Which cadence provides greater closure?",
      spec:{rounds:6, pool:[
        {label:"Half cadence (a common antecedent ending)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:210}},
        {label:"Authentic cadence (a common consequent ending)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:210}},
        {label:"Plagal cadence", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:210}},
        {label:"Deceptive cadence", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:210}}]},
      result:(score)=>score>=5?"You compared the phrase endings correctly.":null },
    { type:"term-race", title:"Game 4 · Parallel or Contrasting?",
      intro:"Compare the beginnings of the two phrases and classify the period.",
      miaIntro:"Related openings suggest a parallel period.",
      spec:{rounds:8, reverse:true, pool:[
        ["Both phrases open with motive a","parallel period"],
        ["Phrase 2 opens with new material","contrasting period"],
        ["a + a\u{2032} phrases","parallel"],
        ["a + b phrases","contrasting"],
        ["Same start, HC then PAC","parallel period"],
        ["New start, HC then PAC","contrasting period"],
        ["The question phrase","antecedent"],
        ["The answer phrase","consequent"]]},
      result:(score)=>score>=6?"You classified the periods correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on antecedents, consequents, cadence strength, and parallel and contrasting periods. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Antecedent","question"],["Consequent","answer"],["Period","Q + A"],["Half cadence","open end"],["Authentic cadence","closed end"],["Parallel","same openings"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"A simple period consists of…", choices:["an antecedent and a consequent","two unrelated motives","one extended phrase"], answer:0,
      explain:"Question phrase + answer phrase." },
    { type:"mc", q:"The antecedent normally ends with…", choices:["a cadence weaker than the consequent's cadence","the strongest cadence in the period","no cadence"], answer:0,
      explain:"An antecedent often ends with an HC or IAC." },
    { type:"mc", q:"The consequent normally ends with…", choices:["a cadence stronger than the antecedent's cadence","a weaker cadence than the antecedent","no cadence"], answer:0,
      explain:"A consequent often concludes with a PAC." },
    { type:"mc", q:"A period whose phrases begin with the same or closely related material is…", choices:["Parallel","Contrasting","Deceptive"], answer:0,
      explain:"Same opening = parallel." },
    { type:"truefalse", q:"A simple period contains two phrases in an antecedent–consequent relationship.", answer:true,
      explain:"Question + answer." },
    { type:"truefalse", q:"In a contrasting period, the consequent begins with material different from the antecedent's opening.", answer:true,
      explain:"Contrasting = different openings." },
    { type:"truefalse", q:"The consequent provides the stronger cadential response in a period.", answer:true,
      explain:"The ANTECEDENT asks; the consequent answers with the stronger cadence." },
    { gen:"term-match", params:{subject:"term", pool:[["Open cadence","half"],["Closed cadence","authentic"],["a + a\u{2032}","parallel"],["a + b","contrasting"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Antecedent", def:"The question phrase. Ends with a weaker cadence."},
    {term:"Consequent", def:"The answer phrase. Ends with a stronger cadence."},
    {term:"Period", def:"Two phrases that form one complete musical idea."},
    {term:"Parallel / Contrasting Period", def:"Parallel: same or similar opening. Contrasting: different opening."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Antecedent</b> = question phrase → weaker cadence.",
    "✔ <b>Consequent</b> = answer phrase → stronger cadence.",
    "✔ Together they form a <b>Period</b>.",
    "✔ <b>Parallel</b> = same beginning.",
    "✔ <b>Contrasting</b> = different beginning.",
    "✔ Stronger second cadence completes the musical sentence."
  ],
  tips:[
    "Hum a familiar tune phrase by phrase — most begin with a classic parallel period.",
    "Writing your own: copy the antecedent, change only its last measure to reach I — instant parallel period.",
    "A half cadence often leaves the antecedent open; the consequent closes with a stronger cadence, often a PAC.",
    "Next lesson: repeating an idea at NEW pitch levels — the melodic sequence."
  ],
  rewards:{ badge:"Sentence Builder", icon:"\u{1F4AC}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Antecedent plus consequent, with weaker-to-stronger cadential motion, forms a simple period.",
  quiz:[
    { type:"mc", q:"A simple period is…", choices:["two phrases in an antecedent–consequent relationship","one motive","a type of cadence"], answer:0,
      explain:"Antecedent + consequent.", hint:"A musical sentence." },
    { type:"mc", q:"The antecedent phrase normally…", choices:["ends with less closure than the consequent","ends with the strongest cadence in the period","has no ending"], answer:0,
      explain:"It creates an expectation that the consequent will complete.", hint:"It is the first phrase of the period." },
    { type:"mc", q:"The consequent phrase normally…", choices:["responds with a stronger cadence","creates less closure than the antecedent","avoids cadences"], answer:0,
      explain:"It closes the sentence.", hint:"The full stop." },
    { type:"mc", q:"Which cadence pair can form a simple period?", choices:["IAC followed by PAC","PAC followed by HC","Two equally strong PACs"], answer:0,
      explain:"The consequent's PAC provides stronger closure than the antecedent's IAC. HC followed by PAC is another common pattern.", hint:"Weaker, then stronger." },
    { type:"mc", q:"In a parallel period, the two phrases…", choices:["begin with the same or closely related melodic material","begin with unrelated material","must be in different keys"], answer:0,
      explain:"a + a\u{2032}.", hint:"Same start." },
    { type:"mc", q:"In a contrasting period, the consequent…", choices:["begins with material different from the antecedent's opening","repeats the antecedent's opening closely","has no cadence"], answer:0,
      explain:"a + b.", hint:"New opening." },
    { type:"mc", q:"Phrase 1 ends with a half cadence. Phrase 2 begins with the same melodic material and ends with a PAC. What is the structure?", choices:["A parallel period","A contrasting period","A rondo"], answer:0,
      explain:"The related openings make the period parallel, while the HC–PAC relationship establishes antecedent and consequent.", hint:"Compare the starts." },
    { type:"truefalse", q:"A simple period normally contains a cadence at the end of each of its two phrases.", answer:true,
      explain:"One per phrase.", hint:"Count the endings." },
    { type:"truefalse", q:"The antecedent normally ends with a cadence stronger than the consequent's cadence.", answer:false,
      explain:"The antecedent cadence is normally weaker than the consequent cadence.", hint:"Questions don't close." },
    { type:"mc", q:"Which cadence commonly gives an antecedent an open ending?", choices:["Half cadence","Perfect authentic cadence","Plagal cadence"], answer:0,
      explain:"A half cadence is common at the end of an antecedent, although an IAC may also occur.", hint:"Lesson 87's comma." },
    { type:"mc", q:"In the simplified label 'a + b' for a contrasting period, what do the letters primarily distinguish?", choices:["The different opening thematic material of the two phrases","The cadence names","The meter signatures"], answer:0,
      explain:"Different letters indicate contrasting phrase beginnings.", hint:"Openings, not endings." },
    { type:"mc", q:"What creates the antecedent–consequent relationship in a period?", choices:["The second phrase responds to the first and provides stronger cadential closure","Both phrases avoid cadences","The second phrase is unrelated to the first"], answer:0,
      explain:"The consequent completes the formal relationship by ending more conclusively than the antecedent.", hint:"Q then A." }
  ],
  miaPerfect:"Perfect score! You accurately identified antecedents, consequents, and parallel and contrasting periods.",
  miaPass:"You passed! Next, you will study melodic sequence.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Phrase 1 stopped on the dominant (question); phrase 2 began the same way and closed on the tonic (answer) — a parallel period.",
      play:()=>{const A=[[60,.4],[64,.4],[67,.4],[74,.4],[71,.9]],B=[[60,.4],[64,.4],[67,.4],[65,.4],[60,.9]];let t=0;A.forEach(([m,d])=>{MFAudio.tone(m,d*.95,t,.42);t+=d;});t+=.35;B.forEach(([m,d])=>{MFAudio.tone(m,d*.95,t,.42);t+=d;});} },
    learn:{ label:"phrases & periods",
      explain:"Antecedent (question, weaker cadence — often HC or IAC) + consequent (answer, stronger cadence — often PAC) = period. Parallel: same openings; contrasting: different.",
      hint:"Weaker, then stronger.",
      play:()=>{[[62,65,69],[67,71,74]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.7,i*.8,.28)));} },
    example:{ label:"the examples",
      explain:"Example 1 is a parallel period (same openings); example 2 a contrasting one — both close with the answering PAC." },
    game:{ label:"the games",
      explain:"Sprint the pairs, assemble a period in order, sort cadences on cards, then judge parallel vs contrasting.",
      hint:"Openings name the type; cadences do the work." },
    quiz:{ label:"this question",
      explain:"Two checks: which phrase ends with the weaker cadence (that's the antecedent)? Do the openings match (parallel) or differ (contrasting)?",
      play:()=>{[[67,71,74],[60,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.28)));} }
  }
};
