import { createSlice } from "@reduxjs/toolkit";

const addFolderSlice = createSlice({
  name: "addFolder",
  initialState: {
    folders: [],
  },
  reducers: {
    addFoldersToStore: (state, action) => {
      state.folders = action.payload;
    },
  },
});

export const { addFoldersToStore } = addFolderSlice.actions;
export default addFolderSlice.reducer;
