/* Lesson 32 — Chromatic Scale (AEMT Book 2, Unit 8)
   Built from drafts/UNIT 8 – Lesson 32.md; AEMT p.51 verified by render.
   QA note honored: chromatic (EVERY pitch, all half steps) contrasted side by side
   with the major scale; keyboard runs where the student physically plays every key.
   Game-forward: the Chromatic Run (key-climb), half-step radar (gen-race), 13-tap spelling ladder.
   NOTE: edit by FULL-FILE REWRITE only. */

/* staff + keyboard side by side */
function MF_L32_staffKb(el,staffSpec,kbOpts){
  const s=document.createElement("div"); el.appendChild(s); Staff.render(s,staffSpec);
  const k=document.createElement("div"); k.style.marginTop="10px"; el.appendChild(k); Keyboard.create(k,kbOpts);
}

/* fill the missing sharps in the ascending spelling */
function MF_L32_fillBlanks(container,fb){
  const SEQ=["C","C♯","D","?","E","F","F♯","G","?","A","?","B","C"];
  const ANS=["D♯","G♯","A♯"];
  let i=0;
  container.innerHTML=`<div class="l32-line" style="text-align:center;font-weight:700;font-size:1.05rem;letter-spacing:1px;line-height:2"></div>
    <div class="choices chips l32-ch"></div>`;
  const line=container.querySelector(".l32-line"), ch=container.querySelector(".l32-ch");
  function drawLine(){
    let k=0;
    line.innerHTML=SEQ.map(s=>{
      if(s!=="?") return s;
      k++;
      return k<=i? `<b style="color:var(--correct)">${ANS[k-1]}</b>` : `<span style="display:inline-block;min-width:34px;border:2px dashed var(--primary-dark);border-radius:6px;padding:0 4px">?</span>`;
    }).join(" – ");
  }
  ["D♯","E♯","G♯","A♯","B♯"].forEach(lbl=>{ const b=document.createElement("button"); b.textContent=lbl;
    b.onclick=()=>{
      if(i>=ANS.length||b.disabled) return;
      if(lbl===ANS[i]){ b.disabled=true; b.style.opacity=".4"; i++; MFAudio.tone(56+i*5,.3); drawLine();
        if(i>=ANS.length) fb(true,"✓ C–C♯–D–D♯–E–F–F♯–G–G♯–A–A♯–B–C — thirteen notes, twelve half steps, nothing skipped!");
        else fb(true,"✓ That half step fits! Next blank…"); }
      else { MFAudio.tone(40,.25); fb(false,`The blank sits one half step above ${["D","G","A"][i]} — which sharp is that?`); }
    };
    ch.appendChild(b); });
  drawLine();
}

/* half-step detective: are the two marked keys a half step apart? */
function MF_L32_detective(container,fb){
  const ROUNDS=[
    {a:60,b:61,half:true, why:"C to C♯ — the very next key"},
    {a:64,b:65,half:true, why:"E to F — white neighbors with no black key between"},
    {a:65,b:67,half:false,why:"F to G skips F♯ — a whole step"},
    {a:71,b:72,half:true, why:"B to C — the other white-key half step"},
    {a:61,b:63,half:false,why:"C♯ to D♯ skips D — a whole step"},
    {a:68,b:69,half:true, why:"G♯ to A — the very next key"}];
  let i=0;
  container.innerHTML=`<div class="big-q l32-dq" style="text-align:center"></div><div class="l32-dkb"></div>
    <div class="choices l32-dch"><button>Half step — the VERY next key</button><button>NOT a half step — a key is skipped</button></div>`;
  const q=container.querySelector(".l32-dq"), kbHolder=container.querySelector(".l32-dkb"), ch=container.querySelector(".l32-dch");
  function ask(){ q.textContent=`Pair ${i+1} of ${ROUNDS.length}: are the two marked keys a half step apart?`;
    kbHolder.innerHTML=""; Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,marks:[ROUNDS[i].a,ROUNDS[i].b]}); }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=ROUNDS[i], saidHalf=bi===0;
    if(saidHalf===cur.half){ i++; MFAudio.tone(74,.3);
      if(i>=ROUNDS.length){ ch.style.display="none"; kbHolder.innerHTML=""; q.textContent="Half-step radar calibrated!";
        fb(true,"✓ Six pairs judged perfectly — chromatic motion is nothing but these half steps, one after another."); }
      else { fb(true,`✓ ${cur.why}. Next…`); ask(); } }
    else { MFAudio.tone(40,.25); fb(false,`Look between the marked keys: ${cur.half?"NOTHING sits between them — half step.":"one key is skipped — that's a whole step."}`); }
  });
  ask();
}

LESSON_CONTENT[32]={
  welcome:"Major scales skip keys. Today's scale skips NOTHING — every key, black and white. \u{1F9D7}",
  hook:{
    say:"Two scales, both starting on C. Listen to each — <b>which one uses EVERY key on the keyboard?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const MAJ=[60,62,64,65,67,69,71,72];
        const CHR=[60,61,62,63,64,65,66,67,68,69,70,71,72];
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Scale A</button>
          <button class="play hk-b">▶ Scale B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Scale B — it hit every single key</button><button>Scale A — it had more notes</button><button>Both used every key</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MAJ.forEach((m,i)=>MFAudio.tone(m,.28,i*.26)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2400); };
        container.querySelector(".hk-b").onclick=()=>{ CHR.forEach((m,i)=>MFAudio.tone(m,.2,i*.18)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Scale B is the CHROMATIC scale — all twelve pitches, moving only by half steps. Scale A (the major scale) skips keys; the chromatic scale never does.");
          else fb(false,"Play both again — count how tightly packed Scale B's steps are.");
        });
      } }
  },
  objectives:[
    "Define a chromatic scale",
    "Explain why every interval is a half step",
    "Count the twelve pitches within one octave",
    "Write ascending and descending chromatic scales",
    "Recognize the use of sharps (up) and flats (down)",
    "Perform a chromatic scale on the keyboard"
  ],
  steps:[
    { say:"The <b>CHROMATIC SCALE</b> is made up entirely of <b>half steps in consecutive order</b> — a <b>twelve-note scale</b> containing <b>every pitch within the octave</b>. On a keyboard it uses <b>every key, black and white</b>, and it may begin on any note. Unlike the major scale — seven different pitches built around a home keynote that <b>establishes a key center</b> — the chromatic scale has <b>no key center and no hierarchy</b>: musicians use it for <b>color</b>, for decorating melodies, for <b>smooth half-step connections</b>, and for <b>modulation</b> between keys. \u{1F447} <b>How many different pitches are inside one octave of a chromatic scale?</b>",
      show:{ type:"custom", mount:(el)=>MF_L32_staffKb(el,
        {clef:"treble",notes:[{p:"C4",d:"q",label:"C"},{p:"C#4",d:"q",label:"C♯"},{p:"D4",d:"q",label:"D"},{p:"D#4",d:"q",label:"D♯"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"G#4",d:"q",label:"G♯"},{p:"A4",d:"q",label:"A"},{p:"A#4",d:"q",label:"A♯"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"}],width:560},
        {start:60,octaves:1,labels:true,marks:[60,61,62,63,64,65,66,67,68,69,70,71,72]}) },
      try:{ type:"mc", choices:["12","7","8","15"], answer:0,
        success:"✓ Twelve pitches — the 13th note is the starting letter again, an octave up.",
        fail:"Count the marked keys, but don't count the top C twice.",
        hint:"Every key from C up to (not including) the next C." } },
    { say:"Spelling convention: going <b>UP</b>, a chromatic scale usually uses <b>SHARPS</b>. Three sharps are missing below. \u{1F447} <b>Fill the blanks in the ascending chromatic scale:</b>",
      try:{ type:"custom",
        hint:"Each blank is a half step above the note before it: D♯, G♯, A♯.",
        mount:(container,fb)=>MF_L32_fillBlanks(container,fb) } },
    { say:"Going <b>DOWN</b>, the convention flips: a descending chromatic scale usually uses <b>FLATS</b>: C–B–B♭–A–A♭–G–G♭–F–E–E♭–D–D♭–C. \u{1F447} <b>Descending chromatic scales are usually written with…?</b>",
      show:{ type:"staff", spec:{clef:"bass",notes:[{p:"C3",d:"q",label:"C"},{p:"B2",d:"q",label:"B"},{p:"Bb2",d:"q",label:"B♭"},{p:"A2",d:"q",label:"A"},{p:"Ab2",d:"q",label:"A♭"},{p:"G2",d:"q",label:"G"},{p:"Gb2",d:"q",label:"G♭"},{p:"F2",d:"q",label:"F"}],width:520} },
      try:{ type:"mc", choices:["Flats","Sharps","Naturals only","Double sharps"], answer:0,
        success:"✓ Up = sharps, down = flats — the standard beginning-theory spelling.",
        fail:"Look at the accidentals on the descending staff above.",
        hint:"⬆♯ · ⬇♭" } },
    { say:"Half-step radar time — chromatic motion is ONLY half steps, so you must spot them instantly. \u{1F447} <b>Judge each pair of marked keys:</b>",
      try:{ type:"custom",
        hint:"Half step = the VERY next key, black or white. E–F and B–C count too!",
        mount:(container,fb)=>MF_L32_detective(container,fb) } }
  ],
  examples:[
    { caption:"Ascending chromatic scale from C — sharps on the way up. Every neighboring note is one half step.",
      staff:{clef:"treble",tempo:140,notes:[{p:"C4",d:"q",label:"C"},{p:"C#4",d:"q",label:"C♯"},{p:"D4",d:"q",label:"D"},{p:"D#4",d:"q",label:"D♯"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F"},{p:"F#4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G"},{p:"G#4",d:"q",label:"G♯"},{p:"A4",d:"q",label:"A"},{p:"A#4",d:"q",label:"A♯"},{p:"B4",d:"q",label:"B"},{p:"C5",d:"q",label:"C"}],width:560},
      kb:{start:60,octaves:1,labels:true,marks:[60,61,62,63,64,65,66,67,68,69,70,71,72]} },
    { caption:"Descending chromatic scale from C — flats on the way down. Same twelve keys, opposite direction.",
      staff:{clef:"treble",tempo:140,notes:[{p:"C5",d:"q",label:"C"},{p:"B4",d:"q",label:"B"},{p:"Bb4",d:"q",label:"B♭"},{p:"A4",d:"q",label:"A"},{p:"Ab4",d:"q",label:"A♭"},{p:"G4",d:"q",label:"G"},{p:"Gb4",d:"q",label:"G♭"},{p:"F4",d:"q",label:"F"},{p:"E4",d:"q",label:"E"},{p:"Eb4",d:"q",label:"E♭"},{p:"D4",d:"q",label:"D"},{p:"Db4",d:"q",label:"D♭"},{p:"C4",d:"q",label:"C"}],width:560},
      kb:{start:60,octaves:1,labels:true,marks:[60,61,62,63,64,65,66,67,68,69,70,71,72]} }
  ],
  games:[
    { type:"key-climb", title:"Game 1 · THE CHROMATIC RUN \u{1F3C3}",
      intro:"Every key from C to C — thirteen keys, zero skips. How fast can you run it clean?",
      miaIntro:"The ultimate keyboard run — GO! \u{1F9D7}",
      spec:{start:60, octaves:1, seq:[60,61,62,63,64,65,66,67,68,69,70,71,72],
        names:["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B","C"],
        title:"Play EVERY key from C up to C — don't skip a single one!"},
      result:(stars)=>stars>=3?"A flawless chromatic run — every key, no misses!":null },
    { type:"order-tap", title:"Game 2 · Spell the Climb (13 taps)",
      intro:"Spell the ascending chromatic scale in order — sharps on the way up!",
      miaIntro:"Thirteen names, perfect order! \u{1F520}",
      spec:{sequence:["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B","C"], title:"Tap the ascending chromatic spelling — C first!"},
      result:(stars)=>stars>=3?"Perfect chromatic spelling!":null },
    { type:"gen-race", title:"Game 3 · Half-Step Radar (30s)",
      intro:"Half step or whole step? Judge as many as you can in 30 seconds!",
      miaIntro:"Radar ON — trust your keyboard eyes! \u{1F4E1}",
      spec:{gen:"step-type", params:{}, seconds:30},
      result:(score)=>score>=8?score+" in 30 seconds — radar locked!":null },
    { type:"term-race", title:"Game 4 · Chromatic Vocabulary Race",
      intro:"Every term from today — match them at speed!",
      miaIntro:"Words as fast as your fingers! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Chromatic Scale","All twelve pitches, moving only by half steps"],
        ["Half Step","The smallest interval — the very next key"],
        ["Ascending","Moving from lower pitches to higher — usually spelled with sharps"],
        ["Descending","Moving from higher pitches to lower — usually spelled with flats"],
        ["12","How many tones a chromatic scale has in one octave"]]},
      result:(score)=>score>=7?"Chromatic vocabulary complete!":null }
  ],
  practiceIntro:"20 practice questions — half steps, the 12 pitches, and the sharp-up/flat-down convention. Answer right and the next appears automatically!",
  practice:[
    { gen:"step-type", params:{}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Chromatic Scale","all twelve pitches, only half steps"],["Half Step","the smallest interval"],["Ascending","moving upward — usually sharps"],["Descending","moving downward — usually flats"]], reverse:true}, count:4 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"A chromatic scale is made up entirely of…", choices:["half steps","whole steps","major thirds"], answer:0,
      explain:"Twelve consecutive half steps." },
    { type:"mc", q:"How many different pitches are within one octave of a chromatic scale?", choices:["12","7","8"], answer:0,
      explain:"Every key, black and white, exactly once." },
    { type:"truefalse", q:"A chromatic scale includes every pitch within an octave.", answer:true,
      explain:"No skips — that's its definition." },
    { type:"truefalse", q:"Ascending chromatic scales are usually written using flats.", answer:false,
      explain:"Ascending uses SHARPS; descending uses flats." },
    { type:"mc", q:"The chromatic scale may begin on…", choices:["any note","only C","only white keys"], answer:0,
      explain:"Start anywhere — the pattern is identical." },
    { type:"mc", q:"Complete the ascending spelling: C – C♯ – D – ____ – E", choices:["D♯","E♭","D"], answer:0,
      explain:"Ascending = sharps: D♯." },
    { type:"mc", q:"Complete the descending spelling: C – B – ____ – A", choices:["B♭","A♯","G"], answer:0,
      explain:"Descending = flats: B♭." },
    { type:"mc", q:"Within one octave, the major scale has ____ different pitches; the chromatic scale has ____.", choices:["7 · 12","8 · 13","8 · 12"], answer:0,
      explain:"Both scales END on the repeated keynote — it doesn't count twice." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The chromatic scale is made up entirely of ____ in consecutive order.", choices:["half steps","whole steps","thirds"], answer:0,
      explain:"Review-sheet wording — half steps, one after another." },
    { type:"mc", q:"How many half steps are found within one octave of a chromatic scale?", choices:["12","8","13"], answer:0,
      explain:"Twelve half steps connect the thirteen written notes." }
  ],
  miaQuizIntro:"Every key, every half step — run the quiz like you ran the keyboard!",
  quiz:[
    { type:"mc", q:"A chromatic scale is made up entirely of:", choices:["Whole steps","Half steps","Major thirds","Perfect fifths"], answer:1,
      explain:"Half steps in consecutive order.", hint:"The smallest possible moves." },
    { type:"mc", q:"How many different pitches are found within one octave of a chromatic scale?", choices:["7","8","12","15"], answer:2,
      explain:"All twelve keys, black and white.", hint:"Count the marked keyboard." },
    { type:"mc", q:"The distance between every pair of adjacent notes in a chromatic scale is:", choices:["A whole step","A half step","A minor third","A perfect fourth"], answer:1,
      explain:"Always exactly one half step.", hint:"No exceptions, ever." },
    { type:"truefalse", q:"A chromatic scale includes every pitch within an octave.", answer:true,
      explain:"That's what makes it chromatic.", hint:"Chromatic = every key." },
    { type:"truefalse", q:"Ascending chromatic scales are usually written using flats.", answer:false,
      explain:"Up = sharps, down = flats.", hint:"⬆♯ ⬇♭" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Chromatic → all half steps · Ascending → up (sharps) · Descending → down (flats)",
               "Chromatic → all whole steps · Ascending → down · Descending → up",
               "Chromatic → eight notes · Ascending → flats · Descending → sharps"], answer:0,
      explain:"The three core facts of the lesson.", hint:"Direction decides the spelling." },
    { type:"mc", q:"A chromatic scale contains ____ different pitches within one octave.", choices:["12","7","13"], answer:0,
      explain:"Twelve — the 13th written note repeats the keynote.", hint:"Don't double-count the top note." },
    { type:"mc", q:"Every interval in a chromatic scale is a ____ step.", choices:["half","whole","skipped"], answer:0,
      explain:"Half steps only.", hint:"The definition itself." },
    { type:"mc", q:"Composers use the chromatic scale for…",
      choices:["color, smooth half-step connections, and modulation between keys","establishing the home key","keeping the beat steady"], answer:0,
      explain:"With no key center of its own, the chromatic scale decorates, connects and travels.", hint:"It has no 'home' to establish." },
    { type:"mc", q:"Which comparison is correct?",
      choices:["Major: 7 different pitches, establishes a key center · Chromatic: all 12, adds color with no key center",
               "Major: 12 pitches · Chromatic: 7 pitches",
               "Both scales establish a key center"], answer:0,
      explain:"The major scale builds a home key; the chromatic scale supplies every color without one.", hint:"Which scale has a 'home'?" },
    { type:"mc", q:"Complete the ascending chromatic scale: C  C♯  D  ____  E  F  F♯  G  ____  A  A♯  B  C",
      choices:["D♯ · G♯","E♭ · A♭","D · G"], answer:0,
      explain:"Ascending uses sharps: D♯ and G♯.", hint:"One half step above D, one above G." },
    { type:"mc", q:"How many half steps are found within one octave of a chromatic scale?", choices:["12","8","6"], answer:0,
      explain:"Twelve half-step moves from C to shining C.", hint:"Same as the number of pitches." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A chromatic scale skips all black keys","Every interval in a chromatic scale is a half step","Chromatic scales contain only eight notes","Chromatic scales always use sharps in both directions"], answer:1,
      explain:"Half steps only — and the spelling flips with direction.", hint:"Test each claim against the keyboard." },
    { type:"mc", q:"Which scale is shown?",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"C#4",d:"q"},{p:"D4",d:"q"},{p:"D#4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],width:340},
      choices:["The start of a chromatic scale","A major scale","A tetrachord"], answer:0,
      explain:"C–C♯–D–D♯–E–F: nothing skipped — chromatic motion.", hint:"Check the accidentals between the letters." },
    /* generated */
    { gen:"step-type", params:{}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Chromatic Scale","all twelve pitches, only half steps"],["Half Step","the smallest interval"],["Ascending","upward — usually sharps"],["Descending","downward — usually flats"]], reverse:true}, count:2 },
    { gen:"note-name", params:{clef:"bass"}, count:2 }
  ],
  vocabulary:[
    {term:"Chromatic Scale", def:"The chromatic scale is a twelve-note scale that includes every half step within the octave — C, C♯, D, D♯, E, F, F♯, G, G♯, A, A♯, B. On the keyboard it uses every key, black and white; ascending versions usually use sharps, descending versions flats."},
    {term:"Half Step", def:"The smallest interval between two adjacent notes — the very next key."},
    {term:"Ascending", def:"Moving from lower pitches to higher pitches. Ascending chromatic scales usually use sharps."},
    {term:"Descending", def:"Moving from higher pitches to lower pitches. Descending chromatic scales usually use flats."}
  ],
  mistakes:[],
  summary:[
    "✔ The <b>chromatic scale</b> = <b>every pitch</b> in the octave — <b>12 tones</b>, all <b>half steps</b>, no skips.",
    "✔ On the keyboard: <b>every key, black and white</b>.",
    "✔ Spelling convention: <b>ascending → sharps</b>, <b>descending → flats</b>.",
    "✔ It may begin on <b>any note</b>.",
    "✔ Count carefully: <b>major = 7 different pitches</b> (the 8th written note repeats the keynote) · <b>chromatic = all 12</b>.",
    "✔ <b>Function</b>: the major scale <b>establishes a key center</b> — home, hierarchy, progressions; the chromatic scale has <b>no center</b> — it supplies <b>color, embellishment, smooth connections and modulation</b>."
  ],
  tips:[
    "The chromatic scale is your interval ruler: ANY interval can be measured by counting its half steps.",
    "At a piano, run C to C touching every key — thumb-crossing drills love the chromatic scale.",
    "Remember the two white-key half steps (E–F, B–C): the chromatic scale passes straight through them with no black key needed.",
    "Next lesson: intervals — and now you own the ruler that measures them."
  ],
  rewards:{ badge:"Chromatic Climber", icon:"\u{1F9D7}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect chromatic quiz — every key, every half step, every answer! \u{1F9D7}\u{1F389}",
  miaPass:"You passed! Chant it on the way out: up with sharps, down with flats, never skip a key.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Scale A was the C major scale (it skips keys); Scale B was the chromatic scale — all twelve pitches by half step.",
      play:()=>{[60,61,62,63,64,65].forEach((m,i)=>MFAudio.tone(m,.18,i*.17));} },
    learn:{ label:"the chromatic scale",
      explain:"Twelve tones, all half steps, every key on the keyboard. Ascending is spelled with sharps, descending with flats.",
      hint:"'Chromatic = every key' — nothing is skipped.",
      play:()=>{[72,71,70,69].forEach((m,i)=>MFAudio.tone(m,.2,i*.2));} },
    example:{ label:"the examples",
      explain:"The same twelve keys twice: up with sharp spellings, down with flat spellings — watch the fully-marked keyboard." },
    game:{ label:"the games",
      explain:"Run every key against the clock, spell the climb in 13 taps, judge half steps on radar, then race the vocabulary.",
      hint:"In the Run, accuracy first — misses cost more than seconds." },
    quiz:{ label:"this question",
      explain:"Three facts do the work: 12 pitches, all half steps, sharps up / flats down.",
      play:()=>{MFAudio.tone(60,.2,0);MFAudio.tone(61,.2,.2);MFAudio.tone(62,.3,.4);} }
  }
};
