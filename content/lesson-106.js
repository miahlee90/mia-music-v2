/* Lesson 106 — Augmented-Sixth Chords (Book 4, Unit 26 — SELF-AUTHORED)
   Core: predominants built on ♭6 with the interval of an AUGMENTED 6TH
   (♭6 up to ♯4) that expands OUTWARD to an octave on 5 (the V's root).
   Italian (3 notes), French (adds 2), German (adds ♭3).
   NOTE: edit by FULL-FILE REWRITE only. */

/* interactive resolution: grand-staff chord(s) + play (score & keyboard highlight in sync) + keyboard + a question */
function MF_L106_res(container,fb,cfg){
  container.innerHTML=`<div style="text-align:center;font-weight:800;font-size:12.5px;color:#5a4a12;margin-bottom:2px">${cfg.heading}</div>
    <div class="l106-st"></div>
    <div style="text-align:center;margin-top:6px"><button class="play l106-pl">${cfg.playLabel}</button></div>
    <div class="l106-kb" style="margin-top:8px"></div>
    <div class="choices l106-ch" style="margin-top:10px"></div>`;
  const api=Staff.render(container.querySelector(".l106-st"),cfg.staff);
  let kbApi=null;
  if(cfg.kb) kbApi=Keyboard.create(container.querySelector(".l106-kb"),cfg.kb);
  const pApi=kbApi?{svg:api.svg,highlight:(ix,keep)=>{ api.highlight(ix,keep);
    if(ix!=null){ const n=cfg.staff.notes[ix]; if(n&&n.rest===undefined&&n.bar===undefined&&(n.p||n.sound)) kbApi.press(MFAudio.midi(n.sound||n.p),true); } }}:api;
  container.querySelector(".l106-pl").onclick=()=>Staff.play(cfg.staff,pApi);
  const ch=container.querySelector(".l106-ch");
  cfg.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.textContent=c;
    b.onclick=()=>{ if(i===cfg.answer) fb(true,cfg.ok); else { MFAudio.tone(40,.2); fb(false,cfg.no); } };
    ch.appendChild(b); });
}

LESSON_CONTENT[106]={
  welcome:"Augmented-sixth chords use contrary half-step motion to approach the dominant.",
  hook:{
    say:"<b>Two voices form an augmented sixth and move outward by half step, arriving on pitches an octave apart.</b> \u{1F447} <b>Which scale degree do they approach?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Play the augmented sixth resolving outward</button></div>
          <div class="choices hk-ch" style="display:none"><button>Both voices approach scale degree 5, an octave apart</button><button>Both voices move inward to a unison on the tonic</button><button>Nowhere</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-a").onclick=()=>{ MFAudio.tone(53,.9,.05,.34); MFAudio.tone(63,.9,.05,.34); MFAudio.tone(52,1.1,1.0,.34); MFAudio.tone(64,1.1,1.0,.34); setTimeout(()=>ch.style.display="",2400); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. In A minor, F and D♯ form an augmented sixth. F descends by half step to E4, while D♯ ascends by half step to E5. The two voices arrive on scale degree 5, an octave apart.");
          else fb(false,"Follow the contrary motion: the lower note descends by half step, and the upper note ascends by half step.");
        });
      } }
  },
  objectives:[
    "Build the characteristic augmented sixth from ♭6 up to ♯4",
    "Resolve ♭6 and ♯4 outward by half step to scale degree 5",
    "Build It⁺⁶: ♭6, 1, and ♯4",
    "Build Fr⁺⁶: ♭6, 1, 2, and ♯4",
    "Build Ger⁺⁶: ♭6, 1, ♭3, and ♯4",
    "Identify augmented-sixth chords as chromatic predominants leading to V"
  ],
  steps:[
    { say:"<b>The Characteristic Interval:</b> An augmented sixth is formed from scale degree ♭6 up to scale degree ♯4. In A minor, F up to D♯ forms an augmented sixth, one half step larger than a major sixth. These scale-degree labels use the major scale built on the tonic as the reference. Therefore, in A minor, F is labeled ♭6 and D♯ is labeled ♯4. In minor, ♭6 is normally diatonic, while ♯4 is chromatic. In major, both pitches are chromatically altered. \u{1F447} <b>Which scale degrees form the characteristic augmented sixth?</b>",
      try:{ type:"mc", choices:["♭6 below and ♯4 above","1 below and 5 above","2 below and 7 above"], answer:0,
        success:"✓ Correct. Scale degree ♭6 forms the lower note, and ♯4 forms the upper note.",
        fail:"Identify F and D♯ in relation to the A-major scale degrees.",
        hint:"♭6 is below scale degree 5; ♯4 is above scale degree 4." } },
    { say:"<b>The Characteristic Resolution:</b> The two notes of the augmented-sixth interval normally resolve outward by half step. Scale degree ♭6 descends to 5, while ♯4 ascends to 5 in a higher octave. This contrary motion produces an octave on the dominant scale degree. Augmented-sixth chords normally have predominant function and approach V, either directly or through a cadential 6/4. \u{1F447} <b>How does the characteristic augmented-sixth interval normally resolve?</b><br><b>Key: A minor.</b> In A minor, ♭6 and ♯4 expand outward by half step to two occurrences of scale degree 5, an octave apart.",
      show:{ type:"staff", spec:{clef:"treble",tempo:66,time:"4/4",notes:[
        {p:"F4",d:"h",label:"\u{266D}6"},{p:"D#5",d:"h",chord:true,label:"\u{266F}4"},
        {p:"E4",d:"h",label:"5"},{p:"E5",d:"h",chord:true,label:"5"},{bar:"final"}],width:380} },
      try:{ type:"mc", choices:["Outward to scale degree 5 in two voices, an octave apart","Inward to a unison on scale degree 1","To a third on scale degree 2"], answer:0,
        success:"✓ Correct. Both tendency tones approach scale degree 5 by contrary half-step motion.",
        fail:"Identify the scale degree reached by both voices.",
        hint:"♭6 ↓ 5 and ♯4 ↑ 5." } },
    { say:"<b>Italian Augmented Sixth—It⁺⁶:</b> The Italian augmented-sixth chord, It⁺⁶, contains three pitch classes: ♭6, 1, and ♯4. In A minor, it is spelled F–A–D♯. In four-part writing, the tonic pitch A is normally doubled. \u{1F447} <b>Which scale degrees form the Italian augmented-sixth chord?</b>",
      try:{ type:"mc", choices:["♭6, 1, and ♯4","♭6 and ♯4 only","♭6, 1, 2, and ♯4"], answer:0,
        success:"✓ Correct. It⁺⁶ contains the augmented-sixth frame, ♭6 and ♯4, plus the tonic scale degree.",
        fail:"Identify the three different pitch classes in F–A–D♯.",
        hint:"♭6–1–♯4." } },
    { say:"<b>Use it — It⁺⁶ resolving to V:</b> On the grand staff, ♭6 (F) sits in the bass and ♯4 (D♯) on top, with the tonic A between them. Play it and listen as the outer voices expand <i>outward</i> to E — the root of V. \u{1F447} <b>How do the two outer voices move into V?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L106_res(c,fb,{
        heading:"It⁺⁶ → V  (A minor)",
        staff:{clef:"grand",tempo:60,time:"4/4",notes:[
          {p:"F3",d:"w",clef:"bass",label:"It⁺⁶"},{p:"A4",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"V"},{p:"G#4",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:420},
        kb:{start:52,octaves:2,labels:true},
        playLabel:"▶ Hear It⁺⁶ → V",
        choices:["♭6 (F) falls to E and ♯4 (D♯) rises to E — outward to an octave on 5","Both voices rise together to the tonic","Both voices fall to a unison"], answer:0,
        ok:"✓ Correct. F descends by half step and D♯ ascends by half step; the augmented sixth expands to an octave on E, the root of V. (The inner A steps down to the leading tone G♯.)",
        no:"Follow the outer voices: the bottom note falls a half step, the top note rises a half step — both toward E." }) } },
    { say:"<b>French Augmented Sixth—Fr⁺⁶:</b> The French augmented-sixth chord, Fr⁺⁶, contains ♭6, 1, 2, and ♯4. In A minor, it is spelled F–A–B–D♯. These four pitches belong to the same whole-tone collection, although the chord functions here as a chromatic predominant rather than as a whole-tone sonority. \u{1F447} <b>Which scale degree distinguishes Fr⁺⁶ from It⁺⁶?</b>",
      try:{ type:"mc", choices:["Scale degree 2","Scale degree ♭3","Scale degree 7"], answer:0,
        success:"✓ Correct. Adding scale degree 2, B, to F–A–D♯ produces Fr⁺⁶.",
        fail:"Complete the scale-degree pattern ♭6–1–2–♯4.",
        hint:"Scale degree 2 in A minor is B." } },
    { say:"<b>Use it — Fr⁺⁶ resolving to V:</b> Fr⁺⁶ adds scale degree 2 (B) to the frame. Play it into V and notice that B is already a chord tone of V, so it stays put. \u{1F447} <b>Which pitch is the common tone held into V?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L106_res(c,fb,{
        heading:"Fr⁺⁶ → V  (A minor)",
        staff:{clef:"grand",tempo:60,time:"4/4",notes:[
          {p:"F3",d:"w",clef:"bass",label:"Fr⁺⁶"},{p:"A4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"V"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:420},
        kb:{start:52,octaves:2,labels:true},
        playLabel:"▶ Hear Fr⁺⁶ → V",
        choices:["B (scale degree 2) — it is the 5th of V and holds as a common tone","F (♭6) holds as a common tone","D♯ (♯4) holds as a common tone"], answer:0,
        ok:"✓ Correct. B is the fifth of the V chord (E–G♯–B), so it is held. Meanwhile F falls to E and D♯ rises to E, exactly as in It⁺⁶.",
        no:"F and D♯ are the tendency tones that move outward to E. Look for the note that belongs to both Fr⁺⁶ and the V chord." }) } },
    { say:"<b>German Augmented Sixth—Ger⁺⁶:</b> The German augmented-sixth chord, Ger⁺⁶, contains ♭6, 1, ♭3, and ♯4. In A minor, it is spelled F–A–C–D♯. If D♯ is enharmonically respelled as E♭, the pitch collection becomes F–A–C–E♭, the spelling of F7. The two chords have the same sounding pitches but different spellings and harmonic functions. A direct Ger⁺⁶–V resolution may create parallel perfect fifths in common-practice four-part writing. For this reason, Ger⁺⁶ often moves through a cadential i<span style='display:inline-block;font-size:.62em;line-height:1;text-align:center;vertical-align:-.12em'>6<br>4</span> before V. Other voice-leading solutions are also possible. \u{1F447} <b>When its ♯4 is enharmonically respelled, Ger⁺⁶ has the same sounding pitch collection as…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Chord</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Notes in A minor</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Added scale degree</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#2F6DA8">Italian +6</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">F-A-D♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">—</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#A9821F">French +6</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">F-A-B-D♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">degree 2</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;font-weight:800;color:#C05A21">German +6</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">F-A-C-D♯</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">degree \u{266D}3</td></tr></table>` },
      try:{ type:"mc", choices:["A dominant-seventh-quality chord","A major scale","A pedal point"], answer:0,
        success:"✓ Correct. F–A–C–D♯ and F–A–C–E♭ are enharmonically equivalent in twelve-tone equal temperament, but their spellings indicate different interval structures and harmonic functions.",
        fail:"Respell D♯ enharmonically as E♭ and identify F–A–C–E♭.",
        hint:"F7 is a dominant-seventh-quality chord." } },
    { say:"<b>Use it — Ger⁺⁶ through the cadential 6/4 to V:</b> A direct Ger⁺⁶–V risks parallel perfect fifths, so Ger⁺⁶ typically moves first to a cadential i<span style='display:inline-block;font-size:.62em;line-height:1;text-align:center;vertical-align:-.12em'>6<br>4</span> (over the dominant bass E), then to V. Play all three chords and hear the smooth detour. \u{1F447} <b>Why pass through i<span style='display:inline-block;font-size:.62em;line-height:1;text-align:center;vertical-align:-.12em'>6<br>4</span> instead of going straight to V?</b>",
      try:{ type:"custom", mount:(c,fb)=>MF_L106_res(c,fb,{
        heading:"Ger⁺⁶ → i<span style='display:inline-block;font-size:.62em;line-height:1;text-align:center;vertical-align:-.12em'>6<br>4</span> → V  (A minor)",
        staff:{clef:"grand",tempo:60,time:"4/4",notes:[
          {p:"F3",d:"w",clef:"bass",label:"Ger⁺⁶"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"i\u{2076}\u{2084}"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"single"},
          {p:"E3",d:"w",clef:"bass",label:"V"},{p:"G#4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:520},
        kb:{start:52,octaves:2,labels:true},
        playLabel:"▶ Hear Ger⁺⁶ → i<span style='display:inline-block;font-size:.62em;line-height:1;text-align:center;vertical-align:-.12em'>6<br>4</span> → V",
        choices:["To avoid parallel perfect fifths that a direct Ger⁺⁶–V would create","Because Ger⁺⁶ is unable to resolve to V","To modulate to a new key"], answer:0,
        ok:"✓ Correct. The bass moves ♭6→5 at the very start (F→E), and the cadential 6/4 lets the upper voices step down cleanly (A→G♯, C→B) into V, sidestepping the parallel fifths of a direct resolution.",
        no:"Ger⁺⁶ resolves to V perfectly well — the issue is the perfect fifths it can create in a DIRECT resolution. The 6/4 smooths the voice leading." }) } },
    { say:"<b>Function and Identification:</b> Italian, French, and German augmented-sixth chords normally serve chromatic predominant function. Identify them by locating the correctly spelled augmented-sixth interval from ♭6 up to ♯4 and confirming its expected outward resolution to scale degree 5. The Neapolitan and augmented-sixth chords are both important chromatic predominant harmonies, but they use different scale degrees and voice-leading patterns. \u{1F447} <b>What function do the Neapolitan and augmented-sixth chords commonly share?</b>",
      try:{ type:"mc", choices:["Predominant function","Tonic function","Identical pitch content"], answer:0,
        success:"✓ Correct. Both chord types commonly prepare the dominant, although they do so through different pitch structures and voice leading.",
        fail:"Identify the function that normally follows a predominant chord.",
        hint:"Predominant → dominant." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which augmented-sixth chord adds scale degree 2 to the It⁺⁶ pitch collection?</b>",
      try:{ type:"mc", choices:["French augmented sixth","Italian augmented sixth","German augmented sixth"], answer:0,
        success:"✓ Correct. Fr⁺⁶ contains ♭6, 1, 2, and ♯4.",
        fail:"Compare the additional chord member in each augmented-sixth type.",
        hint:"In A minor, Fr⁺⁶ includes B." } }
  ],
  examples:[
    { caption:"Key: A minor — F and D♯ in It⁺⁶ expand outward to E4 and E5; V then resolves to i.",
      staff:{clef:"treble",tempo:69,time:"4/4",notes:[
        {p:"F4",d:"w",label:"It⁺⁶"},{p:"A4",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
        {p:"E4",d:"w",label:"V"},{p:"G#4",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"single"},
        {p:"A4",d:"w",label:"i"},{p:"C5",d:"w",chord:true},{p:"E5",d:"w",chord:true},{bar:"final"}],width:560},
      kb:{start:65,octaves:0.9167,labels:true} },
    { caption:"Augmented-Sixth Pitch Collections in A Minor — Italian uses the three-note frame, French adds scale degree 2, German adds ♭3; all three contain the same ♭6–♯4 interval.",
      staff:{clef:"treble",tempo:66,time:"4/4",notes:[
        {p:"F4",d:"w",label:"It⁺⁶"},{p:"A4",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
        {p:"F4",d:"w",label:"Fr⁺⁶"},{p:"A4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"single"},
        {p:"F4",d:"w",label:"Ger⁺⁶"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"D#5",d:"w",chord:true},{bar:"final"}],width:600},
      kb:{start:65,octaves:0.9167,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Augmented-Sixth Identification (45s)",
      intro:"Identify chord members, spellings, functions, and resolutions.",
      miaIntro:"♭6 descends; ♯4 ascends.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["The +6 interval","\u{266D}6 up to \u{266F}4"],
        ["Resolution","outward to an octave on 5"],
        ["Italian +6","\u{266D}6, 1, \u{266F}4 (three notes)"],
        ["French +6","adds degree 2"],
        ["German +6","adds \u{266D}3"],
        ["Ger+6 sounds like","a dominant 7th (enharmonic)"],
        ["Function","chromatic predominant to V"],
        ["In A minor the frame is","F up to D\u{266F}"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — Augmented-sixth chords identified!":null },
    { type:"key-climb", title:"Game 2 · Resolve the Augmented Sixth",
      intro:"Play F below D♯, then resolve outward to two E pitches an octave apart: F descends to the lower E, and D♯ ascends to the upper E.",
      miaIntro:"Resolve both tendency tones outward by half step.",
      spec:{seq:[53,63,52,64],
        names:["F (♭6)","D♯ (♯4)","E (♭6 falls to 5)","E (♯4 rises to 5)"],
        start:52, octaves:1, title:"The outward resolution"},
      result:(score)=>score!==null?"You resolved the augmented-sixth interval correctly.":null },
    { type:"symbol-hunt", title:"Game 3 · Identify the Chord Type",
      intro:"Examine each augmented-sixth chord in A minor and identify it as Italian, French, or German.",
      miaIntro:"Compare the chord member added to the ♭6–1–♯4 framework.",
      spec:{rounds:6, pool:[
        {label:"Italian (F-A-D♯)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"D#5",d:"w",chord:true}],width:150}},
        {label:"French (F-A-B-D♯)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D#5",d:"w",chord:true}],width:150}},
        {label:"German (F-A-C-D♯)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"C5",d:"w",chord:true},{p:"D#5",d:"w",chord:true}],width:150}},
        {label:"Plain iv6 (F-A-D)", spec:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"D5",d:"w",chord:true}],width:150}}]},
      result:(score)=>score>=5?"Chord types identified!":null },
    { type:"term-race", title:"Game 4 · Augmented-Sixth Mechanics",
      intro:"Identify the characteristic interval, function, and resolution.",
      miaIntro:"Follow ♭6 and ♯4 toward scale degree 5.",
      spec:{rounds:8, reverse:true, pool:[
        ["\u{266D}6 moves","down a half step to 5"],
        ["\u{266F}4 moves","up a half step to 5"],
        ["Landing interval","an octave"],
        ["Landing note","the dominant's root"],
        ["Ger+6 usually passes through","the cadential 6/4"],
        ["Fr+6's shimmer","four whole-tone notes"],
        ["The +6 vs M6","a half step wider"],
        ["Neapolitan & +6 share","the predominant job"]]},
      result:(score)=>score>=6?"Augmented-sixth voice leading identified!":null }
  ],
  practiceIntro:"Complete 20 practice questions on augmented-sixth spellings, chord types, functions, and resolutions.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["It⁺⁶","3 notes"],["Fr⁺⁶","+ degree 2"],["Ger⁺⁶","+ \u{266D}3"],["Resolution","octave on 5"],["Function","PD to V"]], reverse:true}, count:6 },
    { gen:"interval-quality", params:{ask:"quality"}, count:2 },
    { type:"mc", q:"The augmented 6th interval runs from…", choices:["♭6 up to ♯4","1 to 5","2 to 6"], answer:0, explain:"F to D♯ in A minor." },
    { type:"mc", q:"Both notes of the +6 resolve…", choices:["outward to an octave on 5","inward to a unison","up together"], answer:0, explain:"♭6 falls, ♯4 rises." },
    { type:"mc", q:"The Italian sixth has how many different notes?", choices:["3","4","5"], answer:0, explain:"♭6, 1, ♯4." },
    { type:"mc", q:"The German sixth adds…", choices:["♭3","degree 2","degree 6"], answer:0, explain:"F-A-C-D♯." },
    { type:"truefalse", q:"The French sixth adds scale degree 2.", answer:true, explain:"F-A-B-D♯." },
    { type:"truefalse", q:"A German augmented-sixth chord is enharmonically equivalent to a dominant-seventh-quality pitch collection.", answer:true, explain:"Its spelling and harmonic function remain different until it is enharmonically reinterpreted." },
    { type:"truefalse", q:"Augmented-sixth chords normally provide predominant motion toward V.", answer:true, explain:"They serve predominant function and normally lead to the dominant." },
    { gen:"term-match", params:{subject:"term", pool:[["F-A-D\u{266F}","Italian"],["F-A-B-D\u{266F}","French"],["F-A-C-D\u{266F}","German"],["E + E octave","the landing"]], reverse:true}, count:3 },
    { gen:"triad-quality", params:{quals:["M","m"]}, count:2 }
  ],
  vocabulary:[
    {term:"Characteristic Interval", def:"♭6 and ♯4 expand outward to scale degree 5."},
    {term:"Italian +6", def:"♭6–1–♯4"},
    {term:"French +6", def:"♭6–1–2–♯4"},
    {term:"German +6", def:"♭6–1–♭3–♯4"}
  ],
  mistakes:[],
  summary:[
    "✔ The characteristic interval is <b>♭6–♯4</b>, expanding outward to an octave on scale degree 5.",
    "✔ <b>It⁺⁶</b> contains ♭6, 1, and ♯4.",
    "✔ <b>Fr⁺⁶</b> adds scale degree 2.",
    "✔ <b>Ger⁺⁶</b> adds ♭3 and can be enharmonically respelled as a dominant seventh chord, although its spelling and function are different.",
    "✔ All three chords are <b>chromatic predominants</b> leading toward V.",
    "✔ The Neapolitan and augmented-sixth chords are important members of the chromatic-predominant family."
  ],
  tips:[
    "Spell any +6 fast: find 5, put half steps on both sides (♭6 below-target, ♯4 above-target… both aiming at 5).",
    "Hear Ger⁶ vs V7: identical sound, opposite futures — one opens outward, one falls a 5th.",
    "The Fr⁶'s four notes all belong to one whole-tone scale — L82 hiding inside L106.",
    "Next lesson: chords borrowed straight from the parallel key — modal mixture."
  ],
  rewards:{ badge:"Pincer Operator", icon:"\u{2194}\u{FE0F}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: ♭6 descends to 5, ♯4 ascends to 5, and the two voices arrive an octave apart.",
  quiz:[
    { type:"mc", q:"The augmented 6th interval spans…", choices:["♭6 up to ♯4","1 up to 6","5 up to 3"], answer:0, explain:"The chromatic pincers.", hint:"F to D♯." },
    { type:"mc", q:"Its resolution:", choices:["outward to an octave on the dominant","inward to a 3rd","a fall to the tonic"], answer:0, explain:"Both voices to 5.", hint:"E and E." },
    { type:"mc", q:"The Italian sixth in A minor:", choices:["F-A-D♯","F-A-B-D♯","F-A-C-D♯"], answer:0, explain:"Three notes.", hint:"The lean one." },
    { type:"mc", q:"The French sixth adds…", choices:["scale degree 2","♭3","the leading tone"], answer:0, explain:"F-A-B-D♯.", hint:"Whole-tone tang." },
    { type:"mc", q:"The German sixth adds…", choices:["♭3","degree 2","degree 4"], answer:0, explain:"F-A-C-D♯.", hint:"The fullest." },
    { type:"mc", q:"When enharmonically respelled, Ger⁺⁶ has the same sounding pitch collection as which chord quality?", choices:["Dominant seventh","Major triad","Diminished triad"], answer:0, explain:"F-A-C-D♯ ≈ F-A-C-E♭.", hint:"Respell D♯." },
    { type:"mc", q:"Identify the chord in A minor.",
      staff:{clef:"treble",notes:[{p:"F4",d:"w"},{p:"A4",d:"w",chord:true},{p:"B4",d:"w",chord:true},{p:"D#5",d:"w",chord:true}],width:160},
      choices:["Fr⁺⁶","It⁺⁶","Ger⁺⁶"], answer:0, explain:"The chord contains F–A–B–D♯, or scale degrees ♭6–1–2–♯4.", hint:"Count and find the extra." },
    { type:"mc", q:"Augmented-sixth chords normally serve which function?", choices:["Chromatic predominant","Tonic substitute","Cadence"], answer:0, explain:"PD, from the chromatic side.", hint:"Before the dominant." },
    { type:"truefalse", q:"In the characteristic resolution, ♭6 moves down to 5 and ♯4 moves up to 5 in a higher octave.", answer:true, explain:"Outward pincers.", hint:"Opposite motion." },
    { type:"truefalse", q:"Ger⁺⁶ frequently moves through a cadential 6/4 before V in common-practice four-part writing.", answer:true, explain:"This voice leading helps avoid parallel perfect fifths that may result from a direct resolution.", hint:"The detour." },
    { type:"mc", q:"In C major or C minor, which pitches form the characteristic augmented-sixth interval?", choices:["A♭ up to F♯","A♮ up to F♮","G up to E"], answer:0, explain:"A♭ is ♭6 and F♯ is ♯4; both approach G, scale degree 5.", hint:"Both sides of 5." },
    { type:"mc", q:"Which statement correctly relates the Neapolitan and augmented-sixth chords?", choices:["Both are important chromatic predominant harmonies that commonly prepare V","They contain the same pitches","They both function as tonic"], answer:0, explain:"They share predominant function but use different scale degrees and voice-leading patterns.", hint:"Same job, different color." }
  ],
  miaPerfect:"Perfect score! You accurately constructed and resolved Italian, French, and German augmented-sixth chords.",
  miaPass:"You passed! Next, you will study borrowed chords and modal mixture.",
  mia:{
    hook:{ label:"the welcome",
      explain:"F and D♯ — an augmented 6th — expanded outward to an octave on E: the dominant. The +6 chords' engine.",
      play:()=>{MFAudio.tone(53,.9,.05,.34);MFAudio.tone(63,.9,.05,.34);MFAudio.tone(52,1.1,1.0,.34);MFAudio.tone(64,1.1,1.0,.34);} },
    learn:{ label:"augmented sixths",
      explain:"♭6+♯4 expand outward to the octave on 5. It=3 notes, Fr adds 2, Ger adds ♭3 (≈V7 enharmonically, via cadential 6/4). All PD→V. Hear each type resolve to V right in Learn by Doing.",
      hint:"Pincers on the dominant.",
      play:()=>{[53,57,63].forEach(m=>MFAudio.tone(m,.9,.05,.3));[52,56,64].forEach(m=>MFAudio.tone(m,1.0,1.0,.3));} },
    example:{ label:"the examples",
      explain:"Example 1 resolves the Italian sixth through V to i; example 2 lines up all three types on one frame." },
    game:{ label:"the games",
      explain:"Sprint the types, open the pincers by hand, name each chord on cards, then race the mechanics.",
      hint:"Extra note names the nation." },
    quiz:{ label:"this question",
      explain:"Find the ♭6+♯4 pair aiming at 5; count the notes (3=It); name the extra (2=Fr, ♭3=Ger); resolve outward to V.",
      play:()=>{[53,63].forEach(m=>MFAudio.tone(m,.9,.05,.34));} }
  }
};
