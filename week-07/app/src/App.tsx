import { useMemo, useState } from 'react';
import { Clock, Building2, CalendarClock } from 'lucide-react';
import { RoomCard } from '@/components/RoomCard';
import { TimeField } from '@/components/TimeField';
import { ResultBanner } from '@/components/ResultBanner';
import { SAMPLE_BOOKINGS, SAMPLE_ROOMS } from '@/lib/sampleData';
import { checkAvailability, fmt, parseTime } from '@/lib/availability';
import type { Decision } from '@/lib/types';

function App() {
  const [roomId, setRoomId] = useState<string>('');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [currentTime, setCurrentTime] = useState(() => nowMinutes());
  const [decision, setDecision] = useState<Decision | null>(null);
  const [startError, setStartError] = useState<string | undefined>();
  const [endError, setEndError] = useState<string | undefined>();

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setStartError(undefined);
    setEndError(undefined);

    if (!roomId) {
      setDecision({ ok: false, reason: 'no-room', message: 'Please select a room first.' });
      return;
    }

    const start = parseTime(startStr);
    const end = parseTime(endStr);

    let fieldError = false;
    if (Number.isNaN(start)) {
      setStartError('Enter a start time as HH:MM.');
      fieldError = true;
    }
    if (Number.isNaN(end)) {
      setEndError('Enter an end time as HH:MM.');
      fieldError = true;
    }
    if (fieldError) {
      setDecision(null);
      return;
    }

    setDecision(
      checkAvailability({ roomId, start, end, currentTime }, SAMPLE_ROOMS, SAMPLE_BOOKINGS)
    );
  }

  function reset() {
    setRoomId('');
    setStartStr('');
    setEndStr('');
    setDecision(null);
    setStartError(undefined);
    setEndError(undefined);
  }

  const selectedRoom = useMemo(
    () => SAMPLE_ROOMS.find((r) => r.id === roomId),
    [roomId]
  );

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
              Check whether a campus room is free for your proposed time slot.
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
              <span className="text-xs text-slate-400">{SAMPLE_ROOMS.length} rooms</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {SAMPLE_ROOMS.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  bookings={SAMPLE_BOOKINGS}
                  selected={room.id === roomId}
                  onSelect={() => {
                    setRoomId(room.id);
                    setDecision(null);
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

              <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <label htmlFor="currentTime" className="text-sm text-slate-600">
                  Current time
                </label>
                <input
                  id="currentTime"
                  type="time"
                  value={fmt(currentTime)}
                  onChange={(e) => {
                    const m = parseTime(e.target.value);
                    if (!Number.isNaN(m)) setCurrentTime(m);
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

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
                Checking does not create or modify any booking.
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export default App;
