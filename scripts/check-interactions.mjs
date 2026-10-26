import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import React from 'react';
import {create,act} from 'react-test-renderer';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
mkdirSync('work',{recursive:true});
await build({stdin:{contents:"export {GiftModal} from './src/components/GiftModal.tsx'; export {birthdayConfig} from './src/config/birthday.ts';",resolveDir:process.cwd(),loader:'tsx'},bundle:true,platform:'node',format:'esm',packages:'external',outfile:'work/test-modal.mjs',jsx:'automatic'});
const {GiftModal,birthdayConfig}=await import('../work/test-modal.mjs');
let checks=0;
const mount=async(gift)=>{let instance,closed=0;await act(async()=>{instance=create(React.createElement(GiftModal,{gift,onClose:()=>closed++}));});return {instance,get closed(){return closed}}};
const text=i=>JSON.stringify(i.toJSON());
const nodeText=n=>typeof n==='string'?n:(n.children??[]).map(nodeText).join('');
const click=async(i,matcher)=>{const b=i.root.findAllByType('button').find(b=>matcher(b.props,nodeText(b)));assert(b,'button missing');await act(async()=>b.props.onClick());checks++;};
for(const gift of ['letter','cake','photos','video']){
 const m=await mount(gift);assert.equal(m.instance.root.findByProps({role:'dialog'}).props['aria-modal'],'true');checks++;
 if(gift==='letter'){assert(text(m.instance).includes(birthdayConfig.letter.title));checks++;}
 if(gift==='cake'){
  await click(m.instance,(_,s)=>s.includes(birthdayConfig.cake.light));
  assert.equal(m.instance.root.findAllByProps({className:'flame'}).length,1);checks++;
  await click(m.instance,(_,s)=>s.includes(birthdayConfig.cake.wish));
  assert(text(m.instance).includes(birthdayConfig.cake.wishText));checks++;
  await click(m.instance,(_,s)=>s.includes(birthdayConfig.cake.blow));
  assert.equal(m.instance.root.findAllByProps({className:'flame'}).length,0);assert(text(m.instance).includes(birthdayConfig.cake.greeting));checks+=2;
 }
 if(gift==='photos'){
  await click(m.instance,p=>p.className==='polaroid');assert.equal(m.instance.root.findAllByProps({className:'photo-detail'}).length,1);checks++;
  await click(m.instance,p=>p.className==='text-button');assert.equal(m.instance.root.findAllByProps({className:'polaroid'}).length,birthdayConfig.photos.length);checks++;
 }
 if(gift==='video'){
  assert.equal(m.instance.root.findAllByType('video').length,0);assert.equal(m.instance.root.findAllByProps({className:'video-placeholder'}).length,1);checks+=2;
 }
 await click(m.instance,p=>p.className==='close');assert.equal(m.closed,1);checks++;
 await click(m.instance,p=>p.className==='return-button');assert.equal(m.closed,2);checks++;
 await act(async()=>m.instance.unmount());
}
// A configured-but-missing media file must also fall back to the reserved UI.
birthdayConfig.videoUrl='assets/missing.mp4';const v=await mount('video');assert.equal(v.instance.root.findAllByType('video').length,1);checks++;
await act(async()=>v.instance.root.findByType('video').props.onError());assert.equal(v.instance.root.findAllByProps({className:'video-placeholder'}).length,1);checks++;await act(async()=>v.instance.unmount());birthdayConfig.videoUrl='';
console.log(`Passed ${checks} component checks: cake stages, photo preview, missing-video fallback and all modal close controls.`);
