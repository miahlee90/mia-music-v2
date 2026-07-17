/* Lesson 18 — Dynamic Signs (AEMT Book 1, Unit 5)
   Built from drafts/UNIT 5 – Lesson 18.md.
   QA note honored: each symbol repeatedly paired with Italian term + English meaning,
   with LISTENING activities for soft/loud/crescendo/decrescendo.
   Draft Q12 implementation note followed: option B revised so only one answer is correct.
   NOTE: edit by FULL-FILE REWRITE only. */

/* loud-or-soft listening drill (unique L18 prefix) */
function MF_L18_loudSoft(container,fb,rounds){
  const seq=[]; for(let i=0;i<rounds;i++) seq.push(i%2===0);
  seq.sort(()=>Math.random()-.5);
  let i=0,played=false;
  container.innerHTML=`<div class="big-q lsd-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play lsd-play">▶ Listen</button></div>
    <div class="choices lsd-ch" style="display:none"><button>\u{1F92B} piano (p) — soft</button><button>\u{1F4E2} forte (f) — loud</button></div>`;
  const q=container.querySelector(".lsd-q"), ch=container.querySelector(".lsd-ch"), btn=container.querySelector(".lsd-play");
  function ask(){ q.textContent=`Sound ${i+1} of ${seq.length}: p or f?`; played=false; ch.style.display="none"; }
  btn.onclick=()=>{
    const loud=seq[i];
    [60,64,67].forEach((m,k)=>MFAudio.tone(m,.5,k*.45,loud?.8:.15));
    played=true;
    setTimeout(()=>{ ch.style.display=""; },1800);
  };
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    if(!played){ fb(false,"Listen first!"); return; }
    const saidLoud=bi===1, ok=saidLoud===seq[i];
    if(ok){ i++;
      if(i>=seq.length){ ch.style.display="none"; btn.style.display="none"; q.textContent="Golden ears!";
        fb(true,"✓ Every level identified — p is the whisper, f is the shout!"); }
      else { fb(true,`✓ ${seq[i-1]?"FORTE — full volume!":"piano — soft and gentle."} Next…`); ask(); } }
    else fb(false,"Compare it to your speaking voice: whisper = p, shout = f. Play it again!");
  });
  ask();
}

LESSON_CONTENT[18]={
  welcome:"Unit 5! Today music learns to whisper AND shout. \u{1F4E2}",
  hook:{
    say:"Have you ever whispered a secret… or shouted across a room? Music works the same way! Press play — the same melody, twice. <b>What's different?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Twice</button></div>
          <div class="choices hk-ch" style="display:none"><button>The VOLUME changed — soft, then loud</button><button>The speed changed</button><button>The notes changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          [60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.45,k*.4,.15));
          [60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.45,2.2+k*.4,.8));
          setTimeout(()=>{ ch.style.display=""; },4400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Same notes, same speed — only the VOLUME changed. Those volume instructions are called DYNAMICS!");
          else fb(false,"The notes and speed were identical — listen for how STRONG the sound is.");
        });
      } }
  },
  objectives:[
    "Identify common dynamic markings",
    "Explain the meanings of Italian dynamic terms",
    "Recognize the symbols for crescendo and decrescendo",
    "Describe gradual changes in volume",
    "Order dynamics from softest to loudest",
    "Read dynamic symbols in a musical score"
  ],
  steps:[
    { say:"Dynamics tell us <b>how loud or soft</b> to play — in Italian, music's official language for centuries. The two anchors: <b>p (piano) = soft</b> \u{1F92B} and <b>f (forte) = loud</b> \u{1F4E2}. \u{1F447} <b>Trust your ears:</b>",
      try:{ type:"custom",
        hint:"Whisper = p, shout = f.",
        mount:(container,fb)=>MF_L18_loudSoft(container,fb,4) } },
    { say:"Between soft and loud lives <b>mezzo = moderately</b>: <b>mp (mezzo piano)</b> = moderately soft, <b>mf (mezzo forte)</b> = moderately loud. Add the extremes — <b>pp (pianissimo)</b> very soft, <b>ff (fortissimo)</b> very loud — and you have the whole ladder. \u{1F447} <b>What does “mezzo” mean?</b>",
      show:{ type:"html", html:"<div style='display:flex;gap:8px;justify-content:center;flex-wrap:wrap;font-family:Georgia,serif'>"+["pp","p","mp","mf","f","ff"].map((d,i)=>`<div style='padding:10px 14px;border:1.5px solid var(--primary);border-radius:10px;text-align:center'><div style='font-size:${15+i*3}px;font-weight:800;font-style:italic'>${d}</div><div style='font-size:11px'>${["very soft","soft","mod. soft","mod. loud","loud","very loud"][i]}</div></div>`).join("")+"</div>" },
      try:{ type:"mc",
        choices:["Moderately","Very","Suddenly"], answer:0,
        success:"✓ Mezzo = moderately. mp and mf live in the comfortable middle of the ladder.",
        fail:"Mezzo softens the extremes — it means MODERATELY.",
        hint:"mp = moderately soft." } },
    { say:"Volume can also change <b>gradually</b>, shown by a long wedge under the notes. <b>Crescendo ( &lt; )</b> = gradually LOUDER — the wedge opens wider. <b>Decrescendo ( &gt; )</b> = gradually SOFTER — the wedge closes. \u{1F447} <b>Listen and identify:</b>",
      try:{ type:"custom",
        hint:"Growing = crescendo, shrinking = decrescendo.",
        mount:(container,fb)=>{
          const seq=["c","d","c","d"].sort(()=>Math.random()-.5);
          let i=0,played=false;
          container.innerHTML=`<div class="big-q cd-q" style="text-align:center"></div>
            <div class="cd-staff"></div>
            <div style="text-align:center"><button class="play cd-play">▶ Listen</button></div>
            <div class="choices cd-ch" style="display:none"><button>\u{1F4C8} Crescendo — growing louder</button><button>\u{1F4C9} Decrescendo — fading softer</button></div>`;
          const q=container.querySelector(".cd-q"), ch=container.querySelector(".cd-ch"), st=container.querySelector(".cd-staff");
          function ask(){
            q.textContent=`Sound ${i+1} of ${seq.length}: which way is the volume moving?`;
            const type=seq[i]==="c"?"cresc":"decresc";
            Staff.render(st,{clef:"treble",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"}],hairpins:[{from:0,to:3,type}],width:320});
            played=false; ch.style.display="none";
          }
          container.querySelector(".cd-play").onclick=()=>{
            const c=seq[i]==="c";
            for(let k=0;k<6;k++) MFAudio.tone(67,.35,k*.35, c? .1+k*.14 : .8-k*.13);
            played=true;
            setTimeout(()=>{ ch.style.display=""; },2400);
          };
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            if(!played){ fb(false,"Listen first!"); return; }
            const saidC=bi===0, ok=saidC===(seq[i]==="c");
            if(ok){ i++;
              if(i>=seq.length){ ch.style.display="none"; q.textContent="Gradual changes mastered!";
                fb(true,"✓ Opening wedge = crescendo (<), closing wedge = decrescendo (>) — and you HEARD both!"); }
              else { fb(true,`✓ ${seq[i-1]==="c"?"Growing — crescendo!":"Fading — decrescendo!"} Next…`); ask(); } }
            else fb(false,"Did it GROW or SHRINK? Match the arrow's opening to the volume.");
          });
          ask();
        } } },
    { say:"On the staff, dynamics sit <b>below the notes</b>, right where they take effect. \u{1F447} <b>Which dynamic starts this line?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:90,time:"4/4",notes:[{p:"C4",d:"q",dyn:"p"},{p:"E4",d:"q"},{p:"G4",d:"q",dyn:"f"},{p:"C5",d:"q"},{bar:"final"}],width:400} },
      try:{ type:"mc",
        choices:["p — it starts soft, then f makes it loud","f — it starts loud","mp all the way"], answer:0,
        success:"✓ p under the first note = start soft; the f under note 3 flips it to loud. Dynamics act exactly where they're printed!",
        fail:"Read the letters UNDER the notes, left to right.",
        hint:"First marking wins first." } },
    { say:"Put the whole ladder in order — softest to loudest. \u{1F447} <b>Tap them in order:</b>",
      try:{ type:"custom",
        hint:"pp → p → mp → mf → f → ff.",
        mount:(container,fb)=>{
          const seq=["pp","p","mp","mf","f","ff"];
          let next=0;
          container.innerHTML=`<div class="big-q dl-q" style="text-align:center">Softest first!</div>
            <div class="dl-done" style="text-align:center;font-weight:800;font-style:italic;min-height:30px;color:var(--primary);font-size:1.2rem"></div>
            <div class="choices chips dl-ch"></div>`;
          const done=container.querySelector(".dl-done"), ch=container.querySelector(".dl-ch");
          [...seq].sort(()=>Math.random()-.5).forEach(s=>{
            const b=document.createElement("button"); b.textContent=s; b.style.fontStyle="italic"; b.style.fontWeight="800";
            b.onclick=()=>{
              if(s===seq[next]){ next++; b.disabled=true;
                MFAudio.tone(67,.35,0,.1+next*.13);
                done.textContent=seq.slice(0,next).join(" → ");
                if(next===seq.length){ ch.style.display="none";
                  fb(true,"✓ pp → p → mp → mf → f → ff — the complete volume ladder, softest whisper to biggest shout!"); } }
              else { MFAudio.tone(40,.25); fb(false,`Not yet — what's the ${next===0?"SOFTEST":"next louder"} level?`); }
            };
            ch.appendChild(b);
          });
        } } }
  ],
  examples:[
    { caption:"The same phrase at two volumes: p whispers it, f declares it. Listen to the marking take effect.",
      staff:{clef:"treble",tempo:92,time:"4/4",notes:[{p:"C4",d:"q",dyn:"p",label:"soft…"},{p:"E4",d:"q"},{p:"G4",d:"h"},{bar:"single"},{p:"C4",d:"q",dyn:"f",label:"LOUD!"},{p:"E4",d:"q"},{p:"G4",d:"h"},{bar:"final"}],width:460} },
    { caption:"A crescendo wedge: the notes grow from p to f as the wedge opens.",
      staff:{clef:"treble",tempo:92,time:"4/4",notes:[{p:"E4",d:"q",dyn:"p"},{p:"E4",d:"q"},{p:"E4",d:"q"},{p:"E4",d:"q",dyn:"f"},{bar:"final"}],hairpins:[{from:0,to:3,type:"cresc"}],width:420} }
  ],
  games:[
    { type:"term-race", title:"Game 1 · Dynamic Dash",
      intro:"A symbol flashes — pick its meaning fast! All six levels plus the wedges.",
      miaIntro:"Speed round — whisper or shout?! \u{26A1}",
      spec:{rounds:8, pool:[
        ["<i>p</i> (piano)","Soft"],["<i>f</i> (forte)","Loud"],
        ["<i>mp</i> (mezzo piano)","Moderately soft"],["<i>mf</i> (mezzo forte)","Moderately loud"],
        ["<i>pp</i> (pianissimo)","Very soft"],["<i>ff</i> (fortissimo)","Very loud"],
        ["&lt; (crescendo)","Gradually louder"],["&gt; (decrescendo)","Gradually softer"]]},
      result:(score)=>score>=7?"Every symbol matched — dynamic vocabulary complete!":null },
    { type:"symbol-hunt", title:"Game 2 · Find the Marking",
      intro:"Click the dynamic Mia names — p, f, mp, mf and the wedges, hiding among the cards!",
      miaIntro:"Hunt the volume signs! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"piano (soft)", html:"<i>p</i>"},
        {label:"forte (loud)", html:"<i>f</i>"},
        {label:"mezzo piano (moderately soft)", html:"<i>mp</i>"},
        {label:"mezzo forte (moderately loud)", html:"<i>mf</i>"},
        {label:"Crescendo", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"}],hairpins:[{from:0,to:2,type:"cresc"}]}},
        {label:"Decrescendo", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q"}],hairpins:[{from:0,to:2,type:"decresc"}]}}]},
      result:(score)=>score>=5?"No marking escapes your eyes!":null },
    { type:"order-tap", title:"Game 3 · Volume Ladder",
      intro:"Tap the six dynamic levels from SOFTEST to LOUDEST — against the clock!",
      miaIntro:"Climb the ladder — whisper to roar! \u{1FA9C}",
      spec:{title:"Softest → loudest!", sequence:["pp","p","mp","mf","f","ff"], timer:20},
      result:(stars)=>stars>=3?"The whole ladder in seconds — impressive!":null },
    { type:"term-race", title:"Game 4 · Reverse Dash (45s)",
      intro:"Now backwards: Mia names the MEANING, you pick the symbol. 45 seconds!",
      miaIntro:"Final challenge — meanings to symbols, fast! \u{23F1}",
      spec:{seconds:45, reverse:true, pool:[
        ["<i>p</i>","Soft"],["<i>f</i>","Loud"],["<i>mp</i>","Moderately soft"],["<i>mf</i>","Moderately loud"],
        ["<i>pp</i>","Very soft"],["<i>ff</i>","Very loud"],["&lt;","Gradually louder (crescendo)"],["&gt;","Gradually softer (decrescendo)"]]},
      result:(score)=>score>=12?score+" matched — dynamic fluency achieved!":null }
  ],
  practiceIntro:"20 practice questions — symbols, Italian terms, and gradual changes. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"dynamic marking", pool:[["p (piano)","Soft"],["f (forte)","Loud"],["mp (mezzo piano)","Moderately soft"],["mf (mezzo forte)","Moderately loud"],["pp (pianissimo)","Very soft"],["ff (fortissimo)","Very loud"],["< (crescendo)","Gradually louder"],["> (decrescendo)","Gradually softer"]], reverse:true}, count:8 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"Dynamics tell musicians…", choices:["how loud or soft to play","how fast to play","which notes to play"], answer:0,
      explain:"Volume instructions — music's expression dial." },
    { type:"truefalse", q:"Dynamic terms are traditionally written in Italian.", answer:true,
      explain:"Italian has been music's shared language for centuries." },
    { type:"mc", q:"Mezzo means…", choices:["moderately","very","suddenly"], answer:0,
      explain:"mp = moderately soft, mf = moderately loud." },
    { type:"truefalse", q:"pp is softer than p.", answer:true,
      explain:"Pianissimo — very soft, the extreme whisper." },
    { type:"mc", q:"The crescendo symbol looks like…", choices:["an opening wedge <","a closing wedge >","two dots"], answer:0,
      explain:"Opening = growing louder." },
    { type:"truefalse", q:"A decrescendo means becoming gradually softer.", answer:true,
      explain:"Also called diminuendo — the closing wedge." },
    { type:"mc", q:"Softest to loudest:", choices:["pp p mp mf f ff","ff f mf mp p pp","p pp mp mf ff f"], answer:0,
      explain:"The complete ladder in order." },
    { type:"truefalse", q:"Dynamics change WHICH notes you play.", answer:false,
      explain:"Same notes — different volume!" },
    /* — from the unit review sheet — */
    { type:"mc", q:"The Italian ending “-issimo” means…", choices:["very","moderately","gradually"], answer:0, explain:"pianISSIMO = VERY soft; fortISSIMO = VERY loud." },
    { type:"mc", q:"Diminuendo (dim.) is another name for…", choices:["decrescendo — gradually softer","crescendo — gradually louder","fortissimo"], answer:0, explain:"Two words for the same fading wedge." }
  ],
  miaQuizIntro:"Quiz time! Whisper the p's, shout the f's — go!",
  quiz:[
    { type:"mc", q:"What does forte (f) mean?", choices:["Soft","Loud","Fast","Slow"], answer:1,
      explain:"Forte = loud, full volume.", hint:"F = Full Volume." },
    { type:"mc", q:"What does piano (p) mean?", choices:["Loud","Soft","Moderate","Very loud"], answer:1,
      explain:"Piano = soft.", hint:"P = Peaceful." },
    { type:"mc", q:"What does mezzo mean?", choices:["Very","Moderately","Slowly","Suddenly"], answer:1,
      explain:"The comfortable middle.", hint:"mp, mf — the middle levels." },
    { type:"truefalse", q:"mf means moderately loud.", answer:true,
      explain:"Mezzo forte.", hint:"Mezzo + forte." },
    { type:"truefalse", q:"A crescendo means to become gradually softer.", answer:false,
      explain:"Crescendo = gradually LOUDER; decrescendo is the soft one.", hint:"Which way does < open?" },
    { type:"truefalse", q:"Dynamics tell musicians how loud or soft to play.", answer:true,
      explain:"Exactly their job.", hint:"The volume dial." },
    { type:"mc", q:"Which symbol means moderately soft?", choices:["mp","mf","pp","f"], answer:0,
      explain:"Mezzo piano.", hint:"m + p." },
    { type:"mc", q:"Which matching is correct?",
      choices:["p → Soft · f → Loud · < → Crescendo · > → Decrescendo",
               "p → Loud · f → Soft · < → Decrescendo · > → Crescendo",
               "p → Moderate · f → Very soft · < → The end · > → Repeat"], answer:0,
      explain:"The four essentials, correctly paired.", hint:"Whisper, shout, open, close." },
    { type:"mc", q:"The Italian word forte means ____.", choices:["loud","soft","fast"], answer:0,
      explain:"Loud!", hint:"Think F = Full volume." },
    { type:"mc", q:"A crescendo means becoming gradually ____.", choices:["louder","softer","slower"], answer:0,
      explain:"The opening wedge.", hint:"<" },
    { type:"mc", q:"How many dynamic markings appear in this excerpt?",
      staff:{clef:"treble",notes:[{p:"C4",d:"q",dyn:"p"},{p:"E4",d:"q"},{p:"G4",d:"q",dyn:"mf"},{p:"C5",d:"q",dyn:"f"}],width:380},
      choices:["2","3","4"], answer:1,
      explain:"Three: p, mf, f — under notes 1, 3 and 4.",
      hint:"Count the italic letters under the staff." },
    { type:"mc", q:"Which statement is correct?",
      choices:["p means loud","mf means moderately soft","A crescendo means gradually becoming louder","A decrescendo means play suddenly loud"], answer:2,
      explain:"Crescendo = gradual growth. (mf is moderately LOUD; p is soft.)",
      hint:"One option matches its true meaning." },
    /* generated */
    { gen:"term-match", params:{subject:"dynamic marking", pool:[["p (piano)","Soft"],["f (forte)","Loud"],["mp (mezzo piano)","Moderately soft"],["mf (mezzo forte)","Moderately loud"],["pp (pianissimo)","Very soft"],["ff (fortissimo)","Very loud"],["< (crescendo)","Gradually louder"],["> (decrescendo)","Gradually softer"]], reverse:true}, count:6 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 }
  ],
  vocabulary:[
    {def:"Dynamic signs indicate the volume — how soft or loud the music should be played.", term:"Dynamics"},
    {def:"Soft.", term:"piano (p)", staff:{clef:"none",notes:[{p:"B4",d:"q",dyn:"p"}],width:140}},
    {def:"Loud.", term:"forte (f)", staff:{clef:"none",notes:[{p:"B4",d:"q",dyn:"f"}],width:140}},
    {def:"Moderately — mp is moderately soft, mf is moderately loud.", term:"mezzo (m)"},
    {def:"Gradually louder.", term:"Crescendo"},
    {def:"Gradually softer.", term:"Decrescendo"}
  ],
  mistakes:[],
  summary:[
    "✔ Dynamics = <b>volume</b> instructions, written in Italian.",
    "✔ <b>p = soft</b> \u{1F92B} · <b>f = loud</b> \u{1F4E2} · <b>mezzo = moderately</b>.",
    "✔ The ladder: <b>pp → p → mp → mf → f → ff</b>.",
    "✔ <b>&lt; crescendo</b> = gradually louder · <b>&gt; decrescendo</b> = gradually softer.",
    "✔ Dynamics sit <b>below the notes</b>, right where they take effect."
  ],
  tips:[
    "Sing any tune at pp, then at ff — feel how the ENERGY changes, not the notes.",
    "P = Peaceful, F = Full volume — the two anchors of the whole system.",
    "Wedges point at the soft end: the tip is always the quietest moment.",
    "\u{1F422} Next lesson: Italian words for SPEED — tempo marks from Adagio to Vivace!"
  ],
  rewards:{ badge:"Dynamics Director", icon:"\u{1F4E2}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — from pianissimo to fortissimo, flawless! Tempo marks are next. \u{1F4E2}\u{1F389}",
  miaPass:"You passed! The volume ladder is yours. Review below or climb again for a perfect run.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Dynamics are volume instructions: p soft, f loud, and everything between. Same notes, different power.",
      play:()=>{[60,64,67].forEach((m,k)=>MFAudio.tone(m,.4,k*.35,.15));[60,64,67].forEach((m,k)=>MFAudio.tone(m,.4,1.6+k*.35,.8));} },
    learn:{ label:"the dynamics",
      explain:"pp p mp mf f ff — softest to loudest; mezzo = moderately. Crescendo (<) grows, decrescendo (>) fades.",
      hint:"P = Peaceful, F = Full volume.",
      play:()=>{for(let k=0;k<6;k++) MFAudio.tone(67,.3,k*.32,.1+k*.14);} },
    example:{ label:"the examples",
      explain:"Hear the p phrase whisper and the f phrase declare — then the crescendo grow underneath the wedge." },
    game:{ label:"the games",
      explain:"Race the symbols, hunt the markings, climb the ladder in order, then reverse-match against the clock.",
      hint:"Six levels, two wedges — that's the whole kit." },
    quiz:{ label:"this question",
      explain:"Anchor on p = soft and f = loud; mezzo = moderately; wedges = gradual change.",
      play:()=>{MFAudio.tone(67,.4,0,.15);MFAudio.tone(67,.4,.5,.8);} }
  }
};
