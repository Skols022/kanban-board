import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type KanbanState = {
  columns: {
    [key in columnId]: Task[];
  };
} & {
  searchTerm?: string | undefined;
};

const initialState: KanbanState = {
  columns: {
    todo: [],
    inProgress: [],
    done: [],
  },
  searchTerm: '',
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    moveTask: (
      state,
      action: PayloadAction<{
        sourceColumn: columnId;
        destinationColumn: columnId;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const { sourceColumn, destinationColumn, oldIndex, newIndex } = action.payload;
      console.log("🚀 ~ sourceColumn:", sourceColumn)

      if (!state.columns[sourceColumn] || !state.columns[destinationColumn]) {
        console.error(
          `Invalid columns: source(${sourceColumn}), destination(${destinationColumn})`
        );
        return;
      }

      const sourceTasks = state.columns[sourceColumn];
      const destinationTasks = state.columns[destinationColumn];

      if (sourceColumn !== destinationColumn) {
        const [movedTask] = sourceTasks.splice(oldIndex, 1);
        destinationTasks.splice(newIndex, 0, movedTask);
      } else {
        const [movedTask] = sourceTasks.splice(oldIndex, 1);
        sourceTasks.splice(newIndex, 0, movedTask);
      }
    },
    addTask: (state, action: PayloadAction<{ columnId: columnId; content: string }>) => {
      const { columnId, content } = action.payload;
      const id = Math.floor(Date.now() * Math.random());
      const newTask = { id, content };

      state.columns[columnId].push(newTask);
    },
    editTask: (
      state,
      action: PayloadAction<{ columnId: columnId; taskId: number; content: string }>
    ) => {
      const { columnId, taskId, content } = action.payload;
      const task = state.columns[columnId].find((t) => t.id === taskId);

      if (task) {
        task.content = content;
      }
    },
    deleteTask: (state, action: PayloadAction<{ columnId: columnId; taskId: number }>) => {
      const { columnId, taskId } = action.payload;

      if (!state.columns[columnId]) return;

      state.columns[columnId] = state.columns[columnId].filter((task) => task.id !== taskId);
    },
    searchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { moveTask, addTask, editTask, deleteTask, searchTerm } = kanbanSlice.actions;
export default kanbanSlice.reducer;
