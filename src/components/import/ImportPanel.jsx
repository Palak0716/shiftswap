import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { importData } from '../../engine/importData';
import Modal from '../common/Modal';

export default function ImportPanel({ toast }) {
  const { state, dispatch } = useApp();
  const [text,setText]=useState(''); const [preview,setPreview]=useState(null); const [open,setOpen]=useState(false);
  const run=()=>{ const result=importData(text); setPreview(result); setOpen(true); };
  const confirm=()=>{ if(preview){ dispatch({type:'REPLACE_ROSTER',payload:preview.roster,report:preview.report}); toast('Roster imported.'); } setOpen(false); };
  return <div className="space-y-3 rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><div><h2 className="font-black">Import roster JSON</h2><p className="text-xs text-slate-500">Paste the assignment seed shape. The app cleans it and shows a report before replacing the roster.</p></div><textarea value={text} onChange={e=>setText(e.target.value)} rows={8} placeholder="Paste JSON here…" className="w-full rounded-xl border p-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"/><button onClick={run} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">Run import</button><div className="text-xs text-slate-500">Current cleaning report entries: {state.cleaningReport.length}</div>
    <Modal open={open} title="Import cleaning report" onClose={()=>setOpen(false)} actions={<><button onClick={()=>setOpen(false)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={confirm} disabled={!preview?.roster?.nurses?.length} className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-40">Replace roster</button></>}><div className="max-h-72 overflow-auto space-y-2 text-sm">{preview?.report?.map((r,i)=><div key={i} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900"><b>{r.type}</b> · {r.record}: {r.message}</div>)}</div></Modal>
  </div>;
}
