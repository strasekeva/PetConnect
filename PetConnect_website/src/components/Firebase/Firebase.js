import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyApXqxWnhuqZHONWJmnVhUX1KtGNLiAMvk",
    authDomain: "petconnect-d446b.firebaseapp.com",
    projectId: "petconnect-d446b",
    storageBucket: "petconnect-d446b.appspot.com",
    messagingSenderId: "75333442784",
    appId: "1:75333442784:web:a5de84c5884f5f1dff8485"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Dodajanje inicializacije Cloud Storage

export { firestore, auth, storage }; // Export auth, firestore, and storage
