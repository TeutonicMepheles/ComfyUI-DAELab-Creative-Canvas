import {visibleTasks} from './creative_tasks_model.mjs';

// Only receives protocol snapshots; the canvas adapter owns the node boundary.
export function createTaskCapsules(){
    const root=document.createElement('div');root.className='dae-task-capsules';root.hidden=true;
    root.setAttribute('role','list');root.setAttribute('aria-label','节点任务');
    const rows=new Map();let signature='';
    return {root,update(snapshot,now){
        const tasks=visibleTasks(snapshot,now),next=JSON.stringify(tasks);if(next===signature)return;signature=next;
        const ids=new Set(tasks.map(task=>task.id));for(const [id,row] of rows)if(!ids.has(id)){row.remove();rows.delete(id);}
        for(const task of tasks){
            let row=rows.get(task.id);
            if(!row){row=document.createElement('div');row.className='dae-task-capsule';row.setAttribute('role','listitem');
                const marker=document.createElement('i');marker.className='dae-task-marker';marker.setAttribute('aria-hidden','true');
                const label=document.createElement('span');label.className='dae-task-label';const detail=document.createElement('span');detail.className='dae-task-detail';
                row.append(marker,label,detail);rows.set(task.id,row);}
            row.dataset.state=task.state;row.children[1].textContent=task.label;row.children[2].textContent=task.text;
            row.setAttribute('aria-label',`${task.label}：${task.text}`);root.append(row);
        }
        root.hidden=!tasks.length;
    },destroy(){rows.clear();root.remove();}};
}
