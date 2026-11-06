interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
}

export function TimeField({ label, value, onChange, hint, error }: TimeFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 tabular-nums',
          'focus:outline-none focus:ring-2 focus:ring-sky-400',
          error ? 'border-rose-400' : 'border-slate-300',
        ].join(' ')}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}
