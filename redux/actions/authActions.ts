import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import uuid from "react-native-uuid";
import { auth } from "../../firebase/config";
import { api } from "../../utils";

import {
  CREATE_PIN_FAILURE,
  CREATE_PIN_REQUEST,
  CREATE_PIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
} from "../types";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emergency_contact?: string;
  avatar?: string;
  pin?: string;
  uid?: string;
}

export const signIn = (email: string, password: string) => {
  return async (dispatch: any) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch full user info from backend
      const response = await api.post("api/auth/signin", { uid: user.uid });
      const userData = response?.data?.user || {
        id: user.uid,
        email: user.email,
      };

      // Store user info in AsyncStorage
      try {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ ...userData, password })
        );
      } catch (storageError) {
        console.warn("Failed to save user to storage:", storageError);
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: userData,
      });

      return true;
    } catch (error) {
      let errorMessage = "An error occurred";
      if ((error as any).code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
      });

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: errorMessage,
      });

      return false;
    }
  };
};

export const signUp = (email: string, phone: string, password: string) => {
  return async (dispatch: any) => {
    dispatch({ type: SIGNUP_REQUEST });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: { tempEmail: email, tempPhone: phone, uid: user.uid },
      });

      return true;
    } catch (error) {
      dispatch({
        type: SIGNUP_FAILURE,
        payload: error instanceof Error ? error.message : "An error occurred",
      });
      return false;
    }
  };
};

export const setupAccount = (
  firstName: string,
  lastName: string,
  profilePicture: string
) => {
  return async (dispatch: any, getState: any) => {
    const { tempEmail, tempPhone, uid } = getState().auth;

    dispatch({ type: "SETUP_ACCOUNT_REQUEST" });

    try {
      // Call server API for signup
      try {
        // If profilePicture is provided, upload it first
        let avatarUrl = null;
        const userId = uuid.v4();

        await api.post("api/auth/signup", {
          id: userId,
          email: tempEmail,
          phone: tempPhone,
          firstName,
          lastName,
          avatar: avatarUrl,
          uid,
        });

        if (profilePicture) {
          const response = await fetch(profilePicture);
          const blob = await response.blob();
          const filename = `profile-photo-${Date.now()}.png`;

          const formData: any = new FormData();
          formData.append("file", {
            uri: profilePicture,
            name: filename,
            type: "image/png", // Set correct MIME type for PNG
            data: blob,
          });

          // Upload image to server using the correct endpoint format
          // Following the Next.js pattern: send the file directly with proper Content-Type
          const uploadResponse = await api.post(
            `/api/users/${userId}/upload-photo?filename=${filename}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
            }
          );

          const { avatar } = uploadResponse.data;

          if (uploadResponse.data.success) {
            avatarUrl = avatar;
          }
        }

        await api.post("api/auth/send-otp", {
          email: tempEmail,
          uid,
        });
      } catch (apiError) {
        console.error("API signup failed:", apiError);
        // Optionally, you can dispatch a failure or show a toast here
      }

      dispatch({
        type: "SETUP_ACCOUNT_SUCCESS",
        payload: { firstName, lastName, profilePicture },
      });

      return true;
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SETUP_ACCOUNT_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to setup account",
      });
      return false;
    }
  };
};

export const updateUser = (userData: Partial<User>) => {
  return async (
    dispatch: (action: any) => void,
    getState: () => { auth: { user: User } }
  ) => {
    dispatch({ type: "UPDATE_USER_REQUEST" });

    try {
      const { user } = getState().auth;
      if (!user) throw new Error("User not found");

      await api.patch(`/api/users/${user.id}`, userData);
      console.log("{ ...user, ...userData }", { ...user, ...userData });
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { ...user, ...userData },
      });
      return true;
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: "UPDATE_USER_FAILURE",
        payload:
          error instanceof Error ? error.message : "Failed to update user",
      });
      return false;
    }
  };
};

export const verifyOTP = (otp: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: VERIFY_OTP_REQUEST });

    try {
      const { uid } = getState().auth;
      await api.post(`api/auth/verify-otp`, {
        otp,
        uid,
      });

      dispatch({ type: VERIFY_OTP_SUCCESS });

      return true;
    } catch (error) {
      dispatch({
        type: VERIFY_OTP_FAILURE,
        payload: (error as any).message || "Invalid OTP",
      });

      return false;
    }
  };
};

export const createPIN = (pin: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: CREATE_PIN_REQUEST });
    try {
      const { user } = getState().auth;
      if (!user) throw new Error("User not found");
      // Call backend API to create pin
      const response = await api.post("api/auth/create-pin", {
        uid: user.uid,
        pin,
      });
      console.log("response", response);
      const userData = response?.data?.user || { id: user.uid, pin };
      dispatch({
        type: CREATE_PIN_SUCCESS,
        payload: userData,
      });
      return true;
    } catch (error) {
      dispatch({
        type: CREATE_PIN_FAILURE,
        payload:
          error instanceof Error ? error.message : "Failed to create PIN",
      });
      return false;
    }
  };
};

export const verifyPIN = (pin: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: CREATE_PIN_REQUEST });
    try {
      const { user } = getState().auth;
      if (!user) throw new Error("User not found");
      console.log("user", user);
      // Fetch full user info from backend
      if (!user.pin) throw new Error("PIN not set for user");
      if (user.pin !== pin) throw new Error("Incorrect PIN");
      dispatch({
        type: CREATE_PIN_SUCCESS,
        payload: user,
      });
      return true;
    } catch (error) {
      dispatch({
        type: CREATE_PIN_FAILURE,
        payload:
          error instanceof Error ? error.message : "Failed to verify PIN",
      });
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody:
          error instanceof Error ? error.message : "Failed to verify PIN",
      });
      return false;
    }
  };
};

export const logout = () => {
  return async (dispatch: any) => {
    try {
      await signOut(auth);
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
};
