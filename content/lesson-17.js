/* Lesson 17 — The Dotted Quarter Note (AEMT Book 1, Unit 4)
   Built from drafts/UNIT 4 – Lesson 17.md.
   QA note honored: "dot adds HALF, not a full beat" + the famous pattern
   "dotted quarter + eighth = 2 beats, counted 1-and-2 / and (eighth on the off-beat), LONG–short" everywhere. Counting corrected per instructor sketch (Session 16t).
   NOTE: edit by FULL-FILE REWRITE only. */

/* long-or-short drill (unique L17 prefix) */
function MF_L17_longShort(container,fb){
  const seq=[{d:"q.",long:true},{d:"8",long:false},{d:"8",long:false},{d:"q.",long:true},{d:"q.",long:true},{d:"8",long:false}].sort(()=>Math.random()-.5);
  let i=0;
  container.innerHTML=`<div class="big-q ls-q" style="text-align:center"></div><div class="ls-staff"></div>
    <div class="choices ls-ch"><button>LONG — the dotted quarter (1½)</button><button>short — the eighth (½)</button></div>`;
  const q=container.querySelector(".ls-q"), st=container.querySelector(".ls-staff"), ch=container.querySelector(".ls-ch");
  function ask(){
    const cur=seq[i];
    Staff.render(st,{clef:"treble",notes:[{p:"G4",d:cur.d==="q."?"q":"8",dot:cur.d==="q."}],width:220});
    q.textContent=`Note ${i+1} of ${seq.length}: is this the LONG or the short of the pair?`;
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=seq[i], saidLong=bi===0, ok=saidLong===cur.long;
    if(ok){ MFAudio.tone(67,cur.long?1.0:.3); i++;
      if(i>=seq.length){ ch.style.display="none"; q.textContent="Long and short — sorted!";
        fb(true,"✓ Dotted quarter = the LONG (1½), eighth = the short (½). Together: the famous LONG–short!"); }
      else { fb(true,`✓ ${cur.long?"The dot makes it LONG — 1½ beats.":"Tiny flag, tiny value — ½ beat."} Next…`); ask(); } }
    else fb(false,"Check for the DOT: dot = long (1½ beats); flag = short (½ beat).");
  });
  ask();
}

LESSON_CONTENT[17]={
  welcome:"The dot is back — and it brought music's favorite rhythm. \u{1F3AF}",
  hook:{
    say:"You already know the dot's rule. Press play — this rhythm is EVERYWHERE, from folk songs to film scores. Hear the pattern?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ The famous rhythm</button></div>
          <div class="choices hk-ch" style="display:none"><button>LONG – short, LONG – short</button><button>short – LONG, short – LONG</button><button>All notes equal</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/88;
          for(let k=0;k<4;k++) MFAudio.click(k*spb,.4,k%2===0);
          [[0,1.5],[1.5,.5],[2,1.5],[3.5,.5]].forEach(([b,len])=>MFAudio.tone(67,len*spb*.9,b*spb));
          setTimeout(()=>{ ch.style.display=""; },4*spb*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ LOOONG–short, LOOONG–short — the dotted quarter + eighth pattern. Today you learn to read and count it!");
          else fb(false,"Listen for which note comes FIRST — the long one leads.");
        });
      } }
  },
  objectives:[
    "Explain what a dotted quarter note is",
    "Calculate its value (1½ beats)",
    "Count rhythms using dotted quarter notes",
    "Recognize the LONG–short rhythm pattern",
    "Identify dotted quarter notes in written music",
    "Perform rhythms using dotted quarter and eighth notes"
  ],
  steps:[
    { say:"The dot rule never changes: <b>a dot adds half the note's own value</b>. Quarter = 1 beat, half of 1 = ½. So: <b>1 + ½ = 1½ beats</b>. \u{1F447} <b>How many beats does a dotted quarter note receive?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"q",label:"1 beat"},{p:"B4",d:"q",dot:true,label:"1 + ½ = 1½ beats"}],width:340} },
      try:{ type:"mc",
        choices:["1½ beats","2 beats","1 beat"], answer:0,
        success:"✓ 1 + ½ = 1½. The dot is proportional — half of whatever the note is worth.",
        fail:"Half of 1 beat is ½ — add it to the original 1.",
        hint:"Same rule as the dotted half: add HALF." } },
    { say:"The dotted quarter almost always travels with a friend: a single <b>eighth note</b>. Together: <b>1½ + ½ = 2 beats</b>, counted <b>“1-and-2 and”</b> — the dotted quarter holds through <b>“1-and-2,”</b> and the eighth lands on the <b>“and” of beat 2</b>. \u{1F447} <b>Hear it:</b>",
      try:{ type:"custom",
        hint:"Long note first, quick note snapping after.",
        mount:(container,fb)=>{
          let played=false;
          container.innerHTML=`<div class="dq-staff"></div>
            <div style="text-align:center"><button class="play dq-play">▶ Play “1-and-2, and”</button></div>
            <div class="choices dq-ch" style="display:none"><button>The dotted quarter holds “1-and-2”, the eighth plays on the “and”</button><button>Both notes are equally long</button></div>`;
          Staff.render(container.querySelector(".dq-staff"),{clef:"treble",time:"4/4",
            notes:[{p:"G4",d:"q",dot:true,label:"1-and-2"},{p:"E4",d:"8",label:"and"},{p:"G4",d:"q",dot:true,label:"3-and-4"},{p:"E4",d:"8",label:"and"},{bar:"final"}],width:420});
          const ch=container.querySelector(".dq-ch");
          container.querySelector(".dq-play").onclick=()=>{
            const spb=60/88;
            for(let k=0;k<4;k++) MFAudio.click(k*spb,.4,k%2===0);
            [[0,1.5,67],[1.5,.5,64],[2,1.5,67],[3.5,.5,64]].forEach(([b,len,m])=>MFAudio.tone(m,len*spb*.9,b*spb));
            played=true;
            setTimeout(()=>{ ch.style.display=""; },4*spb*1000+400);
          };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(!played){ fb(false,"Play it first!"); return; }
            if(i===0) fb(true,"✓ Exactly — LONG through “1-and-2”, then the quick eighth on the “and”. That pair fills 2 beats perfectly.");
            else fb(false,"Listen again — one note clearly outlasts the other. 1½ vs ½!");
          });
        } } },
    { say:"Long or short? In this famous pair, the <b>dotted quarter is always the LONG</b> one, the <b>eighth the short</b>. \u{1F447} <b>Sort them:</b>",
      try:{ type:"custom",
        hint:"Dot = long (1½); flag = short (½).",
        mount:(container,fb)=>MF_L17_longShort(container,fb) } },
    { say:"Another way to see 1½: the dotted quarter equals <b>three eighth notes</b> (½ + ½ + ½). \u{1F447} <b>How many eighth notes equal one dotted quarter note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"q",dot:true,label:"1½"},{p:"B4",d:"8",label:"½"},{p:"B4",d:"8",label:"½"},{p:"B4",d:"8",label:"½"}],beams:[[1,2]],width:380} },
      try:{ type:"mc",
        choices:["3","2","4"], answer:0,
        success:"✓ Three eighths = 1½ beats = one dotted quarter.",
        fail:"1½ ÷ ½ = 3.",
        hint:"How many halves make one-and-a-half?" } },
    { say:"Build the famous 2-beat cell! \u{1F447} <b>Fill exactly 2 beats — three different ways:</b>",
      try:{ type:"custom",
        hint:"Dotted quarter + eighth · quarter + two eighths · two quarters.",
        mount:(container,fb)=>{
          const BT=[{t:"j",label:"Dotted Quarter Note",beats:1.5,item:{p:"B4",d:"q",dot:true}},
                    {t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
                    {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}];
          let cur=[],sum=0,found=[],doneItems=[];
          container.innerHTML=`<div class="b2-staff"></div><div class="big-q b2-q" style="text-align:center"></div>
            <div class="choices b2-ch"></div>`;
          const st=container.querySelector(".b2-staff"), q=container.querySelector(".b2-q"), ch=container.querySelector(".b2-ch");
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
            if(found.length>=3&&items.length&&items[items.length-1].bar==="single") items[items.length-1]={bar:"final"};
            for(let m=found.length;m<3;m++) items.push({bar: m===3-1? "final":"single"});
            Staff.render(st,{clef:"treble",time:"2/4",notes:items,width:470});
            q.textContent=`Beats: ${sum} of 2 · Ways found: ${found.length} of 3`;
          }
          function add(bt){
            if(sum+bt.beats>2){ fb(false,`That would make ${sum+bt.beats} — the cell holds exactly 2!`); return; }
            cur.push(bt); sum+=bt.beats; MFAudio.tone(71,Math.max(.2,bt.beats*.4)); draw();
            if(sum===2){
              const key=cur.map(x=>x.t).sort().join("");
              if(found.includes(key)){ fb(false,"Found that one already — a NEW combination, please!"); cur=[];sum=0; setTimeout(draw,900); return; }
              found.push(key);
              let t=0; cur.forEach(bt=>{ MFAudio.tone(71,Math.max(.2,bt.beats*.45),t); t+=bt.beats*.5; });
              doneItems.push(...cur.map(bt=>bt.item), {bar:"single"});
              cur=[]; sum=0; draw();
              if(found.length>=3){ ch.style.display="none"; q.textContent="All three ways!";
                fb(true,"✓ Dotted-quarter+eighth, quarter+two-eighths, two quarters — three recipes for 2 beats, and the first is the famous one!"); }
              else fb(true,`✓ Exactly 2 — it stays on the staff. ${3-found.length} more way${3-found.length>1?"s":""}…`);
            }
          }
          draw();
        } } },
    { say:"Read it in real music — count <b>“1-and-2 and, 3, 4”</b> and let the long notes SING. \u{1F447}",
      try:{ type:"custom",
        hint:"Hold through “1-and-2”, snap the eighth on the “and”.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:88,
            notes:[{p:"C4",d:"q",dot:true,label:"1-and-2"},{p:"D4",d:"8",label:"and"},{p:"E4",d:"q",label:"3"},{p:"G4",d:"q",label:"4"},{bar:"single"},{p:"E4",d:"q",dot:true,label:"1-and-2"},{p:"D4",d:"8",label:"and"},{p:"C4",d:"h",label:"3-4"},{bar:"final"}],width:470};
          container.innerHTML=`<div class="rq-staff"></div><div style="text-align:center"><button class="play rq-play">▶ Play & count along</button></div>`;
          const api=Staff.render(container.querySelector(".rq-staff"),spec);
          container.querySelector(".rq-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ LONG–short flowing into steady quarters — you just read music's favorite rhythm!"),total*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"The signature cell: dotted quarter + eighth = 2 beats. Count “1-and-2, and” — hold through the beat, snap on the off-beat.",
      staff:{clef:"treble",tempo:88,time:"4/4",notes:[{p:"G4",d:"q",dot:true,label:"1-and-2"},{p:"E4",d:"8",label:"and"},{p:"G4",d:"q",dot:true,label:"3-and-4"},{p:"E4",d:"8",label:"and"},{bar:"final"}],width:440} },
    { caption:"Three ways to slice 2 beats — the dotted pair, running eighths, and steady quarters. Same total, different characters.",
      staff:{clef:"treble",tempo:88,time:"2/4",notes:[{p:"C4",d:"q",dot:true},{p:"D4",d:"8"},{bar:"single"},{p:"E4",d:"8"},{p:"F4",d:"8"},{p:"G4",d:"q"},{bar:"single"},{p:"E4",d:"q"},{p:"C4",d:"q"},{bar:"final"}],beams:[[3,4]],width:460} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Dot Spotter",
      intro:"Quarter or DOTTED quarter? Eighth or half? The dot is tiny — your eyes must be quick!",
      miaIntro:"That little dot changes everything — spot it! \u{1F50D}",
      spec:{rounds:10, ask:"beats", values:["q","q.","8","h"]},
      result:(score)=>score>=9?"1½ never fooled you once!":null },
    { type:"rhythm-tap", title:"Game 2 · LONG–short Tap",
      intro:"Tap the famous pattern: hold the LONG, snap the short. “1-and-2, and” in your head!",
      miaIntro:"The rhythm every musician knows — make it yours! \u{1F44F}",
      spec:{tempo:88, rounds:3, patterns:[["q.","8","q","q"],["q.","8","h"],["q","q.","8","q"],["q.","8","q.","8"]]},
      result:(score)=>score>=9?"LONG–short, right in the pocket!":null },
    { type:"measure-build", title:"Game 3 · Two-Beat Cell Builder",
      intro:"Fill exactly 2 beats — find all THREE recipes, dotted pair included!",
      miaIntro:"Small cell, big rhythm — build it every way! \u{1F3D7}\u{FE0F}",
      spec:{beats:2, unique:true, rounds:3, buttons:[
        {t:"j",label:"Dotted Quarter Note",beats:1.5,item:{p:"B4",d:"q",dot:true}},
        {t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
        {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}]},
      result:(stars)=>stars>=3?"All three recipes — the 2-beat cell is conquered!":null },
    { type:"symbol-hunt", title:"Game 4 · Dotted Family Hunt",
      intro:"Dotted quarter, dotted half, plain quarter, eighth — click exactly what Mia names!",
      miaIntro:"The whole dotted family in one lineup! \u{1F3AF}",
      spec:{rounds:6, pool:[
        {label:"Dotted Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q",dot:true}]}},
        {label:"Dotted Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h",dot:true}]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"Eighth Note", spec:{clef:"treble",notes:[{p:"B4",d:"8"}]}},
        {label:"Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h"}]}}]},
      result:(score)=>score>=5?"Every dot accounted for!":null }
  ],
  practiceIntro:"20 practice questions — dot math, the LONG–short pattern, and 1½-beat counting. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["q","q.","8","h."], ask:"beats"}, count:4 },
    { gen:"note-value", params:{values:["q","q.","8","h","h."], ask:"name"}, count:3 },
    { gen:"measure-complete", params:{beats:4}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { type:"mc", q:"A dotted quarter note lasts…", choices:["1½ beats","2 beats","1 beat"], answer:0,
      explain:"1 + ½ = 1½." },
    { type:"mc", q:"The dot on a quarter note adds…", choices:["½ beat","1 beat","1½ beats"], answer:0,
      explain:"Half of the quarter's 1 beat = ½." },
    { type:"truefalse", q:"A dotted quarter note is usually followed by an eighth note.", answer:true,
      explain:"The famous pair — together exactly 2 beats." },
    { type:"mc", q:"Dotted quarter + eighth =", choices:["2 beats","1½ beats","3 beats"], answer:0,
      explain:"1½ + ½ = 2." },
    { type:"mc", q:"The pair is counted…", choices:["“1-and-2, and”","“1, 2, 3”","“1-e-and-a”"], answer:0,
      explain:"Hold through “1-and-2”; the eighth lands on the “and” of beat 2." },
    { type:"truefalse", q:"A dotted quarter equals three eighth notes.", answer:true,
      explain:"½ × 3 = 1½." },
    { type:"truefalse", q:"The dot always adds exactly one beat.", answer:false,
      explain:"It adds HALF the note's own value — ½ here, 1 on a half note." },
    { type:"mc", q:"In the LONG–short pattern, the LONG note is…", choices:["the dotted quarter","the eighth","the quarter"], answer:0,
      explain:"1½ beats vs ½ — the dot wins." },
    { type:"truefalse", q:"Dotted half = 3 beats, dotted quarter = 1½ beats — the same rule at two sizes.", answer:true,
      explain:"Add half the original: 2+1=3, 1+½=1½." },
    { type:"mc", q:"Which pattern would you count “1-and-2, and”?", choices:["dotted quarter + eighth","two half notes","four quarters"], answer:0,
      explain:"The signature LONG–short cell." }
  ],
  miaQuizIntro:"Quiz time! 1 + ½ = 1½ — hold the long, snap the short, and go!",
  quiz:[
    { type:"mc", q:"How many beats does a dotted quarter note receive?", choices:["1","1½","2","3"], answer:1,
      explain:"1 + ½ = 1½ beats.", hint:"The dot adds half." },
    { type:"mc", q:"A dotted quarter note equals:", choices:["One quarter note","One half note","Three eighth notes","Four eighth notes"], answer:2,
      explain:"½ + ½ + ½ = 1½.", hint:"Count in halves." },
    { type:"mc", q:"A dot adds:", choices:["One beat","Half of the note's original value","Two beats","One quarter beat"], answer:1,
      explain:"Always proportional.", hint:"The rule from Lesson 12." },
    { type:"truefalse", q:"A dotted quarter note lasts 1½ beats.", answer:true,
      explain:"1 + ½ = 1½.", hint:"Do the math." },
    { type:"truefalse", q:"A dotted quarter note is usually followed by an eighth note.", answer:true,
      explain:"The famous pair, totaling 2 beats.", hint:"LONG–short." },
    { type:"truefalse", q:"A dot always doubles the value of a note.", answer:false,
      explain:"It adds HALF, never doubles.", hint:"1 becomes 1½, not 2." },
    { type:"mc", q:"Which note is worth 1½ beats?",
      staff:{clef:"treble",notes:[{p:"B4",d:"q",label:"1"},{p:"B4",d:"q",dot:true,label:"2"},{p:"B4",d:"8",label:"3"}],width:340},
      choices:["1","2","3"], answer:1,
      explain:"Number 2 wears the dot — 1 + ½ = 1½.", hint:"Find the dot." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Quarter → 1 · Eighth → ½ · Dotted Quarter → 1½",
               "Quarter → ½ · Eighth → 1 · Dotted Quarter → 2",
               "Quarter → 1 · Eighth → 1 · Dotted Quarter → 3"], answer:0,
      explain:"1, ½, and 1+½.", hint:"The dot adds half." },
    { type:"mc", q:"A dotted quarter note lasts ____ beats.", choices:["1","1½","2"], answer:1,
      explain:"One and a half.", hint:"1 + ½." },
    { type:"mc", q:"A dotted quarter note equals ____ eighth notes.", choices:["2","3","4"], answer:1,
      explain:"Three halves = 1½.", hint:"1½ ÷ ½." },
    { type:"mc", q:"Which fills a complete 2-beat cell?",
      choices:["Dotted Quarter + Eighth","Dotted Quarter + Quarter","Eighth + Eighth"], answer:0,
      explain:"1½ + ½ = 2 ✓. (1½+1 = 2½; ½+½ = 1.)", hint:"Total exactly 2." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A dotted quarter note lasts one beat","A dotted quarter note equals three eighth notes","A dotted quarter note lasts two beats","A dotted quarter note is shorter than a quarter note"], answer:1,
      explain:"1½ beats = three eighths — the dot stretched it.", hint:"Count the halves." },
    /* generated */
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:3 },
    { gen:"measure-complete", params:{beats:4}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"In time signatures with 4 as the bottom number, it receives 1½ beats.", term:"Dotted Quarter Note", staff:{clef:"none",notes:[{p:"B4",d:"q",dot:true}],width:140}},
    {def:"Increases the note's duration by half the original value.", term:"Dot", staff:{clef:"none",notes:[{p:"B4",d:"q",dot:true}],width:140}},
    {def:"A two-beat pattern: 1½ + ½, counted “1-and-2, and.”", term:"Dotted Quarter + Eighth", staff:{clef:"none",notes:[{p:"B4",d:"q",dot:true},{p:"B4",d:"8"}],width:150}}
  ],
  mistakes:[],
  summary:[
    "✔ Dotted Quarter Note = <b>1 + ½ = 1½ beats</b>.",
    "✔ Its favorite partner: a single <b>eighth note</b> — together <b>2 beats</b>.",
    "✔ Count the pair <b>“1-and-2, and”</b>: hold through the beat, snap on the off-beat.",
    "✔ Dotted quarter = <b>three eighth notes</b> in length.",
    "✔ The dot rule is universal: <b>always add half the original value</b>."
  ],
  tips:[
    "Say “LOOONG-short” out loud while clapping the pair — exaggerate at first!",
    "The eighth after a dotted quarter often feels like a pickup INTO the next beat — let it lean forward.",
    "See a dot? Pause and do the math before playing: original + half.",
    "\u{1F4E2} Next lesson: Unit 5 opens with DYNAMICS — how loud and soft shape the music!"
  ],
  rewards:{ badge:"Long-Short Rhythm Master", icon:"\u{1F3AF}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — 1½ + ½ = 100%! Unit 4 conquered; Unit 5's expression marks await. \u{1F3AF}\u{1F389}",
  miaPass:"You passed! The LONG–short pattern is in your hands forever. Review below or retry for the sweep.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The dotted-quarter-plus-eighth cell is one of music's most-used rhythms: a 1½-beat hold followed by a quick ½-beat note.",
      play:()=>{const s=.68;[[0,1.5],[1.5,.5],[2,1.5],[3.5,.5]].forEach(([b,l])=>MFAudio.tone(67,l*s*.9,b*s));} },
    learn:{ label:"the dotted quarter",
      explain:"Dot = +half: 1 + ½ = 1½ beats. Pair it with an eighth for exactly 2 beats, counted “1-and-2, and” — LONG then short.",
      hint:"Hold through “1-and-2”; the eighth lands on the “and.”",
      play:()=>{const s=.68;MFAudio.tone(67,1.5*s*.9,0);MFAudio.tone(64,.5*s*.9,1.5*s);} },
    example:{ label:"the examples",
      explain:"Feel the hold-then-snap in example 1, then compare all three 2-beat recipes in example 2." },
    game:{ label:"the games",
      explain:"Spot the dot at speed, tap LONG–short in time, build every 2-beat recipe, and hunt the dotted family.",
      hint:"When tapping: one tap held 1½ beats, then a quick tap." },
    quiz:{ label:"this question",
      explain:"Everything follows from 1 + ½ = 1½ — and the famous pair adding to 2 beats.",
      play:()=>{MFAudio.tone(67,1.0,0);MFAudio.tone(64,.3,1.05);} }
  }
};
