import {businessQuestion,sourceFragments,answerability,benchmark,technologySteps} from './data-question-content.js';
import {dataScenes,primaryActions} from './data-question-state.js';
const button=(action,label,extra='')=>`<button data-dq="${action}" ${extra}>${label}</button>`;
function world(s){return `<div class="qs-world" data-world-phase="${s.scene}" role="img" aria-label="${s.scene==='FRAGMENTED'?'Four separate systems each hold part of the answer':s.scene==='CONNECTING'?'Four systems connecting into one business view':'Four systems connected into one business view'}">
 <svg class="qs-paths" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">${[100,300,500,700].map(x=>`<path class="qs-question-path" pathLength="1" d="M400 0 Q400 30 ${x} 45"/><path class="qs-join" pathLength="1" d="M${x} 95 C${x} 160 400 110 400 190"/>`).join('')}<path class="qs-trunk" pathLength="1" d="M400 190 V220"/><circle class="qs-query-token" cx="400" cy="0" r="5"/></svg>
 <div class="qs-sources">${sourceFragments.map((x,i)=>`<div class="qs-source" data-source-key="${x.id}" style="--source-index:${i}"><span class="qs-source-dot"></span><strong>${x.id}</strong><span class="qs-fragment">${x.fragment}</span></div>`).join('')}</div>
 <div class="qs-context"><span class="qs-context-point"></span><strong>ONE BUSINESS VIEW</strong></div>
 </div>`;}
function content(s){switch(s.scene){
 case 'QUESTION':return '<div class="qs-question-space" aria-hidden="true"><span></span></div>';
 case 'FRAGMENTED':return world(s)+'<h2 class="qs-statement qs-scattered">THE QUESTION IS SIMPLE.<br>THE ANSWER IS SCATTERED.</h2>';
 case 'CONNECTING':case 'CONNECTED':return world(s);
 case 'ANSWER':return '<div class="qs-answer-transfer" aria-hidden="true">'+world(s)+'</div><div class="qs-answer"><strong>−8.4%</strong><span>SALES LAST MONTH</span><h2>MOST OF THE DECLINE<br>CAME FROM 3 BRANCHES.</h2></div>';
 case 'EVIDENCE':return `<div class="qs-proof"><div class="qs-metrics">${benchmark.evidence.map(x=>`<div><span>${x.label}</span><strong>${x.value}</strong></div>`).join('')}</div><h2>TRAFFIC WASN’T THE MAIN PROBLEM.<br>CONVERSION MAY BE WORTH INVESTIGATING.</h2><div class="qs-curiosity"><span>SO WHAT WOULD YOU ASK NEXT?</span><p>WHICH CUSTOMER SEGMENTS DROVE THE DECLINE?</p></div></div>`;
 case 'DISCOVERY':return `<div class="qs-discovery"><h2>IF YOU ASKED THIS TODAY,<br>HOW WOULD YOUR TEAM FIND THE ANSWER?</h2><div class="qs-choices">${answerability.map(x=>button('answerability',x.label,`data-value="${x.value}" aria-pressed="${s.answerability===x.value}"`)).join('')}</div><span class="qs-selection" role="status">${s.answerability?'RESPONSE NOTED.':''}</span></div>`;
 default:return '';
}}
function technology(){return `<div class="qs-technology" role="region" aria-label="Illustrative architecture"><div><span>ILLUSTRATIVE ARCHITECTURE</span><h2>POSSIBLE COMPONENTS</h2></div><ol>${technologySteps.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;}
export function dataQuestionShow(s){const primary=primaryActions[s.scene];return `<section class="qs-stage qs-${s.scene.toLowerCase()}${s.technicalOpen?' qs-technical-open':''}" aria-label="Ask Your Data story" data-scene="${s.scene}">
 <div class="qs-meta"><span>ASK YOUR DATA</span><span>${s.scene==='QUESTION'?'':'SIMULATION / EXAMPLE DATA'}</span></div>
 <div class="qs-question" data-persistent-question="sales"><h1>${businessQuestion.replace(' LAST MONTH?','<br>LAST MONTH?')}</h1></div>
 <div class="qs-body" aria-live="polite">${s.technicalOpen?technology():content(s)}</div>
 <div class="qs-controls">${s.scene!=='QUESTION'?button(s.technicalOpen?'close-technology':'prev',s.technicalOpen?'← BACK TO STORY':'← PREVIOUS','class="qs-secondary"'):''}<span class="qs-progress" aria-label="Story progress">${dataScenes.indexOf(s.scene)+1} / ${dataScenes.length}</span>${s.technicalOpen?'':primary?button(primary[0],primary[1],'class="qs-primary"'):s.scene==='CONNECTING'?'<span role="status">CONNECTING…</span>':''}${!s.technicalOpen&&['EVIDENCE','DISCOVERY'].includes(s.scene)?button('technology','HOW DOES THIS WORK?','class="qs-secondary qs-tech-link"'):''}</div>
 </section>`;}
