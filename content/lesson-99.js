/* Lesson 99 — Modulation (Book 4, Unit 24 — SELF-AUTHORED)
   Core: MODULATION = an actual key change, confirmed by a cadence in the
   new key. Closely related keys (±1 accidental + relatives). PIVOT-CHORD
   modulation (a chord shared by both keys), DIRECT (abrupt), PHRASE
   modulation (new key at a phrase boundary). NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[99]={
  welcome:"Modulation establishes a new tonic and key within a composition.",
  hook:{
    say:"<b>The passage begins in C major but later establishes G major through a cadence.</b> \u{1F447} <b>In which key does the passage end?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the passage</button></div>
          <div class="choices hk-ch" style="display:none"><button>G major—the final cadence confirms G as the new tonic</button><button>C major—the passage returns to its original tonic</button><button>The passage remains entirely in C major</button></div>`;
        const ROWS=[[60,64,67],[60,65,69],[62,66,69],[62,67,71],[62,66,69,72],[55,62,67,71]];
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.26))); setTimeout(()=>ch.style.display="",ROWS.length*850+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. F♯ supports the new key, and a cadence in G major confirms G as the new tonic. The passage has modulated from C major to G major.");
          else fb(false,"Listen to the final harmonic progression and identify the tonic confirmed by the cadence.");
        });
      } }
  },
  objectives:[
    "Define modulation as a true change of key",
    "Distinguish modulation from tonicization",
    "Learn closely related keys",
    "Understand pivot-chord modulation",
    "Introduce direct and phrase modulation",
    "Recognize modulation by cadence and harmonic evidence"
  ],
  steps:[
    { say:"<b>Modulation vs. Tonicization:</b> you just learned <b>tonicization</b> — a brief, local emphasis. <b>Modulation</b> goes further: it establishes a <b>new tonic</b>, confirmed by a cadence, and the music continues in the new key. \u{1F447} <b>Which event provides especially strong confirmation of a modulation?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:13px;text-align:left">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px"><b style="color:#2F6DA8">Tonicization</b><br>• temporary<br>• local emphasis<br>• original key stays active</div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:8px 14px"><b style="color:#C05A21">Modulation</b><br>• a new tonic<br>• new key established<br>• confirmed by a cadence<br>• music continues in the new key</div></div>` },
      try:{ type:"mc", choices:["A cadence that establishes the new tonic","A single isolated accidental","A change in tempo alone"], answer:0,
        success:"✓ Correct. A cadence in the new key is strong evidence of modulation, especially when the surrounding harmony also supports the new tonic.",
        fail:"Determine whether the new tonic receives sustained or structural harmonic confirmation.",
        hint:"Listen for dominant-to-tonic motion in the new key." } },
    { say:"<b>Closely Related Keys:</b> the easiest keys to modulate to share many diatonic chords with the original. For a major key they are its <b>dominant, subdominant, relative minor,</b> and the relative minors of the dominant and subdominant — all within one accidental. \u{1F447} <b>Which list contains the closely related keys of C major?</b>",
      show:{ type:"html", html:`<div style="text-align:center;font-size:14px;line-height:1.9">
        <b style="color:#2F6DA8;font-size:16px">C major</b><br>
        Dominant <b style="color:#2F6DA8">G</b> · Subdominant <b style="color:#2F6DA8">F</b> · Relative minor <b style="color:#C05A21">Am</b> · Rel. of dominant <b style="color:#C05A21">Em</b> · Rel. of subdominant <b style="color:#C05A21">Dm</b><br>
        <span style="font-size:12px;color:#555">All within ±1 accidental — they share the most diatonic chords, so they are the easiest destinations.</span></div>` },
      try:{ type:"mc", choices:["G major, F major, A minor, E minor, and D minor","F♯ major and B♭ minor","C minor only"], answer:0,
        success:"✓ Correct. These keys have the same key signature as C major or differ from it by one accidental. They also share several diatonic chords with C major.",
        fail:"Compare the key signatures and relative-key relationships.",
        hint:"Relative minor, dominant, subdominant, and their relative minors." } },
    { say:"<b>Pivot-Chord Modulation:</b> a pivot chord is diatonic to <b>both</b> keys. The process: old key → reach the shared chord → <b>reinterpret its function</b> → dominant of the new key → cadence → new key. The pivot changes <b>function, not spelling</b> — the same notes get a new Roman numeral. \u{1F447} <b>What must be true of a diatonic pivot chord?</b>",
      show:{ type:"html", html:`<div style="text-align:center;font-size:13.5px;line-height:1.9;font-weight:700">
        Old key → shared chord → <span style="color:#A9821F">reinterpret function</span> → V of new key → cadence → new key<br>
        <span style="font-weight:400;font-size:12.5px;color:#555">Am = vi in C  →  ii in G  (same notes, new function)</span></div>` },
      try:{ type:"mc", choices:["It belongs to both the original and destination keys","It must be the tonic triad of both keys","It must contain a chromatic accidental"], answer:0,
        success:"✓ Correct. A pivot chord has a valid diatonic function in both keys, allowing it to be reinterpreted.",
        fail:"Identify A minor's Roman numeral in each key.",
        hint:"Am is vi in C major and ii in G major." } },
    { say:"<b>Direct and Phrase Modulation:</b> <b>direct modulation</b> changes key with <b>no shared pivot chord</b>. <b>Phrase modulation</b> is usually a direct modulation that <b>begins at a new phrase or section</b> — like a final chorus lifted up a step. (They are related ideas, not opposites.) \u{1F447} <b>A final chorus begins one whole step higher without a pivot chord. How is this best described?</b>",
      try:{ type:"mc", choices:["Phrase modulation, a type of direct modulation","Pivot-chord modulation","No modulation"], answer:0,
        success:"✓ Correct. The new key begins at a phrase boundary without a shared pivot chord, creating phrase modulation.",
        fail:"Identify the formal location of the key change.",
        hint:"The new key begins with the new phrase." } },
    { say:"<b>Recognizing Modulation — a checklist:</b><br>✓ a new tonic emerges<br>✓ dominant harmony points toward it<br>✓ a cadence confirms it<br>✓ the music continues in the new key<br>✓ accidentals may support it<br>But <b>accidentals alone do NOT prove modulation</b> — you need the cadence and continued harmony. \u{1F447} <b>A passage in C major introduces F♯, develops dominant harmony directed toward G, and cadences in G major. What has occurred?</b>",
      try:{ type:"mc", choices:["A modulation to G major","A tonicization of ii","No change of tonal center"], answer:0,
        success:"✓ Correct. The pitch collection, dominant preparation, and cadence work together to establish G as the new tonic.",
        fail:"Combine the chromatic, harmonic, and cadential evidence.",
        hint:"The cadence confirms G as tonic." } },
    { say:"<b>Tonicization vs. Modulation:</b> this is the pair students confuse most. A brief applied dominant = tonicization; a cadence-confirmed new key that continues = modulation. \u{1F447} <b>V/V resolves to V, after which the progression continues clearly in the original key. How should the event be classified?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:13.5px;min-width:340px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px;color:#2F6DA8">Tonicization</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px;color:#C05A21">Modulation</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px">brief</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">new key established</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px">local</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">a cadence confirms it</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px">no new cadence</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">the new tonic continues</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px">original key remains</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">functional harmony supports the new key</td></tr></table>` },
      try:{ type:"mc", choices:["Tonicization of V","Modulation to the dominant key","Phrase modulation"], answer:0,
        success:"✓ Correct. V receives temporary dominant emphasis, but the original tonic remains structurally active.",
        fail:"Determine whether V becomes a structurally confirmed tonic or remains a tonicized diatonic chord.",
        hint:"The progression returns immediately to the original key's harmonic syntax." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which modulation technique uses a chord that is diatonic to both the original and destination keys?</b>",
      try:{ type:"mc", choices:["Pivot-chord modulation","Direct modulation","Modulation created by silence alone"], answer:0,
        success:"✓ Correct. The shared chord is reinterpreted from a function in the original key to a function in the new key.",
        fail:"Identify the technique that uses a common chord.",
        hint:"The pivot chord belongs to both keys." } }
  ],
  examples:[
    { caption:"A pivot modulation C→G: I – IV – vi(=ii of G) – V of G – I of G. The Am turns the corner; the cadence confirms the new home.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"C4",d:"w",label:"I (C)"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"A3",d:"w",label:"pivot vi=ii"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"D4",d:"w",label:"V (of G)"},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"G3",d:"w",label:"I (G!)"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:48,octaves:2,labels:true} },
    { caption:"A phrase modulation: the phrase ends in C; the next phrase simply begins in D major — the pop lift, up a whole step.",
      staff:{clef:"treble",tempo:84,notes:[
        {p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"h",label:"C ends"},{bar:"double"},
        {p:"D4",d:"q",label:"D begins!"},{p:"F#4",d:"q"},{p:"A4",d:"q"},{p:"D5",d:"h"},{bar:"final"}],width:560},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"Modulation isn't only major-to-major. In G major, Em is the pivot (vi of G = i of E minor); B7 → Em then cadences in the new minor key.",
      staff:{clef:"treble",tempo:72,notes:[
        {p:"G4",d:"w",label:"I (G)"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"E4",d:"w",label:"pivot vi=i"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"B3",d:"w",label:"V7 (of Em)"},{p:"D#4",d:"w",chord:true},{p:"F#4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"E4",d:"w",label:"i (Em!)"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:57,octaves:1.5833,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Modulation Identification (45s)",
      intro:"Identify modulation types, tonal evidence, and closely related keys.",
      miaIntro:"Tonicization or structurally confirmed new key?",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Modulation","a key change confirmed by cadence"],
        ["Tonicization","a brief visit — no confirming cadence"],
        ["Closely related keys","\u{00B1}1 accidental + relatives"],
        ["Pivot chord","belongs to both keys"],
        ["Direct modulation","the new key just arrives"],
        ["Phrase modulation","new key at the phrase boundary"],
        ["C major's neighbors","G, F, Am, Em, Dm"],
        ["The pop final-chorus lift","phrase modulation"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?"Modulations identified!":null },
    { type:"key-climb", title:"Game 2 · Perform a Pivot-Chord Modulation",
      intro:"Follow the red arrow and press each chord's root — you'll hear the full chord: C → F → Am → D7 → G. Hear Am first as vi in C, then as ii in G.",
      miaIntro:"Press the root, hear the chord. Reinterpret Am, then confirm G with D7–G.",
      spec:{seq:[60,65,57,62,55],
        chords:[[60,64,67],[60,65,69],[57,60,64],[62,66,69,72],[55,62,67,71]],
        names:["C major (I of C)","F major (IV)","A minor (pivot: vi of C = ii of G)","D7 (V of G)","G major (I of G — cadence)"],
        start:53, octaves:1.5833, title:"C to G, via the shared chord"},
      result:(score)=>score!==null?"You performed the pivot-chord modulation.":null },
    { type:"order-tap", title:"Game 3 · Build the Pivot Modulation",
      intro:"Arrange the stages of a pivot-chord modulation.",
      miaIntro:"Original key → pivot chord → new-key dominant → new-key tonic.",
      spec:{sequence:["Establish the old key","Reach the shared (pivot) chord","Treat it as the NEW key's chord","Cadence in the new key"],
        title:"Four stages of a smooth move"},
      result:(stars)=>stars>=2?"You arranged the modulation correctly.":null },
    { type:"term-race", title:"Game 4 · Closely Related Keys",
      intro:"Identify the closely related keys of each major key.",
      miaIntro:"Include the relative minor, dominant, subdominant, and their relative minors.",
      spec:{rounds:8, reverse:true, pool:[
        ["C major's sharp-side neighbor","G major"],
        ["C major's flat-side neighbor","F major"],
        ["C major's relative","A minor"],
        ["G major's relative","E minor"],
        ["F major's relative","D minor"],
        ["G major's neighbors include","C and D major"],
        ["Distant from C major","F♯ major"],
        ["Relative keys share","the same key signature"]]},
      result:(score)=>score>=6?"You identified the closely related keys correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on modulation types, tonal evidence, closely related keys, and pivot chords.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Modulation","confirmed key change"],["Pivot","shared chord"],["Direct","no shared pivot chord"],["Phrase","at the phrase line"],["Closely related","\u{00B1}1 accidental"]], reverse:true}, count:6 },
    { gen:"rel-key", params:{ask:"both"}, count:3 },
    { type:"mc", q:"Which event provides especially strong confirmation of a new key?", choices:["A cadence establishing the new tonic","One isolated accidental","A rest"], answer:0,
      explain:"The new key must cadence." },
    { type:"mc", q:"Which list contains the closely related keys of C major?", choices:["G major, F major, A minor, E minor, and D minor","D major, B♭ major, and F♯ minor","A minor only"], answer:0,
      explain:"±1 accidental + relatives." },
    { type:"mc", q:"A pivot chord belongs to…", choices:["both the old and new keys","neither key","only the new key"], answer:0,
      explain:"The shared doorway." },
    { type:"mc", q:"Am can pivot between C major and G major because it is…", choices:["vi in C and ii in G","the tonic of both","V in both"], answer:0,
      explain:"Double membership." },
    { type:"truefalse", q:"Tonicization and modulation establish a new key with equal structural strength.", answer:false,
      explain:"Visit vs confirmed move." },
    { type:"truefalse", q:"Phrase modulation begins the new key at a phrase or section boundary.", answer:true,
      explain:"The pop-lift design." },
    { type:"truefalse", q:"Relative major and minor keys share the same key signature.", answer:true,
      explain:"C/Am, G/Em, F/Dm." },
    { gen:"rel-key", params:{ask:"both"}, count:2 },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 }
  ],
  vocabulary:[
    {term:"Modulation", def:"A change of key confirmed by a cadence in the new key."},
    {term:"Closely Related Keys", def:"Keys sharing most diatonic chords (usually differing by one accidental or a relative relationship)."},
    {term:"Pivot Chord", def:"A chord belonging to both keys that smooths the modulation."},
    {term:"Direct / Phrase Modulation", def:"Direct: changes key without a pivot chord. Phrase: a direct modulation that begins at a new phrase or section."}
  ],
  mistakes:[],
  summary:[
    "✔ Modulation establishes a <b>new key</b>.",
    "✔ A confirming <b>cadence</b> is the strongest evidence.",
    "✔ Tonicization is temporary; modulation is structural.",
    "✔ <b>Closely related keys</b> share many diatonic chords.",
    "✔ <b>Pivot chords</b> belong to both keys but change harmonic function.",
    "✔ <b>Direct</b> modulation changes keys without a pivot.",
    "✔ <b>Phrase</b> modulation is usually a direct modulation at a phrase or section boundary.",
    "✔ Accidentals alone do not prove modulation."
  ],
  tips:[
    "Find pivots fast: list the old key's triads, the new key's triads, and circle the shared ones.",
    "The V of the NEW key is the modulation's engine — the pivot just steers toward it.",
    "Final-chorus lifts are phrase modulations up a half or whole step — count them in tonight's playlist.",
    "Unit 24 complete! Next unit: ornaments, variations and the grand forms."
  ],
  rewards:{ badge:"Key Traveler", icon:"\u{1F5FA}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Distinguish brief tonicization from structurally confirmed modulation.",
  quiz:[
    { type:"mc", q:"Modulation occurs when music…", choices:["establishes a new tonic and key","increases its dynamic level","repeats a motive"], answer:0,
      explain:"A cadence and continued harmonic emphasis can provide strong confirmation of the new key.", hint:"Move, not visit." },
    { type:"mc", q:"Which evidence most strongly distinguishes modulation from brief tonicization?", choices:["Structural confirmation of the new tonic through cadence, continued harmony, or formal emphasis","A change in tempo","A change of clef"], answer:0,
      explain:"The new tonic receives more substantial structural confirmation.", hint:"Lesson 98's line." },
    { type:"mc", q:"For a major key, closely related keys generally have key signatures that…", choices:["are identical to or differ by one accidental","differ by exactly three accidentals","must be identical"], answer:0,
      explain:"The neighborhood rule.", hint:"±1." },
    { type:"mc", q:"Which list contains the closely related keys of C major?", choices:["G major, F major, A minor, E minor, and D minor","D major, A major, and E major","C♯ major only"], answer:0,
      explain:"Five neighbors.", hint:"Two majors, three minors." },
    { type:"mc", q:"A diatonic pivot chord…", choices:["belongs to both the original and destination keys","must be the tonic of the destination key","must contain the destination key's new accidental"], answer:0,
      explain:"The same chord is reinterpreted with a different Roman-numeral function.", hint:"Double citizenship." },
    { type:"mc", q:"A minor functions as vi in C major and ii in G major. In a modulation from C to G, it can serve as…", choices:["A pivot chord","A pedal point","A deceptive cadence"], answer:0,
      explain:"One chord, two passports.", hint:"Both keys claim it." },
    { type:"mc", q:"A final chorus begins one whole step higher at a phrase boundary without a pivot chord. What type of modulation occurs?", choices:["Phrase modulation","Pivot-chord modulation","Tonicization"], answer:0,
      explain:"The pop lift.", hint:"New phrase, new key." },
    { type:"mc", q:"A new key is established without a diatonic pivot chord. Which broad technique is used?", choices:["Direct modulation","Pivot-chord modulation","Tonicization only"], answer:0,
      explain:"No diatonic pivot chord is used.", hint:"No doorway." },
    { type:"truefalse", q:"Accidentals consistent with a new key can provide evidence of modulation, but they are not sufficient by themselves.", answer:true,
      explain:"Accidentals help but are not sufficient alone.", hint:"The tell-tale sharps/flats." },
    { type:"truefalse", q:"A single V/V–V motion followed by an immediate return to the original key is normally a modulation.", answer:false,
      explain:"It normally represents tonicization of V.", hint:"No cadence, no move." },
    { type:"mc", q:"Which key is not closely related to G major?", choices:["E♭ major","D major","C major"], answer:0,
      explain:"E♭ major is more distantly related.", hint:"Count the signature gap." },
    { type:"mc", q:"Which sequence describes a common pivot-chord modulation process?", choices:["Original key → pivot chord → dominant of the new key → cadence in the new key","Cadence in the new key → pivot chord → original key","New key → original key without confirmation"], answer:0,
      explain:"The pivot chord is reinterpreted before the new key receives dominant and cadential confirmation.", hint:"Doorway before proof." },
    { type:"mc", q:"Which event most clearly confirms a modulation to G major?", choices:["A V–I (D→G) cadence in G major","A single F♯ in the melody","A change of tempo"], answer:0,
      explain:"A cadence in the NEW key is the strongest confirmation.", hint:"Dominant-to-tonic in G." },
    { type:"mc", q:"In a modulation from C major to G major, which accidental functions as the new leading tone?", choices:["F♯","B♭","C♯"], answer:0,
      explain:"F♯ is the leading tone of G and points to the new tonic.", hint:"A half step below G." },
    { type:"mc", q:"A phrase cadences in G with D7→G and the music continues in G. Is this tonicization or modulation?", choices:["Modulation — a cadence confirms the new key and it continues","Tonicization — just a brief visit","Neither"], answer:0,
      explain:"A confirming cadence plus continuation in the new key = modulation.", hint:"Did the new key get its own cadence?" }
  ],
  miaPerfect:"Perfect score! You accurately identified tonicization, pivot-chord modulation, direct modulation, and phrase modulation.",
  miaPass:"You passed and completed unit 24. Next, you will study melodic ornaments.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The F♯ arrived and a cadence confirmed G major — the piece modulated from C major to G major.",
      play:()=>{const ROWS=[[60,64,67],[60,65,69],[62,66,69],[62,67,71],[62,66,69,72],[55,62,67,71]];ROWS.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.75,i*.8,.26)));} },
    learn:{ label:"modulation",
      explain:"Key change + confirming cadence. Closely related keys (±1 accidental + relatives). Pivot (shared chord), direct (no pivot chord), phrase (at the boundary).",
      hint:"Cadence = proof.",
      play:()=>{[62,66,69].forEach(m=>MFAudio.tone(m,.8,.05,.27));[55,59,62,67].forEach(m=>MFAudio.tone(m,1.0,.95,.27));} },
    example:{ label:"the examples",
      explain:"Example 1 pivots C→G through Am; example 2 lifts a whole step at the phrase line — the pop modulation." },
    game:{ label:"the games",
      explain:"Sprint the types, walk the pivot route, stage the move in order, then race the neighbor keys.",
      hint:"±1 accidental = neighbors." },
    quiz:{ label:"this question",
      explain:"Evidence: a new tonic emphasized, dominant harmony, and — decisive — a cadence in the new key.",
      play:()=>{[62,66,69].forEach(m=>MFAudio.tone(m,.8,.05,.27));[55,59,62].forEach(m=>MFAudio.tone(m,.9,.95,.27));} }
  }
};
