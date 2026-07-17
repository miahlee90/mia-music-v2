/* Lesson 31 — The Remaining Major Scales with Key Signatures (AEMT Book 2, Unit 8)
   Built from drafts/UNIT 8 – Lesson 31.md; AEMT p.50 verified by render.
   QA note honored: enharmonic scales = different spelling, IDENTICAL pitches —
   proven side by side on staff + keyboard (B major vs C♭ major play the same keys).
   Game-forward per instructor: sig-match grand pool, keysig speed round, twin race, B-major key-climb.
   NOTE: edit by FULL-FILE REWRITE only. */

/* tap-match the three enharmonic twin pairs */
function MF_L31_twins(container,fb){
  const PAIRS={"B":"C♭","F♯":"G♭","C♯":"D♭"};
  let sel=null, matched=0;
  container.innerHTML=`<div class="big-q l31-q" style="text-align:center">Tap a SHARP key, then tap its FLAT twin!</div>
    <div class="choices chips l31-sh"></div><div class="choices chips l31-fl"></div>`;
  const q=container.querySelector(".l31-q"), shRow=container.querySelector(".l31-sh"), flRow=container.querySelector(".l31-fl");
  Object.keys(PAIRS).forEach(k=>{ const b=document.createElement("button"); b.textContent=k+" Major";
    b.style.color="var(--correct)"; b.style.borderColor="var(--correct)";
    b.onclick=()=>{ if(b.disabled) return; [...shRow.children].forEach(x=>x.style.outline=""); sel=k; b.style.outline="3px solid #ffd166"; b.dataset.sel="1"; };
    shRow.appendChild(b); });
  Object.values(PAIRS).forEach(v=>{ const b=document.createElement("button"); b.textContent=v+" Major";
    b.style.color="var(--primary)"; b.style.borderColor="var(--primary)";
    b.onclick=()=>{ if(b.disabled||!sel) return;
      if(PAIRS[sel]===v){ b.disabled=true; b.style.opacity=".4";
        const sb=[...shRow.children].find(x=>x.textContent.startsWith(sel)); sb.disabled=true; sb.style.opacity=".4"; sb.style.outline="";
        MFAudio.tone(71,.3); matched++; sel=null;
        if(matched>=3){ q.textContent="All three twin pairs matched!";
          fb(true,"✓ B=C♭ · F♯=G♭ · C♯=D♭ — three pairs of scales that SOUND identical but are spelled differently."); }
        else fb(true,"✓ Twins! Same piano keys, different spelling. Next pair…"); }
      else { MFAudio.tone(40,.25); fb(false,"Not that twin — the pair shares the SAME black-key keynote (B/C♭ share a white one!)."); } };
    flRow.appendChild(b); });
}

/* name the NEW key signatures (5-7 accidentals + A/E) */
function MF_L31_nameKey(container,fb){
  const ROUNDS=[{key:"A",clef:"treble",why:"3 sharps — last is G♯, half step up = A"},
                {key:"E",clef:"bass",why:"4 sharps — last is D♯, half step up = E"},
                {key:"B",clef:"treble",why:"5 sharps — last is A♯, half step up = B"},
                {key:"Db",clef:"bass",why:"5 flats — next-to-last is D♭"},
                {key:"Gb",clef:"treble",why:"6 flats — next-to-last is G♭"},
                {key:"Cb",clef:"bass",why:"7 flats — next-to-last is C♭"}];
  const NAME={A:"A Major",E:"E Major",B:"B Major",Db:"D♭ Major",Gb:"G♭ Major",Cb:"C♭ Major"};
  let i=0;
  container.innerHTML=`<div class="big-q l31-nq" style="text-align:center"></div><div class="l31-nstaff"></div><div class="choices chips l31-nch"></div>`;
  const q=container.querySelector(".l31-nq"), holder=container.querySelector(".l31-nstaff"), ch=container.querySelector(".l31-nch");
  Object.values(NAME).forEach(lbl=>{ const b=document.createElement("button"); b.textContent=lbl;
    b.onclick=()=>{
      const cur=ROUNDS[i];
      if(lbl===NAME[cur.key]){ b.disabled=true; b.style.opacity=".4"; i++; MFAudio.tone(72,.3);
        if(i>=ROUNDS.length){ ch.style.display="none"; holder.innerHTML=""; q.textContent="All six new keys identified!";
          fb(true,"✓ Your old rules still work perfectly — last sharp + half step, next-to-last flat. No new rules needed for the big signatures!"); }
        else { fb(true,`✓ ${cur.why}. Next…`); ask(); } }
      else { MFAudio.tone(40,.25); fb(false, cur.key[1]==="b"||cur.key==="F"? "Count the flats, then read the NEXT-TO-LAST one." : "Count the sharps, take the LAST one, go up a half step."); }
    };
    ch.appendChild(b); });
  function ask(){ const cur=ROUNDS[i];
    q.innerHTML=`Signature ${i+1} of ${ROUNDS.length}: name this major key (${cur.clef} clef).`;
    Staff.render(holder,{clef:cur.clef,keysig:cur.key,notes:[],width:250}); }
  ask();
}

LESSON_CONTENT[31]={
  welcome:"Time to complete your collection — ALL fifteen major scales. And a secret: three of them are twins! \u{1F46F}",
  hook:{
    say:"Listen to these two scales. One is <b>B major</b> (5 sharps), the other is <b>C♭ major</b> (7 flats). Press both — what do your ears say?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        const MID=[59,61,63,64,66,68,70,71];
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ B major scale</button>
          <button class="play hk-b">▶ C♭ major scale</button></div>
          <div class="choices hk-ch" style="display:none"><button>They sound EXACTLY the same</button><button>C♭ major was lower</button><button>B major was faster</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        const playSeq=()=>MID.forEach((m,i)=>MFAudio.tone(m,.3,i*.28));
        container.querySelector(".hk-a").onclick=()=>{ playSeq(); hA=true; if(hB) setTimeout(()=>ch.style.display="",2500); };
        container.querySelector(".hk-b").onclick=()=>{ playSeq(); hB=true; if(hA) setTimeout(()=>ch.style.display="",2500); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Identical! B major and C♭ major are ENHARMONIC — the same piano keys wearing different name tags. Today you meet all 15 written scales… and their 3 twin pairs.");
          else fb(false,"Press both again — can you honestly hear any difference?");
        });
      } }
  },
  objectives:[
    "Identify all 15 written major scales",
    "Explain what enharmonic major scales are",
    "Identify the three enharmonic major-scale pairs",
    "Distinguish between written scales and unique sounds",
    "Read the remaining key signatures (5, 6 and 7 accidentals)"
  ],
  steps:[
    { say:"Altogether there are <b>15 major scales</b>: <b>7 sharp keys</b>, <b>7 flat keys</b>, and the key of <b>C</b> with no sharps or flats. You already know five (C, G, D, F, B♭) — here is the whole family. \u{1F447} <b>How many written major scales are there altogether?</b>",
      show:{ type:"html", html:`<div style="max-width:520px;margin:0 auto;text-align:center;line-height:2">
        <div><b style="color:var(--correct)">Sharp keys:</b> G(1♯) · D(2♯) · A(3♯) · E(4♯) · B(5♯) · F♯(6♯) · C♯(7♯)</div>
        <div><b style="color:var(--primary)">Flat keys:</b> F(1♭) · B♭(2♭) · E♭(3♭) · A♭(4♭) · D♭(5♭) · G♭(6♭) · C♭(7♭)</div>
        <div><b>+ C major</b> — no sharps, no flats</div></div>` },
      try:{ type:"mc", choices:["15","12","13","24"], answer:0,
        success:"✓ 7 sharps + 7 flats + C = 15 written major scales.",
        fail:"Add them up: 7 + 7 + 1.",
        hint:"Sharp family + flat family + the empty one." } },
    { say:"But here's the twist: those 15 written scales make only <b>12 unique sounds</b>. Three pairs are <b>ENHARMONIC SCALES</b> — they sound the same but are written differently: <b>B = C♭</b>, <b>F♯ = G♭</b>, <b>C♯ = D♭</b>. \u{1F447} <b>How many unique-SOUNDING major scales are there?</b>",
      try:{ type:"mc", choices:["12","15","10","21"], answer:0,
        success:"✓ 15 spellings − 3 twin pairs = 12 different sounds.",
        fail:"Three of the fifteen are duplicates in sound…",
        hint:"15 minus the three twins." } },
    { say:"Proof at the keyboard: below, <b>B major</b> (5 sharps) and <b>C♭ major</b> (7 flats) — written completely differently, yet the marked piano keys are IDENTICAL. \u{1F447} <b>Why do both scales light up the same keys?</b>",
      show:{ type:"custom", mount:(el)=>{
        const s1=document.createElement("div"); el.appendChild(s1);
        Staff.render(s1,{clef:"treble",keysig:"B",notes:[{p:"B3",d:"q",label:"B"},{p:"C4",d:"q",label:"C♯"},{p:"D4",d:"q",label:"D♯"},{p:"E4",d:"q",label:"E"},{p:"F4",d:"q",label:"F♯"},{p:"G4",d:"q",label:"G♯"},{p:"A4",d:"q",label:"A♯"},{p:"B4",d:"q",label:"B"}],width:480});
        const s2=document.createElement("div"); s2.style.marginTop="6px"; el.appendChild(s2);
        Staff.render(s2,{clef:"treble",keysig:"Cb",notes:[{p:"C4",d:"q",label:"C♭"},{p:"D4",d:"q",label:"D♭"},{p:"E4",d:"q",label:"E♭"},{p:"F4",d:"q",label:"F♭"},{p:"G4",d:"q",label:"G♭"},{p:"A4",d:"q",label:"A♭"},{p:"B4",d:"q",label:"B♭"},{p:"C5",d:"q",label:"C♭"}],width:480});
        const k=document.createElement("div"); k.style.marginTop="10px"; el.appendChild(k);
        Keyboard.create(k,{start:59,octaves:1,labels:true,marks:[59,61,63,64,66,68,70,71]});
      } },
      try:{ type:"mc", choices:["They are enharmonic — same pitches, different spelling","C♭ major is played lower","The keyboard is too small"], answer:0,
        success:"✓ Enharmonic scales: every written note differs, every sounding pitch matches.",
        fail:"Look at the marked keys — do the two scales use different ones?",
        hint:"Same sound ≠ same name." } },
    { say:"Match the twins yourself. \u{1F447} <b>Pair each sharp scale with its enharmonic flat twin:</b>",
      try:{ type:"custom",
        hint:"B pairs with the C-flat spelling; F♯ with G♭; C♯ with D♭.",
        mount:(container,fb)=>MF_L31_twins(container,fb) } },
    { say:"The remaining signatures are big — up to 7 accidentals — but your rules from Lessons 29–30 still work. \u{1F447} <b>Name each new key from its signature:</b>",
      try:{ type:"custom",
        hint:"Sharps: last sharp + half step up. Flats: next-to-last flat.",
        mount:(container,fb)=>MF_L31_nameKey(container,fb) } }
  ],
  examples:[
    { caption:"B major — 5 sharps. The key signature does all the work: every C, D, F, G and A plays sharp.",
      staff:{clef:"treble",tempo:100,keysig:"B",notes:[{p:"B3",sound:"B3",d:"q",label:"1"},{p:"C4",sound:"C#4",d:"q",label:"2"},{p:"D4",sound:"D#4",d:"q",label:"3"},{p:"E4",d:"q",label:"4"},{p:"F4",sound:"F#4",d:"q",label:"5"},{p:"G4",sound:"G#4",d:"q",label:"6"},{p:"A4",sound:"A#4",d:"q",label:"7"},{p:"B4",d:"q",label:"8"}],width:540},
      kb:{start:59,octaves:1,labels:true,marks:[59,61,63,64,66,68,70,71]} },
    { caption:"C♭ major — 7 flats. Different spelling, yet listen: EXACTLY the same scale, on exactly the same keys.",
      staff:{clef:"treble",tempo:100,keysig:"Cb",notes:[{p:"C4",sound:"B3",d:"q",label:"1"},{p:"D4",sound:"Db4",d:"q",label:"2"},{p:"E4",sound:"Eb4",d:"q",label:"3"},{p:"F4",sound:"E4",d:"q",label:"4"},{p:"G4",sound:"Gb4",d:"q",label:"5"},{p:"A4",sound:"Ab4",d:"q",label:"6"},{p:"B4",sound:"Bb4",d:"q",label:"7"},{p:"C5",sound:"B4",d:"q",label:"8"}],width:540},
      kb:{start:59,octaves:1.0833,labels:true,marks:[59,61,63,64,66,68,70,71]} }
  ],
  games:[
    { type:"sig-match", title:"Game 1 · The GRAND Match-Up — all 15 keys!",
      intro:"Every key signature you now own — sharps, flats, empty. Drag each name onto its signature!",
      miaIntro:"The complete collection in one game! \u{1F3C6}",
      spec:{rounds:3, perRound:4, clefs:["treble","bass"], pool:[
        {key:"C",label:"C Major"},{key:"G",label:"G Major"},{key:"D",label:"D Major"},{key:"A",label:"A Major"},
        {key:"E",label:"E Major"},{key:"B",label:"B Major"},{key:"F#",label:"F♯ Major"},{key:"C#",label:"C♯ Major"},
        {key:"F",label:"F Major"},{key:"Bb",label:"B♭ Major"},{key:"Eb",label:"E♭ Major"},{key:"Ab",label:"A♭ Major"},
        {key:"Db",label:"D♭ Major"},{key:"Gb",label:"G♭ Major"},{key:"Cb",label:"C♭ Major"}]},
      result:(stars)=>stars>=3?"Fifteen signatures, zero hesitation!":null },
    { type:"gen-race", title:"Game 2 · Key-Signature Speed Round (45s)",
      intro:"Signatures flash — name the key before the clock runs out. All 15 keys are in play!",
      miaIntro:"Read them like a musician: at a glance! \u{26A1}",
      spec:{gen:"keysig-id", params:{max:7}, seconds:45},
      result:(score)=>score>=8?score+" keys in 45 seconds — professional-level reading!":null },
    { type:"term-race", title:"Game 3 · Enharmonic Twin Race",
      intro:"Scales, twins and counts — match them at speed!",
      miaIntro:"Know the twins cold! \u{1F46F}",
      spec:{rounds:8, reverse:true, pool:[
        ["B Major","Enharmonic twin of C♭ Major (5♯ = 7♭)"],
        ["F♯ Major","Enharmonic twin of G♭ Major (6♯ = 6♭)"],
        ["C♯ Major","Enharmonic twin of D♭ Major (7♯ = 5♭)"],
        ["15","How many written major scales there are"],
        ["12","How many unique-SOUNDING major scales there are"],
        ["Enharmonic Scales","Sound the same, written differently"]]},
      result:(score)=>score>=7?"Twin master!":null },
    { type:"key-climb", title:"Game 4 · Climb B Major — five black keys!",
      intro:"The sharpest scale you know by heart: B major has FIVE black keys. Climb it fast and clean!",
      miaIntro:"The black-key mountain! \u{1F9D7}",
      spec:{start:59, octaves:1, seq:[59,61,63,64,66,68,70,71],
        names:["B","C♯","D♯","E","F♯","G♯","A♯","B"],
        title:"Play the B major scale — keynote first!"},
      result:(stars)=>stars>=3?"A flawless climb over five black keys!":null }
  ],
  practiceIntro:"20 practice questions — all fifteen signatures, the three twins, and the 15-vs-12 idea. Answer right and the next appears automatically!",
  practice:[
    { gen:"keysig-id", params:{max:7}, count:6 },
    { gen:"term-match", params:{subject:"pair", pool:[["B Major","sounds the same as C♭ Major"],["F♯ Major","sounds the same as G♭ Major"],["C♯ Major","sounds the same as D♭ Major"],["Enharmonic Scales","different spelling, identical pitches"]], reverse:true}, count:4 },
    { type:"mc", q:"The 15 written major scales are made of…", choices:["7 sharp + 7 flat + C","8 sharp + 7 flat","12 white + 3 black"], answer:0,
      explain:"Seven of each family plus plain C major." },
    { type:"truefalse", q:"B Major and C♭ Major sound the same on a piano.", answer:true,
      explain:"Enharmonic twins — identical keys, different spelling." },
    { type:"truefalse", q:"Enharmonic scales always have different pitches.", answer:false,
      explain:"The opposite: IDENTICAL pitches, different names." },
    { type:"mc", q:"A major has ____ sharps.", choices:["3","2","4"], answer:0,
      explain:"F♯, C♯, G♯." },
    { type:"mc", q:"D♭ major has ____ flats.", choices:["5","4","6"], answer:0,
      explain:"B♭, E♭, A♭, D♭, G♭." },
    { type:"mc", q:"The enharmonic equivalent of F♯ Major is ____ Major.", choices:["G♭","E","A♭"], answer:0,
      explain:"6 sharps = 6 flats — same keys." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The C♭ major scale sounds the same as which other major scale?", choices:["B Major","A♯ Major","B♭ Major"], answer:0,
      explain:"C♭ = B: the twin pair." },
    { type:"mc", q:"The G♭ major scale sounds the same as which other major scale?", choices:["F♯ Major","F Major","G Major"], answer:0,
      explain:"G♭ = F♯." },
    { type:"mc", q:"The D♭ major scale sounds the same as which other major scale?", choices:["C♯ Major","C Major","D Major"], answer:0,
      explain:"D♭ = C♯." },
    { type:"mc", q:"There are ____ unique-sounding major scales.", choices:["12","15","7"], answer:0,
      explain:"15 written − 3 duplicates = 12 sounds." }
  ],
  miaQuizIntro:"All fifteen scales at once — collection complete? Prove it!",
  quiz:[
    { type:"mc", q:"How many written major scales are commonly recognized?", choices:["12","13","15","24"], answer:2,
      explain:"7 sharp keys + 7 flat keys + C.", hint:"Count both families plus C." },
    { type:"mc", q:"How many unique-sounding major scales are there?", choices:["10","12","15","21"], answer:1,
      explain:"Three enharmonic pairs collapse 15 spellings into 12 sounds.", hint:"Subtract the twins." },
    { type:"mc", q:"Which major scale is enharmonic with F♯ Major?", choices:["E Major","G♭ Major","A♭ Major","D♭ Major"], answer:1,
      explain:"F♯ (6♯) and G♭ (6♭) use identical piano keys.", hint:"The letter one half step up, flattened." },
    { type:"truefalse", q:"B Major and C♭ Major sound the same on a piano.", answer:true,
      explain:"You proved it at the keyboard — identical marks.", hint:"Remember the hook!" },
    { type:"truefalse", q:"Enharmonic scales always have different pitches.", answer:false,
      explain:"Enharmonic = same pitches, different spelling.", hint:"En-HARMONIC: the harmony is the same." },
    { type:"mc", q:"Which matching is correct?",
      choices:["B→C♭ · F♯→G♭ · C♯→D♭","B→B♭ · F♯→F · C♯→C","B→A♯ · F♯→E♯ · C♯→D"], answer:0,
      explain:"The three enharmonic twin pairs.", hint:"Each sharp key pairs with a flat spelling." },
    { type:"mc", q:"The enharmonic equivalent of F♯ Major is ____ Major.", choices:["G♭","G","E♭"], answer:0,
      explain:"Six sharps = six flats.", hint:"Same black-key keynote." },
    { type:"mc", q:"There are ____ unique-sounding major scales.", choices:["12","15","8"], answer:0,
      explain:"12 different sounds from 15 spellings.", hint:"The twins share sounds." },
    { type:"mc", q:"Circle the enharmonic pair.",
      choices:["F♯ Major — G♭ Major","G Major — A Major","D Major — E Major","C Major — G Major"], answer:0,
      explain:"Only F♯/G♭ share every pitch.", hint:"Neighbors on the keyboard, not the alphabet." },
    { type:"mc", q:"Complete the table: B Major = ____ Major.", choices:["C♭","A♯","B♭"], answer:0,
      explain:"B (5♯) is spelled C♭ (7♭) — same keys.", hint:"One letter up, flattened." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Enharmonic scales always use different piano keys","Enharmonic major scales sound the same but are written differently","Every major scale has an enharmonic equivalent","There are 15 different-sounding major scales"], answer:1,
      explain:"Same sound, different spelling — and only THREE pairs have twins.", hint:"Check each claim against the twins." },
    { type:"mc", q:"Name this major key signature.",
      staff:{clef:"treble",keysig:"B",notes:[],width:220},
      choices:["B Major","A Major","E Major"], answer:0,
      explain:"Five sharps — last is A♯, one half step up = B.", hint:"Count the sharps first." },
    { type:"mc", q:"Name this major key signature (bass clef).",
      staff:{clef:"bass",keysig:"Db",notes:[],width:220},
      choices:["D♭ Major","A♭ Major","G♭ Major"], answer:0,
      explain:"Five flats — next-to-last is D♭.", hint:"Read the second flat from the end." },
    { type:"mc", q:"E major has ____ sharps.", choices:["4","3","5"], answer:0,
      explain:"F♯, C♯, G♯, D♯.", hint:"One more than A major." },
    /* generated */
    { gen:"keysig-id", params:{max:7}, count:4 },
    { gen:"term-match", params:{subject:"pair", pool:[["B Major","sounds the same as C♭ Major"],["F♯ Major","sounds the same as G♭ Major"],["C♯ Major","sounds the same as D♭ Major"],["Enharmonic Scales","different spelling, identical pitches"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Enharmonic Keys", def:"Keys and scales that sound the same but are written differently. The keys of C♯, F♯ and B sound the same as the keys of D♭, G♭ and C♭ respectively."},
    {term:"15 Written Scales", def:"7 sharp keys + 7 flat keys + the key of C, which has no sharps or flats."},
    {term:"12 Unique Sounds", def:"Because three pairs of major scales are enharmonic, the 15 written scales produce only 12 different sounds."},
    {term:"B = C♭", def:"5 sharps and 7 flats — the same scale on the same piano keys, spelled two ways.",
      staff:{clef:"treble",keysig:"B",notes:[],width:120}}
  ],
  mistakes:[],
  summary:[
    "✔ <b>15 written major scales</b>: 7 sharp keys + 7 flat keys + C.",
    "✔ Only <b>12 unique sounds</b> — three pairs are <b>enharmonic</b>: <b>B=C♭ · F♯=G♭ · C♯=D♭</b>.",
    "✔ Enharmonic scales: <b>different spelling, identical pitches</b> — proven on the keyboard.",
    "✔ Your naming rules scale up: last sharp + half step; next-to-last flat — even with 7 accidentals.",
    "✔ Musicians choose the spelling that fits the key signature and harmonic context."
  ],
  tips:[
    "Reading a piece in 6 sharps? Its enharmonic twin in 6 flats plays IDENTICALLY — composers pick whichever is easier to read.",
    "The twins always straddle the bottom of the key ladder: 5♯/7♭, 6♯/6♭, 7♯/5♭ — the accidental counts always sum to 12.",
    "At a piano, play B major then 'C♭ major' — your fingers won't know the difference.",
    "Next lesson: forget skipping notes — the CHROMATIC scale plays every single key."
  ],
  rewards:{ badge:"Scale Collector", icon:"\u{1F396}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score across all FIFTEEN scales — your collection is complete and gleaming! \u{1F396}\u{1F389}",
  miaPass:"You passed! Keep the three twins on speed dial: B=C♭, F♯=G♭, C♯=D♭.",
  mia:{
    hook:{ label:"the welcome",
      explain:"B major and C♭ major are enharmonic: the identical eight piano keys, written with 5 sharps in one spelling and 7 flats in the other.",
      play:()=>{[59,61,63,64,66,68,70,71].forEach((m,i)=>MFAudio.tone(m,.28,i*.26));} },
    learn:{ label:"the fifteen scales",
      explain:"15 written scales (7♯ + 7♭ + C), 12 unique sounds, 3 enharmonic twin pairs: B=C♭, F♯=G♭, C♯=D♭.",
      hint:"The twins live where the sharp and flat ladders overlap.",
      play:()=>{MFAudio.tone(59,.4,0);MFAudio.tone(59,.4,.5);} },
    example:{ label:"the examples",
      explain:"The same eight piano keys twice: first spelled as B major (5♯), then as C♭ major (7♭). Watch the keyboards — identical marks." },
    game:{ label:"the games",
      explain:"Match all 15 signatures, speed-read them against the clock, race the twins, then climb B major's five black keys.",
      hint:"In the speed round, count accidentals FIRST, then apply your rule." },
    quiz:{ label:"this question",
      explain:"Three numbers answer almost everything: 15 written, 12 sounding, 3 twin pairs.",
      play:()=>{MFAudio.tone(66,.3,0);MFAudio.tone(66,.3,.35);} }
  }
};
