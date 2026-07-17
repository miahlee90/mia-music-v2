/* Lesson 101 — Theme and Variations (Book 4, Unit 25 — SELF-AUTHORED)
   Core: a THEME stated, then VARIATIONS that keep its identity while
   changing one dimension at a time: melodic ornamentation, rhythmic
   variation, mode change (major<->minor), harmony/texture change.
   NOTE: edit by FULL-FILE REWRITE only. */

/* which dimension changed? ear lab */
function MF_L101_ear(container,fb){
  const THEME=[[60,.5],[64,.5],[67,.5],[64,.5],[60,1.0]];
  const V={
    orn:[[60,.25],[62,.25],[64,.25],[65,.25],[67,.5],[64,.5],[60,1.0]],
    rhythm:[[60,.25],[60,.25],[64,.25],[64,.25],[67,.25],[67,.25],[64,.5],[60,.75]],
    minor:[[60,.5],[63,.5],[67,.5],[63,.5],[60,1.0]]};
  const NAME={orn:"Melodic ornamentation — extra notes decorate the line",rhythm:"Rhythmic variation — the note values changed",minor:"Mode change — major turned minor"};
  const ROUNDS=["minor","orn","rhythm"], KEY=["orn","rhythm","minor"];
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l101e-q" style="text-align:center">Round 1 of 3: hear the THEME, then the variation. What changed?</div>
    <div style="text-align:center">
      <button class="play l101e-t">▶ Theme</button>
      <button class="play l101e-v">▶ Variation</button></div>
    <div class="choices l101e-ch" style="display:none"><button>Ornamentation</button><button>Rhythm</button><button>Mode (minor)</button></div>`;
  const q=container.querySelector(".l101e-q"), ch=container.querySelector(".l101e-ch");
  const play=(P)=>{ let t=0; P.forEach(([m,d])=>{ MFAudio.tone(m,d*.9,t,.42); t+=d; }); return t; };
  container.querySelector(".l101e-t").onclick=()=>play(THEME);
  container.querySelector(".l101e-v").onclick=()=>{ const w=ROUNDS[r]; if(!w) return; const d=play(V[w]); played=true; setTimeout(()=>ch.style.display="",d*1000+300); };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    if(KEY[i]===ROUNDS[r]){ fb(true,"✓ "+NAME[ROUNDS[r]]+"."); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! Every variation dimension identified."; } else q.innerHTML=`Round ${r+1} of 3: theme, then variation — what changed?`;
    } else { MFAudio.tone(40,.2); fb(false,"Compare with the theme: extra notes? new note values? or a darker 3rd?"); }
  });
}

LESSON_CONTENT[101]={
  welcome:"Theme and variations transforms a musical idea while preserving meaningful connections to it.",
  hook:{
    say:"<b>Listen to a simple theme and a variation.</b> \u{1F447} <b>Which features preserve the connection to the theme, and which features have changed?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Theme</button>
          <button class="play hk-b">▶ Variation</button></div>
          <div class="choices hk-ch" style="display:none"><button>The outline stayed; extra notes decorated it</button><button>Everything changed</button><button>Nothing changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [[60,.5],[64,.5],[67,.5],[64,.5],[60,1.0]].forEach(([m,d],i)=>{}); let t=0; [[60,.5],[64,.5],[67,.5],[64,.5],[60,1.0]].forEach(([m,d])=>{ MFAudio.tone(m,d*.9,t,.42); t+=d; }); hA=true; if(hB) setTimeout(()=>ch.style.display="",3200); };
        container.querySelector(".hk-b").onclick=()=>{ let t=0; [[60,.25],[62,.25],[64,.25],[65,.25],[67,.5],[65,.25],[64,.25],[60,1.0]].forEach(([m,d])=>{ MFAudio.tone(m,d*.9,t,.42); t+=d; }); hB=true; if(hA) setTimeout(()=>ch.style.display="",2900); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. The outline C–E–G–E–C remains recognizable, while passing tones add melodic detail. This is one way to create a variation.");
          else fb(false,"Compare the principal pitches and contour of the theme with the embellished version.");
        });
      } }
  },
  objectives:[
    "Define theme and variations: a theme stated, then transformed repeatedly",
    "Keep an identifiable relationship to the theme while transforming it",
    "Vary by MELODIC ORNAMENTATION (added notes)",
    "Vary by RHYTHM (new note values, new meter)",
    "Vary by MODE (major ↔ minor), harmony or texture",
    "Hear which dimension a variation changed"
  ],
  steps:[
    { say:"<b>The Form:</b> Theme and variations normally begins by presenting a theme, followed by a series of transformed restatements: Theme, Variation 1, Variation 2, and so forth. The theme may use binary form, a period, or another compact formal design. Each variation maintains an identifiable relationship to the theme, although that relationship may become increasingly subtle. \u{1F447} <b>The form's plan is…</b>",
      try:{ type:"mc", choices:["Theme, then transformed restatements","One long melody","Verse and chorus"], answer:0,
        success:"✓ Correct. The labels A–A′–A″–A‴ show successive transformations of related musical material.",
        fail:"Identify the musical material that returns in transformed form.",
        hint:"The theme provides the basis for each variation." } },
    { say:"<b>What May Remain:</b> Many variation sets preserve the theme's phrase structure, length, harmonic plan, bass pattern, or melodic outline. A variation does not need to preserve all these features. Composers select enough recognizable elements to maintain a meaningful relationship with the theme. \u{1F447} <b>Which features are commonly preserved in a variation?</b>",
      try:{ type:"mc", choices:["Some combination of phrase structure, harmonic plan, bass, or melodic outline","Only the exact original notes","No identifiable feature of the theme"], answer:0,
        success:"✓ Correct. A variation often preserves structural or melodic reference points while transforming other musical elements.",
        fail:"Identify the melodic or structural reference points shared with the theme.",
        hint:"Compare the contour, phrase organization, and harmonic motion." } },
    { say:"<b>Melodic Ornamentation:</b> An ornamented variation embellishes the theme with passing tones, neighboring tones, trills, turns, or other decorative figures. Principal pitches or points of arrival often remain recognizable within the more active melodic surface. \u{1F447} <b>An ornamented variation adds…</b>",
      try:{ type:"mc", choices:["Extra notes around the theme's tones","A new theme","Silence"], answer:0,
        success:"✓ Correct. Passing tones, neighboring tones, and ornaments add activity while preserving reference points from the theme.",
        fail:"Identify the embellishing pitches between the principal notes.",
        hint:"Review nonchord tones and ornaments." } },
    { say:"<b>Rhythmic Variation:</b> A composer may transform a theme by changing note values, rhythmic patterns, tempo, accent placement, or meter. The melodic contour or harmonic plan may remain recognizable even when the rhythmic surface changes substantially. \u{1F447} <b>A rhythmic variation changes…</b>",
      try:{ type:"mc", choices:["Durations (and possibly the meter)","Only the pitches","The instrument"], answer:0,
        success:"✓ Correct. A rhythmic variation changes the organization of musical time while preserving other recognizable connections to the theme.",
        fail:"Identify what changed in the durations, accents, or meter.",
        hint:"Compare the organization of musical time." } },
    { say:"<b>Mode, Harmony, and Texture:</b> A <b>minore</b> variation transforms a major-mode theme into the parallel minor mode. Other variations may reharmonize the melody, place the theme in the bass, treat it canonically, redistribute it among voices, or change the accompaniment and texture. Multiple musical dimensions may change within a single variation. The relationship to the theme may be maintained through its melody, bass, harmony, phrasing, form, or another recognizable feature. \u{1F447} <b>A 'minore' variation changes the theme's…</b>",
      try:{ type:"mc", choices:["Mode — major to minor","Length","Title only"], answer:0,
        success:"✓ Correct. The modal and harmonic content changes from major to parallel minor while other features connect the variation to the theme.",
        fail:"Identify the mode indicated by \"minore\".",
        hint:"In a C-major theme, a minore variation uses C minor, including E♭ and other minor-mode alterations as required." } },
    { say:"Identify the principal variation technique used in each example. \u{1F447}",
      try:{ type:"custom",
        hint:"Listen for melodic embellishment, rhythmic transformation, modal change, reharmonization, or a new texture. More than one technique may occur.",
        mount:(container,fb)=>MF_L101_ear(container,fb) } },
    { say:"<b>Review:</b> \u{1F447} <b>What helps listeners connect a variation to its theme?</b>",
      try:{ type:"mc", choices:["Each variation preserves enough recognizable features to remain connected to the theme","The variations are identical","The theme never returns"], answer:0,
        success:"✓ Correct. Each variation transforms the theme while retaining enough musical relationships to remain connected to it.",
        fail:"Identify the feature or combination of features that connects the variation to the theme.",
        hint:"Compare melody, bass, harmony, phrasing, and form." } }
  ],
  examples:[
    { caption:"Theme (C-E-G-E-C outline), then an ornamented variation: passing tones fill the 3rds; the core structure is untouched.",
      staff:{clef:"treble",tempo:88,time:"6/4",notes:[
        {p:"C4",d:"q",label:"theme"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{p:"C4",d:"h"},{bar:"single"},
        {p:"C4",d:"8",label:"var. 1"},{p:"D4",d:"8"},{p:"E4",d:"8"},{p:"F4",d:"8"},{p:"G4",d:"q"},{p:"F4",d:"8"},{p:"E4",d:"8"},{p:"C4",d:"h"},{bar:"final"}],
        beams:[[6,9],[11,12]],width:660},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"The minore variation: the C-major outline recast in minor — here E becomes E♭, and the minor mode recolors the theme.",
      staff:{clef:"treble",tempo:88,time:"6/4",notes:[
        {p:"C4",d:"q"},{p:"Eb4",d:"q",label:"minore"},{p:"G4",d:"q"},{p:"Eb4",d:"q"},{p:"C4",d:"h"},{bar:"final"}],width:440},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Variation Techniques (45s)",
      intro:"Identify melodic, rhythmic, modal, harmonic, and textural variation techniques.",
      miaIntro:"Determine what changed and what remained recognizable.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Theme and variations","theme + transformed restatements"],
        ["What may remain","phrase structure, harmony, or bass"],
        ["Melodic ornamentation","extra notes decorate the theme"],
        ["Rhythmic variation","new note values or meter"],
        ["Minore variation","major theme turned minor"],
        ["Texture variation","theme moves voice or becomes canon"],
        ["The listener's thread","the recognizable core structure"],
        ["Typical theme","a small binary tune"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Variation techniques identified!":null },
    { type:"key-climb", title:"Game 2 · Perform an Ornamented Variation",
      intro:"Play the theme C–E–G–E–C, followed by an ornamented version that connects the principal pitches with passing or neighboring tones.",
      miaIntro:"Keep the principal pitches recognizable.",
      spec:{seq:[60,64,67,64,60, 60,62,64,65,67,65,64,62,60],
        names:["C","E","G","E","C (theme)","C","D","E","F","G","F","E","D","C (ornamented!)"],
        start:60, octaves:1, title:"Theme and one variation"},
      result:(score)=>score!==null?"You performed the theme and its ornamented variation.":null },
    { type:"order-tap", title:"Game 3 · Assemble the Variation Set",
      intro:"Arrange a theme and its numbered variations in performance order.",
      miaIntro:"Begin with the theme, followed by the variations.",
      spec:{sequence:["Theme — stated plainly","Variation 1 — ornamented","Variation 2 — new rhythm","Variation 3 — minore","Final variation — brilliant finish"],
        title:"One variation set"},
      result:(stars)=>stars>=2?"You assembled the variation set correctly.":null },
    { type:"term-race", title:"Game 4 · Identify the Principal Change",
      intro:"Read each description and identify its principal variation technique.",
      miaIntro:"More than one musical element may change.",
      spec:{rounds:8, reverse:true, pool:[
        ["Sixteenth notes flood the tune","rhythmic variation"],
        ["Passing tones fill the 3rds","ornamentation"],
        ["E becomes E♭ throughout","mode (minore)"],
        ["Theme sinks into the bass","texture change"],
        ["2/4 becomes 3/8","meter variation"],
        ["New chords under old notes","reharmonization"],
        ["What every variation keeps","an identifiable relationship"],
        ["Keeping no shared features","loses the theme"]]},
      result:(score)=>score>=6?"You identified the variation techniques correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on theme relationships and melodic, rhythmic, modal, harmonic, and textural variation techniques.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Theme","stated plainly first"],["Variation","transformed restatement"],["Ornamentation","added notes"],["Minore","major→minor"],["Core Structure","what survives"]], reverse:true}, count:6 },
    { gen:"rhythm-count", params:{}, count:2 },
    { type:"mc", q:"A conventional theme-and-variations set normally begins with…", choices:["the plain theme","the loudest variation","a cadenza"], answer:0, explain:"State it, then transform it." },
    { type:"mc", q:"Which features may help preserve the connection between a theme and its variations?", choices:["Phrase structure, harmonic plan, bass, melodic outline, or form","Dynamics only","Title only"], answer:0, explain:"Any of several features can maintain the connection." },
    { type:"mc", q:"An ornamented variation may use…", choices:["passing tones, neighbors and ornaments","silence","a new key only"], answer:0, explain:"Nonchord tones and ornaments decorate the line." },
    { type:"mc", q:"A minore variation principally changes the theme's…", choices:["mode","meter","length"], answer:0, explain:"Major to parallel minor." },
    { type:"truefalse", q:"A variation may transform several musical dimensions at the same time.", answer:true, explain:"The connection to the theme can remain through melody, bass, harmony, phrasing, form, or other recognizable features." },
    { type:"truefalse", q:"A rhythmic variation may include a change of meter.", answer:true, explain:"2/4 → 3/8 is classic." },
    { type:"truefalse", q:"Each variation should maintain an identifiable relationship to the theme, even if that relationship becomes subtle.", answer:true, explain:"The form's contract." },
    { gen:"term-match", params:{subject:"term", pool:[["Var. in canon","texture"],["Dotted-rhythm var.","rhythm"],["Filigree var.","ornamentation"],["E♭ for E","minore"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Theme and Variations", def:"A theme stated plainly, then restated in successive transformations — A A\u{2032} A\u{2033}…"},
    {term:"Core Structure", def:"The recognizable features a variation keeps to stay connected to the theme, such as phrase structure, harmony, bass, or melodic outline."},
    {term:"Ornamented / Rhythmic Variation", def:"Added decorations around the theme's tones; or new note values and meters under its pitches."},
    {term:"Minore Variation", def:"The major-mode theme is recast in the parallel minor, and altered scale degrees give the music a different color."}
  ],
  mistakes:[],
  summary:[
    "✔ Plan: <b>theme → transformed restatements</b>.",
    "✔ Enough recognizable features (melody, phrases, harmony, bass, or form) connect every variation to the theme.",
    "✔ Dimensions: <b>ornamentation · rhythm/meter · mode · harmony · texture</b>.",
    "✔ A variation may transform several dimensions at once while staying connected to the theme.",
    "✔ Hearing a variation = asking <b>what changed?</b>"
  ],
  tips:[
    "Write your own: take L67's composed melody, add passing tones (var. 1), dot the rhythm (var. 2), turn it minor (var. 3).",
    "In classical sets, the last variation often speeds up brilliantly and the minore sits near the middle.",
    "Variation hearing is structure hearing — hum the theme UNDER each variation.",
    "Next lesson: the largest form yet — SONATA FORM."
  ],
  rewards:{ badge:"Transformer", icon:"\u{1F3A0}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Determine what changes and what preserves each variation's relationship to the theme.",
  quiz:[
    { type:"mc", q:"Theme and variations is best described as…", choices:["a theme, then transformed restatements","two contrasting sections","a fugue"], answer:0, explain:"A A\u{2032} A\u{2033}…", hint:"One identity." },
    { type:"mc", q:"Which feature can connect a variation to its theme?", choices:["A recognizable melodic, harmonic, rhythmic, or structural relationship","The exact original pitches in every case","No shared musical feature"], answer:0, explain:"An identifiable relationship connects each variation to the theme.", hint:"What connects them?" },
    { type:"mc", q:"A theme is embellished with passing tones, neighboring tones, and trills. Which technique is most prominent?", choices:["Melodic ornamentation","Modal transformation","Meter change"], answer:0, explain:"Melodic decoration.", hint:"Added notes." },
    { type:"mc", q:"Quarter notes are transformed into continuous sixteenth-note figuration while the theme remains recognizable. Which technique is most prominent?", choices:["Rhythmic variation","Modal variation","Textural variation"], answer:0, explain:"The rhythmic surface changes while the theme stays recognizable.", hint:"Time changed." },
    { type:"mc", q:"A minore variation normally…", choices:["Transforms a major-mode theme into the parallel minor mode","Removes every reference to the theme","Automatically doubles the tempo"], answer:0, explain:"In C, the modal change includes E♭ and other pitches or harmonies required by C minor.", hint:"The parallel minor mode." },
    { type:"mc", q:"The theme moves to the bass while new figuration appears above it. Which musical dimension changes most clearly?", choices:["Texture","Title","Length only"], answer:0, explain:"Who carries the tune.", hint:"Layers." },
    { type:"truefalse", q:"A variation may change the theme's meter.", answer:true, explain:"A classic rhythmic transformation.", hint:"2/4 → 3/8." },
    { type:"truefalse", q:"In a conventional theme-and-variations set, the theme is normally presented before the variations.", answer:true, explain:"The theme is stated first, then transformed.", hint:"State, then vary." },
    { type:"mc", q:"Why may a composer retain some features while changing several others?", choices:["To maintain an identifiable relationship with the theme","Only to reduce the amount of printed music","Because variations may change only one feature"], answer:0, explain:"Identity + transformation.", hint:"The contract." },
    { type:"mc", q:"A C-major theme is restated using C-minor melody and harmony. What type of variation is this?", choices:["Minore variation","Ornamented variation only","Rhythmic variation only"], answer:0, explain:"Mode change.", hint:"The parallel minor mode." },
    { type:"mc", q:"Which earlier concepts are especially useful when creating an ornamented melodic variation?", choices:["Nonchord tones and ornaments","Twelve-bar blues only","Meter signatures only"], answer:0, explain:"Decoration toolkits.", hint:"The decorators." },
    { type:"mc", q:"Which listening strategy is most useful when comparing a variation with its theme?", choices:["Identify what changed and which features preserve the connection","Listen only to the dynamic level","Identify only the clef"], answer:0, explain:"Ask what changed and what connects it to the theme.", hint:"Two questions." }
  ],
  miaPerfect:"Perfect score! You accurately identified several techniques used to transform a theme.",
  miaPass:"You passed! Next, you will study sonata form.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The variation decorated the C-E-G-E-C core structure with passing tones — identity kept, surface changed.",
      play:()=>{let t=0;[[60,.25],[62,.25],[64,.25],[65,.25],[67,.5],[65,.25],[64,.25],[60,1.0]].forEach(([m,d])=>{MFAudio.tone(m,d*.9,t,.42);t+=d;});} },
    learn:{ label:"theme and variations",
      explain:"Theme stated, then transformed: ornamentation, rhythm/meter, mode (minore), harmony, or texture — several dimensions may change while an identifiable relationship to the theme remains.",
      hint:"What changed?",
      play:()=>{let t=0;[[60,.5],[63,.5],[67,.5],[63,.5],[60,1.0]].forEach(([m,d])=>{MFAudio.tone(m,d*.9,t,.42);t+=d;});} },
    example:{ label:"the examples",
      explain:"Example 1 states the theme and ornaments it; example 2 recolors it minore." },
    game:{ label:"the games",
      explain:"Sprint the dimensions, play theme-plus-variation, order a set, then name what changed.",
      hint:"Hum the theme outline." },
    quiz:{ label:"this question",
      explain:"Every variation question asks: what changed — notes added, time reshaped, mode darkened, texture shifted — and what still connects it to the theme?",
      play:()=>{let t=0;[[60,.25],[60,.25],[64,.25],[64,.25],[67,.5]].forEach(([m,d])=>{MFAudio.tone(m,d*.9,t,.4);t+=d;});} }
  }
};
