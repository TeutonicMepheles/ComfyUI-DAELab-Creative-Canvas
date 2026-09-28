import {zoomAt} from './creative_canvas_model.mjs';

export function wheelViewport(view,point,event,height=800){
    const unit=event.deltaMode===1?16:event.deltaMode===2?height:1;
    const dx=event.deltaX*unit,dy=event.deltaY*unit;
    if(event.ctrlKey)return zoomAt(view,point,Math.exp(-dy*.001));
    if(event.shiftKey)return {...view,x:view.x-(dy||dx)};
    return {...view,x:view.x-dx,y:view.y-dy};
}
export const CLIPBOARD_KIND='DAELAB.CreativeNode.v1';
export function copySnapshot(node,layout){
    const data=JSON.parse(JSON.stringify(node.serialize()));
    delete data.id;
    for(const input of data.inputs||[])input.link=null;
    for(const output of data.outputs||[])output.links=null;
    return {kind:CLIPBOARD_KIND,node:data,layout:{width:layout.width,expanded:layout.expanded}};
}
export function readSnapshot(text){
    try{const value=JSON.parse(text);return value?.kind===CLIPBOARD_KIND&&typeof value.node?.type==='string'?value:null;}catch{return null;}
}
