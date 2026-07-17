/* Lesson 48 — Primary and Major Triads (AEMT Book 2, Unit 12)
   Built from drafts/UNIT 12 – Lesson 48.md; AEMT p.75 verified by render.
   Core: primary triads = built on degrees 1, 4, 5 → Roman numerals I, IV, V;
   in C major: C (C-E-G), F (F-A-C), G (G-B-D); they contain every scale tone.
   Major triad recipe: root + MAJOR 3rd + PERFECT 5th (or M3 + m3 stacked).
   NOTE: edit by FULL-FILE REWRITE only. */

/* primary picker: press the keyboard root of each requested primary triad, hear it ring */
function MF_L48_primary(container,fb){
  const ROUNDS=[
    {ask:"I",root:"C",m:[60,64,67]},
    {ask:"IV",root:"F",m:[65,69,72]},
    {ask:"V",root:"G",m:[67,71,74]},
    {ask:"V",root:"G",m:[67,71,74],switch:true},
    {ask:"I",root:"C",m:[60,64,67],switch:true}];
  let i=0,kb=null;
  container.innerHTML=`<div class="big-q l48-q" style="text-align:center"></div><div class="l48-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">Key of C major: I sits on degree 1, IV on degree 4, V on degree 5.</p>`;
  const q=container.querySelector(".l48-q"), kbHolder=container.querySelector(".l48-kb");
  function ask(){
    q.innerHTML=`Chord ${i+1} of ${ROUNDS.length}: in C major, press the ROOT of the <b>${ROUNDS[i].ask}</b> chord.`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:2,labels:true,
      onKey:m=>{
        const c=ROUNDS[i];
        /* either octave of the root is correct - the triad rings in that octave */
        if((m-c.m[0])%12===0 && m+(c.m[2]-c.m[0])<=84){
          const off=m-c.m[0];
          kb.mark(c.m.map(x=>x+off)); c.m.forEach(x=>MFAudio.tone(x+off,.9,.1,.4)); i++;
          if(i>=ROUNDS.length){ q.textContent="I, IV, V — under your fingers!";
            fb(true,`✓ ${c.ask} = the ${c.root} triad. The three primary chords of C major: C (I), F (IV), G (V) — you just played the backbone of a thousand songs.`); }
          else { fb(true,`✓ ${c.ask} = ${c.root} (${c.root} triad). Next…`); setTimeout(ask,1500); } }
        else { MFAudio.tone(40,.2); fb(false,`Count scale degrees from C: ${c.ask==="I"?"degree 1":"degree "+(c.ask==="IV"?"4":"5")}.`); }
      }});
  }
  ask();
}

/* major-triad X-ray: M3 + m3 stack checker */
function MF_L48_xray(container,fb){
  const ROUNDS=[
    {q:"The lower 3rd of a MAJOR triad — root up to 3rd — is a…",opts:["Major 3rd (4 half steps)","minor 3rd (3 half steps)","Perfect 4th"],a:0,exp:"Major on the bottom."},
    {q:"The upper 3rd — 3rd up to 5th — is a…",opts:["minor 3rd (3 half steps)","Major 3rd (4 half steps)","Major 2nd"],a:0,exp:"Minor on top."},
    {q:"Root all the way to the 5th spans a…",opts:["Perfect 5th (7 half steps)","Major 5th","diminished 5th"],a:0,exp:"4 + 3 = 7 half steps = P5."},
    {q:"So the full major-triad recipe is…",opts:["root + Major 3rd + Perfect 5th","root + minor 3rd + Perfect 5th","root + Major 3rd + Major 5th"],a:0,exp:"M3 above the root, P5 above the root."}];
  let i=0;
  container.innerHTML=`<div class="big-q l48-xq" style="text-align:center"></div><div class="choices chips l48-xch"></div>`;
  const q=container.querySelector(".l48-xq"), ch=container.querySelector(".l48-xch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Check ${i+1} of ${ROUNDS.length}: ${cur.q}`;
    ch.innerHTML="";
    cur.opts.map((o,oi)=>({o,oi})).sort(()=>Math.random()-.5).forEach(({o,oi})=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const c=ROUNDS[i];
        if(oi===c.a){ i++; MFAudio.yay();
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="Check complete — the major triad has no secrets!";
            fb(true,`✓ ${c.exp} Both recipes agree: (M3 + m3 stacked) = (root + M3 + P5).`); }
          else { fb(true,`✓ ${c.exp}`); setTimeout(ask,1100); } }
        else { MFAudio.tone(40,.2); fb(false,"Count half steps: C→E is 4, E→G is 3, C→G is 7."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[48]={
  welcome:"Three chords rule every key: I, IV, and V — the primary triads. \u{1F451}",
  hook:{
    say:"Thousands of songs use just THREE chords. Listen to this classic progression. <b>How many different chords did you hear?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ The three-chord magic</button></div>
          <div class="choices hk-ch" style="display:none"><button>Three chords</button><button>One chord repeated</button><button>Seven chords</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          const CH=[[60,64,67],[65,69,72],[67,71,74],[60,64,67]];
          CH.forEach((c,k)=>c.forEach(m=>MFAudio.tone(m,.7,k*.8,.35)));
          setTimeout(()=>ch.style.display="",3600);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ C… F… G… C — three different triads (and home again). They're the PRIMARY TRIADS: I, IV, V — built on scale degrees 1, 4, and 5. Folk, rock, country, hymns: this trio runs them all.");
          else fb(false,"Listen again — the harmony moves to a new place twice before coming home.");
        });
      } }
  },
  objectives:[
    "Identify the primary triads: degrees 1, 4, 5",
    "Use Roman numerals I, IV, V",
    "Name the primary triads of C major: C, F, G",
    "Explain why they're MAJOR triads (root + M3 + P5)",
    "Stack a major triad as M3 + m3",
    "Know that I, IV, V contain every scale tone"
  ],
  steps:[
    { say:"The most important triads of any key grow on scale degrees <b>1, 4, and 5</b> — the <b>PRIMARY TRIADS</b> (or primary chords), labeled with <b>ROMAN NUMERALS: I, IV, V</b>. \u{1F447} <b>The primary triads are built on which degrees?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",x:140,label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",x:310,label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",x:480,label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:580} },
      try:{ type:"mc", choices:["1, 4, and 5","1, 2, and 3","1, 3, and 5"], answer:0,
        success:"✓ Degrees 1, 4, 5 → chords I, IV, V. (1-3-5 spells one triad's INSIDES; 1-4-5 locates three different triads!)",
        fail:"Careful — 1-3-5 is a triad's spelling, not the primary LOCATIONS.",
        hint:"The Roman numerals say it: I, IV, V." } },
    { say:"In the key of <b>C major</b>: the <b>I</b> chord is the <b>C triad</b> (C-E-G), the <b>IV</b> chord is the <b>F triad</b> (F-A-C), and the <b>V</b> chord is the <b>G triad</b> (G-B-D). \u{1F447} <b>In C major, the IV chord is…?</b>",
      try:{ type:"mc", choices:["The F triad (F-A-C)","The G triad (G-B-D)","The D triad (D-F-A)"], answer:0,
        success:"✓ Degree 4 of C major is F → IV = F-A-C.",
        fail:"Count up from C: C(1) D(2) E(3) …(4).",
        hint:"C-D-E-F: the 4th letter." } },
    { say:"Find them on the keyboard. \u{1F447} <b>Press each primary chord's root and hear the triad ring:</b>",
      try:{ type:"custom",
        hint:"I = C, IV = F, V = G — degrees 1, 4, 5.",
        mount:(container,fb)=>MF_L48_primary(container,fb) } },
    { say:"Why do these three sound so bright? They are <b>MAJOR TRIADS</b>: each is a <b>root + MAJOR 3rd + PERFECT 5th</b> — your Unit 9 intervals at work! \u{1F447} <b>Check the major triad, one 3rd at a time:</b>",
      try:{ type:"custom",
        hint:"C→E = 4 half steps; E→G = 3; C→G = 7.",
        mount:(container,fb)=>MF_L48_xray(container,fb) } },
    { say:"The second recipe: a major triad is also a <b>minor 3rd stacked on TOP of a Major 3rd</b>. M3 as the lower 3rd, m3 as the upper 3rd — 4 + 3 = 7 half steps, a perfect 5th from root to top. \u{1F447} <b>Which stack builds a MAJOR triad?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"M3 below"},{from:1,to:2,label:"m3 on top"}],width:240},
        kb:{start:60,octaves:1,labels:true,marks:[60,64,67]} },
      try:{ type:"mc", choices:["Major 3rd on the bottom, minor 3rd on top","Minor 3rd on the bottom, Major 3rd on top","Two Major 3rds"], answer:0,
        success:"✓ M3 + m3, in that order. (Flip the two 3rds and you get a MINOR triad — a story for Lesson 58!)",
        fail:"Which 3rd was 4 half steps? Lower or upper?",
        hint:"C→E (4), then E→G (3)." } },
    { say:"One more remarkable fact: <b>the three primary triads together contain EVERY tone of the major scale.</b> C-E-G + F-A-C + G-B-D = C, D, E, F, G, A, B — the whole scale! That's why three chords can harmonize practically any melody. \u{1F447} <b>Which scale tone is missing from I, IV, and V combined?</b>",
      try:{ type:"mc", choices:["None — all seven tones are covered","D — no chord contains it","B — no chord contains it"], answer:0,
        success:"✓ All seven! (D lives in V, B lives in V, A lives in IV…) One trio, complete coverage — the secret of three-chord songs.",
        fail:"Check V (G-B-D) and IV (F-A-C) again…",
        hint:"List the nine chord tones and cross off duplicates." } }
  ],
  examples:[
    { caption:"The primary triads of C major with their Roman numerals — I, IV, V, and home to I. The classic cadence of countless songs.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:600},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"Anatomy of the major triad: Major 3rd below + minor 3rd above = a Perfect 5th from root to top.",
      staff:{clef:"bass",tempo:60,notes:[
        {p:"C3",d:"w"},{p:"E3",d:"w",chord:true},{p:"G3",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"Major 3rd — 4 half steps"},{from:1,to:2,label:"minor 3rd — 3"}],width:340} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Roman Numeral Sprint (45s)",
      intro:"Triads flash — name their Roman numerals in C major!",
      miaIntro:"I, IV, V — read like a Roman! \u{1F3DB}",
      spec:{gen:"triad-id", params:{ask:"numeral"}, seconds:45},
      result:(score)=>score>=8?score+" numerals — senate-approved!":null },
    { type:"key-climb", title:"Game 2 · Primary Path",
      intro:"Walk the primary roots: C → F → G → C, in order, fast!",
      miaIntro:"Degrees 1-4-5 and home! \u{1F3E0}",
      spec:{seq:[60,65,67,72], names:["C (I)","F (IV)","G (V)","C (I)"], start:60, octaves:1,
        title:"Press C → F → G → C: the primary chord roots"},
      result:(score)=>score!==null?"The three-chord walk is yours!":null },
    { type:"symbol-hunt", title:"Game 3 · Primary Hunt",
      intro:"Three primaries and one impostor — click what the round asks!",
      miaIntro:"Spot I, IV, V by sight! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"I (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"IV (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"V (G-B-D)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"ii (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Primary radar: flawless!":null },
    { type:"term-race", title:"Game 4 · Primary Vocabulary Race",
      intro:"Primary, Roman numerals, M3+P5 — race the chord words!",
      miaIntro:"Crown the vocabulary! \u{1F451}",
      spec:{rounds:8, reverse:true, pool:[
        ["Primary triads","the triads on scale degrees 1, 4, and 5"],
        ["I chord in C major","the C triad (C-E-G)"],
        ["IV chord in C major","the F triad (F-A-C)"],
        ["V chord in C major","the G triad (G-B-D)"],
        ["Major triad","root + Major 3rd + Perfect 5th"],
        ["I + IV + V together","contain every tone of the major scale"]]},
      result:(score)=>score>=7?"Primary vocabulary: crowned!":null }
  ],
  practiceIntro:"19 practice questions — numerals, spellings, recipes and the every-tone fact. Answer right and the next appears automatically!",
  practice:[
    { gen:"triad-id", params:{ask:"numeral"}, count:5 },
    { gen:"triad-id", params:{}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Primary triads","built on degrees 1, 4, and 5"],["I in C major","C-E-G"],["IV in C major","F-A-C"],["V in C major","G-B-D"],["Major triad","root + M3 + P5"]], reverse:true}, count:3 },
    { type:"mc", q:"The primary triads are identified by the Roman numerals…", choices:["I, IV, V","i, ii, iii","I, III, V"], answer:0,
      explain:"Degrees 1, 4, 5." },
    { type:"mc", q:"In C major, the V chord is spelled…", choices:["G-B-D","G-A-B","F-A-C"], answer:0,
      explain:"Triad on degree 5: G-B-D." },
    { type:"mc", q:"A major triad consists of a root, a…", choices:["Major 3rd and a Perfect 5th","minor 3rd and a Perfect 5th","Major 3rd and a Major 5th"], answer:0,
      explain:"M3 + P5 — the Unit 9 intervals!" },
    { type:"mc", q:"Stacked as two 3rds, a major triad is…", choices:["M3 on the bottom, m3 on top","m3 on the bottom, M3 on top","two M3s"], answer:0,
      explain:"4 + 3 half steps." },
    { type:"truefalse", q:"The three primary triads contain every tone of the major scale.", answer:true,
      explain:"C-E-G + F-A-C + G-B-D = all seven letters." },
    { type:"truefalse", q:"The primary triads are built on scale degrees 1, 3, and 5.", answer:false,
      explain:"1, 4, and 5 — don't confuse locations with spelling!" },
    { type:"mc", q:"Why are the primary triads called MAJOR triads?", choices:["Each has a root, Major 3rd, and Perfect 5th","They are the loudest","They only use white keys"], answer:0,
      explain:"The quality comes from the intervals." },
    { type:"mc", q:"Which primary chord contains the note B (in C major)?", choices:["V (G-B-D)","I (C-E-G)","IV (F-A-C)"], answer:0,
      explain:"B is the 3rd of the G triad." }
  ],
  miaQuizIntro:"Crowns on: I, IV, V — rule the final quiz!",
  quiz:[
    { type:"mc", q:"The primary triads of a key are built on scale degrees…", choices:["1, 4, and 5","1, 2, and 3","1, 3, and 5","5, 6, and 7"], answer:0,
      explain:"The 1-4-5 backbone.", hint:"Roman numerals I, IV, V." },
    { type:"mc", q:"In C major, the I chord is…", choices:["C-E-G","C-D-E","C-F-G","C-E-A"], answer:0,
      explain:"The triad on degree 1.", hint:"Root C, every other letter." },
    { type:"mc", q:"In C major, the IV chord is…", choices:["F-A-C","F-G-A","G-B-D","D-F-A"], answer:0,
      explain:"The triad on degree 4 = F.", hint:"Count to the 4th letter." },
    { type:"mc", q:"In C major, the V chord is…", choices:["G-B-D","G-A-B","F-A-C","A-C-E"], answer:0,
      explain:"The triad on degree 5 = G.", hint:"The 5th letter up." },
    { type:"truefalse", q:"Primary triads are major triads.", answer:true,
      explain:"Root + M3 + P5 each time.", hint:"Why they sound bright." },
    { type:"truefalse", q:"The I, IV, and V chords together contain every tone of the major scale.", answer:true,
      explain:"All seven letters covered — the three-chord-song secret.", hint:"Cross off the nine chord tones." },
    { type:"mc", q:"A major triad = root + …", choices:["Major 3rd + Perfect 5th","minor 3rd + Perfect 5th","Major 3rd + Major 5th","Perfect 3rd + Perfect 5th"], answer:0,
      explain:"Two impossible interval names hide in the wrong answers!", hint:"Unit 9: no P3, no M5." },
    { type:"mc", q:"As stacked 3rds, the major triad is…", choices:["Major 3rd below, minor 3rd above","minor 3rd below, Major 3rd above","two minor 3rds"], answer:0,
      explain:"4 + 3 = a perfect 5th.", hint:"Large 3rd below, small 3rd above." },
    { type:"mc", q:"Name this chord's Roman numeral (key of C).",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:200},
      choices:["IV","I","V"], answer:0,
      explain:"Root F = degree 4 → IV.", hint:"Bottom note, then count from C." },
    { type:"mc", q:"Name this chord's Roman numeral (key of C).",
      staff:{clef:"bass",notes:[{p:"G2",d:"w"},{p:"B2",d:"w",chord:true},{p:"D3",d:"w",chord:true}],width:200},
      choices:["V","IV","I"], answer:0,
      explain:"Root G = degree 5 → V.", hint:"Same rule in bass clef." },
    { type:"mc", q:"Roman numerals in chord labels represent…", choices:["the scale degree of the chord's root","how loud to play","the number of notes"], answer:0,
      explain:"I = degree 1's chord, IV = degree 4's, V = degree 5's.", hint:"Numbers in disguise." },
    { type:"mc", q:"Why can three-chord songs harmonize entire melodies?", choices:["I, IV, V contain every scale tone","Melodies avoid most notes","Chords change the melody's notes"], answer:0,
      explain:"Every melody note has a primary chord home.", hint:"The remarkable fact." },
    /* generated */
    { gen:"triad-id", params:{ask:"numeral"}, count:4 },
    { gen:"triad-id", params:{}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Primary triads","degrees 1, 4, and 5"],["Major triad","root + M3 + P5"],["IV in C major","F-A-C"],["V in C major","G-B-D"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Primary Triads (Primary Chords)", def:"The most important triads of a key, built on scale degrees 1, 4, and 5 — identified by the Roman numerals I, IV, and V. Together they contain every tone of the major scale.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:130}},
    {term:"Major Triad", def:"A triad made of a root, a Major 3rd, and a Perfect 5th — equivalently, a minor 3rd stacked on top of a Major 3rd."},
    {term:"Roman Numerals (I, IV, V)", def:"Labels showing the scale degree a chord is built on — capital numerals for major chords."},
    {term:"I, IV, V in C major", def:"C triad (C-E-G), F triad (F-A-C), G triad (G-B-D)."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Primary triads</b> live on degrees <b>1, 4, 5</b> → Roman numerals <b>I, IV, V</b>.",
    "✔ In C major: <b>I = C-E-G · IV = F-A-C · V = G-B-D</b>.",
    "✔ Each is a <b>MAJOR triad</b>: root + Major 3rd + Perfect 5th (= M3 with m3 stacked on top).",
    "✔ I + IV + V contain <b>every tone of the scale</b> — three chords can harmonize nearly anything.",
    "✔ Location vs spelling: chords SIT on 1-4-5 but are each SPELLED 1-3-5 from their own root."
  ],
  tips:[
    "Grab a guitar-playing friend: C, F, G are literally their first three chords — now you know why.",
    "Drill the three spellings until instant: C-E-G! F-A-C! G-B-D!",
    "Hearing check: I feels like home, IV like a step away, V like it's leaning back toward home.",
    "Next lesson names every scale degree — tonic, dominant, and friends — and L50 crowns V with a 7th."
  ],
  rewards:{ badge:"Primary Ruler", icon:"\u{1F451}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — I, IV, V salute their ruler! \u{1F451}\u{1F389}",
  miaPass:"Passed! Keep the three spellings on your tongue: C-E-G, F-A-C, G-B-D.",
  mia:{
    hook:{ label:"the welcome",
      explain:"You heard C (I) → F (IV) → G (V) → C (I): the primary triads of C major — the three-chord engine of popular music.",
      play:()=>{[[60,64,67],[65,69,72],[67,71,74],[60,64,67]].forEach((c,k)=>c.forEach(m=>MFAudio.tone(m,.6,k*.7,.35)));} },
    learn:{ label:"primary & major triads",
      explain:"Degrees 1, 4, 5 → I, IV, V. In C: C-E-G, F-A-C, G-B-D. Each is major (root + M3 + P5 = M3 + m3 stacked), and together they hold every scale tone.",
      hint:"Location 1-4-5; spelling 1-3-5.",
      play:()=>{[60,64,67].forEach(m=>MFAudio.tone(m,.8,0,.38));} },
    example:{ label:"the examples",
      explain:"Example 1 plays the I-IV-V-I progression with numerals; example 2 breaks the major triad into its lower and upper 3rds." },
    game:{ label:"the games",
      explain:"Sprint the numerals, walk the primary path, hunt I-IV-V by sight, then race the vocabulary.",
      hint:"Root → degree → numeral, in that order." },
    quiz:{ label:"this question",
      explain:"Anchor facts: primaries sit on 1-4-5; in C they're C/F/G; each is root+M3+P5; together = the whole scale.",
      play:()=>{[65,69,72].forEach(m=>MFAudio.tone(m,.7,0,.38));} }
  }
};
