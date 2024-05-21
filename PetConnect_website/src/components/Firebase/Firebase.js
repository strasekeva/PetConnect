import { initializeApp } from 'firebase/app';
import 'firebase/auth'; // Uvozite samo tiste Firebase module, ki jih potrebujete
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyApXqxWnhuqZHONWJmnVhUX1KtGNLiAMvk",
    authDomain: "petconnect-d446b.firebaseapp.com",
    projectId: "petconnect-d446b",
    storageBucket: "petconnect-d446b.appspot.com",
    messagingSenderId: "75333442784",
    appId: "1:75333442784:web:a5de84c5884f5f1dff8485"
};


const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
