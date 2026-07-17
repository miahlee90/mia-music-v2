/* Lesson 24 — Naturals (AEMT Book 1, Unit 6)
   Built from drafts/UNIT 6 – Lessons 22, 23 & 24.md (combined draft — pages stay separate, DD-12).
   QA notes honored: ♮ = back to the ORIGINAL pitch; the full accidental system
   (raise / lower / cancel + one-measure rule) consolidated here.
   NOTE: edit by FULL-FILE REWRITE only. */

/* which-accidental drill (unique L24 prefix) */
function MF_L24_whichAcc(container,fb){
  const rounds=[
    {q:"You want F to become the black key to its RIGHT.",a:0},
    {q:"You want B to become the black key to its LEFT.",a:1},
    {q:"An F♯ appeared earlier this measure — you want F natural again NOW.",a:2},
    {q:"You want E one half step LOWER.",a:1},
    {q:"A B♭ appeared this measure — you want the original B back.",a:2},
    {q:"You want C one half step HIGHER.",a:0}];
  let i=0;
  container.innerHTML=`<div class="big-q wa-q" style="text-align:center;min-height:50px"></div>
    <div class="choices chips wa-ch"><button>♯</button><button>♭</button><button>♮</button></div>`;
  const q=container.querySelector(".wa-q"), ch=container.querySelector(".wa-ch");
  function ask(){ q.textContent=`Job ${i+1} of ${rounds.length}: `+rounds[i].q+" Which sign?"; }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=rounds[i], ok=bi===cur.a;
    if(ok){ MFAudio.tone([73,70,71][cur.a],.3); i++;
      if(i>=rounds.length){ ch.style.display="none"; q.textContent="Full accidental toolbox!";
        fb(true,"✓ Raise with ♯, lower with ♭, cancel with ♮ — six jobs, six right answers!"); }
      else { fb(true,`✓ ${["Sharp — up!","Flat — down!","Natural — back to the original!"][cur.a]} Next job…`); ask(); } }
    else { MFAudio.tone(40,.25); fb(false,"Think: up = ♯, down = ♭, back-to-original = ♮."); }
  });
  ask();
}

LESSON_CONTENT[24]={
  welcome:"The undo button of music. \u{1F504}",
  hook:{
    say:"Sharps raise, flats lower… but what if you want the ORIGINAL note back <b>in the same measure</b>? Press play — F♯, F♯… then something cancels it. <b>What happened?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Sharp, sharp… cancel!</button></div>
          <div class="choices hk-ch" style="display:none"><button>The last note returned to F natural</button><button>The last note went even higher</button><button>Nothing changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(66,.6,0); MFAudio.tone(66,.6,.7); MFAudio.tone(65,.9,1.4);
          setTimeout(()=>{ ch.style.display=""; },2600);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Back to the original F! The sign that cancels sharps and flats is the NATURAL (♮) — music's undo button.");
          else fb(false,"Listen to the last note — it slid back DOWN to where F started.");
        });
      } }
  },
  objectives:[
    "Identify the natural sign (♮)",
    "Explain that a natural cancels a previous sharp or flat",
    "Return notes to their original pitch",
    "Use all three accidentals correctly",
    "Apply the one-measure rule with naturals",
    "Read melodies mixing sharps, flats and naturals"
  ],
  steps:[
    { say:"The <b>natural (♮)</b> <b>cancels</b> a previous sharp or flat and returns the note to its <b>original pitch</b> — the plain white-key note. It's the accidental family's <b>undo button</b>. \u{1F447} <b>What does a natural do?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"F#4",d:"q",label:"F♯"},{p:"F4",acc:"n",d:"q",label:"F♮ — back to normal"}],width:340} },
      try:{ type:"mc",
        choices:["Cancels a sharp or flat — back to the original","Raises the note even higher","Lowers the note even lower"], answer:0,
        success:"✓ Cancel and restore — the original pitch returns instantly.",
        fail:"The natural neither raises nor lowers beyond the original — it RESTORES.",
        hint:"\u{1F504} undo." } },
    { say:"Why do we need it? Because of the <b>one-measure rule</b>! Once F♯ appears, every F stays sharp until the bar line — <b>unless a natural steps in</b>. \u{1F447} <b>How does the F after the ♮ sound?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[{p:"F#4",d:"q",label:"F♯"},{p:"F4",d:"q",label:"(F♯)"},{p:"F4",acc:"n",d:"q",label:"F♮!"},{p:"F4",d:"q",label:"(F♮)"},{bar:"final"}],width:460} },
      try:{ type:"mc",
        choices:["Plain F — the natural canceled the sharp for the rest of the measure","F♯ — sharps can't be canceled","F♭"], answer:0,
        success:"✓ The natural takes over: from that point on, F is plain again (and IT also lasts until the bar line).",
        fail:"The ♮ switched the sharp OFF mid-measure.",
        hint:"Undo pressed on beat 3." } },
    { say:"Hear the cancel in action. \u{1F447} <b>Press play and follow:</b>",
      try:{ type:"custom",
        hint:"Sharp… sharp… NATURAL — hear the pitch step back down.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:88,
            notes:[{p:"F#4",d:"q",label:"F♯"},{p:"F4",d:"q",label:"(F♯)"},{p:"F4",acc:"n",d:"q",label:"F♮"},{p:"F4",d:"q",label:"(F♮)"},{bar:"final"}],width:440};
          container.innerHTML=`<div class="nc-staff"></div><div style="text-align:center"><button class="play nc-play">▶ Play the cancel</button></div>`;
          const api=Staff.render(container.querySelector(".nc-staff"),spec);
          container.querySelector(".nc-play").onclick=()=>{
            const spb=60/88;
            [[66,0],[66,1],[65,2],[65,3]].forEach(([m,b],idx)=>{ MFAudio.tone(m,spb*.9,b*spb); setTimeout(()=>api.highlight(idx),b*spb*1000); });
            setTimeout(()=>{ api.highlight(null);
              fb(true,"✓ Two sharped F's, then the ♮ pressed undo — the last two F's were plain again!"); },4*spb*1000+400);
          };
        } } },
    { say:"The complete toolbox: <b>♯ raise · ♭ lower · ♮ cancel</b>. \u{1F447} <b>Pick the right tool for each job:</b>",
      try:{ type:"custom",
        hint:"Up = ♯, down = ♭, back-to-original = ♮.",
        mount:(container,fb)=>MF_L24_whichAcc(container,fb) } },
    { say:"One more look at the whole system: accidentals last <b>until the bar line</b>, naturals included. \u{1F447} <b>What happens to accidentals at the bar line?</b>",
      try:{ type:"mc",
        choices:["It resets — accidentals never cross the bar line","It stays canceled forever","The note becomes sharp again automatically"], answer:0,
        success:"✓ Every measure starts clean — sharps, flats AND naturals all expire at the bar line.",
        fail:"The bar line resets EVERYTHING — including naturals.",
        hint:"The reset button spares no accidental." } }
  ],
  examples:[
    { caption:"The natural sign cancels a sharp: F♯ … F♮ — hear the half step fall back into place.",
      staff:{clef:"treble",tempo:88,notes:[{p:"F#4",d:"h",label:"F♯"},{p:"F4",acc:"n",d:"h",label:"F♮"}],width:360} },
    { caption:"It cancels flats too: B♭ … B♮ — the undo button works in both directions.",
      staff:{clef:"treble",tempo:88,notes:[{p:"Bb4",d:"h",label:"B♭"},{p:"B4",acc:"n",d:"h",label:"B♮"}],width:360} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Three-Sign Hunt",
      intro:"Sharp, flat, natural — the full family on real notes. Click what Mia names!",
      miaIntro:"All three signs in play — sharpest eyes win! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Natural sign (F♮)", spec:{clef:"treble",notes:[{p:"F4",acc:"n",d:"q"}]}},
        {label:"Sharp sign (F♯)", spec:{clef:"treble",notes:[{p:"F#4",d:"q"}]}},
        {label:"Flat sign (B♭)", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}]}},
        {label:"Plain note (no accidental)", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}}]},
      result:(score)=>score>=5?"♯ ♭ ♮ — instantly told apart!":null },
    { type:"term-race", title:"Game 2 · Accidental System Dash",
      intro:"The complete system at speed — raise, lower, cancel, reset!",
      miaIntro:"Everything you know about accidentals — fast! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Sharp (♯)","Raises a note by one half step"],
        ["Flat (♭)","Lowers a note by one half step"],
        ["Natural (♮)","Cancels a sharp or flat — original pitch"],
        ["Accidental","A sign that changes a note's pitch"],
        ["Bar Line","Resets ALL accidentals"],
        ["One-Measure Rule","An accidental lasts until the next bar line"]]},
      result:(score)=>score>=7?"The whole system, mastered!":null },
    { type:"rhythm-tap", title:"Game 3 · Tap Review",
      intro:"Rhythm check-in — dotted pairs and eighths, tap them back!",
      miaIntro:"Hands stay in shape! \u{1F44F}",
      spec:{tempo:92, rounds:3, patterns:[["q.","8","q","q"],["8","8","q","h"],["q","rq","q","q"]]},
      result:(score)=>score>=8?"Rhythm engine still purring!":null },
    { type:"term-race", title:"Game 4 · Reverse System Dash (45s)",
      intro:"Mia names the JOB, you name the SIGN — 45 seconds!",
      miaIntro:"Final sprint — jobs to signs! \u{23F1}",
      spec:{seconds:45, reverse:true, pool:[
        ["♯","Raises a note by one half step"],
        ["♭","Lowers a note by one half step"],
        ["♮","Cancels a previous sharp or flat"],
        ["Bar line","Resets all accidentals automatically"]]},
      result:(score)=>score>=12?score+" — instant sign recall!":null }
  ],
  practiceIntro:"20 practice questions — the natural's job and the complete accidental system. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"sign", pool:[["Natural (♮)","Cancels a sharp or flat"],["Sharp (♯)","Raises a note by one half step"],["Flat (♭)","Lowers a note by one half step"],["Bar Line","Resets all accidentals"]], reverse:true}, count:6 },
    { gen:"click-key", params:{letters:["F","B","C"], octaves:[4]}, count:2 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"A natural (♮)…", choices:["cancels a previous sharp or flat","raises the pitch","lowers the pitch"], answer:0,
      explain:"Back to the original — the undo button." },
    { type:"truefalse", q:"After a natural, the note sounds at its original (white-key) pitch.", answer:true,
      explain:"Restored exactly." },
    { type:"mc", q:"F♯ appeared on beat 1. On beat 3 you see F♮. Beat 4 has another F. It sounds…", choices:["F natural — the natural still applies","F♯ again","F♭"], answer:0,
      explain:"The natural ALSO lasts until the bar line." },
    { type:"truefalse", q:"Naturals can cancel flats as well as sharps.", answer:true,
      explain:"Both directions — one undo button." },
    { type:"mc", q:"The natural sign looks like…", choices:["a small open box with two tails","a hashtag","a lowercase b"], answer:0,
      explain:"Two verticals with two crossbars — the little box." },
    { type:"truefalse", q:"A natural placed in one measure still applies in the NEXT measure.", answer:false,
      explain:"Bar line resets everything — naturals too." },
    { type:"mc", q:"The three accidentals are…", choices:["sharp, flat, natural","sharp, flat, fermata","tie, slur, natural"], answer:0,
      explain:"Raise, lower, cancel — the complete kit." },
    { type:"truefalse", q:"Without a natural, an F after an F♯ (same measure) stays sharp.", answer:true,
      explain:"One-measure rule — only the ♮ can cancel it early." }
  ],
  miaQuizIntro:"Quiz time! Raise, lower, CANCEL — use the whole toolbox!",
  quiz:[
    { type:"mc", q:"What does a natural (♮) do?", choices:["Raises the pitch","Lowers the pitch","Cancels a previous sharp or flat","Repeats the note"], answer:2,
      explain:"The undo button — original pitch restored.", hint:"\u{1F504}" },
    { type:"mc", q:"F♯ → F♮ means the pitch…", choices:["went back DOWN to F natural","went even higher","stayed sharp"], answer:0,
      explain:"Cancel the sharp, restore the original.", hint:"Undo!" },
    { type:"mc", q:"B♭ → B♮ means the pitch…", choices:["went back UP to B natural","went even lower","stayed flat"], answer:0,
      explain:"Canceling a flat brings the note back UP.", hint:"Undo works both ways." },
    { type:"truefalse", q:"A natural can cancel both sharps and flats.", answer:true,
      explain:"One button, both directions.", hint:"Universal undo." },
    { type:"truefalse", q:"A natural raises every note.", answer:false,
      explain:"It RESTORES — up from a flat, down from a sharp.", hint:"Direction depends on what it cancels." },
    { type:"mc", q:"Which symbol is the NATURAL?",
      staff:{clef:"treble",notes:[{p:"F#4",d:"q",label:"1"},{p:"F4",acc:"n",d:"q",label:"2"},{p:"Bb4",d:"q",label:"3"}],width:360},
      choices:["1","2","3"], answer:1,
      explain:"The little open box on note 2. (1 = sharp, 3 = flat.)",
      hint:"The box shape." },
    { type:"mc", q:"Which matching is correct?",
      choices:["♯ → raise · ♭ → lower · ♮ → cancel",
               "♯ → cancel · ♭ → raise · ♮ → lower",
               "♯ → lower · ♭ → cancel · ♮ → raise"], answer:0,
      explain:"The complete accidental toolbox.", hint:"Up, down, undo." },
    { type:"mc", q:"An accidental (including a natural) remains in effect until…", choices:["the next bar line","the end of the piece","the next note only"], answer:0,
      explain:"The one-measure rule governs all three signs.", hint:"The reset button." },
    { type:"mc", q:"A natural returns a note to its ____ pitch.", choices:["original","highest","lowest"], answer:0,
      explain:"Exactly where it started.", hint:"Undo restores." },
    { type:"truefalse", q:"In this measure, the LAST F sounds plain (natural).",
      staff:{clef:"treble",time:"4/4",notes:[{p:"F#4",d:"q"},{p:"F4",d:"q"},{p:"F4",acc:"n",d:"q"},{p:"F4",d:"q"},{bar:"final"}],width:420},
      answer:true,
      explain:"The ♮ on beat 3 canceled the sharp for the rest of the measure.", hint:"Follow the signs left to right." },
    { type:"mc", q:"Why would a composer write a natural?", choices:["To restore the original note inside a measure with an accidental","To make the note louder","To end the piece"], answer:0,
      explain:"The only way to cancel an accidental before the bar line.",
      hint:"Mid-measure undo." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A sharp lowers a note","A natural raises every note","An accidental affects every note of the same letter on the same line or space for the rest of the measure","Accidentals remain in effect throughout the entire piece"], answer:2,
      explain:"The Big Rule of accidentals.", hint:"The one-measure rule." },
    /* generated */
    { gen:"term-match", params:{subject:"sign", pool:[["♯","Raises a note by one half step"],["♭","Lowers a note by one half step"],["♮","Cancels a previous sharp or flat"],["Bar line","Resets all accidentals"]], reverse:true}, count:4 },
    { gen:"click-key", params:{letters:["F","B"], octaves:[4]}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 }
  ],
  vocabulary:[
    {def:"A natural sign before a note cancels a previous flat or sharp.", term:"Natural (♮)", staff:{clef:"none",notes:[{p:"F4",acc:"n",d:"q"}],width:140}},
    {def:"Flat, sharp and natural signs that appear within a piece of music.", term:"Accidentals"},
    {def:"An accidental affects the notes following it, for that measure only.", term:"One-Measure Rule"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Natural (♮)</b> = the <b>undo button</b>: cancels sharps AND flats.",
    "✔ After a ♮, the note sounds at its <b>original pitch</b>.",
    "✔ The complete kit: <b>♯ raise · ♭ lower · ♮ cancel</b>.",
    "✔ ALL accidentals — naturals included — <b>expire at the bar line</b>.",
    "✔ Mid-measure cancel? Only the natural can do it."
  ],
  tips:[
    "Read accidentals left to right through the measure, like a story: sharp… still sharp… CANCELED.",
    "The ♮'s little box shape = “back in the box” — back to normal.",
    "When practicing piano, say the sign aloud as you play: “F-sharp… F-natural.”",
    "\u{1F463} Next lesson: measuring distances — half steps, whole steps, and notes with TWO names!"
  ],
  rewards:{ badge:"Natural Master", icon:"\u{1F504}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — raise, lower, cancel, all under control! One more lesson in this unit! \u{1F504}\u{1F389}",
  miaPass:"You passed! The undo button is yours. Review below or run it back for perfection.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The natural cancels any sharp or flat and restores the original pitch — music's undo button.",
      play:()=>{MFAudio.tone(66,.5,0);MFAudio.tone(66,.5,.6);MFAudio.tone(65,.8,1.2);} },
    learn:{ label:"the natural",
      explain:"♮ cancels ♯ or ♭ and lasts until the bar line, like every accidental. It's the only mid-measure cancel.",
      hint:"Up = ♯, down = ♭, undo = ♮.",
      play:()=>{[66,65,70,71].forEach((m,k)=>MFAudio.tone(m,.4,k*.5));} },
    example:{ label:"the examples",
      explain:"Hear both cancels: F♯ falling back to F♮, and B♭ rising back to B♮ — the undo works in both directions." },
    game:{ label:"the games",
      explain:"Tell all three signs apart, race the system vocabulary, and keep your rhythm hands warm.",
      hint:"Three signs, three jobs — raise, lower, cancel." },
    quiz:{ label:"this question",
      explain:"The natural restores the original pitch and obeys the same one-measure rule as every accidental.",
      play:()=>{MFAudio.tone(65,.8,0);} }
  }
};
