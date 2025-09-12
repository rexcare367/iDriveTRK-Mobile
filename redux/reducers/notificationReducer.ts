import {
    DELETE_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATIONS_FAILURE,
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    INotification,
    MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
    MARK_NOTIFICATION_READ_SUCCESS,
    MARK_NOTIFICATION_UNREAD_SUCCESS,
    NotificationState
} from '../types';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action: any): NotificationState => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        unreadCount: action.payload.filter((n: INotification) => !n.isRead).length,
        error: null,
      };

    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case MARK_NOTIFICATION_UNREAD_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: false }
            : notification
        ),
        unreadCount: state.unreadCount + 1,
      };

    case DELETE_NOTIFICATION_SUCCESS:
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: deletedNotification && !deletedNotification.isRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };

    case MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      };

    default:
      return state;
  }
};

export default notificationReducer;
