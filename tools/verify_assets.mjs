import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base=new URL('../web/vendor/alibaba-puhuiti-3/',import.meta.url);
for(const item of JSON.parse(await readFile(new URL('manifest.json',base),'utf8'))){
    const bytes=await readFile(new URL(item.file,base));
    assert.equal(bytes.length,item.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,item.file);
    console.log('Verified',item.file);
}
await readFile(new URL('LICENSE.txt',base));
await readFile(new URL('../web/vendor/remixicon/LICENSE',import.meta.url));
