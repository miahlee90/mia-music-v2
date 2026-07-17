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
      <div class="crumb"><a href="../lessons.html">All Lessons</a> › Unit ${U.unit}: ${U.name} › Lesson ${L.label}</div>
      <h1>Lesson ${L.label} — ${L.title}</h1>
    </div></header>`;
  }
  function footer(n){
    const LAST=LESSONS[LESSONS.length-1].n;
    const prev=n>1?`<a href="${href(n-1)}">← Lesson ${label(n-1)}</a>`:`<a class="disabled">← Previous</a>`;
    const next=(n<LAST&&n<BUILT_THROUGH)?`<a href="${href(n+1)}">Lesson ${label(n+1)} →</a>`:
               n<LAST?`<a class="disabled" title="Coming soon">Lesson ${label(n+1)} (soon)</a>`:`<a class="disabled">—</a>`;
    const opts=LESSONS.map(l=>{
      const built=l.n<=BUILT_THROUGH;
      return `<option value="${built?href(l.n):""}" ${l.n===n?"selected":""} ${built?"":"disabled"}>${l.label} · ${l.title}${built?"":" (soon)"}</option>`;
    }).join("");
    return `<div class="navrow">${prev}<a href="../lessons.html">All lessons</a>${next}</div>`+
      `<div class="navrow"><select class="nav-jump" onchange="if(this.value)location.href=this.value" aria-label="Jump to lesson">`+
      `<option value="">Jump to any lesson…</option>${opts}</select></div>`;
  }
  function nextInvite(n){
    if(n>=LESSONS[LESSONS.length-1].n) return "";
    const N=lesson(n+1);
    const soon=n+1>BUILT_THROUGH?" (coming soon)":"";
    return `<section class="card next-invite"><h2>Nice work! 🎉</h2>
      <p>Up next: <b>Lesson ${N.label} — ${N.title}</b>${soon}</p></section>`;
  }
  return {lesson,unitOf,href,label,header,footer,nextInvite};
})();
