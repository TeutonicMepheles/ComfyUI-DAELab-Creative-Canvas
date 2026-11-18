import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("canvas_policy", Path(__file__).parents[1] / "coexistence.py")
policy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(policy)


class CanvasCoexistenceTests(unittest.TestCase):
    def test_explicit_owner_and_enabled_studio_are_both_required(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            config = root / "user" / "daelab" / "coexistence.json"
            config.parent.mkdir(parents=True)
            config.write_text(json.dumps({
                "allowLegacyPackages": [policy.CANVAS_PACKAGE],
                "layerOwners": {"canvas": "studio"},
            }), encoding="utf-8")
            user = config.parent.parent
            self.assertFalse(policy.studio_owns_canvas(user, [root]))
            studio = root / policy.STUDIO_PACKAGE
            studio.mkdir()
            (studio / "__init__.py").touch()
            self.assertTrue(policy.studio_owns_canvas(user, [root]))
            self.assertFalse(policy.studio_owns_canvas(user, [root], disabled=True))
            self.assertTrue(policy.studio_owns_canvas(user, [root], disabled=True, whitelist=[policy.STUDIO_PACKAGE]))
            config.write_text(json.dumps({"allowLegacyPackages": [policy.CANVAS_PACKAGE]}), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "layerOwners.canvas"):
                policy.studio_owns_canvas(user, [root])
            config.unlink()
            self.assertFalse(policy.studio_owns_canvas(user, [root]))
