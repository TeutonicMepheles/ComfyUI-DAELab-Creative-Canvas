import {adapterFor, API_KEY} from './creative_contract.mjs';

// Keep the existing registry identity even when an older contract module is cached.
export function inputSnapshot(node) {
    if (!node || node.mode) return null;
    const adapter = adapterFor(node);
    const value = adapter?.inputSnapshot?.(node) ?? adapter?.assets?.(node);
    return value == null ? null : JSON.parse(JSON.stringify(value));
}

export function publishInputExchange(target = globalThis) {
    const api = target[API_KEY];
    if (api?.version !== 1 || typeof api.registerAdapter !== 'function') throw new Error('Creative Canvas API v1 must be published first');
    target[API_KEY] = Object.freeze({...api, inputSnapshot});
    target.dispatchEvent?.(new Event('daelab:creative-canvas-ready'));
}
