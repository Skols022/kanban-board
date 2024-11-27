import { FC, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './TaskCard.module.css';
import { useDispatch } from 'react-redux';
import { deleteTask, editTask } from '@/features/kanban/kanbanSlice';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { addCorrespondingBackground } from '@/util/addCorrespondingBackground';

interface TaskCardProps {
  task: Task;
  columnId: columnId;
}

const TaskCard: FC<TaskCardProps> = ({ task, columnId }) => {
  const dispatch = useDispatch();
  const dragData = useMemo(() => ({ columnId }), [columnId]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState<string>(task.content);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: dragData,
  });

  
  const handleEdit = () => {
    console.log('EDITING:', isEditing);
    if (content.trim() !== task.content) {
      dispatch(editTask({ columnId, taskId: task.id, content }));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask({ columnId, taskId: task.id }));
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      className={styles.task}
      ref={setNodeRef}
      style={{
        ...style,
        '--background': `${addCorrespondingBackground(columnId)}`,
      }}
      {...attributes}
      {...(isEditing ? {} : listeners)}
      onDoubleClick={() => setIsEditing(true)}
    >
      {!isEditing && (
        <span className={styles.deleteButtonWrapper}>
          <Button onClick={handleDelete}>
            x
          </Button>
        </span>
      )}
      {isEditing ? (
        <>
          <Input
            isTextArea
            onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
            value={content}
          />
          <div className={styles.editButtonWrapper}>
            <Button onClick={handleEdit}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <p className={styles.content}>{task.content}</p>
      )}
    </div>
  );
};

export default TaskCard;
