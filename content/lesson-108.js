/* Lesson 108 — Chord Extensions: 9ths, 11ths, and 13ths (Book 4, Unit 27 — SELF-AUTHORED)
   Core: stack 3rds past the 7th -> 9th, 11th, 13th chords. Numbers = compound
   2/4/6. Bare numbers = dominant family. Practical voicings omit tones (the
   unaltered 5th first; the 3rd in a dominant 11th; the natural 11th in a
   dominant 13th). 13 is the ceiling (the 15th repeats the root).
   Interactive score+audio examples live INSIDE Learn by Doing.
   NOTE: edit by FULL-FILE REWRITE only. */

/* ---- shared interactive core: grand-staff score(s) + playback + keyboard sync + question ---- */
function MF_L108_mount(container,fb,cfg){
  let h=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:4px">${cfg.heading}</div>`;
  const specs=cfg.staves||[cfg.staff];
  specs.forEach((s,si)=>{ if(cfg.staveLabels&&cfg.staveLabels[si]) h+=`<div style="text-align:center;font-size:11px;color:#5a5f6b;margin-top:${si?6:0}px">${cfg.staveLabels[si]}</div>`;
    h+=`<div class="l108-st${si}"></div>`; });
  if(cfg.midLabel) h+=`<div style="text-align:center;font-size:11.5px;color:#2F6DA8;font-weight:700;margin-top:2px">${cfg.midLabel}</div>`;
  h+=`<div class="l108-btns" style="text-align:center;margin-top:6px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap"></div>`;
  if(cfg.kb) h+=`<div class="l108-kb" style="margin-top:8px"></div>`;
  if(cfg.analysis) h+=`<div style="margin-top:8px">${cfg.analysis}</div>`;
  if(cfg.caption) h+=`<div style="text-align:center;font-size:11.5px;color:#5a5f6b;font-style:italic;margin-top:6px">${cfg.caption}</div>`;
  h+=`<div class="choices l108-ch" style="margin-top:10px"></div>`;
  container.innerHTML=h;
  const apis=specs.map((s,si)=>Staff.render(container.querySelector(".l108-st"+si),s));
  const kbApi=cfg.kb?Keyboard.create(container.querySelector(".l108-kb"),cfg.kb):null;
  function playStaff(si,tempo){ si=si||0; const s=specs[si], api=apis[si];
    const spec=tempo?Object.assign({},s,{tempo:tempo}):s;
    const pApi={svg:api.svg,highlight:(ix,keep)=>{ api.highlight(ix,keep);
      if(ix!=null&&kbApi){ const n=s.notes[ix]; if(n&&n.bar===undefined&&(n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p),true); } }};
    Staff.play(spec,pApi); }
  function blockPlay(midis,si,indices,dur){ si=si||0; dur=dur||1.3; const api=apis[si];
    midis.forEach(m=>MFAudio.tone(m,dur,0,0.34));
    api.highlight(null); (indices||[]).forEach(ix=>api.highlight(ix,true)); if(kbApi)midis.forEach(m=>kbApi.press(m,true));
    setTimeout(()=>api.highlight(null),(dur+0.1)*1000); }
  function mel(si,indices,midis,gap){ si=si||0; gap=gap||0.55; const api=apis[si];
    midis.forEach((m,k)=>{ MFAudio.tone(m,0.6,k*gap,0.5);
      setTimeout(()=>{ api.highlight(null); api.highlight(indices[k],true); if(kbApi)kbApi.press(m,true); },k*gap*1000); });
    setTimeout(()=>api.highlight(null),(midis.length*gap+0.6)*1000); }
  function arp(si,indices,midis,gap){ si=si||0; gap=gap||0.42; const api=apis[si];
    midis.forEach((m,k)=>{ MFAudio.tone(m,0.6,k*gap,0.5);
      setTimeout(()=>{ api.highlight(indices[k],true); if(kbApi)kbApi.press(m,true); },k*gap*1000); });
    setTimeout(()=>api.highlight(null),(midis.length*gap+0.9)*1000); }
  function playSeq(steps,gap,dur){ gap=gap||1.1; dur=dur||0.95;
    steps.forEach((st,k)=>{ const t=k*gap;
      st.midis.forEach(m=>MFAudio.tone(m,dur,t,0.34));
      setTimeout(()=>{ apis.forEach(a=>a.highlight(null)); (st.indices||[]).forEach(ix=>apis[st.si||0].highlight(ix,true)); if(kbApi)st.midis.forEach(m=>kbApi.press(m,true)); },t*1000); });
    setTimeout(()=>apis.forEach(a=>a.highlight(null)),(steps.length*gap+dur)*1000); }
  const H={playStaff,blockPlay,mel,arp,playSeq,apis,kbApi};
  const bwrap=container.querySelector(".l108-btns");
  cfg.buttons.forEach(bt=>{ const b=document.createElement("button"); b.className="play"; b.textContent=bt.label; b.onclick=()=>bt.run(H); bwrap.appendChild(b); });
  const ch=container.querySelector(".l108-ch");
  const qs=cfg.questions||(cfg.question?[cfg.question]:[]);
  let qi=0;
  function renderQ(){ ch.innerHTML="";
    const q=qs[qi]; if(!q) return;
    if(q.q){ const qd=document.createElement("div"); qd.style.cssText="font-weight:700;margin-bottom:6px"; qd.innerHTML=q.q; ch.appendChild(qd); }
    if(qi>0){ const m=document.createElement("div"); m.style.cssText="color:#2e7d32;font-weight:700;font-size:12px;margin-bottom:4px"; m.textContent=qs[qi-1].ok; ch.appendChild(m); }
    q.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{ if(i===q.answer){ if(qi>=qs.length-1) fb(true,q.ok); else { qi++; renderQ(); } }
        else { MFAudio.tone(40,.2,0,.3); fb(false,q.no); } };
      ch.appendChild(b); }); }
  renderQ();
}
/* ---- listening comparison panel (in Learn by Doing) ---- */
function MF_L108_colors(container,fb){
  container.innerHTML=`<div style="text-align:center;font-weight:800;color:#5a4a12;margin-bottom:8px">Compare the Colors of the Extensions</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
      <button class="play" data-k="c9">▶ C9</button>
      <button class="play" data-k="c11">▶ C11(no 3rd)</button>
      <button class="play" data-k="c13">▶ C13</button>
      <button class="play" data-k="prog">▶ Dm9–G13–Cmaj9</button></div>
    <div class="l108col-msg" style="min-height:16px;font-weight:700;font-size:12px;margin-top:6px;text-align:center;color:#2e7d32"></div>
    <div class="choices l108col-ch" style="margin-top:6px"></div>`;
  const play=(midis,when,dur)=>midis.forEach(m=>MFAudio.tone(m,dur||1.3,when||0,0.32));
  const seq=(chords,gap)=>chords.forEach((c,i)=>play(c,i*(gap||1.0),0.9));
  const B={ c9:()=>play([48,52,58,62]), c11:()=>play([48,58,62,65]), c13:()=>play([48,52,58,69]),
    prog:()=>seq([[50,53,60,64],[43,53,59,64],[48,52,59,62]],1.0) };
  container.querySelectorAll("button[data-k]").forEach(b=>b.onclick=()=>B[b.dataset.k]());
  const qs=[
    {q:"Which example contains a natural 11th while omitting the major 3rd?",choices:["C11(no 3rd)","C9","C13"],answer:0,ok:"✓ Correct. C11(no 3rd) keeps the 11th (F) and drops the major 3rd to avoid the E–F clash."},
    {q:"Which example emphasizes the 13th while omitting the natural 11th?",choices:["C13","C9","C11(no 3rd)"],answer:0,ok:"✓ Correct. The practical C13 keeps the 3rd, 7th, and 13th and omits the natural 11th."}
  ];
  const ch=container.querySelector(".l108col-ch"), msg=container.querySelector(".l108col-msg");
  let qi=0;
  function render(){ ch.innerHTML=""; const q=qs[qi];
    const qd=document.createElement("div"); qd.style.cssText="font-weight:700;margin-bottom:6px"; qd.textContent=q.q; ch.appendChild(qd);
    q.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{ if(i===q.answer){ if(qi>=qs.length-1) fb(true,q.ok); else { msg.textContent=q.ok; qi++; render(); } }
        else { MFAudio.tone(40,.2,0,.3); fb(false,"Listen again and compare the highlighted extension in each example."); } };
      ch.appendChild(b); }); }
  render();
}
/* ---- compact replay panel for the final listening section ---- */
function MF_L108_review(host){
  host.innerHTML=`<div style="text-align:center;font-weight:700;color:#5a5f6b;margin-bottom:8px">Replay the Learn-by-Doing examples</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
      <button class="play" data-k="build">▶ Build 9–11–13</button>
      <button class="play" data-k="c11">▶ Practical C11</button>
      <button class="play" data-k="c13">▶ Practical C13</button>
      <button class="play" data-k="prog">▶ Extended ii–V–I</button></div>`;
  const play=(midis,when,dur)=>midis.forEach(m=>MFAudio.tone(m,dur||1.3,when||0,0.32));
  const seq=(chords,gap,dur)=>chords.forEach((c,i)=>play(c,i*(gap||1.0),dur||0.9));
  const B={ build:()=>seq([[48,52,55,58,62],[48,52,55,58,62,65],[48,52,55,58,62,65,69]],1.2,1.0),
    c11:()=>seq([[48,58,62,65],[41,57,60,64,67]],1.1), c13:()=>seq([[48,52,58,69],[41,57,60,64,67]],1.1),
    prog:()=>seq([[50,53,60,64],[43,53,59,64],[48,52,59,62]],1.0) };
  host.querySelectorAll("button[data-k]").forEach(b=>b.onclick=()=>B[b.dataset.k]());
}

LESSON_CONTENT[108]={
  welcome:"Extended chords continue the stack of thirds beyond the seventh.",
  hook:{
    say:"<b>Listen as thirds are added above a seventh chord.</b> \u{1F447} <b>Which compound intervals are added to create ninth, eleventh, and thirteenth chords?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ Build the complete stack</button></div>
          <div class="choices hk-ch" style="display:none"><button>The stack extends to the 9th, 11th, and 13th</button><button>The stack contains only a root-position triad</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ [[55,59,62,65],[55,59,62,65,69],[55,59,65,69,72,76]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.9,i*1.0,.30))); setTimeout(()=>ch.style.display="",3400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Continuing the tertian stack beyond the seventh produces the ninth, eleventh, and thirteenth. These are called chord extensions.");
          else fb(false,"Count the compound intervals above the root: 9th, 11th, and 13th.");
        });
      } }
  },
  objectives:[
    "Build 9th, 11th, and 13th chords by continuing the stack of thirds",
    "Relate 9, 11, and 13 to their simple interval equivalents",
    "Interpret bare 9, 11, and 13 symbols as dominant-family chords",
    "Compare theoretical chord stacks with practical performance voicings",
    "Voice dominant 11th chords with the 11th present and the 3rd often omitted",
    "Voice dominant 13th chords with the 3rd, 7th, and 13th emphasized",
    "Hear extended chords in practical ii–V–I progressions"
  ],
  steps:[
    { say:"<b>Continuing the Stack:</b> Adding a third above a seventh chord produces a <b>ninth chord</b>. Adding another third produces an <b>eleventh chord</b>, and adding one more produces a <b>thirteenth chord</b>. The complete theoretical C13 stack is C–E–G–B♭–D–F–A: root, third, fifth, seventh, ninth, eleventh, and thirteenth. These are complete theoretical stacks; practical performance voicings normally contain fewer notes. \u{1F447} <b>How many different chord members are in a complete theoretical ninth chord?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Chord</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Complete stack (on C)</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#2F6DA8">C9</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">C–E–G–B\u{266D}–D</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#A9821F">C11</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">C–E–G–B\u{266D}–D–F</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#C05A21">C13</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px">C–E–G–B\u{266D}–D–F–A</td></tr></table>` },
      try:{ type:"mc", choices:["Five","Three","Nine"], answer:0,
        success:"✓ Correct. A complete ninth chord contains the root, third, fifth, seventh, and ninth.",
        fail:"Count the different chord members in C–E–G–B♭–D.",
        hint:"A complete seventh chord plus one additional third." } },
    { say:"<b>Build the Dominant Extension Stack:</b> Below, the complete theoretical stack is written on C across three measures. Play it as block chords, then as stacked thirds to hear each new extension enter from the bottom. \u{1F447} <b>Answer after exploring the score.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"C dominant: V in F major",
        staff:{clef:"grand",keysig:"F",time:"4/4",tempo:60,notes:[
          {p:"C3",d:"w",clef:"bass",label:"C9"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"C11"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"C13"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:480},
        kb:{start:48,octaves:2,labels:true},
        midLabel:"Root → 3rd → 5th → 7th → 9th → 11th → 13th",
        buttons:[
          {label:"▶ Play as block chords", run:H=>H.playStaff(0)},
          {label:"▶ Play as stacked thirds", run:H=>H.arp(0,[13,14,15,16,17,18,19],[48,52,55,58,62,65,69])}
        ],
        caption:"These complete stacks demonstrate chord construction. Performers normally use fewer notes in practical voicings.",
        question:{ q:"Which pitch is added to C11 to create the complete theoretical C13 stack?",
          choices:["A, the thirteenth","F, the eleventh","C, the root"], answer:0,
          ok:"Correct. A is a thirteenth above C and completes the theoretical C13 stack.",
          no:"C11 already contains F (the 11th). The next third above F is A, the thirteenth." } }) } },
    { say:"<b>Extension Numbers:</b> Chord extensions are named as compound intervals above the root: the 9th = a compound 2nd, the 11th = a compound 4th, the 13th = a compound 6th. Hear each interval from C, then compare all three. \u{1F447} <b>What is the simple equivalent of a thirteenth?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"Extension intervals above C",
        staff:{clef:"treble",tempo:0,notes:[
          {p:"C4",d:"w",label:"M9"},{p:"D5",d:"w",chord:true},{bar:"single"},
          {p:"C4",d:"w",label:"P11"},{p:"F5",d:"w",chord:true},{bar:"single"},
          {p:"C4",d:"w",label:"M13"},{p:"A5",d:"w",chord:true},{bar:"final"}],width:360},
        kb:{start:60,octaves:1.9167,labels:true},
        buttons:[
          {label:"▶ Hear root to 9th", run:H=>H.mel(0,[0,1],[60,74])},
          {label:"▶ Hear root to 11th", run:H=>H.mel(0,[3,4],[60,77])},
          {label:"▶ Hear root to 13th", run:H=>H.mel(0,[6,7],[60,81])},
          {label:"▶ Hear all three", run:H=>{ H.mel(0,[0,1],[60,74]); setTimeout(()=>H.mel(0,[3,4],[60,77]),1300); setTimeout(()=>H.mel(0,[6,7],[60,81]),2600); }}
        ],
        midLabel:"9th = compound 2nd · 11th = compound 4th · 13th = compound 6th",
        question:{ q:"What is the simple equivalent of a thirteenth?",
          choices:["Sixth","Third","Fifth"], answer:0,
          ok:"✓ Correct. Subtracting 7 from 13 gives 6, so a thirteenth is a compound sixth.",
          no:"Reduce the compound interval: 13 − 7 = 6." } }) } },
    { say:"<b>Chord-Symbol Quality:</b> When 9, 11, or 13 follows a bare root letter, the symbol normally indicates a dominant-seventh foundation: C9 = C7 with an added ninth, C11 = C7 with upper extensions through the eleventh, C13 = C7 with a thirteenth extension. Major- and minor-seventh foundations must be identified explicitly: Cmaj9, Cm9, Cmaj13, or Cm11. An added-tone symbol such as Cadd9 adds the ninth without implying a seventh. \u{1F447} <b>Which seventh does C9 contain?</b>",
      try:{ type:"mc", choices:["B♭, a minor seventh above C","B♮, a major seventh above C","No seventh"], answer:0,
        success:"✓ Correct. C9 is based on C7, so it contains B♭. Use Cmaj9 for a chord containing B♮.",
        fail:"Begin with C7 and add D, the ninth.",
        hint:"A bare root followed by 9 implies a dominant-seventh-quality foundation." } },
    { say:"<b>C9, Cmaj9, Cm9, and Cadd9:</b> These four symbols on the same root sound clearly different. Play each and compare, listening especially to the seventh. \u{1F447} <b>Answer after comparing.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"Root: C — isolated chord-symbol comparison",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",clef:"bass",label:"C9"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cmaj9"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cm9"},{p:"Eb3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cadd9"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"final"}],width:520},
        kb:{start:48,octaves:1.3333,labels:true},
        buttons:[
          {label:"▶ C9", run:H=>H.blockPlay([48,52,58,62],0,[0,1,2,3])},
          {label:"▶ Cmaj9", run:H=>H.blockPlay([48,52,59,62],0,[5,6,7,8])},
          {label:"▶ Cm9", run:H=>H.blockPlay([48,51,58,62],0,[10,11,12,13])},
          {label:"▶ Cadd9", run:H=>H.blockPlay([48,52,55,62],0,[15,16,17,18])},
          {label:"▶ Compare all four", run:H=>H.playSeq([
            {si:0,midis:[48,52,58,62],indices:[0,1,2,3]},{si:0,midis:[48,52,59,62],indices:[5,6,7,8]},
            {si:0,midis:[48,51,58,62],indices:[10,11,12,13]},{si:0,midis:[48,52,55,62],indices:[15,16,17,18]}],1.15)}
        ],
        caption:"Sevenths: C9 = B♭ (dominant) · Cmaj9 = B♮ (major) · Cm9 = E♭ and B♭ (minor) · Cadd9 = no seventh.",
        question:{ q:"Which chord adds a ninth without including a seventh?",
          choices:["Cadd9","C9","Cmaj9"], answer:0,
          ok:"Correct. Cadd9 contains C–E–G–D and has no seventh. C9 contains the dominant seventh B♭.",
          no:"An added-tone symbol adds the ninth but no seventh." } }) } },
    { say:"<b>Practical Voicing:</b> The third and seventh normally define chord quality and function, while the named extension should be audible. The unaltered fifth is often omitted, while an altered fifth normally remains. The root may be omitted by a pianist or guitarist when a bass instrument supplies it. In a dominant 11th chord, the 11th must be present; because a natural 11th forms a minor ninth with the major third, the third is often omitted, producing a common 9sus4-type sonority. In a dominant 13th chord, the natural 11th is usually omitted, while the third, seventh, and thirteenth receive priority. The ninth may be included or omitted according to the voicing, style, and available instruments. \u{1F447} <b>Which chord member is often the first omitted from a large unaltered dominant voicing?</b>",
      try:{ type:"mc", choices:["The perfect fifth","The named extension","The third in every context"], answer:0,
        success:"✓ Correct. An unaltered perfect fifth is generally the first omission. In a dominant 11th the 3rd may also be omitted (it conflicts with the natural 11th), and in a dominant 13th the natural 11th is normally omitted.",
        fail:"Identify the chord member that contributes the least new information when it is an unaltered perfect fifth.",
        hint:"The unaltered perfect fifth is generally the first omission." } },
    { say:"<b>Why the 3rd Is Often Omitted from C11:</b> The complete theoretical C11 contains both the major 3rd (E) and the natural 11th (F). Those two pitches form a harsh minor ninth. Hear the full stack, isolate the E–F clash, then hear the practical voicing resolve. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"C11 functioning as V in F major",
        staves:[
          {clef:"grand",keysig:"F",time:"4/4",tempo:60,notes:[
            {p:"C3",d:"w",clef:"bass",label:"C11"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"final"}],width:240},
          {clef:"grand",keysig:"F",time:"4/4",tempo:60,notes:[
            {p:"C3",d:"w",clef:"bass",label:"C11(no 3rd)"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"F2",d:"w",clef:"bass",label:"Fmaj9"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:360}
        ],
        staveLabels:["Complete theoretical C11 — major 3rd (E) and natural 11th (F): a minor-ninth conflict","Practical resolution"],
        kb:{start:41,octaves:2.5,labels:true},
        buttons:[
          {label:"▶ Hear the complete theoretical C11", run:H=>H.playStaff(0)},
          {label:"▶ Hear the E–F clash (minor 9th)", run:H=>H.blockPlay([52,65],0,[1,5])},
          {label:"▶ Play C11 → Fmaj9", run:H=>H.playStaff(1)}
        ],
        caption:"In a practical dominant 11th voicing, the 11th must remain because it is the named extension. The major 3rd is often omitted to avoid the E–F minor-ninth clash.",
        question:{ q:"Which chord member is often omitted from an unaltered dominant 11th voicing?",
          choices:["The major 3rd","The 11th","The minor 7th"], answer:0,
          ok:"Correct. The 11th is the named extension and must remain. The 3rd is often omitted to avoid its minor-ninth conflict with the natural 11th.",
          no:"The 11th is the named extension, so it stays. Find the tone that clashes with it." } }) } },
    { say:"<b>A Practical Dominant 13th Voicing:</b> A four-note C13 can express the chord clearly with only the root, 3rd, 7th, and 13th. Play it resolving to Fmaj9. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"C13 resolving to Fmaj9  ·  C13 as V in F major",
        staff:{clef:"grand",keysig:"F",time:"4/4",tempo:60,notes:[
          {p:"C3",d:"w",clef:"bass",label:"C13"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"Bb3",d:"w",chord:true,clef:"bass",acc:"none"},{p:"A4",d:"w",chord:true},{bar:"single"},
          {p:"F2",d:"w",clef:"bass",label:"Fmaj9"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:41,octaves:2.5,labels:true},
        buttons:[
          {label:"▶ Play C13 → Fmaj9", run:H=>H.playStaff(0)}
        ],
        analysis:`<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:12px">
          <div style="background:#eaf5ea;border:1px solid #bfe0bf;border-radius:8px;padding:6px 10px"><b style="color:#2e7d32">Retained</b><br>C = root · E = 3rd · B♭ = 7th · A = 13th</div>
          <div style="background:#f6eeea;border:1px solid #e0cabf;border-radius:8px;padding:6px 10px"><b style="color:#c05a21">Omitted</b><br>G = unaltered 5th · D = 9th (optional) · F = natural 11th</div></div>`,
        question:{ q:"Which tones define this practical C13 voicing?",
          choices:["Root, 3rd, 7th, and 13th","Root and 5th only","All seven theoretical chord members"], answer:0,
          ok:"Correct. C–E–B♭–A clearly expresses C13 while omitting less essential or conflicting tones.",
          no:"The 3rd and 7th define quality; the 13th is the named extension. Together with the root, those four tones carry the chord." } }) } },
    { say:"<b>Compare G9 and G13:</b> Two practical dominant voicings that differ only in the named extension. Both keep the defining 3rd and 7th and omit the unaltered 5th. \u{1F447} <b>Answer after comparing.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"Key: C major — G is the dominant",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"G2",d:"w",clef:"bass",label:"G9"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"A4",d:"w",chord:true},{bar:"single"},
          {p:"G2",d:"w",clef:"bass",label:"G13"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:41,octaves:2.5,labels:true},
        buttons:[
          {label:"▶ Play G9", run:H=>H.blockPlay([43,53,59,69],0,[0,1,2,3])},
          {label:"▶ Play G13", run:H=>H.blockPlay([43,53,59,64],0,[5,6,7,8])},
          {label:"▶ Compare G9 and G13", run:H=>H.playSeq([{si:0,midis:[43,53,59,69],indices:[0,1,2,3]},{si:0,midis:[43,53,59,64],indices:[5,6,7,8]}],1.3)}
        ],
        analysis:`<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:12px">
          <div style="background:#eef1ff;border:1px solid #cdd5e1;border-radius:8px;padding:6px 10px"><b style="color:#2F6DA8">G9</b><br>G = root · B = 3rd · F = 7th · A = 9th</div>
          <div style="background:#f6eeea;border:1px solid #e0cabf;border-radius:8px;padding:6px 10px"><b style="color:#C05A21">G13</b><br>G = root · B = 3rd · F = 7th · E = 13th</div></div>`,
        caption:"Practical G9 and G13 voicings retain the defining 3rd and 7th and omit the unaltered 5th.",
        question:{ q:"Which pitch supplies the 13th in G13?",
          choices:["E","A","D"], answer:0,
          ok:"✓ Correct. E is a thirteenth above G, so it supplies the 13th in G13.",
          no:"Count a thirteenth above G: the simple sixth above G is E." } }) } },
    { say:"<b>Extended ii–V–I in C Major:</b> The core jazz cadence, dressed in extensions: Dm9 → G13 → Cmaj9. Play it slowly, at tempo, or one chord at a time, and follow the smooth voice leading. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_mount(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"D3",d:"w",clef:"bass",label:"Dm9"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"G2",d:"w",clef:"bass",label:"G13"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cmaj9"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"final"}],width:460},
        kb:{start:41,octaves:1.9167,labels:true},
        buttons:[
          {label:"▶ Play slowly", run:H=>H.playStaff(0,40)},
          {label:"▶ Play at normal tempo", run:H=>H.playStaff(0,84)},
          {label:"▶ Play each chord separately", run:H=>H.playSeq([
            {si:0,midis:[50,53,60,64],indices:[0,1,2,3]},{si:0,midis:[43,53,59,64],indices:[5,6,7,8]},{si:0,midis:[48,52,59,62],indices:[10,11,12,13]}],1.8,1.3)}
        ],
        analysis:`<div style="text-align:center;font-size:12px;color:#5a5f6b">Voice leading: C4 → B3 → B3 · E4 → E4 → D4 · F3 → F3 → E3</div>`,
        caption:"An extended ii–V–I progression in C major: Dm9–G13–Cmaj9.",
        question:{ q:"What is the harmonic function of G13 in this progression?",
          choices:["Dominant, resolving toward Cmaj9","Tonic","Predominant"], answer:0,
          ok:"Correct. G13 is an extended dominant chord that resolves to the tonic, Cmaj9.",
          no:"G is the fifth scale degree of C major; the chord built on it functions as the dominant." } }) } },
    { say:"<b>Compare the Colors of the Extensions:</b> Listen across the examples you have built and answer both questions. \u{1F447} <b>Use the buttons, then choose.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L108_colors(c,fb) } },
    { say:"<b>Why Extensions Conventionally Stop at 13:</b> Continuing the diatonic stack of thirds above the thirteenth produces the fifteenth, which duplicates the root two octaves higher. The seven-note tertian stack has now included every diatonic pitch class; the fifteenth repeats the root. For this reason, 9, 11, and 13 are the conventional chord-extension numbers. <b>Remember: 9 = +2 · 11 = +4 · 13 = +6, all over a dominant 7th by default.</b> \u{1F447} <b>Why is 13 the highest conventional extension number?</b>",
      try:{ type:"mc", choices:["The next stacked third produces the fifteenth, which duplicates the root","Performers cannot count above 13","The number 13 has a special rhythmic meaning"], answer:0,
        success:"✓ Correct. A complete thirteenth stack contains all seven diatonic letter names; the fifteenth repeats the root.",
        fail:"Continue the diatonic stack one third above the thirteenth.",
        hint:"In a C13 stack, A is the thirteenth and the next third is C." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which voicing provides a practical root-present C13 sonority?</b>",
      try:{ type:"mc", choices:["C–E–B♭–A: root, third, seventh, and thirteenth","All seven theoretical chord members in every performance","C and G only"], answer:0,
        success:"✓ Correct. C–E–B♭–A includes the root, the two guide tones, and the named extension. Other valid voicings may include the ninth, omit the root when a bassist supplies it, or redistribute the notes among registers.",
        fail:"Identify the root, guide tones, and named extension.",
        hint:"For this root-present dominant voicing, use C, E, B♭, and A." } }
  ],
  examples:[
    { mount:(host)=>MF_L108_review(host) }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Extended-Chord Identification (45s)",
      intro:"Identify chord extensions, symbols, and practical voicings.",
      miaIntro:"Identify the 9th, 11th, and 13th.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["9th chord","7th chord + a 3rd"],
        ["The 9th","a compound 2nd"],
        ["The 11th","a compound 4th"],
        ["The 13th","a compound 6th"],
        ["Bare number (C9)","dominant family"],
        ["First note omitted","the unaltered 5th"],
        ["Why stop at 13","the 15th repeats the root"],
        ["C9 spelled","C-E-G-B\u{266D}-D"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?"Extended chords identified!":null },
    { type:"key-climb", title:"Game 2 · Build a G13 Voicing",
      intro:"First build the complete theoretical stack G–B–D–F–A–C–E. Then play a practical G13 voicing such as G–B–F–E, or B–F–A–E when a bass instrument supplies G.",
      miaIntro:"Retain the guide tones and the thirteenth.",
      spec:{seq:[55,59,65,76],
        names:["G (root)","B (3rd)","F (7th)","E (13th)"],
        start:53, octaves:1.9167, title:"A practical G13"},
      result:(score)=>score!==null?"You compared the complete stack with a practical voicing.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Extension",
      intro:"Examine each chord symbol and voicing, then identify the named extension.",
      miaIntro:"Find the extension by its relationship to the root, not simply by the highest sounding pitch.",
      spec:{rounds:6, pool:[
        {label:"C9 (C-E-B♭-D)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"C13 (C-E-B♭-A)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{p:"A5",d:"w",chord:true}],width:150}},
        {label:"Cmaj9 (C-E-B-D)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"Plain C7", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the extensions correctly.":null },
    { type:"term-race", title:"Game 4 · Reduce and Construct",
      intro:"Reduce compound intervals and construct their corresponding chord extensions.",
      miaIntro:"9 → 2, 11 → 4, 13 → 6.",
      spec:{rounds:8, reverse:true, pool:[
        ["9 − 7","2"],["11 − 7","4"],["13 − 7","6"],
        ["C9's added note","D"],["C11's added note","F"],["C13's added note","A"],
        ["Cmaj9's 7th","B natural"],["Cm9's triad","C minor"]]},
      result:(score)=>score>=6?"You reduced and constructed the extensions correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on theoretical stacks, chord symbols, extensions, and practical voicings.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["9th","compound 2nd"],["11th","compound 4th"],["13th","compound 6th"],["Bare 9/13","dominant family"],["Omit first","the unaltered 5th"]], reverse:true}, count:6 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 },
    { type:"mc", q:"A complete ninth chord is a seventh chord plus…", choices:["another third above","a rest","a new root"], answer:0, explain:"A complete ninth chord adds another third above a seventh chord." },
    { type:"mc", q:"C9 is theoretically spelled…", choices:["C–E–G–B♭–D","C–E–G–B♮–D","C–D–E–F–G"], answer:0, explain:"C9 is theoretically spelled C–E–G–B♭–D." },
    { type:"mc", q:"The thirteenth above C is…", choices:["A","F","E"], answer:0, explain:"A is the thirteenth above C and the simple sixth above C." },
    { type:"mc", q:"Cmaj9 and C9 differ in the quality of their…", choices:["seventh (B♮ vs B♭)","root","ninth"], answer:0, explain:"Cmaj9 and C9 differ in the quality of their seventh: B♮ versus B♭." },
    { type:"truefalse", q:"An unaltered perfect fifth is often the first tone omitted from a dense extended-chord voicing.", answer:true, explain:"An altered fifth should remain when it defines the chord quality." },
    { type:"truefalse", q:"In a practical dominant 11th voicing, the 3rd is often omitted while the 11th remains.", answer:true, explain:"The natural 11th clashes with the major 3rd, so the 3rd is often dropped; the 11th is the named extension and stays." },
    { type:"truefalse", q:"A bare symbol such as C13 normally implies a dominant-seventh-quality foundation.", answer:true, explain:"Bare numbers indicate the dominant family." },
    { gen:"term-match", params:{subject:"term", pool:[["G13's 13th","E"],["Essentials","root, 3rd, 7th + extension"],["Dom 11th omits","the 3rd"],["Dom 13th omits","the natural 11th"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Extended Chord", def:"A seventh chord extended by thirds to the 9th, 11th, or 13th."},
    {term:"Default Quality", def:"A bare 9, 11, or 13 normally implies a dominant seventh."},
    {term:"Practical Voicing", def:"Keep defining tones and the named extension; omit less essential tones."},
    {term:"The 13 Ceiling", def:"The next stacked third is the 15th, which repeats the root."}
  ],
  mistakes:[],
  summary:[
    "✔ Continuing the stack of thirds produces the 9th, 11th, and 13th.",
    "✔ A bare 9, 11, or 13 normally implies a dominant-seventh foundation.",
    "✔ Complete theoretical stacks contain every intervening third; practical voicings use fewer notes.",
    "✔ The unaltered 5th is commonly the first omitted tone.",
    "✔ In a dominant 11th, the 11th remains and the 3rd is often omitted.",
    "✔ In a dominant 13th, the 3rd, 7th, and 13th receive priority, while the natural 11th is usually omitted.",
    "✔ A 15th repeats the root, so 13 is the highest conventional extension number."
  ],
  tips:[
    "Two-hand recipe: left hand root+7th, right hand 3rd+extension — instant jazz.",
    "The 9th is the friendliest extension — try Cmaj9 wherever Cmaj7 lived.",
    "Dominant 11ths usually drop the 3rd (or become sus chords) to avoid the clash.",
    "Next lesson: chords that replace or add without stacking — sus and add revisited."
  ],
  rewards:{ badge:"Skyline Stacker", icon:"\u{1F5FC}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Construct the theoretical stack, interpret the chord symbol, and select a practical voicing.",
  quiz:[
    { type:"mc", q:"Extended tertian chords continue stacking thirds beyond the…", choices:["Seventh","Root","Third only"], answer:0, explain:"Into 9-11-13 land.", hint:"Past the seventh chord." },
    { type:"mc", q:"The 9th is a compound…", choices:["2nd","3rd","5th"], answer:0, explain:"9−7=2.", hint:"Subtract 7." },
    { type:"mc", q:"The 11th is a compound…", choices:["4th","6th","2nd"], answer:0, explain:"11−7=4.", hint:"Subtract 7." },
    { type:"mc", q:"The 13th is a compound…", choices:["6th","4th","7th"], answer:0, explain:"13−7=6.", hint:"Subtract 7." },
    { type:"mc", q:"Which pitches form the complete theoretical C9 chord?", choices:["C–E–G–B♭–D","C–E–G–B♮–D","C–E–A–D"], answer:0, explain:"C7 + D.", hint:"Dominant default." },
    { type:"mc", q:"Which symbol represents a major-seventh-based ninth chord on C?", choices:["Cmaj9","C9","Cm9"], answer:0, explain:"Say maj for B♮.", hint:"Name the quality explicitly." },
    { type:"mc", q:"Which chord member is often omitted from a dense extended dominant voicing when it is unaltered?", choices:["Perfect fifth","Altered fifth","Named extension"], answer:0, explain:"An unaltered perfect fifth is the usual omission; an altered fifth should remain.", hint:"An unaltered fifth is often optional." },
    { type:"mc", q:"Identify the chord.", staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"Bb4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:160},
      choices:["C9 with the perfect fifth omitted","Cmaj7","C13"], answer:0, explain:"C, E, B♭, and D provide the root, third, minor seventh, and ninth.", hint:"The ninth need not be the highest note." },
    { type:"truefalse", q:"A complete theoretical thirteenth chord contains seven different diatonic chord members.", answer:true, explain:"Actual performance voicings normally omit one or more members.", hint:"Count them." },
    { type:"truefalse", q:"In a practical dominant 13th voicing, the natural 11th is usually omitted.", answer:true, explain:"The natural 11th clashes with the major 3rd, so it is normally left out while the 3rd, 7th, and 13th receive priority.", hint:"Priority: 3rd, 7th, 13th." },
    { type:"mc", q:"In C major, Dm9–G13–Cmaj9 elaborates which progression?", choices:["ii–V–I","Twelve-bar blues","Plagal cadence"], answer:0, explain:"An extended ii–V–I.", hint:"Count degrees: 2–5–1." },
    { type:"mc", q:"Which statement best describes practical extended-chord voicing?", choices:["Prioritize chord-defining tones and the named extension; omissions depend on chord type, instrumentation, and context","Every extended chord must contain all seven theoretical members","Every extended chord should contain only the root and fifth"], answer:0, explain:"Thirds, sevenths, alterations, and named extensions often define the chord, while roots and perfect fifths may be supplied or omitted according to context.", hint:"Chord-defining tones plus the named extension." }
  ],
  miaPerfect:"Perfect score! You accurately constructed and interpreted ninth, eleventh, and thirteenth chords.",
  miaPass:"You passed! Next, you will compare suspended and added-tone chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The stack grew past the octave — 9th, 11th, then 13th: extended chords.",
      play:()=>{[[55,59,62,65],[55,59,62,65,69],[55,59,65,69,76]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.9,.30)));} },
    learn:{ label:"extended chords",
      explain:"Stack 3rds past the 7th: 9/11/13 (compound 2/4/6). Bare numbers = dominant family. Voice the essentials; omit the unaltered 5th first (the 3rd in a dominant 11th, the natural 11th in a dominant 13th). Build, compare, and use each one in Learn by Doing.",
      hint:"Minus 7 names the color.",
      play:()=>{[55,59,65,69,76].forEach(m=>MFAudio.tone(m,.9,.05,.30));} },
    example:{ label:"the examples",
      explain:"Replay the Learn-by-Doing scores: the 9–11–13 stack, the practical C11 and C13 voicings, and the extended ii–V–I." },
    game:{ label:"the games",
      explain:"Sprint the stacks, climb a G13, name extensions on cards, then reduce compounds at speed.",
      hint:"Root-3rd-7th + color." },
    quiz:{ label:"this question",
      explain:"Subtract 7 to name the extension; check the 7th for family (B♭ = dominant, B = maj); essentials carry the sound.",
      play:()=>{[55,59,65,69].forEach(m=>MFAudio.tone(m,.9,.05,.30));} }
  }
};
