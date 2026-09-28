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
| `workspace(node)` | 是否使用独立编辑器弹窗 |
| `panel(node)` | 返回 `{root, buttons?, fields?, close?}`；root 尚未挂载时可以为空，宿主稍后重试 |
| `refresh(node)` | 更新自己面板，不得每次重建 DOM 或发送请求 |
| `summary(node)` / `preview(node)` | 摘要或 `{url, kind}`；提供业务所有者认可的预览 |
| `action(node)` | 可选 `{label, run(node, app)}`，Promise 交给共享按钮管理忙碌态 |
| `inputLabels` | 将原生输入名称映射到用户可读用途；类型兼容仍使用原生图输入／输出声明 |
| `onCreate(node)` | 用户从画布新增节点时初始化业务状态 |
| `prepareCopy(node, serialized)` | 在配置新节点前修改副本，例如生成新 request_id；不得改源节点 |
| `menu` | 已安装节点的双击菜单项；未知类型不显示。icon 使用本仓库随附 Remix SVG 名称 |

宿主借用面板时复用 `creative_button.mjs`、`creative_field.mjs` 的绑定，返回原模式时清理并归还；节点删除或工作流重载时释放。面板提供方负责自身请求取消和原生 widget 生命周期。多个实例必须拥有独立状态。

内部节点 ID、`graph.extra.daelabCreativeCanvasV1`、素材 JSON、原生槽位索引以及 `DAELAB.CreativeNode.v1` 剪贴板格式维持原值。端口是视觉投影，不能把所有真实输入改成一个 wildcard 输入。接口发生破坏性变化时增加 API 主版本，不静默改变 v1。
