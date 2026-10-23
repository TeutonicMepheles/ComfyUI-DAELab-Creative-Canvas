import {collectionFor,GROUP_TYPE} from './material_group_model.mjs';
import {UPLOAD_TYPE,readAsset} from './media_upload_model.mjs';
import {inputSnapshot} from './creative_input_exchange.mjs';

// Snapshot transport only. Fill direction and repetition belong to consumers.
export function materialDropSnapshot(node){
    if(!node||node.mode)return null;
    if(node.type===GROUP_TYPE)return collectionFor(node);
    if(node.type===UPLOAD_TYPE){
        const asset=readAsset(node.widgets?.find(w=>w.name==='asset_data')?.value);
        return asset?{version:1,assets:[{...asset,nodeId:String(node.id)}]}:null;
    }
    const snapshot=inputSnapshot(node);
    return snapshot?.ready!==false&&snapshot?.texts?.some(text=>typeof text==='string'&&text.trim())&&!snapshot.assets?.length?snapshot:null;
}
export function acceptsMaterialDrop(target,snapshot){
    if(snapshot?.texts?.length)return target.accepts?.includes('text')===true;
    return !snapshot?.assets?.length||!target.accepts||snapshot.assets.every(asset=>asset.missing||target.accepts.includes(asset.kind));
}
export function materialDropCount(snapshot){return snapshot?.texts?.length||snapshot?.assets?.length||0;}
