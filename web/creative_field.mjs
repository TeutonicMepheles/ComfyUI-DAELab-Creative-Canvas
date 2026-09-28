// Lease-scoped native fields: no node data, model policy or serialization here.
const bindings = new WeakMap();
export function bindCreativeField(field) {
    if (bindings.has(field)) return bindings.get(field);
    const saved = new Map(['data-creative-field','aria-invalid','title'].map(k=>[k,field.getAttribute(k)]));
    field.dataset.creativeField = 'true';
    const restore = key => {const value=saved.get(key);if(value===null)field.removeAttribute(key);else field.setAttribute(key,value);};
    function validate(event) {
        if (field.disabled || field.closest('[inert]')) {event?.stopImmediatePropagation();return;}
        const numeric=field.type==='number';
        const invalid=numeric && (field.value.trim()==='' || !Number.isFinite(field.valueAsNumber) || !field.validity.valid);
        if(invalid){
            field.setAttribute('aria-invalid','true');
            field.title=`请输入有效数字（${field.min || '不限'}—${field.max || '不限'}，步长 ${field.step || '1'}）`;
            event?.stopImmediatePropagation();
        } else {restore('aria-invalid');restore('title');}
    }
    const events=['input','change'];
    for(const event of events)field.addEventListener(event,validate,true);
    const release=()=>{for(const event of events)field.removeEventListener(event,validate,true);for(const key of saved.keys())restore(key);bindings.delete(field);};
    bindings.set(field,release);return release;
}
