import test from 'node:test';
import assert from 'node:assert/strict';
import {initialMigration,migrationTransition as act,migrationPrimary,migrationProjection,migrationEvents} from '../dist/migration-model.js';
import {migrationShow,migrationDiagram,migrationLayout,migrationPoint,migrationSales} from '../dist/migration-view.js';
import {createShowSession} from '../dist/show-session.js';
const to=(scene)=>{let s=initialMigration();for(let i=0;s.scene!==scene&&i<65;i++){const p=migrationPrimary(s);assert.ok(p);s=act(s,p.action);}assert.equal(s.scene,scene);return s;};
test('migration gates preserve production at source through discovery, preparation and isolated testing',()=>{
 let s=initialMigration();assert.equal(s.workload,'SAP');assert.doesNotMatch(migrationShow(s),/cb-official-icon/);
 s=act(s,'next');assert.equal(act(s,'next'),s);assert.equal(act(s,'cutover'),s);
 for(const scene of ['discover','assess','design','replicate','test','rehearsal']){
  const v=to(scene);assert.equal(migrationProjection(v).production,'source');assert.equal(v.switched,false);
  if(scene==='test'){assert.equal(v.copied,3);assert.equal(act(v,'next'),v);assert.equal(act(v,'cutover'),v);assert.match(migrationShow(v),/TEST ONLY/);}
 }
 s=to('rehearsal');assert.equal(s.tested,5);assert.equal(migrationProjection(s).freeze,true);assert.doesNotMatch(migrationShow(s),/Can the business transition/);
 s=act(s,'next');assert.match(migrationShow(s),/Can the target run/);assert.doesNotMatch(migrationShow(s),/Can the business transition/);
 s=act(s,'next');assert.match(migrationShow(s),/Can the business transition/);s=act(s,'next');assert.equal(s.scene,'cutover');assert.equal(act(s,'next'),s);
});
test('cutover changes the active path while source persists, and verification gates optimization',()=>{
 let s=to('cutover');s=act(s,'cutover');assert.equal(s.switched,true);assert.equal(s.verified,0);assert.equal(act(s,'previous'),s);
 assert.equal(migrationProjection(s).production,'target');assert.match(migrationShow(s),/SOURCE RETAINED/);assert.match(migrationShow(s),/VERIFICATION REQUIRED/);
 s=act(s,'next');assert.equal(s.scene,'verify');assert.equal(act(s,'next'),s);assert.equal(act(s,'previous').switched,true);
 for(let i=0;i<5;i++)s=act(s,'interact');s=act(s,'next');assert.equal(s.scene,'optimize');assert.equal(act(s,'next'),s);
 s=act(act(s,'interact'),'next');assert.equal(s.scene,'final');assert.doesNotMatch(migrationShow(s),/Understanding the workload was/);s=act(s,'next');assert.match(migrationShow(s),/Understanding the workload was/);
 assert.equal(act(s,'next-step','assessment').nextStep,'assessment');assert.equal(act(s,'next-step','invented'),s);
});
test('rehearsal pause, history, workload choice and repeated reset are isolated and deterministic',()=>{
 let s=act(initialMigration(),'workload','DATABASE');assert.equal(s.workload,'DATABASE');s=act(s,'next');assert.equal(act(s,'workload','SAP'),s);
 s=act(s,'interact');const paused=act(s,'pause');assert.equal(migrationProjection(paused).freeze,true);assert.equal(act(paused,'resume').discovered,1);
 s=act(s,'previous');assert.equal(s.discovered,0);s=to('final');s=act(act(s,'next'),'next-step','workshop');
 for(let i=0;i<4;i++){s=act(s,'reset');assert.deepEqual(s,initialMigration());}
});
test('desktop and mobile transfer geometry ends at the same target, with persistent workload nodes',()=>{
 const before=to('cutover'),after=act(before,'cutover');
 for(const mobile of [false,true]){
  const g=migrationLayout(mobile);assert.deepEqual(migrationPoint(g.prodSource,1),[g.sx,g.sy]);assert.deepEqual(migrationPoint(g.prodTarget,1),[g.tx,g.ty]);
  const a=migrationDiagram(before,mobile),b=migrationDiagram(after,mobile);
  const keys=html=>[...html.matchAll(/data-mr-key="([^"]+)"/g)].map(m=>m[1]);assert.deepEqual(keys(a),keys(b));
  assert.equal((b.match(/data-mr-key="production-/g)||[]).length,12);assert.match(b,/Production traffic reaches target/);
  assert.match(b,/source-environment/);assert.match(b,/target-environment/);
 }
});
test('rehearsal event scope cannot consume main Cloud completion or erase another experience',()=>{
 const session=createShowSession();session.emit('show_completed','cloud-migration',{value:'cloud_story'});session.emit('customer_signal_added','ask-your-data',{value:'test'});
 let s=to('final'),next=act(s,'next');for(const e of migrationEvents(s,next))session.emit(e.type,'cloud-migration',e.payload,{scope:'migration_rehearsal',step:'migration:final'});
 assert.equal(session.snapshot().filter(e=>e.type==='show_completed').length,2);session.resetScope('cloud-migration','migration_rehearsal');
 assert.equal(session.snapshot().filter(e=>e.type==='show_completed').length,1);assert.ok(session.snapshot().some(e=>e.experience==='ask-your-data'));
 session.reset('cloud-migration');assert.equal(session.snapshot().length,1);
});
test('internal migration guidance remains outside Show and safety copy remains explicit',()=>{
 const s=to('rehearsal');assert.match(migrationSales(s),/LISTEN FOR/);assert.match(migrationSales(s),/Rollback concern/);
 for(const scene of ['opening','design','test','cutover','verify','final']){const html=migrationShow(to(scene));assert.doesNotMatch(html,/LISTEN FOR|BUYING SIGNAL|<img/);assert.match(html,/Actual downtime and migration approach depend/);assert.match(html,/not automatic or guaranteed/);}
});

test('finite migration animations freeze at their current time and completed motion does not replay',async()=>{
 const {createMigrationMotion}=await import('../dist/migration-motion.js');let plays=0,finishes=0;
 const a={currentTime:1000,playState:'finished',effect:{getComputedTiming:()=>({endTime:1000})},pause(){this.playState='paused';},play(){plays++;},finish(){finishes++;},cancel(){}};
 const node={dataset:{mrKey:'production-0'},closest:()=>({dataset:{mrSystem:'desktop'}}),hasAttribute:()=>true,getAttribute:k=>({cx:'30',cy:'40',opacity:'1'}[k]),getAnimations:()=>[a]};
 let frozen=false;
 const stage={getAttribute:()=>String(frozen),querySelector:()=>null,querySelectorAll:()=>[node]};
 const root={querySelector:()=>stage},motion=createMigrationMotion();motion.capture(root);motion.restore(root);assert.equal(plays,0);assert.equal(finishes,1);
 a.currentTime=450;a.playState='running';motion.capture(root);frozen=true;motion.restore(root);assert.equal(a.currentTime,450);assert.equal(plays,0);
 motion.capture(root);frozen=false;motion.restore(root);assert.equal(plays,1);assert.equal(a.currentTime,450);
});
