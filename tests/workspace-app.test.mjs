import test from 'node:test';
import assert from 'node:assert/strict';
test('Workspace shell remains presenter-paced and hides AE during presentation',async()=>{
 const ae={},we={};let timerCalls=0;const actualSet=globalThis.setTimeout;
 globalThis.setTimeout=()=>{timerCalls++;throw new Error('Workspace must not autoplay');};
 try{
 const app={innerHTML:'',scrollTop:0,addEventListener:(n,f)=>ae[n]=f,querySelectorAll:()=>[]};
 globalThis.document={querySelector:()=>app,body:{classList:{toggle(){}}},addEventListener(){}};globalThis.location={hash:'#/show/workspace-workday'};globalThis.window={addEventListener:(n,f)=>we[n]=f,scrollTo(){}};
 await import('../dist/app.js');const click=dataset=>ae.click({target:{closest:()=>({dataset})}});const key=key=>we.keydown({key,target:{closest:()=>null},preventDefault(){}});
 assert.match(app.innerHTML,/START THE WORKDAY/);click({ws:'next'});for(let i=0;i<9;i++)click({ws:'next'});click({ws:'next'});click({ws:'next'});assert.match(app.innerHTML,/FIND A TIME/);
 click({mode:'sell'});assert.match(app.innerHTML,/How do teams arrange meetings today/);key('p');assert.doesNotMatch(app.innerHTML,/INTERNAL|AE GUIDE|data-mode="sell"|<header>/);key('s');assert.doesNotMatch(app.innerHTML,/AE GUIDE/);
 key('ArrowRight');assert.match(app.innerHTML,/FIND A TIME/);click({ws:'find-time'});click({ws:'slot',value:'Tue 10:30'});for(const action of ['invite','meet-link','attach','create-event'])click({ws:action});key('ArrowRight');assert.match(app.innerHTML,/START THE MEETING/);
 key('Escape');click({mode:'learn'});click({ws:'lesson',value:'4'});click({ws:'classify',value:'CHAT'});assert.match(app.innerHTML,/Good fit/);click({mode:'show'});assert.match(app.innerHTML,/START THE MEETING/);
 click({ws:'start-meet'});for(let i=0;i<4;i++)click({ws:'conversation'});click({ws:'notes'});click({ws:'end-meeting'});click({ws:'next'});click({ws:'next'});assert.match(app.innerHTML,/CREATE A SPACE/);click({mode:'sell'});assert.match(app.innerHTML,/Where does project communication normally happen/);assert.equal(timerCalls,0);
 }finally{globalThis.setTimeout=actualSet;}
});
