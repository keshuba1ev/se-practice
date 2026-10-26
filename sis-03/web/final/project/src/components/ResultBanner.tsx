import { CheckCircle2, XCircle } from 'lucide-react';
import type { Decision } from '@/lib/types';

export function ResultBanner({ decision }: { decision: Decision | null }) {
  if (!decision) return null;

  if (decision.ok) {
    return (
      <div
        role="status"
        className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-900">Available</p>
          <p className="text-sm text-emerald-800">{decision.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4"
    >
      <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
      <div>
        <p className="font-semibold text-rose-900">Unavailable</p>
        <p className="text-sm text-rose-800">{decision.message}</p>
      </div>
    </div>
  );
}
