import type { Booking, CheckInput, Decision, Room } from './types';

const MINUTES_PER_DAY = 1440;
const MAX_DURATION = 120;

/**
 * Evaluate a candidate booking interval against the acceptance criteria.
 * Pure function: does not mutate rooms or bookings (AC5).
 */
export function checkAvailability(
  input: CheckInput,
  rooms: Room[],
  bookings: Booking[]
): Decision {
  const { roomId, start, end, currentTime } = input;

  // AC1: interval validity and "start after current time"
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return fail('invalid-interval', 'Please enter valid start and end times.');
  }
  if (start < 0 || end > MINUTES_PER_DAY || start >= end) {
    return fail(
      'invalid-interval',
      'Interval must have 0 ≤ start < end ≤ 1440 minutes.'
    );
  }
  if (start <= currentTime) {
    return fail(
      'past-start',
      'Start time must be later than the current time.'
    );
  }

  // AC2: duration cap
  if (end - start > MAX_DURATION) {
    return fail(
      'too-long',
      'Bookings cannot be longer than 120 minutes.'
    );
  }

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return fail('unknown-room', 'Please select a room.');
  }

  // AC3: blocked room
  if (room.blocked) {
    return fail(
      'room-blocked',
      `${room.name} is currently blocked and cannot be booked.`
    );
  }

  // AC4: overlap (touching endpoints allowed)
  const roomBookings = bookings.filter((b) => b.roomId === roomId);
  const overlap = roomBookings.find(
    (b) => start < b.end && b.start < end
  );
  if (overlap) {
    return fail(
      'overlap',
      `Overlaps an existing booking (${fmt(overlap.start)}–${fmt(overlap.end)}).`
    );
  }

  return { ok: true, message: `${room.name} is available from ${fmt(start)} to ${fmt(end)}.` };
}

function fail(reason: string, message: string): Decision {
  return { ok: false, reason, message };
}

/** minutes (0..1440) -> "HH:MM" */
export function fmt(minutes: number): string {
  const m = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(minutes)));
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** "HH:MM" -> minutes, or NaN */
export function parseTime(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return NaN;
  const h = Number(match[1]);
  const mm = Number(match[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return NaN;
  return h * 60 + mm;
}
