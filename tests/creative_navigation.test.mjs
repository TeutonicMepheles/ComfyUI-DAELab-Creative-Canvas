import test from 'node:test';
import assert from 'node:assert/strict';
import {wheelViewport,copySnapshot,readSnapshot} from '../web/creative_navigation.mjs';
test('wheel pan, shift pan and cursor-centered Ctrl zoom are independent',()=>{
 const v={x:100,y:200,zoom:.5},p={x:350,y:300},e={deltaX:0,deltaY:100,deltaMode:0};
 assert.deepEqual(wheelViewport(v,p,e),{x:100,y:100,zoom:.5});
 assert.deepEqual(wheelViewport(v,p,{...e,shiftKey:true}),{x:0,y:200,zoom:.5});
 const z=wheelViewport(v,p,{...e,ctrlKey:true});assert.equal((p.x-z.x)/z.zoom,(p.x-v.x)/v.zoom);
 assert.deepEqual(wheelViewport(v,p,{...e,deltaY:2,deltaMode:1}),{x:100,y:168,zoom:.5});
});
test('copy snapshot detaches edges without changing source and round-trips parameters',()=>{
 const data={id:7,type:'DAELAB.MediaUpload',inputs:[{link:4}],outputs:[{links:[8]}],widgets_values:['asset']};
 const copy=copySnapshot({serialize:()=>data},{width:600,expanded:true});assert.equal(copy.node.id,undefined);assert.equal(copy.node.inputs[0].link,null);assert.equal(copy.node.outputs[0].links,null);assert.equal(data.inputs[0].link,4);assert.equal(readSnapshot(JSON.stringify(copy)).node.widgets_values[0],'asset');assert.equal(readSnapshot('unrelated text'),null);
});
