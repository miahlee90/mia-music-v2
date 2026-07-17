/* Lesson 64 — Harmonizing a Melody in a Major Key (AEMT Book 3, Unit 16)
   Built from drafts/UNIT 16 – Lesson 64.md; AEMT3 p.102 verified by render.
   Core: to HARMONIZE = create a chord accompaniment; I, IV, V(7) hold every
   major-scale note. The book's chart: degrees 1,3,5 → I · 2,4,5,7 → V(7) ·
   1,4,6 → IV. When several fit, THE EAR decides. Harmonizations usually
   begin and end with I; V(7) usually precedes the last chord; V7 often
   omits its 5th.
   NOTE: edit by FULL-FILE REWRITE only. */

/* harmonize-the-scale: pick a chord for each melody degree */
function MF_L64_harm(container,fb){
  const STEPS=[
    {deg:1, note:"C5", ok:["I","IV"], best:"I", why:"Degree 1 lives in I (as root) and IV (as 5th) — most harmonizations BEGIN with I."},
    {deg:2, note:"D5", ok:["V7"], best:"V7", why:"Degree 2 belongs only to V (as its 5th) — the chart's one-chord row."},
    {deg:3, note:"E5", ok:["I"], best:"I", why:"Degree 3 is the 3rd of I — no other primary contains E."},
    {deg:4, note:"F5", ok:["IV","V7"], best:"IV", why:"Degree 4 fits IV (root) or V7 (7th). Your ear picks — IV feels natural mid-phrase."},
    {deg:5, note:"G5", ok:["I","V7"], best:"I", why:"Degree 5 fits I (5th) or V (root) — the most flexible melody note of all."},
    {deg:6, note:"A5", ok:["IV"], best:"IV", why:"Degree 6 belongs only to IV (as its 3rd)."},
    {deg:7, note:"B5", ok:["V7"], best:"V7", why:"Degree 7 (the leading tone) is V's 3rd — and V(7) loves preceding the final chord!"},
    {deg:8, note:"C6", ok:["I"], best:"I", why:"End on I — harmonizations usually finish home, with V(7) just before."}];
  const CH={I:[60,64,67], IV:[60,65,69], V7:[59,62,65,67]};
  let k=0; const picked=[];
  container.innerHTML=`<div class="big-q l64h-q" style="text-align:center"></div>
    <div class="l64h-staff"></div>
    <div class="choices chips l64h-ch"><button>I</button><button>IV</button><button>V7</button></div>
    <div style="text-align:center"><button class="play l64h-play" style="display:none">▶ Play your harmonized scale</button></div>`;
  const q=container.querySelector(".l64h-q"), holder=container.querySelector(".l64h-staff"), ch=container.querySelector(".l64h-ch"), pl=container.querySelector(".l64h-play");
  function draw(){
    Staff.render(holder,{clef:"treble",notes:STEPS.map((s,i)=>({p:s.note,d:"q",label:i<picked.length?picked[i]:String(s.deg)})),width:560});
  }
  function ask(){
    draw();
    if(k>=STEPS.length){ q.textContent="Excellent! The melody is fully harmonized. Listen!"; ch.style.display="none"; pl.style.display="inline-block"; return; }
    q.innerHTML=`Melody note ${k+1} of 8 — scale degree <b>${STEPS[k].deg}</b>. Which chord fits best? <i>(Chart: 1,3,5→I · 2,4,5,7→V7 · 1,4,6→IV)</i>`;
  }
  [...ch.children].forEach(b=>b.onclick=()=>{
    const S=STEPS[k]; if(!S) return;
    if(S.ok.includes(b.textContent)){
      MFAudio.tone(MFAudio.midi(S.note),.8,.05,.4);
      CH[b.textContent].forEach(m=>MFAudio.tone(m,.9,.05,.25));
      picked.push(b.textContent); k++;
      fb(true,`✓ ${S.why}`);
      setTimeout(ask,1200);
    } else { MFAudio.tone(40,.2); fb(false,"Check which chord contains the melody note."); }
  });
  pl.onclick=()=>{
    STEPS.forEach((s,i)=>{
      MFAudio.tone(MFAudio.midi(s.note),.55,i*.62,.4);
      CH[picked[i]].forEach(m=>MFAudio.tone(m,.58,i*.62,.2));
    });
    setTimeout(()=>fb(true,"✓ Your harmonization — melody and chords together."),5200);
  };
  ask();
}

LESSON_CONTENT[64]={
  welcome:"Harmonizing: adding chords to support a melody. \u{1F3A8}",
  hook:{
    say:"<b>The same melody can be harmonized in different ways.</b> Listen to both versions. <b>Which accompaniment fits the melody better?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A</button>
          <button class="play hk-b">▶ Version B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version A — each chord contains its melody note</button><button>Version B — the clashing chords fit better</button></div>`;
        const mel=[72,74,76,77,79];
        const goodCh=[[60,64,67],[59,62,67],[60,64,67],[60,65,69],[60,64,67]];
        const badCh=[[60,65,69],[60,64,67],[59,62,65],[59,62,67],[60,65,69]];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const play=(chs)=>mel.forEach((m,i)=>{ MFAudio.tone(m,.6,i*.65,.42); chs[i].forEach(c=>MFAudio.tone(c,.6,i*.65,.2)); });
        container.querySelector(".hk-a").onclick=()=>{ play(goodCh); hA=true; if(hB) setTimeout(()=>ch.style.display="",3600); };
        container.querySelector(".hk-b").onclick=()=>{ play(badCh); hB=true; if(hA) setTimeout(()=>ch.style.display="",3600); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Version A chose chords that CONTAIN each melody note. Adding chords to support a melody is called HARMONIZING — today's lesson!");
          else fb(false,"Version B's chords didn't contain their melody notes. Listen once more…");
        });
      } }
  },
  objectives:[
    "Define harmonizing: creating a chord accompaniment for a melody",
    "Use the chart: 1,3,5 → I · 2,4,5,7 → V(7) · 1,4,6 → IV",
    "Let the EAR decide when more than one chord fits",
    "Begin and end with I; put V(7) just before the final chord",
    "Omit the V7's 5th when harmonizing (three smooth voices)",
    "Harmonize a full C major scale yourself"
  ],
  steps:[
    { say:"<b>What Does It Mean to Harmonize a Melody?</b> Harmonizing means adding chords to support a melody. In a major key, many melodies can be harmonized with <b>I, IV, and V (or V7)</b>. \u{1F447} <b>What should a harmonizing chord contain?</b>",
      try:{ type:"mc", choices:["The melody note","A louder note","Only the tonic"], answer:0,
        success:"✓ A harmonizing chord must contain the melody note.",
        fail:"What went wrong in version B of the hook?",
        hint:"The chord must CONTAIN the melody note." } },
    { say:"<b>Choosing the Right Chord:</b> Each melody note belongs to one or more primary chords. Use the chart to choose a chord that contains the melody note. \u{1F447} <b>Which chord should harmonize scale degree 6?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:260px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Melody Note</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Chord</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">1</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">I, IV</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">2</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">3</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">I</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">4</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">IV, V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">5</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">I, V</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">6</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">IV</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">7</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800">V</td></tr></table>` },
      try:{ type:"mc", choices:["IV — degree 6 appears only in its row","I — six is close to five","V7 — sevens and sixes match"], answer:0,
        success:"✓ Degree 6 (A in C major) is the 3rd of F-A-C. One row only → no ear required.",
        fail:"Scan each row for the number 6…",
        hint:"Only one row lists 6." } },
    { say:"Some melody notes belong to more than one chord. When this happens, <b>use your ear</b> to choose the best harmony. \u{1F447} <b>Which chords can harmonize scale degree 5?</b>",
      try:{ type:"mc", choices:["I or V — it lives in both","only IV","any chord at all"], answer:0,
        success:"✓ G is the 5th of C-E-G AND the root of G-B-D. The most flexible note in the scale — your ear casts the deciding vote.",
        fail:"Find 5 in the chart — it appears twice.",
        hint:"Rows one and two both contain 5." } },
    { say:"<b>Ending the Progression:</b> Most harmonizations begin with <b>I</b>, end with <b>I</b>, and use <b>V (or V7)</b> before the final I. \u{1F447} <b>Which cadence is most common?</b>",
      try:{ type:"mc", choices:["V(7) → I","IV → ii","I → V, ending on V"], answer:0,
        success:"✓ The dominant hands the melody home. You've heard this ending in nearly every song you know.",
        fail:"Which chord usually comes just before the final I?",
        hint:"Most harmonizations end V(7) → I." } },
    { say:"<b>Using V7:</b> The 5th of a V7 chord is often omitted. The chord still keeps its harmonic function. \u{1F447} <b>Why is the 5th often omitted?</b>",
      try:{ type:"mc", choices:["The root, 3rd and 7th carry the chord's character","The 5th is the most important note","It changes the key"], answer:0,
        success:"✓ The root, 3rd and 7th keep the chord's function — the 5th can be left out.",
        fail:"Which notes give V7 its character?",
        hint:"Root, 3rd and 7th." } },
    { say:"Harmonize the melody using the chart. \u{1F447}",
      try:{ type:"custom",
        hint:"1,3,5→I · 2,4,5,7→V7 · 1,4,6→IV. Start and end on I.",
        mount:(container,fb)=>MF_L64_harm(container,fb) } },
    { say:"<b>Try Another Key:</b> The same chart works in every major key. \u{1F447} <b>In G major, which chord harmonizes scale degree 6?</b>",
      try:{ type:"mc", choices:["C major — the IV chord of G","G major — the I chord","D7 — the V7"], answer:0,
        success:"✓ Degree 6 → IV, and IV of G major is C (C-E-G contains E). Same chart, any key.",
        fail:"First: which degree is E in G major? Then: which chord does the chart give that degree?",
        hint:"G-A-B-C-D-E: count." } }
  ],
  examples:[
    { caption:"The C major scale harmonized: each melody note (the top note) rides on its primary chord — I, IV or V7. Press play to hear the FULL harmony, not just the tune.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"E4",d:"q",label:"I"},{p:"G4",d:"q",chord:true},{p:"C5",d:"q",chord:true},
        {p:"F4",d:"q",label:"V7"},{p:"G4",d:"q",chord:true},{p:"B4",d:"q",chord:true},{p:"D5",d:"q",chord:true},
        {p:"G4",d:"q",label:"I"},{p:"C5",d:"q",chord:true},{p:"E5",d:"q",chord:true},
        {p:"A4",d:"q",label:"IV"},{p:"C5",d:"q",chord:true},{p:"F5",d:"q",chord:true},
        {p:"C5",d:"q",label:"I"},{p:"E5",d:"q",chord:true},{p:"G5",d:"q",chord:true},
        {p:"C5",d:"q",label:"IV"},{p:"F5",d:"q",chord:true},{p:"A5",d:"q",chord:true},
        {p:"D5",d:"q",label:"V7"},{p:"F5",d:"q",chord:true},{p:"G5",d:"q",chord:true},{p:"B5",d:"q",chord:true},
        {p:"E5",d:"q",label:"I"},{p:"G5",d:"q",chord:true},{p:"C6",d:"q",chord:true},{bar:"final"}],width:620},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"The closing rules, isolated: a mini-phrase that begins on I, wanders, then lands V7 → I. This V7 → I cadence ends most harmonizations.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V7 (5th omitted)"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Chart Sprint (45s)",
      intro:"Scale degrees fly by — name their chords from the harmonizing chart!",
      miaIntro:"1-3-5 I, 2-4-5-7 V, 1-4-6 IV! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Degree 3","the I chord (only)"],
        ["Degree 6","the IV chord (only)"],
        ["Degree 2","the V (or V7) chord (only)"],
        ["Degree 7","the V (or V7) chord (only)"],
        ["Degree 1","I or IV — ear decides"],
        ["Degree 5","I or V — ear decides"],
        ["Degree 4","IV or V7 — ear decides"],
        ["The final chord","usually I, preceded by V(7)"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — the chart is burned in!":null },
    { type:"key-climb", title:"Game 2 · Cadence Climb",
      intro:"Play the closing cadence: IV, then V7 (5th omitted), then I — bottom to top!",
      miaIntro:"The last three chords of a thousand songs! \u{1FA9C}",
      spec:{seq:[65,69,72, 67,71,77, 72,76,79],
        names:["F (IV: root)","A","C","G (V7: root)","B","F (the 7th — no D needed!)","C (I: home)","E","G"],
        start:60, octaves:2, title:"IV → V7(no 5th) → I in C major"},
      result:(score)=>score!==null?"Cadence in the fingers — the ending is yours!":null },
    { type:"symbol-hunt", title:"Game 3 · Which Chord Holds the Note?",
      intro:"A melody note is called — click the chord that CONTAINS it!",
      miaIntro:"Spell before you click! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"I — holds C, E, G", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"IV — holds F, A, C", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"V7 — holds G, B, D, F", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}},
        {label:"V7, 5th omitted — G, B, F", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Note-to-chord mapping mastered!":null },
    { type:"term-race", title:"Game 4 · Harmonizer's Rulebook Race",
      intro:"All of today's rules and rows — at speed!",
      miaIntro:"The whole rulebook! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["To harmonize","create a chord accompaniment for a melody"],
        ["Why I-IV-V7 suffice","they contain all the scale's notes"],
        ["Degrees 1, 3, 5","the I chord row"],
        ["Degrees 2, 4, 5, 7","the V(7) chord row"],
        ["Degrees 1, 4, 6","the IV chord row"],
        ["When two chords fit","the ear is the final guide"],
        ["First and last chord","usually I"],
        ["Just before the last chord","V or V7"]]},
      result:(score)=>score>=6?"Chart mastered — harmonize away!":null }
  ],
  practiceIntro:"20 practice questions — chart rows, choices and cadence rules. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Degree 3","I only"],["Degree 6","IV only"],["Degree 2","V(7) only"],["Degree 7","V(7) only"],["Degree 5","I or V"],["Degree 4","IV or V7"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 },
    { type:"mc", q:"To HARMONIZE a melody means to…", choices:["create a chord accompaniment for it","play it faster","transpose it"], answer:0,
      explain:"The lesson's opening definition." },
    { type:"mc", q:"Melody note E (degree 3 in C major) is harmonized by…", choices:["the I chord","the IV chord","the V7 chord"], answer:0,
      explain:"E lives only in C-E-G among the primaries." },
    { type:"mc", q:"Melody note A (degree 6 in C major) is harmonized by…", choices:["the IV chord","the I chord","the V7 chord"], answer:0,
      explain:"A is the 3rd of F-A-C." },
    { type:"mc", q:"Melody note D (degree 2) is harmonized by…", choices:["V or V7","I","IV"], answer:0,
      explain:"D is the 5th of G-B-D." },
    { type:"mc", q:"When more than one chord fits, what should guide your choice?", choices:["your ear","a coin flip","always the I chord"], answer:0,
      explain:"When more than one chord fits, the ear decides." },
    { type:"mc", q:"Most harmonizations begin and end with…", choices:["the I chord","the V chord","the IV chord"], answer:0,
      explain:"Home at both ends." },
    { type:"truefalse", q:"A V or V7 chord usually comes just before the final chord.", answer:true,
      explain:"The V(7) → I cadence." },
    { type:"mc", q:"When using V7, which note is often omitted?", choices:["The 5th","The root","The 7th"], answer:0,
      explain:"G-B-F keeps the chord's function without the 5th." },
    { type:"truefalse", q:"Degree 5 can only be harmonized by the V chord.", answer:false,
      explain:"It fits I (as the 5th) AND V (as the root)." },
    { type:"truefalse", q:"The harmonizing chart works only in C major.", answer:false,
      explain:"It speaks in DEGREES — any major key obeys." }
  ],
  miaQuizIntro:"Quiz! Remember: the chord must CONTAIN the melody note.",
  quiz:[
    { type:"mc", q:"Harmonizing a melody means…", choices:["creating a chord accompaniment for it","writing a new melody","changing its rhythm","adding dynamics"], answer:0,
      explain:"Chords under a tune.", hint:"Today's title." },
    { type:"mc", q:"Why can I, IV, and V harmonize many melodies?", choices:["Those chords contain all the notes of the major scale","Melodies only use three notes","Other chords are forbidden"], answer:0,
      explain:"Full scale coverage with three chords.", hint:"The Unit 13 fact returns." },
    { type:"mc", q:"According to the chart, scale degrees 1, 3 and 5 take which chord?", choices:["I","IV","V7"], answer:0,
      explain:"They ARE the I chord's tones.", hint:"Root, 3rd, 5th of the tonic." },
    { type:"mc", q:"Scale degrees 2, 4, 5 and 7 take which chord?", choices:["V (or V7)","I","IV"], answer:0,
      explain:"All four live inside G-B-D-F.", hint:"The biggest row belongs to the biggest chord." },
    { type:"mc", q:"Scale degrees 1, 4 and 6 take which chord?", choices:["IV","I","V7"], answer:0,
      explain:"F-A-C = degrees 4, 6, 1.", hint:"The remaining row." },
    { type:"mc", q:"Degree 4 appears in TWO rows. Which two chords can harmonize it?", choices:["IV and V7","I and IV","I and V"], answer:0,
      explain:"F is IV's root and V7's 7th.", hint:"Scan both rows for 4." },
    { type:"truefalse", q:"When more than one chord fits, your ear should be the final guide.", answer:true,
      explain:"When more than one chord fits, your ear decides.", hint:"Who has the deciding vote?" },
    { type:"truefalse", q:"Most harmonizations begin and end with a V7 chord.", answer:false,
      explain:"They begin and end with I; V(7) comes JUST BEFORE the end.", hint:"Where's home?" },
    { type:"mc", q:"Which cadence best ends this melody? (…B → C in C major)", choices:["V7 → I","IV → IV","I → V"], answer:0,
      explain:"B (degree 7) takes V7; the final C takes I — the classic cadence.", hint:"Leading tone, then home." },
    { type:"mc", q:"Which chords contain melody note F?", choices:["IV (F-A-C) and V7 (G-B-D-F)","I and IV","only I"], answer:0,
      explain:"F = IV's root = V7's 7th.", hint:"Spell both chords." },
    { type:"mc", q:"When the V7 is used in these harmonizations, which note is often left out?", choices:["The 5th (D)","The root (G)","The 7th (F)"], answer:0,
      explain:"Lesson 50's omission rule, now in service.", hint:"The filler note." },
    { type:"mc", q:"In F major, melody note D (degree 6) should be harmonized by…", choices:["B♭ major — the IV chord","F major — the I chord","C7 — the V7"], answer:0,
      explain:"Degree 6 → IV; IV of F is B♭ (B♭-D-F contains D).", hint:"Degrees first, letters second." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Degrees 1,3,5","I"],["Degrees 2,4,5,7","V(7)"],["Degrees 1,4,6","IV"],["Two chords fit","let the ear decide"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { gen:"degree-name", params:{ask:"both"}, count:2 }
  ],
  vocabulary:[
    {term:"Harmonize", def:"To create a chord accompaniment for a melody."},
    {term:"The Harmonizing Chart", def:"Degrees 1,3,5 → I · degrees 2,4,5,7 → V(7) · degrees 1,4,6 → IV. When two chords fit, the ear decides."},
    {term:"Cadence Habit", def:"Harmonizations usually begin AND end on I, with V(7) just before the final chord."},
    {term:"Omitted 5th (V7)", def:"When harmonizing, V7 often drops its 5th: G-B-F — lighter texture, same pull.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"F5",d:"w",chord:true}],width:130}}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Harmonizing</b> = building a chord accompaniment; <b>I, IV, V(7)</b> cover every major-scale note.",
    "✔ The chart: <b>1,3,5 → I · 2,4,5,7 → V(7) · 1,4,6 → IV</b>.",
    "✔ Overlapping degrees (1, 4, 5): <b>the ear is the final guide</b>.",
    "✔ Begin and end with <b>I</b>; put <b>V(7)</b> right before the final chord.",
    "✔ Harmonizing V7s often <b>omit the 5th</b>."
  ],
  tips:[
    "Practice trick: hum any simple tune, and on each long note ask 'is this note in I, IV or V7?' — you're harmonizing in your head.",
    "The chart never mentions letters — that's its superpower. Learn it in degrees once, use it in fifteen keys forever.",
    "When your ear must choose (degrees 1, 4, 5), try both chords and pick the one that makes the NEXT chord change feel inevitable.",
    "Next lesson: the same chords, un-stacked — broken chords and arpeggios that ripple like a harp."
  ],
  rewards:{ badge:"Melody Tailor", icon:"\u{1F3A8}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! You can harmonize any simple melody now. \u{1F3A8}\u{1F389}",
  miaPass:"Passed! Chart in hand, ear in charge. Next: broken chords and arpeggios…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version A chose chords CONTAINING each melody note (the chart's method); version B's chords clashed because they didn't.",
      play:()=>{const mel=[72,74,76,77,79],chs=[[60,64,67],[59,62,67],[60,64,67],[60,65,69],[60,64,67]];mel.forEach((m,i)=>{MFAudio.tone(m,.6,i*.6,.42);chs[i].forEach(c=>MFAudio.tone(c,.6,i*.6,.2));});} },
    learn:{ label:"harmonizing",
      explain:"Chart: 1,3,5→I; 2,4,5,7→V(7); 1,4,6→IV. Overlaps → ear decides. Begin/end on I, V(7) before the end, V7 often drops its 5th.",
      hint:"The chord must CONTAIN the melody note.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.7,0,.3));[59,62,65,67].forEach(m=>MFAudio.tone(m,.7,.8,.3));[60,64,67,72].forEach(m=>MFAudio.tone(m,1,1.6,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 is a fully harmonized C major scale; example 2 isolates the closing cadence IV → V7 → I." },
    game:{ label:"the games",
      explain:"Sprint the chart, play the cadence, match notes to chords, then race the rulebook.",
      hint:"Three rows: I, V(7), IV." },
    quiz:{ label:"this question",
      explain:"Ask two things: which degree is the melody note, and which chart row(s) hold that degree? Ties go to the ear.",
      play:()=>{[67,71,77].forEach(m=>MFAudio.tone(m,.8,0,.3));[60,64,72].forEach(m=>MFAudio.tone(m,1,.9,.35));} }
  }
};
