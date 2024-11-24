import { UniqueIdentifier } from '@dnd-kit/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface KanbanState {
  [key: string]: Ticket[];
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
    moveTicket: (
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

      const sourceTickets = state[sourceColumn];
      const destinationTickets = state[destinationColumn];

      // Handle cross-column movement
      if (sourceColumn !== destinationColumn) {
        const [movedTicket] = sourceTickets.splice(oldIndex, 1); // Remove from source column
        destinationTickets.splice(newIndex, 0, movedTicket); // Add to destination column
      } else {
        // Reorder within the same column
        const [movedTicket] = sourceTickets.splice(oldIndex, 1); // Remove ticket
        sourceTickets.splice(newIndex, 0, movedTicket); // Add at new index
      }
    },
  },
});

export const { moveTicket } = kanbanSlice.actions;
export default kanbanSlice.reducer;
