import {workloads} from './cloud-model.js';
import {initialMigration,migrationPrimary,migrationProjection,migrationScenes} from './migration-model.js';
import {migrationCopy,migrationDependencies,migrationConstraints,migrationGuides} from './migration-content.js';
import {cloudIcons} from './cloud-icons.js';
const action=(a,label,extra='')=>`<button data-migration="${a}" ${extra}>${label}</button>`;
const point=(x,y)=>`${x},${y}`;
export function migrationLayout(mobile=false){return mobile?{w:420,h:650,openingH:305,sx:210,sy:110,tx:210,ty:435,users:[210,25],deps:[[-135,55],[135,55],[-135,130],[135,130]],db:90,prodSource:[[210,25],[210,110]],prodTarget:[[210,25],[35,25],[35,435],[210,435]],copy:[[210,200],[378,200],[378,525],[210,525]],test:[[335,355],[335,400],[210,435]]}:{w:1100,h:540,openingH:540,sx:250,sy:180,tx:850,ty:180,users:[250,35],deps:[[-150,50],[150,50],[-150,195],[150,195]],db:120,prodSource:[[250,35],[250,180]],prodTarget:[[250,35],[250,65],[850,65],[850,180]],copy:[[250,300],[850,300]],test:[[1040,85],[1040,140],[850,180]]};}
export function migrationPoint(points,t){let lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let left=t*lengths.reduce((a,b)=>a+b,0);for(let i=0;i<lengths.length;i++){if(left<=lengths[i]||i===lengths.length-1){const f=left/lengths[i];return [points[i][0]+(points[i+1][0]-points[i][0])*f,points[i][1]+(points[i+1][1]-points[i][1])*f];}left-=lengths[i];}return points[0];}
const dPath=points=>points.map((p,i)=>(i?'L':'M')+point(...p)).join(' ');
function icon(name,x,y){return `<g transform="translate(${x},${y})">${cloudIcons[name].replace('<svg ', '<svg width="24" height="24" ')}</g>`;}
function node(x,y,label,sub,active,key,shape='app'){return `<g data-mr-key="${key}" data-mr-opacity opacity="${active}" class="mr-node"><circle cx="${x}" cy="${y}" r="${shape==='app'?23:18}"/><circle class="mr-core" cx="${x}" cy="${y}" r="4"/><text x="${x}" y="${y+39}" text-anchor="middle">${label}</text><text class="mr-node-sub" x="${x}" y="${y+53}" text-anchor="middle">${sub}</text></g>`;}
function dependencyGraph(s,g,target=false){
 const x=target?g.tx:g.sx,y=target?g.ty:g.sy;
 const shown=target?s.designed>=3:s.discovered;
 return migrationDependencies.map(([name],i)=>{const [dx,dy]=g.deps[i],opacity=target?(shown?(s.tested>=4?1:.45):0):(i<shown?1:.16),verified=target&&(s.scene==='verify'||s.switched)?s.verified>=3:s.tested>=4;
 return `<g data-mr-key="${target?'target':'source'}-dependency-${i}" data-mr-opacity opacity="${opacity}"><path class="mr-relationship ${target&&verified?'is-verified':''}" d="M${x} ${y+(i===2?g.db:0)} L${x+dx} ${y+dy}"/><circle cx="${x+dx}" cy="${y+dy}" r="5"/><text x="${x+dx}" y="${y+dy+18}" text-anchor="middle">${name}</text>${target?`<text class="mr-edge-state" x="${x+dx}" y="${y+dy+30}" text-anchor="middle">${verified?'reachable / demo':'not verified'}</text>`:''}</g>`;
 }).join('');
}
function workload(s,g,target=false){
 const x=target?g.tx:g.sx,y=target?g.ty:g.sy,p=migrationProjection(s),stage=migrationScenes.indexOf(s.scene);
 const available=target?s.designed>0:true,testing=stage>=5,post=s.switched;
 const appOkay=target?(post?s.verified>=1:s.tested>=1):true,dataOkay=target?(post?s.verified>=2:s.tested>=3):true;
 return `<g class="mr-environment ${target?'mr-target':'mr-source'}" data-mr-key="${target?'target':'source'}-environment" data-mr-opacity opacity="${target?(p.target?1:0):post?.5:1}" aria-hidden="${target&&!p.target}">
 <text class="mr-environment-label" x="${x}" y="${y-73}" text-anchor="middle">${target?'GOOGLE CLOUD TARGET':'CURRENT ENVIRONMENT'}</text>
 <text class="mr-workload-label" x="${x}" y="${y-51}" text-anchor="middle">${s.workload.endsWith('WORKLOAD')?s.workload:s.workload+' WORKLOAD'}</text>
 <path class="mr-relationship ${dataOkay?'is-verified':''}" d="M${x} ${y+24} V${y+g.db-19}" opacity="${target?(s.designed>=2?1:0):1}" data-mr-key="${target?'target':'source'}-data-edge" data-mr-opacity/>
 ${dependencyGraph(s,g,target)}
 ${node(x,y,target&&s.designed?'COMPUTE / APPLICATION':'APPLICATION',target?(appOkay?'responding / demo':testing?'not verified':available?'Compute Engine · possible VM layer':'not yet designed'):'active',(target?(available?(appOkay?1:.45):0):1),(target?'target':'source')+'-app')}
 ${node(x,y+g.db,'DATABASE',target?(dataOkay?'available / demo':s.copied?'illustrative state staged':'compatibility to assess'):'active',target?(s.designed>=2?(dataOkay?1:.45):0):1,(target?'target':'source')+'-data','data')}
 ${target&&s.designed?icon('compute-engine.svg',x-13,y-13):''}
 ${target&&s.designed>=3?`<g class="mr-network-label">${icon('networking.svg',x+g.deps[1][0]/2-12,y+g.deps[1][1]/2-12)}<text x="${x+g.deps[1][0]/2}" y="${y+g.deps[1][1]/2-18}" text-anchor="middle">VPC / CONNECTIVITY</text></g>`:''}
 ${target&&s.designed>=4?`<g class="mr-monitor-label"><path class="mr-observe ${s.switched?s.verified>=5?'is-verified':'':s.tested>=5?'is-verified':''}" d="M${x+30} ${y} h${g.w===420?65:90} v-38"/>${icon('observability.svg',x+(g.w===420?83:108),y-57)}<text x="${x+(g.w===420?85:110)}" y="${y-66}" text-anchor="middle">MONITORING</text></g>`:''}
 </g>`;
}
export function migrationDiagram(s,mobile=false){
 const g=migrationLayout(mobile),p=migrationProjection(s),stage=migrationScenes.indexOf(s.scene),kind=mobile?'mobile':'desktop';
 const production=p.production==='target'?g.prodTarget:g.prodSource;
 const showCopy=stage>=4,showTest=stage>=5;
 return `<svg class="mr-system mr-${kind}" data-mr-system="${kind}" viewBox="0 0 ${mobile?420:p.target?1100:600} ${mobile&&!p.target?(s.scene==='assess'?345:g.openingH):g.h}" role="img" aria-label="${s.workload}. Production traffic reaches ${p.production}. ${p.target?'Target architecture visible.':''} ${s.tested===5?'Isolated target tests demonstrated.':''}">
 <g class="mr-users"><text x="${g.users[0]}" y="${g.users[1]-12}" text-anchor="middle">USERS / PRODUCTION TRAFFIC</text><circle cx="${g.users[0]}" cy="${g.users[1]}" r="5"/></g>
 <path class="mr-production-route" d="${dPath(g.prodSource)}" opacity="${s.switched?.2:1}"/>
 <path class="mr-production-route mr-active-target" d="${dPath(g.prodTarget)}" opacity="${s.switched?1:0}" data-mr-key="target-production-route" data-mr-opacity/>
 <g opacity="${p.target?1:0}" data-mr-key="migration-path" data-mr-opacity><path class="mr-prepared-path" d="${dPath(g.copy)}"/><text class="mr-path-label" x="${mobile?290:550}" y="${mobile?305:325}" text-anchor="middle">${stage>=6?'CUTOVER PATH / READY':showCopy?'REPLICATION / NO USER TRAFFIC':'TRANSITION PATH / PREPARING'}</text></g>
 <path class="mr-copy-path" d="${dPath(g.copy)}" opacity="${showCopy?.75:0}"/>
 <g class="mr-test-path" opacity="${showTest?1:0}" data-mr-key="test-path" data-mr-opacity><path d="${dPath(g.test)}"/><text x="${g.test[0][0]}" y="${g.test[0][1]-10}" text-anchor="middle">TEST ONLY</text></g>
 ${workload(s,g,false)}${workload(s,g,true)}
 <g class="mr-production-pulses">${Array.from({length:12},(_,i)=>{const [x,y]=migrationPoint(production,.12+i*.078);return `<circle class="mr-pulse" data-mr-key="production-${i}" data-mr-moving data-mr-duration="${s.switched?1800:1000}" cx="${x}" cy="${y}" r="3" opacity="1"/>`;}).join('')}</g>
 <g class="mr-copy-pulses">${Array.from({length:8},(_,i)=>{const t=Math.min(.97,.04+i*.045+s.copied*.19),[x,y]=migrationPoint(g.copy,t);return `<circle class="mr-copy-pulse" data-mr-key="copy-${i}" data-mr-moving data-mr-duration="1500" cx="${x}" cy="${y}" r="3.5" opacity="${showCopy&&s.copied?1:0}"/>`;}).join('')}</g>
 <g class="mr-test-pulses">${Array.from({length:5},(_,i)=>{const [x,y]=migrationPoint(g.test,.15+i*.14);return `<circle class="mr-test-pulse" data-mr-key="test-${i}" data-mr-moving cx="${x}" cy="${y}" r="2.6" opacity="${showTest&&s.tested?1:0}"/>`;}).join('')}</g>
 ${s.scene==='assess'?migrationConstraints.slice(0,s.assessed).map(([label],i)=>{if(mobile&&i!==s.assessed-1)return '';const positions=mobile?[[210,282],[210,282],[210,282],[210,282],[210,282]]:[[250,153],[420,316],[435,425],[160,445],[405,445]];return `<text class="mr-assessment-signal" x="${positions[i][0]}" y="${positions[i][1]}" text-anchor="middle">? ${label}</text>`;}).join(''):''}
 <text class="mr-operating-state" x="${g.sx}" y="${mobile?(s.scene==='assess'?320:280):470}" text-anchor="middle">${s.switched?'SOURCE RETAINED / PLAN DEPENDENT':'SOURCE / SERVING PRODUCTION'}</text>
 <text class="mr-operating-state" x="${g.tx}" y="${mobile?605:470}" text-anchor="middle" opacity="${p.target?1:0}">${s.switched?s.verified===5?'TARGET / VERIFIED IN REHEARSAL':'TARGET / VERIFICATION REQUIRED':s.tested===5?'TARGET / PREPARED & TESTED':showCopy?'TARGET / BEING PREPARED':'ILLUSTRATIVE TARGET ARCHITECTURE'}</text>
 </svg>`;
}
export function migrationShow(s=initialMigration(),environment='CURRENT'){
 const p=migrationProjection(s),copy=migrationCopy[s.scene],primary=migrationPrimary(s),canPrevious=s.history.length&&(!s.switched||s.history.at(-1).switched);
 return `<section id="migration-rehearsal" class="mr-stage mr-scene-${s.scene}" data-mr-frozen="${p.freeze}" data-mr-transfer="${s.switched}" aria-label="Migration Rehearsal"><div class="mr-topline"><span>DATALABS / MIGRATION REHEARSAL</span><span>SIMULATED CONTENT</span><span>${environment}</span></div><div class="mr-heading"><div class="eyebrow">${p.chapter} / ${p.freeze?'MOMENT HELD':'PRESENTER CONTROLLED'}</div><h2>${copy[1]}</h2>${copy[2]?`<p>${copy[2]}</p>`:''}</div>
 <div class="mr-scene-body"><div class="mr-canvas">${migrationDiagram(s)}${migrationDiagram(s,true)}</div><div class="mr-scene-caption" aria-live="polite">${caption(s)}</div></div>
 <div class="mr-controls">${action('previous','← Previous',canPrevious?'':`disabled title="${s.switched?'Restart rehearsal to return before cutover.':'Already at the beginning of the rehearsal.'}"`)}<div>${primary?action(primary.action,primary.label,'class="mr-primary"'):''}</div></div>
 <div class="mr-utility">${action(s.paused?'resume':'pause',s.paused?'Resume motion':'Pause motion',p.freeze&&!s.paused?'disabled title="This conversation moment is already held."':'')}<span>${s.workload} / ${p.production==='source'?'Serving business traffic at source':'Serving business traffic at target'}</span>${action('reset','Restart rehearsal ↺')}<button data-cloud="close-migration">Return to Cloud story ↑</button></div>
 <p class="mr-disclaimer">Illustrative rehearsal, not a live migration. Actual downtime and migration approach depend on workload, architecture and requirements. Rollback requires its own plan; it is not automatic or guaranteed.</p></section>`;
}
function caption(s){switch(s.scene){
 case 'opening':return `<label class="mr-workload-picker">ILLUSTRATIVE WORKLOAD<select data-migration-select="workload">${workloads.map(w=>`<option ${w===s.workload?'selected':''}>${w}</option>`).join('')}</select></label><span>BUSINESS ACTIVE · EXISTING DEPENDENCIES</span>`;
 case 'discover':return s.discovered?`<span>DEPENDENCY FOUND / ${migrationDependencies[s.discovered-1][1]}</span>`:'<span>Reveal the relationships around the running application.</span>';
 case 'assess':return s.assessed?`<span>TO ESTABLISH / ${migrationConstraints[s.assessed-1][1]}</span>`:'<span>Requirements are questions until confirmed with the workload owner.</span>';
 case 'design':return `<span>${['Start with the application requirement.','APPLICATION REQUIREMENT → POSSIBLE VM COMPUTE','DATA REQUIREMENT → COMPATIBLE DATA LAYER','DEPENDENCIES → CONNECTIVITY DESIGN','OPERATIONS → OBSERVABILITY'][s.designed]}</span><small>Illustrative target architecture. Workload support, sizing, security and database compatibility require assessment.</small>`;
 case 'replicate':return `<span>${['Source continues serving production.','ILLUSTRATIVE DATA STAGED','CONFIGURATION PREPARED','REQUIRED WORKLOAD STATE PREPARED'][s.copied]}</span><small>A staged copy is not a completed migration. Replication feasibility depends on the workload.</small>`;
 case 'test':return `<span>${['Target relationships are not verified yet.','APPLICATION START / DEMONSTRATED','CONNECTIVITY / DEMONSTRATED','DATA AVAILABILITY / DEMONSTRATED','DEPENDENCIES / DEMONSTRATED','OBSERVABILITY / DEMONSTRATED'][s.tested]}</span><small>Isolated illustrative tests. Source remains the production path.</small>`;
 case 'rehearsal':return `<div class="mr-rehearsal-questions"><p>${s.beat>=1?'Can the target run the workload?':''}</p><p>${s.beat>=2?'Can the business transition to it safely?':''}</p></div><small>CUTOVER PATH READY · ROLLBACK PATH CONSIDERED</small>`;
 case 'cutover':return `<span>${s.switched?'ACTIVE PATH CHANGED / VERIFY THE TARGET NEXT':'SOURCE AND TARGET COEXIST / TRANSITION PLANNED'}</span><small>Source retention and rollback feasibility depend on the agreed transition plan.</small>`;
 case 'verify':return `<span>${['Acceptance is still pending.','APPLICATION RESPONDING / DEMO','DATA AVAILABLE / DEMO','DEPENDENCIES REACHABLE / DEMO','TRAFFIC REACHING TARGET / DEMO','OBSERVABILITY ACTIVE / DEMO'][s.verified]}</span><small>These checks demonstrate the process; they are not evidence from a customer system.</small>`;
 case 'optimize':return s.optimized?'<span>CAPACITY · COST · PERFORMANCE · OPERATIONS · SECURITY · OBSERVABILITY</span><small>Choose improvements using actual measurements. No savings or performance outcome is assumed.</small>':'<span>Target verified in this rehearsal. Optimization is a subsequent decision.</span>';
 case 'final':return `<div class="mr-final-copy">${s.finalBeat?'<h3>Understanding the workload was.</h3><p>Discover dependencies. Prepare the target. Test the transition. Move with a plan.</p>':''}</div>${s.finalBeat?`<div class="mr-next-actions">${action('next-step','Migration assessment','data-value="assessment" aria-pressed="'+(s.nextStep==='assessment')+'"')}${action('next-step','Architecture workshop','data-value="workshop" aria-pressed="'+(s.nextStep==='workshop')+'"')}</div><small>${s.nextStep==='assessment'?'Discuss workload, dependencies, constraints and migration options.':s.nextStep==='workshop'?'Map the current environment and explore a target approach.':'Choose a useful next conversation, if appropriate.'} No meeting is booked by this selection.</small>`:''}`;
 default:return '';
}}
export function migrationSales(s){const [ask,listen,probe]=migrationGuides[s.scene];return `<h3>ASK</h3><p>${ask}</p><h3>LISTEN FOR</h3><p>${listen}</p><h3>PROBE</h3><p>${probe}</p><h3>CONCERN</h3><p>A rehearsal illustrates the process. It cannot establish downtime, supportability, cost or rollback feasibility for an unassessed workload.</p><h3>NEXT MOVE</h3><p>Agree which uncertainty to resolve with the workload owner and presales. Consider migration assessment or an architecture workshop.</p>`;}
