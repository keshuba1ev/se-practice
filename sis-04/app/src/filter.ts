import type { Room } from './rooms';

export type RoomCriteria = { attendees: number; equipment: readonly string[] };

/** F1/F2: pure AND filter. Blocked rooms stay visible, with their status. */
export function filterRooms(rooms: readonly Room[], criteria: RoomCriteria): Room[] {
  if (!Number.isInteger(criteria.attendees) || criteria.attendees < 1) return [];
  return rooms.filter(room =>
    room.capacity >= criteria.attendees &&
    criteria.equipment.every(item => room.equipment.includes(item))
  );
}
