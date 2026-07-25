/* Note Bird — instrument input (NBInput): answer by PLAYING the note.
   Two ways besides the letter buttons (which always keep working):
     🎹 MIDI keyboard  — Web MIDI note-on → letter (any octave counts)
     🎤 Piano sound    — the microphone listens to a REAL piano and names
                          what it hears (YIN pitch detection, same method as
                          Aural Lab's voice engine)
   Privacy, true in code: microphone audio is analyzed on this device only —
   never recorded, saved, or uploaded. The mic is requested only when a
   round starts in mic mode (a student action), a visible badge shows while
   listening, and everything stops on round end / tab hide / page close.
   While mic mode is on, background birdsong is suppressed so the game
   can't hear itself. Black keys are ignored (the game asks for naturals);
   octave never matters — reading the LETTER is the skill. */
const NBInput=(()=>{
  const LS="nb-input-v1";
  const NAT={0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"};
  const CFG={fMin:60,fMax:1100,yinThresh:.15,rmsGate:.008,conf:.75,
             needFrames:3,cooldownMs:800,silenceMs:150};
  let mode=(()=>{ try{ return JSON.parse(localStorage.getItem(LS)).mode||"buttons"; }
    catch(e){ return "buttons"; } })();
  const save=()=>{ try{ localStorage.setItem(LS,JSON.stringify({mode})); }catch(e){} };

  let cb=null, midiAccess=null, midiHot=false;
  let stream=null, ctx=null, node=null, micHot=false;
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
  async function startMIDI(){
    if(!midiSupported()) return false;
    try{ midiAccess=midiAccess||await navigator.requestMIDIAccess(); }
    catch(e){ return false; }
    const wire=()=>{ midiAccess.inputs.forEach(inp=>{ inp.onmidimessage=onMsg; }); };
    const onMsg=e=>{
      if(!midiHot) return;
      const [st,note,vel]=e.data;
      if((st&0xf0)===0x90&&vel>0){
        const L=NAT[note%12];
        if(L) fire(L,note);            /* black keys are simply ignored */
      }
    };
    midiAccess.onstatechange=wire;
    wire();
    if([...midiAccess.inputs.values()].length===0) return false;
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
     seen on `needFrames` consecutive voiced frames = ONE played note */
  function makeOnset(){
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
        if(L) fire(L,midi);
      }
    };
  }
  async function startMic(){
    if(!micSupported()) return false;
    try{ stream=await navigator.mediaDevices.getUserMedia(
      {audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:true}}); }
    catch(e){ return false; }
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    const src=ctx.createMediaStreamSource(stream);
    const onset=makeOnset();
    if(ctx.audioWorklet){
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
      node.port.onmessage=e=>onset(e.data);
      src.connect(node);
    }else{
      node=ctx.createScriptProcessor(4096,1,1);
      const sr=ctx.sampleRate/3;
      let acc=new Float32Array(1024),n=0;
      node.onaudioprocess=e=>{ const ch=e.inputBuffer.getChannelData(0);
        for(let i=0;i+2<ch.length;i+=3){ acc[n++]=(ch[i]+ch[i+1]+ch[i+2])/3;
          if(n>=1024){ onset(yin(acc,sr)); acc.copyWithin(0,512); n=512; } } };
      src.connect(node); node.connect(ctx.destination);
    }
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
    if(typeof MFAudio!=="undefined"&&!wrapped.length) ["tone","yay"].forEach(fn=>{
      if(typeof MFAudio[fn]==="function"){
        const orig=MFAudio[fn]; wrapped.push([fn,orig]);
        MFAudio[fn]=(...a)=>{ suppress(1900); return orig(...a); };
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
    cb=null; midiHot=false; micHot=false; badge(null);
    try{ if(stream) stream.getTracks().forEach(tr=>tr.stop()); }catch(e){}
    try{ if(node) node.disconnect(); }catch(e){}
    try{ if(ctx) ctx.close(); }catch(e){}
    stream=ctx=node=null;
    restoreGameAudio();
  }
  if(typeof document!=="undefined"){
    document.addEventListener("visibilitychange",()=>{ if(document.hidden&&(micHot||midiHot)) stopRound(); });
    window.addEventListener("pagehide",()=>{ if(micHot||midiHot) stopRound(); });
  }

  return {mode:()=>mode,setMode:m=>{ mode=m; save(); },
          midiSupported,micSupported,enableForRound,stopRound,suppress,
          yin,_onsetFactory:makeOnset,_deafen:deafenGameAudio,_restore:restoreGameAudio};
})();
window.NBInput=NBInput;   /* const doesn't land on window — expose explicitly */
