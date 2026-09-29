import {app} from '/scripts/app.js';
import {api} from '/scripts/api.js';
import {registerAdapter,adapterFor} from './creative_contract.mjs';
import {canvasHistory} from './creative_history.mjs';
import {bindPanelAvailability} from './creative_panel_state.mjs';
import {EDIT_TYPE,readEdit,localAsset} from './video_edit_model.mjs';
import {createVideoEditor} from './video_edit_panel.mjs';

const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./video_edit.css',import.meta.url).href;document.head.append(sheet);
const resultFor=node=>node.properties?.daelabEditResultData===node.widgets?.find(w=>w.name==='edit_data')?.value?node.properties?.daelabEditResult:null;
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
    let disposed=false,job=null,sourceSignature=null,sourceSync=null,syncTimer=null;
    const dirty=()=>{node.graph?.change?.();node.graph?.setDirtyCanvas?.(true,true);};
    const panel=createVideoEditor({
        read:()=>readEdit(widget.value),view:()=>node.properties.daelabEditView||{},
        write(data){
            const previous=readEdit(widget.value),used=new Set(data.clips.map(c=>c.source.slot).filter(Boolean));
            const removed=new Set(previous.clips.map(c=>c.source.slot).filter(slot=>slot&&!used.has(slot)));
            const grouped=new Set(data.clips.filter(c=>c.source.slot==='assets').map(c=>c.source.nodeId).filter(Boolean));
            for(const input of node.inputs){
                if(input.link==null||input.name==='assets'||used.has(input.name))continue;
                const link=node.graph.links.get?.(input.link)||node.graph.links[input.link];
                if(grouped.has(String(link.origin_id)))removed.add(input.name);
            }
            if(removed.size&&data.sources)data={...data,sources:data.sources.filter(key=>!removed.has(JSON.parse(key)[0]))};
            history.begin();
            try{
                const value=JSON.stringify(data);
                if(value!==widget.value){delete node.properties.daelabEditResult;delete node.properties.daelabEditResultData;panel.output(null);}
                widget.value=value;widget.callback?.(widget.value);
                const inputs=node.inputs.filter(input=>input.link!=null&&removed.has(input.name));
                for(const input of inputs){const index=node.inputs.indexOf(input);if(index>=0)node.disconnectInput(index);}
                dirty();
            }finally{history.end();}
            return data;
        },
        saveView(value){node.properties.daelabEditView=value;dirty();},
        inspect:(asset,signal)=>request('/daelab/edit/media',{asset},signal),
        proxy:(asset,scale,signal)=>request('/daelab/edit/preview',{asset,scale},signal),
        async exportVideo(){
            if(job||disposed)return;
            const task=job={id:null,cancelled:false,cancelling:false};
            try{
                const prompt=await app.graphToPrompt(),output={},target=String(node.id);
                if(disposed||task.cancelled)return;
                panel.running(true,'准备导出…');
                const include=id=>{if(output[id])return;const n=prompt.output[id];if(!n)throw new Error('节点未参与执行，请切回启用模式');output[id]=n;for(const value of Object.values(n.inputs))if(Array.isArray(value)&&value.length===2&&prompt.output[String(value[0])])include(String(value[0]));};include(target);
                const submittedEdit=output[target].inputs.edit_data;
                const result=await api.queuePrompt(0,{output,workflow:prompt.workflow});
                task.id=result.prompt_id;
                if(disposed||task.cancelled){await request('/api/jobs/'+encodeURIComponent(task.id)+'/cancel',{});return;}
                panel.running(true,'等待导出…');
                while(job===task&&!disposed&&!task.cancelled){
                    const response=await api.fetchApi('/history/'+encodeURIComponent(task.id));
                    if(job!==task||disposed||task.cancelled)return;
                    if(!response.ok)throw new Error('无法读取导出状态');
                    const history=await response.json();
                    if(job!==task||disposed||task.cancelled)return;
                    const item=history[task.id];
                    if(item){
                        if(item.status?.status_str==='error'){const failure=item.status.messages?.find(([type])=>type==='execution_error');throw new Error(failure?.[1]?.exception_message||'导出已取消');}
                        const ref=item.outputs?.[target]?.videos?.[0];if(ref)node.__videoEdit.output('/view?'+new URLSearchParams(ref),submittedEdit);else panel.error('导出已取消');
                        break;
                    }
                    await new Promise(resolve=>setTimeout(resolve,600));
                }
            }catch(error){if(job===task&&!disposed)throw error;}
            finally{if(job===task){job=null;if(!disposed)panel.running(false,task.cancelled?'导出已取消':'');}}
        },
        async cancelExport(){
            const task=job;if(!task||task.cancelling||task.cancelled)return;
            if(!task.id){task.cancelled=true;panel.running(true,'正在取消导出…');return;}
            task.cancelling=true;
            try{
                await request('/api/jobs/'+encodeURIComponent(task.id)+'/cancel',{});
                if(job!==task||disposed)return;
                task.cancelled=true;job=null;panel.running(false,'导出已取消');
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
            if(collection){for(const asset of collection.assets)assets.push({...asset,editSource:input.name==='assets'?{slot:'assets',assetId:asset.id,nodeId:asset.nodeId}:{slot:input.name,nodeId:String(source.id)}});}
            else{const preview=adapter?.preview?.(source);assets.push({...localAsset(preview?.url),editSource:{slot:input.name,nodeId:String(source.id)}});}
        }
        return {version:1,assets};
    }
    function syncConnections(){
        if(disposed||!node.graph||app.configuringGraph)return;
        try{
            const collection=connected(),signature=JSON.stringify(collection);
            if(signature===(sourceSync?.signature??sourceSignature))return;
            const sync=sourceSync={signature};sourceSignature=null;
            panel.syncSources(collection).then(()=>{
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
    const progress=e=>{if(job?.id&&!job.cancelled&&e.detail.prompt_id===job.id&&String(e.detail.node)===String(node.id))panel.running(true,`正在导出 ${Math.round(e.detail.value/e.detail.max*100)}%`);};api.addEventListener('progress',progress);
    node.__videoEdit={...panel,syncConnections,
        output(url,data){
            if(data!==widget.value){panel.error('剪辑已更新，请重新导出成片');return;}
            node.properties.daelabEditResult=url;node.properties.daelabEditResultData=data;panel.output(url);dirty();
        },
        reload(){sourceSync=null;sourceSignature=null;panel.reload();panel.output(resultFor(node));},
        destroy(){disposed=true;sourceSync=null;clearInterval(syncTimer);if(job?.id)void request('/api/jobs/'+encodeURIComponent(job.id)+'/cancel',{}).catch(()=>{});job=null;api.removeEventListener('progress',progress);availability();panel.destroy();}};
    node.setSize([820,760]);if(resultFor(node))panel.output(resultFor(node));
}
registerAdapter('daelab.video-edit',{
    matches:node=>node.type===EDIT_TYPE,width:840,expanded:true,floatingHeader:true,collapsible:false,inputSelection:'first-free',outputLabel:'剪辑成片',
    menu:[{label:'剪辑',type:EDIT_TYPE,icon:'scissors-cut-line'}],
    panel:node=>node.__videoEdit,preview:node=>({url:resultFor(node),kind:'video'}),
    summary:node=>`${readEdit(node.widgets?.find(w=>w.name==='edit_data')?.value).clips.length} 个片段`,
    assets:node=>{const url=resultFor(node);return {version:1,ready:!!url,assets:url?[localAsset(url)]:[]};},
    canConnectOutput,
    inputLabels:{assets:'素材组'},
});
app.registerExtension({name:'DAELAB.VideoEdit',beforeRegisterNodeDef(type,definition){
    if(definition.name!==EDIT_TYPE)return;
    const created=type.prototype.onNodeCreated;type.prototype.onNodeCreated=function(){created?.apply(this,arguments);install(this);};
    const configured=type.prototype.onConfigure;type.prototype.onConfigure=function(){configured?.apply(this,arguments);install(this);this.__videoEdit.reload();};
    const connections=type.prototype.onConnectionsChange;type.prototype.onConnectionsChange=function(){connections?.apply(this,arguments);queueMicrotask(()=>this.__videoEdit?.syncConnections());};
    const connect=type.prototype.onConnectOutput;type.prototype.onConnectOutput=function(){if(!app.configuringGraph&&!canConnectOutput(this))return false;return connect?.apply(this,arguments)??true;};
    const removed=type.prototype.onRemoved;type.prototype.onRemoved=function(){this.__videoEdit?.destroy();removed?.apply(this,arguments);};
    const executed=type.prototype.onExecuted;type.prototype.onExecuted=function(message){executed?.apply(this,arguments);const ref=message?.videos?.[0];if(ref)this.__videoEdit?.output('/view?'+new URLSearchParams(ref),message.edit_data?.[0]);};
}});
