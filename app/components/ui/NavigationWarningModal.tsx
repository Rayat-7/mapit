import { X } from 'lucide-react';

interface NavigationWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NavigationWarningModal({ isOpen, onConfirm, onCancel }: NavigationWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Leave Page?
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-400">
            Your current drawing will be lost. Are you sure you want to leave?
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              Stay
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium"
            >
              Leave Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
