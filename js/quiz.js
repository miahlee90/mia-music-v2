/* Music Fundamentals — quiz engine (DD-07, DD-19 hybrid generators, DD-20 completion codes) v5.8
   v2: wrong-answer review list, explicit percentage, drill supports fixed questions.
   v3 (Milestone 2): "line-space" generator supports params:{clef:"bass"}.
   v4 (Milestone 3): adds "note-value" (identify whole/half/quarter or its beats)
   and "rhythm-count" (count the total beats of a short rhythm) generators.
   v4.1 (Milestone 3b): note-value supports params.kind:"rest"; adds
   "measure-complete" (is this measure full?) and "measure-count" (count measures).
   v4.2 (instructor fix): compact chip layout for ALL short answers (<=14 chars,
   was <=3) so answer choices stay scannable; beat-count questions say "in 4/4 time".
   v5 (Units 3-6): note-value supports eighths ("8") and dotted tokens ("h.","q.");
   NEW generators: term-match (Italian terms / symbols ↔ meanings),
   step-type (half vs whole step), enharmonic (same key, two names).
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */
const Quiz=(()=>{
  const SALT="MF-MIA-2026";
  const LETTERS=["C","D","E","F","G","A","B"];
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  const RANGES={ treble:["E4","F4","G4","A4","B4","C5","D5","E5","F5"],
                 bass:["G2","A2","B2","C3","D3","E3","F3","G3","A3"] };
  const LS_POS={ treble:{lines:["E4","G4","B4","D5","F5"], spaces:["F4","A4","C5","E5"]},
                 bass:  {lines:["G2","B2","D3","F3","A3"], spaces:["A2","C3","E3","G3"]} };
  const VAL_NAME={w:"Whole Note",h:"Half Note",q:"Quarter Note","8":"Eighth Note","16":"Sixteenth Note","h.":"Dotted Half Note","q.":"Dotted Quarter Note","8.":"Dotted Eighth Note"};
  const VAL_BEATS={w:4,h:2,q:1,"8":0.5,"16":0.25,"h.":3,"q.":1.5,"8.":0.75};
  const BEATLBL={0.25:"\u00bc beat",0.5:"\u00bd beat",0.75:"\u00be beat",1:"1 beat",1.5:"1\u00bd beats",2:"2 beats",3:"3 beats",4:"4 beats"};
  const tokDot=t=>String(t).endsWith("."), tokBase=t=>String(t).replace(".","");
  const generators={
    "note-name": p=>{
      const pool=p.pool||RANGES[p.clef||"treble"];
      const note=pick(pool), letter=note[0];
      const wrong=shuffle(LETTERS.filter(l=>l!==letter)).slice(0,3);
      const choices=shuffle([letter,...wrong]);
      return { type:"mc", q:"What is the name of this note?",
        staff:{clef:p.clef==="grand"?"grand":(p.clef||"treble"),notes:[{p:note,d:"q",clef:p.noteClef||(p.clef==="bass"?"bass":"treble")}],width:260},
        choices, answer:choices.indexOf(letter),
        explain:`This note is ${letter} — count lines and spaces from the bottom to check.`,
        hint:"Count up from the bottom line, alternating line-space-line-space." };
    },
    "line-space": p=>{
      const clef=(p&&p.clef)==="bass"?"bass":"treble";
      const POS=LS_POS[clef];
      const isLine=Math.random()<.5, n=isLine?1+Math.floor(Math.random()*5):1+Math.floor(Math.random()*4);
      const correct=(isLine?"Line ":"Space ")+n;
      const others=[]; for(let i=1;i<=5;i++){ if(!(isLine&&i===n)) others.push("Line "+i); if(i<=4&&!(!isLine&&i===n)) others.push("Space "+i); }
      const choices=shuffle([correct,...shuffle(others).slice(0,3)]);
      const y=isLine? {p:POS.lines[n-1],d:"q"} : {p:POS.spaces[n-1],d:"q"};
      return { type:"mc", q:"This note sits on which line or space? (count from the bottom)",
        staff:{clef,notes:[y],width:260},
        choices, answer:choices.indexOf(correct),
        explain:`It's ${correct}. Lines and spaces are always counted from the bottom up.`,
        hint:"Bottom line is line 1; the space just above it is space 1." };
    },
    "click-key": p=>{
      const letter=pick(p.letters||["C","D","E","F","G","A","B"]);
      const oct=pick(p.octaves||[4]);
      return { type:"click-key", q:`Click the key ${letter}${oct} on the piano.`,
        kb:{start:60,octaves:2,labels:false}, target:MFAudio.midi(letter+oct),
        explain:`${letter} is found by its position in the black-key groups — C sits left of the 2-black-key group.`,
        hint:"Find the group of TWO black keys: the white key on its left is C. Count letters from there." };
    },
    "higher-lower": ()=>{ const a=57+Math.floor(Math.random()*12); const b=a+(Math.random()<.5?-1:1)*(2+Math.floor(Math.random()*10));
      return { type:"listen", q:"Listen: was the SECOND sound higher or lower?",
        play:()=>{MFAudio.tone(a,.5,0);MFAudio.tone(b,.5,.65);},
        choices:["Higher","Lower"], answer:b>a?0:1,
        explain:"Higher pitches sound brighter and thinner; lower ones deeper and warmer.",
        hint:"Hum both sounds — your voice moves the same direction as the pitch." };
    },
    /* v4/v5 — identify a note value (or rest) by sight
       (params:{values:["w","h","q","8","h.","q."], ask:"name"|"beats", kind:"note"|"rest"}) */
    "note-value": p=>{
      const values=(p&&p.values)||["w","h","q"];
      const isRest=(p&&p.kind)==="rest";
      const v=pick(values), askBeats=(p&&p.ask)==="beats"||((!p||!p.ask)&&Math.random()<.5);
      const pitch=pick(["G4","B4","D5","F4","A4","E4","C5"]);
      const NAMES=isRest?{w:"Whole Rest",h:"Half Rest",q:"Quarter Rest","8":"Eighth Rest","16":"Sixteenth Rest"}:VAL_NAME;
      const SHAPE=isRest
        ?{w:"it hangs BELOW the 4th line (the hole)",h:"it sits ON the 3rd line (the hat)",q:"the squiggly symbol","8":"the little seven with a dot","16":"the little seven with TWO hooks"}
        :{w:"hollow head with NO stem",h:"hollow head WITH a stem",q:"filled head with a stem","8":"filled head with a stem and a flag","h.":"a half note PLUS a dot (2 + 1)","q.":"a quarter note PLUS a dot (1 + \u00bd)","16":"filled head, stem, and TWO flags","8.":"an eighth note PLUS a dot (\u00bd + \u00bc)"};
      let choices,correct,q;
      function build(correctVal,all){
        const others=shuffle(all.filter(x=>x!==correctVal));
        return shuffle([correctVal,...others.slice(0,3)]);
      }
      if(askBeats){
        q=isRest?"In 4/4 time, how many beats of SILENCE does this rest receive?":"In 4/4 time, how many beats does this note receive?";
        correct=BEATLBL[VAL_BEATS[v]];
        let all=[...new Set(values.map(x=>BEATLBL[VAL_BEATS[x]]))];
        if(all.length<3) all=[...new Set([...all,...Object.values(BEATLBL)])];
        choices=build(correct,all);
      } else {
        q=isRest?"What kind of rest is this?":"What kind of note is this?";
        correct=NAMES[v];
        let all=[...new Set(values.map(x=>NAMES[x]))];
        if(all.length<3) all=[...new Set([...all,...Object.values(NAMES)])];
        choices=build(correct,all);
      }
      return { type:"mc", q,
        staff:{clef:"treble",notes:[isRest?{rest:tokBase(v)}:{p:pitch,d:tokBase(v),dot:tokDot(v)}],width:240},
        choices, answer:choices.indexOf(correct),
        explain:`It's a ${NAMES[v]} — ${SHAPE[v]||""} — worth ${BEATLBL[VAL_BEATS[v]]}${isRest?" of silence":""}.`,
        hint:isRest?"Hole hangs down (whole), hat sits on top (half), squiggle = quarter, little seven = eighth."
                   :"Check the head, the stem, any flag — and don\u2019t miss a DOT (dot = +half the value)." };
    },
    /* v4 — count the total beats of a short rhythm (params:{maxNotes:3, values:["w","h","q"]}) */
    "rhythm-count": p=>{
      const values=(p&&p.values)||["h","q"];
      const maxNotes=(p&&p.maxNotes)||3;
      const n=1+Math.floor(Math.random()*maxNotes);
      const pat=[]; for(let i=0;i<n;i++) pat.push(pick(values));
      const total=pat.reduce((s,d)=>s+VAL_BEATS[d],0);
      const wrongs=new Set();
      [total-2,total-1,total+1,total+2].forEach(x=>{ if(x>=1&&x!==total) wrongs.add(x); });
      const choices=shuffle([String(total),...shuffle([...wrongs]).slice(0,3).map(String)]);
      return { type:"mc", q:"Count the beats: how many beats do these notes add up to?",
        staff:{clef:"treble",notes:pat.map(d=>({p:"B4",d})),width:260},
        choices, answer:choices.indexOf(String(total)),
        explain:`${pat.map(d=>VAL_NAME[d]+" ("+VAL_BEATS[d]+")").join(" + ")} = ${total} beat${total>1?"s":""}.`,
        hint:"Whole = 4, Half = 2, Quarter = 1 — add them one note at a time." };
    },
    /* v4.1 — is this measure complete? (params:{beats:4, rests:false}) */
    "measure-complete": p=>{
      const target=(p&&p.beats)||4, useRests=!!(p&&p.rests);
      const complete=Math.random()<.5;
      const sum=complete?target:1+Math.floor(Math.random()*(target-1));
      const toks=[]; let r=sum;
      while(r>0){ const opts=["q"]; if(r>=2)opts.push("h"); if(r>=4&&sum===4)opts.push("w");
        const v=pick(opts); toks.push(v); r-=VAL_BEATS[v]; }
      const items=toks.map(v=>(useRests&&Math.random()<.35)?{rest:v}:{p:"B4",d:v});
      const mathTxt=toks.map(v=>VAL_BEATS[v]).join(" + ")+" = "+sum;
      return { type:"truefalse",
        q:`True or false: this measure is COMPLETE (exactly ${target} beats).`,
        staff:{clef:"treble",time:target+"/4",notes:[...items,{bar:"final"}],width:300},
        answer:complete,
        explain:`Add the values: ${mathTxt} beat${sum>1?"s":""} — ${complete?"exactly "+target+", complete.":"it still needs "+(target-sum)+" more."}`,
        hint:"Add every note (and rest) — the total must match the top number." };
    },
    /* v4.1 — how many measures? (params:{min:2,max:4}) */
    "measure-count": p=>{
      const min=(p&&p.min)||2, max=(p&&p.max)||4;
      const n=min+Math.floor(Math.random()*(max-min+1));
      const FILL=[["w"],["h","h"]];
      const items=[];
      for(let m=1;m<=n;m++){ pick(FILL).forEach(d=>items.push({p:"B4",d})); items.push({bar:m<n?"single":"final"}); }
      const wrongs=[]; for(let x=min;x<=max+1;x++) if(x!==n) wrongs.push(String(x));
      const choices=shuffle([String(n),...shuffle(wrongs).slice(0,3)]);
      return { type:"mc", q:"How many measures does this staff contain?",
        staff:{clef:"treble",notes:items,width:340},
        choices, answer:choices.indexOf(String(n)),
        explain:`${n} measures — count the spaces BETWEEN the bar lines; the double bar closes the last one.`,
        hint:"Count the containers, not the lines." };
    }

    ,
    /* v5 — term/symbol ↔ meaning (params:{pool:[[term,meaning],…], subject:"dynamic marking"}) */
    "term-match": p=>{
      const pool=(p&&p.pool)||[];
      const [term,meaning]=pick(pool);
      const rev=(p&&p.reverse)? Math.random()<.5 : false;
      const correct=rev? term : meaning;
      const wrongs=shuffle(pool.filter(x=>x[0]!==term)).slice(0,3).map(x=>rev?x[0]:x[1]);
      const choices=shuffle([correct,...wrongs]);
      return { type:"mc",
        q:rev? `Which ${(p&&p.subject)||"term"} means \u201c${meaning}\u201d?` : `What does ${term} mean?`,
        choices, answer:choices.indexOf(correct),
        explain:`${term} = ${meaning}.`,
        hint:(p&&p.hint)||"Think back to the matching cards." };
    },
    /* v5 — half step or whole step (params:{show:"staff"|"none"}) */
    "step-type": p=>{
      const HALF=[["E4","F4"],["B4","C5"],["C4","C#4"],["F4","F#4"],["A4","Bb4"],["D4","Eb4"]];
      const WHOLE=[["C4","D4"],["F4","G4"],["A4","B4"],["D4","E4"],["G4","A4"]];
      const isHalf=Math.random()<.5;
      const [a,b]=pick(isHalf?HALF:WHOLE);
      const name=x=>x.replace(/(\d)/,"").replace("#","\u266f").replace("b","\u266d");
      const correct=isHalf?"Half step":"Whole step";
      const choices=shuffle(["Half step","Whole step"]);
      return { type:"mc", q:`From ${name(a)} to ${name(b)} is a \u2026`,
        staff:(p&&p.show)==="none"?undefined:{clef:"treble",notes:[{p:a,d:"q"},{p:b,d:"q"}],width:240},
        choices, answer:choices.indexOf(correct),
        explain:`${name(a)} \u2192 ${name(b)} = ${correct.toLowerCase()} — ${isHalf?"the very next key, nothing in between":"two half steps, one key is skipped"}.`,
        hint:"Picture the keyboard: is there a key BETWEEN them?" };
    },
    /* v5.2 — name the major key from a key signature
       (params:{kind:"sharp"|"flat"|"both", max:1..4, clef:"treble"|"bass"|"both"}) */
    "keysig-id": p=>{
      const SH=[["G",1],["D",2],["A",3],["E",4],["B",5],["F#",6],["C#",7]], FL=[["F",1],["Bb",2],["Eb",3],["Ab",4],["Db",5],["Gb",6],["Cb",7]];
      const kind=(p&&p.kind)||"both", max=(p&&p.max)||4;
      const pool=(kind==="sharp"?SH:kind==="flat"?FL:[...SH,...FL]).filter(k=>k[1]<=max);
      const [key,n]=pick(pool);
      const isFlat=FL.some(k=>k[0]===key);
      const disp=k=>k.replace("b","\u266d").replace("#","\u266f")+" Major";
      const clef=(p&&p.clef&&p.clef!=="both")? p.clef : pick(["treble","bass"]);
      const all=[...new Set((kind==="sharp"?SH:kind==="flat"?FL:[...SH,...FL]).map(k=>disp(k[0])))];
      const correct=disp(key);
      const choices=shuffle([correct,...shuffle(all.filter(c=>c!==correct)).slice(0,3)]);
      const ORDS=["F\u266f","C\u266f","G\u266f","D\u266f","A\u266f","E\u266f","B\u266f"], ORDF=["B\u266d","E\u266d","A\u266d","D\u266d","G\u266d","C\u266d","F\u266d"];
      const expl=isFlat
        ? (n===1? "One flat (B\u266d) alone is the exception — it is always F Major."
                : `The flats are ${ORDF.slice(0,n).join(", ")} — the NEXT-TO-LAST flat (${ORDF[n-2]}) names the key: ${correct}.`)
        : `The sharps are ${ORDS.slice(0,n).join(", ")} — one half step UP from the last sharp (${ORDS[n-1]}) gives ${correct}.`;
      return { type:"mc", q:"Name this major key signature.",
        staff:{clef, keysig:key, notes:[], width:220},
        choices, answer:choices.indexOf(correct),
        explain:expl,
        hint:isFlat? "Next-to-last flat = the key name (one flat alone = F Major)."
                   : "Find the last sharp, then go up one half step." };
    },
    /* v5.3 — name the interval between two notes (Unit 8, L33)
       (params:{min:1,max:8, kind:"melodic"|"harmonic"|"both", ask:"number"|"kind", clef}) */
    "interval-id": p=>{
      const NAMES={1:"Unison",2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",7:"7th",8:"Octave"};
      const min=(p&&p.min)||1, max=(p&&p.max)||8;
      const kind=(p&&p.kind)||"both";
      const num=min+Math.floor(Math.random()*(max-min+1));
      const L=["C","D","E","F","G","A","B"];
      const clef=(p&&p.clef)||"treble";
      const roots=clef==="bass"? ["C3","D3","E3","F3","G3"] : ["C4","D4","E4","F4","G4"];
      const root=pick(roots);
      const ri=L.indexOf(root[0]), oct=+root[1];
      const ui=ri+num-1, upper=L[ui%7]+(oct+Math.floor(ui/7));
      const harm=kind==="harmonic"||(kind==="both"&&Math.random()<.5);
      const notes=harm? [{p:root,d:"w"},{p:upper,d:"w",chord:true}] : [{p:root,d:"h"},{p:upper,d:"h"}];
      const staff={clef,notes,width:220};
      const countTxt=L.slice(ri,ri+num).map((l,i2)=>`${L[(ri+i2)%7]}(${i2+1})`).join(" ");
      if((p&&p.ask)==="kind"){
        const correct=harm?"Harmonic":"Melodic";
        const choices=shuffle(["Melodic","Harmonic"]);
        return { type:"mc", q:"Is this interval MELODIC or HARMONIC?",
          staff, choices, answer:choices.indexOf(correct),
          explain:harm? "The notes are stacked and sound TOGETHER — a harmonic interval."
                      : "The notes come one AFTER another — a melodic interval.",
          hint:"Stacked = together = harmonic; side by side = one after another = melodic." };
      }
      const correct=NAMES[num];
      const all=Object.values(NAMES);
      const choices=shuffle([correct,...shuffle(all.filter(c=>c!==correct)).slice(0,3)]);
      return { type:"mc", q:"Name this interval. (Count BOTH notes!)",
        staff, choices, answer:choices.indexOf(correct),
        explain:`${countTxt} — a ${correct}${num===1?" (both notes identical)":num===8?" (same letter, an octave apart)":""}.`,
        hint:"Start on the lower note as 1 and count every letter name up to the top note." };
    },
    /* v5.3 — navigate the circle of fifths (Unit 8, L34)
       (params:{maxMove:3}) */
    "circle-nav": p=>{
      const CW=["C","G","D","A","E","B","F\u266f","C\u266f"], CCW=["C","F","B\u266d","E\u266d","A\u266d","D\u266d","G\u266d","C\u266d"];
      const cw=Math.random()<.5;
      const seq=cw?CW:CCW, dir=cw?"CLOCKWISE":"COUNTERCLOCKWISE";
      const maxMove=(p&&p.maxMove)||3;
      const move=1+Math.floor(Math.random()*maxMove);
      const start=Math.floor(Math.random()*(seq.length-move));
      const target=seq[start+move];
      const path=seq.slice(start,start+move+1);
      const wrongs=shuffle([...CW.slice(1),...CCW.slice(1)].filter(k=>k!==target)).slice(0,3);
      const choices=shuffle([target+" Major",...wrongs.map(w=>w+" Major")]);
      return { type:"mc",
        q:`Circle of fifths: start at ${seq[start]} Major and move ${move} step${move>1?"s":""} ${dir}. Where do you land?`,
        choices, answer:choices.indexOf(target+" Major"),
        explain:`${dir.toLowerCase()} adds one ${cw?"sharp":"flat"} per step: ${path.join(" \u2192 ")}.`,
        hint:cw? "Clockwise = up a 5th, +1 sharp each step." : "Counterclockwise = +1 flat each step." };
    },
    /* v5.4 — interval QUALITY (Unit 9, L35-37): P/M/m/A/d via half-step math
       (params:{min:1,max:8, qualities:["P","M","m","A","d"], kind:"melodic"|"harmonic"|"both",
                ask:"full"|"quality", clef:"treble"|"bass"}) */
    "interval-quality": p=>{
      const NAMES={1:"Unison",2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",7:"7th",8:"Octave"};
      const BASE=[0,0,2,4,5,7,9,11,12];           // natural (major-scale) semitones, index=number
      const PERF=[1,4,5,8];
      const QL={P:"Perfect",M:"Major",m:"Minor",A:"Augmented",d:"Diminished"};
      const qs=(p&&p.qualities)||["P","M"];
      const min=(p&&p.min)||2, max=(p&&p.max)||8;
      const clef=(p&&p.clef)||"treble";
      const L=["C","D","E","F","G","A","B"];
      const roots=clef==="bass"? ["C3","D3","E3","F3","G3","A3"] : ["C4","D4","E4","F4","G4","A4"];
      const NAT={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
      let num,q,root,upper,acc,tries=0;
      while(tries++<60){
        num=min+Math.floor(Math.random()*(max-min+1));
        const isP=PERF.includes(num);
        const ok=qs.filter(x=> isP? (x!=="M"&&x!=="m") : x!=="P");
        if(!ok.length) continue;
        q=ok[Math.floor(Math.random()*ok.length)];
        if(num===1&&q==="d") continue;            // unison cannot shrink
        root=roots[Math.floor(Math.random()*roots.length)];
        const ri=L.indexOf(root[0]), oct=+root[1];
        const ui=ri+num-1, ul=L[ui%7], uoct=oct+Math.floor(ui/7);
        const natDist=(NAT[ul]+12*uoct)-(NAT[root[0]]+12*oct);
        const target=BASE[num]+(q==="A"?1:q==="d"?(isP?-1:-2):q==="m"?-1:0);
        acc=target-natDist;                        // accidental on the upper note
        if(Math.abs(acc)>1) continue;              // avoid double sharps/flats on staff
        upper=ul+(acc===1?"#":acc===-1?"b":"")+uoct;
        break;
      }
      const harm=(p&&p.kind)==="harmonic"||(((p&&p.kind)||"both")==="both"&&Math.random()<.5);
      const notes=harm? [{p:root,d:"w"},{p:upper,d:"w",chord:true}] : [{p:root,d:"h"},{p:upper,d:"h"}];
      const abbr=(qq,nn)=>qq+nn;                   // e.g. M3, P5, m6, A4, d5
      const full=`${QL[q]} ${NAMES[num]}`;
      const disp=x=>x.replace(/(\d)/,"").replace("#","♯").replace("b","♭");
      const halfSteps=BASE[num]+(q==="A"?1:q==="d"?(PERF.includes(num)?-1:-2):q==="m"?-1:0);
      if((p&&p.ask)==="quality"){
        const pool=[...new Set(qs.map(x=>QL[x]))];
        while(pool.length<3){ const extra=Object.values(QL).find(v=>!pool.includes(v)); if(!extra)break; pool.push(extra); }
        const others=pool.filter(v=>v!==QL[q]).sort(()=>Math.random()-.5).slice(0,3);
        const choices=[QL[q],...others].sort(()=>Math.random()-.5);
        return { type:"mc", q:`What is the QUALITY of this ${NAMES[num].toLowerCase()==="unison"?"unison":NAMES[num]}?`,
          staff:{clef,notes,width:220}, choices, answer:choices.indexOf(QL[q]),
          explain:`${disp(root)} → ${disp(upper)} spans ${halfSteps} half steps = ${full} (${abbr(q,num)}).`,
          hint:"Count half steps on the keyboard, then compare with the major-scale size." };
      }
      const all=[];
      qs.forEach(x=>{ for(let n2=min;n2<=max;n2++){
        const isP2=PERF.includes(n2);
        if(isP2&&(x==="M"||x==="m")) continue;
        if(!isP2&&x==="P") continue;
        if(n2===1&&x==="d") continue;
        all.push(abbr(x,n2));
      }});
      const correct=abbr(q,num);
      const wrongs=all.filter(c=>c!==correct).sort(()=>Math.random()-.5).slice(0,3);
      const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
      return { type:"mc", q:"Name this interval — quality AND number.",
        staff:{clef,notes,width:220}, choices, answer:choices.indexOf(correct),
        explain:`${disp(root)} → ${disp(upper)}: count letters = ${NAMES[num]}; count half steps = ${halfSteps} = ${full} (${correct}).`,
        hint:"First count the letter names for the NUMBER, then count half steps for the QUALITY." };
    },
    /* v5.4 — solfège syllables, movable Do (Unit 9, L38)
       (params:{keys:["C","G","F"], ask:"syllable"|"note"|"both"}) */
    "solfege-id": p=>{
      const SYL=["Do","Re","Mi","Fa","Sol","La","Ti","Do"];
      const SCALES={C:["C","D","E","F","G","A","B","C"],
                    G:["G","A","B","C","D","E","F♯","G"],
                    F:["F","G","A","B♭","C","D","E","F"],
                    D:["D","E","F♯","G","A","B","C♯","D"]};
      const keys=(p&&p.keys)||["C","G"];
      const key=keys[Math.floor(Math.random()*keys.length)];
      const sc=SCALES[key]||SCALES.C;
      const i=Math.floor(Math.random()*7);        // degrees 1-7 (8 duplicates Do)
      const mode=(p&&p.ask)==="both"? (Math.random()<.5?"syllable":"note") : ((p&&p.ask)||"syllable");
      if(mode==="syllable"){
        const correct=SYL[i];
        const wrongs=[...new Set(SYL)].filter(s=>s!==correct).sort(()=>Math.random()-.5).slice(0,3);
        const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
        return { type:"mc", q:`In ${key} Major (movable Do), which syllable is sung on ${sc[i]}?`,
          choices, answer:choices.indexOf(correct),
          explain:`${key} Major: ${sc.slice(0,7).map((n,j)=>`${n}=${SYL[j]}`).join(", ")}.`,
          hint:`Do is always the keynote — here Do = ${key}. Count up from there.` };
      }
      const correct=sc[i];
      const wrongs=sc.slice(0,7).filter(n=>n!==correct).sort(()=>Math.random()-.5).slice(0,3);
      const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
      return { type:"mc", q:`In ${key} Major (movable Do), which NOTE is “${SYL[i]}”?`,
        choices, answer:choices.indexOf(correct),
        explain:`${SYL[i]} is scale degree ${i+1} of ${key} Major → ${correct}.`,
        hint:`Do = ${key}. Step up the ${key} major scale one syllable at a time.` };
    },
    /* v5.5 — root-position triads (Unit 12, L47-48)
       (params:{ask:"root"|"numeral", clef:"treble"|"bass"}) — C-major diatonic triads */
    "triad-id": p=>{
      const L=["C","D","E","F","G","A","B"];
      const ROMAN={C:"I",D:"ii",E:"iii",F:"IV",G:"V",A:"vi",B:"vii"};
      const clef=(p&&p.clef)||"treble";
      const roots=clef==="bass"? ["C3","D3","E3","F3","G3"] : ["C4","D4","E4","F4","G4","A4"];
      const root=roots[Math.floor(Math.random()*roots.length)];
      const ri=L.indexOf(root[0]), oct=+root[1];
      const third=L[(ri+2)%7]+(oct+Math.floor((ri+2)/7));
      const fifth=L[(ri+4)%7]+(oct+Math.floor((ri+4)/7));
      const staff={clef,notes:[{p:root,d:"w"},{p:third,d:"w",chord:true},{p:fifth,d:"w",chord:true}],width:200};
      if((p&&p.ask)==="numeral"){
        const correct=ROMAN[root[0]];
        const wrongs=Object.values(ROMAN).filter(r=>r!==correct).sort(()=>Math.random()-.5).slice(0,3);
        const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
        return { type:"mc", q:"In the key of C major, which ROMAN NUMERAL names this triad?",
          staff, choices, answer:choices.indexOf(correct),
          explain:`Root ${root[0]} = scale degree ${ri+1} of C major → ${correct}.`,
          hint:"Count the root's scale degree from C, then use the matching numeral." };
      }
      const correct=root[0];
      const wrongs=L.filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);
      const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
      return { type:"mc", q:"Name the ROOT of this root-position triad.",
        staff, choices, answer:choices.indexOf(correct),
        explain:`Bottom note of a root-position triad = the root: ${correct} (${correct}-${third[0]}-${fifth[0]}).`,
        hint:"In root position, the root is the LOWEST note." };
    },
    /* v5.8 (Book 3, Unit 15) — mode-id: the seven modes.
       params:{set:"major"|"minor"|"all", ask:"scale"|"recipe"|"both"} */
    "mode-id": p=>{
      const MODES={
        "Ionian":   {base:"major", ps:["C4","D4","E4","F4","G4","A4","B4","C5"], recipe:"the major scale itself"},
        "Mixolydian":{base:"major", ps:["C4","D4","E4","F4","G4","A4","Bb4","C5"], recipe:"a major scale with the 7th LOWERED a half step"},
        "Lydian":   {base:"major", ps:["C4","D4","E4","F#4","G4","A4","B4","C5"], recipe:"a major scale with the 4th RAISED a half step"},
        "Aeolian":  {base:"minor", ps:["A3","B3","C4","D4","E4","F4","G4","A4"], recipe:"the natural minor scale itself"},
        "Dorian":   {base:"minor", ps:["A3","B3","C4","D4","E4","F#4","G4","A4"], recipe:"a natural minor scale with the 6th RAISED a half step"},
        "Phrygian": {base:"minor", ps:["A3","Bb3","C4","D4","E4","F4","G4","A4"], recipe:"a natural minor scale with the 2nd LOWERED a half step"},
        "Locrian":  {base:"minor", ps:["A3","Bb3","C4","D4","Eb4","F4","G4","A4"], recipe:"a natural minor scale with the 2nd AND 5th lowered a half step"}};
      const set=(p&&p.set)||"all";
      const names=Object.keys(MODES).filter(n=>set==="all"||MODES[n].base===set);
      const name=names[Math.floor(Math.random()*names.length)];
      const M=MODES[name];
      let mode=(p&&p.ask)||"scale";
      if(mode==="both") mode=Math.random()<.5?"scale":"recipe";
      if(mode==="recipe"){
        const correct=M.recipe;
        const ws=names.filter(n=>n!==name).sort(()=>Math.random()-.5).slice(0,3).map(n=>MODES[n].recipe);
        const choices=[correct,...ws].sort(()=>Math.random()-.5);
        return { type:"mc", q:`The ${name} mode is…`,
          choices, answer:choices.indexOf(correct),
          explain:`${name}: ${M.recipe}.`,
          hint:M.base==="major"?"It's one of the major-related modes.":"It's one of the minor-related modes." };
      }
      const keynote=M.base==="major"?"C":"A";
      const choices=names.slice().sort(()=>Math.random()-.5).slice(0,Math.min(4,names.length));
      if(!choices.includes(name)){ choices[Math.floor(Math.random()*choices.length)]=name; }
      const staff={clef:"treble",notes:M.ps.map(pp=>({p:pp,d:"q"})),width:420};
      return { type:"mc", q:`Name this mode (built on ${keynote}).`,
        staff, choices, answer:choices.indexOf(name),
        explain:`${name} on ${keynote}: ${M.recipe}.`,
        hint:M.base==="major"?"Compare it with the plain major scale — which degree moved?":"Compare it with natural minor — which degree moved?" };
    },
    /* v5.7 (Book 3, Unit 14) — rel-key: relative major/minor pairs.
       params:{ask:"min"|"maj"|"sig"|"both"} */
    "rel-key": p=>{
      const PAIRS=[["C","A"],["G","E"],["D","B"],["A","F#"],["E","C#"],["F","D"],["Bb","G"],["Eb","C"],["Ab","F"]];
      const SIG={C:"no sharps or flats",G:"1 sharp",D:"2 sharps",A:"3 sharps",E:"4 sharps",F:"1 flat",Bb:"2 flats",Eb:"3 flats",Ab:"4 flats"};
      const pr=PAIRS[Math.floor(Math.random()*PAIRS.length)];
      let mode=(p&&p.ask)||"min";
      if(mode==="both") mode=["min","maj","sig"][Math.floor(Math.random()*3)];
      const wrongs=arr=>arr.sort(()=>Math.random()-.5).slice(0,3);
      if(mode==="maj"){
        const correct=pr[0]+" major";
        const ws=wrongs(PAIRS.map(x=>x[0]+" major").filter(x=>x!==correct));
        const choices=[correct,...ws].sort(()=>Math.random()-.5);
        return { type:"mc", q:`Which MAJOR key is the relative major of ${pr[1]} minor?`,
          choices, answer:choices.indexOf(correct),
          explain:`Up a minor 3rd from ${pr[1]}: ${pr[0]} major (same key signature: ${SIG[pr[0]]}).`,
          hint:"Relative major = a minor 3rd ABOVE the minor keynote." };
      }
      if(mode==="sig"){
        const correct=pr[1]+" minor";
        const ws=wrongs(PAIRS.map(x=>x[1]+" minor").filter(x=>x!==correct));
        const choices=[correct,...ws].sort(()=>Math.random()-.5);
        const staff= pr[0]==="C"? undefined : {clef:"treble",keysig:pr[0],notes:[],width:180};
        return { type:"mc", q: pr[0]==="C"? "A key signature with NO sharps or flats belongs to which MINOR key?" : "This key signature belongs to which MINOR key?",
          staff, choices, answer:choices.indexOf(correct),
          explain:`${SIG[pr[0]]} = ${pr[0]} major — whose relative minor is ${pr[1]} minor (6th degree of ${pr[0]} major).`,
          hint:"Name the MAJOR key first, then go to its 6th degree." };
      }
      const correct=pr[1]+" minor";
      const ws=wrongs(PAIRS.map(x=>x[1]+" minor").filter(x=>x!==correct));
      const choices=[correct,...ws].sort(()=>Math.random()-.5);
      return { type:"mc", q:`Which minor key is the RELATIVE MINOR of ${pr[0]} major?`,
        choices, answer:choices.indexOf(correct),
        explain:`The 6th degree of ${pr[0]} major is ${pr[1]} → ${pr[1]} minor (same signature: ${SIG[pr[0]]}).`,
        hint:"Count up to the 6th scale degree — or down a minor 3rd from the keynote." };
    },
    /* v5.7 (Book 3, Unit 14) — triad-quality: major/minor/augmented/diminished.
       params:{quals:["M","m","A","d"], ask:"quality"|"symbol"} */
    "triad-quality": p=>{
      const SPELL={
        C:{M:["C4","E4","G4"], m:["C4","Eb4","G4"], A:["C4","E4","G#4"], d:["C4","Eb4","Gb4"]},
        F:{M:["F4","A4","C5"], m:["F4","Ab4","C5"], A:["F4","A4","C#5"], d:["F4","Ab4","Cb5"]},
        G:{M:["G4","B4","D5"], m:["G4","Bb4","D5"], A:["G4","B4","D#5"], d:["G4","Bb4","Db5"]},
        D:{M:["D4","F#4","A4"], m:["D4","F4","A4"], A:["D4","F#4","A#4"], d:["D4","F4","Ab4"]}};
      const QNAME={M:"Major",m:"Minor",A:"Augmented",d:"Diminished"};
      const QSYM={M:"",m:"m",A:"+",d:"\u00b0"};
      const QEXPL={M:"major 3rd + minor 3rd (M3 below, P5 frame)",m:"minor 3rd + major 3rd (lowered 3rd)",
        A:"two MAJOR 3rds — the 5th is raised",d:"two MINOR 3rds — the 5th is lowered"};
      const quals=(p&&p.quals)||["M","m","A","d"];
      const roots=Object.keys(SPELL);
      const root=roots[Math.floor(Math.random()*roots.length)];
      const q0=quals[Math.floor(Math.random()*quals.length)];
      const ps=SPELL[root][q0];
      const staff={clef:"treble",notes:ps.map((pp,ix)=>ix===0?{p:pp,d:"w"}:{p:pp,d:"w",chord:true}),width:200};
      const nice=s=>s.replace(/([A-G])b/,"$1\u266d").replace(/([A-G])#/,"$1\u266f").replace(/\d/,"");
      const spelled=ps.map(nice).join("-");
      if((p&&p.ask)==="symbol"){
        const correct=root+QSYM[q0];
        const choices=quals.map(q2=>root+QSYM[q2]);
        return { type:"mc", q:"Which chord symbol names this triad?",
          staff, choices, answer:choices.indexOf(correct),
          explain:`${spelled} = ${QNAME[q0]}: ${QEXPL[q0]}. Symbol: ${correct||root}.`,
          hint:"Letter only = major, m = minor, + = augmented, \u00b0 = diminished." };
      }
      const choices=quals.map(q2=>QNAME[q2]);
      return { type:"mc", q:"What QUALITY is this triad?",
        staff, choices, answer:choices.indexOf(QNAME[q0]),
        explain:`${spelled}: ${QEXPL[q0]} → ${QNAME[q0]}.`,
        hint:"Check the 3rd first (major/minor), then the 5th (perfect/raised/lowered)." };
    },
    /* v5.6 (Book 3, Unit 13) — inversion-id: triad & V7 chord positions.
       params:{subject:"triad"|"v7"|"both", ask:"position"|"figure"|"both", clef} */
    "inversion-id": p=>{
      const L=["C","D","E","F","G","A","B"];
      const TRIADS={C:["C","E","G"],F:["F","A","C"],G:["G","B","D"],D:["D","F#","A"],A:["A","C#","E"],Bb:["Bb","D","F"]};
      const SEVENTHS={G7:["G","B","D","F"],C7:["C","E","G","Bb"],D7:["D","F#","A","C"],A7:["A","C#","E","G"],F7:["F","A","C","Eb"]};
      const subject=(p&&p.subject)==="both"? (Math.random()<.5?"triad":"v7") : ((p&&p.subject)||"triad");
      const ask=(p&&p.ask)==="both"? (Math.random()<.5?"position":"figure") : ((p&&p.ask)||"position");
      const clef=(p&&p.clef)||"treble";
      const SET=subject==="v7"? SEVENTHS : TRIADS;
      const names=Object.keys(SET);
      const name=names[Math.floor(Math.random()*names.length)];
      const tones=SET[name];
      const k=Math.floor(Math.random()*tones.length); /* 0=root pos, 1=1st inv, ... */
      /* close-position voicing from the chosen bass upward */
      const order=tones.slice(k).concat(tones.slice(0,k));
      let oct=clef==="bass"?2:4, prevIdx=-99;
      const ps=order.map(t=>{
        let idx=L.indexOf(t[0])+7*oct;
        while(idx<=prevIdx){ oct++; idx=L.indexOf(t[0])+7*oct; }
        prevIdx=idx;
        return t+oct;
      });
      /* keep the chord inside a friendly range */
      const topIdx=L.indexOf(order[order.length-1][0])+7*(+ps[ps.length-1].slice(-1));
      if(clef!=="bass"&&topIdx>=7*6){ /* above B5: drop an octave */
        for(let i=0;i<ps.length;i++) ps[i]=ps[i].slice(0,-1)+(+ps[i].slice(-1)-1);
      }
      const staff={clef,notes:ps.map((pp,ix)=>ix===0?{p:pp,d:"w"}:{p:pp,d:"w",chord:true}),width:200};
      const POS3=["Root position","1st inversion","2nd inversion"];
      const POS4=["Root position","1st inversion","2nd inversion","3rd inversion"];
      const FIG3=["5/3 (or none)","6","6/4"];
      const FIG4=["7","6/5","4/3","4/2"];
      const bassRole=["root","3rd","5th","7th"][k];
      const chordLabel=subject==="v7"? name+" (a V7-type chord)" : name+" major";
      if(ask==="figure"){
        const FIGS=subject==="v7"? FIG4 : FIG3;
        const correct=FIGS[k];
        const choices=FIGS.slice();
        return { type:"mc", q:`Figured bass: which figure fits this ${subject==="v7"?"seventh chord":"triad"} position?`,
          staff, choices, answer:choices.indexOf(correct),
          explain:`The bass is the ${bassRole} → ${POS4[k]} → ${correct}. (${chordLabel}: ${tones.join("-")})`,
          hint:"Find the BASS note first — the figures describe intervals above it." };
      }
      const POS=subject==="v7"? POS4 : POS3;
      const correct=POS[k];
      const choices=POS.slice();
      return { type:"mc", q:`What position is this ${subject==="v7"?"V7-type seventh chord":"major triad"} in?`,
        staff, choices, answer:choices.indexOf(correct),
        explain:`Lowest note = the ${bassRole} of ${chordLabel} → ${correct}. The letters (${tones.join("-")}) never changed.`,
        hint:"Only the BASS note decides the position — name the chord from its stacked-3rds spelling first." };
    },
    /* v5.5 — scale degree names (Unit 12, L49)
       (params:{ask:"name"|"note"|"both"}) — C major */
    "degree-name": p=>{
      const DEG=[["Tonic","I",1,"C"],["Supertonic","ii",2,"D"],["Mediant","iii",3,"E"],
        ["Subdominant","IV",4,"F"],["Dominant","V",5,"G"],["Submediant","vi",6,"A"],["Leading Tone","vii",7,"B"]];
      const d=DEG[Math.floor(Math.random()*7)];
      const mode=(p&&p.ask)==="both"? (Math.random()<.5?"name":"note") : ((p&&p.ask)||"name");
      if(mode==="name"){
        const correct=d[0];
        const wrongs=DEG.map(x=>x[0]).filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);
        const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
        return { type:"mc", q:`Scale degree ${d[2]} (${d[1]}) is called the…`,
          choices, answer:choices.indexOf(correct),
          explain:`Degree ${d[2]} = ${d[0]} (${d[1]}). In C major, that's ${d[3]}.`,
          hint:"Tonic-Supertonic-Mediant-Subdominant-Dominant-Submediant-Leading Tone." };
      }
      const correct=d[3];
      const wrongs=DEG.map(x=>x[3]).filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);
      const choices=[correct,...wrongs].sort(()=>Math.random()-.5);
      return { type:"mc", q:`In C major, which NOTE is the ${d[0]} (${d[1]})?`,
        choices, answer:choices.indexOf(correct),
        explain:`${d[0]} = degree ${d[2]} of C major = ${d[3]}.`,
        hint:`Count up from C: degree ${d[2]}.` };
    },
    /* v5 — enharmonic pairs */
    "enharmonic": ()=>{
      const PAIRS=[["C\u266f","D\u266d"],["D\u266f","E\u266d"],["F\u266f","G\u266d"],["G\u266f","A\u266d"],["A\u266f","B\u266d"]];
      const [a,b]=pick(PAIRS);
      const askA=Math.random()<.5;
      const target=askA?a:b, correct=askA?b:a;
      const wrongs=shuffle(PAIRS.filter(x=>x[0]!==a).map(x=>pick(x))).slice(0,3);
      const choices=shuffle([correct,...wrongs]);
      return { type:"mc", q:`Which note sounds exactly the same as ${target}?`,
        choices, answer:choices.indexOf(correct),
        explain:`${a} and ${b} are ENHARMONIC — two names for the same piano key.`,
        hint:"Same black key — approached from the left or from the right." };
    }
  };
  function expand(quizArr){
    const out=[];
    quizArr.forEach(q=>{
      if(q.gen){ const n=q.count||1; for(let i=0;i<n;i++) out.push(generators[q.gen](q.params||{})); }
      else out.push(q);
    });
    return out;
  }
  function hash(s){ let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0; return h; }
  function makeCode(lesson,score,total){
    const d=new Date(); const mmdd=(d.getMonth()+1)*100+d.getDate();
    const pct10=Math.round(10*score/total); /* store score out of 10 regardless of quiz size */
    const payload=(lesson*100000)+(pct10*1000)+mmdd;
    const p36=payload.toString(36).toUpperCase().padStart(4,"0");
    const c36=(hash(SALT+payload).toString(36).toUpperCase()+"0000").slice(0,4);
    return "MF"+String(lesson).padStart(2,"0")+"-"+p36+"-"+c36;
  }
  function verifyCode(code){
    const m=String(code).trim().toUpperCase().match(/^MF(\d{2})-([0-9A-Z]+)-([0-9A-Z]{4})$/);
    if(!m) return {valid:false};
    const payload=parseInt(m[2],36);
    const c36=(hash(SALT+payload).toString(36).toUpperCase()+"0000").slice(0,4);
    if(c36!==m[3]) return {valid:false};
    const lesson=Math.floor(payload/100000), score=Math.floor(payload/1000)%100, mmdd=payload%1000;
    if(lesson!==+m[1]) return {valid:false};
    return {valid:true,lesson,score,date:Math.floor(mmdd/100)+"/"+(mmdd%100)};
  }
  function progress(){ try{return JSON.parse(localStorage.getItem("mf-progress")||"{}");}catch(e){return{};} }
  function saveProgress(lesson,score,total){
    try{ const p=progress(); const pct=Math.round(100*score/total);
      if(!p[lesson]||p[lesson].best<pct) p[lesson]={best:pct,done:pct>=70};
      localStorage.setItem("mf-progress",JSON.stringify(p)); }catch(e){}
  }
  /* ---------- quiz UI ---------- */
  function mount(el, quizArr, opts){
    opts=opts||{};
    const lesson=opts.lesson, onHint=opts.onHint, onDone=opts.onDone;
    let qs=expand(quizArr), qi=0, score=0, wrongs=[];
    el.innerHTML=`<div class="qnum"></div><div class="big-q" style="text-align:left"></div>
      <div class="q-media"></div><div class="choices"></div>
      <div class="explain" style="display:none"></div>
      <div class="continue-row"><button class="qnext" style="display:none">Next question →</button></div>
      <div class="score-box" style="display:none"></div>`;
    const $=s=>el.querySelector(s);
    function rightIdxOf(q){ return q.type==="truefalse" ? (typeof q.answer==="boolean" ? (q.answer?0:1) : q.answer) : q.answer; }
    function choicesOf(q){ return q.choices||(q.type==="truefalse"?["True","False"]:[]); }
    function show(){
      const q=qs[qi];
      $(".qnum").textContent=`Question ${qi+1} of ${qs.length}`;
      $(".big-q").textContent=q.q;
      const media=$(".q-media"); media.innerHTML="";
      $(".explain").style.display="none"; $(".qnext").style.display="none";
      const ch=$(".choices"); ch.innerHTML="";
      const cs=choicesOf(q); ch.classList.toggle("chips", cs.length>0 && cs.every(c=>String(c).length<=14));
      if(q.staff){ const d=document.createElement("div"); media.appendChild(d); Staff.render(d,q.staff); }
      if(q.type==="listen"){
        const b=document.createElement("button"); b.className="play"; b.textContent="▶ Play"; b.onclick=q.play; media.appendChild(b);
      }
      if(q.type==="click-key"){
        const d=document.createElement("div"); media.appendChild(d);
        let answered=false;
        Keyboard.create(d,Object.assign({},q.kb,{onKey:m=>{ if(answered)return; answered=true; answerClickKey(q,m); }}));
        return;
      }
      choicesOf(q).forEach((c,i)=>{
        const b=document.createElement("button"); b.textContent=c; b.onclick=()=>answer(q,i,b); ch.appendChild(b);
      });
    }
    function feedback(q,ok,rightText){
      const ex=$(".explain");
      ex.innerHTML=(ok?"✓ <b>Correct!</b> ":"✗ <b>Not quite.</b> ")+q.explain;
      ex.style.display="block";
      if(ok){ score++; setTimeout(()=>advance(),1100); }
      else { wrongs.push({q:q.q,right:rightText,explain:q.explain});
        $(".qnext").style.display="inline-block"; if(q.hint && onHint) onHint(q.hint); }
    }
    function answer(q,i,btn){
      const rightIdx=rightIdxOf(q);
      const correct=i===rightIdx;
      [...$(".choices").children].forEach((b,j)=>{ b.disabled=true; if(j===rightIdx) b.classList.add("right"); });
      if(!correct) btn.classList.add("wrongpick");
      feedback(q,correct,choicesOf(q)[rightIdx]);
    }
    function answerClickKey(q,m){
      const ok=m===q.target;
      if(!ok) MFAudio.tone(q.target,0.6,0.4);
      feedback(q,ok,"(the highlighted key)");
    }
    function advance(){ qi++; if(qi<qs.length) show(); else finish(); }
    $(".qnext").onclick=()=>advance();
    function finish(){
      $(".qnum").textContent=""; $(".big-q").textContent=""; $(".q-media").innerHTML=""; $(".choices").innerHTML="";
      $(".explain").style.display="none"; $(".qnext").style.display="none";
      const pct=Math.round(100*score/qs.length), pass=pct>=70;
      saveProgress(lesson,score,qs.length);
      const sb=$(".score-box"); sb.style.display="block";
      sb.innerHTML=`<div class="score-big">${score} / ${qs.length}</div>
        <p style="font-size:1.2rem;font-weight:700;color:var(--primary)">${pct}%</p>
        <p>${pct>=90?"Outstanding!":pct>=70?"Nice work — you passed!":"Good try — review and go again. New questions every time!"}</p>
        ${pass?`<p style="margin-top:10px;font-size:14px;color:var(--muted)">Your completion code (submit in the LMS):</p>
        <span class="code-chip">${makeCode(lesson,score,qs.length)}</span>`:""}
        <div class="continue-row">
          ${wrongs.length?`<button class="ghost qreview">\u{1F4DD} Review incorrect answers (${wrongs.length})</button>`:""}
          <button class="ghost qretry">↻ Retry quiz</button>
        </div>
        <div class="qwrongs" style="display:none;text-align:left"></div>`;
      if(wrongs.length){
        const wl=sb.querySelector(".qwrongs");
        wl.innerHTML=wrongs.map(w=>`<div class="explain" style="display:block;margin-top:10px"><b>${w.q}</b><br>Correct answer: <b>${w.right}</b><br>${w.explain}</div>`).join("");
        sb.querySelector(".qreview").onclick=()=>{ wl.style.display=wl.style.display==="none"?"block":"none"; };
      }
      sb.querySelector(".qretry").onclick=()=>{ qs=expand(quizArr); qi=0; score=0; wrongs=[]; sb.style.display="none"; show(); };
      if(onDone) onDone(score,qs.length,pass);
    }
    show();
  }
  /* ---------- practice drill: one at a time, auto-advance; supports fixed items ---------- */
  function drill(el, itemList){
    const queue=[];
    itemList.forEach(g=>{
      if(g.gen){ for(let i=0;i<(g.count||10);i++) queue.push(g); }
      else queue.push({fixedQ:g});
    });
    queue.sort(()=>Math.random()-.5);
    let done=0, right=0;
    el.innerHTML=`<div class="qnum p-prog"></div><div class="p-body"></div>`;
    const prog=el.querySelector(".p-prog"), body=el.querySelector(".p-body");
    function next(){
      if(done>=queue.length){
        body.innerHTML=`<div class="score-box" style="display:block">
          <div class="score-big">${right} / ${queue.length}</div>
          <p>Practice complete! ${right>=queue.length*0.8?"You're ready for the quiz. \u{1F31F}":"One more round builds confidence — or jump into the quiz."}</p>
          <div class="continue-row"><button class="ghost p-again">↻ Practice again (new questions)</button></div></div>`;
        prog.textContent="";
        body.querySelector(".p-again").onclick=()=>{ done=0; right=0; queue.sort(()=>Math.random()-.5); next(); };
        return;
      }
      prog.textContent=`Practice ${done+1} of ${queue.length}`;
      const g=queue[done];
      const q=g.gen? generators[g.gen](g.params||{}) : g.fixedQ;
      const choices=q.choices||(q.type==="truefalse"?["True","False"]:[]);
      const rightIdx=q.type==="truefalse"?(typeof q.answer==="boolean"?(q.answer?0:1):q.answer):q.answer;
      const chips=choices.length>0 && choices.every(c=>String(c).length<=14);
      body.innerHTML=`<div class="big-q" style="text-align:left">${q.q}</div><div class="p-media"></div><div class="choices${chips?" chips":""}"></div><div class="explain" style="display:none"></div>`;
      const media=body.querySelector(".p-media");
      if(q.staff){ const d=document.createElement("div"); media.appendChild(d); Staff.render(d,q.staff); }
      if(q.type==="listen"){ const b=document.createElement("button"); b.className="play"; b.textContent="▶ Play"; b.onclick=q.play; media.appendChild(b); }
      function after(ok){ done++; if(ok)right++; setTimeout(next, ok?900:2000); }
      if(q.type==="click-key"){
        const d=document.createElement("div"); media.appendChild(d);
        let answered=false;
        Keyboard.create(d,Object.assign({},q.kb,{onKey:m=>{ if(answered)return; answered=true;
          const ok=m===q.target; if(!ok) MFAudio.tone(q.target,.6,.4);
          const ex=body.querySelector(".explain"); ex.innerHTML=(ok?"✓ <b>Correct!</b> ":"✗ <b>Not quite.</b> ")+q.explain; ex.style.display="block";
          after(ok); }}));
        return;
      }
      choices.forEach((c,i)=>{
        const b=document.createElement("button"); b.textContent=c;
        b.onclick=()=>{ [...body.querySelector(".choices").children].forEach((x,j)=>{x.disabled=true;if(j===rightIdx)x.classList.add("right");});
          const ok=i===rightIdx; if(!ok)b.classList.add("wrongpick");
          const ex=body.querySelector(".explain"); ex.innerHTML=(ok?"✓ <b>Correct!</b> ":"✗ <b>Not quite.</b> ")+q.explain; ex.style.display="block";
          after(ok); };
        body.querySelector(".choices").appendChild(b);
      });
    }
    next();
  }
  return {mount,expand,generators,makeCode,verifyCode,progress,drill};
})();
