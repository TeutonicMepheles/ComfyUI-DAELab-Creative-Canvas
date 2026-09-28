import {bindCreativeField} from './creative_field.mjs';
// Opt-in, local-only specimens; no execution nodes or persisted business data.
export function createFieldGallery(config) {
    const root=document.createElement('article');root.className='dae-creative-card';
    root.style.cssText=`left:${config.x}px;top:${config.y}px;width:480px`;
    const panel=document.createElement('section');panel.className='dae-libtv dae-studio';root.append(panel);
    const title=document.createElement('strong');title.textContent='共享输入控件 · 状态陈列';panel.append(title);
    const cleanups=[];
    for(const [name,kind,value,disabled] of [['默认文本','text','可编辑文本',false],['默认下拉','select','选项 A',false],['禁用文本','text','不可编辑',true],['禁用下拉','select','选项 A',true],['错误数字（4—30 的整数）','number','99',false]]){
        const label=document.createElement('label');label.textContent=name;
        const field=document.createElement(kind==='select'?'select':'input');field.setAttribute('aria-label',name);
        if(kind==='select')for(const text of ['选项 A','选项 B'])field.add(new Option(text,text));
        else field.type=kind;
        if(kind==='number'){field.min='4';field.max='30';field.step='1';}
        field.value=value;field.disabled=disabled;label.append(field);panel.append(label);cleanups.push(bindCreativeField(field));
        if(kind==='number')field.dispatchEvent(new Event('change'));
    }
    const note=document.createElement('small');note.textContent='点击或按 Tab 聚焦；修正错误数字后红框消失。样例不提交任务、不保存到业务节点。';panel.append(note);
    return {root,release(){cleanups.forEach(fn=>fn());root.remove();}};
}
