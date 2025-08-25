import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { LOGIN_SUCCESS, LOGOUT } from "../redux/types";

const AuthGate = ({ onAuthResolved }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        let profilePicture = null;
        let pin = null;
        let firstName = null;
        let lastName = null;
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          profilePicture = data.avatar || null;
          pin = data.pin || null;
          firstName = data.firstName || null;
          lastName = data.lastName || null;
        }
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            profilePicture,
            pin,
            firstName,
            lastName,
          },
        });
        onAuthResolved(pin ? "Pin" : "SetupAccount");
      } else {
        dispatch({ type: LOGOUT });
        onAuthResolved("Splash");
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#082640" />
      </View>
    );
  }

  return null;
};

export default AuthGate;
