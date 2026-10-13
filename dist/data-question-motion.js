// Preserve the visible scene as well as state across whole-app renders.
export function layoutDataWorld(world){
 const rect=world?.getBoundingClientRect?.(),sources=world?.querySelectorAll?.('.qs-source'),svg=world?.querySelector?.('.qs-paths');
 if(!rect?.width||!svg||sources?.length!==4)return;
 svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
 world.style?.setProperty('--query-travel',`${rect.height}px`);
 const cx=rect.width/2,context=world.querySelector('.qs-context'),c=context?.getBoundingClientRect?.()||{height:0},cy=c.height?c.top-rect.top:rect.height-30;
 const queries=svg.querySelectorAll('.qs-question-path'),joins=svg.querySelectorAll('.qs-join');
 sources.forEach((source,i)=>{const r=source.getBoundingClientRect(),x=r.left+r.width/2-rect.left,y=r.top-rect.top,bottom=r.bottom-rect.top;const lower=i>1&&r.top>sources[0].getBoundingClientRect().top+20,edge=i%2===0?4:rect.width-4;
  queries[i].setAttribute('d',lower?`M${cx} 0 Q${cx} 8 ${edge} 8 V${y-4} L${x} ${y-4} V${y}`:`M${cx} 0 Q${x} 5 ${x} ${y}`);
  joins[i].setAttribute('d',`M${x} ${bottom} Q${x} ${cy} ${cx} ${cy}`);
 });
 const trunk=svg.querySelector('.qs-trunk');trunk?.setAttribute('d',`M${cx} ${cy} V${rect.height}`);
 svg.querySelector('.qs-query-token')?.setAttribute('cx',String(cx));
}
export function createQuestionMotion({schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),now=()=>Date.now()}={}){
 let question=null,world=null,body=null,timer=null,generation=0,skip=false,observer=null,observed=null;
 let remaining=2200,due=0,connecting=false,completed=false;const paused=new Set();
 const stop=()=>{generation++;if(timer!==null)cancel(timer);timer=null;};
 const pauseAnimations=node=>{for(const a of node?.getAnimations?.({subtree:true})||[])if(a.playState==='running'){a.pause();paused.add(a);}};
 return {
  reset(){stop();observer?.disconnect();observed=null;question=null;world=null;body=null;paused.clear();remaining=2200;connecting=false;completed=false;skip=true;},
  capture(root){if(skip){skip=false;return;}question=root.querySelector?.('.qs-question')||question;world=root.querySelector?.('.qs-world')||world;body=root.querySelector?.('.qs-body')||body;pauseAnimations(body||world);},
  restore(root){
   const q=root.querySelector?.('.qs-question'),freshBody=root.querySelector?.('.qs-body');
   if(q&&question)q.replaceWith(question);else if(q)question=q;
   if(freshBody&&body?.dataset?.renderKey===freshBody.dataset?.renderKey&&body?.dataset?.renderKey){freshBody.replaceWith(body);}else if(freshBody){body=freshBody;}
   const w=root.querySelector?.('.qs-world');
   if(w&&world&&w!==world){
    world.dataset.worldPhase=w.dataset.worldPhase;world.setAttribute('aria-label',w.getAttribute('aria-label'));
    const oldHidden=world.querySelectorAll?.('.qs-fragment, .qs-context')||[],newHidden=w.querySelectorAll?.('.qs-fragment, .qs-context')||[];
    oldHidden.forEach((n,i)=>{n.hidden=newHidden[i]?.hidden??true;});w.replaceWith(world);
   }else if(w)world=w;
   if(w){layoutDataWorld(world);if(observed!==world&&globalThis.ResizeObserver){observer?.disconnect();observer=new ResizeObserver(()=>layoutDataWorld(world));observer.observe(world);observed=world;}}
   else{observer?.disconnect();observed=null;}
   if(!globalThis.document?.hidden&&freshBody){const active=new Set(body?.getAnimations?.({subtree:true})||[]);for(const a of paused){if(active.has(a)&&a.playState==='paused')a.play();}paused.clear();}
  },
  sync(active,scene,complete){
   if(scene!=='CONNECTING'){stop();remaining=2200;connecting=false;completed=false;return;}
   if(!active){if(timer!==null)remaining=Math.max(0,due-now());stop();return;}
   if(completed||timer!==null)return;
   if(!connecting){remaining=2200;connecting=true;}
   const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;const version=++generation;due=now()+(reduced?0:remaining);
   timer=schedule(()=>{if(version!==generation||completed)return;generation++;timer=null;completed=true;remaining=0;complete();},reduced?0:remaining);
  }
 };
}
