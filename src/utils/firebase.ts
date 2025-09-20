import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8gzBQFMgFThPqAIJ3CJ1rQOD_Vj5ojeE",
  authDomain: "theneomind.firebaseapp.com",
  projectId: "theneomind",
  storageBucket: "theneomind.firebasestorage.app",
  messagingSenderId: "572987263517",
  appId: "1:572987263517:web:4a00eed94542bf4e5e94f4",
  measurementId: "G-L9DGW17CB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
