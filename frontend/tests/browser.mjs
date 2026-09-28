import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
const out=resolve(process.env.TEST_OUTPUT||'test-results');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1080}});
const page=await context.newPage();page.setDefaultTimeout(8000);
await page.addInitScript(()=>{
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener,entries=[];
 const tracked=(t,k)=>(t===document&&k==='pointerdown')||(t===window&&['resize','scroll'].includes(k));
 EventTarget.prototype.addEventListener=function(k,fn,o){if(tracked(this,k)&&!entries.some(x=>x.t===this&&x.k===k&&x.fn===fn))entries.push({t:this,k,fn});return add.call(this,k,fn,o);};
 EventTarget.prototype.removeEventListener=function(k,fn,o){const i=entries.findIndex(x=>x.t===this&&x.k===k&&x.fn===fn);if(i>=0)entries.splice(i,1);return remove.call(this,k,fn,o);};
 const Native=MutationObserver;let observers=0;
 window.MutationObserver=class extends Native{observe(...args){if(!this.active){observers++;this.active=true;}return super.observe(...args);}disconnect(){if(this.active){observers--;this.active=false;}return super.disconnect();}};
 window.__lifecycle=()=>({listeners:entries.length,observers});
});
const report={checks:[],pageErrors:[],unexpectedNetwork:[],scope:'independent showcase only; no ComfyUI/remote generation'},base=process.env.SHOWCASE_URL||'http://127.0.0.1:5178';
page.on('pageerror',e=>report.pageErrors.push(e.message));
await context.route('**/*',route=>{const u=route.request().url();if(!u.startsWith(base)&&!u.startsWith('data:')&&!u.startsWith('blob:')){report.unexpectedNetwork.push(u);return route.abort();}return route.continue();});
const pass=name=>{report.checks.push(name);console.log('PASS',name);};
const choose=async label=>page.locator('.rail').getByRole('button',{name:label}).click();
const a=()=>page.locator('[data-instance=A]'), b=()=>page.locator('[data-instance=B]');
async function select(label,value){await page.getByLabel(label,{exact:true}).selectOption(value);}
try{
 await page.goto(base);await page.locator('[data-card-id=A] img').waitFor();await page.screenshot({path:out+'/canvas.png',fullPage:true});
 const first=page.locator('[data-card-id=A]');await first.getByLabel('画面描述').fill('只修改 A 的描述');await first.getByLabel('画面描述').press('Tab');
 assert.notEqual(await page.locator('[data-card-id=B] textarea').inputValue(),'只修改 A 的描述');pass('combined cards use independent data');
 await first.getByRole('button',{name:'模拟生成',exact:true}).click();assert.equal(await first.locator('.dae-task').getAttribute('data-state'),'running');assert.equal(await page.locator('[data-card-id=B] .dae-task').getAttribute('data-state'),'idle');await page.waitForFunction(()=>document.querySelector('[data-card-id=A] .dae-task').dataset.state==='succeeded');pass('local delayed generation does not affect B');
 const pos=await page.locator('.card-position').first().evaluate(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)}));
 await first.getByRole('button',{name:'移动',exact:true}).click();await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');assert.equal(await page.locator('.card-position').first().evaluate(el=>parseFloat(el.style.left)),pos.x);
 await first.getByRole('button',{name:'移动',exact:true}).click();await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');assert.equal(await page.locator('.card-position').first().evaluate(el=>parseFloat(el.style.left)),pos.x+8);pass('keyboard card movement commits or cancels without editing node data');
 await choose('动作按钮');assert.notEqual(await a().locator('.dae-icon').evaluate(el=>getComputedStyle(el).maskImage),'none');await a().getByRole('button',{name:'动作 A'}).click();await a().getByRole('button',{name:'动作 A'}).press('Enter');await a().getByRole('button',{name:'动作 A'}).press('Space');assert.equal(await a().locator('b').textContent(),'3');assert.equal(await b().locator('b').textContent(),'0');
 await page.getByLabel('禁用',{exact:true}).check();assert.equal(await a().getByRole('button',{name:'动作 A'}).isDisabled(),true);await page.getByLabel('禁用',{exact:true}).uncheck();await page.getByLabel('忙碌',{exact:true}).check();assert.equal(await a().getByRole('button',{name:'动作 A'}).isDisabled(),true);await page.getByLabel('忙碌',{exact:true}).uncheck();pass('U02 native keyboard and disabled/busy guard');
 await choose('参数输入');await select('字段类型','number');await a().getByLabel('参数 A').fill('bad');await a().getByLabel('参数 A').press('Tab');assert.match(await a().textContent(),/请输入有效数字/);assert.match(await a().textContent(),/保存值：0/);await a().getByLabel('参数 A').fill('0');await a().getByLabel('参数 A').press('Enter');assert.match(await a().textContent(),/保存值：0/);assert.match(await b().textContent(),/保存值：10/);
 await page.getByLabel('显式提交').check();await a().getByLabel('参数 A').fill('7');await a().getByRole('button',{name:'模拟外部更新'}).click();assert.match(await a().textContent(),/外部值已变化/);assert.equal(await a().getByLabel('参数 A').inputValue(),'7');await a().getByRole('button',{name:'使用新值'}).click();assert.equal(await a().getByLabel('参数 A').inputValue(),'20');pass('U03 invalid numbers, zero, independent values and external conflict');
 await select('字段类型','text');await page.getByLabel('显式提交').uncheck();const input=a().getByLabel('参数 A');await input.dispatchEvent('compositionstart');await input.fill('中文输入');await input.press('Enter');assert.match(await a().locator('.value-readout').textContent(),/实例 A/);await input.dispatchEvent('compositionend');await input.press('Enter');assert.match(await a().locator('.value-readout').textContent(),/中文输入/);pass('IME composition cannot submit early');
 await choose('浮层容器');await a().getByRole('button',{name:'打开参数 A'}).click();let pop=page.getByRole('dialog',{name:'生成参数',exact:true});assert.equal(await pop.isVisible(),true);await pop.getByRole('button',{name:'打开子模态'}).click();await page.keyboard.press('Escape');assert.equal(await pop.isVisible(),true);assert.equal(await page.getByRole('dialog',{name:'子模态',exact:true}).count(),0);await page.keyboard.press('Escape');assert.equal(await pop.count(),0);assert.equal(await a().getByRole('button',{name:'打开参数 A'}).evaluate(el=>el===document.activeElement),true);
 await a().getByRole('button',{name:'打开参数 A'}).click();await pop.getByLabel('模拟有未保存草稿').check();await page.keyboard.press('Escape');assert.equal(await pop.isVisible(),true);await pop.getByRole('button',{name:'继续编辑'}).click();await pop.getByRole('button',{name:'关闭',exact:true}).click();await pop.getByRole('button',{name:'放弃并关闭'}).click();pass('U04 nested Escape, guarded close and focus return');
 const lifecycleBefore=await page.evaluate(()=>window.__lifecycle());for(let i=0;i<10;i++){await a().getByRole('button',{name:'打开参数 A'}).click();await page.keyboard.press('Escape');}assert.equal(await page.locator('dialog[open]').count(),0);await a().getByRole('button',{name:'打开参数 A'}).click();await page.getByRole('button',{name:'卸载实例',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('dialog[open]'));await page.getByRole('button',{name:'挂载实例',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.__lifecycle()),lifecycleBefore);pass('overlay repeat lifecycle and removed anchor close; listener/observer counts restored');
 await choose('媒体预览');await select('素材状态','error');await page.waitForFunction(()=>[...document.querySelectorAll('.specimen .dae-media')].every(x=>x.dataset.state==='error'));assert.match(await a().textContent(),/缺失样例/);await select('素材状态','empty');assert.match(await a().textContent(),/尚未选择素材/);await select('素材状态','video');await page.waitForFunction(()=>document.querySelector('.specimen video')?.readyState>=2);await a().locator('video').evaluate(v=>v.play());await page.waitForFunction(()=>!document.querySelector('.specimen video').paused);await page.getByLabel('禁用',{exact:true}).check();assert.equal(await a().locator('video').evaluate(v=>v.paused),true);await page.getByLabel('禁用',{exact:true}).uncheck();
 await a().locator('video').evaluate(v=>{window.__oldVideo=v;return v.play();});await page.getByRole('button',{name:'卸载实例',exact:true}).click();assert.equal(await page.evaluate(()=>window.__oldVideo.paused),true);await page.getByRole('button',{name:'挂载实例',exact:true}).click();pass('U05 local video plays and pauses on disabled/unmount; empty/error distinguish sources');
 await choose('任务状态');for(const st of ['idle','validating','queued','running','succeeded','failed','stopping','stopped','unknown']){await select('任务状态',st);assert.equal(await a().locator('.dae-task').getAttribute('data-state'),st);assert.equal(await b().locator('.dae-task').getAttribute('data-state'),'idle');assert.equal(await a().locator('progress').count(),0);}assert.equal(await a().getByRole('button',{name:'重新生成'}).count(),0);await a().getByRole('button',{name:'核对 / 恢复'}).click();pass('U06 all states, no fabricated progress, unknown cannot retry');
 await choose('画布卡片');await a().getByRole('button',{name:'收起'}).click();assert.equal(await a().getByLabel('卡片标题',{exact:true}).isVisible(),false);assert.equal(await b().getByLabel('卡片标题',{exact:true}).isVisible(),true);await a().getByRole('button',{name:'展开'}).click();await page.getByLabel('禁用',{exact:true}).check();assert.equal(await a().locator('.dae-card-body').getAttribute('inert'),'');await page.getByLabel('禁用',{exact:true}).uncheck();pass('C06 collapse and inactive only change scoped card state');
 // Actual source edit, not a showcase theme switch. Always restore even on failure.
 if(!process.env.SKIP_SOURCE_MUTATION){
  const path=resolve('src/ui/ActionButton.vue'),original=await readFile(path,'utf8');
  try{
   await choose('动作按钮');await writeFile(path,original.replace('!disabled&&!busy&&emit','false&& !disabled&&!busy&&emit').replace('var(--dae-radius-button)','18px'));
   await page.reload();await choose('动作按钮');await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-instance=A] .dae-button')).borderRadius==='18px');
   for(const pane of [a(),b()]){assert.equal(await pane.locator('.dae-button').evaluate(el=>getComputedStyle(el).borderRadius),'18px');await pane.locator('.dae-button').click();assert.equal(await pane.locator('b').textContent(),'0');}
   pass('U01 actual shared ActionButton source style+activation change propagates to both instances');
  }finally{await writeFile(path,original);await page.reload();}
  await choose('动作按钮');await a().getByRole('button',{name:'动作 A'}).click();assert.equal(await a().locator('b').textContent(),'1');pass('U01 source restored and original activation works');
 }
 const contrast=await page.evaluate(()=>{
  const root=document.querySelector('.dae-ui'),s=getComputedStyle(root);const rgb=h=>h.trim().slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);const lum=h=>rgb(h).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>{const x=lum(s.getPropertyValue('--dae-'+a)),y=lum(s.getPropertyValue('--dae-'+b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};return {body:ratio('text','surface'),muted:ratio('text-muted','surface'),primary:ratio('text-on-accent','accent'),focus:ratio('focus','surface'),control:ratio('border-control','surface-raised')};
 });for(const k of ['body','muted','primary'])assert.ok(contrast[k]>=4.5,k);for(const k of ['focus','control'])assert.ok(contrast[k]>=3,k);report.contrast=contrast;pass('rendered theme text and control contrast targets');
 await page.setViewportSize({width:390,height:900});await page.screenshot({path:out+'/narrow.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));pass('390px shell has no page overflow');
 await page.setViewportSize({width:1440,height:1080});await choose('参数输入');await page.screenshot({path:out+'/components.png',fullPage:true});
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.unexpectedNetwork,[]);pass('zero page errors and no network outside independent local server');report.passed=true;
}catch(e){report.passed=false;report.failure=e.stack;await page.screenshot({path:out+'/failure.png',fullPage:true});throw e;}
finally{await writeFile(out+'/verification.json',JSON.stringify(report,null,2));await browser.close();}
