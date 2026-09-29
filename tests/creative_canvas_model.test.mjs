import '../web/adapters/upload.mjs';
import {registerAdapter} from '../web/creative_contract.mjs';
registerAdapter('test.business',{matches:n=>['DAELAB.Table','DAELAB.StoryboardImport','DAELAB.LibTV.VideoGenerate','ComfyTV.VideoExtractFrameStage'].includes(n.type)});
import test from 'node:test';
import assert from 'node:assert/strict';
import {canvasState,cardState,zoomAt,normalizeViewport,supportedNode,socketCompatible,graphLinks,localOutputPreview} from '../web/creative_canvas_model.mjs';

test('canvas state round-trips without modifying native node positions or existing metadata',()=>{
    const graph={extra:{linearData:{inputs:[[1,'table_data']]}}},node={id:1,type:'DAELAB.Table',pos:[13,24],size:[1080,558]};
    const state=canvasState(graph);cardState(state,node).x=450;state.active=true;
    const restored=canvasState(JSON.parse(JSON.stringify(graph)));
    assert.equal(restored.cards[1].x,450);assert.equal(restored.active,true);
    assert.deepEqual(graph.extra.linearData,{inputs:[[1,'table_data']]});assert.deepEqual(node.pos,[13,24]);assert.deepEqual(node.size,[1080,558]);
});
test('zoom preserves the world point under the cursor and clamps the range',()=>{
    const v={x:120,y:80,zoom:.5},p={x:430,y:370},next=zoomAt(v,p,2);
    assert.equal((p.x-v.x)/v.zoom,(p.x-next.x)/next.zoom);
    assert.equal((p.y-v.y)/v.zoom,(p.y-next.y)/next.zoom);
    assert.equal(zoomAt(v,p,100).zoom,2);assert.equal(normalizeViewport({zoom:-4,x:NaN}).zoom,.15);
});
test('resizable workspace cards retain independent saved widths below the default',()=>{
    const release=registerAdapter('test.resizable',{matches:n=>n.type==='Test.Resizable',width:1060,workspace:()=>true,resizable:()=>true});
    try{
        const graph={extra:{}},state=canvasState(graph),a={id:7,type:'Test.Resizable'},b={id:8,type:'Test.Resizable'};
        cardState(state,a).width=640;cardState(state,b).width=1380;
        const restored=canvasState(JSON.parse(JSON.stringify(graph)));
        assert.equal(cardState(restored,a).width,640);assert.equal(cardState(restored,b).width,1380);
    }finally{release();}
});
test('projection supports registered media features and preserves unknown graph nodes',()=>{
    for(const type of ['DAELAB.Table','DAELAB.StoryboardImport','DAELAB.LibTV.VideoGenerate','ComfyTV.VideoExtractFrameStage'])assert.equal(supportedNode({type}),true);
    assert.equal(supportedNode({type:'KSampler'}),false);
    assert.equal(socketCompatible('COMFYTV_IMAGES','COMFYTV_VIDEO'),false);assert.equal(socketCompatible('IMAGE','IMAGE,MASK'),true);
    assert.equal(socketCompatible('*','IMAGE'),true);
    const link={id:1};assert.deepEqual(graphLinks({links:new Map([[1,link]])}),[link]);assert.deepEqual(graphLinks({links:{1:link}}),[link]);
});
test('persist only explicit local output media, never reference images or external output text',()=>{
    assert.deepEqual(localOutputPreview({output:['/view?filename=frame.png&type=output']}),{url:'/view?filename=frame.png&type=output',kind:'image'});
    assert.equal(localOutputPreview({output:['/view?filename=ref.png&type=input']}),null);
    assert.equal(localOutputPreview({output:['https://example.com/image.png']}),null);
});
