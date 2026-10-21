import {createCreativeButton,bindCreativeButton} from './creative_button.mjs';
import {readLibrary,assetKey,saveFavorite,removeFavorite,subscribeLibrary} from './asset_library_model.mjs';

export function libraryIcon(name){const i=document.createElement('i');i.className='dae-creative-icon';i.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+name+'.svg',import.meta.url).href}")`);i.setAttribute('aria-hidden','true');return i;}
export function createFavoriteButton(snapshot,{available=()=>true,onError=()=>{}}={}){
    let disposed=false,current=null,entries=[],loadError=null;
    const button=createCreativeButton('收藏',async()=>{
        try{
            if(disposed||!available())return;
            const value=snapshot();if(!value)return;
            const key=assetKey(value),entry=readLibrary().find(e=>assetKey(e)===key);
            if(entry)await removeFavorite(entry.id);else await saveFavorite(value);
            if(!disposed)sync();
        }catch(error){if(!disposed)onError(error.message);}
    });
    button.classList.add('dae-asset-favorite');button.dataset.assetFavorite='true';
    const star=libraryIcon('star-line');button.replaceChildren(star);
    const releaseButton=bindCreativeButton(button);
    function sync(){
        if(disposed)return;
        let value;try{value=snapshot();}catch{value=null;}
        current=null;try{if(value){const key=assetKey(value);current=entries.find(e=>assetKey(e)===key);}}catch{value=null;}
        button.hidden=!value;button.disabled=!available();
        star.style.setProperty('--dae-icon',`url("${new URL('./vendor/remixicon/'+(current?'star-fill':'star-line')+'.svg',import.meta.url).href}")`);
        const label=current?'取消收藏':'收藏到资产库';button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(!!current));button.title=loadError||label;
    }
    function refresh(){try{entries=readLibrary();loadError=null;}catch(error){loadError=error.message;}sync();}
    const release=subscribeLibrary(refresh);refresh();
    return {button,sync,destroy(){disposed=true;release();releaseButton();}};
}
