/* Note Bird — GAME ENGINE (no DOM). Owns question sequencing, answer checking,
   the LEVEL system (lives, speed-per-level, success at level 10) and per-run
   records. The UI layer owns time/animation and calls answer()/timeout();
   the engine never touches the screen.
   A run is a RECORD, not a test: it stores "under these conditions the
   student reached level N". Results stay in localStorage under
   NB_CONFIG.STORAGE_KEY only — never written to the Music Fundamentals LMS.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NBEngine=(()=>{

  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

  /* random draw, no immediate repeats, full pool coverage before repeats pile up */
  function makeDrawer(pool){
    let bag=[], last=null;
    return function(){
      if(!bag.length) bag=shuffle(pool);
      let n=bag.shift();
      if(last&&n.id===last.id&&bag.length){ bag.push(n); n=bag.shift(); }
      last=n; return n;
    };
  }

  /* opts: {pool, mode:"practice"|"level", rounds (practice), condition:{...}} */
  function createSession(opts){
    const pool=opts.pool;
    const mode=opts.mode;
    const L=NBData.LEVELS;
    const draw=makeDrawer(pool);
    const records=[];
    let cur=null, curRec=null, qCount=0;
    let streak=0, bestStreak=0;
    /* level-mode state */
    let level=1, inLevel=0, lives=L.lives, over=false, success=false;

    function seconds(){ return mode==="level"? NBData.secondsForLevel(level) : 0; }

    function next(){
      if(over||(mode==="practice"&&qCount>=(opts.rounds||10))){ cur=null; return null; }
      cur=draw(); qCount++;
      curRec={noteId:cur.id, sci:cur.sci, letter:cur.letter, clef:cur.clef, onLine:cur.onLine,
              level, attempts:0, firstTry:false, correct:false, timedOut:false, ms:null, hintUsed:false};
      records.push(curRec);
      return cur;
    }

    /* returns {correct, done, lifeLost, livesLeft, levelUp, over, success} */
    function answer(input,elapsedMs){
      if(!cur||curRec.correct||curRec.timedOut) return {correct:false,done:true,over};
      curRec.attempts++;
      const ok=String(input).toUpperCase()===cur.letter;
      if(ok){
        curRec.correct=true; curRec.firstTry=curRec.attempts===1; curRec.ms=elapsedMs;
        if(curRec.firstTry){ streak++; bestStreak=Math.max(bestStreak,streak); } else streak=0;
        let levelUp=false, heartGained=false;
        if(mode==="level"){
          inLevel++;
          if(inLevel>=L.notesPerLevel){
            if(level>=L.max){ over=true; success=true; }
            else { level++; inLevel=0; levelUp=true;
              /* one extra chance per level — the bird gets faster, the student
                 gets more forgiving room (instructor 2026-07-17) */
              if(L.heartPerLevel&&lives<(L.maxLives||99)){ lives++; heartGained=true; }
            }
          }
        }
        return {correct:true,done:true,lifeLost:false,livesLeft:lives,levelUp,heartGained,over,success};
      }
      streak=0;
      let lifeLost=false;
      if(mode==="level"){ lives--; lifeLost=true; if(lives<=0) over=true; }
      /* not done: the bird keeps flying (level) / waits (practice) — retry allowed while lives remain */
      return {correct:false,done:over,lifeLost,livesLeft:lives,levelUp:false,over,success:false};
    }

    function timeout(){
      if(!cur||curRec.correct||curRec.timedOut) return {over};
      curRec.timedOut=true; streak=0;
      let lifeLost=false;
      if(mode==="level"){ lives--; lifeLost=true; if(lives<=0) over=true; }
      return {lifeLost,livesLeft:lives,over,success:false};
    }

    function useHint(){ if(curRec) curRec.hintUsed=true; }

    function stats(){
      const done=records.filter(r=>r.correct||r.timedOut||r.attempts>0);
      const firstTry=records.filter(r=>r.firstTry).length;
      const wrongAtt=records.reduce((s,r)=>s+Math.max(0,r.attempts-(r.correct?1:0)),0);
      const timeouts=records.filter(r=>r.timedOut).length;
      const times=records.filter(r=>r.firstTry&&r.ms!=null).map(r=>r.ms);
      const acc=done.length?Math.round(firstTry/done.length*100):0;
      const st=NBData.SCORING.stars.find(s=>acc>=s.min);
      const missed={};
      records.forEach(r=>{ if((r.correct&&!r.firstTry)||r.timedOut||(!r.correct&&r.attempts>0)) missed[r.noteId]=(missed[r.noteId]||0)+1; });
      const byClef={treble:{ok:0,n:0},bass:{ok:0,n:0}};
      const byPos={line:{ok:0,n:0},space:{ok:0,n:0}};
      done.forEach(r=>{ const c=byClef[r.clef],p=byPos[r.onLine?"line":"space"];
        if(c){c.n++; if(r.firstTry)c.ok++;} if(p){p.n++; if(r.firstTry)p.ok++;} });
      return {
        mode, notesRead:done.length, firstTry, wrongAttempts:wrongAtt, timeouts,
        accuracy:acc, stars:st?st.stars:0,
        level, success, livesLeft:lives,
        avgMs:times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length):null,
        fastestMs:times.length?Math.min.apply(null,times):null,
        bestStreak,
        hintsUsed:records.filter(r=>r.hintUsed).length,
        missed, byClef, byPos, records
      };
    }

    return {
      get mode(){return mode;},
      get pool(){return pool;},
      get condition(){return opts.condition;},
      get rounds(){return opts.rounds||10;},
      get current(){return cur;},
      get qCount(){return qCount;},
      get level(){return level;},
      get inLevel(){return inLevel;},
      get lives(){return lives;},
      get over(){return over;},
      get success(){return success;},
      get streak(){return streak;},
      seconds,next,answer,timeout,useHint,stats
    };
  }

  /* nearest landmark hint (Practice mode). Returns a translated sentence. */
  function landmarkHint(note){
    let best=null,bd=1e9;
    NBData.LANDMARKS.forEach(lm=>{
      const d=NBData.dia(note.sci)-NBData.dia(lm.p);
      if(Math.abs(d)<bd){ bd=Math.abs(d); best={lm,d}; }
    });
    if(!best) return "";
    const label=nbt(best.lm.labelKey);
    if(best.d===0) return nbt("hint.isLandmark",{lm:label});
    return nbt("hint.fromLandmark",{
      lm:label, n:Math.abs(best.d),
      steps:nbt(Math.abs(best.d)===1?"hint.step":"hint.steps"),
      dir:nbt(best.d>0?"hint.up":"hint.down")});
  }

  /* ---------- local records (per-device; NOT the LMS) ----------
     history: every run. best: highest level per condition key. */
  function load(){
    try{ const v=JSON.parse(localStorage.getItem(NB_CONFIG.STORAGE_KEY)||"{}");
      return (v&&!Array.isArray(v))?v:{history:[],best:{}}; }
    catch(e){ return {history:[],best:{}}; }
  }
  function save(v){ try{ localStorage.setItem(NB_CONFIG.STORAGE_KEY,JSON.stringify(v)); }catch(e){} }
  function saveRun(condKey,rec){
    const v=load();
    v.history=v.history||[]; v.best=v.best||{};
    v.history.push(rec);
    while(v.history.length>NBData.SCORING.historyCap) v.history.shift();
    if(rec.mode==="level"){
      const b=v.best[condKey]||{level:0,successes:0};
      const isNewBest=rec.level>b.level||(rec.success&&!b.success);
      if(rec.level>b.level) b.level=rec.level;
      if(rec.success){ b.success=true; b.successes=(b.successes||0)+1; }
      b.last=rec.date;
      v.best[condKey]=b;
      save(v);
      return isNewBest;
    }
    save(v);
    return false;
  }
  function bestFor(condKey){ const v=load(); return (v.best||{})[condKey]||null; }
  function history(){ return load().history||[]; }

  return {createSession,landmarkHint,saveRun,bestFor,history};
})();
