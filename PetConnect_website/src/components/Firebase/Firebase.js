import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Import Firestore

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

export { firestore, auth }; // Export both firestore and auth

