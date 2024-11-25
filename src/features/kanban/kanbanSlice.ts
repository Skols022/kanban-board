import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface KanbanState {
  [key: string]: Task[];
}

const initialState: KanbanState = {
  todo: [
    { id: '1', content: 'Review request for proposal' },
    { id: '2', content: 'Develop BIM model of wind shear impact' },
  ],
  inProgress: [
    { id: '3', content: 'Prepare for client meeting with Addisons' },
    { id: '4', content: 'Addison client meeting Thursday 11 a.m.' },
  ],
  done: [{ id: '5', content: 'Write meeting minutes from client meeting' }],
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    moveTask: (
      state,
      action: PayloadAction<{
        sourceColumn: string;
        destinationColumn: string;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const { sourceColumn, destinationColumn, oldIndex, newIndex } = action.payload;

      if (!state[sourceColumn] || !state[destinationColumn]) {
        console.error(
          `Invalid columns: source(${sourceColumn}), destination(${destinationColumn})`
        );
        return;
      }

      const sourceTasks = state[sourceColumn];
      const destinationTasks = state[destinationColumn];

      // Handle cross-column movement
      if (sourceColumn !== destinationColumn) {
        const [movedTask] = sourceTasks.splice(oldIndex, 1); // Remove from source column
        destinationTasks.splice(newIndex, 0, movedTask); // Add to destination column
      } else {
        // Reorder within the same column
        const [movedTask] = sourceTasks.splice(oldIndex, 1); // Remove Task
        sourceTasks.splice(newIndex, 0, movedTask); // Add at new index
      }
    },
  },
});

export const { moveTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
