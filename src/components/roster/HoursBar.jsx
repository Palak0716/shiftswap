import { shiftHours } from '../../engine/timeUtils';
export default function HoursBar({ shifts, cap }) {
  const hours = shifts.reduce((sum, s) => sum + shiftHours(s), 0);
  const pct = Math.min(100, (hours / cap) * 100);
  const cls = hours > cap ? 'bg-red-500' : hours >= cap * 0.9 ? 'bg-amber-500' : 'bg-green-500';
  return <div className="min-w-28"><div className="mb-1 flex justify-between text-[10px] text-slate-500"><span>{hours}h</span><span>{cap}h</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className={`h-full ${cls}`} style={{ width: `${pct}%` }}/></div></div>;
}
