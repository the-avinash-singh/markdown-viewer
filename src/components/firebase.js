import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCu5k0NZqLKskVdNCfDk_TsM8QmZ7YdJ2s",
    authDomain: "markdown-2b9a0.firebaseapp.com",
    projectId: "markdown-2b9a0",
    storageBucket: "markdown-2b9a0.appspot.com",
    messagingSenderId: "625973736375",
    appId: "1:625973736375:web:9183f7d3f8118a67142e32",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const logToFirebase = async (content) => {
  try {
    await addDoc(collection(db, 'markdownInputs'), {
      content: content,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
