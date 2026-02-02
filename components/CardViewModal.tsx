import React, { useState, useEffect } from 'react';
import { Card, Priority, Tag, Column } from '../types';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

interface CardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  card: Card;
  columns: { [key: string]: Column };
}

const CardViewModal: React.FC<CardViewModalProps> = ({ isOpen, onClose, onEdit, onDelete, card, columns }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    onEdit(card);
    onClose();
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    onDelete(card.id);
    setIsDeleting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main View Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all scale-100">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                {card.title}
              </h2>

              {/* Priority and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-md ${
                  card.priority === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  card.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  card.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  card.priority === 'Low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {card.priority}
                </span>

                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  card.tag === 'Bug' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  card.tag === 'Feature' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  card.tag === 'Enhancement' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' :
                  card.tag === 'Learning' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' :
                  'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}>
                  #{card.tag}
                </span>

                {card.dueDate && (
                  <div className="flex items-center text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(card.dueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Description Section */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wider">
                Description
              </h3>
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 min-h-[150px]">
                {card.description ? (
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {card.description}
                  </p>
                ) : (
                  <p className="text-neutral-400 dark:text-neutral-500 italic">
                    No description provided
                  </p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wider">
                  Created
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(card.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {card.dueDate && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wider">
                    Due Date
                  </h3>
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(card.dueDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Movement History */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wider">
                  Movement History
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800 max-h-32 overflow-y-auto">
                  {Object.entries(card.movedTo).length > 0 ? (
                    <div className="space-y-1">
                      {Object.entries(card.movedTo)
                        .sort(([, a], [, b]) => new Date(b).getTime() - new Date(a).getTime())
                        .map(([columnId, date]) => {
                          const columnTitle = columns[columnId]?.title || columnId;
                          return (
                            <div key={columnId} className="flex justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                Moved to {columnTitle}
                              </span>
                              <span className="text-neutral-500 dark:text-neutral-500">
                                {new Date(date).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                      No movement history
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50">
            <button
              onClick={handleDelete}
              className="px-6 py-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors border border-red-200 dark:border-red-800"
            >
              <span className="flex items-center">
                <FaTrash className="mr-2" size={14} />
                Delete Task
              </span>
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-3 text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                <FaEdit className="mr-2" size={14} />
                <span className="text-white dark:text-black">Edit Task</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                  <FaTrash className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Delete Task
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                Are you sure you want to delete "{card.title}"? This will permanently remove the task and all its data.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-black dark:bg-black dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardViewModal;