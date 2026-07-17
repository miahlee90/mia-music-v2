/* Lesson 23 — Sharps (AEMT Book 1, Unit 6)
   Built from drafts/UNIT 6 – Lessons 22, 23 & 24.md (combined draft — pages stay separate, DD-12).
   QA notes honored: ♯ = one key to the RIGHT (keyboard ↔ pitch direction),
   one-measure rule reinforced from L22.
   NOTE: edit by FULL-FILE REWRITE only. */

/* find-the-sharp-key drill (unique L23 prefix) */
function MF_L23_sharpKey(container,fb){
  const rounds=[{from:"C4",to:"C#4",name:"C♯"},{from:"F4",to:"F#4",name:"F♯"},{from:"G4",to:"G#4",name:"G♯"},{from:"D4",to:"D#4",name:"D♯"}];
  let i=0;
  container.innerHTML=`<div class="big-q sk-q" style="text-align:center"></div><div class="sk-kb"></div>`;
  const q=container.querySelector(".sk-q");
  function ask(){
    const cur=rounds[i];
    q.innerHTML=`Key ${i+1} of ${rounds.length}: this is <b>${cur.from[0]}</b> — now click <b>${cur.name}</b> (one key to the RIGHT).`;
    Keyboard.create(container.querySelector(".sk-kb"),{start:60,octaves:2,labels:false,marks:[MFAudio.midi(cur.from)],
      onKey:m=>{
        const target=MFAudio.midi(cur.to);
        if(m===target){ i++;
          if(i>=rounds.length){ q.textContent="Sharp shooter!";
            fb(true,"✓ Four sharps found — always ONE key to the right, one half step HIGHER. ⬆️"); }
          else { fb(true,`✓ ${cur.name} — the black key just right of ${cur.from[0]}. Next…`); ask(); } }
        else if(m===MFAudio.midi(cur.from)) fb(false,`That's plain ${cur.from[0]} — the sharp lives one key to its RIGHT.`);
        else fb(false,"Start on the marked key and move exactly ONE key right — black or white!");
      }});
  }
  ask();
}

LESSON_CONTENT[23]={
  welcome:"Yesterday down — today UP! ⬆️",
  hook:{
    say:"The flat pulled notes down. Meet its opposite! Press play — C, then C-sharp. <b>Which way now?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ C… then C♯</button></div>
          <div class="choices hk-ch" style="display:none"><button>⬆️ UP — a little higher</button><button>⬇️ DOWN — a little lower</button><button>The same</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(60,.8,0); MFAudio.tone(61,.8,1.0);
          setTimeout(()=>{ ch.style.display=""; },2100);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ UP one half step — the SHARP (♯) is the pitch-raising machine!");
          else fb(false,"Listen again — the second note climbs just a little…");
        });
      } }
  },
  objectives:[
    "Identify the sharp sign (♯)",
    "Explain that a sharp raises a note by one half step",
    "Find sharp notes on the keyboard (one key to the RIGHT)",
    "Read sharp notes on the staff",
    "Apply the one-measure rule with sharps",
    "Tell sharps and flats apart instantly"
  ],
  steps:[
    { say:"A <b>sharp (♯)</b> <b>raises</b> a note by <b>one half step</b>: on the keyboard, move <b>one key to the RIGHT</b>. It's the flat's mirror twin. \u{1F447} <b>What does a sharp do to a note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"q",label:"C"},{p:"C#4",d:"q",label:"C♯ — a half step higher"}],width:340} },
      try:{ type:"mc",
        choices:["Raises it by one half step","Lowers it by one half step","Doubles its length"], answer:0,
        success:"✓ Up one half step — the very next key to the right.",
        fail:"Sharp = HIGHER. Think of a sharp arrow pointing up…",
        hint:"⬆️ right and higher." } },
    { say:"C♯ is the black key just <b>right</b> of C; F♯ just right of F. \u{1F447} <b>Find the sharps:</b>",
      try:{ type:"custom",
        hint:"Marked key, then ONE key right.",
        mount:(container,fb)=>MF_L23_sharpKey(container,fb) } },
    { say:"The <b>one-measure rule</b> works exactly the same for sharps: one printed ♯ rules every matching note until the <b>bar line</b>. \u{1F447} <b>How does the THIRD F (no sign) sound in this measure?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[{p:"F#4",d:"q",label:"F♯"},{p:"A4",d:"q",label:"A"},{p:"F4",d:"q",sound:"F#4",label:"still F♯!"},{p:"A4",d:"q",label:"A"},{bar:"single"},{p:"F4",d:"w",label:"F natural again"},{bar:"final"}],width:470} },
      try:{ type:"mc",
        choices:["F♯ — the sharp still applies in this measure","Plain F — sharps affect only one note","F♭"], answer:0,
        success:"✓ Same letter, same measure — the sharp is still switched on until the bar line.",
        fail:"Check the measure: has a bar line passed since the ♯ appeared?",
        hint:"One-measure rule — same as flats." } },
    { say:"Sharp vs flat — the mirror test! \u{1F447} <b>Answer fast:</b>",
      try:{ type:"custom",
        hint:"♯ up/right · ♭ down/left.",
        mount:(container,fb)=>{
          const rounds=[
            {q:"Which sign RAISES a note?",a:0},{q:"Which sign moves you one key LEFT?",a:1},
            {q:"Which sign makes C become the black key to its right?",a:0},
            {q:"Which sign makes B become the black key to its left?",a:1},
            {q:"Which sign points “up” in pitch?",a:0}];
          let i=0;
          container.innerHTML=`<div class="big-q sf-q" style="text-align:center;min-height:44px"></div>
            <div class="choices chips sf-ch"><button>♯ Sharp</button><button>♭ Flat</button></div>`;
          const q=container.querySelector(".sf-q"), ch=container.querySelector(".sf-ch");
          function ask(){ q.textContent=`Round ${i+1} of ${rounds.length}: `+rounds[i].q; }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[i], ok=bi===cur.a;
            if(ok){ MFAudio.tone(cur.a===0?73:70,.3); i++;
              if(i>=rounds.length){ ch.style.display="none"; q.textContent="Mirror twins mastered!";
                fb(true,"✓ Sharp up-right ⬆️, flat down-left ⬇️ — you'll never mix them again!"); }
              else { fb(true,"✓ Right! Next…"); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,"Remember the mirror: ♯ = up/right, ♭ = down/left."); }
          });
          ask();
        } } },
    { say:"Read a melody WITH sharps — hear the bright “lift” each sharp adds. \u{1F447}",
      try:{ type:"custom",
        hint:"Both F's in measure 1 are sharp — the sign carries through the measure.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:96,
            notes:[{p:"E4",d:"q",label:"E"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"F4",d:"q",label:"(F♯)"},{bar:"single"},{p:"E4",d:"w",label:"E"},{bar:"final"}],width:460};
          container.innerHTML=`<div class="rs-staff"></div><div style="text-align:center"><button class="play rs-play">▶ Play & listen</button></div>`;
          const api=Staff.render(container.querySelector(".rs-staff"),spec);
          container.querySelector(".rs-play").onclick=()=>{
            const spb=60/96;
            const seq=[[64,0],[66,1],[67,2],[66,3]];
            seq.forEach(([m,b],idx)=>{ MFAudio.tone(m,spb*.9,b*spb); setTimeout(()=>api.highlight(idx),b*spb*1000); });
            MFAudio.tone(64,4*spb*.9,4*spb); setTimeout(()=>api.highlight(5),4*spb*1000);
            setTimeout(()=>{ api.highlight(null);
              fb(true,"✓ Both F's sounded SHARP — one printed ♯, two raised notes, then the bar line reset it all."); },8*spb*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"C and C♯, F and F♯ — each sharp climbs one half step to the black key on the right.",
      staff:{clef:"treble",tempo:80,notes:[{p:"C4",d:"h",label:"C"},{p:"C#4",d:"h",label:"C♯"},{p:"F4",d:"h",label:"F"},{p:"F#4",d:"h",label:"F♯"}],width:440} },
    { caption:"One printed ♯, two sharp F's — then the bar line resets. The one-measure rule never changes.",
      staff:{clef:"treble",tempo:96,time:"4/4",notes:[{p:"F#4",d:"h",label:"F♯"},{p:"F4",d:"h",sound:"F#4",label:"(still F♯)"},{bar:"single"},{p:"F4",d:"w",label:"F natural"},{bar:"final"}],width:440} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Spot the Sharp",
      intro:"Sharps, flats, plain notes — click exactly what Mia names. The hashtag-lookalike is your target!",
      miaIntro:"Hunt the pitch-raiser! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Sharp sign (F♯)", spec:{clef:"treble",notes:[{p:"F#4",d:"q"}]}},
        {label:"Flat sign (B♭)", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}]}},
        {label:"Plain F (no accidental)", spec:{clef:"treble",notes:[{p:"F4",d:"q"}]}},
        {label:"C♯", spec:{clef:"treble",notes:[{p:"C#4",d:"q"}]}},
        {label:"Eighth Note", spec:{clef:"treble",notes:[{p:"B4",d:"8"}]}}]},
      result:(score)=>score>=5?"Sharp eyes for sharp signs!":null },
    { type:"term-race", title:"Game 2 · Up or Down Dash",
      intro:"Sharp facts vs flat facts — sort them at speed!",
      miaIntro:"Mirror-twin quiz — fast! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Sharp (♯)","Raises a note by one half step"],
        ["Flat (♭)","Lowers a note by one half step"],
        ["♯ on the keyboard","One key to the RIGHT"],
        ["♭ on the keyboard","One key to the LEFT"],
        ["Accidental","A sign that changes a note's pitch"],
        ["Bar line","Cancels accidentals automatically"]]},
      result:(score)=>score>=7?"Up, down, left, right — never confused!":null },
    { type:"rhythm-tap", title:"Game 3 · Tap Review",
      intro:"Rhythm stays sharp too — tap these back in time!",
      miaIntro:"Hands warm, brain sharp! \u{1F44F}",
      spec:{tempo:96, rounds:3, patterns:[["q","q","q","q"],["q.","8","h"],["8","8","h","q"]]},
      result:(score)=>score>=8?"Rhythm precision maintained!":null },
    { type:"value-race", title:"Game 4 · Rest Family Sprint (45s)",
      intro:"45 seconds of RESTS — all four, from the hole to the little 7!",
      miaIntro:"Silence sprint! \u{23F1}",
      spec:{seconds:45, ask:"name", kind:"rest", values:["w","h","q","8"]},
      result:(score)=>score>=13?score+" — the rest family never forgets you!":null }
  ],
  practiceIntro:"20 practice questions — the sharp's job, keyboard direction, and the rule. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"sign", pool:[["Sharp (♯)","Raises a note by one half step"],["Flat (♭)","Lowers a note by one half step"],["Accidental","A sign that changes a note's pitch"],["Bar Line","Cancels accidentals when the measure ends"]], reverse:true}, count:5 },
    { gen:"click-key", params:{letters:["C","F","G"], octaves:[4]}, count:3 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"A sharp (♯) makes a note…", choices:["one half step HIGHER","one half step lower","one beat longer"], answer:0,
      explain:"Up — one key to the right." },
    { type:"mc", q:"On the keyboard, C♯ is…", choices:["one key RIGHT of C","one key LEFT of C","the same key as C"], answer:0,
      explain:"Sharps always move right/higher." },
    { type:"truefalse", q:"A sharp affects every same-letter note until the bar line.", answer:true,
      explain:"The one-measure rule — same as flats." },
    { type:"truefalse", q:"The sharp sign looks a little like a hashtag (#).", answer:true,
      explain:"Two verticals, two slanted horizontals." },
    { type:"mc", q:"Sharp and flat are…", choices:["mirror opposites — up vs down","the same thing","both pitch-raisers"], answer:0,
      explain:"♯ raises, ♭ lowers — by the same half step." },
    { type:"truefalse", q:"F♯ is the black key just right of F.", answer:true,
      explain:"One half step up from F." },
    { type:"mc", q:"After a bar line, a sharp from the previous measure…", choices:["no longer applies","still applies","applies to every instrument"], answer:0,
      explain:"Reset! Each measure starts clean." },
    { type:"truefalse", q:"Sharps often make music feel brighter or more energetic.", answer:true,
      explain:"That little lift upward adds sparkle." }
  ],
  miaQuizIntro:"Quiz time! Sharp = RIGHT and HIGHER. Climb!",
  quiz:[
    { type:"mc", q:"What does a sharp (♯) do?", choices:["Lowers the pitch","Raises the pitch by one half step","Cancels a flat","Holds the note longer"], answer:1,
      explain:"Up one half step — one key right.", hint:"⬆️" },
    { type:"mc", q:"On the keyboard, a sharp moves you…", choices:["one key to the RIGHT","one key to the LEFT","down an octave"], answer:0,
      explain:"Right = higher.", hint:"Sharp arrow points up." },
    { type:"truefalse", q:"A sharp raises a note by one half step.", answer:true,
      explain:"The pitch-raising machine.", hint:"⬆️ right." },
    { type:"truefalse", q:"A sharp and a flat move a note in the same direction.", answer:false,
      explain:"Mirror twins — ♯ up, ♭ down.", hint:"Opposites!" },
    { type:"mc", q:"Which note is C♯?",
      staff:{clef:"treble",notes:[{p:"C4",d:"q",label:"1"},{p:"C#4",d:"q",label:"2"}],width:300},
      choices:["1","2"], answer:1,
      explain:"Note 2 carries the ♯ before its head.", hint:"Find the hashtag-lookalike." },
    { type:"mc", q:"A sharp raises a note by one ____ step.", choices:["half","whole","quarter"], answer:0,
      explain:"Half step — the very next key.", hint:"Smallest move." },
    { type:"truefalse", q:"In this measure, BOTH F's sound sharp.",
      staff:{clef:"treble",time:"4/4",notes:[{p:"F#4",d:"h"},{p:"F4",d:"h"},{bar:"final"}],width:340},
      answer:true,
      explain:"One printed ♯ rules every F until the bar line.", hint:"One-measure rule." },
    { type:"mc", q:"Which matching is correct?",
      choices:["♯ → raise · ♭ → lower · bar line → reset",
               "♯ → lower · ♭ → raise · bar line → repeat",
               "♯ → louder · ♭ → softer · bar line → stop"], answer:0,
      explain:"Up, down, and the automatic reset.", hint:"The accidental system." },
    { type:"mc", q:"F♯ on the piano is…", choices:["the black key just right of F","the black key just left of F","the white key F itself"], answer:0,
      explain:"One half step UP from F.", hint:"Right = up." },
    { type:"mc", q:"An accidental stops applying when…", choices:["the measure ends at the bar line","the note repeats","the line of music ends"], answer:0,
      explain:"Bar line = off switch.", hint:"Same rule as Lesson 22." },
    { type:"mc", q:"The sharp symbol looks most like…", choices:["a hashtag #","a lowercase b","a circle with a cross"], answer:0,
      explain:"♯ — two verticals, two slants.", hint:"Social-media friendly." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A sharp lowers a note","A sharp raises every note of the same letter until the bar line","A sharp lasts the whole piece","A sharp cancels a flat forever"], answer:1,
      explain:"Raise + one-measure rule, in one sentence.", hint:"Two facts combined." },
    /* generated */
    { gen:"term-match", params:{subject:"sign", pool:[["Sharp (♯)","Raises a note by one half step"],["Flat (♭)","Lowers a note by one half step"],["Bar Line","Cancels accidentals when the measure ends"],["Accidental","A sign that changes a note's pitch"]], reverse:true}, count:4 },
    { gen:"click-key", params:{letters:["C","F","G"], octaves:[4]}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 }
  ],
  vocabulary:[
    {def:"Raises the pitch by one half step.", term:"Sharp (♯)", staff:{clef:"none",notes:[{p:"F#4",d:"q"}],width:140}},
    {def:"Lowers the pitch by one half step.", term:"Flat (♭)", staff:{clef:"none",notes:[{p:"Bb4",d:"q"}],width:140}},
    {def:"A flat, sharp or natural sign that appears within a piece of music.", term:"Accidental"},
    {def:"An accidental affects the notes on the same line or space following it, for that measure only.", term:"One-Measure Rule"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Sharp (♯)</b> = one half step <b>HIGHER</b> — one key to the <b>right</b>. ⬆️",
    "✔ Sharp and flat are <b>mirror twins</b>: ♯ up, ♭ down.",
    "✔ The sign sits <b>before the notehead</b>, and you say it after: “F-sharp.”",
    "✔ <b>One-measure rule</b>: the sharp rules until the bar line.",
    "✔ C♯, F♯, G♯, D♯ — black keys just RIGHT of their white neighbors."
  ],
  tips:[
    "Point up and say “sharp,” point down and say “flat” — anchor the directions in your body.",
    "The ♯ looks like a ladder — and ladders go UP!",
    "See one sharp? Scan the rest of the measure for that letter before you play on.",
    "\u{1F504} Next lesson: the sign that CANCELS both — the natural!"
  ],
  rewards:{ badge:"Sharp Expert", icon:"⬆️" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — every sharp climbed on cue! The natural sign brings everything home next. ⬆️\u{1F389}",
  miaPass:"You passed! Right and higher — locked in. Review below or climb again for perfection.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The sharp is the flat's mirror twin: one half step UP, one key to the right.",
      play:()=>{MFAudio.tone(60,.6,0);MFAudio.tone(61,.9,.7);} },
    learn:{ label:"the sharp",
      explain:"♯ = up a half step (one key right). Same placement, same one-measure rule as the flat — just the opposite direction.",
      hint:"⬆️ right, higher, until the bar line.",
      play:()=>{[64,66,67,66].forEach((m,k)=>MFAudio.tone(m,.45,k*.45));} },
    example:{ label:"the examples",
      explain:"Hear C lift to C♯ and F to F♯ — then one printed sharp control two notes before the reset." },
    game:{ label:"the games",
      explain:"Hunt sharps among flats, sort up-facts from down-facts, and keep rhythm and rests warm.",
      hint:"Mirror twins: ♯ climbs, ♭ sinks." },
    quiz:{ label:"this question",
      explain:"Sharp = half step up (right); accidentals last until the bar line. The rest is reading carefully.",
      play:()=>{MFAudio.tone(61,.8,0);} }
  }
};
