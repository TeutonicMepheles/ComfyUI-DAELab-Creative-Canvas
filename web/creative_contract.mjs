// Public v1 integration boundary. No host, business, or DOM dependency.
const adapters = new Map();
export const API_KEY = Symbol.for('DAELAB.CreativeCanvas.API.v1');
export const READY_EVENT = 'daelab:creative-canvas-ready';
export function registerAdapter(id, adapter) {
    if (!id || typeof adapter?.matches !== 'function') throw new TypeError('Adapter requires id and matches(node)');
    if (adapters.has(id)) throw new Error(`Creative adapter already registered: ${id}`);
    adapters.set(id, adapter);
    return () => { if (adapters.get(id) === adapter) adapters.delete(id); };
}
export function adapterFor(node) { return [...adapters.values()].find(a => a.matches(node)); }
export function menuItems() { return [...adapters.values()].flatMap(a => a.menu || []); }
export function publishAPI(target=globalThis) {
    const api = target[API_KEY];
    if (api && api.registerAdapter !== registerAdapter) throw new Error('A second creative canvas owner is installed');
    target[API_KEY] = Object.freeze({version:1, registerAdapter});
    target.dispatchEvent?.(new Event(READY_EVENT));
}
