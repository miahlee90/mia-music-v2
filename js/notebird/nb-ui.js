/* Note Bird — UI + ANIMATION layer.
   Reuses: Staff (SVG notation renderer), MFAudio (Web Audio), Keyboard
   (on-screen piano), Teacher (Mia guide character), style.css design system,
   NBMusic (original generated background pad loop).
   v0.4 (instructor 2026-07-17): ONE red Note Bird character (NBData.BIRD_SVG)
   shared by header + game with states wait/fly/pass/bump; the bird waits on a
   leafy PERCH (right), takes off, and a friendly TREE stands on the left —
   correct = sail past with sparkles, time-out = soft head-bonk on the trunk;
   +1 heart on every level-up; meadow strip + wooden-sign level toast; compact
   status bar (round text + progress dots + ★ streak); labeled "Distance to
   Tree" indicator (hidden when untimed); A–G buttons with focus/check/nudge
   states; feedback delays from NBData.FEEDBACK.
   The bird/tree live INSIDE the staff SVG so vertical alignment with the
   target note is exact at every screen size. Flight is time-based.
   Time-out = gentle bump + cartoon stars — the bird is NEVER hurt; no screen
   shake or flashes. A run is a RECORD, not a test.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NBUI=(()=>{
  const LETTERS=["A","B","C","D","E","F","G"];
  /* A narrower viewBox = a larger on-screen scale at every screen width
     (flight speed is time-based, so runway length never changes difficulty). */
  const W=400;              /* staff spec width (viewBox units) */
  const NOTE_X=250;         /* fixed target-notehead x — never moves, never obscured */
  const EXTL=96, EXTR=64;   /* scene extension: gate left, spawn runway right */
  const reduceMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let root=null, session=null, scene=null, raf=0;
  /* default range: the full grand staff C2–C6 (instructor 2026-07-17) */
  let settings={ mode:"level", clef:"grand", a:"C2", b:"C6", setId:null,
                 rounds:10, sound:"after", music:NBData.MUSIC_DEFAULT, hints:true };

  /* Theory Lab student session (same sign-in as the lessons; set by student.html
     via lms.js). Read-only here: the game shows who is signed in and tags its
     LOCAL records with the student — it never writes to the academic LMS. */
  function studentSession(){
    try{ return JSON.parse(localStorage.getItem("mf-lms-session"))||null; }
    catch(e){ return null; }
  }

  /* quiz-show feedback sounds (instructor): correct = "ding-dong-dang" rising
     chime; wrong press or tree-bump = a FALLING pitch slide (like a string
     bending down) — a pitched thud was confusable with real notes */
  function sfxCorrect(){ MFAudio.yay(); }
  function sfxWrong(){
    const c=MFAudio.ac(), o=c.createOscillator(), g=c.createGain(), t=c.currentTime;
    o.type="sawtooth";
    o.frequency.setValueAtTime(320,t);
    o.frequency.exponentialRampToValueAtTime(70,t+.4);
    o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(.15,t+.02);
    g.gain.exponentialRampToValueAtTime(.001,t+.45);
    o.start(t); o.stop(t+.5);
  }

  const $=(s,el)=>(el||root).querySelector(s);

  /* ---------- condition (what the run is played under) ---------- */
  function currentCondition(){
    if(settings.setId){ const s=NBData.LINE_SPACE_SETS.find(x=>x.id===settings.setId);
      return {setId:s.id, clef:s.clef, word:s.word, pitches:s.pitches}; }
    const pitches=NBData.naturalsBetween(settings.a,settings.b);
    const clef=settings.clef==="auto"?NBData.autoClef(pitches):settings.clef;
    return {a:settings.a,b:settings.b,clef,pitches};
  }
  function conditionLabel(c){
    if(c.setId) return c.word+" · "+nbt("misc."+c.clef)+" "+nbt(NBData.LINE_SPACE_SETS.find(x=>x.id===c.setId).kindKey);
    return c.a+"–"+c.b+" · "+nbt(c.clef==="grand"?"misc.grand":"misc."+c.clef);
  }
  function buildPool(c){
    return c.pitches.map(p=>NBData.buildNote(p,c.clef)).filter(Boolean);
  }

  /* ============================== SETUP SCREEN ============================== */
  function showSetup(){
    stopLoop(); NBMusic.stop();
    const stu=studentSession();
    root.innerHTML=`
    <section class="card nb-setup">
      <h2>${nbt("setup.title")}</h2>
      <p class="nb-signin">${stu
        ? nbt("setup.signedIn",{name:stu.name,cls:stu.class||stu.classCode||""})
        : `<a href="../student.html">${nbt("setup.signIn")}</a> · ${nbt("setup.signInWhy")}`}</p>
      <div class="nb-field"><div class="nb-lab">${nbt("setup.mode")}</div>
        <div class="choices chips nb-modes">
          <button data-mode="practice" aria-pressed="false">🎈 ${nbt("setup.mode.practice")}</button>
          <button data-mode="level" aria-pressed="false">🚀 ${nbt("setup.mode.level")}</button>
        </div>
        <p class="nb-modedesc" aria-live="polite"></p></div>
      <div class="nb-field"><div class="nb-lab">${nbt("setup.clef")}</div>
        <div class="choices chips nb-clefs">
          <button data-c="auto">${nbt("setup.clef.auto")}</button>
          <button data-c="treble">𝄞 ${nbt("misc.treble")}</button>
          <button data-c="bass">𝄢 ${nbt("misc.bass")}</button>
          <button data-c="grand">${nbt("misc.grand")}</button>
        </div></div>
      <div class="nb-field"><div class="nb-lab">${nbt("setup.range")}</div>
        <div class="nb-rangeRow">
          <label>${nbt("setup.rangeFrom")} <select class="nav-jump nb-a"></select></label>
          <label>${nbt("setup.rangeTo")} <select class="nav-jump nb-b"></select></label>
        </div>
        <div class="nb-sublab">${nbt("setup.quick")}</div>
        <div class="choices chips nb-quick"></div>
        <div class="nb-sublab">${nbt("setup.sets")}</div>
        <div class="choices chips nb-sets"></div>
        <p class="nb-condline" aria-live="polite"></p></div>
      <div class="nb-field nb-roundsfield"><div class="nb-lab">${nbt("setup.rounds")}</div>
        <div class="choices chips nb-rounds">
          <button data-r="5">5</button><button data-r="10">10</button><button data-r="15">15</button>
        </div></div>
      <div class="nb-field"><div class="nb-lab">${nbt("setup.sound")}</div>
        <select class="nav-jump nb-sound" aria-label="${nbt("setup.sound")}"></select></div>
      <div class="nb-field nb-musicfield"><div class="nb-lab">${nbt("setup.music")}</div>
        <div class="choices chips nb-music">
          <button data-m="1">🐦 ${nbt("setup.music.on")}</button><button data-m="0">${nbt("setup.music.off")}</button>
        </div></div>
      <div class="nb-field nb-hintfield"><div class="nb-lab">${nbt("setup.hints")}</div>
        <div class="choices chips nb-hints">
          <button data-h="1">💡 ${nbt("setup.hints.on")}</button><button data-h="0">${nbt("setup.hints.off")}</button>
        </div></div>
      <p style="color:var(--muted);font-size:14px">${nbt("setup.answerNote")}</p>
      <div style="text-align:center;margin-top:14px"><button class="play nb-start">▶ ${nbt("setup.start")}</button></div>
    </section>`;

    /* range selects */
    const selA=$(".nb-a"), selB=$(".nb-b");
    NBData.rangeChoices().forEach(p=>{
      [selA,selB].forEach(sel=>{
        const o=document.createElement("option"); o.value=p; o.textContent=p; sel.appendChild(o);
      });
    });
    selA.value=settings.a; selB.value=settings.b;
    function fixOrder(changed){
      if(NBData.dia(selA.value)>NBData.dia(selB.value)){
        if(changed==="a") selB.value=selA.value; else selA.value=selB.value;
      }
      settings.a=selA.value; settings.b=selB.value; settings.setId=null;
      paintRange();
    }
    selA.onchange=()=>fixOrder("a"); selB.onchange=()=>fixOrder("b");

    /* quick picks & sets as NOTATION CARDS (instructor: text-only chips don't
       register — show the actual notes on a mini staff) */
    function noteCard(labelText,ariaText,clef,pitches){
      const b=document.createElement("button");
      b.className="notecard nb-notecard";
      b.setAttribute("aria-label",ariaText);
      const st=document.createElement("div");
      b.appendChild(st);
      const lbl=document.createElement("div"); lbl.className="nb-cardlbl"; lbl.textContent=labelText;
      b.appendChild(lbl);
      const notes=pitches.map(p=>({p,d:"w",
        clef:clef==="grand"?(NBData.midiOf(p)>=60?"treble":"bass"):undefined}));
      Staff.render(st,{clef,notes,width:pitches.length>2?190:150});
      return b;
    }
    const quick=$(".nb-quick");
    NBData.RANGE_QUICK.forEach(q=>{
      /* each quick pick carries its own clef (instructor's g:/t:/b: list) */
      const clef=q.clef||NBData.autoClef([q.a,q.b]);
      const b=noteCard(q.a+"–"+q.b, q.a+" to "+q.b+" ("+clef+")", clef, [q.a,q.b]);
      b.dataset.a=q.a; b.dataset.b=q.b; b.dataset.clef=clef;
      b.onclick=()=>{ settings.a=q.a; settings.b=q.b; settings.clef=clef; settings.setId=null;
        selA.value=q.a; selB.value=q.b; paintRange(); };
      quick.appendChild(b);
    });
    const sets=$(".nb-sets");
    NBData.LINE_SPACE_SETS.forEach(s=>{
      const b=noteCard(s.word, s.word+" — "+nbt("misc."+s.clef)+" "+nbt(s.kindKey), s.clef, s.pitches);
      b.dataset.set=s.id;
      b.title=nbt("misc."+s.clef)+" "+nbt(s.kindKey)+": "+s.pitches.join(" ");
      b.onclick=()=>{ settings.setId=settings.setId===s.id?null:s.id; paintRange(); };
      sets.appendChild(b);
    });

    function paintRange(){
      [...quick.children].forEach(b=>{
        const on=!settings.setId&&b.dataset.a===settings.a&&b.dataset.b===settings.b
          &&b.dataset.clef===settings.clef;
        b.classList.toggle("nb-on",on); b.setAttribute("aria-pressed",String(on)); });
      [...sets.children].forEach(b=>{
        const on=b.dataset.set===settings.setId;
        b.classList.toggle("nb-on",on); b.setAttribute("aria-pressed",String(on)); });
      $(".nb-rangeRow").style.opacity=settings.setId?".45":"1";
      const c=currentCondition();
      let line=conditionLabel(c)+" · "+c.pitches.length+" notes";
      const best=NBEngine.bestFor(NBData.conditionKey(c));
      if(best&&settings.mode==="level")
        line+=" — "+(best.success?nbt("setup.bestSuccess"):nbt("setup.best",{level:best.level}));
      $(".nb-condline").textContent=line;
      paintClefs();
    }
    function paintClefs(){
      [...$(".nb-clefs").children].forEach(b=>{
        const on=b.dataset.c===settings.clef&&!settings.setId;
        b.classList.toggle("nb-on",on); b.setAttribute("aria-pressed",String(on));
        b.disabled=!!settings.setId; /* a set fixes its own clef */
      });
    }
    [...$(".nb-clefs").children].forEach(b=>b.onclick=()=>{ settings.clef=b.dataset.c; settings.setId=null; paintRange(); });

    function paintMode(){
      [...$(".nb-modes").children].forEach(b=>{
        const on=b.dataset.mode===settings.mode;
        b.classList.toggle("nb-on",on); b.setAttribute("aria-pressed",String(on)); });
      $(".nb-modedesc").textContent=settings.mode==="practice"
        ? nbt("setup.mode.practiceDesc")
        : nbt("setup.mode.levelDesc",{lives:NBData.LEVELS.lives});
      $(".nb-hintfield").style.display=settings.mode==="practice"?"":"none";
      $(".nb-roundsfield").style.display=settings.mode==="practice"?"":"none";
      $(".nb-musicfield").style.display=settings.mode==="level"?"":"none";
      paintRange();
    }
    [...$(".nb-modes").children].forEach(b=>b.onclick=()=>{ settings.mode=b.dataset.mode; paintMode(); });

    const snd=$(".nb-sound");
    NBData.SOUND_MODES.forEach(m=>{
      const o=document.createElement("option");
      o.value=m.id; o.textContent=nbt(m.nameKey);
      if(m.id===settings.sound) o.selected=true;
      snd.appendChild(o);
    });
    snd.onchange=()=>{ settings.sound=snd.value; };
    function chipToggle(sel,get,set){
      const row=$(sel);
      const paint=()=>[...row.children].forEach(x=>{
        const on=(x.dataset.m??x.dataset.h??x.dataset.r)===get();
        x.classList.toggle("nb-on",on); x.setAttribute("aria-pressed",String(on)); });
      [...row.children].forEach(b=>b.onclick=()=>{ set(b); paint(); });
      paint();
    }
    chipToggle(".nb-music",()=>settings.music?"1":"0",b=>{ settings.music=b.dataset.m==="1"; });
    chipToggle(".nb-hints",()=>settings.hints?"1":"0",b=>{ settings.hints=b.dataset.h==="1"; });
    chipToggle(".nb-rounds",()=>String(settings.rounds),b=>{ settings.rounds=+b.dataset.r; });

    paintMode();
    $(".nb-start").onclick=()=>startRound();
    /* chime:false everywhere in the game — no sounds the student didn't cause */
    if(window.Teacher) Teacher.say(nbt("mia.intro",{title:NB_CONFIG.TITLE}),{pose:"wave",chime:false});
  }

  /* ============================== ROUND / PLAY ============================== */
  function startRound(extra){
    const cond=(extra&&extra.condition)||currentCondition();
    const pool=(extra&&extra.pool)||buildPool(cond);
    session=NBEngine.createSession({
      pool, condition:cond,
      mode:(extra&&extra.mode)||settings.mode,
      rounds:(extra&&extra.rounds)||settings.rounds
    });

    root.innerHTML=`
    <section class="card nb-play">
      <div class="nb-hud">
        <span class="nb-hud-round"></span>
        <span class="nb-dots" aria-hidden="true"></span>
        <span class="nb-hud-lives" aria-label="chances left"></span>
        <span class="nb-hud-score"></span>
        <span class="nb-hud-spacer"></span>
        ${session.mode==="level"?`<button class="ghost nb-musicbtn" aria-label="${nbt("setup.music")}"></button>`:""}
        <button class="ghost nb-pause" aria-label="${nbt("hud.pause")}" style="display:${session.mode==="level"?"":"none"}">⏸ ${nbt("hud.pause")}</button>
        <button class="ghost nb-quit">${nbt("hud.quit")}</button>
      </div>
      <div class="nb-q" aria-live="polite"></div>
      <div class="nb-scene"><div class="nb-meadow" aria-hidden="true"></div><div class="nb-staff"></div>
        <div class="nb-pausedveil" hidden>${nbt("hud.paused")}</div>
        <div class="nb-leveltoast" hidden></div></div>
      <div class="nb-timerwrap">
        <span class="nb-timerlab">${nbt("hud.timerLabel")}</span>
        <div class="nb-timertrack" role="timer" aria-label="${nbt("hud.timerLabel")}"><div class="nb-timerfill"></div></div>
      </div>
      <div class="feedback nb-fb" aria-live="assertive"></div>
      <div class="nb-reveal"></div>
      <div class="nb-answerbar">
        <div class="choices chips nb-letters" role="group" aria-label="note-name answers"></div>
        <div class="nb-tools">
          ${session.mode==="practice"&&settings.hints?`<button class="ghost nb-hintbtn">💡 ${nbt("hud.hint")}</button>`:""}
          ${settings.sound==="appear"?`<button class="ghost nb-replay">🔁 ${nbt("hud.replay")}</button>`:""}
        </div>
      </div>
    </section>`;

    const row=$(".nb-letters");
    LETTERS.forEach(l=>{
      const b=document.createElement("button");
      b.textContent=l; b.dataset.l=l;
      b.setAttribute("aria-label","answer "+l);
      b.onclick=()=>tryAnswer(l);
      row.appendChild(b);
    });
    /* progress dots: practice = rounds; level = notes in the current level */
    const dots=$(".nb-dots");
    const nDots=session.mode==="level"?NBData.LEVELS.notesPerLevel:Math.min(15,session.rounds);
    for(let i=0;i<nDots;i++){ const d=document.createElement("span"); d.className="nb-dot"; dots.appendChild(d); }

    $(".nb-quit").onclick=()=>finishRound(true);
    const pauseBtn=$(".nb-pause");
    if(pauseBtn) pauseBtn.onclick=()=>togglePause();
    const hintBtn=$(".nb-hintbtn");
    if(hintBtn) hintBtn.onclick=()=>giveHint();
    const repBtn=$(".nb-replay");
    if(repBtn) repBtn.onclick=()=>{ if(scene&&scene.note) MFAudio.tone(scene.note.audio,.8,0,.5); };
    const musBtn=$(".nb-musicbtn");
    if(musBtn){ musBtn.onclick=()=>{ settings.music=!settings.music;
        if(settings.music) NBMusic.start(session.level); else NBMusic.stop(); paintMusicBtn(); };
      paintMusicBtn(); }

    /* untimed practice: no countdown pressure — hide the indicator entirely */
    if(session.mode==="practice") $(".nb-timerwrap").style.display="none";

    document.removeEventListener("keydown",onKey);
    document.addEventListener("keydown",onKey);
    document.removeEventListener("visibilitychange",onVis);
    document.addEventListener("visibilitychange",onVis);

    if(session.mode==="level"){
      if(settings.music) NBMusic.start(session.level);
      if(window.Teacher) Teacher.say(nbt("mia.levelIntro"),{pose:"point",chime:false});
    }
    nextQuestion();
  }

  function paintMusicBtn(){
    const b=$(".nb-musicbtn"); if(!b) return;
    b.textContent=settings.music?"🐦":"🔇";
    b.title=nbt(settings.music?"hud.musicOn":"hud.musicOff");
  }

  /* tab hidden → rAF stops but the wall clock doesn't: shift t0 by the hidden
     time so the bird resumes exactly where it was (no silent time-outs) */
  let hiddenAt=0;
  function onVis(){
    if(!scene) return;
    if(document.hidden){ hiddenAt=now(); NBMusic.stop(); }
    else if(hiddenAt){
      const dt=now()-hiddenAt; hiddenAt=0;
      if(scene.state==="fly") scene.t0+=dt;
      if(scene.state==="prep") scene.prepEnd+=dt;
      if(session&&session.mode==="level"&&settings.music&&!session.over) NBMusic.start(session.level);
    }
  }

  function onKey(e){
    if(e.repeat||e.metaKey||e.ctrlKey||e.altKey) return;
    const t=e.target&&e.target.tagName;
    if(t==="INPUT"||t==="SELECT"||t==="TEXTAREA") return;
    const l=e.key.toUpperCase();
    if(LETTERS.includes(l)&&session&&scene&&scene.state==="fly"){ e.preventDefault(); tryAnswer(l); }
  }

  /* ---------- scene: staff + tree + perch + red bird inside ONE svg ---------- */
  function buildScene(note){
    const el=$(".nb-staff");
    const cond=session.condition;
    /* whole note (instructor 2026-07-17): cleaner flash-card look, no stem */
    const api=Staff.render(el,{clef:cond.clef,
      notes:[{p:note.sci,d:"w",clef:note.clef,x:NOTE_X}],width:W});
    const svg=api.svg;
    /* tighten the frame to the real drawn content (grand staff reserves extra
       height we don't want), then extend for gate + runway + bird head-room */
    let bb; try{ bb=svg.getBBox(); }catch(e){ bb=null; }
    const vb=svg.getAttribute("viewBox").split(" ").map(Number);
    const cTop=bb&&bb.height?bb.y:vb[1], cH=bb&&bb.height?bb.height:vb[3];
    const yTop=Math.floor(cTop)-26, vH=Math.ceil(cH)+52;
    svg.setAttribute("viewBox",`${-EXTL} ${yTop} ${W+EXTL+EXTR} ${vH}`);
    svg.style.maxWidth="820px";
    const noteEl=svg.querySelector(".notegroup .note");
    const noteY=+noteEl.getAttribute("cy");

    const NS="http://www.w3.org/2000/svg";
    const g=(cls)=>{ const n=document.createElementNS(NS,"g"); if(cls)n.setAttribute("class",cls); return n; };

    /* TREE (instructor 2026-07-17, replaces the gate): a friendly cartoon tree
       on the left — leafy crown up top, trunk spanning the staff system.
       Correct answer → the bird sails past it; time-out → a soft head-bonk on
       the trunk with cartoon stars. Original artwork, no stock imagery. */
    const tree=g("nb-tree");
    const gTop=yTop+12, gH=vH-24;
    const tx=-56, tw=26, crownY=gTop+6;
    tree.innerHTML=
      `<path class="nb-trunk" d="M ${tx-tw/2} ${gTop+20} C ${tx-tw/2-3} ${gTop+gH*.5} ${tx-tw/2-6} ${gTop+gH-14} ${tx-tw/2-11} ${gTop+gH}
         L ${tx+tw/2+11} ${gTop+gH} C ${tx+tw/2+6} ${gTop+gH-14} ${tx+tw/2+3} ${gTop+gH*.5} ${tx+tw/2} ${gTop+20} Z"/>
       <circle class="nb-crown c2" cx="${tx-23}" cy="${crownY+12}" r="16"/>
       <circle class="nb-crown c2" cx="${tx+23}" cy="${crownY+13}" r="14"/>
       <circle class="nb-crown c1" cx="${tx}" cy="${crownY}" r="23"/>
       <circle class="nb-crown c3" cx="${tx-10}" cy="${crownY+17}" r="13"/>
       <circle class="nb-crown c3" cx="${tx+11}" cy="${crownY+16}" r="12"/>
       <path class="nb-grass" d="M ${tx-32} ${gTop+gH} q4 -11 8 0 q4 -9 8 0 q4 -11 8 0 q4 -9 8 0 q4 -11 8 0 q4 -9 8 0 q4 -11 8 0 Z"/>`;

    /* PERCH (right): a small leafy branch the bird sits on before take-off */
    const perch=g("nb-perch");
    const bY=yTop+34;
    perch.innerHTML=
      `<path class="nb-branchwood" d="M ${W+EXTR+2} ${bY-2} C ${W+42} ${bY-4} ${W+20} ${bY} ${W+6} ${bY+5} C ${W+22} ${bY+8} ${W+44} ${bY+4} ${W+EXTR+2} ${bY+7} Z"/>
       <circle class="nb-crown c2" cx="${W+EXTR-4}" cy="${bY-14}" r="13"/>
       <circle class="nb-crown c3" cx="${W+EXTR-22}" cy="${bY-9}" r="10"/>
       <circle class="nb-flower" cx="${W+20}" cy="${bY+1}" r="3"/>`;
    const perchY=bY-17;

    /* THE red Note Bird — same original character as the header (NBData.BIRD_SVG) */
    const bird=g("nb-bird st-wait");
    bird.innerHTML=NBData.BIRD_SVG+
      `<g class="nb-dizzy" opacity="0">
         <text class="nb-star" x="-15" y="-19">✦</text>
         <text class="nb-star" x="6" y="-25">✧</text>
         <text class="nb-star" x="-3" y="-15">✦</text>
         <text class="nb-star" x="13" y="-17">✧</text>
       </g>`;

    /* sparkles for a successful pass (hidden until used) */
    const spark=g("nb-spark"); spark.setAttribute("opacity","0");
    for(let i=0;i<5;i++){
      const t=document.createElementNS(NS,"text");
      t.setAttribute("class","nb-star");
      t.setAttribute("x",tx+18+(Math.random()*40-10));
      t.setAttribute("y",noteY+(Math.random()*44-22));
      t.textContent=i%2?"✦":"✧";
      spark.appendChild(t);
    }

    /* paint order: tree & perch BEHIND the bird (it flies in front of them),
       bird UNDER the target notegroup so the notehead always stays crisp */
    const noteGroup=svg.querySelector(".notegroup");
    svg.insertBefore(tree,noteGroup);
    svg.insertBefore(perch,noteGroup);
    svg.insertBefore(bird,noteGroup);
    svg.appendChild(spark);

    return {svg,api,bird,spark,noteY,perchY,gH,
            /* stopX: the bird's beak (≈30 units left of center at 1.3×) just
               touches the trunk — a soft bonk, never sinking into the tree */
            spawnX:W+EXTR-46, stopX:tx+tw/2+34, exitX:tx-90,
            note, state:"prep", t0:0, paused:false, pausedAt:0, noteHeard:false};
  }

  function setBirdState(st){
    if(scene&&scene.bird) scene.bird.setAttribute("class","nb-bird "+st);
  }

  /* ---------- animation loop (time-based) ---------- */
  function stopLoop(){ if(raf) cancelAnimationFrame(raf); raf=0; }
  function now(){ return performance.now(); }

  function questionText(){
    if(session.mode==="practice") return nbt("hud.questionPractice");
    return session.seconds()<=4.5? nbt("hud.questionExtreme") : nbt("hud.question");
  }

  function nextQuestion(){
    stopLoop();
    const note=session.next();
    if(!note){ finishRound(false); return; }
    scene=buildScene(note);
    paintHUD();
    $(".nb-fb").textContent=""; $(".nb-fb").className="feedback nb-fb";
    $(".nb-reveal").innerHTML="";
    setLetters(true);
    $(".nb-q").textContent=nbt("hud.getReady");
    $(".nb-timertrack").classList.remove("nb-low");
    scene.state="prep"; setBirdState("st-wait");
    scene.prepEnd=now()+NBData.PREP_MS;
    if(settings.sound==="appear"){ scene.noteHeard=true; MFAudio.tone(note.audio,.8,0,.5); }
    raf=requestAnimationFrame(tick);
  }

  function paintHUD(){
    if(session.mode==="level"){
      $(".nb-hud-round").textContent=nbt("hud.level",{n:session.level})+" · "+
        nbt("hud.note",{i:Math.min(session.inLevel+1,NBData.LEVELS.notesPerLevel),total:NBData.LEVELS.notesPerLevel});
      /* lives grow with levels — show hearts up to 5, then a compact count */
      $(".nb-hud-lives").textContent=session.lives<=5?"❤️".repeat(session.lives):"❤️×"+session.lives;
    }else{
      $(".nb-hud-round").textContent=nbt("hud.round",{n:session.qCount,total:session.rounds});
      $(".nb-hud-lives").textContent="";
    }
    const filled=session.mode==="level"?session.inLevel:Math.min(15,session.qCount-1);
    [...$(".nb-dots").children].forEach((d,i)=>d.classList.toggle("filled",i<filled));
    $(".nb-hud-score").textContent="★ "+nbt("hud.streak",{streak:session.streak});
  }

  function birdAt(x,y){ scene.bird.setAttribute("transform",`translate(${x},${y}) scale(1.3)`); }

  function tick(){
    raf=requestAnimationFrame(tick);
    if(!scene||scene.paused) return;
    const t=now();
    const bob=reduceMotion?0:Math.sin(t/280)*3;

    if(scene.state==="prep"){ /* the bird waits ON the branch */
      birdAt(scene.spawnX,scene.perchY+bob*0.4);
      if(t>=scene.prepEnd){
        scene.state="fly"; scene.t0=t; setBirdState("st-fly");
        $(".nb-q").textContent=questionText();
      }
      return;
    }
    if(scene.state==="fly"){
      const T=session.seconds()*1000;
      if(!T){ /* practice: the bird stays perched and waits */
        setBirdState("st-wait");
        birdAt(scene.spawnX,scene.perchY+bob*0.4);
        return;
      }
      const p=Math.min(1,(t-scene.t0)/T);
      /* take-off: glide from the branch down/up to the note's height, then level flight */
      const yy=p<0.15? scene.perchY+(scene.noteY-scene.perchY)*(p/0.15) : scene.noteY;
      const x=scene.spawnX+(scene.stopX-scene.spawnX)*p;
      /* the bird sounds the note as it flies past the notehead — the note is
         heard exactly ONCE per question (instructor) */
      if(!scene.noteHeard&&x<=NOTE_X&&settings.sound!=="off"){
        scene.noteHeard=true; MFAudio.tone(scene.note.audio,.6,0,.4); }
      birdAt(x,yy+bob);
      $(".nb-timerfill").style.width=((1-p)*100)+"%";
      $(".nb-timertrack").classList.toggle("nb-low",p>0.75);
      if(p>=1) doTimeout();
      return;
    }
    if(scene.state==="pass"){ /* the bird sails past the tree and away, sparkling */
      const p=Math.min(1,(t-scene.t0)/700);
      const x=scene.passX+(scene.exitX-scene.passX)*p;
      const yy=scene.passY0+(scene.noteY-scene.passY0)*Math.min(1,p/0.5);
      birdAt(x,yy+bob);
      scene.bird.setAttribute("opacity",String(1-Math.max(0,p-.75)*4));
      scene.spark.setAttribute("opacity",String(p<.2?p*5:Math.max(0,1-(p-.2)/.8)));
      return;
    }
    if(scene.state==="bump"){ /* gentle bounce back + cartoon stars — never a hurt bird */
      const e=t-scene.t0;
      const k=Math.min(1,e/500);
      const back=reduceMotion?10:Math.sin(k*Math.PI)*14;
      birdAt(scene.stopX+back,scene.noteY+bob);
      scene.bird.querySelector(".nb-dizzy").setAttribute("opacity",String(e<1400?1:Math.max(0,1-(e-1400)/300)));
      if(e>1700){ scene.state="wait"; setBirdState("st-wait"); } /* recovered */
      return;
    }
  }

  function setLetters(on){
    [...$(".nb-letters").children].forEach(b=>{
      b.disabled=!on; b.classList.remove("right","wrongpick");
    });
  }

  function levelToast(msg){
    const el=$(".nb-leveltoast"); if(!el) return;
    el.textContent=msg; el.hidden=false;
    el.classList.remove("nb-toastin"); void el.offsetWidth; el.classList.add("nb-toastin");
    setTimeout(()=>{ el.hidden=true; },1600);
  }

  function tryAnswer(letter){
    if(!scene||scene.state!=="fly") return;
    const T=session.seconds();
    const elapsed=T?now()-scene.t0:now()-(scene.prepEnd||now());
    const res=session.answer(letter,Math.max(0,Math.round(elapsed)));
    const btn=$(`.nb-letters button[data-l="${letter}"]`);

    if(res.correct){
      setLetters(false); if(btn) btn.classList.add("right");
      scene.api.highlight(0);
      sfxCorrect(); /* ding-dong-dang */
      /* the note plays once per question — only if it hasn't been heard yet
         (practice: the perched bird never crossed the notehead) */
      if(settings.sound!=="off"&&!scene.noteHeard){
        scene.noteHeard=true; MFAudio.tone(scene.note.audio,.7,.45,.45); }
      const fb=$(".nb-fb");
      fb.textContent="✓ "+nbt("fb.correctIs",{name:noteName(scene.note)});
      fb.className="feedback nb-fb ok";
      if(session.mode==="practice") showReveal(scene.note);
      scene.state="pass"; scene.t0=now(); scene.passX=birdX(); scene.passY0=birdY();
      setBirdState("st-pass");
      paintHUD();
      if(res.levelUp){
        levelToast(nbt("hud.levelUp",{n:session.level})+(res.heartGained?"  "+nbt("hud.heartGain"):""));
        NBMusic.setLevel(session.level);
      }
      const dly=session.mode==="practice"?NBData.FEEDBACK.practiceCorrectMs:NBData.FEEDBACK.correctMs;
      if(res.over&&res.success){ setTimeout(()=>finishRound(false),Math.max(1400,dly)); }
      else setTimeout(nextQuestion,dly);
      return;
    }

    /* wrong */
    sfxWrong(); /* "ddaeng" */
    if(btn){ btn.classList.add("wrongpick"); setTimeout(()=>btn.classList.remove("wrongpick"),700); }
    const fb=$(".nb-fb");
    if(session.mode==="level"){
      fb.textContent="✗ "+nbt("fb.wrongLife",{picked:letter,left:res.livesLeft})+
        (res.livesLeft===1?" "+nbt("fb.lastLife"):"");
    }else{
      fb.textContent="✗ "+nbt("fb.practiceWrong");
    }
    fb.className="feedback nb-fb no";
    paintHUD();
    if(res.over){ setLetters(false); setTimeout(()=>finishRound(false),1300); return; }
    if(session.mode==="practice"&&!reduceMotion){
      scene.paused=true; setTimeout(()=>{ if(scene) scene.paused=false; },NBData.FEEDBACK.wrongPauseMs);
    }
  }

  function birdX(){
    const tr=scene.bird.getAttribute("transform")||"";
    const m=tr.match(/translate\(([-\d.]+)/);
    return m?+m[1]:scene.stopX;
  }
  function birdY(){
    const tr=scene.bird.getAttribute("transform")||"";
    const m=tr.match(/translate\([-\d.]+[, ]+([-\d.]+)/);
    return m?+m[1]:scene.noteY;
  }

  function doTimeout(){
    const res=session.timeout();
    setLetters(false);
    scene.state="bump"; scene.t0=now(); setBirdState("st-bump");
    const fb=$(".nb-fb");
    fb.textContent="⏰ "+nbt("fb.timeout",{name:noteName(scene.note)});
    fb.className="feedback nb-fb no";
    scene.api.highlight(0);
    sfxWrong(); /* falling slide on the tree-bump; no note replay — heard in flight */
    paintHUD();
    if(res.over) setTimeout(()=>finishRound(false),NBData.FEEDBACK.timeoutMs);
    else setTimeout(nextQuestion,NBData.FEEDBACK.timeoutMs);
  }

  function noteName(n){
    const base=n.letter+(n.accidental?n.accidental.replace("#","♯").replace("b","♭"):"");
    const extra=n.sci==="C4"?" — "+nbt("misc.middleC"):"";
    return base+" ("+n.sci+")"+extra;
  }

  /* Practice reveal: note name + the key on a C-to-C keyboard (complete
     black-key groups per studio rule: ranges start/end on C). */
  function showReveal(note){
    const el=$(".nb-reveal");
    el.innerHTML=`<div class="nb-revealkb"></div>`;
    const startC=12*Math.floor(note.midi/12);
    Keyboard.create(el.querySelector(".nb-revealkb"),{start:startC,octaves:2,labels:true,marks:[note.midi]});
  }

  function giveHint(){
    if(!scene||scene.state!=="fly") return;
    session.useHint();
    const cond=session.condition;
    let msg=NBEngine.landmarkHint(scene.note);
    if(cond.setId) msg+=" "+nbt("hint.mnemonic",{word:cond.word});
    if(window.Teacher) Teacher.say(msg,{pose:"think",chime:false});
    else { const fb=$(".nb-fb"); fb.textContent="💡 "+msg; fb.className="feedback nb-fb"; }
  }

  function togglePause(){
    if(!scene) return;
    scene.paused=!scene.paused;
    if(scene.paused){ scene.pausedAt=now(); NBMusic.stop(); }
    else { if(scene.state==="fly") scene.t0+=now()-scene.pausedAt;
      if(scene.state==="prep") scene.prepEnd+=now()-scene.pausedAt;
      if(session.mode==="level"&&settings.music) NBMusic.start(session.level); }
    $(".nb-pausedveil").hidden=!scene.paused;
    $(".nb-pause").textContent=scene.paused?"▶ "+nbt("hud.resume"):"⏸ "+nbt("hud.pause");
  }

  /* ============================== RESULTS ============================== */
  function finishRound(aborted){
    stopLoop(); NBMusic.stop();
    document.removeEventListener("keydown",onKey);
    const s=session.stats();
    const cond=session.condition;
    if(!s.notesRead){ showSetup(); return; }

    const condKey=NBData.conditionKey(cond);
    const stu=studentSession();
    const runRec={
      date:new Date().toISOString(), game:NB_CONFIG.TITLE, version:NB_CONFIG.VERSION,
      student:stu?{name:stu.name,class:stu.class||null,classCode:stu.classCode||null}:null,
      mode:s.mode, condition:conditionLabel(cond), condKey,
      level:s.level, success:s.success,
      notesRead:s.notesRead, accuracy:s.accuracy,
      avgMs:s.avgMs, fastestMs:s.fastestMs, bestStreak:s.bestStreak,
      wrong:s.wrongAttempts, timeouts:s.timeouts, hintsUsed:s.hintsUsed,
      missed:Object.keys(s.missed), answerMethod:"letters+keyboard"
    };
    const isNewBest=NBEngine.saveRun(condKey,runRec);
    /* Server sync intentionally OFF (owner 2026-07-17: casual game, no need to
       save to the cloud). Records stay on this device only — best level per
       condition + missed-note review. To re-enable: load nb-sync.js in
       note-bird.html and call NBSync.push(runRec) here. */

    const ms=v=>v==null?"—":(v/1000).toFixed(1)+"s";
    const clefRow=["treble","bass"].map(c=>{
      const d=s.byClef[c]; if(!d.n) return "";
      return `<span class="nb-chip">${nbt("misc."+c)}: ${d.ok}/${d.n}</span>`; }).join("");
    const posRow=["line","space"].map(p=>{
      const d=s.byPos[p]; if(!d.n) return "";
      return `<span class="nb-chip">${nbt(p==="line"?"res.lines":"res.spaces")}: ${d.ok}/${d.n}</span>`; }).join("");
    const missedIds=Object.keys(s.missed);

    const headline=s.mode==="level"
      ? (s.success
          ? `<div class="nb-successbanner">🎉 ${nbt("res.successTitle")}</div>`
          : `<div class="score-big">${nbt("res.reached",{level:s.level})}</div>`)
      : `<div class="stars" aria-label="${s.stars} stars">${s.stars>0?"⭐".repeat(s.stars):""}</div>
         <div class="score-big">${s.accuracy}%</div><p>${nbt("res.accuracy")}</p>`;

    root.innerHTML=`
    <section class="card nb-results">
      <h2>${nbt("res.title")}</h2>
      <div class="score-box">
        ${headline}
        ${s.mode==="level"&&isNewBest?`<p class="nb-newbest">🏅 ${nbt("res.newBest")}</p>`:""}
        <p style="margin-top:6px"><b>${nbt("res.condition")}:</b> ${conditionLabel(cond)}</p>
      </div>
      <div class="nb-statgrid">
        <div><b>${s.notesRead}</b><span>${nbt("res.notesRead")}</span></div>
        <div><b>${s.firstTry}</b><span>${nbt("res.correct")}</span></div>
        <div><b>${s.wrongAttempts}</b><span>${nbt("res.wrong")}</span></div>
        <div><b>${s.timeouts}</b><span>${nbt("res.timeouts")}</span></div>
        <div><b>${s.bestStreak}</b><span>${nbt("res.bestStreak")}</span></div>
        <div><b>${ms(s.avgMs)}</b><span>${nbt("res.avgTime")}</span></div>
      </div>
      <div class="nb-chiprow">${clefRow}${posRow}
        ${s.hintsUsed?`<span class="nb-chip">💡 ${nbt("res.hints")}: ${s.hintsUsed}</span>`:""}</div>
      <hr class="sep">
      <h2>${nbt("res.missedTitle")}</h2>
      ${missedIds.length?`<div class="nb-missedgrid"></div>`:`<p>${nbt("res.noMissed")}</p>`}
      <div class="navrow" style="margin-top:22px">
        <a href="#" class="nb-again">▶ ${nbt("res.playAgain")}</a>
        ${missedIds.length?`<a href="#" class="nb-pm">🎯 ${nbt("res.practiceMissed")}</a>`:""}
        <a href="#" class="nb-settings">⚙ ${nbt("res.changeSettings")}</a>
      </div>
    </section>`;

    const pool=session.pool;
    const grid=$(".nb-missedgrid");
    if(grid) missedIds.forEach(id=>{
      const n=pool.find(x=>x.id===id); if(!n) return;
      const card=document.createElement("div"); card.className="nb-misscard";
      const st=document.createElement("div");
      card.appendChild(st);
      const cap=document.createElement("div"); cap.className="nb-misscap";
      cap.innerHTML=`<b>${noteName(n)}</b> <span>${nbt("res.missedTimes",{n:s.missed[id]})}</span>`;
      card.appendChild(cap);
      card.onclick=()=>MFAudio.tone(n.audio,.7,0,.5);
      grid.appendChild(card);
      Staff.render(st,{clef:n.clef,notes:[{p:n.sci,d:"w"}],width:170});
    });

    $(".nb-again").onclick=e=>{ e.preventDefault(); startRound(); };
    $(".nb-settings").onclick=e=>{ e.preventDefault(); showSetup(); };
    const pm=$(".nb-pm");
    if(pm) pm.onclick=e=>{
      e.preventDefault();
      const missedPool=pool.filter(n=>missedIds.includes(n.id));
      startRound({pool:missedPool, condition:cond, mode:"practice",
        rounds:Math.min(12,Math.max(4,missedPool.length*2))});
    };

    if(window.Teacher){
      if(s.mode==="level"){
        const key=s.success?"mia.success":(s.level>=5?"mia.goodRun":"mia.earlyRun");
        Teacher.say(nbt(key,{level:s.level}),{pose:s.success?"celebrate":"wave",proactive:true,chime:false});
        if(s.success) Teacher.celebrate();
      }else{
        Teacher.say(nbt(s.stars>=2?"mia.practiceGood":"mia.practiceMore"),{pose:"wave",proactive:true,chime:false});
      }
    }
    if(s.success) MFAudio.yay();
  }

  /* ============================== BOOT ============================== */
  function init(el){
    root=el;
    document.title=NB_CONFIG.TITLE+" · Game Lab";
    document.querySelectorAll("[data-nb-title]").forEach(n=>n.textContent=NB_CONFIG.TITLE);
    /* the SAME red bird everywhere: inject the shared mark into header slots */
    document.querySelectorAll(".nb-birdmark").forEach(n=>{ n.innerHTML=NBData.birdMark(n.dataset.w?+n.dataset.w:44); });
    if(location.search.indexOf("check")>=0) console.log("NBData.validate:",NBData.validate());
    showSetup();
  }
  return {init};
})();

document.addEventListener("DOMContentLoaded",()=>{
  const el=document.getElementById("nbApp");
  if(el) NBUI.init(el);
});
