import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { isNightShift } from '../../engine/timeUtils';
import ShiftCard from './ShiftCard';
import HoursBar from './HoursBar';
import Filters from '../filters/Filters';

const DAYS = ['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09','2026-10-10','2026-10-11'];
const label = d => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short' });

export default function RosterGrid({ onShift }) {
  const { state } = useApp();
  const nurses = useMemo(() => state.roster.nurses.filter(n => (state.ui.ward === 'ALL' || n.ward === state.ui.ward) && n.name.toLowerCase().includes(state.ui.search.toLowerCase())), [state.roster.nurses, state.ui]);
  const shifts = state.roster.shifts;
  const wards = state.ui.ward === 'ALL' ? ['ICU','GEN','ER'] : [state.ui.ward];
  const visibleShift = s => !state.ui.nightOnly || isNightShift(s);

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-black">Roster</h1><p className="text-sm text-slate-500">5–11 October 2026 · reference time {state.config.now}</p></div><Filters/></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[1180px]">
          <div className="grid grid-cols-[190px_repeat(7,minmax(130px,1fr))] border-b border-slate-200 bg-slate-50 text-xs font-bold dark:border-slate-800 dark:bg-slate-900"><div className="p-3">Nurse</div>{DAYS.map(d => <div key={d} className="p-3">{label(d)}</div>)}</div>
          {wards.map(ward => <div key={ward}>
            <div className="bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-wider dark:bg-slate-900">{ward}</div>
            {nurses.filter(n => n.ward === ward).map(nurse => <div key={nurse.id} className="grid grid-cols-[190px_repeat(7,minmax(130px,1fr))] border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col justify-center gap-2 p-3"><div><div className="font-bold text-sm">{nurse.name}</div><div className="text-xs text-slate-500">{nurse.id} · {nurse.seniorityYears}y</div></div><HoursBar shifts={shifts.filter(s => s.nurseId === nurse.id)} cap={state.config.weekCap}/></div>
              {DAYS.map(day => {
                const own = shifts.filter(s => s.nurseId === nurse.id && s.date === day && visibleShift(s));
                const continuing = shifts.some(s => { const d = new Date(`${s.date}T00:00:00`); d.setDate(d.getDate()+1); return s.nurseId === nurse.id && d.toISOString().slice(0,10) === day && new Date(`${s.date}T${s.end}:00`) <= new Date(`${s.date}T${s.start}:00`) && visibleShift(s); });
                return <div key={day} className="min-h-32 border-l border-slate-100 p-2 dark:border-slate-800">
                  <div className="space-y-1">{own.map(s => <ShiftCard key={s.id} shift={s} nurse={nurse} selected={state.ui.selectedShiftId === s.id} onClick={onShift}/>)}</div>{continuing && <div className="mt-1 rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-900">↳ continues</div>}
                </div>;
              })}
            </div>)}
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}
