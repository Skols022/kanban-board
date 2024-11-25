import { FC, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import TaskCard from '../TaskCard/TaskCard';
import styles from './Column.module.css';

interface ColumnProps {
  columnId: string;
  tasks: Task[];
}
const Column: FC<ColumnProps> = ({ columnId, tasks }) => {
  const { setNodeRef } = useDroppable({ id: columnId });
  const items = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div ref={setNodeRef} className={styles.column}>
      <h2>
        {columnId} ({tasks.length})
      </h2>
      {/* <button onClick={() => handleAddTask(columnId)}>+</button> */}
      {tasks.map((task) => (
        <SortableContext
          key={task.id}
          id={columnId}
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <TaskCard task={task} sourceColumn={columnId} />
        </SortableContext>
      ))}
    </div>
  );
};

export default Column;
