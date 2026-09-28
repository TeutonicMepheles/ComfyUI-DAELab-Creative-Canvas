const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const url=process.env.COMFY_URL||'http://127.0.0.1:8200',out=process.argv[2],combined=process.argv.includes('--combined');
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1680,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const definitions=await (await page.request.get(url+'/object_info')).json();
  assert.ok(definitions['DAELAB.MediaUpload']);
  assert.equal(!!definitions['DAELAB.LibTV.VideoGenerate'],combined);
  const extensions=await (await page.request.get(url+'/extensions')).json();
  assert.equal(extensions.filter(s=>s.endsWith('/creative_canvas.js')).length,1);
  assert.equal(extensions.filter(s=>s.endsWith('/media_upload.js')).length,1);
  await page.goto(url);await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);await page.waitForTimeout(1200);await page.keyboard.press('Escape');
  const saved=JSON.parse(fs.readFileSync(path.join(out,'../upload/Upload Demo.json'),'utf8'));
  await page.evaluate(async data=>app.loadGraphData(data),saved);
  await page.waitForFunction(()=>document.querySelector('.dae-upload img')?.naturalWidth>0);
  await page.evaluate(()=>app.daelabCreativeCanvas.fit());
  await page.locator('.dae-creative').dblclick({position:{x:300,y:780}});
  assert.deepEqual(await page.locator('.dae-creative-picker button').allTextContents(),combined?['上传','剪辑','故事板']:['上传']);
  await page.keyboard.press('Escape');
  await page.evaluate(()=>document.fonts.ready);
  const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  const doc=await cdp.send('DOM.getDocument');const found=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'.dae-upload-info'});
  const fonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:found.nodeId});
  assert.ok(fonts.fonts.some(f=>f.isCustomFont&&f.familyName.includes('Alibaba')));
  // Availability belongs to the new package and works outside creative mode too.
  await page.evaluate(()=>{app.daelabCreativeCanvas.hide();app.canvas.centerOnNode(app.graph._nodes[0]);});
  for(const mode of [2,4,0]){
   await page.evaluate(mode=>app.graph._nodes[0].mode=mode,mode);await page.waitForTimeout(180);
   assert.equal(await page.evaluate(()=>app.graph._nodes[0].__mediaUpload.root.hidden),mode!==0);
  }
  await page.evaluate(()=>app.daelabCreativeCanvas.show());
  if(combined){
   const ids=await page.evaluate(()=>{
    app.graph.clear();app.daelabCreativeCanvas.show();
    const ns=['DAELAB.LibTV.VideoGenerate','DAELAB.LibTV.VideoGenerate','DAELAB.Table','DAELAB.Table'].map(t=>app.daelabCreativeCanvas.add(t));
    ns.forEach((n,i)=>Object.assign(app.graph.extra.daelabCreativeCanvasV1.cards[n.id],{x:(i%2)*1120,y:Math.floor(i/2)*1000,expanded:true}));
    app.daelabCreativeCanvas.sync();app.daelabCreativeCanvas.fit();return ns.map(n=>n.id);
   });
   await page.waitForFunction(()=>document.querySelectorAll('.dae-creative .dae-libtv').length===2);
   assert.equal(await page.locator('.dae-creative [data-creative-field]').count(),6);
   const state=await page.evaluate(ids=>{
    const [a,b,t1,t2]=ids.map(id=>app.graph.getNodeById(id));
    const field=a.__libtvPanel.controls.prompt;field.value='独立画布接入验证';field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));
    return {a:a.widgets.find(w=>w.name==='prompt').value,b:b.widgets.find(w=>w.name==='prompt').value,tables:[t1,t2].every(n=>n.__dataTablePanel.root.closest('.dae-creative'))};
   },ids);
   assert.equal(state.a,'独立画布接入验证');assert.notEqual(state.b,state.a);assert.ok(state.tables);
   await page.waitForTimeout(300);await page.evaluate(()=>app.daelabCreativeCanvas.fit());
   await page.screenshot({path:path.join(out,'business-adapters.png')});
   for(let i=0;i<2;i++){
    await page.evaluate(()=>app.daelabCreativeCanvas.hide());assert.equal(await page.locator('[data-creative-field]').count(),0);
    await page.evaluate(()=>app.daelabCreativeCanvas.show());await page.waitForTimeout(300);
    assert.equal(await page.locator('.dae-creative [data-creative-field]').count(),6);
   }
   const data=await page.evaluate(()=>app.graph.serialize());
   await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);await page.waitForTimeout(1200);
   await page.evaluate(async data=>app.loadGraphData(data),data);await page.waitForTimeout(500);
   assert.equal(await page.locator('.dae-creative .dae-libtv').count(),2);
   assert.equal(await page.evaluate(id=>app.graph.getNodeById(id).widgets.find(w=>w.name==='prompt').value,ids[0]),'独立画布接入验证');
   await page.evaluate(async()=>{app.daelabCreativeCanvas.hide();await app.extensionManager.command.execute('Comfy.ToggleLinear');});
   assert.equal(await page.locator('[data-creative-field]').count(),0);
   await page.screenshot({path:path.join(out,'app-mode.png')});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({combined,uniqueEntrypoints:true,menu:true,fonts:fonts.fonts,panelAvailability:true,businessLeases:combined,errors},null,2));
  console.log('PASS repository ownership, optional dependencies, rendered fonts, availability'+(combined?', two business instances, lease release and reload':''));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
