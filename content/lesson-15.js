/* Lesson 15 — Eighth Notes (AEMT Book 1, Unit 4)
   Built from drafts/UNIT 4 – Lessons 15 & 16.md (combined draft — pages stay separate, DD-12).
   QA note honored: "1 eighth = ½ beat, 2 eighths = 1 quarter" and counting
   "1-and-2-and-3-and-4-and" repeated across steps, games and quiz.
   NOTE: edit by FULL-FILE REWRITE only. */

/* flag-or-beam drill (unique L15 prefix) */
function MF_L15_flagBeam(container,fb,rounds){
  const POOL=[
    {items:[{p:"G4",d:"8"}],beam:null,flag:true},
    {items:[{p:"E4",d:"8"},{p:"F4",d:"8"}],beam:[0,1],flag:false},
    {items:[{p:"B4",d:"8"}],beam:null,flag:true},
    {items:[{p:"C4",d:"8"},{p:"D4",d:"8"}],beam:[0,1],flag:false},
    {items:[{p:"A4",d:"8"},{p:"G4",d:"8"}],beam:[0,1],flag:false},
    {items:[{p:"D5",d:"8"}],beam:null,flag:true}];
  const seq=[...POOL].sort(()=>Math.random()-.5).slice(0,rounds);
  let i=0;
  container.innerHTML=`<div class="big-q fbm-q" style="text-align:center"></div><div class="fbm-staff"></div>
    <div class="choices fbm-ch"><button>\u{1F3F3}\u{FE0F} Flag — one alone</button><button>\u{1F91D} Beam — a connected group</button></div>`;
  const q=container.querySelector(".fbm-q"), st=container.querySelector(".fbm-staff"), ch=container.querySelector(".fbm-ch");
  function ask(){
    const cur=seq[i];
    Staff.render(st,{clef:"treble",notes:cur.items,beams:cur.beam?[cur.beam]:undefined,width:240});
    q.textContent=`Eighth note ${i+1} of ${seq.length}: flag or beam?`;
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=seq[i], saidFlag=bi===0, ok=saidFlag===cur.flag;
    if(ok){ MFAudio.tone(MFAudio.midi(cur.items[0].p),.25); i++;
      if(i>=seq.length){ ch.style.display="none"; q.textContent="Flags and beams sorted!";
        fb(true,"✓ One alone wears a FLAG; two or more hold hands with a BEAM. Same notes, same value!"); }
      else { fb(true,`✓ ${cur.flag?"Single eighth — it wears a flag.":"A group — the flags fused into one beam."} Next…`); ask(); } }
    else fb(false,`Count the eighth notes: ${cur.flag?"only ONE, so it keeps its flag.":"more than one, so they're BEAMED together."}`);
  });
  ask();
}

LESSON_CONTENT[15]={
  welcome:"Ready to go FASTER? Today the beat splits in two! \u{1F3C3}",
  hook:{
    say:"So far your quickest note lasted one beat. Press play — the beat stays steady, but the notes suddenly <b>double their speed</b>. What happened?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Steady… then double!</button></div>
          <div class="choices hk-ch" style="display:none"><button>Each beat split into TWO notes</button><button>The beat got faster</button><button>The notes got louder</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/92;
          for(let k=0;k<8;k++) MFAudio.click(k*spb,.45,k%4===0);
          for(let k=0;k<4;k++) MFAudio.tone(67,spb*.85,k*spb);
          for(let k=0;k<8;k++) MFAudio.tone(67,spb*.42,(4+k*0.5)*spb);
          setTimeout(()=>{ ch.style.display=""; },8*spb*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ The CLICKS never changed — each beat simply split into two equal halves. Those halves are EIGHTH NOTES!");
          else fb(false,"Listen to the clicks — they stayed perfectly steady. Something happened INSIDE each beat…");
        });
      } }
  },
  objectives:[
    "Identify eighth notes",
    "Explain the difference between a flag and a beam",
    "Count rhythms using “and” between beats",
    "Recognize that two eighth notes equal one quarter note",
    "Read rhythms containing eighth notes",
    "Build measures using quarter and eighth notes"
  ],
  steps:[
    { say:"An <b>eighth note</b> is worth <b>½ beat</b> — half a quarter note. Alone, it wears a <b>flag</b>; in groups, the flags fuse into a <b>beam</b>. \u{1F447} <b>How many beats does one eighth note receive?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"E4",d:"8",label:"a pair joined by a BEAM"},{p:"F4",d:"8"},
        {p:"A4",d:"8",label:"single —"},{p:"B4",d:"8",label:"with a FLAG"}],
        beams:[[0,1]],width:420} },
      try:{ type:"mc",
        choices:["½ beat","1 beat","2 beats"], answer:0,
        success:"✓ Half a beat — two of them share one quarter note's time.",
        fail:"It's HALF of a quarter note's beat.",
        hint:"Its name is a fraction hint: eighth." } },
    { say:"Flag or beam? One alone = flag \u{1F3F3}\u{FE0F}. Two or more = beam \u{1F91D}. The VALUE never changes — ½ beat each. \u{1F447} <b>Sort them:</b>",
      try:{ type:"custom",
        hint:"Count the eighth notes: one = flag, more = beam.",
        mount:(container,fb)=>MF_L15_flagBeam(container,fb,5) } },
    { say:"To count eighth notes, add the word <b>“and”</b> between beats: <b>1-and-2-and-3-and-4-and</b>. Notes ON the beat get numbers; notes BETWEEN beats get “and.” \u{1F447} <b>Press play and count along:</b>",
      try:{ type:"custom",
        hint:"Numbers on the clicks, “and” exactly between them.",
        mount:(container,fb)=>{
          let played=false;
          container.innerHTML=`<div class="ca-staff"></div>
            <div style="text-align:center"><button class="play ca-play">▶ Play & count</button></div>
            <div class="choices ca-ch" style="display:none"><button>1-and-2-and-3-and-4-and</button><button>1-2-3-4-5-6-7-8</button><button>1-and-a-2-and-a</button></div>`;
          Staff.render(container.querySelector(".ca-staff"),{clef:"treble",time:"4/4",
            notes:[{p:"C4",d:"8",label:"1"},{p:"C4",d:"8",label:"and"},{p:"E4",d:"8",label:"2"},{p:"E4",d:"8",label:"and"},{p:"G4",d:"8",label:"3"},{p:"G4",d:"8",label:"and"},{p:"E4",d:"q",label:"4"},{bar:"final"}],
            beams:[[0,1],[2,3],[4,5]],width:460});
          const ch=container.querySelector(".ca-ch");
          container.querySelector(".ca-play").onclick=()=>{
            const spb=60/84;
            for(let k=0;k<4;k++) MFAudio.click(k*spb,.5,k===0);
            const seq=[60,60,64,64,67,67]; seq.forEach((m,i)=>MFAudio.tone(m,spb*.42,i*.5*spb));
            MFAudio.tone(64,spb*.9,3*spb);
            played=true;
            setTimeout(()=>{ ch.style.display=""; },4*spb*1000+400);
          };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(!played){ fb(false,"Play it first!"); return; }
            if(i===0) fb(true,"✓ 1-and-2-and-3-and — the “and” lives exactly halfway between the clicks. That's the eighth-note count!");
            else fb(false,"The beat count stays 1-2-3-4 — eighth notes just add “and” BETWEEN the numbers.");
          });
        } } },
    { say:"<b>2 eighths = 1 quarter</b>, and <b>8 eighths = 1 whole note</b>. \u{1F447} <b>How many eighth notes equal one whole note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"8"},{p:"B4",d:"8",label:"= "},{p:"B4",d:"q",label:"1 quarter"}],beams:[[0,1]],width:300} },
      try:{ type:"mc",
        choices:["8","4","2"], answer:0,
        success:"✓ Eight eighths = one whole note. ½ × 8 = 4 beats!",
        fail:"Each eighth is ½ beat; a whole note is 4 beats. Divide!",
        hint:"4 ÷ ½ = ?" } },
    { say:"Now BUILD with the new brick. Fill the 4/4 measure — eighths welcome! \u{1F447} <b>Two different measures:</b>",
      try:{ type:"custom",
        hint:"Eighth = ½, Quarter = 1, Half = 2. Land on exactly 4 — no half-beat left hanging!",
        mount:(container,fb)=>{
          const BT=[{t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
                    {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}},
                    {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}}];
          let cur=[],sum=0,found=[],doneItems=[];
          container.innerHTML=`<div class="be-staff"></div><div class="big-q be-q" style="text-align:center"></div>
            <div class="choices be-ch"></div>`;
          const st=container.querySelector(".be-staff"), q=container.querySelector(".be-q"), ch=container.querySelector(".be-ch");
          const BTNS_LOCAL=BT;
          BTNS_LOCAL.forEach(bt=>{ const b=document.createElement("button");
            b.style.cssText="border-radius:10px;padding:6px 10px;min-width:104px";
            const d0=document.createElement("div"); b.appendChild(d0);
            Staff.render(d0,{clef:"none",notes:[bt.item],width:100});
            const nm=document.createElement("div"); nm.style.cssText="font-weight:700;font-size:13px";
            nm.textContent=bt.label.replace(/\s*\([^)]*\)\s*$/,""); b.appendChild(nm);
            b.onclick=()=>add(bt); ch.appendChild(b); });
          const clr=document.createElement("button"); clr.className="ghost"; clr.textContent="↺ Clear";
          clr.onclick=()=>{ cur=[];sum=0;draw(); }; ch.appendChild(clr);
          function draw(){
            const items=[...doneItems,...cur.map(bt=>bt.item)];
            if(found.length>=2&&items.length&&items[items.length-1].bar==="single") items[items.length-1]={bar:"final"};
            for(let m=found.length;m<2;m++) items.push({bar: m===2-1? "final":"single"});
            Staff.render(st,{clef:"treble",time:"4/4",notes:items,width:470});
            q.textContent=`Beats: ${sum} of 4 · Measures built: ${found.length} of 2`;
          }
          function add(bt){
            if(sum+bt.beats>4){ fb(false,`That would make ${sum+bt.beats} — too many!`); return; }
            cur.push(bt); sum+=bt.beats; MFAudio.tone(71,Math.max(.2,bt.beats*.4)); draw();
            if(sum===4){
              const key=cur.map(x=>x.t).sort().join("");
              if(found.includes(key)){ fb(false,"Same recipe — clear and invent a different one!"); cur=[];sum=0; setTimeout(draw,900); return; }
              found.push(key);
              let t=0; cur.forEach(bt=>{ MFAudio.tone(71,Math.max(.2,bt.beats*.45),t); t+=bt.beats*.5; });
              doneItems.push(...cur.map(bt=>bt.item), {bar:"single"});
              cur=[]; sum=0; draw();
              if(found.length>=2){ ch.style.display="none"; q.textContent="Two measures with eighths!";
                fb(true,"✓ Half-beats and whole beats adding to exactly 4 — you're building with the full toolbox now!"); }
              else fb(true,"✓ Exactly 4 — it stays as measure 1. One more, different mix…");
            }
          }
          draw();
        } } },
    { say:"Let's READ eighth notes in real music. Count out loud: <b>1-and-2-and, 3, 4</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Beamed pairs = “number-and” — quarters get the number alone.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:88,
            notes:[{p:"C4",d:"8",label:"1"},{p:"D4",d:"8",label:"and"},{p:"E4",d:"8",label:"2"},{p:"F4",d:"8",label:"and"},{p:"G4",d:"q",label:"3"},{p:"E4",d:"q",label:"4"},{bar:"single"},{p:"C4",d:"w",label:"1-2-3-4"},{bar:"final"}],
            beams:[[0,1],[2,3]],width:460};
          container.innerHTML=`<div class="r8-staff"></div><div style="text-align:center"><button class="play r8-play">▶ Play & count along</button></div>`;
          const api=Staff.render(container.querySelector(".r8-staff"),spec);
          container.querySelector(".r8-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ 1-and-2-and, 3, 4 — running notes, walking notes, then one long landing. Real rhythm reading!"),total*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"Quarter notes WALK, eighth notes RUN — count “1-and-2-and” under the beamed pairs.",
      staff:{clef:"treble",tempo:88,time:"4/4",notes:[{p:"C4",d:"q",label:"1"},{p:"C4",d:"q",label:"2"},{p:"E4",d:"8",label:"3"},{p:"E4",d:"8",label:"and"},{p:"G4",d:"q",label:"4"},{bar:"final"}],beams:[[2,3]],width:440} },
    { caption:"Two eighths = one quarter: the same beat, sliced in half. Listen — the total time never changes.",
      staff:{clef:"treble",tempo:88,time:"4/4",notes:[{p:"G4",d:"q",label:"1"},{p:"G4",d:"8",label:"2"},{p:"G4",d:"8",label:"and"},{p:"G4",d:"q",label:"3"},{p:"G4",d:"q",label:"4"},{bar:"final"}],beams:[[1,2]],width:440} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Eighth Note Flash",
      intro:"Flags, beams, stems, dots — name each note value FAST. The eighth note joins the lineup!",
      miaIntro:"New value on the board — eyes sharp! \u{26A1}",
      spec:{rounds:10, ask:"name", values:["8","q","h","h."]},
      result:(score)=>score>=9?"The eighth note can't hide from you!":null },
    { type:"rhythm-tap", title:"Game 2 · Run & Walk Tap",
      intro:"Tap rhythms mixing walking quarters and RUNNING eighths — say “1-and” in your head!",
      miaIntro:"Hands, meet the half-beat! \u{1F44F}",
      spec:{tempo:84, rounds:3, patterns:[["8","8","q","q","q"],["q","8","8","q","q"],["8","8","8","8","h"],["q","q","8","8","q"]]},
      result:(score)=>score>=10?"Running eighths right on time — impressive hands!":null },
    { type:"measure-build", title:"Game 3 · Half-Beat Builder",
      intro:"Build 4-beat measures with eighths in the mix — the math now includes ½!",
      miaIntro:"Builder time — tiny bricks included! \u{1F3D7}\u{FE0F}",
      spec:{beats:4, unique:true, rounds:3, buttons:[
        {t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
        {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}},
        {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}},
        {t:"w",label:"Whole Note",beats:4,item:{p:"B4",d:"w"}}]},
      result:(stars)=>stars>=3?"Three different measures — half-beat math mastered!":null },
    { type:"symbol-hunt", title:"Game 4 · Flag vs Beam Hunt",
      intro:"Single eighths, beamed pairs, quarters — click exactly what Mia asks for!",
      miaIntro:"Last hunt — is it flying a flag or holding hands? \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Single Eighth Note (flag)", spec:{clef:"treble",notes:[{p:"B4",d:"8"}]}},
        {label:"Beamed Eighth Notes", spec:{clef:"treble",notes:[{p:"A4",d:"8"},{p:"B4",d:"8"}],beams:[[0,1]]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h"}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}}]},
      result:(score)=>score>=5?"Flags and beams — spotted every time!":null }
  ],
  practiceIntro:"20 practice questions — eighth-note values, flags vs beams, and “and” counting. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["8","q","h"], ask:"beats"}, count:3 },
    { gen:"note-value", params:{values:["8","q","h","h."], ask:"name"}, count:3 },
    { gen:"measure-complete", params:{beats:4}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { type:"mc", q:"One eighth note is worth…", choices:["½ beat","1 beat","2 beats"], answer:0,
      explain:"Half a beat — half of a quarter note." },
    { type:"mc", q:"Two eighth notes equal…", choices:["one quarter note","one half note","one whole note"], answer:0,
      explain:"½ + ½ = 1 beat = one quarter note." },
    { type:"truefalse", q:"A single eighth note has a flag.", answer:true,
      explain:"Alone it flies a flag; in groups it's beamed." },
    { type:"truefalse", q:"A beam connects two or more eighth notes.", answer:true,
      explain:"The flags fuse into one horizontal beam." },
    { type:"mc", q:"Eighth notes are counted using the word…", choices:["“and”","“plus”","“y”"], answer:0,
      explain:"1-and-2-and-3-and-4-and." },
    { type:"truefalse", q:"Beaming changes an eighth note's value.", answer:false,
      explain:"Flag or beam — always ½ beat. Only the LOOK changes." },
    { type:"mc", q:"How many eighth notes equal one whole note?", choices:["8","4","2"], answer:0,
      explain:"8 × ½ = 4 beats." },
    { type:"mc", q:"How many eighth notes equal one half note?", choices:["4","2","8"], answer:0,
      explain:"4 × ½ = 2 beats." },
    { type:"truefalse", q:"“1-and-2-and” counts four eighth notes.", answer:true,
      explain:"Numbers on the beats, “and” between them — four half-beats." },
    { type:"mc", q:"Eighth notes make music feel…", choices:["faster-moving over the same beat","slower","louder"], answer:0,
      explain:"Twice the notes inside every beat!" }
  ],
  miaQuizIntro:"Quiz time! Count “1-and-2-and” and those half beats will carry you through!",
  quiz:[
    { type:"mc", q:"How many beats does one eighth note receive?", choices:["¼ beat","½ beat","1 beat","2 beats"], answer:1,
      explain:"Half a beat.", hint:"Half of a quarter note." },
    { type:"mc", q:"Two eighth notes equal:", choices:["One half note","One quarter note","One whole note","Two quarter notes"], answer:1,
      explain:"½ + ½ = 1 beat — a quarter note.", hint:"Add the halves." },
    { type:"mc", q:"What connects a group of eighth notes?", choices:["Flag","Beam","Stem","Tie"], answer:1,
      explain:"The beam — a horizontal bar replacing the flags.", hint:"They hold hands." },
    { type:"truefalse", q:"A single eighth note normally has a flag.", answer:true,
      explain:"Flying solo = flag.", hint:"What does a lone eighth wear?" },
    { type:"truefalse", q:"A beam connects two or more eighth notes.", answer:true,
      explain:"Groups share one beam.", hint:"Hands held." },
    { type:"truefalse", q:"An eighth note lasts one full beat.", answer:false,
      explain:"Half a beat — the quarter note owns the full beat.", hint:"Check the fraction." },
    { type:"mc", q:"How many eighth notes equal one WHOLE note?", choices:["2","4","8","16"], answer:2,
      explain:"8 × ½ = 4 beats.", hint:"4 beats ÷ ½." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Whole → 4 · Half → 2 · Quarter → 1 · Eighth → ½",
               "Whole → 2 · Half → 1 · Quarter → ½ · Eighth → ¼",
               "Whole → 8 · Half → 4 · Quarter → 2 · Eighth → 1"], answer:0,
      explain:"Each value is half the one before.", hint:"The halving family." },
    { type:"mc", q:"An eighth note is worth ____ beat.", choices:["½","1","2"], answer:0,
      explain:"One half.", hint:"Two per beat." },
    { type:"mc", q:"The horizontal line connecting eighth notes is called a ____.", choices:["flag","beam","tie"], answer:1,
      explain:"The beam.", hint:"Not the solo decoration." },
    { type:"mc", q:"Which of these is the BEAMED pair?",
      staff:{clef:"treble",notes:[{p:"B4",d:"8",label:"1"},{p:"E4",d:"8",label:"2"},{p:"F4",d:"8",label:"2"}],beams:[[1,2]],width:320},
      choices:["1","2"], answer:1,
      explain:"Notes 2 share one beam; note 1 flies its own flag.",
      hint:"Where did the flags fuse?" },
    { type:"mc", q:"Which statement is correct?",
      choices:["A beam connects a group of eighth notes","An eighth note lasts one full beat","An eighth rest lasts one beat","Two eighth notes equal one half note"], answer:0,
      explain:"Beams join eighth-note groups; the value stays ½ beat each.",
      hint:"Review the beam's job." },
    /* generated */
    { gen:"note-value", params:{values:["8","q","h"], ask:"beats"}, count:3 },
    { gen:"measure-complete", params:{beats:4}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"In time signatures with 4 as the bottom number, it receives ½ beat.", term:"Eighth Note", staff:{clef:"none",notes:[{p:"B4",d:"8"}],width:140}},
    {def:"The small curved stroke on the stem of a single eighth note.", term:"Flag", staff:{clef:"none",notes:[{p:"B4",d:"8"}],width:140}},
    {def:"The thick line that joins the stems of two or more eighth notes.", term:"Beam", staff:{clef:"none",notes:[{p:"A4",d:"8"},{p:"B4",d:"8"}],beams:[[0,1]],width:150}},
    {def:"Eighth notes divide the beat: counted 1-and 2-and 3-and 4-and.", term:"“And” Counting"}
  ],
  mistakes:[],
  summary:[
    "✔ Eighth note = <b>½ beat</b>; <b>two eighths = one quarter</b>.",
    "✔ Alone = <b>flag</b> \u{1F3F3}\u{FE0F} · In groups = <b>beam</b> \u{1F91D}.",
    "✔ Count with <b>“and”</b>: 1-and-2-and-3-and-4-and.",
    "✔ 8 eighths = 1 whole note; 4 eighths = 1 half note.",
    "✔ Beaming changes the LOOK, never the VALUE."
  ],
  tips:[
    "Walk and say “1, 2, 3, 4” — then jog saying “1-and-2-and.” Your feet know eighth notes already.",
    "See a beam? Read the group as “number-and” before you play a single note.",
    "Keep the BEAT steady and let the eighths split it — never rush the clicks.",
    "\u{1F910} Next lesson: the eighth note's silent twin — the eighth REST!"
  ],
  rewards:{ badge:"Eighth Note Racer", icon:"\u{1F3C3}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — 1-and-2-and all the way to 100! The eighth rest is next, and it's sneaky-quiet. \u{1F3C3}\u{1F389}",
  miaPass:"You passed! Half beats are officially yours. Review below or run it again for perfection.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Eighth notes split each beat into two equal halves — the beat stays steady while the notes run.",
      play:()=>{const s=.65;for(let k=0;k<2;k++) MFAudio.tone(67,s*.85,k*s);for(let k=0;k<4;k++) MFAudio.tone(67,s*.4,(2+k*.5)*s);} },
    learn:{ label:"eighth notes",
      explain:"½ beat each; two share a quarter's time. Alone = flag, grouped = beam. Count 1-and-2-and-3-and-4-and.",
      hint:"Numbers on the beat, “and” between.",
      play:()=>{const s=.6;[60,62,64,65,67].forEach((m,i)=>MFAudio.tone(m,s*.4,i*.5*s));} },
    example:{ label:"the examples",
      explain:"Quarters walk, beamed eighths run — but the click underneath never changes speed." },
    game:{ label:"the games",
      explain:"Flash-name the new value, tap running rhythms, build with ½-beat bricks, and hunt flags vs beams.",
      hint:"Say “and” out loud while you tap — it locks the half-beat in." },
    quiz:{ label:"this question",
      explain:"Three facts: eighth = ½ beat; 2 eighths = 1 quarter; flag alone / beam in groups.",
      play:()=>{const s=.5;[67,67,67,67].forEach((m,i)=>MFAudio.tone(m,s*.4,i*.5*s));} }
  }
};
