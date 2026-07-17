/* Lesson 76 — Compound Meter Expanded (Book 4, Unit 19 — SELF-AUTHORED)
   Advanced tone begins here (college-intro theory). DD-34 style.
   Core: compound meter = each beat divides into THREE; beat = dotted note;
   6/8 duple · 9/8 triple · 12/8 quadruple; beats = top ÷ 3; conducting
   patterns follow the BEATS, not the divisions.
   Color code: simple/2-division = #2F6DA8 (blue) · compound/3-division = #C05A21 (orange).
   NOTE: edit by FULL-FILE REWRITE only. */

/* conducting-pattern matcher: a meter is called; click the correct beat pattern */
function MF_L76_conduct(container,fb){
  const PAT={
    2:`<svg viewBox="0 0 120 110" width="110"><path d="M60 15 L60 80 M60 80 Q75 95 85 70 Q90 55 60 22" fill="none" stroke="#2F6DA8" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="15" r="5" fill="#2F6DA8"/><text x="60" y="105" text-anchor="middle" font-size="13" font-weight="800">2-beat</text></svg>`,
    3:`<svg viewBox="0 0 120 110" width="110"><path d="M60 15 L60 70 L95 78 Q100 60 62 20" fill="none" stroke="#C05A21" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="15" r="5" fill="#C05A21"/><text x="60" y="105" text-anchor="middle" font-size="13" font-weight="800">3-beat</text></svg>`,
    4:`<svg viewBox="0 0 120 110" width="110"><path d="M60 15 L60 65 L30 72 L92 80 Q98 55 62 20" fill="none" stroke="#A9821F" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="15" r="5" fill="#A9821F"/><text x="60" y="105" text-anchor="middle" font-size="13" font-weight="800">4-beat</text></svg>`};
  const ROUNDS=[
    {meter:"6/8", beats:2, why:"6 ÷ 3 = 2 beats — compound DUPLE conducts a 2-beat pattern."},
    {meter:"9/8", beats:3, why:"9 ÷ 3 = 3 beats — compound TRIPLE conducts a 3-beat pattern."},
    {meter:"12/8", beats:4, why:"12 ÷ 3 = 4 beats — compound QUADRUPLE conducts a 4-beat pattern."},
    {meter:"6/8", beats:2, why:"Conducting normally follows the BEATS (2 dotted quarters) rather than the six divisions."}];
  let r=0;
  container.innerHTML=`<div class="big-q l76c-q" style="text-align:center"></div>
    <div class="l76c-pats" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap"></div>`;
  const q=container.querySelector(".l76c-q"), pats=container.querySelector(".l76c-pats");
  [2,3,4].forEach(b=>{
    const d=document.createElement("div");
    d.style.cssText="cursor:pointer;border:2px solid #cdd5e1;border-radius:12px;padding:6px;background:#fff";
    d.innerHTML=PAT[b];
    d.onclick=()=>{
      const R=ROUNDS[r]; if(!R) return;
      if(b===R.beats){
        for(let i=0;i<R.beats;i++){ MFAudio.tone(48,.28,i*.5,.4); for(let j=1;j<3;j++) MFAudio.tone(72,.12,i*.5+j*.166,.18); }
        fb(true,"✓ "+R.why); r++; setTimeout(ask,1400);
      } else { MFAudio.tone(40,.2); fb(false,"Count the BEATS: divide the top number by 3."); }
    };
    pats.appendChild(d);
  });
  function ask(){
    if(r>=ROUNDS.length){ q.textContent="Excellent! You matched every conducting pattern."; pats.style.display="none"; return; }
    q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: a piece is in <b>${ROUNDS[r].meter}</b>. Which conducting pattern fits?`;
  }
  ask();
}

/* ear lab: simple (2-division) vs compound (3-division) */
function MF_L76_ear(container,fb){
  const ROUNDS=[1,0,1,0].sort(()=>Math.random()-.5); /* 1 = compound */
  let r=0, played=false;
  container.innerHTML=`<div class="big-q l76e-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play l76e-play">▶ Play the pattern</button></div>
    <div class="choices l76e-ch" style="display:none"><button>Simple — beats divide in TWO</button><button>Compound — beats divide in THREE</button></div>`;
  const q=container.querySelector(".l76e-q"), pl=container.querySelector(".l76e-play"), ch=container.querySelector(".l76e-ch");
  pl.onclick=()=>{
    if(r>=ROUNDS.length) return;
    const comp=ROUNDS[r]===1, div=comp?3:2, beatLen=comp?.6:.5;
    for(let b=0;b<4;b++){ MFAudio.tone(48,.3,b*beatLen,.42); for(let j=1;j<div;j++) MFAudio.tone(74,.12,b*beatLen+j*(beatLen/div),.16); }
    played=true; setTimeout(()=>ch.style.display="",4*beatLen*1000+300);
  };
  [...ch.children].forEach((b,i)=>b.onclick=()=>{
    if(!played) return;
    const comp=ROUNDS[r]===1;
    if((i===1)===comp){ fb(true,comp?"✓ Each beat carried THREE quick notes — compound meter.":"✓ Each beat carried TWO quick notes — simple meter."); r++; played=false; ch.style.display="none";
      if(r>=ROUNDS.length){ q.textContent="Excellent! Your ear tells simple from compound."; pl.style.display="none"; } else q.innerHTML=`Round ${r+1} of ${ROUNDS.length}: listen, then decide.`;
    } else { MFAudio.tone(40,.2); fb(false,"Listen again — count how many quick notes fill each main beat: two or three?"); }
  });
  q.innerHTML="Round 1 of 4: listen, then decide.";
}

/* example player: faster playback + pulsing beat dots so the compound
   DUPLE (6/8) or QUADRUPLE (12/8) main beats can be felt AND seen */
function MF_L76_playex(host, staff, kb, beatsPerBar, beatSec){
  host.innerHTML=`<div id="l76bt" style="display:flex;gap:12px;justify-content:center;margin-bottom:10px"></div>
    <div id="l76st"></div>
    <div id="l76kb" style="margin-top:10px"></div>
    <div style="text-align:center;margin-top:12px"><button class="play" id="l76btn">▶ Play the example</button></div>`;
  const api=Staff.render(host.querySelector("#l76st"), staff);
  const kbApi=Keyboard.create(host.querySelector("#l76kb"), kb);
  const row=host.querySelector("#l76bt"), dots=[];
  for(let i=0;i<beatsPerBar;i++){ const d=document.createElement("div"); d.textContent=(i+1);
    d.style.cssText="width:34px;height:34px;border-radius:50%;border:2px solid #cdd5e1;display:flex;align-items:center;justify-content:center;font-weight:800;color:#8a93a3;transition:all .09s";
    row.appendChild(d); dots.push(d); }
  const label=document.createElement("div");
  label.style.cssText="align-self:center;font-weight:700;color:var(--muted,#667);font-size:13px";
  label.textContent=beatsPerBar===2?"= 2 beats (compound duple)":"= 4 beats (compound quadruple)";
  row.appendChild(label);
  const DUR={"8":1/3,"q.":1,"q":2/3,"h.":2}, seq=[];
  staff.notes.forEach((n,i)=>{ if(n.bar!==undefined||n.rest!==undefined||!n.p) return; seq.push({m:MFAudio.midi(n.p), frac:DUR[n.d]||1, i}); });
  function clearDots(){ dots.forEach(d=>{ d.style.background=""; d.style.color="#8a93a3"; d.style.borderColor="#cdd5e1"; d.style.transform="scale(1)"; }); }
  host.querySelector("#l76btn").onclick=()=>{
    const btn=host.querySelector("#l76btn"); btn.disabled=true;
    let tb=0;
    seq.forEach(o=>{ const t=tb*beatSec;
      MFAudio.tone(o.m, Math.max(.12,o.frac*beatSec*0.9), t, .42);
      setTimeout(()=>{ api.highlight(o.i,false); kbApi.press(o.m,true); }, t*1000);
      tb+=o.frac; });
    const totalBeats=Math.round(tb);
    for(let b=0;b<totalBeats;b++){ setTimeout(()=>{ const bi=b%beatsPerBar;
      dots.forEach((d,i)=>{ const on=i===bi; d.style.background=on?"var(--accent,#4f7cff)":""; d.style.color=on?"#fff":"#8a93a3"; d.style.borderColor=on?"var(--accent,#4f7cff)":"#cdd5e1"; d.style.transform=on?"scale(1.18)":"scale(1)"; });
    }, b*beatSec*1000); }
    setTimeout(()=>{ api.highlight(null); clearDots(); btn.disabled=false; }, totalBeats*beatSec*1000+260);
  };
}

LESSON_CONTENT[76]={
  welcome:"In compound meter, each beat divides into three equal parts.",
  hook:{
    say:"<b>Listen to the two patterns.</b> In one, each beat divides into two equal parts; in the other, each beat divides into three. \u{1F447} <b>Which pattern is in compound meter?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Pattern 1</button>
          <button class="play hk-b">▶ Pattern 2</button></div>
          <div class="choices hk-ch" style="display:none"><button>Pattern 2 — three quick notes per beat</button><button>Pattern 1 — two quick notes per beat</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ for(let b=0;b<4;b++){ MFAudio.tone(48,.3,b*.5,.42); MFAudio.tone(74,.12,b*.5+.25,.16); } hA=true; if(hB) setTimeout(()=>ch.style.display="",2300); };
        container.querySelector(".hk-b").onclick=()=>{ for(let b=0;b<4;b++){ MFAudio.tone(48,.3,b*.6,.42); MFAudio.tone(74,.12,b*.6+.2,.16); MFAudio.tone(74,.12,b*.6+.4,.16); } hB=true; if(hA) setTimeout(()=>ch.style.display="",2700); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. In Pattern 2, each beat divides into three equal parts. This is the defining feature of compound meter.");
          else fb(false,"Pattern 1 divides each beat into two equal parts. Listen again for the pattern that divides each beat into three.");
        });
      } }
  },
  objectives:[
    "Define compound meter: each beat divides into THREE equal parts",
    "Separate the BEAT (dotted quarter) from the DIVISION (eighth notes)",
    "Read 6/8 (duple), 9/8 (triple) and 12/8 (quadruple)",
    "Determine the number of beats by dividing the top number by three",
    "Match each compound meter to its conducting pattern",
    "Hear the difference between simple and compound meter"
  ],
  steps:[
    { say:"<b>Compound Meter:</b> In compound meter, <b>each beat divides into three equal parts</b>. By contrast, each beat in simple meter normally divides into two equal parts. In compound meters with 8 as the bottom number, the beat is usually a <b>dotted quarter note</b>. \u{1F447} <b>In compound meter, each beat divides into…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px"></th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px;color:#2F6DA8">Simple Meter</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px;color:#C05A21">Compound Meter</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800">Beat divides into</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;color:#2F6DA8;font-weight:800">2 parts</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;color:#C05A21;font-weight:800">3 parts</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800">Beat note</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">plain note (♩)</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">dotted note (♩.)</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;font-weight:800">Examples</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">2/4, 3/4, 4/4</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">6/8, 9/8, 12/8</td></tr></table>` },
      try:{ type:"mc", choices:["Three equal parts","Two equal parts","Four equal parts"], answer:0,
        success:"✓ Correct. Each beat in compound meter divides into three equal parts.",
        fail:"In simple meter, each beat divides into two equal parts. Compound meter divides each beat into three.",
        hint:"Compound beats divide into three equal parts." } },
    { say:"<b>Beat and Division:</b> A measure of 6/8 contains six eighth-note <b>divisions</b>. At a moderate tempo, these divisions form <b>two beats</b>, with three eighth notes in each beat. Each beat is therefore represented by a <b>dotted quarter note</b>. In compound meter, the bottom number identifies the division value rather than the beat value. \u{1F447} <b>In 6/8 at a moderate tempo, which note represents one beat?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"6/8",tempo:60,notes:[
        {p:"G4",d:"8",label:"1"},{p:"G4",d:"8",label:"&"},{p:"G4",d:"8",label:"a"},
        {p:"D5",d:"8",label:"2"},{p:"D5",d:"8",label:"&"},{p:"D5",d:"8",label:"a"},{bar:"final"}],
        beams:[[0,2],[3,5]],width:420} },
      try:{ type:"mc", choices:["The dotted quarter note","The eighth note","The whole note"], answer:0,
        success:"✓ Correct. One dotted quarter note equals three eighth-note divisions.",
        fail:"Which note value equals three eighth notes?",
        hint:"Three eighth notes equal one dotted quarter note." } },
    { say:"<b>Three Common Compound Meters:</b> <b style='color:#C05A21'>6/8</b> is compound duple meter with two beats; <b style='color:#C05A21'>9/8</b> is compound triple meter with three beats; and <b style='color:#C05A21'>12/8</b> is compound quadruple meter with four beats. <b>For these meters, divide the top number by 3 to find the number of beats.</b> \u{1F447} <b>How many beats are in a measure of 9/8?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14.5px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Meter</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Beats</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:6px 14px">Name</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#C05A21">6/8</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">6 ÷ 3 = 2</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;color:#C05A21;font-weight:800">Compound Duple</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#C05A21">9/8</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">9 ÷ 3 = 3</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;color:#C05A21;font-weight:800">Compound Triple</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;font-weight:800;color:#C05A21">12/8</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center">12 ÷ 3 = 4</td><td style="border:1.5px solid #cdd5e1;padding:4px 14px;text-align:center;color:#C05A21;font-weight:800">Compound Quadruple</td></tr></table>` },
      try:{ type:"mc", choices:["3 beats","9 beats","2 beats"], answer:0,
        success:"✓ Correct. A measure of 9/8 contains three dotted-quarter beats, so it is compound triple meter.",
        fail:"Divide the top number by 3.",
        hint:"9 ÷ 3 = 3." } },
    { say:"In <b>9/8</b> and <b>12/8</b>, eighth notes are normally beamed <b>in groups of three</b>, with one group representing each beat. Correct beaming makes the beat structure easy to recognize. \u{1F447} <b>In 12/8, how many groups of three eighth notes normally appear in each measure?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"12/8",tempo:60,notes:[
        {p:"C4",d:"8"},{p:"E4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"8"},{p:"G4",d:"8"},{p:"E4",d:"8"},
        {p:"F4",d:"8"},{p:"A4",d:"8"},{p:"C5",d:"8"},{p:"G4",d:"q."},{bar:"final"}],
        beams:[[0,2],[3,5],[6,8]],width:520} },
      try:{ type:"mc", choices:["Four groups","Three groups","Twelve groups"], answer:0,
        success:"✓ Correct. Four groups of three eighth notes form four dotted-quarter beats.",
        fail:"Divide 12 by 3.",
        hint:"Each beamed group of three eighth notes represents one beat." } },
    { say:"<b>Conducting Patterns:</b> Conductors normally show the <b>main beats</b> rather than every division. At a moderate tempo, 6/8 uses a <b>two-beat</b> pattern, 9/8 uses a <b>three-beat</b> pattern, and 12/8 uses a <b>four-beat</b> pattern. These correspond to the basic conducting patterns used for duple, triple, and quadruple meter. \u{1F447} <b>Match each meter with its conducting pattern.</b>",
      try:{ type:"custom",
        hint:"Divide the top number by 3 to find the number of main beats.",
        mount:(container,fb)=>MF_L76_conduct(container,fb) } },
    { say:"<b>6/8 and 3/4</b> can both contain six eighth notes, but they organize them differently. <b style='color:#2F6DA8'>In 3/4, the eighth notes form three groups of two.</b> <b style='color:#C05A21'>In 6/8, they form two groups of three.</b> The <b>grouping and accent pattern</b> determine how the meter is heard. \u{1F447} <b>Six eighth notes beamed 3 + 3 most strongly suggest…</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"6/8",tempo:60,notes:[
        {p:"C5",d:"8"},{p:"B4",d:"8"},{p:"A4",d:"8"},{p:"G4",d:"8"},{p:"F4",d:"8"},{p:"E4",d:"8"},{bar:"final"}],
        beams:[[0,2],[3,5]],width:380} },
      try:{ type:"mc", choices:["6/8 — two beats, each divided into three","3/4 — three beats, each divided into two","4/4 — four beats"], answer:0,
        success:"✓ Correct. Grouping the eighth notes 3 + 3 indicates two compound beats and strongly suggests 6/8. Grouping them 2 + 2 + 2 would suggest 3/4.",
        fail:"Count the eighth notes in each beamed group.",
        hint:"Each group of three represents one compound beat." } },
    { say:"Listen and identify whether each beat divides into two or three equal parts. \u{1F447}",
      try:{ type:"custom",
        hint:"Listen to the notes within each main beat: two divisions suggest simple meter; three divisions suggest compound meter.",
        mount:(container,fb)=>MF_L76_ear(container,fb) } },
    { say:"<b>Review</b> \u{1F447} <b>Which time signature represents compound duple meter?</b>",
      try:{ type:"mc", choices:["6/8","3/4","9/8"], answer:0,
        success:"✓ Correct. A measure of 6/8 normally contains two dotted-quarter beats, each divided into three eighth notes.",
        fail:"Duple meter has two main beats. Divide the top number by 3.",
        hint:"6 ÷ 3 = 2 beats." } },
    { say:"<b>Review</b> \u{1F447} <b>Which meter is compound triple?</b>",
      try:{ type:"mc", choices:["9/8","6/8","4/4"], answer:0,
        success:"✓ Correct. 9 ÷ 3 = 3 dotted-quarter beats, so 9/8 is compound triple (6/8 is compound duple; 4/4 is simple quadruple).",
        fail:"Compound triple has three main beats. Divide the top number by 3.",
        hint:"9 ÷ 3 = 3 beats." } }
  ],
  examples:[
    { caption:"A 6/8 melody played a bit quicker so you FEEL two main beats per measure (compound duple). Watch the two beat dots pulse — '1-&-a 2-&-a'.",
      mount:(host)=>MF_L76_playex(host,
        {clef:"treble",time:"6/8",notes:[
          {p:"G4",d:"8"},{p:"A4",d:"8"},{p:"B4",d:"8"},{p:"C5",d:"8"},{p:"B4",d:"8"},{p:"A4",d:"8"},{bar:"single"},
          {p:"G4",d:"q."},{p:"D5",d:"q."},{bar:"single"},
          {p:"E5",d:"8"},{p:"D5",d:"8"},{p:"C5",d:"8"},{p:"B4",d:"8"},{p:"A4",d:"8"},{p:"B4",d:"8"},{bar:"single"},
          {p:"G4",d:"q."},{p:"G4",d:"q."},{bar:"final"}],
          beams:[[0,2],[3,5],[10,12],[13,15]],width:660},
        {start:55,octaves:2,labels:true}, 2, 0.55) },
    { caption:"The same idea in 12/8, played quicker so the FOUR main beats emerge (compound quadruple) — the slow-ballad and blues-shuffle feel. Watch the four beat dots.",
      mount:(host)=>MF_L76_playex(host,
        {clef:"treble",time:"12/8",notes:[
          {p:"C4",d:"8"},{p:"E4",d:"8"},{p:"G4",d:"8"},{p:"C5",d:"8"},{p:"G4",d:"8"},{p:"E4",d:"8"},
          {p:"F4",d:"8"},{p:"A4",d:"8"},{p:"C5",d:"8"},{p:"C4",d:"q."},{bar:"final"}],
          beams:[[0,2],[3,5],[6,8]],width:560},
        {start:48,octaves:2,labels:true}, 4, 0.5) }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Compound Meter Sprint (45s)",
      intro:"Identify beats, divisions, and common compound meters before time runs out.",
      miaIntro:"Divide the top number by 3 to find the beats.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Compound meter","each beat divides into THREE"],
        ["Simple meter","each beat divides into two"],
        ["The compound beat note","the dotted quarter"],
        ["6/8","compound duple — 2 beats"],
        ["9/8","compound triple — 3 beats"],
        ["12/8","compound quadruple — 4 beats"],
        ["Finding the beats","top number ÷ 3"],
        ["Conducting","follows the beats, not the divisions"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Compound meter challenge completed!":null },
    { type:"symbol-hunt", title:"Game 2 · Spot the Meter",
      intro:"Examine each beamed rhythm and select the correct meter.",
      miaIntro:"Use the beaming to identify the beat groups.",
      spec:{rounds:6, pool:[
        {label:"6/8 (3+3)", spec:{clef:"treble",time:"6/8",notes:[{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"}],beams:[[0,2],[3,5]],width:190}},
        {label:"9/8 (3+3+3)", spec:{clef:"treble",time:"9/8",notes:[{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"}],beams:[[0,2],[3,5],[6,8]],width:240}},
        {label:"3/4 (2+2+2)", spec:{clef:"treble",time:"3/4",notes:[{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"}],beams:[[0,1],[2,3],[4,5]],width:190}},
        {label:"12/8 (four groups)", spec:{clef:"treble",time:"12/8",notes:[{p:"D5",d:"q."},{p:"D5",d:"q."},{p:"D5",d:"q."},{p:"D5",d:"q."}],width:220}}]},
      result:(score)=>score>=5?"You identified the meters from their beat groupings.":null },
    { type:"order-tap", title:"Game 3 · Small to Large",
      intro:"Arrange the compound meters from the fewest beats to the most.",
      miaIntro:"Begin with two beats, then three, then four.",
      spec:{sequence:["6/8 — compound duple (2 beats)","9/8 — compound triple (3 beats)","12/8 — compound quadruple (4 beats)"],
        title:"The compound meters, by beat count"},
      result:(stars)=>stars>=2?"You arranged the compound meters correctly.":null },
    { type:"term-race", title:"Game 4 · Beat or Division?",
      intro:"Decide whether each statement describes a beat or a division.",
      miaIntro:"A beat contains three divisions in compound meter.",
      spec:{rounds:8, reverse:true, pool:[
        ["The BEAT in 6/8","the dotted quarter"],
        ["The DIVISION in 6/8","the eighth note"],
        ["Divisions per beat (compound)","three"],
        ["Divisions per beat (simple)","two"],
        ["Six eighths beamed 3+3","6/8"],
        ["Six eighths beamed 2+2+2","3/4"],
        ["Beats in 12/8","four"],
        ["The conductor shows","beats only"]]},
      result:(score)=>score>=6?"You distinguished beats from divisions.":null }
  ],
  practiceIntro:"Complete 20 practice questions on compound meters, beats, and divisions. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Compound meter","beats divide into three"],["6/8","compound duple"],["9/8","compound triple"],["12/8","compound quadruple"],["Beat note","dotted quarter"],["Division note","eighth note"]], reverse:true}, count:6 },
    { gen:"rhythm-count", params:{}, count:2 },
    { type:"mc", q:"At a moderate tempo, how many main beats are in a measure of 6/8?", choices:["2","6","3"], answer:0,
      explain:"6 ÷ 3 = 2 dotted-quarter beats." },
    { type:"mc", q:"How many main beats are normally in a measure of 12/8?", choices:["4","12","6"], answer:0,
      explain:"12 ÷ 3 = 4 dotted-quarter beats." },
    { type:"mc", q:"In a compound meter with 8 as the bottom number, which note value normally represents one beat?", choices:["The dotted quarter note","The eighth note","The half note"], answer:0,
      explain:"One beat contains three eighth-note divisions and is represented by a dotted quarter note." },
    { type:"mc", q:"Which time signature represents compound triple meter?", choices:["9/8","3/4","6/8"], answer:0,
      explain:"9 ÷ 3 = 3 beats." },
    { type:"truefalse", q:"In compound meter, each beat normally divides into three equal parts.", answer:true,
      explain:"This three-part beat division is the defining feature of compound meter." },
    { type:"truefalse", q:"3/4 is a compound meter.", answer:false,
      explain:"3/4 is simple triple meter; each beat normally divides into two equal parts." },
    { type:"truefalse", q:"Conductors normally show every division rather than the main beats.", answer:false,
      explain:"Conducting patterns normally show the main beats." },
    { gen:"term-match", params:{subject:"term", pool:[["Top ÷ 3","the beat count"],["3+3 beaming","compound"],["2+2+2 beaming","simple triple"],["Dotted note","the compound beat"]], reverse:true}, count:3 },
    { gen:"note-value", params:{}, count:2 }
  ],
  vocabulary:[
    {term:"Compound Meter", def:"A meter in which each beat naturally divides into three equal parts. In compound meter, the beat is usually a dotted note."},
    {term:"Beat vs. Division", def:"The beat is the pulse you feel and conduct. Each beat divides into three equal divisions, usually written as eighth notes."},
    {term:"Compound Duple / Triple / Quadruple", def:"6/8 = compound duple · 9/8 = compound triple · 12/8 = compound quadruple. The number of beats equals the top number divided by three."},
    {term:"Conducting Pattern", def:"Conductors make one conducting motion for each beat, not for each written eighth note — a 2-beat, 3-beat, or 4-beat pattern."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Compound meter</b>: each beat divides into <b>three</b>; the beat is a <b>dotted quarter</b>.",
    "✔ <b>Beats = top number ÷ 3</b>: 6/8 → 2 · 9/8 → 3 · 12/8 → 4.",
    "✔ The bottom number names the <b>division</b>, not the beat.",
    "✔ Beaming in groups of <b>three</b> shows the beats — 3+3 (6/8) vs 2+2+2 (3/4).",
    "✔ Conduct the <b>beats</b>: 6/8 in two, 9/8 in three, 12/8 in four."
  ],
  tips:[
    "Say '1-&-a 2-&-a' for 6/8 — the '&-a' fills each beat's three divisions.",
    "Hearing test: if the quick notes come in threes, the meter is compound.",
    "12/8 powers the blues shuffle and slow doo-wop ballads — four big beats, each rolling in three.",
    "Next lesson: what happens when a SIMPLE meter borrows a three-division — the triplet — and compound borrows two: the duplet."
  ],
  rewards:{ badge:"Compound Conductor", icon:"\u{1F3B5}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"In compound meter, divide the top number by 3 to find the main beats. Each beat divides into three equal parts.",
  quiz:[
    { type:"mc", q:"In compound meter, each beat normally divides into…", choices:["three equal parts","two equal parts","four equal parts"], answer:0,
      explain:"Three-part beat division is the defining feature of compound meter.", hint:"Compound beats divide into three parts." },
    { type:"mc", q:"At a moderate tempo, which note value represents one beat in 6/8, 9/8, and 12/8?", choices:["The dotted quarter note","The eighth note","The quarter note"], answer:0,
      explain:"Three eighth notes equal one dotted quarter note.", hint:"Add three eighth-note values together." },
    { type:"mc", q:"How is 6/8 classified?", choices:["compound duple","compound triple","simple duple"], answer:0,
      explain:"6/8 contains two main beats, each divided into three eighth notes.", hint:"Count the beats." },
    { type:"mc", q:"How many main beats are normally in a measure of 9/8?", choices:["3","9","4"], answer:0,
      explain:"9 ÷ 3 = 3, so 9/8 is compound triple meter.", hint:"Top ÷ 3." },
    { type:"mc", q:"How is 12/8 classified?", choices:["compound quadruple","compound duple","simple quadruple"], answer:0,
      explain:"12/8 contains four main beats, each divided into three eighth notes.", hint:"Four beats of three." },
    { type:"mc", q:"For 6/8, 9/8, and 12/8, how do you determine the number of main beats?", choices:["Divide the top number by 3","Use the top number as the number of beats","Divide the bottom number by 2"], answer:0,
      explain:"6→2, 9→3, 12→4.", hint:"÷ 3." },
    { type:"mc", q:"Identify the meter.", 
      staff:{clef:"treble",time:"9/8",notes:[{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"G4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"B4",d:"8"},{p:"D5",d:"8"},{p:"D5",d:"8"},{p:"D5",d:"8"}],beams:[[0,2],[3,5],[6,8]],width:300},
      choices:["9/8 — compound triple","6/8 — compound duple","3/4 — simple triple"], answer:0,
      explain:"Three groups of three eighth notes indicate three compound beats.", hint:"Count the beam groups." },
    { type:"mc", q:"Six eighth notes beamed 2 + 2 + 2 most strongly suggest which meter?", choices:["3/4","6/8","12/8"], answer:0,
      explain:"Three groups of two eighth notes indicate three simple beats and therefore suggest 3/4.", hint:"Count the number of beamed groups." },
    { type:"mc", q:"At a moderate tempo, which conducting pattern is normally used for 12/8?", choices:["The four-beat pattern","The twelve-beat pattern","The three-beat pattern"], answer:0,
      explain:"Conduct the four main beats rather than all twelve eighth-note divisions.", hint:"Beats only." },
    { type:"truefalse", q:"In 6/8, the bottom number identifies the beat value.", answer:false,
      explain:"The bottom number identifies the eighth-note division. At a moderate tempo, the beat is represented by a dotted quarter note.", hint:"Beat vs division." },
    { type:"truefalse", q:"You hear each main beat divide into three equal parts. This suggests compound meter.", answer:true,
      explain:"Compound meter is characterized by three equal divisions within each beat.", hint:"The ear test." },
    { type:"mc", q:"Which pair can contain the same total duration of six eighth notes organized into different beat groupings?", choices:["6/8 (3+3) and 3/4 (2+2+2)","6/8 and 12/8","4/4 and 2/4"], answer:0,
      explain:"6/8 organizes the eighth notes into two groups of three, while 3/4 organizes them into three groups of two.", hint:"Compare the 3 + 3 and 2 + 2 + 2 groupings." }
  ],
  miaPerfect:"Perfect score! You accurately identified the beats, divisions, and conducting patterns of compound meter.",
  miaPass:"You passed! Next, you will compare triplets and duplets.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Pattern 1 divided each beat into two (simple); pattern 2 divided each beat into three (compound). That three-part division is today's subject.",
      play:()=>{for(let b=0;b<4;b++){ MFAudio.tone(48,.3,b*.6,.42); MFAudio.tone(74,.12,b*.6+.2,.16); MFAudio.tone(74,.12,b*.6+.4,.16); }} },
    learn:{ label:"compound meter",
      explain:"Beats divide into three; beat = dotted quarter; beats = top ÷ 3 (6/8→2, 9/8→3, 12/8→4); beaming 3+3 shows the beats; conduct the beats.",
      hint:"Top ÷ 3.",
      play:()=>{for(let b=0;b<2;b++){ MFAudio.tone(48,.3,b*.6,.42); for(let j=1;j<3;j++) MFAudio.tone(74,.12,b*.6+j*.2,.16); }} },
    example:{ label:"the examples",
      explain:"Example 1 is a 6/8 melody counted '1-&-a 2-&-a'; example 2 moves the same idea into 12/8 — four rolling beats." },
    game:{ label:"the games",
      explain:"Sprint the facts, spot meters from beaming, order the compound family, then race beat-vs-division.",
      hint:"3+3 = compound; 2+2+2 = simple." },
    quiz:{ label:"this question",
      explain:"Two checks answer everything: does the beat divide in three (compound)? And beats = top number ÷ 3.",
      play:()=>{for(let b=0;b<3;b++){ MFAudio.tone(48,.3,b*.6,.42); for(let j=1;j<3;j++) MFAudio.tone(74,.12,b*.6+j*.2,.16); }} }
  }
};
