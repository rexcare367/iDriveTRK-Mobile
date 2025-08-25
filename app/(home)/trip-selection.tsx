import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import { updateClockInForm } from "../../redux/actions/driverActions";
import { api } from "../../utils";

interface Schedule {
  id: string;
  start_time: string;
  end_time: string;
  period: "AM" | "PM";
  job?: {
    name: string;
    description: string;
  };
  scheduler: {
    id: string;
  };
}

export default function TripSelectionScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { clockInFormData } = useSelector((state: any) => state.driver);
  const { routeName } = params;

  // Fetch schedules for the current user for today
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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
        console.log("=====", response.data);
        setSchedules(response.data || []);
      } catch (err) {
        setSchedulesError("Failed to fetch schedules");
        console.error("Error fetching schedules:", err);
      } finally {
        setSchedulesLoading(false);
      }
    };
    fetchSchedules();
  }, [user?.id]);

  const handleBack = () => {
    router.back();
  };

  const handleTripDetailView = (trip: Schedule) => {
    router.push({
      pathname: "/(trips)/trip-details-history",
      params: {
        tripId: trip.id,
      },
    });
  };

  const handleTripSelect = (trip: Schedule) => {
    dispatch(
      updateClockInForm({
        ...clockInFormData,
        scheduleId: trip.id,
        schedulerId: trip.scheduler.id,
      })
    );

    router.push("/(home)/vehicle-selection");
  };

  const handleTabPress = (tabName: string) => {
    // Handle tab press if needed
    console.log("Tab pressed:", tabName);
  };

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <Header title="Select Trip" subtitle="Choose your trip for today" />

      <View style={styles.content}>
        <ScrollView style={styles.tripList}>
          <Text
            style={{ fontWeight: "bold", fontSize: 18, marginVertical: 12 }}
          >
            Today&apos;s Schedules
          </Text>
          {schedulesLoading && (
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ color: "#888", marginTop: 6 }}>
                Loading schedules...
              </Text>
            </View>
          )}
          {schedulesError && (
            <Text style={{ color: "red", marginBottom: 10 }}>
              {schedulesError}
            </Text>
          )}
          {schedules.length === 0 && !schedulesLoading && !schedulesError && (
            <Text style={{ color: "#888", marginBottom: 10 }}>
              No schedules found for today.
            </Text>
          )}
          {schedules.map((schedule) => {
            const startTime = schedule.start_time
              ? moment(schedule.start_time)
              : null;
            const endTime = schedule.end_time
              ? moment(schedule.end_time)
              : null;
            const tripId = schedule.id.split("-")[0];
            return (
              <TouchableOpacity
                key={schedule.id}
                style={styles.tripCard}
                onPress={() => handleTripSelect(schedule)}
              >
                <View style={styles.tripHeader}>
                  <Ionicons
                    name={schedule.period === "AM" ? "sunny" : "moon"}
                    size={20}
                    color={schedule.period === "AM" ? "#FFD700" : "#082640"}
                  />
                  <Text style={styles.tripName}>
                    {startTime && endTime
                      ? `${startTime.format("h:mm A")} - ${endTime.format(
                          "h:mm A"
                        )}`
                      : "Time not available"}
                  </Text>
                  <View style={styles.tripNameBadge}>
                    <Text style={styles.tripNameBadgeText}>
                      {schedule?.job?.name}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripDescription}>
                  {schedule?.job?.description}
                </Text>

                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <Text style={styles.tripDetailLabel}>Trip ID</Text>
                    <Text style={styles.tripDetailValue}>#{tripId}</Text>
                  </View>

                  <View style={styles.tripDetailDivider} />

                  <View style={styles.tripDetail}>
                    <Text style={styles.tripDetailLabel}>Period</Text>
                    <Text style={styles.tripDetailValue}>
                      {startTime && endTime
                        ? `${endTime.diff(startTime, "minutes")} min`
                        : "N/A"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewDetailButton}
                  onPress={() => handleTripDetailView(schedule)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="eye-outline"
                      size={18}
                      color="white"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.viewDetailButtonText}>View Detail</Text>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <BottomTabBar activeTab="Home" onTabPress={handleTabPress} />
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
  tripList: {
    flex: 1,
  },
  tripCard: {
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
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  tripDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  tripDetails: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
    paddingBottom: 10,
  },
  tripDetail: {
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 12,
    color: "#666",
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  tripDetailDivider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: 10,
  },
  viewDetailButton: {
    marginTop: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewDetailButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  tripNameBadge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  tripNameBadgeText: {
    color: "#1967D2",
    fontSize: 14,
    fontWeight: "600",
  },
});
