// Task presentation protocol v1. No node types, app, business fields or requests.
const states=new Set(['queued','running','paused','cancelled','error','recovery','success']);
export function visibleTasks(snapshot,now=Date.now()){
    const seen=new Set();
    return (Array.isArray(snapshot)?snapshot:[]).filter(task=>{
        if(!task||typeof task.id!=='string'||!task.id||seen.has(task.id)||typeof task.label!=='string'||!states.has(task.state))return false;
        seen.add(task.id);
        // Terminal receipts without a time are historical, not new notifications.
        return !['success','cancelled'].includes(task.state)||(Number.isFinite(task.finishedAt)&&now-task.finishedAt<4000);
    }).map(task=>{
        const parts=[];
        if(Number.isFinite(task.done)&&Number.isFinite(task.total)&&task.total>0)parts.push(`${task.countLabel||'已完成'} ${Math.max(0,task.done)}/${task.total}${task.unit?' '+task.unit:''}`);
        if(task.detail)parts.push(String(task.detail));
        if(task.state==='running'&&Number.isFinite(task.progress))parts.push(`${Math.round(Math.max(0,Math.min(100,task.progress)))}%`);
        if(task.elapsed&&['queued','running'].includes(task.state)&&Number.isFinite(task.startedAt))parts.push(`已等待 ${Math.max(0,Math.floor((now-task.startedAt)/1000))} 秒`);
        return {id:task.id,label:task.label,state:task.state,text:parts.join(' · '),order:Number.isFinite(task.order)?task.order:100};
    }).sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
}
