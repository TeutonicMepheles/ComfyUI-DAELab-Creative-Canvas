# 创作画布功能用例

本文件由 `catalog/*.json` 生成；修改目录中的源数据后运行 `node docs/migration-blueprint/render_catalog.mjs --write`。不要单独修改生成表。

共 41 个功能用例。UC 描述创作者或维护者如何完成目标，TC 描述对这些行为的验证方法。所有用例是迁移后的目标行为，包含异常处理，不是已经执行的验收报告。

| 编号 | 用例 | 角色 | 测试数 |
| --- | --- | --- | --- |
| [UC-CAN-001](USE_CASES.md#uc-can-001) | 安装单一产品包并进入创作画布 | 创作者/环境维护者 | 6 |
| [UC-CAN-002](USE_CASES.md#uc-can-002) | 上传并安全替换图片和视频 | 创作者 | 7 |
| [UC-CAN-003](USE_CASES.md#uc-can-003) | 整理素材组并控制整体展示 | 创作者 | 5 |
| [UC-CAN-004](USE_CASES.md#uc-can-004) | 使用统一 Slot 建立和管理连接 | 创作者 | 4 |
| [UC-CAN-005](USE_CASES.md#uc-can-005) | 编辑独立文本并传给消费节点 | 创作者 | 3 |
| [UC-CAN-006](USE_CASES.md#uc-can-006) | 复制选区、撤销并保存重载 | 创作者 | 6 |
| [UC-CAN-007](USE_CASES.md#uc-can-007) | 在素材与表格/生成结果间交换快照 | 创作者 | 5 |
| [UC-CAN-008](USE_CASES.md#uc-can-008) | 收藏、搜索和复用资产 | 创作者 | 6 |
| [UC-CAN-009](USE_CASES.md#uc-can-009) | 查看任务进度而不干扰执行 | 创作者 | 2 |
| [UC-CAN-010](USE_CASES.md#uc-can-010) | 从素材组建立并编辑单轨时间轴 | 创作者 | 5 |
| [UC-CAN-011](USE_CASES.md#uc-can-011) | 预览剪辑并调整画幅和声音 | 创作者 | 5 |
| [UC-CAN-012](USE_CASES.md#uc-can-012) | 导出成片并接回创作流程 | 创作者 | 5 |
| [UC-CAN-013](USE_CASES.md#uc-can-013) | 跨模式、缩放和键盘持续编辑 | 创作者 | 15 |
| [UC-CAN-014](USE_CASES.md#uc-can-014) | 迁入历史工作流并完成发布验收 | 维护者/既有用户 | 8 |
| [UC-BIZ-001](USE_CASES.md#uc-biz-001) | 建立并整理两个独立素材表 | 创作者 | 7 |
| [UC-BIZ-002](USE_CASES.md#uc-biz-002) | 从画布填充表格并整理单元格媒体 | 创作者 | 5 |
| [UC-BIZ-003](USE_CASES.md#uc-biz-003) | 导入 DOCX 并修正文稿映射 | 创作者 | 3 |
| [UC-BIZ-004](USE_CASES.md#uc-biz-004) | 从既有表格/文本文件整理分镜 | 创作者 | 1 |
| [UC-BIZ-005](USE_CASES.md#uc-biz-005) | 配置唯一提示词来源和同行引用 | 创作者 | 7 |
| [UC-BIZ-006](USE_CASES.md#uc-biz-006) | 优化提示词并审阅后应用 | 创作者 | 6 |
| [UC-BIZ-007](USE_CASES.md#uc-biz-007) | 润色文本或从图片反推提示词 | 创作者 | 3 |
| [UC-BIZ-008](USE_CASES.md#uc-biz-008) | 可选 AI 归类文稿 | 创作者 | 1 |
| [UC-BIZ-009](USE_CASES.md#uc-biz-009) | 在表格中按行批量生成图片或视频 | 创作者 | 11 |
| [UC-BIZ-010](USE_CASES.md#uc-biz-010) | 用独立生成节点处理表格任务或连线输入 | 创作者 | 7 |
| [UC-BIZ-011](USE_CASES.md#uc-biz-011) | 中断后恢复原任务和下载 | 创作者 | 7 |
| [UC-BIZ-012](USE_CASES.md#uc-biz-012) | 暂停一批任务并继续 | 创作者 | 1 |
| [UC-BIZ-013](USE_CASES.md#uc-biz-013) | 查看任务汇总并把结果送往后续创作 | 创作者 | 4 |
| [UC-BIZ-014](USE_CASES.md#uc-biz-014) | 在资源受限环境运行多个创作任务 | 创作者 | 4 |
| [UC-BIZ-015](USE_CASES.md#uc-biz-015) | 迁移旧创作工作流、任务记录与素材 | 创作者 | 5 |
| [UC-BIZ-016](USE_CASES.md#uc-biz-016) | 长期编辑与大表格操作 | 创作者 | 5 |
| [UC-SYS-001](USE_CASES.md#uc-sys-001) | 在干净ComfyUI安装并开始创作 | 安装者 | 5 |
| [UC-SYS-002](USE_CASES.md#uc-sys-002) | 跨模式编辑与任务事实隔离 | 创作者 | 4 |
| [UC-SYS-003](USE_CASES.md#uc-sys-003) | 完成分镜到成片的创作 | 创作者 | 3 |
| [UC-SYS-004](USE_CASES.md#uc-sys-004) | 网络或服务重启后恢复原任务 | 创作者 | 5 |
| [UC-SYS-005](USE_CASES.md#uc-sys-005) | 将旧创作环境迁入新包 | 迁移执行者 | 12 |
| [UC-SYS-006](USE_CASES.md#uc-sys-006) | 升级失败后回滚并保全新数据 | 迁移执行者 | 2 |
| [UC-SYS-007](USE_CASES.md#uc-sys-007) | 在缺少可选提供方时继续工作 | 创作者 | 3 |
| [UC-SYS-008](USE_CASES.md#uc-sys-008) | 管理多种资源的排队任务 | 创作者 | 3 |
| [UC-SYS-009](USE_CASES.md#uc-sys-009) | 导出可定位且脱敏的诊断 | 维护者 | 3 |
| [UC-SYS-010](USE_CASES.md#uc-sys-010) | 长时间处理大型创作项目 | 创作者 | 7 |
| [UC-SYS-011](USE_CASES.md#uc-sys-011) | 维护可追踪的单产品版本 | 开发与发布维护者 | 5 |

<a id="uc-can-001"></a>

## UC-CAN-001 安装单一产品包并进入创作画布

**角色：** 创作者/环境维护者。 **功能：** [F-CAN-001](FEATURE_MATRIX.md#f-can-001)、[F-CAN-002](FEATURE_MATRIX.md#f-can-002)、[F-CAN-004](FEATURE_MATRIX.md#f-can-004)、[F-CAN-038](FEATURE_MATRIX.md#f-can-038)、[F-CAN-039](FEATURE_MATRIX.md#f-can-039)

**前置条件**

- 使用独立测试 ComfyUI 用户数据目录。
- 已记录宿主、前端和 Python 版本；两个旧同名节点包已停用。

**主流程**

1. 安装新包并完整重启服务。
2. 检查启动诊断与节点目录。
3. 打开空工作流，从模式菜单进入创作画布并打开新建菜单。

**成功结果**

- 一个画布入口，每个稳定节点 ID 只注册一次。
- 基础创作不依赖旧仓库或外部生成服务。
- 菜单只列当前可用能力。

**异常与分支**

- 旧包冲突时报告路径和冲突 ID，不能按加载顺序覆盖。
- 宿主必要 API 不支持时说明缺失能力，保留用户工作流。

**测试：** [TC-CAN-001](TEST_CASES.md#tc-can-001)、[TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-003](TEST_CASES.md#tc-can-003)、[TC-CAN-039](TEST_CASES.md#tc-can-039)、[TC-CAN-042](TEST_CASES.md#tc-can-042)、[TC-CAN-043](TEST_CASES.md#tc-can-043)

<a id="uc-can-002"></a>

## UC-CAN-002 上传并安全替换图片和视频

**角色：** 创作者。 **功能：** [F-CAN-005](FEATURE_MATRIX.md#f-can-005)、[F-CAN-006](FEATURE_MATRIX.md#f-can-006)、[F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-009](FEATURE_MATRIX.md#f-can-009)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**前置条件**

- 有两个不同内容的有效媒体和一个不支持文件。
- 空画布及一个已有连线的图片节点。

**主流程**

1. 将多个文件一起拖到空白处。
2. 打开一个视频的播放、进度、音量和下载操作。
3. 单文件拖到已有节点替换，再尝试跨类型替换已连线图片。

**成功结果**

- 支持媒体按顺序建节点，不支持文件有单独提示。
- 媒体比例、名称与文件引用正确，播放不触发画布拖动。
- 合法替换原子提交；跨类型已连线替换拒绝并保留原图。

**异常与分支**

- 上传失败保留原值；新请求/删除/重载使旧回包失效。
- 文件失效或编码不能预览时显示可操作错误。

**测试：** [TC-CAN-004](TEST_CASES.md#tc-can-004)、[TC-CAN-005](TEST_CASES.md#tc-can-005)、[TC-CAN-006](TEST_CASES.md#tc-can-006)、[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-008](TEST_CASES.md#tc-can-008)、[TC-CAN-010](TEST_CASES.md#tc-can-010)、[TC-CAN-040](TEST_CASES.md#tc-can-040)

<a id="uc-can-003"></a>

## UC-CAN-003 整理素材组并控制整体展示

**角色：** 创作者。 **功能：** [F-CAN-009](FEATURE_MATRIX.md#f-can-009)、[F-CAN-011](FEATURE_MATRIX.md#f-can-011)、[F-CAN-015](FEATURE_MATRIX.md#f-can-015)、[F-CAN-016](FEATURE_MATRIX.md#f-can-016)、[F-CAN-017](FEATURE_MATRIX.md#f-can-017)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**前置条件**

- 至少三个媒体节点和一个文本节点，各有稳定 ID。

**主流程**

1. 多选并打组，再拖入/移出一个成员。
2. 切换宫格、水平、垂直排列，改组名、颜色和序号。
3. 锁定后尝试移动；解锁、收起/展开。
4. 分别执行解散及删除组并撤销。

**成功结果**

- 成员顺序和节点身份稳定，组输出与界面顺序一致。
- 锁定阻止位置/排列改变；收起不改变执行集合。
- 解散保留成员，删除组删除成员，两者均能一次撤销。

**异常与分支**

- 拒绝嵌套或无效成员，不产生重复/循环关系。
- 组内控件或重命名不被拖动捕获。

**测试：** [TC-CAN-010](TEST_CASES.md#tc-can-010)、[TC-CAN-012](TEST_CASES.md#tc-can-012)、[TC-CAN-016](TEST_CASES.md#tc-can-016)、[TC-CAN-017](TEST_CASES.md#tc-can-017)、[TC-CAN-018](TEST_CASES.md#tc-can-018)

<a id="uc-can-004"></a>

## UC-CAN-004 使用统一 Slot 建立和管理连接

**角色：** 创作者。 **功能：** [F-CAN-018](FEATURE_MATRIX.md#f-can-018)、[F-CAN-019](FEATURE_MATRIX.md#f-can-019)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)、[F-CAN-034](FEATURE_MATRIX.md#f-can-034)

**前置条件**

- 画布含单素材、素材组、首尾帧用途消费者和剪辑。
- 至少一个消费者已有输入连接。

**主流程**

1. 从源/目标两方向拖线，观察类型和用途提示。
2. 尝试不兼容连接，再连接具有多个兼容用途的目标。
3. 选择连线，用双击、键盘或拖断删除后撤销。

**成功结果**

- 只能形成真实类型兼容连接，显式用途不被猜测覆盖。
- first-free 消费者选择第一个兼容空输入。
- 删除恢复操作对应真实连接且可撤销。

**异常与分支**

- 停用/隐藏/被压制端口不可磁吸。
- 未导出或过期剪辑结果拒绝新连接；已有连接不因此删除。

**测试：** [TC-CAN-019](TEST_CASES.md#tc-can-019)、[TC-CAN-020](TEST_CASES.md#tc-can-020)、[TC-CAN-021](TEST_CASES.md#tc-can-021)、[TC-CAN-038](TEST_CASES.md#tc-can-038)

<a id="uc-can-005"></a>

## UC-CAN-005 编辑独立文本并传给消费节点

**角色：** 创作者。 **功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-008](FEATURE_MATRIX.md#f-can-008)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)

**前置条件**

- 两个文本节点和一个声明 STRING 输入的无付费测试消费者。

**主流程**

1. 在 A 中使用中文输入法输入多段文本，B 保持不同内容。
2. 把 A 连接到消费者，读取输入快照。
3. 将 A 收藏，再修改原文，切换 Mute/Active。

**成功结果**

- 文本保存和 STRING 输出一致，B 不受影响。
- 收藏为当时快照，后续文本修改不回写收藏。
- 停用时不接收编辑/提供可消费快照，恢复后内容仍在。

**异常与分支**

- 组合输入确认不提前提交或触发画布快捷键。
- 空文本收藏被明确拒绝，不污染目录。

**测试：** [TC-CAN-009](TEST_CASES.md#tc-can-009)、[TC-CAN-016](TEST_CASES.md#tc-can-016)、[TC-CAN-030](TEST_CASES.md#tc-can-030)

<a id="uc-can-006"></a>

## UC-CAN-006 复制选区、撤销并保存重载

**角色：** 创作者。 **功能：** [F-CAN-010](FEATURE_MATRIX.md#f-can-010)、[F-CAN-012](FEATURE_MATRIX.md#f-can-012)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)、[F-CAN-014](FEATURE_MATRIX.md#f-can-014)、[F-CAN-015](FEATURE_MATRIX.md#f-can-015)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**前置条件**

- 含上传、文本、组和内部/外部连接的工作流。

**主流程**

1. 复制选区并粘贴两次。
2. 拖动和修改一处内容，执行撤销与重做。
3. 平移/缩放后保存 JSON，关闭测试页面再载入。

**成功结果**

- 副本节点 ID、成员和内部连接正确映射，源选区不变。
- 编辑按用户动作回退，纯视口操作不损坏重做。
- 重载恢复节点、布局、名称、素材引用和真实连接。

**异常与分支**

- 非法剪贴板内容不创建部分节点。
- 未知工作流版本给出报告并保留原文件，不静默降级覆盖。

**测试：** [TC-CAN-011](TEST_CASES.md#tc-can-011)、[TC-CAN-013](TEST_CASES.md#tc-can-013)、[TC-CAN-014](TEST_CASES.md#tc-can-014)、[TC-CAN-015](TEST_CASES.md#tc-can-015)、[TC-CAN-033](TEST_CASES.md#tc-can-033)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="uc-can-007"></a>

## UC-CAN-007 在素材与表格/生成结果间交换快照

**角色：** 创作者。 **功能：** [F-CAN-018](FEATURE_MATRIX.md#f-can-018)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)、[F-CAN-021](FEATURE_MATRIX.md#f-can-021)、[F-CAN-022](FEATURE_MATRIX.md#f-can-022)、[F-CAN-023](FEATURE_MATRIX.md#f-can-023)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**前置条件**

- 已启用表格或声明 materialTargets/materialSources 的测试适配器。
- 拥有多素材组和包含单素材的业务单元格。

**主流程**

1. 将素材/文本拖到兼容落点，观察受影响区域高亮。
2. 松开填充，随后修改源素材。
3. 从结果列输出分组素材，再把单个单元格素材拖到空白画布。

**成功结果**

- 填充为一次快照，源节点归位且后续编辑不覆盖目标。
- 宿主不解释表格规则；业务按列/行/单格合同完成原子消费。
- 结果按业务分组创建，单素材拖出保留源单元格和文件。

**异常与分支**

- 类型不兼容、来源变化或文件无效时无半成品节点。
- 取消清理所有高亮、提示与拖动状态。

**测试：** [TC-CAN-022](TEST_CASES.md#tc-can-022)、[TC-CAN-023](TEST_CASES.md#tc-can-023)、[TC-CAN-024](TEST_CASES.md#tc-can-024)、[TC-CAN-025](TEST_CASES.md#tc-can-025)、[TC-CAN-040](TEST_CASES.md#tc-can-040)

<a id="uc-can-008"></a>

## UC-CAN-008 收藏、搜索和复用资产

**角色：** 创作者。 **功能：** [F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-008](FEATURE_MATRIX.md#f-can-008)、[F-CAN-024](FEATURE_MATRIX.md#f-can-024)、[F-CAN-025](FEATURE_MATRIX.md#f-can-025)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**前置条件**

- 资产目录为空，有图片、视频及文本节点。
- 已导出一份旧浏览器收藏目录作迁移夹具。

**主流程**

1. 收藏三种素材并重复收藏其中一项。
2. 按类型及名称搜索，打开视频预览并关闭。
3. 加入画布、撤销加入、取消收藏。
4. 导入旧收藏目录并查看逐条报告。

**成功结果**

- 同身份去重；文本保存内容快照，媒体复用原文件引用。
- 加入画布可撤销；取消收藏不删除素材文件或既有节点。
- 迁移保留旧数据并报告重复/失效项，刷新后目录保留。

**异常与分支**

- 失效文件不能创建空素材；存储异常不覆盖有效目录。
- 未知版本目录保留原始导出并提示无法迁入条目。

**测试：** [TC-CAN-026](TEST_CASES.md#tc-can-026)、[TC-CAN-027](TEST_CASES.md#tc-can-027)、[TC-CAN-028](TEST_CASES.md#tc-can-028)、[TC-CAN-040](TEST_CASES.md#tc-can-040)、[TC-CAN-041](TEST_CASES.md#tc-can-041)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="uc-can-009"></a>

## UC-CAN-009 查看任务进度而不干扰执行

**角色：** 创作者。 **功能：** [F-CAN-026](FEATURE_MATRIX.md#f-can-026)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)

**前置条件**

- 无付费任务服务模拟器可按指定顺序返回任务快照。

**主流程**

1. 触发排队、运行、恢复、错误及完成快照。
2. 隐藏画布、停用节点、再次打开并刷新。
3. 缩小卡片并开启减少动态效果。

**成功结果**

- 胶囊只展示经校验的真实状态和计数。
- 显隐不取消任务，刷新只根据后端证据恢复状态。
- 历史终态不重复通知，窄宽度摘要不撑大节点或遮挡连线。

**异常与分支**

- 非法/重复任务 ID 被过滤，不造成重复胶囊。
- 没有后端执行证据时显示恢复/待核对状态，不能假装继续运行。

**测试：** [TC-CAN-029](TEST_CASES.md#tc-can-029)、[TC-CAN-030](TEST_CASES.md#tc-can-030)

<a id="uc-can-010"></a>

## UC-CAN-010 从素材组建立并编辑单轨时间轴

**角色：** 创作者。 **功能：** [F-CAN-013](FEATURE_MATRIX.md#f-can-013)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)、[F-CAN-028](FEATURE_MATRIX.md#f-can-028)、[F-CAN-029](FEATURE_MATRIX.md#f-can-029)

**前置条件**

- 两个素材组，包含同一文件的两个独立节点和图片/视频混排。

**主流程**

1. 连接两个组到剪辑，裁剪、分割、复制、重排并删除片段。
2. 向组中新增素材，移除另一组连接。
3. 撤销/重做最后动作，再保存并重载。

**成功结果**

- 按节点身份建立片段，同文件不同节点不被合并。
- 已有编辑和手工删除记录保留；断开一个组只影响该组。
- 派生同步与用户动作共用历史，重载保持最终编辑。

**异常与分支**

- 上游未就绪不视为空集合而删除片段。
- 异步读取期间图/连接变化时拒绝旧回包。

**测试：** [TC-CAN-014](TEST_CASES.md#tc-can-014)、[TC-CAN-016](TEST_CASES.md#tc-can-016)、[TC-CAN-031](TEST_CASES.md#tc-can-031)、[TC-CAN-032](TEST_CASES.md#tc-can-032)、[TC-CAN-033](TEST_CASES.md#tc-can-033)

<a id="uc-can-011"></a>

## UC-CAN-011 预览剪辑并调整画幅和声音

**角色：** 创作者。 **功能：** [F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-029](FEATURE_MATRIX.md#f-can-029)、[F-CAN-030](FEATURE_MATRIX.md#f-can-030)、[F-CAN-031](FEATURE_MATRIX.md#f-can-031)、[F-CAN-032](FEATURE_MATRIX.md#f-can-032)

**前置条件**

- 含横竖画幅、图片及带音轨视频的时间轴。

**主流程**

1. 播放并定位，选择片段后撤销一次编辑。
2. 切换 1×/0.75×/0.5× 预览，取消一次未完成转换。
3. 设置片段留边/填满、静音及锁定分辨率，替换首片段。

**成功结果**

- 播放时间不因选中或非截断撤销而跳回；加载等待不推进错误时钟。
- 倍率只影响预览清晰度，原素材和导出设置不变。
- 锁定画幅、逐段构图和音轨设置与编辑数据一致。

**异常与分支**

- 取消/过期代理结果不覆盖当前倍率。
- 媒体解码失败给出片段级提示并允许继续编辑。

**测试：** [TC-CAN-032](TEST_CASES.md#tc-can-032)、[TC-CAN-034](TEST_CASES.md#tc-can-034)、[TC-CAN-035](TEST_CASES.md#tc-can-035)、[TC-CAN-036](TEST_CASES.md#tc-can-036)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="uc-can-012"></a>

## UC-CAN-012 导出成片并接回创作流程

**角色：** 创作者。 **功能：** [F-CAN-026](FEATURE_MATRIX.md#f-can-026)、[F-CAN-031](FEATURE_MATRIX.md#f-can-031)、[F-CAN-032](FEATURE_MATRIX.md#f-can-032)、[F-CAN-033](FEATURE_MATRIX.md#f-can-033)、[F-CAN-034](FEATURE_MATRIX.md#f-can-034)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**前置条件**

- CPU 可编码的本地测试时间轴，未连接付费节点。

**主流程**

1. 点击导出两次并查看任务状态。
2. 等待完成，预览/下载成片并连接下游。
3. 修改剪辑，检查旧结果失效，再导出；另一次任务执行取消/失败重试。

**成功结果**

- 连续点击不重复提交，导出只覆盖本节点及依赖。
- 成功结果与时间轴内容/时长/画幅/静音一致，引用同一完整成片。
- 编辑后新连接受阻，旧连接保留；新成功结果恢复输出能力。

**异常与分支**

- 取消/错误不标成功，旧任务不覆盖新任务。
- 重启后的状态由后端任务账本和执行器证据恢复，不能自动重放副作用任务。

**测试：** [TC-CAN-029](TEST_CASES.md#tc-can-029)、[TC-CAN-035](TEST_CASES.md#tc-can-035)、[TC-CAN-036](TEST_CASES.md#tc-can-036)、[TC-CAN-037](TEST_CASES.md#tc-can-037)、[TC-CAN-038](TEST_CASES.md#tc-can-038)

<a id="uc-can-013"></a>

## UC-CAN-013 跨模式、缩放和键盘持续编辑

**角色：** 创作者。 **功能：** [F-CAN-002](FEATURE_MATRIX.md#f-can-002)、[F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-009](FEATURE_MATRIX.md#f-can-009)、[F-CAN-010](FEATURE_MATRIX.md#f-can-010)、[F-CAN-011](FEATURE_MATRIX.md#f-can-011)、[F-CAN-023](FEATURE_MATRIX.md#f-can-023)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)、[F-CAN-037](FEATURE_MATRIX.md#f-can-037)、[F-CAN-039](FEATURE_MATRIX.md#f-can-039)

**前置条件**

- 至少两个不同类型实例；视口覆盖桌面和窄窗口。

**主流程**

1. 在 50%/100%/150% 画布缩放下编辑标题、字段和菜单。
2. 用键盘访问按钮、调整手柄与媒体控件。
3. 往返原生图/画布并切换 Active/Mute/Bypass，然后删除一个实例。

**成功结果**

- 标题/端口/控件按约定缩放，菜单与焦点不被裁切。
- 文本/表格内部操作优先于画布快捷键。
- 往返和删除后无重复面板、事件、订阅、媒体播放或遗留浮层。

**异常与分支**

- 不支持的宿主能力明确报告；不能以隐藏整个控件代替修复布局。
- 两实例状态隔离，删除 A 不改变 B。

**测试：** [TC-CAN-002](TEST_CASES.md#tc-can-002)、[TC-CAN-007](TEST_CASES.md#tc-can-007)、[TC-CAN-008](TEST_CASES.md#tc-can-008)、[TC-CAN-010](TEST_CASES.md#tc-can-010)、[TC-CAN-011](TEST_CASES.md#tc-can-011)、[TC-CAN-012](TEST_CASES.md#tc-can-012)、[TC-CAN-017](TEST_CASES.md#tc-can-017)、[TC-CAN-019](TEST_CASES.md#tc-can-019)、[TC-CAN-025](TEST_CASES.md#tc-can-025)、[TC-CAN-028](TEST_CASES.md#tc-can-028)、[TC-CAN-030](TEST_CASES.md#tc-can-030)、[TC-CAN-041](TEST_CASES.md#tc-can-041)、[TC-CAN-042](TEST_CASES.md#tc-can-042)、[TC-CAN-043](TEST_CASES.md#tc-can-043)、[TC-CAN-045](TEST_CASES.md#tc-can-045)

<a id="uc-can-014"></a>

## UC-CAN-014 迁入历史工作流并完成发布验收

**角色：** 维护者/既有用户。 **功能：** [F-CAN-001](FEATURE_MATRIX.md#f-can-001)、[F-CAN-014](FEATURE_MATRIX.md#f-can-014)、[F-CAN-024](FEATURE_MATRIX.md#f-can-024)、[F-CAN-035](FEATURE_MATRIX.md#f-can-035)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)、[F-CAN-038](FEATURE_MATRIX.md#f-can-038)、[F-CAN-039](FEATURE_MATRIX.md#f-can-039)

**前置条件**

- 旧工作流、素材路径清单、旧收藏导出、宿主版本和两个旧库提交号均已冻结并备份。
- 隔离测试环境中仅启用新包；兼容 ComfyTV 的场景另设测试环境。

**主流程**

1. 导入典型纯 Canvas 与联合业务工作流。
2. 查看迁移报告，核对节点/槽位/引用/未知节点。
3. 执行无付费的打开、编辑、保存、重载、素材复用和剪辑本地导出闭环。
4. 对照发布矩阵及性能/资源验收记录签署结果。

**成功结果**

- 受支持数据完整迁入且原始文件保留；不支持项逐项可追踪。
- 未安装旧库仍可使用全部迁入能力，ComfyTV 保持可选。
- 发布报告区分自动、实际宿主、性能和未授权 provider-live 结果。

**异常与分支**

- 未知节点/版本不静默删除；失败可恢复原工作流与原数据目录。
- 未通过必须项阻止发布，不以组件构建代替产品验收。

**测试：** [TC-CAN-001](TEST_CASES.md#tc-can-001)、[TC-CAN-015](TEST_CASES.md#tc-can-015)、[TC-CAN-027](TEST_CASES.md#tc-can-027)、[TC-CAN-039](TEST_CASES.md#tc-can-039)、[TC-CAN-040](TEST_CASES.md#tc-can-040)、[TC-CAN-042](TEST_CASES.md#tc-can-042)、[TC-CAN-043](TEST_CASES.md#tc-can-043)、[TC-CAN-044](TEST_CASES.md#tc-can-044)

<a id="uc-biz-001"></a>

## UC-BIZ-001 建立并整理两个独立素材表

**角色：** 创作者。 **功能：** [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001)、[F-BIZ-002](FEATURE_MATRIX.md#f-biz-002)、[F-BIZ-003](FEATURE_MATRIX.md#f-biz-003)、[F-BIZ-004](FEATURE_MATRIX.md#f-biz-004)、[F-BIZ-008](FEATURE_MATRIX.md#f-biz-008)、[F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)

**前置条件**

- 单包已在支持的 ComfyUI 版本加载；无旧业务库依赖。
- 默认新表结构已通过源码/实际 UI/规范核对并冻结。

**主流程**

1. 在画布新建 A、B 两表；核对默认字段和行。
2. 在 A 新增文字、数字和素材字段，编辑长中文；复制、排序、删除行，调整列宽和隐藏列。
3. 复制粘贴选区，撤销/重做后保存；切换原生图、App Mode 和画布，再刷新。

**成功结果**

- A 恢复全部编辑、字段与宽度；B 未变化。
- 焦点、中文输入、选择与菜单始终可达；文档数据以原生图序列化为权威。

**异常与分支**

- 不支持的类型转换提示原因并保留旧值。
- 达到已冻结容量边界拒绝整次操作。

**测试：** [TC-BIZ-001](TEST_CASES.md#tc-biz-001)、[TC-BIZ-002](TEST_CASES.md#tc-biz-002)、[TC-BIZ-003](TEST_CASES.md#tc-biz-003)、[TC-BIZ-004](TEST_CASES.md#tc-biz-004)、[TC-BIZ-010](TEST_CASES.md#tc-biz-010)、[TC-BIZ-011](TEST_CASES.md#tc-biz-011)、[TC-BIZ-012](TEST_CASES.md#tc-biz-012)

<a id="uc-biz-002"></a>

## UC-BIZ-002 从画布填充表格并整理单元格媒体

**角色：** 创作者。 **功能：** [F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-006](FEATURE_MATRIX.md#f-biz-006)、[F-BIZ-007](FEATURE_MATRIX.md#f-biz-007)、[F-BIZ-012](FEATURE_MATRIX.md#f-biz-012)

**前置条件**

- 有单图片、单视频、单文本和包含多个素材的组；A 表已有 3 行。

**主流程**

1. 将单图片/文本分别拖到兼容列头；把多素材组拖入另一列。
2. 将组拖到行头和已有素材格，比较横向填充与单格追加结果。
3. 在同一行内重新排序/跨列移动媒体；把单个表格素材复制到空白画布。

**成功结果**

- 列广播、顺序填充、按行填充和追加遵守各自规则；源对象保持原位置。
- 媒体引用跟随稳定素材身份；复制到画布不删除源格内容。

**异常与分支**

- 含缺失媒体、不兼容字段或超容量时整次拒绝。
- 跨行移动使旧同行引用失效并阻止新生成。

**测试：** [TC-BIZ-005](TEST_CASES.md#tc-biz-005)、[TC-BIZ-006](TEST_CASES.md#tc-biz-006)、[TC-BIZ-007](TEST_CASES.md#tc-biz-007)、[TC-BIZ-008](TEST_CASES.md#tc-biz-008)、[TC-BIZ-009](TEST_CASES.md#tc-biz-009)

<a id="uc-biz-003"></a>

## UC-BIZ-003 导入 DOCX 并修正文稿映射

**角色：** 创作者。 **功能：** [F-BIZ-018](FEATURE_MATRIX.md#f-biz-018)、[F-BIZ-019](FEATURE_MATRIX.md#f-biz-019)、[F-BIZ-020](FEATURE_MATRIX.md#f-biz-020)

**前置条件**

- 有包含合并格、插入/删除修订、重复图片和表外图片的固定 DOCX 夹具。

**主流程**

1. 在解析器导入文档并查看原文来源、章节与图片顺序。
2. 手工调整字段/单元格映射，分配一张表外图片并保留另一张待处理。
3. 修改一行文字后再次导入同文件，再追加内容发生变化的新版本。
4. 撤销导入、重做、保存刷新并继续查看来源。

**成功结果**

- 重复来源不重复创建；变化版本可追踪。
- 手工编辑、行/素材 ID 和既有结果保持；inventory 与待处理项跨刷新保留。

**异常与分支**

- 坏图保留原文和错误定位。
- 活动任务、导入期间编辑或映射冲突阻止不安全覆盖。

**测试：** [TC-BIZ-022](TEST_CASES.md#tc-biz-022)、[TC-BIZ-023](TEST_CASES.md#tc-biz-023)、[TC-BIZ-024](TEST_CASES.md#tc-biz-024)

<a id="uc-biz-004"></a>

## UC-BIZ-004 从既有表格/文本文件整理分镜

**角色：** 创作者。 **功能：** [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001)、[F-BIZ-004](FEATURE_MATRIX.md#f-biz-004)、[F-BIZ-021](FEATURE_MATRIX.md#f-biz-021)

**前置条件**

- 已列出首版明确支持的格式与限制；每格式有正常和损坏夹具。

**主流程**

1. 分别导入 DOCX、电子表格、分隔文本、纯文本和 PDF 支持夹具。
2. 检查字段类型、文本换行、媒体引用与原始来源。
3. 尝试导入损坏文件后继续编辑现有表格。

**成功结果**

- 可支持内容进入统一表格契约并可保存重载。
- 错误导入不覆盖现有内容；不支持的结构明确报告。

**异常与分支**

- 扩展名受支持但内部结构不可解析时保留原表。
- 文件超过大小/容量限制时在提交前拒绝。

**测试：** [TC-BIZ-025](TEST_CASES.md#tc-biz-025)

<a id="uc-biz-005"></a>

## UC-BIZ-005 配置唯一提示词来源和同行引用

**角色：** 创作者。 **功能：** [F-BIZ-010](FEATURE_MATRIX.md#f-biz-010)、[F-BIZ-011](FEATURE_MATRIX.md#f-biz-011)、[F-BIZ-012](FEATURE_MATRIX.md#f-biz-012)、[F-BIZ-013](FEATURE_MATRIX.md#f-biz-013)、[F-BIZ-014](FEATURE_MATRIX.md#f-biz-014)

**前置条件**

- 表中含画面文本、备注、两张图片及视频；有至少两行不同内容。

**主流程**

1. 指定画面列为唯一提示词来源，插入同行文本和图片引用。
2. 设置整列模板并为第二行添加覆盖；重命名/重排列和媒体。
3. 选择首帧/尾帧，预览展开文本，再导出到外部生成节点。
4. 清空覆盖后恢复模板；取消来源并尝试生成。

**成功结果**

- 预览、导出和后端编译的文本/引用顺序一致。
- 重命名不丢引用；覆盖优先级和帧标记保持；取消来源后无提交。

**异常与分支**

- 递归引用、缺失媒体或非文本来源会显示精确位置。
- 旧冲突绑定要求显式选择，不按列序猜测。

**测试：** [TC-BIZ-003](TEST_CASES.md#tc-biz-003)、[TC-BIZ-007](TEST_CASES.md#tc-biz-007)、[TC-BIZ-013](TEST_CASES.md#tc-biz-013)、[TC-BIZ-014](TEST_CASES.md#tc-biz-014)、[TC-BIZ-015](TEST_CASES.md#tc-biz-015)、[TC-BIZ-016](TEST_CASES.md#tc-biz-016)、[TC-BIZ-017](TEST_CASES.md#tc-biz-017)

<a id="uc-biz-006"></a>

## UC-BIZ-006 优化提示词并审阅后应用

**角色：** 创作者。 **功能：** [F-BIZ-015](FEATURE_MATRIX.md#f-biz-015)、[F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)

**前置条件**

- 表有两行文本和引用锚点；选择本地假服务或白名单内的本地Qwen。
- 云端报价、预算与认证行为仅用假服务验证，不进行真实云调用。

**主流程**

1. 打开单格或整列优化设置，选择模型和处理要求。
2. 请求建议；执行过程中修改其中一行并等待所有结果。
3. 审阅成功、失败和过期项，仅应用仍匹配的建议。
4. 撤销/重做整次应用，保存刷新后查看原批次。

**成功结果**

- 未应用前原文不变；过期项不覆盖；引用锚点保留。
- 应用只形成一个编辑事务；任务事实独立于撤销历史。

**异常与分支**

- 报价过期、认证缺失、网络结果未知时停止发送并保留账本。
- 本地模型不收取/转发云凭据。

**测试：** [TC-BIZ-018](TEST_CASES.md#tc-biz-018)、[TC-BIZ-019](TEST_CASES.md#tc-biz-019)、[TC-BIZ-020](TEST_CASES.md#tc-biz-020)、[TC-BIZ-035](TEST_CASES.md#tc-biz-035)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)、[TC-BIZ-048](TEST_CASES.md#tc-biz-048)

<a id="uc-biz-007"></a>

## UC-BIZ-007 润色文本或从图片反推提示词

**角色：** 创作者。 **功能：** [F-BIZ-017](FEATURE_MATRIX.md#f-biz-017)、[F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-043](FEATURE_MATRIX.md#f-biz-043)

**前置条件**

- 有文本节点和一张用户选定图片；使用固定结果替身或白名单内的本地Qwen。

**主流程**

1. 分别选择文本润色和图片反推；核对实际输入来源。
2. 发起请求，模拟响应丢失或宿主重启后重开同任务。
3. 查看建议并决定应用到当前文本。
4. 向 LLM B 连接文本、素材组和多行表格，审阅并应用后读取结果及逐行结果槽位。

**成功结果**

- 图片反推发送选定图片而非其他预览；文本结果与原文分离。
- 同请求恢复不重复提交；未知结果清楚标识。
- 未应用时输出不可用；已应用逐行结果保留行 ID，原生图执行只读结果不重新调用模型。

**异常与分支**

- 图片过大/损坏、来源已变更或任务未完成时阻止应用。
- 本轮禁止云端及其他模型真实调用；本地Qwen能力缺失时标阻塞，不替换提供方。

**测试：** [TC-BIZ-021](TEST_CASES.md#tc-biz-021)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)、[TC-BIZ-048](TEST_CASES.md#tc-biz-048)

<a id="uc-biz-008"></a>

## UC-BIZ-008 可选 AI 归类文稿

**角色：** 创作者。 **功能：** [F-BIZ-018](FEATURE_MATRIX.md#f-biz-018)、[F-BIZ-019](FEATURE_MATRIX.md#f-biz-019)、[F-BIZ-022](FEATURE_MATRIX.md#f-biz-022)

**前置条件**

- DOCX 已导入；无 AI 配置时也可手工操作。

**主流程**

1. 先手工完成一行归类，再配置允许的服务并选择几行文本。
2. 显式点击 AI 归类，核对请求范围与返回映射。
3. 提交伪造缺行/跨行/改写的响应以检查拒绝行为。

**成功结果**

- 只有选中文本和来源 ID 被发送，图片不发送。
- 合法归类仅更新分类建议；非法结果不改原文/草稿。

**异常与分支**

- 无配置、超时、结构不合法时保留完整手工流程。

**测试：** [TC-BIZ-026](TEST_CASES.md#tc-biz-026)

<a id="uc-biz-009"></a>

## UC-BIZ-009 在表格中按行批量生成图片或视频

**角色：** 创作者。 **功能：** [F-BIZ-023](FEATURE_MATRIX.md#f-biz-023)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)、[F-BIZ-026](FEATURE_MATRIX.md#f-biz-026)、[F-BIZ-027](FEATURE_MATRIX.md#f-biz-027)、[F-BIZ-028](FEATURE_MATRIX.md#f-biz-028)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**前置条件**

- 有有效提示词来源、素材引用和生成列；测试默认使用不付费执行替身。

**主流程**

1. 配置模型、模式及参数；只选择两行，提交前检查范围。
2. 让结果逆序返回；生成期间编辑一行输入。
3. 查看结果、过期状态和错误行；取消选择后生成有效空结果行。

**成功结果**

- 任务按稳定行/列/request 身份写回；返回顺序不影响目标。
- 修改后的行不被旧结果覆盖；已有结果保留至新结果成功。

**异常与分支**

- 任一明确选中行预检不通过时全批不提交。
- 模型缺失、错媒体类型或缺帧时给出可操作错误。

**测试：** [TC-BIZ-002](TEST_CASES.md#tc-biz-002)、[TC-BIZ-020](TEST_CASES.md#tc-biz-020)、[TC-BIZ-027](TEST_CASES.md#tc-biz-027)、[TC-BIZ-029](TEST_CASES.md#tc-biz-029)、[TC-BIZ-030](TEST_CASES.md#tc-biz-030)、[TC-BIZ-031](TEST_CASES.md#tc-biz-031)、[TC-BIZ-032](TEST_CASES.md#tc-biz-032)、[TC-BIZ-033](TEST_CASES.md#tc-biz-033)、[TC-BIZ-038](TEST_CASES.md#tc-biz-038)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)、[TC-BIZ-047](TEST_CASES.md#tc-biz-047)

<a id="uc-biz-010"></a>

## UC-BIZ-010 用独立生成节点处理表格任务或连线输入

**角色：** 创作者。 **功能：** [F-BIZ-024](FEATURE_MATRIX.md#f-biz-024)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)、[F-BIZ-041](FEATURE_MATRIX.md#f-biz-041)、[F-BIZ-042](FEATURE_MATRIX.md#f-biz-042)

**前置条件**

- 表内有唯一提示词和帧绑定；创建两个独立生成节点。

**主流程**

1. 把表格导入/连接到两个节点，修改其中一个任务的允许字段。
2. 在源表改文字和帧绑定，再撤销；检查两个节点同步。
3. 断开源或删除源行，尝试新提交；恢复源后读取已完成结果的原生输出。

**成功结果**

- 同步只更新匹配身份与允许字段，节点专有设置/已有结果保留。
- 断开时保留来源信息并阻止新提交；原生输出读取完成结果不重复执行。

**异常与分支**

- 源失效、旧快照或无完成结果明确报错。
- 投影文档不重复拥有远端任务轮询。

**测试：** [TC-BIZ-017](TEST_CASES.md#tc-biz-017)、[TC-BIZ-028](TEST_CASES.md#tc-biz-028)、[TC-BIZ-029](TEST_CASES.md#tc-biz-029)、[TC-BIZ-030](TEST_CASES.md#tc-biz-030)、[TC-BIZ-032](TEST_CASES.md#tc-biz-032)、[TC-BIZ-042](TEST_CASES.md#tc-biz-042)、[TC-BIZ-049](TEST_CASES.md#tc-biz-049)

<a id="uc-biz-011"></a>

## UC-BIZ-011 中断后恢复原任务和下载

**角色：** 创作者。 **功能：** [F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-031](FEATURE_MATRIX.md#f-biz-031)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)、[F-BIZ-038](FEATURE_MATRIX.md#f-biz-038)

**前置条件**

- 账本中分别有已提交、提交响应未知、已完成但下载失败、本地队列丢失和旧 LibTV 记录。

**主流程**

1. 关闭前端并重新打开，再重启宿主读取各状态。
2. 对有远端 ID 的任务恢复查询/下载，对无 ID 的未知任务查看处理提示。
3. 替换或删除结果文件后再次请求状态；查看历史完成结果。

**成功结果**

- 恢复仅连接原执行；下载失败不会发起第二次生成。
- 文件不完整不能标成功；退役任务仅可读取历史完成结果。

**异常与分支**

- 未知执行无安全查询方式时禁止自动重发。
- 本地任务不在队列/历史时要求显式重新生成。

**测试：** [TC-BIZ-033](TEST_CASES.md#tc-biz-033)、[TC-BIZ-034](TEST_CASES.md#tc-biz-034)、[TC-BIZ-035](TEST_CASES.md#tc-biz-035)、[TC-BIZ-036](TEST_CASES.md#tc-biz-036)、[TC-BIZ-038](TEST_CASES.md#tc-biz-038)、[TC-BIZ-044](TEST_CASES.md#tc-biz-044)、[TC-BIZ-046](TEST_CASES.md#tc-biz-046)

<a id="uc-biz-012"></a>

## UC-BIZ-012 暂停一批任务并继续

**角色：** 创作者。 **功能：** [F-BIZ-023](FEATURE_MATRIX.md#f-biz-023)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-032](FEATURE_MATRIX.md#f-biz-032)、[F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)

**前置条件**

- A、B 两表均有等待和执行中任务；区分本地/云端能力。

**主流程**

1. 暂停 A 的一个任务或整列；观察 B。
2. 在本地执行器确认中断后点击继续；对云端观察已提交任务完成。
3. 服务重启后查看暂停记录并显式继续。

**成功结果**

- 未发送项停止；B 不受影响。
- 本地继续明确重跑当前行；云端已提交任务不伪装为取消或退款。

**异常与分支**

- 中断未确认时显示暂停中，不提前宣告完成。
- 资源隔离未解除时保留暂停及恢复说明。

**测试：** [TC-BIZ-037](TEST_CASES.md#tc-biz-037)

<a id="uc-biz-013"></a>

## UC-BIZ-013 查看任务汇总并把结果送往后续创作

**角色：** 创作者。 **功能：** [F-BIZ-034](FEATURE_MATRIX.md#f-biz-034)、[F-BIZ-036](FEATURE_MATRIX.md#f-biz-036)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**前置条件**

- 有成功、失败、等待、未知及多个历史结果的混合任务表。

**主流程**

1. 观察表级/节点级任务快照及单行阶段，打开原错误信息。
2. 将当前/历史结果追加到格内，再按任务输出到画布素材组。
3. 预览媒体并将生成结果作为另一个生成列的输入。

**成功结果**

- 统计不把失败/过期当成功；无提供方百分比时不编造百分比。
- 组名、任务顺序与媒体顺序可追踪；重复追加不重复素材。

**异常与分支**

- 历史文件缺失提示恢复，不创建空成功结果。
- 再次引用不自动执行下游。

**测试：** [TC-BIZ-036](TEST_CASES.md#tc-biz-036)、[TC-BIZ-038](TEST_CASES.md#tc-biz-038)、[TC-BIZ-039](TEST_CASES.md#tc-biz-039)、[TC-BIZ-042](TEST_CASES.md#tc-biz-042)

<a id="uc-biz-014"></a>

## UC-BIZ-014 在资源受限环境运行多个创作任务

**角色：** 创作者。 **功能：** [F-BIZ-027](FEATURE_MATRIX.md#f-biz-027)、[F-BIZ-028](FEATURE_MATRIX.md#f-biz-028)、[F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)、[F-BIZ-034](FEATURE_MATRIX.md#f-biz-034)

**前置条件**

- 有本地 Qwen、H3 和原生 Comfy 队列执行替身；可记录 GPU 租约和并发峰值。

**主流程**

1. 同时从多个节点提交云端和本地任务。
2. 让一行失败、一次卸载超时，并尝试原生图任务入队。
3. 恢复资源后继续其余任务并检查等待/失败反馈。

**成功结果**

- 云与本地遵守各自共享预算；本地 GPU 争用受到统一门控。
- 一个失败不阻塞其他独立任务；不可安全卸载时隔离并明确处理。

**异常与分支**

- 缺模型或设备不足不自动换模型。
- 性能和实际设备上限需单独测量，不直接照搬旧并发 32。

**测试：** [TC-BIZ-031](TEST_CASES.md#tc-biz-031)、[TC-BIZ-040](TEST_CASES.md#tc-biz-040)、[TC-BIZ-041](TEST_CASES.md#tc-biz-041)、[TC-BIZ-047](TEST_CASES.md#tc-biz-047)

<a id="uc-biz-015"></a>

## UC-BIZ-015 迁移旧创作工作流、任务记录与素材

**角色：** 创作者。 **功能：** [F-BIZ-037](FEATURE_MATRIX.md#f-biz-037)、[F-BIZ-038](FEATURE_MATRIX.md#f-biz-038)、[F-BIZ-039](FEATURE_MATRIX.md#f-biz-039)、[F-BIZ-040](FEATURE_MATRIX.md#f-biz-040)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-044](FEATURE_MATRIX.md#f-biz-044)

**前置条件**

- 已备份原工作流、关联素材、生成 JSON 回执和优化 SQLite 数据；旧环境可回退。

**主流程**

1. 运行只读迁移预检并列出旧节点、槽位、素材和任务身份。
2. 在新包隔离环境导入，检查混合旧业务依赖与退役通道提示。
3. 保存新副本后重载，查看历史结果并尝试安全恢复原任务。
4. 读取旧 GPTImageStoryboardStage 与 LLM A/C/D/E 数据；预览并显式选择转换到统一表格/LLM B。

**成功结果**

- 创作节点、端口、行列/素材 ID、结果和任务关联完整保留。
- 混合徽章/展厅/分割节点明确列外部依赖，不删除；旧环境可继续使用备份。
- 旧独立执行/原型入口不继续生产注册；转换可审阅且保留原件。

**异常与分支**

- 同 ID 重复注册、未知 schema 或文件缺失使迁移停止并报告。
- 退役旧任务不自动转换为新收费任务。

**测试：** [TC-BIZ-013](TEST_CASES.md#tc-biz-013)、[TC-BIZ-034](TEST_CASES.md#tc-biz-034)、[TC-BIZ-043](TEST_CASES.md#tc-biz-043)、[TC-BIZ-044](TEST_CASES.md#tc-biz-044)、[TC-BIZ-050](TEST_CASES.md#tc-biz-050)

<a id="uc-biz-016"></a>

## UC-BIZ-016 长期编辑与大表格操作

**角色：** 创作者。 **功能：** [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001)、[F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-008](FEATURE_MATRIX.md#f-biz-008)、[F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)、[F-BIZ-034](FEATURE_MATRIX.md#f-biz-034)、[F-BIZ-041](FEATURE_MATRIX.md#f-biz-041)

**前置条件**

- 在固定机器、固定 Comfy 版本和视口上准备 500 行/64 列上限夹具及大量缩略图；阈值在 M0 性能基线中批准。
- 统一压力夹具包含2张和10张各500行的表；单表上限仍为500行/64列。

**主流程**

1. 连续执行表格编辑、筛选可见内容/滚动、模式切换、删除和恢复实例。
2. 开闭媒体预览并运行任务状态替身，重复 20 轮。
3. 采集输入到绘制延迟、长任务、内存、监听/订阅数量及响应体规模。

**成功结果**

- 满足批准的 p95 响应与内存预算；卸载后资源回到基线允许范围。
- 文档、任务和媒体身份在长时操作后仍一致。

**异常与分支**

- 超预算保留复现夹具与 trace，不能用掩盖内容或放弃保存兼容通过。

**测试：** [TC-BIZ-008](TEST_CASES.md#tc-biz-008)、[TC-BIZ-012](TEST_CASES.md#tc-biz-012)、[TC-BIZ-039](TEST_CASES.md#tc-biz-039)、[TC-BIZ-045](TEST_CASES.md#tc-biz-045)、[TC-BIZ-049](TEST_CASES.md#tc-biz-049)

<a id="uc-sys-001"></a>

## UC-SYS-001 在干净ComfyUI安装并开始创作

**角色：** 安装者。 **功能：** [F-SYS-001](FEATURE_MATRIX.md#f-sys-001)、[F-SYS-002](FEATURE_MATRIX.md#f-sys-002)、[F-SYS-003](FEATURE_MATRIX.md#f-sys-003)、[F-SYS-006](FEATURE_MATRIX.md#f-sys-006)、[F-SYS-009](FEATURE_MATRIX.md#f-sys-009)、[F-SYS-015](FEATURE_MATRIX.md#f-sys-015)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)

**前置条件**

- 隔离ComfyUI及空白用户目录
- 只取得新发布包

**主流程**

1. 安装新包并启动
2. 创建两个素材实例与文本
3. 保存、刷新并重开

**成功结果**

- 只有一个画布入口
- 核心功能不要求可选凭据
- 实例和内容恢复

**异常与分支**

- 旧包冲突需显式处理
- 缺可选能力只影响对应操作

**测试：** [TC-SYS-001](TEST_CASES.md#tc-sys-001)、[TC-SYS-002](TEST_CASES.md#tc-sys-002)、[TC-SYS-004](TEST_CASES.md#tc-sys-004)、[TC-SYS-030](TEST_CASES.md#tc-sys-030)、[TC-SYS-031](TEST_CASES.md#tc-sys-031)

<a id="uc-sys-002"></a>

## UC-SYS-002 跨模式编辑与任务事实隔离

**角色：** 创作者。 **功能：** [F-SYS-003](FEATURE_MATRIX.md#f-sys-003)、[F-SYS-005](FEATURE_MATRIX.md#f-sys-005)、[F-SYS-006](FEATURE_MATRIX.md#f-sys-006)

**前置条件**

- 存在两个不同工作流会话和一个假执行中任务

**主流程**

1. 编辑节点及表格并撤销重做
2. 在Graph与画布间切换
3. 切到另一工作流后让旧任务返回

**成功结果**

- 编辑事务正确
- 执行身份不回退
- 旧回调不覆盖另一工作流

**异常与分支**

- 删除节点后结果仅保留账本，不重建已删节点

**测试：** [TC-SYS-004](TEST_CASES.md#tc-sys-004)、[TC-SYS-005](TEST_CASES.md#tc-sys-005)、[TC-SYS-006](TEST_CASES.md#tc-sys-006)、[TC-SYS-027](TEST_CASES.md#tc-sys-027)

<a id="uc-sys-003"></a>

## UC-SYS-003 完成分镜到成片的创作

**角色：** 创作者。 **功能：** [F-SYS-005](FEATURE_MATRIX.md#f-sys-005)、[F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-008](FEATURE_MATRIX.md#f-sys-008)、[F-SYS-010](FEATURE_MATRIX.md#f-sys-010)、[F-SYS-017](FEATURE_MATRIX.md#f-sys-017)

**前置条件**

- 自建分镜和媒体夹具
- 可控假提供方
- 真实生成版本只可替换为本地Qwen/MiniMax；其他通道继续使用假服务。

**主流程**

1. 导入分镜并修正映射
2. 配置提示词与表内/表外生成
3. 将结果输出为组接入剪辑
4. 导出后保存并重开

**成功结果**

- 输入/生成/结果来源可追踪
- 成片与剪辑设置一致
- 重开可继续编辑且不重发任务

**异常与分支**

- 失败行独立可恢复
- 失效成片阻止新连接但保留已有引用证据

**测试：** [TC-SYS-029](TEST_CASES.md#tc-sys-029)、[TC-SYS-032](TEST_CASES.md#tc-sys-032)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)

<a id="uc-sys-004"></a>

## UC-SYS-004 网络或服务重启后恢复原任务

**角色：** 创作者。 **功能：** [F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-011](FEATURE_MATRIX.md#f-sys-011)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**前置条件**

- 假提供方可记录create次数和远端ID

**主流程**

1. 提交任务并注入断网或重启
2. 重开工作流查看状态
3. 按能力恢复查询或下载

**成功结果**

- 远端身份保持
- 结果未知有明确提示
- 生成create次数不增加

**异常与分支**

- 提供方无查询能力时保持unknown，不声称自动恢复成功

**测试：** [TC-SYS-006](TEST_CASES.md#tc-sys-006)、[TC-SYS-016](TEST_CASES.md#tc-sys-016)、[TC-SYS-017](TEST_CASES.md#tc-sys-017)、[TC-SYS-035](TEST_CASES.md#tc-sys-035)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)

<a id="uc-sys-005"></a>

## UC-SYS-005 将旧创作环境迁入新包

**角色：** 迁移执行者。 **功能：** [F-SYS-008](FEATURE_MATRIX.md#f-sys-008)、[F-SYS-013](FEATURE_MATRIX.md#f-sys-013)、[F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-015](FEATURE_MATRIX.md#f-sys-015)、[F-SYS-020](FEATURE_MATRIX.md#f-sys-020)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)、[F-OUT-001](FEATURE_MATRIX.md#f-out-001)、[F-OUT-002](FEATURE_MATRIX.md#f-out-002)、[F-OUT-003](FEATURE_MATRIX.md#f-out-003)、[F-OUT-004](FEATURE_MATRIX.md#f-out-004)、[F-OUT-005](FEATURE_MATRIX.md#f-out-005)、[F-OUT-006](FEATURE_MATRIX.md#f-out-006)、[F-OUT-007](FEATURE_MATRIX.md#f-out-007)、[F-OUT-008](FEATURE_MATRIX.md#f-out-008)、[F-OUT-009](FEATURE_MATRIX.md#f-out-009)、[F-OUT-010](FEATURE_MATRIX.md#f-out-010)、[F-OUT-011](FEATURE_MATRIX.md#f-out-011)、[F-OUT-012](FEATURE_MATRIX.md#f-out-012)、[F-OUT-013](FEATURE_MATRIX.md#f-out-013)、[F-OUT-014](FEATURE_MATRIX.md#f-out-014)

**前置条件**

- 固定旧版本的脱敏数据副本
- 工作流/媒体/收藏/回执齐全

**主流程**

1. 运行预检与dry-run
2. 处理在途任务并备份
3. 停用旧包后迁移到新包
4. 重开、编辑、保存再重开

**成功结果**

- 原始数据保全
- 收藏和资产引用可用
- 未知节点报告且原JSON保留
- 重复迁移不重复数据

**异常与分支**

- 缺失文件或不可恢复在途任务阻止相关切换，不伪造成功

**测试：** [TC-SYS-002](TEST_CASES.md#tc-sys-002)、[TC-SYS-008](TEST_CASES.md#tc-sys-008)、[TC-SYS-009](TEST_CASES.md#tc-sys-009)、[TC-SYS-010](TEST_CASES.md#tc-sys-010)、[TC-SYS-011](TEST_CASES.md#tc-sys-011)、[TC-SYS-012](TEST_CASES.md#tc-sys-012)、[TC-SYS-013](TEST_CASES.md#tc-sys-013)、[TC-SYS-014](TEST_CASES.md#tc-sys-014)、[TC-SYS-020](TEST_CASES.md#tc-sys-020)、[TC-SYS-025](TEST_CASES.md#tc-sys-025)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)、[TC-SYS-035](TEST_CASES.md#tc-sys-035)

<a id="uc-sys-006"></a>

## UC-SYS-006 升级失败后回滚并保全新数据

**角色：** 迁移执行者。 **功能：** [F-SYS-013](FEATURE_MATRIX.md#f-sys-013)、[F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)

**前置条件**

- 有迁移前备份
- 新版本已产生少量新工作流或结果

**主流程**

1. 导出新数据保全包
2. 停服务并恢复旧代码与旧数据副本
3. 启动旧环境核对样本

**成功结果**

- 旧流程可继续
- 新数据保全包未被覆盖
- 不自动覆盖用户原目录

**异常与分支**

- 旧版无法读取新schema时不直接降写，保留可读说明和原数据

**测试：** [TC-SYS-012](TEST_CASES.md#tc-sys-012)、[TC-SYS-015](TEST_CASES.md#tc-sys-015)

<a id="uc-sys-007"></a>

## UC-SYS-007 在缺少可选提供方时继续工作

**角色：** 创作者。 **功能：** [F-SYS-001](FEATURE_MATRIX.md#f-sys-001)、[F-SYS-009](FEATURE_MATRIX.md#f-sys-009)、[F-SYS-018](FEATURE_MATRIX.md#f-sys-018)

**前置条件**

- 未配置云凭据/本地模型/ComfyTV

**主流程**

1. 启动并上传编组编辑表格
2. 查看生成配置与能力状态
3. 尝试不可用组合

**成功结果**

- 基础编辑可用
- 不可用原因准确
- 禁止执行入口不会提交任务

**异常与分支**

- 配置可用后按能力刷新，不要求重建全部文档

**测试：** [TC-SYS-001](TEST_CASES.md#tc-sys-001)、[TC-SYS-007](TEST_CASES.md#tc-sys-007)、[TC-SYS-033](TEST_CASES.md#tc-sys-033)

<a id="uc-sys-008"></a>

## UC-SYS-008 管理多种资源的排队任务

**角色：** 创作者。 **功能：** [F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-010](FEATURE_MATRIX.md#f-sys-010)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**前置条件**

- 已设GPU/云/转码额度
- 100个假任务

**主流程**

1. 混合提交各资源任务
2. 暂停未派发项并取消指定排队项
3. 观察其他资源任务与健康查询

**成功结果**

- 额度不超限
- 取消排队项不派发
- 其他资源继续前进

**异常与分支**

- 远端不支持取消时说明仍在执行，不假报已取消

**测试：** [TC-SYS-018](TEST_CASES.md#tc-sys-018)、[TC-SYS-019](TEST_CASES.md#tc-sys-019)、[TC-SYS-028](TEST_CASES.md#tc-sys-028)

<a id="uc-sys-009"></a>

## UC-SYS-009 导出可定位且脱敏的诊断

**角色：** 维护者。 **功能：** [F-SYS-006](FEATURE_MATRIX.md#f-sys-006)、[F-SYS-011](FEATURE_MATRIX.md#f-sys-011)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)、[F-SYS-020](FEATURE_MATRIX.md#f-sys-020)

**前置条件**

- 存在一次假提供方失败和版本信息

**主流程**

1. 按requestId查看错误阶段
2. 导出诊断
3. 按提示恢复原任务

**成功结果**

- 可关联输入版本和远端ID
- 无凭据、用户原始正文或非必要私密素材
- 用户能分辨重试查询与新生成

**异常与分支**

- 日志损坏或版本不匹配时保留原始错误，不掩盖为通用成功

**测试：** [TC-SYS-020](TEST_CASES.md#tc-sys-020)、[TC-SYS-021](TEST_CASES.md#tc-sys-021)、[TC-SYS-022](TEST_CASES.md#tc-sys-022)

<a id="uc-sys-010"></a>

## UC-SYS-010 长时间处理大型创作项目

**角色：** 创作者。 **功能：** [F-SYS-010](FEATURE_MATRIX.md#f-sys-010)、[F-SYS-012](FEATURE_MATRIX.md#f-sys-012)

**前置条件**

- 固定E6参考机和性能夹具

**主流程**

1. 连续拖动、缩放、编辑
2. 反复创建销毁实例和切换模式
3. 执行长时混合任务

**成功结果**

- 响应达到预算
- 释放资源回到基线
- 保存与恢复无数据丢失

**异常与分支**

- 压力场景降级仍可取消与保存

**测试：** [TC-SYS-023](TEST_CASES.md#tc-sys-023)、[TC-SYS-024](TEST_CASES.md#tc-sys-024)、[TC-SYS-025](TEST_CASES.md#tc-sys-025)、[TC-SYS-026](TEST_CASES.md#tc-sys-026)、[TC-SYS-027](TEST_CASES.md#tc-sys-027)、[TC-SYS-028](TEST_CASES.md#tc-sys-028)、[TC-SYS-029](TEST_CASES.md#tc-sys-029)

<a id="uc-sys-011"></a>

## UC-SYS-011 维护可追踪的单产品版本

**角色：** 开发与发布维护者。 **功能：** [F-SYS-002](FEATURE_MATRIX.md#f-sys-002)、[F-SYS-004](FEATURE_MATRIX.md#f-sys-004)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)、[F-SYS-017](FEATURE_MATRIX.md#f-sys-017)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)

**前置条件**

- 功能F/UC/TC清单与固定源基线

**主流程**

1. 实现一项跨模块功能
2. 运行相关门禁
3. 打包并在干净机器安装
4. 登记验收证据与发布范围

**成功结果**

- 一个版本覆盖前后端
- 发布记录区分能力保留/协议验证与本轮本地Qwen/MiniMax实测；不把其他通道标为本轮真实验收通过
- 新需求只在新库维护

**异常与分支**

- 缺少必测环境标阻塞，不用不适用绕过

**测试：** [TC-SYS-003](TEST_CASES.md#tc-sys-003)、[TC-SYS-030](TEST_CASES.md#tc-sys-030)、[TC-SYS-031](TEST_CASES.md#tc-sys-031)、[TC-SYS-034](TEST_CASES.md#tc-sys-034)、[TC-SYS-036](TEST_CASES.md#tc-sys-036)
