import { useApp } from '../../context/AppContext';

export default function Header({ page, setPage }) {
  const { state, dispatch } = useApp();
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
      <div><div className="text-xl font-black tracking-tight">Shift<span className="text-blue-600">Swap</span></div><div className="text-xs text-slate-500">Aarogya Multispeciality Hospital</div></div>
      <nav className="flex items-center gap-1" aria-label="Primary navigation">
        {[['roster','Roster'],['queue','Charge Queue'],['settings','Settings']].map(([id,label]) => <button key={id} onClick={() => setPage(id)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${page===id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{label}</button>)}
      </nav>
      <div className="flex items-center gap-2"><button onClick={() => dispatch({ type:'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })} className="rounded-lg border px-3 py-2 text-sm dark:border-slate-700">{state.theme === 'dark' ? '☀' : '☾'}</button></div>
    </div>
  </header>;
}
