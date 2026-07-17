/* Music Fundamentals — THE lesson template (DD-02/DD-03). v2
   Renders every lesson identically from LESSON_CONTENT[n]; validates content;
   wires Mia (restrained, SPEC §6.4) and the Ask-Mia menu.
   v2 adds: multiple games (C.games), Mia's Tips card (C.tips), rewards/badge
   (C.rewards), lesson progress bar, custom interactions (type:"custom"),
   optional section order (C.sectionOrder).
   NOTE (maintenance): edit this file by FULL-FILE REWRITE only. */
(function(){
  const n=+document.body.dataset.lesson;
  const C=LESSON_CONTENT[n];
  const app=document.getElementById("app");
  if(!C){ app.innerHTML="<main><div class='mf-warn'>Content file missing for lesson "+n+".</div></main>"; return; }
  const GAMES=C.games||(C.game?[C.game]:[]);

  /* ---------- validation (anti-textbook contract) ---------- */
  const warns=[];
  ["objectives","steps","examples","quiz","vocabulary","mistakes","summary"].forEach(k=>{ if(!C[k]) warns.push("missing section: "+k); });
  if(C.quiz){ const len=Quiz.expand(C.quiz).length; if(len<8||len>25) warns.push("quiz has "+len+" questions (need 8-25)"); }
  let interactions=(C.hook&&C.hook.interact?1:0)+(C.steps||[]).filter(s=>s.try).length+(C.keyboard?1:0)+GAMES.length+(C.practice?1:0);
  if(interactions<2) warns.push("fewer than 2 hands-on interactions before the quiz");

  /* ---------- build sections ---------- */
  document.title=`Lesson ${n} · Music Fundamentals`;
  const S={};

  if(C.hook) S.secHook=`<section class="card" id="secHook"><span class="tag">Welcome</span>
    ${Teacher.bubbleHTML(C.hook.say)}<div id="hookBody"></div><p class="feedback" id="hookFb"></p></section>`;

  S.secObjectives=`<section class="card" id="secObjectives"><h2>Today's mission</h2><ul class="objectives">${C.objectives.map(o=>`<li>${o}</li>`).join("")}</ul></section>`;

  let learn=`<section class="card" id="secLearn"><h2>Learn by doing</h2>`;
  C.steps.forEach((s,i)=>{
    learn+=`<div class="step${i===0?" open":""}" id="step${i}">
      ${i>0?'<hr class="sep">':""}${Teacher.bubbleHTML(s.say)}
      <div class="show" id="show${i}"></div><div class="try" id="try${i}"></div>
      <p class="feedback" id="fb${i}"></p></div>`;
  });
  learn+=`<div class="continue-row"><button id="contBtn">Continue ↓</button></div></section>`;
  S.secLearn=learn;

  let ex=`<section class="card step" id="secExample"><h2>${C.exampleHeading||"Hear it in real music"}</h2>`;
  C.examples.forEach((e,i)=>{
    ex+=`${e.caption?Teacher.bubbleHTML(e.caption):""}<div id="ex${i}"></div>
      ${(!e.mount && e.playable!==false)?`<div style="text-align:center"><button class="play" id="exBtn${i}">▶ Play the example</button></div>`:""}`;
  });
  S.secExample=ex+`</section>`;

  if(C.keyboard) S.secKb=`<section class="card step" id="secKb"><h2>\u{1F3B9} At the keyboard</h2>
    ${Teacher.bubbleHTML(C.keyboard.intro)}<div id="kbBody"></div><div class="kb-note" id="kbNote"></div>
    ${C.keyboard.demo?`<div style="text-align:center"><button class="play" id="kbDemoBtn">▶ Watch Mia play it</button></div>`:""}</section>`;

  if(C.practice) S.secPractice=`<section class="card step" id="secPractice"><h2>\u{270F}\u{FE0F} Practice</h2>
    ${Teacher.bubbleHTML(C.practiceIntro||"Let's drill it in — one question at a time. Answer right and the next appears automatically!")}
    <div id="practiceBody"></div></section>`;

  GAMES.forEach((g,gi)=>{
    S["secGame"+gi]=`<section class="card step" id="secGame${gi}"><h2>\u{1F3AE} ${g.title||"Mini-game"}</h2>
      ${Teacher.bubbleHTML(g.intro)}<div id="gameBody${gi}"></div></section>`;
  });

  S.secQuiz=`<section class="card step" id="secQuiz"><h2>✅ Final Quiz</h2>
    <p style="font-size:14px;color:var(--muted)">${Quiz.expand(C.quiz).length} questions — several are freshly generated each attempt. Difficulty builds as you go.</p>
    <div id="quizBody"></div>
    ${C.rewards?`<div id="rewardBox" class="score-box" style="display:none"></div>`:""}</section>`;

  S.secVocab=`<section class="card" id="secVocab"><h2>Vocabulary <span style="font-weight:400;font-size:13px;color:var(--muted)">(tap a card to flip it)</span></h2>
    <div class="vox">${C.vocabulary.map((v,vi)=>`<div class="vox-card" role="button" tabindex="0"><div class="vox-front"><b>${v.term}</b>${v.staff?`<div class="vox-sym" data-vi="${vi}"></div>`: v.sym?`<div class="vox-sym vox-symtxt">${v.sym}</div>`:""}</div><div class="vox-back">${v.staffBack?`<div class="vox-symb" data-vi="${vi}"></div>`:v.def}</div></div>`).join("")}</div></section>`;

  S.secReview=`<section class="card step" id="secReview"><h2>Remember!</h2>
    <ul class="summary">${C.summary.map(s=>`<li>${s}</li>`).join("")}</ul>
    ${(C.mistakes&&C.mistakes.length)?`<h2 style="margin-top:18px">Oops! Watch out for…</h2>
    <ul class="mistakes">${C.mistakes.map(m=>`<li class="oops">${m}</li>`).join("")}</ul>`:""}</section>`;

  if(C.tips) S.secTips=`<section class="card step" id="secTips"><h2>\u{1F4A1} Mia's Tips</h2>
    ${C.tips.map(t=>Teacher.bubbleHTML(t)).join("")}</section>`;

  S.secNext=`<div class="step" id="secNext">${Nav.nextInvite(n)}</div>`;

  const defaultOrder=[...(C.hook?["secHook"]:[]),"secObjectives","secVocab","secLearn","secExample",
    ...(C.keyboard?["secKb"]:[]),...(C.practice?["secPractice"]:[]),
    ...GAMES.map((_,i)=>"secGame"+i),"secQuiz","secReview",...(C.tips?["secTips"]:[]),"secNext"];
  let baseOrder=C.sectionOrder?[...C.sectionOrder]:defaultOrder;
  if(C.sectionOrder&&!baseOrder.includes("secVocab")){ const vi2=baseOrder.indexOf("secObjectives"); baseOrder.splice(vi2>=0?vi2+1:1,0,"secVocab"); }
  const ORDER=baseOrder.filter(id=>S[id]);

  let html=Nav.header(n)+`<div class="lesson-progress"><div class="lesson-progress-fill" id="lpFill"></div></div><main>`;
  if(warns.length) html+=`<div class="mf-warn"><b>Content check:</b> ${warns.join(" · ")}</div>`;
  html+=ORDER.map(id=>S[id]).join("")+`<div class="always-nav">${Nav.footer(n)}</div></main>`;
  app.innerHTML=html;

  /* ---------- progress bar ---------- */
  const revealable=ORDER.filter(id=>id!=="secHook"&&id!=="secObjectives"&&id!=="secVocab");
  let revealed=1;
  function updateProgress(extra){
    const total=revealable.length+1;
    const pct=Math.min(100,Math.round(100*(revealed+(extra||0))/total));
    const f=document.getElementById("lpFill"); if(f) f.style.width=pct+"%";
  }
  updateProgress();

  /* ---------- interactions ---------- */
  function fb(id,ok,msg){ const e=document.getElementById(id); e.textContent=msg; e.className="feedback "+(ok?"ok":"no"); }

  function mountInteract(container,cfg,fbId){
    const wrongs={count:0};
    const say=(m,o)=>Teacher.say(m,o);
    const onWrong=()=>{ wrongs.count++; if(wrongs.count===2 && cfg.hint) say(cfg.hint,{pose:"think",sticky:true,proactive:true}); };
    switch(cfg.type){
      case "custom":{ cfg.mount(container,(ok,msg)=>{ fb(fbId,ok,msg); if(!ok)onWrong(); }); break; }
      case "keyboard":{
        let low=false,high=false,done=false;
        Keyboard.create(container,{start:cfg.start??60,octaves:cfg.octaves??2,labels:cfg.labels,marks:cfg.marks,
          onKey:m=>{ const mid=(cfg.start??60)+((cfg.octaves??2)*12)/2;
            if(m<mid)low=true; else high=true;
            if(cfg.goal==="low-high"&&low&&high&&!done){ done=true; fb(fbId,true,cfg.success||"✓ You found it!");
              say(cfg.celebrate||"You discovered it yourself!",{pose:"celebrate",proactive:true}); Teacher.celebrate(); }
          }});
        break; }
      case "click-line":{
        Staff.render(container,{clef:cfg.clef||"treble",clickLines:true,width:cfg.width||400,
          onLine:(ln)=>{ if(ln===cfg.line){ fb(fbId,true,cfg.success||`✓ Exactly! Line ${cfg.line} — counted from the bottom.`); }
            else { fb(fbId,false,`Not quite — that's line ${ln}. Count from the bottom.`); onWrong(); } }});
        break; }
      case "click-space":{
        Staff.render(container,{clef:cfg.clef||"treble",clickSpaces:true,width:cfg.width||400,
          onSpace:(sp)=>{ if(sp===cfg.space){ fb(fbId,true,cfg.success||`✓ Space ${cfg.space} it is!`); }
            else { fb(fbId,false,`That's space ${sp} — count spaces from the bottom too.`); onWrong(); } }});
        break; }
      case "click-higher":{
        let heard=new Set();
        Staff.render(container,{clef:cfg.clef||"treble",notes:cfg.notes.map(p=>({p,d:"q"})),clickNotes:true,width:cfg.width||400,
          onNote:(i,p)=>{ MFAudio.tone(MFAudio.midi(p)); heard.add(i);
            if(heard.size<2){ const e=document.getElementById(fbId); e.textContent="…now the other one!"; e.className="feedback"; return; }
            const idxs=cfg.notes.map(x=>Staff.dia(x));
            const hi=idxs.indexOf(Math.max(...idxs));
            if(i===hi){ fb(fbId,true,"✓ The note sitting higher IS the higher pitch!"); }
            else { fb(fbId,false,"Listen again — which one sits higher on the staff?"); onWrong(); } }});
        break; }
      case "press-play":{
        const api=Staff.render(container,{...cfg.staff});
        const b=document.createElement("button"); b.className="play"; b.textContent=cfg.button||"▶ Watch & listen";
        const row=document.createElement("div"); row.style.textAlign="center"; row.appendChild(b); container.appendChild(row);
        b.onclick=()=>{ Staff.play(cfg.staff,api);
          setTimeout(()=>fb(fbId,true,cfg.after||"✓ Hear how the sound follows the notation?"), (cfg.staff.notes.length*0.65+0.5)*1000); };
        break; }
      case "click-key":{
        Keyboard.create(container,{start:cfg.start??60,octaves:cfg.octaves??2,labels:cfg.labels,
          onKey:m=>{ if(m===cfg.target){ fb(fbId,true,cfg.success||"✓ That's the one!"); }
            else { fb(fbId,false,"Not that key — listen and look at the black-key groups."); onWrong(); } }});
        break; }
      case "mc":{
        const ch=document.createElement("div"); ch.className="choices"; container.appendChild(ch);
        if(cfg.choices.every(c=>String(c).length<=14)) ch.classList.add("chips");
        cfg.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
          b.onclick=()=>{ if(i===cfg.answer){ [...ch.children].forEach(x=>x.disabled=true); b.classList.add("right"); fb(fbId,true,cfg.success||"✓ Correct!"); }
            else { b.classList.add("wrongpick"); b.disabled=true; fb(fbId,false,cfg.fail||"Not quite — try another."); onWrong(); } };
          ch.appendChild(b); });
        break; }
    }
  }

  if(C.hook&&C.hook.interact) mountInteract(document.getElementById("hookBody"),C.hook.interact,"hookFb");
  C.steps.forEach((s,i)=>{
    if(s.show){ const el=document.getElementById("show"+i);
      if(s.show.type==="staff") Staff.render(el,s.show.spec);
      else if(s.show.type==="keyboard") Keyboard.create(el,s.show.spec);
      else if(s.show.type==="html") el.innerHTML=s.show.html;
      else if(s.show.type==="custom") s.show.mount(el);
    }
    if(s.try) mountInteract(document.getElementById("try"+i),s.try,"fb"+i);
  });

  /* progressive reveal */
  const reveal=[...C.steps.map((_,i)=>"step"+i).slice(1),...ORDER.filter(id=>!["secHook","secObjectives","secVocab","secLearn"].includes(id))];
  let oi=0;
  const INTROS={};
  GAMES.forEach((g,gi)=>{ if(g.miaIntro) INTROS["secGame"+gi]=g.miaIntro; });
  if(C.miaQuizIntro) INTROS.secQuiz=C.miaQuizIntro;
  document.getElementById("contBtn").onclick=function(){
    if(oi<reveal.length){ const id=reveal[oi++]; const el=document.getElementById(id);
      el.classList.add("open"); el.scrollIntoView({behavior:"smooth",block:"start"});
      if(!id.startsWith("step")){ revealed++; updateProgress();
        /* v3.6: keep the Continue button directly BELOW the newest section, so no
           passive section (e.g. the "Remember!" recap) is ever revealed above the
           button and scrolled past unseen — students always see what to do next. */
        const row=this.parentElement; if(el.parentNode) el.parentNode.insertBefore(row,el.nextSibling);
      }
      if(INTROS[id]) setTimeout(()=>Teacher.say(INTROS[id],{pose:"point",proactive:true}),500); }
    if(oi>=reveal.length) this.parentElement.style.display="none";
  };

  /* examples (v3.2: optional e.kb = marked keyboard under the staff;
     v3.3: during playback the keyboard LIGHTS UP in sync with the highlighted
     staff note — each note flashes its matching key, instructor 2026-07-06) */
  C.examples.forEach((e,i)=>{
    const host=document.getElementById("ex"+i);
    if(typeof e.mount==="function"){ e.mount(host); return; }
    const api=Staff.render(host,e.staff);
    let kbApi=null;
    if(e.kb){ const k=document.createElement("div"); k.style.marginTop="10px"; host.appendChild(k); kbApi=Keyboard.create(k,e.kb); }
    const playApi=kbApi? { svg:api.svg,
      highlight:(ix,keep)=>{ api.highlight(ix,keep);
        if(ix!=null){ const n=e.staff.notes[ix];
          if(n && n.rest===undefined && n.bar===undefined && (n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p), true); } } } : api;
    const b=document.getElementById("exBtn"+i); if(b) b.onclick=()=>Staff.play(e.staff,playApi);
  });
  /* keyboard */
  if(C.keyboard){
    const kbApi=Keyboard.create(document.getElementById("kbBody"),{start:C.keyboard.start??60,octaves:C.keyboard.octaves??2,labels:C.keyboard.labels,marks:C.keyboard.marks});
    const db=document.getElementById("kbDemoBtn");
    if(db) db.onclick=()=>{ kbApi.demo(C.keyboard.demo.map(p=>MFAudio.midi(p)),C.keyboard.demoGap||420); };
  }
  /* practice */
  if(C.practice) Quiz.drill(document.getElementById("practiceBody"),C.practice);
  /* games */
  GAMES.forEach((g,gi)=>{
    Games.mount(document.getElementById("gameBody"+gi),{type:g.type,spec:g.spec,
      onFinish:(sc)=>{ const line=g.result?g.result(sc):null;
        if(line) Teacher.say(line,{pose:"celebrate",proactive:true}); }});
  });
  /* quiz + rewards */
  Quiz.mount(document.getElementById("quizBody"),C.quiz,{lesson:n,
    onHint:h=>Teacher.say(h,{pose:"think"}),
    onDone:(score,total,pass)=>{
      revealed=revealable.length+1; updateProgress();
      if(pass&&C.rewards){
        const stars=score===total?3:(score/total>=0.85?3:score/total>=0.7?2:1);
        const rb=document.getElementById("rewardBox");
        rb.style.display="block";
        rb.innerHTML=`<hr class="sep"><div class="stars">${"⭐".repeat(stars)}</div>
          <div class="badge-card"><span class="badge-icon">${C.rewards.icon||"\u{1F3C5}"}</span>
          <b>${C.rewards.badge}</b> badge earned!</div>`;
        Teacher.celebrate();
      }
      if(score===total){ Teacher.say(C.miaPerfect||"Perfect score! See you in the next lesson — I'll be waiting! \u{1F3B5}",{pose:"celebrate",sticky:true,proactive:true}); Teacher.celebrate(); }
      else if(pass) Teacher.say(C.miaPass||"You passed! Review below, or try again for a perfect run.",{pose:"wave",proactive:true});
      else Teacher.say(C.miaRetry||"Good effort! Peek at the review below, then try again — fresh questions every time.",{pose:"wave",proactive:true});
    }});
  /* vocabulary cards v4 (rebuilt): front = term + symbol, tap swaps to definition */
  document.querySelectorAll(".vox-card").forEach(v=>{
    const go=()=>v.classList.toggle("back");
    v.onclick=go;
    v.onkeydown=e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); } };
  });
  document.querySelectorAll(".vox-sym").forEach(el=>{ const v=C.vocabulary[+el.dataset.vi]; if(v&&v.staff) Staff.render(el,v.staff); });
  document.querySelectorAll(".vox-symb").forEach(el=>{ const v=C.vocabulary[+el.dataset.vi]; if(v&&v.staffBack){ Staff.render(el,v.staffBack); const sv=el.querySelector("svg.mf-staff"); if(sv){ const w=(v.staffBack.width||200); sv.setAttribute("viewBox","2 24 "+(w-4)+" 84"); } } });

  /* ---------- Ask-Mia contexts ---------- */
  Teacher.init();
  const mia=C.mia||{};
  function reg(id,label,cfg){ const el=document.getElementById(id); if(el&&cfg) Teacher.registerContext(el,{label,...cfg}); }
  if(C.hook) reg("secHook", (mia.hook&&mia.hook.label)||"this welcome", mia.hook);
  reg("secLearn", (mia.learn&&mia.learn.label)||"this concept", mia.learn);
  reg("secExample", (mia.example&&mia.example.label)||"the example", Object.assign({play:()=>{const b=document.getElementById("exBtn0"); if(b)b.click();}}, mia.example||{}));
  if(C.keyboard) reg("secKb", "the keyboard", Object.assign({piano:()=>{const b=document.getElementById("kbDemoBtn"); if(b)b.click();}}, mia.kb||{}));
  if(C.practice) reg("secPractice", "the practice", mia.practice||mia.learn);
  GAMES.forEach((g,gi)=>reg("secGame"+gi, g.title||"the game", g.mia||mia.game));
  reg("secQuiz", "this question", mia.quiz);

  /* ---------- welcome (proactive #1) ---------- */
  window.addEventListener("load",()=>setTimeout(()=>{
    Teacher.say(C.welcome||`Welcome to Lesson ${n}! Let's go!`,{pose:"wave",chime:false,proactive:true});
  },600));
})();

/* v3.4 — the 𝄪 and 𝄫 glyphs are unreadably small at text size (instructor:
   "앞으로 나오는 더블샵을 키워줘"). Auto-enlarge them EVERYWHERE on lesson pages:
   a walker wraps every occurrence in <span class="dbx"> (styled 1.55em in CSS),
   and a MutationObserver keeps covering dynamically-built quiz/game buttons.
   SVG text and already-wrapped glyphs are skipped. */
(function(){
  const RE=/[\u{1D12A}\u{1D12B}]/u;
  function fix(root){
    if(!root||root.nodeType!==1) return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
    const hits=[];
    while(w.nextNode()){
      const t=w.currentNode, pe=t.parentElement;
      if(!RE.test(t.nodeValue)) continue;
      if(pe&&(pe.classList.contains("dbx")||pe.classList.contains("dbf")||pe.closest("svg"))) continue;
      hits.push(t);
    }
    hits.forEach(t=>{
      const span=document.createElement("span");
      span.innerHTML=t.nodeValue.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))
        .replace(/(\u{1D12A})/gu,'<span class="dbx">$1</span>').replace(/(\u{1D12B})/gu,'<span class="dbf">$1</span>');
      t.parentNode.replaceChild(span,t);
    });
  }
  let mo=null;
  function watch(){ mo=new MutationObserver(muts=>{
    mo.disconnect();
    muts.forEach(m=>fix(m.target.nodeType===3? m.target.parentElement : m.target));
    mo.observe(document.body,{childList:true,subtree:true,characterData:true});
  }); mo.observe(document.body,{childList:true,subtree:true,characterData:true}); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>{ fix(document.body); watch(); });
  else setTimeout(()=>{ fix(document.body); watch(); },400);
})();

/* v3.5 — figured-bass inversion symbols (6/4, 6/5, 4/3, 4/2, I⁶₄ …) are SYMBOLS,
   not fractions, and must be typeset as stacked, top-bottom-aligned digits like a
   theory text (instructor: "이런 inversion 숫자는 기호라서 표처럼"). OPT-IN per lesson
   via LESSON_CONTENT[n].stackFigures — only the chord/inversion lessons — so time
   signatures (3/4, 6/8) in the meter lessons are never touched. Both the plain
   slash form ("6/4") and the unicode super/subscript form ("I⁶₄") are stacked. */
(function(){
  const N=+(document.body&&document.body.dataset&&document.body.dataset.lesson);
  /* LESSON_CONTENT is a script-scope `const` (not a window property), so read it
     by bare name — window.LESSON_CONTENT would be undefined and skip the walker. */
  if(!N||typeof LESSON_CONTENT==="undefined"||!LESSON_CONTENT[N]||!LESSON_CONTENT[N].stackFigures) return;
  const SUP={"⁰":0,"¹":1,"²":2,"³":3,"⁴":4,"⁵":5,"⁶":6,"⁷":7,"⁸":8,"⁹":9};
  const FIG={"6/4":1,"6/5":1,"4/3":1,"4/2":1,"6/3":1,"5/3":1,"7/5":1,"7/3":1,"9/7":1,"6/2":1};
  const SUPSRC="([IiVv]{0,4})([⁰¹²³⁴-⁹]+)([₀-₉]+)";      /* stacked: I⁶₄ */
  const SUPSINGLE="([IiVv]{1,4})([⁰¹²³⁴-⁹]+)";           /* single: I⁶, V⁷ */
  const SLSRC="(^|[^\\d\\/])(\\d)\\/(\\d)(?![\\d\\/])";   /* slash: 6/4 */
  const TEST=new RegExp(SUPSINGLE+"|"+SLSRC,"u");         /* SUPSINGLE also detects the stacked form */
  const supDigits=s=>[...s].map(c=>SUP[c]).join("");
  function fbx(t,b){ return '<span class="fb"><span>'+t+'</span><span>'+b+'</span></span>'; }
  function fbx1(t){ return '<span class="fb"><span>'+t+'</span><span class="fbh">0</span></span>'; } /* single figure, same size/position as a stacked figure's top digit */
  function esc(s){ return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }
  function toHTML(text){
    let s=esc(text)
      .replace(new RegExp(SUPSRC,"gu"),(m,base,sup,sub)=>base+fbx(supDigits(sup),[...sub].map(c=>c.charCodeAt(0)-0x2080).join("")))
      .replace(new RegExp(SUPSINGLE,"gu"),(m,base,sup)=>base+fbx1(supDigits(sup)))
      .replace(new RegExp(SLSRC,"g"),(m,pre,a,b)=>FIG[a+"/"+b]?pre+fbx(a,b):m);
    return s;
  }
  function fix(root){
    if(!root) return;
    try{
      let nodes=[];
      if(root.nodeType===3) nodes=[root];
      else if(root.nodeType===1){ const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null); while(w.nextNode()) nodes.push(w.currentNode); }
      else return;
      const hits=nodes.filter(t=>{ const pe=t.parentElement;
        if(!t.nodeValue||!TEST.test(t.nodeValue)) return false;
        if(pe&&(pe.classList.contains("fb")||pe.closest(".fb")||pe.closest("svg"))) return false;
        return true; });
      hits.forEach(t=>{ if(!t.parentNode) return; const span=document.createElement("span"); span.innerHTML=toHTML(t.nodeValue); t.parentNode.replaceChild(span,t); });
    }catch(e){}
  }
  let mo=null;
  /* Lightweight: only react to ADDED nodes (new quiz questions, game buttons),
     not characterData — so Mia's typing, progress-bar ticks and quiz/answer
     interactions don't trigger a full re-walk (which froze/interfered before). */
  function watch(){ mo=new MutationObserver(muts=>{ mo.disconnect();
    try{ muts.forEach(m=>{ if(m.type==="childList") m.addedNodes.forEach(n=>fix(n)); }); }catch(e){}
    mo.observe(document.body,{childList:true,subtree:true}); });
    mo.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>{ fix(document.body); watch(); });
  else setTimeout(()=>{ fix(document.body); watch(); },450);
})();
