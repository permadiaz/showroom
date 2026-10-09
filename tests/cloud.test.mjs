import test from 'node:test';
import assert from 'node:assert/strict';
import {initialCloud,transition as act,metrics,lessons,environments,scenarios,workloads,demandSteps,scenarioGuidance} from '../dist/cloud-model.js';
import {cloudShow,cloudLearn,cloudSales} from '../dist/cloud-view.js';
const setup=()=>act(initialCloud(),'environment','ON-PREMISE');
const peak=s=>act(act(act(s,'tick'),'tick'),'tick');
const beforePeak=()=>peak(act(setup(),'scenario','TRAFFIC SPIKE'));
const afterReady=()=>act(act(beforePeak(),'question'),'transform');
test('trigger preserves baseline and escalation follows the exact demand sequence',()=>{
 let s=act(setup(),'scenario','TRAFFIC SPIKE');const seen=[metrics(s).demand];assert.equal(s.running,true);
 for(let i=0;i<3;i++){s=act(s,'tick');seen.push(metrics(s).demand);}
 assert.deepEqual(seen,demandSteps);assert.equal(s.moment,'consequence');assert.equal(s.running,false);assert.equal(s.pressure,3);assert.equal(metrics(s).resources,2);assert.equal(metrics(s).queue,7000);assert.equal(act(s,'tick').moment,'consequence');
 const html=cloudShow(s);assert.match(html,/cb-constrained/);assert.match(html,/cb-queue-label is-visible/);assert.match(html,/Customer experience at risk/);assert.doesNotMatch(html,/THE TECHNOLOGY BEHIND/);
});
test('major moments are gated by presenter actions, never timer advancement',()=>{
 let s=setup();for(const action of ['transform','retest','takeaway','reveal'])assert.deepEqual(act(s,action),s);
 s=beforePeak();assert.equal(act(s,'transform').comparison,false);s=act(s,'question');assert.match(cloudShow(s),/Demand changed.<br>Your infrastructure didn't./);assert.match(cloudShow(s),/CHANGE THE RESPONSE/);
 s=act(s,'transform');assert.equal(s.moment,'compare');assert.equal(s.pressure,0);assert.equal(s.running,false);assert.equal(act(s,'tick').pressure,0);assert.equal(act(s,'reveal').reveal,false);
 s=peak(act(s,'retest'));assert.equal(s.moment,'stabilized');assert.equal(s.running,false);assert.equal(act(s,'reveal').reveal,false);s=act(s,'takeaway');assert.match(cloudShow(s),/The workload didn't change/);assert.doesNotMatch(cloudShow(s),/THE TECHNOLOGY BEHIND/);s=act(s,'reveal');assert.equal(s.moment,'capabilities');assert.match(cloudShow(s),/THE TECHNOLOGY BEHIND/);
});
test('same input is compared against fixed and responding capacity',()=>{
 let s=act(afterReady(),'retest');const counts=[s.resources];for(let i=0;i<3;i++){s=act(s,'tick');counts.push(s.resources);assert.equal(metrics(s,true).demand,metrics(s,false).demand);assert.equal(metrics(s,false).resources,2);}
 assert.deepEqual(counts,[2,2,4,6]);assert.equal(metrics(s,false).queue,7000);assert.equal(metrics(s,true).queue,0);assert.equal(metrics(s,true).demand,15000);assert.match(cloudShow(s),/Traffic redistributed/);assert.match(cloudShow(s),/is-added/);
 s=act(act(s,'takeaway'),'reveal');s=act(s,'retest');assert.equal(s.pressure,0);assert.equal(s.resources,2);assert.equal(s.reveal,false);assert.deepEqual(act(s,'reset'),initialCloud());
});
test('pause prevents time advancement and resume only continues active escalation',()=>{let s=act(setup(),'scenario','TRAFFIC SPIKE');s=act(s,'tick');s=act(s,'pause');assert.equal(act(s,'tick').pressure,1);s=act(s,'resume');assert.equal(act(s,'tick').pressure,2);s=beforePeak();assert.equal(act(s,'resume').running,false);});
test('migration retains rehearsal and cutover gates without bypassing story reveal',()=>{
 let s=act(setup(),'migrate');s=act(s,'workload','SAP');for(let i=0;i<4;i++)s=act(s,'next');assert.equal(s.stage,4);assert.equal(act(s,'next').stage,4);s=act(s,'cutover');assert.equal(s.tested,true);assert.equal(s.migrated,false);s=act(s,'next');assert.equal(act(s,'next').stage,5);s=act(s,'cutover');assert.equal(s.migrated,true);s=act(s,'next');assert.equal(s.stage,6);assert.equal(act(s,'reveal').reveal,false);assert.match(cloudShow(s),/Serving business traffic/);assert.equal(act(s,'close-migration').migration,false);
});
test('all choices, secondary scenarios and contextual AE prompts remain supported',()=>{
 for(const e of environments)assert.equal(act(initialCloud(),'environment',e).environment,e);for(const w of workloads)assert.equal(act(act(setup(),'migrate'),'workload',w).workload,w);
 assert.equal(act(initialCloud(),'environment','invalid').environment,null);
 for(const scenario of scenarios){let s=act(setup(),'scenario',scenario);assert.match(cloudShow(s),/SIMULATED DATA/);assert.ok(cloudSales(s).includes(scenarioGuidance[scenario].ask));assert.ok(cloudSales(s).includes(scenarioGuidance[scenario].listen));}
 let s=act(setup(),'scenario','SERVER FAILURE');assert.equal(metrics(s).status,'Service interrupted');assert.match(cloudShow(s),/OFFLINE/);s=act(s,'recover');assert.equal(metrics(s).status,'Recovery demonstrated');
 assert.equal(metrics(act(setup(),'scenario','DATA GROWTH')).storage,92);assert.match(cloudShow(act(setup(),'scenario','NEW APPLICATION')),/NEW APP/);assert.match(cloudShow(act(act(setup(),'scenario','BACKUP & RECOVERY'),'recover')),/RESTORE DEMONSTRATED/);
});
test('eleven learn modules remain separate and metrics disclosure starts closed',()=>{assert.equal(lessons.length,11);for(let i=0;i<11;i++)assert.ok(cloudLearn(act(setup(),'lesson',i)).includes(lessons[i][1]));assert.doesNotMatch(cloudShow(setup()),/class="story-metrics(?: |")/);assert.match(cloudShow(act(setup(),'details')),/class="story-metrics(?: |")/);});
