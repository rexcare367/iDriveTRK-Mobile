import { IScheduler, IUser, RootState } from "@/redux/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title = "", subtitle = "" }: HeaderProps) => {
  const { user, currentScheduler }: { user: IUser | null; currentScheduler: string | null } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notification);

  // Helper function to get the current scheduler
  const getCurrentScheduler = (): IScheduler | null => {
    if (!user?.schedulers || user.schedulers.length === 0) return null;

    // If currentScheduler is set, find it in the schedulers array
    if (currentScheduler) {
      const scheduler = user.schedulers.find((s: IScheduler) => s.id === currentScheduler);
      if (scheduler) return scheduler;
    }

    // If no currentScheduler is set or not found, return the first scheduler
    return user.schedulers[0] || null;
  };

  const currentSchedulerObj = getCurrentScheduler();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {title ? (
            <TouchableOpacity onPress={handleBack}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="menu" size={24} color="#000" />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
            {subtitle && (
              <Text
                style={styles.subtitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationContainer} onPress={() => router.push("/(home)/notifications")}>
            <View style={styles.bellBackground}>
              <Ionicons name="notifications-outline" size={24} color="#222" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {unreadCount > 99 ? '99+' : unreadCount.toString()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
            <View style={styles.profileInnerBorder}>
              <TouchableOpacity style={styles.profileContainer} onPress={() => router.push("/(home)/profile")}>
                <Image
                  source={
                    user?.avatar
                      ? { uri: user?.avatar }
                      : require("../assets/profile-placeholder.png")
                  }
                  style={styles.profileImage}
                />
                <View style={styles.profileNameContainer}>
                  <Text style={styles.profileName}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text style={styles.schedulerName}>
                    {currentSchedulerObj?.title || "--"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  notificationContainer: {
    marginRight: 15,
    position: "relative",
  },
  bellBackground: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F44336",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 2,
  },
  notificationCount: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
    lineHeight: 13,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#082640",
    padding: 1,
  },
  profileInnerBorder: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 23,
    overflow: "hidden",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#002B49",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    flexWrap: "wrap",
    marginTop: 2,
  },
  profileNameContainer: {
    flexDirection: "column",
    gap: 1,
  },
  schedulerName: {
    fontSize: 12,
    color: "#666",
    flexWrap: "wrap",
    marginTop: 2,
  },
});
