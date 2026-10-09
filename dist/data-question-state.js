// The only customer story states. Technology is an optional overlay, not a chapter.
export const dataScenes=Object.freeze(['QUESTION','FRAGMENTED','CONNECTING','CONNECTED','ANSWER','EVIDENCE','DISCOVERY']);
export const primaryActions=Object.freeze({QUESTION:['ask','ASK →'],FRAGMENTED:['connect','CONNECT →'],CONNECTED:['ask-again','ASK AGAIN →'],ANSWER:['show-why','SHOW ME WHY →'],EVIDENCE:['discover','CONTINUE →']});
export function storyTransition(s,action){
 if(action==='close-technology')return {...s,technicalOpen:false};
 if(s.technicalOpen)return action==='prev'?{...s,technicalOpen:false}:s;
 if(action==='technology'&&['EVIDENCE','DISCOVERY'].includes(s.scene))return {...s,technicalOpen:true};
 if(action==='prev'){
  // CONNECTING is a transition, never a backward destination.
  const scene=s.scene==='CONNECTED'?'FRAGMENTED':dataScenes[Math.max(0,dataScenes.indexOf(s.scene)-1)];
  return {...s,scene};
 }
 if(action==='next')action=primaryActions[s.scene]?.[0];
 const transitions={ask:['QUESTION','FRAGMENTED'],connect:['FRAGMENTED','CONNECTING'],'connection-complete':['CONNECTING','CONNECTED'],'ask-again':['CONNECTED','ANSWER'],'show-why':['ANSWER','EVIDENCE'],discover:['EVIDENCE','DISCOVERY']};
 const target=transitions[action];
 return target&&s.scene===target[0]?{...s,scene:target[1]}:s;
}
