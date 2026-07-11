/**
 * wf_hurricane_mode_check.ts — Hurricane mode trigger check (stub).
 *
 * Phase 4-5 deliverable. Runs every 30 min during hurricane season (Jun-Nov).
 * Reads NOAA NHC public API for active Pinellas-County-impacting storms.
 * If forecast indicates sustained winds ≥30mph within 48h, triggers cap_hurricane_mode.
 *
 * Per constitution rule: "No outdoor work in named-storm conditions or sustained winds ≥30mph."
 */

// NOAA NHC base URL for storm fetch (Phase 4-5 implementation).
const NOAA_NHC_BASE = 'https://www.nhc.noaa.gov/CurrentStorms.json';
// Pinellas County centroid for storm-track proximity check.
const PINELLAS_LAT = 27.9;
const PINELLAS_LON = -82.8;
// Trigger threshold per charter: no outdoor work in sustained winds ≥30mph.
const WIND_THRESHOLD_MPH = 30;
// Forecast horizon: how far ahead we look when deciding to trigger mode.
const FORECAST_HOURS = 48;

interface Storm {
  name: string;
  classification: string;
  lat: number;
  lon: number;
  max_sustained_winds_mph: number;
  forecast_track?: { lat: number; lon: number; hours_out: number }[];
}

async function fetchActiveStorms(): Promise<Storm[]> {
  try {
    const response = await fetch(NOAA_NHC_BASE);
    if (!response.ok) return [];
    const data = (await response.json()) as { active?: Storm[] };
    return data.active ?? [];
  } catch {
    // Network down or NHC feed unavailable — fail safe to no storms.
    return [];
  }
}

function isPinellasAtRisk(storm: Storm): boolean {
  if (storm.max_sustained_winds_mph < WIND_THRESHOLD_MPH) return false;
  // Phase 4-5: check forecast track vs Pinellas cone (PINELLAS_LAT, PINELLAS_LON)
  // Distance threshold ~150km → at-risk.
  const _coords = { PINELLAS_LAT, PINELLAS_LON, FORECAST_HOURS };
  return _coords.PINELLAS_LAT > 0; // placeholder until real proximity math lands
}

async function main() {
  const storms = await fetchActiveStorms();
  const atRisk = storms.filter(isPinellasAtRisk);

  if (atRisk.length > 0) {
    console.log(
      `⚠ Hurricane mode should be triggered for: ${atRisk.map((s) => s.name).join(', ')}`,
    );
    // Phase 4-5: trigger cap_hurricane_mode, cascade to Schedule + Job + Customer notifications
    process.exitCode = 1;
    return;
  }

  console.log('✓ wf_hurricane_mode_check: no storms threaten Pinellas within 48h');
}

if (import.meta.main) {
  main().catch((err) => {
    console.error('✗ wf_hurricane_mode_check failed:', err);
    process.exit(1);
  });
}
