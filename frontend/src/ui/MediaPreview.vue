<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import ActionButton from './ActionButton.vue';
const p=defineProps({asset:Object,fit:{type:String,default:'contain'},disabled:Boolean,visible:{type:Boolean,default:true}});
const emit=defineEmits(['requestExpand','loadError','requestRetry']);
const video=ref(null),state=ref('loading'),generation=ref(0);
const key=computed(()=>`${p.asset?.id}|${p.asset?.url}`);
function pause(){video.value?.pause();}
watch(key,()=>{pause();generation.value++;state.value='loading';},{flush:'sync'});
watch(()=>[p.visible,p.disabled],()=>{if(!p.visible||p.disabled)pause();});
function visibility(){if(document.hidden)pause();}
document.addEventListener('visibilitychange',visibility);
onBeforeUnmount(()=>{pause();document.removeEventListener('visibilitychange',visibility);});
function loaded(e){if(e.target.dataset.generation===String(generation.value))state.value='ready';}
function failed(e){if(e.target.dataset.generation!==String(generation.value))return;state.value='error';emit('loadError',{assetId:p.asset.id,reason:'媒体加载失败'});}
function expand(){if(!p.disabled&&state.value==='ready')emit('requestExpand',p.asset.id);}
function retry(){state.value='loading';generation.value++;emit('requestRetry',p.asset.id);}
</script>
<template>
 <figure class="dae-media" :data-state="asset?state:'empty'" @pointerdown.stop @wheel.stop>
  <div class="dae-media-stage">
   <template v-if="asset">
    <video v-if="asset.kind==='video'" :key="key+generation" ref="video" :src="asset.url" :data-generation="generation" :controls="!disabled" :inert="disabled||!visible" preload="metadata" :style="{objectFit:fit}" @loadeddata="loaded" @error="failed"/>
    <img v-else :key="key+generation" :src="asset.url" :data-generation="generation" :alt="asset.name" :style="{objectFit:fit}" :tabindex="disabled?-1:0" role="button" :aria-disabled="disabled" draggable="false" @load="loaded" @error="failed" @click="expand" @keydown.enter.prevent="expand" @keydown.space.prevent="expand">
    <span v-if="state==='loading'" class="dae-media-message" role="status">正在载入素材…</span>
    <div v-if="state==='error'" class="dae-media-message"><p>无法加载 {{asset.name}}</p><ActionButton label="重试加载" :disabled="disabled" @activate="retry"/></div>
   </template><span v-else class="dae-media-message">尚未选择素材</span>
  </div>
  <figcaption><span>{{asset?.role==='output'?'生成输出':'输入素材'}}<small>{{asset?.name||'选择素材后可预览'}}</small></span><ActionButton v-if="asset" label="展开" size="compact" variant="ghost" :disabled="disabled||state!=='ready'" @activate="expand"/></figcaption><slot name="caption"/>
 </figure>
</template>
<style scoped>
.dae-media{margin:0;min-width:0}.dae-media-stage{position:relative;aspect-ratio:16/10;background:var(--dae-bg-canvas);border-radius:var(--dae-radius-control);overflow:hidden;display:grid;place-items:center}.dae-media-stage img,.dae-media-stage video{display:block;width:100%;height:100%;position:absolute;inset:0}.dae-media-stage img{cursor:zoom-in}.dae-media-message{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;background:var(--dae-bg-canvas);color:var(--dae-text-muted)}figcaption{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:10px;font-size:12px;color:var(--dae-text-muted)}small{display:block;color:var(--dae-text);overflow-wrap:anywhere}
</style>
