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
   Tree" indicator (hidden when untimed); A–G piano-key answers with
   focus/check/nudge states; feedback delays from NBData.FEEDBACK.
   The bird/tree live INSIDE the staff SVG so vertical alignment with the
   target note is exact at every screen size. Flight is time-based.
   Time-out = gentle bump + cartoon stars — the bird is NEVER hurt; no screen
   shake or flashes. A run is a RECORD, not a test.
   v0.5 (usability review 2026-07-26):
     - First-time default = Beginner (Practice · Treble · C4–G4 · letter
       buttons); "🐣 Beginner Start" flies immediately, "⚙ Customize" opens
       the full setup. A returning player's last settings persist locally.
     - MIDI: explicit Connect button + visible connection states + device
       name in setup; the game never claims a keyboard is ready without one.
     - Microphone: full setup step BEFORE any timed round (enable → level
       meter → play one test note → ready / continue-without); the bird
       timer never runs while permission or testing is in progress.
       Selecting mic mode forces Background birdsong OFF (visibly, control
       disabled) and restores the previous choice on leaving mic mode.
     - A zero-correct round gets neutral encouragement, never "New best".
   v0.6 (2026-07-31): ALTO and TENOR clef chips in setup (staff.js v8.8 draws
   the C clef); results "By clef" row covers all four clefs.
   v0.7 (instructor 2026-07-31): the "Answer with" picker (buttons/MIDI/mic)
   sits on the FIRST screen, outside Customize — tablet/phone students rarely
   open the full form, and 🎤 instrument answering must be one tap away.
   Beginner Start honors the picked input; both start buttons gate on mic
   readiness (paintStart). Default input stays Letter buttons.
   v0.11 (instructor 2026-07-31): ONE flat setup page — Beginner Start and
   Customize are GONE; Answer with + Clef + Note range always show with their
   defaults pre-selected (solid-fill .nb-on styling in notebird.css v31 makes
   the picked chip/card unmistakable) and ▶ Start sits below.
   v0.15 (instructor 2026-08-01): the Flight-record REVIEW PAGE IS GONE —
   the run ends ON the game screen with a Staff-Wars-style overlay:
   GAME OVER / Level-10 win line, the ▲▼ range-tweak widget (C2–C6 bounds,
   min 5-note span, hidden for letter-set rounds), then START / QUIT.
   START saves any tweaked range and relaunches; QUIT returns to setup.
   Runs still record to device-local bests.
   v0.12 (instructor 2026-07-31): BARE setup — sign-in line, game-info line,
   MIDI chip and the under-chip description are all gone (MIDI/mic code stays;
   only the chip was removed). Default range is the full grand staff C2–C6
   again (one-time migration flag nb-defc2c6 moves older saves over once).
   v0.10 (instructor 2026-07-31, student reviews "too complicated"): all
   setup copy cut to one short line each (nb-strings).
   v0.8 (instructor 2026-07-31, "단순하게"): SETUP SIMPLIFIED — the mode,
   rounds, note-sound, birdsong and hints fields are GONE. Every run is the
   Level Game (note sound on, birdsong on by default; HUD 🐦 mutes). Saved
   settings are coerced at load. Practice mode survives only as the results
   screen's "Practice Missed Notes" (untimed, hints on, keyboard reveal).
   Customize now holds just Clef + Note range/quick picks/sets.
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
  /* Beginner defaults (usability review): a brand-new student gets the
     gentlest start. The old expert default (Level · Grand · C2–C6 · 29
     notes) is one Customize away and still fully available. */
  const SETTINGS_LS="nb-settings-v1";
  /* v0.13 default = TREBLE G3–A5, the violin beginner range (instructor
     2026-07-31 — open G string to A5; quick picks change it in one tap) */
  const BEGINNER={ mode:"level", clef:"treble", a:"G3", b:"A5", setId:null,
                   rounds:10, sound:"after", music:NBData.MUSIC_DEFAULT, hints:true };
  let hasSaved=false;
  let settings=(()=>{
    try{ const s=JSON.parse(localStorage.getItem(SETTINGS_LS));
      if(s&&s.mode){ hasSaved=true; return Object.assign({},BEGINNER,s); } }catch(e){}
    return Object.assign({},BEGINNER);
  })();
  /* v0.8 simplification (instructor 2026-07-31): setup no longer offers
     mode / rounds / note-sound / birdsong / hints — every run is the LEVEL
     GAME, note sound on, birdsong on (HUD 🐦 still mutes), 10 rounds if a
     practice round ever runs. Practice survives ONLY as the results screen's
     "Practice Missed Notes". Coercing here also repairs older saved settings
     (including music:false parked by past mic sessions). */
  Object.assign(settings,{mode:"level",rounds:10,sound:"after",hints:true,music:true});
  const saveSettingsEarly=()=>{ try{ localStorage.setItem(SETTINGS_LS,JSON.stringify(settings)); }catch(e){} };
  /* one-time move to the violin-range default G3–A5 treble (players who saved
     older settings get it once; after that their own choices stick again).
     Supersedes the short-lived nb-defc2c6 migration. */
  try{ if(!localStorage.getItem("nb-defg3a5")){
    settings.clef="treble"; settings.a="G3"; settings.b="A5"; settings.setId=null;
    saveSettingsEarly(); localStorage.setItem("nb-defg3a5","1"); } }catch(e){}
  const saveSettings=()=>{ try{ localStorage.setItem(SETTINGS_LS,JSON.stringify(settings)); }catch(e){} };
  /* birdsong preference parked while mic mode forces it off */
  let micPrevMusic=null;
  /* instrument rounds silence the game's note sound at RUNTIME only — this
     flag must never be written into settings/saved (a past version did, which
     left iPads permanently silent even back in buttons mode) */
  let instSilent=false;
  /* one-time repair for settings poisoned by that bug: sound:"off" had been
     saved invisibly; restore the default. A student who really wants Visual
     only just picks it again once. */
  try{ if(settings.sound==="off"&&!localStorage.getItem("nb-fix-sound24")){
    settings.sound="after"; saveSettings(); } localStorage.setItem("nb-fix-sound24","1"); }catch(e){}

  /* Theory Lab student session (same sign-in as the lessons; set by student.html
     via lms.js). Read-only here: the game shows who is signed in and tags its
     LOCAL records with the student — it never writes to the academic LMS. */
  function studentSession(){
    try{ return JSON.parse(localStorage.getItem("mf-lms-session"))||null; }
    catch(e){ return null; }
  }

  /* "Big screen" toggle (instructor 2026-07-17: kids play on phones; the button
     must be VISIBLE and WORK everywhere). iOS Safari has NO element Fullscreen
     API, so the reliable effect is a CSS fill of the whole viewport
     (body.nb-fill) — that works on every device and any orientation. We ALSO
     try the real Fullscreen API as a bonus where it exists (Android/desktop, to
     also hide the browser's own chrome). So: button always shown, always does
     something. */
  function toggleBigScreen(){
    const on=document.body.classList.toggle("nb-fill");
    const d=document, el=d.documentElement;
    try{
      if(on){ const rq=el.requestFullscreen||el.webkitRequestFullscreen;
        if(rq){ const p=rq.call(el); if(p&&p.catch) p.catch(()=>{}); } }
      else { const ex=d.exitFullscreen||d.webkitExitFullscreen;
        if(ex&&(d.fullscreenElement||d.webkitFullscreenElement)){ const p=ex.call(d); if(p&&p.catch) p.catch(()=>{}); } }
    }catch(e){}
    paintFsBtn();
  }
  function exitBigScreen(){
    document.body.classList.remove("nb-fill");
    const d=document;
    try{ if((d.exitFullscreen||d.webkitExitFullscreen)&&(d.fullscreenElement||d.webkitFullscreenElement))
      (d.exitFullscreen||d.webkitExitFullscreen).call(d); }catch(e){}
  }
  function paintFsBtn(){
    const b=$(".nb-fs"); if(!b) return;
    const on=document.body.classList.contains("nb-fill");
    b.textContent=on?"✕":"⛶";
    b.setAttribute("aria-label",nbt(on?"hud.exitFullscreen":"hud.fullscreen"));
    b.title=b.getAttribute("aria-label");
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
    if(window.NBInput) NBInput.stopRound();   /* mic/MIDI never outlive a round */
    document.body.classList.remove("nb-playing"); /* back to normal page layout */
    exitBigScreen();
    root.innerHTML=`
    <section class="card nb-setup">
      <h2>${nbt("setup.title")}</h2>
      <!-- v0.12 (instructor 2026-07-31): BARE setup — no sign-in line, no
           game-info line, no MIDI chip (MIDI still works in code; the chip
           returns if ever wanted), no description under the chips. -->
      <div class="nb-field nb-inputfield"><div class="nb-lab">${nbt("setup.input")}</div>
        <div class="choices chips nb-inputchips">
          <button data-i="buttons">🔤 ${nbt("setup.input.buttons")}</button>
          <button data-i="mic">🎤 ${nbt("setup.input.mic")}</button>
        </div>
        <div class="nb-instpanel" aria-live="polite"></div>
        <p class="nb-inputnote nb-sublab" aria-live="polite"></p></div>
      <div class="nb-field"><div class="nb-lab">${nbt("setup.clef")}</div>
        <div class="choices chips nb-clefs">
          <button data-c="auto">${nbt("setup.clef.auto")}</button>
          <button data-c="treble">𝄞 ${nbt("misc.treble")}</button>
          <button data-c="bass">𝄢 ${nbt("misc.bass")}</button>
          <button data-c="alto">𝄡 ${nbt("misc.alto")}</button>
          <button data-c="tenor">𝄡 ${nbt("misc.tenor")}</button>
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
      <div style="text-align:center;margin-top:14px"><button class="play nb-start">▶ ${nbt("setup.start")}</button>
        <p class="nb-startnote nb-sublab" aria-live="polite"></p></div>
      <p class="nb-rotatehint">${nbt("setup.rotateHint")}</p>
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

    /* v0.8: no mode / rounds / sound / music / hints fields — level game only;
       their settings are coerced at load and practice lives on solely through
       the results screen's "Practice Missed Notes" (hints always on there). */

    /* the round may only start when the chosen input is actually usable —
       in mic mode that means the microphone setup finished (or was skipped) */
    function paintStart(){
      const needMic=window.NBInput&&NBInput.mode()==="mic"&&!NBInput.micReady();
      const b=$(".nb-start"); if(b) b.disabled=!!needMic;
      [$(".nb-startnote"),$(".nb-inputnote")].forEach(n=>{ if(n) n.textContent=needMic?nbt("mic.needSetup"):""; });
    }

    /* answer-input picker (letter buttons / MIDI keyboard / real-piano mic);
       unsupported choices hide themselves, buttons always keep working */
    if(window.NBInput){
      const row=$(".nb-inputchips");
      /* the MIDI chip is gone (v0.12) — a previously saved midi mode falls
         back to buttons so no invisible mode stays active */
      if(NBInput.mode()==="midi") NBInput.setMode("buttons");
      [...row.children].forEach(b=>{
        if(b.dataset.i==="mic"&&!NBInput.micSupported()) b.style.display="none";
      });

      /* ----- MIDI status panel: explicit connect, visible states ----- */
      function midiPanel(host){
        const st=NBInput.midiState();
        const line=st.status==="on"?nbt("midi.st.on",{names:st.names.join(", ")})
                  :nbt("midi.st."+(st.status==="idle"?"idle":st.status));
        host.innerHTML=`
          <p class="nb-sublab" style="margin:6px 0">${line}</p>
          ${st.status==="on"?"":`<button class="ghost nb-midiconnect">${nbt("midi.connectBtn")}</button>`}`;
        const b=host.querySelector(".nb-midiconnect");
        if(b) b.onclick=()=>NBInput.connectMIDI(()=>{ if(NBInput.mode()==="midi") midiPanel(host); });
      }

      /* ----- microphone setup panel: runs BEFORE any timed round ----- */
      function micPanel(host){
        if(NBInput.micReady()){
          host.innerHTML=`
            <p class="nb-sublab" style="margin:6px 0">${nbt("mic.privacy")}</p>
            <p style="font-weight:700;margin:6px 0">${nbt("mic.ready")}</p>
            <button class="ghost nb-micskip">${nbt("mic.continueWithout")}</button>`;
        }else{
          host.innerHTML=`
            <p class="nb-sublab" style="margin:6px 0">${nbt("mic.privacy")}</p>
            <div class="nb-micflow">
              <button class="play nb-micenable">${nbt("mic.enable")}</button>
              <button class="ghost nb-micskip">${nbt("mic.continueWithout")}</button>
            </div>
            <div class="nb-mictest" hidden>
              <p class="nb-sublab" style="margin:8px 0 4px">${nbt("mic.level")}</p>
              <div style="height:12px;border-radius:9999px;background:#eee5cd;overflow:hidden;max-width:340px">
                <div class="nb-miclevel" style="height:100%;width:0%;background:linear-gradient(90deg,#5ee39a,#1f9d55);border-radius:9999px"></div>
              </div>
              <p style="margin:8px 0 0;font-weight:700">${nbt("mic.testHint")}</p>
              <p class="nb-micheard" aria-live="polite" style="margin:4px 0 0;min-height:20px"></p>
              <p class="nb-micdiag nb-sublab" style="margin:6px 0 0;font-feature-settings:'tnum'"></p>
            </div>`;
        }
        const skip=host.querySelector(".nb-micskip");
        if(skip) skip.onclick=()=>{ NBInput.micSetupDone(false); NBInput.setMode("buttons"); paintInput(); };
        const en=host.querySelector(".nb-micenable");
        if(en) en.onclick=async()=>{
          en.disabled=true; en.textContent=nbt("mic.requesting");
          const testBox=host.querySelector(".nb-mictest");
          /* v0.9 (first real-device test 2026-07-31): NOTHING here may hang or
             throw the UI into a dead "Requesting…" state — micTestStart now
             times out / reports errors, and any failure re-enables the button
             (tap to retry) and prints the reason for classroom debugging */
          let ok=false, frames=0, loud=0, maxRms=0, busyShown=false;
          try{ ok=await NBInput.micTestStart(f=>{
            const lvl=host.querySelector(".nb-miclevel");
            /* perceptual (sqrt) scale — quiet-but-real input visibly moves the
               bar instead of barely twitching (instructor's iPad, 2026-08-07) */
            if(f.rms!=null&&lvl) lvl.style.width=Math.min(100,Math.sqrt(Math.min(1,f.rms))*230)+"%";
            if(f.rms!=null) maxRms=Math.max(maxRms,f.rms);
            /* live plumbing readout — turns a silent iPad into a readable
               reason (suspended ctx / 0 frames / rate mismatch) */
            if(f.rms!=null&&(++frames%8===1)){
              const d=NBInput.micDiag&&NBInput.micDiag();
              const el=host.querySelector(".nb-micdiag");
              if(d&&el) el.textContent=`audio ${d.state} · ${d.path} · ctx ${d.ctxRate}${d.trackRate?"/mic "+d.trackRate:""} · frames ${frames} · level ${(f.rms||0).toFixed(3)}${d.muted?" · MUTED":""}`;
              /* the classroom case from the instructor's iPad photo: pipeline
                 alive, thousands of frames, level EXACTLY 0.000 — iOS gave
                 the mic to another tab/app and feeds this one pure silence.
                 Say so instead of letting the student stare at a dead meter. */
              const heard=host.querySelector(".nb-micheard");
              const silentMuted=d&&d.muted || (frames>=240&&maxRms===0);
              if(heard){
                if(silentMuted&&!busyShown){ heard.textContent=nbt("mic.busy"); busyShown=true; }
                else if(busyShown&&maxRms>0){ heard.textContent=""; busyShown=false; }
              }
            }
            /* PASS = a confidently-named note (best), OR simply enough real
               input level — on devices where pitch confidence stays shy the
               student must still be able to start (2026-08-07, iPad) */
            if(f.note){
              const heard=host.querySelector(".nb-micheard");
              if(heard) heard.textContent="🎵 "+nbt("mic.heard",{note:f.note+" ("+f.note+String(Math.floor(f.midi/12)-1)+")"});
              NBInput.micSetupDone(true);
              micPanel(host); paintStart();
            } else if(f.rms>=0.006&&!NBInput.micReady()){
              /* threshold matched to real iPad levels (boosted ≈.005–.012):
                 the bar danced but 0.015 was never reached (2026-08-07) */
              if(++loud>=12){ NBInput.micSetupDone(true); micPanel(host); paintStart(); }
            }
          }); }catch(e){ ok=false; }
          if(!ok){
            en.textContent=nbt("mic.denied"); en.disabled=false; /* tap = try again */
            const err=NBInput.micError&&NBInput.micError();
            if(err){ let el=host.querySelector(".nb-micerr");
              if(!el){ el=document.createElement("p"); el.className="nb-micerr nb-sublab";
                en.parentNode.appendChild(el); }
              el.textContent="("+err+")"; }
            return; }
          if(testBox) testBox.hidden=false;
          en.style.display="none";
        };
      }

      const paintInput=()=>{
        [...row.children].forEach(b=>{
          const on=b.dataset.i===NBInput.mode();
          b.classList.toggle("nb-on",on); b.setAttribute("aria-pressed",String(on)); });
        /* instrument input plays its OWN sound — the game's note sound goes
           silent at RUNTIME ONLY so the mic can't hear the game (never write
           "off" into settings: it would persist — the old iPad bug) */
        instSilent=NBInput.mode()!=="buttons";
        /* mic mode parks birdsong OFF (no setup control anymore; the HUD 🐦
           button still shows/toggles it) — previous choice returns on leaving */
        const mic=NBInput.mode()==="mic";
        if(mic){ if(micPrevMusic===null) micPrevMusic=settings.music; settings.music=false; }
        else if(micPrevMusic!==null){ settings.music=micPrevMusic; micPrevMusic=null; }
        /* per-mode status/setup panel */
        const panel=$(".nb-instpanel"); panel.innerHTML="";
        if(NBInput.mode()==="midi") midiPanel(panel);
        if(mic) micPanel(panel);
        paintStart();
      };
      [...row.children].forEach(b=>b.onclick=()=>{ NBInput.setMode(b.dataset.i); paintInput(); });
      paintInput();
    } else $(".nb-inputfield").style.display="none";

    paintRange();
    paintStart();
    $(".nb-start").onclick=()=>{ saveSettings(); hasSaved=true; startRound(); };
    /* chime:false everywhere in the game — no sounds the student didn't cause */
    if(window.Teacher) Teacher.say(nbt("mia.intro",{title:NB_CONFIG.TITLE}),{pose:"wave",chime:false});
  }

  /* ============================== ROUND / PLAY ============================== */
  function startRound(extra){
    finished=false;
    /* iOS/Safari audio unlock: create+resume the AudioContext INSIDE this
       Start tap — without it, sounds scheduled later from the animation loop
       (bird passing the note) can stay silent on iPad */
    try{ MFAudio.ac(); }catch(e){}
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
        <span class="nb-hud-acc" aria-label="questions answered and accuracy"></span>
        <span class="nb-hud-spacer"></span>
        <button class="ghost nb-fs" aria-label="${nbt("hud.fullscreen")}" title="${nbt("hud.fullscreen")}">⛶</button>
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
      <div class="nb-gameover" hidden></div>
    </section>`;

    /* answers = plain A–G letter buttons (instructor 2026-07-30: the piano-key
       bar read too small on iPad — back to big letters, sized up on tablets).
       Instrument input (MIDI / mic) still answers through NBInput below. */
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
    const fsBtn=$(".nb-fs");
    if(fsBtn){ fsBtn.onclick=()=>toggleBigScreen(); paintFsBtn(); }

    /* mark the page as "in play" so the landscape CSS can fill the screen
       (hide the header banner, size the card to the viewport) */
    document.body.classList.add("nb-playing");

    /* untimed practice: no countdown pressure — hide the indicator entirely */
    if(session.mode==="practice") $(".nb-timerwrap").style.display="none";

    document.removeEventListener("keydown",onKey);
    document.addEventListener("keydown",onKey);
    /* instrument input: MIDI note-on / real-piano mic detection feed the
       same tryAnswer() as the letter buttons (which keep working). The mic
       pipeline was already opened and TESTED in setup, so nothing here
       waits on a permission popup while the timer runs. */
    instSilent=!!(window.NBInput&&NBInput.mode()!=="buttons"); /* covers restarts that skip setup */
    if(instSilent){
      NBInput.enableForRound(a=>tryAnswer(a.letter,a.midi)).then(got=>{
        if(got!==NBInput.mode())
          levelToast(nbt(NBInput.mode()==="midi"?"setup.input.midiNone":"setup.input.micFail"));
      });
    }
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
    /* mic mode keeps birdsong off — the toggle is disabled during play too */
    const mic=window.NBInput&&NBInput.mode()==="mic";
    b.disabled=!!mic; if(mic){ b.textContent="🔇"; }
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
    if(settings.sound==="appear"&&!instSilent){ scene.noteHeard=true; MFAudio.tone(note.audio,.8,0,.5); }
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
    /* running "solved / accuracy" readout (instructor 2026-08-07, like the
       classic drill sites' "1/1 · 100%") — first-try corrects over answered */
    const st=session.stats();
    $(".nb-hud-acc").textContent=st.notesRead>0
      ? nbt("hud.answered",{ok:st.firstTry,n:st.notesRead,pct:st.accuracy}) : "";
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
      if(!scene.noteHeard&&x<=NOTE_X&&settings.sound!=="off"&&!instSilent){
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

  function tryAnswer(letter,playedMidi){
    if(!scene||scene.state!=="fly") return;
    const T=session.seconds();
    const elapsed=T?now()-scene.t0:now()-(scene.prepEnd||now());
    /* instrument input (MIDI / piano mic) must match the OCTAVE too — the
       printed C2 is not answered by playing C4. Buttons stay octave-free. */
    const octaveMiss=playedMidi!=null&&letter===scene.note.letter&&playedMidi!==scene.note.midi;
    const res=session.answer(octaveMiss?"#octave":letter,Math.max(0,Math.round(elapsed)));
    const btn=$(`.nb-letters button[data-l="${letter}"]`);

    if(res.correct){
      setLetters(false); if(btn) btn.classList.add("right");
      scene.api.highlight(0);
      sfxCorrect(); /* ding-dong-dang */
      /* the note plays once per question — only if it hasn't been heard yet
         (practice: the perched bird never crossed the notehead) */
      if(settings.sound!=="off"&&!instSilent&&!scene.noteHeard){
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
    if(window.NBInput) NBInput.suppress(1100);   /* mic must not hear the wrong-slide */
    sfxWrong(); /* "ddaeng" */
    if(btn){ btn.classList.add("wrongpick"); setTimeout(()=>btn.classList.remove("wrongpick"),700); }
    const fb=$(".nb-fb");
    if(octaveMiss){
      fb.textContent="✗ "+nbt("fb.wrongOctave",{letter,target:noteName(scene.note)})+
        (session.mode==="level"&&res.livesLeft===1?" "+nbt("fb.lastLife"):"");
    }else if(session.mode==="level"){
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

  /* ============================== GAME OVER (v0.15) ==============================
     The Flight-record review page is GONE (instructor 2026-08-01) — the run
     ends ON the game screen, Staff-Wars-style: GAME OVER (or the Level-10
     win line) over the frozen scene, the ▲▼ range-tweak arrows, then
     START / QUIT. Runs are still recorded to device-local bests (the setup
     condition line keeps showing "Best here: Level N"). */
  let finished=false;
  function finishRound(aborted){
    if(finished) return; finished=true;
    stopLoop(); NBMusic.stop();
    if(window.NBInput) NBInput.stopRound();
    document.removeEventListener("keydown",onKey);
    setLetters(false);
    const s=session.stats();
    const cond=session.condition;
    if(s.notesRead){
      const condKey=NBData.conditionKey(cond);
      const stu=studentSession();
      NBEngine.saveRun(condKey,{
        date:new Date().toISOString(), game:NB_CONFIG.TITLE, version:NB_CONFIG.VERSION,
        student:stu?{name:stu.name,class:stu.class||null,classCode:stu.classCode||null}:null,
        mode:s.mode, condition:conditionLabel(cond), condKey,
        level:s.level, success:s.success,
        notesRead:s.notesRead, accuracy:s.accuracy,
        avgMs:s.avgMs, fastestMs:s.fastestMs, bestStreak:s.bestStreak,
        wrong:s.wrongAttempts, timeouts:s.timeouts, hintsUsed:s.hintsUsed,
        missed:Object.keys(s.missed), answerMethod:"letters+keyboard"
      });
      /* server sync intentionally OFF (owner 2026-07-17) — see nb-sync.js */
    }
    if(s.success) MFAudio.yay();
    const el=$(".nb-gameover");
    if(!el){ showSetup(); return; }
    el.innerHTML=`
      <div class="nb-go-title${s.success?" nb-go-win":""}">${s.success?nbt("go.success"):nbt("go.over")}</div>
      ${cond.setId?"":`
      <div class="nb-rangetweak">
        <div class="nb-rt-col">
          <button class="ghost nb-rt" data-t="a" data-d="1" aria-label="${nbt("res.lowUp")}">▲</button>
          <button class="ghost nb-rt" data-t="a" data-d="-1" aria-label="${nbt("res.lowDn")}">▼</button>
        </div>
        <div><div class="nb-rt-staff"></div><div class="nb-rt-lab" aria-live="polite"></div></div>
        <div class="nb-rt-col">
          <button class="ghost nb-rt" data-t="b" data-d="1" aria-label="${nbt("res.hiUp")}">▲</button>
          <button class="ghost nb-rt" data-t="b" data-d="-1" aria-label="${nbt("res.hiDn")}">▼</button>
        </div>
      </div>`}
      <div class="nb-go-btns">
        <button class="play nb-go-start">▶ ${nbt("setup.start")}</button>
        <button class="ghost nb-go-quit">${nbt("go.quit")}</button>
      </div>`;
    el.hidden=false;
    /* ▲▼ nudge the endpoints one staff step inside C2–C6 (min 5-note span);
       START saves the tweaked range and relaunches at once */
    let ra=cond.a, rb=cond.b;
    if(!cond.setId){
      const MINI=NBData.dia(NBData.RANGE_MIN), MAXI=NBData.dia(NBData.RANGE_MAX), GAPMIN=4;
      const grand=cond.clef==="grand";
      const paintRT=()=>{
        Staff.render(el.querySelector(".nb-rt-staff"),{clef:cond.clef,width:150,
          notes:[ra,rb].map(p=>({p,d:"w",clef:grand?(NBData.midiOf(p)>=60?"treble":"bass"):undefined}))});
        el.querySelector(".nb-rt-lab").textContent=ra+"–"+rb;
      };
      [...el.querySelectorAll(".nb-rt")].forEach(b=>b.onclick=()=>{
        const d=+b.dataset.d;
        let ia=NBData.dia(ra), ib=NBData.dia(rb);
        if(b.dataset.t==="a"){ ia+=d; if(ia<MINI||ia>ib-GAPMIN) return; ra=NBData.fromDia(ia); }
        else { ib+=d; if(ib>MAXI||ib<ia+GAPMIN) return; rb=NBData.fromDia(ib); }
        paintRT();
      });
      paintRT();
    }
    el.querySelector(".nb-go-start").onclick=()=>{
      if(!cond.setId&&(ra!==cond.a||rb!==cond.b)){
        settings.a=ra; settings.b=rb; settings.setId=null; saveSettings();
      }
      startRound();
    };
    el.querySelector(".nb-go-quit").onclick=()=>showSetup();
  }

  /* ============================== BOOT ============================== */
  function init(el){
    root=el;
    document.title=NB_CONFIG.TITLE+" · Game Lab";
    document.querySelectorAll("[data-nb-title]").forEach(n=>n.textContent=NB_CONFIG.TITLE);
    /* the SAME red bird everywhere: inject the shared mark into header slots */
    document.querySelectorAll(".nb-birdmark").forEach(n=>{ n.innerHTML=NBData.birdMark(n.dataset.w?+n.dataset.w:44); });
    /* if the user leaves real fullscreen with Esc, drop big-screen fill too */
    document.addEventListener("fullscreenchange",()=>{
      if(!document.fullscreenElement && document.body.classList.contains("nb-fill")){
        document.body.classList.remove("nb-fill"); paintFsBtn();
      }
    });
    if(location.search.indexOf("check")>=0) console.log("NBData.validate:",NBData.validate());
    showSetup();
  }
  return {init};
})();

document.addEventListener("DOMContentLoaded",()=>{
  const el=document.getElementById("nbApp");
  if(el) NBUI.init(el);
});
