import test from 'node:test';
import assert from 'node:assert/strict';
import {installComfyTVAdapter} from '../web/adapters/comfytv.mjs';
import {adapterFor,menuItems} from '../web/creative_contract.mjs';

test('legacy ComfyTV workflows retain their panel without a new-storyboard shortcut',()=>{
    installComfyTVAdapter({registerExtension(){}});
    const root={classList:{contains:name=>name==='comfytv-root'}};
    const node={type:'ComfyTV.StoryboardEditorStage',widgets:[{element:root}]};
    assert.equal(adapterFor(node).panel(node).root,root);
    assert.equal(adapterFor(node).workspace(node),true);
    assert.equal(menuItems().some(item=>item.type===node.type),false);
    assert.equal(adapterFor({type:'DAELAB.ScriptParser'}),undefined);
});
