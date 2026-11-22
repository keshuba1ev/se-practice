import { evaluateBooking, type BookingRequest } from './lib/availabilityPolicy';
export type { BookingInterval, BookingRequest } from './lib/availabilityPolicy';

/** Preserved public boolean API; all rules live in the shared pure policy. */
export function canBook(request: BookingRequest): boolean {
  return evaluateBooking(request).ok;
}
