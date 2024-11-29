import kanbanReducer, {
  moveTask,
  addTask,
  editTask,
  deleteTask,
  searchTerm,
  KanbanState,
} from '@/features/kanban/kanbanSlice';

describe('kanbanSlice reducers', () => {
  const initialState: KanbanState = {
    columns: {
      todo: [
        { id: 1, content: 'Task 1' },
        { id: 2, content: 'Task 2' },
      ],
      inProgress: [
        { id: 3, content: 'Task 3' },
        { id: 4, content: 'Task 4' },
      ],
      done: [{ id: 5, content: 'Task 5' }],
    },
    searchTerm: '',
  };

  it('should handle moveTask between columns', () => {
    const action = moveTask({
      sourceColumn: 'todo',
      destinationColumn: 'inProgress',
      oldIndex: 0,
      newIndex: 0,
    });

    const newState = kanbanReducer(initialState, action);

    expect(newState.columns.todo).toHaveLength(1);
    expect(newState.columns.inProgress).toHaveLength(3);
    expect(newState.columns.inProgress[0]).toEqual({
      id: 1,
      content: 'Task 1',
    });
  });

  it('should handle moveTask within the same column', () => {
    const action = moveTask({
      sourceColumn: 'todo',
      destinationColumn: 'todo',
      oldIndex: 0,
      newIndex: 1,
    });

    const newState = kanbanReducer(initialState, action);

    expect(newState.columns.todo).toHaveLength(2);
    expect(newState.columns.todo[0].id).toBe(2);
    expect(newState.columns.todo[1].id).toBe(1);
  });

  it('should handle addTask', () => {
    const action = addTask({ columnId: 'todo', content: 'New Task' });
    const newState = kanbanReducer(initialState, action);

    expect(newState.columns.todo).toHaveLength(3);
    expect(newState.columns.todo[2]).toEqual(
      expect.objectContaining({ content: 'New Task' })
    );
  });

  it('should handle editTask', () => {
    const action = editTask({
      columnId: 'todo',
      taskId: 1,
      content: 'Updated Task Content',
    });

    const newState = kanbanReducer(initialState, action);

    expect(newState.columns.todo[0].content).toBe('Updated Task Content');
  });

  it('should handle deleteTask', () => {
    const action = deleteTask({ columnId: 'todo', taskId: 1 });
    const newState = kanbanReducer(initialState, action);

    expect(newState.columns.todo).toHaveLength(1);
    expect(newState.columns.todo[0].id).toBe(2);
  });

  it('should handle searchTerm', () => {
    const action = searchTerm('new search term');
    const newState = kanbanReducer(initialState, action);

    expect(newState.searchTerm).toBe('new search term');
  });

  it('should handle unknown action', () => {
    const newState = kanbanReducer(initialState, { type: 'unknown' });

    expect(newState).toEqual(initialState);
  });
});
