// One bounded transformation timer, canceled on leave/reset; no idle animation loop.
export function createQuestionMotion({schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id)}={}){
 let question=null,world=null,timer=null,generation=0,skip=false;
 const stop=()=>{generation++;if(timer!==null)cancel(timer);timer=null;};
 return {
  reset(){stop();question=null;world=null;skip=true;},
  capture(root){if(skip){skip=false;return;}question=root.querySelector?.('.qs-question')||question;world=root.querySelector?.('.qs-world')||world;for(const a of world?.getAnimations?.({subtree:true})||[])a.pause();},
  restore(root){
   const q=root.querySelector?.('.qs-question'),w=root.querySelector?.('.qs-world');
   if(q&&question)q.replaceWith(question);else if(q)question=q;
   if(w&&world){world.dataset.worldPhase=w.dataset.worldPhase;world.setAttribute('aria-label',w.getAttribute('aria-label'));w.replaceWith(world);}else if(w)world=w;
   if(w&&!globalThis.document?.hidden)for(const a of world.getAnimations?.({subtree:true})||[])a.play();
  },
  sync(active,scene,complete){
   if(!active||scene!=='CONNECTING'){stop();return;}
   if(timer!==null)return;
   const version=++generation;
   timer=schedule(()=>{if(version!==generation)return;timer=null;complete();},globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches?0:2200);
  }
 };
}
