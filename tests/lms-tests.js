/* LMS client-side logic tests. Run with the Electron-node substitute:
   ELECTRON_RUN_AS_NODE=1 <Moises.exe> tests/lms-tests.js
   Covers: curriculum integrity, tracking-hook presence (and absence in games),
   offline queue dedupe/retry, local LBD first-time filter, sign-out warning. */
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.join(__dirname,"..");
let pass=0, fail=0;
function T(name,fn){ try{ fn(); pass++; console.log("  ok  "+name); }
  catch(e){ fail++; console.log("FAIL  "+name+" — "+e.message); } }
function eq(a,b,msg){ if(a!==b) throw new Error((msg||"")+" expected "+JSON.stringify(b)+", got "+JSON.stringify(a)); }
function ok(v,msg){ if(!v) throw new Error(msg||"expected truthy"); }

/* ---------- curriculum integrity ---------- */
const cur=(()=>{ const sb={module:{exports:null}}; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(ROOT,"js/curriculum.js"),"utf8"),sb); return sb.module.exports; })();
T("curriculum: 107 active pages",()=>eq(cur.pages.filter(p=>p.status==="active").length,107));
T("curriculum: 15 units",()=>eq(cur.units.length,15));
T("curriculum: ids unique & stable-ordered",()=>{
  const ids=cur.pages.map(p=>p.id); eq(new Set(ids).size,107);
  ok(ids.every((v,i)=>i===0||v>ids[i-1]),"ids ascending"); });
T("curriculum: labels unique",()=>eq(new Set(cur.pages.map(p=>p.label)).size,107));
T("curriculum: every page has >=1 required LBD activity",()=>ok(cur.pages.every(p=>p.lbdIds.length>=1)));
T("curriculum: every page has a Final Quiz",()=>ok(cur.pages.every(p=>p.hasQuiz)));
T("curriculum: every route file exists",()=>ok(cur.pages.every(p=>fs.existsSync(path.join(ROOT,p.route)))));
T("curriculum: units cover pages exactly",()=>{
  cur.units.forEach(u=>ok(cur.pages.some(p=>p.unit===u.unit),"unit "+u.unit+" empty")); });
T("curriculum: matches lessons-data labels",()=>{
  const sb={}; vm.createContext(sb);
  const d=vm.runInContext(fs.readFileSync(path.join(ROOT,"js/lessons-data.js"),"utf8")+";({LESSONS:LESSONS})",sb).LESSONS;
  cur.pages.forEach(p=>{ const L=d.find(x=>x.n===p.id); eq(L.label,p.label,"label of "+p.id); }); });

/* ---------- hook presence / absence ---------- */
const tpl=fs.readFileSync(path.join(ROOT,"js/template.js"),"utf8");
const games=fs.readFileSync(path.join(ROOT,"js/games.js"),"utf8");
const quizjs=fs.readFileSync(path.join(ROOT,"js/quiz.js"),"utf8");
T("template.js hooks LBD on step feedback only (fbN regex)",()=>ok(tpl.includes('/^fb(\\d+)$/')&&tpl.includes("MFTrack.lbd")));
T("template.js hooks Final Quiz onDone",()=>ok(tpl.includes("MFTrack.quiz(n,score,total)")));
T("games.js has NO tracking calls (games never academic)",()=>ok(!games.includes("MFTrack")));
T("quiz.js has NO direct tracking calls (only template onDone)",()=>ok(!quizjs.includes("MFTrack")));
T("welcome hook not tracked (hookFb excluded by regex)",()=>ok(!/MFTrack\.lbd\([^)]*hook/i.test(tpl)));

/* ---------- lms.js queue behavior (stubbed browser env) ---------- */
function makeEnv(fetchImpl){
  const store={};
  const env={
    LMS_CONFIG:{SUPABASE_URL:"https://x.supabase.co",SUPABASE_ANON_KEY:"k"},
    localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
    crypto:{randomUUID:(()=>{let i=0;return()=>"00000000-0000-4000-8000-"+String(++i).padStart(12,"0");})()},
    fetch:fetchImpl,
    window:{addEventListener(){}},
    document:{get body(){return null;}},
    setInterval:()=>0, confirm:()=>true, console,
  };
  env.globalThis=env;
  vm.createContext(env);
  vm.runInContext(fs.readFileSync(path.join(ROOT,"js/lms.js"),"utf8")+";this.MFTrack=MFTrack;",env);
  env._store=store;
  return env;
}
const okJson=obj=>Promise.resolve({ok:true,json:()=>Promise.resolve(obj),text:()=>Promise.resolve("")});
const wait=ms=>new Promise(r=>setTimeout(r,ms));

T("lbd() without a session records nothing",()=>{
  const env=makeEnv(()=>okJson({ok:true}));
  env.MFTrack.lbd(5,"s1");
  eq(env.MFTrack._pending(),0);
});
(async()=>{
  await (async()=>{ /* async tests run sequentially */
    /* local first-time filter: same activity queued once */
    {
      const calls=[];
      const env=makeEnv((url,o)=>{calls.push(url);return okJson({ok:true,new:true});});
      env._store["mf-lms-session"]=JSON.stringify({token:"t",name:"Ari",class:"C"});
      env.MFTrack.lbd(5,"s1"); env.MFTrack.lbd(5,"s1"); env.MFTrack.lbd(5,"s2");
      await wait(50);
      T("lbd local dedupe: 2 distinct events for 3 calls",()=>eq(calls.filter(u=>u.includes("record_lbd")).length,2));
      T("queue drains after server confirms",()=>eq(env.MFTrack._pending(),0));
    }
    /* offline: events stay queued with original timestamps, then flush */
    {
      let net=false; const seen=[];
      const env=makeEnv((url,o)=>{ if(!net) return Promise.reject(new Error("offline"));
        seen.push(JSON.parse(o.body)); return okJson({ok:true}); });
      env._store["mf-lms-session"]=JSON.stringify({token:"t",name:"Ari",class:"C"});
      env.MFTrack.quiz(7,15,20);
      await wait(50);
      T("offline: event stays pending",()=>eq(env.MFTrack._pending(),1));
      const ts=JSON.parse(env._store["mf-lms-queue"])[0].ts;
      net=true; await env.MFTrack.flush(); await wait(20);
      T("retry flush delivers after reconnect",()=>eq(env.MFTrack._pending(),0));
      T("original client timestamp preserved through retry",()=>eq(seen[0].p_client_ts,ts));
      T("client UUID sent for server-side dedupe",()=>ok(/^[0-9a-f-]{36}$/.test(seen[0].p_id)));
      T("quiz payload carries earned/possible",()=>{eq(seen[0].p_earned,15);eq(seen[0].p_possible,20);});
    }
    /* server 5xx: keep queued */
    {
      const env=makeEnv(()=>Promise.resolve({ok:false,status:500,text:()=>Promise.resolve("boom"),json:()=>Promise.resolve({})}));
      env._store["mf-lms-session"]=JSON.stringify({token:"t",name:"Ari",class:"C"});
      env.MFTrack.quiz(7,10,20); await wait(50);
      T("server error: event kept for retry (no false 'saved')",()=>eq(env.MFTrack._pending(),1));
    }
    /* logout clears session; unsynced warning honored */
    {
      let asked=false;
      const env=makeEnv(()=>Promise.reject(new Error("offline")));
      env.confirm=()=>{asked=true;return false;};
      env._store["mf-lms-session"]=JSON.stringify({token:"t",name:"Ari",class:"C"});
      env.MFTrack.quiz(7,10,20); await wait(30);
      const stayed=env.MFTrack.logout()===false;
      T("sign-out warns when unsynced and can be cancelled",()=>ok(asked&&stayed&&!!env.MFTrack.session()));
    }
    console.log("\n"+pass+" passed, "+fail+" failed");
    process.exit(fail?1:0);
  })();
})();
