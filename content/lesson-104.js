/* Lesson 104 — Leading-Tone Chords (Book 4, Unit 26 — SELF-AUTHORED)
   Core: vii° (dim triad) and vii°7 / viiø7 as DOMINANT-FUNCTION chords —
   V7 without its root. vii°7 (fully dim, from harmonic minor) works in
   major too; resolves to I with the leading tone rising. Augmented triad's
   function (III+) gets one step. NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[104]={stackFigures:true,
  welcome:"Leading-tone chords provide dominant function without the dominant root.",
  hook:{
    say:"<b>Listen to a diminished triad built on the leading tone. Its tendency tones resolve toward the tonic chord.</b> \u{1F447} <b>Where does the chord resolve?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play vii°–I</button></div>
          <div class="choices hk-ch" style="display:none"><button>To I — it provides dominant function</button><button>To IV — it provides predominant function</button><button>It remains unresolved</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ [59,62,65].forEach(m=>MFAudio.tone(m,.9,.05,.3)); [60,64,67].forEach(m=>MFAudio.tone(m,1.1,1.0,.3)); setTimeout(()=>ch.style.display="",2300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. In C major, B–D–F resolves to the tonic harmony. The chord shares its three pitches with the upper three members of G7 and commonly provides dominant function without the dominant root G.");
          else fb(false,"Follow the tendency tones: B resolves upward to C, and F resolves downward to E.");
        });
      } }
  },
  objectives:[
    "Recall vii°: the diminished triad on the leading tone",
    "Relate vii° to the upper three notes of V7 — both commonly have dominant function",
    "Distinguish viiø7 in major from vii°7 in minor and chromatic contexts",
    "Resolve leading-tone chords to I or i",
    "Use vii°7 symmetry through enharmonic respelling",
    "Introduce secondary leading-tone chords such as vii°/V"
  ],
  steps:[
    { say:"<b>The Leading-Tone Triad:</b> In C major, vii° is <b>B–D–F</b>. These are the upper three chord members of G7, G–B–D–F. Both chords contain the tritone B–F and commonly provide dominant function, although they are distinct chords with different roots. \u{1F447} <b>How many pitches does vii° share with V7 in the same major key?</b>",
      try:{ type:"mc", choices:["Three—the third, fifth, and seventh of V7","One","None"], answer:0,
        success:"✓ Correct. In C major, B, D, and F belong to both vii° and V7.",
        fail:"Compare G–B–D–F with B–D–F.",
        hint:"Remove the dominant root G from G7." } },
    { say:"<b>Leading-Tone Seventh Chords:</b> In a major key, the diatonic seventh chord on the leading tone is half-diminished. In C major, <b>viiø7</b> is B–D–F–A. Lowering scale degree 6 from A to A♭ produces the fully diminished leading-tone seventh chord <b>vii°7</b>, B–D–F–A♭. This chromatic form may be understood as drawing scale degree ♭6 from the parallel minor. In minor keys, the raised leading tone and the minor-mode sixth scale degree naturally produce a fully diminished leading-tone seventh chord; in C minor, B–D–F–A♭ is vii°7. \u{1F447} <b>Which pitches form vii°7 in C?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"B3",d:"w",label:"vii\u{00F8}7"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"B3",d:"w",label:"vii\u{00B0}7"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true},{bar:"final"}],width:440} },
      try:{ type:"mc", choices:["B–D–F–A♭","B–D–F–A","B–D–F–G"], answer:0,
        success:"✓ Correct. B–D–F–A♭ consists of three stacked minor thirds and forms a fully diminished seventh chord on the leading tone.",
        fail:"Compare the seventh above B: A is minor, while A♭ is diminished.",
        hint:"Use A♭ rather than A♮." } },
    { say:"<b>Resolution:</b> Leading-tone chords normally resolve toward <b>I</b> or <b>i</b>. The leading tone typically rises by half step to the tonic, while the diminished fifth above the root normally resolves downward by step. In a leading-tone seventh chord, the chordal seventh also normally resolves downward by step. The leading-tone triad frequently appears in <b>first inversion</b>, vii°6; one common passing progression is I–vii°6–I6, in which the bass moves by step from scale degree 1 through 2 to 3. \u{1F447} <b>In a conventional vii°–I resolution, how does the leading tone normally move?</b>",
      try:{ type:"mc", choices:["Up by half step to the tonic","Down by fifth","It must remain on the same pitch"], answer:0,
        success:"✓ Correct. In C major or minor, B normally resolves upward by half step to C.",
        fail:"Identify the tonic a half step above the leading tone.",
        hint:"The leading tone normally resolves upward by half step." } },
    { say:"<b>Enharmonic Flexibility of vii°7:</b> A fully diminished seventh chord divides the octave into four equal minor thirds. Through enharmonic respelling, any one of its four pitch classes can be interpreted as the root of a leading-tone seventh chord, so each spelling can point toward a different tonic. For example, B–D–F–A♭ may be enharmonically respelled to function as leading-tone seventh chords resolving toward C, E♭, G♭, or A, allowing the chord to connect distantly related keys. \u{1F447} <b>Why can a fully diminished seventh chord lead toward several different tonics?</b>",
      try:{ type:"mc", choices:["Its symmetrical pitch structure allows enharmonic respelling with different chord members interpreted as the leading-tone root","It contains five chord members","It must be performed loudly"], answer:0,
        success:"✓ Correct. Enharmonic respelling allows the same sounding pitch collection to assume different leading-tone functions.",
        fail:"Examine the equal minor-third divisions of the chord.",
        hint:"Three stacked minor thirds create a symmetrical pitch collection." } },
    { say:"<b>Secondary Leading-Tone Chords:</b> Just as a secondary dominant tonicizes a nontonic chord, a secondary leading-tone chord may provide dominant function to a temporary target. Its Roman numeral may be written <b>vii°/X</b>, <b>viiø7/X</b>, or <b>vii°7/X</b>, depending on the chord type. In C major, F♯–A–C is vii°/V because F♯ is the temporary leading tone to G, and the chord normally resolves to G major, the V chord. \u{1F447} <b>In C major, F♯–A–C resolving to G major is labeled…</b>",
      try:{ type:"mc", choices:["vii°/V","vii°/I","ii"], answer:0,
        success:"✓ Correct. F♯ is the temporary leading tone to G, so the chord is the leading-tone triad of V.",
        fail:"Look at the chord after the slash — F♯ leads to G.",
        hint:"Identify the target chord after the slash." } },
    { say:"<b>Review:</b> \u{1F447} <b>In the progression I–vii°6–I6, what role does vii°6 commonly serve?</b>",
      try:{ type:"mc", choices:["A passing chord connecting two tonic positions","A final cadence by itself","A modulation by itself"], answer:0,
        success:"✓ Correct. In C major, the bass moves C–D–E while vii°6 connects root-position I with first-inversion I.",
        fail:"Follow the stepwise bass motion between the two tonic positions.",
        hint:"I → vii°6 → I6." } }
  ],
  examples:[
    { caption:"I–vii°6–I6: the leading-tone chord serves as a passing chord while the bass moves C–D–E between two positions of the tonic harmony.",
      staff:{clef:"treble",tempo:76,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"vii\u{00B0}6"},{p:"F4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"E4",d:"w",label:"I6"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:480},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"vii°7 resolving to i in C minor: every tendency tone obeys — B rises, the dissonances fall — maximum tension into calm.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"B3",d:"w",label:"vii\u{00B0}7"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true},
        {p:"C4",d:"w",label:"i"},{p:"Eb4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:420},
      kb:{start:57,octaves:1.25,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Leading-Tone Chord Identification",
      intro:"Identify leading-tone chord spellings, qualities, functions, and resolutions.",
      miaIntro:"Find the leading tone and its expected tonic.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["vii° in C","B-D-F"],
        ["vii° contains","the upper three notes of V7"],
        ["viiø7","half-diminished (B-D-F-A)"],
        ["vii°7","fully diminished (B-D-F-A\u{266D})"],
        ["The leading tone resolves","up to the tonic"],
        ["Leading-tone chords' function","dominant"],
        ["vii°7's structure","all minor 3rds — symmetrical"],
        ["Classic usage","vii°6 passing between I and I6"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?"Leading-tone chords identified!":null },
    { type:"key-climb", title:"Game 2 · Resolve vii°7",
      intro:"Play B–D–F–A♭ and resolve it smoothly to a C-minor or C-major tonic voicing. Follow B upward to C, F downward to E♭ or E, and A♭ downward to G.",
      miaIntro:"Resolve each tendency tone by step.",
      spec:{seq:[59,62,65,68,60],
        names:["B (leading tone)","D","F","A♭ (the °7)","C — resolution!"],
        start:59, octaves:1, title:"vii°7 into the tonic"},
      result:(score)=>score!==null?"You performed the leading-tone resolution.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Chord",
      intro:"Examine each leading-tone chord and identify its triad or seventh-chord quality.",
      miaIntro:"Spell the chord and check its seventh.",
      spec:{rounds:6, pool:[
        {label:"vii° (B-D-F)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"viiø7 (B-D-F-A)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"vii°7 (B-D-F-A♭)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true}],width:150}},
        {label:"V7 (G-B-D-F)", spec:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the leading-tone chords correctly.":null },
    { type:"term-race", title:"Game 4 · Function and Resolution",
      intro:"Identify the expected target and tendency-tone resolutions of each leading-tone chord.",
      miaIntro:"Read the Roman numeral and follow the tendency tones.",
      spec:{rounds:8, reverse:true, pool:[
        ["vii° resolves to","I (or i)"],
        ["vii°7 resolves to","I (or i)"],
        ["The leading tone moves","up a half step"],
        ["The chord's dissonances","fall by step"],
        ["vii° shares its tritone with","V7"],
        ["vii°7 as a pivot","opens distant keys"],
        ["vii°/V resolves to","V"],
        ["D-function chords","V, V7, vii°, viiø7, vii°7"]]},
      result:(score)=>score>=6?"You identified the expected resolutions correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on leading-tone chord spellings, qualities, functions, and resolutions.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["vii°","B-D-F in C"],["viiø7","+A"],["vii°7","+A\u{266D}"],["Function","dominant"],["Resolution","to I"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{}, count:2 },
    { type:"mc", q:"vii° in C major is spelled…", choices:["B-D-F","B-D-F♯","G-B-D"], answer:0, explain:"In C major, vii° is B–D–F." },
    { type:"mc", q:"vii° functions as…", choices:["a dominant","a tonic","a predominant"], answer:0, explain:"The leading-tone triad commonly serves dominant function." },
    { type:"mc", q:"vii°7 adds which 7th above B (in C)?", choices:["A♭","A","G"], answer:0, explain:"In C, vii°7 contains A♭, a diminished seventh above B." },
    { type:"mc", q:"In vii° → I, the leading tone…", choices:["rises by half step to the tonic","falls to the dominant","disappears"], answer:0, explain:"The leading tone normally resolves upward by half step to the tonic." },
    { type:"truefalse", q:"vii° shares its tritone (B-F) with V7.", answer:true, explain:"Both vii° and V7 contain the tritone B–F in C major." },
    { type:"truefalse", q:"Through enharmonic respelling, any pitch class of a fully diminished seventh chord may be reinterpreted as the root of a leading-tone chord.", answer:true, explain:"Enharmonic respelling reinterprets each pitch class as a leading tone." },
    { type:"truefalse", q:"viiø7 and vii°7 have different seventh qualities.", answer:true, explain:"In C, viiø7 contains A♮, while vii°7 contains A♭." },
    { gen:"term-match", params:{subject:"term", pool:[["I - vii°6 - I6","the passing use"],["Symmetry","distant-key pivot"],["vii°/V","tonicizes V"],["Tritone","B-F"]], reverse:true}, count:3 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"vii° (Leading-Tone Triad)", def:"A diminished triad on scale degree 7 with dominant function."},
    {term:"viiø7 / vii°7", def:"Major: viiø7 is diatonic. Minor: vii°7 uses the raised leading tone."},
    {term:"Resolution Rule", def:"7̂ rises to 1̂; the diminished fifth and chordal seventh usually descend."},
    {term:"°7 Symmetry", def:"Stacked minor thirds allow four enharmonic interpretations."}
  ],
  mistakes:[],
  summary:[
    "✔ vii° shares the <b>upper three notes of V7</b> and commonly has dominant function.",
    "✔ Major: <b>viiø7 is diatonic</b>; minor: <b>vii°7</b> results from the raised leading tone.",
    "✔ Resolution: <b>7̂ rises to 1̂</b>; the diminished fifth and chordal seventh usually descend.",
    "✔ Classic use: <b>I–vii°6–I6</b> passing motion.",
    "✔ °7 symmetry allows <b>four enharmonic interpretations</b> leading toward four possible tonics."
  ],
  tips:[
    "Hear vii° as 'V7 lite' — softer bass, same push.",
    "vii°7 loves dramatic moments: diminished-seventh tension is opera's favorite chord.",
    "Spell any vii°7 fast: leading tone + minor 3rds all the way up.",
    "Next lesson: a chromatic predominant from the flat side — the Neapolitan."
  ],
  rewards:{ badge:"Key Holder", icon:"\u{1F511}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify leading-tone chords, their qualities, targets, and tendency-tone resolutions.",
  quiz:[
    { type:"mc", q:"vii° in C major is…", choices:["B-D-F","B♭-D-F","B-D♯-F♯"], answer:0, explain:"Diminished, on the leading tone.", hint:"Two m3s." },
    { type:"mc", q:"vii° relates to V7 as…", choices:["V7 without its root","V7 with an added root","no relation"], answer:0, explain:"The leading-tone triad contains the upper three chord members of V7 but has its own root and Roman numeral.", hint:"Remove G." },
    { type:"mc", q:"Which function do leading-tone chords most commonly provide?", choices:["Dominant","Tonic","Predominant"], answer:0, explain:"They contain tendency tones that normally resolve toward tonic.", hint:"They push home." },
    { type:"mc", q:"vii°7 in C is spelled…", choices:["B-D-F-A♭","B-D-F-A","B-D-F-G♯"], answer:0, explain:"All minor 3rds.", hint:"Lowered 7th." },
    { type:"mc", q:"viiø7 differs from vii°7 by…", choices:["its 7th: A vs A♭","its root","its 3rd"], answer:0, explain:"Half vs fully diminished.", hint:"Top note." },
    { type:"mc", q:"In its standard dominant-function use, vii° normally resolves to…", choices:["I or i","IV","vi"], answer:0, explain:"Dominant home.", hint:"Where V goes." },
    { type:"mc", q:"In a standard leading-tone-chord resolution, the leading tone normally…", choices:["Rises by half step to tonic","Falls by whole step","Leaps by octave"], answer:0, explain:"For example, B normally resolves upward to C.", hint:"Its name says so." },
    { type:"mc", q:"Identify the chord in C.",
      staff:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true}],width:160},
      choices:["vii°7","viiø7","V7"], answer:0, explain:"B–D–F–A♭ forms a fully diminished seventh chord on the leading tone.", hint:"Check the top note." },
    { type:"truefalse", q:"vii°6 commonly appears as a passing chord between I and I6.", answer:true, explain:"Bass walks 1-2-3.", hint:"The passing use." },
    { type:"truefalse", q:"A fully diminished leading-tone seventh chord can appear in both major- and minor-key contexts.", answer:true, explain:"In major, it may be created by lowering scale degree 6 through mixture with the parallel minor.", hint:"Both modes." },
    { type:"mc", q:"Why can a fully diminished seventh chord connect several possible keys?", choices:["Its symmetrical structure permits multiple enharmonic spellings and leading-tone interpretations","Its dynamic level is always high","It contains a major third"], answer:0, explain:"Enharmonic respelling lets different chord members act as the leading tone.", hint:"m3 stack." },
    { type:"mc", q:"Which list contains the principal dominant-function chord types introduced in this course?", choices:["V, V7, vii°, viiø7, and vii°7","I and vi","ii and IV"], answer:0, explain:"V and leading-tone chords contain tendency tones that commonly resolve toward tonic. Their exact function still depends on musical context.", hint:"The pushers." }
  ],
  miaPerfect:"Perfect score! You accurately identified leading-tone chords and their expected resolutions.",
  miaPass:"You passed! Next, you will study the Neapolitan chord.",
  mia:{
    hook:{ label:"the welcome",
      explain:"B-D-F resolved into C-E-G — vii°, sharing V7's upper three notes, doing dominant work.",
      play:()=>{[59,62,65].forEach(m=>MFAudio.tone(m,.9,.05,.3));[60,64,67].forEach(m=>MFAudio.tone(m,1.1,1.0,.3));} },
    learn:{ label:"leading-tone chords",
      explain:"vii° shares V7's upper three notes (dominant function); viiø7 major, vii°7 minor/chromatic; resolve to I with the leading tone rising; °7 symmetry pivots far.",
      hint:"B rises to C.",
      play:()=>{[59,62,65,68].forEach(m=>MFAudio.tone(m,.9,.05,.28));[60,63,67].forEach(m=>MFAudio.tone(m,1.0,1.0,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 passes vii°6 between two positions of the tonic; example 2 resolves vii°7 into C minor." },
    game:{ label:"the games",
      explain:"Sprint the spellings, resolve by hand, spot the chords, then race the resolutions.",
      hint:"Count the minor 3rds." },
    quiz:{ label:"this question",
      explain:"Spell from the leading tone in minor 3rds; assign dominant function; resolve leading tone UP into I.",
      play:()=>{[59,62,65].forEach(m=>MFAudio.tone(m,.9,.05,.3));} }
  }
};
