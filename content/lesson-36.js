/* Lesson 36 — Minor Intervals (AEMT Book 2, Unit 9)
   Built from drafts/UNIT 9 – Lesson 36.md; AEMT p.57 verified by render.
   M8 directive: slow and thorough. Core rule: Major − 1 half step = minor,
   SAME letter names; only 2,3,6,7 can be minor; Perfect intervals cannot.
   Uses quiz.js v5.4 interval-quality (M/m mode).
   NOTE: edit by FULL-FILE REWRITE only. */

/* shrink lab: press the Major note, hear it — then press one half step lower
   and hear the interval melt into minor. Letter name stays! */
function MF_L36_shrink(container,fb){
  const ROUNDS=[
    {name:"3rd",majKey:"E",majM:64,minKey:"E♭",minM:63},
    {name:"6th",majKey:"A",majM:69,minKey:"A♭",minM:68},
    {name:"2nd",majKey:"D",majM:62,minKey:"D♭",minM:61},
    {name:"7th",majKey:"B",majM:71,minKey:"B♭",minM:70}];
  let r=0,phase=0,kb=null;
  container.innerHTML=`<div class="big-q l36-q" style="text-align:center"></div>
    <div class="l36-kb"></div>
    <p style="text-align:center;font-size:13.5px;color:var(--primary);font-weight:700;margin:6px 0 0">Same letter, one half step lower — Major melts into minor. Listen for the color change!</p>`;
  const q=container.querySelector(".l36-q"), kbHolder=container.querySelector(".l36-kb");
  function ask(){
    const cur=ROUNDS[r]; phase=0;
    q.innerHTML=`Lab ${r+1} of ${ROUNDS.length}: first press <b>${cur.majKey}</b> to hear the <b>Major ${cur.name}</b> above C.`;
    kbHolder.innerHTML="";
    kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,point:cur.majM,
      onKey:m=>{
        const c=ROUNDS[r];
        if(phase===0){
          if(m===c.majM){ phase=1; kb.mark([60,m]); MFAudio.tone(60,.8,0,.4); MFAudio.tone(m,.8,0,.4);
            q.innerHTML=`That's the Major ${c.name} — bright. Now press <b>${c.minKey}</b>, ONE half step lower, and listen…`; kb.point(c.minM);
            fb(true,`✓ C–${c.majKey} = Major ${c.name}. Now shrink it by one half step…`); }
          else { MFAudio.tone(40,.2); fb(false,`First the Major version: press ${c.majKey}.`); } }
        else {
          if(m===c.minM){ kb.mark([60,m]); MFAudio.tone(60,.9,0,.4); MFAudio.tone(m,.9,0,.4); r++;
            if(r>=ROUNDS.length){ q.textContent="Major → minor, mastered by ear!";
              fb(true,`✓ C–${c.minKey} = minor ${c.name} — darker, softer. Same letters, one half step smaller. That's the whole rule!`); }
            else { fb(true,`✓ C–${c.minKey} = minor ${c.name}! Hear how the color darkened? Next pair…`); setTimeout(ask,1500); } }
          else { MFAudio.tone(40,.2); fb(false,`One half step below ${c.majKey} — the very next key down.`); } }
      }});
  }
  ask();
}

/* convert on the staff: choose the accidental that turns each Major interval minor */
function MF_L36_convert(container,fb){
  const ROUNDS=[
    {root:"C4",upper:"E4",upperFlat:"Eb4",name:"3rd",letter:"E"},
    {root:"C4",upper:"A4",upperFlat:"Ab4",name:"6th",letter:"A"},
    {root:"C4",upper:"B4",upperFlat:"Bb4",name:"7th",letter:"B"},
    {root:"C4",upper:"D4",upperFlat:"Db4",name:"2nd",letter:"D"}];
  let i=0;
  container.innerHTML=`<div class="big-q l36-cq" style="text-align:center"></div>
    <div class="l36-cstaff"></div><div class="choices chips l36-cch"></div>`;
  const q=container.querySelector(".l36-cq"), holder=container.querySelector(".l36-cstaff"), ch=container.querySelector(".l36-cch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Convert ${i+1} of ${ROUNDS.length}: this is a <b>Major ${cur.name}</b>. Which accidental on <b>${cur.letter}</b> makes it a <b>minor ${cur.name}</b>?`;
    Staff.render(holder,{clef:"treble",notes:[{p:cur.root,d:"w"},{p:cur.upper,d:"w",chord:true}],brackets:[{from:0,to:1,label:"M"+cur.name[0]}],width:220});
    ch.innerHTML="";
    [["♭ flat",true],["♯ sharp",false],["♮ natural",false]].forEach(([t,ok])=>{
      const b=document.createElement("button"); b.textContent=t;
      b.onclick=()=>{
        const c2=ROUNDS[i];
        if(ok){
          const spec={clef:"treble",tempo:70,notes:[{p:c2.root,d:"w"},{p:c2.upperFlat,d:"w",chord:true}],brackets:[{from:0,to:1,label:"m"+c2.name[0]}],width:220};
          const api=Staff.render(holder,spec); setTimeout(()=>Staff.play(spec,api),250); i++;
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="All four conversions complete!";
            fb(true,`✓ ${c2.letter}→${c2.letter}♭: the Major ${c2.name} became minor. Flat the top, keep the letters — every time.`); }
          else { fb(true,`✓ C–${c2.letter}♭ = minor ${c2.name}! Next conversion…`); setTimeout(ask,1500); } }
        else { MFAudio.tone(40,.2); fb(false,"Minor is SMALLER than Major — which accidental LOWERS a note by a half step?"); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[36]={
  welcome:"One half step. That's all it takes to turn bright Major into shadowy minor. \u{1F313}",
  hook:{
    say:"Two 3rds above C — same letters, different mood. Press both. <b>Which one sounds darker?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ 3rd number 1</button>
          <button class="play hk-b">▶ 3rd number 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Number 1 sounds darker</button><button>Number 2 sounds darker</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(64,.9,0,.42); hA=true; if(hB) setTimeout(()=>ch.style.display="",1100); };
        container.querySelector(".hk-b").onclick=()=>{ MFAudio.tone(60,.9,0,.42); MFAudio.tone(63,.9,0,.42); hB=true; if(hA) setTimeout(()=>ch.style.display="",1100); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ Number 2 was C–E♭ — a MINOR 3rd, one half step smaller than the Major 3rd (C–E) in number 1. Brighter vs darker, and the only difference is one half step. Today you learn to shrink intervals on purpose.");
          else fb(false,"Press both again — one is bright and sunny, the other cooler and shaded.");
        });
      } }
  },
  objectives:[
    "Define a minor interval",
    "Convert a Major interval into a minor interval",
    "Distinguish Major from minor by eye and ear",
    "Explain why Perfect intervals cannot become minor",
    "Read the abbreviations M3, m3, M6, m6",
    "Identify minor intervals on staff and keyboard"
  ],
  steps:[
    { say:"Review first — the two families from Lesson 35. \u{1F447} <b>Which numbers make up the MAJOR family?</b>",
      try:{ type:"mc", choices:["2, 3, 6, 7","1, 4, 5, 8","1, 3, 5, 7"], answer:0,
        success:"✓ 2-3-6-7 = Major. Keep that roster warm — today it's EXACTLY these four that learn a new trick.",
        fail:"1-4-5-8 is the Perfect team. The other four are…",
        hint:"The non-Perfect numbers." } },
    { say:"The big rule of the day: lower a <b>MAJOR</b> interval by <b>one half step</b> — keeping the letter names — and it becomes <b>MINOR</b>. C→E is a Major 3rd (M3); flat the E and C→E♭ is a minor 3rd (m3). The letters didn't change, so it is still a 3rd; only the SIZE shrank. \u{1F447} <b>What changes when Major becomes minor?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",x:150},{p:"E4",d:"w",chord:true},{p:"C4",d:"w",x:330},{p:"Eb4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"M3 — 4 half steps"},{from:2,to:3,label:"m3 — 3 half steps"}],width:440},
        kb:{start:60,octaves:0.3333,labels:true,marks:[60,63,64]} },
      try:{ type:"mc", choices:["Only the size — one half step smaller","The letter names","The interval number"], answer:0,
        success:"✓ Letters stay (still C to some kind of E, still a 3rd) — only the size shrinks by one half step.",
        fail:"C→E♭ still uses the letters C and E…",
        hint:"Is C→E♭ still a 3rd? Count the letters." } },
    { say:"Hear the shrink with your own hands. \u{1F447} <b>For each pair: press the Major note, then the key one half step lower:</b>",
      try:{ type:"custom",
        hint:"E→E♭, A→A♭, D→D♭, B→B♭ — always the very next key DOWN, same letter with a flat.",
        mount:(container,fb)=>MF_L36_shrink(container,fb) } },
    { say:"The abbreviations make the difference visible at a glance: <b>CAPITAL M = Major</b>, <b>small m = minor</b>. M3 vs m3, M6 vs m6. Handwriting tip: musicians often underline the small m so it can't be misread. \u{1F447} <b>What does m6 mean?</b>",
      try:{ type:"mc", choices:["Minor 6th","Major 6th","Middle 6th"], answer:0,
        success:"✓ Small m = minor. m6 = minor 6th, one half step smaller than M6.",
        fail:"Look at the CASE of the letter — capital or small?",
        hint:"M = Major, m = minor. Size of letter, size of interval!" } },
    { say:"Now the sizes in half steps — worth knowing cold. Major 2nd = 2, minor 2nd = <b>1</b>. Major 3rd = 4, minor 3rd = <b>3</b>. Major 6th = 9, minor 6th = <b>8</b>. Major 7th = 11, minor 7th = <b>10</b>. Each minor is exactly one less than its Major twin. \u{1F447} <b>A minor 3rd spans how many half steps?</b>",
      show:{ type:"staff", spec:{clef:"bass",tempo:70,notes:[
        {p:"C3",d:"w"},{p:"Db3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"Eb3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"Ab3",d:"w",chord:true},
        {p:"C3",d:"w"},{p:"Bb3",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"m2"},{from:2,to:3,label:"m3"},{from:4,to:5,label:"m6"},{from:6,to:7,label:"m7"}],width:460} },
      try:{ type:"mc", choices:["3","4","2"], answer:0,
        success:"✓ m3 = 3 half steps (M3 = 4, minus one). The minor twins are always Major − 1.",
        fail:"Major 3rd is 4 — and minor is always one LESS.",
        hint:"M3 = 4. Subtract the half step." } },
    { say:"Critical fine print: <b>only Major intervals can become minor</b> — the 2nds, 3rds, 6ths and 7ths. <b>Perfect intervals (1, 4, 5, 8) can NEVER be minor.</b> There is no such thing as a 'minor 5th' — lowering a Perfect interval creates something else entirely (next lesson!). \u{1F447} <b>Which of these can become minor?</b>",
      try:{ type:"mc", choices:["A Major 6th","A Perfect 5th","A Perfect octave","A Perfect 4th"], answer:0,
        success:"✓ Only the Major family shrinks to minor. Perfect intervals follow different rules — coming in Lesson 37.",
        fail:"Minor comes from MAJOR — which choice is a Major interval?",
        hint:"2-3-6-7 can go minor; 1-4-5-8 cannot." } },
    { say:"Convert on the staff — the writer's skill. \u{1F447} <b>Pick the accidental that turns each Major interval into its minor twin:</b>",
      try:{ type:"custom",
        hint:"Minor = smaller. The flat ♭ lowers the top note one half step; the letters must not change.",
        mount:(container,fb)=>MF_L36_convert(container,fb) } },
    { say:"Ear check, one last time — bright or dark? \u{1F447} <b>Listen to each interval and call its quality:</b>",
      try:{ type:"custom",
        hint:"Major = brighter, sunnier. Minor = darker, cooler. Trust the mood.",
        mount:(container,fb)=>{
          const ROUNDS=[{a:60,b:64,minor:false,name:"3rd"},{a:60,b:63,minor:true,name:"3rd"},{a:60,b:68,minor:true,name:"6th"},{a:60,b:69,minor:false,name:"6th"}];
          let i=0,heard=false;
          container.innerHTML=`<div class="big-q l36-eq" style="text-align:center"></div>
            <div style="text-align:center"><button class="play l36-play">▶ Hear the interval</button></div>
            <div class="choices l36-ech" style="display:none"><button>☀️ Major — bright</button><button>\u{1F313} minor — dark</button></div>`;
          const q=container.querySelector(".l36-eq"), ch=container.querySelector(".l36-ech");
          function ask(){ heard=false; ch.style.display="none"; q.textContent=`Sound ${i+1} of ${ROUNDS.length}: Major or minor?`; }
          container.querySelector(".l36-play").onclick=()=>{ const c=ROUNDS[i];
            MFAudio.tone(c.a,.9,0,.42); MFAudio.tone(c.b,.9,0,.42); heard=true; setTimeout(()=>ch.style.display="",1100); };
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            if(!heard) return; const c=ROUNDS[i];
            if((bi===1)===c.minor){ i++; MFAudio.yay();
              if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".l36-play").style.display="none";
                q.textContent="Ears fully tuned!"; fb(true,`✓ Four for four! That was a ${c.minor?"minor":"Major"} ${c.name} — the mood never lies.`); }
              else { fb(true,`✓ ${c.minor?"Minor":"Major"} ${c.name} — well heard! Next sound…`); setTimeout(ask,900); } }
            else { MFAudio.tone(40,.25); fb(false,"Listen again — does it glow, or does it shade?"); }
          });
          ask();
        } } }
  ],
  examples:[
    { caption:"Every Major interval beside its minor twin — M2/m2, M3/m3, M6/m6, M7/m7. Play and hear each pair shrink by exactly one half step.",
      staff:{clef:"treble",tempo:66,notes:[
        {p:"C4",d:"w"},{p:"D4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"Db4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"E4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"A4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"Ab4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"B4",d:"w",chord:true},
        {p:"C4",d:"w"},{p:"Bb4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"M2"},{from:2,to:3,label:"m2"},{from:4,to:5,label:"M3"},{from:6,to:7,label:"m3"},{from:8,to:9,label:"M6"},{from:10,to:11,label:"m6"},{from:12,to:13,label:"M7"},{from:14,to:15,label:"m7"}],width:660},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"Minor by another road: E–G uses no accidentals at all, yet it is a minor 3rd (3 half steps). Quality comes from the DISTANCE, not from whether a flat is visible!",
      staff:{clef:"treble",tempo:70,notes:[
        {p:"C4",d:"w",x:160},{p:"E4",d:"w",chord:true},
        {p:"E4",d:"w",x:340},{p:"G4",d:"w",chord:true}],
        brackets:[{from:0,to:1,label:"M3 — 4 half steps"},{from:2,to:3,label:"m3 — only 3"}],width:460},
      kb:{start:60,octaves:1,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Major/minor Sprint (45s)",
      intro:"Intervals flash by — call the full name: M3? m6? Beat the clock!",
      miaIntro:"Capital or small — eyes sharp! \u{1F3C3}",
      spec:{gen:"interval-quality", params:{qualities:["M","m"],ask:"full",min:2,max:7}, seconds:45},
      result:(score)=>score>=8?score+" in 45 seconds — Major and minor hold no secrets!":null },
    { type:"gen-race", title:"Game 2 · Quality Judge (10 rounds)",
      intro:"One interval at a time: is it Major or minor? Judge quickly!",
      miaIntro:"Order in the court! \u{2696}",
      spec:{gen:"interval-quality", params:{qualities:["M","m"],ask:"quality",min:2,max:7}, rounds:10},
      result:(score)=>score>=8?"Verdicts flawless — the quality court is adjourned!":null },
    { type:"key-climb", title:"Game 3 · Minor Ladder",
      intro:"Climb the four minor intervals above C in order: m2, m3, m6, m7!",
      miaIntro:"Dark stairs — watch your step! \u{1F313}",
      spec:{seq:[61,63,68,70], names:["D♭ (m2)","E♭ (m3)","A♭ (m6)","B♭ (m7)"], start:60, octaves:1,
        title:"Press D♭ → E♭ → A♭ → B♭: the minor intervals above C"},
      result:(score)=>score!==null?"The minor ladder is yours — all black keys this time!":null },
    { type:"term-race", title:"Game 4 · Minor Vocabulary Race",
      intro:"Minor, half step, conversion rules — match at speed!",
      miaIntro:"Last dash! \u{26A1}",
      spec:{rounds:8, reverse:true, pool:[
        ["Minor Interval","A Major interval lowered by one half step"],
        ["m3","A minor 3rd — 3 half steps"],
        ["M3","A Major 3rd — 4 half steps"],
        ["Can become minor","Only 2nds, 3rds, 6ths, and 7ths"],
        ["Can never be minor","Perfect intervals: 1, 4, 5, 8"],
        ["Letter names","What stays the SAME when Major becomes minor"]]},
      result:(score)=>score>=7?"Minor vocabulary: complete!":null }
  ],
  practiceIntro:"20 practice questions — conversions, abbreviations, half-step sizes, staff and ear logic. Answer right and the next appears automatically!",
  practice:[
    { gen:"interval-quality", params:{qualities:["M","m"],ask:"full",min:2,max:7}, count:6 },
    { gen:"interval-quality", params:{qualities:["M","m"],ask:"quality",min:2,max:7}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Minor Interval","a Major interval lowered by one half step"],["M3","a Major 3rd (4 half steps)"],["m3","a minor 3rd (3 half steps)"],["Perfect intervals","can never become minor"]], reverse:true}, count:3 },
    { type:"mc", q:"C→E is a Major 3rd. What is C→E♭?", choices:["A minor 3rd","A Major 2nd","A Perfect 3rd"], answer:0,
      explain:"Same letters, one half step smaller = minor 3rd." },
    { type:"mc", q:"C→A is a Major 6th. What is C→A♭?", choices:["A minor 6th","A Major 5th","A minor 7th"], answer:0,
      explain:"Lower the top by a half step, keep the letters: m6." },
    { type:"mc", q:"C→B is a Major 7th. What is C→B♭?", choices:["A minor 7th","A Major 6th","A Perfect 7th"], answer:0,
      explain:"M7 − half step = m7." },
    { type:"mc", q:"C→D is a Major 2nd. What is C→D♭?", choices:["A minor 2nd","A unison","A Major 1st"], answer:0,
      explain:"M2 (2 half steps) − 1 = m2 (1 half step)." },
    { type:"truefalse", q:"A Perfect 5th can be lowered a half step to become a minor 5th.", answer:false,
      explain:"Perfect intervals never become minor — 'minor 5th' doesn't exist." },
    { type:"truefalse", q:"When a Major interval becomes minor, the interval number stays the same.", answer:true,
      explain:"Letters unchanged → number unchanged. Only the size shrinks." },
    { type:"mc", q:"A minor 6th spans how many half steps?", choices:["8","9","7"], answer:0,
      explain:"M6 = 9, so m6 = 8." },
    { type:"mc", q:"Which is written with a SMALL letter?", choices:["minor intervals","Major intervals","Perfect intervals"], answer:0,
      explain:"m = minor; M = Major; P = Perfect." }
  ],
  miaQuizIntro:"One half step down, letters locked in place — show me the shrink!",
  quiz:[
    { type:"mc", q:"A minor interval is created by:", choices:["Raising a Major interval by one half step","Lowering a Major interval by one half step","Raising a Perfect interval","Lowering a Perfect interval"], answer:1,
      explain:"Major − 1 half step = minor, letters unchanged.", hint:"Minor is SMALLER." },
    { type:"mc", q:"Which interval can become minor?", choices:["Perfect 5th","Major 6th","Perfect octave","Perfect 4th"], answer:1,
      explain:"Only the Major family (2,3,6,7) can shrink to minor.", hint:"2-3-6-7 only." },
    { type:"mc", q:"C→E is a Major 3rd. C→E♭ is a…", choices:["Major 2nd","minor 3rd","diminished 3rd","Perfect 3rd"], answer:1,
      explain:"One half step smaller, same letters: m3.", hint:"Letters kept → still a 3rd." },
    { type:"truefalse", q:"When converting Major to minor, the letter names must stay the same.", answer:true,
      explain:"E becomes E♭ — never D♯ — so the count of letters is preserved.", hint:"Still C-to-E-something." },
    { type:"truefalse", q:"Perfect intervals can become minor intervals.", answer:false,
      explain:"1, 4, 5, 8 never take the minor label.", hint:"Which family owns minor?" },
    { type:"mc", q:"What does m7 mean?", choices:["Major 7th","minor 7th","Middle 7th","Perfect 7th"], answer:1,
      explain:"Small m = minor.", hint:"Check the letter case." },
    { type:"mc", q:"A minor 3rd spans…", choices:["4 half steps","3 half steps","2 half steps","5 half steps"], answer:1,
      explain:"M3 = 4, m3 = 3.", hint:"Major minus one." },
    { type:"mc", q:"Which intervals can NEVER become minor?", choices:["2nds and 3rds","6ths and 7ths","Unisons, 4ths, 5ths, octaves","3rds and 6ths"], answer:2,
      explain:"The Perfect family is minor-proof.", hint:"1-4-5-8." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Ab4",d:"w",chord:true}],width:200},
      choices:["M6","m6","P6"], answer:1,
      explain:"C→A = 6th; the flat shrinks it to minor: m6.", hint:"Count letters, then check the flat." },
    { type:"mc", q:"Name this interval.",
      staff:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G4",d:"w",chord:true}],width:200},
      choices:["M3","m3","P3"], answer:1,
      explain:"E→G = 3 half steps = minor 3rd — no accidental needed!", hint:"Count half steps: E→F→F♯→G." },
    { type:"mc", q:"To turn M6 into m6 on the staff, you…", choices:["flat the upper note","sharp the upper note","raise the lower note","rename the top note down a letter"], answer:0,
      explain:"Lower the top one half step, letters untouched.", hint:"Smaller = lower the top." },
    { type:"mc", q:"Which pair shows a Major interval and its correct minor twin?", choices:["M3 → m3","M4 → m4","P5 → m5","M8 → m8"], answer:0,
      explain:"Only 2,3,6,7 have minor twins — and 3 is on that list.", hint:"Most of these pairs don't exist!" },
    /* generated */
    { gen:"interval-quality", params:{qualities:["M","m"],ask:"full",min:2,max:7}, count:4 },
    { gen:"interval-quality", params:{qualities:["M","m"],ask:"quality",min:2,max:7}, count:2 },
    { gen:"term-match", params:{subject:"term", pool:[["Minor Interval","a Major interval lowered by one half step"],["m3","a minor 3rd (3 half steps)"],["Perfect intervals","can never become minor"],["Letter names","stay the same in a Major→minor conversion"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Minor Interval", def:"A Major interval lowered by one half step, without changing the letter names. Only 2nds, 3rds, 6ths, and 7ths can be minor.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"Eb4",d:"w",chord:true}],width:130}},
    {term:"Major Interval", def:"The standard 2nd, 3rd, 6th, or 7th found in a major scale — one half step larger than its minor twin.",
      staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true}],width:130}},
    {term:"Half Step", def:"The smallest distance between two adjacent keys — the exact amount by which Major shrinks to minor."},
    {term:"m vs M", def:"Small m = minor; capital M = Major. m3 is one half step smaller than M3."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Minor = Major − one half step</b>, with the letter names kept the same.",
    "✔ Only the Major family can shrink: <b>m2, m3, m6, m7</b> exist — 'minor 5th' does not.",
    "✔ <b>Perfect intervals (1, 4, 5, 8) can never become minor.</b>",
    "✔ Half-step sizes: m2 = 1 · m3 = 3 · m6 = 8 · m7 = 10 (each exactly one under its Major twin).",
    "✔ Quality lives in the DISTANCE: E–G is minor with no accidental in sight!"
  ],
  tips:[
    "Write the conversion, don't just think it: E→E♭ keeps three letters C-D-E in the count. E→D♯ would wreck the number.",
    "Underline your handwritten small m — a smudged m3 that reads as M3 is a whole different sound.",
    "Ear anchor: Major 3rd opens 'Oh When the Saints'; minor 3rd opens 'Greensleeves'.",
    "Next lesson: what happens when intervals stretch LARGER than Major or shrink SMALLER than minor — augmented and diminished!"
  ],
  rewards:{ badge:"Shadow Shifter", icon:"\u{1F313}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score on minor intervals — brilliantly dark work! \u{1F313}\u{1F389}",
  miaPass:"Passed! Remember the whole rule in six words: Major minus half step equals minor.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Both were 3rds above C. The first was C–E (Major, bright); the second C–E♭ (minor, darker). One half step changed the whole mood.",
      play:()=>{MFAudio.tone(60,.8,0,.4);MFAudio.tone(64,.8,0,.4);MFAudio.tone(60,.8,1.2,.4);MFAudio.tone(63,.8,1.2,.4);} },
    learn:{ label:"minor intervals",
      explain:"Lower a Major interval one half step (letters unchanged) → minor. Only 2,3,6,7 can do it; Perfect intervals can't. Small m = minor, capital M = Major.",
      hint:"Major − 1 half step = minor.",
      play:()=>{MFAudio.tone(60,.5,0,.4);MFAudio.tone(63,.5,0,.4);} },
    example:{ label:"the examples",
      explain:"Example 1 pairs every Major interval with its minor twin; example 2 shows E–G — a minor 3rd with no accidental, because quality is distance, not decoration." },
    game:{ label:"the games",
      explain:"Sprint the full names, judge Major vs minor, climb the all-black-key minor ladder, then race the vocabulary.",
      hint:"In the judge game: count half steps when your eye hesitates." },
    quiz:{ label:"this question",
      explain:"Three anchors solve everything: Major − 1 = minor; letters never change; Perfect never goes minor.",
      play:()=>{MFAudio.tone(60,.6,0,.4);MFAudio.tone(63,.6,0,.4);} }
  }
};
