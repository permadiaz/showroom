import test from 'node:test';
import assert from 'node:assert/strict';
import {initialCloud,transition,metrics} from '../dist/cloud-model.js';
import {initialCloudStage,stageTransition,stageProjection} from '../dist/cloud-stage-state.js';
import {cloudStory} from '../dist/cloud-story.js';
import {requestField,flowLayout} from '../dist/cloud-stage-primitives.js';
import {cloudIcons} from '../dist/cloud-icons.js';
import {createCloudMotion} from '../dist/cloud-stage-motion.js';
const peak=s=>[1,2,3].reduce(s=>transition(s,'tick'),s);
const before=()=>peak(transition(transition(initialCloud(),'environment','OTHER CLOUD'),'scenario','TRAFFIC SPIKE'));
const compare=()=>transition(transition(before(),'question'),'transform');
test('constant peak presentation adds capacity individually without mutating approved business state',()=>{
 const story=compare(),saved=structuredClone(story);let view=initialCloudStage();const observed=[];
 for(let i=0;i<=4;i++){
  const p=stageProjection(story,view);observed.push([p.demand,p.resources,p.cpu,p.queue]);
  view=stageTransition(view,'capacity',null,story);
 }
 assert.deepEqual(observed,[[15000,2,98,7000],[15000,3,98,3000],[15000,4,94,0],[15000,5,75,0],[15000,6,63,0]]);
 assert.deepEqual(story,saved);assert.equal(metrics(story,true).demand,1000);assert.equal(view.capacityAdded,4);
 assert.deepEqual(stageTransition(view,'reset',null,story),initialCloudStage());
 assert.equal(stageTransition(view,'capacity-back',null,story).capacityAdded,3);
});
test('technology stays gated and component inspection is explicit and reversible',()=>{
 let s=compare(),view=initialCloudStage();assert.doesNotMatch(cloudStory(s,view),/assets\/google-cloud/);
 assert.equal(stageTransition(view,'component','compute',s),view);
 s=transition(transition(peak(transition(s,'retest')),'takeaway'),'reveal');
 view=stageTransition(view,'mapping',null,s);view=stageTransition(view,'component','compute',s);
 assert.match(cloudStory(s,view),/cb-official-icon/);
 assert.match(cloudStory(s,view),/aria-expanded="true"/);
 assert.match(cloudStory(s,view),/not a deployment blueprint/);
 assert.equal(stageTransition(view,'component','compute',s).component,null);
 assert.equal(stageTransition(view,'component','unknown',s),view);
});
test('freeze, pause and replay retain the original demand sequence and provider clarification',()=>{
 assert.equal(stageProjection(before()).frozen,true);
 let s=transition(compare(),'retest'),demands=[stageProjection(s).demand];
 s=transition(s,'pause');assert.equal(stageProjection(s).frozen,true);s=transition(s,'resume');assert.equal(stageProjection(s).frozen,false);
 for(let i=0;i<3;i++){s=transition(s,'tick');demands.push(stageProjection(s).demand);}
 assert.deepEqual(demands,[1000,3800,8200,15000]);
 assert.match(cloudStory(s),/Other Cloud can already use elastic capacity/);
 assert.match(cloudStory(s),/SIMULATED DATA/);
});
test('motion preserves positions and time across freeze, resumes explicitly and cancels restart state',()=>{
 let cancelled=0,plays=0,pauses=0;
 const animation={currentTime:321,playState:'running',pause(){pauses++;this.playState='paused';},play(){plays++;this.playState='running';},cancel(){cancelled++;this.playState='idle';}};
 const attrs={cx:'100',cy:'80',opacity:'1'};
 let created=0;
 const node={dataset:{motionKey:'request-d-0',fromX:'80',fromY:'70',duration:'900'},getAttribute:k=>attrs[k],getAnimations:()=>[animation],animate(){created++;}};
 let frozen=false;
 const stage={getAttribute:()=>String(frozen),querySelector:()=>null,querySelectorAll:s=>s==='[data-request]'?[node]:[],getAnimations:()=>[animation]};
 const root={querySelector:()=>stage},motion=createCloudMotion();
 motion.capture(root);frozen=true;motion.restore(root);assert.equal(animation.currentTime,321);assert.equal(plays,0);assert.ok(pauses>0);assert.equal(created,0);
 motion.capture(root);frozen=false;motion.restore(root);assert.equal(plays,1);assert.equal(animation.currentTime,321);
 motion.reset();motion.capture(root);motion.restore(root);assert.ok(cancelled>0);assert.equal(created,1);
});
test('same request identities show spatial congestion and released work stays downstream',()=>{
 const s=compare();let view=initialCloudStage();const fields=[];
 for(let i=0;i<=4;i++){fields.push(requestField(stageProjection(s,view)));view=stageTransition(view,'capacity',null,s);}
 assert.deepEqual(fields.map(f=>f.filter(n=>n.queued).length),[36,24,0,0,0]);
 for(const f of fields)assert.deepEqual(f.map(n=>n.id),fields[0].map(n=>n.id));
 for(const f of fields.slice(1))for(const n of f.filter(n=>n.released))assert.ok(n.y>180,'released work moves past the gate, never back to its source');
 assert.equal(new Set(fields[4].filter(n=>n.active).map(n=>n.resource)).size,6);
 for(const compact of [false,true]){const layout=flowLayout(compact);for(const n of requestField(stageProjection(s),compact)){assert.ok(n.x>=0&&n.x<=layout.w);assert.ok(n.y>=0&&n.y<=layout.h);}}
});
test('balance and technology mappings are presenter gated, without a second diagram',()=>{
 const s=compare();let view=initialCloudStage();assert.equal(stageTransition(view,'balance',null,s).balance,false);
 for(let i=0;i<4;i++)view=stageTransition(view,'capacity',null,s);
 assert.doesNotMatch(cloudStory(s,view),/The flow finds room/);
 view=stageTransition(view,'balance',null,s);assert.match(cloudStory(s,view),/The flow finds room/);
 const tech=transition(transition(peak(transition(s,'retest')),'takeaway'),'reveal');
 view=initialCloudStage();let html=cloudStory(tech,view);assert.match(html,/cb-node-balancing/);assert.doesNotMatch(html,/cb-node-compute|cb-node-monitoring|cb-architecture-map|<img/);
 view=stageTransition(view,'mapping',null,tech);html=cloudStory(tech,view);assert.match(html,/cb-node-compute/);assert.doesNotMatch(html,/cb-node-monitoring/);
 view=stageTransition(view,'mapping',null,tech);html=cloudStory(tech,view);assert.match(html,/cb-node-monitoring/);assert.equal((html.match(/data-persistent-system=/g)||[]).length,2,'one responsive workload pair, not a second architecture diagram');
 assert.deepEqual(stageTransition(view,'reset',null,tech),initialCloudStage());
});
test('official icons are complete self-contained vector artwork with no failing image request',()=>{
 assert.equal(Object.keys(cloudIcons).length,3);
 for(const svg of Object.values(cloudIcons)){assert.match(svg,/viewBox="0 0 512 512"/);assert.match(svg,/<path/);assert.doesNotMatch(svg,/<image|href=|<style|class="st/);assert.ok(svg.trim().endsWith('</svg>'));}
});
