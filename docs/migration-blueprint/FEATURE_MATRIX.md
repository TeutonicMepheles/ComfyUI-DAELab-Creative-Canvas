# 创作画布完整功能对照表

本文件由 `catalog/*.json` 生成；修改目录中的源数据后运行 `node docs/migration-blueprint/render_catalog.mjs --write`。不要单独修改生成表。

共 118 项能力决策：保留 61 项，重构 41 项，不迁入 16 项，暂缓 0 项。功能条目按用户行为、兼容合同及产品基础能力计数，不等同于节点数量。当前事实来自固定源码；目标和验收均为新产品定义。

保留表示保留成熟行为及实现，仍可进行模块接入；重构表示保留能力并重组实现；不迁入不等于删除用户旧数据。旧类型处置见 [78 个节点类型清单](NODE_INVENTORY.md)，总体顺序见 [迁移蓝图](BLUEPRINT.md)。

## 画布与素材能力

| 编号 | 能力 | 处置 | 阶段 | 用例数 | 测试数 |
| --- | --- | --- | --- | --- | --- |
| [F-CAN-001](FEATURE_MATRIX.md#f-can-001) | 单包安装、节点注册与版本检查 | 重构 | M1 | 2 | 2 |
| [F-CAN-002](FEATURE_MATRIX.md#f-can-002) | 创作画布与原生图模式切换 | 重构 | M1 | 2 | 2 |
| [F-CAN-003](FEATURE_MATRIX.md#f-can-003) | 共享组件、主题与可访问交互状态 | 保留 | M1 | 2 | 6 |
| [F-CAN-004](FEATURE_MATRIX.md#f-can-004) | 按已注册能力新建节点 | 保留 | M2 | 1 | 1 |
| [F-CAN-005](FEATURE_MATRIX.md#f-can-005) | 单文件与批量本地媒体上传 | 保留 | M2 | 1 | 2 |
| [F-CAN-006](FEATURE_MATRIX.md#f-can-006) | 替换素材、连线类型保护与失败保留 | 保留 | M2 | 1 | 2 |
| [F-CAN-007](FEATURE_MATRIX.md#f-can-007) | 素材预览、媒体操作与视频播放 | 保留 | M2 | 4 | 2 |
| [F-CAN-008](FEATURE_MATRIX.md#f-can-008) | 独立文本节点与原生 STRING 输出 | 保留 | M2 | 2 | 1 |
| [F-CAN-009](FEATURE_MATRIX.md#f-can-009) | 节点与素材组命名 | 保留 | M2 | 3 | 2 |
| [F-CAN-010](FEATURE_MATRIX.md#f-can-010) | 画布视口、平移和缩放 | 保留 | M2 | 2 | 3 |
| [F-CAN-011](FEATURE_MATRIX.md#f-can-011) | 选择、框选、拖动与输入事件优先级 | 重构 | M2 | 2 | 2 |
| [F-CAN-012](FEATURE_MATRIX.md#f-can-012) | 复制粘贴、组成员和内部连接重映射 | 保留 | M2 | 1 | 1 |
| [F-CAN-013](FEATURE_MATRIX.md#f-can-013) | 编辑事务、撤销重做与派生同步合并 | 重构 | M1 | 2 | 8 |
| [F-CAN-014](FEATURE_MATRIX.md#f-can-014) | 原生工作流保存、载入与版本兼容 | 保留 | M6 | 2 | 3 |
| [F-CAN-015](FEATURE_MATRIX.md#f-can-015) | 素材组创建、成员移入移出与顺序 | 保留 | M2 | 2 | 4 |
| [F-CAN-016](FEATURE_MATRIX.md#f-can-016) | 素材组布局、颜色、序号与紧凑展示 | 保留 | M2 | 1 | 1 |
| [F-CAN-017](FEATURE_MATRIX.md#f-can-017) | 素材组锁定、收起、解散和删除 | 保留 | M2 | 1 | 1 |
| [F-CAN-018](FEATURE_MATRIX.md#f-can-018) | 统一 Slot、类型校验、用途选择与磁吸 | 重构 | M2 | 2 | 2 |
| [F-CAN-019](FEATURE_MATRIX.md#f-can-019) | 连线选择、删除、拖断与动画 | 保留 | M2 | 1 | 1 |
| [F-CAN-020](FEATURE_MATRIX.md#f-can-020) | 有序素材/文本快照与真实类型输出 | 保留 | M2 | 6 | 6 |
| [F-CAN-021](FEATURE_MATRIX.md#f-can-021) | 素材向业务落点的一次性填充 | 保留 | M3 | 1 | 1 |
| [F-CAN-022](FEATURE_MATRIX.md#f-can-022) | 生成结果输出为素材组与单素材拖出 | 保留 | M3 | 1 | 2 |
| [F-CAN-023](FEATURE_MATRIX.md#f-can-023) | 面板借用、内容呈现、尺寸和公开上下文 | 重构 | M1 | 2 | 3 |
| [F-CAN-024](FEATURE_MATRIX.md#f-can-024) | 收藏快照与资产目录持久化迁移 | 重构 | M2 | 2 | 3 |
| [F-CAN-025](FEATURE_MATRIX.md#f-can-025) | 资产库抽屉、筛选、搜索、预览与复用 | 保留 | M2 | 1 | 2 |
| [F-CAN-026](FEATURE_MATRIX.md#f-can-026) | 统一只读任务胶囊与真实进度 | 保留 | M4 | 2 | 3 |
| [F-CAN-027](FEATURE_MATRIX.md#f-can-027) | Active/Mute/Bypass、实例隔离与异步释放 | 重构 | M1 | 3 | 6 |
| [F-CAN-028](FEATURE_MATRIX.md#f-can-028) | 剪辑输入同步、来源身份与多素材组 | 保留 | M5 | 1 | 2 |
| [F-CAN-029](FEATURE_MATRIX.md#f-can-029) | 单轨剪辑编辑、吸附与键盘逐帧操作 | 保留 | M5 | 2 | 1 |
| [F-CAN-030](FEATURE_MATRIX.md#f-can-030) | 时间轴预览、播放时钟与画面切换 | 重构 | M5 | 1 | 2 |
| [F-CAN-031](FEATURE_MATRIX.md#f-can-031) | 低倍率预览副本、缓存与取消 | 保留 | M5 | 2 | 2 |
| [F-CAN-032](FEATURE_MATRIX.md#f-can-032) | 剪辑分辨率、画面适配与静音 | 保留 | M5 | 2 | 1 |
| [F-CAN-033](FEATURE_MATRIX.md#f-can-033) | 剪辑导出队列、进度、取消与错误恢复 | 重构 | M5 | 1 | 2 |
| [F-CAN-034](FEATURE_MATRIX.md#f-can-034) | 剪辑成片失效、连接门禁与素材输出 | 保留 | M5 | 2 | 1 |
| [F-CAN-035](FEATURE_MATRIX.md#f-can-035) | ComfyTV 旧工作流的可选兼容 | 保留 | M6 | 1 | 2 |
| [F-CAN-036](FEATURE_MATRIX.md#f-can-036) | 本地素材引用、路径边界与失效处理 | 保留 | M2 | 5 | 5 |
| [F-CAN-037](FEATURE_MATRIX.md#f-can-037) | 大画布资源预算与离屏媒体治理 | 重构 | M2 | 1 | 2 |
| [F-CAN-038](FEATURE_MATRIX.md#f-can-038) | 宿主 API 兼容层与能力/版本诊断 | 重构 | M1 | 2 | 4 |
| [F-CAN-039](FEATURE_MATRIX.md#f-can-039) | 本地字体图标、资源校验与组件陈列 | 保留 | M1 | 3 | 1 |

<a id="f-can-001"></a>

### F-CAN-001 单包安装、节点注册与版本检查

**处置：重构；阶段：M1。** 现库已注册上传、输入文本、素材组、剪辑；README 要求分别安装业务库，尚无统一产品安装包或已验证最低宿主版本范围。

**来源：** [canvas:__init__.py](../../__init__.py)；[canvas:README.md:33](../../README.md#L33)；[canvas:README.md:37](../../README.md#L37)

**新归属：** `backend/integrations/comfyui; frontend/src/integrations/comfyui`

**理由：** 把分散的安装/注册收敛为单包，保留稳定节点 ID；旧同名节点包冲突必须在加载前给出明确诊断。

**验收：**

- 仅安装新包即可加载迁入能力，不依赖两个旧仓库源码目录。
- 节点 ID 不重复注册；同时发现旧同名节点实现时阻止静默覆盖并报告冲突路径。
- 声明并记录验证过的 ComfyUI、前端、Python 版本组合。

**关联：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-001](TEST_CASES.md#tc-can-001)、[TC-CAN-039](TEST_CASES.md#tc-can-039)

<a id="f-can-002"></a>

### F-CAN-002 创作画布与原生图模式切换

**处置：重构；阶段：M1。** 源码已有画布显示/隐藏、模式菜单注入及保存的 active 状态恢复。

**来源：** [canvas:web/creative_canvas.js](../../web/creative_canvas.js)；[canvas:web/creative_canvas_view.mjs:838](../../web/creative_canvas_view.mjs#L838)

**新归属：** `frontend/src/integrations/comfyui/modes; frontend/src/canvas`

**理由：** 保留模式语义，将宿主菜单与生命周期适配从画布交互中抽离。

**验收：**

- 往返切换保留同一原生图、节点业务数据和连线。
- 隐藏时关闭画布浮层并释放/归还借用面板；恢复时不重复挂载。
- 工作流保存后按记录恢复画布模式。

**关联：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-030](TEST_CASES.md#tc-can-030)

<a id="f-can-003"></a>

### F-CAN-003 共享组件、主题与可访问交互状态

**处置：保留；阶段：M1。** 源码已有共享按钮、字段、主题、任务样式；规范已有焦点、禁用、忙碌、错误及视觉要求。

**来源：** [canvas:web/creative_button.mjs](../../web/creative_button.mjs)；[canvas:web/creative_field.mjs](../../web/creative_field.mjs)；[canvas:web/creative_theme.css](../../web/creative_theme.css)；[canvas:docs/architecture/CONTRIBUTING_CONTROLS.md](../../docs/architecture/CONTRIBUTING_CONTROLS.md)

**新归属：** `frontend/src/design; frontend/src/ui`

**理由：** 保留已形成的组件语义与视觉基线，统一令牌和实例生命周期；迁移不另建节点私有控件体系。

**验收：**

- 按钮的异步忙碌、字段的草稿/提交、焦点和错误状态由共享实现提供。
- 样式限定产品根范围，不改变宿主和未迁入插件控件。
- 所有基础组件覆盖键盘、中文输入、禁用、忙碌、错误状态。

**关联：** [UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-009](TEST_CASES.md#tc-can-009)、[TC-CAN-017](TEST_CASES.md#tc-can-017)、[TC-CAN-019](TEST_CASES.md#tc-can-019)、[TC-CAN-025](TEST_CASES.md#tc-can-025)、[TC-CAN-043](TEST_CASES.md#tc-can-043)

<a id="f-can-004"></a>

### F-CAN-004 按已注册能力新建节点

**处置：保留；阶段：M2。** 源码已有空白双击、右键与底部新建菜单，按注册定义和适配器提供可用节点。

**来源：** [canvas:web/creative_canvas_catalog.mjs](../../web/creative_canvas_catalog.mjs)；[canvas:web/creative_canvas_view.mjs:517](../../web/creative_canvas_view.mjs#L517)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/canvas/commands; frontend/src/application/catalog`

**理由：** 保留一致入口和真实能力发现，避免新库暴露不可运行的旧业务节点。

**验收：**

- 三个入口展示一致的可用节点集合。
- 未安装/未启用的能力不显示可执行菜单项。
- 一次新建和初始定位形成一个可撤销编辑。

**关联：** [UC-CAN-001](USE_CASES.md#uc-can-001)；[TC-CAN-003](TEST_CASES.md#tc-can-003)

<a id="f-can-005"></a>

### F-CAN-005 单文件与批量本地媒体上传

**处置：保留；阶段：M2。** 源码已有选择文件上传、拖入空白创建节点、多文件顺序创建及支持格式筛选。

**来源：** [canvas:web/media_upload.js](../../web/media_upload.js)；[canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:web/media_upload_model.mjs](../../web/media_upload_model.mjs)

**新归属：** `frontend/src/features/assets/upload; backend/assets`

**理由：** 保留低门槛素材入口和部分失败不阻断整批的行为。

**验收：**

- PNG/JPG/WebP/MP4/WebM/MOV 按已声明格式处理。
- 多文件按来源顺序各建一个素材节点，拖到已有卡片也不覆盖原素材。
- 不支持文件显示原因；同批支持文件继续处理。

**关联：** [UC-CAN-002](USE_CASES.md#uc-can-002)；[TC-CAN-004](TEST_CASES.md#tc-can-004)、[TC-CAN-006](TEST_CASES.md#tc-can-006)

<a id="f-can-006"></a>

### F-CAN-006 替换素材、连线类型保护与失败保留

**处置：保留；阶段：M2。** 上传实现包含原值、请求 epoch、AbortController 和跨类型已连线拒绝。

**来源：** [canvas:web/media_upload.js:49](../../web/media_upload.js#L49)；[canvas:web/media_upload_model.mjs](../../web/media_upload_model.mjs)

**新归属：** `frontend/src/features/assets/upload; frontend/src/contracts/assets`

**理由：** 保留用户资产与连接安全，避免新异步服务改写后丢失竞态保护。

**验收：**

- 单文件替换成功才提交新的素材引用；失败保留原值和原媒体。
- 已连输出时，图片/视频跨类型替换拒绝且不删除连线。
- 取消、删除、重载或后续请求发生后，旧上传结果不回写。

**关联：** [UC-CAN-002](USE_CASES.md#uc-can-002)；[TC-CAN-005](TEST_CASES.md#tc-can-005)、[TC-CAN-006](TEST_CASES.md#tc-can-006)

<a id="f-can-007"></a>

### F-CAN-007 素材预览、媒体操作与视频播放

**处置：保留；阶段：M2。** 源码已有比例预览、下载、全屏、视频播放控制和缺失/编码错误提示。

**来源：** [canvas:web/media_upload.js](../../web/media_upload.js)；[canvas:web/upload_video_controls.mjs](../../web/upload_video_controls.mjs)；[canvas:web/media_upload.css](../../web/media_upload.css)

**新归属：** `frontend/src/features/assets/media; frontend/src/ui/media`

**理由：** 保留素材浏览体验，播放器状态必须独立于画布拖动与其他实例。

**验收：**

- 图片/视频按原比例显示，空态 16:9，已有文件不被重采样替换。
- 下载、全屏、播放/暂停、进度、音量、静音可操作且不触发节点拖动。
- 两个实例独立；替换/删除释放监听与旧媒体源。

**关联：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-008](TEST_CASES.md#tc-can-008)

<a id="f-can-008"></a>

### F-CAN-008 独立文本节点与原生 STRING 输出

**处置：保留；阶段：M2。** 源码已有多行文本、共享字段、收藏入口和原生 STRING 输出。

**来源：** [canvas:web/text_input.js](../../web/text_input.js)；[canvas:web/text_input_model.mjs](../../web/text_input_model.mjs)；[canvas:nodes/text_input.py](../../nodes/text_input.py)

**新归属：** `frontend/src/features/assets/text; backend/integrations/comfyui/nodes`

**理由：** 文本是素材与生成输入共同基础，保留原生类型和保存语义。

**验收：**

- 文本编辑支持中文组合输入和多行内容，修改 A 不影响 B。
- 输出保持原生 STRING，与已声明文本消费者连接。
- 收藏保存当时文本快照，后续编辑不修改旧收藏。

**关联：** [UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-008](USE_CASES.md#uc-can-008)；[TC-CAN-009](TEST_CASES.md#tc-can-009)

<a id="f-can-009"></a>

### F-CAN-009 节点与素材组命名

**处置：保留；阶段：M2。** 源码/规范已有自动文件名、保留手工名、孤立及组内双击改名。

**来源：** [canvas:web/media_upload.js:32](../../web/media_upload.js#L32)；[canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/canvas/commands/rename; frontend/src/ui/title`

**理由：** 保留清楚的素材身份和中文编辑行为，不把显示标题作为业务 ID。

**验收：**

- 替换素材时自动标题跟随文件名，手工标题不被覆盖。
- Enter/失焦提交非空名，Esc 取消，组合输入不提前提交。
- 长名称省略但可聚焦；名称在保存重载、移入移出组后保留。

**关联：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-010](TEST_CASES.md#tc-can-010)

<a id="f-can-010"></a>

### F-CAN-010 画布视口、平移和缩放

**处置：保留；阶段：M2。** 源码已有中键拖动、滚轮平移、Shift 横移和 Ctrl 围绕指针缩放。

**来源：** [canvas:web/creative_navigation.mjs](../../web/creative_navigation.mjs)；[canvas:web/creative_canvas_model.mjs](../../web/creative_canvas_model.mjs)；[canvas:web/creative_canvas_view.mjs:105](../../web/creative_canvas_view.mjs#L105)

**新归属：** `frontend/src/canvas/viewport`

**理由：** 保留创作工具操作习惯，分清屏幕与画布坐标并统一布局通知。

**验收：**

- 指针缩放保持其指向的画布坐标不漂移。
- 标题与 Slot 的屏幕像素规则同步更新，媒体内容随画布比例变化。
- 纯视口移动不变更业务内容，不破坏撤销/重做链。

**关联：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-011](TEST_CASES.md#tc-can-011)、[TC-CAN-041](TEST_CASES.md#tc-can-041)

<a id="f-can-011"></a>

### F-CAN-011 选择、框选、拖动与输入事件优先级

**处置：重构；阶段：M2。** 主视图和素材组模块已实现单选/多选、框选及拖动，事件判定分布在多个入口。

**来源：** [canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/canvas/interaction`

**理由：** 以明确的交互状态机组织现有语义，避免标题、媒体、表格与画布争夺同一事件。

**验收：**

- Shift/Ctrl 追加选择、空白框选与组内选择行为符合现有规范。
- 按钮、下载链接、文本输入和媒体滑条操作不拖动节点。
- Esc/pointercancel 清理拖动、落点与连线预览，不留下捕获状态。

**关联：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-008](TEST_CASES.md#tc-can-008)、[TC-CAN-012](TEST_CASES.md#tc-can-012)

<a id="f-can-012"></a>

### F-CAN-012 复制粘贴、组成员和内部连接重映射

**处置：保留；阶段：M2。** 源码已有 DAELAB.CreativeNode.v1 剪贴板、节点复制及 prepareCopy/remapCopy 适配接口。

**来源：** [canvas:web/creative_navigation.mjs](../../web/creative_navigation.mjs)；[canvas:web/creative_canvas_view.mjs:790](../../web/creative_canvas_view.mjs#L790)；[canvas:web/material_group_model.mjs](../../web/material_group_model.mjs)；[canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)

**新归属：** `frontend/src/canvas/clipboard; frontend/src/contracts/clipboard`

**理由：** 保留稳定格式和素材引用，副本业务任务身份由能力模块重新生成。

**验收：**

- 复制选区保留内部连线、成员顺序和素材引用，节点 ID 与业务请求 ID 独立重映射。
- 不复制源选区外部连接，也不修改源节点。
- 文本编辑器内 Ctrl+C/V 保留系统文本行为。

**关联：** [UC-CAN-006](USE_CASES.md#uc-can-006)；[TC-CAN-013](TEST_CASES.md#tc-can-013)

<a id="f-can-013"></a>

### F-CAN-013 编辑事务、撤销重做与派生同步合并

**处置：重构；阶段：M1。** 现有历史桥接调用并修改宿主 ChangeTracker 状态，另有布局恢复优化和派生 amend。

**来源：** [canvas:web/creative_history.mjs](../../web/creative_history.mjs)；[canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:web/video_edit.js](../../web/video_edit.js)

**新归属：** `frontend/src/application/history; frontend/src/integrations/comfyui/history`

**理由：** 原生图仍是权威编辑保存模型；所有历史耦合集中到宿主适配层，业务通过统一事务调用。

**验收：**

- 一次用户动作连同关联节点/连线变化只产生一个撤销步骤。
- 派生素材同步并入原编辑，不新增历史且不清空重做。
- 异步结果提交前检查图、节点与内容版本；不复活已删除内容。

**关联：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-010](USE_CASES.md#uc-can-010)；[TC-CAN-003](TEST_CASES.md#tc-can-003)、[TC-CAN-011](TEST_CASES.md#tc-can-011)、[TC-CAN-014](TEST_CASES.md#tc-can-014)、[TC-CAN-018](TEST_CASES.md#tc-can-018)、[TC-CAN-021](TEST_CASES.md#tc-can-021)、[TC-CAN-032](TEST_CASES.md#tc-can-032)、[TC-CAN-033](TEST_CASES.md#tc-can-033)、[TC-CAN-042](TEST_CASES.md#tc-can-042)

<a id="f-can-014"></a>

### F-CAN-014 原生工作流保存、载入与版本兼容

**处置：保留；阶段：M6。** 现有画布布局写 graph.extra.daelabCreativeCanvasV1；节点、素材和剪辑保留版本化 JSON。

**来源：** [canvas:web/creative_canvas_model.mjs:2](../../web/creative_canvas_model.mjs#L2)；[canvas:docs/adapter-contract.md:58](../../docs/adapter-contract.md#L58)；[canvas:nodes/media_upload.py](../../nodes/media_upload.py)；[canvas:web/video_edit_model.mjs](../../web/video_edit_model.mjs)

**新归属：** `frontend/src/integrations/comfyui/serialization; compat/workflows`

**理由：** 维持原生图唯一权威编辑保存来源，避免另建双向同步的产品文档。

**验收：**

- 保留稳定 ID、槽位位置、material JSON 和 daelabCreativeCanvasV1 的已承诺含义。
- 导入旧格式时先保留原文件并报告转换；未知版本不静默覆盖。
- 任务运行状态、DOM、Promise、监听器和凭据不写入工作流或撤销数据。

**关联：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-015](TEST_CASES.md#tc-can-015)、[TC-CAN-027](TEST_CASES.md#tc-can-027)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="f-can-015"></a>

### F-CAN-015 素材组创建、成员移入移出与顺序

**处置：保留；阶段：M2。** 素材组有稳定 DAELAB.MaterialGroup 节点与成员 ID 列表，支持上传素材和文本成员。

**来源：** [canvas:web/material_group_model.mjs](../../web/material_group_model.mjs)；[canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:nodes/material_group.py](../../nodes/material_group.py)；[canvas:docs/material-groups.md](../../docs/material-groups.md)

**新归属：** `frontend/src/features/groups; backend/integrations/comfyui/nodes`

**理由：** 保留有序集合语义与节点身份，组操作不应隐式改写已有业务连线。

**验收：**

- 多选后打组，拖入/移出保持成员唯一性、顺序和节点身份。
- 不支持嵌套组时清楚拒绝，不能产生环或静默丢成员。
- 单素材已有连线在打组后保留，除非用户显式建立组输入替代它。

**关联：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-006](USE_CASES.md#uc-can-006)；[TC-CAN-010](TEST_CASES.md#tc-can-010)、[TC-CAN-012](TEST_CASES.md#tc-can-012)、[TC-CAN-013](TEST_CASES.md#tc-can-013)、[TC-CAN-016](TEST_CASES.md#tc-can-016)

<a id="f-can-016"></a>

### F-CAN-016 素材组布局、颜色、序号与紧凑展示

**处置：保留；阶段：M2。** 源码已有宫格/水平/垂直排列、五色及自选色、序号、组内标题与悬浮工具栏。

**来源：** [canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:web/material_groups.css](../../web/material_groups.css)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/features/groups/layout; frontend/src/design`

**理由：** 保留已有创作审阅体验，以共享令牌统一视觉。

**验收：**

- 三种排列按成员顺序布局且容器贴合内容。
- 自选色、序号状态保存重载后保留；成员显示不重排素材顺序。
- 缩放、平移、调整内容后工具栏与组边界跟随，不遮挡必要控件。

**关联：** [UC-CAN-003](USE_CASES.md#uc-can-003)；[TC-CAN-017](TEST_CASES.md#tc-can-017)

<a id="f-can-017"></a>

### F-CAN-017 素材组锁定、收起、解散和删除

**处置：保留；阶段：M2。** 源码已有锁定、收起、解散、删除组及统一历史操作。

**来源：** [canvas:web/material_groups.mjs](../../web/material_groups.mjs)；[canvas:docs/material-groups.md](../../docs/material-groups.md)

**新归属：** `frontend/src/features/groups/commands`

**理由：** 保留删除与解散差异，避免迁移时引入破坏性语义变化。

**验收：**

- 锁定阻止整组、成员移动与排列改变；解锁恢复。
- 解散只移除组容器及其连接，保留成员；删除组连成员及相关连接一并删除。
- 以上操作均一次撤销恢复数据、顺序和连线。

**关联：** [UC-CAN-003](USE_CASES.md#uc-can-003)；[TC-CAN-018](TEST_CASES.md#tc-can-018)

<a id="f-can-018"></a>

### F-CAN-018 统一 Slot、类型校验、用途选择与磁吸

**处置：重构；阶段：M2。** 已有共享可视端口与原生类型映射，包含磁吸、反向拉线和 first-free 能力。

**来源：** [canvas:web/creative_connections.mjs](../../web/creative_connections.mjs)；[canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/canvas/connections; frontend/src/contracts/ports`

**理由：** 统一端口状态机与命中计算；业务只声明类型、用途和限制。

**验收：**

- 视觉合并不改变原生槽位索引及类型；禁止用 wildcard 绕过校验。
- 多用途选择清楚，first-free 只取首个兼容空槽且不覆盖现有连接。
- 隐藏、停用、被组压制或不兼容端口不接受磁吸连接。

**关联：** [UC-CAN-004](USE_CASES.md#uc-can-004)、[UC-CAN-007](USE_CASES.md#uc-can-007)；[TC-CAN-019](TEST_CASES.md#tc-can-019)、[TC-CAN-020](TEST_CASES.md#tc-can-020)

<a id="f-can-019"></a>

### F-CAN-019 连线选择、删除、拖断与动画

**处置：保留；阶段：M2。** 主视图已有连线绘制、选中删除、拖断、双击删除及关联脉冲。

**来源：** [canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:web/creative_canvas.css](../../web/creative_canvas.css)；[canvas:docs/architecture/FRONTEND_INTERACTION.md](../../docs/architecture/FRONTEND_INTERACTION.md)

**新归属：** `frontend/src/canvas/connections; frontend/src/ui/wires`

**理由：** 保留可见连线操作与撤销语义，动画不应影响数据处理。

**验收：**

- 双击、Delete/Backspace、拖断均删除同一真实连线并支持撤销。
- 文字编辑期间 Backspace 不删除图连接。
- 平移/缩放重绘不重启脉冲相位；减少动态效果模式使用静态高亮。

**关联：** [UC-CAN-004](USE_CASES.md#uc-can-004)；[TC-CAN-021](TEST_CASES.md#tc-can-021)

<a id="f-can-020"></a>

### F-CAN-020 有序素材/文本快照与真实类型输出

**处置：保留；阶段：M2。** 已有 assets/inputSnapshot、DAELAB_ASSETS、上传原生及 ComfyTV 引用类型和混合组快照。

**来源：** [canvas:web/creative_input_exchange.mjs](../../web/creative_input_exchange.mjs)；[canvas:web/material_group_model.mjs](../../web/material_group_model.mjs)；[canvas:nodes/material_group.py](../../nodes/material_group.py)；[canvas:nodes/media_upload.py](../../nodes/media_upload.py)；[canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)

**新归属：** `frontend/src/contracts/assets; frontend/src/features/groups; backend/assets`

**理由：** 保留单素材、整组与混合文本集合的区别，不把显示顺序等同于无序文件集合。

**验收：**

- 快照版本和顺序稳定，返回副本不可反向修改源状态。
- ready:false 与空集合不同，未就绪不删除下游已有编辑。
- 停用来源不提供可消费快照，原生执行类型与前端约束一致。

**关联：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-004](USE_CASES.md#uc-can-004)、[UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-007](USE_CASES.md#uc-can-007)、[UC-CAN-010](USE_CASES.md#uc-can-010)；[TC-CAN-009](TEST_CASES.md#tc-can-009)、[TC-CAN-013](TEST_CASES.md#tc-can-013)、[TC-CAN-015](TEST_CASES.md#tc-can-015)、[TC-CAN-016](TEST_CASES.md#tc-can-016)、[TC-CAN-020](TEST_CASES.md#tc-can-020)、[TC-CAN-022](TEST_CASES.md#tc-can-022)

<a id="f-can-021"></a>

### F-CAN-021 素材向业务落点的一次性填充

**处置：保留；阶段：M3。** 已有 materialTargets/acceptMaterials、按类型声明接收、落点预览和原子历史边界。

**来源：** [canvas:web/creative_material_drop.mjs](../../web/creative_material_drop.mjs)；[canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:docs/adapter-contract.md:61](../../docs/adapter-contract.md#L61)

**新归属：** `frontend/src/canvas/material-exchange; frontend/src/contracts/material-exchange`

**理由：** 宿主只管快照、命中与事务，表格列/行/单格规则由表格拥有。

**验收：**

- 直接落点优先于附近 Slot，按声明类型拒绝非法输入。
- 高亮范围与本次实际影响范围一致；取消/完成清除高亮。
- 填充后源节点位置和组关系恢复，不产生伪原生连接或持续自动覆盖。

**关联：** [UC-CAN-007](USE_CASES.md#uc-can-007)；[TC-CAN-022](TEST_CASES.md#tc-can-022)

<a id="f-can-022"></a>

### F-CAN-022 生成结果输出为素材组与单素材拖出

**处置：保留；阶段：M3。** 已有 outputMaterials 分组快照、本地文件核验、单格 materialItem 拖出和异步来源复核。

**来源：** [canvas:web/creative_output.mjs](../../web/creative_output.mjs)；[canvas:web/creative_canvas_view.mjs:222](../../web/creative_canvas_view.mjs#L222)；[canvas:nodes/material_output_api.py](../../nodes/material_output_api.py)；[canvas:docs/adapter-contract.md:75](../../docs/adapter-contract.md#L75)

**新归属：** `frontend/src/canvas/material-exchange; backend/assets/references`

**理由：** 将业务结果纳入素材创作链，同时保留来源文件引用和业务所有权。

**验收：**

- 分组 count 总和等于素材数；按业务 label/order 创建，每个有效任务可独立成组。
- 单素材拖出只创建一个素材节点，原单元格和文件不被删除。
- 来源/工作流在异步核验期间改变时放弃创建；全部新建可一次撤销。

**关联：** [UC-CAN-007](USE_CASES.md#uc-can-007)；[TC-CAN-023](TEST_CASES.md#tc-can-023)、[TC-CAN-024](TEST_CASES.md#tc-can-024)

<a id="f-can-023"></a>

### F-CAN-023 面板借用、内容呈现、尺寸和公开上下文

**处置：重构；阶段：M1。** 已有 leasePanel、公开 panel context、content/fullHeight/resizable、悬浮标题及布局事件。

**来源：** [canvas:web/creative_canvas_view.mjs:27](../../web/creative_canvas_view.mjs#L27)；[canvas:web/creative_panel_context.mjs](../../web/creative_panel_context.mjs)；[canvas:docs/adapter-contract.md:83](../../docs/adapter-contract.md#L83)

**新归属：** `frontend/src/ui/panels; frontend/src/integrations/comfyui/panels; frontend/src/contracts/panels`

**理由：** 保留真实编辑器状态，抽离挂载/归还和宿主布局，禁止业务查私有宿主 DOM。

**验收：**

- 借用和归还同一面板，不克隆独立业务状态；release/abandon 幂等清理。
- 面板宽度可按能力调整、取消和保存；fullHeight 不被通用高度裁切。
- 失效上下文的 focus/pan/resize 返回失败且不操作别的节点。

**关联：** [UC-CAN-007](USE_CASES.md#uc-can-007)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-025](TEST_CASES.md#tc-can-025)、[TC-CAN-042](TEST_CASES.md#tc-can-042)

<a id="f-can-024"></a>

### F-CAN-024 收藏快照与资产目录持久化迁移

**处置：重构；阶段：M2。** 现有收藏目录保存在当前站点 localStorage，媒体仅存本地引用、文本存内容快照，尚无统一后端资产目录。

**来源：** [canvas:web/asset_library_model.mjs](../../web/asset_library_model.mjs)；[canvas:web/asset_favorite.mjs](../../web/asset_favorite.mjs)；[canvas:docs/asset-library.md:7](../../docs/asset-library.md#L7)

**新归属：** `backend/assets/catalog; frontend/src/features/assets/library; compat/workflows/assets`

**理由：** 在同一产品数据目录内持久化收藏，迁入浏览器旧目录，避免换端口导致收藏不可见。

**验收：**

- 收藏去重采用内容身份；取消收藏不删除源文件或已建节点。
- 旧 localStorage 可导出并显式导入，保留原目录与逐条结果报告。
- 存储满、损坏、未知版本均不覆盖有效数据；目录持久化与工作流保存分离。

**关联：** [UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-026](TEST_CASES.md#tc-can-026)、[TC-CAN-027](TEST_CASES.md#tc-can-027)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="f-can-025"></a>

### F-CAN-025 资产库抽屉、筛选、搜索、预览与复用

**处置：保留；阶段：M2。** 已有底部抽屉、图片/视频/文本筛选、名称搜索、预览和加入画布。

**来源：** [canvas:web/asset_library.mjs](../../web/asset_library.mjs)；[canvas:web/asset_library.css](../../web/asset_library.css)；[canvas:docs/asset-library.md](../../docs/asset-library.md)

**新归属：** `frontend/src/features/assets/library`

**理由：** 保留可发现的素材复用入口，数据来源改为新资产目录。

**验收：**

- 抽屉固定屏幕尺寸，画布缩放不放大抽屉。
- 搜索/类型筛选正确，预览关闭后焦点返回原控件并暂停视频。
- 文件失效时报告原因，不创建空素材；有效加入画布形成可撤销编辑。

**关联：** [UC-CAN-008](USE_CASES.md#uc-can-008)；[TC-CAN-028](TEST_CASES.md#tc-can-028)、[TC-CAN-041](TEST_CASES.md#tc-can-041)

<a id="f-can-026"></a>

### F-CAN-026 统一只读任务胶囊与真实进度

**处置：保留；阶段：M4。** 已有任务快照校验/格式化与胶囊；queued/running/paused/cancelled/error/recovery/success 状态已定义。

**来源：** [canvas:web/creative_tasks_model.mjs](../../web/creative_tasks_model.mjs)；[canvas:web/creative_tasks.mjs](../../web/creative_tasks.mjs)；[canvas:docs/task-contract.md](../../docs/task-contract.md)

**新归属：** `frontend/src/features/tasks; frontend/src/contracts/tasks`

**理由：** 保留纯展示层，任务执行/恢复由后端任务服务拥有，不能由 UI 显隐推断执行状态。

**验收：**

- 计数和进度来自明确快照，不把结束数误作成功数。
- 历史 success/cancelled 无 finishedAt 时不重复弹新通知；当前终态按规则消退。
- 关闭、隐藏或销毁胶囊不取消任务；刷新 running 只有后端证据支持才显示运行。

**关联：** [UC-CAN-009](USE_CASES.md#uc-can-009)、[UC-CAN-012](USE_CASES.md#uc-can-012)；[TC-CAN-015](TEST_CASES.md#tc-can-015)、[TC-CAN-029](TEST_CASES.md#tc-can-029)、[TC-CAN-037](TEST_CASES.md#tc-can-037)

<a id="f-can-027"></a>

### F-CAN-027 Active/Mute/Bypass、实例隔离与异步释放

**处置：重构；阶段：M1。** 已有面板模式管理、媒体暂停、AbortController、租借释放及多实例设计；当前部分同步依赖轮询。

**来源：** [canvas:web/creative_panel_state.mjs](../../web/creative_panel_state.mjs)；[canvas:web/media_upload.js](../../web/media_upload.js)；[canvas:web/text_input.js](../../web/text_input.js)；[canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)

**新归属：** `frontend/src/application/lifecycle; frontend/src/integrations/comfyui/modes`

**理由：** 统一实例生命周期事件，避免重复计时器/订阅；执行状态不随 UI 停用被虚构修改。

**验收：**

- 停用隐藏正文与媒体且禁用操作，恢复 Active 还原原属性与数据。
- 修改、播放或取消 A 不影响 B。
- 删除/重载释放监听、媒体、订阅和请求；旧异步回调不能改新实例。

**关联：** [UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-009](USE_CASES.md#uc-can-009)、[UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-006](TEST_CASES.md#tc-can-006)、[TC-CAN-008](TEST_CASES.md#tc-can-008)、[TC-CAN-024](TEST_CASES.md#tc-can-024)、[TC-CAN-030](TEST_CASES.md#tc-can-030)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="f-can-028"></a>

### F-CAN-028 剪辑输入同步、来源身份与多素材组

**处置：保留；阶段：M5。** 剪辑已有上传/组输入、动态多组槽、按节点身份同步、删除记录与派生历史合并。

**来源：** [canvas:web/video_edit.js](../../web/video_edit.js)；[canvas:nodes/video_edit.py](../../nodes/video_edit.py)；[canvas:web/video_edit_model.mjs](../../web/video_edit_model.mjs)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `frontend/src/features/editor/input; backend/integrations/comfyui/nodes`

**理由：** 保留复杂但已明确的来源语义，不按文件路径错误合并不同节点。

**验收：**

- 不同节点引用同一文件仍是独立片段来源；重复同步不重复追加。
- 移除/重排一个组输入不丢其他组的编辑或删除记录。
- 上游重排不重排已编辑时间轴；手工删除不会被后续同步补回。

**关联：** [UC-CAN-010](USE_CASES.md#uc-can-010)；[TC-CAN-031](TEST_CASES.md#tc-can-031)、[TC-CAN-033](TEST_CASES.md#tc-can-033)

<a id="f-can-029"></a>

### F-CAN-029 单轨剪辑编辑、吸附与键盘逐帧操作

**处置：保留；阶段：M5。** 已有单轨图片/视频混排、裁剪、拖排、分割、复制、删除、播放头吸附和逐帧操作。

**来源：** [canvas:web/video_edit_model.mjs](../../web/video_edit_model.mjs)；[canvas:web/video_edit_panel.mjs](../../web/video_edit_panel.mjs)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `frontend/src/features/editor/timeline`

**理由：** 保留已界定单轨范围，避免迁移阶段扩成多轨编辑器。

**验收：**

- 图片默认 3 秒，片段最短一帧，裁剪不越视频源范围。
- 分割/复制/删除/排序结果可撤销，片段首尾相接。
- 吸附开关、10 屏幕像素阈值和逐帧键盘操作保持可预测。

**关联：** [UC-CAN-010](USE_CASES.md#uc-can-010)、[UC-CAN-011](USE_CASES.md#uc-can-011)；[TC-CAN-032](TEST_CASES.md#tc-can-032)

<a id="f-can-030"></a>

### F-CAN-030 时间轴预览、播放时钟与画面切换

**处置：重构；阶段：M5。** 面板已有播放、跳转、同源复用、下一段预载、等待画面时暂停时钟和页面内播放位置保留。

**来源：** [canvas:web/video_edit_panel.mjs](../../web/video_edit_panel.mjs)；[canvas:web/video_edit.js](../../web/video_edit.js)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `frontend/src/features/editor/preview`

**理由：** 将媒体加载与编辑状态分离，保证播放时钟和异步解码稳定。

**验收：**

- 选择片段与撤销不无故跳到片头，超出新时长时才限制到末尾。
- 画面未就绪时保留上一帧并暂停推进，不能空白闪烁或时钟越过待加载片段。
- 同源连续片段复用媒体；不同实例播放位置不共享。

**关联：** [UC-CAN-011](USE_CASES.md#uc-can-011)；[TC-CAN-034](TEST_CASES.md#tc-can-034)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="f-can-031"></a>

### F-CAN-031 低倍率预览副本、缓存与取消

**处置：保留；阶段：M5。** 后端已有 0.5/0.75/1 倍预览、串行转换锁、基于源信息复用缓存及过期清理。

**来源：** [canvas:nodes/video_edit.py:45](../../nodes/video_edit.py#L45)；[canvas:nodes/video_edit_media.py](../../nodes/video_edit_media.py)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `backend/media/previews; frontend/src/features/editor/preview`

**理由：** 保留实际低分辨率媒体路径，不以 CSS 缩小冒充解码优化。

**验收：**

- 只生成所选倍率，同源同倍率复用，源大小/修改时间变化后失效。
- 取消/断开/删除后旧预览不覆盖新选择；后台任务最终释放临时资源。
- 预览副本时长/时间映射不改变，原素材和导出规格不受倍率影响。

**关联：** [UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-012](USE_CASES.md#uc-can-012)；[TC-CAN-035](TEST_CASES.md#tc-can-035)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="f-can-032"></a>

### F-CAN-032 剪辑分辨率、画面适配与静音

**处置：保留；阶段：M5。** 已有按首素材的偶数尺寸/帧率推导、分辨率锁、片段 contain/cover 和静音。

**来源：** [canvas:web/video_edit_model.mjs](../../web/video_edit_model.mjs)；[canvas:web/video_edit_panel.mjs](../../web/video_edit_panel.mjs)；[canvas:nodes/video_edit_media.py](../../nodes/video_edit_media.py)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `frontend/src/features/editor/settings; backend/media/render`

**理由：** 同一编辑数据定义预览与导出，避免视觉正确而成片错误。

**验收：**

- 分辨率锁后替换/移除首片段保持尺寸，解锁后重新跟随；编码尺寸为合法偶数。
- 适配模式/静音按片段保存，复制和分割继承；图片静音操作禁用。
- 预览与实际导出构图和音轨行为一致。

**关联：** [UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-012](USE_CASES.md#uc-can-012)；[TC-CAN-036](TEST_CASES.md#tc-can-036)

<a id="f-can-033"></a>

### F-CAN-033 剪辑导出队列、进度、取消与错误恢复

**处置：重构；阶段：M5。** 现有剪辑以 ComfyUI 队列执行，前端按 prompt 身份跟踪导出并可取消。

**来源：** [canvas:web/video_edit.js](../../web/video_edit.js)；[canvas:nodes/video_edit.py:31](../../nodes/video_edit.py#L31)；[canvas:nodes/video_edit_media.py](../../nodes/video_edit_media.py)

**新归属：** `backend/jobs; backend/media/render; backend/integrations/comfyui; frontend/src/features/editor/export`

**理由：** 纳入统一后端任务账本，保留 ComfyUI 执行与任务身份隔离，不从 UI 缓存推断状态。

**验收：**

- 连续点击只创建一个有效导出任务；只提交该节点及其依赖。
- 错误/取消后可明确重试，旧任务不得结束或覆盖新任务。
- 输出文件完整后才标成功；进度、错误、取消和重启恢复有可核对任务记录。

**关联：** [UC-CAN-012](USE_CASES.md#uc-can-012)；[TC-CAN-037](TEST_CASES.md#tc-can-037)、[TC-CAN-038](TEST_CASES.md#tc-can-038)

<a id="f-can-034"></a>

### F-CAN-034 剪辑成片失效、连接门禁与素材输出

**处置：保留；阶段：M5。** 已有 edit_data 对应结果标识、旧结果失效、canConnectOutput 和原生 onConnectOutput 门禁。

**来源：** [canvas:web/video_edit.js](../../web/video_edit.js)；[canvas:web/creative_connections.mjs](../../web/creative_connections.mjs)；[canvas:nodes/video_edit.py:28](../../nodes/video_edit.py#L28)；[canvas:docs/video-edit.md](../../docs/video-edit.md)

**新归属：** `frontend/src/features/editor/output; frontend/src/contracts/assets; backend/media/results`

**理由：** 防止下游误用与当前编辑不匹配的成片，同时保留已有连接。

**验收：**

- 只有当前编辑成功导出的结果可新建下游连接。
- 编辑变化使旧成片引用失效但保留已有连接；等待时不得按空集合删下游编辑。
- VIDEO 与 COMFYTV_VIDEO 指向同一成片，输出素材复用同一本地引用。

**关联：** [UC-CAN-004](USE_CASES.md#uc-can-004)、[UC-CAN-012](USE_CASES.md#uc-can-012)；[TC-CAN-038](TEST_CASES.md#tc-can-038)

<a id="f-can-035"></a>

### F-CAN-035 ComfyTV 旧工作流的可选兼容

**处置：保留；阶段：M6。** 已有可选适配器读取公开 widget/执行事件，未导入或修改上游 Python，菜单隐藏旧分镜工作台入口。

**来源：** [canvas:web/adapters/comfytv.mjs](../../web/adapters/comfytv.mjs)；[canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)；[canvas:README.md:100](../../README.md#L100)

**新归属：** `frontend/src/integrations/comfyui/legacy; compat/workflows`

**理由：** 兼容既有工作流，但不把 ComfyTV 或其无关功能复制成产品依赖。

**验收：**

- 未安装 ComfyTV 时新产品基础功能完整且不出现失效入口。
- 安装时既有兼容节点能展示并保留真实注册/输出，不接管上游实现。
- 未知第三方节点保留其序列化数据并给出能力缺失报告，不静默删除。

**关联：** [UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-039](TEST_CASES.md#tc-can-039)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="f-can-036"></a>

### F-CAN-036 本地素材引用、路径边界与失效处理

**处置：保留；阶段：M2。** 后端已有 input/output 引用检查、目录包含校验和素材输出端点本机/Origin 检查。

**来源：** [canvas:nodes/material_output_files.py](../../nodes/material_output_files.py)；[canvas:nodes/material_output_api.py](../../nodes/material_output_api.py)；[canvas:nodes/video_edit_media.py](../../nodes/video_edit_media.py)；[canvas:web/media_upload_model.mjs](../../web/media_upload_model.mjs)

**新归属：** `backend/assets/references; backend/media; frontend/src/contracts/assets`

**理由：** 把安全与资产完整性放在统一边界，迁移不复制大文件、不持久化短期远程链接。

**验收：**

- 只接受被允许目录中的合法存在文件，拒绝目录穿越、任意路径和不支持类型。
- output 类型引用不会错误回退为 input；旧数据缺省 input 保持兼容。
- 文件丢失给出可定位错误，失败不创建空节点或损坏原素材。

**关联：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-007](USE_CASES.md#uc-can-007)、[UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-012](USE_CASES.md#uc-can-012)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-004](TEST_CASES.md#tc-can-004)、[TC-CAN-023](TEST_CASES.md#tc-can-023)、[TC-CAN-028](TEST_CASES.md#tc-can-028)、[TC-CAN-040](TEST_CASES.md#tc-can-040)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="f-can-037"></a>

### F-CAN-037 大画布资源预算与离屏媒体治理

**处置：重构；阶段：M2。** 现有画布/组/模式含 250/150/100ms 轮询，剪辑已有局部预览优化；未见统一大画布性能门槛。

**来源：** [canvas:web/creative_canvas_view.mjs:840](../../web/creative_canvas_view.mjs#L840)；[canvas:web/material_groups.mjs:249](../../web/material_groups.mjs#L249)；[canvas:web/creative_panel_state.mjs:13](../../web/creative_panel_state.mjs#L13)；[canvas:web/video_edit_panel.mjs](../../web/video_edit_panel.mjs)

**新归属：** `frontend/src/canvas/scheduler; frontend/src/application/lifecycle; tests/performance`

**理由：** 把更新合帧、可见范围与资源释放作为明确设计和验收项，以测量决定优化。

**验收：**

- 只对脏状态合帧更新，隐藏/销毁的视图不持续执行全量扫描。
- 建立指定机器与 100/500 节点、2000 收藏、长时间轴夹具的基线。
- 发布前满足批准的帧时延、响应、资源回收门槛；没有测量不宣称高性能。

**关联：** [UC-CAN-013](USE_CASES.md#uc-can-013)；[TC-CAN-041](TEST_CASES.md#tc-can-041)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="f-can-038"></a>

### F-CAN-038 宿主 API 兼容层与能力/版本诊断

**处置：重构；阶段：M1。** 当前模式菜单依赖宿主 DOM，历史直接访问 ChangeTracker 内部字段，README 未定义已验证最低版本。

**来源：** [canvas:web/creative_canvas.js:35](../../web/creative_canvas.js#L35)；[canvas:web/creative_history.mjs](../../web/creative_history.mjs)；[canvas:README.md:33](../../README.md#L33)

**新归属：** `frontend/src/integrations/comfyui; backend/integrations/comfyui; tests/host`

**理由：** 把可能随宿主变化的调用集中到薄适配层，通过能力探测和版本矩阵发现不兼容。

**验收：**

- 业务与通用组件禁止直接读宿主私有历史字段或菜单 DOM。
- 宿主缺少必要 API 时给出具体能力/版本诊断，不静默丢保存/撤销。
- 每个支持组合通过安装、两实例、模式往返、保存重载和核心流程验证。

**关联：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-001](TEST_CASES.md#tc-can-001)、[TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-042](TEST_CASES.md#tc-can-042)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="f-can-039"></a>

### F-CAN-039 本地字体图标、资源校验与组件陈列

**处置：保留；阶段：M1。** 已有本地字体/图标、许可证和字体 SHA-256 清单；frontend 为辅助 Vue 陈列，实际画布不依赖它运行。

**来源：** [canvas:web/vendor/alibaba-puhuiti-3/manifest.json](../../web/vendor/alibaba-puhuiti-3/manifest.json)；[canvas:web/vendor/remixicon/LICENSE](../../web/vendor/remixicon/LICENSE)；[canvas:tools/verify_assets.mjs](../../tools/verify_assets.mjs)；[canvas:frontend/package.json](../../frontend/package.json)；[canvas:README.md:82](../../README.md#L82)

**新归属：** `frontend/src/design; frontend/src/ui; tests/fixtures/components`

**理由：** 保留离线资源与统一陈列，避免为新库重复造一套演示实现。

**验收：**

- 离线环境字体/图标加载完整并保留许可证与来源清单。
- 陈列使用产品真实组件，状态样例覆盖交互而非另写行为副本。
- 组件构建和陈列通过仅作为辅助证据，实际宿主验收另记录。

**关联：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-013](USE_CASES.md#uc-can-013)、[UC-CAN-014](USE_CASES.md#uc-can-014)；[TC-CAN-043](TEST_CASES.md#tc-can-043)

## 表格分镜与生成能力

| 编号 | 能力 | 处置 | 阶段 | 用例数 | 测试数 |
| --- | --- | --- | --- | --- | --- |
| [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001) | 通用表格文档与稳定身份 | 保留 | M3 | 3 | 2 |
| [F-BIZ-002](FEATURE_MATRIX.md#f-biz-002) | 表格行的增删、复制、排序与选择 | 保留 | M3 | 1 | 2 |
| [F-BIZ-003](FEATURE_MATRIX.md#f-biz-003) | 字段类型、增删、改名、隐藏与列宽 | 保留 | M3 | 1 | 2 |
| [F-BIZ-004](FEATURE_MATRIX.md#f-biz-004) | 网格选择、文本编辑及复制粘贴 | 保留 | M3 | 2 | 1 |
| [F-BIZ-005](FEATURE_MATRIX.md#f-biz-005) | 文字与多媒体单元格、媒体预览和排序 | 保留 | M3 | 2 | 4 |
| [F-BIZ-006](FEATURE_MATRIX.md#f-biz-006) | 列头广播、按行填充及单格追加素材 | 保留 | M3 | 1 | 2 |
| [F-BIZ-007](FEATURE_MATRIX.md#f-biz-007) | 表格单素材复制到画布 | 保留 | M3 | 1 | 1 |
| [F-BIZ-008](FEATURE_MATRIX.md#f-biz-008) | 表格尺寸、浮动操作及空表删除行为 | 保留 | M3 | 2 | 3 |
| [F-BIZ-009](FEATURE_MATRIX.md#f-biz-009) | 业务面板生命周期、实例隔离与模式切换 | 重构 | M1 | 2 | 4 |
| [F-BIZ-010](FEATURE_MATRIX.md#f-biz-010) | 表级唯一提示词来源 | 保留 | M3 | 1 | 2 |
| [F-BIZ-011](FEATURE_MATRIX.md#f-biz-011) | 同行文本引用与稳定字段锚点 | 保留 | M3 | 1 | 2 |
| [F-BIZ-012](FEATURE_MATRIX.md#f-biz-012) | 同行媒体引用、素材 ID 与顺序 | 保留 | M3 | 2 | 2 |
| [F-BIZ-013](FEATURE_MATRIX.md#f-biz-013) | 整列模板、单行覆盖和首尾帧标记 | 保留 | M3 | 1 | 3 |
| [F-BIZ-014](FEATURE_MATRIX.md#f-biz-014) | 最终提示词预览与前后端编译一致性 | 保留 | M3 | 1 | 2 |
| [F-BIZ-015](FEATURE_MATRIX.md#f-biz-015) | 单格及整列提示词优化、审阅与应用 | 保留 | M3 | 1 | 2 |
| [F-BIZ-016](FEATURE_MATRIX.md#f-biz-016) | 优化模型设置、报价与凭据边界 | 重构 | M3 | 2 | 4 |
| [F-BIZ-017](FEATURE_MATRIX.md#f-biz-017) | 文本润色与图片反推提示词 | 重构 | M3 | 1 | 3 |
| [F-BIZ-018](FEATURE_MATRIX.md#f-biz-018) | DOCX 分镜原文读取与最终视图 | 保留 | M3 | 2 | 1 |
| [F-BIZ-019](FEATURE_MATRIX.md#f-biz-019) | 分镜字段映射、来源追踪与待分配图片 | 保留 | M3 | 2 | 2 |
| [F-BIZ-020](FEATURE_MATRIX.md#f-biz-020) | 文稿追加、去重、修订及原子导入 | 保留 | M3 | 1 | 2 |
| [F-BIZ-021](FEATURE_MATRIX.md#f-biz-021) | 既有通用文稿和表格文件导入 | 保留 | M3 | 1 | 1 |
| [F-BIZ-022](FEATURE_MATRIX.md#f-biz-022) | 可选 AI 文稿归类 | 保留 | M3 | 1 | 1 |
| [F-BIZ-023](FEATURE_MATRIX.md#f-biz-023) | 表内图片/视频生成列与提交范围 | 保留 | M4 | 2 | 1 |
| [F-BIZ-024](FEATURE_MATRIX.md#f-biz-024) | 外部生成节点与表格双向交换 | 重构 | M4 | 1 | 3 |
| [F-BIZ-025](FEATURE_MATRIX.md#f-biz-025) | 精确模型能力、参数与模式预检 | 重构 | M4 | 2 | 5 |
| [F-BIZ-026](FEATURE_MATRIX.md#f-biz-026) | Comfy 账户积分图片和视频生成 | 保留 | M4 | 1 | 4 |
| [F-BIZ-027](FEATURE_MATRIX.md#f-biz-027) | 本地 Qwen 图片生成 | 保留 | M4 | 2 | 3 |
| [F-BIZ-028](FEATURE_MATRIX.md#f-biz-028) | 本地 MiniMax H3 文生、首帧、首尾帧视频 | 保留 | M4 | 2 | 3 |
| [F-BIZ-029](FEATURE_MATRIX.md#f-biz-029) | 不可变输入快照、指纹与媒体冻结 | 保留 | M4 | 3 | 5 |
| [F-BIZ-030](FEATURE_MATRIX.md#f-biz-030) | 统一持久任务账本与恢复状态机 | 重构 | M4 | 4 | 5 |
| [F-BIZ-031](FEATURE_MATRIX.md#f-biz-031) | 原任务查询、结果下载恢复与结果完整性 | 重构 | M4 | 1 | 2 |
| [F-BIZ-032](FEATURE_MATRIX.md#f-biz-032) | 暂停、停止后续提交与本地中断 | 保留 | M4 | 1 | 1 |
| [F-BIZ-033](FEATURE_MATRIX.md#f-biz-033) | 结果写回、过期保护、历史结果与撤销隔离 | 保留 | M4 | 3 | 6 |
| [F-BIZ-034](FEATURE_MATRIX.md#f-biz-034) | 任务进度、失败分类与节点汇总 | 重构 | M4 | 3 | 2 |
| [F-BIZ-035](FEATURE_MATRIX.md#f-biz-035) | 云并发、本地串行与 GPU 资源协调 | 重构 | M4 | 2 | 4 |
| [F-BIZ-036](FEATURE_MATRIX.md#f-biz-036) | 生成结果预览、素材组输出与再次引用 | 保留 | M5 | 1 | 1 |
| [F-BIZ-037](FEATURE_MATRIX.md#f-biz-037) | 旧节点 ID、端口、工作流和记录兼容 | 重构 | M6 | 1 | 4 |
| [F-BIZ-038](FEATURE_MATRIX.md#f-biz-038) | 退役 LibTV 通道的历史只读兼容 | 重构 | M6 | 2 | 1 |
| [F-BIZ-039](FEATURE_MATRIX.md#f-biz-039) | 旧徽章与展厅业务 | 不迁入 | M6 | 1 | 1 |
| [F-BIZ-040](FEATURE_MATRIX.md#f-biz-040) | 旧布尔控制、分割与多边形工具 | 不迁入 | M6 | 1 | 1 |
| [F-BIZ-041](FEATURE_MATRIX.md#f-biz-041) | 同步表格来源与投影所有权 | 重构 | M3 | 2 | 2 |
| [F-BIZ-042](FEATURE_MATRIX.md#f-biz-042) | 原生生成节点输出与已完成结果读取 | 保留 | M4 | 1 | 2 |
| [F-BIZ-043](FEATURE_MATRIX.md#f-biz-043) | LLM 优化节点的多源输入与审阅后输出 | 保留 | M3 | 1 | 1 |
| [F-BIZ-044](FEATURE_MATRIX.md#f-biz-044) | 旧独立分镜生成与 LLM 样式原型的收敛 | 重构 | M6 | 1 | 1 |

<a id="f-biz-001"></a>

### F-BIZ-001 通用表格文档与稳定身份

**处置：保留；阶段：M3。** 源码已存在；表格以 fields/records/meta 保存，字段、记录和素材具有 ID。

**来源：** [business:web/data_table_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_model.mjs)；[business:nodes/daelab_comfytv_storyboard/table_node.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/table_node.py)

**新归属：** `frontend/src/features/table; backend/contracts/table`

**理由：** 保留成熟数据语义，通过单一编辑命令写回原生图的序列化数据。

**验收：**

- 字段、记录和素材身份不以名称、行号或 URL 替代。
- 保存重载保留未知兼容字段；不建立与原生图并行可写的文档副本。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-004](USE_CASES.md#uc-biz-004)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-001](TEST_CASES.md#tc-biz-001)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)

<a id="f-biz-002"></a>

### F-BIZ-002 表格行的增删、复制、排序与选择

**处置：保留；阶段：M3。** 源码已存在；复制行清理生成任务身份与结果。

**来源：** [business:web/data_table_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_model.mjs)；[business:web/data_table_editor.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_editor.mjs)

**新归属：** `frontend/src/features/table`

**理由：** 保留编辑行为，明确复制与执行身份分离。

**验收：**

- 复制行产生新记录及素材实例身份，不继承原任务执行权。
- 删除、排序和复制分别可撤销，其他表格实例不变。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)；[TC-BIZ-001](TEST_CASES.md#tc-biz-001)、[TC-BIZ-002](TEST_CASES.md#tc-biz-002)

<a id="f-biz-003"></a>

### F-BIZ-003 字段类型、增删、改名、隐藏与列宽

**处置：保留；阶段：M3。** 源码已存在；支持 content/text/longtext/number/checkbox/select/assets/json 等字段与展示用途。

**来源：** [business:web/data_table_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_model.mjs)；[business:web/data_table_editor.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_editor.mjs)；[business:web/table_column_splitters.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_column_splitters.mjs)

**新归属：** `frontend/src/features/table`

**理由：** 字段类型、生成用途和提示词来源必须保持独立概念。

**验收：**

- 改名、排序和隐藏不改变稳定 ID 或引用指向。
- 类型转换失败不部分写入；列宽在重载后保留。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)；[TC-BIZ-001](TEST_CASES.md#tc-biz-001)、[TC-BIZ-003](TEST_CASES.md#tc-biz-003)

<a id="f-biz-004"></a>

### F-BIZ-004 网格选择、文本编辑及复制粘贴

**处置：保留；阶段：M3。** 源码已存在；内容展示与编辑态、表内范围选择、TSV/自有剪贴板格式并存。

**来源：** [business:web/data_table_editor.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_editor.mjs)；[business:web/table_content_view.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_content_view.mjs)；[business:web/data_table_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_model.mjs)

**新归属：** `frontend/src/features/table`

**理由：** 保留中文输入和表格选择优先级，统一编辑事务。

**验收：**

- 输入框内多行粘贴不误变成多条记录。
- Shift/Ctrl 表格选择不被画布抢占；非法粘贴不部分修改。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-004](USE_CASES.md#uc-biz-004)；[TC-BIZ-004](TEST_CASES.md#tc-biz-004)

<a id="f-biz-005"></a>

### F-BIZ-005 文字与多媒体单元格、媒体预览和排序

**处置：保留；阶段：M3。** 当前 fillMaterialCell 支持向 content 格追加多个素材；历史文档有单素材限制描述，需核对实际 UI 后冻结基线。

**来源：** [business:web/table_material_columns.mjs:44](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_material_columns.mjs#L44)；[business:web/table_content_view.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_content_view.mjs)；[business:web/data_table_editor.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_editor.mjs)；[business:docs/table-material-columns.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/table-material-columns.md)

**新归属：** `frontend/src/features/table; frontend/src/features/assets`

**理由：** 以当前代码和真实 UI 对照消除规范漂移，首版不擅自缩减现有数据。

**验收：**

- 一个格中的多个历史素材无损加载；顺序与素材 ID 保留。
- 悬停预览不改变格宽高；视频关闭预览暂停；缺失媒体保留错误占位。

**关联：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-006](TEST_CASES.md#tc-biz-006)、[TC-BIZ-007](TEST_CASES.md#tc-biz-007)、[TC-BIZ-008](TEST_CASES.md#tc-biz-008)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)

<a id="f-biz-006"></a>

### F-BIZ-006 列头广播、按行填充及单格追加素材

**处置：保留；阶段：M3。** 源码已存在：单图/视频/文本填满现有列，多个按序填入并补行；行头横向填充，单格追加。

**来源：** [business:web/table_material_columns.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_material_columns.mjs)；[business:web/creative_canvas_adapter.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_canvas_adapter.js)

**新归属：** `frontend/src/features/table; frontend/src/application`

**理由：** 保持一次快照语义，不借迁移引入隐藏的持续同步。

**验收：**

- 单个素材广播且空表创建一行；多个素材不覆盖未涉及尾行。
- 非法媒体或超过 500 行/64 列当前边界时整次拒绝；空集合不清空。

**关联：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)；[TC-BIZ-005](TEST_CASES.md#tc-biz-005)、[TC-BIZ-006](TEST_CASES.md#tc-biz-006)

<a id="f-biz-007"></a>

### F-BIZ-007 表格单素材复制到画布

**处置：保留；阶段：M3。** 源码已存在；通过公开 materialItem/beginMaterialDrag 接入画布。

**来源：** [business:web/table_material_item.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_material_item.mjs)；[business:web/data_table_editor.mjs:90](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_editor.mjs#L90)；[business:web/creative_canvas_adapter.js:17](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_canvas_adapter.js#L17)

**新归属：** `frontend/src/application; frontend/src/features/table`

**理由：** 复用统一素材契约，避免表格直接创建宿主私有对象。

**验收：**

- 拖到空白画布保留源单元格、文件引用和显示名称。
- 复制可撤销；异步上传/解析结束前验证源快照仍有效。

**关联：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)；[TC-BIZ-009](TEST_CASES.md#tc-biz-009)

<a id="f-biz-008"></a>

### F-BIZ-008 表格尺寸、浮动操作及空表删除行为

**处置：保留；阶段：M3。** 源码已存在；内容表与旧工作台呈现不同；创建默认值已变为素材列、提示词/生成列和 3 行，与旧 2×2 文档不一致。

**来源：** [business:web/table_material_columns.mjs:5](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_material_columns.mjs#L5)；[business:web/table_content_view.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_content_view.mjs)；[business:web/data_table_nodes.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_nodes.mjs)；[business:web/creative_canvas_adapter.js:39](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_canvas_adapter.js#L39)；[business:docs/table-material-columns.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/table-material-columns.md)

**新归属：** `frontend/src/features/table; frontend/src/ui`

**理由：** 先用真实 UI 和当前规范冻结默认模板，禁止按旧文档直接改写现有体验。

**验收：**

- 明确记录默认创建结构的源码/规范差异和最终批准基线。
- 调整宽度、长表自然撑高和边缘菜单均可达；仅通用画布表删除最后行/列时删节点并可撤销。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-010](TEST_CASES.md#tc-biz-010)、[TC-BIZ-011](TEST_CASES.md#tc-biz-011)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)

<a id="f-biz-009"></a>

### F-BIZ-009 业务面板生命周期、实例隔离与模式切换

**处置：重构；阶段：M1。** 源码已存在；当前同时覆盖 Canvas、原生图和 App Mode，并有跨仓控件 fallback。

**来源：** [business:web/app_mode_bypass.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/app_mode_bypass.js)；[business:web/app_mode_bypass_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/app_mode_bypass_model.mjs)；[business:web/data_table_nodes.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_nodes.mjs)；[business:web/table_controls.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_controls.mjs)

**新归属：** `frontend/src/integrations/comfyui; frontend/src/application`

**理由：** 单包消除跨仓 fallback，保留现有宿主模式和实例语义。

**验收：**

- 两实例的文档、弹层、媒体播放与任务订阅互不串扰。
- Mute/Bypass 隐藏并释放活动交互，Active 恢复原状态；卸载释放全部监听和轮询。

**关联：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-008](TEST_CASES.md#tc-biz-008)、[TC-BIZ-012](TEST_CASES.md#tc-biz-012)、[TC-BIZ-039](TEST_CASES.md#tc-biz-039)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)

<a id="f-biz-010"></a>

### F-BIZ-010 表级唯一提示词来源

**处置：保留；阶段：M3。** 源码已存在：meta.generationInput 保存唯一 promptFieldId；一致旧显式绑定才迁移。

**来源：** [business:web/table_prompt_source.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_source.mjs)；[business:nodes/daelab_comfytv_storyboard/table_source.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/table_source.py)；[business:docs/table-prompt-source.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/table-prompt-source.md)

**新归属：** `frontend/src/features/prompt; backend/contracts/table`

**理由：** 保留明确来源，禁止用列名或列顺序猜测生成输入。

**验收：**

- 同一表最多一个来源；取消/删除来源后新提交被阻止。
- 改名/隐藏不丢绑定；复制列不复制来源标记；旧冲突绑定必须提示选择。

**关联：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)；[TC-BIZ-003](TEST_CASES.md#tc-biz-003)、[TC-BIZ-013](TEST_CASES.md#tc-biz-013)

<a id="f-biz-011"></a>

### F-BIZ-011 同行文本引用与稳定字段锚点

**处置：保留；阶段：M3。** 源码已存在；菜单插入字段 ID，普通粘贴 @列名仍为文本。

**来源：** [business:web/table_prompt_template.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_template.mjs)；[business:web/table_prompt_source.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_source.mjs)；[business:nodes/daelab_comfytv_storyboard/prompt_compiler.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/prompt_compiler.py)

**新归属：** `frontend/src/features/prompt; backend/prompt`

**理由：** 保持前后端相同的引用展开与失效规则。

**验收：**

- 更名、重排后引用仍展开同行同字段。
- 拒绝递归、自引用、空值、失效类型与删除字段；不悄悄回退到别列。

**关联：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)；[TC-BIZ-003](TEST_CASES.md#tc-biz-003)、[TC-BIZ-014](TEST_CASES.md#tc-biz-014)

<a id="f-biz-012"></a>

### F-BIZ-012 同行媒体引用、素材 ID 与顺序

**处置：保留；阶段：M3。** 源码已存在；单行引用使用 assetId，模板按行对应位置初始化并在移动前固定绑定。

**来源：** [business:web/table_prompt_template.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_template.mjs)；[business:web/table_video_references.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_video_references.mjs)；[business:nodes/daelab_comfytv_storyboard/video_references.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/video_references.py)

**新归属：** `frontend/src/features/prompt; backend/prompt`

**理由：** 避免移动或重排素材后引用误指向新文件。

**验收：**

- 同一行内跨列移动/排序后引用跟随素材 ID。
- 跨行移动或删除显示失效；媒体引用顺序与执行输入一致。

**关联：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)、[UC-BIZ-005](USE_CASES.md#uc-biz-005)；[TC-BIZ-007](TEST_CASES.md#tc-biz-007)、[TC-BIZ-015](TEST_CASES.md#tc-biz-015)

<a id="f-biz-013"></a>

### F-BIZ-013 整列模板、单行覆盖和首尾帧标记

**处置：保留；阶段：M3。** 源码已存在；设置和提示词内联帧标记共用结构；恢复模板与清空覆盖使用不同兼容值。

**来源：** [business:web/table_prompt_template.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_template.mjs)；[business:web/table_generation_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_panel.mjs)；[business:web/table_generation_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_model.mjs)

**新归属：** `frontend/src/features/prompt; frontend/src/features/generation`

**理由：** 保留列默认与行覆盖优先级以及帧标记语义。

**验收：**

- 修改模板不覆盖显式行覆盖；清空和恢复模板行为可区分。
- 首尾帧选择/交换/清除后内联标记与提交绑定一致，标记不进入纯文本提示词。

**关联：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)；[TC-BIZ-015](TEST_CASES.md#tc-biz-015)、[TC-BIZ-016](TEST_CASES.md#tc-biz-016)、[TC-BIZ-029](TEST_CASES.md#tc-biz-029)

<a id="f-biz-014"></a>

### F-BIZ-014 最终提示词预览与前后端编译一致性

**处置：保留；阶段：M3。** 源码已存在；表格、解析器和外部生成节点共享展开输入与后端校验。

**来源：** [business:web/table_prompt_template.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_template.mjs)；[business:web/table_exchange.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_exchange.mjs)；[business:nodes/daelab_comfytv_storyboard/prompt_compiler.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/prompt_compiler.py)；[business:nodes/daelab_comfytv_storyboard/prompt_service.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/prompt_service.py)

**新归属：** `frontend/src/features/prompt; backend/prompt`

**理由：** 预览必须表达实际执行输入，不能维护另一套展示编译器。

**验收：**

- 同夹具在预览、导出、后端编译得到相同文本和素材顺序。
- 缺引用/非法模式预检失败，且无生成提交。

**关联：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)；[TC-BIZ-014](TEST_CASES.md#tc-biz-014)、[TC-BIZ-017](TEST_CASES.md#tc-biz-017)

<a id="f-biz-015"></a>

### F-BIZ-015 单格及整列提示词优化、审阅与应用

**处置：保留；阶段：M3。** 源码已存在；支持生成建议后手动应用、修订保护和批量撤销。

**来源：** [business:web/prompt_optimization_controller.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/prompt_optimization_controller.mjs)；[business:web/prompt_optimization_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/prompt_optimization_panel.mjs)；[business:web/prompt_optimization_workflow_history.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/prompt_optimization_workflow_history.mjs)；[business:docs/table-column-optimization.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/table-column-optimization.md)

**新归属：** `frontend/src/features/prompt; backend/prompt`

**理由：** 优化结果与原文分开，保留用户明确应用及失效保护。

**验收：**

- 未应用不改变表格；整次应用可一步撤销/重做。
- 过期结果、已删除行、修改后输入不能直接覆盖；成功/失败/跳过分别计数。

**关联：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)；[TC-BIZ-018](TEST_CASES.md#tc-biz-018)、[TC-BIZ-019](TEST_CASES.md#tc-biz-019)

<a id="f-biz-016"></a>

### F-BIZ-016 优化模型设置、报价与凭据边界

**处置：重构；阶段：M3。** 源码已存在：Comfy 原生 GPT、DeepSeek、自有本地 Qwen；表格优化账本有报价和预算快照。

**来源：** [business:nodes/prompt_optimization/service.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/service.py)；[business:nodes/prompt_optimization/pricing.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/pricing.py)；[business:nodes/prompt_optimization/deepseek.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/deepseek.py)；[business:nodes/prompt_optimization/api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/api.py)

**新归属：** `backend/prompt; backend/providers; frontend/src/features/prompt`

**理由：** 统一提供方能力与认证边界，保留既有费用确认、报价和恢复保护。

**验收：**

- 能力/报价与提交快照一致；过期报价重新确认而非继续提交。
- 本地模型请求不带云凭据；工作流、回执、日志不保存密钥。

**关联：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)、[UC-BIZ-007](USE_CASES.md#uc-biz-007)；[TC-BIZ-020](TEST_CASES.md#tc-biz-020)、[TC-BIZ-035](TEST_CASES.md#tc-biz-035)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)、[TC-BIZ-048](TEST_CASES.md#tc-biz-048)

<a id="f-biz-017"></a>

### F-BIZ-017 文本润色与图片反推提示词

**处置：重构；阶段：M3。** 源码已存在；独立画布入口目前以进程内字典保存最多 256 条请求，重启后不保留。

**来源：** [business:nodes/prompt_optimization/canvas.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/canvas.py)；[business:web/llm_style_preview_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview_panel.mjs)；[business:tests/test_canvas_polish.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_canvas_polish.py)

**新归属：** `frontend/src/features/prompt; backend/prompt; backend/jobs`

**理由：** 保留功能并迁到统一持久任务协议，消除重启丢失防重记录的独立路径。

**验收：**

- 润色与图片反推使用用户选定的真实来源；非法/过大图片拒绝。
- 服务重启后同一请求不因记录丢失重复调用；不明结果进入待处理状态。
- M3交付输入、审阅与应用流程；统一账本及服务重启不重复调用由M4 TC-BIZ-021验收。

**关联：** [UC-BIZ-007](USE_CASES.md#uc-biz-007)；[TC-BIZ-021](TEST_CASES.md#tc-biz-021)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)、[TC-BIZ-048](TEST_CASES.md#tc-biz-048)

<a id="f-biz-018"></a>

### F-BIZ-018 DOCX 分镜原文读取与最终视图

**处置：保留；阶段：M3。** 源码已存在；解析修订后最终可见内容、合并单元格、来源行和图片出现位置。

**来源：** [business:nodes/daelab_comfytv_storyboard/script_document.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_document.py)；[business:nodes/daelab_comfytv_storyboard/script_contract.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_contract.py)；[business:docs/script-parser.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/script-parser.md)

**新归属：** `backend/storyboard; frontend/src/features/storyboard`

**理由：** 文稿原文和来源是用户数据资产，不能以重写解析器丢失。

**验收：**

- 插入修订保留、删除修订排除；合并锚点保留且物理行不误合并。
- 文档有坏图仍保留文字与错误定位；不擅自补写镜头内容。

**关联：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)、[UC-BIZ-008](USE_CASES.md#uc-biz-008)；[TC-BIZ-022](TEST_CASES.md#tc-biz-022)

<a id="f-biz-019"></a>

### F-BIZ-019 分镜字段映射、来源追踪与待分配图片

**处置：保留；阶段：M3。** 源码已存在；原文、inventory、未分配图片及映射随文档保存。

**来源：** [business:web/script_parser_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/script_parser_model.mjs)；[business:web/script_parser_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/script_parser_panel.mjs)；[business:nodes/daelab_comfytv_storyboard/script_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_api.py)；[business:docs/script-parser.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/script-parser.md)

**新归属：** `frontend/src/features/storyboard; backend/storyboard`

**理由：** 避免把无法定位的图片强塞到错误分镜，保留可复查来源。

**验收：**

- 同一图片多次出现保留多个实例及顺序；表外图片保留待分配项。
- 刷新后可查看原文并调整映射，不依赖 temp 缓存；缺 inventory 的旧文件明确提示补充。

**关联：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)、[UC-BIZ-008](USE_CASES.md#uc-biz-008)；[TC-BIZ-023](TEST_CASES.md#tc-biz-023)、[TC-BIZ-026](TEST_CASES.md#tc-biz-026)

<a id="f-biz-020"></a>

### F-BIZ-020 文稿追加、去重、修订及原子导入

**处置：保留；阶段：M3。** 源码已存在；文档指纹加来源定位去重，映射调整保护手工编辑与生成结果。

**来源：** [business:web/script_parser_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/script_parser_model.mjs)；[business:web/script_parser_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/script_parser_panel.mjs)；[business:nodes/daelab_comfytv_storyboard/script_contract.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_contract.py)

**新归属：** `frontend/src/features/storyboard; frontend/src/application`

**理由：** 保留用户编辑与生成身份，导入作为一个可撤销事务。

**验收：**

- 重复导入不重复行；内容变更的新文档版本可追踪。
- 读入期间表格变化、容量超限或类型冲突整次拒绝；活动任务期间不改写其输入快照。

**关联：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)；[TC-BIZ-023](TEST_CASES.md#tc-biz-023)、[TC-BIZ-024](TEST_CASES.md#tc-biz-024)

<a id="f-biz-021"></a>

### F-BIZ-021 既有通用文稿和表格文件导入

**处置：保留；阶段：M3。** 源码已存在；既有入口接收 DOCX/XLSX/XLSM/CSV/TSV/TXT/MD/PDF，支持程度以解析器与夹具核定。

**来源：** [business:nodes/daelab_comfytv_storyboard/document_import.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/document_import.py)；[business:web/data_table_nodes.mjs:111](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_nodes.mjs#L111)；[business:nodes/daelab_comfytv_storyboard/import_node.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/import_node.py)

**新归属：** `backend/storyboard; frontend/src/features/storyboard`

**理由：** 迁移现有可用格式，不把扩展名列表当所有复杂文档已通过。

**验收：**

- 逐格式提供正常、空、损坏和结构异常夹具并记录支持限制。
- 导入错误不覆盖当前表；引用图片入资产管理而不是内嵌临时路径。

**关联：** [UC-BIZ-004](USE_CASES.md#uc-biz-004)；[TC-BIZ-025](TEST_CASES.md#tc-biz-025)

<a id="f-biz-022"></a>

### F-BIZ-022 可选 AI 文稿归类

**处置：保留；阶段：M3。** 源码已存在；通过私有后端配置调用兼容服务，仅显式归类选中文本，不发送图片。

**来源：** [business:nodes/daelab_comfytv_storyboard/script_ai.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_ai.py)；[business:nodes/daelab_comfytv_storyboard/script_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/script_api.py)；[business:docs/script-parser.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/script-parser.md)

**新归属：** `backend/storyboard; backend/providers; frontend/src/features/storyboard`

**理由：** 保留手工完整流程，AI 仅提供受约束分类建议。

**验收：**

- 无配置仍能完成导入；未点击归类无外部请求。
- 返回不得增删来源、跨行或改写原文，非法返回保留原草稿。

**关联：** [UC-BIZ-008](USE_CASES.md#uc-biz-008)；[TC-BIZ-026](TEST_CASES.md#tc-biz-026)

<a id="f-biz-023"></a>

### F-BIZ-023 表内图片/视频生成列与提交范围

**处置：保留；阶段：M4。** 源码已存在；整列、选中行及单行入口共享生成任务。

**来源：** [business:web/table_generation_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_model.mjs)；[business:web/table_generation_panel.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_panel.mjs)；[business:web/table_generation_tasks.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs)

**新归属：** `frontend/src/features/generation; backend/generation`

**理由：** 表内生成是完整创作闭环的主要入口，不能只保留外部生成节点。

**验收：**

- 选中行优先，否则仅选有效空结果行；提交前显示范围且全批预检。
- 列配置草稿在点击生成时生效；恢复原任务使用原快照。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-012](USE_CASES.md#uc-biz-012)；[TC-BIZ-027](TEST_CASES.md#tc-biz-027)

<a id="f-biz-024"></a>

### F-BIZ-024 外部生成节点与表格双向交换

**处置：重构；阶段：M4。** 源码已存在；生成节点接收表格、文本和帧素材，并以稳定行/列身份同步。

**来源：** [business:web/table_exchange.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_exchange.mjs)；[business:web/libtv_panel.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/libtv_panel.js)；[business:web/libtv_video_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/libtv_video_model.mjs)；[business:web/video_task_linked_prompt.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/video_task_linked_prompt.mjs)

**新归属：** `frontend/src/features/generation; frontend/src/application`

**理由：** 与表内入口共用同一生成应用服务，保留两种工作方式。

**验收：**

- 导入表格保留行、来源、帧绑定和节点专属输入。
- 修改/撤销只同步匹配字段；源断开/删除时阻止新提交，不覆盖已有结果。

**关联：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)；[TC-BIZ-017](TEST_CASES.md#tc-biz-017)、[TC-BIZ-028](TEST_CASES.md#tc-biz-028)、[TC-BIZ-049](TEST_CASES.md#tc-biz-049)

<a id="f-biz-025"></a>

### F-BIZ-025 精确模型能力、参数与模式预检

**处置：重构；阶段：M4。** 源码已存在；云端与本地有各自能力映射，当前包含精确 Fast/Mini 等型号与 H3 三模式。

**来源：** [business:nodes/libtv_bridge/table_comfy_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_comfy_video.py)；[business:nodes/libtv_bridge/table_comfy_image.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_comfy_image.py)；[business:nodes/libtv_bridge/table_local_models.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_models.py)；[business:web/table_prompt_settings.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_prompt_settings.mjs)

**新归属：** `backend/providers; backend/contracts/generation; frontend/src/features/generation`

**理由：** 参数模型与提供方能力统一管理，禁止静默选替代型号。

**验收：**

- 前后端拒绝不支持参数、缺帧、错媒体类型和不存在模型。
- 本地/云端切换只按明确规则迁移兼容设置，不保留无效隐藏参数。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-010](USE_CASES.md#uc-biz-010)；[TC-BIZ-027](TEST_CASES.md#tc-biz-027)、[TC-BIZ-029](TEST_CASES.md#tc-biz-029)、[TC-BIZ-031](TEST_CASES.md#tc-biz-031)、[TC-BIZ-032](TEST_CASES.md#tc-biz-032)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)

<a id="f-biz-026"></a>

### F-BIZ-026 Comfy 账户积分图片和视频生成

**处置：保留；阶段：M4。** 源码已存在；经原生 Comfy API 节点执行，旧 LibTV 服务已退役；本清单不声明真实付费输出验收。

**来源：** [business:nodes/libtv_bridge/table_comfy_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_comfy_video.py)；[business:nodes/libtv_bridge/table_comfy_image.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_comfy_image.py)；[business:docs/comfy-credit-generation.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/comfy-credit-generation.md)

**新归属：** `backend/providers/comfy_partner; backend/integrations/comfyui`

**理由：** 继续依托 ComfyUI 的执行和认证，单仓库不内置第二套 Comfy 引擎。

**验收：**

- 未登录、未知型号或非法参数在入队前失败。
- 认证仅传入 sensitive 数据；本轮云端通道只用假服务验证协议，真实输出、费用和水印效果保持未验收，不作为迁移退出门槛。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)；[TC-BIZ-020](TEST_CASES.md#tc-biz-020)、[TC-BIZ-030](TEST_CASES.md#tc-biz-030)、[TC-BIZ-035](TEST_CASES.md#tc-biz-035)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)

<a id="f-biz-027"></a>

### F-BIZ-027 本地 Qwen 图片生成

**处置：保留；阶段：M4。** 源码已存在；依赖已安装模型和 Comfy 节点，缺依赖需清晰预检。

**来源：** [business:nodes/libtv_bridge/table_local_image.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_image.py)；[business:nodes/libtv_bridge/table_local_models.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_models.py)；[business:docs/table-local-qwen.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/table-local-qwen.md)

**新归属：** `backend/providers/local_image; backend/integrations/comfyui`

**理由：** 迁移模型工作流构建与校验，不把模型权重和 GPU 环境视为单包自带。

**验收：**

- 缺模型/节点不下载替代物或入队；提示确切缺项。
- 本地任务使用同一账本并串行调度；输出校验为真实存在的 output 文件。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)；[TC-BIZ-031](TEST_CASES.md#tc-biz-031)、[TC-BIZ-041](TEST_CASES.md#tc-biz-041)、[TC-BIZ-047](TEST_CASES.md#tc-biz-047)

<a id="f-biz-028"></a>

### F-BIZ-028 本地 MiniMax H3 文生、首帧、首尾帧视频

**处置：保留；阶段：M4。** 源码已存在；三模式分别构图，媒体数量和不支持的参考视频/音频会被拒绝。

**来源：** [business:nodes/libtv_bridge/table_local_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_video.py)；[business:nodes/libtv_bridge/table_local_execution.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_execution.py)；[business:tests/test_table_local_h3.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_h3.py)

**新归属：** `backend/providers/local_video; backend/integrations/comfyui`

**理由：** 保留已明确的模式语义与帧绑定，避免迁移时降成一个模糊视频入口。

**验收：**

- 三模式分别接受 0/1/2 张图且不静默切模式。
- 真实本地执行需单独记录设备、模型与输出；mock 或 validate_prompt 不冒充执行成功。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)；[TC-BIZ-032](TEST_CASES.md#tc-biz-032)、[TC-BIZ-041](TEST_CASES.md#tc-biz-041)、[TC-BIZ-047](TEST_CASES.md#tc-biz-047)

<a id="f-biz-029"></a>

### F-BIZ-029 不可变输入快照、指纹与媒体冻结

**处置：保留；阶段：M4。** 源码已存在；生成前计算输入指纹、文件哈希并冻结素材。

**来源：** [business:nodes/libtv_bridge/media_snapshot.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/media_snapshot.py)；[business:nodes/libtv_bridge/table_generation_api.py:140](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py#L140)；[business:nodes/libtv_bridge/runtime.py:74](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/runtime.py#L74)

**新归属：** `backend/contracts/generation; backend/jobs; backend/assets`

**理由：** 这是防止重复计费和恢复时输入漂移的核心，不应在重构中丢弃。

**验收：**

- 同 requestId 同输入复用原记录，不同输入明确拒绝。
- 源文件替换后旧任务仍指向冻结版本；凭据不进入指纹或快照。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-002](TEST_CASES.md#tc-biz-002)、[TC-BIZ-024](TEST_CASES.md#tc-biz-024)、[TC-BIZ-033](TEST_CASES.md#tc-biz-033)、[TC-BIZ-038](TEST_CASES.md#tc-biz-038)、[TC-BIZ-043](TEST_CASES.md#tc-biz-043)

<a id="f-biz-030"></a>

### F-BIZ-030 统一持久任务账本与恢复状态机

**处置：重构；阶段：M4。** 当前生成为原子 JSON 回执、表格优化为 SQLite 账本、画布润色为内存缓存；尚非统一任务服务。

**来源：** [business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)；[business:nodes/prompt_optimization/service.py:140](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/service.py#L140)；[business:nodes/prompt_optimization/canvas.py:12](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/canvas.py#L12)

**新归属：** `backend/jobs; frontend/src/features/tasks`

**理由：** 统一权威任务记录，前端/工作流仅保留引用和展示缓存。

**验收：**

- 每个状态转移、请求和执行身份均可追踪；重启不重置防重依据。
- 提交响应未知独立于失败；没有可查询远端 ID 时禁止自动新提交。

**关联：** [UC-BIZ-007](USE_CASES.md#uc-biz-007)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-012](USE_CASES.md#uc-biz-012)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-021](TEST_CASES.md#tc-biz-021)、[TC-BIZ-033](TEST_CASES.md#tc-biz-033)、[TC-BIZ-034](TEST_CASES.md#tc-biz-034)、[TC-BIZ-035](TEST_CASES.md#tc-biz-035)、[TC-BIZ-040](TEST_CASES.md#tc-biz-040)

<a id="f-biz-031"></a>

### F-BIZ-031 原任务查询、结果下载恢复与结果完整性

**处置：重构；阶段：M4。** 源码已存在；恢复已有执行与下载分开，缺失本地结果和不明任务有显式处理。

**来源：** [business:nodes/libtv_bridge/recovery.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/recovery.py)；[business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)；[business:nodes/libtv_bridge/table_local_execution.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_execution.py)

**新归属：** `backend/jobs; backend/providers; backend/assets`

**理由：** 把当前可靠恢复语义收敛到统一服务并保留有界重试。

**验收：**

- 下载失败恢复仅查询/下载原结果，不再次创建生成。
- 文件缺失/变化不标成功；后端重启后 running 无 worker 进入待恢复。

**关联：** [UC-BIZ-011](USE_CASES.md#uc-biz-011)；[TC-BIZ-036](TEST_CASES.md#tc-biz-036)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)

<a id="f-biz-032"></a>

### F-BIZ-032 暂停、停止后续提交与本地中断

**处置：保留；阶段：M4。** 源码已存在：本地当前任务可中断并在继续时重跑当前行；云端已提交任务继续完成。

**来源：** [business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)；[business:nodes/libtv_bridge/table_local_execution.py:34](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_execution.py#L34)；[business:web/table_generation_tasks.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs)

**新归属：** `backend/jobs; backend/integrations/comfyui; frontend/src/features/tasks`

**理由：** 保留不同执行器的真实取消能力，禁止将停止等待队列宣传为撤销远端费用。

**验收：**

- 暂停只影响指定请求/批次；其他实例继续运行。
- 本地继续创建明确的新原生执行记录；云端恢复关联原执行。

**关联：** [UC-BIZ-012](USE_CASES.md#uc-biz-012)；[TC-BIZ-037](TEST_CASES.md#tc-biz-037)

<a id="f-biz-033"></a>

### F-BIZ-033 结果写回、过期保护、历史结果与撤销隔离

**处置：保留；阶段：M4。** 源码已存在；结果按请求/行/列/输入戳写回，历史结果可显式追加。

**来源：** [business:web/table_generation_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_model.mjs)；[business:web/table_generation_tasks.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs)；[business:web/table_generation_history.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_history.mjs)

**新归属：** `frontend/src/application; frontend/src/features/generation; backend/jobs`

**理由：** 编辑历史不能倒退不可撤销的外部执行事实。

**验收：**

- 删除/改动目标或切换工作流后旧响应不覆盖当前内容。
- 历史结果按任务身份去重；撤销编辑不删除服务端账本或触发重复生成。

**关联：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-013](USE_CASES.md#uc-biz-013)；[TC-BIZ-002](TEST_CASES.md#tc-biz-002)、[TC-BIZ-019](TEST_CASES.md#tc-biz-019)、[TC-BIZ-036](TEST_CASES.md#tc-biz-036)、[TC-BIZ-038](TEST_CASES.md#tc-biz-038)、[TC-BIZ-042](TEST_CASES.md#tc-biz-042)、[TC-BIZ-049](TEST_CASES.md#tc-biz-049)

<a id="f-biz-034"></a>

### F-BIZ-034 任务进度、失败分类与节点汇总

**处置：重构；阶段：M4。** 源码已存在；任务纯快照展示，生成每实例轮询 3 秒，优化/文稿各有提供者。

**来源：** [business:web/task_snapshots.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/task_snapshots.mjs)；[business:web/table_generation_tasks.mjs:178](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs#L178)；[business:docs/architecture/NODE_TASKS.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/NODE_TASKS.md)

**新归属：** `frontend/src/features/tasks; backend/jobs`

**理由：** 统一订阅和错误模型，减少实例级重复轮询但保留真实进度语义。

**验收：**

- 只有提供方报告百分比时显示百分比，其余显示阶段/计数。
- 完成/失败/跳过/过期分开；刷新历史成功不反复发完成通知。

**关联：** [UC-BIZ-013](USE_CASES.md#uc-biz-013)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-039](TEST_CASES.md#tc-biz-039)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)

<a id="f-biz-035"></a>

### F-BIZ-035 云并发、本地串行与 GPU 资源协调

**处置：重构；阶段：M4。** 源码已存在：表格云预算 32、本地 1；native_admission 目前从优化模块提供，宿主进程内调度。

**来源：** [business:nodes/libtv_bridge/table_generation_api.py:22](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py#L22)；[business:nodes/libtv_bridge/table_local_execution.py:54](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_execution.py#L54)；[business:nodes/prompt_optimization/local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/local_qwen.py)

**新归属：** `backend/jobs; backend/integrations/comfyui`

**理由：** 抽出公共资源协调；当前数字只作为盘点基线，新预算经测量确定。

**验收：**

- 跨表/节点共享预算，单行失败不阻塞无关任务。
- 本地 Qwen 与原生 GPU 入队遵守同一资源租约，卸载失败隔离并给出恢复动作。

**关联：** [UC-BIZ-012](USE_CASES.md#uc-biz-012)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)；[TC-BIZ-037](TEST_CASES.md#tc-biz-037)、[TC-BIZ-040](TEST_CASES.md#tc-biz-040)、[TC-BIZ-041](TEST_CASES.md#tc-biz-041)、[TC-BIZ-047](TEST_CASES.md#tc-biz-047)

<a id="f-biz-036"></a>

### F-BIZ-036 生成结果预览、素材组输出与再次引用

**处置：保留；阶段：M5。** 源码已存在；结果按行/任务输出有序素材，表格和生成节点通过公开 adapter 提供素材。

**来源：** [business:web/table_material_output.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_material_output.mjs)；[business:web/libtv_video_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/libtv_video_model.mjs)；[business:web/creative_canvas_adapter.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_canvas_adapter.js)

**新归属：** `frontend/src/features/assets; frontend/src/application`

**理由：** 打通生成到编辑/剪辑的闭环，复用真实文件引用。

**验收：**

- 每任务独立成组、按任务名命名并保持结果顺序；空结果跳过。
- 输出复制不移动原结果；已完成结果可作为后续提示词参考。

**关联：** [UC-BIZ-013](USE_CASES.md#uc-biz-013)；[TC-BIZ-042](TEST_CASES.md#tc-biz-042)

<a id="f-biz-037"></a>

### F-BIZ-037 旧节点 ID、端口、工作流和记录兼容

**处置：重构；阶段：M6。** 源码已存在；当前继续使用 DAELAB.Table、StoryboardImport、ScriptParser、LibTV.VideoGenerate 等旧 ID。

**来源：** [business:nodes/daelab_comfytv_storyboard/__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/__init__.py)；[business:nodes/libtv_bridge/node.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/node.py)；[business:web/creative_canvas_adapter.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_canvas_adapter.js)；[business:docs/client-workflow-foundation.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/client-workflow-foundation.md)

**新归属：** `compat/workflows; compat/legacy; backend/integrations/comfyui`

**理由：** 内部命名清理与外部兼容分离，单包注册唯一节点拥有者。

**验收：**

- 已发布 ID、槽位顺序和 widget 序列无损读取，必要新增端口只追加。
- 同机旧库冲突可识别；迁移后的单包不依赖旧仓库路径。

**关联：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-013](TEST_CASES.md#tc-biz-013)、[TC-BIZ-034](TEST_CASES.md#tc-biz-034)、[TC-BIZ-043](TEST_CASES.md#tc-biz-043)、[TC-BIZ-050](TEST_CASES.md#tc-biz-050)

<a id="f-biz-038"></a>

### F-BIZ-038 退役 LibTV 通道的历史只读兼容

**处置：重构；阶段：M6。** 源码明确禁用旧 LibTV CLI 与批量执行；完成结果保留，未完成旧任务不得恢复生成。

**来源：** [business:nodes/libtv_bridge/runtime.py:56](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/runtime.py#L56)；[business:nodes/libtv_bridge/node.py:113](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/node.py#L113)；[business:nodes/libtv_bridge/__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/__init__.py)；[business:docs/comfy-credit-generation.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/comfy-credit-generation.md)

**新归属：** `compat/legacy; backend/jobs`

**理由：** 保留数据而不恢复已退役服务；新云任务必须显式选择现支持通道。

**验收：**

- 旧完成回执和素材可查看/导出。
- 旧 waiting/running/unknown 恢复不启动 CLI、不入 Comfy 队列、不静默转收费任务。

**关联：** [UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-044](TEST_CASES.md#tc-biz-044)

<a id="f-biz-039"></a>

### F-BIZ-039 旧徽章与展厅业务

**处置：不迁入；阶段：M6。** 业务根入口仍注册徽章各阶段、材质、蒙版和展厅提示词等独立业务。

**来源：** [business:__init__.py:17](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L17)；[business:__init__.py:29](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L29)；[business:__init__.py:85](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L85)；[business:docs/architecture/SCOPE.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/SCOPE.md)

**新归属：** `旧业务仓库保留；新库无对应模块`

**理由：** 不属于创作画布当前产品范围，避免把历史业务带进新单包。

**验收：**

- 新包导入/注册/构建不依赖徽章或展厅模块。
- 旧项目仍可在原环境运行；新库不承诺这些节点的迁移。

**关联：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-050](TEST_CASES.md#tc-biz-050)

<a id="f-biz-040"></a>

### F-BIZ-040 旧布尔控制、分割与多边形工具

**处置：不迁入；阶段：M6。** 业务根入口仍注册布尔层级/组旁路、SAM3 和 PolygonMask 等节点。

**来源：** [business:__init__.py:1](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L1)；[business:__init__.py:73](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L73)；[business:__init__.py:77](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L77)；[business:__init__.py:81](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py#L81)；[business:docs/architecture/SCOPE.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/SCOPE.md)

**新归属：** `旧业务仓库保留；新库无对应模块`

**理由：** 仅提取创作功能确实需要且独立的公共逻辑，不携带整套旧工具。

**验收：**

- 新包依赖扫描无这些业务模块和其专用资产。
- 遇到含此类节点的混合旧工作流明确报告外部依赖，不静默删除节点。

**关联：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-050](TEST_CASES.md#tc-biz-050)

<a id="f-biz-041"></a>

### F-BIZ-041 同步表格来源与投影所有权

**处置：重构；阶段：M3。** 源码已存在；liveSource 保留源字段/行身份，投影任务不拥有远端回执轮询权。

**来源：** [business:web/table_exchange.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_exchange.mjs)；[business:web/table_generation_tasks.mjs:74](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs#L74)；[business:web/data_table_nodes.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/data_table_nodes.mjs)

**新归属：** `frontend/src/application; frontend/src/features/table; frontend/src/contracts`

**理由：** 把单向派生与双向允许编辑的边界显式化，避免持续回写与撤销污染。

**验收：**

- 只有拥有生成列的文档对账该任务；只读投影不重复轮询。
- 源断开保留来源身份并禁用定位/新提交；恢复连接不覆盖手工允许编辑的字段。

**关联：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)；[TC-BIZ-028](TEST_CASES.md#tc-biz-028)、[TC-BIZ-049](TEST_CASES.md#tc-biz-049)

<a id="f-biz-042"></a>

### F-BIZ-042 原生生成节点输出与已完成结果读取

**处置：保留；阶段：M4。** 源码已存在；旧 VideoGenerate 原生 execute 已禁止直接调用 LibTV，读取面板已完成结果。

**来源：** [business:nodes/libtv_bridge/node.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/node.py)；[business:web/libtv_video_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/libtv_video_model.mjs)；[business:tests/libtv_canvas_result.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/libtv_canvas_result.test.mjs)；[business:docs/comfy-credit-generation.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/comfy-credit-generation.md)

**新归属：** `backend/integrations/comfyui; frontend/src/features/generation; compat/legacy`

**理由：** 单包仍是 ComfyUI 扩展，原生图的类型化输出与创作面板保持一致。

**验收：**

- 无完成结果、结果来源变化或文件缺失时返回明确错误而非悄悄生成。
- 已完成结果通过原槽位输出，输出不会触发第二次付费请求。

**关联：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)；[TC-BIZ-030](TEST_CASES.md#tc-biz-030)、[TC-BIZ-042](TEST_CASES.md#tc-biz-042)

<a id="f-biz-043"></a>

### F-BIZ-043 LLM 优化节点的多源输入与审阅后输出

**处置：保留；阶段：M3。** LLMStylePreviewB 是当前生产入口，支持文本、图片、素材组、表格和其他输入，提供结果与逐行结果两个输出；后端执行只读已应用结果。

**来源：** [business:web/llm_style_preview.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview.js)；[business:web/llm_slot_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_slot_model.mjs)；[business:web/llm_io_model.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_io_model.mjs)；[business:nodes/prompt_optimization/approved_result.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/approved_result.py)；[business:docs/architecture/LLM_SLOT_IO.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/LLM_SLOT_IO.md)

**新归属：** `frontend/src/features/prompt; frontend/src/application; backend/prompt; backend/integrations/comfyui`

**理由：** 不能把生产 LLM 节点缩减为一次性润色弹窗；保留组合输入、逐行身份和显式审阅。

**验收：**

- 多源输入按稳定身份读取；不得因缺来源取其他预览作替代。
- 只有应用后的结果可接线；逐行结果保留唯一行 ID；原生执行不触发模型调用。

**关联：** [UC-BIZ-007](USE_CASES.md#uc-biz-007)；[TC-BIZ-048](TEST_CASES.md#tc-biz-048)

<a id="f-biz-044"></a>

### F-BIZ-044 旧独立分镜生成与 LLM 样式原型的收敛

**处置：重构；阶段：M6。** GPTImageStoryboardStage 当前仍有 Comfy 图片执行实现；LLM A/C/D/E 为前端虚拟样式原型。新库只读兼容/显式转换是拟定收敛决策，并非当前都已退役。

**来源：** [business:nodes/daelab_comfytv_storyboard/node.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/node.py)；[business:web/llm_style_preview.js:12](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview.js#L12)；[business:web/llm_style_preview.js:58](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview.js#L58)

**新归属：** `compat/workflows; compat/legacy`

**理由：** 分镜生成统一到通用表格/生成服务，原型数据可导入，避免生产继续暴露多套重叠执行入口。

**验收：**

- 旧分镜表/结果/输入可读取并预览转换差异，用户显式转换后才启用新生成入口。
- A/C/D/E 不作为新包生产节点注册；可恢复数据并显式转换到 B，不静默丢弃原型内容。

**关联：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)；[TC-BIZ-050](TEST_CASES.md#tc-biz-050)

## 产品基础与跨模块能力

| 编号 | 能力 | 处置 | 阶段 | 用例数 | 测试数 |
| --- | --- | --- | --- | --- | --- |
| [F-SYS-001](FEATURE_MATRIX.md#f-sys-001) | 单仓库单安装入口 | 重构 | M1 | 2 | 3 |
| [F-SYS-002](FEATURE_MATRIX.md#f-sys-002) | 模块边界与公开接口 | 重构 | M1 | 2 | 1 |
| [F-SYS-003](FEATURE_MATRIX.md#f-sys-003) | 共享组件与同源陈列 | 保留 | M1 | 2 | 1 |
| [F-SYS-004](FEATURE_MATRIX.md#f-sys-004) | 产品文档与发布状态管理 | 重构 | M0 | 1 | 2 |
| [F-SYS-005](FEATURE_MATRIX.md#f-sys-005) | 文档与执行状态的权威归属 | 重构 | M1 | 2 | 6 |
| [F-SYS-006](FEATURE_MATRIX.md#f-sys-006) | 宿主版本适配与历史桥接 | 重构 | M1 | 3 | 3 |
| [F-SYS-007](FEATURE_MATRIX.md#f-sys-007) | 统一持久任务账本 | 重构 | M4 | 3 | 6 |
| [F-SYS-008](FEATURE_MATRIX.md#f-sys-008) | 后端资产目录与旧收藏迁移 | 重构 | M2 | 2 | 4 |
| [F-SYS-009](FEATURE_MATRIX.md#f-sys-009) | 可选能力与配置隔离 | 重构 | M1 | 2 | 4 |
| [F-SYS-010](FEATURE_MATRIX.md#f-sys-010) | 分资源调度与背压 | 重构 | M4 | 3 | 3 |
| [F-SYS-011](FEATURE_MATRIX.md#f-sys-011) | 诊断与错误合同 | 重构 | M1 | 2 | 2 |
| [F-SYS-012](FEATURE_MATRIX.md#f-sys-012) | 性能预算与资源释放 | 重构 | M5 | 1 | 7 |
| [F-SYS-013](FEATURE_MATRIX.md#f-sys-013) | 旧工作流稳定合同 | 保留 | M6 | 2 | 3 |
| [F-SYS-014](FEATURE_MATRIX.md#f-sys-014) | 版本化数据迁移与备份 | 重构 | M6 | 2 | 8 |
| [F-SYS-015](FEATURE_MATRIX.md#f-sys-015) | 新旧包冲突检测 | 重构 | M1 | 2 | 1 |
| [F-SYS-016](FEATURE_MATRIX.md#f-sys-016) | 可重复构建与单版本发布 | 重构 | M6 | 4 | 5 |
| [F-SYS-017](FEATURE_MATRIX.md#f-sys-017) | 完整创作流程验收 | 重构 | M5 | 2 | 3 |
| [F-SYS-018](FEATURE_MATRIX.md#f-sys-018) | 可选ComfyTV公开兼容 | 保留 | M2 | 1 | 1 |
| [F-SYS-019](FEATURE_MATRIX.md#f-sys-019) | 结果未知与断点恢复 | 保留 | M4 | 2 | 6 |
| [F-SYS-020](FEATURE_MATRIX.md#f-sys-020) | 文件范围与敏感数据边界 | 保留 | M2 | 2 | 3 |
| [F-SYS-021](FEATURE_MATRIX.md#f-sys-021) | 旧库退出与数据回滚 | 重构 | M6 | 3 | 4 |

<a id="f-sys-001"></a>

### F-SYS-001 单仓库单安装入口

**处置：重构；阶段：M1。** 当前两个仓库各自注册节点与扩展，完整创作依赖组合安装

**来源：** [canvas:__init__.py](../../__init__.py)；[business:__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py)

**新归属：** `__init__.py; backend/integrations/comfyui; frontend/src/integrations/comfyui`

**理由：** 统一产品组装与版本，消除跨包发现与 fallback

**验收：**

- 干净环境只安装新包即可使用基础创作能力；节点、路由和菜单各注册一次

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-007](USE_CASES.md#uc-sys-007)；[TC-SYS-001](TEST_CASES.md#tc-sys-001)、[TC-SYS-007](TEST_CASES.md#tc-sys-007)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-sys-002"></a>

### F-SYS-002 模块边界与公开接口

**处置：重构；阶段：M1。** 已有公开 adapter 和分层草案，部分代码仍直接读取宿主及私有状态

**来源：** [canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)；[business:docs/architecture/phase1/BOUNDARIES.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/phase1/BOUNDARIES.md)

**新归属：** `frontend/src/contracts; frontend/src/application; backend/contracts`

**理由：** 将文档约束落实为依赖检查与消费方契约

**验收：**

- 非法跨层导入、循环依赖和旧仓库 URL 被检查阻止

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-011](USE_CASES.md#uc-sys-011)；[TC-SYS-003](TEST_CASES.md#tc-sys-003)

<a id="f-sys-003"></a>

### F-SYS-003 共享组件与同源陈列

**处置：保留；阶段：M1。** 共享按钮、字段、主题及辅助陈列已存在

**来源：** [canvas:docs/architecture/CONTRIBUTING_CONTROLS.md](../../docs/architecture/CONTRIBUTING_CONTROLS.md)；[canvas:web/creative_button.mjs](../../web/creative_button.mjs)；[canvas:web/creative_field.mjs](../../web/creative_field.mjs)

**新归属：** `frontend/src/design; frontend/src/ui; frontend/showcase`

**理由：** 保留成熟控件，统一来源与生命周期

**验收：**

- 修改一个共享控件后两个产品实例及陈列同步变化，实例值不共享

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-002](USE_CASES.md#uc-sys-002)；[TC-SYS-004](TEST_CASES.md#tc-sys-004)

<a id="f-sys-004"></a>

### F-SYS-004 产品文档与发布状态管理

**处置：重构；阶段：M0。** 安装入口和专题说明含不同日期的历史状态

**来源：** [canvas:README.md](../../README.md)；[canvas:docs/migration.md](../../docs/migration.md)；[business:docs/architecture/SCOPE.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/SCOPE.md)

**新归属：** `docs/product; docs/architecture; docs/validation; docs/releases`

**理由：** 一个当前安装入口，功能与案例可追踪

**验收：**

- 每个纳入功能有实现所有者、阶段、UC/TC和验收状态；历史说明不冒充当前要求

**关联：** [UC-SYS-011](USE_CASES.md#uc-sys-011)；[TC-SYS-003](TEST_CASES.md#tc-sys-003)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-sys-005"></a>

### F-SYS-005 文档与执行状态的权威归属

**处置：重构；阶段：M1。** 原生图是保存来源，运行事实已有独立回执但前端存在多种缓存

**来源：** [canvas:README.md](../../README.md)；[canvas:docs/task-contract.md](../../docs/task-contract.md)；[business:docs/architecture/phase1/BOUNDARIES.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/phase1/BOUNDARIES.md)

**新归属：** `frontend/src/application; backend/jobs; frontend/src/integrations/comfyui`

**理由：** 避免平行可写图和撤销回退执行事实

**验收：**

- 保存重载不保存瞬时忙碌；撤销不重新提交或取消真实任务；旧回调不跨工作流写入

**关联：** [UC-SYS-002](USE_CASES.md#uc-sys-002)、[UC-SYS-003](USE_CASES.md#uc-sys-003)；[TC-SYS-004](TEST_CASES.md#tc-sys-004)、[TC-SYS-005](TEST_CASES.md#tc-sys-005)、[TC-SYS-006](TEST_CASES.md#tc-sys-006)、[TC-SYS-008](TEST_CASES.md#tc-sys-008)、[TC-SYS-027](TEST_CASES.md#tc-sys-027)、[TC-SYS-032](TEST_CASES.md#tc-sys-032)

<a id="f-sys-006"></a>

### F-SYS-006 宿主版本适配与历史桥接

**处置：重构；阶段：M1。** 历史桥接访问 ChangeTracker 内部状态

**来源：** [canvas:web/creative_history.mjs](../../web/creative_history.mjs)；[canvas:web/creative_canvas.js](../../web/creative_canvas.js)

**新归属：** `frontend/src/integrations/comfyui`

**理由：** 将宿主内部依赖集中并建立支持版本矩阵

**验收：**

- 最低及默认宿主的历史、模式入口、保存与重载全部通过；不支持版本给出明确诊断

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-002](USE_CASES.md#uc-sys-002)、[UC-SYS-009](USE_CASES.md#uc-sys-009)；[TC-SYS-005](TEST_CASES.md#tc-sys-005)、[TC-SYS-022](TEST_CASES.md#tc-sys-022)、[TC-SYS-031](TEST_CASES.md#tc-sys-031)

<a id="f-sys-007"></a>

### F-SYS-007 统一持久任务账本

**处置：重构；阶段：M4。** JSON生成回执、SQLite优化账本及内存缓存并存

**来源：** [business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)；[business:nodes/prompt_optimization/service.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/service.py)；[business:nodes/prompt_optimization/canvas.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/canvas.py)

**新归属：** `backend/jobs; compat/legacy`

**理由：** 统一身份、状态、输入快照、事件与恢复语义

**验收：**

- 导入旧记录不 create；重启后保留可核对的远端身份；相同ID不同输入拒绝

**关联：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-004](USE_CASES.md#uc-sys-004)、[UC-SYS-008](USE_CASES.md#uc-sys-008)；[TC-SYS-006](TEST_CASES.md#tc-sys-006)、[TC-SYS-013](TEST_CASES.md#tc-sys-013)、[TC-SYS-016](TEST_CASES.md#tc-sys-016)、[TC-SYS-017](TEST_CASES.md#tc-sys-017)、[TC-SYS-032](TEST_CASES.md#tc-sys-032)、[TC-SYS-035](TEST_CASES.md#tc-sys-035)

<a id="f-sys-008"></a>

### F-SYS-008 后端资产目录与旧收藏迁移

**处置：重构；阶段：M2。** 媒体文件在 input/output，收藏目录在浏览器 origin localStorage

**来源：** [canvas:docs/asset-library.md](../../docs/asset-library.md)；[canvas:web/asset_library_model.mjs](../../web/asset_library_model.mjs)

**新归属：** `backend/assets; compat/legacy; frontend/src/features/assets`

**理由：** 使收藏与资产来源可备份和迁移

**验收：**

- 不同origin旧目录可显式导入、去重并保留文本快照；缺失媒体可见且不创建空节点

**关联：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-010](TEST_CASES.md#tc-sys-010)、[TC-SYS-013](TEST_CASES.md#tc-sys-013)、[TC-SYS-032](TEST_CASES.md#tc-sys-032)、[TC-SYS-035](TEST_CASES.md#tc-sys-035)

<a id="f-sys-009"></a>

### F-SYS-009 可选能力与配置隔离

**处置：重构；阶段：M1。** 业务根入口混合导入，提供方依赖与连接状态有不同入口

**来源：** [business:__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py)；[business:docs/comfy-credit-generation.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/comfy-credit-generation.md)；[business:docs/prompt-optimization-environment.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/prompt-optimization-environment.md)

**新归属：** `backend/providers; backend/integrations/comfyui; frontend/src/application`

**理由：** 可选依赖失败不拖垮核心安装

**验收：**

- 无密钥/无模型/无ComfyTV时核心可启动；对应执行入口给出具体不可用原因

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-007](USE_CASES.md#uc-sys-007)；[TC-SYS-001](TEST_CASES.md#tc-sys-001)、[TC-SYS-007](TEST_CASES.md#tc-sys-007)、[TC-SYS-033](TEST_CASES.md#tc-sys-033)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)

<a id="f-sys-010"></a>

### F-SYS-010 分资源调度与背压

**处置：重构；阶段：M4。** 生成已有本地/云并发限制及本地准入，归属分散

**来源：** [business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)；[business:nodes/libtv_bridge/table_local_execution.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_local_execution.py)

**新归属：** `backend/jobs; backend/media; backend/providers`

**理由：** 统一GPU、云请求和转码队列，避免相互阻塞

**验收：**

- 峰值并发不超过配置；取消排队不派发；不同资源任务不无限饥饿

**关联：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-008](USE_CASES.md#uc-sys-008)、[UC-SYS-010](USE_CASES.md#uc-sys-010)；[TC-SYS-018](TEST_CASES.md#tc-sys-018)、[TC-SYS-019](TEST_CASES.md#tc-sys-019)、[TC-SYS-028](TEST_CASES.md#tc-sys-028)

<a id="f-sys-011"></a>

### F-SYS-011 诊断与错误合同

**处置：重构；阶段：M1。** 各功能已有错误提示和日志，缺少单产品诊断入口

**来源：** [canvas:nodes/material_output_api.py](../../nodes/material_output_api.py)；[business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)

**新归属：** `backend/contracts; backend/jobs; tools`

**理由：** 提供可定位的用户错误与脱敏诊断

**验收：**

- 按请求ID能关联提交/恢复/下载；错误含可恢复动作；导出诊断不含凭据

**关联：** [UC-SYS-004](USE_CASES.md#uc-sys-004)、[UC-SYS-009](USE_CASES.md#uc-sys-009)；[TC-SYS-021](TEST_CASES.md#tc-sys-021)、[TC-SYS-022](TEST_CASES.md#tc-sys-022)

<a id="f-sys-012"></a>

### F-SYS-012 性能预算与资源释放

**处置：重构；阶段：M5。** 已有释放机制及多处轮询，尚无统一性能预算

**来源：** [canvas:web/creative_canvas_view.mjs](../../web/creative_canvas_view.mjs)；[canvas:web/creative_panel_state.mjs](../../web/creative_panel_state.mjs)；[business:web/table_generation_tasks.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_generation_tasks.mjs)

**新归属：** `frontend/src/canvas; frontend/src/application; tests/performance`

**理由：** 以固定场景度量响应、内存和任务订阅

**验收：**

- 达到TEST_STRATEGY PERF-01至07；关闭实例资源计数回基线

**关联：** [UC-SYS-010](USE_CASES.md#uc-sys-010)；[TC-SYS-023](TEST_CASES.md#tc-sys-023)、[TC-SYS-024](TEST_CASES.md#tc-sys-024)、[TC-SYS-025](TEST_CASES.md#tc-sys-025)、[TC-SYS-026](TEST_CASES.md#tc-sys-026)、[TC-SYS-027](TEST_CASES.md#tc-sys-027)、[TC-SYS-028](TEST_CASES.md#tc-sys-028)、[TC-SYS-029](TEST_CASES.md#tc-sys-029)

<a id="f-sys-013"></a>

### F-SYS-013 旧工作流稳定合同

**处置：保留；阶段：M6。** 节点ID、槽位、material JSON、画布状态与剪贴板均有兼容约束

**来源：** [canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)；[canvas:AGENTS.md](../../AGENTS.md)

**新归属：** `compat/workflows; frontend/src/integrations/comfyui`

**理由：** 内部重构不破坏已有创作文件

**验收：**

- 导入编辑保存重开保持ID/槽位/顺序/未知字段；未迁节点报告并保留原件

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-006](USE_CASES.md#uc-sys-006)；[TC-SYS-008](TEST_CASES.md#tc-sys-008)、[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-025](TEST_CASES.md#tc-sys-025)

<a id="f-sys-014"></a>

### F-SYS-014 版本化数据迁移与备份

**处置：重构；阶段：M6。** 已有拆库迁移说明，未形成统一新产品迁移器

**来源：** [canvas:docs/migration.md](../../docs/migration.md)；[business:docs/architecture/phase1/BOUNDARIES.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/architecture/phase1/BOUNDARIES.md)

**新归属：** `compat/workflows; compat/legacy; tools`

**理由：** 新增可预检、可重试且保护原数据的迁移流程

**验收：**

- dry-run无写入；迁移重复不重复数据；中途失败可恢复；原始数据和清单可验证

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-006](USE_CASES.md#uc-sys-006)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-010](TEST_CASES.md#tc-sys-010)、[TC-SYS-011](TEST_CASES.md#tc-sys-011)、[TC-SYS-012](TEST_CASES.md#tc-sys-012)、[TC-SYS-013](TEST_CASES.md#tc-sys-013)、[TC-SYS-014](TEST_CASES.md#tc-sys-014)、[TC-SYS-015](TEST_CASES.md#tc-sys-015)、[TC-SYS-035](TEST_CASES.md#tc-sys-035)

<a id="f-sys-015"></a>

### F-SYS-015 新旧包冲突检测

**处置：重构；阶段：M1。** 历史拆库已出现同名映射与前端入口重复风险

**来源：** [canvas:docs/migration.md](../../docs/migration.md)；[canvas:__init__.py](../../__init__.py)；[business:__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/__init__.py)

**新归属：** `backend/integrations/comfyui; frontend/src/integrations/comfyui; tools`

**理由：** 不依赖加载顺序接管注册

**验收：**

- 冲突时指出旧包与处理方法，不删除目录，不启动两份可写面板

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-002](TEST_CASES.md#tc-sys-002)

<a id="f-sys-016"></a>

### F-SYS-016 可重复构建与单版本发布

**处置：重构；阶段：M6。** 当前两个独立CI；正式画布与辅助构建入口分离

**来源：** [canvas:.github/workflows/checks.yml](../../.github/workflows/checks.yml)；[business:.github/workflows/integration-checks.yml](../../../ComfyUI-DAELab-Custom-Nodes-Library/.github/workflows/integration-checks.yml)

**新归属：** `package.json; pyproject.toml; web; .github/workflows; docs/releases`

**理由：** 前后端、静态资源与schema作为一个产品发行

**验收：**

- 清洁检出构建相同资产清单；安装包无需用户npm构建；版本不匹配被诊断

**关联：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-006](USE_CASES.md#uc-sys-006)、[UC-SYS-009](USE_CASES.md#uc-sys-009)、[UC-SYS-011](USE_CASES.md#uc-sys-011)；[TC-SYS-001](TEST_CASES.md#tc-sys-001)、[TC-SYS-015](TEST_CASES.md#tc-sys-015)、[TC-SYS-022](TEST_CASES.md#tc-sys-022)、[TC-SYS-030](TEST_CASES.md#tc-sys-030)、[TC-SYS-031](TEST_CASES.md#tc-sys-031)

<a id="f-sys-017"></a>

### F-SYS-017 完整创作流程验收

**处置：重构；阶段：M5。** 已有分散用例和历史验收记录

**来源：** [canvas:docs/validation.md](../../docs/validation.md)；[business:docs/integration-20261023.md](../../../ComfyUI-DAELab-Custom-Nodes-Library/docs/integration-20261023.md)

**新归属：** `tests/host; tests/integration; docs/validation`

**理由：** 按用户完成创作的流程验收而非仅按模块

**验收：**

- 分镜到生成到剪辑导出再保存重开完整通过；真实生成仅本地Qwen/MiniMax，假提供方与本地实测分别记录。

**关联：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-011](USE_CASES.md#uc-sys-011)；[TC-SYS-029](TEST_CASES.md#tc-sys-029)、[TC-SYS-032](TEST_CASES.md#tc-sys-032)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)

<a id="f-sys-018"></a>

### F-SYS-018 可选ComfyTV公开兼容

**处置：保留；阶段：M2。** 已有只读上游适配与兼容类型

**来源：** [canvas:web/adapters/comfytv.mjs](../../web/adapters/comfytv.mjs)；[canvas:docs/adapter-contract.md](../../docs/adapter-contract.md)；[canvas:README.md](../../README.md)

**新归属：** `frontend/src/integrations/comfyui; compat/legacy`

**理由：** 保留已声明的可选兼容，不捆绑上游

**验收：**

- 无上游不显示不可用入口；有上游只使用声明能力，文件与注册未被改写

**关联：** [UC-SYS-007](USE_CASES.md#uc-sys-007)；[TC-SYS-033](TEST_CASES.md#tc-sys-033)

<a id="f-sys-019"></a>

### F-SYS-019 结果未知与断点恢复

**处置：保留；阶段：M4。** 当前生成与优化已有unknown/needs_recovery保护

**来源：** [business:nodes/prompt_optimization/service.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/service.py)；[business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)

**新归属：** `backend/jobs; backend/providers`

**理由：** 保留防止重复付费与恢复原任务的成熟语义

**验收：**

- 断响应、刷新、重启和下载中断均不多次create；不支持查询时保持unknown

**关联：** [UC-SYS-004](USE_CASES.md#uc-sys-004)、[UC-SYS-008](USE_CASES.md#uc-sys-008)；[TC-SYS-006](TEST_CASES.md#tc-sys-006)、[TC-SYS-014](TEST_CASES.md#tc-sys-014)、[TC-SYS-016](TEST_CASES.md#tc-sys-016)、[TC-SYS-017](TEST_CASES.md#tc-sys-017)、[TC-SYS-018](TEST_CASES.md#tc-sys-018)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)

<a id="f-sys-020"></a>

### F-SYS-020 文件范围与敏感数据边界

**处置：保留；阶段：M2。** 素材导入与提供方输入已有路径/类型校验

**来源：** [canvas:nodes/material_output_api.py](../../nodes/material_output_api.py)；[business:nodes/libtv_bridge/table_generation_api.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py)

**新归属：** `backend/assets; backend/contracts; backend/providers`

**理由：** 迁移后继续服务端校验，保护用户本地文件和凭据

**验收：**

- 目录穿越、越界引用、畸形输入被拒绝；日志和工作流不保存凭据；原素材不受失败影响

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-009](USE_CASES.md#uc-sys-009)；[TC-SYS-011](TEST_CASES.md#tc-sys-011)、[TC-SYS-020](TEST_CASES.md#tc-sys-020)、[TC-SYS-021](TEST_CASES.md#tc-sys-021)

<a id="f-sys-021"></a>

### F-SYS-021 旧库退出与数据回滚

**处置：重构；阶段：M6。** 已有拆库回滚说明，新产品尚无完整切换演练

**来源：** [canvas:docs/migration.md](../../docs/migration.md)

**新归属：** `tools; compat; docs/releases`

**理由：** 达到单库维护目标并保留可恢复的历史状态

**验收：**

- 新包运行不加载旧库；回滚能恢复旧数据；新产生且旧版不识别的数据独立保全

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-006](USE_CASES.md#uc-sys-006)、[UC-SYS-011](USE_CASES.md#uc-sys-011)；[TC-SYS-012](TEST_CASES.md#tc-sys-012)、[TC-SYS-014](TEST_CASES.md#tc-sys-014)、[TC-SYS-015](TEST_CASES.md#tc-sys-015)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

## 不迁入的历史功能

| 编号 | 能力 | 处置 | 阶段 | 用例数 | 测试数 |
| --- | --- | --- | --- | --- | --- |
| [F-OUT-001](FEATURE_MATRIX.md#f-out-001) | 展厅专用提示词、风格库与旧展厅 App Mode | 不迁入 | M0 | 1 | 2 |
| [F-OUT-002](FEATURE_MATRIX.md#f-out-002) | 徽章早期设计、合成、局部编辑与状态存档流水线 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-003](FEATURE_MATRIX.md#f-out-003) | 徽章 87/88 应用、区域编辑器与专用执行界面 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-004](FEATURE_MATRIX.md#f-out-004) | 徽章路由、颜色 ID 与局部选择控制节点 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-005](FEATURE_MATRIX.md#f-out-005) | 徽章高度层、浮雕结构与渲染空间对齐 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-006](FEATURE_MATRIX.md#f-out-006) | 徽章材质目录、材质区域、颜色锁定与语义合成 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-007](FEATURE_MATRIX.md#f-out-007) | 分割、抠图、颜色掩膜、多边形与 BBox 工具节点 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-008](FEATURE_MATRIX.md#f-out-008) | 布尔列表、层级列表与旧分组 Bypass 控制节点 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-009](FEATURE_MATRIX.md#f-out-009) | 旧独立模型配置节点和 App Mode 上传壳 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-010](FEATURE_MATRIX.md#f-out-010) | 已退役的 LibTV 云通道、登录桥与旧批量执行 | 不迁入 | M6 | 1 | 3 |
| [F-OUT-011](FEATURE_MATRIX.md#f-out-011) | LLM A/C/D/E 样式原型及生产界面的演示内容 | 不迁入 | M0 | 1 | 3 |
| [F-OUT-012](FEATURE_MATRIX.md#f-out-012) | ComfyTV 上游实现与上游节点注册 | 不迁入 | M0 | 1 | 3 |
| [F-OUT-013](FEATURE_MATRIX.md#f-out-013) | 旧展厅/徽章 App Mode 布局、选色与错误展示补丁集合 | 不迁入 | M0 | 1 | 2 |
| [F-OUT-014](FEATURE_MATRIX.md#f-out-014) | 跨旧仓库路径转发、复制控件与运行包中的辅助陈列 | 不迁入 | M6 | 1 | 2 |

<a id="f-out-001"></a>

### F-OUT-001 展厅专用提示词、风格库与旧展厅 App Mode

**处置：不迁入；阶段：M0。** 业务库注册 SeedreamExhibitionPromptBuilder，按展厅风格与空间参数拼接提示词，并依赖展厅样式资产。

**来源：** [business:nodes/seedream_exhibition_prompt_builder/node.py:353](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/seedream_exhibition_prompt_builder/node.py#L353)；[business:web/styles.json](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/styles.json)

**新归属：** `旧仓库固定基线归档；新包不注册展厅节点、不携带展厅专用样式与界面。`

**理由：** 展厅业务不属于素材—分镜—表格—生成—剪辑创作闭环；通用文本能力由新产品已有文本与提示词模块承担。

**验收：**

- 新包节点目录不含 SeedreamExhibitionPromptBuilder。
- 导入包含该节点的旧工作流时报告不支持范围并保留原始节点数据，不静默删除。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-002"></a>

### F-OUT-002 徽章早期设计、合成、局部编辑与状态存档流水线

**处置：不迁入；阶段：M0。** badge_workflow 注册 10 个设计/合成/存档节点，badge_relief_prompt 另注册徽章浮雕提示词节点。

**来源：** [business:nodes/badge_workflow/node.py:884](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_workflow/node.py#L884)；[business:nodes/badge_relief_prompt/node.py:136](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_relief_prompt/node.py#L136)

**新归属：** `历史业务归档；新包不加载徽章设计与编辑流水线。`

**理由：** 这些节点围绕徽章专有数据、工艺与局部编辑流程，不能因包含 canvas、prompt 或 state 等名称而作为创作画布基础组件迁入。

**验收：**

- NODE_INVENTORY 对这 11 个 ID 均有明确不迁入结论。
- 新生成、素材和历史模块不 import badge_workflow 或 badge_relief_prompt。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-003"></a>

### F-OUT-003 徽章 87/88 应用、区域编辑器与专用执行界面

**处置：不迁入；阶段：M0。** badge_app_87、badge_app_88 通过包级映射合并注册 8 个 ID；徽章区域几何 API 还存在受 PromptServer 条件保护的注册入口。

**来源：** [business:nodes/badge_app_87/__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_app_87/__init__.py)；[business:nodes/badge_app_88/__init__.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_app_88/__init__.py)；[business:nodes/badge_app_87/geometry_api.py:31](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_app_87/geometry_api.py#L31)；[business:web/badge_app_layout.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/badge_app_layout.js)；[business:web/badge_execution_87.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/badge_execution_87.mjs)

**新归属：** `历史业务归档；新包不注册徽章专用 HTTP 路由及原型界面。`

**理由：** 旧 App Mode 的布局、队列与区域编辑不能成为新创作画布的依赖。

**验收：**

- 新包没有 /daelab/badge87/region-geometry 路由。
- 新包启动与资源构建无需导入 badge_app_87/88 或对应前端文件。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-004"></a>

### F-OUT-004 徽章路由、颜色 ID 与局部选择控制节点

**处置：不迁入；阶段：M0。** badge_app_workflow 注册 8 个徽章输入路由、延迟开关、颜色 ID 缓存与选择约束节点。

**来源：** [business:nodes/badge_app_workflow/node.py:840](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_app_workflow/node.py#L840)

**新归属：** `历史业务归档；创作画布的选择、Bypass 与任务控制使用新产品自己的统一契约。`

**理由：** 徽章路由内部约束不等于通用画布选择或任务状态模型，避免把业务状态复制为公共内核。

**验收：**

- 8 个 ID 均在节点清单标为不迁入。
- 新画布选择与任务控制的依赖图不含 badge_app_workflow。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-005"></a>

### F-OUT-005 徽章高度层、浮雕结构与渲染空间对齐

**处置：不迁入；阶段：M0。** badge_height_layer、badge_height_structure 与 badge_render_space_mask 共同注册 7 个高度、几何、结构约束和对齐节点。

**来源：** [business:nodes/badge_height_layer/node.py:633](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_height_layer/node.py#L633)；[business:nodes/badge_height_structure/node.py:850](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_height_structure/node.py#L850)；[business:nodes/badge_render_space_mask/node.py:650](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_render_space_mask/node.py#L650)

**新归属：** `历史业务归档；不随新包安装相关节点和专用 UI。`

**理由：** 属于徽章制造与渲染专用算法，不是创作画布的媒体导入、预览或剪辑基础能力。

**验收：**

- 新包节点映射不含这些 7 个 ID。
- 输入普通图片、视频和文本不触发徽章高度/结构模块加载。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-006"></a>

### F-OUT-006 徽章材质目录、材质区域、颜色锁定与语义合成

**处置：不迁入；阶段：M0。** badge_strict_material 注册 12 个节点，gpt_image2_material_prompt 注册 2 个材质节点并读取 web/materials.json 与材质缩略图。

**来源：** [business:nodes/badge_strict_material/node.py:1835](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/badge_strict_material/node.py#L1835)；[business:nodes/gpt_image2_material_prompt/node.py:901](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/gpt_image2_material_prompt/node.py#L901)；[business:web/materials.json](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/materials.json)

**新归属：** `历史业务归档；材质目录与专有图像处理不进入新产品素材库。`

**理由：** 徽章材质 catalog 与用户创作素材库语义不同；共享图像操作若确有新需求，只按函数职责抽取并独立验证。

**验收：**

- 14 个 ID 均有排除记录。
- 新资产库不依赖 materials.json、material_thumbs 或徽章颜色锁定状态。
- 不得为了复用单个帮助函数整包导入徽章模块。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-007"></a>

### F-OUT-007 分割、抠图、颜色掩膜、多边形与 BBox 工具节点

**处置：不迁入；阶段：M0。** 旧库注册多色掩膜 2 个、多边形/徽章选择掩膜 3 个及 RMBGConfig、SAM3ComplexCollector、BBoxPromptReroute，共 8 个 ID。

**来源：** [business:nodes/multi_color_mask/node.py:319](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/multi_color_mask/node.py#L319)；[business:nodes/polygon_mask/node.py:476](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/polygon_mask/node.py#L476)；[business:nodes/rmbg_config/node.py:48](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/rmbg_config/node.py#L48)；[business:nodes/sam3_complex_collector/node.py:382](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/sam3_complex_collector/node.py#L382)；[business:nodes/bbox_prompt_reroute/node.py:39](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/bbox_prompt_reroute/node.py#L39)

**新归属：** `首版产品不提供这组图像编辑工具；历史工作流保留原始数据并提示缺失依赖。`

**理由：** 当前迁移目标是已有创作闭环与管理体系，不同时扩展为完整图像编辑器。原生 ComfyUI 工作流仍可引用由其他已安装插件提供的节点。

**验收：**

- 新包启动不依赖这些专用分割或掩膜模块。
- 对含被排除 ID 的工作流给出节点级报告，不能自动替换为语义不同的上传节点。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-008"></a>

### F-OUT-008 布尔列表、层级列表与旧分组 Bypass 控制节点

**处置：不迁入；阶段：M0。** 业务库注册 BooleanList、BooleanListHierarchy、BooleanListHierarchyGet、BooleanGroupBypassController。

**来源：** [business:nodes/boolean_list/node.py:88](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/boolean_list/node.py#L88)；[business:nodes/boolean_list_hierarchy/node.py:522](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/boolean_list_hierarchy/node.py#L522)；[business:nodes/boolean_list_hierarchy_get/node.py:104](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/boolean_list_hierarchy_get/node.py#L104)；[business:nodes/boolean_group_bypass_controller/node.py:22](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/boolean_group_bypass_controller/node.py#L22)

**新归属：** `历史通用节点留在旧库归档；新包的 Active/Mute/Bypass 展示由统一生命周期服务负责。`

**理由：** 旧图形工作流分支工具不应仅因名称含 group 或 bypass 被误迁为素材组实现。

**验收：**

- 新包不注册这 4 个节点。
- 保留的创作节点仍逐一验收 Mute/Bypass/Active，并不以删除旧控制节点为由取消模式支持。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-009"></a>

### F-OUT-009 旧独立模型配置节点和 App Mode 上传壳

**处置：不迁入；阶段：M0。** GPTImage2Config 仅输出 size/background/quality；AppModeLoadImage 继承原生 LoadImage 并配合旧 App Mode 的展示。

**来源：** [business:nodes/gpt_image2_config/node.py:54](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/gpt_image2_config/node.py#L54)；[business:nodes/app_mode_load_image/node.py:14](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/app_mode_load_image/node.py#L14)；[business:web/app_mode_load_image_preview.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/app_mode_load_image_preview.js)

**新归属：** `新包统一模型配置 schema 和 DAELAB.MediaUpload；旧独立辅助节点不生产注册。`

**理由：** 相关参数能力保留在生成模块；避免重复上传节点和多套配置 UI。旧工作流不能在缺少输入语义映射时自动替换。

**验收：**

- 生成配置仍能表达受支持模型的尺寸、质量等有效参数。
- 新包不注册 GPTImage2Config 或 AppModeLoadImage，导入旧工作流时明确报告。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-010"></a>

### F-OUT-010 已退役的 LibTV 云通道、登录桥与旧批量执行

**处置：不迁入；阶段：M6。** connection_api 已固定返回 410；table_generation_api 拒绝非 local/comfy provider；StoryboardBatch.execute 明确报停用。VideoGenerate 的稳定 ID 仍承载当前生成面板结果读取，不能按名称删除。

**来源：** [business:nodes/libtv_bridge/connection_api.py:28](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/connection_api.py#L28)；[business:nodes/libtv_bridge/table_generation_api.py:37](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/table_generation_api.py#L37)；[business:nodes/libtv_bridge/batch_node.py:28](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/batch_node.py#L28)；[business:nodes/libtv_bridge/node.py:91](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/node.py#L91)；[business:nodes/libtv_bridge/runtime.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/runtime.py)；[business:nodes/libtv_bridge/connection.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/libtv_bridge/connection.py)

**新归属：** `停止迁入旧云执行与登录实现；保留历史回执、provider 标记、结果引用及只读兼容；DAELAB.LibTV.VideoGenerate ID 保留并映射现行生成能力。`

**理由：** 代码目录或稳定 ID 含 LibTV 不代表旧通道仍受支持。必须按实际 provider 与职责拆分，迁移不得把历史 LibTV 请求自动重投到 Comfy。

**验收：**

- 旧 LibTV 回执可以查看状态与已有本地结果，但无法恢复或重跑退役 provider。
- 用户显式新建任务才可使用当前 Comfy/local provider，生成新的任务身份。
- 旧 StoryboardBatch 可只读兼容并提示转换，不调用旧 Bridge。
- 依赖闭包检查确认保留的生成节点与 schema 不再因 MODELS 或辅助函数 import 退役执行器。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-BIZ-044](TEST_CASES.md#tc-biz-044)、[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-011"></a>

### F-OUT-011 LLM A/C/D/E 样式原型及生产界面的演示内容

**处置：不迁入；阶段：M0。** web/llm_style_preview.js 动态注册 A–E 五种前端类型；A/C/D/E 为 isVirtualNode 的样式原型，B 有对应后端 ApprovedLLMResult。

**来源：** [business:web/llm_style_preview.js:8](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview.js#L8)；[business:web/llm_style_preview_panel.mjs:6](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview_panel.mjs#L6)；[business:nodes/prompt_optimization/approved_result.py:4](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/prompt_optimization/approved_result.py#L4)

**新归属：** `仅迁入 B 的实际提示词优化功能；A/C/D/E 的历史节点数据可只读导入，布局候选和示例文案保留为开发资料。`

**理由：** 设计候选不能与生产能力一起计为五个 LLM 产品节点，避免样式预览、示例结果与真实生成混淆。

**验收：**

- 生产新建菜单仅出现正式 LLM 优化能力。
- 旧 A/C/D/E 数据保留且不触发模型请求。
- 生产界面不显示固定示例结果、样式候选标签或假进度。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-BIZ-050](TEST_CASES.md#tc-biz-050)、[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-012"></a>

### F-OUT-012 ComfyTV 上游实现与上游节点注册

**处置：不迁入；阶段：M0。** Canvas 的 comfytv 适配器仅匹配外部 ComfyTV.* 类型和公共 widget/执行事件，不提供上游 Python 节点。DAELAB.ComfyTV.GPTImageStoryboardStage 则是本业务库自己的节点，另在 NODE_INVENTORY 记录。

**来源：** [canvas:web/adapters/comfytv.mjs:1](../../web/adapters/comfytv.mjs#L1)；[business:nodes/daelab_comfytv_storyboard/node.py:427](../../../ComfyUI-DAELab-Custom-Nodes-Library/nodes/daelab_comfytv_storyboard/node.py#L427)

**新归属：** `上游代码保持外部可选依赖；新包可保留受控兼容适配器，不复制或重新注册 ComfyTV.*。`

**理由：** 单一自有产品仓库不意味着拥有或打包全部第三方插件。稳定自有 ID 与第三方命名空间必须分开盘点。

**验收：**

- 没有安装 ComfyTV 时新产品基础创作闭环正常工作。
- 可选安装 ComfyTV 时验证适配器，确认不修改上游文件或注册同名节点。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-033](TEST_CASES.md#tc-sys-033)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-013"></a>

### F-OUT-013 旧展厅/徽章 App Mode 布局、选色与错误展示补丁集合

**处置：不迁入；阶段：M0。** 业务前端含徽章布局、原型、颜色选择、参考图与错误提示等多个旧 App Mode 脚本；app_mode_bypass_model 列表覆盖历史节点与 LLM 样式类型。

**来源：** [business:web/badge_app_layout.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/badge_app_layout.js)；[business:web/badge_app_prototype.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/badge_app_prototype.js)；[business:web/badge_color_picker.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/badge_color_picker.mjs)；[business:web/app_mode_error_dismiss.js](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/app_mode_error_dismiss.js)；[business:web/app_mode_bypass_model.mjs:3](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/app_mode_bypass_model.mjs#L3)

**新归属：** `不搬入旧页面补丁；迁入节点的模式行为按新组件生命周期统一实现，并保留受影响原生模式验收。`

**理由：** 模式行为是需保留的产品契约，旧业务 DOM、布局和全局补丁并非必须保留的实现。

**验收：**

- 新包不加载旧徽章/展厅布局或原型脚本。
- 全部迁入节点在原生图与创作画布间切换、Mute/Bypass/Active 后可恢复且无残留面板。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)

<a id="f-out-014"></a>

### F-OUT-014 跨旧仓库路径转发、复制控件与运行包中的辅助陈列

**处置：不迁入；阶段：M6。** 业务主题是 Canvas 的兼容转发，表格/LLM 控件按旧扩展目录动态导入；Canvas frontend 为辅助陈列而非正式画布。

**来源：** [business:web/creative_theme.css](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/creative_theme.css)；[business:web/table_controls.mjs:3](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/table_controls.mjs#L3)；[business:web/llm_style_preview_panel.mjs:4](../../../ComfyUI-DAELab-Custom-Nodes-Library/web/llm_style_preview_panel.mjs#L4)；[canvas:frontend/README.md](../../frontend/README.md)

**新归属：** `新库共享包通过内部模块依赖引用；陈列保留在开发工具边界，生产包仅包含实际运行资源和必要兼容导入。`

**理由：** 迁移的退出条件是去除两个旧仓库的运行依赖；不能让新仓库继续通过旧 URL 或 fallback 使用第二套控件。

**验收：**

- 关闭两个旧包后新包控件、主题、字体、撤销与模式行为完整。
- 产物检查不含旧扩展目录的必需导入路径。
- 辅助陈列通过不作为真实 ComfyUI 产品验收通过。

**关联：** [UC-SYS-005](USE_CASES.md#uc-sys-005)；[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)
