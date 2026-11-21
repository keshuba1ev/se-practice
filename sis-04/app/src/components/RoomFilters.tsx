import type { RoomCriteria } from '../filter';

export function RoomFilters({ criteria, equipment, onChange }: {
  criteria: RoomCriteria;
  equipment: readonly string[];
  onChange: (criteria: RoomCriteria) => void;
}) {
  const selectedEquipment = new Set(criteria.equipment);
  return (
    <fieldset className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-slate-700">Room requirements</legend>
      <label className="flex items-center justify-between gap-3 text-sm text-slate-700">
        Attendees
        <input type="number" min="1" step="1" value={Number.isNaN(criteria.attendees) ? '' : criteria.attendees}
          onChange={e => onChange({ ...criteria, attendees: e.target.valueAsNumber })}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
      </label>
      <p className="mt-3 text-xs text-slate-500">Required equipment · all selected items</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {equipment.map(item => (
          <label key={item} className="flex items-center gap-2 text-sm capitalize text-slate-700">
            <input type="checkbox" checked={selectedEquipment.has(item)}
              onChange={e => onChange({ ...criteria, equipment: e.target.checked
                ? [...criteria.equipment, item] : criteria.equipment.filter(value => value !== item) })}
              className="h-4 w-4 accent-sky-600" />
            {item}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
