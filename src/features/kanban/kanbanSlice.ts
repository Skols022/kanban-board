import { createSlice } from "@reduxjs/toolkit";

interface Ticket {
  id: string;
  content: string;
}

interface KanbanState {
  [key: string]: Ticket[];
}

const initialState: KanbanState = {};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {},
});

export default kanbanSlice.reducer;
