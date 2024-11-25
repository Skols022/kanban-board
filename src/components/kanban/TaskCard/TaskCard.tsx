import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  sourceColumn: string;
}

const TaskCard: FC<TaskCardProps> = ({ task, sourceColumn }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      columnId: sourceColumn,
    }
  });
  // console.log("🚀 ~ isDragging:", isDragging, task)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // if (isDragging) {
  //   return (
  //     <div 
  //       className={styles.taskDragging} 
  //       ref={setNodeRef} 
  //       style={style} 
  //       {...attributes} 
  //       {...listeners}
  //     >
  //       Dragging Task
  //     </div>
  //   );
  // }

  return (
    <div 
      className={styles.task} 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
      {task.content}
    </div>
  );
};

export default TaskCard;
