/* Lesson 49 — Scale Degree Names (AEMT Book 2, Unit 12)
   Built from drafts/UNIT 12 – Lesson 49.md; AEMT p.76 verified by render.
   Core: Tonic(I) Supertonic(ii) Mediant(iii) Subdominant(IV) Dominant(V)
   Submediant(vi) Leading Tone(vii). Name logic: dominant = 5th ABOVE tonic,
   SUBdominant = 5th BELOW; mediant midway up, SUBmediant midway down;
   leading tone leads to tonic. Uses quiz.js v5.5 degree-name generator.
   NOTE: edit by FULL-FILE REWRITE only. */

/* degree climber: press each C-major key as its NAME is asked, in scale order */
function MF_L49_climb(container,fb){
  const DEG=[["Tonic",60],["Supertonic",62],["Mediant",64],["Subdominant",65],["Dominant",67],["Submediant",69],["Leading Tone",71],["Tonic",72]];
  let k=0,kb=null,pressed=[];
  container.innerHTML=`<div class="big-q l49-q" style="text-align:center"></div>
    <div class="l49-cnt" style="text-align:center;font-weight:800;min-height:24px;color:var(--correct)"></div>
    <div class="l49-kb"></div>`;
  const q=container.querySelector(".l49-q"), cnt=container.querySelector(".l49-cnt"), kbHolder=container.querySelector(".l49-kb");
  function ask(){ q.innerHTML=`In C major, press the <b>${DEG[k][0]}</b>${k===7?" (top of the ladder!)":""}.`; }
  kb=Keyboard.create(kbHolder,{start:60,octaves:1,labels:true,
    onKey:m=>{
      if((m-DEG[k][1])%12===0){ /* either C answers "Tonic" - degree identity is what counts */
        pressed.push(m); kb.mark(pressed); MFAudio.tone(m,.35);
        cnt.textContent=DEG.slice(0,k+1).map((d,ix)=>`${ix+1}=${d[0]==="Leading Tone"?"L.T.":d[0]}`).join("  ");
        k++;
        if(k>=DEG.length){ q.textContent="Every degree answers to its name!";
          fb(true,"✓ Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone, Tonic — the full ladder of titles, climbed in order."); }
        else ask(); }
      else { MFAudio.tone(40,.2);
        fb(false, k===0? "The Tonic is the keynote — in C major, that's C." :
          `${DEG[k][0]} is scale degree ${k+1} — one step up from ${DEG[k-1][0]}.`); }
    }});
  ask();
}

/* name-logic matcher: WHY each degree has its name */
function MF_L49_logic(container,fb){
  const ROUNDS=[
    {q:"DOMINANT (V) got its name because it is…",opts:["a 5th ABOVE the tonic","the loudest note","always a black key"],a:0,exp:"The dominating 5th above home."},
    {q:"SUBDOMINANT (IV) means…",opts:["the same distance BELOW the tonic as the dominant is above","slightly less dominant","under the staff"],a:0,exp:"'Sub' = below: a 5th UNDER the tonic."},
    {q:"MEDIANT (iii) is Latin for…",opts:["'in the middle' — midway between tonic and dominant","'medium loud'","'meadow'"],a:0,exp:"Midway up to the dominant."},
    {q:"SUBMEDIANT (vi) sits…",opts:["midway between tonic and SUBdominant, going down","just above the mediant","below the staff"],a:0,exp:"The mirror of the mediant, on the way DOWN."},
    {q:"LEADING TONE (vii) is named for…",opts:["its strong pull upward to the tonic","leading the orchestra","being the lowest note"],a:0,exp:"It leads — one half step below home."}];
  let i=0;
  container.innerHTML=`<div class="big-q l49-lq" style="text-align:center"></div><div class="choices l49-lch"></div>`;
  const q=container.querySelector(".l49-lq"), ch=container.querySelector(".l49-lch");
  function ask(){
    const cur=ROUNDS[i];
    q.innerHTML=`Name-story ${i+1} of ${ROUNDS.length}: ${cur.q}`;
    ch.innerHTML="";
    cur.opts.map((o,oi)=>({o,oi})).sort(()=>Math.random()-.5).forEach(({o,oi})=>{
      const b=document.createElement("button"); b.textContent=o;
      b.onclick=()=>{
        const c=ROUNDS[i];
        if(oi===c.a){ i++; MFAudio.yay();
          if(i>=ROUNDS.length){ ch.style.display="none"; q.textContent="Every name has its story!";
            fb(true,`✓ ${c.exp} The names all measure FROM THE TONIC — music's center of gravity.`); }
          else { fb(true,`✓ ${c.exp}`); setTimeout(ask,1200); } }
        else { MFAudio.tone(40,.2); fb(false,"Every name measures a distance (or direction) from the TONIC."); }
      };
      ch.appendChild(b); });
  }
  ask();
}

LESSON_CONTENT[49]={
  welcome:"Scale notes have numbers — today each one gets a NAME. \u{1F4DB}",
  hook:{
    say:"Listen: the scale's 7th note stops just below home… and hangs there. Feel the pull? Press play — the last note wants SO badly to resolve. <b>Which note does it pull toward?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-a">▶ The unfinished scale…</button><button class="play hk-b" style="display:none">▶ …resolved!</button></div>
          <div class="choices hk-ch" style="display:none"><button>Up to C — the keynote (home)</button><button>Down to A</button><button>It's fine where it is</button></div>`;
        const ch=container.querySelector(".hk-ch"), b2=container.querySelector(".hk-b");
        container.querySelector(".hk-a").onclick=()=>{
          [60,62,64,65,67,69,71].forEach((m,k)=>MFAudio.tone(m,k===6?1.2:.3,k*.35,k===6?.6:.45));
          setTimeout(()=>{ch.style.display="";b2.style.display="";},2900);
        };
        b2.onclick=()=>{ MFAudio.tone(71,.3,0,.5); MFAudio.tone(72,1.1,.35,.55); };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ B aches upward to C. That's why degree 7 is called the LEADING TONE — it leads home. Today, all seven degrees get their names: Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone.");
          else fb(false,"Press the resolve button — where did the tension go?");
        });
      } }
  },
  objectives:[
    "Name all seven scale degrees",
    "Match names to numerals (Tonic=I … Leading Tone=vii)",
    "Explain the name logic (dominant above, subdominant below)",
    "Identify each degree's note in C major",
    "Feel the leading tone's pull to the tonic",
    "Connect Tonic/Subdominant/Dominant to I/IV/V"
  ],
  steps:[
    { say:"The headline trio first — the degrees carrying the primary chords. Degree 1, the keynote, is the <b>TONIC (I)</b>: home base, the center of gravity. Degree 5, a 5th <b>above</b>, is the <b>DOMINANT (V)</b>. Degree 4 is the <b>SUBDOMINANT (IV)</b> — named because it lies a 5th <b>BELOW</b> the tonic ('sub' = under), the mirror of the dominant. \u{1F447} <b>Why is degree 4 called SUBdominant?</b>",
      show:{ type:"staff", spec:{clef:"grand",tempo:90,notes:[
        {p:"F3",d:"h",clef:"bass",x:150,label:"Subdominant — 5th below"},{p:"C4",d:"h",clef:"treble",x:345,label:"TONIC"},{p:"G4",d:"h",clef:"treble",x:540,label:"Dominant — 5th above"}],width:660} },
      try:{ type:"mc", choices:["It sits a 5th BELOW the tonic — the dominant's mirror","It is slightly weaker than the dominant","It sits just below the dominant"], answer:0,
        success:"✓ Remember: subdominant = same distance BELOW the tonic as the dominant is ABOVE — not 'just under the dominant'!",
        fail:"'Sub' measures from the TONIC, not from the dominant.",
        hint:"Dominant: 5th up. Subdominant: 5th…" } },
    { say:"The middle degrees: degree 3 is the <b>MEDIANT (iii)</b> — Latin for 'in the middle', midway from tonic UP to dominant. Degree 6 is the <b>SUBMEDIANT (vi)</b> — midway from tonic DOWN to subdominant. \u{1F447} <b>The mediant sits midway between…?</b>",
      try:{ type:"mc", choices:["Tonic and dominant (going up)","Tonic and subdominant (going down)","Dominant and octave"], answer:0,
        success:"✓ C→E→G: the mediant E splits tonic-to-dominant. (Its mirror, the SUBmediant, splits the way down.)",
        fail:"Mediant = middle of the UPWARD 5th.",
        hint:"C-?-G: what's in the middle?" } },
    { say:"The last two: degree 2, one step <b>above</b> the tonic, is the <b>SUPERTONIC (ii)</b> ('super' = above). Degree 7, one step <b>below</b>, is the <b>LEADING TONE (vii)</b> — because it strains to LEAD up into the tonic (you felt it in the hook!). \u{1F447} <b>Degree 7 is called the leading tone because…?</b>",
      try:{ type:"mc", choices:["It pulls strongly upward to the tonic","It comes first in the scale","It leads the left hand"], answer:0,
        success:"✓ One half step below home, it aches to arrive. (It's occasionally called the subtonic, but leading tone is the standard.)",
        fail:"Sing the hook again: B…C. What did the B want?",
        hint:"'Leading'… to where?" } },
    { say:"The full ladder, in degree order: <b>Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone</b> — then Tonic again. \u{1F447} <b>Climb it by name:</b>",
      try:{ type:"custom",
        hint:"Degrees 1-8 in C major: C D E F G A B C.",
        mount:(container,fb)=>MF_L49_climb(container,fb) } },
    { say:"The names aren't random — every one measures a <b>distance or direction from the tonic</b>. \u{1F447} <b>Match each name to its story:</b>",
      try:{ type:"custom",
        hint:"super = above · sub = below · mediant = middle · leading = pulling home.",
        mount:(container,fb)=>MF_L49_logic(container,fb) } },
    { say:"Last connection: the degrees carrying the <b>primary chords</b> are exactly the big three names — <b>Tonic (I), Subdominant (IV), Dominant (V)</b>. When musicians say 'go to the dominant', they mean the V chord. \u{1F447} <b>'The dominant chord' in C major means…?</b>",
      try:{ type:"mc", choices:["The G triad (V)","The F triad (IV)","The loudest chord"], answer:0,
        success:"✓ Dominant = degree 5 = G in C major = the V chord. Names, numerals, and chords now speak one language. Unit 12 has one lesson left: V gets a 7th!",
        fail:"Dominant = degree 5. Which triad sits there?",
        hint:"Lesson 48: V = ?" } }
  ],
  examples:[
    { caption:"The C major scale with every degree's name and numeral — play and recite: Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone, Tonic.",
      staff:{clef:"treble",tempo:100,notes:[
        {p:"C4",d:"q",label:"Tonic I"},{p:"D4",d:"q",label:"Supertonic ii"},{p:"E4",d:"q",label:"Mediant iii"},{p:"F4",d:"q",label:"Subdom. IV"},{p:"G4",d:"q",label:"Dominant V"},{p:"A4",d:"q",label:"Submed. vi"},{p:"B4",d:"q",label:"L. Tone vii"},{p:"C5",d:"q",label:"Tonic I"}],width:660} },
    { caption:"The tonic as the CENTER: subdominant a 5th below, dominant a 5th above — the arrangement that named them.",
      staff:{clef:"grand",tempo:80,notes:[
        {p:"F3",d:"h",clef:"bass",label:"IV — 5th below"},{p:"C4",d:"h",clef:"treble",label:"I — TONIC"},{p:"G4",d:"h",clef:"treble",label:"V — 5th above"}],width:480} }
  ],
  games:[
    { type:"gen-race", title:"Game 1 · Title Sprint (45s)",
      intro:"Degree numbers flash — name their titles at speed!",
      miaIntro:"Know every degree's name! \u{1F4DB}",
      spec:{gen:"degree-name", params:{ask:"name"}, seconds:45},
      result:(score)=>score>=8?score+" names at full speed!":null },
    { type:"gen-race", title:"Game 2 · Find the Note (10 rounds)",
      intro:"Reverse: given the NAME, find its note in C major!",
      miaIntro:"Names to notes — go! \u{1F50D}",
      spec:{gen:"degree-name", params:{ask:"note"}, rounds:10},
      result:(score)=>score>=8?"Every title found its note!":null },
    { type:"key-climb", title:"Game 3 · Ladder of Titles",
      intro:"Climb C major pressing each degree as its name flashes — full ladder, fast!",
      miaIntro:"Tonic to Tonic without a stumble! \u{1FA9C}",
      spec:{seq:[60,62,64,65,67,69,71,72], names:["Tonic","Supertonic","Mediant","Subdominant","Dominant","Submediant","Leading Tone","Tonic"], start:60, octaves:1,
        title:"Press the C major scale as the names flash"},
      result:(score)=>score!==null?"The ladder of titles is climbed!":null },
    { type:"order-tap", title:"Game 4 · Name-Order Challenge",
      intro:"Tap the seven degree names in scale order before the clock runs out!",
      miaIntro:"One through seven, by title! \u{23F1}",
      spec:{sequence:["Tonic","Supertonic","Mediant","Subdominant","Dominant","Submediant","Leading Tone"], timer:25,
        title:"Tap the degree names in order, 1 → 7!"},
      result:(score)=>score!==null?"Perfect order — all seven names in place!":null }
  ],
  practiceIntro:"21 practice questions — names, numerals, notes, and the name-logic. Answer right and the next appears automatically!",
  practice:[
    { gen:"degree-name", params:{ask:"name"}, count:5 },
    { gen:"degree-name", params:{ask:"note"}, count:4 },
    { gen:"term-match", params:{subject:"term", pool:[["Tonic","degree 1 — the keynote"],["Dominant","degree 5 — a 5th above the tonic"],["Subdominant","degree 4 — a 5th below the tonic"],["Leading Tone","degree 7 — pulls up to the tonic"],["Mediant","degree 3 — midway tonic→dominant"]], reverse:true}, count:3 },
    { type:"mc", q:"The keynote of a scale is called the…", choices:["tonic","dominant","mediant"], answer:0,
      explain:"Degree 1 — home." },
    { type:"mc", q:"The tone a 5th ABOVE the tonic is the…", choices:["dominant","subdominant","supertonic"], answer:0,
      explain:"Degree 5 = dominant (V)." },
    { type:"mc", q:"The tone a 5th BELOW the tonic is the…", choices:["subdominant","dominant","submediant"], answer:0,
      explain:"'Sub' = below — degree 4." },
    { type:"mc", q:"'Super' in supertonic means…", choices:["above","louder","excellent"], answer:0,
      explain:"One step OVER the tonic — degree 2." },
    { type:"mc", q:"In C major, the mediant is…", choices:["E","G","A"], answer:0,
      explain:"Degree 3 — midway C→G." },
    { type:"mc", q:"In C major, the submediant is…", choices:["A","E","B"], answer:0,
      explain:"Degree 6 — midway going DOWN C→F." },
    { type:"truefalse", q:"The leading tone tends to lead upward to the tonic.", answer:true,
      explain:"A half step below home, it pulls hard." },
    { type:"truefalse", q:"The subdominant is named for sitting just below the dominant.", answer:false,
      explain:"Watch out: it's a 5th BELOW THE TONIC — the dominant's mirror." },
    { type:"mc", q:"Which degrees carry the primary chords?", choices:["Tonic, Subdominant, Dominant","Supertonic, Mediant, Submediant","Tonic, Mediant, Dominant"], answer:0,
      explain:"I, IV, V — degrees 1, 4, 5." }
  ],
  miaQuizIntro:"All seven degrees by name — final roll call!",
  quiz:[
    { type:"mc", q:"Scale degree 1 is called the…", choices:["tonic","dominant","mediant","leading tone"], answer:0,
      explain:"The keynote — home base.", hint:"The key is named after it." },
    { type:"mc", q:"Scale degree 5 is called the…", choices:["dominant","subdominant","supertonic","submediant"], answer:0,
      explain:"A 5th above the tonic.", hint:"The V chord's home." },
    { type:"mc", q:"Scale degree 4 is called the…", choices:["subdominant","dominant","mediant","supertonic"], answer:0,
      explain:"A 5th BELOW the tonic.", hint:"'Sub' = below." },
    { type:"mc", q:"Scale degree 2 is called the…", choices:["supertonic","subtonic","mediant","dominant"], answer:0,
      explain:"One step above ('super') the tonic.", hint:"Just over home." },
    { type:"mc", q:"Scale degree 3 is called the…", choices:["mediant","median","submediant","leading tone"], answer:0,
      explain:"'In the middle' — between tonic and dominant.", hint:"Latin for middle." },
    { type:"mc", q:"Scale degree 6 is called the…", choices:["submediant","supertonic","subdominant","subtonic"], answer:0,
      explain:"Midway from tonic DOWN to subdominant.", hint:"The mediant's mirror." },
    { type:"mc", q:"Scale degree 7 is called the…", choices:["leading tone","supertonic","dominant","mediant"], answer:0,
      explain:"It leads up to the tonic (sometimes 'subtonic').", hint:"You felt its pull in the hook." },
    { type:"truefalse", q:"The subdominant is the same distance below the tonic as the dominant is above it.", answer:true,
      explain:"Both are 5ths from home.", hint:"The mirror image." },
    { type:"truefalse", q:"In C major, the dominant note is F.", answer:false,
      explain:"Dominant = degree 5 = G. (F is the subdominant.)", hint:"Count: C D E F G." },
    { type:"mc", q:"In C major, the leading tone is…", choices:["B","A","D","F"], answer:0,
      explain:"Degree 7 — a half step under C.", hint:"One key below home." },
    { type:"mc", q:"Which numerals match Tonic-Subdominant-Dominant?", choices:["I - IV - V","I - II - III","ii - IV - vi"], answer:0,
      explain:"The primary-chord trio by another name.", hint:"Lesson 48's primary triads." },
    { type:"mc", q:"'Go to the dominant chord' in C major means play…", choices:["G-B-D","F-A-C","C-E-G"], answer:0,
      explain:"Dominant = degree 5 = the G triad (V).", hint:"Degree 5's triad." },
    /* generated */
    { gen:"degree-name", params:{ask:"name"}, count:3 },
    { gen:"degree-name", params:{ask:"note"}, count:3 },
    { gen:"term-match", params:{subject:"term", pool:[["Tonic","degree 1 — home"],["Dominant","degree 5 — a 5th above"],["Subdominant","degree 4 — a 5th below"],["Leading Tone","degree 7 — pulls home"]], reverse:true}, count:2 }
  ],
  vocabulary:[
    {term:"Tonic (I)", def:"Scale degree 1 — the keynote, the lowest and highest tone of the scale, music's home base."},
    {term:"Supertonic (ii) · Mediant (iii)", def:"Degree 2, a step above the tonic; degree 3, midway between tonic and dominant."},
    {term:"Subdominant (IV) · Dominant (V)", def:"Degree 4, a 5th BELOW the tonic; degree 5, a 5th ABOVE it — the two pillars flanking home."},
    {term:"Submediant (vi) · Leading Tone (vii)", def:"Degree 6, midway from tonic down to subdominant; degree 7, the half-step-below note that leads back to the tonic."}
  ],
  mistakes:[],
  summary:[
    "✔ The ladder: <b>Tonic, Supertonic, Mediant, Subdominant, Dominant, Submediant, Leading Tone</b> (degrees 1-7).",
    "✔ Name logic measures from the TONIC: dominant a 5th <b>above</b>, subdominant a 5th <b>below</b>; mediant midway up, submediant midway down.",
    "✔ <b>Leading tone</b> = a half step below home, pulling upward relentlessly.",
    "✔ In C major: C D E F G A B = Tonic through Leading Tone.",
    "✔ Tonic-Subdominant-Dominant = the primary-chord degrees I, IV, V."
  ],
  tips:[
    "Mnemonic mirror: dominant/subdominant and mediant/submediant are two pairs of reflections around the tonic.",
    "Say degrees as names during scale practice: 'Tonic… supertonic…' — the titles stick in a week.",
    "Composers speak this language constantly: 'rest on the dominant', 'pivot on the submediant' — now you're fluent.",
    "Next lesson: the dominant grows a 7th — the mighty V7 chord."
  ],
  rewards:{ badge:"Degree Namer", icon:"\u{1F4DB}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score — every degree named without a stumble! \u{1F389}",
  miaPass:"Passed! Recite the ladder once more before bed: Tonic, Supertonic, Mediant…",
  mia:{
    hook:{ label:"the welcome",
      explain:"The scale stopped on B — the LEADING TONE — which aches to resolve up to C, the tonic. That pull is the strongest force in tonal music.",
      play:()=>{[60,62,64,65,67,69,71].forEach((m,k)=>MFAudio.tone(m,k===6?1:.28,k*.32,k===6?.6:.45));MFAudio.tone(72,.9,2.6,.55);} },
    learn:{ label:"scale degree names",
      explain:"Tonic(1), Supertonic(2), Mediant(3), Subdominant(4), Dominant(5), Submediant(6), Leading Tone(7). All names measure from the tonic: super=above, sub=below, mediant=middle, leading=pulling home.",
      hint:"T-S-M-S-D-S-L.",
      play:()=>{[60,67].forEach((m,k)=>MFAudio.tone(m,.5,k*.5,.5));} },
    example:{ label:"the examples",
      explain:"Example 1 labels the whole ladder; example 2 shows the tonic as center with its two flanking 5ths — the diagram that explains the names." },
    game:{ label:"the games",
      explain:"Sprint the names, find the notes, climb the named ladder, then put all seven in order.",
      hint:"When stuck, rebuild from the three anchors: Tonic 1, Subdominant 4, Dominant 5." },
    quiz:{ label:"this question",
      explain:"Recite and match: 1 Tonic, 2 Supertonic, 3 Mediant, 4 Subdominant, 5 Dominant, 6 Submediant, 7 Leading Tone.",
      play:()=>{MFAudio.tone(71,.3,0,.5);MFAudio.tone(72,.7,.35,.55);} }
  }
};
