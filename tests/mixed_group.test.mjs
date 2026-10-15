import test from 'node:test';
import assert from 'node:assert/strict';
import {registerAdapter} from '../web/creative_contract.mjs';
import {groupInputSnapshot,collectionFor,isGroupMember} from '../web/material_group_model.mjs';
import {textSnapshot} from '../web/text_input_model.mjs';
test('mixed groups retain media contract and expose text as reverse instructions',()=>{
    const nodes=[{id:1,type:'DAELAB.MediaUpload',widgets:[{name:'asset_data',value:'{"kind":"image","filename":"a.png"}'}]},{id:2,type:'DAELAB.TextInput',widgets:[{name:'text',value:'保留主体，改成黄昏'}]}];
    const dispose=registerAdapter('test-text',{matches:n=>n.type==='DAELAB.TextInput',inputSnapshot:n=>textSnapshot(n,()=>null)});
    const group={properties:{members:[1,2]},graph:{getNodeById:id=>nodes.find(n=>n.id===id)}};
    assert.equal(isGroupMember(nodes[1]),true);assert.equal(isGroupMember({type:'DAELAB.Table'}),false);
    assert.equal(collectionFor(group).assets.length,1);
    assert.deepEqual(groupInputSnapshot(group).texts,['保留主体，改成黄昏']);assert.equal(groupInputSnapshot(group).inputMode,'image-instructions');
    nodes[1].mode=4;assert.throws(()=>groupInputSnapshot(group),/停用/);dispose();
});
test('linked text follows approved output, invalidates on undo and preserves local draft',()=>{
    const source={id:1},node={inputs:[{name:'text',link:7}],widgets:[{name:'text',value:'draft'}],graph:{links:{7:{origin_id:1,origin_slot:0}},getNodeById:()=>source}};
    assert.deepEqual(textSnapshot(node,()=>({version:1,texts:['approved']})).texts,['approved']);
    assert.equal(textSnapshot(node,()=>({version:1,ready:false})).ready,false);
    node.inputs[0].link=null;assert.deepEqual(textSnapshot(node,()=>null).texts,['draft']);
    node.inputs[0].link=7;assert.equal(textSnapshot(node,()=>textSnapshot(node,()=>null)).ready,false);
});
