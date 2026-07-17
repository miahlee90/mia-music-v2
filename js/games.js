/* Music Fundamentals — mini-game library (DD-17). Low-pressure: session scores only.
   v3 (Milestone 2, Session 13): adds note-race, alphabet-order, memory-match,
   clef-note, find-c, ledger-count, high-low-staff, pattern-fill;
   line-space now supports {clef:"bass"}; exposes Games.has(type) for validation.
   v4 (Milestone 3, Session 15): adds value-race (note value ↔ beats),
   rhythm-tap (tap a rhythm in time, Web Audio timing), measure-build
   (fill a measure with exactly N beats; find every combination).
   v4.1 (Milestone 3b): value-race/rhythm-tap/measure-build support RESTS
   (spec.kind:"rest"; patterns "rq"/"rh"/"rw"; spec.rests+needRest);
   new games: measure-count, symbol-hunt, measure-judge.
   v5 (Units 3-6): tokens support eighths ("8") and dotted values ("h.","q.")
   across value-race / rhythm-tap / measure-build (custom button sets via
   spec.buttons); symbol-hunt accepts {label,html} text cards; NEW games:
   term-race (term ↔ meaning speed quiz) and order-tap (tap items in order).
   NOTE (maintenance): edit by FULL-FILE REWRITE only. */
const Games=(()=>{
  const LETTERS=["A","B","C","D","E","F","G"];
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  /* 7 letter buttons A–G */
  function letterRow(parent,onPick){
    const row=document.createElement("div"); row.className="gbtns"; row.style.display="none";
    LETTERS.forEach(l=>{ const b=document.createElement("button"); b.textContent=l; b.onclick=()=>onPick(l); row.appendChild(b); });
    parent.appendChild(row); return row;
  }
  const VAL_NAME={w:"Whole Note",h:"Half Note",q:"Quarter Note","8":"Eighth Note","16":"Sixteenth Note","h.":"Dotted Half Note","q.":"Dotted Quarter Note","8.":"Dotted Eighth Note"};
  const VAL_BEATS={w:4,h:2,q:1,"8":0.5,"16":0.25,"h.":3,"q.":1.5,"8.":0.75};
  const BEATLBL={0.25:"¼ beat",0.5:"½ beat",0.75:"¾ beat",1:"1 beat",1.5:"1½ beats",2:"2 beats",3:"3 beats",4:"4 beats"};
  const tokDot=t=>t.endsWith("."), tokBase=t=>t.replace(".","");
  const tokItem=(t,p)=>({p:p||"B4",d:tokBase(t),dot:tokDot(t)});
  const registry={

    /* Higher or Lower? — ear training. spec:{rounds:5} */
    "higher-lower":(el,spec,onFinish)=>{
      const rounds=spec.rounds||5;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start round</button>
        <div class="big-q gq"></div>
        <div class="gbtns" style="display:none"><button class="gh">⬆ Higher</button> <button class="gl">⬇ Lower</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,streak=0,best=0,pair=null;
      $(".gstart").onclick=()=>{
        round++;
        if(round>rounds){ $(".gq").textContent=`Game over — best streak: ${best} 🎉`;
          $(".gbtns").style.display="none"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(best,rounds); round=0;streak=0; return; }
        const a=57+Math.floor(Math.random()*12), b=a+(Math.random()<.5?-1:1)*(2+Math.floor(Math.random()*10));
        pair=[a,b]; MFAudio.tone(a,.5,0); MFAudio.tone(b,.5,.65);
        $(".gq").textContent=`Round ${round} of ${rounds} — listening…`;
        setTimeout(()=>{ $(".gq").textContent="Was the second sound higher or lower?"; $(".gbtns").style.display="block"; },1300);
      };
      function ans(saidHigher){
        const ok=(pair[1]>pair[0])===saidHigher;
        if(ok){streak++;best=Math.max(best,streak);$(".gq").textContent="✓ Correct!";}
        else{streak=0;$(".gq").textContent="✗ Oops — listen closely next round!";}
        $(".gs").textContent=`Streak: ${streak} · Best: ${best}`;
        $(".gbtns").style.display="none";
        $(".gstart").textContent=round>=rounds?"▶ See result":"▶ Next round";
      }
      $(".gh").onclick=()=>ans(true); $(".gl").onclick=()=>ans(false);
    },

    /* Line or Space? — random note appears, choose. spec:{rounds:10, clef:"treble"|"bass"} */
    "line-space":(el,spec,onFinish)=>{
      const rounds=spec.rounds||10, clef=spec.clef||"treble";
      const POS={ treble:{lines:[["E4",1],["G4",2],["B4",3],["D5",4],["F5",5]], spaces:[["F4",1],["A4",2],["C5",3],["E5",4]]},
                  bass:  {lines:[["G2",1],["B2",2],["D3",3],["F3",4],["A3",5]], spaces:[["A2",1],["C3",2],["E3",3],["G3",4]]} };
      const LINES=POS[clef].lines, SPACES=POS[clef].spaces;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns" style="display:none"><button class="gline">— Line</button> <button class="gspace">◽ Space</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,score=0,streak=0,cur=null;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! You got <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; $(".gbtns").style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0;streak=0; return; }
        const isLine=Math.random()<.5;
        cur=isLine?["line",...pick(LINES)]:["space",...pick(SPACES)];
        Staff.render($(".gstaff"),{clef,notes:[{p:cur[1],d:"q"}],width:260});
        $(".gq").textContent=`Round ${round} of ${rounds}: is this note on a LINE or in a SPACE?`;
        $(".gbtns").style.display="block";
      }
      function ans(said){
        const ok=said===cur[0];
        MFAudio.tone(MFAudio.midi(cur[1]),.4);
        if(ok){score++;streak++;$(".gq").textContent=`✓ Yes — ${cur[0]==="line"?"Line":"Space"} ${cur[2]}!`;}
        else{streak=0;$(".gq").textContent=`✗ It's ${cur[0]==="line"?"Line":"Space"} ${cur[2]} — see how it ${cur[0]==="line"?"crosses the line":"sits between lines"}?`;}
        $(".gs").textContent=`Score: ${score} · Streak: ${streak}`;
        $(".gbtns").style.display="none";
        setTimeout(ask, ok?800:1800);
      }
      $(".gline").onclick=()=>ans("line"); $(".gspace").onclick=()=>ans("space");
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0;streak=0; ask(); };
    },

    /* Build the Staff — tap the lines in order, bottom-up. spec:{timer:0|seconds} */
    "build-staff":(el,spec,onFinish)=>{
      const timed=spec.timer||0;
      const PITCH={1:64,2:67,3:71,4:74,5:77};
      el.innerHTML=`<div class="game-arena">
        <div class="big-q gq">${timed?`Build the staff before the timer runs out! (${timed}s)`:"Build the staff: tap the lines in order — bottom first!"}</div>
        <div class="bs-slots"></div>
        <div class="bs-pile"></div>
        <div class="streak gs"></div>
        <button class="play gstart">▶ Start building</button></div>`;
      const $=s=>el.querySelector(s);
      const slots=$(".bs-slots"), pile=$(".bs-pile");
      let placed=0,mistakes=0,left=timed,tick=null,running=false;
      function setup(){
        placed=0;mistakes=0;left=timed;running=true;
        slots.innerHTML="";
        for(let i=5;i>=1;i--){ const s=document.createElement("div"); s.className="bs-slot"; s.dataset.n=i; s.innerHTML="<span>line "+i+"</span>"; slots.appendChild(s); }
        pile.innerHTML="";
        [1,2,3,4,5].sort(()=>Math.random()-.5).forEach(n=>{
          const b=document.createElement("button"); b.className="bs-bar"; b.textContent="Line "+n; b.dataset.n=n;
          b.onclick=()=>place(b,n); pile.appendChild(b);
        });
        $(".gs").textContent=timed?`⏱ ${left}s`:"";
        if(timed){ clearInterval(tick); tick=setInterval(()=>{ left--; $(".gs").textContent=`⏱ ${left}s`;
          if(left<=0){ clearInterval(tick); running=false;
            $(".gq").textContent="⏰ Time's up! Bottom line first — try again!";
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Try again"; }
        },1000); }
      }
      function place(btn,n){
        if(!running) return;
        if(n===placed+1){
          placed++; btn.disabled=true; btn.style.visibility="hidden";
          const slot=slots.querySelector(`.bs-slot[data-n="${n}"]`);
          slot.classList.add("filled"); slot.innerHTML="";
          MFAudio.tone(PITCH[n],.35);
          if(placed===5){
            running=false; clearInterval(tick);
            const stars = timed ? (left>=15?3:left>=5?2:1) : (mistakes===0?3:mistakes<=2?2:1);
            $(".gq").innerHTML=`🎉 Staff complete! You earned ${"⭐".repeat(stars)}`;
            [64,67,71,74,77].forEach((m,i)=>MFAudio.tone(m,.3,.3+i*.12));
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Build again";
            if(onFinish)onFinish(stars,3);
          }
        } else {
          mistakes++;
          btn.classList.add("shake"); setTimeout(()=>btn.classList.remove("shake"),450);
          MFAudio.tone(40,.25);
          $(".gq").textContent=`Not yet — line ${placed+1} comes next (count from the BOTTOM).`;
        }
      }
      $(".gstart").onclick=function(){ this.style.display="none"; $(".gq").textContent=timed?"Go! Bottom line first!":"Tap the lines in order — bottom first!"; setup(); };
    },

    /* Key hunt — find all keys of a letter. spec:{letter?,octaves:2} */
    "key-hunt":(el,spec,onFinish)=>{
      const letter=spec.letter||pick(["C","D","E","F","G","A","B"]);
      el.innerHTML=`<div class="game-arena"><div class="big-q gq">Find every <b>${letter}</b> on the keyboard!</div>
        <div class="gkb"></div><div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const start=60, map={C:0,D:2,E:4,F:5,G:7,A:9,B:11}, targets=[];
      for(let m=start;m<=start+24;m++) if(m%12===map[letter]) targets.push(m);
      let found=[];
      Keyboard.create($(".gkb"),{start,octaves:2,onKey:m=>{
        if(targets.includes(m)&&!found.includes(m)){ found.push(m);
          $(".gs").textContent=`Found ${found.length} of ${targets.length}`;
          if(found.length===targets.length){ $(".gq").innerHTML=`✓ You found them all! Every ${letter} sits in the same spot of its black-key group. 🎉`; if(onFinish)onFinish(targets.length,targets.length); }
        } else if(!targets.includes(m)) $(".gs").textContent="Not that one — check the black-key groups!";
      }});
    },

    /* Name That Note race. spec:{pool:[{p,clef}], rounds:10, seconds:0}
       seconds>0 = answer as many as possible before time runs out */
    "note-race":(el,spec,onFinish)=>{
      const pool=spec.pool||[{p:"E4",clef:"treble"},{p:"G4",clef:"treble"},{p:"B4",clef:"treble"},{p:"D5",clef:"treble"},{p:"F5",clef:"treble"},{p:"F4",clef:"treble"},{p:"A4",clef:"treble"},{p:"C5",clef:"treble"},{p:"E5",clef:"treble"}];
      const rounds=spec.rounds||10, secs=spec.seconds||0;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ ${secs?`Start the ${secs}-second challenge`:"Start"}</button>
        <div class="big-q gq"></div><div class="gstaff"></div><div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const row=letterRow(el.querySelector(".game-arena"),ans);
      let cur=null,score=0,asked=0,streak=0,left=secs,tick=null,running=false,waiting=false;
      function ask(){
        if(!running) return;
        if(!secs&&asked>=rounds){ end(); return; }
        let nxt=pick(pool); if(cur&&pool.length>1){ let guard=0; while(nxt.p===cur.p&&guard++<8) nxt=pick(pool); }
        cur=nxt; waiting=false;
        Staff.render($(".gstaff"),{clef:cur.clef||"treble",notes:[{p:cur.p,d:"q"}],width:260});
        $(".gq").textContent=secs?`Name the note!`:`Note ${asked+1} of ${rounds}: name it!`;
      }
      function ans(l){
        if(!running||waiting) return;
        waiting=true; asked++;
        const ok=l===cur.p[0];
        MFAudio.tone(MFAudio.midi(cur.p),.4);
        if(ok){ score++; streak++; $(".gq").textContent=`✓ Yes — ${cur.p[0]}!`; }
        else { streak=0; $(".gq").textContent=`✗ It's ${cur.p[0]} — count from the bottom!`; }
        $(".gs").textContent=(secs?`⏱ ${left}s · `:"")+`Score: ${score} · Streak: ${streak}`;
        setTimeout(ask, ok?550:1500);
      }
      function end(){
        running=false; clearInterval(tick); row.style.display="none"; $(".gstaff").innerHTML="";
        $(".gq").innerHTML=secs?`⏰ Time! You named <b>${score}</b> notes correctly 🎉`:`Done! <b>${score}</b> of ${rounds} 🎉`;
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(score,secs||rounds);
      }
      $(".gstart").onclick=function(){
        this.style.display="none"; score=0;asked=0;streak=0;left=secs;running=true; row.style.display="block";
        $(".gs").textContent=secs?`⏱ ${left}s`:"";
        if(secs){ clearInterval(tick); tick=setInterval(()=>{ left--;
          $(".gs").textContent=`⏱ ${left}s · Score: ${score} · Streak: ${streak}`;
          if(left<=0) end(); },1000); }
        ask();
      };
    },

    /* Musical Alphabet Race — tap A…G in order. spec:{timer:0|seconds} */
    "alphabet-order":(el,spec,onFinish)=>{
      const timed=spec.timer||0;
      const MIDI={A:57,B:59,C:60,D:62,E:64,F:65,G:67};
      el.innerHTML=`<div class="game-arena">
        <div class="big-q gq">${timed?`Arrange the musical alphabet before ${timed} seconds run out!`:"Tap the 7 letters in musical-alphabet order — A first!"}</div>
        <div class="gslots" style="min-height:40px;font-size:1.4rem;font-weight:700;letter-spacing:8px;margin:10px 0"></div>
        <div class="gbtns gpile" style="display:block"></div>
        <div class="streak gs"></div>
        <button class="play gstart">▶ Start</button></div>`;
      const $=s=>el.querySelector(s);
      let next=0,mistakes=0,left=timed,tick=null,running=false;
      function setup(){
        next=0;mistakes=0;left=timed;running=true;
        $(".gslots").textContent="_ _ _ _ _ _ _";
        const pile=$(".gpile"); pile.innerHTML="";
        shuffle(LETTERS).forEach(l=>{ const b=document.createElement("button"); b.textContent=l;
          b.onclick=()=>place(b,l); pile.appendChild(b); });
        $(".gs").textContent=timed?`⏱ ${left}s`:"";
        if(timed){ clearInterval(tick); tick=setInterval(()=>{ left--; $(".gs").textContent=`⏱ ${left}s`;
          if(left<=0){ clearInterval(tick); running=false;
            $(".gq").textContent="⏰ Time's up! A-B-C-D-E-F-G — try again!";
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Try again"; }
        },1000); }
      }
      function place(btn,l){
        if(!running||btn.disabled) return;
        if(l===LETTERS[next]){
          next++; btn.disabled=true; MFAudio.tone(MIDI[l],.3);
          $(".gslots").textContent=(LETTERS.slice(0,next).join(" ")+" "+"_ ".repeat(7-next)).trim();
          if(next===7){
            running=false; clearInterval(tick);
            const stars=timed?(left>=timed/2?3:left>=3?2:1):(mistakes===0?3:mistakes<=2?2:1);
            $(".gq").innerHTML=`🎉 A-B-C-D-E-F-G — and after G it starts over at A! ${"⭐".repeat(stars)}`;
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
            if(onFinish)onFinish(stars,3);
          }
        } else {
          mistakes++; MFAudio.tone(40,.25);
          btn.classList.add("shake"); setTimeout(()=>btn.classList.remove("shake"),450);
          $(".gq").textContent=`Not yet — ${LETTERS[next]} comes next.`;
        }
      }
      $(".gstart").onclick=function(){ this.style.display="none"; $(".gq").textContent=timed?"Go! A first!":"Tap the letters in order — A first!"; setup(); };
    },

    /* Memory Match — staff-note cards ↔ letter cards. spec:{pool:[{p,clef}], pairs:4} */
    "memory-match":(el,spec,onFinish)=>{
      const pairs=spec.pairs||4;
      const basePool=spec.pool||[{p:"E4",clef:"treble"},{p:"G4",clef:"treble"},{p:"B4",clef:"treble"},{p:"F4",clef:"treble"},{p:"A4",clef:"treble"},{p:"C5",clef:"treble"}];
      el.innerHTML=`<div class="game-arena">
        <div class="big-q gq">Match each staff note with its letter name!</div>
        <div class="mm-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:460px;margin:12px auto"></div>
        <div class="streak gs"></div>
        <button class="play gstart">▶ Start</button></div>`;
      const $=s=>el.querySelector(s);
      const grid=$(".mm-grid");
      let first=null,lock=false,moves=0,matched=0;
      function setup(){
        first=null;lock=false;moves=0;matched=0;
        const seen=new Set(), notes=[];
        shuffle(basePool).forEach(n=>{ if(notes.length<pairs&&!seen.has(n.p[0])){ seen.add(n.p[0]); notes.push(n); } });
        const cards=[];
        notes.forEach(n=>{ cards.push({kind:"staff",note:n,letter:n.p[0]}); cards.push({kind:"letter",letter:n.p[0]}); });
        grid.innerHTML="";
        shuffle(cards).forEach(c=>{
          const b=document.createElement("button");
          b.style.cssText="min-height:86px;font-size:1.5rem;font-weight:700;border-radius:10px";
          b.textContent="?"; b._card=c;
          b.onclick=()=>flip(b); grid.appendChild(b);
        });
        $(".gs").textContent="Moves: 0";
      }
      function showFace(b){
        const c=b._card;
        if(c.kind==="letter"){ b.textContent=c.letter; }
        else { b.textContent=""; const d=document.createElement("div"); b.appendChild(d);
          Staff.render(d,{clef:c.note.clef||"treble",notes:[{p:c.note.p,d:"q"}],width:150}); }
      }
      function hideFace(b){ b.textContent="?"; }
      function flip(b){
        if(lock||b.disabled||b===first) return;
        showFace(b);
        if(!first){ first=b; return; }
        moves++; $(".gs").textContent=`Moves: ${moves}`;
        const a=first._card,c=b._card;
        if(a.letter===c.letter&&a.kind!==c.kind){
          MFAudio.tone(MFAudio.midi(a.letter+"4"),.4);
          b.disabled=true; first.disabled=true;
          b.style.borderColor="#3a9b57"; first.style.borderColor="#3a9b57";
          matched++; first=null;
          if(matched===pairs){
            const stars=moves<=pairs+1?3:moves<=pairs+3?2:1;
            $(".gq").innerHTML=`🎉 All matched in ${moves} moves! ${"⭐".repeat(stars)}`;
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
            if(onFinish)onFinish(stars,3);
          }
        } else {
          lock=true; const f=first; first=null;
          setTimeout(()=>{ hideFace(b); hideFace(f); lock=false; },900);
        }
      }
      $(".gstart").onclick=function(){ this.style.display="none"; $(".gq").textContent="Find the pairs — fewest moves wins!"; setup(); };
    },

    /* Treble vs Bass Challenge — identify the clef, then the note. spec:{rounds:6} */
    "clef-note":(el,spec,onFinish)=>{
      const rounds=spec.rounds||6;
      const POOLS={ treble:["E4","G4","B4","D5","F5","F4","A4","C5","E5"],
                    bass:["G2","B2","D3","F3","A3","A2","C3","E3","G3"] };
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns gclefs" style="display:none"><button class="gt">𝄞 Treble</button> <button class="gb2">𝄢 Bass</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const row=letterRow(el.querySelector(".game-arena"),ansNote);
      let round=0,score=0,cur=null,cleanRound=true;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! Perfect rounds: <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; row.style.display="none"; $(".gclefs").style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        const clef=pick(["treble","bass"]);
        cur={clef,p:pick(POOLS[clef])}; cleanRound=true;
        Staff.render($(".gstaff"),{clef,notes:[{p:cur.p,d:"q"}],width:260});
        $(".gq").textContent=`Round ${round} of ${rounds}: which CLEF is this?`;
        $(".gclefs").style.display="block"; row.style.display="none";
      }
      function ansClef(said){
        if(said===cur.clef){ $(".gq").textContent="✓ Right clef! Now — name the note:"; }
        else { cleanRound=false; $(".gq").textContent=`✗ Look again — ${cur.clef==="treble"?"the swirl marks G (treble)":"the two dots mark F (bass)"}. Now name the note:`; }
        $(".gclefs").style.display="none"; row.style.display="block";
      }
      function ansNote(l){
        const ok=l===cur.p[0];
        MFAudio.tone(MFAudio.midi(cur.p),.4);
        if(!ok) cleanRound=false;
        if(ok&&cleanRound) score++;
        $(".gq").textContent=ok?`✓ ${cur.p[0]} on the ${cur.clef} staff!`:`✗ It's ${cur.p[0]} — remember which clef you're in!`;
        $(".gs").textContent=`Perfect rounds: ${score}`;
        row.style.display="none";
        setTimeout(ask, ok?700:1700);
      }
      $(".gt").onclick=()=>ansClef("treble"); $(".gb2").onclick=()=>ansClef("bass");
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Find Middle C — click the Middle C among several notes on the grand staff. spec:{rounds:5} */
    "find-c":(el,spec,onFinish)=>{
      const rounds=spec.rounds||5;
      const DISTR=[{p:"B3",clef:"treble"},{p:"D4",clef:"treble"},{p:"E4",clef:"treble"},{p:"G4",clef:"treble"},
                   {p:"A3",clef:"bass"},{p:"G3",clef:"bass"},{p:"E3",clef:"bass"},{p:"B2",clef:"bass"},{p:"D3",clef:"bass"}];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div><div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,score=0,answered=false;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! You spotted Middle C <b>${score}</b> of ${rounds} times 🎉`;
          $(".gstaff").innerHTML="";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        answered=false;
        const notes=shuffle([{p:"C4",clef:pick(["treble","bass"])},...shuffle(DISTR).slice(0,3)]);
        Staff.render($(".gstaff"),{clef:"grand",notes:notes.map(n=>({p:n.p,d:"q",clef:n.clef})),clickNotes:true,width:420,
          onNote:(i,p)=>{
            if(answered) return; answered=true;
            MFAudio.tone(MFAudio.midi(p),.5);
            if(p==="C4"){ score++; $(".gq").textContent="✓ That's Middle C — on its own little ledger line between the staffs!"; }
            else $(".gq").textContent=`✗ That one is ${p[0]} — Middle C sits on a short ledger line between the two staffs.`;
            $(".gs").textContent=`Score: ${score}`;
            setTimeout(ask, p==="C4"?800:1800);
          }});
        $(".gq").textContent=`Round ${round} of ${rounds}: click MIDDLE C!`;
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Ledger-line counting — how many ledger lines does this note use? spec:{rounds:8, pool} */
    "ledger-count":(el,spec,onFinish)=>{
      const rounds=spec.rounds||8;
      const pool=spec.pool||[
        {p:"E4",clef:"treble",n:0},{p:"G5",clef:"treble",n:0},{p:"C4",clef:"treble",n:1},
        {p:"A5",clef:"treble",n:1},{p:"C6",clef:"treble",n:2},{p:"E6",clef:"treble",n:3},
        {p:"C3",clef:"bass",n:0},{p:"E2",clef:"bass",n:1},{p:"C2",clef:"bass",n:2},{p:"A1",clef:"bass",n:3}];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns gnums" style="display:none"><button>0</button><button>1</button><button>2</button><button>3</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,score=0,cur=null;
      [...el.querySelectorAll(".gnums button")].forEach((b,i)=>b.onclick=()=>ans(i));
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; $(".gnums").style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        let nxt=pick(pool); if(cur&&pool.length>1){ let g=0; while(nxt.p===cur.p&&g++<8) nxt=pick(pool); }
        cur=nxt;
        Staff.render($(".gstaff"),{clef:cur.clef,notes:[{p:cur.p,d:"q"}],width:260});
        $(".gq").textContent=`Round ${round} of ${rounds}: how many LEDGER lines does this note use?`;
        $(".gnums").style.display="block";
      }
      function ans(i){
        const ok=i===cur.n;
        MFAudio.tone(MFAudio.midi(cur.p),.4);
        if(ok){ score++; $(".gq").textContent=`✓ Yes — ${cur.n===0?"it fits on the staff, no ledger lines needed":cur.n+" ledger line"+(cur.n>1?"s":"")}!`; }
        else $(".gq").textContent=`✗ Count the short extra lines: ${cur.n}.`;
        $(".gs").textContent=`Score: ${score}`;
        $(".gnums").style.display="none";
        setTimeout(ask, ok?800:1800);
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* High or Low? — above the treble staff or below the bass staff. spec:{rounds:8} */
    "high-low-staff":(el,spec,onFinish)=>{
      const rounds=spec.rounds||8;
      const HIGH=["A5","B5","C6","D6","E6"], LOW=["E2","D2","C2","B1","A1"];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns" style="display:none"><button class="gh2">⬆ Above the treble staff</button> <button class="gl2">⬇ Below the bass staff</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,score=0,cur=null;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; $(".gbtns").style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        const isHigh=Math.random()<.5;
        cur={p:pick(isHigh?HIGH:LOW), high:isHigh};
        Staff.render($(".gstaff"),{clef:"grand",notes:[{p:cur.p,d:"q",clef:isHigh?"treble":"bass"}],width:300});
        MFAudio.tone(MFAudio.midi(cur.p),.5);
        $(".gq").textContent=`Round ${round} of ${rounds}: where does this note live?`;
        $(".gbtns").style.display="block";
      }
      function ans(saidHigh){
        const ok=saidHigh===cur.high;
        if(ok){ score++; $(".gq").textContent=`✓ Yes — ${cur.high?"climbing above the treble staff":"digging below the bass staff"}!`; }
        else $(".gq").textContent=`✗ Listen and look again — it's ${cur.high?"ABOVE the treble staff":"BELOW the bass staff"}.`;
        $(".gs").textContent=`Score: ${score}`;
        $(".gbtns").style.display="none";
        setTimeout(ask, ok?800:1800);
      }
      $(".gh2").onclick=()=>ans(true); $(".gl2").onclick=()=>ans(false);
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Complete the Pattern — fill the missing letter in an alphabet run. spec:{rounds:6} */
    "pattern-fill":(el,spec,onFinish)=>{
      const rounds=spec.rounds||6;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div>
        <div class="gslots" style="font-size:1.6rem;font-weight:700;letter-spacing:10px;margin:10px 0"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const row=letterRow(el.querySelector(".game-arena"),ans);
      let round=0,score=0,answer=null;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} — the alphabet never changes 🎉`;
          $(".gslots").textContent=""; row.style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        const start=Math.floor(Math.random()*7), seq=[];
        for(let i=0;i<4;i++) seq.push(LETTERS[(start+i)%7]);
        const blank=1+Math.floor(Math.random()*3);
        answer=seq[blank];
        $(".gslots").textContent=seq.map((l,i)=>i===blank?"?":l).join(" ");
        $(".gq").textContent=`Round ${round} of ${rounds}: which letter is missing? (after G comes A)`;
        row.style.display="block";
      }
      function ans(l){
        const ok=l===answer;
        if(ok){ score++; MFAudio.tone(MFAudio.midi((l==="A"||l==="B")?l+"3":l+"4"),.35); $(".gq").textContent="✓ The pattern continues perfectly!"; }
        else { MFAudio.tone(40,.25); $(".gq").textContent=`✗ It's ${answer} — say the alphabet from the letter before the blank.`; }
        $(".gs").textContent=`Score: ${score}`;
        row.style.display="none";
        setTimeout(ask, ok?700:1800);
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* ===== v4/v5: rhythm + symbol games ===== */

    /* Note Value Flash — a note (or rest) appears, answer its name or beat count.
       spec:{rounds, seconds, ask:"beats"|"name", values:["w","h","q","8","h.","q."], kind:"note"|"rest"} */
    "value-race":(el,spec,onFinish)=>{
      const rounds=spec.rounds||10, secs=spec.seconds||0;
      const values=spec.values||["w","h","q"], ask=spec.ask||"beats", isRest=spec.kind==="rest";
      const RNAME={w:"Whole Rest",h:"Half Rest",q:"Quarter Rest","8":"Eighth Rest","16":"Sixteenth Rest"};
      const NAMES=isRest?RNAME:VAL_NAME;
      const SHAPE=isRest?{w:"it hangs BELOW the 4th line — the hole",h:"it sits ON the 3rd line — the hat",q:"the squiggle","8":"the little seven with a dot","16":"the little seven with TWO hooks"}
                        :{w:"No stem, hollow head.",h:"Hollow head WITH a stem.",q:"Filled head with a stem.","8":"Filled head with a stem AND a flag.","16":"Filled head, stem, and TWO flags.","h.":"A half note plus a dot — 2 + 1.","q.":"A quarter note plus a dot — 1 + ½.","8.":"An eighth note plus a dot — ½ + ¼."};
      const PITCHES=["G4","B4","D5","F4","A4","E4","C5"];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ ${secs?`Start the ${secs}-second challenge`:"Start"}</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns gvals" style="display:none"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const btnRow=$(".gvals");
      values.forEach(v=>{ const b=document.createElement("button");
        b.textContent=ask==="beats"? BEATLBL[VAL_BEATS[v]] : NAMES[v];
        b.onclick=()=>ans(v); btnRow.appendChild(b); });
      let cur=null,score=0,asked=0,streak=0,left=secs,tick=null,running=false,waiting=false;
      function ask2(){
        if(!running) return;
        if(!secs&&asked>=rounds){ end(); return; }
        let nxt=pick(values); if(cur&&values.length>1){ let g=0; while(nxt===cur.v&&g++<6) nxt=pick(values); }
        cur={v:nxt,p:pick(PITCHES)}; waiting=false;
        Staff.render($(".gstaff"),{clef:"treble",notes:[isRest?{rest:nxt}:tokItem(nxt,cur.p)],width:240});
        $(".gq").textContent=secs?(ask==="beats"?`How many beats${isRest?" of silence":""}?`:`Which ${isRest?"rest":"note"} is this?`)
          :`${isRest?"Rest":"Note"} ${asked+1} of ${rounds}: ${ask==="beats"?`how many beats${isRest?" of silence":""}?`:"name it!"}`;
        btnRow.style.display="block";
      }
      function ans(v){
        if(!running||waiting) return;
        waiting=true; asked++;
        const ok=v===cur.v;
        if(isRest) MFAudio.click(0,.35); else MFAudio.tone(MFAudio.midi(cur.p), VAL_BEATS[cur.v]*0.45);
        if(ok){ score++; streak++; $(".gq").textContent=`✓ Yes — ${NAMES[cur.v]}, ${BEATLBL[VAL_BEATS[cur.v]]}${isRest?" of silence":""}!`; }
        else { streak=0; $(".gq").textContent=`✗ It's a ${NAMES[cur.v]} — ${BEATLBL[VAL_BEATS[cur.v]]}. ${SHAPE[cur.v]||""}`; }
        $(".gs").textContent=(secs?`⏱ ${left}s · `:"")+`Score: ${score} · Streak: ${streak}`;
        setTimeout(ask2, ok?600:1800);
      }
      function end(){
        running=false; clearInterval(tick); btnRow.style.display="none"; $(".gstaff").innerHTML="";
        $(".gq").innerHTML=secs?`⏰ Time! You identified <b>${score}</b> ${isRest?"rests":"note values"} 🎉`:`Done! <b>${score}</b> of ${rounds} 🎉`;
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(score,secs||rounds);
      }
      $(".gstart").onclick=function(){
        this.style.display="none"; score=0;asked=0;streak=0;left=secs;running=true;
        $(".gs").textContent=secs?`⏱ ${left}s`:"";
        if(secs){ clearInterval(tick); tick=setInterval(()=>{ left--;
          $(".gs").textContent=`⏱ ${left}s · Score: ${score} · Streak: ${streak}`;
          if(left<=0) end(); },1000); }
        ask2();
      };
    },

    /* Rhythm Tap — hear the pattern, then tap it in time (Web Audio timing).
       Tokens: "w","h","q","8","h.","q." = notes; prefix "r" = RESTS (don't tap!).
       spec:{tempo, rounds, patterns:[["q.","8","h"],…], beatsPerBar:4} */
    "rhythm-tap":(el,spec,onFinish)=>{
      const tempo=spec.tempo||80, spb=60/tempo;
      const patterns=spec.patterns||[["q","q","h"],["h","h"],["w"],["q","q","q","q"],["h","q","q"]];
      const rounds=Math.min(spec.rounds||3,patterns.length);
      const bpb=spec.beatsPerBar||4;
      const tol=Math.min(0.4, spb*0.45);
      const isR=e=>e[0]==="r"&&e.length>1, durTok=e=>e.replace(/^r/,"");
      const beatsTok=e=>{const s=durTok(e); return Staff.BEATS[tokBase(s)]*(tokDot(s)?1.5:1);};
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div style="text-align:center"><button class="play gtap" style="display:none;min-width:220px;padding:22px 30px;font-size:1.3rem">👏 TAP</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let order=[],round=0,hits=0,total=0,taps=[],tapOn=false,t0=0,timers=[];
      function clearTimers(){ timers.forEach(clearTimeout); timers=[]; }
      function later(fn,ms){ timers.push(setTimeout(fn,ms)); }
      function onsetsOf(pat){ let b=0; return pat.map(e=>{const at=b; b+=beatsTok(e); return at;}); }
      function patBeats(pat){ return pat.reduce((s,e)=>s+beatsTok(e),0); }
      function showPattern(pat,label){
        Staff.render($(".gstaff"),{clef:"treble",time:bpb+"/4",
          notes:[...pat.map(e=>isR(e)?{rest:tokBase(durTok(e))}:tokItem(durTok(e))),{bar:"final"}],width:340});
        if(label) $(".gq").textContent=label;
      }
      function playRound(){
        if(round>=rounds){ end(); return; }
        const pat=order[round];
        const ons=onsetsOf(pat), TB=patBeats(pat);
        const hasRest=pat.some(isR);
        showPattern(pat,`Round ${round+1} of ${rounds} — listen first…${hasRest?" (rests = silence!)":""}`);
        $(".gtap").style.display="none";
        MFAudio.ac();
        for(let i=0;i<bpb;i++) MFAudio.click(i*spb,.5,i===0);
        pat.forEach((e,i)=>{ if(!isR(e)) MFAudio.tone(71, beatsTok(e)*spb*0.9, (bpb+ons[i])*spb); });
        later(()=>{
          $(".gq").textContent=hasRest?"Your turn! Tap the NOTES — stay silent on the rests!":"Your turn! Count-in… then TAP the rhythm!";
          for(let i=0;i<bpb;i++) MFAudio.click(i*spb,.5,i===0);
          for(let i=0;i<TB;i++) MFAudio.click((bpb+i)*spb,.25);
          t0=performance.now();
          taps=[];
          later(()=>{ $(".gtap").style.display="inline-block"; tapOn=true; }, Math.max(0, bpb*spb*1000-600));
          later(()=>grade(pat,ons), ((bpb+TB)*spb+0.7)*1000);
        }, (bpb+TB)*spb*1000+400);
      }
      function grade(pat,ons){
        tapOn=false; $(".gtap").style.display="none";
        const expected=[]; pat.forEach((e,i)=>{ if(!isR(e)) expected.push((bpb+ons[i])*spb*1000); });
        const used=new Set(); let ok=0;
        expected.forEach(t=>{
          let best=-1,bd=1e9;
          taps.forEach((tp,i)=>{ if(used.has(i))return; const d=Math.abs(tp-t); if(d<bd){bd=d;best=i;} });
          if(best>=0&&bd<=tol*1000){ used.add(best); ok++; }
        });
        const extra=taps.length-used.size;
        hits+=ok; total+=expected.length;
        const perfect=ok===expected.length&&extra===0;
        $(".gq").innerHTML=perfect?`🎉 Perfect rhythm! ${ok} of ${expected.length} taps right on time!`
          :`You landed <b>${ok}</b> of ${expected.length} taps${extra>0?` (${extra} extra — did you tap during a rest?)`:""} — ${ok>=expected.length-1?"so close!":"listen again and feel the steady beat!"}`;
        round++;
        later(playRound, 2200);
      }
      function end(){
        $(".gq").innerHTML=`Done! You tapped <b>${hits}</b> of ${total} notes in time 🎉`;
        $(".gstaff").innerHTML=""; $(".gtap").style.display="none";
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(hits,total);
      }
      $(".gtap").onclick=()=>{ if(!tapOn)return; taps.push(performance.now()-t0); MFAudio.click(0,.35); };
      $(".gstart").onclick=function(){
        this.style.display="none"; clearTimers();
        order=shuffle(patterns).slice(0,rounds); round=0;hits=0;total=0;
        $(".gs").textContent="";
        playRound();
      };
    },

    /* Measure Builder — fill a measure with exactly N beats.
       Default buttons: notes w/h/q (+rests via spec.rests). Custom sets via
       spec.buttons:[{t,label,beats,item,isRest}]. spec:{beats,rounds,unique,needRest} */
    "measure-build":(el,spec,onFinish)=>{
      const target=spec.beats||4;
      const unique=spec.unique!==false, useRests=!!spec.rests, needRest=!!spec.needRest;
      let BTNS;
      if(spec.buttons) BTNS=spec.buttons;
      else{
        BTNS=[{t:"w",label:"Whole Note",beats:4,item:{p:"B4",d:"w"}},
              {t:"h",label:"Half Note",beats:2,item:{p:"B4",d:"h"}},
              {t:"q",label:"Quarter Note",beats:1,item:{p:"B4",d:"q"}}];
        if(useRests) BTNS=BTNS.concat([
              {t:"W",label:"Whole Rest",beats:4,item:{rest:"w"},isRest:true},
              {t:"H",label:"Half Rest",beats:2,item:{rest:"h"},isRest:true},
              {t:"Q",label:"Quarter Rest",beats:1,item:{rest:"q"},isRest:true}]);
      }
      const combosFor=t=>{ const out=[]; if(t===4) out.push("w");
        for(let h=Math.floor(t/2);h>=0;h--){ const q=t-2*h; if(q>=0&&(h||q)) out.push("h".repeat(h)+"q".repeat(q)); }
        return [...new Set(out)]; };
      const rounds=(spec.buttons||useRests)? (spec.rounds||2)
        : (unique? Math.min(spec.rounds||combosFor(target).length, combosFor(target).length) : (spec.rounds||4));
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns gvals" style="display:none"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const row=$(".gvals");
      let cur=[],sum=0,found=[],doneItems=[],mistakes=0,running=false;
      /* DD-27: option buttons are NOTATION CARDS — symbol drawn on a mini staff + name */
      BTNS.forEach(bt=>{ const b=document.createElement("button");
        if(bt.item){
          b.className="notecard";
          b.style.cssText="border-radius:10px;padding:6px 10px;min-width:104px";
          const d=document.createElement("div"); b.appendChild(d);
          Staff.render(d,{clef:"none",notes:[bt.item],width:100});
          const nm=document.createElement("div"); nm.style.cssText="font-weight:700;font-size:13px";
          nm.textContent=bt.label.replace(/\s*\([^)]*\)\s*$/,""); b.appendChild(nm);
        } else b.textContent=bt.label;
        b.onclick=()=>add(bt); row.appendChild(b); });
      const clr=document.createElement("button"); clr.className="ghost"; clr.textContent="↺ Clear";
      clr.onclick=()=>{ if(running){ cur=[];sum=0;draw(); } }; row.appendChild(clr);
      function draw(){
        const items=[...doneItems,...cur.map(bt=>bt.item)];
        if(found.length>=rounds&&items.length&&items[items.length-1].bar==="single") items[items.length-1]={bar:"final"};
        for(let m=found.length;m<rounds;m++) items.push({bar: m===rounds-1? "final":"single"});
        Staff.render($(".gstaff"),{clef:"treble",time:target+"/4",
          notes:items,width:rounds>1?470:340});
        $(".gs").textContent=`Beats so far: ${sum} of ${target}`+(rounds>1?` · Built: ${found.length} of ${rounds}`:"");
      }
      function add(bt){
        if(!running) return;
        if(sum+bt.beats>target){ mistakes++; MFAudio.tone(40,.25);
          $(".gq").textContent=`Too many! That would make ${sum+bt.beats} beats — a ${target}/4 measure holds exactly ${target}. Clear or pick a smaller value.`;
          return; }
        cur.push(bt); sum+=bt.beats;
        if(bt.isRest) MFAudio.click(0,.3); else MFAudio.tone(71, Math.max(.2,bt.beats*0.4));
        draw();
        if(sum===target){
          if(needRest&&!cur.some(x=>x.isRest)){
            $(".gq").textContent=`Exactly ${target} beats — but this round needs at least one REST. Clear and mix in some silence!`;
            cur=[];sum=0; setTimeout(draw,1100); return;
          }
          const key=cur.map(x=>x.t).sort().join("");
          if(unique&&found.includes(key)){
            $(".gq").textContent="That combination is already on your list — clear and find a NEW one!";
            cur=[];sum=0; setTimeout(draw,900); return;
          }
          found.push(key);
          let t=0; cur.forEach(bt=>{ if(!bt.isRest) MFAudio.tone(71, Math.max(.2,bt.beats*0.45), t); t+=bt.beats*0.5; });
          doneItems.push(...cur.map(bt=>bt.item), {bar:"single"});
          cur=[]; sum=0; draw();
          if(found.length>=rounds){
            running=false;
            const stars=mistakes===0?3:mistakes<=2?2:1;
            $(".gq").innerHTML=`🎉 ${rounds>1?`You built ${found.length} different measures!`:"Measure complete!"} ${"⭐".repeat(stars)}`;
            row.style.display="none";
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
            if(onFinish)onFinish(stars,3);
          } else {
            $(".gq").textContent=`✓ Exactly ${target} beats! ${unique?"Now find a DIFFERENT combination — it joins the staff as the next measure…":"Next measure…"}`;
          }
        }
      }
      $(".gstart").onclick=function(){
        this.style.display="none"; cur=[];sum=0;found=[];doneItems=[];mistakes=0;running=true;
        row.style.display="block";
        $(".gq").textContent=`Fill the measure with EXACTLY ${target} beats${unique&&rounds>1?" — then find another way":""}${needRest?" (each measure needs at least one rest)":""}!`;
        draw();
      };
    },

    /* How many measures? spec:{rounds:6, min:2, max:5} */
    "measure-count":(el,spec,onFinish)=>{
      const rounds=spec.rounds||6, min=spec.min||2, max=spec.max||5;
      const FILL=[["w"],["h","h"]];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns gnums" style="display:none"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const numRow=$(".gnums");
      for(let n=min;n<=max;n++){ const b=document.createElement("button"); b.textContent=n; b.onclick=()=>ans(+b.textContent); numRow.appendChild(b); }
      let round=0,score=0,curN=0;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; numRow.style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        curN=min+Math.floor(Math.random()*(max-min+1));
        const items=[];
        for(let m=1;m<=curN;m++){ pick(FILL).forEach(d=>items.push({p:"B4",d})); items.push({bar:m<curN?"single":"final"}); }
        Staff.render($(".gstaff"),{clef:"treble",notes:items,width:460});
        $(".gq").textContent=`Round ${round} of ${rounds}: how many MEASURES do you see?`;
        numRow.style.display="block";
      }
      function ans(n){
        const ok=n===curN;
        if(ok){ score++; MFAudio.yay(); $(".gq").textContent=`✓ Yes — ${curN} measures! Count the spaces BETWEEN the bar lines.`; }
        else { MFAudio.tone(40,.25); $(".gq").textContent=`✗ It's ${curN} — count the containers between bar lines, and remember the double bar ends the last one.`; }
        $(".gs").textContent=`Score: ${score}`;
        numRow.style.display="none";
        setTimeout(ask, ok?900:2000);
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Symbol Hunt — click the named symbol among 4 cards.
       spec:{rounds:6, pool:[{label, spec:{…Staff spec…}} | {label, html:"<b>mf</b>"}]} */
    "symbol-hunt":(el,spec,onFinish)=>{
      const rounds=spec.rounds||6;
      const pool=spec.pool||[];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div>
        <div class="sh-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;max-width:640px;margin:12px auto"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const grid=$(".sh-grid");
      let round=0,score=0,answered=false;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} 🎉`;
          grid.innerHTML="";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        answered=false;
        const target=pick(pool);
        const others=shuffle(pool.filter(c=>c.label!==target.label)).slice(0,3);
        grid.innerHTML="";
        shuffle([target,...others]).forEach(c=>{
          const b=document.createElement("button");
          b.className="notecard";
          b.style.cssText="min-height:140px;border-radius:10px;padding:8px;display:flex;align-items:center;justify-content:center";
          const d=document.createElement("div"); d.style.width="100%"; b.appendChild(d);
          if(c.html){ d.innerHTML=c.html; d.style.cssText="width:100%;font-size:1.6rem;font-weight:800;color:var(--primary-dark)"; }
          else { Staff.render(d,Object.assign({width:170},c.spec)); const sv=d.querySelector("svg.mf-staff"); if(sv){ sv.style.maxWidth="none"; sv.style.width="100%"; sv.style.height="auto"; sv.style.maxHeight="180px"; } }
          b.onclick=()=>{
            if(answered) return; answered=true;
            const ok=c.label===target.label;
            if(ok){ score++; MFAudio.yay(); $(".gq").textContent=`✓ That's the ${target.label}!`; }
            else { MFAudio.tone(40,.25); $(".gq").textContent=`✗ That one is the ${c.label} — look again for the ${target.label} next time.`; }
            $(".gs").textContent=`Score: ${score}`;
            setTimeout(ask, ok?900:2100);
          };
          grid.appendChild(b);
        });
        $(".gq").innerHTML=`Round ${round} of ${rounds}: click the <b>${target.label}</b>!`;
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Complete or Incomplete? — judge whether a measure holds exactly N beats.
       spec:{rounds:8, beats:4, rests:false} */
    "measure-judge":(el,spec,onFinish)=>{
      const rounds=spec.rounds||8, target=spec.beats||4, useRests=!!spec.rests;
      function randSum(t){ const toks=[]; let r=t;
        while(r>0){ const opts=["q"]; if(r>=2)opts.push("h"); if(r>=4&&r===t&&t===4)opts.push("w");
          const v=pick(opts); toks.push(v); r-=VAL_BEATS[v]; }
        return shuffle(toks); }
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div><div class="gstaff"></div>
        <div class="gbtns" style="display:none"><button class="gc">✓ Complete (${target} beats)</button> <button class="gi">✗ Incomplete</button></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let round=0,score=0,cur=null;
      function ask(){
        round++;
        if(round>rounds){ $(".gq").innerHTML=`Done! <b>${score}</b> of ${rounds} 🎉`;
          $(".gstaff").innerHTML=""; $(".gbtns").style.display="none";
          $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
          if(onFinish)onFinish(score,rounds); round=0;score=0; return; }
        const complete=Math.random()<.5;
        const sum=complete?target:1+Math.floor(Math.random()*(target-1));
        const toks=randSum(sum);
        cur={complete,sum,toks};
        Staff.render($(".gstaff"),{clef:"treble",time:target+"/4",
          notes:[...toks.map(v=>(useRests&&Math.random()<.35)?{rest:v}:{p:"B4",d:v}),{bar:"final"}],width:320});
        $(".gq").textContent=`Round ${round} of ${rounds}: does this measure hold exactly ${target} beats?`;
        $(".gbtns").style.display="block";
      }
      function ans(saidComplete){
        const ok=saidComplete===cur.complete;
        const mathTxt=cur.toks.map(v=>VAL_BEATS[v]).join(" + ")+" = "+cur.sum;
        if(ok){ score++; MFAudio.yay(); $(".gq").textContent=`✓ Right — ${mathTxt}${cur.complete?` beat${cur.sum>1?"s":""}: complete!`:` beats: it still needs ${target-cur.sum} more.`}`; }
        else { MFAudio.tone(40,.25); $(".gq").textContent=`✗ Add it up: ${mathTxt} — ${cur.complete?"exactly "+target+", complete!":"only "+cur.sum+", incomplete."}`; }
        $(".gs").textContent=`Score: ${score}`;
        $(".gbtns").style.display="none";
        setTimeout(ask, ok?900:2300);
      }
      $(".gc").onclick=()=>ans(true); $(".gi").onclick=()=>ans(false);
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;score=0; ask(); };
    },

    /* Term Race — a term flashes, pick its meaning (or reverse).
       spec:{pool:[[term,meaning],…], rounds, seconds, reverse:false} */
    "term-race":(el,spec,onFinish)=>{
      const pool=spec.pool||[], rounds=spec.rounds||Math.min(8,pool.length*2), secs=spec.seconds||0;
      const rev=!!spec.reverse;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ ${secs?`Start the ${secs}-second challenge`:"Start"}</button>
        <div class="gterm" style="font-size:2rem;font-weight:800;color:var(--primary-dark);min-height:48px;text-align:center"></div>
        <div class="big-q gq"></div>
        <div class="gbtns gopts" style="display:none;grid-template-columns:1fr 1fr;gap:10px;max-width:520px;margin:8px auto"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const opts=$(".gopts");
      let cur=null,score=0,asked=0,streak=0,left=secs,tick=null,running=false,waiting=false;
      function ask(){
        if(!running) return;
        if(!secs&&asked>=rounds){ end(); return; }
        let nxt=pick(pool); if(cur&&pool.length>1){ let g=0; while(nxt[0]===cur[0]&&g++<8) nxt=pick(pool); }
        cur=nxt; waiting=false;
        $(".gterm").innerHTML=rev? cur[1] : cur[0];
        const correct=rev? cur[0] : cur[1];
        const wrongs=shuffle(pool.filter(p=>p!==cur)).slice(0,3).map(p=>rev?p[0]:p[1]);
        opts.innerHTML="";
        shuffle([correct,...wrongs]).forEach(c=>{ const b=document.createElement("button");
          b.innerHTML=c; b.onclick=()=>ans(c,correct); opts.appendChild(b); });
        $(".gq").textContent=secs?"Pick the match!":`Round ${asked+1} of ${rounds}: pick the match!`;
        opts.style.display="grid";
      }
      function ans(said,correct){
        if(!running||waiting) return;
        waiting=true; asked++;
        const ok=said===correct;
        if(ok){ score++; streak++; MFAudio.yay(); $(".gq").innerHTML=`✓ Yes — <b>${$(".gterm").textContent}</b> = ${correct}!`; }
        else { streak=0; MFAudio.tone(40,.25); $(".gq").innerHTML=`✗ <b>${$(".gterm").textContent}</b> means <b>${correct}</b>.`; }
        $(".gs").textContent=(secs?`⏱ ${left}s · `:"")+`Score: ${score} · Streak: ${streak}`;
        setTimeout(ask, ok?650:1900);
      }
      function end(){
        running=false; clearInterval(tick); opts.style.display="none"; $(".gterm").textContent="";
        $(".gq").innerHTML=secs?`⏰ Time! <b>${score}</b> matched 🎉`:`Done! <b>${score}</b> of ${rounds} 🎉`;
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(score,secs||rounds);
      }
      $(".gstart").onclick=function(){
        this.style.display="none"; score=0;asked=0;streak=0;left=secs;running=true;
        $(".gs").textContent=secs?`⏱ ${left}s`:"";
        if(secs){ clearInterval(tick); tick=setInterval(()=>{ left--;
          $(".gs").textContent=`⏱ ${left}s · Score: ${score} · Streak: ${streak}`;
          if(left<=0) end(); },1000); }
        ask();
      };
    },

    /* Order Tap — tap the items in the correct order.
       spec:{sequence:["Adagio","Andante",…], title, timer:0} */
    "order-tap":(el,spec,onFinish)=>{
      const seq=spec.sequence||[], timed=spec.timer||0;
      el.innerHTML=`<div class="game-arena">
        <div class="big-q gq">${spec.title||"Tap the items in the correct order!"}</div>
        <div class="gslots" style="min-height:36px;font-weight:800;letter-spacing:2px;margin:10px 0;text-align:center"></div>
        <div class="gbtns gpile" style="display:block"></div>
        <div class="streak gs"></div>
        <button class="play gstart">▶ Start</button></div>`;
      const $=s=>el.querySelector(s);
      let next=0,mistakes=0,left=timed,tick=null,running=false;
      function setup(){
        next=0;mistakes=0;left=timed;running=true;
        $(".gslots").textContent=seq.map(()=>"◻").join(" ");
        const pile=$(".gpile"); pile.innerHTML="";
        shuffle(seq).forEach(s2=>{ const b=document.createElement("button"); b.textContent=s2;
          b.onclick=()=>place(b,s2); pile.appendChild(b); });
        $(".gs").textContent=timed?`⏱ ${left}s`:"";
        if(timed){ clearInterval(tick); tick=setInterval(()=>{ left--; $(".gs").textContent=`⏱ ${left}s`;
          if(left<=0){ clearInterval(tick); running=false;
            $(".gq").textContent="⏰ Time's up — try again!";
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Try again"; }
        },1000); }
      }
      function place(btn,s2){
        if(!running||btn.disabled) return;
        if(s2===seq[next]){
          next++; btn.disabled=true; MFAudio.tone(60+next*3,.25);
          $(".gslots").textContent=seq.map((x,i)=>i<next?x:"◻").join(" · ");
          if(next===seq.length){
            running=false; clearInterval(tick);
            const stars=timed?(left>=timed/2?3:left>=3?2:1):(mistakes===0?3:mistakes<=2?2:1);
            $(".gq").innerHTML=`🎉 Perfect order! ${"⭐".repeat(stars)}`;
            $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
            if(onFinish)onFinish(stars,3);
          }
        } else {
          mistakes++; MFAudio.tone(40,.25);
          btn.classList.add("shake"); setTimeout(()=>btn.classList.remove("shake"),450);
          $(".gq").textContent=`Not yet — what comes ${next===0?"first":"after “"+seq[next-1]+"”"}?`;
        }
      }
      $(".gstart").onclick=function(){ this.style.display="none"; $(".gq").textContent=spec.title||"Tap the items in the correct order!"; setup(); };
    },

    /* v7.4 — GEN-RACE: turns ANY mc quiz generator into a timed arcade round.
       spec:{gen:"keysig-id"|"interval-id"|"circle-nav"|…, params:{}, seconds:45, rounds:10} */
    "gen-race":(el,spec,onFinish)=>{
      const rounds=spec.rounds||10, secs=spec.seconds||0;
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ ${secs?`Start the ${secs}-second challenge`:"Start"}</button>
        <div class="big-q gq"></div><div class="gr-media"></div>
        <div class="gbtns gr-ch" style="display:none"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      let cur=null,score=0,asked=0,streak=0,left=secs,tick=null,running=false,waiting=false;
      function makeQ(){ let q,guard=0;
        do{ q=Quiz.generators[spec.gen](spec.params||{}); }while(q.type!=="mc"&&guard++<6);
        return q; }
      function ask(){
        if(!running) return;
        if(!secs&&asked>=rounds){ end(); return; }
        cur=makeQ(); waiting=false;
        $(".gq").textContent=(secs?"":"Round "+(asked+1)+" of "+rounds+": ")+cur.q;
        const m=$(".gr-media"); m.innerHTML="";
        if(cur.staff) Staff.render(m,cur.staff);
        const ch=$(".gr-ch"); ch.innerHTML="";
        if(cur.choices.every(c=>String(c).length<=14)) ch.classList.add("chips"); else ch.classList.remove("chips");
        cur.choices.forEach((c,i)=>{ const b=document.createElement("button"); b.innerHTML=c;
          b.onclick=()=>ans(i); ch.appendChild(b); });
        ch.style.cssText=cur.choices.length===4? "display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:520px;margin:0 auto" : "display:block";
      }
      function ans(i){
        if(!running||waiting) return;
        waiting=true; asked++;
        const ok=i===cur.answer;
        if(ok){ score++; streak++; MFAudio.yay(); $(".gq").innerHTML="✓ "+cur.explain; }
        else { streak=0; MFAudio.tone(40,.25); $(".gq").innerHTML="✗ "+cur.explain; }
        $(".gs").textContent=(secs?`⏱ ${left}s · `:"")+`Score: ${score} · Streak: ${streak}`;
        setTimeout(ask, ok?800:2200);
      }
      function end(){
        running=false; clearInterval(tick); $(".gr-ch").style.display="none"; $(".gr-media").innerHTML="";
        $(".gq").innerHTML=secs?`⏰ Time! <b>${score}</b> correct 🎉`:`Done! <b>${score}</b> of ${rounds} 🎉`;
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(score,secs||rounds);
      }
      $(".gstart").onclick=function(){
        this.style.display="none"; score=0;asked=0;streak=0;left=secs;running=true;
        $(".gs").textContent=secs?`⏱ ${left}s`:"";
        if(secs){ clearInterval(tick); tick=setInterval(()=>{ left--;
          $(".gs").textContent=`⏱ ${left}s · Score: ${score} · Streak: ${streak}`;
          if(left<=0) end(); },1000); }
        ask();
      };
    },

    /* v7.4 — KEY-CLIMB: play a keyboard sequence in order, against the clock.
       spec:{seq:[midis], names:[labels], start:60, octaves:2, title} */
    "key-climb":(el,spec,onFinish)=>{
      const seq=spec.seq||[], names=spec.names||[];
      el.innerHTML=`<div class="game-arena">
        <div class="big-q gq">${spec.title||"Play the keys in order — fast and clean!"}</div>
        <div class="gkb"></div>
        <div class="streak gs"></div>
        <button class="play gstart">▶ Start the climb</button></div>`;
      const $=s=>el.querySelector(s);
      let i=0,misses=0,t0=0,timer=null,running=false,kb=null;
      kb=Keyboard.create($(".gkb"),{start:spec.start??60,octaves:spec.octaves??2,labels:true,
        onKey:m=>{
          if(!running) return;
          if(m===seq[i]){
            /* if the spec supplies chords, sound the full chord (the pressed root already rang) */
            if(spec.chords&&spec.chords[i]) spec.chords[i].forEach(n=>{ if(n!==m) MFAudio.tone(n,.95,0,.26); });
            i++;
            if(i>=seq.length){ running=false; clearInterval(timer); kb.point(null);
              const secs=((Date.now()-t0)/1000).toFixed(1);
              const stars=misses===0?3:misses<=2?2:1;
              $(".gq").innerHTML=`🏁 Climb complete in <b>${secs}s</b> with ${misses} miss${misses===1?"":"es"}! ${"⭐".repeat(stars)}`;
              $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Climb again";
              if(onFinish)onFinish(stars,3);
            } else { kb.point(seq[i]);
              $(".gq").innerHTML=`✓ ${names[i-1]||""} — next: <b>${names[i]||"follow the red arrow"}</b> (${i}/${seq.length})`; } }
          else { misses++; MFAudio.tone(40,.2);
            $(".gs").textContent=`⏱ climbing… · misses: ${misses}`; }
        }});
      $(".gstart").onclick=function(){
        this.style.display="none"; i=0; misses=0; running=true; t0=Date.now();
        kb.point(seq[0]);
        $(".gq").innerHTML=`GO! Start on the key with the red arrow${names[0]?` — <b>${names[0]}</b>`:""}.`;
        clearInterval(timer); timer=setInterval(()=>{ if(running) $(".gs").textContent=`⏱ ${((Date.now()-t0)/1000).toFixed(0)}s · misses: ${misses}`; },500);
      };
    },

    /* v7.3 — Key-Signature Match-Up (instructor 2026-07-06): signature cards on top,
       DRAG each key-name block onto its signature (tap-to-pick, tap-to-place on phones).
       spec:{rounds:3, perRound:4, pool:[{key,label}], clefs:["treble","bass"]}
       key "C" renders an EMPTY signature — a valid challenge (no sharps/flats = C major). */
    "sig-match":(el,spec,onFinish)=>{
      const pool=spec.pool||[], perRound=spec.perRound||4, totalRounds=spec.rounds||3;
      const clefs=spec.clefs||["treble","bass"];
      el.innerHTML=`<div class="game-arena">
        <button class="play gstart">▶ Start</button>
        <div class="big-q gq"></div>
        <div class="sm-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:480px;margin:10px auto"></div>
        <div class="gbtns sm-pile" style="display:block"></div>
        <div class="streak gs"></div></div>`;
      const $=s=>el.querySelector(s);
      const grid=$(".sm-grid"), pile=$(".sm-pile");
      let round=0,mistakes=0,matched=0,sel=null,running=false;
      function setup(){
        if(round>=totalRounds){ end(); return; }
        matched=0; sel=null;
        const picks=shuffle([...pool]).slice(0,perRound);
        grid.innerHTML=""; pile.innerHTML="";
        $(".gq").textContent=`Round ${round+1} of ${totalRounds}: drag each key name onto its signature!`;
        picks.forEach(p=>{
          const card=document.createElement("div");
          card.style.cssText="border:1.5px solid #cdd5e1;border-radius:10px;background:#fff;padding:6px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer";
          card.dataset.label=p.label;
          const st=document.createElement("div"); st.style.width="100%"; card.appendChild(st);
          const slot=document.createElement("div");
          slot.style.cssText="margin-top:4px;min-width:92px;height:30px;border:2px dashed #3b3486;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;background:#fff";
          card.appendChild(slot); card._slot=slot;
          grid.appendChild(card);
          Staff.render(st,{clef:pick(clefs),keysig:p.key,notes:[],width:170});
          card.addEventListener("dragover",e=>e.preventDefault());
          card.addEventListener("drop",e=>{ e.preventDefault(); tryMatch(card); });
          card.addEventListener("click",()=>tryMatch(card));
        });
        shuffle(picks.map(p=>p.label)).forEach(lbl=>{
          const b=document.createElement("button"); b.textContent=lbl; b.draggable=true;
          b.addEventListener("dragstart",()=>{ sel=b; });
          b.addEventListener("click",e=>{ e.stopPropagation(); if(b.disabled) return;
            [...pile.children].forEach(x=>x.style.outline=""); sel=b; b.style.outline="3px solid #ffd166"; });
          pile.appendChild(b);
        });
      }
      function tryMatch(card){
        if(!running||!sel||sel.disabled||card.dataset.done) return;
        if(sel.textContent===card.dataset.label){
          card.dataset.done="1"; card._slot.textContent=card.dataset.label;
          card._slot.style.borderStyle="solid"; card._slot.style.background="#eef1ff";
          sel.disabled=true; sel.style.opacity=".35"; sel.style.outline=""; sel=null; matched++;
          MFAudio.tone(70+matched*2,.3);
          $(".gs").textContent=`Round ${round+1} · matched ${matched}/${perRound} · misses ${mistakes}`;
          if(matched>=perRound){ round++; setTimeout(setup,900); }
        } else {
          mistakes++; MFAudio.tone(40,.25);
          card.classList.add("shake"); setTimeout(()=>card.classList.remove("shake"),450);
          $(".gq").textContent="Not that one — count the accidentals and use your rules!";
        }
      }
      function end(){
        running=false; grid.innerHTML=""; pile.innerHTML="";
        const stars=mistakes===0?3:mistakes<=3?2:1;
        $(".gq").innerHTML=`\u{1F389} All signatures matched! ${"⭐".repeat(stars)} (misses: ${mistakes})`;
        $(".gstart").style.display="inline-block"; $(".gstart").textContent="▶ Play again";
        if(onFinish)onFinish(stars,3);
      }
      $(".gstart").onclick=function(){ this.style.display="none"; round=0;mistakes=0;running=true; setup(); };
    }

  };
  function mount(el,opts){
    opts=opts||{};
    if(!registry[opts.type]){ el.innerHTML="<p>Game unavailable.</p>"; return; }
    registry[opts.type](el,opts.spec||{},opts.onFinish);
  }
  function has(type){ return !!registry[type]; }
  return {mount,has};
})();
