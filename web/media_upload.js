import {bindPanelAvailability} from './creative_panel_state.mjs';
import {app} from '/scripts/app.js';
import {createCreativeButton} from './creative_button.mjs';
import {UPLOAD_TYPE,ACCEPT,mediaKind,readAsset,assetURL,slotAllowed} from './media_upload_model.mjs';

const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./media_upload.css',import.meta.url).href;document.head.append(sheet);
function install(node){
    if(node.__mediaUpload)return;
    const data=node.widgets.find(w=>w.name==='asset_data');
    data.hidden=true;data.options={...data.options,hidden:true};data.computeSize=()=>[0,-4];
    if(data.inputEl)data.inputEl.style.display='none';
    const root=document.createElement('section');root.className='dae-ui dae-upload';
    const toolbar=document.createElement('div');toolbar.className='dae-upload-toolbar';
    const info=document.createElement('span');info.className='dae-upload-info';
    const stage=document.createElement('div');stage.className='dae-upload-stage';
    const status=document.createElement('p');status.className='dae-upload-status';status.setAttribute('role','status');
    const picker=document.createElement('input');picker.type='file';picker.accept=ACCEPT;picker.hidden=true;picker.setAttribute('aria-label','上传图片或视频');
    let epoch=0,controller=null,disposed=false,signature=null,asset=null;
    const choose=createCreativeButton('上传图片 / 视频',()=>{picker.value='';picker.click();});
    const fullscreen=createCreativeButton('全屏',async()=>{try{await stage.requestFullscreen();}catch{status.textContent='当前浏览器无法进入全屏';}});
    const download=document.createElement('a');download.textContent='下载';download.className='dae-upload-download';
    toolbar.append(info,choose,download,fullscreen);root.append(toolbar,stage,status,picker);
    function render(){
        if(disposed)return;
        const previousName=asset?.name;
        asset=readAsset(data.value);const next=JSON.stringify(asset);if(next===signature)return;signature=next;
        root.dataset.hasAsset=String(!!asset);
        if(asset&&(!node.title||node.title==='上传'||node.title===UPLOAD_TYPE||node.title===previousName))node.title=asset.name;
        stage.querySelector('video')?.pause();stage.replaceChildren();status.textContent='';
        choose.textContent=asset?'替换素材':'上传图片 / 视频';download.hidden=fullscreen.hidden=!asset;
        info.textContent=asset?.name||'';info.title=info.textContent;
        if(!asset){const hint=document.createElement('div');hint.className='dae-upload-empty';hint.textContent='拖入图片或视频\nPNG · JPG · WebP · MP4 · WebM · MOV';stage.append(hint);return;}
        const media=document.createElement(asset.kind==='video'?'video':'img');media.src=assetURL(asset);
        if(asset.kind==='video'){media.controls=true;media.preload='metadata';media.playsInline=true;}else{media.alt=asset.name;media.draggable=false;}
        const dimensions=()=>{if(!media.isConnected)return;const w=media.videoWidth||media.naturalWidth,h=media.videoHeight||media.naturalHeight;info.textContent=`${asset.name} · ${w} × ${h}`;};
        media.addEventListener(asset.kind==='video'?'loadedmetadata':'load',dimensions);
        media.addEventListener('error',()=>{status.textContent='无法预览：文件缺失或浏览器不支持此编码，请替换素材。';});
        stage.append(media);download.href=media.src;download.download=asset.name;
    }
    async function upload(file){
        if(!file||disposed||node.mode)return;
        const kind=mediaKind(file.name);if(!kind){status.textContent='请选择 PNG、JPG、WebP、MP4、WebM 或 MOV 文件';return;}
        if(asset&&kind!==asset.kind&&node.outputs.some(o=>o.links?.length)){status.textContent='切换素材类型前，请先断开现有输出连线';return;}
        if(asset&&!window.confirm('替换当前素材？已有引用会使用新素材。'))return;
        controller?.abort();controller=new AbortController();const token=++epoch,previous=data.value;
        choose.disabled=true;root.setAttribute('aria-busy','true');status.textContent='正在上传…';
        try{
            const form=new FormData();form.append('image',file,crypto.randomUUID()+file.name.slice(file.name.lastIndexOf('.')).toLowerCase());form.append('type','input');form.append('subfolder','DAELAB/uploads');form.append('overwrite','false');
            const response=await app.api.fetchApi('/upload/image',{method:'POST',body:form,signal:controller.signal});
            if(!response.ok)throw new Error(`上传失败（${response.status}），可重新选择文件重试`);
            const result=await response.json();
            if(disposed||token!==epoch||!node.graph||data.value!==previous)return;
            data.value=JSON.stringify({version:1,id:crypto.randomUUID(),kind,name:file.name,filename:result.name,subfolder:result.subfolder||'',size:file.size});
            data.callback?.(data.value);node.graph.setDirtyCanvas?.(true,true);node.graph.change?.();render();
        }catch(e){if(token===epoch&&!disposed&&e.name!=='AbortError')status.textContent=e.message;}
        finally{if(token===epoch&&!disposed){choose.disabled=false;root.removeAttribute('aria-busy');}}
    }
    picker.onchange=()=>void upload(picker.files[0]);
    root.addEventListener('dragover',e=>{e.preventDefault();e.stopPropagation();root.dataset.dragging='true';});
    root.addEventListener('dragleave',()=>delete root.dataset.dragging);
    root.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();delete root.dataset.dragging;if(e.dataTransfer.files.length!==1)return;void upload(e.dataTransfer.files[0]);});
    for(const event of ['pointerdown','dblclick','keydown','wheel'])root.addEventListener(event,e=>e.stopPropagation());
    const widget=node.addDOMWidget('media_upload','custom',root,{serialize:false,hideOnZoom:false,getValue:()=>'',setValue:()=>render(),getMinHeight:()=>320});widget.serialize=false;
    const releaseAvailability=bindPanelAvailability(node,root);
    node.__mediaUpload={root,render,upload,kind:()=>readAsset(data.value)?.kind,reload(){++epoch;controller?.abort();choose.disabled=false;root.removeAttribute('aria-busy');signature=null;render();},destroy(){releaseAvailability();disposed=true;++epoch;controller?.abort();stage.querySelector('video')?.pause();root.remove();}};
    node.setSize([520,400]);render();
}
app.registerExtension({name:'DAELab.MediaUpload',beforeRegisterNodeDef(type,definition){
    if(definition.name!==UPLOAD_TYPE)return;
    const created=type.prototype.onNodeCreated;type.prototype.onNodeCreated=function(){created?.apply(this,arguments);install(this);};
    const configured=type.prototype.onConfigure;type.prototype.onConfigure=function(){configured?.apply(this,arguments);install(this);this.__mediaUpload.reload();};
    const removed=type.prototype.onRemoved;type.prototype.onRemoved=function(){this.__mediaUpload?.destroy();removed?.apply(this,arguments);};
    const connect=type.prototype.onConnectOutput;type.prototype.onConnectOutput=function(index){if(!slotAllowed(this.__mediaUpload?.kind(),index))return false;return connect?.apply(this,arguments)??true;};
}});
