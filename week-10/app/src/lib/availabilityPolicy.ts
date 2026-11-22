export interface BookingInterval {
  start: number;
  end: number;
}

export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly BookingInterval[];
}

export type AvailabilityEvaluation =
  | { ok: true }
  | { ok: false; reason: 'invalid-interval' | 'reversed-interval' | 'past-start' | 'too-long' | 'room-blocked' }
  | { ok: false; reason: 'overlap'; booking: BookingInterval };

/** Single pure rule owner; adapters keep their existing public return shapes. */
export function evaluateBooking({ start, end, now, blocked, bookings }: BookingRequest): AvailabilityEvaluation {
  if (!Number.isFinite(start) || !Number.isFinite(end)) return { ok: false, reason: 'invalid-interval' };
  if (start < 0 || end > 1440) return { ok: false, reason: 'invalid-interval' };
  if (start >= end) return { ok: false, reason: 'reversed-interval' };
  if (start <= now) return { ok: false, reason: 'past-start' };
  if (end - start > 120) return { ok: false, reason: 'too-long' };
  if (blocked) return { ok: false, reason: 'room-blocked' };
  for (const booking of bookings) {
    if (start < booking.end && booking.start < end) return { ok: false, reason: 'overlap', booking };
  }
  return { ok: true };
}
