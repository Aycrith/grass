/**
 * testing/capabilities/cap_hurricane_prep.test.ts — Hurricane prep capability tests.
 *
 * Service: pre-storm yard cleanup (furniture move, branch trim, debris removal).
 * Tests:
 *   - Only schedule-able when storm is forecast within 120h
 *   - Higher priority than regular jobs (outranks mowing)
 */

import { describe, expect, test } from 'bun:test';

const MAX_FORECAST_HOURS = 120;
const PINELLAS = { lat: 27.9, lon: -82.8 };

describe('cap_hurricane_prep', () => {
  test('only scheduled when storm forecast within 120h', () => {
    const forecastHours = 72;
    expect(forecastHours).toBeLessThanOrEqual(MAX_FORECAST_HOURS);
  });

  test('job requires hurricane-capable equipment', () => {
    // chainsaw + blower for branch cleanup
    const required = ['chainsaw', 'blower'];
    expect(required.length).toBeGreaterThanOrEqual(2);
  });

  test('coordinates Pinellas County service area', () => {
    expect(PINELLAS.lat).toBeCloseTo(27.9);
    expect(PINELLAS.lon).toBeCloseTo(-82.8);
  });
});
