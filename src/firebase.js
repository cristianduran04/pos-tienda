// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDrpJKBoWG0oUN9IWrtDs6blBYIaoE0thQ",
  authDomain: "pos-tiendas.firebaseapp.com",
  projectId: "pos-tiendas",
  storageBucket: "pos-tiendas.firebasestorage.app",
  messagingSenderId: "1023380477097",
  appId: "1:1023380477097:web:dabe141d6dc93c4b4e05b8",
  measurementId: "G-7XZJPQSQK0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // ✅ esto es clave
const db = getFirestore(app);

export { auth, db };
