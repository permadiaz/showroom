import {createQuestionMotion} from './data-question-motion.js';
const questionMotion=createQuestionMotion();
import {createThreadMotion} from './workspace-thread-motion.js';
import {threadPrimary} from './workspace-thread-view.js';
const threadMotion=createThreadMotion();
import {initialMigration,migrationTransition,migrationPrimary,migrationEvents,migrationScenes} from './migration-model.js';
import {createMigrationMotion} from './migration-motion.js';
let migrationState=initialMigration();
const migrationMotion=createMigrationMotion();
import {initialCloudStage,stageTransition} from './cloud-stage-state.js';
import {createCloudMotion} from './cloud-stage-motion.js';
import {usesCloudBenchmark} from './cloud-story.js';
let cloudStage=initialCloudStage();
const cloudMotion=createCloudMotion();
import {initialCloud,transition as cloudTransition} from './cloud-model.js';
import {cloudShow,cloudLearn,cloudSales} from './cloud-view.js';
import {initialWorkspace,workspaceTransition} from './workspace-model.js';
import {workspaceShow,workspaceLearn,workspaceSales} from './workspace-view.js';
import {initialData,dataTransition} from './data-model.js';
import {dataShow,dataLearn,dataSales} from './data-view.js';
import {worlds,shows,problems,futureCapability,visibleContent,canRender} from './content.js';
import {modeDefinitions,resolveRoute,experienceHref} from './navigation.js';
import {createShowSession} from './show-session.js';
import {experienceStep,interactionEvents} from './experience-events.js';

const engines={
 'cloud-migration':{initial:initialCloud,reduce:cloudTransition,show:cloudShow,learn:cloudLearn,sell:cloudSales,guide:'A better conversation.',drawer:'cloud-drawer'},
 'workspace-workday':{initial:initialWorkspace,reduce:workspaceTransition,show:workspaceShow,learn:workspaceLearn,sell:workspaceSales,guide:'Follow the handoff.',drawer:'workspace-drawer'},
 'ask-your-data':{initial:initialData,reduce:dataTransition,show:dataShow,learn:dataLearn,sell:dataSales,guide:'Follow the question.',drawer:'data-drawer'}
};
const states=Object.fromEntries(Object.entries(engines).map(([id,engine])=>[id,engine.initial()]));
// Public module hook for future local consumers; no capture UI or network transport.
export const showSession=createShowSession();
const app=document.querySelector('#app');
let selected='run',mode='show',presenting=false,lastExperience=null,activeExperience=null,lastHash=null;
let escalationTimer=null,countFrame=null,lastViewKey=null;
const lastCounts=new Map(),scrollPositions=new Map();
const positions=[[50,13],[78,25],[85,51],[77,78],[50,87],[23,78],[15,51],[23,25]];
const route=()=>resolveRoute(location.hash).path;
const current=()=>resolveRoute(location.hash).experience;
const context=(id=current()?.slug,source='presenter')=>({mode,step:id==='cloud-migration'&&states[id].migration?'migration:'+migrationState.scene:id?experienceStep(id,states[id]):'opening',source});
function emit(type,payload={},source='presenter',id=current()?.slug){if(id)showSession.emit(type,id,payload,context(id,source));}
function cancelEscalation(){if(escalationTimer!==null)clearTimeout(escalationTimer);escalationTimer=null;}
function pauseCloud(){states['cloud-migration']=cloudTransition(states['cloud-migration'],'pause');cancelEscalation();}
function writeModeRoute(){const s=current();if(!s)return;const href=experienceHref(s.slug,mode,resolveRoute(location.hash).entry);if(globalThis.history?.replaceState){history.replaceState(null,'',href);lastHash=location.hash;}}
function clearEntry(){const s=current();if(s&&globalThis.history?.replaceState){history.replaceState(null,'',experienceHref(s.slug,mode));lastHash=location.hash;}}
function setMode(next,source='presenter'){
 if(presenting||!['learn','show','sell'].includes(next)||!current())return;
 if(next==='learn')pauseCloud();
 if(mode!==next){const previous=mode;mode=next;emit('mode_changed',{category:'mode',value:next,previous},source);}
 writeModeRoute();
}
function setPresentation(next,source='presenter'){
 if(!current()||next===presenting)return;
 if(next){setMode('show',source);presenting=true;emit('presentation_started',{value:true},source);}
 else {emit('presentation_completed',{value:false},source);presenting=false;mode='show';writeModeRoute();}
}
function actMigration(action,value,source='presenter'){
 const previous=migrationState;
 migrationState=migrationTransition(previous,action,value);
 if(previous===migrationState)return;
 if(action==='reset'){migrationMotion.reset();showSession.resetScope('cloud-migration','migration_rehearsal');for(const key of scrollPositions.keys())if(key.startsWith('cloud-migration:')&&migrationScenes.some(scene=>key.endsWith(':'+scene)))scrollPositions.delete(key);lastViewKey=null;}
 const scene=migrationState.scene;
 const stage={opening:0,discover:0,assess:1,design:2,replicate:3,test:4,rehearsal:4,cutover:5,verify:5,optimize:6,final:6}[scene];
 states['cloud-migration']={...states['cloud-migration'],stage,workload:migrationState.workload,tested:migrationState.tested===5,migrated:migrationState.switched};
 for(const e of migrationEvents(previous,migrationState))showSession.emit(e.type,'cloud-migration',e.payload,{...context('cloud-migration',source),scope:'migration_rehearsal'});
}
function act(action,value,source='presenter'){
 const id=current()?.slug;if(!id)return;
 const previous=states[id];
 if(id==='workspace-workday'&&action==='next'&&previous.scene==='friction')action='resume-thread';
 if(id==='workspace-workday'&&source==='keyboard'&&action==='next'&&previous.scene==='opening')action=threadPrimary(previous)[0];
 if(id==='cloud-migration'&&previous.migration&&['next','prev','cutover','restart-migration','workload'].includes(action)){
  const primary=migrationPrimary(migrationState);
  const mapped=action==='next'?(primary?.action==='cutover'?'next':primary?.action||'next'):({prev:'previous',cutover:'cutover','restart-migration':'reset',workload:'workload'}[action]);
  actMigration(mapped,value,source);return;
 }
 if(id==='cloud-migration'&&usesCloudBenchmark(previous)&&previous.moment==='capabilities'){
  if(action==='next'&&cloudStage.mapping<3){cloudStage=stageTransition(cloudStage,'mapping',null,previous);return;}
  if(action==='prev'&&cloudStage.mapping>1){cloudStage=stageTransition(cloudStage,'mapping-back',null,previous);return;}
 }
 if(id==='cloud-migration'&&usesCloudBenchmark(previous)&&previous.moment==='compare'){
  if(action==='next'&&cloudStage.capacityAdded<4){cloudStage=stageTransition(cloudStage,'capacity',null,previous);return;}
  if(action==='next'&&cloudStage.capacityAdded===4&&!cloudStage.balance){cloudStage=stageTransition(cloudStage,'balance',null,previous);return;}
  if(action==='prev'&&cloudStage.capacityAdded>0){cloudStage=stageTransition(cloudStage,'capacity-back',null,previous);return;}
 }
 states[id]=engines[id].reduce(previous,action,value);
 if(id==='cloud-migration'){
  if(['reset','environment'].includes(action)){migrationState=initialMigration();migrationMotion.reset();}
  if(!previous.migration&&states[id].migration){states[id]={...states[id],workload:migrationState.workload};}
  if(['reset','environment','scenario','clear'].includes(action)){cloudStage=initialCloudStage();cloudMotion.reset();}
  else if(previous.moment!==states[id].moment){cloudStage={...cloudStage,component:null,mapping:1,motionPaused:false};if(states[id].moment==='compare')cloudStage.capacityAdded=0;}
 }
 if(action==='reset'){
  showSession.reset(id);
  if(id==='workspace-workday')threadMotion.reset();
  if(id==='ask-your-data')questionMotion.reset();
  clearEntry();
  for(const key of scrollPositions.keys())if(key.startsWith(id+':'))scrollPositions.delete(key);
  lastViewKey=null;
  if(id==='cloud-migration'){cancelEscalation();lastCounts.clear();}
  if(mode!=='learn')showSession.start(id,context(id,source));
 }else{
  for(const event of interactionEvents(id,previous,states[id],action))emit(event.type,event.payload,source,id);
  if(id==='cloud-migration'&&['scenario','retest','resume','environment','migrate'].includes(action))cancelEscalation();
 }
 // A problem-entry route still lets the presenter choose the starting environment.
 if(id==='cloud-migration'&&action==='environment'&&resolveRoute(location.hash).entry==='migration'&&states[id].environment){
  const before=states[id];states[id]=cloudTransition(before,'migrate');
  for(const event of interactionEvents(id,before,states[id],'migrate'))emit(event.type,event.payload,source,id);clearEntry();
 }
}
function syncRoute(){
 if(location.hash===lastHash)return;
 const resolved=resolveRoute(location.hash),id=resolved.experience?.slug;
 if(presenting){emit('presentation_completed',{value:false},'navigation',activeExperience);presenting=false;}
 if(activeExperience!==id||resolved.mode==='learn')pauseCloud();
 const previous=mode;mode=resolved.mode;activeExperience=id||null;lastHash=location.hash;
 if(id){
  lastExperience=id;selected=resolved.experience.world;
  if(previous!==mode)emit('mode_changed',{category:'mode',value:mode,previous},'navigation');
  if(resolved.entry==='migration'&&states[id].environment)act('migrate',undefined,'problem_entry');
 }
 render();window.scrollTo(0,0);
 document.querySelector('#main')?.focus?.({preventScroll:true});
}
function modebar(s){return `<div class="modebar">${presenting?`<span class="eyebrow">${s.name.toUpperCase()}</span>`:`<a class="back" href="#/explore">← The universe</a><div class="modes" aria-label="Experience mode">${modeDefinitions.map(m=>`<button data-mode="${m.id}" class="${mode===m.id?'active':''}" aria-pressed="${mode===m.id}" title="${m.purpose}">${m.label}</button>`).join('')}</div>`}<div class="mode-actions"><button class="secondary" data-action="restart" aria-label="Restart ${s.name}">Restart ↺</button><button class="secondary" data-action="present" aria-pressed="${presenting}">${presenting?'Exit presentation · Esc':'Present ↗ · P'}</button></div></div>${!presenting&&mode==='sell'?'<div class="internal-mode-label">SELL · INTERNAL AE GUIDANCE</div>':''}`;}
function show(s){
 const engine=engines[s.slug],state=states[s.slug];
 if(mode!=='learn')showSession.start(s.slug,context(s.slug));
 const cloudTitle=s.slug==='cloud-migration'?`<div class="cloud-title"><div class="eyebrow">CLOUD & MIGRATION</div><h1>${state.environment&&mode!=='learn'?'When demand changes, what happens next?':'What happens when your business<br class="desktop-break"> moves to the cloud?'}</h1></div>`:'';
 const hiddenTitle=s.slug!=='ask-your-data'&&!cloudTitle&&mode!=='learn'&&state.scene!=='opening'?`<h1 class="sr-only">${s.name}</h1>`:'';
 const entry=resolveRoute(location.hash).entry==='migration'&&!state.environment&&mode!=='learn'?'<p class="entry-hint">Migration Rehearsal · Choose your current environment to begin the rehearsal.</p>':'';
 const internal=mode==='sell'&&canRender('INTERNAL',mode,presenting);
 return `${modebar(s)}${cloudTitle}${hiddenTitle}${entry}${mode==='learn'?engine.learn(state):engine.show(state,s.slug==='cloud-migration'?cloudStage:undefined,s.slug==='cloud-migration'?migrationState:undefined)}${internal?`<aside class="drawer ${engine.drawer}" aria-label="Internal AE guidance"><div class="guide-heading"><button class="secondary close" data-action="close">Close guide ×</button><div class="eyebrow">INTERNAL / AE GUIDE</div><h2>${engine.guide}</h2></div>${engine.sell(state,s.slug==='cloud-migration'?migrationState:undefined)}</aside>`:''}`;
}
function resumeLink(){const s=shows.find(x=>x.slug===lastExperience);return s?`<a class="resume-experience" href="${experienceHref(s.slug)}">Return to ${s.name} →</a>`:'';}
function header(){return `<header><a class="brand" href="#/">datalabs<i>.</i><small>SHOWROOM</small></a><nav aria-label="Main navigation"><a class="${route()==='/'||route()==='/explore'?'active':''}" href="#/explore">The universe</a><a class="${route()==='/magic'?'active':''}" href="#/magic">Experiences</a><a class="${route()==='/problems'?'active':''}" href="#/problems">Find a problem</a></nav><span class="top-label"><i class="dot"></i>THE INTERACTIVE STAGE</span></header>`;}
function cards(){return `<div class="experiences">${visibleContent(shows,'explore').map(s=>`<a class="experience" href="${experienceHref(s.slug)}"><div class="card-top"><b>${s.icon}</b><span>EXPERIENCE / ${s.number}</span></div>${cardPreview(s)}<h3>${s.name}</h3><p>${s.description}</p><div class="card-footer"><span class="tag">${s.kind}</span><span>Explore story ↗</span></div></a>`).join('')}</div>`;}
function custom(){return `<aside class="custom" aria-label="Custom Magic Show coming soon"><span class="sigil">✳</span><div><strong>${futureCapability.title}</strong><p>${futureCapability.description}</p></div><span class="tag">COMING SOON</span></aside>`;}
function universe(){const w=worlds.find(w=>w.id===selected);const s=shows.find(s=>s.slug===w.show&&canRender(s.visibility,'explore'));return `<section class="universe" aria-label="Solution Universe"><div class="map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle cx="50" cy="50" r="35"/><circle cx="50" cy="50" r="22"/>${positions.map(([x,y])=>`<line x1="50" y1="50" x2="${x}" y2="${y}"/>`).join('')}</svg><div class="core"><b>✳</b>SHOWROOM</div>${worlds.map((w,i)=>`<button data-world="${w.id}" class="node ${w.id===selected?'selected':''}" style="left:${positions[i][0]}%;top:${positions[i][1]}%" aria-pressed="${w.id===selected}" aria-controls="world-detail" title="${w.label}"><span class="symbol">${w.symbol}</span><strong>${w.name}</strong></button>`).join('')}<span class="map-caption">EIGHT WORLDS. ONE CONNECTED BUSINESS.</span></div><div id="world-detail" class="world-detail" aria-live="polite"><span class="symbol">${w.symbol}</span><span class="tag">${s?(s.status==='live'?'AVAILABLE EXPERIENCE':'EXPERIENCE PREVIEW'):'COMING SOON'}</span><h2>${w.label}</h2><p>${w.description}</p>${s?`<a class="link-arrow" href="${experienceHref(s.slug)}">Available experience: ${s.name} ↗</a>`:''}</div></section>`;}
function home(){return `<section class="intro"><div><div class="eyebrow">DATALABS SHOWROOM / EXPLORE</div><h1>Complex ideas.<br><em>Made tangible.</em></h1></div><p>Explore a business challenge. See what changes. Understand the technology behind it.</p></section>${universe()}<div class="section-head"><div><h2>Experience the transformation.</h2><p class="section-support">Choose a scenario. Change the conditions. See what happens.</p></div><span>LEARN → SHOW → SELL</span></div>${cards()}${custom()}`;}
function render(){
 questionMotion.capture(app);
 threadMotion.capture(app);
 cloudMotion.capture(app);
 migrationMotion.capture(app);
 const s=current(),id=s?.slug,state=id?states[id]:null;
 const oldScroller=document.querySelector('.ws-scene-body, .dq-scene, .cb-stage-body, .mr-scene-body');
 if(lastViewKey&&oldScroller)scrollPositions.set(lastViewKey,oldScroller.scrollTop||0);
 const nextViewKey=id?`${id}:${mode==='learn'?'learn':'story'}:${[state.scene,state.before,state.file,state.evidence,state.followup,state.depth,state.moment,id==='cloud-migration'&&state.migration?migrationState.scene:''].join(':')}`:null;
 const focusSnapshot=document.activeElement?.dataset?{...document.activeElement.dataset}:null;
 document.body.classList.toggle('presentation',presenting);
 document.body.classList.toggle('sell-active',mode==='sell'&&!presenting);
 document.body.classList.toggle('cloud-active',id==='cloud-migration'&&!!state.environment&&mode!=='learn');
 document.body.classList.toggle('migration-active',id==='cloud-migration'&&state.migration&&mode!=='learn');
 document.body.classList.toggle('workspace-active',id==='workspace-workday');
 document.body.classList.toggle('data-active',id==='ask-your-data');
 document.body.classList.toggle('cloud-benchmark-active',id==='cloud-migration'&&mode!=='learn'&&usesCloudBenchmark(state));
 let content;
 if(s)content=show(s);
 else if(route()==='/'||route()==='/explore')content=resumeLink()+home();
 else if(route()==='/magic')content=`${resumeLink()}<div class="eyebrow">THE EXPERIENCE LIBRARY</div><h1>See what's possible.</h1><p class="note">Three universal experiences. Built to make the business conversation tangible.</p><div class="section-head"><h2>Experience the transformation.</h2><span>THREE INTERACTIVE EXPERIENCES</span></div>${cards()}${custom()}`;
 else if(route()==='/problems')content=`${resumeLink()}<div class="eyebrow">START WITH THE BUSINESS</div><h1>Sound familiar?</h1><p class="note">Choose a problem to explore its story.</p>${visibleContent(problems,'explore').map(p=>{const target=shows.find(s=>s.slug===p.experience);return `<a class="problem" href="${experienceHref(p.experience,'show',p.entry)}"><span>${p.label}<small>${target.name}${p.destination?' / '+p.destination:''}</small></span><span aria-hidden="true">↗</span></a>`;}).join('')}`;
 else if(route()==='/industries')content='<section class="empty"><div class="eyebrow">COMING SOON</div><h1>Industry Explorer</h1><p>Customer-specific stories will be part of a future phase.</p><a href="#/explore">← Return to the universe</a></section>';
 else content='<section class="empty"><h1>Story not found.</h1><a href="#/explore">← Return to the universe</a></section>';
 app.innerHTML=`${presenting?'':header()}<main id="main" tabindex="-1">${content}</main>${presenting?'':'<footer><span>DATALABS SHOWROOM</span><span>Explore a challenge. Experience the transformation.</span></footer>'}`;
 questionMotion.restore(app);
 questionMotion.sync(id==='ask-your-data'&&mode!=='learn'&&!document.hidden,state?.scene,()=>{act('connection-complete',undefined,'simulation');render();});
 threadMotion.restore(app);
 cloudMotion.restore(app);
 migrationMotion.restore(app);
 const scroller=document.querySelector('.ws-scene-body, .dq-scene, .cb-stage-body, .mr-scene-body');if(scroller)scroller.scrollTop=scrollPositions.get(nextViewKey)||0;
 lastViewKey=nextViewKey;
 syncEscalation();animateCounts();
 const paused=!!document.hidden||(id==='cloud-migration'&&state.migration);
 document.body.classList.toggle('motion-paused',paused);
 for(const svg of app.querySelectorAll('svg'))if(paused)svg.pauseAnimations?.();
 if(focusSnapshot&&Object.keys(focusSnapshot).length){
  const target=[...app.querySelectorAll('button, select, textarea')].find(n=>!n.disabled&&Object.entries(focusSnapshot).every(([key,value])=>n.dataset[key]===value));
  if(target)target.focus?.({preventScroll:true});
  else document.querySelector('#main')?.focus?.({preventScroll:true});
 }
}
function renderAction(action,value,source='pointer'){
 const old=experienceStep(current().slug,states[current().slug]);act(action,value,source);render();
 if(action==='contribute')document.querySelector('.wt-document-section:last-child')?.scrollIntoView?.({block:'nearest'});
 else if(action==='thread-open')document.querySelector('.wt-thread')?.scrollIntoView?.({block:'nearest'});
 else if(action==='migrate'||action==='restart-migration')document.querySelector('#migration-rehearsal')?.scrollIntoView?.({block:'start'});
 else if(action==='close-migration')document.querySelector('.business-stage')?.scrollIntoView?.({block:'start'});
 else if(action==='reset')document.querySelector('.modebar')?.scrollIntoView?.({block:'start'});
 else if(current()?.slug==='cloud-migration'&&old!==experienceStep(current().slug,states[current().slug])&&states['cloud-migration'].migration)document.querySelector('#migration-rehearsal')?.scrollIntoView?.({block:'start'});
}
app.addEventListener('click',e=>{
 const t=e.target.closest('button');if(!t||t.disabled)return;
 const s=current();
 if(t.dataset.world){updateWorld(t.dataset.world);return;}
 if(t.dataset.mode){setMode(t.dataset.mode);render();if(mode==='sell')document.querySelector('.drawer .close')?.focus?.({preventScroll:true});return;}
 if(!s)return;
 if(s.slug==='cloud-migration'&&states[s.slug].migration&&t.dataset.migration){actMigration(t.dataset.migration,t.dataset.value,'pointer');render();return;}
 if(s.slug==='cloud-migration'&&t.dataset.cloudVisual&&usesCloudBenchmark(states[s.slug])){cloudStage=stageTransition(cloudStage,t.dataset.cloudVisual,t.dataset.value,states[s.slug]);render();return;}
 const action=s.slug==='cloud-migration'?t.dataset.cloud:s.slug==='workspace-workday'?t.dataset.ws:t.dataset.dq;
 if(action){renderAction(action,t.dataset.value);return;}
 if(t.dataset.action==='present')setPresentation(!presenting);
 else if(t.dataset.action==='close')setMode('show');
 else if(t.dataset.action==='restart'){renderAction('reset');return;}
 else return;
 render();
});
app.addEventListener('change',e=>{if(current()?.slug==='cloud-migration'&&states['cloud-migration'].migration&&e.target.dataset.migrationSelect){actMigration(e.target.dataset.migrationSelect,e.target.value,'pointer');render();return;}if(current()?.slug==='cloud-migration'&&e.target.dataset.cloudSelect)renderAction(e.target.dataset.cloudSelect,e.target.value);});
window.addEventListener('hashchange',syncRoute);
window.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||!current())return;
 const k=e.key.toLowerCase();
 // Escape always exits presentation, even from an editable control.
 if(k==='escape'&&(presenting||mode==='sell')){if(presenting)setPresentation(false,'keyboard');else setMode('show','keyboard');}
 else if(k==='escape'&&current()?.slug==='ask-your-data'&&states['ask-your-data'].technicalOpen){act('close-technology');}
 else if(e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 else if(k==='p')setPresentation(!presenting,'keyboard');
 else if(k==='s'&&!presenting)setMode(mode==='sell'?'show':'sell','keyboard');
 else if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&mode!=='learn'){e.preventDefault();renderAction(e.key==='ArrowRight'?'next':'prev',undefined,'keyboard');return;}
 else return;
 e.preventDefault();render();
});
function cardPreview(s){return `<div class="card-preview preview-${s.world}" aria-hidden="true"><span></span><span></span><span></span><span></span><b></b></div>`;}
function updateWorld(id){
 if(selected===id||!worlds.some(w=>w.id===id))return;
 selected=id;const holder=document.createElement('div');holder.innerHTML=universe();
 document.querySelector('.world-detail')?.replaceWith(holder.querySelector('.world-detail'));
 document.querySelectorAll('[data-world]').forEach(b=>{b.classList.toggle('selected',b.dataset.world===id);b.setAttribute('aria-pressed',String(b.dataset.world===id));});
}
app.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const w=e.target.closest('[data-world]');if(w)updateWorld(w.dataset.world);});
app.addEventListener('focusin',e=>{const w=e.target.closest('[data-world]');if(w)updateWorld(w.dataset.world);});
function syncEscalation(){
 const cloud=states['cloud-migration'];
 if(!cloud.running||cloud.migration||current()?.slug!=='cloud-migration'||mode==='learn'||document.hidden){cancelEscalation();return;}
 if(escalationTimer!==null)return;
 escalationTimer=setTimeout(()=>{escalationTimer=null;act('tick',undefined,'simulation');render();},1800);
}
function animateCounts(){
 if(countFrame!==null){cancelAnimationFrame(countFrame);countFrame=null;}
 if(typeof requestAnimationFrame!=='function'||document.hidden||current()?.slug!=='cloud-migration'||mode==='learn')return;
 const nodes=[...app.querySelectorAll('[data-count]')],meters=[...app.querySelectorAll('[data-meter]')];
 if(!nodes.length&&!meters.length)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const entries=nodes.map(node=>({node,key:node.dataset.countKey,target:Number(node.dataset.count),from:lastCounts.get(node.dataset.countKey)??Number(node.dataset.count)}));
 const bars=meters.map(node=>({node,key:node.dataset.meterKey,target:Number(node.dataset.meter),from:lastCounts.get(node.dataset.meterKey)??Number(node.dataset.meter)}));
 const start=performance.now();
 function frame(now){const t=reduced?1:Math.min(1,(now-start)/650),eased=1-(1-t)**3;
  for(const {node,key,from,target} of entries){const value=from+(target-from)*eased;node.textContent=Math.round(value).toLocaleString('en-US')+(node.dataset.suffix||'');lastCounts.set(key,value);}
  for(const {node,key,from,target} of bars){const value=from+(target-from)*eased;node.style.width=value+'%';lastCounts.set(key,value);}
  countFrame=t<1?requestAnimationFrame(frame):null;
 }
 if(reduced||[...entries,...bars].every(e=>e.from===e.target))frame(start+650);else countFrame=requestAnimationFrame(frame);
}
if(document.addEventListener){
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseCloud();render();});
 document.addEventListener('click',e=>{if(e.target.closest?.('.skip')){e.preventDefault();document.querySelector('#main')?.focus?.();}});
}
syncRoute();
