import importlib
import json
import sys
import time
from fractions import Fraction
from pathlib import Path

import av
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root.parents[1]))
sys.path.insert(0, str(root.parent))
import folder_paths

work = root / 'artifacts' / 'video-edit'
for name in ('input', 'output', 'temp'):
    (work / name).mkdir(parents=True, exist_ok=True)
folder_paths.set_input_directory(str(work / 'input'))
folder_paths.set_output_directory(str(work / 'output'))
folder_paths.set_temp_directory(str(work / 'temp'))
m = importlib.import_module(root.name + '.nodes.video_edit_media')
node = importlib.import_module(root.name + '.nodes.video_edit')
Image.new('RGB', (640, 360), (220, 40, 20)).save(work / 'input' / 'red.png')
Image.new('RGB', (240, 480), (20, 70, 220)).save(work / 'input' / 'blue.png')
Image.new('RGBA', (64, 64), (255, 255, 255, 0)).save(work / 'input' / 'transparent.png')
assert np.asarray(m.load_image(work / 'input' / 'transparent.png')).max() == 0
with av.open(str(work / 'input' / 'motion.mp4'), 'w') as out:
    v = out.add_stream('libx264', rate=24)
    v.width, v.height, v.pix_fmt = 640, 360, 'yuv420p'
    a = out.add_stream('aac', rate=48000)
    a.layout = 'stereo'
    for i in range(72):
        pixels = np.zeros((360, 640, 3), dtype=np.uint8)
        pixels[:, :, 1] = 160
        pixels[:, i*8:i*8+48, :] = 240
        frame = av.VideoFrame.from_ndarray(pixels, format='rgb24')
        frame.pts, frame.time_base = i, Fraction(1, 24)
        out.mux(v.encode(frame))
    out.mux(v.encode())
    for at in range(0, 144000, 1024):
        t = np.arange(at, min(at+1024, 144000)) / 48000
        tone = (np.sin(t * 2*np.pi*440)*0.15).astype(np.float32)
        frame = av.AudioFrame.from_ndarray(np.stack([tone, tone]), format='fltp', layout='stereo')
        frame.sample_rate, frame.pts, frame.time_base = 48000, at, Fraction(1, 48000)
        out.mux(a.encode(frame))
    out.mux(a.encode())

photo={'filename':'red.png','type':'input'}
video={'filename':'motion.mp4','type':'input'}
blue={'filename':'blue.png','type':'input'}
data={'version':1,'fit':'contain','clips':[
    {'source':{'asset':photo},'duration':0.5},
    {'source':{'asset':video},'start':1,'duration':1},
    {'source':{'asset':blue},'duration':0.5},
]}
result=node.VideoEdit.execute(json.dumps(data))
info=m.media_info(result.result[1])
assert (info['width'],info['height']) == (640,360)
assert abs(info['duration']-2)<0.05 and info['has_audio']
path,_,_=m.resolve_media(result.result[1])
with av.open(str(path)) as inp:
    means=[f.to_ndarray(format='rgb24').mean(axis=(0,1)) for f in inp.decode(video=0)]
assert len(means)==48
assert means[3][0]>means[3][1]*2
assert means[20][1]>means[20][0]*2
assert means[44][2]>means[44][0]*2
with av.open(str(path)) as inp:
    chunks=[f.to_ndarray() for f in inp.decode(audio=0)]
    audio=np.concatenate(chunks,axis=1)
assert np.abs(audio[:,:12000]).mean()<0.002
assert np.abs(audio[:,30000:60000]).mean()>0.03
assert np.abs(audio[:,84000:93000]).mean()<0.002
print('PASS mixed timeline, precise trim, letterbox, continuous audio and image silence')
for scale,dimensions in ((0.5,(320,180)),(0.75,(480,270)),(1,(640,360))):
    before=time.perf_counter()
    p=m.preview(video,scale,lambda:None)
    assert (p['width'],p['height'])==dimensions
    assert abs(m.media_info(p['url'])['duration']-3)<0.05
    again=m.preview(video,scale,lambda:None)
    assert p['url']==again['url']
    print(f'PASS preview {scale}x {dimensions}, cache reuse, {time.perf_counter()-before:.2f}s')
try:m.resolve_media({'filename':'../../README.md'})
except ValueError:pass
else:raise AssertionError('path traversal accepted')
try:m.resolve_media('https://example.com/video.mp4')
except ValueError:pass
else:raise AssertionError('remote source accepted')
clips,fit=m.edit_clips(data)
cancel_path=work/'output'/'cancelled.mp4'
def cancel():raise InterruptedError('cancel')
try:m.render(clips,cancel_path,check=cancel)
except InterruptedError:pass
assert not cancel_path.exists()
print('PASS local containment, remote rejection, cancelled output cleanup')
linked = {'version':1,'clips':[{'source':{'slot':'videos.video0'},'start':0.5,'duration':0.5}]}
resolved,_=m.edit_clips(linked,videos={'video0':'/view?filename=motion.mp4&type=input'})
assert resolved[0]['start']==0.5 and resolved[0]['duration']==0.5
print('PASS transparent image compositing and typed video input')
