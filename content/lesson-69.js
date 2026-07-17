/* Lesson 69 — Composing a Melody in a Minor Key (AEMT Book 3, Unit 17)
   Built from drafts/UNIT 17 – Lesson 69.md; AEMT3 p.109 verified by render.
   Core: same method as major — melody from CHORD TONES of the progression,
   decorated with passing/neighboring tones. First and last note tends to be
   the root of the i chord; V(7) precedes the last chord. The book's model
   (Pat-A-Pan, D minor) labels notes R / 3 / 5 / U / L / P.
   NOTE: edit by FULL-FILE REWRITE only. */

/* compose in D minor: pick chord tones over i - iv - i - V7 - i */
function MF_L69_compose(container,fb){
  const MEAS=[
    {label:"i", sym:"Dm", tones:{D:62,F:65,A:69}, chord:[50,62,65,69], must:"D",
      note:"Rule: begin on the root of i."},
    {label:"iv", sym:"Gm", tones:{G:67,"B♭":70,D:74}, chord:[43,58,62,67],
      note:"Any tone of G-B♭-D fits here."},
    {label:"i", sym:"Dm", tones:{D:74,F:77,A:69}, chord:[50,62,65,69],
      note:"Home again — any D-minor tone."},
    {label:"V7", sym:"A7", tones:{A:69,"C♯":73,E:76,G:79}, chord:[45,61,64,67],
      note:"The dominant — C♯ (the raised 7th of D minor!) creates the strongest pull."},
    {label:"i", sym:"Dm", tones:{D:74}, chord:[50,62,65,69], must:"D",
      note:"Rule: end on the root of the final i."}];
  let k=0; const picked=[];
  container.innerHTML=`<div class="big-q l69c-q" style="text-align:center"></div>
    <div class="l69c-map" style="text-align:center;margin:10px 0;letter-spacing:normal"></div>
    <div class="choices chips l69c-ch"></div>
    <div style="text-align:center"><button class="play l69c-play" style="display:none">▶ Play YOUR minor composition</button></div>`;
  const q=container.querySelector(".l69c-q"), map=container.querySelector(".l69c-map"), ch=container.querySelector(".l69c-ch"), pl=container.querySelector(".l69c-play");
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
    if(!M.must) opts.push(k===1?"E":"B♮");
    opts.sort(()=>Math.random()-.5).forEach(name=>{
      const b=document.createElement("button"); b.textContent=name;
      b.onclick=()=>{
        const M2=MEAS[k];
        if(M2.must && name!==M2.must){ MFAudio.tone(40,.2); fb(false,`The ${k===0?"first":"last"} note tends to be the root of i — that's ${M2.must}.`); return; }
        if(M2.tones[name]===undefined){ MFAudio.tone(40,.2); fb(false,`${name} is not a tone of ${M2.sym}. Start with a chord tone — non-harmonic tones come later!`); return; }
        MFAudio.tone(M2.tones[name],.7,.05,.44);
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
      MFAudio.tone(p.midi,.8,i*.88,.46);
      MEAS[i].chord.forEach(m=>MFAudio.tone(m,.85,i*.88,.2));
    });
    setTimeout(()=>fb(true,"✓ Root of i at both ends, A7 setting up the close — your own minor melody."),4900);
  };
  ask();
}

/* label detective: decode R/3/5/U/L/P on a D-minor phrase */
function MF_L69_labels(container,fb){
  const ROUNDS=[
    {ps:["D4","D4","A4"], chord:"Dm (D-F-A)", target:null, labels:["R","R","5"], ask:2, answer:"5",
      expl:"D is the root (R, twice); A is the chord's 5th → label 5."},
    {ps:["A4","G4","A4"], chord:"Dm (D-F-A)", ask:1, answer:"L",
      expl:"A…G…A — leaves the 5th, goes BELOW, returns: G is a Lower neighboring tone (L)."},
    {ps:["F4","E4","D4"], chord:"Dm (D-F-A)", ask:1, answer:"P",
      expl:"F (3) down to D (R) through E: a Passing tone (P)."}];
  const OPTS=["R","3","5","P","U","L"];
  let r=0;
  container.innerHTML=`<div class="big-q l69l-q" style="text-align:center"></div>
    <div class="l69l-staff"></div>
    <div class="choices chips l69l-ch"></div>`;
  const q=container.querySelector(".l69l-q"), holder=container.querySelector(".l69l-staff"), ch=container.querySelector(".l69l-ch");
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You identified all the labels."; holder.innerHTML=""; ch.innerHTML=""; return; }
    const R=ROUNDS[r];
    q.innerHTML=`Harmony: <b>${R.chord}</b>. What label belongs under the <b>${["first","second","third"][R.ask]}</b> note?`;
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,i)=>({p,d:"q",label:i===R.ask?"?":undefined})),width:300});
    ch.innerHTML="";
    OPTS.forEach(o=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const R2=ROUNDS[r];
        if(o===R2.answer){
          R2.ps.forEach((p,ix)=>MFAudio.tone(MFAudio.midi(p),.45,.05+ix*.4,.42));
          fb(true,`✓ ${R2.expl}`);
          r++; setTimeout(ask,1500); }
        else { MFAudio.tone(40,.2); fb(false,"Is the note IN D-F-A (then R/3/5) or outside it (then P/U/L by its journey)?"); }
      };
      ch.appendChild(b);
    });
  }
  ask();
}

LESSON_CONTENT[69]={
  welcome:"Composing a melody in a minor key. \u{1F58B}\u{FE0F}",
  hook:{
    say:"<b>Here is a simple chord progression in a minor key:</b> i - iv - V7 - i. Listen to the chords alone, then with a composed melody. <b>How can you create a melody that fits these chords?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Chords alone</button>
          <button class="play hk-b">▶ Chords + melody</button></div>
          <div class="choices hk-ch" style="display:none"><button>Build it from each chord's own tones</button><button>Play it more slowly</button><button>Use a special clef</button></div>`;
        const chords=[[50,62,65,69],[43,58,62,67],[45,61,64,67],[50,62,65,69]];
        const mel=[74,70,73,74];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ chords.forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.25))); hA=true; if(hB) setTimeout(()=>ch.style.display="",3900); };
        container.querySelector(".hk-b").onclick=()=>{ chords.forEach((row,i)=>{ row.forEach(m=>MFAudio.tone(m,.85,i*.9,.2)); MFAudio.tone(mel[i],.8,i*.9,.46); }); hB=true; if(hA) setTimeout(()=>ch.style.display="",3900); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ D from Dm, B♭ from Gm, C♯ from A7 — the melody is built from each chord's own tones, so it inherits the minor mood automatically. Same method as Lesson 67, new mode. Today: composing in minor!");
          else fb(false,"Tempo and clef don't create the fit. Listen to WHICH notes were chosen…");
        });
      } }
  },
  objectives:[
    "Compose a minor melody the same way as a major one",
    "Analyze first: numerals below, symbols above",
    "Build the melody from chord tones — including the raised 7th in V(7)",
    "Add passing and neighboring tones",
    "Begin and end on the root of i; V(7) precedes the last chord",
    "Read the model's labels: R / 3 / 5 / U / L / P"
  ],
  steps:[
    { say:"<b>Composing a Melody in a Minor Key:</b> Composing in a minor key follows the same process as composing in a major key. Build the melody from the tones of the chord progression. \u{1F447} <b>What changes when composing in a minor key?</b>",
      try:{ type:"mc", choices:["Only the chords — the method stays identical","Everything about the method","You may not use passing tones"], answer:0,
        success:"✓ Only the chords change — the process stays the same.",
        fail:"Compare with Lesson 67's checklist…",
        hint:"Method vs materials." } },
    { say:"<b>Analyze the Chords:</b> Before writing the melody, identify the Roman numerals and chord symbols. In D minor: i = Dm · iv = Gm · V7 = A7. \u{1F447} <b>Why does A7 contain C♯?</b>",
      try:{ type:"mc", choices:["D minor's harmonic scale raises its 7th, which is A7's 3rd","A7 always has sharps","It's borrowed from D major"], answer:0,
        success:"✓ Lesson 60's logic rides along: the raised 7th (C♯) lives inside V7 and pulls to D.",
        fail:"What note is a half step below D — and which chord owns it?",
        hint:"The leading tone of D minor." } },
    { say:"<b>Beginning and Ending:</b> Most minor melodies begin and end on the <b>root of the i chord</b>. A <b>V (or V7)</b> chord usually comes before the final i chord. \u{1F447} <b>Which note is the best opening note in D minor?</b>",
      try:{ type:"mc", choices:["D","A","F"], answer:0,
        success:"✓ D — the root of i, at both ends. The same rule as major.",
        fail:"The root of the i chord in D minor is…",
        hint:"The key's own name." } },
    { say:"<b>Reading the Labels:</b> R = root · 3 = third · 5 = fifth · U = upper neighbor · L = lower neighbor · P = passing tone. Identify the labels. \u{1F447}",
      try:{ type:"custom",
        hint:"In the chord → R/3/5. Outside it → P (passing), U (above), L (below).",
        mount:(container,fb)=>MF_L69_labels(container,fb) } },
    { say:"Compose a five-measure melody using the given progression: <b>i - iv - i - V7 - i</b> in D minor. \u{1F447}",
      try:{ type:"custom",
        hint:"Start with chord tones; D at both ends; try the C♯ over A7 for the strongest pull.",
        mount:(container,fb)=>MF_L69_compose(container,fb) } },
    { say:"<b>Adding Non-Harmonic Tones:</b> After building the melody with chord tones, add passing and neighboring tones. <b>Remember: start with chord tones. Add non-harmonic tones to make the melody smoother and more interesting.</b> \u{1F447} <b>Where do these tones usually appear?</b>",
      try:{ type:"mc", choices:["On weak beats, between chord tones","On every strong beat","Only in the bass"], answer:0,
        success:"✓ On weak beats, between chord tones — the same rule as in major.",
        fail:"Same rule as in major…",
        hint:"Chord tones on strong beats; decorations on weak beats." } },
    { say:"<b>Try Another Key:</b> Apply the same process in E minor (Em - Am - B7 - Em). \u{1F447} <b>Which melody note creates the strongest pull to the tonic?</b>",
      try:{ type:"mc", choices:["D♯ — the raised 7th, a half step under E","B — the root","A — the 7th"], answer:0,
        success:"✓ D♯ — the leading tone, a half step below E. Place it near the end of the phrase.",
        fail:"Which note of B-D♯-F♯-A is a half step from the tonic E?",
        hint:"The raised 7th, always." } }
  ],
  examples:[
    { caption:"A composed D-minor melody with labels: chord tones (R, 3, 5) on the strong beats; a lower neighbor (L) decorates a weak one.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"D4",d:"q",label:"R"},{p:"F4",d:"q",label:"3"},{p:"A4",d:"q",label:"5"},{p:"G4",d:"q",label:"L"},{bar:"single"},
        {p:"A4",d:"q",label:"5"},{p:"Bb4",d:"q",label:"3/iv"},{p:"G4",d:"h",label:"R/iv"},{bar:"single"},
        {p:"A4",d:"q",label:"R/V7"},{p:"C#5",d:"q",label:"3/V7"},{p:"E5",d:"h",label:"5/V7"},{bar:"single"},
        {p:"D5",d:"w",label:"R/i — home"},{bar:"final"}],width:800},
      kb:{start:60,octaves:1.3333,labels:true} },
    { caption:"The same melody twice: chord tones only, then with a passing tone and an upper neighbor added.",
      staff:{clef:"treble",tempo:100,time:"4/4",notes:[
        {p:"D4",d:"h",label:"chord tones"},{p:"F4",d:"h"},{bar:"single"},{p:"A4",d:"h"},{p:"D5",d:"h"},{bar:"double"},
        {p:"D4",d:"q",label:"+ P & U"},{p:"E4",d:"q",label:"P"},{p:"F4",d:"q"},{p:"G4",d:"q",label:"P"},{bar:"single"},{p:"A4",d:"q"},{p:"Bb4",d:"q",label:"U"},{p:"A4",d:"q"},{p:"D5",d:"q"},{bar:"final"}],width:800},
      kb:{start:60,octaves:1.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Label Sprint (45s)",
      intro:"R, 3, 5, U, L, P — race the labels!",
      miaIntro:"Six little letters! \u{26A1}",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["R","the melody note is the chord's root"],
        ["3","the melody note is the chord's 3rd"],
        ["5","the melody note is the chord's 5th"],
        ["P","a passing tone between two chord tones"],
        ["U","an upper neighboring tone"],
        ["L","a lower neighboring tone"],
        ["First & last note (minor)","the root of the i chord"],
        ["Before the final chord","V or V7"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — label-literate!":null },
    { type:"key-climb", title:"Game 2 · Play a Model Phrase",
      intro:"Perform a labeled minor phrase: R-R-5-5-L-5-3-R in D minor!",
      miaIntro:"Composer's fingers on! \u{1FA9C}",
      spec:{seq:[62,62,69,69,67,69, 65,62],
        names:["D (R)","D (R)","A (5)","A (5)","G (L — the lower neighbor!)","A (5)","F (3)","D (R — home)"],
        start:57, octaves:1.1667, title:"A Pat-A-Pan-style phrase in D minor"},
      result:(score)=>score!==null?"Model phrase performed!":null },
    { type:"symbol-hunt", title:"Game 3 · Minor Safe-Note Spotter",
      intro:"A D-minor chord is called — click the melody fragment that fits inside it!",
      miaIntro:"Chord-tone check! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"Fits Dm (D-F-A)", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"F4",d:"q"}],width:170}},
        {label:"Fits Gm (G-B♭-D)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"Bb4",d:"q"},{p:"D5",d:"q"},{p:"Bb4",d:"q"}],width:170}},
        {label:"Fits A7 (A-C♯-E-G)", spec:{clef:"treble",notes:[{p:"A4",d:"q"},{p:"C#5",d:"q"},{p:"E5",d:"q"},{p:"G5",d:"q"}],width:170}},
        {label:"Fits NO single chord", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"}],width:170}}]},
      result:(score)=>score>=5?"Chord tones spotted on sight!":null },
    { type:"term-race", title:"Game 4 · Minor Composer's Race",
      intro:"The method, the frame, the raised 7th — everything from Lessons 68-69!",
      miaIntro:"Compose at speed! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Composing in minor","same method as major, minor chords"],
        ["The melody's source","each measure's chord tones"],
        ["The decorations","passing & neighboring tones (weak beats)"],
        ["First & last note","root of i"],
        ["The pre-final chord","V or V7"],
        ["C♯ over A7 in D minor","the raised 7th — maximum pull"],
        ["V7 of D minor","A7 (A-C♯-E-G)"],
        ["V7 of E minor","B7 (B-D♯-F♯-A)"]]},
      result:(score)=>score>=6?"Minor composing: mastered!":null }
  ],
  practiceIntro:"20 practice questions — method, labels and the minor frame. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["R","chord root in the melody"],["3","chord 3rd in the melody"],["5","chord 5th in the melody"],["P","passing tone"],["U","upper neighbor"],["L","lower neighbor"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"Composing a melody in a minor key is…", choices:["similar to composing in a major key","entirely different","not possible with three chords"], answer:0,
      explain:"Same process, different chords." },
    { type:"mc", q:"What is the melody based on?", choices:["The tones in the chord accompaniment","Random chromatic notes","The drum part"], answer:0,
      explain:"Chord tones are the source." },
    { type:"mc", q:"The first and last note of a minor melody tends to be…", choices:["the root of the i chord","the 5th of V","the raised 7th"], answer:0,
      explain:"Home at both ends — minor edition." },
    { type:"mc", q:"In D minor, the V7 chord is…", choices:["A7 (A-C♯-E-G)","A minor 7","G7"], answer:0,
      explain:"The raised C♯ makes it major-with-a-7th." },
    { type:"mc", q:"Which note is a chord tone over G minor (G-B♭-D)?", choices:["B♭","C","E"], answer:0,
      explain:"Only chord tones form the framework." },
    { type:"mc", q:"The label 'U' under a melody note means…", choices:["upper neighboring tone","unison","up-bow"], answer:0,
      explain:"A visit from above, then home." },
    { type:"truefalse", q:"Non-harmonic tones make a composed minor melody more interesting.", answer:true,
      explain:"They add smoothness and interest in both modes." },
    { type:"truefalse", q:"A V or V7 usually precedes the final chord in a minor composition.", answer:true,
      explain:"The frame rule survives the mode change." },
    { type:"truefalse", q:"The labels under the melody notes name their chord-member roles.", answer:true,
      explain:"Each names its note's chord-member role." },
    { type:"truefalse", q:"The raised 7th should be avoided in a minor melody.", answer:false,
      explain:"No — it is the leading tone inside V7, pulling to the tonic." }
  ],
  miaQuizIntro:"Quiz! Same checklist, minor palette — and let the C♯ do its magic.",
  quiz:[
    { type:"mc", q:"What is the basic process for composing a melody in a minor key?", choices:["The same as major: analyze, chord tones, non-harmonic tones, beginning and ending","A special minor-only method","Free improvisation with no rules"], answer:0,
      explain:"One process, both modes.", hint:"Lesson 67's four steps." },
    { type:"mc", q:"What should most melody notes come from?", choices:["The tones of the chord accompaniment","The chromatic scale","A different key"], answer:0,
      explain:"Each measure's chord provides the notes that fit.", hint:"The hook's discovery." },
    { type:"mc", q:"Begin by analyzing the progression and writing…", choices:["Roman numerals under the chords, symbols above the staff","the melody first","the tempo marking"], answer:0,
      explain:"Analysis shows which notes fit each harmony.", hint:"Numerals below, symbols above." },
    { type:"mc", q:"The first and last note of the melody tends to be…", choices:["the root of the i chord","any chord tone","the leading tone"], answer:0,
      explain:"D to D in D minor.", hint:"The root of i." },
    { type:"truefalse", q:"A V (or V7) usually precedes the last chord.", answer:true,
      explain:"The universal cadence rule.", hint:"Fourth lesson in a row!" },
    { type:"truefalse", q:"The labels U and L mark upper and lower neighboring tones.", answer:true,
      explain:"The model's decoration marks.", hint:"Lesson 66 vocabulary." },
    { type:"mc", q:"Which note is not part of the A7 chord?", choices:["D","A","C♯","E"], answer:0,
      explain:"A7 = A-C♯-E-G; D is not a chord tone.", hint:"Spell A7." },
    { type:"mc", q:"A melody measure over Dm reads A-G-A. The G is labeled…", choices:["L — lower neighboring tone","P — passing tone","5 — a chord tone"], answer:0,
      explain:"A…A — same tone, from below → L.", hint:"Same landing = neighbor." },
    { type:"mc", q:"A melody measure over Dm reads F-E-D. The E is labeled…", choices:["P — passing tone","U — upper neighbor","3 — a chord tone"], answer:0,
      explain:"3 down to R through E → P.", hint:"Different landing = passing." },
    { type:"mc", q:"Why does C♯ create a strong pull to D?", choices:["It is the leading tone, one half step below the tonic","It is the loudest available note","It cancels the minor key"], answer:0,
      explain:"Leading tone → tonic.", hint:"What is a half step above C♯?" },
    { type:"mc", q:"Composing over Em - Am - B7 - Em, your last note should be…", choices:["E","B","D♯"], answer:0,
      explain:"Root of the final i.", hint:"The frame rule, transposed." },
    { type:"mc", q:"Can two different melodies fit the same chord progression?", choices:["Yes — different melodies can use the same progression successfully","No — only one melody is correct","Only in major keys"], answer:0,
      explain:"Chord tones offer many valid paths.", hint:"Uniqueness is the point." },
    /* generated */
    { gen:"term-match", params:{subject:"term", pool:[["R/3/5","chord-member labels"],["P","passing tone"],["U/L","the neighboring tones"],["The frame","root of i at both ends"]], reverse:true}, count:3 },
    { gen:"rel-key", params:{ask:"both"}, count:2 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:1 }
  ],
  vocabulary:[
    {term:"Composing in Minor", def:"Creating a melody for a minor-key progression — same steps as major: analyze, chord tones, non-harmonic tones, beginning and ending."},
    {term:"R / 3 / 5 / U / L / P", def:"The full label set: chord members (root/3rd/5th) plus the non-harmonic tones (upper, lower, passing)."},
    {term:"The Minor Frame", def:"Begin and end on the ROOT of i; V(7) — with its raised 7th — precedes the final chord."},
    {term:"The C♯ Effect", def:"In D minor, the raised 7th inside A7 pulls straight to D — put it late in the phrase and the ending writes itself.",
      staff:{clef:"treble",notes:[{p:"C#5",d:"h"},{p:"D5",d:"h"}],width:260}}
  ],
  mistakes:[],
  summary:[
    "✔ Minor composing = <b>major composing with minor chords</b>: analyze → chord tones → non-harmonic tones → beginning and ending.",
    "✔ Build from <b>chord tones</b>; add P/U/L on <b>weak beats</b>.",
    "✔ Begin and end on the <b>root of i</b>; <b>V(7)</b> before the close.",
    "✔ The labels: <b>R, 3, 5, U, L, P</b> — read them, then write with them.",
    "✔ The <b>raised 7th</b> (C♯ in D minor) is your strongest melodic magnet."
  ],
  tips:[
    "Give your minor melody ONE C♯ moment near the end — listeners will feel the homecoming without knowing why.",
    "The 3rd of i (F in D minor) is the single most 'minor-sounding' melody note. Lean on it when you want maximum mood.",
    "Label everything you write for a week — R/3/5/P/U/L. Analysis and composition are the same muscle.",
    "Next lesson, something completely different: a 12-bar progression born in America's south — the BLUES."
  ],
  rewards:{ badge:"Minor Composer", icon:"\u{1F58B}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT! You can compose minor melodies with confidence. \u{1F58B}\u{FE0F}\u{1F389}",
  miaPass:"Passed! Two modes of composing conquered. Now — the blues is calling…",
  mia:{
    hook:{ label:"the welcome",
      explain:"The melody drew from each chord's own tones — D from Dm, B♭ from Gm, C♯ from A7 — inheriting the minor mood note by note.",
      play:()=>{const chords=[[50,62,65,69],[43,58,62,67],[45,61,64,67],[50,62,65,69]],mel=[74,70,73,74];chords.forEach((row,i)=>{row.forEach(m=>MFAudio.tone(m,.85,i*.9,.2));MFAudio.tone(mel[i],.8,i*.9,.46);});} },
    learn:{ label:"minor composing",
      explain:"Same process as major. i=Dm, iv=Gm, V7=A7 (with the raised C♯). Begin and end on the root of i; add P/U/L on weak beats.",
      hint:"Analyze → chord tones → non-harmonic tones → beginning and ending.",
      play:()=>{[62,65,69,67,69].forEach((m,i)=>MFAudio.tone(m,.5,i*.42,.42));} },
    example:{ label:"the examples",
      explain:"Example 1 is a fully labeled minor melody; example 2 shows the same melody before and after adding non-harmonic tones." },
    game:{ label:"the games",
      explain:"Sprint the labels, perform a model phrase, spot chord tones, then race the composer facts.",
      hint:"R/3/5 inside the chord; P/U/L outside it." },
    quiz:{ label:"this question",
      explain:"Everything reduces to the four steps — and in minor, the raised 7th inside V7 pulls to the tonic.",
      play:()=>{[45,61,64,67].forEach(m=>MFAudio.tone(m,.8,0,.3));[50,62,65,69].forEach(m=>MFAudio.tone(m,1,.9,.3));} }
  }
};
