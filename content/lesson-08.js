/* Lesson 8 — 4/4 Time Signature and Note Values (AEMT Book 1, Unit 2)
   Built from the instructor's design document (drafts/UNIT 2 – Lesson 8.md, incl. NotebookLM block)
   QA note honored: "build four beats" repeated in multiple forms (step drill, builder game,
   judge game, generated quiz/practice questions).
   Uses staff.js v4.1 (time signatures incl. Common Time "C"), games.js v4.1 (measure-judge).
   NOTE: edit by FULL-FILE REWRITE only. */

/* tap-along-the-beat activity (unique L8 prefix: safe for check.html batch load) */
function MF_L8_tapBeat(container,fb){
  const tempo=90, spb=60/tempo, total=8;
  let t0=0, taps=[], on=false, timers=[];
  container.innerHTML=`<div class="big-q tb-q" style="text-align:center">Press start, listen to the count-in, then TAP on every beat — 1, 2, 3, 4, 1, 2, 3, 4!</div>
    <div style="text-align:center"><button class="play tb-start">▶ Start the beat</button>
    <button class="play tb-tap" style="display:none;min-width:200px;padding:20px 28px;font-size:1.25rem">\u{1F44F} TAP</button></div>
    <div class="tb-count" style="text-align:center;font-size:2rem;font-weight:800;color:var(--primary);min-height:44px"></div>`;
  const q=container.querySelector(".tb-q"), cnt=container.querySelector(".tb-count"),
        startB=container.querySelector(".tb-start"), tapB=container.querySelector(".tb-tap");
  tapB.onclick=()=>{ if(!on)return; taps.push(performance.now()-t0); MFAudio.click(0,.35); };
  startB.onclick=()=>{
    startB.style.display="none"; taps=[]; timers.forEach(clearTimeout); timers=[];
    MFAudio.ac();
    /* 4 count-in + 8 beats to tap */
    for(let i=0;i<4;i++) MFAudio.click(i*spb,.5,i===0);
    for(let i=0;i<total;i++) MFAudio.click((4+i)*spb,.5,i%4===0);
    t0=performance.now();
    for(let i=0;i<4;i++) timers.push(setTimeout(()=>{cnt.textContent="…"+(i+1);}, i*spb*1000));
    for(let i=0;i<total;i++) timers.push(setTimeout(()=>{cnt.textContent=String(i%4+1);}, (4+i)*spb*1000));
    timers.push(setTimeout(()=>{ tapB.style.display="inline-block"; on=true; q.textContent="TAP with every beat — feel the 4-beat cycle!"; }, Math.max(0,4*spb*1000-500)));
    timers.push(setTimeout(()=>{
      on=false; tapB.style.display="none"; cnt.textContent="";
      const tol=spb*0.45*1000, expected=[];
      for(let i=0;i<total;i++) expected.push((4+i)*spb*1000);
      const used=new Set(); let hits=0;
      expected.forEach(t=>{ let best=-1,bd=1e9;
        taps.forEach((tp,j)=>{ if(used.has(j))return; const d=Math.abs(tp-t); if(d<bd){bd=d;best=j;} });
        if(best>=0&&bd<=tol){ used.add(best); hits++; } });
      startB.style.display="inline-block"; startB.textContent="▶ Try again";
      if(hits>=6) fb(true,`✓ ${hits} of ${total} taps right on the beat — you FEEL 4/4 time now! Notice how beat 1 pulls stronger, like a heartbeat.`);
      else fb(false,`You landed ${hits} of ${total}. No problem — press start again, count OUT LOUD (1-2-3-4), and let the clicks carry you.`);
    }, (4+total)*spb*1000+600));
  };
}

LESSON_CONTENT[8]={
  welcome:"Lesson 8 — the rhythmic roadmap arrives! \u{1F5FA}\u{FE0F}",
  hook:{
    say:"Every piece of music has a rhythm. But how do musicians know how many beats belong in each measure? That's the job of the <b>Time Signature</b>! Press play and count along — <b>which beat feels the strongest?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Feel the beat</button></div>
          <div class="choices hk-ch" style="display:none"><button>Beat 1</button><button>Beat 2</button><button>Beat 3</button><button>Beat 4</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/90;
          for(let i=0;i<8;i++) MFAudio.click(i*spb,i%4===0?.6:.35,i%4===0);
          setTimeout(()=>{ ch.style.display=""; },8*spb*1000+300);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Beat 1! Music in 4/4 pulses in groups of four — STRONG-2-3-4, like a heartbeat. The time signature is what announces those groups.");
          else fb(false,"Listen once more — one beat is louder and pulls the group behind it. Which one starts each cycle?");
        });
      } }
  },
  objectives:[
    "Identify a Time Signature",
    "Explain the meaning of the top and bottom numbers",
    "Recognize Common Time (C)",
    "Count rhythms in 4/4 time",
    "Build complete 4-beat measures",
    "Identify whether a measure is complete or incomplete"
  ],
  steps:[
    /* Step 1 — what the time signature is; top number */
    { say:"At the start of every song sit two numbers — the <b>Time Signature</b>, your rhythmic roadmap. In <b>4/4 time</b>, the <b>TOP number</b> tells you: <b>4 beats in every measure</b>. \u{1F447} <b>What does the TOP number tell you?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[{p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},{p:"F4",d:"q",label:"4"},{bar:"final"}],width:400} },
      try:{ type:"mc",
        choices:["How many beats fit in each measure","Which note gets one beat","How fast to play"], answer:0,
        success:"✓ The top 4 = four beats per measure. Every container in this piece holds exactly four.",
        fail:"The TOP number counts the beats per container.",
        hint:"Top = how many. (Bottom is coming next!)" } },
    /* Step 2 — bottom number */
    { say:"The <b>BOTTOM number</b> answers a different question: <b>which note gets one beat?</b> A bottom <b>4</b> means the <b>Quarter Note</b> is the beat. So 4/4 = four beats per measure, quarter note gets the beat. \u{1F447} <b>In 4/4, which note receives one beat?</b>",
      try:{ type:"mc",
        choices:["The Quarter Note","The Whole Note","The Half Note"], answer:0,
        success:"✓ Bottom 4 = quarter note gets one beat. (So a half note takes 2 of those beats, and a whole note takes all 4!)",
        fail:"Bottom number 4 stands for the QUARTER note.",
        hint:"4 at the bottom → quarter." } },
    /* Step 3 — Common Time */
    { say:"Because 4/4 is <b>the most common time signature in all of music</b>, musicians have a shortcut: a big letter <b>C</b>, called <b>Common Time</b>. Same meaning, different look. \u{1F447} <b>Compare — what does the big C mean?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"C",notes:[{p:"G4",d:"q",label:"1"},{p:"G4",d:"q",label:"2"},{p:"G4",d:"h",label:"3-4"},{bar:"final"}],width:380} },
      try:{ type:"mc",
        choices:["Exactly the same as 4/4","A different, faster meter","“Coda” — jump to the end"], answer:0,
        success:"✓ C = Common Time = 4/4. Two symbols, one meaning!",
        fail:"The big C is just 4/4 written with a different symbol.",
        hint:"C stands for Common Time." } },
    /* Step 4 — count the beat (Activity 1: tap rhythm) */
    { say:"Time to FEEL it. 4/4 pulses like a heartbeat: <b>1 - 2 - 3 - 4</b>, over and over. \u{1F447} <b>Tap along with the metronome:</b>",
      try:{ type:"custom",
        hint:"Count out loud with the clicks — the accented click is always beat 1.",
        mount:(container,fb)=>MF_L8_tapBeat(container,fb) } },
    /* Step 5 — complete or not? (Activity 3) */
    { say:"A 4/4 measure MUST add up to exactly 4 beats — no more, no less. Be the inspector! \u{1F447} <b>Complete or incomplete?</b>",
      try:{ type:"custom",
        hint:"Add every note: whole = 4, half = 2, quarter = 1. Compare the total to the top number.",
        mount:(container,fb)=>{
          const rounds=[
            {toks:["h","q","q"],complete:true},{toks:["q","q","q"],complete:false},
            {toks:["w"],complete:true},{toks:["h","q"],complete:false},{toks:["q","q","h"],complete:true}];
          const B={w:4,h:2,q:1};
          let i=0;
          container.innerHTML=`<div class="big-q cn-q" style="text-align:center"></div><div class="cn-staff"></div>
            <div class="choices cn-ch"><button>✓ Complete (4 beats)</button><button>✗ Incomplete</button></div>`;
          const q=container.querySelector(".cn-q"), st=container.querySelector(".cn-staff"), ch=container.querySelector(".cn-ch");
          function ask(){
            Staff.render(st,{clef:"treble",time:"4/4",notes:[...rounds[i].toks.map(d=>({p:"B4",d})),{bar:"final"}],width:320});
            q.textContent=`Measure ${i+1} of ${rounds.length}: complete or incomplete?`;
          }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[i], said=bi===0, ok=said===cur.complete;
            const sum=cur.toks.reduce((s,d)=>s+B[d],0);
            const mathTxt=cur.toks.map(d=>B[d]).join(" + ")+" = "+sum;
            if(ok){ MFAudio.yay(); i++;
              if(i>=rounds.length){ ch.style.display="none"; q.textContent="Inspection complete!";
                fb(true,"✓ All five inspected correctly! You can spot a missing beat from across the room."); }
              else { fb(true,`✓ Right — ${mathTxt}${cur.complete?", exactly full!":", so it's missing "+(4-sum)+"."} Next measure…`); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,`Add it up: ${mathTxt} — ${cur.complete?"that IS exactly 4.":"that's not 4 yet."} Try again.`); }
          });
          ask();
        } } },
    /* Step 6 — build measures (Activity 2, QA: repeated build practice).
       Options drawn as notation CARDS per instructor sketch — incl. a CLEF trap card. */
    { say:"Now BUILD. Fill the 4/4 measure with exactly <b>4 beats</b> — then do it again a <b>different</b> way. Click the note cards below. (Careful — one card is not a note value at all!) \u{1F447}",
      try:{ type:"custom",
        hint:"Whole = 4, Half = 2, Quarter = 1 — total must be exactly 4. And a clef has no beats!",
        mount:(container,fb)=>{
          const B={w:4,h:2,q:1};
          let cur=[],sum=0,found=[],doneItems=[];
          container.innerHTML=`<div class="bf-staff"></div>
            <div class="big-q bf-q" style="text-align:center"></div>
            <div class="bf-cards" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px"></div>
            <div style="text-align:center;margin-top:8px"><button class="ghost bf-clear">↺ Clear</button></div>`;
          const st=container.querySelector(".bf-staff"), q=container.querySelector(".bf-q"),
                grid=container.querySelector(".bf-cards");
          function draw(){
            const items=[...doneItems,...cur.map(d=>({p:"B4",d}))];
            if(found.length>=2&&items.length&&items[items.length-1].bar==="single") items[items.length-1]={bar:"final"};
            for(let m=found.length;m<2;m++) items.push({bar: m===1? "final":"single"});
            Staff.render(st,{clef:"treble",time:"4/4",notes:items,width:440});
            q.textContent=`Beats: ${sum} of 4 · Measures built: ${found.length} of 2`;
          }
          function add(v){
            if(sum+B[v]>4){ fb(false,`That would make ${sum+B[v]} beats — the top number says exactly 4! Clear or choose smaller.`); return; }
            cur.push(v); sum+=B[v]; MFAudio.tone(71,B[v]*.4); draw();
            if(sum===4){
              const key=cur.slice().sort().join("");
              if(found.includes(key)){ fb(false,"Same combination as before — clear and build a DIFFERENT one!"); cur=[];sum=0; setTimeout(draw,900); return; }
              found.push(key);
              let t=0; cur.forEach(d=>{ MFAudio.tone(71,B[d]*.45,t); t+=B[d]*.5; });
              doneItems.push(...cur.map(d=>({p:"B4",d})), {bar:"single"});
              cur=[]; sum=0; draw();
              if(found.length>=2){ grid.style.display="none"; container.querySelector(".bf-clear").style.display="none";
                q.textContent="Two measures composed!";
                fb(true,"✓ Two different complete measures — the top number is satisfied, and so is Mia!"); }
              else fb(true,"✓ Exactly 4 beats — it stays on the staff as measure 1. Now build a DIFFERENT combination…");
            }
          }
          const CARDS=[["A","Whole","w",[{p:"B4",d:"w"}]],
                       ["B","Half","h",[{p:"B4",d:"h"}]],
                       ["C","Quarter","q",[{p:"B4",d:"q"}]],
                       ["D","Clef",null,[]]];
          CARDS.forEach(([L,name,v,notes])=>{
            const bcard=document.createElement("button");
            bcard.className="notecard";
            bcard.style.cssText="border-radius:10px;padding:8px 10px;min-width:118px";
            const tag=document.createElement("div"); tag.style.cssText="font-weight:800;font-size:12px;color:var(--muted)"; tag.textContent=L;
            const dd=document.createElement("div");
            const nm=document.createElement("div"); nm.style.cssText="font-weight:800;color:var(--primary)"; nm.textContent=name;
            bcard.appendChild(tag); bcard.appendChild(dd); bcard.appendChild(nm);
            Staff.render(dd,{clef:"treble",notes,width:110});
            bcard.onclick=()=>{ if(v) add(v);
              else { MFAudio.tone(40,.25); fb(false,"That's the CLEF — it names the notes but has NO duration, so it can't fill any beats. Pick a note value!"); } };
            grid.appendChild(bcard);
          });
          container.querySelector(".bf-clear").onclick=()=>{ cur=[];sum=0;draw(); };
          draw();
        } } }
  ],
  examples:[
    { caption:"4/4 in action — count 1, 2, 3, 4 in every measure. The time signature promises each container holds four.",
      staff:{clef:"treble",tempo:90,time:"4/4",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{p:"E4",d:"q",label:"4"},{bar:"single"},{p:"F4",d:"h",label:"1-2"},{p:"D4",d:"h",label:"3-4"},{bar:"final"}],width:440} },
    { caption:"The same rhythm written with the big C — Common Time. It sounds IDENTICAL, because C simply means 4/4.",
      staff:{clef:"treble",tempo:90,time:"C",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{p:"E4",d:"q",label:"4"},{bar:"single"},{p:"F4",d:"h",label:"1-2"},{p:"D4",d:"h",label:"3-4"},{bar:"final"}],width:440} }
  ],
  games:[
    { type:"rhythm-tap", title:"Game 1 · Tap in 4/4",
      intro:"Listen to a full 4/4 measure, then <b>tap it back in time</b>. The count-in is your best friend — 1, 2, 3, 4, GO!",
      miaIntro:"Time to make the time signature physical — tap those measures back! \u{1F44F}",
      spec:{tempo:90, rounds:3, patterns:[["q","q","q","q"],["h","q","q"],["q","q","h"],["h","h"],["w"]]},
      result:(score)=>score>=8?"Right on the beat, measure after measure — 4/4 lives in your hands now!":null },
    { type:"measure-judge", title:"Game 2 · Complete or Not?",
      intro:"You're the measure inspector: does each measure hold exactly <b>4 beats</b>? Judge fast — 8 rounds.",
      miaIntro:"Inspector Mia needs a deputy. Check every container for missing beats! \u{1F50D}",
      spec:{rounds:8, beats:4},
      result:(score)=>score>=7?"Seven or more — no incomplete measure escapes your eyes!":null },
    { type:"measure-build", title:"Game 3 · Four-Beat Builder",
      intro:"The classic challenge: there are <b>four different ways</b> to fill a 4/4 measure with whole, half, and quarter notes. Find them ALL!",
      miaIntro:"Builder time again — the top number demands exactly four! \u{1F3D7}\u{FE0F}",
      spec:{beats:4, unique:true},
      result:(stars)=>stars>=3?"All four combinations, zero overflow — master builder of Common Time!":null },
    { type:"symbol-hunt", title:"Game 4 · Find the Time Signature",
      intro:"Click the symbol Mia names — <b>4/4</b>, <b>Common Time</b>, clefs, bars… can you tell them apart at a glance?",
      miaIntro:"Last game! 4/4 and its shorthand C are hiding among the other symbols. \u{1F3AF}",
      spec:{rounds:6, pool:[
        {label:"4/4 Time Signature", spec:{clef:"treble",time:"4/4",notes:[]}},
        {label:"Common Time (C)", spec:{clef:"treble",time:"C",notes:[]}},
        {label:"Treble Clef", spec:{clef:"treble",notes:[]}},
        {label:"Double Bar", spec:{clef:"treble",notes:[{bar:"final"}]}},
        {label:"Whole Note", spec:{clef:"treble",notes:[{p:"B4",d:"w"}]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}}]},
      result:(score)=>score>=5?"Sharp! You can spot Common Time in a crowd.":null }
  ],
  practiceIntro:"20 practice questions — top and bottom numbers, Common Time, complete measures, and beat math. Answer right and the next appears automatically!",
  practice:[
    { gen:"measure-complete", params:{beats:4}, count:4 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"measure-count", params:{min:2,max:4}, count:2 },
    { type:"mc", q:"The TOP number of a time signature tells you…", choices:["how many beats per measure","which note gets one beat","the speed of the piece"], answer:0,
      explain:"Top = how many beats fit in each measure." },
    { type:"mc", q:"The BOTTOM number of a time signature tells you…", choices:["which note value receives one beat","how many measures the piece has","how loud to play"], answer:0,
      explain:"Bottom = which note is the beat. A bottom 4 = quarter note." },
    { type:"mc", q:"The big letter C at the start of a staff means…", choices:["Common Time — the same as 4/4","the note C","Coda"], answer:0,
      explain:"C = Common Time = 4/4. Identical meaning." },
    { type:"truefalse", q:"In 4/4, a Whole Note fills an entire measure.", answer:true,
      explain:"4 beats — exactly what the top number demands." },
    { type:"truefalse", q:"4/4 is the most common time signature in music.", answer:true,
      explain:"That's exactly why its shortcut is called COMMON time." },
    { type:"mc", q:"In 4/4, which is an INCOMPLETE measure?", choices:["Quarter + Quarter + Quarter","Half + Half","Whole"], answer:0,
      explain:"1+1+1 = only 3 beats — one short of the promised 4." },
    { type:"truefalse", q:"The top and bottom numbers of a time signature mean the same thing.", answer:false,
      explain:"Top = how many beats; bottom = which note gets the beat. Different jobs!" },
    { type:"mc", q:"In 4/4 time, a Half Note lasts…", choices:["2 of the 4 beats","all 4 beats","half a beat"], answer:0,
      explain:"The quarter gets 1 beat, so the half note takes 2 of them." },
    { type:"truefalse", q:"Counting in 4/4 goes “1 - 2 - 3 - 4” in every measure.", answer:true,
      explain:"Like a heartbeat — and beat 1 feels the strongest." },
    /* — from the unit review sheet — */
    { type:"mc", q:"When a time signature contains a 4 as the TOP number, it means…", choices:["4 beats in each measure","the quarter note receives one beat","4 measures per line"], answer:0, explain:"The top number counts the beats per measure." },
    { type:"mc", q:"When a time signature contains a 4 as the BOTTOM number, it means…", choices:["a quarter note receives one beat","4 beats in each measure","play at a moderate tempo"], answer:0, explain:"The bottom number names the note that receives one beat." }
  ],
  miaQuizIntro:"Quiz time! Top number, bottom number, the big C, and plenty of beat math. Count like a heartbeat — go!",
  quiz:[
    /* draft Q1–Q12, adapted */
    { type:"mc", q:"In 4/4 Time, how many beats are in each measure?", choices:["2","3","4","8"], answer:2,
      explain:"The top number says 4 — four beats per measure.", hint:"Look at the TOP number." },
    { type:"mc", q:"In 4/4 Time, which note receives one beat?", choices:["Whole Note","Half Note","Quarter Note","Eighth Note"], answer:2,
      explain:"The bottom 4 stands for the quarter note.", hint:"Look at the BOTTOM number." },
    { type:"mc", q:"What does the TOP number tell us?", choices:["Which note receives one beat","How many beats are in each measure","How many notes are in a song","How fast to play"], answer:1,
      explain:"Top = beats per measure.", hint:"How many fit in the container?" },
    { type:"mc", q:"What does the BOTTOM number tell us?", choices:["The number of measures","Which note value receives one beat","The tempo","The key signature"], answer:1,
      explain:"Bottom = which note is the beat (4 = quarter note).", hint:"Which note is the heartbeat?" },
    { type:"truefalse", q:"A Whole Note fills an entire measure in 4/4 Time.", answer:true,
      explain:"4 beats = the whole container.", hint:"How many beats does a whole note get?" },
    { type:"truefalse", q:"The top number tells us which note receives one beat.", answer:false,
      explain:"That's the BOTTOM number's job — the top counts beats per measure.", hint:"Careful — the two numbers have different jobs." },
    { type:"mc", q:"Which of these means COMMON TIME?", choices:["A large letter C at the start of the staff","The numbers 3/4","A double bar line","The treble clef"], answer:0,
      explain:"The big C is the shortcut for 4/4 — Common Time.", hint:"It's a letter, not a number." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Top number → beats per measure · Bottom number → note that gets one beat · C → Common Time (4/4)",
               "Top number → note that gets one beat · Bottom number → beats per measure · C → Coda",
               "Top number → tempo · Bottom number → measures · C → the note C"], answer:0,
      explain:"Top counts the beats, bottom names the beat note, C = Common Time.",
      hint:"Remember each number's job." },
    { type:"mc", q:"In 4/4 Time there are ____ beats in each measure.", choices:["2","3","4","8"], answer:2,
      explain:"Four — the top number promises it.", hint:"4/4: the first 4." },
    { type:"mc", q:"The ____ Note receives one beat in 4/4 Time.", choices:["Whole","Half","Quarter","Eighth"], answer:2,
      explain:"Bottom number 4 = quarter note gets the beat.", hint:"4/4: the second 4." },
    { type:"mc", q:"Which of these fills one complete measure in 4/4?",
      choices:["Half + Quarter + Quarter","Quarter + Quarter + Quarter","Half + Quarter"], answer:0,
      explain:"2+1+1 = 4 ✓. The others total 3 — incomplete.",
      hint:"Add each list — which reaches exactly 4?" },
    { type:"mc", q:"Which measure is NOT complete in 4/4 Time?",
      choices:["Whole Note","Half + Half","Quarter + Quarter + Quarter","Half + Quarter + Quarter"], answer:2,
      explain:"1+1+1 = 3 beats — one beat short. All the others total exactly 4.",
      hint:"One of these only reaches 3." },
    /* generated — fresh every attempt */
    { gen:"measure-complete", params:{beats:4}, count:3 },
    { gen:"rhythm-count", params:{values:["w","h","q"],maxNotes:2}, count:2 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"measure-count", params:{min:2,max:4}, count:1 }
  ],
  vocabulary:[
    {def:"Appears at the beginning of the music after the clef sign. It contains two numbers.", term:"Time Signature", staff:{clef:"none",time:"4/4",notes:[],width:140}},
    {def:"Tells how many beats are in each measure.", term:"Top Number"},
    {def:"Indicates what type of note receives 1 beat.", term:"Bottom Number"},
    {def:"The sign C — it means the same as 4/4 time.", term:"Common Time", staff:{clef:"none",time:"C",notes:[],width:140}}
  ],
  mistakes:[
    "<b>Swapping the two numbers</b> — top counts the beats, bottom names the beat note.",
    "<b>Reading C as the note C</b> — at the start of the staff it means Common Time (4/4).",
    "<b>Accepting 3-beat measures in 4/4</b> — every measure must total exactly 4.",
    "<b>Overfilling a measure</b> — 5 beats is just as wrong as 3.",
    "<b>Counting 1-2-3-4 without an accent</b> — beat 1 is the strong one; feel the cycle."
  ],
  summary:[
    "✔ The <b>Time Signature</b> is the rhythmic roadmap at the start of the staff.",
    "✔ <b>Top number</b> = beats per measure; <b>bottom number</b> = which note gets one beat.",
    "✔ <b>4/4</b>: four beats per measure, quarter note gets the beat.",
    "✔ The big <b>C</b> = <b>Common Time</b> = exactly 4/4.",
    "✔ Every measure must be <b>complete</b> — beats adding up to the top number."
  ],
  tips:[
    "Read a time signature like a sentence: “FOUR beats per measure, QUARTER note gets the beat.”",
    "When a measure looks suspicious, add the beats out loud — inspector style.",
    "Beat 1 is home base. If you get lost while counting, listen for the strong pulse and restart there.",
    "\u{1F5FA}\u{FE0F} Next lesson: silence gets its own symbols — whole, half, and quarter RESTS!"
  ],
  rewards:{ badge:"Common Time Keeper", icon:"\u{1F552}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score! Top number, bottom number, the big C — the rhythmic roadmap is yours. See you among the rests! \u{1F552}\u{1F389}",
  miaPass:"You passed! 4/4 is officially your home meter. Review below or go for the perfect run — fresh questions every time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Music pulses in repeating groups. The time signature announces the group size — in 4/4, count 1-2-3-4 with a strong beat 1.",
      play:()=>{const s=.65;for(let i=0;i<8;i++) MFAudio.click(i*s,i%4===0?.6:.35,i%4===0);} },
    learn:{ label:"the time signature",
      explain:"Top number: how many beats per measure. Bottom number: which note gets one beat (4 = quarter). Big C = Common Time = 4/4. Every measure must total the top number exactly.",
      hint:"Say it as a sentence: “four beats per measure, quarter note gets the beat.”",
      play:()=>{const s=.6;[60,64,67,64].forEach((m,i)=>MFAudio.tone(m,s*.9,i*s));} },
    example:{ label:"the examples",
      explain:"Both examples are the SAME rhythm — one written 4/4, one written C. Common Time is just 4/4 written with a different symbol." },
    game:{ label:"the games",
      explain:"Tap full measures, inspect for missing beats, build every 4-beat combination, and hunt the symbols.",
      hint:"Everything comes back to one rule: the beats in a measure must total the top number." },
    quiz:{ label:"this question",
      explain:"Two jobs to remember: TOP counts beats per measure, BOTTOM names the beat note. And C is 4/4 — always.",
      play:()=>{MFAudio.click(0,.5,true);MFAudio.click(.6,.35);MFAudio.click(1.2,.35);MFAudio.click(1.8,.35);} }
  }
};
