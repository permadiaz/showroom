import test from 'node:test';
import assert from 'node:assert/strict';
import {initialData,dataTransition as move,dataScenes,dataEvents} from '../dist/data-model.js';
import {dataShow,dataLearn,dataSales} from '../dist/data-view.js';
import {businessQuestion,sourceFragments,answerability,benchmark} from '../dist/data-question-content.js';
import {createQuestionMotion} from '../dist/data-question-motion.js';
const run=(...actions)=>actions.reduce((s,a)=>Array.isArray(a)?move(s,...a):move(s,a),initialData());
const connected=()=>run('ask','connect','connection-complete');
const end=()=>run('ask','connect','connection-complete','ask-again','show-why','discover');
test('exactly seven states, no legacy gates or question-entry form',()=>{
 assert.deepEqual(dataScenes,['QUESTION','FRAGMENTED','CONNECTING','CONNECTED','ANSWER','EVIDENCE','DISCOVERY']);
 assert.equal(initialData().question,businessQuestion);assert.equal((dataShow(initialData()).match(/data-dq=/g)||[]).length,1);
 for(const scene of dataScenes){const h=dataShow({...initialData(),scene});assert.equal((h.match(/data-persistent-question=/g)||[]).length,1);assert.doesNotMatch(h,/C-1048|CUS1048|SKU|normalization|Dataflow|Gemini|BigQuery|BIGQUERY|textarea|prepare|duration/);}
});
test('four sources remain spatially identical while connecting; detailed metrics wait for answer',()=>{
 for(const scene of ['FRAGMENTED','CONNECTING','CONNECTED']){const h=dataShow({...initialData(),scene});for(const x of sourceFragments)assert.equal((h.match(new RegExp(`data-source-key="${x.id}"`,'g'))||[]).length,1);assert.equal(sourceFragments.length,4);assert.doesNotMatch(h,/-8.4|−8.4|<article/);}
 assert.match(dataShow(move(initialData(),'ask')),/THE ANSWER IS SCATTERED/);
});
test('primary flow is presenter controlled except one bounded connection',()=>{
 let s=initialData();for(const expected of ['FRAGMENTED','CONNECTING']){s=move(s,'next');assert.equal(s.scene,expected);}assert.equal(move(s,'next').scene,'CONNECTING');s=move(s,'connection-complete');assert.equal(s.scene,'CONNECTED');for(const scene of ['ANSWER','EVIDENCE','DISCOVERY']){s=move(s,'next');assert.equal(s.scene,scene);}assert.equal(move(s,'next').scene,'DISCOVERY');
 for(const action of ['prepare','ask','ask-again','skip-ai','ai','products','duration-open','connection-complete'])assert.deepEqual(move(s,action),s);
});
test('back skips transient connecting destination, reset clears all local choices repeatedly',()=>{
 let s=end();for(const expected of ['EVIDENCE','ANSWER','CONNECTED','FRAGMENTED','QUESTION']){s=move(s,'prev');assert.equal(s.scene,expected);}assert.equal(move(s,'prev').scene,'QUESTION');
 s=move(move(end(),'answerability','export_to_excel'),'technology');assert.deepEqual(move(move(s,'reset'),'reset'),initialData());assert.equal(move(run('ask','connect'),'prev').scene,'FRAGMENTED');
});
test('technology branch cannot bypass understanding; closing retains exact story and choice',()=>{
 for(const scene of dataScenes.slice(0,5))assert.equal(move({...initialData(),scene},'technology').technicalOpen,false);
 let s=move(end(),'answerability','already_answerable');s=move(s,'technology');assert.match(dataShow(s),/BIGQUERY/);assert.match(dataShow(s),/OPTIONAL AI/);assert.doesNotMatch(dataShow(s),/data-dq="answerability"/);assert.deepEqual(move(s,'next'),s);s=move(s,'prev');assert.equal(s.scene,'DISCOVERY');assert.equal(s.answerability,'already_answerable');assert.equal(s.technicalOpen,false);assert.match(dataSales(s),/No data opportunity is required/);
});
test('single discovery question validates six choices and emits only explicit changed signals',()=>{
 assert.equal(answerability.length,6);assert.equal(move(initialData(),'answerability','multiple_systems').answerability,null);
 const s=end(),next=move(s,'answerability','wait_for_report');assert.deepEqual(dataEvents(s,next),[{type:'customer_signal_added',payload:{category:'data_answerability',value:'wait_for_report',source:'reverse_discovery'}}]);assert.deepEqual(dataEvents(next,move(next,'answerability','wait_for_report')),[]);assert.deepEqual(move(next,'answerability','forged'),next);assert.deepEqual(move(next,'duration','over_week'),next);
});
test('both asks use the exact question and example arithmetic supports the concise evidence',()=>{
 const first=dataEvents(initialData(),move(initialData(),'ask'))[0];const second=dataEvents(connected(),move(connected(),'ask-again'))[0];assert.equal(first.payload.question,second.payload.question);
 const previous=benchmark.branches.reduce((n,r)=>n+r.previous,0),current=benchmark.branches.reduce((n,r)=>n+r.current,0);assert.equal(((current/previous-1)*100).toFixed(1),'-8.4');assert.ok(benchmark.branches.slice(0,3).reduce((n,r)=>n+r.previous-r.current,0)/(previous-current)>.9);assert.equal(((benchmark.transactions.current/benchmark.transactions.previous-1)*100).toFixed(0),'-11');assert.equal(((benchmark.traffic.current/benchmark.traffic.previous-1)*100).toFixed(0),'14');assert.ok(benchmark.transactions.current/benchmark.traffic.current<benchmark.transactions.previous/benchmark.traffic.previous);
 assert.match(dataShow({...initialData(),scene:'EVIDENCE'}),/MAY BE WORTH INVESTIGATING/);assert.match(dataShow({...initialData(),scene:'EVIDENCE'}),/SIMULATION \/ EXAMPLE DATA/);
});
test('timer is single, cancels on leave/reset, stale callback cannot advance another run',()=>{
 const pending=new Map();let id=0,calls=0;const motion=createQuestionMotion({schedule:fn=>{pending.set(++id,fn);return id;},cancel:n=>pending.delete(n)});const complete=()=>calls++;
 motion.sync(true,'CONNECTING',complete);motion.sync(true,'CONNECTING',complete);assert.equal(pending.size,1);const stale=[...pending.values()][0];motion.sync(false,'CONNECTING',complete);assert.equal(pending.size,0);stale();assert.equal(calls,0);motion.sync(true,'CONNECTING',complete);motion.reset();assert.equal(pending.size,0);motion.sync(true,'CONNECTING',complete);const fn=[...pending.values()][0];pending.clear();fn();assert.equal(calls,1);motion.sync(true,'CONNECTED',complete);assert.equal(pending.size,0);
});
test('persistent question and four-source world retain actual nodes across transformation',()=>{
 let phase='FRAGMENTED',replacedQ,replacedW;const q={},w={dataset:{worldPhase:phase},getAnimations:()=>[],setAttribute(){}};let fresh=false;
 const root={querySelector:sel=>sel==='.qs-question'?(fresh?{replaceWith:n=>replacedQ=n}:q):sel==='.qs-world'?(fresh?{dataset:{worldPhase:'CONNECTING'},getAttribute:()=>'',replaceWith:n=>replacedW=n}:w):null};
 const motion=createQuestionMotion();motion.capture(root);fresh=true;motion.restore(root);assert.equal(replacedQ,q);assert.equal(replacedW,w);assert.equal(w.dataset.worldPhase,'CONNECTING');
});
test('all fifteen Learn modules remain available outside Show',()=>{for(let lesson=0;lesson<15;lesson++){assert.match(dataLearn({...initialData(),lesson}),/WHAT NOT TO CLAIM/);assert.match(dataLearn({...initialData(),lesson}),/COMMON CUSTOMER QUESTION/);}});
