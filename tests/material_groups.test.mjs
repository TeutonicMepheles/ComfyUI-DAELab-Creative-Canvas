import test from 'node:test';
import assert from 'node:assert/strict';
import {GROUP_TYPE,collectionFor,expandGroupSelection,remapGroupMembers,migrateGroups} from '../web/material_group_model.mjs';
test('ordered whole collection preserves identity, media kind and duplicate asset uses',()=>{
 const asset={version:1,id:'a',kind:'image',filename:'a.png',name:'a.png'};
 const nodes=new Map([['a',{type:'DAELAB.MediaUpload',widgets:[{name:'asset_data',value:JSON.stringify(asset)}]}],['b',{type:'DAELAB.MediaUpload',widgets:[{name:'asset_data',value:JSON.stringify({...asset,kind:'video',filename:'a.webm'})}]}]]);
 const group={title:'g',properties:{members:['b','a']},graph:{getNodeById:id=>nodes.get(id)}};
 assert.deepEqual(collectionFor(group).assets.map(a=>[a.nodeId,a.kind]),[['b','video'],['a','image']]);
 group.properties.members.push('missing');assert.deepEqual(collectionFor(group).assets.at(-1),{nodeId:'missing',missing:true});
});
test('group copy/delete includes members and remaps only copied IDs',()=>{
 const g={id:'g',type:GROUP_TYPE,properties:{members:['a','b']}};
 assert.deepEqual([...expandGroupSelection({getNodeById:()=>g},['g','a'])],['g','a','b']);
 const clone=structuredClone(g);remapGroupMembers([clone],new Map([['a',{id:'new-a'}],['b',{id:'new-b'}]]));
 assert.deepEqual(clone.properties.members,['new-a','new-b']);assert.deepEqual(g.properties.members,['a','b']);
});
test('prototype migration preserves group presentation and table data but drops review-only socket',()=>{
 const data={nodes:[{id:'g',type:'DAELAB.GroupReviewDemo',properties:{members:['a'],layout:'vertical',reviewColor:'#123456'},outputs:[{type:'DAELAB_REVIEW_ASSETS',links:[7]}]},{id:'t',type:'DAELAB.Table',inputs:[{name:'real',type:'STRING'},{type:'DAELAB_REVIEW_ASSETS'}],widgets_values:['table contents']}],links:[[7,'g',0,'t',1,'DAELAB_REVIEW_ASSETS']],extra:{daelabGroupReviewDemoV1:{}}};
 migrateGroups(data);assert.equal(data.nodes[0].type,GROUP_TYPE);assert.equal(data.nodes[0].properties.layout,'vertical');assert.deepEqual(data.nodes[1].widgets_values,['table contents']);assert.equal(data.nodes[1].inputs.length,1);assert.equal(data.links.length,0);
});
