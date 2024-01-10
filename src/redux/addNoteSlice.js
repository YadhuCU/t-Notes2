import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config/firebaseConfig";

export const fetchNotesFromFirebase = createAsyncThunk(
  "addNote/fetchNotesFromFirebase",
  async () => {
    const querySnapshot = await getDocs(collection(db, "notes"));
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
export const addNoteToFirebase = createAsyncThunk(
  "addNote/addNoteToFirebase",
  async (note) => {
    const result = await addDoc(collection(db, "notes"), note);
    return result.id;
  },
);
export const deleteNoteFromFirebase = createAsyncThunk(
  "addNote/deleteNoteFromFirebase",
  async (id) => {
    return await deleteDoc(doc(db, "notes", id));
  },
);
export const updateNoteInFirebase = createAsyncThunk(
  "addNote/updateNoteInFirebase",
  async ({ id, updatedNote }) => {
    const noteRef = doc(db, "notes", id);
    return await updateDoc(noteRef, updatedNote);
  },
);

const addNoteSlice = createSlice({
  name: "addNote",
  initialState: {
    notes: [],
    loading: false,
    error: "",
  },
  extraReducers: (builder) => {
    // getting note from firebase
    builder.addCase(fetchNotesFromFirebase.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNotesFromFirebase.fulfilled, (state, action) => {
      state.loading = false;
      state.notes = action.payload;
    });
    builder.addCase(fetchNotesFromFirebase.rejected, (state) => {
      state.loading = false;
      state.error = "Error: Firebase getDocs()";
    });
    // add note to firebase rejected
    builder.addCase(addNoteToFirebase.rejected, (state) => {
      state.error = "Error: Firebase addDocs()";
    });
    // delete note from firebase rejected
    builder.addCase(deleteNoteFromFirebase.rejected, (state) => {
      state.error = "Error: Firebase deleteDoc()";
    });
    // delete note from firebase rejected
    builder.addCase(updateNoteInFirebase.pending, (state, action) => {
      console.log("updateNoteInFirebase pending", action.payload);
    });
    // delete note from firebase rejected
    builder.addCase(updateNoteInFirebase.fulfilled, (state, action) => {
      console.log("updateNoteInFirebase fulfilled", action.payload);
    });
    // delete note from firebase rejected
    builder.addCase(updateNoteInFirebase.rejected, (state, action) => {
      console.log("updateNoteInFirebase rejected", action.payload);
      state.error = "Error: Firebase updateDoc()";
    });
  },
});

export const { addNotesToStore } = addNoteSlice.actions;
export default addNoteSlice.reducer;
