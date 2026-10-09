// Finite rehearsal motion; retains SVG nodes and animation progress across shell renders.
function patch(a,b){
 if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName){a.replaceWith(b.cloneNode(true));return;}
 if(a.nodeType===3){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return;}if(a.nodeType!==1)return;
 for(const x of [...a.attributes])if(!b.hasAttribute(x.name))a.removeAttribute(x.name);
 for(const x of [...b.attributes])if(a.getAttribute(x.name)!==x.value)a.setAttribute(x.name,x.value);
 const old=[...a.childNodes],next=[...b.childNodes];next.forEach((n,i)=>old[i]?patch(old[i],n):a.append(n.cloneNode(true)));old.slice(next.length).forEach(n=>n.remove());
}
export function createMigrationMotion(){
 let saved=null,skip=false;
 const key=n=>n.closest('[data-mr-system]')?.dataset.mrSystem+':'+n.dataset.mrKey;
 return {
  reset(){for(const record of saved?.nodes.values()||[])for(const a of record.animations)a.cancel();saved=null;skip=true;},
  capture(root){
   if(skip){skip=false;return;}const stage=root.querySelector?.('.mr-stage');if(!stage?.getAttribute)return;
   const nodes=new Map();for(const n of stage.querySelectorAll('[data-mr-moving],[data-mr-opacity]')){
    const x=Number(n.getAttribute('cx')),y=Number(n.getAttribute('cy')),opacity=Number(n.getAttribute('opacity'));const style=globalThis.getComputedStyle?.(n);let dx=0,dy=0;
    if(style?.transform&&style.transform!=='none'&&typeof DOMMatrixReadOnly!=='undefined'){const m=new DOMMatrixReadOnly(style.transform);dx=m.m41;dy=m.m42;}
    const animations=n.getAnimations?.()||[];nodes.set(key(n),{x,y,ax:x+dx,ay:y+dy,opacity,actualOpacity:style?Number(style.opacity):opacity,animations,ended:animations.map(a=>a.playState==='finished'||a.currentTime>=a.effect?.getComputedTiming().endTime),times:animations.map(a=>a.currentTime)});animations.forEach(a=>a.pause());
   }saved={canvas:stage.querySelector('.mr-canvas'),nodes};
  },
  restore(root){
   const stage=root.querySelector?.('.mr-stage');if(!stage?.getAttribute)return;const canvas=stage.querySelector('.mr-canvas');
   if(canvas&&saved?.canvas){patch(saved.canvas,canvas);canvas.replaceWith(saved.canvas);}
   const paused=stage.getAttribute('data-mr-frozen')==='true'||!!globalThis.document?.hidden,reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   for(const n of stage.querySelectorAll('[data-mr-moving],[data-mr-opacity]')){
    const old=saved?.nodes.get(key(n)),x=Number(n.getAttribute('cx')),y=Number(n.getAttribute('cy')),opacity=Number(n.getAttribute('opacity')),moving=n.hasAttribute('data-mr-moving');
    if(old&&old.x===x&&old.y===y&&old.opacity===opacity){old.animations.forEach((a,i)=>{a.currentTime=old.times[i];if(paused)a.pause();else if(reduced||old.ended[i])a.finish();else a.play();});continue;}
    for(const a of n.getAnimations?.()||[])a.cancel();if(paused||reduced||!n.animate)continue;
    const start={opacity:old?.actualOpacity??0},end={opacity};
    if(moving){start.transform=`translate(${(old?.ax??x)-x}px, ${(old?.ay??y-18)-y}px)`;end.transform='translate(0px, 0px)';}
    n.animate([start,end],{duration:moving?Number(n.dataset.mrDuration||1000):550,easing:'cubic-bezier(.3,.1,.25,1)',fill:'both'});
   }
  }
 };
}
