const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
    const out=path.resolve(process.argv[2]||'artifacts/video-edit/browser');fs.mkdirSync(out,{recursive:true});
    const browser=await chromium.launch({headless:true,channel:'chrome'});
    const page=await browser.newPage({viewport:{width:1700,height:1200}});page.setDefaultTimeout(20000);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('dialog',dialog=>dialog.accept());
    try{
        await page.goto(process.env.COMFY_URL||'http://127.0.0.1:8209/');
        await page.waitForFunction(()=>window.app?.daelabCreativeCanvas&&LiteGraph.registered_node_types['DAELAB.VideoEdit']);
        await page.waitForTimeout(1800);await page.keyboard.press('Escape');
        await page.evaluate(async()=>{
            await app.loadGraphData({nodes:[],links:[],groups:[],extra:{}});app.daelabCreativeCanvas.show();
            window.editIds=[];
            for(let i=0;i<2;i++){const n=LiteGraph.createNode('DAELAB.VideoEdit');app.graph.add(n);editIds.push(n.id);app.graph.extra.daelabCreativeCanvasV1.cards[n.id]={x:20+i*880,y:20,width:840,expanded:true};}
            app.graph.extra.daelabCreativeCanvasV1.viewport={x:30,y:30,zoom:.8};app.daelabCreativeCanvas.show();
        });
        const ids=await page.evaluate(()=>editIds),first=page.locator(`.dae-creative-card[data-node-id="${ids[0]}"] .dae-edit`),second=page.locator(`.dae-creative-card[data-node-id="${ids[1]}"] .dae-edit`);
        await first.waitFor();
        await page.evaluate(()=>{
            const members=[];
            for(const [i,name] of ['red.png','motion.mp4','blue.png'].entries()){const n=LiteGraph.createNode('DAELAB.MediaUpload');app.graph.add(n);n.widgets.find(w=>w.name==='asset_data').value=JSON.stringify({version:1,id:'asset-'+i,kind:i===1?'video':'image',filename:name,subfolder:'',name});members.push(n.id);app.graph.extra.daelabCreativeCanvasV1.cards[n.id]={x:-2000,y:0,width:350,expanded:true};}
            const group=LiteGraph.createNode('DAELAB.MaterialGroup');app.graph.add(group);group.properties.members=members;app.graph.extra.daelabCreativeCanvasV1.cards[group.id]={x:-2000,y:0,width:730,expanded:false};const edit=app.graph.getNodeById(editIds[0]);group.connect(0,edit,edit.inputs.findIndex(i=>i.name==='assets'));
        });
        await page.waitForFunction(()=>JSON.parse(app.graph.getNodeById(editIds[0]).widgets.find(w=>w.name==='edit_data').value).clips.length===3);
        await page.waitForTimeout(700);
        assert.equal(await first.getByRole('button',{name:/添加素材|添加已连接素材/}).count(),0);
        for(const name of ['分割','复制片段','删除片段']){const button=first.getByRole('button',{name,exact:true});assert.equal(await button.textContent(),'');assert.equal(await button.getAttribute('title'),name);}
        const stage=await first.locator('.dae-edit-stage').boundingBox(),play=await first.getByRole('button',{name:'播放',exact:true}).boundingBox();assert.ok(Math.abs(stage.x+stage.width/2-play.x-play.width/2)<2);assert.ok(play.y>=stage.y+stage.height);
        assert.ok(await first.getByRole('button',{name:'缩小时间轴'}).evaluate(e=>e.offsetWidth<=28));
        assert.equal(await second.locator('.dae-edit-clip').count(),0);
        assert.equal(await first.getByLabel('开始（秒）',{exact:true}).count(),0);assert.equal(await first.getByLabel('时长（秒）',{exact:true}).count(),0);
        const trim=async(index,edge,delta)=>{const handle=first.locator('.dae-edit-clip').nth(index).getByRole('button',{name:edge==='left'?'调整片段起点':'调整片段终点'}),box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+40);await page.mouse.down();await page.mouse.move(box.x+box.width/2+delta*64*.8,box.y+40,{steps:10});await page.mouse.up();};
        await trim(0,'right',-1.5);
        assert.ok(Math.abs(await page.evaluate(()=>JSON.parse(app.graph.getNodeById(editIds[0]).widgets.find(w=>w.name==='edit_data').value).clips[0].duration)-1.5)<.03);
        await trim(1,'left',.5);await trim(1,'right',-1.5);
        await first.locator('.dae-edit-clip').nth(1).click({position:{x:25,y:30}});
        assert.equal(await first.getByRole('button',{name:'播放',exact:true}).textContent(),'');
        assert.equal(await first.getByRole('button',{name:'播放',exact:true}).evaluate(e=>getComputedStyle(e).borderTopWidth),'0px');
        assert.ok(await first.getByLabel('预览',{exact:true}).evaluate(e=>e.offsetHeight<=26));
        assert.notEqual(await first.getByLabel('当前预览时间',{exact:true}).evaluate(e=>getComputedStyle(e).color),await first.getByLabel('总时间',{exact:true}).evaluate(e=>getComputedStyle(e).color));
        assert.equal(await first.locator('.dae-edit-head').evaluate(e=>getComputedStyle(e,'::after').backgroundColor),await first.getByLabel('当前预览时间',{exact:true}).evaluate(e=>getComputedStyle(e).color));
        for(const [scale,width] of [['0.5',320],['0.75',480],['1',640]]){
            await first.getByLabel('预览',{exact:true}).selectOption(scale);
            await page.waitForFunction(({id,width})=>{const panel=document.querySelector(`.dae-creative-card[data-node-id="${id}"] .dae-edit`);return panel.querySelector('.dae-edit-stage video').videoWidth===width;},{id:await page.evaluate(()=>editIds[0]),width});
        }
        assert.equal(await second.getByLabel('预览',{exact:true}).inputValue(),'1');
        await first.getByRole('button',{name:'播放',exact:true}).click();await page.waitForTimeout(600);await first.getByRole('button',{name:'暂停',exact:true}).click();
        assert.match(await first.getByLabel('播放时间',{exact:true}).textContent(),/00:0[12]/);
        assert.equal(await first.getByRole('slider',{name:'时间轴缩放'}).count(),1);
        await first.getByRole('button',{name:'复制片段',exact:true}).click();assert.equal(await first.locator('.dae-edit-clip').count(),4);
        await first.getByRole('button',{name:'删除片段',exact:true}).click();assert.equal(await first.locator('.dae-edit-clip').count(),3);
        await first.getByRole('button',{name:'导出视频',exact:true}).click();
        await first.locator('.dae-edit-result a').waitFor({state:'visible',timeout:60000});
        assert.ok((await first.locator('.dae-edit-result a').getAttribute('href')).startsWith('/view?'));
        console.log('PASS two instances, automatic connection import, image/video trim, all actual proxy dimensions, playback and real queued export');
        await page.screenshot({path:path.join(out,'editor.png')});
        await page.evaluate(()=>{const n=app.graph.getNodeById(editIds[0]);n.mode=4;});await page.waitForTimeout(180);assert.equal(await first.isVisible(),false);
        await page.evaluate(()=>{app.graph.getNodeById(editIds[0]).mode=0;app.daelabCreativeCanvas.hide();app.daelabCreativeCanvas.show();});await first.waitFor({state:'visible'});
        const saved=await page.evaluate(()=>app.graph.serialize());fs.writeFileSync(path.join(out,'workflow.json'),JSON.stringify(saved,null,2));
        await page.reload();await page.waitForFunction(()=>window.app?.daelabCreativeCanvas);
        await page.evaluate(async data=>{await app.loadGraphData(data);app.daelabCreativeCanvas.show();},saved);
        await page.waitForTimeout(600);assert.equal(await first.locator('.dae-edit-clip').count(),3);assert.equal(await second.locator('.dae-edit-clip').count(),0);
        for(const zoom of [.3,1,1.5]){await page.evaluate(z=>{app.graph.extra.daelabCreativeCanvasV1.viewport={x:20,y:20,zoom:z};app.daelabCreativeCanvas.show();},zoom);await page.waitForTimeout(120);const overflow=await first.evaluate(e=>e.scrollWidth>e.clientWidth+2);assert.equal(overflow,false);}
        console.log('PASS modes, workflow reload, independent state and three canvas zoom levels');
        assert.deepEqual(errors,[]);
    }catch(error){await page.screenshot({path:path.join(out,'failure.png')});console.error('PAGE ERRORS',errors);console.error(await page.evaluate(()=>app.graph._nodes.map(n=>({id:n.id,mode:n.mode,clips:n.widgets?.find(w=>w.name==='edit_data')?.value,hidden:n.__videoEdit?.root.hidden,connected:n.__videoEdit?.root.isConnected}))));throw error;}
    finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
