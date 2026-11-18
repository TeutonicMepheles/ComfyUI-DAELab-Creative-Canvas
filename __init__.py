import folder_paths
from comfy.cli_args import args

from .coexistence import studio_owns_canvas

# Studio supplies the four Canvas node IDs, browser entrypoints and material route
# when it owns the layer. ComfyUI still loads this package and its empty mapping.
if studio_owns_canvas(
    folder_paths.get_user_directory(),
    folder_paths.get_folder_paths("custom_nodes"),
    disabled=args.disable_all_custom_nodes,
    whitelist=args.whitelist_custom_nodes,
):
    NODE_CLASS_MAPPINGS = {}
    NODE_DISPLAY_NAME_MAPPINGS = {}
    WEB_DIRECTORY = None
else:
    from .nodes.media_upload import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    from .nodes.material_group import MaterialGroup
    from .nodes.video_edit import VideoEdit
    from .nodes.text_input import TextInput

    NODE_CLASS_MAPPINGS.update({
        "DAELAB.TextInput": TextInput,
        "DAELAB.MaterialGroup": MaterialGroup,
        "DAELAB.VideoEdit": VideoEdit,
    })
    NODE_DISPLAY_NAME_MAPPINGS.update({
        "DAELAB.TextInput": "输入文本",
        "DAELAB.MaterialGroup": "素材组",
        "DAELAB.VideoEdit": "剪辑",
    })
    WEB_DIRECTORY = "./web"

    from .nodes import material_output_api

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
