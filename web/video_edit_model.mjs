export const EDIT_TYPE='DAELAB.VideoEdit';
export const PREVIEW_SCALES=[0.5,0.75,1];
export const emptyEdit=()=>({version:1,clips:[],fit:'contain'});
export function readEdit(raw){
    const data=JSON.parse(raw||JSON.stringify(emptyEdit()));
    if(data.version!==1||!Array.isArray(data.clips))throw new Error('剪辑数据格式无效');
    return data;
}
export const timelineFps=clips=>clips[0]?.asset.fps||24;
export const snapFrame=(time,fps)=>Math.round(time*fps)/fps;
export function spans(clips){const fps=timelineFps(clips);let duration=0,frame=0;return clips.map(clip=>{const start=frame/fps;duration+=clip.duration;frame=Math.max(frame+1,Math.round(duration*fps));return {clip,start,end:frame/fps};});}
export const totalTime=clips=>spans(clips).at(-1)?.end||0;
export function locate(clips,time){const list=spans(clips);return list.find(s=>time<s.end-1e-8)||list.at(-1)||null;}
export function createTimelineIndex(clips){
    const list=spans(clips);
    return {spans:list,total:list.at(-1)?.end||0,at(time){
        let left=0,right=list.length;
        while(left<right){const middle=(left+right)>>>1;if(time<list[middle].end-1e-8)right=middle;else left=middle+1;}
        return list[Math.min(left,list.length-1)]||null;
    }};
}
export function newClip(asset,source={asset},id=crypto.randomUUID()){
    if(source.asset)source={asset:{filename:source.asset.filename,subfolder:source.asset.subfolder||'',type:source.asset.type||'input'}};
    return {id,source,asset,start:0,duration:asset.kind==='image'?3:asset.duration,mute:false};
}
export const isGroupSlot=slot=>slot==='assets'||!!slot?.startsWith('groups.');
export const sourceSlotKey=source=>source.slot?.startsWith('groups.')&&source.groupId!=null?'groups:'+source.groupId:source.slot;
export const sourceKey=(asset,source)=>JSON.stringify([sourceSlotKey(source),source.assetId,asset.type||'input',asset.subfolder||'',asset.filename,...(isGroupSlot(source.slot)&&source.nodeId!=null?[String(source.nodeId)]:[])]);
export function remapEditSources(edit,mapping){
    const ids=new Map([...mapping].map(([id,node])=>[String(id),String(node.id)]));
    const remap=id=>ids.get(String(id))??id;
    const clips=edit.clips.map(clip=>{
        const source={...clip.source};
        if(source.nodeId!=null)source.nodeId=remap(source.nodeId);
        if(source.groupId!=null)source.groupId=remap(source.groupId);
        return {...clip,source};
    });
    // Include keys for deleted clips so reconnecting copied groups cannot revive them.
    const sources=edit.sources?.map(key=>{
        const parts=JSON.parse(key),slot=parts[0];
        if(slot?.startsWith('groups:'))parts[0]='groups:'+remap(slot.slice(7));
        if((isGroupSlot(slot)||slot?.startsWith('groups:'))&&parts[5]!=null)parts[5]=remap(parts[5]);
        return JSON.stringify(parts);
    });
    return {...edit,clips,...(sources?{sources}:{})};
}
export function connectedEdit(edit,assets){
    if(!assets.length&&!edit.sources?.length&&!edit.clips.some(c=>c.source.slot))return edit;
    const members=new Map(assets.filter(item=>isGroupSlot(item.source.slot)&&item.source.nodeId).map(item=>[item.source.nodeId,item]));
    const replacements=new Map();
    for(const item of assets){
        if(isGroupSlot(item.source.slot))continue;
        const member=members.get(item.source.nodeId);
        if(member&&sourceKey(item.asset,{})===sourceKey(member.asset,{}))replacements.set(sourceKey(item.asset,item.source),member);
    }
    const incoming=new Map(assets.filter(item=>!replacements.has(sourceKey(item.asset,item.source))).map(item=>[sourceKey(item.asset,item.source),item]));
    // Saved source keys used only the asset ID; keep existing edits and deletions when upgrading.
    const savedKeys=new Map();
    for(const {asset,source} of [...assets,...edit.clips])if(source.slot==='assets'&&source.nodeId!=null)savedKeys.set(sourceKey(asset,{...source,nodeId:undefined}),sourceKey(asset,source));
    const previous=new Set((edit.sources||edit.clips.filter(c=>c.source.slot).map(c=>sourceKey(c.asset,c.source))).map(key=>{
        key=savedKeys.get(key)??key;
        const member=replacements.get(key);return member?sourceKey(member.asset,member.source):key;
    }));
    const clips=edit.clips.map(clip=>{
        const key=sourceKey(clip.asset,clip.source),member=replacements.get(key)||incoming.get(savedKeys.get(key))||(isGroupSlot(clip.source.slot)&&incoming.get(key));
        return member?{...clip,asset:member.asset,source:member.source}:clip;
    }).filter(c=>!c.source.slot||incoming.has(sourceKey(c.asset,c.source)));
    for(const [key,{asset,source}] of incoming)if(!previous.has(key))clips.push(newClip(asset,source));
    return {...edit,clips,sources:[...incoming.keys()]};
}
export function resizeClip(clip,edge,delta,fps=clip.asset.fps||24){
    const frame=1/fps;
    if(clip.asset.kind==='image')return {...clip,duration:Math.max(frame,snapFrame(clip.duration+(edge==='left'?-delta:delta),fps))};
    const end=clip.start+clip.duration;
    if(edge==='left'){const start=Math.max(0,Math.min(end-frame,snapFrame(clip.start+delta,fps)));return {...clip,start,duration:end-start};}
    return {...clip,duration:Math.max(frame,Math.min(clip.asset.duration-clip.start,snapFrame(clip.duration+delta,fps)))};
}
export function splitClip(clips,time,id=crypto.randomUUID()){
    const fps=timelineFps(clips);time=snapFrame(time,fps);
    const span=locate(clips,time);if(!span)return clips;
    const offset=time-span.start;if(offset<1/fps-1e-8||span.clip.duration-offset<1/fps-1e-8)return clips;
    return clips.flatMap(clip=>clip!==span.clip?[clip]:[
        {...clip,duration:offset},
        {...clip,id,start:clip.asset.kind==='video'?clip.start+offset:0,duration:clip.duration-offset},
    ]);
}
export function moveClip(clips,id,index){const next=clips.filter(c=>c.id!==id),clip=clips.find(c=>c.id===id);if(clip)next.splice(Math.max(0,Math.min(index,next.length)),0,clip);return next;}
export function formatTime(time){const value=Math.max(0,time||0);return `${Math.floor(value/60).toString().padStart(2,'0')}:${(value%60).toFixed(2).padStart(5,'0')}`;}
export function formatFrame(time,fps){const frame=Math.max(0,Math.round(time*fps)),rate=Math.round(fps),seconds=Math.floor(frame/rate);return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}:${(frame%rate).toString().padStart(2,'0')}`;}
export function localAsset(url){
    if(typeof url!=='string'||!url.startsWith('/view?'))throw new Error('请先运行上游节点，获取本地素材');
    return Object.fromEntries(new URLSearchParams(url.slice(6)));
}
