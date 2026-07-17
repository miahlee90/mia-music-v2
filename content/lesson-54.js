/* Lesson 54 — Figured Bass (AEMT Book 3, Unit 13)
   Built from drafts/UNIT 13 – Lesson 54.md; AEMT3 p.86 verified by render.
   Core: numbers under the Roman numeral = intervals ABOVE THE BASS →
   the inversion. Baroque origin (1600–1750). Triads: (5/3)=root, 6=1st, 6/4=2nd.
   Sevenths: 7=root, 6/5=1st, 4/3=2nd, 4/2=3rd. Letter symbols (C/E) go ABOVE
   the staff; Roman numerals (I⁶) go BELOW. Figures shown with Unicode ⁶₄.
   NOTE: edit by FULL-FILE REWRITE only. */

/* interval counter: click up from the bass to discover the figures */
function MF_L54_count(container,fb){
  const ROUNDS=[
    {ps:["E4","G4","C5"], name:"C major, 1st inversion", ints:["a 3rd","a 6th"], figure:"6 (from 6/3)",
      expl:"Bass E → G is a 3rd, E → C is a 6th: figures 6/3, shortened to 6. So this is I⁶."},
    {ps:["G4","C5","E5"], name:"C major, 2nd inversion", ints:["a 4th","a 6th"], figure:"6/4",
      expl:"Bass G → C is a 4th, G → E is a 6th: figures 6/4 — the I⁶₄ chord."}];
  let r=0, k=0;
  container.innerHTML=`<div class="big-q l54c-q" style="text-align:center"></div>
    <div class="l54c-staff"></div>
    <div class="choices chips l54c-ch"></div>`;
  const q=container.querySelector(".l54c-q"), holder=container.querySelector(".l54c-staff"), ch=container.querySelector(".l54c-ch");
  function draw(){
    const R=ROUNDS[r];
    Staff.render(holder,{clef:"treble",notes:R.ps.map((p,ix)=>ix===0?{p,d:"w",label:R.name}:{p,d:"w",chord:true}),width:260});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You decoded both figured bass symbols."; ch.innerHTML=""; holder.innerHTML=""; return; }
    const R=ROUNDS[r]; k=0; draw();
    q.innerHTML=`Count the intervals above the bass note. ${R.name}: from the bass <b>${R.ps[0][0]}</b> up to the middle note (${R.ps[1][0]}) is…?`;
    ch.innerHTML="";
    ["a 2nd","a 3rd","a 4th","a 6th"].forEach(t=>{
      const b=document.createElement("button"); b.textContent=t;
      b.onclick=()=>{
        const R2=ROUNDS[r];
        if(t===R2.ints[k]){
          MFAudio.yay(); k++;
          if(k<2){ q.innerHTML=`✓ Now find the top note: from the bass up to ${R2.ps[2][0]} is…?`; }
          else { fb(true,`✓ ${R2.expl}`); r++; setTimeout(ask,1600); }
        } else { MFAudio.tone(40,.2); fb(false,`Count letter names from ${R2.ps[0][0]} upward, counting ${R2.ps[0][0]} itself as 1.`); }
      };
      ch.appendChild(b);
    });
  }
  ask();
}

/* build-from-figure: bass note + figure → build the chord on the keyboard */
function MF_L54_build(container,fb){
  const ROUNDS=[
    {label:"Bass E + figure 6", chord:"C major, 1st inversion (I⁶)", pcs:[4,7,0], names:["E (given bass)","G (a 3rd up)","C (a 6th up — the root!)"]},
    {label:"Bass G + figure 6/4", chord:"C major, 2nd inversion (I⁶₄)", pcs:[7,0,4], names:["G (given bass)","C (a 4th up — the root!)","E (a 6th up)"]},
    {label:"Bass B + figure 6/5", chord:"G7, 1st inversion (V⁶₅)", pcs:[11,2,5,7], names:["B (given bass)","D","F","G (the root, a 6th up)"]},
    {label:"Bass F + figure 4/2", chord:"G7, 3rd inversion (V⁴₂)", pcs:[5,7,11,2], names:["F (given bass — the 7th!)","G (a 2nd up — the root!)","B","D"]}];
  let r=0,k=0,last=null,got=[];
  container.innerHTML=`<div class="big-q l54b-q" style="text-align:center"></div>
    <div class="l54b-staff"></div><div class="l54b-kb"></div>`;
  const q=container.querySelector(".l54b-q"), sh=container.querySelector(".l54b-staff"), kh=container.querySelector(".l54b-kb");
  function drawStaff(){
    if(!got.length){ sh.innerHTML=""; return; }
    const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
    const ps=got.map(m=>NAMES[m%12]+(Math.floor(m/12)-1));
    Staff.render(sh,{clef:"treble",notes:ps.map((p,ix)=>ix===0?{p,d:"w"}:{p,d:"w",chord:true}),width:200});
  }
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Great! You built all four chords from figured bass."; return; }
    k=0; last=null; got=[]; drawStaff();
    q.innerHTML=`<b>${ROUNDS[r].label}</b> → build ${ROUNDS[r].chord} from the bass note. Press <b>${ROUNDS[r].names[0].split(" ")[0]}</b> first.`;
  }
  Keyboard.create(kh,{start:60,octaves:2,labels:true,
    onKey:m=>{
      const R=ROUNDS[r]; if(!R) return;
      const want=R.pcs[k];
      if(m%12===want && (last===null || m>last)){
        last=m; got.push(m); k++; drawStaff();
        if(k>=R.pcs.length){ got.forEach(x=>MFAudio.tone(x,1.0,.1,.3));
          fb(true,`✓ ${R.chord} — read from the figures alone.`);
          r++; setTimeout(ask,1500); }
        else q.innerHTML=`Now play <b>${R.names[k]}</b> above the previous note.`;
      } else if(m%12===want){ MFAudio.tone(40,.2); fb(false,"Right letter — stack UPWARD from the bass."); }
      else { MFAudio.tone(40,.2); fb(false,k===0? "Start on the GIVEN bass note." : "Count the interval up from the bass — the figures tell you exactly how far."); }
    }});
  ask();
}

LESSON_CONTENT[54]={stackFigures:true,
  welcome:"Today you learn to read a 400-year-old secret code. \u{1F5DD}\u{FE0F}",
  hook:{
    say:"<b>A composer writes only one bass note and the number 6.</b> \u{1F447} <b>What chord should you play?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="l54h-staff"></div>
          <div class="choices hk-ch"><button>A full chord — C major with E in the bass</button><button>Just the note E, six times</button><button>An E major chord at bar 6</button></div>`;
        Staff.render(container.querySelector(".l54h-staff"),{clef:"treble",notes:[{p:"E4",d:"w",label:"6"}],width:220});
        const ch=container.querySelector(".hk-ch");
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0){ [64,67,72].forEach(m=>MFAudio.tone(m,1.2,0,.33));
            fb(true,"✓ The 6 means: build notes a 3rd and a 6th above the bass → E-G-C, C major in 1st inversion. This number system is called FIGURED BASS — today's lesson!"); }
          else fb(false,"It's shorthand — one number standing for something much bigger. Think chords, not repetitions.");
        });
      } }
  },
  objectives:[
    "Define figured bass and its Baroque origin (1600–1750)",
    "Read the numbers as intervals ABOVE THE BASS",
    "Know the triad figures: (5/3) = root, 6 = 1st inversion, 6/4 = 2nd",
    "Know the seventh figures: 7, 6/5, 4/3, 4/2",
    "Use letter symbols (C/E above the staff) and numerals (I⁶ below)",
    "Build chords from a bass note + figure"
  ],
  steps:[
    { say:"<b>What is Figured Bass?</b> During the <b>Baroque period (1600–1750)</b>, composers often wrote only the <b>bass line</b> and a few <b>numbers</b>. The performer used those numbers to build the correct chord. This system is called <b>figured bass</b>. \u{1F447} <b>The numbers show intervals measured from which note?</b>",
      try:{ type:"mc", choices:["The bass (lowest) note","The root","Middle C"], answer:0,
        success:"✓ Everything counts UP from the bass. That's why it's called figured BASS.",
        fail:"The name of the system is a giant hint…",
        hint:"FIGURED ____." } },
    { say:"Count the intervals above the bass note to identify the chord. \u{1F447}",
      try:{ type:"custom",
        hint:"Count letter names upward from the bass, counting the bass as 1.",
        mount:(container,fb)=>MF_L54_count(container,fb) } },
    { say:"<b>Triad Figures:</b> Root position = <b>5/3</b> (usually written without numbers) · 1st inversion = <b>6</b> · 2nd inversion = <b>6/4</b>. In the key of C: I, I⁶, I⁶₄. \u{1F447} <b>A Roman numeral without a figure means…</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"I⁶"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"I⁶₄"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:480} },
      try:{ type:"mc", choices:["Root position","1st inversion","The chord is silent"], answer:0,
        success:"✓ No figure = nothing unusual = root position. Writers only add numbers when the bass ISN'T the root.",
        fail:"5/3 is the figure so normal it vanished…",
        hint:"Default settings need no label." } },
    { say:"<b>Two Ways to Label Chords:</b> Chords can be labeled with <b>Roman numerals</b> or <b>slash chord symbols</b>. Slash chords are written <b>above</b> the staff; Roman numerals are written <b>below</b> the staff. \u{1F447} <b>C/G means…</b>",
      try:{ type:"mc", choices:["C major with G in the bass — same as I⁶₄ in C","G major with C in the bass","C and G played alone"], answer:0,
        success:"✓ One chord, two spellings: pop/jazz charts say C/G above the staff; theory says I⁶₄ below it.",
        fail:"Left of the slash = chord; right = bass.",
        hint:"Same rule as G7/B last lesson." } },
    { say:"<b>Figured Bass for Seventh Chords:</b> Root position = <b>7</b> · 1st inversion = <b>6/5</b> · 2nd inversion = <b>4/3</b> · 3rd inversion = <b>4/2</b>. \u{1F447} <b>Which figure shows the 7th in the bass?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[
        {p:"G3",d:"w",label:"V⁷"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"B3",d:"w",label:"V⁶₅"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"V⁴₃"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"V⁴₂"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:600} },
      try:{ type:"mc", choices:["4/2","6/5","4/3"], answer:0,
        success:"✓ V⁴₂ (sometimes just V²): the 7th sits in the bass, with the root a 2nd above it — hence the 2!",
        fail:"3rd inversion puts the crunch at the BOTTOM — the root is only a 2nd above the bass.",
        hint:"The root sits at the upper number of the adjacent pair — in 4/2, just a 2nd above the bass." },
      },
    { say:"<b>Understanding the Numbers:</b> The numbers always show intervals <b>above the bass note</b>. In <b>V⁶₅</b>, the 7th of the chord is a <b>5th above the bass</b>. \u{1F447} <b>Why does V⁶₅ include the number 5?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:320px">
        <tr><th colspan="2" style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Triads</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Root position</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">5/3 <span style="font-weight:400;color:#667">(usually omitted)</span></td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">1st inversion</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">2nd inversion</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">6/4</td></tr>
        <tr><th colspan="2" style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Seventh Chords</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">Root position</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">7</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">1st inversion</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">6/5</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">2nd inversion</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">4/3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:5px 14px">3rd inversion</td><td style="border:1.5px solid #cdd5e1;padding:5px 14px;text-align:center;font-weight:800">4/2</td></tr></table>` },
      try:{ type:"mc", choices:["The 7th (F) sits a 5th above the bass B","It's the chord's 5th degree","It means five notes"], answer:0,
        success:"✓ Bass B → F = a 5th, bass B → G (root) = a 6th: 6/5. The numbers literally measure the stack.",
        fail:"Count from bass B: B(1)-C(2)-D(3)-E(4)-F(5)…",
        hint:"Count letter names up from the bass." } },
    { say:"Build each chord from the <b>bass note</b> and the <b>figured bass numbers</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Figures = intervals above the bass. 6 → 3rd+6th up; 6/4 → 4th+6th; 6/5 → the V7 rotation starting on its 3rd; 4/2 → starting on its 7th.",
        mount:(container,fb)=>MF_L54_build(container,fb) } },
    { say:"<b>Find the Incorrect Pair</b> \u{1F447} <b>Which pairing is incorrect?</b>",
      try:{ type:"mc", choices:["I⁶₄ = the 3rd is in the bass","I⁶ = the 3rd is in the bass","V⁴₂ = the 7th is in the bass","V⁷ = root position"], answer:0,
        success:"✓ Caught it! I⁶₄ puts the 5TH in the bass (G-C-E in C major), not the 3rd. The other three are all true.",
        fail:"Three of these are straight from today's tables — test each one.",
        hint:"Which figure belongs to 2nd inversion, and what lives in ITS bass?" } }
  ],
  examples:[
    { caption:"One chord, three figures: I, I⁶, I⁶₄ and home again. Read the numerals below each chord — no figure, then 6, then 6/4, exactly as the bass note changes.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"E4",d:"w",label:"I⁶"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},
        {p:"G4",d:"w",label:"I⁶₄"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},
        {p:"C5",d:"w",label:"I"},{p:"E5",d:"w",chord:true},{p:"G5",d:"w",chord:true}],width:560},
      kb:{start:60,octaves:2,labels:true} },
    { caption:"The seventh-chord figures in action: V⁷ → V⁶₅ → V⁴₃ → V⁴₂ — then the 4/2 bass (the 7th, F) sinks by step into I⁶. Figured bass tells this whole story in six tiny labels.",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"G3",d:"w",label:"V⁷"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},
        {p:"B3",d:"w",label:"V⁶₅"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},
        {p:"D4",d:"w",label:"V⁴₃"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},
        {p:"F4",d:"w",label:"V⁴₂"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true},
        {p:"E4",d:"w",label:"I⁶"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{bar:"final"}],width:640},
      kb:{start:53,octaves:1.9167,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Figure Sprint (45s)",
      intro:"A chord appears — pick its figured-bass symbol. Triads AND sevenths!",
      miaIntro:"Read the bass, count the intervals! \u{1F522}",
      spec:{gen:"inversion-id", params:{subject:"both", ask:"figure"}, seconds:45},
      result:(score)=>score>=8?score+" figures decoded — Baroque-ready!":null },
    { type:"order-tap", title:"Game 2 · The Figure Ladders",
      intro:"Tap the triad figures in flip order, then the seventh-chord figures!",
      miaIntro:"Small numbers, strict order! \u{1FA9C}",
      spec:{sequence:["5/3 — root (triad)","6 — 1st inv (triad)","6/4 — 2nd inv (triad)","7 — root (V7)","6/5 — 1st inv (V7)","4/3 — 2nd inv (V7)","4/2 — 3rd inv (V7)"],
        title:"Tap the figures in inversion order: triads first, then V7"},
      result:(stars)=>stars>=2?"Both ladders in perfect order!":null },
    { type:"symbol-hunt", title:"Game 3 · Match the Figure",
      intro:"Four chords on cards — click the one whose FIGURE is called out!",
      miaIntro:"Figures to staffs — connect them! \u{1F440}",
      spec:{rounds:6, pool:[
        {label:"I⁶ (E-G-C)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"I⁶₄ (G-C-E)", spec:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:150}},
        {label:"V⁶₅ (B-D-F-G)", spec:{clef:"treble",notes:[{p:"B3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"V⁴₂ (F-G-B-D)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Figure-to-staff mastery!":null },
    { type:"term-race", title:"Game 4 · Baroque Code Race",
      intro:"Everything figured bass — symbols, history, placement rules!",
      miaIntro:"The full codebook! \u{1F3C1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Figured bass","numbers showing intervals above the bass"],
        ["Baroque period","1600–1750, figured bass's home era"],
        ["6","triad, 1st inversion"],
        ["6/4","triad, 2nd inversion"],
        ["6/5","seventh chord, 1st inversion"],
        ["4/2","seventh chord, 3rd inversion"],
        ["C/E","letter symbol — written ABOVE the staff"],
        ["I⁶","Roman numeral — written BELOW the staff"]]},
      result:(score)=>score>=6?"Code fully cracked!":null }
  ],
  practiceIntro:"20 practice questions — figures, placements and decodings. Answer right and the next appears automatically!",
  practice:[
    { gen:"inversion-id", params:{subject:"both", ask:"figure"}, count:6 },
    { gen:"term-match", params:{subject:"term", pool:[["6","1st inversion (triad)"],["6/4","2nd inversion (triad)"],["6/5","1st inversion (V7)"],["4/3","2nd inversion (V7)"],["4/2","3rd inversion (V7)"],["5/3","root position — usually omitted"]], reverse:true}, count:5 },
    { type:"mc", q:"Figured bass numbers show intervals above the…", choices:["bass note","root","top note"], answer:0,
      explain:"Always counted up from the lowest note." },
    { type:"mc", q:"The figured bass system comes from which era?", choices:["Baroque (1600–1750)","Renaissance (1400–1600)","Romantic (1800s)"], answer:0,
      explain:"Baroque keyboardists improvised from bass + figures." },
    { type:"mc", q:"In the key of C, what does I⁶ mean?", choices:["E in the bass (1st inversion of C major)","G in the bass","C major with 6 notes"], answer:0,
      explain:"6 = 1st inversion: E-G-C." },
    { type:"mc", q:"I⁶₄ in the key of C has which bass note?", choices:["G","E","C"], answer:0,
      explain:"6/4 = 2nd inversion: the 5th (G) in the bass." },
    { type:"mc", q:"Which figured bass symbols belong to seventh chords?", choices:["7, 6/5, 4/3, 4/2","5/3, 6, 6/4","1, 2, 3, 4"], answer:0,
      explain:"Four positions need four figures." },
    { type:"mc", q:"Where are slash chord symbols usually written?", choices:["above the staff","below the staff","inside the staff"], answer:0,
      explain:"Letters above, Roman numerals below — standard figured-bass placement." },
    { type:"truefalse", q:"A root-position triad must always show the figure 5/3.", answer:false,
      explain:"5/3 is so standard it's normally omitted." },
    { type:"truefalse", q:"The figure 6/5 means the 3rd of a seventh chord is in the bass.", answer:true,
      explain:"1st inversion: root a 6th up, 7th a 5th up." },
    { type:"truefalse", q:"In V⁴₂, the root sits a 2nd above the bass.", answer:true,
      explain:"That 2 IS the root's address — the 7th is the bass." }
  ],
  miaQuizIntro:"Final quiz — decode like a Baroque pro. Count up from the bass!",
  quiz:[
    { type:"mc", q:"What is figured bass?", choices:["A shorthand of numbers showing chord inversions above a bass note","A rhythm pattern","A tempo marking","A key signature"], answer:0,
      explain:"Bass line + figures = the whole harmony.", hint:"Think shorthand." },
    { type:"mc", q:"For a triad, the figure 6 indicates…", choices:["1st inversion","root position","2nd inversion","3rd inversion"], answer:0,
      explain:"6 (short for 6/3) = 3rd in the bass.", hint:"One flip." },
    { type:"mc", q:"Which figure represents the 2ND inversion of a triad?", choices:["6/4","5/3","6","4/2"], answer:0,
      explain:"Bass → root = 4th; bass → 3rd = 6th.", hint:"The nickname from Lesson 52." },
    { type:"truefalse", q:"The figure 6/5 represents the first inversion of a seventh chord.", answer:true,
      explain:"V⁶₅: 3rd in the bass, root a 6th up, 7th a 5th up.", hint:"Sevenths get two-digit figures." },
    { type:"truefalse", q:"A triad in root position must always be labeled 5/3.", answer:false,
      explain:"It's usually omitted — no figure means root position.", hint:"Defaults go unlabeled." },
    { type:"mc", q:"In the key of C, the chord written I⁶₄ is spelled (bottom to top)…", choices:["G-C-E","C-E-G","E-G-C"], answer:0,
      explain:"2nd inversion: 5th in the bass.", hint:"6/4 = Lesson 52's chord." },
    { type:"mc", q:"Which figure marks a V7 chord with its 5TH in the bass?", choices:["4/3","6/5","4/2","7"], answer:0,
      explain:"2nd inversion of a seventh = 4/3.", hint:"Middle of the seventh ladder." },
    { type:"mc", q:"What are two correct ways to label this chord?",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:200},
      choices:["C/E above the staff, I⁶ below","E/C above, vi below","C6 above, IV below"], answer:0,
      explain:"C major, 1st inversion: letter symbol C/E, numeral I⁶.", hint:"Chord/bass and numeral+figure." },
    { type:"mc", q:"Identify this chord's figure (G7 = G-B-D-F).",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"G4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:200},
      choices:["4/2","6/5","7","4/3"], answer:0,
      explain:"7th (F) in the bass = 3rd inversion = V⁴₂.", hint:"The root is a 2nd above the bass." },
    { type:"mc", q:"Why was figured bass used during the Baroque period?", choices:["Keyboard players used the bass note and figures to build chords","Composers couldn't write chords","Printing presses had no note symbols"], answer:0,
      explain:"Like a jazz lead sheet, 350 years early.", hint:"Think of the keyboardist's job." },
    { type:"mc", q:"Roman numeral symbols (like V⁶₅) are usually written…", choices:["below the staff","above the staff","in the margin"], answer:0,
      explain:"Letters above, numerals below.", hint:"Where did Example 1 print them?" },
    { type:"mc", q:"In a V⁴₃ chord, which chord tone is in the bass?", choices:["5th","root","3rd","7th"], answer:0,
      explain:"2nd inversion of a seventh chord: 5th in the bass.", hint:"Ladder: 7 → 6/5 → 4/3 → 4/2." },
    /* generated */
    { gen:"inversion-id", params:{subject:"both", ask:"figure"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["6","triad, 1st inversion"],["6/4","triad, 2nd inversion"],["6/5","V7, 1st inversion"],["4/2","V7, 3rd inversion"]], reverse:true}, count:2 },
    { gen:"inversion-id", params:{subject:"both", ask:"position"}, count:2 }
  ],
  vocabulary:[
    {term:"Figured Bass", def:"Numbers below a bass note showing the intervals above it — and therefore the chord's inversion. Born in the Baroque period (1600–1750)."},
    {term:"6", def:"Triad, 1st inversion (short for 6/3): the 3rd is in the bass.",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:130}},
    {term:"6/4", def:"Triad, 2nd inversion: the 5th is in the bass.",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true}],width:130}},
    {term:"6/5 · 4/3 · 4/2", def:"Seventh-chord inversions: 3rd, 5th or 7th in the bass. Root position is plain 7."},
    {term:"Letter Symbol (C/E)", def:"Chord name / bass note, written ABOVE the staff. Roman numerals with figures go BELOW."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Figured bass</b> = numbers under the bass showing <b>intervals above it</b> — a Baroque (1600–1750) shorthand.",
    "✔ Triads: <b>(5/3) root · 6 = 1st inversion · 6/4 = 2nd inversion</b>.",
    "✔ Sevenths: <b>7 · 6/5 · 4/3 · 4/2</b> — root, 1st, 2nd, 3rd inversion.",
    "✔ <b>Letter symbols (C/E) above</b> the staff; <b>Roman numerals (I⁶) below</b>.",
    "✔ Don't memorize blindly: <b>count the intervals from the bass</b> and every figure explains itself."
  ],
  tips:[
    "The root sits at the upper number of the adjacent pair in a seventh-chord figure: in 6/5 the root is a 6th up; in 4/3 a 4th up; in 4/2 just a 2nd up.",
    "Guitar and pop charts still use the letter half of this system every day: C/E, G/B, D/F♯ — figured bass never really died!",
    "Speed drill: cover the figures in Example 2 and name them from the bass notes alone, then uncover to check.",
    "Next lesson these labels go to work: smooth chord progressions where I⁶₄ and V⁶₅ make the bass line sing."
  ],
  rewards:{ badge:"Code Breaker", icon:"\u{1F5DD}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT decoding! The Baroque masters salute you. \u{1F5DD}\u{FE0F}\u{1F389}",
  miaPass:"Passed — the code is cracked! Lesson 55 puts the figures into real progressions.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Bass E + figure 6 = notes a 3rd and 6th above E → E-G-C, C major in 1st inversion. One number, one whole chord.",
      play:()=>{[64,67,72].forEach(m=>MFAudio.tone(m,1.1,0,.33));} },
    learn:{ label:"figured bass",
      explain:"Numbers = intervals above the bass. Triads: (5/3), 6, 6/4. Sevenths: 7, 6/5, 4/3, 4/2. Letters above the staff, numerals below.",
      hint:"Count letter names up from the bass, bass = 1.",
      play:()=>{[67,72,76].forEach(m=>MFAudio.tone(m,1,.1,.33));} },
    example:{ label:"the examples",
      explain:"Example 1 labels I-I⁶-I⁶₄-I; example 2 walks V7 through all four figures and resolves the 4/2 into I⁶." },
    game:{ label:"the games",
      explain:"Sprint the figures, tap both ladders in order, match figures to staffs, then race the codebook.",
      hint:"6 is a triad flag; two-digit figures mean sevenths." },
    quiz:{ label:"this question",
      explain:"Every figure is just interval arithmetic from the bass. Decode: find the bass, count up, name the inversion.",
      play:()=>{[65,67,71,74].forEach(m=>MFAudio.tone(m,.9,0,.3));[64,67,72].forEach(m=>MFAudio.tone(m,1.1,1,.33));} }
  }
};
