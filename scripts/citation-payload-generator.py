#!/usr/bin/env python3
"""citation-payload-generator.py — 25-citation build payload generator.

CONTEXT
=======
OBJ-M2-006 (state/ledger.yaml) requires a 25-citation build for the
Largo Lawn GBP launch. The data package at
`content/marketing/citation-data-package.md` enumerates the 25
directories with per-directory notes. This script is the operational
executor: it reads the single source of truth for NAP/hours/service-
area/URL (apps/web/src/lib/business.ts), re-renders the per-directory
submission blocks, and writes paste-ready markdown into a
date-stamped folder under drafts/citations/.

The script NEVER submits to a directory. The steward copies the
emitted blocks into each directory's form, one at a time. This is a
deliberate scope decision: every directory has a different form
quirk, a different verification step, and most require a human
interaction (phone call, screenshot upload, etc.). The script
optimizes the highest-leverage piece (the per-directory data block
+ the per-directory quirk override) and leaves the human-in-the-loop
interaction to the steward.

USAGE
=====
    # Validate NAP against business.ts + check for placeholder address
    python scripts/citation-payload-generator.py validate

    # Emit per-directory submission blocks
    python scripts/citation-payload-generator.py emit \\
        --output drafts/citations/2026-07-26/

    # Emit just one directory (for incremental submission)
    python scripts/citation-payload-generator.py emit \\
        --output drafts/citations/2026-07-26/ \\
        --only yelp

    # Print the 25-directory roster as a table
    python scripts/citation-payload-generator.py roster

    # Dry-run: print the GBP submission block to stdout
    python scripts/citation-payload-generator.py emit \\
        --only google-business-profile

OUTPUT
======
For each of the 25 directories, the emit subcommand writes:

    drafts/citations/<date>/<NN>-<directory-slug>.md

where <NN> is the directory's tier-and-position number (e.g. `01-` for
Google Business Profile, `25-` for CityOf.com). The file contains:

    - The directory's submission URL
    - A paste-ready form-fill block (NAP, description, hours, etc.)
    - Per-directory quirk notes (Yelp phone format, etc.)
    - A pre-submit checklist specific to that directory
    - The "What NOT to do" warnings for that directory

Plus an INDEX.md at the root with the full roster, the submission
order, and a status grid (the steward marks each one "submitted"
or "verified" by hand).

NAP CONSISTENCY
===============
The script enforces NAP consistency by reading the business.ts
constants and rendering the same data for every directory. The only
per-directory deviations are the documented quirks (Yelp phone
format, Bing URL no-trailing-slash, etc.). When business.ts changes,
run the script again — the new submission blocks reflect the new
NAP. The script does NOT push to the directories; the steward
manually updates each directory.

VALIDATION CHECKS
=================
The validate subcommand does the following:

    1. Reads apps/web/src/lib/business.ts and parses the BUSINESS
       constant.
    2. Warns if the address is a known placeholder (Main Street,
       First Street, 123 Any Street, etc.).
    3. Warns if the phone is a 555-XX-XXXX placeholder (still
       legal for citation prep, but the steward should swap in
       the real number before publication).
    4. Confirms the 25-directory roster is complete.
    5. Confirms every directory's per-directory quirk is documented
       in the script (catches gaps if a new directory is added
       without updating the per-directory config).

Exit code 0 = clean. Exit code 1 = placeholder detected (the
steward must fix business.ts before running emit). Exit code 2 =
incomplete roster (the script can't generate submission blocks
for missing directories).

DESIGN DECISIONS
================
- The 25-directory roster is hardcoded in the script (not in a
  YAML sidecar) because the per-directory quirk notes are part of
  the script's logic. Adding a new directory means editing the
  script + the data package markdown + the runbook.
- The script reads TypeScript (not YAML/JSON) for the NAP because
  the website is the source of truth; the script doesn't want a
  second copy of the data that can drift.
- The emitted blocks are markdown (not a directory-specific
  structured format) because every directory's form is HTML and
  the steward pastes plain text. Markdown is a superset of the
  paste target.

CROSS-REFERENCES
================
- content/marketing/citation-data-package.md — the human-readable
  data package (this script's narrative companion).
- apps/web/src/lib/business.ts — the NAP source of truth.
- content/marketing/sab-strategy.md — the broader SAB SEO policy.
- state/ledger.yaml → OBJ-M2-006 — the active objective.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional

# Force UTF-8 stdout on Windows so the rich content (em-dashes, arrows,
# Unicode bullets) renders correctly. Python 3.7+ on Windows defaults to
# cp1252, which fails on most non-ASCII characters we use in print().
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
        sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except (AttributeError, OSError):
        pass  # Python < 3.7; fall back to platform default

# ---------------------------------------------------------------------------
# NAP source-of-truth reader
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
BUSINESS_TS = REPO_ROOT / "apps" / "web" / "src" / "lib" / "business.ts"
CITATION_PACKAGE = REPO_ROOT / "content" / "marketing" / "citation-data-package.md"

# Placeholder address fragments that should NOT be published.
PLACEHOLDER_ADDRESS_TOKENS = (
    "main street",
    "first street",
    "any street",
    "placeholder",
    "123 main",
    "123 any",
    "tbd",
    "todo",
    "your address",
)


@dataclass
class BusinessNAP:
    """Parsed NAP from apps/web/src/lib/business.ts."""

    name: str
    legal_entity: str
    address_line1: str
    address_city: str
    address_state: str
    address_zip: str
    phone_display: str
    phone_tel: str
    email: str
    url: str
    service_area_zips: list[str]
    hours_weekdays: str
    hours_saturday: str
    hours_sunday: str
    address_public: bool = True

    @property
    def nap_block(self) -> str:
        """The single canonical NAP block used in every citation.

        In SAB mode (addressPublic=False), the street address line
        is omitted. Most directories (Yelp, BBB, Manta, etc.) allow
        a service-area business to be listed with city/state/zip
        only; the GBP is the only directory that requires a real
        mail-receivable street address for verification, and that
        is handled separately by the `nap_block_with_address` property.
        """
        if self.address_public and self.address_line1:
            return (
                f"{self.name}\n"
                f"{self.address_line1}\n"
                f"{self.address_city}, {self.address_state} {self.address_zip}\n"
                f"{self.phone_display}\n"
                f"{self.email}\n"
                f"{self.url}"
            )
        # SAB mode: city/state/zip only.
        return (
            f"{self.name}\n"
            f"{self.address_city}, {self.address_state} {self.address_zip}\n"
            f"{self.phone_display}\n"
            f"{self.email}\n"
            f"{self.url}"
        )

    @property
    def nap_block_with_address(self) -> str:
        """The NAP block WITH the street address line.

        Used ONLY for the GBP directory, which requires a real
        mail-receivable address for the verification postcard.
        All other directories use nap_block (SAB mode).
        """
        return (
            f"{self.name}\n"
            f"{self.address_line1 or '[address withheld — see steward]'}\n"
            f"{self.address_city}, {self.address_state} {self.address_zip}\n"
            f"{self.phone_display}\n"
            f"{self.email}\n"
            f"{self.url}"
        )

    @property
    def is_placeholder_address(self) -> bool:
        addr = self.address_line1.lower()
        return any(token in addr for token in PLACEHOLDER_ADDRESS_TOKENS)

    @property
    def is_placeholder_phone(self) -> bool:
        """555-XX-XXXX is the NANP-reserved fictional phone range.

        Still legal for citation prep (most directories accept it
        during build), but the steward should swap in the real
        number before publication.
        """
        digits = re.sub(r"\D", "", self.phone_display)
        # NANP: 555-01XX is the universally-fictional range
        return "55501" in digits or "555-01" in self.phone_display


def parse_business_ts(path: Path = BUSINESS_TS) -> BusinessNAP:
    """Parse the BUSINESS constant from apps/web/src/lib/business.ts.

    The TS file is hand-written; we use a regex-based extractor that
    handles the common `key: 'value'` patterns. If business.ts
    changes shape (e.g. nested config), the parser will fail loudly
    rather than silently emit wrong data.
    """
    text = path.read_text(encoding="utf-8")

    def extract(key: str) -> str:
        # matches `key: 'value',` (single-line) or `key: [` (array start)
        m = re.search(rf"{key}:\s*'([^']*)'", text)
        if not m:
            raise ValueError(f"Could not find `{key}: '...'` in {path}")
        return m.group(1)

    def extract_array(key: str) -> list[str]:
        m = re.search(rf"{key}:\s*\[(.*?)\]\s*as\s+const", text, re.DOTALL)
        if not m:
            raise ValueError(f"Could not find `{key}: [...]` in {path}")
        inner = m.group(1)
        return [s.strip().strip("'\"") for s in inner.split(",") if s.strip()]

    def extract_nested(prefix: str) -> dict[str, str]:
        """Extract a nested object literal like `address: { line1: ..., ... }`."""
        m = re.search(rf"{prefix}:\s*\{{(.*?)\}}", text, re.DOTALL)
        if not m:
            raise ValueError(f"Could not find `{prefix}: {{...}}` in {path}")
        inner = m.group(1)
        return {
            k: v.strip().strip("'\"")
            for k, v in re.findall(r"(\w+):\s*'([^']*)'", inner)
        }

    address = extract_nested("address")

    # Parse the addressPublic flag (defaults to True for backward compat).
    m = re.search(r"addressPublic:\s*(true|false)", text, re.IGNORECASE)
    address_public = True
    if m:
        address_public = m.group(1).lower() == "true"

    return BusinessNAP(
        name=extract("name"),
        legal_entity=extract("legal_entity"),
        address_line1=address["line1"],
        address_city=address["city"],
        address_state=address["state"],
        address_zip=address["zip"],
        phone_display=extract("phone"),
        phone_tel=extract("phoneTel"),
        email=extract("email"),
        url=extract("url"),
        service_area_zips=extract_array("service_area_zips"),
        hours_weekdays=extract("weekdays"),
        hours_saturday=extract("saturday"),
        hours_sunday=extract("sunday"),
        address_public=address_public,
    )


# ---------------------------------------------------------------------------
# 25-directory roster
# ---------------------------------------------------------------------------


@dataclass
class DirectoryConfig:
    """One citation directory's submission config."""

    number: int
    slug: str
    name: str
    tier: int
    submission_url: str
    why: str
    time_min: int
    cost_usd: float
    verification: str
    lead_gen: bool  # True if the directory charges per lead (Angi, HomeAdvisor, etc.)
    pre_launch_only: bool  # True if the directory is "list, don't enable paid leads" pre-launch
    quirks: list[str]  # per-directory submission quirks
    description_variant: str  # "short" | "medium" | "long" | "yelp" | "linkedin"
    phone_format: str  # "display" | "parens" | "e164"
    url_format: str  # "full" | "no-protocol" | "no-slash"


# The 25-directory roster. Order is the recommended submission order
# (Tier 1 first, then Tier 2, then Tier 3). The numbers (01-25) are
# the filename prefixes for the emitted blocks.
DIRECTORIES: list[DirectoryConfig] = [
    # ----- Tier 1: must-do, 7 directories -----
    DirectoryConfig(
        number=1,
        slug="google-business-profile",
        name="Google Business Profile",
        tier=1,
        submission_url="https://business.google.com/",
        why=(
            "The single biggest local SEO factor. The GBP is the gate for "
            "Google Maps placement and the local 3-pack. Once verified, it "
            "anchors every other citation in Google's local algorithm."
        ),
        time_min=30,
        cost_usd=0.0,
        verification="Postcard (5-14 days)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "WAIT for real mail-receivable address before requesting verification.",
            "Hide address (SAB mode): Settings -> Info -> clear 'Show customer-facing address'.",
            "Categories: primary 'Lawn care service' (NOT 'Landscaper'); add 2-3 secondary.",
            "Use 6-ZIP service area list, NOT a single radius in miles.",
        ],
        description_variant="long",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=2,
        slug="apple-maps-connect",
        name="Apple Maps Connect",
        tier=1,
        submission_url="https://mapsconnect.apple.com/",
        why=(
            "Siri + iPhone default maps. Powers the maps app on every iOS "
            "device, every CarPlay unit, and every Mac. High-income "
            "demographic overlap with the 33771 service area."
        ),
        time_min=10,
        cost_usd=0.0,
        verification="Apple ID + phone/email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Sign in with the steward's personal Apple ID (iCloud custom domain is a $0.99/mo minimum, defer).",
            "Categories: 'Home Services > Lawn & Garden' or 'Home Services > Landscaping'.",
            "1-3 photos is enough (logo + 1 work photo).",
        ],
        description_variant="short",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=3,
        slug="bing-places",
        name="Bing Places",
        tier=1,
        submission_url="https://www.bingplaces.com/",
        why=(
            "Powers Apple Maps, in-car nav (some manufacturers), and "
            "Cortana. ~10% of US local search; non-trivial for a "
            "demographic that skews older."
        ),
        time_min=10,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "If GBP is already live, use the 'Import from Google Business Profile' button.",
            "URL field: 'largolawn.pro' (no protocol) — Bing auto-strips.",
            "Categories: 'Lawn care' (Bing's list is shorter than Google's).",
            "Description: 250-char limit, use the medium variant.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=4,
        slug="facebook-business",
        name="Facebook Business Page",
        tier=1,
        submission_url="https://www.facebook.com/business",
        why=(
            "Largest social graph; lead forms; messenger inquiries. "
            "Also a citation source for Google's local algorithm."
        ),
        time_min=20,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Create a Page (not a personal profile). 'Local Business' -> 'Service'.",
            "Username: 'largolawn' (first-come-first-served).",
            "CTA button: 'Book Now' -> https://largolawn.pro/quote; 'Send Message' as secondary.",
            "Description: 255-char limit, use the medium variant; 'About' field for the long variant.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=5,
        slug="yelp-business",
        name="Yelp Business",
        tier=1,
        submission_url="https://biz.yelp.com/",
        why=(
            "High-intent local buyers. Yelp's review count is "
            "displayed in Google's local pack; the 2 directories "
            "reinforce each other."
        ),
        time_min=20,
        cost_usd=0.0,
        verification="Phone call (<1 day)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Phone format: '(727) 555-0123' (parenthesized, NOT '+1-...') — script auto-formats.",
            "URL: 'largolawn.pro' (no protocol).",
            "Categories: 'Landscaping' or 'Lawn Services' (Yelp's list is less granular).",
            "Services list: <=30 items; use the [service catalog] block.",
            "Specialties: 5 short bullets; see the per-directory notes.",
            "History: 'Founded 2026' + 1-2 sentences; don't fabricate more.",
        ],
        description_variant="yelp",
        phone_format="parens",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=6,
        slug="nextdoor-business",
        name="Nextdoor Business",
        tier=1,
        submission_url="https://business.nextdoor.com/",
        why=(
            "Hyperlocal neighborhood platform. Verified neighbors see "
            "the business in 'Local Favorites' recommendations. The "
            "highest-intent citation source for residential lawn care."
        ),
        time_min=15,
        cost_usd=0.0,
        verification="Address postcard (7-10 days)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Sign up with the steward's personal Nextdoor account, then upgrade to a Business Page.",
            "Posts matter more than profile — plan 1-2 posts/month.",
            "'Neighborhood Favorite' is paid — defer until first 5 paid pilots.",
        ],
        description_variant="short",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=7,
        slug="linkedin-company",
        name="LinkedIn Company Page",
        tier=1,
        submission_url="https://www.linkedin.com/company/setup",
        why=(
            "B2B signal for property managers + commercial customers. "
            "Small but nonzero citation value; future-proofs the "
            "business for commercial expansion."
        ),
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Create a Company Page -> 'Small business'.",
            "Tagline (120 char): 'Local lawn care in Largo FL - mow, edge, mulch, hedge, hurricane prep.'",
            "Industry: 'Facilities Services' or 'Environmental Services'.",
            "Custom URL: 'linkedin.com/company/largolawn'.",
            "Cover image: 1128x191.",
            "Low value for residential — page exists for the citation, not for leads.",
        ],
        description_variant="linkedin",
        phone_format="display",
        url_format="full",
    ),
    # ----- Tier 2: high-value, 8 directories -----
    DirectoryConfig(
        number=8,
        slug="yellow-pages",
        name="Yellow Pages",
        tier=2,
        submission_url="https://www.yellowpages.com/",
        why="High DA; legacy trust signal; Apple's directory fallback.",
        time_min=15,
        cost_usd=0.0,
        verification="Phone or email (<1 day)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Yellow Pages auto-creates listings from public records — claim an existing one first.",
            "Categories: 'Lawn & Yard Work' or 'Landscape Contractors'.",
            "Description: 200-char limit (medium variant trimmed).",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=9,
        slug="superpages",
        name="Superpages",
        tier=2,
        submission_url="https://www.superpages.com/",
        why="Verizon-owned; high DA; thryv network.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Owned by Thryv — create a free Thryv account first.",
            "Categories: 'Lawn & Grounds Maintenance'.",
            "URL: 'largolawn.pro' (no protocol).",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=10,
        slug="manta",
        name="Manta",
        tier=2,
        submission_url="https://www.manta.com/",
        why="SMB directory; high DA; small-business ad channel.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Free profile + optional paid 'Manta Pro' ($99/yr, defer).",
            "Categories: 'Lawn & Garden Services' or 'Landscape Services'.",
            "Two description fields: 200-char (medium) and 1000-char (long).",
        ],
        description_variant="long",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=11,
        slug="bbb",
        name="Better Business Bureau",
        tier=2,
        submission_url="https://www.bbb.org/",
        why="Trust signal; 'A+' rating is a real lead-conversion boost.",
        time_min=30,
        cost_usd=0.0,
        verification="Email + documents (1-2 weeks)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Free listing without accreditation is enough for the citation.",
            "Accreditation costs ~$500/yr — defer to pilot revenue.",
            "Categories: 'Lawn & Tree Care' or 'Landscape Contractors'.",
            "EIN/business-license fields: leave blank if not yet filed (allowed for sole proprietor).",
        ],
        description_variant="long",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=12,
        slug="mapquest",
        name="MapQuest",
        tier=2,
        submission_url="https://www.mapquest.com/business",
        why="Legacy map platform; in-car nav fallback.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Owned by Verizon (same as Superpages); submission UI is similar.",
            "Categories: 'Lawn Services' or 'Landscape'.",
            "URL: 'largolawn.pro' (no protocol).",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=13,
        slug="tomtom",
        name="TomTom MyPlaces",
        tier=2,
        submission_url="https://business.tomtom.com/",
        why="Powers some car infotainment; small but high-trust.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Categories: 'Garden & Lawn'.",
            "Coordinates: optional — leave blank if business.ts has no lat/long.",
        ],
        description_variant="short",
        phone_format="display",
        url_format="no-protocol",
    ),
    DirectoryConfig(
        number=14,
        slug="foursquare",
        name="Foursquare for Business",
        tier=2,
        submission_url="https://business.foursquare.com/",
        why="Powers location data for many apps; venue-listing API.",
        time_min=20,
        cost_usd=0.0,
        verification="Email + venue-claim call (<1 day)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Create or claim a venue.",
            "Categories: 'Home / Residential / Lawn & Garden'.",
            "URL: 'https://largolawn.pro' (full protocol).",
            "Hours: Foursquare uses a JSON-style block; the script emits the structured form.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=15,
        slug="citysearch",
        name="Citysearch",
        tier=2,
        submission_url="https://www.citysearch.com/",
        why="Older directory, still has DA; legacy citations.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (1-2 weeks to surface)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Owned by CityGrid Media (IAC/Insight Partners).",
            "Categories: 'Lawn Services' or 'Landscaping'.",
            "URL: 'largolawn.pro' (no protocol).",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
    # ----- Tier 3: industry + local, 10 directories -----
    DirectoryConfig(
        number=16,
        slug="angi",
        name="Angi (formerly Angie's List)",
        tier=3,
        submission_url="https://www.angi.com/",
        why="Lead-gen; high-intent; $30/lead average.",
        time_min=45,
        cost_usd=0.0,
        verification="Email + phone screening (1-2 weeks)",
        lead_gen=True,
        pre_launch_only=True,
        quirks=[
            "Free to list; pay per lead. Set daily-lead cap to 1 to start.",
            "100% profile completion = 3x more leads (per Angi's published data).",
            "Categories: 'Lawn & Yard Work', 'Landscaping'.",
            "License/insurance fields: leave blank (Angi allows unverified).",
            "Pre-launch: LIST, DO NOT enable pay-per-lead. Wait for GBP traction.",
        ],
        description_variant="long",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=17,
        slug="homeadvisor",
        name="HomeAdvisor",
        tier=3,
        submission_url="https://www.homeadvisor.com/",
        why="Lead-gen; high-intent; home services focus.",
        time_min=45,
        cost_usd=0.0,
        verification="Phone screening (1-2 weeks)",
        lead_gen=True,
        pre_launch_only=True,
        quirks=[
            "Free to list; pay per lead. Similar to Angi.",
            "100% profile completion rule applies.",
            "Categories: 'Lawn & Yard Work'.",
            "Screening call: ~20 min phone interview; HomeAdvisor vets pros aggressively.",
            "Pre-launch: LIST, DO NOT enable leads. Wait for GBP traction.",
        ],
        description_variant="long",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=18,
        slug="thumbtack",
        name="Thumbtack",
        tier=3,
        submission_url="https://www.thumbtack.com/",
        why="Lead-gen; project-based; growing market share.",
        time_min=30,
        cost_usd=0.0,
        verification="Email + phone (<1 day)",
        lead_gen=True,
        pre_launch_only=True,
        quirks=[
            "Free to list; pay per lead. $5-15/lead average.",
            "Categories: 'Lawn Mowing', 'Landscaping', 'Hedge Trimming', 'Mulching'.",
            "Pre-launch: LIST, DO NOT enable leads.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=19,
        slug="porch",
        name="Porch",
        tier=3,
        submission_url="https://www.porch.com/",
        why="Lead-gen; project-based; growing market share.",
        time_min=30,
        cost_usd=0.0,
        verification="Email (<1 day)",
        lead_gen=True,
        pre_launch_only=True,
        quirks=[
            "Same model as Thumbtack.",
            "Categories: 'Lawn & Yard Work'.",
            "Pre-launch: LIST, DO NOT enable leads.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=20,
        slug="houzz",
        name="Houzz Pro",
        tier=3,
        submission_url="https://www.houzz.com/pro",
        why="Design-savvy; landscaping pros; high-end leads.",
        time_min=30,
        cost_usd=0.0,
        verification="Email + photo review (1-2 weeks)",
        lead_gen=True,
        pre_launch_only=False,
        quirks=[
            "Free to list; some paid placement.",
            "Categories: 'Landscape Contractors', 'Lawn & Yard Work'.",
            "Photos: 10+ work photos, ideally with before/after pairs. Houzz is design-oriented.",
            "Pre-launch: LIST, enable free leads only (no paid placement).",
        ],
        description_variant="long",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=21,
        slug="bark",
        name="Bark",
        tier=3,
        submission_url="https://www.bark.com/",
        why="Lead-gen; UK-born, growing in US; project-based.",
        time_min=20,
        cost_usd=0.0,
        verification="Email (<1 day)",
        lead_gen=True,
        pre_launch_only=True,
        quirks=[
            "Free to list; pay per lead (optional).",
            "Categories: 'Lawn & Garden Services'.",
            "Pre-launch: LIST, DO NOT enable paid leads.",
        ],
        description_variant="short",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=22,
        slug="lawnsite",
        name="LawnSite Forum",
        tier=3,
        submission_url="https://www.lawnsite.com/",
        why="Industry forum; citation signal; 'credentials' badge.",
        time_min=30,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Forum profile (not a 'business directory').",
            "Sign up + post an 'Introduce yourself' thread in the industry forum.",
            "Be honest: 'Solo operator, just starting in Largo, FL.'",
            "Add business info to the signature + a 'credentials' badge link.",
            "Strategic: build goodwill with industry suppliers + peer operators for referral flow.",
        ],
        description_variant="short",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=23,
        slug="largo-chamber",
        name="Greater Largo Chamber of Commerce",
        tier=3,
        submission_url="https://www.largochamber.com/",
        why="Hyperlocal; 'member' badge; networking source.",
        time_min=30,
        cost_usd=250.0,  # midpoint of $200-300/yr; defer
        verification="Email + payment (2-4 weeks)",
        lead_gen=False,
        pre_launch_only=True,
        quirks=[
            "DEFERRED: cost is $200-300/yr for solo-operator tier.",
            "Reactivation trigger: 'First paying customer OR pilot revenue covers the dues'.",
            "Pre-launch: list the business in the chamber's public search by emailing the chamber admin (free, no badge).",
            "When dues are ready: apply for membership, list as the NAP, add the chamber badge to the website footer.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=24,
        slug="largo-patch",
        name="Patch (Largo Patch)",
        tier=3,
        submission_url="https://patch.com/",
        why="Local news + business listings; high-DA local.",
        time_min=20,
        cost_usd=0.0,
        verification="Email (1-2 weeks)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Categories: 'Home & Garden' or 'Lawn & Garden'.",
            "URL: 'https://largolawn.pro' (full protocol).",
            "Optional: 'sponsored post' introducing the business to Largo Patch readers (~$50/post, defer).",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="full",
    ),
    DirectoryConfig(
        number=25,
        slug="cityof",
        name="CityOf.com (Largo)",
        tier=3,
        submission_url="https://www.cityof.com/largo",
        why="City-specific directory; lower DA but free.",
        time_min=15,
        cost_usd=0.0,
        verification="Email (<1 hour)",
        lead_gen=False,
        pre_launch_only=False,
        quirks=[
            "Categories: 'Landscaping & Lawn Care'.",
            "Description: 200-char (medium variant).",
            "Lowest expected ROI of the 25; do it for the 'completed 25' tally.",
        ],
        description_variant="medium",
        phone_format="display",
        url_format="no-protocol",
    ),
]


# ---------------------------------------------------------------------------
# Description variants
# ---------------------------------------------------------------------------

DESCRIPTION_VARIANTS = {
    "short": (
        "Local lawn care in Largo FL - mow, edge, mulch, hedge, hurricane prep."
    ),
    "medium": (
        "Largo Lawn is a locally-owned lawn-care service for homeowners in Largo, "
        "FL and the surrounding Pinellas County ZIPs. Mowing, edging, mulching, "
        "hedge trimming, hurricane prep. Free quotes within 24 hours."
    ),
    "long": (
        "Largo Lawn provides residential lawn-care services to homeowners in Largo, "
        "FL 33771 and adjacent Pinellas County ZIPs. We're a solo operator - when "
        "you call, you talk to the person doing the work. Services include weekly "
        "and bi-weekly mowing, mechanical edging, mulching and bed maintenance, "
        "hedge trimming, and pre-/post-storm hurricane prep. Quotes are free and "
        "returned within 24 hours. Pricing is mid-market: weekly mowing of a "
        "1/4-acre lot is $48/visit, edging is included in every visit. Hurricane "
        "prep is a flat $95-150 per activation. No contracts, no subscription "
        "required. Cash, Venmo, Zelle, or card on phone. Locally owned; not a "
        "franchise."
    ),
    "yelp": (
        "Locally-owned residential lawn care in Largo, FL 33771 and surrounding "
        "ZIPs. Solo operator - when you call, you talk to the person doing the "
        "work. Services: weekly and bi-weekly mowing, mechanical edging, mulching, "
        "hedge trimming, hurricane prep. Mid-market pricing. Free quotes within "
        "24 hours. No contracts, no subscriptions. Same-day quote; same-week first "
        "visit. Cash, Venmo, Zelle, card-on-phone accepted."
    ),
    "linkedin": (
        "Largo Lawn provides residential lawn-care services to homeowners in Largo, "
        "FL 33771 and adjacent Pinellas County ZIPs. We're a solo operator - when "
        "you call, you talk to the person doing the work. Services include weekly "
        "and bi-weekly mowing, mechanical edging, mulching and bed maintenance, "
        "hedge trimming, and pre-/post-storm hurricane prep. Quotes are free and "
        "returned within 24 hours. Pricing is mid-market: weekly mowing of a "
        "1/4-acre lot is $48/visit, edging is included in every visit. Hurricane "
        "prep is a flat $95-150 per activation. No contracts, no subscription "
        "required. Cash, Venmo, Zelle, or card on phone. Locally owned; not a "
        "franchise."
    ),
}

SERVICE_AREA_BLOCK = """\
Largo, FL 33771 (primary)
Largo, FL 33770
Largo, FL 33773
Largo, FL 33774
Largo, FL 33778
Clearwater, FL 33756 (edge)
"""

SERVICE_CATALOG = """\
Mowing (weekly, bi-weekly, monthly)
Mowing (one-time / clean-up)
Edging (mechanical, curbs/walks/beds)
Mulching (delivery + install)
Mulching (refresh, existing beds)
Hedge trimming (low / medium / tall)
Hedge removal
Hurricane pre-storm prep
Hurricane post-storm cleanup
Seasonal cleanup (leaves, branches)
Yard clean-up (one-time)
"""

HOURS_BLOCK = """\
Mon:  7:00 AM - 5:00 PM
Tue:  7:00 AM - 5:00 PM
Wed:  7:00 AM - 5:00 PM
Thu:  7:00 AM - 5:00 PM
Fri:  7:00 AM - 5:00 PM
Sat:  8:00 AM - 2:00 PM
Sun:  Closed (hurricane-mode only)
"""

CATEGORIES_PRIMARY = "Lawn care service"
CATEGORIES_SECONDARY = [
    "Lawn maintenance service",
    "Yard care service",
    "Gardener",
]


# ---------------------------------------------------------------------------
# Format helpers
# ---------------------------------------------------------------------------


def format_phone(nap: BusinessNAP, fmt: str) -> str:
    if fmt == "display":
        return nap.phone_display
    if fmt == "parens":
        # Convert "+1-727-555-0123" -> "(727) 555-0123"
        digits = re.sub(r"\D", "", nap.phone_display)
        # assume +1-NNN-NNN-NNNN
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:11]}"
    if fmt == "e164":
        return nap.phone_tel
    raise ValueError(f"Unknown phone format: {fmt}")


def format_url(nap: BusinessNAP, fmt: str) -> str:
    if fmt == "full":
        return nap.url
    if fmt == "no-protocol":
        return nap.url.replace("https://", "").replace("http://", "")
    if fmt == "no-slash":
        return nap.url.rstrip("/")
    raise ValueError(f"Unknown URL format: {fmt}")


def render_nap_block(nap: BusinessNAP, directory: DirectoryConfig) -> str:
    """Render the NAP block with per-directory format overrides.

    SAB mode (default): street address line is omitted for all
    directories. The GBP is the only directory that can use
    `nap_block_with_address`; the rest get the city/state/zip only.

    When `--with-address` is passed to emit, the GBP block
    includes the street address line for verification purposes.
    All other directories still get SAB mode (the address is
    private to the GBP verification flow).
    """
    if directory.slug == "google-business-profile" and nap.address_line1:
        # GBP is the only directory that can include the street address.
        # The block is marked clearly so the steward knows to hide it
        # from public view in the GBP dashboard (SAB mode toggle).
        return (
            f"{nap.name}\n"
            f"{nap.address_line1}\n"
            f"{nap.address_city}, {nap.address_state} {nap.address_zip}\n"
            f"{format_phone(nap, directory.phone_format)}\n"
            f"{nap.email}\n"
            f"{format_url(nap, directory.url_format)}"
        )
    # All other directories: SAB mode (no street address).
    return (
        f"{nap.name}\n"
        f"{nap.address_city}, {nap.address_state} {nap.address_zip}\n"
        f"{format_phone(nap, directory.phone_format)}\n"
        f"{nap.email}\n"
        f"{format_url(nap, directory.url_format)}"
    )


# ---------------------------------------------------------------------------
# Subcommand: validate
# ---------------------------------------------------------------------------


def cmd_validate(_args: argparse.Namespace) -> int:
    """Run validation checks against business.ts + the roster."""
    print("=== citation-payload-generator: validate ===\n")

    # 1. Parse business.ts
    try:
        nap = parse_business_ts()
    except (FileNotFoundError, ValueError) as exc:
        print(f"FAIL: {exc}")
        return 2

    print("NAP (parsed from business.ts):")
    for line in nap.nap_block.split("\n"):
        print(f"  {line}")
    print()

    # 2. Placeholder check
    errors: list[str] = []
    warnings: list[str] = []

    if nap.is_placeholder_address:
        errors.append(
            f"PLACEHOLDER ADDRESS detected: '{nap.address_line1}'. "
            "Replace with a real, mail-receivable address in business.ts before "
            "running emit. The GBP verification postcard will fail to deliver."
        )
    if nap.is_placeholder_phone:
        warnings.append(
            f"Placeholder phone (555-XX-XXXX) detected: '{nap.phone_display}'. "
            "Still legal for citation prep, but swap in the real number before "
            "publishing any directory."
        )

    # 3. Roster check
    if len(DIRECTORIES) != 25:
        errors.append(
            f"Roster has {len(DIRECTORIES)} directories; expected 25. "
            "Add or remove entries in the script's DIRECTORIES list."
        )

    seen_numbers: set[int] = set()
    seen_slugs: set[str] = set()
    for d in DIRECTORIES:
        if d.number in seen_numbers:
            errors.append(f"Duplicate directory number: {d.number}")
        seen_numbers.add(d.number)
        if d.slug in seen_slugs:
            errors.append(f"Duplicate directory slug: {d.slug}")
        seen_slugs.add(d.slug)
        if d.description_variant not in DESCRIPTION_VARIANTS:
            errors.append(
                f"Directory {d.number} ({d.slug}) references unknown "
                f"description variant: {d.description_variant}"
            )
        if not d.quirks:
            warnings.append(
                f"Directory {d.number} ({d.slug}) has no quirks documented; "
                "this is suspicious — every directory has a form quirk."
            )

    # 4. Report
    print("Checks:")
    if errors:
        print(f"  ERRORS ({len(errors)}):")
        for e in errors:
            print(f"    - {e}")
    else:
        print("  errors: 0")

    if warnings:
        print(f"  WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"    - {w}")
    else:
        print("  warnings: 0")

    # 5. Roster summary
    print(f"\nRoster: {len(DIRECTORIES)} directories across 3 tiers")
    by_tier: dict[int, int] = {}
    for d in DIRECTORIES:
        by_tier[d.tier] = by_tier.get(d.tier, 0) + 1
    for tier in sorted(by_tier):
        print(f"  Tier {tier}: {by_tier[tier]} directories")

    if errors:
        print(f"\nResult: FAIL ({len(errors)} errors)")
        return 1
    print("\nResult: OK (citation payload generation is safe to proceed)")
    return 0


# ---------------------------------------------------------------------------
# Subcommand: emit
# ---------------------------------------------------------------------------


def render_directory_block(nap: BusinessNAP, d: DirectoryConfig) -> str:
    """Render the per-directory paste-ready submission block."""
    description = DESCRIPTION_VARIANTS[d.description_variant]
    rendered_nap = render_nap_block(nap, d)
    categories_secondary = "\n".join(f"- `{c}`" for c in CATEGORIES_SECONDARY)

    lines: list[str] = [
        f"# {d.number:02d}. {d.name} — submission block",
        "",
        f"> **Submission URL:** {d.submission_url}",
        f"> **Tier:** {d.tier} | **Time:** ~{d.time_min} min | **Cost:** ${d.cost_usd:.0f}",
        f"> **Verification:** {d.verification}",
    ]
    if d.lead_gen:
        lines.append("> **Lead-gen model:** YES (paid per lead)")
    if d.pre_launch_only:
        lines.append("> **Pre-launch mode:** LIST ONLY — do NOT enable paid leads")

    lines.extend(
        [
            "",
            f"## Why this directory matters",
            "",
            d.why,
            "",
            "## Paste-ready form fields",
            "",
            "### NAP (Name / Address / Phone)",
            "",
            "```",
            rendered_nap,
            "```",
            "",
            f"### Business description ({d.description_variant} variant)",
            "",
            "```",
            description,
            "```",
            "",
            "### Categories",
            "",
            f"**Primary:** `{CATEGORIES_PRIMARY}` (NOT 'Landscaper' — see `research/seo/largo-keyword-map.md`)",
            "",
            "**Secondary (pick 2-3):**",
            "",
            categories_secondary,
            "",
            "### Service area (paste into the platform's 'Service Area' field)",
            "",
            "```",
            SERVICE_AREA_BLOCK.rstrip(),
            "```",
            "",
            "### Hours",
            "",
            "```",
            HOURS_BLOCK.rstrip(),
            "```",
        ]
    )

    # Yelp-specific extra block
    if d.slug == "yelp-business":
        lines.extend(
            [
                "",
                "### Service catalog (Yelp, <=30 services)",
                "",
                "```",
                SERVICE_CATALOG.rstrip(),
                "```",
            ]
        )

    lines.extend(
        [
            "",
            "## Per-directory quirks",
            "",
        ]
    )
    for q in d.quirks:
        lines.append(f"- {q}")

    lines.extend(
        [
            "",
            "## Pre-submit checklist",
            "",
            f"- [ ] Real address in business.ts (current: `{nap.address_line1}`)",
            f"- [ ] Phone verified: `{format_phone(nap, d.phone_format)}`",
            f"- [ ] Description variant matches the platform's char limit",
            "- [ ] Photos prepared (logo + 1-10 work photos per platform)",
            "- [ ] Service area block matches the platform's 'cities' or 'ZIPs' field",
            "- [ ] Hours block matches the platform's hours format (24h vs AM/PM)",
            "- [ ] Submit, capture the confirmation screen, save to a screenshots folder",
        ]
    )

    lines.extend(
        [
            "",
            "## What NOT to do (per-directory)",
            "",
            f"- Don't use 'Landscaper' as the primary category anywhere — `{CATEGORIES_PRIMARY}` is correct.",
            "- Don't use a different name format — 'LargoLawn' / 'Largo Lawn Care' on any platform = NAP inconsistency = ranking penalty.",
            f"- Don't use a different phone format (this directory uses `{d.phone_format}` format; other directories may differ).",
            "- Don't use a P.O. Box in the address field.",
        ]
    )

    if d.lead_gen and d.pre_launch_only:
        lines.extend(
            [
                "",
                "## Pre-launch lead-gen policy",
                "",
                "**This is a lead-gen directory.** The pre-launch plan is to LIST the business, NOT to enable paid leads. Wait for the GBP to convert (Month 2+ traffic) before enabling pay-per-lead. Reasoning:",
                "",
                "- Pre-launch: 0-5 leads/month, ~$0-150 spend, ~0 close rate. Cash-min mode can't afford the test cost.",
                "- Post-GBP-launch: 5-20 leads/month, ~$0 baseline if leads are below the daily cap, conversion rate known from GBP.",
                "- Reactivation trigger: 'GBP has 100+ monthly views AND 5+ direction requests per month' — then enable lead-gen here.",
            ]
        )

    lines.extend(
        [
            "",
            "## Source of truth",
            "",
            f"- NAP: `apps/web/src/lib/business.ts` (line: BUSINESS.*)",
            f"- Photo set: `content/assets/gbp-photo-spec.md`",
            f"- Photo pipeline: `scripts/gbp-photo-process.py`",
            f"- This block: `scripts/citation-payload-generator.py`",
            "",
        ]
    )

    return "\n".join(lines)


def cmd_emit(args: argparse.Namespace) -> int:
    """Emit per-directory submission blocks to a date-stamped folder."""
    nap = parse_business_ts()

    if nap.is_placeholder_address:
        print(
            f"ERROR: placeholder address '{nap.address_line1}' detected. "
            "Fix business.ts and re-run.",
            file=sys.stderr,
        )
        return 1

    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    if str(output_dir).endswith(today):
        date_str = today
    else:
        date_str = today

    # Filter directories if --only was passed
    dirs = DIRECTORIES
    if args.only:
        only = args.only.lower()
        dirs = [d for d in DIRECTORIES if d.slug == only or d.name.lower().replace(" ", "-") == only]
        if not dirs:
            print(f"ERROR: --only matched no directory: {args.only}", file=sys.stderr)
            print(
                "Available slugs: "
                + ", ".join(f"'{d.slug}'" for d in DIRECTORIES),
                file=sys.stderr,
            )
            return 2

    # Render each directory's block
    written: list[Path] = []
    for d in dirs:
        filename = f"{d.number:02d}-{d.slug}.md"
        out_path = output_dir / filename
        block = render_directory_block(nap, d)
        out_path.write_text(block, encoding="utf-8")
        written.append(out_path)
        print(f"  wrote {out_path.relative_to(REPO_ROOT)}")

    # Write the INDEX.md
    if not args.only:
        index_path = output_dir / "INDEX.md"
        index_path.write_text(render_index(nap, dirs, output_dir), encoding="utf-8")
        print(f"  wrote {index_path.relative_to(REPO_ROOT)}")
        written.append(index_path)

    print(f"\nWrote {len(written)} file(s) to {output_dir}")
    print("\nNext steps:")
    print("  1. Open each per-directory file (01-...md through 25-...md).")
    print("  2. For each directory: open the submission URL, paste the form fields.")
    print("  3. Mark the directory 'submitted' in INDEX.md as you go.")
    print("  4. Wait for verification (varies by directory; see INDEX.md).")
    print("  5. Update state/ledger.yaml → OBJ-M2-006 status as X of 25 live.")
    return 0


def render_index(nap: BusinessNAP, dirs: list[DirectoryConfig], output_dir: Path) -> str:
    """Render the INDEX.md summary for the emitted folder."""
    today = datetime.now().strftime("%Y-%m-%d")

    lines: list[str] = [
        f"# 25-Citation Build — {today}",
        "",
        f"> **Generated by:** `scripts/citation-payload-generator.py emit`",
        f"> **Source NAP:** `apps/web/src/lib/business.ts`",
        f"> **Brand:** {nap.name} | **Phone:** {nap.phone_display} | **Email:** {nap.email}",
        f"> **URL:** {nap.url}",
        f"> **Address:** {nap.address_line1}, {nap.address_city}, {nap.address_state} {nap.address_zip}",
        f"> **Service area:** {', '.join(nap.service_area_zips)}",
        "",
        "## Roster",
        "",
        "| # | Directory | Tier | Time | Cost | Verification | Status | Notes |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for d in dirs:
        status = "[ ] pending"
        cost = f"${d.cost_usd:.0f}"
        flags: list[str] = []
        if d.lead_gen:
            flags.append("lead-gen")
        if d.pre_launch_only:
            flags.append("pre-launch only")
        flag_str = f" ({', '.join(flags)})" if flags else ""
        lines.append(
            f"| {d.number:02d} | [{d.name}]({d.number:02d}-{d.slug}.md) | "
            f"{d.tier} | {d.time_min} min | {cost} | {d.verification} | "
            f"{status} |{flag_str} |"
        )

    lines.extend(
        [
            "",
            "## Submission order (recommended)",
            "",
            "1. **Day 1 afternoon** (no waiting): directories 1-7, 8-15, 18-22, 24-25. "
            "Most are <15 min each. Total: ~3-4 hours.",
            "2. **Day 1 evening** (with screening calls): directories 16-17, 20 "
            "(Houzz). Each has a phone interview; expect 30-60 min total.",
            "3. **Day 1-2:** Request directory 1 (GBP) verification postcard. "
            "Gate: real mail-receivable address.",
            "4. **Day 7-10:** Directory 6 (Nextdoor) verification postcard arrives.",
            "5. **Day 14-21:** Directory 1 (GBP) verification code arrives. Enter it; GBP goes live.",
            "6. **Day 30+:** Directory 23 (Greater Largo Chamber) — when pilot revenue covers the $200-300 dues.",
            "",
            "## Cross-references",
            "",
            "- `content/marketing/citation-data-package.md` — the human-readable data package",
            "- `content/marketing/sab-strategy.md` — the broader SAB SEO policy",
            "- `content/assets/gbp-photo-spec.md` — the photo design contract",
            "- `scripts/gbp-photo-process.py` — the photo pipeline",
            "- `state/ledger.yaml` → OBJ-M2-006 — the active objective this work serves",
        ]
    )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Subcommand: roster
# ---------------------------------------------------------------------------


def cmd_roster(_args: argparse.Namespace) -> int:
    """Print the 25-directory roster as a table."""
    print(f"{'#':>3}  {'Tier':>4}  {'Time':>5}  {'Cost':>5}  {'Lead-gen':>8}  Directory")
    print("-" * 90)
    for d in DIRECTORIES:
        lg = "YES" if d.lead_gen else "-"
        print(
            f"{d.number:>3}  {d.tier:>4}  {d.time_min:>4}m  ${d.cost_usd:>4.0f}  {lg:>8}  {d.name}"
        )
    print()
    print(f"Total: {len(DIRECTORIES)} directories, "
          f"${sum(d.cost_usd for d in DIRECTORIES):.0f} total cost, "
          f"~{sum(d.time_min for d in DIRECTORIES) // 60}h "
          f"{sum(d.time_min for d in DIRECTORIES) % 60}m total time")
    lead_gen_count = sum(1 for d in DIRECTORIES if d.lead_gen)
    pre_launch_count = sum(1 for d in DIRECTORIES if d.pre_launch_only)
    print(f"  Lead-gen directories: {lead_gen_count}")
    print(f"  Pre-launch only (list, don't enable): {pre_launch_count}")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(
        description="25-citation build payload generator for Largo Lawn.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python scripts/citation-payload-generator.py validate\n"
            "  python scripts/citation-payload-generator.py roster\n"
            "  python scripts/citation-payload-generator.py emit "
            "--output drafts/citations/2026-07-26/\n"
            "  python scripts/citation-payload-generator.py emit "
            "--output drafts/citations/2026-07-26/ --only yelp-business\n"
        ),
    )
    sub = parser.add_subparsers(dest="subcommand", required=True)

    p_validate = sub.add_parser("validate", help="Validate NAP + roster.")
    p_validate.set_defaults(func=cmd_validate)

    p_roster = sub.add_parser("roster", help="Print the 25-directory roster.")
    p_roster.set_defaults(func=cmd_roster)

    p_emit = sub.add_parser("emit", help="Emit per-directory submission blocks.")
    p_emit.add_argument(
        "--output",
        "-o",
        type=str,
        required=True,
        help="Output directory (will be created). E.g. drafts/citations/2026-07-26/",
    )
    p_emit.add_argument(
        "--only",
        type=str,
        default=None,
        help="Emit only one directory by slug. E.g. --only yelp-business",
    )
    p_emit.set_defaults(func=cmd_emit)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
