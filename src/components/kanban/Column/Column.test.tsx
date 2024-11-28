import { ReactElement, Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import kanbanReducer, { addTask } from '@/features/kanban/kanbanSlice';
import Column, { formatColumnName } from './Column';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

const mockDispatch = vi.fn();

const mockColumnId = 'todo';
const mockTasks = [
  { id: 1, content: 'Task 1' },
  { id: 2, content: 'Task 2' },
];

const renderWithProviders = (ui: ReactElement) => {
  const store = configureStore({
    reducer: { kanban: kanbanReducer },
    preloadedState: {
      kanban: {
        searchTerm: '',
        columns: {
          todo: mockTasks,
          inProgress: [],
          done: [],
        },
      },
    },
  });

  return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

describe('Column Component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (useDispatch as vi.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders column title and task count', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );

    expect(await screen.findByText('To Do')).toBeInTheDocument();
    expect(await screen.findByText('(2)')).toBeInTheDocument();
  });

  it('renders tasks correctly', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );

    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
  });

  it('opens the add task modal when the "+" button is clicked', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );

    fireEvent.click(screen.getByText('+'));
    expect(await screen.findByText('Add task to To Do')).toBeInTheDocument();
  });

  it('closes the modal when "Cancel" button is clicked', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );

    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add task to To Do')).not.toBeInTheDocument();
  });

  it('dispatches the addTask action when "Add" button is clicked', async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );

    fireEvent.click(screen.getByText('+'));
    const textarea = screen.getByPlaceholderText('Enter task content for To Do');
    fireEvent.change(textarea, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add'));

    expect(mockDispatch).toHaveBeenCalledWith(
      addTask({ columnId: mockColumnId, content: 'New Task' })
    );
  });

  it('filters tasks based on searchTerm', async () => {
    const { store } = renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );
    store.dispatch({ type: 'kanban/searchTerm', payload: 'Task 1' });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  });

  it('renders no tasks when searchTerm does not match', async () => {
    const { store } = renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={mockTasks} />
      </Suspense>
    );
    store.dispatch({ type: 'kanban/searchTerm', payload: 'Nonexistent Task' });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  });

  it('handles empty task array gracefully', () => {
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={[]} />
      </Suspense>
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('(0)')).toBeInTheDocument();
  });

  it('logs an error when tasks is not an array', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <Suspense fallback={<LoadingSpinner />}>
        <Column columnId={mockColumnId} tasks={null as never} />
      </Suspense>
    );

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining(`Tasks is not an array for column: ${mockColumnId}`),
      null
    );

    consoleError.mockRestore();
  });
});

describe('formatColumnName', () => {
  it('returns "To Do" for "todo"', () => {
    expect(formatColumnName('todo')).toBe('To Do');
  });

  it('returns "In Progress" for "inProgress"', () => {
    expect(formatColumnName('inProgress')).toBe('In Progress');
  });

  it('returns "Done" for "done"', () => {
    expect(formatColumnName('done')).toBe('Done');
  });

  it('returns the input string if no match is found', () => {
    expect(formatColumnName('unknown')).toBe('unknown');
  });
});
