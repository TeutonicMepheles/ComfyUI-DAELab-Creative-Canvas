# 表格底行跟随修复（2026-09-30）

分支从远端 main `b8246d5` 创建。

## 原因与范围

前次只取消 CSS sticky，遗漏业务表格 `table_structure.mjs` 的逐帧 `pinActions()`：它通过内联 `translateY` 将新增行拉回画布可见交集。computed position 为 static 不能证明底行没有被移动。

画布完整高度表格现在同时禁用底行 transform。修复限定 `.dae-creative` 内的完整高度表格，不修改业务库、ComfyTV、表格数据或横向新增列行为。

## 实际检查

- ComfyUI 联合安装，用户的“创作画布测试”长表，37% 缩放：表格上方仍可见、底部移出视口时，脚本内联 transform 为 `translateY(-1042.61px)`，computed transform 为 `none`。
- 底行 bottom=784.90717、表格 bottom=784.90718，底行跟随实际表格底边，不滞留视口。浏览器刷新后仍为 none，底边偏差小于 0.001 屏幕像素。
- “QA-existing-result-output”两个实例均为 none，底边偏差小于 0.001 屏幕像素；图形／画布模式往返后保持。
- 另存验证副本 `QA-footer-follow-20260930` 后刷新检查，不覆盖用户正式工作流。

未完成独立安装实机、全部缩放级别与焦点组合；不将本记录标记为完整产品验收。未执行付费生成。
