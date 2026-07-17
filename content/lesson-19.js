/* Lesson 19 — Tempo Marks (AEMT Book 1, Unit 5)
   Built from drafts/UNIT 5 – Lesson 19.md.
   QA note honored: every Italian term paired with AUDIO examples and movement
   (walking/running imagery + two tap games at slow and fast tempos).
   NOTE: edit by FULL-FILE REWRITE only. */

/* listen-and-choose tempo drill (unique L19 prefix) */
function MF_L19_tempoListen(container,fb){
  const ROUNDS=[{bpm:56,a:"Adagio"},{bpm:132,a:"Allegro"},{bpm:88,a:"Andante"},{bpm:160,a:"Vivace"}].sort(()=>Math.random()-.5);
  const OPTS=["Adagio","Andante","Allegro","Vivace"];
  let i=0,played=false;
  container.innerHTML=`<div class="big-q tl-q" style="text-align:center"></div>
    <div style="text-align:center"><button class="play tl-play">▶ Listen</button></div>
    <div class="choices chips tl-ch" style="display:none"></div>`;
  const q=container.querySelector(".tl-q"), ch=container.querySelector(".tl-ch");
  OPTS.forEach(o=>{ const b=document.createElement("button"); b.textContent=o;
    b.onclick=()=>{
      if(!played){ fb(false,"Listen first!"); return; }
      const cur=ROUNDS[i];
      if(o===cur.a){ i++;
        if(i>=ROUNDS.length){ ch.style.display="none"; container.querySelector(".tl-play").style.display="none"; q.textContent="Tempo ears unlocked!";
          fb(true,"✓ Slow crawl, easy walk, cheerful run, lightning sprint — you heard them all correctly!"); }
        else { fb(true,`✓ ${cur.a} it was! Next tempo…`); ask(); } }
      else fb(false,`Feel the pulse in your body: could you WALK to it, RUN to it, or barely crawl? (It was ${cur.a}.)`);
    };
    ch.appendChild(b); });
  function ask(){ q.textContent=`Tempo ${i+1} of ${ROUNDS.length}: which marking fits?`; played=false; ch.style.display="none"; }
  container.querySelector(".tl-play").onclick=()=>{
    const spb=60/ROUNDS[i].bpm;
    [60,64,67,64,60,64,67,64].forEach((m,k)=>MFAudio.tone(m,spb*.8,k*spb,.4));
    played=true;
    setTimeout(()=>{ ch.style.display=""; },8*spb*1000+300);
  };
  ask();
}

LESSON_CONTENT[19]={
  welcome:"Slow like a turtle or fast like lightning — today we set the SPEED. \u{1F422}\u{26A1}",
  hook:{
    say:"Have you ever walked slowly through a park… or raced across a playground? Music moves at different speeds too! Press play — the same melody, two speeds. <b>Which felt like a stroll and which like a sprint?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Stroll… then sprint</button></div>
          <div class="choices hk-ch" style="display:none"><button>First slow (stroll), then fast (sprint)</button><button>First fast, then slow</button><button>Both the same speed</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const mel=[60,64,67,72];
          mel.forEach((m,k)=>MFAudio.tone(m,.6,k*.75,.4));
          mel.forEach((m,k)=>MFAudio.tone(m,.25,3.6+k*.3,.4));
          setTimeout(()=>{ ch.style.display=""; },5200);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Same notes — different SPEED. That speed is called TEMPO, and Italian words tell musicians exactly how fast to go!");
          else fb(false,"Listen again — which version could you stroll to?");
        });
      } }
  },
  objectives:[
    "Define tempo",
    "Identify common Italian tempo markings",
    "Arrange tempos from slowest to fastest",
    "Explain how tempo changes the mood of music",
    "Recognize tempo markings by ear",
    "Choose an appropriate tempo for different styles of music"
  ],
  steps:[
    { say:"<b>Tempo</b> = the speed of the music — its heartbeat. Like dynamics, tempo words are <b>Italian</b>. The big five: \u{1F422} <b>Adagio</b> (slow) · \u{1F6B6} <b>Andante</b> (walking pace) · \u{1F642} <b>Moderato</b> (moderate) · \u{1F3C3} <b>Allegro</b> (fast & cheerful) · \u{26A1} <b>Vivace</b> (very lively). \u{1F447} <b>What does tempo tell musicians?</b>",
      try:{ type:"mc",
        choices:["The speed of the music","The volume of the music","The names of the notes"], answer:0,
        success:"✓ Tempo = speed, the heartbeat that everything else rides on.",
        fail:"Volume was LAST lesson (dynamics) — tempo is about…?",
        hint:"Stroll vs sprint." } },
    { say:"Hear each word come to life! \u{1F447} <b>Press each tempo and FEEL the difference:</b>",
      try:{ type:"custom",
        hint:"Same melody every time — only the heartbeat changes.",
        mount:(container,fb)=>{
          const T=[["Adagio",56,"\u{1F422}"],["Andante",88,"\u{1F6B6}"],["Moderato",104,"\u{1F642}"],["Allegro",132,"\u{1F3C3}"],["Vivace",160,"\u{26A1}"]];
          const heard=new Set();
          container.innerHTML=`<div class="choices tp-ch" style="justify-content:center"></div>`;
          const ch=container.querySelector(".tp-ch");
          T.forEach(([name,bpm,emo])=>{
            const b=document.createElement("button"); b.innerHTML=`${emo} ${name}`;
            b.onclick=()=>{
              const spb=60/bpm;
              [60,64,67,72,67,64,60].forEach((m,k)=>MFAudio.tone(m,spb*.8,k*spb,.4));
              heard.add(name);
              if(heard.size===5) fb(true,"✓ All five heard — from turtle to lightning. Notice: the notes never changed, only the heartbeat!");
              else fb(true,`✓ ${name} — ${{"Adagio":"slow and expressive","Andante":"a comfortable walk","Moderato":"right in the middle","Allegro":"fast and cheerful","Vivace":"very lively!"}[name]} (${heard.size} of 5 heard)`);
            };
            ch.appendChild(b);
          });
        } } },
    { say:"Line them up! From slowest to fastest — the full spectrum even includes <b>Largo</b> (very slow) and <b>Presto</b> (very fast) at the edges. \u{1F447} <b>Tap the big five in order, slowest first:</b>",
      try:{ type:"custom",
        hint:"Turtle → walker → middle → runner → lightning.",
        mount:(container,fb)=>{
          const seq=["Adagio","Andante","Moderato","Allegro","Vivace"];
          let next=0;
          container.innerHTML=`<div class="tl-done" style="text-align:center;font-weight:800;min-height:30px;color:var(--primary)"></div>
            <div class="choices tl2-ch"></div>`;
          const done=container.querySelector(".tl-done"), ch=container.querySelector(".tl2-ch");
          [...seq].sort(()=>Math.random()-.5).forEach(s=>{
            const b=document.createElement("button"); b.textContent=s;
            b.onclick=()=>{
              if(s===seq[next]){ next++; b.disabled=true; MFAudio.tone(55+next*4,.3);
                done.textContent=seq.slice(0,next).join(" → ");
                if(next===seq.length){ ch.style.display="none";
                  fb(true,"✓ Adagio → Andante → Moderato → Allegro → Vivace — the tempo line, slow to fast!"); } }
              else { MFAudio.tone(40,.25); fb(false,`Not yet — what comes ${next===0?"SLOWEST":"after "+seq[next-1]}?`); }
            };
            ch.appendChild(b);
          });
        } } },
    { say:"Now trust your EARS alone. \u{1F447} <b>Hear a tempo, name it:</b>",
      try:{ type:"custom",
        hint:"Could you walk to it? Run? Barely crawl?",
        mount:(container,fb)=>MF_L19_tempoListen(container,fb) } },
    { say:"Tempo sets the <b>mood</b>: the same tune can be a lullaby at Adagio or a dance at Vivace. \u{1F447} <b>Pick the best tempo for each scene:</b>",
      try:{ type:"custom",
        hint:"Match the energy of the scene to the speed of the music.",
        mount:(container,fb)=>{
          const rounds=[{scene:"\u{1F634} A gentle lullaby",a:"Adagio"},{scene:"\u{1F6B6} A relaxed afternoon stroll",a:"Andante"},{scene:"\u{1F389} A joyful birthday dance",a:"Allegro"},{scene:"\u{26A1} A wild chase scene",a:"Vivace"}];
          const OPTS=["Adagio","Andante","Allegro","Vivace"];
          let i=0;
          container.innerHTML=`<div class="big-q sc-q" style="text-align:center"></div><div class="choices chips sc-ch"></div>`;
          const q=container.querySelector(".sc-q"), ch=container.querySelector(".sc-ch");
          OPTS.forEach(o=>{ const b=document.createElement("button"); b.textContent=o;
            b.onclick=()=>{
              const cur=rounds[i];
              if(o===cur.a){ MFAudio.yay(); i++;
                if(i>=rounds.length){ ch.style.display="none"; q.textContent="Perfect casting!";
                  fb(true,"✓ Every scene got the right heartbeat — that's how composers set a mood before a single melody is heard!"); }
                else { fb(true,`✓ ${cur.a} fits perfectly! Next scene…`); ask(); } }
              else { MFAudio.tone(40,.25); fb(false,"Feel the scene's energy — is it sleepy, strolling, dancing, or racing?"); }
            };
            ch.appendChild(b); });
          function ask(){ q.textContent=`Scene ${i+1} of ${rounds.length}: ${rounds[i].scene} — which tempo?`; }
          ask();
        } } }
  ],
  examples:[
    { caption:"The same four notes at Andante — a comfortable walking pace. (Press play and stroll along.)",
      staff:{clef:"treble",tempo:88,time:"4/4",notes:[{p:"C4",d:"q",label:"walk"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{bar:"final"}],width:400} },
    { caption:"Exactly the same notes at Vivace — suddenly it's a dance! Tempo IS the mood.",
      staff:{clef:"treble",tempo:160,time:"4/4",notes:[{p:"C4",d:"q",label:"run!"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"},{bar:"final"}],width:400} }
  ],
  games:[
    { type:"term-race", title:"Game 1 · Tempo Term Dash",
      intro:"Italian flashes — pick the meaning fast! The big five plus the extremes.",
      miaIntro:"Speed quiz about… speed! \u{26A1}",
      spec:{rounds:8, pool:[
        ["Adagio","Slow"],["Andante","Walking pace"],["Moderato","Moderate speed"],
        ["Allegro","Fast and cheerful"],["Vivace","Very lively and fast"],
        ["Largo","Very slow"],["Presto","Very fast"],["Tempo","The speed of the music"]]},
      result:(score)=>score>=7?"Tempo vocabulary — fluent!":null },
    { type:"order-tap", title:"Game 2 · The Tempo Line",
      intro:"Tap all SEVEN tempo words from slowest to fastest — Largo to Presto, against the clock!",
      miaIntro:"The full spectrum — line them up! \u{1F3C1}",
      spec:{title:"Slowest → fastest!", sequence:["Largo","Adagio","Andante","Moderato","Allegro","Vivace","Presto"], timer:25},
      result:(stars)=>stars>=3?"Seven tempos, perfect order — conductor material!":null },
    { type:"rhythm-tap", title:"Game 3 · Adagio Tap",
      intro:"Tap rhythms at a TRUE Adagio — slow is harder than it sounds. Keep the pulse steady!",
      miaIntro:"The turtle challenge — steady and slow! \u{1F422}",
      spec:{tempo:56, rounds:2, patterns:[["q","q","h"],["h","q","q"],["w"]]},
      result:(score)=>score>=5?"Rock-steady at turtle speed — true control!":null },
    { type:"rhythm-tap", title:"Game 4 · Vivace Tap",
      intro:"Same idea at VIVACE — hold on tight! Quick taps, steady heart.",
      miaIntro:"Now the lightning round! \u{26A1}",
      spec:{tempo:160, rounds:2, patterns:[["q","q","q","q"],["q","q","h"],["h","h"]]},
      result:(score)=>score>=6?"Lightning-fast AND accurate — Vivace mastered!":null }
  ],
  practiceIntro:"20 practice questions — Italian terms, the tempo line, and matching moods. Answer right and the next appears automatically!",
  practice:[
    { gen:"term-match", params:{subject:"tempo marking", pool:[["Adagio","Slow"],["Andante","Walking pace"],["Moderato","Moderate speed"],["Allegro","Fast and cheerful"],["Vivace","Very lively and fast"],["Largo","Very slow"],["Presto","Very fast"]], reverse:true}, count:8 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:2 },
    { type:"mc", q:"Tempo is…", choices:["the speed of the music","the volume of the music","the shape of the melody"], answer:0,
      explain:"The heartbeat — how fast the beats go by." },
    { type:"truefalse", q:"Allegro is faster than Adagio.", answer:true,
      explain:"Cheerful run vs slow crawl." },
    { type:"truefalse", q:"Andante means “at a walking pace.”", answer:true,
      explain:"From the Italian andare — to walk." },
    { type:"mc", q:"Which is the FASTEST of the big five?", choices:["Vivace","Moderato","Andante"], answer:0,
      explain:"Very lively and fast — the lightning bolt." },
    { type:"truefalse", q:"Changing the tempo changes the mood, even with the same notes.", answer:true,
      explain:"Lullaby at Adagio, dance at Vivace." },
    { type:"mc", q:"Which tempo suits a calm, expressive piece?", choices:["Adagio","Presto","Vivace"], answer:0,
      explain:"Slow and expressive." },
    { type:"truefalse", q:"Tempo markings tell you how LOUD to play.", answer:false,
      explain:"That's dynamics! Tempo = speed." },
    { type:"mc", q:"Largo and Presto are…", choices:["the extreme ends of the tempo line","dynamic markings","kinds of rests"], answer:0,
      explain:"Very slow and very fast — the outer edges." },
    /* — from the unit review sheet — */
    { type:"mc", q:"Ritardando (ritard. or rit.) means…", choices:["gradually slowing down","gradually speeding up","suddenly loud"], answer:0, explain:"The tempo relaxes gradually." },
    { type:"mc", q:"Accelerando (accel.) means…", choices:["gradually speeding up","gradually slowing down","moderately soft"], answer:0, explain:"The tempo pushes forward gradually." },
    { type:"truefalse", q:"Allegro moderato is slightly slower than Allegro but quicker than Moderato.", answer:true, explain:"A blended marking sitting between the two." }
  ],
  miaQuizIntro:"Quiz time! Walk, run, crawl or fly — pick the right Italian every time!",
  quiz:[
    { type:"mc", q:"What does tempo tell musicians?", choices:["How loud to play","The speed of the music","Which notes to play","Which instrument to use"], answer:1,
      explain:"Tempo = speed, the music's heartbeat.", hint:"Stroll or sprint?" },
    { type:"mc", q:"Which tempo marking means walking pace?", choices:["Adagio","Andante","Vivace","Allegro"], answer:1,
      explain:"Andante — the comfortable walk.", hint:"\u{1F6B6}" },
    { type:"mc", q:"Which tempo marking means fast and cheerful?", choices:["Moderato","Adagio","Allegro","Largo"], answer:2,
      explain:"Allegro — the happy run.", hint:"\u{1F3C3}" },
    { type:"truefalse", q:"Allegro is faster than Adagio.", answer:true,
      explain:"Run beats crawl.", hint:"Order the line." },
    { type:"truefalse", q:"Vivace is usually faster than Moderato.", answer:true,
      explain:"Very lively beats moderate.", hint:"\u{26A1} vs \u{1F642}" },
    { type:"truefalse", q:"Tempo tells musicians how loudly to play.", answer:false,
      explain:"Volume is dynamics — tempo is SPEED.", hint:"Last lesson vs this lesson." },
    { type:"mc", q:"Which tempo marking means slow?", choices:["Adagio","Allegro","Vivace","Presto"], answer:0,
      explain:"Adagio — slow and expressive.", hint:"\u{1F422}" },
    { type:"mc", q:"Which matching is correct?",
      choices:["Adagio → Slow · Andante → Walking · Moderato → Moderate · Allegro → Fast · Vivace → Very fast",
               "Adagio → Fast · Andante → Very fast · Moderato → Slow · Allegro → Walking · Vivace → Moderate",
               "Adagio → Moderate · Andante → Fast · Moderato → Very fast · Allegro → Slow · Vivace → Walking"], answer:0,
      explain:"The big five, correctly lined up.", hint:"Turtle to lightning." },
    { type:"mc", q:"The Italian word for walking pace is ____.", choices:["Andante","Adagio","Allegro"], answer:0,
      explain:"Andante!", hint:"From andare, to walk." },
    { type:"mc", q:"The speed of music is called ____.", choices:["tempo","dynamics","pitch"], answer:0,
      explain:"Tempo.", hint:"Today's whole topic." },
    { type:"mc", q:"Slowest to fastest:",
      choices:["Adagio → Andante → Moderato → Allegro → Vivace",
               "Vivace → Allegro → Moderato → Andante → Adagio",
               "Andante → Adagio → Vivace → Moderato → Allegro"], answer:0,
      explain:"The tempo line, left to right.", hint:"Start with the turtle." },
    { type:"mc", q:"Which statement is correct?",
      choices:["Tempo tells musicians how loudly to play","Andante is usually faster than Vivace","Allegro is generally faster than Andante","Adagio is the fastest tempo marking"], answer:2,
      explain:"Cheerful run beats comfortable walk.", hint:"Compare their spots on the line." },
    /* generated */
    { gen:"term-match", params:{subject:"tempo marking", pool:[["Adagio","Slow"],["Andante","Walking pace"],["Moderato","Moderate speed"],["Allegro","Fast and cheerful"],["Vivace","Very lively and fast"],["Largo","Very slow"],["Presto","Very fast"]], reverse:true}, count:5 },
    { gen:"note-value", params:{values:["q","q.","8","h"], ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"A word meaning “rate of speed.” It tells how fast or slow to play the music.", term:"Tempo"},
    {def:"Slow.", term:"Adagio"},
    {def:"Moving along (walking speed).", term:"Andante"},
    {def:"Moderately.", term:"Moderato"},
    {def:"Quickly, cheerfully.", term:"Allegro"},
    {def:"Lively and fast.", term:"Vivace"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Tempo</b> = the speed of the music, written in Italian.",
    "✔ The line: <b>Largo → Adagio → Andante → Moderato → Allegro → Vivace → Presto</b>.",
    "✔ <b>Andante</b> = walking \u{1F6B6} · <b>Allegro</b> = cheerful running \u{1F3C3}.",
    "✔ Same notes + different tempo = <b>completely different mood</b>.",
    "✔ Tempo is speed; dynamics are volume — different dials!"
  ],
  tips:[
    "Attach each word to your body: crawl for Adagio, stroll for Andante, jog for Allegro, sprint for Vivace.",
    "When you hear music, guess the tempo word FIRST — then check how it makes you move.",
    "Adagio is the hardest tempo to keep steady — slow takes the most control!",
    "\u{1F3A8} Next lesson: HOW to play each note — staccato, accents, and the bird's-eye fermata!"
  ],
  rewards:{ badge:"Tempo Navigator", icon:"\u{1F680}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"PERFECT — from Largo to Presto without missing a step! Articulation is next. \u{1F680}\u{1F389}",
  miaPass:"You passed! The tempo line is drawn in your memory. Review below or race again for perfection.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Tempo is the music's speed. Italian words — Adagio, Andante, Allegro and friends — tell you exactly how fast the heartbeat goes.",
      play:()=>{[60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.5,k*.7,.4));[60,64,67,72].forEach((m,k)=>MFAudio.tone(m,.22,3.4+k*.28,.4));} },
    learn:{ label:"tempo marks",
      explain:"The big five, slow to fast: Adagio, Andante, Moderato, Allegro, Vivace — with Largo and Presto at the edges.",
      hint:"Turtle, walker, middle, runner, lightning.",
      play:()=>{const bpms=[56,88,132];bpms.forEach((b,r)=>{const s=60/b;[60,64,67].forEach((m,k)=>MFAudio.tone(m,s*.7,r*2+k*s,.4));});} },
    example:{ label:"the examples",
      explain:"The SAME four notes at Andante then Vivace — proof that tempo alone rewrites the mood." },
    game:{ label:"the games",
      explain:"Race the terms, order the full line, then tap at turtle speed AND lightning speed.",
      hint:"Slow taps need the most patience — don't rush Adagio!" },
    quiz:{ label:"this question",
      explain:"Picture the line: Largo-Adagio-Andante-Moderato-Allegro-Vivace-Presto. Every answer sits somewhere on it.",
      play:()=>{const s=.45;[60,64,67,72].forEach((m,k)=>MFAudio.tone(m,s*.7,k*s,.4));} }
  }
};
