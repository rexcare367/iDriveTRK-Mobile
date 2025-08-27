import BackgroundEffects from "@/components/BackgroundEffects";
import BottomTabBar from "@/components/BottomTabBar";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";

import { selectTripStop } from "@/redux/actions/driverActions";

export default function TripStopsScreen() {
  const params = useLocalSearchParams();
  const { trip, tripName } = params as { trip: any; tripName: string };
  const dispatch = useDispatch();
  const { tripStops } = useSelector((state: any) => state.driver);
  const [mapExpanded, setMapExpanded] = useState(false);
  const mapHeight = useRef(new Animated.Value(150)).current;

  const mapRef = useRef(null);

  const isAMTrip = tripName.includes("AM");

  const filteredTripStops = tripStops.filter((stop: any) =>
    isAMTrip ? stop?.tripType === "AM" : stop?.tripType === "PM"
  );

  const handleStopSelect = (stop: any) => {
    // if (stop?.status === "next") {
    dispatch(selectTripStop(stop));
    router.push({
      pathname: "/(home)/scan-tag",
      params: {
        stopId: stop?.id,
        stopName: stop?.label,
        tripName,
      },
    });
    // }
  };

  const toggleMapSize = () => {
    const newExpanded = !mapExpanded;
    setMapExpanded(newExpanded);

    Animated.timing(mapHeight, {
      toValue: newExpanded ? 300 : 150,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getMapRegion = () => {
    const minLat = Math.min(
      ...filteredTripStops.map((stop: any) => stop?.coordinates.latitude)
    );
    const maxLat = Math.max(
      ...filteredTripStops.map((stop: any) => stop?.coordinates.latitude)
    );
    const minLng = Math.min(
      ...filteredTripStops.map((stop: any) => stop?.coordinates.longitude)
    );
    const maxLng = Math.max(
      ...filteredTripStops.map((stop: any) => stop?.coordinates.longitude)
    );

    const padding = 0.1;
    const region = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: maxLat - minLat + padding,
      longitudeDelta: maxLng - minLng + padding,
    };

    return region;
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>{trip?.job?.name}</Text>
        <Text style={styles.subtitle}>{trip?.job?.description}</Text>

        <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={getMapRegion()}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {filteredTripStops.map((stop: any, index: number) => (
              <Marker
                key={stop?.id}
                coordinate={stop?.coordinates}
                title={stop?.name}
                description={`Scheduled: ${stop?.scheduledTime}`}
                pinColor={isAMTrip ? "#e74c3c" : "#3498db"}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.markerBubble,
                      isAMTrip ? styles.amMarkerBubble : styles.pmMarkerBubble,
                      stop?.status === "completed" &&
                        styles.completedMarkerBubble,
                      stop?.status === "next" && styles.nextMarkerBubble,
                    ]}
                  >
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                </View>
              </Marker>
            ))}

            <Polyline
              coordinates={filteredTripStops.map(
                (stop: any) => stop?.coordinates
              )}
              strokeColor={isAMTrip ? "#e74c3c" : "#3498db"}
              strokeWidth={3}
            />
          </MapView>

          <TouchableOpacity
            style={styles.expandMapButton}
            onPress={toggleMapSize}
          >
            <Ionicons
              name={mapExpanded ? "contract" : "expand"}
              size={24}
              color="#082640"
            />
          </TouchableOpacity>

          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.amLegendDot]} />
              <Text style={styles.legendText}>AM Stops</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.pmLegendDot]} />
              <Text style={styles.legendText}>PM Stops</Text>
            </View>
          </View>
        </Animated.View>

        <ScrollView style={styles.stopsList}>
          {trip?.job?.routes.map((stop: any) => (
            <TouchableOpacity
              key={stop?.id}
              style={[
                styles.stopCard,
                stop?.status === "completed" && styles.completedStopCard,
                stop?.status === "next" && styles.nextStopCard,
                stop?.status === "pending" && styles.pendingStopCard,
              ]}
              onPress={() => handleStopSelect(stop)}
              // disabled={stop?.status !== "next"}
            >
              <View style={styles.stopHeader}>
                <Ionicons
                  name={
                    stop?.status === "completed"
                      ? "checkmark-circle"
                      : "location"
                  }
                  size={20}
                  color={
                    stop?.status === "completed"
                      ? "#4CAF50"
                      : stop?.status === "next"
                      ? "#082640"
                      : "#999"
                  }
                />
                <View>
                  <Text
                    style={[
                      styles.stopName,
                      stop?.status === "completed" && styles.completedStopName,
                      stop?.status === "next" && styles.nextStopName,
                      stop?.status === "pending" && styles.pendingStopName,
                    ]}
                  >
                    {stop?.label}
                  </Text>
                  <Text style={styles.stopAddress}>{stop?.address}</Text>
                  <Text style={styles.stopPhone}>+{stop?.phone}</Text>
                </View>
              </View>

              <View style={styles.stopDetails}>
                <View style={styles.stopDetail}>
                  <Text style={styles.stopDetailLabel}>Scheduled</Text>
                  <Text style={styles.stopDetailValue}>
                    {stop?.scheduledTime}
                  </Text>
                </View>

                <View style={styles.stopDetailDivider} />

                <View style={styles.stopDetail}>
                  <Text style={styles.stopDetailLabel}>Actual</Text>
                  <Text style={styles.stopDetailValue}>
                    {stop?.actualTime ||
                      (stop?.status === "next" ? "Next Stop" : "Pending")}
                  </Text>
                </View>

                <View style={styles.stopDetailDivider} />

                <View style={styles.stopDetail}>
                  <Text style={styles.stopDetailLabel}>Status</Text>
                  <Text
                    style={[
                      styles.stopDetailValue,
                      stop?.status === "completed" &&
                        styles.completedStatusText,
                      stop?.status === "next" && styles.nextStatusText,
                      stop?.status === "pending" && styles.pendingStatusText,
                    ]}
                  >
                    {stop?.status === "completed"
                      ? "Completed"
                      : stop?.status === "next"
                      ? "Next Stop"
                      : "Pending"}
                  </Text>
                </View>
              </View>

              {stop?.status === "next" && (
                <View style={styles.nextStopIndicator}>
                  <Text style={styles.nextStopText}>
                    Tap to start this stop
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#082640" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <BottomTabBar activeTab="Trips" />
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
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  expandMapButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mapLegend: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
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
  amLegendDot: {
    backgroundColor: "#e74c3c",
  },
  pmLegendDot: {
    backgroundColor: "#3498db",
  },
  legendText: {
    fontSize: 12,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  amMarkerBubble: {
    backgroundColor: "#e74c3c",
  },
  pmMarkerBubble: {
    backgroundColor: "#3498db",
  },
  completedMarkerBubble: {
    backgroundColor: "#4CAF50",
  },
  nextMarkerBubble: {
    backgroundColor: "#FFC107",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  stopsList: {
    flex: 1,
  },
  stopCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#ddd",
  },
  completedStopCard: {
    borderLeftColor: "#4CAF50",
    opacity: 0.8,
  },
  nextStopCard: {
    borderLeftColor: "#082640",
    backgroundColor: "#f8fbff",
  },
  pendingStopCard: {
    borderLeftColor: "#ddd",
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  stopAddress: {
    fontSize: 13,
    color: "#888",
    marginLeft: 10,
  },
  stopPhone: {
    fontSize: 13,
    color: "#888",
    marginLeft: 10,
  },
  completedStopName: {
    color: "#4CAF50",
  },
  nextStopName: {
    color: "#082640",
  },
  pendingStopName: {
    color: "#666",
  },
  stopDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  stopDetail: {
    flex: 1,
  },
  stopDetailLabel: {
    fontSize: 12,
    color: "#666",
  },
  stopDetailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  completedStatusText: {
    color: "#4CAF50",
  },
  nextStatusText: {
    color: "#082640",
    fontWeight: "bold",
  },
  pendingStatusText: {
    color: "#999",
  },
  stopDetailDivider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: 10,
  },
  nextStopIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nextStopText: {
    fontSize: 14,
    color: "#082640",
    marginRight: 5,
  },
});
