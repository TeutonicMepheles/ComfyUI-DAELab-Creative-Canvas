import {adapterFor} from './creative_contract.mjs';
export const STATE_KEY = 'daelabCreativeCanvasV1';
export function supportedNode(node) {
    return !!adapterFor(node);
}
export function canvasState(graph) {
    graph.extra ||= {};
    const state = graph.extra[STATE_KEY] ||= {version:1, active:false, viewport:{x:60,y:60,zoom:0.8}, cards:{}};
    state.cards ||= {};
    state.viewport = normalizeViewport(state.viewport);
    return state;
}
export function normalizeViewport(v={}) {
    return {x:Number.isFinite(v.x)?v.x:60,y:Number.isFinite(v.y)?v.y:60,zoom:Math.min(2,Math.max(0.15,Number(v.zoom)||0.8))};
}
export function zoomAt(v, point, factor) {
    const zoom = normalizeViewport({...v,zoom:v.zoom*factor}).zoom;
    return {x:point.x-(point.x-v.x)*zoom/v.zoom,y:point.y-(point.y-v.y)*zoom/v.zoom,zoom};
}
export const workspaceNode = type => !!adapterFor({type})?.workspace?.({type});
export const cardWidth = type => { const width=adapterFor({type})?.width; return (typeof width==='function'?width({type}):width)||460; };
export function cardState(state,node,index=0) {
    if(workspaceNode(node.type) && state.cards[node.id]) state.cards[node.id].width=Math.max(cardWidth(node.type),state.cards[node.id].width||0);
    return state.cards[node.id] ||= {x:index%3*530,y:Math.floor(index/3)*440,width:cardWidth(node.type),expanded:typeof adapterFor(node)?.expanded==='function'?adapterFor(node).expanded(node):!!adapterFor(node)?.expanded};
}
export function socketCompatible(output,input) {
    const a=String(output),b=String(input);
    return a==='*'||b==='*'||a.split(',').some(t=>b.split(',').includes(t));
}
export function graphLinks(graph) {
    const links=graph.links;
    return links?.values ? [...links.values()] : Object.values(links||{});
}
export function localOutputPreview(message) {
    const url=message?.output?.find?.(u=>typeof u==='string'&&u.startsWith('/view?'));
    if(!url)return null;
    const params=new URL(url,'http://localhost').searchParams;
    if(params.get('type')!=='output')return null;
    const file=params.get('filename')||'';
    const kind=/\.(mp4|webm|mov)$/i.test(file)?'video':/\.(png|jpe?g|webp|gif)$/i.test(file)?'image':null;
    return kind?{url,kind}:null;
}
