// Compatibility boundary for DOM canvas edits and the host workflow undo stack.
export function canvasHistory(app){
    const tracker=()=>app.extensionManager?.workflow?.activeWorkflow?.changeTracker;
    // Flush the host debounce before a drag; otherwise it can replace the
    // pre-drag undo state with an intermediate position while changeCount > 0.
    return {
        begin(){const t=tracker();t?.captureCanvasState?.();t?.squashState?.flush?.();t?.beforeChange?.();},
        end(){tracker()?.afterChange?.();},
    };
}
