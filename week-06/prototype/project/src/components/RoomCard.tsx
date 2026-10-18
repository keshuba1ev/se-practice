import { CheckCircle2, Lock, Users, MapPin } from 'lucide-react';
import type { Room } from '@/lib/types';
import { fmt } from '@/lib/availability';

interface RoomCardProps {
  room: Room;
  bookings: { start: number; end: number; bookedBy: string }[];
  selected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, bookings, selected, onSelect }: RoomCardProps) {
  const today = bookings
    .filter((b) => b.roomId === room.id)
    .sort((a, b) => a.start - b.start);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-disabled={room.blocked}
      className={[
        'w-full text-left rounded-xl border p-4 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-sky-400',
        room.blocked
          ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
          : selected
          ? 'border-sky-500 bg-sky-50 shadow-sm ring-1 ring-sky-200'
          : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" /> {room.building}
          </p>
        </div>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
            <Lock className="h-3 w-3" /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Open
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <Users className="h-3.5 w-3.5" /> Capacity {room.capacity}
      </div>

      {today.length > 0 && (
        <ul className="mt-3 space-y-1">
          {today.map((b, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
            >
              <span className="truncate">{b.bookedBy}</span>
              <span className="tabular-nums text-slate-500">
                {fmt(b.start)}–{fmt(b.end)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}
