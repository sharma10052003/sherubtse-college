// Runs a dev server and stops it by itself after a period with no visitors.
//
//   node dev-tools/idle-run.mjs --name Website --port 4321 --minutes 15 --cwd web \
//        --env FOO=bar --run "npm run dev -- --port {inner} --host 127.0.0.1"
//
// It listens on --port (the address you open in the browser) and forwards the traffic to
// the real server, which is started on an inner port ({inner} in the command and in --env
// values is replaced by it; default --port + 10000). Every new web request (GET, POST...)
// counts as activity. Background traffic such as hot-reload pings does not, so a browser
// tab left open does not keep the server alive. After --minutes without a request the
// server and everything it started are stopped and this script exits.
// Local development only: the live server uses systemd/nginx, not this.
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const argv = process.argv.slice(2);
const dashAt = argv.indexOf('--');
const dash = dashAt < 0 ? argv.length : dashAt;
const opts = { env: [], keep: [] };
for (let i = 0; i < dash; i++) {
  const key = argv[i].replace(/^--/, '');
  const val = argv[++i];
  if (key === 'env') opts.env.push(val);
  else if (key === 'keep-while-port') opts.keep.push(Number(val));
  else opts[key] = val;
}
const name = opts.name || 'Server';
const port = Number(opts.port);
const inner = Number(opts.inner || port + 10000);
const minutes = Number(opts.minutes || 15);
const cwd = path.resolve(opts.cwd || '.');
const command = (opts.run || argv.slice(dash + 1).join(' ')).replaceAll('{inner}', String(inner));
if (!command || !port) {
  console.error('Usage: idle-run.mjs [--name N] --port P [--inner I] [--minutes M] [--cwd DIR] [--env K=V]... --run "command"');
  process.exit(2);
}
const env = { ...process.env };
for (const pair of opts.env) {
  const eq = pair.indexOf('=');
  env[pair.slice(0, eq)] = pair.slice(eq + 1).replaceAll('{inner}', String(inner));
}

let last = Date.now();
const touch = () => { last = Date.now(); };
const log = (m) => console.log(`[idle-guard · ${name}] ${m}`);

const child = spawn(command, { cwd, env, shell: true, stdio: 'inherit' });
// Some tools (newer Astro outside an interactive terminal) start the real server in the
// background and exit at once. If the inner port is up after the command exits, keep guarding it.
let background = false;
child.on('exit', (code) => {
  setTimeout(async () => {
    if (code === 0 && (await listening(inner))) {
      background = true;
      log('the server runs in the background: still guarding it');
      return;
    }
    log(`server exited (${code ?? 'stopped'})`);
    process.exit(code ?? 0);
  }, 2500);
});

/** Stops whatever is listening on a port (used when the server runs in the background). */
const killPort = (p) => {
  if (process.platform === 'win32') {
    const out = spawnSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8' }).stdout || '';
    const pids = new Set(out.split('\n').filter((l) => l.includes(`:${p} `) && /LISTENING/.test(l)).map((l) => l.trim().split(/\s+/).pop()));
    pids.forEach((pid) => spawnSync('taskkill', ['/pid', pid, '/T', '/F'], { stdio: 'ignore' }));
  } else {
    spawnSync('sh', ['-c', `lsof -ti :${p} | xargs -r kill`], { stdio: 'ignore' });
  }
};

const killTree = () => {
  if (background) killPort(inner);
  if (child.pid == null) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  else child.kill('SIGTERM');
};

// A new web request starts with its method; WebSocket frames and keep-alive pings do not.
const REQUEST = /^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD) /;
const proxy = net.createServer((client) => {
  const upstream = net.connect(inner, '127.0.0.1');
  client.on('data', (chunk) => { if (REQUEST.test(chunk.subarray(0, 8).toString('latin1'))) touch(); });
  client.pipe(upstream);
  upstream.pipe(client);
  const drop = () => { client.destroy(); upstream.destroy(); };
  client.on('error', drop);
  upstream.on('error', drop);
  client.on('close', drop);
  upstream.on('close', drop);
});
proxy.on('error', (e) => {
  log(e.code === 'EADDRINUSE' ? `port ${port} is already in use: is ${name} already running?` : String(e));
  killTree();
  process.exit(1);
});
proxy.listen(port, () => log(`open http://localhost:${port} · stops after ${minutes} min without visits`));

// --keep-while-port P: never stop while something is listening on P (e.g. Strapi must not
// vanish while the website that reads from it is still running).
const listening = (p) =>
  Promise.all(
    ['127.0.0.1', '::1'].map(
      (host) =>
        new Promise((resolve) => {
          const s = net.connect({ port: p, host, timeout: 1500 });
          s.on('connect', () => { s.destroy(); resolve(true); });
          s.on('timeout', () => { s.destroy(); resolve(false); });
          s.on('error', () => resolve(false));
        }),
    ),
  ).then((r) => r.some(Boolean));

let toldKept = false;
setInterval(async () => {
  if (Date.now() - last <= minutes * 60_000) return;
  for (const p of opts.keep) {
    if (await listening(p)) {
      if (!toldKept) { log(`idle, but port ${p} is still running: staying up`); toldKept = true; }
      return;
    }
  }
  log(`no visits for ${minutes} minutes: stopping`);
  killTree();
  process.exit(0);
}, 20_000).unref?.();
// keep the loop alive (the proxy server does that); stop cleanly with Ctrl+C
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { killTree(); process.exit(0); });
process.on('exit', killTree);
