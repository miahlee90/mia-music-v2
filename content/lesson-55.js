/* Lesson 55 — Major Chord Progressions (AEMT Book 3, Unit 13 FINALE)
   Built from drafts/UNIT 13 – Lesson 55.md; AEMT3 p.87 verified by render.
   Core: chords that move = a CHORD PROGRESSION; I-IV-V(7) contain every note
   of the major scale → they can ACCOMPANY most simple melodies; root-position-only
   writing sounds choppy → IV becomes IV⁶₄, V becomes V⁶, V7 becomes V⁶₅;
   smooth versions keep a COMMON TONE between neighboring chords.
   NOTE: edit by FULL-FILE REWRITE only. */

/* common-tone finder: hear two chords, tap the shared note */
function MF_L55_common(container,fb){
  const ROUNDS=[
    {a:{name:"I (C-E-G)", ps:["C4","E4","G4"]}, b:{name:"IV (F-A-C)", ps:["F4","A4","C5"]}, shared:"C",
      expl:"C lives in both chords — keep it in the same voice and only two notes need to move."},
    {a:{name:"I (C-E-G)", ps:["C4","E4","G4"]}, b:{name:"V (G-B-D)", ps:["G4","B4","D5"]}, shared:"G",
      expl:"G is the 5th of I and the root of V — the bridge between them."},
    {a:{name:"I (C-E-G)", ps:["C4","E4","G4"]}, b:{name:"V7 (G-B-D-F)", ps:["G4","B4","D5","F5"]}, shared:"G",
      expl:"Same bridge, one extra note: V7 still shares its G with the tonic."}];
  let r=0;
  container.innerHTML=`<div class="big-q l55c-q" style="text-align:center"></div>
    <div class="l55c-staff"></div>
    <div style="text-align:center"><button class="play l55c-hear">▶ Hear both chords</button></div>`;
  const q=container.querySelector(".l55c-q"), holder=container.querySelector(".l55c-staff"), hear=container.querySelector(".l55c-hear");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You found every common tone."; holder.innerHTML=""; hear.style.display="none"; return; }
    const R=ROUNDS[r];
    q.innerHTML=`${R.a.name} then ${R.b.name}: tap the note <b>shared by both chords</b>.`;
    const notes=[...R.a.ps.map((p,ix)=>ix===0?{p,d:"w",label:R.a.name.split(" ")[0]}:{p,d:"w",chord:true}),
                 ...R.b.ps.map((p,ix)=>ix===0?{p,d:"w",label:R.b.name.split(" ")[0]}:{p,d:"w",chord:true})];
    const bStart=R.a.ps.length;
    Staff.render(holder,{clef:"treble",notes,width:400,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(i<bStart){ fb(false,"Tap inside the SECOND chord — find its borrowed note."); return; }
        if(p[0]===ROUNDS[r].shared){ MFAudio.yay(); fb(true,`✓ ${ROUNDS[r].shared} is the COMMON TONE. ${ROUNDS[r].expl}`);
          r++; setTimeout(ask,1500); }
        else fb(false,`${p[0]} belongs only to the second chord. Which letter appears in BOTH spellings?`);
      }});
  }
  hear.onclick=()=>{
    const R=ROUNDS[r]; if(!R) return;
    R.a.ps.forEach(p=>MFAudio.tone(MFAudio.midi(p),.9,0,.32));
    R.b.ps.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.1,1.0,.32));
  };
  ask();
}

/* smooth-or-choppy listening lab */
function MF_L55_smooth(container,fb){
  let hA=false,hB=false;
  const CHOPPY=[[48,64,67,72],[53,65,69,72],[48,64,67,72],[55,67,71,74,77],[48,64,67,72]];
  const SMOOTH=[[48,64,67,72],[48,65,69,72],[48,64,67,72],[47,67,71,74,77],[48,64,67,72]];
  function playProg(rows){ rows.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.05,.28))); }
  container.innerHTML=`<div class="big-q" style="text-align:center">Listen to both examples. Which bass line sounds smoother?</div>
    <div style="text-align:center">
      <button class="play l55-a">▶ Version A (all root position)</button>
      <button class="play l55-b">▶ Version B (with inversions)</button></div>
    <div class="choices l55-ch" style="display:none"><button>Version B — the bass barely moved</button><button>Version A — leaps are smoother</button></div>`;
  const ch=container.querySelector(".l55-ch");
  container.querySelector(".l55-a").onclick=()=>{ playProg(CHOPPY); hA=true; if(hB) setTimeout(()=>ch.style.display="",5600); };
  container.querySelector(".l55-b").onclick=()=>{ playProg(SMOOTH); hB=true; if(hA) setTimeout(()=>ch.style.display="",5600); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(i===0) fb(true,"✓ Version B used IV⁶₄ and V⁶₅ — the bass stayed on C, dipped one half step to B, and came home. Version A's bass leapt C→F→C→G→C. Smoothness = inversions + common tones!");
    else fb(false,"Play both again and follow only the LOWEST voice. Which one could you hum?");
  });
}

/* build-a-smooth-progression: choose the position for each chord */
function MF_L55_build(container,fb){
  const SLOTS=[
    {q:"The IV chord (the first blank): which position keeps the bass ON C (the common tone with I)?",
      choices:["IV⁶₄ (C-F-A)","IV root position (F-A-C)"], right:0,
      expl:"2nd inversion puts the IV chord's 5th — C — in the bass: no leap at all."},
    {q:"The V7 chord (the next blank): which position lets the bass slide just a half step from C?",
      choices:["V⁶₅ (B-D-F-G)","V7 root position (G-B-D-F)"], right:0,
      expl:"1st inversion puts B in the bass — one half step below C. The bass melts home: C-B-C."}];
  let s=0;
  container.innerHTML=`<div class="big-q l55b-q" style="text-align:center"></div>
    <div class="l55b-map" style="text-align:center;font-weight:800;font-size:15px;letter-spacing:1px;margin:8px 0"></div>
    <div class="choices l55b-ch"></div>
    <div style="text-align:center"><button class="play l55b-play" style="display:none">▶ Play YOUR smooth progression</button></div>`;
  const q=container.querySelector(".l55b-q"), map=container.querySelector(".l55b-map"), ch=container.querySelector(".l55b-ch"), pl=container.querySelector(".l55b-play");
  const picked=[];
  function drawMap(){
    map.textContent="I → "+(picked[0]||"?")+" → I → "+(picked[1]||"?")+" → I";
  }
  function ask(){
    drawMap();
    if(s>=SLOTS.length){
      q.textContent="Great! Listen to your chord progression.";
      ch.innerHTML=""; pl.style.display="inline-block"; return;
    }
    q.innerHTML=SLOTS[s].q; ch.innerHTML="";
    SLOTS[s].choices.forEach((c,i)=>{
      const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{
        if(i===SLOTS[s].right){ MFAudio.yay(); picked.push(c.split(" ")[0]); fb(true,"✓ "+SLOTS[s].expl); s++; setTimeout(ask,1300); }
        else { MFAudio.tone(40,.2); fb(false,"That version forces the bass to LEAP. Which choice keeps the bass next to C?"); }
      };
      ch.appendChild(b);
    });
  }
  pl.onclick=()=>{
    const rows=[[48,64,67,72],[48,65,69,72],[48,64,67,72],[47,67,71,74,77],[48,64,67,72]];
    rows.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.05,.28)));
    setTimeout(()=>fb(true,"✓ I → IV⁶₄ → I → V⁶₅ → I: the smooth-progression pattern, built by you."),5400);
  };
  ask();
}

LESSON_CONTENT[55]={stackFigures:true,
  welcome:"The Unit 13 finale — where inversions stop being theory and start making music flow. \u{1F30A}",
  hook:{
    say:"<b>A chord progression is a series of chords.</b> Listen to these two examples. Both use the same chords. <b>Which one sounds smoother?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A</button>
          <button class="play hk-b">▶ Version B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — its bass moves by small steps</button><button>Version A — large leaps sound smoother</button><button>They sound exactly the same</button></div>`;
        const A=[[48,64,67,72],[53,65,69,72],[55,67,71,74],[48,64,67,72]];
        const B=[[48,64,67,72],[48,65,69,72],[47,67,71,74],[48,64,67,72]];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const play=rows=>rows.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.0,.28)));
        container.querySelector(".hk-a").onclick=()=>{ play(A); hA=true; if(hB) setTimeout(()=>ch.style.display="",4300); };
        container.querySelector(".hk-b").onclick=()=>{ play(B); hB=true; if(hA) setTimeout(()=>ch.style.display="",4300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Both versions used the same chords — I, IV, V, I. Version B put IV and V in INVERSIONS, so the bass moved C-C-B-C instead of leaping C-F-G-C. Smoother bass movement is called good VOICE LEADING — today's lesson!");
          else fb(false,"Both versions used the same chords. Listen again and follow only the LOWEST voice of each version.");
        });
      } }
  },
  objectives:[
    "Define a chord progression",
    "Explain why I, IV and V can accompany most simple melodies",
    "Swap V7 in place of V",
    "Smooth a progression: IV → IV⁶₄, V → V⁶, V7 → V⁶₅",
    "Find common tones and keep them in the same voice",
    "Play the smooth pattern: I → IV⁶₄ → I → V⁶ (or V⁶₅) → I"
  ],
  steps:[
    { say:"<b>What is a Chord Progression?</b> A <b>chord progression</b> is a series of chords played one after another. The three primary chords — <b>I, IV, and V</b> — contain all seven notes of the major scale, so they can accompany many simple melodies. \u{1F447} <b>Together, which notes do I, IV, and V contain in C major?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:420} },
      try:{ type:"mc", choices:["All seven: C-E-G + F-A-C + G-B-D","Only five of them","Only the notes with sharps"], answer:0,
        success:"✓ C-D-E-F-G-A-B — every letter appears. Whatever note a simple melody sings, one of these three chords contains it. That's why they're the accompaniment kings.",
        fail:"List them: I gives C,E,G; IV adds F,A; V adds B,D…",
        hint:"Three chords × three notes, minus shared ones = 7 letters." } },
    { say:"<b>Using V7:</b> The <b>V7 chord</b> is often used instead of <b>V</b> because it creates a <b>stronger pull</b> back to the tonic. \u{1F447} <b>In C major, which chord replaces G–B–D?</b>",
      try:{ type:"mc", choices:["G-B-D-F (G7)","G-B-D-F♯","F-A-C-E"], answer:0,
        success:"✓ Just add the minor 7th — Lesson 50's chord slides right into the progression.",
        fail:"V7 = V + a minor 7th above the root…",
        hint:"Lesson 50's chord." } },
    { say:"<b>Why Use Inversions?</b> If every chord stays in <b>root position</b>, the bass often makes large leaps. Using inversions creates <b>smoother bass movement</b>. \u{1F447} <b>Listen to both examples. Which bass line sounds smoother?</b>",
      try:{ type:"custom",
        hint:"Follow only the lowest sound of each chord.",
        mount:(container,fb)=>MF_L55_smooth(container,fb) } },
    { say:"<b>Creating a Smoother Progression:</b> Changing the inversion of IV, V, or V7 helps the bass move by smaller intervals. This creates <b>better voice leading</b>. <b>Voice leading means moving each note as smoothly as possible from one chord to the next.</b> \u{1F447} <b>Which note moves down an octave to create IV⁶₄?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"C4",d:"w",label:"IV⁶₄"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"B3",d:"w",label:"V⁶₅"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:580} },
      try:{ type:"mc", choices:["Its 5th — the C","Its root — the F","Its 3rd — the A"], answer:0,
        success:"✓ C drops to the bass — and since C is exactly the note IV shares with I, the bass doesn't move at all between I and IV⁶₄!",
        fail:"Which note of F-A-C would land the bass on the tonic?",
        hint:"The dropped note becomes the new bass — you want it to be C." } },
    { say:"<b>Common Tones:</b> A <b>common tone</b> is a note shared by two neighboring chords. Keeping common tones in the same voice helps create <b>smooth voice leading</b>. \u{1F447} <b>Find the common tones:</b>",
      try:{ type:"custom",
        hint:"Compare the spellings letter by letter.",
        mount:(container,fb)=>MF_L55_common(container,fb) } },
    { say:"<b>A Smooth Chord Progression:</b> I → IV⁶₄ → I → V⁶ (or V⁶₅) → I. Each pair of neighboring chords shares at least one common tone. \u{1F447} <b>Which note is shared by I and V⁶₅?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"IV⁶₄"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"B3",d:"w",label:"V⁶₅"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:620} },
      try:{ type:"mc", choices:["G — the 5th of I and the root of V7","C — it's in every chord","B — the leading tone"], answer:0,
        success:"✓ G holds steady while B-D-F lean in around it. Every joint in this progression has its own little anchor.",
        fail:"Spell both: C-E-G and G-B-D-F. One letter overlaps…",
        hint:"I and V7 share exactly one note." } },
    { say:"Arrange the chords to create the smoothest bass line. \u{1F447}",
      try:{ type:"custom",
        hint:"Keep the bass ON or NEXT TO C at every step.",
        mount:(container,fb)=>MF_L55_build(container,fb) } }
  ],
  examples:[
    { caption:"The CHOPPY version: I-IV-I-V7-I, everything in root position. A fine progression — but watch and hear the bass LEAP: C up to F, back down, up to G…",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:620},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"The SMOOTH version: I-IV⁶₄-I-V⁶₅-I. Common tones hold their places, the bass whispers C-C-C-B-C, and the same harmony suddenly sounds like one connected thought.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"IV⁶₄"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"B3",d:"w",label:"V⁶₅"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:620},
      kb:{start:59,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Toolkit Sprint (45s)",
      intro:"Positions AND figures, triads AND sevenths — the full Unit 13 arsenal at speed!",
      miaIntro:"Everything from Lessons 51-54! \u{1F9F0}",
      spec:{gen:"inversion-id", params:{subject:"both", ask:"both"}, seconds:45},
      result:(score)=>score>=8?score+" — the whole toolkit is sharp!":null },
    { type:"key-climb", title:"Game 2 · Smooth-Progression Climb",
      intro:"Play the smooth progression chord by chord: I, IV⁶₄, V⁶₅, I — bottom to top!",
      miaIntro:"Feel the bass hold its ground! \u{1FA9C}",
      spec:{seq:[60,64,67, 60,65,69, 59,62,65,67, 60,64,67],
        names:["C (I: bass)","E","G","C (IV⁶₄: same bass!)","F","A","B (V⁶₅: half step down)","D","F","G","C (I: home)","E","G"],
        start:59, octaves:1, title:"I → IV⁶₄ → V⁶₅ → I, note by note"},
      result:(score)=>score!==null?"You just PLAYED smooth voice leading!":null },
    { type:"symbol-hunt", title:"Game 3 · Progression Chord Spotter",
      intro:"The four chords of the smooth progression — click what each round names!",
      miaIntro:"Know your cast of characters! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"I (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"IV⁶₄ (C-F-A)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"V⁶₅ (B-D-F-G)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"V⁶ (B-D-G)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Cast memorized — you're the director now!":null },
    { type:"term-race", title:"Game 4 · UNIT 13 GRAND FINALE Race",
      intro:"The victory lap: inversions, figures, progressions — all five lessons!",
      miaIntro:"Everything you've built this unit — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["Chord progression","chords moving from one to another"],
        ["Common tone","a note shared by two neighboring chords"],
        ["Voice leading","moving each voice the shortest distance"],
        ["1st inversion","the 3rd is in the bass"],
        ["2nd inversion","the 5th is in the bass"],
        ["3rd inversion","the 7th is in the bass (V7 only)"],
        ["6/4","the figure for a 2nd-inversion triad"],
        ["6/5","the figure for a 1st-inversion V7"],
        ["The smooth formula","I → IV⁶₄ → I → V⁶(₅) → I"],
        ["Why I, IV, V accompany melodies","together they contain the whole scale"]]},
      result:(score)=>score>=8?"UNIT 13 CHAMPION — inversions conquered!":null }
  ],
  practiceIntro:"20 practice questions — progressions, common tones and the smoothing recipe. Answer right and the next appears automatically!",
  practice:[
    { gen:"inversion-id", params:{subject:"both", ask:"both"}, count:6 },
    { gen:"term-match", params:{subject:"term", pool:[["Chord progression","a sequence of moving chords"],["Common tone","a note two chords share"],["Voice leading","smooth movement between chords"],["Nearest motion","each voice moves the shortest distance"],["IV⁶₄","the IV chord with its 5th in the bass"]], reverse:true}, count:4 },
    { type:"mc", q:"Chords that move from one to another are called a…", choices:["chord progression","scale","cadenza"], answer:0,
      explain:"Progress = move forward." },
    { type:"mc", q:"Why can I, IV, and V accompany many simple melodies?", choices:["together they contain all the notes of the major scale","they are the loudest chords","they never change position"], answer:0,
      explain:"C-E-G + F-A-C + G-B-D = all seven letters." },
    { type:"mc", q:"In many progressions, the V chord is replaced by…", choices:["V7","IV","vii"], answer:0,
      explain:"Same function, stronger pull to I." },
    { type:"mc", q:"A progression using only root-position chords often sounds…", choices:["choppy — the bass leaps","smoother than inversions","out of tune"], answer:0,
      explain:"Root-to-root bass motion means constant 4th and 5th leaps." },
    { type:"mc", q:"Which notes move down an octave in V7 to create V⁶₅?", choices:["the 3rd, 5th and 7th","only the root","just the 7th"], answer:0,
      explain:"G-B-D-F → B-D-F-G = V⁶₅, bass one half step under the tonic." },
    { type:"mc", q:"In the smooth pattern I → IV⁶₄ → I, the bass line is…", choices:["C — C — C (it never moves)","C — F — C","C — A — C"], answer:0,
      explain:"IV⁶₄ borrows the common tone C as its bass." },
    { type:"truefalse", q:"A common tone is a note shared by two consecutive chords.", answer:true,
      explain:"Keep it in the same voice for smooth writing." },
    { type:"truefalse", q:"Good voice leading moves every voice as far as possible.", answer:false,
      explain:"The opposite — the SHORTEST possible distance." },
    { type:"truefalse", q:"I and IV in C major share the note C.", answer:true,
      explain:"C-E-G and F-A-C overlap on C." },
    { type:"truefalse", q:"Inversions change which chords appear in a progression.", answer:false,
      explain:"Same chords, new arrangements — that's the whole point." }
  ],
  miaQuizIntro:"The Unit 13 finale quiz! Bass lines, common tones, figures — bring it all.",
  quiz:[
    { type:"mc", q:"A chord progression is…", choices:["a sequence of chords","a single chord","a scale","a melody"], answer:0,
      explain:"Chords in motion, one to the next.", hint:"Pro-GRESS." },
    { type:"mc", q:"A common tone is…", choices:["a note shared by two consecutive chords","a repeated rhythm","the bass note","the highest note"], answer:0,
      explain:"The shared note that connects neighboring chords.", hint:"Common = shared." },
    { type:"mc", q:"Why are inversions used in chord progressions?", choices:["To create smoother voice leading","To make chords louder","To change the key","To add more notes"], answer:0,
      explain:"Inversions let the bass walk instead of leap.", hint:"Think of version B in the hook." },
    { type:"truefalse", q:"Good voice leading usually minimizes the distance each voice moves.", answer:true,
      explain:"Move less → sound smoother.", hint:"The Memory Tip." },
    { type:"truefalse", q:"The best voice leading always requires large leaps.", answer:false,
      explain:"Exactly backwards — nearest motion wins.", hint:"Would you rather walk or jump?" },
    { type:"mc", q:"Which pair of chords shares the note C?", choices:["C major and F major","C major and D major","G major and D major","D major and A major"], answer:0,
      explain:"C-E-G and F-A-C both contain C.", hint:"Spell each pair." },
    { type:"mc", q:"In the lesson's smooth I → IV → I → V7 → I progression, which inversion is used for IV?", choices:["2nd inversion (IV⁶₄)","root position","3rd inversion"], answer:0,
      explain:"Its 5th (C) drops to the bass — the common tone with I.", hint:"Which figure kept the bass on C?" },
    { type:"mc", q:"In the same smooth progression, which inversion is used for V (or V7)?", choices:["1st inversion (V⁶ or V⁶₅)","2nd inversion","root position"], answer:0,
      explain:"3rd (B) in the bass — a half step from home.", hint:"The bass sang C-B-C." },
    { type:"mc", q:"What is the bass line of I → IV⁶₄ → I → V⁶₅ → I in C major?", choices:["C - C - C - B - C","C - F - C - G - C","C - A - C - F - C"], answer:0,
      explain:"Two common-tone basses plus one half-step neighbor.", hint:"Almost nothing moves." },
    { type:"mc", q:"A student writes every chord in root position, creating large leaps between chords. What important idea is missing?", choices:["Voice leading","Key signature","Tempo","Meter"], answer:0,
      explain:"Smooth part-writing = common tones + nearest motion.", hint:"It's today's title concept." },
    { type:"mc", q:"Identify this progression chord (in C major).",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:200},
      choices:["IV⁶₄ — F major with C in the bass","IV in root position","I with a wrong note"], answer:0,
      explain:"F-A-C flipped so its 5th anchors the bass.", hint:"Spell it in 3rds: F-A-C." },
    { type:"mc", q:"Identify this progression chord (in C major).",
      staff:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:200},
      choices:["V⁶₅ — G7 with B in the bass","V7 in root position","I⁶"], answer:0,
      explain:"G-B-D-F with the 3rd (B) in the bass: the smooth dominant.", hint:"Four notes — find the 2nd, root on top." },
    /* generated */
    { gen:"inversion-id", params:{subject:"both", ask:"both"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Common tone","note shared by neighboring chords"],["Voice leading","shortest-distance part movement"],["IV⁶₄","IV with the common tone C in the bass"],["V⁶₅","V7 with the leading tone in the bass"]], reverse:true}, count:2 },
    { gen:"degree-name", params:{ask:"name"}, count:2 }
  ],
  vocabulary:[
    {term:"Chord Progression", def:"A sequence of chords moving from one to another — the harmonic engine of nearly all music."},
    {term:"Common Tone", def:"A note shared by two consecutive chords. Keep it in the same voice for smoothness."},
    {term:"Voice Leading", def:"The craft of moving each voice the shortest possible distance from chord to chord."},
    {term:"IV⁶₄", def:"The IV chord in 2nd inversion — its 5th (the tonic note!) in the bass.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:130}},
    {term:"V⁶₅", def:"The V7 chord in 1st inversion — the leading tone in the bass, a half step from home.",
      staff:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}}
  ],
  mistakes:[],
  summary:[
    "✔ A <b>chord progression</b> is chords in motion; <b>I, IV and V(7) contain the whole major scale</b>, so they can accompany most simple melodies.",
    "✔ All-root-position writing sounds <b>choppy</b> — the bass must leap.",
    "✔ The fixes: <b>IV → IV⁶₄</b> (5th drops), <b>V → V⁶</b>, <b>V7 → V⁶₅</b> (3rd in the bass).",
    "✔ <b>Common tones stay put</b>; every other voice moves the <b>nearest</b> distance.",
    "✔ The formula: <b>I → IV⁶₄ → I → V⁶(₅) → I</b>, bass line C-C-C-B-C. <b>UNIT 13 COMPLETE!</b> \u{1F389}"
  ],
  tips:[
    "Play the smooth progression daily in C — then try it in G (bass G-G-G-F♯-G) and F (bass F-F-F-E-F). The shape transfers to every major key.",
    "Hymns, pop ballads, film scores: when the harmony sounds like it's breathing rather than jumping, you're hearing common tones held in place.",
    "Arranger's habit: before moving ANY voice, ask \u{201C}can it stay?\u{201D} The best move is often no move.",
    "Unit 14 opens a new world: what happens to scales — and all these chords — in MINOR keys…"
  ],
  rewards:{ badge:"Smooth Operator — Unit 13 Champion", icon:"\u{1F30A}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT finale to Unit 13 — your progressions are beautifully smooth! \u{1F30A}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — and Unit 13 is COMPLETE! Inversions, figures, progressions: all yours. \u{1F389}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both versions were I-IV-V-I. Version B flipped IV and V into inversions so the bass walked C-C-B-C instead of leaping C-F-G-C.",
      play:()=>{const B=[[48,64,67,72],[48,65,69,72],[47,67,71,74],[48,64,67,72]];B.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.0,.28)));} },
    learn:{ label:"smooth progressions",
      explain:"I-IV-V(7) cover the whole scale. Root-only = choppy; IV⁶₄ and V⁶(₅) keep common tones in place and the bass moving by step: I → IV⁶₄ → I → V⁶₅ → I.",
      hint:"Common tones stay; everything else moves the least.",
      play:()=>{[[48,64,67,72],[48,65,69,72],[48,64,67,72],[47,67,71,74,77],[48,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.0,.26)));} },
    example:{ label:"the examples",
      explain:"Example 1 is the choppy all-root version; example 2 is the smooth rewrite — same chords, walking bass line C-C-C-B-C." },
    game:{ label:"the games",
      explain:"Sprint the whole toolkit, physically play the smooth progression, spot its four chords, then run the Unit 13 victory lap.",
      hint:"Bass first. Always bass first." },
    quiz:{ label:"this question",
      explain:"Two ideas answer nearly everything: common tones stay in place, and inversions exist to shorten the bass's journey.",
      play:()=>{[[48,64,67,72],[47,67,71,74,77],[48,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,1.0,i*1.0,.28)));} }
  }
};
