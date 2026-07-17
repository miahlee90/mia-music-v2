/* Lesson 16 — Eighth Rests (AEMT Book 1, Unit 4)
   Built from drafts/UNIT 4 – Lessons 15 & 16.md (combined draft — pages stay separate, DD-12).
   QA note honored: "eighth rest = ½ beat of silence, keep counting" + repeated
   visual comparison of the eighth rest with the flagged eighth note.
   NOTE: edit by FULL-FILE REWRITE only. */

/* note-or-rest sorter (unique L16 prefix) */
function MF_L16_noteRest(container,fb,rounds){
  const POOL=[
    {item:{p:"G4",d:"8"},rest:false},{item:{rest:"8"},rest:true},
    {item:{p:"C5",d:"8"},rest:false},{item:{rest:"q"},rest:true},
    {item:{rest:"8"},rest:true},{item:{p:"E4",d:"8"},rest:false}];
  const seq=[...POOL].sort(()=>Math.random()-.5).slice(0,rounds);
  let i=0;
  container.innerHTML=`<div class="big-q nr-q" style="text-align:center"></div><div class="nr-staff"></div>
    <div class="choices nr-ch"><button>\u{1F3B5} Eighth NOTE — play it</button><button>\u{1F910} A REST — silence!</button></div>`;
  const q=container.querySelector(".nr-q"), st=container.querySelector(".nr-staff"), ch=container.querySelector(".nr-ch");
  function ask(){
    Staff.render(st,{clef:"treble",notes:[seq[i].item],width:240});
    q.textContent=`Symbol ${i+1} of ${seq.length}: sound or silence?`;
  }
  [...ch.children].forEach((b,bi)=>b.onclick=()=>{
    const cur=seq[i], saidRest=bi===1, ok=saidRest===cur.rest;
    if(ok){ if(cur.rest) MFAudio.click(0,.35); else MFAudio.tone(MFAudio.midi(cur.item.p),.25);
      i++;
      if(i>=seq.length){ ch.style.display="none"; q.textContent="Sound and silence sorted!";
        fb(true,"✓ The eighth NOTE has a notehead on the staff; the eighth REST is the little “7” floating alone. Never confuse them again!"); }
      else { fb(true,`✓ ${cur.rest?"Silence — a rest!":"Sound — a note with a real notehead."} Next…`); ask(); } }
    else fb(false,"Look for a NOTEHEAD sitting on a line or space. No notehead = no sound = a REST.");
  });
  ask();
}

LESSON_CONTENT[16]={
  welcome:"Even the fast notes need to breathe. \u{1F910}",
  hook:{
    say:"Remember the silent twins? Every note has one — and today the <b>eighth note</b> meets its twin. Press play: the running notes suddenly hiccup with a tiny <b>half-beat silence</b>. Hear it?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Running… with hiccups</button></div>
          <div class="choices hk-ch" style="display:none"><button>A tiny HALF-BEAT silence appeared</button><button>The notes slowed down</button><button>Nothing changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/84;
          for(let k=0;k<4;k++) MFAudio.click(k*spb,.45,k===0);
          [0,0.5,1,1.5].forEach((b,i)=>MFAudio.tone(67,spb*.4,b*spb));
          [2,3,3.5].forEach((b,i)=>MFAudio.tone(67,spb*.4,b*spb)); /* gap at 2.5 */
          setTimeout(()=>{ ch.style.display=""; },4*spb*1000+400);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ A little gap, exactly half a beat long — that's an EIGHTH REST: the eighth note's silent twin!");
          else fb(false,"The beat never slowed — listen for the tiny hole in the running notes.");
        });
      } }
  },
  objectives:[
    "Identify eighth rests",
    "Recognize that an eighth rest lasts ½ beat of silence",
    "Tell the eighth rest apart from the eighth note",
    "Count eighth rests using “and” counting",
    "Keep counting through half-beat silences",
    "Build measures using notes AND eighth rests"
  ],
  steps:[
    { say:"The <b>eighth rest</b> looks like a little <b>7 with a dot</b> — and it means <b>½ beat of silence</b>. Exactly as long as an eighth note, minus the sound. \u{1F447} <b>How long does the eighth rest last?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"B4",d:"8",label:"eighth note"},{rest:"8",label:"eighth rest"}],width:400} },
      try:{ type:"mc",
        choices:["½ beat","1 beat","2 beats"], answer:0,
        success:"✓ Half a beat of pure silence — the eighth note's twin.",
        fail:"Twins are the same length — how long is an eighth NOTE?",
        hint:"Same as its twin." } },
    { say:"Note or rest? The eighth NOTE has a <b>notehead</b> on a line or space; the eighth REST floats alone like a tiny 7. \u{1F447} <b>Sort them:</b>",
      try:{ type:"custom",
        hint:"No notehead = no sound.",
        mount:(container,fb)=>MF_L16_noteRest(container,fb,5) } },
    { say:"Counting stays the same — <b>1-and-2-and</b> — but on a rest, the count goes <b>silent</b>. Say the number, skip the sound. \u{1F447} <b>Press play, follow the labels:</b>",
      try:{ type:"custom",
        hint:"Say every count out loud; the parentheses are your silent half-beats.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:84,
            notes:[{p:"C4",d:"8",label:"1"},{p:"D4",d:"8",label:"and"},{p:"E4",d:"8",label:"2"},{rest:"8",label:"(and)"},{p:"G4",d:"q",label:"3"},{rest:"q",label:"(4)"},{bar:"final"}],
            beams:[[0,1]],width:460};
          container.innerHTML=`<div class="c8-staff"></div><div style="text-align:center"><button class="play c8-play">▶ Play & count along</button></div>`;
          const api=Staff.render(container.querySelector(".c8-staff"),spec);
          container.querySelector(".c8-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ 1-and-2-(and)-3-(4) — the count ran straight through every silence, big and small!"),total*1000+300);
          };
        } } },
    { say:"Family photo! Every rest matches its note: whole (4), half (2), quarter (1)… and now <b>eighth (½)</b>. \u{1F447} <b>Which rest is the SHORTEST?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{rest:"w",label:"4"},{rest:"h",label:"2"},{rest:"q",label:"1"},{rest:"8",label:"½"}],width:420} },
      try:{ type:"mc",
        choices:["The eighth rest — ½ beat","The quarter rest — 1 beat","The whole rest — 4 beats"], answer:0,
        success:"✓ The little 7 is the quickest silence in the family — just half a beat!",
        fail:"Shortest = smallest number of beats.",
        hint:"½ < 1 < 2 < 4." } },
    { say:"Build with sound AND quick silence. Fill the 4/4 measure — <b>each measure needs at least one eighth rest</b>. \u{1F447} <b>Two different measures:</b>",
      try:{ type:"custom",
        hint:"Eighth rest = ½ silent beat. It counts toward the total like any note!",
        mount:(container,fb)=>{
          const BT=[{t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
                    {t:"E",label:"Eighth Rest",beats:.5,item:{rest:"8"},isRest:true},
                    {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}},
                    {t:"Q",label:"Quarter Rest",beats:1,item:{rest:"q"},isRest:true},
                    {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}}];
          let cur=[],sum=0,found=[],doneItems=[];
          container.innerHTML=`<div class="br-staff"></div><div class="big-q br-q" style="text-align:center"></div>
            <div class="choices br-ch"></div>`;
          const st=container.querySelector(".br-staff"), q=container.querySelector(".br-q"), ch=container.querySelector(".br-ch");
          const BTNS_LOCAL=BT;
          BTNS_LOCAL.forEach(bt=>{ const b=document.createElement("button");
            b.style.cssText="border-radius:10px;padding:6px 10px;min-width:104px";
            const d0=document.createElement("div"); b.appendChild(d0);
            Staff.render(d0,{clef:"none",notes:[bt.item],width:100});
            const nm=document.createElement("div"); nm.style.cssText="font-weight:700;font-size:13px";
            nm.textContent=bt.label.replace(/\s*\([^)]*\)\s*$/,""); b.appendChild(nm);
            b.onclick=()=>add(bt); ch.appendChild(b); });
          const clr=document.createElement("button"); clr.className="ghost"; clr.textContent="↺ Clear";
          clr.onclick=()=>{ cur=[];sum=0;draw(); }; ch.appendChild(clr);
          function draw(){
            const items=[...doneItems,...cur.map(bt=>bt.item)];
            if(found.length>=2&&items.length&&items[items.length-1].bar==="single") items[items.length-1]={bar:"final"};
            for(let m=found.length;m<2;m++) items.push({bar: m===2-1? "final":"single"});
            Staff.render(st,{clef:"treble",time:"4/4",notes:items,width:470});
            q.textContent=`Beats: ${sum} of 4 · Measures built: ${found.length} of 2`;
          }
          function add(bt){
            if(sum+bt.beats>4){ fb(false,`That would make ${sum+bt.beats} — too many!`); return; }
            cur.push(bt); sum+=bt.beats;
            if(bt.isRest) MFAudio.click(0,.3); else MFAudio.tone(71,Math.max(.2,bt.beats*.4));
            draw();
            if(sum===4){
              if(!cur.some(x=>x.t==="E")){ fb(false,"Exactly 4 — but today's rule: include at least one EIGHTH rest (the little 7)!"); cur=[];sum=0; setTimeout(draw,1100); return; }
              const key=cur.map(x=>x.t).sort().join("");
              if(found.includes(key)){ fb(false,"Same recipe — clear and mix a new one!"); cur=[];sum=0; setTimeout(draw,900); return; }
              found.push(key);
              let t=0; cur.forEach(bt=>{ if(!bt.isRest) MFAudio.tone(71,Math.max(.2,bt.beats*.45),t); t+=bt.beats*.5; });
              doneItems.push(...cur.map(bt=>bt.item), {bar:"single"});
              cur=[]; sum=0; draw();
              if(found.length>=2){ ch.style.display="none"; q.textContent="Two measures with quick silences!";
                fb(true,"✓ Half-beat silences placed like a pro — sound and silence in perfect balance!"); }
              else fb(true,"✓ Exactly 4, eighth rest included — it stays as measure 1. One more, different mix…");
            }
          }
          draw();
        } } }
  ],
  examples:[
    { caption:"Off-beat fun: rests ON the beat, notes on the “and” — count 1-and-2-and and whisper nothing on the silent halves.",
      staff:{clef:"treble",tempo:84,time:"4/4",notes:[{rest:"8",label:"(1)"},{p:"G4",d:"8",label:"and"},{rest:"8",label:"(2)"},{p:"G4",d:"8",label:"and"},{p:"E4",d:"h",label:"3-4"},{bar:"final"}],width:440} },
    { caption:"The full rest family with their beat counts — from the 4-beat hole to the ½-beat little 7.",
      staff:{clef:"treble",notes:[{rest:"w",label:"4 beats"},{rest:"h",label:"2 beats"},{rest:"q",label:"1 beat"},{rest:"8",label:"½ beat"}],width:440} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Rest Family Flash",
      intro:"All FOUR rests now — hole, hat, squiggle, and the little 7. Name them fast!",
      miaIntro:"The rest family grew — keep up! \u{26A1}",
      spec:{rounds:10, ask:"name", kind:"rest", values:["w","h","q","8"]},
      result:(score)=>score>=9?"Every silence named on sight!":null },
    { type:"rhythm-tap", title:"Game 2 · Don't Tap the Half-Silence!",
      intro:"The trickiest tap yet: eighth rests hide INSIDE the beat. Tap the notes, honor every half-beat of silence!",
      miaIntro:"Half-beat silences — can your hands resist? \u{1F910}",
      spec:{tempo:80, rounds:3, patterns:[["8","r8","8","r8","q","q","q"],["q","8","8","rq","q","q"],["8","8","q","r8","8","q","q"]]},
      result:(score)=>score>=9?"Perfect restraint — the silences stayed silent!":null },
    { type:"symbol-hunt", title:"Game 3 · Note or Rest?",
      intro:"The eighth note and eighth rest love to confuse beginners. Click exactly what Mia names!",
      miaIntro:"Twins with different jobs — spot the right one! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Eighth Rest", spec:{clef:"treble",notes:[{rest:"8"}]}},
        {label:"Eighth Note", spec:{clef:"treble",notes:[{p:"B4",d:"8"}]}},
        {label:"Quarter Rest", spec:{clef:"treble",notes:[{rest:"q"}]}},
        {label:"Quarter Note", spec:{clef:"treble",notes:[{p:"B4",d:"q"}]}},
        {label:"Half Rest", spec:{clef:"treble",notes:[{rest:"h"}]}}]},
      result:(score)=>score>=5?"Notes and rests — never mixed up again!":null },
    { type:"measure-build", title:"Game 4 · Sound & Quick Silence Builder",
      intro:"Build 4-beat measures mixing notes, quarter rests, and eighth rests — three different creations!",
      miaIntro:"Compose with the quickest silence in music! \u{1F3A8}",
      spec:{beats:4, rounds:3, needRest:true, buttons:[
        {t:"8",label:"Eighth Note",beats:.5,item:{p:"B4",d:"8"}},
        {t:"E",label:"Eighth Rest",beats:.5,item:{rest:"8"},isRest:true},
        {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}},
        {t:"Q",label:"Quarter Rest",beats:1,item:{rest:"q"},isRest:true},
        {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}}]},
      result:(stars)=>stars>=3?"Three balanced measures — silence placed with style!":null }
  ],
  practiceIntro:"20 practice questions — the eighth rest, its ½ beat, and counting through quick silences. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{kind:"rest", values:["w","h","q","8"], ask:"name"}, count:3 },
    { gen:"note-value", params:{kind:"rest", values:["w","h","q","8"], ask:"beats"}, count:3 },
    { gen:"note-value", params:{values:["8","q","h"], ask:"beats"}, count:2 },
    { gen:"measure-complete", params:{beats:4, rests:true}, count:2 },
    { type:"mc", q:"An eighth rest lasts…", choices:["½ beat of silence","1 beat of silence","½ beat of sound"], answer:0,
      explain:"Half a beat, perfectly quiet." },
    { type:"truefalse", q:"An eighth rest looks like a little 7 with a dot.", answer:true,
      explain:"The quickest silence has the quirkiest shape." },
    { type:"truefalse", q:"An eighth rest lasts as long as an eighth note.", answer:true,
      explain:"Twins — same length, one silent." },
    { type:"mc", q:"During an eighth rest you…", choices:["keep counting, play nothing","stop counting","play quietly"], answer:0,
      explain:"The count never stops — not even for half a beat." },
    { type:"truefalse", q:"You can tell a rest from a note because a rest has no notehead on a line or space.", answer:true,
      explain:"No notehead = no pitch = silence." },
    { type:"mc", q:"Eighth note + eighth rest together last…", choices:["1 beat","½ beat","2 beats"], answer:0,
      explain:"½ + ½ = 1 full beat — half sound, half silence." },
    { type:"truefalse", q:"Rests count toward filling a measure.", answer:true,
      explain:"Beats are beats — sounding or silent." },
    { type:"mc", q:"Which is the SHORTEST rest you know?", choices:["Eighth rest","Quarter rest","Half rest"], answer:0,
      explain:"½ beat — the quickest breath in music." },
    { type:"truefalse", q:"“1-and-2-(and)” means the second “and” is silent.", answer:true,
      explain:"Parentheses = keep counting, skip the sound." },
    { type:"mc", q:"Why do composers use eighth rests?", choices:["for crisp, quick silences inside the beat","to slow the music down","to save ink"], answer:0,
      explain:"Tiny gaps make rhythms sparkle and dance." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Fill in the correct number: ____ eighth rests = 1 quarter rest.", choices:["2","3","4"], answer:0, explain:"½ + ½ = 1 beat." },
    { type:"mc", q:"In 4/4 time, ____ eighth rests = 1 whole rest.", choices:["8","4","6"], answer:0, explain:"8 × ½ = 4 beats." }
  ],
  miaQuizIntro:"Quiz time! Count through every silence — even the half-beat ones!",
  quiz:[
    { type:"mc", q:"How long does an eighth rest last?", choices:["¼ beat","½ beat","1 beat","2 beats"], answer:1,
      explain:"Half a beat of silence.", hint:"Same as its twin note." },
    { type:"truefalse", q:"An eighth rest lasts one-half beat.", answer:true,
      explain:"½ beat — the eighth note's silent twin.", hint:"Twins match." },
    { type:"mc", q:"The eighth rest is the silent twin of the…", choices:["quarter note","eighth note","half note"], answer:1,
      explain:"Same ½-beat length, zero sound.", hint:"Match the name." },
    { type:"mc", q:"Which symbol is the EIGHTH REST?",
      staff:{clef:"treble",notes:[{rest:"q",label:"1"},{rest:"8",label:"2"},{p:"B4",d:"8",label:"3"},{rest:"h",label:"4"}],width:400},
      choices:["1","2","3","4"], answer:1,
      explain:"The little 7 with a dot. (1 = quarter rest, 3 = eighth NOTE, 4 = half rest.)",
      hint:"Find the tiny seven." },
    { type:"truefalse", q:"You stop counting during an eighth rest.", answer:false,
      explain:"Never — the count runs straight through: 1-and-2-(and).", hint:"The golden rule of rests." },
    { type:"mc", q:"Eighth note + eighth rest =", choices:["1 full beat","½ beat","1½ beats"], answer:0,
      explain:"½ + ½ = 1.", hint:"Add the halves." },
    { type:"mc", q:"Which rest matching is correct?",
      choices:["Whole → 4 · Half → 2 · Quarter → 1 · Eighth → ½",
               "Whole → 2 · Half → 1 · Quarter → ½ · Eighth → ¼",
               "Whole → 8 · Half → 4 · Quarter → 2 · Eighth → 1"], answer:0,
      explain:"Rests mirror their twin notes exactly.", hint:"The halving family again." },
    { type:"truefalse", q:"A single eighth NOTE and an eighth REST look identical.", answer:false,
      explain:"The note has a notehead on the staff; the rest is the floating 7.", hint:"Look for the notehead." },
    { type:"mc", q:"How many eighth rests fill one beat of silence?", choices:["2","4","8"], answer:0,
      explain:"½ + ½ = 1 beat.", hint:"Two halves." },
    { type:"mc", q:"In “1-and-2-(and)”, the parentheses mean…", choices:["a silent half-beat","play louder","repeat"], answer:0,
      explain:"Count it, don't play it.", hint:"Lesson 9's notation, now with half-beats." },
    { type:"truefalse", q:"This measure is complete.",
      staff:{clef:"treble",time:"4/4",notes:[{p:"B4",d:"q"},{rest:"8"},{p:"B4",d:"8"},{p:"B4",d:"h"},{bar:"final"}],width:380},
      answer:true,
      explain:"1 + ½ + ½ + 2 = 4 — rests count too!", hint:"Add every symbol." },
    { type:"mc", q:"Which statement is correct?",
      choices:["An eighth rest lasts one full beat","You keep counting through an eighth rest","An eighth rest makes the next note louder","Eighth rests appear only at the ends of pieces"], answer:1,
      explain:"Count through EVERY silence — that's what keeps rhythm alive.",
      hint:"The rule that never changes." },
    /* generated */
    { gen:"note-value", params:{kind:"rest", values:["w","h","q","8"], ask:"beats"}, count:3 },
    { gen:"measure-complete", params:{beats:4, rests:true}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"In time signatures with 4 as the bottom number, it receives ½ beat of silence.", term:"Eighth Rest", staff:{clef:"none",notes:[{rest:"8"}],width:140}},
    {def:"In time signatures with 4 as the bottom number, it receives ½ beat.", term:"Eighth Note", staff:{clef:"none",notes:[{p:"B4",d:"8"}],width:140}},
    {def:"Each note value has a matching rest of exactly the same length.", term:"Silent Twin Rule"}
  ],
  mistakes:[],
  summary:[
    "✔ Eighth rest = <b>½ beat of silence</b> — the little 7 with a dot.",
    "✔ It's the <b>silent twin</b> of the eighth note.",
    "✔ <b>Keep counting</b> through every rest: 1-and-2-(and).",
    "✔ Rests <b>count toward the measure total</b> — ½ is ½.",
    "✔ Rest family: whole 4 · half 2 · quarter 1 · eighth ½."
  ],
  tips:[
    "Practice “1-and-2-(and)” slowly — whisper the silent “and” until it feels natural.",
    "Off-beat rhythms (rest ON the beat, note on “and”) are pop music's favorite trick!",
    "No notehead on a line or space? Then it's silence — don't play it.",
    "\u{1F3AF} Next lesson: the dot returns — this time on the QUARTER note. Long–short rhythm ahead!"
  ],
  rewards:{ badge:"Eighth Rest Expert", icon:"\u{1F910}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — you honored every half-beat of silence! The dotted quarter is next. \u{1F910}\u{1F389}",
  miaPass:"You passed! The quickest rest in music is under control. Review below or retry for the clean sweep.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The eighth rest is a half-beat of silence tucked INSIDE the beat — quick gaps that make rhythms crisp.",
      play:()=>{const s=.6;[0,.5,1,1.5,3,3.5].forEach(b=>MFAudio.tone(67,s*.4,b*s));} },
    learn:{ label:"the eighth rest",
      explain:"½ beat of silence, shaped like a little 7. Same length as an eighth note. Count straight through: 1-and-2-(and).",
      hint:"No notehead = silence.",
      play:()=>{const s=.6;MFAudio.tone(67,s*.4,0);MFAudio.click(.5*s,.3);MFAudio.tone(67,s*.4,s);} },
    example:{ label:"the examples",
      explain:"Example 1 puts the rests ON the beats — the notes sneak in on the “and”s. Count out loud to feel it." },
    game:{ label:"the games",
      explain:"Name all four rests, resist tapping the half-silences, sort notes from rests, and compose with quick gaps.",
      hint:"In the tap game: extra taps during rests count against you!" },
    quiz:{ label:"this question",
      explain:"Eighth rest = ½ silent beat, twin of the eighth note, and the count NEVER stops.",
      play:()=>{MFAudio.tone(71,.25,0);MFAudio.click(.35,.3);MFAudio.tone(71,.25,.7);} }
  }
};
