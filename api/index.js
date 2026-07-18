import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distClientDir = path.join(rootDir, 'dist', 'client');

async function serveStaticAsset(url) {
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const filePath = path.join(distClientDir, relativePath);

  if (!filePath.startsWith(distClientDir)) {
    return null;
  }

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
  const staticResponse = await serveStaticAsset(new URL(req.url));
  if (staticResponse) {
    return staticResponse;
  }

  const { default: serverEntry } = await import('../dist/server/server.js');
  const url = new URL(req.url);
  const request = new Request(`${url.origin}${url.pathname}${url.search}`, {
    method: req.method,
    headers: req.headers,
    body: req.body ? Buffer.from(req.body, 'utf8') : undefined,
  });

  return serverEntry.fetch(request, {}, {});
}
