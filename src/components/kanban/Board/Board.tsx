import { FC, useState, lazy, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDebouncedCallback } from 'use-debounce';

import { RootState } from '@/app/store';
import { moveTask } from '@/features/kanban/kanbanSlice';
import styles from './Board.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useBreakpoint } from '@/hooks/useBreakPoint';

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
  const { tabletMain } = useBreakpoint();
  const { columns } = useSelector((state: RootState) => state.kanban);
  const dragContext = useMemo(() => {
    return Object.keys(columns).map((columnId) => ({
      columnId: columnId as columnId,
      tasks: columns[columnId as columnId],
    }));
  }, [columns]);
  const [activeTask, setActiveTask] = useState<ActiveTaskProps | null>(null);

  const detectSensor = () => (tabletMain ? TouchSensor : PointerSensor);

  const sensors = useSensors(
    useSensor(detectSensor(), {
      activationConstraint: { delay: 80, tolerance: 25 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const taskId = active.id;
    const columnId = active.data.current?.columnId;
    const task = columns[columnId as columnId].find((t) => t.id === taskId);

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
    const destinationColumn = over.data.current?.columnId || over.id;

    if (!sourceColumn || !destinationColumn) {
      console.error('Invalid drag operation: Missing source or destination column.');
      setActiveTask(null);
      return;
    }

    const sourceTasks = columns[sourceColumn as columnId];
    const destinationTasks = columns[destinationColumn as columnId];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex =
      destinationTasks && destinationTasks.length > 0
        ? destinationTasks.findIndex((t) => t.id === overId)
        : 0;

    if (oldIndex === -1) return;

    dispatch(
      moveTask({
        sourceColumn,
        destinationColumn,
        oldIndex,
        newIndex,
      })
    );

    setActiveTask(null);
  };

  const handleDragOver = useDebouncedCallback((event: DragOverEvent) => {
    const { over, active } = event;

    if (!over) return;

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId;

    // Find the indices of the active and over items
    const sourceTasks = columns[sourceColumn as columnId];
    const destinationTasks = columns[destinationColumn as columnId];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex = destinationTasks.findIndex((t) => t.id === overId);
    console.log("🚀 ~ handleDragOver ~ sourceTasks:", sourceTasks, destinationTasks)

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
    <div className={styles.board} data-testid="dnd-context">
      <Suspense fallback={<LoadingSpinner />}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {dragContext.map(({ columnId, tasks }) => (
            <Suspense key={columnId} fallback={<LoadingSpinner />}>
              <Column columnId={columnId} tasks={tasks} />
            </Suspense>
          ))}
          {createPortal(
            <DragOverlay>
              {activeTask && (
                <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </div>
  );
};

export default Board;
