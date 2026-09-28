import test from 'node:test';
import assert from 'node:assert/strict';
import {bindPanelAvailability} from '../web/creative_panel_state.mjs';
test('availability isolates two panels, pauses media, restores state, and releases timers',t=>{
    const callbacks=new Set();
    t.mock.method(globalThis,'setInterval',fn=>{callbacks.add(fn);return fn;});
    t.mock.method(globalThis,'clearInterval',fn=>callbacks.delete(fn));
    let pauses=0;
    const make=()=>({hidden:false,inert:false,querySelectorAll:()=>[{pause:()=>pauses++}]});
    const a={mode:0},b={mode:0},pa=make(),pb=make();
    const releaseA=bindPanelAvailability(a,pa),releaseB=bindPanelAvailability(b,pb);
    for(const mode of [2,4]){
        a.mode=mode;callbacks.forEach(fn=>fn());assert.ok(pa.hidden&&pa.inert);assert.equal(pb.hidden,false);
        a.mode=0;callbacks.forEach(fn=>fn());assert.equal(pa.hidden,false);assert.equal(pa.inert,false);
    }
    assert.equal(pauses,2);releaseA();assert.equal(callbacks.size,1);releaseB();assert.equal(callbacks.size,0);
});
