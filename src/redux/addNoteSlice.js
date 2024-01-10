import { createSlice } from "@reduxjs/toolkit";

const addNoteSlice = createSlice({
  name: "addNote",
  initialState: {
    notes: [],
  },
  reducers: {
    addNotesToStore: (state, action) => {
      state.notes = action.payload;
    },
  },
});

export const { addNotesToStore } = addNoteSlice.actions;
export default addNoteSlice.reducer;
