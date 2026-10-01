import Badge from '../common/Badge';
import { isNightShift } from '../../engine/timeUtils';

export default function ShiftCard({ shift, nurse, selected, onClick, continues }) {
  const tone = shift.ward === 'ICU' ? 'blue' : shift.ward === 'GEN' ? 'violet' : 'rose';
  if (continues) return <div className="mt-1 rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-900">↳ continues</div>;
  return <button onClick={() => onClick(shift)} className={`w-full rounded-xl border p-2 text-left transition ${selected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-slate-200 hover:border-blue-300 dark:border-slate-700'}`} aria-label={`Select shift ${shift.id}`}>
    <div className="flex items-center justify-between gap-1"><span className="font-bold text-xs">{shift.id}</span><Badge tone={tone}>{shift.ward}</Badge></div>
    <div className="mt-1 text-xs font-semibold">{shift.start}–{shift.end}</div>
    <div className={`mt-1 text-[10px] ${isNightShift(shift) ? 'font-bold text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}>{isNightShift(shift) ? '☾ Night' : '☀ Day'}</div>
    <div className="mt-1 truncate text-[10px] text-slate-500">{nurse?.name}</div>
  </button>;
}
