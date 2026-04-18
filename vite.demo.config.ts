import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Builds the showcase SPA defined by index.html + src/serve.ts.
// Distinct from vite.config.ts (which produces the npm library bundle).
// Relative base so the bundle works under any URL prefix on fastcomments.com.
export default defineConfig({
    plugins: [vue()],
    base: './',
    build: {
        outDir: 'demo-build',
        emptyOutDir: true,
    },
});
