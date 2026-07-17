/* Lesson 105 — The Neapolitan Chord (Book 4, Unit 26 — SELF-AUTHORED)
   Core: ♭II — a MAJOR triad on the lowered 2nd degree; usually FIRST
   INVERSION (N⁶); PREDOMINANT function → V; darkest in minor keys.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[105]={stackFigures:true,
  welcome:"The Neapolitan is a chromatic predominant chord built on the lowered second scale degree.",
  hook:{
    say:"<b>In A minor, a B♭ major chord appears</b> and moves toward the dominant. Listen to the progression. \u{1F447} <b>What harmonic function does the B♭ major chord perform?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play i → N⁶ → V → i</button></div>
          <div class="choices hk-ch" style="display:none"><button>It prepares the dominant and functions as a predominant</button><button>It functions as the tonic throughout</button><button>Silent</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ [[60,64,69],[62,65,70],[59,64,68],[60,64,69]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.27))); setTimeout(()=>ch.style.display="",4*900+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. B♭-D-F is the Neapolitan chord in A minor. It is a major triad built on ♭2 and commonly provides predominant function before V.");
          else fb(false,"B♭ is chromatic in A minor. Listen to how the chord prepares the dominant E major.");
        });
      } }
  },
  objectives:[
    "Build the Neapolitan: a major triad on ♭2",
    "Use its standard first-inversion form, N⁶, with scale degree 4 in the bass",
    "Identify its predominant function leading toward V",
    "Trace ♭2 downward toward the leading tone",
    "Recognize the Neapolitan in both minor and major keys",
    "Recognize N⁶ by ear and in notation"
  ],
  steps:[
    { say:"<b>The Neapolitan Chord:</b> a <b>major triad built on the lowered second scale degree, ♭2</b>. In A minor, lower B to B♭ and build the major triad <b>B♭–D–F</b>. The chord is labeled ♭II in root position and most commonly appears in first inversion as N⁶, or ♭II⁶. \u{1F447} <b>What is the quality of the Neapolitan triad?</b>",
      try:{ type:"mc", choices:["Major","Minor","Diminished"], answer:0,
        success:"✓ Correct. The Neapolitan is a major triad built on the lowered second scale degree.",
        fail:"Identify the intervals B♭-D and D-F.",
        hint:"Major third plus minor third." } },
    { say:"<b>First Inversion — N⁶:</b> the Neapolitan most commonly appears in <b>first inversion</b>. Its chordal third — the key's <b>fourth scale degree</b> — appears in the bass. In A minor, B♭–D–F becomes D–F–B♭ with D in the bass. \u{1F447} <b>Which pitch appears in the bass of N⁶ in A minor?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:72,notes:[
        {p:"D4",d:"w",label:"N⁶: D in the bass"},{p:"F4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{bar:"final"}],width:300} },
      try:{ type:"mc", choices:["D, scale degree 4","B♭, scale degree ♭2","A, the tonic"], answer:0,
        success:"✓ Correct. D is the third of the B♭ major triad and scale degree 4 in A minor.",
        fail:"Identify the chordal third of B♭-D-F.",
        hint:"First inversion places the chordal third in the bass." } },
    { say:"<b>Function:</b> the Neapolitan normally has <b>predominant</b> function and prepares <b>V</b>. It may move directly to V or pass through a cadential i⁶₄. Common patterns in A minor include N⁶–V–i and N⁶–i⁶₄–V–i. It occupies a position similar to ii°⁶ or iv but remains a distinct chromatic harmony. \u{1F447} <b>Which function does the Neapolitan most commonly serve?</b>",
      try:{ type:"mc", choices:["Predominant","Dominant","Tonic"], answer:0,
        success:"✓ Correct. The Neapolitan commonly prepares the dominant.",
        fail:"Identify the function that commonly prepares V.",
        hint:"Predominant → dominant → tonic." } },
    { say:"<b>Voice Leading:</b> the lowered second scale degree commonly descends toward the leading tone. In a direct N⁶–V progression in A minor, B♭ may move directly to G♯, a diminished third. When a cadential i⁶₄ intervenes, the line may descend stepwise B♭–A–G♯. In the bass, scale degree 4 commonly rises to 5, while ♭6 often falls to 5. Other arrangements are possible depending on context. \u{1F447} <b>In a common N⁶–i⁶₄–V progression in A minor, how may ♭2 move?</b>",
      try:{ type:"mc", choices:["B♭-A-G♯, descending toward the leading tone","Up by octave only","It must remain unchanged"], answer:0,
        success:"✓ Correct. The line may move directly from B♭ to G♯ or pass through A when a cadential i⁶₄ intervenes.",
        fail:"Follow the voice containing scale degree ♭2.",
        hint:"B♭ may move through A toward G♯." } },
    { say:"<b>Use in Major and Minor Keys:</b> the Neapolitan appears more frequently in <b>minor-key</b> repertoire, where scale degree ♭6 already belongs to the diatonic collection — though ♭2 stays chromatic even in minor. It also appears in <b>major keys</b> through chromatic alteration of scale degrees 2 and 6. In C minor or C major it is spelled D♭-F-A♭: the same pitches, but its relationship to the surrounding scale differs. \u{1F447} <b>In which mode has the Neapolitan historically been especially common?</b>",
      try:{ type:"mc", choices:["Minor, although it also occurs in major","Whole-tone music only","Unpitched percussion music"], answer:0,
        success:"✓ Correct. The Neapolitan is especially common in minor-key tonal music but also appears in major-key contexts.",
        fail:"Compare the chord tones with the parallel major and minor scales.",
        hint:"In minor, scale degree ♭6 is already diatonic, but ♭2 remains chromatic." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which major triad is the Neapolitan chord in E minor?</b>",
      try:{ type:"mc", choices:["F major: F-A-C","F♯ major: F♯-A♯-C♯","B major: B-D♯-F♯"], answer:0,
        success:"✓ Correct. Lower scale degree 2 from F♯ to F♮ and build a major triad: F-A-C. In first inversion, N⁶ is A-C-F.",
        fail:"Lower scale degree 2 and build a major triad on the resulting pitch.",
        hint:"The Neapolitan root is one half step above the tonic." } }
  ],
  examples:[
    { caption:"Key: A minor — i → N⁶ → V → i. In the direct N⁶–V connection, B♭ may move to G♯, a diminished third.",
      staff:{clef:"grand",tempo:72,time:"4/4",notes:[
        {p:"A2",d:"w",clef:"bass",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
        {p:"D3",d:"w",clef:"bass",label:"N⁶"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{bar:"single"},
        {p:"E3",d:"w",clef:"bass",label:"V"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"single"},
        {p:"A2",d:"w",clef:"bass",label:"i"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:45,octaves:2.1667,labels:true} },
    { caption:"Key: A minor — ♭2 → 1̂ → 7̂ → 1̂. With a cadential i⁶₄ between N⁶ and V, ♭2 descends stepwise B♭–A–G♯ before resolving to A.",
      staff:{clef:"treble",tempo:76,time:"4/4",notes:[
        {p:"Bb4",d:"q",label:"♭2 (B♭)"},{p:"A4",d:"q",label:"1̂ (A)"},{p:"G#4",d:"q",label:"7̂ (G♯)"},{p:"A4",d:"q",label:"1̂ (A)"},{bar:"final"}],width:480},
      kb:{start:65,octaves:0.5,labels:true} },
    { caption:"Key: A major — the same Neapolitan, B♭–D–F. In a major key both ♭2 (B♭) and ♭6 (F♮) are chromatic (A major's scale has F♯), and the tonic is major (C♯). Compare it with the A-minor version above.",
      staff:{clef:"grand",tempo:72,time:"4/4",notes:[
        {p:"A2",d:"w",clef:"bass",label:"I"},{p:"C#4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
        {p:"D3",d:"w",clef:"bass",label:"N⁶"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{bar:"single"},
        {p:"E3",d:"w",clef:"bass",label:"V"},{p:"E4",d:"w",chord:true},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"single"},
        {p:"A2",d:"w",clef:"bass",label:"I"},{p:"C#4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:45,octaves:2.1667,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Neapolitan-Chord Identification",
      intro:"Identify the Neapolitan's spelling, inversion, and predominant function.",
      miaIntro:"Major triad on \u{266D}2, commonly in first inversion.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["The Neapolitan","a major triad on \u{266D}2"],
        ["In A minor","B\u{266D}-D-F"],
        ["Usual position","first inversion (N⁶)"],
        ["N⁶'s bass note","the 4th scale degree"],
        ["Function","predominant \u{2192} V"],
        ["\u{266D}2 resolves","down toward the leading tone"],
        ["More common in","minor"],
        ["N of E minor","F major"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Neapolitan chords identified!":null },
    { type:"key-climb", title:"Game 2 · Perform the Neapolitan Progression",
      intro:"Play the complete progression i-N⁶-V-i in A minor: Am → B♭/D → E → Am. Then compare it with i-N⁶-i⁶₄-V-i.",
      miaIntro:"Listen to the predominant-dominant-tonic motion.",
      spec:{seq:[57,50,52,45],
        chords:[[57,60,64],[50,53,58],[52,56,59],[45,48,52]],
        names:["Am (i)","B♭/D (N⁶)","E major (V)","Am (i)"],
        start:45, octaves:1.5833, title:"The Neapolitan progression: i - N⁶ - V - i"},
      result:(score)=>score!==null?"You performed both Neapolitan progressions.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Neapolitan",
      intro:"Examine each chord in A minor and select the Neapolitan chord or its first inversion.",
      miaIntro:"Locate \u{266D}2 and confirm the major-triad spelling.",
      spec:{rounds:6, pool:[
        {label:"N⁶ (D-F-B♭)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:150}},
        {label:"iv (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"ii° (B-D-F)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"V (E-G♯-B)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the Neapolitan chord correctly.":null },
    { type:"term-race", title:"Game 4 · Construct N⁶",
      intro:"Construct the Neapolitan triad and place its chordal third in the bass.",
      miaIntro:"Find \u{266D}2, build a major triad, and invert it.",
      spec:{rounds:8, reverse:true, pool:[
        ["N of A minor","B\u{266D} major"],
        ["N of E minor","F major"],
        ["N of D minor","E\u{266D} major"],
        ["N of B minor","C major"],
        ["N of C minor","D\u{266D} major"],
        ["N's PD role","near ii\u{00B0}\u{2076} or iv"],
        ["N⁶'s figure","6 (first inversion)"],
        ["After N⁶ comes","V"]]},
      result:(score)=>score>=6?"You constructed the Neapolitan chords correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on Neapolitan-chord spelling, inversion, function, and voice leading.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["\u{266D}II","the Neapolitan"],["N⁶","first inversion"],["Function","predominant"],["Target","V"],["More common in","minor"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"The Neapolitan is built on…", choices:["the lowered 2nd degree","the raised 4th","the 7th"], answer:0, explain:"The Neapolitan is a major triad built on scale degree ♭2." },
    { type:"mc", q:"In A minor, the Neapolitan is…", choices:["B♭ major","B major","G♯ diminished"], answer:0, explain:"In A minor, the Neapolitan is B♭-D-F." },
    { type:"mc", q:"N⁶ means the Neapolitan in…", choices:["first inversion","root position","third inversion"], answer:0, explain:"N⁶ indicates the Neapolitan in first inversion." },
    { type:"mc", q:"The Neapolitan's function is…", choices:["predominant","dominant","tonic"], answer:0, explain:"The Neapolitan normally serves predominant function." },
    { type:"truefalse", q:"The Neapolitan is a major triad.", answer:true, explain:"The Neapolitan is a major triad built on ♭2." },
    { type:"truefalse", q:"In common Neapolitan voice leading, ♭2 frequently descends toward the leading tone, either directly or through the tonic scale degree.", answer:true, explain:"B♭ may move directly to G♯ or pass through A." },
    { type:"truefalse", q:"The Neapolitan is a chromatic chord in both major and minor keys.", answer:true, explain:"♭2 is chromatic in both modes, though the chord is especially common in minor-key repertoire." },
    { gen:"term-match", params:{subject:"term", pool:[["N of D minor","E\u{266D}"],["N of E minor","F"],["N's PD role","near iv/ii\u{00B0}"],["N⁶ bass","degree 4"]], reverse:true}, count:3 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Neapolitan Chord (♭II)", def:"A major triad built on lowered scale degree 2."},
    {term:"N⁶", def:"The Neapolitan in first inversion, with scale degree 4 in the bass."},
    {term:"Predominant Function", def:"Prepares V, like ii°⁶ or iv."},
    {term:"The ♭2 Resolution", def:"♭2 descends toward the leading tone, directly or through the tonic."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>♭II</b> is a major triad built on the lowered second scale degree.",
    "✔ <b>N⁶</b> is the standard first-inversion form, with scale degree 4 in the bass.",
    "✔ The Neapolitan has <b>predominant function</b> and prepares V.",
    "✔ <b>♭2 descends</b> toward the leading tone, directly or through the tonic.",
    "✔ More common in <b>minor</b> but also occurs in major."
  ],
  tips:[
    "Fastest spell: go a half step above the tonic, build major, then flip to first inversion.",
    "The N⁶ → V move often passes through a cadential i⁶₄ — listen for it in real scores.",
    "Film composers use N for instant menace — listen for the flat-two glow under villains.",
    "Next lesson: three chromatic chords named after countries — the augmented sixths."
  ],
  rewards:{ badge:"Flat-Side Voyager", icon:"\u{1F30B}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Major triad on ♭2, commonly in first inversion, with predominant function.",
  quiz:[
    { type:"mc", q:"The Neapolitan chord is a…", choices:["major triad on ♭2","minor triad on 2","diminished triad on 7"], answer:0, explain:"A major triad built on ♭2.", hint:"Its quality." },
    { type:"mc", q:"In A minor the Neapolitan is spelled…", choices:["B♭-D-F","B-D-F","B♭-D♭-F"], answer:0, explain:"B♭-D-F in A minor.", hint:"Half step above A." },
    { type:"mc", q:"Why 'N⁶'?", choices:["It appears in first inversion","It has six notes","It lasts six beats"], answer:0, explain:"N⁶ indicates first inversion, abbreviated from 6/3.", hint:"First-inversion figure." },
    { type:"mc", q:"N⁶'s bass note in A minor is…", choices:["D","B♭","F"], answer:0, explain:"D, the chordal third and scale degree 4, is in the bass.", hint:"Diatonic bass." },
    { type:"mc", q:"The Neapolitan most commonly serves which function?", choices:["predominant","dominant","tonic substitute"], answer:0, explain:"It normally prepares V, sometimes through a cadential i⁶₄.", hint:"Before V." },
    { type:"mc", q:"Which progression shows a common use of the Neapolitan?", choices:["i → N⁶ → i⁶₄ → V → i","i → N⁶ → IV without dominant preparation","N⁶ as the final tonic"], answer:0, explain:"N⁶ commonly prepares a cadential i⁶₄ and dominant before tonic; a direct N⁶-V-i is also possible.", hint:"Through the dominant." },
    { type:"mc", q:"In common Neapolitan voice leading, ♭2 frequently moves…", choices:["down toward the leading tone, directly or through scale degree 1","up to scale degree 3 in every case","nowhere in every case"], answer:0, explain:"B♭ may fall to G♯ directly or through A.", hint:"A diminished 3rd." },
    { type:"mc", q:"Identify the chord in A minor.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:160},
      choices:["N⁶","iv","ii°"], answer:0, explain:"D-F-B♭ is a first-inversion B♭ major triad built on ♭2.", hint:"Find the B♭." },
    { type:"truefalse", q:"The Neapolitan is diatonic to the minor scale.", answer:false, explain:"Its root, ♭2, is chromatic in both major and minor keys.", hint:"♭2 is chromatic." },
    { type:"truefalse", q:"The Neapolitan can occupy a predominant position similar to ii°⁶ or iv.", answer:true, explain:"It fills a predominant slot but remains a distinct chromatic chord.", hint:"PD substitutes." },
    { type:"mc", q:"What is the Neapolitan chord in D minor?", choices:["E♭ major","E major","F major"], answer:0, explain:"♭2 of D = E♭.", hint:"Half step above D." },
    { type:"mc", q:"Which statement about the Neapolitan in major keys is accurate?", choices:["it may be created through chromatic alteration of scale degrees 2 and 6","it can never appear","it functions as the tonic chord"], answer:0, explain:"In a major key, the Neapolitan requires ♭2 and ♭6 and normally serves predominant function.", hint:"Chromatic alteration." }
  ],
  miaPerfect:"Perfect score! You accurately constructed and analyzed the Neapolitan chord.",
  miaPass:"You passed! Next, you will study augmented-sixth chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"B♭ major in A minor — the Neapolitan (♭II): chromatic predominant, driving into V.",
      play:()=>{[[60,64,69],[62,65,70],[59,64,68],[60,64,69]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.27)));} },
    learn:{ label:"the Neapolitan",
      explain:"Major triad on ♭2, standard in first inversion (N⁶, degree-4 bass), predominant to V; ♭2 falls toward the leading tone.",
      hint:"Half step up, made major.",
      play:()=>{[50,53,58].forEach(m=>MFAudio.tone(m,.9,.05,.28));[52,56,59].forEach(m=>MFAudio.tone(m,1.0,1.0,.28));} },
    example:{ label:"the examples",
      explain:"Example 1 runs the i-N⁶-V-i route in A minor; example 2 isolates ♭2 stepping down to the leading tone; example 3 shows the same Neapolitan in A major, where ♭2 and ♭6 are both chromatic." },
    game:{ label:"the games",
      explain:"Sprint the facts, walk the bass route, spot N⁶ among lookalikes, then build Neapolitans across keys.",
      hint:"D-F-B♭ vs D-F-A: one half step." },
    quiz:{ label:"this question",
      explain:"Three checks: lowered 2nd as root? major quality? first inversion heading to V? Then it is the Neapolitan.",
      play:()=>{[50,53,58].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
