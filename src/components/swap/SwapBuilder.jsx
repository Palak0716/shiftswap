import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateRequest } from '../../engine/evaluateRequest';
import Badge from '../common/Badge';

export default function SwapBuilder({ toast }) {
  const { state, dispatch } = useApp();
  const first = state.roster.shifts.find(s => s.id === state.ui.selectedShiftId);
  const second = state.roster.shifts.find(s => s.id === state.ui.secondShiftId);
  const evaluation = useMemo(() => {
    if (!first) return null;
    if (state.ui.builderMode === 'SWAP' && !second) return null;
    if (state.ui.builderMode === 'GIVE' && !state.ui.selectedNurseId) return null;
    const request = state.ui.builderMode === 'SWAP'
      ? { type:'SWAP', shiftA:first.id, shiftB:second.id, requestedBy:first.nurseId, createdAt:new Date().toISOString() }
      : { type:'GIVE', shiftId:first.id, toNurseId:state.ui.selectedNurseId, requestedBy:first.nurseId, createdAt:new Date().toISOString() };
    return { request, result: evaluateRequest(state.roster, request, state.config) };
  }, [first, second, state.ui.builderMode, state.ui.selectedNurseId, state.roster, state.config]);

  if (!first) return <aside className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">Select a shift to start a swap or give-away.</aside>;

  const selectSecond = s => dispatch({ type:'SELECT_SECOND_SHIFT', payload:s.id });
  const submit = () => {
    if (!evaluation) return;
    const request = { ...evaluation.request, id:`REQ-${Date.now()}`, result:evaluation.result.status, reasons:evaluation.result.reasons, state:evaluation.result.status === 'PENDING_CHARGE' ? 'PENDING_CHARGE' : evaluation.result.status };
    dispatch({ type:'ADD_REQUEST', payload:request });
    toast(`Request submitted as ${evaluation.result.status}.`);
    dispatch({ type:'CLEAR_BUILDER' });
  };
  return <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div className="flex items-center justify-between"><h2 className="font-black">Swap Builder</h2><button onClick={() => dispatch({type:'CLEAR_BUILDER'})} className="text-slate-500">×</button></div>
    <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><div className="text-xs text-slate-500">Selected</div><div className="font-bold">{first.id} · {first.date} · {first.start}–{first.end}</div></div>
    <div className="mt-4 flex gap-2"><button onClick={() => dispatch({type:'SET_BUILDER_MODE',payload:'SWAP'})} className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ui.builderMode==='SWAP'?'bg-blue-600 text-white':'border'}`}>Swap</button><button onClick={() => dispatch({type:'SET_BUILDER_MODE',payload:'GIVE'})} className={`rounded-lg px-3 py-2 text-sm font-bold ${state.ui.builderMode==='GIVE'?'bg-blue-600 text-white':'border'}`}>Give away</button></div>
    {state.ui.builderMode === 'SWAP' && <div className="mt-4"><label className="text-xs font-bold">Second shift</label><select value={second?.id || ''} onChange={e => selectSecond(state.roster.shifts.find(s=>s.id===e.target.value))} className="mt-1 w-full rounded-lg border bg-white p-2 dark:border-slate-700 dark:bg-slate-900"><option value="">Choose shift…</option>{state.roster.shifts.filter(s=>s.id!==first.id).map(s=><option key={s.id} value={s.id}>{s.id} · {s.ward} · {s.date} · {s.start}–{s.end}</option>)}</select></div>}
    {state.ui.builderMode === 'GIVE' && <div className="mt-4"><label className="text-xs font-bold">Receiver</label><select value={state.ui.selectedNurseId || ''} onChange={e => dispatch({type:'SELECT_GIVE_NURSE',payload:e.target.value})} className="mt-1 w-full rounded-lg border bg-white p-2 dark:border-slate-700 dark:bg-slate-900"><option value="">Choose nurse…</option>{state.roster.nurses.filter(n=>n.id!==first.nurseId).map(n=><option key={n.id} value={n.id}>{n.name} ({n.ward})</option>)}</select></div>}
    {evaluation && <div className="mt-5 rounded-xl border p-4"><div className="flex items-center justify-between"><span className="font-bold">Live result</span><Badge tone={evaluation.result.status==='APPROVED'?'green':evaluation.result.status==='PENDING_CHARGE'?'amber':'red'}>{evaluation.result.status}</Badge></div><ul className="mt-3 space-y-2 text-sm">{evaluation.result.reasons.length ? evaluation.result.reasons.map((r,i)=><li key={i}><b>{r.code}</b>: {r.message}</li>) : <li className="text-green-700 dark:text-green-300">✓ No rule violations. Change can be auto-approved.</li>}</ul></div>}
    <button disabled={!evaluation} onClick={submit} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900">Submit request</button>
  </aside>;
}
