import { FC, useState, lazy, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDebouncedCallback } from 'use-debounce';

import { RootState } from '@/app/store';
import { moveTask } from '@/features/kanban/kanbanSlice';
import styles from './Board.module.css';

const Column = lazy(() => import('../Column/Column'));
const TaskCard = lazy(() => import('../TaskCard/TaskCard'));
const DndContext = lazy(() =>
  import('@dnd-kit/core').then((module) => ({ default: module.DndContext }))
);
const DragOverlay = lazy(() =>
  import('@dnd-kit/core').then((module) => ({ default: module.DragOverlay }))
);

interface ActiveTaskProps extends Task {
  columnId: columnId;
}

const Board: FC = () => {
  const dispatch = useDispatch();
  const kanban = useSelector((state: RootState) => state.kanban);
  const dragContext = useMemo(() => {
    return Object.keys(kanban).map((columnId) => ({
      columnId: columnId as columnId,
      tasks: kanban[columnId as columnId],
    }));
  }, [kanban]);
  const [activeTask, setActiveTask] = useState<ActiveTaskProps | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 80, tolerance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const taskId = active.id;
    const columnId = active.data.current?.columnId;
    const task = kanban[columnId as columnId].find((t) => t.id === taskId);

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
    const sourceTasks = kanban[sourceColumn as columnId];
    const destinationTasks = kanban[destinationColumn as columnId];
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

  const handleDragOver = useDebouncedCallback((event: DragOverEvent) => {
    const { over, active } = event;

    if (!over) return;

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId;

    // Find the indices of the active and over items
    const sourceTasks = kanban[sourceColumn as columnId];
    const destinationTasks = kanban[destinationColumn as columnId];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex = destinationTasks.findIndex((t) => t.id === overId);
    console.log('🚀 ~ handleDragOver ~ destinationTasks:', destinationTasks, oldIndex, newIndex);

    if (oldIndex === -1) return;
    dispatch(
      moveTask({
        sourceColumn,
        destinationColumn,
        oldIndex,
        newIndex,
      })
    );
  }, 100);

  return (
    <div className={styles.board}>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {dragContext.map(({ columnId, tasks }) => (
        <Suspense key={columnId} fallback={<div>Loading...</div>}>
          <Column columnId={columnId} tasks={tasks} />
        </Suspense>
      ))}
      {createPortal(
        <DragOverlay>
          {activeTask && (
            <Suspense fallback={<div>Loading...</div>}>
              <TaskCard
                task={{ id: activeTask.id, content: activeTask.content }}
                columnId={activeTask.columnId}
              />
            </Suspense>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
    </div>
  );
};

export default Board;
