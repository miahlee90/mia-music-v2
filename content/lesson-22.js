/* Lesson 22 — Flats (AEMT Book 1, Unit 6)
   Built from drafts/UNIT 6 – Lessons 22, 23 & 24.md (combined draft — pages stay separate, DD-12).
   QA notes honored: ♭ = one key to the LEFT (keyboard direction ↔ pitch direction),
   and the ONE-MEASURE RULE introduced with highlighted affected notes.
   NOTE: edit by FULL-FILE REWRITE only. */

/* find-the-flat-key drill (unique L22 prefix) */
function MF_L22_flatKey(container,fb){
  const rounds=[{from:"B4",to:"Bb4",name:"B♭"},{from:"E4",to:"Eb4",name:"E♭"},{from:"A4",to:"Ab4",name:"A♭"},{from:"D4",to:"Db4",name:"D♭"}];
  let i=0,api=null;
  container.innerHTML=`<div class="big-q fk-q" style="text-align:center"></div><div class="fk-kb"></div>`;
  const q=container.querySelector(".fk-q");
  function ask(){
    const cur=rounds[i];
    q.innerHTML=`Key ${i+1} of ${rounds.length}: this is <b>${cur.from[0]}</b> — now click <b>${cur.name}</b> (one key to the LEFT).`;
    api=Keyboard.create(container.querySelector(".fk-kb"),{start:60,octaves:2,labels:false,marks:[MFAudio.midi(cur.from)],
      onKey:m=>{
        const target=MFAudio.midi(cur.to);
        if(m===target){ i++;
          if(i>=rounds.length){ q.textContent="Flat finder!";
            fb(true,"✓ Four flats found — always ONE key to the left, one half step LOWER. ⬇️"); }
          else { fb(true,`✓ ${cur.name} — the black key just left of ${cur.from[0]}. Next…`); ask(); } }
        else if(m===MFAudio.midi(cur.from)) fb(false,`That's plain ${cur.from[0]} — the flat lives one key to its LEFT.`);
        else fb(false,"Count carefully: start on the marked key and move exactly ONE key left — black or white!");
      }});
  }
  ask();
}

LESSON_CONTENT[22]={
  welcome:"Unit 6! Today notes learn to duck DOWN. ⬇️",
  hook:{
    say:"Have you ever wished you could make a note just a little <b>lower</b>? That's exactly what a <b>flat (♭)</b> does! Press play — B, then B-flat. <b>Which way did the pitch move?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ B… then B♭</button></div>
          <div class="choices hk-ch" style="display:none"><button>⬇️ DOWN — a little lower</button><button>⬆️ UP — a little higher</button><button>It stayed the same</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(71,.8,0); MFAudio.tone(70,.8,1.0);
          setTimeout(()=>{ ch.style.display=""; },2100);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Down — by the smallest step in music, a HALF STEP. The flat is a pitch-lowering machine!");
          else fb(false,"Listen again — the second note sinks just a little…");
        });
      } }
  },
  objectives:[
    "Identify the flat sign (♭)",
    "Explain that a flat lowers a note by one half step",
    "Find flat notes on the keyboard (one key to the LEFT)",
    "Read flat notes on the staff",
    "Apply the one-measure rule for accidentals",
    "Play simple melodies containing flats"
  ],
  steps:[
    { say:"A <b>flat (♭)</b> is an <b>accidental</b> — a pitch changer. It <b>lowers</b> a note by <b>one half step</b>: on the keyboard, move <b>one key to the LEFT</b> (black or white!). \u{1F447} <b>What does a flat do to a note?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"q",label:"B"},{p:"Bb4",d:"q",label:"B♭ — a half step lower"}],width:340} },
      try:{ type:"mc",
        choices:["Lowers it by one half step","Raises it by one half step","Makes it louder"], answer:0,
        success:"✓ Down one half step — the very next key to the left.",
        fail:"Flat = LOWER. Think of a flat tire sinking down…",
        hint:"⬇️ left and lower." } },
    { say:"On the staff, the flat sign sits just <b>before the notehead</b>, on the same line or space. On the keyboard, B♭ is the black key just <b>left</b> of B. \u{1F447} <b>Find the flats:</b>",
      try:{ type:"custom",
        hint:"Start on the marked key, slide ONE key left.",
        mount:(container,fb)=>MF_L22_flatKey(container,fb) } },
    { say:"THE BIG RULE: an accidental affects <b>every note of the same letter on the same line or space</b> for the <b>rest of the measure</b> — then the <b>bar line cancels it</b>. \u{1F447} <b>Look at this measure — which notes does the printed ♭ affect?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[{p:"Bb4",d:"q",label:"B♭ (flat sign!)"},{p:"G4",d:"q",label:"G"},{p:"B4",d:"q",sound:"Bb4",label:"still B♭!"},{p:"B4",d:"q",sound:"Bb4",label:"still B♭!"},{bar:"single"},{p:"B4",d:"w",label:"B natural (new measure)"},{bar:"final"}],width:470} },
      try:{ type:"mc",
        choices:["Every B until the bar line","Only the note it's printed on","Every B in the whole piece"], answer:0,
        success:"✓ The flat stays “switched on” for all matching notes until the bar line resets everything.",
        fail:"The bar line is the OFF switch — until then, the flat rules every matching note.",
        hint:"One-measure rule!" } },
    { say:"Practice the rule. \u{1F447} <b>Does the flat still apply?</b>",
      try:{ type:"custom",
        hint:"Same letter + same measure = still flat. Past the bar line = reset.",
        mount:(container,fb)=>{
          const rounds=[
            {q:"A B♭ appears on beat 1. Beat 3 has another B in the SAME measure. Is it flat?",a:true,why:"Same measure, same letter — the flat still applies."},
            {q:"A B♭ appears in measure 1. Measure 2 has a B (no sign). Is it flat?",a:false,why:"The bar line canceled it — B natural again."},
            {q:"An E♭ appears on beat 2. Beat 4 has another E, same measure. Is it flat?",a:true,why:"Still inside the measure — still E♭."},
            {q:"An E♭ appears in one measure. THREE measures later there's an E. Is it flat?",a:false,why:"Long gone — each bar line resets accidentals."}];
          let i=0;
          container.innerHTML=`<div class="big-q ra-q" style="text-align:center;min-height:56px"></div>
            <div class="choices ra-ch"><button>Yes — still flat</button><button>No — the bar line reset it</button></div>`;
          const q=container.querySelector(".ra-q"), ch=container.querySelector(".ra-ch");
          function ask(){ q.textContent=`Case ${i+1} of ${rounds.length}: `+rounds[i].q; }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[i], saidYes=bi===0, ok=saidYes===cur.a;
            if(ok){ MFAudio.yay(); i++;
              if(i>=rounds.length){ ch.style.display="none"; q.textContent="Rule mastered!";
                fb(true,"✓ Four for four — the flat lives until the bar line, and not a beat longer!"); }
              else { fb(true,"✓ "+cur.why+" Next case…"); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,cur.why); }
          });
          ask();
        } } },
    { say:"Read a melody WITH flats — listen for the gentle “sigh” each flat adds. \u{1F447}",
      try:{ type:"custom",
        hint:"Both B's in measure 1 are flat — the sign carries through the measure.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:92,
            notes:[{p:"C4",d:"q",label:"C"},{p:"Bb4",d:"q",label:"B♭"},{p:"B4",d:"q",label:"(B♭)"},{p:"G4",d:"q",label:"G"},{bar:"single"},{p:"F4",d:"w",label:"F"},{bar:"final"}],width:460};
          /* NOTE: item 3 is written B4 but sounds Bb per the one-measure rule — play override below */
          container.innerHTML=`<div class="rf-staff"></div><div style="text-align:center"><button class="play rf-play">▶ Play & listen</button></div>`;
          const api=Staff.render(container.querySelector(".rf-staff"),spec);
          container.querySelector(".rf-play").onclick=()=>{
            const spb=60/92;
            const seq=[[60,0,1],[70,1,1],[70,2,1],[67,3,1],[65,4,4]];
            seq.forEach(([m,b,len],idx)=>{ MFAudio.tone(m,len*spb*.9,b*spb);
              setTimeout(()=>api.highlight([0,1,2,3,5][idx]<5?[0,1,2,3][idx]:5), b*spb*1000); });
            setTimeout(()=>api.highlight(5),4*spb*1000);
            setTimeout(()=>{ api.highlight(null);
              fb(true,"✓ Both B's sounded FLAT — the accidental carried through the whole measure, exactly as the rule says!"); },8*spb*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"B and B♭ side by side — the flat sign sits before the notehead and pulls the pitch a half step down.",
      staff:{clef:"treble",tempo:80,notes:[{p:"B4",d:"h",label:"B"},{p:"Bb4",d:"h",label:"B♭"},{p:"E4",d:"h",label:"E"},{p:"Eb4",d:"h",label:"E♭"}],width:440} },
    { caption:"The one-measure rule in action: one printed ♭, TWO flat B's — then the bar line resets everything.",
      staff:{clef:"treble",tempo:92,time:"4/4",notes:[{p:"Bb4",d:"h",label:"B♭"},{p:"B4",d:"h",sound:"Bb4",label:"(still B♭)"},{bar:"single"},{p:"B4",d:"w",label:"B natural again"},{bar:"final"}],width:440} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Spot the Flat",
      intro:"Flats hide among other signs — click the ♭ (or the flat NOTE) Mia names!",
      miaIntro:"Hunt the pitch-lowering machine! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Flat sign (B♭)", spec:{clef:"treble",notes:[{p:"Bb4",d:"q"}]}},
        {label:"Plain B (no accidental)", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"E♭", spec:{clef:"treble",notes:[{p:"Eb4",d:"q"}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}},
        {label:"Repeat Sign", spec:{clef:"treble",notes:[{bar:"repeat-end"}]}}]},
      result:(score)=>score>=5?"No flat escapes your eyes!":null },
    { type:"term-race", title:"Game 2 · Accidental Basics Dash",
      intro:"Quick vocabulary — what does each sign do to the pitch?",
      miaIntro:"Speed round — up, down, or cancel? \u{26A1}",
      spec:{rounds:8, pool:[
        ["Flat (♭)","Lowers a note by one half step"],
        ["Half Step","The smallest distance — the very next key"],
        ["Accidental","A sign that changes a note's pitch"],
        ["Bar Line","Cancels accidentals at the end of the measure"],
        ["One-Measure Rule","An accidental lasts until the next bar line"],
        ["B♭ on the keyboard","The black key just LEFT of B"]]},
      result:(score)=>score>=7?"Flat facts — locked in!":null },
    { type:"rhythm-tap", title:"Game 3 · Tap Review",
      intro:"Keep those rhythm skills sharp while your brain digests flats — tap it back!",
      miaIntro:"Rhythm never rests — tap! \u{1F44F}",
      spec:{tempo:92, rounds:3, patterns:[["q","q","h"],["q.","8","h"],["8","8","q","h"]]},
      result:(score)=>score>=8?"Rhythm AND pitch — growing together!":null },
    { type:"value-race", title:"Game 4 · Value Sprint (45s)",
      intro:"45 seconds of note values — everything from eighths to dotted halves. Go!",
      miaIntro:"Sprint! Keep every value fresh! \u{23F1}",
      spec:{seconds:45, ask:"beats", values:["8","q","q.","h","h."]},
      result:(score)=>score>=13?score+" — value fluency maintained!":null }
  ],
  practiceIntro:"20 practice questions — the flat's job, keyboard direction, and the one-measure rule. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"sign", pool:[["Flat (♭)","Lowers a note by one half step"],["Accidental","A sign that changes a note's pitch"],["Half Step","The distance to the very next key"],["Bar Line","Cancels accidentals when the measure ends"]], reverse:true}, count:5 },
    { gen:"click-key", params:{letters:["B","E","A"], octaves:[4]}, count:3 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"A flat (♭) makes a note…", choices:["one half step LOWER","one half step higher","twice as long"], answer:0,
      explain:"Down — one key to the left." },
    { type:"mc", q:"On the keyboard, B♭ is…", choices:["one key LEFT of B","one key RIGHT of B","the same key as B"], answer:0,
      explain:"Flats always move left/lower." },
    { type:"truefalse", q:"A flat affects every same-letter note on that line/space for the rest of the measure.", answer:true,
      explain:"The one-measure rule." },
    { type:"truefalse", q:"An accidental carries into the next measure automatically.", answer:false,
      explain:"The bar line cancels it." },
    { type:"mc", q:"The flat sign is written…", choices:["just BEFORE the notehead","just after the notehead","above the staff"], answer:0,
      explain:"Before the note, on its line or space." },
    { type:"truefalse", q:"A half step is the smallest distance in Western music.", answer:true,
      explain:"The very next key — no keys skipped." },
    { type:"mc", q:"B♭ is what color key on the piano?", choices:["black","white","either — depends on the piano"], answer:0,
      explain:"The black key left of B. (But careful: some flats, like C♭, land on white keys — later!)" },
    { type:"truefalse", q:"Flats make music sound a little lower and often warmer or sadder.", answer:true,
      explain:"That gentle sigh downward is a classic expressive color." }
  ],
  miaQuizIntro:"Quiz time! Remember: flat = LEFT and LOWER, and the bar line is the reset button!",
  quiz:[
    { type:"mc", q:"What does a flat (♭) do?", choices:["Raises the pitch","Lowers the pitch by one half step","Cancels a sharp","Holds the note longer"], answer:1,
      explain:"Down one half step — one key left.", hint:"⬇️" },
    { type:"mc", q:"On the keyboard, a flat moves you…", choices:["one key to the LEFT","one key to the RIGHT","up an octave"], answer:0,
      explain:"Left = lower.", hint:"Flat tire sinks down…" },
    { type:"truefalse", q:"A flat raises the pitch.", answer:false,
      explain:"Flats LOWER; sharps (next lesson!) raise.", hint:"Which way does a flat tire go?" },
    { type:"truefalse", q:"An accidental remains in effect for the rest of the measure.", answer:true,
      explain:"Until the bar line switches it off.", hint:"The one-measure rule." },
    { type:"mc", q:"What cancels an accidental automatically?", choices:["The next bar line","The next note","The end of the line"], answer:0,
      explain:"Bar line = reset button.", hint:"The measure's wall." },
    { type:"mc", q:"Which note is B♭?",
      staff:{clef:"treble",notes:[{p:"B4",d:"q",label:"1"},{p:"Bb4",d:"q",label:"2"}],width:300},
      choices:["1","2"], answer:1,
      explain:"Note 2 has the ♭ sign before its head.", hint:"Find the little b." },
    { type:"mc", q:"A flat lowers a note by one ____ step.", choices:["half","whole","quarter"], answer:0,
      explain:"Half step — the smallest move.", hint:"The very next key." },
    { type:"mc", q:"An accidental remains in effect until the next ____ line.", choices:["bar","ledger","staff"], answer:0,
      explain:"The bar line resets accidentals.", hint:"The measure's boundary." },
    { type:"truefalse", q:"In this measure, BOTH B's sound flat.",
      staff:{clef:"treble",time:"4/4",notes:[{p:"Bb4",d:"h"},{p:"B4",d:"h"},{bar:"final"}],width:340},
      answer:true,
      explain:"The printed ♭ rules every B until the bar line.", hint:"Same measure, same letter." },
    { type:"mc", q:"Where does the flat sign sit?", choices:["Before the notehead, on the same line or space","After the notehead","Under the staff"], answer:0,
      explain:"Before the note it changes.", hint:"You read it BEFORE you play." },
    { type:"mc", q:"The flat's little symbol looks most like…", choices:["a lowercase b","the number 7","a hashtag"], answer:0,
      explain:"♭ — a pointed lowercase b.", hint:"b for… below!" },
    { type:"mc", q:"Which statement is correct?",
      choices:["A flat raises a note","A flat affects every same-letter note until the bar line","A flat lasts the whole piece","A flat makes the note louder"], answer:1,
      explain:"Lower by a half step + one-measure rule.", hint:"Two facts in one." },
    /* generated */
    { gen:"term-match", params:{subject:"sign", pool:[["Flat (♭)","Lowers a note by one half step"],["Accidental","A sign that changes a note's pitch"],["Bar Line","Cancels accidentals when the measure ends"],["Half Step","The distance to the very next key"]], reverse:true}, count:4 },
    { gen:"click-key", params:{letters:["B","E"], octaves:[4]}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 }
  ],
  vocabulary:[
    {def:"A flat, sharp or natural sign that appears within a piece of music.", term:"Accidental"},
    {def:"Lowers the pitch by one half step.", term:"Flat (♭)", staff:{clef:"none",notes:[{p:"Bb4",d:"q"}],width:140}},
    {def:"The distance from any key on the keyboard to the very next key above or below, whether black or white.", term:"Half Step"},
    {def:"An accidental affects the notes on the same line or space following it, for that measure only.", term:"One-Measure Rule"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Flat (♭)</b> = one half step <b>LOWER</b> — one key to the <b>left</b>. ⬇️",
    "✔ The sign sits <b>before the notehead</b> on its line or space.",
    "✔ <b>One-measure rule</b>: the flat rules every matching note until the <b>bar line</b>.",
    "✔ The bar line is the automatic <b>reset button</b>.",
    "✔ A <b>half step</b> = the very next key, black or white."
  ],
  tips:[
    "Say it while you play: “B… and B-flat, one key left.” The hand remembers directions.",
    "Careful reading: the ♭ comes BEFORE the note in print, but you say the letter first: “B-flat.”",
    "Spot a flat? Immediately scan the REST of the measure for more of that letter.",
    "⬆️ Next lesson: the flat's opposite — the SHARP raises notes a half step!"
  ],
  rewards:{ badge:"Flat Expert", icon:"⬇️" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — every flat found, every rule applied! The sharp is waiting to lift you UP. ⬇️\u{1F389}",
  miaPass:"You passed! Left and lower — locked in. Review below or retry for the perfect run.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The flat is a pitch-lowering machine: one half step down, one key to the left.",
      play:()=>{MFAudio.tone(71,.6,0);MFAudio.tone(70,.9,.7);} },
    learn:{ label:"the flat",
      explain:"♭ = down a half step (one key left). Sign sits before the notehead. It rules every matching note until the bar line resets it.",
      hint:"⬇️ left, lower, until the bar line.",
      play:()=>{[71,70,67,65].forEach((m,k)=>MFAudio.tone(m,.45,k*.45));} },
    example:{ label:"the examples",
      explain:"Hear B sink to B♭, then watch one printed flat control two notes before the bar line resets." },
    game:{ label:"the games",
      explain:"Hunt flats on the staff, race the vocabulary, and keep rhythm/value skills warm.",
      hint:"On any flat question, think: LEFT and LOWER." },
    quiz:{ label:"this question",
      explain:"Two facts answer nearly everything: flat = half step down (left), and accidentals last until the bar line.",
      play:()=>{MFAudio.tone(70,.8,0);} }
  }
};
