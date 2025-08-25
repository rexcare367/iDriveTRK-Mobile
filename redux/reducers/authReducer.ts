import {
  CREATE_PIN_FAILURE,
  CREATE_PIN_REQUEST,
  CREATE_PIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SETUP_ACCOUNT_FAILURE,
  SETUP_ACCOUNT_REQUEST,
  SETUP_ACCOUNT_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  UPDATE_PROFILE_PHOTO_FAILURE,
  UPDATE_PROFILE_PHOTO_REQUEST,
  UPDATE_PROFILE_PHOTO_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
} from "../types";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  tempPhone: string | null;
  uid: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tempEmail: null,
  tempPhone: null,
  uid: null,
  firstName: null,
  lastName: null,
  profilePicture: null,
};

export default function authReducer(
  state = initialState,
  action: any
): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
    case VERIFY_OTP_REQUEST:
    case CREATE_PIN_REQUEST:
    case SETUP_ACCOUNT_REQUEST:
    case UPDATE_PROFILE_PHOTO_REQUEST:
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        tempEmail: action.payload.tempEmail,
        tempPhone: action.payload.tempPhone,
        uid: action.payload.uid,
        error: null,
      };

    case SETUP_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        profilePicture: action.payload.avatar,
        error: null,
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case CREATE_PIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case UPDATE_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case VERIFY_OTP_FAILURE:
    case CREATE_PIN_FAILURE:
    case SETUP_ACCOUNT_FAILURE:
    case UPDATE_PROFILE_PHOTO_FAILURE:
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
