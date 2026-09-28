import {socketCompatible} from './creative_canvas_model.mjs';

export {menuItems} from './creative_contract.mjs';

// Read public node definitions, including Comfy's dynamic input templates.
// Opening a menu never constructs nodes or initializes business panels.
export function declaredInputTypes(input={}) {
    return Object.values({...input.required,...input.optional}).flatMap(([type,options={}])=>{
        if(options.socketless||options.hidden)return [];
        if(options.template?.input)return declaredInputTypes(options.template.input);
        return typeof type==='string'?[type]:[];
    });
}
export function canConnectDefinition(definition,side,type) {
    if(!definition)return false;
    return side==='output'
        ? declaredInputTypes(definition.input).some(input=>socketCompatible(type,input))
        : (definition.output||[]).some(output=>socketCompatible(output,type));
}
export function matchingSlot(node,side,type) {
    return side==='output'
        ? (node.inputs||[]).findIndex(p=>!p.widget&&socketCompatible(type,p.type))
        : (node.outputs||[]).findIndex(p=>socketCompatible(p.type,type));
}
