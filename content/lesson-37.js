/* Lesson 37 — Augmented and Diminished Intervals (AEMT Book 2, Unit 9)
   Built from drafts/UNIT 9 – Lesson 37.md; AEMT p.58 verified by render.
   M8 directive: slow and thorough. Rules: raise M or P a half step = Augmented;
   lower P or m a half step = diminished. Letters never change (𝄪/𝄫 exist for this).
   Perfect unison cannot be diminished. Chromatic vs diatonic intervals.
   Uses quiz.js v5.4 interval-quality (full P/M/m/A/d mode).
   NOTE: edit by FULL-FILE REWRITE only. */

/* stretch-and-shrink lab: one interval family at a time — press the sequence
   normal → raised (Augmented) → lowered (diminished) and hear all three sizes. */
function MF_L37_lab(container,fb){
  const ROUNDS=[
    {label:"5th family", seq:[
      {m:67,name:"G — Perfect 5th (7 half steps)",short:"P5"},
      {m:68,name:"G♯ — Augmented 5th (8 half steps)",short:"aug 5"},
      {m:66,name:"G♭ — diminished 5th (6 half steps)",short:"dim 5"}]},
    {label:"4th family", seq:[
      {m:65,name:"F — Perfect 4th (5 half steps)",short:"P4"},
      {m:66,name:"F♯ — Augmented 4th (6 half steps)",short:"aug 4"},
      {m:64,name:"F♭ — diminished 4th (4 half steps) — the F♭ key LOOKS like E!",short:"dim 4"}]}];
  let r=0,k=0,kb=null;
  container.innerHTML=`<div class="big-q l37-q" style="text-align:center"></div>
    <div class="l37-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">One family, three sizes: normal, stretched (+1), shrunk (−1). The LETTER never changes!</p>`;
  const q=container.querySelector(".l37-q"), kbHolder=container.querySelector(".l37-kb");
  function ask(){
    const cur=ROUNDS[r], step=cur.seq[k];
    q.innerHTML=`${cur.label} — press <b>${step.name.split(" — ")[0]}</b> above C to hear the <b>${step.short}</b>.`;
    if(kb) kb.point(step.m);
    if(k===0){ kbHolder.innerHTML="";
      kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,
        onKey:m=>{
          const c=ROUNDS[r], s=c.seq[k];
          if(m===s.m){ kb.mark([60,m]); MFAudio.tone(60,.8,0,.4); MFAudio.tone(m,.8,0,.4); k++;
            if(k>=c.seq.length){ r++; k=0;
              if(r>=ROUNDS.length){ q.textContent="Stretching and shrinking mastered!";
                fb(true,`✓ ${s.name}. You've now sized every quality: dim < minor < Major < aug, with Perfect in the middle of its own family.`); }
              else { fb(true,`✓ ${s.name}. New family…`); setTimeout(ask,1500); } }
            else { fb(true,`✓ ${s.name}. Now the next size…`); setTimeout(ask,1200); } }
          else { MFAudio.tone(40,.2); fb(false, k===0? "Start with the NORMAL size — the plain scale note." : "One half step at a time — count carefully from the previous key."); }
        }});
      kb.point(ROUNDS[r].seq[0].m); }
  }
  ask();
}

/* size ladder: tap the five qualities of a 5th/3rd from SMALLEST to LARGEST */
function MF_L37_ladder(container,fb){
  const ROUNDS=[
    {title:"the 5th family", order:["dim 5 (6)","Perfect 5 (7)","aug 5 (8)"]},
    {title:"the 3rd family", order:["dim 3 (2)","minor 3 (3)","Major 3 (4)","aug 3 (5)"]}];
  let r=0,next=0;
  container.innerHTML=`<div class="big-q l37-lq" style="text-align:center"></div><div class="choices chips l37-lch"></div>
    <div class="l37-ldone" style="text-align:center;font-weight:800;min-height:24px;color:var(--correct)"></div>`;
  const q=container.querySelector(".l37-lq"), ch=container.querySelector(".l37-lch"), done=container.querySelector(".l37-ldone");
  function ask(){
    const cur=ROUNDS[r]; next=0; done.textContent="";
    q.innerHTML=`Sort ${cur.title} from <b>SMALLEST to LARGEST</b> — tap in order! (half steps in parentheses)`;
    ch.innerHTML="";
    [...cur.order].sort(()=>Math.random()-.5).forEach(t=>{
      const b=document.createElement("button"); b.textContent=t;
      b.onclick=()=>{
        const cur2=ROUNDS[r];
        if(t===cur2.order[next]){ b.disabled=true; b.style.opacity=.35; next++;
          done.textContent=cur2.order.slice(0,next).join("  →  ");
          if(next>=cur2.order.length){ r++;
            if(r>=ROUNDS.length){ ch.style.display="none"; q.textContent="Both ladders sorted!";
              fb(true,"✓ dim < minor < Major < aug — and for the perfect family: dim < Perfect < aug. The size line is fixed forever."); }
            else { fb(true,"✓ Ladder complete! Now a family with FOUR rungs…"); setTimeout(ask,1300); } } }
        else { MFAudio.tone(40,.2); fb(false,"Check the half-step counts — smallest number first."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[37]={
  welcome:"Intervals can stretch bigger than Major and shrink smaller than minor. Meet augmented and diminished! \u{1F3D7}",
  hook:{
    say:"One of these 5ths powers a thousand horror movies. Press both. <b>Which one sounds tense and unstable?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ 5th number 1</button>
          <button class="play hk-b">▶ 5th number 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Number 1 — tense and unstable</button><button>Number 2 — tense and unstable</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(67,.9,0,.42); hA=true; if(hB) setTimeout(()=>ch.style.display="",1100); };
        container.querySelector(".hk-b").onclick=()=>{ MFAudio.tone(60,1.1,0,.42); MFAudio.tone(66,1.1,0,.42); hB=true; if(hA) setTimeout(()=>ch.style.display="",1100); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ Number 2 was C–G♭ — a DIMINISHED 5th, the Perfect 5th shrunk by one half step. So dissonant that medieval theorists nicknamed it 'the devil in music'. Today: how intervals stretch (augmented) and shrink (diminished).");
          else fb(false,"Press again — number 1 is the calm, open Perfect 5th from Lesson 35.");
        });
      } }
  },
  objectives:[
    "Define augmented and diminished intervals",
    "Raise Major or Perfect intervals to augmented",
    "Lower Perfect or minor intervals to diminished",
    "Order all five qualities by size",
    "Explain double sharps and double flats",
    "Define chromatic intervals"
  ],
  steps:[
    { say:"Review the size line so far: <b>minor is one half step smaller than Major</b>, and Perfect stands alone in its own family. \u{1F447} <b>Which is SMALLER — m3 or M3?</b>",
      try:{ type:"mc", choices:["m3 (3 half steps)","M3 (4 half steps)","They're equal"], answer:0,
        success:"✓ m3 = 3, M3 = 4. Now let's push PAST both ends of that line…",
        fail:"minor = Major minus one half step.",
        hint:"Small m = smaller size." } },
    { say:"<b>AUGMENTED</b> means 'made larger'. Raise a <b>Perfect OR Major</b> interval by <b>one half step</b> (letters unchanged) and it becomes augmented — abbreviated <b>aug</b>. C–G (P5) stretches to C–G♯ (aug 5). C–E (M3) stretches to C–E♯ (aug 3). \u{1F447} <b>C–G♯ is an…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",x:160},{p:"G4",d:"w",chord:true},{p:"C4",d:"w",x:340},{p:"G#4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"P5 — 7 half steps"},{from:2,to:3,label:"aug 5 — 8 half steps"}],width:460},
        kb:{start:60,octaves:1,labels:true,marks:[60,67,68]} },
      try:{ type:"mc", choices:["Augmented 5th","Major 5th","Perfect 6th"], answer:0,
        success:"✓ P5 + one half step = aug 5. (And remember — 'Major 5th' still doesn't exist!)",
        fail:"The G kept its letter but grew a sharp — the interval got BIGGER.",
        hint:"Augmented = made larger." } },
    { say:"<b>DIMINISHED</b> means 'made smaller'. Lower a <b>Perfect OR minor</b> interval by <b>one half step</b> (letters unchanged) and it becomes diminished — abbreviated <b>dim</b>. C–G (P5) shrinks to C–G♭ (dim 5). C–E♭ (m3) shrinks to C–E𝄫 (dim 3). \u{1F447} <b>C–G♭ is a…?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",x:160},{p:"G4",d:"w",chord:true},{p:"C4",d:"w",x:340},{p:"Gb4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"P5 — 7 half steps"},{from:2,to:3,label:"dim 5 — 6 half steps"}],width:460},
        kb:{start:60,octaves:1,labels:true,marks:[60,66,67]} },
      try:{ type:"mc", choices:["Diminished 5th","minor 5th","Perfect 4th"], answer:0,
        success:"✓ P5 − one half step = dim 5, the hook's 'devil' interval. And NOT a minor 5th — Perfect intervals skip minor entirely and go straight to diminished!",
        fail:"Perfect intervals never become minor — they shrink straight to…",
        hint:"Diminished = made smaller." } },
    { say:"Put the whole size line together. For 2nds, 3rds, 6ths, 7ths: <b>dim &lt; minor &lt; Major &lt; aug</b>. For unisons, 4ths, 5ths, octaves: <b>dim &lt; Perfect &lt; aug</b>. Every step on the line = one half step. \u{1F447} <b>Hands on the lab bench — press each size and hear the stretch and shrink:</b>",
      try:{ type:"custom",
        hint:"Normal first, then one key UP (aug), then find the shrunken size. The letter G stays G — only accidentals move.",
        mount:(container,fb)=>MF_L37_lab(container,fb) } },
    { say:"Why do we sometimes need <b>DOUBLE accidentals</b>? To lower a note that's already flat, use a <b>double flat (𝄫)</b>; to raise a note that's already sharp, use a <b>double sharp (𝄪)</b>. Example: m3 = C–E♭. To diminish it, E♭ must drop again — but it must STAY an E, so: C–E𝄫 (dim 3). The E𝄫 key sounds like D, but the spelling preserves the 3rd! \u{1F447} <b>Why write E𝄫 instead of just D?</b>",
      try:{ type:"mc", choices:["To keep the letter names — and the interval number — correct","Because D is a forbidden note","Because double flats sound different from D"], answer:0,
        success:"✓ C–D would be a 2nd; C–E𝄫 stays a 3rd. Spelling preserves the interval's identity even when the keys look the same.",
        fail:"Count the letters: C→D is a 2nd, but we need a kind of 3rd…",
        hint:"The letter E keeps the count at 3." } },
    { say:"One important exception: <b>A perfect unison can never be diminished.</b> Because two identical notes have zero distance, lowering either note actually makes the interval larger. A perfect unison can only be perfect or augmented. \u{1F447} <b>Which interval quality can a perfect unison never have?</b>",
      try:{ type:"mc", choices:["Diminished","Augmented","Perfect"], answer:0,
        success:"✓ You can't shrink zero! The unison can be perfect or augmented — never diminished.",
        fail:"A unison has NO distance — can it get smaller?",
        hint:"Try to make 0 half steps smaller…" } },
    { say:"Last vocabulary upgrade: intervals whose notes are both in the same major scale are <b>diatonic</b>. When the upper note is <b>NOT</b> from the keynote's major scale, the interval is <b>CHROMATIC</b>. Minor, diminished, and augmented intervals are always chromatic in major keys. \u{1F447} <b>In the key of C, the interval C–E♭ is…?</b>",
      try:{ type:"mc", choices:["Chromatic — E♭ isn't in the C major scale","Diatonic — every 3rd is diatonic","Neither"], answer:0,
        success:"✓ E♭ lives outside C major, so C–E♭ (m3) is a chromatic interval. Diatonic = in the scale; chromatic = colored from outside.",
        fail:"Is E♭ one of the seven notes of C major?",
        hint:"C major has no flats at all." } },
    { say:"Final challenge — sort every quality by size. \u{1F447} <b>Tap each family's qualities from smallest to largest:</b>",
      try:{ type:"custom",
        hint:"Use the half-step counts in parentheses — smallest number first.",
        mount:(container,fb)=>MF_L37_ladder(container,fb) } }
  ],
  examples:[
    { caption:"The 5th at three sizes — diminished (6), Perfect (7), Augmented (8). Play and feel the tension: shrunk, pure, stretched.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"Gb4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"G4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"G#4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"dim 5"},{from:2,to:3,label:"P5"},{from:4,to:5,label:"aug 5"}],width:460},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"The 3rd at four sizes — the full ladder from diminished to augmented. E𝄫 is WRITTEN on the E line (double flat) but SOUNDS on the D key; E♯ is written on E but sounds on F. Press play and watch the keyboard light the keys you actually hear.",
      staff:{clef:"treble",tempo:60,notes:[
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true,acc:"bb",sound:"D4"},
        {p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true,acc:"n"},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true,acc:"#",sound:"F4"}],
        brackets:[{from:0,to:1,label:"dim 3"},{from:2,to:3,label:"m3"},{from:4,to:5,label:"M3"},{from:6,to:7,label:"aug 3"}],width:560},
      kb:{start:60,octaves:0.3333,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Five-Quality Sprint (45s)",
      intro:"All five qualities in play — P, M, m, A, d. Name them at speed!",
      miaIntro:"The full alphabet of size — go! \u{1F3C3}",
      spec:{gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"full"}, seconds:45},
      result:(score)=>score>=7?score+" with ALL five qualities in play — outstanding!":null },
    { type:"gen-race", title:"Game 2 · Quality Judge — expert bench (10 rounds)",
      intro:"Perfect, Major, minor, Augmented or Diminished? Rule on each interval!",
      miaIntro:"Supreme court is in session! \u{2696}",
      spec:{gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"quality"}, rounds:10},
      result:(score)=>score>=8?"Expert verdicts — the bench salutes you!":null },
    { type:"key-climb", title:"Game 3 · Tension Ladder",
      intro:"Climb the 5th through its three sizes: dim 5 → P5 → aug 5!",
      miaIntro:"Shrunk, pure, stretched — in order! \u{1F3D7}",
      spec:{seq:[66,67,68], names:["G♭ (dim 5)","G (P5)","G♯ (aug 5)"], start:60, octaves:1,
        title:"Press G♭ → G → G♯: the 5th growing one half step at a time"},
      result:(score)=>score!==null?"You walked the tension ladder without a wobble!":null },
    { type:"order-tap", title:"Game 4 · Size Sorter",
      intro:"Tap the four sizes of the 3rd from SMALLEST to LARGEST before the clock runs out!",
      miaIntro:"Small to tall — line them up! \u{1F4CF}",
      spec:{sequence:["dim 3","minor 3","Major 3","aug 3"], timer:20,
        title:"Tap the 3rd family from SMALLEST to LARGEST — beat the 20-second clock!"},
      result:(score)=>score!==null?"Both ladders in perfect order!":null }
  ],
  practiceIntro:"20 practice questions — stretching, shrinking, double accidentals, chromatic vs diatonic. Answer right and the next appears automatically!",
  practice:[
    { gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"full"}, count:6 },
    { gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"quality"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Augmented","one half step larger than Perfect or Major"],["Diminished","one half step smaller than Perfect or minor"],["Double sharp 𝄪","raises an already-sharp note"],["Double flat 𝄫","lowers an already-flat note"],["Chromatic interval","upper note NOT from the keynote's major scale"]], reverse:true}, count:3 },
    { type:"mc", q:"A diminished interval occurs when a perfect or minor interval is made…", choices:["smaller","larger","louder"], answer:0,
      explain:"Diminished = made smaller." },
    { type:"mc", q:"An augmented interval occurs when a major or perfect interval is made…", choices:["larger","smaller","softer"], answer:0,
      explain:"Augmented = made larger." },
    { type:"mc", q:"Minor, diminished, and augmented intervals are called ____ intervals.", choices:["chromatic","diatonic","enharmonic"], answer:0,
      explain:"Their upper notes leave the keynote's major scale." },
    { type:"mc", q:"P5 raised one half step becomes…", choices:["aug 5","M5","P6"], answer:0,
      explain:"Perfect + half step = augmented." },
    { type:"mc", q:"P4 lowered one half step becomes…", choices:["dim 4","m4","M3"], answer:0,
      explain:"Perfect − half step = diminished (never minor!)." },
    { type:"mc", q:"M7 raised one half step becomes…", choices:["aug 7","P8","M8"], answer:0,
      explain:"Major + half step = augmented — the letters stay, so it's still a 7th." },
    { type:"mc", q:"m3 lowered one half step becomes…", choices:["dim 3","dim 2","M2"], answer:0,
      explain:"minor − half step = diminished; E♭ drops to E𝄫." },
    { type:"truefalse", q:"The perfect unison can be diminished.", answer:false,
      explain:"Zero distance can't shrink — a unison can only be perfect or augmented." }
  ],
  miaQuizIntro:"Stretch, shrink, spell — the full size line is yours. Sprint!",
  quiz:[
    { type:"mc", q:"An augmented interval is:", choices:["One half step smaller than minor","One half step larger than a Major or Perfect interval","The same as a Major interval","Only possible for 5ths"], answer:1,
      explain:"Augmented = 'made larger' by one half step.", hint:"Aug- = grow." },
    { type:"mc", q:"A diminished interval is:", choices:["One half step smaller than a Perfect or minor interval","One half step larger than Major","A minor interval renamed","Only possible in bass clef"], answer:0,
      explain:"Diminished = 'made smaller' by one half step.", hint:"Dim- = shrink." },
    { type:"mc", q:"C–G♯ is an…", choices:["aug 5","M5","P6","m6"], answer:0,
      explain:"P5 stretched a half step, letters kept.", hint:"G stayed G." },
    { type:"mc", q:"C–G♭ is a…", choices:["dim 5","m5","P4","aug 4"], answer:0,
      explain:"P5 shrunk a half step — and Perfect skips minor entirely.", hint:"No such thing as m5!" },
    { type:"truefalse", q:"To make a diminished 3rd from C–E♭, you write C–E𝄫.", answer:true,
      explain:"E must stay an E to keep the interval a 3rd — hence the double flat.", hint:"Letters lock the number." },
    { type:"truefalse", q:"Lowering a Perfect 4th one half step makes a minor 4th.", answer:false,
      explain:"Perfect intervals never become minor — P4 − 1 = dim 4.", hint:"Which family skips minor?" },
    { type:"mc", q:"The order of qualities from smallest to largest (for 3rds) is:", choices:["dim → minor → Major → aug","minor → dim → aug → Major","dim → Major → minor → aug","aug → Major → minor → dim"], answer:0,
      explain:"dim < m < M < aug, one half step per rung.", hint:"Shrunk…normal-small…normal-big…stretched." },
    { type:"mc", q:"A double sharp (𝄪) is used to…", choices:["raise an already-sharp note one more half step","cancel a sharp","mark a repeated note","sharpen two different notes"], answer:0,
      explain:"Needed when augmenting intervals whose top note is already sharp.", hint:"Double = twice raised." },
    { type:"mc", q:"When the upper note of an interval is NOT in the keynote's major scale, the interval is…", choices:["chromatic","diatonic","perfect","inverted"], answer:0,
      explain:"Chromatic = colored from outside the scale.", hint:"Diatonic's opposite." },
    { type:"mc", q:"Which quality can a perfect unison NEVER be?", choices:["diminished","augmented","perfect"], answer:0,
      explain:"Zero distance cannot shrink.", hint:"Can 0 get smaller?" },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F#4",d:"w",chord:true}],width:200},
      choices:["aug 4","P4","dim 5"], answer:0,
      explain:"C→F = 4th; the sharp stretches it: aug 4 (6 half steps).", hint:"Letters say 4th; the ♯ says stretched." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"bass",notes:[{p:"C3",d:"w"},{p:"Gb3",d:"w",chord:true}],width:200},
      choices:["dim 5","aug 4","m5"], answer:0,
      explain:"C→G = 5th; the flat shrinks it: dim 5.", hint:"A 5th wearing a flat…" },
    { type:"mc", q:"How many half steps in an augmented 5th?", choices:["8","7","6"], answer:0,
      explain:"P5 = 7, so aug 5 = 8.", hint:"Perfect plus one." },
    /* generated */
    { gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"full"}, count:4 },
    { gen:"interval-quality", params:{qualities:["P","M","m","A","d"],ask:"quality"}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Augmented","one half step larger than Perfect or Major"],["Diminished","one half step smaller than Perfect or minor"],["Chromatic interval","upper note not from the keynote's major scale"],["Perfect unison","can be augmented but never diminished"]], reverse:true}, count:1 }
  ],
  vocabulary:[
    {term:"Augmented Interval", def:"An interval one half step larger than a Major or Perfect interval, with the same letter names. Abbreviated aug.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"G#4",d:"w",chord:true}],width:130}},
    {term:"Diminished Interval", def:"An interval one half step smaller than a minor or Perfect interval, with the same letter names. Abbreviated dim.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Gb4",d:"w",chord:true}],width:130}},
    {term:"Double Sharp", sym:'<span class="dbx" style="font-size:2.8em;line-height:1">𝄪</span>', def:"Raises an already-sharp note by another half step — used to spell augmented intervals correctly."},
    {term:"Double Flat", sym:'<span class="dbf" style="font-size:1.3em">𝄫</span>', def:"Lowers an already-flat note by another half step — used to spell diminished intervals correctly."},
    {term:"Chromatic Interval", def:"An interval whose keynote and upper note are NOT from the same major scale. Minor, diminished, and augmented intervals are always chromatic in major keys."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Augmented = Major or Perfect + one half step</b>; <b>diminished = minor or Perfect − one half step</b>.",
    "✔ Size lines: dim &lt; minor &lt; Major &lt; aug (2,3,6,7) · dim &lt; Perfect &lt; aug (1,4,5,8).",
    "✔ <b>Letter names never change</b> — that's what double sharps (𝄪) and double flats (𝄫) are for.",
    "✔ The <b>perfect unison</b> can never be diminished — zero distance can't shrink.",
    "✔ <b>Diatonic</b> = both notes in the keynote's major scale; <b>chromatic</b> = the upper note escapes it (all m, dim, aug intervals)."
  ],
  tips:[
    "The dim 5 / aug 4 (6 half steps) is the famous TRITONE — 'The Simpsons' theme opens with one!",
    "Spelling check: first count LETTERS for the number, then count half steps for the quality — always in that order.",
    "Augmenting an already-sharp note? Reach for 𝄪. Diminishing an already-flat one? 𝄫. The letter must survive.",
    "Next lesson gives your ears a naming system — solfège — and shows how melodies move between keys."
  ],
  rewards:{ badge:"Size Stretcher", icon:"\u{1F3D7}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — neither stretched nor shrunk, exactly right! \u{1F3D7}\u{1F389}",
  miaPass:"Passed! Keep the size line handy: dim < minor < Major < aug.",
  mia:{
    hook:{ label:"the welcome",
      explain:"5th number 1 was C–G (Perfect — calm); number 2 was C–G♭ (diminished — the tense 'devil in music'). One half step of shrinkage did all that.",
      play:()=>{MFAudio.tone(60,.8,0,.4);MFAudio.tone(67,.8,0,.4);MFAudio.tone(60,1,1.2,.4);MFAudio.tone(66,1,1.2,.4);} },
    learn:{ label:"augmented & diminished",
      explain:"Raise M or P a half step → augmented. Lower P or m a half step → diminished. Letters never change (𝄪/𝄫 exist for exactly this). Unison can't be diminished.",
      hint:"dim < m < M < aug.",
      play:()=>{MFAudio.tone(60,.4,0,.4);MFAudio.tone(66,.4,0,.4);MFAudio.tone(60,.5,.6,.4);MFAudio.tone(68,.5,.6,.4);} },
    example:{ label:"the examples",
      explain:"Example 1 plays the 5th at three sizes; example 2 climbs the 3rd through all four — with E𝄫 sounding on the D key but spelled as an E." },
    game:{ label:"the games",
      explain:"Sprint all five qualities, judge like an expert, climb the tension ladder, then sort sizes.",
      hint:"When stuck: letters give the number, half steps give the quality." },
    quiz:{ label:"this question",
      explain:"Two moves cover everything: +1 half step from M/P = aug; −1 from m/P = dim. And the spelling (letters) never changes.",
      play:()=>{MFAudio.tone(60,.6,0,.4);MFAudio.tone(66,.6,0,.4);} }
  }
};
