/* Lesson 59 — Augmented and Diminished Triads (AEMT Book 3, Unit 14 FINALE)
   Built from drafts/UNIT 14 – Lesson 59.md; AEMT3 p.93 verified by render.
   Core: AUGMENTED (+) = major triad with the 5th RAISED ½ step (M3+M3);
   DIMINISHED (°) = minor triad with the 5th LOWERED ½ step (m3+m3);
   symbols: letter=major, m=minor, +=aug, °=dim; MAJOR TRIAD SCALE:
   degrees 1-4-5 major, 2-3-6 minor, 7 DIMINISHED (vii°).
   NOTE: edit by FULL-FILE REWRITE only. */

/* stretch & shrink lab: tap the 5th to alter it */
function MF_L59_lab(container,fb){
  const ROUNDS=[
    {from:"C major (C-E-G)", to:"C+ — AUGMENTED", base:["C4","E4","G4"], out:["C4","E4","G#4"], dir:"raise",
      expl:"G was raised to G♯ — a major triad with a raised 5th: AUGMENTED (C+)."},
    {from:"C minor (C-E♭-G)", to:"C° — DIMINISHED", base:["C4","Eb4","G4"], out:["C4","Eb4","Gb4"], dir:"lower",
      expl:"G was lowered to G♭ — a minor triad with a lowered 5th: DIMINISHED (C°)."}];
  let r=0;
  container.innerHTML=`<div class="big-q l59l-q" style="text-align:center"></div>
    <div class="l59l-staff"></div>
    <div style="text-align:center"><button class="play l59l-next" style="display:none">▶ Next chord</button></div>`;
  const q=container.querySelector(".l59l-q"), holder=container.querySelector(".l59l-staff"), nxt=container.querySelector(".l59l-next");
  function draw(ps,label,clickable){
    Staff.render(holder,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w",label}:{p,d:"w",chord:true}),
      width:250, clickNotes:clickable,
      onNote: clickable? (i)=>{
        const R=ROUNDS[r];
        if(i===2){
          draw(R.out, R.to, false);
          R.out.forEach(p=>MFAudio.tone(MFAudio.midi(p),1.2,.1,.32));
          fb(true,`✓ ${R.expl}`);
          r++;
          if(r<ROUNDS.length) nxt.style.display="inline-block";
          else q.textContent="Excellent! You built an augmented and a diminished triad.";
        } else { MFAudio.tone(40,.2); fb(false, i===0? "The root stays the same. Tap the 5th — the top note." : "The 3rd stays the same here — tap the 5th, the top note."); }
      } : undefined});
  }
  function ask(){
    const R=ROUNDS[r]; nxt.style.display="none";
    q.innerHTML=`${R.from}: ${R.dir==="raise"?"raise":"lower"} the 5th a half step — tap the note that changes.`;
    draw(R.base, R.from.split(" ")[0]+" "+R.from.split(" ")[1], true);
  }
  nxt.onclick=()=>ask();
  ask();
}

/* keyboard builder: all four qualities on one root */
function MF_L59_build(container,fb){
  const ROUNDS=[
    {name:"C major", sym:"C", pcs:[0,4,7], names:["C","E (M3)","G (P5)"]},
    {name:"C augmented", sym:"C+", pcs:[0,4,8], names:["C","E (M3)","G♯ (raised 5th!)"]},
    {name:"C minor", sym:"Cm", pcs:[0,3,7], names:["C","E♭ (m3)","G (P5)"]},
    {name:"C diminished", sym:"C°", pcs:[0,3,6], names:["C","E♭ (m3)","G♭ (lowered 5th!)"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l59b-q" style="text-align:center"></div>
    <div class="l59b-staff"></div><div class="l59b-kb"></div>`;
  const q=container.querySelector(".l59b-q"), sh=container.querySelector(".l59b-staff"), kh=container.querySelector(".l59b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",3:"Eb",4:"E",6:"Gb",7:"G",8:"G#"};
    const ps=got.map(m=>(NAMES[m%12]||"C")+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:190});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You built all four triad qualities."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`Build <b>${ROUNDS[r].name} (${ROUNDS[r].sym})</b>. Press <b>${ROUNDS[r].names[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=3){ got.forEach(x=>MFAudio.tone(x,1.2,.1,.32));
          fb(true,`✓ ${R.name} (${R.sym}).`);
          r++; setTimeout(ask,1500); }
        else q.innerHTML=`Now play <b>${R.names[k]}</b> above the note you just played.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right key — build UPWARD."); }
      else { MFAudio.tone(40,.2); fb(false,k===2? (R.pcs[2]===8?"Raise the 5th: one key ABOVE G.":R.pcs[2]===6?"Lower the 5th: one key BELOW G.":"The perfect 5th is 7 half steps up.") : "Check the 3rd: major uses E, minor uses E♭."); }
    }});
  ask();
}

/* ear lab: all four qualities */
function MF_L59_ear(container,fb){
  const QUALS=[
    {name:"Major", midis:[60,64,67]},
    {name:"Minor", midis:[60,63,67]},
    {name:"Augmented", midis:[60,64,68]},
    {name:"Diminished", midis:[60,63,66]}];
  let order=[0,2,1,3].sort(()=>Math.random()-.5), r=0, played=false;
  container.innerHTML=`<div class="big-q l59e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l59e-play">▶ Play the mystery chord</button></div>
    <div class="choices chips l59e-ch" style="display:none"><button>Major</button><button>Minor</button><button>Augmented</button><button>Diminished</button></div>`;
  const q=container.querySelector(".l59e-q"), pl=container.querySelector(".l59e-play"), ch=container.querySelector(".l59e-ch");
  function ask(){
    if(r>=order.length){ q.textContent="Excellent! You identified every triad."; pl.style.display="none"; ch.style.display="none"; return; }
    played=false; ch.style.display="none";
    q.innerHTML=`Round ${r+1} of ${order.length}: which triad do you hear?`;
  }
  pl.onclick=()=>{ const F=QUALS[order[r]]; if(!F) return;
    F.midis.forEach(m=>MFAudio.tone(m,1.3,0,.32)); played=true;
    setTimeout(()=>ch.style.display="",1000); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const want=order[r];
    if(i===want){ MFAudio.yay();
      fb(true,`✓ ${QUALS[want].name}! ${["A major triad.","A minor triad.","Augmented — open and unstable.","Diminished — tense and unstable."][want]}`);
      r++; setTimeout(ask,1300); }
    else { MFAudio.tone(40,.2); fb(false,"Listen again. Is the 5th perfect, raised, or lowered?"); }
  });
  ask();
}

LESSON_CONTENT[59]={
  welcome:"Two new chord qualities today: augmented and diminished. \u{26A1}",
  hook:{
    say:"<b>Major and minor are not the only triads.</b> Today you'll learn two new chord qualities: <b>augmented</b> and <b>diminished</b>. <b>Can you hear the difference?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chord A</button>
          <button class="play hk-b">▶ Chord B</button></div>
          <div class="choices hk-ch" style="display:none"><button>A is augmented · B is diminished</button><button>A is diminished · B is augmented</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,64,68].forEach(m=>MFAudio.tone(m,1.4,0,.32)); hA=true; if(hB) setTimeout(()=>ch.style.display="",1600); };
        container.querySelector(".hk-b").onclick=()=>{ [60,63,66].forEach(m=>MFAudio.tone(m,1.4,0,.32)); hB=true; if(hA) setTimeout(()=>ch.style.display="",1600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Chord A was C-E-G♯ — an AUGMENTED triad (a major triad with a raised 5th). Chord B was C-E♭-G♭ — a DIMINISHED triad (a minor triad with a lowered 5th). Today's lesson!");
          else fb(false,"Listen again — the augmented triad is wider than major; the diminished triad is narrower than minor.");
        });
      } }
  },
  objectives:[
    "Build an augmented triad: a major triad with its 5th RAISED a half step",
    "Build a diminished triad: a minor triad with its 5th LOWERED a half step",
    "Stack them: augmented = M3+M3, diminished = m3+m3",
    "Read the symbols: C, Cm, C+, C°",
    "Complete the major-triad scale: 1-4-5 major, 2-3-6 minor, 7 diminished",
    "Tell all four qualities apart by sight and ear"
  ],
  steps:[
    { say:"<b>Two New Triad Qualities:</b> An <b>augmented triad</b> is a major triad with a <b>raised 5th</b>. A <b>diminished triad</b> is a minor triad with a <b>lowered 5th</b>. <b>Remember: major and minor triads differ by the 3rd; augmented and diminished triads differ by the 5th.</b> \u{1F447} <b>What does the word augmented mean?</b>",
      try:{ type:"mc", choices:["Made larger","Made smaller","Made louder"], answer:0,
        success:"✓ Augment = enlarge. And diminish = shrink. The names ARE the recipes.",
        fail:"Think of 'augmented reality' — ADDED, expanded…",
        hint:"aug+ = bigger; dim− = smaller." } },
    { say:"<b>Build the Chords:</b> Change a major triad into an augmented triad. Then change a minor triad into a diminished triad. \u{1F447} <b>Which note changes?</b>",
      try:{ type:"custom",
        hint:"The 5th — the top note — moves a half step.",
        mount:(container,fb)=>MF_L59_lab(container,fb) } },
    { say:"<b>Comparing Triads:</b> Major = <b>M3 + m3</b> · Minor = <b>m3 + M3</b> · Augmented = <b>M3 + M3</b> · Diminished = <b>m3 + m3</b>. \u{1F447} <b>How is an augmented triad built?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:280px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Triad</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Formula</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Major</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">M3 + m3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Minor</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">m3 + M3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Augmented</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">M3 + M3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Diminished</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">m3 + m3</td></tr></table>` },
      try:{ type:"mc", choices:["Two Major 3rds","Two minor 3rds","A m3 on top of a M3"], answer:0,
        success:"✓ M3 (C→E) + M3 (E→G♯) — two Major 3rds make an augmented triad.",
        fail:"Augmented uses two of the LARGER 3rd…",
        hint:"Aug = M3 + M3; dim = m3 + m3." } },
    { say:"<b>Chord Symbols:</b> Major → <b>C</b> · Minor → <b>Cm</b> · Augmented → <b>C+</b> · Diminished → <b>C°</b>. \u{1F447} <b>How is E♭ diminished written?</b>",
      try:{ type:"mc", choices:["E♭°","E♭+","e♭m−"], answer:0,
        success:"✓ The small circle (°) marks the diminished triad. Four symbols cover all four qualities.",
        fail:"Diminished wears the degree-circle…",
        hint:"+ = raised 5th, ° = lowered 5th." } },
    { say:"<b>The vii° Chord:</b> In a major key, <b>I, IV, V are major</b>; <b>ii, iii, vi are minor</b>; <b>vii° is diminished</b>. \u{1F447} <b>Why is the triad on degree 7 diminished?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"iii"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"B4",d:"w",label:"vii°"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C5",d:"w",label:"I"},{p:"E5",d:"w",chord:true},{p:"G5",d:"w",chord:true},{bar:"final"}],width:680} },
      try:{ type:"mc", choices:["B-D-F stacks two minor 3rds — no accidentals needed","Someone added a flat","It has four notes"], answer:0,
        success:"✓ B→D = m3, D→F = m3: the white keys ALONE produce a diminished triad on degree 7. That B-F frame is the tritone that powers V7!",
        fail:"Spell it: B-D-F. Measure each 3rd…",
        hint:"Count half steps: B→D and D→F." } },
    { say:"<b>Build all four triad qualities on the same root.</b> \u{1F447}",
      try:{ type:"custom",
        hint:"C: E vs E♭ for the 3rd; G, G♯ or G♭ for the 5th.",
        mount:(container,fb)=>MF_L59_build(container,fb) } },
    { say:"<b>Listen Carefully:</b> Identify each triad by ear. \u{1F447}",
      try:{ type:"custom",
        hint:"Stable? major/minor. Unstable? wide = aug, narrow = dim.",
        mount:(container,fb)=>MF_L59_ear(container,fb) } }
  ],
  examples:[
    { caption:"The four faces of C: major, minor, augmented, diminished — the 3rd shades it, then the 5th destabilizes it. Four chords, one root, four completely different futures.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"Cm"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C+"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C°"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true}],width:560},
      kb:{start:60,octaves:0.9167,labels:true} },
    { caption:"The complete major-triad scale of C: I ii iii IV V vi vii° I. Listen for the vii° — the built-in troublemaker that makes the final I feel so earned.",
      staff:{clef:"treble",tempo:90,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"iii"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A4",d:"w",label:"vi"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"B4",d:"w",label:"vii°"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C5",d:"w",label:"I"},{p:"E5",d:"w",chord:true},{p:"G5",d:"w",chord:true},{bar:"final"}],width:680},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Four-Quality Sprint (45s)",
      intro:"Major, minor, augmented, diminished — judge every chord that flashes by!",
      miaIntro:"3rd first, then the 5th! \u{26A1}",
      spec:{gen:"triad-quality", params:{}, seconds:45},
      result:(score)=>score>=8?score+" chords sorted — quality-control master!":null },
    { type:"key-climb", title:"Game 2 · Quality Morph Tour",
      intro:"Play C major, C augmented, C minor, C diminished — feel each half-step shift!",
      miaIntro:"One root, four moods! \u{1FA9C}",
      spec:{seq:[60,64,67, 60,64,68, 60,63,67, 60,63,66],
        names:["C","E","G — major \u{2600}\u{FE0F}","C","E","G♯ — augmented \u{1F388}","C","E♭","G — minor \u{1F311}","C","E♭","G♭ — diminished \u{1F32A}\u{FE0F}"],
        start:60, octaves:0.9167, title:"C → C+ → Cm → C°, chord by chord"},
      result:(score)=>score!==null?"All four qualities under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · Symbol Match",
      intro:"C, Cm, C+ and C° on cards — click what each round calls!",
      miaIntro:"Letter, m, plus, circle! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"C (major)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Cm (minor)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"C+ (augmented)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true}],width:150}},
        {label:"C° (diminished)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Symbols locked in!":null },
    { type:"term-race", title:"Game 4 · UNIT 14 GRAND FINALE Race",
      intro:"The victory lap — relatives, three minors, four qualities!",
      miaIntro:"Everything from Unit 14 — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["Augmented triad","a major triad with a raised 5th"],
        ["Diminished triad","a minor triad with a lowered 5th"],
        ["C+","C-E-G♯"],
        ["C°","C-E♭-G♭"],
        ["vii° in a major key","the diminished triad on degree 7"],
        ["Relative minor","the major scale's 6th degree"],
        ["Harmonic minor","raised 7th, both directions"],
        ["Melodic minor","♯6 ♯7 up, natural down"],
        ["Minor triad","root + m3 + P5"],
        ["Aug stacking","M3 + M3"]]},
      result:(score)=>score>=8?"UNIT 14 CHAMPION — the minor world is yours!":null }
  ],
  practiceIntro:"20 practice questions — building, changing and naming all four triad qualities. Answer right and the next appears automatically!",
  practice:[
    { gen:"triad-quality", params:{}, count:6 },
    { gen:"triad-quality", params:{ask:"symbol"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Augmented","major + raised 5th"],["Diminished","minor + lowered 5th"],["+","the augmented symbol"],["°","the diminished symbol"],["vii°","degree 7's diminished triad"]], reverse:true}, count:3 },
    { type:"mc", q:"An augmented triad is a major triad with…", choices:["a raised 5th","a lowered 3rd","an added 7th"], answer:0,
      explain:"Raise the 5th a half step." },
    { type:"mc", q:"A diminished triad is a minor triad with…", choices:["a lowered 5th","a raised root","a lowered root"], answer:0,
      explain:"Lower the 5th a half step." },
    { type:"mc", q:"C augmented is spelled…", choices:["C-E-G♯","C-E♭-G♯","C-E-G♭"], answer:0,
      explain:"Major 3rd kept, 5th raised." },
    { type:"mc", q:"C diminished is spelled…", choices:["C-E♭-G♭","C-E-G♭","C-E♭-G♯"], answer:0,
      explain:"Minor 3rd kept, 5th lowered." },
    { type:"mc", q:"Which triad quality is built on scale degree 7 in a major key?", choices:["diminished triad","major triad","augmented triad"], answer:0,
      explain:"B-D-F in C major: two minor 3rds, no accidentals." },
    { type:"truefalse", q:"An augmented triad stacks two Major 3rds.", answer:true,
      explain:"M3+M3 — the all-big stack." },
    { type:"truefalse", q:"A diminished triad stacks two minor 3rds.", answer:true,
      explain:"m3+m3 — the all-small stack." },
    { type:"truefalse", q:"The symbol for augmented is °.", answer:false,
      explain:"° is diminished; + is augmented." },
    { type:"truefalse", q:"Augmented and diminished triads sound stable.", answer:false,
      explain:"Both are tense — that's their job." }
  ],
  miaQuizIntro:"The Unit 14 finale quiz! The 3rd sets major/minor; the 5th sets augmented/diminished.",
  quiz:[
    { type:"mc", q:"An AUGMENTED triad is made by…", choices:["raising the 5th of a major triad a half step","lowering the 5th of a minor triad","lowering the 3rd of a major triad","adding a 7th"], answer:0,
      explain:"Major, made LARGER.", hint:"The name means 'enlarged'." },
    { type:"mc", q:"A DIMINISHED triad is made by…", choices:["lowering the 5th of a minor triad a half step","raising the 5th of a major triad","raising the 3rd of a minor triad"], answer:0,
      explain:"Minor, made SMALLER.", hint:"The name means 'shrunk'." },
    { type:"mc", q:"How is an augmented triad built?", choices:["M3 + M3","m3 + m3","M3 + m3","m3 + M3"], answer:0,
      explain:"Both thirds major → widest triad.", hint:"All-big." },
    { type:"mc", q:"How is a diminished triad built?", choices:["m3 + m3","M3 + M3","M3 + m3","m3 + M3"], answer:0,
      explain:"Both thirds minor → narrowest triad.", hint:"All-small." },
    { type:"truefalse", q:"Chord letter alone (like C) means a major triad.", answer:true,
      explain:"C=major, Cm=minor, C+=aug, C°=dim.", hint:"The standard chord-quality symbols." },
    { type:"truefalse", q:"In a major key, the triad on the 7th scale degree is minor.", answer:false,
      explain:"It's DIMINISHED — vii° (B-D-F in C).", hint:"vii° — two minor 3rds." },
    { type:"mc", q:"Identify this triad.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true}],width:200},
      choices:["C+ (augmented)","C major","C° (diminished)"], answer:0,
      explain:"Major 3rd + raised 5th = augmented.", hint:"The ♯ stretched the top." },
    { type:"mc", q:"Identify this triad.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true}],width:200},
      choices:["C° (diminished)","C minor","C+ (augmented)"], answer:0,
      explain:"m3 + lowered 5th = diminished.", hint:"TWO flats squeeze it." },
    { type:"mc", q:"Identify this triad — careful, no accidentals!",
      staff:{clef:"treble",notes:[{p:"B4",d:"w"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:200},
      choices:["B diminished (vii° of C major)","B minor","B major"], answer:0,
      explain:"B→D and D→F are BOTH minor 3rds — diminished on white keys alone.", hint:"Count each 3rd's half steps." },
    { type:"mc", q:"What are the triad qualities in a major scale?", choices:["M m m M M m dim","M M m m M m M","m M m M m M dim"], answer:0,
      explain:"1-4-5 major, 2-3-6 minor, 7 diminished.", hint:"The diatonic quality pattern." },
    { type:"mc", q:"Which triad is built with two minor 3rds?", choices:["Diminished","Major","Augmented"], answer:0,
      explain:"m3 + m3 — the diminished triad.", hint:"The narrowest stack." },
    { type:"mc", q:"Which statement correctly describes these two chord qualities?", choices:["Augmented sounds open and unstable; diminished sounds tense and unstable","Both sound calm and final","Augmented is dark; diminished is bright"], answer:0,
      explain:"Both are unstable — that is their musical job.", hint:"Neither one sounds finished." },
    /* generated */
    { gen:"triad-quality", params:{}, count:4 },
    { gen:"triad-quality", params:{ask:"symbol"}, count:2 },
    { gen:"rel-key", params:{ask:"both"}, count:2 }
  ],
  vocabulary:[
    {term:"Augmented Triad (+)", def:"A major triad with its 5th raised a half step — M3+M3. Open and unstable.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true}],width:130}},
    {term:"Diminished Triad (°)", def:"A minor triad with its 5th lowered a half step — m3+m3. Tense and unstable.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"Gb4",d:"w",chord:true}],width:130}},
    {term:"Chord Symbols", def:"Letter only = major · m = minor · + = augmented · ° = diminished."},
    {term:"vii°", def:"The diminished triad living on degree 7 of every major scale (B-D-F in C major).",
      staff:{clef:"treble",notes:[{p:"B4",d:"w"},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:130}}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Augmented (+)</b> = major triad, 5th RAISED a half step: <b>M3+M3</b> (C-E-G♯).",
    "✔ <b>Diminished (°)</b> = minor triad, 5th LOWERED a half step: <b>m3+m3</b> (C-E♭-G♭).",
    "✔ Symbols: <b>C · Cm · C+ · C°</b> — four marks, four qualities.",
    "✔ Major-triad scale: <b>1-4-5 major, 2-3-6 minor, 7 diminished (vii°)</b>.",
    "✔ The 3rd sets major/minor; the <b>5th</b> sets stable/unstable. <b>UNIT 14 COMPLETE!</b> \u{1F389}"
  ],
  tips:[
    "Two-question quality test: (1) Is the 3rd major or minor? (2) Is the 5th perfect, raised, or lowered? Two answers = one quality.",
    "The augmented chord is film music's favorite 'dream sequence' sound; the diminished chord is its favorite 'danger!' sound. Listen for them tonight.",
    "vii° is secretly V7's upper three notes (B-D-F ⊂ G-B-D-F) — that's why both chords crave I.",
    "Unit 15 next: the primary chords move INTO minor keys — i, iv, V… and why that V stays major."
  ],
  rewards:{ badge:"Quality Alchemist — Unit 14 Champion", icon:"\u{26A1}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! All four qualities, sight AND sound — Unit 14 conquered in style! \u{26A1}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — and Unit 14 is COMPLETE! Major, minor, augmented, diminished: the full palette. \u{1F389}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Chord A was C-E-G♯ (augmented — raised 5th); chord B was C-E♭-G♭ (diminished — lowered 5th).",
      play:()=>{[60,64,68].forEach(m=>MFAudio.tone(m,1.2,0,.32));[60,63,66].forEach(m=>MFAudio.tone(m,1.4,1.5,.32));} },
    learn:{ label:"aug & dim triads",
      explain:"Aug = major + raised 5th (M3+M3, symbol +). Dim = minor + lowered 5th (m3+m3, symbol °). Major scale: 1-4-5 M, 2-3-6 m, 7 dim.",
      hint:"The 3rd sets major/minor; the 5th sets augmented/diminished.",
      play:()=>{[60,64,68].forEach(m=>MFAudio.tone(m,1.2,.1,.32));} },
    example:{ label:"the examples",
      explain:"Example 1 plays the four faces of C; example 2 walks the entire triad scale I→vii°→I — listen for the wobble on degree 7." },
    game:{ label:"the games",
      explain:"Sprint all four qualities, build C in all four qualities, match the symbols, then run the Unit 14 victory lap.",
      hint:"+ = raised 5th, ° = lowered 5th." },
    quiz:{ label:"this question",
      explain:"Two dials answer everything: the 3rd (major/minor) and the 5th (perfect/raised/lowered). Spell, measure, name.",
      play:()=>{[60,63,66].forEach(m=>MFAudio.tone(m,1.3,0,.32));[60,64,67].forEach(m=>MFAudio.tone(m,1.2,1.5,.33));} }
  }
};
