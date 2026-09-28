import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=createRequire(new URL('../frontend/package.json',import.meta.url))('playwright');
const out=resolve(process.env.CREATIVE_EVIDENCE||'../../../work/material3-qa');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1720,height:1240}});page.setDefaultTimeout(15000);
const report={checks:[],fonts:[],fontResponses:[],errors:[],generationRequests:[]};
page.on('pageerror',e=>report.errors.push(e.message));
page.on('response',r=>{if(r.url().includes('/vendor/alibaba-puhuiti-3/')&&r.url().endsWith('.woff2'))report.fontResponses.push({url:r.url(),status:r.status()});});
await page.route('**/prompt',r=>{if(r.request().method()==='POST'){report.generationRequests.push(r.request().url());return r.abort();}return r.continue();});
await page.route('**/comfytv/assets?*',r=>r.fulfill({json:{assets:[],total:0}}));
const fixture=JSON.parse(await readFile(new URL('../examples/creative_canvas/Creative Canvas Controls.json',import.meta.url),'utf8'));
try{
 await page.goto(process.env.COMFY_URL||'http://127.0.0.1:8000');await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
 await page.evaluate(async data=>{await app.loadGraphData(data);app.daelabCreativeCanvas.show();},fixture);
 await page.waitForTimeout(1500);
 await page.evaluate(async()=>{await Promise.all([400,500,600].map(w=>document.fonts.load(`${w} 16px "DAELab PuHuiTi 3"`,'中文创作画布 ABC 123')));await document.fonts.ready;});
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 async function fonts(selector){const {root}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});assert.ok(nodeId,selector);const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});report.fonts.push({selector,fonts});assert.ok(fonts.some(f=>f.isCustomFont&&f.familyName.includes('Alibaba')),JSON.stringify(fonts));}
 await fonts('.dae-creative-heading strong');await fonts('.dae-creative-type');
 const styles=await page.evaluate(()=>[...document.querySelectorAll('.dae-creative .dae-libtv')].map(p=>({font:getComputedStyle(p).fontFamily,button:p.querySelector('[data-creative-button]')&&getComputedStyle(p.querySelector('[data-creative-button]')).borderRadius,field:p.querySelector('[data-creative-field]')&&getComputedStyle(p.querySelector('[data-creative-field]')).fontFamily})));
 assert.ok(styles.length>=2);assert.ok(styles.every(s=>s.font.includes('DAELab PuHuiTi 3')));
 await fonts('.dae-creative .dae-libtv label span');await fonts('.dae-creative-body>button[data-primary]');
 report.checks.push('browser uses bundled web fonts for Chinese titles, labels and type captions');
 assert.equal(report.fontResponses.filter(r=>r.status===200).length,3);report.checks.push('all three original WOFF2 weights load from local extension URLs');
 report.contrast=await page.evaluate(()=>{const root=getComputedStyle(document.querySelector('.dae-creative')),get=n=>root.getPropertyValue(n).trim();const lum=h=>{const v=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];};const ratio=(a,b)=>{const x=lum(get(a)),y=lum(get(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};return {text:ratio('--dae-text','--dae-surface'),muted:ratio('--dae-text-muted','--dae-surface'),primary:ratio('--dae-text-on-accent','--dae-accent'),control:ratio('--dae-border-control','--dae-surface')};});
 for(const k of ['text','muted','primary'])assert.ok(report.contrast[k]>=4.5,k);assert.ok(report.contrast.control>=3);report.checks.push('theme text contrast exceeds 4.5:1 and field outlines exceed 3:1');
 await page.evaluate(()=>{const s=app.graph.extra.daelabCreativeCanvasV1;app.graph._nodes.filter(n=>n.type==='DAELAB.LibTV.VideoGenerate').forEach((n,i)=>Object.assign(s.cards[n.id],{x:40+i*580,y:40,width:540,expanded:true}));s.viewport={x:30,y:40,zoom:1};app.daelabCreativeCanvas.hide();app.daelabCreativeCanvas.show();});
 // Move other nodes outside the screenshot without changing business data.
 await page.evaluate(()=>{const s=app.graph.extra.daelabCreativeCanvasV1;for(const n of app.graph._nodes)if(n.type!=='DAELAB.LibTV.VideoGenerate')s.cards[n.id].x=4000;if(app.graph.extra.daelabControlGallery)app.graph.extra.daelabControlGallery.x=5000;app.daelabCreativeCanvas.hide();app.daelabCreativeCanvas.show();});
 await page.waitForTimeout(500);await page.locator('.dae-creative').click({position:{x:1300,y:400}});await page.screenshot({path:resolve(out,'material3-panels.png')});
 await page.evaluate(()=>{for(const c of Object.values(app.graph.extra.daelabCreativeCanvasV1.cards))c.expanded=false;app.daelabCreativeCanvas.sync();});
 await page.screenshot({path:resolve(out,'material3-canvas.png')});
 await page.locator('.dae-creative').dblclick({position:{x:1300,y:550}});assert.deepEqual(await page.locator('.dae-creative-picker button').allTextContents(),['图片','视频','剪辑','故事板']);await page.screenshot({path:resolve(out,'material3-picker.png')});await page.keyboard.press('Escape');assert.equal(await page.locator('.dae-creative-picker').count(),0);report.checks.push('Escape dismisses the focused node menu without deleting nodes');
 // Verify the shared run button without submitting any queue request.
 await page.evaluate(async()=>{const run=document.querySelector('.dae-creative-body>button[data-primary]'),original=app.queuePrompt;let finish;app.queuePrompt=()=>new Promise(r=>finish=r);try{const pending=run.onclick(new Event('click'));if(!run.disabled||run.getAttribute('aria-busy')!=='true')throw Error('run must be busy');finish();await pending;if(run.disabled||run.hasAttribute('aria-busy'))throw Error('run must recover');}finally{app.queuePrompt=original;}});report.checks.push('shared generation button recovers after simulated async completion without queueing');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.dae-creative').evaluate(e=>getComputedStyle(e).getPropertyValue('--dae-duration-fast').trim()),'0ms');
 report.checks.push('reduced motion uses zero-duration transitions');
 const saved=await page.evaluate(()=>app.graph.serialize());await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);await page.evaluate(async data=>{await app.loadGraphData(data);app.daelabCreativeCanvas.show();await document.fonts.ready;},saved);await fonts('.dae-creative-heading strong');report.checks.push('workflow reload retains material theme and actual web font');
 await page.evaluate(()=>app.daelabCreativeCanvas.hide());assert.equal(await page.locator('.dae-creative').isVisible(),false);assert.equal(await page.locator('.dae-creative [data-creative-field]').count(),0);report.checks.push('leaving creative mode releases shared field bindings');
 assert.deepEqual(report.generationRequests,[]);assert.deepEqual(report.errors,[]);console.log(report.checks);
}finally{await page.screenshot({path:resolve(out,'material3-last-state.png')}).catch(()=>{});await writeFile(resolve(out,'material3-verification.json'),JSON.stringify(report,null,2));await browser.close();}
