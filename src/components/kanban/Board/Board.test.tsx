import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Board from './Board';
import kanbanReducer, { KanbanState, moveTask } from '@/features/kanban/kanbanSlice';
import { vi } from 'vitest';
import { ReactNode, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { DndContext, PointerSensor, TouchSensor, useSensors } from '@dnd-kit/core';

vi.mock('../Column/Column.tsx', () => ({
  __esModule: true,
  default: ({ columnId, tasks }: { columnId: string; tasks: Task[] }) => (
    <div data-testid={`column-${columnId}`}>
      {tasks.map((task) => (
        <div key={task.id} data-testid={`task-${task.id}`}>
          {task.content}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../TaskCard/TaskCard.tsx', () => ({
  __esModule: true,
  default: ({ task }: { task: Task }) => <div data-testid={`task-${task.id}`}>{task.content}</div>,
}));

vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual<typeof import('@dnd-kit/core')>('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }: { children: ReactNode }) => (
      <div data-testid='dnd-context'>{children}</div>
    ),
    useSensor: vi.fn(() => ({})),
    useSensors: vi.fn(() => []),
    closestCorners: vi.fn(() => []),
    PointerSensor: vi.fn(),
    TouchSensor: vi.fn(),
  };
});

const renderWithProviders = (ui: JSX.Element, preloadedState?: { kanban: KanbanState }) => {
  const store = configureStore({
    reducer: { kanban: kanbanReducer },
    preloadedState,
  });

  return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

const mockDispatch = vi.fn();

const mockColumns = {
  todo: [
    { id: 1, content: 'Task 1' },
    { id: 2, content: 'Task 2' },
  ],
  inProgress: [],
  done: [],
};

describe('Board Component', () => {
  it('renders all columns correctly', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    expect(await screen.findByTestId('column-todo')).toBeInTheDocument();
    expect(await screen.findByTestId('column-inProgress')).toBeInTheDocument();
    expect(await screen.findByTestId('column-done')).toBeInTheDocument();
  });

  it('handles drag-and-drop start correct', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    const task = screen.getByTestId('task-1');
    await userEvent.pointer({ target: task, keys: 'pointerdown' });

    expect(await screen.findByTestId('task-1')).toBeInTheDocument();
  });

  it('dispatches moveTask action on drag-and-drop end', async () => {
    const mockHandleDragEnd = vi.fn();
    const { store } = renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <DndContext onDragEnd={mockHandleDragEnd}>
          <Board />
        </DndContext>
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    const mockDispatch = vi.spyOn(store, 'dispatch');

    const mockActive = { id: 1, data: { current: { columnId: 'todo' } } };
    const mockOver = { id: 1, data: { current: { columnId: 'inProgress' } } };

    const dndContext = await screen.findByTestId('dnd-context');
    fireEvent.touchStart(dndContext, { detail: { active: mockActive } });
    fireEvent.touchMove(dndContext, { detail: { active: mockActive, over: mockOver } });
    fireEvent.touchEnd(dndContext, { detail: { active: mockActive, over: mockOver } });

    expect(mockDispatch).toHaveBeenCalledWith(
      moveTask({
        sourceColumn: 'todo',
        destinationColumn: 'inProgress',
        oldIndex: 0,
        newIndex: 0,
      })
    );
  });
});
