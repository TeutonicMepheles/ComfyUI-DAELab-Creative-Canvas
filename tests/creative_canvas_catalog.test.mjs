import test from 'node:test';
import assert from 'node:assert/strict';
import {declaredInputTypes,canConnectDefinition,matchingSlot} from '../web/creative_canvas_catalog.mjs';
test('dynamic inputs are matched without exposing hidden and socketless parameters',()=>{
 const definition={input:{required:{hidden:['STRING',{hidden:true}],plain:['INT',{socketless:true}],images:['COMFY_AUTOGROW_V3',{template:{input:{optional:{image:['COMFYTV_IMAGE',{}]}}}}]},optional:{video:['COMFYTV_VIDEO',{}]}},output:['COMFYTV_VIDEO']};
 assert.deepEqual(declaredInputTypes(definition.input),['COMFYTV_IMAGE','COMFYTV_VIDEO']);
 assert.equal(canConnectDefinition(definition,'output','COMFYTV_IMAGE'),true);
 assert.equal(canConnectDefinition(definition,'output','STRING'),false);
 assert.equal(canConnectDefinition(definition,'input','COMFYTV_VIDEO'),true);
 assert.equal(canConnectDefinition(definition,'input','COMFYTV_IMAGE'),false);
 assert.equal(canConnectDefinition(undefined,'output','*'),false);
});
test('actual slot matching preserves direction and excludes converted widgets',()=>{
 const n={inputs:[{type:'STRING',widget:{}},{type:'COMFYTV_IMAGE'},{type:'COMFYTV_VIDEO'}],outputs:[{type:'COMFYTV_VIDEO'}]};
 assert.equal(matchingSlot(n,'output','STRING'),-1);
 assert.equal(matchingSlot(n,'output','COMFYTV_IMAGE'),1);
 assert.equal(matchingSlot(n,'input','COMFYTV_VIDEO'),0);
 assert.equal(matchingSlot(n,'input','COMFYTV_IMAGE'),-1);
});
