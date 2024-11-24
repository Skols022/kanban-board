import { FC } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// import styles from './Ticket.module.css';

interface TicketProps {
  ticket: Ticket;
  sourceColumn: string;
  index: number;
}

const Ticket: FC<TicketProps> = ({ ticket, sourceColumn }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `${sourceColumn}-${ticket.id}`,
  });
  console.log('🚀 ~ transform:', transform);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
    backgroundColor: isDragging ? '#f0f8ff' : '#fff',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '3px',
    boxShadow: isDragging ? '0 5px 10px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.2)',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {ticket.content}
    </div>
  );
};

export default Ticket;
