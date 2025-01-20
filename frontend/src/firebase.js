import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC46eArlKOCYHYghMOxHPjiKFCqiFAz-s",
  authDomain: "url-shortner-ec860.firebaseapp.com",
  projectId: "url-shortner-ec860",
  storageBucket: "url-shortner-ec860.firebasestorage.app",
  messagingSenderId: "45867295154",
  appId: "1:45867295154:web:ec66d3dfce7276ac3dc4ab",
  measurementId: "G-1L93SQNLB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics,auth, provider };