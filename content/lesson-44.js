/* Lesson 44 — 3/8 and 6/8 at Fast Tempos (AEMT Book 2, Unit 11)
   Built from drafts/UNIT 11 – Lessons 43 & 44.md; AEMT p.69 verified by render.
   Core: like 4/4→cut time, fast 3/8 is counted IN ONE (dotted quarter = 1 count)
   and fast 6/8 IN TWO. Count only the strong beats (1 in 3/8; 1 & 4 in 6/8).
   NOTE: edit by FULL-FILE REWRITE only. */

/* slow vs fast lab: the same 6/8 passage — count in 6, then feel in 2 */
function MF_L44_lab(container,fb){
  let hS=false,hF=false;
  container.innerHTML=`<div class="big-q" style="text-align:center">The SAME 6/8 measures — first slow (count all 6), then fast (feel just 2). Press both!</div>
    <div style="text-align:center">
      <button class="play l44-s">\u{1F422} Slow — count 1-2-3-4-5-6</button>
      <button class="play l44-f">\u{1F407} Fast — feel ONE-two</button></div>
    <div class="choices l44-ch" style="display:none"><button>Fast: counting all 6 becomes impossible — feel 2 big beats</button><button>Fast: you can still comfortably count all six</button></div>`;
  const ch=container.querySelector(".l44-ch");
  const seq=[72,74,76,77,79,76];
  container.querySelector(".l44-s").onclick=()=>{
    seq.forEach((m,k)=>{ MFAudio.tone(m,.3,k*.5,.45); MFAudio.tone(45,.08,k*.5,(k===0||k===3)?.6:.35); });
    hS=true; if(hF) setTimeout(()=>ch.style.display="",3300);
  };
  container.querySelector(".l44-f").onclick=()=>{
    for(let r=0;r<2;r++) seq.forEach((m,k)=>{ MFAudio.tone(m,.13,r*.96+k*.16,.45); if(k===0||k===3) MFAudio.tone(45,.1,r*.96+k*.16,.65); });
    hF=true; if(hS) setTimeout(()=>ch.style.display="",2400);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(i===0) fb(true,"✓ At speed, six little counts blur — so musicians count ONLY the strong beats: 1 and 4 become 'ONE-two'. Fast 6/8 is felt IN TWO, exactly as fast 4/4 becomes cut time's two.");
    else fb(false,"Try counting '1-2-3-4-5-6' aloud with the fast version… exhausting, right?");
  });
}

/* in-one / in-two converter drill */
function MF_L44_conv(container,fb){
  const ROUNDS=[
    {q:"In FAST 3/8, each full measure is counted as…",opts:["1 count","3 counts","2 counts"],a:0,exp:"Fast 3/8 is 'in one' — the whole measure is a single pulse."},
    {q:"In FAST 3/8, a dotted quarter note receives…",opts:["1 count","3 counts","⅓ count"],a:0,exp:"The full measure = 1 count, and the dotted quarter fills it."},
    {q:"In FAST 6/8, each measure is counted in…",opts:["2 counts","6 counts","3 counts"],a:0,exp:"Strong beats 1 and 4 become the only two counts."},
    {q:"In FAST 6/8, a dotted HALF note receives…",opts:["2 counts","6 counts","1 count"],a:0,exp:"It fills the whole two-count measure."},
    {q:"In FAST 6/8, one eighth note receives…",opts:["⅓ of a count","1 count","½ count"],a:0,exp:"Three eighths share each single count."}];
  let i=0;
  container.innerHTML=`<div class="big-q l44-cq" style="text-align:center"></div><div class="choices chips l44-cch"></div>`;
  const q=container.querySelector(".l44-cq"), ch=container.querySelector(".l44-cch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Convert ${i+1} of ${ROUNDS.length}: ${cur.q}`;
    ch.innerHTML="";
    cur.opts.map((o,oi)=>({o,oi})).sort(()=>Math.random()-.5).forEach(({o,oi})=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const c=ROUNDS[i];
        if(oi===c.a){ i++; MFAudio.yay();
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="Fast-tempo conversion complete!";
            fb(true,`✓ ${c.exp} Fast 3/8 = in ONE; fast 6/8 = in TWO; the dotted quarter = the new beat.`); }
          else { fb(true,`✓ ${c.exp}`); setTimeout(ask,1100); } }
        else { MFAudio.tone(40,.2); fb(false,"At speed the DOTTED QUARTER becomes the felt beat — recalculate from there."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[44]={
  welcome:"Same signatures, higher speed — and suddenly you count SIX beats as just two. \u{1F407}",
  hook:{
    say:"Remember how 4/4 turns into cut time when the music gets fast? The same trick happens to 6/8! Listen to this jig tempo. <b>How many pulses do you actually FEEL per measure?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ Jig speed!</button></div>
          <div class="choices hk-ch" style="display:none"><button>Two big pulses</button><button>All six little beats</button><button>Four pulses</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          const seq=[72,74,76,77,79,76,77,74,72,74,76,72];
          seq.forEach((m,k)=>{ MFAudio.tone(m,.12,k*.15,.45); if(k%3===0) MFAudio.tone(45,.1,k*.15,.6); });
          setTimeout(()=>ch.style.display="",2200);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Two! At jig speed nobody counts to six — you feel the two strong beats (1 and 4) and let the little notes ride inside them. Today: how fast 3/8 and 6/8 are counted for real.");
          else fb(false,"Feel your foot — how many times does it want to tap per measure?");
        });
      } }
  },
  objectives:[
    "Explain why fast tempos change the counting, not the notation",
    "Count fast 3/8 'in one'",
    "Count fast 6/8 'in two'",
    "Identify the dotted quarter as the felt beat",
    "Locate the strong beats: 1 (3/8) · 1 and 4 (6/8)",
    "Connect this to the cut-time idea from Lesson 42"
  ],
  steps:[
    { say:"Recall Lesson 42: fast 4/4 gets recounted as cut time — two big beats instead of four. The same idea applies here: fast 3/8 and 6/8 keep their signatures, but musicians <b>count only the strong beats</b>. \u{1F447} <b>Why count fewer beats at speed?</b>",
      try:{ type:"mc", choices:["Fast little beats blur — big pulses stay steady","The notes change value on the page","To play fewer notes"], answer:0,
        success:"✓ The page never changes — only the counting strategy. Big pulses are easy to keep steady at any speed.",
        fail:"The notation is identical; what becomes impossible at 200 BPM?",
        hint:"Try counting to six, twice a second…" } },
    { say:"<b>Fast 3/8 = counted IN ONE.</b> The whole measure becomes a single pulse: the dotted quarter (or a full measure of notes) = <b>1 count</b>; an eighth = ⅓ of a count. There's one strong beat — beat 1. \u{1F447} <b>In fast 3/8, the entire measure of three eighths gets…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:200,time:"3/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8"},{p:"E5",d:"8"},{bar:"single"},
        {p:"F5",d:"q.",label:"1"},{bar:"final"}],
        beams:[[0,2]],width:400} },
      try:{ type:"mc", choices:["One single count","Three counts","Half a count"], answer:0,
        success:"✓ ONE. The measure IS the beat — like a fast waltz where you only feel the downbeats.",
        fail:"'In one' means the measure collapses to…",
        hint:"Look at the labels: only beat 1 is counted." } },
    { say:"<b>Fast 6/8 = counted IN TWO.</b> The strong beats 1 and 4 become count <b>1</b> and count <b>2</b>: each <b>dotted quarter = 1 count</b>, each eighth = ⅓, and the dotted half = the full 2. \u{1F447} <b>Which two written beats become the two counts?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:200,time:"6/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8"},{p:"E5",d:"8"},
        {p:"F5",d:"8",label:"2"},{p:"G5",d:"8"},{p:"E5",d:"8"},{bar:"single"},
        {p:"F5",d:"q.",label:"1"},{p:"C5",d:"q.",label:"2"},{bar:"final"}],
        beams:[[0,2],[3,5]],width:540} },
      try:{ type:"mc", choices:["Beats 1 and 4","Beats 1 and 3","Beats 2 and 5"], answer:0,
        success:"✓ The old strong beats 1 and 4 are promoted to the only two counts. ONE-two, ONE-two — a fast rocking march.",
        fail:"Which beats were STRONG back in Lesson 43?",
        hint:"The bundle-starters." } },
    { say:"Hear the collapse happen. \u{1F447} <b>Compare the same passage slow and fast:</b>",
      try:{ type:"custom",
        hint:"Slow = count six; fast = feel two. Your foot knows before your brain does.",
        mount:(container,fb)=>MF_L44_lab(container,fb) } },
    { say:"The conversion chart, fast edition — the <b>dotted quarter is the new beat</b>. \u{1F447} <b>Drill the conversions:</b>",
      try:{ type:"custom",
        hint:"Fast 3/8: measure = 1 count. Fast 6/8: measure = 2 counts, dotted quarter = 1.",
        mount:(container,fb)=>MF_L44_conv(container,fb) } },
    { say:"Big picture: this is the same musical logic THREE times now — fast 4/4 → cut time's 2 · fast 3/8 → in 1 · fast 6/8 → in 2. Speed doesn't change the page; it changes <b>which pulse you ride</b>. \u{1F447} <b>What stays the same when 6/8 goes fast?</b>",
      try:{ type:"mc", choices:["The written notes and signature","The number of counts you say","The felt beat note"], answer:0,
        success:"✓ Notation untouched; the count shrinks from 6 to 2 and the felt beat grows from eighth to dotted quarter. Reading fast compound meter: unlocked!",
        fail:"Check the two staffs in step 3 — did any note change?",
        hint:"Page vs performance." } }
  ],
  examples:[
    { caption:"Fast 3/8 'in one' — only the downbeats are counted; each measure is a single swing. Play and tap once per measure.",
      staff:{clef:"treble",tempo:210,time:"3/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"E5",d:"8"},{p:"G5",d:"8"},{bar:"single"},
        {p:"F5",d:"8",label:"1"},{p:"D5",d:"8"},{p:"B4",d:"8"},{bar:"single"},
        {p:"C5",d:"q.",label:"1"},{bar:"final"}],
        beams:[[0,2],[4,6]],width:520} },
    { caption:"Fast 6/8 'in two' — a jig! Two dotted-quarter pulses per measure; the eighths ride inside them. ONE-two, ONE-two.",
      staff:{clef:"treble",tempo:210,time:"6/8",notes:[
        {p:"C5",d:"8",label:"1"},{p:"D5",d:"8"},{p:"E5",d:"8"},
        {p:"F5",d:"8",label:"2"},{p:"G5",d:"8"},{p:"E5",d:"8"},{bar:"single"},
        {p:"D5",d:"q.",label:"1"},{p:"C5",d:"q.",label:"2"},{bar:"final"}],
        beams:[[0,2],[3,5]],width:560} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Fast-Count Sprint (45s)",
      intro:"Fast 3/8 and 6/8 conversions — match values to their fast-tempo counts!",
      miaIntro:"Think in dotted quarters! \u{1F407}",
      spec:{gen:"term-match", params:{subject:"value", pool:[
        ["Fast 3/8 measure","counted as 1"],
        ["Fast 6/8 measure","counted as 2"],
        ["Dotted quarter (fast 6/8)","1 count"],
        ["Dotted half (fast 6/8)","2 counts"],
        ["Eighth note (fast 6/8)","⅓ of a count"],
        ["Strong beats of 6/8","1 and 4"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" fast conversions — jig-ready!":null },
    { type:"rhythm-tap", title:"Game 2 · Jig Tap Lab",
      intro:"Fast 6/8 patterns — tap them clean at jig speed!",
      miaIntro:"Ride the big TWO! \u{26A1}",
      spec:{tempo:180, rounds:3, beatsPerBar:6, patterns:[
        ["q.","q."],
        ["8","8","8","q."],
        ["q.","8","8","8"]]},
      result:(score)=>score!==null?"You survived jig tempo!":null },
    { type:"measure-build", title:"Game 3 · Fast-Measure Builder",
      intro:"Build 6/8 measures thinking in TWO dotted-quarter pulses!",
      miaIntro:"Two pulses, six eighths — same thing! \u{1F9F1}",
      spec:{beats:6, unique:false, buttons:[
        {t:"q.",label:"Dotted Quarter (1 pulse)",beats:3,item:{p:"B4",d:"q."}},
        {t:"8",label:"Eighth (⅓ pulse)",beats:1,item:{p:"B4",d:"8"}},
        {t:"q",label:"Quarter",beats:2,item:{p:"B4",d:"q"}},
        {t:"h.",label:"Dotted Half (2 pulses)",beats:6,item:{p:"B4",d:"h."}}]},
      result:(score)=>score!==null?"Measures built at speed!":null },
    { type:"term-race", title:"Game 4 · Fast-Meter Vocabulary Race",
      intro:"In one, in two, strong beats, the promoted dotted quarter — race it!",
      miaIntro:"Final sprint before the triplets! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Fast 3/8","counted 'in one'"],
        ["Fast 6/8","counted 'in two'"],
        ["The felt beat at speed","the dotted quarter"],
        ["Strong beat of 3/8","beat 1"],
        ["Strong beats of 6/8","beats 1 and 4"],
        ["What changes at speed","the counting — never the notation"]]},
      result:(score)=>score>=7?"Fast-meter vocabulary locked in!":null }
  ],
  practiceIntro:"20 practice questions — in-one, in-two, conversions and the cut-time parallel. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"value", pool:[["Fast 3/8 measure","1 count"],["Fast 6/8 measure","2 counts"],["Dotted quarter (fast 6/8)","1 count"],["Dotted half (fast 6/8)","2 counts"]], reverse:true}, count:4 },
    { type:"mc", q:"At fast tempos, 3/8 is counted…", choices:["in one","in three","in six"], answer:0,
      explain:"One pulse per measure." },
    { type:"mc", q:"At fast tempos, 6/8 is counted…", choices:["in two","in six","in three"], answer:0,
      explain:"Two dotted-quarter pulses." },
    { type:"mc", q:"In fast 6/8, the dotted quarter receives…", choices:["1 count","3 counts","2 counts"], answer:0,
      explain:"It IS the felt beat now." },
    { type:"mc", q:"In fast 3/8, an eighth note receives…", choices:["⅓ of a count","1 count","½ count"], answer:0,
      explain:"Three eighths share the single pulse." },
    { type:"mc", q:"Which rest fills a whole measure of fast 6/8?", choices:["the whole rest (2 counts)","the eighth rest","the quarter rest"], answer:0,
      explain:"The whole rest fills any full measure — here worth 2 fast counts." },
    { type:"truefalse", q:"The strong beat of fast 3/8 is beat 1.", answer:true,
      explain:"The only counted beat." },
    { type:"truefalse", q:"When 6/8 speeds up, composers rewrite all the notes.", answer:false,
      explain:"Notation is untouched — only the felt pulse changes." },
    { type:"mc", q:"Fast 6/8's two counts land on written beats…", choices:["1 and 4","1 and 3","3 and 6"], answer:0,
      explain:"The old strong beats get promoted." },
    { type:"mc", q:"This idea matches which earlier lesson?", choices:["cut time — fast 4/4 felt in 2","key signatures","dotted eighths"], answer:0,
      explain:"Same speed-logic as alla breve." },
    { type:"mc", q:"Which dance practically lives in fast 6/8?", choices:["the jig","the waltz","the tango"], answer:0,
      explain:"Jigs (and tarantellas) ride the two-pulse gallop." }
  ],
  miaQuizIntro:"Feel big, count small — two pulses max. Sprint!",
  quiz:[
    { type:"mc", q:"At a fast tempo, each measure of 3/8 is counted as…", choices:["1 count","3 counts","6 counts","2 counts"], answer:0,
      explain:"Fast 3/8 = in one.", hint:"The waltz-downbeat trick." },
    { type:"mc", q:"At a fast tempo, each measure of 6/8 is counted as…", choices:["2 counts","6 counts","3 counts","4 counts"], answer:0,
      explain:"Fast 6/8 = in two.", hint:"Strong beats only." },
    { type:"mc", q:"In fast 6/8, which note receives ONE count?", choices:["the dotted quarter","the eighth","the quarter","the dotted half"], answer:0,
      explain:"The dotted quarter is the promoted beat.", hint:"Three eighths bundled." },
    { type:"mc", q:"In fast 6/8, the dotted HALF note receives…", choices:["2 counts","6 counts","3 counts","1 count"], answer:0,
      explain:"The full in-two measure.", hint:"Whole measure at speed." },
    { type:"truefalse", q:"Fast tempo changes how 6/8 is counted, not how it is written.", answer:true,
      explain:"The page is identical; the pulse strategy changes.", hint:"Notation vs feel." },
    { type:"truefalse", q:"In fast 6/8, you should still carefully count all six beats aloud.", answer:false,
      explain:"Only the strong beats — counting six at speed is impossible.", hint:"Remember the lab." },
    { type:"mc", q:"There is a strong beat on ____ in 3/8 time.", choices:["1","2","3","every beat"], answer:0,
      explain:"One bundle, one strong beat.", hint:"Where the measure launches." },
    { type:"mc", q:"There are strong beats on ____ in 6/8 time.", choices:["1 and 4","1 and 3","2 and 5","4 and 6"], answer:0,
      explain:"The two bundle-starts.", hint:"3 + 3 bundles." },
    { type:"mc", q:"The fast-tempo logic of 6/8 → 'in two' parallels…", choices:["4/4 → cut time","3/4 → 4/4","C → 3/8"], answer:0,
      explain:"Both halve the counting burden at speed.", hint:"Lesson 42's slash." },
    { type:"mc", q:"In fast 3/8, three beamed eighth notes get…", choices:["one count together","three separate counts","1½ counts"], answer:0,
      explain:"The whole bundle = the single pulse.", hint:"In ONE." },
    { type:"mc", q:"Feel check: a fast 6/8 jig makes your foot tap…", choices:["twice per measure","six times per measure","once every two measures"], answer:0,
      explain:"ONE-two per measure.", hint:"What did your foot do in the hook?" },
    { type:"mc", q:"In fast 6/8, one eighth note is worth…", choices:["⅓ of a count","½ of a count","1 count"], answer:0,
      explain:"Three ride inside each dotted-quarter pulse.", hint:"3 per pulse." },
    /* generated */
    { gen:"term-match", params:{subject:"value", pool:[["Fast 3/8 measure","1 count"],["Fast 6/8 measure","2 counts"],["Dotted quarter (fast 6/8)","1 count"],["Eighth (fast 6/8)","⅓ of a count"],["Strong beats of 6/8","1 and 4"]], reverse:true}, count:4 },
    { gen:"note-value", params:{values:["8","q.","h."],ask:"name"}, count:2 }
  ],
  vocabulary:[
    {term:"In One", def:"Counting each fast 3/8 measure as a single pulse — the dotted quarter (or full measure) = 1 count."},
    {term:"In Two", def:"Counting each fast 6/8 measure as two pulses — each dotted quarter = 1 count."},
    {term:"Strong Beat", def:"The beat that launches each group: beat 1 in 3/8; beats 1 and 4 in 6/8. At speed, only strong beats are counted."},
    {term:"Felt Beat", def:"The pulse a listener actually taps to — at fast compound tempos, the dotted quarter."}
  ],
  mistakes:[],
  summary:[
    "✔ Fast tempo changes the COUNT, never the page — same trick as cut time.",
    "✔ <b>Fast 3/8 = in ONE</b>: measure = 1 count; strong beat 1.",
    "✔ <b>Fast 6/8 = in TWO</b>: dotted quarter = 1 count; strong beats 1 and 4.",
    "✔ At speed the <b>dotted quarter is the felt beat</b>; eighths ride inside it, ⅓ each.",
    "✔ Count only the strong beats when little beats blur."
  ],
  tips:[
    "Conductors literally beat fast 6/8 in two — watch any orchestra play a galop or jig.",
    "Practice bridge: count a passage in 6, speed it up gradually, and FEEL the moment your counting wants to collapse to 2.",
    "'Feel big, play small': big pulses in the body, little notes in the fingers.",
    "Next lesson flips the trick: TRIPLETS squeeze three notes into a beat that normally holds two."
  ],
  rewards:{ badge:"Jig Jockey", icon:"\u{1F407}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score at jig speed — your pulse never wavered! \u{1F407}\u{1F389}",
  miaPass:"Passed! Feel big, count small: ONE-two.",
  mia:{
    hook:{ label:"the welcome",
      explain:"That was 6/8 at jig tempo — six written beats, but only two felt pulses (on the old strong beats 1 and 4).",
      play:()=>{const seq=[72,74,76,77,79,76];for(let r=0;r<2;r++)seq.forEach((m,k)=>{MFAudio.tone(m,.12,r*.96+k*.16,.45);if(k%3===0)MFAudio.tone(45,.1,r*.96+k*.16,.6);});} },
    learn:{ label:"fast 3/8 and 6/8",
      explain:"Fast 3/8 = in one (measure = 1 count); fast 6/8 = in two (dotted quarter = 1 count, strong beats 1 & 4). Notation never changes — only the counting strategy.",
      hint:"Dotted quarter = the promoted beat.",
      play:()=>{[0,1].forEach(k=>MFAudio.tone(45,.12,k*.5,.6));} },
    example:{ label:"the examples",
      explain:"Example 1 swings fast 3/8 in one; example 2 gallops a 6/8 jig in two — tap along with the labels." },
    game:{ label:"the games",
      explain:"Sprint the conversions, tap at jig speed, build in dotted-quarter pulses, then race the vocabulary.",
      hint:"Everything at speed reduces to: how many dotted quarters?" },
    quiz:{ label:"this question",
      explain:"Two numbers answer everything: fast 3/8 → 1, fast 6/8 → 2 — with the dotted quarter as the felt beat.",
      play:()=>{MFAudio.tone(45,.12,0,.65);MFAudio.tone(45,.12,.45,.5);} }
  }
};
