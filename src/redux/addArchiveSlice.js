import { createSlice } from "@reduxjs/toolkit";

const addArchiveSlice = createSlice({
  name: "addArchive",
  initialState: {
    archives: [],
  },
  reducers: {
    addArchivesToStore: (state, action) => {
      state.archives = action.payload;
    },
  },
});

export const { addArchivesToStore } = addArchiveSlice.actions;
export default addArchiveSlice.reducer;
