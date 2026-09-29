from .nodes.media_upload import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
from .nodes.material_group import MaterialGroup
from .nodes.video_edit import VideoEdit

NODE_CLASS_MAPPINGS['DAELAB.MaterialGroup'] = MaterialGroup
NODE_DISPLAY_NAME_MAPPINGS['DAELAB.MaterialGroup'] = '素材组'
NODE_CLASS_MAPPINGS['DAELAB.VideoEdit'] = VideoEdit
NODE_DISPLAY_NAME_MAPPINGS['DAELAB.VideoEdit'] = '剪辑'

WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
