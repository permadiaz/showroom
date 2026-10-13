import test from 'node:test';
import assert from 'node:assert/strict';
import {createQuestionMotion,layoutDataWorld} from '../dist/data-question-motion.js';
import {initialData,dataTransition as move} from '../dist/data-model.js';
import {dataShow} from '../dist/data-view.js';

test('connection resumes remaining time and completes exactly once despite stale callbacks',()=>{
 let clock=0,id=0,calls=0;const jobs=new Map();
 const motion=createQuestionMotion({now:()=>clock,schedule:(fn,ms)=>{jobs.set(++id,{fn,ms});return id;},cancel:id=>jobs.delete(id)});
 const done=()=>calls++;
 motion.sync(true,'CONNECTING',done);const stale=jobs.get(1).fn;
 clock=800;motion.sync(false,'CONNECTING',done);assert.equal(jobs.size,0);
 motion.sync(true,'CONNECTING',done);assert.equal(jobs.get(2).ms,1400);
 stale();assert.equal(calls,0);const finish=jobs.get(2).fn;finish();finish();
 motion.sync(true,'CONNECTING',done);assert.equal(id,2);assert.equal(calls,1);
 motion.reset();finish();assert.equal(calls,1);
});
test('reduced motion completes asynchronously once and reset invalidates callback',()=>{
 const old=globalThis.matchMedia;globalThis.matchMedia=()=>({matches:true});
 try{let callback,delay,calls=0;const m=createQuestionMotion({schedule:(fn,ms)=>{callback=fn;delay=ms;return 1;},cancel(){}});
 m.sync(true,'CONNECTING',()=>calls++);assert.equal(delay,0);assert.equal(calls,0);callback();callback();assert.equal(calls,1);
 m.reset();m.sync(true,'CONNECTING',()=>calls++);m.reset();callback();assert.equal(calls,1);
 }finally{globalThis.matchMedia=old;}
});
test('rerender retains body, pauses running animations and never replays finished animation',()=>{
 let runs=0,finishedRuns=0,replaced;
 const running={playState:'running',pause(){this.playState='paused';},play(){runs++;this.playState='running';}};
 const finished={playState:'finished',play(){finishedRuns++;}};
 const body={dataset:{renderKey:'ANSWER:false:'},getAnimations:()=>[running,finished]};
 const m=createQuestionMotion();m.capture({querySelector:s=>s==='.qs-body'?body:null});assert.equal(running.playState,'paused');
 const fresh={dataset:{...body.dataset},replaceWith:n=>replaced=n};m.restore({querySelector:s=>s==='.qs-body'?fresh:null});
 assert.equal(replaced,body);assert.equal(runs,1);assert.equal(finishedRuns,0);
});
test('persistent world receives new phase and fragment visibility',()=>{
 const oldHidden=[{hidden:true},{hidden:true}];let replaced;
 const world={dataset:{worldPhase:'QUESTION'},setAttribute(){},querySelectorAll:()=>oldHidden};
 const m=createQuestionMotion();m.capture({querySelector:s=>s==='.qs-world'?world:null});
 const fresh={dataset:{worldPhase:'FRAGMENTED'},getAttribute:()=>'',querySelectorAll:()=>[{hidden:false},{hidden:true}],replaceWith:n=>replaced=n};
 m.restore({querySelector:s=>s==='.qs-world'?fresh:null});assert.equal(replaced,world);assert.equal(world.dataset.worldPhase,'FRAGMENTED');assert.equal(oldHidden[0].hidden,false);assert.equal(oldHidden[1].hidden,true);
});
test('paths are measured for desktop rows and mobile two-row composition',()=>{
 for(const mobile of [false,true]){const width=mobile?360:1200;const node=()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v;}});const queries=Array.from({length:4},node),joins=Array.from({length:4},node),trunk=node(),token=node(),svg=node();
 svg.querySelectorAll=s=>s==='.qs-question-path'?queries:joins;svg.querySelector=s=>s==='.qs-trunk'?trunk:token;
 const sources=Array.from({length:4},(_,i)=>({getBoundingClientRect:()=>({left:mobile?(i%2)*180:i*300,width:mobile?160:250,top:mobile&&i>1?150:24,bottom:mobile&&i>1?240:120})}));
 layoutDataWorld({getBoundingClientRect:()=>({width,height:300,left:0,top:0}),querySelectorAll:()=>sources,querySelector:s=>s==='.qs-paths'?svg:{getBoundingClientRect:()=>({top:270,height:20})}});
 assert.equal(svg.attrs.viewBox,`0 0 ${width} 300`);assert.equal(token.attrs.cx,String(width/2));assert.match(joins[3].attrs.d,/270/);assert.equal(queries[2].attrs.d.includes('V146'),mobile);
 }
});
test('twenty repeated complete journeys retain discovery through back and clear on restart',()=>{
 let s=initialData();for(let n=0;n<20;n++){
 for(const action of ['ask','connect','connection-complete','ask-again','show-why','discover']){s=move(s,action);assert.deepEqual(move(s,action),s);assert.match(dataShow(s),/SIMULATION \/ EXAMPLE DATA/);}
 s=move(s,'answerability','multiple_systems');s=move(move(s,'prev'),'discover');assert.equal(s.answerability,'multiple_systems');
 s=move(s,'reset');assert.deepEqual(s,initialData());assert.deepEqual(move(s,'connection-complete'),s);
 }
});
