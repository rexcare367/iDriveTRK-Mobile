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
        router.push("/(trips)/assigned-trips");
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
          color={activeTab === "Home" ? "#082640" : "#666"}
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
          color={activeTab === "Trips" ? "#082640" : "#666"}
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
          color={activeTab === "PTO" ? "#082640" : "#666"}
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
          color={activeTab === "TimeSheet" ? "#082640" : "#666"}
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
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#082640",
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeTabText: {
    color: "#082640",
    fontWeight: "500",
  },
});

export default BottomTabBar;
