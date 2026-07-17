/* Lesson 41 — Dotted Eighth Notes (AEMT Book 2, Unit 10)
   Built from drafts/UNIT 10 – Lesson 41.md; AEMT p.64 verified by render.
   Core: dot = +half the value; 8th (=2 sixteenths) + dot = 3 sixteenths = ¾ beat;
   usually followed by ONE sixteenth ("long-short"); three notations, one rhythm.
   Uses staff.js v7.6 "8." + partial-beam stubs [[i,i,2]].
   NOTE: edit by FULL-FILE REWRITE only. */

/* long-short vs even lab: hear the difference, then pick which is which */
function MF_L41_feel(container,fb){
  const ROUNDS=[true,false,true,false].sort(()=>Math.random()-.5);
  let i=0,heard=false;
  container.innerHTML=`<div class="big-q l41-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l41-p">▶ Hear the beat pair</button></div>
    <div class="choices l41-ch" style="display:none"><button>\u{1F998} Long–short (dotted 8th + 16th)</button><button>\u{2696} Even (two equal 8ths)</button></div>`;
  const q=container.querySelector(".l41-q"), ch=container.querySelector(".l41-ch");
  function ask(){ heard=false; ch.style.display="none";
    q.textContent=`Sound ${i+1} of ${ROUNDS.length}: is this pair LONG–SHORT or perfectly EVEN?`; }
  container.querySelector(".l41-p").onclick=()=>{
    const dotted=ROUNDS[i];
    if(dotted){ MFAudio.tone(72,.5,0,.5); MFAudio.tone(74,.15,.66,.5); MFAudio.tone(76,.5,.88,.5); }
    else { MFAudio.tone(72,.35,0,.5); MFAudio.tone(74,.35,.44,.5); MFAudio.tone(76,.5,.88,.5); }
    heard=true; setTimeout(()=>ch.style.display="",1600);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!heard) return;
    const dotted=ROUNDS[i];
    if((bi===0)===dotted){ i++; MFAudio.yay();
      if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l41-p").style.display="none";
        q.textContent="The swagger detector is calibrated!";
        fb(true,"✓ Four for four! Long–short = dotted 8th + 16th (¾ + ¼); even = two straight eighths (½ + ½). Your ear knows the difference now."); }
      else { fb(true,`✓ ${dotted?"Long–short — the dotted rhythm!":"Perfectly even eighths."} Next…`); setTimeout(ask,900); } }
    else { MFAudio.tone(40,.25); fb(false,"Listen for the limp: LOOONG-short… or flat, even steps?"); }
  });
  ask();
}

/* dot calculator: build the dotted 8th from sixteenth blocks */
function MF_L41_calc(container,fb){
  let placed=0;
  container.innerHTML=`<div class="big-q l41-cq" style="text-align:center">Build a dotted eighth note using sixteenth-note units.<br>
    <span style="font-weight:600">An eighth note equals <b>2</b> sixteenth notes. A dot adds <b>half of the note's original value</b>. Half of 2 is 1.</span><br>
    Tap the ➕:</div>
    <div class="l41-cbar" style="display:flex;gap:6px;justify-content:center;margin:14px 0;min-height:44px"></div>
    <div style="text-align:center"><button class="play l41-add">➕ Add the dot's value</button></div>
    <div class="l41-cmsg" style="text-align:center;font-weight:800;min-height:24px;color:var(--correct)"></div>`;
  const bar=container.querySelector(".l41-cbar"), msg=container.querySelector(".l41-cmsg"), btn=container.querySelector(".l41-add");
  function block(txt,extra){ return `<div style="width:64px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:${extra?"var(--correct)":"var(--primary)"}">${txt}</div>`; }
  function draw(){
    bar.innerHTML=block("♬ ¼")+block("♬ ¼")+(placed>=1?block("+ ¼",true):"");
    msg.textContent=placed===0? "" : "2 + 1 = 3 sixteenth notes = ¾ of one beat";
  }
  btn.onclick=()=>{
    if(placed>=1) return;
    placed=1; draw(); btn.style.display="none";
    MFAudio.tone(72,.62,0,.55); 
    fb(true,"✓ Correct! You built a dotted eighth note: 2 + 1 = 3 sixteenth notes (¾ beat). It is usually followed by a sixteenth note to complete one beat.");
  };
  draw();
}

LESSON_CONTENT[41]={
  welcome:"One tiny dot turns even eighths into a DOTTED rhythm: LONG–short. \u{1F998}",
  hook:{
    say:"Same two pitches, two rhythms: one is even eighth notes, one is the DOTTED rhythm — a long note followed by a quick short one. Press both. <b>Which one is LOOONG-short, LOOONG-short?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Walk A</button>
          <button class="play hk-b">▶ Walk B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Walk B is long–short</button><button>Walk A is long–short</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ for(let k=0;k<4;k++){ MFAudio.tone(72,.3,k*.44,.5); MFAudio.tone(76,.3,k*.44+.22,.5);} hA=true; if(hB) setTimeout(()=>ch.style.display="",2200); };
        container.querySelector(".hk-b").onclick=()=>{ for(let k=0;k<4;k++){ MFAudio.tone(72,.4,k*.44,.5); MFAudio.tone(76,.12,k*.44+.33,.5);} hB=true; if(hA) setTimeout(()=>ch.style.display="",2200); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Walk B was the DOTTED rhythm — dotted 8th (¾ beat) then a quick 16th (¼ beat). Marches, jazz, film themes — that strut is everywhere. Today you'll learn its math and its notation.");
          else fb(false,"Play them again — one is flat and even, one is long–short.");
        });
      } }
  },
  objectives:[
    "Apply the dot rule to eighth notes",
    "State the value: dotted 8th = 3 sixteenths = ¾ beat",
    "Count the dotted-8th + 16th figure with 1-e-&-a",
    "Recognize the three notations of the same rhythm",
    "Read partial (stub) beams",
    "Perform the long–short rhythm accurately"
  ],
  steps:[
    { say:"Dot review — the rule you learned back with dotted halves and quarters: <b>a dot adds HALF of the note's own value</b>. \u{1F447} <b>A dotted HALF note equals…?</b>",
      try:{ type:"mc", choices:["3 beats (2 + 1)","2½ beats","4 beats"], answer:0,
        success:"✓ Half note (2) + its half (1) = 3. The dot rule never changes — today we just aim it at a smaller note.",
        fail:"Half of the half note's 2 beats is…",
        hint:"2 + half-of-2." } },
    { say:"Now aim the dot at the <b>eighth note</b>. Do the math with blocks: \u{1F447} <b>Build the dotted eighth from sixteenths:</b>",
      try:{ type:"custom",
        hint:"An 8th = 2 sixteenths. The dot adds HALF of that.",
        mount:(container,fb)=>MF_L41_calc(container,fb) } },
    { say:"So: <b>dotted 8th = ¾ beat = 3 of the beat's 4 sixteenth-slots</b>. That leaves exactly one slot — which is why the dotted 8th is almost always followed by a <b>single sixteenth</b>: together they make one clean beat. \u{1F447} <b>Dotted 8th + 16th adds up to…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"8.",label:"1 e &"},{p:"B4",d:"16",label:"a"},{p:"B4",d:"q",label:"2"},{bar:"final"}],
        beams:[[0,1],[1,1,2]],width:400} },
      try:{ type:"mc", choices:["Exactly 1 beat (¾ + ¼)","1½ beats","¾ of a beat"], answer:0,
        success:"✓ ¾ + ¼ = 1. The pair is a one-beat package — music's favorite long–short unit.",
        fail:"Add the fractions: ¾ + ¼.",
        hint:"Three slots + one slot = ?" } },
    { say:"Counting it: the dotted 8th starting on the beat lasts through '<b>1 – e – &</b>', and the sixteenth snaps on '<b>a</b>'. Say it: 'ONE-ee-and-<b>a</b>, TWO-ee-and-<b>a</b>' — hold long, flick short. \u{1F447} <b>In this figure, on which syllable does the SIXTEENTH play?</b>",
      try:{ type:"mc", choices:["a — the very last slot","e — the second slot","& — the middle"], answer:0,
        success:"✓ Hold 1-e-&, play on 'a'. The little note ALWAYS lands late and quick — that's the strut.",
        fail:"The dotted 8th eats the first THREE slots…",
        hint:"3 slots held + the 4th played." } },
    { say:"Ear check — dotted or even? \u{1F447} <b>Judge each pair:</b>",
      try:{ type:"custom",
        hint:"Long–short limps; even eighths march flat.",
        mount:(container,fb)=>MF_L41_feel(container,fb) } },
    { say:"One rhythm, three equivalent spellings: (1) an 8th <b>tied</b> to a 16th plus a 16th, (2) the <b>dot</b> replacing the tie, (3) the beamed pair with a <b>stub beam</b> on the 16th. They SOUND identical — the dot is just the tidiest spelling. \u{1F447} <b>Play the example, then: what does the dot replace?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,time:"2/4",notes:[
        {p:"B4",d:"8",x:130},{p:"B4",d:"16",x:190},{p:"B4",d:"16",x:250},
        {p:"B4",d:"8.",x:400},{p:"B4",d:"16",x:470},{bar:"final"}],
        arcs:[{from:0,to:1,type:"tie"}],
        beams:[[0,2],[1,2,2],[3,4],[4,4,2]],
        brackets:[{from:0,to:2,label:"tied spelling"},{from:3,to:4,label:"dotted spelling"}],width:560} },
      try:{ type:"mc", choices:["A tie to a sixteenth note","A rest","The second beam"], answer:0,
        success:"✓ The dot = a built-in tie to one more sixteenth. Same ¾-beat sound, half the ink.",
        fail:"Spelling 1 used a tie; spelling 2 swapped it for…",
        hint:"Dot = tie, compressed." } },
    { say:"Reading detail: in the beamed pair, the 16th carries a <b>partial beam</b> — a short SECOND beam stub that doesn't reach the dotted 8th. One full beam = the pair; the stub = 'this one's a sixteenth'. \u{1F447} <b>The stub beam tells you…?</b>",
      try:{ type:"mc", choices:["Which note of the group is the sixteenth","Where the measure ends","That the note is staccato"], answer:0,
        success:"✓ Full beam joins the pair; the little stub singles out the 16th. Now you can read the figure at sight.",
        fail:"Only ONE note in the pair is a sixteenth — how does the beam show it?",
        hint:"Two beams = sixteenth; the stub is beam #2." } }
  ],
  examples:[
    { caption:"The long–short strut in action — count '1 e & a' and feel the hold-hold-hold-SNAP of every beat.",
      staff:{clef:"treble",tempo:60,time:"4/4",notes:[
        {p:"C5",d:"8.",label:"1 e &"},{p:"D5",d:"16",label:"a"},{p:"E5",d:"8.",label:"2 e &"},{p:"D5",d:"16",label:"a"},
        {p:"C5",d:"8",label:"3"},{p:"D5",d:"8",label:"&"},{p:"C5",d:"q",label:"4"},{bar:"final"}],
        beams:[[0,1],[1,1,2],[2,3],[3,3,2],[4,5]],width:660} },
    { caption:"Three spellings, one sound: tied 8th+16th, then the dotted pair, then plain even 8ths for contrast — hear how the first two match and the third walks flat.",
      staff:{clef:"treble",tempo:60,time:"3/4",notes:[
        {p:"B4",d:"8"},{p:"B4",d:"16"},{p:"B4",d:"16"},
        {p:"B4",d:"8."},{p:"B4",d:"16"},
        {p:"B4",d:"8"},{p:"B4",d:"8"},{bar:"final"}],
        arcs:[{from:0,to:1,type:"tie"}],
        beams:[[0,2],[1,2,2],[3,4],[4,4,2],[5,6]],
        brackets:[{from:0,to:2,label:"tie"},{from:3,to:4,label:"dot"},{from:5,to:6,label:"even"}],width:620} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Dot Detective Sprint (45s)",
      intro:"Note values with and without dots — name them before the clock!",
      miaIntro:"Spot the dots, do the math! \u{1F575}",
      spec:{gen:"note-value", params:{values:["8","8.","16","q","q."],ask:"name"}, seconds:45},
      result:(score)=>score>=9?score+" values in 45 seconds — dot mathematician!":null },
    { type:"rhythm-tap", title:"Game 2 · Strut Tap Lab",
      intro:"Tap the dotted rhythms — hold looong, snap short!",
      miaIntro:"Feel the limp: 1-e-&-A! \u{1F998}",
      spec:{tempo:60, rounds:3, patterns:[
        ["8.","16","q","q"],
        ["q","8.","16","q"],
        ["8.","16","8.","16"]]},
      result:(score)=>score!==null?"That strut is officially yours!":null },
    { type:"value-race", title:"Game 3 · Beat-Math Race (45s)",
      intro:"How many beats? Dotted values included — calculate at speed!",
      miaIntro:"¾ is the number of the day! \u{1F9EE}",
      spec:{seconds:45, values:["8","8.","16","q","q.","h."], ask:"beats"},
      result:(score)=>score>=9?"Fraction calculations at full tempo!":null },
    { type:"measure-build", title:"Game 4 · One-Beat Workshop",
      intro:"Build exactly one beat — the dotted 8th needs its little partner!",
      miaIntro:"¾ + ¼ = the perfect pair! \u{1F9F1}",
      spec:{beats:1, unique:false, buttons:[
        {t:"8.",label:"Dotted 8th",beats:0.75,item:{p:"B4",d:"8."}},
        {t:"16",label:"Sixteenth",beats:0.25,item:{p:"B4",d:"16"}},
        {t:"8",label:"Eighth",beats:0.5,item:{p:"B4",d:"8"}}]},
      result:(score)=>score!==null?"Every beat balanced — dots and all!":null }
  ],
  practiceIntro:"20 practice questions — dot math, counting, the three spellings, stub beams. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["8","8.","16","q","q."],ask:"name"}, count:4 },
    { gen:"note-value", params:{values:["8","8.","16","q","q.","h."],ask:"beats"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Dotted Eighth Note","¾ beat — three sixteenths"],["The dot","adds half of the note's own value"],["Long–short rhythm","dotted 8th followed by a 16th"],["Partial beam","the stub that marks the 16th in a beamed pair"]], reverse:true}, count:3 },
    { type:"mc", q:"A dotted eighth note equals how many sixteenth notes?", choices:["3","2","4"], answer:0,
      explain:"2 (the 8th) + 1 (the dot) = 3." },
    { type:"mc", q:"A dotted eighth note receives…", choices:["¾ of a beat","½ of a beat","1 beat"], answer:0,
      explain:"3 of the beat's 4 sixteenth-slots." },
    { type:"mc", q:"A dotted 8th is usually followed by…", choices:["a single sixteenth note","a half note","another dotted 8th"], answer:0,
      explain:"¾ + ¼ completes the beat." },
    { type:"mc", q:"Starting on beat 1, a dotted 8th lasts through…", choices:["1 – e – &","1 – e","1 only"], answer:0,
      explain:"Three sixteenth-slots; the 16th then plays on 'a'." },
    { type:"truefalse", q:"A dot always adds half of the note's original value.", answer:true,
      explain:"True for every note size — half, quarter, or eighth." },
    { type:"truefalse", q:"A dotted 8th + 16th lasts longer than two even 8ths.", answer:false,
      explain:"Both fill exactly one beat — the SPLIT differs, not the total." },
    { type:"mc", q:"Which tied pair equals a dotted eighth?", choices:["8th tied to a 16th","8th tied to an 8th","16th tied to a 16th"], answer:0,
      explain:"½ + ¼ = ¾." },
    { type:"mc", q:"In a beamed dotted-8th + 16th pair, the stub beam belongs to…", choices:["the sixteenth","the dotted 8th","both notes"], answer:0,
      explain:"The stub is the 16th's second beam." }
  ],
  miaQuizIntro:"Hold three slots, snap the fourth — show me the strut!",
  quiz:[
    { type:"mc", q:"A dot after a note increases its length by…", choices:["half of its original value","its full value","one beat","one sixteenth"], answer:0,
      explain:"The universal dot rule.", hint:"Same rule since dotted halves." },
    { type:"mc", q:"A dotted eighth note equals…", choices:["3 sixteenth notes","2 sixteenth notes","4 sixteenth notes","1 quarter note"], answer:0,
      explain:"2 + 1 = 3 sixteenths = ¾ beat.", hint:"8th is 2; the dot adds half of 2." },
    { type:"mc", q:"In 2/4, 3/4, or 4/4 time, a dotted eighth note equals…", choices:["¾ of a beat","½ of a beat","1½ beats","¼ of a beat"], answer:0,
      explain:"Three of the four sixteenth-slots.", hint:"Think in slots: 3 of 4." },
    { type:"mc", q:"The dotted 8th + 16th figure adds up to…", choices:["one full beat","1½ beats","¾ of a beat","half a beat"], answer:0,
      explain:"¾ + ¼ = 1.", hint:"A tidy one-beat package." },
    { type:"truefalse", q:"A dotted eighth note is usually followed by a sixteenth note.", answer:true,
      explain:"The classic long–short pairing.", hint:"What fills the last slot?" },
    { type:"truefalse", q:"The dotted-8th + 16th rhythm sounds identical to two even eighth notes.", answer:false,
      explain:"¾+¼ vs ½+½ — the strut vs the flat walk.", hint:"Remember the ear lab." },
    { type:"mc", q:"Counting '1 e & a', the 16th after a dotted 8th plays on…", choices:["a","e","&","1"], answer:0,
      explain:"Hold 1-e-&, snap on 'a'.", hint:"The LAST slot." },
    { type:"mc", q:"Which tied pair sounds the same as a dotted 8th?", choices:["an 8th tied to a 16th","an 8th tied to an 8th","a 16th tied to a 16th","a quarter tied to a 16th"], answer:0,
      explain:"½ + ¼ = ¾ — the dot is a compressed tie.", hint:"The dot replaces which tie?" },
    { type:"mc", q:"Name this rhythm figure.",
      staff:{clef:"treble",notes:[{p:"B4",d:"8."},{p:"B4",d:"16"}],beams:[[0,1],[1,1,2]],width:200},
      choices:["Dotted 8th + sixteenth","Two even 8ths","8th + two 16ths"], answer:0,
      explain:"Dot on the first note, stub beam on the second.", hint:"See the dot? See the stub?" },
    { type:"mc", q:"The short stub beam in the figure marks…", choices:["the sixteenth note","a repeat","a staccato note"], answer:0,
      explain:"It's the 16th's second beam, kept short.", hint:"Beam #2, abbreviated." },
    { type:"mc", q:"The long–short dotted rhythm is common in…", choices:["marches, jazz, and popular music","only slow ballads","only drum music"], answer:0,
      explain:"It powers grooves in marches, dances, jazz and pop.", hint:"Where have you heard the long–short rhythm?" },
    { type:"mc", q:"A dotted QUARTER note equals…", choices:["1½ beats","¾ beat","2 beats"], answer:0,
      explain:"1 + ½ — same dot rule, bigger note.", hint:"Scale the rule up." },
    /* generated */
    { gen:"note-value", params:{values:["8","8.","16","q","q."],ask:"name"}, count:3 },
    { gen:"note-value", params:{values:["8","8.","16","q","q.","h."],ask:"beats"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Dotted Eighth Note","¾ beat — three sixteenths"],["The dot","adds half of the note's own value"],["Long–short rhythm","dotted 8th followed by a 16th"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Dotted Eighth Note", def:"An eighth note plus a dot — worth three sixteenth notes, or ¾ of a beat in simple meter.",
      staff:{clef:"treble",notes:[{p:"B4",d:"8."}],width:120}},
    {term:"Dot", def:"Increases a note's duration by half of its original value — for an 8th, that's one extra 16th."},
    {term:"Long–Short Rhythm", def:"The characteristic rhythm of a dotted 8th followed by a 16th — hold ¾, snap ¼.",
      staff:{clef:"treble",notes:[{p:"B4",d:"8."},{p:"B4",d:"16"}],beams:[[0,1],[1,1,2]],width:160}},
    {term:"Partial Beam", def:"The short second-beam stub that marks the sixteenth inside a beamed dotted-8th + 16th pair."}
  ],
  mistakes:[],
  summary:[
    "✔ Dot rule, smaller target: <b>dotted 8th = 2 + 1 = 3 sixteenths = ¾ beat</b>.",
    "✔ Its natural partner is a single <b>16th</b>: ¾ + ¼ = one clean beat of LONG–short.",
    "✔ Count: hold '<b>1 e &</b>', play on '<b>a</b>'.",
    "✔ Three equal spellings: tied 8th+16th · dotted pair · full beam with a <b>stub</b> on the 16th.",
    "✔ Don't rush the little note — the snap comes LATE."
  ],
  tips:[
    "Say 'HUMP-ty' — the dotted pair is exactly the rhythm of that word said with a swagger.",
    "Most common mistake: playing the pair like a triplet (too soft a limp). Keep the 16th razor-late: 3 slots + 1.",
    "See a dot? Instantly think '+half'. See a stub beam? Instantly think '16th'.",
    "Next lesson: two famous SYMBOLS replace the numbers — common time and cut time."
  ],
  rewards:{ badge:"Strut Master", icon:"\u{1F998}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score with perfect swagger! \u{1F998}\u{1F389}",
  miaPass:"Passed! Keep the snap late: 1-e-&…A!",
  mia:{
    hook:{ label:"the welcome",
      explain:"Walk A was even eighths (½+½); Walk B was the dotted strut (¾+¼). Same beat length — completely different feel.",
      play:()=>{for(let k=0;k<2;k++){MFAudio.tone(72,.3,k*.44,.5);MFAudio.tone(76,.3,k*.44+.22,.5);} for(let k=0;k<2;k++){MFAudio.tone(72,.4,1.3+k*.44,.5);MFAudio.tone(76,.12,1.3+k*.44+.33,.5);}} },
    learn:{ label:"dotted eighths",
      explain:"Dot adds half: 8th (2 sixteenths) + 1 = 3 sixteenths = ¾ beat. Partner it with one 16th for a full beat; count 1-e-&-A; the stub beam marks the 16th.",
      hint:"¾ + ¼ = 1. Hold long, snap late.",
      play:()=>{MFAudio.tone(72,.5,0,.5);MFAudio.tone(76,.14,.66,.5);} },
    example:{ label:"the examples",
      explain:"Example 1 struts through a full measure; example 2 lines up the three spellings — tie, dot, and (for contrast) even eighths." },
    game:{ label:"the games",
      explain:"Sprint the dot names, tap the strut, race the beat math, then build one-beat packages.",
      hint:"In the tap lab: whisper '1-e-&-A' and tap only the capital letters." },
    quiz:{ label:"this question",
      explain:"One formula answers nearly everything: dotted 8th = 3 sixteenths = ¾ beat, and its partner 16th lands on 'a'.",
      play:()=>{MFAudio.tone(72,.5,0,.5);MFAudio.tone(74,.14,.66,.5);MFAudio.tone(76,.4,.9,.5);} }
  }
};
