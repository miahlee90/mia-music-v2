/* Note Bird (WORKING TITLE — change NB_CONFIG.TITLE only, never hardcode elsewhere)
   Music Theory Game Center · staff-reading game — DATA LAYER.
   Everything gameplay-tunable lives HERE, not in UI components:
   custom-range rules, line/space sets, level speed table, lives,
   background-music toggle default, landmarks, scoring.
   Instructor design (2026-07-17): the game is NOT a test — a run records
   "under these conditions the student reached level N". 3 mistakes allowed,
   speed rises with each level, completing level 10 = success.
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NB_CONFIG={
  TITLE:"Note Bird",          /* working title — single source of truth */
  VERSION:"0.2.0-prototype",
  STORAGE_KEY:"nb-progress-v1" /* separate from all mf-* keys: never touches lesson records */
};

const NBData=(()=>{
  const LETTERS=["C","D","E","F","G","A","B"];
  const P2SEMI={C:0,D:2,E:4,F:5,G:7,A:9,B:11};

  /* ---------- pitch math (mirrors staff.js conventions: treble bottom line E4, bass G2) ---------- */
  function parse(p){ const m=String(p).match(/^([A-G])(#{1,2}|b{1,2})?(\d)$/);
    if(!m) return null;
    return {letter:m[1], acc:m[2]||"", octave:+m[3]}; }
  function midiOf(p){ const x=parse(p); if(!x) return null;
    const accOff={"":0,"#":1,"##":2,"b":-1,"bb":-2}[x.acc];
    return 12*(x.octave+1)+P2SEMI[x.letter]+accOff; }
  function dia(p){ const x=parse(p); return x.octave*7+LETTERS.indexOf(x.letter); }
  function fromDia(idx){ return LETTERS[((idx%7)+7)%7]+Math.floor(idx/7); }
  function baseIdx(clef){ return clef==="bass"?18:30; } /* diatonic idx of bottom line */

  /* staff position of a pitch in a clef: idx 0 = bottom line, +1 per line/space upward */
  function staffPos(p,clef){
    const idx=dia(p)-baseIdx(clef);
    const onLine=idx%2===0;
    let ledgers=0, ledgerDir=null;
    if(idx<=-2){ ledgers=Math.floor(-idx/2); ledgerDir="below"; }
    else if(idx>=10){ ledgers=Math.floor((idx-8)/2); ledgerDir="above"; }
    return {idx,onLine,ledgers,ledgerDir};
  }

  /* Build the full note object the game consumes. entry: "C4" or {p,clef}.
     poolClef: "treble" | "bass" | "grand" (grand splits at Middle C:
     C4 and above → treble, below → bass, unless the entry overrides). */
  function buildNote(entry,poolClef){
    const p=typeof entry==="string"?entry:entry.p;
    const x=parse(p); if(!x) return null;
    const midi=midiOf(p);
    let clef=(typeof entry==="object"&&entry.clef)||null;
    if(!clef) clef= poolClef==="grand" ? (midi>=60?"treble":"bass") : poolClef;
    const pos=staffPos(p,clef);
    return {
      id:p+"@"+clef,
      letter:x.letter, accidental:x.acc, octave:x.octave,
      sci:p, midi, clef,
      staffIdx:pos.idx, onLine:pos.onLine,
      ledgers:pos.ledgers, ledgerDir:pos.ledgerDir,
      audio:midi,
      accepted:{ letter:[x.letter], pitch:[p] }, /* two scoring modes, kept separate */
      enabled:true
    };
  }

  /* ---------- custom ranges (instructor 2026-07-17: student/teacher picks the span) ---------- */
  const RANGE_MIN="C2", RANGE_MAX="C6";   /* pickable natural-note span */
  function naturalsBetween(a,b){
    let ia=dia(a), ib=dia(b);
    if(ia>ib){ const t=ia; ia=ib; ib=t; }
    const out=[]; for(let i=ia;i<=ib;i++) out.push(fromDia(i));
    return out;
  }
  function rangeChoices(){ return naturalsBetween(RANGE_MIN,RANGE_MAX); }
  /* auto clef for a set of pitches: fits under Middle C → bass, above → treble, else grand */
  function autoClef(pitches){
    const ms=pitches.map(midiOf);
    const lo=Math.min.apply(null,ms), hi=Math.max.apply(null,ms);
    if(hi<=60) return "bass";
    if(lo>=60) return "treble";
    return "grand";
  }
  /* one-tap ranges, instructor's list & order (2026-07-17), each with its clef.
     #1 = C2–C6, the full grand staff (2 ledgers below bass … 2 above treble);
     C2 confirmed by the instructor. This is also the game's DEFAULT range. */
  const RANGE_QUICK=[
    {a:"C2",b:"C6",clef:"grand"},
    {a:"C4",b:"G4",clef:"treble"},
    {a:"C3",b:"G3",clef:"bass"},
    {a:"G3",b:"G4",clef:"grand"},
    {a:"C5",b:"G5",clef:"treble"},
    {a:"A3",b:"A5",clef:"treble"},
    {a:"E2",b:"E4",clef:"bass"}
  ];

  /* ---------- lines-only / spaces-only sets (mnemonics, verified standard) ---------- */
  const LINE_SPACE_SETS=[
    {id:"face",  clef:"treble", word:"FACE",  kindKey:"set.spaces", pitches:["F4","A4","C5","E5"]},
    {id:"egbdf", clef:"treble", word:"EGBDF", kindKey:"set.lines",  pitches:["E4","G4","B4","D5","F5"]},
    {id:"aceg",  clef:"bass",   word:"ACEG",  kindKey:"set.spaces", pitches:["A2","C3","E3","G3"]},
    {id:"gbdfa", clef:"bass",   word:"GBDFA", kindKey:"set.lines",  pitches:["G2","B2","D3","F3","A3"]}
  ];

  /* ---------- level system: speed RISES with the level (time-based, never px-based) ----------
     seconds = full flight time from spawn to gate at that level.
     Complete level `max` → success. `lives` mistakes end the run (wrong press or time-out). */
  const LEVELS={
    max:10, notesPerLevel:5, lives:3,
    heartPerLevel:true, maxLives:12,  /* instructor 2026-07-17: +1 heart on every level-up */
    seconds:[12,10.5,9,8,7,6.2,5.5,4.8,4.2,3.6]
  };
  function secondsForLevel(l){ return LEVELS.seconds[Math.min(LEVELS.seconds.length-1,Math.max(0,l-1))]; }
  const PREP_MS=900;          /* staff readable BEFORE the bird starts flying */

  /* ---------- shared visual asset: THE red Note Bird (original character) ----------
     One markup string used by the page header, the Game Center hub and the
     in-game bird, so the character is identical everywhere. Fills are inline
     presentation attributes → consistent even on pages without notebird.css.
     The bird faces LEFT (it flies right → left). */
  const BIRD_SVG=
    `<g class="nb-birdbody">
      <path class="nb-tail" fill="#c23d4d" stroke="#a83345" stroke-width="1.2" d="M12 -1 L27 -10 L23 0 L27 8 Z"/>
      <ellipse class="nb-body" fill="#e05252" stroke="#b23a3a" stroke-width="1.6" cx="0" cy="0" rx="15" ry="12"/>
      <path class="nb-crest" fill="#c23d4d" d="M-7 -10 Q-3 -17 3 -11 Q-1 -13 -3 -12 Q-5 -12 -7 -10 Z"/>
      <ellipse class="nb-belly" fill="#ffe3c8" cx="-4" cy="4.5" rx="7.5" ry="5.5"/>
      <path class="nb-wing" fill="#c23d4d" stroke="#a83345" stroke-width="1.2" d="M1 -3 Q13 -15 23 -7 Q15 3 3 4 Z"/>
      <circle class="nb-eye" fill="#1c1e2e" cx="-8" cy="-4.5" r="2.7"/>
      <circle class="nb-glint" fill="#fff" cx="-8.9" cy="-5.4" r="1"/>
      <path class="nb-beak" fill="#E8A33D" stroke="#cf8f2e" stroke-width="1" d="M-14.5 -3 L-23 0 L-14.5 3.6 Z"/>
    </g>`;
  function birdMark(w){
    return `<svg class="nb-mark" width="${w}" height="${Math.round(w*0.74)}" viewBox="-27 -20 58 42" aria-hidden="true">${BIRD_SVG}</svg>`;
  }

  /* ---------- feedback timing (adjustable; UI reads these, never hardcodes) ---------- */
  const FEEDBACK={
    correctMs:1500,          /* level/game: pause on "Correct — this note is D." */
    practiceCorrectMs:2300,  /* practice: time to see the keyboard reveal */
    timeoutMs:2600,          /* time to read "That note was D." after the bump */
    wrongPauseMs:900         /* practice: bird pauses after a wrong answer */
  };

  /* ---------- sound options ---------- */
  const SOUND_MODES=[
    {id:"off",    nameKey:"sound.off"},
    {id:"after",  nameKey:"sound.after"},   /* play the note once after answering (default) */
    {id:"appear", nameKey:"sound.appear"}   /* Look & Listen: play once when the bird appears */
  ];
  const MUSIC_DEFAULT=true;   /* original generated chip-tune loop (no copyrighted material) */

  /* ---------- scoring / records ---------- */
  const SCORING={
    answerMode:"letter",            /* "letter" (octave-agnostic) | "pitch" (exact octave) */
    stars:[{min:90,stars:3},{min:80,stars:2},{min:70,stars:1}], /* practice-mode summary only */
    historyCap:200
  };

  /* ---------- landmark notes (Practice-mode hints) ---------- */
  const LANDMARKS=[
    {p:"C4", labelKey:"lm.middleC"},
    {p:"G4", labelKey:"lm.trebleG"},
    {p:"F3", labelKey:"lm.bassF"},
    {p:"F5", labelKey:"lm.topLineF"},
    {p:"G2", labelKey:"lm.bottomLineG"}
  ];

  /* condition key: "under WHICH conditions did the run happen" (best-level records) */
  function conditionKey(cond){ return cond.setId?("set:"+cond.setId):("range:"+cond.a+"-"+cond.b+"@"+cond.clef); }

  /* sanity checks — run from console: NBData.validate() */
  function validate(){
    const out=[];
    const t=buildNote("C4","treble"), b=buildNote("C4","bass"), g=buildNote("G4","treble"), f=buildNote("F3","bass");
    if(!(t.ledgers===1&&t.ledgerDir==="below")) out.push("C4 treble must sit on 1 ledger below");
    if(!(b.ledgers===1&&b.ledgerDir==="above")) out.push("C4 bass must sit on 1 ledger above");
    if(!(g.staffIdx===2&&g.onLine)) out.push("G4 must be treble line 2");
    if(!(f.staffIdx===6&&f.onLine)) out.push("F3 must be bass line 4");
    if(midiOf("C4")!==60||midiOf("G4")!==67||midiOf("F3")!==53) out.push("MIDI mapping broken");
    const r=naturalsBetween("A2","C4"); /* A2 B2 C3 D3 E3 F3 G3 A3 B3 C4 */
    if(r.length!==10||r[0]!=="A2"||r[9]!=="C4") out.push("naturalsBetween A2-C4 wrong: "+r.join(","));
    if(autoClef(["C4","G4"])!=="treble") out.push("autoClef C4-G4 should be treble");
    if(autoClef(["A2","C4"])!=="bass") out.push("autoClef A2-C4 should be bass");
    if(autoClef(["G3","G5"])!=="grand") out.push("autoClef G3-G5 should be grand");
    LINE_SPACE_SETS.forEach(s=>s.pitches.forEach(p=>{ if(!parse(p)) out.push(s.id+": bad pitch "+p); }));
    if(LEVELS.seconds.length!==LEVELS.max) out.push("LEVELS.seconds must list one speed per level");
    return out.length?out:["ok"];
  }

  return {LEVELS,SOUND_MODES,SCORING,LANDMARKS,PREP_MS,MUSIC_DEFAULT,FEEDBACK,
          RANGE_MIN,RANGE_MAX,RANGE_QUICK,LINE_SPACE_SETS,BIRD_SVG,birdMark,
          buildNote,midiOf,dia,fromDia,parse,staffPos,
          naturalsBetween,rangeChoices,autoClef,secondsForLevel,conditionKey,validate};
})();
