/* Lesson 20 — Articulation (AEMT Book 1, Unit 5)
   Built from drafts/UNIT 5 – Lesson 20.md.
   QA note honored: articulation = HOW a note is performed (not how loud/long,
   fermata excepted) with side-by-side AUDIO demos of every marking.
   NOTE: edit by FULL-FILE REWRITE only. */

/* listen-and-identify articulation drill (unique L20 prefix) */
function MF_L20_articListen(container,fb){
  const ROUNDS=[
    {a:"Staccato",play:()=>{[67,67,67,67].forEach((m,k)=>MFAudio.tone(m,.12,k*.5,.5));}},
    {a:"Legato / Tenuto",play:()=>{[67,67,67,67].forEach((m,k)=>MFAudio.tone(m,.5,k*.5,.5));}},
    {a:"Accent",play:()=>{[67,67,67,67].forEach((m,k)=>MFAudio.tone(m,.35,k*.5,k===0?.85:.35));}},
    {a:"Fermata",play:()=>{MFAudio.tone(67,.4,0,.5);MFAudio.tone(67,2.2,.55,.5);}}].sort(()=>Math.random()-.5);
  const OPTS=["Staccato","Legato / Tenuto","Accent","Fermata"];
  let i=0,played=false;
  container.innerHTML=`<div class="big-q al-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play al-play">▶ Listen</button></div>
    <div class="choices al-ch" style="display:none"></div>`;
  const q=container.querySelector(".al-q"), ch=container.querySelector(".al-ch");
  OPTS.forEach(o=>{ const b=document.createElement("button"); b.textContent=o;
    b.onclick=()=>{
      if(!played){ fb(false,"Listen first!"); return; }
      const cur=ROUNDS[i];
      if(o===cur.a){ i++;
        if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".al-play").style.display="none"; q.textContent="Articulation ears unlocked!";
          fb(true,"✓ Bouncy, smooth, punchy, held — you heard every style correctly!"); }
        else { fb(true,`✓ ${cur.a}! Next style…`); ask(); } }
      else fb(false,`Listen for the STYLE: short bounces = staccato, full smooth notes = tenuto, one POP = accent, one loooong hold = fermata. (It was ${cur.a}.)`);
    };
    ch.appendChild(b); });
  function ask(){ q.textContent=`Style ${i+1} of ${ROUNDS.length}: how were those notes performed?`; played=false; ch.style.display="none"; }
  container.querySelector(".al-play").onclick=()=>{ ROUNDS[i].play(); played=true; setTimeout(()=>{ ch.style.display=""; },3000); };
  ask();
}

LESSON_CONTENT[20]={
  welcome:"Same note, a hundred personalities. \u{1F3A8}",
  hook:{
    say:"The same notes can be played in very different ways — that's called <b>articulation</b>. Press play: the same four notes, two deliveries. <b>What changed?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Two deliveries</button></div>
          <div class="choices hk-ch" style="display:none"><button>The STYLE — bouncy, then smooth</button><button>The pitch</button><button>The speed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          [60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.12,k*.45,.5));
          [60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.48,2.4+k*.45,.5));
          setTimeout(()=>{ ch.style.display=""; },4600);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Bouncy then smooth — same notes, same speed, different STYLE. Style instructions are called ARTICULATION!");
          else fb(false,"Pitch and speed stayed identical — listen to HOW each note starts and ends.");
        });
      } }
  },
  objectives:[
    "Define articulation",
    "Identify common articulation markings",
    "Explain staccato, accent, sforzando, tenuto and fermata",
    "Hear the difference between articulations",
    "Recognize articulation symbols in a score",
    "Describe how articulation changes musical expression"
  ],
  steps:[
    { say:"<b>Articulation</b> tells us <b>HOW</b> to play a note — not how long, not how loud, but the <b>style</b> of the sound. Meet the five: \u{1F3C0} <b>Staccato (•)</b> short & detached · \u{1F4E2} <b>Accent (&gt;)</b> extra emphasis · \u{1F4A5} <b>Sforzando (sfz)</b> sudden strong accent · \u{23F3} <b>Tenuto (—)</b> hold full value · \u{1F426} <b>Fermata</b> hold LONGER than written. \u{1F447} <b>What does articulation describe?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"E5",d:"q",artic:"staccato",articPos:"above",label:"staccato"},{p:"E5",d:"q",artic:"accent",articPos:"above",label:"accent"},{p:"E5",d:"q",artic:"tenuto",articPos:"above",label:"tenuto"},{p:"E5",d:"q",artic:"sfz"},{p:"E5",d:"q",artic:"fermata",label:"fermata"}],width:470} },
      try:{ type:"mc",
        choices:["HOW a note is performed — its style","How loud a note is","How many beats a note gets"], answer:0,
        success:"✓ Style! Volume is dynamics, length is note values — articulation is the personality.",
        fail:"Not volume (dynamics), not length (note values) — articulation is the STYLE.",
        hint:"Delivery, not duration." } },
    { say:"\u{1F3C0} <b>Staccato</b>: a dot above or below the notehead — play it <b>short and detached</b>, like a bouncing ball. \u{1F447} <b>Compare:</b>",
      try:{ type:"custom",
        hint:"The staccato version has air between every note.",
        mount:(container,fb)=>{
          let heard=0;
          container.innerHTML=`<div class="st-staff"></div>
            <div style="text-align:center"><button class="play st-a">▶ Plain</button> <button class="play st-b">▶ Staccato</button></div>
            <div class="choices st-ch" style="display:none"><button>Staccato = shorter, bouncier, detached</button><button>Staccato = longer and smoother</button></div>`;
          Staff.render(container.querySelector(".st-staff"),{clef:"treble",notes:[{p:"G4",d:"q"},{p:"G4",d:"q"},{p:"G4",d:"q",artic:"staccato"},{p:"G4",d:"q",artic:"staccato"}],width:340});
          const ch=container.querySelector(".st-ch");
          container.querySelector(".st-a").onclick=()=>{ [0,1].forEach(k=>MFAudio.tone(67,.5,k*.55,.5)); heard|=1; if(heard===3) ch.style.display=""; };
          container.querySelector(".st-b").onclick=()=>{ [0,1].forEach(k=>MFAudio.tone(67,.12,k*.55,.5)); heard|=2; if(heard===3) ch.style.display=""; };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(i===0) fb(true,"✓ Short, light, detached — the note bounces off the floor. That's staccato!");
            else fb(false,"Listen again — which version has AIR between the notes?");
          });
        } } },
    { say:"\u{1F4E2} <b>Accent (&gt;)</b> gives one note extra <b>punch</b>; \u{1F4A5} <b>sforzando (sfz)</b> is that punch turned up to a <b>sudden surprise</b>; \u{23F3} <b>tenuto (—)</b> says “hold me for my FULL value, with a little weight.” \u{1F447} <b>Which note gets the punch?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:92,notes:[{p:"C4",d:"q",label:"1"},{p:"E5",d:"q",artic:"accent",label:"2"},{p:"G4",d:"q",label:"3"},{p:"C5",d:"q",label:"4"}],width:400} },
      try:{ type:"mc",
        choices:["Note 2 — it wears the > accent","Note 1","Note 4"], answer:0,
        success:"✓ The > mark gives note 2 the extra emphasis — press play in the example section to hear it POP.",
        fail:"Find the little sideways V — that's the accent.",
        hint:"Look above/below each notehead." } },
    { say:"\u{1F426} The <b>fermata</b> — the “bird's eye” — perches over a note and says: <b>hold me longer than written</b> (the conductor decides how long!). It's the one articulation that DOES change length. \u{1F447} <b>Hear it:</b>",
      try:{ type:"custom",
        hint:"The fermata note overstays its welcome — on purpose.",
        mount:(container,fb)=>{
          let played=false;
          container.innerHTML=`<div class="fm-staff"></div>
            <div style="text-align:center"><button class="play fm-play">▶ Play with fermata</button></div>
            <div class="choices fm-ch" style="display:none"><button>The last note was held MUCH longer than 1 beat</button><button>Every note was equal</button></div>`;
          Staff.render(container.querySelector(".fm-staff"),{clef:"treble",time:"4/4",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q",artic:"fermata"},{bar:"final"}],width:400});
          const ch=container.querySelector(".fm-ch");
          container.querySelector(".fm-play").onclick=()=>{
            const s=.55;
            [60,64,67].forEach((m,k)=>MFAudio.tone(m,s*.9,k*s,.5));
            MFAudio.tone(72,2.4,3*s,.55);
            played=true;
            setTimeout(()=>{ ch.style.display=""; },5600);
          };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(!played){ fb(false,"Play it first!"); return; }
            if(i===0) fb(true,"✓ The bird's eye held the last note way past its written value — a dramatic pause before moving on!");
            else fb(false,"Listen to the LAST note — did it really let go after one beat?");
          });
        } } },
    { say:"Now EARS only. \u{1F447} <b>Identify each performance style:</b>",
      try:{ type:"custom",
        hint:"Short bounces / full smooth notes / one punch / one long hold.",
        mount:(container,fb)=>MF_L20_articListen(container,fb) } }
  ],
  examples:[
    { caption:"Staccato dots vs tenuto dashes: bouncing balls, then full-weight steps. Same pitches, opposite personalities.",
      staff:{clef:"treble",tempo:96,time:"4/4",notes:[{p:"E5",d:"q",artic:"staccato"},{p:"E5",d:"q",artic:"staccato"},{p:"E5",d:"q",artic:"tenuto"},{p:"E5",d:"q",artic:"tenuto"},{bar:"final"}],width:420} },
    { caption:"An accent punches beat 1, and the fermata stretches the final note — listen for both!",
      staff:{clef:"treble",tempo:96,time:"4/4",notes:[{p:"G4",d:"q",artic:"accent"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q",artic:"fermata"},{bar:"final"}],width:420} }
  ],
  games:[
    { type:"term-race", title:"Game 1 · Style Dash",
      intro:"A marking flashes — pick what it tells you to do. All five styles!",
      miaIntro:"Quick — bounce, punch, or hold?! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Staccato (•)","Short and detached"],
        ["Accent (>)","Extra emphasis"],
        ["Sforzando (sfz)","Sudden, strong accent"],
        ["Tenuto (—)","Hold for full value"],
        ["Fermata","Hold longer than written"],
        ["Legato","Smooth and connected (from the slur!)"]]},
      result:(score)=>score>=7?"Every style at your fingertips!":null },
    { type:"symbol-hunt", title:"Game 2 · Mark Detective",
      intro:"Click the articulation Mia names — dots, dashes, wedges and bird's eyes on real notes!",
      miaIntro:"Detective work — find each tiny mark! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Staccato", spec:{clef:"treble",notes:[{p:"E5",d:"q",artic:"staccato",articPos:"above"}]}},
        {label:"Accent", spec:{clef:"treble",notes:[{p:"E5",d:"q",artic:"accent",articPos:"above"}]}},
        {label:"Tenuto", spec:{clef:"treble",notes:[{p:"E5",d:"q",artic:"tenuto",articPos:"above"}]}},
        {label:"Fermata", spec:{clef:"treble",notes:[{p:"E5",d:"q",artic:"fermata"}]}},
        {label:"Sforzando (sfz)", html:"<i>sfz</i>"}]},
      result:(score)=>score>=5?"No mark too small for your eyes!":null },
    { type:"rhythm-tap", title:"Game 3 · Crisp Staccato Tap",
      intro:"Tap the rhythm with staccato SNAP — quick, light touches right on the beat!",
      miaIntro:"Make your taps BOUNCE! \u{1F3C0}",
      spec:{tempo:96, rounds:3, patterns:[["q","q","q","q"],["q","q","h"],["q","rq","q","q"]]},
      result:(score)=>score>=8?"Crisp, snappy, on time — staccato hands!":null },
    { type:"term-race", title:"Game 4 · Reverse Style Dash (45s)",
      intro:"Backwards round: Mia gives the meaning, you name the marking — fast!",
      miaIntro:"Final sprint — meanings to marks! \u{23F1}",
      spec:{seconds:45, reverse:true, pool:[
        ["Staccato (•)","Short and detached"],
        ["Accent (>)","Extra emphasis"],
        ["Sforzando (sfz)","Sudden, strong accent"],
        ["Tenuto (—)","Hold for full value"],
        ["Fermata","Hold longer than written"]]},
      result:(score)=>score>=11?score+" matched — articulation fluency!":null }
  ],
  practiceIntro:"20 practice questions — the five markings and how each changes the sound. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"articulation marking", pool:[["Staccato (•)","Short and detached"],["Accent (>)","Extra emphasis"],["Sforzando (sfz)","Sudden, strong accent"],["Tenuto (—)","Hold for full value"],["Fermata","Hold longer than written"]], reverse:true}, count:8 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"Articulation describes…", choices:["HOW a note is performed","how many beats a note lasts","which line a note sits on"], answer:0,
      explain:"The style of the sound — bounce, punch, weight, hold." },
    { type:"truefalse", q:"Staccato notes are short and detached.", answer:true,
      explain:"Bounce off each note like a basketball." },
    { type:"truefalse", q:"Tenuto means to hold the note for its full written value.", answer:true,
      explain:"Full value, with a little weight — no clipping!" },
    { type:"mc", q:"The fermata is nicknamed…", choices:["the bird's eye","the pizza","the hat"], answer:0,
      explain:"An arc with a dot — an eye watching from above." },
    { type:"truefalse", q:"The fermata is the one articulation that changes a note's LENGTH.", answer:true,
      explain:"Hold it longer than written — the conductor decides how long." },
    { type:"mc", q:"sfz (sforzando) means…", choices:["a sudden, strong accent","gradually louder","smooth and connected"], answer:0,
      explain:"A musical surprise — one note jumps out." },
    { type:"truefalse", q:"sfz is short for sforzando.", answer:true,
      explain:"The abbreviation appears in the score; the full Italian word is sforzando." },
    { type:"mc", q:"Compared with a plain accent (>), a sforzando is…", choices:["more sudden and stronger","softer","longer in duration"], answer:0,
      explain:"Both add emphasis — sfz is the extreme, surprise version." },
    { type:"truefalse", q:"An accent makes a note quieter.", answer:false,
      explain:"The opposite — extra emphasis, extra punch." },
    { type:"mc", q:"Staccato is marked with…", choices:["a dot above or below the notehead","a curved line","two dots by a bar line"], answer:0,
      explain:"The tiny dot — not to be confused with the duration dot BESIDE a note!" }
  ],
  miaQuizIntro:"Quiz time! Bounce the staccatos, punch the accents, and hold that fermata!",
  quiz:[
    { type:"mc", q:"What does staccato mean?", choices:["Play loudly","Play smoothly","Play short and detached","Hold longer"], answer:2,
      explain:"Short, light, detached.", hint:"\u{1F3C0} bouncing ball." },
    { type:"mc", q:"Which articulation tells you to hold a note LONGER than its written value?", choices:["Accent","Tenuto","Fermata","Staccato"], answer:2,
      explain:"The bird's eye — the great stretcher.", hint:"\u{1F426}" },
    { type:"mc", q:"What does tenuto tell you to do?", choices:["Play the note short","Hold the note for its full written value","Play louder","Repeat the note"], answer:1,
      explain:"Full value with gentle weight.", hint:"⏳ all the way." },
    { type:"truefalse", q:"A fermata tells you to hold a note longer than its normal value.", answer:true,
      explain:"Longer than written — conductor's choice.", hint:"The eye watches… and waits." },
    { type:"truefalse", q:"Staccato notes should be played smoothly and connected.", answer:false,
      explain:"That's legato! Staccato is the opposite — detached.", hint:"Bounce, don't glide." },
    { type:"truefalse", q:"Sforzando means a sudden, strong accent.", answer:true,
      explain:"The musical surprise attack.", hint:"\u{1F4A5}" },
    { type:"mc", q:"Which marking tells you to play a note short and detached?", choices:["Staccato","Tenuto","Fermata","Accent"], answer:0,
      explain:"The dot above/below the head.", hint:"\u{1F3C0}" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Staccato → short · Accent → emphasis · Sforzando → sudden accent · Tenuto → full value · Fermata → hold longer",
               "Staccato → hold longer · Accent → short · Sforzando → smooth · Tenuto → sudden · Fermata → detached",
               "Staccato → loud · Accent → soft · Sforzando → slow · Tenuto → fast · Fermata → moderate"], answer:0,
      explain:"All five, correctly paired.", hint:"Bounce, punch, surprise, weight, hold." },
    { type:"mc", q:"A note marked with a fermata should be held ____ than its written value.", choices:["longer","shorter","exactly equal"], answer:0,
      explain:"Longer — that's its superpower.", hint:"The stretcher." },
    { type:"mc", q:"The articulation that means short and detached is ____.", choices:["staccato","tenuto","sforzando"], answer:0,
      explain:"Staccato!", hint:"The dot." },
    { type:"mc", q:"Which note carries the ACCENT?",
      staff:{clef:"treble",notes:[{p:"C4",d:"q",artic:"staccato",label:"1"},{p:"E5",d:"q",artic:"accent",label:"2"},{p:"G4",d:"q",artic:"tenuto",label:"3"},{p:"C5",d:"q",artic:"fermata",label:"4"}],width:420},
      choices:["1","2","3","4"], answer:1,
      explain:"The > wedge on note 2. (1 = staccato dot, 3 = tenuto dash, 4 = fermata.)",
      hint:"Find the sideways V." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Staccato means to hold the note longer","Tenuto means to play the note short","A fermata tells the performer to hold the note longer than its written value","Sforzando means to play quietly"], answer:2,
      explain:"The bird's eye stretches time.", hint:"Which mark changes length?" },
    { type:"mc", q:"Which marking calls for a SUDDEN, strong accent?",
      choices:["Sforzando (sfz)","Tenuto","Staccato","Fermata"], answer:0,
      explain:"sfz — the musical surprise attack, stronger and more sudden than a plain accent.",
      hint:"\u{1F4A5}" },
    { type:"mc", q:"Which note is marked sfz?",
      staff:{clef:"treble",notes:[{p:"E5",d:"q",artic:"staccato",articPos:"above",label:"1"},{p:"E5",d:"q",artic:"sfz",label:"2"},{p:"E5",d:"q",artic:"tenuto",articPos:"above",label:"3"}],width:360},
      choices:["1","2","3"], answer:1,
      explain:"Note 2 carries the italic sfz below the staff. (1 = staccato dot, 3 = tenuto dash.)",
      hint:"Look BELOW the staff for the letters." },
    /* generated */
    { gen:"term-match", params:{subject:"articulation marking", pool:[["Staccato (•)","Short and detached"],["Accent (>)","Extra emphasis"],["Sforzando (sfz)","Sudden, strong accent"],["Tenuto (—)","Hold for full value"],["Fermata","Hold longer than written"]], reverse:true}, count:5 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"The manner in which a note is performed.", term:"Articulation"},
    {def:"Play the note short and detached.", term:"Staccato (•)", staff:{clef:"none",notes:[{p:"E5",d:"q",artic:"staccato",articPos:"above"}],width:140}},
    {def:"Play the note louder, with a special emphasis.", term:"Accent (>)", staff:{clef:"none",notes:[{p:"E5",d:"q",artic:"accent",articPos:"above"}],width:140}},
    {def:"A sudden, strong accent.", term:"Sforzando (sfz)"},
    {def:"Hold the note for its full value.", term:"Tenuto (—)", staff:{clef:"none",notes:[{p:"E5",d:"q",artic:"tenuto",articPos:"above"}],width:140}},
    {def:"Hold the note for longer than its normal value.", term:"Fermata", staff:{clef:"none",notes:[{p:"E5",d:"q",artic:"fermata"}],width:140}}
  ],
  mistakes:[],
  summary:[
    "✔ Articulation = <b>HOW</b> a note is played — its style and personality.",
    "✔ <b>Staccato •</b> short & detached · <b>Accent &gt;</b> extra punch.",
    "✔ <b>sfz</b> = sudden strong accent · <b>Tenuto —</b> = full value.",
    "✔ <b>Fermata</b> \u{1F426} = hold LONGER than written (the length exception!).",
    "✔ Same notes + different articulation = a completely different character."
  ],
  tips:[
    "Say “ta-ta-ta” short and dry for staccato, then “taaah” connected for tenuto — your voice knows the difference.",
    "Careful: the staccato dot sits ABOVE/BELOW the head; the duration dot sits BESIDE it!",
    "When you meet a fermata, breathe — it's the music's dramatic pause.",
    "\u{1F5FA}\u{FE0F} Next lesson: the full musical GPS — D.C., D.S., Coda and Fine!"
  ],
  rewards:{ badge:"Articulation Artist", icon:"\u{1F3A8}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — every bounce, punch and hold in place! The musical GPS is next. \u{1F3A8}\u{1F389}",
  miaPass:"You passed! Five styles, one artist — you. Review below or perform again for the perfect run.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Articulation is delivery: the same note can bounce (staccato), punch (accent), lean (tenuto) or linger (fermata).",
      play:()=>{[60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.12,k*.4,.5));[60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.45,2.1+k*.4,.5));} },
    learn:{ label:"the articulations",
      explain:"Staccato short · accent emphasized · sfz sudden · tenuto full value · fermata longer than written. Style, not volume or length (fermata excepted).",
      hint:"Bounce, punch, surprise, weight, hold.",
      play:()=>{MFAudio.tone(67,.12,0,.5);MFAudio.tone(67,.35,.5,.85);MFAudio.tone(67,.5,1.1,.5);MFAudio.tone(67,1.6,1.8,.5);} },
    example:{ label:"the examples",
      explain:"Bounces then weights in example 1; a punch and a long bird's-eye hold in example 2. Press play and listen close." },
    game:{ label:"the games",
      explain:"Race the styles, find the marks on real notes, tap with staccato snap, then reverse-match against the clock.",
      hint:"Five markings — learn them as five personalities." },
    quiz:{ label:"this question",
      explain:"Articulation = style. Only the fermata touches length; only accent/sfz touch emphasis; staccato/tenuto shape the touch.",
      play:()=>{MFAudio.tone(67,.12,0,.5);MFAudio.tone(67,1.4,.5,.5);} }
  }
};
