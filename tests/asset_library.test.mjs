import test from 'node:test';
import assert from 'node:assert/strict';
import {LIBRARY_KEY,LIBRARY_EVENT,normalizeAsset,assetKey,readLibrary,saveFavorite,removeFavorite,subscribeLibrary} from '../web/asset_library_model.mjs';
const fixture=()=>{const values=new Map();return {storage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},target:new EventTarget()};};
const image={kind:'image',name:'参考图',filename:'reference.png',subfolder:'DAELAB/uploads',type:'input',url:'https://private.invalid/key',provenance:{secret:'not stored'}};
test('media identity ignores node id, labels and unowned metadata',async()=>{
    const options=fixture();await saveFavorite(image,options);await saveFavorite({...image,name:'renamed',id:'other-node'},options);
    const list=readLibrary(options.storage);assert.equal(list.length,1);assert.equal(list[0].name,'参考图');assert.equal(list[0].asset.url,undefined);assert.equal(list[0].asset.provenance,undefined);
    list[0].asset.filename='mutated.png';assert.equal(readLibrary(options.storage)[0].asset.filename,'reference.png');
});
test('text snapshots stay independent and removal preserves other favorites',async()=>{
    const options=fixture();await saveFavorite({kind:'text',text:'original',name:'A'},options);await saveFavorite({kind:'text',text:'edited',name:'A'},options);
    const list=readLibrary(options.storage);assert.deepEqual(list.map(e=>e.text),['edited','original']);await removeFavorite(list[0].id,options);assert.equal(readLibrary(options.storage)[0].text,'original');
});
test('invalid directories, media types and oversized text never persist',()=>{
    for(const a of [{...image,filename:'../x.png'},{...image,subfolder:'../'},{...image,subfolder:'C:/private'},{...image,type:'temp'},{...image,kind:'video'},{kind:'text',text:' '},{kind:'text',text:'x'.repeat(100001)}])assert.throws(()=>normalizeAsset(a));
    assert.equal(assetKey({...image,subfolder:'.'}),assetKey({...image,subfolder:''}));
});
test('corrupt or future storage is reported and never silently overwritten',async()=>{
    for(const raw of ['{broken',JSON.stringify({version:2,entries:[]})]){const options=fixture();options.storage.setItem(LIBRARY_KEY,raw);await assert.rejects(saveFavorite(image,options));assert.equal(options.storage.getItem(LIBRARY_KEY),raw);}
});
test('failed writes emit no success; subscriptions stop on release',async()=>{
    const options=fixture();let changes=0;const release=subscribeLibrary(()=>changes++,options.target);await saveFavorite(image,options);assert.equal(changes,1);release();options.target.dispatchEvent(new Event(LIBRARY_EVENT));assert.equal(changes,1);
    const storage={getItem:()=>null,setItem:()=>{throw new Error('quota');}};await assert.rejects(saveFavorite(image,{...options,storage}),/保存失败/);
});
