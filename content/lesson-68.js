/* Lesson 68 — Harmonizing a Melody in a Minor Key (AEMT Book 3, Unit 17)
   Built from drafts/UNIT 17 – Lesson 68.md; AEMT3 p.108 verified by render.
   Core: same method as major — i, iv, V(7) hold every note of the HARMONIC
   minor scale. The minor chart: degrees 1,3,5 → i · 2,4,5,7 → V(7) ·
   1,4,6 → iv. Ear decides ties; begin/end with i; V(7) precedes the last
   chord. Model: A harmonic minor scale harmonized i-V-i-iv-i-iv-V-i.
   NOTE: edit by FULL-FILE REWRITE only. */

/* harmonize A harmonic minor, degree by degree */
function MF_L68_harm(container,fb){
  const STEPS=[
    {deg:1, note:"A4", ok:["i","iv"], why:"Degree 1 lives in i (root) and iv (5th) — most minor harmonizations BEGIN with i."},
    {deg:2, note:"B4", ok:["V7"], why:"Degree 2 (B) belongs only to V — its 5th."},
    {deg:3, note:"C5", ok:["i"], why:"Degree 3 (C) is the 3rd of i — the note that makes the key MINOR."},
    {deg:4, note:"D5", ok:["iv","V7"], why:"Degree 4 fits iv (root) or V7 (7th) — either works; the ear decides."},
    {deg:5, note:"E5", ok:["i","V7"], why:"Degree 5 fits i (5th) or V (root) — the flexible one, in minor too."},
    {deg:6, note:"F5", ok:["iv"], why:"Degree 6 (F) belongs only to iv — its 3rd."},
    {deg:7, note:"G#5", ok:["V7"], why:"The RAISED 7th (G♯) is V's major 3rd — the harmonic minor at work!"},
    {deg:8, note:"A5", ok:["i"], why:"End on i — home, with V(7) just before."}];
  const CH={i:[57,60,64], iv:[57,62,65], V7:[56,59,62,64]};
  let k=0; const picked=[];
  container.innerHTML=`<div class="big-q l68h-q" style="text-align:center"></div>
    <div class="l68h-staff"></div>
    <div class="choices chips l68h-ch"><button>i</button><button>iv</button><button>V7</button></div>
    <div style="text-align:center"><button class="play l68h-play" style="display:none">▶ Play your harmonized minor scale</button></div>`;
  const q=container.querySelector(".l68h-q"), holder=container.querySelector(".l68h-staff"), ch=container.querySelector(".l68h-ch"), pl=container.querySelector(".l68h-play");
  function draw(){
    Staff.render(holder,{clef:"treble",notes:STEPS.map((s,i)=>({p:s.note,d:"q",label:i<picked.length?picked[i]:String(s.deg)})),width:560});
  }
  function ask(){
    draw();
    if(k>=STEPS.length){ q.textContent="Excellent! The melody is fully harmonized. Press play!"; ch.style.display="none"; pl.style.display="inline-block"; return; }
    q.innerHTML=`Melody note ${k+1} of 8 — scale degree <b>${STEPS[k].deg}</b>${STEPS[k].deg===7?" (raised!)":""}. Which chord? <i>(Minor chart: 1,3,5→i · 2,4,5,7→V7 · 1,4,6→iv)</i>`;
  }
  [...ch.children].forEach(b=>b.onclick=()=>{
    const S=STEPS[k]; if(!S) return;
    if(S.ok.includes(b.textContent)){
      MFAudio.tone(MFAudio.midi(S.note),.8,.05,.42);
      CH[b.textContent].forEach(m=>MFAudio.tone(m,.9,.05,.25));
      picked.push(b.textContent); k++;
      fb(true,`✓ ${S.why}`);
      setTimeout(ask,1200);
    } else { MFAudio.tone(40,.2); fb(false,"Which chord contains this melody note? Spell i (A-C-E), iv (D-F-A) and V7 (E-G♯-B-D)."); }
  });
  pl.onclick=()=>{
    STEPS.forEach((s,i)=>{
      MFAudio.tone(MFAudio.midi(s.note),.55,i*.62,.42);
      CH[picked[i]].forEach(m=>MFAudio.tone(m,.58,i*.62,.2));
    });
    setTimeout(()=>fb(true,"✓ Your harmonization — listen to the V chords under degrees 2 and 7."),5300);
  };
  ask();
}

LESSON_CONTENT[68]={
  welcome:"Harmonizing in a minor key. \u{1F319}",
  hook:{
    say:"<b>The same minor melody can be harmonized in different ways.</b> Listen to both versions. <b>Which accompaniment fits the melody better?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A</button>
          <button class="play hk-b">▶ Version B</button></div>
          <div class="choices hk-ch" style="display:none"><button>A — i and V7 of A minor, raised 7th included</button><button>B — the C major chords fit better</button></div>`;
        const mel=[69,72,71,68,69];
        const goodCh=[[57,60,64],[57,60,64],[56,59,64],[56,59,64],[57,60,64]];
        const badCh=[[60,64,67],[60,65,69],[59,62,67],[60,64,67],[60,64,67]];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const play=(chs)=>mel.forEach((m,i)=>{ MFAudio.tone(m,.6,i*.68,.42); chs[i].forEach(c=>MFAudio.tone(c,.6,i*.68,.2)); });
        container.querySelector(".hk-a").onclick=()=>{ play(goodCh); hA=true; if(hB) setTimeout(()=>ch.style.display="",3800); };
        container.querySelector(".hk-b").onclick=()=>{ play(badCh); hB=true; if(hA) setTimeout(()=>ch.style.display="",3800); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Version A used the MINOR key's own primary chords — i and V7 with the raised G♯. Harmonizing in minor works like major, using the minor chart. Today's lesson!");
          else fb(false,"Version B's borrowed chords clashed with the melody's minor tones. Listen again…");
        });
      } }
  },
  objectives:[
    "Harmonize minor melodies the same way as major ones",
    "Use the minor chart: 1,3,5 → i · 2,4,5,7 → V(7) · 1,4,6 → iv",
    "Remember: the chart reads the HARMONIC minor scale (raised 7th)",
    "Let the ear break ties (degrees 1, 4, 5)",
    "Begin and end with i; V(7) precedes the last chord",
    "Harmonize the full A harmonic minor scale"
  ],
  steps:[
    { say:"<b>Harmonizing in a Minor Key:</b> Harmonizing a melody in a minor key is very similar to harmonizing in a major key. The <b>i, iv, and V (or V7)</b> chords contain all the notes of the <b>harmonic minor scale</b>. \u{1F447} <b>Which minor scale is used for harmonization?</b>",
      try:{ type:"mc", choices:["Harmonic minor — the raised 7th feeds the V chord","Natural minor only","Melodic minor descending"], answer:0,
        success:"✓ The raised 7th (G♯ in A minor) is exactly what makes V major — Lesson 60's whole story, now applied.",
        fail:"Which form gave the V chord its major 3rd?",
        hint:"The 'most used' minor form." } },
    { say:"<b>Using the Minor Harmonizing Chart:</b> Use the chart to choose a chord that contains the melody note. \u{1F447} <b>Which chord harmonizes scale degree 6 in A minor?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:260px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Melody Note</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Chord</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">1</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">i, iv</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">2</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">3</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">i</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">4</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">iv, V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">5</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">i, V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">6</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">iv</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">7 (raised)</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V</td></tr></table>` },
      try:{ type:"mc", choices:["iv — the only chord containing degree 6","i","V7"], answer:0,
        success:"✓ F is the 3rd of D-F-A. Same chart logic as major — only the chord qualities changed.",
        fail:"Scan the rows for a 6…",
        hint:"One row only." } },
    { say:"<b>The Raised 7th:</b> The raised 7th belongs to the <b>V (or V7)</b> chord. It creates the leading tone that pulls to the tonic. \u{1F447} <b>Which chord should harmonize G♯ in A minor?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"G#4",d:"w",label:"the melody's ♯7…"},
        {p:"E4",d:"w",label:"…lives in V"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:400} },
      try:{ type:"mc", choices:["V or V7","iv","i"], answer:0,
        success:"✓ G♯ is the 3rd of V (E-G♯-B) — no other primary chord contains it.",
        fail:"Spell all three primaries — which contains G♯?",
        hint:"E-G♯-B." } },
    { say:"<b>Ending the Progression:</b> Most minor harmonizations begin with <b>i</b>, end with <b>i</b>, and use <b>V (or V7)</b> before the final i. \u{1F447} <b>Which cadence is most common in a minor key?</b>",
      try:{ type:"mc", choices:["V(7) → i","iv → iv","i → V, stopping on V"], answer:0,
        success:"✓ V(7) → i — the dominant-to-tonic cadence, in the minor mode.",
        fail:"Same rule as major, minor spelling…",
        hint:"The pre-final chord rule." } },
    { say:"Harmonize the melody using the minor harmonizing chart. \u{1F447}",
      try:{ type:"custom",
        hint:"i = A-C-E, iv = D-F-A, V7 = E-G♯-B-D. Watch degree 7!",
        mount:(container,fb)=>MF_L68_harm(container,fb) } },
    { say:"<b>Choosing Between Chords:</b> Some melody notes belong to more than one chord. <b>Remember: if more than one chord fits the melody note, use your ear to choose the best harmony.</b> \u{1F447} <b>Who makes the final choice?</b>",
      try:{ type:"mc", choices:["Your ear","The metronome","Always the V chord"], answer:0,
        success:"✓ Your ear should always be the final guide.",
        fail:"Same tie-breaker as Lesson 64…",
        hint:"The final guide." } },
    { say:"<b>Try Another Key:</b> Apply the same harmonizing chart in E minor. \u{1F447} <b>Which are the three primary chords?</b>",
      try:{ type:"mc", choices:["Em (E-G-B), Am (A-C-E), B7 (B-D♯-F♯-A)","Em, Am, Bm — all minor","E, A, B — all major"], answer:0,
        success:"✓ i and iv minor, V7 major with the raised D♯. The chart rides along to every minor key.",
        fail:"Raise E minor's 7th (D→D♯) and build V on B…",
        hint:"i, iv minor; V7 major with ♯7 inside." } }
  ],
  examples:[
    { caption:"The A harmonic minor scale harmonized with only i, iv and V(7) — i, V, i, iv, i, iv, V, i.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"A4",d:"q",label:"i"},{p:"B4",d:"q",label:"V7"},{p:"C5",d:"q",label:"i"},{p:"D5",d:"q",label:"iv"},
        {p:"E5",d:"q",label:"i"},{p:"F5",d:"q",label:"iv"},{p:"G#5",d:"q",label:"V7"},{p:"A5",d:"q",label:"i"},{bar:"final"}],width:560},
      kb:{start:69,octaves:1.1667,labels:true} },
    { caption:"The minor cadence: iv → V7 → i. The leading tone G♯ pulls to the tonic.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"D4",d:"w",label:"iv"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"V7"},{p:"G#4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"A3",d:"w",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"final"}],width:480},
      kb:{start:56,octaves:1.6667,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Minor-Chart Sprint (45s)",
      intro:"Scale degrees in minor — name their chords at speed!",
      miaIntro:"Same rows, minor mood! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Degree 3 (minor)","the i chord (only)"],
        ["Degree 6 (minor)","the iv chord (only)"],
        ["Degree 2 (minor)","the V(7) chord (only)"],
        ["Raised degree 7","the V(7) chord (only)"],
        ["Degree 1 (minor)","i or iv — ear decides"],
        ["Degree 5 (minor)","i or V — ear decides"],
        ["Degree 4 (minor)","iv or V7 — ear decides"],
        ["The final minor chord","usually i, preceded by V(7)"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — minor chart mastered!":null },
    { type:"key-climb", title:"Game 2 · Minor Cadence Climb",
      intro:"Play the minor cadence: iv, V7, then i — mind the G♯!",
      miaIntro:"The leading tone lives in V! \u{1FA9C}",
      spec:{seq:[62,65,69, 64,68,71,74, 69,72,76],
        names:["D (iv: root)","F","A","E (V7: root)","G♯ — the raised 7th!","B","D (the 7th)","A (i: home)","C","E"],
        start:57, octaves:1.5833, title:"iv → V7 → i in A minor"},
      result:(score)=>score!==null?"The minor cadence is in your hands!":null },
    { type:"symbol-hunt", title:"Game 3 · Which Minor Chord Holds the Note?",
      intro:"A melody note is called — click the A-minor chord that CONTAINS it!",
      miaIntro:"Spell i, iv and V7 first! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"i — holds A, C, E", spec:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true}],width:150}},
        {label:"iv — holds D, F, A", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"V7 — holds E, G♯, B, D", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"V — holds E, G♯, B", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Minor note-to-chord mapping complete!":null },
    { type:"term-race", title:"Game 4 · Minor Harmonizer's Race",
      intro:"All the minor-harmonizing rules — at speed!",
      miaIntro:"Minor facts, fast! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Minor harmonizing","similar to major — new chart, same method"],
        ["The scale it reads","harmonic minor (raised 7th)"],
        ["i, iv, V(7) together","every note of the harmonic minor scale"],
        ["G♯ in an A-minor melody","must take V or V7"],
        ["First and last chord","usually i"],
        ["Just before the end","V or V7"],
        ["Tie-breaker","the ear, always"],
        ["V7 of E minor","B7 (B-D♯-F♯-A)"]]},
      result:(score)=>score>=6?"Minor harmonizing mastered!":null }
  ],
  practiceIntro:"20 practice questions — the minor chart, the G♯ rule and the cadence. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Degree 3","i only"],["Degree 6","iv only"],["Degree 2","V(7) only"],["Raised 7","V(7) only"],["Degree 5","i or V"],["Degree 4","iv or V7"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"Harmonizing a melody in a minor key is…", choices:["similar to harmonizing in a major key","completely different","impossible with three chords"], answer:0,
      explain:"Minor harmonizing uses the same process as major." },
    { type:"mc", q:"Which minor scale is used when harmonizing melodies?", choices:["The harmonic minor scale","The natural minor scale","The chromatic scale"], answer:0,
      explain:"The raised 7th is included — via V." },
    { type:"mc", q:"In A minor, melody note C (degree 3) takes…", choices:["the i chord","the iv chord","the V7 chord"], answer:0,
      explain:"C is i's 3rd — its only primary home." },
    { type:"mc", q:"In A minor, melody note F (degree 6) takes…", choices:["the iv chord","the i chord","the V chord"], answer:0,
      explain:"F is iv's 3rd." },
    { type:"mc", q:"Which chord contains the raised 7th?", choices:["V or V7","iv","i"], answer:0,
      explain:"The raised 7th is V's 3rd — nowhere else." },
    { type:"mc", q:"Most minor harmonizations begin and end with…", choices:["the i chord","the V chord","the iv chord"], answer:0,
      explain:"Home rules transfer from major." },
    { type:"truefalse", q:"A V or V7 usually precedes the last chord in minor too.", answer:true,
      explain:"The cadence is universal." },
    { type:"truefalse", q:"Degree 5 in minor can be harmonized by i or V.", answer:true,
      explain:"E = i's 5th = V's root; ear decides." },
    { type:"mc", q:"Why does the raised 7th appear in a minor melody?", choices:["The harmonization draws on the harmonic minor scale","It is a printing error","It comes from the major scale"], answer:0,
      explain:"The harmonic minor's raised 7th lives in V(7) — it pulls to the tonic." },
    { type:"truefalse", q:"In E minor, the V7 chord contains D♯.", answer:true,
      explain:"B-D♯-F♯-A — the raised 7th of E minor." }
  ],
  miaQuizIntro:"Quiz! Same chart shape, minor spellings — and G♯ always points at V.",
  quiz:[
    { type:"mc", q:"Why can many minor melodies be harmonized with i, iv, and V (or V7)?", choices:["Those chords contain all the notes of the harmonic minor scale","Minor melodies avoid most notes","The chart forbids other chords"], answer:0,
      explain:"Complete coverage, minor edition.", hint:"Same argument as Lesson 64." },
    { type:"mc", q:"The minor chart assigns degrees 1, 3 and 5 to…", choices:["the i chord","the iv chord","the V7 chord"], answer:0,
      explain:"They are i's own tones.", hint:"Root, 3rd, 5th of the tonic." },
    { type:"mc", q:"Degrees 2, 4, 5 and 7 (raised) go to…", choices:["V (or V7)","i","iv"], answer:0,
      explain:"All four live in E-G♯-B-D.", hint:"The dominant's row." },
    { type:"mc", q:"Degrees 1, 4 and 6 go to…", choices:["iv","i","V7"], answer:0,
      explain:"D-F-A = degrees 4, 6, 1.", hint:"The remaining row." },
    { type:"truefalse", q:"When more than one chord fits, your ear should always be the final guide.", answer:true,
      explain:"The ear is the final guide.", hint:"The universal tie-breaker." },
    { type:"truefalse", q:"Most minor harmonizations begin and end with a V7 chord.", answer:false,
      explain:"They begin and end with i.", hint:"Where is home in minor?" },
    { type:"mc", q:"Which cadence best ends a melody in A minor? (…G♯ → A)", choices:["V7 → i","iv → i","i → iv"], answer:0,
      explain:"G♯ forces V7; the final A lands on i.", hint:"Who owns G♯?" },
    { type:"mc", q:"Which primary chords contain melody note D in A minor?", choices:["iv (D-F-A) and V7 (E-G♯-B-D)","only i","none of the primaries"], answer:0,
      explain:"Root of iv, 7th of V7 — an ear tie.", hint:"Two homes." },
    { type:"mc", q:"Why is the raised 7th important in minor-key harmonization?", choices:["It creates the leading tone used in the V (or V7) chord","It is a printing error","Minor keys borrow it from Lydian"], answer:0,
      explain:"The leading tone lives in V.", hint:"Which chord contains it?" },
    { type:"mc", q:"In D minor, the V7 chord is spelled…", choices:["A-C♯-E-G","A-C-E-G","D-F♯-A-C"], answer:0,
      explain:"Raise D minor's 7th: C→C♯; build on A.", hint:"The raised 7th sits inside." },
    { type:"mc", q:"In E minor, melody note C (degree 6) takes…", choices:["Am — the iv chord","Em — the i chord","B7 — the V7"], answer:0,
      explain:"Degree 6 → iv; iv of E minor is A-C-E.", hint:"Degrees first, letters second." },
    { type:"mc", q:"What is the main difference between the major and minor harmonizing charts?", choices:["The chord qualities change, but the scale-degree chart stays the same","Completely different degree rows","Minor needs six chords"], answer:0,
      explain:"1,3,5 / 2,4,5,7 / 1,4,6 — same rows, lowercase i and iv.", hint:"Compare them side by side." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Degrees 1,3,5","i"],["Degrees 2,4,5,7","V(7)"],["Degrees 1,4,6","iv"],["G♯ in A minor","V's 3rd"]], reverse:true}, count:3 },
    { gen:"rel-key", params:{ask:"both"}, count:2 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:1 }
  ],
  vocabulary:[
    {term:"Minor Harmonizing Chart", def:"Degrees 1,3,5 → i · 2,4,5,7 → V(7) · 1,4,6 → iv — read from the HARMONIC minor scale."},
    {term:"The Raised 7th", def:"A raised-7th melody note can only be harmonized by V(7) — it is that chord's 3rd.",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:130}},
    {term:"Minor Cadence", def:"iv (or i) → V(7) → i — the dominant-to-tonic close in a minor key."},
    {term:"The Ear", def:"Still the final guide whenever two chords fit one melody note."}
  ],
  mistakes:[],
  summary:[
    "✔ Minor harmonizing = <b>major harmonizing with the minor chart</b>: 1,3,5 → i · 2,4,5,7 → V(7) · 1,4,6 → iv.",
    "✔ The chart reads the <b>HARMONIC minor</b> — the raised 7th belongs to V.",
    "✔ <b>G♯-type notes have exactly one chord</b>: V(7).",
    "✔ Begin and end with <b>i</b>; <b>V(7)</b> precedes the final chord.",
    "✔ Ties (degrees 1, 4, 5): <b>the ear decides</b>."
  ],
  tips:[
    "Spot the raised 7th FIRST when harmonizing a minor melody — those notes lock in V, and the rest falls into place around them.",
    "The chart is identical to major's in its rows. Learn ONE chart, own both modes.",
    "Play the harmonized minor scale daily; the i→V7 alternation at the top (F, G♯) is the most minor-sounding move in music.",
    "Next lesson you'll COMPOSE in minor — Pat-A-Pan style."
  ],
  rewards:{ badge:"Minor Harmonizer", icon:"\u{1F319}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! The minor chart obeys you completely. \u{1F319}\u{1F389}",
  miaPass:"Passed! You can harmonize minor melodies. Now compose one…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A used A minor's own primaries — i, iv, V7 with the raised G♯. Version B borrowed C major's chords and clashed with the minor melody.",
      play:()=>{const mel=[69,72,71,68,69],chs=[[57,60,64],[57,62,65],[56,59,64],[56,59,64],[57,60,64]];mel.forEach((m,i)=>{MFAudio.tone(m,.6,i*.65,.42);chs[i].forEach(c=>MFAudio.tone(c,.6,i*.65,.2));});} },
    learn:{ label:"minor harmonizing",
      explain:"Same method as major; chart: 1,3,5→i, 2,4,5,7→V(7), 1,4,6→iv, read from harmonic minor. G♯ notes force V. Begin/end on i.",
      hint:"The chord must contain the note — minor edition.",
      play:()=>{[57,60,64].forEach(m=>MFAudio.tone(m,.7,0,.3));[56,59,62,64].forEach(m=>MFAudio.tone(m,.7,.8,.3));[57,60,64,69].forEach(m=>MFAudio.tone(m,1,1.6,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 is the harmonized A harmonic minor scale; example 2 isolates the minor cadence iv → V7 → i." },
    game:{ label:"the games",
      explain:"Sprint the minor chart, climb the cadence, match notes to minor chords, then race the rules.",
      hint:"i = A-C-E, iv = D-F-A, V7 = E-G♯-B-D." },
    quiz:{ label:"this question",
      explain:"Find the degree, find its row(s), let the ear break ties — and remember the raised 7th belongs to V alone.",
      play:()=>{[64,68,71,74].forEach(m=>MFAudio.tone(m,.8,0,.3));[57,60,64].forEach(m=>MFAudio.tone(m,1,.9,.35));} }
  }
};
