// Receives Strapi's "content changed" call (SITE_REBUILD_WEBHOOK_URL, see
// cms/src/site-rebuild.ts) and runs rebuild.sh. Listens on 127.0.0.1 only, so
// nothing outside the server can trigger it. One build at a time: changes that
// arrive during a build queue exactly one more build afterwards.
// See docs/DEPLOY-PROXMOX.md.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.REBUILD_PORT || 4500);
const SCRIPT = fileURLToPath(new URL('./rebuild.sh', import.meta.url));

let running = false;
let queued = false;

function run(reason) {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  console.log(`[rebuild] starting: ${reason}`);
  const child = spawn('sh', [SCRIPT], { stdio: 'inherit' });
  child.on('exit', (code) => {
    running = false;
    console.log(`[rebuild] finished (exit ${code})`);
    if (queued) {
      queued = false;
      run('changes made during the last build');
    }
  });
}

http
  .createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/rebuild') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 10_000) req.destroy();
      });
      req.on('end', () => {
        let reason = 'request';
        try {
          reason = JSON.parse(body).reason || reason;
        } catch {}
        run(reason);
        res.writeHead(202, { 'content-type': 'application/json' }).end('{"queued":true}');
      });
      return;
    }
    if (req.method === 'GET' && req.url === '/status') {
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ running, queued }));
      return;
    }
    res.writeHead(404).end();
  })
  .listen(PORT, '127.0.0.1', () => console.log(`[rebuild] listening on 127.0.0.1:${PORT}`));
