# Creative Canvas API v1

核心不读取业务节点的 `__dataTablePanel`、`__libtvPanel` 或业务结果属性。业务所有者提供适配器，允许画布临时借用其真实 DOM 面板，避免复制编辑器状态。

浏览器公共入口：`globalThis[Symbol.for('DAELAB.CreativeCanvas.API.v1')]`。画布发布入口时发出 `daelab:creative-canvas-ready` 事件。消费者先订阅事件再尝试注册；这样无论插件加载顺序如何都可接入。未安装画布时业务库继续独立工作。

素材读取能力由 `creative_input_exchange.mjs` 在基础 API 和面板上下文发布后补全。它复用原有 `adapterFor` 注册表，兼容浏览器仍缓存旧版基础模块的情况；不要单独为注册表模块追加版本参数，以免产生两个互不相通的注册表。消费者缺少 `inputSnapshot` 时应提示接口未加载，而不是将有效图片误报为不支持的输入。

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
| `width` / `expanded` | `width` 为数值或读取节点的函数，初始化默认宽度；`expanded` 为旧版兼容字段，宿主展示时统一恢复为 `true` |
| `floatingHeader` | 可选布尔值或节点函数；标题悬浮在卡片上方，隐藏重复类型标签，工作区入口使用卡片内右上角的展开图标及圆角提示；默认保持原布局 |
| `collapsible` | 旧版兼容字段，宿主不再读取；所有节点均不提供通用收起／设置按钮，活动面板保持展开 |
| `resizable` / `fullHeight` | 可选布尔值或节点函数；启用外框横向调整／取消宿主内容高度上限。宽度保存在既有 cards 布局中，支持取消、撤销及重载；业务负责自身滚动容器。 |
| `minWidth` | 可选数字或节点函数，声明可调整卡片的最小宽度；缺省为 640px。由业务声明内容所需下限，宿主统一处理拖动和键盘调整。 |
| `compactWidth` | 可选屏幕像素阈值或节点函数；卡片窄于此值时显示摘要，打开 workspace 时恢复完整面板，不改变保存的展开状态 |
| `workspace(node)` | 是否使用独立编辑器弹窗 |
| `panel(node)` | 返回 `{root, buttons?, fields?, close?, workspaceControls?}`；root 尚未创建时可以为空，宿主稍后重试；一旦返回 root，宿主即可借用，无需先连接 document（撤销重建时原生 DOM widget 可能尚未挂载）。可选 DOM 容器 `workspaceControls` 用于放置宿主的展开按钮，面板负责其布局，宿主释放面板时收回按钮 |
| `refresh(node)` | 更新自己面板，不得每次重建 DOM 或发送请求 |
| `summary(node)` / `preview(node)` | 摘要或 `{url, kind}`；提供业务所有者认可的预览 |
| `tasks(node)` | 可选同步只读接口，返回任务快照数组；不得请求、执行任务、修改工作流或构造 DOM。详见 [任务接口](task-contract.md)。 |
| `action(node)` | 可选 `{label, run(node, app)}`，Promise 交给共享按钮管理忙碌态 |
| `inputLabels` | 将原生输入名称映射到用户可读用途；类型兼容仍使用原生图输入／输出声明 |
| `inputSelection` | 可选值 `first-free`；拖到合并输入时自动连接第一个未占用的兼容输入，不显示用途菜单、不替换已连接输入；未指定时保留原选择逻辑 |
| `outputLabel` | 可选文字，显示在合并输出的提示与可访问名称中；不改变真实输出类型和槽位 |
| `defaultOutputNode` | 可选 `{type,title}`；从输出 Slot 拖到空白处时创建指定节点并建立真实类型连线。由提供者声明，不在画布内硬编码业务类型；缺少对应节点时保留原菜单。 |
| `canConnectOutput(node)` | 可选同步回调；用户尝试从此节点建立连接时调用，返回 `false` 阻止拉线、用途选择及实际连接，业务所有者负责说明原因。未提供时保持原行为；原生节点连接限制由节点自身的 `onConnectOutput` 实现 |
| `onCreate(node)` | 用户从画布新增节点时初始化业务状态 |
| `upload(node, file)` | 可选，接收本地 File 并返回 Promise；画布拖入文件时调用上传节点适配器，上传节点负责请求、错误提示和取消生命周期 |
| `assets(node)` | 可选，返回 `{version:1, assets:[...], ready?}` 本地素材快照；`ready:false` 表示当前结果尚未生成或已过期，消费者应等待结果，不按空集合删除已有片段／连线。素材提供者负责顺序与字段，不由消费者读取私有面板 |
| `prepareCopy(node, serialized)` | 在配置新节点前修改副本，例如生成新 request_id；不得改源节点 |
| `remapCopy(node, mapping)` | 可选同步回调；所有副本配置完成、组成员重映射后、内部连线恢复前调用。mapping 为原节点 ID 到新节点的 Map，用于更新副本内部引用和面板缓存；不得修改源节点或 mapping |
| `menu` | 已安装节点的双击菜单项；未知类型不显示。icon 使用本仓库随附 Remix SVG 名称 |

宿主借用面板时复用 `creative_button.mjs`、`creative_field.mjs` 的绑定，返回原模式时清理并归还；节点删除或工作流重载时释放。面板提供方负责自身请求取消和原生 widget 生命周期。多个实例必须拥有独立状态。

内部节点 ID、`graph.extra.daelabCreativeCanvasV1`、素材 JSON、原生槽位索引以及 `DAELAB.CreativeNode.v1` 剪贴板格式维持原值。端口是视觉投影，不能把所有真实输入改成一个 wildcard 输入。接口发生破坏性变化时增加 API 主版本，不静默改变 v1。


## 有序素材快照接收

可选 `materialTargets(node)` 返回 `{element, key, dropElements?, previewElements?, clipElement?, project?, label?}[]`。element 为可见目标，key 为业务拥有的稳定目标键；dropElements 为同一目标的附加落点，previewElements 为拖入时一起高亮的元素数组，也可为 `(assetCount) => Element[]`，按本次素材数量返回实际受影响的元素，不扩大命中区域；clipElement 限制滚动可见区域。默认投影外置 Slot；`project:false` 仅保留元素落点，用于行头或单元格，不创建额外接口。label 同时用于接口说明和拖入提示。直接命中的目标优先于附近 Slot 的磁吸。宿主不解析 key，`acceptMaterials(node,key,collection)` 由业务按落点同步、原子地消费 `{version:1,assets:[{filename,subfolder,kind,nodeId,...}]}`，失败抛出可读错误。

目标可选声明 `accepts:['image','video','text']`。未声明时保持原有图片／视频接收行为，不接收文本；声明后宿主在直接落点和磁吸 Slot 中都检查类型。文本来源通过公开 `inputSnapshot(node)` 提供 `{version:1,texts:[...]}`，未就绪或停用的来源不可填入。`previewElements` 的数量参数为本次素材／文本条数，具体填充范围由业务计算。2026-10-23 的表格消费方支持列头填充、素材行头横向填充和单格素材追加；列头单条素材填满现有行，多条按序向下，具体见 [表格展示](architecture/FRONTEND_INTERACTION.md#多维表格的创作画布展示)。

画布只负责素材组有序快照或单个上传素材快照、命中检测、落点提示和历史边界；业务适配器负责数据验证、行数和单元格规则。该入口是显式一次填充，不创建虚假的原生输入或持久连接，不随源组变化覆盖手工编辑。字段删除、隐藏、重排后重新读取目标；使用 `.dae-material-slot` 复用素材卡片 Slot 外观。拖动素材组或上传素材本体时，宿主高亮目标接口及声明的落点并提示松开填入；结束或取消时清除提示，完成填充时恢复源节点原位置及组关系。

## Slot 基准

宿主将 `materialTargets`／`materialSources` 投影为表头上方、列宽中心的外置 Slot，共享邻近磁吸和微动。可选 `anchorElement` 声明列定位区域；默认使用 element 所属的语义 `th`，否则使用 element。源控件在画布借用期间隐藏，退出时恢复；业务仍持有原 DOM 和稳定 key。列区域落点与 clipElement 契约保持有效。

所有适配器遵循[接口与连线基准](architecture/FRONTEND_INTERACTION.md#接口与连线)。宿主统一拥有端口外观、磁吸、端点跟随及断线撤销；消费者仅声明类型、用途和能力限制。`materialTargets` 的列接口是一次素材快照接收目标，不创建持久图连接。表格缩放与完整高度不得覆盖宿主 Slot 的交互。

## 生成结果输出

`assets(node)` 和 `outputMaterials(node,key)` 的快照可附带 `groups:[{label,count}]`，按顺序将平铺 assets 划分为连续的素材组；count 必须为正整数，总和等于 assets 长度。宿主按 label 命名并分别创建组，单素材也成组。业务提供任务名称和分组边界，宿主不解析任务或行数据；未提供 groups 的输出保持原行为。

可选 `materialSources(node)` 返回 `{element,key,label?}[]`，使用稳定列 ID 和 `.dae-material-slot`。宿主拥有点击、拖线及空白处创建菜单。`outputMaterials(node,key)` 返回 `{version:1,ready,assets,label?,skipped?}`；assets 使用本地 `/view` URL、kind、id、name 和可选 provenance，按业务顺序提供。已有图像或视频素材即可输出，包括过期结果或重新生成期间保留的结果；业务只跳过没有可用素材的行。

输出为一次素材引用快照：宿主检查本地文件的目录范围、存在性和类型，直接引用 input/output 原文件，创建现有素材节点及有序素材组，统一撤销；不复制文件、不完整读取计算摘要、不提前解码视频。素材 JSON 保留 `type`，旧数据缺省仍为 input；预览、素材组执行和剪辑按原目录读取。异步期间来源发生变化时放弃创建。不增加原生端口、持久图连线或业务生成依赖。适配器显式声明 `materialOutput:true` 后，`assets(node)` 提供的当前剪辑结果也可输出为单个视频素材。

## 面板呈现与视口上下文

### 单素材复制拖出

适配器可选 `materialItem(node,key)` 返回单素材快照 `{version:1,ready,assets:[asset]}`，key 是业务拥有的稳定记录／字段／素材身份。业务在原生 `dragstart` 中调用 `api.getPanelContext(root)?.beginMaterialDrag(key,event.dataTransfer)`。未安装画布、面板停用或来源无效时返回 false；原有表内拖放继续工作。

宿主只在空白画布接收该拖动，读取适配器快照并通过原有本地素材接口验证文件；异步返回时再次核对工作流、节点、模式及素材快照。创建一个现有上传节点，保留来源和原文件，纳入统一撤销。不创建素材组或伪连线，不读取业务私有 DOM。`materialOutput` 也可为节点函数，用于同一适配器内按节点声明结果输出能力。

适配器可选 `presentation: 'content'`（或节点函数）让宿主负责无外框卡片、通用外置标题及正文内边距。标题与 `floatingHeader` 和上传素材共用 [通用视觉基线](architecture/FRONTEND_INTERACTION.md#通用视觉基线)，不由业务包单独设置字号、字重、颜色或间距。`selectionSurface(node)` 返回自己 root 内的 DOM 区域，宿主为其绘制选中轮廓；重绘替换该区域后宿主重新读取。业务样式不得修改宿主卡片、标题或选择状态。

`api.getPanelContext(element)` 返回当前借用面板的上下文，独立安装或归还后返回 null。上下文提供 `presentation`、`fullHeight`、`selected`、`contains(element)`、`getBounds()`、`getViewport()`、`focus()` 与 `panBy(dx,dy)`；`focus()` 选择并聚焦当前租借面板所在节点，停用或释放后返回 false；适配器可在随后聚焦自己的字段。位移为屏幕像素，正数将内容向左／上平移。隐藏、停用或释放后平移返回 false。无需查找宿主 DOM 或派发模拟滚轮事件。宿主在借用 root 上管理公开 `data-canvas-panel=true` 和 `data-canvas-full-height` 标记，归还时清理。业务自身的滚动、末行和末列布局留在业务包，不由宿主识别其 CSS 类名。

宿主在视角、卡片位置／尺寸、选择或内部滚动变化后，按动画帧合并派发冒泡事件 `dae-canvas-layout`。业务可在 `globalThis` 监听该通知，通过自己的面板上下文重新定位可见悬浮栏；无需读取宿主 DOM，也不应在每帧重建业务面板。独立安装时没有此事件，原有编辑逻辑照常工作；销毁时移除监听。
## LLM 输入输出流程接入（2026-10-15）

- API v1 新增只读 `inputSnapshot(node)`：由节点适配器的 `inputSnapshot(node)` 或已有 `assets(node)` 提供版本化快照，公共入口深拷贝后返回；停用或无提供方返回 null。文本适配器提供 `{version:1,texts:[text]}`，上传及素材组沿用有序 assets 契约。业务消费者不得读取其他节点的私有面板。
- API v1 新增 `placeNode(node,{x,y,width})`：在已有创作画布状态中设置新节点的布局。仅接受有限数值；调用方负责将创建和定位包含在同一历史边界。
- 表格交换由业务库 `table_exchange.mjs` 的 `readTableSnapshot` / `createTableSnapshot` 公开服务持有。LLM 不读取表格私有 DOM 或面板状态。
- 生成任务通过业务库 `writeTablePrompts(node,changes,{group})` 写回提示词。changes 按 `recordId` / `fieldId` 定位，携带原内容 `expected` 与新 `segments`；表格所有者校验来源并复用自身编辑历史、局部单元格刷新。segments 包含首尾帧标签及可选 binding；业务按目标生成配置映射标签 ID、素材绑定和对应参考模式，不传递另一边的配置所有权。宿主不参与业务内容同步。

面板上下文的 `width` 为当前卡片宽度（画布像素），`resizeWidth(width)` 在当前有效、可调宽面板上更新卡片宽度和连线，遵循适配器的 `minWidth`；失效、不可调宽或非正有限数返回 false。调用方将此调整纳入自己的编辑／撤销事务。表格删列通过该接口缩小外框，不访问宿主 DOM 或布局状态。

### 确认后输出（2026-10-16）

面板上下文新增可选 `confirmOutput(confirm)`：活动面板显式调用，同步 confirm 回调返回 true 后复用适配器的 defaultOutputNode 创建真实连线结果。已有同类型输出目标复用；新目标放在来源右侧并避让其他卡片。创建、连线及业务确认位于同一宿主历史事务。回调必须同步、失败不修改业务状态。没有宿主上下文时业务保留原确认行为，不依赖画布安装。现有应用回原文本路径不变。

验证：2026-10-16，在 CPU ComfyUI 组合安装（8218）使用“跳过模型·流程测试”完成两个真实实例的确认创建、文本隔离、既有目标复用、失效建议禁用、删除后重建、Ctrl+Z/重做、画布/图形模式往返和保存重载检查。保存文件实际含两条 LLM→TextInput STRING 连线；未调用生成模型。复用现有确认按钮、文本节点、主题字段和 Slot 外观，未新增 CSS。原应用回原文本实现未修改，其已有回归测试通过。Canvas 43 项测试及业务 IO/旧应用回写 8 项测试通过。工作流：1016-LLM确认自动输出验收。
