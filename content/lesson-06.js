/* Lesson 6 — Note Values (AEMT Book 1, Unit 2)
   Built from the instructor's design document (drafts/UNIT 2 – Lesson 6.md)
   First rhythm lesson: uses staff.js v4 (rests/time-sigs/bars/tempo playback),
   games.js v4 (value-race, rhythm-tap, measure-build), quiz.js v4 (note-value, rhythm-count).
   NOTE: edit by FULL-FILE REWRITE only. */

/* count-the-beats helper (unique L6 prefix: safe for check.html batch load) */
function MF_L6_beatCount(container,fb){
  const rounds=[{d:"w",n:4},{d:"h",n:2},{d:"q",n:1}];
  const NAME={w:"Whole Note",h:"Half Note",q:"Quarter Note"};
  let i=0,played=false;
  container.innerHTML=`<div class="flashcard"><div class="fc-title">\u{1F3B5} Beat counter</div>
    <div class="big-q bc-q" style="text-align:center"></div><div class="bc-staff"></div></div>
    <div style="text-align:center"><button class="play bc-play">▶ Play with the beat</button></div>
    <div class="choices chips bc-ch" style="display:none"></div>`;
  const q=container.querySelector(".bc-q"), st=container.querySelector(".bc-staff"),
        ch=container.querySelector(".bc-ch"), btn=container.querySelector(".bc-play");
  [1,2,4].forEach(n=>{
    const b=document.createElement("button"); b.textContent=n;
    b.onclick=()=>{
      if(!played){ fb(false,"Listen first — press ▶ and count the clicks while the note sounds!"); return; }
      const cur=rounds[i];
      if(n===cur.n){ i++; played=false;
        if(i>=rounds.length){ q.textContent="All three counted!"; st.innerHTML=""; ch.style.display="none"; btn.style.display="none";
          fb(true,"✓ Whole = 4 beats, Half = 2, Quarter = 1. Your ears just proved it!"); }
        else { fb(true,`✓ Yes — the ${NAME[cur.d]} lasted ${cur.n} beat${cur.n>1?"s":""}! Next…`); ask(); } }
      else fb(false,`Count the clicks WHILE the note is still sounding — press ▶ and try again.`);
    };
    ch.appendChild(b);
  });
  function ask(){
    const cur=rounds[i];
    Staff.render(st,{clef:"treble",notes:[{p:"B4",d:cur.d}],width:240});
    q.textContent=`Round ${i+1} of ${rounds.length}: how many beats does this note last?`;
    ch.style.display="none"; btn.style.display="inline-block";
  }
  btn.onclick=()=>{
    const cur=rounds[i], spb=60/80;
    for(let k=0;k<4;k++) MFAudio.click(k*spb,.5,k===0);
    MFAudio.tone(71,cur.n*spb*0.95,0);
    played=true;
    ch.style.display="";
    q.textContent="Count the clicks: how many happen while the note is sounding?";
  };
  ask();
}

LESSON_CONTENT[6]={
  welcome:"Welcome to Unit 2! You can READ notes — now let's make them MOVE. \u{1F3B5}",
  hook:{
    say:"You've learned how to read notes on the staff. Now it's time for something just as important: <b>how long should each note last?</b><br><br>Music tells us <b>what</b> to play AND <b>how long</b> to play it. Press the button — same pitch, but something changes. What is it?",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Two sounds</button></div>
          <div class="choices hk-ch" style="display:none">
          <button>The pitch changed</button><button>The LENGTH changed</button><button>Nothing changed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          MFAudio.tone(71,.4,0); MFAudio.tone(71,2.4,1.0);
          setTimeout(()=>{ ch.style.display=""; },3600);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ Exactly — same note, different DURATION. That's what note values are all about!");
          else fb(false,"Listen again — both sounds are the same pitch. What's different is how LONG the second one lasts.");
        });
      } }
  },
  objectives:[
    "Identify Whole Notes, Half Notes, and Quarter Notes",
    "Explain what duration means",
    "Identify the notehead and stem",
    "Count 4, 2, and 1 beat note values",
    "Draw stems in the correct direction",
    "Build simple rhythmic patterns"
  ],
  steps:[
    /* Step 1 — the three note values: listen & compare (Activity 1) */
    { say:"Before we begin, here's something important.<br>In this lesson, we'll use <b>4/4 Time</b> to learn note values.<br>In 4/4 Time:<br>• 1 Whole Note = <b>4 beats</b><br>• 1 Half Note = <b>2 beats</b><br>• 1 Quarter Note = <b>1 beat</b><br>You'll learn more about the Time Signature in Lesson 8.<br><br>Meet today's three notes.<br>The <b>Whole Note</b> has a hollow notehead with no stem and lasts the longest.<br>Add a stem and you get the <b>Half Note</b>.<br>Fill in the note head and you get the <b>Quarter Note</b>.<br>\u{1F447} <b>Click each note and compare how long each sound lasts:</b>",
      try:{ type:"custom",
        hint:"Hollow + no stem = longest. Filled + stem = shortest.",
        mount:(container,fb)=>{
          const items=[{d:"w",n:1,w:150,name:"1 Whole Note",beats:4,rel:"= 2 Half Notes = 4 Quarter Notes",relSay:"one sound filling the whole measure"},{d:"h",n:2,w:170,name:"2 Half Notes",beats:2,rel:"= 1 Whole Note",relSay:"two sounds sharing the same time as one Whole"},{d:"q",n:4,w:210,name:"4 Quarter Notes",beats:1,rel:"= 1 Whole Note",relSay:"four quick sounds — same total time again"}];
          const heard=new Set();
          container.innerHTML=`<div class="lc-row" style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap"></div>`;
          const row=container.querySelector(".lc-row");
          items.forEach((it,idx)=>{
            if(idx>0){ const eq=document.createElement("div");
              eq.style.cssText="font-size:2.2rem;font-weight:800;color:var(--primary)"; eq.textContent="="; row.appendChild(eq); }
            const card=document.createElement("div");
            card.className="flashcard"; card.style.cursor="pointer"; card.style.textAlign="center";
            card.innerHTML=`<div class="lc-staff"></div><div style="font-weight:800;color:var(--primary)">${it.name}</div>`;
            Staff.render(card.querySelector(".lc-staff"),{clef:"treble",notes:Array.from({length:it.n},()=>({p:"B4",d:it.d})),width:it.w});
            card.onclick=()=>{
              const spb=60/80;
              for(let k=0;k<4;k++) MFAudio.click(k*spb,.4,k===0);
              for(let j=0;j<it.n;j++) MFAudio.tone(71,it.beats*spb*0.95,j*it.beats*spb);
              heard.add(it.d);
              if(heard.size===3) fb(true,"✓ You heard all three — 1 Whole note = 2 Half notes = 4 Quarter notes. Same total time, different slices!");
              else fb(true,`✓ ${it.name}: ${it.relSay}. ${3-heard.size} more to hear…`);
            };
            row.appendChild(card);
          });
        } } },
    /* Step 2 — the pizza (Activity 2) */
    { say:"One <b>Whole Note</b> fills 4 beats. Cut that time in half → two Half Notes (2 beats each). Cut again → four Quarter Notes (1 beat each). The measure stays the same size — you just divide the time differently. \u{1F447} <b>Grab the cutter:</b>",
      try:{ type:"custom",
        hint:"Each cut doubles the number of pieces and halves each piece's length.",
        mount:(container,fb)=>{
          let state=0;
          container.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center">
            <svg class="pz" width="150" height="150" viewBox="0 0 150 150"></svg>
            <div class="pz-staff" style="flex:1;min-width:220px"></div></div>
            <div class="big-q pz-cap" style="text-align:center"></div>
            <div style="text-align:center"><button class="play pz-cut">\u{1F52A} Cut it!</button></div>`;
          const svg=container.querySelector(".pz"), stf=container.querySelector(".pz-staff"),
                cap=container.querySelector(".pz-cap"), btn=container.querySelector(".pz-cut");
          function draw(){
            let cuts="";
            if(state>=1) cuts+=`<line x1="75" y1="8" x2="75" y2="142" stroke="#fff8ee" stroke-width="5"/>`;
            if(state>=2) cuts+=`<line x1="8" y1="75" x2="142" y2="75" stroke="#fff8ee" stroke-width="5"/>`;
            svg.innerHTML=`<circle cx="75" cy="75" r="70" fill="#e8a33d" stroke="#b76e2a" stroke-width="6"/>
              <circle cx="52" cy="55" r="7" fill="#c0392b"/><circle cx="95" cy="48" r="7" fill="#c0392b"/>
              <circle cx="105" cy="92" r="7" fill="#c0392b"/><circle cx="58" cy="100" r="7" fill="#c0392b"/>
              <circle cx="78" cy="72" r="7" fill="#c0392b"/>${cuts}`;
            const specs=[[{p:"B4",d:"w"}],[{p:"B4",d:"h"},{p:"B4",d:"h"}],[{p:"B4",d:"q"},{p:"B4",d:"q"},{p:"B4",d:"q"},{p:"B4",d:"q"}]];
            Staff.render(stf,{clef:"treble",notes:specs[state],width:240});
            cap.textContent=state===0?"1 whole = 1 Whole Note (4 beats)"
              :state===1?"2 halves = 2 Half Notes (2 + 2 = 4 beats)"
              :"4 quarters = 4 Quarter Notes (1 × 4 = 4 beats)";
          }
          btn.onclick=()=>{
            if(state>=2) return;
            state++;
            const spb=60/85;
            if(state===1){ MFAudio.tone(71,2*spb*.9,0); MFAudio.tone(71,2*spb*.9,2*spb); }
            else [0,1,2,3].forEach(k=>MFAudio.tone(71,spb*.9,k*spb));
            draw();
            if(state===2){ btn.style.display="none";
              fb(true,"✓ 1 Whole = 2 Halves = 4 Quarters. Different slices, same total time — that's the secret of rhythm!"); }
            else fb(true,"✓ Two Half Notes! Each gets 2 beats. One more cut…");
          };
          draw();
        } } },
    /* Step 3 — count the beats (Activity 3) */
    { say:"Every piece of music has a steady <b>beat</b> — a pulse, like a heartbeat. A note's value tells you how many beats it fills. \u{1F447} <b>Press play, count the clicks, and answer:</b>",
      try:{ type:"custom",
        hint:"Count ONLY the clicks that happen while the note is still ringing.",
        mount:(container,fb)=>MF_L6_beatCount(container,fb) } },
    /* Step 4 — anatomy + the stem rule (Activity 4) */
    { say:"A note has two parts: the <b>notehead</b> (the oval) and the <b>stem</b> (the line). The Stem Rule: notes <b>below</b> the middle line → stem <b>UP</b> on the right; notes <b>on or above</b> the middle line → stem <b>DOWN</b> on the left. \u{1F447} <b>Which way should each stem point?</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"G4",d:"h",label:"below middle → up"},{p:"B4",d:"h",label:"middle line → down"},{p:"D5",d:"h",label:"above middle → down"}],width:420} },
      try:{ type:"custom",
        hint:"Find the MIDDLE line (line 3, B). Below it = up. On or above it = down.",
        mount:(container,fb)=>{
          const rounds=[{p:"G4",up:true},{p:"D5",up:false},{p:"E4",up:true},{p:"B4",up:false},{p:"C5",up:false}];
          let i=0;
          container.innerHTML=`<div class="big-q sd-q" style="text-align:center"></div><div class="sd-staff"></div>
            <div class="choices sd-ch"><button>⬆ Stem UP (right side)</button><button>⬇ Stem DOWN (left side)</button></div>`;
          const q=container.querySelector(".sd-q"), st=container.querySelector(".sd-staff"), ch=container.querySelector(".sd-ch");
          function ask(){
            Staff.render(st,{clef:"treble",notes:[{p:rounds[i].p,d:"w"}],width:260});
            q.textContent=`Note ${i+1} of ${rounds.length}: if this were a HALF note, which way would the stem go?`;
          }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[i], saidUp=bi===0, ok=saidUp===cur.up;
            if(ok){
              Staff.render(st,{clef:"treble",notes:[{p:cur.p,d:"h"}],width:260});
              MFAudio.tone(MFAudio.midi(cur.p),.5); i++;
              if(i>=rounds.length){ ch.style.display="none"; q.textContent="Stem master!";
                fb(true,"✓ All five! Below the middle line → up-right. On or above → down-left. Music stays tidy on the page."); }
              else { fb(true,`✓ Stem ${cur.up?"UP":"DOWN"} — see it drawn correctly? Next note…`); setTimeout(ask,1000); }
            } else fb(false,`Look at the MIDDLE line (B). This note is ${cur.up?"BELOW it — stem goes UP on the right":"on or ABOVE it — stem goes DOWN on the left"}.`);
          });
          ask();
        } } },
    /* Step 5 (was 6) — read a real rhythm; the build-4-beats composer step was REMOVED at instructor request (Session 15f) — the Four-Beat Builder GAME still covers it */
    { say:"Let's put it together and READ a two-measure rhythm. Follow the highlight and count out loud: <b>1-2, 3, 4 | 1-2-3-4</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Half = hold for 2 counts, quarters = 1 each, whole = all 4.",
        mount:(container,fb)=>{
          const spec={clef:"treble",time:"4/4",tempo:80,
            notes:[{p:"B4",d:"h",label:"1-2"},{p:"B4",d:"q",label:"3"},{p:"B4",d:"q",label:"4"},{bar:"single"},
                   {p:"B4",d:"w",label:"1-2-3-4"},{bar:"final"}],width:420};
          container.innerHTML=`<div class="rr-staff"></div><div style="text-align:center"><button class="play rr-play">▶ Play & follow along</button></div>`;
          const api=Staff.render(container.querySelector(".rr-staff"),spec);
          container.querySelector(".rr-play").onclick=()=>{
            const total=Staff.play(spec,api);
            setTimeout(()=>fb(true,"✓ You just read RHYTHM notation — what to play AND how long. Unit 2 is officially underway!"),total*1000+300);
          };
        } } }
  ],
  examples:[
    { caption:"Four steady Quarter Notes — count “1, 2, 3, 4” with the beat.",
      staff:{clef:"treble",tempo:85,time:"4/4",notes:[{p:"B4",d:"q",label:"1"},{p:"B4",d:"q",label:"2"},{p:"B4",d:"q",label:"3"},{p:"B4",d:"q",label:"4"},{bar:"final"}],width:380} },
    { caption:"A mixed measure, then a Whole Note: “1-2, 3, 4” then “1-2-3-4” — hear how the long notes RING while the beat keeps ticking.",
      staff:{clef:"treble",tempo:85,time:"4/4",notes:[{p:"B4",d:"h",label:"1-2"},{p:"B4",d:"q",label:"3"},{p:"B4",d:"q",label:"4"},{bar:"single"},{p:"B4",d:"w",label:"1-2-3-4"},{bar:"final"}],width:420} }
  ],
  games:[
    { type:"value-race", title:"Game 1 · Note Value Flash",
      intro:"A note flashes on the staff — name it! Check the head (hollow or filled?) and the stem. 10 rounds.",
      miaIntro:"Game time! Hollow or filled, stem or no stem — how fast can your eyes decide? \u{1F3AE}",
      spec:{rounds:10, ask:"name"},
      result:(score)=>score>=9?"Nine or more — your eyes read note values instantly now!":null },
    { type:"rhythm-tap", title:"Game 2 · Rhythm Tap",
      intro:"Listen to a rhythm, then <b>tap it back in time</b> with the beat. Feel the count-in — 1, 2, 3, 4 — then GO!",
      miaIntro:"Now your HANDS join in — listen, feel the beat, tap it back! \u{1F44F}",
      spec:{tempo:80, rounds:3, patterns:[["q","q","h"],["h","h"],["w"],["q","q","q","q"],["h","q","q"]]},
      result:(score)=>score>=8?"Your taps landed right on the beat — you FEEL note values now, not just see them!":null },
    { type:"measure-build", title:"Game 3 · Four-Beat Builder",
      intro:"A 4/4 measure holds exactly 4 beats — and there are <b>four different ways</b> to fill it with whole, half, and quarter notes. Find them ALL!",
      miaIntro:"Composer hat on! Can you discover every possible four-beat combination? \u{1F3A9}",
      spec:{beats:4, unique:true},
      result:(stars)=>stars>=3?"Every combination found without a single overflow — a true measure master!":null },
    { type:"value-race", title:"Game 4 · 45-Second Beat Challenge",
      intro:"The final challenge: how many BEAT COUNTS can you nail in <b>45 seconds</b>? 1, 2, or 4 — go with your gut!",
      miaIntro:"Last game — beat that clock! \u{23F1}",
      spec:{seconds:45, ask:"beats"},
      result:(score)=>score>=15?score+" in 45 seconds?! Lightning-fast rhythm eyes! \u{1F3C6}":null }
  ],
  practiceIntro:"20 practice questions — note names, beat counts, stem rules, and beat math. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-value", params:{ask:"name"}, count:3 },
    { gen:"note-value", params:{ask:"beats"}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"rhythm-count", params:{values:["w","h","q"],maxNotes:2}, count:2 },
    { type:"truefalse", q:"A Whole Note has a stem.", answer:false,
      explain:"The whole note is just a hollow oval — never a stem." },
    { type:"mc", q:"Which note has a HOLLOW head WITH a stem?", choices:["Whole Note","Half Note","Quarter Note"], answer:1,
      explain:"Hollow + stem = half note (2 beats). Hollow without a stem is the whole note." },
    { type:"mc", q:"The two parts of a half note are the…", choices:["notehead and stem","clef and staff","line and space"], answer:0,
      explain:"Notehead (the oval) + stem (the line) — that's note anatomy." },
    { type:"truefalse", q:"Two Half Notes last as long as one Whole Note.", answer:true,
      explain:"2 + 2 = 4 beats — exactly one whole note." },
    { type:"mc", q:"A note BELOW the middle line gets its stem…", choices:["up, on the right side","down, on the left side","either way"], answer:0,
      explain:"Below the middle line → stem up on the right. That's the stem rule." },
    { type:"mc", q:"A note ON the middle line gets its stem…", choices:["up, on the right side","down, on the left side"], answer:1,
      explain:"On or above the middle line → stem down on the left." },
    { type:"truefalse", q:"Four Quarter Notes fill the same time as one Whole Note.", answer:true,
      explain:"1 × 4 = 4 beats — four quarter notes make one whole." },
    { type:"mc", q:"Duration means…", choices:["how high a note sounds","how long a sound lasts","how loud a note is"], answer:1,
      explain:"Duration = length in time. Note values are music's way of writing duration." },
    { type:"truefalse", q:"The stem direction changes how long a note lasts.", answer:false,
      explain:"Stem direction is only about neat notation — up or down, the duration is identical." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Fill in the correct number: ____ half notes = 1 whole note.", choices:["2","3","4"], answer:0, explain:"2 + 2 = 4 beats." },
    { type:"mc", q:"Fill in the correct number: ____ quarter notes = 1 half note.", choices:["2","3","4"], answer:0, explain:"1 + 1 = 2 beats." },
    { type:"mc", q:"The duration of a half note is ______ than a quarter note.", choices:["longer","shorter"], answer:0, explain:"2 beats versus 1 beat." }
  ],
  miaQuizIntro:"Quiz time! Whole-half-quarter, beats, stems, and beat math — everything you just played with. You're ready!",
  quiz:[
    /* draft Q1–Q12, adapted */
    { type:"mc", q:"In 4/4 time, how many beats does a Whole Note receive?", choices:["1","2","4","8"], answer:2,
      explain:"The whole note fills a whole 4/4 measure — 4 beats.", hint:"It fills the whole measure." },
    { type:"mc", q:"In 4/4 time, how many beats does a Half Note receive?", choices:["1","2","3","4"], answer:1,
      explain:"Half of a whole measure — 2 beats.", hint:"Half of 4 beats." },
    { type:"mc", q:"In 4/4 time, how many beats does a Quarter Note receive?", choices:["1","2","3","4"], answer:0,
      explain:"A quarter of the measure — exactly 1 beat.", hint:"Four of them fill a measure." },
    { type:"truefalse", q:"Two Quarter Notes equal one Half Note.", answer:true,
      explain:"1 + 1 = 2 beats — the same as one half note.", hint:"Add the beats." },
    { type:"truefalse", q:"A Whole Note lasts one beat.", answer:false,
      explain:"It lasts FOUR beats — the longest of today's notes.", hint:"Whole = the whole measure." },
    { type:"mc", q:"Which of these is the HALF NOTE?",
      staff:{clef:"treble",notes:[{p:"B4",d:"w",label:"1"},{p:"B4",d:"q",label:"2"},{p:"B4",d:"h",label:"3"}],width:300},
      choices:["1","2","3"], answer:2,
      explain:"Note 3 has a hollow head WITH a stem — the half note. (1 = whole, 2 = quarter.)",
      hint:"Hollow head + stem." },
    { type:"mc", q:"Which matching is correct?",
      choices:["Whole → 4 · Half → 2 · Quarter → 1","Whole → 2 · Half → 4 · Quarter → 1","Whole → 4 · Half → 1 · Quarter → 2"], answer:0,
      explain:"Whole 4, half 2, quarter 1 — each cut halves the value.", hint:"Whole → half → quarter: halve each time." },
    { type:"mc", q:"In 4/4 time, a Whole Note lasts ____ beats.", choices:["1","2","3","4"], answer:3,
      explain:"Four — it fills the entire 4/4 measure.", hint:"Its name says it all." },
    { type:"mc", q:"This note sits BELOW the middle line. Which way should its stem point?",
      staff:{clef:"treble",notes:[{p:"G4",d:"w"}],width:240},
      choices:["Up, on the right","Down, on the left"], answer:0,
      explain:"Below the middle line → stem up on the right side.", hint:"Where is line 3?" },
    { type:"mc", q:"This note sits ON the middle line. Which way should its stem point?",
      staff:{clef:"treble",notes:[{p:"B4",d:"w"}],width:240},
      choices:["Up, on the right","Down, on the left"], answer:1,
      explain:"On or above the middle line → stem down on the left side.", hint:"Middle line counts as 'high'." },
    { type:"mc", q:"Which combination fills one 4/4 measure with EXACTLY 4 beats?",
      choices:["Half + Quarter","Quarter + Quarter + Half","Half + Half + Quarter"], answer:1,
      explain:"1 + 1 + 2 = 4. (Half + quarter = only 3; half + half + quarter = 5, too many.)",
      hint:"Add each combination — which one totals 4?" },
    { type:"mc", q:"Which symbol does NOT represent a note value?",
      choices:["Whole Note","Half Note","Quarter Note","Treble Clef"], answer:3,
      explain:"The treble clef tells you PITCH names — it says nothing about duration.",
      hint:"Which one is about WHERE notes sit, not HOW LONG they last?" },
    /* generated — fresh every attempt */
    { gen:"note-value", params:{ask:"name"}, count:2 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"The length of time a note is held.", term:"Duration"},
    {def:"The steady, even pulse of the music.", term:"Beat"},
    {def:"An open notehead with no stem. In time signatures with 4 as the bottom number, it receives 4 beats.", term:"Whole Note", staff:{clef:"none",notes:[{p:"B4",d:"w"}],width:140}},
    {def:"An open notehead with a stem. In time signatures with 4 as the bottom number, it receives 2 beats.", term:"Half Note", staff:{clef:"none",notes:[{p:"B4",d:"h"}],width:140}},
    {def:"A filled-in notehead with a stem. In time signatures with 4 as the bottom number, it receives 1 beat.", term:"Quarter Note", staff:{clef:"none",notes:[{p:"B4",d:"q"}],width:140}}
  ],
  mistakes:[
    "<b>Mixing up half and quarter notes</b> — check the head first: hollow = half, filled = quarter.",
    "<b>Giving the whole note a stem</b> — it never has one.",
    "<b>Stems on the wrong side</b> — below the middle line: up-right. On or above: down-left.",
    "<b>Counting every note as 1 beat</b> — values differ; always add them up.",
    "<b>Cutting long notes short</b> — hold a whole note for ALL four beats."
  ],
  summary:[
    "✔ Music tells you <b>what</b> to play AND <b>how long</b>.",
    "✔ In <b>4/4 time</b>: Whole = <b>4</b> beats · Half = <b>2</b> · Quarter = <b>1</b>.",
    "✔ <b>1 whole = 2 halves = 4 quarters</b> — same total time.",
    "✔ A note = <b>notehead + stem</b> (whole notes skip the stem).",
    "✔ Below the middle line → stem <b>up-right</b>; on or above → <b>down-left</b>."
  ],
  tips:[
    "Count OUT LOUD — “1-2-3-4” — while you clap note values. Your voice locks in the beat better than silent counting.",
    "Reading a new note? Ask two questions in order: hollow or filled? stem or no stem?",
    "Today’s counts (4-2-1) come from 4/4 time — the most common. Lesson 8 introduces the time signature itself, and later you’ll meet signatures that count differently!",
    "Long notes are held, not re-played — let the whole note RING while you keep counting.",
    "\u{1F355} Next lesson: measures and bar lines — the boxes that keep all these beats organized!"
  ],
  rewards:{ badge:"Note Value Explorer", icon:"\u{1F3B5}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT score on your very first rhythm lesson?! Whole, half, quarter — consider them mastered. See you at the bar lines! \u{1F3B5}\u{1F389}",
  miaPass:"You passed! Rhythm reading has officially begun. Review below, or push for a perfect run — fresh questions every time.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Notes tell you two things at once: WHICH sound (position on the staff) and HOW LONG (the note's shape). Today is all about the second one — duration.",
      play:()=>{MFAudio.tone(71,.4,0);MFAudio.tone(71,2.2,.9);} },
    learn:{ label:"note values",
      explain:"Whole note: hollow, no stem, 4 beats. Half note: hollow with stem, 2 beats. Quarter note: filled with stem, 1 beat. Stems go up-right below the middle line, down-left on or above it.",
      hint:"Two questions, in order: hollow or filled? stem or no stem?",
      play:()=>{const s=.7;MFAudio.tone(71,4*s*.9,0);MFAudio.tone(71,2*s*.9,4*s);MFAudio.tone(71,2*s*.9,6*s);[0,1,2,3].forEach(k=>MFAudio.tone(71,s*.9,(8+k)*s));} },
    example:{ label:"the examples",
      explain:"Both examples keep the SAME steady beat — only the note values change. Count along: quarters get one count each, the half gets two, the whole gets all four." },
    game:{ label:"the games",
      explain:"Flash-name the values, tap rhythms in time, build 4-beat measures, then beat the 45-second clock.",
      hint:"Whole = 4, half = 2, quarter = 1 — and always feel the steady beat first." },
    quiz:{ label:"this question",
      explain:"Everything comes from three facts: whole = 4 beats (hollow, no stem), half = 2 (hollow + stem), quarter = 1 (filled + stem) — plus the stem rule around the middle line.",
      play:()=>{const s=.55;[0,1].forEach(k=>MFAudio.tone(71,s*.9,k*s));MFAudio.tone(71,2*s*.9,2*s);} }
  }
};
