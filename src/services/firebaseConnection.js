import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCZQUyIh4B9UYNr474WNZd_-v5dNntu7Zo",
    authDomain: "calling-system-76cb9.firebaseapp.com",
    projectId: "calling-system-76cb9",
    storageBucket: "calling-system-76cb9.appspot.com",
    messagingSenderId: "970586205942",
    appId: "1:970586205942:web:7001a141682decd0b8c6d7",
    measurementId: "G-YZQ9662JBS"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };
  