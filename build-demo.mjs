#!/usr/bin/env node
// Builds the showcase SPA (index.html + src/serve.ts) as static files,
// using vite.demo.config.ts to bypass the npm library build configuration.
import { execSync } from 'node:child_process';
import { rmSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(ROOT, 'demo-dist');

const sh = (cmd, cwd = ROOT) => {
    console.log('$', cmd, `(${cwd})`);
    execSync(cmd, { stdio: 'inherit', cwd });
};

sh('npm ci');
sh('./node_modules/.bin/vite build --config vite.demo.config.ts');

rmSync(OUT, { recursive: true, force: true });
renameSync(resolve(ROOT, 'demo-build'), OUT);
console.log('Built fastcomments-vue-next demo at', OUT);
