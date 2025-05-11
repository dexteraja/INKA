import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithRedirect, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
    return true;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return false;
  }
};

// Email/Password Registration
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
};

// Email/Password Login
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  if (!auth.currentUser) throw new Error("No user logged in");
  
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL: photoURL || auth.currentUser.photoURL
    });
    return true;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Check if user is new (just created their account)
export const isNewUser = () => {
  const key = "newUser";
  return localStorage.getItem(key) === "true";
};

// Reset the new user flag
export const resetNewUserFlag = () => {
  const key = "newUser";
  localStorage.removeItem(key);
};