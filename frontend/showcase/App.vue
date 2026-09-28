<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { ActionButton, ParameterField, OverlaySurface, MediaPreview, TaskStatus, CanvasCard } from '../src/ui/index.js';
import { registry } from './registry.js';
// Pure existing viewport math; no app/graph/ComfyUI import, no old implementation changes.
import { zoomAt } from '../../web/creative_canvas_model.mjs';
const build=__BUILD_ID__,tab=ref('canvas'),section=ref('C01'),compact=ref(false),narrow=ref(false),selected=ref('A');
const logs=ref([]),events=reactive({A:0,B:0}),state=ref('idle'),stateB=ref('idle'),disabled=ref(false),busy=ref(false),mounted=ref(true);
function log(message){logs.value=[`${new Date().toLocaleTimeString()}  ${message}`,...logs.value].slice(0,12);}
const cards=reactive([
 {id:'A',title:'山间 · 清晨',prompt:'镜头缓慢掠过山脊，薄雾中的光逐渐显现。',duration:5,asset:{id:'mountain',kind:'image',url:'/samples/mountain.svg',name:'山间清晨.svg',role:'input'},status:'idle',collapsed:false,active:true,x:30,y:30},
 {id:'B',title:'海岸 · 黄昏',prompt:'海面映出柔和的暖色，镜头沿着海岸线推进。',duration:10,asset:{id:'coast',kind:'image',url:'/samples/coast.svg',name:'海岸黄昏.svg',role:'input'},status:'idle',collapsed:false,active:true,x:440,y:80},
]);
const viewport=ref({x:0,y:0,zoom:1}),origins={};let pan=null;
function dragStart(c){origins[c.id]={x:c.x,y:c.y};}
function dragMove(c,d){const o=origins[c.id];if(o){c.x=o.x+d.x/viewport.value.zoom;c.y=o.y+d.y/viewport.value.zoom;}}
function dragEnd(c,{cancelled}){if(cancelled)Object.assign(c,origins[c.id]);delete origins[c.id];log(`${c.id} ${cancelled?'取消移动':'移动完成'}`);}
function panStart(e){if(e.target.closest('article,button,input,dialog'))return;pan={x:e.clientX,y:e.clientY,v:{...viewport.value}};e.currentTarget.setPointerCapture(e.pointerId);}
function panMove(e){if(pan)viewport.value={...pan.v,x:pan.v.x+e.clientX-pan.x,y:pan.v.y+e.clientY-pan.y};}
function panEnd(){pan=null;}
function zoom(e){if(e.target.closest('article,dialog'))return;e.preventDefault();const r=e.currentTarget.getBoundingClientRect();viewport.value=zoomAt(viewport.value,{x:e.clientX-r.left,y:e.clientY-r.top},Math.exp(-e.deltaY*.001));}
const settings=reactive({open:false,anchor:null,card:null});
function openSettings(e,c){settings.anchor=e.currentTarget;settings.card=c;settings.open=true;}
const modal=ref(false),preview=ref(null),guarded=ref(false),guardConfirm=ref(false),nested=ref(false);
function closeSettings({reason}){if(reason==='anchorLost'||!guarded.value)settings.open=false;else guardConfirm.value=true;}
function expand(c){preview.value=c.asset;modal.value=true;}
const timers=new Set();
function later(fn,ms){const t=setTimeout(()=>{timers.delete(t);fn();},ms);timers.add(t);}
function generate(c){if(c.status==='running')return;c.status='running';log(`${c.id} 本地模拟开始，不提交远端任务`);later(()=>{c.status='succeeded';log(`${c.id} 模拟完成`);},1500);}
function modeAsset(mode,c){
 if(mode==='empty')c.asset=null;
 else if(mode==='video')c.asset={id:'clip',kind:'video',url:'/samples/motion.webm',name:'本地动态样例.webm',role:'output'};
 else if(mode==='error')c.asset={id:'broken',kind:'image',url:'/samples/missing.png',name:'缺失样例.png',role:'input'};
 else c.asset={id:mode,kind:'image',url:'/samples/'+(mode==='coast'?'coast':'mountain')+'.svg',name:mode+'.svg',role:'input'};
}
const choice=ref('mountain'),variant=ref('secondary'),kind=ref('text'),values=reactive({A:'实例 A',B:'实例 B'}),explicit=ref(false),fieldRefs={};
const taskStates=['idle','validating','queued','running','succeeded','failed','stopping','stopped','unknown'];
const activeRegistry=computed(()=>registry.find(r=>r.id===section.value));
function changeKind(v){kind.value=v;values.A=v==='number'?0:v==='toggle'?false:v==='select'?'one':'实例 A';values.B=v==='number'?10:v==='toggle'?true:v==='select'?'two':'实例 B';}
function resetView(){viewport.value={x:0,y:0,zoom:1};}
onBeforeUnmount(()=>{timers.forEach(clearTimeout);timers.clear();});
</script>
<template>
 <main class="dae-ui studio-shell" :data-density="compact?'compact':'normal'">
  <aside class="rail"><a class="brand" href="#" @click.prevent="tab='canvas'"><span class="brand-mark">D</span> DAELAB <small>CREATIVE SYSTEM</small></a>
   <p class="rail-label">创作画布 / 组件实验室</p>
   <button class="rail-link" :class="{current:tab==='canvas'}" @click="tab='canvas'">组合预览 <span>01</span></button>
   <div class="rail-divider"/><p class="rail-label">共享组件 · 06</p>
   <button v-for="item in registry" :key="item.id" class="rail-link" :class="{current:tab==='components'&&section===item.id}" @click="tab='components';section=item.id"><span>{{item.label}}</span><small>{{item.id}}</small></button>
   <div class="rail-bottom"><span class="connection-dot"/>独立运行 · 本地模拟<p>仅创作画布范围<br>未连接 ComfyUI 或生成服务</p></div>
  </aside>
  <div class="workspace">
   <header class="topbar"><div><span class="eyebrow">COMPONENT SHOWCASE / PHASE 03</span><h1>{{tab==='canvas'?'让每次创作，使用同一套控件。':activeRegistry.label}}</h1></div><span class="version">v0.1 <span>设计与实例分离</span></span></header>
   <div class="contextbar"><p>{{tab==='canvas'?'两张卡片共用组件源码，内容与状态各自独立。拖动标题，或在卡片内编辑。':activeRegistry.description}}</p><div class="controls"><ActionButton :label="compact?'舒适密度':'紧凑密度'" size="compact" @activate="compact=!compact"/><ActionButton :label="narrow?'恢复宽度':'320px 检查'" size="compact" @activate="narrow=!narrow"/></div></div>
   <section v-if="tab==='canvas'" class="canvas" data-canvas-focus tabindex="0" @pointerdown="panStart" @pointermove="panMove" @pointerup="panEnd" @pointercancel="panEnd" @wheel="zoom">
    <span class="canvas-note">CREATIVE CANVAS · SANDBOX</span>
    <div class="world" :style="{transform:`translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})`}">
     <div v-for="c in cards" :key="c.id" class="card-position" :style="{left:c.x+'px',top:c.y+'px',width:narrow?'320px':'380px'}">
      <CanvasCard :card-id="c.id" :title="c.title" :selected="selected===c.id" :collapsed="c.collapsed" :active="c.active" @select="selected=c.id" @request-collapse="c.collapsed=$event" @drag-start="dragStart(c)" @drag-move="dragMove(c,$event)" @drag-end="dragEnd(c,$event)">
       <template #media><MediaPreview :asset="c.asset" :visible="!c.collapsed&&c.active" @request-expand="expand(c)"/></template>
       <template #content><ParameterField :field-id="'prompt-'+c.id" label="画面描述" kind="multiline" :value="c.prompt" @commit="c.prompt=$event.value;log(c.id+' 提示词已更新')"/><TaskStatus :state="c.status"/></template>
       <template #actions><ActionButton label="模拟生成" variant="primary" :busy="c.status==='running'" @activate="generate(c)"/><ActionButton :label="c.duration+' 秒 · 参数'" @activate="openSettings($event,c)"/></template>
      </CanvasCard>
     </div>
    </div>
    <div class="canvas-tools"><ActionButton label="缩小" size="compact" @activate="viewport=zoomAt(viewport,{x:400,y:250},.8)"/><span>{{Math.round(viewport.zoom*100)}}%</span><ActionButton label="放大" size="compact" @activate="viewport=zoomAt(viewport,{x:400,y:250},1.25)"/><ActionButton label="复位" size="compact" @activate="resetView"/></div>
   </section>
   <section v-else class="component-space">
    <div class="component-meta"><code>{{activeRegistry.source}}</code><span>唯一源码 · 双实例</span></div>
    <div class="test-controls">
     <ParameterField field-id="disabled" label="禁用" kind="toggle" :value="disabled" @commit="disabled=$event.value"/>
     <ParameterField field-id="busy" label="忙碌" kind="toggle" :value="busy" @commit="busy=$event.value"/>
     <ParameterField v-if="section==='C01'" field-id="variant" label="按钮变体" kind="select" :value="variant" :options="['secondary','primary','danger','ghost'].map(value=>({value,label:value}))" @commit="variant=$event.value"/>
     <ParameterField v-if="section==='C02'" field-id="kind" label="字段类型" kind="select" :value="kind" :options="['text','multiline','number','select','toggle'].map(value=>({value,label:value}))" @commit="changeKind($event.value)"/>
     <ParameterField v-if="section==='C02'" field-id="explicit" label="显式提交" kind="toggle" :value="explicit" @commit="explicit=$event.value"/>
     <ParameterField v-if="section==='C04'" field-id="asset" label="素材状态" kind="select" :value="choice" :options="['mountain','coast','video','empty','error'].map(value=>({value,label:value}))" @commit="choice=$event.value;cards.forEach(c=>modeAsset(choice,c))"/>
     <ParameterField v-if="section==='C05'" field-id="state" label="任务状态" kind="select" :value="state" :options="taskStates.map(value=>({value,label:value}))" @commit="state=$event.value"/>
     <ActionButton :label="mounted?'卸载实例':'挂载实例'" @activate="mounted=!mounted"/>
    </div>
    <div v-if="mounted" class="specimens" :class="{narrow}">
     <div v-for="(c,i) in cards" :key="c.id" class="specimen" :data-instance="c.id">
      <div class="specimen-label">INSTANCE {{c.id}} <span>数据独立</span></div>
      <template v-if="section==='C01'"><ActionButton :label="'动作 '+c.id" :variant="variant" :size="compact?'compact':'normal'" icon="upload" :busy="busy" :disabled="disabled" @activate="events[c.id]++;log(c.id+' 激活')"/><p class="dae-muted">激活次数：<b>{{events[c.id]}}</b></p></template>
      <template v-if="section==='C02'"><ParameterField :key="kind" :ref="el=>fieldRefs[c.id]=el" :field-id="c.id" :label="'参数 '+c.id" :kind="kind" :value="values[c.id]" :options="[{value:'one',label:'模型一'},{value:'two',label:'模型二'}]" :min="0" :max="30" :step="1" :disabled="disabled" :busy="busy" :density="compact?'compact':'normal'" :commit-mode="explicit?'explicit':'blur'" hint="各实例拥有独立的值与编辑草稿" @commit="values[c.id]=$event.value;log(c.id+' 提交 '+$event.value)"/><p class="value-readout">保存值：{{values[c.id]}}</p><ActionButton v-if="explicit" label="提交参数" @activate="fieldRefs[c.id]?.commit()"/><ActionButton label="模拟外部更新" @activate="values[c.id]=kind==='number'?20:kind==='toggle'?true:kind==='select'?'one':'外部新值'"/></template>
      <template v-if="section==='C03'"><ActionButton :label="'打开参数 '+c.id" :disabled="disabled" @activate="openSettings($event,c)"/><ActionButton label="打开模态" :disabled="disabled" @activate="preview=null;modal=true"/></template>
      <MediaPreview v-if="section==='C04'" :asset="c.asset" :disabled="disabled" @request-expand="expand(c)" @load-error="log(c.id+' 媒体错误')"/>
      <ParameterField v-if="section==='C05'&&i===1" field-id="state-b" label="实例 B 状态" kind="select" :value="stateB" :options="taskStates.map(value=>({value,label:value}))" @commit="stateB=$event.value"/><TaskStatus v-if="section==='C05'" :state="i===0?state:stateB" :action-busy="busy||disabled" :capabilities="{canResume:['unknown','failed'].includes(i===0?state:stateB),canRetry:(i===0?state:stateB)==='failed',canStopPending:['running','queued'].includes(i===0?state:stateB)}" @resume="log(c.id+' 恢复原任务')" @retry="log(c.id+' 请求重新生成')" @stop-pending="i===0?state='stopped':stateB='stopped'"/>
      <CanvasCard v-if="section==='C06'" :card-id="c.id" :title="c.title" :collapsed="c.collapsed" :active="!disabled" :selected="selected===c.id" @select="selected=c.id" @request-collapse="c.collapsed=$event" @drag-start="log(c.id+' 开始移动')" @drag-move="log(c.id+' 位移 '+JSON.stringify($event))" @drag-end="log(c.id+' 结束移动')"><template #content><ParameterField :field-id="c.id+'-title'" label="卡片标题" :value="c.title" @commit="c.title=$event.value"/></template></CanvasCard>
     </div>
    </div>
    <p v-else class="unmounted">实例已卸载。重新挂载后，保存值由陈列控制器恢复，临时草稿已释放。</p>
   </section>
   <footer class="event-dock"><span class="eyebrow">交互记录</span><p v-if="!logs.length">操作任意控件，查看它发出的事件。</p><ol v-else><li v-for="(entry,i) in logs.slice(0,3)" :key="i">{{entry}}</li></ol><small>{{build}}</small></footer>
  </div>
  <OverlaySurface :open="settings.open" title="生成参数" :anchor="settings.anchor" :close-policy="guarded?'guarded':'immediate'" @request-close="closeSettings">
   <template #content><ParameterField v-if="settings.card" field-id="duration" label="生成时长" kind="number" :value="settings.card.duration" :min="0" :max="30" :step="1" unit="秒" @commit="settings.card.duration=$event.value"/><ParameterField field-id="guard" label="模拟有未保存草稿" kind="toggle" :value="guarded" @commit="guarded=$event.value"/><ActionButton label="打开子模态" @activate="nested=true"/>
    <div v-if="guardConfirm" class="guard-confirm" role="alert">是否放弃草稿？<ActionButton label="放弃并关闭" @activate="settings.open=false;guardConfirm=false;guarded=false"/><ActionButton label="继续编辑" @activate="guardConfirm=false"/></div>
    <OverlaySurface :open="nested" mode="modal" title="子模态" @request-close="nested=false"><template #content><p>Escape 只关闭本层，返回参数浮层。</p></template></OverlaySurface>
   </template>
  </OverlaySurface>
  <OverlaySurface :open="modal" mode="modal" title="素材预览" @request-close="modal=false"><template #content><MediaPreview v-if="preview&&modal" :asset="preview"/><p v-else>模态关闭后焦点返回打开它的按钮。</p></template></OverlaySurface>
 </main>
</template>
