import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import { confirmTrip } from "../../redux/actions/driverActions";
import api from "../../utils/apiClient";

export default function TripDetailsScreen() {
  const params = useLocalSearchParams();
  const { tripId, tripName, isAssigned } = params;
  const mapRef = useRef<MapView>(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [tripDetail, setTripDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Removed unused loading and error state

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    api
      .get(`/api/schedules/${tripId}`)
      .then((res: any) => {
        setTripDetail(res.data);
      })
      .catch((err: any) => {
        // setError("Failed to fetch trip details"); // removed
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tripId]);

  // Extract route coordinates from tripDetails.job.routes if available
  const getRouteCoordinates = () => {
    if (tripDetail?.job?.routes && tripDetail?.job?.routes?.length > 0) {
      return tripDetail.job.routes.map((route: any) => ({
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

  const handleMapReady = () => {
    if (mapRef.current && routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirmTrip = () => {
    dispatch(confirmTrip());
    router.push({
      pathname: "/(home)/trip-stops",
      params: {
        tripId: tripId,
        tripName: tripName,
      },
    });
  };

  // Prepare map coordinates
  const routes = tripDetail?.job?.routes || [];
  const mapMarkers = routes.map((r: any) => ({
    latitude: r.lat,
    longitude: r.lng,
    label: r.label,
    address: r.address,
    id: r.id,
  }));

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <Header title="Trip Details" subtitle={tripName as string} />
      {loading ? (
        <View style={{ flex: 1, padding: 20 }}>
          {/* Simple skeleton loader */}
          <View
            style={{
              height: 30,
              backgroundColor: "#e0e0e0",
              borderRadius: 6,
              marginBottom: 20,
            }}
          />
          <View
            style={{
              height: 200,
              backgroundColor: "#e0e0e0",
              borderRadius: 10,
              marginBottom: 20,
            }}
          />
          <View
            style={{
              height: 20,
              width: 120,
              backgroundColor: "#e0e0e0",
              borderRadius: 6,
              marginBottom: 10,
            }}
          />
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={{
                height: 60,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
          ))}
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.headerContainer}>
            <View>
              {tripDetail ? (
                <Text style={styles.subtitle}>
                  {moment(tripDetail.start_time).format(
                    "ddd, MMM Do YYYY, h:mm a"
                  )}{" "}
                  - {moment(tripDetail.end_time).format("h:mm a")}
                </Text>
              ) : (
                <Text style={styles.subtitle}>Loading...</Text>
              )}
            </View>
          </View>
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
              {tripDetail?.job?.routes ? (
                // Render markers for each route point
                tripDetail.job.routes.map((route: any, index: number) => (
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
                        : index === tripDetail.job.routes.length - 1
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
                {tripDetail?.job?.driving_distance} km
              </Text>
            </View>
          </View>
          <View style={styles.routeContainer}>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Route Stops
            </Text>
            {mapMarkers.length > 0 ? (
              mapMarkers.map((marker: any, idx: number) => (
                <View key={marker.id} style={styles.routeRow}>
                  <View style={styles.iconColumn}>
                    <Feather name="map-pin" size={20} color="#4CAF50" />
                  </View>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routeName}>{marker.label}</Text>
                    <Text style={styles.routeTime}>{marker.address}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>No stops available</Text>
            )}
          </View>
          {isAssigned === "true" ? (
            <View style={styles.bottomContainer}>
              <View style={styles.tripInfoContainer}>
                <View style={styles.tripInfoItem}>
                  <View style={styles.tripInfoItemInner}>
                    <Feather name="file-text" size={20} color="#082640" />
                    <Text style={styles.tripInfoLabel}>Trip ID</Text>
                  </View>
                  <View>
                    <Text style={styles.tripInfoValue}>{tripId}</Text>
                  </View>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.tripInfoItem}>
                  <View style={styles.tripInfoItemInner}>
                    <Feather name="truck" size={20} color="#082640" />
                    <Text style={styles.tripInfoLabel}>Truck</Text>
                  </View>
                  <View>
                    <Text style={styles.tripInfoValue}>
                      {tripDetail?.job?.name || "-"}
                    </Text>
                  </View>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.tripInfoItem}>
                  <View style={styles.tripInfoItemInner}>
                    <Feather name="package" size={20} color="#082640" />
                    <Text style={styles.tripInfoLabel}>Load</Text>
                  </View>
                  <View>
                    <Text style={styles.tripInfoValue}>
                      {tripDetail?.job?.load || "-"}
                    </Text>
                  </View>
                </View>
              </View>
              {isAssigned ? (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirmTrip()}
                >
                  <Text style={styles.confirmButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                ""
              )}
            </View>
          ) : (
            ""
          )}
        </ScrollView>
      )}
      <BottomTabBar activeTab="Home" />
    </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
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
  tripInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  tripInfoItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 15,
    height: "100%",
    alignSelf: "center",
  },
  tripInfoLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  tripInfoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#082640",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 20,
  },
  tripInfoItemInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  markerCircle: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#004B87",
  },
  markerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  mapLegend: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});
