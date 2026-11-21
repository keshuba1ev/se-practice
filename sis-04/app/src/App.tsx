import { useState } from 'react';
import { Clock, Building2, CalendarClock } from 'lucide-react';
import { RoomCard } from '@/components/RoomCard';
import { TimeField } from '@/components/TimeField';
import { ResultBanner } from '@/components/ResultBanner';
import { ROOMS, EQUIPMENT, type Room } from './rooms';
import { filterRooms, type RoomCriteria } from './filter';
import { RoomFilters } from './components/RoomFilters';
import { fmt, parseTime } from '@/lib/time';
import type { Decision } from '@/lib/types';
import { checkRoom } from './booking';

const DEMO_NOW = 540;

function App({ rooms = ROOMS }: { rooms?: Room[] }) {
  const [roomId, setRoomId] = useState<string>('');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [criteria, setCriteria] = useState<RoomCriteria>({ attendees: 1, equipment: [] });
  const [hasChecked, setHasChecked] = useState(false);
  const matches = filterRooms(rooms, criteria);
  const selectedRoom = matches.find(room => room.id === roomId);
  const start = parseTime(startStr);
  const end = parseTime(endStr);
  const startError = hasChecked && Number.isNaN(start) ? 'Enter HH:MM, from 00:00 to 24:00.' : undefined;
  const endError = hasChecked && Number.isNaN(end) ? 'Enter HH:MM, from 00:00 to 24:00.' : undefined;

  // Derived from current inputs: room switching and time edits cannot retain an old decision.
  let decision: Decision | null = null;
  if (hasChecked) {
    if (!selectedRoom) {
      decision = { ok: false, reason: 'no-room', message: 'Select a room from the matching results.' };
    } else if (!startError && !endError) {
      const ok = checkRoom(rooms, selectedRoom.id, { start, end, now: DEMO_NOW });
      decision = ok
        ? { ok: true, message: `${selectedRoom.name} is free from ${fmt(start)} to ${fmt(end)}.` }
        : { ok: false, reason: 'unavailable', message: `${selectedRoom.name}: check that the end is after the start, the start is after 09:00, the slot is at most 120 minutes, and the room is open with no conflicting reservation.` };
    }
  }

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setHasChecked(true);
  }

  function updateCriteria(next: RoomCriteria) {
    setCriteria(next);
    if (!filterRooms(rooms, next).some(room => room.id === roomId)) {
      setRoomId('');
      setHasChecked(false);
    }
  }

  function reset() {
    setRoomId('');
    setStartStr('');
    setEndStr('');
    setCriteria({ attendees: 1, equipment: [] });
    setHasChecked(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold sm:text-xl">Smart Campus Room Availability</h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Find a room that fits your group, then check your time slot.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Rooms list */}
          <section className="lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <CalendarClock className="h-4 w-4" /> Rooms
              </h2>
              <span className="text-xs text-slate-400">{matches.length} of {rooms.length} rooms</span>
            </div>
            <RoomFilters criteria={criteria} equipment={EQUIPMENT} onChange={updateCriteria} />
            {matches.length === 0 && (
              <div role="status" className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
                <p className="font-semibold text-slate-800">No rooms match your requirements</p>
                <p className="mt-1 text-sm text-slate-500">Reduce attendees or remove an equipment requirement.</p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {matches.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selected={room.id === roomId}
                  onSelect={() => {
                    setRoomId(room.id);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Checker form */}
          <section className="lg:col-span-2">
            <form
              onSubmit={handleCheck}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4 text-sky-600" /> Check a slot
              </h2>

              <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-500">Selected room: </span>
                <span className="font-medium">
                  {selectedRoom ? selectedRoom.name : 'None'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TimeField
                  label="Start"
                  value={startStr}
                  onChange={setStartStr}
                  hint="Must be after current time"
                  error={startError}
                />
                <TimeField
                  label="End"
                  value={endStr}
                  onChange={setEndStr}
                  hint="Max 120 min after start"
                  error={endError}
                />
              </div>

              <p className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
                Demo current time: <strong>09:00</strong> · same day only
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Check availability
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>

              <ResultBanner decision={decision} />

              <p className="mt-4 text-xs text-slate-400">
                Fictional rooms only. Checking does not create or modify any booking. Touching reservations are allowed.
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
