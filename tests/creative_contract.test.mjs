import test from 'node:test';
import assert from 'node:assert/strict';
import {registerAdapter,adapterFor,menuItems,publishAPI,API_KEY,inputSnapshot,placeNode} from '../web/creative_contract.mjs';
import {bindPanelContext,getPanelContext,publishPanelContext} from '../web/creative_panel_context.mjs';
import {publishInputExchange} from '../web/creative_input_exchange.mjs';

test('input exchange upgrades a legacy API without replacing adapters or panel context',()=>{
    const target=new EventTarget(),context=()=>({}),source={kind:'image',filename:'actual.png',type:'input'};
    target[API_KEY]=Object.freeze({version:1,registerAdapter,getPanelContext:context});
    const dispose=registerAdapter('legacy-upload',{matches:n=>n.type==='legacy-upload',assets:()=>({version:1,assets:[source]})});
    let ready=0;target.addEventListener('daelab:creative-canvas-ready',()=>ready++);
    publishInputExchange(target);
    assert.equal(target[API_KEY].registerAdapter,registerAdapter);
    assert.equal(target[API_KEY].getPanelContext,context);
    const result=target[API_KEY].inputSnapshot({type:'legacy-upload',mode:0});
    assert.deepEqual(result.assets,[source]);result.assets[0].filename='changed';assert.equal(source.filename,'actual.png');
    assert.equal(ready,1);dispose();
});
test('optional integrations register, dispose, and reject duplicate ownership',()=>{
    const target=new EventTarget();let ready=0;
    target.addEventListener('daelab:creative-canvas-ready',()=>ready++);
    publishAPI(target);assert.equal(ready,1);assert.equal(target[API_KEY].version,1);
    const adapter={matches:n=>n.type==='test.external',panel:n=>n.panel,menu:[{type:'test.external'}]};
    const dispose=target[API_KEY].registerAdapter('test',adapter);
    const node={type:'test.external',panel:{root:{}}};
    assert.equal(adapterFor(node).panel(node),node.panel);assert.equal(menuItems().length,1);
    assert.throws(()=>registerAdapter('test',adapter),/already registered/);
    dispose();dispose();assert.equal(adapterFor(node),undefined);assert.equal(menuItems().length,0);
    assert.throws(()=>publishAPI({[API_KEY]:{registerAdapter(){}}}),/second creative canvas owner/);
});
test('unsupported nodes stay outside the canvas without business packages',()=>{
    assert.equal(adapterFor({type:'DAELAB.LibTV.VideoGenerate'}),undefined);
});
test('input exchange is a detached snapshot and inactive providers are unavailable',()=>{
    const source={version:1,texts:['first']};const dispose=registerAdapter('snapshot-test',{matches:n=>n.type==='snapshot-test',inputSnapshot:()=>source});
    const result=inputSnapshot({type:'snapshot-test',mode:0});result.texts[0]='changed';assert.equal(source.texts[0],'first');
    assert.equal(inputSnapshot({type:'snapshot-test',mode:4}),null);assert.equal(inputSnapshot(null),null);dispose();
});
test('placement preserves unrelated canvas state and rejects nonfinite coordinates',()=>{
    const state={version:1,cards:{a:{x:1}},viewport:{zoom:.8}},node={id:2,graph:{extra:{daelabCreativeCanvasV1:state}}};
    assert.equal(placeNode(node,{x:20,y:30,width:700}),true);assert.equal(state.cards.a.x,1);assert.equal(state.viewport.zoom,.8);
    assert.equal(placeNode(node,{x:NaN,y:30,width:700}),false);assert.equal(state.cards[2].x,20);
});

test('panel context leases isolate instances and old releases cannot remove a replacement',()=>{
    const a={},b={},child={parentNode:a},ca={presentation:'content'},cb={presentation:'card'};
    assert.equal(getPanelContext(child),null);
    const releaseA=bindPanelContext(a,ca),releaseB=bindPanelContext(b,cb);
    assert.equal(getPanelContext(child),ca);assert.equal(getPanelContext(b),cb);
    const replacement={presentation:'content',fullHeight:true};
    const releaseReplacement=bindPanelContext(a,replacement);releaseA();
    assert.equal(getPanelContext(child),replacement);
    releaseReplacement();assert.equal(getPanelContext(child),null);
    assert.equal(getPanelContext(b),cb);releaseB();assert.equal(getPanelContext(b),null);
});

test('panel API extends the optional v1 registry and announces readiness',()=>{
    const target=new EventTarget();publishAPI(target);let ready=0;
    target.addEventListener('daelab:creative-canvas-ready',()=>{ready++;assert.equal(target[API_KEY].getPanelContext,getPanelContext);});
    publishPanelContext(target);assert.equal(ready,1);assert.equal(target[API_KEY].registerAdapter,registerAdapter);
    assert.throws(()=>publishPanelContext({}),/published first/);
});
