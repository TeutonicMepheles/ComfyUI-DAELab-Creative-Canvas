import {createCreativeButton} from './creative_button.mjs';
import {bindCreativeField} from './creative_field.mjs';

const iconURL=name=>`url("${new URL('./vendor/remixicon/'+name+'.svg',import.meta.url).href}")`;
const time=value=>{const seconds=Math.floor(Number.isFinite(value)?Math.max(0,value):0),minutes=Math.floor(seconds/60);return `${minutes}:${String(seconds%60).padStart(2,'0')}`;};

export function createUploadVideoControls(video,stage,report){
    const bar=document.createElement('div');bar.className='dae-upload-player';
    const row=document.createElement('div');row.className='dae-upload-player-row';
    function button(label,icon,action){
        const b=createCreativeButton('',action);b.title=label;b.setAttribute('aria-label',label);
        const i=document.createElement('i');i.setAttribute('aria-hidden','true');i.style.setProperty('--player-icon',iconURL(icon));b.append(i);return b;
    }
    const play=button('播放','play-fill',async()=>{
        if(!video.paused){video.pause();return;}
        try{await video.play();}catch(error){if(error.name!=='AbortError'&&video.isConnected)report('无法播放，请检查视频格式或重新点击播放');}
    });
    const clock=document.createElement('span');clock.className='dae-upload-player-time';
    const spacer=document.createElement('span');spacer.className='dae-upload-player-spacer';
    const sound=document.createElement('div');sound.className='dae-upload-player-sound';
    const mute=createCreativeButton('',()=>{if(video.muted||video.volume===0){video.muted=false;if(video.volume===0)video.volume=1;}else video.muted=true;});
    mute.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9h4l5-4v14l-5-4H3z"/><path class="player-sound-on" d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/><path class="player-sound-off" d="m16 9 6 6m0-6-6 6"/></svg>';
    function range(label,max,step){const input=document.createElement('input');input.type='range';input.min='0';input.max=String(max);input.step=String(step);input.setAttribute('aria-label',label);return input;}
    const volume=range('音量',1,.01);volume.className='dae-upload-player-volume';
    volume.oninput=()=>{video.volume=volume.valueAsNumber;video.muted=video.volume===0;};
    const full=button('全屏','fullscreen-line',async()=>{
        try{if(document.fullscreenElement===stage)await document.exitFullscreen();else await stage.requestFullscreen();}
        catch{if(video.isConnected)report('当前浏览器无法进入全屏');}
    });
    const seek=range('播放进度',0,.01);seek.className='dae-upload-player-seek';
    seek.oninput=()=>{video.currentTime=seek.valueAsNumber;progress();};
    const releaseSeek=bindCreativeField(seek),releaseVolume=bindCreativeField(volume);
    function progress(){
        const duration=Number.isFinite(video.duration)?video.duration:video.seekable.length?video.seekable.end(video.seekable.length-1):0;
        seek.disabled=duration<=0;seek.max=String(duration);seek.value=String(video.currentTime);
        seek.style.setProperty('--player-progress',`${duration>0?video.currentTime/duration*100:0}%`);
        clock.textContent=`${time(video.currentTime)} / ${time(duration)}`;
        seek.setAttribute('aria-valuetext',`${time(video.currentTime)} / ${time(duration)}`);
    }
    function playback(){const label=video.paused?'播放':'暂停';play.title=label;play.setAttribute('aria-label',label);play.firstChild.style.setProperty('--player-icon',iconURL(video.paused?'play-fill':'pause-fill'));progress();}
    function audio(){const silent=video.muted||video.volume===0;mute.dataset.muted=String(silent);mute.title=silent?'取消静音':'静音';mute.setAttribute('aria-label',mute.title);mute.setAttribute('aria-pressed',String(silent));volume.value=String(video.muted?0:video.volume);}
    function fullscreen(){full.title=document.fullscreenElement===stage?'退出全屏':'全屏';full.setAttribute('aria-label',full.title);}
    const events={timeupdate:progress,durationchange:progress,loadedmetadata:progress,progress,play:playback,pause:playback,ended:playback,volumechange:audio};
    for(const [name,listener] of Object.entries(events))video.addEventListener(name,listener);
    document.addEventListener('fullscreenchange',fullscreen);
    for(const name of ['pointerdown','pointerup','pointermove','click','dblclick','keydown','keyup'])bar.addEventListener(name,e=>e.stopPropagation());
    bar.addEventListener('pointerdown',e=>{if(e.target===seek||e.target===volume){bar.dataset.seeking='true';e.target.setPointerCapture(e.pointerId);}});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])bar.addEventListener(name,()=>delete bar.dataset.seeking);
    sound.append(volume,mute);row.append(play,clock,spacer,sound,full);bar.append(row,seek);stage.append(bar);
    video.controls=false;playback();audio();
    return ()=>{for(const [name,listener] of Object.entries(events))video.removeEventListener(name,listener);document.removeEventListener('fullscreenchange',fullscreen);releaseSeek();releaseVolume();bar.remove();};
}
