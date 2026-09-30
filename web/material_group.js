import {app} from '/scripts/app.js';
import {registerAdapter} from './creative_contract.mjs';
import {GROUP_TYPE,collectionFor,migrateGroups} from './material_group_model.mjs';

registerAdapter('daelab.material-group',{
    matches:n=>n.type===GROUP_TYPE,width:730,expanded:false,floatingHeader:true,
    summary:n=>`${n.properties.members?.length||0} 项 · 整组输出`,menu:[],
    assets:collectionFor,
});
app.registerExtension({
    name:'DAELAB.MaterialGroups',
    commands:[{id:'DAELAB.MaterialGroups.Create',label:'选中素材打组 (Ctrl+G)',function:()=>app.daelabMaterialGroups?.createFromSelection()}],
    beforeConfigureGraph(data){migrateGroups(data);},
    beforeRegisterNodeDef(type,definition){
        if(definition.name!==GROUP_TYPE)return;
        const created=type.prototype.onNodeCreated;
        type.prototype.onNodeCreated=function(){
            created?.apply(this,arguments);
            this.properties={...this.properties,members:[],layout:'grid',collapsed:false,locked:false};
            const data=this.widgets.find(w=>w.name==='collection_data');
            data.hidden=true;data.options={...data.options,hidden:true};data.computeSize=()=>[0,-4];
            if(data.inputEl)data.inputEl.style.display='none';
            data.serializeValue=()=>JSON.stringify(collectionFor(this));
        };
    },
});
