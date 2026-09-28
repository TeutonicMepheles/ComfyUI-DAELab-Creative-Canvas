import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const evidenceDir=process.env.CREATIVE_EVIDENCE?pathToFileURL(resolve(process.env.CREATIVE_EVIDENCE)+'/'):new URL('../docs/architecture/native-gallery/',import.meta.url);
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const {chromium}=createRequire(new URL('../frontend/package.json',import.meta.url))('playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1200}});
const checks=[],errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/prompt',r=>{if(r.request().method()==='POST'){requests.push(r.request().url());return r.abort();}return r.continue();});
await page.route('**/comfytv/assets?*',r=>r.fulfill({json:{assets:[],total:0}}));
const fixture=JSON.parse(await readFile(new URL('../examples/creative_canvas/Creative Canvas Controls.json',import.meta.url),'utf8'));
try{
 await page.goto(process.env.COMFY_URL||'http://127.0.0.1:8000');await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
 await page.evaluate(async data=>{await app.loadGraphData(data);app.daelabCreativeCanvas.show();},fixture);
 await page.waitForFunction(()=>document.querySelectorAll('[data-creative-field]').length===13);
 checks.push(...await page.evaluate(async()=>{
  const passed=[];const ok=(v,n)=>{if(!v)throw Error(n);passed.push(n);};
  const [a,b]=app.graph._nodes.filter(n=>n.type==='DAELAB.LibTV.VideoGenerate');
  const get=(n,k)=>n.widgets.find(w=>w.name===k).value;
  const c=a.__libtvPanel.controls,d=b.__libtvPanel.controls;
  const old=get(b,'prompt');c.prompt.value='共享输入验证 A';c.prompt.dispatchEvent(new Event('input',{bubbles:true}));
  ok(get(a,'prompt')==='共享输入验证 A'&&get(b,'prompt')===old,'prompt commits independently');
  c.duration.focus();const oldDuration=get(a,'duration');
  for(const invalid of ['', '999', '5.5']){c.duration.value=invalid;c.duration.dispatchEvent(new Event('change',{bubbles:true}));ok(get(a,'duration')===oldDuration&&c.duration.getAttribute('aria-invalid')==='true','reject invalid duration '+invalid);}
  c.duration.value='8';c.duration.dispatchEvent(new Event('change',{bubbles:true}));ok(get(a,'duration')===8&&!c.duration.hasAttribute('aria-invalid'),'valid numeric commit clears error');
  c.prompt.disabled=true;c.prompt.value='禁止提交';c.prompt.dispatchEvent(new Event('input',{bubbles:true}));ok(get(a,'prompt')==='共享输入验证 A','disabled field blocks synthetic commit');c.prompt.disabled=false;
  const oldModel=get(b,'model');c.model.value='Minimax H3';c.model.dispatchEvent(new Event('change',{bubbles:true}));ok(get(a,'model')==='Minimax H3'&&get(b,'model')===oldModel,'model action and instance isolation');
  ok([...c.resolution.options].find(o=>o.value==='720p').disabled,'existing model compatibility remains active');
  c.duration.value='999';c.duration.dispatchEvent(new Event('change',{bubbles:true}));app.daelabCreativeCanvas.hide();
  ok(!c.duration.hasAttribute('aria-invalid')&&!c.duration.hasAttribute('data-creative-field'),'lease exit restores attributes');
  for(let i=0;i<3;i++){app.daelabCreativeCanvas.show();app.daelabCreativeCanvas.hide();}
  ok(!document.querySelector('[data-creative-field]'),'mode roundtrips leave no field bindings');
  await app.extensionManager.command.execute('Comfy.ToggleLinear');
  ok(!document.querySelector('[data-creative-field]'),'App Mode has no creative field bindings');
  await app.extensionManager.command.execute('Comfy.ToggleLinear');app.daelabCreativeCanvas.show();
  return passed;
 }));
 const saved=await page.evaluate(()=>app.graph.serialize());await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);await page.waitForTimeout(1500);
 await page.evaluate(async data=>{await app.loadGraphData(data);app.daelabCreativeCanvas.show();},saved);
 await page.waitForFunction(()=>document.querySelectorAll('[data-creative-field]').length===13);

 const expected=saved.nodes.find(n=>n.type==='DAELAB.LibTV.VideoGenerate');
 assert.equal(await page.evaluate(()=>JSON.stringify(app.graph.serialize().nodes.find(n=>n.type==='DAELAB.LibTV.VideoGenerate').widgets_values)),JSON.stringify(expected.widgets_values));
 checks.push('saved values survive reload');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await page.screenshot({path:fileURLToPath(new URL('field-pilot.png',evidenceDir))});
 await page.evaluate(()=>{const w=document.querySelector('.dae-creative-world');w.style.transform='translate(-2150px,40px) scale(1)';});
 await page.screenshot({path:fileURLToPath(new URL('field-states.png',evidenceDir))});
 for(const [name,file] of [['badge','#8.8 - Badge Workflow.json'],['exhibition','#7-展厅工作流优化-OpenAI-分割单独描述版.json']]){
  const data=JSON.parse(await readFile(new URL('../../../user/default/workflows/'+encodeURIComponent(file),import.meta.url),'utf8'));
  await page.evaluate(async data=>{app.daelabCreativeCanvas.hide();await app.loadGraphData(data);const w=app.extensionManager.workflow.activeWorkflow;if((w.activeMode??w.initialMode)!=='app')await app.extensionManager.command.execute('Comfy.ToggleLinear');},data);
  await page.waitForTimeout(700);
  const state=await page.evaluate(()=>({mode:app.extensionManager.workflow.activeWorkflow.activeMode,bindings:document.querySelectorAll('[data-creative-field],[data-creative-button]').length,creative:app.daelabCreativeCanvas.active}));
  assert.equal(state.mode,'app');assert.equal(state.bindings,0);assert.equal(state.creative,false);
  await page.screenshot({path:fileURLToPath(new URL(name+'-app-regression.png',evidenceDir))});
  checks.push(name+' original workflow loads in App Mode without creative bindings');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await writeFile(new URL('field-pilot-verification.json',evidenceDir),JSON.stringify({checks,errors,requests},null,2));console.log(checks);
}finally{await browser.close();}
