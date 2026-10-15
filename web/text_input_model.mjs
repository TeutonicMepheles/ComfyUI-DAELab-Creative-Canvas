const resolving=new Set();
export function textSnapshot(node,read){
    if(node.mode||resolving.has(node))return {version:1,ready:false,texts:[]};
    const input=node.inputs?.find(i=>i.name==='text');
    if(input?.link==null)return {version:1,texts:[String(node.widgets?.find(w=>w.name==='text')?.value??'')]};
    const link=node.graph?.links[input.link],source=node.graph?.getNodeById(link?.origin_id);
    if(!source||source.mode)return {version:1,ready:false,texts:[]};
    resolving.add(node);
    try{
        const snapshot=read(source);
        if(snapshot?.ready===false)return {version:1,ready:false,texts:[]};
        if(snapshot?.texts)return {version:1,texts:[snapshot.texts.join('\n\n')]};
        const value=source.getOutputData?.(link.origin_slot);
        return typeof value==='string'?{version:1,texts:[value]}:{version:1,ready:false,texts:[]};
    }catch{return {version:1,ready:false,texts:[]};}
    finally{resolving.delete(node);}
}
