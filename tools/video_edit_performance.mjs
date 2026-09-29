import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {createTimelineIndex,locate,totalTime} from '../web/video_edit_model.mjs';

const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)];
function measure(fn){const values=[];for(let i=0;i<7;i++){const start=performance.now();fn();values.push(performance.now()-start);}return median(values);}
const results=[];
for(const count of [10,100,500,1000]){
    const clips=Array.from({length:count},(_,id)=>({id,duration:0.125+(id%7)/30,asset:{fps:30000/1001}}));
    const index=createTimelineIndex(clips),queries=Array.from({length:10000},(_,i)=>(i*0.137)%index.total);
    for(const span of index.spans)for(const time of [span.start,span.end-1e-7,span.end,span.end+1e-7])assert.deepEqual(index.at(time),locate(clips,time));
    assert.equal(index.total,totalTime(clips));
    const before=()=>{let sum=0;for(const t of queries)sum+=locate(clips,t).clip.id+totalTime(clips);return sum;};
    const after=()=>{let sum=0;for(const t of queries)sum+=index.at(t).clip.id+index.total;return sum;};
    assert.equal(after(),before());before();after();
    results.push({clips:count,queries:queries.length,beforeMs:measure(before),afterMs:measure(after),buildMs:measure(()=>createTimelineIndex(clips))});
}
assert.equal(createTimelineIndex([]).at(0),null);
console.log(JSON.stringify({node:process.version,scope:'Timeline lookup + duration; no DOM, decode or export timing',results},null,2));
