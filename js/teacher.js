/* Music Fundamentals — "Mia" teacher character (DD-23) + Ask-Mia menu (DD-24)
   Restraint budget (SPEC §6.4): max 5 proactive appearances/lesson, 30s spacing,
   hints only on 2nd wrong attempt, everything else pull-based via the icon. */
const Teacher=(()=>{
  const SVG_DEF=`
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><g id="miaShape">
    <g class="armL"><line x1="42" y1="86" x2="26" y2="100" stroke="#EFCB4F" stroke-width="9" stroke-linecap="round"/></g>
    <path d="M34 92 Q28 60 32 40 Q38 14 60 14 Q82 14 88 40 Q92 60 86 92 Q82 98 78 94 L76 60 Q74 42 60 42 Q46 42 44 60 L42 94 Q38 98 34 92 Z" fill="#3A2B24"/>
    <path d="M32 130 Q30 82 60 78 Q90 82 88 130 Z" fill="#EFCB4F"/>
    <rect x="50" y="72" width="20" height="9" rx="4" fill="#e0ba3e"/>
    <path d="M46 100 Q60 106 74 100 M44 114 Q60 120 76 114" fill="none" stroke="#e0ba3e" stroke-width="2"/>
    <g><rect x="14" y="96" width="21" height="27" rx="2.5" fill="#6D55B8"/><rect x="14" y="96" width="4" height="27" rx="2" fill="#57448f"/><text x="19" y="116" font-size="15" fill="#fff" font-family="serif">\u{1D11E}</text></g>
    <circle cx="60" cy="50" r="23" fill="#FFDCB8"/>
    <path d="M38 52 Q34 20 60 18 Q86 20 82 52 Q80 34 66 30 Q56 28 48 34 Q40 40 38 52 Z" fill="#3A2B24"/>
    <path class="browL" d="M44 38 Q50 35.5 55 38" fill="none" stroke="#4a382e" stroke-width="2.2" stroke-linecap="round"/>
    <path class="browR" d="M65 38 Q70 35.5 76 38" fill="none" stroke="#4a382e" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="51" cy="49" r="3" fill="#2B2B2B"/><circle cx="69" cy="49" r="3" fill="#2B2B2B"/>
    <circle cx="52.2" cy="47.9" r="1" fill="#fff"/><circle cx="70.2" cy="47.9" r="1" fill="#fff"/>
    <circle cx="51" cy="49" r="8.5" fill="none" stroke="#6b5340" stroke-width="2"/>
    <circle cx="69" cy="49" r="8.5" fill="none" stroke="#6b5340" stroke-width="2"/>
    <line x1="59.5" y1="49" x2="60.5" y2="49" stroke="#6b5340" stroke-width="2"/>
    <line x1="42.5" y1="48" x2="38" y2="46" stroke="#6b5340" stroke-width="2"/>
    <line x1="77.5" y1="48" x2="82" y2="46" stroke="#6b5340" stroke-width="2"/>
    <circle cx="45" cy="58" r="3" fill="#f6b8a0" opacity=".55"/><circle cx="75" cy="58" r="3" fill="#f6b8a0" opacity=".55"/>
    <path class="mouth-smile" d="M53 61 Q60 67 67 61" fill="none" stroke="#a3542f" stroke-width="2.6" stroke-linecap="round"/>
    <path class="mouth-big" d="M51 60 Q60 73 69 60 Z" fill="#a3542f"/>
    <circle class="mouth-o" cx="60" cy="63" r="4.2" fill="#a3542f"/>
    <g class="armR"><line x1="78" y1="86" x2="97" y2="98" stroke="#EFCB4F" stroke-width="9" stroke-linecap="round"/><circle cx="99" cy="99" r="4.5" fill="#FFDCB8"/></g>
  </g></defs></svg>`;

  let root,bubble,textEl,icon,menu,typer=null,timer=null;
  let proactiveCount=0, lastShow=0;
  const MAX_PROACTIVE=5, SPACING_MS=30000;
  const contexts=[];

  function init(){
    if(root) return;
    document.body.insertAdjacentHTML("beforeend", SVG_DEF+`
      <div id="mia" class="pose-neutral" aria-live="polite">
        <div id="miaBubble"><button id="miaClose" aria-label="dismiss">✕</button><span id="miaText"></span></div>
        <svg id="miaSvg" viewBox="0 0 120 140"><use href="#miaShape"/></svg>
      </div>
      <button id="miaIcon" aria-label="Ask Mia for help"><span class="pulse"></span>
        <svg viewBox="27 14 66 66"><use href="#miaShape"/></svg></button>
      <div id="miaMenu"></div>`);
    root=document.getElementById("mia"); bubble=document.getElementById("miaBubble");
    textEl=document.getElementById("miaText"); icon=document.getElementById("miaIcon"); menu=document.getElementById("miaMenu");
    document.getElementById("miaClose").onclick=hide;
    document.getElementById("miaSvg").onclick=hide;
    icon.onclick=openMenu;
    document.addEventListener("click",e=>{ if(!menu.contains(e.target)&&e.target!==icon) closeMenu(); });
  }
  function miniAvatar(){ return `<svg class="mini" viewBox="0 0 120 140" aria-hidden="true"><use href="#miaShape"/></svg>`; }
  function bubbleHTML(html){
    /* instructor: the pointing-finger question always moves to its own line */
    html=String(html).replace(/\s*\u{1F447}/gu,"<br>\u{1F447}");
    return `<div class="say">${miniAvatar()}<div class="bub">${html}</div></div>`; }

  function say(text,{pose="neutral",sticky=false,chime=true,proactive=false}={}){
    init();
    if(proactive){
      const visible=root.classList.contains("in");
      if(proactiveCount>=MAX_PROACTIVE && !visible) return false;
      if(!visible && Date.now()-lastShow<SPACING_MS && proactiveCount>0) return false;
      if(!visible) proactiveCount++;
    }
    lastShow=Date.now();
    icon.classList.add("hidden"); closeMenu();
    root.className="pose-"+pose; void root.offsetWidth; root.classList.add("in");
    if(chime){ MFAudio.tone(76,.15,0,.22); MFAudio.tone(83,.2,.12,.22);
      if(pose==="celebrate") [88].forEach((n,i)=>MFAudio.tone(n,.25,.26,.25)); }
    clearInterval(typer); textEl.textContent="";
    let i=0; typer=setInterval(()=>{ textEl.textContent=text.slice(0,++i); if(i>=text.length) clearInterval(typer); },16);
    clearTimeout(timer);
    if(!sticky) timer=setTimeout(hide, Math.max(5000, text.length*55+2000));
    return true;
  }
  function hide(){ if(!root) return; root.classList.remove("in"); clearTimeout(timer);
    setTimeout(()=>icon.classList.remove("hidden"),400); }
  function celebrate(){
    ["♪","♫","♪","♩","♫","♪"].forEach(ch=>{
      const s=document.createElement("span"); s.className="confetti"; s.textContent=ch;
      s.style.left=(80+Math.random()*160)+"px"; s.style.bottom=(90+Math.random()*40)+"px";
      s.style.setProperty("--dx",(Math.random()*160-80)+"px");
      s.style.setProperty("--rot",(Math.random()*180-90)+"deg");
      document.body.appendChild(s); setTimeout(()=>s.remove(),1500);
    });
  }
  /* Ask-Mia context menu: registerContext(el,{label,explain,hint,play,piano}) — hint may be fn */
  function registerContext(el,cfg){ contexts.push({el,cfg}); }
  function currentCtx(){
    let best=null,bd=1e9,mid=innerHeight/2;
    contexts.forEach(c=>{
      if(!c.el || c.el.offsetParent===null) return;
      const r=c.el.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight) return;
      const d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<bd){bd=d;best=c;}
    });
    return best;
  }
  function closeMenu(){ if(menu) menu.classList.remove("open"); }
  function openMenu(){
    MFAudio.ac();
    if(menu.classList.contains("open")){ closeMenu(); return; }
    const c=currentCtx();
    if(!c){ say("I'm here whenever you need help!",{pose:"wave"}); return; }
    const cfg=c.cfg;
    const hint=typeof cfg.hint==="function"? cfg.hint() : cfg.hint;
    let html=`<div class="mm-title">Mia — help with ${cfg.label}</div>`;
    if(cfg.explain) html+=`<button data-a="explain">\u{1F4A1} Explain again</button>`;
    if(cfg.piano)   html+=`<button data-a="piano">\u{1F3B9} Show me on the piano</button>`;
    if(cfg.play)    html+=`<button data-a="play">\u{1F3B5} Play the sound</button>`;
    if(hint)        html+=`<button data-a="hint">❓ Give me a hint</button>`;
    menu.innerHTML=html; menu.classList.add("open");
    menu.querySelectorAll("button").forEach(b=>b.onclick=()=>{
      closeMenu();
      const a=b.dataset.a;
      if(a==="explain") say(typeof cfg.explain==="function"?cfg.explain():cfg.explain,{pose:"point"});
      else if(a==="hint") say(hint,{pose:"think"});
      else if(a==="piano") cfg.piano();
      else if(a==="play"){ say("Listen… \u{1F3B5}",{pose:"point",chime:false}); cfg.play(); }
    });
  }
  function resetBudget(){ proactiveCount=0; }
  return {init,say,hide,celebrate,registerContext,bubbleHTML,miniAvatar,resetBudget,closeMenu};
})();
