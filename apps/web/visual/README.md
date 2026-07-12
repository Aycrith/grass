# Visual Regression — Largo Lawn web app

Playwright-based per-PR pixel guard. Lives alongside Lighthouse CI; the two
together cover the visual surface and the headline UX metrics.

## Layout

```
apps/web/visual/
├── README.md                  (this file)
├── routes.spec.ts             (6 PRD-00 §4 routes × 2 viewports = 12 baselines)
├── components.spec.ts         (4 section components, desktop only = 4 baselines)
├── baselines/                  (16 committed PNGs)
│   ├── home-chromium-desktop.png
│   ├── home-chromium-mobile.png
│   ├── hero-cinematic-chromium-desktop.png
│   └── ... (13 more)
├── test-output/                (gitignored — diff + actual PNGs on failure)
└── utils/
    ├── fixtures.ts             (PRD_ROUTES + COMPONENT_BASELINES matrices)
    └── stabilize.ts            (mask volatile content + scroll/settle helpers)
```

The mount surface for component baselines is `app/visual-test/page.tsx`
(`/visual-test`, `robots: noindex`, NOT linked from any nav).

## Running locally

The `playwright.config.ts` `webServer` boots `bun run start` on `:3000` if
nothing is already serving there. From `apps/web/`:

```bash
# All 16 baselines
bunx playwright test

# Only route baselines (12)
bunx playwright test visual/routes.spec.ts

# Only component baselines (4)
bunx playwright test visual/components.spec.ts

# Single route / viewport
bunx playwright test -g "home" --project=chromium-desktop
```

## Updating baselines

When an intentional visual change lands (CSS token shift, component
refactor, image swap):

```bash
bunx playwright test --update-snapshots
git diff visual/baselines/   # review the diff
git add visual/baselines/    # commit the updated PNGs
```

## Thresholds

`maxDiffPixels: 200` + `threshold: 0.2` per `expect.toHaveScreenshot()`.
≈ 0.02% pixel diff at 1280×800. Override per-call when a route is
known-noisier.

## Animations

All captures run with `prefers-reduced-motion: reduce` set on the browser
context. Framer Motion's `useReducedMotion` collapses + CSS
`@media (prefers-reduced-motion: reduce)` queries fire — eliminates
animation jitter in baselines.

## Date drift

`maskVolatileContent(page)` (from `utils/stabilize.ts`) hides:
- `[data-visual-mask="date"]` and `[data-visual-mask="year"]` (opt-in
  per component; footer copyright year is currently NOT tagged, so day-to-day
  diffs will catch the year rollover in early January — `audit/phase-1-visual/SUMMARY.md`
  §3 lists this as a known-volatile surface)
- `.last-updated` (privacy / terms "Last updated" stamp)

## CI

`.github/workflows/ci.yml` runs the `visual` job after `lighthouse`.
Boot pattern is identical to Lighthouse CI (Bun + next start + curl wait
loop). On failure, `*-actual.png` and `*-diff.png` are uploaded as
artifacts.

## When the steward rewires routes

When a production `page.tsx` switches from legacy `globals.css` HTML to
the new `components/sections/` library, route baselines regenerate as a
natural side effect of that change:

```bash
bunx playwright test visual/routes.spec.ts -g "<route-slug>" --update-snapshots
```

The diff IS the change. Review the PNG, commit, push.