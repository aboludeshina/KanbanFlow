import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Card as CardType } from '../types';
import Card from './Card';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteAllCards: (columnId: string) => void;
  isDropDisabled: boolean;
  onCardClick: (card: CardType) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDeleteAllCards,
  isDropDisabled,
  onCardClick,
}) => {
  return (
    <div className={`
      group flex flex-col h-full bg-neutral-200/60 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 
      snap-center transition-all shadow-sm
      w-[85vw] flex-shrink-0
      md:w-auto md:flex-1 md:flex-shrink md:min-w-[260px] md:max-w-[400px]
    `}>
      <div className="p-4 flex justify-between items-center bg-transparent shrink-0">
        <div className="flex items-center space-x-2.5">
          <h2 className="font-bold text-neutral-600 dark:text-neutral-200 tracking-wide text-sm uppercase">
            {column.title}
          </h2>
          <span className="bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {cards.length > 0 && (
            <button
              onClick={() => onDeleteAllCards(column.id)}
              className="p-1.5 text-neutral-300 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              aria-label={`Delete all cards in ${column.title}`}
              title="Delete all cards"
            >
              <span><FaTrashAlt size={12} /></span>
            </button>
          )}
          <button
            onClick={() => onAddCard(column.id)}
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label={`Add card to ${column.title}`}
          >
            <span><FaPlus size={14} /></span>
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-all duration-200 ${snapshot.isDraggingOver
              ? 'bg-neutral-200 dark:bg-neutral-800'
              : ''
              }`}
            style={{ minHeight: '100px' }}
          >
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-32 text-neutral-400 dark:text-neutral-600 border-2 border-dashed border-neutral-300/50 dark:border-neutral-800 rounded-xl m-1">
                <span className="text-xs font-medium">No tasks yet</span>
                <button 
                  onClick={() => onAddCard(column.id)}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Add one
                </button>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                  onClick={onCardClick}
                />
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;