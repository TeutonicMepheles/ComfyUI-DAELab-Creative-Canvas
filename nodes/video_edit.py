import asyncio
import json
import threading
import uuid
from pathlib import Path
from urllib.parse import urlencode

from aiohttp import web
from av.error import FFmpegError
import folder_paths
from comfy_api.latest import io, InputImpl
from comfy import model_management
from comfy.utils import ProgressBar
from server import PromptServer

from .video_edit_media import edit_clips, media_info, preview, render


class VideoEdit(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id='DAELAB.VideoEdit', display_name='剪辑', category='DAELab/剪辑',
            inputs=[io.String.Input('edit_data', default='{"version":1,"clips":[],"fit":"contain"}', multiline=True),
                    io.Custom('DAELAB_ASSETS').Input('assets', optional=True),
                    io.Autogrow.Input('videos', template=io.Autogrow.TemplatePrefix(io.Custom('COMFYTV_VIDEO').Input('video'), prefix='video', min=0, max=100), optional=True),
                    io.Autogrow.Input('images', template=io.Autogrow.TemplatePrefix(io.Custom('COMFYTV_IMAGE').Input('image'), prefix='image', min=0, max=100), optional=True)],
            outputs=[io.Video.Output('video', display_name='剪辑成片', tooltip='按时间轴剪辑并拼接后的视频'),
                     io.Custom('COMFYTV_VIDEO').Output('video_ref', display_name='剪辑成片引用', tooltip='同一成片的本地视频引用')], is_output_node=True)

    @classmethod
    def execute(cls, edit_data, assets=None, videos=None, images=None):
        edit = json.loads(edit_data)
        clips, fit = edit_clips(edit, assets, videos, images)
        directory = Path(folder_paths.get_output_directory()) / 'DAELAB' / 'edits'
        directory.mkdir(parents=True, exist_ok=True)
        output = directory / (uuid.uuid4().hex + '.mp4')
        bar = ProgressBar(100)
        render(clips, output, fit=fit, resolution=edit.get('resolution'), check=model_management.throw_exception_if_processing_interrupted,
               progress=lambda done, total: bar.update_absolute(round(done/total*100), 100))
        ref = dict(filename=output.name, subfolder='DAELAB/edits', type='output')
        return io.NodeOutput(InputImpl.VideoFromFile(str(output)), '/view?' + urlencode(ref), ui={'videos': [ref], 'edit_data': [edit_data]})


preview_lock = asyncio.Lock()


async def inspect_media(request):
    try:
        data = await request.json()
        return web.json_response(await asyncio.to_thread(media_info, data['asset']))
    except (ValueError, KeyError, TypeError, OSError, FFmpegError) as e:
        return web.json_response({'error': str(e)}, status=400)


async def make_preview(request):
    stopped = threading.Event()
    def check():
        if stopped.is_set():
            raise InterruptedError('预览已取消')
    try:
        data = await request.json()
        async with preview_lock:
            check()
            if request.transport is None or request.transport.is_closing():
                raise InterruptedError('预览已取消')
            task = asyncio.create_task(asyncio.to_thread(preview, data['asset'], float(data['scale']), check))
            try:
                while not task.done():
                    await asyncio.wait({task}, timeout=0.2)
                    if request.transport is None or request.transport.is_closing():
                        stopped.set()
                return web.json_response(await task)
            finally:
                stopped.set()
                if not task.done():
                    await asyncio.shield(asyncio.gather(task, return_exceptions=True))
    except (ValueError, KeyError, TypeError, OSError, FFmpegError) as e:
        return web.json_response({'error': str(e)}, status=400)


if hasattr(PromptServer, 'instance'):
    PromptServer.instance.routes.post('/daelab/edit/media')(inspect_media)
    PromptServer.instance.routes.post('/daelab/edit/preview')(make_preview)
