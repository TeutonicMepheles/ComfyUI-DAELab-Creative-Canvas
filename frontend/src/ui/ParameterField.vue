<script setup>
import { ref, watch, computed, useId } from 'vue';
import ActionButton from './ActionButton.vue';
const p=defineProps({fieldId:{type:String,required:true},label:{type:String,required:true},kind:{type:String,default:'text'},value:[String,Number,Boolean],options:{type:Array,default:()=>[]},min:Number,max:Number,step:Number,disabled:Boolean,readonly:Boolean,busy:Boolean,error:String,hint:String,unit:String,density:String,commitMode:{type:String,default:'blur'}});
const emit=defineEmits(['commit','cancelDraft']);
const id=useId(),draft=ref(p.value??''),dirty=ref(false),conflict=ref(false),localError=ref(''),composing=ref(false);
const locked=computed(()=>p.disabled||p.readonly||p.busy);
const missing=computed(()=>p.kind==='select'&&!p.options.some(o=>o.value===draft.value));
watch(()=>p.value,v=>{if(dirty.value&&v!==draft.value){conflict.value=true;return;}draft.value=v??'';dirty.value=false;});
function edit(e){if(locked.value)return;draft.value=p.kind==='toggle'?e.target.checked:e.target.value;dirty.value=true;localError.value='';}
function reset(){draft.value=p.value??'';dirty.value=false;conflict.value=false;localError.value='';emit('cancelDraft');}
function commit(force=false){
  if(locked.value||composing.value||!dirty.value||(conflict.value&&!force))return;
  let v=draft.value;
  if(p.kind==='number'){
    if(String(v).trim()===''||!Number.isFinite(Number(v))){localError.value='请输入有效数字';return;}
    v=Number(v);
    if(p.min!==undefined&&v<p.min||p.max!==undefined&&v>p.max){localError.value=`请输入 ${p.min??'−∞'} 至 ${p.max??'∞'} 之间的数值`;return;}
    if(p.step&&Math.abs((v-(p.min??0))/p.step-Math.round((v-(p.min??0))/p.step))>1e-7){localError.value=`请使用 ${p.step} 的步长`;return;}
  }
  if(missing.value){localError.value='当前选项不再可用，请重新选择';return;}
  dirty.value=false;conflict.value=false;localError.value='';draft.value=v;emit('commit',{fieldId:p.fieldId,value:v});
}
function blur(){if(p.commitMode==='blur')commit();}
function key(e){if(e.key==='Escape'){if(dirty.value||conflict.value){e.preventDefault();e.stopPropagation();reset();}return;}e.stopPropagation();if(e.isComposing||composing.value)return;if(e.key==='Enter'&&p.kind!=='multiline'){e.preventDefault();if(p.commitMode==='blur')commit();}}
defineExpose({commit,reset});
</script>
<template>
 <div class="dae-field" :data-density="density" @pointerdown.stop @keydown="key" @wheel.stop>
  <label :for="id">{{label}} <span v-if="unit" class="dae-muted">{{unit}}</span></label>
  <textarea v-if="kind==='multiline'" :id="id" :value="draft" :disabled="disabled||busy" :readonly="readonly" :aria-describedby="id+'-help'" @input="edit" @blur="blur" @compositionstart="composing=true" @compositionend="composing=false"/>
  <select v-else-if="kind==='select'" :id="id" :value="draft" :disabled="locked||!options.length" :aria-describedby="id+'-help'" @change="edit($event);blur()" @blur="blur">
   <option v-if="missing" :value="draft" disabled>{{draft||'暂无选项'}} · 不再可用</option><option v-for="o in options" :key="o.value" :value="o.value">{{o.label}}</option>
  </select>
  <input v-else-if="kind==='toggle'" :id="id" type="checkbox" :checked="!!draft" :disabled="locked" @change="edit($event);blur()">
  <input v-else :id="id" type="text" :inputmode="kind==='number'?'decimal':undefined" :value="draft" :disabled="disabled||busy" :readonly="readonly" :aria-invalid="!!(localError||error)" :aria-describedby="id+'-help'" @input="edit" @blur="blur" @compositionstart="composing=true" @compositionend="composing=false">
  <small :id="id+'-help'" :class="localError||error?'dae-error':'dae-muted'">{{localError||error||(missing?'当前选项不再可用':hint)}}</small>
  <div v-if="conflict" class="dae-conflict" role="alert">外部值已变化，草稿尚未提交。<ActionButton label="使用新值" size="compact" @activate="reset"/><ActionButton label="提交草稿" size="compact" @activate="commit(true)"/></div>
 </div>
</template>
<style scoped>
.dae-field{display:grid;gap:6px;min-width:0}.dae-field label{font-size:12px;color:var(--dae-text-muted)}
input,textarea,select{width:100%;min-width:0;min-height:var(--dae-control-height);border:1px solid var(--dae-border-control);border-radius:var(--dae-radius-control);padding:8px 10px;background:var(--dae-surface-raised);color:var(--dae-text)}
textarea{min-height:100px;resize:vertical}input[type=checkbox]{width:20px;height:20px;min-height:0;accent-color:var(--dae-accent)}
:disabled{opacity:.5}small{min-height:0;font-size:12px}small:empty{display:none}.dae-conflict{display:flex;gap:6px;flex-wrap:wrap;color:var(--dae-warning);font-size:12px}
[data-density=compact] input,[data-density=compact] select{min-height:32px;padding:4px 8px}
</style>
