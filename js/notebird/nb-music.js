/* Note Bird — background sound. v3 (instructor 2026-07-17): not music at all —
   gentle AMBIENT BIRDSONG, 100% synthesized (no samples, no copyrighted audio).
   Short frequency-sweep chirps in a high register (≈1.6–3.5 kHz), randomized
   phrases with pauses, plus an occasional lower "answering" bird. Nothing
   pitched like piano notes, so it can never be confused with the question
   note. Chirps come a touch more often at higher levels. Shares MFAudio's
   AudioContext. API unchanged: start/stop/setLevel/isPlaying.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NBMusic=(()=>{
  let timer=null, playing=false, level=1, gain=null, nextPhrase=0;

  function ctx(){ return MFAudio.ac(); }
  function ensureGain(){
    if(gain) return gain;
    const c=ctx(); gain=c.createGain(); gain.gain.value=.9; gain.connect(c.destination);
    return gain;
  }
  /* one chirp: a quick sine sweep with a soft envelope */
  function chirp(f0,f1,when,dur,vol){
    const c=ctx(), o=c.createOscillator(), g=c.createGain();
    o.type="sine";
    o.frequency.setValueAtTime(f0,when);
    o.frequency.exponentialRampToValueAtTime(Math.max(200,f1),when+dur);
    o.connect(g); g.connect(ensureGain());
    g.gain.setValueAtTime(0,when);
    g.gain.linearRampToValueAtTime(vol,when+.012);
    g.gain.exponentialRampToValueAtTime(.0008,when+dur);
    o.start(when); o.stop(when+dur+.05);
  }
  /* one little phrase: 2–4 chirps, sometimes answered by a lower bird */
  function phrase(when){
    const base=2100+Math.random()*1100;
    const n=2+Math.floor(Math.random()*3);
    let t=when;
    for(let i=0;i<n;i++){
      const up=Math.random()<.7;
      chirp(base*(up?1:1.18), base*(up?1.3:.92), t, .06+Math.random()*.06, .05+Math.random()*.025);
      t+=.085+Math.random()*.09;
    }
    if(Math.random()<.35){ t+=.12+Math.random()*.2;
      chirp(1500+Math.random()*300, 1850+Math.random()*250, t, .09, .04); }
  }
  function schedule(){
    if(!playing) return;
    const c=ctx();
    if(c.currentTime>=nextPhrase){
      phrase(c.currentTime+.05);
      /* pause between phrases: 1.1–3.6s, slightly livelier at higher levels */
      const gap=Math.max(.8, 1.1+Math.random()*2.5-level*.08);
      nextPhrase=c.currentTime+.4+gap;
    }
  }
  function start(lv){
    level=lv||1;
    if(playing) return;
    playing=true; nextPhrase=ctx().currentTime+.3;
    clearInterval(timer); timer=setInterval(schedule,120);
  }
  function stop(){ playing=false; clearInterval(timer); timer=null; }
  function setLevel(lv){ level=lv; }
  function isPlaying(){ return playing; }
  return {start,stop,setLevel,isPlaying};
})();
