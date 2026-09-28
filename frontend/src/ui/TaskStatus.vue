<script setup>
import { computed } from 'vue';
import ActionButton from './ActionButton.vue';
const p=defineProps({state:{type:String,default:'idle'},message:String,progress:Number,actionBusy:Boolean,capabilities:{type:Object,default:()=>({})}});
const emit=defineEmits(['resume','retry','stopPending']);
const labels={idle:'等待创作',validating:'正在检查参数',queued:'已排队',running:'正在生成',succeeded:'生成完成',failed:'生成失败',stopping:'正在停止未提交项',stopped:'未提交项已停止',unknown:'状态待核对'};
const pct=computed(()=>Number.isFinite(p.progress)?Math.max(0,Math.min(100,p.progress)):null);
</script>
<template>
 <section class="dae-task" :data-state="state">
  <div class="dae-task-title" role="status" aria-live="polite"><span class="dae-dot"/>{{labels[state]||labels.unknown}}</div>
  <p v-if="message">{{message}}</p><p v-if="state==='stopped'">已提交的远端任务可能仍在运行。</p>
  <progress v-if="pct!==null" :value="pct" max="100" aria-label="任务进度"/>
  <div class="dae-task-actions">
   <ActionButton v-if="capabilities.canResume" label="核对 / 恢复" size="compact" :busy="actionBusy" @activate="emit('resume')"/>
   <ActionButton v-if="capabilities.canRetry&&state!=='unknown'" label="重新生成" size="compact" :busy="actionBusy" @activate="emit('retry')"/>
   <ActionButton v-if="capabilities.canStopPending" label="停止未提交项" size="compact" :busy="actionBusy" @activate="emit('stopPending')"/>
  </div>
 </section>
</template>
<style scoped>
.dae-task{padding:14px;border:1px solid var(--dae-border);border-radius:var(--dae-radius-control);background:var(--dae-bg-canvas)}.dae-task-title{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--dae-text-muted)}.dae-dot{width:6px;height:6px;border-radius:50%;background:currentColor}[data-state=running] .dae-task-title,[data-state=queued] .dae-task-title{color:var(--dae-info)}[data-state=succeeded] .dae-task-title{color:var(--dae-success)}[data-state=failed] .dae-task-title{color:var(--dae-danger)}[data-state=unknown] .dae-task-title,[data-state=stopped] .dae-task-title{color:var(--dae-warning)}p{font-size:12px;color:var(--dae-text-muted);margin:8px 0}.dae-task-actions{display:flex;gap:8px;flex-wrap:wrap}.dae-task-actions:not(:empty){margin-top:10px}progress{width:100%;height:4px;accent-color:var(--dae-accent)}
</style>
