import test from 'node:test';
import assert from 'node:assert/strict';
import {connectedEdit,newClip,remapEditSources,sourceKey,splitClip} from '../web/video_edit_model.mjs';

const asset={filename:'copy-test.mp4',subfolder:'',type:'input',kind:'video',duration:10,fps:24,width:640,height:360};

for(const slot of ['assets','groups.group0'])test(`copying ${slot} preserves split, trimmed and deleted clips through sync and reload`,()=>{
    const source={slot,groupId:'10',nodeId:'1',assetId:'same-file'};
    const deletedSource={...source,nodeId:'2'};
    const original={version:1,fit:'contain',resolution:{width:640,height:360},
        clips:splitClip([{...newClip(asset,source,'edited'),start:2,duration:3,mute:true,fit:'cover'}],1,'split'),
        sources:[sourceKey(asset,source),sourceKey(asset,deletedSource)]};
    const before=structuredClone(original);
    const copied=remapEditSources(original,new Map([[1,{id:101}],[2,{id:102}],[10,{id:110}]]));
    const incoming=[source,deletedSource].map((s,i)=>({asset,source:{...s,nodeId:String(101+i),groupId:'110'}}));
    const synced=connectedEdit(JSON.parse(JSON.stringify(copied)),incoming);
    assert.deepEqual(synced.clips.map(c=>[c.id,c.start,c.duration,c.mute,c.fit]),[
        ['edited',2,1,true,'cover'],['split',3,2,true,'cover'],
    ]);
    assert.deepEqual(synced.sources,incoming.map(({asset,source})=>sourceKey(asset,source)));
    assert.deepEqual(synced.clips.map(c=>c.source),[incoming[0].source,incoming[0].source]);
    assert.deepEqual(synced.resolution,original.resolution);
    assert.deepEqual(connectedEdit(synced,incoming),synced);
    assert.deepEqual(original,before);
});

test('copy remaps each dynamic group independently and retains direct and unmapped references',()=>{
    const sources=[
        {slot:'groups.group0',groupId:'group-a',nodeId:'member-a',assetId:'same-file'},
        {slot:'groups.group1',groupId:'group-b',nodeId:'member-b',assetId:'same-file'},
        {slot:'video',nodeId:'member-a'},
        {slot:'groups.group2',groupId:'external-group',nodeId:'external-member',assetId:'same-file'},
    ];
    const edit={version:1,clips:sources.map((s,i)=>newClip(asset,s,String(i))),sources:sources.map(s=>sourceKey(asset,s))};
    const mapping=new Map([['group-a',{id:'copy-a'}],['group-b',{id:'copy-b'}],['member-a',{id:'copy-member-a'}],['member-b',{id:'copy-member-b'}]]);
    const copy=remapEditSources(edit,mapping);
    assert.deepEqual(copy.clips.map(c=>[c.source.groupId,c.source.nodeId]),[
        ['copy-a','copy-member-a'],['copy-b','copy-member-b'],[undefined,'copy-member-a'],['external-group','external-member'],
    ]);
    assert.deepEqual(copy.sources,copy.clips.map(c=>sourceKey(c.asset,c.source)));
    assert.deepEqual(copy.clips.map(c=>c.source.assetId),sources.map(s=>s.assetId));
});

test('copy keeps standalone clips and legacy source keys compatible',()=>{
    const source={slot:'assets',assetId:'legacy-file'};
    const edit={version:1,clips:[newClip(asset,source,'legacy'),newClip(asset,undefined,'local')]};
    const copy=remapEditSources(edit,new Map([[1,{id:101}]]));
    assert.deepEqual(copy,edit);
    const synced=connectedEdit(copy,[{asset,source:{...source,nodeId:'101',groupId:'110'}}]);
    assert.deepEqual(synced.clips.map(c=>c.id),['legacy','local']);
});
