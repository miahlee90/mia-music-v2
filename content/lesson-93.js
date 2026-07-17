/* Lesson 93 — Lead Sheet Reading (Chord Symbols) (Book 4, Unit 23 — SELF-AUTHORED)
   Core: reading/writing chord symbols: C, Cm, C+, C°, Cmaj7, Cm7, C7,
   Cm7b5, Cdim7, Csus4, Csus2, Cadd9, slash chords (C/E).
   NOTE: edit by FULL-FILE REWRITE only. */

/* symbol-to-sound: read a symbol, pick its notes */
function MF_L93_read(container,fb){
  const ROUNDS=[
    {sym:"C", notes:[60,64,67], names:["C-E-G (major triad)","C-E♭-G (minor triad)","C-E-G-B♭"]},
    {sym:"Cm", notes:[60,63,67], names:["C-E♭-G (minor triad)","C-E-G (major triad)","C-E-G-B"]},
    {sym:"C7", notes:[60,64,67,70], names:["C-E-G-B♭ (dominant 7)","C-E-G-B (major 7)","C-E♭-G-B♭ (minor 7)"]},
    {sym:"Cmaj7", notes:[60,64,67,71], names:["C-E-G-B (major 7)","C-E-G-B♭ (dominant 7)","C-E♭-G-B♭ (minor 7)"]},
    {sym:"Cm7♭5", notes:[60,63,66,70], names:["C-E♭-G♭-B♭ (half-diminished)","C-E♭-G-B♭ (minor 7)","C-E-G-B (major 7)"]},
    {sym:"Csus4", notes:[60,65,67], names:["C-F-G (4 replaces the 3rd)","C-E-G (major triad)","C-D-G (sus2)"]},
    {sym:"Cadd9", notes:[60,64,67,74], names:["C-E-G-D (triad + added 9th)","C-D-G (9 replaces the 3rd)","C-E-G (plain triad)"]},
    {sym:"C/E", notes:[52,60,64,67], names:["C chord with E in the bass","C chord, root position","E minor chord"]}];
  let r=0;
  container.innerHTML=`<div class="big-q l93r-q" style="text-align:center"></div>
    <div class="choices l93r-ch"></div>`;
  const q=container.querySelector(".l93r-q"), ch=container.querySelector(".l93r-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! Every symbol decoded."; ch.innerHTML=""; return; }
    const R=ROUNDS[r];
    q.innerHTML=`Symbol ${r+1} of ${ROUNDS.length}: what does <b>${R.sym}</b> mean?`;
    ch.innerHTML="";
    R.names.forEach((name,i)=>{
      const b=document.createElement("button"); b.textContent=name;
      b.onclick=()=>{
        const R2=ROUNDS[r];
        if(i===0){ R2.notes.forEach(m=>MFAudio.tone(m,.9,.05,.28)); fb(true,`✓ ${R2.sym} = ${R2.names[0]}.`); r++; setTimeout(ask,1300); }
        else { MFAudio.tone(40,.2); fb(false,"Decode the parts: root letter, quality, number, and any slash."); }
      };
      ch.appendChild(b);
    });
  }
  ask();
}

LESSON_CONTENT[93]={stackFigures:true,
  welcome:"Learn to read and decode the chord symbols on a lead sheet.",
  hook:{
    say:"<b>A lead sheet presents a melody with chord symbols such as Cmaj7, Am7, and G7.</b> \u{1F447} <b>What information do the chord symbols communicate?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Hear Cmaj7 → Am7 → G7 → C</button></div>
          <div class="choices hk-ch" style="display:none"><button>Each chord's root, quality, and added chord members</button><button>Only the melody</button><button>The lyrics</button></div>`;
        const ROWS=[[60,64,67,71],[57,60,64,67],[55,59,62,65],[60,64,67,72]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.26))); setTimeout(()=>ch.style.display="",ROWS.length*850+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. A lead-sheet symbol identifies the chord's root, quality, and extensions or alterations. It may also specify a bass note. The performer chooses an appropriate voicing and rhythmic realization.");
          else fb(false,"The symbols identify the chord content. Which parts of the symbols indicate the root, quality, and extensions?");
        });
      } }
  },
  objectives:[
    "Decode chord symbols from left to right",
    "Identify root, quality, extensions, alterations, and bass notes",
    "Recognize the most common lead-sheet symbols",
    "Distinguish triads, seventh chords, suspended, added-tone, and slash chords",
    "Read real chord symbols used in pop, jazz, worship, and commercial music"
  ],
  steps:[
    { say:"<b>Chord-Symbol Anatomy:</b> read every symbol <b>left to right</b> — root → quality → number/extension → alteration → bass. For example, <b>Cmaj7♯11/E</b> decodes to root <b>C</b>, <b>major</b> quality, <b>maj7</b> extension, <b>♯11</b> alteration, <b>E</b> in the bass. This lesson is about <b>decoding</b> symbols you already know the harmony for. \u{1F447} <b>In Cm7, what does the \u{201C}m\u{201D} indicate?</b>",
      show:{ type:"html", html:`<div style="text-align:center;margin:2px 0">
        <div style="font-size:23px;font-weight:800;color:#2F6DA8;margin-bottom:8px">Cmaj7♯11/E</div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;font-size:12.5px">
          <div style="border:2px solid #2F6DA8;border-radius:8px;padding:6px 12px"><b>Root</b><br>C</div>
          <div style="border:2px solid #A9821F;border-radius:8px;padding:6px 12px"><b>Quality</b><br>major</div>
          <div style="border:2px solid #A9821F;border-radius:8px;padding:6px 12px"><b>Extension</b><br>maj7</div>
          <div style="border:2px solid #C05A21;border-radius:8px;padding:6px 12px"><b>Alteration</b><br>♯11</div>
          <div style="border:2px solid #2F6DA8;border-radius:8px;padding:6px 12px"><b>Bass</b><br>E</div></div>
        <div style="font-size:12px;color:#555;margin-top:7px">Decode left → right</div></div>` },
      try:{ type:"mc", choices:["The underlying triad is minor","The chord should be played quietly","The meter changes"], answer:0,
        success:"✓ Correct. The \u{201C}m\u{201D} identifies a minor triad, and the complete symbol Cm7 represents a minor seventh chord.",
        fail:"Read the quality symbol immediately following the root.",
        hint:"\u{201C}m\u{201D} stands for minor." } },
    { say:"<b>Common Lead-Sheet Symbols:</b> these appear constantly in <b>jazz, worship, pop, and commercial</b> charts. You only need to <b>recognize and decode</b> them — not master advanced voicings yet. Note: <b>7</b> after a bare root = dominant (major triad + minor 7th); a major 7th must say <b>maj7</b>. \u{1F447} <b>What chord does C7 represent?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto 8px;font-size:13px;min-width:320px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px;text-align:left">Category</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px;text-align:left">Symbols (on C)</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#2F6DA8">Triads</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C · Cm · C+ · C°</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#A9821F">Sevenths</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">Cmaj7 · C7 · Cm7 · Cm7♭5 (ø7) · C°7</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800;color:#C05A21">Suspended</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">Csus2 · Csus4 · C7sus4</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800">Added tones</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C6 · Cm6 · Cadd9</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800">Extensions</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C9 · C13</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;font-weight:800">Altered</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px">C7♯5 · C7♭5 · C7♭9 · C7♯9 · Cmaj7♯11</td></tr></table>
        <div style="font-size:12.5px;color:#333;max-width:360px;margin:0 auto;line-height:1.7">
        <b>Seventh formulas:</b> maj7 = major triad + major 7th · 7 = major triad + minor 7th · m7 = minor triad + minor 7th · ø7 = diminished triad + minor 7th · °7 = diminished triad + diminished 7th</div>` },
      try:{ type:"mc", choices:["C dominant seventh: C-E-G-B♭","C major seventh: C-E-G-B","C minor triad: C-E♭-G"], answer:0,
        success:"✓ Correct. A bare root followed by 7 indicates a dominant-seventh-quality chord. Use Cmaj7 to indicate a major seventh.",
        fail:"Compare C7 with Cmaj7.",
        hint:"C7 contains B♭; Cmaj7 contains B♮." } },
    { say:"<b>Suspended Chords:</b> a suspended chord is <b>neither major nor minor because the 3rd is replaced</b>. In <b>sus4</b>, the 4th replaces the 3rd (Csus4 = C-F-G); in <b>sus2</b>, the 2nd replaces the 3rd (Csus2 = C-D-G). The sus tone may resolve to the 3rd, but many styles leave it unresolved. \u{1F447} <b>In Csus4, which chord member replaces the third?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"Csus4"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:400} },
      try:{ type:"mc", choices:["The fourth","The root","The fifth"], answer:0,
        success:"✓ Correct. F, the fourth above C, replaces E, the third. In some contexts, F may resolve to E.",
        fail:"A suspended chord omits the third and replaces it with the second or fourth.",
        hint:"In sus4, the fourth replaces the third." } },
    { say:"<b>Added-Tone Chords:</b> an <b>add</b> chord keeps the whole triad and adds a note. <b>Cadd9 = C-E-G-D</b> (3rd stays, 9th added). <b>C6 = C-E-G-A</b> (adds the 6th). Don't confuse <b>Cadd9</b> with <b>Csus2 = C-D-G</b>: in sus2 the 2nd <i>replaces</i> the 3rd (no E), while add9 <i>keeps</i> the 3rd. \u{1F447} <b>Which pitch classes belong to Cadd9?</b>",
      try:{ type:"mc", choices:["C-E-G plus D","C-D-G without E","C-E-G-B"], answer:0,
        success:"✓ Correct. Cadd9 retains the complete C major triad and adds D.",
        fail:"An added-tone symbol retains the basic triad unless the symbol indicates otherwise.",
        hint:"Complete triad plus one added pitch." } },
    { say:"<b>Slash Chords:</b> the chord is <b>before</b> the slash, the <b>bass note after</b> it. <b>C/E</b> = C major with E in the bass — E is the 3rd, so this is <b>first inversion</b>. But <b>C/D</b> = C major over a D bass — D is <b>not</b> a chord tone, so it is <b>NOT an inversion</b>, just C harmony with D in the bass. \u{1F447} <b>What does G/B mean?</b>",
      try:{ type:"mc", choices:["A G major chord with B in the bass","A B major chord with G in the soprano","Two separate chords performed one after another"], answer:0,
        success:"✓ Correct. G is the chord root, and B is the bass pitch. Because B is the third of G major, the chord is in first inversion.",
        fail:"Read the chord before the slash and the bass note after it.",
        hint:"Chord/bass." } },
    { say:"Decode each chord symbol and identify its chord members and bass note. \u{1F447}",
      try:{ type:"custom",
        hint:"Read the root, quality, extension or alteration, and specified bass note.",
        mount:(container,fb)=>MF_L93_read(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>Which symbol contains a sharp 11 (♯11)?</b>",
      try:{ type:"mc", choices:["Cmaj7♯11","C7♭9","Csus4"], answer:0,
        success:"✓ Correct. Cmaj7♯11 carries the ♯11 alteration; C7♭9 has a ♭9, and Csus4 has no alteration.",
        fail:"Look for the symbol whose alteration reads \u{201C}♯11\u{201D}.",
        hint:"Read the alteration part of each symbol." } }
  ],
  examples:[
    { caption:"A lead-sheet progression realized: Cmaj7 · Am7 · Dm7 · G7 — the symbols above, the sounding chords below.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"Cmaj7"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"A3",d:"w",label:"Am7"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"Dm7"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G3",d:"w",label:"G7"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:48,octaves:2,labels:true} },
    { caption:"Sus resolving: Gsus4 → G → C. The suspended 4th (C) steps down to the 3rd (B) — tension released before the cadence.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"G3",d:"w",label:"Gsus4"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},
        {p:"G3",d:"w",label:"G"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},
        {p:"C4",d:"w",label:"C"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:480},
      kb:{start:48,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Chord-Symbol Sprint (45s)",
      intro:"Translate each chord symbol into its pitch content.",
      miaIntro:"Root, quality, extension, and bass.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["C7","dominant 7 (C-E-G-B\u{266D})"],
        ["Cmaj7","major 7 (C-E-G-B)"],
        ["Cm7","minor 7 (C-E\u{266D}-G-B\u{266D})"],
        ["Cm7\u{266D}5","half-diminished 7"],
        ["Cdim7","diminished 7"],
        ["Csus4","4th replaces the 3rd"],
        ["Cadd9","triad + 9th, nothing removed"],
        ["C/E","C chord, E in the bass"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Chord-symbol challenge completed!":null },
    { type:"key-climb", title:"Game 2 · Perform a Suspension",
      intro:"Play Csus4 followed by C major. Listen as F moves down to E.",
      miaIntro:"Move the fourth down to the third.",
      spec:{seq:[60,65,67, 60,64,67],
        names:["C (root)","F (the sus 4!)","G (5th)","C","E (the 3rd returns)","G"],
        start:60, octaves:1, title:"Csus4 resolving to C"},
      result:(score)=>score!==null?"You performed the sus4-to-major resolution.":null },
    { type:"symbol-hunt", title:"Game 3 · Match Symbols and Pitches",
      intro:"Examine the pitch collections and select the one represented by each chord symbol.",
      miaIntro:"Identify the root and every indicated chord member.",
      spec:{rounds:6, pool:[
        {label:"Csus4 (C-F-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Cadd9 (C-E-G-D)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"C/E (E in the bass)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Cm7 (C-E♭-G-B♭)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You matched the symbols and pitch collections correctly.":null },
    { type:"term-race", title:"Game 4 · Chord-Symbol Components",
      intro:"Identify the function of each component in a chord symbol.",
      miaIntro:"Root → quality → extension or alteration → bass.",
      spec:{rounds:8, reverse:true, pool:[
        ["A bare letter (C)","major triad"],
        ["m after the root","minor triad"],
        ["7 after a bare root","dominant type"],
        ["maj7","major 7th type"],
        ["\u{266D}5","lower the 5th"],
        ["sus4","4th replaces the 3rd"],
        ["add9","add the 9th, keep the 3rd"],
        ["/E","E in the bass"]]},
      result:(score)=>score>=6?"You interpreted the chord-symbol components correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on reading, writing, and realizing lead-sheet chord symbols. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["C","major triad"],["Cm","minor triad"],["C7","dominant 7"],["Cmaj7","major 7"],["Csus4","4 replaces 3"],["C/G","G in the bass"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{}, count:2 },
    { type:"mc", q:"A bare root letter such as F normally represents…", choices:["F major triad","F minor triad","F dominant 7"], answer:0,
      explain:"No suffix = major triad." },
    { type:"mc", q:"Am represents…", choices:["A minor triad","A major","A augmented"], answer:0,
      explain:"m = minor." },
    { type:"mc", q:"When 7 follows a bare root, as in G7, it indicates…", choices:["a dominant-seventh-quality chord","the major-seventh type","a 7-note chord"], answer:0,
      explain:"maj7 must be written out." },
    { type:"mc", q:"Dsus4 contains…", choices:["D-G-A","D-F♯-A","D-F-A"], answer:0,
      explain:"G replaces the third, F♯." },
    { type:"truefalse", q:"An add9 chord removes the third of the triad.", answer:false,
      explain:"An add9 chord retains the third and adds the ninth." },
    { type:"truefalse", q:"C/E represents a C major chord with E as the bass note.", answer:true,
      explain:"Because E is the third of C major, C/E is a first-inversion C major chord." },
    { type:"truefalse", q:"Cm7♭5 and Cø7 represent the same chord quality and pitch collection.", answer:true,
      explain:"Two spellings, one half-diminished chord." },
    { gen:"term-match", params:{subject:"term", pool:[["Gsus2","G-A-D"],["C6","C-E-G-A"],["Cdim7","\u{00B0}7 chord"],["F/A","F chord, A bass"]], reverse:true}, count:3 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Lead Sheet", def:"A melody with chord symbols. The symbols tell you WHAT harmony to play, not exactly HOW to voice it."},
    {term:"Chord Symbol Anatomy", def:"Read left → right: <b>Root → Quality → Number/Extension → Alteration → Bass</b>. e.g. C · Cm · Cmaj7 · C7 · Csus4 · Cadd9 · C13 · C7♯9 · Cmaj7♯11 · C/E."},
    {term:"Suspended vs Added", def:"<b>sus2 / sus4</b> replace the 3rd. <b>add9</b> keeps the 3rd."},
    {term:"Slash Chord", def:"Chord before the slash, BASS note after it. C/E · C/G · C/B · C/D."}
  ],
  mistakes:[],
  summary:[
    "✔ Read chord symbols left to right: <b>Root → Quality → Number/Extension → Alteration → Bass</b>.",
    "✔ No quality symbol = <b>major triad</b>.",
    "✔ \u{201C}7\u{201D} alone means <b>dominant seventh</b>.",
    "✔ \u{201C}maj7\u{201D} must be written explicitly.",
    "✔ <b>sus</b> replaces the 3rd.",
    "✔ <b>add</b> keeps the 3rd.",
    "✔ A <b>slash</b> names the bass note.",
    "✔ Chord symbols describe harmony — not exact voicing."
  ],
  tips:[
    "Realize lead sheets root-position first; add slash-chord bass notes once the changes flow.",
    "A sus4 often resolves: let the 4th fall to the 3rd to hear the classic resolution — though many styles leave it unresolved.",
    "Jazz charts often write △7 for maj7 and ø for m7♭5 — same chords, alternate dress.",
    "Next lesson: sevenths turned upside down — inversions of seventh chords."
  ],
  rewards:{ badge:"Chart Reader", icon:"\u{1F4DD}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Read the root, quality, extension or alteration, and specified bass note.",
  quiz:[
    { type:"mc", q:"A bare root letter such as C normally represents…", choices:["a major triad","a minor triad","a seventh chord"], answer:0,
      explain:"C = C-E-G.", hint:"No suffix needed." },
    { type:"mc", q:"What does a lowercase \u{201C}m\u{201D} immediately after the root indicate?", choices:["Minor quality","Major-seventh quality","Muted articulation"], answer:0,
      explain:"Cm = C-E♭-G.", hint:"Lowercase quality." },
    { type:"mc", q:"What does G7 represent?", choices:["G dominant seventh","G major seventh","G plus seven additional notes"], answer:0,
      explain:"After a bare root, 7 indicates the dominant-seventh type.", hint:"The default 7." },
    { type:"mc", q:"Which symbol represents an F major seventh chord?", choices:["Fmaj7","F7","Fm7"], answer:0,
      explain:"maj must be explicit.", hint:"Say it fully." },
    { type:"mc", q:"Which pitches form Csus4?", choices:["C-F-G","C-E-G","C-D-E"], answer:0,
      explain:"4 replaces 3.", hint:"The fourth, F, replaces the third, E." },
    { type:"mc", q:"Which pitch classes form Cadd9?", choices:["C-E-G-D","C-D-G","C-E-G-B"], answer:0,
      explain:"Triad intact + 9th.", hint:"Nothing removed." },
    { type:"mc", q:"What does C/G indicate?", choices:["A C major chord with G in the bass","A G major chord with C in the soprano","Separate C and G chords"], answer:0,
      explain:"Because G is the fifth of the C major triad, C/G represents second inversion.", hint:"Slash = bass." },
    { type:"mc", q:"Which pair represents the same chord?", choices:["Cm7♭5 and Cø7","C7 and Cmaj7","Csus4 and Cadd9"], answer:0,
      explain:"Half-diminished, two spellings.", hint:"Lesson 92's ø." },
    { type:"mc", q:"Which chord symbol represents A-C-E-G?", choices:["Am7","Amaj7","A7"], answer:0,
      explain:"Minor triad + minor 7th.", hint:"Check the 3rd: C natural." },
    { type:"truefalse", q:"A sus2 or sus4 chord omits the third and therefore is not classified as a major or minor triad.", answer:true,
      explain:"Major and minor triad quality is determined by the third, which is absent from a sus chord.", hint:"What did sus remove?" },
    { type:"truefalse", q:"In C6, the added sixth replaces the fifth of the triad.", answer:false,
      explain:"C6 contains C-E-G-A; the fifth remains in the chord.", hint:"Add, not replace." },
    { type:"mc", q:"A lead sheet contains Dm7 → G7 → Cmaj7. In C major, how is this progression analyzed?", choices:["ii⁷–V⁷–Imaj7","A twelve-bar blues progression","A plagal cadence"], answer:0,
      explain:"Dm7, G7, and Cmaj7 are the diatonic seventh chords rooted on scale degrees 2, 5, and 1 in C major.", hint:"Count the degrees in C." }
  ],
  miaPerfect:"Perfect score! You accurately decoded and realized the lead-sheet chord symbols.",
  miaPass:"You passed! Next, you will study inversions of seventh chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Four symbols became four chords: root + quality + number (+ slash) identifies the chord content; the player chooses the voicing and rhythm.",
      play:()=>{const ROWS=[[60,64,67,71],[57,60,64,67],[55,59,62,65],[60,64,67,72]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.26)));} },
    learn:{ label:"lead sheet symbols",
      explain:"Root → quality (m/+/°) → number (7 after a bare root = dominant) → extras (♭5, sus, add, /bass). sus replaces the 3rd; add keeps it.",
      hint:"Left to right.",
      play:()=>{[60,65,67].forEach(m=>MFAudio.tone(m,.7,.05,.3));[60,64,67].forEach(m=>MFAudio.tone(m,.8,.9,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 realizes a Cmaj7-Am7-Dm7-G7 chart; example 2 resolves Gsus4 into G, then home to C." },
    game:{ label:"the games",
      explain:"Sprint the symbols, resolve a sus by hand, match symbols to staff chords, then master the grammar.",
      hint:"7 after a bare root = dominant." },
    quiz:{ label:"this question",
      explain:"Parse every symbol the same way: root letter, quality suffix, number, then alterations and the slash-bass.",
      play:()=>{[57,60,64,67].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
