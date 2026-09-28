import sys,importlib,json,argparse
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument("--comfy-root",required=True);parser.add_argument("--input-directory",required=True);args=parser.parse_args()
sys.path.insert(0,args.comfy_root)
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
import folder_paths
folder_paths.set_input_directory(args.input_directory)
m=importlib.import_module('ComfyUI-DAELab-Creative-Canvas.nodes.material_group')
assets=[{'id':'one','kind':'image','name':'山景','filename':'mountain.png','subfolder':'DAELAB/group-review-demo'},{'id':'two','kind':'video','name':'运动','filename':'motion.webm','subfolder':'DAELAB/group-review-demo'}]
r=m.MaterialGroup.execute(json.dumps({'version':1,'assets':assets}));assert [a['id'] for a in r.result[0]['assets']]==['one','two'];assert r.result[0]['assets'][1]['url'].startswith('/view?')
assert m.MaterialGroup.execute('{"version":1,"assets":[]}').result[0]['assets']==[]
try:m.MaterialGroup.execute(json.dumps({'version':1,'assets':[dict(assets[0],filename='missing.png')]}))
except ValueError:pass
else:raise AssertionError('missing asset accepted')
print('PASS actual backend image/video collection, order, empty and missing file')
