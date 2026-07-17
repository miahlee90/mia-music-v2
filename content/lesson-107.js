/* Lesson 107 (15.7, formerly L110) — Introduction to Reharmonization: Substitution and Chromatic Color
   (Book 4, Unit 27 — SELF-AUTHORED)
   Core: put NEW chords under the SAME melody. Functional substitution keeps a
   chord's family role (tonic I/iii/vi, predominant ii/IV, dominant V7/vii°);
   reharmonization is broader and may keep OR change the function. Diatonic subs,
   tritone sub (ii-bII7-I, chromatic bass), chromatic mediants (color, not
   always function), and a b9 altered-dominant preview.
   Interactive score+audio examples live INSIDE Learn by Doing.
   NOTE: edit by FULL-FILE REWRITE only. */

/* ---- shared interactive core: score(s) + playback + keyboard sync + question ---- */
function MF_L107_mount(container,fb,cfg){
  let h=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:4px">${cfg.heading}</div>`;
  const specs=cfg.staves||[cfg.staff];
  specs.forEach((s,si)=>{ if(cfg.staveLabels&&cfg.staveLabels[si]) h+=`<div style="text-align:center;font-size:11px;color:#5a5f6b;margin-top:${si?6:0}px">${cfg.staveLabels[si]}</div>`;
    h+=`<div class="l110-st${si}"></div>`; });
  if(cfg.midLabel) h+=`<div style="text-align:center;font-size:11.5px;color:#2F6DA8;font-weight:700;margin-top:2px">${cfg.midLabel}</div>`;
  h+=`<div class="l110-btns" style="text-align:center;margin-top:6px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap"></div>`;
  if(cfg.kb) h+=`<div class="l110-kb" style="margin-top:8px"></div>`;
  if(cfg.analysis) h+=`<div style="margin-top:8px">${cfg.analysis}</div>`;
  if(cfg.caption) h+=`<div style="text-align:center;font-size:11.5px;color:#5a5f6b;font-style:italic;margin-top:6px">${cfg.caption}</div>`;
  h+=`<div class="choices l110-ch" style="margin-top:10px"></div>`;
  container.innerHTML=h;
  const apis=specs.map((s,si)=>Staff.render(container.querySelector(".l110-st"+si),s));
  const kbApi=cfg.kb?Keyboard.create(container.querySelector(".l110-kb"),cfg.kb):null;
  function playStaff(si,tempo){ si=si||0; const s=specs[si], api=apis[si];
    const spec=tempo?Object.assign({},s,{tempo:tempo}):s;
    const pApi={svg:api.svg,highlight:(ix,keep)=>{ api.highlight(ix,keep);
      if(ix!=null&&kbApi){ const n=s.notes[ix]; if(n&&n.bar===undefined&&(n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p),true); } }};
    Staff.play(spec,pApi); }
  function blockPlay(midis,si,indices,dur){ si=si||0; dur=dur||1.4; const api=apis[si];
    midis.forEach(m=>MFAudio.tone(m,dur,0,0.30));
    api.highlight(null); (indices||[]).forEach(ix=>api.highlight(ix,true)); if(kbApi)midis.forEach(m=>kbApi.press(m,true));
    setTimeout(()=>api.highlight(null),(dur+0.1)*1000); }
  function playSeq(steps,gap,dur){ gap=gap||1.1; dur=dur||0.95;
    steps.forEach((st,k)=>{ const t=k*gap;
      st.midis.forEach(m=>MFAudio.tone(m,dur,t,0.30));
      setTimeout(()=>{ apis.forEach(a=>a.highlight(null)); (st.indices||[]).forEach(ix=>apis[st.si||0].highlight(ix,true)); if(kbApi)st.midis.forEach(m=>kbApi.press(m,true)); },t*1000); });
    setTimeout(()=>apis.forEach(a=>a.highlight(null)),(steps.length*gap+dur)*1000); }
  const H={playStaff,blockPlay,playSeq,apis,kbApi};
  const bwrap=container.querySelector(".l110-btns");
  cfg.buttons.forEach(bt=>{ const b=document.createElement("button"); b.className="play"; b.textContent=bt.label; b.onclick=()=>bt.run(H); bwrap.appendChild(b); });
  const ch=container.querySelector(".l110-ch");
  const q=cfg.question;
  if(q){ if(q.q){ const qd=document.createElement("div"); qd.style.cssText="font-weight:700;margin-bottom:6px"; qd.innerHTML=q.q; ch.appendChild(qd); }
    q.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
      b.onclick=()=>{ if(i===q.answer) fb(true,q.ok); else { MFAudio.tone(40,.2,0,.3); fb(false,q.no); } };
      ch.appendChild(b); }); }
}
/* ---- compact final listening panel (self-contained buttons) ---- */
function MF_L107_panel(host){
  host.innerHTML=`<div style="text-align:center;font-weight:700;color:#5a5f6b;margin-bottom:8px">Replay the reharmonization examples</div>
    <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
      <button class="play" data-k="tonic">▶ Tonic subs (C/Em7/Am7)</button>
      <button class="play" data-k="ttoriginal">▶ ii–V–I</button>
      <button class="play" data-k="ttsub">▶ ii–♭II7–I (tritone)</button>
      <button class="play" data-k="med">▶ C–E–A♭–C</button>
      <button class="play" data-k="b9">▶ G7♭9 → C</button>
      <button class="play" data-k="after">▶ Reharmonized 4-bar</button></div>`;
  const play=(midis,when,dur)=>midis.forEach(m=>MFAudio.tone(m,dur||1.3,when||0,0.30));
  const seq=(chords,gap,dur)=>chords.forEach((c,i)=>play(c,i*(gap||1.0),dur||0.9));
  const B={ tonic:()=>seq([[48,52,55,59,64],[52,55,59,62,64],[45,48,52,55,64]],1.1),
    ttoriginal:()=>seq([[50,53,60,69],[43,59,65,71],[48,52,55,59,72]],1.1),
    ttsub:()=>seq([[50,53,60,69],[49,53,59,71],[48,52,55,59,72]],1.1),
    med:()=>seq([[48,52,55,64],[52,56,59,64],[44,48,51,63],[48,52,55,64]],1.0),
    b9:()=>seq([[43,59,62,65,68,74],[48,52,55,72]],1.2,1.2),
    after:()=>seq([[48,52,59,64],[53,57,60,65],[49,53,59,65],[48,52,59,64]],1.1) };
  host.querySelectorAll("button[data-k]").forEach(b=>b.onclick=()=>B[b.dataset.k]());
}

LESSON_CONTENT[107]={
  welcome:"Reharmonization puts new chords under the same melody — keeping or reshaping the harmonic color.",
  hook:{
    say:"Listen to two harmonizations of the same cadence. The first uses ii–V7–I. In the second, a chromatic dominant seventh replaces V7, creating a descending chromatic bass line. \u{1F447} <b>What changed?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Dm7–G7–Cmaj7</button>
          <button class="play hk-b">▶ Dm7–D♭7–Cmaj7</button></div>
          <div class="choices hk-ch" style="display:none"><button>D♭7 replaces G7, creating the bass line D–D♭–C</button><button>Both progressions use exactly the same chords</button></div>`;
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ [[50,65,69,72],[55,65,71,74],[48,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.28))); hA=true; if(hB) setTimeout(()=>ch.style.display="",3100); };
        container.querySelector(".hk-b").onclick=()=>{ [[50,65,69,72],[49,65,68,71],[48,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.28))); hB=true; if(hA) setTimeout(()=>ch.style.display="",3100); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. D♭7 replaces G7 as a tritone substitute and resolves to C. The substitution creates the chromatic root motion D–D♭–C.");
          else fb(false,"Compare the roots of the middle chord in each progression.");
        });
      } }
  },
  objectives:[
    "Define reharmonization: new chords under the same melody",
    "Sort chords into tonic, predominant, and dominant families",
    "Check that a substitute supports the melody note",
    "Substitute diatonically within a family (I↔iii↔vi, ii↔IV, V7↔vii°)",
    "Apply the tritone substitution (ii–♭II7–I) and its chromatic bass",
    "Recognize chromatic mediants as third-related color",
    "Hear a ♭9 add color to a dominant without changing its function"
  ],
  steps:[
    { say:"<b>What Reharmonization Is:</b> Reharmonization means placing different chords under the same melody. <b>Functional substitution</b> replaces a chord with another chord of similar function. <b>Reharmonization</b> is broader and may preserve or intentionally change the original harmonic function. A good choice supports the melody note and provides convincing voice leading. \u{1F447} <b>How do functional substitution and reharmonization differ?</b>",
      try:{ type:"mc", choices:["Functional substitution keeps a similar function; reharmonization may keep or intentionally change the function","They are two names for the same, identical procedure","Reharmonization always keeps every original chord"], answer:0,
        success:"✓ Correct. Functional substitution preserves function; reharmonization is broader and may reshape it.",
        fail:"One term is narrower (same function); the other is broader.",
        hint:"Which term allows the function to change on purpose?" } },
    { say:"<b>Functional Families — Tonic:</b> Chords group into families by their harmonic role. The <b>tonic family</b> in C major is I, iii, and vi — here Cmaj7, Em7, and Am7. They share tonic function and overlapping notes, so they can substitute for one another. Notice E is a chord tone in all three. \u{1F447} <b>Cmaj7, Em7, and Am7 belong to which family?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — the tonic family",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"Em7"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"A2",d:"w",clef:"bass",label:"Am7"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:460},
        kb:{start:45,octaves:1.5833,labels:true},
        midLabel:"Common tone E on top",
        buttons:[
          {label:"▶ Cmaj7", run:H=>H.blockPlay([48,52,55,59,64],0,[0,1,2,3,4])},
          {label:"▶ Em7", run:H=>H.blockPlay([52,55,59,62,64],0,[6,7,8,9,10])},
          {label:"▶ Am7", run:H=>H.blockPlay([45,48,52,55,64],0,[12,13,14,15,16])},
          {label:"▶ Compare all three", run:H=>H.playSeq([{si:0,midis:[48,52,55,59,64],indices:[0,1,2,3,4]},{si:0,midis:[52,55,59,62,64],indices:[6,7,8,9,10]},{si:0,midis:[45,48,52,55,64],indices:[12,13,14,15,16]}],1.3)}
        ],
        caption:"Cmaj7, Em7, and Am7 all carry the melody note E and share tonic function.",
        question:{ q:"Cmaj7, Em7, and Am7 belong to which functional family?",
          choices:["Tonic","Predominant","Dominant"], answer:0,
          ok:"✓ Correct. I, iii, and vi form the tonic family and can substitute for one another.",
          no:"These are I, iii, and vi in C major — the family that feels like home." } }) } },
    { say:"<b>Functional Families — Predominant:</b> The <b>predominant family</b> is ii and IV — here Dm7 and Fmaj7. They prepare the dominant and share the notes F–A–C, so one readily replaces the other. \u{1F447} <b>Dm7 and Fmaj7 belong to which family?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — the predominant family",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"D3",d:"w",clef:"bass",label:"Dm7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
          {p:"F3",d:"w",clef:"bass",label:"Fmaj7"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:50,octaves:1.75,labels:true},
        midLabel:"Shared notes F–A–C",
        buttons:[
          {label:"▶ Dm7", run:H=>H.blockPlay([50,53,57,60,69],0,[0,1,2,3,4])},
          {label:"▶ Fmaj7", run:H=>H.blockPlay([53,57,60,64,69],0,[6,7,8,9,10])},
          {label:"▶ Compare both", run:H=>H.playSeq([{si:0,midis:[50,53,57,60,69],indices:[0,1,2,3,4]},{si:0,midis:[53,57,60,64,69],indices:[6,7,8,9,10]}],1.4)}
        ],
        caption:"Dm7 (ii) and Fmaj7 (IV) share F–A–C and both prepare the dominant.",
        question:{ q:"Dm7 and Fmaj7 belong to which functional family?",
          choices:["Predominant","Tonic","Dominant"], answer:0,
          ok:"✓ Correct. ii and IV form the predominant family that leads to V.",
          no:"These chords set up the dominant — that is the predominant role." } }) } },
    { say:"<b>Functional Families — Dominant:</b> The <b>dominant family</b> is V7 and vii° — here G7 and Bdim. Bdim is simply G7 without its root, so both contain the tension-carrying tritone B–F and drive toward the tonic. \u{1F447} <b>G7 and Bdim belong to which family?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — the dominant family",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"G2",d:"w",clef:"bass",label:"G7"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"single"},
          {p:"B2",d:"w",clef:"bass",label:"Bdim"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{bar:"final"}],width:340},
        kb:{start:41,octaves:1.9167,labels:true},
        midLabel:"Shared tritone B–F",
        buttons:[
          {label:"▶ G7", run:H=>H.blockPlay([43,50,53,59,62],0,[0,1,2,3,4])},
          {label:"▶ Bdim", run:H=>H.blockPlay([47,50,53,62],0,[6,7,8,9])},
          {label:"▶ Compare both", run:H=>H.playSeq([{si:0,midis:[43,50,53,59,62],indices:[0,1,2,3,4]},{si:0,midis:[47,50,53,62],indices:[6,7,8,9]}],1.4)}
        ],
        caption:"G7 (V7) and Bdim (vii°) share the tritone B–F and pull toward C.",
        question:{ q:"G7 and Bdim belong to which functional family?",
          choices:["Dominant","Tonic","Predominant"], answer:0,
          ok:"✓ Correct. V7 and vii° form the dominant family; Bdim is a rootless G7.",
          no:"Both carry the tritone B–F that resolves to the tonic — the dominant role." } }) } },
    { say:"<b>Melody Compatibility:</b> Before substituting, check that the new chord supports the melody note. Here the single melody note <b>E</b> stays fixed while the chord underneath changes. E is a chord tone of each: the 3rd of Cmaj7, the 5th of Am7, and the 7th of Fmaj7. \u{1F447} <b>Why does the one melody note E work over all three chords?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — one melody note E, three chords",
        staff:{clef:"grand",time:"4/4",tempo:66,notes:[
          {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"A2",d:"w",clef:"bass",label:"Am7"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"F2",d:"w",clef:"bass",label:"Fmaj7"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:420},
        kb:{start:41,octaves:1.9167,labels:true},
        midLabel:"Melody E on top: 3rd of Cmaj7 · 5th of Am7 · 7th of Fmaj7",
        buttons:[
          {label:"▶ E over Cmaj7", run:H=>H.blockPlay([48,55,59,64],0,[0,1,2,3])},
          {label:"▶ E over Am7", run:H=>H.blockPlay([45,48,55,64],0,[5,6,7,8])},
          {label:"▶ E over Fmaj7", run:H=>H.blockPlay([41,48,57,64],0,[10,11,12,13])},
          {label:"▶ Compare all three", run:H=>H.playSeq([{si:0,midis:[48,55,59,64],indices:[0,1,2,3]},{si:0,midis:[45,48,55,64],indices:[5,6,7,8]},{si:0,midis:[41,48,57,64],indices:[10,11,12,13]}],1.3)}
        ],
        caption:"The same melody note E is reharmonized three ways — each chord supports it as a different chord tone.",
        question:{ q:"Why does the single melody note E work over all three chords?",
          choices:["E is a chord tone of each chord","the three chords are identical","E is the root of each chord"], answer:0,
          ok:"✓ Correct. E is the 3rd, 5th, and 7th of the three chords — always a chord tone, so the melody fits.",
          no:"Check whether E belongs to each chord; the chords are different but all contain E." } }) } },
    { say:"<b>Diatonic Substitution:</b> Staying inside the key, swap each chord for a same-family diatonic chord. Original: Cmaj7–Dm7–G7–Cmaj7 (I–ii–V–I). Reharmonized: Em7–Fmaj7–Bdim–Am7. The melody E–F–F–E is unchanged; each chord is replaced within its family. \u{1F447} <b>Compare the two versions, then answer.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — same melody, diatonic substitutes",
        staves:[
          {clef:"grand",time:"4/4",tempo:69,notes:[
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
            {p:"D3",d:"w",clef:"bass",label:"Dm7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"G2",d:"w",clef:"bass",label:"G7"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:520},
          {clef:"grand",time:"4/4",tempo:69,notes:[
            {p:"E3",d:"w",clef:"bass",label:"Em7"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{bar:"single"},
            {p:"F3",d:"w",clef:"bass",label:"Fmaj7"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"B2",d:"w",clef:"bass",label:"Bdim"},{p:"D3",d:"w",chord:true,clef:"bass"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"A2",d:"w",clef:"bass",label:"Am7"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:520}
        ],
        staveLabels:["Original: I–ii–V–I","Reharmonized: iii–IV–vii°–vi (same families)"],
        kb:{start:41,octaves:2,labels:true},
        buttons:[
          {label:"▶ Play Original", run:H=>H.playStaff(0)},
          {label:"▶ Play Reharmonized", run:H=>H.playStaff(1)}
        ],
        caption:"Melody E–F–F–E is unchanged; each chord is swapped for a same-family diatonic chord.",
        question:{ q:"How is each original chord replaced in the reharmonized version?",
          choices:["By a diatonic chord of the same function","By a random unrelated chord","By changing the melody"], answer:0,
          ok:"✓ Correct. I→iii, ii→IV, V→vii°, I→vi — each stays inside its family.",
          no:"The melody never changes; look at how each new chord relates to the one it replaces." } }) } },
    { say:"<b>Tritone Substitution:</b> A dominant seventh can be replaced by the dominant seventh a tritone away, because the two share the same tritone (their 3rd and 7th swap). Original: Dm7–G7–Cmaj7. Substitution: Dm7–D♭7–Cmaj7. G7 and D♭7 share the guide tones B and F, and the roots slide D–D♭–C. \u{1F447} <b>Compare the two, then answer.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — the tritone substitute",
        staves:[
          {clef:"grand",time:"4/4",tempo:69,notes:[
            {p:"D3",d:"w",clef:"bass",label:"Dm7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
            {p:"G2",d:"w",clef:"bass",label:"G7"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"F4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:520},
          {clef:"grand",time:"4/4",tempo:69,notes:[
            {p:"D3",d:"w",clef:"bass",label:"Dm7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
            {p:"Db3",d:"w",clef:"bass",label:"D\u{266D}7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"B4",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:520}
        ],
        staveLabels:["Original: Dm7–G7–Cmaj7  (bass D–G–C)","Substitution: Dm7–D♭7–Cmaj7  (bass D–D♭–C)"],
        kb:{start:41,octaves:2.5833,labels:true},
        buttons:[
          {label:"▶ Play Original", run:H=>H.playStaff(0)},
          {label:"▶ Play Reharmonized", run:H=>H.playStaff(1)}
        ],
        analysis:`<div style="text-align:center;font-size:12px;color:#5a5f6b">Guide tones B and F are shared by G7 and D♭7 · roots slide <b>D–D♭–C</b></div>`,
        caption:"D♭7 (♭II7) replaces G7. Same guide tones, chromatic bass, same landing on C.",
        question:{ q:"What bass line does the tritone substitute create?",
          choices:["D–D♭–C, descending chromatically","D–G–C, the original roots","the bass does not move"], answer:0,
          ok:"✓ Correct. The roots slide D–D♭–C by half step — the tritone sub's signature.",
          no:"Compare the roots of the three chords in the substituted version." } }) } },
    { say:"<b>Chromatic Mediants:</b> Chromatic mediants are same-quality triads whose roots lie a third apart and that share one common tone: C→E (shared E) and C→A♭ (shared C). Circling C–E–A♭–C splits the octave into major thirds. This is often <i>coloristic</i> reharmonization — a shift of color more than a change of function. \u{1F447} <b>What makes C→E and C→A♭ chromatic mediants?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — chromatic mediants",
        staff:{clef:"grand",time:"4/4",tempo:72,notes:[
          {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"E"},{p:"G#3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
          {p:"Ab2",d:"w",clef:"bass",label:"A\u{266D}"},{p:"C3",d:"w",chord:true,clef:"bass"},{p:"Eb3",d:"w",chord:true,clef:"bass"},{p:"Eb4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:480},
        kb:{start:41,octaves:1.9167,labels:true},
        midLabel:"C→E holds E · E→A♭ moves E→E♭ · A♭→C returns",
        buttons:[
          {label:"▶ Play C–E–A♭–C", run:H=>H.playStaff(0)},
          {label:"▶ Play each chord", run:H=>H.playSeq([{si:0,midis:[48,52,55,64],indices:[0,1,2,3]},{si:0,midis:[52,56,59,64],indices:[5,6,7,8]},{si:0,midis:[44,48,51,63],indices:[10,11,12,13]},{si:0,midis:[48,52,55,64],indices:[15,16,17,18]}],1.5,1.2)}
        ],
        caption:"C, E, and A♭ are all major triads a third apart, each pair sharing one common tone — cinematic, coloristic shifts.",
        question:{ q:"What makes C→E and C→A♭ chromatic mediants?",
          choices:["Same-quality triads a third apart sharing one common tone","They are a perfect fifth apart","They have identical notes"], answer:0,
          ok:"✓ Correct. Third-related, same quality, one shared tone — a color relationship more than a fixed function.",
          no:"Measure the distance between the roots and count the shared tone." } }) } },
    { say:"<b>Altered Dominant Preview — the ♭9:</b> A dominant can be recolored without changing its job. Adding a <b>♭9</b> to G7 gives G7(♭9): the note A♭ is added above the chord. G7 and G7(♭9) both resolve to C with the same dominant function; only the color changes. \u{1F447} <b>What does the ♭9 change?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — G7 vs G7(♭9)",
        staves:[
          {clef:"grand",time:"4/4",tempo:66,notes:[
            {p:"G2",d:"w",clef:"bass",label:"G7"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:340},
          {clef:"grand",time:"4/4",tempo:66,notes:[
            {p:"G2",d:"w",clef:"bass",label:"G7\u{266D}9"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true},{p:"D5",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"C5",d:"w",chord:true},{bar:"final"}],width:340}
        ],
        staveLabels:["G7 → C","G7(♭9) → C  (adds A♭)"],
        kb:{start:41,octaves:2.9167,labels:true},
        buttons:[
          {label:"▶ Play G7 → C", run:H=>H.playStaff(0)},
          {label:"▶ Play G7(♭9) → C", run:H=>H.playStaff(1)}
        ],
        caption:"The ♭9 (A♭) adds bite to the dominant, but G7(♭9) still functions as V and resolves to C.",
        question:{ q:"What does adding the ♭9 to G7 change?",
          choices:["The color, while the dominant function is unchanged","The chord's function to tonic","The key of the passage"], answer:0,
          ok:"✓ Correct. The ♭9 (A♭) is a color tone; the chord is still the dominant resolving to C.",
          no:"Both chords still resolve to C as the dominant — listen to what the A♭ adds." } }) } },
    { say:"<b>Before and After:</b> Put it together on a four-bar melody (E–F–F–E). The original harmony is plain: C–F–G7–C. The reharmonized version keeps the melody but enriches the chords: Cmaj7–Fmaj7–D♭7–Cmaj7, using the tritone substitute for G7. \u{1F447} <b>Compare the two versions, then answer.</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L107_mount(c,fb,{
        heading:"Key: C major — original vs reharmonized",
        staves:[
          {clef:"grand",time:"4/4",tempo:72,notes:[
            {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
            {p:"F3",d:"w",clef:"bass",label:"F"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"G2",d:"w",clef:"bass",label:"G7"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"C"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"G3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:520},
          {clef:"grand",time:"4/4",tempo:72,notes:[
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"single"},
            {p:"F3",d:"w",clef:"bass",label:"Fmaj7"},{p:"A3",d:"w",chord:true,clef:"bass"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"Db3",d:"w",clef:"bass",label:"D\u{266D}7"},{p:"F3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"F4",d:"w",chord:true},{bar:"single"},
            {p:"C3",d:"w",clef:"bass",label:"Cmaj7"},{p:"E3",d:"w",chord:true,clef:"bass"},{p:"B3",d:"w",chord:true,clef:"bass"},{p:"E4",d:"w",chord:true},{bar:"final"}],width:520}
        ],
        staveLabels:["Original harmony: C–F–G7–C","Reharmonized: Cmaj7–Fmaj7–D♭7–Cmaj7"],
        kb:{start:41,octaves:2,labels:true},
        buttons:[
          {label:"▶ Play Original", run:H=>H.playStaff(0)},
          {label:"▶ Play Reharmonized", run:H=>H.playStaff(1)}
        ],
        caption:"Same melody E–F–F–E; the reharmonization enriches the triads and swaps G7 for its tritone substitute D♭7 (bass ends D♭–C).",
        question:{ q:"Which chord replaces G7 in the reharmonized version, and why does it still work?",
          choices:["D♭7, the tritone substitute — it shares G7's guide tones and resolves to C","A totally unrelated chord that changes the key","The melody note, not a chord"], answer:0,
          ok:"✓ Correct. D♭7 shares G7's guide tones B and F and resolves to C, adding a chromatic bass approach.",
          no:"Look at the third chord of the reharmonized line and recall the tritone substitute for G7." } }) } },
    { say:"<b>Review:</b> \u{1F447} <b>How do functional substitution and reharmonization differ?</b>",
      try:{ type:"mc", choices:["Functional substitution keeps a similar function; reharmonization is broader and may keep or change it","They are identical in every case","Reharmonization must always change the melody"], answer:0,
        success:"✓ Correct. Functional substitution preserves function; reharmonization may preserve or intentionally change it.",
        fail:"One is narrower than the other.",
        hint:"Which term allows the function to change on purpose?" } },
    { say:"<b>Review:</b> \u{1F447} <b>What is the correctly spelled tritone substitute for G7 resolving to C, and what bass line does it create?</b>",
      try:{ type:"mc", choices:["D♭7, giving the bass D–D♭–C","F7, giving the bass D–F–C","B7, giving the bass D–B–C"], answer:0,
        success:"✓ Correct. D♭7 shares G7's guide tones B–F and slides the bass D–D♭–C into the tonic.",
        fail:"The substitute's root lies a tritone from G, a half step above the tonic C.",
        hint:"Its root is D♭." } }
  ],
  examples:[
    { mount:(host)=>MF_L107_panel(host) }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Substitution and Reharmonization (45s)",
      intro:"Identify functional families, tritone substitutes, and chromatic mediant relationships.",
      miaIntro:"Check family, guide tones, and voice leading.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Tonic family","I, iii, vi"],
        ["Predominant family","ii, IV"],
        ["Dominant family","V7, vii\u{00B0}"],
        ["Tritone sub","\u{266D}II7 replaces V7"],
        ["Sub for G7","D\u{266D}7"],
        ["The sub's bass line","2 - \u{266D}2 - 1 chromatic"],
        ["Chromatic mediant","3rd apart, same quality, one shared tone"],
        ["G7(\u{266D}9)","same function, added color"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Substitutions identified!":null },
    { type:"key-climb", title:"Game 2 · Perform the Tritone-Sub Progression",
      intro:"Play the complete progression Dm7–D♭7–Cmaj7. Then isolate the roots D–D♭–C and listen to the chromatic descent.",
      miaIntro:"Follow the guide tones and descending roots.",
      spec:{seq:[50,49,48],
        chords:[[50,53,57,60],[49,53,56,59],[48,52,55,59]],
        names:["Dm7 (ii)","D♭7 (the tritone sub!)","Cmaj7 (home)"],
        start:48, octaves:1, title:"ii - \u{266D}II7 - I bass"},
      result:(score)=>score!==null?"You performed the tritone-substitution progression.":null },
    { type:"symbol-hunt", title:"Game 3 · Original or Substitute?",
      intro:"Examine each approach to tonic and identify the original dominant or its tritone substitute.",
      miaIntro:"Check the root, chord quality, spelling, and resolution.",
      spec:{rounds:6, pool:[
        {label:"V7 (G7)", spec:{clef:"treble",notes:[{p:"G3",d:"w"},{p:"B3",d:"w",chord:true},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}},
        {label:"Tritone sub (D♭7)", spec:{clef:"treble",notes:[{p:"Db4",d:"w"},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"Chromatic mediant of C (E major)", spec:{clef:"treble",notes:[{p:"E4",d:"w"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true}],width:150}},
        {label:"Tonic sub (Am7)", spec:{clef:"treble",notes:[{p:"A3",d:"w"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You identified the substitute dominants correctly.":null },
    { type:"term-race", title:"Game 4 · Find the Tritone Substitute",
      intro:"Identify and correctly spell the tritone substitute for each dominant seventh chord.",
      miaIntro:"Find the tritone-related root and check its expected resolution.",
      spec:{rounds:8, reverse:true, pool:[
        ["G7's sub","D\u{266D}7"],["C7's sub","G\u{266D}7"],["D7's sub","A\u{266D}7"],["F7's sub","B7"],
        ["A7's sub","E\u{266D}7"],["E7's sub","B\u{266D}7"],
        ["Shared between subs","the tritone (3rd/7th swapped)"],
        ["C's chromatic mediants","E and A\u{266D} majors"]]},
      result:(score)=>score>=6?"You identified the tritone substitutes correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on functional families, diatonic and tritone substitution, chromatic mediants, and voice leading.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Tonic family","I, iii, vi"],["Predominant family","ii, IV"],["Dominant family","V7, vii\u{00B0}"],["Tritone sub","\u{266D}II7 for V7"],["Bass line","2-\u{266D}2-1"]], reverse:true}, count:6 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 },
    { type:"mc", q:"Reharmonization means…", choices:["Placing new chords under the same melody","Changing only the melody","Playing louder"], answer:0, explain:"Same melody, new chords; function may stay or change." },
    { type:"mc", q:"Which chords form the tonic family in C major?", choices:["I, iii, vi (Cmaj7, Em7, Am7)","ii, IV","V7, vii°"], answer:0, explain:"Tonic-function chords." },
    { type:"mc", q:"What is the tritone substitute for G7 when resolving to C?", choices:["D♭7","C7","B7"], answer:0, explain:"A tritone from G, resolving to C." },
    { type:"mc", q:"What root line does Dm7–D♭7–Cmaj7 produce?", choices:["D–D♭–C","D–G–C","C–F–G"], answer:0, explain:"Descending chromatic roots." },
    { type:"truefalse", q:"Before substituting, a good chord should support the melody note.", answer:true, explain:"Melody compatibility matters." },
    { type:"truefalse", q:"C major and E major form a chromatic mediant relationship.", answer:true, explain:"Same quality, a 3rd apart, sharing E." },
    { type:"truefalse", q:"Adding a ♭9 to G7 keeps its dominant function while adding color.", answer:true, explain:"Same function, new color." },
    { gen:"term-match", params:{subject:"term", pool:[["C7's sub","G\u{266D}7"],["A7's sub","E\u{266D}7"],["C \u{2192} A\u{266D}","mediant (shares C)"],["C \u{2192} E","mediant (shares E)"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Reharmonization", def:"New chords under the same melody; the function may stay or change."},
    {term:"Functional Families", def:"Tonic (I, iii, vi), predominant (ii, IV), dominant (V7, vii°)."},
    {term:"Tritone Substitution", def:"♭II7 replaces V7 — the two dominants share their tritone."},
    {term:"Chromatic Mediant", def:"A third-related chord of the same quality, sharing one tone."}
  ],
  mistakes:[],
  summary:[
    "✔ Reharmonization puts new chords under the same melody; it may keep or change the function.",
    "✔ Functional substitution swaps in a chord of similar function.",
    "✔ Families: Tonic <b>I·iii·vi</b> · Predominant <b>ii·IV</b> · Dominant <b>V7·vii°</b>.",
    "✔ A substitute must support the melody note.",
    "✔ Tritone sub: <b>♭II7</b> replaces V7 (shared tritone); bass walks <b>2–♭2–1</b>.",
    "✔ Chromatic mediants are third-related, same-quality chords sharing one tone — often coloristic, not functional.",
    "✔ A <b>♭9</b> adds color to a dominant while keeping its dominant function."
  ],
  tips:[
    "Reharmonize by family first: try iii or vi where I sat, IV where ii sat.",
    "Find any tritone sub instantly: the root a half step above the target tonic.",
    "Hold the shared tone in the melody while the chords leap — chromatic mediants never lose the ear.",
    "This completes Music Theory 1 — from a single note to full reharmonization."
  ],
  rewards:{ badge:"Harmonic Alchemist", icon:"\u{1F98E}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Sort chords into families, choose supportive substitutes, and analyze tritone subs and chromatic mediants.",
  quiz:[
    { type:"mc", q:"Reharmonization means placing…", choices:["New chords under the same melody","A new melody over the same chords","Only louder chords"], answer:0, explain:"Same melody, new chords.", hint:"Under the melody." },
    { type:"mc", q:"How do functional substitution and reharmonization differ?", choices:["Substitution keeps a similar function; reharmonization may keep or change it","They are identical","Neither uses voice leading"], answer:0, explain:"Reharmonization is broader.", hint:"One is narrower." },
    { type:"mc", q:"The tonic family in C major is…", choices:["I, iii, vi","ii, IV","V7, vii°"], answer:0, explain:"Cmaj7, Em7, Am7.", hint:"Home chords." },
    { type:"mc", q:"The predominant family is…", choices:["ii and IV","I and vi","V7 and vii°"], answer:0, explain:"Dm7 and Fmaj7.", hint:"They set up V." },
    { type:"mc", q:"Before substituting a chord, you should check that it…", choices:["Supports the melody note","Is louder than the original","Uses a new time signature"], answer:0, explain:"Melody compatibility.", hint:"Does the melody note fit?" },
    { type:"mc", q:"What is the tritone substitute for G7 resolving to C?", choices:["D♭7","C7","B7"], answer:0, explain:"A tritone from G.", hint:"Half step above the tonic." },
    { type:"mc", q:"What do G7 and D♭7 share?", choices:["Enharmonically equivalent guide tones (their 3rd and 7th)","Their roots","Their fifths"], answer:0, explain:"B–F equals C♭–F enharmonically.", hint:"The tritone." },
    { type:"mc", q:"What root motion does Dm7–D♭7–Cmaj7 produce?", choices:["D–D♭–C","D–G–C","D–E–F"], answer:0, explain:"Descending chromatic roots.", hint:"Half steps." },
    { type:"mc", q:"Under this lesson's definition, a chromatic mediant relationship involves…", choices:["Same-quality triads a third apart sharing one common tone","Roots a fifth apart","Identical roots"], answer:0, explain:"C→E, C→A♭.", hint:"The hinge tone." },
    { type:"truefalse", q:"A chromatic mediant is often a coloristic shift rather than a fixed harmonic function.", answer:true, explain:"Its function depends on context; the effect is largely color.", hint:"Color over function." },
    { type:"truefalse", q:"Adding a ♭9 to a dominant seventh changes its harmonic function to tonic.", answer:false, explain:"The ♭9 adds color; the chord stays a dominant.", hint:"Same function, new color." },
    { type:"mc", q:"Which statement correctly distinguishes the two concepts?", choices:["Functional substitution replaces a chord with one of similar function; reharmonization is broader and may preserve or change the function","Both mean exactly the same procedure","Neither involves the melody"], answer:0, explain:"One is narrower than the other.", hint:"Which allows the function to change?" }
  ],
  miaPerfect:"Perfect score! You reharmonized by family, applied the tritone substitute, and analyzed chromatic mediants and the ♭9.",
  miaPass:"You passed and completed Lesson 110. You can now identify and apply the principal harmonic, melodic, rhythmic, and formal concepts in Music Theory 1.",
  mia:{
    hook:{ label:"the welcome",
      explain:"D♭7 replaced G7 — the tritone substitution: same tritone engine, chromatic bass slide.",
      play:()=>{[[50,65,69,72],[49,65,68,71],[48,64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.28)));} },
    learn:{ label:"reharmonization",
      explain:"New chords under the same melody. Substitute by family (Tonic I/iii/vi, Predominant ii/IV, Dominant V7/vii°) after checking the melody note. Tritone sub: ♭II7 for V7, bass 2-♭2-1. Chromatic mediants: 3rd-related color. A ♭9 recolors a dominant without changing its function.",
      hint:"Function first, then color.",
      play:()=>{[49,53,56,59].forEach(m=>MFAudio.tone(m,.9,.05,.28));[48,64,67].forEach(m=>MFAudio.tone(m,1.0,1.0,.28));} },
    example:{ label:"the examples",
      explain:"Replay the tonic subs, the ii–V–I vs tritone-sub cadence, the C–E–A♭–C mediants, the ♭9, and the reharmonized four-bar phrase." },
    game:{ label:"the games",
      explain:"Sprint the families and subs, slide the bass, spot subs on cards, then find every dominant's twin.",
      hint:"Family first, then the tritone." },
    quiz:{ label:"this question",
      explain:"Sort by family, check the melody note, and for a dominant find the root a tritone away (shared 3rd/7th).",
      play:()=>{[49,65,68,71].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
