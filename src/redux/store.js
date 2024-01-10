import { configureStore } from "@reduxjs/toolkit";
import addNoteSlice from "./addNoteSlice";
import addFolderSlice from "./addFolderSlice";
import addArchiveSlice from "./addArchiveSlice";
import addTrashSlice from "./addTrashSlice";

const store = configureStore({
  reducer: {
    note: addNoteSlice,
    folder: addFolderSlice,
    archive: addArchiveSlice,
    trash: addTrashSlice,
  },
});

export default store;
