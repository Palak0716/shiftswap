import { useEffect, useRef } from 'react';

export default function Modal({ open, title, children, onClose, actions }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div ref={ref} tabIndex={-1} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between"><h2 id="modal-title" className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close dialog">×</button></div>
      <div>{children}</div>
      <div className="mt-6 flex justify-end gap-2">{actions}</div>
    </div>
  </div>;
}
