import {registerAdapter} from '../creative_contract.mjs';
import {readAsset} from '../media_upload_model.mjs';
registerAdapter('daelab.upload', {
    matches: node => node.type === 'DAELAB.MediaUpload', width:680, expanded:true,
    menu:[{label:'上传',type:'DAELAB.MediaUpload',icon:'upload-2-line'}],
    panel: node => node.__mediaUpload,
    refresh: node => node.__mediaUpload?.render(),
    upload: (node,file) => node.__mediaUpload.upload(file),
    assets: node => {const asset=readAsset(node.widgets?.find(w=>w.name==='asset_data')?.value);return {version:1,assets:asset?[asset]:[]};},
});
