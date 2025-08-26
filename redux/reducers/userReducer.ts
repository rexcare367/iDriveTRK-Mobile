import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  SWITCH_USER_ROLE,
  UPDATE_PROFILE_PHOTO_FAILURE,
  UPDATE_PROFILE_PHOTO_REQUEST,
  UPDATE_PROFILE_PHOTO_SUCCESS,
} from "../types";

const initialState = {
  currentUser: {
    id: "1",
    name: "Stephen Obarido",
    email: "stephen@example.com",
    role: "EMPLOYEE",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  loading: false,
  error: null,
  isAuthenticated: true, // Set to true for demo purposes
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SWITCH_USER_ROLE:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          role: action.payload,
        },
      };
    case UPDATE_PROFILE_PHOTO_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: {
          ...state.currentUser,
          ...action.payload,
        },
      };
    case UPDATE_PROFILE_PHOTO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
