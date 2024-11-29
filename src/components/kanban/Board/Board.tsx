import { FC, useState, lazy, Suspense, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector, } from 'react-redux';
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDebouncedCallback } from 'use-debounce';

import { RootState } from '@/app/store';
import styles from './Board.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useBreakpoint } from '@/hooks/useBreakPoint';
import { processDragEvent } from '@/util/processDragEvent';

const Column = lazy(() => import('../Column/Column'));
const TaskCard = lazy(() => import('../TaskCard/TaskCard'));
const DndContext = lazy(() =>
  import('@dnd-kit/core').then((module) => ({ default: module.DndContext }))
);
const DragOverlay = lazy(() =>
  import('@dnd-kit/core').then((module) => ({ default: module.DragOverlay }))
);

export interface ActiveTaskProps extends Task {
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
    }),
    useSensor(MouseSensor)
  );

  const handleDragOver = useDebouncedCallback((event: DragOverEvent) => {
    processDragEvent({
      event,
      columns,
      dispatch,
      setActiveTask,
      onStart: true,
    });
  }, 100);

  return (
    <div className={styles.board} data-testid='dnd-context'>
      <Suspense fallback={<LoadingSpinner />}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event: DragStartEvent) =>
            processDragEvent({
              event,
              columns,
              setActiveTask,
              onStart: true,
            })
          }
          onDragEnd={(event: DragEndEvent) =>
            processDragEvent({
              event,
              columns,
              dispatch,
              setActiveTask,
              onEnd: true,
            })
          }
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
