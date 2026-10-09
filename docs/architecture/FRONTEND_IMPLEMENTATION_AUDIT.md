# 前端规范与现有实现核对记录

核对日期：2026-10-04。画布基线：`785bad3441550f580cb42b7a9532cc0f4ee547f9`，已 fetch 并确认 HEAD 与 origin/main 一致。可选业务库为本机安装的 `a65ff67`（2026-09-30），未将它称为最新远端业务版本。业务库已有删除归档截图脚本的本地改动，与此次核对无关，未修改该库。

此次按现有实现校订文档，不修改节点表现；设计目标、公共 API 可选能力、当前消费方行为和实际验收证据分别说明。

| 原表述或遗漏 | 当前实现及校订 | 源码入口 |
| --- | --- | --- |
| 白色素材标题容易被理解为仅适用于组内 | 已加载媒体的孤立上传标题也为白色；空上传标题保持 muted | `web/material_groups.css` 的 `[data-upload=true]:has(...) ... strong` |
| 其他节点一律采用外置标题 | 由 upload、floatingHeader 或 content 呈现决定；默认卡片使用内置标题 | `web/creative_canvas.css` 外置标题选择器；`web/creative_canvas_view.mjs` |
| 验收要求已有素材无额外操作按钮 | 已有素材具有替换、下载、全屏操作，随状态和宽度显隐；禁止的是重复信息浮层 | `web/material_groups.mjs` 的 `decorateMedia`；`web/material_groups.css` |
| 160px 阈值可被理解为控制所有媒体按钮 | 只控制右上素材操作及空态上传入口，视频底部播放栏有自己的显隐条件 | `web/material_groups.mjs`；`web/media_upload.css` |
| 重命名只写 Enter 保存 | 标题失焦也保存非空名称，空名称保留原标题 | `web/creative_canvas_view.mjs` 的 `rename` |
| 成员标题不占额外高度，未列空态例外 | 所在行有选中的空上传成员时预留 28 屏幕像素 | `web/material_groups.mjs` 的 `layoutGroups` |
| 工具栏描述容易被理解为完全无轮询 | 布局事件更新位置与选择，另保留 150ms 状态 tick；基础面板 mode 同步为 100ms | `web/material_groups.mjs`；`web/creative_panel_state.mjs` |
| 脉冲仅写较慢、仅列素材和组 | 所有有关联选中节点的线均可显示脉冲；归一化路径 1000，24/176 虚线，1 秒循环 | `web/material_groups.mjs` 的 `updateWirePulse`；`web/material_groups.css` |
| 剪辑底部仅有导出 | 空闲时提供导出，导出中显示取消；成功后另有折叠成片预览及下载 | `web/video_edit_panel.mjs` 的 `running` / `output` |
| 表格按行填充、单格多个素材、保留多余行 | 当前业务适配器只声明列目标；单元格落点也从首行填整列，行数调整为素材数，每格一个素材 | 业务库 `web/creative_canvas_adapter.js`；`web/table_material_columns.mjs`；`web/data_table_editor.mjs` |
| 表格图像生成仅配置，范围不清 | `goal` 标记仅配置；独立 generation 列已具备图片／视频提交及原任务恢复 | 业务库 `web/table_content_view.mjs`；`web/table_structure.mjs`；`web/table_generation_panel.mjs` |
| 表格呈现被推广到所有表格节点 | DAELAB.Table 声明 content；分镜导入等类型为 card，可使用独立编辑器 | 业务库 `web/creative_canvas_adapter.js` |
| 调宽缺少键盘与命中尺寸 | 640 画布像素最小宽度，16 屏幕像素命中带，左右键 20px、Shift 100px，拖动可取消 | `web/creative_canvas_view.mjs`；`web/creative_canvas.css` |
| 节点所有权表述不明确 | 上传、素材组、剪辑均在本仓库；业务表格在业务库 | `web/adapters/upload.mjs`；`web/material_group.js`；`web/video_edit.js` |

## 本次界面检查范围

通过实际 `http://127.0.0.1:8000/` ComfyUI 的既有「创作画布测试」工作流查看界面和 DOM 计算样式：多个图片／视频素材、三个素材组、一个表格及一个剪辑节点，画布约 37% 缩放。

- 已确认两个以上上传实例使用白色媒体标题，组名、表格、剪辑使用 muted 标题；素材屏幕宽约 128px 时右上三个操作隐藏。
- 已确认通用表格宿主标记为 content/fullHeight；现有工作流仍显示旧任务表工具栏和内容，不能据此认定所有旧表格状态已经呈现为简洁内容网格。
- 已确认剪辑具有倍率、导出分辨率及锁定、吸附、时间轴工具；既有导出结果显示折叠成片预览和下载链接。
- 未上传、替换、生成、导出或编辑业务数据。未重做保存／刷新恢复、模式往返、拖动取消、其他缩放级别、独立安装、键盘焦点或异步失败的完整交互验收。表格填充及生成规则来自源码，未通过写入或付费任务验证。

以上是文档核对证据，不是全量产品验收。后续实现变更仍遵循 [前端验收要求](FRONTEND_INTERACTION.md#验收)。
