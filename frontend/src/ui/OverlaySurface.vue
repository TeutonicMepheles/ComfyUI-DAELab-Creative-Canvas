<script setup>
import { ref, watch, nextTick, onBeforeUnmount, useId } from 'vue';
import ActionButton from './ActionButton.vue';
const p=defineProps({open:Boolean,title:{type:String,required:true},mode:{type:String,default:'popover'},anchor:Object,closePolicy:{type:String,default:'immediate'},busy:Boolean});
const emit=defineEmits(['requestClose','afterClose']);
const box=ref(null),id=useId();let opener,observer,cleanup=()=>{},epoch=0,opened=false;
function request(reason){emit('requestClose',{reason,guarded:p.closePolicy==='guarded'});}
function place(){if(!box.value||p.mode==='modal')return;if(!p.anchor?.isConnected){request('anchorLost');return;}const r=p.anchor.getBoundingClientRect(),b=box.value; b.style.left=Math.max(12,Math.min(r.left,innerWidth-b.offsetWidth-12))+'px';b.style.top=Math.max(12,Math.min(r.bottom+8,innerHeight-b.offsetHeight-12))+'px';}
function dismiss(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();request('escape');}}
function teardown(){cleanup();observer?.disconnect();observer=null;if(box.value?.open)box.value.close();if(opened){if(opener?.isConnected)opener.focus({preventScroll:true});else document.querySelector('[data-canvas-focus]')?.focus();}opened=false;}
watch(()=>p.open,async open=>{
 const token=++epoch;
 if(!open){teardown();emit('afterClose');return;}
 opener=document.activeElement;await nextTick();if(token!==epoch||!p.open||!box.value)return;
 if(p.mode==='modal')box.value.showModal();else box.value.show();opened=true;
 place();box.value.querySelector('button,input,select,textarea,[tabindex]')?.focus();
 const outside=e=>{if(p.mode==='popover'&&p.open&&!box.value?.contains(e.target)&&!p.anchor?.contains(e.target)&&!e.target.closest('dialog[open]'))request('outside');};
 document.addEventListener('pointerdown',outside);window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
 observer=new MutationObserver(()=>{if(p.mode==='popover'&&!p.anchor?.isConnected)request('anchorLost');});observer.observe(document.body,{childList:true,subtree:true});
 cleanup=()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);};
},{immediate:true});
onBeforeUnmount(()=>{++epoch;teardown();});
</script>
<template>
 <dialog ref="box" class="dae-overlay" :data-mode="mode" :aria-modal="mode==='modal'?'true':undefined" :aria-labelledby="id" :aria-busy="busy" @cancel.prevent.stop="request('escape')" @keydown="dismiss" @pointerdown.stop @wheel.stop @click="e=>{if(e.target===box&&mode==='modal'){const r=box.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)request('outside')}}">
  <header><h2 :id="id" tabindex="-1" data-overlay-title>{{title}}</h2><ActionButton label="关闭" variant="ghost" size="compact" @activate="request('button')"/></header>
  <div class="dae-overlay-content"><slot name="content"/></div><footer v-if="$slots.actions"><slot name="actions"/></footer>
 </dialog>
</template>
<style scoped>
.dae-overlay{color:var(--dae-text);background:var(--dae-surface);border:1px solid var(--dae-border-control);border-radius:var(--dae-radius-overlay);width:min(480px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:20px;box-shadow:0 20px 70px #0008;overflow:auto}
.dae-overlay[data-mode=popover]{position:fixed;margin:0;z-index:var(--dae-layer-floating)}
.dae-overlay::backdrop{background:#0009}header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}h2{font-size:16px;margin:0}footer{display:flex;gap:8px;margin-top:18px}.dae-overlay-content{display:grid;gap:14px}
</style>
