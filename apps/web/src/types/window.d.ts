// Window typings
// -----------------------------------------------------------------------------
// 2026-07-31: analytics globals (gtag, fbq, dataLayer, __analyticsConsent)
// were removed at pivot per D-0064 §0.9 (server-side PostHog only).
// History: this file previously declared the GA4 / Meta Pixel transport
// surfaces plus the consent-mode global. Those transports and the consent
// banner are gone; the only analytics fire-path is the server-side PostHog
// `lead_captured` event in `apps/web/src/app/api/lead/route.ts`.
// See `output/plans/RESUMING.md` for the resume posture.
// -----------------------------------------------------------------------------

export {};
