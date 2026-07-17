/* Lesson 10 — 2/4 Time Signature (AEMT Book 1, Unit 3) — v2 COLLEGE-TONE REWRITE
   Content grounded in AEMT1 p.16 (definitions, beat-value table, whole-rest rule,
   half-rest/whole-note prohibition) and its exercise types (complete the measures,
   circle incorrect measures, draw bar lines). Per instructor (DD-26): no "march/
   waltz", no "STRONG-weak" — textbook/dictionary-based explanations only.
   Option styles per DD-27: notation cards + A/B/C/D worksheet choices.
   NOTE: edit by FULL-FILE REWRITE only. */

LESSON_CONTENT[10]={
  welcome:"Unit 3 — a new time signature.",
  hook:{
    say:"You know 4/4. Now listen to this example — there is a two-beat count-off, then the music. <b>Count along: how many beats are in each measure?</b>",
    interact:{ type:"custom",
      mount:(container,fb)=>{
        container.innerHTML=`<div style="text-align:center"><button class="play hk-play">▶ Count-off, then the example</button></div>
          <div class="choices chips hk-ch" style="display:none"><button>2</button><button>3</button><button>4</button></div>`;
        const ch=container.querySelector(".hk-ch");
        container.querySelector(".hk-play").onclick=()=>{
          const spb=60/92;
          for(let k=0;k<2;k++) MFAudio.click(k*spb,.55,k===0);
          const mel=[[60,1],[64,1],[67,1],[64,1],[60,2]]; let b=2;
          mel.forEach(([m,len])=>{ MFAudio.tone(m,len*spb*.9,b*spb); b+=len; });
          for(let k=2;k<8;k+=1) MFAudio.click(k*spb,k%2===0?.5:.3,k%2===0);
          setTimeout(()=>{ ch.style.display=""; },8*spb*1000+300);
        };
        [...ch.children].forEach((b,i)=>b.onclick=()=>{
          if(i===0) fb(true,"✓ Two beats per measure. This is <b>2/4 time</b> — today's lesson.");
          else fb(false,"Listen again and count with the clicks — the pattern repeats every TWO beats.");
        });
      } }
  },
  objectives:[
    "Define the 2/4 time signature",
    "State the beat values of notes and rests in 2/4 time",
    "Compare 2/4 with 4/4",
    "Complete measures in 2/4 using notes and rests",
    "Identify measures with an incorrect number of beats",
    "Place bar lines correctly in 2/4 time"
  ],
  steps:[
    { say:"In <b>2/4 time</b>: the <b>2</b> means there are <b>2 beats per measure</b>; the <b>4</b> means the <b>quarter note receives 1 beat</b>. \u{1F447} <b>What does the bottom number 4 mean?</b>",
      show:{ type:"staff", spec:{clef:"treble",time:"2/4",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{bar:"single"},{p:"G4",d:"h",label:"1-2"},{bar:"final"}],width:400} },
      try:{ type:"mc",
        choices:["The quarter note receives 1 beat","There are 4 beats per measure","Only 4 measures may be written"], answer:0,
        success:"✓ The bottom 4 assigns the beat to the quarter note — exactly as in 4/4.",
        fail:"The bottom number names the note that receives one beat.",
        hint:"Same bottom number as 4/4." } },
    { say:"2/4 and 4/4 <b>both have 4 as the bottom number</b>, so a quarter note receives 1 beat in each. <b>The difference:</b> 2/4 has <b>2 beats per measure</b>, while 4/4 has <b>4</b>. \u{1F447} <b>What is the difference between 2/4 and 4/4?</b>",
      try:{ type:"mc",
        choices:["The number of beats per measure","Which note receives the beat","The speed of the music"], answer:0,
        success:"✓ Only the measure length differs — 2 beats versus 4. The beat note is the same.",
        fail:"Both share the bottom 4 — compare the TOP numbers.",
        hint:"Compare 2 and 4 on top." } },
    { say:"Beat values in <b>2/4 time</b>:<br>\u2022 Quarter note or quarter rest = <b>1 beat</b><br>\u2022 Half note = <b>2 beats</b><br>\u2022 A FULL measure of silence is always written with the <b>whole rest</b> \u2014 in every time signature.<br><br>One writing rule to remember: <b>a half rest and a whole note are never used in 2/4 time.</b><br>\u{1F447} <b>Which two symbols are never used in 2/4 time?</b>",
      try:{ type:"mc",
        choices:["A half rest and a whole note","A quarter note and a quarter rest","A half note and a whole rest"], answer:0,
        success:"✓ Correct — in 2/4, silence for the full measure is written with the WHOLE rest, and the whole note simply doesn't fit.",
        fail:"Check the rule text again: two symbols are excluded from 2/4 writing.",
        hint:"One rest and one note are excluded." } },
    { say:"<b>Complete the measures.</b> Each measure below is missing one symbol. Choose the card that completes it with exactly <b>2 beats</b>. \u{1F447}",
      try:{ type:"custom",
        hint:"Add the beats already in the measure, then supply the difference.",
        mount:(container,fb)=>{
          const rounds=[
            {given:[{p:"C4",d:"q",label:"1"}],need:1,accept:["q","Q"],text:"one more beat"},
            {given:[],need:2,accept:["h","W"],text:"a full two beats"},
            {given:[{rest:"q",label:"1"}],need:1,accept:["q","Q"],text:"one more beat"}];
          const CARDS=[["q","Quarter Note",{p:"E4",d:"q"},1],["h","Half Note",{p:"E4",d:"h"},2],
                       ["Q","Quarter Rest",{rest:"q"},1],["W","Whole Rest",{rest:"w"},2]];
          let i=0;
          container.innerHTML=`<div class="big-q cm-q" style="text-align:center"></div><div class="cm-staff"></div>
            <div class="cm-cards" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px"></div>`;
          const q=container.querySelector(".cm-q"), st=container.querySelector(".cm-staff"), grid=container.querySelector(".cm-cards");
          CARDS.forEach(([t,name,item,beats])=>{
            const b=document.createElement("button");
            b.className="notecard";
            b.style.cssText="border-radius:10px;padding:6px 10px;min-width:108px";
            const d=document.createElement("div"); b.appendChild(d);
            Staff.render(d,{clef:"none",notes:[item],width:100});
            const nm=document.createElement("div"); nm.style.cssText="font-weight:700;font-size:13px"; nm.textContent=name; b.appendChild(nm);
            b.onclick=()=>{
              const cur=rounds[i];
              if(cur.accept.includes(t)){
                Staff.render(st,{clef:"treble",time:"2/4",notes:[...cur.given,item,{bar:"final"}],width:320});
                if(!item.rest) MFAudio.tone(64,beats*.45); else MFAudio.click(0,.35);
                i++;
                if(i>=rounds.length){ grid.style.display="none"; q.textContent="All measures completed.";
                  fb(true,"✓ Every measure now holds exactly 2 beats — notes and rests both count toward the total."); }
                else { fb(true,"✓ Exactly 2 beats. Next measure…"); setTimeout(ask,1200); }
              } else {
                const sum=cur.given.reduce((s,g)=>s+(g.d==="h"?2:1),0);
                fb(false,`This measure already holds ${sum} beat${sum!==1?"s":""} — it needs ${cur.text} (${cur.need}). And remember: no half rests in 2/4.`);
              }
            };
            grid.appendChild(b);
          });
          function ask(){
            const cur=rounds[i];
            Staff.render(st,{clef:"treble",time:"2/4",notes:[...cur.given,{bar:"final"}],width:320});
            q.textContent=`Measure ${i+1} of ${rounds.length}: choose the symbol that completes it.`;
          }
          ask();
        } } },
    { say:"<b>Find the measure with the incorrect number of beats.</b> Three measures are correct; one is not. \u{1F447} <b>Click A, B, C or D:</b>",
      try:{ type:"custom",
        hint:"Count each measure against the top number: exactly 2 beats.",
        mount:(container,fb)=>{
          const rounds=[
            {items:[[{p:"C4",d:"q"},{p:"D4",d:"q"}],[{p:"E4",d:"h"}],[{p:"F4",d:"q"},{p:"G4",d:"q"},{p:"E4",d:"q"}],[{rest:"q"},{p:"D4",d:"q"}]],bad:2,why:"C holds 3 beats — one too many for 2/4."},
            {items:[[{p:"G4",d:"h"}],[{p:"E4",d:"q"}],[{p:"C4",d:"q"},{rest:"q"}],[{rest:"w"}]],bad:1,why:"B holds only 1 beat — a 2/4 measure needs exactly 2. (D is fine: the whole rest fills any full measure.)"}];
          let r=0;
          container.innerHTML=`<div class="big-q ic-q" style="text-align:center"></div><div class="ic-staff"></div>
            <div class="choices chips ic-ch"><button>A</button><button>B</button><button>C</button><button>D</button></div>`;
          const q=container.querySelector(".ic-q"), st=container.querySelector(".ic-staff"), ch=container.querySelector(".ic-ch");
          function ask(){
            const cur=rounds[r], items=[], spans=[];
            cur.items.forEach((meas,mi)=>{
              const s0=items.length;
              meas.forEach(n=>items.push(Object.assign({},n)));
              spans.push([s0,items.length-1]);
              items.push({bar:mi<cur.items.length-1?"single":"final"});
            });
            Staff.render(st,{clef:"treble",time:"2/4",notes:items,width:470});
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
                fb(true,"✓ You found every faulty measure — counting against the top number never fails."); }
              else { fb(true,"✓ "+cur.why+" Next line…"); ask(); } }
            else { MFAudio.tone(40,.25); fb(false,"Count that measure again — it holds exactly 2 beats. "+cur.why); }
          });
          ask();
        } } },
    { say:"Let's organize the melody!<br>Count the beats from left to right.<br>Every time you reach <b>2 beats</b>, place a bar line.<br>There are only <b>TWO</b> correct places.<br>\u{1F447} <b>Click the correct two positions:</b>",
      try:{ type:"custom",
        hint:"Count from the start: a bar line belongs after every 2 beats.",
        mount:(container,fb)=>{
          const seq=[{p:"C4",d:"q"},{p:"D4",d:"q"},{p:"E4",d:"h"},{p:"D4",d:"q"},{p:"C4",d:"q"}];
          const cand=[{g:0,letter:"A"},{g:1,letter:"B"},{g:2,letter:"C"},{g:3,letter:"D"}];
          const correct=new Set([1,2]);
          const placed=new Set(), W=460, NS="http://www.w3.org/2000/svg";
          container.innerHTML=`<div class="bl-staff"></div><div class="choices chips bl-ch"></div>`;
          const st=container.querySelector(".bl-staff"), ch=container.querySelector(".bl-ch");
          cand.forEach(c=>{ const b=document.createElement("button"); b.textContent=c.letter;
            b.onclick=()=>pick(c,b); ch.appendChild(b); });
          function items(){
            const out=[]; seq.forEach((n,j)=>{ out.push(n); if(placed.has(j)) out.push({bar:"single"}); });
            if(placed.size===correct.size) out.push({bar:"final"});
            return out;
          }
          function draw(){
            const its=items();
            Staff.render(st,{clef:"treble",time:"2/4",notes:its,width:W});
            const svg=st.querySelector("svg");
            const startX=110, L=its.length;
            const xAt=i2=> L===1? (startX+W-40)/2 : startX+i2*((W-40-startX)/(L-1));
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
                const spec={clef:"treble",time:"2/4",tempo:92,notes:items(),width:W};
                const api=Staff.render(st,spec); Staff.play(spec,api);
                fb(true,"✓ Bar lines after beats 2 and 4 — three measures of exactly 2 beats each, closed by a double bar.");
              } else fb(true,"✓ A bar line belongs there. One more…");
            } else { MFAudio.tone(40,.25);
              fb(false,"Count from the last bar line — a bar line belongs exactly where the count reaches 2."); }
          }
          draw();
        } } }
  ],
  examples:[
    { caption:"A line in 2/4 — count “1 2 | 1 2” with the playback. The half note fills a complete measure.",
      staff:{clef:"treble",tempo:92,time:"2/4",notes:[{p:"C4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{bar:"single"},{p:"G4",d:"q",label:"1"},{p:"E4",d:"q",label:"2"},{bar:"single"},{p:"C4",d:"h",label:"1-2"},{bar:"final"}],width:440} },
    { caption:"Rests in 2/4: the quarter rest takes 1 beat; a full measure of silence is written with the whole rest.",
      staff:{clef:"treble",tempo:92,time:"2/4",notes:[{p:"D4",d:"q",label:"1"},{rest:"q",label:"2"},{bar:"single"},{rest:"w",label:"1-2"},{bar:"single"},{p:"D4",d:"h",label:"1-2"},{bar:"final"}],width:440} }
  ],
  games:[
    { type:"rhythm-tap", title:"Game 1 · 2/4 Rhythm Tap",
      intro:"Listen to a 2/4 measure, then tap it back precisely. The count-off gives you the tempo.",
      miaIntro:"Two-beat measures — listen, then tap. \u{1F3AF}",
      spec:{tempo:92, rounds:3, beatsPerBar:2, patterns:[["q","q"],["h"],["q","rq"],["rq","q"]]},
      result:(score)=>score>=4?"Precise tapping in 2/4 — well done.":null },
    { type:"measure-judge", title:"Game 2 · Correct or Incorrect?",
      intro:"Does each measure hold exactly <b>2 beats</b>?",
      miaIntro:"Check every measure against the top number. \u{1F50D}",
      spec:{rounds:8, beats:2},
      result:(score)=>score>=7?"Sharp beat-counting — barely a miss.":null },
    { type:"measure-build", title:"Game 3 · Complete the Measure",
      intro:"Fill 2/4 measures with exactly <b>2 beats</b>, using the note cards. Find both combinations.",
      miaIntro:"Build with the cards — exactly two beats. \u{1F3D7}\u{FE0F}",
      spec:{beats:2, unique:true, rounds:2},
      result:(stars)=>stars>=3?"Both combinations found without overflow.":null },
    { type:"symbol-hunt", title:"Game 4 · Time Signature Identification",
      intro:"2/4, 3/4, 4/4 and C — identify the one named. Read the top number carefully.",
      miaIntro:"Identify each signature at sight. \u{1F3AF}",
      spec:{rounds:6, pool:[
        {label:"2/4 Time Signature", spec:{clef:"treble",time:"2/4",notes:[]}},
        {label:"3/4 Time Signature", spec:{clef:"treble",time:"3/4",notes:[]}},
        {label:"4/4 Time Signature", spec:{clef:"treble",time:"4/4",notes:[]}},
        {label:"Common Time (C)", spec:{clef:"treble",time:"C",notes:[]}}]},
      result:(score)=>score>=5?"Every signature identified correctly.":null }
  ],
  practiceIntro:"20 practice questions — definitions, beat values, and measure checking in 2/4. Answer correctly and the next appears automatically.",
  practice:[
    { gen:"measure-complete", params:{beats:2}, count:4 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:2}, count:3 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"measure-count", params:{min:2,max:4}, count:2 },
    { type:"mc", q:"In 2/4 time, the top number 2 means…", choices:["there are 2 beats per measure","the half note receives one beat","the piece has 2 measures"], answer:0,
      explain:"Top number = beats per measure." },
    { type:"mc", q:"In 2/4 time, the bottom number 4 means…", choices:["the quarter note receives 1 beat","there are 4 beats per measure","play at a moderate speed"], answer:0,
      explain:"Bottom 4 = quarter note gets the beat, as in 4/4." },
    { type:"mc", q:"The difference between 2/4 and 4/4 is…", choices:["the number of beats per measure","which note receives the beat","the pitch of the notes"], answer:0,
      explain:"2 beats versus 4 — the beat note is the same." },
    { type:"truefalse", q:"In 2/4 time, a half note receives 2 beats.", answer:true,
      explain:"It fills a complete 2/4 measure." },
    { type:"truefalse", q:"A whole rest is used for a full measure of rest in 2/4 time.", answer:true,
      explain:"The whole rest fills any full measure — even a 2-beat one." },
    { type:"truefalse", q:"A half rest may be written in 2/4 time.", answer:false,
      explain:"By convention, half rests and whole notes are never used in 2/4." },
    { type:"truefalse", q:"A whole note may be written in 2/4 time.", answer:false,
      explain:"Four beats cannot fit a two-beat measure." },
    { type:"mc", q:"Counting in 2/4 is written…", choices:["1 2 | 1 2","1 2 3 | 1 2 3","1 2 3 4"], answer:0,
      explain:"Two counts per measure, restarting after each bar line." },
    { type:"mc", q:"Which fills one complete 2/4 measure?", choices:["Half note","Whole note","Half note + quarter note"], answer:0,
      explain:"Exactly 2 beats. The others give 4 and 3." },
    /* — from the unit review sheet — */
    { type:"mc", q:"In 2/4 time, a whole rest receives ____ beats.", choices:["2 — it fills the whole measure","4","1"], answer:0, explain:"The whole rest always fills the FULL measure — in 2/4 that is 2 beats." },
    { type:"mc", q:"Which time signature fits a measure containing two quarter notes only?", choices:["2/4","3/4","4/4"], answer:0, explain:"1 + 1 = 2 beats — a 2/4 measure." }
  ],
  miaQuizIntro:"Quiz time — twenty questions on 2/4. Count carefully.",
  quiz:[
    { type:"mc", q:"How many beats are in one measure of 2/4 time?", choices:["1","2","3","4"], answer:1,
      explain:"The top number says 2.", hint:"Read the top number." },
    { type:"mc", q:"In 2/4 time, which note receives one beat?", choices:["Whole Note","Half Note","Quarter Note","Eighth Note"], answer:2,
      explain:"The bottom 4 assigns the beat to the quarter note.", hint:"Read the bottom number." },
    { type:"truefalse", q:"The top number of a time signature tells how many beats are in each measure.", answer:true,
      explain:"Top = how many; bottom = which note.", hint:"Same rule as 4/4." },
    { type:"truefalse", q:"A measure of 2/4 time contains three beats.", answer:false,
      explain:"Two beats.", hint:"The top number." },
    { type:"mc", q:"2/4 and 4/4 both have 4 as the bottom number. This means…", choices:["a quarter note receives 1 beat in both","both have 4 beats per measure","both are played at the same speed"], answer:0,
      explain:"The shared bottom number fixes the beat note.", hint:"What does the bottom number control?" },
    { type:"mc", q:"In 2/4 time, a half note receives…", choices:["1 beat","2 beats","4 beats"], answer:1,
      explain:"Two beats — a complete measure.", hint:"Note values do not change." },
    { type:"mc", q:"For a FULL measure of rest in 2/4 time, use…", choices:["a whole rest","a half rest","two eighth rests"], answer:0,
      explain:"The whole rest marks a full measure of silence in any meter.", hint:"The full-measure silence rule." },
    { type:"mc", q:"Which two symbols are NEVER used in writing 2/4 time?", choices:["Half rest and whole note","Quarter rest and quarter note","Whole rest and half note"], answer:0,
      explain:"The whole rest replaces the half rest for full-measure silence; the whole note cannot fit.", hint:"One rest, one note." },
    { type:"mc", q:"How many measures are shown?",
      staff:{clef:"treble",time:"2/4",notes:[{p:"B4",d:"q"},{p:"B4",d:"q"},{bar:"single"},{p:"B4",d:"h"},{bar:"single"},{p:"B4",d:"q"},{rest:"q"},{bar:"final"}],width:400},
      choices:["2","3","4"], answer:1,
      explain:"Three measures of two beats each.", hint:"Count the spaces between bar lines." },
    { type:"truefalse", q:"This measure is complete.",
      staff:{clef:"treble",time:"2/4",notes:[{p:"B4",d:"q"},{bar:"final"}],width:260},
      answer:false,
      explain:"Only 1 beat — 2/4 requires exactly 2.", hint:"Compare with the top number." },
    { type:"mc", q:"Which completes a 2/4 measure that already contains one quarter note?",
      choices:["One quarter note or one quarter rest","One half note","One whole rest"], answer:0,
      explain:"1 + 1 = 2. A half note would overflow to 3.", hint:"Supply exactly one beat." },
    { type:"mc", q:"Which statement is correct?",
      choices:["A quarter note has a different value in 2/4 than in 4/4","The quarter note equals one beat in both 2/4 and 4/4","2/4 and 4/4 have the same number of beats per measure","A measure of 2/4 contains four beats"], answer:1,
      explain:"The bottom 4 keeps the quarter note as the beat; only the measure length differs.",
      hint:"The shared bottom number." },
    /* generated */
    { gen:"measure-complete", params:{beats:2}, count:3 },
    { gen:"rhythm-count", params:{values:["h","q"],maxNotes:2}, count:2 },
    { gen:"note-value", params:{ask:"beats"}, count:2 },
    { gen:"note-name", params:{clef:"treble"}, count:1 }
  ],
  vocabulary:[
    {def:"Two beats per measure; the quarter note receives one beat.", term:"2/4 Time", staff:{clef:"none",time:"2/4",notes:[],width:140}},
    {def:"Contains two numbers: the upper tells how many beats are in each measure, the lower indicates what type of note receives 1 beat.", term:"Time Signature"},
    {def:"Means to rest for a whole measure — in 2/4 it receives 2 beats.", term:"Whole Rest", staff:{clef:"none",notes:[{rest:"w"}],width:140}},
    {def:"Not used in 2/4 time — a measure holds only two beats.", term:"Half Rest · Whole Note"}
  ],
  mistakes:[],
  summary:[
    "✔ <b>2/4</b>: 2 = <b>two beats per measure</b>; 4 = the <b>quarter note receives 1 beat</b>.",
    "✔ 2/4 and 4/4 share the bottom 4 — only the <b>measure length</b> differs.",
    "✔ ♩ or ♩-rest = 1 beat; half note = 2 beats.",
    "✔ A <b>whole rest</b> marks a full measure of silence — even in 2/4.",
    "✔ A <b>half rest</b> and a <b>whole note</b> are never used in 2/4 time."
  ],
  tips:[
    "Count aloud in twos — “1 2 | 1 2” — and let the bar line restart the count.",
    "Checking a measure? Add every note AND rest, then compare with the top number.",
    "Remember the writing rule: full-measure silence = whole rest, in every meter.",
    "Next lesson: the same system with three beats — 3/4 time."
  ],
  rewards:{ badge:"2/4 Time Expert", icon:"\u{1F4CF}" },
  sectionOrder:["secHook","secObjectives","secLearn","secExample","secReview",
    "secGame0","secGame1","secGame2","secGame3","secPractice","secQuiz","secTips","secNext"],
  miaPerfect:"A perfect score on 2/4 — definitions, values and rules all in place. 3/4 is next. \u{1F389}",
  miaPass:"Passed. Review the summary if you like, or retry for a perfect run — several questions regenerate each attempt.",
  mia:{
    hook:{ label:"the welcome",
      explain:"The example repeats its pattern every two beats — the defining feature of 2/4 time.",
      play:()=>{const s=.62;for(let k=0;k<6;k++) MFAudio.click(k*s,k%2===0?.55:.3,k%2===0);} },
    learn:{ label:"2/4 time",
      explain:"2 = two beats per measure; 4 = quarter note receives one beat. Whole rest for a full silent measure; half rest and whole note are not written in 2/4.",
      hint:"Compare every measure with the top number.",
      play:()=>{const s=.6;[60,64].forEach((m,i)=>MFAudio.tone(m,s*.9,i*s));[67,64].forEach((m,i)=>MFAudio.tone(m,s*.9,(2+i)*s));} },
    example:{ label:"the examples",
      explain:"Both examples count in twos; note the whole rest filling a complete silent measure in example 2." },
    game:{ label:"the games",
      explain:"Tap 2/4 rhythms, judge measures against the top number, complete measures with the cards, and identify signatures at sight.",
      hint:"Everything rests on one comparison: the measure total versus the top number." },
    quiz:{ label:"this question",
      explain:"Two definitions and two writing rules cover this quiz: 2 beats per measure, quarter note = 1 beat, whole rest for full silence, no half rest / whole note in 2/4.",
      play:()=>{MFAudio.click(0,.55,true);MFAudio.click(.6,.3);} }
  }
};
