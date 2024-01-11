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
export const addNoteToArchiveFirebase = createAsyncThunk(
  "addNote/addNoteToArchiveFirebase",
  async ({ id, note }) => {
    const newNote = {
      body: note.body,
      date: note.date,
      time: note.time,
      day: note.day,
      color: note.color,
      archive: true,
    };
    const noteRef = doc(db, "notes", id);
    return await updateDoc(noteRef, newNote);
  },
);
export const removeNoteFromArchiveFirebase = createAsyncThunk(
  "addNote/removeNoteFromArchiveFirebase",
  async ({ id, note }) => {
    const newNote = {
      body: note.body,
      date: note.date,
      time: note.time,
      day: note.day,
      color: note.color,
      archive: false,
    };
    const noteRef = doc(db, "notes", id);
    return await updateDoc(noteRef, newNote);
  },
);

const addNoteSlice = createSlice({
  name: "addNote",

  initialState: {
    notes: [],
    notesClone: [],
    archives: [],
    loading: false,
    error: "",
  },

  reducers: {
    addNotesToStore: (state, action) => {
      state.notes = action.payload;
    },
  },

  extraReducers: (builder) => {
    // getting note from firebase
    builder.addCase(fetchNotesFromFirebase.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNotesFromFirebase.fulfilled, (state, action) => {
      state.loading = false;
      state.notes = action.payload;
      state.notesClone = action.payload;
      const newArchives = action.payload.filter((item) => {
        return item.archive;
      });
      state.archives = [...newArchives];
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
    builder.addCase(updateNoteInFirebase.rejected, (state) => {
      state.error = "Error: Firebase updateDoc()";
    });
    builder.addCase(addNoteToArchiveFirebase.rejected, (state) => {
      state.error = "Error: Firebase updateDocArchiveTrue()";
    });
    builder.addCase(removeNoteFromArchiveFirebase.rejected, (state) => {
      state.error = "Error: Firebase updateDocArchiveFalse()";
    });
  },
});

export const { addNotesToStore } = addNoteSlice.actions;
export default addNoteSlice.reducer;
