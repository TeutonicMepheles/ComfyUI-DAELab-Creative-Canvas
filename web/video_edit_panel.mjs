import {createCreativeButton,bindCreativeButton} from './creative_button.mjs';
import {bindCreativeField} from './creative_field.mjs';
import {PREVIEW_SCALES,spans,createTimelineIndex,connectedEdit,resizeClip,splitClip,moveClip,formatTime,timelineFps,snapFrame,formatFrame} from './video_edit_model.mjs';

const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
export function createVideoEditor(host){
    const root=el('section','dae-ui dae-edit');root.tabIndex=0;root.setAttribute('aria-label','单轨剪辑编辑器');
    const stage=el('div','dae-edit-stage'),transport=el('div','dae-edit-transport');
    const preview=el('div','dae-edit-preview');preview.append(stage);
    const picture=el('img'),hold=el('canvas','dae-edit-hold'),empty=el('span','dae-edit-empty','连接素材或素材组节点，开始剪辑');
    let video=el('video'),standby=el('video');
    const videos=[video,standby];for(const player of videos){player.playsInline=true;player.preload='auto';player.hidden=true;}
    picture.alt='当前图片片段';picture.draggable=false;picture.hidden=hold.hidden=true;stage.append(...videos,picture,hold,empty);
    let mediaReady=false,mediaEpoch=0,standbyKey='',standbyReady=false;
    const nextPicture=new Image();
    const viewport=el('div','dae-edit-scroll'),timeline=el('div','dae-edit-timeline'),ruler=el('div','dae-edit-ruler'),track=el('div','dae-edit-track'),head=el('div','dae-edit-head');
    viewport.tabIndex=0;viewport.setAttribute('aria-label','剪辑时间轴');timeline.append(ruler,track,head);viewport.append(timeline);
    const inspector=el('div','dae-edit-inspector'),status=el('div','dae-edit-status'),resolution=el('span','dae-edit-resolution'),previewStatus=el('div','dae-edit-status');status.setAttribute('role','status');previewStatus.setAttribute('role','status');resolution.setAttribute('aria-label','导出分辨率');resolution.setAttribute('aria-live','polite');resolution.dataset.daeTooltip='导出分辨率';resolution.dataset.tooltipAlign='end';
    const result=el('div','dae-edit-result');result.hidden=true;
    const releaseControls=[];
    let edit=host.read(),selected=edit.clips[0]?.id,time=0,playing=false,exporting=false,disposed=false,animation=0,lastTick=0,mediaKey='',drag=null,dragAnimation=0;
    let scale=PREVIEW_SCALES.includes(host.view().scale)?host.view().scale:1,zoom=host.view().zoom||64,snapEnabled=host.view().snap===true;
    let previewKey='',previewController=null,importController=null,importEpoch=0;
    const previews=new Map(),tiles=new Map();
    let indexedClips,index;
    function timing(){if(indexedClips!==edit.clips){indexedClips=edit.clips;index=createTimelineIndex(indexedClips);}return index;}
    const insertion=el('div','dae-edit-insertion');insertion.hidden=true;track.append(insertion);
    const say=message=>{status.textContent=message;};
    const action=(label,fn)=>{const b=createCreativeButton(label,async e=>{try{return await fn(e);}catch(error){if(error.name!=='AbortError'&&!disposed)say(error.message);}});releaseControls.push(bindCreativeButton(b));return b;};
    const field=(label,input)=>{input.setAttribute('aria-label',label);releaseControls.push(bindCreativeField(input));const wrapper=el('label','dae-edit-field');wrapper.append(el('span','',label),input);return wrapper;};
    const iconAction=(label,name,fn)=>{const b=action('',fn);b.classList.add('dae-edit-icon-button');b.dataset.daeTooltip=label;b.setAttribute('aria-label',label);const icon=el('i','dae-edit-icon');icon.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+name+'.svg',import.meta.url).href}")`);icon.setAttribute('aria-hidden','true');b.append(icon);return b;};
    const exportButton=action('导出视频',()=>host.exportVideo()),cancel=action('取消导出',()=>host.cancelExport());cancel.hidden=true;exportButton.dataset.primary='true';
    const play=iconAction('播放','play-fill',()=>togglePlay()),split=iconAction('分割','scissors-cut-line',()=>commit({...edit,clips:splitClip(edit.clips,time)}));play.classList.add('dae-edit-play');
    const position=el('span','dae-edit-position');position.setAttribute('aria-label','播放时间');
    const currentTime=el('span','dae-edit-current'),totalDuration=el('span','dae-edit-total');currentTime.setAttribute('aria-label','当前预览时间');totalDuration.setAttribute('aria-label','总时间');position.append(currentTime,el('span','dae-edit-time-separator',' / '),totalDuration);
    const scaleField=el('select','dae-edit-scale');for(const value of PREVIEW_SCALES)scaleField.add(new Option(value+'×',value));scaleField.value=String(scale);
    scaleField.onchange=()=>{scale=Number(scaleField.value);host.saveView({scale,zoom,snap:snapEnabled});requestPreview(true);};
    const resolutionLock=iconAction('锁定导出分辨率','lock-unlock-line',()=>{
        const next={...edit};
        if(next.resolution)delete next.resolution;
        else{const {width,height}=outputSize();next.resolution={width,height};}
        commit(next);
    });resolutionLock.classList.add('dae-edit-resolution-lock');resolutionLock.dataset.tooltipAlign='end';
    const resolutionControls=el('div','dae-edit-resolution-controls');resolutionControls.append(resolution,resolutionLock);
    const previewSettings=el('div','dae-edit-preview-settings');previewSettings.append(field('预览',scaleField),resolutionControls);transport.append(position,play,previewSettings);
    const timelineTools=el('div','dae-edit-toolbar');
    const copy=iconAction('复制片段','file-copy-line',()=>{const clip=edit.clips.find(c=>c.id===selected);if(!clip)return;const next=[...edit.clips],index=next.indexOf(clip);next.splice(index+1,0,{...structuredClone(clip),id:crypto.randomUUID()});commit({...edit,clips:next});});
    const remove=iconAction('删除片段','delete-bin-line',()=>commit({...edit,clips:edit.clips.filter(c=>c.id!==selected)}));
    const snapping=action('',()=>{snapEnabled=!snapEnabled;host.saveView({scale,zoom,snap:snapEnabled});updateSnapping();});
    snapping.classList.add('dae-edit-icon-button','dae-edit-snap');snapping.setAttribute('aria-label','吸附');
    snapping.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 3h5v10a3 3 0 0 0 6 0V3h5v10a8 8 0 0 1-16 0Z"/><path d="M4 7h5m6 0h5"/></svg>';
    const zoomOut=action('−',()=>setZoom(zoom/1.5)),zoomIn=action('+',()=>setZoom(zoom*1.5));zoomOut.setAttribute('aria-label','缩小时间轴');zoomIn.setAttribute('aria-label','放大时间轴');
    zoomOut.classList.add('dae-edit-zoom-button');zoomIn.classList.add('dae-edit-zoom-button');
    zoomOut.dataset.daeTooltip='缩小时间轴';zoomIn.dataset.daeTooltip='放大时间轴';zoomIn.dataset.tooltipAlign='end';split.dataset.tooltipAlign='start';
    const zoomSlider=el('input','dae-edit-zoom-slider');zoomSlider.type='range';zoomSlider.min=0;zoomSlider.max=100;zoomSlider.step=1;zoomSlider.setAttribute('aria-label','时间轴缩放');releaseControls.push(bindCreativeField(zoomSlider));
    zoomSlider.oninput=()=>setZoom(8*(maxZoom()/8)**(Number(zoomSlider.value)/100));
    const zoomControls=el('div','dae-edit-zoom-controls');zoomControls.append(zoomOut,zoomSlider,zoomIn);
    timelineTools.append(split,copy,remove,snapping,el('span','dae-edit-spacer'),zoomControls);
    const clipMenu=el('div','dae-edit-clip-menu');clipMenu.popover='auto';clipMenu.setAttribute('role','menu');clipMenu.setAttribute('aria-label','片段选项');
    let menuTile=null,menuEvents=null,fitCloseTimer=0;
    const mute=action('片段静音',()=>{const clip=edit.clips.find(c=>c.id===selected);closeClipMenu(true);if(clip?.asset.kind==='video')replace({...clip,mute:!clip.mute});});mute.setAttribute('role','menuitemcheckbox');
    const fitGroup=el('div','dae-edit-clip-menu dae-edit-fit-options');fitGroup.popover='auto';fitGroup.id='dae-edit-fit-'+crypto.randomUUID();fitGroup.setAttribute('role','menu');fitGroup.setAttribute('aria-label','当前片段画面适配');
    const fitTrigger=action('画面适配',()=>openFitMenu(true));fitTrigger.setAttribute('role','menuitem');fitTrigger.setAttribute('aria-haspopup','menu');fitTrigger.setAttribute('aria-expanded','false');fitTrigger.setAttribute('aria-controls',fitGroup.id);
    const fitArrow=el('span','','›');fitArrow.setAttribute('aria-hidden','true');fitTrigger.append(fitArrow);
    const fitItems=['contain','cover'].map((value,index)=>{
        const item=action(index?'填满裁切':'等比留边',()=>{const clip=edit.clips.find(c=>c.id===selected);closeClipMenu(true);if(clip)replace({...clip,fit:value});});
        item.setAttribute('role','menuitemradio');item.dataset.fit=value;fitGroup.append(item);return item;
    });
    clipMenu.append(mute,fitTrigger,fitGroup);
    inspector.append(el('span','dae-edit-spacer'),cancel,exportButton);
    root.append(preview,transport,timelineTools,viewport,inspector,previewStatus,status,result,clipMenu);

    function closeFitMenu(restoreFocus=false){
        clearTimeout(fitCloseTimer);fitCloseTimer=0;
        if(fitGroup.matches(':popover-open'))fitGroup.hidePopover();
        fitTrigger.setAttribute('aria-expanded','false');
        if(restoreFocus)fitTrigger.focus({preventScroll:true});
    }
    function openFitMenu(focus=false){
        clearTimeout(fitCloseTimer);fitCloseTimer=0;
        if(!clipMenu.matches(':popover-open'))return;
        if(!fitGroup.matches(':popover-open')){
            fitGroup.style.left='0px';fitGroup.style.top='0px';fitGroup.showPopover();
            const anchor=fitTrigger.getBoundingClientRect(),rect=fitGroup.getBoundingClientRect(),width=document.documentElement.clientWidth;
            const x=anchor.right+6+rect.width<=width-8?anchor.right+6:anchor.left-rect.width-6;
            fitGroup.style.left=`${Math.max(8,Math.min(x,width-rect.width-8))}px`;
            fitGroup.style.top=`${Math.max(8,Math.min(anchor.top,document.documentElement.clientHeight-rect.height-8))}px`;
        }
        fitTrigger.setAttribute('aria-expanded','true');
        if(focus)(fitItems.find(item=>item.getAttribute('aria-checked')==='true')||fitItems[0]).focus({preventScroll:true});
    }
    fitTrigger.addEventListener('pointerenter',()=>openFitMenu());
    const deferFitClose=()=>{clearTimeout(fitCloseTimer);fitCloseTimer=setTimeout(()=>closeFitMenu(),180);};
    fitTrigger.addEventListener('pointerleave',deferFitClose);
    fitGroup.addEventListener('pointerenter',()=>{clearTimeout(fitCloseTimer);fitCloseTimer=0;});
    fitGroup.addEventListener('pointerleave',deferFitClose);
    fitGroup.addEventListener('toggle',()=>{if(!fitGroup.matches(':popover-open'))fitTrigger.setAttribute('aria-expanded','false');});
    mute.addEventListener('pointerenter',()=>closeFitMenu());
    function closeClipMenu(restoreFocus=false){
        closeFitMenu();
        menuEvents?.abort();menuEvents=null;
        if(clipMenu.matches(':popover-open'))clipMenu.hidePopover();
        if(restoreFocus&&menuTile?.isConnected)menuTile.focus({preventScroll:true});
        menuTile=null;
    }
    function openClipMenu(tile,x,y){
        if(drag||root.inert)return;
        closeClipMenu();pause();selected=tile.dataset.id;render();menuTile=tile;
        clipMenu.style.left='0px';clipMenu.style.top='0px';clipMenu.showPopover();
        const rect=clipMenu.getBoundingClientRect();
        clipMenu.style.left=`${Math.max(8,Math.min(x,document.documentElement.clientWidth-rect.width-8))}px`;
        clipMenu.style.top=`${Math.max(8,Math.min(y,document.documentElement.clientHeight-rect.height-8))}px`;
        clipMenu.querySelector('button:not(:disabled)').focus({preventScroll:true});
        menuEvents=new AbortController();
        document.addEventListener('scroll',e=>{if(!clipMenu.contains(e.target))closeClipMenu();},{capture:true,signal:menuEvents.signal});
        window.addEventListener('resize',()=>closeClipMenu(),{signal:menuEvents.signal});
    }
    clipMenu.addEventListener('toggle',()=>{if(!clipMenu.matches(':popover-open'))closeClipMenu();});
    clipMenu.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();});
    clipMenu.addEventListener('keydown',e=>{
        e.stopPropagation();
        const submenu=fitGroup.contains(e.target);
        if(e.key==='Escape'){e.preventDefault();if(submenu)closeFitMenu(true);else closeClipMenu(true);}
        else if(e.key==='ArrowRight'&&e.target===fitTrigger){e.preventDefault();openFitMenu(true);}
        else if(e.key==='ArrowLeft'&&submenu){e.preventDefault();closeFitMenu(true);}
        else if(e.key==='Tab')closeClipMenu(true);
        else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
            e.preventDefault();if(!submenu)closeFitMenu();const items=(submenu?fitItems:[mute,fitTrigger]).filter(item=>!item.disabled),index=items.indexOf(document.activeElement);
            items[e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length].focus();
        }
    });
    track.addEventListener('contextmenu',e=>{
        const tile=e.target.closest('.dae-edit-clip');if(!tile)return;
        e.preventDefault();e.stopPropagation();openClipMenu(tile,e.clientX,e.clientY);
    });
    track.addEventListener('keydown',e=>{
        if(e.key!=='ContextMenu'&&!(e.shiftKey&&e.key==='F10'))return;
        const tile=e.target.closest('.dae-edit-clip');if(!tile)return;
        e.preventDefault();e.stopPropagation();const rect=tile.getBoundingClientRect();openClipMenu(tile,Math.max(rect.left,viewport.getBoundingClientRect().left),rect.bottom);
    });

    function commit(next){closeClipMenu();pause();edit=host.write(next);if(!edit.clips.some(c=>c.id===selected))selected=edit.clips[0]?.id;time=Math.min(time,timing().total);render();syncMedia(true);}
    function replace(clip){commit({...edit,clips:edit.clips.map(c=>c.id===clip.id?clip:c)});}
    function outputSize(){const source=edit.resolution||edit.clips[0]?.asset;return source?{width:Math.max(2,Math.floor(source.width/2)*2),height:Math.max(2,Math.floor(source.height/2)*2)}:{width:16,height:9};}
    const clipFit=clip=>clip?.fit||edit.fit||'contain';
    const fps=()=>timelineFps(edit.clips);
    const maxZoom=()=>fps()*80;
    const frameMode=()=>zoom/fps()>=12;
    function setZoom(value){const anchor=time*zoom-viewport.scrollLeft;zoom=Math.max(8,Math.min(maxZoom(),value));host.saveView({scale,zoom,snap:snapEnabled});render();viewport.scrollLeft=Math.max(0,time*zoom-anchor);}
    function updateSnapping(){snapping.setAttribute('aria-pressed',String(snapEnabled));snapping.dataset.daeTooltip=snapEnabled?'吸附：已开启':'吸附：已关闭';}
    function renderRuler(){
        const rate=fps(),frames=frameMode(),majorInterval=zoom<24?10:zoom<55?5:zoom<110?2:1;
        const divisions=frames?(zoom/rate>=64?1:zoom/rate>=24?5:10):majorInterval===2?4:5;
        const interval=frames?1/rate:majorInterval/divisions;
        const first=Math.max(0,Math.floor(viewport.scrollLeft/zoom/interval)-1),last=Math.floor(Math.min(timeline.clientWidth,viewport.scrollLeft+viewport.clientWidth)/zoom/interval);
        const signature=`${first}|${last}|${interval}|${divisions}|${zoom}`;
        if(ruler.dataset.ticks===signature)return;
        ruler.dataset.ticks=signature;ruler.replaceChildren();
        for(let i=first;i<=last;i++){
            const t=i*interval,major=i%divisions===0,tick=el('span',major?'dae-edit-tick-major':'dae-edit-tick-minor',major?(frames?formatFrame(t,rate):formatTime(t)):'');
            tick.style.left=`${t*zoom}px`;tick.title=frames?`第 ${i} 帧 · ${formatFrame(t,rate)}`:formatTime(t);ruler.append(tick);
        }
    }
    function releaseThumbnail(tile){
        const thumb=tile.firstChild;if(!thumb.hasAttribute('src'))return;
        thumb.removeAttribute('src');if(thumb.tagName==='VIDEO'){thumb.pause();thumb.load();}
    }
    function renderThumbnails(){
        const left=viewport.scrollLeft-160,right=viewport.scrollLeft+viewport.clientWidth+160;
        for(const span of timing().spans){
            const tile=tiles.get(span.clip.id);if(!tile||drag?.id===span.clip.id)continue;
            if(root.hidden||root.inert||span.end*zoom<left||span.start*zoom>right){releaseThumbnail(tile);continue;}
            const thumb=tile.firstChild;if(thumb.getAttribute('src')!==thumb.dataset.src)thumb.src=thumb.dataset.src;
        }
    }
    viewport.addEventListener('scroll',()=>{renderRuler();renderThumbnails();});
    function renderTrack(){
        const total=timing().total;
        if(drag?.edge)drag.minWidth=Math.max(drag.minWidth,total*zoom+28);
        timeline.style.width=`${Math.max(viewport.clientWidth,total*zoom+28,drag?.edge?drag.minWidth:0)}px`;
        renderRuler();
        track.style.setProperty('--dae-frame-width',`${zoom/fps()}px`);track.dataset.frames=String(frameMode());
        const live=new Set();
        for(const span of timing().spans){
            const clip=span.clip;live.add(clip.id);
            let tile=tiles.get(clip.id);
            if(!tile){
                tile=el('div','dae-edit-clip');tile.dataset.id=clip.id;tile.tabIndex=0;
                const thumb=el(clip.asset.kind==='image'?'img':'video');thumb.draggable=false;
                if(clip.asset.kind==='image')thumb.alt='';else{thumb.muted=true;thumb.preload='metadata';thumb.playsInline=true;}
                tile.append(thumb,el('span','dae-edit-clip-name'),el('span','dae-edit-clip-duration'));
                for(const edge of ['left','right']){const handle=el('button','dae-edit-handle');handle.type='button';handle.dataset.edge=edge;handle.setAttribute('aria-label',edge==='left'?'调整片段起点':'调整片段终点');tile.append(handle);}
                tiles.set(clip.id,tile);track.append(tile);
            }
            tile.dataset.selected=String(clip.id===selected);tile.dataset.kind=clip.asset.kind;
            let start=span.start;
            if(drag?.edge==='left')start=drag.beforeStarts.get(clip.id)+(clip.id===drag.id?drag.span.clip.duration-clip.duration:0);
            if(drag?.layer&&clip.id===drag.id){insertion.style.left=`${span.start*zoom}px`;insertion.style.width=`${clip.duration*zoom}px`;}
            else tile.style.left=`${start*zoom}px`;
            tile.style.width=`${(span.end-span.start)*zoom}px`;
            tile.setAttribute('aria-label',`${clip.asset.name}，${formatTime(clip.duration)}`);tile.title=`${clip.asset.name} · ${formatTime(clip.duration)}`;
            const thumb=tile.firstChild,url=clip.asset.url+(clip.asset.kind==='video'?'#t='+clip.start:'');
            thumb.dataset.src=url;
            tile.querySelector('.dae-edit-clip-name').textContent=clip.asset.name;
            tile.querySelector('.dae-edit-clip-duration').textContent=formatTime(clip.duration);
        }
        for(const [id,tile] of tiles)if(!live.has(id)){releaseThumbnail(tile);tile.remove();tiles.delete(id);}
        renderThumbnails();
        updatePosition();
    }
    function render(){
        renderTrack();
        const clip=edit.clips.find(c=>c.id===selected);
        inspector.hidden=!clip;copy.disabled=remove.disabled=!clip;play.disabled=split.disabled=!edit.clips.length;exportButton.disabled=exporting||!edit.clips.length;
        mute.disabled=!clip||clip.asset.kind==='image';mute.setAttribute('aria-checked',String(!!clip?.mute));
        for(const item of fitItems)item.setAttribute('aria-checked',String(item.dataset.fit===clipFit(clip)));
        zoomSlider.value=String(Math.log(zoom/8)/Math.log(maxZoom()/8)*100);zoomSlider.setAttribute('aria-valuetext',`每帧 ${(zoom/fps()).toFixed(1)} 像素 · ${fps().toFixed(3).replace(/\.?0+$/,'')} fps`);
        const {width,height}=outputSize(),locked=!!edit.resolution;
        stage.style.aspectRatio=`${width}/${height}`;resolutionControls.hidden=!locked&&!edit.clips.length;resolution.textContent=`${width}×${height}`;
        const lockLabel=locked?'解锁导出分辨率':'锁定导出分辨率';resolutionLock.setAttribute('aria-label',lockLabel);resolutionLock.setAttribute('aria-pressed',String(locked));resolutionLock.dataset.daeTooltip=lockLabel;
        resolutionLock.firstChild.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+(locked?'lock-line':'lock-unlock-line')+'.svg',import.meta.url).href}")`);
        updateSnapping();
        updatePosition();
    }
    function updatePosition(){
        const label=t=>frameMode()?formatFrame(t,fps()):formatTime(t),current=label(time),total=label(timing().total),position=`${time*zoom}px`,headLabel='播放头 '+formatTime(time);
        if(currentTime.textContent!==current)currentTime.textContent=current;
        if(totalDuration.textContent!==total)totalDuration.textContent=total;
        if(head.style.left!==position)head.style.left=position;
        head.hidden=!edit.clips.length;if(head.getAttribute('aria-label')!==headLabel)head.setAttribute('aria-label',headLabel);
    }
    function updatePlay(){const label=playing?'暂停':'播放';play.dataset.daeTooltip=label;play.setAttribute('aria-label',label);play.firstChild.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+(playing?'pause-fill':'play-fill')+'.svg',import.meta.url).href}")`);}
    function pause(){playing=false;video.pause();cancelAnimationFrame(animation);updatePlay();}
    function playMedia(){if(!mediaReady)return;video.play().catch(error=>{if(error.name!=='AbortError'&&!disposed){pause();say(error.message);}});}
    function seek(value){time=Math.max(0,Math.min(timing().total,snapFrame(value,fps())));updatePosition();syncMedia(true);lastTick=performance.now();}
    function togglePlay(){
        if(playing)return pause();if(!edit.clips.length)return;
        if(time>=timing().total-0.001)seek(0);
        playing=true;updatePlay();lastTick=performance.now();syncMedia(true);animation=requestAnimationFrame(tick);
    }
    function tick(now){
        if(!playing||disposed)return;
        if(root.hidden||root.inert||!root.isConnected||!root.getClientRects().length){pause();return;}
        const span=timing().at(time);if(!span){pause();return;}
        if(!mediaReady){lastTick=now;animation=requestAnimationFrame(tick);return;}
        if(span.clip.asset.kind==='image')time+=Math.max(0,(now-lastTick)/1000);
        else if(video.readyState>=2&&!video.seeking)time=span.start+Math.max(0,video.currentTime-span.clip.start);
        lastTick=now;
        if(time>=span.end-1e-7||(span.clip.asset.kind==='video'&&video.ended)){
            time=span.end;
            if(time>=timing().total-1e-7){seek(timing().total);pause();return;}
            syncMedia(true);
        }
        updatePosition();
        const x=time*zoom;if(x>viewport.scrollLeft+viewport.clientWidth-40)viewport.scrollLeft=Math.max(0,x-40);
        animation=requestAnimationFrame(tick);
    }
    function holdFrame(){
        if(!hold.hidden)return;
        const source=!picture.hidden&&picture.complete&&picture.naturalWidth?picture:!video.hidden&&video.readyState>=2?video:null;
        if(!source)return;
        const width=source.videoWidth||source.naturalWidth,height=source.videoHeight||source.naturalHeight;
        hold.width=Math.max(1,Math.round(stage.clientWidth));hold.height=Math.max(1,Math.round(stage.clientHeight));
        const ctx=hold.getContext('2d'),ratio=(source.style.objectFit==='cover'?Math.max:Math.min)(hold.width/width,hold.height/height);
        ctx.fillStyle='#000';ctx.fillRect(0,0,hold.width,hold.height);ctx.drawImage(source,(hold.width-width*ratio)/2,(hold.height-height*ratio)/2,width*ratio,height*ratio);hold.hidden=false;
    }
    function prepareNext(){
        const list=timing().spans,current=timing().at(time),index=list.indexOf(current),next=list[index+1];
        if(!next)return;
        const clip=next.clip,url=previews.get(`${clip.asset.url}|${scale}`)?.url||clip.asset.url;
        if(clip.asset.kind==='image'){if(nextPicture.getAttribute('src')!==url)nextPicture.src=url;return;}
        if(url===video.getAttribute('src')&&Math.abs(clip.start-(current.clip.start+current.end-current.start))<1/fps())return;
        const key=`${url}|${clip.start}`;if(standbyKey===key)return;
        standbyKey=key;standbyReady=false;const player=standby;player.pause();player.muted=true;
        const ready=()=>{if(player===standby&&standbyKey===key)standbyReady=!player.seeking&&player.readyState>=2&&Math.abs(player.currentTime-clip.start)<0.5/fps();};
        player.onloadedmetadata=()=>{if(player===standby&&standbyKey===key){player.currentTime=clip.start;ready();}};
        player.onseeked=player.onloadeddata=player.oncanplay=ready;player.src=url;player.load();
    }
    function clearMedia(){
        mediaEpoch++;mediaReady=false;standbyKey='';standbyReady=false;mediaKey='';hold.hidden=true;
        for(const player of videos){player.pause();player.onloadedmetadata=player.onloadeddata=player.oncanplay=player.onseeked=null;player.removeAttribute('src');player.load();player.hidden=true;}
        picture.onload=null;picture.removeAttribute('src');picture.hidden=true;nextPicture.removeAttribute('src');
    }
    function syncMedia(force=false){
        const span=timing().at(time);empty.hidden=!!span;
        if(!span){clearMedia();requestPreview();return;}
        const clip=span.clip,key=`${clip.asset.url}|${scale}`,preview=previews.get(key),url=preview?.url||clip.asset.url;
        const next=`${clip.id}|${url}`,target=clip.start+Math.min(Math.max(0,time-span.start),Math.max(0,span.end-span.start-1/fps()));
        if(next===mediaKey&&!force)return;
        if(clip.asset.kind==='video'&&!video.hidden&&video.getAttribute('src')===url&&mediaReady&&!video.seeking&&Math.abs(video.currentTime-target)<(playing?1/fps():0.00001)){
            mediaKey=next;video.style.objectFit=clipFit(clip);video.muted=clip.mute;if(playing&&video.paused)playMedia();prepareNext();requestPreview();return;
        }
        if(clip.asset.kind==='image'&&!picture.hidden&&picture.getAttribute('src')===url&&picture.complete&&picture.naturalWidth){mediaKey=next;picture.style.objectFit=clipFit(clip);mediaReady=true;hold.hidden=true;prepareNext();requestPreview();return;}
        holdFrame();mediaKey=next;mediaReady=false;const epoch=++mediaEpoch;video.pause();
        for(const player of videos)player.style.objectFit=clipFit(clip);picture.style.objectFit=clipFit(clip);
        if(clip.asset.kind==='image'){
            video.hidden=true;picture.hidden=false;
            picture.onload=()=>{if(disposed||epoch!==mediaEpoch)return;mediaReady=true;hold.hidden=true;lastTick=performance.now();prepareNext();};
            picture.src=url;if(picture.complete&&picture.naturalWidth)picture.onload();
        }else{
            picture.hidden=true;
            const prepared=`${url}|${clip.start}`;
            if(standbyKey===prepared&&Math.abs(target-clip.start)<0.5/fps()){
                const old=video,ready=standbyReady;video=standby;standby=old;standby.hidden=true;standbyKey='';standbyReady=false;video.hidden=false;
                if(ready){mediaReady=true;hold.hidden=true;video.muted=clip.mute;if(playing)playMedia();prepareNext();requestPreview();return;}
            }
            const player=video;player.hidden=false;player.muted=clip.mute;
            const ready=()=>{
                if(disposed||epoch!==mediaEpoch||player!==video||player.seeking||player.readyState<2||Math.abs(player.currentTime-target)>0.5/fps())return;
                requestAnimationFrame(()=>{if(disposed||epoch!==mediaEpoch||player.seeking)return;mediaReady=true;hold.hidden=true;lastTick=performance.now();if(playing)playMedia();prepareNext();});
            };
            const seekLoaded=()=>{if(disposed||epoch!==mediaEpoch)return;if(Math.abs(player.currentTime-target)>0.00001)player.currentTime=target;ready();};
            player.onloadedmetadata=seekLoaded;player.onseeked=player.onloadeddata=player.oncanplay=ready;
            if(player.getAttribute('src')!==url){player.src=url;player.load();}else if(player.readyState>=1)seekLoaded();
        }
        requestPreview();
    }
    function requestPreview(force=false){
        const span=timing().at(time),key=span?`${span.clip.asset.url}|${scale}`:'';
        if(!force&&key===previewKey)return;
        previewKey=key;previewController?.abort();previewController=null;
        if(!span||scale===1||previews.has(key)){previewStatus.textContent='';if(force)syncMedia(true);return;}
        const controller=new AbortController();previewController=controller;
        previewStatus.textContent=`正在准备 ${scale}× · 当前原始预览`;
        host.proxy(span.clip.asset,scale,controller.signal).then(info=>{
            if(disposed||controller.signal.aborted||previewKey!==key)return;
            previews.set(key,info);previewStatus.textContent='';syncMedia(true);
        }).catch(error=>{if(!disposed&&error.name!=='AbortError'&&previewKey===key)previewStatus.textContent='使用原始预览 · '+error.message;});
    }
    async function syncSources(collection){
        importController?.abort();const controller=new AbortController(),epoch=++importEpoch;importController=controller;
        const assets=[];
        for(const item of collection.assets){
            if(item.missing)throw new Error('素材组有缺失素材，请先修复');
            const asset=await host.inspect(item,controller.signal);
            if(disposed||epoch!==importEpoch||controller.signal.aborted)return;
            assets.push({asset,source:item.editSource});
        }
        if(drag)finish({type:'pointercancel'});
        const next=connectedEdit(edit,assets);
        if(JSON.stringify(next)!==JSON.stringify(edit))commit(next);
    }
    function seekAtPointer(){
        const rect=viewport.getBoundingClientRect(),pixels=rect.width/viewport.offsetWidth;
        const x=Math.max(rect.left,Math.min(rect.right,drag.clientX));
        const list=timing().spans;
        let target=Math.max(0,Math.min(list.at(-1)?.end||0,((x-rect.left)/pixels+viewport.scrollLeft)/zoom));
        if(snapEnabled){
            let closest=target,distance=10/(zoom*pixels);
            for(const boundary of [0,...list.map(span=>span.end)]){
                const delta=Math.abs(boundary-target);
                if(delta<=distance){closest=boundary;distance=delta;}
            }
            target=closest;
        }
        if(Math.abs(target-time)>0.0001)seek(target);
    }
    function pointerTime(){const rect=timeline.getBoundingClientRect();return (drag.clientX-rect.left)/(rect.width/timeline.offsetWidth)/zoom;}
    function updateDrag(){
        if(drag.seek){seekAtPointer();return;}
        if(!drag.moved)return;
        const original=drag.span.clip;
        if(drag.edge){
            const delta=pointerTime()-(drag.edge==='right'?drag.span.end:drag.span.start);
            const clip=resizeClip(original,drag.edge,delta,fps()),current=edit.clips.find(c=>c.id===clip.id);
            if(clip.start===current.start&&clip.duration===current.duration)return;
            edit={...drag.before,clips:drag.before.clips.map(c=>c.id===clip.id?clip:c)};
            const previousTime=time;time=Math.min(time,timing().total);renderTrack();
            if(time!==previousTime||drag.edge==='left')syncMedia(true);
        }else{
            const firstMove=!drag.layer;
            if(firstMove){
                const tile=tiles.get(drag.id),pixels=timeline.getBoundingClientRect().width/timeline.offsetWidth;
                drag.layer=el('div','dae-ui dae-edit-drag-layer');drag.layer.style.transform=`scale(${pixels})`;
                drag.layer.append(tile);document.body.append(drag.layer);tile.style.left='0px';tile.dataset.floating='true';
                insertion.hidden=false;track.dataset.dragging='true';
            }
            drag.layer.style.left=`${drag.clientX-drag.grabX}px`;drag.layer.style.top=`${drag.clientY-drag.grabY}px`;
            const x=pointerTime();let index=drag.others.findIndex(s=>x<(s.start+s.end)/2);if(index<0)index=drag.others.length;
            if(firstMove||index!==drag.index){drag.index=index;edit={...drag.before,clips:moveClip(drag.before.clips,drag.id,index)};renderTrack();}
        }
    }
    function dragFrame(now){
        if(!drag||disposed)return;
        const rect=viewport.getBoundingClientRect(),edge=32;
        const speed=drag.clientX<rect.left+edge?-Math.min(1,(rect.left+edge-drag.clientX)/edge):drag.clientX>rect.right-edge?Math.min(1,(drag.clientX-rect.right+edge)/edge):0;
        const elapsed=Math.min(0.05,(now-drag.lastScroll)/1000);drag.lastScroll=now;
        if((drag.seek||drag.moved)&&speed)viewport.scrollLeft+=speed*480*elapsed;
        if(drag.dirty||speed){drag.dirty=false;updateDrag();}
        dragAnimation=requestAnimationFrame(dragFrame);
    }
    timeline.addEventListener('pointerdown',e=>{
        if(e.button!==0||drag)return;e.preventDefault();root.focus({preventScroll:true});pause();const tile=e.target.closest('.dae-edit-clip'),edge=e.target.closest('[data-edge]')?.dataset.edge;
        if(tile){
            if(edge)e.target.closest('[data-edge]').focus({preventScroll:true});
            selected=tile.dataset.id;const beforeSpans=timing().spans,span=beforeSpans.find(s=>s.clip.id===selected),rect=tile.getBoundingClientRect();
            drag={id:selected,edge,before:structuredClone(edit),beforeStarts:new Map(beforeSpans.map(s=>[s.clip.id,s.start])),span,others:spans(edit.clips.filter(c=>c.id!==selected)),index:edit.clips.findIndex(c=>c.id===selected),grabX:e.clientX-rect.left,grabY:e.clientY-rect.top,minWidth:timeline.offsetWidth,moved:false};
            if(!edge)seek(span.start);render();
        }else drag={seek:true,beforeTime:time};
        Object.assign(drag,{clientX:e.clientX,clientY:e.clientY,initialX:e.clientX,initialY:e.clientY,lastScroll:performance.now(),dirty:true});
        if(drag.seek)seekAtPointer();
        timeline.setPointerCapture(e.pointerId);dragAnimation=requestAnimationFrame(dragFrame);
    });
    timeline.addEventListener('pointermove',e=>{
        if(!drag)return;drag.clientX=e.clientX;drag.clientY=e.clientY;drag.dirty=true;
        if(Math.hypot(e.clientX-drag.initialX,e.clientY-drag.initialY)>3)drag.moved=true;
    });
    const finish=e=>{
        cancelAnimationFrame(dragAnimation);if(!drag)return;
        if(e.type==='pointerup'){
            if(Number.isFinite(e.clientX)){drag.clientX=e.clientX;drag.clientY=e.clientY;}
            updateDrag();
        }
        const previous=drag;drag=null;
        if(previous.layer){const tile=tiles.get(previous.id);delete tile.dataset.floating;track.append(tile);previous.layer.remove();}
        insertion.hidden=true;delete track.dataset.dragging;
        if(e.type!=='pointerup'){if(previous.before){edit=previous.before;render();syncMedia(true);}else seek(previous.beforeTime);}
        else if(previous.moved&&!previous.seek)commit(edit);
        else render();
    };
    timeline.addEventListener('pointerup',finish);timeline.addEventListener('pointercancel',finish);timeline.addEventListener('lostpointercapture',finish);
    timeline.addEventListener('keydown',e=>{const handle=e.target.closest('[data-edge]');if(handle&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();const clip=edit.clips.find(c=>c.id===handle.closest('[data-id]').dataset.id);replace(resizeClip(clip,handle.dataset.edge,(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?10:1)/fps(),fps()));}});
    root.addEventListener('keydown',e=>{
        if(e.target.closest('input,select,textarea'))return;
        if(e.key==='Escape'&&drag){e.preventDefault();finish({type:'pointercancel'});}
        else if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();pause();seek(time+(e.key==='ArrowLeft'?-1:1)/fps());const x=time*zoom;if(x<viewport.scrollLeft||x>viewport.scrollLeft+viewport.clientWidth-20)viewport.scrollLeft=Math.max(0,x-viewport.clientWidth/2);}
        else if(e.code==='Space'&&!e.target.closest('button')){e.preventDefault();togglePlay();}
        else if(e.key==='Delete'){e.preventDefault();remove.click();}
    });
    for(const event of ['pointerdown','pointermove','pointerup','dblclick','keydown','wheel'])root.addEventListener(event,e=>e.stopPropagation());
    for(const player of videos)player.onerror=()=>{if(player===video&&player.getAttribute('src')){pause();say('视频无法预览，请检查文件或编码');}};
    picture.onerror=()=>{if(picture.getAttribute('src'))say('图片无法预览，请检查文件');};
    const observer=new ResizeObserver(()=>{if(!drag)render();});observer.observe(viewport);
    const availabilityObserver=new MutationObserver(()=>{if(root.hidden||root.inert){closeClipMenu();finish({type:'pointercancel'});pause();previewController?.abort();previewKey='';}else syncMedia(true);renderThumbnails();});
    availabilityObserver.observe(root,{attributes:true,attributeFilter:['hidden','inert']});
    render();syncMedia(true);
    return {root,syncSources,pause,close(){closeClipMenu();finish({type:'pointercancel'});pause();},
        reload(){closeClipMenu();finish({type:'pointercancel'});pause();importEpoch++;importController?.abort();previews.clear();edit=host.read();scale=host.view().scale||1;zoom=host.view().zoom||64;snapEnabled=host.view().snap===true;scaleField.value=String(scale);selected=edit.clips[0]?.id;time=0;mediaKey='';previewKey='';render();syncMedia(true);},
        running(value,text=''){exporting=value;exportButton.disabled=value||!edit.clips.length;cancel.hidden=!value;if(text)say(text);},
        output(url){result.querySelector('video')?.pause();result.replaceChildren();result.hidden=!url;if(!url){if(!exporting)say('');return;}const details=el('details'),summary=el('summary','','成片预览'),movie=el('video');movie.src=url;movie.controls=true;movie.preload='metadata';details.append(summary,movie);const link=el('a','','下载成片');link.href=url;link.download='剪辑.mp4';result.append(details,link);say('导出完成');},
        error:say,
        destroy(){disposed=true;closeClipMenu();cancelAnimationFrame(dragAnimation);drag?.layer?.remove();drag=null;tiles.forEach(releaseThumbnail);tiles.clear();pause();previewController?.abort();importController?.abort();observer.disconnect();availabilityObserver.disconnect();releaseControls.forEach(release=>release());clearMedia();result.querySelector('video')?.pause();root.remove();},
    };
}
