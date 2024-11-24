import { FC } from 'react';
import { moveTicket } from '@/features/kanban/kanbanSlice';
import Ticket from '../Ticket/Ticket';
import styles from './Column.module.css';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  columnId: string;
  tickets: Ticket[];
}
const Column: FC<ColumnProps> = ({ columnId, tickets }) => {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <SortableContext
      id={columnId}
      items={tickets.map((ticket) => `${columnId}-${ticket.id}`)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className={styles.column}>
        <h2>
          {columnId} ({tickets.length})
        </h2>
        {tickets.map((ticket, index) => (
          <Ticket key={ticket.id} ticket={ticket} sourceColumn={columnId} index={index} />
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
