import type { Booking, Room } from './types';

// Fictional sample data only.
export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'Athena 101', building: 'Engineering Block', capacity: 40, blocked: false },
  { id: 'r2', name: 'Curie 204', building: 'Science Wing', capacity: 24, blocked: false },
  { id: 'r3', name: 'Turing 310', building: 'CS Lab', capacity: 16, blocked: true },
  { id: 'r4', name: 'Da Vinci 012', building: 'Arts Hall', capacity: 60, blocked: false },
  { id: 'r5', name: 'Newton 220', building: 'Physics Block', capacity: 30, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Intro to Circuits' },
  { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Signals Lab' },
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Orgo Study Group' },
  { id: 'b4', roomId: 'r2', start: 900, end: 960, bookedBy: 'Thesis Defense' },
  { id: 'b5', roomId: 'r4', start: 480, end: 540, bookedBy: 'Faculty Meeting' },
  { id: 'b6', roomId: 'r5', start: 840, end: 900, bookedBy: 'Quantum Seminar' },
];
