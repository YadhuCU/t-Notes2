import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOBq6Jgnto4UcRn49XITLi1wOLJwPiA3A",
  authDomain: "t-note-f8f70.firebaseapp.com",
  projectId: "t-note-f8f70",
  storageBucket: "t-note-f8f70.appspot.com",
  messagingSenderId: "812549982732",
  appId: "1:812549982732:web:0b0e8fe9a8e3fcb0967c29",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
