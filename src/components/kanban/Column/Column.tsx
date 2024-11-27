import { ChangeEvent, FC, lazy, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

import styles from './Column.module.css';
import { addTask } from '@/features/kanban/kanbanSlice';
import { useDispatch } from 'react-redux';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Modal from '@/components/shared/Modal/Modal';

const SortableContext = lazy(() =>
  import('@dnd-kit/sortable').then((module) => ({ default: module.SortableContext }))
);
const TaskCard = lazy(() => import('../TaskCard/TaskCard'));

interface ColumnProps {
  columnId: columnId;
  tasks: Task[];
}
const Column: FC<ColumnProps> = ({ columnId, tasks }) => {
  const dispatch = useDispatch();
  const { setNodeRef } = useDroppable({ id: columnId });
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const items = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleAddTask = () => {
    if (newTaskContent.trim() !== '') {
      dispatch(addTask({ columnId, content: newTaskContent }));
      setNewTaskContent('');
      setIsAdding(false);
    }
  };

  const formatColumnName = (name: columnId) => {
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

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h2>
          <span>{formatColumnName(columnId)}</span> <span>({tasks.length})</span>
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
            />
          </Modal>
        )}
        {tasks.map((task) => (
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
