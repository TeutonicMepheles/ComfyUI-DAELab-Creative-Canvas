"""Resolve local generated media references without copying their files."""
import uuid
from pathlib import Path
from urllib.parse import urlsplit, parse_qs


def import_materials(assets, input_root, output_root):
    if not isinstance(assets, list) or not 1 <= len(assets) <= 500:
        raise ValueError('请选择 1–500 个有效素材')
    roots = {'input':Path(input_root).resolve(), 'output':Path(output_root).resolve()}
    result=[]
    for asset in assets:
        if not isinstance(asset,dict): raise ValueError('素材格式无效')
        parsed=urlsplit(asset.get('url',''))
        if parsed.scheme or parsed.netloc or parsed.path != '/view':
            raise ValueError('只支持本地 /view 素材')
        q=parse_qs(parsed.query)
        if any(len(q.get(k,[]))!=1 for k in ('filename','type')) or len(q.get('subfolder',[]))>1:
            raise ValueError('素材地址无效')
        root=roots.get(q['type'][0])
        if root is None: raise ValueError('素材目录无效')
        path=(root/q.get('subfolder',[''])[0]/q['filename'][0]).resolve()
        if not path.is_relative_to(root) or not path.is_file():
            raise ValueError('素材文件不存在或超出允许目录')
        kind='image' if path.suffix.lower() in ('.png','.jpg','.jpeg','.webp') else 'video' if path.suffix.lower() in ('.mp4','.webm','.mov') else None
        if kind is None or asset.get('kind')!=kind: raise ValueError('素材类型不匹配')
        subfolder=path.parent.relative_to(root).as_posix()
        reference=f"{q['type'][0]}/{subfolder}/{path.name}"
        result.append(dict(version=1,id=asset.get('id') or uuid.uuid5(uuid.NAMESPACE_URL,reference).hex,kind=kind,
            name=asset.get('name') or path.name,filename=path.name,
            subfolder=subfolder,type=q['type'][0],size=path.stat().st_size,
            provenance=asset.get('provenance',{})))
    return result
