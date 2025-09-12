import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import BottomTabBar from '../../components/BottomTabBar';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { ThemedView } from '../../components/ThemedView';
import { deleteNotification, fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead, markNotificationAsUnread } from '../../redux/actions/notificationActions';
import { INotification, RootState } from '../../redux/types';

const Notifications = () => {
  const dispatch = useDispatch();
  const { user, currentScheduler } = useSelector((state: RootState) => state.auth);
  const { notifications, unreadCount, loading } = useSelector((state: RootState) => state.notification);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user && currentScheduler) {
      dispatch(fetchNotifications(user.id, currentScheduler));
    }
  }, [user, currentScheduler, dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (user && currentScheduler) {
      dispatch(fetchNotifications(user.id, currentScheduler)).finally(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  }, [user, currentScheduler, dispatch]);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAsUnread = (notificationId: string) => {
    dispatch(markNotificationAsUnread(notificationId));
  };

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteNotification(notificationId)),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (user && currentScheduler) {
      dispatch(markAllNotificationsAsRead(user.id, currentScheduler));
    }
  };

  const handleNotificationPress = (notification: INotification) => {
    // Mark as read when pressed
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const getNotificationIcon = (type: INotification['type']) => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#FF9800" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#F44336" />;
      case 'trip':
        return <Ionicons name="car" size={24} color="#2196F3" />;
      case 'timesheet':
        return <Ionicons name="time" size={24} color="#9C27B0" />;
      case 'payroll':
        return <Ionicons name="cash" size={24} color="#4CAF50" />;
      case 'system':
        return <Ionicons name="settings" size={24} color="#607D8B" />;
      default:
        return <Ionicons name="information-circle" size={24} color="#2196F3" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotificationItem = ({ item }: { item: INotification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          {getNotificationIcon(item.type)}
          <View style={styles.notificationText}>
            <Text style={[styles.notificationTitle, !item.isRead && styles.unreadText]}>
              {item.title}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
        </View>
        <Text style={[styles.notificationMessage, !item.isRead && styles.unreadText]}>
          {item.message}
        </Text>
      </View>

      <View style={styles.notificationActions}>
        {item.isRead ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMarkAsUnread(item.id)}
          >
            <MaterialIcons name="markunread" size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <MaterialIcons name="mark-as-read" size={20} color="#666" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerDescription}>Shows Notifications</Text>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" />

      <ThemedView style={styles.content}>
        {renderHeader()}

        {notifications.length === 0 && !loading ? (
          <EmptyState
            icon="notifications-off"
            title="No notifications"
            message="You're all caught up! Check back later for updates."
          />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ThemedView>
      <BottomTabBar activeTab="" />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002B49',
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#002B49',
    borderRadius: 6,
  },
  markAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadItem: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#002B49',
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationText: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002B49',
    marginBottom: 2,
  },
  unreadText: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default Notifications;
