/* Lesson 4 — The Grand Staff and Ledger Lines (the middle notes) (AEMT Book 1, Unit 1)
   v2 — rebuilt from the instructor's design document (drafts/UNIT 1 – Lesson 4.md)
   NOTE: edit by FULL-FILE REWRITE only. */
LESSON_CONTENT[4]={
  welcome:"Fantastic — you read BOTH clefs now! Time to join them together. \u{1F309}\u{1F3B5}",
  hook:{
    say:"You can now read both the Treble and Bass Clefs. But what happens when music uses <b>both at the same time</b>?<br><br>That's exactly what piano music does! Today you'll discover the <b>Grand Staff</b>, where both staffs work together as one complete system — and you'll meet one of the most important notes in music: <b>Middle C</b>."
  },
  objectives:[
    "Identify the Grand Staff",
    "Explain how the Treble and Bass Staffs are connected",
    "Recognize the brace and barline that form the Grand Staff",
    "Identify Middle C",
    "Explain what a ledger line is",
    "Read and write Middle C in both the Treble and Bass Clefs"
  ],
  steps:[
    /* Section 1 — What is the Grand Staff? */
    { say:"The <b>Grand Staff</b> = Treble Staff + Bass Staff, connected by a <b>brace</b> and a <b>barline</b>. Pianists play high and low notes at once, so most piano music lives here. \u{1F447} Watch the two staffs join:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="gs-stage"></div><div style="text-align:center"><button class="play gs-go">▶ Build the Grand Staff</button></div>`;
          const stage=container.querySelector(".gs-stage");
          Staff.render(stage,{clef:"grand",notes:[],width:420});
          const svg=stage.querySelector("svg");
          const lines=[...svg.querySelectorAll(".staffline")];
          const horiz=lines.filter(l=>l.getAttribute("y1")===l.getAttribute("y2"));
          const vert=lines.filter(l=>l.getAttribute("y1")!==l.getAttribute("y2"));
          const tclef=svg.querySelector("text.clef");
          const bclef=[...svg.querySelectorAll(".clef-path,.clefdot")];
          const brace=svg.querySelector(".brace");
          const groups=[[...horiz.slice(0,5),tclef],[...horiz.slice(5,10),...bclef],[...vert,brace]];
          groups.flat().forEach(e=>{ if(e){ e.style.opacity=0; e.style.transition="opacity .8s"; } });
          container.querySelector(".gs-go").onclick=function(){
            this.disabled=true;
            groups.forEach((g,gi)=>setTimeout(()=>{
              g.forEach(e=>{ if(e) e.style.opacity=1; });
              if(gi===0)[64,67,71,74,77].forEach((m,i)=>MFAudio.tone(m,.2,i*.09,.25));
              if(gi===1)[43,47,50,53,57].forEach((m,i)=>MFAudio.tone(m,.2,i*.09,.25));
              if(gi===2)MFAudio.chord([48,64,72],1.2,.1);
            }, 400+gi*1100));
            setTimeout(()=>{ fb(true,"✓ Together, they form the Grand Staff! Treble on top, bass below, joined by the brace and barline on the left.");
              this.disabled=false; this.textContent="▶ Build it again"; }, 400+3*1100);
          };
        } } },
    /* Section 2 — Why two staffs? */
    { say:"The piano's range is HUGE — one staff can't show it all without drowning in extra lines. \u{1F449} <b>Listen to each sound, then choose which staff it belongs on:</b>",
      try:{ type:"custom",
        hint:"High and bright → treble (top). Deep and low → bass (bottom).",
        mount:(container,fb)=>{
          const rounds=[{p:"E5",clef:"treble"},{p:"G2",clef:"bass"},{p:"C5",clef:"treble"},{p:"D3",clef:"bass"}];
          let i=0,heard=false;
          container.innerHTML=`<div class="big-q ts-q" style="text-align:center"></div>
            <div style="text-align:center"><button class="play ts-play">▶ Play sound</button></div>
            <div class="ts-staff"></div>
            <div class="choices chips ts-ch"></div>`;
          const q=container.querySelector(".ts-q"), st=container.querySelector(".ts-staff"), ch=container.querySelector(".ts-ch");
          [["\u{1D11E} Treble staff (high)","treble"],["\u{1D122} Bass staff (low)","bass"]].forEach(([t,c])=>{
            const b=document.createElement("button"); b.textContent=t;
            b.onclick=()=>{
              if(!heard){ fb(false,"Listen first — press ▶ Play sound!"); return; }
              const cur=rounds[i];
              if(c===cur.clef){
                Staff.render(st,{clef:"grand",notes:[{p:cur.p,d:"w",clef:cur.clef}],width:340});
                i++; heard=false;
                if(i>=rounds.length){ ch.style.display="none"; fb(true,"✓ All four placed! High sounds ride the treble staff, low sounds sink to the bass staff — that's why the piano needs both."); }
                else { fb(true,`✓ Yes — that ${cur.clef==="treble"?"high":"low"} sound belongs on the ${cur.clef} staff! Next sound…`); ask(); }
              } else fb(false,"Listen again — is it high and bright, or deep and low?");
            };
            ch.appendChild(b);
          });
          container.querySelector(".ts-play").onclick=()=>{ heard=true; MFAudio.tone(MFAudio.midi(rounds[i].p),.8); };
          function ask(){ q.textContent=`Sound ${i+1} of ${rounds.length}: which staff does it belong on?`; }
          ask();
        } } },
    /* Section 3 — Meet Middle C */
    { say:"<b>Middle C</b> sits <b>between the two staffs</b> — and near the <b>middle of the piano</b>, which is how it got its name. It belongs to BOTH staffs: a bridge connecting the two worlds. \u{1F449} <b>Find and press Middle C</b> (hint: just left of the two black keys nearest the middle):",
      try:{ type:"custom",
        hint:"Find the group of TWO black keys closest to the center — Middle C is the white key on its left.",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="mc-kb"></div><div class="mc-staff" style="margin-top:10px"></div>`;
          let found=false;
          Keyboard.create(container.querySelector(".mc-kb"),{start:48,octaves:2,labels:true,marks:[60],
            onKey:m=>{
              if(m===60){
                if(!found){ found=true;
                  Staff.render(container.querySelector(".mc-staff"),{clef:"grand",
                    notes:[{p:"C4",d:"w",clef:"bass",label:"Middle C"},{p:"C4",d:"w",clef:"treble",label:"Middle C"}],width:340});
                  fb(true,"✓ That's Middle C! And look — on the Grand Staff it appears between the staffs, written from the bass side or the treble side. Same key, same pitch, one bridge."); }
              } else fb(false,"Not that one — Middle C is the marked key near the center.");
            }});
        } } },
    /* Section 4 — What is a ledger line? */
    { say:"Some notes are too high or low for the five lines. Instead of building a bigger staff, we add a <b>ledger line</b> — a short line just for that note. Middle C gets its own ledger line between the staffs. \u{1F447} Watch a note walk off the staff:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="ll-stage"></div><div style="text-align:center"><button class="play ll-go">▶ Walk the note down</button></div>`;
          const stage=container.querySelector(".ll-stage");
          const seq=[{p:"E4",cap:"E — on the bottom line"},{p:"D4",cap:"D — below the staff"},{p:"C4",cap:"C — a LEDGER LINE appears!"}];
          Staff.render(stage,{clef:"treble",notes:[{p:"E4",d:"w"}],width:340});
          container.querySelector(".ll-go").onclick=function(){
            this.disabled=true;
            seq.forEach((s,i)=>setTimeout(()=>{
              Staff.render(stage,{clef:"treble",notes:[{p:s.p,d:"w",label:s.cap}],width:340});
              MFAudio.tone(MFAudio.midi(s.p),.5);
              if(i===seq.length-1){ fb(true,"✓ Ledger lines extend the staff — they appear exactly when a note needs one, and belong only to that note.");
                this.disabled=false; this.textContent="▶ Walk it again"; }
            }, 500+i*1100));
          };
        } } },
    /* Section 5 — Reading Middle C and its neighbors */
    { say:"Middle C can be written from the treble side or the bass side — <b>same pitch either way</b>. \u{1F449} <b>Five notes near the middle: is each one Middle C, above it, or below it?</b>",
      try:{ type:"custom",
        hint:"Middle C is the one ON the short ledger line between the staffs.",
        mount:(container,fb)=>{
          const rounds=[{p:"C4",clef:"treble",a:1},{p:"D4",clef:"treble",a:2},{p:"B3",clef:"bass",a:0},{p:"C4",clef:"bass",a:1},{p:"E4",clef:"treble",a:2}];
          let i=0;
          container.innerHTML=`<div class="big-q rc-q" style="text-align:center"></div><div class="rc-staff"></div>
            <div class="choices chips rc-ch"></div>`;
          const q=container.querySelector(".rc-q"), st=container.querySelector(".rc-staff"), ch=container.querySelector(".rc-ch");
          ["Below Middle C","Middle C!","Above Middle C"].forEach((t,idx)=>{
            const b=document.createElement("button"); b.textContent=t;
            b.onclick=()=>{
              const cur=rounds[i];
              MFAudio.tone(MFAudio.midi(cur.p),.5);
              if(idx===cur.a){ i++;
                if(i>=rounds.length){ ch.style.display="none"; st.innerHTML=""; q.textContent="Complete!";
                  fb(true,"✓ All five! You can spot Middle C from either side of the bridge now."); }
                else { fb(true,`✓ Right — that was ${cur.p==="C4"?"Middle C itself":cur.p[0]+", "+(cur.a===2?"above":"below")+" Middle C"}!`); ask(); } }
              else fb(false,"Check the ledger line — is the note ON it, higher, or lower? (Listen, too!)");
            };
            ch.appendChild(b);
          });
          function ask(){
            const cur=rounds[i];
            Staff.render(st,{clef:"grand",notes:[{p:cur.p,d:"q",clef:cur.clef}],width:320});
            q.textContent=`Note ${i+1} of ${rounds.length}:`;
          }
          ask();
        } } },
    /* Section 6 — Grand Staff parts review */
    { say:"The Grand Staff has parts, and each has a name: <b>treble staff, bass staff, brace, barline, Middle C, ledger line</b>. \u{1F449} <b>Click each part as I call for it:</b>",
      try:{ type:"custom",
        hint:"The brace is the curly bracket on the far left, joining the two staffs.",
        mount:(container,fb)=>{
          const tasks=[{key:"treble",label:"Click any line of the TREBLE staff (top)"},
                       {key:"bass",label:"Click any line of the BASS staff (bottom)"},
                       {key:"brace",label:"Click the BRACE (the curly connector on the left)"},
                       {key:"note",label:"Click MIDDLE C (the note on its little ledger line)"}];
          let ti=0;
          container.innerHTML=`<div class="big-q lb-q" style="text-align:center"></div><div class="lb-stage"></div>`;
          const q=container.querySelector(".lb-q"), stage=container.querySelector(".lb-stage");
          function hit(key){
            const t=tasks[ti];
            if(key===t.key){
              ti++;
              if(key==="treble")[64,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.2));
              if(key==="bass")[43,57].forEach((m,i)=>MFAudio.tone(m,.3,i*.2));
              if(key==="brace")MFAudio.chord([48,60,72],.8);
              if(key==="note")MFAudio.tone(60,.7);
              if(ti>=tasks.length){ q.textContent="All parts found!";
                fb(true,"✓ Treble staff, bass staff, brace, and Middle C — you know every part of the Grand Staff!"); }
              else { fb(true,"✓ Found it! Next…"); q.textContent=tasks[ti].label; }
            } else fb(false,"Not that part — "+t.label.toLowerCase()+".");
          }
          Staff.render(stage,{clef:"grand",notes:[{p:"C4",d:"w",clef:"treble"}],clickLines:true,clickNotes:true,width:420,
            onLine:(ln,staffClef)=>hit(staffClef==="bass"?"bass":"treble"),
            onNote:()=>hit("note")});
          const svg=stage.querySelector("svg");
          const r=document.createElementNS("http://www.w3.org/2000/svg","rect");
          r.setAttribute("x",0); r.setAttribute("y",25); r.setAttribute("width",16); r.setAttribute("height",170);
          r.setAttribute("fill","transparent"); r.style.cursor="pointer";
          r.addEventListener("click",()=>hit("brace"));
          svg.appendChild(r);
          q.textContent=tasks[0].label;
        } } }
  ],
  examples:[
    { caption:"Climb from the bass staff, across the Middle C bridge, into the treble staff — one unbroken musical ladder.",
      staff:{clef:"grand",notes:[{p:"E3",d:"q",clef:"bass",label:"E"},{p:"G3",d:"q",clef:"bass",label:"G"},{p:"B3",d:"q",clef:"bass",label:"B"},{p:"C4",d:"q",clef:"bass",label:"mid C"},{p:"C4",d:"q",clef:"treble",label:"mid C"},{p:"D4",d:"q",clef:"treble",label:"D"},{p:"F4",d:"q",clef:"treble",label:"F"},{p:"A4",d:"q",clef:"treble",label:"A"}],width:460} }
  ],
  keyboard:{
    intro:"Middle C is your <b>landmark</b>: the C nearest the middle of the piano, right where the two hands meet. Right hand reads treble (up from Middle C), left hand reads bass (down from it). Watch me play three different Cs — the marked one is Middle C.",
    start:48, octaves:2, labels:true, demo:["C3","C4","C5"], demoGap:600,
    marks:[60]
  },
  games:[
    { type:"find-c", title:"Game 1 · Find Middle C",
      intro:"Four notes appear on the Grand Staff — click the one that is <b>Middle C</b>. 5 rounds.",
      miaIntro:"Game time! Middle C is hiding among its neighbors — can you spot the bridge note every time? \u{1F3AE}",
      spec:{rounds:5},
      result:(score)=>score>=5?"Five out of five — Middle C can't hide from you!":null },
    { type:"key-hunt", title:"Game 2 · Piano Connection",
      intro:"Find <b>every C</b> on the keyboard — they all sit in the same spot of the black-key pattern, and one of them is Middle C!",
      spec:{letter:"C"},
      result:()=>"Every C found — the keyboard pattern is yours!" },
    { type:"ledger-count", title:"Game 3 · Ledger Line Challenge",
      intro:"Does the note need a ledger line? Count how many it uses — <b>0 or 1</b> for now. 6 rounds.",
      spec:{rounds:6, pool:[
        {p:"E4",clef:"treble",n:0},{p:"G4",clef:"treble",n:0},{p:"B4",clef:"treble",n:0},{p:"C4",clef:"treble",n:1},
        {p:"F3",clef:"bass",n:0},{p:"C3",clef:"bass",n:0},{p:"C4",clef:"bass",n:1}]},
      result:(score)=>score>=5?"You see ledger lines instantly — Lesson 5 will be a breeze!":null },
    { type:"note-race", title:"Game 4 · Grand Staff Speed Round",
      intro:"Notes from BOTH staffs — name as many as you can in <b>45 seconds</b>!",
      spec:{seconds:45, pool:[
        {p:"E4",clef:"treble"},{p:"G4",clef:"treble"},{p:"B4",clef:"treble"},{p:"C5",clef:"treble"},{p:"C4",clef:"treble"},
        {p:"G2",clef:"bass"},{p:"B2",clef:"bass"},{p:"D3",clef:"bass"},{p:"F3",clef:"bass"},{p:"C4",clef:"bass"}]},
      result:(score)=>score>=10?"Double-clef speed reading — "+score+" notes! \u{1F3C6}":null }
  ],
  practiceIntro:"20 practice questions — Grand Staff parts, Middle C, ledger lines, and note reading in both clefs. Answer right and the next appears automatically!",
  practice:[
    { gen:"note-name", params:{clef:"treble"}, count:4 },
    { gen:"note-name", params:{clef:"bass"}, count:4 },
    { type:"mc", q:"The Grand Staff combines…", choices:["two treble staffs","the treble and bass staffs","a staff and a keyboard"], answer:1,
      explain:"Treble on top, bass below — one complete system." },
    { type:"mc", q:"What connects the two staffs on the left side?", choices:["A slur","A brace and barline","A double bar"], answer:1,
      explain:"The curly brace plus a vertical barline join them into the Grand Staff." },
    { type:"truefalse", q:"Most piano music is written on the Grand Staff.", answer:true,
      explain:"Pianists play high and low at once — they need both staffs." },
    { type:"mc", q:"Why is one staff not enough for piano music?", choices:["Pianos are too loud","The piano's range is too large","Pianists can't read one staff"], answer:1,
      explain:"One staff would need too many ledger lines to cover the piano's huge range." },
    { type:"mc", q:"Where is Middle C on the Grand Staff?", choices:["On the top line","Between the two staffs","Below the bass staff"], answer:1,
      explain:"It sits in the gap, on its own ledger line — the bridge between staffs." },
    { type:"truefalse", q:"Middle C is written on a ledger line.", answer:true,
      explain:"It's too low for the treble staff and too high for the bass staff — so it gets its own short line." },
    { type:"mc", q:"A ledger line is…", choices:["a short line that extends the staff for one note","a line that replaces the clef","the middle line of the staff"], answer:0,
      explain:"Short, temporary, and belonging only to that note." },
    { type:"truefalse", q:"Ledger lines can only be used above the staff.", answer:false,
      explain:"They extend the staff both above AND below." },
    { type:"mc", q:"Middle C belongs to…", choices:["only the treble staff","only the bass staff","both staffs"], answer:2,
      explain:"It can be written from either side — same key, same pitch." },
    { type:"mc", q:"Why is Middle C called “middle”?", choices:["It's the middle line of the treble staff","It sits near the middle of the piano keyboard","It's played with the middle finger"], answer:1,
      explain:"It's the C nearest the center of the keyboard — and the center of the Grand Staff." },
    { type:"mc", q:"In the treble staff, the note one step ABOVE Middle C is…", choices:["B","D","E"], answer:1,
      explain:"C4 (ledger line) → D4 hangs just below the staff — one step up." },
    { type:"truefalse", q:"Middle C written in the treble clef sounds different from Middle C written in the bass clef.", answer:false,
      explain:"Same pitch, same piano key — only the notation viewpoint changes." },
    /* — from the unit review sheet — */
    { type:"mc", q:"The short line through Middle C is called a ______ line.", choices:["ledger","bar","double bar"], answer:0, explain:"A ledger line — it extends the staff for that one note." }
  ],
  miaQuizIntro:"The final quiz — 20 questions, easy ones first. Remember the bridge: Middle C connects everything!",
  quiz:[
    /* easy */
    { type:"mc", q:"The Grand Staff is made of…", choices:["two bass staffs","the treble staff and the bass staff","five ledger lines"], answer:1,
      explain:"Treble on top, bass below, joined as one system.", hint:"Which two staffs have you learned?" },
    { type:"mc", q:"The curly symbol joining the two staffs is the…", choices:["brace","slur","clef"], answer:0,
      explain:"The brace (plus a barline) connects the staffs on the left.", hint:"It hugs both staffs from the left." },
    { type:"mc", q:"Middle C is located…", choices:["between the two staffs","on the top line of the bass staff","below the bass staff"], answer:0,
      explain:"Right in the gap, on its own ledger line.", hint:"It's the bridge between two worlds." },
    { type:"truefalse", q:"Middle C is written on its own ledger line.", answer:true,
      explain:"It doesn't fit on either staff, so it gets a short line of its own.",
      hint:"Where did the note in the walking animation end up?" },
    { type:"mc", q:"Why does piano music use the Grand Staff?", choices:["Pianists play high and low notes at the same time","Pianos have 88 clefs","It looks more professional"], answer:0,
      explain:"Right hand high (treble), left hand low (bass) — both at once.",
      hint:"Think about what each hand does." },
    { type:"truefalse", q:"Middle C belongs only to the treble staff.", answer:false,
      explain:"It belongs to BOTH — written from the treble side or the bass side, same pitch.",
      hint:"What made Middle C a “bridge”?" },
    { type:"mc", q:"A ledger line is…", choices:["a permanent sixth staff line","a short line added just for one note","a bar line between measures"], answer:1,
      explain:"Ledger lines temporarily extend the staff, one note at a time.",
      hint:"How long did the extra line stick around?" },
    /* generated — reading both clefs */
    { gen:"note-name", params:{clef:"treble"}, count:3 },
    { gen:"note-name", params:{clef:"bass"}, count:3 },
    /* harder */
    { type:"mc", q:"Name this note.", staff:{clef:"treble",notes:[{p:"C4",d:"q"}],width:260}, choices:["B","C","D"], answer:1,
      explain:"On the ledger line below the treble staff — that's Middle C!",
      hint:"It sits on a short line below the staff…" },
    { type:"mc", q:"Name this note.", staff:{clef:"bass",notes:[{p:"C4",d:"q"}],width:260}, choices:["A","B","C"], answer:2,
      explain:"On the ledger line above the bass staff — Middle C from the bass side!",
      hint:"Same bridge note, seen from below." },
    { type:"mc", q:"Which of these notes needs a ledger line in the treble staff?", choices:["E4","C4","G4"], answer:1,
      explain:"E4 is line 1 and G4 is line 2 — but C4 sits below the staff on a ledger line.",
      hint:"Which one is Middle C?" },
    { type:"truefalse", q:"Ledger lines can extend the staff both above and below.", answer:true,
      explain:"High notes get them above, low notes below — Lesson 5 explores both!",
      hint:"Middle C uses one BELOW the treble staff… and ABOVE the bass staff." },
    { type:"mc", q:"The brace and the barline are…", choices:["two names for the same thing","the curly bracket and the straight vertical line joining the staffs","types of ledger lines"], answer:1,
      explain:"Brace = curly bracket; barline = straight vertical line. Together they bind the Grand Staff.",
      hint:"One is curly, one is straight." },
    { type:"mc", q:"On the Grand Staff, LOW piano notes are usually written…", choices:["in the treble staff","in the bass staff","above the treble staff"], answer:1,
      explain:"Low = bass staff (left hand); high = treble staff (right hand).",
      hint:"Which staff is the foundation?" },
    { type:"truefalse", q:"Middle C sounds the same whether it is written from the treble side or the bass side.", answer:true,
      explain:"One pitch, one piano key — two ways to write it on the Grand Staff.",
      hint:"How many Middle C keys does a piano have?" }
  ],
  vocabulary:[
    {def:"The bass staff and treble staff connected by a brace and a line.", term:"Grand Staff"},
    {def:"The bracket that connects the treble and bass staffs at the left.", term:"Brace"},
    {def:"The note in the middle of the grand staff and the C nearest the middle of the keyboard.", term:"Middle C", staff:{clef:"treble",notes:[{p:"C4",d:"q"}],width:140}},
    {def:"Short lines added to extend the range of the staff when notes are too low or too high to be written on the staff.", term:"Ledger Line", staff:{clef:"treble",notes:[{p:"A5",d:"q"}],width:140}}
  ],
  mistakes:[
    "<b>Thinking Middle C belongs only to the treble staff</b> — it belongs to BOTH.",
    "<b>Forgetting Middle C's ledger line</b> — it never sits directly on either staff.",
    "<b>Confusing the brace with the barline</b> — curly bracket vs straight line.",
    "<b>Thinking ledger lines are only above the staff</b> — they go below, too.",
    "<b>Counting ledger lines carelessly</b> — count them like extra staff lines, one at a time."
  ],
  summary:[
    "✔ The Grand Staff combines the <b>Treble and Bass Staffs</b>.",
    "✔ A <b>brace</b> and <b>barline</b> connect the two staffs.",
    "✔ Piano music is usually written on the <b>Grand Staff</b>.",
    "✔ <b>Middle C</b> is located between the two staffs.",
    "✔ Middle C is written on a <b>ledger line</b>.",
    "✔ Ledger lines extend the staff <b>above or below</b>."
  ],
  tips:[
    "Middle C is one of the most important landmarks in music. Once you know where it is, reading music becomes much easier.",
    "Think of Middle C as the bridge connecting two musical worlds.",
    "Every pianist learns the Grand Staff one note at a time — you're doing exactly the same!"
  ],
  rewards:{ badge:"Grand Staff Explorer", icon:"\u{1F309}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secKb","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect 20?! The Grand Staff is officially your home — Lesson 5 takes us beyond its edges! \u{1F3B5}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Piano music needs both hands — so it needs both staffs. The Grand Staff joins treble and bass with a brace, and Middle C bridges the gap between them.",
      play:()=>{[48,52,55,59,60,62,64,65,67].forEach((m,i)=>MFAudio.tone(m,.28,i*.25));} },
    learn:{ label:"the Grand Staff",
      explain:"Treble on top, bass below, brace + barline on the left. Middle C floats between them on its own ledger line — written from either side, same pitch.",
      hint:"High sounds → top staff. Low sounds → bottom staff. The bridge note is Middle C.",
      play:()=>{MFAudio.tone(60,.8);} },
    example:{ label:"the example",
      explain:"The notes climb out of the bass staff, cross Middle C's bridge, and continue up the treble staff — one continuous ladder of pitch." },
    kb:{ label:"the keyboard",
      explain:"Middle C = the C nearest the piano's center, where the two hands meet. Right hand goes up in treble; left hand goes down in bass." },
    game:{ label:"the games",
      explain:"Spot Middle C on the staff, find every C on the keyboard, count ledger lines, then speed-read both staffs.",
      hint:"Middle C = the note on the SHORT line between the staffs." },
    quiz:{ label:"this question",
      explain:"Grand Staff = treble + bass + brace + barline. Middle C lives between them on a ledger line and belongs to both.",
      play:()=>{MFAudio.tone(60,.5,0);MFAudio.chord([48,64],1,.6);} }
  }
};
