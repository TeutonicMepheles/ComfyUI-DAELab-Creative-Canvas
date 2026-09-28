import {UPLOAD_TYPE,readAsset,slotAllowed} from './media_upload_model.mjs';
import {socketCompatible} from './creative_canvas_model.mjs';

// A virtual canvas socket projects the existing typed outputs without changing
// serialized graph slots. Each real link therefore remains independently typed.
export const MATERIAL_SLOT=-1;
export const unifiedNode=node=>node.type?.startsWith('DAELAB.');
export const inputSlots=node=>(node.inputs||[]).flatMap((p,i)=>p.widget&&p.link==null?[]:[i]);
export function uploadKind(node){return readAsset(node.widgets?.find(w=>w.name==='asset_data')?.value)?.kind;}
export function sourceSlots(node,index){
    if(index!==MATERIAL_SLOT)return node.outputs?.[index]?[index]:[];
    return (node.outputs||[]).flatMap((_,i)=>node.type!==UPLOAD_TYPE||slotAllowed(uploadKind(node),i)?[i]:[]);
}
export function resolveOutput(node,index,inputType){
    if(inputType==null)return -1;
    const slots=sourceSlots(node,index);
    return slots.find(i=>node.outputs[i].type===inputType)??slots.find(i=>socketCompatible(node.outputs[i].type,inputType))??-1;
}
export function targetChoices(source,index,target){
    if(source===target)return [];
    return (target.inputs||[]).flatMap((input,i)=>input.widget&&input.link==null?[]:
        resolveOutput(source,index,input.type)>=0?[{index:i,name:input.label||input.localized_name||input.name,type:input.type}]:[]);
}
export function outputSelector(node,index){return `[data-side=output][data-slot="${unifiedNode(node)?MATERIAL_SLOT:index}"]`;}
export function inputSelector(node,index){return `[data-side=input][data-slot="${unifiedNode(node)?MATERIAL_SLOT:index}"]`;}
