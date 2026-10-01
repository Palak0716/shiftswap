import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateRequest } from '../../engine/evaluateRequest';
import { resolveQueue } from '../../engine/resolveQueue';
import Modal from '../common/Modal';

export default function ChargeQueue({ toast }) {
  const { state, dispatch } = useApp();
  const [rejectId, setRejectId] = useState(null);
  const pending = state.requests.filter(r => r.state === 'PENDING_CHARGE');
  const resolved = resolveQueue(state.roster, pending);

  const approve = request => {
    const result = evaluateRequest(state.roster, request, state.config);
    if (result.status === 'REJECTED') { toast('Approval blocked: the roster changed and the request is now rejected.'); dispatch({type:'UPDATE_REQUEST',payload:{id:request.id,state:'REJECTED',result:'REJECTED',reasons:result.reasons}}); return; }
    const snapshot = { roster: state.roster, requests: state.requests };
    const nextRoster = structuredClone(state.roster);
    if (request.type === 'SWAP') {
      const a = nextRoster.shifts.find(s=>s.id===request.shiftA); const b = nextRoster.shifts.find(s=>s.id===request.shiftB); if (a&&b) [a.nurseId,b.nurseId]=[b.nurseId,a.nurseId];
    } else { const s=nextRoster.shifts.find(s=>s.id===request.shiftId); if(s) s.nurseId=request.toNurseId; }
    const updated = state.requests.map(r => r.id === request.id ? {...r,state:'APPROVED',result:'APPROVED'} : (resolved.superseded.some(s=>s.id===r.id) ? {...r,state:'SUPERSEDED',result:'SUPERSEDED',supersededBy:request.id} : r));
    dispatch({type:'APPLY_ROSTER',payload:nextRoster,report:state.cleaningReport,requests:updated,undoStack:[snapshot,...state.undoStack].slice(0,5)});
    toast(`Request ${request.id} approved.`);
  };
  const reject = () => { dispatch({type:'UPDATE_REQUEST',payload:{id:rejectId,state:'REJECTED',result:'REJECTED'}}); setRejectId(null); toast('Request rejected.'); };

  return <div className="space-y-4"><div><h1 className="text-2xl font-black">Charge Nurse Queue</h1><p className="text-sm text-slate-500">Pending requests requiring human review.</p></div>
    {!pending.length ? <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">No pending charge requests.</div> : <div className="grid gap-3">{pending.map(r=><div key={r.id} className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="font-black">{r.id} · {r.type}</div><div className="mt-1 text-sm text-slate-500">{r.type==='SWAP'?`${r.shiftA} ↔ ${r.shiftB}`:`${r.shiftId} → ${r.toNurseId}`}</div></div><div className="text-xs text-slate-500">Requested by {r.requestedBy}</div></div><ul className="mt-3 space-y-1 text-sm">{r.reasons?.map((x,i)=><li key={i}><b>{x.code}</b>: {x.message}</li>)}</ul><div className="mt-4 flex gap-2"><button onClick={()=>approve(r)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white">Approve</button><button onClick={()=>setRejectId(r.id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Reject</button></div></div>)}</div>}
    <Modal open={Boolean(rejectId)} title="Reject request?" onClose={()=>setRejectId(null)} actions={<><button onClick={()=>setRejectId(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={reject} className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white">Reject</button></>}><p className="text-sm text-slate-600 dark:text-slate-300">This changes the request status to REJECTED.</p></Modal>
  </div>;
}
