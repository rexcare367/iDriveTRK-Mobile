import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import { api } from "../../utils";

function NextSchedule() {
  const { user } = useSelector((state: any) => state.auth);

  // State for storing schedules
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id) return;
      setSchedulesLoading(true);
      setSchedulesError(null);
      try {
        const start_time = moment().toISOString();
        const end_time = moment().add(1, "day").toISOString();
        const response = await api.get(
          `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
            start_time
          )}&end_time=${encodeURIComponent(end_time)}&status=scheduled`
        );
        console.log("response.data", response.data);
        setAllSchedules(response.data || []);
      } catch (err) {
        setSchedulesError("Failed to fetch schedules");
        console.error("Error fetching schedules:", err);
      } finally {
        setSchedulesLoading(false);
      }
    };
    fetchSchedules();
  }, [user?.id]);

  return (
    <View style={styles.todaysTripContainer}>
      <View style={styles.todaysTripHeader}>
        <Text style={styles.todaysTripTitle}>Next Scheduled Trip</Text>
        <TouchableOpacity onPress={() => router.push("/(home)/trip-selection")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {schedulesLoading ? (
        <Text
          style={{ textAlign: "center", color: "#888", marginVertical: 20 }}
        >
          Loading assigned trips...
        </Text>
      ) : schedulesError ? (
        <EmptyState
          icon="alarm-outline"
          text={schedulesError}
          subtext="Clock in to start tracking your time"
        />
      ) : allSchedules.length > 0 ? (
        (() => {
          const schedule = allSchedules[0];
          const job = schedule.job || {};
          const scheduler = schedule.scheduler || {};
          const tripName = job.name || scheduler.title || "Trip";
          const description = job.description || "";
          const startTime = schedule.start_time
            ? moment(schedule.start_time)
            : null;
          const endTime = schedule.end_time ? moment(schedule.end_time) : null;
          const timeStr =
            startTime && endTime
              ? `${startTime.format("h:mm A")} - ${endTime.format("h:mm A")}`
              : "";
          const stops = Array.isArray(job.routes) ? job.routes : [];
          const distance = job.driving_distance
            ? `${job.driving_distance} km`
            : "";
          return (
            <View style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripName}>{tripName}</Text>
                <View style={styles.tripTime}>
                  <Ionicons name="time-outline" size={16} color="#082640" />
                  <Text style={styles.tripTimeText}>{timeStr}</Text>
                </View>
              </View>
              {description ? (
                <Text style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                  {description}
                </Text>
              ) : null}
              {stops.length > 0 && (
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
                    <Ionicons
                      name="speedometer-outline"
                      size={14}
                      color="#666"
                    />
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
                <Text style={styles.viewTripButtonText}>View Trip Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#082640" />
              </TouchableOpacity>
            </View>
          );
        })()
      ) : (
        <EmptyState
          icon="alarm-outline"
          text="No assigned trips for today."
          subtext="Clock in to start tracking your time"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todaysTripContainer: {
    marginBottom: 20,
  },
  todaysTripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  todaysTripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    color: "#082640",
  },
  tripCard: {
    backgroundColor: "#f8fbff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0eaf9",
  },
  tripHeader: {
    marginBottom: 10,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  tripTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripTimeText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#082640",
    fontWeight: "500",
  },
  tripStops: {
    marginBottom: 10,
  },
  tripStop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#082640",
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
  },
  tripMeta: {
    flexDirection: "row",
    marginBottom: 15,
  },
  tripMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  tripMetaText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  viewTripButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0eaf9",
  },
  viewTripButtonText: {
    fontSize: 14,
    color: "#082640",
    fontWeight: "500",
    marginRight: 5,
  },
});

export default NextSchedule;
