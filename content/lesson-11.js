/* Lesson 11 — 3/4 Time Signature (AEMT Book 1, Unit 3) — v3 COLLEGE-TONE REWRITE
   Content grounded in AEMT1 p.17 (definitions, beat values, whole-rest rule,
   half-rest/whole-note prohibition, 2/4·3/4·4/4 comparison) and its exercise types
   (complete with ONE note or rest, circle incorrect measures, draw bar lines).
   Per instructor (DD-26): no "waltz", no "STRONG-weak" — textbook-based only.
   Option styles per DD-27: notation cards + A/B/C/D worksheet choices.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[11]={
  welcome:"One more beat per measure — 3/4 time.",
  hook:{
    say:"Listen to this example — a three-beat count-off, then the music. <b>Count along: how many beats are in each measure?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Count-off, then the example</button></div>
          <div class="choices chips hk-ch" style="display:none"><button>2</button><button>3</button><button>4</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/100;
          for(let k=0;k<3;k++) MFAudio.click(k*spb,.55,k===0);
          const mel=[[60,1],[64,1],[67,1],[64,2],[60,1]]; let b=3;
          mel.forEach(([m,len])=>{ MFAudio.tone(m,len*spb*.9,b*spb); b+=len; });
          for(let k=3;k<9;k++) MFAudio.click(k*spb,(k-3)%3===0?.5:.3,(k-3)%3===0);
          setTimeout(()=>{ ch.style.display=""; },9*spb*1000+300);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===1) fb(true,"✓ Three beats per measure — this is <b>3/4 time</b>.");
          else fb(false,"Count with the clicks — the pattern repeats every THREE beats.");
        });
      } }
  },
  objectives:[
    "Define the 3/4 time signature",
    "State the beat values of notes and rests in 3/4 time",
    "Compare 2/4, 3/4 and 4/4",
    "Complete measures in 3/4 using one note or rest",
    "Identify measures with an incorrect number of beats",
    "Place bar lines correctly in 3/4 time"
  ],
  steps:[
    { say:"In <b>3/4 time</b>: the <b>3</b> means there are <b>3 beats per measure</b>; the <b>4</b> means the <b>quarter note receives 1 beat</b>. \u{1F447} <b>What does the top number 3 mean?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"3/4",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{bar:"single"},{p:"E4",d:"h",label:"1-2"},{p:"C4",d:"q",label:"3"},{bar:"final"}],width:440} },
      try:{ type:"mc",
        choices:["There are 3 beats per measure","The third note is accented","Only 3 measures may be written"], answer:0,
        success:"✓ The top 3 sets the measure length: three beats.",
        fail:"The top number counts the beats per measure.",
        hint:"Top = how many." } },
    { say:"<b>2/4, 3/4 and 4/4 all have 4 as the bottom number</b>, so the quarter note always receives 1 beat. The difference is the top number: <b>2, 3 or 4 beats per measure</b>. \u{1F447} <b>Which signature matches each description?</b>",
      try:{ type:"custom",
        hint:"The top number = beats per measure.",
        mount:(container,fb)=>{
          const rounds=[
            {q:"3 beats per measure",a:1},{q:"2 beats per measure",a:0},
            {q:"4 beats per measure",a:2},{q:"the quarter note receives 1 beat",a:3}];
          let i=0;
          container.innerHTML=`<div class="big-q cp-q" style="text-align:center;min-height:40px"></div>
            <div class="choices chips cp-ch"><button>2/4</button><button>3/4</button><button>4/4</button><button>All three</button></div>`;
          const q=container.querySelector(".cp-q"), ch=container.querySelector(".cp-ch");
          function ask(){ q.textContent=`Description ${i+1} of ${rounds.length}: “${rounds[i].q}”`; }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[i];
            if(bi===cur.a){ MFAudio.click(0,.4,true); i++;
              if(i>=rounds.length){ ch.style.display="none"; q.textContent="Comparison complete.";
                fb(true,"✓ Correct — the shared bottom 4 fixes the beat note; only the top number changes the measure length."); }
              else { fb(true,"✓ Correct. Next description…"); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,"Read the description again: is it about the TOP number (beats per measure) or the BOTTOM number (the beat note)?"); }
          });
          ask();
        } } },
    { say:"<b>Complete the measures using ONE note or rest.</b> Remember two writing rules: a full measure of silence takes the <b>whole rest</b>, and <b>a half rest and a whole note are never used in 3/4 time</b>. Each measure below is missing exactly one symbol. \u{1F447}",
      try:{ type:"custom",
        hint:"Add the beats already present, then supply the difference with a single symbol.",
        mount:(container,fb)=>{
          const rounds=[
            {given:[{p:"E4",d:"q",label:"1"},{p:"G4",d:"q",label:"2"}],accept:["q","Q"],needTxt:"1 more beat"},
            {given:[{p:"C4",d:"q",label:"1"}],accept:["h"],needTxt:"2 more beats (one symbol!)"},
            {given:[],accept:["W"],needTxt:"a full measure of silence"},
            {given:[{p:"D4",d:"h",label:"1-2"}],accept:["q","Q"],needTxt:"1 more beat"}];
          const CARDS=[["q","Quarter Note",{p:"E4",d:"q"}],["h","Half Note",{p:"E4",d:"h"}],
                       ["Q","Quarter Rest",{rest:"q"}],["W","Whole Rest",{rest:"w"}]];
          let i=0;
          container.innerHTML=`<div class="big-q c3-q" style="text-align:center"></div><div class="c3-staff"></div>
            <div class="c3-cards" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px"></div>`;
          const q=container.querySelector(".c3-q"), st=container.querySelector(".c3-staff"), grid=container.querySelector(".c3-cards");
          CARDS.forEach(([t,name,item])=>{
            const b=document.createElement("button");
            b.className="notecard";
            b.style.cssText="border-radius:10px;padding:6px 10px;min-width:108px";
            const d=document.createElement("div"); b.appendChild(d);
            Staff.render(d,{clef:"none",notes:[item],width:100});
            const nm=document.createElement("div"); nm.style.cssText="font-weight:700;font-size:13px"; nm.textContent=name; b.appendChild(nm);
            b.onclick=()=>{
              const cur=rounds[i];
              if(cur.accept.includes(t)){
                Staff.render(st,{clef:"treble",time:"3/4",notes:[...cur.given,item,{bar:"final"}],width:340});
                if(!item.rest) MFAudio.tone(64,.5); else MFAudio.click(0,.35);
                i++;
                if(i>=rounds.length){ grid.style.display="none"; q.textContent="All measures completed.";
                  fb(true,"✓ Every measure totals exactly 3 beats — and the empty one took a whole rest, per the rule."); }
                else { fb(true,"✓ Exactly 3 beats. Next measure…"); setTimeout(ask,1200); }
              } else fb(false,`That measure needs ${cur.needTxt} — and remember: no half rests or whole notes in 3/4.`);
            };
            grid.appendChild(b);
          });
          function ask(){
            const cur=rounds[i];
            Staff.render(st,{clef:"treble",time:"3/4",notes:[...cur.given,{bar:"final"}],width:340});
            q.textContent=`Measure ${i+1} of ${rounds.length}: choose ONE symbol to complete it.`;
          }
          ask();
        } } },
    { say:"<b>Find the measure with the incorrect number of beats.</b> \u{1F447} <b>Click A, B, C or D:</b>",
      try:{ type:"custom",
        hint:"Each 3/4 measure must total exactly 3 beats — count notes AND rests.",
        mount:(container,fb)=>{
          const rounds=[
            {items:[[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"}],[{p:"F4",d:"h"},{p:"D4",d:"q"}],[{p:"E4",d:"h"}],[{rest:"q"},{p:"C4",d:"q"},{rest:"q"}]],bad:2,why:"C holds only 2 beats — 3/4 requires exactly 3."},
            {items:[[{rest:"w"}],[{p:"G4",d:"q"},{rest:"q"},{p:"E4",d:"q"}],[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"q"},{p:"F4",d:"q"}],[{p:"E4",d:"h"},{rest:"q"}]],bad:2,why:"C holds 4 beats — one too many. (A is fine: the whole rest fills any full measure.)"}];
          let r=0;
          container.innerHTML=`<div class="big-q i3-q" style="text-align:center"></div><div class="i3-staff"></div>
            <div class="choices chips i3-ch"><button>A</button><button>B</button><button>C</button><button>D</button></div>`;
          const q=container.querySelector(".i3-q"), st=container.querySelector(".i3-staff"), ch=container.querySelector(".i3-ch");
          function ask(){
            const cur=rounds[r], items=[], spans=[];
            cur.items.forEach((meas,mi)=>{
              const s0=items.length;
              meas.forEach(n=>items.push(Object.assign({},n)));
              spans.push([s0,items.length-1]);
              items.push({bar:mi<cur.items.length-1?"single":"final"});
            });
            Staff.render(st,{clef:"treble",time:"3/4",notes:items,width:470});
            const svg=st.querySelector("svg");
            const startX=110, L=items.length;
            const xAt=i2=> (items[i2]&&items[i2].bar!==undefined&&i2===L-1)? 470-16 : startX+i2*((470-40-startX)/(L-1));
            let prev=startX-24;
            const NS="http://www.w3.org/2000/svg";
            spans.forEach(([s0,s1],mi)=>{
              const nxt=xAt(s1+1);
              const x=(prev+nxt)/2;
              const tx=document.createElementNS(NS,"text");
              tx.setAttribute("x",x);tx.setAttribute("y",127);tx.setAttribute("text-anchor","middle");
              tx.setAttribute("class","lbl");tx.setAttribute("font-weight","800");tx.textContent="ABCD"[mi];
              svg.appendChild(tx);
              prev=nxt;
            });
            q.textContent=`Line ${r+1} of ${rounds.length}: which measure has the INCORRECT number of beats?`;
          }
          [...ch.children].forEach((b,bi)=>b.onclick=()=>{
            const cur=rounds[r];
            if(bi===cur.bad){ MFAudio.click(0,.4,true); r++;
              if(r>=rounds.length){ ch.style.display="none"; q.textContent="Both lines checked.";
                fb(true,"✓ Every faulty measure found. Notes and rests both count toward the total."); }
              else { fb(true,"✓ "+cur.why+" Next line…"); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,"That measure totals exactly 3 — count again. "+cur.why); }
          });
          ask();
        } } },
    { say:"Let's organize the melody!<br>Count the beats from left to right.<br>Every time you reach <b>3 beats</b>, place a bar line (a half note counts 2).<br>There are only <b>TWO</b> correct places.<br>\u{1F447} <b>Click the correct two positions:</b>",
      try:{ type:"custom",
        hint:"A bar line belongs after every 3 beats — count notes and rests.",
        mount:(container,fb)=>{
          const seq=[{p:"C4",d:"q"},{p:"E4",d:"q"},{p:"G4",d:"q"},{p:"F4",d:"h"},{p:"D4",d:"q"},{p:"E4",d:"h"},{p:"C4",d:"q"}];
          const cand=[{g:1,letter:"A"},{g:2,letter:"B"},{g:3,letter:"C"},{g:4,letter:"D"}];
          const correct=new Set([2,4]);
          const placed=new Set(), W=470, NS="http://www.w3.org/2000/svg";
          container.innerHTML=`<div class="b3l-staff"></div><div class="choices chips b3l-ch"></div>`;
          const st=container.querySelector(".b3l-staff"), ch=container.querySelector(".b3l-ch");
          cand.forEach(c=>{ const b=document.createElement("button"); b.textContent=c.letter;
            b.onclick=()=>pick(c,b); ch.appendChild(b); });
          function items(){
            const out=[]; seq.forEach((n,j)=>{ out.push(n); if(placed.has(j)) out.push({bar:"single"}); });
            if(placed.size===correct.size) out.push({bar:"final"});
            return out;
          }
          function draw(){
            const its=items();
            Staff.render(st,{clef:"treble",time:"3/4",notes:its,width:W});
            const svg=st.querySelector("svg");
            const startX=110, L=its.length;
            const xAt=i2=> startX+i2*((W-40-startX)/(L-1));
            const idxMap=[]; let k=0;
            seq.forEach((n,j)=>{ idxMap[j]=k; k++; if(placed.has(j)) k++; });
            cand.forEach(c=>{
              if(placed.has(c.g)) return;
              const xa=xAt(idxMap[c.g]), xb=c.g+1<seq.length? xAt(idxMap[c.g+1]) : W-16;
              const x=(xa+xb)/2;
              const ln=document.createElementNS(NS,"line");
              ln.setAttribute("x1",x);ln.setAttribute("y1",112);ln.setAttribute("x2",x);ln.setAttribute("y2",96);
              ln.setAttribute("stroke","#33415c");ln.setAttribute("stroke-width","2");
              const hd=document.createElementNS(NS,"polygon");
              hd.setAttribute("points",`${x-4},99 ${x+4},99 ${x},91`); hd.setAttribute("fill","#33415c");
              const tx=document.createElementNS(NS,"text");
              tx.setAttribute("x",x);tx.setAttribute("y",127);tx.setAttribute("text-anchor","middle");
              tx.setAttribute("class","lbl");tx.setAttribute("font-weight","800");tx.textContent=c.letter;
              svg.appendChild(ln);svg.appendChild(hd);svg.appendChild(tx);
            });
          }
          function pick(c,b){
            if(placed.has(c.g)||b.disabled) return;
            if(correct.has(c.g)){
              placed.add(c.g); b.disabled=true; MFAudio.yay();
              draw();
              if([...correct].every(g=>placed.has(g))){
                ch.style.display="none";
                const spec={clef:"treble",time:"3/4",tempo:100,notes:items(),width:W};
                const api=Staff.render(st,spec); Staff.play(spec,api);
                fb(true,"✓ Bar lines after beats 3 and 6 — three measures of exactly 3 beats, closed with a double bar.");
              } else fb(true,"✓ A bar line belongs there. One more…");
            } else { MFAudio.tone(40,.25);
              fb(false,"Count from the last bar line — the line belongs exactly where the count reaches 3 (a half note counts 2)."); }
          }
          draw();
        } } }
  ],
  examples:[
    { caption:"A line in 3/4 — count “1 2 3 | 1 2 3” with the playback.",
      staff:{clef:"treble",tempo:100,time:"3/4",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{p:"G4",d:"q",label:"3"},{bar:"single"},{p:"E4",d:"h",label:"1-2"},{p:"C4",d:"q",label:"3"},{bar:"final"}],width:440} },
    { caption:"Rests in 3/4: quarter rests take 1 beat each; a full measure of silence is written with the whole rest.",
      staff:{clef:"treble",tempo:100,time:"3/4",notes:[{p:"D4",d:"q",label:"1"},{rest:"q",label:"2"},{rest:"q",label:"3"},{bar:"single"},{rest:"w",label:"1-2-3"},{bar:"single"},{p:"D4",d:"h",label:"1-2"},{p:"D4",d:"q",label:"3"},{bar:"final"}],width:460} }
  ],
  games:[
    { type:"rhythm-tap", title:"Game 1 · 3/4 Rhythm Tap",
      intro:"Listen to a 3/4 measure, then tap it back. The three-beat count-off sets the tempo.",
      miaIntro:"Three-beat measures — listen, then tap. \u{1F3AF}",
      spec:{tempo:100, rounds:3, beatsPerBar:3, patterns:[["q","q","q"],["h","q"],["q","h"],["q","rq","q"]]},
      result:(score)=>score>=6?"Precise tapping in 3/4.":null },
    { type:"measure-judge", title:"Game 2 · Correct or Incorrect?",
      intro:"Does each measure hold exactly <b>3 beats</b>? Check notes and rests alike.",
      miaIntro:"Compare every measure with the top number. \u{1F50D}",
      spec:{rounds:8, beats:3},
      result:(score)=>score>=7?"Very accurate beat-checking.":null },
    { type:"measure-build", title:"Game 3 · Complete the Measure",
      intro:"Fill 3/4 measures with exactly <b>3 beats</b> using the note cards — find both combinations.",
      miaIntro:"Build with the cards — exactly three beats. \u{1F3D7}\u{FE0F}",
      spec:{beats:3, unique:true, rounds:2},
      result:(stars)=>stars>=3?"Both combinations found.":null },
    { type:"symbol-hunt", title:"Game 4 · Signature Identification",
      intro:"2/4, 3/4, 4/4, C — identify each at sight. Top numbers matter.",
      miaIntro:"Read the signatures precisely. \u{1F3AF}",
      spec:{rounds:6, pool:[
        {label:"3/4 Time Signature", spec:{clef:"treble",time:"3/4",notes:[]}},
        {label:"2/4 Time Signature", spec:{clef:"treble",time:"2/4",notes:[]}},
        {label:"4/4 Time Signature", spec:{clef:"treble",time:"4/4",notes:[]}},
        {label:"Common Time (C)", spec:{clef:"treble",time:"C",notes:[]}}]},
      result:(score)=>score>=5?"Signatures identified without error.":null }
  ],
  practiceIntro:"20 practice questions — definitions, beat values, and measure checking in 3/4. Answer correctly and the next appears automatically.",
  practice:[
    { gen:"measure-complete", params:{beats:3}, count:4 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:3 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"measure-count", params:{min:2,max:4}, count:2 },
    { type:"mc", q:"In 3/4 time, the top number 3 means…", choices:["there are 3 beats per measure","the third beat is silent","three notes fit on the staff"], answer:0,
      explain:"Top number = beats per measure." },
    { type:"mc", q:"In 3/4 time, which note receives one beat?", choices:["Quarter Note","Half Note","Eighth Note"], answer:0,
      explain:"Bottom 4 = quarter note, as in 2/4 and 4/4." },
    { type:"truefalse", q:"In 3/4 time, a half note receives 2 beats.", answer:true,
      explain:"Values don't change — only the measure length does." },
    { type:"truefalse", q:"A whole rest is used for a full measure of rest in 3/4 time.", answer:true,
      explain:"The whole rest fills a complete measure in any meter." },
    { type:"truefalse", q:"A half rest may be written in 3/4 time.", answer:false,
      explain:"Half rests and whole notes are never used in 3/4." },
    { type:"mc", q:"2/4, 3/4 and 4/4 all share…", choices:["the bottom number 4 — the quarter note receives 1 beat","the same number of beats per measure","the same tempo"], answer:0,
      explain:"Only the top numbers differ: 2, 3 and 4 beats per measure." },
    { type:"mc", q:"Which fills one complete 3/4 measure?", choices:["Half note + quarter note","Half note","Whole note"], answer:0,
      explain:"2 + 1 = 3. A half note alone leaves one beat missing; a whole note is not used in 3/4." },
    { type:"mc", q:"Counting in 3/4 is written…", choices:["1 2 3 | 1 2 3","1 2 | 1 2","1 2 3 4"], answer:0,
      explain:"Three counts per measure, restarting at each bar line." },
    { type:"truefalse", q:"Two quarter rests equal 2 beats in 3/4 time.", answer:true,
      explain:"1 + 1 = 2 — rests count exactly like notes." },
    /* — from the unit review sheet — */
    { type:"mc", q:"In 3/4 time, a whole rest receives ____ beats.", choices:["3 — it fills the whole measure","4","2"], answer:0, explain:"The whole rest always fills the FULL measure — in 3/4 that is 3 beats." },
    { type:"mc", q:"Which time signature fits a measure containing three quarter notes only?", choices:["3/4","2/4","4/4"], answer:0, explain:"1 + 1 + 1 = 3 beats — a 3/4 measure." }
  ],
  miaQuizIntro:"Quiz time — twenty questions on 3/4. Count precisely.",
  quiz:[
    { type:"mc", q:"How many beats are in one measure of 3/4 time?", choices:["2","3","4","6"], answer:1,
      explain:"The top number says 3.", hint:"Read the top number." },
    { type:"mc", q:"Which note receives one beat in both 2/4 and 3/4 time?", choices:["Whole Note","Half Note","Quarter Note","Eighth Note"], answer:2,
      explain:"Both signatures share the bottom 4.", hint:"The shared bottom number." },
    { type:"truefalse", q:"A measure of 3/4 time contains three quarter-note beats.", answer:true,
      explain:"3 on top, quarter-note beat below.", hint:"Read both numbers." },
    { type:"mc", q:"For a FULL measure of rest in 3/4 time, use…", choices:["a whole rest","a half rest plus a quarter rest","a dotted half rest"], answer:0,
      explain:"The whole rest marks a full silent measure in any meter.", hint:"The special full-measure rule." },
    { type:"mc", q:"Which two symbols are NEVER used in writing 3/4 time?", choices:["Half rest and whole note","Quarter rest and half note","Whole rest and quarter note"], answer:0,
      explain:"Same convention as 2/4.", hint:"One rest, one note." },
    { type:"mc", q:"The difference between 2/4, 3/4 and 4/4 is…", choices:["the number of beats per measure","which note receives the beat","the loudness"], answer:0,
      explain:"2, 3 or 4 beats — the beat note stays the quarter.", hint:"Compare the top numbers." },
    { type:"mc", q:"In 3/4, a half note receives…", choices:["1 beat","2 beats","3 beats"], answer:1,
      explain:"Two beats — one beat then remains in the measure.", hint:"Values never change." },
    { type:"truefalse", q:"This measure is complete.",
      staff:{clef:"treble",time:"3/4",notes:[{p:"B4",d:"h"},{p:"B4",d:"q"},{bar:"final"}],width:300},
      answer:true,
      explain:"2 + 1 = 3 — exactly full.", hint:"Add and compare with the top number." },
    { type:"truefalse", q:"This measure is complete.",
      staff:{clef:"treble",time:"3/4",notes:[{p:"B4",d:"q"},{rest:"q"},{bar:"final"}],width:280},
      answer:false,
      explain:"1 + 1 = 2 — one beat short.", hint:"Rests count too." },
    { type:"mc", q:"Which completes a 3/4 measure that already contains a half note?",
      choices:["One quarter note or one quarter rest","One half note","A whole rest"], answer:0,
      explain:"2 + 1 = 3.", hint:"Supply exactly one beat." },
    { type:"mc", q:"How many measures are shown?",
      staff:{clef:"treble",time:"3/4",notes:[{p:"B4",d:"q"},{p:"B4",d:"q"},{p:"B4",d:"q"},{bar:"single"},{p:"B4",d:"h"},{p:"B4",d:"q"},{bar:"single"},{rest:"w"},{bar:"final"}],width:440},
      choices:["2","3","4"], answer:1,
      explain:"Three measures — the last is a full measure of rest.", hint:"Count the spaces between bar lines." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A quarter note has a different value in 3/4 time","The quarter note always equals one beat in 2/4, 3/4 and 4/4","2/4 and 3/4 have the same number of beats per measure","A measure of 3/4 contains two beats"], answer:1,
      explain:"The shared bottom 4 fixes the beat note; the top number sets the measure length.",
      hint:"What does each number control?" },
    /* generated */
    { gen:"measure-complete", params:{beats:3}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:3}, count:2 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"Three beats per measure; the quarter note receives one beat.", term:"3/4 Time", staff:{clef:"none",time:"3/4",notes:[],width:140}},
    {def:"Two beats per measure; the quarter note receives one beat.", term:"2/4 Time", staff:{clef:"none",time:"2/4",notes:[],width:140}},
    {def:"Means to rest for a whole measure — in 3/4 it receives 3 beats.", term:"Whole Rest", staff:{clef:"none",notes:[{rest:"w"}],width:140}},
    {def:"Not used in 3/4 time.", term:"Half Rest · Whole Note"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>3/4</b>: 3 = <b>three beats per measure</b>; 4 = the <b>quarter note receives 1 beat</b>.",
    "✔ 2/4, 3/4 and 4/4 share the bottom 4 — only the top number differs.",
    "✔ ♩ or ♩-rest = 1 beat; half note (or two quarter rests) = 2 beats.",
    "✔ A <b>whole rest</b> fills a complete silent measure — even in 3/4.",
    "✔ A <b>half rest</b> and a <b>whole note</b> are never used in 3/4 time."
  ],
  tips:[
    "Count aloud in threes — “1 2 3 | 1 2 3” — restarting at every bar line.",
    "When checking measures, count rests as carefully as notes.",
    "Full-measure silence is ALWAYS the whole rest — a rule worth memorizing now.",
    "Next lesson: the dotted half note — a single note worth all three beats of a 3/4 measure."
  ],
  rewards:{ badge:"3/4 Time Expert", icon:"\u{1F4D0}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score on 3/4 — definitions, values and writing rules all secure. The dotted half note is next. \u{1F389}",
  miaPass:"Passed. Review the summary below, or retry — several questions regenerate each attempt.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The example repeats its pattern every three beats — the defining feature of 3/4 time.",
      play:()=>{const s=.6;for(let k=0;k<9;k++) MFAudio.click(k*s,k%3===0?.55:.3,k%3===0);} },
    learn:{ label:"3/4 time",
      explain:"3 = three beats per measure; 4 = quarter note receives one beat. Whole rest for a full silent measure; half rest and whole note are not written in 3/4.",
      hint:"Compare every measure total with the top number.",
      play:()=>{const s=.55;[60,64,67].forEach((m,i)=>MFAudio.tone(m,s*.9,i*s));[64,60].forEach((m,i)=>MFAudio.tone(m,s*(i?1:2)*.9,(3+i*2)*s));} },
    example:{ label:"the examples",
      explain:"Count in threes through both examples; example 2 shows the whole rest filling a complete silent measure." },
    game:{ label:"the games",
      explain:"Tap 3/4 rhythms, judge measures, complete them with the cards, and identify signatures at sight.",
      hint:"One comparison decides everything: measure total versus top number." },
    quiz:{ label:"this question",
      explain:"Key facts: 3 beats per measure; quarter note = 1 beat; whole rest = full silent measure; no half rest or whole note in 3/4.",
      play:()=>{MFAudio.click(0,.55,true);MFAudio.click(.55,.3);MFAudio.click(1.1,.3);} }
  }
};
