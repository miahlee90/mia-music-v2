/* Lesson 66 — Passing and Neighboring Tones (AEMT Book 3, Unit 16)
   Built from drafts/UNIT 16 – Lesson 66.md; AEMT3 p.104 verified by render.
   Core: NON-HARMONIC TONES = melody notes not in the harmony chord.
   PASSING TONE: steps between two DIFFERENT chord tones. NEIGHBORING TONE:
   leaves and returns to the SAME chord tone — UPPER (above) or LOWER (below).
   Both usually fall on WEAK beats, and should NOT influence chord choice.
   NOTE: edit by FULL-FILE REWRITE only. */

/* tone detective: tap the non-harmonic tone, then classify it */
function MF_L66_detect(container,fb){
  const ROUNDS=[
    {chord:"C (C-E-G)", ps:["C4","D4","E4"], nh:1, kind:0,
      expl:"C and E are chord tones; D bridges two DIFFERENT ones — a PASSING tone."},
    {chord:"C (C-E-G)", ps:["E4","F4","E4"], nh:1, kind:1,
      expl:"The melody leaves E and returns to the SAME E from above — an UPPER NEIGHBORING tone."},
    {chord:"C (C-E-G)", ps:["G4","F#4","G4"], nh:1, kind:2,
      expl:"Leaves G, dips below, returns to the same G — a LOWER NEIGHBORING tone."},
    {chord:"F (F-A-C)", ps:["F4","G4","A4"], nh:1, kind:0,
      expl:"F up to A with G between: two different chord tones bridged — PASSING."}];
  const KINDS=["Passing tone","Upper neighbor","Lower neighbor"];
  let r=0, found=false;
  container.innerHTML=`<div class="big-q l66d-q" style="text-align:center"></div>
    <div class="l66d-staff"></div>
    <div class="choices chips l66d-ch" style="display:none"><button>Passing tone</button><button>Upper neighbor</button><button>Lower neighbor</button></div>`;
  const q=container.querySelector(".l66d-q"), holder=container.querySelector(".l66d-staff"), ch=container.querySelector(".l66d-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent=`Excellent! You identified them all.`; holder.innerHTML=""; ch.style.display="none"; return; }
    const R=ROUNDS[r]; found=false; ch.style.display="none";
    q.innerHTML=`The harmony is <b>${R.chord}</b>. Tap the melody note that does <b>NOT</b> belong to that chord.`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,i)=>({p,d:"q"})),width:300,clickNotes:true,
      onNote:(i,p)=>{
        MFAudio.tone(MFAudio.midi(p),.5,0,.4);
        if(found) return;
        const R2=ROUNDS[r];
        if(i===R2.nh){ found=true;
          q.innerHTML=`Great! You found the non-harmonic tone: ${p.replace(/\d/,"").replace("#","♯")}. Is it a passing tone or a neighboring tone?`;
          ch.style.display=""; }
        else fb(false,`${p[0]} belongs to ${R2.chord} — it is a chord tone. Look for the note outside the chord.`);
      }});
  }
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    const R=ROUNDS[r]; if(!R||!found) return;
    if(i===R.kind){
      R.ps.forEach((p,ix)=>MFAudio.tone(MFAudio.midi(p),.45,.05+ix*.4,.4));
      fb(true,`✓ ${R.expl}`);
      r++; setTimeout(ask,1500); }
    else { MFAudio.tone(40,.2); fb(false,"Does the melody land on a DIFFERENT chord tone (passing) or the SAME one (neighbor)? Above or below?"); }
  });
  ask();
}

LESSON_CONTENT[66]={
  welcome:"Non-harmonic tones: melody notes outside the chord. \u{1F98B}",
  hook:{
    say:"<b>Two melodies use the same C major chord.</b> One melody adds an extra note between the chord tones. Listen to both. <b>Are those extra notes wrong?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Melody A: C … E … G</button>
          <button class="play hk-b">▶ Melody B: C-D-E … G</button></div>
          <div class="choices hk-ch" style="display:none"><button>No — the extra note connects two chord tones smoothly</button><button>Yes — D is not in the C chord</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [60,64,67].forEach((m,i)=>MFAudio.tone(m,.55,i*.55,.42)); [48,52,55].forEach(m=>MFAudio.tone(m,1.8,0,.18)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2200); };
        container.querySelector(".hk-b").onclick=()=>{ [60,62,64,67].forEach((m,i)=>MFAudio.tone(m,.5,i*.45,.42)); [48,52,55].forEach(m=>MFAudio.tone(m,2.0,0,.18)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2200); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ The D is a NON-HARMONIC TONE — a PASSING tone, stepping between two chord tones. Not wrong: most melodies include them. Today: passing and neighboring tones!");
          else fb(false,"It is outside the chord — but did it SOUND wrong? Composers use these notes on purpose…");
        });
      } }
  },
  objectives:[
    "Define non-harmonic tones: melody notes outside the harmony chord",
    "Passing tone: steps between two DIFFERENT chord tones",
    "Neighboring tone: leaves and returns to the SAME chord tone",
    "Tell upper neighbors (above) from lower neighbors (below)",
    "Know they usually land on WEAK beats",
    "Choose chords from the chord tones, not the non-harmonic tones"
  ],
  steps:[
    { say:"<b>Non-Harmonic Tones:</b> A <b>non-harmonic tone</b> is a melody note that does <b>not</b> belong to the current chord. Non-harmonic tones add variety and smooth melodic movement. \u{1F447} <b>What is a non-harmonic tone?</b>",
      try:{ type:"mc", choices:["A melody note outside the current chord","A wrong note","A note played too softly"], answer:0,
        success:"✓ A melody note outside the current chord. Today: passing and neighboring tones.",
        fail:"The D over a C chord in the hook was one…",
        hint:"Non-harmonic = not in the harmony." } },
    { say:"<b>Passing Tone:</b> A <b>passing tone</b> connects <b>two different chord tones</b> by step. C→D→E over a C chord: D is the passing tone. \u{1F447} <b>What surrounds a passing tone?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",tempo:90,notes:[
        {p:"C4",d:"q",label:"chord tone"},{p:"D4",d:"q",label:"P"},{p:"E4",d:"q",label:"chord tone"},{p:"G4",d:"q"},{bar:"final"}],width:400} },
      try:{ type:"mc", choices:["Two DIFFERENT chord tones","The same chord tone twice","Two rests"], answer:0,
        success:"✓ Two DIFFERENT chord tones — the passing tone steps between them.",
        fail:"Where did the melody start and land — same place or new place?",
        hint:"PASSING = moving through to a new chord tone." } },
    { say:"<b>Neighboring Tone:</b> A neighboring tone leaves a chord tone and returns to the <b>same chord tone</b>. Upper neighbor = above · lower neighbor = below. <b>Remember: passing tone = different → different · neighboring tone = same → different → same.</b> \u{1F447} <b>E→F→E over a C chord: what is the F?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"6/4",tempo:90,notes:[
        {p:"E4",d:"q",label:"chord tone"},{p:"F4",d:"q",label:"U"},{p:"E4",d:"q",label:"same"},
        {p:"G4",d:"q",label:"chord tone"},{p:"F#4",d:"q",label:"L"},{p:"G4",d:"q",label:"same"},{bar:"final"}],width:720} },
      try:{ type:"mc", choices:["An upper neighboring tone","A passing tone","A chord tone"], answer:0,
        success:"✓ An UPPER neighboring tone — it leaves E and returns to the same E from above. (G→F♯→G shows the LOWER neighbor.)",
        fail:"Did the melody land on a NEW chord tone, or the SAME one?",
        hint:"A neighboring tone RETURNS to the same chord tone." } },
    { say:"<b>Where Do They Usually Appear?</b> Passing and neighboring tones usually occur on <b>weak beats</b>. Chord tones usually appear on <b>strong beats</b>. \u{1F447} <b>Why are passing and neighboring tones usually placed on weak beats?</b>",
      try:{ type:"mc", choices:["Strong beats belong to chord tones; the decorations fit between them","Weak beats are quieter","It's a printing convention"], answer:0,
        success:"✓ Chord tones hold the strong beats; passing and neighboring tones decorate the weak beats.",
        fail:"Where does the ear check the harmony most — strong or weak beats?",
        hint:"Chord tones on strong beats; decorations on weak beats." } },
    { say:"<b>Choosing Chords:</b> When harmonizing a melody, choose chords based on the <b>chord tones</b>, not the non-harmonic tones. \u{1F447} <b>Melody C-D-E-F-G over one measure, harmony = C chord. Which notes should you use to choose the chord?</b>",
      try:{ type:"mc", choices:["C, E, G — the chord tones; D and F are passing tones","All five notes equally","Only D and F"], answer:0,
        success:"✓ C, E, G spell the C chord; D and F are passing tones and do not affect the chord choice.",
        fail:"Which of the five notes are IN C-E-G?",
        hint:"Choose the chord from the chord tones." } },
    { say:"Identify each non-harmonic tone. \u{1F447}",
      try:{ type:"custom",
        hint:"Different frame = passing; same frame = neighbor (upper/lower by direction).",
        mount:(container,fb)=>MF_L66_detect(container,fb) } },
    { say:"<b>Review:</b> Classify each non-harmonic tone. The harmony is C throughout. \u{1F447} <b>In C-B-C-D-E, what is the B?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"4/4",tempo:90,notes:[
        {p:"C4",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"q"},{p:"D4",d:"q"},{bar:"single"},{p:"E4",d:"w"},{bar:"final"}],width:420} },
      try:{ type:"mc", choices:["A lower neighboring tone (and the D is a passing tone)","A passing tone (and the D is a neighbor)","Both are chord tones"], answer:0,
        success:"✓ C→B→C = same tone, from below → LOWER neighbor. Then C→D→E = different tones → PASSING. One phrase, both types!",
        fail:"Frame check: C…C (same) then C…E (different).",
        hint:"Watch where each three-note group starts and lands." } }
  ],
  examples:[
    { caption:"A melody over I-IV-V7-I where every arrow-note is a passing tone, connecting chord tones on weak beats.",
      staff:{clef:"treble",time:"4/4",tempo:100,notes:[
        {p:"C4",d:"q",label:"I"},{p:"D4",d:"q",label:"P"},{p:"E4",d:"q"},{p:"G4",d:"q"},{bar:"single"},
        {p:"F4",d:"q",label:"IV"},{p:"G4",d:"q",label:"P"},{p:"A4",d:"q"},{p:"C5",d:"q"},{bar:"single"},
        {p:"B4",d:"q",label:"V7"},{p:"A4",d:"q",label:"P"},{p:"G4",d:"q"},{p:"B4",d:"q"},{bar:"single"},
        {p:"C5",d:"w",label:"I"},{bar:"final"}],width:680},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"Neighbors at work: the melody keeps returning home — E-F-E (upper), G-F♯-G (lower) — while the C harmony holds still underneath.",
      staff:{clef:"treble",time:"3/4",tempo:100,notes:[
        {p:"E4",d:"q",label:"C chord"},{p:"F4",d:"q",label:"U"},{p:"E4",d:"q"},{bar:"single"},
        {p:"G4",d:"q"},{p:"F#4",d:"q",label:"L"},{p:"G4",d:"q"},{bar:"single"},
        {p:"C5",d:"h."},{bar:"final"}],width:560},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Term Sprint (45s)",
      intro:"Passing, upper neighbor, lower neighbor — race the definitions!",
      miaIntro:"Passing or neighboring? \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Non-harmonic tone","a melody note outside the harmony chord"],
        ["Passing tone","steps between two DIFFERENT chord tones"],
        ["Neighboring tone","leaves and returns to the SAME chord tone"],
        ["Upper neighbor","the visit from above"],
        ["Lower neighbor","the visit from below"],
        ["Their usual beat","weak"],
        ["Their role in chord choice","none — ignore them"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — terms mastered!":null },
    { type:"key-climb", title:"Game 2 · Decorated Melody Climb",
      intro:"Play a melody with its non-harmonic tones: C-D-E (passing), E-F-E (neighbor)!",
      miaIntro:"Chord tones and decorations! \u{1FA9C}",
      spec:{seq:[60,62,64, 64,65,64, 62,60],
        names:["C (chord tone)","D (passing!)","E (chord tone)","E again","F (upper neighbor!)","E (home)","D (passing down)","C (home)"],
        start:60, octaves:0.4167, title:"A melody with passing and neighboring tones"},
      result:(score)=>score!==null?"Non-harmonic tones under your fingers!":null },
    { type:"symbol-hunt", title:"Game 3 · P, U or L?",
      intro:"Three-note figures on cards — click the one each round names! (Harmony: C chord.)",
      miaIntro:"Check the frame first! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Passing tone (C-D-E)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"}],width:170}},
        {label:"Upper neighbor (E-F-E)", spec:{clef:"treble",notes:[{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"E4",d:"q"}],width:170}},
        {label:"Lower neighbor (G-F♯-G)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"}],width:170}},
        {label:"All chord tones (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"}],width:170}}]},
      result:(score)=>score>=5?"Frames read at a glance!":null },
    { type:"term-race", title:"Game 4 · Non-Harmonic Fact Race",
      intro:"Everything about non-harmonic tones!",
      miaIntro:"Facts, fast! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["C-D-E over a C chord","D is a passing tone"],
        ["E-F-E over a C chord","F is an upper neighbor"],
        ["G-F♯-G over a C chord","F♯ is a lower neighbor"],
        ["Passing tone's journey","one chord tone THROUGH to another"],
        ["Neighbor's journey","out and back to the same tone"],
        ["Weak beats","where non-harmonic tones usually live"],
        ["Chord choice","ignores non-harmonic tones"],
        ["Non-harmonic tones","decorations, not mistakes"]]},
      result:(score)=>score>=6?"Non-harmonic facts mastered!":null }
  ],
  practiceIntro:"20 practice questions — passing tones, neighboring tones, and the weak-beat rule. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Non-harmonic tone","outside the chord"],["Passing tone","bridges two different chord tones"],["Upper neighbor","above, then back"],["Lower neighbor","below, then back"],["Weak beat","where non-harmonic tones usually occur"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{}, count:2 },
    { type:"mc", q:"Tones not part of the harmony chord are called…", choices:["non-harmonic tones","rest tones","grace notes"], answer:0,
      explain:"The umbrella term." },
    { type:"mc", q:"A passing tone connects…", choices:["two DIFFERENT chord tones","the same chord tone twice","two rests"], answer:0,
      explain:"It travels through to a new destination." },
    { type:"mc", q:"A neighboring tone…", choices:["leaves and returns to the SAME chord tone","connects two different chord tones","is always the tonic"], answer:0,
      explain:"Same → different → same." },
    { type:"mc", q:"An upper neighboring tone sits ____ the chord tone.", choices:["above","below","exactly on"], answer:0,
      explain:"Upper = above; lower = below." },
    { type:"mc", q:"In C-D-E over a C chord, the D is a…", choices:["passing tone","upper neighbor","chord tone"], answer:0,
      explain:"C and E differ → passing." },
    { type:"mc", q:"In G-A-G over a C chord, the A is a…", choices:["upper neighboring tone","passing tone","lower neighbor"], answer:0,
      explain:"Same G frame, visitor from above." },
    { type:"truefalse", q:"Passing and neighboring tones usually occur on a strong beat.", answer:false,
      explain:"WEAK beats — chord tones take the strong beats." },
    { type:"truefalse", q:"Non-harmonic tones should not influence which chord you choose.", answer:true,
      explain:"Harmonize the chord tones only." },
    { type:"truefalse", q:"A non-harmonic tone is a half or whole step from its chord tones.", answer:true,
      explain:"Steps, not leaps — that's what keeps them smooth." },
    { type:"truefalse", q:"Most melodies include non-harmonic tones.", answer:true,
      explain:"Most melodies use them for variety and smooth movement." }
  ],
  miaQuizIntro:"Quiz! Frame first: different tones = passing, same tone = neighbor.",
  quiz:[
    { type:"mc", q:"Non-harmonic tones are…", choices:["melody tones not part of the harmony chord","chord tones played loudly","notes in the bass clef"], answer:0,
      explain:"Melody notes outside the chord.", hint:"NON-harmonic." },
    { type:"mc", q:"A passing tone…", choices:["connects two different chord tones by step","returns to the same chord tone","is always the tonic"], answer:0,
      explain:"Different → different, by step.", hint:"It passes THROUGH." },
    { type:"mc", q:"A neighboring tone…", choices:["leaves and returns to the same chord tone","connects two different chord tones","only occurs in minor keys"], answer:0,
      explain:"Same → different → same.", hint:"It returns to the same tone." },
    { type:"mc", q:"An UPPER neighboring tone is ____ the chord tone; a LOWER one is ____.", choices:["above; below","below; above","before; after"], answer:0,
      explain:"Named by direction of the visit.", hint:"The names say it." },
    { type:"truefalse", q:"Passing and neighboring tones usually occur on a weak beat.", answer:true,
      explain:"Chord tones take the strong beats.", hint:"Where do the chord tones sit?" },
    { type:"mc", q:"Should non-harmonic tones determine your chord choice?", choices:["No — choose chords from the chord tones","Yes — every note matters equally","Only on strong beats"], answer:0,
      explain:"Choose the chord from the chord tones.", hint:"Which notes spell the chord?" },
    { type:"mc", q:"The harmony is C (C-E-G). Identify the middle note.",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"}],width:260},
      choices:["Passing tone","Upper neighbor","Chord tone"], answer:0,
      explain:"C→E via D: different frame → passing.", hint:"Start and landing differ?" },
    { type:"mc", q:"The harmony is C (C-E-G). Identify the middle note.",
      staff:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"F#4",d:"q"},{p:"G4",d:"q"}],width:260},
      choices:["Lower neighboring tone","Passing tone","Upper neighboring tone"], answer:0,
      explain:"Same G frame, dip below → lower neighbor.", hint:"Same landing = neighbor; which side?" },
    { type:"mc", q:"The harmony is F (F-A-C). In F-G-A, the G is…", choices:["a passing tone","an upper neighbor","a chord tone of F"], answer:0,
      explain:"F and A are chord tones; G bridges them.", hint:"Spell F major first." },
    { type:"mc", q:"A melody over a C chord runs E-F-E-D-C. Classify F and D.", choices:["F = upper neighbor, D = passing tone","F = passing, D = neighbor","both are chord tones"], answer:0,
      explain:"E-F-E returns to the same tone; E-D-C steps to a new one.", hint:"Same landing = neighbor; new landing = passing." },
    { type:"mc", q:"Why do passing and neighboring tones usually sound smooth?", choices:["They move by step between chord tones and usually occur on weak beats","They're played silently","They're actually in the chord"], answer:0,
      explain:"Stepwise motion on weak beats.", hint:"The two rules combined." },
    { type:"mc", q:"Which melody notes should be used to choose the harmony? (Melody: C-D-E-F-G)", choices:["C, E, G — the chord tones","All five notes equally","Only D and F"], answer:0,
      explain:"D and F are non-harmonic; C, E, G spell C major.", hint:"Use the chord tones." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Passing","different frame"],["Neighbor","same frame"],["Upper","from above"],["Lower","from below"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{}, count:2 },
    { gen:"degree-name", params:{ask:"name"}, count:1 }
  ],
  vocabulary:[
    {term:"Non-Harmonic Tone", def:"A melody tone that is not part of the chord used for the harmony."},
    {term:"Passing Tone", def:"A non-harmonic tone stepping between two DIFFERENT chord tones.",
      staff:{clef:"treble",notes:[{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q"}],width:380}},
    {term:"Neighboring Tone", def:"A non-harmonic tone that leaves and returns to the SAME chord tone — upper (above) or lower (below).",
      staff:{clef:"treble",notes:[{p:"C5",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"}],width:380}},
    {term:"The Weak-Beat Rule", def:"Passing and neighboring tones usually occur on weak beats — and never influence chord choice."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Non-harmonic tones</b> = melody notes outside the harmony chord — decorations, not errors.",
    "✔ <b>Passing tone</b>: steps between two <b>DIFFERENT</b> chord tones (C-D-E).",
    "✔ <b>Neighboring tone</b>: out and back to the <b>SAME</b> chord tone — <b>upper</b> above, <b>lower</b> below.",
    "✔ Both usually live on <b>weak beats</b>.",
    "✔ They <b>never influence chord choice</b> — harmonize the chord tones only."
  ],
  tips:[
    "Analysis routine: bracket each 3-note group, compare first and last notes. Same = neighbor; different = passing.",
    "Sing 'London Bridge' — it is full of passing and neighboring tones.",
    "Turn a plain chord-tone melody into a real tune by adding passing tones on the weak beats.",
    "Next lesson you COMPOSE: your own melody over a progression, decorations included."
  ],
  rewards:{ badge:"Tone Gardener", icon:"\u{1F98B}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Passing, upper, lower — every non-harmonic tone named on sight. \u{1F98B}\u{1F389}",
  miaPass:"Passed! You know the non-harmonic tones. Time to compose your own melody…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Melody B added D between C and E — a PASSING tone: outside the C chord, but a smooth, legal bridge between two chord tones.",
      play:()=>{[60,62,64,67].forEach((m,i)=>MFAudio.tone(m,.5,i*.45,.42));[48,52,55].forEach(m=>MFAudio.tone(m,2.0,0,.18));} },
    learn:{ label:"passing & neighboring tones",
      explain:"Non-harmonic tones decorate: passing = between two different chord tones; neighbor = out-and-back to the same tone (upper/lower). Weak beats; never affect chord choice.",
      hint:"Frame check: same or different landing?",
      play:()=>{[64,65,64].forEach((m,i)=>MFAudio.tone(m,.45,i*.4,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 threads passing tones through I-IV-V7-I; example 2 shows both neighbors over a still C chord." },
    game:{ label:"the games",
      explain:"Sprint the terms, play a decorated melody, classify P/U/L cards, then race the facts.",
      hint:"Passing passes; neighbors come home." },
    quiz:{ label:"this question",
      explain:"One method: identify the chord, find the non-harmonic tone, check where it lands (same tone = neighbor, different = passing), then the direction.",
      play:()=>{[60,62,64].forEach((m,i)=>MFAudio.tone(m,.45,i*.4,.42));} }
  }
};
