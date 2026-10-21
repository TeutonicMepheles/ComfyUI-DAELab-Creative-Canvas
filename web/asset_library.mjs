import {createCreativeButton,bindCreativeButton} from './creative_button.mjs';
import {bindCreativeField} from './creative_field.mjs';
import {readLibrary,removeFavorite,subscribeLibrary} from './asset_library_model.mjs';
import {assetURL} from './media_upload_model.mjs';
import {libraryIcon} from './asset_favorite.mjs?v=20261015-2';

const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
export function createAssetLibrary(root,{onCreate,onAdd}){
    let alive=true,open=false,entries=[],selected=null,filter='all',query='',epoch=0,controller=null,returnFocus=null,previewId=null;
    const bindings=[],tilesBindings=[];
    const action=(label,icon,fn,collection=bindings)=>{const b=createCreativeButton(label,fn);collection.push(bindCreativeButton(b));if(icon)b.prepend(libraryIcon(icon));return b;};
    const dock=el('nav','dae-library-dock dae-library-overlay dae-creative-toolbar');dock.setAttribute('aria-label','画布工具');
    const create=action('新建','edit-line',()=>{onCreate();});
    const toggle=action('资产库','folder-image-line',()=>setOpen(!open));toggle.setAttribute('aria-expanded','false');
    dock.append(create,el('span','dae-library-divider'),toggle);
    const drawer=el('section','dae-library-drawer dae-library-overlay dae-creative-toolbar');drawer.setAttribute('aria-label','资产库');drawer.hidden=true;
    const header=el('header','dae-library-header'),title=el('strong','','资产库'),count=el('span','dae-library-muted');
    const close=action('收起资产库','arrow-down-line',()=>{setOpen(false);toggle.focus();});close.classList.add('dae-library-icon-only');close.setAttribute('aria-label','收起资产库');close.title='收起资产库';
    count.title='收藏保存在当前浏览器及服务地址下；媒体引用本地文件';
    header.append(libraryIcon('folder-image-line'),title,count,el('span','dae-library-spacer'),close);
    const tools=el('div','dae-library-tools'),filters=el('div','dae-library-filters');filters.setAttribute('aria-label','素材类型');
    for(const [key,label] of [['all','全部'],['image','图片'],['video','视频'],['text','文本']]){const b=action(label,null,()=>{filter=key;render();});b.dataset.filter=key;filters.append(b);}
    const search=el('input','dae-library-search');search.type='search';search.placeholder='搜索收藏';search.setAttribute('aria-label','搜索收藏');bindings.push(bindCreativeField(search));search.oninput=()=>{query=search.value.trim().toLocaleLowerCase();render();};
    tools.append(filters,search);
    const grid=el('div','dae-library-grid');grid.setAttribute('aria-label','收藏素材');
    const notice=el('p','dae-library-notice');notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');notice.hidden=true;
    const footer=el('footer','dae-library-footer'),summary=el('span','dae-library-muted','收藏保存在此浏览器 · 引用本地文件');
    const preview=action('预览','fullscreen-line',()=>showPreview());
    const add=action('加入画布','file-copy-line',()=>addSelected());add.dataset.primary='true';
    footer.append(summary,el('span','dae-library-spacer'),preview,add);
    drawer.append(header,tools,grid,notice,footer);
    const dialog=el('dialog','dae-ui dae-library-preview dae-library-overlay');dialog.setAttribute('aria-label','素材预览');
    const previewHeader=el('header','dae-library-header'),previewTitle=el('strong'),previewClose=action('关闭',null,()=>closePreview());previewHeader.append(previewTitle,el('span','dae-library-spacer'),previewClose);
    const previewBody=el('div','dae-library-preview-body'),previewNotice=el('p','dae-library-notice');previewNotice.setAttribute('role','status');
    const previewAdd=action('加入画布','file-copy-line',()=>addSelected());previewAdd.dataset.primary='true';dialog.append(previewHeader,previewBody,previewNotice,previewAdd);
    root.append(dock,drawer,dialog);root.dataset.assetLibrary='true';
    function say(text){notice.textContent=text;notice.hidden=!text;if(dialog.open)previewNotice.textContent=text;}
    function media(entry,large=false){
        if(entry.kind==='text'){const text=el(large?'pre':'div','dae-library-text',entry.text);return text;}
        const node=el(entry.kind==='video'?'video':'img');node.draggable=false;
        if(entry.kind==='video'){node.preload='metadata';node.playsInline=true;node.muted=!large;node.controls=large;}else{node.alt=entry.name;node.loading=large?'eager':'lazy';}
        node.src=assetURL(entry.asset);
        node.addEventListener('error',()=>{if(!alive||!node.isConnected)return;node.parentElement?.classList.add('dae-library-unavailable');const message=el('span','dae-library-media-error','文件失效或格式不可预览');node.replaceWith(message);if(large)say('无法预览；请检查原素材文件是否仍存在。');},{once:true});return node;
    }
    function selection(){const entry=entries.find(e=>e.id===selected);preview.disabled=add.disabled=!entry;previewAdd.disabled=!entry;summary.textContent=entry?entry.name:'收藏保存在此浏览器 · 引用本地文件';summary.title=summary.textContent;for(const b of grid.querySelectorAll('[data-asset-id]'))b.setAttribute('aria-pressed',String(b.dataset.assetId===selected));}
    function render(){
        if(!alive||!open)return;
        const focused=document.activeElement,focusId=focused?.dataset?.assetId||focused?.dataset?.removeId,focusRemove=!!focused?.dataset?.removeId,scroll=grid.scrollTop;
        grid.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});tilesBindings.splice(0).forEach(release=>release());grid.replaceChildren();
        const list=entries.filter(e=>(filter==='all'||e.kind===filter)&&e.name.toLocaleLowerCase().includes(query));
        if(!list.some(e=>e.id===selected))selected=list[0]?.id||null;
        for(const entry of list){
            const tile=el('article','dae-library-tile'),thumb=action('',null,()=>{selected=entry.id;selection();},tilesBindings);thumb.className='dae-library-thumb';thumb.dataset.assetId=entry.id;thumb.setAttribute('aria-label',entry.name);thumb.append(media(entry));thumb.addEventListener('dblclick',()=>showPreview());
            if(entry.kind==='video')thumb.append(el('span','dae-library-kind','视频'));
            const line=el('div','dae-library-tile-label'),label=el('span','',entry.name);label.title=entry.name;
            const remove=action('取消收藏','star-fill',async()=>{try{await removeFavorite(entry.id);if(alive){say('已取消收藏，原文件和画布素材保留');search.focus();}}catch(e){say(e.message);}},tilesBindings);remove.dataset.removeId=entry.id;remove.setAttribute('aria-label','取消收藏 '+entry.name);remove.title='取消收藏';remove.className='dae-library-remove';
            line.append(label,remove);tile.append(thumb,line);grid.append(tile);
        }
        if(!list.length){const empty=el('div','dae-library-empty');empty.append(libraryIcon('folder-image-line'),el('strong','',entries.length?'没有匹配的收藏':'把常用素材留在这里'),el('span','',entries.length?'试试其他类型或名称':'点击素材上的收藏按钮，即可跨工作流复用'));grid.append(empty);}
        count.textContent=`${entries.length} 项`;for(const b of filters.children)b.setAttribute('aria-pressed',String(b.dataset.filter===filter));selection();grid.scrollTop=scroll;
        if(focusId){const candidate=[...grid.querySelectorAll(focusRemove?'[data-remove-id]':'[data-asset-id]')].find(b=>(focusRemove?b.dataset.removeId:b.dataset.assetId)===focusId);candidate?.focus({preventScroll:true});}
    }
    function refresh(){if(!alive)return;try{entries=readLibrary();if(previewId&&!entries.some(e=>e.id===previewId))closePreview();render();}catch(error){say(error.message);}}
    function closePreview(){if(dialog.open)dialog.close();previewBody.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});previewBody.replaceChildren();previewId=null;if(returnFocus?.isConnected&&open)returnFocus.focus();returnFocus=null;}
    function showPreview(){const entry=entries.find(e=>e.id===selected);if(!entry)return;returnFocus=document.activeElement;previewId=entry.id;previewTitle.textContent=entry.name;previewNotice.textContent='';previewBody.replaceChildren(media(entry,true));dialog.showModal();previewClose.focus();}
    async function addSelected(){
        const entry=entries.find(e=>e.id===selected);if(!entry)return;
        const token=++epoch;controller?.abort();controller=new AbortController();say('');
        try{
            await onAdd(entry,controller.signal);
            if(alive&&token===epoch)say('已加入画布，可使用 Ctrl+Z 撤销');
        }catch(error){if(alive&&token===epoch&&error.name!=='AbortError')say(error.message);}
    }
    function setOpen(value){open=value;drawer.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-pressed',String(open));root.dataset.libraryOpen=String(open);if(open){refresh();search.focus();}else{++epoch;controller?.abort();closePreview();grid.querySelectorAll('video').forEach(v=>v.pause());}}
    for(const container of [dock,drawer,dialog]){
        for(const type of ['pointerdown','dblclick','contextmenu','wheel','copy','paste'])container.addEventListener(type,e=>e.stopPropagation());
        for(const type of ['dragover','drop'])container.addEventListener(type,e=>{e.preventDefault();e.stopPropagation();});
        container.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'&&!e.isComposing){e.preventDefault();if(dialog.open)closePreview();else{setOpen(false);toggle.focus();}}});
    }
    dialog.addEventListener('cancel',e=>{e.preventDefault();closePreview();});
    const release=subscribeLibrary(refresh);
    return {dock,drawer,close:()=>setOpen(false),destroy(){alive=false;++epoch;controller?.abort();closePreview();release();tilesBindings.splice(0).forEach(fn=>fn());bindings.splice(0).forEach(fn=>fn());dock.remove();drawer.remove();dialog.remove();delete root.dataset.assetLibrary;delete root.dataset.libraryOpen;}};
}
