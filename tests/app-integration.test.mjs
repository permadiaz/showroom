import test from 'node:test';
import assert from 'node:assert/strict';
test('rendered journey, timers, presentation safety and route cancellation',async()=>{
 const appEvents={},windowEvents={},documentEvents={},timers=new Map();let seq=0;
 const actualSet=globalThis.setTimeout,actualClear=globalThis.clearTimeout;
 globalThis.setTimeout=(fn)=>{timers.set(++seq,fn);return seq;};globalThis.clearTimeout=id=>timers.delete(id);
 try{
 const app={innerHTML:'',addEventListener:(name,fn)=>appEvents[name]=fn,querySelectorAll:()=>[]};
 globalThis.document={hidden:false,querySelector:()=>app,addEventListener:(name,fn)=>documentEvents[name]=fn,body:{classList:{toggle(){}}}};
 globalThis.location={hash:'#/show/cloud-migration'};globalThis.window={addEventListener:(name,fn)=>windowEvents[name]=fn,scrollTo(){}};
 await import('../dist/app.js');
 const click=dataset=>appEvents.click({target:{closest:()=>({dataset})}});const key=key=>windowEvents.keydown({key,target:{closest:()=>null},preventDefault(){}});
 const tick=()=>{assert.equal(timers.size,1);const [id,fn]=[...timers][0];timers.delete(id);fn();};
 assert.match(app.innerHTML,/Where does your work run today/);click({cloud:'environment',value:'HYBRID'});assert.match(app.innerHTML,/1,000/);
 click({cloud:'scenario',value:'TRAFFIC SPIKE'});assert.match(app.innerHTML,/1,000/);tick();assert.match(app.innerHTML,/3,800/);
 click({mode:'sell'});assert.match(app.innerHTML,/INTERNAL \/ AE GUIDE/);assert.match(app.innerHTML,/Manual scaling/);
 key('p');assert.doesNotMatch(app.innerHTML,/INTERNAL|AE GUIDE|data-mode="sell"|<header>|FOUNDATION PREVIEW/);key('s');assert.doesNotMatch(app.innerHTML,/AE GUIDE/);assert.match(app.innerHTML,/3,800/);
 tick();assert.match(app.innerHTML,/8,200/);tick();assert.match(app.innerHTML,/15,000/);assert.equal(timers.size,0);assert.doesNotMatch(app.innerHTML,/CHANGE THE RESPONSE/);
 click({cloud:'question'});assert.match(app.innerHTML,/CHANGE THE RESPONSE/);assert.equal(timers.size,0);click({cloud:'transform'});assert.match(app.innerHTML,/ELASTIC ARCHITECTURE/);assert.match(app.innerHTML,/15,000/);assert.equal(timers.size,0);
 for(let resources=3;resources<=6;resources++){click({cloudVisual:'capacity'});assert.match(app.innerHTML,new RegExp(resources+' active resources'));assert.match(app.innerHTML,/15,000/);assert.equal(timers.size,0);}
 assert.doesNotMatch(app.innerHTML,/The flow finds room/);click({cloudVisual:'balance'});assert.match(app.innerHTML,/The flow finds room/);
 key('Escape');click({mode:'learn'});click({mode:'show'});assert.match(app.innerHTML,/6 active resources/);key('p');assert.match(app.innerHTML,/6 active resources/);
 click({cloud:'retest'});tick();tick();tick();assert.equal(timers.size,0);assert.doesNotMatch(app.innerHTML,/The workload didn't change/);click({cloud:'takeaway'});assert.match(app.innerHTML,/The workload didn't change/);assert.doesNotMatch(app.innerHTML,/THE TECHNOLOGY BEHIND/);click({cloud:'reveal'});assert.match(app.innerHTML,/THE TECHNOLOGY BEHIND/);assert.match(app.innerHTML,/cb-node-balancing/);key('ArrowRight');assert.match(app.innerHTML,/cb-node-compute/);key('ArrowRight');assert.match(app.innerHTML,/cb-node-monitoring/);
 key('Escape');click({mode:'learn'});click({cloud:'lesson',value:'10'});assert.match(app.innerHTML,/Backup alone is not availability/);click({mode:'show'});assert.match(app.innerHTML,/THE TECHNOLOGY BEHIND/);
 click({cloud:'retest'});assert.equal(timers.size,1);document.hidden=true;documentEvents.visibilitychange();assert.equal(timers.size,0);document.hidden=false;documentEvents.visibilitychange();assert.equal(timers.size,0);click({cloud:'resume'});assert.equal(timers.size,1);
 location.hash='#/show/ask-your-data';windowEvents.hashchange();assert.equal(timers.size,0);assert.match(app.innerHTML,/WHY DID SALES DECLINE/);
 click({dq:'ask'});assert.match(app.innerHTML,/THE ANSWER IS SCATTERED/);click({dq:'connect'});assert.equal(timers.size,1);click({mode:'learn'});assert.equal(timers.size,0);click({mode:'show'});assert.equal(timers.size,1);key('p');assert.equal(timers.size,1);tick();assert.match(app.innerHTML,/ASK AGAIN/);assert.equal(timers.size,0);
 key('ArrowRight');assert.match(app.innerHTML,/−8.4%/);key('ArrowRight');assert.match(app.innerHTML,/CONVERSION MAY/);click({dq:'technology'});assert.match(app.innerHTML,/BIGQUERY/);key('ArrowLeft');assert.doesNotMatch(app.innerHTML,/BIGQUERY/);key('ArrowRight');click({dq:'answerability',value:'already_answerable'});assert.match(app.innerHTML,/RESPONSE NOTED/);key('Escape');click({mode:'sell'});assert.match(app.innerHTML,/No data opportunity is required/);key('p');assert.doesNotMatch(app.innerHTML,/INTERNAL|AE GUIDE|data-mode="sell"|<header>/);
 click({action:'restart'});click({dq:'ask'});click({dq:'connect'});const stale=[...timers.values()][0];click({action:'restart'});stale();assert.match(app.innerHTML,/data-scene="QUESTION"/);assert.equal(timers.size,0);
 click({dq:'ask'});click({dq:'connect'});location.hash='#/explore';windowEvents.hashchange();assert.equal(timers.size,0);location.hash='#/show/ask-your-data';windowEvents.hashchange();assert.equal(timers.size,1);document.hidden=true;documentEvents.visibilitychange();assert.equal(timers.size,0);document.hidden=false;documentEvents.visibilitychange();tick();assert.match(app.innerHTML,/ASK AGAIN/);

 }finally{globalThis.setTimeout=actualSet;globalThis.clearTimeout=actualClear;}
});
