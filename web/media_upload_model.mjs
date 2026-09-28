export const UPLOAD_TYPE='DAELAB.MediaUpload';
export const ACCEPT='.png,.jpg,.jpeg,.webp,.mp4,.webm,.mov';
export function mediaKind(name='') {
    return /\.(png|jpe?g|webp)$/i.test(name)?'image':/\.(mp4|webm|mov)$/i.test(name)?'video':null;
}
export function readAsset(raw){try{const a=JSON.parse(raw||'{}');return a.filename&&a.kind?a:null;}catch{return null;}}
export function assetURL(a){return a?'/view?'+new URLSearchParams({filename:a.filename,subfolder:a.subfolder||'',type:'input'}):'';}
export function slotAllowed(kind,index){return kind==='image'?[0,1,3].includes(index):kind==='video'?[2,4].includes(index):false;}
