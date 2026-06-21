// Regenerate portal card thumbnails from each template's public/hero.webp.
//
// Local dev tool only: the resulting thumbs are COMMITTED to public/thumbs/, so
// the standalone Vercel build of this repo needs no sibling template repos. Run
// after a template's hero changes:  node scripts/build-thumbs.mjs  (or: pnpm thumbs)
//
// Slugs are read from the SSOT registry (data/templates.ts) so this stays in
// sync automatically. Source = ../<slug>/public/hero.webp in the _templates
// monorepo checkout.
import { readFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const portal = join(here, "..");
const reposRoot = join(portal, ".."); // _templates root holding the sibling templates
const thumbs = join(portal, "public", "thumbs");

const registry = readFileSync(join(portal, "data", "templates.ts"), "utf8");
const slugs = [...registry.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

mkdirSync(thumbs, { recursive: true });
let ok = 0;
const missing = [];
for (const slug of slugs) {
  const src = join(reposRoot, slug, "public", "hero.webp");
  if (!existsSync(src)) {
    missing.push(slug);
    continue;
  }
  copyFileSync(src, join(thumbs, `${slug}.webp`));
  ok++;
  console.log(`thumb  ${slug}.webp`);
}
console.log(
  `\n${ok}/${slugs.length} thumbs built` +
    (missing.length ? ` — missing hero.webp for: ${missing.join(", ")}` : " ✓"),
);
if (missing.length) process.exitCode = 1;
