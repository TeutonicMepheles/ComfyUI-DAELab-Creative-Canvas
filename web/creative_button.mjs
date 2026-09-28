// Native creative-canvas buttons. Business actions and existing visual variants
// stay with their owners; a panel lease owns the lifetime of this binding.
const bindings = new WeakMap();
export function bindCreativeButton(button) {
    if (bindings.has(button)) return bindings.get(button);
    const original = button.onclick;
    const previousMarker = button.getAttribute('data-creative-button');
    let active = true, pending = false, restoreBusy = null;
    button.setAttribute('data-creative-button', 'true');
    function invoke(event) {
        if (pending || button.disabled) return;
        const result = original?.call(this, event);
        if (!result || typeof result.then !== 'function') return result;
        pending = true;
        const disabled = button.disabled, busy = button.getAttribute('aria-busy');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        restoreBusy = () => {
            button.disabled = disabled;
            if (busy === null) button.removeAttribute('aria-busy');
            else button.setAttribute('aria-busy', busy);
            restoreBusy = null;
        };
        return Promise.resolve(result).finally(() => {
            pending = false;
            if (active) restoreBusy?.();
        });
    }
    button.onclick = invoke;
    const release = () => {
        if (!active) return;
        active = false;
        restoreBusy?.();
        if (button.onclick === invoke) button.onclick = original;
        if (previousMarker === null) button.removeAttribute('data-creative-button');
        else button.setAttribute('data-creative-button', previousMarker);
        bindings.delete(button);
    };
    bindings.set(button, release);
    return release;
}

export function createCreativeButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.onclick = action;
    bindCreativeButton(button);
    return button;
}
