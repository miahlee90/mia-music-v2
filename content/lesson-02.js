/* Lesson 2 — Treble Clef and Staff (AEMT Book 1, Unit 1)
   v2 — rebuilt from the instructor's design document (drafts/UNIT 1 – Lesson 2.md)
   NOTE: edit by FULL-FILE REWRITE only. */

/* name-the-note drill used by several steps (unique L2 prefix: safe for check.html batch load) */
function MF_L2_nameDrill(container,fb,items,doneMsg){
  const order=[...items].sort(()=>Math.random()-.5); let i=0,correct=0;
  container.innerHTML=`<div class="flashcard"><div class="fc-title">\u{1F3B5} Note card</div><div class="big-q nd-q" style="text-align:center"></div><div class="nd-staff"></div></div><div class="choices chips nd-ch"></div>`;
  const q=container.querySelector(".nd-q"), st=container.querySelector(".nd-staff"), ch=container.querySelector(".nd-ch");
  ["A","B","C","D","E","F","G"].forEach(l=>{
    const b=document.createElement("button"); b.textContent=l;
    b.onclick=()=>{
      const cur=order[i], ok=l===cur.p[0];
      MFAudio.tone(MFAudio.midi(cur.p),.4);
      if(ok){ correct++; i++;
        if(i>=order.length){ q.textContent="Complete!"; st.innerHTML=""; ch.style.display="none"; fb(true,doneMsg); }
        else { fb(true,`✓ Yes — ${cur.p[0]}${cur.hintName?" ("+cur.hintName+")":""}! Next one…`); ask(); } }
      else fb(false,`Not ${l} — count from the bottom${cur.hintName?": "+cur.hintName:""}.`);
    };
    ch.appendChild(b);
  });
  function ask(){
    const cur=order[i];
    Staff.render(st,{clef:"treble",notes:[{p:cur.p,d:"q"}],width:300});
    q.textContent=`Name this note (${i+1} of ${order.length}):`;
  }
  ask();
}

LESSON_CONTENT[2]={
  welcome:"Welcome back! Today we unlock the staff with the treble clef. \u{1F511}\u{1F3B5}",
  hook:{
    say:"Great job learning the musical staff!<br><br>On its own, a staff position has no name. A <b>clef</b> fixes that: it assigns a letter name to one line — and every other line and space follows from it.<br><br>Today we'll learn the <b>Treble Clef</b>, used for higher-pitched instruments and voices. Ready to name every note on the staff?"
  },
  objectives:[
    "Identify the Treble Clef",
    "Explain why it is also called the G Clef",
    "Recite the musical alphabet (A–G)",
    "Name the notes on the lines of the treble staff",
    "Name the notes in the spaces of the treble staff",
    "Read simple notes on the treble staff with confidence"
  ],
  steps:[
    /* Section 1 — Meet the Treble Clef (pencil-drawn, instructor's stroke order:
       1 vertical line down, 2 top hook, 3 loop around the G line, 4 bottom tail curl) */
    { say:"A <b>clef</b> tells us the names of the notes on the staff. The <b>Treble Clef</b> is used for higher-pitched music — flute, violin, trumpet, and the pianist's <b>right hand</b> all read it. \u{1F447} Watch the pencil draw it in the right stroke order:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="tc-stage"></div><div style="text-align:center"><button class="play tc-go">\u{270F}\u{FE0F} Draw the Treble Clef</button></div>`;
          const stage=container.querySelector(".tc-stage");
          Staff.render(stage,{clef:"treble",notes:[],width:400});
          const svg=stage.querySelector("svg");
          const real=[...svg.querySelectorAll(".clef,.clef-path,.clefdot,.clef-stroke")];
          real.forEach(el=>{ el.style.opacity=0; el.style.transition="opacity .9s"; });
          const NS="http://www.w3.org/2000/svg";
          /* 6 strokes, wikiHow order; each starts exactly where the last ended */
          /* instructor chart: 1 line · 2 skinny P to the 4th line · 3 swoop left,
             touch the bottom of the staff · 4 swoop out, cross the middle line,
             stop over the G line · (5 tail curl) */
          const STROKES=[["M 40 8 L 40 100",800],
                         ["M 40 8 C 50 13 51 30 44 40 C 42 43 41 44 40 45",500],
                         ["M 40 45 C 28.4 45 19 55 19 67.5 C 19 80 28.4 90 40 90",800],
                         ["M 40 90 C 50 90 53 78 47 68 C 43 61 35 59 31 66 C 28 71 31 77 36 78",800],
                         ["M 40 100 C 41 107 31 110 27 104 C 24 99 30 96 33 99",500]];
          container.querySelector(".tc-go").onclick=function(){
            this.disabled=true; const btn=this;
            svg.querySelectorAll(".sketch,.pencil").forEach(el=>el.remove());
            real.forEach(el=>el.style.opacity=0);
            const pen=document.createElementNS(NS,"text");
            pen.setAttribute("class","pencil"); pen.setAttribute("font-size","22"); pen.textContent="\u{270F}\u{FE0F}";
            svg.appendChild(pen);
            let si=0;
            (function drawStroke(){
              if(si>=STROKES.length){
                pen.remove();
                setTimeout(()=>{
                  svg.querySelectorAll(".sketch").forEach(el=>{ el.style.transition="opacity .9s"; el.style.opacity=0; setTimeout(()=>el.remove(),1000); });
                  real.forEach(el=>el.style.opacity=1);
                  MFAudio.tone(67,.8,.1,.4);
                  fb(true,"✓ This is the Treble Clef! \u{2460} straight line \u{2461} skinny P down to line 4 \u{2462} swoop left to touch the bottom \u{2463} swoop out, cross the middle, stop over the G line \u{2464} tail curl. Try tracing it in the air!");
                  btn.disabled=false; btn.textContent="\u{270F}\u{FE0F} Draw it again";
                },400);
                return;
              }
              const d=STROKES[si][0], T=STROKES[si][1];
              const path=document.createElementNS(NS,"path");
              path.setAttribute("class","sketch"); path.setAttribute("d",d);
              path.setAttribute("fill","none"); path.setAttribute("stroke","#8a6d3b"); path.setAttribute("stroke-width","3"); path.setAttribute("stroke-linecap","round");
              svg.appendChild(path);
              const len=path.getTotalLength();
              path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
              const t0=performance.now();
              (function anim(t){
                const k=Math.min(1,(t-t0)/T);
                path.style.strokeDashoffset=len*(1-k);
                const pt=path.getPointAtLength(len*k);
                pen.setAttribute("x",pt.x+3); pen.setAttribute("y",pt.y-3);
                if(k<1) requestAnimationFrame(anim);
                else { si++; MFAudio.tone(60+si*4,.15,0,.25); setTimeout(drawStroke,240); }
              })(t0);
            })();
          };
        } } },
    /* Section 2 — Why the G Clef? */
    { say:"The Treble Clef is also called the <b>G Clef</b>: its spiral wraps around the <b>second line</b> of the staff — and that line is <b>G</b>. \u{1F449} <b>Click the line the spiral wraps around:</b>",
      try:{ type:"click-line", line:2,
        success:"✓ This line is G! One anchor note — and it gives meaning to every other note on the staff.",
        hint:"Follow the spiral to its center — then count lines from the BOTTOM." } },
    /* Section 3 — The Musical Alphabet */
    { say:"Music only uses <b>seven letters</b>: <b>A B C D E F G</b>. After G, the pattern repeats — just like the days of the week! \u{1F449} <b>Tap the letters in order, A first:</b>",
      try:{ type:"custom",
        hint:"A, B, C… it's the plain alphabet, only 7 letters long.",
        mount:(container,fb)=>{
          const L=["A","B","C","D","E","F","G"], MIDI={A:57,B:59,C:60,D:62,E:64,F:65,G:67};
          let next=0;
          container.innerHTML=`<div class="big-q ma-done" style="text-align:center;letter-spacing:6px">_ _ _ _ _ _ _</div><div class="choices chips ma-ch"></div>`;
          const done=container.querySelector(".ma-done"), ch=container.querySelector(".ma-ch");
          [...L].sort(()=>Math.random()-.5).forEach(l=>{
            const b=document.createElement("button"); b.textContent=l;
            b.onclick=()=>{
              if(l===L[next]){ next++; b.disabled=true; MFAudio.tone(MIDI[l],.3);
                done.textContent=(L.slice(0,next).join(" ")+" "+"_ ".repeat(7-next)).trim();
                if(next===7){ done.textContent="A B C D E F G  →  A B C …";
                  fb(true,"✓ A-B-C-D-E-F-G — then it starts over at A. Seven letters, repeating forever!"); }
                else fb(true,`✓ ${l}!`); }
              else fb(false,`Not yet — ${L[next]} comes next.`);
            };
            ch.appendChild(b);
          });
        } } },
    /* Section 4 — Line notes E-G-B-D-F */
    { say:"From bottom to top, the treble staff <b>lines</b> are <b>E–G–B–D–F</b>: “<b>E</b>very <b>G</b>ood <b>B</b>oy <b>D</b>oes <b>F</b>ine.” Mnemonics help you start — recognizing positions makes you fast. \u{1F449} <b>Name each line note:</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"E4",d:"w",label:"E"},{p:"G4",d:"w",label:"G"},{p:"B4",d:"w",label:"B"},{p:"D5",d:"w",label:"D"},{p:"F5",d:"w",label:"F"}],width:420} },
      try:{ type:"custom",
        hint:"Say the saying from the BOTTOM line: Every-Good-Boy-Does-Fine.",
        mount:(container,fb)=>MF_L2_nameDrill(container,fb,
          [{p:"E4",hintName:"line 1"},{p:"G4",hintName:"line 2"},{p:"B4",hintName:"line 3"},{p:"D5",hintName:"line 4"},{p:"F5",hintName:"line 5"}],
          "✓ All five lines named — Every Good Boy Does Fine!") } },
    /* Section 5 — Space notes F-A-C-E */
    { say:"The <b>spaces</b> are even friendlier — bottom to top they spell <b>F-A-C-E</b>. One of the easiest patterns in all of music! \u{1F449} <b>Name each space note:</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"F4",d:"w",label:"F"},{p:"A4",d:"w",label:"A"},{p:"C5",d:"w",label:"C"},{p:"E5",d:"w",label:"E"}],width:420} },
      try:{ type:"custom",
        hint:"Spell F-A-C-E from the bottom space up.",
        mount:(container,fb)=>MF_L2_nameDrill(container,fb,
          [{p:"F4",hintName:"space 1"},{p:"A4",hintName:"space 2"},{p:"C5",hintName:"space 3"},{p:"E5",hintName:"space 4"}],
          "✓ F-A-C-E — you own the spaces now!") } },
    /* Section 6 — Reading notes: the 4-step process */
    { say:"Now read like a musician. For ANY note: <b>1)</b> find the clef, <b>2)</b> line or space?, <b>3)</b> count from the bottom, <b>4)</b> name it. Accuracy before speed! \u{1F449} <b>Four mystery notes:</b>",
      try:{ type:"custom",
        hint:"Line note → Every Good Boy Does Fine. Space note → F-A-C-E.",
        mount:(container,fb)=>MF_L2_nameDrill(container,fb,
          [{p:"G4"},{p:"C5"},{p:"F5"},{p:"A4"}],
          "✓ Four mystery notes solved — you're reading the treble staff!") } }
  ],
  examples:[
    { caption:"Hear the whole staff: first the five LINES (E-G-B-D-F), then the four SPACES (F-A-C-E). Notice how lines and spaces interlock as the pitch climbs.",
      staff:{clef:"treble",notes:[{p:"E4",d:"q",label:"E"},{p:"G4",d:"q",label:"G"},{p:"B4",d:"q",label:"B"},{p:"D5",d:"q",label:"D"},{p:"F5",d:"q",label:"F"},{p:"F4",d:"q",label:"F"},{p:"A4",d:"q",label:"A"},{p:"C5",d:"q",label:"C"},{p:"E5",d:"q",label:"E"}],width:460} }
  ],
  keyboard:{
    intro:"On the piano, treble-staff notes are mostly <b>right-hand territory</b> — middle C and up. The marked keys are the five line notes. Watch me play E-G-B-D-F.",
    start:60, octaves:2, labels:true, demo:["E4","G4","B4","D5","F5"], demoGap:450,
    marks:[64,67,71,74,77]
  },
  games:[
    { type:"alphabet-order", title:"Game 1 · Musical Alphabet Race",
      intro:"Arrange <b>A–G</b> before 20 seconds run out!",
      miaIntro:"Game time! The alphabet is your foundation — how fast can you build it? \u{1F3AE}",
      spec:{timer:20},
      result:(stars)=>stars>=3?"Lightning fast! The alphabet is officially yours \u{2B50}\u{2B50}\u{2B50}":null },
    { type:"line-space", title:"Game 2 · Line or Space?",
      intro:"A random note appears — is it on a <b>line</b> or in a <b>space</b>? Deciding this FIRST is the secret of fast readers. 10 rounds.",
      spec:{rounds:10},
      result:(score)=>score>=9?"Nine or more — you see the staff like a pro!":null },
    { type:"note-race", title:"Game 3 · Name That Note",
      intro:"A random treble note appears — pick its letter. 10 rounds, no timer. Trust the sayings!",
      spec:{rounds:10},
      result:(score)=>score>=9?"Nine or more?! The treble staff has no secrets from you!":null },
    { type:"note-race", title:"Game 4 · Treble Clef Challenge",
      intro:"The final challenge: name as many notes as you can in <b>45 seconds</b>!",
      spec:{seconds:45},
      result:(score)=>score>=12?"A "+score+"-note run — treble champion! \u{1F3C6}":null }
  ],
  practiceIntro:"20 practice questions — note names, lines and spaces, the alphabet, all mixed. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-name", params:{clef:"treble"}, count:6 },
    { gen:"line-space", count:4 },
    { type:"truefalse", q:"The musical alphabet uses seven letters.", answer:true,
      explain:"A B C D E F G — then it repeats." },
    { type:"mc", q:"What letter comes after G?", choices:["H","A","F"], answer:1,
      explain:"After G the alphabet starts over at A — like the days of the week." },
    { type:"mc", q:"The Treble Clef is also called the…", choices:["F Clef","G Clef","C Clef"], answer:1,
      explain:"Its spiral wraps around line 2, naming it G." },
    { type:"truefalse", q:"The treble clef's spiral wraps around line 2.", answer:true,
      explain:"That's exactly how line 2 gets its name: G." },
    { type:"mc", q:"Bottom to top, the treble staff LINES are…", choices:["E-G-B-D-F","F-A-C-E","A-C-E-G"], answer:0,
      explain:"Every Good Boy Does Fine: E-G-B-D-F." },
    { type:"mc", q:"Bottom to top, the treble staff SPACES spell…", choices:["EGGS","FACE","CAFE"], answer:1,
      explain:"F-A-C-E — the easiest spelling in music." },
    { type:"mc", q:"Which group of instruments usually reads the Treble Clef?", choices:["Flute, violin, trumpet","Tuba, bassoon, double bass","Bass drum and timpani"], answer:0,
      explain:"Higher-pitched instruments — and the pianist's right hand — read treble." },
    { type:"truefalse", q:"Once you know the mnemonic, you never need to look at note positions.", answer:false,
      explain:"Mnemonics are training wheels — real fluency comes from recognizing positions." },
    { type:"mc", q:"What is the FIRST step when identifying any note?", choices:["Count from the top","Find the clef","Guess quickly"], answer:1,
      explain:"The clef determines every note name — always check it first." },
    { type:"mc", q:"Space 2 of the treble staff is the note…", choices:["A","C","G"], answer:0,
      explain:"F-A-C-E from the bottom: space 2 is A." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Which clef is also known as the G clef?", choices:["Treble clef","Bass clef","No clef"], answer:0, explain:"Its spiral circles the G line — hence “G clef.”" }
  ],
  miaQuizIntro:"The final quiz — 20 questions, easy ones first. Say the sayings from the bottom and you'll be fine!",
  quiz:[
    /* easy */
    { type:"mc", q:"The Treble Clef is also called the…", choices:["F Clef","G Clef","C Clef"], answer:1,
      explain:"Its spiral wraps around line 2, which is G.", hint:"Which line does the spiral wrap around?" },
    { type:"mc", q:"How many letters does the musical alphabet use?", choices:["7","8","26"], answer:0,
      explain:"Just seven: A B C D E F G.", hint:"A through…?" },
    { type:"mc", q:"What comes after G in the musical alphabet?", choices:["H","A","B"], answer:1,
      explain:"The pattern repeats — after G comes A again.", hint:"Like the days of the week starting over." },
    { type:"mc", q:"Bottom to top, the treble LINES are…", choices:["E-G-B-D-F","G-B-D-F-A","F-A-C-E"], answer:0,
      explain:"Every Good Boy Does Fine.", hint:"Every Good Boy…" },
    { type:"mc", q:"Bottom to top, the treble SPACES spell…", choices:["FACE","FADE","CAGE"], answer:0,
      explain:"F-A-C-E, bottom space to top space.", hint:"It's a real English word you can see in the mirror." },
    { type:"truefalse", q:"A clef gives the notes on the staff their names.", answer:true,
      explain:"Without a clef, staff positions have no names — the clef assigns them.",
      hint:"What did Mia say a clef does at the start?" },
    /* generated — reading */
    { gen:"note-name", params:{clef:"treble"}, count:5 },
    { gen:"line-space", count:2 },
    /* harder */
    { type:"mc", q:"Which note sits on LINE 4 of the treble staff?", choices:["B","D","F"], answer:1,
      explain:"E(1) G(2) B(3) D(4) F(5) — line 4 is D.", hint:"Every Good Boy DOES…" },
    { type:"mc", q:"Which note fills SPACE 3 of the treble staff?", choices:["A","C","E"], answer:1,
      explain:"F(1) A(2) C(3) E(4) — space 3 is C.", hint:"F-A-?-E" },
    { type:"truefalse", q:"The treble clef's spiral wraps around line 3.", answer:false,
      explain:"Line 2! That's why line 2 is G.", hint:"Look at any treble clef in this lesson." },
    { type:"mc", q:"B sits on which line of the treble staff?", choices:["Line 2","Line 3","Line 4"], answer:1,
      explain:"E(1) G(2) B(3) — B is the middle line.", hint:"Every Good BOY…" },
    { type:"mc", q:"What is the correct order for reading any note?", choices:["Guess → check → count","Find the clef → line or space? → count from the bottom → name it","Count from the top → name it → find the clef"], answer:1,
      explain:"Clef first, position second, count from the bottom, then name.", hint:"What must you find FIRST?" },
    { type:"mc", q:"Which note is HIGHER: E4 (line 1) or F5 (line 5)?", choices:["E4","F5","They're the same"], answer:1,
      explain:"Line 5 is the top of the staff — far above line 1.", hint:"Higher on the staff = higher pitch (Lesson 1!)." },
    { type:"truefalse", q:"Line notes and space notes use two completely different alphabets.", answer:false,
      explain:"Same seven letters — lines and spaces simply alternate through A–G.",
      hint:"How many letters does ALL of music use?" }
  ],
  vocabulary:[
    {def:"A sign that helps organize the staff so notes can be easily read.", term:"Clef"},
    {def:"The clef used for notes in the higher pitch ranges. The curl of the clef circles the line on which the note G is placed.", term:"Treble Clef (G Clef)", staff:{clef:"treble",notes:[],width:150}},
    {def:"The musical alphabet: the first seven letters, used over and over to name notes.", term:"A-B-C-D-E-F-G"},
    {def:"The treble line notes, bottom to top: Every Good Boy Does Fine.", term:"E-G-B-D-F"},
    {def:"The treble space notes, bottom to top — they spell FACE.", term:"F-A-C-E"}
  ],
  mistakes:[
    "<b>Counting from the top</b> — the sayings only work from the BOTTOM.",
    "<b>Forgetting the clef</b> — the clef determines every note name.",
    "<b>Mixing up line and space notes</b> — decide line-or-space FIRST, then count.",
    "<b>Memorizing mnemonics without positions</b> — practice recognizing the actual spots.",
    "<b>Guessing instead of counting</b> — accuracy first; speed comes with practice."
  ],
  summary:[
    "✔ The Treble Clef is also called the <b>G Clef</b>.",
    "✔ Its spiral circles the <b>G line</b> (line 2).",
    "✔ Musical alphabet: <b>A B C D E F G</b> — then repeat.",
    "✔ Line notes: <b>E G B D F</b>.",
    "✔ Space notes: <b>F A C E</b>.",
    "✔ Always count <b>from the bottom</b>."
  ],
  tips:[
    "Don't worry if you still need to count the lines. Every musician starts there!",
    "FACE is one of the easiest patterns in music. Use it to build confidence.",
    "Reading music gets faster with practice, not memorization alone."
  ],
  rewards:{ badge:"Treble Clef Explorer", icon:"\u{1F3BC}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secKb","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect 20?! Treble Clef Explorer barely covers it — Lesson 3 and the bass clef await! \u{1F3B5}",
  mia:{
    hook:{ label:"the welcome",
      explain:"A clef assigns a letter name to one line. The treble clef names line 2 “G,” and from that anchor every line and space gets its name.",
      play:()=>{[64,67,71,74,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));} },
    learn:{ label:"the treble staff",
      explain:"Lines bottom-up: E-G-B-D-F (Every Good Boy Does Fine). Spaces bottom-up spell F-A-C-E. Always decide line-or-space first, then count from the bottom.",
      hint:"Is your note ON a line or IN a space? Decide that first, then say the right saying.",
      play:()=>{[64,65,67,69,71,72,74,76,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    example:{ label:"the example",
      explain:"First the five lines (E-G-B-D-F), then the four spaces (F-A-C-E) — two ladders that interlock into one staff." },
    kb:{ label:"the keyboard",
      explain:"Treble notes live mostly above middle C — right-hand territory on the piano. The marked keys are the line notes E-G-B-D-F." },
    game:{ label:"the games",
      explain:"Each game drills one skill: alphabet order, line-vs-space, and naming notes — first carefully, then fast.",
      hint:"Line note → Every Good Boy Does Fine. Space note → F-A-C-E." },
    quiz:{ label:"this question",
      explain:"Anchor first: the spiral marks line 2 = G. Lines E-G-B-D-F, spaces F-A-C-E, always from the bottom.",
      play:()=>{MFAudio.tone(67,.5,0);MFAudio.tone(79,.5,.65);} }
  }
};
