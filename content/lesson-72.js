/* Lesson 72 — Basic Forms of Music: Motive and Phrase (AEMT Book 3, Unit 18)
   Built from drafts/UNIT 18 – Lesson 72.md; AEMT3 p.114 verified by render.
   Core: writing = letters→words→sentences; music = note→motive→phrase→piece.
   MOTIVE = a short melodic, rhythmic or harmonic element used repeatedly
   (Beethoven's 5th: the famous four-note pattern — reused in original form,
   transposition and variation). PHRASE = a short section of music, a complete
   or incomplete musical idea; its end gives a "lift" or breath, like a comma.
   NOTE: edit by FULL-FILE REWRITE only. */

/* motive hunter: tap the first note of each motive appearance */
function MF_L72_hunt(container,fb){
  /* melody: motive (D-D-D-G) stated, then transposed (E-E-E-A), then again (G-G-G-C) */
  const NOTES=[
    {p:"D4",d:"8"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"q"},
    {p:"E4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"A4",d:"q"},
    {p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"h"}];
  const STARTS=[0,4,8];
  let found=[];
  container.innerHTML=`<div class="big-q l72h-q" style="text-align:center">Listen for the motive — it appears three times (later at different pitches). Tap the <b>first note of each appearance</b>.</div>
    <div class="l72h-staff"></div>
    <div style="text-align:center"><button class="play l72h-play">▶ Hear the melody</button></div>`;
  const q=container.querySelector(".l72h-q"), holder=container.querySelector(".l72h-staff"), pl=container.querySelector(".l72h-play");
  const spec={clef:"treble",tempo:110,notes:NOTES,beams:[[0,2],[4,6],[8,10]],width:560,clickNotes:true,
    onNote:(i,p)=>{
      MFAudio.tone(MFAudio.midi(p),.4,0,.4);
      if(STARTS.includes(i)&&!found.includes(i)){
        found.push(i); MFAudio.yay();
        if(found.length<3) q.innerHTML=`✓ Great! You found the motive. ${3-found.length} more — same short-short-short-LONG shape, new pitch.`;
        else { q.textContent="Excellent! You found the motive each time.";
          fb(true,"✓ One motive, three statements — the 2nd and 3rd are repeated at different pitches (TRANSPOSITION). Most music develops one or more motives this way."); }
      } else if(STARTS.includes(i)) q.innerHTML="Already found — listen again for the next one.";
      else fb(false,"Listen again. Find where the short-short-short-LONG pattern BEGINS.");
    }};
  const api=Staff.render(holder,spec);
  pl.onclick=()=>Staff.play(spec,api);
}

/* phrase breaths: tap where each phrase ends */
function MF_L72_breath(container,fb){
  /* two phrases: rise…pause, rise…close */
  const NOTES=[
    {p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"h",label:"?"},
    {p:"E4",d:"q"},{p:"D4",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"h",label:"?"}];
  const ENDS=[3,7];
  let found=[];
  container.innerHTML=`<div class="big-q l72b-q" style="text-align:center">Two phrases. Play the melody, then tap the note where EACH phrase ends.</div>
    <div class="l72b-staff"></div>
    <div style="text-align:center"><button class="play l72b-play">▶ Play the melody</button></div>`;
  const q=container.querySelector(".l72b-q"), holder=container.querySelector(".l72b-staff"), pl=container.querySelector(".l72b-play");
  const spec={clef:"treble",tempo:100,notes:NOTES,width:520,clickNotes:true,
    onNote:(i,p)=>{
      MFAudio.tone(MFAudio.midi(p),.5,0,.4);
      if(ENDS.includes(i)&&!found.includes(i)){
        found.push(i); MFAudio.yay();
        if(found.length<2) q.innerHTML="✓ You found one phrase ending — the long note where the line pauses. Where does the other phrase end?";
        else { q.textContent="Excellent! You found both phrase endings.";
          fb(true,"✓ The long notes are where the music 'takes a breath' — each marks the END OF A PHRASE. Phrase 1 pauses on G (incomplete); phrase 2 settles on C (complete)."); }
      } else if(ENDS.includes(i)) q.innerHTML="Found — where does the OTHER phrase end?";
      else fb(false,"Mid-phrase — sing along and notice where you'd naturally breathe: on the LONG notes.");
    }};
  const api=Staff.render(holder,spec);
  pl.onclick=()=>Staff.play(spec,api);
}

LESSON_CONTENT[72]={
  welcome:"Motives and phrases: music's building blocks. \u{1F9F1}",
  hook:{
    say:"<b>Can four notes become an entire piece of music?</b> Let's find out how a small musical idea can grow into something much bigger. <b>Listen — do you recognize these four notes?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ The four notes</button></div>
          <div class="choices hk-ch" style="display:none"><button>Beethoven's Symphony No. 5 — short-short-short-LONG</button><button>A random doorbell</button><button>The blues scale</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{
          [67,67,67].forEach((m,i)=>MFAudio.tone(m,.22,i*.24,.45));
          MFAudio.tone(63,1.6,.72,.5);
          setTimeout(()=>ch.style.display="",2100);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ The opening MOTIVE of Beethoven's 5th. A motive is a SHORT musical idea used repeatedly — Beethoven built an entire symphony from those four notes. Today: motives and phrases, music's building blocks!");
          else fb(false,"Da-da-da-DUMMM… think of the most famous symphony opening ever written.");
        });
      } }
  },
  objectives:[
    "Understand the order: notes → motives → phrases → sections → complete piece",
    "Define MOTIVE: a short melodic, rhythmic or harmonic element used repeatedly",
    "See how motives develop: repetition, transposition, variation",
    "Define PHRASE: a short section — a complete or incomplete musical idea",
    "Hear phrase endings as breaths ('lifts')",
    "Count and compare the phrases of a simple song"
  ],
  steps:[
    { say:"<b>Building Blocks of Music:</b> Music is built from small ideas. Notes become motives. Motives become phrases. Phrases become larger sections. \u{1F447} <b>Why is it helpful to understand musical form?</b>",
      show:{ type:"html", html:`<div style="max-width:300px;margin:0 auto;font-size:14.5px;line-height:1.9;background:var(--card,#fff);border:1.5px solid #cdd5e1;border-radius:12px;padding:12px 18px;text-align:center;font-weight:700">
        Notes<br>↓<br>Motive<br>↓<br>Phrase<br>↓<br>Section<br>↓<br>Complete Piece</div>` },
      try:{ type:"mc", choices:["To understand how a composition is organized and structured","To play louder","To avoid learning chords"], answer:0,
        success:"✓ Understanding form shows how a composition is organized and structured.",
        fail:"Think about organization and structure…",
        hint:"Organization and structure." } },
    { say:"<b>What Is a Motive?</b> A <b>motive</b> is a short musical idea. It may be melodic, rhythmic, or harmonic. It is usually repeated throughout a piece. \u{1F447} <b>What makes a musical idea a motive?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"2/4",tempo:110,notes:[
        {rest:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{bar:"single"},{p:"Eb4",d:"h",artic:"fermata"},{bar:"final"}],
        beams:[[1,3]],width:380} },
      try:{ type:"mc", choices:["Being SHORT and used REPEATEDLY","Being played by violins","Containing exactly four notes"], answer:0,
        success:"✓ Short + repeated = motive. Beethoven's is four notes, but a motive can also be a rhythm or even a chord pattern.",
        fail:"Two words in the definition carry all the weight…",
        hint:"Short… repeatedly…" } },
    { say:"Listen for the motive. <b>How many times do you hear it?</b> Tap the first note of each appearance. \u{1F447}",
      try:{ type:"custom",
        hint:"Same shape (short-short-short-LONG), different starting pitches.",
        mount:(container,fb)=>MF_L72_hunt(container,fb) } },
    { say:"<b>What Is a Phrase?</b> A <b>phrase</b> is a short musical idea that sounds complete or almost complete. A phrase may contain one or more motives. It often ends where a performer would naturally breathe. <b>Remember: a motive is a small idea. A phrase is a complete musical thought made from one or more motives.</b> \u{1F447} <b>What usually happens at the end of a phrase?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:280px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Motive</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Phrase</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Short musical idea</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Complete musical thought</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Repeated often</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Made of one or more motives</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Very short</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px">Longer</td></tr></table>` },
      try:{ type:"mc", choices:["A 'lift' or breath","A louder dynamic","A new key signature"], answer:0,
        success:"✓ A 'lift' or breath — singers breathe there; instrumentalists lift.",
        fail:"Where would a singer breathe?",
        hint:"What do singers need regularly?" } },
    { say:"Listen and find where each phrase ends. \u{1F447}",
      try:{ type:"custom",
        hint:"Phrases end on the LONG notes — where you'd naturally breathe.",
        mount:(container,fb)=>MF_L72_breath(container,fb) } },
    { say:"<b>Complete or Incomplete:</b> A phrase ending on the tonic usually sounds complete. A phrase ending away from the tonic usually sounds incomplete. \u{1F447} <b>Which phrase sounds unfinished?</b>",
      try:{ type:"mc", choices:["Phrase 1 — it pauses on G, away from the tonic","Phrase 2 — it ends on C, the tonic","Neither"], answer:0,
        success:"✓ Phrase 1 sounds unfinished — it ends away from the tonic and leads to another phrase.",
        fail:"Did the pause on G feel finished?",
        hint:"Tonic = complete." } },
    { say:"<b>Finding Similar Phrases:</b> Some phrases begin the same because they use the same motive. When two phrases start identically but end differently, the pair still feels related. \u{1F447} <b>What does it mean when two phrases begin alike?</b>",
      try:{ type:"mc", choices:["They use the same motive","A printing error","The song has no form"], answer:0,
        success:"✓ They share a motive — recognizing similar phrases is the first step of form analysis, which the next three lessons build on.",
        fail:"Why would a composer bring an idea back?",
        hint:"Think of the motive lesson you JUST had." } }
  ],
  examples:[
    { caption:"A motive grows: stated, transposed up a step, transposed again — each three quick notes landing on a longer one. One four-note idea powers the whole line, Beethoven-style.",
      staff:{clef:"treble",tempo:110,time:"6/8",notes:[
        {p:"D4",d:"8",label:"motive"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"q."},{bar:"single"},
        {p:"E4",d:"8",label:"transposed"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"A4",d:"q."},{bar:"single"},
        {p:"G4",d:"8",label:"again!"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"q."},{bar:"final"}],
        beams:[[0,2],[5,7],[10,12]],width:620},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"Two phrases in question-and-answer: the first pauses on G (incomplete), the second settles on C (complete). Every simple song breathes this way.",
      staff:{clef:"treble",tempo:100,time:"5/4",notes:[
        {p:"C4",d:"q",label:"phrase 1…"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"h",label:"phrase ends (incomplete)"},{bar:"single"},
        {p:"E4",d:"q",label:"phrase 2…"},{p:"D4",d:"q"},{p:"B3",d:"q"},{p:"C4",d:"h",label:"phrase ends (complete)"},{bar:"final"}],width:680},
      kb:{start:57,octaves:1.1667,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Building-Block Sprint (45s)",
      intro:"Motives, phrases, breaths and Beethoven — race the definitions!",
      miaIntro:"Short-short-short-LONG! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Motive","a short element used repeatedly"],
        ["A motive can be","melodic, rhythmic or harmonic"],
        ["Most music is based on","developing and expanding motives"],
        ["Beethoven's 5th motive","four notes: short-short-short-LONG"],
        ["Phrase","a short section — complete or incomplete idea"],
        ["A phrase's end","a 'lift' or breath"],
        ["Transposition","the same motive at a new pitch level"],
        ["Music's basic unit","the note"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — blocks stacked high!":null },
    { type:"key-climb", title:"Game 2 · Play the Famous Motive",
      intro:"Perform the short-short-short-LONG shape — then its transposition!",
      miaIntro:"Fate knocks at the door! \u{1FA9C}",
      spec:{seq:[67,67,67,63, 65,65,65,62],
        names:["G","G","G","E♭ — the LONG one!","F (transposed!)","F","F","D — long again"],
        start:60, octaves:0.9167, title:"The four-note motive, original and transposed"},
      result:(score)=>score!==null?"You just played music's most famous motive!":null },
    { type:"symbol-hunt", title:"Game 3 · Motive Detective",
      intro:"Original, transposed, varied — or unrelated? Click what each round names!",
      miaIntro:"Same shape, new address? \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"The motive (original)", spec:{clef:"treble",notes:[{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"q"}],beams:[[0,2]],width:170}},
        {label:"Transposed (same shape, higher)", spec:{clef:"treble",notes:[{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"A4",d:"q"}],beams:[[0,2]],width:170}},
        {label:"Rhythm varied (long-short-short-long)", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"q"}],beams:[[1,2]],width:170}},
        {label:"Unrelated material", spec:{clef:"treble",notes:[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"C5",d:"q"}],width:170}}]},
      result:(score)=>score>=5?"No disguise fools the detective!":null },
    { type:"order-tap", title:"Game 4 · Build the Pyramid",
      intro:"Tap music's building blocks from SMALLEST to LARGEST!",
      miaIntro:"Note first, masterpiece last! \u{1F3C1}",
      spec:{sequence:["Note","Motive","Phrase","Section","Complete piece"],
        title:"Small to large: assemble the musical pyramid"},
      result:(stars)=>stars>=2?"Architecture understood, ground floor up!":null }
  ],
  practiceIntro:"20 practice questions — motives, phrases, breaths and the pyramid. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Motive","short, used repeatedly"],["Phrase","a complete or incomplete idea"],["Phrase ending","a breath or 'lift'"],["Transposition","same shape, new pitch"],["Music's basic unit","the note"]], reverse:true}, count:6 },
    { gen:"note-value", params:{}, count:2 },
    { type:"mc", q:"A MOTIVE is…", choices:["a short melodic, rhythmic or harmonic element used repeatedly","an entire song","a kind of tempo"], answer:0,
      explain:"Short + repeated = motive." },
    { type:"mc", q:"Most music develops from…", choices:["one or more motives, expanded and developed","a single long melody with no repeats","random notes"], answer:0,
      explain:"Motives are the seeds of pieces." },
    { type:"mc", q:"The famous four-note motive belongs to…", choices:["Beethoven's Symphony No. 5","a piano exercise","the blues"], answer:0,
      explain:"The famous four-note motive." },
    { type:"mc", q:"A PHRASE is…", choices:["a short section of music — a complete or incomplete idea","always exactly 4 notes","another word for motive"], answer:0,
      explain:"It may CONTAIN motives." },
    { type:"mc", q:"A phrase usually ends where…", choices:["a performer would take a breath","a drum solo begins","the key changes"], answer:0,
      explain:"Singers breathe at phrase ends." },
    { type:"mc", q:"Repeating a motive at a different pitch is called…", choices:["transposition","inversion","syncopation"], answer:0,
      explain:"Same shape, new address." },
    { type:"truefalse", q:"A motive must be melodic — rhythms can't be motives.", answer:false,
      explain:"Melodic, RHYTHMIC or harmonic — Beethoven's rhythm returns in later movements." },
    { type:"truefalse", q:"A phrase may contain one or more motives.", answer:true,
      explain:"In original form or variation." },
    { type:"truefalse", q:"A phrase must always be a complete musical idea.", answer:false,
      explain:"Complete OR incomplete." },
    { type:"truefalse", q:"Understanding basic forms helps you understand how a composition is organized.", answer:true,
      explain:"The whole point of Unit 18." }
  ],
  miaQuizIntro:"Quiz! Small ideas, big pieces.",
  quiz:[
    { type:"mc", q:"The smallest building block of music is…", choices:["the note","the phrase","the chord"], answer:0,
      explain:"Like a letter of the alphabet.", hint:"The smallest brick." },
    { type:"mc", q:"A motive is…", choices:["a short musical idea used repeatedly","played only once","always in the bass"], answer:0,
      explain:"Repetition is its identity.", hint:"Why we recognize da-da-da-DUM." },
    { type:"mc", q:"A motive may be melodic, rhythmic or…", choices:["harmonic","visual","verbal"], answer:0,
      explain:"Three possible kinds.", hint:"The third musical dimension." },
    { type:"truefalse", q:"A motive can return in different forms (original, transposition, variation).", answer:true,
      explain:"Development and expansion in action.", hint:"How motives grow." },
    { type:"mc", q:"A phrase is a short section of music that may be…", choices:["a complete or incomplete musical idea","only complete","only incomplete"], answer:0,
      explain:"Both kinds exist — incomplete and complete.", hint:"Two options." },
    { type:"truefalse", q:"The end of a musical phrase provides a 'lift' or breath.", answer:true,
      explain:"For instrumentalist or singer alike.", hint:"The comma analogy." },
    { type:"truefalse", q:"When speaking, the end of a phrase usually happens at a comma.", answer:true,
      explain:"Speakers pause; singers breathe.", hint:"Where do you pause?" },
    { type:"mc", q:"Identify what happened to the motive between these two statements.",
      staff:{clef:"treble",notes:[{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"D4",d:"8"},{p:"G4",d:"q"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"E4",d:"8"},{p:"A4",d:"q"}],beams:[[0,2],[4,6]],width:420},
      choices:["It was repeated at a different pitch (transposition)","It was deleted","The rhythm changed completely"], answer:0,
      explain:"Short-short-short-long, moved up a step.", hint:"Compare shapes, then pitches." },
    { type:"mc", q:"A short song has four natural breathing points. How many phrases are in this melody?", choices:["4","2","8"], answer:0,
      explain:"Four phrase endings = four phrases.", hint:"One breath per phrase." },
    { type:"mc", q:"A phrase ends on a long note AWAY from the tonic. What does it sound like?", choices:["It sounds unfinished and leads to another phrase","It sounds fully finished","It sounds like an error"], answer:0,
      explain:"Away from the tonic = incomplete.", hint:"The G pause in the example." },
    { type:"mc", q:"What is the correct order, from smallest to largest?", choices:["Notes → Motives → Phrases","Phrases → Notes → Motives","Chords → Scales → Keys"], answer:0,
      explain:"Small to large, in order.", hint:"Game 4's pyramid." },
    { type:"mc", q:"Two phrases of a song begin identically. What does this mean?", choices:["The composer used the same motive in both phrases","The song is broken","They must be deleted"], answer:0,
      explain:"Similarity-spotting IS form analysis.", hint:"Think of the motive." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["Motive","the repeated short idea"],["Phrase","the musical sentence-part"],["Breath","a phrase's ending lift"],["Transposition","same idea, new height"]], reverse:true}, count:3 },
    { gen:"rhythm-count", params:{}, count:2 },
    { gen:"note-value", params:{}, count:1 }
  ],
  vocabulary:[
    {term:"Motive", def:"A short melodic, rhythmic or harmonic element used repeatedly throughout a piece — the seed most music grows from."},
    {term:"Phrase", def:"A short section of music — a complete or incomplete musical idea, often containing motives."},
    {term:"The Breath", def:"A phrase ends with a 'lift' or breath — where a performer would naturally breathe."},
    {term:"Transposition", def:"Restating a motive or phrase at a different pitch level — same shape, new height."}
  ],
  mistakes:[],
  summary:[
    "✔ Music is built from small ideas: <b>notes → motives → phrases → sections → complete piece</b>.",
    "✔ <b>MOTIVE</b> = a short melodic, rhythmic or harmonic element <b>used repeatedly</b> — most music develops one or more of them.",
    "✔ Beethoven's 5th: <b>four notes</b> reused in original form, <b>transposition</b> and variation.",
    "✔ <b>PHRASE</b> = a short section — a <b>complete or incomplete</b> idea, ending with a <b>breath</b>.",
    "✔ Spotting similar phrases = the first step of <b>form analysis</b>."
  ],
  tips:[
    "Hum any song you love and clap ONLY its first rhythm — you probably just isolated its motive.",
    "Breath test for phrases: sing along; wherever you MUST inhale, a phrase just ended.",
    "Composers' secret: don't write more ideas — develop the one you have. Beethoven got a symphony from four notes.",
    "Next lesson, phrases combine into SECTIONS — and sections spell the alphabet of form: AB!"
  ],
  rewards:{ badge:"Idea Archaeologist", icon:"\u{1F9F1}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! Motives, phrases, breaths — you know music's building blocks. \u{1F9F1}\u{1F389}",
  miaPass:"Passed! You see the small ideas inside big music now. Sections are next…",
  mia:{
    hook:{ label:"the welcome",
      explain:"Those four notes — short-short-short-LONG — are the opening motive of Beethoven's Symphony No. 5, a famous example of a motive.",
      play:()=>{[67,67,67].forEach((m,i)=>MFAudio.tone(m,.22,i*.24,.45));MFAudio.tone(63,1.6,.72,.5);} },
    learn:{ label:"motives & phrases",
      explain:"Motive = short element used repeatedly (melodic/rhythmic/harmonic); developed via repetition, transposition, variation. Phrase = short section, complete or incomplete, ending with a breath.",
      hint:"Motive = the idea; phrase = the sentence-part.",
      play:()=>{[62,62,62,67].forEach((m,i)=>MFAudio.tone(m,i===3?.8:.25,i*.26,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 grows one motive through transpositions; example 2 shows two phrases — incomplete, then complete." },
    game:{ label:"the games",
      explain:"Sprint the definitions, play the famous motive, detect disguised motives, then build the pyramid from note to piece.",
      hint:"Short + repeated = motive." },
    quiz:{ label:"this question",
      explain:"Two definitions cover it all: motive (short, repeated, developed) and phrase (short section, complete or incomplete, ends with a breath).",
      play:()=>{[67,67,67].forEach((m,i)=>MFAudio.tone(m,.22,i*.24,.45));MFAudio.tone(63,1.4,.72,.5);} }
  }
};
