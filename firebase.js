// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjVxBMs-mwxXchuv0UaWVdK75lRqPbH7g",
  authDomain: "defter-b9df5.firebaseapp.com",
  projectId: "defter-b9df5",
  storageBucket: "defter-b9df5.appspot.com",
  messagingSenderId: "918473706095",
  appId: "1:918473706095:web:745b6a70119025bfe85b9a",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_DB };
