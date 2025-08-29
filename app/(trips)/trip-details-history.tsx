import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import { api } from "../../utils";

export default function TripDetailsHistoryScreen() {
  const params = useLocalSearchParams();
  const { tripId } = params;
  const { user } = useSelector((state: any) => state.auth);
  const mapRef = useRef<MapView>(null);

  // State for trip details
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for timesheet
  const [timesheet, setTimesheet] = useState<any>(null);
  const [timesheetLoading, setTimesheetLoading] = useState(false);
  const [timesheetError, setTimesheetError] = useState<string | null>(null);

  // Extract route coordinates from tripDetails.job.routes if available
  const getRouteCoordinates = () => {
    if (tripDetails?.job?.routes && tripDetails.job.routes.length > 0) {
      return tripDetails.job.routes.map((route: any) => ({
        latitude: route.lat,
        longitude: route.lng,
      }));
    }
    // Fallback to default coordinates
    const origin = { latitude: 42.0631, longitude: -83.3852 };
    const destination = { latitude: 44.6728, longitude: -83.3958 };
    return [origin, destination];
  };

  const routeCoordinates = getRouteCoordinates();

  // Fetch trip details from API
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripId) {
        setError("No trip ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/schedules/${tripId}`);

        if (response.data) {
          console.log("response.data", response.data);
          setTripDetails(response.data);

          // If trip status is not 'active', fetch timesheet
          if (response.data.status !== "active") {
            await fetchTimesheet(response.data.id);
          }
        } else {
          setError("No trip details found");
        }
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    const fetchTimesheet = async (schedule_id: string) => {
      if (!user?.id) return;
      try {
        setTimesheetLoading(true);
        setTimesheetError(null);

        const timesheetResponse = await api.get(
          `/api/timesheets/by-schedule/${schedule_id}`
        );

        if (timesheetResponse.data) {
          setTimesheet(timesheetResponse.data);
        } else {
          setTimesheetError("No timesheet found");
        }
      } catch (err) {
        console.error("Error fetching timesheet:", err);
        setTimesheetError("Failed to load timesheet");
      } finally {
        setTimesheetLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handleMapReady = () => {
    if (mapRef.current && routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <BackgroundEffects />
        <Header />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <BackgroundEffects />
        <Header />
      </View>
    );
  }

  const subTitle = `${moment(tripDetails.start_time).format(
    "ddd, DD MMM YYYY  hh:mm A"
  )} - ${moment(tripDetails.end_time).format("hh:mm A")}`;

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header title="Trip Details" subtitle={subTitle} />

      <View style={styles.content}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude:
                routeCoordinates.length > 0
                  ? routeCoordinates[0].latitude
                  : 40.7128,
              longitude:
                routeCoordinates.length > 0
                  ? routeCoordinates[0].longitude
                  : -74.006,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onMapReady={handleMapReady}
          >
            {tripDetails?.job?.routes ? (
              // Render markers for each route point
              tripDetails.job.routes.map((route: any, index: number) => (
                <Marker
                  key={route.id}
                  coordinate={{
                    latitude: route.lat,
                    longitude: route.lng,
                  }}
                  title={route.label}
                  description={`Route point ${index + 1}`}
                  image={
                    index === 0
                      ? require("../../assets/car.png")
                      : index === tripDetails.job.routes.length - 1
                      ? require("../../assets/marker.png")
                      : require("../../assets/marker.png")
                  }
                />
              ))
            ) : (
              // Fallback to default markers
              <>
                <Marker
                  coordinate={routeCoordinates[0]}
                  title="Start"
                  image={require("../../assets/car.png")}
                />
                <Marker
                  coordinate={routeCoordinates[1]}
                  title="End"
                  image={require("../../assets/marker.png")}
                />
              </>
            )}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#082640"
              strokeWidth={4}
            />
          </MapView>
          <View style={styles.distanceChip}>
            <Feather name="truck" size={16} color="#000" />
            <Text style={styles.distanceText}>
              {tripDetails.job.driving_distance} km,{" "}
              {moment(tripDetails.end_time).diff(
                moment(tripDetails.start_time),
                "minutes"
              )}{" "}
              mins
            </Text>
          </View>
        </View>

        <ScrollView style={styles.routeContainer}>
          {tripDetails?.job?.routes && tripDetails.job.routes.length > 0 ? (
            // Render all route points from the routes data
            tripDetails.job.routes.map((route: any, index: number) => (
              <View key={route.id} style={styles.routeRow}>
                <View style={styles.iconColumn}>
                  {index === 0 ? (
                    <Feather name="truck" size={20} color="#082640" />
                  ) : index === tripDetails.job.routes.length - 1 ? (
                    <Feather name="map-pin" size={20} color="#4CAF50" />
                  ) : (
                    <Feather name="circle" size={20} color="#666" />
                  )}
                  {index < tripDetails.job.routes.length - 1 && (
                    <View style={styles.customDottedLine}>
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <View key={idx} style={styles.dot} />
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeName}>
                    {route.label || `Route Point ${index + 1}`}
                  </Text>
                  <Text style={styles.routeTime}>{route.address}</Text>
                </View>
              </View>
            ))
          ) : (
            // Show empty message when no routes are found
            <View style={styles.emptyRouteContainer}>
              <Feather name="map" size={48} color="#ccc" />
              <Text style={styles.emptyRouteText}>
                No route information available
              </Text>
              <Text style={styles.emptyRouteSubtext}>
                Route details will appear here when available
              </Text>
            </View>
          )}
        </ScrollView>

        {timesheet && timesheet.truck && (
          <>
            <Text style={styles.sectionTitle}>Truck Used</Text>

            <View style={styles.truckContainer}>
              <Image
                source={
                  timesheet?.truck?.photo
                    ? {
                        uri:
                          process.env.EXPO_PUBLIC_STORAGE_URL +
                          timesheet.truck.photo,
                      }
                    : require("../../assets/car.png")
                }
                style={styles.truckImage}
              />
              <View style={styles.truckDetails}>
                <Text style={styles.truckName}>{timesheet?.truck?.name}</Text>
                <View style={styles.truckSpecs}>
                  <View style={styles.truckSpec}>
                    <Ionicons
                      name="speedometer-outline"
                      size={16}
                      color="#666"
                    />
                    <Text style={styles.truckSpecText}>
                      {timesheet?.truck?.speed} km/h
                    </Text>
                  </View>
                  <View style={styles.truckSpec}>
                    <Ionicons name="water-outline" size={16} color="#666" />
                    <Text style={styles.truckSpecText}>
                      {timesheet?.truck?.fuel} L
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      <BottomTabBar activeTab="Trips" />
    </SafeAreaView>
  );
}

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#082640",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  distanceChip: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "500",
  },
  routeContainer: {
    marginBottom: 20,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
    minHeight: 80,
  },
  iconColumn: {
    alignItems: "center",
  },
  customDottedLine: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1,
    backgroundColor: "#BDBDBD",
    marginVertical: 1,
  },
  routeDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "center",
  },
  routeName: {
    fontSize: 16,
    fontWeight: "500",
  },
  routeTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  truckContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  truckImage: {
    width: 85.94,
    height: 54.88,
  },
  truckDetails: {
    flex: 1,
    paddingLeft: 20,
  },
  truckName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  truckSpecs: {
    flexDirection: "row",
    alignItems: "center",
  },
  truckSpec: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  truckSpecText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  emptyRouteContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyRouteText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  emptyRouteSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
});
