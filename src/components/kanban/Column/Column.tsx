import { ChangeEvent, FC, lazy, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/app/store';
import { addTask } from '@/features/kanban/kanbanSlice';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/shared/Modal/Modal';
import styles from './Column.module.css';

const SortableContext = lazy(() =>
  import('@dnd-kit/sortable').then((module) => ({ default: module.SortableContext }))
);
const TaskCard = lazy(() => import('../TaskCard/TaskCard'));

interface ColumnProps {
  columnId: columnId;
  tasks: Task[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const formatColumnName = (name: columnId | string) => {
  switch (name) {
    case 'todo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return name;
  }
};

const Column: FC<ColumnProps> = ({ columnId, tasks }) => {
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state: RootState) => state.kanban);
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: {
      columnId,
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const items = useMemo(() => {
    if (!Array.isArray(tasks)) {
      console.error(`Tasks is not an array for column: ${columnId}`, tasks);
      return [];
    }
    if (!searchTerm) return tasks;
    return tasks.filter((task) => task.content.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tasks, searchTerm, columnId]);

  const handleAddTask = () => {
    if (newTaskContent.trim() !== '') {
      dispatch(addTask({ columnId, content: newTaskContent }));
      setNewTaskContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.column} data-testid={`column-${columnId}`}>
      <div className={styles.columnHeader}>
        <h2>
          <span>{formatColumnName(columnId)}</span> <span>({items.length})</span>
        </h2>
        <Button onClick={() => setIsAdding(true)}>+</Button>
      </div>
      <div className={styles.columnContent} ref={setNodeRef}>
        {isAdding && (
          <Modal
            open
            title={`Add task to ${formatColumnName(columnId)}`}
            onClose={() => setIsAdding(false)}
            actions={
              <>
                <Button onClick={handleAddTask}>Add</Button>
                <Button onClick={() => setIsAdding(false)}>Cancel</Button>
              </>
            }
            columnId={columnId}
          >
            <Input
              isTextArea
              value={newTaskContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewTaskContent(e.target.value)}
              placeholder={`Enter task content for ${formatColumnName(columnId)}`}
            />
          </Modal>
        )}
        {items.map((task) => (
          <SortableContext
            key={task.id}
            id={columnId}
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <TaskCard task={task} columnId={columnId} />
          </SortableContext>
        ))}
      </div>
    </div>
  );
};

export default Column;
