import importlib.util
from pathlib import Path
import tempfile
import unittest
from PIL import Image
spec=importlib.util.spec_from_file_location('output_files',Path(__file__).parents[1]/'nodes/material_output_files.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class MaterialOutputImportTest(unittest.TestCase):
 def test_local_output_keeps_the_original_file_reference(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);i=root/'input';o=root/'output';i.mkdir();o.mkdir();Image.new('RGB',(8,8),'red').save(o/'a.png')
   assets=[dict(kind='image',id='one',url='/view?filename=a.png&type=output',provenance={'recordId':'row'})]
   first=module.import_materials(assets,i,o);self.assertEqual(first,module.import_materials(assets,i,o));self.assertEqual(first[0]['provenance'],{'recordId':'row'});self.assertEqual(first[0]['type'],'output');self.assertEqual((o/first[0]['subfolder']/first[0]['filename']).resolve(),(o/'a.png').resolve());self.assertEqual(list(i.iterdir()),[])
   (i/'b.mp4').write_bytes(b'local video reference')
   video=module.import_materials([dict(kind='video',url='/view?filename=b.mp4&type=input')],i,o)[0]
   self.assertEqual(video['type'],'input');self.assertEqual((i/video['subfolder']/video['filename']).resolve(),(i/'b.mp4').resolve());self.assertFalse((i/'DAELAB/results').exists())
   for url in ['/view?filename=../a.png&type=output','https://external/view?filename=a.png&type=output','/view?filename=a.png&type=output&type=input']:
    with self.assertRaises(ValueError):module.import_materials([dict(kind='image',url=url)],i,o)
 def test_validation_failure_creates_no_partial_files(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);i=root/'input';o=root/'output';i.mkdir();o.mkdir();Image.new('RGB',(8,8)).save(o/'a.png')
   with self.assertRaises(ValueError):module.import_materials([dict(kind='image',url='/view?filename=a.png&type=output'),dict(kind='image',url='/view?filename=missing.png&type=output')],i,o)
   self.assertFalse((i/'DAELAB/results').exists())
if __name__=='__main__':unittest.main()
