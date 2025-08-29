import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../utils";

interface ScheduleCardProps {
  schedule: any;
  scheduleIndex: number;
  onScheduleCancelled?: () => void;
}

function ScheduleCard({
  schedule,
  scheduleIndex,
  onScheduleCancelled,
}: ScheduleCardProps) {
  const [showRoutes, setShowRoutes] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const job = schedule.job || {};
  const scheduler = schedule.scheduler || {};
  const tripName = job.name || scheduler.title || "Trip";
  const description = job.description || "";
  const startTime = schedule.start_time ? moment(schedule.start_time) : null;
  const endTime = schedule.end_time ? moment(schedule.end_time) : null;
  const timeStr =
    startTime && endTime
      ? `${startTime.format("MMM-DD h:mm A")} - ${endTime.format("h:mm A")}`
      : "";
  const stops = Array.isArray(job.routes) ? job.routes : [];
  const distance = job.driving_distance ? `${job.driving_distance} km` : "";

  const handleCancelSchedule = async () => {
    setIsCancelling(true);
    try {
      await api.patch(`/api/schedules/${schedule.id}`, {
        status: "cancelled",
      });

      // Reset button state and show success message
      setShowCancelConfirm(false);
      Alert.alert("Success", "Schedule cancelled successfully");

      // Call the refresh callback to update the parent component
      if (onScheduleCancelled) {
        onScheduleCancelled();
      }
    } catch (error) {
      console.error("Failed to cancel schedule:", error);
      Alert.alert("Error", "Failed to cancel schedule. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelButtonPress = () => {
    if (showCancelConfirm) {
      handleCancelSchedule();
    } else {
      setShowCancelConfirm(true);
    }
  };

  return (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripHeaderLeft}>
          <Text style={styles.tripName}>{tripName}</Text>
          {timeStr && (
            <View style={styles.tripTime}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.tripTimeText}>{timeStr}</Text>
            </View>
          )}
        </View>
        <View style={styles.tripHeaderRight}>
          <TouchableOpacity
            style={styles.routesToggleButton}
            onPress={() => setShowRoutes(!showRoutes)}
          >
            <Ionicons name="map-outline" size={18} color="#082640" />
          </TouchableOpacity>
        </View>
      </View>

      {description ? (
        <Text style={styles.tripDescription}>{description}</Text>
      ) : null}

      {showRoutes && stops.length > 0 && (
        <View style={styles.tripStops}>
          {stops.map((stop: any, index: number) => (
            <View key={index} style={styles.tripStop}>
              <View style={styles.stopDot} />
              <Text style={styles.stopName}>{stop.label}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.tripMeta}>
        {distance && (
          <View style={styles.tripMetaItem}>
            <Ionicons name="speedometer-outline" size={14} color="#666" />
            <Text style={styles.tripMetaText}>{distance}</Text>
          </View>
        )}
        {startTime && endTime && (
          <View style={styles.tripMetaItem}>
            <Ionicons name="hourglass-outline" size={14} color="#666" />
            <Text style={styles.tripMetaText}>{`${endTime.diff(
              startTime,
              "minutes"
            )} min`}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            showCancelConfirm && styles.confirmButton,
          ]}
          onPress={handleCancelButtonPress}
          disabled={isCancelling}
        >
          <View style={styles.buttonContent}>
            {isCancelling ? (
              <>
                <Ionicons name="hourglass-outline" size={16} color="white" />
                <Text style={styles.cancelButtonText}>Cancelling...</Text>
              </>
            ) : showCancelConfirm ? (
              <>
                <Ionicons name="checkmark" size={16} color="white" />
                <Text style={styles.cancelButtonText}>Confirm Cancel</Text>
              </>
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={16} color="white" />
                <Text style={styles.cancelButtonText}>Cancel Trip</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewTripButton}
          onPress={() =>
            router.push({
              pathname: "./trip-details",
              params: {
                tripId: schedule.id,
                tripName: schedule.name,
                isAssigned: "false",
              },
            })
          }
        >
          <View style={styles.buttonContent}>
            <Text style={styles.viewTripButtonText}>View Detail</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tripCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tripHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  tripHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 6,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripTimeText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#666",
    fontWeight: "500",
  },
  tripDescription: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 12,
    lineHeight: 20,
  },
  routesToggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f7fafc",
  },
  tripStops: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tripStop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3182ce",
    marginRight: 12,
  },
  stopName: {
    fontSize: 14,
    color: "#2d3748",
    fontWeight: "500",
  },
  tripMeta: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  tripMetaText: {
    fontSize: 13,
    color: "#4a5568",
    marginLeft: 6,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#F64848",
    flex: 1,
    minHeight: 44,
  },
  confirmButton: {
    backgroundColor: "#28a745",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  viewTripButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#333",
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  viewTripButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginRight: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScheduleCard;
