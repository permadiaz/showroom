import {shows} from './content.js';
import {canRender} from './visibility.js';
export const modeDefinitions=[
 {id:'learn',label:'LEARN',purpose:'Understand the subject'},
 {id:'show',label:'SHOW',purpose:'Customer-safe interactive story'},
 {id:'sell',label:'SELL',purpose:'Internal AE conversation guidance'}
];
export function resolveRoute(hash){
 const raw=hash.replace(/^#/,'')||'/';
 const [path,query='']=raw.split('?');
 const match=path.match(/^\/(learn|show|sell)\/([^/]+)\/?$/);
 const experience=match?shows.find(s=>s.slug===match[2]&&canRender(s.visibility,'show')):undefined;
 return {path,experience,mode:experience?match[1]:'explore',entry:experience?.slug==='cloud-migration'&&new URLSearchParams(query).get('entry')==='migration'?'migration':null};
}
export const experienceHref=(slug,mode='show',entry)=>`#/${mode}/${slug}${entry?'?entry='+entry:''}`;
