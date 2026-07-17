/* Lesson 5 — Ledger Lines (low and high notes) (AEMT Book 1, Unit 1)
   v2 — rebuilt from the instructor's design document (drafts/UNIT 1 – Lesson 5.md)
   Final quiz doubles as the Unit 1 review (25 questions; full mastery page = Phase 2).
   NOTE: edit by FULL-FILE REWRITE only. */

/* name-the-note drill (unique L5 prefix: safe for check.html batch load) */
function MF_L5_nameDrill(container,fb,items,doneMsg){
  const order=[...items].sort(()=>Math.random()-.5); let i=0;
  container.innerHTML=`<div class="flashcard"><div class="fc-title">\u{1F3B5} Note card</div><div class="big-q nd-q" style="text-align:center"></div><div class="nd-staff"></div></div><div class="choices chips nd-ch"></div>`;
  const q=container.querySelector(".nd-q"), st=container.querySelector(".nd-staff"), ch=container.querySelector(".nd-ch");
  ["A","B","C","D","E","F","G"].forEach(l=>{
    const b=document.createElement("button"); b.textContent=l;
    b.onclick=()=>{
      const cur=order[i], ok=l===cur.p[0];
      MFAudio.tone(MFAudio.midi(cur.p),.4);
      if(ok){ i++;
        if(i>=order.length){ q.textContent="Complete!"; st.innerHTML=""; ch.style.display="none"; fb(true,doneMsg); }
        else { fb(true,`✓ Yes — ${cur.p[0]}! Next one…`); ask(); } }
      else fb(false,`Not ${l} — start from ${cur.hintFrom||"the nearest staff note"} and count one step at a time.`);
    };
    ch.appendChild(b);
  });
  function ask(){
    const cur=order[i];
    Staff.render(st,{clef:cur.clef,notes:[{p:cur.p,d:"q"}],width:300});
    q.textContent=`Name this note (${i+1} of ${order.length}):`;
  }
  ask();
}

LESSON_CONTENT[5]={
  welcome:"Last lesson of Unit 1! Today music climbs beyond the staff. \u{1F3B5}",
  hook:{
    say:"You've already met <b>Middle C</b>, the first note that uses a ledger line. But what happens when music goes even higher… or much lower?<br><br>Instead of building a bigger staff, musicians simply add <b>ledger lines</b> — extra steps on a ladder that let music climb as high or low as it needs. Let's explore beyond the staff!"
  },
  objectives:[
    "Explain the purpose of ledger lines",
    "Read notes above the Treble Staff using ledger lines",
    "Read notes below the Bass Staff using ledger lines",
    "Draw notes using one, two, or three ledger lines",
    "Recognize patterns in notes that extend beyond the staff",
    "Read extended notes with confidence"
  ],
  steps:[
    /* Section 1 — Why do we need ledger lines? */
    { say:"A five-line staff has limits — some notes sit too high or too low to fit. <b>Ledger lines</b> extend the staff above and below, adding a short line exactly where a note needs one, keeping music neat. \u{1F447} Watch notes climb above the treble staff and sink below the bass staff:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="lw-stage"></div><div style="text-align:center">
            <button class="play lw-up">▲ Climb above the treble</button> <button class="play lw-dn">▼ Sink below the bass</button></div>`;
          const stage=container.querySelector(".lw-stage");
          Staff.render(stage,{clef:"treble",notes:[{p:"F5",d:"w"}],width:340});
          let didUp=false,didDn=false,busy=false;
          function run(up){
            if(busy)return; busy=true;
            const seq=up?[{c:"treble",p:"F5",l:"F — top line"},{c:"treble",p:"G5",l:"G — above the staff"},{c:"treble",p:"A5",l:"A — 1st ledger line!"},{c:"treble",p:"C6",l:"C — 2nd ledger line!"}]
                       :[{c:"bass",p:"G2",l:"G — bottom line"},{c:"bass",p:"F2",l:"F — below the staff"},{c:"bass",p:"E2",l:"E — 1st ledger line!"},{c:"bass",p:"C2",l:"C — 2nd ledger line!"}];
            seq.forEach((s,i)=>setTimeout(()=>{
              Staff.render(stage,{clef:s.c,notes:[{p:s.p,d:"w",label:s.l}],width:340});
              MFAudio.tone(MFAudio.midi(s.p),.5);
              if(i===seq.length-1){ busy=false; if(up)didUp=true; else didDn=true;
                if(didUp&&didDn) fb(true,"✓ Ledger lines extend the staff — up for the high notes, down for the low ones. Same idea in every clef!");
                else fb(true,up?"✓ Ledger lines appeared right when the notes ran out of staff! Now try ▼":"✓ The staff grows downward too! Now try ▲"); }
            }, 400+i*1000));
          }
          container.querySelector(".lw-up").onclick=()=>run(true);
          container.querySelector(".lw-dn").onclick=()=>run(false);
        } } },
    /* Section 2 — Above the treble staff */
    { say:"Above the treble staff the alphabet just keeps going: top line <b>F</b>, then <b>G</b> (space above), <b>A</b> (1st ledger line), <b>B</b>, <b>C</b> (2nd ledger line)… Count EVERY line and EVERY space. \u{1F449} <b>Name these high notes:</b>",
      show:{ type:"staff", spec:{clef:"treble",notes:[{p:"F5",d:"w",label:"F"},{p:"G5",d:"w",label:"G"},{p:"A5",d:"w",label:"A"},{p:"B5",d:"w",label:"B"},{p:"C6",d:"w",label:"C"}],width:420} },
      try:{ type:"custom",
        hint:"Start from the top line F and step up: F→G→A→B→C.",
        mount:(container,fb)=>MF_L5_nameDrill(container,fb,
          [{p:"G5",clef:"treble",hintFrom:"the top line (F)"},{p:"A5",clef:"treble",hintFrom:"the top line (F)"},{p:"B5",clef:"treble",hintFrom:"the top line (F)"},{p:"C6",clef:"treble",hintFrom:"the top line (F)"}],
          "✓ G-A-B-C above the staff — the ladder keeps climbing and the alphabet never breaks!") } },
    /* Section 3 — Below the bass staff */
    { say:"Below the bass staff, same pattern in reverse: bottom line <b>G</b>, then <b>F</b> (space below), <b>E</b> (1st ledger line), <b>D</b>, <b>C</b> (2nd ledger line)… The alphabet never changes. \u{1F449} <b>Name these low notes:</b>",
      show:{ type:"staff", spec:{clef:"bass",notes:[{p:"G2",d:"w",label:"G"},{p:"F2",d:"w",label:"F"},{p:"E2",d:"w",label:"E"},{p:"D2",d:"w",label:"D"},{p:"C2",d:"w",label:"C"}],width:420} },
      try:{ type:"custom",
        hint:"Start from the bottom line G and step DOWN: G→F→E→D→C.",
        mount:(container,fb)=>MF_L5_nameDrill(container,fb,
          [{p:"F2",clef:"bass",hintFrom:"the bottom line (G)"},{p:"E2",clef:"bass",hintFrom:"the bottom line (G)"},{p:"D2",clef:"bass",hintFrom:"the bottom line (G)"},{p:"C2",clef:"bass",hintFrom:"the bottom line (G)"}],
          "✓ F-E-D-C below the staff — you can dig as deep as the music goes!") } },
    /* Section 4 — Drawing ledger-line notes */
    { say:"To WRITE a ledger note: <b>1)</b> add the right number of short lines, <b>2)</b> center each line through the notehead, <b>3)</b> keep them slightly longer than the note — and remember, they belong to that note alone. \u{1F449} <b>Build each note below the bass staff:</b>",
      try:{ type:"custom",
        hint:"E2 sits ON the 1st ledger line below. C2 needs a 2nd line below that.",
        mount:(container,fb)=>{
          const tasks=[{p:"E2",need:1,label:"Write low E — it sits ON the 1st ledger line below the staff"},
                       {p:"C2",need:2,label:"Now write low C — it needs a 2nd ledger line"}];
          let ti=0,added=0;
          container.innerHTML=`<div class="big-q dr-q" style="text-align:center"></div><div class="dr-stage"></div>
            <div style="text-align:center"><button class="play dr-add">➕ Add a ledger line</button>
            <button class="play dr-note">\u{1F3B5} Place the note</button> <button class="ghost dr-reset">↺ Reset</button></div>`;
          const q=container.querySelector(".dr-q"), stage=container.querySelector(".dr-stage");
          let svg=null;
          function draw(){
            Staff.render(stage,{clef:"bass",notes:[],width:340});
            svg=stage.querySelector("svg");
            for(let i=1;i<=added;i++){
              const y=90+i*15, ln=document.createElementNS("http://www.w3.org/2000/svg","line");
              ln.setAttribute("x1",156); ln.setAttribute("x2",184); ln.setAttribute("y1",y); ln.setAttribute("y2",y);
              ln.setAttribute("class","ledger"); ln.setAttribute("stroke","currentColor"); ln.setAttribute("stroke-width","2");
              svg.appendChild(ln);
            }
            q.textContent=tasks[ti].label+` (lines added: ${added})`;
          }
          container.querySelector(".dr-add").onclick=()=>{
            if(added>=3){ fb(false,"That's plenty! Reset if you added too many."); return; }
            added++; MFAudio.tone(45+added,.15,0,.25); draw();
          };
          container.querySelector(".dr-reset").onclick=()=>{ added=0; draw(); };
          container.querySelector(".dr-note").onclick=()=>{
            const t=tasks[ti];
            if(added<t.need){ fb(false,`Not enough lines yet — ${t.p[0]} would float in the air! It needs ${t.need}.`); return; }
            if(added>t.need){ fb(false,`Too many — ${t.p[0]} only needs ${t.need}. Extra lines belong to even lower notes. Reset and retry!`); return; }
            const y=90+t.need*15, el=document.createElementNS("http://www.w3.org/2000/svg","ellipse");
            el.setAttribute("cx",170); el.setAttribute("cy",y); el.setAttribute("rx",9); el.setAttribute("ry",6.5);
            el.setAttribute("class","note hl"); svg.appendChild(el);
            MFAudio.tone(MFAudio.midi(t.p),.7);
            ti++; added=0;
            if(ti>=tasks.length){ q.textContent="Both notes written!";
              fb(true,"✓ E on 1 ledger line, C on 2 — each line centered through the notehead, just slightly wider. You can WRITE beyond the staff now!"); }
            else { fb(true,"✓ Low E, perfectly placed! One more…"); draw(); }
          };
          draw();
        } } },
    /* Section 5 — Finding patterns */
    { say:"Ledger notes aren't random — the alphabet simply repeats: <b>…A B C D E F G A…</b> Recognizing the pattern beats memorizing each note. \u{1F449} <b>Fill in the missing letters:</b>",
      try:{ type:"custom",
        hint:"Say the alphabet from the letter just before the blank — and remember, after G comes A.",
        mount:(container,fb)=>{
          const rounds=[{seq:["F","G","?","B"],a:"A",why:"F-G-A-B — climbing above the treble staff"},
                        {seq:["G","F","?","D"],a:"E",why:"G-F-E-D — sinking below the bass staff"},
                        {seq:["E","F","G","?"],a:"A",why:"after G the alphabet starts over at A!"}];
          let i=0;
          container.innerHTML=`<div class="big-q pt-q" style="text-align:center"></div>
            <div class="pt-seq" style="text-align:center;font-size:1.6rem;font-weight:700;letter-spacing:10px;margin:10px 0"></div>
            <div class="choices chips pt-ch"></div>`;
          const q=container.querySelector(".pt-q"), sq=container.querySelector(".pt-seq"), ch=container.querySelector(".pt-ch");
          ["A","B","C","D","E","F","G"].forEach(l=>{
            const b=document.createElement("button"); b.textContent=l;
            b.onclick=()=>{
              const cur=rounds[i];
              if(l===cur.a){ i++;
                MFAudio.tone(MFAudio.midi(l==="A"||l==="B"?l+"3":l+"4"),.35);
                if(i>=rounds.length){ sq.textContent="…A B C D E F G A B C…"; ch.style.display="none"; q.textContent="Pattern mastered!";
                  fb(true,"✓ The alphabet never changes — above, below, anywhere. Trust the pattern!"); }
                else { fb(true,`✓ ${l} — ${cur.why}. Next pattern…`); ask(); } }
              else fb(false,"Say the letters aloud from the start of the pattern — which one is missing?");
            };
            ch.appendChild(b);
          });
          function ask(){ sq.textContent=rounds[i].seq.join(" "); q.textContent=`Pattern ${i+1} of ${rounds.length}: what replaces the “?”`; }
          ask();
        } } },
    /* Section 6 — Reading faster with landmarks */
    { say:"Speed secret: don't count from zero every time. <b>Find the nearest landmark</b> — top line F5, bottom line G2, or Middle C — and count from THERE. Never guess. \u{1F449} <b>Five quick notes — how fast can you go?</b>",
      try:{ type:"custom",
        hint:"Nearest landmark: top of treble = F. Bottom of bass = G. Between the staffs = Middle C.",
        mount:(container,fb)=>MF_L5_nameDrill(container,fb,
          [{p:"A5",clef:"treble",hintFrom:"the top line (F5)"},{p:"C6",clef:"treble",hintFrom:"the top line (F5)"},{p:"E2",clef:"bass",hintFrom:"the bottom line (G2)"},{p:"C4",clef:"treble",hintFrom:"Middle C's ledger line"},{p:"D2",clef:"bass",hintFrom:"the bottom line (G2)"}],
          "✓ Five extended notes, read like a pro — landmarks make everything faster!") } }
  ],
  examples:[
    { caption:"Climbing above the treble staff: F (top line), G, A, B, C — every step a new line or space.",
      staff:{clef:"treble",notes:[{p:"F5",d:"q",label:"F"},{p:"G5",d:"q",label:"G"},{p:"A5",d:"q",label:"A"},{p:"B5",d:"q",label:"B"},{p:"C6",d:"h",label:"C"}],width:420} },
    { caption:"Sinking below the bass staff: G (bottom line), F, E, D, C — the same ladder, heading down.",
      staff:{clef:"bass",notes:[{p:"G2",d:"q",label:"G"},{p:"F2",d:"q",label:"F"},{p:"E2",d:"q",label:"E"},{p:"D2",d:"q",label:"D"},{p:"C2",d:"h",label:"C"}],width:420} }
  ],
  games:[
    { type:"high-low-staff", title:"Game 1 · High or Low?",
      intro:"A note appears beyond the Grand Staff — is it <b>above the treble</b> or <b>below the bass</b>? Look AND listen. 8 rounds.",
      miaIntro:"Game time! Eyes and ears together — where does each runaway note live? \u{1F3AE}",
      spec:{rounds:8},
      result:(score)=>score>=7?"Seven or more — no note can hide from you, high or low!":null },
    { type:"note-race", title:"Game 2 · Name That Note — Ledger Edition",
      intro:"Ledger-line notes only! Use your landmarks. 10 rounds, no timer.",
      spec:{rounds:10, pool:[
        {p:"G5",clef:"treble"},{p:"A5",clef:"treble"},{p:"B5",clef:"treble"},{p:"C6",clef:"treble"},{p:"C4",clef:"treble"},
        {p:"F2",clef:"bass"},{p:"E2",clef:"bass"},{p:"D2",clef:"bass"},{p:"C2",clef:"bass"}]},
      result:(score)=>score>=9?"Nine or more on pure ledger notes?! Remarkable reading!":null },
    { type:"pattern-fill", title:"Game 3 · Complete the Pattern",
      intro:"A run of letters with one missing — the alphabet never changes, even beyond the staff. 6 rounds.",
      spec:{rounds:6},
      result:(score)=>score>=6?"A perfect pattern-spotter — that's the real secret of fast reading!":null },
    { type:"note-race", title:"Game 4 · Extreme Note Challenge",
      intro:"EVERYTHING from Unit 1 — staff notes, ledger notes, both clefs. Name as many as you can in <b>60 seconds</b>!",
      spec:{seconds:60, pool:[
        {p:"E4",clef:"treble"},{p:"G4",clef:"treble"},{p:"B4",clef:"treble"},{p:"F5",clef:"treble"},{p:"A5",clef:"treble"},{p:"C6",clef:"treble"},{p:"C4",clef:"treble"},
        {p:"G2",clef:"bass"},{p:"B2",clef:"bass"},{p:"D3",clef:"bass"},{p:"A3",clef:"bass"},{p:"E2",clef:"bass"},{p:"C2",clef:"bass"}]},
      result:(score)=>score>=12?score+" notes across the entire Unit 1 range — EXTREME indeed! \u{1F3C6}":null }
  ],
  practiceIntro:"20 practice questions — high ledger notes, low ledger notes, drawing rules, and patterns. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-name", params:{clef:"treble", pool:["G5","A5","B5","C6"]}, count:4 },
    { gen:"note-name", params:{clef:"bass", pool:["F2","E2","D2","C2"]}, count:4 },
    { type:"truefalse", q:"Ledger lines extend the staff.", answer:true,
      explain:"They add temporary lines exactly where a note needs them." },
    { type:"truefalse", q:"Ledger lines can only be used above the staff.", answer:false,
      explain:"Above AND below — high notes and low notes both use them." },
    { type:"mc", q:"Beyond the staff, the musical alphabet…", choices:["changes to new letters","continues exactly the same","stops at G forever"], answer:1,
      explain:"A-B-C-D-E-F-G keeps repeating — no new letters ever appear." },
    { type:"mc", q:"The note ON the 1st ledger line ABOVE the treble staff is…", choices:["G","A","B"], answer:1,
      explain:"Top line F → space G → 1st ledger line A." },
    { type:"mc", q:"The note ON the 1st ledger line BELOW the bass staff is…", choices:["E","F","D"], answer:0,
      explain:"Bottom line G → space F → 1st ledger line E." },
    { type:"truefalse", q:"A ledger line belongs only to the individual note that uses it.", answer:true,
      explain:"It appears for that note and vanishes after — never a permanent staff line." },
    { type:"mc", q:"When drawing a ledger line, it should be…", choices:["much longer than the notehead","slightly longer than the notehead","exactly as wide as the staff"], answer:1,
      explain:"Just slightly wider than the note, centered through it." },
    { type:"truefalse", q:"The ledger line is drawn beside the notehead, not through it.", answer:false,
      explain:"Through the CENTER of the notehead — like a real staff line would be." },
    { type:"mc", q:"The fastest way to read a far-out ledger note is to…", choices:["guess from its general height","count from the nearest landmark note","memorize every possible note"], answer:1,
      explain:"Landmarks (top line, bottom line, Middle C) + careful counting = speed." },
    { type:"mc", q:"How many ledger lines does this note use?", staff:{clef:"treble",notes:[{p:"C6",d:"q"}],width:260}, choices:["1","2","3"], answer:1,
      explain:"A sits on the 1st ledger line, C on the 2nd." },
    { type:"mc", q:"Name this note.", staff:{clef:"bass",notes:[{p:"E2",d:"q"}],width:260}, choices:["C","D","E"], answer:2,
      explain:"Bottom line G, space F, 1st ledger line E." },
    { type:"truefalse", q:"Middle C was the very first ledger-line note you learned.", answer:true,
      explain:"Lesson 4's bridge note — one ledger line between the two staffs. Today you extended the idea in both directions." }
  ],
  miaQuizIntro:"The FINAL quiz of Unit 1 — 25 questions covering everything from Lesson 1 to today. You've earned this moment. Landmarks ready? Go!",
  quiz:[
    /* easy — L5 */
    { type:"truefalse", q:"Ledger lines can extend the staff both above and below.", answer:true,
      explain:"High notes get them above, low notes below.", hint:"Which directions did the notes travel in the animation?" },
    { type:"mc", q:"Why do musicians use ledger lines?", choices:["To decorate difficult passages","To write notes too high or low for the staff","To mark the loudest notes"], answer:1,
      explain:"They temporarily extend the staff so extreme notes stay readable.", hint:"What problem did the five-line staff have?" },
    { type:"mc", q:"Beyond the staff, the musical alphabet…", choices:["continues in the same order","reverses direction","adds the letter H"], answer:0,
      explain:"A-B-C-D-E-F-G, repeating forever — above, below, everywhere.", hint:"Did any new letters ever appear?" },
    { type:"mc", q:"The note ON the 1st ledger line above the treble staff is…", choices:["G","A","B"], answer:1,
      explain:"F (top line) → G (space) → A (1st ledger line).", hint:"Count up from the top line F." },
    { type:"mc", q:"The note ON the 1st ledger line below the bass staff is…", choices:["F","E","D"], answer:1,
      explain:"G (bottom line) → F (space) → E (1st ledger line).", hint:"Count down from the bottom line G." },
    /* generated — ledger reading */
    { gen:"note-name", params:{clef:"treble", pool:["G5","A5","B5","C6"]}, count:3 },
    { gen:"note-name", params:{clef:"bass", pool:["F2","E2","D2","C2"]}, count:3 },
    /* harder — L5 */
    { type:"mc", q:"How many ledger lines does this note use?", staff:{clef:"treble",notes:[{p:"C6",d:"q"}],width:260}, choices:["1","2","3"], answer:1,
      explain:"1st ledger line = A, 2nd = C. Count the short lines one at a time.",
      hint:"Count the short lines below the notehead." },
    { type:"truefalse", q:"A ledger line should be drawn through the center of the notehead.", answer:true,
      explain:"Centered through the note, slightly wider than it — like a real staff line.",
      hint:"Remember the drawing rules from the building activity." },
    { type:"mc", q:"The best strategy for a note with several ledger lines is…", choices:["panic — it must be too advanced","find the nearest landmark and count carefully","skip it and play anything nearby"], answer:1,
      explain:"Landmarks + counting always work. Several ledger lines just means several careful steps.",
      hint:"What did Mia say fast readers rely on?" },
    /* Unit 1 review */
    { type:"mc", q:"UNIT REVIEW: How many lines and spaces does a staff have?", choices:["5 lines, 4 spaces","4 lines, 5 spaces","5 lines, 5 spaces"], answer:0,
      explain:"Always 5 lines with 4 spaces between them.", hint:"Think back to building the staff." },
    { type:"truefalse", q:"UNIT REVIEW: Staff lines and spaces are counted from the bottom up.", answer:true,
      explain:"Bottom-up, in every clef, always.", hint:"Where is line 1?" },
    { type:"mc", q:"UNIT REVIEW: Bottom to top, the treble staff lines are…", choices:["E-G-B-D-F","G-B-D-F-A","F-A-C-E"], answer:0,
      explain:"Every Good Boy Does Fine.", hint:"Every Good Boy…" },
    { type:"mc", q:"UNIT REVIEW: The treble clef is also called the…", choices:["F clef","G clef","C clef"], answer:1,
      explain:"Its spiral wraps line 2 = G.", hint:"Which line does the spiral wrap?" },
    { type:"mc", q:"UNIT REVIEW: Bottom to top, the bass staff spaces are…", choices:["F-A-C-E","A-C-E-G","G-B-D-F"], answer:1,
      explain:"All Cows Eat Grass.", hint:"All Cows…" },
    { type:"mc", q:"UNIT REVIEW: The bass clef's two dots surround line 4, naming it…", choices:["F","G","B"], answer:0,
      explain:"That's why it's the F clef.", hint:"What else is the bass clef called?" },
    { type:"mc", q:"UNIT REVIEW: The Grand Staff is…", choices:["two treble staffs joined together","the treble and bass staffs joined by a brace","any staff with ledger lines"], answer:1,
      explain:"Treble + bass + brace + barline = the Grand Staff.", hint:"What does piano music use?" },
    { type:"mc", q:"UNIT REVIEW: Middle C sits…", choices:["on line 3 of the treble staff","between the two staffs, on its own ledger line","below the bass staff"], answer:1,
      explain:"The bridge note between the staffs — and the very first ledger-line note you met.",
      hint:"Why was it called a bridge?" },
    { gen:"note-name", params:{clef:"treble"}, count:1 },
    { gen:"note-name", params:{clef:"bass"}, count:1 },
    { gen:"higher-lower", count:1 }
  ],
  vocabulary:[
    {def:"Short lines added to extend the range of the staff when notes are too low or too high to be written on the staff.", term:"Ledger Line", staff:{clef:"treble",notes:[{p:"A5",d:"q"}],width:140}},
    {def:"A note you can name instantly and count from — top-line F, bottom-line G, and middle C.", term:"Landmark Note"},
    {def:"A-B-C-D-E-F-G, repeated through the entire range of music.", term:"Musical Alphabet"}
  ],
  mistakes:[
    "<b>Counting only the ledger lines</b> — count both lines AND spaces on the way.",
    "<b>Forgetting the alphabet repeats</b> — after G comes A, always.",
    "<b>Drawing ledger lines too long</b> — just slightly wider than the notehead.",
    "<b>Placing the notehead beside the line</b> — the line goes through its center.",
    "<b>Panicking at several ledger lines</b> — find a landmark and count calmly."
  ],
  summary:[
    "✔ Ledger lines <b>extend the staff</b> — above AND below.",
    "✔ The musical alphabet <b>never changes</b>.",
    "✔ Count <b>both lines and spaces</b>.",
    "✔ Ledger lines belong to <b>one note only</b>.",
    "✔ Read from <b>landmarks</b>, don't guess.",
    "✔ Recognize <b>patterns</b>, not isolated notes."
  ],
  tips:[
    "Don't be afraid of ledger lines — they're just extra pieces of the same staff you already know.",
    "The musical alphabet never changes. Trust the pattern!",
    "Every difficult-looking note becomes easy when you count carefully.",
    "\u{1F389} You've completed all of UNIT 1 — staff, treble clef, bass clef, Grand Staff, and ledger lines. Unit 2 brings rhythm: note values, measures, and time signatures!"
  ],
  rewards:{ badge:"Ledger Line Master", icon:"\u{1F3C6}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A PERFECT 25 on the Unit 1 review?! Ledger Line Master, staff champion, clef expert — Unit 2 won't know what hit it! \u{1F3B5}\u{1F389}",
  miaPass:"You passed the Unit 1 review! Look at how far you've come since that first blank staff. On to rhythm in Unit 2!",
  mia:{
    hook:{ label:"the welcome",
      explain:"Ledger lines are extra ladder steps: short lines added above or below the staff so music can climb or dig as far as it needs.",
      play:()=>{[77,79,81,83,84].forEach((m,i)=>MFAudio.tone(m,.28,i*.25)); [43,41,40,38,36].forEach((m,i)=>MFAudio.tone(m,.28,1.5+i*.25));} },
    learn:{ label:"ledger lines",
      explain:"Above treble: F(top line)-G-A-B-C… Below bass: G(bottom line)-F-E-D-C… Count every line and space; the alphabet never changes.",
      hint:"Nearest landmark first: top line F5, bottom line G2, or Middle C — then count one step at a time.",
      play:()=>{[65,67,69,71,72].forEach((m,i)=>MFAudio.tone(m+12,.28,i*.25));} },
    example:{ label:"the examples",
      explain:"Two ladders leaving the staff: one climbing above the treble (F-G-A-B-C), one sinking below the bass (G-F-E-D-C)." },
    game:{ label:"the games",
      explain:"High-or-low ears, ledger note naming, pattern completion — then the 60-second Extreme Challenge over everything in Unit 1.",
      hint:"Landmarks: F5 on top, G2 at the bottom, Middle C in between." },
    quiz:{ label:"this question",
      explain:"This quiz reviews ALL of Unit 1: the staff, both clefs, the Grand Staff, Middle C, and ledger lines. Count from landmarks and trust the alphabet.",
      play:()=>{MFAudio.tone(84,.4,0);MFAudio.tone(36,.6,.5);} }
  }
};
