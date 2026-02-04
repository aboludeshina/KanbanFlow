import React from 'react';
import { FaShieldAlt, FaTimes, FaCheck } from 'react-icons/fa';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all scale-100">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex items-center space-x-2.5 text-black dark:text-white">
                        <div className="p-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm">
                            <span className="text-green-600 dark:text-green-500"><FaShieldAlt size={16} /></span>
                        </div>
                        <h2 className="text-xl font-bold">Privacy Notice</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Close">
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                        <p className="leading-relaxed">
                            We take your privacy seriously. Here is how your data is handled:
                        </p>

                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 text-green-600 dark:text-green-500 flex-shrink-0">
                                    <FaCheck size={14} />
                                </span>
                                <span>
                                    <strong>Local Storage Only:</strong> All your tasks, settings, and API keys are stored exclusively on your device's browser local storage.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 text-green-600 dark:text-green-500 flex-shrink-0">
                                    <FaCheck size={14} />
                                </span>
                                <span>
                                    <strong>No Backend:</strong> We do not have servers receiving or storing your personal data.
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1 text-green-600 dark:text-green-500 flex-shrink-0">
                                    <FaCheck size={14} />
                                </span>
                                <span>
                                    <strong>Your Control:</strong> You can export your data at any time and wipe it from your browser whenever you choose.
                                </span>
                            </li>
                        </ul>

                        <p className="text-sm pt-2 text-neutral-500 dark:text-neutral-400 italic">
                            Since data is stored locally, clearing your browser cache/storage will remove your board data unless you have exported a backup.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-end bg-neutral-50 dark:bg-neutral-900">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-black dark:bg-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all shadow-lg hover:shadow-xl"
                    >
                        I Understand
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrivacyModal;
