import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distClientDir = path.join(rootDir, 'dist', 'client');

async function serveStaticAsset(url) {
  const pathname = decodeURIComponent(url.pathname);
  const filePath = path.join(distClientDir, pathname === '/' ? 'index.html' : pathname.replace(/^\//, ''));

  if (!filePath.startsWith(distClientDir)) return null;

  try {
    const content = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const typeByExt = {
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml',
      '.json': 'application/json; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    };

    return new Response(content, {
      headers: { 'content-type': typeByExt[ext] ?? 'application/octet-stream' },
    });
  } catch {
    return null;
  }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const asset = await serveStaticAsset(url);
  if (asset) return asset;

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>IBEM</title>
  </head>
  <body>
    <h1>IBEM</h1>
    <p>O site está sendo servido.</p>
  </body>
</html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
