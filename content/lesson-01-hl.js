/* Lesson 1 — The Staff, Notes and Pitches (AEMT Book 1, Unit 1)
   v2 — built from the instructor's design document (drafts/Music Fundamental Website Unit 1 - Lesson 1.md)
   NOTE: edit by FULL-FILE REWRITE only. */
LESSON_CONTENT[1]={
  welcome:"Welcome to your very first music lesson! I'm Mia — let's read the map of music together. \u{1F3B5}",
  hook:{
    say:"Welcome to your very first music lesson!<br><br>Music is a language — and just like every language has letters and words, music has its own symbols. The <b>musical staff</b> is the place where those symbols live.<br><br>Think of it as a <b>map</b> that tells musicians exactly which sounds to play. Today you'll learn how to read that map!"
  },
  objectives:[
    "Explain what a musical staff is",
    "Identify the five staff lines and four staff spaces",
    "Number the lines and spaces correctly",
    "Explain what pitch means",
    "Distinguish between higher and lower pitches",
    "Recognize that notes can be placed on both lines and spaces"
  ],
  steps:[
    /* Section 1 — What Is a Musical Staff? */
    { say:"Music needs a system for writing sounds down — and the <b>staff</b> is that system. Every note is placed somewhere on it; without a staff, music would be very hard to read. \u{1F447} Watch a blank page become a staff:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="sb-stage"></div><div style="text-align:center"><button class="play sb-go">▶ Draw the staff</button></div>`;
          const stage=container.querySelector(".sb-stage");
          Staff.render(stage,{clef:"treble",notes:[],width:400});
          const lines=[...stage.querySelectorAll(".staffline")].sort((a,b)=>+b.getAttribute("y1")-+a.getAttribute("y1"));
          const clef=stage.querySelector("text.clef");
          lines.forEach(l=>l.style.opacity=0); if(clef)clef.style.opacity=0;
          lines.forEach(l=>l.style.transition="opacity .45s");
          if(clef)clef.style.transition="opacity .6s";
          container.querySelector(".sb-go").onclick=function(){
            this.disabled=true;
            lines.forEach((l,i)=>setTimeout(()=>{ l.style.opacity=1; MFAudio.tone(64+i*3,.25,0,.3); }, 400+i*450));
            setTimeout(()=>{ if(clef)clef.style.opacity=1;
              fb(true,"✓ Five lines appeared — and the four gaps between them are the spaces. Your musical map is ready!");
              this.disabled=false; this.textContent="▶ Draw it again"; }, 400+5*450+300);
          };
        } } },
    /* Section 2 — Five Lines… click each line */
    { say:"The staff has <b>5 horizontal lines</b>, numbered <b>1 2 3 4 5 from the bottom upward</b>. \u{1F449} <b>Your turn: click every line</b> — I'll name each one you find.",
      try:{ type:"custom",
        hint:"Start at the LOWEST line — that's line 1 — and work upward.",
        mount:(container,fb)=>{
          const found=new Set();
          Staff.render(container,{clef:"treble",clickLines:true,width:400,
            onLine:(ln)=>{
              MFAudio.tone([64,67,71,74,77][ln-1],.3);
              const lineEl=container.querySelector(`.clickline[data-line="${ln}"]`);
              const twin=container.querySelectorAll(".staffline")[5-ln];
              if(twin){ twin.style.stroke="var(--accent)"; twin.style.strokeWidth="3"; }
              found.add(ln);
              if(found.size===5) fb(true,`✓ Correct! This is Line ${ln}. That's all FIVE lines — perfectly counted from the bottom!`);
              else fb(true,`✓ Correct! This is Line ${ln}. Found ${found.size} of 5 — keep going!`);
            }});
        } } },
    /* …and four spaces — click each space */
    { say:"Between the lines live <b>4 spaces</b>, numbered <b>1 2 3 4 from the bottom upward</b> too. \u{1F449} <b>Click every space</b>:",
      try:{ type:"custom",
        hint:"The space just above the bottom line is space 1.",
        mount:(container,fb)=>{
          const found=new Set();
          Staff.render(container,{clef:"treble",clickSpaces:true,width:400,
            onSpace:(sp)=>{
              MFAudio.tone([65,69,72,76][sp-1],.3);
              found.add(sp);
              if(found.size===4) fb(true,`✓ Correct! This is Space ${sp}. All FOUR spaces found — lines AND spaces, bottom-up!`);
              else fb(true,`✓ Correct! This is Space ${sp}. Found ${found.size} of 4!`);
            }});
        } } },
    /* Section 3 — What Is a Pitch? */
    { say:"<b>Pitch</b> means how HIGH or LOW a sound is. Think of a mountain \u{26F0}: the higher you climb, the higher the pitch — the lower you go, the lower the pitch. Watch the note climb the mountain, then come back down:",
      try:{ type:"custom",
        mount:(container,fb)=>{
          container.innerHTML=`<div class="pa-stage"></div>
            <div style="text-align:center"><button class="play pa-up">▲ Climb up</button> <button class="play pa-down">▼ Climb down</button></div>`;
          const stage=container.querySelector(".pa-stage");
          Staff.render(stage,{clef:"treble",notes:[{p:"E4",d:"w"}],width:400});
          const note=stage.querySelector(".notegroup ellipse");
          const pitches=[64,65,67,69,71,72,74,76,77];
          let didUp=false,didDown=false,busy=false;
          function move(up){
            if(busy)return; busy=true;
            const seq=up?pitches:[...pitches].reverse();
            const y0=up?90:30, y1=up?30:90, total=2.4;
            seq.forEach((p,i)=>MFAudio.tone(p,.3,i*total/seq.length));
            const t0=performance.now();
            (function anim(t){ const k=Math.min(1,(t-t0)/(total*1000));
              note.setAttribute("cy",y0+(y1-y0)*k);
              if(k<1)requestAnimationFrame(anim);
              else{ busy=false; if(up)didUp=true; else didDown=true;
                if(didUp&&didDown) fb(true,"✓ Up the staff = up in pitch. Down the staff = down in pitch. You can SEE sound now!");
                else fb(true,up?"✓ Higher on the staff — higher pitch! Now try ▼":"✓ Lower on the staff — lower pitch! Now try ▲"); }
            })(t0);
          }
          container.querySelector(".pa-up").onclick=()=>move(true);
          container.querySelector(".pa-down").onclick=()=>move(false);
        } } },
    /* Section 4 — Notes + drag activity */
    { say:"A <b>note</b> is the symbol that represents one musical sound. Notes can sit <b>ON a line</b> or <b>INSIDE a space</b> — and every position is a different pitch. \u{1F449} <b>Drag the note onto the staff</b> where I ask:",
      try:{ type:"custom",
        hint:"ON a line = the line cuts through the note's middle. IN a space = the note fits between two lines.",
        mount:(container,fb)=>{
          const tasks=[{kind:"line",n:2,label:"Put the note ON line 2"},
                       {kind:"space",n:3,label:"Now put a note IN space 3"}];
          let ti=0;
          container.innerHTML=`<div class="big-q dn-prompt" style="text-align:center"></div>
            <div class="dn-stage" style="position:relative;touch-action:none"></div>
            <div style="text-align:center"><span class="dragnote" style="touch-action:none"><svg width="48" height="34" viewBox="0 0 24 17"><ellipse cx="12" cy="8.5" rx="10" ry="7" fill="#fff" stroke="#2C5F8A" stroke-width="2.6"/></svg></span>
            <div class="kb-note">drag me onto the staff \u{2191}</div></div>`;
          const stage=container.querySelector(".dn-stage"), chip=container.querySelector(".dragnote"),
                prompt=container.querySelector(".dn-prompt");
          Staff.render(stage,{clef:"treble",notes:[],width:400});
          const svg=stage.querySelector("svg");
          prompt.textContent=tasks[0].label;
          let dragging=false;
          chip.addEventListener("pointerdown",e=>{ dragging=true; chip.setPointerCapture(e.pointerId); chip.classList.add("dragging"); });
          chip.addEventListener("pointermove",e=>{ if(!dragging)return;
            const r=chip.parentElement.getBoundingClientRect();
            chip.style.transform=`translate(${e.clientX-r.left-r.width/2}px,${e.clientY-r.top-20}px)`; });
          chip.addEventListener("pointerup",e=>{
            if(!dragging)return; dragging=false; chip.classList.remove("dragging");
            chip.style.transform="";
            const sr=svg.getBoundingClientRect();
            if(e.clientX<sr.left||e.clientX>sr.right||e.clientY<sr.top||e.clientY>sr.bottom){ fb(false,"Drop it right on the staff!"); return; }
            const scale=sr.height/130; /* viewBox height */
            const yv=(e.clientY-sr.top)/scale;
            const k=Math.max(0,Math.min(8,Math.round((90-yv)/7.5)));
            const kind=k%2===0?"line":"space", num=kind==="line"?k/2+1:(k+1)/2;
            const t=tasks[ti];
            if(kind===t.kind&&num===t.n){
              const y=90-k*7.5, x=140+ti*120;
              const g=document.createElementNS("http://www.w3.org/2000/svg","g");
              g.innerHTML=`<ellipse class="note hl" cx="${x}" cy="${y}" rx="9" ry="6.5"></ellipse>`;
              svg.appendChild(g);
              MFAudio.tone([0,64,65,67,69,71,72,74,76,77][k+1]||71,.5);
              ti++;
              if(ti>=tasks.length){ prompt.textContent="Perfect placing!"; chip.style.display="none";
                fb(true,"✓ ON line 2, then IN space 3 — you just wrote your first two notes!"); }
              else { prompt.textContent=tasks[ti].label; fb(true,`✓ Right on ${t.kind} ${t.n}! Next one…`); }
            } else fb(false,`That landed ${kind==="line"?"ON line":"IN space"} ${num} — aim for ${t.kind} ${t.n}. (Count from the bottom!)`);
          });
        } } }
  ],
  examples:[
    { caption:"Hear the map in action: five notes stepping up — line, space, line, space, line — each position a new pitch.",
      staff:{clef:"treble",notes:[{p:"E4",d:"q",label:"line 1"},{p:"F4",d:"q",label:"space 1"},{p:"G4",d:"q",label:"line 2"},{p:"A4",d:"q",label:"space 2"},{p:"B4",d:"q",label:"line 3"}],width:440} }
  ],
  /* Games — exactly the four from the design document */
  games:[
    { type:"build-staff", title:"Game 1 · Build the Staff",
      intro:"Drag the five lines into place — in order, <b>bottom first</b>. Build it cleanly for ⭐⭐⭐!",
      miaIntro:"Game time! Show me you know which line comes first. \u{1F3AE}",
      spec:{},
      result:(stars)=>stars>=3?"Three stars — a flawless staff! \u{2B50}\u{2B50}\u{2B50}":null },
    { type:"line-space", title:"Game 2 · Line or Space?",
      intro:"A random note appears — is it on a <b>line</b> or in a <b>space</b>? 10 rounds.",
      spec:{rounds:10},
      result:(score)=>score>=9?"Nine or more?! Lines and spaces hold no secrets from you!":null },
    { type:"higher-lower", title:"Game 3 · Higher or Lower?",
      intro:"Two notes play — click <b>Higher</b> or <b>Lower</b>. Train those ears!",
      spec:{rounds:5},
      result:(best)=>best>=4?"A "+best+"-streak?! Your ears are sharp — I'm impressed!":null },
    { type:"build-staff", title:"Game 4 · Staff Builder Challenge",
      intro:"The final challenge: build the complete staff <b>before 30 seconds run out</b>!",
      spec:{timer:30},
      result:(stars)=>stars>=3?"Beat the clock with time to spare — Staff Builder champion!":null }
  ],
  /* Practice — 20 mixed questions, immediate feedback */
  practiceIntro:"20 practice questions — multiple choice, true/false, click-the-answer and ordering, all mixed. Answer right and the next appears automatically!",
  practice:[
    { gen:"line-space", count:7 },
    { gen:"higher-lower", count:6 },
    { type:"truefalse", q:"The staff has 5 lines and 4 spaces.", answer:true,
      explain:"Always 5 lines + the 4 spaces between them." },
    { type:"truefalse", q:"Staff lines are counted from the top down.", answer:false,
      explain:"From the BOTTOM up — line 1 is the lowest." },
    { type:"mc", q:"Which is the correct bottom-to-top order of staff lines?",
      choices:["5-4-3-2-1","1-2-3-4-5","1-3-5-2-4"], answer:1,
      explain:"Bottom line is 1, then 2, 3, 4, 5 going up." },
    { type:"mc", q:"Space 2 sits between which lines?",
      choices:["Lines 1 and 2","Lines 2 and 3","Lines 3 and 4"], answer:1,
      explain:"Space 2 is the gap just above line 2." },
    { type:"mc", q:"Pitch means…",
      choices:["how loud a sound is","how high or low a sound is","how long a sound lasts"], answer:1,
      explain:"Pitch = high/low. (Loudness and length are different properties!)" },
    { type:"truefalse", q:"Notes can be placed only on lines.", answer:false,
      explain:"Notes live on lines AND in spaces — every position is a different pitch." },
    { type:"mc", q:"A note placed higher on the staff sounds…",
      choices:["higher","lower","the same"], answer:0,
      explain:"Higher position = higher pitch, like climbing the mountain." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Is the 5th line at the bottom or the top of the staff?", choices:["The top","The bottom"], answer:0, explain:"Lines are numbered from the bottom up — line 5 is the highest." }
  ],
  /* Final Quiz — 20 questions, difficulty gradually increasing */
  miaQuizIntro:"The final quiz — 20 questions, easy ones first. Take your time; accuracy beats speed!",
  quiz:[
    /* easy */
    { type:"mc", q:"How many lines does a staff have?", choices:["4","5","6"], answer:1,
      explain:"A staff always has 5 lines.", hint:"Count them in any staff above." },
    { type:"mc", q:"How many spaces does a staff have?", choices:["3","4","5"], answer:1,
      explain:"4 spaces sit between the 5 lines.", hint:"One fewer than the lines." },
    { type:"truefalse", q:"Lines and spaces are counted from the bottom up.", answer:true,
      explain:"Always bottom-up — the lowest line is line 1.", hint:"Where did our counting start in the games?" },
    { type:"mc", q:"Pitch describes…", choices:["speed","how high or low a sound is","volume"], answer:1,
      explain:"Pitch = the highness or lowness of a sound.", hint:"Remember the mountain." },
    { type:"truefalse", q:"A note is the symbol used to represent a musical sound.", answer:true,
      explain:"Note = the written symbol; pitch = the sound itself.", hint:"One is written, one is heard." },
    { type:"mc", q:"Notes can be placed…", choices:["only on lines","only in spaces","on lines and in spaces"], answer:2,
      explain:"Both! Every line and every space is a different pitch.", hint:"Think of the drag activity." },
    /* generated — image identification */
    { gen:"line-space", count:5 },
    { gen:"higher-lower", count:3 },
    /* harder */
    { type:"mc", q:"Which comes between lines 2 and 3?", choices:["Space 1","Space 2","Space 3"], answer:1,
      explain:"The space above line 2 is space 2.", hint:"Space n sits just above line n." },
    { type:"mc", q:"Put these bottom-to-top: space 1, line 1, line 2", choices:["line 1 → space 1 → line 2","space 1 → line 1 → line 2","line 2 → space 1 → line 1"], answer:0,
      explain:"Line 1 is lowest, space 1 sits just above it, then line 2.", hint:"The very bottom of the staff is a LINE." },
    { type:"mc", q:"A note on line 5 compared to a note in space 1 is…", choices:["lower","higher","the same pitch"], answer:1,
      explain:"Line 5 is the top of the staff — far higher than space 1 near the bottom.", hint:"Which one sits closer to the top?" },
    { type:"truefalse", q:"Two notes in different staff positions can have the same pitch.", answer:false,
      explain:"Every staff position is its own pitch — that's the whole point of the map!", hint:"What did each position represent?" },
    { type:"mc", q:"Why does music use a staff?", choices:["to decorate the page","to show exactly which sounds to play","to count the beats"], answer:1,
      explain:"The staff is the map that tells musicians precisely which pitches to play.", hint:"Mia's first words: a map of…?" },
    { type:"mc", q:"The highest-sounding position among these is…", choices:["line 1","space 2","space 4"], answer:2,
      explain:"Space 4 is the top space — the highest of the three.", hint:"Count each one from the bottom and compare." }
  ],
  vocabulary:[
    {def:"The five lines and the four spaces between them on which music notes and other symbols are written.", term:"Staff", staff:{clef:"none",notes:[],width:150}},
    {def:"An oval-shaped symbol placed on a line or in a space of the staff. It represents a musical sound, called a pitch.", term:"Note", staff:{clef:"none",notes:[{p:"B4",d:"q"}],width:140}},
    {def:"A musical sound.", term:"Pitch"}
  ],
  mistakes:[
    "<b>Counting from the top</b> — always start at the BOTTOM line.",
    "<b>Forgetting the spaces</b> — the 4 spaces are positions too, not just gaps!",
    "<b>Confusing notes with pitches</b> — the note is written, the pitch is heard.",
    "<b>Thinking notes only go on lines</b> — spaces hold notes just as often."
  ],
  summary:[
    "✔ A staff has <b>5 lines</b>.",
    "✔ A staff has <b>4 spaces</b>.",
    "✔ Count <b>from the bottom</b>.",
    "✔ Higher notes have <b>higher pitches</b>.",
    "✔ Lower notes have <b>lower pitches</b>.",
    "✔ Notes can be <b>on lines or in spaces</b>."
  ],
  tips:[
    "Great job! Every musician starts exactly where you are now.",
    "Remember — music isn't about memorizing. It's about recognizing patterns.",
    "Take your time. Accuracy is more important than speed."
  ],
  rewards:{ badge:"Staff Explorer", icon:"\u{1F3C5}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect 20?! Staff Explorer doesn't even cover it — see you in Lesson 2! \u{1F3B5}",
  mia:{
    hook:{ label:"the welcome",
      explain:"Music is a language and the staff is its map — five lines and four spaces where every symbol lives.",
      play:()=>{[64,67,71,74,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.3));} },
    learn:{ label:"the staff",
      explain:"5 lines + 4 spaces, always counted from the BOTTOM. Notes sit on lines or in spaces, and higher position = higher pitch.",
      hint:"Put your finger on the lowest line and count up.",
      play:()=>{[64,65,67,69,71,72,74,76,77].forEach((m,i)=>MFAudio.tone(m,.3,i*.28));} },
    example:{ label:"the example",
      explain:"Line, space, line, space — each step up the staff is a step up in pitch." },
    game:{ label:"the games",
      explain:"Each game drills one skill: building the staff, naming positions, and hearing pitch direction.",
      hint:"Bottom line first — everything counts from the bottom." },
    quiz:{ label:"this question",
      explain:"Remember: 5 lines, 4 spaces, counted from the bottom — higher on the staff means higher pitch, and notes live on lines AND in spaces.",
      play:()=>{MFAudio.tone(60,.5,0);MFAudio.tone(72,.5,.65);} }
  }
};
