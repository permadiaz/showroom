import {dataScenes,storyTransition} from './data-question-state.js';
import {businessQuestion,answerability} from './data-question-content.js';
import {dataLessons,distinctions} from './data-learning.js';
export {dataScenes};
export const initialData=()=>({scene:'QUESTION',question:businessQuestion,technicalOpen:false,answerability:null,lesson:0,distinction:0});
export const dataReady=s=>!s.technicalOpen&&!['CONNECTING','DISCOVERY'].includes(s.scene);
export function dataTransition(s,action,value){
 if(action==='reset')return initialData();
 if(action==='lesson')return {...s,lesson:Math.max(0,Math.min(dataLessons.length-1,Math.floor(Number(value)||0)))};
 if(action==='distinction')return {...s,distinction:Math.max(0,Math.min(distinctions.length-1,Math.floor(Number(value)||0)))};
 if(action==='answerability')return s.scene==='DISCOVERY'&&!s.technicalOpen&&answerability.some(x=>x.value===value)?{...s,answerability:value}:s;
 return storyTransition(s,action);
}
export function dataEvents(previous,next){
 const events=[];const emit=(type,payload)=>events.push({type,payload});
 if(previous.scene==='QUESTION'&&next.scene==='FRAGMENTED')emit('question_asked',{question:businessQuestion,questionId:'sales',phase:'fragmented'});
 if(previous.scene==='FRAGMENTED'&&next.scene==='CONNECTING')emit('scenario_triggered',{scenario:'connect_example_data'});
 if(previous.scene==='CONNECTED'&&next.scene==='ANSWER')emit('question_asked',{question:businessQuestion,questionId:'sales',phase:'unified'});
 if(previous.scene==='EVIDENCE'&&next.scene==='DISCOVERY')emit('show_completed',{questionId:'sales'});
 if(next.technicalOpen&&!previous.technicalOpen)emit('technology_revealed',{layer:'possible_components'});
 if(next.answerability&&next.answerability!==previous.answerability)emit('customer_signal_added',{category:'data_answerability',value:next.answerability,source:'reverse_discovery'});
 return events;
}
export function reduceData(s,action,value){const state=dataTransition(s,action,value);return {state,events:dataEvents(s,state)};}
export function dataGuide(s){
 if(s.answerability==='already_answerable')return {ask:'Which useful question is still difficult to answer?',listen:'A working reporting foundation · A different business need',probe:'What already works well?',cue:'Do not assume fragmentation or force modernization.',next:'Respect what already works. No data opportunity is required.'};
 if(['ANSWER','EVIDENCE','DISCOVERY'].includes(s.scene))return {ask:'If you asked this today, how would your team find the answer?',listen:'Manual exports · Report requests · Existing analytics',probe:'What evidence would make the answer useful?',cue:'Conversion is a lead to investigate, not a proven cause.',next:'If relevant, explore one real question with its business owner.'};
 return {ask:'Where would your team look for this answer?',listen:'Separate systems · Excel consolidation · Different definitions',probe:'Who brings the information together?',cue:'Let the customer describe their process before proposing change.',next:'Connect a meaningful business question to the information it needs.'};
}
