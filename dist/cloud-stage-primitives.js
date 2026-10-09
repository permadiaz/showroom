import {cloudIcons} from './cloud-icons.js';
import {cloudComponents} from './cloud-stage-content.js';
// Geometry is shared across all chapters. Request identity never depends on the moment.
export const flowLayout=compact=>compact?{w:420,h:430,cx:210,sources:[64,210,356],units:[[168,270],[252,270],[84,270],[336,270],[168,334],[252,334]]}:{w:900,h:430,cx:450,sources:[180,450,720],units:[[390,258],[510,258],[270,258],[630,258],[150,258],[750,258]]};
const pointOn=(points,t)=>{const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let left=Math.max(0,Math.min(1,t))*lengths.reduce((a,b)=>a+b,0);for(let i=0;i<lengths.length;i++){if(left<=lengths[i]||i===lengths.length-1){const f=left/lengths[i];return [points[i][0]+(points[i+1][0]-points[i][0])*f,points[i][1]+(points[i+1][1]-points[i][1])*f];}left-=lengths[i];}return points[0];};
export function requestField(p,compact=false){
 const g=flowLayout(compact),active=[15,30,48,72][p.pressure];
 // Spatial marks are qualitative queue depth, never a second numerical simulation.
 const waiting=p.queue?Math.ceil(Math.sqrt(p.queue/7000)*36):0;
 return Array.from({length:72},(_,id)=>{
  const queued=id>=active-waiting&&id<active,q=id-(active-waiting),resource=id%p.resources;
  const source=g.sources[id%3],unit=g.units[resource];
  const path=[[source,18],[source,46],[g.cx,95],[g.cx,180],[unit[0],unit[1]-10]];
  const phase=((id*17)%73)/100+.05;
  // Waiting work stacks backward from the narrow gate, while other paths still process.
  const released=p.elastic&&p.pressure===3&&id>=36&&!queued;
  const pos=queued?[g.cx-25+(q%6)*10,176-Math.floor(q/6)*11]:released?pointOn([[g.cx,180],[unit[0],unit[1]-10]],.35+((id*17)%61)/100):pointOn(path,phase);
  const from=pointOn(path,Math.max(0,phase-.16));
  return {id,x:pos[0],y:pos[1],fromX:from[0],fromY:from[1],queued,released,resource,active:id<active,duration:queued?1250:p.elastic&&p.resources>2?1600:[1900,1400,1100,900][p.pressure]};
 });
}
export function WorkloadFlow(p,compact=false){
 const g=flowLayout(compact),{cx}=g;
 return `<svg class="cb-system ${compact?'cb-system-mobile':'cb-system-desktop'}" data-persistent-system="${compact?'compact':'wide'}" viewBox="0 0 ${g.w} ${g.h}" role="img" aria-label="Same workload: ${p.demand.toLocaleString('en-US')} requests per minute, ${p.resources} active resources. ${p.queue?'Requests are waiting.':'Requests are flowing.'}">
 <g class="cb-source-paths">${g.sources.map(x=>`<path d="M${x} 18 V46 L${cx} 95"/>`).join('')}</g>
 <path class="cb-trunk" d="M${cx} 95 V180"/><circle class="cb-workload-point" cx="${cx}" cy="95" r="5"/>
 <g class="cb-capacity-field">${g.units.map(([x,y],i)=>`<g class="cb-resource ${i<p.resources?'is-active':''} ${i>=2&&i<p.resources?'is-added':''}" data-resource="${i}" opacity="${i<p.resources?1:0}"><path class="cb-capacity-connection" d="M${cx} 180 L${x} ${y-10}"/><circle class="cb-resource-ring" cx="${x}" cy="${y}" r="19"/><circle class="cb-resource-core" cx="${x}" cy="${y}" r="5"/><path class="cb-processed" d="M${x} ${y+23} v16"/><text x="${x}" y="${y+53}" text-anchor="middle">${String(i+1).padStart(2,'0')}</text></g>`).join('')}</g>
 <path class="cb-boundary" d="M${cx-43} 194 h28 m30 0 h28" opacity="${p.elastic?0:1}"/>
 <g class="cb-request-flow">${requestField(p,compact).map(n=>`<circle data-request="${n.id}" data-motion-key="request-${compact?'m':'d'}-${n.id}" data-queued="${n.queued}" data-released="${n.released}" data-junction-x="${cx}" data-junction-y="180" data-resource-target="${n.resource}" data-from-x="${n.fromX}" data-from-y="${n.fromY}" data-duration="${n.duration}" class="cb-request ${n.queued?'cb-waiting':''}" r="${compact?3:3.5}" cx="${n.x}" cy="${n.y}" opacity="${n.active?1:0}"/>`).join('')}</g>
 <g class="cb-mechanisms" opacity="${p.technology?1:0}"><circle class="cb-distribution-mechanism" cx="${cx}" cy="95" r="20"/><path class="cb-observation-link" d="M${cx+22} 95 H${g.w-45} V240" opacity="${p.mapping>=3?1:0}"/><path class="cb-pool-boundary" d="M${compact?60:115} ${compact?398:330} H${g.w-(compact?60:115)}" opacity="${p.mapping>=2?1:0}"/></g>
 </svg>`;
}
export function EvidenceLabel(value,label,key,animate=false){return `<div class="cb-evidence"><strong ${animate?`data-count="${value}" data-count-key="cb-${key}"`:''}>${value.toLocaleString('en-US')}</strong><span>${label}</span></div>`;}
export function ArchitectureNode(component,selected){return `<button class="cb-architecture-node cb-node-${component.id} ${selected?'is-selected':''}" data-cloud-visual="component" data-value="${component.id}" aria-expanded="${selected}" aria-controls="cloud-component-detail">${component.icon?cloudIcons[component.icon]||'':''}<span><small>${component.role}</small><strong>${component.name}</strong></span></button>`;}
export function TechnologyMapping(p){return `<div class="cb-mapping" aria-label="Technology mapped onto the same system">${p.technology?cloudComponents.filter(c=>c.id==='balancing'||p.mapping>=2&&['compute','autoscaling'].includes(c.id)||p.mapping>=3&&c.id==='monitoring').map(c=>ArchitectureNode(c,p.component===c.id)).join(''):''}</div>`;}
