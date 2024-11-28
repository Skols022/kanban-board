import { ReactElement } from 'react';
import  { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer, { deleteTask, editTask } from '@/features/kanban/kanbanSlice';
import TaskCard from './TaskCard';

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
  };
});

const mockDispatch = vi.fn();

const mockTask = {
  id: 1,
  content: 'Test task content'
};

const mockColumnId = 'todo';

const renderWithProviders = (ui: ReactElement) => {
  const store = configureStore({
    reducer: {
      kanban: kanbanReducer,
    },
  });

  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('TaskCard Component', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (useDispatch as vi.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the task content', () => {
    renderWithProviders(<TaskCard task={mockTask} columnId={mockColumnId} />);
    expect(screen.getByText('Test task content')).toBeInTheDocument();
  });

  it('enters edit mode on double click', () => {
    renderWithProviders(<TaskCard task={mockTask} columnId={mockColumnId} />);

    const taskCard = screen.getByText('Test task content');
    fireEvent.doubleClick(taskCard);

    expect(screen.getByDisplayValue('Test task content')).toBeInTheDocument();
  });

  it('cancels edit mode when Cancel button is clicked', () => {
    renderWithProviders(<TaskCard task={mockTask} columnId={mockColumnId} />);

    const taskCard = screen.getByText('Test task content');
    fireEvent.doubleClick(taskCard);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByDisplayValue('Test task content')).not.toBeInTheDocument();
  });

  it('dispatches editTask action when Save button is clicked', () => {
    render(
      <TaskCard task={{ id: 1, content: 'Test task content' }} columnId="todo" />
    );

    const taskCard = screen.getByText('Test task content');
    fireEvent.doubleClick(taskCard);

    const textarea = screen.getByDisplayValue('Test task content');
    fireEvent.change(textarea, { target: { value: 'Updated task content' } });

    fireEvent.click(screen.getByText('Save'));

    expect(mockDispatch).toHaveBeenCalledWith(
      editTask({
        taskId: 1,
        columnId: 'todo',
        content: 'Updated task content',
      })
    );
  });

  it('dispatches deleteTask action when Delete button is clicked', () => {
    render(
      <TaskCard task={{ id: 1, content: 'Test task content' }} columnId="todo" />
    );

    const deleteButton = screen.getByText('x');
    fireEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      deleteTask({
        taskId: 1,
        columnId: 'todo',
      })
    );
  });
});