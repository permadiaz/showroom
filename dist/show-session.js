export const showEventTypes=Object.freeze(['show_started','show_completed','mode_changed','scenario_triggered','question_asked','followup_question_selected','customer_signal_added','current_state_identified','pain_identified','concern_identified','technology_revealed','next_step_selected','presentation_started','presentation_completed']);
const clone=value=>structuredClone(value);
// Page-session memory only: no network, persistent storage, inference, or CRM integration.
export function createShowSession(){
 let sequence=0;
 const events=[],listeners=new Set(),started=new Set(),completed=new Set();
 return {
  emit(type,experience,payload={},context={}){
   if(!showEventTypes.includes(type))throw new Error('Unsupported show event');
   const completionKey=experience+(context.scope?'\0'+context.scope:'');
   if(type==='show_completed'&&completed.has(completionKey))return null;
   const event={id:++sequence,type,timestamp:new Date().toISOString(),experience,showId:experience,mode:context.mode||'show',...(context.scope?{scope:context.scope}:{}),step:context.step||'opening',...Object.fromEntries(['category','value','source'].filter(key=>context[key]!==undefined||payload[key]!==undefined).map(key=>[key,clone(payload[key]??context[key])])),payload:clone(payload)};
   if(type==='show_completed')completed.add(completionKey);
   events.push(event);if(events.length>250)events.shift();
   for(const listener of listeners){try{listener(clone(event));}catch{/* A consumer must not interrupt the presentation. */}}
   return clone(event);
  },
  start(experience,context={}){if(started.has(experience))return;started.add(experience);this.emit('show_started',experience,{},context);},
  reset(experience){for(let i=events.length-1;i>=0;i--)if(events[i].experience===experience)events.splice(i,1);started.delete(experience);for(const key of completed)if(key===experience||key.startsWith(experience+'\0'))completed.delete(key);},
  resetScope(experience,scope){for(let i=events.length-1;i>=0;i--)if(events[i].experience===experience&&events[i].scope===scope)events.splice(i,1);completed.delete(experience+'\0'+scope);},
  subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
  snapshot(){return clone(events);}
 };
}
