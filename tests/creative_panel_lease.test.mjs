import test from 'node:test';
import assert from 'node:assert/strict';
import {attachCardPanel} from '../web/creative_canvas_view.mjs';

// Minimal DOM ownership fixture: moving a node detaches it from its old parent.
class Element {
    constructor(tag='div'){this.tag=tag;this.children=[];this.parentNode=null;}
    get isConnected(){return this.tag==='document'||!!this.parentNode?.isConnected;}
    append(child){child.remove();this.children.push(child);child.parentNode=this;}
    remove(){if(this.parentNode){const p=this.parentNode;p.children.splice(p.children.indexOf(this),1);this.parentNode=null;}}
    insertBefore(child,before){child.remove();this.children.splice(this.children.indexOf(before),0,child);child.parentNode=this;}
    replaceWith(child){const p=this.parentNode;if(p){p.insertBefore(child,this);this.remove();}}
    replaceChildren(){for(const child of [...this.children])child.remove();}
    closest(tag){return this.tag===tag?this:this.parentNode?.closest(tag)||null;}
    contains(child){return child===this||this.children.some(c=>c.contains(child));}
    querySelectorAll(){return [];}
}
const card=()=>({body:new Element(),element:new Element(),panel:null,release:null});

const installDocument=t=>{const previous=globalThis.document;globalThis.document={createComment:()=>new Element('comment')};t.after(()=>{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;});};

test('undo/redo rebuilt panels attach before native mount; two instances retain their own content',t=>{
    installDocument(t);
    for(let revision=0;revision<4;revision++){
        const a=card(),b=card(),pa=new Element(),pb=new Element(),inputA=new Element('input'),inputB=new Element('input');
        inputA.value=`A-${revision}`;inputB.value='B';pa.append(inputA);pb.append(inputB);
        assert.equal(pa.isConnected,false);
        assert.equal(attachCardPanel(a,{root:pa}),true);
        assert.equal(attachCardPanel(b,{root:pb}),true);
        assert.equal(a.body.children[0],pa);assert.equal(b.body.children[0],pb);
        assert.equal(pa.children[0].value,`A-${revision}`);assert.equal(pb.children[0].value,'B');
        const release=a.release;assert.equal(attachCardPanel(a,{root:pa}),false);assert.equal(a.release,release);
        a.release();b.release();
        const restoredA=card(),restoredB=card();
        assert.equal(attachCardPanel(restoredA,{root:pa}),true);assert.equal(attachCardPanel(restoredB,{root:pb}),true);
        assert.equal(restoredA.body.children[0].children[0].value,`A-${revision}`);
        assert.equal(restoredB.body.children[0].children[0].value,'B');
    }
});

test('late native mount reacquires the same panel and returns it without duplicate markers',t=>{
    installDocument(t);const native=new Element(),panel=new Element(),c=card();
    native.append(panel);attachCardPanel(c,{root:panel});
    native.append(panel);assert.equal(attachCardPanel(c,{root:panel}),true);
    assert.equal(native.children.length,1);c.release();
    assert.deepEqual(native.children,[panel]);
});

test('does not steal a dialog panel; replacement releases the old owner',t=>{
    installDocument(t);const native=new Element(),old=new Element(),next=new Element(),dialog=new Element('dialog'),c=card();
    assert.equal(attachCardPanel(c,undefined),false);
    native.append(old);attachCardPanel(c,{root:old});dialog.append(next);
    assert.equal(attachCardPanel(c,{root:next}),false);assert.equal(c.panel,old);
    next.remove();assert.equal(attachCardPanel(c,{root:next}),true);
    assert.deepEqual(native.children,[old]);assert.equal(c.body.children[0],next);
});
