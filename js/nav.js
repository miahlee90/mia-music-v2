/* Music Fundamentals — navigation helpers (DD-04: lessons-data.js drives everything)
   v2: lessons display their Unit.Lesson label (l.label, e.g. "4.6"); files/URLs
   keep the sequential n (lesson-NN.html). */
const Nav=(()=>{
  function lesson(n){ return LESSONS.find(l=>l.n===n); }
  function unitOf(n){ return UNITS.find(u=>n>=u.lessons[0]&&n<=u.lessons[1]); }
  function href(n){ return "lesson-"+String(n).padStart(2,"0")+".html"; }
  function label(n){ const L=lesson(n); return L?L.label:n; }
  function header(n){
    const L=lesson(n),U=unitOf(n);
    return `<header class="lesson-header"><div class="inner">
      <div class="crumb">🏠 <a href="https://miamusicstudio.com/">Mia Music Studio</a> › <a href="../index.html">Theory Lab</a> › <a href="../lessons.html">All Lessons</a> › Lesson ${L.label}</div>
      <h1>Lesson ${L.label} — ${L.title}</h1>
    </div></header>`;
  }
  /* v3 footer (instructor 2026-07-20): ← Previous · "You are at N.N" · Next →.
     Previous/Next open a scrollable per-lesson button list — earlier lessons
     pop UP above the button, later lessons pop DOWN below it. The old
     "All Lessons" middle link (still in the breadcrumb) and the jump
     dropdown are gone. */
  function popItem(l){
    const built=l.n<=BUILT_THROUGH;
    return `<a class="${built?"":"disabled"}" ${built?`href="${href(l.n)}"`:""}>${l.label} · ${l.title}${built?"":" (soon)"}</a>`;
  }
  function footer(n){
    const L=lesson(n);
    const before=LESSONS.filter(l=>l.n<n), after=LESSONS.filter(l=>l.n>n);
    return `<div class="navrow lesson-nav">
      <div class="navpop-wrap">
        <button class="navbtn" ${before.length?`onclick="Nav.togglePop(event,'prev')"`:"disabled"}>← Previous</button>
        <div class="navpop up" id="navPopPrev">${before.map(popItem).join("")}</div>
      </div>
      <span class="nav-here">You are at ${L.label}</span>
      <div class="navpop-wrap">
        <button class="navbtn" ${after.length?`onclick="Nav.togglePop(event,'next')"`:"disabled"}>Next →</button>
        <div class="navpop down" id="navPopNext">${after.map(popItem).join("")}</div>
      </div>
    </div>`;
  }
  function togglePop(ev,which){
    ev.stopPropagation();
    const el=document.getElementById(which==="prev"?"navPopPrev":"navPopNext");
    const other=document.getElementById(which==="prev"?"navPopNext":"navPopPrev");
    if(other) other.classList.remove("open");
    if(!el) return;
    el.classList.toggle("open");
    /* upward list: keep the NEAREST earlier lesson visible next to the button */
    if(el.classList.contains("open")&&el.classList.contains("up")) el.scrollTop=el.scrollHeight;
  }
  document.addEventListener("click",()=>{
    document.querySelectorAll(".navpop.open").forEach(p=>p.classList.remove("open"));
  });
  function nextInvite(n){
    if(n>=LESSONS[LESSONS.length-1].n) return "";
    const N=lesson(n+1);
    const soon=n+1>BUILT_THROUGH?" (coming soon)":"";
    return `<section class="card next-invite"><h2>Nice work! 🎉</h2>
      <p>Up next: <b>Lesson ${N.label} — ${N.title}</b>${soon}</p></section>`;
  }
  return {lesson,unitOf,href,label,header,footer,nextInvite,togglePop};
})();
