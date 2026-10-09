import test from 'node:test';
import assert from 'node:assert/strict';

test('Fresh visitor product QA route: Universe, every mode, complete stories, restart, problems and Coming Soon',async()=>{
 const appEvents={},windowEvents={},documentEvents={},timers=new Map();let timerId=0;
 const oldSet=globalThis.setTimeout,oldClear=globalThis.clearTimeout;
 const scroll={scrollTop:0},focus={dataset:{},focus(){},scrollIntoView(){}};
 const html=()=>app.innerHTML;
 function elements(tag='button'){
  return [...html().matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`,'g'))].map(([,attributes,text])=>{
   const dataset={};for(const [,key,value] of attributes.matchAll(/data-([\w-]+)="([^"]*)"/g))dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
   return {dataset,disabled:/\bdisabled\b/.test(attributes),attributes,text,focus(){},classList:{toggle(){}},setAttribute(){}};
  });
 }
 const panelRegex=/<div id="world-detail" class="world-detail"[\s\S]*?<\/div>/;
 const app={innerHTML:'',addEventListener:(n,fn)=>appEvents[n]=fn,querySelectorAll:selector=>selector==='button, select, textarea'?elements():[]};
 globalThis.document={hidden:false,activeElement:null,body:{classList:{toggle(){}}},addEventListener:(n,fn)=>documentEvents[n]=fn,
  querySelector(selector){
   if(selector==='#app')return app;
   if(selector==='#data-question')return {value:html().match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)?.[1]||''};
   if(selector==='.ws-scene-body, .dq-scene')return /class="(?:ws-scene-body|dq-scene)"/.test(html())?scroll:null;
   if(selector==='.world-detail')return {replaceWith(node){app.innerHTML=html().replace(panelRegex,node.outerHTML);}};
   if(selector==='.drawer .close')return elements().find(e=>e.dataset.action==='close');
   return focus;
  },
  querySelectorAll:()=>elements().filter(e=>e.dataset.world),
  createElement(){return {innerHTML:'',querySelector(){return {outerHTML:this.innerHTML.match(panelRegex)?.[0]};}};}
 };
 globalThis.location={hash:'#/'};
 globalThis.history={replaceState(_a,_b,hash){location.hash=hash;}};
 globalThis.window={addEventListener:(n,fn)=>windowEvents[n]=fn,scrollTo(){}};
 globalThis.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};globalThis.clearTimeout=id=>timers.delete(id);
 try{
  const {showSession}=await import('../dist/app.js');
  const click=dataset=>{const node=elements().find(n=>Object.entries(dataset).every(([k,v])=>n.dataset[k]===v));assert.ok(node,`Reachable button ${JSON.stringify(dataset)}`);appEvents.click({target:{closest:()=>node}});};
  const navigate=hash=>{location.hash=hash;windowEvents.hashchange();};
  const key=(value,editable=false)=>windowEvents.keydown({key:value,target:{closest:()=>editable?{}:null},preventDefault(){}});
  const linkToWorld=id=>{click({world:id});const panel=html().match(panelRegex)?.[0];const href=panel?.match(/href="([^"]+)"/)?.[1];assert.ok(href,`World ${id} has experience link`);navigate(href);};
  const tick=()=>{assert.equal(timers.size,1);const [id,fn]=[...timers][0];timers.delete(id);fn();};
  const has=t=>assert.ok(html().includes(t),`Rendered: ${t}`);
  const customerSafe=()=>{assert.doesNotMatch(html(),/INTERNAL|AE GUIDE|LISTEN FOR|data-mode="sell"|<header>/);};
  has('Complex ideas.');has('Experience the transformation.');assert.equal(elements().filter(x=>x.dataset.world).length,8);
  click({world:'think'});has('AI &amp; Intelligence'.replace('&amp;','&'));assert.match(html().match(panelRegex)[0],/COMING SOON/);assert.doesNotMatch(html().match(panelRegex)[0],/href=/);
  linkToWorld('run');has('Where does your work run today?');click({cloud:'environment',value:'OTHER CLOUD'});has('not a limitation of the cloud provider');
  key('ArrowRight');tick();has('3,800');click({action:'restart'});has('Where does your work run today?');assert.equal(timers.size,0);
  click({mode:'learn'});assert.equal(location.hash,'#/learn/cloud-migration');click({cloud:'lesson',value:'10'});has('Backup alone is not availability');
  click({mode:'sell'});has('SELL · INTERNAL AE GUIDANCE');click({action:'present'});customerSafe();has('Where does your work run today?');
  click({cloud:'environment',value:'HYBRID'});key('ArrowRight');tick();key('Escape',true);has('<header>');has('3,800');
  // Route changes pause the active test and preserve its exact stage until explicit Resume.
  navigate('#/explore');assert.equal(timers.size,0);has('Return to Cloud & Migration');navigate('#/show/cloud-migration');has('3,800');has('Resume escalation');assert.equal(timers.size,0);click({cloud:'resume'});tick();tick();
  key('ArrowRight');has('CHANGE THE RESPONSE');navigate('#/explore');
  linkToWorld('work');has('START THE WORKDAY');key('ArrowRight');has('WATCH WHAT HAPPENS TO IT');key('ArrowRight');has('FIND A TIME');click({ws:'next'});
  click({ws:'next'});has('FIND A TIME');click({ws:'find-time'});click({ws:'slot',value:'Tue 09:00'});has('Choose a proposed time');click({ws:'slot',value:'Tue 10:30'});
  for(const action of ['invite','meet-link','attach','create-event'])click({ws:action});has('a time. People. A place to continue.');click({ws:'next'});
  click({mode:'sell'});click({ws:'adoption',value:'microsoft'});has('respect what works');key('p');customerSafe();has('START THE MEETING');key('Escape');
  click({ws:'start-meet'});for(let i=0;i<4;i++)click({ws:'conversation'});click({ws:'notes'});has('SIMULATED CONTENT');click({ws:'end-meeting'});has('The meeting ended.');assert.doesNotMatch(html(),/But the work didn’t/);key('ArrowRight');has('But the work didn’t.');key('ArrowRight');
  click({ws:'chat'});has('A focused exchange');click({ws:'next'});has('CREATE A SPACE');click({ws:'space'});click({ws:'thread-open'});has('Thread · downtime approval');click({ws:'thread-reply'});click({ws:'thread-reply'});click({ws:'thread-close'});has('1 OPEN QUESTION');click({ws:'next'});
  click({ws:'file',value:'Proposal Draft'});for(let i=0;i<3;i++)click({ws:'contribute'});has('Customer to confirm');click({mode:'learn'});click({ws:'lesson',value:'10'});has('Tasks');click({mode:'show'});has('Customer to confirm');
  click({ws:'next'});click({ws:'ai'});has('Approved downtime tolerance');click({ws:'next'});click({ws:'draft'});has('Draft · not sent');click({ws:'next'});key('ArrowRight');has('One continuous context.');key('ArrowRight');has('The work didn’t have to start over.');
  assert.equal(showSession.snapshot().filter(e=>e.experience==='workspace-workday'&&e.type==='show_completed').length,1);
  click({ws:'discovery'});click({ws:'signal',value:'MULTIPLE PLACES'});assert.equal(showSession.snapshot().filter(e=>e.type==='customer_signal_added'&&e.category==='workspace_continuity'&&e.value==='multiple_places').length,1);
  key('ArrowLeft');assert.doesNotMatch(html(),/How does work continue after a meeting/);click({ws:'discovery'});has('multiple places');
  click({action:'restart'});click({action:'restart'});has('START THE WORKDAY');assert.equal(showSession.snapshot().filter(e=>e.experience==='workspace-workday'&&e.type==='customer_signal_added').length,0);
  navigate('#/show/cloud-migration');has('CHANGE THE RESPONSE'); // Workspace reset did not reset Cloud.
  navigate('#/explore');linkToWorld('understand');has('WHY DID SALES DECLINE');click({dq:'ask'});has('THE ANSWER IS SCATTERED.');click({dq:'connect'});has('CONNECTING');tick();has('ASK AGAIN');
  click({mode:'sell'});has('INTERNAL / AE GUIDE');click({action:'present'});customerSafe();click({dq:'ask-again'});has('−8.4%');has('CAME FROM 3 BRANCHES.');click({dq:'show-why'});has('CONVERSION MAY BE WORTH INVESTIGATING.');has('WHICH CUSTOMER SEGMENTS DROVE THE DECLINE?');click({dq:'technology'});has('BIGQUERY');click({dq:'close-technology'});click({dq:'discover'});click({dq:'answerability',value:'wait_for_report'});has('RESPONSE NOTED.');
  const events=showSession.snapshot();assert.ok(events.some(e=>e.type==='show_completed'&&e.experience==='ask-your-data'));assert.ok(events.some(e=>e.category==='data_answerability'&&e.value==='wait_for_report'));assert.equal(timers.size,0);
  click({action:'restart'});click({action:'restart'});customerSafe();has('WHY DID SALES DECLINE');assert.equal(showSession.snapshot().some(e=>e.experience==='ask-your-data'&&e.type==='customer_signal_added'),false);key('Escape');
  // Re-entering Sell after reset cannot recover the old signal or question path.
  click({mode:'sell'});assert.doesNotMatch(html(),/STATED CURRENT ENVIRONMENT/);click({action:'close'});assert.equal(location.hash,'#/show/ask-your-data');
  navigate('#/problems');assert.equal((html().match(/class="problem"/g)||[]).length,7);has('Migration downtime is a concern');navigate('#/show/cloud-migration?entry=migration');has('MIGRATION REHEARSAL');
  click({action:'restart'});assert.equal(location.hash,'#/show/cloud-migration');has('Where does your work run today?');click({cloud:'environment',value:'ON-PREMISE'});assert.doesNotMatch(html(),/id="migration-rehearsal"/);
  navigate('#/magic');for(const title of ['Cloud & Migration','A Day at Work','Ask Your Data','CUSTOM MAGIC SHOW'])has(title);has('COMING SOON');has('Turn a customer problem into an interactive solution story.');
  navigate('#/show/not-a-show');has('Story not found.');has('Return to the universe');navigate('#/sell/workspace-workday');has('SELL · INTERNAL AE GUIDANCE');key('p');customerSafe();navigate('#/show/ask-your-data');
  const ended=showSession.snapshot().filter(e=>e.type==='presentation_completed').at(-1);assert.equal(ended.experience,'workspace-workday');assert.equal(ended.source,'navigation');has('WHY DID SALES DECLINE');
  assert.equal(timers.size,0);
 }finally{globalThis.setTimeout=oldSet;globalThis.clearTimeout=oldClear;delete globalThis.history;}
});
