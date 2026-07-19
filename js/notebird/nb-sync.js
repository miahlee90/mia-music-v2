/* Note Bird — OPTIONAL server sync of finished runs (Supabase RPC
   `game_result_save`, defined in supabase/06-game-lab.sql).
   Safety model (owner 2026-07-17: "안전하게 작동하는 게 목적"):
   - The game NEVER depends on this: signed out, offline, or RPC not yet
     deployed → records stay in the local queue and the game plays on.
   - Fire-and-forget with an offline queue (mirrors lms.js): client UUIDs
     dedupe server-side, so retries can never double-count.
   - Reuses the lessons' student session token read-only; never touches
     the academic LMS tables or lms.js's own queue.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NBSync=(()=>{
  const QK="nb-sync-queue-v1", CAP=100, BACKOFF_MS=60000;
  const cfg=(typeof LMS_CONFIG!=="undefined")?LMS_CONFIG:{SUPABASE_URL:"",SUPABASE_ANON_KEY:""};
  const enabled=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY);
  let flushing=false, lastFail=0;

  function q(){ try{return JSON.parse(localStorage.getItem(QK))||[];}catch(e){return [];} }
  function setQ(v){ try{localStorage.setItem(QK,JSON.stringify(v));}catch(e){} }
  function session(){ try{return JSON.parse(localStorage.getItem("mf-lms-session"))||null;}catch(e){return null;} }
  function uuid(){ return (crypto.randomUUID?crypto.randomUUID():
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==="x"?r:(r&3|8)).toString(16);})); }

  async function rpc(fn,args){
    const res=await fetch(cfg.SUPABASE_URL+"/rest/v1/rpc/"+fn,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":cfg.SUPABASE_ANON_KEY,
               "Authorization":"Bearer "+cfg.SUPABASE_ANON_KEY},
      body:JSON.stringify(args||{})});
    if(!res.ok){ const t=await res.text(); const err=new Error(fn+" "+res.status+": "+t); err.status=res.status; throw err; }
    return res.json();
  }

  async function flush(){
    if(!enabled||flushing) return;
    const s=session(); if(!s||!s.token) return;
    if(Date.now()-lastFail<BACKOFF_MS) return;   /* RPC missing/offline: don't hammer */
    flushing=true;
    try{
      for(;;){
        const queue=q();
        if(!queue.length) break;
        const ev=queue[0];
        try{
          await rpc("game_result_save",Object.assign({p_token:s.token},ev.args));
        }catch(err){
          /* dead session: keep the queue for the next sign-in; anything else
             (offline, 404 while SQL not yet run, 5xx): back off and retry later */
          if(!(err.status>=400&&err.status<500&&String(err.message).includes("invalid_session")))
            lastFail=Date.now();
          break;
        }
        const q2=q(); if(q2.length&&q2[0].id===ev.id){ q2.shift(); setQ(q2); }
      }
    }finally{ flushing=false; }
  }

  /* rec = the same object saved locally by NBEngine.saveRun (+condKey) */
  function push(rec){
    if(!enabled) return;
    const s=session(); if(!s||!s.token) return;   /* anonymous play stays local-only */
    const queue=q();
    queue.push({id:uuid(),args:{
      p_id:uuid(), p_game:rec.game, p_mode:rec.mode,
      p_condition:rec.condition, p_cond_key:rec.condKey,
      p_level:rec.level||0, p_success:!!rec.success,
      p_notes:rec.notesRead||0, p_accuracy:rec.accuracy||0,
      p_avg_ms:rec.avgMs||null, p_fastest_ms:rec.fastestMs||null,
      p_best_streak:rec.bestStreak||0, p_wrong:rec.wrong||0,
      p_timeouts:rec.timeouts||0, p_hints:rec.hintsUsed||0,
      p_missed:rec.missed||[], p_client_ts:rec.date}});
    while(queue.length>CAP) queue.shift();
    setQ(queue);
    flush();
  }

  if(typeof window!=="undefined"){
    window.addEventListener("online",()=>{ lastFail=0; flush(); });
    setTimeout(flush,2500);   /* pick up anything queued from earlier visits */
  }
  return {push,flush,pending:()=>q().length,enabled:()=>enabled};
})();
