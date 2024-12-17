import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "pump-fun.firebaseapp.com",
  projectId: "pump-fun",
  storageBucket: "pump-fun.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c441d5c5f965b29ab99269"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();