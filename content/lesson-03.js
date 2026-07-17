/* Lesson 3 — Bass Clef and Staff (AEMT Book 1, Unit 1)
   v2 — rebuilt from the instructor's design document (drafts/UNIT 1 – Lesson 3.md)
   NOTE: edit by FULL-FILE REWRITE only. */

/* name-the-note drill (unique L3 prefix: safe for check.html batch load) */
function MF_L3_nameDrill(container,fb,items,doneMsg){
  const order=[...items].sort(()=>Math.random()-.5); let i=0;
  container.innerHTML=`<div class="flashcard"><div class="fc-title">\u{1F3B5} Note card</div><div class="big-q nd-q" style="text-align:center"></div><div class="nd-staff"></div></div><div class="choices chips nd-ch"></div>`;
  const q=container.querySelector(".nd-q"), st=container.querySelector(".nd-staff"), ch=container.querySelector(".nd-ch");
  ["A","B","C","D","E","F","G"].forEach(l=>{
    const b=document.createElement("button"); b.textContent=l;
    b.onclick=()=>{
      const cur=order[i], ok=l===cur.p[0];
      MFAudio.tone(MFAudio.midi(cur.p),.4);
      if(ok){ i++;
        if(i>=order.length){ q.textContent="Complete!"; st.innerHTML=""; ch.style.display="none"; fb(true,doneMsg); }
        else { fb(true,`✓ Yes — ${cur.p[0]}${cur.hintName?" ("+cur.hintName+")":""}! Next one…`); ask(); } }
      else fb(false,`Not ${l} — count from the bottom${cur.hintName?": "+cur.hintName:""}.`);
    };
    ch.appendChild(b);
  });
  function ask(){
    const cur=order[i];
    Staff.render(st,{clef:"bass",notes:[{p:cur.p,d:"q"}],width:300});
    q.textContent=`Name this bass note (${i+1} of ${order.length}):`;
  }
  ask();
}

LESSON_CONTENT[3]={
  welcome:"Welcome back! Today we explore the LOW side of music — the bass clef. \u{1F3B9}\u{1F3B5}",
  hook:{
    say:"You've already learned how to read higher notes with the Treble Clef. Now it's time to explore the <b>lower side of music</b>!<br><br>The <b>Bass Clef</b> is used for deep, rich sounds. If the Treble Clef is the “high voice” of music, the Bass Clef is its <b>strong foundation</b>. Let's discover how it works!"
  },
  objectives:[
    "Identify the Bass Clef",
    "Explain why it is also called the F Clef",
    "Recognize the F line on the bass staff",
    "Name the notes on the lines of the bass staff",
    "Name the notes in the spaces of the bass staff",
    "Read simple bass clef notes with confidence"
  ],
  steps:[
    /* Section 1 — Meet the Bass Clef (pencil-drawn, stroke order) */
    { say:"The <b>Bass Clef</b> is for lower-pitched notes — cello, bassoon, tuba, trombone, double bass, and the pianist's <b>left hand</b> all read it. \u{1F447} Watch the pencil draw it — the big curve first, then the two dots around line 4:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="bc-stage"></div><div style="text-align:center"><button class="play bc-go">\u{270F}\u{FE0F} Draw the Bass Clef</button></div>`;
          const stage=container.querySelector(".bc-stage");
          Staff.render(stage,{clef:"bass",notes:[],width:400});
          const svg=stage.querySelector("svg");
          const real=[...svg.querySelectorAll(".clef,.clef-path,.clefdot")];
          real.forEach(el=>{ el.style.opacity=0; el.style.transition="opacity .9s"; });
          const NS="http://www.w3.org/2000/svg";
          container.querySelector(".bc-go").onclick=function(){
            this.disabled=true; const btn=this;
            svg.querySelectorAll(".sketch,.pencil,.sketchdot").forEach(el=>el.remove());
            real.forEach(el=>el.style.opacity=0);
            const path=document.createElementNS(NS,"path");
            path.setAttribute("class","sketch");
            path.setAttribute("d","M 18 42 C 20 31 35 29 36 43 C 37 57 28 70 17 78");
            path.setAttribute("fill","none"); path.setAttribute("stroke","#8a6d3b"); path.setAttribute("stroke-width","3.4"); path.setAttribute("stroke-linecap","round");
            svg.appendChild(path);
            const pen=document.createElementNS(NS,"text");
            pen.setAttribute("class","pencil"); pen.setAttribute("font-size","22"); pen.textContent="\u{270F}\u{FE0F}";
            svg.appendChild(pen);
            const len=path.getTotalLength();
            path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
            const T=1800, t0=performance.now();
            (function anim(t){
              const k=Math.min(1,(t-t0)/T);
              path.style.strokeDashoffset=len*(1-k);
              const pt=path.getPointAtLength(len*k);
              pen.setAttribute("x",pt.x+3); pen.setAttribute("y",pt.y-3);
              if(k<1) requestAnimationFrame(anim);
              else{
                [39.5,50.5].forEach((cy,i)=>setTimeout(()=>{
                  const d=document.createElementNS(NS,"circle");
                  d.setAttribute("class","sketchdot"); d.setAttribute("cx",42); d.setAttribute("cy",cy); d.setAttribute("r",2.8); d.setAttribute("fill","#8a6d3b");
                  svg.appendChild(d);
                  pen.setAttribute("x",46); pen.setAttribute("y",cy-3);
                  MFAudio.tone(53,.2,0,.3);
                },350+i*450));
                setTimeout(()=>{
                  pen.remove();
                  [path,...svg.querySelectorAll(".sketchdot")].forEach(el=>{ el.style.transition="opacity .9s"; el.style.opacity=0; setTimeout(()=>el.remove(),1000); });
                  real.forEach(el=>el.style.opacity=1);
                  MFAudio.tone(41,.8,.1,.5); MFAudio.tone(53,.8,.45,.4);
                  fb(true,"✓ This is the Bass Clef! The curve starts on line 4 — and the two dots hug that very line. That's why it's the F clef.");
                  btn.disabled=false; btn.textContent="\u{270F}\u{FE0F} Draw it again";
                },350+2*450+400);
              }
            })(t0);
          };
        } } },
    /* Section 2 — Why the F Clef? */
    { say:"The Bass Clef is also called the <b>F Clef</b>: its <b>two dots</b> surround the <b>fourth line</b> — and that line is <b>F</b>. Once the clef is placed, every other note can be identified. \u{1F449} <b>Click the line between the two dots:</b>",
      try:{ type:"click-line", clef:"bass", line:4,
        success:"✓ This line is F! The two dots hug it like a target — that's your bass anchor.",
        hint:"The two dots sit just above and below one line. Count lines from the BOTTOM." } },
    /* Section 3 — Bass line notes G-B-D-F-A */
    { say:"From bottom to top, the bass staff <b>lines</b> are <b>G–B–D–F–A</b>: “<b>G</b>ood <b>B</b>oys <b>D</b>o <b>F</b>ine <b>A</b>lways.” Careful — these are DIFFERENT names from the treble lines! \u{1F449} <b>Name each line note:</b>",
      show:{ type:"staff", spec:{clef:"bass",notes:[{p:"G2",d:"w",label:"G"},{p:"B2",d:"w",label:"B"},{p:"D3",d:"w",label:"D"},{p:"F3",d:"w",label:"F"},{p:"A3",d:"w",label:"A"}],width:420} },
      try:{ type:"custom",
        hint:"Say it from the BOTTOM line: Good-Boys-Do-Fine-Always.",
        mount:(container,fb)=>MF_L3_nameDrill(container,fb,
          [{p:"G2",hintName:"line 1"},{p:"B2",hintName:"line 2"},{p:"D3",hintName:"line 3"},{p:"F3",hintName:"line 4"},{p:"A3",hintName:"line 5"}],
          "✓ All five bass lines — Good Boys Do Fine Always!") } },
    /* Section 4 — Bass space notes A-C-E-G */
    { say:"The bass <b>spaces</b>, bottom to top, are <b>A–C–E–G</b>: “<b>A</b>ll <b>C</b>ows <b>E</b>at <b>G</b>rass.” \u{1F42E}\u{1F33F} \u{1F449} <b>Name each space note:</b>",
      show:{ type:"staff", spec:{clef:"bass",notes:[{p:"A2",d:"w",label:"A"},{p:"C3",d:"w",label:"C"},{p:"E3",d:"w",label:"E"},{p:"G3",d:"w",label:"G"}],width:420} },
      try:{ type:"custom",
        hint:"All-Cows-Eat-Grass, from the bottom space up.",
        mount:(container,fb)=>MF_L3_nameDrill(container,fb,
          [{p:"A2",hintName:"space 1"},{p:"C3",hintName:"space 2"},{p:"E3",hintName:"space 3"},{p:"G3",hintName:"space 4"}],
          "✓ A-C-E-G — the cows are well fed and the spaces are yours!") } },
    /* Section 5 — Reading bass notes */
    { say:"Same four steps as always: <b>1)</b> identify the clef, <b>2)</b> line or space?, <b>3)</b> count from the bottom, <b>4)</b> name it. Every note has its own unique position. \u{1F449} <b>Four mystery notes:</b>",
      try:{ type:"custom",
        hint:"Line note → Good Boys Do Fine Always. Space note → All Cows Eat Grass.",
        mount:(container,fb)=>MF_L3_nameDrill(container,fb,
          [{p:"F3"},{p:"C3"},{p:"A3"},{p:"E3"}],
          "✓ Four bass mysteries solved — you read BOTH clefs now!") } },
    /* Section 6 — Comparing treble and bass */
    { say:"Both clefs use the same 7-letter alphabet — but the SAME staff position gets a DIFFERENT name in each clef. Below, both notes sit on <b>line 2</b>. \u{1F449} <b>Are they the same note?</b>",
      try:{ type:"custom",
        hint:"Treble line 2 wraps in the G spiral. Bass line 2 — count G(1), then…?",
        mount:(container,fb)=>{
          container.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
            <div class="cmp-t" style="flex:1;min-width:220px"></div><div class="cmp-b" style="flex:1;min-width:220px"></div></div>
            <div class="choices chips cmp-ch"></div>`;
          Staff.render(container.querySelector(".cmp-t"),{clef:"treble",notes:[{p:"G4",d:"q",label:"line 2"}],width:240});
          Staff.render(container.querySelector(".cmp-b"),{clef:"bass",notes:[{p:"B2",d:"q",label:"line 2"}],width:240});
          const ch=container.querySelector(".cmp-ch");
          [["Yes — same note",false],["No — different notes",true]].forEach(([t,right])=>{
            const b=document.createElement("button"); b.textContent=t;
            b.onclick=()=>{
              MFAudio.tone(67,.5,0); MFAudio.tone(47,.5,.65);
              if(right){ [...ch.children].forEach(x=>x.disabled=true); b.classList.add("right");
                fb(true,"✓ Different! Treble line 2 is G, but bass line 2 is B. The clef decides the name — that's why musicians need different clefs for different pitch ranges."); }
              else { b.classList.add("wrongpick"); b.disabled=true;
                fb(false,"Listen: the two notes don't even sound alike! Same position, different clef → different note."); }
            };
            ch.appendChild(b);
          });
        } } }
  ],
  examples:[
    { caption:"The five bass LINES (G-B-D-F-A), then the four SPACES (A-C-E-G). Feel how much deeper this world is than the treble staff.",
      staff:{clef:"bass",notes:[{p:"G2",d:"q",label:"G"},{p:"B2",d:"q",label:"B"},{p:"D3",d:"q",label:"D"},{p:"F3",d:"q",label:"F"},{p:"A3",d:"q",label:"A"},{p:"A2",d:"q",label:"A"},{p:"C3",d:"q",label:"C"},{p:"E3",d:"q",label:"E"},{p:"G3",d:"q",label:"G"}],width:460} }
  ],
  keyboard:{
    intro:"On the piano, bass-staff notes are <b>left-hand territory</b> — below middle C. The marked keys are the five bass line notes. Watch me play G-B-D-F-A.",
    start:36, octaves:2, labels:true, demo:["G2","B2","D3","F3","A3"], demoGap:450,
    marks:[43,47,50,53,57]
  },
  games:[
    { type:"note-race", title:"Game 1 · Name That Note — Bass Edition",
      intro:"A random bass note appears — pick its letter. 10 rounds, no timer.",
      miaIntro:"Game time! Fresh clef, fresh notes — show the bass staff who's boss. \u{1F3AE}",
      spec:{rounds:10, pool:[{p:"G2",clef:"bass"},{p:"B2",clef:"bass"},{p:"D3",clef:"bass"},{p:"F3",clef:"bass"},{p:"A3",clef:"bass"},{p:"A2",clef:"bass"},{p:"C3",clef:"bass"},{p:"E3",clef:"bass"},{p:"G3",clef:"bass"}]},
      result:(score)=>score>=9?"Nine or more on a brand-new clef?! Outstanding!":null },
    { type:"line-space", title:"Game 2 · Line or Space? — Bass Staff",
      intro:"Is the note on a <b>line</b> or in a <b>space</b>? Same skill, deeper notes. 10 rounds.",
      spec:{rounds:10, clef:"bass"},
      result:(score)=>score>=9?"The bass staff holds no secrets from you!":null },
    { type:"memory-match", title:"Game 3 · Memory Match",
      intro:"Flip the cards: match each bass staff note with its letter name. Fewest moves wins ⭐⭐⭐!",
      spec:{pairs:4, pool:[{p:"G2",clef:"bass"},{p:"B2",clef:"bass"},{p:"D3",clef:"bass"},{p:"F3",clef:"bass"},{p:"A2",clef:"bass"},{p:"C3",clef:"bass"},{p:"E3",clef:"bass"}]},
      result:(stars)=>stars>=3?"A perfect memory AND perfect note reading — impressive combo!":null },
    { type:"clef-note", title:"Game 4 · Treble vs Bass Challenge",
      intro:"The final challenge: a note appears in EITHER clef. First name the <b>clef</b>, then the <b>note</b>. 6 rounds — get both right for a perfect round!",
      spec:{rounds:6},
      result:(score)=>score>=5?"Both clefs, one brain — you're officially bilingual in music! \u{1F3C6}":null }
  ],
  practiceIntro:"20 practice questions — bass note names, lines and spaces, clef facts, all mixed. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-name", params:{clef:"bass"}, count:6 },
    { gen:"line-space", params:{clef:"bass"}, count:4 },
    { type:"mc", q:"The Bass Clef is also called the…", choices:["G Clef","F Clef","C Clef"], answer:1,
      explain:"Its two dots surround line 4, naming it F." },
    { type:"truefalse", q:"The bass clef's two dots surround line 4.", answer:true,
      explain:"That's how line 4 gets its name: F." },
    { type:"mc", q:"Bottom to top, the bass staff LINES are…", choices:["E-G-B-D-F","G-B-D-F-A","A-C-E-G"], answer:1,
      explain:"Good Boys Do Fine Always: G-B-D-F-A." },
    { type:"mc", q:"Bottom to top, the bass staff SPACES are…", choices:["A-C-E-G","F-A-C-E","G-B-D-F"], answer:0,
      explain:"All Cows Eat Grass: A-C-E-G." },
    { type:"mc", q:"Which group of instruments usually reads the Bass Clef?", choices:["Flute, violin, trumpet","Cello, tuba, trombone","Piccolo and soprano voice"], answer:1,
      explain:"Low instruments — plus bassoon, double bass, and the pianist's left hand." },
    { type:"truefalse", q:"The Bass Clef is used for higher-pitched notes.", answer:false,
      explain:"The bass clef is the LOW side of music — the treble clef takes the high side." },
    { type:"mc", q:"On the piano, the bass staff is mostly played by the…", choices:["right hand","left hand","either foot"], answer:1,
      explain:"Left hand plays below middle C — bass clef territory." },
    { type:"mc", q:"“All Cows Eat Grass” names the bass staff…", choices:["lines","spaces","ledger lines"], answer:1,
      explain:"Spaces bottom-up: A-C-E-G. The lines use Good Boys Do Fine Always." },
    { type:"truefalse", q:"A note on line 2 has the same name in treble and bass clef.", answer:false,
      explain:"Treble line 2 is G; bass line 2 is B. The clef decides the name!" },
    { type:"mc", q:"Line 3 of the bass staff is the note…", choices:["B","D","F"], answer:1,
      explain:"G(1) B(2) D(3) — line 3 is D, the middle line." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Which clef is also known as the F clef?", choices:["Bass clef","Treble clef","No clef"], answer:0, explain:"Its two dots surround the F line — hence “F clef.”" }
  ],
  miaQuizIntro:"The final quiz — 20 questions, easy ones first. Good Boys Do Fine Always… and so will you!",
  quiz:[
    /* easy */
    { type:"mc", q:"The Bass Clef is also called the…", choices:["G Clef","F Clef","C Clef"], answer:1,
      explain:"Its two dots surround line 4, marking it as F.", hint:"Which line do the two dots surround, and what's its name?" },
    { type:"truefalse", q:"The two dots of the bass clef surround the fourth line.", answer:true,
      explain:"Yes — and that line is F, the bass anchor.", hint:"Look at any bass clef above." },
    { type:"mc", q:"Bottom to top, the bass staff LINES are…", choices:["G-B-D-F-A","E-G-B-D-F","F-A-C-E"], answer:0,
      explain:"Good Boys Do Fine Always: G-B-D-F-A.", hint:"Good Boys…" },
    { type:"mc", q:"Bottom to top, the bass staff SPACES are…", choices:["F-A-C-E","A-C-E-G","B-D-F-A"], answer:1,
      explain:"All Cows Eat Grass: A-C-E-G.", hint:"All Cows…" },
    { type:"truefalse", q:"The Bass Clef is used for lower-pitched notes.", answer:true,
      explain:"Deep, rich sounds — the strong foundation of music.", hint:"Foundation or rooftop?" },
    { type:"mc", q:"On the piano, which hand mostly reads the bass clef?", choices:["Right hand","Left hand","Both equally"], answer:1,
      explain:"The left hand plays the lower keys — bass clef territory.", hint:"Which side of the piano is lower?" },
    /* generated — reading */
    { gen:"note-name", params:{clef:"bass"}, count:5 },
    { gen:"line-space", params:{clef:"bass"}, count:2 },
    /* harder */
    { type:"mc", q:"Which note sits on LINE 4 of the bass staff?", choices:["D","F","A"], answer:1,
      explain:"G(1) B(2) D(3) F(4) — and the clef's dots point right at it.", hint:"The two dots surround this very line." },
    { type:"mc", q:"Which note fills SPACE 2 of the bass staff?", choices:["A","C","E"], answer:1,
      explain:"A(1) C(2) E(3) G(4) — space 2 is C.", hint:"All COWS…" },
    { type:"truefalse", q:"Treble and bass staffs give the same names to the same positions.", answer:false,
      explain:"Same alphabet, different assignments — treble line 2 is G, bass line 2 is B.",
      hint:"What did the side-by-side comparison show?" },
    { type:"mc", q:"B sits on which line of the bass staff?", choices:["Line 2","Line 3","Line 4"], answer:0,
      explain:"G(1) B(2) — B is line 2 in bass (but line 3 in treble!).", hint:"Good BOYS…" },
    { type:"mc", q:"Why do musicians need different clefs?", choices:["To make music look fancier","To cover different pitch ranges without too many extra lines","Because each instrument has its own alphabet"], answer:1,
      explain:"Clefs assign the staff to different ranges — high (treble) or low (bass) — keeping notes easy to read.",
      hint:"Think about what would happen if a tuba had to use the treble staff." },
    { type:"mc", q:"Which note is LOWER: G2 (bass line 1) or G3 (bass space 4)?", choices:["G2","G3","Same pitch"], answer:0,
      explain:"Both are G, but G2 sits at the bottom of the staff — a whole octave lower.",
      hint:"Lower on the staff = lower pitch." },
    { type:"truefalse", q:"Once you know “All Cows Eat Grass,” you never need to check note positions.", answer:false,
      explain:"Mnemonics start you off — fluency comes from recognizing positions directly.",
      hint:"What did Mia say about mnemonics in Lesson 2?" }
  ],
  vocabulary:[
    {def:"The clef used for notes in the lower pitch ranges. The two dots of the clef surround the line on which the note F is placed.", term:"Bass Clef (F Clef)", staff:{clef:"bass",notes:[],width:150}},
    {def:"The bass line notes, bottom to top: Good Boys Do Fine Always.", term:"G-B-D-F-A"},
    {def:"The bass space notes, bottom to top: All Cows Eat Grass.", term:"A-C-E-G"}
  ],
  mistakes:[
    "<b>Confusing the two clefs</b> — swirl = treble (G), two dots = bass (F).",
    "<b>Using treble names on the bass staff</b> — bass has its OWN line and space names.",
    "<b>Counting from the top</b> — always from the BOTTOM, in every clef.",
    "<b>Mixing up line and space notes</b> — decide line-or-space first.",
    "<b>Leaning only on mnemonics</b> — practice reading positions directly."
  ],
  summary:[
    "✔ The Bass Clef is also called the <b>F Clef</b>.",
    "✔ The two dots surround the <b>F line</b> (line 4).",
    "✔ Bass line notes: <b>G B D F A</b>.",
    "✔ Bass space notes: <b>A C E G</b>.",
    "✔ Count <b>from the bottom</b>.",
    "✔ Practice <b>recognizing positions</b>, not just the mnemonic."
  ],
  tips:[
    "The Bass Clef may feel new today, but with practice you'll recognize these notes just as quickly as the Treble Clef.",
    "Don't rush. Counting carefully is the fastest way to become an excellent music reader.",
    "Every great pianist reads both clefs. You're building an important skill!"
  ],
  rewards:{ badge:"Bass Clef Explorer", icon:"\u{1F3B6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secKb","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect 20 on a brand-new clef?! Bass Clef Explorer — see you at the Grand Staff in Lesson 4! \u{1F3B5}",
  mia:{
    hook:{ label:"the welcome",
      explain:"The bass clef is the low half of music — cello, tuba, left hand. Its two dots mark line 4 as F, and that anchor names everything else.",
      play:()=>{[43,47,50,53,57].forEach((m,i)=>MFAudio.tone(m,.35,i*.35));} },
    learn:{ label:"the bass staff",
      explain:"Lines bottom-up: G-B-D-F-A (Good Boys Do Fine Always). Spaces bottom-up: A-C-E-G (All Cows Eat Grass). Same method as treble — different names!",
      hint:"Decide line-or-space first, then say the BASS saying — not the treble one.",
      play:()=>{[43,45,47,48,50,52,53,55,57].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    example:{ label:"the example",
      explain:"Five lines, then four spaces — the same interlocking ladder as treble, one octave-and-a-bit lower." },
    kb:{ label:"the keyboard",
      explain:"Bass notes live below middle C — left-hand territory. The marked keys are the bass line notes G-B-D-F-A." },
    game:{ label:"the games",
      explain:"Naming bass notes, line-vs-space, memory pairs, and finally juggling BOTH clefs at once.",
      hint:"Two dots = bass = Good Boys Do Fine Always / All Cows Eat Grass." },
    quiz:{ label:"this question",
      explain:"Anchor first: the dots mark line 4 = F. Lines G-B-D-F-A, spaces A-C-E-G, always from the bottom.",
      play:()=>{MFAudio.tone(53,.5,0);MFAudio.tone(41,.5,.65);} }
  }
};
