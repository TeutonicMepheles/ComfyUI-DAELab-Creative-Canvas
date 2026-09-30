import {API_KEY,READY_EVENT} from './creative_contract.mjs';
const panelContexts = new WeakMap();
// The host leases a context with the panel. Consumers never inspect host DOM.
export function bindPanelContext(panel, context) {
    panelContexts.set(panel, context);
    return () => { if (panelContexts.get(panel) === context) panelContexts.delete(panel); };
}
export function getPanelContext(element) {
    for (let node=element; node; node=node.parentNode) {
        const context=panelContexts.get(node);
        if (context) return context;
    }
    return null;
}

export function publishPanelContext(target=globalThis){
    const api=target[API_KEY];
    if(api?.version!==1||typeof api.registerAdapter!=='function')throw new Error('Creative Canvas API v1 must be published first');
    target[API_KEY]=Object.freeze({...api,getPanelContext});
    target.dispatchEvent?.(new Event(READY_EVENT));
}
