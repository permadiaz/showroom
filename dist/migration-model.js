// Local rehearsal choreography. Does not alter the approved demand simulation reducer.
export const migrationScenes=['opening','discover','assess','design','replicate','test','rehearsal','cutover','verify','optimize','final'];
export const initialMigration=()=>({scene:'opening',workload:'SAP',discovered:0,assessed:0,designed:0,copied:0,tested:0,beat:0,switched:false,verified:0,optimized:false,finalBeat:0,nextStep:null,paused:false,history:[]});
const snapshot=s=>({...s,history:undefined});
export function migrationTransition(s,action,value){
 if(action==='reset')return initialMigration();
 if(action==='pause')return {...s,paused:true};
 if(action==='resume')return {...s,paused:false};
 if(action==='workload')return s.scene==='opening'&&['SAP','DATABASE','WEB APPLICATION','VM','DATA WAREHOUSE','ENTIRE WORKLOAD'].includes(value)?{...initialMigration(),workload:value}:s;
 if(action==='previous'){
  const previous=s.history.at(-1);if(!previous||s.switched&&!previous.switched)return s;
  return {...previous,paused:s.paused,history:s.history.slice(0,-1)};
 }
 let n={...s};
 if(action==='next-step'&&s.scene==='final'&&s.finalBeat===1&&['assessment','workshop'].includes(value))n.nextStep=value;
 else if(action==='interact'){
  if(s.scene==='discover')n.discovered=Math.min(4,s.discovered+1);
  else if(s.scene==='assess')n.assessed=Math.min(5,s.assessed+1);
  else if(s.scene==='design')n.designed=Math.min(4,s.designed+1);
  else if(s.scene==='replicate')n.copied=Math.min(3,s.copied+1);
  else if(s.scene==='test')n.tested=Math.min(5,s.tested+1);
  else if(s.scene==='verify'&&s.switched)n.verified=Math.min(5,s.verified+1);
  else if(s.scene==='optimize'&&s.verified===5)n.optimized=true;
 }
 else if(action==='cutover'&&s.scene==='cutover'&&s.tested===5&&s.beat===2)n.switched=true;
 else if(action==='next'){
  if(s.scene==='opening')n.scene='discover';
  else if(s.scene==='discover'&&s.discovered===4)n.scene='assess';
  else if(s.scene==='assess'&&s.assessed===5)n.scene='design';
  else if(s.scene==='design'&&s.designed===4)n.scene='replicate';
  else if(s.scene==='replicate'&&s.copied===3)n.scene='test';
  else if(s.scene==='test'&&s.tested===5)n.scene='rehearsal';
  else if(s.scene==='rehearsal'){if(s.beat<2)n.beat++;else n.scene='cutover';}
  else if(s.scene==='cutover'&&s.switched)n.scene='verify';
  else if(s.scene==='verify'&&s.verified===5)n.scene='optimize';
  else if(s.scene==='optimize'&&s.optimized)n.scene='final';
  else if(s.scene==='final')n.finalBeat=1;
 }
 if(JSON.stringify(n)===JSON.stringify(s))return s;
 return {...n,history:[...s.history,snapshot(s)]};
}
export function migrationPrimary(s){
 const interactive={discover:[s.discovered,4,['REVEAL IDENTITY CONNECTION','REVEAL FILE STORAGE','REVEAL BACKUP RELATIONSHIP','REVEAL EXTERNAL API']],assess:[s.assessed,5,['WORKLOAD / BUSINESS CRITICALITY','DATA / SIZE & COMPATIBILITY','DEPENDENCY / NETWORK NEEDS','OPERATIONS / MAINTENANCE WINDOW','BUSINESS / DOWNTIME TOLERANCE']],design:[s.designed,4,['FORM THE COMPUTE LAYER','FORM THE DATA LAYER','CONNECT THE DEPENDENCIES','ADD OBSERVABILITY']],replicate:[s.copied,3,['REPLICATE ILLUSTRATIVE DATA','PREPARE CONFIGURATION','PREPARE WORKLOAD STATE']],test:[s.tested,5,['TEST APPLICATION START','TEST CONNECTIVITY','TEST DATA AVAILABILITY','TEST DEPENDENCIES','TEST OBSERVABILITY']],verify:[s.verified,5,['VERIFY APPLICATION RESPONSE','VERIFY TARGET DATA','VERIFY DEPENDENCIES','VERIFY PRODUCTION PATH','VERIFY OBSERVABILITY']]};
 const entry=interactive[s.scene];if(entry&&entry[0]<entry[1])return {action:'interact',label:entry[2][entry[0]]+' →'};
 if(s.scene==='cutover'&&!s.switched)return {action:'cutover',label:'SIMULATE CUTOVER →'};
 if(s.scene==='optimize'&&!s.optimized)return {action:'interact',label:'EXPLORE WHAT TO OPTIMIZE →'};
 if(s.scene==='final'&&s.finalBeat)return null;
 const labels={opening:'START THE REHEARSAL',discover:'DEFINE THE CONDITIONS',assess:'DESIGN THE DESTINATION',design:'PREPARE THE TARGET',replicate:'OPEN THE TEST PATH',test:'PAUSE BEFORE TRANSITION',rehearsal:['REVEAL THE FIRST QUESTION','REVEAL THE BUSINESS QUESTION','PREPARE CUTOVER'][s.beat],cutover:'TRAFFIC REACHED TARGET / VERIFY',verify:'CONSIDER OPTIMIZATION',optimize:'REVEAL THE LESSON',final:'REVEAL WHAT MADE IT POSSIBLE'};
 return {action:'next',label:labels[s.scene]+' →'};
}
export function migrationProjection(s){
 const index=migrationScenes.indexOf(s.scene);
 return {target:index>=3,production:s.switched?'target':'source',testPath:index>=5,ready:s.tested===5,freeze:s.paused||s.scene==='rehearsal'||s.scene==='final',sourceSecondary:s.switched,verified:s.verified===5,chapter:{opening:'CURRENT',discover:'DISCOVER',assess:'ASSESS',design:'DESIGN',replicate:'REPLICATE',test:'TEST',rehearsal:'REHEARSAL',cutover:'CUTOVER',verify:'VERIFY',optimize:'OPTIMIZE',final:'REVEAL'}[s.scene]};
}
export function migrationEvents(previous,next){
 const events=[];
 if(previous.scene==='opening'&&next.scene==='discover')events.push({type:'show_started',payload:{category:'rehearsal',value:'migration_rehearsal'}});
 if(previous.designed===0&&next.designed===1)events.push({type:'technology_revealed',payload:{category:'migration',value:'illustrative_target'}});
 if(!previous.finalBeat&&next.finalBeat)events.push({type:'show_completed',payload:{category:'rehearsal',value:'migration_rehearsal'}});
 if(next.nextStep&&next.nextStep!==previous.nextStep)events.push({type:'next_step_selected',payload:{category:'migration',value:next.nextStep}});
 return events;
}
// Compatibility for callers using the existing Cloud rehearsal fields directly.
export function migrationFromLegacy(s){
 const v=initialMigration();if(!s.stage)return {...v,workload:s.workload};
 return {...v,workload:s.workload,scene:['opening','assess','design','replicate','test','cutover','optimize'][s.stage],discovered:4,assessed:s.stage>=2?5:0,designed:s.stage>=3?4:0,copied:s.stage>=4?3:0,tested:s.tested?5:0,beat:s.stage>=5?2:0,switched:s.migrated,verified:s.stage===6?5:0};
}
