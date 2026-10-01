import {STATE_KEY} from './creative_canvas_model.mjs';

function withoutLayout(snapshot){
    return JSON.stringify({...snapshot,nodes:snapshot.nodes.map(node=>({...node,properties:{...node.properties,daelabLayoutRevision:undefined}})),extra:{...snapshot.extra,[STATE_KEY]:{...snapshot.extra[STATE_KEY],cards:null}}});
}

// Keep the host's undo queues and notifications; only skip its graph reload for layout-only restores.
export function installLayoutHistory(app){
    const load=app.loadGraphData;
    app.loadGraphData=async function(...args){
        const [snapshot,reset=true,restoreView=true,workflow=null]=args;
        const t=app.extensionManager?.workflow?.activeWorkflow?.changeTracker,graph=app.graph,view=app.daelabCreativeCanvas;
        const current=graph?.extra?.[STATE_KEY],next=snapshot?.extra?.[STATE_KEY];
        if(reset===false&&restoreView===false&&t?._restoringState&&t.changeCount===0&&workflow===t.workflow&&graph===app.rootGraph&&view?.active&&current?.active&&next?.active){
            const live=graph.serialize();
            if(withoutLayout(live)===withoutLayout(snapshot)&&JSON.stringify(Object.keys(current.cards).sort())===JSON.stringify(Object.keys(next.cards).sort())){
                for(const [id,layout] of Object.entries(next.cards)){
                    const target=current.cards[id];
                    for(const key of Object.keys(target))if(!(key in layout))delete target[key];
                    Object.assign(target,structuredClone(layout));
                }
                for(const saved of snapshot.nodes){
                    const node=graph.getNodeById(saved.id),revision=saved.properties?.daelabLayoutRevision;
                    if(revision===undefined)delete node.properties.daelabLayoutRevision;else node.properties.daelabLayoutRevision=revision;
                }
                view.sync();graph.setDirtyCanvas?.(true,true);return;
            }
        }
        return load.apply(this,args);
    };
}

// Compatibility boundary for DOM canvas edits and the host workflow undo stack.
export function canvasHistory(app){
    const tracker=()=>app.extensionManager?.workflow?.activeWorkflow?.changeTracker;
    // Flush the host debounce before a drag; otherwise it can replace the
    // pre-drag undo state with an intermediate position while changeCount > 0.
    return {
        begin(){const t=tracker();t?.captureCanvasState?.();t?.squashState?.flush?.();t?.beforeChange?.();},
        end(){tracker()?.afterChange?.();},
        // Fold derived changes into the current state without another undo step or clearing redo.
        amend(change){
            const t=tracker();if(!t)return change();
            t.squashState?.flush?.();t.captureCanvasState();
            const nested=t.changeCount>0,previous=t.activeState;
            t.beforeChange();
            try{
                const result=change();
                if(!nested){t.activeState=JSON.parse(JSON.stringify(app.rootGraph.serialize()));t.updateModified(previous);}
                return result;
            }finally{t.afterChange();}
        },
        updateViewport(viewport){
            const t=tracker();if(!t)return;
            // The host compares custom graph.extra data, including our viewport.
            // Keep only view coordinates current across its snapshots; edits stay intact.
            for(const snapshot of new Set([t.initialState,t.activeState,...t.undoQueue,...t.redoQueue])){
                const canvas=snapshot?.extra?.[STATE_KEY];if(canvas)canvas.viewport={...viewport};
            }
        },
    };
}
