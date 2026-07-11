/**
 * @grass/scheduling-core/service — Phase 4-5 stubs.
 */

import { type Principal, assertCan } from '@grass/auth';
import type { Job, JobStatus, Route, Schedule } from './types.ts';

export async function scheduleJob(
  input: {
    customer_id: string;
    property_id: string;
    service_id: string;
    crew_id: string;
    scheduled_at: string;
    estimated_duration_minutes: number;
    address: Job['address'];
    equipment_ids?: string[];
  },
  p: Principal,
): Promise<Job> {
  assertCan(p, 'job:schedule');
  const now = Date.now();
  if (new Date(input.scheduled_at).getTime() <= now + 3600 * 1000) {
    throw new Error('invariant: scheduled_at must be > now + 1h');
  }
  return {
    id: `job_${Date.now()}`,
    customer_id: input.customer_id,
    property_id: input.property_id,
    service_id: input.service_id,
    crew_id: input.crew_id,
    equipment_ids: input.equipment_ids ?? [],
    scheduled_at: input.scheduled_at,
    estimated_duration_minutes: input.estimated_duration_minutes,
    address: input.address,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function rescheduleJob(
  job_id: string,
  newScheduledAt: string,
  p: Principal,
): Promise<Job> {
  assertCan(p, 'job:reschedule');
  return baseJob(job_id, 'scheduled', newScheduledAt);
}

export async function completeJob(
  job_id: string,
  completion: { actual_duration_minutes: number; after_photos: string[]; crew_notes?: string },
  p: Principal,
): Promise<Job> {
  assertCan(p, 'job:complete');
  if (completion.after_photos.length === 0) {
    throw new Error('invariant: completion requires ≥1 after_photo');
  }
  return {
    ...baseJob(job_id, 'completed'),
    completed_at: new Date().toISOString(),
    actual_duration_minutes: completion.actual_duration_minutes,
    after_photos: completion.after_photos,
    ...(completion.crew_notes !== undefined ? { crew_notes: completion.crew_notes } : {}),
  };
}

export async function cancelJob(job_id: string, reason: string, p: Principal): Promise<Job> {
  assertCan(p, 'job:cancel');
  return { ...baseJob(job_id, 'cancelled_no_fault'), crew_notes: reason };
}

export async function buildWeekSchedule(_weekStart: string, _p: Principal): Promise<Schedule[]> {
  // Phase 4-5: pull all cadence-driven jobs for the week, optimize per day, write schedules
  return [];
}

export async function optimizeRoute(
  _jobs: Job[],
  _origin: { lat: number; lng: number },
  _p: Principal,
): Promise<Route> {
  // Phase 4-5: Mapbox Optimization v2 adapter
  const today = new Date().toISOString().split('T')[0] ?? '';
  return {
    id: `route_${Date.now()}`,
    schedule_id: '',
    date: today,
    stops: [],
    total_distance_miles: 0,
    total_drive_time_minutes: 0,
    total_service_time_minutes: 0,
    total_duration_minutes: 0,
    provider: 'mapbox',
    computed_at: new Date().toISOString(),
  };
}

export async function cancelJobsForStorm(
  _stormName: string,
  p: Principal,
): Promise<{ cancelled: number }> {
  assertCan(p, 'hurricane:trigger_mode');
  // Phase 4-5: bulk update jobs.status='cancelled_no_fault' for affected date range;
  // dispatch Twilio + Resend notifications; void pending invoices.
  return { cancelled: 0 };
}

function baseJob(id: string, status: JobStatus, scheduled_at?: string): Job {
  return {
    id,
    customer_id: '',
    property_id: '',
    service_id: '',
    crew_id: '',
    equipment_ids: [],
    scheduled_at: scheduled_at ?? new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    estimated_duration_minutes: 60,
    address: { line1: '', city: '', state: 'FL', zip: '' },
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
