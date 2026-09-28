// Optional compatibility adapter: public widgets and execution events only.
// Never imports, modifies on disk, or replaces ComfyTV's node registrations.
import {registerAdapter} from '../creative_contract.mjs';
import {localOutputPreview} from '../creative_canvas_model.mjs';
export function installComfyTVAdapter(app) {
    registerAdapter('comfytv.compatibility', {
        matches: node => node.type?.startsWith('ComfyTV.'),
        width: node => node.type === 'ComfyTV.StoryboardEditorStage' ? 1200 : 460,
        workspace: node => node.type === 'ComfyTV.StoryboardEditorStage',
        panel: node => ({root:node.widgets?.map(w=>w.element||w.inputEl).find(e=>e?.classList?.contains('comfytv-root'))}),
        preview: node => node.properties?.daelabCreativePreview || {url:node.widgets?.find(w=>w.name==='asset_url')?.value},
        menu:[{label:'剪辑',type:'ComfyTV.VideoClipStage',icon:'scissors-cut-line'}, {label:'故事板',type:'ComfyTV.StoryboardEditorStage',icon:'layout-grid-line'}],
    });
    app.registerExtension({name:'DAELAB.CreativeCanvas.ComfyTVAdapter', beforeRegisterNodeDef(type,data){
        if(!data.name.startsWith('ComfyTV.'))return;
        const previous=type.prototype.onExecuted;
        type.prototype.onExecuted=function(message){
            const result=previous?.apply(this,arguments),preview=localOutputPreview(message);
            if(preview){this.properties||={};this.properties.daelabCreativePreview=preview;}
            return result;
        };
    }});
}
