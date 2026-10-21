// Shared graph/layout policy; no business state or panel access.
export function connectedOutputNode(source,type,index=0){
    for(const id of source.outputs?.[index]?.links||[]){
        const link=source.graph?.links[id],target=source.graph?.getNodeById(link?.target_id);
        if(link?.origin_id===source.id&&link.origin_slot===index&&target?.type===type&&!target.mode)return target;
    }
    return null;
}
export function outputPosition(source,cards,width=350,height=240){
    const x=source.x+source.width+80;let y=source.y;
    for(let i=0;i<=cards.length;i++){
        const collision=cards.find(c=>x<c.x+c.width+24&&x+width+24>c.x&&y<c.y+c.height+24&&y+height+24>c.y);
        if(!collision)return {x,y};
        y=collision.y+collision.height+40;
    }
    return {x,y};
}
