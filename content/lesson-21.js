/* Lesson 21 — D.C., D.S., Coda and Fine (AEMT Book 1, Unit 5)
   Built from drafts/UNIT 5 – Lesson 21.md.
   QA note honored: symbols introduced ONE at a time, then combined into complete
   roadmaps with follow-the-path interaction and highlighted playback.
   NOTE: edit by FULL-FILE REWRITE only. */

/* where-do-you-go drill (unique L21 prefix) */
function MF_L21_whereGo(container,fb){
  const rounds=[
    {see:"D.C. (Da Capo)",a:0,why:"Da Capo = “from the head” — back to the BEGINNING."},
    {see:"D.S. (Dal Segno)",a:1,why:"Dal Segno = “from the sign” — back to the SEGNO \u{1D10B}-style symbol."},
    {see:"Fine",a:2,why:"Fine = “the end” — STOP here."},
    {see:"To Coda ➔",a:3,why:"Jump to the CODA — the special ending section."}];
  const OPTS=["The beginning","The Segno sign","Stop — this is the end","The Coda section"];
  let i=0;
  container.innerHTML=`<div class="big-q wg-q" style="text-align:center;min-height:56px"></div>
    <div class="choices wg-ch"></div>`;
  const q=container.querySelector(".wg-q"), ch=container.querySelector(".wg-ch");
  OPTS.forEach((o,oi)=>{ const b=document.createElement("button"); b.textContent=o;
    b.onclick=()=>{
      const cur=rounds[i];
      if(oi===cur.a){ MFAudio.yay(); i++;
        if(i>=rounds.length){ ch.style.display="none"; q.textContent="GPS calibrated!";
          fb(true,"✓ Beginning, Sign, Stop, Special ending — all four destinations locked in!"); }
        else { fb(true,"✓ "+cur.why+" Next sign…"); ask(); } }
      else { MFAudio.tone(40,.25); fb(false,cur.why); }
    };
    ch.appendChild(b); });
  function ask(){ q.innerHTML=`Sign ${i+1} of ${rounds.length}: you see <b>${rounds[i].see}</b>. Where do you go?`; }
  ask();
}

/* four-roadmap-case player (instructor's design: measures lettered A-D, no notes) */
function MF_L21_case(container,fb,cfg){
  let played=false;
  container.innerHTML=`<div class="c21-staff"></div>
    <div style="text-align:center"><button class="play c21-play">▶ Follow the route</button></div>
    <div class="big-q c21-q" style="text-align:center;min-height:30px"></div>
    <div class="choices c21-ch" style="display:none"></div>`;
  const api=Staff.render(container.querySelector(".c21-staff"),{clef:"treble",time:"4/4",notes:cfg.items,width:470});
  const ch=container.querySelector(".c21-ch"), q=container.querySelector(".c21-q");
  [cfg.answer,...cfg.wrong].sort(()=>Math.random()-.5).forEach(o2=>{
    const b=document.createElement("button"); b.textContent=o2;
    b.onclick=()=>{
      if(!played){ fb(false,"Play the route first and follow the highlight!"); return; }
      if(o2===cfg.answer) fb(true,"✓ "+cfg.explain);
      else fb(false,"Follow the signs once more — "+cfg.explain);
    };
    ch.appendChild(b);
  });
  container.querySelector(".c21-play").onclick=()=>{
    const LP={A:60,B:64,C:67,D:72}, step=1.0;
    cfg.route.forEach((idx,k)=>{
      const L=cfg.items[idx].letter;
      MFAudio.tone(LP[L]||60,step*.9,k*step,.45);
      setTimeout(()=>{ api.highlight(idx); q.textContent="Playing: "+cfg.route.slice(0,k+1).map(x=>cfg.items[x].letter).join("–"); },k*step*1000);
    });
    setTimeout(()=>{ api.highlight(null); played=true; ch.style.display="";
      q.textContent="Now — what was the performance order?"; },cfg.route.length*step*1000+250);
  };
}

LESSON_CONTENT[21]={
  welcome:"Grab the map — music has GPS! \u{1F5FA}\u{FE0F}",
  hook:{
    say:"Composers use <b>navigation signs</b> — special symbols that tell musicians <b>where to go next: when to repeat, and where to finish</b>. \u{1F447} <b>What would you guess “Fine” (FEE-neh) means?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div class="choices hk-ch"><button>\u{1F6D1} “The end” — stop here</button><button>“Play finely and delicately”</button><button>“Speed up”</button></div>`;
        const ch=container.querySelector(".hk-ch");
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Fine is Italian for THE END — the stop sign of the musical map. Today you'll learn the whole GPS!");
          else fb(false,"It's Italian, not English — think of “finish”…");
        });
      } }
  },
  objectives:[
    "Identify D.C., D.S., Fine and Coda",
    "Explain what each roadmap marking means",
    "Recognize the Segno and Coda symbols",
    "Follow musical repeat directions correctly",
    "Read simple musical roadmaps",
    "Perform music in the correct order"
  ],
  steps:[
    { say:"Four road signs run the musical map. \u{1F447} <b>Tap each block to reveal what it means:</b>",
      try:{ type:"custom",
        hint:"Tap all four blocks.",
        mount:(container,fb)=>{
          const CODA_SVG='<svg viewBox="0 0 40 40" width="36" height="36" style="display:block;margin:0 auto"><circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" stroke-width="2.2"/><line x1="6" y1="20" x2="34" y2="20" stroke="currentColor" stroke-width="2.2"/></svg>';
          const SEGNO_SVG='<svg viewBox="0 0 40 40" width="24" height="24" style="vertical-align:-6px;margin-left:4px"><path d="M 27 9 C 17 4, 9 10, 14 17 C 17 21, 23 19, 26 23 C 31 30, 23 36, 13 31" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><line x1="9" y1="35" x2="31" y2="5" stroke="currentColor" stroke-width="2.2"/><circle cx="6" cy="25" r="2.6" fill="currentColor"/><circle cx="34" cy="15" r="2.6" fill="currentColor"/></svg>';
          const DATA=[
            ["D.C.","Da Capo","Repeat from the beginning"],
            ["D.S.","Dal Segno","Repeat from the segno sign"+SEGNO_SVG],
            ["Fine","Fine","The end"],
            [CODA_SVG,"Coda","Skip to the coda, which is an added ending"]];
          const opened=new Set();
          container.innerHTML=`<div class="rb-grid" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"></div>
            <div class="rb-out" style="margin-top:12px"></div>`;
          const grid=container.querySelector(".rb-grid"), out=container.querySelector(".rb-out");
          DATA.forEach(([sign,name,meaning],i)=>{
            const b=document.createElement("button");
            b.className="notecard";
            b.style.cssText="border-radius:10px;padding:14px 10px;min-width:110px;min-height:76px";
            b.innerHTML=`<div style="font-size:1.3rem;font-weight:800;font-style:italic">${sign}</div>`;
            b.onclick=()=>{
              if(opened.has(i)) return;
              opened.add(i); MFAudio.tone(64+i*3,.3);
              b.style.borderColor="var(--primary)";
              const line=document.createElement("div");
              line.className="explain"; line.style.display="block"; line.style.marginTop="8px";
              line.innerHTML=`<b>${i+1}. ${i===3?"\u2295":sign.replace(/<[^>]+>/g,"")||"Coda"}</b> \u2014 <b>${name}</b> \u2014 ${meaning}`;
              out.appendChild(line);
              if(opened.size===DATA.length)
                fb(true,"\u2713 All four signs revealed \u2014 now see each one in action below.");
            };
            grid.appendChild(b);
          });
        } } },
    { say:"<b>Case 1 — D.C. al Fine.</b> Steps: \u2460 play through to the end \u2461 return to the BEGINNING \u2462 play to <b>Fine</b> and stop. Each measure below is lettered instead of notated. \u{1F447} <b>Follow the route, then name the order:</b>",
      try:{ type:"custom",
        hint:"Through the whole line first — D.C. only acts when you reach it.",
        mount:(container,fb)=>MF_L21_case(container,fb,{
          items:[{letter:"A"},{bar:"single"},{letter:"B"},{mark:"fine"},{bar:"final"},{letter:"C"},{bar:"single"},{letter:"D"},{mark:"dc-fine"},{bar:"double"}],
          route:[0,2,5,7,0,2], answer:"A–B–C–D–A–B",
          wrong:["A–B–C–D","A–B–A–B–C–D"],
          explain:"Play A-B-C-D, Da Capo to the beginning, and stop at Fine: A–B–C–D–A–B."}) } },
    { say:"<b>Case 2 — D.S. al Fine.</b> Same idea, but return to the <b>Segno</b> \u{1D10B} instead of the beginning, then stop at Fine. \u{1F447} <b>Follow the route, then name the order:</b>",
      try:{ type:"custom",
        hint:"The Segno sits over B — that's where the return lands.",
        mount:(container,fb)=>MF_L21_case(container,fb,{
          items:[{letter:"A"},{bar:"single"},{mark:"segno"},{letter:"B"},{mark:"fine"},{bar:"final"},{letter:"C"},{bar:"single"},{letter:"D"},{mark:"ds-fine"},{bar:"double"}],
          route:[0,3,6,8,3], answer:"A–B–C–D–B",
          wrong:["A–B–C–D–A–B","A–B–C–D"],
          explain:"Play A-B-C-D, return to the SEGNO (B), and stop at Fine: A–B–C–D–B."}) } },
    { say:"<b>Case 3 — D.C. al Coda.</b> Return to the beginning, play until <b>To Coda</b> \u2295, then JUMP to the <b>Coda</b>. \u{1F447} <b>Follow the route, then name the order:</b>",
      try:{ type:"custom",
        hint:"On the second trip, A ends at the To-Coda sign — leap!",
        mount:(container,fb)=>MF_L21_case(container,fb,{
          items:[{letter:"A"},{mark:"tocoda"},{bar:"single"},{letter:"B"},{bar:"single"},{letter:"C"},{mark:"dc-coda"},{bar:"double"},{mark:"coda"},{letter:"D"},{bar:"final"}],
          route:[0,3,5,0,9], answer:"A–B–C–A–D",
          wrong:["A–B–C–D","A–B–C–A–B–D"],
          explain:"Play A-B-C, Da Capo to A, jump at To-Coda to the Coda (D): A–B–C–A–D."}) } },
    { say:"<b>Case 4 — D.S. al Coda.</b> Return to the <b>Segno</b>, play until <b>To Coda</b>, then jump to the <b>Coda</b>. \u{1F447} <b>Follow the route, then name the order:</b>",
      try:{ type:"custom",
        hint:"Return lands on B; B ends at the To-Coda sign.",
        mount:(container,fb)=>MF_L21_case(container,fb,{
          items:[{letter:"A"},{bar:"single"},{mark:"segno"},{letter:"B"},{mark:"tocoda"},{bar:"single"},{letter:"C"},{mark:"ds-coda"},{bar:"double"},{mark:"coda"},{letter:"D"},{bar:"final"}],
          route:[0,3,6,3,10], answer:"A–B–C–B–D",
          wrong:["A–B–C–A–D","A–B–C–D–B"],
          explain:"Play A-B-C, Dal Segno to B, jump at To-Coda to the Coda (D): A–B–C–B–D."}) } },
    { say:"Where do you go? Test every sign. \u{1F447}",
      try:{ type:"custom",
        hint:"Beginning \u00b7 Sign \u00b7 Stop \u00b7 Special ending.",
        mount:(container,fb)=>MF_L21_whereGo(container,fb) } }
  ],
  examples:[
    { caption:"D.C. al Fine — press play: A-B-C-D, back to the top, stop at Fine (A–B–C–D–A–B).",
      staff:{clef:"treble",time:"4/4",tempo:150,notes:[{letter:"A"},{bar:"single"},{letter:"B"},{mark:"fine"},{bar:"final"},{letter:"C"},{bar:"single"},{letter:"D"},{mark:"dc-fine"},{bar:"double"}],
        playOrder:[0,2,5,7,0,2],width:470} },
    { caption:"D.S. al Coda — press play: A-B-C, back to the Segno (B), jump at To-Coda to the Coda (A–B–C–B–D).",
      staff:{clef:"treble",time:"4/4",tempo:150,notes:[{letter:"A"},{bar:"single"},{mark:"segno"},{letter:"B"},{mark:"tocoda"},{bar:"single"},{letter:"C"},{mark:"ds-coda"},{bar:"double"},{mark:"coda"},{letter:"D"},{bar:"final"}],
        playOrder:[0,3,6,3,10],width:470} }
  ],
  games:[
    { type:"term-race", title:"Game 1 · GPS Term Dash",
      intro:"A sign flashes — where does it send you? All the roadmap vocabulary at speed!",
      miaIntro:"Quick — read the road signs! \u{26A1}",
      spec:{rounds:8, pool:[
        ["D.C. (Da Capo)","Return to the beginning"],
        ["D.S. (Dal Segno)","Return to the Segno sign"],
        ["Fine","The end — stop here"],
        ["Coda","A special ending section"],
        ["Segno","The bookmark symbol D.S. returns to"],
        ["To Coda","The jump point — leap to the Coda"],
        ["D.C. al Fine","From the beginning, stop at Fine"]]},
      result:(score)=>score>=7?"Roadmap vocabulary — navigation ready!":null },
    { type:"symbol-hunt", title:"Game 2 · Landmark Hunt",
      intro:"Segno, Coda, Fine, repeat signs — click the landmark Mia names!",
      miaIntro:"Find each landmark on the map! \u{1F50D}",
      spec:{rounds:6, pool:[
        {label:"Segno", spec:{clef:"treble",notes:[{mark:"segno"}]}},
        {label:"Coda symbol", spec:{clef:"treble",notes:[{mark:"coda"}]}},
        {label:"Fine", spec:{clef:"treble",notes:[{mark:"fine"}]}},
        {label:"D.C. al Fine", spec:{clef:"treble",notes:[{mark:"dc-fine"}]}},
        {label:"Repeat Sign", spec:{clef:"treble",notes:[{bar:"repeat-end"}]}}]},
      result:(score)=>score>=5?"Every landmark spotted from a distance!":null },
    { type:"order-tap", title:"Game 3 · The D.S. al Coda Run",
      intro:"The trickiest route: tap the D.S. al Coda journey in perfect order!",
      miaIntro:"Advanced navigation — sign to coda! \u{1F3C1}",
      spec:{title:"Run the D.S. al Coda route in order!",
        sequence:["Play A","Play B (the Segno sits here)","Play C — see “D.S. al Coda”","Return to the Segno: play B","At “To Coda” — jump!","Play the Coda: D"]},
      result:(stars)=>stars>=3?"D.S. al Coda — the expert route, aced!":null },
    { type:"term-race", title:"Game 4 · Reverse GPS (45s)",
      intro:"Mia names the destination, YOU name the sign — 45 seconds on the clock!",
      miaIntro:"Final sprint — destinations to signs! \u{23F1}",
      spec:{seconds:45, reverse:true, pool:[
        ["D.C.","Return to the beginning"],
        ["D.S.","Return to the Segno sign"],
        ["Fine","The end — stop here"],
        ["Coda","A special ending section"],
        ["To Coda","The jump point to the special ending"]]},
      result:(score)=>score>=11?score+" — instant sign recall!":null }
  ],
  practiceIntro:"20 practice questions — the four signs, the two symbols, and complete journeys. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"roadmap marking", pool:[["D.C. (Da Capo)","Return to the beginning"],["D.S. (Dal Segno)","Return to the Segno sign"],["Fine","The end — stop here"],["Coda","A special ending section"],["Segno","The bookmark D.S. returns to"],["To Coda","Jump to the Coda"]], reverse:true}, count:8 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"Da Capo literally means…", choices:["“from the head” (the beginning)","“from the sign”","“the end”"], answer:0,
      explain:"Capo = head — the top of the piece." },
    { type:"mc", q:"Dal Segno means…", choices:["“from the sign”","“from the beginning”","“jump to the end”"], answer:0,
      explain:"Segno = sign — return to the bookmark." },
    { type:"truefalse", q:"Fine marks where the piece truly ends.", answer:true,
      explain:"When directed there, you STOP at Fine." },
    { type:"truefalse", q:"The Coda is a special ending section.", answer:true,
      explain:"You JUMP to it when the map says so." },
    { type:"mc", q:"D.C. al Fine means…", choices:["back to the beginning, stop at Fine","back to the Segno, jump to the Coda","repeat the last measure"], answer:0,
      explain:"From the top, until the stop sign." },
    { type:"mc", q:"D.C. al Coda means…", choices:["back to the start, play to “To Coda,” then jump to the Coda","stop immediately","play the Coda twice"], answer:0,
      explain:"Restart, reach the jump point, leap to the special ending." },
    { type:"truefalse", q:"The Segno symbol looks like an S with a slash and two dots.", answer:true,
      explain:"S for Segno — your musical bookmark." },
    { type:"truefalse", q:"These roadmap signs exist so composers don't have to write the same music twice.", answer:true,
      explain:"Just like repeat signs — but with more powerful jumps." }
  ],
  miaQuizIntro:"Quiz time! Read every sign before you turn — GO!",
  quiz:[
    { type:"mc", q:"What does Fine mean?", choices:["Repeat","Beginning","The end","Play louder"], answer:2,
      explain:"Italian for “the end” — stop there when directed.", hint:"\u{1F6D1}" },
    { type:"mc", q:"What does Da Capo (D.C.) tell you to do?", choices:["Go to the Coda","Go to the Segno","Return to the beginning","Stop playing"], answer:2,
      explain:"From the head — the very start.", hint:"\u{1F3E0}" },
    { type:"mc", q:"What does Dal Segno (D.S.) mean?", choices:["Go to the beginning","Go to the Segno sign","Repeat the last measure","Skip to the end"], answer:1,
      explain:"Return to the bookmark symbol.", hint:"\u{1F516}" },
    { type:"truefalse", q:"A Coda is a special ending section.", answer:true,
      explain:"The finish-flag section you jump to.", hint:"\u{1F3C1}" },
    { type:"truefalse", q:"Fine means to continue playing.", answer:false,
      explain:"Fine = STOP — the end.", hint:"The stop sign." },
    { type:"truefalse", q:"D.C. means to return to the beginning.", answer:true,
      explain:"Da Capo — from the head.", hint:"Capo = head." },
    { type:"mc", q:"Which marking sends you back to the SEGNO sign?", choices:["D.C.","D.S.","Fine","Coda"], answer:1,
      explain:"Dal Segno — from the sign.", hint:"S for Segno." },
    { type:"mc", q:"Which matching is correct?",
      choices:["D.C. → beginning · D.S. → Segno · Fine → end · Coda → special ending",
               "D.C. → Segno · D.S. → end · Fine → beginning · Coda → repeat",
               "D.C. → Coda · D.S. → beginning · Fine → special ending · Coda → end"], answer:0,
      explain:"Home, bookmark, stop sign, finish flag.", hint:"\u{1F3E0}\u{1F516}\u{1F6D1}\u{1F3C1}" },
    { type:"mc", q:"The Italian word Fine means ____.", choices:["the end","the sign","again"], answer:0,
      explain:"The end.", hint:"Finish." },
    { type:"mc", q:"Da Capo tells you to return to the ____.", choices:["beginning","Segno","Coda"], answer:0,
      explain:"The head of the piece.", hint:"\u{1F3E0}" },
    { type:"mc", q:"Which symbol is the SEGNO?",
      staff:{clef:"treble",notes:[{mark:"segno",label:"1"},{mark:"coda",label:"2"},{mark:"fine",label:"3"}],width:360},
      choices:["1","2","3"], answer:0,
      explain:"The slashed S with dots. (2 = Coda, 3 = Fine.)",
      hint:"S shape." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Fine means repeat from the beginning","D.S. means return to the Segno sign","Coda means stop immediately","D.C. means play louder"], answer:1,
      explain:"Dal Segno = from the sign.", hint:"Check each translation." },
    { type:"mc", q:"Measures A B(Fine) C D(D.C. al Fine): the performance order is…",
      choices:["A–B–C–D–A–B","A–B–C–D","A–B–A–B"], answer:0,
      explain:"Through to the end, back to the beginning, stop at Fine.", hint:"Case 1." },
    { type:"mc", q:"Measures A B(Segno…Fine) C D(D.S. al Fine): the performance order is…",
      choices:["A–B–C–D–B","A–B–C–D–A–B","A–B–C–B–D"], answer:0,
      explain:"Return to the Segno (B), stop at Fine.", hint:"Case 2." },
    { type:"mc", q:"Measures A(To Coda) B C(D.C. al Coda) D(Coda): the performance order is…",
      choices:["A–B–C–A–D","A–B–C–D","A–B–C–A–B–D"], answer:0,
      explain:"Back to the top, jump at To-Coda into the Coda.", hint:"Case 3." },
    { type:"mc", q:"Measures A B(Segno, To Coda) C(D.S. al Coda) D(Coda): the performance order is…",
      choices:["A–B–C–B–D","A–B–C–A–D","A–B–C–D–B"], answer:0,
      explain:"Back to the Segno (B), jump at To-Coda into the Coda.", hint:"Case 4." },
    /* generated */
    { gen:"term-match", params:{subject:"roadmap marking", pool:[["D.C.","Return to the beginning"],["D.S.","Return to the Segno sign"],["Fine","The end — stop here"],["Coda","A special ending section"],["To Coda","Jump to the Coda"]], reverse:true}, count:5 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"Repeat from the beginning.", term:"Da Capo (D.C.)"},
    {def:"Repeat from the sign.", term:"Dal Segno (D.S.)"},
    {def:"The sign that Dal Segno returns to.", term:"Segno", staff:{clef:"none",notes:[{mark:"segno"}],width:140}},
    {def:"The end.", term:"Fine", staff:{clef:"none",notes:[{mark:"fine"}],width:140}},
    {def:"An added ending.", term:"Coda", staff:{clef:"none",notes:[{mark:"coda"}],width:140}}
  ],
  mistakes:[],
  summary:[
    "✔ <b>D.C.</b> = from the <b>beginning</b> \u{1F3E0} · <b>D.S.</b> = from the <b>Segno</b> \u{1F516}.",
    "✔ <b>Fine</b> = the end \u{1F6D1} · <b>Coda</b> = the special ending \u{1F3C1}.",
    "✔ <b>D.C. al Fine</b>: restart, stop at Fine.",
    "✔ <b>D.C./D.S. al Coda</b>: go back, play to “To Coda,” JUMP to the Coda.",
    "✔ Trace the route with your finger BEFORE you play."
  ],
  tips:[
    "Know each sign's destination: D.C. = the beginning, D.S. = the sign \u{1F516}, Fine = stop \u{1F6D1}, Coda = the ending \u{1F3C1}.",
    "In real scores, mark your route with a pencil — every pro does it!",
    "Meet the instruction at the END of the written music — it always sends you somewhere you've been.",
    "\u{1F389} Unit 5 complete! Next: Unit 6 — accidentals! Flats make notes lower…"
  ],
  rewards:{ badge:"Musical GPS Guide", icon:"\u{1F5FA}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT navigation — not one wrong turn on the whole map! Unit 6 awaits. \u{1F5FA}\u{FE0F}\u{1F389}",
  miaPass:"You passed! The musical GPS is calibrated. Review below or run the route once more.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Four signs run music's GPS: D.C. (beginning), D.S. (the Segno sign), Fine (stop), Coda (special ending).",
      play:()=>{[72,67,64,60].forEach((m,k)=>MFAudio.tone(m,.3,k*.3));} },
    learn:{ label:"the roadmap signs",
      explain:"D.C. = beginning; D.S. = Segno; Fine = stop; Coda = jump-to ending. Combined: D.C. al Fine, D.S. al Coda, etc.",
      hint:"Home, bookmark, stop sign, finish flag.",
      play:()=>{[60,64,67,72,67,64,60].forEach((m,k)=>MFAudio.tone(m,.25,k*.25));} },
    example:{ label:"the examples",
      explain:"Example 1 is a real D.C. al Fine — back to the top, stop at Fine. Example 2 is a D.S. al Coda — back to the Segno, then jump to the Coda. Trace each with your finger." },
    game:{ label:"the games",
      explain:"Race the signs, hunt the landmarks, run the expert D.S. al Coda route, and reverse-match under time.",
      hint:"Always know your destination BEFORE you move." },
    quiz:{ label:"this question",
      explain:"Translate first: Capo = head/beginning, Segno = sign, Fine = end, Coda = tail/special ending.",
      play:()=>{MFAudio.tone(60,.3,0);MFAudio.tone(72,.5,.4);} }
  }
};
