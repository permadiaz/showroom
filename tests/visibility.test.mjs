import test from 'node:test';
import assert from 'node:assert/strict';
import {canRender,visibleContent,safeMode,shows,worlds,futureCapability} from '../dist/content.js';
test('presentation excludes internal and confidential in every mode',()=>{for(const mode of ['explore','learn','show','sell']){assert.equal(canRender('internal',mode,true),false);assert.equal(canRender('confidential',mode,true),false);assert.equal(safeMode(mode,true),'show');}});
test('confidential content never reaches client views',()=>{for(const mode of ['explore','learn','show','sell'])assert.equal(canRender('confidential',mode),false);assert.equal(canRender('internal','explore'),false);assert.equal(canRender('internal','show'),false);assert.equal(canRender('internal','sell'),true);assert.equal(canRender('internal','learn'),true);});
test('filter returns only permitted records',()=>{assert.deepEqual(visibleContent([{visibility:'internal'},{visibility:'public'},{visibility:'confidential'}],'show',true),[{visibility:'public'}]);});
test('V1 has exactly three scoped experiences and eight navigation worlds',()=>{assert.equal(shows.length,3);assert.equal(worlds.length,8);assert.equal(new Set(shows.map(s=>s.slug)).size,3);for(const s of shows){assert.equal(s.status,'live');assert.ok(s.description);assert.ok(s.kind);assert.ok(worlds.some(w=>w.id===s.world));}assert.equal(futureCapability.enabled,false);});
