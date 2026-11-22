import type { Booking, Room } from './types';

// Fictional sample data only.
export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'Athena 101', building: 'Engineering Block', capacity: 40, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Intro to Circuits' },
  { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Signals Lab' },
];
