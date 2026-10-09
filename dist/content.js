export const worlds = [
 {id:'think',description:'Explore how intelligence can help people understand, decide and act.',name:'THINK',label:'AI & Intelligence',symbol:'✳'},
 {id:'understand',description:'Turn fragmented information into something the business can use.',name:'UNDERSTAND',label:'Data & Analytics',symbol:'◈',show:'ask-your-data'},
 {id:'run',description:'Run applications, infrastructure and workloads with greater flexibility.',name:'RUN',label:'Cloud & Modernization',symbol:'⌁',show:'cloud-migration'},
 {id:'build',description:'Create and evolve applications around the way the business works.',name:'BUILD',label:'Apps & Digital Platforms',symbol:'⌘'},
 {id:'work',description:'Connect people, communication and everyday work.',name:'WORK',label:'Productivity & Collaboration',symbol:'⊞',show:'workspace-workday'},
 {id:'engage',description:'Connect customer interactions across the customer journey.',name:'ENGAGE',label:'Customer Engagement',symbol:'◎'},
 {id:'protect',description:'Manage access, risk and trust across the business.',name:'PROTECT',label:'Security & Trust',symbol:'◇'},
 {id:'connect',description:'Link systems and information across the enterprise.',name:'CONNECT',label:'Integration & Enterprise',symbol:'⋈'}
];
export const shows = [
 {
  "slug": "cloud-migration",
  "name": "Cloud & Migration",
  "world": "run",
  "kind": "INTERACTIVE SIMULATION",
  "number": "01",
  "tagline": "When demand changes, can your business keep moving?",
  "description": "Explore infrastructure pressure, resilience, and the journey to cloud.",
  "icon": "⌁",
  "status": "live",
  "visibility": "PUBLIC"
 },
 {
  "slug": "workspace-workday",
  "name": "A Day at Work",
  "world": "work",
  "kind": "INTERACTIVE WORKDAY",
  "number": "02",
  "tagline": "One project. One team. One connected workday.",
  "description": "Follow a request from an email to a meeting, shared work, and follow-up.",
  "icon": "⊞",
  "status": "live",
  "visibility": "PUBLIC"
 },
 {
  "slug": "ask-your-data",
  "name": "Ask Your Data",
  "world": "understand",
  "kind": "INTERACTIVE EXPERIENCE",
  "number": "03",
  "tagline": "Your company has data. But can it answer you?",
  "description": "Connect scattered information to business questions and explainable insights.",
  "icon": "◈",
  "status": "live",
  "visibility": "PUBLIC"
 }
];
export const futureCapability = {id:'custom-magic-show',status:'coming-soon',enabled:false,title:'CUSTOM MAGIC SHOW',description:'Turn a customer problem into an interactive solution story.'};
export {canRender,visibleContent,safeMode,Visibility} from './visibility.js';

export const problems=[
 {id:'demand',visibility:'PUBLIC',label:'Infrastructure cannot respond to changing demand',experience:'cloud-migration'},
 {id:'migration',visibility:'PUBLIC',label:'Migration downtime is a concern',experience:'cloud-migration',entry:'migration',destination:'Migration Rehearsal'},
 {id:'handoffs',visibility:'PUBLIC',label:'Work happens across disconnected communication and files',experience:'workspace-workday'},
 {id:'meeting-context',visibility:'PUBLIC',label:'Meeting context disappears after the meeting',experience:'workspace-workday'},
 {id:'reporting',visibility:'PUBLIC',label:'Business reporting depends on manual consolidation',experience:'ask-your-data'},
 {id:'sources',visibility:'PUBLIC',label:'Data exists across many systems',experience:'ask-your-data'},
 {id:'ai-readiness',visibility:'PUBLIC',label:'Management wants AI but data is fragmented',experience:'ask-your-data'}
];
