/* Music Fundamentals — interactive on-screen piano (AGP keyboard applications) */
const Keyboard=(()=>{
  const WHITE_SEMIS=[0,2,4,5,7,9,11];
  const NAMES={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
  /* create(el,{start:60, octaves:2, labels:false, marks:[midi], onKey(midi)}) */
  function create(el,opts={}){
    let start=opts.start??60, octaves=opts.octaves??2;
    /* Never leave a G on the far left: a leftmost G shows only 2 of the 3 black keys
       (G#/A#) and misreads as the C-D-E pair. Start one white key lower on F (the full
       3-black group is visible) and extend the range up so the top note is unchanged. */
    if(((start%12)+12)%12===7){ start-=2; octaves+=2/12; }
    const whites=[],blacks=[];
    const _span=Math.round(octaves*12);
    for(let m=start;m<=start+_span;m++){
      const s=m%12;
      if(WHITE_SEMIS.includes(s)) whites.push(m); else blacks.push(m);
    }
    el.classList.add("mf-kb");
    el.innerHTML="";
    const wW=100/whites.length;
    const keyEls={};
    whites.forEach((m,i)=>{
      const k=document.createElement("div");
      k.className="w"; k.style.left=(i*wW)+"%"; k.style.width=wW+"%"; k.style.height="100%";
      if(opts.labels){ const l=document.createElement("div"); l.className="klabel"; l.textContent=NAMES[m%12]+(Math.floor(m/12)-1); k.appendChild(l); }
      k.onclick=()=>press(m);
      el.appendChild(k); keyEls[m]=k;
    });
    blacks.forEach(m=>{
      const wIdx=whites.filter(w=>w<m).length;
      const k=document.createElement("div");
      k.className="b"; k.style.left=(wIdx*wW-wW*0.3)+"%"; k.style.width=(wW*0.62)+"%"; k.style.height="60%";
      k.onclick=e=>{e.stopPropagation();press(m);};
      el.appendChild(k); keyEls[m]=k;
    });
    (opts.marks||[]).forEach(m=>{ if(keyEls[m]) keyEls[m].classList.add("mark"); });
    function press(m,silent){
      if(!silent) MFAudio.tone(m);
      const k=keyEls[m]; if(k){ k.classList.add("on"); setTimeout(()=>k.classList.remove("on"),260); }
      if(opts.onKey && !silent) opts.onKey(m);
    }
    /* demo([{m,t}...]) or demo([midis], gapMs) */
    function demo(seq,gap=380){
      if(typeof seq[0]==="number") seq=seq.map((m,i)=>({m,t:i*gap}));
      seq.forEach(({m,t})=>setTimeout(()=>press(m),t));
      return seq.length? seq[seq.length-1].t+gap : 0;
    }
    function mark(midis){ Object.values(keyEls).forEach(k=>k.classList.remove("mark")); (midis||[]).forEach(m=>{ if(keyEls[m]) keyEls[m].classList.add("mark"); }); }
    /* v2 (DD-30) — GUIDE vs FEEDBACK colors: point(midi) drops a RED arrow on the key
       the student should press; purple is reserved for keys that actually SOUND.
       point(null) clears the arrow. */
    function point(m){
      el.querySelectorAll(".kpoint").forEach(a=>a.remove());
      if(m==null||!keyEls[m]) return;
      const a=document.createElement("div"); a.className="kpoint"; a.textContent="\u25bc";
      keyEls[m].appendChild(a);
    }
    if(opts.point!=null) point(opts.point);
    return {press,demo,mark,point,el};
  }
  return {create};
})();
