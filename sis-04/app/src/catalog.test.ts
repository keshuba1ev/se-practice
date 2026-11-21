import { describe, expect, test } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

function catalog(): Room[] {
  return [
    { id: 'a', name: 'Fixture A', building: 'Fixture Wing', capacity: 8, equipment: ['projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
    { id: 'b', name: 'Fixture B', building: 'Fixture Wing', capacity: 7, equipment: ['whiteboard'], blocked: false, bookings: [] },
    { id: 'c', name: 'Fixture C', building: 'Fixture Wing', capacity: 20, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
    { id: 'd', name: 'Fixture D', building: 'Fixture Wing', capacity: 12, equipment: ['projector', 'whiteboard'], blocked: true, bookings: [] },
  ];
}

describe('catalog filtering and selected-room integration', () => {
  test('F1 B5 capacity exactly equal is included', () => {
    const result = filterRooms(catalog(), { attendees: 8, equipment: [] });
    expect(result.map(room => room.id)).toEqual(['a', 'c', 'd']);
  });
  test('F1 B6 capacity one below is excluded', () => {
    expect(filterRooms(catalog(), { attendees: 8, equipment: [] }).map(room => room.id)).not.toContain('b');
  });
  test('F2 all equipment required, not any item', () => {
    expect(filterRooms(catalog(), { attendees: 1, equipment: ['projector', 'whiteboard'] }).map(room => room.id)).toEqual(['c', 'd']);
  });
  test('F2 empty equipment permits every capacity match', () => {
    expect(filterRooms(catalog(), { attendees: 1, equipment: [] })).toHaveLength(4);
  });
  test('F4 no capacity match produces an empty list', () => {
    expect(filterRooms(catalog(), { attendees: 21, equipment: [] })).toEqual([]);
  });
  test('F4 missing equipment produces an empty list', () => {
    expect(filterRooms(catalog(), { attendees: 1, equipment: ['microphone'] })).toEqual([]);
  });
  test('F1 invalid attendee count fails closed', () => {
    expect(filterRooms(catalog(), { attendees: NaN, equipment: [] })).toEqual([]);
    expect(filterRooms(catalog(), { attendees: -1, equipment: [] })).toEqual([]);
  });
  test('F3 AC3 blocked room never becomes available', () => {
    expect(checkRoom(catalog(), 'd', { start: 600, end: 660, now: 540 })).toBe(false);
  });
  test('F5 switching rooms uses own bookings at identical times', () => {
    const rooms = catalog();
    const request = { start: 600, end: 660, now: 540 };
    expect(checkRoom(rooms, 'a', request)).toBe(false);
    expect(checkRoom(rooms, 'c', request)).toBe(true);
    expect(checkRoom(rooms, 'a', request)).toBe(false);
  });
  test('F5 unknown room fails closed', () => {
    expect(checkRoom(catalog(), 'missing', { start: 600, end: 660, now: 540 })).toBe(false);
  });
  test('AC5 filtering and repeated checks preserve the full catalog', () => {
    const rooms = catalog();
    const before = structuredClone(rooms);
    filterRooms(rooms, { attendees: 8, equipment: ['projector'] });
    expect(checkRoom(rooms, 'c', { start: 600, end: 660, now: 540 })).toBe(true);
    expect(checkRoom(rooms, 'c', { start: 600, end: 660, now: 540 })).toBe(true);
    expect(rooms).toEqual(before);
  });
  test('INT F1 F2 F3 filter results feed selected-room checks', () => {
    const matches = filterRooms(catalog(), { attendees: 12, equipment: ['projector', 'whiteboard'] });
    expect(matches.map(room => room.id)).toEqual(['c', 'd']);
    expect(checkRoom(matches, matches[0].id, { start: 600, end: 660, now: 540 })).toBe(true);
    expect(checkRoom(matches, matches[1].id, { start: 600, end: 660, now: 540 })).toBe(false);
  });
  test('B1 AC2 wrapper permits exactly 120 minutes', () => {
    expect(checkRoom(catalog(), 'c', { start: 720, end: 840, now: 540 })).toBe(true);
  });
  test('B2 AC2 wrapper rejects 121 minutes', () => {
    expect(canBook({ start: 720, end: 841, now: 540, blocked: false, bookings: [] })).toBe(false);
  });
  test('B3 AC4 wrapper permits touching endpoints', () => {
    expect(checkRoom(catalog(), 'a', { start: 660, end: 720, now: 540 })).toBe(true);
  });
  test('B4 AC4 wrapper rejects overlapping endpoints', () => {
    expect(checkRoom(catalog(), 'a', { start: 630, end: 690, now: 540 })).toBe(false);
  });
});
