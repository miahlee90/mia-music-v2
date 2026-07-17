/* Lesson 13 — Ties and Slurs (AEMT Book 1, Unit 3)
   Built from drafts/UNIT 3 – Lesson 13.md.
   QA note honored: "Same Pitch = Tie · Different Pitches = Slur" repeated in every
   step, game, practice and quiz; visual comparisons throughout (staff.js v5 arcs).
   NOTE: edit by FULL-FILE REWRITE only. */

/* tie-or-slur drill (unique L13 prefix) */
function MF_L13_tieSlur(container,fb,rounds){
  const POOL=[
    {notes:[{p:"G4",d:"h"},{p:"G4",d:"h"}],tie:true},
    {notes:[{p:"C4",d:"q"},{p:"D4",d:"q"}],tie:false},
    {notes:[{p:"E4",d:"h"},{p:"E4",d:"q"}],tie:true},
    {notes:[{p:"F4",d:"q"},{p:"A4",d:"q"}],tie:false},
    {notes:[{p:"B4",d:"h"},{p:"B4",d:"h"}],tie:true},
    {notes:[{p:"G4",d:"q"},{p:"E4",d:"q"}],tie:false}];
  const seq=[...POOL].sort(()=>Math.random()-.5).slice(0,rounds);
  let i=0;
  container.innerHTML=`<div class="big-q ts-q" style="text-align:center"></div><div class="ts-staff"></div>
    <div class="choices ts-ch"><button>\u{1F9F2} Tie — same pitch</button><button>\u{1F309} Slur — different pitches</button></div>`;
  const q=container.querySelector(".ts-q"), st=container.querySelector(".ts-staff"), ch=container.querySelector(".ts-ch");
  function ask(){
    const cur=seq[i];
    Staff.render(st,{clef:"treble",notes:cur.notes,arcs:[{from:0,to:1,type:cur.tie?"tie":"slur"}],width:280});
    q.textContent=`Curved line ${i+1} of ${seq.length}: tie or slur?`;
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=seq[i], saidTie=bi===0, ok=saidTie===cur.tie;
    if(ok){ MFAudio.tone(MFAudio.midi(cur.notes[0].p),.4); i++;
      if(i>=seq.length){ ch.style.display="none"; q.textContent="Every curve identified!";
        fb(true,"✓ Perfect! You checked the PITCHES every time: same pitch = tie, different pitches = slur."); }
      else { fb(true,`✓ ${cur.tie?"Same pitch — TIE. Play once, hold through both.":"Different pitches — SLUR. Play both, smoothly connected."} Next…`); ask(); } }
    else fb(false,`Look at the NOTES, not the curve — are they on the same line/space? ${cur.tie?"They're identical: that's a TIE.":"They're different: that's a SLUR."}`);
  });
  ask();
}

LESSON_CONTENT[13]={
  welcome:"Two curves that look like twins — but aren't. \u{1F309}",
  hook:{
    say:"Have you noticed those <b>curved lines</b> above notes? They may look the same, but they don't mean the same thing! Press play — the SAME two notes, connected two different ways. <b>What changed?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="hk-staff"></div>
          <div style="text-align:center"><button class="play hk-play">▶ Two versions</button></div>
          <div class="choices hk-ch" style="display:none"><button>First: TWO attacks · Second: ONE long sound</button><button>Nothing changed</button><button>The pitch changed</button></div>`;
        Staff.render(container.querySelector(".hk-staff"),{clef:"treble",notes:[{p:"G4",d:"h",label:"played twice"},{p:"G4",d:"h"},{p:"G4",d:"h",label:"tied: played ONCE"},{p:"G4",d:"h"}],arcs:[{from:2,to:3,type:"tie"}],width:440});
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(67,.9,0); MFAudio.tone(67,.9,1.0);
          MFAudio.tone(67,2.1,2.4);
          setTimeout(()=>{ ch.style.display=""; },4700);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Exactly — the curved line GLUED the two notes into one long sound. That glue is called a TIE.");
          else fb(false,"Listen again: version one strikes twice, version two strikes ONCE and holds.");
        });
      } }
  },
  objectives:[
    "Identify ties and slurs",
    "Explain the difference between them",
    "Recognize whether connected notes have the same or different pitches",
    "Define the term legato",
    "Perform tied notes correctly",
    "Perform slurred notes smoothly"
  ],
  steps:[
    { say:"A <b>TIE</b> connects <b>two notes of the SAME pitch</b> — musical <b>glue</b> \u{1F9F2}. Play the first note ONCE and hold it for the combined value. Half + half tied = <b>4 beats of one sound</b>. \u{1F447} <b>Do you play the second tied note again?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",notes:[{p:"G4",d:"h",label:"play"},{p:"G4",d:"h",label:"(hold — 2+2=4)"},{bar:"final"}],arcs:[{from:0,to:1,type:"tie"}],width:380} },
      try:{ type:"mc",
        choices:["No — hold the first note through it","Yes — strike it again","Only on Tuesdays"], answer:0,
        success:"✓ Never re-strike a tied note — one attack, then pure holding. The values ADD together.",
        fail:"The tie is glue — the second note is held, not played again.",
        hint:"Tie = play ONCE." } },
    { say:"A <b>SLUR</b> connects notes of <b>DIFFERENT pitches</b> — a musical <b>bridge</b> \u{1F309}. Play EVERY note, but smoothly connected, with no gaps. That style is called <b>legato</b>. \u{1F447} <b>Under a slur, what do you do?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"h"}],arcs:[{from:0,to:3,type:"slur"}],width:420} },
      try:{ type:"mc",
        choices:["Play every note, smoothly connected","Play only the first note","Skip the notes under the curve"], answer:0,
        success:"✓ Every note sounds — the slur just removes the gaps between them. Smooth = legato!",
        fail:"A slur is a bridge, not glue — walk across EVERY note, smoothly.",
        hint:"Slur = play all, connect them." } },
    { say:"The test is always the same: <b>look at the pitches</b>. Same pitch = <b>Tie</b>. Different pitches = <b>Slur</b>. \u{1F447} <b>Judge these curves:</b>",
      try:{ type:"custom",
        hint:"Ignore the curve's shape — compare the NOTES it connects.",
        mount:(container,fb)=>MF_L13_tieSlur(container,fb,6) } },
    { say:"Your ears can hear the difference too. \u{1F447} <b>Which performance is LEGATO (smooth and connected)?</b>",
      try:{ type:"custom",
        hint:"Legato has no silence between notes — they melt into each other.",
        mount:(container,fb)=>{
          let heard=0;
          container.innerHTML=`<div style="text-align:center">
            <button class="play lg-a">▶ Performance A</button>
            <button class="play lg-b">▶ Performance B</button></div>
            <div class="choices lg-ch" style="display:none"><button>A was legato</button><button>B was legato</button></div>`;
          const ch=container.querySelector(".lg-ch");
          const NOTES=[60,62,64,65];
          container.querySelector(".lg-a").onclick=()=>{ /* detached */
            NOTES.forEach((m,i)=>MFAudio.tone(m,.22,i*.5)); heard|=1;
            if(heard===3) ch.style.display="";
          };
          container.querySelector(".lg-b").onclick=()=>{ /* legato */
            NOTES.forEach((m,i)=>MFAudio.tone(m,.55,i*.5)); heard|=2;
            if(heard===3) ch.style.display="";
          };
          [...ch.children].forEach((b,i)=>b.onclick=()=>{
            if(i===1) fb(true,"✓ B — every note melted into the next with no gaps. THAT'S legato, and that's what a slur asks for.");
            else fb(false,"A had little silences between the notes — detached, not connected. Listen once more.");
          });
        } } },
    { say:"Last check! \u{1F447} <b>Which matching is correct?</b>",
      try:{ type:"mc",
        choices:["Tie → same pitch · Slur → different pitches · Legato → smoothly connected",
                 "Tie → different pitches · Slur → same pitch · Legato → very loud",
                 "Tie → play twice · Slur → play once · Legato → detached"], answer:0,
        success:"✓ All three matched — glue, bridge, and the smooth style the bridge asks for.",
        fail:"Remember: Same = Tie, Different = Slur, Legato = smooth.",
        hint:"Glue, bridge, smooth." } }
  ],
  examples:[
    { caption:"A TIE across the bar line: strike the G once, hold it for 4 beats total — the tie carries it into the next measure.",
      staff:{clef:"treble",tempo:90,time:"4/4",notes:[{p:"E4",d:"h",label:"1-2"},{p:"G4",d:"h",label:"3-4 play"},{bar:"single"},{p:"G4",d:"h",label:"1-2 hold"},{p:"E4",d:"h",label:"3-4"},{bar:"final"}],arcs:[{from:1,to:3,type:"tie"}],width:460} },
    { caption:"A SLUR over four different pitches: play them all — one smooth, connected legato phrase.",
      staff:{clef:"treble",tempo:90,notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"C4",d:"h"}],arcs:[{from:0,to:4,type:"slur"}],width:440} }
  ],
  games:[
    { type:"symbol-hunt", title:"Game 1 · Curve Hunt",
      intro:"Ties and slurs hide among the cards — click the one Mia names. Check those pitches!",
      miaIntro:"Hunt the curves — same or different, that's the whole game! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Tie", spec:{clef:"treble",notes:[{p:"G4",d:"h"},{p:"G4",d:"h"}],arcs:[{from:0,to:1,type:"tie"}]}},
        {label:"Slur", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"}],arcs:[{from:0,to:2,type:"slur"}]}},
        {label:"Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h"}]}},
        {label:"Dotted Half Note", spec:{clef:"treble",notes:[{p:"B4",d:"h",dot:true}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}}]},
      result:(score)=>score>=5?"Tie, slur, dot, rest — nothing fools you!":null },
    { type:"term-race", title:"Game 2 · Glue, Bridge, Smooth",
      intro:"A term flashes — pick its meaning fast! Tie, slur, legato, and friends.",
      miaIntro:"Speed round — glue or bridge?! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Tie","Connects two notes of the SAME pitch — play once, hold"],
        ["Slur","Connects notes of DIFFERENT pitches — play all, smoothly"],
        ["Legato","Smoothly connected, no gaps"],
        ["Dotted Half Note","3 beats — 2 + 1"],
        ["Bar Line","Divides the staff into measures"],
        ["Time Signature","Tells beats per measure and the beat note"]]},
      result:(score)=>score>=7?"Terms locked in — glue and bridge will never mix again!":null },
    { type:"rhythm-tap", title:"Game 3 · Tap the Tied Rhythm",
      intro:"Careful: a TIE means ONE tap held long, not two taps! Listen, then tap back exactly.",
      miaIntro:"The sneakiest tap game yet — ties mean FEWER taps! \u{1F44F}",
      spec:{tempo:90, rounds:3, patterns:[["h","h"],["h."],["w"],["q","q","h"]]},
      result:(score)=>score>=6?"Long holds, steady hands — tie-ready rhythm!":null },
    { type:"value-race", title:"Game 4 · Value Review Sprint",
      intro:"45 seconds of note values — whole, half, dotted half, quarter. The dot returns!",
      miaIntro:"Sprint time — keep those values sharp! \u{23F1}",
      spec:{seconds:45, ask:"beats", values:["w","h","h.","q"]},
      result:(score)=>score>=14?score+" in 45 seconds — value master!":null }
  ],
  practiceIntro:"20 practice questions — ties vs slurs, legato, and pitch checking. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{values:["h","h.","q","w"], ask:"beats"}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { gen:"measure-complete", params:{beats:4}, count:2 },
    { type:"mc", q:"A tie connects…", choices:["two notes of the SAME pitch","notes of different pitches","a note and a rest"], answer:0,
      explain:"Same pitch — that's the definition. Play once, hold." },
    { type:"mc", q:"A slur connects…", choices:["notes of DIFFERENT pitches","two identical notes","only half notes"], answer:0,
      explain:"Different pitches — play them all, smoothly." },
    { type:"truefalse", q:"You strike the second note of a tie again.", answer:false,
      explain:"Never — the tie glues it to the first. One attack, long hold." },
    { type:"truefalse", q:"Under a slur, you play every note.", answer:true,
      explain:"All of them — just smoothly connected." },
    { type:"mc", q:"Legato means…", choices:["smoothly connected","short and bouncy","very loud"], answer:0,
      explain:"No gaps between notes — the slur's favorite style." },
    { type:"mc", q:"Two tied half notes last…", choices:["4 beats, one sound","2 beats, two sounds","4 beats, two sounds"], answer:0,
      explain:"2 + 2 = 4 beats of ONE continuous sound." },
    { type:"truefalse", q:"Ties and slurs look almost identical on the page.", answer:true,
      explain:"Both are curved lines — the PITCHES tell you which is which." },
    { type:"mc", q:"The fastest way to tell tie from slur:", choices:["compare the pitches of the connected notes","measure the curve's length","count the beats"], answer:0,
      explain:"Same = tie, different = slur. Every time." },
    { type:"truefalse", q:"A tie can cross a bar line.", answer:true,
      explain:"That's one of its favorite jobs — holding a sound into the next measure." },
    { type:"mc", q:"A quarter note tied to a quarter note sounds like…", choices:["one half note","two staccato notes","one whole note"], answer:0,
      explain:"1 + 1 = 2 beats of one sound — same as a half note." },
    /* — from the unit review sheet — */
    { type:"truefalse", q:"On wind instruments, only the FIRST note of a slurred group is tongued.", answer:true, explain:"The slur means one breath impulse — the rest of the notes connect smoothly." },
    { type:"mc", q:"On a string instrument, the bow changes direction…", choices:["at the start of each new slur","on every single note","only at bar lines"], answer:0, explain:"Notes under one slur share one bow stroke." },
    { type:"mc", q:"A dotted half note tied to a quarter note lasts ____ beats.", choices:["4","3","5"], answer:0, explain:"3 + 1 = 4 — ties ADD the values." },
    { type:"mc", q:"A whole note tied to a half note lasts ____ beats.", choices:["6","5","4"], answer:0, explain:"4 + 2 = 6 beats of one sound." }
  ],
  miaQuizIntro:"Quiz time! One question rules them all: SAME pitch or DIFFERENT? Go!",
  quiz:[
    { type:"mc", q:"A tie connects:", choices:["Two different pitches","Two notes of the same pitch","Any two notes","Two measures"], answer:1,
      explain:"Same pitch — play once, hold for both values.", hint:"Tie = glue." },
    { type:"mc", q:"A slur connects:", choices:["Notes of the same pitch","Notes of different pitches","Only quarter notes","Only half notes"], answer:1,
      explain:"Different pitches — play all, smoothly.", hint:"Slur = bridge." },
    { type:"mc", q:"What does legato mean?", choices:["Loud","Fast","Smoothly connected","Very short"], answer:2,
      explain:"Notes with no gaps between them.", hint:"The slur's style." },
    { type:"truefalse", q:"The second note of a tie is played again.", answer:false,
      explain:"Held, never re-struck.", hint:"Glue!" },
    { type:"truefalse", q:"A slur tells you to play smoothly.", answer:true,
      explain:"Smooth and connected — legato.", hint:"The bridge style." },
    { type:"truefalse", q:"A tie and a slur always mean the same thing.", answer:false,
      explain:"Same look, different meanings — the pitches decide.", hint:"Check the pitches." },
    { type:"mc", q:"A curved line connects two Gs. It is a…",
      staff:{clef:"treble",notes:[{p:"G4",d:"h"},{p:"G4",d:"h"}],arcs:[{from:0,to:1,type:"tie"}],width:280},
      choices:["Tie","Slur"], answer:0,
      explain:"Same pitch (G to G) = TIE.", hint:"Same or different?" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Tie → same pitch · Slur → different pitches · Legato → smoothly connected",
               "Tie → different pitches · Slur → same pitch · Legato → loudly",
               "Tie → smooth · Slur → short · Legato → same pitch"], answer:0,
      explain:"Glue, bridge, smooth.", hint:"The memory tip!" },
    { type:"mc", q:"A tie connects notes with the ____ pitch.", choices:["same","different","highest"], answer:0,
      explain:"Same — always.", hint:"Glue holds identical things." },
    { type:"mc", q:"A slur tells musicians to play ____.", choices:["legato (smoothly)","staccato","twice as fast"], answer:0,
      explain:"Smoothly connected — legato.", hint:"The bridge style." },
    { type:"mc", q:"Which example shows a TIE?",
      staff:{clef:"treble",notes:[{p:"E4",d:"h",label:"1"},{p:"E4",d:"h",label:"1"},{p:"C4",d:"q",label:"2"},{p:"F4",d:"q",label:"2"}],arcs:[{from:0,to:1,type:"tie"},{from:2,to:3,type:"slur"}],width:400},
      choices:["Curve 1 (E to E)","Curve 2 (C to F)"], answer:0,
      explain:"E to E = same pitch = tie. C to F = different = slur.",
      hint:"Compare the pitches under each curve." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A tie connects different pitches","A slur tells you not to play the second note","A tie connects notes of the same pitch, while a slur connects notes of different pitches","Legato means to play loudly"], answer:2,
      explain:"The complete rule in one sentence.", hint:"Same = tie, different = slur." },
    /* generated */
    { gen:"note-value", params:{values:["h","h.","q"], ask:"beats"}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"measure-complete", params:{beats:3}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"Two notes of the same pitch joined by a curved line. Each note is held for its full value, but only the first is played or sung.", term:"Tie", staff:{clef:"none",notes:[{p:"B4",d:"h"},{p:"B4",d:"h"}],arcs:[{from:0,to:1,type:"tie"}],width:150}},
    {def:"Smoothly connects two or more notes of DIFFERENT pitches with a curved line over or under the notes.", term:"Slur", staff:{clef:"none",notes:[{p:"A4",d:"q"},{p:"C5",d:"q"},{p:"B4",d:"q"}],arcs:[{from:0,to:2,type:"slur"}],width:150}},
    {def:"To play or sing two or more notes smoothly connected.", term:"Legato"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Tie</b> = same pitch — musical <b>glue</b>: play once, hold for the combined value.",
    "✔ <b>Slur</b> = different pitches — musical <b>bridge</b>: play every note, smoothly.",
    "✔ Smooth, connected playing = <b>legato</b>.",
    "✔ The test is always the pitches: <b>Same = Tie · Different = Slur</b>.",
    "✔ Ties can cross bar lines and ADD the note values together."
  ],
  tips:[
    "Before naming any curve, cover it with your finger and compare just the noteheads.",
    "Tied rhythm trick: count the TOTAL beats (2+2=4) and hold one sound that long.",
    "Sing a slurred phrase on “ahh” — if you can hear gaps, it isn't legato yet.",
    "\u{1F501} Next lesson: signs that send you BACK — repeat signs and 1st/2nd endings!"
  ],
  rewards:{ badge:"Tie & Slur Expert", icon:"\u{1F309}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — glue and bridge, never confused again! On to the musical road signs. \u{1F309}\u{1F389}",
  miaPass:"You passed! Same = tie, different = slur — it's yours now. Review below or retry for perfection.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Two identical-looking curves with opposite jobs: the tie glues same-pitch notes into one long sound; the slur bridges different pitches smoothly.",
      play:()=>{MFAudio.tone(67,.5,0);MFAudio.tone(67,.5,.6);MFAudio.tone(67,1.6,1.5);} },
    learn:{ label:"ties and slurs",
      explain:"Tie: same pitch, one attack, values add. Slur: different pitches, play all, legato. Check the pitches — that's the whole secret.",
      hint:"Same = tie. Different = slur. Every single time.",
      play:()=>{[60,62,64,65].forEach((m,i)=>MFAudio.tone(m,.55,i*.5));} },
    example:{ label:"the examples",
      explain:"Example 1 holds one G across the bar line (tie); example 2 walks five pitches in one smooth breath (slur)." },
    game:{ label:"the games",
      explain:"Hunt curves, race the terms, tap tied rhythms (fewer taps!), and sprint through note values.",
      hint:"In the tap game, a tie = ONE tap held long." },
    quiz:{ label:"this question",
      explain:"Compare the pitches under the curve: identical = tie (play once), different = slur (play all, legato).",
      play:()=>{MFAudio.tone(64,.5,0);MFAudio.tone(64,1.2,.55);} }
  }
};
