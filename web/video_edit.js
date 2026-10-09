import {app} from '/scripts/app.js';
import {api} from '/scripts/api.js';
import {registerAdapter,adapterFor} from './creative_contract.mjs';
import {canvasHistory} from './creative_history.mjs?v=20261002-edit-undo';
import {bindPanelAvailability} from './creative_panel_state.mjs';
import {EDIT_TYPE,readEdit,localAsset,isGroupSlot,sourceSlotKey,remapEditSources} from './video_edit_model.mjs?v=20261004-copy-sources';
import {createVideoEditor} from './video_edit_panel.mjs?v=20261002-edit-undo';

const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./video_edit.css?v=20261001-timeline-background2',import.meta.url).href;document.head.append(sheet);
const resultFor=node=>node.properties?.daelabEditResultData===node.widgets?.find(w=>w.name==='edit_data')?.value?node.properties?.daelabEditResult:null;
const workflowPlayheads=new WeakMap();
function canConnectOutput(node){
    if(resultFor(node))return true;
    app.extensionManager.toast.add({severity:'warn',summary:'暂不能连接',detail:'请先成功导出当前剪辑，再连接下游节点。',life:3500});
    return false;
}
async function request(path,data,signal){const response=await api.fetchApi(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal});const result=await response.json();if(!response.ok)throw new Error(result.error?.message||result.error||'处理失败，请重试');return result;}
function install(node){
    if(node.__videoEdit)return;
    const widget=node.widgets.find(w=>w.name==='edit_data'),history=canvasHistory(app);
    widget.hidden=true;widget.options={...widget.options,hidden:true};widget.computeSize=()=>[0,-4];if(widget.inputEl)widget.inputEl.style.display='none';
    let exportTask=null;const operations=new Map();
    let disposed=false,job=null,sourceSignature=null,sourceSync=null,syncTimer=null,playhead=null,playheadWorkflow=null;
    async function mediaTask(id,label,detail,path,data,signal){
        const task={id,label,detail,state:'running',startedAt:Date.now(),elapsed:true,order:id==='edit-preview'?60:50};operations.set(id,task);
        try{const result=await request(path,data,signal);if(!disposed&&operations.get(id)===task){if(signal?.aborted)operations.delete(id);else operations.set(id,{...task,state:'success',detail:'准备完成',finishedAt:Date.now()});}return result;}
        catch(error){if(!disposed&&operations.get(id)===task){if(signal?.aborted)operations.delete(id);else operations.set(id,{...task,state:'error',detail:error.message});}throw error;}
    }
    function bindPlayhead(){
        const workflow=app.extensionManager?.workflow?.activeWorkflow;
        if(!workflow||!node.graph)return;
        let positions=workflowPlayheads.get(workflow);
        if(!positions){positions=new Map();workflowPlayheads.set(workflow,positions);}
        const key=JSON.stringify([node.graph.id,node.id]);
        if(!positions.has(key))positions.set(key,{time:0});
        playhead=positions.get(key);
        playheadWorkflow=workflow;
    }
    const dirty=()=>{node.graph?.change?.();node.graph?.setDirtyCanvas?.(true,true);};
    const panel=createVideoEditor({
        read:()=>readEdit(widget.value),view:()=>node.properties.daelabEditView||{},
        isSelected:()=>app.canvas?.selected_nodes?.[node.id]===node,
        savePlayhead(time){if(disposed||app.configuringGraph)return;if(!playhead)bindPlayhead();if(playhead&&playheadWorkflow===app.extensionManager?.workflow?.activeWorkflow)playhead.time=time;},
        write(data,sync=false){
            const previous=readEdit(widget.value),used=new Set(data.clips.map(c=>sourceSlotKey(c.source)).filter(Boolean));
            const removed=new Set(previous.clips.map(c=>sourceSlotKey(c.source)).filter(slot=>slot&&!used.has(slot)));
            const grouped=new Set(data.clips.filter(c=>isGroupSlot(c.source.slot)).map(c=>c.source.nodeId).filter(Boolean));
            const linked=node.inputs.filter(input=>input.link!=null).map(input=>{
                const link=node.graph.links.get?.(input.link)||node.graph.links[input.link];
                return {input,originId:String(link.origin_id),key:sourceSlotKey({slot:input.name,groupId:String(link.origin_id)})};
            });
            for(const {input,originId,key} of linked){
                if(isGroupSlot(input.name)||used.has(key))continue;
                if(grouped.has(originId))removed.add(key);
            }
            if(removed.size&&data.sources)data={...data,sources:data.sources.filter(key=>!removed.has(JSON.parse(key)[0]))};
            const save=()=>{
                const value=JSON.stringify(data);
                if(value!==widget.value){delete node.properties.daelabEditResult;delete node.properties.daelabEditResultData;panel.output(null);}
                widget.value=value;widget.callback?.(widget.value);
                for(const {input,key} of linked)if(removed.has(key)){const index=node.inputs.indexOf(input);if(index>=0)node.disconnectInput(index);}
                dirty();
            };
            if(sync)history.amend(save);
            else{history.begin();try{save();}finally{history.end();}}
            return data;
        },
        saveView(value){node.properties.daelabEditView=value;dirty();},
        inspect:(asset,signal)=>mediaTask('edit-sources','素材读取','读取连接素材','/daelab/edit/media',{asset},signal),
        proxy:(asset,scale,signal)=>mediaTask('edit-preview','预览准备',`准备 ${scale}× 预览`,'/daelab/edit/preview',{asset,scale},signal),
        async exportVideo(){
            if(job||disposed)return;
            const task=job={id:null,cancelled:false,cancelling:false};exportTask={id:'edit-export',label:'成片导出',state:'running',detail:'准备导出',order:40};
            try{
                const prompt=await app.graphToPrompt(),output={},target=String(node.id);
                if(disposed||task.cancelled)return;
                panel.running(true,'准备导出…');
                const include=id=>{if(output[id])return;const n=prompt.output[id];if(!n)throw new Error('节点未参与执行，请切回启用模式');output[id]=n;for(const value of Object.values(n.inputs))if(Array.isArray(value)&&value.length===2&&prompt.output[String(value[0])])include(String(value[0]));};include(target);
                const submittedEdit=output[target].inputs.edit_data;
                const result=await api.queuePrompt(0,{output,workflow:prompt.workflow});
                task.id=result.prompt_id;
                if(disposed||task.cancelled){await request('/api/jobs/'+encodeURIComponent(task.id)+'/cancel',{});return;}
                panel.running(true,'等待导出…');exportTask={...exportTask,state:'queued',detail:'等待导出'};
                while(job===task&&!disposed&&!task.cancelled){
                    const response=await api.fetchApi('/history/'+encodeURIComponent(task.id));
                    if(job!==task||disposed||task.cancelled)return;
                    if(!response.ok)throw new Error('无法读取导出状态');
                    const history=await response.json();
                    if(job!==task||disposed||task.cancelled)return;
                    const item=history[task.id];
                    if(item){
                        if(item.status?.status_str==='error'){const failure=item.status.messages?.find(([type])=>type==='execution_error');throw new Error(failure?.[1]?.exception_message||'导出已取消');}
                        const ref=item.outputs?.[target]?.videos?.[0];if(ref)node.__videoEdit.output('/view?'+new URLSearchParams(ref),submittedEdit);else {panel.error('导出已取消');exportTask={...exportTask,state:'cancelled',detail:'导出已取消',finishedAt:Date.now()};}
                        break;
                    }
                    await new Promise(resolve=>setTimeout(resolve,600));
                }
            }catch(error){if(job===task&&!disposed){exportTask={...exportTask,state:'error',detail:error.message};throw error;}}
            finally{if(job===task){job=null;if(!disposed)panel.running(false,task.cancelled?'导出已取消':'');}}
        },
        async cancelExport(){
            const task=job;if(!task||task.cancelling||task.cancelled)return;
            if(!task.id){exportTask={...exportTask,state:'cancelled',detail:'导出已取消',finishedAt:Date.now()};task.cancelled=true;panel.running(true,'正在取消导出…');return;}
            task.cancelling=true;
            try{
                await request('/api/jobs/'+encodeURIComponent(task.id)+'/cancel',{});
                if(job!==task||disposed)return;
                exportTask={...exportTask,state:'cancelled',detail:'导出已取消',finishedAt:Date.now()};task.cancelled=true;job=null;panel.running(false,'导出已取消');
            }catch(error){if(job===task&&!disposed)throw error;}
            finally{task.cancelling=false;}
        },
    });
    function connected(){
        const assets=[];
        for(const input of node.inputs||[]){
            if(input.link==null||input.widget)continue;
            const link=node.graph.links.get?.(input.link)||node.graph.links[input.link],source=node.graph.getNodeById(link.origin_id),adapter=adapterFor(source);
            const collection=adapter?.assets?.(source);
            if(collection?.ready===false)throw new Error('请先导出上游节点的最新成片');
            if(collection){for(const asset of collection.assets)assets.push({...asset,editSource:isGroupSlot(input.name)?{slot:input.name,groupId:String(source.id),assetId:asset.id,nodeId:asset.nodeId}:{slot:input.name,nodeId:String(source.id)}});}
            else{const preview=adapter?.preview?.(source);assets.push({...localAsset(preview?.url),editSource:{slot:input.name,nodeId:String(source.id)}});}
        }
        return {version:1,assets};
    }
    function syncConnections(){
        const workflow=app.extensionManager?.workflow?.activeWorkflow,tracker=workflow?.changeTracker;
        if(disposed||!node.graph||app.configuringGraph||tracker?._restoringState||tracker?.changeCount>0)return;
        if(!playhead||playheadWorkflow!==app.extensionManager?.workflow?.activeWorkflow){bindPlayhead();panel.reload(playhead?.time);}
        try{
            const collection=connected(),signature=JSON.stringify(collection);
            if(signature===(sourceSync?.signature??sourceSignature))return;
            const sync=sourceSync={signature};sourceSignature=null;
            panel.syncSources(collection,()=>!disposed&&sourceSync===sync&&!app.configuringGraph&&!tracker?._restoringState&&!(tracker?.changeCount>0)&&app.extensionManager?.workflow?.activeWorkflow===workflow&&signature===JSON.stringify(connected())).then(()=>{
                if(disposed||sourceSync!==sync)return;
                sourceSignature=signature;sourceSync=null;
            },error=>{
                if(disposed||sourceSync!==sync)return;
                sourceSync=null;if(error.name!=='AbortError')panel.error(error.message);
            });
        }catch(error){sourceSync=null;sourceSignature=null;panel.cancelSourceSync();panel.error(error.message);}
    }
    syncTimer=setInterval(syncConnections,400);
    const availability=bindPanelAvailability(node,panel.root);
    const dom=node.addDOMWidget('video_edit','custom',panel.root,{serialize:false,hideOnZoom:false,getValue:()=>'',setValue:()=>{},getMinHeight:()=>660});dom.serialize=false;
    const progress=e=>{if(job?.id&&!job.cancelled&&e.detail.prompt_id===job.id&&String(e.detail.node)===String(node.id)){const percent=e.detail.max>0?e.detail.value/e.detail.max*100:undefined;exportTask={...exportTask,state:'running',detail:'正在导出',progress:percent};panel.running(true,percent===undefined?'正在导出':`正在导出 ${Math.round(percent)}%`);}};api.addEventListener('progress',progress);
    node.__videoEdit={...panel,tasks:()=>disposed?[]:[...(exportTask?[{...exportTask}]:[]),...[...operations.values()].map(t=>({...t}))],syncConnections,
        output(url,data){
            if(data!==widget.value){panel.error('剪辑已更新，请重新导出成片');if(exportTask)exportTask={...exportTask,state:'recovery',detail:'剪辑已变化，请重新导出',progress:undefined};return;}
            if(exportTask)exportTask={...exportTask,state:'success',detail:'导出完成',progress:undefined,finishedAt:Date.now()};node.properties.daelabEditResult=url;node.properties.daelabEditResultData=data;panel.output(url);dirty();
        },
        reload(){sourceSync=null;sourceSignature=null;bindPlayhead();panel.reload(playhead?.time);panel.output(resultFor(node));},
        destroy(){disposed=true;sourceSync=null;clearInterval(syncTimer);if(job?.id)void request('/api/jobs/'+encodeURIComponent(job.id)+'/cancel',{}).catch(()=>{});job=null;api.removeEventListener('progress',progress);availability();panel.destroy();}};
    node.setSize([820,760]);if(resultFor(node))panel.output(resultFor(node));
}
registerAdapter('daelab.video-edit',{
    matches:node=>node.type===EDIT_TYPE,width:840,expanded:true,floatingHeader:true,collapsible:false,inputSelection:'first-free',outputLabel:'剪辑成片',
    menu:[{label:'剪辑',type:EDIT_TYPE,icon:'scissors-cut-line'}],
    tasks:node=>node.__videoEdit?.tasks()||[],
    panel:node=>node.__videoEdit,preview:node=>({url:resultFor(node),kind:'video'}),
    summary:node=>`${readEdit(node.widgets?.find(w=>w.name==='edit_data')?.value).clips.length} 个片段`,
    materialOutput:true,
    assets:node=>{const url=resultFor(node);return {version:1,ready:!!url,assets:url?[{...localAsset(url),url,kind:'video',name:'剪辑结果.mp4'}]:[]};},
    canConnectOutput,
    inputLabels:{assets:'素材组'},
    remapCopy(node,mapping){
        const widget=node.widgets.find(w=>w.name==='edit_data'),previous=widget.value;
        widget.value=JSON.stringify(remapEditSources(readEdit(previous),mapping));
        // Identity changes do not alter the rendered movie or invalidate copied output links.
        if(node.properties.daelabEditResultData===previous)node.properties.daelabEditResultData=widget.value;
        node.__videoEdit.reload();
    },
});
app.registerExtension({name:'DAELAB.VideoEdit',beforeRegisterNodeDef(type,definition){
    if(definition.name!==EDIT_TYPE)return;
    const created=type.prototype.onNodeCreated;type.prototype.onNodeCreated=function(){created?.apply(this,arguments);install(this);};
    const configured=type.prototype.onConfigure;type.prototype.onConfigure=function(){configured?.apply(this,arguments);if(!this.inputs.some(input=>input.name.startsWith('groups.')))this.addInput('groups.group0','DAELAB_ASSETS');install(this);this.__videoEdit.reload();};
    const connections=type.prototype.onConnectionsChange;type.prototype.onConnectionsChange=function(){connections?.apply(this,arguments);requestAnimationFrame(()=>this.__videoEdit?.syncConnections());};
    const connect=type.prototype.onConnectOutput;type.prototype.onConnectOutput=function(){if(!app.configuringGraph&&!canConnectOutput(this))return false;return connect?.apply(this,arguments)??true;};
    const removed=type.prototype.onRemoved;type.prototype.onRemoved=function(){this.__videoEdit?.destroy();removed?.apply(this,arguments);};
    const executed=type.prototype.onExecuted;type.prototype.onExecuted=function(message){executed?.apply(this,arguments);const ref=message?.videos?.[0];if(ref)this.__videoEdit?.output('/view?'+new URLSearchParams(ref),message.edit_data?.[0]);};
}});
