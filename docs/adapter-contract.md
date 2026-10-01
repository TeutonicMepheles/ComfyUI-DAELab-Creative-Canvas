# Creative Canvas API v1

核心不读取业务节点的 `__dataTablePanel`、`__libtvPanel` 或业务结果属性。业务所有者提供适配器，允许画布临时借用其真实 DOM 面板，避免复制编辑器状态。

浏览器公共入口：`globalThis[Symbol.for('DAELAB.CreativeCanvas.API.v1')]`。画布发布入口时发出 `daelab:creative-canvas-ready` 事件。消费者先订阅事件再尝试注册；这样无论插件加载顺序如何都可接入。未安装画布时业务库继续独立工作。

```js
let registered = false;
function register() {
  const api = globalThis[Symbol.for('DAELAB.CreativeCanvas.API.v1')];
  if (registered || api?.version !== 1) return;
  api.registerAdapter('my-plugin.assets', {
    matches: node => node.type === 'MyPlugin.Asset',
    width: 680,
    expanded: true,
    panel: node => ({root: node.myOwnedPanel}),
    menu: [{label: '我的素材', type: 'MyPlugin.Asset', icon: 'image-line'}],
  });
  registered = true;
}
globalThis.addEventListener('daelab:creative-canvas-ready', register);
register();
```

`registerAdapter(id, adapter)` 返回注销函数。同一 ID 重复注册会报错。`matches` 必须可处理只有 `{type}` 的描述对象；多个适配器不应匹配相同类型。消费者在自身扩展内读取自己的内部属性，不能把其他扩展的内部实现当公共 API。

| 字段 | 契约 |
| --- | --- |
| `matches(node)` | 必填，声明支持的稳定节点 ID |
| `width` / `expanded` | 数值／布尔值，或读取节点的函数；仅初始化默认布局 |
| `floatingHeader` | 可选布尔值；标题悬浮在卡片上方，隐藏重复类型标签，工作区入口使用卡片内右上角的展开图标及圆角提示；默认保持原布局 |
| `collapsible` | 可选布尔值；`false` 时不创建收起按钮且保持面板展开；不改变节点的停用状态 |
| `resizable` / `fullHeight` | 可选布尔值或节点函数；启用外框横向调整／取消宿主内容高度上限。宽度保存在既有 cards 布局中，支持取消、撤销及重载；业务负责自身滚动容器。 |
| `compactWidth` | 可选屏幕像素阈值；卡片窄于此值时显示摘要，打开 workspace 时恢复完整面板，不改变保存的展开状态 |
| `workspace(node)` | 是否使用独立编辑器弹窗 |
| `panel(node)` | 返回 `{root, buttons?, fields?, close?, workspaceControls?}`；root 尚未创建时可以为空，宿主稍后重试；一旦返回 root，宿主即可借用，无需先连接 document（撤销重建时原生 DOM widget 可能尚未挂载）。可选 DOM 容器 `workspaceControls` 用于放置宿主的展开按钮，面板负责其布局，宿主释放面板时收回按钮 |
| `refresh(node)` | 更新自己面板，不得每次重建 DOM 或发送请求 |
| `summary(node)` / `preview(node)` | 摘要或 `{url, kind}`；提供业务所有者认可的预览 |
| `action(node)` | 可选 `{label, run(node, app)}`，Promise 交给共享按钮管理忙碌态 |
| `inputLabels` | 将原生输入名称映射到用户可读用途；类型兼容仍使用原生图输入／输出声明 |
| `inputSelection` | 可选值 `first-free`；拖到合并输入时自动连接第一个未占用的兼容输入，不显示用途菜单、不替换已连接输入；未指定时保留原选择逻辑 |
| `outputLabel` | 可选文字，显示在合并输出的提示与可访问名称中；不改变真实输出类型和槽位 |
| `canConnectOutput(node)` | 可选同步回调；用户尝试从此节点建立连接时调用，返回 `false` 阻止拉线、用途选择及实际连接，业务所有者负责说明原因。未提供时保持原行为；原生节点连接限制由节点自身的 `onConnectOutput` 实现 |
| `onCreate(node)` | 用户从画布新增节点时初始化业务状态 |
| `upload(node, file)` | 可选，接收本地 File 并返回 Promise；画布拖入文件时调用上传节点适配器，上传节点负责请求、错误提示和取消生命周期 |
| `assets(node)` | 可选，返回 `{version:1, assets:[...], ready?}` 本地素材快照；`ready:false` 表示当前结果尚未生成或已过期，消费者应等待结果，不按空集合删除已有片段／连线。素材提供者负责顺序与字段，不由消费者读取私有面板 |
| `prepareCopy(node, serialized)` | 在配置新节点前修改副本，例如生成新 request_id；不得改源节点 |
| `menu` | 已安装节点的双击菜单项；未知类型不显示。icon 使用本仓库随附 Remix SVG 名称 |

宿主借用面板时复用 `creative_button.mjs`、`creative_field.mjs` 的绑定，返回原模式时清理并归还；节点删除或工作流重载时释放。面板提供方负责自身请求取消和原生 widget 生命周期。多个实例必须拥有独立状态。

内部节点 ID、`graph.extra.daelabCreativeCanvasV1`、素材 JSON、原生槽位索引以及 `DAELAB.CreativeNode.v1` 剪贴板格式维持原值。端口是视觉投影，不能把所有真实输入改成一个 wildcard 输入。接口发生破坏性变化时增加 API 主版本，不静默改变 v1。


## 有序素材快照接收

可选 `materialTargets(node)` 返回 `{element, key, dropElements?, previewElements?, clipElement?, project?, label?}[]`。element 为可见目标，key 为业务拥有的稳定目标键；dropElements 为同一目标的附加落点，previewElements 为拖入时一起高亮的元素数组，也可为 `(assetCount) => Element[]`，按本次素材数量返回实际受影响的元素，不扩大命中区域；clipElement 限制滚动可见区域。默认投影外置 Slot；`project:false` 仅保留元素落点，用于行头或单元格，不创建额外接口。label 同时用于接口说明和拖入提示。直接命中的目标优先于附近 Slot 的磁吸。宿主不解析 key，`acceptMaterials(node,key,collection)` 由业务按落点同步、原子地消费 `{version:1,assets:[{filename,subfolder,kind,nodeId,...}]}`，失败抛出可读错误。

画布只负责素材组有序快照或单个上传素材快照、命中检测、落点提示和历史边界；业务适配器负责数据验证、行数和单元格规则。该入口是显式一次填充，不创建虚假的原生输入或持久连接，不随源组变化覆盖手工编辑。字段删除、隐藏、重排后重新读取目标；使用 `.dae-material-slot` 复用素材卡片 Slot 外观。拖动素材组或上传素材本体时，宿主高亮目标接口及声明的落点并提示松开填入；结束或取消时清除提示，完成填充时恢复源节点原位置及组关系。

## Slot 基准

宿主将 `materialTargets`／`materialSources` 投影为表头上方、列宽中心的外置 Slot，共享邻近磁吸和微动。可选 `anchorElement` 声明列定位区域；默认使用 element 所属的语义 `th`，否则使用 element。源控件在画布借用期间隐藏，退出时恢复；业务仍持有原 DOM 和稳定 key。列区域落点与 clipElement 契约保持有效。

所有适配器遵循[接口与连线基准](architecture/FRONTEND_INTERACTION.md#接口与连线)。宿主统一拥有端口外观、磁吸、端点跟随及断线撤销；消费者仅声明类型、用途和能力限制。`materialTargets` 的列接口是一次素材快照接收目标，不创建持久图连接。表格缩放与完整高度不得覆盖宿主 Slot 的交互。

## 生成结果输出

可选 `materialSources(node)` 返回 `{element,key,label?}[]`，使用稳定列 ID 和 `.dae-material-slot`。宿主拥有点击、拖线及空白处创建菜单。`outputMaterials(node,key)` 返回 `{version:1,ready,assets,label?,skipped?}`；assets 使用本地 `/view` URL、kind、id、name 和可选 provenance，按业务顺序提供。已有图像或视频素材即可输出，包括过期结果或重新生成期间保留的结果；业务只跳过没有可用素材的行。

输出为一次素材引用快照：宿主检查本地文件的目录范围、存在性和类型，直接引用 input/output 原文件，创建现有素材节点及有序素材组，统一撤销；不复制文件、不完整读取计算摘要、不提前解码视频。素材 JSON 保留 `type`，旧数据缺省仍为 input；预览、素材组执行和剪辑按原目录读取。异步期间来源发生变化时放弃创建。不增加原生端口、持久图连线或业务生成依赖。适配器显式声明 `materialOutput:true` 后，`assets(node)` 提供的当前剪辑结果也可输出为单个视频素材。

## 面板呈现与视口上下文

适配器可选 `presentation: 'content'`（或节点函数）让宿主负责无外框卡片、通用外置标题及正文内边距。标题与 `floatingHeader` 和上传素材共用 [通用视觉基线](architecture/FRONTEND_INTERACTION.md#通用视觉基线)，不由业务包单独设置字号、字重、颜色或间距。`selectionSurface(node)` 返回自己 root 内的 DOM 区域，宿主为其绘制选中轮廓；重绘替换该区域后宿主重新读取。业务样式不得修改宿主卡片、标题或选择状态。

`api.getPanelContext(element)` 返回当前借用面板的上下文，独立安装或归还后返回 null。上下文提供 `presentation`、`fullHeight`、`selected`、`contains(element)`、`getBounds()`、`getViewport()` 与 `panBy(dx,dy)`；位移为屏幕像素，正数将内容向左／上平移。隐藏、停用或释放后平移返回 false。无需查找宿主 DOM 或派发模拟滚轮事件。宿主在借用 root 上管理公开 `data-canvas-panel=true` 和 `data-canvas-full-height` 标记，归还时清理。业务自身的滚动、末行和末列布局留在业务包，不由宿主识别其 CSS 类名。

宿主在视角、卡片位置／尺寸、选择或内部滚动变化后，按动画帧合并派发冒泡事件 `dae-canvas-layout`。业务可在 `globalThis` 监听该通知，通过自己的面板上下文重新定位可见悬浮栏；无需读取宿主 DOM，也不应在每帧重建业务面板。独立安装时没有此事件，原有编辑逻辑照常工作；销毁时移除监听。
