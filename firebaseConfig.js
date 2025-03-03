import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyAJ81N6OOixxtLXzQpVEvhqA4mYTRM27k0",
    authDomain: "hair-specialist-finder.firebaseapp.com",
    projectId: "hair-specialist-finder",
    storageBucket: "hair-specialist-finder.firebasestorage.app",
    messagingSenderId: "839305252354",
    appId: "1:839305252354:web:abc66222bb7574f503611b",
    measurementId: "G-SK8C4CFCZJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
