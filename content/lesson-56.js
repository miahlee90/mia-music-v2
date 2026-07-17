/* Lesson 56 — Minor Scales (Relative Minor) (AEMT Book 3, Unit 14)
   Built from drafts/UNIT 14 – Lesson 56.md; AEMT3 p.90 verified by render.
   Core: every major key has a RELATIVE MINOR with the SAME key signature;
   the relative minor begins on the 6TH note of the relative major scale;
   shortcut: a minor 3rd DOWN from the major keynote (m3 UP to return).
   NOTE: edit by FULL-FILE REWRITE only. */

/* find-the-6th: click the 6th degree of a rendered major scale */
function MF_L56_sixth(container,fb){
  const ROUNDS=[
    {maj:"C major", ps:["C4","D4","E4","F4","G4","A4","B4","C5"], keysig:undefined, minor:"A"},
    {maj:"G major", ps:["G4","A4","B4","C5","D5","E5","F#5","G5"], keysig:"G", minor:"E"},
    {maj:"F major", ps:["F4","G4","A4","Bb4","C5","D5","E5","F5"], keysig:"F", minor:"D"}];
  let r=0;
  container.innerHTML=`<div class="big-q l56s-q" style="text-align:center"></div>
    <div class="l56s-staff"></div>`;
  const q=container.querySelector(".l56s-q"), holder=container.querySelector(".l56s-staff");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You found the relative minor keys."; holder.innerHTML=""; return; }
    const R=ROUNDS[r];
    q.innerHTML=`${R.maj} scale: tap the <b>6th scale degree</b>.`;
    Staff.render(holder,{clef:"treble",keysig:R.keysig,
      notes:R.ps.map((p,i)=>({p, d:"q", acc:R.keysig?"none":undefined, label:String(i+1)})),
      width:520, clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(i===5){ MFAudio.yay();
          fb(true,`✓ Great! Degree 6 of ${R.maj} is ${R.minor} — the relative minor is ${R.minor} minor, with the same key signature.`);
          r++; setTimeout(ask,1500);
        } else fb(false,`That's degree ${i+1}. Count up to SIX.`);
      }});
  }
  ask();
}

/* minor-3rd-down shortcut on the keyboard */
function MF_L56_down3(container,fb){
  const ROUNDS=[
    {maj:"C", start:72, target:69, minor:"A"},
    {maj:"G", start:67, target:64, minor:"E"},
    {maj:"F", start:65, target:62, minor:"D"},
    {maj:"D", start:74, target:71, minor:"B"}];
  let r=0,kb=null;
  container.innerHTML=`<div class="big-q l56k-q" style="text-align:center"></div><div class="l56k-kb"></div>`;
  const q=container.querySelector(".l56k-q"), kh=container.querySelector(".l56k-kb");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You found the relative key of each major key."; kb.point(null); return; }
    const R=ROUNDS[r];
    kb.point(R.start);
    q.innerHTML=`Press the major tonic <b>${R.maj}</b> (red arrow), then count <b>three half steps down</b> to the relative minor.`;
  }
  let armed=false;
  kb=Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      if(m===R.start){ armed=true; kb.point(null); q.innerHTML=`Excellent! Now count down three half steps.`; return; }
      if(!armed){ fb(false,"Start from the red arrow — the MAJOR keynote."); return; }
      if(m===R.target){ MFAudio.yay();
        fb(true,`✓ Great! You found the relative key: ${R.minor} minor.`);
        armed=false; r++; setTimeout(ask,1400); }
      else { MFAudio.tone(40,.2); fb(false,"Count key by key — 3 half steps below the major keynote (black keys count!)."); }
    }});
  ask();
}

LESSON_CONTENT[56]={
  welcome:"Unit 14 begins — welcome to the minor world. Every major key has a relative minor. \u{1F3E0}",
  hook:{
    say:"<b>These two scales use the same notes and the same key signature.</b> <b>Why do they sound different?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Scale 1</button>
          <button class="play hk-b">▶ Scale 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>They start on different notes — the tonic is different</button><button>Scale 2 secretly added flats</button><button>Scale 2 was played more quietly</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,62,64,65,67,69,71,72].forEach((m,i)=>MFAudio.tone(m,.45,i*.32,.4)); hA=true; if(hB) setTimeout(()=>ch.style.display="",3000); };
        container.querySelector(".hk-b").onclick=()=>{ [57,59,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.45,i*.32,.4)); hB=true; if(hA) setTimeout(()=>ch.style.display="",3000); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Scale 1 was C major (C to C); scale 2 used the same notes from A to A — the RELATIVE MINOR. Same key signature, different tonic. Today's lesson!");
          else fb(false,"Both scales use exactly the same notes. Listen for the note each scale treats as home — the tonic.");
        });
      } }
  },
  objectives:[
    "Define relative minor and relative major",
    "Find the relative minor: the 6TH degree of the major scale",
    "Use the shortcut: a minor 3rd DOWN from the major keynote",
    "Go the other way: a minor 3rd UP from minor to major",
    "Explain why relatives share one key signature",
    "Name relative pairs for the keys you know"
  ],
  steps:[
    { say:"<b>Relative Major and Minor:</b> Every <b>major key</b> has a <b>relative minor</b>. Relative keys share the <b>same key signature</b>, but they have different tonic notes. \u{1F447} <b>What do relative keys share?</b>",
      try:{ type:"mc", choices:["The same key signature","The same tonic","The same tempo"], answer:0,
        success:"✓ One key signature, two keys — a major key and a minor key. The difference is the tonic.",
        fail:"Look at the sharps and flats at the start of the staff…",
        hint:"Think of the sharps and flats at the start of the staff." } },
    { say:"<b>Finding the Relative Minor:</b> The relative minor begins on the <b>6th degree</b> of the major scale. That note becomes the tonic of the minor key. \u{1F447} <b>Tap the 6th scale degree:</b>",
      try:{ type:"custom",
        hint:"Count the scale notes 1-2-3-4-5-6 from the keynote.",
        mount:(container,fb)=>MF_L56_sixth(container,fb) } },
    { say:"<b>Shortcut:</b> The relative minor is a <b>minor 3rd (3 half steps)</b> below the major tonic. \u{1F447} <b>Find four relative minor keys:</b>",
      try:{ type:"custom",
        hint:"3 half steps down — count every key, black ones included.",
        mount:(container,fb)=>MF_L56_down3(container,fb) } },
    { say:"<b>Example:</b> C major and A minor use the <b>same seven notes</b>. They sound different because <b>A</b> becomes the tonic instead of <b>C</b>. <b>Remember: relative major and minor keys have the same key signature, but they are different keys because they have different tonics.</b> \u{1F447} <b>Why do C major and A minor have the same key signature?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"C major"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q",label:"6 = A!"},{p:"B4",d:"q"},{p:"C5",d:"q"},{bar:"double"},
        {p:"A3",d:"q",label:"A minor"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{bar:"final"}],width:640} },
      try:{ type:"mc", choices:["They use exactly the same seven tones","A minor secretly uses flats","Minor keys never have signatures"], answer:0,
        success:"✓ Same seven letters, same accidentals (none here) — so the signature can't tell them apart. Only the TONIC can.",
        fail:"Compare the letters of both scales…",
        hint:"A-B-C-D-E-F-G vs C-D-E-F-G-A-B." } },
    { say:"<b>Finding the Relative Major:</b> To find the relative major, move <b>up a minor 3rd</b> from the minor tonic. \u{1F447} <b>What is the relative major of E minor?</b>",
      try:{ type:"mc", choices:["G major","C major","E major"], answer:0,
        success:"✓ E up a minor 3rd = G. E minor and G major share one sharp (F♯).",
        fail:"Count 3 half steps UP from E: F, F♯, G.",
        hint:"Minor → major = climb a m3." } },
    { say:"<b>Reading Key Signatures:</b> Every key signature represents <b>one major key</b> and <b>one relative minor key</b>. \u{1F447} <b>One flat belongs to F major and…</b>",
      show:{ type:"staff", spec:{clef:"treble",keysig:"F",notes:[],width:220} },
      try:{ type:"mc", choices:["D minor","A minor","B♭ minor"], answer:0,
        success:"✓ The 6th degree of F major is D → D minor. From now on, every signature you see is a duo.",
        fail:"Walk up the F major scale to degree 6: F-G-A-B♭-C-D…",
        hint:"Or drop a m3 from F." } }
  ],
  examples:[
    { caption:"C major, then its relative A minor — the same white-key family around two different homes. Watch the keyboard: identical keys, different gravity.",
      staff:{clef:"treble",tempo:110,notes:[
        {p:"C4",d:"q",label:"C major"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"h"},{bar:"double"},
        {p:"A3",d:"q",label:"A minor"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"h"},{bar:"final"}],width:640},
      kb:{start:57,octaves:1.25,labels:true} },
    { caption:"The relative pair with one sharp: G major and E minor. The F♯ from the signature colors both scales — one signature, two personalities.",
      staff:{clef:"treble",keysig:"G",tempo:110,notes:[
        {p:"G4",d:"q",label:"G major"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q",label:"6 = E"},{p:"F#5",d:"q",acc:"none"},{p:"G5",d:"h"},{bar:"double"},
        {p:"E4",d:"q",label:"E minor"},{p:"F#4",d:"q",acc:"none"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"h"},{bar:"final"}],width:640},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Relative Race (45s)",
      intro:"Majors to minors, minors to majors, signatures to keys — how many pairs can you match?",
      miaIntro:"Count to 6 — or drop a m3! \u{26A1}",
      spec:{gen:"rel-key", params:{ask:"both"}, seconds:45},
      result:(score)=>score>=8?score+" relatives united — family reunion complete!":null },
    { type:"key-climb", title:"Game 2 · Minor-3rd Elevator",
      intro:"Press each major keynote, then ride 3 half steps down to its relative minor!",
      miaIntro:"Going down! \u{1F6D7}",
      spec:{seq:[72,69, 67,64, 65,62, 74,71],
        names:["C (major keynote)","A — relative minor!","G (major keynote)","E — relative minor!","F (major keynote)","D — relative minor!","D (major keynote)","B — relative minor!"],
        start:60, octaves:1.3333, title:"C→Am, G→Em, F→Dm, D→Bm — majors and their relatives"},
      result:(score)=>score!==null?"Elevator operator certified — every floor a minor 3rd!":null },
    { type:"sig-match", title:"Game 3 · Key Signature Match",
      intro:"Drag each MINOR key name onto the key signature it shares with its relative major!",
      miaIntro:"Same key signature, minor key! \u{1F3E0}",
      spec:{rounds:2, perRound:4, clefs:["treble","bass"], pool:[
        {key:"C",label:"A minor"},
        {key:"G",label:"E minor"},
        {key:"D",label:"B minor"},
        {key:"F",label:"D minor"},
        {key:"Bb",label:"G minor"},
        {key:"Eb",label:"C minor"}]},
      result:(stars)=>stars>=2?"Every signature now has two names in your head!":null },
    { type:"term-race", title:"Game 4 · Relative-Pairs Sprint",
      intro:"Match majors with their relative minors at top speed!",
      miaIntro:"Family matching time! \u{1F3C1}",
      spec:{rounds:9, reverse:true, pool:[
        ["C major","A minor"],
        ["G major","E minor"],
        ["D major","B minor"],
        ["A major","F♯ minor"],
        ["F major","D minor"],
        ["B♭ major","G minor"],
        ["E♭ major","C minor"],
        ["Relative minor","starts on the major scale's 6th degree"],
        ["Relative major","a minor 3rd above the minor keynote"]]},
      result:(score)=>score>=7?"The whole family tree memorized!":null }
  ],
  practiceIntro:"20 practice questions — pairs, signatures, shortcuts. Answer right and the next appears automatically!",
  practice:[
    { gen:"rel-key", params:{ask:"both"}, count:8 },
    { gen:"term-match", params:{subject:"term", pool:[["Relative minor","same signature, tonic on the major's 6th degree"],["Relative major","same signature, a m3 above the minor tonic"],["Tonic","the home note of a scale"],["Key signature","the sharps or flats at the start of the staff"]], reverse:true}, count:4 },
    { type:"mc", q:"The relative minor begins on which degree of the major scale?", choices:["6th","5th","3rd"], answer:0,
      explain:"Degree 6 becomes the minor keynote." },
    { type:"mc", q:"How can you quickly find the relative minor?", choices:["a minor 3rd down","a whole step down","a perfect 5th up"], answer:0,
      explain:"3 half steps below — C down to A." },
    { type:"mc", q:"The relative minor of D major is…", choices:["B minor","D minor","F# minor"], answer:0,
      explain:"6th degree of D major = B." },
    { type:"mc", q:"What is the relative major of C minor?", choices:["E♭ major","C major","G major"], answer:0,
      explain:"A minor 3rd up from C = E♭; both carry 3 flats." },
    { type:"truefalse", q:"Relative keys have the same key signature.", answer:true,
      explain:"That's what makes them relatives." },
    { type:"truefalse", q:"Relative keys have the same tonic.", answer:false,
      explain:"Different tonics — that's the whole difference!" },
    { type:"truefalse", q:"A minor uses only the tones of C major.", answer:true,
      explain:"Same seven notes, reordered around A." },
    { type:"truefalse", q:"There is one major key that has no relative minor.", answer:false,
      explain:"EVERY major key has one — 15 majors, 15 relative minors." }
  ],
  miaQuizIntro:"Quiz time! Count to 6, or ride the minor-3rd elevator — both roads lead home.",
  quiz:[
    { type:"mc", q:"What do relative major and minor keys share?", choices:["The same key signature","The same tonic","The same starting note","The same tempo"], answer:0,
      explain:"One signature, two keys.", hint:"Look at the start of the staff." },
    { type:"mc", q:"The relative minor scale begins on which note of the major scale?", choices:["The 6th","The 5th","The 2nd","The 7th"], answer:0,
      explain:"Degree 6 = the minor keynote and its name.", hint:"Think '6 = relative minor'." },
    { type:"mc", q:"The relative minor of C major is…", choices:["A minor","E minor","C minor","D minor"], answer:0,
      explain:"C-D-E-F-G-A: the 6th note is A.", hint:"Count to 6." },
    { type:"mc", q:"The relative minor of G major is…", choices:["E minor","B minor","G minor","D minor"], answer:0,
      explain:"6th degree of G major = E; both have 1 sharp.", hint:"G-A-B-C-D-…" },
    { type:"mc", q:"How can you find the relative minor from a major key?", choices:["down a minor 3rd from the major keynote","up a perfect 4th","down a whole step"], answer:0,
      explain:"C down 3 half steps = A.", hint:"The elevator game." },
    { type:"mc", q:"How can you find the relative major from a minor key?", choices:["up a minor 3rd","down a minor 3rd","up a perfect 5th"], answer:0,
      explain:"The same elevator, ridden upward.", hint:"Opposite direction from before." },
    { type:"truefalse", q:"Relative major and minor scales use the same tones.", answer:true,
      explain:"Identical notes, different home base.", hint:"Why the signature matches." },
    { type:"truefalse", q:"The relative minor of F major is F minor.", answer:false,
      explain:"It's D minor — count to F major's 6th degree. F minor is a DIFFERENT relationship (parallel).", hint:"Same LETTER doesn't mean relative." },
    { type:"mc", q:"This key signature belongs to which relative PAIR?",
      staff:{clef:"treble",keysig:"D",notes:[],width:200},
      choices:["D major & B minor","D major & D minor","G major & E minor"], answer:0,
      explain:"2 sharps = D major; its 6th degree is B → B minor.", hint:"Name the major first, then count to 6." },
    { type:"mc", q:"A melody uses only the white keys and ends on A. What is the most likely key?", choices:["A minor","C major","A major"], answer:0,
      explain:"Home base decides: white keys + tonic A = A minor.", hint:"Where does it feel finished?" },
    { type:"mc", q:"How many relative minor keys are there?", choices:["15 — one for every major key","12","7"], answer:0,
      explain:"Every one of the 15 major key signatures has a relative minor.", hint:"Same count as major keys." },
    { type:"mc", q:"B♭ major (2 flats) has which relative minor?", choices:["G minor","B♭ minor","D minor"], answer:0,
      explain:"6th degree of B♭ major = G.", hint:"B♭-C-D-E♭-F-G…" },
    /* generated */
    { gen:"rel-key", params:{ask:"both"}, count:5 },
    { gen:"term-match", params:{subject:"term", pool:[["Relative minor","6th degree of the major scale"],["Relative major","m3 above the minor keynote"],["Same signature","what relative keys share"],["Different tonic","what makes relatives differ"]], reverse:true}, count:2 },
    { gen:"keysig-id", params:{}, count:1 }
  ],
  vocabulary:[
    {term:"Relative Minor", def:"The minor key sharing a major key's signature. Its keynote is the 6th degree of the major scale."},
    {term:"Relative Major", def:"The major key sharing a minor key's signature — a minor 3rd above the minor keynote."},
    {term:"Tonic (Keynote)", def:"The home note a scale starts from, ends on, and is named after."},
    {term:"C major ↔ A minor", def:"The simplest relative pair: no sharps, no flats, two different homes."}
  ],
  mistakes:[],
  summary:[
    "✔ Every major key has a <b>relative minor with the SAME key signature</b>.",
    "✔ The relative minor starts on the <b>6th degree</b> of the major scale — that note names the key.",
    "✔ Shortcut: <b>minor 3rd DOWN</b> from major keynote; <b>minor 3rd UP</b> to come back.",
    "✔ Relatives share <b>all seven tones</b> — only the tonic (home) differs.",
    "✔ Every signature now has <b>two names</b>: G major/E minor, F major/D minor…"
  ],
  tips:[
    "Songs in minor keys often visit their relative major mid-song (and vice versa) — the shared signature makes the door frictionless.",
    "Quick check when reading music: look at the LAST note of the piece. Ending on the signature's major tonic? Major key. Ending a m3 below it? Probably the relative minor.",
    "Memorize the white-key trio: C↔Am, G↔Em, F↔Dm. Every other pair follows the same 6th-degree logic.",
    "Next lesson: the minor scale turns out to have THREE different forms — and each one has a job."
  ],
  rewards:{ badge:"Relative Finder", icon:"\u{1F3E0}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! You can find any key's relative in your sleep now. \u{1F3E0}\u{1F389}",
  miaPass:"Passed! The 6th-degree secret is yours. Next: minor scales that shape-shift…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both scales used only white keys. Scale 1 ran C to C (C major); scale 2 ran A to A — the relative minor, darker because its home moved.",
      play:()=>{[57,59,60,62,64,65,67,69].forEach((m,i)=>MFAudio.tone(m,.42,i*.3,.4));} },
    learn:{ label:"relative keys",
      explain:"Same signature, different tonic. Find the relative minor on the major scale's 6th degree, or a minor 3rd below the keynote. Reverse: m3 up.",
      hint:"6 = relative minor.",
      play:()=>{MFAudio.tone(72,.5,0,.4);MFAudio.tone(69,.8,.5,.4);} },
    example:{ label:"the examples",
      explain:"Example 1 pairs C major with A minor on white keys; example 2 shows G major and E minor sharing their F♯." },
    game:{ label:"the games",
      explain:"Race the pairs, ride the minor-3rd elevator, drag minors onto signatures, then sprint the family tree.",
      hint:"Count to 6 or drop 3 half steps — same answer." },
    quiz:{ label:"this question",
      explain:"Two tools solve everything: the 6th degree of the major scale, and the minor-3rd elevator between keynotes.",
      play:()=>{MFAudio.tone(67,.5,0,.4);MFAudio.tone(64,.8,.5,.4);} }
  }
};
