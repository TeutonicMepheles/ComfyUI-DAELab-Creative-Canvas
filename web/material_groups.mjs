import {canvasHistory} from './creative_history.mjs';
import {createCreativeButton} from './creative_button.mjs';
import {bindCreativeField} from './creative_field.mjs';
import {canvasState,graphLinks} from './creative_canvas_model.mjs';
import {UPLOAD_TYPE} from './media_upload_model.mjs';

import {GROUP_TYPE as TYPE} from './material_group_model.mjs';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const copy=v=>JSON.parse(JSON.stringify(v));
const widget=(node,name)=>node.widgets?.find(w=>w.name===name);
export function installMaterialGroups(app){
    const history=canvasHistory(app);const view=app.daelabCreativeCanvas;if(!view||app.daelabMaterialGroups)return;
    const root=view.root,world=root.querySelector('.dae-creative-world');
    root.dataset.groupReview='true';
    const sheet=el('link');sheet.rel='stylesheet';sheet.href=new URL('./material_groups.css',import.meta.url).href;document.head.append(sheet);
    let selected=null,drag=null,renderSignature='',seenGraph=null,disposed=false,menu=null,menuTrigger=null,selectionActive=true,colorEditing=false;
    const panel=el('aside','dae-creative-toolbar gr-panel'),toast=el('div','gr-notice');
    toast.setAttribute('role','status');panel.setAttribute('aria-label','素材组选项栏');panel.setAttribute('role','toolbar');
    root.append(panel,toast);
    let noticeTimer;const say=text=>{toast.textContent=text;toast.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>toast.hidden=true,3500);};toast.hidden=true;
    const groups=()=>app.graph._nodes.filter(n=>n.type===TYPE);
    const cards=()=>canvasState(app.graph).cards;
    const node=id=>app.graph.getNodeById(id);
    const card=id=>world.querySelector(`.dae-creative-card[data-node-id="${id}"]`);
    const group=()=>node(selected)?.type===TYPE?node(selected):null;
    const dirty=()=>{app.graph.change?.();app.graph.setDirtyCanvas(true,true);};
    const change=(fn,text)=>{history.begin();fn();history.end();renderSignature='';dirty();tick();if(text)say(text);};
    const button=(label,fn,cls)=>{const b=createCreativeButton(label,fn);if(cls)b.classList.add(cls);return b;};
    const createButton=button('素材打组',createFromSelection);createButton.title='将选中素材打组 (Ctrl+G)';createButton.classList.add('gr-create-selection');createButton.hidden=true;root.append(createButton);
    function stopPanel(e){e.stopPropagation();}
    for(const event of ['pointerdown','dblclick','wheel','keydown'])panel.addEventListener(event,stopPanel);
    function createNode(type,title){const n=LiteGraph.createNode(type);if(!n)throw new Error(`缺少节点 ${type}`);app.graph.add(n);n.title=title;return n;}
    function newGroup(title,ids,x,y){const n=createNode(TYPE,title);n.properties.members=ids;cards()[n.id]={x,y,width:800,expanded:false};return n;}
    function createFromSelection(){const ids=[...world.querySelectorAll('.dae-creative-card[data-selected=true]')].map(c=>node(c.dataset.nodeId)?.id).filter(id=>node(id)?.type===UPLOAD_TYPE);if(!ids.length)return say('先选中素材，再使用 Ctrl+G 打组。');if(groups().some(g=>g.properties.locked&&g.properties.members.some(id=>ids.includes(id))))return say('请先解锁素材所在的组。');change(()=>{for(const g of groups())g.properties.members=g.properties.members.filter(id=>!ids.includes(id));const g=newGroup('新素材组',ids,Math.min(...ids.map(id=>cards()[id].x))-24,Math.min(...ids.map(id=>cards()[id].y))-80);selected=g.id;selectionActive=true;view.sync();view.select(g);},'已把选中的真实素材卡片组成新组。');}
    const layoutNames={grid:'宫格排列',horizontal:'水平排列',vertical:'垂直排列'};
    function icon(name){const i=el('i','dae-creative-icon');i.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+name+'.svg',import.meta.url).href}")`);i.setAttribute('aria-hidden','true');return i;}
    function closeMenu(focus=false){menu?.remove();menu=null;if(menuTrigger){menuTrigger.setAttribute('aria-expanded','false');if(focus&&menuTrigger.isConnected)menuTrigger.focus();}menuTrigger=null;}
    function openMenu(trigger,fill){if(menuTrigger===trigger){closeMenu(true);return;}closeMenu();menu=el('section','dae-creative-toolbar gr-local-menu');menu.setAttribute('aria-label',trigger.textContent);menuTrigger=trigger;trigger.setAttribute('aria-expanded','true');for(const event of ['pointerdown','dblclick','wheel'])menu.addEventListener(event,stopPanel);menu.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();closeMenu(true);}if(['ArrowDown','ArrowUp'].includes(e.key)&&e.target.tagName==='BUTTON'){e.preventDefault();const buttons=[...menu.querySelectorAll('button:not(:disabled)')],at=buttons.indexOf(document.activeElement);buttons[(at+(e.key==='ArrowDown'?1:buttons.length-1))%buttons.length]?.focus();}});root.append(menu);fill(menu);positionPanel();menu.querySelector('button:not(:disabled),select,input')?.focus({preventScroll:true});}
    function buildPanel(){
        closeMenu();panel.replaceChildren();const g=group();if(!g)return;
        const arrange=button(layoutNames[g.properties.layout]+' ▾',()=>openMenu(arrange,list=>{
            for(const [mode,label] of Object.entries(layoutNames)){const item=button(label,()=>{change(()=>g.properties.layout=mode,'已更新排列，素材输出顺序保持不变。');panel.querySelector('[data-layout-trigger]')?.focus();});item.prepend(icon(mode==='grid'?'layout-grid-line':mode==='horizontal'?'artboard-line':'arrow-down-line'));item.setAttribute('aria-pressed',String(g.properties.layout===mode));item.disabled=g.properties.locked;list.append(item);}
        }));arrange.prepend(icon('layout-grid-line'));arrange.dataset.layoutTrigger='true';arrange.setAttribute('aria-haspopup','true');arrange.setAttribute('aria-expanded','false');arrange.title='选择组内排列方式';
        const options=button('组选项 ▾',()=>openMenu(options,list=>{
            list.append(button(g.properties.collapsed?'展开组':'收起组',()=>change(()=>g.properties.collapsed=!g.properties.collapsed,'展示已更新，整组输出不变。')),button(g.properties.locked?'解锁组':'锁定组',()=>change(()=>g.properties.locked=!g.properties.locked,'组锁定状态已更新。')),button('重命名',()=>{list.replaceChildren();const input=el('input');input.value=g.title;input.setAttribute('aria-label','组名称');bindCreativeField(input);const save=()=>{change(()=>g.title=input.value.trim()||g.title,'组名称已更新。');};list.append(input,button('保存名称',save));input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)save();});input.focus();input.select();positionPanel();}),button('解散组',()=>{change(()=>{for(const id of g.properties.members){const c=card(id);if(c)c.style.display='';}app.graph.remove(g);delete cards()[g.id];selected=null;selectionActive=false;},'已解散，素材保留。');}));
            const actionIcons=[g.properties.collapsed?'arrow-down-line':'arrow-up-line',g.properties.locked?'lock-unlock-line':'lock-line','edit-line','scissors-cut-line'];[...list.children].filter(e=>e.tagName==='BUTTON').forEach((b,i)=>b.prepend(icon(actionIcons[i])));
        }));options.prepend(icon('folder-image-line'));options.setAttribute('aria-haspopup','true');options.setAttribute('aria-expanded','false');
            const colors=el('div','gr-color-row');colors.setAttribute('aria-label','组颜色');
            for(const [name,value] of Object.entries({灰色:'#909090',蓝色:'#b8c4ff',绿色:'#a2d5ba',黄色:'#efca83',珊瑚:'#ffb4ab'})){const swatch=button('',()=>change(()=>g.properties.reviewColor=value,'组颜色已更新。'),'gr-swatch');swatch.title=name;swatch.setAttribute('aria-label',name);swatch.setAttribute('aria-pressed',String(g.properties.reviewColor===value));swatch.style.setProperty('--gr-swatch',value);colors.append(swatch);}
            const custom=el('label','gr-custom-color');custom.title='自定义组颜色';custom.append(icon('palette-line'));const picker=el('input');picker.type='color';picker.setAttribute('aria-label','自定义组颜色');picker.value=/^#[0-9a-f]{6}$/i.test(g.properties.reviewColor||'')?g.properties.reviewColor:'#909090';
            picker.addEventListener('input',()=>{if(!colorEditing){history.begin();colorEditing=true;}g.properties.reviewColor=picker.value;g.properties.reviewCustomColor=picker.value;card(g.id)?.style.setProperty('--gr-group-color',picker.value);custom.style.background=picker.value;custom.style.color='#141414';});
            const commitColor=()=>{if(!colorEditing)return;history.end();colorEditing=false;dirty();renderSignature='';tick();say('自定义颜色已更新。');};picker.addEventListener('change',commitColor);picker.addEventListener('blur',commitColor);
            if(g.properties.reviewCustomColor){const value=g.properties.reviewCustomColor;const swatch=button('',()=>change(()=>g.properties.reviewColor=value,'组颜色已更新。'),'gr-swatch');swatch.title='自定义颜色 '+value;swatch.setAttribute('aria-label','自定义颜色 '+value);swatch.setAttribute('aria-pressed',String(g.properties.reviewColor===value));swatch.style.setProperty('--gr-swatch',value);colors.append(swatch);custom.style.background=value;custom.style.color='#141414';}
            custom.append(picker);colors.append(custom);
        const numbers=button('序号',()=>change(()=>g.properties.showNumbers=g.properties.showNumbers===false,'素材序号显示已更新。'));numbers.prepend(icon('list-ordered'));numbers.title='显示素材序号';numbers.classList.add('gr-number-toggle');numbers.setAttribute('aria-pressed',String(g.properties.showNumbers!==false));
        const remove=button('删除组',()=>change(()=>{const ids=new Set([g.id,...g.properties.members]);for(const other of groups())if(!ids.has(other.id))other.properties.members=other.properties.members.filter(id=>!ids.has(id));for(const id of ids){const n=node(id);if(n)app.graph.remove(n);delete cards()[id];}selected=null;selectionActive=false;view.sync();},'已删除组及内部节点，可撤销。'),'gr-delete-group');remove.prepend(icon('delete-bin-line'));remove.title='删除组及内部节点（可撤销）';
        panel.append(arrange,el('span','gr-divider'),numbers,el('span','gr-divider'),colors,el('span','gr-divider'),options,el('span','gr-divider'),remove);
    }
    const decorated=new Map();
    function restoreMedia(){for(const [upload,bar] of decorated){const info=upload.querySelector('.dae-upload-info');if(info)bar.prepend(info);upload.querySelector('.gr-metadata-clip')?.remove();for(const action of bar.querySelectorAll('.gr-media-action')){action.textContent=action.getAttribute('aria-label');action.classList.remove('gr-media-action');action.style.removeProperty('right');}}decorated.clear();}
    function onHide(){if(drag){const current=drag;drag=null;restoreDrag(current);}if(colorEditing){colorEditing=false;history.end();}restoreMedia();}
    root.addEventListener('dae-canvas-hide',onHide);
    function decorateMedia(){
        for(const upload of decorated.keys())if(!upload.isConnected)decorated.delete(upload);
        for(const c of world.querySelectorAll('.dae-creative-card[data-upload=true]')){
            const bar=c.querySelector('.dae-upload-toolbar');if(!bar)continue;
            const upload=c.querySelector('.dae-upload'),info=bar.querySelector('.dae-upload-info');decorated.set(upload,bar);if(info){let overlay=upload.querySelector('.gr-metadata-clip');if(!overlay){overlay=el('div','gr-metadata-clip');upload.append(overlay);}overlay.append(info);}
            c.dataset.reviewCompactActions=String((c.querySelector('.dae-upload-stage')?.getBoundingClientRect().width||0)<160);
            const visibleActions=[...bar.querySelectorAll('button,a')].filter(action=>!action.hidden);
            visibleActions.forEach((action,index)=>action.style.right=((6+(visibleActions.length-1-index)*42)/(canvasState(app.graph).viewport.zoom||1))+'px');
            [...bar.querySelectorAll('button,a')].forEach((action,index)=>{const label=index===0?(action.textContent.includes('上传')?'上传图片 / 视频':action.textContent||action.getAttribute('aria-label')||'替换素材'):index===1?'下载':'全屏';action.setAttribute('aria-label',label);action.title=label;action.classList.add('gr-media-action');if(!action.querySelector('.dae-creative-icon'))action.replaceChildren(icon(['arrow-left-right-line','download-line','fullscreen-line'][index]));});
        }
    }
    function layoutGroups(){
        for(const c of world.querySelectorAll('.dae-creative-card')){delete c.dataset.reviewMember;delete c.dataset.reviewNumbers;c.querySelector('.dae-upload-stage')?.removeAttribute('data-review-index');c.style.display='';}
        const owned=new Set();
        for(const g of groups()){
            const gc=card(g.id),p=cards()[g.id];if(!gc||!p)continue;gc.dataset.reviewGroup='true';gc.dataset.wireAnchor='border';gc.style.setProperty('--gr-group-color',g.properties.reviewColor||'var(--dae-border-control)');gc.dataset.reviewSelected=String(selectionActive&&g.id===selected);gc.dataset.reviewCollapsed=String(g.properties.collapsed);
            const ids=(g.properties.members||[]).filter(id=>{if(node(id)?.type!==UPLOAD_TYPE||owned.has(id))return false;owned.add(id);return true;});g.properties.members=ids;
            const count=g.properties.layout==='vertical'?1:g.properties.layout==='horizontal'?Math.max(1,ids.length):Math.min(2,Math.max(1,ids.length));
            const gap=6,padding=12;
            p.width=g.properties.collapsed?450:count*350+(count-1)*gap+padding*2;
            let y=Math.max(48,58/(canvasState(app.graph).viewport.zoom||1)),maxBottom=y;
            for(let i=0;i<ids.length;i++){
                const id=ids[i],c=card(id);if(!c)continue;
                if(i%count===0&&ids.slice(i,i+count).some(mid=>card(mid)?.dataset.selected==='true'))y+=28/(canvasState(app.graph).viewport.zoom||1);c.dataset.reviewMember=String(g.id);c.dataset.reviewIndex=String(i+1);c.dataset.reviewNumbers=String(g.properties.showNumbers!==false);const stage=c.querySelector('.dae-upload-stage');if(stage&&g.properties.showNumbers!==false)stage.dataset.reviewIndex=String(i+1);c.style.display=g.properties.collapsed?'none':'';
                const cp=cards()[id];if(!cp)continue;
                if(!drag?.ids?.includes(id))Object.assign(cp,{x:p.x+padding+(i%count)*(350+gap),y:p.y+y,width:350});
                c.style.left=cp.x+'px';c.style.top=cp.y+'px';c.style.width=cp.width+'px';
                const rowHeight=c.offsetHeight;maxBottom=Math.max(maxBottom,y+rowHeight);
                if(i%count===count-1)y=maxBottom+gap;
            }
            gc.style.width=p.width+'px';gc.style.height=(g.properties.collapsed?100:Math.max(120,maxBottom+padding))+'px';
            let badge=gc.querySelector('.gr-group-count');if(!badge){badge=el('span','gr-group-count');gc.querySelector('.dae-creative-heading').append(badge);}badge.style.display=p.width*(canvasState(app.graph).viewport.zoom||1)<300?'none':'';badge.textContent=`${ids.length} 项 · 整组输出${g.properties.locked?' · 已锁定':''}`;
            const port=gc.querySelector('[data-side=output][data-slot]');if(port){port.setAttribute('aria-label',`${g.title} 整组素材输出`);port.title=`整组输出 · ${ids.length} 项`;}
        }
    }
    function positionPanel(){
        const gc=card(group()?.id),r=gc?.getBoundingClientRect(),b=root.getBoundingClientRect();
        panel.hidden=!selectionActive||!r||r.bottom<b.top||r.top>b.bottom||r.right<b.left||r.left>b.right;
        if(panel.hidden){closeMenu();return;}
        const safeTop=54;
        panel.style.left=Math.max(12,Math.min(r.left-b.left,root.clientWidth-panel.offsetWidth-12))+'px';
        let top=r.top-b.top-panel.offsetHeight-12;
        if(top<safeTop)top=r.bottom-b.top+12;
        panel.style.top=Math.max(safeTop,Math.min(top,root.clientHeight-panel.offsetHeight-65))+'px';
        if(menu&&menuTrigger){const anchor=menuTrigger.getBoundingClientRect(),height=menu.offsetHeight;menu.style.left=Math.max(12,Math.min(anchor.left-b.left,root.clientWidth-menu.offsetWidth-12))+'px';let y=anchor.top-b.top-height-10;if(y<safeTop)y=anchor.bottom-b.top+10;menu.style.top=Math.max(safeTop,Math.min(y,root.clientHeight-height-15))+'px';}
    }
    const pulseStarts=new Map();
    function updateWirePulse(){
        const svg=root.querySelector('.dae-creative-wires');if(!svg)return;
        const active=new Set([...world.querySelectorAll('.dae-creative-card[data-selected=true]')].map(c=>String(c.dataset.nodeId)));
        if(selectionActive&&selected!=null)active.add(String(selected));
        const links=new Map(graphLinks(app.graph).map(l=>[String(l.id),l]));
        const wanted=new Set();
        for(const path of [...svg.querySelectorAll('path[data-link-id]:not(.gr-wire-pulse)')]){
            const id=path.dataset.linkId,link=links.get(id);if(!link||(!active.has(String(link.origin_id))&&!active.has(String(link.target_id))))continue;
            wanted.add(id);let pulse=svg.querySelector(`.gr-wire-pulse[data-pulse-link="${id}"]`);
            if(!pulse){pulse=document.createElementNS(svg.namespaceURI,'path');pulse.classList.add('gr-wire-pulse');pulse.dataset.pulseLink=id;pulse.setAttribute('aria-hidden','true');pulse.setAttribute('pathLength','1000');if(!pulseStarts.has(id))pulseStarts.set(id,performance.now());pulse.style.animationDelay=`-${(performance.now()-pulseStarts.get(id))/1000}s`;svg.append(pulse);}
            pulse.setAttribute('d',path.getAttribute('d'));
        }
        for(const pulse of svg.querySelectorAll('.gr-wire-pulse'))if(!wanted.has(pulse.dataset.pulseLink))pulse.remove();
        for(const id of pulseStarts.keys())if(!wanted.has(id))pulseStarts.delete(id);
    }
    function tick(){
        if(disposed)return;if(!view.active){closeMenu();createButton.hidden=true;restoreMedia();return;}
        if(seenGraph!==app.graph.extra){seenGraph=app.graph.extra;selected=null;selectionActive=false;renderSignature='';closeMenu();}
        const chosen=view.selectedIds.map(node).filter(Boolean);createButton.hidden=chosen.filter(n=>n.type===UPLOAD_TYPE).length<2;const chosenGroup=chosen.find(n=>n.type===TYPE)||groups().find(g=>chosen.some(n=>g.properties.members.includes(n.id)));
        if(!drag){const next=chosenGroup?.id??null;if(next!==selected){selected=next;renderSignature='';}selectionActive=selected!=null;}
        root.style.setProperty('--gr-inverse-zoom',String(1/(canvasState(app.graph).viewport.zoom||1)));decorateMedia();layoutGroups();positionPanel();
        const g=group(),signature=JSON.stringify([selected,g?.title,g?.properties]);
        if(!colorEditing&&signature!==renderSignature){renderSignature=signature;buildPanel();}
        updateWirePulse();
    }
    // Track native card dragging; only group-title dragging needs collective movement.
    function down(e){
        if(e.button===0&&!e.target.closest('.gr-local-menu,.gr-panel'))closeMenu();
        if(e.button!==0||e.target.closest('button,input,select,textarea,.gr-panel,.gr-create-selection'))return;
        const c=e.target.closest('.dae-creative-card'),n=c&&node(c.dataset.nodeId);if(!n){if(!e.target.closest('.gr-local-menu'))selectionActive=false;return;}
        if(n.type===TYPE){selected=n.id;selectionActive=true;view.select(n,{toggle:e.shiftKey||e.ctrlKey,preserve:true});renderSignature='';e.stopImmediatePropagation();e.preventDefault();if(n.properties.locked)return say('组已锁定。');history.begin();const ids=[n.id,...n.properties.members];drag={kind:'group',ids,x:e.clientX,y:e.clientY,originals:copy(Object.fromEntries(ids.map(id=>[id,cards()[id]]))),before:copy(app.graph.serialize())};e.target.setPointerCapture(e.pointerId);}
        else if(n.type===UPLOAD_TYPE){
            const video=e.target.closest('video');if(video&&e.clientY>video.getBoundingClientRect().bottom-44)return;
            view.select(n,{toggle:e.shiftKey||e.ctrlKey,preserve:true});
            const parent=groups().find(g=>g.properties.members.includes(n.id));if(parent?.properties.locked){e.stopImmediatePropagation();return say('所在组已锁定。');}
            e.stopImmediatePropagation();e.preventDefault();root.focus({preventScroll:true});history.begin();drag={kind:'member',parentId:parent?.id,ids:[n.id],x:e.clientX,y:e.clientY,originals:copy({[n.id]:cards()[n.id]}),before:copy(app.graph.serialize())};e.target.setPointerCapture(e.pointerId);if(parent){selected=parent.id;selectionActive=true;}
        }
    }
    function move(e){if(!drag)return;const z=canvasState(app.graph).viewport.zoom;{e.stopImmediatePropagation();for(const id of drag.ids){const original=drag.originals[id];if(original&&cards()[id])Object.assign(cards()[id],{x:original.x+(e.clientX-drag.x)/z,y:original.y+(e.clientY-drag.y)/z});}view.sync();layoutGroups();positionPanel();}if(drag.kind==='member'){
        for(const g of groups()){const gc=card(g.id),r=gc?.getBoundingClientRect();if(gc)gc.dataset.reviewOver=String(!g.properties.locked&&r&&e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom);}
    }}
    function up(e){if(!drag)return;const current=drag;drag=null;for(const gc of world.querySelectorAll('[data-review-over]'))delete gc.dataset.reviewOver;if(e.type==='pointercancel')return restoreDrag(current);if(Math.hypot(e.clientX-current.x,e.clientY-current.y)<4){history.end();return;}

        if(current.kind==='member'){
            const id=current.ids[0],target=groups().find(g=>{const r=card(g.id)?.getBoundingClientRect();return !g.properties.locked&&r&&e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom;});
            for(const g of groups())g.properties.members=g.properties.members.filter(x=>x!==id);
            if(target){const r=root.getBoundingClientRect(),v=canvasState(app.graph).viewport,x=(e.clientX-r.left-v.x)/v.zoom,y=(e.clientY-r.top-v.y)/v.zoom;const at=target.properties.members.findIndex(mid=>{const cp=cards()[mid];return cp&&(y<cp.y+80||(y<cp.y+280&&x<cp.x+cp.width/2));});target.properties.members.splice(at<0?target.properties.members.length:at,0,id);selected=target.id;say('已加入素材组并按落点排序；整组输出同步更新。');}else if(current.parentId!=null)say('已移出素材组；真实素材卡片和源文件保留。');
        }
        for(const id of current.ids){const n=node(id);if(n)n.properties.daelabLayoutRevision=(n.properties.daelabLayoutRevision||0)+1;}
        history.end();dirty();renderSignature='';tick();
    }
    function restoreDrag(current){const saved=current.before.extra?.daelabCreativeCanvasV1?.cards||{};for(const [id,layout] of Object.entries(saved))if(cards()[id])Object.assign(cards()[id],layout);history.end();view.sync();renderSignature='';tick();say('已取消拖动并恢复原位置。');}
    function key(e){if(e.target.closest('input,textarea,select,[contenteditable=true]'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='g'){e.preventDefault();e.stopImmediatePropagation();createFromSelection();return;}if(e.key==='Escape'&&drag){const current=drag;drag=null;if(current.kind==='group')e.stopImmediatePropagation();restoreDrag(current);}}
    root.addEventListener('pointerdown',down,true);root.addEventListener('pointermove',move,true);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);root.addEventListener('keydown',key,true);
    const timer=setInterval(tick,150);
    app.daelabMaterialGroups={createFromSelection,tick,destroy(){closeMenu();disposed=true;clearInterval(timer);clearTimeout(noticeTimer);root.removeEventListener('pointerdown',down,true);root.removeEventListener('pointermove',move,true);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',up);root.removeEventListener('keydown',key,true);panel.remove();toast.remove();createButton.remove();sheet.remove();restoreMedia();root.removeEventListener('dae-canvas-hide',onHide);}};
    tick();
}
