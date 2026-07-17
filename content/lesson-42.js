/* Lesson 42 — Common Time and Cut Time / Alla Breve (AEMT Book 2, Unit 10)
   Built from drafts/UNIT 10 – Lesson 42.md; AEMT p.65 verified by render.
   Core: C = 4/4 (common time); C-with-a-slash = 2/2 (cut time / alla breve):
   2 beats per measure, HALF note = 1 beat. Same notes, different feel/count.
   Uses staff.js v7.6 time:"C|" cut-time glyph.
   NOTE: edit by FULL-FILE REWRITE only. */

/* feel lab: the same passage counted in 4 vs in 2 — which is the march? */
function MF_L42_feel(container,fb){
  let h4=false,h2=false;
  container.innerHTML=`<div class="big-q" style="text-align:center">The SAME notes, counted two ways. Press both and feel the difference.</div>
    <div style="text-align:center">
      <button class="play l42-a">▶ Counted in 4 (4/4)</button>
      <button class="play l42-b">▶ Counted in 2 (cut time)</button></div>
    <div class="choices l42-ch" style="display:none"><button>Counted in 2 — it strides like a march</button><button>Counted in 4 — it strides like a march</button></div>`;
  const ch=container.querySelector(".l42-ch");
  const MEL=[72,74,76,77,79,77,76,74];
  container.querySelector(".l42-a").onclick=()=>{
    MEL.forEach((m,k)=>{ MFAudio.tone(m,.3,k*.4,.45); if(k%1===0) MFAudio.tone(45,.08,k*.4,k%4===0?.6:.3); });
    h4=true; if(h2) setTimeout(()=>ch.style.display="",MEL.length*400+300);
  };
  container.querySelector(".l42-b").onclick=()=>{
    MEL.forEach((m,k)=>{ MFAudio.tone(m,.3,k*.4,.45); if(k%2===0) MFAudio.tone(45,.1,k*.4,k%4===0?.7:.45); });
    h2=true; if(h4) setTimeout(()=>ch.style.display="",MEL.length*400+300);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(i===0) fb(true,"✓ In cut time the pulse thumps HALF as often — two big strides per measure instead of four small steps. Same notes, bigger walk. That's why fast marches are written in cut time!");
    else fb(false,"Listen to the low thumps — which version has fewer, bigger ones?");
  });
}

/* symbol match: C, cut-C, 4/4, 2/2 — connect the equivalents */
function MF_L42_match(container,fb){
  const ROUNDS=[
    {q:"Which fraction signature equals COMMON TIME (the plain C)?",opts:["4/4","2/2","3/4"],a:0,exp:"C is simply a symbol for 4/4."},
    {q:"Which fraction signature equals CUT TIME (the C with a slash)?",opts:["2/2","4/4","2/4"],a:0,exp:"Cut the 4/4 in half: 2/2 — alla breve."},
    {q:"In cut time, which note gets ONE beat?",opts:["Half note","Quarter note","Whole note"],a:0,exp:"Bottom '2' = half note is the beat unit."},
    {q:"How many beats fill a cut-time measure?",opts:["2","4","3"],a:0,exp:"Top '2' = two beats per measure."}];
  let i=0;
  container.innerHTML=`<div class="big-q l42-mq" style="text-align:center"></div><div class="choices chips l42-mch"></div>`;
  const q=container.querySelector(".l42-mq"), ch=container.querySelector(".l42-mch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Match ${i+1} of ${ROUNDS.length}: ${cur.q}`;
    ch.innerHTML="";
    cur.opts.map((o,oi)=>({o,oi})).sort(()=>Math.random()-.5).forEach(({o,oi})=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const c=ROUNDS[i];
        if(oi===c.a){ i++; MFAudio.yay();
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="All symbols decoded!";
            fb(true,`✓ ${c.exp} C = 4/4, slashed C = 2/2, half note = the cut-time beat.`); }
          else { fb(true,`✓ ${c.exp}`); setTimeout(ask,1100); } }
        else { MFAudio.tone(40,.2); fb(false,"Think: 'cut' means the 4/4 numbers are halved."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[42]={
  welcome:"Two letters that replace numbers: C for common time — and C with a slash for CUT time. \u{2702}",
  hook:{
    say:"Sometimes a time signature isn't numbers at all. Look at these two symbols — the second is the first one <b>cut</b> by a line. <b>What do you think the slash does to the counting?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const holder=document.createElement("div"); container.appendChild(holder);
        Staff.render(holder,{clef:"treble",time:"C",notes:[{p:"C5",d:"q",label:"C = ?"},{p:"C5",d:"q"},{p:"C5",d:"q"},{p:"C5",d:"q"},{bar:"final"}],width:320});
        const holder2=document.createElement("div"); container.appendChild(holder2);
        Staff.render(holder2,{clef:"treble",time:"C|",notes:[{p:"C5",d:"h",label:"\u{1D135} = ?"},{p:"C5",d:"h"},{bar:"final"}],width:320});
        const ch=document.createElement("div"); ch.className="choices";
        ch.innerHTML=`<button>It cuts the count in half — 4 beats become 2 big ones</button><button>It doubles the count to 8</button><button>It silences the measure</button>`;
        container.appendChild(ch);
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Exactly — the slash CUTS 4/4 in half: 2 beats per measure, and the HALF note takes over as the beat. Musicians call it cut time, or by its Italian name: alla breve.");
          else fb(false,"The line slices the C — and slices the numbers of 4/4 too…");
        });
      } }
  },
  objectives:[
    "Recognize the common time symbol (C) as 4/4",
    "Recognize the cut time symbol (𝄵) as 2/2",
    "State cut time's rule: 2 beats, half note = 1 beat",
    "Convert note values between 4/4 and 2/2 counting",
    "Explain why fast music often uses cut time",
    "Use the name alla breve"
  ],
  steps:[
    { say:"First symbol: a plain letter <b>C</b> in place of the time signature = <b>COMMON TIME</b>, which is simply another way of writing <b>4/4</b>. Four beats per measure, quarter note = 1 beat — everything you already know. \u{1F447} <b>C stands for…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:76,time:"C",notes:[
        {p:"C5",d:"q",label:"1"},{p:"D5",d:"q",label:"2"},{p:"E5",d:"q",label:"3"},{p:"D5",d:"q",label:"4"},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["Common time — exactly 4/4","Cut time — 2/2","'Chorus'"], answer:0,
        success:"✓ C = common time = 4/4. Same music, fancier badge.",
        fail:"The PLAIN C (no slash) is the familiar one…",
        hint:"Common = the time you've used since Lesson 11." } },
    { say:"Second symbol: draw a vertical line through the C — <b><span style='font-size:1.3em;line-height:1;vertical-align:-0.14em;display:inline-block'>𝄵</span></b> — and you get <b>CUT TIME</b>, also called <b>ALLA BREVE</b>. The slash cuts 4/4's numbers in half: <b>2/2</b>. That means <b>2 beats per measure</b>, and the <b>HALF note receives 1 beat</b>. \u{1F447} <b>In cut time, which note is the beat?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:168,time:"C|",notes:[
        {p:"C5",d:"h",label:"1"},{p:"G4",d:"h",label:"2"},{bar:"single"},
        {p:"E5",d:"h",label:"1"},{p:"C5",d:"h",label:"2"},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["The half note","The quarter note","The whole note"], answer:0,
        success:"✓ Bottom number 2 = half note gets the beat. The quarter is demoted to HALF a beat!",
        fail:"2/2: the bottom 2 names the beat note…",
        hint:"2 on the bottom = half note." } },
    { say:"The full cut-time value chart: whole note = 2 beats · half = 1 · quarter = ½ · eighth = ¼. Every note is worth HALF its 4/4 count. \u{1F447} <b>In cut time, how many beats does a QUARTER note get?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"C|",notes:[
        {p:"B4",d:"w",label:"2 beats"},{p:"B4",d:"h",label:"1 beat"},{p:"B4",d:"q",label:"½ beat"},{p:"B4",d:"8",label:"¼ beat"}],width:480} },
      try:{ type:"mc", choices:["Half a beat","One beat","Two beats"], answer:0,
        success:"✓ Quarters walk two-to-a-beat in cut time — like eighth notes used to in 4/4.",
        fail:"Everything is halved from 4/4…",
        hint:"In 4/4 it was 1 beat; now cut that." } },
    { say:"Why bother? FEEL. The notes don't change — the <b>pulse</b> does. Fast marches and fast orchestral music are exhausting to count 'one-two-three-four' at speed; in cut time you feel two broad strides instead. \u{1F447} <b>Feel it yourself:</b>",
      try:{ type:"custom",
        hint:"Listen to the low thumps — four small steps vs two big strides.",
        mount:(container,fb)=>MF_L42_feel(container,fb) } },
    { say:"Symbol drill — lock in the equivalences. \u{1F447} <b>Match every symbol to its meaning:</b>",
      try:{ type:"custom",
        hint:"C = 4/4. Slashed C = 2/2 = two half-note beats.",
        mount:(container,fb)=>MF_L42_match(container,fb) } },
    { say:"Name detail worth knowing: <b>alla breve</b> is Italian — 'according to the breve', the old long note that the half note descends from. When a conductor says 'we'll take it alla breve', they mean: count it <b>in 2</b>. \u{1F447} <b>'Alla breve' tells the players to…?</b>",
      try:{ type:"mc", choices:["Count two half-note beats per measure","Play twice as loud","Repeat each measure"], answer:0,
        success:"✓ Alla breve = cut time = 2/2 = two big beats. Three names, one meaning.",
        fail:"It's the Italian name for the slashed C…",
        hint:"Cut time's formal name." } }
  ],
  examples:[
    { caption:"The same melody twice: first in common time (four quarter-note beats), then in cut time (two half-note beats). Play both — the notes match, the stride doubles.",
      staff:{clef:"treble",tempo:76,time:"C",notes:[
        {p:"C5",d:"q",label:"1"},{p:"E5",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{p:"C5",d:"q",label:"4"},{bar:"final"}],width:400} },
    { caption:"Cut time in action — count the big TWO: whole notes take 2 beats, halves take 1, quarters just half a beat each.",
      staff:{clef:"treble",tempo:168,time:"C|",notes:[
        {p:"C5",d:"h",label:"1"},{p:"G4",d:"h",label:"2"},{bar:"single"},
        {p:"E5",d:"q",label:"1"},{p:"D5",d:"q",label:"&"},{p:"C5",d:"h",label:"2"},{bar:"single"},
        {p:"C5",d:"w",label:"1 – 2"},{bar:"final"}],width:560} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Symbol Sprint (45s)",
      intro:"C or 𝄵? 4/4 or 2/2? Match the symbols and rules at speed!",
      miaIntro:"Two symbols, zero hesitation! \u{1F3C3}",
      spec:{gen:"term-match", params:{subject:"symbol", pool:[
        ["Common time (C)","another way of writing 4/4"],
        ["Cut time (𝄵)","another way of writing 2/2"],
        ["Alla breve","the Italian name for cut time"],
        ["2/2 top number","2 beats per measure"],
        ["2/2 bottom number","the half note receives one beat"],
        ["Cut-time quarter note","worth only half a beat"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" symbol matches — badge decoder!":null },
    { type:"measure-build", title:"Game 2 · Cut-Time Constructor",
      intro:"Fill a 2/2 measure: exactly TWO half-note beats' worth!",
      miaIntro:"Two big beats — build them! \u{1F9F1}",
      spec:{beats:2, unique:false, buttons:[
        {t:"h",label:"Half Note (1 beat here!)",beats:1,item:{p:"B4",d:"h"}},
        {t:"q",label:"Quarter (½ beat here!)",beats:0.5,item:{p:"B4",d:"q"}},
        {t:"w",label:"Whole Note (2 beats here!)",beats:2,item:{p:"B4",d:"w"}},
        {t:"rh",label:"Half Rest (1 beat)",beats:1,item:{rest:"h"}}]},
      result:(score)=>score!==null?"Measures built alla breve!":null },
    { type:"rhythm-tap", title:"Game 3 · March Tap Lab",
      intro:"Tap cut-time rhythms — feel every measure as TWO strides!",
      miaIntro:"Left, right! Left, right! \u{1F6B6}",
      spec:{tempo:80, rounds:3, beatsPerBar:4, patterns:[
        ["h","q","q","h"],
        ["q","q","h","h"],
        ["h","h","q","q","q","q"]]},
      result:(score)=>score!==null?"You marched straight through it!":null },
    { type:"term-race", title:"Game 4 · Meter Vocabulary Race",
      intro:"Common, cut, alla breve, beat unit — the full Unit 10 wrap-up race!",
      miaIntro:"Last race of Unit 10! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Common Time","the symbol C — equals 4/4"],
        ["Cut Time","the slashed C — equals 2/2"],
        ["Alla Breve","Italian name for cut time"],
        ["Beat Unit","the note value that receives one beat"],
        ["Half note in 2/2","receives exactly one beat"],
        ["Whole note in 2/2","receives two beats"]]},
      result:(score)=>score>=7?"Unit 10 vocabulary: complete!":null }
  ],
  practiceIntro:"20 practice questions — symbols, conversions, and the cut-time value chart. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"symbol", pool:[["Common time (C)","another way of writing 4/4"],["Cut time (𝄵)","another way of writing 2/2"],["Alla breve","the Italian name for cut time"],["Beat unit","the note value that gets one beat"]], reverse:true}, count:4 },
    { type:"mc", q:"C is known as ____ time.", choices:["common","cut","triple"], answer:0,
      explain:"C = common time = 4/4." },
    { type:"mc", q:"𝄵 is known as ____ time.", choices:["cut (alla breve)","common","compound"], answer:0,
      explain:"The slashed C = cut time = 2/2." },
    { type:"mc", q:"𝄵 has ____ beats per measure, and the ____ note receives one beat.", choices:["2 · half","4 · quarter","2 · quarter"], answer:0,
      explain:"2/2 = two half-note beats." },
    { type:"mc", q:"In cut time, a whole note receives…", choices:["2 beats","4 beats","1 beat"], answer:0,
      explain:"Half its 4/4 value — like everything else." },
    { type:"mc", q:"In cut time, an eighth note receives…", choices:["¼ beat","½ beat","1 beat"], answer:0,
      explain:"Halved from its 4/4 value of ½." },
    { type:"mc", q:"In cut time, a dotted half note receives…", choices:["1½ beats","3 beats","2 beats"], answer:0,
      explain:"1 (half) + ½ (the dot) = 1½." },
    { type:"truefalse", q:"Common time and 4/4 are exactly the same meter.", answer:true,
      explain:"C is just a symbol for 4/4." },
    { type:"truefalse", q:"In cut time the quarter note still gets one full beat.", answer:false,
      explain:"The HALF note is the beat; quarters get ½." },
    { type:"mc", q:"Fast marches are often written in cut time because…", choices:["two big beats are easier to feel at speed","it uses less ink","quarter notes are forbidden at speed"], answer:0,
      explain:"Two strides beat four scrambling steps." },
    { type:"mc", q:"Which are the THREE names for the same thing?", choices:["cut time · alla breve · 2/2","common time · alla breve · 4/4","cut time · common time · 2/4"], answer:0,
      explain:"One meter, three labels." }
  ],
  miaQuizIntro:"Two symbols, one slash of difference — final quiz of Unit 10!",
  quiz:[
    { type:"mc", q:"The symbol C stands for…", choices:["common time (4/4)","cut time (2/2)","the note C","crescendo"], answer:0,
      explain:"A symbol, not a letter-name.", hint:"No slash = the familiar four." },
    { type:"mc", q:"The symbol 𝄵 stands for…", choices:["cut time (2/2)","common time (4/4)","3/4 time","compound time"], answer:0,
      explain:"The slash cuts 4/4 down to 2/2.", hint:"The line = the cut." },
    { type:"mc", q:"Cut time is also called…", choices:["alla breve","a cappella","allargando","alberti bass"], answer:0,
      explain:"Italian: 'according to the breve'.", hint:"Sounds like 'brief'." },
    { type:"mc", q:"In 2/2 time, the TOP number means…", choices:["2 beats per measure","half notes only","2 measures per line"], answer:0,
      explain:"Top = how many beats.", hint:"Same job as 4/4's top 4." },
    { type:"mc", q:"In 2/2 time, the BOTTOM number means…", choices:["the half note receives one beat","two notes per beat","play twice as fast"], answer:0,
      explain:"Bottom = which note IS the beat.", hint:"2 stands for the HALF note." },
    { type:"truefalse", q:"In cut time, a half note receives one beat.", answer:true,
      explain:"The half note is the beat unit.", hint:"2 on the bottom." },
    { type:"truefalse", q:"Switching a piece from 4/4 to cut time changes which notes are written.", answer:false,
      explain:"The notes stay — the COUNT and feel change.", hint:"What did the feel-lab prove?" },
    { type:"mc", q:"In cut time, a quarter note is worth…", choices:["½ beat","1 beat","2 beats","¼ beat"], answer:0,
      explain:"Half of its 4/4 value.", hint:"Everything is halved." },
    { type:"mc", q:"In cut time, a whole note is worth…", choices:["2 beats","4 beats","1 beat","8 beats"], answer:0,
      explain:"Two half-note beats.", hint:"How many halves fit inside?" },
    { type:"mc", q:"A cut-time measure can contain…", choices:["one whole note, or two half notes, or four quarters","only half notes","exactly four beats of quarters"], answer:0,
      explain:"Anything summing to 2 half-note beats.", hint:"Total = 2 beats." },
    { type:"mc", q:"Why do fast pieces prefer cut time?", choices:["Two big beats are easier to feel than four fast ones","It makes the piece shorter","It avoids bar lines"], answer:0,
      explain:"Broad strides instead of a sprint-count.", hint:"March feel." },
    { type:"mc", q:"Name this time signature.",
      staff:{clef:"treble",time:"C|",notes:[{p:"B4",d:"h"},{p:"B4",d:"h"},{bar:"final"}],width:240},
      choices:["Cut time — 2/2","Common time — 4/4","2/4"], answer:0,
      explain:"The C wears its slash: alla breve.", hint:"Look for the vertical line." },
    /* generated */
    { gen:"term-match", params:{subject:"symbol", pool:[["Common time (C)","another way of writing 4/4"],["Cut time (𝄵)","another way of writing 2/2"],["Alla breve","the Italian name for cut time"],["Beat unit","the note value that gets one beat"]], reverse:true}, count:4 },
    { gen:"note-value", params:{values:["w","h","q","8"],ask:"name"}, count:2 }
  ],
  vocabulary:[
    {term:"Common Time (C)", def:"A symbol meaning 4/4 time — four beats per measure, quarter note = one beat."},
    {term:"Cut Time (𝄵) / Alla Breve", def:"A symbol meaning 2/2 time — two beats per measure, HALF note = one beat. Every note is worth half its 4/4 count.",
      staff:{clef:"treble",time:"C|",notes:[{p:"B4",d:"h"},{p:"B4",d:"h"},{bar:"final"}],width:200}},
    {term:"Beat Unit", def:"The note value that receives one beat — named by the BOTTOM number of the time signature."},
    {term:"Meter", def:"The organization of beats into measures."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>C = common time = 4/4</b> — nothing new but the badge.",
    "✔ <b>𝄵 = cut time = alla breve = 2/2</b>: 2 beats per measure, <b>half note = 1 beat</b>.",
    "✔ Cut-time chart: whole 2 · half 1 · quarter ½ · eighth ¼ — everything halved from 4/4.",
    "✔ The notes don't change — the <b>pulse</b> does: two broad strides instead of four steps.",
    "✔ Fast marches love cut time; conductors say 'in 2'."
  ],
  tips:[
    "See the slash BEFORE you play — misreading 𝄵 as C means counting twice as many beats as the band.",
    "Practice converting aloud: 'in cut time this half note is ONE, this quarter is a half…'.",
    "The Stars and Stripes Forever and most Sousa marches: cut time. Feel them stride in 2.",
    "Unit 10 complete! Next: Unit 11 — 3/8 and 6/8, where the EIGHTH note takes the beat."
  ],
  rewards:{ badge:"Time Cutter", icon:"\u{2702}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score, cut clean in two! \u{2702}\u{1F389}",
  miaPass:"Passed! Remember the slash: it halves EVERYTHING.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The plain C is common time (4/4). The slashed C is cut time (2/2) — the line literally cuts the count in half.",
      play:()=>{[0,1,2,3].forEach(k=>MFAudio.tone(45,.1,k*.4,.5));[0,1].forEach(k=>MFAudio.tone(45,.14,2+k*.8,.65));} },
    learn:{ label:"common & cut time",
      explain:"C = 4/4. Slashed C = 2/2 = alla breve: 2 beats, half note = 1 beat, all values halved. Notes stay the same — the pulse widens.",
      hint:"The slash halves everything.",
      play:()=>{MFAudio.tone(60,.35,0,.5);MFAudio.tone(60,.35,.8,.5);} },
    example:{ label:"the examples",
      explain:"Example 1 walks the melody in common time; example 2 strides in cut time — count the big TWO with the labels." },
    game:{ label:"the games",
      explain:"Sprint the symbols, build 2/2 measures, march the tap lab, then race the vocabulary.",
      hint:"In the constructor: a half note = ONE beat here!" },
    quiz:{ label:"this question",
      explain:"Two conversions solve it all: C = 4/4, 𝄵 = 2/2 (half note = the beat, values halved).",
      play:()=>{MFAudio.tone(60,.3,0,.5);MFAudio.tone(64,.3,.4,.5);MFAudio.tone(67,.5,.8,.5);} }
  }
};
