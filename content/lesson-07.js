/* Lesson 7 — Measure, Bar Line and Double Bar (AEMT Book 1, Unit 2)
   Built from the instructor's design document (drafts/UNIT 2 – Lesson 7.md, incl. NotebookLM block)
   QA note honored: "bar" and "measure" taught as synonyms, exposed repeatedly.
   Uses staff.js v4.1 (clickBars, labeled bars), games.js v4.1 (measure-count, symbol-hunt).
   NOTE: edit by FULL-FILE REWRITE only. */

/* worksheet-style bar-spot activity (unique L7 prefix: safe for check.html batch load)
   A real melody with NO bar lines; four candidate spots marked A–D with arrows
   (like the instructor's worksheet). Student clicks the TWO spots where the
   beats reach 4 — bar lines appear on the staff, then the result plays. */
function MF_L7_barSpots(container,fb){
  const seq=[{p:"G4",d:"h"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"w"},{p:"F4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"h"}];
  const cand=[{g:1,letter:"A"},{g:2,letter:"B"},{g:3,letter:"C"},{g:5,letter:"D"}]; /* bar goes AFTER note g */
  const correct=new Set([2,3]); /* beats reach 4 after note 2 (2+1+1) and 8 after note 3 (+4) */
  const placed=new Set(), W=460, NS="http://www.w3.org/2000/svg";
  container.innerHTML=`<div class="bs2-staff"></div><div class="choices chips bs2-ch"></div>`;
  const st=container.querySelector(".bs2-staff"), ch=container.querySelector(".bs2-ch");
  cand.forEach(c=>{ const b=document.createElement("button"); b.textContent=c.letter;
    b.onclick=()=>pick(c,b); ch.appendChild(b); });
  function items(){
    const out=[]; seq.forEach((n,j)=>{ out.push(n); if(placed.has(j)) out.push({bar:"single"}); });
    if(placed.size===correct.size) out.push({bar:"final"});
    return out;
  }
  function draw(){
    const its=items();
    Staff.render(st,{clef:"treble",notes:its,width:W});
    const svg=st.querySelector("svg");
    const startX=80, L=its.length;
    const xAt=i=> L===1? (startX+W-40)/2 : startX+i*((W-40-startX)/(L-1));
    const idxMap=[]; let k=0;
    seq.forEach((n,j)=>{ idxMap[j]=k; k++; if(placed.has(j)) k++; });
    cand.forEach(c=>{
      if(placed.has(c.g)) return;
      const xa=xAt(idxMap[c.g]), xb=c.g+1<seq.length? xAt(idxMap[c.g+1]) : W-16;
      const x=(xa+xb)/2;
      const ln=document.createElementNS(NS,"line");
      ln.setAttribute("x1",x);ln.setAttribute("y1",112);ln.setAttribute("x2",x);ln.setAttribute("y2",96);
      ln.setAttribute("stroke","#33415c");ln.setAttribute("stroke-width","2");
      const hd=document.createElementNS(NS,"polygon");
      hd.setAttribute("points",`${x-4},99 ${x+4},99 ${x},91`);
      hd.setAttribute("fill","#33415c");
      const tx=document.createElementNS(NS,"text");
      tx.setAttribute("x",x);tx.setAttribute("y",127);tx.setAttribute("text-anchor","middle");
      tx.setAttribute("class","lbl");tx.setAttribute("font-weight","800");tx.textContent=c.letter;
      svg.appendChild(ln);svg.appendChild(hd);svg.appendChild(tx);
    });
  }
  function pick(c,b){
    if(placed.has(c.g)||b.disabled) return;
    if(correct.has(c.g)){
      placed.add(c.g); b.disabled=true; MFAudio.yay();
      draw();
      if([...correct].every(g=>placed.has(g))){
        ch.style.display="none";
        const spec={clef:"treble",tempo:90,notes:items(),width:W};
        const api=Staff.render(st,spec); Staff.play(spec,api);
        fb(true,"✓ B and C — exactly where the beats reach 4 and 8! Every measure now holds 4 beats. Listen…");
      } else fb(true,"✓ A bar line belongs there! Now find the other spot…");
    } else {
      MFAudio.tone(40,.25);
      fb(false,"Not there — add the beats from the last bar line (Half = 2, Quarter = 1, Whole = 4). A bar line belongs exactly where the count reaches 4.");
    }
  }
  draw();
}

LESSON_CONTENT[7]={
  welcome:"Lesson 7! Today we tidy up the music. \u{1F4E6}",
  hook:{
    say:"Music is divided into small sections called <b>measures</b>, and the vertical lines that divide them are called <b>bar lines</b>.<br><br>For today's lesson, we'll keep counting in <b>4/4 Time</b>.<br>That means every measure has <b>4 beats</b>.<br>Your job today is to discover where the <b>bar lines</b> belong so the music is organized into easy-to-read measures.<br>Next lesson, you'll learn why every measure has 4 beats!<br><br>\u{1F447} <b>Which staff is easier to read?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<p style="text-align:center;font-weight:700">A</p><div class="hk-a"></div>
          <p style="text-align:center;font-weight:700">B</p><div class="hk-b"></div>
          <div class="choices"><button>A is easier</button><button>B is easier</button></div>`;
        const notes=[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"F4",d:"q"},{p:"E4",d:"q"},{p:"D4",d:"q"}];
        Staff.render(container.querySelector(".hk-a"),{clef:"treble",notes,width:420});
        Staff.render(container.querySelector(".hk-b"),{clef:"treble",
          notes:[...notes.slice(0,4),{bar:"single"},...notes.slice(4),{bar:"final"}],width:420});
        const ch=container.querySelectorAll(".choices button");
        ch[0].onclick=()=>fb(false,"Really? All eight notes run together in A — nothing shows you where to breathe. Look at B again!");
        ch[1].onclick=()=>fb(true,"✓ B, of course! Those vertical lines chop the music into tidy sections — that's exactly what today is about.");
      } }
  },
  objectives:[
    "Identify a Bar Line",
    "Explain what a Measure (Bar) is",
    "Recognize a Double Bar",
    "Understand why music is divided into measures",
    "Count measures correctly on a musical staff",
    "Locate the ending of a piece using the Double Bar"
  ],
  steps:[
    /* Step 1 — bar lines (Activity 1: click the bar lines) */
    { say:"Music can get messy if we just pile notes together. To keep things tidy, we use <b>Bar Lines</b> — vertical lines that divide the staff into equal sections. \u{1F447} <b>Click every bar line you can find</b> (careful — notes don't count!):",
      try:{ type:"custom",
        hint:"Bar lines are the VERTICAL lines crossing the whole staff — there are 3, counting the double bar at the end.",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="b1-staff"></div>`;
          const found=new Set();
          Staff.render(container.querySelector(".b1-staff"),{clef:"treble",clickBars:true,
            notes:[{p:"E4",d:"h"},{p:"G4",d:"h"},{bar:"single"},{p:"B4",d:"q"},{p:"A4",d:"q"},{p:"G4",d:"h"},{bar:"single"},{p:"F4",d:"w"},{bar:"final"}],
            width:440,
            onBar:(i,kind)=>{
              if(found.has(i)) return;
              found.add(i); MFAudio.yay();
              if(found.size===3) fb(true,"✓ All 3 found — two single bar lines plus the double bar at the end. They slice the staff into tidy sections!");
              else fb(true,`✓ That's a bar line! ${3-found.size} more hiding…`);
            }});
        } } },
    /* Step 2 — measures (Activity 2: count the measures) */
    { say:"The space BETWEEN two bar lines is called a <b>Measure</b> — or a <b>Bar</b> (both words mean exactly the same thing!). Think of each measure as a small musical container that holds a specific number of beats. \u{1F447} <b>How many measures do you see?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"h"},{p:"E4",d:"h"},{bar:"single"},{p:"G4",d:"w"},{bar:"single"},{p:"E4",d:"q"},{p:"D4",d:"q"},{p:"C4",d:"h"},{bar:"final"}],width:440} },
      try:{ type:"mc",
        choices:["2","3","4"], answer:1,
        success:"✓ Three! Count the SPACES between bar lines, not the lines themselves.",
        fail:"Count the containers, not the lines — the double bar closes the last one.",
        hint:"The music between two bar lines = one measure." } },
    /* Step 3 — the double bar (Activity 4: find the double bar) */
    { say:"At the very end of a piece you'll meet the <b>Double Bar</b> — one thin line plus one thick line. It tells the performer: <b>“The music ends here.”</b> \u{1F447} <b>Which symbol is the double bar?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{bar:"single",label:"1"},{p:"G4",d:"q",label:"2"},{bar:"final",label:"3"}],width:340} },
      try:{ type:"mc",
        choices:["1","2","3"], answer:2,
        success:"✓ Number 3 — thin + thick, the official “the end” sign. (1 is a single bar line, 2 is just a quarter note.)",
        fail:"Look for TWO lines together — one thin, one thick.",
        hint:"The double bar has two lines; the thick one comes last." } },
    /* Step 4 — bar = measure (QA suggestion; quiz question removed at instructor request) */
    { say:"One more thing before we build: musicians use two words for the same container. In America you'll mostly hear <b>measure</b>, but plenty of musicians and books say <b>bar</b> — same container, two names. When a friend says \u201cthis piece has 8 bars,\u201d they mean 8 measures. You'll hear both words for the rest of your musical life!" },
    /* Step 5 — organize the music (Activities 3+5, worksheet style) */
    { say:"Let's organize the melody!<br>Count the beats from left to right.<br>Every time you reach <b>4 beats</b>, place a bar line.<br>There are only <b>TWO</b> correct places.<br>\u{1F447} <b>Click the correct two positions:</b>",
      try:{ type:"custom",
        hint:"Add beats from the start: Half (2) + Quarter (1) + Quarter (1) = 4 \u2192 first bar line. Keep adding to 8 for the second.",
        mount:(container,fb)=>MF_L7_barSpots(container,fb) } }
  ],
  examples:[
    { caption:"Four beats, bar line, four beats, bar line… hear how the counting restarts at every bar line: 1-2-3-4 | 1-2-3-4.",
      staff:{clef:"treble",tempo:90,notes:[{p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{bar:"single"},{p:"G4",d:"h",label:"1-2"},{p:"E4",d:"h",label:"3-4"},{bar:"final"}],width:440} },
    { caption:"The double bar (thin + thick) only appears once — at the very END. When you see it, the piece is over.",
      staff:{clef:"treble",tempo:90,notes:[{p:"E4",d:"h"},{p:"D4",d:"q"},{p:"C4",d:"q"},{bar:"single"},{p:"D4",d:"w"},{bar:"final"}],width:400} }
  ],
  games:[
    { type:"measure-count", title:"Game 1 · Measure Count Race",
      intro:"Staffs fly by — how many MEASURES in each? Count the containers between the bar lines. 6 rounds.",
      miaIntro:"Game time! Containers, not lines — count fast! \u{1F3AE}",
      spec:{rounds:6, min:2, max:5},
      result:(score)=>score>=5?"Five or more — you count measures like a conductor!":null },
    { type:"symbol-hunt", title:"Game 2 · Symbol Hunt",
      intro:"Four symbols appear — click the one Mia asks for. Bar lines, double bars, clefs, notes… eyes sharp!",
      miaIntro:"Can you tell a bar line from a double bar at a glance? Prove it! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Single Bar Line", spec:{clef:"treble",notes:[{bar:"single"}]}},
        {label:"Double Bar", spec:{clef:"treble",notes:[{bar:"final"}]}},
        {label:"Treble Clef", spec:{clef:"treble",notes:[]}},
        {label:"Bass Clef", spec:{clef:"bass",notes:[]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"Whole Note", spec:{clef:"treble",notes:[{p:"B4",d:"w"}]}}]},
      result:(score)=>score>=5?"Sharp eyes! No symbol can fool you now.":null },
    { type:"measure-build", title:"Game 3 · Fill the Container",
      intro:"Each measure is a container holding exactly <b>4 beats</b>. Fill it — then find every DIFFERENT way to fill it!",
      miaIntro:"Note values now live inside measures. Fill those containers! \u{1F3B5}",
      spec:{beats:4, unique:true},
      result:(stars)=>stars>=3?"Every combination, no overflow — the containers are in perfect order!":null },
    { type:"rhythm-tap", title:"Game 4 · Tap One Full Measure",
      intro:"Listen to one 4-beat measure, then <b>tap it back</b>. Feel where the measure begins and ends!",
      miaIntro:"Last game — your hands become the bar lines. Tap each measure back! \u{1F44F}",
      spec:{tempo:85, rounds:3, patterns:[["q","q","h"],["h","q","q"],["q","q","q","q"],["h","h"],["w"]]},
      result:(score)=>score>=8?"You tapped whole measures right on the beat — rhythm AND organization!":null }
  ],
  practiceIntro:"20 practice questions — bar lines, measures, double bars, and beat math. Answer right and the next appears automatically!",
  practice:[
    { gen:"measure-count", params:{min:2,max:4}, count:4 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { type:"mc", q:"A Bar Line is…", choices:["a vertical line dividing the staff into measures","a horizontal line for high notes","a symbol that makes notes louder"], answer:0,
      explain:"Vertical lines that slice the staff into equal containers — measures." },
    { type:"mc", q:"The space between two bar lines is called a…", choices:["measure (or bar)","staff","clef"], answer:0,
      explain:"Measure and bar are two words for the same container." },
    { type:"truefalse", q:"“Bar” and “Measure” mean the same thing.", answer:true,
      explain:"Two names, one container — you'll hear both." },
    { type:"mc", q:"Where does the Double Bar live?", choices:["at the very end of a piece","at the beginning of every line","after every measure"], answer:0,
      explain:"Thin + thick lines = “the music ends here.”" },
    { type:"truefalse", q:"A Double Bar means “start again.”", answer:false,
      explain:"It means the END. (Repeat signs come later, in Lesson 14!)" },
    { type:"truefalse", q:"Every measure in a piece holds the same number of beats.", answer:true,
      explain:"That's the whole point — equal containers keep the music organized." },
    { type:"mc", q:"Why do musicians divide music into measures?", choices:["to organize music into equal sections","to make the notes higher","to play faster"], answer:0,
      explain:"Organization — like spaces between words in a sentence." },
    { type:"mc", q:"To create 3 measures ending with a double bar, how many SINGLE bar lines do you need in the middle?", choices:["2","3","4"], answer:0,
      explain:"Two single bar lines make three containers; the double bar closes the last one." },
    { type:"truefalse", q:"Bar lines change how the notes sound.", answer:false,
      explain:"They're organization only — the notes play exactly the same." },
    { type:"mc", q:"In the double bar, the THICK line comes…", choices:["last — on the outside","first — on the inside","there is no thick line"], answer:0,
      explain:"Thin then thick, with the thick line finishing the piece." },
    { type:"truefalse", q:"You stop counting beats when you cross a bar line.", answer:false,
      explain:"You RESTART the count: …3, 4 | 1, 2… The beat never stops." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Music is divided into equal parts by ______.", choices:["bar lines","clefs","ledger lines"], answer:0, explain:"Bar lines divide the staff into measures of equal beats." },
    { type:"mc", q:"A ______ is written at the end of a piece of music.", choices:["double bar","repeat sign","treble clef"], answer:0, explain:"The double bar marks the end." }
  ],
  miaQuizIntro:"Quiz time! Bar lines, measures (a.k.a. bars!), and the double bar. Count your containers and go!",
  quiz:[
    /* draft Q1–Q12, adapted */
    { type:"mc", q:"What is a Bar Line?", choices:["A note","A vertical line that divides music into measures","A rest","A clef"], answer:1,
      explain:"Bar lines slice the staff into equal containers called measures.", hint:"Think of the tidy staff from the welcome." },
    { type:"mc", q:"What is the space between two Bar Lines called?", choices:["Staff","Measure (Bar)","Clef","Beat"], answer:1,
      explain:"Measure — also called a bar. Same container, two names.", hint:"It holds a specific number of beats." },
    { type:"mc", q:"Where is a Double Bar usually found?", choices:["At the beginning","In the middle","At the end of a piece","Anywhere"], answer:2,
      explain:"Thin + thick lines mark the official END of the music.", hint:"What does it tell the performer?" },
    { type:"truefalse", q:"A Measure is the space between two Bar Lines.", answer:true,
      explain:"Exactly — that space is the musical container.", hint:"Containers, not lines." },
    { type:"truefalse", q:"A Double Bar means “Start Again.”", answer:false,
      explain:"It means the music ENDS here.", hint:"It's the last thing you see in a piece." },
    { type:"mc", q:"Which symbol is the DOUBLE BAR?",
      staff:{clef:"treble",notes:[{bar:"single",label:"1"},{p:"G4",d:"q",label:"2"},{bar:"final",label:"3"}],width:340},
      choices:["1","2","3"], answer:2,
      explain:"Number 3 — two lines, thin then thick. (1 is a single bar line, 2 is a note.)",
      hint:"Look for TWO lines together." },
    { type:"mc", q:"How many measures are shown?",
      staff:{clef:"treble",notes:[{p:"B4",d:"w"},{bar:"single"},{p:"B4",d:"h"},{p:"B4",d:"h"},{bar:"single"},{p:"B4",d:"w"},{bar:"single"},{p:"B4",d:"h"},{p:"B4",d:"h"},{bar:"single"},{p:"B4",d:"w"},{bar:"final"}],width:460},
      choices:["4","5","6"], answer:1,
      explain:"Five containers — count the spaces between the bar lines.",
      hint:"Count spaces, not lines." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Bar Line → divides music · Measure → space between bar lines · Double Bar → end of the music",
               "Bar Line → end of the music · Measure → divides music · Double Bar → space between bar lines",
               "Bar Line → space between bar lines · Measure → end of the music · Double Bar → divides music"], answer:0,
      explain:"Bar lines divide; measures are the spaces; the double bar ends the piece.",
      hint:"Which one does the dividing?" },
    { type:"mc", q:"The space between two Bar Lines is called a ____.", choices:["Measure (Bar)","Staff","Clef"], answer:0,
      explain:"Measure — or bar. Both are correct!", hint:"Two names, one container." },
    { type:"mc", q:"A ____ Bar marks the end of a piece.", choices:["Single","Double","Middle"], answer:1,
      explain:"The double bar: one thin line + one thick line.", hint:"Thin + thick." },
    { type:"mc", q:"Reading a piece from beginning to end, which do you meet LAST?", choices:["A single bar line","A measure","The double bar"], answer:2,
      explain:"Bar lines and measures repeat all through the piece — the double bar appears once, at the very end.",
      hint:"Which one means “the end”?" },
    { type:"mc", q:"Why do musicians use measures?", choices:["To change the pitch","To organize music into equal sections","To make notes louder","To make notes higher"], answer:1,
      explain:"Like spaces and punctuation in a sentence — organization makes music readable.",
      hint:"Music without bar lines is hard to read." },
    /* generated — fresh every attempt */
    { gen:"measure-count", params:{min:2,max:4}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-value", params:{ask:"name"}, count:1 },
    { gen:"note-name", params:{clef:"treble"}, count:1 },
    { gen:"note-name", params:{clef:"bass"}, count:1 }
  ],
  vocabulary:[
    {def:"The lines which cross the staff and divide it into measures or bars.", term:"Bar Line", staff:{clef:"none",notes:[{bar:"single"}],width:140}},
    {def:"The area between two bar lines; also called a bar.", term:"Measure", staff:{clef:"none",notes:[{bar:"single"},{p:"B4",d:"w"},{bar:"single"}],width:150}},
    {def:"Written at the end of a piece of music — a thin line followed by a thick line.", term:"Double Bar", staff:{clef:"none",notes:[{bar:"final"}],width:140}}
  ],
  mistakes:[], /* Oops section removed at instructor request (Session 15h) */
  summary:[
    "✔ <b>Bar Lines</b> are vertical lines that divide the staff into equal sections.",
    "✔ The space between two bar lines = a <b>Measure</b> (also called a <b>Bar</b>).",
    "✔ Each measure is a container holding a <b>specific number of beats</b>.",
    "✔ The <b>Double Bar</b> (thin + thick) says: “the music ends here.”",
    "✔ Counting restarts at every bar line: 1-2-3-4 | 1-2-3-4."
  ],
  tips:[
    "To count measures, add the beats: in 4/4, every time the count reaches 4, a bar line follows and the count restarts at 1.",
    "Say “bar” or say “measure” — musicians use both, so get comfortable with each.",
    "When counting measures, run your finger along the staff and count the containers, never the lines.",
    "\u{1F4E6} Next lesson: the TIME SIGNATURE — the sign that announces exactly how many beats each container holds!"
  ],
  rewards:{ badge:"Measure Explorer", icon:"\u{1F4E6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score! Bar lines, measures, bars, double bars — completely organized, just like your music. \u{1F4E6}\u{1F389}",
  miaPass:"You passed! Your music is officially tidy. Review below, or retry for a perfect run — fresh questions every time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Without dividers, eight notes are a blur. Bar lines add the 'spaces between words' so your eyes always know where they are.",
      play:()=>{[60,62,64,65].forEach((m,i)=>MFAudio.tone(m,.25,i*.22)); [67,64].forEach((m,i)=>MFAudio.tone(m,.5,1.1+i*.5));} },
    learn:{ label:"measures and bar lines",
      explain:"Bar line = the vertical divider. Measure (or bar) = the container between two dividers. Double bar (thin+thick) = the end of the piece. Counting restarts after every bar line.",
      hint:"Count the SPACES between lines, and add beats to 4 to know where a bar line belongs.",
      play:()=>{[64,67,71,69,67].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));} },
    example:{ label:"the examples",
      explain:"Listen for the restart: every measure begins a fresh 1-2-3-4 count. The double bar only appears at the very end." },
    game:{ label:"the games",
      explain:"Count measures at speed, hunt symbols, fill 4-beat containers, and tap whole measures back.",
      hint:"Containers, not lines — and every container holds exactly 4 beats today." },
    quiz:{ label:"this question",
      explain:"Three ideas cover everything: bar lines divide, measures (= bars) are the spaces between, and the double bar ends the piece.",
      play:()=>{MFAudio.tone(72,.3,0);MFAudio.tone(72,.3,.35);MFAudio.tone(65,.7,.75);} }
  }
};
