const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1640,height:1050}});page.setDefaultTimeout(20000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const checks=[];const pass=s=>{checks.push(s);console.log('PASS',s);};
 try{
 await page.goto((process.env.COMFY_URL||'http://127.0.0.1:8199'));await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
 await page.waitForTimeout(1000);await page.keyboard.press('Escape');await page.evaluate(()=>{app.graph.clear();app.daelabCreativeCanvas.show();});
 await page.locator('.dae-creative').dblclick({position:{x:240,y:160}});
 await page.locator('.dae-creative-picker').getByRole('button',{name:'上传',exact:true}).click();
 const a=page.locator('.dae-creative .dae-upload').first();
 await a.locator('input[type=file]').setInputFiles(path.resolve('examples/creative_canvas/assets/daelab-gallery-mountain.png'));
 await a.locator('img').waitFor();await page.waitForFunction(()=>document.querySelector('.dae-creative .dae-upload img')?.naturalWidth>0);
 await page.evaluate(()=>app.daelabCreativeCanvas.add('DAELAB.MediaUpload'));
 const b=page.locator('.dae-creative .dae-upload').nth(1);
 await b.locator('input[type=file]').setInputFiles(path.resolve('examples/creative_canvas/assets/daelab-gallery-motion.webm'));
 await b.locator('video').waitFor();await page.waitForFunction(()=>document.querySelector('.dae-creative .dae-upload video')?.readyState>=2);
 await page.evaluate(()=>{Object.values(app.graph.extra.daelabCreativeCanvasV1.cards).forEach((c,i)=>Object.assign(c,{x:i*730,y:0}));app.daelabCreativeCanvas.sync();app.daelabCreativeCanvas.fit();});
 pass('Upload menu creates independent local image and video sources');
 await b.locator('video').evaluate(v=>v.play());await page.waitForTimeout(700);assert.ok(await b.locator('video').evaluate(v=>v.currentTime)>0);await b.locator('video').evaluate(v=>v.pause());pass('Uploaded video plays locally');
 await page.screenshot({path:path.join(out,'uploaded.png')});
 const saved=await page.evaluate(()=>app.graph.serialize());fs.writeFileSync(path.join(out,'Upload Demo.json'),JSON.stringify(saved,null,2));
 const original=await a.locator('img').getAttribute('src');
 page.once('dialog',d=>d.dismiss());await a.locator('input[type=file]').setInputFiles(path.resolve('examples/creative_canvas/assets/daelab-gallery-motion.webm'));assert.equal(await a.locator('img').getAttribute('src'),original);pass('Cancel replacement preserves original');
 await a.locator('input[type=file]').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('invalid')});await a.getByRole('status').filter({hasText:'请选择'}).waitFor();pass('Unsupported format gives recoverable error');
 for(let i=0;i<2;i++){await page.evaluate(()=>app.daelabCreativeCanvas.hide());await page.waitForTimeout(250);await page.evaluate(()=>app.daelabCreativeCanvas.show());await a.locator('img').waitFor();}
 pass('Two mode switches preserve panels');
 await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);await page.waitForTimeout(1200);await page.evaluate(async saved=>app.loadGraphData(saved),saved);
 await page.waitForFunction(()=>document.querySelector('.dae-creative .dae-upload img')?.naturalWidth>0&&document.querySelector('.dae-creative .dae-upload video')?.readyState>=2);
 assert.equal(await page.locator('.dae-creative .dae-upload').count(),2);pass('Reload and reopen restore both assets');
 await page.evaluate(()=>{app.graph._nodes[0].mode=4;});await page.waitForTimeout(500);assert.equal(await a.isVisible(),false);await page.evaluate(()=>{app.graph._nodes[0].mode=0;});await a.waitFor();pass('Inactive collapses and Active restores upload');
 const overflow=await page.locator('.dae-creative .dae-upload').evaluateAll(es=>es.map(e=>({width:e.clientWidth,scroll:e.scrollWidth})));assert.ok(overflow.every(e=>e.scroll<=e.width+1));
 await page.screenshot({path:path.join(out,'restored.png')});
 await page.route('**/upload/image',route=>route.fulfill({status:503,body:'unavailable'}));
 page.once('dialog',d=>d.accept());await a.locator('input[type=file]').setInputFiles(path.resolve('examples/creative_canvas/assets/daelab-gallery-mountain.png'));
 await a.getByRole('status').filter({hasText:'上传失败'}).waitFor();assert.equal(await a.locator('img').getAttribute('src'),original);await page.unroute('**/upload/image');pass('Upload failure preserves original and restores retry');
 const longName='长文件名素材验证'.repeat(12)+'.png';
 const drop=await page.evaluateHandle(({bytes,name})=>{const dt=new DataTransfer();dt.items.add(new File([new Uint8Array(bytes)],name,{type:'image/png'}));return dt;},{bytes:[...fs.readFileSync('examples/creative_canvas/assets/daelab-gallery-mountain.png')],name:longName});
 page.once('dialog',d=>d.accept());await a.dispatchEvent('drop',{dataTransfer:drop});await page.waitForFunction(name=>document.querySelector('.dae-creative .dae-upload-info')?.title===name,longName);pass('Drag and drop replacement succeeds after failure');
 await page.setViewportSize({width:1000,height:800});await page.evaluate(()=>app.daelabCreativeCanvas.fit());await page.screenshot({path:path.join(out,'compact.png')});
 assert.ok(await a.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
 await page.setViewportSize({width:1640,height:1050});await page.evaluate(()=>app.daelabCreativeCanvas.fit());
 await page.evaluate(()=>{
   const [image,video]=app.graph._nodes;
   const preview=LiteGraph.createNode('PreviewImage');app.graph.add(preview);image.connect(3,preview,0);
   const extract=LiteGraph.createNode('GetVideoComponents');app.graph.add(extract);video.connect(4,extract,0);
   const frames=LiteGraph.createNode('PreviewImage');app.graph.add(frames);extract.connect(0,frames,0);
   if(image.connect(4,extract,0))throw new Error('Wrong media type accepted');
 });
 await a.locator('input[type=file]').setInputFiles(path.resolve('examples/creative_canvas/assets/daelab-gallery-motion.webm'));await a.getByRole('status').filter({hasText:'先断开'}).waitFor();pass('Connected media type cannot be silently changed');
 const queued=page.waitForResponse(r=>r.url().endsWith('/prompt')&&r.request().method()==='POST');await page.evaluate(()=>app.queuePrompt(0,1));const response=await queued;assert.equal(response.status(),200);const job=await response.json();
 let history;for(let i=0;i<60;i++){history=await page.evaluate(async id=>(await (await fetch('/history/'+id)).json())[id],job.prompt_id);if(history?.status?.completed)break;await page.waitForTimeout(500);}
 assert.equal(history?.status?.status_str,'success');pass('Real local graph executes image preview and video frame extraction');
 await page.evaluate(()=>{for(const n of [...app.graph._nodes])if(n.type!=='DAELAB.MediaUpload')app.graph.remove(n);});
 await page.waitForTimeout(300);await page.screenshot({path:path.join(out,'final.png')});
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({checks,errors,overflow},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
