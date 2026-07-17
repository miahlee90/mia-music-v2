/* Lesson 91 — Common Song Forms (Book 4, Unit 22 — SELF-AUTHORED)
   Binary/ternary/rondo (L73-75) get ONE review step only. New material:
   STROPHIC (same music, new words each verse), THROUGH-COMPOSED (new music
   throughout), 32-BAR AABA, VERSE-CHORUS form.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[91]={
  welcome:"Song forms are common patterns used mainly in vocal music — how verses, choruses, and other sections are organized.",
  hook:{
    say:"<b>Listen to two verses that use the same music with different lyrics.</b> \u{1F447} <b>What remains the same, and what changes?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Verse 1</button>
          <button class="play hk-b">▶ Verse 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>The music repeats while the lyrics change</button><button>Each verse uses completely new music</button><button>Neither the music nor the lyrics change</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const MEL=[64,64,65,67,67,65,64,62,60];
        container.querySelector(".hk-a").onclick=()=>{ MEL.forEach((m,i)=>MFAudio.tone(m,.3,i*.3,.42)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2900); };
        container.querySelector(".hk-b").onclick=()=>{ MEL.forEach((m,i)=>MFAudio.tone(m,.3,i*.3,.42)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2900); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Both verses use the same music with different lyrics. This design is called strophic form.");
          else fb(false,"Compare the melody and accompaniment of the two verses. They use the same musical setting.");
        });
      } }
  },
  objectives:[
    "Understand what song forms are — patterns in vocal music",
    "Strophic: same music, new lyrics each verse",
    "Modified strophic and through-composed",
    "AABA: A A B A, with B as the bridge",
    "Verse–chorus: verses alternate with a recurring chorus",
    "Match real songs to their forms"
  ],
  steps:[
    { say:"<b>What are song forms?</b> Song forms are common organizational patterns used mainly in <b>vocal music</b>. Unlike binary, ternary, or rondo forms, they describe how <b>verses, choruses, and other vocal sections</b> are organized.<br>Quick review of the section forms: binary (two sections), ternary (A–B–A), rondo (A returns between episodes). \u{1F447} <b>What is ABA form called?</b>",
      try:{ type:"mc", choices:["Ternary form","Binary form","Rondo form"], answer:0,
        success:"✓ Correct. Ternary form consists of an opening section, a contrasting section, and a return of the opening section.",
        fail:"Count the three-part design: A–B–A.",
        hint:"ABA has three formal parts." } },
    { say:"<b>Strophic Form:</b> each verse (stanza) is sung to the same music — only the lyrics change (<b>A–A–A</b>). Common in hymns, folk songs, and traditional songs.<br><b>Modified Strophic:</b> the same basic music returns, but one or more verses include meaningful musical changes. \u{1F447} <b>In a strictly strophic song, what normally changes from one verse to the next?</b>",
      try:{ type:"mc", choices:["The lyrics","The complete melody and harmony","The key in every verse"], answer:0,
        success:"✓ Correct. Each verse presents new text using the same musical setting.",
        fail:"Compare the musical setting of the two verses.",
        hint:"The music repeats while the text changes." } },
    { say:"<b>Through-Composed Form:</b> each new section receives new music, with little or no large-scale repetition. Often used when the music closely follows the meaning of the text. \u{1F447} <b>Which statement best describes through-composed form?</b>",
      try:{ type:"mc", choices:["New music accompanies successive portions of the text without a recurring large-scale section","One complete musical section repeats for every verse","The music must be instrumental"], answer:0,
        success:"✓ Correct. A through-composed song avoids a regularly recurring large-scale section, although smaller musical ideas may return.",
        fail:"Look for continuously developing large-scale musical sections.",
        hint:"The same complete musical setting does not return for each stanza." } },
    { say:"<b>32-Bar AABA Form</b> — one of the most important song forms. Four 8-bar sections: <b>A A B A</b>. The <b>B section (bridge)</b> provides contrast before the final return of A. (In jazz, one full statement of the form is called a chorus.) \u{1F447} <b>Which section provides the principal contrast in AABA form?</b>",
      show:{ type:"html", html:`<div style="display:flex;gap:8px;justify-content:center;font-weight:800;font-size:15px">
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px;color:#2F6DA8">A<br><span style="font-weight:400;font-size:12px;color:#555">8 bars</span></div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px;color:#2F6DA8">A<br><span style="font-weight:400;font-size:12px;color:#555">8 bars</span></div>
        <div style="border:2px solid #C05A21;border-radius:10px;padding:8px 14px;color:#C05A21">B<br><span style="font-weight:400;font-size:12px;color:#555">bridge</span></div>
        <div style="border:2px solid #2F6DA8;border-radius:10px;padding:8px 14px;color:#2F6DA8">A<br><span style="font-weight:400;font-size:12px;color:#555">8 bars</span></div></div>` },
      try:{ type:"mc", choices:["The B section, or bridge","The first A section","The final A section"], answer:0,
        success:"✓ Correct. The B section provides contrast in the third part of the form before A returns.",
        fail:"Identify the only contrasting letter in A–A–B–A.",
        hint:"Three A sections surround one contrasting section." } },
    { say:"<b>Verse–Chorus Form</b> — the backbone of most popular songs. <b>Verses</b> tell the story (new lyrics, similar music). The <b>chorus</b> repeats the main musical and lyrical idea. Many songs also add a <b>bridge</b>. \u{1F447} <b>In a typical verse–chorus song, which section normally returns with substantially the same lyrics and music?</b>",
      try:{ type:"mc", choices:["The chorus","The verse","Neither section"], answer:0,
        success:"✓ Correct. The recurring music and lyrics help make the chorus recognizable.",
        fail:"Which section normally returns with the same central text and music?",
        hint:"Identify the recurring section that often contains the song's principal hook." } },
    { say:"<b>Distinguishing Song Forms:</b> identify the major sections, see which ones return and whether their music or lyrics change, then map the order — A–A–A, A–A–B–A, or verse–chorus–verse–chorus. \u{1F447} <b>A song follows verse–chorus–verse–chorus–bridge–chorus. How is its form best described?</b>",
      try:{ type:"mc", choices:["Verse–chorus form with a bridge","Strophic form","Through-composed form"], answer:0,
        success:"✓ Correct. The recurring chorus alternates with verses, and a contrasting bridge appears before the final chorus.",
        fail:"Identify the section that returns after each verse.",
        hint:"Look for the recurring chorus." } },
    { say:"<b>Review:</b> \u{1F447} <b>A hymn presents five stanzas using the same musical setting. What is its form?</b>",
      try:{ type:"mc", choices:["Strophic","AABA","Through-composed"], answer:0,
        success:"✓ Correct. Each stanza uses the same music with different lyrics, creating strophic form.",
        fail:"Compare the musical setting used for each stanza.",
        hint:"A–A–A–A–A." } }
  ],
  examples:[
    { caption:"① A section — a 4-bar miniature: this melody plays twice (A A), yields to a bridge (B), then returns (A).",
      staff:{clef:"treble",tempo:92,time:"4/4",notes:[
        {p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{bar:"single"},
        {p:"G4",d:"h"},{p:"E4",d:"h"},{bar:"single"},
        {p:"D4",d:"q"},{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{bar:"single"},
        {p:"C5",d:"w",label:"A ends"},{bar:"final"}],width:680},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"② Bridge (B) — a 3-bar miniature: new harmony color and direction, built to make A's return feel like home.",
      staff:{clef:"treble",tempo:92,time:"4/4",notes:[
        {p:"A4",d:"q"},{p:"C5",d:"q"},{p:"E5",d:"h",label:"new color"},{bar:"single"},
        {p:"D5",d:"q"},{p:"B4",d:"q"},{p:"G4",d:"h",label:"turning…"},{bar:"single"},
        {p:"F4",d:"q"},{p:"G4",d:"q"},{p:"B4",d:"h",label:"…toward A"},{bar:"final"}],width:620},
      kb:{start:60,octaves:1.33,labels:true} },
    { caption:"③ Full AABA — now the A and the B combined: hear A, A, B, then A returning home. The two A's frame the contrasting bridge.",
      staff:{clef:"treble",tempo:96,time:"4/4",notes:[
        {p:"C5",d:"q",label:"A"},{p:"G4",d:"q"},{p:"C5",d:"h"},{bar:"single"},
        {p:"C5",d:"q",label:"A"},{p:"G4",d:"q"},{p:"C5",d:"h"},{bar:"single"},
        {p:"G4",d:"q",label:"B"},{p:"B4",d:"q"},{p:"D5",d:"q"},{p:"B4",d:"q"},{bar:"single"},
        {p:"C5",d:"q",label:"A"},{p:"G4",d:"q"},{p:"C5",d:"h",label:"home"},{bar:"final"}],width:560},
      kb:{start:65,octaves:0.9167,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Song-Form Identification (45s)",
      intro:"Identify each song form from its pattern of repetition and contrast.",
      miaIntro:"Identify the sections and determine what returns.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Strophic","same music every verse"],
        ["Through-composed","new music throughout"],
        ["32-bar AABA","A A bridge A"],
        ["Verse-chorus","story alternates with the hook"],
        ["The bridge","AABA's B section"],
        ["The chorus","repeats words AND music"],
        ["The verse","new words, same music"],
        ["Hymns and folk songs","often strophic"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Song-form challenge completed!":null },
    { type:"order-tap", title:"Game 2 · Assemble AABA Form",
      intro:"Arrange the four sections of a thirty-two-bar AABA form.",
      miaIntro:"A–A–B–A.",
      spec:{sequence:["A — first 8 bars","A — repeated 8","B — the bridge","A — home again"],
        title:"One 32-bar chorus"},
      result:(stars)=>stars>=2?"You assembled the AABA form correctly.":null },
    { type:"order-tap", title:"Game 3 · Build a Verse–Chorus Song",
      intro:"Arrange the sections to form one possible verse–chorus song structure.",
      miaIntro:"Verse–chorus–verse–chorus.",
      spec:{sequence:["Verse 1 — the story begins","Chorus — the hook","Verse 2 — story continues","Chorus — the hook again","Bridge — a new angle","Final chorus"],
        title:"One possible verse–chorus song"},
      result:(stars)=>stars>=2?"You assembled a common verse–chorus structure.":null },
    { type:"term-race", title:"Game 4 · Name That Form",
      intro:"Read each description and identify the song form.",
      miaIntro:"Identify what repeats, what changes, and where contrast occurs.",
      spec:{rounds:8, reverse:true, pool:[
        ["5 verses, identical music","strophic"],
        ["No large section regularly returns","through-composed"],
        ["A A B A in 32 bars","AABA form"],
        ["Verses alternate with a hook","verse-chorus"],
        ["Two contrasting sections","AB (binary)"],
        ["Statement, contrast, return","ABA (ternary)"],
        ["A keeps coming back with new episodes","rondo"],
        ["The bridge's job","contrast before A returns"]]},
      result:(score)=>score>=6?"You identified the song forms correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on strophic, modified strophic, through-composed, AABA, and verse–chorus forms. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Strophic","A A A…"],["Through-composed","no recurring large section"],["AABA","bridge third"],["Verse-chorus","story + hook"],["Bridge","the B of AABA"]], reverse:true}, count:6 },
    { gen:"triad-id", params:{ask:"numeral"}, count:2 },
    { type:"mc", q:"In strophic form, each stanza normally uses…", choices:["the same or essentially the same music","entirely new music","only the bridge"], answer:0,
      explain:"New words, one tune." },
    { type:"mc", q:"Through-composed form normally…", choices:["avoids a regularly recurring large-scale section","repeats the same complete section for every stanza","must follow AABA form"], answer:0,
      explain:"Smaller motives may return, but the same complete musical setting does not regularly repeat." },
    { type:"mc", q:"What is the sectional order of thirty-two-bar AABA form?", choices:["A–A–B–A","A–B–C–D","A–B–A–B"], answer:0,
      explain:"Four eight-measure sections." },
    { type:"mc", q:"In AABA form, the B section is commonly called…", choices:["the bridge","the coda","the verse"], answer:0,
      explain:"Contrast before A returns." },
    { type:"truefalse", q:"In a typical verse–chorus song, the chorus returns with substantially the same lyrics and music.", answer:true,
      explain:"The recurring chorus keeps substantially the same words and music." },
    { type:"truefalse", q:"A hymn that presents several stanzas using the same music is strophic.", answer:true,
      explain:"Same music with new text for each stanza creates strophic form." },
    { type:"truefalse", q:"An AABA form totals 32 measures when each of its four sections contains 8 measures.", answer:true,
      explain:"4 × 8 = 32." },
    { gen:"term-match", params:{subject:"term", pool:[["Binary","AB"],["Ternary","ABA"],["Rondo","ABACA"],["Chorus","words + music repeat"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Strophic Form", def:"Same music for every verse. Only the lyrics change. (A A A…)"},
    {term:"Modified Strophic Form", def:"Same basic music, with meaningful changes in some verses."},
    {term:"Through-Composed Form", def:"New music throughout. Little or no large-scale repetition."},
    {term:"32-Bar AABA Form", def:"Four 8-bar sections: A A B A. B = the bridge (contrast)."},
    {term:"Verse-Chorus Form", def:"Verses tell the story; the chorus repeats the main idea. Often plus a bridge."}
  ],
  mistakes:[],
  summary:[
    "✔ Song forms describe common structures used in <b>vocal music</b>.",
    "✔ <b>Strophic</b> = same music for every verse.",
    "✔ <b>Modified strophic</b> = same basic music with changes.",
    "✔ <b>Through-composed</b> = new music throughout.",
    "✔ <b>AABA</b> = A A B A (B = bridge).",
    "✔ <b>Verse–chorus</b> = verses alternate with a recurring chorus."
  ],
  tips:[
    "Radio exercise: label tonight's songs V-C-V-C-B-C — you'll find the form everywhere.",
    "AABA hides inside many verse-chorus songs: choruses themselves often run AABA internally.",
    "Writing strophic verses? Make the melody neutral enough to carry different words — that's the craft.",
    "Unit 22 complete! Next unit: chords grow a fourth note — the seventh chords."
  ],
  rewards:{ badge:"Songsmith", icon:"\u{1F3A4}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify the sections, determine what repeats, and locate the contrast.",
  quiz:[
    { type:"mc", q:"Strophic form uses…", choices:["the same or essentially the same music for each stanza","entirely new music for each stanza","instrumental music only"], answer:0,
      explain:"A A A — words change, tune stays.", hint:"Many hymns use strophic form, but the form also appears in other musical styles." },
    { type:"mc", q:"Which statement best describes through-composed form?", choices:["It avoids a regularly recurring large-scale section","It repeats one complete musical setting for every stanza","It must contain exactly 32 measures"], answer:0,
      explain:"Small musical ideas may return, but no complete large-scale section recurs regularly.", hint:"Follow the continuing large-scale development of the music." },
    { type:"mc", q:"What is the sectional order of thirty-two-bar AABA form?", choices:["A–A–B–A","A–B–A–C","B–A–A–B"], answer:0,
      explain:"Four eights, bridge third.", hint:"Three A's." },
    { type:"mc", q:"What is the common name for the B section in AABA form?", choices:["Bridge","Introduction","Outro"], answer:0,
      explain:"The bridge provides contrast before the final return of A.", hint:"Crosses to A's return." },
    { type:"mc", q:"In a typical verse–chorus song, the verses normally…", choices:["use similar music with different lyrics","use completely unrelated music and lyrics","appear only once"], answer:0,
      explain:"Successive verses normally continue the text using the same or similar musical setting.", hint:"Compare the music and lyrics of successive verses." },
    { type:"mc", q:"In a typical verse–chorus song, the chorus…", choices:["returns with substantially the same lyrics and music","never returns","contains no melody"], answer:0,
      explain:"The recurring chorus often contains the song's principal hook.", hint:"Identify the recurring section." },
    { type:"mc", q:"A five-stanza folk ballad uses the same music for every stanza. What is its form?", choices:["Strophic","AABA","Through-composed"], answer:0,
      explain:"A per verse.", hint:"One tune, many texts." },
    { type:"mc", q:"An art song continually introduces new large-scale music as the poem unfolds, without returning to a complete previous section. What is its form?", choices:["Through-composed","Strophic","Verse–chorus"], answer:0,
      explain:"Music travels with the text.", hint:"No complete section returns." },
    { type:"truefalse", q:"In AABA form, the contrasting B section occupies the third formal position.", answer:true,
      explain:"A A B A.", hint:"Count the slots." },
    { type:"truefalse", q:"A verse–chorus song may include a bridge in addition to its verses and choruses.", answer:true,
      explain:"A bridge often appears later in a song, but its placement may vary.", hint:"The late-song contrast." },
    { type:"mc", q:"Which form is represented by V–C–V–C–B–C?", choices:["Verse–chorus form with a bridge","Strophic form","Rondo form"], answer:0,
      explain:"The sequence alternates verses and choruses, followed by a bridge and returning chorus.", hint:"Hook keeps returning." },
    { type:"mc", q:"Which strategy is most useful for beginning a song-form analysis?", choices:["Identify the sections, determine what repeats, and locate contrasting material","Measure only the dynamics and tempo","Identify only the key and meter"], answer:0,
      explain:"Formal analysis begins by mapping sections and their relationships.", hint:"Begin by mapping the sections." }
  ],
  miaPerfect:"Perfect score! You accurately identified strophic, through-composed, AABA, and verse–chorus forms.",
  miaPass:"You passed and completed unit 22. Next, you will study seventh chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both verses used identical music — with changing words, that is strophic form.",
      play:()=>{[64,64,65,67,67,65,64,62,60].forEach((m,i)=>MFAudio.tone(m,.3,i*.3,.42));} },
    learn:{ label:"song forms",
      explain:"Strophic (A A A), modified strophic (recurring music with changes), through-composed (no recurring large section), 32-bar AABA (bridge third), verse-chorus (verses alternate with a recurring chorus).",
      hint:"What repeats, and how?",
      play:()=>{[60,64,67,69,67].forEach((m,i)=>MFAudio.tone(m,.32,i*.3,.42));} },
    example:{ label:"the examples",
      explain:"Example ① is the A phrase; example ② the bridge; example ③ plays the whole AABA so you hear the two A's frame the B." },
    game:{ label:"the games",
      explain:"Identify the forms, assemble AABA, build a verse-chorus song in order, then name forms from descriptions.",
      hint:"Bridge = the B slot." },
    quiz:{ label:"this question",
      explain:"One method: find what repeats. Whole tune per verse = strophic; no recurring large section = through-composed; AABA = bridge third; verse/chorus alternation = verse-chorus form.",
      play:()=>{[60,64,67,72].forEach((m,i)=>MFAudio.tone(m,.34,i*.3,.42));} }
  }
};
