import { mkdir, cp, access, constants } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist', 'client');
const publicDir = path.join(rootDir, 'public');

async function copyIfExists(from, to) {
  try {
    await access(from, constants.F_OK);
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true });
  } catch {
    // ignore missing assets
  }
}

await copyIfExists(path.join(distDir, 'assets'), path.join(publicDir, 'assets'));
await copyIfExists(path.join(distDir, 'church.css'), path.join(publicDir, 'church.css'));
await copyIfExists(path.join(distDir, 'favicon.ico'), path.join(publicDir, 'favicon.ico'));
await copyIfExists(path.join(distDir, '_redirects'), path.join(publicDir, '_redirects'));
await copyIfExists(path.join(distDir, '404.html'), path.join(publicDir, '404.html'));
