import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'node:fs';
export default defineConfig({
  plugins: [vue(), { name: 'retain-remix-license', generateBundle() {
    this.emitFile({type:'asset', fileName:'licenses/RemixIcon-LICENSE.txt', source:readFileSync(new URL('../web/vendor/remixicon/LICENSE', import.meta.url), 'utf8')});
    for (const name of ['LICENSE.txt','README.md','manifest.json']) this.emitFile({type:'asset',fileName:`licenses/alibaba-puhuiti-3/${name}`,source:readFileSync(new URL(`../web/vendor/alibaba-puhuiti-3/${name}`,import.meta.url),'utf8')});
  }}],
  define: { __BUILD_ID__: JSON.stringify(process.env.BUILD_ID || `phase3-${new Date().toISOString()}`) },
  base: './',
  build: { outDir:'dist', emptyOutDir:true },
});
