"""Local media source; no upstream imports or generation services."""
import json
from pathlib import Path
from urllib.parse import urlencode

import folder_paths
from comfy_api.latest import io, InputImpl


def resolve_asset(raw):
    asset = json.loads(raw)
    root = Path(folder_paths.get_input_directory()).resolve()
    path = (root / asset.get('subfolder', '') / asset.get('filename', '')).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise ValueError('上传素材不存在，请重新上传')
    kind = 'image' if path.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp') else 'video' if path.suffix.lower() in ('.mp4', '.webm', '.mov') else None
    if kind is None or asset.get('kind') != kind:
        raise ValueError('不支持的素材格式')
    url = '/view?' + urlencode(dict(filename=path.name, subfolder=path.parent.relative_to(root).as_posix(), type='input'))
    return path, kind, url


class MediaUpload(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id='DAELAB.MediaUpload', display_name='上传', category='DAELab/素材',
            inputs=[io.String.Input('asset_data', default='{}', multiline=True)],
            outputs=[io.Custom('COMFYTV_IMAGE').Output('image_ref'), io.Custom('COMFYTV_IMAGES').Output('image_refs'),
                     io.Custom('COMFYTV_VIDEO').Output('video_ref'), io.Image.Output('image'), io.Video.Output('video')])

    @classmethod
    def execute(cls, asset_data):
        path, kind, url = resolve_asset(asset_data)
        if kind == 'video':
            return io.NodeOutput(None, [], url, None, InputImpl.VideoFromFile(str(path)))
        import numpy as np
        import torch
        from PIL import Image, ImageOps
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert('RGB')
            tensor = torch.from_numpy(np.asarray(image).astype(np.float32) / 255.0).unsqueeze(0)
        return io.NodeOutput(url, json.dumps({'images': [{'image_url': url}]}), None, tensor, None)


NODE_CLASS_MAPPINGS = {'DAELAB.MediaUpload': MediaUpload}
NODE_DISPLAY_NAME_MAPPINGS = {'DAELAB.MediaUpload': '上传'}
