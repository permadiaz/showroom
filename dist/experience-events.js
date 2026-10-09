import {dataEvents} from './data-model.js';
import {stages} from './cloud-model.js';
export function experienceStep(experience,state){
 if(experience==='cloud-migration')return !state.environment?'opening':state.migration?'migration:'+stages[state.stage]:state.moment;
 if(experience==='workspace-workday')return state.scene==='before'?'before:'+state.before:state.scene;
 return state.scene;
}
export function interactionEvents(experience,previous,next,action){
 if(experience==='ask-your-data')return dataEvents(previous,next,action);
 const events=[],emit=(type,payload)=>events.push({type,payload});
 if(experience==='cloud-migration'){
  if(action==='environment'&&next.environment&&next.environment!==previous.environment)emit('scenario_triggered',{category:'environment',value:next.environment,source:'simulation'});
  if(next.scenario&&(next.scenario!==previous.scenario||(!previous.running&&next.running&&next.pressure===0)))emit('scenario_triggered',{category:'scenario',value:next.scenario,source:'simulation',comparison:next.comparison});
  if(!previous.migration&&next.migration)emit('scenario_triggered',{category:'rehearsal',value:'migration',source:'simulation'});
  if(next.reveal&&!previous.reveal){emit('technology_revealed',{value:'cloud_capabilities'});emit('show_completed',{value:'cloud_story'});}
 }
 if(experience==='workspace-workday'){
  if(next.thread?.signal&&next.thread.signal!==previous.thread?.signal)emit('customer_signal_added',{category:'workspace_continuity',value:next.thread.signal.toLowerCase().replaceAll(' ','_')});
  if(!previous.thread?.active&&next.thread?.active)emit('scenario_triggered',{value:'follow_the_thread',source:'simulation'});
  if(previous.scene==='friction'&&next.scene==='mail')emit('scenario_triggered',{value:'connected_workday',source:'simulation'});
  if(next.network&&!previous.network){emit('technology_revealed',{value:'connected_workspace'});emit('show_completed',{value:'workspace_workday'});}
 }
 return events;
}
