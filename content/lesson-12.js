/* Lesson 12 — Dotted Half Note (AEMT Book 1, Unit 3)
   Built from drafts/UNIT 3 – Lesson 12.md.
   QA note honored: "a dot adds HALF the original value, not one fixed beat" —
   the 2 + 1 = 3 equation repeats across steps, games, practice and quiz.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[12]={
  welcome:"Today a tiny dot does a BIG job. \u{1F50D}",
  hook:{
    say:"Have you ever noticed a little dot next to a note? That tiny dot has a big job! Press play — same half note, first plain, then <b>with a dot</b>. What changed?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="hk-staff"></div>
          <div style="text-align:center"><button class="play hk-play">▶ Plain… then dotted</button></div>
          <div class="choices hk-ch" style="display:none"><button>It got LOUDER</button><button>It got LONGER</button><button>It got higher</button></div>`;
        Staff.render(container.querySelector(".hk-staff"),{clef:"treble",notes:[{p:"G4",d:"h",label:"half note"},{p:"G4",d:"h",dot:true,label:"dotted half note"}],width:340});
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/80;
          for(let k=0;k<2;k++) MFAudio.click(k*spb,.4,k===0);
          MFAudio.tone(67,2*spb*.95,0);
          for(let k=0;k<3;k++) MFAudio.click((3+k)*spb,.4,k===0);
          MFAudio.tone(67,3*spb*.95,3*spb);
          setTimeout(()=>{ ch.style.display=""; },6*spb*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ LONGER — two beats became THREE. That's the dot's whole job: it stretches the note!");
          else fb(false,"Same pitch, same volume — listen to how LONG each one rings.");
        });
      } }
  },
  objectives:[
    "Explain what a dot does to a note",
    "Calculate the value of a dotted half note",
    "Count a dotted half note correctly",
    "Recognize dotted half notes in 3/4 time",
    "Compare a dotted half note with three quarter notes",
    "Perform rhythms containing dotted half notes"
  ],
  steps:[
    { say:"The rule: <b>a dot adds HALF of the note's original value</b>. Half note = 2 beats. Half of 2 = 1. So: <b>2 + 1 = 3 beats</b>. A <b>Dotted Half Note</b> lasts <b>3 beats</b>. \u{1F447} <b>What does a dot add to a note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"h",label:"2 beats"},{p:"B4",d:"h",dot:true,label:"2 + 1 = 3 beats"}],width:340} },
      try:{ type:"mc",
        choices:["Half of the note's own value","Always exactly 1 beat","It doubles the note"], answer:0,
        success:"✓ The dot adds HALF of whatever the note is worth — for a half note that's 1 more beat: 2 + 1 = 3.",
        fail:"Careful — the dot is proportional, not fixed. It adds HALF of the note's own value.",
        hint:"2 + 1 = 3. Where did the 1 come from?" } },
    { say:"Add the dot yourself! \u{1F447} <b>Click the dot button to attach it — then listen to the note grow:</b>",
      try:{ type:"custom",
        hint:"Watch the count: 2 beats before the dot, 3 after.",
        mount:(container,fb)=>{
          let dotted=false;
          container.innerHTML=`<div class="ad-staff"></div>
            <div style="text-align:center"><button class="play ad-dot">\u{2795} Add the dot</button>
            <button class="play ad-play">▶ Play it</button></div>
            <div class="big-q ad-q" style="text-align:center"></div>`;
          const st=container.querySelector(".ad-staff"), q=container.querySelector(".ad-q");
          function draw(){
            Staff.render(st,{clef:"treble",notes:[{p:"G4",d:"h",dot:dotted,label:dotted?"2 + 1 = 3 beats":"2 beats"}],width:280});
            q.textContent=dotted?"Dotted Half Note — 3 beats!":"Half Note — 2 beats";
          }
          container.querySelector(".ad-dot").onclick=function(){
            if(dotted) return;
            dotted=true; this.disabled=true; MFAudio.yay(); draw();
            fb(true,"✓ Dot attached! The half note just grew from 2 beats to 3. Press ▶ to hear the difference.");
          };
          container.querySelector(".ad-play").onclick=()=>{
            const spb=60/80, n=dotted?3:2;
            for(let k=0;k<n;k++) MFAudio.click(k*spb,.4,k===0);
            MFAudio.tone(67,n*spb*.95,0);
          };
          draw();
        } } },
    { say:"Count it: hold the dotted half note through <b>ONE-two-three</b>. \u{1F447} <b>Press play, count the clicks while it rings, then answer:</b>",
      try:{ type:"custom",
        hint:"Count only the clicks that sound WHILE the note is still ringing.",
        mount:(container,fb)=>{
          let played=false;
          container.innerHTML=`<div class="bc-staff"></div>
            <div style="text-align:center"><button class="play bc-play">▶ Play with the beat</button></div>
            <div class="choices chips bc-ch"></div>`;
          Staff.render(container.querySelector(".bc-staff"),{clef:"treble",time:"3/4",notes:[{p:"G4",d:"h",dot:true},{bar:"final"}],width:280});
          const ch=container.querySelector(".bc-ch");
          [2,3,4].forEach(n=>{
            const b=document.createElement("button"); b.textContent=n;
            b.onclick=()=>{
              if(!played){ fb(false,"Play it first and count the clicks!"); return; }
              if(n===3){ ch.style.display="none";
                fb(true,"✓ THREE beats — the dotted half note fills an entire 3/4 measure with one single sound!"); }
              else fb(false,"Count again: the note keeps ringing… how many clicks fit inside it?");
            };
            ch.appendChild(b);
          });
          container.querySelector(".bc-play").onclick=()=>{
            const spb=60/80;
            for(let k=0;k<3;k++) MFAudio.click(k*spb,.5,k===0);
            MFAudio.tone(67,3*spb*.95,0);
            played=true;
          };
        } } },
    { say:"Dotted half note vs three quarter notes — SAME total time, different slicing. \u{1F447} <b>Which lasts longer?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"h",dot:true,label:"1 sound, 3 beats"},{p:"B4",d:"q",label:"1"},{p:"B4",d:"q",label:"2"},{p:"B4",d:"q",label:"3"}],width:420} },
      try:{ type:"mc",
        choices:["They last the SAME — 3 beats each","The dotted half lasts longer","The three quarters last longer"], answer:0,
        success:"✓ Equal! One long sound or three short ones — both fill exactly 3 beats.",
        fail:"Add them up: dot = 2+1 = 3; quarters = 1+1+1 = 3.",
        hint:"Do the beat math on both sides." } },
    { say:"Now build! A 3/4 measure holds 3 beats — and today you have a NEW brick. \u{1F447} <b>Fill the measure THREE different ways:</b>",
      try:{ type:"custom",
        hint:"Dotted Half (3) alone · Half (2) + Quarter (1) · three Quarters.",
        mount:(container,fb)=>{
          const BT=[{t:"D",label:"Dotted Half Note",beats:3,item:{p:"B4",d:"h",dot:true}},
                    {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}},
                    {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}];
          let cur=[],sum=0,found=[],doneItems=[];
          container.innerHTML=`<div class="b3-staff"></div><div class="big-q b3-q" style="text-align:center"></div>
            <div class="choices b3-ch"></div>`;
          const st=container.querySelector(".b3-staff"), q=container.querySelector(".b3-q"), ch=container.querySelector(".b3-ch");
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
            Staff.render(st,{clef:"treble",time:"3/4",notes:items,width:470});
            q.textContent=`Beats: ${sum} of 3 · Ways found: ${found.length} of 3`;
          }
          function add(bt){
            if(sum+bt.beats>3){ fb(false,`Too many — that would make ${sum+bt.beats}. The container holds exactly 3!`); return; }
            cur.push(bt); sum+=bt.beats; MFAudio.tone(71,bt.beats*.4); draw();
            if(sum===3){
              const key=cur.map(x=>x.t).sort().join("");
              if(found.includes(key)){ fb(false,"Already found that way — clear and discover another!"); cur=[];sum=0; setTimeout(draw,900); return; }
              found.push(key);
              let t=0; cur.forEach(bt=>{ MFAudio.tone(71,bt.beats*.45,t); t+=bt.beats*.5; });
              doneItems.push(...cur.map(bt=>bt.item), {bar:"single"});
              cur=[]; sum=0; draw();
              if(found.length>=3){ ch.style.display="none"; q.textContent="All three ways found!";
                fb(true,"✓ Dotted half · half+quarter · three quarters — every way to fill 3/4. The dotted half does it with ONE sound!"); }
              else fb(true,`✓ Exactly 3 beats — it stays on the staff. ${3-found.length} more way${3-found.length>1?"s":""} to find…`);
            }
          }
          draw();
        } } },
    { say:"Read a 3/4 line that uses the dotted half. Count: <b>1-2-3 held</b>, then quarters. \u{1F447}",
      try:{ type:"custom",
        hint:"The dotted half rings through all three counts of its measure.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"3/4",tempo:100,
            notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{bar:"single"},{p:"E4",d:"h",dot:true,label:"1-2-3"},{bar:"final"}],width:420};
          container.innerHTML=`<div class="rd-staff"></div><div style="text-align:center"><button class="play rd-play">▶ Play & count along</button></div>`;
          const api=Staff.render(container.querySelector(".rd-staff"),spec);
          container.querySelector(".rd-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ Quarters walking, then one dotted half SINGING through the whole measure — classic 3/4!"),total*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"The dotted half note fills a whole 3/4 measure: hold it through ONE-two-three.",
      staff:{clef:"treble",tempo:100,time:"3/4",notes:[{p:"G4",d:"h",dot:true,label:"1-2-3"},{bar:"single"},{p:"E4",d:"q",label:"1"},{p:"F4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{bar:"single"},{p:"C4",d:"h",dot:true,label:"1-2-3"},{bar:"final"}],width:460} },
    { caption:"2 + 1 = 3: a half note plus a quarter note fills one measure — the dotted half note fills the next in a single sound.",
      staff:{clef:"treble",tempo:100,time:"3/4",notes:[{p:"D4",d:"h",label:"1-2"},{p:"D4",d:"q",label:"3"},{bar:"single"},{p:"D4",d:"h",dot:true,label:"1-2-3"},{bar:"final"}],width:420} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Dot Flash",
      intro:"Whole? Half? Dotted half? Quarter? The dot is tiny — spot it FAST! 10 rounds.",
      miaIntro:"Game time — don't let that little dot sneak past you! \u{1F50D}",
      spec:{rounds:10, ask:"name", values:["h","h.","q","w"]},
      result:(score)=>score>=9?"No dot escapes your eyes now!":null },
    { type:"rhythm-tap", title:"Game 2 · 3/4 Tap with Dots",
      intro:"Tap 3/4 rhythms — including the loooong dotted half. Hold your tap-hand steady through 3 beats!",
      miaIntro:"One tap can last three whole beats — hold it steady! \u{1F44F}",
      spec:{tempo:100, rounds:3, beatsPerBar:3, patterns:[["h."],["q","q","q"],["h","q"],["q","h"]]},
      result:(score)=>score>=5?"You FELT the 3-beat note — that's the hard part, done!":null },
    { type:"measure-build", title:"Game 3 · Three Ways to Three",
      intro:"Fill the 3/4 measure with exactly 3 beats — find <b>all three</b> combinations, dotted half included!",
      miaIntro:"Builder challenge: three bricks, three ways, three beats! \u{1F3D7}\u{FE0F}",
      spec:{beats:3, unique:true, rounds:3, buttons:[
        {t:"D",label:"Dotted Half Note",beats:3,item:{p:"B4",d:"h",dot:true}},
        {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}},
        {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}]},
      result:(stars)=>stars>=3?"All three ways, no overflow — 3/4 completely conquered!":null },
    { type:"measure-judge", title:"Game 4 · 3/4 Inspector Returns",
      intro:"Complete or incomplete? Now the measures hold 3 beats — and the dot changes the math!",
      miaIntro:"Inspector — the dot makes the maths sneakier. Stay sharp! \u{1F50D}",
      spec:{rounds:8, beats:3},
      result:(score)=>score>=7?"The dot couldn't fool you — inspector level: expert!":null }
  ],
  practiceIntro:"20 practice questions — dot math, dotted half counting, and 3/4 measures. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["h","h.","q","w"], ask:"beats"}, count:4 },
    { gen:"note-value", params:{values:["h","h.","q"], ask:"name"}, count:3 },
    { gen:"measure-complete", params:{beats:3}, count:3 },
    { type:"mc", q:"A dot adds…", choices:["half of the note's original value","exactly one beat, always","a whole beat and a half"], answer:0,
      explain:"Proportional, not fixed: half of whatever the note is worth." },
    { type:"mc", q:"Dotted half note = ____ beats.", choices:["2","3","4"], answer:1,
      explain:"2 + 1 = 3." },
    { type:"truefalse", q:"A dot doubles the value of a note.", answer:false,
      explain:"It adds HALF the value — 2 becomes 3, not 4." },
    { type:"truefalse", q:"A dotted half note fills one complete measure of 3/4 time.", answer:true,
      explain:"3 beats = the whole container, one single sound." },
    { type:"mc", q:"A dotted half note equals…", choices:["three quarter notes","two quarter notes","a whole note"], answer:0,
      explain:"3 beats = 1+1+1." },
    { type:"mc", q:"Half note + dot: where does the extra beat come from?", choices:["half of the half note's 2 beats","the time signature","the next measure"], answer:0,
      explain:"Half of 2 = 1. So 2 + 1 = 3." },
    { type:"truefalse", q:"The dot sits just to the RIGHT of the notehead.", answer:true,
      explain:"A small dot beside the head — easy to miss, big effect!" },
    { type:"mc", q:"In which time signature does the dotted half note fill a whole measure?", choices:["3/4","2/4","4/4"], answer:0,
      explain:"3 beats = one full 3/4 measure." },
    { type:"truefalse", q:"Half note (2) + quarter note (1) lasts the same as a dotted half note.", answer:true,
      explain:"Both total 3 beats — different slicing, same time." },
    { type:"mc", q:"Count a dotted half note in 3/4 as…", choices:["ONE-two-three, held","ONE, then silence","ONE-two, stop"], answer:0,
      explain:"One sound sustained through all three counts." },
    /* — from the unit review sheet — */
    { type:"mc", q:"In 4/4 time, a dotted half note receives ____ beats.", choices:["3","4","2"], answer:0, explain:"2 + 1 = 3 beats — the same value in any time signature." }
  ],
  miaQuizIntro:"Quiz time! Remember the golden equation: 2 + 1 = 3. Go!",
  quiz:[
    { type:"mc", q:"What does a dot do to a note?", choices:["Makes it louder","Adds one beat","Increases its value by half of its original duration","Makes it shorter"], answer:2,
      explain:"The dot adds HALF the note's own value.", hint:"Proportional, not fixed." },
    { type:"mc", q:"How many beats does a dotted half note receive?", choices:["2","3","4","5"], answer:1,
      explain:"2 + 1 = 3 beats.", hint:"The golden equation." },
    { type:"mc", q:"A half note is worth…", choices:["1 beat","2 beats","3 beats","4 beats"], answer:1,
      explain:"Two beats — before any dot.", hint:"Review from Lesson 6." },
    { type:"truefalse", q:"A dotted half note lasts three beats.", answer:true,
      explain:"2 + 1 = 3.", hint:"Add the dot's bonus." },
    { type:"truefalse", q:"A dot doubles the value of a note.", answer:false,
      explain:"It adds HALF — a half note becomes 3 beats, not 4.", hint:"2 + 1, not 2 × 2." },
    { type:"truefalse", q:"A dotted half note fills one complete measure of 3/4 time.", answer:true,
      explain:"3 beats = the whole 3/4 container.", hint:"How many beats in 3/4?" },
    { type:"mc", q:"Which note lasts 3 beats?",
      staff:{clef:"treble",notes:[{p:"B4",d:"h",label:"1"},{p:"B4",d:"h",dot:true,label:"2"},{p:"B4",d:"q",label:"3"}],width:340},
      choices:["1","2","3"], answer:1,
      explain:"Number 2 has the dot — 2 + 1 = 3 beats.", hint:"Find the dot!" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Quarter → 1 · Half → 2 · Dotted Half → 3","Quarter → 2 · Half → 3 · Dotted Half → 4","Quarter → 1 · Half → 3 · Dotted Half → 2"], answer:0,
      explain:"1, 2, and 2+1=3.", hint:"The dot adds half." },
    { type:"mc", q:"A dot adds ____ of the note's original value.", choices:["half","all","a quarter"], answer:0,
      explain:"Half — always proportional.", hint:"The golden rule." },
    { type:"mc", q:"A dotted half note equals ____ beats.", choices:["2","3","4"], answer:1,
      explain:"Three.", hint:"2 + 1." },
    { type:"mc", q:"Which fills one complete measure of 3/4?",
      choices:["Dotted Half Note","Half Note","Quarter + Quarter"], answer:0,
      explain:"3 beats exactly. (Half = 2; two quarters = 2 — both incomplete.)",
      hint:"Which one totals 3?" },
    { type:"mc", q:"Which statement is correct?",
      choices:["A dotted half note lasts two beats","A dot always adds one beat","A dotted half note is equal in duration to three quarter notes","A dotted half note cannot be used in 3/4 time"], answer:2,
      explain:"3 beats = three quarter notes. And 3/4 is its favorite home!",
      hint:"Do the beat math." },
    /* generated */
    { gen:"note-value", params:{values:["h","h.","q"], ask:"beats"}, count:3 },
    { gen:"measure-complete", params:{beats:3}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"A dot after a note increases the note's duration by half the original value.", term:"Dot", staff:{clef:"none",notes:[{p:"B4",d:"h",dot:true}],width:140}},
    {def:"In 3/4 and 4/4 time signatures, it receives 3 beats (2 + 1).", term:"Dotted Half Note", staff:{clef:"none",notes:[{p:"B4",d:"h",dot:true}],width:140}},
    {def:"The length of time a note is held.", term:"Duration"}
  ],
  mistakes:[],
  summary:[
    "✔ A <b>dot</b> adds <b>half of the note's original value</b> — never a fixed beat.",
    "✔ Dotted Half Note = <b>2 + 1 = 3 beats</b>.",
    "✔ It fills one complete <b>3/4 measure</b> with a single sound.",
    "✔ Dotted half = <b>three quarter notes</b> in total time.",
    "✔ Three ways to fill 3/4: <b>♩♩♩ · half+quarter · dotted half</b>."
  ],
  tips:[
    "Whenever you meet a dotted note, say the equation out loud: “2 plus 1 equals 3.”",
    "The dot is proportional — later you'll dot a QUARTER note and get 1½ beats (Lesson 17!).",
    "In 3/4 music, scan for dotted halves first — they mark the calmest measures.",
    "\u{1F517} Next lesson: curved lines that GLUE notes together — ties and slurs!"
  ],
  rewards:{ badge:"Dot Detective", icon:"\u{1F50D}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! 2 + 1 = 3, and you + this lesson = unstoppable. \u{1F50D}\u{1F389}",
  miaPass:"You passed! The dot's secret is yours. Review below or retry for the perfect run.",
  mia:{
    hook:{ label:"the welcome",
      explain:"A dot after a note stretches it by half its own value. Half note (2) + dot (1) = 3 beats.",
      play:()=>{const s=.7;MFAudio.tone(67,2*s*.95,0);MFAudio.tone(67,3*s*.95,2.6*s);} },
    learn:{ label:"the dotted half note",
      explain:"Dot = +half the original value. Half note 2 → dotted half 3. It fills a 3/4 measure alone, and equals three quarter notes.",
      hint:"Say it: 2 + 1 = 3.",
      play:()=>{const s=.6;MFAudio.tone(67,3*s*.95,0);[67,67,67].forEach((m,i)=>MFAudio.tone(m,s*.9,(3.5+i)*s));} },
    example:{ label:"the examples",
      explain:"Hear the dotted half SING through all three counts while the quarters walk — same 3 beats, different characters." },
    game:{ label:"the games",
      explain:"Spot dots at speed, tap 3-beat holds, build all three fillings of 3/4, and inspect sneaky dotted measures.",
      hint:"Always do the beat math: the dot adds half." },
    quiz:{ label:"this question",
      explain:"One rule runs this whole quiz: the dot adds half of the note's own value. 2 + 1 = 3.",
      play:()=>{MFAudio.tone(67,1.8,0);} }
  }
};
