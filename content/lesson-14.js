/* Lesson 14 — Repeat Sign, 1st and 2nd Endings (AEMT Book 1, Unit 4)
   Built from drafts/UNIT 4 – Lesson 14.md.
   QA note honored: the sequence "Play → 1st Ending → Repeat → Skip 1st → 2nd Ending"
   is rehearsed visually and interactively in steps, games and quiz.
   NOTE: edit by FULL-FILE REWRITE only. */

/* which-ending drill (unique L14 prefix) */
function MF_L14_whichEnding(container,fb){
  const rounds=[
    {q:"FIRST time through the section — which ending do you play?",a:0,why:"First trip → 1st ending, then back to the repeat sign."},
    {q:"You repeated the section. SECOND time through — which ending?",a:1,why:"Second trip → SKIP the 1st ending, play the 2nd."},
    {q:"Second time through, you reach the 1st ending bracket. What do you do?",a:2,why:"Skip it! Jump straight over to the 2nd ending."},
    {q:"You just played the 1st ending. Where do you go now?",a:3,why:"Back to the repeat sign (or the beginning) to play the section again."}];
  let i=0;
  container.innerHTML=`<div class="big-q we-q" style="text-align:center"></div>
    <div class="choices we-ch"><button>1st Ending</button><button>2nd Ending</button><button>Skip it</button><button>Go back and repeat</button></div>`;
  const q=container.querySelector(".we-q"), ch=container.querySelector(".we-ch");
  function ask(){ q.textContent=`Situation ${i+1} of ${rounds.length}: `+rounds[i].q; }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=rounds[i];
    if(bi===cur.a){ MFAudio.yay(); i++;
      if(i>=rounds.length){ ch.style.display="none"; q.textContent="Roadmap mastered!";
        fb(true,"✓ All four situations handled — first trip takes exit 1, second trip skips to exit 2!"); }
      else { fb(true,"✓ "+cur.why+" Next situation…"); ask(); } }
    else { MFAudio.tone(40,.25); fb(false,cur.why); }
  });
  ask();
}

LESSON_CONTENT[14]={
  welcome:"Unit 4! Today music learns to say “again!” \u{1F501}",
  hook:{
    say:"Have you ever listened to a song that repeats your favorite part? Instead of writing the same music twice, composers use <b>repeat signs</b> — a double bar with <b>two dots</b>. \u{1F447} <b>Which bar line says “play it again”?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="hk-staff"></div>
          <div class="choices hk-ch"><button>1</button><button>2</button></div>`;
        Staff.render(container.querySelector(".hk-staff"),{clef:"treble",
          notes:[{bar:"final",label:"1",x:232},{bar:"repeat-end",label:"2"}],width:420});
        const ch=container.querySelector(".hk-ch"); ch.classList.add("chips");
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ Number 2 — the two DOTS make it a repeat sign: “go back and play the section again!” (Number 1, with no dots, just means the end.)");
          else fb(false,"That's the plain double bar — THE END. Look for the one with two little dots.");
        });
      } }
  },
  objectives:[
    "Identify repeat signs",
    "Explain how repeat signs work",
    "Follow 1st and 2nd endings correctly",
    "Know which ending to skip on the repeat",
    "Read simple musical roadmaps",
    "Perform repeated sections accurately"
  ],
  steps:[
    { say:"A <b>repeat sign</b> is a double bar with <b>two dots facing the music</b>. When you reach it, go back and <b>play the section again</b>. If there is <b>no facing repeat sign earlier</b>, return to the <b>very beginning</b> — notice the front of this line has no repeat sign at all. \u{1F447} <b>What does a repeat sign tell you to do?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[
        {p:"C4",d:"h",label:"1"},{p:"E4",d:"h"},{bar:"single"},
        {p:"G4",d:"h",label:"2"},{p:"E4",d:"h"},{bar:"single"},
        {p:"F4",d:"h",label:"3"},{p:"D4",d:"h"},{bar:"single"},
        {p:"E4",d:"h",label:"4"},{p:"C4",d:"h"},{bar:"repeat-end"}],width:470} },
      try:{ type:"mc",
        choices:["Go back and play the section again","Stop playing","Play louder"], answer:0,
        success:"✓ The dots say “again!” — one more trip through the section.",
        fail:"Two dots + double bar = REPEAT.",
        hint:"What does “repeat” mean?" } },
    { say:"Now the clever part: <b>1st and 2nd endings</b>. First time: play ending <b>1</b>, then repeat. Second time: <b>SKIP ending 1</b> and play ending <b>2</b>. \u{1F447} <b>Watch and listen — the player takes BOTH trips:</b>",
      try:{ type:"custom",
        hint:"Trip 1: A → B → ending 1 → repeat. Trip 2: A → B → skip → ending 2.",
        mount:(container,fb)=>{
          const A={p:"C4",d:"h",label:"A"}, B={p:"E4",d:"h",label:"B"},
                E1={p:"G4",d:"w",label:"1st ending"}, E2={p:"C5",d:"w",label:"2nd ending"};
          const spec={clef:"treble",time:"4/4",tempo:110,
            notes:[A,B,{bar:"single"},E1,{bar:"repeat-end"},E2,{bar:"final"}],
            endings:[{from:3,to:3,n:1},{from:5,to:5,n:2}],width:460};
          container.innerHTML=`<div class="re-staff"></div>
            <div style="text-align:center"><button class="play re-play">▶ Play both trips</button></div>
            <div class="big-q re-q" style="text-align:center"></div>`;
          const api=Staff.render(container.querySelector(".re-staff"),spec);
          const q=container.querySelector(".re-q");
          container.querySelector(".re-play").onclick=()=>{
            const spb=60/110;
            const order=[[0,0],[1,2],[3,4],[0,8],[1,10],[5,12]]; /* [itemIndex, startBeat] — trip2 skips ending 1 */
            q.textContent="Trip 1: A → B → 1st ending → repeat…";
            order.forEach(([idx,beat])=>{
              const n=spec.notes[idx];
              setTimeout(()=>api.highlight(idx), beat*spb*1000);
              MFAudio.tone(MFAudio.midi(n.p), (n.d==="w"?4:2)*spb*.9, beat*spb);
            });
            setTimeout(()=>{ q.textContent="Trip 2: A → B → SKIP 1st → 2nd ending!"; }, 8*spb*1000);
            setTimeout(()=>{ api.highlight(null); q.textContent="";
              fb(true,"✓ Hear it? Trip 1 ended on the LOW note (1st ending), trip 2 skipped it and ended HIGH (2nd ending)."); }, 16.5*spb*1000);
          };
        } } },
    { say:"Your turn to navigate. \u{1F447} <b>What do you do in each situation?</b>",
      try:{ type:"custom",
        hint:"First trip → 1st ending. Second trip → skip 1st, play 2nd.",
        mount:(container,fb)=>MF_L14_whichEnding(container,fb) } },
    { say:"Why bother? Repeat signs <b>save space</b> — one written section, played twice. A whole verse-chorus song can fit on one page! \u{1F447} <b>Why do composers use repeat signs?</b>",
      try:{ type:"mc",
        choices:["To save space and avoid writing music twice","To make the piece louder","To confuse performers"], answer:0,
        success:"✓ One section, two trips — half the ink, same music!",
        fail:"Think practically: what would the page look like WITHOUT repeat signs?",
        hint:"Composers are efficient." } },
    { say:"Put the whole journey in order. \u{1F447} <b>Tap the performance steps in sequence:</b>",
      try:{ type:"custom",
        hint:"Play through, take exit 1, go back, play through, take exit 2.",
        mount:(container,fb)=>{
          const seq=["Play A","Play B","1st Ending","Repeat!","Play A again","Play B again","Skip to 2nd Ending"];
          let next=0;
          container.innerHTML=`<div class="big-q po-q" style="text-align:center">Tap the steps in performance order:</div>
            <div class="po-done" style="text-align:center;font-weight:700;min-height:30px;color:var(--primary)"></div>
            <div class="choices po-ch"></div>`;
          const done=container.querySelector(".po-done"), ch=container.querySelector(".po-ch");
          [...seq].sort(()=>Math.random()-.5).forEach(s=>{
            const b=document.createElement("button"); b.textContent=s;
            b.onclick=()=>{
              if(s===seq[next]){ next++; b.disabled=true; MFAudio.tone(60+next*2,.25);
                done.textContent=seq.slice(0,next).join(" → ");
                if(next===seq.length){ ch.style.display="none";
                  fb(true,"✓ The full roadmap: through the section, exit 1, back, through again, straight to exit 2!"); } }
              else { MFAudio.tone(40,.25); fb(false,`Not yet — what happens ${next===0?"first":"after “"+seq[next-1]+"”"}?`); }
            };
            ch.appendChild(b);
          });
        } } }
  ],
  examples:[
    { caption:"Four measures ending with a repeat sign. There is no facing sign at the front, so the performer returns to the very BEGINNING and plays all four measures again.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"h"},{bar:"single"},
        {p:"F4",d:"h"},{p:"D4",d:"h"},{bar:"single"},
        {p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"h"},{bar:"single"},
        {p:"E4",d:"h"},{p:"C4",d:"h"},{bar:"repeat-end"}],
        playOrder:[0,1,2,4,5,7,8,9,11,12, 0,1,2,4,5,7,8,9,11,12],width:470} },
    { caption:"1st and 2nd endings: trip one takes bracket 1 and repeats; trip two skips to bracket 2 and finishes. Press play and follow BOTH trips.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[{p:"C4",d:"h",label:"A"},{p:"E4",d:"h",label:"B"},{bar:"single"},{p:"G4",d:"w",label:"1st"},{bar:"repeat-end"},{p:"C5",d:"w",label:"2nd"},{bar:"final"}],endings:[{from:3,to:3,n:1},{from:5,to:5,n:2}],
      playOrder:[0,1,3, 0,1,5],width:460} }
  ],
  games:[
    { type:"order-tap", title:"Game 1 · Roadmap Runner",
      intro:"Tap the performance steps in the correct order — before the music gets lost!",
      miaIntro:"Run the roadmap — every step in order! \u{1F3C3}",
      spec:{title:"Tap the journey in order — repeat trip included!",
        sequence:["Play the section","1st Ending","Back to the repeat sign","Play the section again","Skip the 1st Ending","2nd Ending"]},
      result:(stars)=>stars>=3?"A flawless journey — GPS-level navigation!":null },
    { type:"symbol-hunt", title:"Game 2 · Sign Hunt",
      intro:"Repeat sign, double bar, final bar — they're all cousins. Click the one Mia names!",
      miaIntro:"Cousins that look alike — spot the DOTS! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Repeat Sign", spec:{clef:"treble",notes:[{bar:"repeat-end"}]}},
        {label:"Double Bar (end of piece)", spec:{clef:"treble",notes:[{bar:"final"}]}},
        {label:"Single Bar Line", spec:{clef:"treble",notes:[{bar:"single"}]}},
        {label:"1st Ending Bracket", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{bar:"repeat-end"}],endings:[{from:0,to:0,n:1}]}},
        {label:"Whole Note", spec:{clef:"treble",notes:[{p:"B4",d:"w"}]}}]},
      result:(score)=>score>=5?"Dots, brackets, bars — all sorted!":null },
    { type:"term-race", title:"Game 3 · Roadmap Terms",
      intro:"Quick — what does each sign mean? 8 rounds of roadmap vocabulary.",
      miaIntro:"Speed vocabulary — signs and their jobs! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Repeat Sign","Go back and play the section again"],
        ["1st Ending","Played only the FIRST time through"],
        ["2nd Ending","Played after the repeat, replacing the 1st"],
        ["Double Bar","The end of the piece"],
        ["Roadmap","Directions telling you where to go next in the music"],
        ["Bar Line","Divides music into measures"]]},
      result:(score)=>score>=7?"Roadmap vocabulary — memorized!":null },
    { type:"rhythm-tap", title:"Game 4 · Tap It Twice",
      intro:"A repeat in rhythm form: listen once, tap it back — then the SAME pattern returns for its repeat. Consistency wins!",
      miaIntro:"Repeat practice for your hands — same rhythm, two trips! \u{1F44F}",
      spec:{tempo:96, rounds:3, patterns:[["q","q","h"],["q","q","h"],["h","q","q"],["h","q","q"]]},
      result:(score)=>score>=8?"Identical both trips — that's what repeat signs dream of!":null }
  ],
  practiceIntro:"20 practice questions — repeat signs, endings, and the performance order. Answer right and the next appears automatically!",
  practice:[
    { gen:"measure-complete", params:{beats:4}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-value", params:{values:["h","h.","q","w"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"A repeat sign looks like…", choices:["a double bar with two dots","a curved line","a large letter C"], answer:0,
      explain:"The dots face the section to repeat." },
    { type:"mc", q:"When you reach a repeat sign, you…", choices:["go back and play the section again","stop","skip to the end"], answer:0,
      explain:"One more trip through the music." },
    { type:"truefalse", q:"The 1st ending is played only the first time through.", answer:true,
      explain:"First trip only — then back to the repeat." },
    { type:"truefalse", q:"After repeating, you play the 1st ending again.", answer:false,
      explain:"Second trip SKIPS the 1st ending and plays the 2nd." },
    { type:"mc", q:"On the second trip, which ending do you play?", choices:["2nd Ending","1st Ending","Both"], answer:0,
      explain:"Skip 1, play 2 — the different exit." },
    { type:"truefalse", q:"Repeat signs save space on the page.", answer:true,
      explain:"One written section = two performed sections." },
    { type:"mc", q:"Where do you go from a repeat sign if there is no facing repeat sign earlier?", choices:["back to the beginning","to the next measure","to the 2nd ending"], answer:0,
      explain:"No start-repeat? Then repeat from the very beginning." },
    { type:"truefalse", q:"The numbers 1 and 2 above bracket lines mark the endings.", answer:true,
      explain:"Bracket 1 = first trip, bracket 2 = second trip." },
    { type:"mc", q:"The performance order with endings is…", choices:["A · B · 1st · repeat · A · B · 2nd","A · B · 1st · 2nd","A · 1st · B · 2nd"], answer:0,
      explain:"Through, exit 1, back, through, exit 2." },
    { type:"truefalse", q:"A repeat sign and the final double bar look exactly the same.", answer:false,
      explain:"The repeat sign has DOTS — the final bar doesn't." },
    { type:"mc", q:"Why do composers use 1st and 2nd endings?", choices:["so the repeat can END differently the second time","to make the piece longer to write","to change the tempo"], answer:0,
      explain:"Same section, different exit — without rewriting everything." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Repeat signs are two dots placed before or after a ______.", choices:["double bar","clef","time signature"], answer:0, explain:"Dots + double bar = the repeat sign." },
    { type:"mc", q:"A 4-measure section ends with a repeat sign. How many measures does the performer play in total?", choices:["8","4","6"], answer:0, explain:"The section is played twice: 4 × 2 = 8." }
  ],
  miaQuizIntro:"Quiz time! First trip, exit 1 — second trip, exit 2. Navigate!",
  quiz:[
    { type:"mc", q:"What does a repeat sign tell you to do?", choices:["Stop playing","Repeat a section of music","Play louder","Change the tempo"], answer:1,
      explain:"Go back and play the section again.", hint:"Its name says it all." },
    { type:"mc", q:"What identifies a repeat sign?", choices:["A single bar line","A double bar with two dots","A sharp sign","A fermata"], answer:1,
      explain:"The two dots are the giveaway.", hint:"Look for dots." },
    { type:"mc", q:"When do you play the 1st ending?", choices:["Every time","Only the first time through","Only the second time","Never"], answer:1,
      explain:"First trip only — then repeat.", hint:"Its number is a clue." },
    { type:"truefalse", q:"You play the 1st ending again after the repeat.", answer:false,
      explain:"Second trip skips it — straight to the 2nd ending.", hint:"Different exit on trip two." },
    { type:"truefalse", q:"You play the 2nd ending after repeating the section.", answer:true,
      explain:"That's its whole job — the second-trip exit.", hint:"Trip two." },
    { type:"truefalse", q:"Repeat signs help save space in written music.", answer:true,
      explain:"Write once, play twice.", hint:"Efficient composers!" },
    { type:"mc", q:"During the second time through, which ending should you SKIP?", choices:["1st Ending","2nd Ending","Neither"], answer:0,
      explain:"Jump over bracket 1, land in bracket 2.", hint:"You already played it once." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Repeat Sign → repeat the section · 1st Ending → first time only · 2nd Ending → after the repeat",
               "Repeat Sign → stop · 1st Ending → always · 2nd Ending → never",
               "Repeat Sign → play louder · 1st Ending → after the repeat · 2nd Ending → first time"], answer:0,
      explain:"The complete roadmap in one line.", hint:"First trip, second trip." },
    { type:"mc", q:"A repeat sign tells you to ____ the section.", choices:["repeat","skip","end"], answer:0,
      explain:"Play it again!", hint:"The name is the answer." },
    { type:"mc", q:"On the second time through, skip the ____ ending.", choices:["1st","2nd","final"], answer:0,
      explain:"Skip 1, play 2.", hint:"Which one did you already play?" },
    { type:"mc", q:"Which is the correct performance order?",
      choices:["A → B → 1st Ending → Repeat → A → B → 2nd Ending",
               "A → B → 1st Ending → 2nd Ending → A → B",
               "A → 1st Ending → 2nd Ending → B"], answer:0,
      explain:"Through the section, exit 1, back, through again, exit 2.",
      hint:"Two full trips." },
    { type:"mc", q:"Which statement is correct?",
      choices:["The 1st ending is played every time","The 2nd ending is played before the repeat","On the second time through, you skip the 1st ending and continue to the 2nd ending","Repeat signs mean to stop playing"], answer:2,
      explain:"The golden rule of endings.", hint:"Trip two takes the other exit." },
    /* generated */
    { gen:"measure-complete", params:{beats:4}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-value", params:{values:["h","h.","q"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"Return to the beginning, or to the previous repeat sign at the beginning of the section.", term:"Repeat Sign", staff:{clef:"none",notes:[{bar:"repeat-end"}],width:140}},
    {def:"Play through the 1st ending to the repeat sign, then go back.", term:"1st Ending", staff:{clef:"none",notes:[{p:"B4",d:"w"},{bar:"repeat-end"}],endings:[{from:0,to:0,n:1}],width:150}},
    {def:"When repeating, skip the 1st ending and play the 2nd ending.", term:"2nd Ending"},
    {def:"Signs that tell the performer the order in which the music is played.", term:"Roadmap"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Repeat sign</b> = double bar + two dots: play the section <b>again</b>.",
    "✔ First trip → play the <b>1st ending</b>, then go back.",
    "✔ Second trip → <b>skip the 1st</b>, play the <b>2nd ending</b>.",
    "✔ Repeats <b>save space</b> — write once, play twice.",
    "✔ The order: A → B → 1st → repeat → A → B → 2nd."
  ],
  tips:[
    "Trace the route with your finger BEFORE playing — every wrong turn you catch early is a save.",
    "The dots always face the music they want repeated.",
    "First time through, play ending 1; on the repeat, skip ending 1 and play ending 2 — never both.",
    "\u{1F3C3} Next lesson: notes get FASTER — eighth notes split the beat in two!"
  ],
  rewards:{ badge:"Roadmap Reader", icon:"\u{1F501}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT journey — not one wrong turn! Eighth notes are revving up next. \u{1F501}\u{1F389}",
  miaPass:"You passed! The musical roadmap is in your hands. Review below or take the route once more.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Repeat signs recycle music: a double bar with two dots sends you back for another trip through the section.",
      play:()=>{[60,64,67].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));[60,64,67].forEach((m,i)=>MFAudio.tone(m,.3,1.2+i*.3));} },
    learn:{ label:"repeats and endings",
      explain:"Repeat sign = go back. Endings: first trip plays bracket 1 then repeats; second trip skips bracket 1 and plays bracket 2.",
      hint:"First trip exit 1, second trip exit 2.",
      play:()=>{[60,64,67,72].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    example:{ label:"the examples",
      explain:"Example 1 wraps a section in repeat dots; example 2 adds the two exits — watch trip two skip bracket 1." },
    game:{ label:"the games",
      explain:"Run the roadmap in order, hunt the dotted signs, race the vocabulary, and tap a rhythm that repeats.",
      hint:"When lost, ask: which trip am I on?" },
    quiz:{ label:"this question",
      explain:"Everything reduces to the journey: play through, exit 1, repeat, skip exit 1, exit 2, done.",
      play:()=>{MFAudio.tone(72,.3,0);MFAudio.tone(67,.3,.35);MFAudio.tone(72,.3,.7);} }
  }
};
