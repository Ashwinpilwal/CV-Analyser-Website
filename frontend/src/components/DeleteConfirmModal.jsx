import React, { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Analysis Record',
  message = 'Are you sure you want to delete this analysis record? This will permanently remove the record and its stored resume file.',
  itemName,
  isDeleting = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Permanent deletion
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-300 leading-relaxed">
          <p>{message}</p>
          {itemName && (
            <div className="mt-3 px-3 py-2 rounded-xl bg-canvas-subtle border border-surface-border text-xs text-slate-200 font-mono truncate">
              {itemName}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-surface-elevated hover:bg-slate-700/60 border border-surface-border rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Record</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
