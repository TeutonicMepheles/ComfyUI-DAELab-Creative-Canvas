import {registerAdapter} from '../creative_contract.mjs';
registerAdapter('daelab.upload', {
    matches: node => node.type === 'DAELAB.MediaUpload', width:680, expanded:true,
    menu:[{label:'上传',type:'DAELAB.MediaUpload',icon:'upload-2-line'}],
    panel: node => node.__mediaUpload,
    refresh: node => node.__mediaUpload?.render(),
});
