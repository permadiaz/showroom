// Keep the actual request node alive through shell re-renders and mode switches.
// Finite position changes only; no clock advances the workday.
export function createThreadMotion(){
 let anchor=null,rect=null;
 return {
  reset(){anchor=null;rect=null;},
  capture(root){const node=root.querySelector?.('.wt-request-anchor');if(!node)return;anchor=node;rect=node.getBoundingClientRect?.();},
  restore(root){const target=root.querySelector?.('.wt-request-anchor');if(!target)return;if(anchor&&anchor!==target){
   const previousPhase=anchor.querySelector('small span');const nextPhase=target.querySelector('small span');
   if(previousPhase&&nextPhase)previousPhase.textContent=nextPhase.textContent;
   target.replaceWith(anchor);
   const next=anchor.getBoundingClientRect?.();
   if(rect&&next&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&!globalThis.document?.hidden){
    const dx=rect.left-next.left,dy=rect.top-next.top;
    if(dx||dy)anchor.animate?.([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:320,easing:'ease-out'});
   }
  }else anchor=target;
  }
 };
}
