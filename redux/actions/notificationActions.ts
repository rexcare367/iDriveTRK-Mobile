import {
    DELETE_NOTIFICATION_FAILURE,
    DELETE_NOTIFICATION_REQUEST,
    DELETE_NOTIFICATION_SUCCESS,
    FETCH_NOTIFICATIONS_FAILURE,
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    INotification,
    MARK_ALL_NOTIFICATIONS_READ_FAILURE,
    MARK_ALL_NOTIFICATIONS_READ_REQUEST,
    MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
    MARK_NOTIFICATION_READ_FAILURE,
    MARK_NOTIFICATION_READ_REQUEST,
    MARK_NOTIFICATION_READ_SUCCESS,
    MARK_NOTIFICATION_UNREAD_FAILURE,
    MARK_NOTIFICATION_UNREAD_REQUEST,
    MARK_NOTIFICATION_UNREAD_SUCCESS
} from '../types';

// Mock data for development - replace with actual API calls
const mockNotifications: INotification[] = [
  {
    id: '1',
    title: 'Trip Assigned',
    message: 'You have been assigned to Trip #1234 from Los Angeles to San Francisco',
    type: 'trip',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    userId: 'user1',
    schedulerId: 'scheduler1',
    actionUrl: '/(trips)/assigned-trips',
  },
  {
    id: '2',
    title: 'Timesheet Approved',
    message: 'Your timesheet for the week of September 9-15 has been approved',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'user1',
    schedulerId: 'scheduler1',
  },
  {
    id: '3',
    title: 'Maintenance Due',
    message: 'Vehicle maintenance is due for Truck #456 in 3 days',
    type: 'warning',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: 'user1',
    schedulerId: 'scheduler1',
  },
  {
    id: '4',
    title: 'Payroll Processed',
    message: 'Your payroll for the period ending September 15 has been processed',
    type: 'payroll',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    userId: 'user1',
    schedulerId: 'scheduler1',
    actionUrl: '/(payroll)/payroll-dashboard',
  },
  {
    id: '5',
    title: 'System Update',
    message: 'New features have been added to the iDrive TRK system',
    type: 'system',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    userId: 'user1',
    schedulerId: 'scheduler1',
  },
];

export const fetchNotifications = (userId: string, schedulerId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In real implementation, this would be an API call
      // const response = await apiClient.get(`/notifications?userId=${userId}&schedulerId=${schedulerId}`);
      // const notifications = response.data;

      // For now, filter mock data by user and scheduler
      const notifications = mockNotifications.filter(
        notification => notification.userId === userId && notification.schedulerId === schedulerId
      );

      dispatch({
        type: FETCH_NOTIFICATIONS_SUCCESS,
        payload: notifications,
      });
    } catch (error: any) {
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: error.message || 'Failed to fetch notifications',
      });
    }
  };
};

export const markNotificationAsRead = (notificationId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: MARK_NOTIFICATION_READ_REQUEST });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, this would be an API call
      // await apiClient.put(`/notifications/${notificationId}/read`);

      dispatch({
        type: MARK_NOTIFICATION_READ_SUCCESS,
        payload: notificationId,
      });
    } catch (error: any) {
      dispatch({
        type: MARK_NOTIFICATION_READ_FAILURE,
        payload: error.message || 'Failed to mark notification as read',
      });
    }
  };
};

export const markNotificationAsUnread = (notificationId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: MARK_NOTIFICATION_UNREAD_REQUEST });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, this would be an API call
      // await apiClient.put(`/notifications/${notificationId}/unread`);

      dispatch({
        type: MARK_NOTIFICATION_UNREAD_SUCCESS,
        payload: notificationId,
      });
    } catch (error: any) {
      dispatch({
        type: MARK_NOTIFICATION_UNREAD_FAILURE,
        payload: error.message || 'Failed to mark notification as unread',
      });
    }
  };
};

export const deleteNotification = (notificationId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, this would be an API call
      // await apiClient.delete(`/notifications/${notificationId}`);

      dispatch({
        type: DELETE_NOTIFICATION_SUCCESS,
        payload: notificationId,
      });
    } catch (error: any) {
      dispatch({
        type: DELETE_NOTIFICATION_FAILURE,
        payload: error.message || 'Failed to delete notification',
      });
    }
  };
};

export const markAllNotificationsAsRead = (userId: string, schedulerId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: MARK_ALL_NOTIFICATIONS_READ_REQUEST });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, this would be an API call
      // await apiClient.put(`/notifications/mark-all-read`, { userId, schedulerId });

      dispatch({
        type: MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
      });
    } catch (error: any) {
      dispatch({
        type: MARK_ALL_NOTIFICATIONS_READ_FAILURE,
        payload: error.message || 'Failed to mark all notifications as read',
      });
    }
  };
};
