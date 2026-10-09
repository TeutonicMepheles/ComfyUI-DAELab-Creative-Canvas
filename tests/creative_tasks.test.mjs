import test from 'node:test';
import assert from 'node:assert/strict';
import {visibleTasks} from '../web/creative_tasks_model.mjs';
test('task protocol rejects malformed/duplicate entries and never invents progress',()=>{
 const input=[null,{id:'a',label:'上传',state:'running',startedAt:1000,elapsed:true},{id:'a',label:'重复',state:'error'}, {id:'b',label:'非法',state:'madeup'}];
 const before=JSON.stringify(input),result=visibleTasks(input,4000);assert.equal(result.length,1);assert.equal(result[0].text,'已等待 3 秒');assert.equal(JSON.stringify(input),before);
});
test('terminal receipts expire while failures persist and history is quiet',()=>{
 const task={id:'x',label:'导出',state:'success'};assert.equal(visibleTasks([task],5000).length,0);
 assert.equal(visibleTasks([{...task,finishedAt:2000}],5000).length,1);assert.equal(visibleTasks([{...task,finishedAt:1000}],5000).length,0);
 assert.equal(visibleTasks([{...task,state:'recovery'}],5000).length,1);
});
test('stable order, truthful count label, clamped percentage and instance isolation',()=>{
 const a=[{id:'video',label:'视频',state:'running',order:20,progress:140},{id:'opt',label:'优化',state:'running',order:10,done:2,total:3,countLabel:'已结束'}];
 assert.deepEqual(visibleTasks(a).map(t=>t.id),['opt','video']);assert.equal(visibleTasks(a)[0].text,'已结束 2/3');assert.equal(visibleTasks(a)[1].text,'100%');assert.deepEqual(visibleTasks([]),[]);
});
