/* Lesson 67 — Composing a Melody in a Major Key (AEMT Book 3, Unit 16 FINALE)
   Built from drafts/UNIT 16 – Lesson 67.md; AEMT3 p.105 verified by render.
   Core: COMPOSE = create a melody for a chord progression (the reverse of
   harmonizing). Method: analyze the progression (numerals below, symbols
   above) → melody from CHORD TONES + non-harmonic decorations. The first
   and last melody note tends to be the ROOT of I; V(7) precedes the last
   chord. The book labels melody notes R / 3 / 5 / 7 / P (chord member or
   passing tone) — as in its Ghanaian folk-song model.
   NOTE: edit by FULL-FILE REWRITE only. */

/* compose-a-melody: pick a chord tone per measure, then hear your piece */
function MF_L67_compose(container,fb){
  const MEAS=[
    {label:"I", sym:"C", tones:{C:60,E:64,G:67}, chord:[48,64,67], must:"C",
      note:"Rule: a melody TENDS TO BEGIN on the root of I."},
    {label:"IV", sym:"F", tones:{F:65,A:69,C:72}, chord:[53,65,69],
      note:"Any tone of F-A-C sings here."},
    {label:"I", sym:"C", tones:{C:72,E:76,G:67}, chord:[48,64,67],
      note:"Back home — pick any C-chord tone."},
    {label:"V7", sym:"G7", tones:{G:67,B:71,D:74,F:77}, chord:[43,67,71,77],
      note:"The dominant before the close — B (the leading tone) loves this spot."},
    {label:"I", sym:"C", tones:{C:72}, chord:[48,64,67], must:"C",
      note:"Rule: end on the ROOT of the final I."}];
  let k=0; const picked=[];
  container.innerHTML=`<div class="big-q l67c-q" style="text-align:center"></div>
    <div class="l67c-map" style="text-align:center;margin:10px 0;letter-spacing:normal"></div>
    <div class="choices chips l67c-ch"></div>
    <div style="text-align:center"><button class="play l67c-play" style="display:none">▶ Play YOUR composition</button></div>`;
  const q=container.querySelector(".l67c-q"), map=container.querySelector(".l67c-map"), ch=container.querySelector(".l67c-ch"), pl=container.querySelector(".l67c-play");
  function drawMap(){
    map.innerHTML=MEAS.map((m,i)=>{
      const done=i<picked.length, cur=(i===k && k<MEAS.length);
      const note=done?picked[i].name:"?";
      const bg=cur?"var(--accent,#4f7cff)":done?"#e6efff":"#f2f4f8";
      const fg=cur?"#fff":done?"#1f4bd8":"#8a93a3";
      const bd=cur?"var(--accent,#4f7cff)":done?"#bcd2ff":"#dde2ea";
      return `<span style="display:inline-block;min-width:56px;margin:3px;padding:6px 6px;border-radius:10px;border:1.5px solid ${bd};background:${bg};color:${fg};text-align:center;vertical-align:top">
        <span style="display:block;font-size:10.5px;font-weight:600;opacity:.85">m.${i+1}</span>
        <span style="display:block;font-size:15px;font-weight:800;line-height:1.35">${m.sym}</span>
        <span style="display:block;font-size:13px;font-weight:700">${note}</span></span>`;
    }).join("");
  }
  function ask(){
    drawMap();
    if(k>=MEAS.length){ q.textContent="Excellent! Your melody is complete. Press play!"; ch.innerHTML=""; pl.style.display="inline-block"; return; }
    const M=MEAS[k];
    q.innerHTML=`Measure ${k+1} — chord: <b>${M.sym} (${M.label})</b>. ${M.must?`<b>Required: ${M.must}</b> — `:""}pick your melody note. <i>${M.note}</i>`;
    ch.innerHTML="";
    const opts=Object.keys(M.tones);
    if(!M.must) opts.push(k===1?"B":"F#"); /* one non-chord-tone distractor */
    opts.sort(()=>Math.random()-.5).forEach(name=>{
      const b=document.createElement("button"); b.textContent=name;
      b.onclick=()=>{
        const M2=MEAS[k];
        if(M2.must && name!==M2.must){ MFAudio.tone(40,.2); fb(false,`The ${k===0?"first":"last"} note tends to be the ROOT of the I chord — that's ${M2.must}.`); return; }
        if(M2.tones[name]===undefined){ MFAudio.tone(40,.2); fb(false,`${name} is not a tone of ${M2.sym} — start with a chord tone. (Passing and neighboring tones come later!)`); return; }
        MFAudio.tone(M2.tones[name],.7,.05,.42);
        M2.chord.forEach(m=>MFAudio.tone(m,.8,.05,.2));
        picked.push({name, midi:M2.tones[name]}); k++;
        fb(true,`✓ Great! ${name} is a chord tone of ${M2.sym} — your melody fits the chords.`);
        setTimeout(ask,1000);
      };
      ch.appendChild(b);
    });
  }
  pl.onclick=()=>{
    picked.forEach((p,i)=>{
      MFAudio.tone(p.midi,.8,i*.85,.44);
      MEAS[i].chord.forEach(m=>MFAudio.tone(m,.85,i*.85,.2));
    });
    setTimeout(()=>fb(true,"✓ Your composition begins on the root and closes V7 → I on the root. Try again — every choice makes a new melody!"),4700);
  };
  ask();
}

LESSON_CONTENT[67]={
  welcome:"Composing: writing a melody for a chord progression. \u{270D}\u{FE0F}",
  hook:{
    say:"<b>Here is a simple chord progression:</b> I - IV - I - V7 - I. Listen to the chords alone, then with a melody composed on top. <b>How can you create a melody that fits these chords?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chords alone</button>
          <button class="play hk-b">▶ Chords + composed melody</button></div>
          <div class="choices hk-ch" style="display:none"><button>Build it from each chord's own tones</button><button>Use notes from a different key</button><button>Pick random notes</button></div>`;
        const chords=[[48,64,67],[53,65,69],[48,64,67],[43,67,71,77],[48,64,67]];
        const mel=[72,69,76,74,72];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ chords.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.25))); hA=true; if(hB) setTimeout(()=>ch.style.display="",4700); };
        container.querySelector(".hk-b").onclick=()=>{ chords.forEach((row,i)=>{ row.forEach(m=>MFAudio.tone(m,.85,i*.9,.2)); MFAudio.tone(mel[i],.8,i*.9,.44); }); hB=true; if(hA) setTimeout(()=>ch.style.display="",4700); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Each melody note was a CHORD TONE of its measure's chord — C from C major, A from F major, E from C, D from G7, back to C. Today you compose your own!");
          else fb(false,"Listen again — every melody note agreed perfectly with its chord…");
        });
      } }
  },
  objectives:[
    "Define composing: creating a melody for a chord progression",
    "Analyze first: numerals below the staff, symbols above",
    "Build the melody from CHORD TONES",
    "Add passing and neighboring tones",
    "Begin and end on the root of I; V(7) precedes the last chord",
    "Read the R / 3 / 5 / P melody labels"
  ],
  steps:[
    { say:"<b>Composing a Melody:</b> Instead of adding chords to a melody, you will write a melody that fits a chord progression. \u{1F447} <b>What does composing mean in this lesson?</b>",
      try:{ type:"mc", choices:["Writing a melody to fit a given progression","Writing a progression to fit a melody","Copying an existing tune"], answer:0,
        success:"✓ The chords come first this time; the tune is yours to invent.",
        fail:"Which direction is the REVERSE of Lesson 64?",
        hint:"Progression → melody." } },
    { say:"<b>Analyze the Chords:</b> Before writing the melody, identify each chord using Roman numerals and chord symbols. This helps you choose notes that fit each harmony. \u{1F447} <b>Why should you analyze the progression first?</b>",
      try:{ type:"mc", choices:["Each measure's chord tells you which melody notes will fit","It makes the page look professional","Analysis replaces composing"], answer:0,
        success:"✓ Analysis shows which notes fit each measure's harmony.",
        fail:"What did every melody note in the hook have in common with its chord?",
        hint:"Chord tones = safe notes." } },
    { say:"<b>Build the Melody:</b> Start with <b>chord tones</b>. Then add <b>passing and neighboring tones</b> to create smoother melodic movement. <b>Remember: good melodies begin with chord tones. Non-harmonic tones make the melody smoother and more interesting.</b> \u{1F447} <b>Which notes form the basic framework of the melody?</b>",
      try:{ type:"mc", choices:["Chord tones","Passing tones","Rests"], answer:0,
        success:"✓ Chord tones form the framework; non-harmonic tones make it smoother and more interesting.",
        fail:"Which notes are guaranteed to fit each chord?",
        hint:"Start with the notes inside the chord." } },
    { say:"<b>Beginning and Ending:</b> Most melodies begin and end on the <b>root of the I chord</b>. A <b>V (or V7)</b> chord usually comes before the final I chord. \u{1F447} <b>Which note is the best choice to begin and end a melody in C major?</b>",
      try:{ type:"mc", choices:["C","G","B"], answer:0,
        success:"✓ C — the root of the I chord. And the second-to-last measure will usually carry G7.",
        fail:"The root of I in C major is…",
        hint:"The tonic itself." } },
    { say:"<b>Reading the Labels:</b> R = root · 3 = third · 5 = fifth · 7 = seventh · P = passing tone. Decode this measure over a C chord: \u{1F447} <b>What is the correct label for the D?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:100,time:"3/4",notes:[
        {p:"E4",d:"q",label:"3"},{p:"D4",d:"q",label:"?"},{p:"C4",d:"q",label:"R"},{bar:"single"},{p:"G4",d:"h.",label:"5"},{bar:"final"}],width:460} },
      try:{ type:"mc", choices:["P — a passing tone between 3 and R","5 — the chord's fifth","R — a second root"], answer:0,
        success:"✓ P — a passing tone. D is not in C-E-G; it connects the 3rd (E) to the root (C).",
        fail:"Is D inside C-E-G?",
        hint:"Chord member or bridge?" } },
    { say:"Compose a five-measure melody using the chord progression <b>I - IV - I - V7 - I</b>. \u{1F447}",
      show:{ type:"html", html:`<div style="max-width:340px;margin:0 auto;font-size:14.5px;line-height:1.9;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;font-weight:700">
        Analyze Chords<br>↓<br>Choose Chord Tones<br>↓<br>Add Passing &amp; Neighboring Tones<br>↓<br>Check Beginning &amp; Ending<br>↓<br>Finished Melody</div>` },
      try:{ type:"custom",
        hint:"Start with chord tones; the first and last notes are the root of I.",
        mount:(container,fb)=>MF_L67_compose(container,fb) } },
    { say:"<b>Try Another Key:</b> Apply the same process in G major (G - C - D7 - G). \u{1F447} <b>Which note is the best opening note?</b>",
      try:{ type:"mc", choices:["G — the root of the I chord","C — the loudest note","F♯ — the leading tone"], answer:0,
        success:"✓ Root of I, first and last — in any key. The process: analyze → chord tones → non-harmonic tones → check the beginning and ending.",
        fail:"What's the I chord in G major, and what's its root?",
        hint:"Same frame rule, new key." } }
  ],
  examples:[
    { caption:"A composed melody with labels: every note is R, 3, 5 — or P for a passing tone.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"C5",d:"q",label:"R"},{p:"E5",d:"q",label:"3"},{p:"G5",d:"q",label:"5"},{p:"E5",d:"q",label:"3"},{bar:"single"},
        {p:"A4",d:"q",label:"3/IV"},{p:"B4",d:"q",label:"P"},{p:"C5",d:"h",label:"5/IV"},{bar:"single"},
        {p:"E5",d:"q",label:"3/I"},{p:"D5",d:"q",label:"5/V7"},{p:"B4",d:"q",label:"3/V7"},{p:"D5",d:"q",label:"5"},{bar:"single"},
        {p:"C5",d:"w",label:"R — home!"},{bar:"final"}],width:780},
      kb:{start:69,octaves:1.1667,labels:true} },
    { caption:"The same melody twice: chord tones only, then with passing tones added on the weak beats.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"C4",d:"h",label:"chord tones"},{p:"E4",d:"h"},{bar:"single"},{p:"G4",d:"h"},{p:"C5",d:"h"},{bar:"double"},
        {p:"C4",d:"q",label:"+ P tones"},{p:"D4",d:"q",label:"P"},{p:"E4",d:"q"},{p:"F4",d:"q",label:"P"},{bar:"single"},{p:"G4",d:"q"},{p:"A4",d:"q",label:"P"},{p:"B4",d:"q",label:"P"},{p:"C5",d:"q"},{bar:"final"}],width:780},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Composer's Checklist Sprint (45s)",
      intro:"Analyze, chord tones, non-harmonic tones, beginning and ending — race the method!",
      miaIntro:"The four-step checklist! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["To compose","create a melody for a chord progression"],
        ["Step 1","analyze: numerals below, symbols above"],
        ["The framework","chord tones"],
        ["To add interest","passing and neighboring tones"],
        ["First & last melody note","the root of the I chord"],
        ["Before the last chord","V or V7"],
        ["R / 3 / 5 labels","which chord member the note is"],
        ["P label","a passing tone"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — checklist locked in!":null },
    { type:"key-climb", title:"Game 2 · Play the Model Melody",
      intro:"Perform the example's first phrase: R-3-5-3 on C, then 3-P-5 on F!",
      miaIntro:"Composer, meet performer! \u{1FA9C}",
      spec:{seq:[72,76,79,76, 69,71,72],
        names:["C (R)","E (3)","G (5)","E (3)","A (3rd of F)","B (P — passing!)","C (5th of F)"],
        start:65, octaves:1.5, title:"The model melody, phrase one"},
      result:(score)=>score!==null?"Composed AND performed!":null },
    { type:"symbol-hunt", title:"Game 3 · Safe-Note Spotter",
      intro:"A chord is called — click the melody fragment that fits ENTIRELY inside it!",
      miaIntro:"Chord tones only! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Fits the C chord (C-E-G)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"}],width:170}},
        {label:"Fits the F chord (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"C5",d:"q"},{p:"A4",d:"q"}],width:170}},
        {label:"Fits the G7 chord (G-B-D-F)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"},{p:"F5",d:"q"}],width:170}},
        {label:"Fits NO single chord (scale run)", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],width:170}}]},
      result:(score)=>score>=5?"Safe notes spotted instantly!":null },
    { type:"term-race", title:"Game 4 · UNIT 16 GRAND FINALE Race",
      intro:"The victory lap — harmonizing, textures, non-harmonic tones and composing!",
      miaIntro:"Everything from Unit 16 — GO! \u{1F3C6}",
      spec:{rounds:10, reverse:true, pool:[
        ["To harmonize","add chords to a melody"],
        ["To compose","add a melody to chords"],
        ["Degrees 1,3,5","the I chord's row"],
        ["Degrees 1,4,6","the IV chord's row"],
        ["Block chord","tones together"],
        ["Arpeggio","tones one at a time, in order"],
        ["Passing tone","connects two different chord tones"],
        ["Neighboring tone","returns to the same chord tone"],
        ["First & last note","root of I"],
        ["The pre-final chord","V or V7"]]},
      result:(score)=>score>=8?"UNIT 16 CHAMPION!":null }
  ],
  practiceIntro:"20 practice questions — the method, the labels and the frame rules. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Compose","melody for a progression"],["Analyze first","numerals below, symbols above"],["Framework","chord tones"],["To add interest","passing & neighboring tones"],["R","the root as a melody note"],["P","a passing tone"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"What does composing mean in this lesson?", choices:["Creating a melody for a chord progression","Playing by ear","Writing a drum part"], answer:0,
      explain:"The reverse of harmonizing." },
    { type:"mc", q:"What should you do before writing the melody?", choices:["Analyze the progression: numerals below, symbols above","Choose a tempo","Erase the chords"], answer:0,
      explain:"Know the palette first." },
    { type:"mc", q:"The melody's first and last note tends to be…", choices:["the root of the I chord","the leading tone","degree 5"], answer:0,
      explain:"Home at both ends." },
    { type:"mc", q:"The chord that usually precedes the final chord is…", choices:["V or V7","IV","ii"], answer:0,
      explain:"The cadence rule, one more time." },
    { type:"mc", q:"Which notes are the basic melody notes over an F chord?", choices:["F, A and C","Any white key","Only F"], answer:0,
      explain:"Chord tones = guaranteed fits." },
    { type:"mc", q:"The label 'P' under a melody note means…", choices:["passing tone","perfect","piano"], answer:0,
      explain:"The one non-chord label in the model." },
    { type:"truefalse", q:"A composed melody may include non-harmonic tones.", answer:true,
      explain:"They make the melody more interesting." },
    { type:"truefalse", q:"Every note of a composed melody must be a chord tone.", answer:false,
      explain:"Chord tones form the framework; non-harmonic tones are added." },
    { type:"truefalse", q:"The numbers between the staffs (R, 3, 5) name each melody note's chord member.", answer:true,
      explain:"The analysis labels: R, 3, 5, 7, P." },
    { type:"truefalse", q:"Composing and harmonizing are opposite processes.", answer:true,
      explain:"Melody→chords vs chords→melody." }
  ],
  miaQuizIntro:"The Unit 16 finale quiz! Analyze → chord tones → non-harmonic tones → beginning and ending.",
  quiz:[
    { type:"mc", q:"What is the first step in composing a melody?", choices:["Analyze the chord progression","Write the melody immediately","Choose a tempo"], answer:0,
      explain:"Analysis shows which notes fit each harmony.", hint:"Chords first, tune second." },
    { type:"mc", q:"The first analysis step is writing…", choices:["Roman numerals under the chords and symbols above the staff","the melody immediately","the time signature"], answer:0,
      explain:"Analysis shows which notes fit each harmony.", hint:"Numerals below, symbols above." },
    { type:"mc", q:"What should most melody notes come from?", choices:["The tones of each measure's chord","The chromatic scale","The drum pattern"], answer:0,
      explain:"Chord tones form the framework.", hint:"The hook's discovery." },
    { type:"mc", q:"Which notes can make a melody more interesting?", choices:["Passing and neighboring tones","More rests","Louder dynamics"], answer:0,
      explain:"Non-harmonic tones add smoothness and interest.", hint:"Lesson 66's tones." },
    { type:"truefalse", q:"The first and last note of a melody tends to be the root of the I chord.", answer:true,
      explain:"Begin and end on the root of I.", hint:"The tonic." },
    { type:"truefalse", q:"A V or V7 chord usually precedes the last chord.", answer:true,
      explain:"The cadence sets up the landing.", hint:"Third time this unit!" },
    { type:"mc", q:"Over a G7 measure, which is NOT a chord tone?", choices:["A","G","B","F"], answer:0,
      explain:"G7 = G-B-D-F; A is not a chord tone.", hint:"Spell G7." },
    { type:"mc", q:"What do the labels R, 3, 5, and P represent?", choices:["The melody note's role in the current chord","Finger numbers","Measure numbers"], answer:0,
      explain:"Root, third, fifth — or passing tone.", hint:"Chord member or passing." },
    { type:"mc", q:"A melody measure over C major reads E-D-C. The best labels are…", choices:["3 - P - R","R - 3 - 5","5 - 3 - R"], answer:0,
      explain:"E is the 3rd, C the root; D connects them.", hint:"Which note is non-harmonic?" },
    { type:"mc", q:"You're composing in F major. Your final two measures should likely carry…", choices:["C7 then F, melody ending on F","B♭ then G, ending on A","F then C7, ending on C"], answer:0,
      explain:"V7→I with the root on top — frame complete.", hint:"V7 of F is C7." },
    { type:"mc", q:"Two students compose over the same progression and produce different melodies. Who's right?", choices:["Both — the chord tones offer many valid paths","Only the one using roots","Neither — progressions allow one melody"], answer:0,
      explain:"Composition is choice; the rules just keep the choices musical.", hint:"Your builder made a unique tune too." },
    { type:"mc", q:"What is the correct order for composing a melody?", choices:["Analyze → build with chord tones → add non-harmonic tones → check the beginning and ending","Add non-harmonic tones first, then analyze","Write the ending first, then analyze"], answer:0,
      explain:"These four steps summarize the whole lesson.", hint:"What did you do in the builder?" },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Compose","chords → melody"],["Harmonize","melody → chords"],["Framework","chord tones"],["P","passing tone"]], reverse:true}, count:3 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { gen:"inversion-id", params:{subject:"triad", ask:"position"}, count:1 }
  ],
  vocabulary:[
    {term:"Compose", def:"To create (write) a melody for a previously written chord progression — harmonizing in reverse."},
    {term:"Melody Framework", def:"The chord tones a composed melody is built from — each measure's chord provides the notes that fit."},
    {term:"R / 3 / 5 / P Labels", def:"The analysis labels: which chord member each melody note is — or P for a passing tone."},
    {term:"The Frame Rule", def:"Begin and end on the root of I; let V(7) set up the final chord."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Composing</b> = writing a melody over a given progression — the reverse of harmonizing.",
    "✔ Method: <b>analyze</b> (numerals below, symbols above) → <b>outline from chord tones</b> → <b>decorate</b> with passing/neighboring tones.",
    "✔ Frame: <b>first and last note = root of I</b>; <b>V(7) precedes the final chord</b>.",
    "✔ The labels <b>R / 3 / 5 / P</b> name each melody note's job.",
    "✔ Many melodies fit one progression — <b>your choices make yours</b>. UNIT 16 COMPLETE! \u{1F389}"
  ],
  tips:[
    "Composer's warm-up: take ANY progression you know and hum only roots. Then upgrade some roots to 3rds and 5ths. Then add one passing tone. Congratulations — you compose.",
    "The 3rd of each chord is the juiciest melody note — it carries the chord's whole personality.",
    "Label your own melodies R/3/5/P and see whether the P's land on weak beats.",
    "Unit 17 takes composing into MINOR keys — and then somewhere unexpected: the blues."
  ],
  rewards:{ badge:"Composer's Quill — Unit 16 Champion", icon:"\u{270D}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Analyze, chord tones, non-harmonic tones, beginning and ending — Unit 16 complete! \u{270D}\u{FE0F}\u{1F3C6}\u{1F389}",
  miaPass:"Passed — and Unit 16 is COMPLETE! You can harmonize, play textures, and compose. \u{1F389}",
  mia:{
    hook:{ label:"the welcome",
      explain:"The melody's notes came from inside each measure's chord: C, A, E, D, C over C-F-C-G7-C. Chord tones are the composer's palette.",
      play:()=>{const chords=[[48,64,67],[53,65,69],[48,64,67],[43,67,71,77],[48,64,67]],mel=[72,69,76,74,72];chords.forEach((row,i)=>{row.forEach(m=>MFAudio.tone(m,.85,i*.9,.2));MFAudio.tone(mel[i],.8,i*.9,.44);});} },
    learn:{ label:"composing",
      explain:"Analyze the progression, build a framework from chord tones, decorate with passing/neighboring tones, frame it: root of I at both ends, V(7) before the close.",
      hint:"Analyze → chord tones → non-harmonic tones → beginning and ending.",
      play:()=>{[72,76,79,76].forEach((m,i)=>MFAudio.tone(m,.5,i*.45,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 is a fully labeled composed melody (R/3/5/P); example 2 shows the same framework before and after decoration." },
    game:{ label:"the games",
      explain:"Sprint the checklist, perform the model, spot safe notes, then run the Unit 16 victory lap.",
      hint:"Chord tones first — always." },
    quiz:{ label:"this question",
      explain:"Every question is one of the four steps: analyze, framework, decorate, frame. Identify which step, and the answer follows.",
      play:()=>{[67,71,74,77].forEach(m=>MFAudio.tone(m,.8,0,.3));[60,64,67,72].forEach(m=>MFAudio.tone(m,1,.9,.32));} }
  }
};
