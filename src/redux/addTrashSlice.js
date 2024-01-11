import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase-config/firebaseConfig";
import {
  getDocs,
  addDoc,
  collection,
  doc,
  deleteDoc,
} from "firebase/firestore";

//TODO: get trashes
export const getNotesFromTrashFirebase = createAsyncThunk(
  "addTrash/getNotesFromTrash",
  async () => {
    const querySnapshot = await getDocs(collection(db, "trashes"));
    const newNotes = [];
    querySnapshot.forEach((doc) => {
      newNotes.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return newNotes;
  },
);

//TODO: add (when deleting note)
export const addNoteToTrashFirebase = createAsyncThunk(
  "addTrash/addNoteToTrashFirebase",
  async (note) => {
    const result = await addDoc(collection(db, "trashes"), note);
    return result?.id;
  },
);

//TODO: delete (restore to notesdb)
export const deleteNoteFromTrashFirebase = createAsyncThunk(
  "addTrash/deleteNoteFromTrash",
  async (id) => {
    return await deleteDoc(doc(db, "trashes", id));
  },
);

const addTrashSlice = createSlice({
  name: "addTrash",
  initialState: {
    trashes: [],
    loading: false,
    error: "",
  },
  reducers: {
    addTrashToStore: (state, action) => {
      state.trashes = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders.addCase(getNotesFromTrashFirebase.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(getNotesFromTrashFirebase.fulfilled, (state, action) => {
      state.loading = false;
      state.trashes = action.payload;
    });
    builders.addCase(getNotesFromTrashFirebase.rejected, (state) => {
      state.loading = false;
      state.error = "Error: getNotesFromTrash getDocs()";
    });
    builders.addCase(addNoteToTrashFirebase.rejected, (state) => {
      state.error = "Error: addNoteToTrashFirebase addDoc()";
    });
    builders.addCase(deleteNoteFromTrashFirebase.rejected, (state) => {
      state.error = "Error:  deleteNoteFromTrashFirebase addDoc()";
    });
  },
});

export const { addTrashToStore } = addTrashSlice.actions;
export default addTrashSlice.reducer;
