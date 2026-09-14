import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { extname, relative, join } from 'node:path';
// Keep the small static site self-contained in a standards-based Worker.
// No storage, user data, runtime secrets or external asset binding is needed.
const root = 'dist/client';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };
const assets = {};
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await collect(path);
    else { const data = await readFile(path); assets['/' + relative(root, path).split('\\').join('/')] = { type: types[extname(path)] || 'application/octet-stream', data: data.toString('base64') }; }
  }
}
await collect(root);
const handler = `
export function serve(request) {
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const asset = assets[path];
  if (!asset) return new Response('Page not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const headers = { 'Content-Type': asset.type, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cache-Control': asset.type.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600' };
  if (request.method === 'HEAD') return new Response(null, { headers });
  let body = Uint8Array.from(atob(asset.data), c => c.charCodeAt(0));
  if (asset.type.startsWith('text/html')) body = new TextDecoder().decode(body).replaceAll('__SITE_ORIGIN__', url.origin.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;'));
  return new Response(body, { headers });
}
export default { fetch: serve };
`;
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', `const assets = ${JSON.stringify(assets)};\n${handler}`);
console.log(`Packaged ${Object.keys(assets).length} static assets into a self-contained Worker.`);
