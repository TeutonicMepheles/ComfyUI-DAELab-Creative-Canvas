import hashlib
import json
import math
import time
import uuid
from fractions import Fraction
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit

import av
import numpy as np
from PIL import Image, ImageOps

import folder_paths


def resolve_media(asset):
    if isinstance(asset, str):
        url = urlsplit(asset)
        if url.scheme or url.netloc or url.path != '/view':
            raise ValueError('剪辑只接受本地素材')
        asset = {k: v[0] for k, v in parse_qs(url.query).items()}
    if not isinstance(asset, dict):
        raise ValueError('素材引用格式无效')
    roots = {'input': folder_paths.get_input_directory(), 'output': folder_paths.get_output_directory(), 'temp': folder_paths.get_temp_directory()}
    kind = asset.get('type', 'input')
    if kind not in roots:
        raise ValueError('素材目录类型无效')
    root = Path(roots[kind]).resolve()
    path = (root / asset.get('subfolder', '') / asset.get('filename', '')).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise ValueError('素材不存在或超出允许目录，请重新添加')
    suffix = path.suffix.lower()
    media_kind = 'image' if suffix in ('.png', '.jpg', '.jpeg', '.webp') else 'video' if suffix in ('.mp4', '.webm', '.mov', '.mkv', '.m4v') else None
    if media_kind is None:
        raise ValueError('不支持的剪辑素材格式')
    ref = dict(filename=path.name, subfolder=path.parent.relative_to(root).as_posix(), type=kind)
    return path, media_kind, {**ref, 'kind': media_kind, 'name': asset.get('name', path.name), 'url': '/view?' + urlencode(ref)}


def media_info(asset):
    path, kind, ref = resolve_media(asset)
    if kind == 'image':
        with Image.open(path) as image:
            image = ImageOps.exif_transpose(image)
            width, height = image.size
        return {**ref, 'width': width, 'height': height, 'duration': 3.0, 'fps': 24.0, 'has_audio': False}
    with av.open(str(path)) as inp:
        if not inp.streams.video:
            raise ValueError('素材没有视频画面')
        video = inp.streams.video[0]
        duration = float(video.duration * video.time_base) if video.duration is not None else float(inp.duration or 0) / av.time_base
        if duration <= 0:
            raise ValueError('无法读取视频时长')
        return {**ref, 'width': video.width, 'height': video.height, 'duration': duration,
                'fps': float(video.average_rate or 24), 'has_audio': bool(inp.streams.audio)}


def edit_clips(data, assets=None, videos=None, images=None, groups=None):
    edit = json.loads(data) if isinstance(data, str) else data
    if not isinstance(edit, dict) or edit.get('version') != 1 or not isinstance(edit.get('clips'), list):
        raise ValueError('剪辑数据格式无效')
    slots = {**{f'videos.{k.split(".")[-1]}': v for k, v in (videos or {}).items()},
             **{f'images.{k.split(".")[-1]}': v for k, v in (images or {}).items()}}
    collections = {'assets': assets or {}, **{f'groups.{k.split(".")[-1]}': v for k, v in (groups or {}).items()}}
    group_assets = {slot: {a['id']: a for a in collection.get('assets', [])} for slot, collection in collections.items()}
    group_members = {slot: {str(a['nodeId']): a for a in collection.get('assets', []) if a.get('nodeId') is not None} for slot, collection in collections.items()}
    clips, inspected = [], {}
    for clip in edit['clips']:
        source = clip.get('source', {})
        slot = source.get('slot')
        if slot == 'assets' or (slot and slot.startswith('groups.')):
            asset = group_members.get(slot, {}).get(str(source['nodeId'])) if source.get('nodeId') is not None else group_assets.get(slot, {}).get(source.get('assetId'))
            if asset is None:
                raise ValueError('已连接素材组中的片段来源缺失，请重新添加')
        elif slot:
            if not slots.get(slot):
                raise ValueError('片段来源连接已断开，请重新添加')
            asset = slots[slot]
        else:
            asset = source.get('asset')
        if not asset:
            raise ValueError('片段缺少素材')
        key = json.dumps(asset, sort_keys=True)
        if key not in inspected:
            inspected[key] = media_info(asset)
        info = inspected[key]
        start = float(clip.get('start', 0)) if info['kind'] == 'video' else 0.0
        duration = float(clip.get('duration', info['duration']))
        if not math.isfinite(start) or not math.isfinite(duration) or start < 0 or duration <= 0:
            raise ValueError('片段开始时间必须非负，时长必须大于零')
        if info['kind'] == 'video':
            duration = min(duration, info['duration'] - start)
            if duration <= 0:
                raise ValueError('截取范围超出视频结尾')
        fit = clip.get('fit', edit.get('fit', 'contain'))
        if fit not in ('contain', 'cover'):
            raise ValueError('片段画面适配方式无效')
        clips.append({'asset': info, 'start': start, 'duration': duration, 'mute': bool(clip.get('mute', False)), 'fit': fit})
    if not clips:
        raise ValueError('请先添加图片或视频片段')
    if edit.get('fit', 'contain') not in ('contain', 'cover'):
        raise ValueError('画面适配方式无效')
    return clips, edit.get('fit', 'contain')


def load_image(path):
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert('RGBA')
        background = Image.new('RGB', image.size)
        background.paste(image, mask=image.getchannel('A'))
    return background


def fit_frame(frame, width, height, fit):
    if frame.width * height == frame.height * width:
        return frame.reformat(width=width, height=height, format='yuv420p')
    ratio = (max if fit == 'cover' else min)(width / frame.width, height / frame.height)
    w, h = max(1, round(frame.width * ratio)), max(1, round(frame.height * ratio))
    pixels = frame.reformat(width=w, height=h, format='rgb24').to_ndarray()
    if fit == 'cover':
        pixels = pixels[(h-height)//2:(h-height)//2+height, (w-width)//2:(w-width)//2+width]
    else:
        canvas = np.zeros((height, width, 3), dtype=np.uint8)
        canvas[(height-h)//2:(height-h)//2+h, (width-w)//2:(width-w)//2+w] = pixels
        pixels = canvas
    return av.VideoFrame.from_ndarray(np.ascontiguousarray(pixels), format='rgb24').reformat(format='yuv420p')


def video_frames(path, start, count, fps, check):
    with av.open(str(path)) as inp:
        stream = inp.streams.video[0]
        origin = float((stream.start_time or 0) * stream.time_base)
        inp.seek(int((start + origin) / stream.time_base), stream=stream, backward=True)
        decoded = iter(inp.decode(stream))
        current = next(decoded, None)
        if current is None:
            raise ValueError('截取范围没有可解码画面')
        following = next(decoded, None)
        last_t = float(current.time or origin) - origin
        for index in range(count):
            check()
            target = start + index / float(fps)
            while following is not None:
                next_t = float(following.time) - origin if following.time is not None else last_t + 1 / float(fps)
                if next_t > target + 1e-7:
                    break
                current, last_t = following, next_t
                following = next(decoded, None)
            yield current


def audio_chunks(path, start, duration, check, rate=48000):
    total = round(duration * rate)
    position = 0
    with av.open(str(path)) as inp:
        stream = inp.streams.audio[0]
        video = inp.streams.video[0]
        origin = float((video.start_time or 0) * video.time_base)
        inp.seek(max(0, int((start + origin) * av.time_base)), backward=True)
        resampler = av.AudioResampler(format='fltp', layout='stereo', rate=rate)
        fallback = start
        def converted():
            for frame in inp.decode(stream):
                check()
                yield from resampler.resample(frame)
            yield from resampler.resample(None)
        for frame in converted():
            t = float(frame.time) - origin if frame.time is not None else fallback
            fallback = t + frame.samples / rate
            at = round((t - start) * rate)
            if at >= total:
                break
            if at + frame.samples <= position:
                continue
            while position < max(0, at):
                n = min(1024, at-position, total-position)
                check()
                yield np.zeros((2, n), dtype=np.float32)
                position += n
            begin = max(0, position-at)
            n = min(frame.samples-begin, total-position)
            if n > 0:
                yield np.ascontiguousarray(frame.to_ndarray()[:, begin:begin+n])
                position += n
    while position < total:
        check()
        n = min(1024, total-position)
        yield np.zeros((2, n), dtype=np.float32)
        position += n


def render(clips, output, fit='contain', scale=1.0, check=lambda: None, progress=lambda value, total: None, resolution=None):
    first = clips[0]['asset']
    size = first if resolution is None else resolution
    if resolution is not None and (not isinstance(size, dict) or any(type(size.get(key)) is not int or size[key] < 2 for key in ('width', 'height'))):
        raise ValueError('锁定分辨率的宽高必须为大于等于 2 的整数')
    width, height = max(2, int(size['width'] * scale)//2*2), max(2, int(size['height'] * scale)//2*2)
    fps = Fraction(str(first['fps'])).limit_denominator(1001)
    boundaries, duration = [0], 0.0
    for clip in clips:
        duration += clip['duration']
        boundaries.append(max(boundaries[-1]+1, round(duration*fps)))
    has_audio = any(c['asset']['has_audio'] and not c['mute'] for c in clips)
    output = Path(output)
    try:
        with av.open(str(output), 'w', options={'movflags': '+faststart'}) as out:
            video = out.add_stream('libx264', rate=fps, options={'crf': '20' if scale == 1 else '23', 'preset': 'veryfast'})
            video.width, video.height, video.pix_fmt = width, height, 'yuv420p'
            audio = out.add_stream('aac', rate=48000) if has_audio else None
            if audio:
                audio.layout = 'stereo'
            samples = 0
            for i, clip in enumerate(clips):
                check()
                clip_fit = clip.get('fit', fit)
                path, kind, _ = resolve_media(clip['asset'])
                count = boundaries[i+1]-boundaries[i]
                if kind == 'image':
                    still = fit_frame(av.VideoFrame.from_image(load_image(path)), width, height, clip_fit)
                    frames = (still for _ in range(count))
                else:
                    frames = video_frames(path, clip['start'], count, fps, check)
                for index, frame in enumerate(frames):
                    check()
                    frame = fit_frame(frame, width, height, clip_fit)
                    frame.pts, frame.time_base = boundaries[i]+index, 1/fps
                    out.mux(video.encode(frame))
                    progress(boundaries[i]+index+1, boundaries[-1])
                if audio:
                    end_sample = round(boundaries[i+1] / fps * 48000)
                    length = (end_sample-samples)/48000
                    if kind == 'video' and clip['asset']['has_audio'] and not clip['mute']:
                        chunks = audio_chunks(path, clip['start'], length, check)
                    else:
                        chunks = (np.zeros((2, min(1024, end_sample-j)), dtype=np.float32) for j in range(samples, end_sample, 1024))
                    for chunk in chunks:
                        check()
                        frame = av.AudioFrame.from_ndarray(chunk, format='fltp', layout='stereo')
                        frame.sample_rate, frame.pts, frame.time_base = 48000, samples, Fraction(1, 48000)
                        samples += frame.samples
                        out.mux(audio.encode(frame))
            out.mux(video.encode())
            if audio:
                out.mux(audio.encode())
        return width, height
    except BaseException:
        output.unlink(missing_ok=True)
        raise


def preview(asset, scale, check):
    if scale not in (0.5, 0.75, 1.0):
        raise ValueError('预览倍率无效')
    info = media_info(asset)
    if scale == 1:
        return {**info, 'scale': 1}
    path, kind, _ = resolve_media(asset)
    stat = path.stat()
    key = hashlib.sha256(json.dumps([str(path), stat.st_size, stat.st_mtime_ns, scale, 1]).encode()).hexdigest()
    directory = Path(folder_paths.get_temp_directory()) / 'DAELAB' / 'edit-preview'
    directory.mkdir(parents=True, exist_ok=True)
    for old in directory.iterdir():
        if old.is_file() and time.time()-old.stat().st_mtime > 7*86400:
            old.unlink(missing_ok=True)
    suffix = '.jpg' if kind == 'image' else '.mp4'
    output = directory / (key + suffix)
    width, height = max(2, int(info['width']*scale)//2*2), max(2, int(info['height']*scale)//2*2)
    if not output.exists():
        staging = directory / (uuid.uuid4().hex + suffix)
        try:
            if kind == 'image':
                check()
                load_image(path).resize((width, height), Image.Resampling.LANCZOS).save(staging, quality=90)
            else:
                render([{'asset': info, 'start': 0, 'duration': info['duration'], 'mute': False}], staging, scale=scale, check=check)
            check()
            staging.replace(output)
        finally:
            staging.unlink(missing_ok=True)
    return {**info, 'url': '/view?' + urlencode(dict(filename=output.name, subfolder='DAELAB/edit-preview', type='temp')),
            'width': width, 'height': height, 'scale': scale}
