import {app} from '/scripts/app.js';
import {createCreativeCanvas} from './creative_canvas_view.mjs?v=20260929-refs2';
import {STATE_KEY} from './creative_canvas_model.mjs';
import {installMaterialGroups} from './material_groups.mjs';

import {publishAPI} from './creative_contract.mjs';
import './adapters/upload.mjs';
import {installComfyTVAdapter} from './adapters/comfytv.mjs';
publishAPI();
installComfyTVAdapter(app);

const iconURL=new URL('./vendor/remixicon/artboard-line.svg',import.meta.url).href;
function icon(){const i=document.createElement('i');i.className='dae-creative-icon';i.style.setProperty('--dae-icon',`url("${iconURL}")`);i.setAttribute('aria-hidden','true');return i;}
let view,observer,scheduled=false;
const labels=new Map();
async function switchMode(creative){
    const workflow=app.extensionManager?.workflow?.activeWorkflow;
    if((workflow?.activeMode??workflow?.initialMode)==='app')await app.extensionManager.command.execute('Comfy.ToggleLinear');
    if(creative)view.show();else view.hide();updateLabel();
}
function restoreLabels(){for(const [button,saved] of labels){saved.badge.remove();for(const [child,display] of saved.children)child.style.display=display;if(saved.label===null)button.removeAttribute('aria-label');else button.setAttribute('aria-label',saved.label);}labels.clear();}
function updateLabel(){
    if(!view?.active){restoreLabels();return;}
    const button=document.querySelector('[data-testid="view-mode-toggle"] button[aria-haspopup="menu"]');
    if(!button||labels.has(button))return;
    restoreLabels();const badge=document.createElement('span');badge.className='dae-creative-mode-label';badge.append(icon(),document.createTextNode('创作画布 ▾'));
    const children=[...button.children].map(child=>[child,child.style.display]);for(const [child] of children)child.style.display='none';
    labels.set(button,{children,badge,label:button.getAttribute('aria-label')});button.append(badge);button.setAttribute('aria-label','创作画布模式，工作流操作');
}
function closeMenu(menu){menu.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));}
// Compatibility boundary: this ComfyUI version has no workflow-actions menu contribution API.
// Scope by the host's stable test ID + aria-labelledby, never by translated menu text.
function syncMenu(){
    scheduled=false;updateLabel();
    const toggle=document.querySelector('[data-testid="view-mode-toggle"]');if(!toggle)return;
    for(const menu of document.querySelectorAll('[role="menu"][aria-labelledby]')){
        const trigger=document.getElementById(menu.getAttribute('aria-labelledby'));
        if(!trigger||!(toggle===trigger||toggle.contains(trigger)||trigger.contains(toggle)))continue;
        if(menu.querySelector('[data-daelab-creative-entry]'))continue;
        const group=document.createElement('div');group.dataset.daelabCreativeEntry='true';
        for(const [name,active] of [['创作画布',true],['图形',false]]){
            const b=document.createElement('button');b.type='button';b.className='dae-creative-menu-item';b.setAttribute('role','menuitem');b.tabIndex=0;
            b.append(icon(),document.createTextNode(name));b.setAttribute('aria-label',`切换到${name}`);
            b.onclick=e=>{e.stopPropagation();closeMenu(menu);void switchMode(active);};
            b.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();const items=[...menu.querySelectorAll('[role=menuitem]:not([aria-disabled=true])')];const i=items.indexOf(b);items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}};
            group.append(b);
        }
        const separator=document.createElement('div');separator.setAttribute('role','separator');separator.style.cssText='border-top:1px solid #ffffff18;margin:6px 0';group.append(separator);menu.prepend(group);
    }
}
app.registerExtension({
    name:'DAELAB.CreativeCanvas',
    commands:[{id:'DAELAB.CreativeCanvas.Toggle',label:'切换创作画布',function:()=>switchMode(!view.active)}],
    setup(){
        if(document.getElementById('daelab-creative-css'))return;
        const css=document.createElement('link');css.id='daelab-creative-css';css.rel='stylesheet';css.href=new URL('./creative_canvas.css?v=20260929-refs2',import.meta.url).href;document.head.append(css);
        view=createCreativeCanvas(app,{onExit:updateLabel});
        observer=new MutationObserver(records=>{if(records.every(r=>r.target instanceof Element&&r.target.closest('.dae-creative')))return;if(!scheduled){scheduled=true;requestAnimationFrame(syncMenu);}});
        observer.observe(document.body,{childList:true,subtree:true});
        document.addEventListener('click',event=>{
            if(view.active&&event.target.closest?.('[data-testid="view-mode-toggle"] button:not([aria-haspopup])')){view.hide();updateLabel();}
        },true);
        // Diagnostics + integration surface for the DAELab extension, not an upstream patch.
        app.daelabCreativeCanvas=view;
        installMaterialGroups(app);
        if(app.graph?.extra?.[STATE_KEY]?.active)void switchMode(true);syncMenu();
    },
    beforeConfigureGraph(){view?.hide(false);restoreLabels();},
    afterConfigureGraph(){if(view&&app.graph?.extra?.[STATE_KEY]?.active)void switchMode(true);updateLabel();},
});
