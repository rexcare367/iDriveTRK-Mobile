import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  SWITCH_USER_ROLE,
  UPDATE_PROFILE_PHOTO_REQUEST,
  UPDATE_PROFILE_PHOTO_SUCCESS,
  UPDATE_PROFILE_PHOTO_FAILURE,
} from "../types";
import api from "../../utils/apiClient";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";

// Mock API call
const mockFetchUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        name: "Stephen Obarido",
        email: "stephen@example.com",
        role: "MANAGER",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      });
    }, 500);
  });
};

export const fetchUser = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_USER_REQUEST });

    try {
      const user = await mockFetchUser();
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: user,
      });
    } catch (error) {
      dispatch({
        type: FETCH_USER_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const switchUserRole = (newRole) => {
  return {
    type: SWITCH_USER_ROLE,
    payload: newRole,
  };
};

export const updateProfilePhoto = (photoUri) => {
  return async (dispatch, getState) => {
    dispatch({ type: UPDATE_PROFILE_PHOTO_REQUEST });

    try {
      const { user } = getState().auth;
      const userId = user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // Create FormData for file upload (React Native compatible)
      const formData = new FormData();
      const filename = `profile-photo-${Date.now()}.jpg`;

      // Add the image file to FormData
      formData.append("photo", {
        uri: photoUri,
        type: "image/jpeg",
        name: filename,
      });

      // Call backend API to upload photo
      const apiResponse = await api.post(
        `/api/users/${userId}/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, avatar } = apiResponse.data;

      if (success) {
        // Update user with new avatar URL
        const updatedUser = {
          ...user,
          avatar: avatar,
        };

        dispatch({
          type: UPDATE_PROFILE_PHOTO_SUCCESS,
          payload: updatedUser,
        });

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Profile photo updated successfully!",
        });

        return true;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Failed to upload profile photo:", error);

      dispatch({
        type: UPDATE_PROFILE_PHOTO_FAILURE,
        payload: error.message || "Failed to upload profile photo",
      });

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to upload profile photo. Please try again.",
      });

      return false;
    }
  };
};
