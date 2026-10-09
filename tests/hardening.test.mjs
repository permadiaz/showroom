import test from 'node:test';
import assert from 'node:assert/strict';
import {initialCloud,transition as cloud} from '../dist/cloud-model.js';
import {initialWorkspace,workspaceTransition as work} from '../dist/workspace-model.js';
import {initialData,dataTransition as data} from '../dist/data-model.js';
import {createShowSession,showEventTypes} from '../dist/show-session.js';
import {canRender,Visibility} from '../dist/visibility.js';
import {resolveRoute,experienceHref} from '../dist/navigation.js';
import {problems,shows,worlds} from '../dist/content.js';
import {interactionEvents,experienceStep} from '../dist/experience-events.js';
const peak=s=>cloud(cloud(cloud(s,'tick'),'tick'),'tick');
test('Cloud keyboard progression handles story reveals and Previous without crossing gates',()=>{
 let s=cloud(initialCloud(),'environment','OTHER CLOUD');
 s=cloud(s,'next');assert.equal(s.moment,'trigger');assert.equal(cloud(s,'next').pressure,0);
 s=peak(s);s=cloud(s,'next');assert.equal(s.moment,'question');s=cloud(s,'next');assert.equal(s.moment,'compare');
 s=cloud(s,'prev');assert.equal(s.moment,'question');assert.equal(s.comparison,false);assert.equal(s.pressure,3);
 s=cloud(cloud(s,'next'),'next');s=peak(s);s=cloud(cloud(s,'next'),'next');assert.equal(s.moment,'capabilities');
 s=cloud(s,'prev');assert.equal(s.moment,'takeaway');assert.equal(s.reveal,false);s=cloud(cloud(s,'prev'),'prev');assert.equal(s.moment,'retest');assert.equal(s.running,false);assert.equal(s.resources,4);
 s=cloud(s,'next');assert.equal(s.running,true);
});
test('Migration restart preserves the business comparison and clears only rehearsal state',()=>{
 let s=peak(cloud(cloud(initialCloud(),'environment','HYBRID'),'scenario','TRAFFIC SPIKE'));
 s=cloud(cloud(s,'question'),'transform');s=cloud(s,'migrate');s=cloud(s,'workload','SAP');
 for(let i=0;i<4;i++)s=cloud(s,'next');s=cloud(s,'cutover');s=cloud(s,'next');s=cloud(s,'cutover');s=cloud(s,'next');
 assert.equal(s.stage,6);assert.equal(cloud(s,'prev').stage,6);
 s=cloud(s,'restart-migration');assert.equal(s.stage,0);assert.equal(s.tested,false);assert.equal(s.migrated,false);assert.equal(s.comparison,true);assert.equal(s.workload,'WEB APPLICATION');
 s=cloud(s,'scenario','SERVER FAILURE');assert.equal(s.migration,false);
});
test('Repeated restarts restore all three initial states, including Reverse Discovery and Learn practice',()=>{
 const cases=[[initialCloud,cloud,{...initialCloud(),environment:'OTHER CLOUD',scenario:'TRAFFIC SPIKE',pressure:3,migration:true,migrated:true,tested:true,reveal:true,comparison:true,resources:6,lesson:10}],
 [initialWorkspace,work,{...initialWorkspace(),scene:'final',space:true,channel:'space',slot:'Tue 10:30',notes:true,edits:2,doc:true,ai:true,draft:true,network:true,practice:'run',answer:'CHAT',lesson:4}],
 [initialData,data,{...initialData(),scene:'DISCOVERY',technicalOpen:true,answerability:'multiple_systems',lesson:8}]];
 for(const [initial,reduce,dirty] of cases){let s=dirty;for(let i=0;i<5;i++){s=reduce(s,'reset');assert.deepEqual(s,initial());}}
});
test('Visibility defaults deny; presentation-only is genuinely presentation-only',()=>{
 for(const mode of ['show','sell','learn','explore']){
  assert.equal(canRender('CONFIDENTIAL',mode),false);assert.equal(canRender('CONFIDENTIAL',mode,true),false);
  assert.equal(canRender('PRESENTATION_ONLY',mode),false);assert.equal(canRender('PRESENTATION_ONLY',mode,true),true);
  assert.equal(canRender('INTERNAL',mode,true),false);assert.equal(canRender(undefined,mode),false);assert.equal(canRender('unknown',mode,true),false);
 }assert.equal(canRender(Visibility.PUBLIC,'show'),true);assert.equal(canRender(Visibility.INTERNAL,'show'),false);
});
test('Seven problems and three active worlds resolve to exact approved experiences; malformed routes fail closed',()=>{
 assert.equal(problems.length,7);for(const p of problems){const r=resolveRoute(experienceHref(p.experience,'show',p.entry));assert.equal(r.experience.slug,p.experience);assert.equal(r.entry,p.entry||null);}
 for(const w of worlds.filter(w=>w.show))assert.ok(shows.find(s=>s.slug===w.show));assert.equal(worlds.filter(w=>w.show).length,3);
 for(const route of ['#/invalid/cloud-migration','#/show/not-real','#/show/cloud-migration/extra','#/sell/ask-your-data/not-real'])assert.equal(resolveRoute(route).experience,undefined);
 assert.equal(resolveRoute('#/learn/workspace-workday').mode,'learn');assert.equal(resolveRoute('#/sell/ask-your-data').mode,'sell');
});
test('Local events include context, isolate nested values, bound memory, and reset only one experience',()=>{
 const session=createShowSession();let calls=0;const unsubscribe=session.subscribe(event=>{calls++;if(event.payload.nested)event.payload.nested.x=9;});
 session.start('cloud-migration',{mode:'show',step:'normal'});session.start('cloud-migration');
 const event=session.emit('customer_signal_added','ask-your-data',{nested:{x:1},source:'reverse_discovery',category:'current_state',value:'separate_systems'},{mode:'sell',step:'fragments',source:'pointer'});
 event.payload.nested.x=99;assert.equal(session.snapshot()[1].payload.nested.x,1);assert.equal(event.experience,'ask-your-data');assert.equal(event.mode,'sell');assert.equal(event.step,'fragments');assert.equal(event.source,'reverse_discovery');assert.ok(!Number.isNaN(Date.parse(event.timestamp)));
 session.emit('show_completed','cloud-migration');session.emit('show_completed','cloud-migration');assert.equal(session.snapshot().filter(e=>e.type==='show_completed').length,1);
 session.reset('ask-your-data');assert.equal(session.snapshot().some(e=>e.experience==='ask-your-data'),false);assert.equal(session.snapshot().some(e=>e.experience==='cloud-migration'),true);
 unsubscribe();const old=calls;for(let i=0;i<270;i++)session.emit('mode_changed','cloud-migration',{value:'show'});assert.equal(calls,old);assert.equal(session.snapshot().length,250);
 for(const t of ['mode_changed','presentation_started','presentation_completed','pain_identified','concern_identified'])assert.ok(showEventTypes.includes(t));
});
test('Show events describe observed interactions rather than inferred customer pains',()=>{
 const a=initialCloud(),b=cloud(a,'environment','OTHER CLOUD');const events=interactionEvents('cloud-migration',a,b,'environment');assert.equal(events[0].type,'scenario_triggered');assert.equal(events[0].payload.source,'simulation');assert.equal(events.some(e=>e.type==='current_state_identified'),false);
 const c={...initialWorkspace(),scene:'final'},d=work(c,'next');assert.equal(d.network,true);assert.deepEqual(interactionEvents('workspace-workday',c,d,'next').map(e=>e.type),['technology_revealed','show_completed']);assert.equal(work(d,'prev').network,false);
 assert.equal(experienceStep('cloud-migration',{...b,migration:true,stage:4}),'migration:TEST');
});
