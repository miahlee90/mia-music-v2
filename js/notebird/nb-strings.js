/* Note Bird — locale strings (EN base). Adding Korean/Spanish later = one new
   dict (NB_STR.ko / NB_STR.es) with the same keys; components never hardcode
   student-facing sentences. {name} style placeholders are filled by nbt().
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */

const NB_STR={ en:{
  /* setup screen */
  "setup.title":"Set up your flight",
  "setup.mode":"Mode",
  "setup.mode.practice":"Practice",
  "setup.mode.level":"Level Game",
  "setup.mode.practiceDesc":"No timer — the bird waits for you. Retry wrong answers, use landmark hints.",
  "setup.mode.levelDesc":"Levels 1–10, the bird gets faster each level. {lives} mistakes allowed — how far can you fly?",
  "setup.clef":"Clef",
  "setup.clef.auto":"Auto",
  "setup.range":"Note range",
  "setup.rangeFrom":"from",
  "setup.rangeTo":"to",
  "setup.quick":"Quick picks",
  "setup.sets":"Lines & spaces sets",
  "setup.rounds":"Rounds",
  "setup.sound":"Note sound",
  "setup.music":"Background birdsong",
  "setup.music.on":"On",
  "setup.music.off":"Off",
  "setup.hints":"Landmark hints",
  "setup.hints.on":"On",
  "setup.hints.off":"Off",
  "setup.start":"Start",
  "setup.answerNote":"Answer with the A–G buttons or your computer keyboard (A–G keys).",
  "setup.best":"Best here: Level {level}",
  "setup.bestSuccess":"Best here: completed Level 10 ✓",
  "setup.signedIn":"👤 {name} ({cls}) — your flights are saved under your name",
  "setup.signIn":"👤 Student sign-in",
  "setup.signInWhy":"Sign in (same as lessons) to keep flight records under your name.",

  /* sets */
  "set.lines":"lines",
  "set.spaces":"spaces",

  /* sound modes */
  "sound.off":"Visual only",
  "sound.after":"Hear each note once (as the bird passes it)",
  "sound.appear":"Look & Listen — play when the bird appears",

  /* HUD / play */
  "hud.level":"Level {n}",
  "hud.note":"Note {i} of {total}",
  "hud.round":"Round {n} of {total}",
  "hud.streak":"Streak {streak}",
  "hud.pause":"Pause",
  "hud.resume":"Resume",
  "hud.paused":"Paused",
  "hud.quit":"End round",
  "hud.hint":"Hint",
  "hud.replay":"Hear Note Again",
  "hud.musicOff":"Birdsong off",
  "hud.musicOn":"Birdsong on",
  "hud.question":"Name the note before the bird reaches the tree!",
  "hud.questionPractice":"Name this note — take your time.",
  "hud.questionExtreme":"Read quickly — keep the bird flying!",
  "hud.getReady":"Get ready…",
  "hud.levelUp":"Level {n}! The bird speeds up…",
  "hud.timerLabel":"Distance to Tree",
  "hud.heartGain":"+1 ❤️",

  /* feedback — correct */
  "fb.correctIs":"Correct — this note is {name}.",
  /* feedback — wrong */
  "fb.practiceWrong":"Check the clef and try again.",
  "fb.wrongLife":"Not {picked} — {left} left!",
  /* feedback — timeout (gentle: bump + cartoon stars, never a hurt bird) */
  "fb.timeout":"That note was {name}. Let's try another.",
  "fb.lastLife":"Careful — last chance!",

  /* hints */
  "hint.isLandmark":"That IS a landmark — {lm}!",
  "hint.fromLandmark":"Find {lm}, then count {n} {steps} {dir}.",
  "hint.step":"step","hint.steps":"steps",
  "hint.up":"up","hint.down":"down",
  "hint.mnemonic":"Remember: {word}, from the bottom up.",

  /* results — a RECORD of the flight, not a test */
  "res.title":"Flight record",
  "res.successTitle":"You made it — Level 10 complete! 🎉",
  "res.reached":"Reached Level {level}",
  "res.newBest":"New best for these settings!",
  "res.condition":"Conditions",
  "res.notesRead":"Notes read",
  "res.accuracy":"Accuracy",
  "res.avgTime":"Average response",
  "res.fastest":"Fastest response",
  "res.bestStreak":"Best streak",
  "res.correct":"Correct",
  "res.wrong":"Wrong",
  "res.timeouts":"Time-outs",
  "res.hints":"Hints used",
  "res.missedTitle":"Notes to review",
  "res.noMissed":"You read every note correctly — nothing to review!",
  "res.missedTimes":"missed {n}×",
  "res.playAgain":"Fly again",
  "res.practiceMissed":"Practice Missed Notes",
  "res.changeSettings":"Change settings",
  "res.byClef":"By clef",
  "res.lines":"Line notes",
  "res.spaces":"Space notes",

  /* Mia (guide character) lines */
  "mia.intro":"Welcome to {title}! Read the note and tap its letter before the bird reaches the tree. Pick your clef and range, then fly!",
  "mia.levelIntro":"Level game: the bird gets a little faster every level. Three misses and the flight ends — good luck!",
  "mia.practiceIntro":"Practice mode: no rush! Read each note, and ask me for a landmark hint if you get stuck.",
  "mia.success":"Level 10 complete — what a flight! 🌟 Try a wider range next?",
  "mia.goodRun":"Level {level} — great flying! One more try?",
  "mia.earlyRun":"Level {level} for now — try Practice mode with the missed notes, then fly again!",
  "mia.practiceGood":"Lovely practice — your note reading is getting strong!",
  "mia.practiceMore":"Good practice! Review the notes below and try another round.",

  /* misc */
  "misc.treble":"Treble",
  "misc.bass":"Bass",
  "misc.grand":"Grand Staff",
  "misc.middleC":"Middle C",
  "misc.lives":"chances",

  /* landmarks */
  "lm.middleC":"Middle C",
  "lm.trebleG":"Treble G (line 2)",
  "lm.bassF":"Bass F (line 4)",
  "lm.topLineF":"Top-line F",
  "lm.bottomLineG":"Bottom-line G"
}};

const NBI18N=(()=>{
  let lang="en";
  function t(key,vars){
    let s=(NB_STR[lang]&&NB_STR[lang][key])??NB_STR.en[key]??key;
    if(vars) for(const v in vars) s=s.split("{"+v+"}").join(vars[v]);
    return s;
  }
  return {t,setLang:l=>{lang=l;},lang:()=>lang};
})();
const nbt=NBI18N.t;
