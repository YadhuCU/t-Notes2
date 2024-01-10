import { createSlice } from "@reduxjs/toolkit";

const addTrashSlice = createSlice({
  name: "addTrash",
  initialState: {
    trashes: [],
  },
  reducers: {
    addTrashToStore: (state, action) => {
      state.trashes = action.payload;
    },
  },
});

export const { addTrashToStore } = addTrashSlice.actions;
export default addTrashSlice.reducer;
