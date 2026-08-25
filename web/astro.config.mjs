// @ts-check
import { defineConfig } from 'astro/config';
import redirectMap from './src/data/redirects.json' with { type: 'json' };

// Old-site → new-site redirect map (Working Plan Phase 2.5 / decision 025).
// 203 entries generated from docs/Sherubtse-Content-Audit-v5.xlsx — every
// real URL from www.sherubtse.edu.bt's actual sitemap, classified Move/
// Merge/Retire against the confirmed content model. Never straight to the
// homepage for a Retire (see the audit's own rule) except the one live
// duplicate-homepage URL, which genuinely belongs there.
export default defineConfig({
  redirects: redirectMap,
});
