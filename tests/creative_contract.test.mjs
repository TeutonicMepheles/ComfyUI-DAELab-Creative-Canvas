import test from 'node:test';
import assert from 'node:assert/strict';
import {registerAdapter,adapterFor,menuItems,publishAPI,API_KEY} from '../web/creative_contract.mjs';
import {bindPanelContext,getPanelContext,publishPanelContext} from '../web/creative_panel_context.mjs';
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
