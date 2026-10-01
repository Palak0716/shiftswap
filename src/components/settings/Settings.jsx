import { useApp } from '../../context/AppContext';
import { DEFAULT_CONFIG } from '../../config/rules';

export default function Settings() {
  const { state, dispatch } = useApp();
  const set = (key, value) => dispatch({type:'SET_CONFIG',payload:{[key]:value}});
  return <div className="max-w-2xl space-y-5"><div><h1 className="text-2xl font-black">Settings</h1><p className="text-sm text-slate-500">The rule engine uses these values immediately for open evaluations.</p></div>
    <div className="grid gap-4 rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <label className="grid gap-1 text-sm font-semibold">NOW<input value={state.config.now} onChange={e=>set('now',e.target.value)} className="rounded-lg border p-2 font-normal dark:border-slate-700 dark:bg-slate-900"/></label>
      {[['restHours','REST_HOURS'],['maxNights','MAX_NIGHTS'],['weekCap','WEEK_CAP'],['lockHours','LOCK_HOURS']].map(([key,label])=><label key={key} className="grid gap-1 text-sm font-semibold">{label}<input type="number" min="0" value={state.config[key]} onChange={e=>set(key,Number(e.target.value))} className="rounded-lg border p-2 font-normal dark:border-slate-700 dark:bg-slate-900"/></label>)}
      <button onClick={()=>dispatch({type:'SET_CONFIG',payload:DEFAULT_CONFIG})} className="w-fit rounded-lg border px-4 py-2 text-sm font-bold">Reset rule values</button>
    </div>
  </div>;
}
