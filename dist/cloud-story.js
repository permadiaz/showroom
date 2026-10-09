import {cloudStory as legacyCloudStory} from './cloud-story-legacy.js';
import {metrics,scenarios} from './cloud-model.js';
import {initialCloudStage,stageProjection} from './cloud-stage-state.js';
import {cloudComponents,cloudNarrative} from './cloud-stage-content.js';
import {WorkloadFlow,EvidenceLabel,TechnologyMapping} from './cloud-stage-primitives.js';
const action=(id,text,secondary=false)=>`<button class="cb-action ${secondary?'is-secondary':''}" data-cloud="${id}">${text}</button>`;
const visualAction=(id,text)=>`<button class="cb-action" data-cloud-visual="${id}">${text}</button>`;
export const usesCloudBenchmark=s=>!!s.environment&&!s.migration&&(!s.scenario||s.scenario==='TRAFFIC SPIKE');
export function cloudStory(s,view=initialCloudStage()){
 if(!usesCloudBenchmark(s))return legacyCloudStory(s);
 const p=stageProjection(s,view),text=s.moment==='compare'&&view.capacityAdded===4&&view.balance?cloudNarrative.stabilized:cloudNarrative[s.moment]||cloudNarrative.normal;
 const payoff=['question','takeaway'].includes(s.moment),technology=s.moment==='capabilities'&&s.reveal;
 return `<section class="business-stage cloud-benchmark cb-${s.moment} ${p.queue?'cb-constrained':''} ${p.elastic?'cb-elastic':''} ${payoff?'cb-payoff':''} ${view.capacityAdded===4?'cb-response-complete':''}" data-cloud-epoch="${p.epoch}" data-cloud-frozen="${p.frozen}" aria-label="Cloud workload story">
 <div class="cb-topline"><span>DATALABS / CLOUD</span><span>SIMULATED DATA</span><span>${s.environment}</span></div>
 <div class="cb-current-moment"><span>${text[0]}</span><span>${p.frozen?'MOMENT HELD':s.running?'DEMAND IN MOTION':p.explaining?'PRESENTER CONTROLLED':'ONE WORKLOAD'}</span></div>
 <div class="cb-stage-body">
 <div class="cb-narrative" aria-live="polite"><h2>${text[1]}</h2>${text[2]?`<p>${text[2]}</p>`:''}${technology?architecture(view):''}</div>
 <div class="cb-living-system">
 <div class="cb-business"><span>WEBSITE${p.queue?'<i>Slower response</i>':''}</span><span>TRANSACTIONS${p.queue?'<i>Some requests wait</i>':''}</span><span>BUSINESS APPLICATION${p.queue?'<i>Responsiveness affected</i>':''}</span></div>
 <div class="cb-workload-name"><span>${p.elastic?'SAME WORKLOAD':'WORKLOAD'}</span>${EvidenceLabel(p.demand,'REQUESTS / MIN','demand',s.running&&!p.frozen)}</div>
 <div class="cb-system-wrap">${WorkloadFlow(p)}${WorkloadFlow(p,true)}${TechnologyMapping(p)}<span class="cb-queue-label ${p.queue?'is-visible':''}">REQUESTS WAITING <i>↘</i></span></div>
 <div class="cb-field-evidence"><div><span class="cb-field-label">${p.elastic?'ELASTIC ARCHITECTURE / CONFIGURATION':'FIXED ARCHITECTURE / CONFIGURATION'}</span><div class="cb-field-values">${EvidenceLabel(p.resources,'ACTIVE RESOURCES','resources')}${EvidenceLabel(p.cpu,'PRESSURE %','pressure')}</div></div>${p.elastic?'<div class="cb-fixed-reference"><span>FIXED RESPONSE / REFERENCE</span><strong>2 resources <i>·</i> 98% at peak</strong><small>Same workload at 15,000 requests/min.</small></div>':''}</div>
 ${p.queue?'<div class="cb-business-consequence"><span>Customer experience at risk</span><span>Transactions may queue</span></div>':p.elastic&&p.resources>2?'<div class="cb-business-consequence cb-resolved"><span>Traffic redistributed</span><span>More room for the same work</span></div>':'<div class="cb-business-consequence"><span>Work is being processed</span><span>Infrastructure healthy</span></div>'}
 </div>
 </div>
 <div class="cb-controls">${action('prev','← Previous',true)}<div class="cb-primary-controls">${controls(s,view,p)}</div></div>
 <div class="cb-footnote"><span>${p.explaining?'PEAK DEMAND HELD · CONCEPTUAL RESPONSE':s.moment==='retest'?'REPLAY · THE SAME DEMAND SEQUENCE':'ILLUSTRATIVE CAPACITY · NOT A PERFORMANCE GUARANTEE'}</span><button class="cb-text-control" data-cloud="details" aria-expanded="${s.details}">${s.details?'Hide':'View'} evidence ${s.details?'−':'＋'}</button></div>
 ${s.details?`<div class="story-metrics cb-detail-evidence"><span>SIMULATED DATA</span><p>${p.demand.toLocaleString('en-US')} requests/min · ${p.resources} illustrative resources · ${p.cpu}% pressure · ${p.queue.toLocaleString('en-US')} queued requests/min.</p><p>At peak, the fixed reference has ${metrics({...s,pressure:3},false).queue.toLocaleString('en-US')} queued requests/min. Actual behavior depends on application design, scaling policy, quotas, dependencies and startup time. Marks represent request flow, not individual live requests.</p></div>`:''}
 </section>
 <div class="cb-understage"><p>${s.environment==='OTHER CLOUD'?'Other Cloud can already use elastic capacity. This is not a limitation of the cloud provider. ':''}This comparison changes architecture and configuration, not simply the provider.</p><details class="cb-other-scenarios"><summary>Other scenarios</summary><label for="scenario-picker">Choose a condition</label><select id="scenario-picker" data-cloud-select="scenario">${scenarios.map(x=>`<option ${s.scenario===x?'selected':''}>${x}</option>`).join('')}</select>${action('clear','Normal state',true)}</details><button class="secondary" data-cloud="migrate">Explore workload migration ＋</button></div>`;
}
function controls(s,view,p){switch(s.moment){
 case 'normal':return action('scenario','TRIGGER TRAFFIC SPIKE →').replace('data-cloud="scenario"','data-cloud="scenario" data-value="TRAFFIC SPIKE"');
 case 'trigger':case 'retest':return s.running?action('pause','Pause escalation',true):action('resume','Resume escalation →');
 case 'consequence':return action('question','REVEAL THE CONTRAST →');
 case 'question':return action('transform','CHANGE THE RESPONSE →');
 case 'compare':return `${view.capacityAdded<4?visualAction('capacity',`MAKE ONE MORE RESOURCE AVAILABLE +1 →`):!view.balance?visualAction('balance','REVEAL THE RESPONSE →'):action('retest','REPLAY THE SAME TRAFFIC SPIKE →')}${view.capacityAdded<4?`<span class="cb-interact-note">${p.resources} resources. Demand stays at 15,000.</span>`:'<span class="cb-interact-note">Replay starts at normal demand, then follows the same spike.</span>'}`;
 case 'stabilized':return action('takeaway','REVEAL WHAT CHANGED →');
 case 'takeaway':return action('reveal','SEE WHAT CHANGED →');
 case 'capabilities':return view.mapping<3?visualAction('mapping',view.mapping===1?'MAP THE RESOURCE POOL →':'MAP THE OBSERVATION LAYER →'):action('retest','Replay the workload',true);
 default:return '';
}}
function architecture(view){const chosen=cloudComponents.find(c=>c.id===view.component);return `<div class="cb-architecture" aria-label="Technology explanation for this workload"><div class="cb-architecture-intro"><span>GOOGLE CLOUD / MECHANISM ${view.mapping} OF 3</span></div><div id="cloud-component-detail" class="cb-component-detail" aria-live="polite">${chosen?`<strong>${chosen.name}</strong><p>${chosen.explanation}</p><small>${chosen.limit}</small>${chosen.source?`<a href="${chosen.source}" target="_blank" rel="noopener noreferrer">Google Cloud documentation ↗</a>`:''}`:`<p>${['The distribution point you watched maps to Cloud Load Balancing.','The same resource pool maps to Compute Engine. A managed instance group and configured autoscaling govern capacity.','The pressure you observed maps to metrics in Cloud Monitoring. Observation supports operational decisions.'][view.mapping-1]}</p><small>Tap a label on the system to explore its role.</small>`}</div>${view.mapping===3?`<button class="cb-dependency-link" data-cloud-visual="component" data-value="dependencies" aria-expanded="${view.component==='dependencies'}" aria-controls="cloud-component-detail">Networking · storage · security / dependencies ↗</button>`:''}<p class="cb-architecture-note">Example mapping, not a deployment blueprint. Datalabs demonstration.</p></div>`;}
