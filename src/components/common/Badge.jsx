export default function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate}`}>{children}</span>;
}
