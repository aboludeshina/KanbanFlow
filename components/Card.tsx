import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card as CardType } from '../types';
import { PRIORITY_COLORS, TAG_COLORS } from '../constants';
import { FaClock, FaEdit, FaTrash } from 'react-icons/fa';

interface CardProps {
  card: CardType;
  index: number;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
  onClick: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, index, onEdit, onDelete, onClick }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            e.stopPropagation();
            onClick(card);
          }}
          className={`
            p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/60 dark:border-neutral-800
            group hover:shadow-md hover:border-neutral-300/80 dark:hover:border-neutral-700 hover:-translate-y-0.5
            transition-all duration-200 ease-in-out relative cursor-pointer
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-black dark:ring-white rotate-2 z-50' : 'shadow-sm'}
          `}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start mb-2.5">
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                PRIORITY_COLORS[card.priority]
              }`}
            >
              {card.priority}
            </span>
            <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded transition-colors cursor-pointer"
                aria-label="Edit card"
              >
                <span><FaEdit size={12} /></span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                aria-label="Delete card"
              >
                <span><FaTrash size={12} /></span>
              </button>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-black dark:text-white mb-1.5 line-clamp-2 leading-relaxed">
            {card.title}
          </h3>

          {card.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-3 leading-relaxed">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-900">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border border-transparent ${
                TAG_COLORS[card.tag]
              }`}
            >
              #{card.tag}
            </span>
            {card.dueDate && (
              <div className="flex items-center text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                <span className="mr-1"><FaClock size={10} /></span>
                {new Date(card.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;