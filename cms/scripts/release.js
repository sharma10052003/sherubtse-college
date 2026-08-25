// Phase 6.4 — automated release build (Working Plan §6.4: "An automated build,
// the redirect list from step 2.5, then the cut-over from old site to new").
// The redirect list is web/src/data/redirects.json (decision 034). This script
// is the "automated build" half: verify Strapi is reachable, build the Astro
// site (which includes the Pagefind index — see web/package.json's build
// script), and report a clear pass/fail with the real page count. It does not
// perform the cut-over itself — that step needs real hosting/DNS access.
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const WEB_DIR = path.join(__dirname, '..', '..', 'web');
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function checkStrapi() {
  try {
    const res = await fetch(`${STRAPI_URL}/admin`, { signal: AbortSignal.timeout(5000) });
    return res.ok || res.status === 302;
  } catch {
    return false;
  }
}

function countBuiltPages(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countBuiltPages(full);
    else if (entry.name === 'index.html') count += 1;
  }
  return count;
}

async function main() {
  console.log('Release check: is Strapi reachable at', STRAPI_URL, '...');
  if (!(await checkStrapi())) {
    console.error(
      `FAILED: Strapi is not reachable at ${STRAPI_URL}. The build needs it running ` +
        `(cd cms && npm run develop, or the production Strapi instance) to fetch real content.`
    );
    process.exitCode = 1;
    return;
  }
  console.log('Strapi is up. Building the Astro site (astro build + pagefind index)...');

  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    execFileSync(npmBin, ['run', 'build'], { cwd: WEB_DIR, stdio: 'inherit', shell: true });
  } catch {
    console.error('FAILED: the build did not complete cleanly. See output above.');
    process.exitCode = 1;
    return;
  }

  const distDir = path.join(WEB_DIR, 'dist');
  const pageCount = countBuiltPages(distDir);
  const pagefindExists = fs.existsSync(path.join(distDir, 'pagefind', 'pagefind.js'));

  console.log(`\nBuild succeeded: ${pageCount} pages in ${distDir}.`);
  console.log(pagefindExists ? 'Pagefind search index: present.' : 'WARNING: Pagefind search index missing.');
  if (!pagefindExists) process.exitCode = 1;
}

main();
