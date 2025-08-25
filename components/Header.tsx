import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title = "", subtitle = "" }: HeaderProps) => {
  const { user } = useSelector((state: any) => state.auth);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

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
          <View style={styles.notificationContainer}>
            <View style={styles.bellBackground}>
              <Ionicons name="notifications-outline" size={24} color="#222" />
              {/* <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>1</Text>
              </View> */}
            </View>
          </View>
          <View style={styles.profileOuterBorder}>
            <View style={styles.profileInnerBorder}>
              <TouchableOpacity onPress={() => router.push("/(home)/profile")}>
                <Image
                  source={
                    user?.avatar
                      ? { uri: user?.avatar }
                      : require("../assets/profile-placeholder.png")
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
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
    width: 40,
    height: 40,
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileOuterBorder: {
    borderWidth: 1,
    borderColor: "#082640",
    borderRadius: 25,
    padding: 1,
  },
  profileInnerBorder: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 23,
    overflow: "hidden",
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
});
