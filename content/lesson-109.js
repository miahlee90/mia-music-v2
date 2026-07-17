/* Lesson 109 — Modern Color Chords: Sus, Add, and Sixth Chords (Book 4, Unit 27 — SELF-AUTHORED)
   Practical intro to chords used in contemporary pop, gospel, worship, film,
   and modern piano music: sus2/sus4 (3rd replaced, may stay unresolved),
   add9/add2 (3rd retained), 6 / m6, and 6/9. Same-pitch/different-root pairs
   (Gsus4 vs Csus2, C6 vs Am7). Quartal harmony is NOT covered here.
   Interactive score+audio examples live INSIDE Learn by Doing.
   NOTE: edit by FULL-FILE REWRITE only. */

/* ---- shared interactive core: score(s) + playback + keyboard sync + question ---- */
function MF_L109_mount(container,fb,cfg){
  let h=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:4px">${cfg.heading}</div>`;
  const specs=cfg.staves||[cfg.staff];
  specs.forEach((s,si)=>{ if(cfg.staveLabels&&cfg.staveLabels[si]) h+=`<div style="text-align:center;font-size:11px;color:#5a5f6b;margin-top:${si?6:0}px">${cfg.staveLabels[si]}</div>`;
    h+=`<div class="l109-st${si}"></div>`; });
  if(cfg.midLabel) h+=`<div style="text-align:center;font-size:11.5px;color:#2F6DA8;font-weight:700;margin-top:2px">${cfg.midLabel}</div>`;
  h+=`<div class="l109-btns" style="text-align:center;margin-top:6px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap"></div>`;
  if(cfg.kb) h+=`<div class="l109-kb" style="margin-top:8px"></div>`;
  if(cfg.analysis) h+=`<div style="margin-top:8px">${cfg.analysis}</div>`;
  if(cfg.caption) h+=`<div style="text-align:center;font-size:11.5px;color:#5a5f6b;font-style:italic;margin-top:6px">${cfg.caption}</div>`;
  h+=`<div class="choices l109-ch" style="margin-top:10px"></div>`;
  container.innerHTML=h;
  const apis=specs.map((s,si)=>Staff.render(container.querySelector(".l109-st"+si),s));
  const kbApi=cfg.kb?Keyboard.create(container.querySelector(".l109-kb"),cfg.kb):null;
  function playStaff(si,tempo){ si=si||0; const s=specs[si], api=apis[si];
    const spec=tempo?Object.assign({},s,{tempo:tempo}):s;
    const pApi={svg:api.svg,highlight:(ix,keep)=>{ api.highlight(ix,keep);
      if(ix!=null&&kbApi){ const n=s.notes[ix]; if(n&&n.bar===undefined&&(n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p),true); } }};
    Staff.play(spec,pApi); }
  function blockPlay(midis,si,indices,dur){ si=si||0; dur=dur||1.4; const api=apis[si];
    midis.forEach(m=>MFAudio.tone(m,dur,0,0.32));
    api.highlight(null); (indices||[]).forEach(ix=>api.highlight(ix,true)); if(kbApi)midis.forEach(m=>kbApi.press(m,true));
    setTimeout(()=>api.highlight(null),(dur+0.1)*1000); }
  function playSeq(steps,gap,dur){ gap=gap||1.1; dur=dur||0.95;
    steps.forEach((st,k)=>{ const t=k*gap;
      st.midis.forEach(m=>MFAudio.tone(m,dur,t,0.32));
      setTimeout(()=>{ apis.forEach(a=>a.highlight(null)); (st.indices||[]).forEach(ix=>apis[st.si||0].highlight(ix,true)); if(kbApi)st.midis.forEach(m=>kbApi.press(m,true)); },t*1000); });
    setTimeout(()=>apis.forEach(a=>a.highlight(null)),(steps.length*gap+dur)*1000); }
  const H={playStaff,blockPlay,playSeq,apis,kbApi};
  const bwrap=container.querySelector(".l109-btns");
  cfg.buttons.forEach(bt=>{ const b=document.createElement("button"); b.className="play"; b.textContent=bt.label; b.onclick=()=>bt.run(H); bwrap.appendChild(b); });
  const ch=container.querySelector(".l109-ch");
  const q=cfg.question;
  if(q){ if(q.q){ const qd=document.createElement("div"); qd.style.cssText="font-weight:700;margin-bottom:6px"; qd.innerHTML=q.q; ch.appendChild(qd); }
    q.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{ if(i===q.answer) fb(true,q.ok); else { MFAudio.tone(40,.2,0,.3); fb(false,q.no); } };
      ch.appendChild(b); }); }
}
/* ---- final listening comparison panel (self-contained: 6 buttons + 3 questions) ---- */
function MF_L109_panel(host){
  host.innerHTML=`<div style="text-align:center;font-weight:800;color:#5a4a12;margin-bottom:8px">Choose a Modern Color</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
      <button class="play" data-k="csus2">▶ Csus2 held</button>
      <button class="play" data-k="gsus4">▶ Gsus4 → G</button>
      <button class="play" data-k="cadd9">▶ Cadd9</button>
      <button class="play" data-k="c6">▶ C6</button>
      <button class="play" data-k="c69">▶ C6/9</button>
      <button class="play" data-k="pop">▶ Pop progression</button></div>
    <div class="l109p-msg" style="min-height:16px;font-weight:700;font-size:12px;margin-top:8px;text-align:center;color:#2e7d32"></div>
    <div class="choices l109p-ch" style="margin-top:4px"></div>`;
  const play=(midis,when,dur)=>midis.forEach(m=>MFAudio.tone(m,dur||1.4,when||0,0.30));
  const seq=(chords,gap,dur)=>chords.forEach((c,i)=>play(c,i*(gap||1.0),dur||0.9));
  const B={ csus2:()=>play([48,55,60,62],0,2.6), gsus4:()=>seq([[43,50,55,60],[43,50,55,59]],1.1),
    cadd9:()=>play([48,55,60,62,64]), c6:()=>play([48,55,57,60,64]), c69:()=>play([48,55,57,62,64]),
    pop:()=>seq([[48,55,60,62,64],[43,50,55,59,62],[45,52,55,60,64],[41,48,53,55,57]],1.1) };
  host.querySelectorAll("button[data-k]").forEach(b=>b.onclick=()=>B[b.dataset.k]());
  const qs=[
    {q:"Which chord type replaces the third?",choices:["Sus2 or sus4","Add9","6"],answer:0,ok:"✓ Sus2 and sus4 replace the third with the 2nd or 4th."},
    {q:"Which chord type keeps the triad and adds a ninth?",choices:["Add9","Sus2","6"],answer:0,ok:"✓ Add9 keeps the full triad and adds the ninth."},
    {q:"Which chord contains an added sixth and ninth but no seventh?",choices:["6/9","6","Add9"],answer:0,ok:"✓ A 6/9 chord adds both the 6th and the natural 9th, with no 7th."}
  ];
  const ch=host.querySelector(".l109p-ch"), msg=host.querySelector(".l109p-msg");
  let qi=0;
  function render(){ ch.innerHTML=""; if(qi>=qs.length){ msg.textContent="✓ All three answered — nicely done."; return; }
    const q=qs[qi];
    const qd=document.createElement("div"); qd.style.cssText="font-weight:700;margin-bottom:6px"; qd.textContent=q.q; ch.appendChild(qd);
    q.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{ if(i===q.answer){ msg.style.color="#2e7d32"; msg.textContent=q.ok; qi++; render(); } else { MFAudio.tone(40,.2,0,.3); msg.style.color="#c05a21"; msg.textContent="Not quite — listen again and compare."; } };
      ch.appendChild(b); }); }
  render();
}

LESSON_CONTENT[109]={
  welcome:"Sus, add, and sixth chords are the color chords of modern pop, gospel, worship, and film music.",
  hook:{
    say:"<b>Listen to the chord C–F–G.</b> \u{1F447} <b>Which chord member is absent, preventing the chord from being classified as a major or minor triad?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:2px">Csus4: C–F–G</div>
          <div class="hk-st"></div>
          <div style="text-align:center;margin-top:6px"><button class="play hk-a">▶ Play C–F–G</button></div>
          <div class="choices hk-ch" style="display:none"><button>The third—this is Csus4</button><button>The root</button></div>`;
        Staff.render(container.querySelector(".hk-st"),{clef:"treble",time:"4/4",tempo:0,notes:[{p:"C4",d:"w",label:"Csus4"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:220});
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ [60,65,67].forEach(m=>MFAudio.tone(m,1.4,.05,.30)); setTimeout(()=>ch.style.display="",1400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Csus4 contains C–F–G. The third E is replaced by F, so the chord is neither a major nor a minor triad.");
          else fb(false,"C is present as the root. The chord member that determines major or minor quality is the third.");
        });
      } }
  },
  objectives:[
    "Build sus2 and sus4 chords by replacing the 3rd",
    "Hear sus chords resolving or remaining unresolved",
    "Distinguish sus2 from add9",
    "Compare add9 and add2 symbols",
    "Build major 6th, minor 6th, and 6/9 chords",
    "Recognize chords that share the same pitch classes but imply different roots",
    "Use modern color chords in pop, gospel, and worship progressions"
  ],
  steps:[
    { say:"<b>Suspended Chords:</b> A sus4 chord contains root, fourth, and fifth, while a sus2 chord contains root, second, and fifth. In both chords, the third is omitted and replaced. Without the third, the basic chord is not classified as major or minor. A modern sus chord may resolve to a major or minor triad, or it may remain unresolved as a stable color chord. Lead-sheet sus chords are related to classical suspensions but do not require classical preparation or resolution. (A modern sus4 is related to the classical 4–3 suspension studied in Lesson 96, but a lead-sheet sus chord may appear without preparation and may remain unresolved.) \u{1F447} <b>What prevents a basic sus2 or sus4 chord from being classified as major or minor?</b>",
      try:{ type:"mc", choices:["The third is absent","The root is absent","The chord must be performed loudly"], answer:0,
        success:"✓ Correct. Major and minor triad quality is determined by the third, which is absent from a basic suspended chord.",
        fail:"Identify the chord member that determines major or minor quality.",
        hint:"Check the third above the root." } },
    { say:"<b>Gsus4 and Csus2 — Same Pitches, Different Roots:</b> Gsus4, G–C–D, and Csus2, C–D–G, contain the same pitch classes. Their chord symbols imply different roots and harmonic interpretations. Bass, musical context, and resolution help determine the chord name. If C resolves downward to B over a G harmony, the chord functions as Gsus4. If D resolves upward to E over a C harmony, the chord functions as Csus2. \u{1F447} <b>Why can Gsus4 and Csus2 contain the same pitches but have different names?</b>",
      try:{ type:"mc", choices:["They imply different roots and harmonic functions","They use different tuning systems","One must be major and the other minor"], answer:0,
        success:"✓ Correct. The same pitch classes are named differently because the symbols imply different roots and functions.",
        fail:"The pitches are identical; the difference is interpretive.",
        hint:"Think about which pitch is heard as the root." } },
    { say:"<b>Gsus4 Resolving to G:</b> The classic guitar-and-worship gesture — the fourth leans in, then falls to the third. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Key: G major",
        staff:{clef:"grand",keysig:"G",time:"4/4",tempo:60,notes:[
          {p:"G2",d:"w",clef:"bass",label:"Gsus4"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{bar:"single"},
          {p:"G2",d:"w",clef:"bass",label:"G"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:41,octaves:1.5833,labels:true},
        buttons:[{label:"▶ Play Gsus4 → G", run:H=>H.playStaff(0)}],
        caption:"In Gsus4, C replaces the third B. C resolves downward to B, confirming G as the root.",
        question:{ q:"Which pitch resolves to create the G-major triad?",
          choices:["C moves down to B","G moves up to A","D moves down to C"], answer:0,
          ok:"✓ Correct. C, the suspended fourth, steps down to B, the third of G major.",
          no:"The suspended tone is the fourth, C. Follow it downward by step." } }) } },
    { say:"<b>Csus2 as an Unresolved Modern Color:</b> Not every sus chord needs to move. In pop and worship, Csus2 can simply glow. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:60,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Csus2"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Csus2 (held)"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:48,octaves:1.3333,labels:true},
        buttons:[{label:"▶ Play Csus2 held", run:H=>H.blockPlay([48,55,60,62],0,[0,1,2,3,5,6,7,8],2.6)}],
        caption:"In contemporary pop and worship music, Csus2 may remain unresolved as an open color chord.",
        question:{ q:"In these styles, how can Csus2 function?",
          choices:["As a stable, unresolved color chord","As a chord that must resolve at once","As a minor triad"], answer:0,
          ok:"✓ Correct. Csus2 can stand on its own as an open, unresolved color.",
          no:"Modern sus chords do not require resolution — listen to how it simply holds." } }) } },
    { say:"<b>Csus2 Resolving to C:</b> When it does move, the second rises to the third and confirms the root. Compare the resolved and unresolved versions. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:60,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Csus2"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"C"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:48,octaves:1.3333,labels:true},
        buttons:[
          {label:"▶ Play Csus2 → C", run:H=>H.playStaff(0)},
          {label:"▶ Compare resolved and unresolved Csus2", run:H=>{ H.blockPlay([48,55,60,62],0,[0,1,2,3],2.2); setTimeout(()=>H.playStaff(0),2600); }}
        ],
        caption:"When D moves upward to E, the resolution confirms C as the root.",
        question:{ q:"Which motion confirms C as the root?",
          choices:["D moves up to E","C moves down to B","G moves up to A"], answer:0,
          ok:"✓ Correct. The suspended second D rises to E, the third of C major.",
          no:"The suspended tone here is the second, D. Follow it upward by step." } }) } },
    { say:"<b>Add9 and Add2:</b> Cadd9 retains the C-major triad, C–E–G, and adds D. The third E remains. The symbol Cadd2 is sometimes used for the same pitch-class collection, especially when D is voiced close to the root. Chord-symbol conventions vary, so add2 and add9 do not always guarantee an exact register or voicing. The important distinction is that an added-tone chord retains the third, while a suspended chord replaces it. \u{1F447} <b>What distinguishes Cadd9 from Csus2?</b>",
      try:{ type:"mc", choices:["Cadd9 retains the third E, while Csus2 omits it","Cadd9 has no root","Csus2 is always minor"], answer:0,
        success:"✓ Correct. An add9 chord retains the underlying triad, while a sus2 chord replaces the third with the second.",
        fail:"Determine whether the chord contains the third E.",
        hint:"Added tone = triad retained; suspended tone = third replaced." } },
    { say:"<b>Sus Replaces; Add Retains:</b> Same two extra letters, opposite meanings. Play Csus2 and Cadd9 and listen for the third. \u{1F447} <b>Answer after comparing.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Root: C — isolated chord comparison",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Csus2"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cadd9"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"final"}],width:360},
        kb:{start:48,octaves:1.3333,labels:true},
        buttons:[
          {label:"▶ Csus2", run:H=>H.blockPlay([48,55,60,62],0,[0,1,2,3])},
          {label:"▶ Cadd9", run:H=>H.blockPlay([48,55,60,62,64],0,[5,6,7,8,9])},
          {label:"▶ Compare both", run:H=>H.playSeq([{si:0,midis:[48,55,60,62],indices:[0,1,2,3]},{si:0,midis:[48,55,60,62,64],indices:[5,6,7,8,9]}],1.4)}
        ],
        analysis:`<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:12px">
          <div style="background:#eef1ff;border:1px solid #cdd5e1;border-radius:8px;padding:6px 10px"><b style="color:#2F6DA8">Csus2</b><br>C–D–G · <i>No 3rd</i></div>
          <div style="background:#eaf5ea;border:1px solid #bfe0bf;border-radius:8px;padding:6px 10px"><b style="color:#2e7d32">Cadd9</b><br>C–E–G–D · <i>3rd retained</i></div></div>`,
        question:{ q:"Which pitch makes Cadd9 major rather than suspended?",
          choices:["E, the major third","D, the ninth","G, the fifth"], answer:0,
          ok:"✓ Correct. Restoring E, the major third, makes the chord a major triad with an added ninth.",
          no:"A suspended chord lacks the third. Find the pitch Cadd9 adds back." } }) } },
    { say:"<b>Add9 Chords in a Pop/Worship Progression:</b> Added ninths open up the sound while the everyday I–V–vi–IV progression stays perfectly recognizable. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:72,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Cadd9"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"G2",d:"w",clef:"bass",label:"G"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"A2",d:"w",clef:"bass",label:"Am7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"F2",d:"w",clef:"bass",label:"Fadd9"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{bar:"final"}],width:520},
        kb:{start:41,octaves:1.9167,labels:true},
        buttons:[
          {label:"▶ Play slowly", run:H=>H.playStaff(0,44)},
          {label:"▶ Play at normal tempo", run:H=>H.playStaff(0,88)},
          {label:"▶ Play each chord", run:H=>H.playSeq([
            {si:0,midis:[48,55,60,62,64],indices:[0,1,2,3,4]},{si:0,midis:[43,50,55,59,62],indices:[6,7,8,9,10]},
            {si:0,midis:[45,52,55,60,64],indices:[12,13,14,15,16]},{si:0,midis:[41,48,53,55,57],indices:[18,19,20,21,22]}],1.6,1.3)}
        ],
        caption:"Added ninths create open color while the basic pop progression I–V–vi–IV remains recognizable.",
        question:{ q:"Do Cadd9 and Fadd9 retain their thirds?",
          choices:["Yes. Added-tone chords retain the third.","No. Add9 always replaces the third."], answer:0,
          ok:"✓ Correct. Cadd9 keeps E and Fadd9 keeps A — added-tone chords retain the third.",
          no:"Add chords add a tone to the complete triad; they do not remove the third." } }) } },
    { say:"<b>Dsus4 Resolving to D:</b> The same lean-and-fall gesture on a different chord — a staple of guitar-based pop and worship. \u{1F447} <b>Answer after listening.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Key: G major",
        staff:{clef:"grand",keysig:"G",time:"4/4",tempo:60,notes:[
          {p:"D3",d:"w",clef:"bass",label:"Dsus4"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"single"},
          {p:"D3",d:"w",clef:"bass",label:"D"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"F#4",d:"w",chord:true,acc:"none"},{bar:"final"}],width:340},
        kb:{start:50,octaves:1.75,labels:true},
        buttons:[{label:"▶ Play Dsus4 → D", run:H=>H.playStaff(0)}],
        caption:"This sus4 resolution is common in guitar-based pop and worship music.",
        question:{ q:"Which pitch resolves to form the D-major triad?",
          choices:["G moves down to F♯","D moves up to E","A moves down to G"], answer:0,
          ok:"✓ Correct. G, the suspended fourth, steps down to F♯, the third of D major.",
          no:"The suspended tone is the fourth, G. Follow it downward by step to F♯." } }) } },
    { say:"<b>Sixth Chords:</b> A C6 chord combines a C-major triad with A, the major sixth above the root: C–E–G–A. It does not imply a seventh. Cm6 combines a C-minor triad with the major sixth A: C–E♭–G–A. Sixth chords are common as tonic-color chords in pop, gospel, jazz, film music, and traditional popular styles. \u{1F447} <b>Which pitch is added to a C-major triad to form C6?</b>",
      try:{ type:"mc", choices:["A","B♭","D"], answer:0,
        success:"✓ Correct. C6 contains C–E–G–A, with no implied seventh.",
        fail:"Identify the pitch a major sixth above C.",
        hint:"The added pitch is A." } },
    { say:"<b>The 6/9 Chord:</b> A 6/9 chord contains a major or minor triad together with an added sixth and natural ninth, but no seventh. C6/9 is spelled C–E–G–A–D. The symbol 6/9 does not mean division and does not indicate a flat ninth. It means that both the sixth and natural ninth are added to the triad. The 6/9 chord is a common tonic color in gospel, jazz, pop, and modern piano voicing. \u{1F447} <b>Which pitches are added to a C-major triad to form C6/9?</b>",
      try:{ type:"mc", choices:["A and D","B♭ and D♭","F and B"], answer:0,
        success:"✓ Correct. C6/9 adds the sixth A and the natural ninth D to C–E–G, with no seventh.",
        fail:"Add the major sixth and the natural ninth above C.",
        hint:"The added tones are A (6th) and D (9th)." } },
    { say:"<b>Compare Sixth-Chord Colors:</b> Major sixth, minor sixth, and 6/9 — three tonic colors, one root. Play each and listen for the changing tones. \u{1F447} <b>Answer after comparing.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Root: C — isolated chord comparison",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",clef:"bass",label:"C6"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"Cm6"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"Eb4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"C6/9"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"final"}],width:460},
        kb:{start:48,octaves:1.3333,labels:true},
        buttons:[
          {label:"▶ C6", run:H=>H.blockPlay([48,55,57,60,64],0,[0,1,2,3,4])},
          {label:"▶ Cm6", run:H=>H.blockPlay([48,55,57,60,63],0,[6,7,8,9,10])},
          {label:"▶ C6/9", run:H=>H.blockPlay([48,55,57,62,64],0,[12,13,14,15,16])},
          {label:"▶ Compare all three", run:H=>H.playSeq([
            {si:0,midis:[48,55,57,60,64],indices:[0,1,2,3,4]},{si:0,midis:[48,55,57,60,63],indices:[6,7,8,9,10]},{si:0,midis:[48,55,57,62,64],indices:[12,13,14,15,16]}],1.4)}
        ],
        caption:"C6 = C–E–G–A · Cm6 = C–E♭–G–A · C6/9 = C–E–G–A–D. None contains a seventh.",
        question:{ q:"Which chord contains both the added sixth A and the natural ninth D?",
          choices:["C6/9","C6","Cm6"], answer:0,
          ok:"✓ Correct. C6/9 (C–E–G–A–D) adds both the sixth A and the ninth D.",
          no:"Look for the chord that adds D (the ninth) as well as A (the sixth)." } }) } },
    { say:"<b>C6 or Am7?</b> C6, C–E–G–A, and Am7, A–C–E–G, contain the same pitch classes. They are distinguished by bass, root emphasis, harmonic context, and function. A C bass normally supports a C6 interpretation, while an A bass normally supports Am7. \u{1F447} <b>Answer after comparing.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L109_mount(c,fb,{
        heading:"Same pitch classes, different roots",
        staff:{clef:"bass",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",label:"C6"},{p:"E3",d:"w",chord:true},{p:"G3",d:"w",chord:true},{p:"A3",d:"w",chord:true},{bar:"single"},
          {p:"A2",d:"w",label:"Am7"},{p:"C3",d:"w",chord:true},{p:"E3",d:"w",chord:true},{p:"G3",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:45,octaves:1.1667,labels:true},
        buttons:[
          {label:"▶ C6 with C in the bass", run:H=>H.blockPlay([48,52,55,57],0,[0,1,2,3])},
          {label:"▶ Am7 with A in the bass", run:H=>H.blockPlay([45,48,52,55],0,[5,6,7,8])},
          {label:"▶ Compare both", run:H=>H.playSeq([{si:0,midis:[48,52,55,57],indices:[0,1,2,3]},{si:0,midis:[45,48,52,55],indices:[5,6,7,8]}],1.5)}
        ],
        caption:"The four pitch classes are identical; the bass note tips the interpretation one way or the other.",
        question:{ q:"What most strongly changes the interpretation from C6 to Am7?",
          choices:["The bass, root emphasis, and harmonic context","The two chords use completely different notes","C6 must contain a seventh"], answer:0,
          ok:"✓ Correct. Same pitch classes; the bass, root emphasis, and context decide the name.",
          no:"The notes are identical. Listen to which pitch anchors the chord in the bass." } }) } },
    { say:"<b>Review:</b> \u{1F447} <b>In a modern chord symbol, what is the main difference between sus2 and add9?</b>",
      try:{ type:"mc", choices:["Sus2 replaces the third; add9 retains the third","Sus2 always contains a seventh","Add9 is always a minor chord"], answer:0,
        success:"✓ Correct. Sus replaces the third; add keeps the triad and adds a tone.",
        fail:"Compare how each symbol treats the third.",
        hint:"One replaces the third; the other keeps it." } },
    { say:"<b>Review:</b> \u{1F447} <b>Why may Gsus4 and Csus2 contain the same pitches but have different names?</b>",
      try:{ type:"mc", choices:["They imply different roots and harmonic functions","They use different tuning systems","One must be major and the other minor"], answer:0,
        success:"✓ Correct. The identical pitch classes are named differently because the symbols imply different roots and functions.",
        fail:"The pitches are the same; the difference is interpretive.",
        hint:"Bass and context decide which pitch is the root." } }
  ],
  examples:[
    { mount:(host)=>MF_L109_panel(host) }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Suspended and Added-Tone Chords (45s)",
      intro:"Identify whether the third is retained, replaced, or joined by an added tone.",
      miaIntro:"Check the third first.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["sus4","4th replaces the 3rd"],
        ["sus2","2nd replaces the 3rd"],
        ["add9","triad + 9th, 3rd kept"],
        ["add2","same pitch classes as add9"],
        ["C6","C-E-G-A"],
        ["Sus chords","no 3rd"],
        ["6/9","6th + 9th, no 7th"],
        ["Modern sus","may stand unresolved"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Chord types identified!":null },
    { type:"key-climb", title:"Game 2 · Compare Sus4 and Add9",
      intro:"Play Csus4 → C major → Cadd9. Compare F resolving to E with D added while E remains in the final chord.",
      miaIntro:"In sus4, F replaces E; in add9, D is added beside the complete triad.",
      spec:{seq:[60,65,67, 60,64,67, 74],
        names:["C","F (the sus 4)","G","C","E (resolved!)","G","D (the added 9th)"],
        start:60, octaves:1.3333, title:"Three colors in one pass"},
      result:(score)=>score!==null?"You performed and compared the three chords.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Chord",
      intro:"Examine each pitch collection and identify the correct chord symbol.",
      miaIntro:"Check the root, third, replacement tone, and added tones.",
      spec:{rounds:6, pool:[
        {label:"Csus4 (C-F-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Csus2 (C-D-G)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"D4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}},
        {label:"Cadd9 (C-E-G-D)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}},
        {label:"C6 (C-E-G-A)", spec:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{p:"A4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the chords correctly.":null },
    { type:"term-race", title:"Game 4 · Retain, Replace, or Add",
      intro:"Classify each symbol according to its treatment of the third.",
      miaIntro:"Is the third present or replaced?",
      spec:{rounds:8, reverse:true, pool:[
        ["sus4","replaces the 3rd"],["sus2","replaces the 3rd"],
        ["add9","keeps the 3rd"],["C6","keeps the 3rd"],
        ["Dsus4","D-G-A"],["Gsus2","G-A-D"],
        ["add2","keeps the 3rd"],["Cadd9","keeps the 3rd"]]},
      result:(score)=>score>=6?"You classified the chord symbols correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on suspended, added-tone, and sixth chords.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["sus4","root-4-5"],["sus2","root-2-5"],["add9","triad + 9"],["C6","triad + 6"],["No 3rd","not major or minor"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"Csus4 is spelled…", choices:["C-F-G","C-E-G","C-D-G"], answer:0, explain:"4 replaces 3." },
    { type:"mc", q:"Csus2 is spelled…", choices:["C-D-G","C-F-G","C-E-A"], answer:0, explain:"2 replaces 3." },
    { type:"mc", q:"Cadd9 keeps its 3rd?", choices:["Yes — E stays","No","Only in minor"], answer:0, explain:"ADD removes nothing." },
    { type:"mc", q:"C6 is spelled…", choices:["C-E-G-A","C-E-G-B","C-E-A-D"], answer:0, explain:"Triad + 6th, no 7th." },
    { type:"mc", q:"C6/9 is spelled…", choices:["C-E-G-A-D","C-E-G-B♭-D","C-E-G-A-B♭"], answer:0, explain:"Triad + 6th + natural 9th, no 7th." },
    { type:"truefalse", q:"In many contemporary styles, a sus chord may remain unresolved.", answer:true, explain:"They may stand as color." },
    { type:"truefalse", q:"Cadd9 and Cadd2 may indicate the same pitch-class collection, although notation and voicing conventions vary.", answer:true, explain:"Voicing conventions vary." },
    { gen:"term-match", params:{subject:"term", pool:[["Gsus4 & Csus2","same pitches, diff roots"],["C6 & Am7","same pitches, diff bass"],["Cm6","C-E\u{266D}-G-A"],["6/9","6th + 9th, no 7th"]], reverse:true}, count:3 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 }
  ],
  vocabulary:[
    {term:"Sus2 / Sus4", def:"The 2nd or 4th replaces the 3rd."},
    {term:"Add9 / Add2", def:"The triad remains and an additional tone is added."},
    {term:"6 and m6", def:"A major or minor triad with an added major 6th."},
    {term:"6/9", def:"A triad with an added 6th and natural 9th, but no 7th."}
  ],
  mistakes:[],
  summary:[
    "✔ Sus2 and sus4 replace the 3rd with the 2nd or 4th.",
    "✔ Modern sus chords may resolve or remain unresolved.",
    "✔ Add9 and add2 retain the 3rd and add another tone.",
    "✔ Gsus4 and Csus2 may share pitch classes but imply different roots.",
    "✔ C6 and Cm6 add a major 6th without implying a 7th.",
    "✔ C6 and Am7 share pitch classes but differ in bass, root, and function.",
    "✔ A 6/9 chord adds both the 6th and natural 9th but contains no 7th.",
    "✔ Sus, add, and sixth chords are common colors in pop, gospel, worship, and modern piano music."
  ],
  tips:[
    "Guitarists' trick on keys: alternate C ↔ Csus4 ↔ C ↔ Csus2 — instant accompaniment shimmer.",
    "End a piece on C6 or C6/9 once — hear the vintage-to-gospel glow.",
    "add9 arpeggiated = the modern ballad intro; try 1-5-9-3 as a pattern.",
    "Quartal harmony (chords in stacked 4ths) is a separate system — not a kind of sus chord.",
    "Next lesson: swapping whole chords — tritone substitution and chromatic mediants."
  ],
  rewards:{ badge:"Color Mixer", icon:"\u{1F308}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Determine whether the third is retained, replaced, or accompanied by an added tone.",
  quiz:[
    { type:"mc", q:"What is the defining feature of a basic suspended chord?", choices:["The third is replaced by the second or fourth","The root is doubled","The chord contains six notes"], answer:0, explain:"By the 4th or 2nd.", hint:"Without the third, the chord is not classified as a major or minor triad." },
    { type:"mc", q:"Gsus4 is spelled…", choices:["G-C-D","G-B-D","G-A-D"], answer:0, explain:"4 replaces 3.", hint:"C in the middle." },
    { type:"mc", q:"Gsus2 is spelled…", choices:["G-A-D","G-C-D","G-B-E"], answer:0, explain:"2 replaces 3.", hint:"A in the middle." },
    { type:"mc", q:"A modern lead-sheet sus chord…", choices:["May appear without preparation and may remain unresolved","Must always be prepared and resolved","Cannot be used in pop music"], answer:0, explain:"A lead-sheet sus chord does not require classical preparation or resolution.", hint:"The modern habit." },
    { type:"mc", q:"In many popular and film-music contexts, a sus chord…", choices:["May remain unresolved","Must always resolve immediately","Is prohibited"], answer:0, explain:"Sus chords may remain unresolved in these styles.", hint:"The modern habit." },
    { type:"mc", q:"Which pitch classes belong to Cadd9?", choices:["C-D-E-G","C-D-G","C-D-F-G"], answer:0, explain:"Triad intact + 9.", hint:"E stays." },
    { type:"mc", q:"Which statement best compares Cadd2 and Cadd9?", choices:["They may indicate the same pitch-class collection, but voicing conventions vary","They always contain entirely different pitches","One must be minor"], answer:0, explain:"Voicing conventions vary.", hint:"Compare pitch classes, not register." },
    { type:"mc", q:"Which pitch is added to C–E–G to form C6?", choices:["A","B♭","F"], answer:0, explain:"The added 6th, no 7th.", hint:"A major sixth above C." },
    { type:"mc", q:"C6/9 is spelled…", choices:["C-E-G-A-D","C-E-G-B♭-D","C-E-G-A-B♭"], answer:0, explain:"Triad + 6th + natural 9th, no 7th.", hint:"Both the 6th and the natural 9th." },
    { type:"mc", q:"Identify the chord.", staff:{clef:"treble",notes:[{p:"C4",d:"w"},{p:"F4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150},
      choices:["Csus4","C major","Cadd9"], answer:0, explain:"C-F-G contains the fourth F in place of the third E.", hint:"No 3rd." },
    { type:"truefalse", q:"C6 and Am7 contain the same pitch classes but are distinguished by bass, root emphasis, and function.", answer:true, explain:"C–E–G–A and A–C–E–G share pitch classes; the bass and context decide the name.", hint:"Same notes, different root." },
    { type:"mc", q:"Which pair differs principally in whether the third E is retained?", choices:["Cadd9 and Csus2","C6 and C7","C major and C minor"], answer:0, explain:"Cadd9 contains C-D-E-G, while Csus2 contains C-D-G.", hint:"The D chords." }
  ],
  miaPerfect:"Perfect score! You accurately distinguished suspended, added-tone, and sixth chords.",
  miaPass:"You passed! Next, you will study chord substitution and chromatic reharmonization.",
  mia:{
    hook:{ label:"the welcome",
      explain:"C-F-G — the 4th in place of the 3rd: Csus4, neither major nor minor.",
      play:()=>{[60,65,67].forEach(m=>MFAudio.tone(m,1.3,.05,.30));} },
    learn:{ label:"sus, add & 6",
      explain:"sus replaces the 3rd (may stay unresolved in modern styles); add keeps it (add9/add2 share pitch classes); 6 and m6 add the 6th with no 7th; 6/9 adds the 6th and natural 9th. Same-pitch pairs (Gsus4/Csus2, C6/Am7) differ by root and bass. Build, hear, and use each one in Learn by Doing.",
      hint:"The 3rd's fate — and the bass.",
      play:()=>{[48,55,57,62,64].forEach(m=>MFAudio.tone(m,1.0,.05,.28));} },
    example:{ label:"the examples",
      explain:"Choose a modern color — Csus2, Gsus4→G, Cadd9, C6, C6/9, and the pop progression — and answer the three questions." },
    game:{ label:"the games",
      explain:"Sprint the colors, play sus-resolve-add, spot chords, then sort keep-vs-replace.",
      hint:"Look at the middle note." },
    quiz:{ label:"this question",
      explain:"One check: is the 3rd present? Present = add/6 family; absent with 4 or 2 = sus family. For same-pitch pairs, the bass decides the root.",
      play:()=>{[60,64,67,74].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
