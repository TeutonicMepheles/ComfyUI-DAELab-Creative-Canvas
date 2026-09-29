import test from 'node:test';
import assert from 'node:assert/strict';
import {newClip,spans,locate,resizeClip,splitClip,moveClip,totalTime,connectedEdit,emptyEdit} from '../web/video_edit_model.mjs';
const photo={kind:'image',duration:3,name:'photo'},movie={kind:'video',duration:10,name:'movie'};
test('connections preserve edits and deletions, reconcile membership, and replace changed sources',()=>{
    const a={asset:{...photo,filename:'a.png'},source:{slot:'assets',assetId:'a'}},b={asset:{...movie,filename:'b.mp4'},source:{slot:'assets',assetId:'b'}};
    let edit=connectedEdit(emptyEdit(),[a,b]);
    edit.clips[0].duration=8;edit.clips=splitClip(edit.clips,2);
    assert.deepEqual(connectedEdit(edit,[b,a]).clips,edit.clips);
    edit.clips=edit.clips.filter(c=>c.source.assetId!=='b');
    assert.deepEqual(connectedEdit(edit,[a,b]).clips,edit.clips);
    assert.equal(connectedEdit(edit,[]).clips.length,0);
    const replaced=connectedEdit(edit,[{...a,asset:{...a.asset,filename:'new.png'}},b]);
    assert.equal(replaced.clips.length,1);assert.equal(replaced.clips[0].asset.filename,'new.png');
    assert.equal(connectedEdit(connectedEdit(edit,[]),[a,b]).clips.length,2);
});
test('mixed single track defaults and boundary seek select the next clip',()=>{
    const clips=[newClip(photo,{},'a'),newClip(movie,{},'b')];
    assert.equal(clips[0].duration,3);assert.equal(totalTime(clips),13);
    assert.equal(locate(clips,3).clip.id,'b');assert.equal(locate(clips,13).clip.id,'b');
    assert.deepEqual(spans(clips).map(s=>[s.start,s.end]),[[0,3],[3,13]]);
});
test('image duration can extend beyond source duration and video trim keeps source bounds',()=>{
    assert.equal(resizeClip(newClip(photo,{},'a'),'right',17).duration,20);
    const clip={...newClip(movie,{},'b'),start:2,duration:5};
    assert.deepEqual([resizeClip(clip,'left',1).start,resizeClip(clip,'left',1).duration],[3,4]);
    assert.equal(resizeClip(clip,'right',100).duration,8);
});
test('splitting and reordering retain source ranges and total duration',()=>{
    const clip={...newClip(movie,{slot:'videos.video0'},'a'),start:2,duration:6};
    const split=splitClip([clip],2,'b');
    assert.deepEqual(split.map(c=>[c.start,c.duration]),[[2,2],[4,4]]);
    assert.equal(totalTime(split),6);assert.equal(split[1].source.slot,'videos.video0');
    assert.deepEqual(moveClip(split,'b',0).map(c=>c.id),['b','a']);
    assert.equal(splitClip(split,2,'c').length,2);
});
