export default function Toast({ message, onClose }) {
  if (!message) return null;
  return <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
    <div className="flex items-start gap-3"><span>✓</span><span className="flex-1">{message}</span><button onClick={onClose} aria-label="Close notification">×</button></div>
  </div>;
}
