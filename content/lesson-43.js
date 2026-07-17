/* Lesson 43 — 3/8 and 6/8 Time Signatures (AEMT Book 2, Unit 11)
   Built from drafts/UNIT 11 – Lessons 43 & 44.md; AEMT p.68 verified by render.
   Core: bottom 8 = the EIGHTH note gets the beat. 3/8 = 3 eighth-beats;
   6/8 = 6 eighth-beats felt as two groups of 3; dotted quarter = 3 beats.
   NOTE: edit by FULL-FILE REWRITE only. */

/* beat-unit converter: value chart quiz for bottom-8 meters */
function MF_L43_chart(container,fb){
  const ROUNDS=[
    {q:"In 3/8 or 6/8, an EIGHTH note (or eighth rest) receives…",opts:["1 beat","½ beat","2 beats"],a:0,exp:"Bottom 8: the eighth note IS the beat."},
    {q:"A QUARTER note in 3/8 or 6/8 receives…",opts:["2 beats","1 beat","3 beats"],a:0,exp:"Two eighths' worth = 2 beats."},
    {q:"A DOTTED QUARTER note receives…",opts:["3 beats","2 beats","1½ beats"],a:0,exp:"2 + 1 = 3 eighth-beats — a full 3/8 measure!"},
    {q:"In 6/8 ONLY: a dotted half note (or whole rest) receives…",opts:["6 beats","4 beats","3 beats"],a:0,exp:"The full six — one whole 6/8 measure."}];
  let i=0;
  container.innerHTML=`<div class="big-q l43-cq" style="text-align:center"></div><div class="choices chips l43-cch"></div>`;
  const q=container.querySelector(".l43-cq"), ch=container.querySelector(".l43-cch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Chart ${i+1} of ${ROUNDS.length}: ${cur.q}`;
    ch.innerHTML="";
    cur.opts.map((o,oi)=>({o,oi})).sort(()=>Math.random()-.5).forEach(({o,oi})=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const c=ROUNDS[i];
        if(oi===c.a){ i++; MFAudio.yay();
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="Value chart mastered!";
            fb(true,`✓ ${c.exp} In bottom-8 land: eighth=1, quarter=2, dotted quarter=3, dotted half=6.`); }
          else { fb(true,`✓ ${c.exp}`); setTimeout(ask,1100); } }
        else { MFAudio.tone(40,.2); fb(false,"Everything is measured in EIGHTH-note beats now."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

/* pulse-group tapper v2 (instructor): READY-GO count-in (예비박), twelve circles
   drawn as TWO measures that light up with the sound (G-C-C-E-C-C twice =
   sol-do-do-mi-do-do), strong beats 1 & 4 bigger and red-rimmed. */
function MF_L43_pulse(container,fb){
  const SPB=.34, SEQ=[79,72,72,76,72,72], NAME={79:"G",76:"E",72:"C"};
  let playing=false, taps=[], t0=0, timers=[];
  container.innerHTML=`<div class="big-q" style="text-align:center">6/8 pulses in TWO groups of three: <b>1</b>-2-3-<b>4</b>-5-6. Press play — after the <b>4-3-2-1</b> count-in, tap the drum on beats <b>1</b> and <b>4</b> of each measure — the repeat sign plays the set twice!</div>
    <div class="l43-ready" style="text-align:center;font-weight:800;font-size:1.35rem;min-height:32px;color:#e11d48"></div>
    <div class="l43-dots" style="display:flex;justify-content:center;align-items:center;gap:7px;margin:10px 0;flex-wrap:wrap"></div>
    <div style="text-align:center">
      <button class="play l43-pp">\u25b6 Play (2 measures \u00d72)</button>
      <button class="play l43-pd" style="font-size:1.4rem">\u{1F941} TAP</button></div>
    <div class="l43-pmsg" style="text-align:center;font-weight:800;min-height:24px;color:var(--correct)"></div>`;
  const ready=container.querySelector(".l43-ready"), msg=container.querySelector(".l43-pmsg"),
        dotRow=container.querySelector(".l43-dots"), dots=[];
  for(let m=0;m<2;m++){
    if(m){ const bar=document.createElement("div"); bar.style.cssText="width:3px;height:36px;background:#23263e;margin:0 8px;border-radius:2px"; dotRow.appendChild(bar); }
    for(let k=0;k<6;k++){
      const strong=(k===0||k===3), d=document.createElement("div");
      d.textContent=NAME[SEQ[k]];
      d.style.cssText=`width:${strong?36:27}px;height:${strong?36:27}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${strong?14:11.5}px;border:${strong?3:2}px solid ${strong?"#e11d48":"#4434d4"};color:#1c1e54;background:#fff;transition:background .12s`;
      dotRow.appendChild(d); dots.push(d);
    }
  }
  /* repeat sign at the end — the set plays TWICE */
  const rep=document.createElement("div");
  rep.style.cssText="display:flex;align-items:center;gap:3px;margin-left:8px;height:36px";
  rep.innerHTML=`<div style="display:flex;flex-direction:column;gap:6px;justify-content:center"><div style="width:5px;height:5px;border-radius:50%;background:#23263e"></div><div style="width:5px;height:5px;border-radius:50%;background:#23263e"></div></div><div style="width:2.5px;height:36px;background:#23263e"></div><div style="width:6px;height:36px;background:#23263e"></div>`;
  dotRow.appendChild(rep);
  const IN=12*SPB; /* two silent count-in measures: 4-3-2-1 on the big pulses */
  container.querySelector(".l43-pp").onclick=function(){
    if(playing) return; playing=true; taps=[]; this.disabled=true; msg.textContent="";
    timers.forEach(clearTimeout); timers=[];
    dots.forEach(d=>d.style.background="#fff");
    [0,1,2,3].forEach(c=>{ MFAudio.tone(45,.14,c*3*SPB,c===3?.7:.55);
      timers.push(setTimeout(()=>ready.textContent=String(4-c),c*3*SPB*1000)); });
    timers.push(setTimeout(()=>ready.textContent="",IN*1000+250));
    for(let pass=0;pass<2;pass++){
      const base=IN+pass*12*SPB;
      if(pass===1) timers.push(setTimeout(()=>{ dots.forEach(d=>d.style.background="#fff"); ready.textContent="REPEAT!"; timers.push(setTimeout(()=>ready.textContent="",900)); },base*1000-40));
      for(let m=0;m<2;m++) for(let k=0;k<6;k++){
        const t=base+(m*6+k)*SPB, strong=(k===0||k===3), ix=m*6+k;
        MFAudio.tone(SEQ[k],.18,t,strong?.62:.3);
        timers.push(setTimeout(()=>{ dots[ix].style.background = strong? "#ffd9e1" : "#e3e1fd"; },t*1000));
      }
    }
    t0=performance.now();
    timers.push(setTimeout(()=>{ playing=false; this.disabled=false;
      const targets=[]; for(let pass=0;pass<2;pass++) [0,3,6,9].forEach(k=>targets.push((IN+pass*12*SPB+k*SPB)*1000));
      let hit=0; targets.forEach(tt=>{ if(taps.some(tp=>Math.abs(tp-tt)<230)) hit++; });
      const extra=taps.length-hit;
      if(hit>=6&&extra<=2){ msg.textContent="\u2713 Strong beats nailed!";
        fb(true,`\u2713 ${hit} of 8 strong beats across the repeat — you tapped WITH the big pulses (the G and the E). That two-pulse swing is the feel of 6/8!`); }
      else { msg.textContent="Try again — count down with the clicks, then tap the big red circles' beats (the set repeats once).";
        fb(false,"Tap only when the BIG circles light: beat 1 (G) and beat 4 (E) of each measure — through BOTH passes."); }
    },(IN+24*SPB)*1000+400));
  };
  container.querySelector(".l43-pd").onclick=()=>{ if(!playing) return; MFAudio.tone(48,.08,0,.5); taps.push(performance.now()-t0); };
}

LESSON_CONTENT[43]={
  welcome:"New bottom number! When the 8 moves in downstairs, the EIGHTH note becomes the beat. \u{26F5}",
  hook:{
    say:"Listen to this lullaby-like rock: it doesn't march in 2 or waltz in 3 — it ROCKS in two long swings, each made of three little steps. <b>How many little steps per swing?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ Feel the rock</button></div>
          <div class="choices hk-ch" style="display:none"><button>Three — 1-2-3, 4-5-6</button><button>Two — 1-2, 3-4</button><button>Four — 1-2-3-4</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          for(let m=0;m<2;m++) for(let k=0;k<6;k++)
            MFAudio.tone(k===0?79:(k===3?76:71),.18,(m*6+k)*.3,(k===0||k===3)?.6:.3);
          setTimeout(()=>ch.style.display="",3900);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Two swings of THREE: 1-2-3, 4-5-6 — that's 6/8 time, today's headline meter. The eighth note takes the beat, and the beats bundle in threes.");
          else fb(false,"Count the soft clicks inside each strong one…");
        });
      } }
  },
  objectives:[
    "Read time signatures with 8 on the bottom",
    "Count 3/8: three eighth-note beats",
    "Count 6/8: six eighth-note beats in two groups",
    "Use the bottom-8 value chart (quarter = 2, dotted quarter = 3)",
    "Feel 6/8's two strong pulses (beats 1 and 4)",
    "Complete 3/8 and 6/8 measures correctly"
  ],
  steps:[
    { say:"Every time signature's bottom number names the <b>beat note</b>. Bottom 4 = quarter note. Today's news: <b>bottom 8 = the EIGHTH note receives 1 beat</b>. \u{1F447} <b>In 3/8 time, the top 3 means…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:120,time:"3/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8",label:"2"},{p:"E5",d:"8",label:"3"},{bar:"single"},
        {p:"D5",d:"8",label:"1"},{p:"C5",d:"q",label:"2-3"},{bar:"final"}],
        beams:[[0,2]],width:420} },
      try:{ type:"mc", choices:["3 eighth-note beats per measure","3 quarter-note beats per measure","Play three times"], answer:0,
        success:"✓ 3 beats per measure, and each beat is an EIGHTH note. Same top-number job as always — new beat note.",
        fail:"The top number's job never changes; the BOTTOM one changed…",
        hint:"Top = how many; bottom = of WHAT." } },
    { say:"New beat note = new value chart. In 3/8 and 6/8: <b>eighth note (or rest) = 1 beat · quarter = 2 · dotted quarter = 3</b>. And in 6/8 only: quarter rest = 2, <b>dotted half (or whole rest) = 6</b>. \u{1F447} <b>Work through the chart:</b>",
      try:{ type:"custom",
        hint:"Count everything in eighth-note beats now.",
        mount:(container,fb)=>MF_L43_chart(container,fb) } },
    { say:"<b>6/8 time</b>: six eighth-note beats — but here's the secret: musicians <b>feel them as TWO groups of three</b>: <b>1</b>-2-3 <b>4</b>-5-6. The beaming shows it — two bundles of three eighths. A meter whose beats bundle in threes is called <b>COMPOUND</b>. \u{1F447} <b>Where do 6/8's strong beats fall?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:130,time:"6/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8",label:"2"},{p:"E5",d:"8",label:"3"},
        {p:"F5",d:"8",label:"4"},{p:"E5",d:"8",label:"5"},{p:"D5",d:"8",label:"6"},{bar:"single"},
        {p:"E5",d:"8",label:"1"},{p:"D5",d:"8",label:"2"},{p:"C5",d:"8",label:"3"},{p:"C5",d:"q.",label:"4-5-6"},{bar:"final"}],
        beams:[[0,2],[3,5],[7,9]],
        brackets:[{from:0,to:2,label:"group 1"},{from:3,to:5,label:"group 2"}],width:620} },
      try:{ type:"mc", choices:["Beats 1 and 4","Beats 1 and 3","Every beat"], answer:0,
        success:"✓ ONE-two-three-FOUR-five-six: the strong pulses launch each group of three.",
        fail:"Each group of three starts with its strong beat…",
        hint:"Two groups → two strong beats." } },
    { say:"Feel it in your hands. \u{1F447} <b>Play the 6/8 pattern and tap ONLY the strong beats:</b>",
      try:{ type:"custom",
        hint:"Tap with the two LOUD clicks — beats 1 and 4.",
        mount:(container,fb)=>MF_L43_pulse(container,fb) } },
    { say:"The <b>dotted quarter</b> deserves a spotlight: worth <b>3 eighth-beats</b>, it exactly fills one 6/8 group — so 6/8 melodies love pairing a flowing group of eighths with a long dotted quarter. \u{1F447} <b>How many dotted quarters fill a whole 6/8 measure?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:130,time:"6/8",notes:[
        {p:"C5",d:"q.",label:"1-2-3"},{p:"G4",d:"q.",label:"4-5-6"},{bar:"final"}],width:340} },
      try:{ type:"mc", choices:["2","3","6"], answer:0,
        success:"✓ Two dotted quarters = 3 + 3 = 6 beats — the two big pulses made visible.",
        fail:"Each is worth 3; the measure holds 6…",
        hint:"3 + 3 = 6." } },
    { say:"Measure math check — writers must fill every measure exactly. \u{1F447} <b>A 3/8 measure already has one eighth note. What completes it?</b>",
      try:{ type:"mc", choices:["One quarter note (2 beats)","One dotted quarter (3 beats)","One eighth note (1 beat)"], answer:0,
        success:"✓ 1 + 2 = 3. A dotted quarter would overflow; a single eighth leaves a hole.",
        fail:"You need exactly 2 more eighth-beats.",
        hint:"3 total − 1 used = ?" } }
  ],
  examples:[
    { caption:"3/8 time — three eighth-note beats per measure. Count 1-2-3 with the labels as it plays.",
      staff:{clef:"treble",tempo:130,time:"3/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"E5",d:"8",label:"2"},{p:"G5",d:"8",label:"3"},{bar:"single"},
        {p:"F5",d:"q",label:"1-2"},{p:"D5",d:"8",label:"3"},{bar:"single"},
        {p:"C5",d:"q.",label:"1-2-3"},{bar:"final"}],
        beams:[[0,2]],width:520} },
    { caption:"6/8 time — the rocking compound feel: two groups of three, strong on 1 and 4, closing on a dotted quarter.",
      staff:{clef:"treble",tempo:140,time:"6/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8",label:"2"},{p:"E5",d:"8",label:"3"},
        {p:"F5",d:"8",label:"4"},{p:"G5",d:"8",label:"5"},{p:"E5",d:"8",label:"6"},{bar:"single"},
        {p:"F5",d:"8",label:"1"},{p:"D5",d:"8",label:"2"},{p:"B4",d:"8",label:"3"},{p:"C5",d:"q.",label:"4-5-6"},{bar:"final"}],
        beams:[[0,2],[3,5],[7,9]],width:640} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Bottom-8 Value Sprint (45s)",
      intro:"Values in eighth-beat land — how many beats does each get in 3/8 or 6/8?",
      miaIntro:"The eighth is king now! \u{1F451}",
      spec:{gen:"term-match", params:{subject:"value", pool:[
        ["Eighth note in 6/8","1 beat"],
        ["Quarter note in 6/8","2 beats"],
        ["Dotted quarter in 6/8","3 beats"],
        ["Dotted half in 6/8","6 beats"],
        ["Eighth rest in 3/8","1 beat of silence"],
        ["Quarter rest in 6/8","2 beats of silence"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" conversions — bottom-8 fluent!":null },
    { type:"measure-build", title:"Game 2 · 6/8 Measure Builder",
      intro:"Fill exactly SIX eighth-note beats — group them like a pro!",
      miaIntro:"Two bundles of three! \u{1F9F1}",
      spec:{beats:6, unique:false, buttons:[
        {t:"8",label:"Eighth (1 beat)",beats:1,item:{p:"B4",d:"8"}},
        {t:"q",label:"Quarter (2 beats)",beats:2,item:{p:"B4",d:"q"}},
        {t:"q.",label:"Dotted Quarter (3)",beats:3,item:{p:"B4",d:"q."}},
        {t:"r8",label:"Eighth Rest (1)",beats:1,item:{rest:"8"}}]},
      result:(score)=>score!==null?"Measures built six-by-six!":null },
    { type:"rhythm-tap", title:"Game 3 · Compound Tap Lab",
      intro:"Tap the 6/8 patterns — feel the three-note bundles!",
      miaIntro:"ONE-two-three-FOUR-five-six! \u{26F5}",
      spec:{tempo:140, rounds:3, beatsPerBar:6, patterns:[
        ["8","8","8","q."],
        ["q.","8","8","8"],
        ["8","8","8","8","8","8"]]},
      result:(score)=>score!==null?"You rocked the compound meter!":null },
    { type:"term-race", title:"Game 4 · Meter Vocabulary Race",
      intro:"3/8, 6/8, compound, beat unit — match at speed!",
      miaIntro:"Bundle up the vocabulary! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["3/8 time","3 eighth-note beats per measure"],
        ["6/8 time","6 eighth-note beats — two groups of 3"],
        ["Compound meter","beats naturally grouped in threes"],
        ["Bottom 8","the eighth note receives one beat"],
        ["Strong beats of 6/8","beats 1 and 4"],
        ["Dotted quarter in 6/8","one full group — 3 beats"]]},
      result:(score)=>score>=7?"Meter vocabulary bundled and shelved!":null }
  ],
  practiceIntro:"20 practice questions — bottom-8 values, counting, strong beats, measure math. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"value", pool:[["Eighth note in 6/8","1 beat"],["Quarter note in 6/8","2 beats"],["Dotted quarter in 6/8","3 beats"],["Dotted half in 6/8","6 beats"]], reverse:true}, count:4 },
    { type:"mc", q:"In 3/8 time, the 8 means…", choices:["the eighth note receives one beat","eight beats per measure","play eight measures"], answer:0,
      explain:"Bottom number = the beat note." },
    { type:"mc", q:"In 6/8 time, the 6 means…", choices:["6 beats per measure","6 measures per line","six eighth notes only"], answer:0,
      explain:"Top number = beats per measure." },
    { type:"mc", q:"6/8 is usually FELT as…", choices:["two groups of three","three groups of two","six equal accents"], answer:0,
      explain:"1-2-3 | 4-5-6 — the compound bundling." },
    { type:"mc", q:"In 3/8, a quarter note receives…", choices:["2 beats","1 beat","3 beats"], answer:0,
      explain:"Two eighth-beats' worth." },
    { type:"mc", q:"In 6/8, a dotted quarter receives…", choices:["3 beats","2 beats","1½ beats"], answer:0,
      explain:"2 + 1 = 3 eighth-beats — one full group." },
    { type:"mc", q:"Which fills ONE measure of 3/8?", choices:["a dotted quarter note","a quarter note","a dotted half note"], answer:0,
      explain:"3 beats exactly." },
    { type:"mc", q:"Which fills ONE measure of 6/8?", choices:["a dotted half note","a whole note","a quarter note"], answer:0,
      explain:"6 eighth-beats = dotted half." },
    { type:"truefalse", q:"In 6/8 time, the strong beats are 1 and 4.", answer:true,
      explain:"Each group of three launches with its strong beat." },
    { type:"truefalse", q:"In 3/8 time, the quarter note receives one beat.", answer:false,
      explain:"The EIGHTH gets the beat; a quarter gets two." },
    { type:"mc", q:"A meter whose beats group naturally into threes is called…", choices:["compound","simple","cut"], answer:0,
      explain:"6/8 is the classic compound meter." },
    { type:"mc", q:"A 6/8 measure has a dotted quarter + two eighths. How many more beats are needed?", choices:["1","2","0"], answer:0,
      explain:"3 + 1 + 1 = 5; one eighth-beat remains." }
  ],
  miaQuizIntro:"Bottom number 8, bundles of three — rock through the quiz!",
  quiz:[
    { type:"mc", q:"In 3/8 time, which note receives one beat?", choices:["the eighth note","the quarter note","the half note","the sixteenth note"], answer:0,
      explain:"Bottom 8 = eighth-note beat.", hint:"Read the bottom number." },
    { type:"mc", q:"3/8 time has…", choices:["3 eighth-note beats per measure","3 quarter-note beats per measure","8 beats per measure"], answer:0,
      explain:"Top 3, bottom 8.", hint:"How many, of what." },
    { type:"mc", q:"6/8 time has…", choices:["6 eighth-note beats per measure","6 quarter-note beats","8 beats of sixths"], answer:0,
      explain:"Six eighth-beats, bundled 3+3.", hint:"Same logic, bigger top." },
    { type:"mc", q:"The strong beats in 6/8 fall on…", choices:["1 and 4","1 and 3","2 and 5","every beat"], answer:0,
      explain:"ONE-two-three-FOUR-five-six.", hint:"Each bundle's first beat." },
    { type:"truefalse", q:"In 6/8, a quarter note receives 2 beats.", answer:true,
      explain:"Two eighth-beats.", hint:"Two eighths inside it." },
    { type:"truefalse", q:"A dotted quarter fills a whole measure of 6/8.", answer:false,
      explain:"It fills HALF (3 of 6) — a dotted HALF fills the measure.", hint:"3 vs 6." },
    { type:"mc", q:"In 6/8, a dotted HALF note receives…", choices:["6 beats","3 beats","4 beats"], answer:0,
      explain:"4 + 2 = 6 eighth-beats — the full measure.", hint:"The whole boat-rock." },
    { type:"mc", q:"6/8 is called a COMPOUND meter because…", choices:["its beats group naturally into threes","it uses two clefs","it has two time signatures"], answer:0,
      explain:"Bundles of three = compound.", hint:"Think of the bundles." },
    { type:"mc", q:"Count this measure.",
      staff:{clef:"treble",time:"6/8",notes:[{p:"C5",d:"8"},{p:"D5",d:"8"},{p:"E5",d:"8"},{p:"C5",d:"q."},{bar:"final"}],beams:[[0,2]],width:320},
      choices:["1-2-3 then 4-5-6 held","1-2 then 3-4","1-2-3-4 then 5-6 held"], answer:0,
      explain:"Three eighths + dotted quarter (3 beats held).", hint:"The dotted quarter = one full bundle." },
    { type:"mc", q:"Which combination fills one 3/8 measure?", choices:["eighth + quarter","quarter + quarter","dotted quarter + eighth"], answer:0,
      explain:"1 + 2 = 3.", hint:"Total must be 3 eighth-beats." },
    { type:"mc", q:"The natural 'long note' of 6/8 melodies is…", choices:["the dotted quarter","the whole note","the sixteenth"], answer:0,
      explain:"It spans exactly one group of three.", hint:"What filled each swing?" },
    { type:"mc", q:"In 6/8, a quarter REST receives…", choices:["2 beats of silence","1 beat of silence","3 beats of silence"], answer:0,
      explain:"Rests follow the same chart as notes.", hint:"Same as the quarter note." },
    /* generated */
    { gen:"term-match", params:{subject:"value", pool:[["Eighth note in 6/8","1 beat"],["Quarter note in 6/8","2 beats"],["Dotted quarter in 6/8","3 beats"],["Dotted half in 6/8","6 beats"],["Strong beats of 6/8","1 and 4"]], reverse:true}, count:4 },
    { gen:"note-value", params:{values:["8","q","q."],ask:"name"}, count:2 }
  ],
  vocabulary:[
    {term:"3/8 Time", def:"A meter with 3 eighth-note beats per measure — the eighth note receives one beat."},
    {term:"6/8 Time", def:"A compound meter with 6 eighth-note beats per measure, felt as two groups of three (strong beats 1 and 4)."},
    {term:"Compound Meter", def:"A meter in which the beats group naturally into threes — 6/8 is the most common example."},
    {term:"Beat Unit", def:"The note value that receives one beat — named by the time signature's bottom number (8 = eighth note)."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Bottom 8 = the eighth note gets the beat</b> — the whole value chart shifts.",
    "✔ <b>3/8</b>: three eighth-beats (1-2-3). <b>6/8</b>: six, felt as <b>two groups of three</b>.",
    "✔ New chart: eighth = 1 · quarter = 2 · <b>dotted quarter = 3</b> · dotted half = 6.",
    "✔ 6/8's strong beats: <b>1 and 4</b> — the rocking, compound feel.",
    "✔ Beaming shows the bundles: three eighths per beam group in 6/8."
  ],
  tips:[
    "Hear 6/8 everywhere: 'Row, Row, Row Your Boat', 'We Are the Champions', countless jigs and barcarolles.",
    "Beams are your map: in 6/8 they bundle by threes; in 3/4 the same six eighths would bundle by twos!",
    "The dotted quarter is 6/8's queen — treat 'dotted quarter = one swing' as a single mental unit.",
    "Next lesson: the SAME signatures at fast tempos — where 3/8 collapses to ONE count and 6/8 to two."
  ],
  rewards:{ badge:"Compound Captain", icon:"\u{26F5}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — you rocked every bundle! \u{26F5}\u{1F389}",
  miaPass:"Passed! Keep the chant going: ONE-two-three-FOUR-five-six.",
  mia:{
    hook:{ label:"the welcome",
      explain:"That was 6/8: six eighth-note beats bundled as two swings of three — strong on 1 and 4.",
      play:()=>{for(let m=0;m<2;m++)for(let k=0;k<6;k++)MFAudio.tone(k===0?79:(k===3?76:71),.16,(m*6+k)*.28,(k===0||k===3)?.6:.3);} },
    learn:{ label:"3/8 and 6/8",
      explain:"Bottom 8 = eighth-note beat. 3/8 counts 1-2-3; 6/8 counts 1-2-3-4-5-6 in two bundles (strong 1 and 4). Chart: eighth 1, quarter 2, dotted quarter 3, dotted half 6.",
      hint:"Everything measured in eighths now.",
      play:()=>{[0,1,2].forEach(k=>MFAudio.tone(72+k*2,.18,k*.28,.45));} },
    example:{ label:"the examples",
      explain:"Example 1 counts 3/8 measures three ways; example 2 rocks through 6/8 with the bundles beamed and labeled." },
    game:{ label:"the games",
      explain:"Sprint the value chart, build six-beat measures, tap the compound patterns, then race the vocabulary.",
      hint:"In the builder: think 'bundles of three'." },
    quiz:{ label:"this question",
      explain:"Two facts unlock everything: bottom 8 = eighth-note beat, and 6/8 bundles its six beats as 3 + 3 with strong beats 1 and 4.",
      play:()=>{[0,1,2,3,4,5].forEach(k=>MFAudio.tone(k===0||k===3?77:72,.14,k*.24,(k===0||k===3)?.55:.3));} }
  }
};
