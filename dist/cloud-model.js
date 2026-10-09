export const stages=['DISCOVER','ASSESS','DESIGN','REPLICATE','TEST','CUTOVER','OPTIMIZE'];
export const workloads=['SAP','DATABASE','WEB APPLICATION','VM','DATA WAREHOUSE','ENTIRE WORKLOAD'];
export const environments=['ON-PREMISE','HYBRID','OTHER CLOUD'];
export const scenarios=['TRAFFIC SPIKE','SERVER FAILURE','DATA GROWTH','NEW APPLICATION','BACKUP & RECOVERY'];
export const demandSteps=[1000,3800,8200,15000];
export const initialCloud=()=>({environment:null,scenario:null,pressure:0,migration:false,workload:'WEB APPLICATION',stage:0,tested:false,migrated:false,scaled:false,recovered:false,reveal:false,lesson:0,moment:'normal',running:false,comparison:false,resources:2,details:false});
export function transition(state,action,value){let s={...state};switch(action){
 case 'environment':if(environments.includes(value))s={...initialCloud(),environment:value};break;
 case 'scenario':if(s.environment&&scenarios.includes(value)){s.migration=false;s.scenario=value;s.pressure=0;s.scaled=false;s.recovered=false;s.reveal=false;s.resources=2;s.comparison=false;s.running=value==='TRAFFIC SPIKE';s.moment=s.running?'trigger':'simple';}break;
 case 'tick':if(s.running&&s.scenario==='TRAFFIC SPIKE'){
  s.pressure=Math.min(3,s.pressure+1);
  if(s.comparison)s.resources=[2,2,4,6][s.pressure];
  if(s.pressure===3){s.running=false;s.moment=s.comparison?'stabilized':'consequence';s.scaled=s.comparison;}
 }break;
 case 'pause':s.running=false;break;
 case 'resume':if(s.scenario==='TRAFFIC SPIKE'&&s.pressure<3&&['trigger','retest'].includes(s.moment))s.running=true;break;
 case 'question':if(s.moment==='consequence')s.moment='question';break;
 case 'transform':if(s.moment==='question'){s.comparison=true;s.pressure=0;s.resources=2;s.moment='compare';s.running=false;}break;
 case 'retest':if(s.comparison&&['compare','stabilized','takeaway','capabilities'].includes(s.moment)){s.pressure=0;s.resources=2;s.running=true;s.reveal=false;s.moment='retest';}break;
 case 'takeaway':if(s.moment==='stabilized')s.moment='takeaway';break;
 case 'reveal':if(s.moment==='takeaway'){s.moment='capabilities';s.reveal=true;}break;
 case 'recover':if(['SERVER FAILURE','BACKUP & RECOVERY'].includes(s.scenario))s.recovered=true;break;
 case 'clear':s={...s,scenario:null,pressure:0,scaled:false,recovered:false,reveal:false,moment:'normal',running:false,comparison:false,resources:2};break;
 case 'migrate':if(s.environment){s.migration=true;s.running=false;}break;
 case 'close-migration':s.migration=false;break;
 case 'restart-migration':if(s.migration){s.stage=0;s.tested=false;s.migrated=false;s.workload='WEB APPLICATION';}break;
 case 'workload':if(workloads.includes(value)&&s.stage===0)s.workload=value;break;
 case 'next':if(!s.migration)return storyAdvance(s);if(s.migration&&s.stage<6&&!(s.stage===4&&!s.tested)&&!(s.stage===5&&!s.migrated))s.stage++;break;
 case 'prev':if(!s.migration)return storyBack(s);if(s.migration&&!s.migrated)s.stage=Math.max(0,s.stage-1);break;
 case 'cutover':if(s.migration&&s.stage===4)s.tested=true;else if(s.migration&&s.stage===5&&s.tested)s.migrated=true;break;
 case 'lesson':s.lesson=Math.max(0,Math.min(10,Math.floor(Number(value)||0)));break;
 case 'details':s.details=!s.details;break;
 case 'reset':s=initialCloud();break;
 }return s;}
export function metrics(s,elastic=s.comparison){const demand=demandSteps[s.pressure];const failed=s.scenario==='SERVER FAILURE'&&!s.recovered;const resources=elastic?s.resources:2;const capacity=resources*4000;return {demand,resources,capacity,cpu:failed?0:elastic?Math.min(98,Math.round(demand/capacity*100)):[13,48,89,98][s.pressure],queue:failed?demand:Math.max(0,demand-capacity),storage:s.scenario==='DATA GROWTH'?92:38,status:failed?'Service interrupted':s.scenario==='BACKUP & RECOVERY'&&!s.recovered?'Recovery drill ready':demand>capacity?'Capacity pressure':s.recovered?'Recovery demonstrated':elastic&&resources>2?'Capacity responds to demand':'Infrastructure healthy'};}
export const scenarioGuidance={
 'TRAFFIC SPIKE':{ask:'When traffic spikes, where does the customer experience slow down—and how does your team add capacity?',listen:'Seasonal peaks · Queued transactions · Capacity limits · Manual scaling',probe:'How predictable is demand? Which dependency limits scaling first?',connect:'Connect demand patterns to application design, capacity policy and operating constraints.',next:'Capacity and architecture assessment with the application owner and presales.'},
 'SERVER FAILURE':{ask:'If a critical server stops, which service is affected and how do you recover?',listen:'Single points of failure · Recovery time · Untested failover · Availability requirements',probe:'What recovery time and data-loss window can the business accept?',connect:'Connect the business tolerance to redundancy, recovery procedures and a tested design.',next:'Availability and recovery workshop with infrastructure owners and presales.'},
 'DATA GROWTH':{ask:'How quickly is your data growing, and when does storage become an operational concern?',listen:'Storage saturation · Retention requirements · Backup windows · Data growth',probe:'What must be kept, for how long, and how frequently is it accessed?',connect:'Connect data growth to retention, storage architecture and recovery needs.',next:'Storage and data lifecycle assessment with data and infrastructure owners.'},
 'NEW APPLICATION':{ask:'What has to change before another application can go live?',listen:'Provisioning delays · Shared dependencies · Release planning · Capacity approvals',probe:'Which existing systems will it depend on, and who owns the rollout?',connect:'Connect the launch requirement to dependency mapping and capacity planning.',next:'Application readiness review with application owners and presales.'},
 'BACKUP & RECOVERY':{ask:'When did you last restore a backup and validate that the business could use it?',listen:'Untested restores · Data integrity · Recovery objectives · Backup ownership',probe:'Who validates the restored data, and what defines a successful recovery?',connect:'Connect the backup policy to a practical recovery rehearsal.',next:'Recovery validation exercise with the operations team and presales.'}
};
export const lessons=[
 ['Cloud Basics','Use computing resources delivered over a network. Your team configures and operates services without owning every physical machine.','Like renting workspace with utilities: you still decide how to use it and what controls you need.','Flexibility comes with choices about cost, access and operating responsibility.'],
 ['Compute','The processing power that runs applications and business tasks.','Your ERP needs compute to process an order.','Choose resources based on workload needs, not only the number of users.'],
 ['Storage','Where files, records and backups are kept. Different storage types suit different data.','An invoice archive and a live transaction database have different needs.','Consider access speed, growth, retention and recovery requirements.'],
 ['Networking','The connections that let people and systems exchange information.','A branch office needs a reliable route to its business applications.','Connectivity, latency and access controls affect the whole experience.'],
 ['Load Balancing','Distribute incoming requests across available application instances.','A receptionist directs visitors to available service desks.','The application must be designed to work across those instances.'],
 ['Containers','Package an application with what it needs to run consistently across environments.','A repeatable software package helps teams move and update an application.','Containers do not remove the need for security, data management or operations.'],
 ['Serverless','Run code or services while the provider manages much of the underlying server operation.','A function processes an uploaded document when it arrives.','Limits, startup behavior, architecture and billing still need evaluation.'],
 ['Hybrid Cloud','Connect some existing infrastructure with cloud resources.','A factory system stays on site while selected reporting workloads run in cloud.','Connections, identity and data flows must work across both environments.'],
 ['Migration','Move a workload through discovery, assessment, design, replication, testing and cutover.','Rehearse moving an order system before redirecting live users.','Dependencies, acceptance criteria and a rollback plan determine readiness.'],
 ['Scalability','Adjust capacity as demand changes. Scaling needs a suitable application design and configuration.','Add service desks when a queue grows, then remove unused capacity later.','Quotas, databases, budgets and startup time may constrain scaling.'],
 ['Availability','Design and operate a service so people can use it when needed.','Redundancy helps if a component fails; recovery plans help restore service.','Backup alone is not availability. Define recovery objectives and test failure paths.']
];
export const stageCopy=[
 ['Map what matters.','Identify owners, dependencies, users and critical business processes.'],
 ['Assess readiness.','Check application compatibility, data size, connectivity, risk and recovery objectives.'],
 ['Design the destination.','Agree capacity, access, resilience, network paths and a rollback approach.'],
 ['Replicate the workload.','Copy the chosen workload conceptually while the original environment continues serving traffic.'],
 ['Rehearse before switching.','Simulate a cutover test against a copy. Validate data and application behavior; production traffic stays at the source.'],
 ['Redirect the traffic.','After the rehearsal, simulate routing users to the target. In a real project, approvals, a change window and rollback criteria are essential.'],
 ['Observe. Tune. Repeat.','Observe the migrated workload, confirm operating ownership, and review the capacity response shown in the comparison.']
];
export const technologies=[['Compute','Runs the workload.'],['Storage','Holds data and backups.'],['Networking','Connects users and systems.'],['Load Balancing','Distributes incoming requests.'],['Containers','Package applications consistently.'],['Serverless','Offloads selected infrastructure operations.'],['Monitoring','Shows health and demand.'],['Security','Controls access and protects resources.']];

// Keyboard and visible story controls share these transitions. Timers never reveal chapters.
function storyAdvance(s){
 if(!s.environment)return s;
 const next={normal:'scenario',consequence:'question',question:'transform',compare:'retest',stabilized:'takeaway',takeaway:'reveal'}[s.moment];
 if(next)return transition(s,next,next==='scenario'?'TRAFFIC SPIKE':undefined);
 if(['trigger','retest'].includes(s.moment)&&!s.running)return transition(s,'resume');
 if(s.moment==='simple')return transition(s,['SERVER FAILURE','BACKUP & RECOVERY'].includes(s.scenario)&&!s.recovered?'recover':'clear');
 return s;
}
function storyBack(s){
 if(!s.environment)return s;
 const base={...s,running:false,reveal:false};
 switch(s.moment){
  case 'normal':return {...initialCloud(),lesson:s.lesson};
  case 'trigger':case 'simple':return transition(base,'clear');
  case 'consequence':return {...base,moment:'trigger',pressure:2};
  case 'question':return {...base,moment:'consequence',pressure:3};
  case 'compare':return {...base,moment:'question',comparison:false,pressure:3,resources:2,scaled:false};
  case 'retest':return {...base,moment:'compare',pressure:0,resources:2,scaled:false};
  case 'stabilized':return {...base,moment:'retest',pressure:2,resources:4,scaled:false};
  case 'takeaway':return {...base,moment:'stabilized'};
  case 'capabilities':return {...base,moment:'takeaway'};
  default:return base;
 }
}
