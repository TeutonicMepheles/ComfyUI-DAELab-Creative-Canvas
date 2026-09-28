// Dev-server-only acceptance: actual single-source mutations, restored in finally.
// Do not run concurrently with edits to these components.
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1080}});page.setDefaultTimeout(8000);
const report={checks:[],scope:'C01 covered by browser.mjs; C02-C06 actual source mutations in independent showcase',passed:false};
const go=async name=>page.locator('.rail').getByRole('button',{name}).click();
const panes=()=>[page.locator('[data-instance=A]'),page.locator('[data-instance=B]')];
async function mutate(name,replacements,check){
 const file=`src/ui/${name}.vue`,original=await readFile(file,'utf8');let changed=original;
 for(const [from,to] of replacements){assert.ok(changed.includes(from),`mutation target ${from}`);changed=changed.replaceAll(from,to);}
 try{await writeFile(file,changed);await page.goto('http://127.0.0.1:5178');await check();report.checks.push(`${name}: shared style and behavior propagated to two instances`);console.log('PASS',name);}
 finally{await writeFile(file,original);}
}
try{
 await mutate('ParameterField',[["default:'blur'","default:'explicit'"],['border-radius:var(--dae-radius-control)','border-radius:18px']],async()=>{
  await go('参数输入');
  // Showcase passes commitMode explicitly. Exercise changed behavior instead at the shared implementation.
  // Temporarily explicit default alone affects only consumers that omit it, so verify on canvas below.
  await page.locator('.rail').getByRole('button',{name:'组合预览'}).click();
  for(const id of ['A','B']){const input=page.locator(`[data-card-id=${id}] textarea`);await input.fill('暂不提交');await input.press('Tab');assert.equal(await input.evaluate(el=>getComputedStyle(el).borderRadius),'18px');}
  assert.doesNotMatch(await page.locator('.event-dock').textContent(),/提示词已更新/);
 });
 await mutate('OverlaySurface',[["querySelector('button,input,select,textarea,[tabindex]')","querySelector('[data-overlay-title]')"],['border-radius:var(--dae-radius-overlay)','border-radius:18px']],async()=>{
  await go('浮层容器');await panes()[0].getByRole('button',{name:'打开参数 A'}).click();
  const pop=page.getByRole('dialog',{name:'生成参数',exact:true});
  assert.equal(await pop.evaluate(el=>getComputedStyle(el).borderRadius),'18px');assert.equal(await pop.locator(':scope > header > h2').evaluate(el=>el===document.activeElement),true);
  await pop.getByRole('button',{name:'打开子模态'}).click();const child=page.getByRole('dialog',{name:'子模态',exact:true});
  assert.equal(await child.evaluate(el=>getComputedStyle(el).borderRadius),'18px');assert.equal(await child.locator('h2').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 });
 await mutate('MediaPreview',[["if(!p.disabled&&state.value==='ready')","if(false&&!p.disabled&&state.value==='ready')"],['border-radius:var(--dae-radius-control)','border-radius:18px']],async()=>{
  await go('媒体预览');await page.waitForFunction(()=>[...document.querySelectorAll('.specimen .dae-media')].every(el=>el.dataset.state==='ready'));
  for(const pane of panes()){assert.equal(await pane.locator('.dae-media-stage').evaluate(el=>getComputedStyle(el).borderRadius),'18px');await pane.getByRole('button',{name:'展开',exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),0);}
 });
 await mutate('TaskStatus',[["emit('resume')","false&&emit('resume')"],['border-radius:var(--dae-radius-control)','border-radius:18px']],async()=>{
  await go('任务状态');await page.getByLabel('任务状态',{exact:true}).selectOption('unknown');await page.getByLabel('实例 B 状态').selectOption('unknown');
  for(const pane of panes()){assert.equal(await pane.locator('.dae-task').evaluate(el=>getComputedStyle(el).borderRadius),'18px');await pane.getByRole('button',{name:'核对 / 恢复'}).click();}
  assert.doesNotMatch(await page.locator('.event-dock').textContent(),/恢复原任务/);
 });
 await mutate('CanvasCard',[["ArrowRight:[8,0]","ArrowRight:[16,0]"],['border-radius:var(--dae-radius-card)','border-radius:18px']],async()=>{
  await go('画布卡片');for(const pane of panes()){assert.equal(await pane.locator('.dae-card').evaluate(el=>getComputedStyle(el).borderRadius),'18px');await pane.getByRole('button',{name:'移动',exact:true}).click();await page.keyboard.press('ArrowRight');assert.match(await page.locator('.event-dock').textContent(),/"x":16/);await page.keyboard.press('Enter');}
 });
 report.passed=true;
}catch(e){report.failure=e.stack;throw e;}
finally{await mkdir('test-results',{recursive:true});await writeFile('test-results/source-updates.json',JSON.stringify(report,null,2));await browser.close();}
