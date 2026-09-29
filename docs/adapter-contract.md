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
| `panel(node)` | 返回 `{root, buttons?, fields?, close?, workspaceControls?}`；root 尚未挂载时可以为空，宿主稍后重试。可选 DOM 容器 `workspaceControls` 用于放置宿主的展开按钮，面板负责其布局，宿主释放面板时收回按钮 |
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

可选 `materialTargets(node)` 返回 `{element, key, dropElements?, clipElement?}[]`。element 为可见 Slot，key 为业务稳定字段 ID；dropElements 为同一目标的附加落点，clipElement 限制滚动可见区域。`acceptMaterials(node,key,collection)` 同步、原子地消费 `{version:1,assets:[{filename,subfolder,kind,nodeId,...}]}`，失败抛出可读错误。

画布只负责素材组有序快照、命中检测和历史边界；业务适配器负责数据验证、行数和单元格规则。该入口是显式一次填充，不创建虚假的原生输入或持久连接，不随源组变化覆盖手工编辑。字段删除、隐藏、重排后重新读取目标；使用 `.dae-material-slot` 复用素材卡片 Slot 外观。拖动素材组本体完成填充时恢复原位置。

## Slot 基准

所有适配器遵循[接口与连线基准](architecture/FRONTEND_INTERACTION.md#接口与连线)。宿主统一拥有端口外观、磁吸、端点跟随及断线撤销；消费者仅声明类型、用途和能力限制。`materialTargets` 的列接口是一次素材快照接收目标，不创建持久图连接。表格缩放与完整高度不得覆盖宿主 Slot 的交互。
