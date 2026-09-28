# 创作画布原生控件陈列

主入口：`Creative Canvas Controls.json`。本机已保存到 ComfyUI 工作流列表的 `DAELab/Creative Canvas Controls.json`，打开即进入现有创作画布模式。不需要运行工作流即可查看和编辑控件。

包含 7 个已有节点：多维表格、两份独立 LibTV 视频节点、LibTV 分镜批量生成、ComfyTV 图片加载、视频加载、视频抽帧。保留表格→批处理、视频→抽帧两条真实连接。生成项目 ID 留空；本次只验证界面，没有提交生成。

它展示真实节点实现，不加载 `frontend/` 新 Vue 组件或独立主题。修改节点共享实现后重新加载，此陈列和同类真实节点会使用相同实现；JSON 只存实例数据和布局，不是组件源码。

## 素材与迁移

`assets/` 包含本次陈列的自制山景 PNG 和 3 秒测试 WebM。已安装到本机 ComfyUI input 的 `daelab-gallery` 子目录。移动到其他机器时，将 assets 下两个文件复制到该机器的 `input/daelab-gallery/`，再打开 JSON；不能只复制 JSON 就假定素材自动随文件携带。

空白处拖动平移、滚轮缩放；右上“适应”查看全部卡片。上排为表格和两份 LibTV 参数面板，下排为批处理、素材和抽帧。节点“设置”折叠/展开实际面板。

## 验证与重建

`node tools/creative_canvas_gallery.mjs` 在隔离浏览器中创建新图、上传自制素材、验证并导出此示例。需要本机 Chrome 和 frontend 安装的 Playwright；默认 ComfyUI :8000，可用 COMFY_URL 指定。脚本不会保存或覆盖 ComfyUI 的现有工作流，也不提交 prompt；ComfyUI 列表中的安装副本由单独的 userdata 保存步骤创建。

证据位于 `docs/architecture/native-gallery/`。隔离截图测试将资产列表响应设为空，避免把无关的用户素材带入证据；媒体本身来自真实本地 /view 接口，组件和 CSS 没有替换。在用户 ComfyUI 中打开时，资产库仍显示用户自己的正常列表。
