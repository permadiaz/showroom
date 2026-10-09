import test from 'node:test';
import assert from 'node:assert/strict';
test('rendered migration journey preserves Cloud, presentation, scoped events and restart',async()=>{
 const handlers={},windowHandlers={},docHandlers={};const timers=new Map();let nextId=0;
 const oldSet=globalThis.setTimeout,oldClear=globalThis.clearTimeout;
 const app={innerHTML:'',querySelectorAll:()=>[],addEventListener:(n,f)=>handlers[n]=f};
 const html=()=>app.innerHTML;
 const buttons=()=>[...html().matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(([,attrs,text])=>{const dataset={};for(const [,k,v] of attrs.matchAll(/data-([\w-]+)="([^"]*)"/g))dataset[k.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;return {dataset,text,disabled:/\bdisabled\b/.test(attrs)};});
 globalThis.document={hidden:false,querySelector:()=>app,addEventListener:(n,f)=>docHandlers[n]=f,body:{classList:{toggle(){}}}};
 globalThis.location={hash:'#/show/cloud-migration'};
 globalThis.window={addEventListener:(n,f)=>windowHandlers[n]=f,scrollTo(){}};
 globalThis.setTimeout=f=>{timers.set(++nextId,f);return nextId;};globalThis.clearTimeout=id=>timers.delete(id);
 const click=dataset=>{const b=buttons().find(n=>Object.entries(dataset).every(([k,v])=>n.dataset[k]===v));assert.ok(b,JSON.stringify(dataset));assert.equal(b.disabled,false);handlers.click({target:{closest:()=>b}});};
 const key=key=>windowHandlers.keydown({key,target:{closest:()=>null},preventDefault(){}});
 const next=()=>{const b=buttons().find(b=>b.dataset.migration&&b.text.includes('→')&&!['previous','next-step'].includes(b.dataset.migration));assert.ok(b,'primary rehearsal action');click(b.dataset);};
 try{
  const {showSession}=await import('../dist/app.js');
  click({cloud:'environment',value:'HYBRID'});click({cloud:'scenario',value:'TRAFFIC SPIKE'});
  for(let i=0;i<3;i++){const [id,f]=[...timers][0];timers.delete(id);f();}click({cloud:'question'});assert.match(html(),/CHANGE THE RESPONSE/);
  click({cloud:'migrate'});assert.match(html(),/This workload is already running/);assert.doesNotMatch(html(),/class="business-stage/);assert.equal(timers.size,0);
  click({migration:'next'});click({migration:'interact'});click({migration:'pause'});assert.match(html(),/Resume motion/);click({mode:'learn'});click({mode:'show'});assert.match(html(),/Resume motion/);assert.match(html(),/DEPENDENCY FOUND/);click({migration:'resume'});
  for(let i=0;i<35&&!html().includes('mr-scene-rehearsal');i++)next();assert.match(html(),/mr-scene-rehearsal/);
  click({mode:'sell'});assert.match(html(),/Rollback concern/);key('p');assert.doesNotMatch(html(),/LISTEN FOR|AE GUIDE|<header>/);key('ArrowRight');assert.match(html(),/Can the target run/);key('ArrowRight');assert.match(html(),/Can the business transition/);key('Escape');assert.match(html(),/Can the business transition/);
  next();assert.match(html(),/mr-scene-cutover/);key('ArrowRight');assert.match(html(),/data-mr-transfer="false"/);click({migration:'cutover'});assert.match(html(),/data-mr-transfer="true"/);assert.match(html(),/SOURCE RETAINED/);assert.match(html(),/VERIFICATION REQUIRED/);
  next();assert.match(html(),/mr-scene-verify/);click({migration:'previous'});assert.match(html(),/data-mr-transfer="true"/);next();
  for(let i=0;i<5;i++)next();assert.match(html(),/OBSERVABILITY ACTIVE \/ DEMO/);next();assert.match(html(),/mr-scene-optimize/);next();next();assert.match(html(),/mr-scene-final/);next();click({migration:'next-step',value:'assessment'});
  assert.ok(showSession.snapshot().some(e=>e.type==='show_completed'&&e.scope==='migration_rehearsal'));assert.ok(showSession.snapshot().some(e=>e.type==='next_step_selected'&&e.value==='assessment'));
  click({cloud:'close-migration'});assert.match(html(),/CHANGE THE RESPONSE/);click({cloud:'migrate'});assert.match(html(),/mr-scene-final/);
  click({migration:'reset'});click({migration:'reset'});assert.match(html(),/This workload is already running/);assert.equal(showSession.snapshot().some(e=>e.scope==='migration_rehearsal'),false);
  location.hash='#/show/workspace-workday';windowHandlers.hashchange();assert.match(html(),/START THE WORKDAY/);location.hash='#/show/cloud-migration';windowHandlers.hashchange();assert.match(html(),/This workload is already running/);
  click({action:'restart'});assert.match(html(),/Where does your work run today/);assert.equal(timers.size,0);
 }finally{globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear;}
});
