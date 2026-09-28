import {UPLOAD_TYPE,readAsset} from './media_upload_model.mjs';

export const GROUP_TYPE='DAELAB.MaterialGroup';
export const GROUP_SOCKET='DAELAB_ASSETS';
export function collectionFor(group){
    return {version:1,assets:(group.properties.members||[]).map(id=>{
        const node=group.graph?.getNodeById(id);
        const asset=node?.type===UPLOAD_TYPE?readAsset(node.widgets?.find(w=>w.name==='asset_data')?.value):null;
        if(!asset)return {nodeId:String(id),missing:true};
        return {...asset,nodeId:String(id)};
    })};
}
export function expandGroupSelection(graph,ids){
    const result=new Set(ids);
    for(const id of ids){const node=graph.getNodeById(id);if(node?.type===GROUP_TYPE)for(const member of node.properties.members||[])result.add(member);}
    return result;
}
export function remapGroupMembers(nodes,mapping){
    for(const node of nodes)if(node.type===GROUP_TYPE)node.properties.members=(node.properties.members||[]).flatMap(id=>mapping.has(id)?[mapping.get(id).id]:[]);
}
// Keep reviewed layouts while replacing the non-executable prototype identity.
export function migrateGroups(data){
    const reviewInputs=new Map();
    for(const node of data?.nodes||[]){
        const indices=(node.inputs||[]).flatMap((input,i)=>input.type==='DAELAB_REVIEW_ASSETS'?[i]:[]);
        if(indices.length){reviewInputs.set(node.id,new Set(indices));node.inputs=node.inputs.filter((_,i)=>!indices.includes(i));}
    }
    // The prototype added a fake input to tables. It was never an executable
    // table contract. Retain table content, not that temporary socket/link.
    if(data?.links)data.links=data.links.filter(link=>!Array.isArray(link)||!reviewInputs.get(link[3])?.has(link[4]));
    const liveLinks=new Set((data?.links||[]).map(link=>Array.isArray(link)?link[0]:link.id));
    for(const node of data?.nodes||[])if(node.type==='DAELAB.GroupReviewDemo'){
        node.type=GROUP_TYPE;node.widgets_values=['{"version":1,"assets":[]}'];
        for(const output of node.outputs||[]){output.type=GROUP_SOCKET;output.links=output.links?.filter(id=>liveLinks.has(id))||null;}
    }
    for(const link of data?.links||[])if(Array.isArray(link)&&link[5]==='DAELAB_REVIEW_ASSETS')link[5]=GROUP_SOCKET;
    delete data?.extra?.daelabGroupReviewDemoV1;
}

export function suppressGroupSlots(graph,node,selected){
    const groups=(graph._nodes||[]).filter(n=>n.type===GROUP_TYPE);
    if(node.type===GROUP_TYPE)return !node.properties.collapsed&&(node.properties.members||[]).some(id=>selected.has(id));
    const owner=groups.find(g=>(g.properties.members||[]).includes(node.id));
    return !!owner&&(!!owner.properties.collapsed||!selected.has(node.id));
}
