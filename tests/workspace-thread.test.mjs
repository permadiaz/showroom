import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorkspace,workspaceTransition as act} from '../dist/workspace-model.js';
import {workspaceShow,workspaceLearn,workspaceSales} from '../dist/workspace-view.js';
import {request,workspaceBehaviors,behaviorLevels,learningRoles} from '../dist/workspace-thread-content.js';
import {interactionEvents} from '../dist/experience-events.js';
import {createThreadMotion} from '../dist/workspace-thread-motion.js';
const setup=()=>{let s=act(initialWorkspace(),'opening-reveal');s=act(s,'start-thread');s=act(s,'next');for(const [a,v] of [['find-time'],['slot','Wed 14:00'],['invite'],['meet-link'],['attach'],['create-event']])s=act(s,a,v);return act(s,'next');};
const space=()=>{let s=act(setup(),'start-meet');for(let i=0;i<4;i++)s=act(s,'conversation');s=act(s,'notes');s=act(s,'end-meeting');s=act(s,'next');s=act(s,'next');return act(s,'space');};
const work=()=>{let s=space();s=act(s,'thread-open');s=act(act(s,'thread-reply'),'thread-reply');s=act(s,'thread-close');return act(s,'next');};
const final=()=>{let s=act(work(),'file','Proposal Draft');for(let i=0;i<3;i++)s=act(s,'contribute');s=act(s,'next');s=act(s,'ai');s=act(s,'next');s=act(s,'draft');return act(s,'next');};
test('same request identity survives every workday moment without exposing the catalog at opening',()=>{
 let s=initialWorkspace();assert.doesNotMatch(workspaceShow(s),/Google|Gemini|Gmail|Calendar/);assert.doesNotMatch(workspaceShow(s),/WATCH WHAT HAPPENS/);
 s=act(s,'opening-reveal');assert.match(workspaceShow(s),/WATCH WHAT HAPPENS/);
 for(const state of [s,act(s,'start-thread'),setup(),space(),work(),final()]){const html=workspaceShow(state);assert.ok(html.includes(`data-request-id="${request.id}"`));assert.ok(html.includes(request.subject));assert.doesNotMatch(html,/ws-network-core|<img|REAL PRODUCT BEHAVIOR|INTERNAL/);}
});
test('conversation must accumulate before notes, and meeting-end reveals require separate actions',()=>{
 let s=setup();assert.match(workspaceShow(s),/Wed 14:00/);assert.equal(act(s,'notes').notes,false);s=act(s,'start-meet');
 for(let i=0;i<4;i++){assert.equal(act(s,'notes').notes,false);s=act(s,'conversation');}
 s=act(s,'notes');assert.equal(s.notes,true);assert.match(workspaceShow(s),/SIMULATED CONTENT/);s=act(s,'end-meeting');assert.equal(s.thread.end,1);assert.doesNotMatch(workspaceShow(s),/wt-participants|But the work/);
 s=act(s,'next');assert.equal(s.thread.end,2);assert.match(workspaceShow(s),/But the work didn’t/);assert.equal(s.scene,'meet');s=act(s,'next');assert.equal(s.scene,'collaborate');s=act(s,'prev');assert.equal(s.thread.end,2);assert.equal(s.scene,'meet');
});
test('inline thread keeps parent context, supports closure and preserves the open item',()=>{
 let s=space();assert.equal(act(s,'next').scene,'collaborate');s=act(s,'thread-open');assert.match(workspaceShow(s),/wt-space-main/);assert.match(workspaceShow(s),/wt-thread-heading/);s=act(s,'thread-close');assert.equal(s.thread.threadDone,false);
 s=act(s,'thread-open');s=act(act(s,'thread-reply'),'thread-reply');s=act(s,'thread-close');assert.equal(s.thread.threadDone,true);assert.match(workspaceShow(s),/1 OPEN QUESTION/);assert.doesNotMatch(workspaceShow(s),/wt-thread-heading/);s=act(s,'next');assert.equal(s.scene,'work');assert.match(workspaceShow(s),/downtime approval/);
});
test('shared document inputs gate contextual assistance and keep unknowns unresolved',()=>{
 let s=work();assert.equal(act(s,'contribute').edits,0);s=act(s,'file','Proposal Draft');for(let i=0;i<3;i++){assert.equal(act(s,'next').scene,'work');s=act(s,'contribute');}
 assert.equal(s.edits,2);assert.equal(s.doc,true);assert.match(workspaceShow(s),/Technical Team/);assert.match(workspaceShow(s),/Customer to confirm/);s=act(s,'next');assert.equal(s.scene,'gemini');assert.equal(act(s,'next').scene,'gemini');s=act(s,'ai');for(const q of request.open)assert.ok(workspaceShow(s).includes(q));s=act(s,'next');assert.equal(act(s,'next').scene,'followup');s=act(s,'draft');assert.match(workspaceShow(s),/RE: Cloud Migration Discussion/);assert.match(workspaceShow(s),/Draft · not sent/);
});
test('final reveal and discovery are manual, events only describe explicit local choices, reset clears everything',()=>{
 let s=final();assert.match(workspaceShow(s),/wt-continuous-line/);assert.equal(act(s,'signal','MULTIPLE PLACES').thread.signal,null);s=act(s,'next');assert.equal(s.network,false);assert.equal(act(s,'discovery').thread.discovery,false);const before=s;s=act(s,'next');assert.equal(s.network,true);assert.equal(interactionEvents('workspace-workday',before,s,'next').filter(e=>e.type==='show_completed').length,1);assert.equal(act(s,'next').thread.finalBeat,2);
 s=act(s,'discovery');const prior=s;s=act(s,'signal','MULTIPLE PLACES');assert.deepEqual(interactionEvents('workspace-workday',prior,s,'signal'),[{type:'customer_signal_added',payload:{category:'workspace_continuity',value:'multiple_places'}}]);assert.deepEqual(interactionEvents('workspace-workday',s,act(s,'signal','MULTIPLE PLACES'),'signal'),[]);assert.equal(act(s,'signal','forged').thread.signal,'MULTIPLE PLACES');assert.deepEqual(act(act(s,'reset'),'reset'),initialWorkspace());
});
test('internal behavior classification and customer-fit guidance do not appear in Show',()=>{
 for(const action of ['find-time','create-event','notes','space','thread-open','thread-reply','contribute','ai','draft'])assert.equal(workspaceBehaviors[action].classification,behaviorLevels.simulated);
 let s=act(initialWorkspace(),'adoption','microsoft');assert.match(workspaceSales(s),/respect what works/);assert.doesNotMatch(workspaceShow(s),/Microsoft|Do not pitch/);s=act(s,'lesson',10);assert.match(workspaceLearn(s),/Tasks/);assert.match(workspaceLearn(s),/WHAT NOT TO CLAIM/);assert.equal(Object.keys(learningRoles).length,11);
});
test('request node is retained, not recreated, when the same request changes phase',()=>{
 const phase={textContent:' / REQUEST'},old={querySelector:()=>phase,getBoundingClientRect:()=>({left:0,top:0})};let replaced=null;
 const next={querySelector:()=>({textContent:' / EVENT'}),replaceWith:n=>replaced=n};const motion=createThreadMotion();motion.capture({querySelector:()=>old});motion.restore({querySelector:()=>next});assert.equal(replaced,old);assert.equal(phase.textContent,' / EVENT');motion.reset();replaced=null;motion.restore({querySelector:()=>next});assert.equal(replaced,null);
});
