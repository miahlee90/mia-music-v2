/* Lesson 104 (15.4, formerly L107) — Modal Mixture and Borrowed Chords (Book 4, Unit 26 — SELF-AUTHORED)
   Core: PARALLEL keys (C major / C minor) share a tonic; MODAL MIXTURE
   borrows pitches/chords from the parallel mode (color, not modulation);
   the Picardy third ends a minor section on a major tonic.
   Interactive score+audio examples live INSIDE Learn by Doing.
   NOTE: edit by FULL-FILE REWRITE only. */

/* interactive: heading + staff + play (score & keyboard highlight in sync) + keyboard + a question */
function MF_L104_prog(container,fb,cfg){
  container.innerHTML=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:2px">${cfg.heading}</div>
    <div class="l107-st"></div>
    <div style="text-align:center;margin-top:6px"><button class="play l107-pl">${cfg.playLabel}</button></div>
    <div class="l107-kb" style="margin-top:8px"></div>
    <div class="choices l107-ch" style="margin-top:10px"></div>`;
  const api=Staff.render(container.querySelector(".l107-st"),cfg.staff);
  let kbApi=null;
  if(cfg.kb) kbApi=Keyboard.create(container.querySelector(".l107-kb"),cfg.kb);
  const pApi=kbApi?{svg:api.svg,highlight:(ix,keep)=>{ api.highlight(ix,keep);
    if(ix!=null){ const n=cfg.staff.notes[ix]; if(n&&n.rest===undefined&&n.bar===undefined&&(n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p),true); } }}:api;
  container.querySelector(".l107-pl").onclick=()=>Staff.play(cfg.staff,pApi);
  const ch=container.querySelector(".l107-ch");
  cfg.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
    b.onclick=()=>{ if(i===cfg.answer) fb(true,cfg.ok); else { MFAudio.tone(40,.2); fb(false,cfg.no); } };
    ch.appendChild(b); });
}
/* interactive comparison: two small staves, two play buttons, one question */
function MF_L104_compare(container,fb,cfg){
  container.innerHTML=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:4px">${cfg.heading}</div>
    <div style="display:flex;flex-direction:column;gap:12px;align-items:center">
      <div style="text-align:center"><div class="l107-sa"></div><button class="play l107-pa" style="margin-top:4px">${cfg.labelA}</button></div>
      <div style="text-align:center"><div class="l107-sb"></div><button class="play l107-pb" style="margin-top:4px">${cfg.labelB}</button></div>
    </div>
    <div class="choices l107-ch" style="margin-top:10px"></div>`;
  const aA=Staff.render(container.querySelector(".l107-sa"),cfg.staffA);
  const aB=Staff.render(container.querySelector(".l107-sb"),cfg.staffB);
  container.querySelector(".l107-pa").onclick=()=>Staff.play(cfg.staffA,aA);
  container.querySelector(".l107-pb").onclick=()=>Staff.play(cfg.staffB,aB);
  const ch=container.querySelector(".l107-ch");
  cfg.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
    b.onclick=()=>{ if(i===cfg.answer) fb(true,cfg.ok); else { MFAudio.tone(40,.2); fb(false,cfg.no); } };
    ch.appendChild(b); });
}
/* final listening panel: three buttons + one self-contained question */
function MF_L104_panel(host){
  host.innerHTML=`<div style="text-align:center">
    <div style="font-weight:800;color:#5a4a12;margin-bottom:8px">Compare the three borrowed progressions</div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <button class="play" id="l107a">▶ IV–iv–I</button>
      <button class="play" id="l107b">▶ ♭VI–♭VII–I</button>
      <button class="play" id="l107c">▶ Picardy ending</button></div>
    <div class="big-q" style="margin-top:12px;font-weight:700">Which example begins in a minor key and ends on a borrowed major tonic?</div>
    <div class="choices" id="l107pch" style="margin-top:6px"><button>The Picardy ending</button><button>IV–iv–I</button><button>♭VI–♭VII–I</button></div>
    <div id="l107pfb" style="margin-top:8px;font-weight:700;min-height:20px"></div></div>`;
  const seq=(arr,g)=>{ let t=0; g=g||.9; arr.forEach(row=>{ row.forEach(m=>MFAudio.tone(m,g*.9,t,.27)); t+=g; }); };
  host.querySelector("#l107a").onclick=()=>seq([[53,60,65,69],[53,60,65,68],[48,60,64,67]]);
  host.querySelector("#l107b").onclick=()=>seq([[56,60,63],[58,62,65],[60,64,67]]);
  host.querySelector("#l107c").onclick=()=>{ let t=0,g=.55;      // Scarborough Fair — last three bars, Picardy
    [68,66,68].forEach(m=>{ MFAudio.tone(m,.8,t,.45); t+=g; });   // G#4 F#4 G#4
    [61,64,69].forEach(m=>MFAudio.tone(m,.8,t,.9)); t+=1.0;       // A major (C#-E-A)
    [61,64,69].forEach(m=>MFAudio.tone(m,.8,t,1.5)); };           // A major, held to close
  const fbd=host.querySelector("#l107pfb");
  [...host.querySelectorAll("#l107pch button")].forEach((b,i)=>b.onclick=()=>{
    if(i===0){ fbd.textContent="✓ Correct. The Picardy ending starts in A minor and closes on a major A tonic."; fbd.style.color="#2e7d32"; }
    else{ MFAudio.tone(40,.2); fbd.textContent="Not quite — which one begins minor and ends major?"; fbd.style.color="#c05a21"; }
  });
}

LESSON_CONTENT[104]={
  welcome:"Modal mixture introduces pitches and chords from the parallel mode.",
  hook:{
    say:"A phrase in C major includes an F minor chord drawn from the parallel minor mode before returning to C major. \u{1F447} <b>Which chord demonstrates modal mixture?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play IV–iv–I in C major</button></div>
          <div class="choices hk-ch" style="display:none"><button>F minor, iv — drawn from the parallel minor mode</button><button>C major, I — the diatonic tonic chord</button><button>The passage permanently modulates to C minor</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ [[65,69,72],[65,68,72],[64,67,72]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.85,i*.9,.27))); setTimeout(()=>ch.style.display="",3*900+300); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. F minor is borrowed from the parallel key, C minor. The tonic remains C, so this is modal mixture rather than modulation.");
          else fb(false,"Listen for A♭, the pitch that changes the diatonic F-major triad into F minor.");
        });
      } }
  },
  objectives:[
    "Define parallel keys: the same tonic in different modes",
    "Define modal mixture: borrowing pitches or chords from the parallel mode",
    "Recognize common borrowed chords in major",
    "Hear the change of harmonic color produced by mixture",
    "Distinguish modal mixture from tonicization and modulation",
    "Recognize the Picardy third in a minor-key ending",
    "Read chromatic accidentals associated with borrowed chords"
  ],
  steps:[
    { say:"<b>Parallel and Relative Keys:</b> Parallel keys share the same tonic but use different modes and key signatures. C major and C minor are parallel keys. Relative major and minor keys share a key signature but have different tonics; C major and A minor are relative keys. Modal mixture draws pitches or chords from the parallel mode. \u{1F447} <b>What is the parallel minor of C major?</b>",
      try:{ type:"mc", choices:["C minor — the same tonic in a different mode","A minor — the relative minor","G minor"], answer:0,
        success:"✓ Correct. C major and C minor share the tonic C but use different modal collections.",
        fail:"Identify the minor key that shares the tonic C.",
        hint:"Parallel keys share a tonic; relative keys share a key signature." } },
    { say:"<b>Modal Mixture:</b> Modal mixture occurs when music in a major or minor key uses pitches or chords associated with its parallel mode. Major-key passages frequently use chords from the parallel minor, while minor-key passages may use chords or scale degrees associated with the parallel major. Modal mixture changes the harmonic color but does not by itself establish a new tonic. \u{1F447} <b>Modal mixture draws material from…</b>",
      try:{ type:"mc", choices:["The parallel mode","The dominant key by definition","A key with an unrelated tonic by definition"], answer:0,
        success:"✓ Correct. Modal mixture combines material from parallel major and minor modes, which share the same tonic.",
        fail:"Identify the mode that shares the current tonic.",
        hint:"Parallel modes share the same tonic pitch." } },
    { say:"<b>Common Mixture Chords in Major:</b> A passage in C major may draw chords from the parallel minor collection. These chords commonly introduce scale degrees <b>♭3, ♭6, and ♭7</b>; their function must be determined from context. \u{1F447} <b>How is ♭VI spelled in C major?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:320px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Borrowed chord</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Pitches in C major</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 10px">Imported pitch or pitches</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">iv</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">F\u{2013}A\u{266D}\u{2013}C</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">ii\u{00B0}</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">D\u{2013}F\u{2013}A\u{266D}</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">ii\u{00F8}7</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">D\u{2013}F\u{2013}A\u{266D}\u{2013}C</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">\u{266D}III</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">E\u{266D}\u{2013}G\u{2013}B\u{266D}</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}3, \u{266D}7</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">\u{266D}VI</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">A\u{266D}\u{2013}C\u{2013}E\u{266D}</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}6, \u{266D}3</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center;font-weight:800;color:#C05A21">\u{266D}VII</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">B\u{266D}\u{2013}D\u{2013}F</td><td style="border:1.5px solid #cdd5e1;padding:4px 10px;text-align:center">\u{266D}7</td></tr></table>` },
      try:{ type:"mc", choices:["A♭–C–E♭","A–C–E","A♭–C♭–E♭"], answer:0,
        success:"✓ Correct. A♭–C–E♭ is an A♭ major triad rooted on scale degree ♭6.",
        fail:"Lower scale degree 6 from A to A♭ and build a major triad.",
        hint:"♭VI in C major is A♭ major." } },
    { say:"<b>Borrowed Chords in a Progression:</b> In C major, ♭VI and ♭VII may rise by whole step to the tonic. This borrowed-chord progression is common in rock, film, and game music, where it is sometimes informally called the \u{201C}Mario cadence.\u{201D} \u{1F447} <b>From which parallel mode are ♭VI and ♭VII borrowed in C major?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L104_prog(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:96,notes:[
          {p:"Ab3",d:"w",clef:"bass",label:"\u{266D}VI"},{p:"C4",d:"w",chord:true},{p:"Eb4",d:"w",chord:true},{bar:"single"},
          {p:"Bb3",d:"w",clef:"bass",label:"\u{266D}VII"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{bar:"single"},
          {p:"C4",d:"w",clef:"bass",label:"I"},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
        kb:{start:53,octaves:1.5,labels:true},
        playLabel:"▶ Play \u{266D}VI → \u{266D}VII → I",
        choices:["C minor","G major","A minor"], answer:0,
        ok:"✓ Correct. A♭ major and B♭ major are associated with C minor but are used here while C remains the tonic.",
        no:"Both borrowed chords come from the parallel mode of C major." }) } },
    { say:"<b>Modal Mixture and Tonal Center:</b> Modal mixture changes the available pitch and chord collection while the prevailing tonic remains in control. IV–iv–I in major is a common example: the diatonic IV moves to a borrowed minor iv before resolving to I. At a phrase ending, iv–I may produce minor plagal motion. \u{1F447} <b>Which statement best describes modal mixture?</b>",
      try:{ type:"mc", choices:["It introduces material from the parallel mode without necessarily establishing a new tonic","It must permanently change the tonic","It changes the meter"], answer:0,
        success:"✓ Correct. A borrowed chord can alter the harmonic collection while the prevailing tonic remains active.",
        fail:"Determine whether another tonic receives structural confirmation.",
        hint:"Identify the tonal center before and after the mixture chord." } },
    { say:"<b>Minor Plagal Motion in C Major:</b> In IV–iv–I, one pitch changes chromatically: A descends to A♭ and then to G. The borrowed iv adds modal color while C remains the tonic. This progression is sometimes informally called the \u{201C}sad plagal.\u{201D} \u{1F447} <b>Which chromatic pitch changes IV into the borrowed minor iv?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L104_prog(c,fb,{
        heading:"Key: C major",
        staff:{clef:"grand",time:"4/4",tempo:96,notes:[
          {p:"F3",d:"w",clef:"bass",label:"IV"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"A4",d:"w",chord:true},{bar:"single"},
          {p:"F3",d:"w",clef:"bass",label:"iv"},{p:"C4",d:"w",chord:true},{p:"F4",d:"w",chord:true},{p:"Ab4",d:"w",chord:true},{bar:"single"},
          {p:"C3",d:"w",clef:"bass",label:"I"},{p:"C4",d:"w",chord:true},{p:"E4",d:"w",chord:true},{p:"G4",d:"w",chord:true},{bar:"final"}],width:560},
        kb:{start:48,octaves:1.9167,labels:true},
        playLabel:"▶ Play IV → iv → I",
        choices:["A♭","A♯","E♭"], answer:0,
        ok:"✓ Correct. Lowering A to A♭ changes F major into F minor, the borrowed iv chord in C major.",
        no:"Follow the inner voice A → A♭ → G — the lowered pitch makes IV minor." }) } },
    { say:"<b>The Picardy Third:</b> A Picardy third occurs when a composition or substantial section in a minor key ends with a major tonic triad. The third of the tonic chord is raised by half step, changing i to I at the final cadence. The Picardy third is often discussed alongside modal mixture, although it may also be understood as a conventional alteration of the final tonic chord. Mixture in minor is not limited to the Picardy third; minor-key passages may also use chords or pitches associated with the parallel major. \u{1F447} <b>What is a Picardy third?</b>",
      try:{ type:"mc", choices:["A raised third that creates a major tonic at the end of a minor-key composition or section","A minor iv chord in a major key","A melodic ornament"], answer:0,
        success:"✓ Correct. Raising the tonic triad's third changes the final chord from minor to major.",
        fail:"Compare the final tonic triad with the parallel major tonic.",
        hint:"The final i chord becomes I." } },
    { say:"<b>Hear the Picardy Third:</b> The folk tune <i>Scarborough Fair</i> ends in A minor. Compare an ordinary minor ending with a Picardy ending — only the third of the final tonic chord changes, C♮ rising to C♯. \u{1F447} <b>What changes in the Picardy ending?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L104_compare(c,fb,{
        heading:"Scarborough Fair (A minor) — final chord: A minor vs A major",
        staffA:{clef:"treble",time:"3/4",tempo:100,notes:[
          {p:"C5",d:"q."},{p:"B4",d:"8"},{p:"A4",d:"q"},{bar:"single"},
          {p:"G#4",d:"q"},{p:"F#4",d:"q"},{p:"G#4",d:"q"},{bar:"single"},
          {p:"C4",d:"h.",label:"i"},{p:"E4",d:"h.",chord:true},{p:"A4",d:"h.",chord:true},{bar:"single"},
          {p:"C4",d:"h."},{p:"E4",d:"h.",chord:true},{p:"A4",d:"h.",chord:true},{bar:"final"}],width:580},
        staffB:{clef:"treble",time:"3/4",tempo:100,notes:[
          {p:"C5",d:"q."},{p:"B4",d:"8"},{p:"A4",d:"q"},{bar:"single"},
          {p:"G#4",d:"q"},{p:"F#4",d:"q"},{p:"G#4",d:"q"},{bar:"single"},
          {p:"C#4",d:"h.",label:"I"},{p:"E4",d:"h.",chord:true},{p:"A4",d:"h.",chord:true},{bar:"single"},
          {p:"C#4",d:"h."},{p:"E4",d:"h.",chord:true},{p:"A4",d:"h.",chord:true},{bar:"final"}],width:580},
        labelA:"▶ Play the minor ending (…A minor)", labelB:"▶ Play the Picardy ending (…A major)",
        choices:["The final tonic chord's third rises from C♮ to C♯","The tonic changes from A to E","The meter changes"], answer:0,
        ok:"✓ Correct. Raising C♮ to C♯ changes the final A-minor tonic into A major — the Picardy third.",
        no:"Listen to the last chord of each: only its third differs (C♮ vs C♯)." }) } },
    { say:"<b>Identifying Modal Mixture:</b> First, identify the prevailing tonic and mode. Next, spell the chromatic chord and determine whether its pitches correspond to a chord associated with the parallel mode. Finally, analyze its function and decide whether the surrounding passage continues to support the original tonic. One altered pitch by itself is not sufficient evidence of modulation. If the original tonic remains primary and no new tonic is established, analyze the chromatic chord as modal mixture; a confirmed new tonic, supported by harmonic preparation and continuation, may indicate tonicization or modulation. \u{1F447} <b>In C major, an F–A♭–C chord functions as iv and resolves to C major without establishing another tonic. How should it be analyzed?</b>",
      try:{ type:"mc", choices:["Modal mixture from the parallel minor","Modulation to A♭ major","A notation error"], answer:0,
        success:"✓ Correct. F minor is iv in the parallel minor mode and functions here within C major.",
        fail:"Identify the chord and determine whether another tonic is structurally established.",
        hint:"F–A♭–C is iv in C minor." } },
    { say:"<b>Review:</b> \u{1F447} <b>In C major, how is IV–iv–I best described?</b>",
      try:{ type:"mc", choices:["A mixture progression using minor iv before tonic","A descending-fifths progression","A half cadence"], answer:0,
        success:"✓ Correct. The minor iv is drawn from the parallel minor and resolves to I. At a phrase ending, the iv–I motion may form minor plagal motion.",
        fail:"Identify the chord containing A♭.",
        hint:"F minor is iv in C minor." } }
  ],
  examples:[
    { mount:(host)=>MF_L104_panel(host) }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Modal-Mixture Identification",
      intro:"Identify parallel modes and common borrowed-chord spellings.",
      miaIntro:"Same tonic, parallel mode.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Parallel keys","same tonic, different mode"],
        ["Modal mixture","borrowing from the parallel mode"],
        ["iv in C major","F-A\u{266D}-C (borrowed)"],
        ["\u{266D}VI in C major","A\u{266D}-C-E\u{266D}"],
        ["\u{266D}VII in C major","B\u{266D}-D-F"],
        ["The imported notes","\u{266D}6, \u{266D}3, \u{266D}7"],
        ["Picardy third","minor ending on major I"],
        ["Mixture vs modulation","color change vs new tonic"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — modal-mixture chords identified!":null },
    { type:"key-climb", title:"Game 2 · Perform the Minor Plagal Progression",
      intro:"Play the complete progression F major → F minor → C major. Listen to the inner line A–A♭–G.",
      miaIntro:"Follow the chromatic inner voice A–A♭–G.",
      spec:{seq:[65,69,72,65,68,72,60,64,67],
        names:["F (root of IV)","A (3rd of IV)","C (5th of IV)","F (root of iv)","A♭ (borrowed 3rd of iv)","C (5th of iv)","C (root of I)","E (3rd of I)","G (5th of I)"],
        start:60, octaves:1, title:"Play each complete chord: IV → iv → I"},
      result:(score)=>score!==null?"You performed the mixture progression.":null },
    { type:"symbol-hunt", title:"Game 3 · Borrowed or Diatonic?",
      intro:"Examine each chord in a C-major context and determine whether it is diatonic or drawn from the parallel minor.",
      miaIntro:"Spell the complete chord and identify its function.",
      spec:{rounds:6, pool:[
        {label:"Borrowed iv (F-A♭-C)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"Ab4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"Diatonic IV (F-A-C)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true}],width:150}},
        {label:"♭VI (A♭-C-E♭)", spec:{clef:"treble",notes:[{p:"Ab4",d:"w"},{p:"C5",d:"w",chord:true},{p:"Eb5",d:"w",chord:true}],width:150}},
        {label:"♭VII (B♭-D-F)", spec:{clef:"treble",notes:[{p:"Bb3",d:"w"},{p:"D4",d:"w",chord:true},{p:"F4",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"You classified the chords correctly.":null },
    { type:"term-race", title:"Game 4 · Identify the Mixture Device",
      intro:"Match each musical description with the appropriate mixture technique.",
      miaIntro:"Parallel minor borrowing or parallel major inflection?",
      spec:{rounds:8, reverse:true, pool:[
        ["IV \u{2192} iv \u{2192} I","minor iv borrowed from the parallel minor"],
        ["\u{266D}VI \u{2192} \u{266D}VII \u{2192} I","the borrowed climb"],
        ["Minor ending on major I","Picardy third"],
        ["A\u{266D} in one C major chord","mixture, not modulation"],
        ["Mixture's effect","color change while the tonic holds"],
        ["Parallel of G major","G minor"],
        ["Parallel of A minor","A major"],
        ["Relative vs parallel","signature-share vs tonic-share"]]},
      result:(score)=>score>=6?"You identified the mixture techniques correctly.":null }
  ],
  practiceIntro:"Complete 20 practice questions on parallel keys, borrowed chords, modal mixture, and the Picardy third.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Parallel keys","same tonic"],["Mixture","parallel borrowing"],["iv in major","borrowed"],["\u{266D}VI","A\u{266D} major in C"],["Picardy","major I ending a minor piece"]], reverse:true}, count:6 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 },
    { type:"mc", q:"C major's parallel minor is…", choices:["C minor","A minor","G major"], answer:0, explain:"The same tonic in a different mode." },
    { type:"mc", q:"Modal mixture draws material from…", choices:["the parallel mode","the relative mode","no other key"], answer:0, explain:"The tonic-sharing parallel mode." },
    { type:"mc", q:"The borrowed iv in C major is…", choices:["F-A♭-C","F-A-C","F♯-A-C"], answer:0, explain:"Contains ♭6 (A♭)." },
    { type:"mc", q:"♭VII in C major is…", choices:["B♭-D-F","B-D-F","B♭-D♭-F"], answer:0, explain:"B♭–D–F; context determines whether it functions as mixture or broader modal harmony." },
    { type:"truefalse", q:"Modal mixture necessarily establishes a new tonic.", answer:false, explain:"Mixture may occur while the prevailing tonic remains active, although borrowed chords can participate in a larger modulation." },
    { type:"truefalse", q:"A Picardy third creates a major final tonic in a minor-key composition or section.", answer:true, explain:"The tonic triad's third is raised at the final cadence." },
    { type:"truefalse", q:"Common mixture chords in a major key often introduce ♭3, ♭6, or ♭7.", answer:true, explain:"These characteristic altered scale degrees still require context to confirm function." },
    { gen:"term-match", params:{subject:"term", pool:[["IV\u{2192}iv\u{2192}I","minor plagal motion"],["\u{266D}VI-\u{266D}VII-I","borrowed climb"],["G major's parallel","G minor"],["New tonic not confirmed","analyze as mixture"]], reverse:true}, count:3 },
    { gen:"rel-key", params:{ask:"both"}, count:2 }
  ],
  vocabulary:[
    {term:"Parallel Keys", def:"Same tonic, different mode: C major and C minor."},
    {term:"Modal Mixture", def:"Borrowing pitches or chords from the parallel mode."},
    {term:"Minor Plagal Motion (IV\u{2013}iv\u{2013}I)", def:"Borrowed iv adds color before the tonic."},
    {term:"Picardy Third", def:"A minor-key ending on a major tonic chord."}
  ],
  mistakes:[],
  summary:[
    "✔ Parallel keys share the same tonic but use different modes.",
    "✔ <b>Modal mixture</b> borrows pitches or chords from the parallel mode.",
    "✔ Major commonly borrows <b>iv, ii°, iiø7, ♭III, ♭VI, and ♭VII</b> from the parallel minor.",
    "✔ Mixture changes harmonic color while the prevailing tonic remains in control.",
    "✔ <b>IV–iv–I</b> creates minor plagal motion in a major key.",
    "✔ A <b>Picardy third</b> changes the final minor tonic into a major tonic.",
    "✔ If a new tonic is not established, the chromatic chord may be modal mixture rather than modulation."
  ],
  tips:[
    "Songwriters: try iv in place of your last IV for a sudden change of color.",
    "♭VI–♭VII–I powers countless game and film finales — the borrowed climb home.",
    "Every mixture chord still resolves within C — treat the flats as visitors, not settlers.",
    "Unit 26 complete! Next unit: extended chords — 9ths, 11ths, 13ths and beyond."
  ],
  rewards:{ badge:"Color Borrower", icon:"\u{1F3A8}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Identify material drawn from parallel major and minor modes.",
  quiz:[
    { type:"mc", q:"Parallel keys share…", choices:["the same tonic","the same signature","nothing"], answer:0, explain:"C major / C minor.", hint:"Not relatives." },
    { type:"mc", q:"Modal mixture means…", choices:["using material associated with the parallel mode","changing meter","adding trills"], answer:0, explain:"Parallel major and minor share the tonic.", hint:"The parallel mode." },
    { type:"mc", q:"The borrowed iv of C major is spelled…", choices:["F-A♭-C","F-A-C","D-F-A"], answer:0, explain:"♭6 recolors the IV.", hint:"One flat." },
    { type:"mc", q:"♭VI in C major is…", choices:["A♭ major","A minor","A♭ minor"], answer:0, explain:"A♭-C-E♭.", hint:"Major on ♭6." },
    { type:"mc", q:"Which altered scale degrees commonly appear in mixture chords borrowed from the parallel minor?", choices:["♭3, ♭6, and ♭7","♯4 and ♯5 only","the unchanged leading tone only"], answer:0, explain:"The characteristic scale degrees of the parallel minor.", hint:"The lowered degrees." },
    { type:"mc", q:"In C major, IV–iv–I demonstrates…", choices:["Modal mixture through the minor iv chord","A circle-of-fifths sequence","A Picardy third"], answer:0, explain:"F minor is drawn from the parallel minor mode.", hint:"The minor iv is borrowed." },
    { type:"mc", q:"Identify the chord in C major.",
      staff:{clef:"treble",notes:[{p:"Ab4",d:"w"},{p:"C5",d:"w",chord:true},{p:"Eb5",d:"w",chord:true}],width:160},
      choices:["♭VI — A♭ major","vi — A minor","IV — F major"], answer:0, explain:"A♭–C–E♭ is a major triad rooted on scale degree ♭6.", hint:"Root on ♭6." },
    { type:"mc", q:"What is a Picardy third?", choices:["A raised third that creates a major final tonic in a minor-key work or section","A minor tonic ending a major-key work","An augmented-sixth chord"], answer:0, explain:"The tonic triad's third is raised at the final cadence.", hint:"i becomes I at the end." },
    { type:"truefalse", q:"Modal mixture by itself requires the establishment of a new tonic.", answer:false, explain:"Mixture may occur while the prevailing tonic remains active, though borrowed chords can also participate in a modulation.", hint:"Mixture vs modulation." },
    { type:"truefalse", q:"In a clearly established C-major context, B♭ major may function as ♭VII drawn from the parallel minor collection.", answer:true, explain:"In other contexts, ♭VII may be better understood as part of Mixolydian or other modal harmony.", hint:"The ♭7 chord." },
    { type:"mc", q:"What is the parallel minor of G major?", choices:["G minor","E minor","B minor"], answer:0, explain:"Same tonic G, different mode.", hint:"Not the relative." },
    { type:"mc", q:"Which statement best distinguishes modal mixture from modulation?", choices:["Mixture may introduce parallel-mode material while the prevailing tonic remains active","Mixture always establishes a permanent new tonic","Mixture changes only the tempo"], answer:0, explain:"Determine whether another tonic receives structural confirmation before labeling a modulation.", hint:"Is a new tonic confirmed?" }
  ],
  miaPerfect:"Perfect score! You accurately identified common borrowed chords and modal-mixture procedures.",
  miaPass:"You passed and completed unit 26. Next, you will study extended chords.",
  mia:{
    hook:{ label:"the welcome",
      explain:"F-A♭-C inside C major — the borrowed iv from C minor: modal mixture without modulation.",
      play:()=>{[[60,64,67],[53,56,60],[55,59,62],[60,64,67]].forEach((row,i)=>row.forEach(m=>MFAudio.tone(m,.8,i*.85,.27)));} },
    learn:{ label:"modal mixture",
      explain:"Parallel keys share a tonic; major borrows iv, ii°, iiø7, ♭III, ♭VI, ♭VII from the minor; the Picardy third ends minor on major I. Color, not modulation.",
      hint:"Flats as visitors.",
      play:()=>{[53,56,60].forEach(m=>MFAudio.tone(m,.9,.05,.28));[60,64,67].forEach(m=>MFAudio.tone(m,1.0,1.0,.28));} },
    example:{ label:"the examples",
      explain:"The Learn-by-Doing steps let you hear ♭VI–♭VII–I, IV–iv–I, and the Picardy third; this panel compares them side by side.",
      play:()=>{const b=document.getElementById("l107a"); if(b)b.click();} },
    game:{ label:"the games",
      explain:"Sprint the borrowings, play the changing half step, spot flats on cards, then race the devices.",
      hint:"Find ♭6, ♭3, ♭7." },
    quiz:{ label:"this question",
      explain:"Ask: does the chord import ♭6, ♭3 or ♭7 while the tonic holds? Then it is mixture — name it by its minor-key numeral.",
      play:()=>{[56,60,63].forEach(m=>MFAudio.tone(m,.9,.05,.28));} }
  }
};
