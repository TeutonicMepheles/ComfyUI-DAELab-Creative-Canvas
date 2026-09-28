<script setup>
import { icons } from '../design/icons.js';
defineProps({label:{type:String,required:true},icon:String,variant:{type:String,default:'secondary'},size:{type:String,default:'normal'},disabled:Boolean,busy:Boolean,iconOnly:Boolean});
const emit=defineEmits(['activate']);
</script>
<template>
  <button type="button" class="dae-button" :data-variant="variant" :data-size="size" :disabled="disabled||busy" :aria-busy="busy" :aria-label="iconOnly?label:undefined" :title="iconOnly?label:undefined" @pointerdown.stop @pointerup.stop @click.stop="!disabled&&!busy&&emit('activate',$event)">
    <span v-if="icons[icon]" class="dae-icon" aria-hidden="true" :style="{maskImage:`url(${JSON.stringify(icons[icon])})`}"/>
    <span v-if="!iconOnly">{{label}}</span><span v-if="busy" class="dae-busy" aria-label="处理中">·</span>
  </button>
</template>
<style scoped>
.dae-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:var(--dae-control-height);min-width:var(--dae-control-height);padding:6px 12px;border:1px solid var(--dae-border-control);border-radius:var(--dae-radius-button);background:var(--dae-surface-raised);color:var(--dae-text);cursor:pointer;transition:background var(--dae-duration-fast)}
.dae-button[data-size=compact]{min-height:var(--dae-control-height-compact);min-width:var(--dae-control-height-compact);padding:4px 8px;font-size:12px}
.dae-button:hover:not(:disabled){background:var(--dae-surface-hover)}
.dae-button[data-variant=primary]{background:var(--dae-accent);color:var(--dae-text-on-accent);border-color:var(--dae-accent)}
.dae-button[data-variant=primary]:hover:not(:disabled){filter:brightness(1.08);background:var(--dae-accent)}
.dae-button[data-variant=danger]{color:var(--dae-danger)}
.dae-button[data-variant=ghost]{background:transparent;border-color:transparent}
.dae-button:disabled{opacity:.5;cursor:default}.dae-button[aria-busy=true]{opacity:.75}
.dae-icon{width:var(--dae-icon-size);height:var(--dae-icon-size);background:currentColor;mask-size:contain;mask-position:center;mask-repeat:no-repeat}
.dae-busy{position:absolute;right:3px;top:0}
</style>
