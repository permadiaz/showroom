// Preserve the actual living-system subtree, including individual request DOM nodes.
// Only finite movements follow a change. No animation clock advances the story.
function syncTree(current,next){
 if(current.nodeType!==next.nodeType||current.nodeName!==next.nodeName){current.replaceWith(next.cloneNode(true));return;}
 if(current.nodeType===3){if(current.nodeValue!==next.nodeValue)current.nodeValue=next.nodeValue;return;}
 if(current.nodeType!==1)return;
 for(const attr of [...current.attributes])if(!next.hasAttribute(attr.name))current.removeAttribute(attr.name);
 for(const attr of [...next.attributes])if(current.getAttribute(attr.name)!==attr.value)current.setAttribute(attr.name,attr.value);
 const oldChildren=[...current.childNodes],newChildren=[...next.childNodes];
 newChildren.forEach((child,i)=>{if(oldChildren[i])syncTree(oldChildren[i],child);else current.append(child.cloneNode(true));});
 oldChildren.slice(newChildren.length).forEach(child=>child.remove());
}
function requestSnapshot(node){
 const x=Number(node.getAttribute('cx')),y=Number(node.getAttribute('cy')),opacity=Number(node.getAttribute('opacity'));
 const style=globalThis.getComputedStyle?.(node);let dx=0,dy=0;
 if(style?.transform&&style.transform!=='none'&&typeof DOMMatrixReadOnly!=='undefined'){const matrix=new DOMMatrixReadOnly(style.transform);dx=matrix.m41;dy=matrix.m42;}
 return {x,y,queued:node.dataset.queued==='true',actualX:x+dx,actualY:y+dy,opacity,actualOpacity:style?Number(style.opacity):opacity,animations:(node.getAnimations?.()||[]).map(a=>({animation:a,time:a.currentTime}))};
}
export function createCloudMotion(){
 let saved=null,skipCapture=false;
 return {
  reset(){for(const item of saved?.requests.values()||[])for(const a of item.animations)a.animation.cancel();saved=null;skipCapture=true;},
  capture(root){
   if(skipCapture){skipCapture=false;return;}
   const stage=root.querySelector?.('.cloud-benchmark');if(!stage?.getAttribute)return;
   const requests=new Map();
   for(const node of stage.querySelectorAll('[data-request]'))requests.set(node.dataset.motionKey,requestSnapshot(node));
   saved={resources:saved?.resources,system:stage.querySelector('.cb-living-system'),requests};
   // Detaching the stage (Learn/navigation) must not advance invisible finite motion.
   for(const a of stage.getAnimations?.({subtree:true})||[])a.pause();
  },
  restore(root){
   const stage=root.querySelector?.('.cloud-benchmark');if(!stage?.getAttribute)return;
   const target=stage.querySelector('.cb-living-system');
   if(saved?.system&&target){syncTree(saved.system,target);target.replaceWith(saved.system);}
   const frozen=stage.getAttribute('data-cloud-frozen')==='true'||!!globalThis.document?.hidden;
   const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   for(const node of stage.querySelectorAll('[data-request]')){
    const old=saved?.requests.get(node.dataset.motionKey),x=Number(node.getAttribute('cx')),y=Number(node.getAttribute('cy')),opacity=Number(node.getAttribute('opacity'));
    const unchanged=old&&old.x===x&&old.y===y&&old.opacity===opacity;
    if(unchanged){
     for(const {animation,time} of old.animations){animation.currentTime=time;if(frozen||reduced)animation.pause();else if(animation.playState!=='finished')animation.play();}
     continue;
    }
    for(const a of node.getAnimations?.()||[])a.cancel();
    if(frozen||reduced||!node.animate)continue;
    const startX=old?.actualX??Number(node.dataset.fromX),startY=old?.actualY??Number(node.dataset.fromY);
    const frames=[{transform:`translate(${startX-x}px, ${startY-y}px)`,opacity:old?.actualOpacity??0}];
    if(old?.queued&&node.dataset.released==='true')frames.push({transform:`translate(${Number(node.dataset.junctionX)-x}px, ${Number(node.dataset.junctionY)-y}px)`,opacity,offset:.35});
    frames.push({transform:'translate(0px, 0px)',opacity});
    node.animate(frames,{duration:Number(node.dataset.duration),easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
   }
   // Cancel a filled expansion before a resource becomes inactive (replay/reset).
   for(const node of stage.querySelectorAll('.cb-resource'))if(node.getAttribute('opacity')!=='1')for(const a of node.getAnimations?.()||[])a.cancel();
   // Expansion only animates resources that actually became available.
   for(const node of stage.querySelectorAll('.cb-resource.is-active')){
    const key=node.closest('[data-persistent-system]')?.dataset.persistentSystem+':'+node.dataset.resource;
    const before=saved?.resources?.get(key);
    if(before===false&&!frozen&&!reduced){for(const a of node.getAnimations?.()||[])a.cancel();node.animate?.([{opacity:0},{opacity:1}],{duration:450,fill:'both'});}
    else for(const a of node.getAnimations?.()||[])if(frozen||reduced)a.pause();else if(a.playState!=='finished')a.play();
   }
   // Store capacity visibility for the next interaction without a background loop.
   if(!saved)saved={requests:new Map()};saved.resources=new Map();
   for(const node of stage.querySelectorAll('.cb-resource'))saved.resources.set(node.closest('[data-persistent-system]')?.dataset.persistentSystem+':'+node.dataset.resource,node.getAttribute('opacity')==='1');
  }
 };
}
