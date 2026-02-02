import React, { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardData, Card as CardType, Priority, Tag, PRIORITIES, TAGS, AppSettings } from '../types';
import Column from './Column';
import CardModal from './CardModal';
import CardViewModal from './CardViewModal';
import SmartAddModal from './SmartAddModal';
import ConfirmationModal from './ConfirmationModal';
import { FaSearch, FaFilter, FaMagic } from 'react-icons/fa';

interface BoardProps {
  data: BoardData;
  setData: (data: BoardData) => void;
  settings: AppSettings;
}

const Board: React.FC<BoardProps> = ({ data, setData, settings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterTag, setFilterTag] = useState<Tag | ''>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSmartAddOpen, setIsSmartAddOpen] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingCard, setEditingCard] = useState<CardType | undefined>(undefined);
  const [viewingCard, setViewingCard] = useState<CardType | undefined>(undefined);
  const [targetColumnId, setTargetColumnId] = useState<string>('backlog');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // Moving within same column
    if (startColumn === finishColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, cardIds: newCardIds };

      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    // Moving from one column to another
    const startCardIds = Array.from(startColumn.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = { ...startColumn, cardIds: startCardIds };

    const finishCardIds = Array.from(finishColumn.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, cardIds: finishCardIds };

    // Update movement tracking for the card
    const movedCardId = draggableId;
    const movedCard = data.cards[movedCardId];
    if (movedCard) {
      const updatedCard = {
        ...movedCard,
        movedTo: {
          ...movedCard.movedTo,
          [destination.droppableId]: new Date().toISOString()
        }
      };

      setData({
        ...data,
        cards: {
          ...data.cards,
          [movedCardId]: updatedCard
        },
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
      return;
    }

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const handleAddCard = (columnId: string) => {
    setTargetColumnId(columnId);
    setEditingCard(undefined);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCardClick = (card: CardType) => {
    setViewingCard(card);
    setIsViewModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    setDeletingCardId(cardId);
  };

  const confirmDelete = () => {
    if (!deletingCardId) return;

    const newCards = { ...data.cards };
    delete newCards[deletingCardId];

    const newColumns = { ...data.columns };
    for (const colId in newColumns) {
      newColumns[colId] = {
        ...newColumns[colId],
        cardIds: newColumns[colId].cardIds.filter((id) => id !== deletingCardId),
      };
    }

    setData({ ...data, cards: newCards, columns: newColumns });
    setDeletingCardId(null);
  };

  const handleDeleteAllCards = (columnId: string) => {
    const column = data.columns[columnId];
    if (column.cardIds.length === 0) return;
    setDeletingColumnId(columnId);
  };

  const confirmDeleteAll = () => {
    if (!deletingColumnId) return;

    const column = data.columns[deletingColumnId];
    const newCards = { ...data.cards };

    column.cardIds.forEach(cardId => {
      delete newCards[cardId];
    });

    const newColumns = {
      ...data.columns,
      [deletingColumnId]: {
        ...column,
        cardIds: [],
      },
    };

    setData({ ...data, cards: newCards, columns: newColumns });
    setDeletingColumnId(null);
  };

  const handleViewCardEdit = (card: CardType) => {
    setEditingCard(card);
    setIsModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleViewCardDelete = (cardId: string) => {
    handleDeleteCard(cardId);
    setIsViewModalOpen(false);
  };

  const handleSaveCard = (cardData: Omit<CardType, 'id'> & { id?: string }) => {
    if (cardData.id) {
      // Update existing - preserve createdAt and movedTo
      const existingCard = data.cards[cardData.id];
      setData({
        ...data,
        cards: {
          ...data.cards,
          [cardData.id]: {
            ...cardData,
            createdAt: existingCard?.createdAt || new Date().toISOString(),
            movedTo: existingCard?.movedTo || {}
          } as CardType,
        },
      });
    } else {
      // Create new
      const newId = `card-${Date.now()}`;
      const now = new Date().toISOString();
      const newCard: CardType = {
        ...cardData,
        id: newId,
        createdAt: now,
        movedTo: {
          [targetColumnId]: now
        }
      } as CardType;

      const column = data.columns[targetColumnId];
      const newColumn = {
        ...column,
        cardIds: [...column.cardIds, newId],
      };

      setData({
        ...data,
        cards: { ...data.cards, [newId]: newCard },
        columns: { ...data.columns, [column.id]: newColumn },
      });
    }
  };

  const handleSmartAddCards = (generatedTasks: Array<{ title: string; description: string; priority: Priority; tag: Tag }>) => {
    const newCards: Record<string, CardType> = {};
    const newCardIds: string[] = [];
    const now = new Date().toISOString();

    generatedTasks.forEach((task, index) => {
      const newId = `card-${Date.now()}-${index}`;
      newCards[newId] = {
        id: newId,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        tag: task.tag,
        dueDate: '',
        createdAt: now,
        movedTo: {
          backlog: now
        },
      };
      newCardIds.push(newId);
    });

    const backlogColumn = data.columns['backlog'];
    const updatedBacklog = {
      ...backlogColumn,
      cardIds: [...backlogColumn.cardIds, ...newCardIds],
    };

    setData({
      ...data,
      cards: { ...data.cards, ...newCards },
      columns: { ...data.columns, backlog: updatedBacklog },
    });
  };

  const filteredData = useMemo(() => {
    const filterCard = (cardId: string) => {
      const card = data.cards[cardId];
      if (!card) return false;

      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority ? card.priority === filterPriority : true;
      const matchesTag = filterTag ? card.tag === filterTag : true;

      return matchesSearch && matchesPriority && matchesTag;
    };

    const newColumns: Record<string, typeof data.columns.backlog> = {};

    // Create new column objects containing only filtered card IDs
    data.columnOrder.forEach((colId) => {
      newColumns[colId] = {
        ...data.columns[colId],
        cardIds: data.columns[colId].cardIds.filter(filterCard),
      };
    });

    return newColumns;
  }, [data, searchQuery, filterPriority, filterTag]);

  return (
    <div className="flex flex-col h-full relative bg-white dark:bg-black">
      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 z-10 sticky top-0">
        <div className="relative flex-grow max-w-lg group">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:text-white shadow-sm transition-all text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0 items-center no-scrollbar">
          <div className="relative min-w-[130px]">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white cursor-pointer shadow-sm text-sm"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" size={10} />
          </div>

          <div className="relative min-w-[130px]">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value as Tag | '')}
              className="w-full appearance-none pl-3 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white cursor-pointer shadow-sm text-sm"
            >
              <option value="">All Tags</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" size={10} />
          </div>

          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800 mx-2 hidden xl:block"></div>

          <button
            onClick={() => setIsSmartAddOpen(true)}
            className="flex items-center whitespace-nowrap px-4 py-2.5 text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-bold"
          >
            <FaMagic className="mr-2" />
            Smart Add
          </button>
        </div>
      </div>

      {/* Board Columns Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-white dark:bg-black">
        <div className="flex h-full gap-4 p-4 md:gap-6 md:p-6 w-max md:w-full snap-x snap-mandatory align-top">
          <DragDropContext onDragEnd={onDragEnd}>
            {data.columnOrder.map((columnId) => {
              const column = filteredData[columnId];
              const cards = column.cardIds.map((cardId) => data.cards[cardId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  cards={cards}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                  onDeleteAllCards={handleDeleteAllCards}
                  isDropDisabled={false}
                  onCardClick={handleCardClick}
                />
              );
            })}
          </DragDropContext>
        </div>
      </div>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        initialData={editingCard}
      />

      {viewingCard && (
        <CardViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingCard(undefined);
          }}
          onEdit={handleViewCardEdit}
          onDelete={handleViewCardDelete}
          card={viewingCard}
          columns={data.columns}
        />
      )}

      <SmartAddModal
        isOpen={isSmartAddOpen}
        onClose={() => setIsSmartAddOpen(false)}
        onAddCards={handleSmartAddCards}
        settings={settings}
      />

      <ConfirmationModal
        isOpen={!!deletingCardId}
        onClose={() => setDeletingCardId(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${(deletingCardId && data.cards[deletingCardId]?.title) || 'this task'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={!!deletingColumnId}
        onClose={() => setDeletingColumnId(null)}
        onConfirm={confirmDeleteAll}
        title="Clear Column"
        message={`Are you sure you want to delete all ${deletingColumnId ? data.columns[deletingColumnId].cardIds.length : 0} tasks in "${deletingColumnId ? data.columns[deletingColumnId].title : ''}"? This action cannot be undone.`}
        confirmLabel="Delete All"
        isDestructive={true}
      />
    </div>
  );
};

export default Board;