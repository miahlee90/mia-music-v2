/* Lesson 86 — Roman Numeral Analysis (Book 4, Unit 21 — SELF-AUTHORED)
   Core: numerals name each chord's DEGREE + QUALITY, portable to any key.
   HARMONIC FUNCTION: Tonic (I, vi) = rest · Predominant (ii, IV) = motion
   toward D · Dominant (V, vii°) = tension seeking T. Flow: T → PD → D → T.
   Color code: T = blue #2F6DA8 · PD = gold #A9821F · D = orange #C05A21.
   NOTE: edit by FULL-FILE REWRITE only. */

/* label the progression: hear 4 chords, pick the numeral for each */
function MF_L86_label(container,fb){
  const CH={I:[60,64,67],ii:[62,65,69],IV:[65,69,72],V:[67,71,74],vi:[69,72,76]};
  const PROG=["I","IV","V","I"], PROG2=["I","vi","ii","V"];
  let stage=0, k=0, cur=PROG;
  container.innerHTML=`<div class="big-q l86l-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l86l-play">▶ Hear chord</button></div>
    <div class="choices chips l86l-ch"><button>I</button><button>ii</button><button>IV</button><button>V</button><button>vi</button></div>
    <div class="l86l-map" style="text-align:center;font-weight:800;letter-spacing:4px;margin-top:6px"></div>`;
  const q=container.querySelector(".l86l-q"), pl=container.querySelector(".l86l-play"), ch=container.querySelector(".l86l-ch"), map=container.querySelector(".l86l-map");
  const done=[];
  function draw(){ map.textContent=cur.map((c,i)=>i<done.length?done[i]:"?").join("  "); }
  function ask(){
    draw();
    if(k>=cur.length){
      if(stage===0){ stage=1; cur=PROG2; k=0; done.length=0; fb(true,"✓ I-IV-V-I labeled! Now a longer trip: listen for the vi and ii."); setTimeout(ask,1500); return; }
      q.textContent="Excellent! Both progressions analyzed."; pl.style.display="none"; ch.style.display="none"; return;
    }
    q.innerHTML=`Progression ${stage+1} — chord ${k+1} of 4. Hear it, then choose its numeral. <i>(Key: C major)</i>`;
  }
  pl.onclick=()=>{ if(k>=cur.length) return; CH[cur[k]].forEach(m=>MFAudio.tone(m,.9,.05,.3)); };
  [...ch.children].forEach(b=>b.onclick=()=>{
    if(k>=cur.length) return;
    if(b.textContent===cur[k]){ CH[cur[k]].forEach(m=>MFAudio.tone(m,.7,.05,.28)); done.push(cur[k]); k++;
      fb(true,`✓ ${done[done.length-1]} — correct.`); setTimeout(ask,900);
    } else { MFAudio.tone(40,.2); fb(false,"Listen again — compare the bass note with the C major scale degrees."); }
  });
  ask();
}

LESSON_CONTENT[86]={stackFigures:true,
  welcome:"Roman-numeral analysis shows how chords relate to a key.",
  hook:{
    say:"<b>Two progressions in different keys can share the same harmonic pattern.</b> Listen to one in C major and one in G major. \u{1F447} <b>What do they have in common?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ In C major</button>
          <button class="play hk-b">▶ In G major</button></div>
          <div class="choices hk-ch" style="display:none"><button>Both follow the progression I-IV-V-I</button><button>Both use exactly the same pitches</button><button>They have no harmonic relationship</button></div>`;
        const A=[[60,64,67],[65,69,72],[67,71,74],[60,64,67]], B=[[67,71,74],[72,76,79],[74,78,81],[67,71,74]];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ A.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.7,i*.75,.28))); hA=true; if(hB) setTimeout(()=>ch.style.display="",3400); };
        container.querySelector(".hk-b").onclick=()=>{ B.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.7,i*.75,.28))); hB=true; if(hA) setTimeout(()=>ch.style.display="",3400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The progressions use different pitches but share the same scale-degree relationships: I-IV-V-I. Roman numerals make those relationships visible.");
          else fb(false,"The two progressions use different chord names, but their relationships to the tonic are the same.");
        });
      } }
  },
  objectives:[
    "Analyze chords with Roman numerals: degree + quality in one symbol",
    "Know why numerals are portable across keys",
    "Identify each triad's common FUNCTION: Tonic, Predominant or Dominant",
    "Follow the common function flow: T → PD → D → T",
    "Label progressions by ear and by eye",
    "Read function colors: T = blue, PD = gold, D = orange"
  ],
  steps:[
    { say:"<b>Roman-Numeral Analysis:</b> A Roman numeral identifies a chord's <b>root by scale degree</b>. Capitalization and quality symbols identify the chord's <b>quality</b>. For example, IV in C major represents a major triad rooted on F, the fourth scale degree. Figured-bass symbols may also show the chord's inversion. Because Roman numerals describe relationships within a key, the same progression pattern can be transposed to different keys. \u{1F447} <b>What information can a basic Roman numeral provide?</b>",
      try:{ type:"mc", choices:["The chord's root scale degree and quality","The tempo and articulation","The text and language"], answer:0,
        success:"✓ Correct. The numeral identifies the root's scale degree, while capitalization and symbols indicate chord quality.",
        fail:"Examine both the numeral and its capitalization or quality symbol.",
        hint:"Identify the root scale degree and chord quality." } },
    { say:"<b>Harmonic Function:</b> chords often participate in three broad functional categories. <b style='color:#2F6DA8'>TONIC (T)</b> — provides stability and centers the key: <b>I</b> is the primary tonic chord, and <b>vi</b> may sometimes serve as a tonic substitute or tonic prolongation · <b style='color:#A9821F'>PREDOMINANT (PD)</b> — prepares the dominant: <b>ii</b> and <b>IV</b> commonly serve this role · <b style='color:#C05A21'>DOMINANT (D)</b> — creates a strong expectation of resolution to tonic: <b>V</b> and <b>vii°</b> are the principal dominant-function triads. \u{1F447} <b>Which pair most commonly serves dominant function in a major key?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Function</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Typical role</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Common chords</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#2F6DA8">Tonic (T)</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">rest, home</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#2F6DA8">I · vi</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#A9821F">Predominant (PD)</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">moves toward D</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#A9821F">ii · IV</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800;color:#C05A21">Dominant (D)</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">tension, seeks home</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#C05A21">V · vii°</td></tr></table>` },
      try:{ type:"mc", choices:["V and vii°","I and vi","ii and IV"], answer:0,
        success:"✓ Correct. Both V and vii° contain the leading tone and commonly resolve toward tonic.",
        fail:"Identify the two principal chords that contain the leading tone and commonly resolve to I.",
        hint:"The triads rooted on scale degrees 5 and 7." } },
    { say:"<b>A Common Functional Progression:</b> a frequently used tonal-harmony pattern is tonic → predominant → dominant → tonic, abbreviated <b style='color:#2F6DA8'>T</b>–<b style='color:#A9821F'>PD</b>–<b style='color:#C05A21'>D</b>–<b style='color:#2F6DA8'>T</b>. Both I-IV-V-I and I-ii-V-I follow this pattern. Tonal music also uses many other progressions and functional combinations. \u{1F447} <b>In the common T–PD–D–T model, which function occurs between predominant and tonic?</b>",
      show:{ type:"html", html:`<div style="text-align:center;font-weight:800;font-size:17px;letter-spacing:1px">
        <span style="color:#2F6DA8">T</span> \u{2192} <span style="color:#A9821F">PD</span> \u{2192} <span style="color:#C05A21">D</span> \u{2192} <span style="color:#2F6DA8">T</span></div>` },
      try:{ type:"mc", choices:["Dominant","Tonic","No harmonic function"], answer:0,
        success:"✓ Correct. In this common model, predominant prepares dominant, and dominant resolves to tonic.",
        fail:"Follow the functional sequence shown in the lesson.",
        hint:"PD → D → T." } },
    { say:"<b>How to Analyze a Chord:</b><br>1. Find the key.<br>2. Find the chord's root.<br>3. Identify its quality.<br>4. Write the Roman numeral. \u{1F447} <b>In C major, how is the root-position chord F-A-C labeled?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"?"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560} },
      try:{ type:"mc", choices:["IV — a major triad rooted on scale degree 4","iv — a minor triad rooted on scale degree 4","ii — a minor triad rooted on scale degree 2"], answer:0,
        success:"✓ Correct. F is scale degree 4 in C major, and F-A-C is a major triad in root position. It is labeled IV and commonly serves predominant function.",
        fail:"Identify the root and determine its scale degree in C major.",
        hint:"Count C-D-E-F." } },
    { say:"<b>Roman Numerals and Inversions:</b> Roman numerals identify a chord's root and quality. If the chord is inverted, figured-bass symbols (such as <b>I⁶</b> and <b>I⁶₄</b>) indicate its inversion. \u{1F447} <b>In C major, how is E-G-C labeled?</b>",
      try:{ type:"mc", choices:["I⁶ — the tonic triad in first inversion","iii — an E minor triad","I⁶₄ — the tonic triad in second inversion"], answer:0,
        success:"✓ Correct. The chord's root is C, but E is in the bass, so the chord is a first-inversion tonic triad: I⁶.",
        fail:"The bass note is not always the root — stack the notes in thirds to find the root first.",
        hint:"Find the root before using the bass note to determine the inversion." } },
    { say:"Identify and label two root-position chord progressions by ear. \u{1F447}",
      try:{ type:"custom",
        hint:"In this activity, every chord is in root position, so each bass note identifies the chord root. In C major: C=I, D=ii, F=IV, G=V, A=vi.",
        mount:(container,fb)=>MF_L86_label(container,fb) } },
    { say:"<b>Why Roman Numerals Transfer Between Keys:</b> the progression I-vi-IV-V describes the same scale-degree and chord-quality relationships in any major key. Chord symbols such as C-Am-F-G identify the progression specifically in C major, while Roman numerals describe its relationship to the key. \u{1F447} <b>How is I-vi-IV-V realized in G major?</b>",
      try:{ type:"mc", choices:["G - Em - C - D","G - Gm - C - D","C - Am - F - G"], answer:0,
        success:"✓ Correct. In G major, I is G major, vi is E minor, IV is C major, and V is D major.",
        fail:"Match each Roman numeral with its diatonic triad in G major.",
        hint:"Scale degree 6 of G major is E." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which pair most commonly serves predominant function?</b>",
      try:{ type:"mc", choices:["ii and IV","I and vi","V and vii°"], answer:0,
        success:"✓ Correct. ii and IV commonly prepare the dominant and therefore serve predominant function.",
        fail:"Predominant chords commonly prepare the dominant.",
        hint:"Identify the chords that commonly precede V." } }
  ],
  examples:[
    { caption:"I-IV-V7-I in C major with its analysis — hear T (home), PD (departure), D (tension), T (return).",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"F4",d:"w",label:"IV"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"V7"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{p:"F5",d:"w",chord:true},
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:600},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"I-vi-ii-V — the classic turnaround: two tonics' worth of rest, then predominant and dominant hand in hand back to the top.",
      staff:{clef:"treble",tempo:80,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"A3",d:"w",label:"vi"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},
        {p:"D4",d:"w",label:"ii"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},
        {p:"G4",d:"w",label:"V"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"final"}],width:600},
      kb:{start:57,octaves:1.5833,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Harmonic-Function Sprint (45s)",
      intro:"Identify the most likely harmonic function of each chord in context.",
      miaIntro:"Choose tonic, predominant, or dominant.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["I","primary tonic chord"],
        ["vi","common tonic substitute"],
        ["ii","commonly predominant"],
        ["IV","commonly predominant"],
        ["V","primary dominant chord"],
        ["vii°","common dominant substitute"],
        ["A common flow","T \u{2192} PD \u{2192} D \u{2192} T"],
        ["Numerals are portable because","they speak in degrees"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — harmonic functions identified!":null },
    { type:"symbol-hunt", title:"Game 2 · Roman-Numeral Analysis",
      intro:"Examine each chord in C major and select its Roman numeral.",
      miaIntro:"Identify the root, scale degree, quality, and inversion.",
      spec:{rounds:6, pool:[
        {label:"I (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"ii (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}},
        {label:"V (G-B-D)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"vi (A-C-E)", spec:{clef:"treble",notes:[{p:"A4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You labeled the chords correctly.":null },
    { type:"order-tap", title:"Game 3 · Build a Functional Progression",
      intro:"Arrange the functions to form the common T → PD → D → T progression.",
      miaIntro:"Tonic → predominant → dominant → tonic.",
      spec:{sequence:["Tonic — home (I)","Predominant — departure (IV or ii)","Dominant — tension (V)","Tonic — return (I)"],
        title:"A common functional progression"},
      result:(stars)=>stars>=2?"You completed the functional progression.":null },
    { type:"term-race", title:"Game 4 · Translate the Numerals",
      intro:"Translate I-vi-IV-V into chord symbols in each major key.",
      miaIntro:"Match each numeral with its root and quality.",
      spec:{rounds:8, reverse:true, pool:[
        ["I in G major","G"],
        ["vi in G major","Em"],
        ["IV in G major","C"],
        ["V in G major","D"],
        ["I in F major","F"],
        ["vi in F major","Dm"],
        ["IV in F major","B\u{266D}"],
        ["V in F major","C"]]},
      result:(score)=>score>=6?"You translated the progression correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on Roman numerals, chord inversions, harmonic functions, and common functional progressions. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["I, vi","commonly tonic"],["ii, IV","commonly predominant"],["V, vii°","commonly dominant"],["T\u{2192}PD\u{2192}D\u{2192}T","a common flow"],["Numeral case","quality"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 },
    { type:"mc", q:"A basic Roman numeral identifies a chord's…", choices:["root scale degree and quality","dynamic level and articulation","tempo and meter"], answer:0,
      explain:"Number + case." },
    { type:"mc", q:"Which pair includes the primary tonic chord and a common tonic substitute in major keys?", choices:["I and vi","ii and IV","V and vii°"], answer:0,
      explain:"I is the primary tonic chord, while vi may serve as a tonic substitute or prolongational chord in some contexts." },
    { type:"mc", q:"Which chords commonly serve predominant function in a major key?", choices:["ii and IV","I and V","iii and vii°"], answer:0,
      explain:"They commonly prepare the dominant." },
    { type:"mc", q:"Which sequence represents a common functional progression?", choices:["T → PD → D → T","D → PD → T","PD → T → D"], answer:0,
      explain:"Home, departure, tension, return." },
    { type:"truefalse", q:"V and vii° commonly serve dominant function.", answer:true,
      explain:"Both carry the leading tone." },
    { type:"truefalse", q:"Roman-numeral analysis can describe corresponding chord relationships in different keys.", answer:true,
      explain:"Numerals describe relationships to the tonic, so the same pattern can be applied in different keys." },
    { type:"truefalse", q:"In some contexts, vi can serve as a tonic substitute for I.", answer:true,
      explain:"The vi and I triads share two pitch classes, and vi can provide tonic-related stability in certain contexts. Its function still depends on the progression." },
    { type:"mc", q:"In C major, how is E-G-C labeled?", choices:["I⁶","iii","I⁶₄"], answer:0,
      explain:"C is the root, and E is in the bass, so the tonic triad is in first inversion." },
    { gen:"triad-id", params:{ask:"numeral"}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Roman Numeral Analysis", def:"Labeling each chord by scale degree (number) and quality (case), with figured-bass symbols for inversion — transferable between keys."},
    {term:"Tonic Function (T)", def:"Stability and rest: I is the primary tonic chord; vi may substitute in some contexts."},
    {term:"Predominant Function (PD)", def:"Prepares the dominant: commonly ii and IV."},
    {term:"Dominant Function (D)", def:"Tension seeking resolution to tonic: commonly V and vii° — both carry the leading tone."}
  ],
  mistakes:[],
  summary:[
    "✔ Numeral = <b>degree + quality</b>, with figured bass for <b>inversion</b>; the same pattern transfers <b>between keys</b>.",
    "✔ Common functions: <b style='color:#2F6DA8'>T = I (vi may substitute)</b> · <b style='color:#A9821F'>PD = ii, IV</b> · <b style='color:#C05A21'>D = V, vii°</b>.",
    "✔ A common flow: <b>T → PD → D → T</b> — home, departure, tension, return.",
    "✔ To analyze: key → root → degree → quality → inversion → context.",
    "✔ I-vi-IV-V names the same relationships in any major key."
  ],
  tips:[
    "Analyze the bass line first — in root-position chords the bass is the root, but watch for inversions, where it is not.",
    "When a progression feels 'stuck at home,' look for vi masquerading as tonic.",
    "Translate one favorite song into numerals this week — then play it in three keys from the numerals alone.",
    "Next lesson: where progressions STOP — the cadences."
  ],
  rewards:{ badge:"Harmony Analyst", icon:"\u{1F3DB}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify the key, root, scale degree, quality, inversion, and likely function.",
  quiz:[
    { type:"mc", q:"What information does a basic Roman numeral encode through its numeral, capitalization, and quality symbol?", choices:["Root scale degree and chord quality","Tempo and dynamics","Key signature and meter"], answer:0,
      explain:"Number + case.", hint:"Two in one." },
    { type:"mc", q:"Why can the same Roman-numeral progression be applied in different keys?", choices:["Roman numerals describe relationships to the tonic rather than fixed pitches","Roman numerals ignore chord relationships","Roman numerals apply only to C major"], answer:0,
      explain:"Degrees are key-independent.", hint:"Relationships, not letters." },
    { type:"mc", q:"What are the three broad harmonic-function categories introduced in this lesson?", choices:["Tonic, predominant, and dominant","Loud, soft, and moderate","Fast, slow, and moderate"], answer:0,
      explain:"T, PD, D.", hint:"Home, bridge, tension." },
    { type:"mc", q:"Which pair contains the primary tonic triad and a common tonic substitute?", choices:["I and vi","ii and IV","V and vii°"], answer:0,
      explain:"I is the primary tonic chord; vi may serve as a tonic substitute in some contexts.", hint:"Identify the primary tonic chord and its common substitute." },
    { type:"mc", q:"Which pair commonly serves predominant function?", choices:["ii and IV","I and V","vi and vii°"], answer:0,
      explain:"Both chords commonly prepare the dominant.", hint:"Identify the chords that commonly precede V." },
    { type:"mc", q:"Which pair commonly serves dominant function?", choices:["V and vii°","I and IV","ii and vi"], answer:0,
      explain:"Both chords contain the leading tone and commonly resolve toward tonic.", hint:"Identify the chords rooted on scale degrees 5 and 7." },
    { type:"mc", q:"Which sequence shows a common functional progression?", choices:["T → PD → D → T","D → T → PD","PD → D → PD"], answer:0,
      explain:"Home, departure, tension, return.", hint:"The progression begins and ends with tonic function." },
    { type:"mc", q:"In C major, label the chord.",
      staff:{clef:"treble",notes:[{p:"D4",d:"w"},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:160},
      choices:["ii — D minor, commonly predominant","II — D major","IV — F major"], answer:0,
      explain:"D is scale degree 2 in C major, and D-F-A is a minor triad, so it is labeled ii.", hint:"Root first." },
    { type:"mc", q:"How is I-vi-IV-V realized in F major?", choices:["F - Dm - B♭ - C","F - D - B - C","C - Am - F - G"], answer:0,
      explain:"Degrees 1, 6, 4, 5 of F major.", hint:"F major has B♭." },
    { type:"truefalse", q:"In some major-key contexts, vi can function as a tonic substitute for I.", answer:true,
      explain:"vi shares two tones with I and can provide tonic-like stability in some contexts.", hint:"A-C-E vs C-E-G." },
    { type:"truefalse", q:"IV commonly serves dominant function in a major key.", answer:false,
      explain:"IV commonly serves predominant function and prepares V. Its exact function depends on context.", hint:"Think about which chord IV commonly prepares." },
    { type:"mc", q:"A progression follows I → IV → V → I. Which functional pattern does it represent?", choices:["T → PD → D → T","T → D → PD → T","T → T → T → T"], answer:0,
      explain:"T→PD→D→T — a common functional pattern.", hint:"Map each numeral." },
    { type:"mc", q:"In C major, the notes are G-C-E, with G in the bass. How should the chord be labeled?",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:160},
      choices:["I⁶₄","V","I⁶"], answer:0,
      explain:"C is the chord root, but G is in the bass, placing the tonic triad in second inversion.", hint:"Find the root first; then identify the bass note." }
  ],
  miaPerfect:"Perfect score! You accurately identified chord roots, qualities, inversions, and common harmonic functions.",
  miaPass:"You passed! Next, you will identify cadences and their roles in musical phrases.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both versions played I-IV-V-I — different keys, identical numerals. Roman numerals name what keys share.",
      play:()=>{const B=[[67,71,74],[72,76,79],[74,78,81],[67,71,74]];B.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.7,i*.75,.28)));} },
    learn:{ label:"Roman numeral analysis",
      explain:"Numeral = degree + quality, with figured bass for inversion. Common functions: T (I; vi may substitute), PD (ii, IV), D (V, vii°); a common flow is T→PD→D→T.",
      hint:"Key → root → degree → quality → inversion → context.",
      play:()=>{[[60,64,67],[65,69,72],[67,71,74],[60,64,67]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.6,i*.65,.28)));} },
    example:{ label:"the examples",
      explain:"Example 1 analyzes I-IV-V7-I; example 2 walks the I-vi-ii-V turnaround — hear each function do its job." },
    game:{ label:"the games",
      explain:"Sprint the functions, spot numerals on cards, build the common progression in order, then translate numerals across keys.",
      hint:"Tonic rests, predominant prepares, dominant resolves." },
    quiz:{ label:"this question",
      explain:"Work step by step: identify the key, find the root, count its degree, set the case and inversion, then judge the likely function from context.",
      play:()=>{[[62,65,69],[67,71,74],[60,64,67]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.6,i*.65,.28)));} }
  }
};
