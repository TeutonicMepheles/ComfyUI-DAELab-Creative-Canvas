// Creates a NEW gallery in an isolated browser context. Never queues a prompt.
// Requires frontend/npm ci and the existing ComfyUI service on :8000.
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(path.join(root,'frontend/package.json'));
const {chromium}=require('playwright');
const base=process.env.COMFY_URL||'http://127.0.0.1:8000';
const dest=path.join(root,'examples/creative_canvas'),evidence=path.join(root,'docs/architecture/native-gallery');
await mkdir(path.join(dest,'assets'),{recursive:true});await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1920,height:1200}});
const page=await context.newPage();page.setDefaultTimeout(15000);
const report={assetListIsolatedForScreenshots:true,checks:[],errors:[],blockedGenerationRequests:[],server:base};
page.on('pageerror',e=>report.errors.push(e.message));
await context.route('**/prompt',route=>{if(route.request().method()==='POST'){report.blockedGenerationRequests.push(route.request().url());return route.abort();}return route.continue();});
await context.route('**/comfytv/assets?*',route=>route.request().method()==='GET'?route.fulfill({json:{assets:[],total:0}}):route.continue());
const check=name=>{report.checks.push(name);console.log('PASS',name);};
try{
 // Render our existing authored sample to PNG; this is not a user/private asset.
 const assetPage=await context.newPage();
 await assetPage.setContent(await readFile(path.join(root,'frontend/public/samples/mountain.svg'),'utf8'));
 await assetPage.locator('svg').screenshot({path:path.join(dest,'assets/daelab-gallery-mountain.png')});await assetPage.close();
 await copyFile(path.join(root,'frontend/public/samples/motion.webm'),path.join(dest,'assets/daelab-gallery-motion.webm'));
 const urls={};
 for(const [key,name,mime] of [['image','daelab-gallery-mountain.png','image/png'],['video','daelab-gallery-motion.webm','video/webm']]){
  const res=await page.request.post(base+'/upload/image',{multipart:{image:{name,mimeType:mime,buffer:await readFile(path.join(dest,'assets',name))},subfolder:'daelab-gallery',type:'input',overwrite:'false'}});
  assert.ok(res.ok(),await res.text());const data=await res.json();urls[key]='/view?'+new URLSearchParams({filename:data.name,subfolder:data.subfolder,type:data.type||'input'});
 }
 await page.goto(base);await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
 const graph=await page.evaluate(async urls=>{
  app.daelabCreativeCanvas.hide();app.graph.clear();
  function add(type,pos){const n=LiteGraph.createNode(type);if(!n)throw Error('Missing '+type);app.graph.add(n);n.pos=pos;return n;}
  function set(n,name,v){const w=n.widgets?.find(x=>x.name===name);if(!w)throw Error('Missing widget '+name);w.value=v;}
  const table=add('DAELAB.Table',[100,150]);
  const a=add('DAELAB.LibTV.VideoGenerate',[1350,150]);
  const b=add('DAELAB.LibTV.VideoGenerate',[1950,150]);
  const batch=add('DAELAB.LibTV.StoryboardBatch',[100,1100]);
  const image=add('ComfyTV.AssetImageLoaderStage',[1350,1100]);
  const video=add('ComfyTV.AssetVideoLoaderStage',[1950,1100]);
  const frame=add('ComfyTV.VideoExtractFrameStage',[2550,1100]);
  for(const [n,id,prompt] of [[a,'gallery-video-a','山间清晨，镜头缓慢掠过山脊。陈列实例 A。'],[b,'gallery-video-b','海岸黄昏，镜头沿岸线推进。陈列实例 B。']]){
   set(n,'project_uuid','');set(n,'request_id',id);set(n,'prompt',prompt);set(n,'model','Seedance 2.5');set(n,'mode','text2video');set(n,'duration',5);set(n,'resolution','720p');set(n,'ratio','16:9');set(n,'sound',false);
  }
  set(batch,'project_uuid','');set(batch,'request_id','gallery-batch');
  set(image,'asset_url',urls.image);set(video,'asset_url',urls.video);set(frame,'position','middle');
  table.connect(0,batch,batch.inputs.findIndex(i=>i.name==='storyboard_json'));
  video.connect(0,frame,frame.inputs.findIndex(i=>i.name==='video'));
  const data={version:1,fields:[
   {id:'title',name:'镜头名称',type:'text',width:150,hidden:false},
   {id:'description',name:'画面描述',type:'longtext',width:260,hidden:false},
   {id:'duration',name:'时长',type:'number',width:90,hidden:false},
   {id:'approved',name:'已复核',type:'checkbox',width:90,hidden:false},
   {id:'assets',name:'参考素材',type:'assets',width:150,hidden:false}
  ],records:[
   {id:'gallery-row-a',selected:false,values:{title:'清晨山景',description:'保留真实表格的输入、换行、素材预览与撤销交互。',duration:5,approved:true,assets:[{id:'gallery-asset-a',url:urls.image,name:'陈列山景',kind:'image'}]}},
   {id:'gallery-row-b',selected:false,values:{title:'空素材状态',description:'此行用于检查空值、复选框和数字输入。',duration:10,approved:false,assets:[]}}
  ],view:'table',meta:{}};
  const saved=app.graph.serialize();const tn=saved.nodes.find(n=>String(n.id)===String(table.id));
  const wi=table.widgets.findIndex(w=>w.name==='table_data');tn.widgets_values[wi]=JSON.stringify(data);tn.widgets_values_named={...tn.widgets_values_named,table_data:JSON.stringify(data)};
  const layout={};
  for(const [n,x,y,width,expanded] of [[table,0,0,1060,true],[a,1130,0,480,true],[b,1680,0,480,true],[batch,0,850,480,true],[image,550,850,480,true],[video,1130,850,480,true],[frame,1680,850,480,true]])layout[n.id]={x,y,width,expanded,portsExpanded:false};
  saved.extra||={};saved.extra.daelabCreativeCanvasV1={version:1,active:true,viewport:{x:35,y:45,zoom:.72},cards:layout};
  saved.extra.daelabGallery={version:1,purpose:'现有创作画布真实节点控件陈列',notes:'新工作流；不提交生成；空项目标识需用户显式配置。',nodeIds:{table:table.id,videoA:a.id,videoB:b.id,batch:batch.id,image:image.id,video:video.id,frame:frame.id}};
  // Native graph layout remains spacious even for panels that resize at load time.
  for(const n of saved.nodes){n.size=n.type==='DAELAB.Table'?[1100,720]:[480,720];}
  return saved;
 },urls);
 await page.evaluate(async data=>app.loadGraphData(data),graph);
 await page.waitForFunction(()=>document.querySelectorAll('.dae-creative-card').length===7);
 await page.waitForFunction(()=>app.graph._nodes.some(n=>n.__dataTable?.records?.some(r=>r.values.title==='清晨山景')));
 check('seven existing registered nodes load in creative mode; no new UI implementation');
 const ids=graph.extra.daelabGallery.nodeIds;
 assert.equal(await page.locator('.dae-creative-wires path').count(),2);check('table-to-batch and local-video-to-frame graph links preserved');
 const card=id=>page.locator(`.dae-creative [data-node-id="${id}"]`);
 await card(ids.videoA).getByLabel('画面与运动描述',{exact:true}).fill('仅实例 A 修改');
 assert.notEqual(await card(ids.videoB).getByLabel('画面与运动描述',{exact:true}).inputValue(),'仅实例 A 修改');check('native LibTV panels edit independently');
 // Test reload against the authored artifact, not the temporary interaction state.
 await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
 await page.evaluate(async data=>app.loadGraphData(data),graph);await page.waitForFunction(()=>document.querySelectorAll('.dae-creative-card').length===7);
 await page.waitForFunction(()=>app.graph._nodes.some(n=>n.__dataTable?.records?.some(r=>r.values.title==='清晨山景')));
 await page.screenshot({path:path.join(evidence,'native-controls.png')});
 await page.evaluate(()=>{const s=app.graph.extra.daelabCreativeCanvasV1;s.viewport={x:35,y:-570,zoom:.72};app.daelabCreativeCanvas.hide(false);app.daelabCreativeCanvas.show();});
 await page.waitForFunction(()=>[...document.querySelectorAll('.dae-creative video')].some(v=>v.readyState>=2));
 const v=card(ids.video).locator('video').first();await v.evaluate(v=>v.play());await page.waitForTimeout(300);assert.ok(await v.evaluate(v=>v.currentTime)>0);await v.evaluate(v=>v.pause());
 await page.screenshot({path:path.join(evidence,'native-media.png')});check('native ComfyTV local video preview plays; no generation execution');
 await page.evaluate(()=>app.daelabCreativeCanvas.hide());assert.equal(await page.locator('.dae-creative').isVisible(),false);
 await page.evaluate(()=>app.daelabCreativeCanvas.show());assert.equal(await page.locator('.dae-creative-card').count(),7);check('creative mode exit and reentry preserve seven cards');
 // Keep the initial authored viewport, no incidental QA edits.
 const output=path.join(dest,'Creative Canvas Controls.json');await writeFile(output,JSON.stringify(graph,null,2)+'\n');
 assert.deepEqual(report.blockedGenerationRequests,[]);assert.deepEqual(report.errors,[]);
 report.passed=true;report.workflow=path.relative(root,output);report.nodeTypes=graph.nodes.map(n=>n.type);report.media=urls;
}catch(e){report.failure=e.stack;report.passed=false;await page.screenshot({path:path.join(evidence,'failure.png')});throw e;}
finally{await writeFile(path.join(evidence,'verification.json'),JSON.stringify(report,null,2));await browser.close();}
