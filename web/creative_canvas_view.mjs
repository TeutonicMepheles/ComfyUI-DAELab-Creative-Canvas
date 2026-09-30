import {canvasHistory} from './creative_history.mjs';
import {collectionFor,GROUP_TYPE,expandGroupSelection,remapGroupMembers,suppressGroupSlots} from './material_group_model.mjs';
import {adapterFor} from './creative_contract.mjs';
import {wheelViewport,copySnapshot,readSnapshot} from './creative_navigation.mjs';
import {UPLOAD_TYPE,mediaKind} from './media_upload_model.mjs';
import {MATERIAL_SLOT,uploadKind,sourceSlots,resolveOutput,targetChoices,outputSelector,inputSelector,unifiedNode,inputSlots} from './creative_connections.mjs';
import {menuItems,canConnectDefinition,matchingSlot} from './creative_canvas_catalog.mjs';
import {createFieldGallery} from './creative_field_gallery.mjs';
import {bindCreativeField} from './creative_field.mjs';
import {createCreativeButton,bindCreativeButton} from './creative_button.mjs';
import {canvasState,cardState,supportedNode,workspaceNode,cardWidth,zoomAt,socketCompatible,graphLinks} from './creative_canvas_model.mjs?v=20260929-layout1';

const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const button=(text,action)=>{const b=el('button','',text);b.type='button';b.onclick=action;return b;};
const categoryIcon=item=>{const icon=el('i','dae-creative-icon');icon.style.setProperty('--dae-icon',`url("${new URL(`./vendor/remixicon/${item.icon}.svg`,import.meta.url).href}")`);icon.setAttribute('aria-hidden','true');return icon;};
const value=(n,name)=>n.widgets?.find(w=>w.name===name)?.value;
const previewFor=n=>adapterFor(n)?.preview?.(n)||{};
// Lease the actual panel, not a clone: Vue Teleports, callbacks and editor history stay alive.
export function leasePanel(panel,target,buttons=[],fields=[]) {
    const parent=panel.parentNode, marker=document.createComment('DAELAB creative panel return');
    if(parent)parent.insertBefore(marker,panel);
    target.append(panel);
    const unbind=[...buttons.filter(b=>panel.contains(b)).map(bindCreativeButton),...fields.filter(f=>panel.contains(f)).map(bindCreativeField)];
    const cleanup=()=>unbind.forEach(release=>release());
    const release=()=>{cleanup();panel.querySelectorAll('video,audio').forEach(m=>m.pause());if(marker.parentNode)marker.replaceWith(panel);else if(parent?.isConnected)parent.append(panel);};
    release.abandon=()=>{cleanup();marker.remove();};return release;
}

export function createCreativeCanvas(app,{onExit=()=>{}}={}) {
    const history=canvasHistory(app);
    const root=el('section','dae-creative');root.setAttribute('aria-label','创作画布');root.tabIndex=-1;
    const grid=el('div','dae-creative-grid'),world=el('div','dae-creative-world');
    const wires=document.createElementNS('http://www.w3.org/2000/svg','svg');wires.classList.add('dae-creative-wires');world.append(wires);
    const status=el('div','dae-creative-status','中键拖动 · 左键框选 · 滚轮上下 · Shift 滚轮左右 · Ctrl 滚轮缩放 · Ctrl+G 打组 · Ctrl+Z 撤销 · Ctrl+C/V 复制粘贴 · Del 删除');status.setAttribute('role','status');
    const empty=el('div','dae-creative-empty');empty.append(el('strong','','从一个素材开始'),el('span','','拖入图片或视频，或双击空白处添加节点'));
    const marquee=el('div','dae-creative-marquee');marquee.hidden=true;root.append(marquee);
    const zoom=el('div','dae-creative-zoom'),zoomLabel=el('span','','100%');
    root.append(grid,world,status,empty,zoom);document.body.append(root);
    let graph=app.graph,state=canvasState(graph),selected=new Set(),pending=null,picker=null,visible=false,drag=null;
    const portStarts=new WeakMap();let magneticPort=null,wireSource=null;let pointerPoint=null,pasteCount=0;
    const wirePaths=new Map(),wireGeometry=new WeakMap();
    const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');let wireFrame=0,hoverPoint=null;
    function animateWires(){if(!wireFrame&&visible)wireFrame=requestAnimationFrame(()=>{
        wireFrame=0;
        if(hoverPoint&&!drag){const {x,y}=hoverPoint;setMagnet(nearestPort(x,y),hoverPoint);setIncomingWire(selectedLink??nearestIncoming(graphLinks(graph),x,y)?.id??null);}
        hoverPoint=null;drawWires();
    });}
    const cards=new Map();let fieldGallery=null,selectedLink=null,addPoint=null,pickerConnection=null,workspace=null;
    const dirty=()=>{graph.setDirtyCanvas?.(true,true);graph.change?.();};
    const message=text=>{status.textContent=text;};
    const canConnectOutput=node=>adapterFor(node)?.canConnectOutput?.(node)!==false;
    function viewport(){setMagnet(null);const v=state.viewport;root.style.setProperty('--dae-canvas-zoom',String(v.zoom));root.style.setProperty('--dae-canvas-inverse-zoom',String(1/v.zoom));world.style.transform=`translate(${v.x}px,${v.y}px) scale(${v.zoom})`;grid.style.backgroundSize=`${24*v.zoom}px ${24*v.zoom}px`;grid.style.backgroundPosition=`${v.x}px ${v.y}px`;zoomLabel.textContent=`${Math.round(v.zoom*100)}%`;for(const c of cards.values())update(c);}
    function setZoom(factor){state.viewport=zoomAt(state.viewport,{x:root.clientWidth/2,y:root.clientHeight/2},factor);viewport();dirty();}
    zoom.append(button('−',()=>setZoom(0.8)),zoomLabel,button('+',()=>setZoom(1.25)),button('适应',fit));
    function fit(){
        const list=[...cards.values(),...(fieldGallery?[{layout:{x:graph.extra.daelabControlGallery.x,y:graph.extra.daelabControlGallery.y,width:480},element:fieldGallery.root}]:[])];if(!list.length){state.viewport={x:60,y:60,zoom:.8};viewport();return;}
        const minX=Math.min(...list.map(c=>c.layout.x-(unifiedNode(c.node||{})?60:0))),minY=Math.min(...list.map(c=>c.layout.y));
        const maxX=Math.max(...list.map(c=>c.layout.x+c.layout.width+(unifiedNode(c.node||{})?60:0))),maxY=Math.max(...list.map(c=>c.layout.y+c.element.offsetHeight));
        const z=Math.max(.15,Math.min(1,(root.clientWidth-100)/(maxX-minX),(root.clientHeight-150)/(maxY-minY)));
        state.viewport={x:50-minX*z,y:50-minY*z,zoom:z};viewport();dirty();
    }
    const panelFor=node=>adapterFor(node)?.panel?.(node)?.root;
    function paintSelection(){for(const c of cards.values()){c.element.dataset.selected=String(selected.has(c.node.id));c.element.dataset.slotsSuppressed=String(suppressGroupSlots(graph,c.node,selected));}}
    function select(node,{toggle=false,preserve=false}={}){selectedLink=null;if(!node)selected.clear();else if(toggle){if(selected.has(node.id))selected.delete(node.id);else selected.add(node.id);}else if(!preserve||!selected.has(node.id)){selected.clear();selected.add(node.id);}paintSelection();}
    function connect(node,index,side){
        if(side==='output'){pending={node,index};message(`已选择 ${node.title} 的 ${node.outputs[index].name}，点击目标输入连接；Esc 取消`);return;}
        if(!pending){message('请先点击来源卡片的输出接口');return;}
        const source=pending;pending=null;
        if(!canConnectOutput(source.node))return;
        const output=resolveOutput(source.node,source.index,node.inputs?.[index]?.type);
        if(source.node===node||output<0){message('素材与目标接口不兼容，未更改连线');return;}
        // Replacement is explicit; existing connections are never silently discarded.
        if(node.inputs[index].link!=null&&!window.confirm('该输入已有连接，替换为新连接？'))return;
        const link=source.node.connect(output,node,index);
        message(link?'已连接，可在当前画布继续操作':'连接未建立，请检查接口类型');dirty();sync();return link;
    }
    function ports(c){
        const signature=JSON.stringify([uploadKind(c.node),c.layout.portsExpanded,c.node.inputs?.map(i=>[i.name,i.type,i.link]),c.node.outputs?.map(o=>[o.name,o.type,o.links])]);
        if(c.portSignature===signature)return;c.portSignature=signature;c.ports.replaceChildren();
        for(const side of ['input','output']){
            const group=el('div');group.dataset.side=side;c.ports.append(group);
            const material=c.node.type===UPLOAD_TYPE,unified=unifiedNode(c.node);
            const indices=side==='input'?inputSlots(c.node):sourceSlots(c.node,MATERIAL_SLOT);
            const entries=unified?((indices.length||(material&&side==='output'))?[[MATERIAL_SLOT,{name:side==='input'?'输入':'输出',type:'*',link:indices.some(i=>c.node.inputs?.[i]?.link!=null)?1:null,links:c.node.outputs?.flatMap(o=>o.links||[])}]]:[]):[...(c.node[side==='input'?'inputs':'outputs']||[]).entries()];
            for(const [i,p] of entries){
                if(side==='input'&&p.widget&&p.link==null)continue;
                const b=button(unified?'+':'',()=>{});if(unified)b.classList.add('dae-material-slot');
                b.disabled=material&&!uploadKind(c.node);
                // A magnetic hit may originate on the port wrapper; do not also start a group drag.
                const startWire=e=>{if(e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();
                    if(side==='output'&&!canConnectOutput(c.node))return;
                    const links=graphLinks(graph).filter(link=>side==='input'?link.target_id===c.node.id&&(i===MATERIAL_SLOT||link.target_slot===i):link.origin_id===c.node.id&&(i===MATERIAL_SLOT||link.origin_slot===i));
                    if(side==='input'&&links.length){const link=links.find(link=>link.id===selectedLink)||(links.length===1?links[0]:nearestIncoming(links,e.clientX,e.clientY));if(!link){message('请沿要断开的连线靠近接收端，再拖动圆点');return;}closePicker();selectWire(link.id);setMagnet(null);root.focus();drag={kind:'detach',id:link.id,x:e.clientX,y:e.clientY,point:{x:e.clientX,y:e.clientY}};setMagnet(b);root.setPointerCapture(e.pointerId);drawWires();return;}
                    closePicker();select(c.node);root.focus();drag={kind:'wire',node:c.node,index:i,side,slot:p,mediaKind:material?uploadKind(c.node):null,x:e.clientX,y:e.clientY};setWireSource(b);root.setPointerCapture(e.pointerId);
                };portStarts.set(b,startWire);b.addEventListener('pointerdown',startWire);
                b.dataset.side=side;b.dataset.slot=String(i);b.dataset.linked=String(side==='input'?p.link!=null:!!p.links?.length);b.title=`${p.name} · ${p.type}`;
                if(unified)b.title=b.disabled?'上传素材后可连接':side==='input'?'拖入素材，自动匹配用途':'拖到目标节点，自动匹配用途';
                if(side==='input'&&b.dataset.linked==='true'){b.textContent='●';b.title='沿目标连线靠近此接收端，拖开以断开高亮连线';}
                const outputLabel=side==='output'&&unified?adapterFor(c.node)?.outputLabel:null;
                if(outputLabel)b.title=outputLabel;
                b.setAttribute('aria-label',`${c.node.title} ${side==='input'?'输入':'输出'} ${outputLabel||p.name}`);group.append(b);
            }
        }
    }
    const outputPending=new WeakSet();let suppressSourceClick=false;
    root.addEventListener('click',e=>{if(suppressSourceClick){suppressSourceClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
    function materialSources(c){
        for(const source of adapterFor(c.node)?.materialSources?.(c.node)||[]){
            const b=source.element;if(!b||portStarts.has(b))continue;
            b.classList.add('dae-material-slot');b.textContent='+';b.dataset.side='output';b.dataset.materialSource=source.key;
            b.setAttribute('aria-label',source.label||'输出素材');b.title=source.label||'拖到空白处输出素材组';
            const start=e=>{if(e.button!==0||!visible||graph.getNodeById(c.node.id)!==c.node)return;e.preventDefault();e.stopImmediatePropagation();
                closePicker();select(c.node);root.focus();drag={kind:'wire',node:c.node,index:MATERIAL_SLOT,side:'output',materialKey:source.key,element:b,x:e.clientX,y:e.clientY};setWireSource(b);root.setPointerCapture(e.pointerId);};
            portStarts.set(b,start);b.addEventListener('pointerdown',start);
            b.onclick=e=>{if(!visible||graph.getNodeById(c.node.id)!==c.node)return;e.preventDefault();e.stopPropagation();const r=root.getBoundingClientRect(),a=b.getBoundingClientRect();choose({x:a.right-r.left+40,y:a.bottom-r.top+40},{node:c.node,side:'output',materialKey:source.key,element:b,index:MATERIAL_SLOT});};
        }
    }
    function snapshotFor(context){return context.materialKey!==undefined?adapterFor(context.node)?.outputMaterials?.(context.node,context.materialKey):adapterFor(context.node)?.assets?.(context.node);}
    async function outputMaterials(context,point){
        if(outputPending.has(context.node))return;outputPending.add(context.node);
        const ownerGraph=graph,ownerState=state,created=[];
        try{
            const snapshot=snapshotFor(context);
            if(!snapshot||snapshot.ready===false||!snapshot.assets?.length)throw new Error('当前没有有效的已完成素材');
            const frozen=JSON.parse(JSON.stringify(snapshot)),stamp=JSON.stringify(snapshot);
            message('正在导入本地素材…');
            const response=await fetch('/daelab/creative/material-output',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({assets:frozen.assets})});
            const data=await response.json();if(!response.ok)throw new Error(data.error||'素材导入失败');
            if(!visible||graph!==ownerGraph||app.graph!==ownerGraph||state!==ownerState||!validConnection(context)||JSON.stringify(snapshotFor(context))!==stamp)throw new Error('来源或结果已变化，请重新输出');
            if(!Array.isArray(data.assets)||data.assets.length!==frozen.assets.length)throw new Error('素材导入数量不一致');
            history.begin();
            try{
                for(const [i,asset] of data.assets.entries()){
                    const node=add(UPLOAD_TYPE,{x:point.x+(i%3)*300*state.viewport.zoom,y:point.y+Math.floor(i/3)*240*state.viewport.zoom});if(!node)throw new Error('素材节点未加载');created.push(node);
                    const widget=node.widgets?.find(w=>w.name==='asset_data');if(!widget)throw new Error('素材节点格式不兼容');widget.value=JSON.stringify(asset);node.title=asset.name;node.properties.materialOutputSource={nodeId:String(context.node.id),key:context.materialKey??null,...asset.provenance};node.__mediaUpload?.reload?.();
                }
                if(context.materialKey!==undefined||frozen.assets.length>1){const group=add(GROUP_TYPE,point);if(!group)throw new Error('素材组节点未加载');created.push(group);group.title=frozen.label||context.node.title+' · 输出';group.properties.members=created.slice(0,-1).map(n=>n.id);group.properties.collapsed=false;const collection=group.widgets?.find(w=>w.name==='collection_data');if(collection)collection.value=JSON.stringify(collectionFor(group));select(group);}
            }catch(error){for(const node of created){graph.remove(node);delete state.cards[node.id];}throw error;}
            finally{dirty();sync();app.daelabMaterialGroups?.tick?.();dirty();history.end();}
            root.focus({preventScroll:true});message(`已输出 ${data.assets.length} 个素材${frozen.skipped?'，跳过 '+frozen.skipped+' 行':''}`);
        }catch(error){message('输出失败：'+error.message);}finally{outputPending.delete(context.node);}
    }
    function nativeFields(c){
        // Parameters left outside ComfyTV's rich widget still need editable controls.
        c.fields.replaceChildren();c.fieldBindings=[];
        for(const w of c.node.widgets||[]){
            if(w.hidden||w.options?.hidden||w.type==='button'||w.type==='custom'||w.serialize===false||typeof w.value==='object'||w.element)continue;
            const label=el('label','',w.label||w.name);label.style.cssText='display:flex;flex-direction:column;gap:5px;margin:8px';
            const choices=typeof w.options?.values==='function'?w.options.values():w.options?.values;
            const input=el(Array.isArray(choices)?'select':typeof w.value==='string'&&w.value.length>100?'textarea':'input');
            if(Array.isArray(choices))for(const opt of choices)input.add(new Option(opt,opt));
            else if(typeof w.value==='boolean')input.type='checkbox';else if(typeof w.value==='number'){input.type='number';input.step='any';if(w.options?.min!=null)input.min=w.options.min;if(w.options?.max!=null)input.max=w.options.max;}
            input.value=w.value??'';input.checked=!!w.value;input.setAttribute('aria-label',w.name);
            input.onchange=e=>{w.value=typeof w.value==='boolean'?input.checked:typeof w.value==='number'?Number(input.value):input.value;w.callback?.(w.value,app.canvas,c.node,null,e);dirty();};
            label.append(input);c.fields.append(label);c.fieldBindings.push({w,input});
        }
    }
    function attach(c){
        const panel=panelFor(c.node);if(!panel||panel.parentNode===c.body||panel.closest('dialog')||!panel.isConnected)return;
        // The host's first DOM-widget mount may happen after node creation. Reacquire
        // only if it returned to the host; never steal a panel from a child dialog.
        if(c.panel===panel)c.release?.abandon?.();else c.release?.();
        const owner=adapterFor(c.node)?.panel?.(c.node);
        c.body.replaceChildren();c.panel=panel;c.release=leasePanel(panel,c.body,owner?.buttons,owner?.fields);
        if(c.openEditor&&owner?.workspaceControls){
            owner.workspaceControls.append(c.openEditor);
            const release=c.release;
            c.release=()=>{c.element.append(c.openEditor);release();};
            c.release.abandon=()=>{c.element.append(c.openEditor);release.abandon();};
        }
        nativeFields(c);c.body.append(c.fields);if(c.run)c.body.append(c.run);
    }
    function closeWorkspace(){
        if(!workspace)return;const current=workspace;workspace=null;
        current.restore();current.dialog.remove();update(current.c);current.c.openEditor?.focus({preventScroll:true});
    }
    function openWorkspace(c){
        closeWorkspace();closePicker();c.layout.expanded=true;update(c);
        const dialog=el('dialog','dae-creative-workspace'),header=el('header');
        dialog.setAttribute('aria-label',`${c.node.title} 编辑器`);
        header.append(el('strong','',c.node.title),createCreativeButton('返回画布',closeWorkspace));dialog.append(header);root.append(dialog);
        workspace={c,dialog,restore:leasePanel(c.body,dialog)};update(c);
        dialog.addEventListener('cancel',e=>{e.preventDefault();closeWorkspace();});
        dialog.addEventListener('keydown',e=>e.stopPropagation());
        dialog.addEventListener('pointerdown',e=>e.stopPropagation());
        dialog.addEventListener('dblclick',e=>e.stopPropagation());
        dialog.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
        dialog.showModal();
    }
    function makeCard(node,index){
        const layout=cardState(state,node,index),element=el('article','dae-creative-card');element.dataset.nodeId=String(node.id);element.dataset.upload=String(node.type===UPLOAD_TYPE);element.dataset.unified=String(unifiedNode(node));
        const heading=el('header','dae-creative-heading'),title=el('strong','',node.title||node.type),media=el('div','dae-creative-media'),summary=el('div','dae-creative-summary'),body=el('div','dae-creative-body'),portBox=el('div','dae-creative-ports');
        const c={node,layout,element,heading,title,media,summary,body,fields:el('div','dae-creative-fields'),ports:portBox,panel:null,release:null,portSignature:null};
        const adapter=adapterFor(node);element.dataset.floatingHeader=String(!!adapter?.floatingHeader);
        const category=menuItems().find(item=>item.type===node.type);
        if(category&&node.type!==UPLOAD_TYPE)heading.append(categoryIcon(category));
        heading.append(title);
        if(adapter?.collapsible!==false){
            c.toggle=createCreativeButton('设置',()=>{layout.expanded=!layout.expanded;select(node);update(c);dirty();});
            c.toggle.setAttribute('aria-label',`${node.title} 设置`);heading.append(c.toggle);
        }
        if(workspaceNode(node.type)){
            element.dataset.workspace="true";c.openEditor=createCreativeButton("展开编辑器",()=>openWorkspace(c));
            if(adapter?.floatingHeader){
                c.openEditor.replaceChildren(categoryIcon({icon:'fullscreen-line'}));
                c.openEditor.classList.add('dae-creative-header-action');c.openEditor.dataset.daeTooltip='展开编辑器';c.openEditor.dataset.tooltipAlign='end';c.openEditor.setAttribute('aria-label','展开编辑器');
            }
            (adapter?.floatingHeader?element:heading).append(c.openEditor);
        }
        title.tabIndex=0;title.title='双击重命名';
        const rename=()=>{if(heading.querySelector('input'))return;const input=el('input');input.value=node.title||node.type;input.setAttribute('aria-label','节点名称');title.hidden=true;heading.prepend(input);let done=false;
            const finish=save=>{if(done)return;done=true;if(save&&input.value.trim()){history.begin();node.title=input.value.trim();dirty();history.end();}input.remove();title.hidden=false;update(c);root.focus();};
            input.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&!e.isComposing)finish(true);if(e.key==='Escape')finish(false);});input.addEventListener('blur',()=>finish(true));input.focus();input.select();};
        title.addEventListener('dblclick',e=>{e.stopPropagation();rename();});
        heading.addEventListener('pointerdown',e=>{if(e.target.closest('button,input')||e.button!==0)return;if(!selected.has(node.id))return;root.focus();drag={kind:'card',x:e.clientX,y:e.clientY,originals:[...selected].map(id=>cards.get(id)).filter(Boolean).map(card=>({card,x:card.layout.x,y:card.layout.y}))};e.target.setPointerCapture(e.pointerId);e.preventDefault();});
        element.addEventListener('pointerdown',e=>{if(e.button!==0)return;select(node,{toggle:(e.shiftKey||e.ctrlKey)&&!body.contains(e.target),preserve:true});if(!e.target.closest('input,textarea,select,button,a,video,[contenteditable=true]'))root.focus({preventScroll:true});},true);
        body.addEventListener('wheel',e=>{if(!e.ctrlKey)e.stopPropagation();},{passive:true});
        const typeLabel=el('span','dae-creative-type',category?.label||node.type);typeLabel.title=node.type;
        element.append(heading,media,summary,body,typeLabel,portBox);world.append(element);cards.set(node.id,c);
        const resizeOption=adapterFor(node)?.resizable;
        if(typeof resizeOption==='function'?resizeOption(node):resizeOption){
            const handle=el('div','dae-creative-width-handle');handle.tabIndex=0;handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','vertical');handle.setAttribute('aria-label','调整表格整体宽度');handle.title='拖动调整表格宽度（最小 640px）；方向键微调，Esc 取消';c.widthHandle=handle;element.append(handle);
            let sizing=null;
            const apply=width=>{layout.width=Math.max(640,Math.round(width));update(c);drawWires();};
            const finish=cancel=>{if(!sizing)return;const old=sizing;sizing=null;if(cancel)apply(old.width);delete handle.dataset.dragging;if(handle.hasPointerCapture(old.pointer))handle.releasePointerCapture(old.pointer);history.end();dirty();};
            c.cancelWidthResize=()=>finish(true);
            handle.onpointerdown=e=>{if(e.button!==0)return;e.stopPropagation();e.preventDefault();history.begin();sizing={x:e.clientX,width:layout.width,pointer:e.pointerId};handle.dataset.dragging='true';handle.setPointerCapture(e.pointerId);handle.focus({preventScroll:true});};
            handle.onpointermove=e=>{if(!sizing)return;e.stopPropagation();apply(sizing.width+(e.clientX-sizing.x)/state.viewport.zoom);};
            handle.onpointerup=e=>{e.stopPropagation();finish(false);};handle.onpointercancel=()=>finish(true);handle.onlostpointercapture=()=>finish(true);
            handle.onkeydown=e=>{if(e.key==='Escape'&&sizing){e.preventDefault();e.stopPropagation();finish(true);return;}if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();e.stopPropagation();history.begin();apply(layout.width+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?100:20));history.end();dirty();};
            for(const event of ['mousedown','click','dblclick'])handle.addEventListener(event,e=>e.stopPropagation());
        }
        attach(c);if(!c.panel){nativeFields(c);body.append(c.fields);}
        const action=adapterFor(node)?.action?.(node);
        if(action){c.run=createCreativeButton(action.label,async()=>{try{await action.run(node,app);message('已提交任务');}catch(e){message(e.message);}});c.run.dataset.primary='true';body.append(c.run);}
        update(c);resizeObserver.observe(element,{box:'border-box'});return c;
    }
    function update(c){
        c.element.dataset.slotsSuppressed=String(suppressGroupSlots(graph,c.node,selected));
        const {node,layout}=c;materialSources(c);if(c.widthHandle)layout.width=Math.max(640,layout.width);if(node.type===UPLOAD_TYPE||adapterFor(node)?.collapsible===false)layout.expanded=true;adapterFor(node)?.refresh?.(node);c.element.style.left=`${layout.x}px`;c.element.style.top=`${layout.y}px`;c.element.style.width=`${layout.width}px`;
        const fullHeight=adapterFor(node)?.fullHeight;c.element.dataset.fullHeight=String(typeof fullHeight==='function'?fullHeight(node):!!fullHeight);
        if(c.widthHandle){c.widthHandle.setAttribute('aria-valuenow',String(layout.width));c.widthHandle.setAttribute('aria-valuemin','640');c.widthHandle.setAttribute('aria-valuemax',String(Math.max(3600,layout.width)));c.widthHandle.setAttribute('aria-valuetext',`${layout.width} 像素`);}
        c.element.dataset.inactive=String(node.mode!=null&&node.mode!==0);c.body.inert=node.mode!=null&&node.mode!==0;
        for(const {w,input} of c.fieldBindings||[]){input.disabled=node.inputs?.some(p=>p.name===w.name&&p.link!=null);if(document.activeElement!==input){input.value=w.value??'';input.checked=!!w.value;}}
        const limit=adapterFor(node)?.compactWidth;const compactWidth=typeof limit==='function'?limit(node):limit;const compact=Boolean(compactWidth&&layout.width*state.viewport.zoom<compactWidth&&workspace?.c!==c);c.element.dataset.compact=String(compact);
        c.title.textContent=node.title||node.type;c.body.hidden=!layout.expanded||compact;if(c.toggle){c.toggle.textContent=layout.expanded?'收起':'设置';c.toggle.setAttribute('aria-expanded',String(layout.expanded));}
        const text=adapterFor(node)?.summary?.(node)||value(node,'prompt')||value(node,'text')||'展开设置进行编辑';
        if(c.summary.textContent!==text)c.summary.textContent=text;c.summary.hidden=layout.expanded&&!compact||node.type===UPLOAD_TYPE;
        const preview=previewFor(node),url=preview.url;if(url!==c.mediaURL){c.mediaURL=url;c.media.replaceChildren();if(typeof url==='string'&&(/^(\/view\?|\/comfytv\/|https?:\/\/)/).test(url)){
            const file=new URL(url,location.href).searchParams.get('filename')||url;
            const isVideo=preview.kind==='video'||/\.(mp4|webm|mov)(?:[?&]|$)/i.test(file);const m=el(isVideo?'video':'img');m.src=url;if(isVideo){m.controls=true;m.preload='metadata';}else m.alt=node.title||'素材';c.media.append(m);
        }}
        c.media.hidden=layout.expanded&&!!c.panel?.querySelector('video[src],img[src]');
        ports(c);
    }
    function removeWire(id){history.begin();try{graph.removeLink(id);selectedLink=null;}finally{history.end();}dirty();sync();}
    function selectWire(id){if(selectedLink===id)return;select(null);selectedLink=id;drawWires();}
    let incomingWire=null;
    function setIncomingWire(id){
        if(incomingWire===id)return;
        const previous=wirePaths.get(incomingWire),next=wirePaths.get(id);
        if(previous)previous.dataset.disconnectTarget='false';
        incomingWire=id;if(next)next.dataset.disconnectTarget=String(selectedLink==null);
    }
    function onReceivingSegment(path,event){
        const length=path.getTotalLength(),matrix=path.getScreenCTM(),zoom=state.viewport.zoom;
        const reach=Math.min(160,length*zoom*.45);
        for(let offset=0;offset<=reach;offset+=4){const point=path.getPointAtLength(length-offset/zoom).matrixTransform(matrix);if(Math.hypot(point.x-event.clientX,point.y-event.clientY)<10)return true;}
        return false;
    }
    function nearestIncoming(links,x,y){
        let best=null,distance=Infinity;
        const matrix=wires.getScreenCTM();
        const preferred=links.find(link=>link.id===incomingWire)||links.find(link=>link.id===selectedLink);
        const ordered=preferred?[preferred,...links.filter(link=>link!==preferred)]:links;
        for(const link of ordered){
            const path=wirePaths.get(link.id);if(!path)continue;
            const geometry=wireGeometry.get(path),zoom=state.viewport.zoom;
            const endX=geometry.x*matrix.a+geometry.y*matrix.c+matrix.e,endY=geometry.x*matrix.b+geometry.y*matrix.d+matrix.f;
            if(Math.hypot(endX-x,endY-y)>140)continue;
            if(!geometry.samples||geometry.zoom!==zoom){
                const length=path.getTotalLength();geometry.samples=[];geometry.zoom=zoom;
                for(let offset=12;offset<=120;offset+=6)geometry.samples.push(path.getPointAtLength(Math.max(0,length-offset/zoom)));
            }
            let nearest=Infinity;
            for(const point of geometry.samples)nearest=Math.min(nearest,Math.hypot(point.x*matrix.a+point.y*matrix.c+matrix.e-x,point.x*matrix.b+point.y*matrix.d+matrix.f-y));
            if(nearest<distance-2){best=link;distance=nearest;}
        }
        return distance<90?best:null;
    }
    function wireAnchor(rect,port,side){
        // Floating unified Slots are interaction handles, not persistent wire anchors.
        if(port.closest('.dae-creative-card')?.dataset.unified==='true')return {x:side==='output'?rect.right:rect.left,y:rect.top+rect.height/2};
        const target=port.getBoundingClientRect();
        return {x:target.left+target.width/2,y:target.top+target.height/2};
    }
    function drawWires(){
        const segments=[],rw=world.getBoundingClientRect(),z=state.viewport.zoom;
        const bounds=new Map(),anchors=new Map();
        for(const link of graphLinks(graph)){
            const a=cards.get(link.origin_id),b=cards.get(link.target_id);if(!a||!b)continue;
            const source=a.ports.querySelector(outputSelector(a.node,link.origin_slot)),target=b.ports.querySelector(inputSelector(b.node,link.target_slot));if(!source||!target)continue;
            if(!bounds.has(a))bounds.set(a,a.element.getBoundingClientRect());if(!bounds.has(b))bounds.set(b,b.element.getBoundingClientRect());
            const ra=bounds.get(a),rb=bounds.get(b);
            if(!ra.width||!ra.height||!rb.width||!rb.height)continue;
            if(!anchors.has(source))anchors.set(source,wireAnchor(ra,source,'output'));if(!anchors.has(target))anchors.set(target,wireAnchor(rb,target,'input'));
            const start=anchors.get(source),end=anchors.get(target);
            const x1=(start.x-rw.left)/z,y1=(start.y-rw.top)/z;
            let x2=(end.x-rw.left)/z,y2=(end.y-rw.top)/z;
            if(drag?.kind==='detach'&&drag.id===link.id){x2=(drag.point.x-rw.left)/z;y2=(drag.point.y-rw.top)/z;}
            const d=Math.max(60,Math.abs(x2-x1)*.45);
            segments.push([link.id,`M${x1},${y1} C${x1+d},${y1} ${x2-d},${y2} ${x2},${y2}`,x2,y2]);
        }
        const selection=String(selectedLink!=null);if(root.dataset.wireSelected!==selection)root.dataset.wireSelected=selection;
        let changed=false;
        const active=new Set(segments.map(([id])=>id));
        for(const [id,path] of wirePaths)if(!active.has(id)){path.remove();wirePaths.delete(id);changed=true;}
        for(const [id,d,x,y] of segments){
            let path=wirePaths.get(id);
            if(!path){path=document.createElementNS(wires.namespaceURI,'path');path.dataset.linkId=id;path.addEventListener('pointerdown',e=>{
                if(e.button!==0)return;e.stopPropagation();selectWire(id);root.focus();
                if(onReceivingSegment(path,e)){closePicker();setMagnet(null);const end=path.getPointAtLength(path.getTotalLength()).matrixTransform(path.getScreenCTM());drag={kind:'detach',id,x:e.clientX,y:e.clientY,point:{x:end.x,y:end.y},fromLine:true};}
            });path.addEventListener('dblclick',e=>{e.stopPropagation();removeWire(id);});wirePaths.set(id,path);wires.append(path);}
            if(path.getAttribute('d')!==d){path.setAttribute('d',d);wireGeometry.set(path,{x,y});changed=true;}
            const selected=String(id===selectedLink),incoming=String(selectedLink==null&&id===incomingWire);
            if(path.dataset.selected!==selected){path.dataset.selected=selected;changed=true;}
            if(path.dataset.disconnectTarget!==incoming)path.dataset.disconnectTarget=incoming;
        }
        if(pickerConnection&&addPoint)previewConnection(pickerConnection,addPoint);
        else if(drag?.kind==='wire'&&drag.point)previewConnection(drag,drag.point);
        if(changed)root.dispatchEvent(new Event('dae-canvas-wires-changed'));
    }
    function clear(){cancelAnimationFrame(wireFrame);wireFrame=0;hoverPoint=null;incomingWire=null;wirePaths.clear();setMagnet(null);closeWorkspace();closePicker();fieldGallery?.release();fieldGallery=null;for(const c of cards.values()){c.cancelWidthResize?.();resizeObserver.unobserve(c.element);adapterFor(c.node)?.panel?.(c.node)?.close?.();c.release?.();c.element.remove();}cards.clear();wires.replaceChildren();selected.clear();marquee.hidden=true;delete root.dataset.panning;selectedLink=null;pending=null;drag=null;}
    function sync(){
        if(!visible)return;
        for(const id of selected)if(!graph.getNodeById(id))selected.delete(id);
        if(graph!==app.graph||state!==app.graph.extra?.daelabCreativeCanvasV1){clear();graph=app.graph;state=canvasState(graph);if(!state.active){hide(false);onExit();return;}viewport();}
        if(pickerConnection&&!validConnection(pickerConnection))closePicker();
        const nodes=graph._nodes.filter(supportedNode),current=new Set(nodes);
        for(const [id,c] of cards)if(!current.has(c.node)){if(workspace?.c===c)closeWorkspace();c.cancelWidthResize?.();resizeObserver.unobserve(c.element);c.release?.();c.element.remove();cards.delete(id);}
        nodes.forEach((node,i)=>{const c=cards.get(node.id)||makeCard(node,i);attach(c);update(c);});empty.hidden=nodes.length>0;drawWires();
    }
    function add(type,point=addPoint){
        const node=globalThis.LiteGraph.createNode(type);if(!node){message('当前服务没有加载此节点，请检查扩展或重启服务');return;}
        graph.add(node);node.pos=[Math.max(0,...graph._nodes.map(n=>n===node?0:n.pos[0]+n.size[0]))+80,100];
        adapterFor(node)?.onCreate?.(node);
        const v=state.viewport;state.cards[node.id]={x:((point?.x??root.clientWidth/2)-v.x)/v.zoom,y:((point?.y??root.clientHeight/3)-v.y)/v.zoom,width:cardWidth(type),expanded:true};
        dirty();sync();select(node);closePicker();message('已添加，可直接编辑、连接并运行');return node;
    }
    function setWireSource(port){if(wireSource===port)return;if(wireSource)delete wireSource.dataset.wireSource;wireSource=port;if(port)port.dataset.wireSource='true';}
    function closePicker(){setWireSource(null);picker?.remove();picker=null;pickerConnection=null;addPoint=null;wires.querySelector('[data-preview]')?.remove();}
    function validConnection(context){if(context.materialKey!==undefined)return graph===app.graph&&graph.getNodeById(context.node.id)===context.node&&(adapterFor(context.node)?.materialSources?.(context.node)||[]).some(s=>s.key===context.materialKey&&s.element.isConnected);return graph===app.graph&&graph.getNodeById(context.node.id)===context.node&&(context.index===MATERIAL_SLOT?(context.node.type!==UPLOAD_TYPE||uploadKind(context.node)===context.mediaKind):context.node[context.side==='output'?'outputs':'inputs']?.[context.index]===context.slot);}
    function previewConnection(context,point){
        const c=cards.get(context.node.id),port=context.element||c?.ports.querySelector(`[data-side=${context.side}][data-slot="${context.index}"]`);if(!port)return;setWireSource(port);
        let path=wires.querySelector('[data-preview]');if(!path){path=document.createElementNS(wires.namespaceURI,'path');path.dataset.preview='true';wires.append(path);}
        const a=port.getBoundingClientRect(),r=root.getBoundingClientRect(),v=state.viewport,target=magneticPort?.getBoundingClientRect();
        const origin={x:(a.left+a.width/2-r.left-v.x)/v.zoom,y:(a.top+a.height/2-r.top-v.y)/v.zoom};
        const end=target?{x:(target.left+target.width/2-r.left-v.x)/v.zoom,y:(target.top+target.height/2-r.top-v.y)/v.zoom}:{x:(point.x-v.x)/v.zoom,y:(point.y-v.y)/v.zoom};
        const [start,finish]=context.side==='output'?[origin,end]:[end,origin],d=Math.max(60,Math.abs(finish.x-start.x)*.45);
        path.setAttribute('d',`M${start.x},${start.y} C${start.x+d},${start.y} ${finish.x-d},${finish.y} ${finish.x},${finish.y}`);
    }
    function positionPicker(){
        if(!picker||!addPoint||!visible)return;
        const x=Math.max(12,Math.min(addPoint.x,root.clientWidth-picker.offsetWidth-12));
        const y=Math.max(12,Math.min(addPoint.y,root.clientHeight-picker.offsetHeight-12));
        picker.style.left=`${x}px`;picker.style.top=`${y}px`;
        addPoint={x:Math.min(addPoint.x,root.clientWidth-12),y:Math.min(addPoint.y,root.clientHeight-12)};
        if(pickerConnection){previewConnection(pickerConnection,addPoint);}
    }
    const resizeObserver=new ResizeObserver(()=>{positionPicker();if(visible)drawWires();});resizeObserver.observe(root);
    function connectToCard(context,target,point){
        if(!validConnection(context))return message('素材已改变，请重新连线');
        if(!canConnectOutput(context.node)){closePicker();return;}
        const choices=targetChoices(context.node,context.index,target).filter(c=>context.targetIndex==null||c.index===context.targetIndex);
        if(!choices.length)return message('该节点没有兼容的素材入口，未更改连线');
        const apply=index=>{
            if(!validConnection(context)||graph.getNodeById(target.id)!==target){closePicker();message('节点已改变，请重新连线');return;}
            closePicker();pending={node:context.node,index:context.index};connect(target,index,'input');
        };
        if(context.targetIndex==null&&adapterFor(target)?.inputSelection==='first-free'){
            const available=choices.find(choice=>target.inputs[choice.index].link==null);
            if(available)apply(available.index);else message('没有空闲的兼容输入，请先断开不再使用的连线');
            return;
        }
        if(choices.length===1){apply(choices[0].index);return;}
        closePicker();addPoint=point;pickerConnection=context;
        picker=el('section','dae-creative-picker');picker.setAttribute('aria-label','选择素材用途');
        picker.append(el('h2','',`连接到 ${target.title}`));const list=el('div');picker.append(list);root.append(picker);
        const names=adapterFor(target)?.inputLabels||{};
        for(const choice of choices){const b=button(names[choice.name]||choice.name,()=>apply(choice.index));b.title=choice.name;list.append(b);}
        list.append(button('取消',()=>{closePicker();root.focus();}));positionPicker();picker.querySelector('button').focus();
        message('此节点有多个兼容入口，请选择素材用途');
    }
    function choose(point,context=null){
        closePicker();if(context&&(!validConnection(context)||(context.side==='output'&&!canConnectOutput(context.node))))return;addPoint=point;pickerConnection=context;
        picker=el('section','dae-creative-picker');picker.setAttribute('aria-label','添加节点');
        picker.append(el('h2','',context?(context.side==='output'?'引用此节点新建':'新建来源节点'):'添加节点'));
        const list=el('div');picker.append(list);root.append(picker);
        if(context?.side==='output'&&(context.materialKey!==undefined||adapterFor(context.node)?.materialOutput===true)){
            const snap=snapshotFor(context);const label=context.materialKey!==undefined?'输出为素材组':'输出为视频素材';
            const output=button(label+(snap?.skipped?'（跳过 '+snap.skipped+' 行）':''),()=>{closePicker();return outputMaterials(context,point);});output.disabled=!snap?.assets?.length||snap.ready===false;list.append(output);
            if(context.materialKey!==undefined){positionPicker();output.focus();return;}
        }
        for(const item of menuItems()){
            const definition=globalThis.LiteGraph.registered_node_types[item.type];if(!definition)continue;
            const compatible=!context||(context.side==='output'?sourceSlots(context.node,context.index).some(i=>canConnectDefinition(definition?.nodeData,context.side,context.node.outputs[i].type)):(context.index===MATERIAL_SLOT?inputSlots(context.node):[context.index]).some(i=>canConnectDefinition(definition?.nodeData,context.side,context.node.inputs[i].type)));
            const b=button('',()=>{
                if(context&&!validConnection(context)){closePicker();message('来源已改变，请重新拖出连线');return;}
                if(context?.side==='output'&&!canConnectOutput(context.node)){closePicker();return;}
                const node=add(item.type);if(!node)return;
                if(context){
                    if(context.index===MATERIAL_SLOT){if(context.side==='output')connectToCard(context,node,point);else connectToCard({node,index:unifiedNode(node)?MATERIAL_SLOT:0,side:'output',slot:node.outputs?.[0],mediaKind:node.type===UPLOAD_TYPE?uploadKind(node):null},context.node,point);return;}
                    const index=matchingSlot(node,context.side,context.slot.type);
                    let link;
                    if(index>=0){pending=context.side==='output'?{node:context.node,index:context.index}:{node,index};link=connect(context.side==='output'?node:context.node,context.side==='output'?index:context.index,'input');}
                    if(!link){graph.remove(node);delete state.cards[node.id];select(context.node);dirty();sync();message('未建立连接，已取消新增节点');}
                }
            });
            const icon=categoryIcon(item);
            b.append(icon,el('span','',item.label));b.disabled=!definition||!compatible;b.title=!definition?'当前服务未加载此节点':!compatible?'与当前接口不兼容':'';list.append(b);
        }
        positionPicker();
        picker.tabIndex=-1;(picker.querySelector('button:not(:disabled)')||picker).focus();
    }
    const portOffsets=new WeakMap();
    function portCenter(port){
        const r=port.getBoundingClientRect(),offset=portOffsets.get(port)||{x:0,y:0};
        return {x:r.left+r.width/2-offset.x*state.viewport.zoom,y:r.top+r.height/2-offset.y*state.viewport.zoom};
    }
    function setMagnet(port,point=null){
        if(magneticPort&&magneticPort!==port){delete magneticPort.dataset.magnetic;magneticPort.style.removeProperty('translate');portOffsets.delete(magneticPort);}
        magneticPort=port;
        if(port){
            port.dataset.magnetic='true';
            if(port.matches('button[data-slot]')){
                const center=portCenter(port),dx=point&&!reducedMotion.matches?point.x-center.x:0,dy=point&&!reducedMotion.matches?point.y-center.y:0;
                const factor=Math.min(.22,6/(Math.hypot(dx,dy)||1))/state.viewport.zoom,offset={x:dx*factor,y:dy*factor};
                portOffsets.set(port,offset);port.style.translate=`${offset.x}px ${offset.y}px`;
            }
        }
        root.classList.toggle('dae-port-magnet',!!port);
    }
    function materialTargetAt(x,y,source=null){
        const ignored=new Set([source?.id,...(source?.type===GROUP_TYPE?source.properties.members||[]:[])].map(String));
        const topCard=document.elementsFromPoint(x,y).map(e=>e.closest('.dae-creative-card')).find(e=>e&&!ignored.has(e.dataset.nodeId));
        for(const c of cards.values())for(const target of c.element===topCard?adapterFor(c.node)?.materialTargets?.(c.node)||[]:[]){
            const visible=target.element.getBoundingClientRect();if(!visible.width||!visible.height)continue;
            const scroll=target.clipElement?.getBoundingClientRect();
            if(scroll&&(x<scroll.left||x>scroll.right||y<scroll.top||y>scroll.bottom))continue;
            for(const element of [target.element,...(target.dropElements||[])]){const r=element.getBoundingClientRect();if(r.width&&r.height&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return {...target,node:c.node};}
        }
        return null;
    }
    function receiveMaterialGroup(source,x,y){
        if(source?.type!==GROUP_TYPE)return false;
        const target=materialTargetAt(x,y,source);if(!target)return false;
        history.begin();
        try{adapterFor(target.node).acceptMaterials(target.node,target.key,collectionFor(source));message('已按素材组顺序填充此列，行数已更新；可在表格中撤销。');}
        catch(error){message(error.message);}
        finally{history.end();dirty();sync();}
        return true;
    }
    function nearestPort(x,y,context=null){
        if(picker||workspace||context?.materialKey!==undefined)return null;
        if(context?.side==='output'&&context.node.type===GROUP_TYPE){const target=materialTargetAt(x,y,context.node);if(target)return target.element;}
        const hit=document.elementFromPoint(x,y);
        if(hit?.closest('button:not([data-slot]),input,textarea,select,a,video,.dae-creative-picker'))return null;
        let best=null,distance=32;
        for(const c of cards.values()){
            if(!unifiedNode(c.node)||context?.node===c.node||suppressGroupSlots(graph,c.node,selected))continue;
            const bounds=c.element.getBoundingClientRect();
            if(x>bounds.left&&x<bounds.right&&y>bounds.top&&y<bounds.bottom&&!hit?.closest('[data-slot]'))continue;
            for(const port of c.ports.querySelectorAll('button[data-slot]')){
                if(port.disabled||context?.side===port.dataset.side)continue;
                if(context){
                    const compatible=context.side==='output'?targetChoices(context.node,context.index,c.node).length:
                        targetChoices(c.node,MATERIAL_SLOT,context.node).some(choice=>context.index===MATERIAL_SLOT||choice.index===context.index);
                    if(!compatible)continue;
                }
                const r=port.getBoundingClientRect();if(!r.width||!r.height||getComputedStyle(port).visibility==='hidden')continue;
                const center=portCenter(port),d=Math.hypot(x-center.x,y-center.y);
                if(d<distance){best=port;distance=d;}
            }
        }
        return best;
    }
    root.addEventListener('pointermove',e=>{const rect=root.getBoundingClientRect();pointerPoint={x:e.clientX-rect.left,y:e.clientY-rect.top};if(!drag){hoverPoint={x:e.clientX,y:e.clientY};animateWires();}},true);
    root.addEventListener('pointerleave',()=>{hoverPoint=null;if(!drag){setMagnet(null);setIncomingWire(null);}animateWires();});
    for(const event of ['focusin','focusout','transitionrun','transitionend'])root.addEventListener(event,animateWires);
    root.addEventListener('pointerdown',e=>{
        if(e.button!==0||drag||e.target.closest('path[data-link-id]'))return;
        const port=nearestPort(e.clientX,e.clientY);
        if(port){setMagnet(port);portStarts.get(port)?.(e);}
    },true);
    root.addEventListener('pointerdown',e=>{if(picker&&!picker.contains(e.target))closePicker();},true);
    root.addEventListener('dblclick',e=>{if(e.target.closest('.dae-creative-card,.dae-creative-picker,.dae-creative-zoom,path'))return;const r=root.getBoundingClientRect();choose({x:e.clientX-r.left,y:e.clientY-r.top});});
    root.addEventListener('dragover',e=>{if(!e.dataTransfer?.types.includes('Files'))return;e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='copy';},true);
    root.addEventListener('drop',async e=>{
        const files=[...(e.dataTransfer?.files||[])];if(!files.length)return;
        if(files.length===1&&e.target.closest('.dae-upload'))return;
        e.preventDefault();e.stopPropagation();closePicker();
        const supported=files.filter(file=>mediaKind(file.name)),skipped=files.length-supported.length;
        if(!supported.length){message('请选择 PNG、JPG、WebP、MP4、WebM 或 MOV 文件');return;}
        const ownerGraph=graph,r=root.getBoundingClientRect(),point={x:e.clientX-r.left,y:e.clientY-r.top},step=(cardWidth(UPLOAD_TYPE)+32)*state.viewport.zoom,created=[];
        history.begin();
        try{for(const [index,file] of supported.entries()){const node=add(UPLOAD_TYPE,{x:point.x+index*step,y:point.y});if(!node)break;created.push({node,file});}}
        finally{history.end();}
        selected=new Set(created.map(item=>item.node.id));paintSelection();
        message(`已创建 ${created.length} 个上传节点${skipped?`，已跳过 ${skipped} 个不支持的文件`:''}`);
        for(const {node,file} of created){if(app.graph!==ownerGraph)break;if(node.graph===ownerGraph)await adapterFor(node).upload(node,file);}
    },true);
    root.addEventListener('wheel',e=>{
        if(e.target.closest('.dae-creative-picker,dialog,.dae-creative-toolbar'))return;
        if(drag){e.preventDefault();return;}
        // Give scrollable content its own wheel, while Ctrl always zooms the canvas.
        if(!e.ctrlKey){
            const horizontal=e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY);
            for(let owner=e.target;owner&&owner!==root;owner=owner.parentElement){
                const style=getComputedStyle(owner),overflow=horizontal?style.overflowX:style.overflowY;
                if(/auto|scroll/.test(overflow)&&(horizontal?owner.scrollWidth>owner.clientWidth:owner.scrollHeight>owner.clientHeight))return;
            }
        }
        closePicker();setMagnet(null);e.preventDefault();e.stopPropagation();const r=root.getBoundingClientRect();
        state.viewport=wheelViewport(state.viewport,{x:e.clientX-r.left,y:e.clientY-r.top},e,root.clientHeight);viewport();dirty();
    },{passive:false,capture:true});
    root.addEventListener('pointerdown',e=>{
        if(e.button!==1||e.target.closest('dialog,.dae-creative-picker'))return;
        e.preventDefault();e.stopPropagation();setMagnet(null);closePicker();root.focus();
        drag={kind:'pan',x:e.clientX,y:e.clientY,original:{...state.viewport}};root.dataset.panning='true';root.setPointerCapture(e.pointerId);
    },true);
    root.addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault();});
    root.addEventListener('pointerdown',e=>{
        if(e.target.closest('button,input,select,textarea,.dae-creative-card,.dae-creative-picker,path')||e.button!==0)return;
        e.preventDefault();root.focus();closePicker();setMagnet(null);
        const base=e.shiftKey?new Set(selected):new Set();selected=new Set(base);selectedLink=null;paintSelection();
        drag={kind:'marquee',x:e.clientX,y:e.clientY,base};root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove',e=>{if(!drag)return;if(drag.kind==='detach'){if(drag.fromLine){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<3)return;drag.fromLine=false;root.setPointerCapture(e.pointerId);}drag.point={x:e.clientX,y:e.clientY};animateWires();return;}if(drag.kind==='wire'){const r=root.getBoundingClientRect(),port=nearestPort(e.clientX,e.clientY,drag);setMagnet(port);const target=port?.getBoundingClientRect();drag.point={x:(target?target.left+target.width/2:e.clientX)-r.left,y:(target?target.top+target.height/2:e.clientY)-r.top};previewConnection(drag,drag.point);return;}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(drag.kind==='pan'){state.viewport.x=drag.original.x+dx;state.viewport.y=drag.original.y+dy;viewport();}else if(drag.kind==='marquee'){
            const r=root.getBoundingClientRect(),left=Math.min(drag.x,e.clientX),top=Math.min(drag.y,e.clientY),right=Math.max(drag.x,e.clientX),bottom=Math.max(drag.y,e.clientY);
            marquee.hidden=false;Object.assign(marquee.style,{left:`${left-r.left}px`,top:`${top-r.top}px`,width:`${right-left}px`,height:`${bottom-top}px`});
            selected=new Set(drag.base);
            if(Math.abs(dx)>3||Math.abs(dy)>3)for(const c of cards.values()){const b=c.element.getBoundingClientRect();if(b.right>left&&b.left<right&&b.bottom>top&&b.top<bottom)selected.add(c.node.id);}
            paintSelection();
        }else{for(const item of drag.originals){item.card.layout.x=item.x+dx/state.viewport.zoom;item.card.layout.y=item.y+dy/state.viewport.zoom;update(item.card);}drawWires();}});
    const endDrag=e=>{if(!drag)return;const current=drag,dropHit=current?.kind==='wire'?(nearestPort(e.clientX,e.clientY,current)||document.elementFromPoint(e.clientX,e.clientY)):document.elementFromPoint(e.clientX,e.clientY);setMagnet(null);setWireSource(null);drag=null;marquee.hidden=true;delete root.dataset.panning;wires.querySelector('[data-preview]')?.remove();if(!current)return;
        if(current.kind==='detach'){if(e.type==='pointerup'&&Math.hypot(e.clientX-current.x,e.clientY-current.y)>=40){removeWire(current.id);message('已断开连线，可撤销');}else drawWires();return;}
        if(current.kind==='wire'&&e.type==='pointerup'){
            if(!validConnection(current)){message('素材或接口已改变，请重新连线');return;}
            if(current.materialKey!==undefined){const r=root.getBoundingClientRect();suppressSourceClick=true;setTimeout(()=>{suppressSourceClick=false;},250);if(Math.hypot(e.clientX-current.x,e.clientY-current.y)<4){const b=current.element.getBoundingClientRect();choose({x:b.right-r.left+40,y:b.bottom-r.top+40},current);}else if(root.contains(dropHit)&&!dropHit?.closest('.dae-creative-card'))choose({x:e.clientX-r.left,y:e.clientY-r.top},current);else message('请拖到画布空白处输出素材组');return;}
            if(current.side==='output'&&receiveMaterialGroup(current.node,e.clientX,e.clientY))return;
            const hit=dropHit,port=hit?.closest('button[data-slot]'),card=hit?.closest('.dae-creative-card');
            const target=card&&[...cards.values()].find(c=>String(c.node.id)===card.dataset.nodeId)?.node;
            if(target&&current.side==='output'&&(!port||port.dataset.side==='input')){
                const r=root.getBoundingClientRect(),index=port?Number(port.dataset.slot):MATERIAL_SLOT;
                connectToCard({...current,targetIndex:index===MATERIAL_SLOT?null:index},target,{x:e.clientX-r.left,y:e.clientY-r.top});
            }else if(target&&current.side==='input'&&(!port||port.dataset.side==='output')){
                const index=port?Number(port.dataset.slot):unifiedNode(target)?MATERIAL_SLOT:0;
                const r=root.getBoundingClientRect();
                connectToCard({node:target,index,side:'output',slot:target.outputs?.[index],mediaKind:target.type===UPLOAD_TYPE?uploadKind(target):null,targetIndex:current.index===MATERIAL_SLOT?null:current.index},current.node,{x:e.clientX-r.left,y:e.clientY-r.top});
            }
            else if(root.contains(hit)&&!hit.closest('.dae-creative-card,.dae-creative-zoom,.dae-creative-picker,path')){const r=root.getBoundingClientRect();choose({x:e.clientX-r.left,y:e.clientY-r.top},current);}
            else message('连接已取消，请拖到兼容接口或空白处');
        }dirty();};root.addEventListener('pointerup',endDrag);root.addEventListener('pointercancel',endDrag);
    const editable=target=>target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable=false])');
    function copyNode(e){
        if(!visible||editable(e.target)||e.target.closest('[role=grid]')||workspace||picker)return;
        const copyIds=expandGroupSelection(graph,selected);const list=[...copyIds].map(id=>cards.get(id)).filter(Boolean);if(!list.length)return;
        const left=Math.min(...list.map(c=>c.layout.x)),top=Math.min(...list.map(c=>c.layout.y));
        const nodes=list.map(c=>({...copySnapshot(c.node,c.layout),sourceId:c.node.id,offset:{x:c.layout.x-left,y:c.layout.y-top}}));
        const snapshot={...nodes[0],nodes,links:graphLinks(graph).filter(l=>copyIds.has(l.origin_id)&&copyIds.has(l.target_id)).map(l=>({source:l.origin_id,output:l.origin_slot,target:l.target_id,input:l.target_slot}))};
        e.clipboardData.setData('text/plain',JSON.stringify(snapshot));
        e.preventDefault();e.stopPropagation();pasteCount=0;message('已复制节点；Ctrl+V 粘贴为新节点');
    }
    function pasteNode(e){
        if(!visible||editable(e.target)||e.target.closest('[role=grid]')||workspace||picker)return;
        const snapshot=readSnapshot(e.clipboardData.getData('text/plain'));if(!snapshot)return;
        e.preventDefault();e.stopPropagation();
        const entries=snapshot.nodes||[snapshot],created=[],mapping=new Map();
        if(!entries.length||entries.some(item=>!supportedNode({type:item.node?.type}))){message('包含不支持的节点，无法粘贴');return;}
        const point=pointerPoint||{x:root.clientWidth/2,y:root.clientHeight/2},v=state.viewport,offset=32*(++pasteCount);
        history.begin();try{
            for(const item of entries){
                const node=globalThis.LiteGraph.createNode(item.node.type);if(!node)throw new Error('节点未加载');created.push(node);
                const data=JSON.parse(JSON.stringify(item.node));delete data.id;
                for(const input of data.inputs||[])input.link=null;for(const output of data.outputs||[])output.links=null;
                adapterFor(node)?.prepareCopy?.(node,data);
                node.configure(data);graph.add(node);mapping.set(item.sourceId,node);
                node.pos=[Math.max(0,...graph._nodes.filter(n=>n!==node).map(n=>n.pos[0]+n.size[0]))+80,100];
                state.cards[node.id]={x:(point.x-v.x)/v.zoom+offset+(item.offset?.x||0),y:(point.y-v.y)/v.zoom+offset+(item.offset?.y||0),width:Number(item.layout?.width)||cardWidth(node.type),expanded:item.layout?.expanded!==false};
            }
            remapGroupMembers(created,mapping);
            for(const link of snapshot.links||[]){const source=mapping.get(link.source),target=mapping.get(link.target);if(source&&target&&!source.connect(link.output,target,link.input))throw new Error('内部连线恢复失败');}
            dirty();sync();selected=new Set(created.map(n=>n.id));selectedLink=null;paintSelection();root.focus({preventScroll:true});message(`已粘贴 ${created.length} 个新节点`);
        }catch(error){for(const node of created){if(node.graph===graph){graph.remove(node);delete state.cards[node.id];}else node.onRemoved?.();}message(`粘贴失败：${error.message}`);}finally{history.end();}

    }
    root.addEventListener('copy',copyNode,true);root.addEventListener('paste',pasteNode,true);
    root.addEventListener('keydown',e=>{
        if(picker?.contains(e.target)){
            if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)&&!e.isComposing){
                e.preventDefault();const items=[...picker.querySelectorAll('button:not(:disabled)')],index=items.indexOf(document.activeElement);
                const next=e.key==='Home'?0:e.key==='End'?items.length-1:e.key==='ArrowDown'?(index+1)%items.length:(index-1+items.length)%items.length;
                const item=items[next];if(item){item.focus({preventScroll:true});const list=item.parentElement,r=item.getBoundingClientRect(),bounds=list.getBoundingClientRect();if(r.top<bounds.top)list.scrollTop-=bounds.top-r.top;else if(r.bottom>bounds.bottom)list.scrollTop+=r.bottom-bounds.bottom;}
            }
            if(e.key==='Escape'&&!e.isComposing){e.preventDefault();closePicker();root.focus();}e.stopPropagation();return;}
        if(e.target.closest('input,textarea,select,[contenteditable=true]')){e.stopPropagation();return;}
        if(e.key==='Escape'){if(drag?.kind==='marquee'){selected=new Set(drag.base);paintSelection();}marquee.hidden=true;delete root.dataset.panning;setMagnet(null);pending=null;drag=null;closePicker();drawWires();message('已取消');}
        if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();if(selectedLink!=null){removeWire(selectedLink);}else{history.begin();for(const id of expandGroupSelection(graph,selected)){const c=cards.get(id);if(c){graph.remove(c.node);delete state.cards[id];}}selected.clear();history.end();dirty();sync();}}
        if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s')return;
        e.stopPropagation();});
    function show(){graph=app.graph;state=canvasState(graph);state.active=true;visible=true;root.hidden=false;document.body.dataset.daelabCreative='true';viewport();sync();if(graph.extra?.daelabControlGallery&&!fieldGallery){fieldGallery=createFieldGallery(graph.extra.daelabControlGallery);world.append(fieldGallery.root);}dirty();}
    function hide(save=true){root.dispatchEvent(new Event('dae-canvas-hide'));if(save&&state){state.active=false;dirty();}visible=false;root.hidden=true;delete document.body.dataset.daelabCreative;clear();closePicker();app.canvas.setDirty?.(true,true);}
    const timer=setInterval(sync,250);root.hidden=true;
    return {root,show,hide,sync,add,fit,select,receiveMaterialGroup,get selectedIds(){return [...selected];},get active(){return visible;},destroy(){hide(false);resizeObserver.disconnect();clearInterval(timer);root.remove();}};
}
