/** Fictional, same-day catalog. Checks never change these records. */
export type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export const ROOMS: Room[] = [
  { id: 'r1', name: 'Athena 101', building: 'Engineering Block', capacity: 40, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 540, end: 600 }, { start: 720, end: 780 }] },
  { id: 'r2', name: 'Curie 204', building: 'Science Wing', capacity: 24, equipment: ['projector', 'whiteboard', 'video call'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'r3', name: 'Turing 310', building: 'CS Lab', capacity: 16, equipment: ['whiteboard', 'video call'], blocked: true, bookings: [{ start: 600, end: 660 }] },
  { id: 'r4', name: 'Da Vinci 012', building: 'Arts Hall', capacity: 60, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 480, end: 540 }] },
  { id: 'r5', name: 'Newton 220', building: 'Physics Block', capacity: 30, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 840, end: 900 }] },
];

export const EQUIPMENT = Array.from(new Set(ROOMS.flatMap(room => room.equipment))).sort();
