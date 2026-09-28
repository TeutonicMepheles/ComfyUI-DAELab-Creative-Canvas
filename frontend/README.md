# 创作画布控件陈列

第三阶段交付。只服务于现有创作画布相关节点的新组件；尚未接入 ComfyUI。不加载展厅/徽章 App Mode，不改动旧前端。

## 启动

需要 Node.js 24.12+（本机验证 24.14）与 npm。首次安装需网络，安装完成后运行资源全部本地提供。

```powershell
cd ComfyUI-DAELab-Creative-Canvas/frontend
npm ci
npm run dev
```

打开 http://127.0.0.1:5178 。不需要启动 ComfyUI/Python，也不需要登录 LibTV。

左侧“组合预览”展示两张数据独立的卡片；六个组件入口展示状态和双实例。所有生成按钮仅产生本地延迟状态，不会提交任务。编辑陈列数据保存在当前页面内存中，刷新重置；不写用户工作流。

## 文件归属

- `src/design/tokens.css`：唯一视觉变量。
- `src/ui/*.vue`：六类组件唯一实现，`src/ui/index.js` 为统一导出。
- `showcase/App.vue`：示例状态与组合，不是另一份控件库。
- `showcase/registry.js`：实现入口、陈列消费方与宿主未接入状态。
- `src/design/icons.js`：复用仓库已有 Remix SVG。构建自动保留其完整 LICENSE。
- `public/samples/`：本地原创 SVG 场景及 FFmpeg testsrc2 生成的 3 秒测试视频，无用户素材。

现有 `tableButton`、`createIconButton`、`tableDialog`、`createWorkbench`、媒体预览和创作画布视图都已评估。它们包含宿主访问、旧 CSS 或直接 DOM 挂载，因此新 UI 用独立 Vue 容器实现同类契约，旧实现不修改。画布视口数学直接复用既有纯模块 `web/creative_canvas_model.mjs`；图标直接引用现有资产。通用表格编辑器、Prompt 规则、任务恢复等不在本阶段重写。

## 验证

开发服务器运行时，另开终端：

```powershell
npm test
node tests/source-updates.mjs
npm run build
```

测试使用本机 Chrome；可通过 `BROWSER_CHANNEL` 指定 Playwright 浏览器渠道。测试结果位于忽略提交的 `test-results/`。源码传播测试会临时修改指定组件，并在 finally 中还原；**不能与这些组件的编辑并发执行**。如进程被强制终止，检查源码 diff 后再继续开发。

`browser.mjs` 验证交互、实例隔离、焦点、媒体、窄屏与对比度；两个脚本合计覆盖六种组件的真实单源码样式/行为修改。测试临时禁用某些动作或改变默认行为仅用来证明传播，不作为产品变更。

`npm run build` 只生成 `frontend/dist/`，不写 `web/`。`npm run preview` 可在停止 dev 后查看构建版本。构建使用的 Vue/Vite 模式依据 [Vue 官方快速开始](https://vuejs.org/guide/quick-start.html)与 [Vite 指南](https://vite.dev/guide/)，安装版本在 package-lock.json 固定。

## 下一阶段边界

真实 ComfyUI 菜单、节点注册、工作流持久化、旧面板租借、图接线、App Mode 切出后的兼容属于第四阶段。这里通过不能证明上述集成已通过。旧工作流和展厅/徽章实现保持原状。
