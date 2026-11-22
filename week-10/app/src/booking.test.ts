import { readFileSync } from 'node:fs';
import { checkAvailability } from './lib/availability';
import { describe, expect, test } from 'vitest';
import { canBook, type BookingRequest } from './booking';

function freshRequest(start: number, end: number, overrides: Partial<BookingRequest> = {}): BookingRequest {
  return {
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe('canBook: fixed acceptance criteria', () => {
  test('T01 AC4 touching after', () => {
    expect(canBook(freshRequest(660, 720))).toBe(true);
  });

  test('T02 AC1 starts now', () => {
    expect(canBook(freshRequest(540, 570))).toBe(false);
  });

  test('T03 AC1 zero duration', () => {
    expect(canBook(freshRequest(720, 720))).toBe(false);
  });

  test('T04 AC1 reversed', () => {
    expect(canBook(freshRequest(750, 720))).toBe(false);
  });

  test('T05 AC1 past day end', () => {
    expect(canBook(freshRequest(1380, 1441))).toBe(false);
  });

  test('T06 AC2 exactly 120 minutes', () => {
    expect(canBook(freshRequest(720, 840))).toBe(true);
  });

  test('T07 AC2 121 minutes', () => {
    expect(canBook(freshRequest(720, 841))).toBe(false);
  });

  test('T08 AC4 touching before', () => {
    expect(canBook(freshRequest(570, 600))).toBe(true);
  });

  test('T09 AC4 partial overlap', () => {
    expect(canBook(freshRequest(630, 690))).toBe(false);
  });

  test('T10 AC4 contains existing booking', () => {
    expect(canBook(freshRequest(570, 690))).toBe(false);
  });

  test('T11 AC4 inside existing booking', () => {
    expect(canBook(freshRequest(615, 645))).toBe(false);
  });

  test('T12 AC4 identical interval', () => {
    expect(canBook(freshRequest(600, 660))).toBe(false);
  });

  test('T13 AC3 blocked', () => {
    expect(canBook(freshRequest(660, 720, { blocked: true }))).toBe(false);
  });

  test('T14 AC4 empty bookings', () => {
    expect(canBook(freshRequest(630, 690, { bookings: [] }))).toBe(true);
  });

  test('AC5 accepted check preserves existing booking data', () => {
    const request = freshRequest(660, 720);
    const before = structuredClone(request.bookings);
    expect(canBook(request)).toBe(true);
    expect(request.bookings).toEqual(before);
  });

  test('X1 AC1 ending exactly at midnight', () => {
    expect(canBook(freshRequest(1380, 1440))).toBe(true);
  });

  test('X2 AC4 overlap with the second existing booking', () => {
    expect(canBook(freshRequest(720, 780, {
      bookings: [{ start: 600, end: 660 }, { start: 700, end: 760 }],
    }))).toBe(false);
  });
  test('E1 AC1 first future minute is permitted', () => {
    expect(canBook(freshRequest(541, 570))).toBe(true);
  });

  test('E2 AC4 gap touches both existing bookings', () => {
    expect(canBook(freshRequest(660, 720, {
      bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }],
    }))).toBe(true);
  });

  test('E3 AC5 repeated accepted checks keep all data unchanged', () => {
    const request = freshRequest(660, 720);
    const before = structuredClone(request.bookings);
    expect(canBook(request)).toBe(true);
    expect(canBook(request)).toBe(true);
    expect(request.bookings).toEqual(before);
  });
});


test('R2 AC4 AC5: boolean and UI adapters share one pure policy', () => {
  // Architecture guard: both public adapters must import the single rule owner.
  const predicateSource = readFileSync(new URL('./booking.ts', import.meta.url), 'utf8');
  const uiAdapterSource = readFileSync(new URL('./lib/availability.ts', import.meta.url), 'utf8');
  expect(predicateSource).toContain("from './lib/availabilityPolicy'");
  expect(uiAdapterSource).toContain("from './availabilityPolicy'");
  const bookings = Object.freeze([Object.freeze({ start: 600, end: 660 })]);
  const rooms = [{ id: 'test-room', name: 'Fictional test room', building: 'Test', capacity: 1, blocked: false }];
  const uiBookings = [{ id: 'test-booking', roomId: 'test-room', start: 600, end: 660, bookedBy: 'Fictional event' }];
  const before = structuredClone(uiBookings);
  expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
  expect(checkAvailability({ roomId: 'test-room', start: 660, end: 720, currentTime: 540 }, rooms, uiBookings).ok).toBe(true);
  expect(canBook({ start: 630, end: 690, now: 540, blocked: false, bookings })).toBe(false);
  expect(checkAvailability({ roomId: 'test-room', start: 630, end: 690, currentTime: 540 }, rooms, uiBookings)).toMatchObject({ ok: false, reason: 'overlap' });
  expect(uiBookings).toEqual(before);
  expect(bookings).toEqual([{ start: 600, end: 660 }]);
});
