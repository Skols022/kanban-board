import { SetStateAction, Dispatch as ReactDispatch } from 'react';
import { Dispatch } from 'redux';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { moveTask } from '@/features/kanban/kanbanSlice';

import { ActiveTaskProps } from '@/components/kanban/Board/Board';

interface ProcessDragEventParams {
  event: DragEndEvent | DragOverEvent | DragStartEvent;
  columns: Record<columnId, Task[]>;
  dispatch?: Dispatch;
  setActiveTask?: ReactDispatch<SetStateAction<ActiveTaskProps | null>>;
  onStart?: boolean;
  onEnd?: boolean;
}

export const processDragEvent = ({
  event,
  columns,
  dispatch,
  setActiveTask,
  onStart = false,
  onEnd = false,
}: ProcessDragEventParams) => {
  if (onStart && 'active' in event) {
    const { active } = event;
    const taskId = active.id;
    const columnId = active.data.current?.columnId;
    const task = columns[columnId as columnId]?.find((t) => t.id === taskId);

    if (task && setActiveTask) {
      setActiveTask({ id: task.id, content: task.content, columnId });
    }
    return;
  }

  if (onEnd && 'over' in event && 'active' in event) {
    const { active, over } = event;

    if (!over) {
      if (setActiveTask) {
        setActiveTask(null);
      }
      return;
    }

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId || over.id;

    if (!sourceColumn || !destinationColumn) {
      if (setActiveTask) {
        console.error('Invalid drag operation: Missing source or destination column.');
        setActiveTask(null);
      }
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

    if (dispatch) {
      dispatch(
        moveTask({
          sourceColumn,
          destinationColumn,
          oldIndex,
          newIndex,
        })
      );
    }

    if (setActiveTask) {
      setActiveTask(null);
    }
    return;
  }

  if ('over' in event && 'active' in event) {
    const { over, active } = event;

    if (!over) return;

    const activeId = active.id;
    const sourceColumn = active.data.current?.columnId;
    const overId = over.id;
    const destinationColumn = over.data.current?.columnId;

    const sourceTasks = columns[sourceColumn as columnId];
    const destinationTasks = columns[destinationColumn as columnId];
    const oldIndex = sourceTasks.findIndex((t) => t.id === activeId);
    const newIndex = destinationTasks.findIndex((t) => t.id === overId);

    if (oldIndex === -1) return;

    if (dispatch) {
      dispatch(
        moveTask({
          sourceColumn,
          destinationColumn,
          oldIndex,
          newIndex,
        })
      );
    }
  }
};