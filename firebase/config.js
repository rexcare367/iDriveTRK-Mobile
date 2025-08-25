import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRmfOueVJPxfKWbCLSqXb2MFCWdE9b9HQ",
  authDomain: "idrivetrk.firebaseapp.com",
  projectId: "idrivetrk",
  storageBucket: "idrivetrk.firebaseapp.com",
  messagingSenderId: "595265629564",
  appId: "1:595265629564:web:590d29fb8bf6245cf988f9",
  measurementId: "G-GNT4KM3Z1Y",
};

// Initialize Firebase immediately
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth, db, storage };
