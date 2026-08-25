// Phase 6.3 — daily backup script (Working Plan §6.3).
// Runs Strapi's own export mechanism (schema + content + media + config) to a
// timestamped archive under cms/backups/. This proves the mechanism works and
// gives a real local artifact — it does NOT by itself satisfy "stored somewhere
// other than the College server", which needs a real off-server destination
// decided by IT Section (see docs/DECISIONS.md #038).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backupsDir = path.join(__dirname, '..', 'backups');
fs.mkdirSync(backupsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outFile = path.join(backupsDir, `strapi-backup-${timestamp}`);

console.log(`Exporting Strapi data to ${outFile}.tar.gz ...`);
// `shell: true` is required on Windows to run the .cmd shim in node_modules/.bin;
// safe here because every argument is a constant or a path this script built itself,
// never user input.
const strapiBin = path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'strapi.cmd' : 'strapi');
execFileSync(strapiBin, ['export', '--no-encrypt', '--file', outFile], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

const stat = fs.statSync(`${outFile}.tar.gz`);
console.log(`Backup complete: ${outFile}.tar.gz (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
