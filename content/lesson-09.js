/* Lesson 9 — Whole, Half and Quarter Rests (AEMT Book 1, Unit 2)
   Built from the instructor's design document (drafts/UNIT 2 – Lesson 9.md, incl. NotebookLM block)
   QA note honored: the "Hat vs. Hole" mnemonic repeats across steps, games, practice AND quiz.
   Uses staff.js v4 rest glyphs; games.js v4.1 (value-race kind:rest, rhythm-tap with rests,
   measure-build with rests, symbol-hunt).
   NOTE: edit by FULL-FILE REWRITE only. */

/* hat-or-hole drill (unique L9 prefix: safe for check.html batch load) */
function MF_L9_hatHole(container,fb,rounds){
  const seq=[]; for(let i=0;i<rounds;i++) seq.push(i%2===0?"w":"h");
  seq.sort(()=>Math.random()-.5);
  let i=0,score=0;
  container.innerHTML=`<div class="big-q hh-q" style="text-align:center"></div><div class="hh-staff"></div>
    <div class="choices hh-ch"><button>\u{1F573}\u{FE0F} Hole — Whole Rest</button><button>\u{1F3A9} Hat — Half Rest</button></div>`;
  const q=container.querySelector(".hh-q"), st=container.querySelector(".hh-staff"), ch=container.querySelector(".hh-ch");
  function ask(){
    Staff.render(st,{clef:"treble",notes:[{rest:seq[i]}],width:240});
    q.textContent=`Rest ${i+1} of ${seq.length}: hat or hole?`;
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=seq[i], saidWhole=bi===0, ok=saidWhole===(cur==="w");
    if(ok){ MFAudio.click(0,.35); score++; i++;
      if(i>=seq.length){ ch.style.display="none"; q.textContent="All sorted!";
        fb(true,"✓ Every hat and hole in its place! Hole hangs DOWN from the 4th line (whole rest, 4 beats); hat sits ON the 3rd line (half rest, 2 beats)."); }
      else { fb(true,`✓ ${cur==="w"?"Hole — it hangs DOWN, so it's the WHOLE rest (4 beats).":"Hat — it sits ON TOP, so it's the HALF rest (2 beats)."} Next…`); ask(); } }
    else { MFAudio.tone(40,.25);
      fb(false,`Look closely: is it hanging BELOW the line (hole = whole) or sitting ON the line (hat = half)? This one is the ${cur==="w"?"hole":"hat"}.`); }
  });
  ask();
}

LESSON_CONTENT[9]={
  welcome:"Lesson 9 — today we play… NOTHING. And it will be beautiful. \u{1F92B}",
  hook:{
    say:"Music isn't only about sound — sometimes the most beautiful moment is <b>silence</b>. Press play: the same little tune, twice. \u{1F447} <b>What's different the second time?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Two versions</button></div>
          <div class="choices hk-ch" style="display:none">
          <button>The notes got higher</button><button>A moment of SILENCE appeared</button><button>Nothing changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const s=.5;
          [60,64,67,64,60].forEach((m,i)=>MFAudio.tone(m,s*.9,i*s));
          [60,64].forEach((m,i)=>MFAudio.tone(m,s*.9,3.4+i*s));
          MFAudio.tone(64,s*.9,3.4+3*s); MFAudio.tone(60,s*.9,3.4+4*s);
          setTimeout(()=>{ ch.style.display=""; },6.5*1000);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ A gap of silence — and it made the tune more dramatic! Musicians write silence with symbols called RESTS. Every note has a silent twin.");
          else fb(false,"Listen again — the second version has a hole in the middle where nothing plays. What would you call that?");
        });
      } }
  },
  objectives:[
    "Identify a Rest",
    "Recognize Whole, Half, and Quarter Rests",
    "Match each Rest with its note value",
    "Count silent beats correctly",
    "Distinguish between Whole and Half Rests",
    "Explain why rests are important in music"
  ],
  steps:[
    /* Step 1 — silent twins (Activity 2: match) */
    { say:"Every note has a <b>silent partner</b> called a <b>rest</b> — it lasts for the same amount of time but makes no sound.<br>• Whole note ↔ Whole rest (<b>4 beats</b>)<br>• Half note ↔ Half rest (<b>2 beats</b>)<br>• Quarter note ↔ Quarter rest (<b>1 beat</b>)<br>\u{1F447} <b>Match each note with its matching rest!</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"w",label:"whole note"},{rest:"w"},{p:"B4",d:"h",label:"half note"},{rest:"h"},{p:"B4",d:"q",label:"quarter note"},{rest:"q"}],width:480} },
      try:{ type:"custom",
        hint:"The twin lasts the same number of beats — whole 4, half 2, quarter 1.",
        mount:(container,fb)=>{
          const rounds=[{d:"w",name:"Whole Note"},{d:"h",name:"Half Note"},{d:"q",name:"Quarter Note"}].sort(()=>Math.random()-.5);
          const RN={w:"Whole Rest",h:"Half Rest",q:"Quarter Rest"};
          let i=0;
          container.innerHTML=`<div class="big-q tw-q" style="text-align:center"></div><div class="tw-staff"></div>
            <div class="choices tw-ch"><button data-v="w">Whole Rest</button><button data-v="h">Half Rest</button><button data-v="q">Quarter Rest</button></div>`;
          const q=container.querySelector(".tw-q"), st=container.querySelector(".tw-staff");
          function ask(){
            Staff.render(st,{clef:"treble",notes:[{p:"B4",d:rounds[i].d}],width:240});
            q.textContent=`Twin ${i+1} of 3: which rest matches this ${rounds[i].name}?`;
          }
          [...container.querySelectorAll(".tw-ch button")].forEach(b=>b.onclick=()=>{
            const cur=rounds[i], ok=b.dataset.v===cur.d;
            if(ok){ MFAudio.click(0,.35); i++;
              if(i>=rounds.length){ container.querySelector(".tw-ch").style.display="none"; q.textContent="All twins reunited!";
                fb(true,"✓ Three perfect matches — every note value has a rest worth exactly the same beats of silence."); }
              else { fb(true,`✓ ${cur.name} ↔ ${RN[cur.d]} — same beats, no sound. Next twin…`); ask(); } }
            else fb(false,"The twin lasts the SAME number of beats as the note — count first, then choose.");
          });
          ask();
        } } },
    /* Step 2 — hat vs hole (Activity 3, QA mnemonic) */
    { say:"The two rectangle rests love to confuse students — here's the trick that never fails. \u{1F573}\u{FE0F} <b>Whole Rest = HOLE</b>: it hangs DOWN from the 4th line, like a hole in the ground. \u{1F3A9} <b>Half Rest = HAT</b>: it sits ON TOP of the 3rd line, like a hat on a head. \u{1F447} <b>Sort them:</b>",
      try:{ type:"custom",
        hint:"Hanging below the line = hole = whole. Sitting on the line = hat = half.",
        mount:(container,fb)=>MF_L9_hatHole(container,fb,6) } },
    /* Step 3 — the quarter rest */
    { say:"The third rest is easy to spot: the <b>Quarter Rest</b> is the <b>squiggly symbol</b> — one beat of silence, no hat, no hole, just a squiggle. \u{1F447} <b>Which one is the quarter rest?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{rest:"w",label:"1"},{rest:"h",label:"2"},{rest:"q",label:"3"}],width:340} },
      try:{ type:"mc",
        choices:["1","2","3"], answer:2,
        success:"✓ The squiggle! 1 beat of silence. (1 is the hole — whole rest; 2 is the hat — half rest.)",
        fail:"The quarter rest is the squiggly one — not a rectangle at all.",
        hint:"No hat, no hole — just a squiggle." } },
    /* Step 4 — Fill in the correct number (book-style: AEMT1 p.13, Exercise 2) */
    { say:"<b>Fill in the correct number!</b> How many of the FIRST rest equal the SECOND? \u{1F447}",
      try:{ type:"custom",
        hint:"Think in beats: whole rest = 4, half rest = 2, quarter rest = 1.",
        mount:(container,fb)=>{
          const rounds=[
            {count:2,left:"h",right:["w"],leftName:"half rests",rightName:"1 whole rest",math:"2 + 2 = 4"},
            {count:2,left:"q",right:["h"],leftName:"quarter rests",rightName:"1 half rest",math:"1 + 1 = 2"},
            {count:4,left:"q",right:["w"],leftName:"quarter rests",rightName:"1 whole rest",math:"1+1+1+1 = 4"},
            {count:2,left:"h",right:["q","q","q","q"],leftName:"half rests",rightName:"4 quarter rests",math:"2 + 2 = 1+1+1+1"}];
          let i=0;
          container.innerHTML=`<div class="big-q fx-q" style="text-align:center"></div>
            <div style="display:flex;align-items:center;gap:10px;justify-content:center;flex-wrap:wrap">
              <div class="fx-n" style="font-size:2.2rem;font-weight:800;color:var(--primary)">?</div>
              <div style="font-size:1.4rem;font-weight:800">×</div>
              <div class="fx-left" style="min-width:120px"></div>
              <div style="font-size:1.8rem;font-weight:800">=</div>
              <div class="fx-right" style="min-width:150px"></div></div>
            <div class="choices chips fx-ch"></div>`;
          const q=container.querySelector(".fx-q"), ch=container.querySelector(".fx-ch");
          [1,2,3,4].forEach(nv=>{
            const b2=document.createElement("button"); b2.textContent=nv;
            b2.onclick=()=>{
              const cur=rounds[i];
              if(nv===cur.count){ MFAudio.click(0,.4,true); i++;
                if(i>=rounds.length){ ch.style.display="none"; q.textContent="Exercise complete!";
                  fb(true,"✓ All four equations solved! Rests trade exactly like their twin notes: 2 halves = a whole, 2 quarters = a half."); }
                else { fb(true,`✓ ${cur.count} ${cur.leftName} = ${cur.rightName} (${cur.math}). Next equation…`); ask(); } }
              else { MFAudio.tone(40,.25); fb(false,`Add the beats: each ${cur.leftName.replace(/s$/,"")} is worth ${cur.left==="h"?2:1} — how many reach ${cur.right[0]==="w"?4:cur.rightName}?`); }
            };
            ch.appendChild(b2);
          });
          function ask(){
            const cur=rounds[i];
            q.textContent=`Equation ${String.fromCharCode(97+i)}. of ${rounds.length}: how many ${cur.leftName} equal ${cur.rightName}?`;
            Staff.render(container.querySelector(".fx-left"),{clef:"none",notes:[{rest:cur.left}],width:120});
            Staff.render(container.querySelector(".fx-right"),{clef:"none",notes:cur.right.map(r=>({rest:r})),width:cur.right.length>1?200:120});
          }
          ask();
        } } },
    /* Step 5 (was 6) — read through the silence; the sound-and-silence builder step was REMOVED at instructor request (Session 15o) — the Sound & Silence Builder GAME still covers it */
    { say:"Let's READ a rhythm with rests. Follow the highlight and count out loud — on the silent beats, say <b>“rest”</b>: 1, rest(2), 3, rest(4) | 1-2-3-4. \u{1F447}",
      try:{ type:"custom",
        hint:"Keep counting through every rest — say “rest” out loud on the silent beats.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:80,
            notes:[{p:"C4",d:"q",label:"1"},{rest:"q",label:"(2)"},{p:"E4",d:"q",label:"3"},{rest:"q",label:"(4)"},{bar:"single"},
                   {p:"G4",d:"w",label:"1-2-3-4"},{bar:"final"}],width:440};
          container.innerHTML=`<div class="rs-staff"></div><div style="text-align:center"><button class="play rs-play">▶ Play & count along</button></div>`;
          const api=Staff.render(container.querySelector(".rs-staff"),spec);
          container.querySelector(".rs-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ You just read sound AND silence — the highlight kept moving through the rests because the beat never stops!"),total*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"Sound, silence, sound, silence — count every beat out loud: 1, rest(2), 3, rest(4). The rests are as musical as the notes.",
      staff:{clef:"treble",tempo:85,time:"4/4",notes:[{p:"E4",d:"q",label:"1"},{rest:"q",label:"(2)"},{p:"G4",d:"q",label:"3"},{rest:"q",label:"(4)"},{bar:"final"}],width:400} },
    { caption:"A half note rings for 2, then the HAT takes over for 2 silent beats: 1-2, rest(3-4).",
      staff:{clef:"treble",tempo:85,time:"4/4",notes:[{p:"F4",d:"h",label:"1-2"},{rest:"h",label:"(3-4)"},{bar:"single"},{p:"C4",d:"w",label:"1-2-3-4"},{bar:"final"}],width:420} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Rest Flash",
      intro:"A rest flashes on the staff — name it fast! Hole hangs down, hat sits on top, squiggle = quarter. 10 rounds.",
      miaIntro:"Game time! Hats, holes, and squiggles — how fast can you sort silence? \u{1F3AE}",
      spec:{rounds:10, ask:"name", kind:"rest"},
      result:(score)=>score>=9?"Nine or more — no rest can hide from you!":null },
    { type:"symbol-hunt", title:"Game 2 · Silent Symbol Hunt",
      intro:"Click the symbol Mia names — rests hiding among notes! Remember: \u{1F573}\u{FE0F} hole = whole, \u{1F3A9} hat = half.",
      miaIntro:"The rests are hiding among the notes — hunt them down! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Whole Rest", spec:{clef:"treble",notes:[{rest:"w"}]}},
        {label:"Half Rest", spec:{clef:"treble",notes:[{rest:"h"}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}},
        {label:"Whole Note", spec:{clef:"treble",notes:[{p:"B4",d:"w"}]}},
        {label:"Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h"}]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}}]},
      result:(score)=>score>=5?"Hat, hole, squiggle — spotted every time. Sharp!":null },
    { type:"rhythm-tap", title:"Game 3 · Don't Tap the Silence!",
      intro:"The trickiest rhythm game yet: tap the NOTES, but stay perfectly still during the RESTS. Extra taps count against you!",
      miaIntro:"Now the real test — can your hands stay SILENT on the rests? \u{1F92B}",
      spec:{tempo:80, rounds:3, patterns:[["q","rq","q","q"],["h","rh"],["q","q","rh"],["rq","q","rq","q"],["q","rq","q","rq"]]},
      result:(score)=>score>=7?"You tapped the sound and honored the silence — true rhythm mastery!":null },
    { type:"measure-build", title:"Game 4 · Sound & Silence Builder",
      intro:"Build 4-beat measures mixing notes AND rests — every measure needs at least one rest. Three different creations!",
      miaIntro:"Composer time! Paint with sound AND silence. \u{1F3A8}",
      spec:{beats:4, rests:true, needRest:true, rounds:3},
      result:(stars)=>stars>=3?"Three measures of perfectly balanced sound and silence — composer-level work!":null }
  ],
  practiceIntro:"20 practice questions — naming rests, counting silent beats, hats vs holes, and mixed measures. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{kind:"rest", ask:"name"}, count:3 },
    { gen:"note-value", params:{kind:"rest", ask:"beats"}, count:3 },
    { gen:"measure-complete", params:{beats:4, rests:true}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { type:"mc", q:"A Rest is…", choices:["a symbol for musical silence","a very quiet note","a break where you stop counting"], answer:0,
      explain:"Silence with an exact length — and you keep counting through it." },
    { type:"truefalse", q:"The Whole Rest hangs DOWN from the 4th line — like a hole.", answer:true,
      explain:"Hole = whole. It hangs below the line." },
    { type:"truefalse", q:"The Half Rest sits ON TOP of the 3rd line — like a hat.", answer:true,
      explain:"Hat = half. It sits on the line." },
    { type:"mc", q:"Which rest is the squiggly symbol?", choices:["Quarter Rest","Half Rest","Whole Rest"], answer:0,
      explain:"The squiggle = quarter rest = 1 silent beat." },
    { type:"truefalse", q:"A rest lasts the same number of beats as its twin note.", answer:true,
      explain:"Whole rest 4, half rest 2, quarter rest 1 — exactly like the notes." },
    { type:"truefalse", q:"You stop counting during a rest.", answer:false,
      explain:"NEVER stop counting — the beat continues through every silence." },
    { type:"mc", q:"Half Note + Half Rest adds up to…", choices:["4 beats — a complete 4/4 measure","2 beats","3 beats"], answer:0,
      explain:"2 sounding + 2 silent = 4. Rests count toward the measure total!" },
    { type:"truefalse", q:"Rests only appear at the end of a piece.", answer:false,
      explain:"Rests appear anywhere the composer wants silence — beginning, middle, end." },
    { type:"mc", q:"Why are rests important?", choices:["silence shapes the music as much as sound","they give the pianist time to wave","they make the piece shorter"], answer:0,
      explain:"Silence creates drama, breath, and rhythm — it's part of the music." },
    { type:"truefalse", q:"The whole rest and half rest look similar, so their position on the staff is how you tell them apart.", answer:true,
      explain:"Same rectangle — but hole hangs below the 4th line, hat sits on the 3rd." },
    /* — from the unit review sheet — */
    { type:"mc", q:"In 4/4 time, a whole rest means rest for ____ beats.", choices:["4","2","1"], answer:0, explain:"In 4/4 the whole rest fills all four beats." },
    { type:"mc", q:"In 4/4 time, a half rest means rest for ____ beats.", choices:["2","4","1"], answer:0, explain:"The half rest matches the half note: 2 beats." }
  ],
  miaQuizIntro:"Quiz time! Hats, holes, squiggles, and silent beat math. Keep counting — even through the silence!",
  quiz:[
    /* draft Q1–Q12, adapted */
    { type:"mc", q:"What does a Rest represent?", choices:["A loud sound","Silence for a specific number of beats","A high note","A clef"], answer:1,
      explain:"A rest is measured silence — exact beats of quiet.", hint:"What did the hook's second version contain?" },
    { type:"mc", q:"How many beats does a Whole Rest receive?", choices:["1","2","4","8"], answer:2,
      explain:"Four silent beats — the twin of the whole note.", hint:"Same as its twin note." },
    { type:"mc", q:"How many beats does a Half Rest receive?", choices:["1","2","3","4"], answer:1,
      explain:"Two silent beats — the twin of the half note.", hint:"The hat's twin is the half note." },
    { type:"mc", q:"How many beats does a Quarter Rest receive?", choices:["1","2","3","4"], answer:0,
      explain:"One silent beat — the squiggle's worth.", hint:"The squiggle is the smallest of today's rests." },
    { type:"truefalse", q:"A Quarter Rest lasts the same amount of time as a Quarter Note.", answer:true,
      explain:"Twins are identical in length — one sounds, one stays silent.", hint:"They're twins!" },
    { type:"truefalse", q:"A Whole Rest sits on top of the line like a hat.", answer:false,
      explain:"The whole rest HANGS below the 4th line — it's the HOLE. The hat is the half rest.", hint:"Hole or hat — which is whole?" },
    { type:"mc", q:"Which symbol is the HALF REST?",
      staff:{clef:"treble",notes:[{rest:"w",label:"1"},{rest:"h",label:"2"},{rest:"q",label:"3"},{p:"B4",d:"w",label:"4"}],width:400},
      choices:["1","2","3","4"], answer:1,
      explain:"Number 2 sits ON the 3rd line — the hat. (1 hangs — the hole; 3 is the squiggle; 4 is a whole NOTE.)",
      hint:"Find the hat sitting on its line." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Whole Rest → 4 beats · Half Rest → 2 beats · Quarter Rest → 1 beat",
               "Whole Rest → 1 beat · Half Rest → 4 beats · Quarter Rest → 2 beats",
               "Whole Rest → 2 beats · Half Rest → 1 beat · Quarter Rest → 4 beats"], answer:0,
      explain:"Rests mirror their twin notes exactly: 4, 2, 1.",
      hint:"Just like the notes: whole, half, quarter." },
    { type:"mc", q:"A Whole Rest hangs from the ____ line.", choices:["3rd","4th","5th"], answer:1,
      explain:"It hangs below the 4th line — like a hole dug under it.", hint:"The hole hangs under this line." },
    { type:"mc", q:"A Half Rest sits on the ____ line.", choices:["3rd","4th","2nd"], answer:0,
      explain:"It sits on top of the 3rd line — like a hat.", hint:"The middle line wears the hat." },
    { type:"mc", q:"Which combination fills a complete 4-beat measure?",
      choices:["Half Note + Half Rest","Quarter Note + Quarter Rest","Half Rest + Quarter Note"], answer:0,
      explain:"2 + 2 = 4 ✓. The others total 2 and 3 — incomplete.",
      hint:"Rests count beats too — add them up." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Rests mean you stop counting.","Rests are not important.","You continue counting during rests.","Rests only appear at the end of music."], answer:2,
      explain:"The count never stops — silence keeps the beat too.",
      hint:"What's the golden rule from step 4?" },
    /* generated — fresh every attempt */
    { gen:"note-value", params:{kind:"rest", ask:"name"}, count:2 },
    { gen:"note-value", params:{kind:"rest", ask:"beats"}, count:2 },
    { gen:"measure-complete", params:{beats:4, rests:true}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:1 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"A sign for silence. Each note value has a matching rest of the same length.", term:"Rest"},
    {def:"Hangs below the 4th line. In 4/4, it receives 4 beats of silence.", term:"Whole Rest", staff:{clef:"none",notes:[{rest:"w"}],width:140}},
    {def:"Sits on the 3rd line. It receives 2 beats of silence.", term:"Half Rest", staff:{clef:"none",notes:[{rest:"h"}],width:140}},
    {def:"It receives 1 beat of silence.", term:"Quarter Rest", staff:{clef:"none",notes:[{rest:"q"}],width:140}}
  ],
  mistakes:[], /* Oops section removed at instructor request (Session 15o) */
  summary:[
    "✔ A <b>Rest</b> = measured silence; every note has a <b>silent twin</b>.",
    "✔ Whole Rest = <b>4</b> · Half Rest = <b>2</b> · Quarter Rest = <b>1</b> silent beat.",
    "✔ \u{1F573}\u{FE0F} <b>Hole hangs down</b> from the 4th line = WHOLE rest.",
    "✔ \u{1F3A9} <b>Hat sits on top</b> of the 3rd line = HALF rest.",
    "✔ <b>Keep counting through every rest</b> — the beat never stops."
  ],
  tips:[
    "Say “rest” out loud on every silent beat — “1, rest(2), 3, rest(4)” — until counting through silence feels natural.",
    "Hat or hole? Say it out loud every single time. Corny works — that's why it sticks!",
    "Great performers love rests: silence makes the next note land harder.",
    "\u{1F92B} You've finished Unit 2's core rhythm symbols! Next lesson opens Unit 3: the 2/4 time signature."
  ],
  rewards:{ badge:"Silence Master", icon:"\u{1F92B}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score — you mastered the notes AND the silences between them. That's real musicianship. \u{1F92B}\u{1F389}",
  miaPass:"You passed! Hats, holes, and squiggles all sorted. Review below or chase the perfect run — fresh questions every time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Composers write silence on purpose — a gap can be the most dramatic moment in a piece. Rests are how silence gets written down.",
      play:()=>{const s=.5;[60,64].forEach((m,i)=>MFAudio.tone(m,s*.9,i*s));MFAudio.tone(64,s*.9,3*s);MFAudio.tone(60,s*.9,4*s);} },
    learn:{ label:"the rests",
      explain:"Whole rest: hangs below the 4th line (hole), 4 beats. Half rest: sits on the 3rd line (hat), 2 beats. Quarter rest: the squiggle, 1 beat. Count through every one.",
      hint:"Hole hangs down = whole. Hat sits on top = half. Squiggle = quarter.",
      play:()=>{const s=.55;MFAudio.tone(67,s*.9,0);MFAudio.click(s,.35);MFAudio.tone(67,s*.9,2*s);MFAudio.click(3*s,.35);} },
    example:{ label:"the examples",
      explain:"Count out loud and say “rest” on the silent beats — that's where the rests live. The pulse never pauses." },
    game:{ label:"the games",
      explain:"Flash-name the rests, hunt them among notes, tap rhythms WITHOUT tapping the silences, and compose with sound + silence.",
      hint:"In the tap game, extra taps during rests count against you — stillness is a skill!" },
    quiz:{ label:"this question",
      explain:"Three symbols, three numbers: hole/whole = 4, hat/half = 2, squiggle/quarter = 1 — and the count never stops.",
      play:()=>{MFAudio.tone(72,.35,0);MFAudio.click(.45,.35);MFAudio.tone(72,.35,.9);} }
  }
};
