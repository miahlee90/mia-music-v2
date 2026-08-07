/* Note Bird — instrument input (NBInput): answer by PLAYING the note.
   Two ways besides the letter buttons (which always keep working):
     🎹 MIDI keyboard  — Web MIDI note-on → letter (octave must match)
     🎤 Instrument sound — the microphone listens to a REAL instrument (piano,
                          violin, cello, flute… anything monophonic that sounds
                          as written; 2026-07-31 rename from "Piano sound") and
                          names what it hears (YIN pitch detection, same method
                          as Aural Lab's voice engine)
   v6 (2026-07-31, first real-device mic test): openMic hardened — permission
   request times out instead of hanging "Requesting…" forever, every failure
   after the grant is caught (worklet → ScriptProcessor fallback) and exposed
   via micError() for the setup panel to display; worklet pulled via muted
   gain so analysis frames are guaranteed to flow.
   v5 (usability review):
     - MIDI is connected by an EXPLICIT student action in setup
       (connectMIDI) with visible states: requesting / connected+device
       names / none / denied / unsupported. Hot-plug via onstatechange.
     - The microphone has a SETUP STEP before any timed round: enable →
       level meter → play one test note → ready. The same open pipeline is
       reused by the round, so the bird timer never starts while a
       permission popup or test is still in progress.
   Privacy, true in code: microphone audio is analyzed on this device only —
   never recorded, saved, or uploaded. The mic is opened only from a student
   action and a visible badge shows while it is open.
   v7 (instructor 2026-08-01): in mic mode the pipeline STAYS OPEN between
   rounds — game over / restart / returning to setup must not disconnect the
   instrument mic ("한번 연결하면 쭈욱"). Between rounds it is DEAF (sink
   null — frames are discarded). Tracks still fully close on input-mode
   change, tab hide and page close.
   While mic mode is on, background birdsong is suppressed so the game
   can't hear itself. Black keys are ignored (the game asks for naturals).
   Silence and low-confidence audio NEVER fire an answer (rmsGate + conf
   threshold + needFrames), so they can never count as wrong.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */
const NBInput=(()=>{
  const LS="nb-input-v1";
  const NAT={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
  /* rmsGate is calibrated for the ×5-BOOSTED signal (see openMic). Lowered
     .008→.003 (2026-08-07): the instructor's iPad peaks around .005–.012
     boosted — the meter danced but detection/pass never engaged. Confidence
     (conf .75) remains the real false-positive gate. */
  const CFG={fMin:60,fMax:1100,yinThresh:.15,rmsGate:.003,conf:.75,
             needFrames:3,cooldownMs:800,silenceMs:150};
  let mode=(()=>{ try{ return JSON.parse(localStorage.getItem(LS)).mode||"buttons"; }
    catch(e){ return "buttons"; } })();
  const save=()=>{ try{ localStorage.setItem(LS,JSON.stringify({mode})); }catch(e){} };

  let cb=null;
  let midiAccess=null, midiHot=false, midiNames=[], midiStatus="idle", midiWatch=null;
  let stream=null, ctx=null, node=null, sink=null, micHot=false, micIsReady=false;
  let trackRate=0, pathUsed="", kickHandler=null;   /* mic diagnostics (setup panel) */
  let micTrack=null, trackMuted=false;   /* iOS mutes the track when another
    tab/app holds the mic — frames then carry EXACT silence (level 0.000) */
  let realMusicStart=null, wrapped=[];
  /* while the GAME plays a sound (note preview, ding-dong-dang, wrong-slide)
     the mic must go deaf — otherwise it "hears" the game and answers itself */
  let suppressUntil=0;
  const suppress=ms=>{ suppressUntil=Math.max(suppressUntil,performance.now()+ms); };

  /* ---------- shared ---------- */
  const midiSupported=()=>!!navigator.requestMIDIAccess;
  const micSupported=()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia);
  function badge(txt){
    let b=document.getElementById("nbInBadge");
    if(!txt){ if(b) b.remove(); return; }
    if(!b){ b=document.createElement("div"); b.id="nbInBadge";
      b.style.cssText="position:fixed;right:14px;bottom:14px;z-index:60;background:#1c1e54;color:#fff;font-size:12.5px;font-weight:700;padding:8px 14px;border-radius:9999px;box-shadow:0 4px 14px rgba(0,0,0,.25)";
      document.body.appendChild(b); }
    b.textContent=txt;
  }
  /* answers carry the PLAYED midi too — on an instrument the octave matters
     (C4 is not the printed C2); the letter buttons stay octave-free */
  const fire=(l,midi)=>{ if(cb) cb({letter:l,midi}); };

  /* ---------- MIDI ---------- */
  function midiWire(){
    if(!midiAccess) return;
    midiNames=[];
    midiAccess.inputs.forEach(inp=>{ inp.onmidimessage=onMidiMsg; midiNames.push(inp.name||"MIDI device"); });
    midiStatus=midiNames.length?"on":"none";
    if(midiWatch) midiWatch(midiState());
  }
  function onMidiMsg(e){
    if(!midiHot) return;
    const [st,note,vel]=e.data;
    if((st&0xf0)===0x90&&vel>0){
      const L=NAT[note%12];
      if(L) fire(L,note);              /* black keys are simply ignored */
    }
  }
  function midiState(){ return {status:midiStatus,names:midiNames.slice()}; }
  /* the EXPLICIT connect action — call from a user click in setup; the
     permission popup is never triggered automatically on page load */
  async function connectMIDI(onChange){
    if(onChange) midiWatch=onChange;
    if(!midiSupported()){ midiStatus="unsupported"; if(midiWatch) midiWatch(midiState()); return midiState(); }
    if(!midiAccess){
      midiStatus="requesting"; if(midiWatch) midiWatch(midiState());
      try{ midiAccess=await navigator.requestMIDIAccess(); }
      catch(e){ midiStatus="denied"; if(midiWatch) midiWatch(midiState()); return midiState(); }
      midiAccess.onstatechange=midiWire;
    }
    midiWire();
    return midiState();
  }
  async function startMIDI(){
    await connectMIDI();
    if(midiStatus!=="on") return false;
    midiHot=true;
    badge("🎹 "+nbt("hud.midiOn"));
    return true;
  }

  /* ---------- microphone (YIN pitch detection) ---------- */
  function yin(buf,sr){
    const N=buf.length,half=N>>1;
    let rms=0; for(let i=0;i<N;i++) rms+=buf[i]*buf[i]; rms=Math.sqrt(rms/N);
    if(rms<CFG.rmsGate) return {freq:0,conf:0,rms};
    const cm=new Float32Array(half); cm[0]=1; let run=0;
    for(let tau=1;tau<half;tau++){
      let s=0; for(let i=0;i<half;i++){ const x=buf[i]-buf[i+tau]; s+=x*x; }
      run+=s; cm[tau]=s*tau/(run||1e-9);
    }
    const tMin=Math.max(2,Math.floor(sr/CFG.fMax)), tMax=Math.min(half-1,Math.ceil(sr/CFG.fMin));
    let tau=-1;
    for(let t=tMin;t<=tMax;t++){ if(cm[t]<CFG.yinThresh){ while(t+1<=tMax&&cm[t+1]<cm[t]) t++; tau=t; break; } }
    if(tau<0){ let best=tMin; for(let t=tMin;t<=tMax;t++) if(cm[t]<cm[best]) best=t;
      if(cm[best]<.5) tau=best; else return {freq:0,conf:1-cm[best],rms}; }
    const x0=cm[tau-1]??cm[tau], x2=cm[tau+1]??cm[tau];
    const den=x0+x2-2*cm[tau], shift=den?.5*(x0-x2)/den:0;
    return {freq:sr/(tau+shift),conf:1-cm[tau],rms};
  }
  /* onset logic: after silence (or a different pitch), the same pitch class
     seen on `needFrames` consecutive voiced frames = ONE played note.
     Unvoiced/quiet frames only ever RESET state — they can never fire. */
  function makeOnset(onNote){
    onNote=onNote||fire;
    let lastFire=0,lastVoiced=0,candPc=-1,candN=0,heldPc=-1;
    return r=>{
      const now=performance.now();
      if(now<suppressUntil){ candPc=-1; candN=0; return; }   /* game audio playing */
      const voiced=r.freq>0&&r.conf>=CFG.conf&&r.rms>=CFG.rmsGate;
      if(!voiced){ if(now-lastVoiced>CFG.silenceMs){ heldPc=-1; candPc=-1; candN=0; } return; }
      lastVoiced=now;
      const midi=Math.round(69+12*Math.log2(r.freq/440)), pc=((midi%12)+12)%12;
      if(pc===heldPc) return;                       /* still the same held note */
      if(pc===candPc) candN++; else { candPc=pc; candN=1; }
      if(candN>=CFG.needFrames&&now-lastFire>=CFG.cooldownMs){
        heldPc=pc; candPc=-1; candN=0; lastFire=now;
        const L=NAT[pc];
        if(L) onNote(L,midi);
      }
    };
  }
  /* one shared pipeline; `sink` decides where frames go (setup test vs round).
     v6 hardening (2026-07-31, first real-device test): the old version could
     hang on "Requesting…" forever — getUserMedia never settling (wedged
     device / OS privacy block) or ANY error after the permission grant threw
     out of the async click handler unseen. Now: gUM races an 8s timeout,
     everything after it is caught (worklet failure falls back to
     ScriptProcessor), failures store a readable reason in micError(), and the
     worklet is pulled through a MUTED gain to the destination so frames are
     guaranteed to flow (the ScriptProcessor path always did this). */
  let lastMicErr=null;
  const micError=()=>lastMicErr;
  async function openMic(){
    if(stream&&ctx&&node) return true;
    if(!micSupported()){ lastMicErr="unsupported"; return false; }
    /* iOS/Safari (the iPad Start-never-enables bug, 2026-08-07): the
       AudioContext must be CREATED and resume()d synchronously INSIDE the
       student's tap — this pre-await code still runs in that gesture.
       Creating it after the permission popup (as before) left the context
       permanently "suspended" on iPad: no analysis frames → level meter dead
       → the test note was never detected → Start stayed disabled. */
    try{
      if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==="suspended"){ const p=ctx.resume(); if(p&&p.catch) p.catch(()=>{}); }
    }catch(e){}
    try{ stream=await Promise.race([
        navigator.mediaDevices.getUserMedia(
          {audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:true}}),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout — no answer from the microphone")),8000))]); }
    catch(e){ lastMicErr=(e&&(e.name||e.message))||"denied"; stream=null; return false; }
    try{
      /* Safari's OTHER mic killer (2026-08-07): if the context's sample rate
         differs from the mic track's, createMediaStreamSource delivers pure
         SILENCE. Rebuild the context at the track's own rate when they differ
         (the pointerdown kick below covers a rebuilt context that comes back
         suspended). */
      try{
        const tr0=stream.getAudioTracks()[0];
        micTrack=tr0||null;
        if(tr0){ trackMuted=!!tr0.muted;
          tr0.onmute=()=>{ trackMuted=true; };
          tr0.onunmute=()=>{ trackMuted=false; }; }
        trackRate=(tr0&&tr0.getSettings&&tr0.getSettings().sampleRate)||0;
        if(trackRate&&ctx&&Math.abs(ctx.sampleRate-trackRate)>1){
          try{ ctx.close(); }catch(e){}
          ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:trackRate});
        }
      }catch(e){}
      /* belt-and-suspenders: retry resume after the grant, and if the context
         is STILL suspended let the student's next tap anywhere revive it */
      try{
        if(ctx.state==="suspended"){ const p=ctx.resume(); if(p&&p.catch) p.catch(()=>{}); }
        const kick=()=>{ try{ ctx&&ctx.state==="suspended"&&ctx.resume(); }catch(e){} };
        document.addEventListener("pointerdown",kick,{capture:true});
        kickHandler=kick;
      }catch(e){}
      const src0=ctx.createMediaStreamSource(stream);
      /* iPad mics run MUCH quieter than phones (instructor 2026-08-07: the
         level bar barely twitched) — boost before analysis so the same
         thresholds work everywhere. Pitch confidence is amplitude-relative,
         so this only lifts the floor, never distorts detection; the graph
         ends in a muted gain, so nothing audible changes. */
      const boost=ctx.createGain(); boost.gain.value=5;
      src0.connect(boost);
      const src=boost;
      const dispatch=r=>{ if(sink) sink(r); };
      let workletOk=false;
      if(ctx.audioWorklet){
        try{
          const code=`
        const CFG=${JSON.stringify({fMin:CFG.fMin,fMax:CFG.fMax,yinThresh:CFG.yinThresh,rmsGate:CFG.rmsGate})};
        ${yin.toString()}
        class NBP extends AudioWorkletProcessor{
          constructor(){ super(); this.buf=new Float32Array(1024); this.n=0; }
          process(inputs){ const ch=inputs[0]&&inputs[0][0]; if(!ch) return true;
            for(let i=0;i+2<ch.length;i+=3){
              this.buf[this.n++]=(ch[i]+ch[i+1]+ch[i+2])/3;
              if(this.n>=1024){ this.port.postMessage(yin(this.buf,sampleRate/3));
                this.buf.copyWithin(0,512); this.n=512; } }
            return true; } }
        registerProcessor("nb-pitch",NBP);`;
          const url=URL.createObjectURL(new Blob([code],{type:"application/javascript"}));
          await ctx.audioWorklet.addModule(url); URL.revokeObjectURL(url);
          node=new AudioWorkletNode(ctx,"nb-pitch");
          node.port.onmessage=e=>dispatch(e.data);
          src.connect(node);
          const mute=ctx.createGain(); mute.gain.value=0;  /* silent — keeps the graph pulled */
          node.connect(mute); mute.connect(ctx.destination);
          workletOk=true; pathUsed="worklet";
        }catch(e){ try{ if(node) node.disconnect(); }catch(_){} node=null; }
      }
      if(!workletOk){
        node=ctx.createScriptProcessor(4096,1,1);
        const sr=ctx.sampleRate/3;
        let acc=new Float32Array(1024),n=0;
        node.onaudioprocess=e=>{ const ch=e.inputBuffer.getChannelData(0);
          for(let i=0;i+2<ch.length;i+=3){ acc[n++]=(ch[i]+ch[i+1]+ch[i+2])/3;
            if(n>=1024){ dispatch(yin(acc,sr)); acc.copyWithin(0,512); n=512; } } };
        src.connect(node); node.connect(ctx.destination);
        pathUsed="sp";
      }
      lastMicErr=null;
      return true;
    }catch(e){ lastMicErr=(e&&(e.name||e.message))||"audio setup failed"; closeMic(); return false; }
  }
  function closeMic(){
    try{ if(stream) stream.getTracks().forEach(tr=>tr.stop()); }catch(e){}
    try{ if(node) node.disconnect(); }catch(e){}
    try{ if(ctx) ctx.close(); }catch(e){}
    try{ if(kickHandler) document.removeEventListener("pointerdown",kickHandler,{capture:true}); }catch(e){}
    stream=ctx=node=null; sink=null; micIsReady=false; kickHandler=null; pathUsed=""; trackRate=0;
    micTrack=null; trackMuted=false;
  }
  /* live plumbing readout for the setup panel — turns "it doesn't work" into
     a phone-photo-able reason (state / rates / worklet-vs-sp) */
  function micDiag(){
    return {state:ctx?ctx.state:"-", ctxRate:ctx?ctx.sampleRate:0,
            trackRate, path:pathUsed||"-",
            muted:trackMuted||(micTrack?micTrack.muted:false),
            trackState:micTrack?micTrack.readyState:"-"};
  }
  /* setup-time test: onFrame receives {rms} every frame and {note,midi} on a
     detected note — the UI draws the level meter and the "Heard: G (G3)"
     line from these. Nothing here ever answers a game question. */
  async function micTestStart(onFrame){
    if(!await openMic()) return false;
    const onset=makeOnset((L,midi)=>onFrame({note:L,midi}));
    sink=r=>{ onFrame({rms:r.rms||0}); onset(r); };
    badge("🎤 "+nbt("hud.micOn"));
    return true;
  }
  /* end of the setup test. ready=true keeps the OPEN pipeline for the round
     (no second permission, timer starts clean); ready=false closes tracks. */
  function micSetupDone(ready){
    sink=null; badge(null); micIsReady=!!ready;
    if(!ready) closeMic();
  }
  const micReady=()=>micIsReady&&!!stream;

  async function startMic(){
    if(!await openMic()) return false;
    sink=makeOnset(fire);
    micHot=true;
    badge("🎤 "+nbt("hud.micOn"));
    deafenGameAudio();
    return true;
  }
  /* the game must not hear itself while the mic listens: silence birdsong
     and wrap the game's tone calls so each raises a deaf window.
     NOTE: MFAudio/NBMusic are top-level consts and do NOT exist on window —
     guard with typeof, or these blocks silently never run (v1 bug). */
  function deafenGameAudio(){
    if(typeof NBMusic!=="undefined"&&!realMusicStart){ realMusicStart=NBMusic.start;
      NBMusic.start=()=>{}; NBMusic.stop(); }
    if(typeof MFAudio!=="undefined"&&!wrapped.length)
      [["tone",1900],["yay",1100]].forEach(([fn,ms])=>{
        if(typeof MFAudio[fn]==="function"){
          const orig=MFAudio[fn]; wrapped.push([fn,orig]);
          MFAudio[fn]=(...a)=>{ suppress(ms); return orig(...a); };
        }
      });
  }
  function restoreGameAudio(){
    if(typeof NBMusic!=="undefined"&&realMusicStart){ NBMusic.start=realMusicStart; realMusicStart=null; }
    wrapped.forEach(([fn,orig])=>{ MFAudio[fn]=orig; }); wrapped=[];
  }

  /* ---------- round lifecycle ---------- */
  async function enableForRound(answerCb){
    cb=answerCb;
    if(mode==="midi") return await startMIDI()?"midi":"buttons";
    if(mode==="mic")  return await startMic()?"mic":"buttons";
    return "buttons";
  }
  function stopRound(){
    cb=null; midiHot=false; micHot=false;
    restoreGameAudio();
    /* v7: mic mode keeps the pipeline OPEN (deaf, sink=null) so the next
       round starts instantly with no re-permission / re-setup */
    if(mode==="mic"&&stream&&micIsReady){ sink=null; badge("🎤 "+nbt("hud.micOn")); }
    else { badge(null); closeMic(); }
  }
  /* full shutdown — privacy paths only (tab hide, page close) */
  function shutdown(){
    cb=null; midiHot=false; micHot=false; badge(null);
    restoreGameAudio(); closeMic();
  }
  function setMode(m){
    if(m!==mode&&mode==="mic"){ badge(null); closeMic(); } /* leaving mic mode stops tracks */
    mode=m; save();
  }
  if(typeof document!=="undefined"){
    document.addEventListener("visibilitychange",()=>{ if(document.hidden&&(micHot||midiHot||stream)) shutdown(); });
    window.addEventListener("pagehide",()=>{ if(micHot||midiHot||stream) shutdown(); });
  }

  return {mode:()=>mode,setMode,
          midiSupported,micSupported,connectMIDI,midiState,
          micTestStart,micSetupDone,micReady,micError,micDiag,
          enableForRound,stopRound,suppress,
          yin,_onsetFactory:makeOnset,_deafen:deafenGameAudio,_restore:restoreGameAudio};
})();
window.NBInput=NBInput;   /* const doesn't land on window — expose explicitly */
