import {continuation} from './workspace-thread-content.js';
export const initialThread=()=>({active:false,opening:0,conversation:0,end:0,threadOpen:false,replies:0,threadDone:false,contributions:0,finalBeat:0,discovery:false,signal:null,adoption:'workspace'});
// Presentation beats surround, rather than bypass, existing Calendar/notes/AI gates.
export function threadTransition(s,action,value){
 const t={...s.thread};const n={...s,thread:t};
 if(action==='opening-reveal'&&s.scene==='opening'){t.opening=1;return n;}
 if((action==='start-thread'&&s.scene==='opening')||(action==='resume-thread'&&s.scene==='friction')){t.active=true;t.opening=1;n.scene='mail';return n;}
 if(action==='adoption'&&['workspace','microsoft','disconnected','whatsapp','none'].includes(value)){t.adoption=value;return n;}
 if(!t.active)return null;
 if(action==='prev'){
  if(s.scene==='mail'){n.scene='opening';t.active=false;return n;}
  if(s.scene==='meet'){if(t.end){t.end--;return n;}if(t.conversation){t.conversation--;return n;}}
  if(s.scene==='collaborate'&&t.threadOpen){t.threadOpen=false;return n;}
  if(s.scene==='final'){if(t.discovery){t.discovery=false;return n;}if(t.finalBeat){t.finalBeat--;n.network=false;return n;}}
 }
 if(action==='conversation'&&s.scene==='meet'&&s.meetingStarted&&!t.end){t.conversation=Math.min(4,t.conversation+1);return n;}
 if(action==='notes'&&s.scene==='meet'&&t.conversation<4)return s;
 if(action==='end-meeting'&&s.scene==='meet'&&s.notes){t.end=1;return n;}
 if(action==='next'&&s.scene==='meet'){
  if(!s.meetingStarted||t.conversation<4||!s.notes)return s;
  if(t.end<2){t.end++;return n;}
 }
 if(action==='thread-open'&&s.scene==='collaborate'&&s.space){t.threadOpen=true;return n;}
 if(action==='thread-reply'&&s.scene==='collaborate'&&t.threadOpen){t.replies=Math.min(2,t.replies+1);return n;}
 if(action==='thread-close'&&s.scene==='collaborate'&&t.threadOpen){t.threadOpen=false;t.threadDone=t.replies===2;return n;}
 if(action==='next'&&s.scene==='collaborate'&&!t.threadDone)return s;
 if(action==='contribute'&&s.scene==='work'&&s.file==='Proposal Draft'){
  t.contributions=Math.min(3,t.contributions+1);n.edits=Math.min(2,t.contributions);n.doc=t.contributions===3;return n;
 }
 if(action==='next'&&s.scene==='work'&&t.contributions<3)return s;
 if(s.scene==='final'&&(action==='next'||action==='network')){
  t.finalBeat=Math.min(2,t.finalBeat+1);n.network=t.finalBeat===2;return n;
 }
 if(action==='discovery'&&s.scene==='final'&&t.finalBeat===2){t.discovery=true;return n;}
 if(action==='signal'&&s.scene==='final'&&t.discovery&&continuation.includes(value)){t.signal=value;return n;}
 return null;
}
