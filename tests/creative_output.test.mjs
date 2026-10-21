import test from 'node:test';
import assert from 'node:assert/strict';
import {connectedOutputNode,outputPosition} from '../web/creative_output.mjs';
test('reuse only a live active target connected from this output',()=>{
    const target={id:2,type:'Text',mode:0};
    const source={id:1,outputs:[{links:[7]}],graph:{links:{7:{origin_id:1,origin_slot:0,target_id:2}},getNodeById:id=>id===2?target:null}};
    assert.equal(connectedOutputNode(source,'Text'),target);
    assert.equal(connectedOutputNode(source,'Other'),null);
    target.mode=4;assert.equal(connectedOutputNode(source,'Text'),null);
    target.mode=0;source.graph.links[7].origin_id=3;assert.equal(connectedOutputNode(source,'Text'),null);
    delete source.graph.links[7];assert.equal(connectedOutputNode(source,'Text'),null);
});
test('result placement stays to the right and clears occupied cards',()=>{
    const source={x:100,y:50,width:600};
    assert.deepEqual(outputPosition(source,[]),{x:780,y:50});
    assert.deepEqual(outputPosition(source,[{x:780,y:50,width:350,height:240},{x:780,y:330,width:350,height:240}]),{x:780,y:610});
});
