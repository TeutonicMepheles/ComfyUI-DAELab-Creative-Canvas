"""Keep the standalone Canvas registrations unless Studio owns the opt-in layer."""
import json
from pathlib import Path

CANVAS_PACKAGE = "ComfyUI-DAELab-Creative-Canvas"
STUDIO_PACKAGE = "ComfyUI-DAELab-Creative-Studio"


def studio_owns_canvas(user_directory, custom_node_roots, *, disabled=False, whitelist=()):
    if disabled and STUDIO_PACKAGE not in whitelist:
        return False
    if not any((Path(root) / STUDIO_PACKAGE / "__init__.py").is_file() for root in custom_node_roots):
        return False
    config_path = Path(user_directory) / "daelab" / "coexistence.json"
    if not config_path.is_file():
        return False
    config = json.loads(config_path.read_text(encoding="utf-8"))
    if not isinstance(config, dict):
        raise ValueError("coexistence.json must be a JSON object")
    allowed = config.get("allowLegacyPackages", [])
    if not isinstance(allowed, list):
        raise ValueError("coexistence.json allowLegacyPackages must be an array")
    if CANVAS_PACKAGE not in allowed:
        return False
    owners = config.get("layerOwners")
    if not isinstance(owners, dict) or owners.get("canvas") != "studio":
        raise ValueError("Canvas and Studio coexistence requires layerOwners.canvas = studio")
    return True
