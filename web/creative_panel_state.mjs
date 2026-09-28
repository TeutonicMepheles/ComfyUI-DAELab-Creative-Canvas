// Shared availability binding for panels owned by this extension, in every mode.
// Keep the host's inspector and other extensions' DOM untouched.
export function bindPanelAvailability(node, panel) {
    const hidden=panel.hidden, inert=panel.inert;
    let previous;
    const sync=()=>{
        const active=node.mode==null||node.mode===0;
        if(previous===active)return;
        previous=active;panel.hidden=active?hidden:true;panel.inert=active?inert:true;
        if(!active)panel.querySelectorAll('video,audio').forEach(media=>media.pause());
    };
    sync();const timer=setInterval(sync,100);
    return ()=>{clearInterval(timer);panel.hidden=hidden;panel.inert=inert;};
}
