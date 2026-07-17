/* MFTrack — student session, academic tracking and offline sync.
   Zero dependencies on lesson pages: talks to Supabase via plain fetch RPC.
   Academic rules (see js/curriculum.js): only Learn-by-Doing step activities
   and the Final Quiz are recorded. Games, welcome hooks, vocabulary, audio
   demos, practice drills and page visits are NEVER sent.
   Offline behavior: events queue in localStorage with client-generated UUIDs
   (the server dedupes on them), original timestamps preserved; "saved" is
   shown only after server confirmation. */
const MFTrack=(()=>{
  const COURSE="practical-music-theory";
  const cfg=(typeof LMS_CONFIG!=="undefined")?LMS_CONFIG:{SUPABASE_URL:"",SUPABASE_ANON_KEY:""};
  const enabled=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY);
  const LSS="mf-lms-session", LSQ="mf-lms-queue", LSD="mf-lms-sent";

  function get(k,d){ try{return JSON.parse(localStorage.getItem(k))??d;}catch(e){return d;} }
  function set(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }
  function session(){ return get(LSS,null); }
  function uuid(){ return (crypto.randomUUID?crypto.randomUUID():
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==="x"?r:(r&3|8)).toString(16);})); }

  async function rpc(fn,args){
    const res=await fetch(cfg.SUPABASE_URL+"/rest/v1/rpc/"+fn,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":cfg.SUPABASE_ANON_KEY,
               "Authorization":"Bearer "+cfg.SUPABASE_ANON_KEY},
      body:JSON.stringify(args||{})});
    if(!res.ok){ const t=await res.text(); const err=new Error("rpc "+fn+" "+res.status+": "+t); err.status=res.status; throw err; }
    return res.json();
  }

  /* ---------- offline queue ---------- */
  let flushing=false;
  async function flush(){
    if(!enabled||flushing) return;
    const s=session(); if(!s) return;
    let q=get(LSQ,[]);
    if(!q.length){ paint(); return; }
    flushing=true; paint();
    try{
      while(q.length){
        const ev=q[0];
        const args=Object.assign({p_token:s.token,p_id:ev.id,p_course:COURSE,p_client_ts:ev.ts},ev.args);
        let r;
        try{ r=await rpc(ev.fn,args); }
        catch(err){
          if(err.status>=400&&err.status<500&&String(err.message).includes("invalid_session")){
            logout(false); break;               /* session died: stop, keep queue for next login */
          }
          throw err;                            /* network/5xx: retry later */
        }
        q.shift(); set(LSQ,q);                  /* confirmed by server (ok or dedup) */
      }
    }catch(e){ /* stay queued; retried on online/interval */ }
    flushing=false; paint();
  }
  function enqueue(fn,args){
    const q=get(LSQ,[]);
    q.push({id:uuid(),fn,args,ts:new Date().toISOString()});
    set(LSQ,q); paint(); flush();
  }

  /* ---------- status chip (lesson pages, signed-in students only) ---------- */
  let chip=null;
  function paint(){
    if(!enabled) return;
    const s=session();
    if(!document.body) return;
    if(!s){ if(chip){chip.remove();chip=null;} return; }
    if(!chip){
      chip=document.createElement("div");
      chip.id="mfSyncChip";
      chip.style.cssText="position:fixed;left:10px;bottom:10px;z-index:9999;font:600 12px/1 system-ui,sans-serif;"+
        "padding:7px 12px;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,.18);cursor:pointer";
      chip.title="Signed in as "+s.name+" — tap for My Progress";
      chip.onclick=()=>{ location.href=(location.pathname.indexOf("/lessons/")>=0?"../":"./")+"student.html"; };
      document.body.appendChild(chip);
    }
    const pending=get(LSQ,[]).length;
    if(pending){ chip.style.background="#b45309"; chip.style.color="#fff";
      chip.textContent="⟳ "+s.name+" — progress not yet synced ("+pending+")"; }
    else { chip.style.background="#166534"; chip.style.color="#fff";
      chip.textContent="✓ "+s.name+" — progress saved"; }
  }

  /* ---------- public: auth ---------- */
  async function login(classCode,accessCode){
    if(!enabled) throw new Error("LMS not configured");
    const r=await rpc("student_login",{p_class_code:classCode,p_access_code:accessCode});
    if(!r.ok) return r;
    set(LSS,{token:r.token,name:r.student.name,class:r.student.class,classCode:r.student.classCode});
    set(LSD,{});
    paint(); flush();
    return r;
  }
  function logout(callServer=true){
    const s=session();
    const pending=get(LSQ,[]).length;
    if(pending&&callServer&&!confirm(pending+" result(s) are not yet synced and will upload next time this student signs in on THIS device. Sign out anyway?")) return false;
    if(s&&callServer&&enabled){ rpc("student_logout",{p_token:s.token}).catch(()=>{}); }
    localStorage.removeItem(LSS); set(LSD,{});
    paint();
    return true;
  }
  async function progress(){
    const s=session(); if(!s) return null;
    return rpc("student_progress",{p_token:s.token});
  }

  /* ---------- public: academic events (the ONLY things ever recorded) ---------- */
  function lbd(item,activityId){
    if(!enabled||!session()) return;
    const sent=get(LSD,{});                 /* local first-time filter; server dedupes too */
    const k=item+"/"+activityId;
    if(sent[k]) return;
    sent[k]=1; set(LSD,sent);
    enqueue("record_lbd",{p_item:item,p_activity:activityId});
  }
  function quiz(item,earned,possible){
    if(!enabled||!session()) return;
    enqueue("record_quiz",{p_item:item,p_earned:earned,p_possible:possible});
  }

  if(enabled){
    window.addEventListener("online",flush);
    window.addEventListener("load",()=>{ paint(); flush(); });
    setInterval(flush,45000);
  }
  return {enabled,login,logout,session,progress,lbd,quiz,flush,rpc,COURSE,_pending:()=>get(LSQ,[]).length};
})();
