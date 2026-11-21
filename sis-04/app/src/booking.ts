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

/** Extracted Week 06 decision. The caller supplies the room and same-day data. */
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  if (start < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const booking of bookings) {
    if (start < booking.end && booking.start < end) return false;
  }
  return true;
}
