import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import { api } from "../../utils";
import ScheduleCard from "./ScheduleCard";

function NextSchedule() {
  const { user } = useSelector((state: any) => state.auth);

  // State for storing schedules
  const [nextSchedules, setNextSchedules] = useState<any[]>([]);
  const [uncompletedSchedules, setUncompletedSchedules] = useState<any[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id) return;
      setSchedulesLoading(true);
      setSchedulesError(null);
      try {
        const prev_time = moment("2025-01-01T00:00:00.000Z").toISOString();
        const current_time = moment().toISOString();
        const end_time = moment().add(1, "day").toISOString();
        api
          .get(
            `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
              current_time
            )}&end_time=${encodeURIComponent(end_time)}&status=scheduled`
          )
          .then((res) => setNextSchedules(res.data || []));

        api
          .get(
            `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
              prev_time
            )}&end_time=${encodeURIComponent(current_time)}&status=scheduled`
          )
          .then((res) => setUncompletedSchedules(res.data || []));
      } catch (err) {
        setSchedulesError("Failed to fetch schedules");
        console.error("Error fetching schedules:", err);
      } finally {
        setSchedulesLoading(false);
      }
    };
    fetchSchedules();
  }, [user?.id]);

  const handleScheduleCancelled = () => {
    // Refresh schedules after cancellation by re-running the effect
    // This will trigger a re-fetch of schedules
    const fetchSchedules = async () => {
      if (!user?.id) return;
      setSchedulesLoading(true);
      setSchedulesError(null);
      try {
        const prev_time = moment("2025-01-01T00:00:00.000Z").toISOString();
        const current_time = moment().toISOString();
        const end_time = moment().add(1, "day").toISOString();
        api
          .get(
            `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
              current_time
            )}&end_time=${encodeURIComponent(end_time)}&status=scheduled`
          )
          .then((res) => setNextSchedules(res.data || []));

        api
          .get(
            `/api/schedules?user_id=${user.id}&start_time=${encodeURIComponent(
              prev_time
            )}&end_time=${encodeURIComponent(current_time)}&status=scheduled`
          )
          .then((res) => setUncompletedSchedules(res.data || []));
      } catch (err) {
        setSchedulesError("Failed to fetch schedules");
        console.error("Error fetching schedules:", err);
      } finally {
        setSchedulesLoading(false);
      }
    };
    fetchSchedules();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tripsContainer}>
        <View style={styles.todaysTripHeader}>
          <Text style={styles.todaysTripTitle}>Next Scheduled Trips</Text>
          <TouchableOpacity
            onPress={() => router.push("/(home)/trip-selection")}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {schedulesLoading ? (
          <Text
            style={{ textAlign: "center", color: "#888", marginVertical: 20 }}
          >
            Loading scheduled trips...
          </Text>
        ) : schedulesError ? (
          <EmptyState
            icon="alarm-outline"
            text={schedulesError}
            subtext="Clock in to start tracking your time"
          />
        ) : nextSchedules.length > 0 ? (
          nextSchedules.map((schedule, scheduleIndex) => (
            <ScheduleCard
              key={schedule.id || scheduleIndex}
              schedule={schedule}
              scheduleIndex={scheduleIndex}
              onScheduleCancelled={handleScheduleCancelled}
            />
          ))
        ) : (
          <EmptyState
            icon="alarm-outline"
            text="No scheduled trips"
            subtext=""
          />
        )}
      </View>
      <View style={styles.tripsContainer}>
        <View style={styles.todaysTripHeader}>
          <Text style={styles.todaysTripTitle}>Uncompleted Trips</Text>
          <TouchableOpacity
            onPress={() => router.push("/(home)/trip-selection")}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {schedulesLoading ? (
          <Text
            style={{ textAlign: "center", color: "#888", marginVertical: 20 }}
          >
            Loading uncompleted trips...
          </Text>
        ) : schedulesError ? (
          <EmptyState
            icon="alarm-outline"
            text={schedulesError}
            subtext="Clock in to start tracking your time"
          />
        ) : uncompletedSchedules.length > 0 ? (
          uncompletedSchedules.map((schedule, scheduleIndex) => (
            <ScheduleCard
              key={schedule.id || scheduleIndex}
              schedule={schedule}
              scheduleIndex={scheduleIndex}
              onScheduleCancelled={handleScheduleCancelled}
            />
          ))
        ) : (
          <EmptyState
            icon="alarm-outline"
            text="No uncompleted trips"
            subtext=""
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  tripsContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    backgroundColor: "#ffffff",
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
});

export default NextSchedule;
