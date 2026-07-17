/* Lesson 97 — Voice Leading Basics (Book 4, Unit 24 — SELF-AUTHORED)
   Core: SATB — four voices, their ranges and vertical spacing (≤ octave
   between adjacent upper voices); no VOICE CROSSING; move voices as little
   as possible (common tones, steps); avoid parallel 5ths/octaves (intro).
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[97]={
  welcome:"Good voice leading creates smooth, independent melodic lines while supporting the harmony.",
  hook:{
    say:"<b>Listen to two ways of connecting the same chords.</b> Version A uses several large leaps, while Version B retains a common tone and uses smaller melodic intervals. \u{1F447} <b>Which version creates smoother voice leading?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version A — several large leaps</button>
          <button class="play hk-b">▶ Version B — common tone and stepwise motion</button></div>
          <div class="choices hk-ch" style="display:none"><button>Version B — the voices connect through smaller intervals</button><button>Version A — larger leaps always produce smoother lines</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [48,64,67,72].forEach(m=>MFAudio.tone(m,.9,.05,.26)); [65,69,72,77].forEach(m=>MFAudio.tone(m,1.0,1.0,.26)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2300); };
        container.querySelector(".hk-b").onclick=()=>{ [48,64,67,72].forEach(m=>MFAudio.tone(m,.9,.05,.26)); [53,65,69,72].forEach(m=>MFAudio.tone(m,1.0,1.0,.26)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Version B retains the common tone C and connects the remaining upper voices primarily by step. Voice leading considers how each individual line moves from one chord to the next.");
          else fb(false,"Version A uses unnecessary leaps. Listen for the version in which each individual voice forms a more connected melodic line.");
        });
      } }
  },
  objectives:[
    "Identify the four SATB voices",
    "Understand basic spacing and voice order",
    "Keep common tones when possible",
    "Move voices by step or small intervals",
    "Avoid voice crossing",
    "Recognize parallel fifths and octaves (introduction only)"
  ],
  steps:[
    { say:"<b>The Four Voices (SATB):</b> from <b>highest to lowest</b> — <b>S</b>oprano, <b>A</b>lto, <b>T</b>enor, <b>B</b>ass. In keyboard-style notation, soprano and alto share the <b>treble staff</b>; tenor and bass share the <b>bass staff</b>. \u{1F447} <b>What is the standard high-to-low order of SATB voices?</b>",
      try:{ type:"mc", choices:["Soprano, alto, tenor, bass","Bass, tenor, alto, soprano","Soprano, tenor, alto, bass"], answer:0,
        success:"✓ Correct. SATB is ordered from the highest voice, soprano, to the lowest voice, bass.",
        fail:"Begin with the highest voice.",
        hint:"S–A–T–B." } },
    { say:"<b>Working Ranges:</b> these are practical <b>working ranges</b> for beginning SATB writing — not absolute vocal limits. Real ranges vary with the singer and the music. \u{1F447} <b>Which SATB voice normally occupies the lowest range?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Voice</th><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#2F6DA8">Soprano</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#A9821F">Alto</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#C05A21">Tenor</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800">Bass</td></tr>
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Range</th><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">C4–G5</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">G3–D5</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">C3–G4</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">E2–C4</td></tr></table>` },
      try:{ type:"mc", choices:["Bass","Tenor","Alto"], answer:0,
        success:"✓ Correct. The bass normally occupies the lowest range in SATB texture.",
        fail:"Recall the high-to-low SATB order.",
        hint:"Bass is the lowest voice." } },
    { say:"<b>Spacing — one rule:</b> keep <b>adjacent upper voices (S–A and A–T) within an octave</b>. <b>Tenor–bass may be wider</b> — even more than an octave — as long as both stay in range. \u{1F447} <b>Which adjacent voice pair may normally be separated by more than an octave?</b>",
      try:{ type:"mc", choices:["Tenor and bass","Soprano and alto","Alto and tenor"], answer:0,
        success:"✓ Correct. Tenor and bass may be separated by more than an octave, while the adjacent upper voices normally remain within an octave.",
        fail:"Identify the adjacent pair that includes the bass.",
        hint:"The tenor–bass spacing rule is less restrictive." } },
    { say:"<b>Voice Crossing:</b> keep the order <b>S above A above T above B</b>. <b>Voice crossing</b> is when a lower voice rises above a higher one (e.g., alto above soprano) — avoided in beginning writing because it blurs which line is which. \u{1F447} <b>At the same moment, the alto is written above the soprano. What is this called?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:24px;justify-content:center;font-size:14px;text-align:center">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 20px">
          <div style="font-weight:800;color:#2F6DA8;margin-bottom:5px">Correct ✓</div>
          <div style="line-height:1.8;font-weight:700">S<br>A<br>T<br>B</div>
          <div style="font-size:11px;color:#555;margin-top:4px">high → low, in order</div></div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:8px 20px">
          <div style="font-weight:800;color:#C05A21;margin-bottom:5px">Crossing ✗</div>
          <div style="line-height:1.8;font-weight:700"><span style="color:#C05A21">A</span><br><span style="color:#C05A21">S</span><br>T<br>B</div>
          <div style="font-size:11px;color:#555;margin-top:4px">A rose above S</div></div></div>` },
      try:{ type:"mc", choices:["Voice crossing","Contrary motion","Pedal point"], answer:0,
        success:"✓ Correct. The vertical order of the soprano and alto has been reversed, creating voice crossing.",
        fail:"Compare the vertical order of the two voices.",
        hint:"Maintain S above A above T above B in these exercises." } },
    { say:"<b>Efficient Voice Leading — the heart of this lesson:</b> <b>keep common tones</b> in the same voice, and move the remaining voices <b>by step</b> whenever possible. Avoid unnecessary leaps. (The bass leaps more freely, since it carries the chord roots.) \u{1F447} <b>Two adjacent chords share the pitch G. Which choice often creates efficient voice leading?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"B3",d:"w",label:"V (G stays)"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["Retain G in the same voice when other considerations allow","Move G by an unnecessary octave","Omit G automatically"], answer:0,
        success:"✓ Correct. Retaining a common tone can connect the chords smoothly, provided the result also follows range, spacing, doubling, and tendency-tone guidelines.",
        fail:"Check whether the common tone can remain in the same voice without creating another problem.",
        hint:"Retain common tones when practical." } },
    { say:"<b>Doubling — three starter rules:</b> a triad has 3 tones but SATB has 4 voices, so one tone is doubled.<br>• <b>Double the root</b> — usually safest.<br>• <b>Don't double the leading tone</b> — it pulls up to the tonic.<br>• In a seventh chord, the <b>chordal 7th resolves down</b> by step. \u{1F447} <b>Which chord member should normally not be doubled in introductory SATB writing?</b>",
      try:{ type:"mc", choices:["The leading tone","The tonic","The dominant"], answer:0,
        success:"✓ Correct. The leading tone normally resolves upward to the tonic, so doubling it creates two strong tendency tones requiring resolution.",
        fail:"Which tone has the strongest pull to resolve?",
        hint:"It resolves up to the tonic." } },
    { say:"<b>Parallel Fifths and Octaves (introduction):</b> when two voices move together from one perfect <b>5th</b> (or <b>octave</b>) to another, their independence is weakened — so these parallels are normally avoided. You will study this more deeply later. \u{1F447} <b>Why are parallel perfect fifths normally avoided in common-practice SATB writing?</b>",
      try:{ type:"mc", choices:["They weaken the independence of the two voice lines","They automatically reduce the dynamic level","They change the key signature"], answer:0,
        success:"✓ Correct. Successive perfect fifths or octaves in similar motion can make two voices sound less independent.",
        fail:"Consider the effect of successive perfect intervals on melodic independence.",
        hint:"Track the same pair of voices through both chords." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which describes smoother voice leading between two chords?</b>",
      try:{ type:"mc", choices:["Hold the common tones and move the other voices by step","Leap every voice to a new register","Let the alto cross above the soprano"], answer:0,
        success:"✓ Correct. Held common tones plus stepwise motion in the other voices give the smoothest connection.",
        fail:"Which option keeps each line connected and in order?",
        hint:"Hold what is shared; step the rest." } }
  ],
  examples:[
    { caption:"I–IV–V–I with smooth voice leading (upper voices on one staff): common tones held, steps everywhere else, bass doing the leaping.",
      staff:{clef:"treble",tempo:69,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"C4",d:"w",label:"IV"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"B3",d:"w",label:"V"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:620},
      kb:{start:57,octaves:1.58,labels:true} },
    { caption:"Spacing on display: the first chord spreads the top voices too far (hollow); the second keeps S–A and A–T inside an octave (balanced). Hear the difference.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"hollow"},{p:"G4",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"single"},
        {p:"C4",d:"w",label:"balanced"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:420},
      kb:{start:57,octaves:1.58,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · SATB Guidelines (45s)",
      intro:"Identify SATB voices, working ranges, spacing, and basic voice-leading guidelines.",
      miaIntro:"Check range, spacing, crossing, and overlap.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["SATB","soprano, alto, tenor, bass"],
        ["Adjacent upper voices","within an octave"],
        ["Tenor–bass gap","may exceed an octave"],
        ["Voice crossing","forbidden — keep the order"],
        ["Common tone","hold it in the same voice"],
        ["Other voices","move by step when possible"],
        ["Parallel 5ths/octaves","avoided — independence dies"],
        ["The leaping voice","usually the bass"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — SATB guidelines identified!":null },
    { type:"order-tap", title:"Game 2 · Arrange the Voices",
      intro:"Arrange the SATB voices from highest to lowest.",
      miaIntro:"Soprano–alto–tenor–bass.",
      spec:{sequence:["Soprano — highest","Alto","Tenor","Bass — lowest"],
        title:"The four-voice stack"},
      result:(stars)=>stars>=2?"You arranged the voices correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Evaluate the Voicing",
      intro:"Examine each voicing for range, spacing, crossing, overlap, and doubling.",
      miaIntro:"Check every voice, not only the chord spelling.",
      spec:{rounds:6, pool:[
        {label:"Balanced spacing", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Hollow top (S–A over an octave)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G5",d:"w",chord:true}],width:150}},
        {label:"Common tone held (I→V)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"G4",d:"w"},{p:"B4",d:"w",chord:true}],width:170}},
        {label:"Leaping upper voices (rough)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"C5",d:"w",chord:true},{p:"A4",d:"w"},{p:"F5",d:"w",chord:true}],width:170}}]},
      result:(score)=>score>=5?"You evaluated the voicings correctly.":null },
    { type:"term-race", title:"Game 4 · Guideline or Misconception?",
      intro:"Distinguish common-practice SATB guidelines from inaccurate absolute statements.",
      miaIntro:"Remember that these guidelines are style-specific.",
      spec:{rounds:8, reverse:true, pool:[
        ["Keep common tones","real rule"],
        ["Move by step when possible","real rule"],
        ["Never let voices cross","real rule"],
        ["Avoid parallel perfect 5ths","real rule"],
        ["S–A within an octave","real rule"],
        ["Every voice must leap","myth"],
        ["The alto may top the soprano","myth"],
        ["Bass may sit far below tenor","real rule"]]},
      result:(score)=>score>=6?"You classified the statements correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on SATB ranges, spacing, crossing, overlap, doubling, tendency tones, and voice leading.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["S","soprano"],["A","alto"],["T","tenor"],["B","bass"],["Common tone","hold it"],["Step motion","the default"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{}, count:2 },
    { type:"mc", q:"SATB stands for…", choices:["soprano, alto, tenor, bass","strings and two brass","slow and then bright"], answer:0,
      explain:"SATB stands for soprano, alto, tenor, and bass." },
    { type:"mc", q:"Adjacent upper voices should stay within…", choices:["an octave","a 3rd","two octaves"], answer:0,
      explain:"Soprano–alto and alto–tenor normally remain within an octave." },
    { type:"mc", q:"Which voice pair may be spaced beyond an octave?", choices:["Tenor and bass","Soprano and alto","Alto and tenor"], answer:0,
      explain:"Tenor–bass spacing may exceed an octave within practical vocal ranges." },
    { type:"mc", q:"When two chords share a pitch, an efficient option is to…", choices:["retain it in the same voice when practical","move it by octave automatically","omit it automatically"], answer:0,
      explain:"Common-tone retention." },
    { type:"truefalse", q:"Voice crossing occurs when a lower voice moves above an adjacent higher voice, or a higher voice moves below an adjacent lower voice.", answer:true,
      explain:"Crossing is any reversal of the normal order of adjacent voices." },
    { type:"truefalse", q:"Parallel perfect fifths are normally avoided in common-practice SATB writing.", answer:true,
      explain:"They weaken the independence of the two voices." },
    { type:"truefalse", q:"In root-position chorale-style progressions, the bass often uses larger intervals than the upper voices.", answer:true,
      explain:"The bass frequently presents chord roots, but its line should remain coherent and singable." },
    { gen:"term-match", params:{subject:"term", pool:[["Crossing","forbidden swap"],["Parallel 5ths","independence lost"],["Spacing","octave rule up top"],["Bass","the leaper"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"SATB", def:"Soprano, Alto, Tenor, Bass."},
    {term:"Voice Leading", def:"Move each voice as smoothly as possible. Keep common tones. Prefer stepwise motion."},
    {term:"Spacing", def:"S–A and A–T normally stay within one octave. T–B may exceed an octave."},
    {term:"Voice Independence", def:"Avoid voice crossing, parallel fifths, and parallel octaves."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>SATB</b> = Soprano, Alto, Tenor, Bass.",
    "✔ Keep <b>common tones</b> whenever possible.",
    "✔ Move voices mostly <b>by step</b>.",
    "✔ Avoid <b>voice crossing</b>.",
    "✔ <b>Root doubling</b> is usually safest.",
    "✔ Avoid doubling the <b>leading tone</b>.",
    "✔ <b>Parallel fifths and octaves</b> weaken voice independence."
  ],
  tips:[
    "Write the outer voices (S and B) first — if they sound good together, the middle fills easily.",
    "Check parallels the mechanical way: find every P5/P8 pair, then look one chord ahead.",
    "Piano players: practice I-IV-V-I holding common tones — your hands learn voice leading before your eyes do.",
    "Next lesson: dominants that point at chords OTHER than I — secondary dominants."
  ],
  rewards:{ badge:"Part Writer", icon:"\u{1F465}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Check range, spacing, common tones, tendency tones, crossing, overlap, and parallel perfect intervals.",
  quiz:[
    { type:"mc", q:"The four voices, high to low:", choices:["S, A, T, B","B, T, A, S","S, T, A, B"], answer:0,
      explain:"Soprano to bass.", hint:"The acronym." },
    { type:"mc", q:"In keyboard-style notation, which voices share the treble staff?", choices:["Soprano and alto","Tenor and bass","Alto and tenor"], answer:0,
      explain:"S stems up, A stems down.", hint:"The top pair." },
    { type:"mc", q:"The octave spacing guideline applies to…", choices:["adjacent upper voices (S–A, A–T)","tenor and bass","all pairs equally"], answer:0,
      explain:"The bass is exempt.", hint:"Up top only." },
    { type:"mc", q:"Voice crossing is…", choices:["a voice moving past its neighbor — avoided","a good blending technique","required at cadences"], answer:0,
      explain:"It reverses the normal order of adjacent voices.", hint:"S above A above T above B." },
    { type:"mc", q:"Two consecutive chords share the pitch E. Which choice often creates efficient voice leading?", choices:["Retain E in the same voice when practical","Move E up an octave automatically","Omit E automatically"], answer:0,
      explain:"Common-tone retention.", hint:"The anchor note." },
    { type:"mc", q:"When no common tone can be retained, the upper voices should generally…", choices:["use the smallest singable motions that satisfy harmonic and tendency-tone requirements","leap as far as possible","move in parallel octaves"], answer:0,
      explain:"Smallest singable motion, within harmonic and tendency-tone requirements.", hint:"Small, singable motion." },
    { type:"mc", q:"Why are parallel perfect fifths and octaves normally avoided in common-practice SATB writing?", choices:["They weaken the perceptual independence of the voices","They are highly dissonant","They are impossible to sing"], answer:0,
      explain:"Successive perfect intervals reduce the independence of the two lines.", hint:"Independence." },
    { type:"mc", q:"In root-position chorale-style progressions, which voice often makes larger leaps because it presents chord roots?", choices:["The bass","The alto","The soprano"], answer:0,
      explain:"Root motion lives downstairs.", hint:"The foundation." },
    { type:"truefalse", q:"The standard working ranges of alto and soprano overlap, although the alto generally occupies a lower tessitura.", answer:true,
      explain:"Their ranges overlap; the alto simply sits lower on average.", hint:"Ranges overlap." },
    { type:"truefalse", q:"Good voice leading always moves each voice by the smallest mathematically possible interval.", answer:false,
      explain:"Efficient motion matters, but tendency tones, melodic shape, spacing, independence, and harmonic function also apply.", hint:"Not purely mathematical." },
    { type:"mc", q:"In introductory SATB chorale writing, soprano and alto separated by a tenth normally violate which guideline?", choices:["Upper-voice spacing","Vocal order","Harmonic rhythm"], answer:0,
      explain:"Upper pairs stay within the octave.", hint:"Count the gap." },
    { type:"mc", q:"Which chord member should normally not be doubled in introductory common-practice SATB writing?", choices:["The leading tone","The tonic","A stable chord root"], answer:0,
      explain:"The leading tone has a strong tendency to resolve upward to the tonic.", hint:"The tone that pulls to tonic." }
  ],
  miaPerfect:"Perfect score! You accurately applied the introductory SATB voice-leading guidelines.",
  miaPass:"You passed! Next, you will study secondary dominants.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version B held the common tone and stepped the rest — voice leading: smallest useful motion per voice.",
      play:()=>{[48,64,67,72].forEach(m=>MFAudio.tone(m,.9,.05,.26));[53,65,69,72].forEach(m=>MFAudio.tone(m,1.0,1.0,.26));} },
    learn:{ label:"voice leading",
      explain:"SATB ranges; S–A/A–T within an octave; no crossing; hold common tones, step the rest; avoid parallel 5ths/octaves.",
      hint:"Hold, step, don't cross.",
      play:()=>{[48,64,67,72].forEach(m=>MFAudio.tone(m,.8,.05,.26));[47,62,67,74].forEach(m=>MFAudio.tone(m,.9,.95,.26));} },
    example:{ label:"the examples",
      explain:"Example 1 voice-leads I-IV-V-I with held common tones; example 2 contrasts balanced vs hollow spacing." },
    game:{ label:"the games",
      explain:"Sprint the rules, stack the choir, judge voicings on cards, then separate rules from myths.",
      hint:"Smoothness is the goal." },
    quiz:{ label:"this question",
      explain:"The checklist: ranges ok? spacing within octaves up top? order uncrossed? common tones held? parallels avoided?",
      play:()=>{[48,64,67,72].forEach(m=>MFAudio.tone(m,.9,.05,.26));} }
  }
};
