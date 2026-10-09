// UI visibility only, not authorization. Confidential material is never shipped in V1.
export const Visibility=Object.freeze({PUBLIC:'PUBLIC',PRESENTATION_ONLY:'PRESENTATION_ONLY',INTERNAL:'INTERNAL',CONFIDENTIAL:'CONFIDENTIAL'});
const aliases={public:'PUBLIC',presentation:'PRESENTATION_ONLY',presentation_only:'PRESENTATION_ONLY',internal:'INTERNAL',confidential:'CONFIDENTIAL'};
export function canRender(visibility,mode,presentation=false){
 const level=aliases[visibility]||visibility;
 if(!Object.values(Visibility).includes(level)||level===Visibility.CONFIDENTIAL)return false;
 if(presentation)return level===Visibility.PUBLIC||level===Visibility.PRESENTATION_ONLY;
 if(level===Visibility.PRESENTATION_ONLY)return false;
 if(level===Visibility.INTERNAL)return mode==='learn'||mode==='sell';
 return true;
}
export const visibleContent=(items,mode,presentation=false)=>items.filter(item=>canRender(item.visibility,mode,presentation));
export const safeMode=(mode,presentation=false)=>presentation?'show':['explore','learn','show','sell'].includes(mode)?mode:'show';
