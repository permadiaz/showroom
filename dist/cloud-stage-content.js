export const cloudComponents=[
 {id:'balancing',name:'Cloud Load Balancing',role:'DISTRIBUTE REQUESTS',icon:'networking.svg',iconAlt:'Google Cloud Networking category icon',explanation:'Distributes incoming traffic across suitable backends. Health checks help direct traffic to healthy instances.',limit:'Routing alone does not create capacity or remove an application bottleneck.',source:'https://docs.cloud.google.com/compute/docs/load-balancing-and-autoscaling'},
 {id:'compute',name:'Compute Engine',role:'RUN THE APPLICATION',icon:'compute-engine.svg',iconAlt:'Google Cloud Compute Engine icon',explanation:'Virtual machines provide the compute resources that run this example application. A managed instance group treats similarly configured VMs as a group.',limit:'The application and its dependencies must be designed for multiple instances.',source:'https://docs.cloud.google.com/compute/docs/instance-groups'},
 {id:'autoscaling',name:'Managed instance group / autoscaling',role:'ADJUST CAPACITY',explanation:'A configured autoscaler can adjust the number of VMs in a managed instance group using workload signals and policies.',limit:'Targets, minimum/maximum size, quotas and startup time matter. The six resources here are a conceptual example, not a promise.',source:'https://docs.cloud.google.com/compute/docs/autoscaler'},
 {id:'monitoring',name:'Cloud Monitoring',role:'OBSERVE CONDITIONS',icon:'observability.svg',iconAlt:'Google Cloud Observability category icon',explanation:'Metrics help teams observe application and infrastructure conditions. Configured alerting policies can notify operators when criteria are met.',limit:'Monitoring supports decisions; an alert by itself does not add capacity.',source:'https://docs.cloud.google.com/monitoring/docs/monitoring-overview'},
 {id:'dependencies',name:'Data / dependencies',role:'DESIGN THE WHOLE PATH',explanation:'The application still depends on networking, databases, storage and access controls. Their limits can constrain the whole service.',limit:'The right architecture, including security, needs workload-specific assessment. Containers or serverless may be alternatives where appropriate.',source:null}
];
export const cloudNarrative={
 normal:['NORMAL','The work is flowing.','One workload. A steady demand. Infrastructure has room to respond.'],
 trigger:['DEMAND INCREASES','More work arrives.','Watch the same workload reach the same two resources.'],
 consequence:['FREEZE / PEAK DEMAND','Demand changed.','Capacity is constrained. Requests begin to wait.'],
 question:['A DIFFERENT RESPONSE?',"Demand changed.<br>Your infrastructure didn't.",''],
 compare:['CHANGE THE RESPONSE','Keep the demand.<br>Change the response.','Make capacity available, one resource at a time. The demand stays at 15,000.'],
 retest:['SAME WORKLOAD / REPLAY','Same demand.<br>A different response.','Replay begins at normal demand. Watch capacity respond as the same spike returns.'],
 stabilized:['BALANCE RESTORED','The flow finds room.','The same peak demand is now distributed across six illustrative resources.'],
 takeaway:['SAME WORKLOAD / DIFFERENT RESPONSE',"The workload didn't change.<br>The way infrastructure responds did.",''],
 capabilities:['THE TECHNOLOGY BEHIND THE RESPONSE','Now the mechanism<br>has a name.','One possible Google Cloud architecture for a suitable VM-based application.']
};
