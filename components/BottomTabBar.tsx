// This is React Native code, not Next.js
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BottomTabBarProps {
  activeTab: string;
  onTabPress?: (tabName: string) => void;
}

const BottomTabBar = ({ activeTab, onTabPress }: BottomTabBarProps) => {
  const handleTabPress = (tabName: string) => {
    if (onTabPress) {
      onTabPress(tabName);
    }

    switch (tabName) {
      case "Home":
        router.push("/(home)/home");
        break;
      case "PTO":
        router.push("/(pto)/pto-dashboard");
        break;
      case "TimeSheet":
        router.push("/(timesheet)/timesheet-dashboard");
        break;
      case "Trips":
        router.push("/(trips)/main");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === "Home" && styles.activeTab]}
        onPress={() => handleTabPress("Home")}
      >
        <Feather
          name="home"
          size={20}
          color={activeTab === "Home" ? "#2563eb" : "#6b7280"}
        />
        <Text
          style={[styles.tabText, activeTab === "Home" && styles.activeTabText]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === "Trips" && styles.activeTab]}
        onPress={() => handleTabPress("Trips")}
      >
        <Feather
          name="truck"
          size={20}
          color={activeTab === "Trips" ? "#2563eb" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "Trips" && styles.activeTabText,
          ]}
        >
          Trips
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === "PTO" && styles.activeTab]}
        onPress={() => handleTabPress("PTO")}
      >
        <Feather
          name="clock"
          size={20}
          color={activeTab === "PTO" ? "#2563eb" : "#6b7280"}
        />
        <Text
          style={[styles.tabText, activeTab === "PTO" && styles.activeTabText]}
        >
          Paid Time Off
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === "TimeSheet" && styles.activeTab]}
        onPress={() => handleTabPress("TimeSheet")}
      >
        <Feather
          name="calendar"
          size={20}
          color={activeTab === "TimeSheet" ? "#2563eb" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "TimeSheet" && styles.activeTabText,
          ]}
        >
          Time Sheet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: "#2563eb",
    backgroundColor: "#f0f8ff",
  },
  tabText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
    fontWeight: "400",
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});

export default BottomTabBar;
