import { Suspense, useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Board from './Board';
import kanbanReducer, { KanbanState } from '@/features/kanban/kanbanSlice';
import { vi } from 'vitest';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

vi.mock('../Column/Column.tsx', () => ({
  __esModule: true,
  default: ({ columnId, tasks }: { columnId: string; tasks: Task[] }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(() => setLoaded(true), 500);
      return () => clearTimeout(timeout);
    }, []);

    if (!loaded) {
      return <div data-testid={`loading-column-${columnId}`}>Loading...</div>;
    }

    return (
      <div data-testid={`column-${columnId}`}>
        {tasks.map((task) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.content}
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock('../TaskCard/TaskCard.tsx', () => ({
  __esModule: true,
  default: ({ task }: { task: Task }) => <div data-testid={`task-${task.id}`}>{task.content}</div>,
}));

const renderWithProviders = (ui: JSX.Element, preloadedState?: { kanban: KanbanState }) => {
  const store = configureStore({
    reducer: { kanban: kanbanReducer },
    preloadedState,
  });

  return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

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

  it('renders the correct number of tasks in each column', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    const todoTasks = await screen.findAllByTestId(/task-/);
    expect(todoTasks).toHaveLength(2);
  });

  it('renders tasks with correct content', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
  });

  it('displays the fallback loader while loading components', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    expect(screen.getByTestId('loading-column-todo')).toBeInTheDocument();

    expect(await screen.findByTestId('column-todo')).toBeInTheDocument();
  });

  it('handles drag-and-drop start correct', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Board />
      </Suspense>,
      { kanban: { columns: mockColumns } }
    );

    const task = await screen.findByTestId('task-1');
    await userEvent.pointer({ target: task, keys: 'pointerdown' });

    expect(await screen.findByTestId('task-1')).toBeInTheDocument();
  });
});
