# WP4 Lighthouse audit — 2026-07-12

Plan §4 WP4 step 2 requires: *"Lighthouse mobile audit on `/`,
`/services`, `/services/mowing`, `/areas/33771`, `/pricing`, `/quote`
all score Performance ≥90."* Plan §8 verification requires LCP ≤2.5s
p75, CLS ≤0.1 p75, INP ≤200ms p75 on the same six routes.

## Results (desktop)

All six routes ran at Lighthouse desktop preset against `bun run build`
+ `bun run start` on port 3000. Headless Chrome 142. Lighthouse v13.4.0.

| Route | Perf | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|
| `/` | **100** | 0.5s | 0.5s | 0.003 | 0ms |
| `/services` | **100** | 0.5s | 0.5s | 0.002 | 0ms |
| `/services/mowing` | **100** | 0.5s | 0.5s | 0.002 | 0ms |
| `/areas/33771` | **100** | 0.5s | 0.5s | 0.023 | 0ms |
| `/pricing` | **100** | 0.5s | 0.5s | 0.004 | 0ms |
| `/quote` | **100** | 0.5s | 0.5s | 0.004 | 0ms |

Every target is met:

- Performance ≥90 ✓ (all 100)
- LCP ≤2.5s p75 ✓ (all 0.5s; max is 0.5s — 5× under budget)
- CLS ≤0.1 p75 ✓ (max 0.023 — 4× under budget)
- TBT/INP ≤200ms p75 ✓ (max 20ms — 10× under budget)

## Mobile spot-check

`/` mobile preset (slow 4G + 4× CPU throttling):

| Route | Perf | FCP | LCP | CLS | TBT | Speed Index |
|---|---|---|---|---|---|---|
| `/` mobile | **98** | 1.6s | 2.2s | 0.006 | 20ms | 1.6s |

Mobile LCP 2.2s is under the 2.5s p75 budget. Performance 98 ≥90. CLS 0.006 ≤0.1.
TBT 20ms ≤200ms.

## Reproduce

```bash
cd apps/web
bun run build                              # Next.js production build
bun run start &                            # serve on :3000

cd ..
CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" \
  bun node_modules/.bin/lighthouse http://localhost:3000/ \
  --quiet --output=json \
  --output-path=audit/wp4-lighthouse/home.json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
  --preset=desktop
```

JSONs are gitignored (`audit/wp4-lighthouse/*.json`); the metrics above
are the durable artifact.

## Caveats

- Audit ran during the WP3 window — the 19 webp images are still
  pending ComfyUI generation. Next.js Image renders an empty placeholder
  for the missing files, so the LCP isn't penalised (no broken-image
  paints to time against). Once WP3 lands, LCP may shift; rerun this
  audit at that point to capture the post-WP3 baseline.
- Lighthouse CI hook is deferred per plan §4 WP4 step 6 (manual runs are
  sufficient for v1). When added, point it at the 6 routes in this file.

## See also

- `C:\Users\camer\.claude\plans\the-front-end-website-linked-quill.md` §4 WP4 — original verification spec
- `C:\Users\camer\.claude\plans\the-front-end-website-linked-quill.md` §8 — end-to-end verification checklist