# DAELab Creative Canvas

独立维护的 ComfyUI 创作画布扩展：本地图片／视频上传、媒体卡片、统一连接端口、磁吸命中、框选、复制粘贴与画布导航。原生 ComfyUI 图仍是执行与存储来源，不另建执行引擎。

## 安装

在 ComfyUI 的 `custom_nodes` 下克隆本仓库并重启 ComfyUI：

```sh
git clone https://github.com/TeutonicMepheles/ComfyUI-DAELab-Creative-Canvas.git
```

工作流模式菜单 → **创作画布**，双击空白处 → **上传**。支持 PNG、JPG、WebP、MP4、WebM、MOV；浏览器能否预览视频取决于文件编码。

已有 DAELab 节点库用户应先按 [迁移说明](docs/migration.md) 更新业务库。不要与仍内置创作画布／上传节点的旧业务库版本同时安装。

## 所有权与依赖

| 模块 | 所属仓库 | 依赖 |
| --- | --- | --- |
| 画布、连线、选择、视口、剪贴板 | 本仓库 | ComfyUI 原生图和前端 |
| `DAELAB.MediaUpload` | 本仓库 | ComfyUI 自带的 torch、numpy、Pillow、视频 API |
| 通用按钮、字段、主题、字体、辅助 Vue 陈列 | 本仓库 | 运行画布无需 npm；陈列开发使用自己的锁定依赖 |
| 表格、分镜、LibTV 生成与任务恢复 | DAELab Custom Nodes Library | 通过 v1 适配器接入；单独运行画布不需要业务库 |
| ComfyTV 兼容 | 本仓库的可选适配器 | 未安装时隐藏其菜单，不导入上游 Python，不更改上游文件 |

Python 无新增安装依赖，前端运行使用原生 ES modules。辅助陈列的精确版本见 `frontend/package-lock.json`，不向 ComfyUI 安装 Vue 或 Vite。

## 交互

- 中键拖动平移；左键拖动空白处框选，Shift 可追加选择。
- 滚轮上下平移；Shift＋滚轮左右平移；Ctrl＋滚轮围绕指针缩放。
- Ctrl+C / Ctrl+V 复制粘贴选中的节点与内部连线。可编辑文本保留系统剪贴板行为。
- DAELab 卡片每侧最多一个可视端口，悬浮显示，附近 32 屏幕像素内可命中。内部仍保留原生类型化连线。
- 多个兼容用途时明确选择首帧／尾帧等用途，不擅自覆盖已有输入。

## 开发和检查

```sh
npm test
npm run verify:assets
cd frontend
npm ci
npm run build
```

ComfyUI 真机浏览器验证需安装 `frontend` 的 Playwright 依赖，并将该 `node_modules` 加入 `NODE_PATH`。设置 `COMFY_URL` 指向隔离测试服务。先执行 `node tools/media_upload_smoke.cjs artifacts/upload`，再在同级目录运行连接、导航和框选脚本。联合用例需要业务库和 ComfyTV；上传用例只需要本扩展。脚本会替换测试页面工作流，不要指向正在工作的浏览器会话。

公开扩展接口见 [适配器契约](docs/adapter-contract.md)，交付验证见 [验收记录](docs/validation.md)。CI 检查纯模块、资源完整性和辅助陈列构建；真实 ComfyUI 交互仍需单独验收。

## 来源与第三方资源

本仓库从 DAELab 节点库提取，来源提交和范围见 [迁移说明](docs/migration.md)。保留了第三方字体、图标的原始许可证与 SHA-256 清单。原节点库没有仓库级代码许可证，本次不替其代码新增或推定许可；公开可见性不等同于重新许可。第三方资源按各自许可证使用。
