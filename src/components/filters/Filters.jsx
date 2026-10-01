import { useApp } from '../../context/AppContext';

export default function Filters() {
  const { state, dispatch } = useApp();
  const set = payload => dispatch({ type: 'SET_FILTERS', payload });
  return <div className="flex flex-wrap items-center gap-2">
    <select value={state.ui.ward} onChange={e => set({ ward: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <option>ALL</option><option>ICU</option><option>GEN</option><option>ER</option>
    </select>
    <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"><input type="checkbox" checked={state.ui.nightOnly} onChange={e => set({ nightOnly: e.target.checked })}/> Night only</label>
    <input value={state.ui.search} onChange={e => set({ search: e.target.value })} placeholder="Search nurse..." className="w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
  </div>;
}
