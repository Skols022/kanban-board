import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';

import { RootState } from '@/app/store';
import Column from '../Column/Column';
import styles from './Board.module.css';
import { moveTicket } from '@/features/kanban/kanbanSlice';

const Board: FC = () => {
  const dispatch = useDispatch();
  const kanban = useSelector((state: RootState) => state.kanban);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const [sourceColumn, activeId] = (active.id as string).split('-');
    const [destinationColumn, overId] = (over.id as string).split('-');

    // Find the indices of the active and over items
    const sourceTickets = kanban[sourceColumn];
    const destinationTickets = kanban[destinationColumn];
    const oldIndex = sourceTickets.findIndex((t) => t.id === activeId);
    const newIndex =
      overId === undefined
        ? destinationTickets.length // Add to the end if dropped outside a ticket
        : destinationTickets.findIndex((t) => t.id === overId);

    if (oldIndex === -1) return;

    dispatch(
      moveTicket({
        sourceColumn,
        destinationColumn,
        oldIndex,
        newIndex,
      })
    );
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {Object.keys(kanban).map((columnId) => (
          <Column key={columnId} columnId={columnId} tickets={kanban[columnId]} />
        ))}
      </div>
    </DndContext>
  );
};

export default Board;
