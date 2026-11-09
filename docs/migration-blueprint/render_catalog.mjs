// Documentation tooling only: validates definitions and renders reviewable tables.
// It does not run product tests, load ComfyUI, migrate data, or contact providers.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(base, '../..');
const roots = {canvas: root, business: path.resolve(root, '../ComfyUI-DAELab-Custom-Nodes-Library')};
const write = process.argv.includes('--write');
const errors = [];
const files = ['canvas', 'business', 'system', 'exclusions'];
const bundles = files.map(name => ({name, data: JSON.parse(fs.readFileSync(path.join(base, 'catalog', name + '.json'), 'utf8'))}));
const features = bundles.flatMap(x => x.data.features);
const usecases = bundles.flatMap(x => x.data.usecases);
const tests = bundles.flatMap(x => x.data.tests);
const all = [...features, ...usecases, ...tests];
const byId = new Map(all.map(x => [x.id, x]));
const featureIds = new Set(features.map(x => x.id));
const usecaseIds = new Set(usecases.map(x => x.id));
const decisions = ['保留', '重构', '不迁入', '暂缓'];
const levels = ['domain', 'contract', 'backend', 'integration', 'host', 'migration', 'performance', 'provider-live'];
const allowedLiveModels = new Set(['qwen3.5:9b-q4_K_M', 'Qwen-Image-2.1 Turbo（本地）', 'MiniMax H3 FL（本地）']);
const fail = message => errors.push(message);
const requireFields = (row, fields) => { for (const key of fields) if (row[key] === undefined || row[key] === '') fail(`${row.id}: missing ${key}`); };
const requireList = (row, key, allowEmpty = false) => { if (!Array.isArray(row[key]) || (!allowEmpty && !row[key].length) || row[key].some(x => typeof x !== 'string' || !x.trim())) fail(`${row.id}: invalid ${key}`); };
const validateSource = (ref, owner) => {
  const match = /^(canvas|business):(.+?)(?::(\d+))?$/.exec(ref);
  if (!match) return fail(`${owner}: malformed source ${ref}`);
  const full = path.resolve(roots[match[1]], match[2]);
  if (!full.startsWith(roots[match[1]] + path.sep)) return fail(`${owner}: source outside repository ${ref}`);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return fail(`${owner}: missing source ${ref}`);
  if (match[3] && (+match[3] < 1 || +match[3] > fs.readFileSync(full, 'utf8').split(/\r?\n/).length)) fail(`${owner}: invalid source line ${ref}`);
};

if (byId.size !== all.length) fail('Duplicate IDs');
for (const row of all) {
  if (!/^(F|UC|TC)-(CAN|BIZ|SYS|OUT)-\d{3}$/.test(row.id)) fail(`Invalid ID ${row.id}`);
  requireFields(row, ['id', 'title']);
}
for (const f of features) {
  requireFields(f, ['decision', 'current', 'source', 'target', 'phase', 'rationale', 'acceptance']);
  requireList(f, 'source'); requireList(f, 'acceptance');
  if (!decisions.includes(f.decision) || !/^M[0-6]$/.test(f.phase)) fail(`${f.id}: invalid decision/phase`);
  for (const ref of f.source || []) validateSource(ref, f.id);
  if (!usecases.some(x => x.features.includes(f.id))) fail(`${f.id}: no functional use case`);
  if (!tests.some(x => x.features.includes(f.id))) fail(`${f.id}: no test case`);
}
for (const u of usecases) {
  requireFields(u, ['actor', 'features', 'preconditions', 'steps', 'outcomes', 'exceptions']);
  for (const key of ['features', 'preconditions', 'steps', 'outcomes', 'exceptions']) requireList(u, key);
  for (const id of u.features || []) if (!featureIds.has(id)) fail(`${u.id}: unknown feature ${id}`);
  if (!tests.some(x => x.usecases.includes(u.id))) fail(`${u.id}: no test coverage`);
}
for (const t of tests) {
  requireFields(t, ['features', 'usecases', 'level', 'priority', 'phase', 'fixture', 'setup', 'steps', 'expected', 'automation', 'execution_policy', 'existing_coverage']);
  for (const key of ['features', 'usecases', 'setup', 'steps', 'expected']) requireList(t, key);
  requireList(t, 'existing_coverage', true);
  for (const id of t.features || []) if (!featureIds.has(id)) fail(`${t.id}: unknown feature ${id}`);
  for (const id of t.usecases || []) if (!usecaseIds.has(id)) fail(`${t.id}: unknown use case ${id}`);
  if (!levels.includes(t.level) || !['P0', 'P1', 'P2'].includes(t.priority) || !/^M[0-6]$/.test(t.phase)) fail(`${t.id}: invalid level/priority/phase`);
  if (!['自动', '人工', '混合'].includes(t.automation) || !['不付费', '仅本地 Qwen/MiniMax'].includes(t.execution_policy)) fail(`${t.id}: invalid execution mode`);
  if (t.level === 'provider-live') {
    requireList(t, 'live_models');
    if (t.execution_policy !== '仅本地 Qwen/MiniMax' || (t.live_models || []).some(model => !allowedLiveModels.has(model))) fail(t.id + ': real generation must use the local Qwen/MiniMax allowlist');
  } else if (t.execution_policy !== '不付费') fail(t.id + ': non-live checks must not invoke real models');
  for (const ref of t.existing_coverage || []) validateSource(ref, t.id);
}
if (errors.length) { process.stderr.write(errors.join('\n') + '\n'); process.exit(1); }

const escape = value => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>');
const table = (headers, rows) => ['| ' + headers.join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |', ...rows.map(row => '| ' + row.map(escape).join(' | ') + ' |')].join('\n');
const bullets = rows => rows.map(x => '- ' + x).join('\n');
const steps = rows => rows.map((x, i) => `${i + 1}. ${x}`).join('\n');
const link = id => `[${id}](${id.startsWith('TC') ? 'TEST_CASES.md' : id.startsWith('UC') ? 'USE_CASES.md' : 'FEATURE_MATRIX.md'}#${id.toLowerCase()})`;
const links = ids => ids.map(link).join('、');
const sourceLink = ref => {
  const [, repo, file, line] = /^(canvas|business):(.+?)(?::(\d+))?$/.exec(ref);
  const relative = (repo === 'canvas' ? '../../' : '../../../ComfyUI-DAELab-Custom-Nodes-Library/') + file;
  return `[${ref}](${relative}${line ? '#L' + line : ''})`;
};
const labels = {canvas: '画布与素材能力', business: '表格分镜与生成能力', system: '产品基础与跨模块能力', exclusions: '不迁入的历史功能'};
const status = '规格已定义；自动化与产品执行状态均待实施/待执行';
const generated = '本文件由 `catalog/*.json` 生成；修改目录中的源数据后运行 `node docs/migration-blueprint/render_catalog.mjs --write`。不要单独修改生成表。';
const counts = Object.fromEntries(decisions.map(d => [d, features.filter(x => x.decision === d).length]));
const fTests = id => tests.filter(x => x.features.includes(id)).map(x => x.id);
const fUses = id => usecases.filter(x => x.features.includes(id)).map(x => x.id);

let fm = `# 创作画布完整功能对照表\n\n${generated}\n\n共 ${features.length} 项能力决策：${decisions.map(d => `${d} ${counts[d]} 项`).join('，')}。功能条目按用户行为、兼容合同及产品基础能力计数，不等同于节点数量。当前事实来自固定源码；目标和验收均为新产品定义。\n\n保留表示保留成熟行为及实现，仍可进行模块接入；重构表示保留能力并重组实现；不迁入不等于删除用户旧数据。旧类型处置见 [78 个节点类型清单](NODE_INVENTORY.md)，总体顺序见 [迁移蓝图](BLUEPRINT.md)。\n`;
for (const bundle of bundles) {
  fm += `\n## ${labels[bundle.name]}\n\n` + table(['编号', '能力', '处置', '阶段', '用例数', '测试数'], bundle.data.features.map(f => [link(f.id), f.title, f.decision, f.phase, fUses(f.id).length, fTests(f.id).length])) + '\n';
  for (const f of bundle.data.features) fm += `\n<a id="${f.id.toLowerCase()}"></a>\n\n### ${f.id} ${f.title}\n\n**处置：${f.decision}；阶段：${f.phase}。** ${f.current}\n\n**来源：** ${f.source.map(sourceLink).join('；')}\n\n**新归属：** \`${f.target}\`\n\n**理由：** ${f.rationale}\n\n**验收：**\n\n${bullets(f.acceptance)}\n\n**关联：** ${links(fUses(f.id))}；${links(fTests(f.id))}\n`;
}
let uc = `# 创作画布功能用例\n\n${generated}\n\n共 ${usecases.length} 个功能用例。UC 描述创作者或维护者如何完成目标，TC 描述对这些行为的验证方法。所有用例是迁移后的目标行为，包含异常处理，不是已经执行的验收报告。\n\n`;
uc += table(['编号', '用例', '角色', '测试数'], usecases.map(u => [link(u.id), u.title, u.actor, tests.filter(t => t.usecases.includes(u.id)).length])) + '\n';
for (const u of usecases) uc += `\n<a id="${u.id.toLowerCase()}"></a>\n\n## ${u.id} ${u.title}\n\n**角色：** ${u.actor}。 **功能：** ${links(u.features)}\n\n**前置条件**\n\n${bullets(u.preconditions)}\n\n**主流程**\n\n${steps(u.steps)}\n\n**成功结果**\n\n${bullets(u.outcomes)}\n\n**异常与分支**\n\n${bullets(u.exceptions)}\n\n**测试：** ${links(tests.filter(t => t.usecases.includes(u.id)).map(t => t.id))}\n`;
let tc = `# 创作画布迁移测试用例\n\n${generated}\n\n共 ${tests.length} 个测试定义。统一状态：**${status}**。自动化列是目标执行方式，既有覆盖是复用候选，不表示此测试已经实现或运行。测试环境、夹具、公共前端矩阵、性能预算和证据格式见 [测试策略](TEST_STRATEGY.md)。\n\n每个界面测试都叠加两实例、模式切换、保存重载、焦点溢出和相关缩放检查；表内和表外生成都需覆盖。真实生成仅使用本地 Qwen/MiniMax；其他通道只做协议模拟，不能据此声明真实效果通过。\n\n`;
tc += table(['编号', '测试', '阶段', '优先级', '层级', '方式', '执行策略'], tests.map(t => [link(t.id), t.title, t.phase, t.priority, t.level, t.automation, t.execution_policy])) + '\n';
for (const t of tests) tc += `\n<a id="${t.id.toLowerCase()}"></a>\n\n## ${t.id} ${t.title}\n\n**阶段：** ${t.phase}；**优先级：** ${t.priority}；**层级：** ${t.level}；**方式：** ${t.automation}；**执行策略：** ${t.execution_policy}。\n\n**功能：** ${links(t.features)}\n\n**用例：** ${links(t.usecases)}\n\n**真实模型白名单：** ${t.live_models?.join("、") || "无；本用例使用无模型调用的测试方法。"}\n\n**夹具：** ${t.fixture}\n\n**准备**\n\n${bullets(t.setup)}\n\n**步骤**\n\n${steps(t.steps)}\n\n**可判断的期望**\n\n${bullets(t.expected)}\n\n**旧测试复用候选：** ${t.existing_coverage.length ? t.existing_coverage.map(sourceLink).join('；') : '无；迁移实施时建立。'}\n`;

const csv = rows => '\uFEFF' + rows.map(row => row.map(x => '"' + String(x ?? '').replaceAll('"', '""') + '"').join(',')).join('\r\n') + '\r\n';
const out = new Map([
  ['FEATURE_MATRIX.md', fm], ['USE_CASES.md', uc], ['TEST_CASES.md', tc],
  ['features.csv', csv([['id','title','decision','current','source','target','phase','rationale','acceptance','usecases','tests'], ...features.map(f => [f.id,f.title,f.decision,f.current,f.source.join('\n'),f.target,f.phase,f.rationale,f.acceptance.join('\n'),fUses(f.id).join(' '),fTests(f.id).join(' ')])])],
  ['usecases.csv', csv([['id','title','actor','features','preconditions','steps','outcomes','exceptions','tests'], ...usecases.map(u => [u.id,u.title,u.actor,u.features.join(' '),u.preconditions.join('\n'),u.steps.join('\n'),u.outcomes.join('\n'),u.exceptions.join('\n'),tests.filter(t=>t.usecases.includes(u.id)).map(t=>t.id).join(' ')])])],
  ['tests.csv', csv([['id','title','features','usecases','level','priority','phase','fixture','setup','steps','expected','automation','execution_policy','existing_coverage','live_models','status'], ...tests.map(t => [t.id,t.title,t.features.join(' '),t.usecases.join(' '),t.level,t.priority,t.phase,t.fixture,t.setup.join('\n'),t.steps.join('\n'),t.expected.join('\n'),t.automation,t.execution_policy,t.existing_coverage.join('\n'),(t.live_models || []).join('\n'),status])])]
]);

const readme = `# 创作画布单仓库迁移方案\n\n2026-10-24。已确定继续依托 ComfyUI，迁入创作画布完整流程，以一个新仓库、一个安装包和一个产品版本维护。当前交付是实施蓝图及用例定义，未迁移运行代码、未创建远端仓库、未执行这些新产品测试。\n\n## 阅读入口\n\n| 文档 | 用途 |\n| --- | --- |\n| [迁移蓝图](BLUEPRINT.md) | 产品范围、目录结构、模块边界、数据归属、M0–M6 顺序与退出标准 |\n| [完整功能对照表](FEATURE_MATRIX.md) | ${features.length} 项能力的来源、保留/重构/排除、目标模块与验收 |\n| [节点注册清单](NODE_INVENTORY.md) | 78 个自有类型逐项处置，区分生产节点、历史执行与前端原型 |\n| [功能用例](USE_CASES.md) | ${usecases.length} 个用户与维护者场景，含前置、步骤、结果和异常 |\n| [测试策略](TEST_STRATEGY.md) | 环境矩阵、夹具、故障、性能预算、阶段门禁与证据格式 |\n| [测试用例](TEST_CASES.md) | ${tests.length} 个测试的准备、操作、可判断期望与执行策略 |\n\n## 当前决策统计\n\n${table(['处置','数量'], decisions.map(d=>[d,counts[d]]))}\n\n保留与重构的对象是产品能力，不按节点或文件数量计数。节点层建议为 9 个继续提供、6 个兼容读取、63 个不迁入；兼容读取保留原件与可见报告，不在后台自动转换或提交生成。源码仍能执行的旧分镜节点收敛到新流程属于迁移决策，不能误称它已经退役。\n\n## 可导入的清单\n\n- [功能 CSV](features.csv)\n- [功能用例 CSV](usecases.csv)\n- [测试用例 CSV](tests.csv)\n\n这些文件和 Markdown 表来自同一份数据，适合导入任务表后拆解；无需分别手工维护。所有测试状态均为规格已定义、实施与执行待完成。\n\n## 首批实施任务\n\n1. 完成 M0：固定真实工作流样本、核对表格初始结构等源码/规范差异、锁定宿主与参考机基线。\n2. 建立 M1：新库骨架、单包组装、共享控件、宿主桥接与依赖检查。\n3. 交付第一条完整流程：上传与文本 → 编组与连线 → 撤销重做 → 保存重开。\n\n逐项开发任务必须携带 F/UC/TC 编号；后续每阶段以验收证据推进。真实生成测试仅使用本地 Qwen 和本地 MiniMax，禁止云端及其他模型真实调用；普通 CI 使用假服务。本轮限制不删除提供方适配能力，其他通道保持真实运行未验收。\n\n## 数据维护与校验\n\n权威清单为 \`catalog/canvas.json\`、\`business.json\`、\`system.json\` 和 \`exclusions.json\`。蓝图、测试策略和节点盘点为人工维护的架构文档。来源前缀 \`canvas:\` 指本仓库，\`business:\` 指同级业务库；来源文件链接方便本地审阅，复制方案时应同时保留来源提交。\n\n在两个源仓库保持同级目录的工作环境中运行：\n\n\`\`\`sh\nnode docs/migration-blueprint/render_catalog.mjs --write\nnode docs/migration-blueprint/render_catalog.mjs --check\n\`\`\`\n\n校验覆盖 ID 唯一性、功能与用例的测试关联、字段和阶段、来源文件/行号、本地模型白名单及生成文件一致性。它只校验方案，不会执行产品用例或启动 ComfyUI。\n\n## 范围与证据基线\n\n- Canvas：\`3176b5a67dbcd0b66f795976e5a81bcdfe346093\`。\n- 业务库：\`7ff56cb51ef6f7fc3bcf5707792d655037c61b30\`。\n- 技术选择、目录和预算是新产品目标；当前源码事实与未来验收条件在功能条目中分列。\n- 真实提供方、宿主版本支持和性能数值必须由后续执行报告确认。\n`;
out.set('README.md', readme);
for (const [name, content] of out) {
  const file = path.join(base, name);
  if (write) fs.writeFileSync(file, content, 'utf8');
  else if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) fail(`Generated file differs: ${name}`);
}
if (errors.length) { process.stderr.write(errors.join('\n') + '\n'); process.exit(1); }
process.stdout.write(JSON.stringify({mode:write?'write':'check',features:features.length,decisions:counts,usecases:usecases.length,tests:tests.length,sourceReferences:features.reduce((n,f)=>n+f.source.length,0),outputs:[...out.keys()],status:'documentation checks only'},null,2)+'\n');
