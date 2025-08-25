import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import { selectRoute } from "../../redux/actions/driverActions";

const RouteSelectionScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { assignedRoute } = useSelector((state: any) => state.driver);

  const handleBack = () => {
    router.back();
  };

  const handleRouteSelect = (route: any) => {
    dispatch(selectRoute(route));
    router.push({
      pathname: "/trip-selection",
      params: {
        routeId: route.id,
        routeName: route.name,
      },
    });
  };

  const routes = [
    {
      id: "1",
      name: "Carleton AM-PM",
      isAssigned: assignedRoute === "Carleton AM-PM",
    },
    {
      id: "2",
      name: "Deshler AM-PM",
      isAssigned: assignedRoute === "Deshler AM-PM",
    },
    {
      id: "3",
      name: "Burchard AM-PM",
      isAssigned: assignedRoute === "Burchard AM-PM",
    },
    {
      id: "4",
      name: "Falls City AM-PM",
      isAssigned: assignedRoute === "Falls City AM-PM",
    },
    { id: "5", name: "Rulo AM-PM", isAssigned: assignedRoute === "Rulo AM-PM" },
    {
      id: "6",
      name: "McCool Junction AM-PM",
      isAssigned: assignedRoute === "McCool Junction AM-PM",
    },
    {
      id: "7",
      name: "Plymouth AM-PM",
      isAssigned: assignedRoute === "Plymouth AM-PM",
    },
  ];

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("../../assets/profile-placeholder.png")
          }
          style={styles.profileImage}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Select Route</Text>
        <Text style={styles.subtitle}>Choose your route for today</Text>

        <View style={styles.locationHeader}>
          <Text style={styles.locationTitle}>Lincoln Hub</Text>
        </View>

        {assignedRoute && (
          <View style={styles.assignedSection}>
            <Text style={styles.assignedTitle}>Your Assigned Route</Text>
            {routes
              .filter((route) => route.isAssigned)
              .map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={[styles.routeCard, styles.assignedRouteCard]}
                  onPress={() => handleRouteSelect(route)}
                >
                  <View style={styles.routeHeader}>
                    <Ionicons name="car" size={20} color="#004B87" />
                    <Text style={styles.routeName}>{route.name}</Text>
                    <View style={styles.assignedBadge}>
                      <Text style={styles.assignedBadgeText}>Assigned</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={styles.availableTitle}>Available Routes</Text>
        <ScrollView style={styles.routeList}>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                route.isAssigned && styles.assignedRouteHighlight,
              ]}
              onPress={() => handleRouteSelect(route)}
            >
              <View style={styles.routeHeader}>
                <Image
                  source={require("../../assets/car.png")}
                  style={{
                    width: 38,
                    height: 23,
                  }}
                />
                <Text style={styles.routeName}>{route.name}</Text>
                {route.isAssigned && (
                  <View style={styles.assignedBadge}>
                    <Text style={styles.assignedBadgeText}>Assigned</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <BottomTabBar activeTab="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  assignedSection: {
    marginBottom: 20,
  },
  assignedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#004B87",
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  routeList: {
    flex: 1,
  },
  routeCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  assignedRouteCard: {
    backgroundColor: "#f0f7ff",
    borderWidth: 1,
    borderColor: "#c5d8f0",
  },
  assignedRouteHighlight: {
    backgroundColor: "#f0f7ff",
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  assignedBadge: {
    backgroundColor: "#004B87",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default RouteSelectionScreen;
