/**
 * @grass/scheduling-core/types — Twin-model contract types.
 */

export type JobStatus =
  | 'scheduled'
  | 'en_route'
  | 'on_site'
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'cancelled_no_fault'
  | 'cancelled_with_fault'
  | 'no_show_crew'
  | 'no_show_customer'
  | 'deferred_weather';

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}

export interface Job {
  id: string;
  quote_id?: string;
  invoice_id?: string;
  customer_id: string;
  property_id: string;
  service_id: string;
  crew_id: string;
  vehicle_id?: string;
  equipment_ids: string[];
  scheduled_at: string;
  estimated_duration_minutes: number;
  address: Address;
  status: JobStatus;
  completed_at?: string;
  actual_duration_minutes?: number;
  before_photos?: string[];
  after_photos?: string[];
  customer_notes?: string;
  crew_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RouteStop {
  sequence: number;
  job_id: string;
  property_id: string;
  address: Address;
  drive_from_previous_minutes: number;
  drive_from_previous_miles: number;
}

export interface Route {
  id: string;
  schedule_id: string;
  date: string;
  stops: RouteStop[];
  total_distance_miles: number;
  total_drive_time_minutes: number;
  total_service_time_minutes: number;
  total_duration_minutes: number;
  provider: 'mapbox' | 'google' | 'osrm_self_hosted';
  computed_at: string;
}

export interface Schedule {
  id: string;
  date: string;
  crew_id: string;
  vehicle_id?: string;
  start_time: string;
  end_time: string;
  job_ids: string[];
  route_id?: string;
  drive_time_minutes: number;
  weather_hold: boolean;
  hurricane_hold: boolean;
  customer_holds: string[];
  created_at: string;
  updated_at: string;
}

export function invariantCompletedHasPhotos(
  j: Pick<Job, 'status' | 'completed_at' | 'after_photos'>,
): boolean {
  if (j.status !== 'completed') return true;
  return Boolean(j.completed_at) && (j.after_photos?.length ?? 0) >= 1;
}

export function invariantScheduledFuture(
  j: Pick<Job, 'status' | 'scheduled_at'>,
  now = Date.now(),
): boolean {
  if (j.status !== 'scheduled') return true;
  return new Date(j.scheduled_at).getTime() > now + 3600 * 1000;
}

export function invariantDurationWithinTolerance(
  actual: number,
  serviceDefault: number,
  tolerance = 0.2,
): boolean {
  if (serviceDefault <= 0) return false;
  return Math.abs(actual - serviceDefault) / serviceDefault <= tolerance;
}
