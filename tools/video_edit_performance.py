import importlib.util
import json
import statistics
import sys
import time
from pathlib import Path

import av
from PIL import Image

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root.parents[1]))
import folder_paths


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def measure(fn, repeats=7):
    fn()
    samples = []
    for _ in range(repeats):
        start = time.perf_counter()
        fn()
        samples.append((time.perf_counter() - start) * 1000)
    return statistics.median(samples)


before = load(Path(sys.argv[1]), 'video_edit_before')
after = load(root / 'nodes/video_edit_media.py', 'video_edit_after')
directory = root / 'artifacts/video-edit-performance/fixture'
directory.mkdir(parents=True, exist_ok=True)
folder_paths.set_input_directory(str(directory))
movie = Path(directory) / 'sample.mp4'
with av.open(str(movie), 'w') as output:
    stream = output.add_stream('libx264', rate=24)
    stream.width, stream.height, stream.pix_fmt = 1920, 1080, 'yuv420p'
    for i in range(24):
        frame = av.VideoFrame.from_image(Image.new('RGB', (1920, 1080), (i * 7, 60, 160)))
        frame.pts = i
        output.mux(stream.encode(frame))
    output.mux(stream.encode())
results = []
for count in (10, 100, 500):
    data = {'version': 1, 'clips': [{'source': {'asset': {'filename': movie.name, 'type': 'input'}}, 'duration': 0.5} for _ in range(count)]}
    assert before.edit_clips(data) == after.edit_clips(data)
    results.append({'clips': count, 'uniqueFiles': 1, 'beforeMs': measure(lambda: before.edit_clips(data)), 'afterMs': measure(lambda: after.edit_clips(data))})
print(json.dumps({'scope': 'Local 1080p MP4 metadata preparation; warm file cache; excludes encoding', 'results': results}, indent=2))

data['clips'] = data['clips'][:6]
results = []
for scale in (1, 0.5):
    row = {'durationSeconds': 3, 'scale': scale}
    for name, module in (('before', before), ('after', after)):
        clips, fit = module.edit_clips(data)
        output = directory / f'{name}-{scale}.mp4'
        row[name + 'Ms'] = measure(lambda: module.render(clips, output, fit=fit, scale=scale), repeats=5)
        with av.open(str(output)) as rendered:
            count, previous = 0, -1
            for frame in rendered.decode(video=0):
                assert (frame.width, frame.height) == (int(1920 * scale), int(1080 * scale))
                assert frame.pts > previous
                count, previous = count + 1, frame.pts
            assert count == 72
    results.append(row)
print(json.dumps({'scope': 'Synthetic 3-second clip, six segments, no audio; decode/fit/encode timing', 'results': results}, indent=2))
