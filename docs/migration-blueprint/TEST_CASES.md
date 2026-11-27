# 创作画布迁移测试用例

本文件由 `catalog/*.json` 生成；修改目录中的源数据后运行 `node docs/migration-blueprint/render_catalog.mjs --write`。不要单独修改生成表。

共 131 个测试定义。统一状态：**规格已定义；自动化与产品执行状态均待实施/待执行**。自动化列是目标执行方式，既有覆盖是复用候选，不表示此测试已经实现或运行。测试环境、夹具、公共前端矩阵、性能预算和证据格式见 [测试策略](TEST_STRATEGY.md)。

每个界面测试都叠加两实例、模式切换、保存重载、焦点溢出和相关缩放检查；表内和表外生成都需覆盖。真实生成仅使用本地 Qwen/MiniMax；其他通道只做协议模拟，不能据此声明真实效果通过。

| 编号 | 测试 | 阶段 | 优先级 | 层级 | 方式 | 执行策略 |
| --- | --- | --- | --- | --- | --- | --- |
| [TC-CAN-001](TEST_CASES.md#tc-can-001) | 单包独立启动与重复注册冲突诊断 | M1 | P0 | host | 自动 | 不付费 |
| [TC-CAN-002](TEST_CASES.md#tc-can-002) | 模式往返保持同一原生图与面板归属 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-003](TEST_CASES.md#tc-can-003) | 三处新建菜单一致且新建可撤销 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-004](TEST_CASES.md#tc-can-004) | 批量上传顺序与部分格式拒绝 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-005](TEST_CASES.md#tc-can-005) | 替换成功提交、失败回滚及跨类型拒绝 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-006](TEST_CASES.md#tc-can-006) | 上传迟到回包不得覆盖新状态 | M2 | P0 | host | 自动 | 不付费 |
| [TC-CAN-007](TEST_CASES.md#tc-can-007) | 素材比例、长标题和控件缩放视觉基线 | M2 | P1 | host | 混合 | 不付费 |
| [TC-CAN-008](TEST_CASES.md#tc-can-008) | 视频控制不拖动节点且实例独立 | M2 | P1 | host | 混合 | 不付费 |
| [TC-CAN-009](TEST_CASES.md#tc-can-009) | 文本组合输入、STRING 输出和收藏快照 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-010](TEST_CASES.md#tc-can-010) | 自动/手工重命名、取消与组内身份保持 | M2 | P1 | host | 混合 | 不付费 |
| [TC-CAN-011](TEST_CASES.md#tc-can-011) | 视口坐标映射与导航不污染编辑历史 | M2 | P0 | domain | 自动 | 不付费 |
| [TC-CAN-012](TEST_CASES.md#tc-can-012) | 选择/拖动状态机与 pointercancel 清理 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-013](TEST_CASES.md#tc-can-013) | 选区复制重映射与外部连接隔离 | M2 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-014](TEST_CASES.md#tc-can-014) | 跨节点事务和派生修改保持撤销一致 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-015](TEST_CASES.md#tc-can-015) | 保存格式与无运行态泄漏的往返 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-CAN-016](TEST_CASES.md#tc-can-016) | 混合素材组快照顺序、克隆隔离和未就绪语义 | M2 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-017](TEST_CASES.md#tc-can-017) | 组排列、颜色序号与工具栏跟随 | M2 | P1 | host | 混合 | 不付费 |
| [TC-CAN-018](TEST_CASES.md#tc-can-018) | 锁定、收起、删除与解散的恢复语义 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-019](TEST_CASES.md#tc-can-019) | Slot 磁吸、屏幕命中与实例互斥 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-020](TEST_CASES.md#tc-can-020) | 真实类型兼容、用途选择与首个空输入 | M2 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-021](TEST_CASES.md#tc-can-021) | 连线删除、取消与减少动态效果 | M2 | P0 | host | 混合 | 不付费 |
| [TC-CAN-022](TEST_CASES.md#tc-can-022) | 一次素材填充的原子性与命中优先级 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-023](TEST_CASES.md#tc-can-023) | 结果分组输出与本地文件引用完整性 | M3 | P0 | host | 混合 | 不付费 |
| [TC-CAN-024](TEST_CASES.md#tc-can-024) | 单素材拖出与迟到验证回包 | M3 | P0 | host | 自动 | 不付费 |
| [TC-CAN-025](TEST_CASES.md#tc-can-025) | 面板 lease、宽度取消和 fullHeight 合同 | M1 | P0 | host | 混合 | 不付费 |
| [TC-CAN-026](TEST_CASES.md#tc-can-026) | 收藏去重、文本快照与数据异常不覆盖 | M2 | P0 | domain | 自动 | 不付费 |
| [TC-CAN-027](TEST_CASES.md#tc-can-027) | 旧浏览器收藏迁入后端目录且可回滚 | M2 | P0 | migration | 自动 | 不付费 |
| [TC-CAN-028](TEST_CASES.md#tc-can-028) | 资产库筛选搜索、焦点恢复与失效阻止 | M2 | P1 | host | 混合 | 不付费 |
| [TC-CAN-029](TEST_CASES.md#tc-can-029) | 任务快照真实状态、计数和通知消退 | M4 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-030](TEST_CASES.md#tc-can-030) | 模式停用、恢复和实例释放 | M5 | P0 | host | 混合 | 不付费 |
| [TC-CAN-031](TEST_CASES.md#tc-can-031) | 剪辑按节点身份同步与手工删除保持 | M5 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-032](TEST_CASES.md#tc-can-032) | 时间轴编辑帧边界与撤销等价性 | M5 | P0 | domain | 自动 | 不付费 |
| [TC-CAN-033](TEST_CASES.md#tc-can-033) | 剪辑派生同步与图删除共用一次历史 | M5 | P0 | host | 混合 | 不付费 |
| [TC-CAN-034](TEST_CASES.md#tc-can-034) | 预览时间、连续播放与异步画面保留 | M5 | P1 | host | 混合 | 不付费 |
| [TC-CAN-035](TEST_CASES.md#tc-can-035) | 预览代理尺寸、缓存复用、失效和取消 | M5 | P0 | backend | 自动 | 不付费 |
| [TC-CAN-036](TEST_CASES.md#tc-can-036) | 预览与导出画幅、适配和音轨一致 | M5 | P0 | backend | 混合 | 不付费 |
| [TC-CAN-037](TEST_CASES.md#tc-can-037) | 导出重复点击、定向取消和重启恢复 | M5 | P0 | backend | 自动 | 不付费 |
| [TC-CAN-038](TEST_CASES.md#tc-can-038) | 编辑版本使旧成片失效但保留连接 | M5 | P0 | host | 混合 | 不付费 |
| [TC-CAN-039](TEST_CASES.md#tc-can-039) | ComfyTV 可选安装与未知节点保留 | M6 | P1 | host | 混合 | 不付费 |
| [TC-CAN-040](TEST_CASES.md#tc-can-040) | 素材路径边界、input/output 区分与端点拒绝 | M5 | P0 | backend | 自动 | 不付费 |
| [TC-CAN-041](TEST_CASES.md#tc-can-041) | 画布/资产库交互性能预算 | M2 | P1 | performance | 自动 | 不付费 |
| [TC-CAN-042](TEST_CASES.md#tc-can-042) | 宿主能力缺失诊断与架构边界扫描 | M1 | P0 | contract | 自动 | 不付费 |
| [TC-CAN-043](TEST_CASES.md#tc-can-043) | 离线资源、共享组件状态与样式隔离 | M1 | P1 | host | 混合 | 不付费 |
| [TC-CAN-044](TEST_CASES.md#tc-can-044) | 历史金样迁移与完整无付费闭环 | M6 | P0 | migration | 混合 | 不付费 |
| [TC-CAN-045](TEST_CASES.md#tc-can-045) | 生命周期压力与资源回收预算 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-BIZ-001](TEST_CASES.md#tc-biz-001) | 表格增删改排序与工作流序列化往返 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-002](TEST_CASES.md#tc-biz-002) | 复制行与复制节点不继承任务执行身份 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-003](TEST_CASES.md#tc-biz-003) | 字段转换与稳定引用的原子保护 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-004](TEST_CASES.md#tc-biz-004) | 表内范围选择、剪贴板与中文输入 | M3 | P1 | host | 混合 | 不付费 |
| [TC-BIZ-005](TEST_CASES.md#tc-biz-005) | 单素材广播与多素材顺序填列 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-006](TEST_CASES.md#tc-biz-006) | 行头/单格填充及容量错误不部分写入 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-007](TEST_CASES.md#tc-biz-007) | 媒体移动和重排不误绑定提示词 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-008](TEST_CASES.md#tc-biz-008) | 多媒体单元格预览与交互释放 | M3 | P1 | host | 混合 | 不付费 |
| [TC-BIZ-009](TEST_CASES.md#tc-biz-009) | 表格素材复制到画布的来源校验 | M3 | P0 | contract | 混合 | 不付费 |
| [TC-BIZ-010](TEST_CASES.md#tc-biz-010) | 新建默认结构与历史规范差异冻结 | M3 | P0 | host | 混合 | 不付费 |
| [TC-BIZ-011](TEST_CASES.md#tc-biz-011) | 表格尺寸、边缘菜单和最后行列删除 | M3 | P0 | host | 混合 | 不付费 |
| [TC-BIZ-012](TEST_CASES.md#tc-biz-012) | 两实例、模式往返与卸载完整性 | M4 | P0 | host | 混合 | 不付费 |
| [TC-BIZ-013](TEST_CASES.md#tc-biz-013) | 唯一来源旧绑定迁移、取消与复制 | M3 | P0 | migration | 自动 | 不付费 |
| [TC-BIZ-014](TEST_CASES.md#tc-biz-014) | 同行文本引用解析与异常定位 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-015](TEST_CASES.md#tc-biz-015) | 媒体引用与首尾帧顺序的一致性 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-016](TEST_CASES.md#tc-biz-016) | 模板、行覆盖和清空/恢复语义 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-017](TEST_CASES.md#tc-biz-017) | 预览、表格导出和后端编译逐项相等 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-018](TEST_CASES.md#tc-biz-018) | 优化建议审阅与批量应用事务 | M3 | P0 | host | 混合 | 不付费 |
| [TC-BIZ-019](TEST_CASES.md#tc-biz-019) | 优化异步结果的修订、切换与删除保护 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-020](TEST_CASES.md#tc-biz-020) | 提供方报价、预算和认证不进入工作流 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-021](TEST_CASES.md#tc-biz-021) | 画布润色和反推纳入持久账本 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-022](TEST_CASES.md#tc-biz-022) | DOCX 修订、合并单元格和图片出现顺序 | M3 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-023](TEST_CASES.md#tc-biz-023) | 映射修订和 inventory 跨刷新恢复 | M3 | P0 | migration | 自动 | 不付费 |
| [TC-BIZ-024](TEST_CASES.md#tc-biz-024) | 追加去重、导入竞态和活动任务保护 | M3 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-025](TEST_CASES.md#tc-biz-025) | 各支持文件格式的真实解析夹具 | M3 | P1 | backend | 自动 | 不付费 |
| [TC-BIZ-026](TEST_CASES.md#tc-biz-026) | AI 归类的发送范围和结构拒绝 | M3 | P1 | backend | 自动 | 不付费 |
| [TC-BIZ-027](TEST_CASES.md#tc-biz-027) | 生成行选择、配置草稿和全批预检 | M4 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-028](TEST_CASES.md#tc-biz-028) | 表格与外部生成节点双向同步及断开 | M4 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-029](TEST_CASES.md#tc-biz-029) | 型号、模式和媒体能力前后端一致 | M4 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-030](TEST_CASES.md#tc-biz-030) | Comfy 原生图校验、认证隔离和错误分类 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-031](TEST_CASES.md#tc-biz-031) | 本地 Qwen 构图、缺依赖与结果验证 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-032](TEST_CASES.md#tc-biz-032) | 本地 H3 三模式与帧绑定回归 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-033](TEST_CASES.md#tc-biz-033) | 幂等指纹、冻结媒体与重复提交 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-034](TEST_CASES.md#tc-biz-034) | 多种旧任务存储迁移与崩溃恢复 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-BIZ-035](TEST_CASES.md#tc-biz-035) | 提交结果未知时禁止自动重发 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-036](TEST_CASES.md#tc-biz-036) | 下载失败、文件缺失和有界恢复 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-037](TEST_CASES.md#tc-biz-037) | 暂停范围、本地中断和云任务继续 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-038](TEST_CASES.md#tc-biz-038) | 逆序完成、过期结果、历史追加与撤销 | M4 | P0 | domain | 自动 | 不付费 |
| [TC-BIZ-039](TEST_CASES.md#tc-biz-039) | 任务汇总真实性与订阅生命周期 | M4 | P1 | contract | 自动 | 不付费 |
| [TC-BIZ-040](TEST_CASES.md#tc-biz-040) | 跨节点并发预算和失败隔离 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-041](TEST_CASES.md#tc-biz-041) | 本地 LLM 与原生 Comfy 队列共享资源门控 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-BIZ-042](TEST_CASES.md#tc-biz-042) | 有序结果成组、再引用和原生输出只读 | M5 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-043](TEST_CASES.md#tc-biz-043) | 旧工作流、资产及槽位的单包迁移 | M6 | P0 | migration | 混合 | 不付费 |
| [TC-BIZ-044](TEST_CASES.md#tc-biz-044) | 退役 LibTV 记录只能读取历史结果 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-BIZ-045](TEST_CASES.md#tc-biz-045) | 大表、媒体与长时编辑性能预算 | M6 | P1 | performance | 混合 | 不付费 |
| [TC-BIZ-046](TEST_CASES.md#tc-biz-046) | 云端适配协议与禁止真实调用保护 | M4 | P1 | contract | 自动 | 不付费 |
| [TC-BIZ-047](TEST_CASES.md#tc-biz-047) | 本地 Qwen 与 MiniMax 真实生成结果 | M4 | P1 | provider-live | 人工 | 仅本地 Qwen/MiniMax |
| [TC-BIZ-048](TEST_CASES.md#tc-biz-048) | LLM 多源输入、应用后输出及模型调用边界 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-049](TEST_CASES.md#tc-biz-049) | 同步投影不拥有任务轮询且不污染撤销 | M3 | P0 | contract | 自动 | 不付费 |
| [TC-BIZ-050](TEST_CASES.md#tc-biz-050) | 生产注册白名单与旧入口显式转换 | M6 | P0 | migration | 混合 | 不付费 |
| [TC-SYS-001](TEST_CASES.md#tc-sys-001) | 仅新包的最小安装 | M1 | P0 | host | 混合 | 不付费 |
| [TC-SYS-002](TEST_CASES.md#tc-sys-002) | 新旧包冲突可见且无覆盖 | M1 | P0 | integration | 自动 | 不付费 |
| [TC-SYS-003](TEST_CASES.md#tc-sys-003) | 依赖方向及旧资源路径检查 | M1 | P0 | contract | 自动 | 不付费 |
| [TC-SYS-004](TEST_CASES.md#tc-sys-004) | 同源控件与双实例隔离 | M1 | P1 | host | 混合 | 不付费 |
| [TC-SYS-005](TEST_CASES.md#tc-sys-005) | 模式切换与异步会话隔离 | M1 | P0 | host | 混合 | 不付费 |
| [TC-SYS-006](TEST_CASES.md#tc-sys-006) | 撤销不回退执行事实 | M4 | P0 | integration | 自动 | 不付费 |
| [TC-SYS-007](TEST_CASES.md#tc-sys-007) | 缺少可选依赖的最小能力 | M1 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-008](TEST_CASES.md#tc-sys-008) | 旧稳定标识与未知字段往返 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-009](TEST_CASES.md#tc-sys-009) | 未迁节点报告与原件保留 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-010](TEST_CASES.md#tc-sys-010) | 跨origin收藏目录显式迁移 | M2 | P1 | migration | 自动 | 不付费 |
| [TC-SYS-011](TEST_CASES.md#tc-sys-011) | 迁移预检与dry-run无写入 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-012](TEST_CASES.md#tc-sys-012) | 迁移中断后的原子恢复 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-013](TEST_CASES.md#tc-sys-013) | 迁移重复执行保持幂等 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-014](TEST_CASES.md#tc-sys-014) | 在途任务切换保护 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-015](TEST_CASES.md#tc-sys-015) | 回滚保护旧数据与新数据 | M6 | P0 | migration | 自动 | 不付费 |
| [TC-SYS-016](TEST_CASES.md#tc-sys-016) | 重启任务账本恢复原身份 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-017](TEST_CASES.md#tc-sys-017) | 提交应答丢失不重复付费 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-018](TEST_CASES.md#tc-sys-018) | 取消能力与排队范围 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-019](TEST_CASES.md#tc-sys-019) | 分资源限流及公平推进 | M4 | P1 | backend | 自动 | 不付费 |
| [TC-SYS-020](TEST_CASES.md#tc-sys-020) | 输入与文件路径校验 | M2 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-021](TEST_CASES.md#tc-sys-021) | 日志与导出不泄漏凭据 | M1 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-022](TEST_CASES.md#tc-sys-022) | 错误与版本诊断可定位 | M1 | P1 | integration | 自动 | 不付费 |
| [TC-SYS-023](TEST_CASES.md#tc-sys-023) | 小型场景帧时间 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-024](TEST_CASES.md#tc-sys-024) | 标准场景交互延迟 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-025](TEST_CASES.md#tc-sys-025) | 标准场景保存与重开 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-026](TEST_CASES.md#tc-sys-026) | 大型场景降级与取消 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-027](TEST_CASES.md#tc-sys-027) | 生命周期资源回收 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-028](TEST_CASES.md#tc-sys-028) | 混合队列后端响应 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-029](TEST_CASES.md#tc-sys-029) | 一小时创作稳定性 | M5 | P1 | performance | 自动 | 不付费 |
| [TC-SYS-030](TEST_CASES.md#tc-sys-030) | 构建发布与缓存一致性 | M6 | P0 | integration | 自动 | 不付费 |
| [TC-SYS-031](TEST_CASES.md#tc-sys-031) | 宿主支持版本矩阵 | M6 | P0 | host | 混合 | 不付费 |
| [TC-SYS-032](TEST_CASES.md#tc-sys-032) | 完整创作流程的可重复验收 | M5 | P0 | host | 混合 | 不付费 |
| [TC-SYS-033](TEST_CASES.md#tc-sys-033) | 可选ComfyTV存在与缺失 | M2 | P1 | host | 混合 | 不付费 |
| [TC-SYS-034](TEST_CASES.md#tc-sys-034) | 旧库退出与排除项检查 | M6 | P0 | integration | 自动 | 不付费 |
| [TC-SYS-035](TEST_CASES.md#tc-sys-035) | 数据写入失败保持一致 | M4 | P0 | backend | 自动 | 不付费 |
| [TC-SYS-036](TEST_CASES.md#tc-sys-036) | 本地 Qwen 与 MiniMax 完整流程及实测范围 | M4 | P0 | provider-live | 混合 | 仅本地 Qwen/MiniMax |

<a id="tc-can-001"></a>

## TC-CAN-001 单包独立启动与重复注册冲突诊断

**阶段：** M1；**优先级：** P0；**层级：** host；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-001](FEATURE_MATRIX.md#f-can-001)、[F-CAN-038](FEATURE_MATRIX.md#f-can-038)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：隔离 ComfyUI 用户目录；基础新包；另含旧同名节点包的冲突目录。

**准备**

- 锁定宿主/前端/Python 版本并记录新包构建号。
- 禁用所有生成服务，使用空 input/output。

**步骤**

1. 仅加载新包启动，读取日志及节点目录。
2. 检查本阶段已交付的正式注册清单与画布入口数量；未实现业务使用仅测试环境启用的契约夹具，不冒充产品功能。
3. 停机后启用一个旧同名包，重新启动并读取诊断。

**可判断的期望**

- 纯新包无旧仓库导入依赖，每个基础 ID 只出现一次。
- 冲突场景报告冲突 ID 和插件路径，不能按发现顺序静默覆盖。
- 原工作流与用户目录没有被自动迁移/删除。
- M2扩展真实上传/文本/组注册，M5扩展剪辑，M6核对完整正式清单。

**旧测试复用候选：** [canvas:tools/repository_split_smoke.cjs](../../tools/repository_split_smoke.cjs)

<a id="tc-can-002"></a>

## TC-CAN-002 模式往返保持同一原生图与面板归属

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-002](FEATURE_MATRIX.md#f-can-002)、[F-CAN-023](FEATURE_MATRIX.md#f-can-023)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)、[F-CAN-038](FEATURE_MATRIX.md#f-can-038)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个文本、两个上传节点，记录节点 ID、面板 DOM 与素材值。

**准备**

- 打开独立测试工作流；记录原生图引用和节点序列化摘要。

**步骤**

1. 原生图→画布→原生图循环 5 次。
2. 在 A 编辑内容，再切到画布检查 A/B。
3. 保存后重新打开页面。

**可判断的期望**

- 循环中节点 ID、业务数据和真实连线不变，A 修改不影响 B。
- 每个节点只有一个实际业务面板，归还后回到正确宿主。
- 重载按保存的模式打开，无遗留 dialog、遮罩或重复模式入口。

**旧测试复用候选：** [canvas:tests/creative_panel_lease.test.mjs](../../tests/creative_panel_lease.test.mjs)；[canvas:tools/repository_split_smoke.cjs](../../tools/repository_split_smoke.cjs)

<a id="tc-can-003"></a>

## TC-CAN-003 三处新建菜单一致且新建可撤销

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-004](FEATURE_MATRIX.md#f-can-004)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：只含基础注册节点的空图，另有未注册类型的适配器菜单声明。

**准备**

- 记录原生图节点数量 0。

**步骤**

1. 分别打开空白双击、右键、底部加号菜单并读取项。
2. 尝试新增文本节点并撤销/重做。

**可判断的期望**

- 三处可用节点集合一致，未注册类型不出现。
- 创建后节点数为 1，撤销为 0，重做为 1。
- 初始位置位于指定落点且不额外生成历史步骤。

**旧测试复用候选：** [canvas:tests/creative_canvas_catalog.test.mjs](../../tests/creative_canvas_catalog.test.mjs)

<a id="tc-can-004"></a>

## TC-CAN-004 批量上传顺序与部分格式拒绝

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-005](FEATURE_MATRIX.md#f-can-005)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：A.png、B.mp4、C.webp、D.txt；有效媒体为小尺寸本地自建内容。

**准备**

- 空图；另建已有素材 X 的上传节点。
- 拦截记录上传请求，不接任何生成节点。

**步骤**

1. 按 A/B/C/D 顺序拖到空白。
2. 将 A/B 一起拖到 X 卡片。

**可判断的期望**

- 第一次创建三个支持文件节点，顺序 A/B/C；D 给出格式提示。
- 第二次新建两个节点，X 的素材与名称不变。
- 上传文件写入允许的 input 相对目录，返回引用不含任意绝对路径。

**旧测试复用候选：** [canvas:tools/media_upload_smoke.cjs](../../tools/media_upload_smoke.cjs)

<a id="tc-can-005"></a>

## TC-CAN-005 替换成功提交、失败回滚及跨类型拒绝

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-006](FEATURE_MATRIX.md#f-can-006)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：已连接输出的 A.png；替换 B.png、C.mp4；上传端点可注入 500。

**准备**

- 记录原素材 JSON、标题及连线快照。

**步骤**

1. 上传端点返回 500 时替换 B。
2. 恢复端点后同类型替换 B。
3. 尝试替换为 C.mp4。

**可判断的期望**

- 500 后原 JSON、图片和连接完整保留。
- 成功后引用变为 B，自动标题更新但已手工命名标题保留。
- 已连线跨类型替换拒绝，不发送有效替换或修改连接。

**旧测试复用候选：** [canvas:tools/media_upload_smoke.cjs](../../tools/media_upload_smoke.cjs)

<a id="tc-can-006"></a>

## TC-CAN-006 上传迟到回包不得覆盖新状态

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-005](FEATURE_MATRIX.md#f-can-005)、[F-CAN-006](FEATURE_MATRIX.md#f-can-006)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：可控制响应顺序的本地上传模拟端点及两个节点 A/B。

**准备**

- A 开始请求 R1 并挂起；B 保持已有素材。

**步骤**

1. A 发起 R2，先返回 R2 再返回 R1。
2. 重复一次，在回包前删除 A；再重复一次在回包前载入另一工作流。

**可判断的期望**

- R2 成功后最终引用为 R2，R1 不覆盖。
- 删除/换图后回包不复活节点、不修改新图。
- B 的引用、忙碌态和媒体未改变；取消句柄已释放。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-007"></a>

## TC-CAN-007 素材比例、长标题和控件缩放视觉基线

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-009](FEATURE_MATRIX.md#f-can-009)、[F-CAN-010](FEATURE_MATRIX.md#f-can-010)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：16:9、9:16、1:1 图片，长中文名视频，两个空上传；截图基线。

**准备**

- 视口 1440×900 和 680×720；画布缩放 50%/100%/150%。

**步骤**

1. 逐一悬停、选中和键盘聚焦素材。
2. 让缩略图屏幕宽度跨越 160px 阈值。
3. 检查长标题和右上按钮位置。

**可判断的期望**

- 原素材无拉伸和擅自裁切；空态比例 16:9。
- 标题、外置标题间距及 Slot 按既有屏幕像素规则显示。
- 低于阈值的操作按规范隐藏；以上状态不溢出、无重复文件名层，焦点可见。

**旧测试复用候选：** [canvas:tools/creative_material_theme_smoke.mjs](../../tools/creative_material_theme_smoke.mjs)；[canvas:tools/creative_layout_smoke.mjs](../../tools/creative_layout_smoke.mjs)

<a id="tc-can-008"></a>

## TC-CAN-008 视频控制不拖动节点且实例独立

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-007](FEATURE_MATRIX.md#f-can-007)、[F-CAN-011](FEATURE_MATRIX.md#f-can-011)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个 3 秒带音轨本地视频 A/B。

**准备**

- 记录 A/B 画布位置；两者暂停。

**步骤**

1. 只播放 A，拖动 A 进度/音量、静音、下载并请求全屏。
2. 移出鼠标、切换模式，再替换/删除 A。

**可判断的期望**

- B 仍暂停且进度未变化，A/B 节点位置不变。
- 控件显隐不重置播放；隐藏模式/删除按生命周期暂停并释放媒体。
- 下载链接对应 A 的原文件；全屏不可用时显示错误而不破坏编辑。

**旧测试复用候选：** [canvas:tools/media_upload_smoke.cjs](../../tools/media_upload_smoke.cjs)

<a id="tc-can-009"></a>

## TC-CAN-009 文本组合输入、STRING 输出和收藏快照

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-008](FEATURE_MATRIX.md#f-can-008)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**用例：** [UC-CAN-005](USE_CASES.md#uc-can-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：文本 A/B、无副作用 STRING 消费者、空收藏目录。

**准备**

- A/B 使用不同初始文本；启用中文输入法。

**步骤**

1. A 输入中文组合串并按 Enter 确认候选，继续输入换行。
2. 收藏 A，修改 A，再读取文本输出和收藏。
3. 在文本编辑区按 Backspace/Ctrl+C/V。

**可判断的期望**

- 候选确认不提交错误中间值或触发画布动作；最终多行内容完整。
- STRING 输出等于 A 当前值，B 保持原文；收藏等于收藏瞬间值。
- 文本快捷键不删除节点/连线，不复制图剪贴板。

**旧测试复用候选：** [canvas:tests/mixed_group.test.mjs](../../tests/mixed_group.test.mjs)；[canvas:tools/creative_field_smoke.mjs](../../tools/creative_field_smoke.mjs)

<a id="tc-can-010"></a>

## TC-CAN-010 自动/手工重命名、取消与组内身份保持

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-009](FEATURE_MATRIX.md#f-can-009)、[F-CAN-015](FEATURE_MATRIX.md#f-can-015)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：文件名自动标题节点 A、手工标题节点 B、包含 A 的组。

**准备**

- 记录 A/B 节点 ID 与素材引用。

**步骤**

1. 替换 A/B 为同类型新素材。
2. 双击孤立节点/组内节点/组标题，分别提交、Esc 取消和输入空白。
3. 移出组、保存重载。

**可判断的期望**

- A 自动标题跟随新文件名，B 手工名不被替换。
- Esc/空白保留原标题；组合输入不提前提交。
- 重命名不改变 ID、素材引用和组关系；重载显示一致。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-011"></a>

## TC-CAN-011 视口坐标映射与导航不污染编辑历史

**阶段：** M2；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-010](FEATURE_MATRIX.md#f-can-010)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：不同 deltaMode、边界缩放与固定世界坐标的参数夹具。

**准备**

- 给定视口 x/y/zoom 和指针屏幕坐标。

**步骤**

1. 分别应用普通/Shift/Ctrl 滚轮和像素/行/页 delta。
2. 在宿主夹具中产生一条可重做编辑，平移/缩放，再重做。

**可判断的期望**

- 普通平移与 Shift 横移方向/单位符合定义；缩放限制在合法范围。
- 缩放前后指针下的世界坐标差小于 1e-6（纯模型）。
- 视口变化不清空重做，重做恢复业务编辑且使用当前视角。

**旧测试复用候选：** [canvas:tests/creative_navigation.test.mjs](../../tests/creative_navigation.test.mjs)；[canvas:tests/creative_canvas_model.test.mjs](../../tests/creative_canvas_model.test.mjs)；[canvas:tools/creative_navigation_smoke.cjs](../../tools/creative_navigation_smoke.cjs)

<a id="tc-can-012"></a>

## TC-CAN-012 选择/拖动状态机与 pointercancel 清理

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-011](FEATURE_MATRIX.md#f-can-011)、[F-CAN-015](FEATURE_MATRIX.md#f-can-015)

**用例：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：紧密相邻素材、组内成员、含输入字段/下载链接的节点。

**准备**

- 记录位置、选择集合和组关系。

**步骤**

1. 框选并追加选择；拖动普通节点与组成员。
2. 在按钮、链接、字段、媒体滑条上操作。
3. 拖动中发出 Escape/pointercancel。

**可判断的期望**

- 选择集合符合修饰键规则，控件操作不改变节点位置。
- 取消回到既定取消结果并清除捕获、高亮和预览。
- 后续普通点击可重新选择，无必须刷新才能恢复的状态。

**旧测试复用候选：** [canvas:tools/creative_selection_smoke.cjs](../../tools/creative_selection_smoke.cjs)

<a id="tc-can-013"></a>

## TC-CAN-013 选区复制重映射与外部连接隔离

**阶段：** M2；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-012](FEATURE_MATRIX.md#f-can-012)、[F-CAN-015](FEATURE_MATRIX.md#f-can-015)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：含组、两个指向同文件节点、一个内部连接和一个外部连接的选区。

**准备**

- 保存源图摘要；测试适配器提供 prepareCopy/remapCopy 与请求 ID。

**步骤**

1. 复制选区，粘贴两次。
2. 读取副本成员 ID、原生连线、文件引用和请求 ID。
3. 输入无效剪贴板 JSON。

**可判断的期望**

- 每个副本节点/请求 ID 唯一，组成员指向本次副本，内部连线正确重建。
- 不复制选区外部连接；同文件独立节点身份仍区分，源图内容未被修改。
- 无效 JSON 不创建部分节点。

**旧测试复用候选：** [canvas:tests/creative_navigation.test.mjs](../../tests/creative_navigation.test.mjs)；[canvas:tests/material_groups.test.mjs](../../tests/material_groups.test.mjs)

<a id="tc-can-014"></a>

## TC-CAN-014 跨节点事务和派生修改保持撤销一致

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-010](USE_CASES.md#uc-can-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两素材节点、一个组、无付费下游；可读取宿主历史计数。

**准备**

- 清空测试工作流历史，记录基准序列化快照。

**步骤**

1. 执行一次含创建/连接/定位的复合动作，撤销再重做。
2. 由已完成编辑触发异步派生同步。
3. 建立可重做编辑，再触发不改变业务含义的布局更新。

**可判断的期望**

- 复合动作只增加一次历史，撤销/重做完整恢复节点与连接。
- 派生同步不增加独立历史、不清空重做。
- 恢复过程中不发起新业务请求，历史状态不引用已销毁实例。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-015"></a>

## TC-CAN-015 保存格式与无运行态泄漏的往返

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-014](FEATURE_MATRIX.md#f-can-014)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)、[F-CAN-026](FEATURE_MATRIX.md#f-can-026)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：包含旧上传/组/文本/剪辑及 daelabCreativeCanvasV1 的金样 JSON。

**准备**

- 金样原文件设为只读；注入 mock running 任务及临时 UI 状态。

**步骤**

1. 加载、编辑一个标题、保存到新路径并重载。
2. 比较节点类型、槽位顺序、连线、素材 JSON 与画布布局。
3. 扫描保存结果中的任务运行态、凭据、DOM/Promise 标记。

**可判断的期望**

- 除显式编辑与已报告迁移字段外，已承诺数据含义一致。
- 稳定 ID/槽位保持，引用 input/output 目录正确。
- 运行中忙碌/临时请求、凭据和 UI 对象未进入工作流；原文件未改。

**旧测试复用候选：** [canvas:tests/creative_canvas_model.test.mjs](../../tests/creative_canvas_model.test.mjs)；[canvas:tests/material_groups.test.mjs](../../tests/material_groups.test.mjs)；[canvas:tests/video_edit_model.test.mjs](../../tests/video_edit_model.test.mjs)

<a id="tc-can-016"></a>

## TC-CAN-016 混合素材组快照顺序、克隆隔离和未就绪语义

**阶段：** M2；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-015](FEATURE_MATRIX.md#f-can-015)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**用例：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-010](USE_CASES.md#uc-can-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：图片 A、文本 T、视频 B、重复文件不同节点 C 的有序组。

**准备**

- 注册纯测试适配器；准备 Active/停用/ready:false 变体。

**步骤**

1. 读取 assets/inputSnapshot 并修改返回对象。
2. 调整成员顺序后重读；请求停用和未就绪来源。
3. 执行基础组节点并核对输出结构。

**可判断的期望**

- 媒体与文本顺序符合合同，C 不因文件相同丢失。
- 修改快照不能改变原组；后续读取来自新顺序。
- 停用返回不可消费，ready:false 不等同可执行空组。

**旧测试复用候选：** [canvas:tests/mixed_group.test.mjs](../../tests/mixed_group.test.mjs)；[canvas:tests/material_groups.test.mjs](../../tests/material_groups.test.mjs)；[canvas:tools/material_groups_backend_smoke.py](../../tools/material_groups_backend_smoke.py)

<a id="tc-can-017"></a>

## TC-CAN-017 组排列、颜色序号与工具栏跟随

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-016](FEATURE_MATRIX.md#f-can-016)

**用例：** [UC-CAN-003](USE_CASES.md#uc-can-003)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：横/竖媒体、空上传、文本混合组；两个组不同颜色。

**准备**

- 视口 1440×900 与 680×720；缩放 50%/100%/150%。

**步骤**

1. 切换三种排列，调整颜色/自选色和序号。
2. 平移/缩放、选择成员/组并打开组菜单。
3. 保存重载。

**可判断的期望**

- 排列顺序与输出顺序一致，容器贴合内容，没有新增标题空行。
- 序号为稳定屏幕大小，颜色和显隐重载后保留。
- 工具栏/菜单跟随所属组且边缘避让，另一组不受影响。

**旧测试复用候选：** [canvas:tools/material_groups_smoke.cjs](../../tools/material_groups_smoke.cjs)；[canvas:tools/creative_material_theme_smoke.mjs](../../tools/creative_material_theme_smoke.mjs)

<a id="tc-can-018"></a>

## TC-CAN-018 锁定、收起、删除与解散的恢复语义

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-017](FEATURE_MATRIX.md#f-can-017)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-003](USE_CASES.md#uc-can-003)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：三成员组和连接到下游的组/成员连线。

**准备**

- 保存原始图与成员位置。

**步骤**

1. 锁定后尝试移动组/成员和切换排列。
2. 解锁后收起/展开，执行解散并撤销。
3. 再执行删除组并撤销。

**可判断的期望**

- 锁定期间位置和排列不变；收起仅影响显示。
- 解散保留成员和其素材数据，仅移除组及其连接。
- 删除移除组/成员/相关连线；单次撤销完整恢复所有对象与顺序。

**旧测试复用候选：** [canvas:tests/material_groups.test.mjs](../../tests/material_groups.test.mjs)；[canvas:tools/material_groups_smoke.cjs](../../tools/material_groups_smoke.cjs)

<a id="tc-can-019"></a>

## TC-CAN-019 Slot 磁吸、屏幕命中与实例互斥

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-018](FEATURE_MATRIX.md#f-can-018)

**用例：** [UC-CAN-004](USE_CASES.md#uc-can-004)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个相邻组、其成员、一个停用节点及两宽度不同的表格测试面板。

**准备**

- 使用 50%/100%/150% 缩放；记录真实槽位列表。
- M2表格测试面板是只验证Slot能力的契约桩；M3使用真实表格重跑。

**步骤**

1. 选中组/成员并从 32 屏幕像素邻近区移动指针。
2. 尝试命中被压制、隐藏或停用端口。
3. 拖动/调整目标宽度并查看连接锚点。

**可判断的期望**

- 端口投影不改变真实槽位数量/索引。
- 应不可交互端口没有磁吸命中，邻近实例不串高亮。
- 锚点随几何同步，已连接端点仍在规定边侧位置。

**旧测试复用候选：** [canvas:tests/creative_connections.test.mjs](../../tests/creative_connections.test.mjs)；[canvas:tools/material_connection_smoke.cjs](../../tools/material_connection_smoke.cjs)

<a id="tc-can-020"></a>

## TC-CAN-020 真实类型兼容、用途选择与首个空输入

**阶段：** M2；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-018](FEATURE_MATRIX.md#f-can-018)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**用例：** [UC-CAN-004](USE_CASES.md#uc-can-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：IMAGE/VIDEO/STRING/DAELAB_ASSETS 和多首尾帧输入定义，含已有连接。

**准备**

- 准备正向/反向连接及 first-free 适配器。

**步骤**

1. 遍历兼容与不兼容类型对。
2. 对多用途目标打开用途选择。
3. 对 first-free 目标连续接入，直到没有空槽。

**可判断的期望**

- 兼容矩阵与原生定义一致，不借 wildcard 放行。
- 多用途明确选择目标用途；已有输入不被自动替换。
- first-free 选择第一个兼容空槽，无空槽则拒绝，不删除旧连接。

**旧测试复用候选：** [canvas:tests/creative_connections.test.mjs](../../tests/creative_connections.test.mjs)；[canvas:tools/material_connection_smoke.cjs](../../tools/material_connection_smoke.cjs)

<a id="tc-can-021"></a>

## TC-CAN-021 连线删除、取消与减少动态效果

**阶段：** M2；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-019](FEATURE_MATRIX.md#f-can-019)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-004](USE_CASES.md#uc-can-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：一源两下游的连线与可编辑文本框。

**准备**

- 记录连线 ID；启用/关闭 prefers-reduced-motion 两种环境。

**步骤**

1. 分别双击、Delete、Backspace 和拖断连线并撤销。
2. 在文字输入中按 Backspace；拖断未达到阈值或按 Esc。
3. 选中源并平移/缩放。

**可判断的期望**

- 每种有效删除只改目标连线且可一次恢复。
- 输入中 Backspace 只改文本，取消不丢连接。
- 动画相位在视口变化时连续，减少动态效果时不旋转/脉冲。

**旧测试复用候选：** [canvas:tools/material_connection_smoke.cjs](../../tools/material_connection_smoke.cjs)

<a id="tc-can-022"></a>

## TC-CAN-022 一次素材填充的原子性与命中优先级

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-021](FEATURE_MATRIX.md#f-can-021)、[F-CAN-020](FEATURE_MATRIX.md#f-can-020)

**用例：** [UC-CAN-007](USE_CASES.md#uc-can-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：接收 image/video/text 的测试业务落点、纯文本落点、相邻投影 Slot。

**准备**

- 适配器记录 acceptMaterials 调用与历史事务，另设抛错分支。

**步骤**

1. 分别拖单图、多素材、文本及不支持媒体到直接落点/邻近 Slot。
2. 取消拖动；模拟消费抛错；成功后修改源。

**可判断的期望**

- 直接落点优先，类型过滤与声明一致，非法输入不调用消费。
- 成功调用仅一次且位于一个事务；失败原子回滚，源位置/组关系保留。
- 高亮范围使用业务声明，结束清空；源后续变化不自动改目标。

**旧测试复用候选：** [canvas:tests/creative_material_drop.test.mjs](../../tests/creative_material_drop.test.mjs)；[canvas:tests/mixed_group.test.mjs](../../tests/mixed_group.test.mjs)

<a id="tc-can-023"></a>

## TC-CAN-023 结果分组输出与本地文件引用完整性

**阶段：** M3；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-022](FEATURE_MATRIX.md#f-can-022)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**用例：** [UC-CAN-007](USE_CASES.md#uc-can-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：input/output 各一张图及短视频；groups count 正常/不匹配/空结果快照。

**准备**

- 记录原文件大小、修改时间及摘要；启用本地素材输出端点。

**步骤**

1. 提交合法快照，创建分组素材。
2. 提交 count 不匹配、失效文件和非法路径快照。
3. 撤销合法创建。

**可判断的期望**

- 合法输出保留原文件引用、业务顺序和组名，不复制或重编码原媒体。
- 错误快照拒绝且不创建半成品节点/组。
- 撤销删除新对象而原文件/业务结果不变。

**旧测试复用候选：** [canvas:tests/material_output_import_test.py](../../tests/material_output_import_test.py)；[canvas:tests/creative_output.test.mjs](../../tests/creative_output.test.mjs)

<a id="tc-can-024"></a>

## TC-CAN-024 单素材拖出与迟到验证回包

**阶段：** M3；**优先级：** P0；**层级：** host；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-022](FEATURE_MATRIX.md#f-can-022)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)

**用例：** [UC-CAN-007](USE_CASES.md#uc-can-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个含不同素材的单元格测试面板；可延迟文件核验。

**准备**

- 记录原单元格内容，开始拖出 A 并挂起核验。

**步骤**

1. 正常拖出一次，再分别在核验中修改来源、删除节点、切换工作流。
2. 让所有核验完成。

**可判断的期望**

- 正常拖出恰好一个上传节点且可撤销，不额外建组。
- 原单元格/文件保持不变。
- 来源已变化的请求不创建任何节点，B 内容不受影响。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-025"></a>

## TC-CAN-025 面板 lease、宽度取消和 fullHeight 合同

**阶段：** M1；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-023](FEATURE_MATRIX.md#f-can-023)、[F-CAN-003](FEATURE_MATRIX.md#f-can-003)

**用例：** [UC-CAN-007](USE_CASES.md#uc-can-007)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个带内部输入状态的 content/fullHeight/resizable 面板；一个不可调整面板。

**准备**

- 记录各面板 root 引用、父容器和初始宽度。

**步骤**

1. 借用/归还并执行 release/abandon 重复调用。
2. 拖边调宽，分别提交和 Esc 取消；键盘左右及 Shift 调整。
3. 销毁面板后调用旧上下文 focus/pan/resize。

**可判断的期望**

- 借用保留同一 root 与内部编辑内容，归还不留下重复节点/监听。
- 提交保存宽度，取消恢复原宽；遵循 minWidth 和约定步长。
- fullHeight 不裁切底部；失效/不可调整上下文返回失败且不影响别的实例。

**旧测试复用候选：** [canvas:tests/creative_panel_lease.test.mjs](../../tests/creative_panel_lease.test.mjs)；[canvas:tests/creative_contract.test.mjs](../../tests/creative_contract.test.mjs)

<a id="tc-can-026"></a>

## TC-CAN-026 收藏去重、文本快照与数据异常不覆盖

**阶段：** M2；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-024](FEATURE_MATRIX.md#f-can-024)

**用例：** [UC-CAN-008](USE_CASES.md#uc-can-008)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：文本重复/变化、相同 input/output 相对名、2000 项目录与存储失败模拟。

**准备**

- 使用隔离资产目录；保留前一有效版本摘要。

**步骤**

1. 重复收藏同素材、同文本与不同目录同名素材。
2. 取消收藏；尝试空文本、非法路径、超容量及写入失败。

**可判断的期望**

- 同身份只保留一项，input/output 同名按不同来源区分。
- 文本后续变化不改已收藏内容；取消不发文件删除。
- 非法/超额/写入失败给明确错误且有效目录摘要不变。

**旧测试复用候选：** [canvas:tests/asset_library.test.mjs](../../tests/asset_library.test.mjs)

<a id="tc-can-027"></a>

## TC-CAN-027 旧浏览器收藏迁入后端目录且可回滚

**阶段：** M2；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-024](FEATURE_MATRIX.md#f-can-024)、[F-CAN-014](FEATURE_MATRIX.md#f-can-014)

**用例：** [UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：合法 v1、重复项、失效文件、损坏 JSON 与未知版本的 localStorage 导出。

**准备**

- 备份旧导出和新空目录；用测试文件根映射，禁止改真实浏览器存储。

**步骤**

1. 导入合法目录，再重复导入；读取逐条报告。
2. 分别导入损坏/未知版本。
3. 模拟迁移中断后恢复，并核对备份。

**可判断的期望**

- 支持项完整迁入，重复导入幂等，失效项报告但不伪造文件。
- 损坏/未知格式不覆盖旧导出或已成功目录。
- 中断可从明确提交边界恢复/回滚，不产生半条记录。

**旧测试复用候选：** [canvas:tests/asset_library.test.mjs](../../tests/asset_library.test.mjs)

<a id="tc-can-028"></a>

## TC-CAN-028 资产库筛选搜索、焦点恢复与失效阻止

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-025](FEATURE_MATRIX.md#f-can-025)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**用例：** [UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：带中文名称的图/视频/文本收藏及一个移走文件的收藏。

**准备**

- 打开 680×720 和 1440×900 视口，分别记录来源按钮焦点。

**步骤**

1. 按类型筛选及名称搜索，打开并关闭视频预览。
2. 加入有效素材后撤销；加入失效素材。
3. 平移/缩放画布并切换模式。

**可判断的期望**

- 筛选/搜索结果与夹具匹配；关闭预览暂停媒体且焦点返回。
- 有效加入增加一个相应节点，撤销回到原数；失效加入不增节点并提示。
- 抽屉不随画布缩放，窄窗不被宿主导航遮挡，退出画布自动折叠。

**旧测试复用候选：** [canvas:tests/asset_library.test.mjs](../../tests/asset_library.test.mjs)

<a id="tc-can-029"></a>

## TC-CAN-029 任务快照真实状态、计数和通知消退

**阶段：** M4；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-026](FEATURE_MATRIX.md#f-can-026)

**用例：** [UC-CAN-009](USE_CASES.md#uc-can-009)、[UC-CAN-012](USE_CASES.md#uc-can-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：各状态、重复/无效 ID、已结束非成功计数、历史终态与当前终态；可控时钟。

**准备**

- 用 mock 任务服务提供快照，记录是否存在 cancel/submit 调用。

**步骤**

1. 逐状态渲染，推进时钟到 finishedAt+3999/4000ms。
2. 隐藏/销毁胶囊并重载页面；切换窄卡片与减少动态效果。

**可判断的期望**

- 非法/重复任务被过滤，结束数不写成成功数，progress 不伪造聚合。
- 历史无 finishedAt 的终态不通知；当前终态按 4 秒规则消退。
- UI 显隐无 cancel/submit 调用，重载只有后端证据支持才标 running；窄态无尺寸膨胀。

**旧测试复用候选：** [canvas:tests/creative_tasks.test.mjs](../../tests/creative_tasks.test.mjs)

<a id="tc-can-030"></a>

## TC-CAN-030 模式停用、恢复和实例释放

**阶段：** M5；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-027](FEATURE_MATRIX.md#f-can-027)、[F-CAN-002](FEATURE_MATRIX.md#f-can-002)

**用例：** [UC-CAN-005](USE_CASES.md#uc-can-005)、[UC-CAN-009](USE_CASES.md#uc-can-009)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个上传、文本、剪辑面板；对监听/定时器/媒体源设可观测计数。

**准备**

- A/B 均 Active，A 有播放/挂起请求，B 保持静止。

**步骤**

1. A 依次切 Mute、Bypass、Active。
2. 删除 A，再重载工作流并检查旧请求回调。

**可判断的期望**

- 停用正文 hidden/inert 且媒体暂停，恢复还原原属性和业务数据。
- B 始终未改；删除后 A 的监听/订阅/媒体计数归零。
- 旧回调不写新实例，UI 停用不虚构后台任务取消或暂停。

**旧测试复用候选：** [canvas:tests/creative_panel_state.test.mjs](../../tests/creative_panel_state.test.mjs)

<a id="tc-can-031"></a>

## TC-CAN-031 剪辑按节点身份同步与手工删除保持

**阶段：** M5；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-028](FEATURE_MATRIX.md#f-can-028)

**用例：** [UC-CAN-010](USE_CASES.md#uc-can-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个节点引用同视频、两个组、手工裁剪和已删除来源记录。

**准备**

- 向剪辑接入组 A 并记录每个片段 source identity。

**步骤**

1. 重复同步，新增成员，再重排上游组。
2. 接入组 B，调整动态槽位顺序，断开 A。
3. 返回 ready:false 后再恢复有效快照。

**可判断的期望**

- 同文件不同节点均有独立片段；重复同步不追加副本。
- 已有剪辑顺序/裁剪和手工删除保持，新增仅追加。
- 断开 A 不改 B；未就绪不清空，槽位重编号不丢来源记录。

**旧测试复用候选：** [canvas:tests/video_edit_model.test.mjs](../../tests/video_edit_model.test.mjs)

<a id="tc-can-032"></a>

## TC-CAN-032 时间轴编辑帧边界与撤销等价性

**阶段：** M5；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-029](FEATURE_MATRIX.md#f-can-029)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-010](USE_CASES.md#uc-can-010)、[UC-CAN-011](USE_CASES.md#uc-can-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：24fps 视频、默认图片、不同长度片段；操作序列含裁剪/分割/复制/删除/排序。

**准备**

- 保存初始标准化 edit_data。

**步骤**

1. 执行每种操作与边界输入：0 时长、越界、末尾分割。
2. 逐步撤销到初始，再重做到终态。
3. 测试吸附开关及键盘 1/10 帧调整。

**可判断的期望**

- 图片初始 3 秒，合法片段不少于一帧，裁剪不超源时长。
- 分割/复制继承片段设置，排序不丢来源；非法操作拒绝或按定义限幅。
- 撤销回到初始、重做到同一终态；时间值按输出帧率对齐。

**旧测试复用候选：** [canvas:tests/video_edit_model.test.mjs](../../tests/video_edit_model.test.mjs)

<a id="tc-can-033"></a>

## TC-CAN-033 剪辑派生同步与图删除共用一次历史

**阶段：** M5；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-028](FEATURE_MATRIX.md#f-can-028)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-010](USE_CASES.md#uc-can-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：两个组连接同一剪辑，剪辑含裁剪/分割/删除记录。

**准备**

- 完成同步后记录宿主历史和 edit_data。

**步骤**

1. 删除组 A，等待派生清理，再撤销与重做。
2. 删除某输入最后一个片段后撤销。
3. 异步来源读取中载入另一工作流。

**可判断的期望**

- 删除 A 及其片段清理只占一个编辑步骤，撤销恢复组/连线/原编辑。
- 最后片段删除合并断线但不删除上游节点。
- 派生恢复不清空重做，新工作流不接收旧读取结果。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-034"></a>

## TC-CAN-034 预览时间、连续播放与异步画面保留

**阶段：** M5；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-030](FEATURE_MATRIX.md#f-can-030)

**用例：** [UC-CAN-011](USE_CASES.md#uc-can-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：图片→视频→同源视频裁剪段→另一视频，两个独立剪辑实例。

**准备**

- 设定慢媒体加载模拟；记录预览时间与实际画面编号。

**步骤**

1. 播放跨片段，选中片段、撤销编辑、向时间轴末尾缩短。
2. 重复同源连续片段并观察媒体实例数。
3. 暂停 A 并操作 B。

**可判断的期望**

- 选中/未截短的撤销保留播放时间，截短只限到新末尾。
- 慢加载保持上一帧并停止推进，画面就绪后从正确时间恢复。
- 同源连续片段复用解码媒体，A/B 时间和播放状态隔离。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-035"></a>

## TC-CAN-035 预览代理尺寸、缓存复用、失效和取消

**阶段：** M5；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-031](FEATURE_MATRIX.md#f-can-031)

**用例：** [UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-012](USE_CASES.md#uc-can-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：1920×1080、24fps、3 秒带音轨自建视频；独立临时缓存。

**准备**

- 使用 CPU 编码器，记录原文件摘要、修改时间和临时目录。

**步骤**

1. 依次请求 0.5×、0.75×、1×，对同倍率重复请求。
2. 修改源文件后重试；转换期间断开请求/取消。
3. 设置旧缓存时间后触发清理。

**可判断的期望**

- 代理为 960×540/1440×810 等对应偶数尺寸，时长误差不超过一帧。
- 重复请求复用，源变更失效；仅所选倍率转换并受并发约束。
- 取消最终释放转换任务/临时文件，原文件未改；过期清理不删除当前结果或源文件。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-036"></a>

## TC-CAN-036 预览与导出画幅、适配和音轨一致

**阶段：** M5；**优先级：** P0；**层级：** backend；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-032](FEATURE_MATRIX.md#f-can-032)

**用例：** [UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-012](USE_CASES.md#uc-can-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：横竖色条图、可识别边缘标记视频、单频音轨；锁定与跟随分辨率配置。

**准备**

- 准备每片段 contain/cover 与静音的组合；CPU 渲染。

**步骤**

1. 分别导出跟随首片段与锁定尺寸。
2. 替换首片段，再导出；解锁后再次导出。
3. 抽帧检查边缘标记和音轨能量，与预览截图对照。

**可判断的期望**

- 锁定时尺寸不变，解锁按新首片段选择合法偶数尺寸。
- contain 保留全画面/留边，cover 填满且按约定裁切；预览与成片一致。
- 静音视频对应区段音频能量低于测试静音阈值，未静音区段保留；图片无静音开关。

**旧测试复用候选：** [canvas:tests/video_edit_model.test.mjs](../../tests/video_edit_model.test.mjs)

<a id="tc-can-037"></a>

## TC-CAN-037 导出重复点击、定向取消和重启恢复

**阶段：** M5；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-033](FEATURE_MATRIX.md#f-can-033)、[F-CAN-026](FEATURE_MATRIX.md#f-can-026)

**用例：** [UC-CAN-012](USE_CASES.md#uc-can-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：可控本地 ComfyUI 执行器、两个剪辑任务、可注入编码失败及服务重启。

**准备**

- 任务账本位于独立数据目录；禁用所有付费节点。

**步骤**

1. 对 A 连续提交两次，同时正常提交 B。
2. 取消 A 并检查 B；使重试 A 第一次失败、下一次成功。
3. 在已提交/运行边界重启服务并核对任务。

**可判断的期望**

- 同一操作只对应一个有效 A 任务，B 不因 A 取消而停止。
- 失败/取消不标成功，输出完整前不发布成功引用。
- 重启通过任务账本与执行器证据恢复或标待核对；不自动重放可能重复的提交。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-038"></a>

## TC-CAN-038 编辑版本使旧成片失效但保留连接

**阶段：** M5；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-034](FEATURE_MATRIX.md#f-can-034)、[F-CAN-033](FEATURE_MATRIX.md#f-can-033)

**用例：** [UC-CAN-004](USE_CASES.md#uc-can-004)、[UC-CAN-012](USE_CASES.md#uc-can-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：成功导出的剪辑 A、已连接下游、可延迟完成的下一次导出。

**准备**

- 记录结果版本、成片引用和既有连线。

**步骤**

1. 编辑片段后尝试正向/反向/原生模式新连线。
2. 启动 R2 后再次编辑，再返回 R2 成功。
3. 导出当前版本并输出为素材。

**可判断的期望**

- 编辑后旧结果不允许新连接，但既有连接保留。
- R2 不匹配当前编辑时不标当前成片有效，不清空下游已有编辑。
- 当前版本成功后门禁开放，VIDEO/引用/素材输出指向同一文件。

**旧测试复用候选：** [canvas:tests/creative_connections.test.mjs](../../tests/creative_connections.test.mjs)；[canvas:tests/creative_output.test.mjs](../../tests/creative_output.test.mjs)

<a id="tc-can-039"></a>

## TC-CAN-039 ComfyTV 可选安装与未知节点保留

**阶段：** M6；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-035](FEATURE_MATRIX.md#f-can-035)、[F-CAN-001](FEATURE_MATRIX.md#f-can-001)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：无 ComfyTV 环境、有固定版本 ComfyTV 环境、包含未知第三方节点的旧图。

**准备**

- 使用两份独立测试用户目录；固定上游提交且只读。

**步骤**

1. 在无上游环境执行基础素材/组/剪辑流程。
2. 在有上游环境加载兼容节点并查看公开面板/执行结果。
3. 导入含未知节点图后导出迁移报告。

**可判断的期望**

- 无上游基础功能可用，菜单无失效 ComfyTV 入口。
- 兼容不改上游文件/注册实现，稳定输出槽位保留。
- 未知节点被报告且原序列化数据保留，不能静默删除。

**旧测试复用候选：** [canvas:tests/comfytv_adapter.test.mjs](../../tests/comfytv_adapter.test.mjs)；[canvas:tools/repository_split_smoke.cjs](../../tools/repository_split_smoke.cjs)

<a id="tc-can-040"></a>

## TC-CAN-040 素材路径边界、input/output 区分与端点拒绝

**阶段：** M5；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-036](FEATURE_MATRIX.md#f-can-036)

**用例：** [UC-CAN-002](USE_CASES.md#uc-can-002)、[UC-CAN-007](USE_CASES.md#uc-can-007)、[UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：允许根内文件、根外文件、../、绝对路径、非法类型、同名 input/output；Origin/remote 测试请求。

**准备**

- 所有夹具置于隔离临时目录，不读取真实敏感文件。
- M2由TC-SYS-020先验纯路径服务；本测试在M5联测素材输出与媒体预览入口，M6回归。

**步骤**

1. 调用导入/媒体检查/预览入口处理合法与非法引用。
2. 向素材输出端点发送非本机或不匹配 Origin 请求。
3. 移走合法文件后重新读取。

**可判断的期望**

- 合法引用只解析到指定根内文件，input/output 不混淆。
- 穿越、根外、非法类型和不允许请求被拒绝；无根外读写副作用。
- 失效文件返回可定位错误，不创建伪有效引用或空节点。

**旧测试复用候选：** [canvas:tests/material_output_import_test.py](../../tests/material_output_import_test.py)；[canvas:tests/asset_library.test.mjs](../../tests/asset_library.test.mjs)

<a id="tc-can-041"></a>

## TC-CAN-041 画布/资产库交互性能预算

**阶段：** M2；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-037](FEATURE_MATRIX.md#f-can-037)、[F-CAN-010](FEATURE_MATRIX.md#f-can-010)、[F-CAN-025](FEATURE_MATRIX.md#f-can-025)

**用例：** [UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** M2 使用 FX-PERF-S/M 的纯画布子场景（暂不含未迁表格），以及 2000 条收藏；M5 使用完整 FX-PERF-S/M 再验收。

**准备**

- 记录 CPU/GPU/内存、浏览器和宿主版本；先预热素材，关闭无关后台负载。
- 以下数值是拟定准入门槛，M0 测基线后需评审锁定；修改门槛须留决策记录。

**步骤**

1. 按 TEST_STRATEGY 的统一测量协议，预热10秒后每场景采样30秒、重复5次。
2. 对2000条收藏执行固定搜索序列并记录输入到结果显示时间。

**可判断的期望**

- 画布分别满足 PERF-01/02；M2只评价画布子场景，不能据此宣称M5完整性能通过。
- 2000条收藏搜索满足 PERF-08。
- 输出全部原始采样与环境；预算只在 TEST_STRATEGY 维护。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-can-042"></a>

## TC-CAN-042 宿主能力缺失诊断与架构边界扫描

**阶段：** M1；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-038](FEATURE_MATRIX.md#f-can-038)、[F-CAN-013](FEATURE_MATRIX.md#f-can-013)、[F-CAN-023](FEATURE_MATRIX.md#f-can-023)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-013](USE_CASES.md#uc-can-013)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：支持/缺少 history、mode、serialization 能力的宿主契约桩；新库依赖图。

**准备**

- 禁止在业务与共享组件导入宿主私有 API；允许清单仅包含 integrations/comfyui。

**步骤**

1. 扫描宿主私有字段、菜单 DOM 和直接图修改的拥有模块。
2. 运行能力探测，逐个移除必要能力。
3. 对每个声明支持宿主版本执行契约用例。

**可判断的期望**

- 受限访问只存在适配层，业务依赖统一命令/契约。
- 缺失能力给出具体诊断并拒绝可能损坏保存/撤销的操作。
- 支持矩阵每项有通过证据；未验证组合不标已支持。

**旧测试复用候选：** [canvas:tests/creative_contract.test.mjs](../../tests/creative_contract.test.mjs)

<a id="tc-can-043"></a>

## TC-CAN-043 离线资源、共享组件状态与样式隔离

**阶段：** M1；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-003](FEATURE_MATRIX.md#f-can-003)、[F-CAN-039](FEATURE_MATRIX.md#f-can-039)

**用例：** [UC-CAN-001](USE_CASES.md#uc-can-001)、[UC-CAN-013](USE_CASES.md#uc-can-013)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：断外网环境、组件状态陈列和原生宿主对照截图。

**准备**

- 只允许本机资源请求；分别加载产品真实按钮/字段/标题/任务组件。
- 任务胶囊只接收固定只读快照，不调用尚未完成的M4任务服务。

**步骤**

1. 校验字体/图标清单与许可证，加载所有所用资源。
2. 键盘遍历正常/焦点/禁用/忙碌/错误/长内容状态。
3. 比较打开画布前后宿主输入/按钮样式。

**可判断的期望**

- 所需资源本地加载成功，校验清单匹配，许可证/来源随包交付。
- 组件样例引用产品真实实现；状态可区分，焦点不被裁切。
- 宿主和未迁入插件控件样式不被全局选择器污染；陈列结果单独标注为辅助证据。

**旧测试复用候选：** [canvas:tools/verify_assets.mjs](../../tools/verify_assets.mjs)；[canvas:tools/creative_button_smoke.mjs](../../tools/creative_button_smoke.mjs)；[canvas:tools/creative_field_smoke.mjs](../../tools/creative_field_smoke.mjs)

<a id="tc-can-044"></a>

## TC-CAN-044 历史金样迁移与完整无付费闭环

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-CAN-014](FEATURE_MATRIX.md#f-can-014)、[F-CAN-024](FEATURE_MATRIX.md#f-can-024)、[F-CAN-035](FEATURE_MATRIX.md#f-can-035)、[F-CAN-036](FEATURE_MATRIX.md#f-can-036)、[F-CAN-038](FEATURE_MATRIX.md#f-can-038)

**用例：** [UC-CAN-006](USE_CASES.md#uc-can-006)、[UC-CAN-008](USE_CASES.md#uc-can-008)、[UC-CAN-014](USE_CASES.md#uc-can-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：冻结版本的纯 Canvas、含业务结果/表格引用、含 ComfyTV、损坏/未知版本四类金样，配相对路径媒体。

**准备**

- 保留原 JSON/收藏/文件清单校验值；仅新包启用，另设 ComfyTV 可选环境。

**步骤**

1. 逐份导入，读取迁移报告并核对节点/槽位/引用。
2. 对受支持图执行编辑→撤销→保存→重载→资产复用→CPU 剪辑导出。
3. 对失败图执行回滚并核对原资料。

**可判断的期望**

- 受支持图无未报告的数据丢失，稳定 ID/槽位/序列化含义保持。
- 原文件/素材不被覆盖；未知项和缺失文件逐条报告，失败可回滚。
- 结果记录自动/真实宿主/本地导出分别通过或失败；未调用任何付费生成。

**旧测试复用候选：** [canvas:tools/repository_split_smoke.cjs](../../tools/repository_split_smoke.cjs)；[canvas:tests/material_output_import_test.py](../../tests/material_output_import_test.py)

<a id="tc-can-045"></a>

## TC-CAN-045 生命周期压力与资源回收预算

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-CAN-037](FEATURE_MATRIX.md#f-can-037)、[F-CAN-027](FEATURE_MATRIX.md#f-can-027)、[F-CAN-030](FEATURE_MATRIX.md#f-can-030)、[F-CAN-031](FEATURE_MATRIX.md#f-can-031)

**用例：** [UC-CAN-011](USE_CASES.md#uc-can-011)、[UC-CAN-013](USE_CASES.md#uc-can-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟创建：20 个视频卡片、2 个剪辑预览、100 个基础节点，带订阅/计时器/媒体源观测。

**准备**

- 在记录过的性能机器预热；建立空图资源计数和稳定堆基线。
- 资源阈值为拟定准入门槛，M0 基线评审锁定并记录。

**步骤**

1. 新建→播放/预览→切换模式→删除全部节点循环20轮，使用 TEST_STRATEGY 的统一采样协议。
2. 在最后一次释放后等待异步清理完成，按统一采样方式记录堆/媒体/订阅。
3. 隐藏画布静置 30 秒，采集更新调用。

**可判断的期望**

- 已删除实例对应监听/订阅/取消句柄/媒体源均归零；不再发起旧请求。
- 满足 PERF-05：受控GC后最后5轮堆中位数不高于前5轮15%，且增长不超过20MiB；资源计数回到基线。
- 隐藏视图不继续全量画布扫描，媒体未后台播放；若失败保存可复现剖析记录。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-biz-001"></a>

## TC-BIZ-001 表格增删改排序与工作流序列化往返

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001)、[F-BIZ-002](FEATURE_MATRIX.md#f-biz-002)、[F-BIZ-003](FEATURE_MATRIX.md#f-biz-003)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/basic-v1.json：3 行、7 类字段、未知扩展字段及稳定 ID。

**准备**

- 加载原始夹具并深拷贝基线。

**步骤**

1. 新增/删除/排序记录和字段；编辑中文、数字、布尔与空值。
2. 执行撤销/重做，再通过 Comfy widget JSON 保存并读回。

**可判断的期望**

- 当前数据等于预期快照；未操作的扩展字段保留。
- ID、顺序与类型无变化；撤销恢复基线且原夹具对象未被副作用修改。

**旧测试复用候选：** [business:tests/data_table.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/data_table.test.mjs)；[business:tests/table_structure.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_structure.test.mjs)；[business:tests/test_data_table.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_data_table.py)

<a id="tc-biz-002"></a>

## TC-BIZ-002 复制行与复制节点不继承任务执行身份

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-002](FEATURE_MATRIX.md#f-biz-002)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-009](USE_CASES.md#uc-biz-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/copy-with-receipts.json：一行含当前任务、历史结果和两个引用素材。

**准备**

- 准备原任务账本替身并记录其调用次数。

**步骤**

1. 复制行，再复制包含该行的节点。
2. 比较记录/素材实例 ID、请求 ID、帧引用和原文。

**可判断的期望**

- 复制对象使用新编辑身份，未继承原任务执行权或自动提交。
- 原文与合法引用保留；原行、账本及执行计数不变。

**旧测试复用候选：** [business:tests/data_table.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/data_table.test.mjs)；[business:tests/table_generation.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation.test.mjs)；[business:tests/table_generation_history.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_history.test.mjs)

<a id="tc-biz-003"></a>

## TC-BIZ-003 字段转换与稳定引用的原子保护

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-003](FEATURE_MATRIX.md#f-biz-003)、[F-BIZ-010](FEATURE_MATRIX.md#f-biz-010)、[F-BIZ-011](FEATURE_MATRIX.md#f-biz-011)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-005](USE_CASES.md#uc-biz-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/field-conversion.json：文本来源列、素材列、数字列及跨字段引用。

**准备**

- 记录所有字段/记录 ID 与初值。

**步骤**

1. 更名、隐藏、重排来源列；尝试将其转成含媒体的内容列。
2. 删除来源后撤销，再提交包含非法数字的批量转换。

**可判断的期望**

- 身份和绑定在更名/重排后保持；删除来源后生成阻止。
- 失败转换无部分写入；撤销恢复字段与引用。

**旧测试复用候选：** [business:tests/table_structure.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_structure.test.mjs)；[business:tests/table_prompt_source.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_source.test.mjs)

<a id="tc-biz-004"></a>

## TC-BIZ-004 表内范围选择、剪贴板与中文输入

**阶段：** M3；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-004](FEATURE_MATRIX.md#f-biz-004)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/clipboard.json：含多行文本、素材格和空格的两实例。

**准备**

- 真实 ComfyUI；拦截生成提交端点。

**步骤**

1. Shift/Ctrl 选择表内矩形，复制粘贴到另一范围。
2. 进入多行编辑器粘贴含换行/Tab 的文字；组合输入期间按 Enter/Escape。
3. 退出编辑后执行撤销/重做。

**可判断的期望**

- 范围选择不改变画布多选；编辑器粘贴保留一格。
- 组合输入不误提交；一次粘贴对应一个事务，第二实例不变。

**旧测试复用候选：** [business:tests/data_table.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/data_table.test.mjs)；[business:tests/table_text_side.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_text_side.test.mjs)；[business:tools/data_table_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/data_table_smoke.cjs)

<a id="tc-biz-005"></a>

## TC-BIZ-005 单素材广播与多素材顺序填列

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-006](FEATURE_MATRIX.md#f-biz-006)

**用例：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/fill-column.json：0/1/3 行表、图片/视频/文本集合。

**准备**

- 为每次操作建立独立表副本。

**步骤**

1. 单图片、单视频和单文本填入兼容列；对空表重复。
2. 以 2 项和 5 项集合填入已有 3 行表；填入空集合。

**可判断的期望**

- 单项填满所有现有行，空表生成 1 行。
- 多项仅改相应行并按需补行；尾行、其他列、源数据保持；空集合无变化。

**旧测试复用候选：** [business:tests/table_material_columns.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_columns.test.mjs)

<a id="tc-biz-006"></a>

## TC-BIZ-006 行头/单格填充及容量错误不部分写入

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-006](FEATURE_MATRIX.md#f-biz-006)

**用例：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/fill-boundaries.json：499/500 行、63/64 列与缺失素材集合。

**准备**

- 保存操作前 JSON 与素材身份清单。

**步骤**

1. 横向填入超出可编辑列的素材并验证补列；向已有格追加集合。
2. 分别提交第 501 行、第 65 列、不兼容文本列和含 missing 项集合。

**可判断的期望**

- 成功操作保持给定顺序和既有内容；仅预期行/格变化。
- 失败操作抛出对应容量/类型/缺失错误，表 JSON 与基线完全一致。

**旧测试复用候选：** [business:tests/table_material_columns.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_columns.test.mjs)

<a id="tc-biz-007"></a>

## TC-BIZ-007 媒体移动和重排不误绑定提示词

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-012](FEATURE_MATRIX.md#f-biz-012)

**用例：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)、[UC-BIZ-005](USE_CASES.md#uc-biz-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/asset-identity.json：同名不同 ID 素材、重复文件实例、跨列和跨行引用。

**准备**

- 创建明确 assetId 引用及旧位置引用各一条。

**步骤**

1. 在原行重排并跨列移动素材；复制后删除原件。
2. 把原件移到另一行，再解析提示词。

**可判断的期望**

- 同一行内引用跟随原 assetId，副本有独立 ID。
- 跨行/删除后引用失效，不绑定到相同位置、同名或相同 URL 的替代素材。

**旧测试复用候选：** [business:tests/table_prompt_template.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_template.test.mjs)；[business:tests/table_video_references.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_video_references.test.mjs)；[business:tests/table_material_columns.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_columns.test.mjs)

<a id="tc-biz-008"></a>

## TC-BIZ-008 多媒体单元格预览与交互释放

**阶段：** M3；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)

**用例：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/media-preview.json：不同宽高比图片、视频、长名称、多项单格与缺失媒体。

**准备**

- 真实 ComfyUI 创建两表；记录格尺寸、视频状态和监听数量。

**步骤**

1. 选格、悬停展开预览、播放/暂停、拖进度、Ctrl+滚轮缩放。
2. 移出、取消选择、模式切换、删除/恢复节点；测试 Delete 与 Enter。

**可判断的期望**

- 预览保持原比例不改变格尺寸；收起/销毁后视频暂停且监听释放。
- 单项删除/排序可撤销，第二表状态不受影响；缺媒体有占位而无错图。

**旧测试复用候选：** [business:tests/table_panel_views.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_panel_views.test.mjs)；[business:tests/table_material_columns.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_columns.test.mjs)；[business:tools/data_table_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/data_table_smoke.cjs)

<a id="tc-biz-009"></a>

## TC-BIZ-009 表格素材复制到画布的来源校验

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-007](FEATURE_MATRIX.md#f-biz-007)

**用例：** [UC-BIZ-002](USE_CASES.md#uc-biz-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 integration/table-material-drag.json：图片/视频格和延迟 materialItem 提供器。

**准备**

- 使用公开素材合同替身和一次实际宿主拖拽。

**步骤**

1. 拖一个素材到空白画布，撤销/重做。
2. 第二次拖拽延迟返回期间删除或替换源素材。

**可判断的期望**

- 正常拖拽创建一个上传素材节点并保留源单元格和文件引用。
- 来源变化后拒绝迟到结果，无幽灵节点或重复创建；整个创建仅一条编辑历史。

**旧测试复用候选：** [business:tests/table_material_output.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_output.test.mjs)；[business:tests/live_chain.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/live_chain.test.mjs)

<a id="tc-biz-010"></a>

## TC-BIZ-010 新建默认结构与历史规范差异冻结

**阶段：** M3；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-008](FEATURE_MATRIX.md#f-biz-008)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 baseline/table-defaults.json：记录当前 createMaterialTable 输出及实际 UI 截图。

**准备**

- 先核查当前源码默认 3 行及素材/提示词/生成列；对照旧 2×2 文档。

**步骤**

1. 在当前旧环境与新包各新建两个表，记录序列化和界面。
2. 由产品基线记录确定首版默认结构；再执行自动比较。

**可判断的期望**

- 差异有明确记录和批准基线，不凭旧文档或代码单方面改变产品。
- 新包两个实例均匹配冻结结构；现有工作流数据不被默认模板覆盖。

**旧测试复用候选：** [business:tests/table_material_columns.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_columns.test.mjs)；[business:tools/data_table_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/data_table_smoke.cjs)

<a id="tc-biz-011"></a>

## TC-BIZ-011 表格尺寸、边缘菜单和最后行列删除

**阶段：** M3；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-008](FEATURE_MATRIX.md#f-biz-008)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/layout-empty.json：长表、单行单列表、解析器空态及旧工作台。

**准备**

- 真实 ComfyUI 两实例，50%/100%/150% 缩放，800px/1440px 视口。

**步骤**

1. 拖拽右边缘和列分隔条，使用键盘调整并 Escape 取消。
2. 把菜单移近视口边缘；删除通用表最后一行/列并撤销。
3. 对解析器空态和原生图重复空表操作，保存刷新。

**可判断的期望**

- 宽度保存并独立恢复，长内容和焦点无不可达裁切。
- 仅符合通用画布规则的空表删除节点；撤销恢复连线/内容，解析器待上传入口保留。

**旧测试复用候选：** [business:tests/table_column_splitters.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_column_splitters.test.mjs)；[business:tests/table_empty_node.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_empty_node.test.mjs)；[business:tests/table_workbench_height.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_workbench_height.test.mjs)；[business:tools/table_splitter_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/table_splitter_smoke.cjs)

<a id="tc-biz-012"></a>

## TC-BIZ-012 两实例、模式往返与卸载完整性

**阶段：** M4；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)

**用例：** [UC-BIZ-001](USE_CASES.md#uc-biz-001)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 host/business-lifecycle.json：两个表、两个生成节点、两个解析器。

**准备**

- 在隔离 ComfyUI 中只安装新包；记录活动订阅、弹层和媒体引用。

**步骤**

1. 分别编辑不同实例，打开弹层，执行 Active/Mute/Bypass 往返。
2. 在原生图/App Mode/画布切换 20 轮，删除和恢复实例，保存刷新。

**可判断的期望**

- 业务数据、播放状态、任务和焦点归正确实例。
- 没有重复挂载、残留弹层或累积监听；非 Active 隐藏正文，Active 恢复。

**旧测试复用候选：** [business:tests/app_mode_bypass_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/app_mode_bypass_model.test.mjs)；[business:tests/dynamic_widget_lifecycle.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/dynamic_widget_lifecycle.test.mjs)；[business:tests/table_node_install.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_node_install.test.mjs)；[business:tools/comfy_credit_ui_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_ui_smoke.cjs)

<a id="tc-biz-013"></a>

## TC-BIZ-013 唯一来源旧绑定迁移、取消与复制

**阶段：** M3；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-010](FEATURE_MATRIX.md#f-biz-010)、[F-BIZ-037](FEATURE_MATRIX.md#f-biz-037)

**用例：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 migration/prompt-source.json：一致旧绑定、冲突绑定、无绑定、未知 version 和显式 null。

**准备**

- 为每种旧表备份原 JSON。

**步骤**

1. 读取并迁移，切换来源、复制来源列、隐藏、更名、删除后撤销。
2. 对冲突、显式取消和未知版本尝试生成预检。

**可判断的期望**

- 仅一致显式旧绑定自动迁移；其他情况不按名称/顺序猜测。
- 复制列不复制表级绑定；未知版本保留原数据并报告；无有效来源零提交。

**旧测试复用候选：** [business:tests/table_prompt_source.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_source.test.mjs)；[business:tests/test_prompt_source.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_source.py)；[business:tools/prompt_source_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/prompt_source_smoke.cjs)

<a id="tc-biz-014"></a>

## TC-BIZ-014 同行文本引用解析与异常定位

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-011](FEATURE_MATRIX.md#f-biz-011)、[F-BIZ-014](FEATURE_MATRIX.md#f-biz-014)

**用例：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/text-reference.json：正常引用、改名、空值、删除、自引用、循环及字面 @文本。

**准备**

- 同一 JSON 同时输入前端与 Python 解析器。

**步骤**

1. 插入结构化引用，重排字段后编译；直接粘贴 @列名。
2. 逐一引入空值、类型变化、自引用和循环。

**可判断的期望**

- 正常结果完全一致，字面 @文本不被转成引用。
- 各非法输入在前后端均定位相同字段/行并拒绝，无递归溢出或生成调用。

**旧测试复用候选：** [business:tests/table_prompt_source.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_source.test.mjs)；[business:tests/table_prompt_template.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_template.test.mjs)；[business:tests/test_prompt_source.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_source.py)；[business:tests/test_prompt_compiler.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_compiler.py)

<a id="tc-biz-015"></a>

## TC-BIZ-015 媒体引用与首尾帧顺序的一致性

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-012](FEATURE_MATRIX.md#f-biz-012)、[F-BIZ-013](FEATURE_MATRIX.md#f-biz-013)

**用例：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/frame-reference.json：两图一视频、同文件不同实例、失效和跨行绑定。

**准备**

- 构建 table/ScriptParser/外部生成节点三种投影。
- M3使用生成节点输入投影的契约替身，不提交生成；M4由TC-BIZ-028/012完成真实宿主联测。

**步骤**

1. 选择、交换、删除和重加帧标记，重排列中素材。
2. 保存重载后生成输入；尝试用视频/外行图片作为帧。

**可判断的期望**

- 帧绑定 ID 与顺序在三入口一致；帧标记不成为文本 token。
- 不兼容媒体和跨行绑定被拒绝；不暗中替换帧。

**旧测试复用候选：** [business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)；[business:tests/table_video_references.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_video_references.test.mjs)；[business:tests/table_exchange.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_exchange.test.mjs)

<a id="tc-biz-016"></a>

## TC-BIZ-016 模板、行覆盖和清空/恢复语义

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-013](FEATURE_MATRIX.md#f-biz-013)

**用例：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/template-overrides.json：模板行、显式覆盖、空段落覆盖和旧空字符串恢复值。

**准备**

- 记录每行最终编译文本与设置。

**步骤**

1. 修改列模板；清空第二行覆盖，再明确恢复模板。
2. 撤销/重做并序列化重载。

**可判断的期望**

- 模板仅影响未覆盖行；显式空白不被误判成继承。
- 恢复模板采用兼容语义；行设置、帧身份和历史无损。

**旧测试复用候选：** [business:tests/table_prompt_template.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_prompt_template.test.mjs)；[business:tests/table_generation.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation.test.mjs)

<a id="tc-biz-017"></a>

## TC-BIZ-017 预览、表格导出和后端编译逐项相等

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-014](FEATURE_MATRIX.md#f-biz-014)、[F-BIZ-024](FEATURE_MATRIX.md#f-biz-024)

**用例：** [UC-BIZ-005](USE_CASES.md#uc-biz-005)、[UC-BIZ-010](USE_CASES.md#uc-biz-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 contracts/generation-input.json：文字引用、媒体引用、模板覆盖、首尾帧与 Unicode。

**准备**

- 所有生成端点改为计数替身。
- M3使用生成节点输入投影的契约替身，不提交生成；M4由TC-BIZ-028/012完成真实宿主联测。

**步骤**

1. 分别由通用表、分镜表预览并导出到生成节点。
2. 把相同快照交 Python 编译器，比对文本、素材顺序、模式和身份。

**可判断的期望**

- 四条路径输入结果逐项相同，不出现预览正确而提交错列。
- 全过程生成创建次数为 0；非法引用均在预检阶段拒绝。

**旧测试复用候选：** [business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)；[business:tests/test_prompt_compiler.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_compiler.py)；[business:tests/table_exchange.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_exchange.test.mjs)

<a id="tc-biz-018"></a>

## TC-BIZ-018 优化建议审阅与批量应用事务

**阶段：** M3；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-015](FEATURE_MATRIX.md#f-biz-015)

**用例：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/optimization-review.json：两行建议、引用锚点、不同优化状态。

**准备**

- 使用本地固定响应替身；建立两个表实例。

**步骤**

1. 请求单格和整列建议，核对未应用原文。
2. 应用有效建议；一次撤销/重做，保存刷新后查看回执。

**可判断的期望**

- 建议未应用时表数据不变；应用保留引用与唯一来源。
- 整次应用一条历史，第二实例不变；刷新不会重复应用或重新请求。

**旧测试复用候选：** [business:tests/column_optimization.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/column_optimization.test.mjs)；[business:tests/prompt_optimization_workflow_history.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/prompt_optimization_workflow_history.test.mjs)；[business:tests/prompt_optimization_history_review.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/prompt_optimization_history_review.test.mjs)；[business:tools/column_optimization_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/column_optimization_smoke.cjs)

<a id="tc-biz-019"></a>

## TC-BIZ-019 优化异步结果的修订、切换与删除保护

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-015](FEATURE_MATRIX.md#f-biz-015)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**用例：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 prompt/stale-responses.json：可控制返回顺序的 3 个优化请求。

**准备**

- 在文档 revision/epoch 和 requestId 上布置观测。

**步骤**

1. 请求后修改一行，删除另一行，切换工作流后返回全部结果。
2. 撤销/重做原编辑并尝试应用旧建议。

**可判断的期望**

- 只有仍匹配范围/版本的建议可应用；旧回调不写当前文档。
- 撤销不使失效 epoch 回退；失败/过期计数不算成功。

**旧测试复用候选：** [business:tests/prompt_optimization_controller.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/prompt_optimization_controller.test.mjs)；[business:tests/prompt_optimization_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/prompt_optimization_model.test.mjs)；[business:tests/column_optimization.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/column_optimization.test.mjs)

<a id="tc-biz-020"></a>

## TC-BIZ-020 提供方报价、预算和认证不进入工作流

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)、[F-BIZ-026](FEATURE_MATRIX.md#f-biz-026)

**用例：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)、[UC-BIZ-009](USE_CASES.md#uc-biz-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/auth-quote.json：过期报价、变更模型、无凭据、伪 401/402/429 和本地请求。

**准备**

- 使用 loopback 假提供方与脱敏日志捕获；阻断公网。

**步骤**

1. 获取报价后改变模型/输入再提交；尝试无认证提交。
2. 把临时云凭据传给云请求，再调用本地请求并导出工作流/账本/日志。

**可判断的期望**

- 不匹配或过期报价要求重确认；缺认证在创建前失败。
- 凭据不进入序列化/指纹/日志，本地请求不读取或转发云凭据；未知 POST 结果不自动重发。

**旧测试复用候选：** [business:tests/test_prompt_optimization_quote_version.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_optimization_quote_version.py)；[business:tests/test_prompt_optimization_deepseek.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_optimization_deepseek.py)；[business:tests/native_prompt_optimization_probe.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/native_prompt_optimization_probe.py)；[business:tests/column_optimization.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/column_optimization.test.mjs)

<a id="tc-biz-021"></a>

## TC-BIZ-021 画布润色和反推纳入持久账本

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-017](FEATURE_MATRIX.md#f-biz-017)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)

**用例：** [UC-BIZ-007](USE_CASES.md#uc-biz-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/canvas-polish-restart.json：正常文本、真实小图、损坏/超限图及提交后崩溃点。

**准备**

- 新统一账本使用临时目录；提供方 create 为计数替身。

**步骤**

1. 请求一次并在收到结果前模拟进程终止；重启后用同 requestId 恢复。
2. 以相同 ID 改输入，再提交损坏和超限图片。

**可判断的期望**

- 重启后原请求记录仍在，不能产生第二次 create；不明结果明确标记。
- 不同输入同 ID 和非法图片拒绝；反推只携带选定图片；现有内存版测试仅作部分参考。

**旧测试复用候选：** [business:tests/test_canvas_polish.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_canvas_polish.py)

<a id="tc-biz-022"></a>

## TC-BIZ-022 DOCX 修订、合并单元格和图片出现顺序

**阶段：** M3；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-018](FEATURE_MATRIX.md#f-biz-018)

**用例：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 storyboard/revisions.docx：DrawingML/VML、插入/删除修订、合并格和重复图片。

**准备**

- 使用可重建 DOCX 夹具，记录预期物理行、锚点和图片 occurrence。

**步骤**

1. 解析文档最终视图；提取文字、段落、表格、来源和图片。
2. 校验损坏图片与未知结构处理。

**可判断的期望**

- 删除修订文字/图片排除，插入内容保留；物理行与合并锚点正确。
- 重复图片保持出现次数/顺序并有独立实例；坏图不让其他文本丢失。

**旧测试复用候选：** [business:tests/test_script_document.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_script_document.py)；[business:tests/test_script_contract.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_script_contract.py)；[business:tests/storyboard_fixture.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/storyboard_fixture.py)

<a id="tc-biz-023"></a>

## TC-BIZ-023 映射修订和 inventory 跨刷新恢复

**阶段：** M3；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-019](FEATURE_MATRIX.md#f-biz-019)、[F-BIZ-020](FEATURE_MATRIX.md#f-biz-020)

**用例：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 storyboard/mapping-v1.json：手工编辑、已完成结果、待分配图片、缺 inventory 的旧版本。

**准备**

- 导入夹具并删除临时解析缓存，仅保留工作流和 input 素材。

**步骤**

1. 重载后查看原文和待处理项；修改一列及单格映射。
2. 对缺 inventory 旧版本执行查看与调整。

**可判断的期望**

- 新版本无需 temp 缓存可恢复映射；手工编辑、行/素材身份及结果保留，冲突可定位。
- 旧版本明确提示重新上传原件补充，不能猜测来源或丢弃原数据。

**旧测试复用候选：** [business:tests/script_parser.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/script_parser.test.mjs)；[business:tests/test_script_contract.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_script_contract.py)

<a id="tc-biz-024"></a>

## TC-BIZ-024 追加去重、导入竞态和活动任务保护

**阶段：** M3；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-020](FEATURE_MATRIX.md#f-biz-020)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)

**用例：** [UC-BIZ-003](USE_CASES.md#uc-biz-003)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 storyboard/import-races.json：同指纹重导、新版本、500 行边界及各活动任务阶段。

**准备**

- 准备可延迟返回的导入请求及前后 JSON 快照。

**步骤**

1. 重复导入同文档，追加新版本；导入等待时编辑表格。
2. 在 waiting/running/pausing/paused/needs_recovery 各状态尝试重映射和历史恢复。

**可判断的期望**

- 重复来源跳过；合法新版本可追踪；竞态和超限导入无部分写入。
- 任务快照/request ID 不被导入或撤销清除/替换；用户编辑和已有结果保持。

**旧测试复用候选：** [business:tests/script_parser.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/script_parser.test.mjs)；[business:tests/table_generation_history.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_history.test.mjs)

<a id="tc-biz-025"></a>

## TC-BIZ-025 各支持文件格式的真实解析夹具

**阶段：** M3；**优先级：** P1；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-021](FEATURE_MATRIX.md#f-biz-021)

**用例：** [UC-BIZ-004](USE_CASES.md#uc-biz-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 import/formats/：DOCX/XLSX/XLSM/CSV/TSV/TXT/MD/PDF 各正常/空/损坏样本。

**准备**

- 冻结每格式支持边界和最大文件大小；不使用用户私密文稿作固定夹具。

**步骤**

1. 逐格式解析并规范化到表格契约；测中文、引号、换行和表外说明。
2. 提交损坏/加密/结构不支持文件并检查原表快照。

**可判断的期望**

- 正常夹具输出符合明确预期；未支持结构有可理解错误。
- 解析失败不改现有表格、不触发生成；支持扩展名不等于自动通过所有格式验收。

**旧测试复用候选：** [business:tests/test_daelab_storyboard_import.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_daelab_storyboard_import.py)；[business:tests/daelab_storyboard_import.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/daelab_storyboard_import.test.mjs)；[business:tools/storyboard_import_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/storyboard_import_smoke.cjs)

<a id="tc-biz-026"></a>

## TC-BIZ-026 AI 归类的发送范围和结构拒绝

**阶段：** M3；**优先级：** P1；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-022](FEATURE_MATRIX.md#f-biz-022)、[F-BIZ-019](FEATURE_MATRIX.md#f-biz-019)

**用例：** [UC-BIZ-008](USE_CASES.md#uc-biz-008)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 storyboard/ai-classification.json：选中 2 行原文、未选行、图片和非法分类响应。

**准备**

- 提供方为本机假服务，记录完整请求但不放真实凭据。

**步骤**

1. 未点击按钮时加载/保存文稿；显式点击归类后捕获请求。
2. 返回缺行、重复来源、跨行、改写文字与合法结果。

**可判断的期望**

- 未点击零请求；请求仅有选中文本/来源 ID，不含图片或未选原文。
- 非法响应不改变原文和草稿；无配置时手工流程仍完整。

**旧测试复用候选：** [business:tests/test_script_ai.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_script_ai.py)；[business:tests/test_script_contract.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_script_contract.py)

<a id="tc-biz-027"></a>

## TC-BIZ-027 生成行选择、配置草稿和全批预检

**阶段：** M4；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-023](FEATURE_MATRIX.md#f-biz-023)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 generation/selection.json：空结果、已有结果、失效提示词、运行中任务及选中标记。

**准备**

- 生成服务为计数替身；配置面板保留未折叠/已折叠两种草稿。

**步骤**

1. 选中两行提交，其中一行非法；取消选择提交有效空结果行。
2. 修改参数后不另点保存直接生成，再用恢复操作提交原任务。

**可判断的期望**

- 明确选中批次任一非法行时全部零提交；默认只选有效空结果行且不重复运行中项。
- 新提交采用最新草稿；恢复严格使用原输入快照。

**旧测试复用候选：** [business:tests/table_generation_request.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_request.test.mjs)；[business:tests/table_generation.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation.test.mjs)；[business:tests/test_table_generation.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_generation.py)

<a id="tc-biz-028"></a>

## TC-BIZ-028 表格与外部生成节点双向同步及断开

**阶段：** M4；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-024](FEATURE_MATRIX.md#f-biz-024)、[F-BIZ-041](FEATURE_MATRIX.md#f-biz-041)

**用例：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 integration/table-generation-exchange.json：源表和两个任务节点、节点独有参数。

**准备**

- 使用稳定 source/record/field ID；记录编辑命令次数。

**步骤**

1. 导入表格，修改源提示词/帧、节点允许编辑项，执行撤销/重做。
2. 重排列并删除源行、断开来源，返回延迟同步响应。

**可判断的期望**

- 匹配身份的数据同步且节点专有设置/结果保留；不同实例不串改。
- 断开/删除阻止新提交；无反馈回写循环，迟到响应不覆盖当前值。

**旧测试复用候选：** [business:tests/table_exchange.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_exchange.test.mjs)；[business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)；[business:tests/video_task_linked_prompt.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/video_task_linked_prompt.test.mjs)

<a id="tc-biz-029"></a>

## TC-BIZ-029 型号、模式和媒体能力前后端一致

**阶段：** M4；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)、[F-BIZ-013](FEATURE_MATRIX.md#f-biz-013)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-010](USE_CASES.md#uc-biz-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/capabilities.json：Comfy 精确型号、local Qwen/H3 三模式与非法旧参数。

**准备**

- 从当前支持清单构造能力夹具；外部调用全部替身。

**步骤**

1. 逐型号生成合法与非法参数组合；切换本地/云端和模式。
2. 传入缺帧、多余帧、视频充当图片及未知型号。

**可判断的期望**

- 前端展示与后端接受范围一致；型号身份不被 Fast/Mini 或近似名替代。
- 不兼容保存参数明确迁移/拒绝；非法请求均不入队。

**旧测试复用候选：** [business:tests/generation_parameters.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_parameters.test.mjs)；[business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)；[business:tests/test_table_comfy_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_comfy_video.py)；[business:tests/test_table_local_h3.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_h3.py)

<a id="tc-biz-030"></a>

## TC-BIZ-030 Comfy 原生图校验、认证隔离和错误分类

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-026](FEATURE_MATRIX.md#f-biz-026)、[F-BIZ-042](FEATURE_MATRIX.md#f-biz-042)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-010](USE_CASES.md#uc-biz-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/comfy-graphs.json：支持图像/视频型号与模式、空认证、伪 401/402/429。

**准备**

- 运行受支持 Comfy 核心的 validate_prompt；队列 put 为可计数替身；阻断付费端点。

**步骤**

1. 构建各型号原生图并仅校验；无认证和非法设置尝试提交。
2. 带虚拟凭据执行队列替身并检查 extra/sensitive 与回执。

**可判断的期望**

- 合法图通过类型/输入校验，非法配置和无认证在入队前失败。
- 凭据仅出现在 sensitive；错误分类可操作；无真实生成调用，校验不记为输出成功。

**旧测试复用候选：** [business:tests/test_table_comfy_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_comfy_video.py)；[business:tests/table_comfy_transport.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_comfy_transport.test.mjs)；[business:tools/comfy_credit_validate.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_validate.py)；[business:tools/comfy_credit_api_smoke.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_api_smoke.py)

<a id="tc-biz-031"></a>

## TC-BIZ-031 本地 Qwen 构图、缺依赖与结果验证

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-027](FEATURE_MATRIX.md#f-biz-027)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/local-qwen.json：正常依赖、缺模型/节点、坏输出和越界输出路径。

**准备**

- 模型目录与 Comfy 注册节点使用临时夹具；队列为替身。

**步骤**

1. 逐项移除必要依赖再预检；构建合法图片工作流。
2. 返回存在、缺失、非 output 和越界路径的结果。

**可判断的期望**

- 缺依赖列出准确项目且零入队，不自动换模型。
- 仅真实存在且位于 output 根内的合法结果被接受；构图通过不算实机出图。

**旧测试复用候选：** [business:tests/test_table_local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_qwen.py)；[business:tests/table_local_qwen.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_local_qwen.test.mjs)

<a id="tc-biz-032"></a>

## TC-BIZ-032 本地 H3 三模式与帧绑定回归

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-028](FEATURE_MATRIX.md#f-biz-028)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-010](USE_CASES.md#uc-biz-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/local-h3-modes.json：文生、首帧、首尾帧和不支持参考视频/音频。

**准备**

- 使用节点/模型目录夹具，不装载真实权重。

**步骤**

1. 分别构图并检查 0/1/2 图输入顺序和模式特有节点。
2. 使用缺帧、多图、视频/音频参考及旧不支持模式。

**可判断的期望**

- 三模式构图与绑定独立正确，保存参数无静默降级。
- 不支持组合在入队前拒绝；测试只证明构图/校验。

**旧测试复用候选：** [business:tests/test_table_local_h3.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_h3.py)；[business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)

<a id="tc-biz-033"></a>

## TC-BIZ-033 幂等指纹、冻结媒体与重复提交

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/idempotency.json：同 ID 同/异输入、不同 ID 同输入和可替换源文件。

**准备**

- 临时持久账本、媒体目录和计数执行器；并发请求使用独立客户端。

**步骤**

1. 并发提交同请求两次；以同 ID 改提示词/参数再提交。
2. 撤销浏览器回执后以同输入恢复；替换源媒体并查询原任务。

**可判断的期望**

- 同执行至多创建一次；不同输入同 ID 拒绝；明确新生成才分配新执行。
- 原任务使用冻结文件与哈希，源替换不改变旧快照；密钥不进入指纹。

**旧测试复用候选：** [business:tests/test_table_generation.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_generation.py)；[business:tests/test_table_completed_input.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_completed_input.py)；[business:tests/test_table_concurrency.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_concurrency.py)；[business:tests/test_libtv_bridge.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_libtv_bridge.py)

<a id="tc-biz-034"></a>

## TC-BIZ-034 多种旧任务存储迁移与崩溃恢复

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-037](FEATURE_MATRIX.md#f-biz-037)

**用例：** [UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 migration/job-stores/：生成 JSON、优化 SQLite、润色内存无持久记录的边界及备份清单。

**准备**

- 新账本在隔离目录；保留旧文件校验和；建立各阶段中断注入点。

**步骤**

1. 迁入完整/损坏/重复/未知 schema 记录并重复运行迁移。
2. 在提交前、提交后未落远端 ID、落 ID 后、完成后分别强制终止再重启。

**可判断的期望**

- 迁移幂等且不改旧原件；损坏记录隔离报告，无偷偷补造执行身份。
- 重启状态可追踪；旧内存记录缺失明确声明不可恢复，不能虚构任务成功或自动重发。

**旧测试复用候选：** [business:tests/test_prompt_optimization.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_optimization.py)；[business:tests/test_table_completed_input.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_completed_input.py)；[business:tests/test_table_recovery.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_recovery.py)

<a id="tc-biz-035"></a>

## TC-BIZ-035 提交结果未知时禁止自动重发

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)、[F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)、[F-BIZ-026](FEATURE_MATRIX.md#f-biz-026)

**用例：** [UC-BIZ-006](USE_CASES.md#uc-biz-006)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/uncertain-submit.json：create 被服务端接收后断网、无远端 ID、有远端 ID 两种回执。

**准备**

- 假提供方记录 create/query 次数并可丢弃响应。

**步骤**

1. 触发提交断网并重启后端；自动刷新状态和点击恢复原任务。
2. 在相同 requestId 上更换输入，并模拟 401/429 查询失败。

**可判断的期望**

- 未知无 ID 状态保持待处理，create 总次数仍为 1。
- 有 ID 时只 query 原任务；不同输入拒绝；错误不触发隐式新收费请求。

**旧测试复用候选：** [business:tests/test_prompt_optimization.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_optimization.py)；[business:tests/test_prompt_optimization_deepseek.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_prompt_optimization_deepseek.py)；[business:tests/native_prompt_optimization_probe.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/native_prompt_optimization_probe.py)；[business:tests/test_table_recovery.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_recovery.py)

<a id="tc-biz-036"></a>

## TC-BIZ-036 下载失败、文件缺失和有界恢复

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-031](FEATURE_MATRIX.md#f-biz-031)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**用例：** [UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-013](USE_CASES.md#uc-biz-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/download-recovery.json：生成成功下载失败、临时网络错误、平台终止失败及文件哈希变化。

**准备**

- 假提供方提供相同 remote ID 和可控下载器；配置恢复查询上限。

**步骤**

1. 恢复下载失败任务，交替返回网络错误/等待/完成。
2. 删除或修改已完成文件；持续返回不可恢复响应直到上限。

**可判断的期望**

- 恢复只下载或查询，create 不增加；哈希/存在校验失败不得显示完整成功。
- 重试有界，终止失败不继续轮询；错误和可执行恢复动作保留。

**旧测试复用候选：** [business:tests/test_table_recovery.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_recovery.py)；[business:tests/test_table_generation_diagnosis.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_generation_diagnosis.py)；[business:tests/test_table_completed_input.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_completed_input.py)

<a id="tc-biz-037"></a>

## TC-BIZ-037 暂停范围、本地中断和云任务继续

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-032](FEATURE_MATRIX.md#f-biz-032)、[F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)

**用例：** [UC-BIZ-012](USE_CASES.md#uc-biz-012)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/pause-matrix.json：两批次等待/运行任务、本地队列项和云端已提交项。

**准备**

- 执行器可控制何时入队/开始/中断；记录所有 request/remote/prompt ID。

**步骤**

1. 暂停 A 某行、再暂停 A 整批；观察 B。
2. 确认本地中断并继续；让已提交云任务完成后恢复。

**可判断的期望**

- A 未提交项停止，B 不变；本地中断未确认前保持 pausing。
- 本地继续明确重跑当前行，云端仅恢复原执行；UI 文案不承诺已提交云任务取消/退款。

**旧测试复用候选：** [business:tests/test_table_concurrency.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_concurrency.py)；[business:tests/test_table_local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_qwen.py)；[business:tests/table_generation.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation.test.mjs)

<a id="tc-biz-038"></a>

## TC-BIZ-038 逆序完成、过期结果、历史追加与撤销

**阶段：** M4；**优先级：** P0；**层级：** domain；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-013](USE_CASES.md#uc-biz-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 generation/result-order.json：3 行、两代请求、历史结果和可删除目标。

**准备**

- 控制结果返回顺序并记录事务及任务账本变化。

**步骤**

1. 逆序完成任务，期间编辑一行、删除另一行并切换文档。
2. 撤销编辑，追加同一历史结果两次，再重做。

**可判断的期望**

- 只有匹配行/列/request/输入戳的结果写回；过期结果保留可审查状态。
- 历史追加去重；编辑撤销不删除账本、不倒退执行事实、不触发新请求。

**旧测试复用候选：** [business:tests/table_generation_history.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_history.test.mjs)；[business:tests/table_generation.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation.test.mjs)；[business:tests/table_generation_polling.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_polling.test.mjs)

<a id="tc-biz-039"></a>

## TC-BIZ-039 任务汇总真实性与订阅生命周期

**阶段：** M4；**优先级：** P1；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-034](FEATURE_MATRIX.md#f-biz-034)、[F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)

**用例：** [UC-BIZ-013](USE_CASES.md#uc-biz-013)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 tasks/mixed-states.json：等待、成功、失败、跳过、过期、未知及带/不带百分比。

**准备**

- 统一任务订阅器计数；旧轮询适配器使用假时钟。

**步骤**

1. 展示多个节点汇总，重复刷新完成记录；开闭节点和切换模式。
2. 供应方仅给阶段或给真实百分比时分别更新。

**可判断的期望**

- 成功计数不包含失败/跳过/过期；仅真实百分比展示为百分比。
- 历史完成不重复提示；同任务订阅去重且销毁后无新增请求。

**旧测试复用候选：** [business:tests/task_snapshots.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/task_snapshots.test.mjs)；[business:tests/prompt_optimization_status.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/prompt_optimization_status.test.mjs)；[business:tests/table_generation_polling.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_polling.test.mjs)

<a id="tc-biz-040"></a>

## TC-BIZ-040 跨节点并发预算和失败隔离

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)、[F-BIZ-030](FEATURE_MATRIX.md#f-biz-030)

**用例：** [UC-BIZ-014](USE_CASES.md#uc-biz-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 jobs/concurrency.json：3 批次各 50 个 mock 云任务、10 个 mock 本地任务和执行别名。

**准备**

- 以首版批准的云/本地预算运行；记录活跃执行峰值及全部 request ID。

**步骤**

1. 同时提交多批次，加入两个指向同执行的回执别名。
2. 让一个任务失败并暂停部分等待项，等待其余完成。

**可判断的期望**

- 全进程峰值不超过批准预算；本地串行，别名不重叠执行。
- 失败/暂停只影响目标，其他任务全部可完成；不存在无界并发或任务丢失。

**旧测试复用候选：** [business:tests/test_table_concurrency.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_concurrency.py)

<a id="tc-biz-041"></a>

## TC-BIZ-041 本地 LLM 与原生 Comfy 队列共享资源门控

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)、[F-BIZ-027](FEATURE_MATRIX.md#f-biz-027)、[F-BIZ-028](FEATURE_MATRIX.md#f-biz-028)

**用例：** [UC-BIZ-014](USE_CASES.md#uc-biz-014)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 resources/gpu-admission.json：Qwen 占用、原生入队、卸载成功/超时、隔离标记和暂停竞态。

**准备**

- GPU 操作为替身；记录租约获取、释放和 queue.put 顺序。

**步骤**

1. Qwen 运行期间申请原生/H3 入队；模拟卸载超时。
2. 申请期间暂停目标，重启后读取隔离标记，再显式恢复。

**可判断的期望**

- 不安全状态不进入原生队列；暂停后不延迟入队。
- 异常释放资源或明确保持隔离；恢复动作可追踪，无资源租约泄漏。

**旧测试复用候选：** [business:tests/test_local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_local_qwen.py)；[business:tests/test_table_local_h3.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_h3.py)；[business:tests/test_table_local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_qwen.py)

<a id="tc-biz-042"></a>

## TC-BIZ-042 有序结果成组、再引用和原生输出只读

**阶段：** M5；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-036](FEATURE_MATRIX.md#f-biz-036)、[F-BIZ-042](FEATURE_MATRIX.md#f-biz-042)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)

**用例：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)、[UC-BIZ-013](USE_CASES.md#uc-biz-013)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 integration/results-to-canvas.json：多行/多结果、空行、同文件不同实例和已变更输入。

**准备**

- 结果文件为真实小媒体夹具；生成创建函数设置为调用即失败。

**步骤**

1. 按任务输出素材组，追加历史结果并作为新提示词引用。
2. 通过原生 VideoGenerate 旧槽位读取结果；删除文件和改变来源后重复。

**可判断的期望**

- 每任务独立成组，名称和顺序保持；空任务跳过，重复追加无重复素材。
- 合法原生输出只读完成结果；缺失/失效明确失败，创建函数从未调用。

**旧测试复用候选：** [business:tests/table_material_output.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_material_output.test.mjs)；[business:tests/libtv_canvas_result.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/libtv_canvas_result.test.mjs)；[business:tests/libtv_video_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/libtv_video_model.test.mjs)

<a id="tc-biz-043"></a>

## TC-BIZ-043 旧工作流、资产及槽位的单包迁移

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-037](FEATURE_MATRIX.md#f-biz-037)、[F-BIZ-029](FEATURE_MATRIX.md#f-biz-029)

**用例：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 migration/golden-workflows/：表格、解析器、生成、LLM B、旧槽位和保存的结果/任务。

**准备**

- 复制真实结构的去敏工作流与所有引用文件；记录旧环境节点/槽位/文件哈希。

**步骤**

1. 新包隔离安装导入，检查缺依赖/重复注册，再保存新副本并重载。
2. 运行不执行生成的输出/类型校验，读取迁入历史回执。

**可判断的期望**

- 节点 ID、槽位顺序、行列/素材身份、文件哈希和任务关联符合黄金清单。
- 不依赖旧仓库目录；无静默丢节点/重置设置/生成调用；旧原件可回退。

**旧测试复用候选：** [business:tests/table_node_install.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_node_install.test.mjs)；[business:tests/generation_input_regression.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/generation_input_regression.test.mjs)；[business:tests/test_table_completed_input.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_completed_input.py)；[business:tools/video_tasks_restore_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/video_tasks_restore_smoke.cjs)

<a id="tc-biz-044"></a>

## TC-BIZ-044 退役 LibTV 记录只能读取历史结果

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-038](FEATURE_MATRIX.md#f-biz-038)、[F-OUT-010](FEATURE_MATRIX.md#f-out-010)

**用例：** [UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-015](USE_CASES.md#uc-biz-015)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 migration/retired-libtv.json：complete/waiting/running/unknown、StoryboardBatch 和旧 Lib Image 配置。

**准备**

- CLI 启动、付费创建和 Comfy queue.put 均设为调用即失败。

**步骤**

1. 读取旧完成结果并导出；对未完成记录点击恢复/继续。
2. 尝试按旧配置创建新云任务。

**可判断的期望**

- 完整旧结果可读；未完成记录明确退役，不启动任何执行。
- 新任务必须显式重新配置现支持型号，不把旧名称推断为新通道；所有执行计数为 0。

**旧测试复用候选：** [business:tests/test_libtv_bridge.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_libtv_bridge.py)；[business:tests/test_libtv_batch.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_libtv_batch.py)；[business:tests/test_table_comfy_video.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_comfy_video.py)；[business:tools/comfy_credit_api_smoke.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_api_smoke.py)

<a id="tc-biz-045"></a>

## TC-BIZ-045 大表、媒体与长时编辑性能预算

**阶段：** M6；**优先级：** P1；**层级：** performance；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-001](FEATURE_MATRIX.md#f-biz-001)、[F-BIZ-005](FEATURE_MATRIX.md#f-biz-005)、[F-BIZ-008](FEATURE_MATRIX.md#f-biz-008)、[F-BIZ-009](FEATURE_MATRIX.md#f-biz-009)、[F-BIZ-034](FEATURE_MATRIX.md#f-biz-034)

**用例：** [UC-BIZ-016](USE_CASES.md#uc-biz-016)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-S/M/L：标准场景2张各500×10表，压力场景10张各500×10表；不扩大单表500行/64列容量。

**准备**

- 固定硬件、浏览器、Comfy 版本和视口；加载 M0 已批准预算，未设置预算不得判通过。
- 视频仅按可见/主动播放策略解码；禁止真实生成。

**步骤**

1. 记录首次可操作、文本编辑到绘制、滚动与布局 p95；采集长任务和峰值内存。
2. 执行 20 轮打开/关闭面板、模式切换、删除/恢复，并等待 GC 稳态。

**可判断的期望**

- 各指标满足批准预算且不比冻结旧基线出现未批准退化。
- 卸载后订阅/监听为基线值；内存无连续增长趋势；保存数据未因性能优化截断。

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-biz-046"></a>

## TC-BIZ-046 云端适配协议与禁止真实调用保护

**阶段：** M4；**优先级：** P1；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-026](FEATURE_MATRIX.md#f-biz-026)、[F-BIZ-025](FEATURE_MATRIX.md#f-biz-025)、[F-BIZ-031](FEATURE_MATRIX.md#f-biz-031)、[F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)、[F-BIZ-017](FEATURE_MATRIX.md#f-biz-017)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-011](USE_CASES.md#uc-biz-011)、[UC-BIZ-006](USE_CASES.md#uc-biz-006)、[UC-BIZ-007](USE_CASES.md#uc-biz-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 providers/cloud-contract.json：Comfy/DeepSeek 图片、视频与优化通道的确定性假响应；禁止访问真实端点。

**准备**

- 使用本机假提供方、虚构凭据和固定响应；真实远端请求一旦发生即失败。
- 记录假服务create/query/download计数及真实出站调用计数；本轮不配置真实云凭据。

**步骤**

1. 向假服务提交各通道的合法与非法参数，验证身份、引用和错误映射。
2. 模拟429、应答丢失、已提交查询恢复、下载中断及水印参数处理。
3. 验证优化建议、引用保持、模拟用量/费用字段和审阅应用；检查真实网络调用计数。

**可判断的期望**

- 参数、鉴权边界、状态转换及恢复同一身份符合合同，真实提供方调用次数为零。
- 模拟结果、费用和水印参数仅证明协议处理；不声明真实模型效果、水印表现或计费已验收。
- 云端适配能力保留；真实云调用不属于本轮测试，也不构成本轮退出门槛。

**旧测试复用候选：** [business:tools/comfy_credit_validate.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_validate.py)；[business:tools/comfy_credit_ui_smoke.cjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tools/comfy_credit_ui_smoke.cjs)

<a id="tc-biz-047"></a>

## TC-BIZ-047 本地 Qwen 与 MiniMax 真实生成结果

**阶段：** M4；**优先级：** P1；**层级：** provider-live；**方式：** 人工；**执行策略：** 仅本地 Qwen/MiniMax。

**功能：** [F-BIZ-027](FEATURE_MATRIX.md#f-biz-027)、[F-BIZ-028](FEATURE_MATRIX.md#f-biz-028)、[F-BIZ-035](FEATURE_MATRIX.md#f-biz-035)

**用例：** [UC-BIZ-009](USE_CASES.md#uc-biz-009)、[UC-BIZ-014](USE_CASES.md#uc-biz-014)

**真实模型白名单：** qwen3.5:9b-q4_K_M、Qwen-Image-2.1 Turbo（本地）、MiniMax H3 FL（本地）

**夹具：** 拟建 provider-live/local-acceptance.json：本地Qwen文本优化/图片反推、Qwen文生图及MiniMax H3文生/首帧/首尾帧视频的最小合法样本。

**准备**

- 真实模型仅限live_models白名单且必须使用本地执行路径；同名云端Minimax H3不允许调用。
- 确认本地权重、节点、GPU与资源窗口，记录版本；缺少条件标阻塞，不回退云端或其他模型。
- 本轮仅修订文档，后续测试执行时使用隔离输出并阻断云端提交。

**步骤**

1. 使用本地Qwen优化文本和按当前支持能力反推图片，审阅后应用并核对引用。
2. 执行Qwen文生图及MiniMax H3三种视频模式，保存本地prompt/task ID、峰值显存、耗时和输出。
3. 核对首尾帧顺序、媒体解码、分辨率、来源和资源释放；统计云端提交数。

**可判断的期望**

- 纳入的本地模式分别有真实结果；失败不得用其他模型或模式替代。
- 文本应用与媒体结果关联正确输入快照；缺依赖明确列阻塞，静态校验不冒充真实生成通过。
- 全部真实调用使用白名单本地路径，云端提交次数为零。

**旧测试复用候选：** [business:tests/test_table_local_h3.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_h3.py)；[business:tests/test_table_local_qwen.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_table_local_qwen.py)

<a id="tc-biz-048"></a>

## TC-BIZ-048 LLM 多源输入、应用后输出及模型调用边界

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-017](FEATURE_MATRIX.md#f-biz-017)、[F-BIZ-043](FEATURE_MATRIX.md#f-biz-043)、[F-BIZ-016](FEATURE_MATRIX.md#f-biz-016)

**用例：** [UC-BIZ-007](USE_CASES.md#uc-biz-007)、[UC-BIZ-006](USE_CASES.md#uc-biz-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 llm/multi-input-approved.json：文本、图、混合素材组、多行表格、已应用/未应用与重复行 ID。

**准备**

- 模型调用使用固定结果替身；原生 ApprovedLLMResult 执行禁止网络。

**步骤**

1. 为两个 B 节点连接不同来源并生成建议；未应用时读取两个输出。
2. 应用后检查文本和逐行 JSON，重排/删除来源、保存重载；测试重复行 ID。

**可判断的期望**

- 未应用不提供有效输出；应用后逐行 ID 唯一且与原来源一致。
- 原生执行只读取应用快照，零模型调用；来源失效不使用别的预览；DeepSeek/Comfy仅协议模拟，本地Qwen真实结果由TC-BIZ-047验收。

**旧测试复用候选：** [business:tests/llm_slot_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/llm_slot_model.test.mjs)；[business:tests/llm_io_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/llm_io_model.test.mjs)；[business:tests/llm_task_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/llm_task_model.test.mjs)；[business:tests/test_canvas_polish.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_canvas_polish.py)

<a id="tc-biz-049"></a>

## TC-BIZ-049 同步投影不拥有任务轮询且不污染撤销

**阶段：** M3；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-BIZ-041](FEATURE_MATRIX.md#f-biz-041)、[F-BIZ-033](FEATURE_MATRIX.md#f-biz-033)、[F-BIZ-024](FEATURE_MATRIX.md#f-biz-024)

**用例：** [UC-BIZ-010](USE_CASES.md#uc-biz-010)、[UC-BIZ-016](USE_CASES.md#uc-biz-016)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 table/live-source-ownership.json：一个来源生成列、两个只读投影和一个本地生成列。

**准备**

- 为每列 task status 调用和编辑历史设置计数器。
- M3任务对账使用确定性状态服务；M4再接真实账本与生成节点，不能将替身通过当成后端恢复通过。

**步骤**

1. 轮询多个周期并同步源完成状态；执行用户编辑后撤销，再让旧状态返回。
2. 断开/重连源，删除源行；检查定位和新提交权限。

**可判断的期望**

- 只有来源拥有列和本地自有生成列对账；投影无重复远程查询。
- 派生同步不消耗用户撤销或清空重做；断开后来源身份保留且不可新提交。

**旧测试复用候选：** [business:tests/table_generation_polling.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_generation_polling.test.mjs)；[business:tests/table_exchange.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_exchange.test.mjs)；[business:tests/column_optimization.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/column_optimization.test.mjs)

<a id="tc-biz-050"></a>

## TC-BIZ-050 生产注册白名单与旧入口显式转换

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-BIZ-039](FEATURE_MATRIX.md#f-biz-039)、[F-BIZ-040](FEATURE_MATRIX.md#f-biz-040)、[F-BIZ-044](FEATURE_MATRIX.md#f-biz-044)、[F-BIZ-037](FEATURE_MATRIX.md#f-biz-037)、[F-OUT-011](FEATURE_MATRIX.md#f-out-011)

**用例：** [UC-BIZ-015](USE_CASES.md#uc-biz-015)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 拟建 migration/registration-manifest.json：全旧节点清单、含 GPTImageStoryboardStage 与 LLM A/C/D/E 的工作流。

**准备**

- 冻结新包生产注册白名单与兼容读取清单；以纯新包干净环境启动。

**步骤**

1. 扫描构建/导入依赖和实际节点注册；导入含徽章/展厅/分割的混合文件。
2. 读取旧分镜阶段与样式原型数据，预览并显式转换到通用表格/生成和 LLM B。

**可判断的期望**

- 新包不注册被排除旧业务或 LLM A/C/D/E 生产入口；缺外部依赖明确报告且不删节点。
- GPTImageStoryboardStage 兼容读取与显式转换不宣称当前旧实现已退役；转换保留数据/结果及原件，未确认不执行。

**旧测试复用候选：** [business:tests/table_node_install.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/table_node_install.test.mjs)；[business:tests/llm_slot_model.test.mjs](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/llm_slot_model.test.mjs)；[business:tests/test_daelab_comfytv_storyboard.py](../../../ComfyUI-DAELab-Custom-Nodes-Library/tests/test_daelab_comfytv_storyboard.py)

<a id="tc-sys-001"></a>

## TC-SYS-001 仅新包的最小安装

**阶段：** M1；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-001](FEATURE_MATRIX.md#f-sys-001)、[F-SYS-009](FEATURE_MATRIX.md#f-sys-009)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)

**用例：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-007](USE_CASES.md#uc-sys-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E2 空用户目录及仅测试环境启用的最小节点/面板契约夹具

**准备**

- 移除旧包加载路径且不配置可选服务

**步骤**

1. 安装发布产物并启动
2. 读取节点清单并打开画布
3. 创建两个最小受控面板，验证编辑、保存和刷新；M2再使用正式上传/文本，M6验收完整节点清单。

**可判断的期望**

- 启动无本包导入异常
- 当前阶段声明已交付的节点均可创建且仅一份；契约夹具不进入正式发布包
- 不需运行npm构建，不访问付费接口

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-002"></a>

## TC-SYS-002 新旧包冲突可见且无覆盖

**阶段：** M1；**优先级：** P0；**层级：** integration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-015](FEATURE_MATRIX.md#f-sys-015)

**用例：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E5 冲突目录副本

**准备**

- 创建旧Canvas和旧业务各自/同时存在的三种组合

**步骤**

1. 运行安装预检与受控启动
2. 检查冲突诊断和注册结果

**可判断的期望**

- 明确指出冲突包路径与处理方式
- 不删除目录，不依赖加载顺序替换同名类
- 不出现两个可写画布或两份事件绑定

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-003"></a>

## TC-SYS-003 依赖方向及旧资源路径检查

**阶段：** M1；**优先级：** P0；**层级：** contract；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-002](FEATURE_MATRIX.md#f-sys-002)、[F-SYS-004](FEATURE_MATRIX.md#f-sys-004)

**用例：** [UC-SYS-011](USE_CASES.md#uc-sys-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 静态源依赖图

**准备**

- 只对白名单compat历史文本允许旧路径

**步骤**

1. 扫描import和资源URL
2. 注入测试夹具中的跨feature私有import及循环
3. 运行依赖检查

**可判断的期望**

- 正式源无非法跨层或循环
- 禁止样例被拒绝
- 运行产物不指向两个旧仓库目录

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-004"></a>

## TC-SYS-004 同源控件与双实例隔离

**阶段：** M1；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-003](FEATURE_MATRIX.md#f-sys-003)、[F-SYS-005](FEATURE_MATRIX.md#f-sys-005)

**用例：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-002](USE_CASES.md#uc-sys-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-GRAPH 两实例

**准备**

- 在陈列和宿主使用同一按钮/字段实现

**步骤**

1. 改变共享主题测试变量
2. 编辑A字段并让A异步忙碌
3. 销毁A再操作B

**可判断的期望**

- 三处控件显示同一版本
- B值与忙碌态不受A污染
- B可继续操作且A订阅释放

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-005"></a>

## TC-SYS-005 模式切换与异步会话隔离

**阶段：** M1；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-005](FEATURE_MATRIX.md#f-sys-005)、[F-SYS-006](FEATURE_MATRIX.md#f-sys-006)

**用例：** [UC-SYS-002](USE_CASES.md#uc-sys-002)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-GRAPH 两工作流

**准备**

- 假任务延迟返回，记录两图的稳定ID

**步骤**

1. 提交图A请求
2. 切Graph再切画布并打开图B
3. 让图A响应返回

**可判断的期望**

- 图B内容/选中/布局不被改写
- 图A任务账本结果仍可查看
- 只有有效会话可应用结果

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-006"></a>

## TC-SYS-006 撤销不回退执行事实

**阶段：** M4；**优先级：** P0；**层级：** integration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-005](FEATURE_MATRIX.md#f-sys-005)、[F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**用例：** [UC-SYS-002](USE_CASES.md#uc-sys-002)、[UC-SYS-004](USE_CASES.md#uc-sys-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-JOBS 已提交任务

**准备**

- 假服务记录create次数

**步骤**

1. 提交任务
2. 修改及撤销其来源文本，删除并撤销恢复节点
3. 刷新并查询状态

**可判断的期望**

- requestId与远端ID不因undo变化
- create仅一次
- 输入版本变化时结果不会自动覆盖现文本

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-007"></a>

## TC-SYS-007 缺少可选依赖的最小能力

**阶段：** M1；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-001](FEATURE_MATRIX.md#f-sys-001)、[F-SYS-009](FEATURE_MATRIX.md#f-sys-009)

**用例：** [UC-SYS-007](USE_CASES.md#uc-sys-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E1 提供方故障注入

**准备**

- 分别模拟依赖导入错误、无凭据、缺模型、连接不可达

**步骤**

1. 初始化产品
2. 请求核心健康与能力接口；M2/M3在本场景追加真实资产和表格服务回归
3. 读取能力列表并请求受影响能力

**可判断的期望**

- 基础服务始终可用
- 不可用能力带具体原因
- 无模拟成功、无意外提交、无整包导入失败

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-008"></a>

## TC-SYS-008 旧稳定标识与未知字段往返

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-013](FEATURE_MATRIX.md#f-sys-013)、[F-SYS-005](FEATURE_MATRIX.md#f-sys-005)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-GRAPH 旧版本与未知字段

**准备**

- 保留原始JSON及归一化差异白名单

**步骤**

1. 导入旧图
2. 改一处无关标题
3. 导出并重开

**可判断的期望**

- 节点ID/槽位/连接/组顺序/material JSON保持
- 未知字段未静默丢弃
- 差异仅包括显式编辑和记录的版本投影

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-009"></a>

## TC-SYS-009 未迁节点报告与原件保留

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-013](FEATURE_MATRIX.md#f-sys-013)、[F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-OUT-001](FEATURE_MATRIX.md#f-out-001)、[F-OUT-002](FEATURE_MATRIX.md#f-out-002)、[F-OUT-003](FEATURE_MATRIX.md#f-out-003)、[F-OUT-004](FEATURE_MATRIX.md#f-out-004)、[F-OUT-005](FEATURE_MATRIX.md#f-out-005)、[F-OUT-006](FEATURE_MATRIX.md#f-out-006)、[F-OUT-007](FEATURE_MATRIX.md#f-out-007)、[F-OUT-008](FEATURE_MATRIX.md#f-out-008)、[F-OUT-009](FEATURE_MATRIX.md#f-out-009)、[F-OUT-010](FEATURE_MATRIX.md#f-out-010)、[F-OUT-011](FEATURE_MATRIX.md#f-out-011)、[F-OUT-012](FEATURE_MATRIX.md#f-out-012)、[F-OUT-013](FEATURE_MATRIX.md#f-out-013)、[F-OUT-014](FEATURE_MATRIX.md#f-out-014)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-GRAPH 徽章/原型/未知外部节点

**准备**

- 副本包含被排除ID和通用创作节点

**步骤**

1. 预检并导入副本
2. 查看缺失能力报告
3. 尝试导出可恢复文件

**可判断的期望**

- 全部缺失ID可见
- 原始JSON未修改
- 不删除未知节点或其连线，不伪造执行结果

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-010"></a>

## TC-SYS-010 跨origin收藏目录显式迁移

**阶段：** M2；**优先级：** P1；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-008](FEATURE_MATRIX.md#f-sys-008)、[F-SYS-014](FEATURE_MATRIX.md#f-sys-014)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-LIBRARY 两个origin导出

**准备**

- 两目录含重复媒体、不同文本快照和失效引用

**步骤**

1. 分别导出旧目录并导入新资产目录
2. 重复导入
3. 在新origin重开资产库

**可判断的期望**

- 重复项按明确身份去重
- 两个文本快照保持
- 失效引用有标记，未创建空节点
- 新目录可备份且不依赖原origin

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-011"></a>

## TC-SYS-011 迁移预检与dry-run无写入

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-020](FEATURE_MATRIX.md#f-sys-020)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E5 全量副本

**准备**

- 对所有源与目标路径做前置哈希快照

**步骤**

1. 执行dry-run
2. 检查未知schema/缺失媒体/活动任务报告
3. 重新比较目录

**可判断的期望**

- 工作流/素材/账本未改变
- 报告包含预期转换和阻断项
- 凭据不进入报告

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-012"></a>

## TC-SYS-012 迁移中断后的原子恢复

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-006](USE_CASES.md#uc-sys-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-JOBS FX-LIBRARY

**准备**

- 分别在复制后、数据库提交前、清单落盘前注入终止

**步骤**

1. 启动迁移并在注入点终止
2. 重启迁移工具
3. 执行恢复或回滚

**可判断的期望**

- 原始备份完整
- 不存在可见的半成功数据集
- 恢复后引用及数量一致

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-013"></a>

## TC-SYS-013 迁移重复执行保持幂等

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-008](FEATURE_MATRIX.md#f-sys-008)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E5 确定性全量副本

**准备**

- 固定数据版本和迁移ID

**步骤**

1. 连续执行迁移两次
2. 对比节点/资产/收藏/任务数量与ID
3. 检查假服务调用记录

**可判断的期望**

- 第二次无额外实体
- 原任务身份不变
- 外部create调用为0

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-014"></a>

## TC-SYS-014 在途任务切换保护

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-JOBS running/unknown

**准备**

- 同时准备有远端ID和无可恢复身份的任务

**步骤**

1. 运行切换预检
2. 保存可恢复任务身份
3. 尝试切换不可恢复任务

**可判断的期望**

- 可恢复任务附恢复计划
- 不可恢复在途任务未被当已迁完成
- 不会自动重新提交任何任务

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-015"></a>

## TC-SYS-015 回滚保护旧数据与新数据

**阶段：** M6；**优先级：** P0；**层级：** migration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-014](FEATURE_MATRIX.md#f-sys-014)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)

**用例：** [UC-SYS-006](USE_CASES.md#uc-sys-006)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E5 旧备份和新schema数据

**准备**

- 新包已生成合成的新工作流与媒体

**步骤**

1. 创建新数据保全包
2. 停用新包恢复旧版和迁移前数据
3. 启动旧环境并核对保全包

**可判断的期望**

- 旧图可加载且引用正确
- 新数据及其清单完整
- 不将新schema直接覆写为旧schema

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-016"></a>

## TC-SYS-016 重启任务账本恢复原身份

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**用例：** [UC-SYS-004](USE_CASES.md#uc-sys-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-JOBS submitted/running/success

**准备**

- 假服务可查询且计数create

**步骤**

1. 启动任务并持久化远端ID
2. 终止并重启后端进程
3. 查询并下载原结果

**可判断的期望**

- create不增加
- 状态按事实恢复
- 成功记录不会恢复为新的running

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-017"></a>

## TC-SYS-017 提交应答丢失不重复付费

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**用例：** [UC-SYS-004](USE_CASES.md#uc-sys-004)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PROVIDER response-lost

**准备**

- 假服务create已生效但不返回响应

**步骤**

1. 发送一次请求
2. 注入超时并重启
3. 执行恢复动作，分别启用/禁用查询能力

**可判断的期望**

- 支持核对时使用同一身份核对
- 无查询能力时保持unknown
- 不新建requestId自动重发

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-018"></a>

## TC-SYS-018 取消能力与排队范围

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-010](FEATURE_MATRIX.md#f-sys-010)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**用例：** [UC-SYS-008](USE_CASES.md#uc-sys-008)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PROVIDER 无取消能力

**准备**

- 同时存在排队和已提交任务

**步骤**

1. 取消排队项
2. 请求停止已提交项
3. 读取后台与前端状态

**可判断的期望**

- 排队项永不create
- 无远端取消能力时不宣称已取消
- 结果到达仍可在账本核对

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-019"></a>

## TC-SYS-019 分资源限流及公平推进

**阶段：** M4；**优先级：** P1；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-010](FEATURE_MATRIX.md#f-sys-010)

**用例：** [UC-SYS-008](USE_CASES.md#uc-sys-008)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 100个确定性假任务

**准备**

- GPU=1、云=3、转码=2作为测试配置

**步骤**

1. 混合提交含失败与慢任务
2. 采集各资源并发峰值
3. 取消部分排队任务

**可判断的期望**

- 各峰值不超过配置
- 不同资源队列均有推进
- 失败释放配额，取消项不执行

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-020"></a>

## TC-SYS-020 输入与文件路径校验

**阶段：** M2；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-020](FEATURE_MATRIX.md#f-sys-020)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-009](USE_CASES.md#uc-sys-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-MEDIA 非法路径/损坏文件

**准备**

- 仅允许指定input/output目录并配置请求大小上限

**步骤**

1. 请求目录穿越、绝对越界路径、错误类型及超限体积
2. 对正常素材执行同接口

**可判断的期望**

- 非法请求被可读错误拒绝
- 无越界读取或写入
- 正常素材成功且原文件内容不变

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-021"></a>

## TC-SYS-021 日志与导出不泄漏凭据

**阶段：** M1；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-011](FEATURE_MATRIX.md#f-sys-011)、[F-SYS-020](FEATURE_MATRIX.md#f-sys-020)

**用例：** [UC-SYS-009](USE_CASES.md#uc-sys-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 虚构标记密钥

**准备**

- 将唯一哨兵密钥放入测试连接配置

**步骤**

1. 执行成功、校验失败、远端错误
2. 导出工作流与诊断包
3. 扫描产物和异常文本

**可判断的期望**

- 哨兵密钥只存在受控配置中
- 诊断包含requestId和错误阶段
- 工作流/日志/前端快照无密钥

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-022"></a>

## TC-SYS-022 错误与版本诊断可定位

**阶段：** M1；**优先级：** P1；**层级：** integration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-006](FEATURE_MATRIX.md#f-sys-006)、[F-SYS-011](FEATURE_MATRIX.md#f-sys-011)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)

**用例：** [UC-SYS-009](USE_CASES.md#uc-sys-009)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PROVIDER 429/500

**准备**

- 记录前后端构建指纹

**步骤**

1. 触发429、输入错误与版本不匹配
2. 查看错误和诊断
3. 恢复原任务查询

**可判断的期望**

- 原因及可采取动作不同
- 版本不匹配能定位缓存/安装问题
- 重试查询不会调用create

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-023"></a>

## TC-SYS-023 小型场景帧时间

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)

**用例：** [UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-S

**准备**

- 使用E6测量协议

**步骤**

1. 运行30秒固定拖动缩放轨迹五次
2. 保存帧间隔和长停顿

**可判断的期望**

- 满足PERF-01
- 报告所有五次p50/p95及环境，不筛选最好结果

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-024"></a>

## TC-SYS-024 标准场景交互延迟

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)

**用例：** [UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-M

**准备**

- 使用E6测量协议

**步骤**

1. 同时播放可见预览
2. 拖动缩放并编辑固定表格单元格

**可判断的期望**

- 满足PERF-02
- 视频/无视频分别报告

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-025"></a>

## TC-SYS-025 标准场景保存与重开

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)、[F-SYS-013](FEATURE_MATRIX.md#f-sys-013)

**用例：** [UC-SYS-010](USE_CASES.md#uc-sys-010)、[UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-M

**准备**

- 媒体缓存已预热且有固定JSON哈希

**步骤**

1. 保存工作流并重开五次
2. 比较编辑数据与可交互时间

**可判断的期望**

- 满足PERF-03
- 数据无丢失；不等待不可见视频解码

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-026"></a>

## TC-SYS-026 大型场景降级与取消

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)

**用例：** [UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-L

**准备**

- 记录当前资源预算

**步骤**

1. 打开大型场景
2. 滚动并启动可取消的批量操作
3. 取消后保存

**可判断的期望**

- 满足PERF-04
- 取消有效且保存成功
- 未操作对象保持原值

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-027"></a>

## TC-SYS-027 生命周期资源回收

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)、[F-SYS-005](FEATURE_MATRIX.md#f-sys-005)

**用例：** [UC-SYS-002](USE_CASES.md#uc-sys-002)、[UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-M

**准备**

- 启用订阅/计时器/媒体资源测试计数

**步骤**

1. 创建销毁、切模式、开关面板20轮
2. 按协议受控GC并取样

**可判断的期望**

- 满足PERF-05
- 无已销毁实例继续回调
- 任务执行不因视图销毁被取消

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-028"></a>

## TC-SYS-028 混合队列后端响应

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-010](FEATURE_MATRIX.md#f-sys-010)、[F-SYS-012](FEATURE_MATRIX.md#f-sys-012)

**用例：** [UC-SYS-008](USE_CASES.md#uc-sys-008)、[UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PROVIDER 100任务

**准备**

- 同时模拟转码和文件操作

**步骤**

1. 周期查询健康接口
2. 记录队列等待与并发
3. 等待所有非取消任务结束

**可判断的期望**

- 满足PERF-06
- 无事件循环长时间阻塞或配额泄漏

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-029"></a>

## TC-SYS-029 一小时创作稳定性

**阶段：** M5；**优先级：** P1；**层级：** performance；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-012](FEATURE_MATRIX.md#f-sys-012)、[F-SYS-017](FEATURE_MATRIX.md#f-sys-017)

**用例：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-010](USE_CASES.md#uc-sys-010)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-PERF-M 加假任务

**准备**

- 隔离环境，记录起始数据和资源计数

**步骤**

1. 循环编辑、保存、任务、切换和销毁1小时
2. 重开并核对数据

**可判断的期望**

- 满足PERF-07
- 无重复提交、丢失编辑或持续资源增长

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-030"></a>

## TC-SYS-030 构建发布与缓存一致性

**阶段：** M6；**优先级：** P0；**层级：** integration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-016](FEATURE_MATRIX.md#f-sys-016)

**用例：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-011](USE_CASES.md#uc-sys-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 两次清洁检出

**准备**

- 固定依赖与工具版本，不带node_modules/旧dist

**步骤**

1. 各自构建并比对资源清单
2. 安装发布包
3. 模拟缓存旧前端访问新后端

**可判断的期望**

- 除明确时间戳元数据外产物一致
- 资源版本和包版本可诊断
- 旧缓存不会静默使用不兼容schema

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-031"></a>

## TC-SYS-031 宿主支持版本矩阵

**阶段：** M6；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-006](FEATURE_MATRIX.md#f-sys-006)、[F-SYS-016](FEATURE_MATRIX.md#f-sys-016)

**用例：** [UC-SYS-001](USE_CASES.md#uc-sys-001)、[UC-SYS-011](USE_CASES.md#uc-sys-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E2 最低/默认/候选宿主

**准备**

- 每个环境使用独立用户目录

**步骤**

1. 安装同一新包
2. 执行注册、连线、撤销、模式、保存重开
3. 记录差异

**可判断的期望**

- 最低/默认均通过
- 候选失败则不声明支持
- 不存在仅维护者环境可用的隐藏依赖

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-032"></a>

## TC-SYS-032 完整创作流程的可重复验收

**阶段：** M5；**优先级：** P0；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-017](FEATURE_MATRIX.md#f-sys-017)、[F-SYS-005](FEATURE_MATRIX.md#f-sys-005)、[F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-008](FEATURE_MATRIX.md#f-sys-008)

**用例：** [UC-SYS-003](USE_CASES.md#uc-sys-003)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** FX-DOCX FX-MEDIA FX-EDIT FX-PROVIDER

**准备**

- 两个表格、一个外部生成节点及两个结果组

**步骤**

1. 导入并修改提示词
2. 分别从表内和表外提交假任务
3. 结果回填并输出组到剪辑
4. 编辑导出、保存重开

**可判断的期望**

- 来源/顺序/配置不串实例
- 输出媒体参数匹配剪辑
- 重开不增加create次数，继续编辑可用

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-033"></a>

## TC-SYS-033 可选ComfyTV存在与缺失

**阶段：** M2；**优先级：** P1；**层级：** host；**方式：** 混合；**执行策略：** 不付费。

**功能：** [F-SYS-018](FEATURE_MATRIX.md#f-sys-018)、[F-SYS-009](FEATURE_MATRIX.md#f-sys-009)、[F-OUT-012](FEATURE_MATRIX.md#f-out-012)

**用例：** [UC-SYS-007](USE_CASES.md#uc-sys-007)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** E2 与 E3

**准备**

- 记录上游文件哈希及注册节点

**步骤**

1. 无上游运行基础流程
2. 安装支持的上游版本并运行兼容展示/接线
3. 再次对比上游文件

**可判断的期望**

- 缺失时无虚假菜单
- 兼容仅通过声明能力工作
- 未改写上游文件或替换上游注册

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-034"></a>

## TC-SYS-034 旧库退出与排除项检查

**阶段：** M6；**优先级：** P0；**层级：** integration；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-001](FEATURE_MATRIX.md#f-sys-001)、[F-SYS-004](FEATURE_MATRIX.md#f-sys-004)、[F-SYS-021](FEATURE_MATRIX.md#f-sys-021)、[F-OUT-001](FEATURE_MATRIX.md#f-out-001)、[F-OUT-002](FEATURE_MATRIX.md#f-out-002)、[F-OUT-003](FEATURE_MATRIX.md#f-out-003)、[F-OUT-004](FEATURE_MATRIX.md#f-out-004)、[F-OUT-005](FEATURE_MATRIX.md#f-out-005)、[F-OUT-006](FEATURE_MATRIX.md#f-out-006)、[F-OUT-007](FEATURE_MATRIX.md#f-out-007)、[F-OUT-008](FEATURE_MATRIX.md#f-out-008)、[F-OUT-009](FEATURE_MATRIX.md#f-out-009)、[F-OUT-010](FEATURE_MATRIX.md#f-out-010)、[F-OUT-011](FEATURE_MATRIX.md#f-out-011)、[F-OUT-012](FEATURE_MATRIX.md#f-out-012)、[F-OUT-013](FEATURE_MATRIX.md#f-out-013)、[F-OUT-014](FEATURE_MATRIX.md#f-out-014)

**用例：** [UC-SYS-005](USE_CASES.md#uc-sys-005)、[UC-SYS-011](USE_CASES.md#uc-sys-011)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 最终发布包及NODE_INVENTORY

**准备**

- 两个旧库目录均不在加载路径

**步骤**

1. 扫描发布包与运行请求
2. 核对正式注册节点
3. 打开仅含纳入节点的兼容工作流

**可判断的期望**

- 无旧库导入和资源请求
- 正式生产注册与菜单不暴露排除能力；兼容读取白名单可提供最小只读schema，但不得启用旧执行
- 纳入流程完整运行

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-035"></a>

## TC-SYS-035 数据写入失败保持一致

**阶段：** M4；**优先级：** P0；**层级：** backend；**方式：** 自动；**执行策略：** 不付费。

**功能：** [F-SYS-007](FEATURE_MATRIX.md#f-sys-007)、[F-SYS-008](FEATURE_MATRIX.md#f-sys-008)、[F-SYS-014](FEATURE_MATRIX.md#f-sys-014)

**用例：** [UC-SYS-004](USE_CASES.md#uc-sys-004)、[UC-SYS-005](USE_CASES.md#uc-sys-005)

**真实模型白名单：** 无；本用例使用无模型调用的测试方法。

**夹具：** 临时账本与文件目录

**准备**

- 注入磁盘满/只读/原子替换失败

**步骤**

1. 执行任务回执与资产结果落盘
2. 在失败点重启
3. 核对数据库与文件

**可判断的期望**

- UI不显示虚假保存成功
- 无指向半文件的完成结果
- 可从原身份恢复或给出明确待修复状态

**旧测试复用候选：** 无；迁移实施时建立。

<a id="tc-sys-036"></a>

## TC-SYS-036 本地 Qwen 与 MiniMax 完整流程及实测范围

**阶段：** M4；**优先级：** P0；**层级：** provider-live；**方式：** 混合；**执行策略：** 仅本地 Qwen/MiniMax。

**功能：** [F-SYS-009](FEATURE_MATRIX.md#f-sys-009)、[F-SYS-017](FEATURE_MATRIX.md#f-sys-017)、[F-SYS-019](FEATURE_MATRIX.md#f-sys-019)

**用例：** [UC-SYS-003](USE_CASES.md#uc-sys-003)、[UC-SYS-004](USE_CASES.md#uc-sys-004)、[UC-SYS-011](USE_CASES.md#uc-sys-011)

**真实模型白名单：** qwen3.5:9b-q4_K_M、Qwen-Image-2.1 Turbo（本地）、MiniMax H3 FL（本地）

**夹具：** E4 白名单本地Qwen/MiniMax最小任务集，与表内/表外入口和剪辑流程连接

**准备**

- 只允许live_models中的本地模型及执行路径；记录资源窗口、实际权重、节点和GPU。
- 所有云端提交设为禁止；本轮文档修订不执行模型。

**步骤**

1. 通过表内/表外已支持入口执行本地Qwen图像/文本与MiniMax视频样本，接入结果回填及剪辑。
2. 记录本地prompt/task ID、输入模式和输出属性。
3. 在可控条件下验证本地队列状态、结果重读和中断后明确重跑；核对云端提交数。

**可判断的期望**

- 本地真实结果与模式一致，不以mock替代真实结果。
- 缺失或失败的本地能力不标本轮实测通过，不自动改用云端或其他模型。
- 其他提供方适配代码保留，只记录协议测试/真实运行未验收；不据此阻塞本轮本地生成范围。
- 云端提交次数为零。

**旧测试复用候选：** 无；迁移实施时建立。
