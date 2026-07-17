/* Lesson 84 — Transposition (Book 4, Unit 21 — SELF-AUTHORED)
   Core: TRANSPOSE = rewrite/perform music at a new pitch level; every note
   moves the SAME interval; scale degrees stay identical. Methods: by
   interval, by key (new signature + same degrees). Why: singer range,
   instrument range, transposing instruments (intro).
   NOTE: edit by FULL-FILE REWRITE only. */

/* play-the-transposition: perform C-major motive, then the same motive from G */
function MF_L84_play(container,fb){
  const ROUNDS=[
    {name:"Original in C", seq:[60,64,67,64,60], names:["C","E","G","E","C"]},
    {name:"Transposed to G (up a P5)", seq:[67,71,74,71,67], names:["G","B","D","B","G"]}];
  let r=0,k=0;
  container.innerHTML=`<div class="big-q l84p-q" style="text-align:center"></div>
    <div class="l84p-kb"></div>`;
  const q=container.querySelector(".l84p-q"), kh=container.querySelector(".l84p-kb");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! Same scale-degree pattern and melodic contour, new pitch level — you transposed it."; return; }
    const R=ROUNDS[r];
    q.innerHTML=`${R.name}: play <b>${R.names[k]}</b> (${k+1} of ${R.seq.length}).`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      if(m%12===R.seq[k]%12){ k++;
        if(k>=R.seq.length){ MFAudio.yay(); fb(true, r===0? "✓ The motive in C. Now the same scale-degree pattern starting on G — every note up a perfect 5th.":"✓ Transposed! Every note moved up a P5; the melodic contour and the scale-degree pattern stayed the same."); r++; k=0; setTimeout(ask,1200); }
        else ask();
      } else { MFAudio.tone(40,.2); fb(false,`Play ${R.names[k]} — the same melodic contour, note by note.`); }
    }});
  ask();
}

LESSON_CONTENT[84]={
  welcome:"Transposition moves music to a different pitch level.",
  hook:{
    say:"Listen to two versions of the same melody. The second begins at a higher pitch, but its contour and rhythm remain the same. \u{1F447} <b>What happened?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Version 1</button>
          <button class="play hk-b">▶ Version 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Every note moved up by the same interval</button><button>The rhythm changed</button><button>Each note moved by a random interval</button></div>`;
        const A=[60,62,64,65,67,64,60], B=[67,69,71,72,74,71,67];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ A.forEach((m,i)=>MFAudio.tone(m,.36,i*.3,.42)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2400); };
        container.querySelector(".hk-b").onclick=()=>{ B.forEach((m,i)=>MFAudio.tone(m,.36,i*.3,.42)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Every note moved up a perfect fifth, transposing the melody from C major to G major. Its rhythm, melodic contour, and scale-degree pattern remain the same.");
          else fb(false,"The rhythm and melodic contour remain the same. Compare the opening pitches of the two versions.");
        });
      } }
  },
  objectives:[
    "Define transposition: the same music at a new pitch level",
    "Transpose by interval: move every note the same distance",
    "Transpose by key: new key signature, same scale degrees",
    "Know why musicians transpose: voice range, instrument range",
    "Meet transposing instruments (introduction)",
    "Perform a motive in two keys"
  ],
  steps:[
    { say:"<b>Transposition:</b> To transpose music is to <b>rewrite or perform it at a different pitch level</b>. In exact interval transposition, every pitch moves by the <b>same interval</b>. In tonal transposition from one key to another, the <b>scale-degree relationships</b> are preserved. The rhythm normally remains unchanged. \u{1F447} <b>What normally remains unchanged when a melody is transposed?</b>",
      try:{ type:"mc", choices:["Its rhythm and melodic contour","Only its opening note","Its original pitch level"], answer:0,
        success:"✓ Correct. The pitch level changes, while the rhythm and intervallic or scale-degree relationships are preserved.",
        fail:"Compare the rhythm and melodic contour of the two versions.",
        hint:"Focus on what remains unchanged when the pitch level moves." } },
    { say:"<b>Method 1 — Transpose by Interval:</b> Choose a direction and interval, and move <b>every pitch</b> by that exact interval. C–D–E transposed up a major second becomes D–E–F♯. Check each accidental to preserve the interval exactly. \u{1F447} <b>C–D–E transposed up a major second becomes…</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"1"},{p:"D4",d:"q",label:"2"},{p:"E4",d:"q",label:"3"},
        {p:"D4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"F#4",d:"q",label:"3"},{bar:"final"}],width:460} },
      try:{ type:"mc", choices:["D–E–F♯","D–E–F","C♯–D♯–E♯"], answer:0,
        success:"✓ Correct. A major second above E is F♯. F♮ would be only a minor second above E.",
        fail:"A major second equals one whole step. Which note is one whole step above E?",
        hint:"E to F♯ is a whole step." } },
    { say:"<b>Method 2 — Transpose by Key:</b> Identify each note's <b>scale degree</b> in the original key. Write the new key signature, and then place each note on the <b>corresponding scale degree</b> of the new key. Scale degrees 1–2–3 in C major, C–D–E, become scale degrees 1–2–3 in F major, F–G–A. \u{1F447} <b>Which notes are scale degrees 5–3–1 in G major?</b>",
      try:{ type:"mc", choices:["D–B–G","G–E–C","D–B♭–G"], answer:0,
        success:"✓ Correct. In G major, scale degree 5 is D, scale degree 3 is B, and scale degree 1 is G.",
        fail:"Identify the first, third, and fifth degrees of the G major scale.",
        hint:"G major begins G–A–B–C–D." } },
    { say:"<b>Why Transpose?</b> Musicians transpose music to fit a <b>singer's range</b>, match an <b>instrument</b>, or play in a more <b>practical key</b>. The melody stays the same — only the pitch level changes. \u{1F447} <b>A song lies too high for a singer's comfortable range. What is the most appropriate solution?</b>",
      try:{ type:"mc", choices:["Transpose the entire song down to a suitable key","Ask the singer to continue above a comfortable range","Remove individual high notes without adjusting the melody"], answer:0,
        success:"✓ Correct. Transposing the complete song downward preserves its melodic relationships while placing it in a more comfortable range.",
        fail:"Preserve the melody's relationships while changing its overall pitch level.",
        hint:"Move the complete song to a lower key." } },
    { say:"<b>Transposing Instruments — Introduction:</b> Some instruments <b>sound a different pitch than what is written</b>. For example, a written C on a <b>B♭ trumpet sounds concert B♭</b>. (For now, just recognize the idea.) \u{1F447} <b>On a standard B♭ trumpet, what concert pitch sounds when the performer plays written C?</b>",
      try:{ type:"mc", choices:["B♭, a major second below written C","C, exactly as written","D, a major second above written C"], answer:0,
        success:"✓ Correct. On a B♭ trumpet, written C sounds concert B♭, a major second lower.",
        fail:"For many conventional transposing instruments, the instrument's designation identifies the concert pitch produced by written C.",
        hint:"On a B♭ trumpet, written C sounds concert B♭." } },
    { say:"Perform the same scale-degree pattern in two different keys. \u{1F447}",
      try:{ type:"custom",
        hint:"Play scale degrees 1–3–5–3–1 in C major, and then play the same scale-degree pattern in G major.",
        mount:(container,fb)=>MF_L84_play(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>A melody is transposed from F major to A major by moving upward. Each pitch moves…</b>",
      try:{ type:"mc", choices:["Up a major third — the same interval is applied consistently","Up a perfect fourth","Up a major second"], answer:0,
        success:"✓ Correct. A is a major third above F, so every pitch moves up by a major third.",
        fail:"Apply the same upward interval to every pitch.",
        hint:"Determine the ascending interval from F to A." } }
  ],
  examples:[
    { caption:"One motive, three keys: C major, F major, G major. The scale degrees (1-2-3-5-3-1) never change — only the starting pitch.",
      staff:{clef:"treble",tempo:104,notes:[
        {p:"C4",d:"8"},{p:"D4",d:"8"},{p:"E4",d:"8"},{p:"G4",d:"8"},{p:"E4",d:"8"},{p:"C4",d:"8"},{bar:"single"},
        {p:"F4",d:"8"},{p:"G4",d:"8"},{p:"A4",d:"8"},{p:"C5",d:"8"},{p:"A4",d:"8"},{p:"F4",d:"8"},{bar:"single"},
        {p:"G4",d:"8"},{p:"A4",d:"8"},{p:"B4",d:"8"},{p:"D5",d:"8"},{p:"B4",d:"8"},{p:"G4",d:"8"},{bar:"final"}],
        beams:[[0,2],[3,5],[7,9],[10,12],[14,16],[17,19]],width:660},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"Accidentals keep intervals exact: the motive D-F♯-A in D major becomes E♭-G-B♭ in E♭ major — every note up a half step.",
      staff:{clef:"treble",tempo:96,notes:[
        {p:"D4",d:"q"},{p:"F#4",d:"q"},{p:"A4",d:"h"},{bar:"single"},
        {p:"Eb4",d:"q"},{p:"G4",d:"q"},{p:"Bb4",d:"h"},{bar:"final"}],width:480},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Transposition Sprint (45s)",
      intro:"Identify transposition methods, purposes, and interval relationships before time runs out.",
      miaIntro:"Preserve the musical relationships at a new pitch level.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Transpose","perform music at a new pitch level"],
        ["What moves","every note, by the SAME interval"],
        ["What stays","shape, rhythm, scale degrees"],
        ["Method 1","move each note by the interval"],
        ["Method 2","new key signature + same degrees"],
        ["Why transpose","singer or instrument range"],
        ["B♭ trumpet's written C","sounds B♭"],
        ["Exact intervals need","the right accidentals"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Transposition challenge completed!":null },
    { type:"key-climb", title:"Game 2 · One Motive, Two Keys",
      intro:"Play scale degrees 1–2–3–1 in C major and then in F major.",
      miaIntro:"Preserve the scale-degree pattern in both keys.",
      spec:{seq:[60,62,64,60, 65,67,69,65],
        names:["C (1)","D (2)","E (3)","C (1)","F (new 1!)","G (2)","A (3)","F (1)"],
        start:60, octaves:0.9167, title:"The same degrees in two keys"},
      result:(score)=>score!==null?"You performed the motive correctly in both keys.":null },
    { type:"symbol-hunt", title:"Game 3 · Find the Transposition",
      intro:"The original pattern is C–E–G. Select the requested transposition in each round.",
      miaIntro:"Apply the same interval and direction to every note.",
      spec:{rounds:6, pool:[
        {label:"Up a P5 (G-B-D)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"}],width:160}},
        {label:"Up a M2 (D-F♯-A)", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"F#4",d:"q"},{p:"A4",d:"q"}],width:160}},
        {label:"Up a P4 (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"C5",d:"q"}],width:160}},
        {label:"The original (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"}],width:160}}]},
      result:(score)=>score>=5?"You identified each transposition correctly.":null },
    { type:"term-race", title:"Game 4 · Scale-Degree Translator",
      intro:"Identify the pitch that corresponds to each scale degree in the given key.",
      miaIntro:"Begin with the key's tonic and count through the scale.",
      spec:{rounds:8, reverse:true, pool:[
        ["Degree 1 in G major","G"],
        ["Degree 3 in G major","B"],
        ["Degree 5 in F major","C"],
        ["Degree 1 in D major","D"],
        ["Degree 3 in F major","A"],
        ["Degree 5 in G major","D"],
        ["Degree 2 in D major","E"],
        ["Degree 3 in D major","F♯"]]},
      result:(score)=>score>=6?"You matched the scale degrees and pitches correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on interval transposition, scale degrees, and transposing instruments. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Transpose","new pitch level"],["Same interval","every note"],["Degrees","stay identical"],["New key","new signature"],["B♭ instrument","sounds B♭ on written C"]], reverse:true}, count:6 },
    { gen:"degree-name", params:{ask:"name"}, count:3 },
    { type:"mc", q:"Transposing music means…", choices:["performing or rewriting it at a different pitch level","increasing its tempo","changing its rhythm"], answer:0,
      explain:"The pitch level changes while the essential musical relationships are preserved." },
    { type:"mc", q:"C–D–E transposed up a perfect fourth becomes…", choices:["F–G–A","G–A–B","E–F–G"], answer:0,
      explain:"Every note up a perfect 4th." },
    { type:"mc", q:"In a tonal transposition from one key to another, each diatonic note normally retains its…", choices:["scale-degree function","original pitch","original written accidental"], answer:0,
      explain:"Degree 3 stays degree 3 in the new key." },
    { type:"mc", q:"A song lies too low for a singer. To place it in a more comfortable range, transpose the complete song…", choices:["upward","farther downward","by changing only its lowest note"], answer:0,
      explain:"Move the whole song up." },
    { type:"truefalse", q:"In exact interval transposition, every pitch moves in the same direction by the same interval.", answer:true,
      explain:"That is the definition." },
    { type:"truefalse", q:"Transposition normally changes a melody's rhythm.", answer:false,
      explain:"Only pitch level changes." },
    { type:"truefalse", q:"On a standard B♭ trumpet, written C sounds concert C.", answer:false,
      explain:"Written C sounds concert B♭, a major second lower." },
    { gen:"term-match", params:{subject:"term", pool:[["Up a M2 from E","F♯"],["Up a P5 from C","G"],["Up a P4 from D","G"],["Up a M3 from F","A"]], reverse:true}, count:3 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 }
  ],
  vocabulary:[
    {term:"Transposition", def:"Rewriting or performing music at a new pitch level — every note moves the same interval."},
    {term:"Transposing by Interval", def:"Pick the interval; move each note exactly that far, accidentals included."},
    {term:"Transposing by Key", def:"Write the new key signature; place each note on the same scale degree."},
    {term:"Transposing Instrument", def:"An instrument that sounds a different pitch than written — a B♭ trumpet's written C sounds B♭."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Transpose</b> = same music, <b>new pitch level</b>; shape, rhythm and degrees survive.",
    "✔ By interval: <b>every note the same distance</b> — mind the accidentals.",
    "✔ By key: <b>new signature + same scale degrees</b>.",
    "✔ Reasons: <b>voice range, instrument range, easier keys</b>.",
    "✔ Transposing instruments sound <b>away from written</b> — B♭ trumpet: written C sounds B♭."
  ],
  tips:[
    "Check a transposition fast: play both versions' FIRST notes — that interval must hold for every pair.",
    "Singers ask for keys, not notes: 'take it down a whole step' = transpose everything down a M2.",
    "The degree method beats the interval method in fast sessions — think 1-3-5, not letter names.",
    "Next lesson: build a triad on EVERY degree of the scale — the diatonic seven."
  ],
  rewards:{ badge:"Key Mover", icon:"\u{1F4E6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Apply one interval consistently and preserve scale-degree relationships between keys.",
  quiz:[
    { type:"mc", q:"Transposition means…", choices:["performing music at a different pitch level","repeating a motive","changing the meter"], answer:0,
      explain:"Transposition moves music to a different pitch level while preserving its essential relationships.", hint:"Move the whole thing." },
    { type:"mc", q:"In exact interval transposition, every pitch moves…", choices:["by the same interval","by different intervals","only if it is sharp"], answer:0,
      explain:"In exact interval transposition, every pitch moves in the same direction by the same interval.", hint:"Uniform motion." },
    { type:"mc", q:"C–E–G transposed up a perfect fifth becomes…", choices:["G–B–D","F–A–C","A–C–E"], answer:0,
      explain:"C–E–G transposed up a perfect fifth becomes G–B–D.", hint:"C→G leads the way." },
    { type:"mc", q:"E transposed up a major 2nd is…", choices:["F♯","F","G"], answer:0,
      explain:"A major second above E is F♯.", hint:"Watch the accidental." },
    { type:"mc", q:"In the key method, notes keep their…", choices:["scale degrees","letter names","octave"], answer:0,
      explain:"In tonal transposition, diatonic notes retain their corresponding scale degrees.", hint:"Think numbers." },
    { type:"mc", q:"Scale degrees 1–2–3 of F major are…", choices:["F–G–A","F–G–A♭","C–D–E"], answer:0,
      explain:"Scale degrees 1–2–3 of F major are F–G–A.", hint:"F major has one flat — B♭." },
    { type:"mc", q:"Identify the relationship.",
      staff:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"D4",d:"q"},{p:"F#4",d:"q"},{p:"A4",d:"q"}],width:340},
      choices:["The second group is the first transposed up a major second","The groups are unrelated","The second group is an inversion of the first"], answer:0,
      explain:"C–E–G becomes D–F♯–A. Each pitch moves up a major second.", hint:"Compare note by note." },
    { type:"mc", q:"Why might a song be transposed for a singer?", choices:["To place it within the singer's comfortable range","To increase its duration","To change its lyrics"], answer:0,
      explain:"Transposition can place the song's highest and lowest pitches within a suitable vocal range.", hint:"Too high? Move it down." },
    { type:"mc", q:"On a standard B♭ trumpet, written C sounds which concert pitch?", choices:["B♭","C","D"], answer:0,
      explain:"On a B♭ trumpet, written C sounds concert B♭.", hint:"Named for its note." },
    { type:"truefalse", q:"In tonal transposition, corresponding notes retain their scale-degree functions in the new key.", answer:true,
      explain:"Degrees are exactly what it preserves.", hint:"1-3-5 stays 1-3-5." },
    { type:"truefalse", q:"Preserving exact intervals during transposition may require different accidentals.", answer:true,
      explain:"For example, a major second above E is F♯ rather than F♮.", hint:"Exactness first." },
    { type:"mc", q:"A melody in D major is transposed upward to G major. Every pitch moves…", choices:["up a perfect fourth","up a major third","up a perfect fifth"], answer:0,
      explain:"G is a perfect fourth above D. If the direction were downward, G would be a perfect fifth below D.", hint:"Determine the ascending interval from D to G." }
  ],
  miaPerfect:"Perfect score! You accurately transposed melodies by interval and by scale degree.",
  miaPass:"You passed! Next, you will construct diatonic triads on every scale degree.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Version 2 was version 1 moved up a perfect 5th — a transposition from C major to G major. Shape and degrees untouched.",
      play:()=>{[67,69,71,72,74,71,67].forEach((m,i)=>MFAudio.tone(m,.36,i*.3,.42));} },
    learn:{ label:"transposition",
      explain:"Same music, new pitch level. By interval (every note the same distance) or by key (new signature, same degrees). Reasons: ranges, ease. B♭ instruments sound lower than written.",
      hint:"One interval for every note.",
      play:()=>{[60,64,67].forEach((m,i)=>MFAudio.tone(m,.4,i*.35,.42));[62,66,69].forEach((m,i)=>MFAudio.tone(m,.4,1.3+i*.35,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 sends one motive through three keys by degrees; example 2 shows accidentals keeping the intervals exact." },
    game:{ label:"the games",
      explain:"Sprint the facts, play a motive in two keys, spot transpositions on cards, then translate degrees at speed.",
      hint:"Think degrees, not letters." },
    quiz:{ label:"this question",
      explain:"Two tools: the constant interval (check any note pair) and the degree method (1-3-5 stays 1-3-5 in any key).",
      play:()=>{[60,62,64].forEach((m,i)=>MFAudio.tone(m,.38,i*.32,.42));[65,67,69].forEach((m,i)=>MFAudio.tone(m,.38,1.2+i*.32,.42));} }
  }
};
