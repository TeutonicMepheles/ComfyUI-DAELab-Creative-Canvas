import asyncio
from aiohttp import web
from av.error import FFmpegError
import folder_paths
from server import PromptServer
from .material_output_files import import_materials


@PromptServer.instance.routes.post('/daelab/creative/material-output')
async def output_materials(request):
    if request.remote not in ('127.0.0.1','::1'):
        return web.json_response({'error':'请从本机使用素材输出'},status=403)
    origin=request.headers.get('Origin')
    if origin and origin.rstrip('/') not in ('http://'+request.host,'https://'+request.host):
        return web.json_response({'error':'来源不匹配'},status=403)
    try:
        body=await request.json()
        assets=await asyncio.to_thread(import_materials,body.get('assets'),
            folder_paths.get_input_directory(),folder_paths.get_output_directory())
        return web.json_response({'assets':assets})
    except (ValueError,TypeError,KeyError,OSError,FFmpegError) as error:
        return web.json_response({'error':str(error)},status=400)
