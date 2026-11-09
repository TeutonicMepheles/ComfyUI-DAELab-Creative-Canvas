# 节点注册与排除范围盘点

盘点日期：2026-10-24。本文记录固定本地提交的静态源码事实，以及**首版建议处置**。迁入、兼容读取、转换和排除报告均是新产品待实现、待验收的目标，不表示已实现；旧 LibTV 执行已停用则是当前源码事实。新产品继续以 ComfyUI 原生图作为编辑与保存权威；迁入节点保留稳定 ID，后台任务独立持久化。新包替代两旧包，新旧包共同启用不是受支持的运行方式。

## 基线与口径

| 源简称 | 固定本地提交 | 后端注册 ID | 额外前端虚拟 ID |
| --- | --- | ---: | ---: |
| canvas | `3176b5a67dbcd0b66f795976e5a81bcdfe346093` | 4 | 0 |
| business | `7ff56cb51ef6f7fc3bcf5707792d655037c61b30` | 70 | 4 |

源码来源约定：`canvas:` 指本仓库，`business:` 指同级 `ComfyUI-DAELab-Custom-Nodes-Library`；后接仓库相对路径与可选行号。只读检查时两仓库在本次蓝图写入前没有未提交改动。

共 **74 个后端节点 ID、78 个唯一前后端节点类型**。`DAELAB.LLMStylePreviewB` 同时有后端映射和自定义前端类型，计一次。当前决策为 **9 个迁入、6 个兼容读取、63 个不迁入**；其中兼容读取包含 2 个后端历史类型与 4 个前端原型。外部 `ComfyTV.*` 不在这 78 个自有类型中。

- **迁入**：在新包继续提供能力并保留 ID；允许重组实现与 UI，不等于整文件原样复制。
- **兼容读取**：目标是让旧工作流的参数、结果、连接和原始数据可查看/保留，必要时提供最小废弃 schema；不作为正式新建入口，不自动触发原任务。转换必须由用户显式操作，保留原工作流原件并输出迁移副本；新执行产生新任务身份，不能悄悄更换 provider。
- **不迁入**：不生产注册该业务实现；导入时逐节点给出可见的缺失/排除报告并保留原始 JSON。不承诺这些历史业务工作流在新包执行，不以清理为由丢弃未知节点字段。
- 本轮没有留下未归类 ID。后续新增范围应通过能力清单变更，不按旧目录名称或脚本数量自动扩大范围。

## 静态枚举方法与限制

1. 使用 Python `ast.parse` 读取两库根 `__init__.py`，沿相对 `NODE_CLASS_MAPPINGS` / `NODE_ID` 导入递归展开，求值仅覆盖字面量字典、常量、`dict(...)`、`.update(...)` 和映射下标赋值；没有 import 执行仓库模块。
2. 业务映射链读取 56 个 Python 文件，得到 70 个可达 ID；另扫描所有 Python 映射声明交叉核对，未发现额外可达 ID 或静态重名覆盖。Canvas 映射为上传导入加 3 个根文件赋值。
3. 另查前端 `registerCustomNodes` / `LiteGraph.registerNodeType`，展开 `STYLE_VARIANTS` 的 A–E，补入 A/C/D/E 四个后端映射不会列出的虚拟类型。
4. `NODE_DISPLAY_NAME_MAPPINGS`、App Mode 类型覆盖数组和适配器匹配不属于节点注册；代码注释不会被 AST 当作注册语句。`define_schema(node_id=...)` 也不单独扩大根映射导出的类型集合。
5. 条件注册另列服务表：徽章几何 API 的 `try/if PromptServer.instance` 只控制路由，未条件化徽章节点映射。未将条件路由当作无条件可用服务。
6. 此清单是“源码意图导出”的集合，不能证明所有 import 在当前环境成功，也不能证明服务已启动、第三方节点已安装或每个 UI 可操作。运行 `object_info` 与真实两实例检查留给迁移验收；本次未启动服务、未提交生成。

## 注册入口闭包

| 注册入口 | 展开内容 |
| --- | --- |
| `canvas:__init__.py:1` | 导入 MediaUpload；第 6/9/11 行分别追加 TextInput、MaterialGroup、VideoEdit。 |
| `business:__init__.py:1` 至 `:117` | 导入并合并布尔工具、展厅、配置、分镜、徽章、掩膜等包映射；以 BADGE87_NODES 副本开始。 |
| `business:__init__.py:143` | 合并 libtv_bridge 的生成节点和已停用批量节点。 |
| `business:__init__.py:154` | 显式追加 `DAELAB.LLMStylePreviewB`；不能因 prompt_optimization 包注释称“无执行节点”而漏计。 |
| `business:nodes/daelab_comfytv_storyboard/__init__.py:1` | 旧 GPTImageStoryboardStage 映射，加 ScriptParser、Table、StoryboardImport 三个下标赋值。 |
| `business:nodes/badge_app_87/__init__.py:1` | node.py 的 2 个 ID，加 boundary、intrinsic_guide、material_diagnostics、auxiliary_output，各 1 个，共 6 个。 |
| `business:nodes/badge_app_88/__init__.py:1` | node.py 1 个与 target_only 1 个，共 2 个。 |
| `business:nodes/libtv_bridge/__init__.py:1` | node.py 生成节点，加 batch_node 的 NODE_ID；“已停用”的显示名不意味着不再注册。 |
| `business:web/llm_style_preview.js:8` | 遍历 STYLE_VARIANTS 注册 A–E；只有 B 为非虚拟节点，并在后端存在同 ID。 |

## Canvas 后端节点（4）

| 稳定 ID | 能力组 | 决策 | 所属源码 | 映射写入位置 |
| --- | --- | --- | --- | --- |
| `DAELAB.MaterialGroup` | 有序素材组 | 迁入 | `canvas:nodes/material_group.py:7` | `canvas:__init__.py:9` |
| `DAELAB.MediaUpload` | 本地图片/视频素材 | 迁入 | `canvas:nodes/media_upload.py:49` | `canvas:nodes/media_upload.py:49` |
| `DAELAB.TextInput` | 文本素材 | 迁入 | `canvas:nodes/text_input.py:4` | `canvas:__init__.py:6` |
| `DAELAB.VideoEdit` | 剪辑与成片输出 | 迁入 | `canvas:nodes/video_edit.py:19` | `canvas:__init__.py:11` |

## 业务后端节点（70）

同名中的 `ComfyTV` / `LibTV` 是历史稳定 ID 的一部分，不能据此前缀推断第三方所有权或通道状态。逐项决策如下；排除能力族详见 [exclusions.json](catalog/exclusions.json)。

| 稳定 ID | 能力组 | 决策 | 所属源码 | 迁移说明/排除条目 |
| --- | --- | --- | --- | --- |
| `AppModeLoadImage` | 旧配置/上传壳 | 不迁入 | `business:nodes/app_mode_load_image/node.py:14` | F-OUT-009 |
| `BBoxPromptReroute` | 分割/掩膜/BBox | 不迁入 | `business:nodes/bbox_prompt_reroute/node.py:39` | F-OUT-007 |
| `BadgeDesignCanvas` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeDeterministicComposite` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeEditMaskValidator` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeEditStateLoad` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeEditStateSave` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeHeightEstablishPromptBuilder` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_layer/node.py:633` | F-OUT-005 |
| `BadgeHeightLockedBaseV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgeHeightPatch` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeHeightReferenceAlignV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgeLocalEditPromptBuilder` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeMasterRegistration` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeMaterialConstraintV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgeMaterialRegionExecutorV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgeMaterialRegionGPTChannelV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgeMaterialRegionMergeV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BadgePresentationPromptBuilder` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeReliefPrompt` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_relief_prompt/node.py:136` | F-OUT-002 |
| `BadgeRenderPromptBuilder` | 徽章设计/合成 | 不迁入 | `business:nodes/badge_workflow/node.py:884` | F-OUT-002 |
| `BadgeStudioCompositeV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `BooleanGroupBypassController` | 旧工作流分支 | 不迁入 | `business:nodes/boolean_group_bypass_controller/node.py:22` | F-OUT-008 |
| `BooleanList` | 旧工作流分支 | 不迁入 | `business:nodes/boolean_list/node.py:88` | F-OUT-008 |
| `BooleanListHierarchy` | 旧工作流分支 | 不迁入 | `business:nodes/boolean_list_hierarchy/node.py:522` | F-OUT-008 |
| `BooleanListHierarchyGet` | 旧工作流分支 | 不迁入 | `business:nodes/boolean_list_hierarchy_get/node.py:104` | F-OUT-008 |
| `DAELAB.Badge87AuxiliaryImageV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/auxiliary_output.py:21` | F-OUT-003 |
| `DAELAB.Badge87BoundaryCompositeV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/boundary.py:72` | F-OUT-003 |
| `DAELAB.Badge87IntrinsicGuideV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/intrinsic_guide.py:27` | F-OUT-003 |
| `DAELAB.Badge87MaterialDiagnosticsV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/material_diagnostics.py:94` | F-OUT-003 |
| `DAELAB.BadgeApp87RegionAlignV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/node.py:461` | F-OUT-003 |
| `DAELAB.BadgeApp87V1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_87/node.py:461` | F-OUT-003 |
| `DAELAB.BadgeApp88TargetOnlyV1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_88/target_only.py:46` | F-OUT-003 |
| `DAELAB.BadgeApp88V1` | 徽章 87/88 应用 | 不迁入 | `business:nodes/badge_app_88/node.py:218` | F-OUT-003 |
| `DAELAB.BadgeColorIdMapCacheStoreV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeColorIdMapV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeEditPromptRouteV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeEntryRouteV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeGPTStructureTransferV1` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_structure/node.py:850` | F-OUT-005 |
| `DAELAB.BadgeLazyImageSwitchV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeLocalMaskRouteV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeLocalSelectionGuardV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeMaterialCanvasNormalizeV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `DAELAB.BadgeReliefGeometryV1` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_structure/node.py:850` | F-OUT-005 |
| `DAELAB.BadgeRenderSpaceMaskAlignV1` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_render_space_mask/node.py:650` | F-OUT-005 |
| `DAELAB.BadgeRoute2CanvasV1` | 徽章路由/选择 | 不迁入 | `business:nodes/badge_app_workflow/node.py:840` | F-OUT-004 |
| `DAELAB.BadgeSelectionMaskV1` | 分割/掩膜/BBox | 不迁入 | `business:nodes/polygon_mask/node.py:476` | F-OUT-007 |
| `DAELAB.BadgeSemanticRegionGPTChannelV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `DAELAB.BadgeSemanticRegionMergeV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `DAELAB.BadgeStructureConstraintV1` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_structure/node.py:850` | F-OUT-005 |
| `DAELAB.BadgeStudioBackgroundGPTV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `DAELAB.BadgeStudioColorLockV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/badge_strict_material/node.py:1835` | F-OUT-006 |
| `DAELAB.ComfyTV.GPTImageStoryboardStage` | 历史分镜任务 | 兼容读取 | `business:nodes/daelab_comfytv_storyboard/node.py:427` | 保留旧表格/分镜参数、结果与连接信息；新建流程使用统一生成模块，旧执行流程须显式迁移。 |
| `DAELAB.LLMStylePreviewB` | 提示词优化 | 迁入 | `business:nodes/prompt_optimization/approved_result.py:4` | 迁入真实 B 面板与已应用结果输出；不得因样式原型命名而遗漏。；映射写入 `__init__.py:154` |
| `DAELAB.LibTV.StoryboardBatch` | 退役批量入口 | 兼容读取 | `business:nodes/libtv_bridge/batch_node.py:13` | 现 execute 始终报停用；保留只读 schema/数据和转换指引，不恢复 LibTV 批量执行。；映射写入 `nodes/libtv_bridge/__init__.py:3` |
| `DAELAB.LibTV.VideoGenerate` | 生成 | 迁入 | `business:nodes/libtv_bridge/node.py:117` | 稳定 ID 保留；迁入 Comfy/local 任务与结果读取，退役 LibTV 传输不迁入。 |
| `DAELAB.PolygonMaskV1` | 分割/掩膜/BBox | 不迁入 | `business:nodes/polygon_mask/node.py:476` | F-OUT-007 |
| `DAELAB.ScriptParser` | 分镜解析 | 迁入 | `business:nodes/daelab_comfytv_storyboard/script_node.py:6` | 正式分镜入口；保留稳定 ID，模块迁入 script。；映射写入 `nodes/daelab_comfytv_storyboard/__init__.py:5` |
| `DAELAB.StoryboardImport` | 分镜导入 | 迁入 | `business:nodes/daelab_comfytv_storyboard/import_node.py:26` | 保留旧导入数据与原生输出，复用新导入/表格内核。；映射写入 `nodes/daelab_comfytv_storyboard/__init__.py:9` |
| `DAELAB.Table` | 表格 | 迁入 | `business:nodes/daelab_comfytv_storyboard/table_node.py:6` | 统一内容表、生成列与任务表能力；保留稳定 ID。；映射写入 `nodes/daelab_comfytv_storyboard/__init__.py:7` |
| `DAELabBadgeHeightLayer` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_layer/node.py:633` | F-OUT-005 |
| `DAELabBadgeHeightLayerV1` | 徽章高度/结构 | 不迁入 | `business:nodes/badge_height_layer/node.py:633` | F-OUT-005 |
| `DAELabBadgeMaterialRegionV1` | 徽章材质/颜色 | 不迁入 | `business:nodes/gpt_image2_material_prompt/node.py:901` | F-OUT-006 |
| `DAELabMultiColorMask` | 分割/掩膜/BBox | 不迁入 | `business:nodes/multi_color_mask/node.py:319` | F-OUT-007 |
| `DAELabMultiColorMaskV1` | 分割/掩膜/BBox | 不迁入 | `business:nodes/multi_color_mask/node.py:319` | F-OUT-007 |
| `GPTImage2Config` | 旧配置/上传壳 | 不迁入 | `business:nodes/gpt_image2_config/node.py:54` | F-OUT-009 |
| `GPTImage2MaterialPrompt` | 徽章材质/颜色 | 不迁入 | `business:nodes/gpt_image2_material_prompt/node.py:901` | F-OUT-006 |
| `PolygonMask` | 分割/掩膜/BBox | 不迁入 | `business:nodes/polygon_mask/node.py:476` | F-OUT-007 |
| `RMBGConfig` | 分割/掩膜/BBox | 不迁入 | `business:nodes/rmbg_config/node.py:48` | F-OUT-007 |
| `SAM3ComplexCollector` | 分割/掩膜/BBox | 不迁入 | `business:nodes/sam3_complex_collector/node.py:382` | F-OUT-007 |
| `SeedreamExhibitionPromptBuilder` | 展厅 | 不迁入 | `business:nodes/seedream_exhibition_prompt_builder/node.py:353` | F-OUT-001 |

## 仅前端虚拟节点（额外 4）

| 稳定 ID | 能力组 | 决策 | 注册来源 | 处理 |
| --- | --- | --- | --- | --- |
| `DAELAB.LLMStylePreviewA` | LLM 样式原型 | 兼容读取 | `business:web/llm_style_preview.js:8`；`web/llm_style_preview_panel.mjs:6` | F-OUT-011；保留旧节点原始属性，不携带原型布局进入生产新建菜单，不自动请求模型。 |
| `DAELAB.LLMStylePreviewC` | LLM 样式原型 | 兼容读取 | `business:web/llm_style_preview.js:8`；`web/llm_style_preview_panel.mjs:6` | F-OUT-011；保留旧节点原始属性，不携带原型布局进入生产新建菜单，不自动请求模型。 |
| `DAELAB.LLMStylePreviewD` | LLM 样式原型 | 兼容读取 | `business:web/llm_style_preview.js:8`；`web/llm_style_preview_panel.mjs:6` | F-OUT-011；保留旧节点原始属性，不携带原型布局进入生产新建菜单，不自动请求模型。 |
| `DAELAB.LLMStylePreviewE` | LLM 样式原型 | 兼容读取 | `business:web/llm_style_preview.js:8`；`web/llm_style_preview_panel.mjs:6` | F-OUT-011；保留旧节点原始属性，不携带原型布局进入生产新建菜单，不自动请求模型。 |

B 的前端自定义类型与后端结果节点共同构成正式能力，前端仅在用户显式应用结果后向原生图输出；A/C/D/E 的虚拟类型不得被计为已具备相同生成/执行能力。

## 导入副作用、HTTP 服务与旧 App Mode 边界

下列入口不新增后端节点 ID，但会影响单包启动、依赖与退役策略。只迁入被能力清单使用的服务职责，不整包复制其父目录。

| 来源 | 当前源码行为 | 新包决策 |
| --- | --- | --- |
| `canvas:nodes/material_output_api.py:8` | `/daelab/creative/material-output` 路由；素材文件导入。 | 迁入素材服务，保留文件根约束与异步 IO 边界。 |
| `canvas:nodes/video_edit.py:82` | 受 `hasattr(PromptServer, instance)` 检查保护，注册 `/daelab/edit/media` 和 `/daelab/edit/preview`。 | 迁入剪辑服务；是否成功注册须运行验证。 |
| `business:nodes/daelab_comfytv_storyboard/__init__.py:12` | 导入 document_import、prompt_api、script_api 注册文档、提示词及分镜解析路由。 | 按导入/解析/表格职责迁入；原路由别名由版本化兼容层集中管理。 |
| `business:nodes/libtv_bridge/__init__.py:5` | 导入 connection_api 和 table_generation_api。 | 迁入当前 local/comfy 任务服务；旧 connection 仅退役响应，不迁入旧登录桥。 |
| `business:nodes/libtv_bridge/connection_api.py:28` | 当前 handler 固定返回 HTTP 410，告知 LibTV 通道已停用。 | 不恢复此通道；如保留历史 URL，只提供明确退役响应。 |
| `business:nodes/libtv_bridge/table_generation_api.py:37` | current provider 校验；local/comfy 执行，旧 provider 拒绝；回执路径仍含 libtv。 | 路径兼容不代表通道恢复；保留旧回执可读与结果引用，统一到新任务账本。 |
| `business:nodes/prompt_optimization/__init__.py:4` | register() 只调用 register_routes；根文件另外注册 ApprovedLLMResult。 | 迁入优化服务与正式 B 节点；避免漏掉节点或重复注册路由。 |
| `business:nodes/badge_app_87/__init__.py:10` | try 导入 server，且 PromptServer.instance 非空才调用 geometry_api.register；ImportError 被捕获。 | F-OUT-003；不迁入徽章几何服务。 |
| `business:nodes/sam3_complex_collector/node.py:166` | 定义 `/daelab/sam3-complex/segment` 路由。 | F-OUT-007；不迁入。 |
| `business:web/app_mode_bypass_model.mjs:3` | DAELAB_NODE_TYPES 包含 70 后端及 4 额外前端类型；这是覆盖表，不是注册入口。 | 按保留节点重建覆盖；保留 Active/Mute/Bypass 产品行为，移除历史节点业务逻辑。 |
| `business:web/badge_app_layout.js`、`badge_app_prototype.js`、`badge_color_picker.mjs`、`app_mode_error_dismiss.js` | 旧应用布局、原型、颜色与错误处理脚本。 | F-OUT-013；不整体带入。共享帮助函数只有在新能力实际依赖时才可抽取并独立验证。 |

## 外部 ComfyTV 与旧云通道的区别

- `canvas:web/adapters/comfytv.mjs:1` 是可选呈现适配器，匹配 `ComfyTV.*`，没有注册或修改上游 Python 节点。`ComfyTV.StoryboardEditorStage` 等由外部插件提供，不计入自有 78 类型清单；不复制 ComfyTV 上游源码。
- `DAELAB.ComfyTV.GPTImageStoryboardStage` 属于业务库自己的节点；保留历史数据读取与显式转换，不因名字像上游就遗漏。其旧图片执行路径与新的统一任务服务关系需要迁移用例约束，不允许导入即发起生成。
- `DAELAB.LibTV.VideoGenerate` 已是正式生成面板的稳定 ID，现原生 execute 读取面板已完成的图片/视频结果；无 task_data 时明确提示旧 LibTV 通道停用。保留 ID，替换内部职责边界。
- `DAELAB.LibTV.StoryboardBatch` 仍注册，但 execute 恒报停用。`runtime.py`、`connection.py`、旧 batch/recovery 中残留可执行实现不得因顺手复制依赖而重新开放。
- 当前表格回执放在 `user/daelab/libtv/table-jobs`；迁移必须按 provider 和任务身份识别历史记录。旧结果只读保留，新建 Comfy/local 任务须显式操作并拥有新身份，不能把“恢复”实现为跨 provider 重投。

## 退出验收约束

- 只有新包启用时，9 个迁入类型的能力闭环成立；兼容读取类型按各自用例验证，不把不迁入节点自动替换成语义不同的新节点。
- 启动前检测新旧包并存；节点、HTTP 路由、画布入口及事件绑定不得靠加载顺序覆盖。
- 保存/重载保留稳定 ID、原生槽位索引、素材引用、组顺序与未知原始字段；不迁入范围产生可见报告，不静默丢数据。
- 旧任务身份、provider、结果和素材路径迁移分别验证；没有模型/云账号时基础画布仍可运行，导入和只读检查不提交生成。
- 该清单与排除目录是迁移设计，不是当前仓库节点删除指令；本次只新增文档，没有变更现有注册或运行行为。
