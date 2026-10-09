// Isolated prototype: no imports from, or state shared with, the approved Showroom.
export function createOpening({onChange=()=>{},schedule=setTimeout,cancel=clearTimeout,now=Date.now,reduced=()=>false}={}){
 let state={phase:'ready',received:0,paused:false},timer=null,epoch=0,due=0,remaining=1000,disposed=false;
 const notify=()=>onChange({...state});
 const clear=()=>{epoch++;if(timer!==null)cancel(timer);timer=null;};
 const arm=()=>{const version=epoch;due=now()+remaining;timer=schedule(()=>{if(version!==epoch||disposed)return;timer=null;if(state.received<4){state={...state,received:state.received+1};remaining=350;notify();arm();}else{state={phase:'scattered',received:4,paused:false};notify();}},remaining);};
 return {
  snapshot:()=>({...state}),
  ask(){if(disposed||state.phase!=='ready')return;clear();remaining=1000;state=reduced()?{phase:'scattered',received:4,paused:false}:{phase:'sending',received:0,paused:false};notify();if(state.phase==='sending')arm();},
  reset(){if(disposed)return;clear();remaining=1000;state={phase:'ready',received:0,paused:false};notify();},
  pause(){if(disposed||state.phase!=='sending'||state.paused)return;remaining=Math.max(0,due-now());clear();state={...state,paused:true};notify();},
  resume(){if(disposed||!state.paused)return;state={...state,paused:false};notify();arm();},
  reduceMotion(){if(disposed||state.phase!=='sending')return;clear();state={phase:'scattered',received:4,paused:false};notify();},
  dispose(){clear();disposed=true;}
 };
}
export function connectionPath(origin,target,{lowerRow=false,edge=target.x}={}){
 if(lowerRow){const top=origin.y+12,bend=target.y-12;return `M${origin.x} ${origin.y} Q${origin.x} ${top} ${edge} ${top} L${edge} ${bend} Q${edge} ${target.y} ${target.x} ${target.y}`;}
 return `M${origin.x} ${origin.y} C${origin.x} ${origin.y+25} ${target.x} ${target.y-30} ${target.x} ${target.y}`;
}
export function mountOpening(doc=globalThis.document,win=globalThis.window){
 const stage=doc.querySelector('#stage');if(!stage)return;
 const ask=doc.querySelector('#ask'),restart=doc.querySelector('#restart'),outcome=doc.querySelector('#outcome'),status=doc.querySelector('#status'),scene=doc.querySelector('.scene'),svg=doc.querySelector('.links'),paths=doc.querySelector('#paths');
 const sources=[...doc.querySelectorAll('.source')],preference=win.matchMedia('(prefers-reduced-motion: reduce)');
 const controller=createOpening({reduced:()=>preference.matches,onChange:s=>{
  stage.dataset.state=s.phase;stage.dataset.paused=String(s.paused);
  ask.disabled=s.phase!=='ready';ask.hidden=s.phase==='scattered';outcome.hidden=s.phase!=='scattered';
  sources.forEach((node,i)=>{node.dataset.received=String(i<s.received);node.querySelector('.signal').hidden=i>=s.received;});
  status.textContent=s.paused?'PAUSED — RETURN TO CONTINUE':s.phase==='ready'?'READY TO ASK':s.phase==='scattered'?'FOUR SIGNALS. NO COMPLETE ANSWER.':s.received?`${sources[s.received-1].querySelector('h2').textContent}: ${sources[s.received-1].querySelector('.signal').textContent}`:'QUESTION SENT TO FOUR SYSTEMS';
  if(s.phase==='scattered'&&doc.activeElement===ask)restart.focus({preventScroll:true});
 }});
 function layout(){
  const box=scene.getBoundingClientRect(),q=doc.querySelector('#origin').getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
  const origin={x:q.left+q.width/2-box.left,y:q.bottom-box.top};
  // Reuse the path nodes on resize so an in-flight query does not restart.
  sources.forEach((node,i)=>{const a=node.querySelector('.source-anchor').getBoundingClientRect(),b=node.getBoundingClientRect();const path=connectionPath(origin,{x:a.left-box.left,y:a.top-box.top},{lowerRow:win.matchMedia('(max-width:700px)').matches&&i>=2,edge:i%2===0?b.left-box.left-8:b.right-box.left+8});
   for(const kind of ['route','pulse']){let p=paths.querySelector(`[data-path="${kind}-${i}"]`);if(!p){p=doc.createElementNS('http://www.w3.org/2000/svg','path');p.dataset.path=`${kind}-${i}`;p.setAttribute('class',kind);p.setAttribute('pathLength','1');p.style.setProperty('--delay',`${i*.35}s`);paths.append(p);}p.setAttribute('d',path);}
  });
 }
 const onAsk=()=>controller.ask(),onReset=()=>{controller.reset();ask.focus({preventScroll:true});},onKey=e=>{if(e.key==='Escape'){e.preventDefault();onReset();}},onVisibility=()=>doc.hidden?controller.pause():controller.resume(),onMotion=()=>{if(preference.matches)controller.reduceMotion();},onLeave=()=>controller.pause(),onReturn=()=>{if(!doc.hidden)controller.resume();layout();};
 ask.addEventListener('click',onAsk);restart.addEventListener('click',onReset);doc.addEventListener('keydown',onKey);doc.addEventListener('visibilitychange',onVisibility);preference.addEventListener('change',onMotion);win.addEventListener('pagehide',onLeave);win.addEventListener('pageshow',onReturn);win.addEventListener('resize',layout);
 const observer=win.ResizeObserver?new win.ResizeObserver(layout):null;observer?.observe(scene);layout();
 return ()=>{controller.dispose();observer?.disconnect();ask.removeEventListener('click',onAsk);restart.removeEventListener('click',onReset);doc.removeEventListener('keydown',onKey);doc.removeEventListener('visibilitychange',onVisibility);preference.removeEventListener('change',onMotion);win.removeEventListener('pagehide',onLeave);win.removeEventListener('pageshow',onReturn);win.removeEventListener('resize',layout);};
}
if(typeof document!=='undefined'&&typeof window!=='undefined')mountOpening();
