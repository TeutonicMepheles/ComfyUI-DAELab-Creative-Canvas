# DAELab Creative Canvas

独立维护的 ComfyUI 创作画布扩展：本地图片／视频上传、媒体卡片、统一连接端口、磁吸命中、框选、复制粘贴与画布导航。原生 ComfyUI 图仍是执行与存储来源，不另建执行引擎。

## 安装

在 ComfyUI 的 `custom_nodes` 下克隆本仓库并重启 ComfyUI：

```sh
git clone https://github.com/TeutonicMepheles/ComfyUI-DAELab-Creative-Canvas.git
```

工作流模式菜单 → **创作画布**，双击空白处 → **上传**。支持 PNG、JPG、WebP、MP4、WebM、MOV；浏览器能否预览视频取决于文件编码。

已有 DAELab 节点库用户应先按 [迁移说明](docs/migration.md) 更新业务库。不要与仍内置创作画布／上传节点的旧业务库版本同时安装。

## 协作者 Agent 环境准备指南

接手此仓库的 Agent 请按以下顺序准备环境，再开始功能开发。优先复用已安装环境，不覆盖工作流、素材、凭据或未提交的改动。

### 1. 阅读规则并确认版本

先阅读 [AGENTS.md](AGENTS.md)。前端任务按 [前端与交互规范](docs/architecture/FRONTEND_INTERACTION.md#按任务阅读) 的任务表加载对应章节；共享控件开发和面板接入再按表阅读实现契约。仅安装环境不需要通读前端规范；需要业务库时再读 [迁移说明](docs/migration.md)。执行 `git status --short`、`git remote -v`、`git branch --show-current`、`git log -1 --oneline`，确认操作的是本仓库。

自 2026-09-28 起，`main` 是协作者同步开发的基线，包含已验收的素材上传与编组实现（功能提交 `737383428fd9ba9a35c1f74adc8aa7eaa145c4ff`）及 Agent 安装指南、独立前端与交互规范。正常安装直接克隆默认分支；开发前更新 `main`，再从它建立自己的功能分支，通过 PR 合作。

已有克隆时先 `git fetch origin` 并检查本地改动，再切换到 `main` 并执行 `git pull --ff-only origin main`；本地不存在 `main` 时可用 `git switch --track origin/main` 创建。若存在未提交改动或分叉，先保留并处理，不要重复克隆、强制重置或丢弃本地改动。

### 2. 找到实际运行的 ComfyUI

通过启动日志、启动命令或 Desktop 配置确认实际使用的用户数据／base directory、`custom_nodes`、Python 解释器和服务 URL。不要照抄维护者电脑上的绝对路径或端口；Desktop 应用程序目录与插件数据目录可能不同。无法确认目标实例时，向协作者询问安装路径，避免装到另一套 ComfyUI。

先确认 ComfyUI 本身可以启动，再安装扩展。本仓库声明 Python ≥3.10，但运行环境必须同时满足 ComfyUI 自身要求，并提供 `comfy_api.latest`、视频 API 及其原有 torch、numpy、Pillow 依赖。目前没有经过验证的 ComfyUI 最低版本范围；遇到 API 缺失时先核对版本，不向系统 Python 盲目安装依赖或替换现有 torch。

仅使用上传、编组和画布不需要模型、API Key 或付费生成服务，已在 CPU 服务验证。模块测试需要 Node.js ≥22；使用辅助前端构建时还须满足锁定 Vite 版本的 Node engines 要求。运行正式画布不需要 Node.js 或 npm 构建。

### 3. 按并列目录安装

```text
<实际 ComfyUI 数据目录>/
├─ custom_nodes/
│  ├─ ComfyUI-DAELab-Creative-Canvas/       # 必需，本仓库
│  │  ├─ __init__.py
│  │  ├─ nodes/
│  │  └─ web/
│  ├─ ComfyTV/                            # 可选，上游插件
│  └─ ComfyUI-DAELab-Custom-Nodes-Library/  # 可选，业务节点库
├─ input/
├─ output/
└─ user/
```

每个扩展目录第一层应直接包含 `__init__.py`，不要形成重复嵌套目录，也不要把其他插件克隆到本仓库里。仅开发上传与编组时，先采用只安装本仓库的最小环境。

需要测试 ComfyTV 联动时，在同一个 `custom_nodes` 目录执行以下命令。ComfyTV 保持只读上游；兼容改动放在本仓库适配器内。

```sh
git clone https://github.com/jtydhr88/ComfyTV.git
```

ComfyTV 安装参考其 [官方说明](https://github.com/jtydhr88/ComfyTV#install)。记录实际安装的提交，避免协作者之间上游版本不一致。

需要表格、分镜或 LibTV 业务时才安装业务库。截至 2026-09-28，配套迁移 [PR #20](https://github.com/TeutonicMepheles/ComfyUI-DAELab-Custom-Nodes-Library/pull/20) 尚未合并，使用以下兼容分支；后续先核查该 PR 的合并状态和迁移说明。

```sh
git clone --branch codex/split-creative-canvas https://github.com/TeutonicMepheles/ComfyUI-DAELab-Custom-Nodes-Library.git
```

不要同时启用仍内置画布和 `DAELAB.MediaUpload` 的旧业务库。业务库自身依赖按其说明安装到目标 ComfyUI 的 Python 环境；本画布扩展没有新增 Python 安装依赖。

### 4. 启动与检查

安装完成后完整重启目标 ComfyUI 后端，再刷新浏览器。确认启动日志没有本扩展导入错误，工作流模式菜单中只有一个“创作画布”入口，上传节点和素材组可以正常注册。

在本仓库根目录执行：

```sh
npm test
npm run verify:assets
```

只有需要辅助 Vue 陈列页面或浏览器测试依赖时，才进入 `frontend` 执行 `npm ci`；辅助页面用 `npm run dev`，构建用 `npm run build`。不要把 Vue/Vite 安装到 ComfyUI 根目录。实际画布从 ComfyUI 服务打开，不能通过直接打开 HTML 或辅助 Vite 页面代替。

用独立测试工作流创建至少两个素材节点：检查图片／视频上传、编组、拖入移出、双击标题重命名、选中成员与组的 Slot 互斥、缩放、模式切换，以及保存 JSON 后刷新重载。检查长名称和控件溢出。涉及可选集成的改动还需验证联合安装。浏览器自动用例及素材夹具要求见 [素材组验证](docs/material-groups.md#验证)；不要在协作者正在编辑的工作流中运行破坏性测试。

工作流 JSON 不包含素材文件。共享示例时单独提供所需图片／视频并保留 `input` 相对路径，或重新上传。不要提交实际用户素材、访问令牌、日志、缓存、`node_modules` 或 IDE 私有配置。

### 5. 向协作者报告准备结果

报告实际插件路径、服务 URL、ComfyUI／前端版本、Python／Node 版本、各已安装仓库的分支和提交，以及模块测试、资源检查和真实画布验证结果。明确区分“环境已启动”“自动测试通过”和“实际交互已验证”；缺少运行条件时说明未验证项，不将构建成功当作产品验收。环境准备不要求执行付费生成。

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
- 多选素材后点击“素材打组”或 Ctrl+G；组内自动排列、拖入／移出、整组移动。选中组后可设置颜色、序号、锁定及收起。删除组会删除成员，解散组保留成员；支持原生撤销／重做。详见 [素材组](docs/material-groups.md)。
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
