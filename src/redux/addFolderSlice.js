import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config/firebaseConfig";

//TODO: get
export const getAllFoldersFromFirebase = createAsyncThunk(
  "addFolder/getAllFoldersFromFirebase",
  async () => {
    const querySnapshot = await getDocs(collection(db, "folders"));
    const newFolders = [];
    querySnapshot.forEach((doc) => {
      newFolders.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return newFolders;
  },
);

//TODO: add
export const addFolderToFirebase = createAsyncThunk(
  "addFolder/addFolderToFirebase",
  async (folder) => {
    const { id } = await addDoc(collection(db, "folders"), folder);
    return id;
  },
);

//TODO: delete
export const deleteFolderFromFirebase = createAsyncThunk(
  "addFolder/deleteFolderFromFirebase",
  async (id) => {
    return await deleteDoc(doc(db, "folders", id));
  },
);

//TODO: update
export const updateFolderInFirebase = createAsyncThunk(
  "addFolder/updateFolderInFirebase",
  async ({ id, folder }) => {
    return await updateDoc(doc(db, "folders", id), folder);
  },
);

//TODO: get notes from notes db with currespond noteId in folders.notes

const addFolderSlice = createSlice({
  name: "addFolder",
  initialState: {
    folders: [],
    foldersClone: [],
    loading: false,
    error: "",
  },
  reducers: {
    addFoldersToStore: (state, action) => {
      state.folders = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders.addCase(getAllFoldersFromFirebase.pending, (state) => {
      state.loading = true;
    });
    builders.addCase(getAllFoldersFromFirebase.fulfilled, (state, action) => {
      state.loading = false;
      state.folders = action.payload;
      state.foldersClone = action.payload;
    });
    builders.addCase(getAllFoldersFromFirebase.rejected, (state) => {
      state.loading = false;
      state.error = "Error, getDocs, getAllFoldersFromFirebase";
    });
    builders.addCase(addFolderToFirebase.rejected, (state) => {
      state.error = "Error,addDoc, addFolderToFirebase";
    });
    builders.addCase(deleteFolderFromFirebase.rejected, (state) => {
      state.error = "Error,deleteDoc, deleteFolderFromFirebase";
    });
  },
});

export const { addFoldersToStore } = addFolderSlice.actions;
export default addFolderSlice.reducer;
