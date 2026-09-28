"""Ordered local media collections; consumers own any table or generation mapping."""
import json
from comfy_api.latest import io
from .media_upload import resolve_asset


class MaterialGroup(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(node_id='DAELAB.MaterialGroup', display_name='素材组', category='DAELab/素材',
            inputs=[io.String.Input('collection_data', default='{"version":1,"assets":[]}', multiline=True)],
            outputs=[io.Custom('DAELAB_ASSETS').Output('assets')])

    @classmethod
    def execute(cls, collection_data):
        collection = json.loads(collection_data)
        if collection.get('version') != 1 or not isinstance(collection.get('assets'), list):
            raise ValueError('素材组数据格式不正确')
        assets = []
        for asset in collection['assets']:
            if not isinstance(asset, dict) or asset.get('missing'):
                raise ValueError('素材组有缺失素材，请先修复')
            _, kind, url = resolve_asset(json.dumps(asset))
            assets.append({**asset, 'kind': kind, 'url': url})
        return io.NodeOutput({'version': 1, 'assets': assets})
