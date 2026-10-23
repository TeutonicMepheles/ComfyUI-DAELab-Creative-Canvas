import test from 'node:test';
import assert from 'node:assert/strict';
import {registerAdapter} from '../web/creative_contract.mjs';
import {materialDropSnapshot,acceptsMaterialDrop,materialDropCount} from '../web/creative_material_drop.mjs';

test('text snapshot uses public adapter, requires explicit text capability and excludes inactive/unready sources',()=>{
 const source={version:1,texts:['一段文本\n第二行']};
 const dispose=registerAdapter('drop-test',{matches:n=>n.type==='TextTest',inputSnapshot:()=>source});
 try{
  const snapshot=materialDropSnapshot({type:'TextTest'});assert.deepEqual(snapshot,source);assert.notEqual(snapshot,source);
  assert.equal(materialDropCount(snapshot),1);assert.equal(acceptsMaterialDrop({},snapshot),false);
  assert.equal(acceptsMaterialDrop({accepts:['text']},snapshot),true);
  assert.equal(materialDropSnapshot({type:'TextTest',mode:4}),null);
  source.ready=false;assert.equal(materialDropSnapshot({type:'TextTest'}),null);
 }finally{dispose();}
});
test('media snapshots preserve legacy receivers and cannot enter text-only columns',()=>{
 const asset={filename:'test.webm',kind:'video'},node={id:7,type:'DAELAB.MediaUpload',widgets:[{name:'asset_data',value:JSON.stringify(asset)}]};
 const snapshot=materialDropSnapshot(node);assert.equal(snapshot.assets[0].nodeId,'7');assert.equal(materialDropCount(snapshot),1);
 assert.equal(acceptsMaterialDrop({},snapshot),true);assert.equal(acceptsMaterialDrop({accepts:['text']},snapshot),false);
 assert.equal(materialDropSnapshot({...node,mode:2}),null);
});
