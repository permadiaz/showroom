import {metrics} from './cloud-model.js';
// Presentation state only. The approved simulation/migration reducer is unchanged.
export const initialCloudStage=()=>({capacityAdded:0,component:null,mapping:1,balance:false,motionPaused:false});
export function stageTransition(view,action,value,story){
 if(action==='reset')return initialCloudStage();
 if(action==='capacity'&&story.moment==='compare')return {...view,capacityAdded:Math.min(4,view.capacityAdded+1),balance:false,motionPaused:false};
 if(action==='capacity-back'&&story.moment==='compare')return {...view,capacityAdded:Math.max(0,view.capacityAdded-1),balance:false,motionPaused:false};
 if(action==='balance'&&story.moment==='compare'&&view.capacityAdded===4)return {...view,balance:true};
 if(action==='mapping'&&story.moment==='capabilities'&&story.reveal)return {...view,mapping:Math.min(3,view.mapping+1)};
 if(action==='mapping-back'&&story.moment==='capabilities'&&view.mapping>1)return {...view,mapping:view.mapping-1,component:null};
 if(action==='motion')return {...view,motionPaused:!view.motionPaused};
 if(action==='component'&&story.reveal&&story.moment==='capabilities'&&['balancing','compute','autoscaling','monitoring','dependencies'].includes(value))return {...view,component:view.component===value?null:value};
 return view;
}
export function stageProjection(story,view=initialCloudStage()){
 // Hold the observed peak while explaining a different response. Replay still uses
 // the original reducer's full 1,000 → 15,000 demand sequence and timing.
 const explaining=story.moment==='compare';
 const projected=explaining?{...story,pressure:3,resources:2+view.capacityAdded}:story;
 const result=metrics(projected,projected.comparison);
 const frozen=['consequence','question','takeaway','capabilities'].includes(story.moment)||view.motionPaused||(['trigger','retest'].includes(story.moment)&&!story.running);
 return {...result,technology:story.moment==='capabilities'&&story.reveal,mapping:view.mapping,component:view.component,pressure:projected.pressure,explaining,frozen,elastic:projected.comparison,capacityAdded:view.capacityAdded,epoch:[story.environment,story.moment,projected.pressure,explaining?view.capacityAdded:projected.resources].join('-')};
}
