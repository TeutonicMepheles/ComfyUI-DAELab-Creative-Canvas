export const registry = [
 ['C01','ActionButton','动作按钮','激活、禁用与忙碌保护'],
 ['C02','ParameterField','参数输入','独立草稿、校验与冲突'],
 ['C03','OverlaySurface','浮层容器','锚定参数、模态与焦点恢复'],
 ['C04','MediaPreview','媒体预览','来源、加载状态与播放控制'],
 ['C05','TaskStatus','任务状态','模拟进度与恢复动作'],
 ['C06','CanvasCard','画布卡片','选中、折叠与移动'],
].map(([id,name,label,description])=>({id,name,label,description,source:`src/ui/${name}.vue`,status:'showcase-integrated',hostStatus:'not-integrated',consumer:'showcase/App.vue'}));
