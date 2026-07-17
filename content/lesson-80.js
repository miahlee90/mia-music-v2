/* Lesson 80 — Modes in Practice (Book 4, Unit 20 — SELF-AUTHORED)
   Prerequisites: L62–63 defined all seven modes. Focus of THIS lesson:
   the ONE idea that changing a single scale degree changes the modal sound.
   Two families (major-type / minor-type), each mode's characteristic scale
   degree, recognizing modes by ear and from notation. (Bright-to-dark
   ordering and modes-in-styles are intentionally out of scope here.)
   NOTE: edit by FULL-FILE REWRITE only. */

/* Activity 1 — the MAJOR family: one C scale, one changed note per version */
function MF_L80_major(container,fb){
  const VER={ A:[60,62,64,65,67,69,71,72], B:[60,62,64,66,67,69,71,72], C:[60,62,64,65,67,69,70,72] };
  const ROUNDS=[
    {q:"Which version is <b>Lydian</b> — the one with a <b>raised 4th</b>?", ans:"B", expl:"Version B raised the 4th (F → F♯) — Lydian. Nothing else changed."},
    {q:"Which version is <b>Mixolydian</b> — the one with a <b>lowered 7th</b>?", ans:"C", expl:"Version C lowered the 7th (B → B♭) — Mixolydian."}];
  let r=0;
  container.innerHTML=`<div class="big-q l80mj-q" style="text-align:center"></div>
    <div style="text-align:center">
      <button class="play" data-v="A">▶ A (Ionian)</button>
      <button class="play" data-v="B">▶ B</button>
      <button class="play" data-v="C">▶ C</button></div>
    <div class="choices chips l80mj-ch"><button>A</button><button>B</button><button>C</button></div>`;
  const q=container.querySelector(".l80mj-q"), ch=container.querySelector(".l80mj-ch");
  container.querySelectorAll("[data-v]").forEach(btn=>btn.onclick=()=>VER[btn.dataset.v].forEach((m,i)=>MFAudio.tone(m,.34,i*.3,.42)));
  function ask(){ if(r>=ROUNDS.length){ q.textContent="✓ Changing ONE note changed the whole modal color."; ch.style.display="none"; return; }
    q.innerHTML=`${ROUNDS[r].q}<br><span style="font-weight:400;font-size:13px">Play A, B and C — only one note differs from Ionian.</span>`; }
  [...ch.children].forEach(b=>b.onclick=()=>{ const R=ROUNDS[r]; if(!R) return;
    if(b.textContent===R.ans){ MFAudio.yay(); fb(true,"✓ "+R.expl); r++; setTimeout(ask,1300); }
    else { MFAudio.tone(40,.2); fb(false,"Compare with Version A (Ionian): which single note moved?"); } });
  ask();
}

/* Activity 2 — the MINOR family: one A scale, one changed note per version */
function MF_L80_minor(container,fb){
  const VER={ A:[57,59,60,62,64,65,67,69], B:[57,59,60,62,64,66,67,69], C:[57,58,60,62,64,65,67,69] };
  const ROUNDS=[
    {q:"Which version is <b>Dorian</b> — the one with a <b>raised 6th</b>?", ans:"B", expl:"Version B raised the 6th (F → F♯) — Dorian."},
    {q:"Which version is <b>Phrygian</b> — the one with a <b>lowered 2nd</b>?", ans:"C", expl:"Version C lowered the 2nd (B → B♭) — Phrygian."}];
  let r=0;
  container.innerHTML=`<div class="big-q l80mn-q" style="text-align:center"></div>
    <div style="text-align:center">
      <button class="play" data-v="A">▶ A (Aeolian)</button>
      <button class="play" data-v="B">▶ B</button>
      <button class="play" data-v="C">▶ C</button></div>
    <div class="choices chips l80mn-ch"><button>A</button><button>B</button><button>C</button></div>`;
  const q=container.querySelector(".l80mn-q"), ch=container.querySelector(".l80mn-ch");
  container.querySelectorAll("[data-v]").forEach(btn=>btn.onclick=()=>VER[btn.dataset.v].forEach((m,i)=>MFAudio.tone(m,.34,i*.3,.42)));
  function ask(){ if(r>=ROUNDS.length){ q.textContent="✓ Again, one changed note = a new modal color."; ch.style.display="none"; return; }
    q.innerHTML=`${ROUNDS[r].q}<br><span style="font-weight:400;font-size:13px">Play A, B and C — only one note differs from Aeolian.</span>`; }
  [...ch.children].forEach(b=>b.onclick=()=>{ const R=ROUNDS[r]; if(!R) return;
    if(b.textContent===R.ans){ MFAudio.yay(); fb(true,"✓ "+R.expl); r++; setTimeout(ask,1300); }
    else { MFAudio.tone(40,.2); fb(false,"Compare with Version A (Aeolian): which single note moved?"); } });
  ask();
}

LESSON_CONTENT[80]={
  welcome:"Recognize and hear the diatonic modes — and how one changed note colors each one.",
  hook:{
    say:"<b>The two melodies share the same tonic.</b> Melody A uses the major scale, while Melody B lowers the seventh scale degree. \u{1F447} <b>Which melody is Mixolydian?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center">
          <button class="play hk-a">▶ Melody A</button>
          <button class="play hk-b">▶ Melody B</button></div>
          <div class="choices hk-ch" style="display:none"><button>Melody B — its seventh scale degree is lowered</button><button>Melody A — it uses the major scale without a lowered seventh</button><button>Neither melody uses a modal alteration</button></div>`;
        const A=[60,64,67,71,72,67,64,60], B=[60,64,67,70,72,70,67,60];
        const ch=container.querySelector(".hk-ch");
        let hA=false,hB=false;
        container.querySelector(".hk-a").onclick=()=>{ A.forEach((m,i)=>MFAudio.tone(m,.38,i*.32,.42)); hA=true; if(hB) setTimeout(()=>ch.style.display="",2900); };
        container.querySelector(".hk-b").onclick=()=>{ B.forEach((m,i)=>MFAudio.tone(m,.38,i*.32,.42)); hB=true; if(hA) setTimeout(()=>ch.style.display="",2900); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Correct. Melody B lowers B to B♭, changing the major scale's seventh degree and producing Mixolydian. That lowered seventh is Mixolydian's characteristic scale degree.");
          else fb(false,"Compare the seventh scale degree in the two melodies. It is lowered in the Mixolydian melody.");
        });
      } }
  },
  objectives:[
    "Distinguish major-type and minor-type modes",
    "Identify each mode's characteristic scale degree",
    "Recognize modes by ear",
    "Identify modes from notation"
  ],
  steps:[
    { say:"<b>The Seven Modes:</b> Ionian, Lydian, and Mixolydian are <b style='color:#2F6DA8'>major-type</b> modes because they contain a major third above the tonic. Dorian, Phrygian, and Aeolian are <b style='color:#C05A21'>minor-type</b> modes because they contain a minor third above the tonic. <b>Locrian is usually treated separately because its diminished fifth makes the tonic unstable.</b> \u{1F447} <b>Which modes are major-type modes?</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px;color:#2F6DA8">Major-type</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px;color:#C05A21">Minor-type</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Unstable</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#2F6DA8">Ionian · Lydian · Mixolydian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;color:#C05A21">Dorian · Phrygian · Aeolian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">Locrian</td></tr></table>` },
      try:{ type:"mc", choices:["Ionian, Lydian, and Mixolydian","Dorian, Phrygian, and Aeolian","Phrygian, Aeolian, and Locrian"], answer:0,
        success:"✓ Correct. Each of these modes contains a major third above its tonic.",
        fail:"Identify the modes with a major third above the tonic.",
        hint:"Begin with Ionian, the major-scale mode." } },
    { say:"<b>Characteristic Scale Degrees:</b> Compare each mode with its reference scale — <b>Ionian is the major scale, Aeolian is the natural minor scale</b> — and change just one degree: <b style='color:#2F6DA8'>Lydian = major + ♯4</b>, <b style='color:#2F6DA8'>Mixolydian = major + ♭7</b>, <b style='color:#C05A21'>Dorian = natural minor + raised 6</b>, <b style='color:#C05A21'>Phrygian = natural minor + ♭2</b>. (Locrian adds a diminished fifth.) \u{1F447} <b>Compared with the parallel natural minor scale, Dorian has…</b>",
      show:{ type:"html", html:`<table style="border-collapse:collapse;margin:0 auto;font-size:14px;min-width:300px">
        <tr><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Mode</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Reference scale</th><th style="border:1.5px solid #cdd5e1;background:#eef1ff;padding:5px 12px">Characteristic degree</th></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;color:#2F6DA8;font-weight:800">Lydian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">major</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800;color:#A9821F">♯4</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;color:#2F6DA8;font-weight:800">Mixolydian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">major</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800;color:#A9821F">♭7</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;color:#C05A21;font-weight:800">Dorian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">natural minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800;color:#A9821F">raised 6</td></tr>
        <tr><td style="border:1.5px solid #cdd5e1;padding:4px 12px;color:#C05A21;font-weight:800">Phrygian</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center">natural minor</td><td style="border:1.5px solid #cdd5e1;padding:4px 12px;text-align:center;font-weight:800;color:#A9821F">♭2</td></tr></table>` },
      try:{ type:"mc", choices:["a raised sixth","a lowered seventh","a raised fourth"], answer:0,
        success:"✓ Correct. Dorian is natural minor with a raised sixth — that is its characteristic scale degree.",
        fail:"Compare Dorian with the parallel natural minor scale.",
        hint:"Dorian raises one scale degree of natural minor." } },
    { say:"<b>Activity 1 — The Major Family:</b> Here is one scale on the same tonic, in three versions. Only <b>one note</b> changes each time. Play A (Ionian), then B and C, and compare. \u{1F447}",
      try:{ type:"custom",
        hint:"Version A is Ionian. In B, listen to the 4th; in C, listen to the 7th.",
        mount:(container,fb)=>MF_L80_major(container,fb) } },
    { say:"<b>Activity 2 — The Minor Family:</b> The same idea for the minor-type modes: one scale, one changed note per version. Play A (Aeolian), then B and C, and listen for the characteristic note. \u{1F447}",
      try:{ type:"custom",
        hint:"Version A is Aeolian. In B, listen to the 6th; in C, listen to the 2nd.",
        mount:(container,fb)=>MF_L80_minor(container,fb) } },
    { say:"<b>Identifying a Mode on the Staff:</b> First find the tonic. Next check the third for a major-type or minor-type sound. Finally look for the characteristic scale degree. \u{1F447} <b>A scale uses only white keys from D to the next D. Which mode is it?</b>",
      show:{ type:"staff", spec:{clef:"treble",tempo:120,notes:[
        {p:"D4",d:"q",label:"tonic"},{p:"E4",d:"q"},{p:"F4",d:"q",label:"m3"},{p:"G4",d:"q"},
        {p:"A4",d:"q"},{p:"B4",d:"q",label:"raised 6!"},{p:"C5",d:"q"},{p:"D5",d:"q"},{bar:"final"}],width:560} },
      try:{ type:"mc", choices:["D Dorian","D Aeolian","D Lydian"], answer:0,
        success:"✓ Correct. F is a minor third above D (minor-type), and B♮ is the raised sixth compared with D natural minor — D Dorian.",
        fail:"Check the third above D, then compare the sixth with D natural minor.",
        hint:"It is a minor-type mode with a raised sixth." } },
    { say:"<b>How to Write a Modal Melody:</b> <b>1) Establish the tonic. 2) Use the notes of the chosen mode. 3) Emphasize the characteristic scale degree.</b> \u{1F447} <b>Which step makes a Mixolydian melody sound Mixolydian?</b>",
      try:{ type:"mc", choices:["Emphasize the lowered 7th — its characteristic scale degree","Avoid the seventh scale degree entirely","Add chromatic sharps throughout"], answer:0,
        success:"✓ Correct. Featuring the lowered seventh over a clear tonic is what makes the melody sound Mixolydian.",
        fail:"What single scale degree gives Mixolydian its color?",
        hint:"The lowered seventh is the characteristic degree." } },
    { say:"<b>Review:</b> \u{1F447} <b>Which characteristic scale degree turns natural minor into Phrygian?</b>",
      try:{ type:"mc", choices:["A lowered second (♭2)","A raised sixth","A lowered seventh"], answer:0,
        success:"✓ Correct. Phrygian is natural minor with a lowered second — a half step between the tonic and the 2nd.",
        fail:"Which single degree gives Phrygian its dark color?",
        hint:"Natural minor with a lowered second." } }
  ],
  examples:[
    { caption:"D Dorian in action: a minor-family melody whose raised 6th (B♮) keeps brightening the line. The characteristic note is featured, not hidden.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"D4",d:"q"},{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q",label:"raised 6"},
        {p:"A4",d:"q"},{p:"F4",d:"q"},{p:"E4",d:"q"},{p:"D4",d:"q"},{bar:"final"}],width:560},
      kb:{start:60,octaves:1,labels:true} },
    { caption:"G Mixolydian: a major-family melody that leans on its lowered 7th (F♮) instead of F♯ — the characteristic note in eight notes.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"G4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"},{p:"F5",d:"q",label:"♭7"},
        {p:"D5",d:"q"},{p:"F5",d:"q",label:"♭7"},{p:"D5",d:"q"},{p:"G4",d:"q"},{bar:"final"}],width:560},
      kb:{start:60,octaves:2,labels:true} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Characteristic Scale-Degree Sprint (45s)",
      intro:"Match each mode with the one scale degree that gives it its color, before time runs out.",
      miaIntro:"Compare each mode with its reference scale — major or natural minor.",
      spec:{gen:"term-match", params:{subject:"term", pool:[
        ["Lydian","major + ♯4"],
        ["Mixolydian","major + ♭7"],
        ["Dorian","natural minor + raised 6"],
        ["Phrygian","natural minor + ♭2"],
        ["Ionian","the major scale"],
        ["Aeolian","the natural minor scale"],
        ["Locrian","minor 3rd + diminished 5th"],
        ["Changing one degree","changes the mode"]], reverse:true}, seconds:45},
      result:(score)=>score>=8?score+" — characteristic degrees identified!":null },
    { type:"symbol-hunt", title:"Game 2 · Mode Detective",
      intro:"Examine each scale and select the correct mode. The first and final notes identify the tonic.",
      miaIntro:"Find the tonic, check the third, then look for the characteristic scale degree.",
      spec:{rounds:6, pool:[
        {label:"D Dorian (m3 + raised 6)", spec:{clef:"treble",notes:[{p:"D4",d:"q"},{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"}],width:190}},
        {label:"G Mixolydian (M3 + ♭7)", spec:{clef:"treble",notes:[{p:"G4",d:"q"},{p:"B4",d:"q"},{p:"D5",d:"q"},{p:"F5",d:"q"},{p:"G5",d:"q"}],width:190}},
        {label:"F Lydian (M3 + ♯4)", spec:{clef:"treble",notes:[{p:"F4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"F5",d:"q"}],width:190}},
        {label:"E Phrygian (m3 + ♭2)", spec:{clef:"treble",notes:[{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"B4",d:"q"},{p:"E5",d:"q"}],width:190}}]},
      result:(score)=>score>=5?"You identified the modes correctly.":null },
    { type:"order-tap", title:"Game 3 · Build a Modal Melody",
      intro:"Put the three steps of writing a modal melody in order.",
      miaIntro:"Establish the tonic, use the mode's notes, then feature the characteristic degree.",
      spec:{sequence:["Establish the tonic","Use the notes of the chosen mode","Emphasize the characteristic scale degree"],
        title:"Writing a modal melody, step by step"},
      result:(stars)=>stars>=2?"You ordered the modal-melody steps correctly.":null },
    { type:"term-race", title:"Game 4 · Match the Characteristic Degree",
      intro:"Match each mode with its characteristic scale degree before time runs out.",
      miaIntro:"One degree tells each mode apart from its reference scale.",
      spec:{rounds:8, reverse:true, pool:[
        ["Lydian","♯4"],
        ["Mixolydian","♭7"],
        ["Dorian","raised 6"],
        ["Phrygian","♭2"],
        ["Ionian","the major scale"],
        ["Aeolian","the natural minor scale"],
        ["Locrian","diminished 5th"],
        ["Characteristic degree","tells the modes apart"]]},
      result:(score)=>score>=6?"You matched every characteristic degree.":null }
  ],
  practiceIntro:"Complete 20 practice questions on modal families and characteristic scale degrees. The next question will appear after each correct answer.",
  practice:[
    { gen:"term-match", params:{subject:"term", pool:[["Lydian","♯4"],["Mixolydian","♭7"],["Dorian","raised 6"],["Phrygian","♭2"],["Ionian","= major"],["Aeolian","= natural minor"]], reverse:true}, count:6 },
    { gen:"mode-id", params:{set:"all", ask:"recipe"}, count:4 },
    { type:"mc", q:"Why is Dorian classified as a minor-type mode?", choices:["It contains a minor third above the tonic","It contains a major third above the tonic","It has no third"], answer:0,
      explain:"Dorian contains a minor third above its tonic." },
    { type:"mc", q:"To turn the major scale into Lydian, change the…", choices:["fourth scale degree (raise it to ♯4)","seventh scale degree","second scale degree"], answer:0,
      explain:"Lydian is major with a raised fourth." },
    { type:"mc", q:"To create Dorian from the parallel natural minor scale, raise the…", choices:["sixth scale degree","third scale degree","fourth scale degree"], answer:0,
      explain:"Then emphasize that raised 6th." },
    { type:"truefalse", q:"Locrian differs from the parallel natural minor scale in both its second and fifth degrees.", answer:true,
      explain:"Locrian has a lowered second and lowered (diminished) fifth compared with natural minor." },
    { type:"truefalse", q:"Compared with the parallel major scale, Mixolydian lowers the seventh scale degree.", answer:true,
      explain:"Mixolydian has a lowered seventh compared with the parallel major scale." },
    { gen:"mode-id", params:{set:"all", ask:"scale"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["♯4","Lydian"],["♭7","Mixolydian"],["raised 6","Dorian"],["♭2","Phrygian"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Characteristic Scale Degree", def:"The single scale degree that sets a mode apart from its reference major or natural minor scale."},
    {term:"Major-Type Modes", def:"Ionian, Lydian, Mixolydian — a major 3rd above the tonic."},
    {term:"Minor-Type Modes", def:"Dorian, Phrygian, Aeolian — a minor 3rd above the tonic."}
  ],
  mistakes:[],
  summary:[
    "✔ <b>Characteristic Notes</b><br><br><b>Major Family</b><br>Ionian = Major<br>Lydian = Major + ♯4<br>Mixolydian = Major + ♭7<br><br><b>Minor Family</b><br>Aeolian = Natural Minor<br>Dorian = Natural Minor + ♮6<br>Phrygian = Natural Minor + ♭2<br>Locrian = Natural Minor + ♭2 + ♭5",
    "✔ One changed note creates a new modal sound.",
    "✔ By ear: Find the tonic → identify the major/minor family → listen for the characteristic note."
  ],
  tips:[
    "Fast ID at the keyboard: play white-key scales from each note — D=Dorian, E=Phrygian, F=Lydian, G=Mixolydian, A=Aeolian.",
    "Without a clear tonic and its characteristic scale degree, a modal melody can slip into sounding like a related major or minor key.",
    "Best practice: play a scale, then play it again changing just one note — you will HEAR the mode change.",
    "Next lesson: scales that skip notes entirely — the pentatonics."
  ],
  rewards:{ badge:"Mode Painter", icon:"\u{1F3A8}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaQuizIntro:"Quiz: Establish the tonic, identify the modal family, and find the characteristic scale degree.",
  quiz:[
    { type:"mc", q:"What is a characteristic scale degree of a mode?", choices:["The single scale degree that sets the mode apart from its reference scale","The loudest note in the scale","A scale degree that must always be the tonic"], answer:0,
      explain:"The characteristic degree is what distinguishes closely related modes.", hint:"It sets the mode apart from a reference scale." },
    { type:"mc", q:"Compared with the parallel major scale, Lydian has…", choices:["a raised fourth","a lowered seventh","a lowered second"], answer:0,
      explain:"The raised fourth distinguishes Lydian from the parallel major scale.", hint:"Major-type mode with a raised fourth." },
    { type:"mc", q:"Compared with the parallel major scale, Mixolydian has…", choices:["a lowered seventh","a raised sixth","a raised fourth"], answer:0,
      explain:"The lowered seventh removes the leading tone found in the parallel major scale.", hint:"Major-type mode without a leading tone." },
    { type:"mc", q:"Compared with the parallel natural minor scale, Dorian has…", choices:["a raised sixth","a lowered second","a raised seventh"], answer:0,
      explain:"The raised sixth distinguishes Dorian from the parallel natural minor scale.", hint:"One RAISED note." },
    { type:"mc", q:"Compared with the parallel natural minor scale, Phrygian has…", choices:["a lowered second","a raised fourth","a raised sixth"], answer:0,
      explain:"The lowered second creates a half step between the tonic and second scale degree.", hint:"Minor-type mode with a lowered second." },
    { type:"mc", q:"How much usually has to change to turn one mode into a closely related mode?", choices:["Often just one scale degree","The entire scale","The tonic"], answer:0,
      explain:"Changing a single characteristic scale degree changes the modal sound.", hint:"The core idea of this lesson." },
    { type:"mc", q:"A scale using only white keys from G to the next G is…", choices:["G Mixolydian","G Ionian","G Dorian"], answer:0,
      explain:"B forms a major third above G, and F♮ is the lowered seventh compared with G major.", hint:"Check the 7th." },
    { type:"mc", q:"Identify the mode.",
      staff:{clef:"treble",notes:[{p:"E4",d:"q"},{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"A4",d:"q"},{p:"B4",d:"q"},{p:"C5",d:"q"},{p:"D5",d:"q"},{p:"E5",d:"q"}],width:400},
      choices:["E Phrygian — F♮ forms a minor second above the tonic","E major","E Lydian"], answer:0,
      explain:"The white-key collection from E to E contains F♮, a minor second above E, identifying E Phrygian.", hint:"Look at the second note." },
    { type:"truefalse", q:"Establishing the tonic and featuring a mode's characteristic scale degree help make the mode recognizable.", answer:true,
      explain:"Without a clear tonic and characteristic degree, a passage may sound like a related major or minor key.", hint:"Feature it." },
    { type:"truefalse", q:"Parallel Dorian and Aeolian scales differ only in their sixth scale degree.", answer:true,
      explain:"Dorian has a major sixth above the tonic, while Aeolian has a minor sixth.", hint:"The minor pair." },
    { type:"mc", q:"A major-type passage consistently uses a lowered seventh and clearly establishes its tonic. Which mode does it suggest?", choices:["Mixolydian","Ionian","Locrian"], answer:0,
      explain:"Mixolydian combines a major third with a lowered seventh.", hint:"The relaxed 7th." },
    { type:"mc", q:"Which strategy is most useful for identifying a mode by ear?", choices:["Identify the tonic, listen to the third, then locate the characteristic scale degree","Count the number of measures","Listen only to the rhythm"], answer:0,
      explain:"First establish the tonic and modal family; then listen for the degree that distinguishes the mode.", hint:"Tonic → third → characteristic degree." }
  ],
  miaPerfect:"Perfect score! You identified the modal families and their characteristic scale degrees by ear and on the staff.",
  miaPass:"You passed! Next, you will explore pentatonic scales.",
  mia:{
    hook:{ label:"the welcome",
      explain:"Melody B lowered its 7th (B→B♭), turning plain major into Mixolydian — one characteristic note changed the whole color.",
      play:()=>{[60,64,67,70,72,70,67,60].forEach((m,i)=>MFAudio.tone(m,.38,i*.32,.42));} },
    learn:{ label:"modes in practice",
      explain:"Two families by the 3rd. Change one degree from the reference scale: Lydian ♯4, Mixolydian ♭7 (from major); Dorian raised 6, Phrygian ♭2 (from natural minor). Identify by ear (tonic → 3rd → characteristic degree) and on the staff.",
      hint:"Change one degree, change the mode.",
      play:()=>{[57,59,60,62,64,66,67,69].forEach((m,i)=>MFAudio.tone(m,.36,i*.3,.4));} },
    example:{ label:"the examples",
      explain:"Example 1 features Dorian's raised 6th; example 2 leans on Mixolydian's ♭7 — each melody advertises its characteristic note." },
    game:{ label:"the games",
      explain:"Sprint the characteristic degrees, identify scales on cards, order the modal-melody steps, then match each mode to its characteristic degree.",
      hint:"Listen for the one changed degree." },
    quiz:{ label:"this question",
      explain:"Find the tonic first, check whether the 3rd is major or minor (family), then locate the one scale degree that differs from the reference major or natural minor scale.",
      play:()=>{[62,64,65,67,69,71,72,74].forEach((m,i)=>MFAudio.tone(m,.34,i*.28,.4));} }
  }
};
