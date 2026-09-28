<script setup>
import { ref, onBeforeUnmount } from 'vue';
import ActionButton from './ActionButton.vue';
const p=defineProps({cardId:{type:String,required:true},title:{type:String,required:true},selected:Boolean,collapsed:Boolean,active:{type:Boolean,default:true}});
const emit=defineEmits(['select','requestCollapse','dragStart','dragMove','dragEnd']);
const heading=ref(null),moving=ref(false);let pointer=null,total={x:0,y:0};
function down(e){if(e.button!==0||e.target.closest('button,input,select,textarea')||!p.active)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,started:false};e.currentTarget.setPointerCapture(e.pointerId);}
function move(e){if(!pointer)return;const delta={x:e.clientX-pointer.x,y:e.clientY-pointer.y};if(!pointer.started&&Math.hypot(delta.x,delta.y)<5)return;if(!pointer.started){pointer.started=true;emit('dragStart');}emit('dragMove',delta);}
function finish(cancelled=false){if(pointer){if(pointer.started)emit('dragEnd',{cancelled});if(heading.value?.hasPointerCapture(pointer.id))heading.value.releasePointerCapture(pointer.id);pointer=null;}if(moving.value){emit('dragEnd',{cancelled});moving.value=false;}}
function keyboardStart(){if(!p.active)return;moving.value=true;total={x:0,y:0};emit('dragStart');heading.value.focus();}
function key(e){if(!moving.value)return;const d={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];if(d){e.preventDefault();e.stopPropagation();total={x:total.x+d[0],y:total.y+d[1]};emit('dragMove',total);}if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();e.stopPropagation();finish(e.key==='Escape');}}
onBeforeUnmount(()=>finish(true));
</script>
<template>
 <article class="dae-card" :data-card-id="cardId" :data-selected="selected" :data-active="active" @pointerdown.stop="emit('select',cardId)">
  <header ref="heading" tabindex="0" :aria-label="title+'，卡片标题'" @pointerdown="down" @pointermove="move" @pointerup="finish(false)" @pointercancel="finish(true)" @keydown="key">
   <div><small>{{cardId}}</small><h2>{{title}}</h2></div><div class="dae-card-actions"><ActionButton label="移动" size="compact" variant="ghost" :disabled="!active" @activate="keyboardStart"/><ActionButton :label="collapsed?'展开':'收起'" size="compact" variant="ghost" @activate="emit('requestCollapse',!collapsed)"/></div>
  </header>
  <p v-if="moving" class="dae-move-hint">方向键移动 · Enter 确认 · Esc 撤销</p>
  <div v-show="!collapsed" class="dae-card-body" :inert="!active" @wheel.stop><slot name="media"/><slot name="content"><p class="dae-muted">添加内容开始创作</p></slot><div v-if="$slots.actions" class="dae-card-footer"><slot name="actions"/></div><slot name="ports"/></div>
  <p v-if="!active" class="dae-move-hint">当前节点未激活</p>
 </article>
</template>
<style scoped>
.dae-card{background:var(--dae-surface);border:1px solid var(--dae-border);border-radius:var(--dae-radius-card);min-width:0;box-shadow:0 12px 32px #0002}.dae-card[data-selected=true]{border-color:var(--dae-accent)}.dae-card[data-active=false]{opacity:.6}header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px;cursor:grab;touch-action:none}h2{font-size:var(--dae-font-title);font-weight:500;margin:3px 0 0}small{font-size:10px;letter-spacing:1.5px;color:var(--dae-text-muted)}.dae-card-actions{display:flex;gap:2px}.dae-card-body{display:grid;gap:16px;padding:0 16px 16px;max-height:800px;overflow:auto}.dae-card-footer{display:flex;gap:8px;flex-wrap:wrap}.dae-move-hint{padding:0 16px 12px;margin:0;color:var(--dae-text-muted);font-size:12px}
</style>
