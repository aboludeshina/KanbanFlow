import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center space-x-2.5 text-black dark:text-white">
            <div className={`p-2 rounded-lg shadow-sm ${isDestructive ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800'}`}>
                <FaExclamationTriangle size={16} />
            </div>
            <h2 id="modal-title" className="text-lg font-bold">{title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6">
          <p id="modal-description" className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-3 bg-neutral-50 dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-black dark:bg-black dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                isDestructive 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600' 
                : 'bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:ring-black dark:focus:ring-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
