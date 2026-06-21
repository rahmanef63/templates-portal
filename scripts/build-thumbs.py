#!/usr/bin/env python3
"""Regenerate portal card thumbnails from the meta-image set.

The meta-images have each template's TITLE + preview + features baked in, so the
mosaic wall reads without hover. Local dev tool; the resulting .webp are COMMITTED
to public/thumbs/ so the standalone Vercel build needs no sibling assets.

Run:  python3 scripts/build-thumbs.py   (or: pnpm thumbs)
"""
from pathlib import Path
from PIL import Image

PORTAL = Path(__file__).resolve().parents[1]
ROOT = PORTAL.parent  # _templates root holding meta-image/
META = ROOT / "meta-image"
OUT = PORTAL / "public" / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

# slug -> meta-image file (titles baked in; mapped by visual inspection 2026-06-21)
MAP = {
    "personal-brand-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (1).png",
    "agency-studio-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (2).png",
    "konsultan-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (3).png",
    "kreator-studio-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (4).png",
    "riset-kit": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (5).png",
    "saas-marketing-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (6).png",
    "wirausaha-os": "ChatGPT Image Jun 4, 2026, 04_30_15 PM (7).png",
}
W = 1600
missing = []
for slug, fn in MAP.items():
    src = META / fn
    if not src.exists():
        missing.append(fn)
        continue
    im = Image.open(src).convert("RGB")
    h = round(im.height * W / im.width)
    im.resize((W, h), Image.LANCZOS).save(OUT / f"{slug}.webp", "WEBP", quality=82, method=6)
    print(f"thumb  {slug}.webp  {W}x{h}")
print(f"\n{len(MAP) - len(missing)}/{len(MAP)} thumbs built" + (f" — MISSING: {missing}" if missing else " ✓"))
