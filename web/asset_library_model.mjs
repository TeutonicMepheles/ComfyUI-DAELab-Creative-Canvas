// Browser-local metadata only. No node, DOM, business package, or remote URL ownership.
export const LIBRARY_KEY='DAELAB.CreativeCanvas.AssetLibrary.v1';
export const LIBRARY_EVENT='daelab:asset-library-changed';
export const MAX_ENTRIES=2000;
const clone=value=>JSON.parse(JSON.stringify(value));
export function normalizeAsset(input){
    if(!input||typeof input!=='object')throw new Error('无效素材');
    const name=String(input.name||'未命名素材').trim().slice(0,240)||'未命名素材';
    if(input.kind==='text'){
        if(typeof input.text!=='string'||!input.text.trim())throw new Error('空文本不能收藏');
        if(input.text.length>100000)throw new Error('文本过长，请拆分后收藏');
        return {kind:'text',name,text:input.text};
    }
    const a=input.asset||input;
    const filename=a.filename,subfolder=a.subfolder||'',type=a.type||'input';
    if(typeof filename!=='string'||!filename||filename.length>512||/[\\/\x00]/.test(filename)||filename==='..')throw new Error('素材文件名无效');
    if(typeof subfolder!=='string'||subfolder.length>1024||subfolder.startsWith('/')||/[\\:\x00]/.test(subfolder)||subfolder.split('/').includes('..'))throw new Error('素材目录无效');
    if(!['input','output'].includes(type))throw new Error('只支持本地输入或输出素材');
    const kind=/\.(png|jpe?g|webp)$/i.test(filename)?'image':/\.(mp4|webm|mov)$/i.test(filename)?'video':null;
    if(!kind||kind!==a.kind)throw new Error('不支持的素材格式');
    return {kind,name,asset:{version:1,kind,name,filename,subfolder:subfolder==='.'?'':subfolder,type}};
}
export function assetKey(input){const a=normalizeAsset(input);return JSON.stringify(a.kind==='text'?['text',a.text]:[a.kind,a.asset.type,a.asset.subfolder,a.asset.filename]);}
export function readLibrary(storage=globalThis.localStorage){
    const raw=storage.getItem(LIBRARY_KEY);if(!raw)return [];
    let data;try{data=JSON.parse(raw);}catch{throw new Error('收藏目录无法读取；原数据已保留，请勿清除站点数据');}
    if(data?.version!==1||!Array.isArray(data.entries))throw new Error('收藏目录版本不兼容，原数据已保留');
    const seen=new Set();
    return data.entries.map(entry=>{
        const a=normalizeAsset(entry),key=assetKey(a);
        if(typeof entry.id!=='string'||!entry.id||seen.has(key))throw new Error('收藏目录格式异常，原数据已保留');
        seen.add(key);return {...a,id:entry.id,createdAt:Number(entry.createdAt)||0};
    });
}
export function writeLibrary(entries,storage=globalThis.localStorage){
    if(entries.length>MAX_ENTRIES)throw new Error('收藏已达 2000 项，请先整理资产库');
    try{storage.setItem(LIBRARY_KEY,JSON.stringify({version:1,entries}));}
    catch{throw new Error('收藏保存失败，浏览器存储不可用或已满');}
}
export async function mutateLibrary(update,{storage=globalThis.localStorage,target=globalThis}={}){
    const run=()=>{const entries=readLibrary(storage),next=update(clone(entries));writeLibrary(next,storage);target.dispatchEvent?.(new Event(LIBRARY_EVENT));return clone(next);};
    return target.navigator?.locks?target.navigator.locks.request(LIBRARY_KEY,run):run();
}
export function saveFavorite(input,options){
    const a=normalizeAsset(input),key=assetKey(a);
    return mutateLibrary(entries=>entries.some(e=>assetKey(e)===key)?entries:[{...a,id:crypto.randomUUID(),createdAt:Date.now()},...entries],options);
}
export function removeFavorite(id,options){return mutateLibrary(entries=>entries.filter(e=>e.id!==id),options);}
export function subscribeLibrary(listener,target=globalThis){
    const storage=e=>{if(e.key===LIBRARY_KEY||e.key===null)listener();};
    target.addEventListener(LIBRARY_EVENT,listener);target.addEventListener('storage',storage);
    return ()=>{target.removeEventListener(LIBRARY_EVENT,listener);target.removeEventListener('storage',storage);};
}
