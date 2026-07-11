# @grass/web — Mission 1 customer-facing web app

Next.js 15 App Router site for GRASS Lawn & Landscape.

## Page taxonomy

```
/                            # Landing — single most-SEO-critical page
/services                    # Services index
/services/mowing             # Mowing detail
/services/edging             # Edging detail
/services/mulching           # Mulching detail
/services/hedge-trimming     # Hedge trimming detail
/services/hurricane-prep     # Hurricane prep detail
/services/seasonal-cleanup   # Seasonal cleanup detail
/areas                       # Service areas index
/areas/33756                 # Area: Belleair / Clearwater
/areas/33770                 # Area: Belleair Bluffs / Largo
/areas/33771                 # Area: Largo Central
/areas/33773                 # Area: Largo East
/areas/33774                 # Area: Ridgecrest
/areas/33778                 # Area: Seminole / Largo West
/pricing                     # Pricing table
/about                       # About / values / licenses
/contact                     # Lead capture form
/gbp                         # GBP landing page (noindex, follow)
/privacy                     # Privacy policy
/terms                       # Terms of service
/api/lead                    # POST endpoint — creates Lead, sends ack
```

**Total: 18 unique pages** + 1 API route.

## Lead capture flow

1. Visitor submits `/contact` form
2. `POST /api/lead` validates input, checks service-area ZIP
3. `@grass/crm-core` `createLead()` persists
4. `@grass/notifications-core` `sendLeadResponse()` dispatches SMS or email
5. PostHog event `lead_captured` fires
6. UI shows inline success message

## GBP strategy

The `/gbp` page exists as the GBP "Website" destination. It is `noindex` (avoids
duplicate-content penalty) but captures any traffic that lands on it directly.
Real ranking power comes from the homepage + service pages.

## Env

```
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SERVICE_AREA=33756,33770,33771,33773,33774,33778
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
RESEND_API_KEY=
```

## Deploy

Vercel (zero-devops). Config in `vercel.json`. CI checks via root
`bun run validate` before each deploy.

## Sitemap

Generate dynamically from `BUSINESS.service_area_zips` + service slugs. Stub
for now; Phase 7 Month-3 work adds `app/sitemap.ts`.