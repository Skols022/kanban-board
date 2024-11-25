import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { RootState } from '@/app/store';

import Column from '../Column/Column';
import { moveTask } from '@/features/kanban/kanbanSlice';
import styles from './Board.module.css';
import TaskCard from '../TaskCard/TaskCard';

const Board: FC = () => {
  const dispatch = useDispatch();
  const kanban = useSelector((state: RootState) => state.kanban);
  const [activeTask, setActiveTask] = useState<{
    id: string;
    content: string;
    columnId: string;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const taskId = active.id;
    const columnId = active.data.current?.columnId;
    const task = kanban[columnId].find((t) => t.id === taskId);

    if (task) {
      setActiveTask({ id: task.id, content: task.content, columnId });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId;

    // Find the indices of the active and over items
    const sourceTasks = kanban[sourceColumn];
    const destinationTasks = kanban[destinationColumn];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex =
      overId === undefined
        ? destinationTasks.length // Add to the end if dropped outside a Task
        : destinationTasks.findIndex((t) => t.id === overId);

    if (oldIndex === -1) return;

    dispatch(
      moveTask({
        sourceColumn,
        destinationColumn,
        oldIndex,
        newIndex,
      })
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    if (!over) return;

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId;

    // Find the indices of the active and over items
    const sourceTasks = kanban[sourceColumn];
    const destinationTasks = kanban[destinationColumn];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex = destinationTasks.findIndex((t) => t.id === overId);

    if (oldIndex === -1) return;

    dispatch(
      moveTask({
        sourceColumn,
        destinationColumn,
        oldIndex,
        newIndex,
      })
    );
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {Object.keys(kanban).map((columnId) => (
          <Column key={columnId} columnId={columnId} tasks={kanban[columnId]} />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} sourceColumn={activeTask.columnId} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default Board;
