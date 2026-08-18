import { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemToDelete }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !itemToDelete) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(itemToDelete._id);
      setDeleting(false);
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Product</h3>
            <p className="text-xs text-slate-400">Confirm product removal</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300">
          Are you sure you want to delete <strong className="text-white font-semibold">{itemToDelete.title || itemToDelete.name}</strong>?
          <p className="mt-1 text-xs text-slate-500">This action cannot be undone.</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
          >
            {deleting ? (
              <span className="spinner"></span>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
